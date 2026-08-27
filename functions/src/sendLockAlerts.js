/**
 * T-15 lock alerts — Cloud Scheduler path.
 *
 * GitHub Actions 5-min cron silently dropped for hours (2026-08-27 Barcelona
 * TOP lock: last safety-net run 12:08 PM ET, T-15 at 2:45 PM). Fetch loop can
 * also cancel across freeze. This function runs every 2 minutes on GCP
 * Cloud Scheduler and does not depend on Actions staying alive.
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const { createHash } = require('crypto');

const T_MINUS_15_MIN_MS = 15 * 60 * 1000;
const GRACE_AFTER_COMMENCE_MS = 20 * 60 * 1000;
const CLAIM_TTL_MS = 2 * 60 * 1000;
const PUSH_TTL_SEC = 7200;
const LOCK_ALERT_EDGE_MIN = 11;
const APP_ID = process.env.ONESIGNAL_APP_ID || 'd8fcb504-8d29-4354-a9e4-8b612d3eafeb';
const SITE_URL = 'https://nhlsavant.com/#/';
const HEARTBEAT_PATH = { col: 'ops', id: 'lockAlertHeartbeat' };

const COLLECTIONS = [
  { name: 'sharpFlowPicks', market: 'ML' },
  { name: 'sharpFlowSpreads', market: 'SPREAD' },
  { name: 'sharpFlowTotals', market: 'TOTAL' },
];

function restKey() {
  return process.env.ONESIGNAL_REST_API_KEY || '';
}

function etHour(now = new Date()) {
  const hour = Number(
    now.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }),
  );
  return Number.isFinite(hour) ? hour : -1;
}

function etDate(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function commenceMs(val) {
  if (val == null) return null;
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val._seconds === 'number') return val._seconds * 1000;
  if (val instanceof Date) return val.getTime();
  if (typeof val === 'string') {
    const t = new Date(val).getTime();
    return Number.isFinite(t) ? t : null;
  }
  return null;
}

function claimTimestampMs(val) {
  return commenceMs(val);
}

function sideStakeUnits(sd) {
  const u = Number(sd?.finalUnits ?? sd?.v8_finalUnits ?? sd?.v8_agsV12UnitsApplied);
  return Number.isFinite(u) ? u : 0;
}

function isStakedLockedSide(sd) {
  if (!sd || sd.superseded) return false;
  if (sd.lockStage !== 'LOCKED') return false;
  const tier = typeof sd.v8_hcStakeTier === 'string' ? sd.v8_hcStakeTier : '';
  if (tier === 'MONITORING' || tier === 'FADE') return false;
  if (!(sideStakeUnits(sd) > 0)) return false;
  const health = sd.health?.status || sd.status;
  if (health === 'MUTED' || health === 'CANCELLED' || health === 'COMPLETED') return false;
  return true;
}

function sideLockAlertEdge(sd, priorAg = 50) {
  if (!sd) return null;
  if (Number.isFinite(sd.v8_winnerAlignEdge)) return Number(sd.v8_winnerAlignEdge);
  if (Number.isFinite(sd.v8_winnerAlignMeanFor)) {
    const ag = Number.isFinite(sd.v8_winnerAlignMeanAg)
      ? Number(sd.v8_winnerAlignMeanAg)
      : priorAg;
    return Number(sd.v8_winnerAlignMeanFor) - ag;
  }
  return null;
}

function onesignalFiltersForEdge(edge) {
  const filters = [
    { field: 'tag', key: 'paid', relation: '=', value: 'all' },
    { operator: 'OR' },
    { field: 'tag', key: 'paid', relation: '=', value: 'true' },
  ];
  if (Number.isFinite(edge) && edge >= LOCK_ALERT_EDGE_MIN) {
    filters.push({ operator: 'OR' });
    filters.push({ field: 'tag', key: 'paid', relation: '=', value: 'edge11' });
  }
  return filters;
}

function pickLabel(pick, sideKey, market) {
  const sd = pick.sides?.[sideKey] || {};
  const team =
    sd.peak?.team ||
    sd.lock?.team ||
    (sideKey === 'away' ? pick.away : sideKey === 'home' ? pick.home : sideKey);
  const line = sd.peak?.line ?? sd.lock?.line;
  if (market === 'TOTAL' && (sideKey === 'over' || sideKey === 'under')) {
    const mkt = sideKey === 'over' ? 'Over' : 'Under';
    const lineStr = line != null ? ` ${line}` : '';
    return `${pick.away || ''} @ ${pick.home || ''} ${mkt}${lineStr}`.replace(/\s+/g, ' ').trim();
  }
  if (market === 'SPREAD') {
    const lineStr = line != null ? ` ${Number(line) > 0 ? '+' : ''}${line}` : '';
    return `${team || sideKey}${lineStr}`.replace(/\s+/g, ' ').trim();
  }
  return `${team || sideKey} ML`.trim();
}

function formatUnits(u) {
  if (!Number.isFinite(u) || u <= 0) return null;
  const n = Math.round(u * 100) / 100;
  return Number.isInteger(n) ? `${n}u` : `${n}u`;
}

function lockAlertIdempotencyKey(col, docId, sideKey, date) {
  const hash = createHash('sha1')
    .update('lock-alert.nhlsavant.com')
    .update(`${date}|${col}|${docId}|${sideKey}`)
    .digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.subarray(0, 16).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function hasFreshClaim(sd, now) {
  const ms = claimTimestampMs(sd?.lockAlertClaimAt);
  return ms != null && now - ms < CLAIM_TTL_MS;
}

async function claimLockAlert(db, col, docId, sideKey, now) {
  const ref = db.collection(col).doc(docId);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return false;
    const sd = snap.data()?.sides?.[sideKey];
    if (!sd) return false;
    if (sd.lockAlertSentAt) return false;
    if (hasFreshClaim(sd, now)) return false;
    tx.set(
      ref,
      { sides: { [sideKey]: { lockAlertClaimAt: now } } },
      { merge: true },
    );
    return true;
  });
}

async function releaseLockAlertClaim(db, col, docId, sideKey) {
  await db
    .collection(col)
    .doc(docId)
    .set(
      {
        sides: {
          [sideKey]: { lockAlertClaimAt: admin.firestore.FieldValue.delete() },
        },
      },
      { merge: true },
    );
}

async function sendOneSignal({ pickText, tierText, unitsText, edge, idempotencyKey, topic }) {
  const key = restKey();
  if (!key) throw new Error('ONESIGNAL_REST_API_KEY is not set');
  const isTop = Number.isFinite(edge) && edge >= LOCK_ALERT_EDGE_MIN;
  const contentsEn = tierText
    ? `${pickText} just locked — ${tierText}. ~15 min to gametime.`
    : `${pickText} just locked — ~15 min to gametime. Tap for the card.`;
  const body = {
    app_id: APP_ID,
    target_channel: 'push',
    custom_data: {
      pick: pickText,
      units: unitsText || '',
      edge: Number.isFinite(edge) ? String(edge) : '',
      lockMode: isTop ? 'edge11+' : 'all',
    },
    contents: { en: contentsEn },
    headings: { en: isTop ? 'Sharp Flow · Top lock' : 'Sharp Flow · Locked' },
    url: SITE_URL,
    ttl: PUSH_TTL_SEC,
    priority: 10,
    web_push_topic: topic,
    name: `Lock: ${pickText}`.slice(0, 128),
    filters: onesignalFiltersForEdge(edge),
  };

  const res = await fetch('https://api.onesignal.com/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${key}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.errors ? JSON.stringify(json.errors) : res.statusText;
    throw new Error(`OneSignal ${res.status}: ${msg}`);
  }
  if (json.errors && !json.id) {
    throw new Error(`OneSignal rejected: ${JSON.stringify(json.errors)}`);
  }
  return json;
}

async function writeHeartbeat(db, payload) {
  await db
    .collection(HEARTBEAT_PATH.col)
    .doc(HEARTBEAT_PATH.id)
    .set(
      {
        ...payload,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

async function runLockAlerts({ forceWindow = false } = {}) {
  const db = admin.firestore();
  const now = Date.now();
  const date = etDate(new Date(now));
  const hour = etHour(new Date(now));
  const stats = {
    date,
    examined: 0,
    sent: 0,
    claimed: 0,
    skipped_not_frozen: 0,
    skipped_started: 0,
    skipped_already: 0,
    skipped_claimed: 0,
    skipped_no_commence: 0,
    errors: 0,
    source: 'cloud_scheduler',
  };

  // Same daytime window as the Actions safety net (9am–midnight ET).
  if (!forceWindow && (hour < 9 || hour > 23)) {
    stats.skipped_hours = true;
    await writeHeartbeat(db, { ...stats, lastRunAt: now, lastRunIso: new Date(now).toISOString() });
    return stats;
  }

  if (!restKey()) {
    stats.errors = 1;
    stats.error = 'ONESIGNAL_REST_API_KEY missing';
    logger.error(stats.error);
    await writeHeartbeat(db, { ...stats, lastRunAt: now, lastRunIso: new Date(now).toISOString() });
    throw new Error(stats.error);
  }

  for (const { name: col, market } of COLLECTIONS) {
    const snap = await db.collection(col).where('date', '==', date).get();
    for (const docSnap of snap.docs) {
      const pick = { _id: docSnap.id, ...docSnap.data() };
      if (pick.status === 'COMPLETED') continue;
      const ct = commenceMs(pick.commenceTime);
      const sides = pick.sides || {};

      for (const [sideKey, sd] of Object.entries(sides)) {
        stats.examined++;
        if (!isStakedLockedSide(sd)) continue;
        if (sd.lockAlertSentAt) {
          stats.skipped_already++;
          continue;
        }
        if (ct == null) {
          stats.skipped_no_commence++;
          logger.warn(`LOCKED ${col}/${pick._id} ${sideKey} has no commenceTime`);
          continue;
        }
        if (now < ct - T_MINUS_15_MIN_MS) {
          stats.skipped_not_frozen++;
          continue;
        }
        if (now > ct + GRACE_AFTER_COMMENCE_MS) {
          stats.skipped_started++;
          continue;
        }

        const claimed = await claimLockAlert(db, col, pick._id, sideKey, now);
        if (!claimed) {
          stats.skipped_claimed++;
          continue;
        }
        stats.claimed++;

        const pickText = pickLabel(pick, sideKey, market);
        const units = sideStakeUnits(sd);
        const unitsText = formatUnits(units);
        const tier = typeof sd.v8_hcStakeTier === 'string' ? sd.v8_hcStakeTier : '';
        const tierText = [tier || null, unitsText].filter(Boolean).join(' · ');
        const edge = sideLockAlertEdge(sd);
        const idempotencyKey = lockAlertIdempotencyKey(col, pick._id, sideKey, date);
        const topic = `lock-${date}-${pick._id}-${sideKey}`.slice(0, 64);

        try {
          const result = await sendOneSignal({
            pickText,
            tierText,
            unitsText,
            edge,
            idempotencyKey,
            topic,
          });
          const messageId = result.id || null;
          await db
            .collection(col)
            .doc(pick._id)
            .set(
              {
                sides: {
                  [sideKey]: {
                    lockAlertSentAt: now,
                    lockAlertMessageId: messageId,
                    lockAlertEdge: Number.isFinite(edge) ? edge : null,
                    lockAlertClaimAt: admin.firestore.FieldValue.delete(),
                    lockAlertSource: 'cloud_scheduler',
                  },
                },
                lastAction: 'lock_alert_sent',
              },
              { merge: true },
            );
          stats.sent++;
          logger.info(`sent ${col}/${pick._id} ${sideKey} message=${messageId} recipients=${result.recipients ?? '?'}`);
        } catch (err) {
          stats.errors++;
          logger.error(`send failed ${col}/${pick._id} ${sideKey}: ${err.message || err}`);
          try {
            await releaseLockAlertClaim(db, col, pick._id, sideKey);
          } catch (releaseErr) {
            logger.error(`claim release failed: ${releaseErr.message || releaseErr}`);
          }
        }
      }
    }
  }

  await writeHeartbeat(db, { ...stats, lastRunAt: now, lastRunIso: new Date(now).toISOString() });
  return stats;
}

exports.sendLockAlerts = onSchedule(
  {
    schedule: 'every 2 minutes',
    timeZone: 'America/New_York',
    memory: '256MiB',
    timeoutSeconds: 120,
    maxInstances: 1,
  },
  async () => {
    logger.info('sendLockAlerts scheduler tick');
    const stats = await runLockAlerts();
    logger.info('sendLockAlerts done', stats);
    return stats;
  },
);

exports.triggerLockAlerts = onRequest(async (req, res) => {
  const token = String(req.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
    || String(req.query.key || '').trim();
  if (!restKey() || token !== restKey()) {
    res.status(401).json({ ok: false, error: 'unauthorized' });
    return;
  }
  try {
    const stats = await runLockAlerts({ forceWindow: true });
    res.status(200).json({ ok: true, stats });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

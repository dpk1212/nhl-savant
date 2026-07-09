/**
 * sendLockAlerts.mjs — Push paid users when a LOCKED pick freezes at T−15.
 *
 * Runs after syncPickStateAuthoritative in the market cron. For each live
 * side with lockStage=LOCKED that has entered the T−15 freeze window and
 * has not yet been alerted, sends OneSignal push filtered to tag paid=true.
 *
 * Usage:
 *   node scripts/sendLockAlerts.mjs
 *   node scripts/sendLockAlerts.mjs --dry-run
 *   node scripts/sendLockAlerts.mjs --date=2026-07-09
 *   # Owner-only test (no Firestore stamp; never hits paid=true audience):
 *   node scripts/sendLockAlerts.mjs --test-owner --force
 *   node scripts/sendLockAlerts.mjs --test-owner --force --side=2026-07-09_SOC_mar_fra:home
 *
 * Env:
 *   ONESIGNAL_APP_ID (default: NHL Savant prod app)
 *   ONESIGNAL_REST_API_KEY (required for live sends)
 *   FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY / VITE_FIREBASE_PROJECT_ID
 *   or serviceAccountKey.json
 */

import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  AGS_V12_DISPLAY_TIERS,
  AGS_V12_PATH_TO_DISPLAY,
  AGS_V12_STAKE_TIER_META,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

// Load functions/.env for local OneSignal REST key (not committed to root .env).
if (existsSync(join(REPO_ROOT, 'functions', '.env'))) {
  loadEnv({ path: join(REPO_ROOT, 'functions', '.env'), override: false });
}

const T_MINUS_15_MIN_MS = 15 * 60 * 1000;
const TEMPLATE_ID = '451e41a3-2bdf-4758-a779-ec59a8fecf36';
const APP_ID = process.env.ONESIGNAL_APP_ID || 'd8fcb504-8d29-4354-a9e4-8b612d3eafeb';
const REST_KEY = process.env.ONESIGNAL_REST_API_KEY || '';
const SITE_URL = 'https://nhlsavant.com/#/';
/** Owner Firebase uid — External ID for OneSignal owner-only tests. */
const OWNER_UID = 'TJs6JFr8JxXRzCsMmNMC8MIOtYw2';

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const TEST_OWNER = argv.includes('--test-owner');
const FORCE = argv.includes('--force');
const dateArg = argv.find((a) => a.startsWith('--date='));
const sideArg = argv.find((a) => a.startsWith('--side='));
const TARGET_DATE = dateArg
  ? dateArg.split('=')[1]
  : new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const FORCE_SIDE = sideArg ? sideArg.split('=').slice(1).join('=') : null; // docId:sideKey

const COLLECTIONS = [
  { name: 'sharpFlowPicks', market: 'ML' },
  { name: 'sharpFlowSpreads', market: 'SPREAD' },
  { name: 'sharpFlowTotals', market: 'TOTAL' },
];

function commenceMs(val) {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val._seconds === 'number') return val._seconds * 1000;
  if (val instanceof Date) return val.getTime();
  if (typeof val === 'string') {
    const t = new Date(val).getTime();
    return Number.isFinite(t) ? t : null;
  }
  return null;
}

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))),
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: process.env.VITE_FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
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
    const lineStr = line != null ? ` ${line > 0 ? '+' : ''}${line}` : '';
    return `${team || sideKey}${lineStr}`.replace(/\s+/g, ' ').trim();
  }
  return `${team || sideKey} ML`.trim();
}

/** Units actually at risk on the Locked Picks board (v12 stake). */
function sideStakeUnits(sd) {
  const u = Number(sd?.finalUnits ?? sd?.v8_finalUnits ?? sd?.v8_agsV12UnitsApplied);
  return Number.isFinite(u) ? u : 0;
}

/**
 * Only alert plays that are real staked locks on the board — same bar as
 * Locked Picks (finalUnits > 0 + a product stake tier). Blocks ghost LOCKED
 * sides (legacy v9 totals, MONITORING 0u, FADE) that used to ping everyone.
 */
function isStakedLockedSide(sd) {
  if (!sd || sd.superseded) return false;
  if (sd.lockStage !== 'LOCKED') return false;
  const tier = typeof sd.v8_hcStakeTier === 'string' ? sd.v8_hcStakeTier : null;
  if (!tier || tier === 'MONITORING' || tier === 'FADE') return false;
  if (!AGS_V12_PATH_TO_DISPLAY[tier]) return false;
  if (!(sideStakeUnits(sd) > 0)) return false;
  const health = sd.health?.status || sd.status;
  if (health === 'MUTED' || health === 'CANCELLED' || health === 'COMPLETED') return false;
  return true;
}

function isAlertableSide(sd) {
  if (!isStakedLockedSide(sd)) return false;
  if (!TEST_OWNER && sd.lockAlertSentAt) return false;
  return true;
}

/**
 * Parse display-tier Win % from DAILY_AGSU_REPORT.md (same table as Tier Performance).
 * Returns Map displayKey → { label, winPct, record } e.g. MAX → { label:'MAX PLAY', winPct:77.8, record:'7-2' }
 */
function loadDisplayTierWinRates() {
  const reportPath = join(REPO_ROOT, 'DAILY_AGSU_REPORT.md');
  const out = new Map();
  if (!existsSync(reportPath)) return out;
  const md = readFileSync(reportPath, 'utf8');
  const start = md.indexOf('### v12abc — By Stake Tier');
  if (start < 0) return out;
  const chunk = md.slice(start, start + 2500);
  for (const dt of AGS_V12_DISPLAY_TIERS) {
    // Row like: | MAX PLAY (SUPER) ... | 77.8% |
    const re = new RegExp(
      `\\|\\s*${dt.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^|]*\\|[^|]*\\|[^|]*\\|\\s*([\\d-]+)\\s*\\|\\s*([\\d.]+)%`,
    );
    const m = chunk.match(re);
    if (m) {
      out.set(dt.key, {
        label: dt.label,
        record: m[1].trim(),
        winPct: Number(m[2]),
      });
    }
  }
  return out;
}

function tierLineForSide(sd, tierStats) {
  const path = typeof sd?.v8_hcStakeTier === 'string' ? sd.v8_hcStakeTier : null;
  if (!path) return null;
  const displayKey = AGS_V12_PATH_TO_DISPLAY[path];
  if (!displayKey) return null;
  const meta = AGS_V12_STAKE_TIER_META[path];
  const label = meta?.label || displayKey;
  const stats = tierStats.get(displayKey);
  if (stats && Number.isFinite(stats.winPct)) {
    return {
      label: stats.label || label,
      winPct: stats.winPct,
      record: stats.record || null,
      text: `${stats.label || label} · ${stats.winPct.toFixed(1)}% WR`,
    };
  }
  return { label, winPct: null, record: null, text: label };
}

function buildContents({ pickText, tier }) {
  if (tier?.winPct != null) {
    return `${pickText} just locked — ${tier.text}. ~15 min to gametime.`;
  }
  if (tier?.text) {
    return `${pickText} just locked — ${tier.text}. ~15 min to gametime.`;
  }
  return `${pickText} just locked — ~15 min to gametime. Tap for the card.`;
}

async function sendOneSignal({ pickText, detail, tier }) {
  if (!REST_KEY) {
    throw new Error('ONESIGNAL_REST_API_KEY is not set');
  }
  const contentsEn = buildContents({ pickText, tier });
  // Do NOT use template_id for the body. The dashboard template
  // ("{{pick}} just locked — ~15 min…") was winning over contents and
  // stripping tier WR. Send headings/contents explicitly; keep custom_data
  // for analytics / future template use.
  const body = {
    app_id: APP_ID,
    target_channel: 'push',
    custom_data: {
      pick: pickText,
      detail: detail || '',
      tier: tier?.label || '',
      tierWinPct: tier?.winPct != null ? String(tier.winPct) : '',
      tierRecord: tier?.record || '',
      templateId: TEMPLATE_ID, // reference only — not applied
    },
    contents: { en: contentsEn },
    headings: { en: 'Sharp Flow · Locked' },
    url: SITE_URL,
    ttl: 900,
    name: `${TEST_OWNER ? 'TEST ' : ''}Lock: ${pickText}`.slice(0, 128),
  };

  if (TEST_OWNER) {
    // Owner-only — never use paid=true filter for tests.
    body.include_aliases = { external_id: [OWNER_UID] };
  } else {
    body.filters = [{ field: 'tag', key: 'paid', relation: '=', value: 'true' }];
  }

  const res = await fetch('https://api.onesignal.com/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${REST_KEY}`,
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

async function main() {
  const now = Date.now();
  console.log(`\n=== sendLockAlerts — ${TARGET_DATE} ===`);
  console.log(
    `Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}${TEST_OWNER ? ' · TEST-OWNER only' : ''} · app ${APP_ID}`,
  );
  if (TEST_OWNER) {
    console.log(`Audience: external_id=${OWNER_UID} (no paid=true, no Firestore stamp)`);
  }
  if (FORCE) console.log('Force: ignore T−15 window / already-sent (test path)');

  if (!DRY_RUN && !REST_KEY) {
    console.error('Missing ONESIGNAL_REST_API_KEY — aborting (use --dry-run to inspect only)');
    process.exit(1);
  }

  const tierStats = loadDisplayTierWinRates();
  console.log(
    'Tier WR loaded:',
    [...tierStats.entries()].map(([k, v]) => `${k}=${v.winPct}%`).join(', ') || '(none)',
  );

  const db = initFirebase();
  const stats = {
    examined: 0,
    candidates: 0,
    sent: 0,
    skipped_not_frozen: 0,
    skipped_started: 0,
    skipped_already: 0,
    skipped_not_locked: 0,
    skipped_unstaked: 0,
    skipped_force_filter: 0,
    errors: 0,
  };

  for (const { name: col, market } of COLLECTIONS) {
    const snap = await db.collection(col).where('date', '==', TARGET_DATE).get();
    for (const docSnap of snap.docs) {
      const pick = { _id: docSnap.id, ...docSnap.data() };
      if (pick.status === 'COMPLETED') continue;
      const ct = commenceMs(pick.commenceTime);
      const sides = pick.sides || {};

      for (const [sideKey, sd] of Object.entries(sides)) {
        stats.examined++;
        if (!sd || sd.superseded) continue;
        if (sd.lockStage !== 'LOCKED') {
          stats.skipped_not_locked++;
          continue;
        }
        if (!isStakedLockedSide(sd)) {
          stats.skipped_unstaked++;
          continue;
        }
        if (!TEST_OWNER && sd.lockAlertSentAt) {
          stats.skipped_already++;
          continue;
        }
        if (!isAlertableSide(sd)) continue;

        if (FORCE_SIDE) {
          const want = `${pick._id}:${sideKey}`;
          if (want !== FORCE_SIDE) {
            stats.skipped_force_filter++;
            continue;
          }
        }

        if (!FORCE) {
          if (ct == null) {
            console.warn(`  ⚠ ${col}/${pick._id} ${sideKey}: LOCKED but no commenceTime — skip`);
            continue;
          }
          if (now < ct - T_MINUS_15_MIN_MS) {
            stats.skipped_not_frozen++;
            continue;
          }
          if (now > ct) {
            stats.skipped_started++;
            continue;
          }
        }

        stats.candidates++;
        const pickText = pickLabel(pick, sideKey, market);
        const tier = tierLineForSide(sd, tierStats);
        const detail = tier?.text ? ` ${tier.text}.` : ' Open Sharp Flow.';
        const preview = buildContents({ pickText, tier });
        console.log(`  → ${DRY_RUN ? 'WOULD SEND' : 'SEND'} ${col}/${pick._id} ${sideKey}`);
        console.log(`     path=${sd.v8_hcStakeTier || '—'} · ${preview}`);

        if (DRY_RUN) continue;

        try {
          const result = await sendOneSignal({ pickText, detail, tier });
          const messageId = result.id || null;
          // Never stamp Firestore on owner-only tests — production cron still owns idempotency.
          if (!TEST_OWNER) {
            await db
              .collection(col)
              .doc(pick._id)
              .set(
                {
                  sides: {
                    [sideKey]: {
                      lockAlertSentAt: now,
                      lockAlertMessageId: messageId,
                    },
                  },
                  lastAction: 'lock_alert_sent',
                },
                { merge: true },
              );
          }
          stats.sent++;
          console.log(`    ✓ message ${messageId || '(no id)'} recipients=${result.recipients ?? '?'}`);
        } catch (err) {
          stats.errors++;
          console.error(`    ✗ ${err.message || err}`);
        }

        // Owner test: send at most one notification.
        if (TEST_OWNER && stats.sent > 0) {
          console.log('\n--- summary ---');
          console.log(JSON.stringify(stats, null, 2));
          return;
        }
      }
    }
  }

  console.log('\n--- summary ---');
  console.log(JSON.stringify(stats, null, 2));
  if (stats.errors > 0) process.exitCode = 1;
  if (TEST_OWNER && !DRY_RUN && stats.sent === 0) {
    console.error('TEST-OWNER: nothing sent — try --force and/or --side=docId:sideKey');
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

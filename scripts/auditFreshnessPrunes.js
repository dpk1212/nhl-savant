/**
 * Read-only log of today's freshness bag.
 *
 * Does not write Firestore. Does not change the prune. Not on the fetch cron.
 *
 *   node scripts/auditFreshnessPrunes.js
 *   node scripts/auditFreshnessPrunes.js --date=2026-11-13 --focus=85aa98
 *   node scripts/auditFreshnessPrunes.js --no-poly
 *
 * Stdout is JSON lines: one summary, then one row per ticket worth reading.
 * Wallet ids are the last 6 characters. The Polymarket read runs only for
 * the focus wallet, the rows the live prune would drop, and truncated-book
 * misses. A failed read stays UNKNOWN.
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { isActionLockPinned } from '../src/lib/actionLockPin.js';
import { isTrustedPositionWallet } from '../src/lib/pressLadderOverlay.js';
import { loadWalletProfilesMap } from './lib/loadWalletProfiles.js';
import { collectScanSoftKeys, positionSoftKey, softPositionKey } from './lib/hydrateLivePositionsFromScan.js';
import { createPacedJsonFetch } from './lib/fetchPositionPages.js';
import {
  classifyPositionRead,
  describeFreshnessRow,
  needsPolyRead,
  updatedAtMs,
} from './lib/freshnessAudit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const dateArg = argv.find((a) => a.startsWith('--date='));
const focusArg = argv.find((a) => a.startsWith('--focus='));
const publicArg = argv.find((a) => a.startsWith('--public='));
const NO_POLY = argv.includes('--no-poly');
const DATE = dateArg
  ? dateArg.split('=')[1]
  : new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const FOCUS = (focusArg ? focusArg.split('=')[1] : '85aa98').toLowerCase();
const PUBLIC = publicArg ? publicArg.split('=')[1] : join(__dirname, '../public');
const POSITIONS_V2 = 'https://data-api.polymarket.com/v2/positions';
const POLY_CAP = 40;

function loadJSON(name) {
  const p = join(PUBLIC, name);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8'));
}

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '../serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
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

function indexHeartbeat(hb) {
  const ok = new Set(
    (Array.isArray(hb?.okWallets) ? hb.okWallets : []).map((w) => String(w || '').toLowerCase()).filter(Boolean),
  );
  const assets = new Map();
  const raw = hb?.openAssets && typeof hb.openAssets === 'object' ? hb.openAssets : {};
  for (const [w, arr] of Object.entries(raw)) {
    const list = Array.isArray(arr) ? arr.map(String) : [];
    assets.set(String(w).toLowerCase(), { count: list.length, set: new Set(list) });
  }
  return { ok, assets };
}

function jsonSoftKeys(posFiles) {
  const keys = new Set();
  for (const { data, mkt } of posFiles) {
    if (!data) continue;
    for (const [sport, games] of Object.entries(data)) {
      if (!games || typeof games !== 'object' || sport === 'scanHeartbeat') continue;
      for (const [gameKey, gd] of Object.entries(games)) {
        for (const pos of gd?.positions || []) {
          if (!pos?.wallet || !pos?.side) continue;
          keys.add(softPositionKey(pos.wallet, sport, gameKey, mkt, pos.side));
        }
      }
    }
  }
  return keys;
}

function excludedSet() {
  try {
    const excl = loadJSON('sharp_intel_excluded_wallets.json');
    const xs = Array.isArray(excl?.excluded) ? excl.excluded : [];
    return new Set(xs.map((a) => String(a || '').toLowerCase()).filter(Boolean));
  } catch {
    return new Set();
  }
}

async function readPoly(paced, cache, wallet, conditionId, status) {
  const key = `${wallet}|${conditionId}|${status}`;
  if (cache.has(key)) return cache.get(key);
  const params = new URLSearchParams({
    user: wallet,
    condition_id: conditionId,
    status,
    limit: '500',
  });
  const body = await paced(`${POSITIONS_V2}?${params}`);
  cache.set(key, body);
  return body;
}

async function classifyDoc(paced, cache, doc) {
  if (!doc.asset || !doc.conditionId || !doc.wallet) {
    return { polyClass: 'UNKNOWN', currentSize: null, polyNote: 'missing_asset_or_condition' };
  }
  const open = await readPoly(paced, cache, doc.wallet, doc.conditionId, 'OPEN');
  const closed = await readPoly(paced, cache, doc.wallet, doc.conditionId, 'CLOSED');
  const redeemable = await readPoly(paced, cache, doc.wallet, doc.conditionId, 'REDEEMABLE');
  let redeemableLost;
  const lost = await readPoly(paced, cache, doc.wallet, doc.conditionId, 'REDEEMABLE_LOST');
  if (lost != null) redeemableLost = lost;
  return classifyPositionRead({
    open, closed, redeemable, redeemableLost, asset: doc.asset,
  });
}

function dollars(rows, pred) {
  return Math.round(rows.filter(pred).reduce((s, r) => s + (Number(r.invested) || 0), 0));
}

async function main() {
  const db = initFirebase();
  const hb = loadJSON('scan_heartbeat.json');
  const heart = indexHeartbeat(hb);
  const posFiles = [
    { data: loadJSON('sharp_positions.json'), mkt: 'ML' },
    { data: loadJSON('sharp_spread_positions.json'), mkt: 'SPREAD' },
    { data: loadJSON('sharp_total_positions.json'), mkt: 'TOTAL' },
  ];
  const liveKeys = collectScanSoftKeys(posFiles);
  const fileKeys = jsonSoftKeys(posFiles);
  const excluded = excludedSet();
  const { map: profiles } = await loadWalletProfilesMap(db);

  const snap = await db.collection('sharp_action_positions').where('date', '==', DATE).get();
  const docs = [];
  snap.forEach((d) => docs.push({ _id: d.id, ...d.data() }));

  const pending = docs.filter((p) => p.status === 'PENDING' && !excluded.has(String(p.wallet || '').toLowerCase()));
  const maxUpdatedMs = pending.reduce((m, p) => Math.max(m, updatedAtMs(p)), 0);
  const nowMs = Date.now();

  const described = [];
  for (const doc of docs) {
    if (excluded.has(String(doc.wallet || '').toLowerCase())) continue;
    const wLower = String(doc.wallet || '').toLowerCase();
    const book = heart.assets.get(wLower);
    const commence = typeof doc.commenceTime === 'number' ? doc.commenceTime : null;
    const row = describeFreshnessRow(doc, {
      maxUpdatedMs,
      onScanBoard: liveKeys.has(positionSoftKey(doc)),
      onScanJson: fileKeys.has(positionSoftKey(doc)),
      trusted: isTrustedPositionWallet(profiles, doc.wallet, doc.sport, doc.marketType),
      inOkWallets: heart.ok.has(wLower),
      assetInOpenAssets: !!(doc.asset && book?.set.has(String(doc.asset))),
      openAssetCount: book?.count || 0,
      t15Pinned: isActionLockPinned(commence, nowMs),
      nowMs,
    });
    described.push({ row, doc });
  }

  const pendingRows = described.filter((x) => x.row.status === 'PENDING');
  const by = (name) => pendingRows.filter((x) => x.row.mechanism === name);

  const summary = {
    type: 'summary',
    at: new Date(nowMs).toISOString(),
    date: DATE,
    focus: FOCUS,
    readOnly: true,
    pruneUnchanged: true,
    heartbeatWallets: heart.ok.size,
    heartbeatMissing: !hb,
    pending: pendingRows.length,
    maxUpdatedAt: maxUpdatedMs ? new Date(maxUpdatedMs).toISOString() : null,
    fresh: by('fresh').length,
    keptScanBoard: by('kept_scan_board').length,
    keptTrust: by('kept_trust').length,
    silencePrune: by('silence_prune').length,
    silencePruneDollars: dollars(by('silence_prune').map((x) => x.row), () => true),
    truncatedBook: by('truncated_book').length,
    truncatedBookDollars: dollars(by('truncated_book').map((x) => x.row), () => true),
    scannedMissing: by('scanned_missing_asset').length,
    t15Held: by('t15_held').length,
    openButUnwritten: by('open_but_unwritten').length,
    legacyNoAsset: by('legacy_no_asset').length,
    scanBoardSportOmitted: by('scan_board_sport_omitted').length,
    wouldPrune: pendingRows.filter((x) => x.row.wouldPrune).length,
    focusPending: pendingRows.filter((x) => x.row.walletShort === FOCUS).length,
    focusExited: described.filter((x) => x.row.walletShort === FOCUS && x.row.status === 'EXITED').length,
  };

  const interesting = described.filter((x) => (
    x.row.walletShort === FOCUS
    || (x.row.status === 'PENDING' && needsPolyRead(x.row, FOCUS))
  ));
  interesting.sort((a, b) => {
    const af = a.row.walletShort === FOCUS ? 1 : 0;
    const bf = b.row.walletShort === FOCUS ? 1 : 0;
    if (af !== bf) return bf - af;
    return (b.row.invested || 0) - (a.row.invested || 0);
  });

  const polyTargets = NO_POLY ? [] : interesting.slice(0, Math.max(POLY_CAP, summary.focusPending + summary.focusExited));
  const paced = NO_POLY ? null : createPacedJsonFetch(fetch, { warn: (m) => console.error(m) });
  const cache = new Map();
  const lines = [];
  let polyReads = 0;
  for (const item of polyTargets) {
    let poly = { polyClass: NO_POLY ? null : 'UNKNOWN', currentSize: null, polyNote: NO_POLY ? 'skipped' : null };
    if (!NO_POLY) {
      poly = await classifyDoc(paced, cache, item.doc);
      polyReads += 1;
    }
    lines.push({ type: 'row', ...item.row, ...poly });
  }
  summary.polyRows = lines.length;
  summary.polyReads = polyReads;
  summary.polyOmitted = Math.max(0, interesting.length - lines.length);
  summary.ghost = lines.filter((r) => r.polyClass === 'GHOST').length;
  summary.trueClosed = lines.filter((r) => r.polyClass === 'TRUE_CLOSED').length;
  summary.resolved = lines.filter((r) => r.polyClass === 'RESOLVED').length;
  summary.unknown = lines.filter((r) => r.polyClass === 'UNKNOWN').length;

  console.log(JSON.stringify(summary));
  for (const line of lines) console.log(JSON.stringify(line));
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});

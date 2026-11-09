/**
 * Census pending sides that currently qualify for a T5 6-day or 14-day lead.
 *
 * Usage: node scripts/_census_t5_lead.mjs
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import {
  T5_HOLD_BOOST,
  T5_HOLD_LONG,
  T5_LEDGER_COLLECTION,
  hydrateT5SeasonLedger,
  setT5SeasonLedger,
  t5LeadForSide,
  t5Seat,
} from '../src/lib/t5LeadPolicy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

function etDate(ms = Date.now()) {
  return new Date(ms).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function etClock(ms) {
  if (!Number.isFinite(ms)) return '—';
  return new Date(ms).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) + ' ET';
}

function commenceMs(raw) {
  if (raw == null) return null;
  if (typeof raw === 'number') return raw;
  if (raw?.toMillis) return raw.toMillis();
  if (raw?._seconds) return raw._seconds * 1000;
  if (raw instanceof Date) return raw.getTime();
  if (typeof raw === 'string') {
    const t = Date.parse(raw);
    return Number.isFinite(t) ? t : null;
  }
  return null;
}

function initFirebase() {
  if (admin.apps.length) return admin.firestore();
  const sakPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  if (fs.existsSync(sakPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(fs.readFileSync(sakPath, 'utf8'))),
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
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function walletDetails(sd) {
  return sd?.peak?.v8Scoring?.walletDetails
    || sd?.lock?.v8Scoring?.walletDetails
    || [];
}

function sideNeedsLook(sd) {
  if (!sd) return false;
  if (sd.status === 'COMPLETED' && sd.result?.outcome) return false;
  const stage = sd.lockStage || '';
  const units = Number(sd.finalUnits ?? sd.peak?.units ?? sd.lock?.units ?? 0);
  return stage === 'LOCKED' || stage === 'LEAN' || units > 0;
}

function teamLabel(d, side, market) {
  const sd = d.sides?.[side] || {};
  if (sd.team) return sd.team;
  if (market === 'TOTAL') return side === 'over' ? `Over ${d.line ?? ''}`.trim() : `Under ${d.line ?? ''}`.trim();
  if (side === 'home') return d.home;
  if (side === 'away') return d.away;
  return side;
}

function fmtOdds(n) {
  if (!Number.isFinite(Number(n)) || Number(n) === 0) return '—';
  const x = Number(n);
  return x > 0 ? `+${x}` : String(x);
}

const TODAY = etDate();
const db = initFirebase();

const t5Snap = await db.collection(T5_LEDGER_COLLECTION).get();
const t5Docs = t5Snap.docs.map((d) => ({ id: d.id, ...d.data() }));
setT5SeasonLedger(hydrateT5SeasonLedger(t5Docs));
console.log(`asOf ${TODAY} · t5 ledger docs ${t5Docs.length}`);
console.log(t5Docs
  .filter((d) => d.part == null || d.part === 0)
  .map((d) => `${d.sport || d.id} start ${d.seasonStart || '?'}`)
  .join(' · ') || '(empty ledger)');

const byId = new Map();
for (const [col] of COLS) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  for (const doc of snap.docs) byId.set(`${col}/${doc.id}`, { col, snap: doc, d: doc.data() || {} });
}
try {
  for (const [col] of COLS) {
    const pending = await db.collection(col).where('status', '==', 'PENDING').get();
    for (const doc of pending.docs) {
      const key = `${col}/${doc.id}`;
      if (byId.has(key)) continue;
      const d = doc.data() || {};
      if (d.date && d.date < TODAY) continue;
      byId.set(key, { col, snap: doc, d });
    }
  }
} catch (e) {
  console.warn(`PENDING query skipped: ${e.message}`);
}

const hits = [];
const pendingN = { n: 0, locked: 0 };
for (const { col, snap, d } of byId.values()) {
  const market = COLS.find(([c]) => c === col)?.[1] || 'ML';
  const sport = d.sport;
  const date = d.date;
  const start = commenceMs(d.commenceTime);
  for (const [side, sd] of Object.entries(d.sides || {})) {
    if (!sideNeedsLook(sd)) continue;
    pendingN.n += 1;
    if (sd.lockStage === 'LOCKED' || sd.lockStage === 'LEAN') pendingN.locked += 1;
    const wd = walletDetails(sd);
    const lead = t5LeadForSide({ walletDetails: wd, side, sport, asOf: date || TODAY });
    const seat = t5Seat(lead);
    const units = Number(sd.finalUnits ?? sd.peak?.units ?? 0);
    const odds = Number(sd.lock?.odds ?? sd.peak?.odds ?? sd.odds ?? 0);
    const row = {
      id: snap.id,
      col,
      sport,
      market,
      date,
      start,
      matchup: `${d.away || '?'} @ ${d.home || '?'}`,
      side,
      team: teamLabel(d, side, market),
      stage: sd.lockStage || sd.status || '?',
      units,
      odds,
      mutedBy: sd.mutedBy || null,
      seat: seat?.id || null,
      hold: lead.hold,
      holdAgainst: lead.holdAgainst,
      f: lead.f,
      a: lead.a,
      lead: lead.lead === true,
      wallet: lead.holdWallet,
      wallets: lead.wallets,
      stampedSeat: sd.v8_t5LeadSeat || null,
      stampedHold: sd.v8_t5LeadHold ?? null,
    };
    if (lead.lead === true && lead.hold != null && lead.hold >= T5_HOLD_BOOST) hits.push(row);
  }
}

hits.sort((a, b) => (b.hold - a.hold) || (a.start || 0) - (b.start || 0) || a.id.localeCompare(b.id));

const lead14 = hits.filter((h) => h.hold >= T5_HOLD_LONG);
const lead6 = hits.filter((h) => h.hold >= T5_HOLD_BOOST && h.hold < T5_HOLD_LONG);

function printBlock(title, rows) {
  console.log(`\n${title} (${rows.length})`);
  if (!rows.length) {
    console.log('  none');
    return;
  }
  for (const r of rows) {
    const size = `${r.units}u`;
    const mute = r.mutedBy ? ` mutedBy=${r.mutedBy}` : '';
    const vs = `T5 ${r.f}-${r.a} hold ${r.hold}d vs ${r.holdAgainst ?? 0}d`;
    console.log(
      `  ${r.sport} ${r.market} ${r.team} ${fmtOdds(r.odds)} ${size} · ${r.matchup}`
      + ` · ${etClock(r.start)} · ${r.stage}${mute}`,
    );
    console.log(
      `    ${vs} · wallet ${r.wallet || '—'} · seat ${r.seat}`
      + (r.stampedSeat && r.stampedSeat !== r.seat ? ` stamp=${r.stampedSeat}/${r.stampedHold}d` : ''),
    );
  }
}

console.log(`pending sides scanned ${pendingN.n} (LOCKED/LEAN ${pendingN.locked}) · dates around ${TODAY}`);
printBlock('14-day T5 lead', lead14);
printBlock('6-day T5 lead (not yet 14)', lead6);
console.log(`\nQUALIFY ${hits.length} · lead14 ${lead14.length} · lead6 ${lead6.length}`);
process.exit(0);

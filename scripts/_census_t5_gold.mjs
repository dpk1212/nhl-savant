/**
 * Tonight's pending sides that are Gold: 14-day T5, nobody T5 against, staked.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import {
  T5_LEDGER_COLLECTION,
  hydrateT5SeasonLedger,
  setT5SeasonLedger,
  t5GoldLead,
  t5LeadForSide,
  t5MarginKind,
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

function line(r) {
  const mute = r.mutedBy ? ` mutedBy=${r.mutedBy}` : '';
  const edge = Number.isFinite(r.edge) ? ` E=${r.edge.toFixed(1)}` : ' E=—';
  const boost = r.stampedBoost != null ? ` boost=${r.stampedBoost}` : '';
  console.log(
    `  ${r.sport} ${r.market} ${r.team} ${fmtOdds(r.odds)} ${r.units}u · ${r.matchup}`
    + ` · ${etClock(r.start)} · ${r.stage}${mute}${edge}${boost}`,
  );
  console.log(
    `    T5 ${r.f}-${r.a} hold ${r.hold}d vs ${r.holdAgainst ?? 0}d`
    + ` · for14=${r.for14} ag14=${r.ag14} for6=${r.for6} ag6=${r.ag6}`
    + ` · seat ${r.seat || '—'} · stampGold=${r.stampedGold}`
    + (r.wallet ? ` · ${r.wallet}` : ''),
  );
}

const TODAY = etDate();
const db = initFirebase();
const t5Snap = await db.collection(T5_LEDGER_COLLECTION).get();
const t5Docs = t5Snap.docs.map((d) => ({ id: d.id, ...d.data() }));
setT5SeasonLedger(hydrateT5SeasonLedger(t5Docs));
console.log(`asOf ${TODAY} · t5 ledger docs ${t5Docs.length}`);

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

const gold = [];
const walletsOnly = [];
const lead14NotGold = [];
let pendingN = 0;
for (const { col, snap, d } of byId.values()) {
  const market = COLS.find(([c]) => c === col)?.[1] || 'ML';
  for (const [side, sd] of Object.entries(d.sides || {})) {
    if (!sideNeedsLook(sd)) continue;
    pendingN += 1;
    const lead = t5LeadForSide({
      walletDetails: walletDetails(sd),
      side,
      sport: d.sport,
      asOf: d.date || TODAY,
    });
    const units = Number(sd.finalUnits ?? sd.peak?.units ?? 0);
    const walletsGold = t5GoldLead(lead);
    const row = {
      sport: d.sport,
      market,
      team: teamLabel(d, side, market),
      matchup: `${d.away || '?'} @ ${d.home || '?'}`,
      start: commenceMs(d.commenceTime),
      stage: sd.lockStage || sd.status || '?',
      units,
      odds: Number(sd.lock?.odds ?? sd.peak?.odds ?? sd.odds ?? 0),
      mutedBy: sd.mutedBy || null,
      edge: Number.isFinite(Number(sd.v8_winnerAlignEdge)) ? Number(sd.v8_winnerAlignEdge) : null,
      f: lead.f, a: lead.a, hold: lead.hold, holdAgainst: lead.holdAgainst,
      for14: lead.for14, ag14: lead.ag14, for6: lead.for6, ag6: lead.ag6,
      seat: t5Seat(lead)?.id || null,
      margin: t5MarginKind(lead),
      wallet: lead.holdWallet,
      stampedGold: sd.v8_gold === true,
      stampedBoost: sd.v8_edgeBoost ?? null,
    };
    if (walletsGold && units > 0) gold.push(row);
    else if (walletsGold && !(units > 0)) walletsOnly.push(row);
    else if (lead.ledger === true && (lead.for14 || 0) >= 1 && lead.lead === true) lead14NotGold.push(row);
  }
}

gold.sort((a, b) => (a.start || 0) - (b.start || 0));
walletsOnly.sort((a, b) => (a.start || 0) - (b.start || 0));
lead14NotGold.sort((a, b) => (a.start || 0) - (b.start || 0));

console.log(`pending sides scanned ${pendingN} · dates around ${TODAY}`);
console.log(`\nGOLD tonight (${gold.length}) — 14-day T5, nobody T5 against, staked`);
if (!gold.length) console.log('  none');
else gold.forEach(line);
console.log(`\nGold wallets, not staked (${walletsOnly.length}) — same board, v8_gold stays false`);
if (!walletsOnly.length) console.log('  none');
else walletsOnly.forEach(line);
console.log(`\nlead14 seat, not gold (${lead14NotGold.length}) — T5 on the other side`);
if (!lead14NotGold.length) console.log('  none');
else lead14NotGold.forEach(line);
process.exit(0);

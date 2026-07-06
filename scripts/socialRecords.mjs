/**
 * socialRecords.mjs — verified records for social posts.
 *
 * Tallies GRADED picks straight from Firestore (the same sides schema the
 * daily AGS-U report uses) so every number quoted in a tweet is real.
 * The Twitter Loop runs this in Phase 0. Never quote a record that didn't
 * come out of this script (or the daily report) this run.
 *
 * Usage:
 *   node scripts/socialRecords.mjs                  # default: from 2026-06-01
 *   node scripts/socialRecords.mjs --from 2026-07-03 --to 2026-07-05
 *
 * Output: prints tables AND writes social_analysis/verified_records.json
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, writeFileSync } from 'fs';

const args = process.argv.slice(2);
const argVal = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : dflt;
};
const FROM = argVal('--from', '2026-06-01');
const TO = argVal('--to', '9999-12-31');

const sa = JSON.parse(readFileSync(new URL('../serviceAccountKey.json', import.meta.url)));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
const rows = [];
for (const [col, mkt] of COLS) {
  const snap = await db.collection(col).where('date', '>=', FROM).get();
  for (const doc of snap.docs) {
    const data = doc.data();
    if (!data.sides || (data.date || '') > TO) continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (sd.superseded) continue;
      if ((sd.status || data.status) !== 'COMPLETED') continue;
      const res = sd.result || data.result || {};
      if (!res.outcome) continue;
      const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
      if (won === null) continue;
      const lock = sd.lock || {}, peak = sd.peak || lock;
      const units = sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0;
      const odds = peak.odds || lock.odds || 0;
      const computed = won ? (odds < 0 ? units * 100 / Math.abs(odds) : units * odds / 100) : -units;
      const profit = Number.isFinite(res.profit) ? res.profit : computed;
      const tracked = res.tracked === true || units === 0;
      if (tracked) continue; // staked book only — what we publish
      rows.push({
        mkt, date: data.date, sport: data.sport || data.league, won, units, odds, profit,
        matchup: data.matchup || `${data.away || ''}@${data.home || ''}`, sideKey,
      });
    }
  }
}

function tally(rs) {
  const w = rs.filter(r => r.won).length, l = rs.length - w;
  const net = rs.reduce((s, r) => s + r.profit, 0);
  const risked = rs.reduce((s, r) => s + r.units, 0);
  return {
    record: `${w}-${l}`, wins: w, losses: l,
    netUnits: +net.toFixed(1),
    roiPct: risked ? +((net / risked) * 100).toFixed(1) : 0,
    n: rs.length,
  };
}
const line = (label, t) => console.log(
  `${label.padEnd(28)} ${t.record.padStart(7)}  ${(t.netUnits >= 0 ? '+' : '') + t.netUnits}u  ROI ${t.roiPct}%  (n=${t.n})`);

const out = { generatedAt: new Date().toISOString(), window: { from: FROM, to: TO }, segments: {} };
const seg = (key, rs) => { out.segments[key] = tally(rs); line(key, out.segments[key]); };

console.log(`=== VERIFIED RECORDS (staked picks, ${FROM} → ${TO === '9999-12-31' ? 'now' : TO}) ===`);
seg('ALL', rows);
for (const sport of [...new Set(rows.map(r => r.sport))].sort()) {
  seg(`SPORT ${sport}`, rows.filter(r => r.sport === sport));
}
for (const mkt of ['ML', 'SPREAD', 'TOTAL']) {
  seg(`MARKET ${mkt}`, rows.filter(r => r.mkt === mkt));
}
seg('6u MAX plays', rows.filter(r => r.units >= 6));
seg('5u+ tier', rows.filter(r => r.units >= 5));

console.log('\n=== BY DAY (last 10 in window) ===');
const days = [...new Set(rows.map(r => r.date))].sort().slice(-10);
out.byDay = {};
for (const d of days) { out.byDay[d] = tally(rows.filter(r => r.date === d)); line(`  ${d}`, out.byDay[d]); }

writeFileSync(new URL('../social_analysis/verified_records.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('\nWrote social_analysis/verified_records.json');

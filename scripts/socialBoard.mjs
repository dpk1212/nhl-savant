/**
 * socialBoard.mjs — the time-prioritized board for tweet writing.
 *
 * Reads social_analysis/todays_picks.json, recomputes minutes-to-game from
 * commenceTime vs NOW (the stored minsToGame is stale the moment the file is
 * written), and prints picks in the exact priority order the Twitter Loop
 * heroes them (Guardrail #3):
 *
 *   1. POST NOW  — top-tier (5u+/TOP+/ELITE/SUPER) inside 60 min of start
 *   2. FIRM      — any shipped pick inside 60 min
 *   3. MOVABLE   — top-tier >60 min out (MUST carry the line-movement caveat)
 *   4. rest      — context only
 *
 * Picks lock 15 min before start: anything <15 min out is flagged LOCKED
 * (still quotable as "locked in", but no longer a tail-now call to action).
 *
 * Usage: node scripts/socialBoard.mjs
 */
import { readFileSync } from 'fs';

const d = JSON.parse(readFileSync(new URL('../social_analysis/todays_picks.json', import.meta.url)));
const now = Date.now();
const et = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' });
console.log(`Board as of ${et} ET · picks file generated ${d.generatedAt}`);
const staleMin = Math.round((now - new Date(d.generatedAt).getTime()) / 60000);
if (staleMin > 30) console.log(`⚠️  PICKS FILE IS ${staleMin} MIN STALE — git pull before quoting numbers`);

const TOP_TIERS = new Set(['SUPER', 'TOP+', 'TOP']);
const picks = (d.picks || [])
  .filter(p => p.shipped && (p.units || 0) > 0 && p.isToday !== false)
  .map(p => {
    const mins = p.commenceTime ? Math.round((new Date(p.commenceTime).getTime() - now) / 60000) : null;
    const topTier = TOP_TIERS.has(p.stakeTier) || (p.units || 0) >= 5;
    let bucket;
    if (mins === null || mins < 15) bucket = 'LOCKED/LIVE';
    else if (mins <= 60 && topTier) bucket = '1-POST NOW';
    else if (mins <= 60) bucket = '2-FIRM';
    else if (topTier) bucket = '3-MOVABLE (caveat required)';
    else bucket = '4-context';
    return { ...p, mins, topTier, bucket };
  })
  .sort((a, b) => a.bucket.localeCompare(b.bucket) || (a.mins ?? 1e9) - (b.mins ?? 1e9));

let last = '';
for (const p of picks) {
  if (p.bucket !== last) { console.log(`\n── ${p.bucket} ──`); last = p.bucket; }
  const t = p.commenceTime
    ? new Date(p.commenceTime).toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' })
    : '?';
  const proven = `wallets ${p.provenWinnersFor ?? '?'}for/${p.provenWinnersAgainst ?? '?'}against`;
  console.log(`${(p.sport || '').padEnd(4)} ${p.matchup} | ${p.selection} | ${p.units}u ${p.stakeTier || ''}/${p.agsConvictionTier || ''} | ${proven} | ${t} ET (${p.mins} min)`);
}
if (!picks.length) console.log('\nNo shipped picks with units > 0 for today.');
console.log('\nReminder: quote `selection` VERBATIM. >60 min out ⇒ include the movement caveat. Picks lock 15 min before start.');
console.log('DATA MEANING: "wallets Xfor/Yagainst" is a HEADCOUNT of proven winners on each side — it is NOT a win-loss record. Never tweet it as one.');

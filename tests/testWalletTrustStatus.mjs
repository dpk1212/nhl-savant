/**
 * Wallet trust status (2026-10-10).
 * Usage: node tests/testWalletTrustStatus.mjs
 */
import assert from 'assert';
import {
  buildTrustState,
  trustTier,
  trustBets,
  trustSummary,
  isTrustedWallet,
  isTrustOn,
  isTrustOff,
  TRUST_TIER_MIN_N,
  TRUST_FORM_WINDOW,
  TRUST_FORM_MIN_N,
  TRUST_REGAINED_DAYS,
  TRUST_TIER_MIN,
} from '../src/lib/walletTrustStatus.js';

let n = 0;
function ok(cond, msg) { assert.ok(cond, msg); n++; }
function eq(a, b, msg) { assert.strictEqual(a, b, msg); n++; }

const day = (i) => new Date(Date.UTC(2026, 5, 1 + i)).toISOString().slice(0, 10); // 2026-06-01 + i
const bet = (i, won, price = 0.5) => ({ date: day(i), price, won });

// 1. Tier floors
{
  eq(trustTier(9, 10), 5, '≥ +8 → 5'); eq(trustTier(8, 10), 5, '+8 exactly → 5');
  eq(trustTier(4, 10), 4, '+4 → 4'); eq(trustTier(3.9, 10), 3, '+3.9 → 3');
  eq(trustTier(0, 10), 3, '0 → 3'); eq(trustTier(-0.1, 10), 2, '−0.1 → 2');
  eq(trustTier(-4, 10), 2, '−4 → 2'); eq(trustTier(-4.1, 10), 1, '−4.1 → 1');
  eq(trustTier(20, 9), 0, 'n < 10 → 0 whatever the edge');
  eq(TRUST_TIER_MIN_N, 10, 'min n'); eq(TRUST_FORM_WINDOW, 10, 'form window'); eq(TRUST_FORM_MIN_N, 5, 'form min');
  eq(TRUST_REGAINED_DAYS, 14, 'regained window'); eq(TRUST_TIER_MIN, 4, 'gate tier');
}

// 2. Row filter: priced, decided, pushes out, sorted
{
  const rows = trustBets([
    { date: '2026-06-03', price: 0.5, won: 1 },
    { date: '2026-06-01', price: 0.5, won: false },
    { date: '2026-06-02', price: 0.5, won: true, push: true },
    { date: '2026-06-02', price: 1.2, won: true },
    { date: '2026-06-02', price: 0.5, won: null },
    { date: null, price: 0.5, won: true },
  ]);
  eq(rows.length, 2, 'two decided priced bets'); eq(rows[0].date, '2026-06-01', 'sorted oldest first'); eq(rows[1].won, true, 'numeric 1 → true');
}

// 3. Unproven until 10 decided bets; the 10th bet only counts the next day
{
  const bets = Array.from({ length: 9 }, (_, i) => bet(i, true, 0.5));
  const s9 = buildTrustState(bets);
  eq(s9.status, 'UNPROVEN', '9 bets → UNPROVEN'); eq(s9.tier, 0, 'tier 0'); eq(s9.n, 9, 'n 9'); eq(s9.asOf, day(9), 'as of the day after the last bet');
  const s10 = buildTrustState([...bets, bet(9, true, 0.5)]);
  eq(s10.n, 10, 'n 10'); eq(s10.edge, 50, '10-0 at .50 → +50pp'); eq(s10.tier, 5, 'tier 5'); eq(s10.status, 'STABLE_ON', 'STABLE_ON');
  // Reading the state on the day of the 10th bet still sees only 9.
  const onDay = buildTrustState([...bets, bet(9, true, 0.5)], { asOf: day(9) });
  eq(onDay.n, 9, 'as-of excludes that day'); eq(onDay.status, 'UNPROVEN', 'still UNPROVEN that morning');
}

// 4. Form OFF with last-10 under price → STABLE_OFF; back ON when the window recovers
{
  // 20 wins at .50, then 6 straight losses at .50 → last 10 = 4-6 at .50 → 4 − 5 = −1 → OFF
  const bets = [
    ...Array.from({ length: 20 }, (_, i) => bet(i, true, 0.5)),
    ...Array.from({ length: 6 }, (_, i) => bet(20 + i, false, 0.5)),
  ];
  const s = buildTrustState(bets);
  eq(s.n, 26, 'n'); ok(s.tier >= 4, `tier still ≥ 4 on 20-6 at .50 (edge ${s.edge})`);
  eq(s.formOn, false, 'form OFF'); eq(s.status, 'STABLE_OFF', 'STABLE_OFF'); eq(s.formN, 10, 'window 10');
  // Five wins later: last 10 = 5 losses + 5 wins → 5 − 5 = 0 → ON
  const back = buildTrustState([...bets, ...Array.from({ length: 5 }, (_, i) => bet(26 + i, true, 0.5))]);
  eq(back.formOn, true, 'form back ON at break-even'); eq(back.status, 'STABLE_ON', 'STABLE_ON again');
  // Fewer than 5 in the window → ON by default
  eq(buildTrustState([bet(0, false, 0.5), bet(1, false, 0.5), bet(2, false, 0.5), bet(3, false, 0.5)]).formOn, true, 'under 5 → form ON');
}

// 5. Peak / fall / regain bookkeeping
{
  // 10 wins at .50 → tier 5 (peak 5). Then losses until edge < +8 → FALLEN.
  const wins = Array.from({ length: 10 }, (_, i) => bet(i, true, 0.5));
  let bets = [...wins];
  // 10-0 → edge 50. Add 10 losses one per day: after 20 bets 10-10 → edge 0 → tier 3 < peak 5 → fallen.
  bets = [...bets, ...Array.from({ length: 10 }, (_, i) => bet(10 + i, false, 0.5))];
  const s = buildTrustState(bets);
  eq(s.peak, 5, 'peak 5'); eq(s.fallen, true, 'fallen'); eq(s.fellFrom, 5, 'fell from 5'); eq(s.tier, 3, 'tier 3 at 10-10');
  eq(s.formOn, false, '0-10 form OFF'); eq(s.status, 'FALLEN_OFF', 'FALLEN_OFF');
  ok(s.sinceFall >= 1, 'days since fall counted');
  // Deeper fall, then form recovers while still below peak → FALLEN_ON
  const deep = [...wins, ...Array.from({ length: 14 }, (_, i) => bet(10 + i, false, 0.5))]; // 10-14 → −8.3 → tier 1
  const s1 = buildTrustState(deep);
  eq(s1.tier, 1, 'tier 1 at 10-14'); eq(s1.status, 'FALLEN_OFF', 'FALLEN_OFF');
  const s2 = buildTrustState([...deep, ...Array.from({ length: 6 }, (_, i) => bet(24 + i, true, 0.5))]); // 16-14 → +3.3 → tier 3
  eq(s2.tier, 3, 'tier 3 at 16-14'); eq(s2.fallen, true, 'still below peak 5');
  eq(s2.formOn, true, 'last 10 = 6-4 → ON'); eq(s2.status, 'FALLEN_ON', 'FALLEN_ON');
}

// 5b. Regain: climb back to the peak within 14 days → REGAINED_ON, then STABLE_ON after the window
{
  const wins = Array.from({ length: 10 }, (_, i) => bet(i, true, 0.5));          // 10-0 → tier 5, peak dated day 10
  const dip = [
    ...Array.from({ length: 5 }, () => bet(10, false, 0.5)),
    ...Array.from({ length: 5 }, () => bet(11, false, 0.5)),
  ];                                                                              // 10-10 → 0 → tier 3, fell day 12
  const climb = Array.from({ length: 5 }, () => bet(12, true, 0.5));              // 15-10 → +10 → tier 5 → regained day 13
  const s = buildTrustState([...wins, ...dip, ...climb]);
  eq(s.asOf, day(13), 'as of day 13'); eq(s.fallen, false, 'back at peak'); eq(s.regained, 1, 'one regain'); eq(s.tier, 5, 'tier 5');
  eq(s.status, 'REGAINED_ON', 'REGAINED_ON inside 14 days of the peak date');
  // The 14-day clock runs from the peak date; read a month later → STABLE_ON.
  const later = buildTrustState([...wins, ...dip, ...climb], { asOf: day(40) });
  eq(later.status, 'STABLE_ON', 'STABLE_ON once the regain window lapses');
  // Mid-dip read: fallen, form OFF.
  const mid = buildTrustState([...wins, ...dip, ...climb], { asOf: day(12) });
  eq(mid.status, 'FALLEN_OFF', 'FALLEN_OFF on the morning of day 12'); eq(mid.n, 20, 'sees 20 bets');
}

// 6. Helpers
{
  ok(isTrustOn('STABLE_ON') && isTrustOn('REGAINED_ON'), 'ON set');
  ok(isTrustOff('STABLE_OFF') && isTrustOff('FALLEN_OFF'), 'OFF set');
  ok(!isTrustOn('FALLEN_ON') && !isTrustOff('FALLEN_ON'), 'FALLEN_ON is neither');
  ok(isTrustedWallet({ tier: 4, status: 'STABLE_ON' }), 'tier 4 ON trusted');
  ok(isTrustedWallet({ tier: 5, status: 'REGAINED_ON' }), 'tier 5 REGAINED trusted');
  ok(!isTrustedWallet({ tier: 3, status: 'STABLE_ON' }), 'tier 3 not trusted');
  ok(!isTrustedWallet({ tier: 5, status: 'STABLE_OFF' }), 'form OFF not trusted');
  ok(!isTrustedWallet({ tier: 5, status: 'FALLEN_ON' }), 'fallen not trusted');
  ok(!isTrustedWallet(null), 'null not trusted');
  const sum = trustSummary(buildTrustState(Array.from({ length: 12 }, (_, i) => bet(i, i % 3 !== 0, 0.5))));
  for (const k of ['status', 'tier', 'n', 'edge', 'formOn', 'formMargin', 'peak', 'fallen', 'sinceFall', 'daysActive', 'lastBetDate', 'asOf']) ok(k in sum && sum[k] !== undefined, `summary.${k}`);
  eq(sum.lastBetDate, day(11), 'last bet date'); eq(sum.asOf, day(12), 'as of next day');
  eq(trustSummary(null), null, 'null summary');
  eq(buildTrustState([]).status, 'UNPROVEN', 'empty → UNPROVEN'); eq(buildTrustState([]).n, 0, 'empty n 0');
}

console.log(`testWalletTrustStatus: ${n} assertions passed`);

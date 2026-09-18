/**
 * Fade proven-$ hold (2026-09-18+).
 * SHARP-LEAN ML with proven ≥50% skips fadeTop mute and continues downstream.
 * Usage: node tests/testFadeProvenHold.mjs
 */
import assert from 'assert';
import {
  evaluateFadeProvenHold,
  evaluateFadeProvenHoldFromTicket,
  isFadeProvenHoldLive,
  isFadeProvenHoldMarket,
  isFadeProvenHoldPath,
  FADE_PROVEN_HOLD_FROM,
  FADE_PROVEN_HOLD_MIN,
  FADE_PROVEN_HOLD_PATHS,
} from '../src/lib/fadeProvenHold.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

function run(args) {
  return evaluateFadeProvenHold({
    pickDate: '2026-09-18',
    marketType: 'ML',
    path: 'SHARP-LEAN',
    fadeWouldMute: true,
    ...args,
  });
}

ok(isFadeProvenHoldLive('2026-09-18'), 'live on cutover');
ok(!isFadeProvenHoldLive('2026-09-17'), 'not live before cutover');
ok(FADE_PROVEN_HOLD_FROM === '2026-09-18', 'cutover date');
ok(FADE_PROVEN_HOLD_MIN === 0.50, 'proven floor inclusive');
ok(FADE_PROVEN_HOLD_PATHS.has('SHARP-LEAN'), 'SHARP-LEAN is the path');
ok(!FADE_PROVEN_HOLD_PATHS.has('SHARP'), 'SHARP is not the path');
ok(isFadeProvenHoldMarket('ML'), 'ML market');
ok(isFadeProvenHoldMarket('ml'), 'ml market');
ok(!isFadeProvenHoldMarket('SPREAD'), 'spreads stay faded');
ok(!isFadeProvenHoldMarket('TOTAL'), 'totals stay faded');
ok(isFadeProvenHoldPath('SHARP-LEAN'), 'path match');
ok(!isFadeProvenHoldPath('MINI'), 'MINI not held');

{
  const r = run({ shareP: 0.50 });
  ok(r.hold === true && r.action === 'HOLD', 'exactly 50% proven holds');
  ok(r.reason === 'fade_proven_hold', 'hold reason');
  ok(r.shareP === 0.50, 'stamps shareP');
}
{
  const r = run({ shareP: 0.80 });
  ok(r.hold === true && r.action === 'HOLD', 'high proven holds');
}
{
  const r = run({ shareP: 0.499 });
  ok(r.hold === false && r.action === 'SKIP', 'just under 50% still fades');
  ok(r.reason === 'proven_lt50', 'lt50 reason');
}
{
  const r = run({ shareP: null });
  ok(r.hold === false && r.action === 'SKIP', 'missing proven is not an exception');
  ok(r.reason === 'proven_missing', 'missing reason');
}
{
  const r = run({ shareP: 0.90, marketType: 'SPREAD' });
  ok(r.hold === false && r.reason === 'not_ml', 'spreads still fade');
}
{
  const r = run({ shareP: 0.90, marketType: 'TOTAL' });
  ok(r.hold === false && r.reason === 'not_ml', 'totals still fade');
}
{
  const r = run({ shareP: 0.90, path: 'MINI' });
  ok(r.hold === false && r.reason === 'not_sharp_lean', 'MINI still fades');
}
{
  const r = run({ shareP: 0.90, path: 'SHARP' });
  ok(r.hold === false && r.reason === 'not_sharp_lean', 'SHARP still fades');
}
{
  const r = run({ shareP: 0.90, path: 'RANK' });
  ok(r.hold === false && r.reason === 'not_sharp_lean', 'RANK still fades');
}
{
  const r = run({ shareP: 0.90, path: 'CONFIRMED' });
  ok(r.hold === false && r.reason === 'not_sharp_lean', 'CONFIRMED still fades');
}
{
  const r = run({ shareP: 0.90, pickDate: '2026-09-17' });
  ok(r.hold === false && r.action === 'EXEMPT' && r.reason === 'pre_cutover', 'pre-cutover still fades');
}
{
  const r = run({ fadeWouldMute: false, shareP: 0.90 });
  ok(r.hold === false && r.action === 'PASS', 'no fade → pass');
}

{
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
    ['bbbbbb', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
  ]);
  const r = evaluateFadeProvenHoldFromTicket({
    pickDate: '2026-09-18',
    marketType: 'ML',
    path: 'SHARP-LEAN',
    fadeWouldMute: true,
    side: 'home',
    sport: 'MLB',
    walletDetails: [
      { walletShort: 'aaaaaa', side: 'home', invested: 800 },
      { walletShort: 'bbbbbb', side: 'away', invested: 200 },
    ],
    walletProfiles: profiles,
  });
  ok(r.hold === true && r.action === 'HOLD', 'walletDetails proven ≥50 holds');
}

{
  const profiles = new Map([
    ['aaaaaa', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
    ['bbbbbb', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } } }],
  ]);
  const r = evaluateFadeProvenHoldFromTicket({
    pickDate: '2026-09-18',
    marketType: 'ML',
    path: 'SHARP-LEAN',
    fadeWouldMute: true,
    side: 'home',
    sport: 'MLB',
    walletDetails: [
      { walletShort: 'aaaaaa', side: 'home', invested: 200 },
      { walletShort: 'bbbbbb', side: 'away', invested: 800 },
    ],
    walletProfiles: profiles,
  });
  ok(r.hold === false && r.reason === 'proven_lt50', 'walletDetails proven <50 still fades');
}

{
  const r = evaluateFadeProvenHoldFromTicket({
    pickDate: '2026-09-18',
    marketType: 'ML',
    path: 'SHARP-LEAN',
    fadeWouldMute: true,
    side: 'home',
    sport: 'MLB',
    walletDetails: [],
    walletProfiles: new Map(),
  });
  ok(r.hold === false && r.reason === 'proven_missing', 'empty details still fade');
}

console.log(`ok ${n}`);

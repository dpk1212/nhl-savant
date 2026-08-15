/**
 * Steam thresholds + last-hour / since-open tape.
 * Usage: node tests/testSteamMove.mjs
 */
import assert from 'node:assert/strict';
import {
  americanToDecimal,
  decimalDropPct,
  steamTierFromPct,
  summarizeSteam,
  compactSteam,
  STEAM_EVENT_PCT,
  STEAM_GOLD_PCT,
} from '../src/lib/steamMove.js';

assert.equal(STEAM_EVENT_PCT, 3);
assert.equal(STEAM_GOLD_PCT, 4.5);

// -140 → 1.714; -160 → 1.625; drop ≈ 5.19% (ClosingDime gold territory)
assert.ok(Math.abs(americanToDecimal(-140) - (1 + 100 / 140)) < 1e-9);
const yankeesHour = decimalDropPct(-140, -160);
assert.ok(yankeesHour >= 4.5 && yankeesHour <= 5.5, `yankees hour ${yankeesHour}`);
assert.equal(steamTierFromPct(yankeesHour), 'gold');

// -110 → -115 is juice, not steam (~2.1%)
const juice = decimalDropPct(-110, -115);
assert.ok(juice > 1.8 && juice < 2.6, `juice ${juice}`);
assert.equal(steamTierFromPct(juice), 'watch');

// 3.0% is the pinnapi event floor
assert.equal(steamTierFromPct(3), 'steam');
assert.equal(steamTierFromPct(2.9), 'watch');
assert.equal(steamTierFromPct(1.5), null);

const now = 1_800_000_000;
const game = {
  opener: { t: now - 6 * 3600, away: 130, home: -150, max: 4500 },
  current: { away: 145, home: -160, max: 23700 },
  max: 23700,
  maxMoneyLine: 23700,
  history: [
    { t: now - 6 * 3600, away: 130, home: -150, max: 4500, maxMoneyLine: 4500 },
    { t: now - 3600, away: 135, home: -140, max: 8000, maxMoneyLine: 8000 },
    { t: now - 60, away: 145, home: -160, max: 23700, maxMoneyLine: 23700 },
  ],
  steamDrops: [
    {
      t: now - 20 * 60,
      market: 'ml',
      side: 'home',
      dropPct: 4.8,
      fromOdds: -140,
      toOdds: -160,
    },
  ],
};

const home = summarizeSteam(game, { marketType: 'ml', sideNorm: 'home', nowSec: now });
assert.equal(home.tier, 'gold', 'home last-hour is gold');
assert.equal(home.show, true);
assert.equal(home.goldConfirmed, true, 'limits $4.5K → $23.7K');
assert.equal(home.lastHour.count, 1);
assert.ok(home.lastHour.dropPct >= 4.5, `lastHour ${home.lastHour.dropPct}`);
assert.ok(home.tag && /GOLD|4\./.test(home.tag), home.tag);

const away = summarizeSteam(game, { marketType: 'ml', sideNorm: 'away', nowSec: now });
assert.equal(away.show, false, 'dog lengthening is not steam-on');
assert.ok(!(away.lastHour.dropPct > 0), `away lastHour ${away.lastHour.dropPct}`);

const stamp = compactSteam(home);
assert.equal(stamp.tier, 'gold');
assert.equal(stamp.goldConfirmed, true);
assert.equal(stamp.lastHourCount, 1);

const flat = summarizeSteam({
  history: [
    { t: now - 4000, away: 100, home: -120 },
    { t: now - 10, away: 100, home: -120 },
  ],
}, { marketType: 'ml', sideNorm: 'home', nowSec: now });
assert.equal(flat.show, false);
assert.equal(compactSteam(flat), null);

// Mixed alt totals must not invent 40% gold — pin to current main.
const mixedTotals = summarizeSteam({
  totalCurrent: { line: 8, overOdds: -101, underOdds: -111, max: 5625, isMain: true },
  totalOpener: { line: 8, overOdds: -108, underOdds: -106, max: 1875 },
  totalHistory: [
    { t: now - 4000, line: 8, overOdds: -108, underOdds: -106, max: 1875, isMain: true },
    { t: now - 60, line: 8, overOdds: -101, underOdds: -111, max: 5625, isMain: true },
    { t: now - 60, line: 9.5, overOdds: 171, underOdds: -206, max: 5625, isMain: false },
  ],
}, { marketType: 'total', sideNorm: 'under', nowSec: now });
assert.equal(mixedTotals.show, false, `mixed totals tagged ${mixedTotals.tag}`);
assert.ok(Math.abs(mixedTotals.sinceOpen.dropPct || 0) < 3, `mixed open ${mixedTotals.sinceOpen.dropPct}`);

// Live prints after commence must not move the tag.
const commence = now - 1800;
const liveAfter = summarizeSteam({
  commence: new Date(commence * 1000).toISOString(),
  opener: { t: now - 6 * 3600, away: 130, home: -150 },
  current: { away: 200, home: -250 },
  history: [
    { t: now - 6 * 3600, away: 130, home: -150 },
    { t: commence - 60, away: 135, home: -155 },
    { t: now - 30, away: 200, home: -250 },
  ],
}, { marketType: 'ml', sideNorm: 'home', nowSec: now });
assert.equal(liveAfter.frozen, true);
assert.equal(liveAfter.sinceOpen.toOdds, -155, 'close = last pre-commence print');
assert.ok(liveAfter.sinceOpen.dropPct < 3, `live after commence ${liveAfter.sinceOpen.dropPct}`);

const pregame = summarizeSteam({
  commence: new Date((now + 3600) * 1000).toISOString(),
  history: [
    { t: now - 6 * 3600, away: 130, home: -140 },
    { t: now - 60, away: 145, home: -160 },
  ],
}, { marketType: 'ml', sideNorm: 'home', nowSec: now });
assert.equal(pregame.frozen, false);
assert.ok(pregame.sinceOpen.dropPct >= 4.5, `pregame still live ${pregame.sinceOpen.dropPct}`);

console.log('testSteamMove: ok');

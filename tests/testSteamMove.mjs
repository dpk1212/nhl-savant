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
  mainLineTowardTicket,
  STEAM_EVENT_PCT,
  STEAM_GOLD_PCT,
  STEAM_LINE_MOVE_PTS,
} from '../src/lib/steamMove.js';
import { resolveSteamLifecycle } from '../src/lib/steamTailPolicy.js';

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

// Closing Dime CIN @ CHC Over 8.5 · 2026-08-30: Pin ~−118 → ~−150 while limits $1k → $4k.
{
  const cinChc = {
    totalOpener: { t: now - 6 * 3600, line: 8.5, overOdds: -118, underOdds: -102, max: 1000 },
    totalCurrent: { line: 8.5, overOdds: -150, underOdds: 130, max: 4000, isMain: true },
    maxTotal: 4000,
    totalHistory: [
      { t: now - 6 * 3600, line: 8.5, overOdds: -118, underOdds: -102, max: 1000, isMain: true },
      { t: now - 3600, line: 8.5, overOdds: -122, underOdds: 102, max: 1000, isMain: true },
      { t: now - 60, line: 8.5, overOdds: -150, underOdds: 130, max: 4000, isMain: true },
    ],
  };
  const over = summarizeSteam(cinChc, { marketType: 'total', sideNorm: 'over', line: 8.5, nowSec: now });
  assert.equal(over.tier, 'gold', `CIN@CHC Over last-hour ${over.lastHour?.dropPct}`);
  assert.equal(over.limitRising, true, 'limits $1k → $4k');
  assert.equal(over.goldConfirmed, true, 'gold + limits = Closing Dime gold card');
  assert.ok(over.lastHour.dropPct >= 4.5, `last-hour drop ${over.lastHour.dropPct}%`);
  const under = summarizeSteam(cinChc, { marketType: 'total', sideNorm: 'under', line: 8.5, nowSec: now });
  assert.equal(under.goldConfirmed, false, 'Under is the steamed-against side');
}

assert.equal(STEAM_LINE_MOVE_PTS, 0.5);

// TNF 49ers @ Rams: main −3 → −3.5 toward the home. Juice on −3.5 eased (−113 → −109).
{
  const tnf = {
    commence: new Date((now + 2 * 3600) * 1000).toISOString(),
    spreadOpener: { t: now - 30 * 3600, homeLine: -3, awayLine: 3, homeOdds: -125, awayOdds: 105, isMain: true },
    spreadCurrent: { homeLine: -3.5, awayLine: 3.5, homeOdds: -109, awayOdds: -104, max: 7500, isMain: true },
    spreadHistory: [
      { t: now - 30 * 3600, homeLine: -3, awayLine: 3, homeOdds: -125, awayOdds: 105, isMain: true },
      { t: now - 3600, homeLine: -3.5, awayLine: 3.5, homeOdds: -113, awayOdds: -101, isMain: true },
      { t: now - 60, homeLine: -3.5, awayLine: 3.5, homeOdds: -109, awayOdds: -104, isMain: true },
      { t: now - 60, homeLine: -2.5, awayLine: 2.5, homeOdds: 105, awayOdds: -118, isMain: false },
    ],
    steamDrops: [],
  };
  const path = mainLineTowardTicket(tnf, { marketType: 'spread', sideNorm: 'home', nowSec: now });
  assert.equal(path.steam, true, 'home path is line steam');
  assert.ok(path.sinceOpenPts >= 0.5, `home toward ${path.sinceOpenPts}`);
  assert.equal(path.openLine, -3);
  assert.equal(path.nowLine, -3.5);

  const home = summarizeSteam(tnf, { marketType: 'spread', sideNorm: 'home', line: -3.5, nowSec: now });
  assert.equal(home.tier, 'steam', `Rams −3.5 tier ${home.tier} juice ${home.lastHour?.dropPct}`);
  assert.equal(home.show, true);
  assert.ok(home.lineMovePts >= 0.5, `lineMovePts ${home.lineMovePts}`);
  assert.ok(!(home.lastHour.dropPct > 0), 'pinned −3.5 juice eased — not juice steam');
  assert.match(home.tag, /−3 → −3\.5|-3 → -3\.5/);
  const stamp = compactSteam(home);
  assert.equal(stamp.tier, 'steam');
  assert.ok(stamp.lineMovePts >= 0.5);
  const life = resolveSteamLifecycle([], { steam: stamp });
  assert.equal(life.steamOnLock, true, 'Policy T sees line-move steam on lock');

  const away = summarizeSteam(tnf, { marketType: 'spread', sideNorm: 'away', line: 3.5, nowSec: now });
  assert.equal(away.show, false, '49ers +3.5 is the steamed-against side');
  assert.ok((away.lineMovePts || 0) < 0.5, `away lineMovePts ${away.lineMovePts}`);
}

// Totals: 47.5 → 48.5 is Over steam, not Under. Flat 0.0 is not an event.
{
  const tot = {
    totalOpener: { t: now - 6 * 3600, line: 47.5, overOdds: -110, underOdds: -110, max: 2000 },
    totalCurrent: { line: 48.5, overOdds: -108, underOdds: -112, max: 2000, isMain: true },
    totalHistory: [
      { t: now - 6 * 3600, line: 47.5, overOdds: -110, underOdds: -110, isMain: true },
      { t: now - 60, line: 48.5, overOdds: -108, underOdds: -112, isMain: true },
      { t: now - 60, line: 46.5, overOdds: 105, underOdds: -125, isMain: false },
    ],
  };
  const over = summarizeSteam(tot, { marketType: 'total', sideNorm: 'over', line: 47.5, nowSec: now });
  assert.equal(over.tier, 'steam', `Over 47.5 after main → 48.5 is ${over.tier}`);
  assert.ok(over.lineMovePts >= 0.5);
  const under = summarizeSteam(tot, { marketType: 'total', sideNorm: 'under', line: 47.5, nowSec: now });
  assert.equal(under.show, false, 'Under does not inherit Over line steam');

  const flatLine = summarizeSteam({
    spreadOpener: { homeLine: -3, awayLine: 3, homeOdds: -110, awayOdds: -110 },
    spreadCurrent: { homeLine: -3, awayLine: 3, homeOdds: -110, awayOdds: -110, isMain: true },
    spreadHistory: [
      { t: now - 4000, homeLine: -3, awayLine: 3, homeOdds: -110, awayOdds: -110, isMain: true },
      { t: now - 10, homeLine: -3, awayLine: 3, homeOdds: -110, awayOdds: -110, isMain: true },
    ],
  }, { marketType: 'spread', sideNorm: 'home', line: -3, nowSec: now });
  assert.equal(flatLine.show, false, 'unchanged main is not steam');
}

// Live prints after kickoff must not invent a −3 → −3.5 tag.
{
  const commence = now - 1800;
  const live = summarizeSteam({
    commence: new Date(commence * 1000).toISOString(),
    spreadOpener: { homeLine: -3, awayLine: 3, homeOdds: -125, awayOdds: 105 },
    spreadCurrent: { homeLine: -3.5, awayLine: 3.5, homeOdds: -109, awayOdds: -104, isMain: true },
    spreadHistory: [
      { t: commence - 60, homeLine: -3, awayLine: 3, homeOdds: -125, awayOdds: 105, isMain: true },
      { t: now - 30, homeLine: -3.5, awayLine: 3.5, homeOdds: -109, awayOdds: -104, isMain: true },
    ],
  }, { marketType: 'spread', sideNorm: 'home', line: -3.5, nowSec: now });
  assert.equal(live.frozen, true);
  assert.equal(live.show, false, 'post-commence main move is ignored');
}

console.log('testSteamMove: ok');

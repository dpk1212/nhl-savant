import assert from 'node:assert/strict';
import test from 'node:test';
import { polySteamForSide, polySteamPcts } from './polySteam.js';

test('a rising Polymarket price is a shorten, and the other side is against', () => {
  const day = [
    { t: 1_000, p: 0.60 },
    { t: 5_000, p: 0.62 },
    { t: 8_000, p: 0.65 },
  ];
  const hour = [
    { t: 4_400, p: 0.62 },
    { t: 8_000, p: 0.65 },
  ];
  const away = polySteamPcts(day, hour);
  assert.ok(away.sinceOpenPct > 0);
  assert.ok(away.lastHourPct > 0);
  assert.equal(away.sinceOpenPct, 7.74);
  assert.equal(away.lastHourPct, 4.70);
  const home = polySteamPcts(day, hour, { complement: true });
  assert.ok(home.sinceOpenPct < 0);
  assert.ok(home.lastHourPct < 0);
});

test('one point is not a move, and a stored side is read back', () => {
  assert.equal(polySteamPcts([{ t: 1, p: 0.5 }], []), null);
  assert.deepEqual(
    polySteamForSide({ home: { lastHourPct: 1.2, sinceOpenPct: -3 } }, 'home'),
    { lastHourPct: 1.2, sinceOpenPct: -3 },
  );
  assert.equal(polySteamForSide({ away: { lastHourPct: null, sinceOpenPct: null } }, 'away'), null);
});

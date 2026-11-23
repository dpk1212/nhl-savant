import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRUSTED_TOTAL_FROM,
  TRUSTED_TOTAL_HEAVY_STAKES,
  TRUSTED_TOTAL_STAMP_FIELDS,
  applyTrustedTotalPath,
  firstSightSteam,
  trustedTotalLive,
  trustedTotalOpensSide,
  trustedTotalRead,
  trustedTotalRung,
  trustedTotalStamp,
} from './trustedTotalPath.js';

const DAY = TRUSTED_TOTAL_FROM;

/**
 * A morning list. `up` wallets are on the NBA totals list; `down` wallets
 * have an NBA totals record and are not up; `z` sets a record by wallet.
 */
function listOf({ up = [], down = [], z = {}, sport = 'NBA' } = {}) {
  const index = new Map();
  // A moneyline name: the list built. It must never count on a total.
  index.set('ML|mlonly', { trusted: true, standing: 0.95, score: 0.03, n: 30, sports: ['NBA'], bySport: {} });
  for (const w of up) index.set(`TOTAL|${w}`, { trusted: false, bySport: { [sport]: { z: z[w] ?? 1.2, n: 14, up: true } } });
  for (const w of down) index.set(`TOTAL|${w}`, { trusted: false, bySport: { [sport]: { z: z[w] ?? -0.8, n: 14, up: false } } });
  return index;
}

/** A live position. `steam` is the percent since the open on its first sight; null is no tape. */
function pos(wallet, side, steam = 3, { invested = 500, hoursOut = 5, marketType = 'TOTAL', sport = 'NBA' } = {}) {
  return {
    wallet: `0x0000${wallet}`, walletShort: wallet, side, invested, marketType, sport,
    ticketTapeLog: steam == null ? null : [
      { gate: 'first', hoursOut, sinceOpenPct: steam, offer: -108, fair: -104 },
      { gate: 't60', hoursOut: 1, sinceOpenPct: steam + 2 },
    ],
  };
}

const LIST = listOf({ up: ['aaaaa1', 'aaaaa2', 'bbbbb1'], down: ['ccccc1', 'ccccc2'] });

function run(over = {}) {
  return applyTrustedTotalPath({
    units: 0, pickDate: DAY, sport: 'NBA', market: 'TOTAL', side: 'over',
    positions: [pos('aaaaa1', 'over')], odds: -110, list: LIST, ...over,
  });
}

test('live from its first day, and the 1u rung is stamped only', () => {
  assert.equal(TRUSTED_TOTAL_FROM, '2026-11-23');
  assert.equal(trustedTotalLive('2026-11-22'), false);
  assert.equal(trustedTotalLive('2026-11-23'), true);
  assert.equal(TRUSTED_TOTAL_HEAVY_STAKES, false);
});

test('3u: a list wallet, steam 1% up to 8%, and nobody on the other side', () => {
  const p = run();
  assert.equal(p.action, 'STAKE');
  assert.equal(p.reason, 'unopposed');
  assert.equal(p.units, 3);
  assert.equal(p.rung, 3);
  assert.equal(p.margin, 1);
  assert.equal(p.steam, 3);
  assert.equal(p.walletsAgainst, 0);
  assert.deepEqual(p.wallets, ['aaaaa1']);
});

test('3u replaces what the rungs before it wrote, up or down', () => {
  for (const units of [0, 1, 2, 3, 5]) {
    const p = run({ units });
    assert.equal(p.action, 'STAKE');
    assert.equal(p.units, 3);
    assert.equal(p.unitsPre, units);
  }
});

test('the steam band: 1% is in, 7.99% is in, under 1% and 8% are out of the 3u rung', () => {
  assert.equal(run({ positions: [pos('aaaaa1', 'over', 1)] }).units, 3);
  assert.equal(run({ positions: [pos('aaaaa1', 'over', 7.99)] }).units, 3);
  const flat = run({ positions: [pos('aaaaa1', 'over', 0.99)], units: 2 });
  assert.equal(flat.action, 'MUTE');
  assert.equal(flat.reason, 'not_shortened');
  assert.equal(flat.units, 0);
  const against = run({ positions: [pos('aaaaa1', 'over', -4)] });
  assert.equal(against.action, 'PASS');
  assert.equal(against.reason, 'not_shortened_no_stake');
  const heavy = run({ positions: [pos('aaaaa1', 'over', 8)] });
  assert.equal(heavy.rung, 1);
  assert.equal(heavy.units, 0);
  assert.equal(heavy.reason, 'heavy_steam_stamp_only_no_stake');
});

test('any tracked wallet on the other side ends the 3u rung, on the list or not', () => {
  // An unlisted wallet with no record at all against: records ahead by 1.2, so 2u.
  const p = run({ positions: [pos('aaaaa1', 'over'), pos('zzzzz9', 'under')] });
  assert.equal(p.walletsAgainst, 1);
  assert.equal(p.action, 'STAKE');
  assert.equal(p.units, 2);
  assert.equal(p.reason, 'opposed_records_ahead');
});

test('2u: opposed, and the sport records ahead by 1 or more', () => {
  // 1.2 for, −0.8 against: ahead by 2.0.
  const p = run({ positions: [pos('aaaaa1', 'over'), pos('ccccc1', 'under')] });
  assert.equal(p.action, 'STAKE');
  assert.equal(p.units, 2);
  assert.equal(p.rung, 2);
  assert.ok(Math.abs(p.recordLead - 2) < 1e-9);
  // Exactly 1 is in.
  const edge = run({
    positions: [pos('aaaaa1', 'over'), pos('ccccc1', 'under')],
    list: listOf({ up: ['aaaaa1'], down: ['ccccc1'], z: { aaaaa1: 1.5, ccccc1: 0.5 } }),
  });
  assert.equal(edge.units, 2);
});

test('0: opposed with the sport records ahead by under 1, and a stake that arrived is muted', () => {
  const list = listOf({ up: ['aaaaa1'], down: ['ccccc1'], z: { aaaaa1: 1.2, ccccc1: 0.4 } });
  const none = run({ positions: [pos('aaaaa1', 'over'), pos('ccccc1', 'under')], list });
  assert.equal(none.action, 'PASS');
  assert.equal(none.reason, 'opposed_records_short_no_stake');
  assert.equal(none.units, 0);
  const had = run({ positions: [pos('aaaaa1', 'over'), pos('ccccc1', 'under')], list, units: 3 });
  assert.equal(had.action, 'MUTE');
  assert.equal(had.reason, 'opposed_records_short');
  assert.equal(had.units, 0);
  assert.equal(had.unitsPre, 3);
});

test('the gate: list wallets for minus list wallets against has to be 1 or more', () => {
  // One list wallet each way.
  const even = run({ positions: [pos('aaaaa1', 'over'), pos('bbbbb1', 'under')], units: 2 });
  assert.equal(even.action, 'MUTE');
  assert.equal(even.reason, 'not_ahead');
  assert.equal(even.margin, 0);
  // Behind.
  const behind = run({ side: 'under', positions: [pos('aaaaa1', 'over'), pos('aaaaa2', 'over'), pos('bbbbb1', 'under')] });
  assert.equal(behind.reason, 'behind_no_stake');
  assert.equal(behind.margin, -1);
  // Wallets with a record that are not up do not make a list.
  const down = run({ positions: [pos('ccccc1', 'over'), pos('ccccc2', 'over')], units: 1 });
  assert.equal(down.action, 'MUTE');
  assert.equal(down.reason, 'no_list_wallet');
  // Two against one is ahead by 1.
  const two = run({ positions: [pos('aaaaa1', 'over'), pos('aaaaa2', 'over'), pos('bbbbb1', 'under')] });
  assert.equal(two.margin, 1);
  assert.deepEqual(two.against, ['bbbbb1']);
});

test('no stored steam read is 0: a side with no first-sight tape does not stake', () => {
  const p = run({ positions: [pos('aaaaa1', 'over', null)], units: 2 });
  assert.equal(p.action, 'MUTE');
  assert.equal(p.reason, 'no_open_read');
  assert.equal(p.steam, null);
  assert.equal(p.steamReads, 0);
});

test('the first sight has to be before the start, and a string tape reads the same', () => {
  assert.equal(firstSightSteam(pos('aaaaa1', 'over', 4)), 4);
  assert.equal(firstSightSteam(pos('aaaaa1', 'over', 4, { hoursOut: 0 })), null);
  assert.equal(firstSightSteam(pos('aaaaa1', 'over', 4, { hoursOut: -0.5 })), null);
  assert.equal(firstSightSteam({ ticketTapeLog: [{ gate: 't60', hoursOut: 1, sinceOpenPct: 9 }] }), null);
  assert.equal(firstSightSteam({ ticketTapeLog: [{ gate: 'first', hoursOut: 3 }] }), null);
  assert.equal(firstSightSteam({ ticketTapeLog: JSON.stringify([{ gate: 'first', hoursOut: 3, sinceOpenPct: 2.5 }]) }), 2.5);
  assert.equal(firstSightSteam({ ticketTapeLog: 'not json' }), null);
  assert.equal(firstSightSteam({}), null);
});

test('steam is the middle wallet on the side, the lower one of two, listed or not', () => {
  // Three wallets on the side: 2, 6, 12 → 6.
  const three = trustedTotalRead({
    side: 'over', sport: 'NBA', list: LIST,
    positions: [pos('aaaaa1', 'over', 12), pos('zzzzz1', 'over', 2), pos('zzzzz2', 'over', 6)],
  });
  assert.equal(three.steam, 6);
  assert.equal(three.steamReads, 3);
  // Two wallets: 2 and 12 → 2, the lower.
  const two = trustedTotalRead({
    side: 'over', sport: 'NBA', list: LIST,
    positions: [pos('aaaaa1', 'over', 12), pos('zzzzz1', 'over', 2)],
  });
  assert.equal(two.steam, 2);
  // A wallet with no tape is left out of the middle; the other side's steam is not read.
  const gap = trustedTotalRead({
    side: 'over', sport: 'NBA', list: LIST,
    positions: [pos('aaaaa1', 'over', 5), pos('zzzzz1', 'over', null), pos('zzzzz2', 'under', 30)],
  });
  assert.equal(gap.steam, 5);
  assert.equal(gap.steamReads, 1);
  assert.equal(gap.walletsFor, 2);
});

test('a wallet on both sides counts once, on its larger ticket, with that ticket\'s tape', () => {
  const p = run({
    positions: [
      pos('aaaaa1', 'over', 3, { invested: 900 }),
      pos('aaaaa1', 'under', 20, { invested: 100 }),
      pos('aaaaa1', 'over', 6, { invested: 200 }),
    ],
  });
  assert.equal(p.walletsFor, 1);
  assert.equal(p.walletsAgainst, 0);
  assert.equal(p.steam, 3);
  assert.equal(p.units, 3);
  // The larger ticket is on the other side: the wallet is against.
  const flipped = run({
    positions: [pos('aaaaa1', 'over', 3, { invested: 100 }), pos('aaaaa1', 'under', 3, { invested: 900 })],
  });
  assert.equal(flipped.margin, -1);
  assert.equal(flipped.units, 0);
});

test('heavy steam, 8% or more: the 1u rung is stamped and not staked, and a list wallet against is 0', () => {
  const clear = run({ positions: [pos('aaaaa1', 'over', 11), pos('ccccc1', 'under')], units: 2 });
  assert.equal(clear.rung, 1);
  assert.equal(clear.action, 'MUTE');
  assert.equal(clear.reason, 'heavy_steam_stamp_only');
  assert.equal(clear.units, 0);
  const opposed = run({
    positions: [pos('aaaaa1', 'over', 11), pos('aaaaa2', 'over', 11), pos('bbbbb1', 'under')], units: 2,
  });
  assert.equal(opposed.rung, 0);
  assert.equal(opposed.reason, 'heavy_steam_opposed');
  assert.equal(opposed.units, 0);
  assert.deepEqual(trustedTotalRung({ margin: 1, listFor: ['a'], listAgainst: [], steam: 9, walletsAgainst: 0, recordLead: 0 }),
    { rung: 1, units: 0, reason: 'heavy_steam_stamp_only' });
});

test('the sport on the position decides the record: an NBA list wallet is nobody on an NHL total', () => {
  const p = run({ sport: 'NHL', positions: [pos('aaaaa1', 'over', 3, { sport: 'NHL' })], units: 1 });
  assert.equal(p.action, 'MUTE');
  assert.equal(p.reason, 'no_list_wallet');
  // A position with no sport reads the sport of the pick.
  const bare = { ...pos('aaaaa1', 'over'), sport: undefined };
  assert.equal(run({ positions: [bare] }).units, 3);
});

test('rows from another market on the game are not read', () => {
  const p = run({ positions: [pos('aaaaa1', 'over'), pos('bbbbb1', 'under', 3, { marketType: 'SPREAD' })] });
  assert.equal(p.walletsAgainst, 0);
  assert.equal(p.units, 3);
});

test('the price: no number is 0, juicier than −425 is 0, −425 is in, a 0–1 price reads the same', () => {
  const none = run({ odds: null, units: 2 });
  assert.equal(none.action, 'MUTE');
  assert.equal(none.reason, 'no_price');
  assert.equal(none.rung, 3);
  const juiced = run({ odds: -430 });
  assert.equal(juiced.action, 'PASS');
  assert.equal(juiced.reason, 'juice_no_stake');
  assert.equal(run({ odds: -425 }).units, 3);
  assert.equal(run({ odds: 135 }).units, 3);
  assert.equal(run({ odds: null, price: 0.5 }).units, 3);
  assert.equal(run({ odds: null, price: 0.9 }).reason, 'juice_no_stake');
});

test('manual stake, operator kill, and an earlier date are left alone', () => {
  for (const [over, reason] of [[{ manual: true }, 'manual'], [{ killed: true }, 'killed'], [{ pickDate: '2026-11-22' }, 'not_live']]) {
    const p = run({ units: 5, ...over });
    assert.equal(p.action, 'EXEMPT');
    assert.equal(p.reason, reason);
    assert.equal(p.units, 5);
    assert.equal(p.fires, false);
  }
  const other = run({ market: 'SPREAD', units: 4 });
  assert.equal(other.action, 'PASS');
  assert.equal(other.reason, 'not_total');
  assert.equal(other.units, 4);
});

test('a manual stake on the other side is the bet: the ladder side is 0', () => {
  const p = run({ manualAgainst: true });
  assert.equal(p.action, 'PASS');
  assert.equal(p.reason, 'manual_against_no_stake');
  assert.equal(p.units, 0);
  assert.equal(p.rung, 3);
  assert.equal(run({ manualAgainst: true, units: 2 }).action, 'MUTE');
});

test('a morning with no list, or no totals sport records, is 0 on every total', () => {
  const empty = run({ list: new Map(), units: 3 });
  assert.equal(empty.action, 'MUTE');
  assert.equal(empty.reason, 'no_list');
  assert.equal(empty.units, 0);
  const noRecords = new Map([['ML|mlonly', { trusted: true, bySport: {} }]]);
  const p = run({ list: noRecords, units: 3 });
  assert.equal(p.action, 'MUTE');
  assert.equal(p.reason, 'no_records');
  assert.equal(run({ list: noRecords }).action, 'PASS');
});

test('the side opens only when the ladder stakes it', () => {
  const base = { pickDate: DAY, sport: 'NBA', side: 'over', list: LIST };
  assert.equal(trustedTotalOpensSide({ ...base, positions: [pos('aaaaa1', 'over')] }), true);
  assert.equal(trustedTotalOpensSide({ ...base, positions: [pos('aaaaa1', 'over'), pos('ccccc1', 'under')] }), true);
  // The other side of the same game.
  assert.equal(trustedTotalOpensSide({ ...base, side: 'under', positions: [pos('aaaaa1', 'over')] }), false);
  // Stamp-only rung, no steam, an earlier date, another market, no list.
  assert.equal(trustedTotalOpensSide({ ...base, positions: [pos('aaaaa1', 'over', 12)] }), false);
  assert.equal(trustedTotalOpensSide({ ...base, positions: [pos('aaaaa1', 'over', 0)] }), false);
  assert.equal(trustedTotalOpensSide({ ...base, pickDate: '2026-11-22', positions: [pos('aaaaa1', 'over')] }), false);
  assert.equal(trustedTotalOpensSide({ ...base, market: 'ML', positions: [pos('aaaaa1', 'over')] }), false);
  assert.equal(trustedTotalOpensSide({ ...base, list: new Map(), positions: [pos('aaaaa1', 'over')] }), false);
});

test('only one side of a game can pass the gate', () => {
  const positions = [pos('aaaaa1', 'over'), pos('aaaaa2', 'over'), pos('bbbbb1', 'under'), pos('ccccc1', 'under')];
  const over = run({ positions });
  const under = run({ side: 'under', positions });
  assert.equal(over.margin, 1);
  assert.equal(under.margin, -1);
  assert.equal(under.units, 0);
});

test('the stamp carries every field on every total the path looked at, and nothing elsewhere', () => {
  const stake = trustedTotalStamp(run({ positions: [pos('aaaaa1', 'over', 3.456), pos('ccccc1', 'under')], units: 1 }));
  assert.deepEqual(Object.keys(stake).sort(), [...TRUSTED_TOTAL_STAMP_FIELDS].sort());
  assert.equal(stake.v8_trustedTotal, true);
  assert.equal(stake.v8_trustedTotalAction, 'STAKE');
  assert.equal(stake.v8_trustedTotalReason, 'opposed_records_ahead');
  assert.equal(stake.v8_trustedTotalUnits, 2);
  assert.equal(stake.v8_trustedTotalRung, 2);
  assert.equal(stake.v8_trustedTotalSteam, 3.46);
  assert.equal(stake.v8_trustedTotalRecordLead, 2);
  assert.equal(stake.v8_trustedTotalWalletsAgainst, 1);
  assert.equal(stake.v8_unitsPreTrustedTotal, 1);
  const pass = trustedTotalStamp(run({ positions: [pos('aaaaa1', 'over', 0)] }));
  assert.deepEqual(Object.keys(pass).sort(), [...TRUSTED_TOTAL_STAMP_FIELDS].sort());
  assert.equal(pass.v8_trustedTotal, false);
  assert.equal(pass.v8_trustedTotalUnits, 0);
  // The 1u rung while it is stamped only: the rung reads 1, the stake 0.
  const heavy = trustedTotalStamp(run({ positions: [pos('aaaaa1', 'over', 9)] }));
  assert.equal(heavy.v8_trustedTotalRung, 1);
  assert.equal(heavy.v8_trustedTotalUnits, 0);
  assert.deepEqual(trustedTotalStamp(run({ pickDate: '2026-11-22' })), {});
  assert.deepEqual(trustedTotalStamp(run({ market: 'ML' })), {});
  assert.deepEqual(trustedTotalStamp(null), {});
  // Manual and killed sides are stamped as looked at and left.
  assert.equal(trustedTotalStamp(run({ manual: true, units: 4 })).v8_trustedTotalAction, 'EXEMPT');
});

test('a side that carries the path\'s stake from an earlier scan and no longer earns it is muted', () => {
  // A wallet arrived on the other side and the records are short. The rungs before it left 0.
  const list = listOf({ up: ['aaaaa1'], down: ['ccccc1'], z: { aaaaa1: 1.2, ccccc1: 0.4 } });
  const positions = [pos('aaaaa1', 'over'), pos('ccccc1', 'under')];
  const fresh = run({ positions, list });
  assert.equal(fresh.action, 'PASS');
  const held = run({ positions, list, staked: true });
  assert.equal(held.action, 'MUTE');
  assert.equal(held.reason, 'opposed_records_short');
  assert.equal(held.units, 0);
  assert.equal(held.fires, true);
  // The same when the list is gone, or the price went past the juice line.
  assert.equal(run({ list: new Map(), staked: true }).action, 'MUTE');
  assert.equal(run({ odds: -500, staked: true }).reason, 'juice');
  // A side that still earns the stake keeps it; a wallet on the other side with the records ahead is 2u.
  assert.equal(run({ staked: true }).units, 3);
  assert.equal(run({ positions: [pos('aaaaa1', 'over'), pos('ccccc1', 'under')], staked: true }).units, 2);
  // Manual and killed sides are still left alone.
  assert.equal(run({ manual: true, staked: true, units: 3 }).action, 'EXEMPT');
});

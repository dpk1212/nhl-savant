import assert from 'node:assert/strict';
import test from 'node:test';
import { oddsCap } from './oddsCap.js';
import {
  T5_NO_T5_ST_FROM,
  T5_NO_T5_ST_MUTED_BY,
  applyT5Lead,
  buildT5SeasonLedger,
  seasonStartFromDates,
  setT5SeasonLedger,
  t5GoldLead,
  t5HoldDays,
  t5LeadStamp,
  t5MarginKind,
  t5MorningRead,
  t5OppHasT5,
  t5Seat,
  t5StMarket,
  t5StSteamOn,
} from './t5LeadPolicy.js';

function iso(n) {
  return new Date(Date.UTC(2026, 0, 1) + n * 86400000).toISOString().slice(0, 10);
}

function wins(day, n, price = 0.4) {
  const rows = [];
  for (let i = 0; i < n; i += 1) rows.push({ date: iso(day), price, won: true, key: `${day}-${i}` });
  return rows;
}

function book(id, rows, seasonStart = '2026-10-01') {
  return {
    sports: {
      NBA: {
        seasonStart,
        wallets: {
          [id]: rows.map((r) => [r.date, Math.round(r.price * 1000), r.won ? 1 : 0]),
        },
      },
    },
  };
}

function winsDate(date, n, price = 0.4) {
  const rows = [];
  for (let i = 0; i < n; i += 1) rows.push({ date, price, won: true, key: `${date}-${i}` });
  return rows;
}

function details(id, side, invested = 100) {
  return [{ wallet: id, side, invested }];
}

function nbaBook(wallets, seasonStart = '2026-10-01') {
  const packed = {};
  for (const [id, rows] of Object.entries(wallets)) {
    packed[id] = rows.map((r) => [r.date, Math.round(r.price * 1000), r.won ? 1 : 0]);
  }
  return { sports: { NBA: { seasonStart, wallets: packed } } };
}

function leadWallets(id) {
  return [...details(id, 'home'), { wallet: 'bbbbbb', side: 'away', invested: 50 }];
}

test('season start is the first date after the last 21-day gap', () => {
  assert.equal(seasonStartFromDates(['2026-06-20', '2026-08-20', '2026-10-06']), '2026-10-06');
  assert.equal(seasonStartFromDates(['2026-10-06', '2026-10-20']), '2026-10-06');
});

test('a 15-day tier-5 book qualifies and a 14-day book does not', () => {
  const rows = wins(0, 10);
  const young = t5MorningRead(rows, iso(14), iso(0));
  const old = t5MorningRead(rows, iso(15), iso(0));
  assert.equal(young.qualifies, false);
  assert.equal(young.tier, 5);
  assert.equal(old.qualifies, true);
  assert.equal(old.age, 15);
  assert.equal(old.status, 'STABLE_ON');
});

test('held days are the calendar gap back to the first still-qualifying morning', () => {
  const rows = wins(0, 10);
  const first = t5HoldDays(rows, iso(15), iso(0));
  assert.equal(first.qualifies, true);
  assert.equal(first.held, 0);
  const six = t5HoldDays(rows, iso(21), iso(0));
  assert.equal(six.held, 6);
  const fourteen = t5HoldDays(rows, iso(29), iso(0));
  assert.equal(fourteen.held, 14);
});

test('a morning that falls off tier 5 breaks the hold', () => {
  const rows = [
    ...wins(0, 10, 0.4),
    ...Array.from({ length: 10 }, (_, i) => ({ date: iso(18), price: 0.9, won: false, key: `L${i}` })),
  ];
  const before = t5HoldDays(rows, iso(18), iso(0));
  assert.equal(before.qualifies, true);
  const after = t5MorningRead(rows, iso(19), iso(0));
  assert.equal(after.qualifies, false);
  const restarted = t5HoldDays(rows, iso(19), iso(0));
  assert.equal(restarted.qualifies, false);
});

test('a 6-day lead stays at 2–5 and a 14-day lead stays at 3–6', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-18', 10), '2026-10-18'));
  const wallets = leadWallets(id);
  const sixLow = applyT5Lead({
    units: 1, pickDate: '2026-11-08', odds: 150, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(sixLow.seat.id, 'lead6');
  assert.equal(sixLow.action, 'BAND');
  assert.equal(sixLow.units, 2);
  const sixKeep = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -110, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(sixKeep.action, 'PASS');
  assert.equal(sixKeep.units, 4);
  const sixHigh = applyT5Lead({
    units: 6, pickDate: '2026-11-08', odds: -110, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(sixHigh.units, 5);

  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const longLow = applyT5Lead({
    units: 2.5, pickDate: '2026-11-08', odds: -110, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(longLow.seat.id, 'lead14');
  assert.equal(longLow.action, 'BAND');
  assert.equal(longLow.units, 3);
  const longKeep = applyT5Lead({
    units: 5, pickDate: '2026-11-08', odds: -110, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(longKeep.action, 'PASS');
  assert.equal(longKeep.units, 5);
  const longHigh = applyT5Lead({
    units: 7, pickDate: '2026-11-08', odds: -110, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(longHigh.units, 6);
});

test('a not-yet-6 lead sits at 2–3', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-22', 10), '2026-10-22'));
  const out = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -110, walletDetails: leadWallets(id), sport: 'NBA', side: 'home',
  });
  assert.equal(out.seat.id, 't5_young');
  assert.equal(out.units, 3);
  const low = applyT5Lead({
    units: 1, pickDate: '2026-11-08', odds: -110, walletDetails: leadWallets(id), sport: 'NBA', side: 'home',
  });
  assert.equal(low.units, 2);
});

test('no tier 5 and a lead the other way both cap at 2', () => {
  setT5SeasonLedger({ sports: { NBA: { seasonStart: '2026-10-18', wallets: {} } } });
  const empty = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -110, walletDetails: details('cccccc', 'home'), sport: 'NBA', side: 'home',
  });
  assert.equal(empty.seat.id, 'no_t5');
  assert.equal(empty.units, 2);
  assert.equal(t5OppHasT5(empty.lead), false);

  const rows = winsDate('2026-10-18', 10);
  setT5SeasonLedger({
    sports: {
      NBA: {
        seasonStart: '2026-10-18',
        wallets: {
          aaaaaa: book('aaaaaa', rows, '2026-10-18').sports.NBA.wallets.aaaaaa,
          bbbbbb: book('bbbbbb', rows, '2026-10-18').sports.NBA.wallets.bbbbbb,
        },
      },
    },
  });
  const tied = applyT5Lead({
    units: 4,
    pickDate: '2026-11-08',
    odds: -110,
    walletDetails: [...details('aaaaaa', 'home'), ...details('bbbbbb', 'away')],
    sport: 'NBA',
    side: 'home',
  });
  assert.equal(tied.lead.lead, false);
  assert.equal(tied.seat.id, 'no_lead');
  assert.equal(tied.units, 2);
  assert.equal(t5OppHasT5(tied.lead), true);
});

test('a wallet on both sides is dropped', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-18', 10), '2026-10-18'));
  const out = applyT5Lead({
    units: 2,
    pickDate: '2026-11-08',
    odds: -110,
    walletDetails: [...details(id, 'home'), ...details(id, 'away')],
    sport: 'NBA',
    side: 'home',
  });
  assert.equal(out.lead.f, 0);
  assert.equal(out.seat.id, 'no_t5');
});

test('press-edge rescue is 1 unit at T5-LEAD and the floor does not lift it', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const out = applyT5Lead({
    units: 0,
    pickDate: '2026-11-08',
    odds: -110,
    walletDetails: details(id, 'home'),
    sport: 'NBA',
    side: 'home',
    pressEdgeMuted: true,
  });
  assert.equal(out.action, 'RESCUE');
  assert.equal(out.units, 1);
  assert.equal(out.seat.id, 'lead14');
  assert.equal(out.tier, 'T5-LEAD');
  const held = applyT5Lead({
    units: 1,
    pickDate: '2026-11-08',
    odds: -110,
    walletDetails: details(id, 'home'),
    sport: 'NBA',
    side: 'home',
    fromRescue: true,
  });
  assert.equal(held.units, 1);
  assert.equal(held.action, 'PASS');
});

test('press-edge with no tier 5 comes back at 1 and a young tier 5 stays muted', () => {
  setT5SeasonLedger({ sports: { NBA: { seasonStart: '2026-10-18', wallets: {} } } });
  const none = applyT5Lead({
    units: 0, pickDate: '2026-11-08', odds: -110, walletDetails: details('cccccc', 'home'),
    sport: 'NBA', side: 'home', pressEdgeMuted: true,
  });
  assert.equal(none.action, 'RESCUE');
  assert.equal(none.reason, 't5_no_t5_rescue');
  assert.equal(none.units, 1);

  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-22', 10), '2026-10-22'));
  const young = applyT5Lead({
    units: 0, pickDate: '2026-11-08', odds: -110, walletDetails: details(id, 'home'),
    sport: 'NBA', side: 'home', pressEdgeMuted: true,
  });
  assert.equal(young.action, 'PASS');
  assert.equal(young.units, 0);
  assert.equal(young.seat.id, 't5_young');
});

test('a mute that already zeroed the side stays at 0', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-18', 10), '2026-10-18'));
  const out = applyT5Lead({
    units: 0,
    pickDate: '2026-11-08',
    odds: -110,
    walletDetails: details(id, 'home'),
    sport: 'NBA',
    side: 'home',
    pressEdgeMuted: true,
    blocked: true,
  });
  assert.equal(out.action, 'PASS');
  assert.equal(out.units, 0);
});

test('a manual stake stays as set', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const out = applyT5Lead({
    units: 3,
    pickDate: '2026-11-08',
    odds: -110,
    walletDetails: details(id, 'home'),
    sport: 'NBA',
    side: 'home',
    manual: true,
  });
  assert.equal(out.action, 'PASS');
  assert.equal(out.units, 3);
  assert.equal(out.reason, 'manual');
});

test('the rule does not run before the ship date', () => {
  const out = applyT5Lead({
    units: 2, pickDate: '2026-11-07', odds: -110, walletDetails: details('aaaaaa', 'home'), sport: 'NBA', side: 'home',
  });
  assert.equal(out.action, 'EXEMPT');
  assert.equal(out.units, 2);
});

test('a missing ledger is not a no-tier-5 seat', () => {
  setT5SeasonLedger(null);
  const out = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -110, walletDetails: details('aaaaaa', 'home'), sport: 'NBA', side: 'home',
  });
  assert.equal(out.action, 'PASS');
  assert.equal(out.units, 4);
  assert.equal(out.seat, null);
  assert.equal(t5OppHasT5(out.lead), null);
  assert.equal(t5Seat(out.lead), null);
});

test('spreads and totals use the same seats', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const over = applyT5Lead({
    units: 1, pickDate: '2026-11-08', odds: -110,
    walletDetails: details(id, 'over'), sport: 'NBA', side: 'over',
  });
  assert.equal(over.seat.id, 'lead14');
  assert.equal(over.units, 3);
});

test('odds cap after the band can sit a long dog under its floor', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const band = applyT5Lead({
    units: 1, pickDate: '2026-11-08', odds: 200, walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
  });
  assert.equal(band.units, 3);
  assert.equal(oddsCap(band.units, 200), 1);
});

test('gold is a 14-day T5 with nobody T5 against, not the lead14 seat', () => {
  const ours = winsDate('2026-10-10', 10);
  const young = winsDate('2026-10-24', 10);
  const long = winsDate('2026-10-10', 10);
  setT5SeasonLedger(nbaBook({ aaaaaa: ours }, '2026-10-10'));
  const emptyAg = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -169,
    walletDetails: details('aaaaaa', 'home'), sport: 'NBA', side: 'home',
  });
  assert.equal(emptyAg.seat.id, 'lead14');
  assert.equal(emptyAg.gold, true);
  assert.equal(t5GoldLead(emptyAg.lead), true);
  assert.equal(emptyAg.lead.for14, 1);
  assert.equal(emptyAg.lead.a, 0);

  setT5SeasonLedger(nbaBook({ aaaaaa: ours, bbbbbb: young }, '2026-10-10'));
  const youngAg = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -110,
    walletDetails: [...details('aaaaaa', 'home'), ...details('bbbbbb', 'away')],
    sport: 'NBA', side: 'home',
  });
  assert.equal(youngAg.seat.id, 'no_lead');
  assert.equal(youngAg.gold, false);
  assert.equal(youngAg.lead.a, 1);
  assert.equal(youngAg.lead.holdAgainst, 0);
  assert.equal(t5MarginKind(youngAg.lead), 'lead14');

  setT5SeasonLedger(nbaBook({ aaaaaa: ours, bbbbbb: long }, '2026-10-10'));
  const longAg = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -114,
    walletDetails: [...details('aaaaaa', 'home'), ...details('bbbbbb', 'away')],
    sport: 'NBA', side: 'home',
  });
  assert.equal(longAg.gold, false);
  assert.equal(longAg.lead.ag14, 1);
  assert.equal(t5GoldLead(longAg.lead), false);
});

test('a muted side with gold wallets stays v8_gold false and still writes hold counts', () => {
  setT5SeasonLedger(book('aaaaaa', winsDate('2026-10-10', 10), '2026-10-10'));
  const out = applyT5Lead({
    units: 0, pickDate: '2026-11-08', odds: -106,
    walletDetails: details('aaaaaa', 'home'), sport: 'NBA', side: 'home',
    blocked: true,
  });
  assert.equal(out.units, 0);
  assert.equal(out.gold, false);
  const stamp = t5LeadStamp(out);
  assert.equal(stamp.v8_gold, false);
  assert.equal(stamp.v8_t5LeadFor14, 1);
  assert.equal(stamp.v8_t5LeadAg14, 0);
  assert.equal(stamp.v8_t5LeadFor6, 1);
  assert.equal(stamp.v8_t5LeadAg6, 0);
  assert.equal(stamp.v8_edgeBoost, 0);
  assert.equal(stamp.v8_edgeBoostEdge, null);
});

test('a 14-day or 6-day margin with winner-align edge 11 or more adds 1 unit', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const four = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -169,
    walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
    winnerAlignEdge: 11,
  });
  assert.equal(four.margin, 'lead14');
  assert.equal(four.edgeBoost, 1);
  assert.equal(four.unitsPreEdgeBoost, 4);
  assert.equal(four.units, 5);
  assert.equal(four.gold, true);
  const stamp = t5LeadStamp(four);
  assert.equal(stamp.v8_gold, true);
  assert.equal(stamp.v8_edgeBoost, 1);
  assert.equal(stamp.v8_unitsPreEdgeBoost, 4);
  assert.equal(stamp.v8_edgeBoostEdge, 11);

  const atCeil = applyT5Lead({
    units: 6, pickDate: '2026-11-08', odds: -110,
    walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
    winnerAlignEdge: 12,
  });
  assert.equal(atCeil.unitsPreEdgeBoost, 6);
  assert.equal(atCeil.units, 7);

  const under = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -169,
    walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
    winnerAlignEdge: 10.9,
  });
  assert.equal(under.edgeBoost, 0);
  assert.equal(under.units, 4);
  assert.equal(under.gold, true);

  setT5SeasonLedger(book(id, winsDate('2026-10-18', 10), '2026-10-18'));
  const six = applyT5Lead({
    units: 5, pickDate: '2026-11-08', odds: -110,
    walletDetails: leadWallets(id), sport: 'NBA', side: 'home',
    winnerAlignEdge: 11,
  });
  assert.equal(six.margin, 'lead6');
  assert.equal(six.edgeBoost, 1);
  assert.equal(six.units, 6);
  assert.equal(six.gold, false);
});

test('somebody T5 against does not block the add, and a 14-day margin does not also get the 6-day add', () => {
  const ours = winsDate('2026-10-10', 10);
  const young = winsDate('2026-10-24', 10);
  setT5SeasonLedger(nbaBook({ aaaaaa: ours, cccccc: ours, bbbbbb: young }, '2026-10-10'));
  const out = applyT5Lead({
    units: 4, pickDate: '2026-11-08', odds: -110,
    walletDetails: [
      ...details('aaaaaa', 'home'),
      ...details('cccccc', 'home'),
      ...details('bbbbbb', 'away'),
    ],
    sport: 'NBA', side: 'home',
    winnerAlignEdge: 14,
  });
  assert.equal(out.seat.id, 'lead14');
  assert.equal(out.gold, false);
  assert.equal(out.lead.for14, 2);
  assert.equal(out.lead.ag14, 0);
  assert.equal(out.margin, 'lead14');
  assert.equal(out.edgeBoost, 1);
  assert.equal(out.units, 5);
});

test('a young T5 and a side with no T5 do not get the unit even at edge 20', () => {
  setT5SeasonLedger(book('aaaaaa', winsDate('2026-10-22', 10), '2026-10-22'));
  const young = applyT5Lead({
    units: 3, pickDate: '2026-11-08', odds: -365,
    walletDetails: details('aaaaaa', 'home'), sport: 'NBA', side: 'home',
    winnerAlignEdge: 20,
  });
  assert.equal(young.seat.id, 't5_young');
  assert.equal(young.margin, null);
  assert.equal(young.edgeBoost, 0);
  assert.equal(young.units, 3);
  assert.equal(young.gold, false);

  setT5SeasonLedger({ sports: { NBA: { seasonStart: '2026-10-18', wallets: {} } } });
  const none = applyT5Lead({
    units: 2, pickDate: '2026-11-08', odds: -110,
    walletDetails: details('cccccc', 'home'), sport: 'NBA', side: 'home',
    winnerAlignEdge: 20,
  });
  assert.equal(none.seat.id, 'no_t5');
  assert.equal(none.edgeBoost, 0);
  assert.equal(none.units, 2);
  assert.equal(none.gold, false);
});

test('a press-edge rescue stays at 1 and the add does not lift it', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const out = applyT5Lead({
    units: 0, pickDate: '2026-11-08', odds: -110,
    walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
    pressEdgeMuted: true, winnerAlignEdge: 14,
  });
  assert.equal(out.action, 'RESCUE');
  assert.equal(out.units, 1);
  assert.equal(out.edgeBoost, 0);
  const held = applyT5Lead({
    units: 1, pickDate: '2026-11-08', odds: -110,
    walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
    fromRescue: true, winnerAlignEdge: 14,
  });
  assert.equal(held.units, 1);
  assert.equal(held.edgeBoost, 0);
});

test('odds cap after the add can sit a long dog under its floor', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const band = applyT5Lead({
    units: 1, pickDate: '2026-11-08', odds: 200,
    walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
    winnerAlignEdge: 11,
  });
  assert.equal(band.unitsPreEdgeBoost, 3);
  assert.equal(band.units, 4);
  assert.equal(oddsCap(band.units, 200), 1);
});

test('a manual stake stays as set and still stamps gold when the wallets qualify', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const out = applyT5Lead({
    units: 3, pickDate: '2026-11-08', odds: -110,
    walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
    manual: true, winnerAlignEdge: 14,
  });
  assert.equal(out.action, 'PASS');
  assert.equal(out.units, 3);
  assert.equal(out.edgeBoost, 0);
  assert.equal(out.gold, true);
  assert.equal(out.reason, 'manual');
});

test('a no-tier-5 spread or total mutes when steam is off and keeps when juice steam is on', () => {
  setT5SeasonLedger({ sports: { NBA: { seasonStart: '2026-10-18', wallets: {} } } });
  const empty = details('cccccc', 'home');
  const off = applyT5Lead({
    units: 2, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: empty,
    sport: 'NBA', side: 'home', market: 'SPREAD', steamOn: false,
  });
  assert.equal(off.seat.id, 'no_t5');
  assert.equal(off.action, 'MUTE');
  assert.equal(off.units, 0);
  assert.equal(off.mutedBy, T5_NO_T5_ST_MUTED_BY);
  assert.equal(off.gold, false);
  const totalOff = applyT5Lead({
    units: 4, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: empty,
    sport: 'NBA', side: 'over', market: 'TOTAL', steamOn: false,
  });
  assert.equal(totalOff.units, 0);
  assert.equal(totalOff.action, 'MUTE');
  const on = applyT5Lead({
    units: 4, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: empty,
    sport: 'NBA', side: 'home', market: 'SPREAD', steamOn: true,
  });
  assert.equal(on.action, 'BAND');
  assert.equal(on.units, 2);
  assert.equal(on.mutedBy, null);
  assert.equal(on.steamOn, true);
  const goldSteam = applyT5Lead({
    units: 2, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: empty,
    sport: 'NBA', side: 'under', market: 'TOTAL', steamOn: true,
  });
  assert.equal(goldSteam.units, 2);
  assert.equal(goldSteam.action, 'PASS');
  const stamp = t5LeadStamp(off);
  assert.equal(stamp.v8_t5LeadAction, 'MUTE');
  assert.equal(stamp.v8_t5StSteamOn, false);
  assert.equal(stamp.v8_t5LeadUnits, 0);
});

test('a no-tier-5 moneyline is not cut by the S/T steam gate', () => {
  setT5SeasonLedger({ sports: { NBA: { seasonStart: '2026-10-18', wallets: {} } } });
  const ml = applyT5Lead({
    units: 4, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: details('cccccc', 'home'),
    sport: 'NBA', side: 'home', market: 'ML', steamOn: false,
  });
  assert.equal(ml.seat.id, 'no_t5');
  assert.equal(ml.units, 2);
  assert.equal(ml.action, 'BAND');
  assert.equal(ml.mutedBy, null);
});

test('T5 seats keep a spread or total even when steam is off', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-10', 10), '2026-10-10'));
  const long = applyT5Lead({
    units: 4, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: details(id, 'home'),
    sport: 'NBA', side: 'home', market: 'SPREAD', steamOn: false,
  });
  assert.equal(long.seat.id, 'lead14');
  assert.equal(long.units, 4);
  assert.equal(long.mutedBy, null);

  setT5SeasonLedger(book(id, winsDate('2026-10-22', 10), '2026-10-22'));
  const young = applyT5Lead({
    units: 3, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: details(id, 'home'),
    sport: 'NBA', side: 'home', market: 'TOTAL', steamOn: false,
  });
  assert.equal(young.seat.id, 't5_young');
  assert.equal(young.units, 3);
  assert.equal(young.mutedBy, null);

  const rows = winsDate('2026-10-18', 10);
  setT5SeasonLedger({
    sports: {
      NBA: {
        seasonStart: '2026-10-18',
        wallets: {
          aaaaaa: book('aaaaaa', rows, '2026-10-18').sports.NBA.wallets.aaaaaa,
          bbbbbb: book('bbbbbb', rows, '2026-10-18').sports.NBA.wallets.bbbbbb,
        },
      },
    },
  });
  const tied = applyT5Lead({
    units: 4, pickDate: T5_NO_T5_ST_FROM, odds: -110,
    walletDetails: [...details('aaaaaa', 'home'), ...details('bbbbbb', 'away')],
    sport: 'NBA', side: 'home', market: 'SPREAD', steamOn: false,
  });
  assert.equal(tied.seat.id, 'no_lead');
  assert.equal(tied.units, 2);
  assert.equal(tied.mutedBy, null);
});

test('the S/T steam mute does not run before Nov 10 and a 2 percent watch is off', () => {
  setT5SeasonLedger({ sports: { NBA: { seasonStart: '2026-10-18', wallets: {} } } });
  const empty = details('cccccc', 'home');
  const before = applyT5Lead({
    units: 4, pickDate: '2026-11-09', odds: -110, walletDetails: empty,
    sport: 'NBA', side: 'home', market: 'SPREAD', steamOn: false,
  });
  assert.equal(before.units, 2);
  assert.equal(before.action, 'BAND');
  assert.equal(before.mutedBy, null);
  assert.equal(t5StMarket('spread'), true);
  assert.equal(t5StMarket('ML'), false);
  assert.equal(t5StSteamOn({ juiceSteam: true, tier: 'steam', lastHourPct: 3.2 }), true);
  assert.equal(t5StSteamOn({ juiceSteam: true, tier: 'gold', lastHourPct: 5.1, goldConfirmed: true }), true);
  assert.equal(t5StSteamOn({ juiceSteam: false, tier: 'watch', lastHourPct: 2.1 }), false);
  assert.equal(t5StSteamOn({ juiceSteam: false, tier: 'steam', lastHourPct: -0.5 }), false);
  assert.equal(t5StSteamOn({ steam: { juiceSteam: true, tier: 'steam', sinceOpenPct: 3.4 } }), true);
  assert.equal(t5StSteamOn(null), false);
});

test('a no-tier-5 S/T press-edge zero stays off when steam is off and comes back at 1 when steam is on', () => {
  setT5SeasonLedger({ sports: { NBA: { seasonStart: '2026-10-18', wallets: {} } } });
  const empty = details('cccccc', 'home');
  const off = applyT5Lead({
    units: 0, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: empty,
    sport: 'NBA', side: 'home', market: 'SPREAD', steamOn: false, pressEdgeMuted: true,
  });
  assert.equal(off.action, 'PASS');
  assert.equal(off.units, 0);
  assert.equal(off.reason, null);
  const on = applyT5Lead({
    units: 0, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: empty,
    sport: 'NBA', side: 'home', market: 'SPREAD', steamOn: true, pressEdgeMuted: true,
  });
  assert.equal(on.action, 'RESCUE');
  assert.equal(on.reason, 't5_no_t5_rescue');
  assert.equal(on.units, 1);
  const ml = applyT5Lead({
    units: 0, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: empty,
    sport: 'NBA', side: 'home', market: 'ML', steamOn: false, pressEdgeMuted: true,
  });
  assert.equal(ml.action, 'RESCUE');
  assert.equal(ml.units, 1);
});

test('a manual no-tier-5 spread stays as set when steam is off', () => {
  setT5SeasonLedger({ sports: { NBA: { seasonStart: '2026-10-18', wallets: {} } } });
  const out = applyT5Lead({
    units: 2, pickDate: T5_NO_T5_ST_FROM, odds: -110, walletDetails: details('cccccc', 'home'),
    sport: 'NBA', side: 'home', market: 'TOTAL', steamOn: false, manual: true,
  });
  assert.equal(out.action, 'PASS');
  assert.equal(out.units, 2);
  assert.equal(out.reason, 'manual');
  assert.equal(out.mutedBy, null);
});

test('ledger season start matches a 21-day hole and keeps only that season', () => {
  const early = { walletShort: 'aaaaaa', sport: 'NBA', date: '2026-06-01', invested: 10, avgPrice: 0.5, settledPnl: 5 };
  const next = { walletShort: 'aaaaaa', sport: 'NBA', date: '2026-10-06', invested: 10, avgPrice: 0.4, settledPnl: 4 };
  const built = buildT5SeasonLedger([early, next]);
  const nba = built.sports.find((s) => s.sport === 'NBA');
  assert.equal(nba.seasonStart, '2026-10-06');
  const wallets = JSON.parse(nba.betsJson);
  assert.equal(wallets.aaaaaa.length, 1);
  assert.equal(wallets.aaaaaa[0][0], '2026-10-06');
});

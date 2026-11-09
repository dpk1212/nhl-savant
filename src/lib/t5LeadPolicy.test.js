import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyT5Lead,
  buildT5SeasonLedger,
  seasonStartFromDates,
  setT5SeasonLedger,
  t5HoldDays,
  t5MorningRead,
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

test('boost adds 1, the band adds 1, and day 14 adds 1', () => {
  const id = 'aaaaaa';
  const sixRows = winsDate('2026-10-18', 10);
  setT5SeasonLedger(book(id, sixRows, '2026-10-18'));
  const wallets = [...details(id, 'home'), { wallet: 'bbbbbb', side: 'away', invested: 50 }];
  const six = applyT5Lead({
    units: 2, pickDate: '2026-11-08', odds: 150, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(six.action, 'BOOST');
  assert.equal(six.add, 1);
  assert.equal(six.units, 3);
  const band = applyT5Lead({
    units: 2, pickDate: '2026-11-08', odds: -110, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(band.add, 2);
  assert.equal(band.units, 4);
  const longRows = winsDate('2026-10-10', 10);
  setT5SeasonLedger(book(id, longRows, '2026-10-10'));
  const long = applyT5Lead({
    units: 2.5, pickDate: '2026-11-08', odds: -110, walletDetails: wallets, sport: 'NBA', side: 'home',
  });
  assert.equal(long.add, 3);
  assert.equal(long.units, 5.5);
});

test('a missing price skips only the band unit', () => {
  const id = 'aaaaaa';
  setT5SeasonLedger(book(id, winsDate('2026-10-18', 10), '2026-10-18'));
  const out = applyT5Lead({
    units: 2, pickDate: '2026-11-08', odds: null, walletDetails: details(id, 'home'), sport: 'NBA', side: 'home',
  });
  assert.equal(out.add, 1);
  assert.equal(out.units, 3);
});

test('the other side matching or ahead does not lead', () => {
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
    units: 2,
    pickDate: '2026-11-08',
    odds: -110,
    walletDetails: [...details('aaaaaa', 'home'), ...details('bbbbbb', 'away')],
    sport: 'NBA',
    side: 'home',
  });
  assert.equal(tied.action, 'PASS');
  assert.equal(tied.units, 2);
  assert.equal(tied.lead.lead, false);
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
  assert.equal(out.action, 'PASS');
});

test('press-edge rescue is 1 unit at T5-LEAD and the boost does not stack', () => {
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
  });
  assert.equal(out.action, 'RESCUE');
  assert.equal(out.units, 1);
  assert.equal(out.add, 1);
  assert.equal(out.tier, 'T5-LEAD');
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

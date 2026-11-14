import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MOVED_AGAINST_EDGE_MIN,
  MOVED_AGAINST_FROM,
  MOVED_AGAINST_MUTED_BY,
  applyMovedAgainstMute,
  buildMovedAgainstLedger,
  decideMovedAgainst,
  hydrateMovedAgainstLedger,
  ledgerBetFromRow,
  serializeMovedAgainstLedger,
  sideMovedAgainstEdge,
  steamMoveM,
  ticketImpliedProb,
  walletMovedScore,
} from './movedAgainstEdge.js';

const GAME = '2026-11-14';

function bet(date, market, price, won) {
  const day = Math.round((Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
  ) - Date.UTC(2020, 0, 1)) / 86_400_000);
  const code = market === 'SPREAD' ? 1 : market === 'TOTAL' ? 2 : 0;
  return [day, code, price, won];
}

test('implied price is the American probability', () => {
  assert.ok(Math.abs(ticketImpliedProb(-110) - 110 / 210) < 1e-12);
  assert.ok(Math.abs(ticketImpliedProb(-174) - 174 / 274) < 1e-12);
  assert.ok(Math.abs(ticketImpliedProb(150) - 100 / 250) < 1e-12);
  assert.ok(Math.abs(ticketImpliedProb(-100) - 0.5) < 1e-12);
  assert.ok(Math.abs(ticketImpliedProb(100) - 0.5) < 1e-12);
  assert.equal(ticketImpliedProb(0), null);
  assert.equal(ticketImpliedProb(null), null);
});

test('M uses the percents that exist', () => {
  assert.equal(steamMoveM(null), null);
  assert.equal(steamMoveM({}), null);
  assert.equal(steamMoveM({ lastHourPct: null, sinceOpenPct: null }), null);
  assert.equal(steamMoveM({ lastHourPct: -1.2 }), -1.2);
  assert.equal(steamMoveM({ sinceOpenPct: -0.4 }), -0.4);
  assert.equal(steamMoveM({ lastHourPct: -2, sinceOpenPct: -0.5 }), -0.5);
  assert.equal(steamMoveM({ lastHourPct: -2, sinceOpenPct: 0.1 }), 0.1);
  assert.equal(steamMoveM({ lastHourPct: 0, sinceOpenPct: -1 }), 0);
});

test('flat and shorten stay, against under 3.5 goes to 0', () => {
  const hold = applyMovedAgainstMute({
    units: 4, pickDate: GAME, sport: 'NBA', market: 'ML', m: 0, edge: 1,
  });
  assert.equal(hold.action, 'PASS');
  assert.equal(hold.units, 4);
  const shorten = applyMovedAgainstMute({
    units: 2, pickDate: GAME, sport: 'NHL', market: 'SPREAD', m: 1.1, edge: null,
  });
  assert.equal(shorten.action, 'PASS');
  assert.equal(shorten.units, 2);
  const missing = applyMovedAgainstMute({
    units: 3, pickDate: GAME, sport: 'NFL', market: 'TOTAL', m: null, edge: null,
  });
  assert.equal(missing.action, 'PASS');
  assert.equal(missing.units, 3);
  const under = applyMovedAgainstMute({
    units: 4, pickDate: GAME, sport: 'CFB', market: 'ML', m: -0.01, edge: 3.499999,
  });
  assert.equal(under.action, 'MUTE');
  assert.equal(under.units, 0);
  assert.equal(under.mutedBy, MOVED_AGAINST_MUTED_BY);
  const absent = applyMovedAgainstMute({
    units: 4, pickDate: GAME, sport: 'NBA', market: 'ML', m: -1, edge: null,
  });
  assert.equal(absent.action, 'MUTE');
  assert.equal(absent.reason, 'edge_missing');
  const exact = applyMovedAgainstMute({
    units: 4, pickDate: GAME, sport: 'NBA', market: 'TOTAL', m: -4, edge: MOVED_AGAINST_EDGE_MIN,
  });
  assert.equal(exact.action, 'PASS');
  assert.equal(exact.units, 4);
  assert.equal(exact.reason, 'edge_holds');
});

test('manual, kill, other sports, and dates before the deploy stay put', () => {
  assert.equal(applyMovedAgainstMute({
    units: 2, pickDate: GAME, sport: 'NBA', market: 'ML', m: -3, edge: 0, manual: true,
  }).action, 'EXEMPT');
  assert.equal(applyMovedAgainstMute({
    units: 2, pickDate: GAME, sport: 'NBA', market: 'ML', m: -3, edge: 0, killed: true,
  }).units, 2);
  assert.equal(applyMovedAgainstMute({
    units: 2, pickDate: '2026-11-13', sport: 'NBA', market: 'ML', m: -3, edge: 0,
  }).action, 'EXEMPT');
  assert.equal(applyMovedAgainstMute({
    units: 2, pickDate: GAME, sport: 'CBB', market: 'ML', m: -3, edge: 0,
  }).action, 'EXEMPT');
  assert.equal(applyMovedAgainstMute({
    units: 2, pickDate: GAME, sport: 'NCAAF', market: 'SPREAD', m: -3, edge: 0,
  }).action, 'MUTE');
});

test('wallet score shrinks sport, market, and the price band', () => {
  const gameDay = bet(GAME, 'ML', 0.5, 1)[0];
  const bets = [
    bet('2026-11-01', 'ML', 0.40, 1),
    bet('2026-11-02', 'SPREAD', 0.70, 0),
    bet(GAME, 'ML', 0.40, 1),
  ];
  const w = walletMovedScore(bets, 'ML', 0.50, gameDay);
  const eS = (60 - 70) / 2;
  const es = eS * 2 / 32;
  const emk = (1 * 60 + 20 * es) / 21;
  const ectx = (1 * 60 + 20 * es) / 21;
  assert.ok(Math.abs(w - (0.5 * emk + 0.5 * ectx)) < 1e-12);
  assert.equal(walletMovedScore([], 'ML', 0.5, gameDay), null);
  const noMkt = [bet('2026-11-01', 'SPREAD', 0.40, 1)];
  const only = walletMovedScore(noMkt, 'ML', null, gameDay);
  const eS2 = 60;
  const es2 = 60 * 1 / 31;
  assert.ok(Math.abs(only - es2) < 1e-12);
  const withToday = walletMovedScore(bets.slice(0, 2), 'ML', 0.50, gameDay);
  assert.ok(Math.abs(withToday - w) < 1e-12);
});

test('side edge is the unweighted mean and leaves a wallet with no sport book out', () => {
  const rows = [
    {
      date: '2026-11-01', sport: 'NBA', market: 'ML', walletShort: 'aaaaaa',
      invested: 10, settledPnl: 15, avgPrice: 0.40,
    },
    {
      date: '2026-11-01', sport: 'NBA', market: 'ML', walletShort: 'bbbbbb',
      invested: 10, settledPnl: -10, avgPrice: 0.40,
    },
    {
      date: '2026-11-01', sport: 'NHL', market: 'ML', walletShort: 'cccccc',
      invested: 10, settledPnl: 20, avgPrice: 0.40,
    },
    {
      date: GAME, sport: 'NBA', market: 'ML', walletShort: 'aaaaaa',
      invested: 10, settledPnl: 10, avgPrice: 0.40,
    },
    {
      date: '2026-11-01', sport: 'NBA', market: 'ML', walletShort: 'dddddd',
      invested: 0, settledPnl: 10, avgPrice: 0.40, result: 'WIN',
    },
    {
      date: '2026-11-01', sport: 'NBA', market: 'ML', walletShort: 'eeeeee',
      invested: 10, settledPnl: 0, avgPrice: 0.40, result: 'PUSH',
    },
  ];
  const ledger = buildMovedAgainstLedger(rows);
  assert.equal(ledgerBetFromRow(rows[4]), null);
  assert.equal(ledgerBetFromRow(rows[5]), null);
  const details = [
    { wallet: '0xaaaaaa', side: 'home', invested: 25 },
    { wallet: '0xaaaaaa', side: 'home', invested: 5 },
    { wallet: '0xbbbbbb', side: 'home', invested: 10 },
    { wallet: '0xcccccc', side: 'home', invested: 10 },
    { wallet: '0xffffff', side: 'away', invested: 40 },
  ];
  const scored = sideMovedAgainstEdge({
    walletDetails: details,
    side: 'home',
    sport: 'NBA',
    market: 'ML',
    pickDate: GAME,
    odds: -150,
    ledger,
  });
  const a = walletMovedScore(ledger.bets.get('aaaaaa').get('NBA'), 'ML', 150 / 250, bet(GAME, 'ML', 0.5, 1)[0]);
  const b = walletMovedScore(ledger.bets.get('bbbbbb').get('NBA'), 'ML', 150 / 250, bet(GAME, 'ML', 0.5, 1)[0]);
  assert.equal(scored.n, 2);
  assert.ok(Math.abs(scored.edge - (a + b) / 2) < 1e-9);
  const round = hydrateMovedAgainstLedger(serializeMovedAgainstLedger(ledger));
  const again = sideMovedAgainstEdge({
    walletDetails: details, side: 'home', sport: 'NBA', market: 'ML',
    pickDate: GAME, odds: -150, ledger: round,
  });
  assert.ok(Math.abs(again.edge - scored.edge) < 1e-9);
});

test('decide mutes a negative move with a thin edge and leaves a held edge', () => {
  const fat = [];
  for (let i = 0; i < 40; i += 1) {
    fat.push({
      date: '2026-11-01', sport: 'NFL', market: 'TOTAL', walletShort: 'abc123',
      invested: 8, settledPnl: 12, avgPrice: 0.40,
    });
  }
  const ledger = buildMovedAgainstLedger(fat);
  const details = [{ wallet: 'abc123', side: 'over', invested: 20 }];
  const held = decideMovedAgainst({
    units: 3, pickDate: GAME, sport: 'NFL', market: 'TOTAL', odds: -110,
    walletDetails: details, side: 'over', ledger,
    steam: { lastHourPct: -1.5, sinceOpenPct: -0.2 },
  });
  assert.equal(held.action, 'PASS');
  assert.equal(held.units, 3);
  assert.ok(held.edge >= MOVED_AGAINST_EDGE_MIN);
  const thin = decideMovedAgainst({
    units: 3, pickDate: GAME, sport: 'NFL', market: 'TOTAL', odds: -110,
    walletDetails: details, side: 'over', ledger: buildMovedAgainstLedger([]),
    steam: { sinceOpenPct: -0.2 },
  });
  assert.equal(thin.action, 'MUTE');
  assert.equal(thin.units, 0);
  assert.equal(thin.m, -0.2);
  const before = decideMovedAgainst({
    units: 3, pickDate: '2026-11-13', sport: 'NFL', market: 'TOTAL', odds: -110,
    walletDetails: details, side: 'over', ledger,
    steam: { lastHourPct: -4 },
  });
  assert.equal(before.action, 'EXEMPT');
  assert.equal(before.units, 3);
  assert.equal(MOVED_AGAINST_FROM, '2026-11-14');
});

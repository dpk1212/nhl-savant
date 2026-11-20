import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRUSTED_COUNT_STAMP_FIELDS,
  TRUSTED_LIST_FROM,
  TRUSTED_LIST_VERSION,
  buildTrustedList,
  hydrateTrustedList,
  isTrustedListLive,
  isTrustedWalletOn,
  scoreTrustedListBets,
  serializeTrustedList,
  setTrustedList,
  trustedCountStamp,
  trustedListBets,
  trustedListReady,
  trustedListSizes,
  trustedListSport,
  trustedSideCount,
} from './trustedList.js';

function day(n) {
  const d = new Date(Date.UTC(2026, 8, 1) + n * 86400000);
  return d.toISOString().slice(0, 10);
}

function wallet(i) {
  return `0x${'0'.repeat(34)}${String(i).padStart(6, '0')}`;
}

function american(p) {
  return p >= 0.5 ? Math.round((-100 * p) / (1 - p)) : Math.round((100 * (1 - p)) / p);
}

function row({
  w, date, game, side = 'home', result = 'WIN', price = 0.5, invested = 500,
  sport = 'NBA', marketType = 'ML', lead = 0, line = null, tape = true,
}) {
  return {
    wallet: wallet(w),
    walletShort: wallet(w).slice(-6),
    date,
    sport,
    marketType,
    gameKey: game,
    side,
    result,
    avgPrice: price,
    invested,
    spreadLine: marketType === 'SPREAD' ? line : null,
    totalLine: marketType === 'TOTAL' ? line : null,
    ticketTapeLog: tape
      ? [
        { gate: 'first', hoursOut: 6, offer: american(price), fair: american(price) },
        { gate: 't60', hoursOut: 1, offer: american(price + lead), fair: american(price + lead) },
      ]
      : null,
  };
}

/**
 * 40 wallets, one NBA moneyline each per day. Wallets 0–7 win four of
 * five and the line follows them. The rest win two of five and the line
 * leaves them.
 */
function season(days = 24) {
  const rows = [];
  for (let d = 0; d < days; d += 1) {
    for (let w = 0; w < 40; w += 1) {
      const good = w < 8;
      const won = good ? (d + w) % 5 !== 0 : (d + w) % 5 < 2;
      rows.push(row({
        w, date: day(d), game: `g${d}_${w}`, result: won ? 'WIN' : 'LOSS',
        lead: good ? 0.03 : -0.01,
      }));
    }
  }
  return rows;
}

const ROWS = season();
const MORNING = day(24);

test('the wallets that keep winning with the line behind them are the trusted ones', () => {
  const list = buildTrustedList(ROWS, MORNING);
  for (let w = 0; w < 8; w += 1) {
    assert.equal(isTrustedWalletOn('ML', wallet(w), list), true, `wallet ${w}`);
  }
  let others = 0;
  for (let w = 8; w < 40; w += 1) if (isTrustedWalletOn('ML', wallet(w), list)) others += 1;
  assert.equal(others, 0);
  assert.equal(trustedListSizes(list).ML, 8);
  assert.equal(trustedListReady(list), true);
});

test('nobody is trusted before a wallet has 8 bets or the market has 300 earlier scores', () => {
  const early = buildTrustedList(ROWS, day(5));
  assert.equal(trustedListSizes(early).ML, 0);
  // 8 bets each by day 8, but only 40 rated scores banked: no standing yet.
  const thin = buildTrustedList(ROWS, day(9));
  assert.equal(trustedListSizes(thin).ML, 0);
  assert.equal(trustedListReady(serializeAndBack(thin, day(9))), false);
});

function serializeAndBack(list, asOf) {
  return hydrateTrustedList(serializeTrustedList(list, asOf));
}

test('the morning list reads only bets dated before that morning', () => {
  const base = buildTrustedList(ROWS, MORNING);
  const later = [
    ...ROWS,
    // The same morning and after: good wallets lose big, bad wallets win big,
    // and a far larger ticket lands on a matchup wallet 0 already bet.
    ...Array.from({ length: 40 }, (_, w) => row({
      w, date: MORNING, game: `late_${w}`, result: w < 8 ? 'LOSS' : 'WIN', invested: 90000, lead: w < 8 ? -0.2 : 0.2,
    })),
    row({ w: 0, date: day(30), game: 'g3_0', result: 'LOSS', invested: 99999, lead: -0.3 }),
    row({ w: 0, date: day(23 + 1), game: 'g23_0', result: 'LOSS', invested: 99999, lead: -0.3 }),
  ];
  const again = buildTrustedList(later, MORNING);
  assert.deepEqual(serializeTrustedList(again, MORNING), serializeTrustedList(base, MORNING));
});

test('the morning list matches the score each bet carried on the walk', () => {
  const tags = scoreTrustedListBets(ROWS).filter((t) => t.date === day(23));
  const list = buildTrustedList(ROWS, day(23));
  assert.equal(tags.length, 40);
  for (const t of tags) {
    assert.equal(isTrustedWalletOn('ML', t.w6, list), t.trusted, t.w6);
  }
  assert.equal(tags.filter((t) => t.trusted).length, 8);
});

test('one bet per wallet, game, and market: copies collapse and the largest ticket is the bet', () => {
  const bets = trustedListBets([
    row({ w: 1, date: day(1), game: 'a_b', side: 'home', invested: 200 }),
    row({ w: 1, date: day(2), game: 'a_b', side: 'home', invested: 200 }), // next-day copy
    row({ w: 1, date: day(1), game: 'a_b', side: 'away', invested: 900, result: 'LOSS' }),
    row({ w: 2, date: day(1), game: 'a_b', side: 'home', invested: 50 }),
  ]);
  assert.equal(bets.length, 2);
  const mine = bets.find((b) => b.w6 === wallet(1).slice(-6));
  assert.equal(mine.side, 'away');
  assert.equal(mine.invested, 900);
});

test('the same two teams more than a day apart are two games', () => {
  const rows = [
    row({ w: 1, date: day(1), game: 'a_b', invested: 200 }),
    row({ w: 1, date: day(9), game: 'a_b', invested: 5000, result: 'LOSS' }),
    row({ w: 1, date: day(20), game: 'a_b', invested: 300 }),
  ];
  const bets = trustedListBets(rows);
  assert.equal(bets.length, 3);
  assert.deepEqual(bets.map((b) => b.date), [day(1), day(9), day(20)]);
  // And a cut drops the later games without touching the first.
  const cut = trustedListBets(rows, day(9));
  assert.equal(cut.length, 1);
  assert.equal(cut[0].invested, 200);
});

test('pushes, postponed games, bad prices, and empty stakes are not bets', () => {
  const bets = trustedListBets([
    row({ w: 1, date: day(1), game: 'g1', result: 'PUSH' }),
    { ...row({ w: 1, date: day(1), game: 'g2' }), postponed: true },
    row({ w: 1, date: day(1), game: 'g3', price: 1 }),
    row({ w: 1, date: day(1), game: 'g4', invested: 0 }),
    row({ w: 1, date: day(1), game: 'g5' }),
    row({ w: 1, date: day(1), game: 'g6', marketType: 'PROP' }),
  ]);
  assert.equal(bets.length, 1);
  assert.equal(bets[0].gameKey, 'g5');
});

test('the stored morning carries the trusted wallets and reads back the same', () => {
  const list = buildTrustedList(ROWS, MORNING);
  const stored = serializeTrustedList(list, MORNING);
  assert.equal(stored.asOf, MORNING);
  assert.equal(stored.listVersion, TRUSTED_LIST_VERSION);
  assert.equal(stored.rows.length, 8);
  assert.ok(stored.rows.every((r) => r.market === 'ML' && r.standing >= 0.8));
  const back = hydrateTrustedList(JSON.parse(JSON.stringify(stored)));
  for (let w = 0; w < 40; w += 1) {
    assert.equal(isTrustedWalletOn('ML', wallet(w), back), isTrustedWalletOn('ML', wallet(w), list));
  }
});

test('a list is per market: a moneyline name is not a spread name', () => {
  const list = buildTrustedList(ROWS, MORNING);
  assert.equal(isTrustedWalletOn('ML', wallet(0), list), true);
  assert.equal(isTrustedWalletOn('SPREAD', wallet(0), list), false);
  assert.equal(isTrustedWalletOn('TOTAL', wallet(0), list), false);
});

function listOf(market, ...ids) {
  const index = new Map();
  for (const id of ids) index.set(`${market}|${id}`, { trusted: true, standing: 0.9, score: 0.01, n: 12 });
  return index;
}

function pos(id, side, invested = 100, marketType = 'ML') {
  return { walletShort: id, wallet: `0xabc${id}`, side, invested, marketType };
}

test('the count is trusted for minus trusted against, and other wallets do not count', () => {
  const list = listOf('ML', 'aaaaa1', 'aaaaa2', 'bbbbb1');
  const positions = [pos('aaaaa1', 'home'), pos('aaaaa2', 'home'), pos('bbbbb1', 'away'), pos('zzzzz1', 'away'), pos('zzzzz2', 'away')];
  const home = trustedSideCount({ market: 'ML', side: 'home', positions, list });
  assert.deepEqual(home, { for: ['aaaaa1', 'aaaaa2'], against: ['bbbbb1'], margin: 1 });
  const away = trustedSideCount({ market: 'ML', side: 'away', positions, list });
  assert.equal(away.margin, -1);
});

test('a wallet on both sides counts once, on its larger ticket; two tickets on a side are one wallet', () => {
  const list = listOf('ML', 'aaaaa1');
  const positions = [pos('aaaaa1', 'home', 100), pos('aaaaa1', 'home', 150), pos('aaaaa1', 'away', 400)];
  assert.equal(trustedSideCount({ market: 'ML', side: 'home', positions, list }).margin, -1);
  assert.deepEqual(trustedSideCount({ market: 'ML', side: 'away', positions, list }).for, ['aaaaa1']);
});

test('a soccer draw ticket by a trusted wallet counts against both teams', () => {
  const list = listOf('ML', 'aaaaa1');
  const positions = [pos('aaaaa1', 'draw')];
  assert.equal(trustedSideCount({ market: 'ML', side: 'home', positions, list }).margin, -1);
  assert.equal(trustedSideCount({ market: 'ML', side: 'draw', positions, list }).margin, 1);
});

test('the list is live from its first day; four sports set the standing', () => {
  assert.equal(isTrustedListLive(TRUSTED_LIST_FROM), true);
  assert.equal(isTrustedListLive('2026-11-19'), false);
  assert.equal(isTrustedListLive(null), false);
  for (const s of ['NHL', 'NBA', 'NFL', 'CFB', 'NCAAF', 'nba']) assert.equal(trustedListSport(s), true, s);
  for (const s of ['CBB', 'SOC', 'MLB', 'ATP', 'UFC', '']) assert.equal(trustedListSport(s), false, s);
});

test('the count stamp: moneylines in every sport, spreads and totals on the four, empty otherwise', () => {
  const list = new Map([...listOf('TOTAL', 'aaaaa1'), ...listOf('ML', 'aaaaa1')]);
  const positions = [pos('aaaaa1', 'over', 100, 'TOTAL')];
  const stamp = trustedCountStamp({
    pickDate: TRUSTED_LIST_FROM, sport: 'NBA', market: 'TOTAL', side: 'under', positions, list,
  });
  assert.deepEqual(Object.keys(stamp).sort(), [...TRUSTED_COUNT_STAMP_FIELDS].sort());
  assert.deepEqual(stamp.v8_trustedListAgainst, ['aaaaa1']);
  assert.equal(stamp.v8_trustedListMargin, -1);
  const args = { pickDate: TRUSTED_LIST_FROM, sport: 'NBA', market: 'TOTAL', side: 'under', positions, list };
  assert.deepEqual(trustedCountStamp({ ...args, pickDate: '2026-11-19' }), {});
  assert.deepEqual(trustedCountStamp({ ...args, sport: 'CBB' }), {});
  assert.deepEqual(trustedCountStamp({ ...args, sport: 'SOC', market: 'SPREAD' }), {});
  const ml = { ...args, market: 'ML', side: 'home', positions: [pos('aaaaa1', 'home', 100, 'ML')] };
  for (const sport of ['SOC', 'ATP', 'CS2', 'CBB', 'NBA']) {
    assert.equal(trustedCountStamp({ ...ml, sport }).v8_trustedListMargin, 1, sport);
  }
  assert.deepEqual(trustedCountStamp({ ...ml, sport: '' }), {});
  assert.deepEqual(trustedCountStamp({ ...args, market: 'PROP' }), {});
  assert.deepEqual(trustedCountStamp({ ...args, list: new Map() }), {});
});

test('the paths read the morning list set by the cache when no list is passed', () => {
  setTrustedList(listOf('ML', 'aaaaa1'));
  try {
    assert.equal(trustedListReady(), true);
    assert.equal(trustedSideCount({ market: 'ML', side: 'home', positions: [pos('aaaaa1', 'home')] }).margin, 1);
  } finally {
    setTrustedList(new Map());
  }
  assert.equal(trustedListReady(), false);
  assert.equal(trustedSideCount({ market: 'ML', side: 'home', positions: [pos('aaaaa1', 'home')] }).margin, 0);
});

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
  trustedRecordLead,
  trustedRecordSizes,
  trustedRecordsReady,
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
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'NBA', list), true, `wallet ${w}`);
  }
  let others = 0;
  for (let w = 8; w < 40; w += 1) if (isTrustedWalletOn('ML', wallet(w), 'NBA', list)) others += 1;
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
    assert.equal(isTrustedWalletOn('ML', t.w6, 'NBA', list), t.counts, t.w6);
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
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'NBA', back), isTrustedWalletOn('ML', wallet(w), 'NBA', list));
  }
});

test('a list is per market: a moneyline name is not a spread name', () => {
  const list = buildTrustedList(ROWS, MORNING);
  assert.equal(isTrustedWalletOn('ML', wallet(0), 'NBA', list), true);
  assert.equal(isTrustedWalletOn('SPREAD', wallet(0), 'NBA', list), false);
  assert.equal(isTrustedWalletOn('TOTAL', wallet(0), 'NBA', list), false);
});

const PROFITABLE_IN = ['NHL', 'NBA', 'NFL', 'CFB', 'CBB', 'SOC', 'ATP', 'CS2', 'LOL', 'MLB', 'WNBA', 'UFC'];

function listOf(market, ...ids) {
  const index = new Map();
  for (const id of ids) index.set(`${market}|${id}`, {
    trusted: true, standing: 0.9, score: 0.01, n: 12, sports: PROFITABLE_IN, played: PROFITABLE_IN,
  });
  return index;
}

function pos(id, side, invested = 100, marketType = 'ML') {
  return { walletShort: id, wallet: `0xabc${id}`, side, invested, marketType };
}

test('the count is trusted for minus trusted against, and other wallets do not count', () => {
  const list = listOf('ML', 'aaaaa1', 'aaaaa2', 'bbbbb1');
  const positions = [pos('aaaaa1', 'home'), pos('aaaaa2', 'home'), pos('bbbbb1', 'away'), pos('zzzzz1', 'away'), pos('zzzzz2', 'away')];
  const home = trustedSideCount({ sport: 'NBA', market: 'ML', side: 'home', positions, list });
  assert.deepEqual(home, { for: ['aaaaa1', 'aaaaa2'], against: ['bbbbb1'], margin: 1 });
  const away = trustedSideCount({ sport: 'NBA', market: 'ML', side: 'away', positions, list });
  assert.equal(away.margin, -1);
});

test('a wallet on both sides counts once, on its larger ticket; two tickets on a side are one wallet', () => {
  const list = listOf('ML', 'aaaaa1');
  const positions = [pos('aaaaa1', 'home', 100), pos('aaaaa1', 'home', 150), pos('aaaaa1', 'away', 400)];
  assert.equal(trustedSideCount({ sport: 'NBA', market: 'ML', side: 'home', positions, list }).margin, -1);
  assert.deepEqual(trustedSideCount({ sport: 'NBA', market: 'ML', side: 'away', positions, list }).for, ['aaaaa1']);
});

test('a soccer draw ticket by a trusted wallet counts against both teams', () => {
  const list = listOf('ML', 'aaaaa1');
  const positions = [pos('aaaaa1', 'draw')];
  assert.equal(trustedSideCount({ sport: 'NBA', market: 'ML', side: 'home', positions, list }).margin, -1);
  assert.equal(trustedSideCount({ sport: 'NBA', market: 'ML', side: 'draw', positions, list }).margin, 1);
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
    assert.equal(trustedSideCount({ sport: 'NBA', market: 'ML', side: 'home', positions: [pos('aaaaa1', 'home')] }).margin, 1);
  } finally {
    setTrustedList(new Map());
  }
  assert.equal(trustedListReady(), false);
  assert.equal(trustedSideCount({ sport: 'NBA', market: 'ML', side: 'home', positions: [pos('aaaaa1', 'home')] }).margin, 0);
});

// ─── Profitable in the sport and market ───────────────────────

/** The season, plus the eight good wallets on 9 winning NHL moneylines and 12 losing CFB moneylines. */
function seasonWithOtherSports() {
  const rows = season();
  for (let w = 0; w < 8; w += 1) {
    for (let d = 0; d < 9; d += 1) {
      rows.push(row({ w, date: day(d), game: `nhl${d}_${w}`, sport: 'NHL', result: 'WIN', tape: false }));
    }
    for (let d = 0; d < 12; d += 1) {
      rows.push(row({ w, date: day(d), game: `cfb${d}_${w}`, sport: 'NCAAF', result: 'LOSS', tape: false }));
    }
  }
  return rows;
}

test('a trusted wallet counts only in a sport where it has 10 bets and is up in units', () => {
  const list = buildTrustedList(seasonWithOtherSports(), MORNING);
  assert.equal(trustedListSizes(list).ML, 8);
  for (let w = 0; w < 8; w += 1) {
    assert.deepEqual(list.get(`ML|${wallet(w).slice(-6)}`).sports, ['NBA'], `wallet ${w}`);
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'NBA', list), true);
    // 9-0 on NHL moneylines: one bet short.
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'NHL', list), false);
    // 0-12 on CFB moneylines: enough bets, down in units.
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'CFB', list), false);
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'NCAAF', list), false);
    // Never bet there.
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'SOC', list), false);
    assert.equal(isTrustedWalletOn('ML', wallet(w), '', list), false);
  }
});

test('the tenth bet is the bar: 9 winning bets do not count and 10 do', () => {
  const rows = seasonWithOtherSports();
  for (let w = 0; w < 8; w += 1) {
    rows.push(row({ w, date: day(9), game: `nhl9_${w}`, sport: 'NHL', result: 'WIN', tape: false }));
  }
  const list = buildTrustedList(rows, MORNING);
  for (let w = 0; w < 8; w += 1) {
    assert.deepEqual(list.get(`ML|${wallet(w).slice(-6)}`).sports, ['NBA', 'NHL']);
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'NHL', list), true);
  }
});

test('units decide profitable, not the win-loss record: 6-4 on short favorites is down', () => {
  const rows = season();
  for (let w = 0; w < 8; w += 1) {
    for (let d = 0; d < 10; d += 1) {
      // 6-4 at 80¢: +0.25u a win, −1u a loss. 6 × 0.25 − 4 = −2.5u.
      rows.push(row({
        w, date: day(d), game: `nhl${d}_${w}`, sport: 'NHL', result: d < 6 ? 'WIN' : 'LOSS', price: 0.8, tape: false,
      }));
    }
  }
  const list = buildTrustedList(rows, MORNING);
  let checked = 0;
  for (let w = 0; w < 8; w += 1) {
    const info = list.get(`ML|${wallet(w).slice(-6)}`);
    if (!info.trusted) continue;
    checked += 1;
    assert.equal(info.sports.includes('NHL'), false);
    assert.equal(info.sports.includes('NBA'), true);
  }
  assert.ok(checked > 0);
});

test('a side counts a wallet by the sport on its position, then by the sport of the pick', () => {
  const list = new Map([
    ['ML|aaaaa1', { trusted: true, standing: 0.9, score: 0.01, n: 30, sports: ['NBA'] }],
    ['ML|bbbbb1', { trusted: true, standing: 0.9, score: 0.01, n: 30, sports: ['NHL'] }],
    ['ML|ccccc1', { trusted: true, standing: 0.9, score: 0.01, n: 30, sports: [] }],
    ['ML|ddddd1', { trusted: true, standing: 0.9, score: 0.01, n: 30 }],
  ]);
  const positions = [pos('aaaaa1', 'home'), pos('bbbbb1', 'away'), pos('ccccc1', 'away'), pos('ddddd1', 'away')];
  assert.deepEqual(
    trustedSideCount({ sport: 'NBA', market: 'ML', side: 'home', positions, list }),
    { for: ['aaaaa1'], against: [], margin: 1 },
  );
  assert.deepEqual(
    trustedSideCount({ sport: 'NHL', market: 'ML', side: 'home', positions, list }),
    { for: [], against: ['bbbbb1'], margin: -1 },
  );
  assert.equal(trustedSideCount({ sport: 'ncaab', market: 'ML', side: 'home', positions, list }).margin, 0);
  // No sport anywhere: nobody counts.
  assert.equal(trustedSideCount({ market: 'ML', side: 'home', positions, list }).margin, 0);
  // The position's own sport wins over the pick's.
  const nbaRows = positions.map((p) => ({ ...p, sport: 'NBA' }));
  assert.equal(trustedSideCount({ sport: 'NHL', market: 'ML', side: 'home', positions: nbaRows, list }).margin, 1);
});

test('the stored morning carries the sports and reads back the same', () => {
  const list = buildTrustedList(seasonWithOtherSports(), MORNING);
  const stored = serializeTrustedList(list, MORNING);
  assert.equal(stored.listVersion, TRUSTED_LIST_VERSION);
  assert.ok(stored.rows.every((r) => r.sports.length === 1 && r.sports[0] === 'NBA'));
  // 10 or more bets, up or down: NBA and the 12 losing CFB moneylines. The 9 NHL bets are short.
  assert.ok(stored.rows.every((r) => r.played.join() === 'CFB,NBA'));
  const back = hydrateTrustedList(JSON.parse(JSON.stringify(stored)));
  for (let w = 0; w < 8; w += 1) {
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'NBA', back), true);
    assert.equal(isTrustedWalletOn('ML', wallet(w), 'NHL', back), false);
  }
  // A morning stored before the sports were kept counts nobody.
  const old = hydrateTrustedList({ rows: stored.rows.map(({ sports, ...r }) => r) });
  assert.equal(isTrustedWalletOn('ML', wallet(0), 'NBA', old), false);
});

test('each bet on the walk carries the record its wallet had in that sport that morning', () => {
  const tags = scoreTrustedListBets(seasonWithOtherSports());
  const nhl = tags.filter((t) => t.sport === 'NHL' && t.w6 === wallet(0).slice(-6));
  assert.deepEqual(nhl.map((t) => t.sportBets), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.ok(nhl.every((t) => t.counts === false));
  const nba = tags.filter((t) => t.sport === 'NBA' && t.date === day(23) && t.trusted);
  assert.equal(nba.length, 8);
  assert.ok(nba.every((t) => t.counts === true && t.sportBets === 23 && t.sportUnits > 0));
});

test('the wide count takes a trusted wallet with 10 bets there, up or down, and nobody with fewer', () => {
  const list = buildTrustedList(seasonWithOtherSports(), MORNING);
  const w6 = wallet(0).slice(-6);
  assert.deepEqual(list.get(`ML|${w6}`).played, ['CFB', 'NBA']);
  const on = (sport, wide) => trustedSideCount({
    sport, market: 'ML', side: 'home', positions: [pos(w6, 'home')], list, wide,
  }).margin;
  // NBA: up on 24 bets. Counts on both.
  assert.equal(on('NBA', false), 1);
  assert.equal(on('NBA', true), 1);
  // CFB: 0-12. Only the wide count.
  assert.equal(on('CFB', false), 0);
  assert.equal(on('CFB', true), 1);
  // NHL: 9-0, one bet short. Neither.
  assert.equal(on('NHL', false), 0);
  assert.equal(on('NHL', true), 0);
  const back = hydrateTrustedList(JSON.parse(JSON.stringify(serializeTrustedList(list, MORNING))));
  assert.deepEqual(back.get(`ML|${w6}`).played, ['CFB', 'NBA']);
});

// ─── Spread records ──────────────────────────────────────────────────────

/**
 * Three wallets on spreads at a price of 0.5, one bet a day. Wallet 50
 * wins 9 of 12, wallet 51 wins 3 of 12, wallet 52 has 9 bets.
 */
function spreadSeason() {
  const rows = [];
  for (let d = 0; d < 12; d += 1) {
    rows.push(row({ w: 50, date: day(d), game: `s${d}_50`, marketType: 'SPREAD', line: -3.5, sport: d % 2 ? 'NBA' : 'NHL', result: d < 9 ? 'WIN' : 'LOSS' }));
    rows.push(row({ w: 51, date: day(d), game: `s${d}_51`, marketType: 'SPREAD', line: 3.5, sport: 'CFB', result: d < 3 ? 'WIN' : 'LOSS' }));
    if (d < 9) rows.push(row({ w: 52, date: day(d), game: `s${d}_52`, marketType: 'SPREAD', line: 3.5, result: 'WIN' }));
  }
  return rows;
}

const W50 = wallet(50).slice(-6);
const W51 = wallet(51).slice(-6);
const W52 = wallet(52).slice(-6);

test('a record is spread results against the wallet\'s own prices, every sport, from 10 bets', () => {
  const list = buildTrustedList([...ROWS, ...spreadSeason()], MORNING);
  // 9 wins in 12 at 0.5: (9 − 6) / sqrt(12 × 0.25) = 1.732.
  assert.ok(Math.abs(list.get(`SPREAD|${W50}`).record - 3 / Math.sqrt(3)) < 1e-9);
  // 3 wins in 12: −1.732.
  assert.ok(Math.abs(list.get(`SPREAD|${W51}`).record + 3 / Math.sqrt(3)) < 1e-9);
  // 9 bets: no record yet.
  assert.equal(list.get(`SPREAD|${W52}`).record, null);
  // Neither is trusted: a record does not need the list.
  assert.equal(list.get(`SPREAD|${W50}`).trusted, false);
});

test('a record reads only bets dated before the morning', () => {
  const rows = [...ROWS, ...spreadSeason()];
  // The morning of day 9 has 9 bets behind it: no record.
  const early = buildTrustedList(rows, day(9));
  assert.equal(early.get(`SPREAD|${W50}`).record, null);
  // The morning of day 10 has days 0–9: 9 wins and 1 loss. Day 10 itself is not read.
  const tenth = buildTrustedList(rows, day(10));
  assert.ok(Math.abs(tenth.get(`SPREAD|${W50}`).record - 4 / Math.sqrt(2.5)) < 1e-9);
  const tags = scoreTrustedListBets(rows).filter((t) => t.market === 'SPREAD' && t.w6 === W50);
  assert.deepEqual(tags.map((t) => t.record == null), [...Array(10).fill(true), false, false]);
  assert.ok(Math.abs(tags[10].record - tenth.get(`SPREAD|${W50}`).record) < 1e-9);
});

test('the stored morning carries every spread record, trusted or not, and reads back the same', () => {
  const list = buildTrustedList([...ROWS, ...spreadSeason()], MORNING);
  const stored = serializeTrustedList(list, MORNING);
  assert.deepEqual(stored.records.map((r) => r.wallet).sort(), [W50, W51].sort());
  assert.ok(stored.records.every((r) => r.market === 'SPREAD' && r.n === 12));
  // The moneyline wallets have no stored record.
  assert.equal(stored.rows.length, 8);
  const back = hydrateTrustedList(JSON.parse(JSON.stringify(stored)));
  assert.equal(back.get(`SPREAD|${W50}`).record, 1.732);
  assert.equal(back.get(`SPREAD|${W51}`).record, -1.732);
  assert.equal(back.get(`SPREAD|${W50}`).trusted, false);
  assert.equal(back.has(`SPREAD|${W52}`), false);
  assert.equal(trustedRecordsReady('SPREAD', back), true);
  assert.equal(trustedRecordsReady('ML', back), false);
  assert.deepEqual(trustedRecordSizes(back), { ML: 0, SPREAD: 2, TOTAL: 0 });
  // A record name is not a trusted name: the sizes and the count do not move.
  assert.deepEqual(trustedListSizes(back), trustedListSizes(hydrateTrustedList({ rows: stored.rows })));
  assert.equal(isTrustedWalletOn('SPREAD', wallet(50), 'NBA', back), false);
  // A morning stored before records were kept has none.
  assert.equal(trustedRecordsReady('SPREAD', hydrateTrustedList({ rows: stored.rows })), false);
  // Records with no trusted wallet are not a list: the paths fall back as they do on an empty morning.
  const recordsOnly = hydrateTrustedList({ rows: [], records: stored.records });
  assert.equal(recordsOnly.size, 2);
  assert.equal(trustedListReady(recordsOnly), false);
  assert.equal(trustedListReady(back), true);
});

test('the record lead is the records for minus the records against', () => {
  const list = hydrateTrustedList(serializeTrustedList(buildTrustedList([...ROWS, ...spreadSeason()], MORNING), MORNING));
  const p = (w, side, invested = 500, marketType = 'SPREAD') => ({ wallet: wallet(w), walletShort: wallet(w).slice(-6), side, invested, marketType });
  const both = trustedRecordLead({ market: 'SPREAD', side: 'home', positions: [p(50, 'home'), p(51, 'away'), p(52, 'away')], list });
  assert.equal(both.for, 1.732);
  assert.equal(both.against, -1.732);
  assert.equal(both.lead, 3.464);
  assert.equal(both.walletsFor, 1);
  assert.equal(both.walletsAgainst, 1);
  const other = trustedRecordLead({ market: 'SPREAD', side: 'away', positions: [p(50, 'home'), p(51, 'away')], list });
  assert.equal(other.lead, -3.464);
  // Larger ticket decides the side; two tickets on a side are one wallet.
  const split = trustedRecordLead({ market: 'SPREAD', side: 'home', positions: [p(50, 'home', 100), p(50, 'away', 900), p(51, 'away'), p(51, 'away', 50)], list });
  assert.equal(split.for, 0);
  assert.equal(split.against, 0);
  assert.equal(split.walletsAgainst, 2);
  // A moneyline position and a moneyline ask add nothing.
  assert.equal(trustedRecordLead({ market: 'SPREAD', side: 'home', positions: [p(50, 'home', 500, 'ML')], list }).lead, 0);
  assert.equal(trustedRecordLead({ market: 'ML', side: 'home', positions: [p(50, 'home')], list }).lead, 0);
});

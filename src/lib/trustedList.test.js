import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SPORT_DOOR_BAR,
  SPORT_DOOR_FROM,
  SPORT_DOOR_MIN_READS,
  SPORT_DOOR_STAMP_FIELDS,
  TRUSTED_COUNT_STAMP_FIELDS,
  TRUSTED_LIST_FROM,
  TRUSTED_LIST_VERSION,
  buildTrustedList,
  hydrateTrustedList,
  isSportDoorLive,
  isTrustedListLive,
  isTrustedWalletOn,
  scoreTrustedListBets,
  serializeTrustedList,
  setTrustedList,
  sportDoorSizes,
  trustedCountStamp,
  trustedListBets,
  trustedListReady,
  trustedListSizes,
  trustedListSport,
  trustedRecordLead,
  trustedRecordSizes,
  trustedRecordsReady,
  trustedSideCount,
  trustedSportRecord,
  trustedSportRecordSizes,
  trustedSportRecordsReady,
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

// ─── Totals sport records ────────────────────────────────────────────────

/**
 * Totals at a price of 0.5, one bet a day. Wallet 60 wins 9 of 12 on NBA
 * totals and loses 10 of 10 on NHL totals. Wallet 61 wins 3 of 12 on NBA
 * totals. Wallet 62 has 9 NBA totals, all wins.
 */
function totalSeason() {
  const rows = [];
  for (let d = 0; d < 12; d += 1) {
    rows.push(row({ w: 60, date: day(d), game: `t${d}_60`, marketType: 'TOTAL', side: 'over', line: 220.5, result: d < 9 ? 'WIN' : 'LOSS' }));
    if (d < 10) rows.push(row({ w: 60, date: day(d), game: `tn${d}_60`, marketType: 'TOTAL', side: 'under', line: 5.5, sport: 'NHL', result: 'LOSS' }));
    rows.push(row({ w: 61, date: day(d), game: `t${d}_61`, marketType: 'TOTAL', side: 'under', line: 220.5, result: d < 3 ? 'WIN' : 'LOSS' }));
    if (d < 9) rows.push(row({ w: 62, date: day(d), game: `t${d}_62`, marketType: 'TOTAL', side: 'over', line: 220.5, result: 'WIN' }));
  }
  return rows;
}

const W60 = wallet(60).slice(-6);
const W61 = wallet(61).slice(-6);
const W62 = wallet(62).slice(-6);

test('a totals sport record is the results in that sport against the wallet\'s own prices, from 10 bets', () => {
  const list = buildTrustedList([...ROWS, ...totalSeason()], MORNING);
  const nba = trustedSportRecord('TOTAL', wallet(60), 'NBA', list);
  // 9 wins in 12 at 0.5: (9 − 6) / sqrt(12 × 0.25) = 1.732, and up 6 units.
  assert.ok(Math.abs(nba.z - 3 / Math.sqrt(3)) < 1e-9);
  assert.equal(nba.n, 12);
  assert.equal(nba.up, true);
  // The same wallet on NHL totals: 0 wins in 10, (0 − 5) / sqrt(2.5), and down.
  const nhl = trustedSportRecord('TOTAL', wallet(60), 'NHL', list);
  assert.ok(Math.abs(nhl.z + 5 / Math.sqrt(2.5)) < 1e-9);
  assert.equal(nhl.up, false);
  // A losing wallet has a record and is not up.
  const low = trustedSportRecord('TOTAL', W61, 'NBA', list);
  assert.ok(Math.abs(low.z + 3 / Math.sqrt(3)) < 1e-9);
  assert.equal(low.up, false);
  // 9 bets: no record. A sport never bet: none. Another market: none.
  assert.equal(trustedSportRecord('TOTAL', W62, 'NBA', list), null);
  assert.equal(trustedSportRecord('TOTAL', W60, 'CFB', list), null);
  assert.equal(trustedSportRecord('ML', W60, 'NBA', list), null);
  assert.equal(trustedSportRecord('SPREAD', W60, 'NBA', list), null);
  // NCAAF and CFB are one sport; a moneyline wallet has no totals record.
  assert.equal(trustedSportRecord('TOTAL', wallet(0), 'NBA', list), null);
  // A sport record does not make a wallet trusted.
  assert.equal(list.get(`TOTAL|${W60}`).trusted, false);
});

test('a totals sport record reads only bets dated before the morning', () => {
  const rows = [...ROWS, ...totalSeason()];
  assert.equal(trustedSportRecord('TOTAL', W60, 'NBA', buildTrustedList(rows, day(9))), null);
  // Days 0–9: 9 wins and 1 loss. Day 10 itself is not read.
  const tenth = trustedSportRecord('TOTAL', W60, 'NBA', buildTrustedList(rows, day(10)));
  assert.ok(Math.abs(tenth.z - 4 / Math.sqrt(2.5)) < 1e-9);
  assert.equal(tenth.n, 10);
  const tags = scoreTrustedListBets(rows).filter((t) => t.market === 'TOTAL' && t.sport === 'NBA' && t.w6 === W60);
  assert.deepEqual(tags.map((t) => t.sportRecord == null), [...Array(10).fill(true), false, false]);
  assert.ok(Math.abs(tags[10].sportRecord - tenth.z) < 1e-9);
});

test('the stored morning carries every totals sport record and reads back the same', () => {
  const list = buildTrustedList([...ROWS, ...totalSeason()], MORNING);
  const stored = serializeTrustedList(list, MORNING);
  assert.equal(stored.listVersion, TRUSTED_LIST_VERSION);
  assert.deepEqual(
    stored.sportRecords.map((r) => `${r.market}|${r.wallet}|${r.sport}`).sort(),
    [`TOTAL|${W60}|NBA`, `TOTAL|${W60}|NHL`, `TOTAL|${W61}|NBA`].sort(),
  );
  // The moneyline rows are as they were.
  assert.equal(stored.rows.length, 8);
  const back = hydrateTrustedList(JSON.parse(JSON.stringify(stored)));
  assert.deepEqual(trustedSportRecord('TOTAL', W60, 'NBA', back), { z: 1.732, n: 12, up: true });
  assert.deepEqual(trustedSportRecord('TOTAL', W60, 'NHL', back), { z: -3.162, n: 10, up: false });
  assert.deepEqual(trustedSportRecord('TOTAL', W61, 'NBA', back), { z: -1.732, n: 12, up: false });
  assert.equal(trustedSportRecord('TOTAL', W62, 'NBA', back), null);
  assert.equal(trustedSportRecordsReady('TOTAL', back), true);
  assert.equal(trustedSportRecordsReady('SPREAD', back), false);
  assert.equal(trustedSportRecordsReady('ML', back), false);
  assert.deepEqual(trustedSportRecordSizes('TOTAL', back), { wallets: 2, up: 1 });
  // A sport-record name is not a trusted name: the list sizes and the count do not move.
  assert.deepEqual(trustedListSizes(back), trustedListSizes(hydrateTrustedList({ rows: stored.rows })));
  assert.equal(isTrustedWalletOn('TOTAL', wallet(60), 'NBA', back), false);
  assert.equal(trustedListReady(back), true);
  // A morning stored before sport records were kept has none.
  const old = hydrateTrustedList({ rows: stored.rows, records: stored.records });
  assert.equal(trustedSportRecordsReady('TOTAL', old), false);
  assert.deepEqual(trustedSportRecordSizes('TOTAL', old), { wallets: 0, up: 0 });
  // Sport records with no trusted wallet are not a list.
  assert.equal(trustedListReady(hydrateTrustedList({ rows: [], sportRecords: stored.sportRecords })), false);
});

test('the paths read the stored sport records when no list is passed', () => {
  const list = hydrateTrustedList(serializeTrustedList(buildTrustedList([...ROWS, ...totalSeason()], MORNING), MORNING));
  setTrustedList(list);
  try {
    assert.equal(trustedSportRecord('TOTAL', W60, 'NBA').z, 1.732);
    assert.equal(trustedSportRecordsReady('TOTAL'), true);
  } finally {
    setTrustedList(null);
  }
  assert.equal(trustedSportRecordsReady('TOTAL'), false);
});

// ─── Sport door ──────────────────────────────────────────────────────────

/** Game `d` starts at 23:00 UTC on day(d), in milliseconds as the scan stores it. */
function startMs(d) {
  return Date.UTC(2026, 8, 1 + d, 23, 0, 0);
}

/**
 * One tracked ticket with the fields the closing read needs. No sharp
 * line on it: the offer is the price paid and there is no fair.
 */
function ticket({
  w, d, game, side = 'home', price = 0.5, hoursOut = 6, sport = 'CS2', marketType = 'ML',
  result = 'WIN', invested = 500,
}) {
  return {
    wallet: wallet(w),
    walletShort: wallet(w).slice(-6),
    date: day(d),
    sport,
    marketType,
    gameKey: game,
    side,
    result,
    avgPrice: price,
    invested,
    spreadLine: marketType === 'SPREAD' ? -1.5 : null,
    totalLine: null,
    conditionId: `c_${game}`,
    asset: `${game}_${side}`,
    firstSeen: new Date(startMs(d) - hoursOut * 3600000).toISOString(),
    commenceTime: startMs(d),
    ticketTapeLog: [{ gate: 'first', hoursOut, offer: american(price), fair: null }],
  };
}

/**
 * Wallet `w` buys a side at 48 cents six hours out on `games` games, one
 * a day, and wins `wins` of them. Wallet `closer` buys the same side an
 * hour out at `close`. The first wallet's closing read is `close` − 0.48.
 * (Not 50 cents: a wallet stored at a flat 0.5 on every row is left out.)
 */
function doorSeason({
  w, closer = 90, games = 12, wins = 8, close = 0.51, sport = 'CS2', marketType = 'ML', tag = 'd',
}) {
  const rows = [];
  for (let d = 0; d < games; d += 1) {
    const game = `${tag}${w}_${d}`;
    const result = d < wins ? 'WIN' : 'LOSS';
    rows.push(ticket({ w, d, game, sport, marketType, result, price: 0.48 }));
    rows.push(ticket({ w: closer, d, game, sport, marketType, result, price: close, hoursOut: 1 }));
  }
  return rows;
}

const D60 = wallet(60).slice(-6);
const onSide = (list, id, sport, wide = false, market = 'ML') => trustedSideCount({
  sport, market, side: 'home', positions: [pos(id, 'home', 100, market)], list, wide,
}).margin;

test('the sport door: 12 closing reads at a score of 0.45 points count a CS2 wallet on CS2 moneylines', () => {
  assert.equal(isSportDoorLive(SPORT_DOOR_FROM), true);
  assert.equal(isSportDoorLive('2026-11-24'), false);
  assert.equal(isSportDoorLive(null), false);
  const list = buildTrustedList(doorSeason({ w: 60 }), SPORT_DOOR_FROM);
  const info = list.get(`ML|${D60}`);
  // Nobody has a standing here: the wallet is on through the door alone.
  assert.equal(info.trusted, false);
  assert.deepEqual(info.door, ['CS2']);
  assert.equal(info.doorReads.CS2.n, 12);
  // Twelve reads of about 3 points, held at 12 / (12 + 25).
  assert.ok(Math.abs(info.doorReads.CS2.score - 0.03 * (12 / 37)) < 0.0005);
  assert.ok(info.doorReads.CS2.score >= SPORT_DOOR_BAR);
  // 8-4 at 48 cents on 12 moneylines: it counts on the wide count and the profitable one.
  assert.equal(onSide(list, D60, 'CS2', true), 1);
  assert.equal(onSide(list, D60, 'CS2', false), 1);
  assert.equal(isTrustedWalletOn('ML', wallet(60), 'CS2', list), true);
  // Only that sport, and only moneylines.
  assert.equal(onSide(list, D60, 'ATP', true), 0);
  assert.equal(onSide(list, D60, 'NBA', true), 0);
  assert.equal(onSide(list, D60, 'CS2', true, 'SPREAD'), 0);
  // The wallet that set the close had nobody after it: no reads, no door.
  assert.equal(list.get(`ML|${wallet(90).slice(-6)}`)?.door, undefined);
  assert.deepEqual(sportDoorSizes(list), { all: 1, added: 1, sports: { CS2: 1 } });
});

test('the door needs 12 reads, and a smaller edge needs a longer record', () => {
  assert.equal(SPORT_DOOR_MIN_READS, 12);
  const short = buildTrustedList(doorSeason({ w: 60, games: 11, wins: 8 }), SPORT_DOOR_FROM);
  assert.equal(short.get(`ML|${D60}`)?.door, undefined);
  assert.equal(onSide(short, D60, 'CS2', true), 0);
  // About 1 point a bet: 12 reads score 0.32, under the bar. 30 reads score 0.53.
  const thin = buildTrustedList(doorSeason({ w: 60, games: 12, close: 0.49 }), SPORT_DOOR_FROM);
  assert.equal(thin.get(`ML|${D60}`)?.door, undefined);
  const long = buildTrustedList(doorSeason({ w: 60, games: 30, wins: 20, close: 0.49 }), SPORT_DOOR_FROM);
  assert.deepEqual(long.get(`ML|${D60}`).door, ['CS2']);
  // A wallet the market moved away from never gets through.
  const behind = buildTrustedList(doorSeason({ w: 60, games: 30, wins: 20, close: 0.45 }), SPORT_DOOR_FROM);
  assert.equal(behind.get(`ML|${D60}`)?.door, undefined);
});

test('the door never opens NHL, NBA, NFL, or CFB, and nothing changes before its first morning', () => {
  for (const sport of ['NHL', 'NBA', 'NFL', 'CFB', 'NCAAF']) {
    const list = buildTrustedList(doorSeason({ w: 60, sport }), SPORT_DOOR_FROM);
    assert.equal(list.get(`ML|${D60}`)?.door, undefined, sport);
    assert.equal(sportDoorSizes(list).all, 0, sport);
  }
  const rows = [...ROWS, ...doorSeason({ w: 60 })];
  const before = buildTrustedList(rows, '2026-11-24');
  assert.equal(sportDoorSizes(before).all, 0);
  assert.equal(serializeTrustedList(before, '2026-11-24').doors.length, 0);
  // The standing list is the same list with the door on.
  const after = buildTrustedList(rows, SPORT_DOOR_FROM);
  assert.deepEqual(
    serializeTrustedList(after, SPORT_DOOR_FROM).rows,
    serializeTrustedList(before, SPORT_DOOR_FROM).rows,
  );
  assert.equal(sportDoorSizes(after).all, 1);
});

test('a door wallet still needs 10 moneylines in the sport to count, and to be up to count as profitable', () => {
  // 4-8 at 48 cents: on the wide count, not the profitable one.
  const down = buildTrustedList(doorSeason({ w: 60, wins: 4 }), SPORT_DOOR_FROM);
  assert.deepEqual(down.get(`ML|${D60}`).door, ['CS2']);
  assert.equal(onSide(down, D60, 'CS2', true), 1);
  assert.equal(onSide(down, D60, 'CS2', false), 0);
  // Twelve spread reads and five moneylines: through the door, counted nowhere.
  const rows = [
    ...doorSeason({ w: 60, marketType: 'SPREAD', tag: 's' }),
    ...doorSeason({ w: 60, games: 5, wins: 5, close: 0.48, tag: 'm' }),
  ];
  const few = buildTrustedList(rows, SPORT_DOOR_FROM);
  assert.deepEqual(few.get(`ML|${D60}`).door, ['CS2']);
  assert.equal(onSide(few, D60, 'CS2', true), 0);
  assert.equal(onSide(few, D60, 'CS2', false), 0);
});

test('the closing read is the last other ticket before the start, turned to the wallet\'s side', () => {
  const mine = ticket({ w: 60, d: 0, game: 'g' });
  const read = (others, own = mine) => trustedListBets([own, ...others])
    .find((b) => b.w6 === D60).house;
  // Nobody after: no read.
  assert.equal(read([]), null);
  assert.equal(read([ticket({ w: 91, d: 0, game: 'g', price: 0.6, hoursOut: 8 })]), null);
  // Same side later at 53 cents: +3 points.
  assert.ok(Math.abs(read([ticket({ w: 91, d: 0, game: 'g', price: 0.53, hoursOut: 1 })]) - 0.0305) < 0.0002);
  // The other side later at 45 cents puts this side at 55.
  assert.ok(Math.abs(read([ticket({ w: 91, d: 0, game: 'g', side: 'away', price: 0.45, hoursOut: 1 })]) - 0.0505) < 0.002);
  // The last one before the start is the close, not the best one.
  const two = [
    ticket({ w: 91, d: 0, game: 'g', price: 0.6, hoursOut: 3 }),
    ticket({ w: 92, d: 0, game: 'g', price: 0.47, hoursOut: 1 }),
  ];
  assert.ok(read(two) < 0);
  // A ticket first seen at or after the start, the wallet's own later
  // ticket, and one inside the same minute are not a close.
  assert.equal(read([ticket({ w: 91, d: 0, game: 'g', price: 0.7, hoursOut: -1 })]), null);
  assert.equal(read([{ ...ticket({ w: 60, d: 0, game: 'g', price: 0.7, hoursOut: 1 }), invested: 10 }]), null);
  assert.equal(read([ticket({ w: 91, d: 0, game: 'g', price: 0.7, hoursOut: 6 - 30 / 3600 })]), null);
  // A different market is a different tape.
  assert.equal(read([{ ...ticket({ w: 91, d: 0, game: 'g', price: 0.7, hoursOut: 1 }), conditionId: 'other' }]), null);
  // The wallet's own ticket first seen after the start has no read.
  const late = ticket({ w: 60, d: 0, game: 'g', hoursOut: -0.5 });
  assert.equal(read([ticket({ w: 91, d: 0, game: 'g', price: 0.7, hoursOut: -1 })], late), null);
  // Stored times read the same as seconds, an ISO start, or a Firestore timestamp.
  const closer = ticket({ w: 91, d: 0, game: 'g', price: 0.53, hoursOut: 1 });
  const base = read([closer]);
  const forms = [
    { ...mine, commenceTime: startMs(0) / 1000 },
    { ...mine, commenceTime: new Date(startMs(0)).toISOString() },
    { ...mine, firstSeen: { seconds: Date.parse(mine.firstSeen) / 1000, nanoseconds: 0 } },
    { ...mine, firstSeen: { toMillis: () => Date.parse(mine.firstSeen) } },
  ];
  for (const f of forms) assert.equal(read([closer], f), base);
  // No market id, no side id, or no start: no read.
  for (const gone of ['conditionId', 'asset', 'firstSeen', 'commenceTime']) {
    assert.equal(read([closer], { ...mine, [gone]: null }), null, gone);
  }
});

test('a wallet with a flat 50-cent stored price sets no close and gets no read', () => {
  // Wallet 93 carries 0.5 on all 12 rows. It is not on the tape, so wallet 60 has no closes.
  const rows = doorSeason({ w: 60, closer: 93, close: 0.5 })
    .map((r) => (r.walletShort === wallet(93).slice(-6)
      ? { ...r, ticketTapeLog: [{ gate: 'first', hoursOut: 1, offer: american(0.6), fair: null }] }
      : r));
  const bets = trustedListBets(rows);
  assert.ok(bets.filter((b) => b.w6 === D60).every((b) => b.house === null));
  // And a flat wallet that came first gets no read off a real close.
  const flipped = doorSeason({ w: 93, closer: 60, close: 0.51 }).map((r) => (r.walletShort === D60 ? r : { ...r, avgPrice: 0.5 }));
  const list = buildTrustedList(flipped, SPORT_DOOR_FROM);
  assert.equal(sportDoorSizes(list).all, 0);
});

test('one read is held to 10 points either way', () => {
  // A 42-point jump on one game cannot carry a wallet: 12 reads, eleven flat and one at +42.
  const rows = doorSeason({ w: 60, close: 0.48 });
  const jump = rows.map((r) => (r.gameKey === 'd60_0' && r.walletShort !== D60
    ? { ...r, avgPrice: 0.9, ticketTapeLog: [{ gate: 'first', hoursOut: 1, offer: american(0.9), fair: null }] }
    : r));
  const list = buildTrustedList(jump, SPORT_DOOR_FROM);
  // Held: 0.10 / 12 x 12 / 37 = 0.27 points. Unheld it would be 1.14 and through.
  assert.equal(list.get(`ML|${D60}`)?.door, undefined);
});

test('the stored morning carries the door and reads back the same', () => {
  const list = buildTrustedList([...ROWS, ...doorSeason({ w: 60 })], SPORT_DOOR_FROM);
  const stored = serializeTrustedList(list, SPORT_DOOR_FROM);
  assert.equal(stored.listVersion, TRUSTED_LIST_VERSION);
  assert.equal(stored.doors.length, 1);
  assert.deepEqual(stored.doors[0].door, ['CS2']);
  assert.equal(stored.doors[0].wallet, D60);
  assert.equal(stored.doors[0].reads.CS2.n, 12);
  const back = hydrateTrustedList(JSON.parse(JSON.stringify(stored)));
  assert.deepEqual(back.get(`ML|${D60}`).door, ['CS2']);
  assert.equal(onSide(back, D60, 'CS2', true), onSide(list, D60, 'CS2', true));
  assert.equal(onSide(back, D60, 'CS2', false), onSide(list, D60, 'CS2', false));
  assert.equal(onSide(back, D60, 'CS2', true), 1);
  assert.deepEqual(sportDoorSizes(back), sportDoorSizes(list));
  assert.equal(trustedListSizes(back).ML, trustedListSizes(list).ML);
  // A stored morning from before the door reads back with nobody through it.
  const old = hydrateTrustedList({ ...JSON.parse(JSON.stringify(stored)), doors: undefined });
  assert.equal(sportDoorSizes(old).all, 0);
  // A stored door row can never name one of the four standing sports.
  const bad = hydrateTrustedList({ ...stored, doors: [{ ...stored.doors[0], door: ['NBA'] }] });
  assert.equal(sportDoorSizes(bad).all, 0);
});

test('the stamp names the wallets on a side through the door alone', () => {
  const list = listOf('ML', 'aaaaa1');
  list.get('ML|aaaaa1').sports = ['CS2'];
  list.get('ML|aaaaa1').played = ['CS2'];
  list.set('ML|ddddd1', { trusted: false, standing: null, score: null, n: 14, sports: ['CS2'], played: ['CS2'], door: ['CS2'] });
  list.set('ML|ddddd2', { trusted: false, standing: null, score: null, n: 14, sports: [], played: ['CS2'], door: ['CS2'] });
  list.set('ML|zzzzz1', { trusted: false, standing: 0.4, score: 0, n: 30, sports: ['CS2'], played: ['CS2'] });
  const positions = [pos('aaaaa1', 'home'), pos('ddddd1', 'home'), pos('ddddd2', 'away'), pos('zzzzz1', 'away')];
  const args = { pickDate: SPORT_DOOR_FROM, sport: 'CS2', market: 'ML', side: 'home', positions, list };
  const stamp = trustedCountStamp(args);
  assert.deepEqual(Object.keys(stamp).sort(), [...TRUSTED_COUNT_STAMP_FIELDS, ...SPORT_DOOR_STAMP_FIELDS].sort());
  // Profitable count: the trusted wallet and the door wallet that is up. The down one is on the wide count only.
  assert.deepEqual(stamp.v8_trustedListFor, ['aaaaa1', 'ddddd1']);
  assert.deepEqual(stamp.v8_trustedListAgainst, []);
  assert.deepEqual(stamp.v8_sportDoorFor, ['ddddd1']);
  assert.deepEqual(stamp.v8_sportDoorAgainst, ['ddddd2']);
  // Before the door's first day, and on the four standing sports, the stamp is the old three fields.
  assert.deepEqual(Object.keys(trustedCountStamp({ ...args, pickDate: '2026-11-24' })).sort(), [...TRUSTED_COUNT_STAMP_FIELDS].sort());
  assert.deepEqual(Object.keys(trustedCountStamp({ ...args, sport: 'NBA' })).sort(), [...TRUSTED_COUNT_STAMP_FIELDS].sort());
});

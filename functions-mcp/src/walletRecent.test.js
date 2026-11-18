const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRecentArgs, recentRead, dateBucket, oddsBand } = require('./walletRecent');
const { etDate, handleMcpMessage, indexFeeds } = require('./sharpflowPublic');

const TODAY = '2026-11-18';
const PROFILE = {
  bySport: {
    NBA: { positions: { n: 10, wins: 6, losses: 4, invested: 10000, settledPnl: 500 } },
    NHL: { positions: { n: 4, wins: 2, losses: 2, invested: 2000, settledPnl: 100 } },
  },
};

function bet(overrides) {
  return {
    sport: 'NBA',
    marketType: 'SPREAD',
    status: 'GRADED',
    result: 'WIN',
    invested: 1000,
    settledPnl: 100,
    date: TODAY,
    odds: -110,
    teamName: 'Maple Leafs',
    away: 'Bruins',
    home: 'Canadiens',
    wallet: '0xabcsecretwallet',
    gameKey: 'bos_mtl',
    v8_walletPlayScore: 88,
    steam: 'gold',
    ...overrides,
  };
}

function days(n) {
  const d = new Date(`${TODAY}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

test('filters allow a sport and one slice, and reject a second', () => {
  const ok = validateRecentArgs({ id: '..bc35e3', sport: 'nba', market: 'spread' });
  assert.equal(ok.id, 'bc35e3');
  assert.equal(ok.sport, 'NBA');
  assert.deepEqual(ok.filter, { market: 'SPREAD' });

  assert.match(validateRecentArgs({ id: 'bc35e3', market: 'ML', size: '1x' }).error, /at most one/);
  assert.match(validateRecentArgs({ id: 'bc35e3', size: '1x', odds: '-120 to +120' }).error, /at most one/);
  assert.match(validateRecentArgs({ id: 'bc35e3', market: 'ML', odds: 'longer than +200' }).error, /at most one/);
  assert.match(validateRecentArgs({ id: 'bc35e3', query: 'Celtics' }).error, /at most one of market, size, or odds/);
  assert.match(validateRecentArgs({ sport: 'NBA' }).error, /six-character id/);
  assert.match(validateRecentArgs({ id: 'P' }).error, /letter changes/);
  assert.match(validateRecentArgs({ id: 'bc35e3', market: 'PROP' }).error, /ML, SPREAD, or TOTAL/);
  assert.match(validateRecentArgs({ id: 'bc35e3', size: '2x' }).error, /under 0.5x/);
  assert.match(validateRecentArgs({ id: 'bc35e3', odds: '-110' }).error, /longer than \+200/);
});

test('date and price bands meet on the stated edges', () => {
  assert.equal(dateBucket(days(0), TODAY), 'last 3 days');
  assert.equal(dateBucket(days(2), TODAY), 'last 3 days');
  assert.equal(dateBucket('2026-11-15', TODAY), 'this week');
  assert.equal(dateBucket('2026-11-14', TODAY), 'last 2 weeks');
  assert.equal(dateBucket('2026-11-04', TODAY), 'older');

  assert.equal(oddsBand(-201), '-200 or shorter');
  assert.equal(oddsBand(-200), '-200 or shorter');
  assert.equal(oddsBand(-199), '-199 to -121');
  assert.equal(oddsBand(-121), '-199 to -121');
  assert.equal(oddsBand(-120), '-120 to +120');
  assert.equal(oddsBand(120), '-120 to +120');
  assert.equal(oddsBand(121), '+121 to +200');
  assert.equal(oddsBand(200), '+121 to +200');
  assert.equal(oddsBand(201), 'longer than +200');
});

test('fewer than 5 settled bets returns no rows', () => {
  const rows = [0, 1, 2, 3].map((n) => bet({ date: days(n), odds: -187, invested: 4242 }));
  const read = recentRead({ id: 'bc35e3', profile: PROFILE, rows, today: TODAY });
  assert.equal(read.message, 'not enough history');
  assert.deepEqual(read.bets, []);
  assert.equal(read.summary, undefined);
  assert.match(read.post, /Not enough history/);
  const text = JSON.stringify(read);
  assert.equal(text.includes('Maple Leafs'), false);
  assert.equal(text.includes('4242'), false);
  assert.equal(text.includes('-187'), false);
});

test('the five newest stay, and the payload keeps only bands', () => {
  const rows = [0, 1, 2, 3, 4, 8].map((n) => bet({
    date: days(n),
    odds: n === 8 ? 250 : -110,
    invested: 4242,
    settledPnl: n === 1 ? -200 : 424.2,
    result: n === 1 ? 'LOSS' : 'WIN',
    teamName: 'Maple Leafs',
  }));
  rows.push(bet({ status: 'PENDING', date: days(0), invested: 9000, settledPnl: 9000 }));
  rows.push(bet({ postponed: true, date: days(0), invested: 9000, settledPnl: 0 }));
  const read = recentRead({ id: 'bc35e3', profile: PROFILE, rows, today: TODAY });
  assert.equal(read.bets.length, 5);
  assert.equal(read.message, undefined);
  assert.equal(read.bets.some((row) => row.priceBand === 'longer than +200'), false);
  assert.equal(read.bets[0].when, 'last 3 days');
  assert.equal(read.bets[0].size, '1.5x and up');
  assert.deepEqual(Object.keys(read.bets[0]).sort(), ['market', 'priceBand', 'result', 'size', 'sport', 'when']);
  assert.equal(read.summary.record, '4-1');
  assert.equal(read.summary.n, 5);
  const text = JSON.stringify(read);
  for (const secret of ['Maple Leafs', 'Bruins', 'Canadiens', '0xabc', 'bos_mtl', 'v8_', 'steam', '4242', '-110', '250']) {
    assert.equal(text.includes(secret), false, secret);
  }
  assert.match(read.post, /Wallet \.\.bc35e3/);
  assert.match(read.post, /4-1/);
  assert.doesNotMatch(read.post, /Maple/);
});

test('same-day bets follow grade time, and that time stays off the page', () => {
  const rows = [1, 2, 3, 4].map((n) => bet({ date: days(n), gradedAt: 1 }));
  rows.push(bet({ date: days(0), gradedAt: 10, result: 'LOSS', settledPnl: -50 }));
  rows.push(bet({ date: days(0), gradedAt: 9876543210, result: 'WIN', settledPnl: 50 }));
  const read = recentRead({ id: 'bc35e3', profile: PROFILE, rows, today: TODAY });
  assert.equal(read.bets[0].result, 'W');
  assert.equal(read.bets[1].result, 'L');
  assert.equal(JSON.stringify(read).includes('9876543210'), false);
});

test('a sport and one filter narrow the slice, and a push stays out of the W-L', () => {
  const rows = [];
  for (let n = 0; n < 5; n += 1) {
    rows.push(bet({ date: days(n), marketType: 'SPREAD', sport: 'NBA', odds: -150, invested: 2000, settledPnl: 200 }));
    rows.push(bet({ date: days(n), marketType: 'ML', sport: 'NBA', odds: -150, invested: 2000, settledPnl: -200, result: 'LOSS' }));
    rows.push(bet({ date: days(n), marketType: 'SPREAD', sport: 'NHL', odds: -150, invested: 200, settledPnl: 40 }));
  }
  rows[0] = bet({
    date: days(0),
    marketType: 'SPREAD',
    sport: 'NBA',
    result: 'PUSH',
    settledPnl: 0,
    invested: 1000,
    odds: -150,
  });
  const read = recentRead({
    id: 'bc35e3',
    profile: PROFILE,
    rows,
    sport: 'NBA',
    filter: { market: 'SPREAD' },
    today: TODAY,
  });
  assert.equal(read.bets.length, 5);
  assert.equal(read.bets.every((row) => row.sport === 'NBA' && row.market === 'SPREAD'), true);
  assert.equal(read.summary.record, '4-0');
  assert.equal(read.summary.pushes, 1);
  assert.equal(read.bets[0].result, 'push');
  assert.equal(read.bets[0].size, '1x');
  assert.match(read.post, /basketball, spread/);
  const sized = recentRead({
    id: 'bc35e3',
    profile: PROFILE,
    rows,
    sport: 'NHL',
    filter: { size: 'under 0.5x' },
    today: TODAY,
  });
  assert.equal(sized.bets.length, 5);
  assert.equal(sized.bets.every((row) => row.size === 'under 0.5x' && row.sport === 'NHL'), true);
});

test('the tool answers only for a wallet on tonight\'s board', async () => {
  const feeds = indexFeeds([{
    market: 'ML',
    data: {
      NBA: {
        bos_nyk: {
          away: 'Celtics',
          home: 'Knicks',
          positions: [
            { wallet: '0x000000bc35e3', side: 'away', invested: 1500, odds: -120 },
          ],
        },
      },
    },
  }]);
  const profiles = new Map([
    ['bc35e3', {
      ...PROFILE,
      bySport: {
        ...PROFILE.bySport,
        NBA: { ...PROFILE.bySport.NBA, whitelistTier: 'CONFIRMED' },
      },
    }],
  ]);
  const today = etDate();
  const rows = [0, 1, 2, 3, 4].map((n) => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - n);
    return bet({ date: d.toISOString().slice(0, 10), teamName: 'Celtics', away: 'Celtics', home: 'Knicks' });
  });
  const ctx = {
    loadAction: async () => ({ profiles, games: feeds.games }),
    loadWalletRecent: async () => rows,
  };
  const off = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: { name: 'wallet_recent', arguments: { id: 'ffffff' } },
  }, ctx);
  assert.equal(off.result.isError, true);
  assert.match(off.result.content[0].text, /tonight/);

  const both = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: { name: 'wallet_recent', arguments: { id: 'bc35e3', market: 'ML', odds: '-120 to +120' } },
  }, ctx);
  assert.equal(both.result.isError, true);
  assert.match(both.result.content[0].text, /at most one/);

  const on = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: { name: 'wallet_recent', arguments: { id: 'bc35e3', sport: 'NBA', market: 'SPREAD' } },
  }, ctx);
  const body = JSON.parse(on.result.content[0].text);
  assert.equal(body.bets.length, 5);
  assert.equal(body.id, 'bc35e3');
  const text = JSON.stringify(body);
  assert.equal(text.includes('Celtics'), false);
  assert.equal(text.includes('Knicks'), false);
  assert.equal(text.includes('0x'), false);

  const shortSlice = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: { name: 'wallet_recent', arguments: { id: 'bc35e3', sport: 'NHL' } },
  }, ctx);
  const quiet = JSON.parse(shortSlice.result.content[0].text);
  assert.deepEqual(quiet.bets, []);
  assert.equal(quiet.message, 'not enough history');
});

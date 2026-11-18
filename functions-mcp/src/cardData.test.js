const test = require('node:test');
const assert = require('node:assert/strict');
const { profitCurve, moneyBoard, hotVsSlipping, streakStrip, morningRecap, tally } = require('./cardData');
const { renderCard } = require('./cardRender');
const { handleMcpMessage, indexFeeds, etDate } = require('./sharpflowPublic');
const { memoryCardStore, sharePage } = require('./cardStore');

const TODAY = '2026-11-18';

function row(overrides) {
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
    wallet: '0xabcsecretwallet',
    v8_walletPlayScore: 88,
    steam: 'gold',
    walletShort: 'bc35e3',
    ...overrides,
  };
}

function days(n, from = TODAY) {
  const d = new Date(`${from}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

test('a curve matches the settled record and hides the stake', () => {
  const rows = [0, 1, 2, 3, 4].map((n) => row({
    date: days(n),
    invested: 4242,
    settledPnl: n === 0 ? -424 : 424,
    result: n === 0 ? 'LOSS' : 'WIN',
  }));
  const built = profitCurve({ id: 'bc35e3', rows, window: '30d', today: TODAY });
  const book = tally(rows.map((item) => ({
    invested: item.invested,
    settled: item.settledPnl,
    result: item.result === 'WIN' ? 'W' : 'L',
  })));
  assert.equal(built.data.record, book.record);
  assert.equal(built.data.roiPct, book.roiPct);
  assert.equal(built.data.record, '4-1');
  const text = JSON.stringify({ post: built.post, data: built.data });
  for (const secret of ['Maple Leafs', '0xabc', '4242', 'v8_', 'steam']) {
    assert.equal(text.includes(secret), false, secret);
  }
  const short = profitCurve({ id: 'bc35e3', rows: rows.slice(0, 4), window: '30d', today: TODAY });
  assert.match(short.message, /Not enough history/);
  assert.equal(short.data, undefined);
});

test('hot and slipping needs two markets with 10 bets', () => {
  const profile = {
    bySport: {
      NBA: {
        byMarket: {
          SPREAD: { recentActionWindow: { n: 12, wins: 9, losses: 3, dollarRoi: 18.2 } },
          ML: { recentActionWindow: { n: 11, wins: 3, losses: 8, dollarRoi: -12.4 } },
          TOTAL: { recentActionWindow: { n: 4, wins: 3, losses: 1, dollarRoi: 40 } },
        },
      },
    },
  };
  const rows = [];
  for (let n = 0; n < 6; n += 1) {
    rows.push(row({ date: days(n), marketType: 'SPREAD', settledPnl: 100 }));
    rows.push(row({ date: days(n), marketType: 'ML', settledPnl: -50, result: 'LOSS' }));
  }
  const built = hotVsSlipping({ id: 'bc35e3', profile, rows, today: TODAY });
  assert.equal(built.data.hot.market, 'SPREAD');
  assert.equal(built.data.hot.record, '9-3');
  assert.equal(built.data.slipping.market, 'ML');
  assert.equal(built.data.slipping.record, '3-8');
  assert.equal(JSON.stringify(built).includes('Maple Leafs'), false);
  const one = hotVsSlipping({
    id: 'bc35e3',
    profile: { bySport: { NBA: { byMarket: { SPREAD: profile.bySport.NBA.byMarket.SPREAD } } } },
    rows,
    today: TODAY,
  });
  assert.match(one.message, /Not enough history/);
});

test('a streak needs five decided bets and keeps the last twenty', () => {
  const profile = { bySport: { NBA: { positions: { n: 10, invested: 10000 } } } };
  const rows = [];
  for (let n = 0; n < 22; n += 1) {
    rows.push(row({ date: days(n), marketType: 'ML', settledPnl: n % 2 ? -10 : 10, result: n % 2 ? 'LOSS' : 'WIN' }));
  }
  const built = streakStrip({
    id: 'bc35e3', profile, rows, sport: 'NBA', filter: { market: 'ML' }, today: TODAY,
  });
  assert.equal(built.data.results.length, 20);
  assert.equal(built.data.results.at(-1), 'W');
  const text = JSON.stringify(built.data);
  assert.equal(text.includes('4242') || text.includes('Maple'), false);
  const few = streakStrip({
    id: 'bc35e3', profile, rows: rows.slice(0, 4), sport: 'NBA', filter: { market: 'ML' }, today: TODAY,
  });
  assert.match(few.message, /Not enough history/);
  assert.equal(few.data, undefined);
});

test('the money board has dollars and no wallet ids', () => {
  const built = moneyBoard({
    date: TODAY,
    games: [{
      sport: 'NBA',
      matchup: 'Celtics at Knicks',
      markets: [{
        market: 'ML',
        sides: [
          { pick: 'Celtics', dollars: 8200, confirmed: 3, last30: { record: '11-4' }, tickets: [{ short: 'bc35e3' }] },
          { pick: 'Knicks', dollars: 2100, confirmed: 1, last30: { record: '2-6' }, tickets: [{ short: 'aaaaaa' }] },
        ],
      }],
    }],
  });
  assert.equal(built.data.games[0].sides[0].hot, true);
  assert.equal(built.data.games[0].sides[1].hot, false);
  const text = JSON.stringify(built);
  assert.equal(text.includes('bc35e3'), false);
  assert.equal(text.includes('aaaaaa'), false);
  assert.match(text, /8200|8\.2K|\$8/);
});

test('morning recap ranks wallets with at least three bets', () => {
  const rows = [];
  for (let n = 0; n < 3; n += 1) {
    rows.push(row({ date: TODAY, walletShort: 'aaaaaa', invested: 1000, settledPnl: 200, usual: 1000 }));
    rows.push(row({ date: TODAY, walletShort: 'bbbbbb', invested: 1000, settledPnl: -300, result: 'LOSS', usual: 1000 }));
  }
  rows.push(row({ date: TODAY, walletShort: 'cccccc', invested: 5000, settledPnl: 4000, usual: 1000 }));
  const built = morningRecap({ rows, date: TODAY });
  assert.equal(built.data.best.id, 'aaaaaa');
  assert.equal(built.data.worst.id, 'bbbbbb');
  assert.equal(built.data.best.record, '3-0');
  assert.equal(built.data.bySize[0].size, '1x');
  assert.equal(JSON.stringify(built).includes('Maple Leafs'), false);
  const empty = morningRecap({ rows: [], date: TODAY });
  assert.match(empty.message, /No settled card/);
});

test('a portrait card is a real PNG at both sizes', async () => {
  const data = {
    id: 'bc35e3',
    sport: 'NBA',
    market: 'SPREAD',
    window: '30d',
    record: '4-1',
    roiPct: 12.5,
    peakPct: 18,
    drawdownPct: 4,
    points: [0, 4, 9, 6, 12.5],
  };
  const png = await renderCard('profit_curve', data);
  const story = await renderCard('profit_curve', data, { height: 1920 });
  assert.equal(png.readUInt32BE(16), 1080);
  assert.equal(png.readUInt32BE(20), 1350);
  assert.equal(story.readUInt32BE(16), 1080);
  assert.equal(story.readUInt32BE(20), 1920);
});

test('the tools return links for a wallet on tonight\'s board', async () => {
  const feeds = indexFeeds([{
    market: 'ML',
    data: {
      NBA: {
        bos_nyk: {
          away: 'Celtics',
          home: 'Knicks',
          positions: [{ wallet: '0x000000bc35e3', side: 'away', invested: 1500, odds: -120 }],
        },
      },
    },
  }]);
  const profiles = new Map([['bc35e3', {
    bySport: {
      NBA: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 10, wins: 6, losses: 4, invested: 10000, settledPnl: 500 },
        byMarket: {
          SPREAD: { recentActionWindow: { n: 12, wins: 8, losses: 4, dollarRoi: 11 } },
          TOTAL: { recentActionWindow: { n: 10, wins: 3, losses: 7, dollarRoi: -8 } },
        },
      },
    },
  }]]);
  const today = etDate();
  const rows = [0, 1, 2, 3, 4, 5].map((n) => row({
    date: days(n, today),
    marketType: n < 3 ? 'SPREAD' : 'TOTAL',
  }));
  const store = memoryCardStore();
  const ctx = {
    loadAction: async () => ({ profiles, games: feeds.games }),
    loadWalletRecent: async () => rows,
    loadDayBets: async () => [0, 1, 2].flatMap(() => ([
      row({ date: days(1, today), walletShort: 'aaaaaa', usual: 1000, settledPnl: 100 }),
      row({ date: days(1, today), walletShort: 'bbbbbb', usual: 1000, settledPnl: -80, result: 'LOSS' }),
    ])),
    cardStore: store,
    issuer: 'https://cards.example',
    renderCard: async (_kind, _data, opts) => {
      const height = opts?.height || 1350;
      const buf = Buffer.alloc(32);
      buf.writeUInt32BE(1080, 16);
      buf.writeUInt32BE(height, 20);
      return buf;
    },
  };
  const off = await handleMcpMessage({
    jsonrpc: '2.0', id: 1, method: 'tools/call',
    params: { name: 'profit_curve', arguments: { id: 'ffffff' } },
  }, ctx);
  assert.equal(off.result.isError, true);

  const curve = await handleMcpMessage({
    jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: { name: 'profit_curve', arguments: { id: 'bc35e3', window: 'all' } },
  }, ctx);
  const body = JSON.parse(curve.result.content[0].text);
  assert.match(body.image_url, /\/card\/[a-f0-9]{20}\.png$/);
  assert.match(body.story_url, /-story\.png$/);
  assert.match(body.share_url, /\/card\/[a-f0-9]{20}$/);
  assert.equal(body.data.record, '6-0');
  const page = sharePage({ id: body.share_url.split('/').pop(), post: body.post, issuer: 'https://cards.example' });
  assert.match(page, /og:image/);
  assert.match(page, /utm_source=mcp_card/);

  const strip = await handleMcpMessage({
    jsonrpc: '2.0', id: 3, method: 'tools/call',
    params: { name: 'streak_strip', arguments: { id: 'bc35e3', market: 'SPREAD', size: '1x' } },
  }, ctx);
  assert.equal(strip.result.isError, true);

  const recap = await handleMcpMessage({
    jsonrpc: '2.0', id: 4, method: 'tools/call',
    params: { name: 'morning_recap', arguments: { date: days(1, today) } },
  }, ctx);
  const night = JSON.parse(recap.result.content[0].text);
  assert.equal(night.data.best.id, 'aaaaaa');
  assert.equal(night.data.worst.id, 'bbbbbb');
});

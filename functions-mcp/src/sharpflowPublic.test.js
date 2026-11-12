const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const {
  SERVER_NAME,
  publicLockedSide,
  indexFeeds,
  publicGame,
  publishBoard,
  gameMatches,
  TOOLS,
  handleMcpMessage,
  quotePrice,
  sortPlays,
  finishRecord,
  emptyRecord,
  accumulate,
  redirectAllowed,
  issueCode,
  verifyCode,
} = require('./sharpflowPublic');

test('initialize names the connector', async () => {
  const reply = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2025-06-18' },
  }, {});
  assert.equal(reply.result.serverInfo.name, SERVER_NAME);
  assert.equal(reply.result.protocolVersion, '2025-06-18');
  assert.equal(reply.result.capabilities.tools.listChanged, false);
});

test('today is the first tool and every tool is a read', async () => {
  const reply = await handleMcpMessage({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, {});
  const tools = reply.result.tools;
  assert.deepEqual(tools.map((t) => t.name), ['today', 'locked_card', 'game_action', 'sport_action', 'wallet_profile', 'find_specialists']);
  assert.equal(tools.every((t) => t.annotations.readOnlyHint === true), true);
  assert.equal(tools.every((t) => t.annotations.openWorldHint === false), true);
  assert.equal(TOOLS[0].name, 'today');
  for (const name of ['today', 'locked_card']) {
    const tool = tools.find((t) => t.name === name);
    assert.match(tool.description, /actionTab/);
    assert.match(tool.description, /vsUsual/);
    assert.doesNotMatch(tool.description, /staking math/);
  }
});

test('a staked lock is public and a zero is not', () => {
  const pick = {
    sport: 'NHL',
    date: '2026-11-11',
    away: 'Predators',
    home: 'Ducks',
    commenceTime: 1794438600000,
    result: { awayScore: 0, homeScore: 0 },
    sides: {
      home: {
        lockStage: 'LOCKED',
        finalUnits: 1,
        lock: { team: 'Ducks', odds: -129 },
        health: { status: 'ACTIVE' },
        v8_pressEdge: 4.8,
        wallet: 'secret',
      },
      away: {
        lockStage: 'LOCKED',
        finalUnits: 0,
        lock: { odds: 110 },
        health: { status: 'MUTED' },
      },
    },
  };
  const home = publicLockedSide(pick, 'home', 'ML');
  const away = publicLockedSide(pick, 'away', 'ML');
  assert.equal(away, null);
  assert.equal(home.pick, 'Ducks');
  assert.equal(home.odds, '-129');
  assert.equal(home.units, 1);
  assert.equal(home.status, 'locked');
  assert.equal(home.score, null);
  assert.equal(JSON.stringify(home).includes('v8_'), false);
  assert.equal(JSON.stringify(home).includes('secret'), false);
});

test('action rollup keeps dollars and drops the wallet', () => {
  const feeds = indexFeeds([{
    market: 'ML',
    data: {
      scannedAt: '2026-11-11T15:00:00Z',
      NHL: {
        nsh_ana: {
          away: 'Predators',
          home: 'Ducks',
          positions: [
            { wallet: '0xabc123456789', name: 'Whale', side: 'home', invested: 800, leaderboardRank: 4 },
            { wallet: '0xdef123456780', name: 'Other', side: 'away', invested: 900 },
            { wallet: '0xsmall', side: 'home', invested: 40 },
          ],
        },
      },
    },
  }]);
  const profiles = new Map([
    ['456789', {
      bySport: {
        NHL: {
          whitelistTier: 'CONFIRMED',
          positions: { n: 10, wins: 6, losses: 4, invested: 1000, settledPnl: 100 },
          recentActionWindow: { n: 4, wins: 3, losses: 1, settledPnl: 50 },
        },
      },
    }],
    ['456780', {
      bySport: {
        NHL: {
          whitelistTier: 'CONFIRMED',
          positions: { n: 8, wins: 3, losses: 5, invested: 800, settledPnl: -40 },
        },
      },
    }],
  ]);
  // shorts are last 6 of the lowercased wallet
  const game = feeds.games[0];
  assert.equal(gameMatches(game, 'Ducks'), true);
  assert.equal(gameMatches(game, 'Knicks'), false);
  const pub = publishBoard([game], profiles, null, '2026-11-11')[0];
  const text = JSON.stringify(pub);
  assert.equal(text.includes('456789'), false);
  assert.equal(text.includes('456780'), false);
  assert.equal(text.includes('Whale'), false);
  assert.equal(text.includes('leaderboard'), false);
  assert.equal(text.includes('0x'), false);
  const ml = pub.markets[0];
  assert.equal(ml.market, 'ML');
  assert.equal(ml.sides.length, 2);
  const home = ml.sides.find((s) => s.side === 'home');
  assert.equal(home.dollars, 800);
  assert.equal(home.confirmed, 1);
  assert.equal(home.book.record, '6-4');
  assert.equal(home.last30.record, '3-1');
  assert.equal(home.recordOf, 'one wallet, NHL, all markets');
  assert.equal(typeof home.tickets[0].sameNight, 'string');
});

test('one wallet keeps one letter tonight, and the ticket keeps its price', () => {
  const feeds = indexFeeds([
    {
      market: 'ML',
      data: {
        NBA: {
          okc_por: {
            away: 'Thunder',
            home: 'Trail Blazers',
            positions: [{ wallet: '0xaaa111111111', side: 'away', invested: 510, avgPrice: 0.52 }],
          },
          gsw_hou: {
            away: 'Warriors',
            home: 'Rockets',
            positions: [{ wallet: '0xaaa111111111', side: 'home', invested: 650, avgPrice: 0.65 }],
          },
        },
      },
    },
    {
      market: 'TOTAL',
      data: {
        NHL: {
          phi_edm: {
            away: 'Flyers',
            home: 'Oilers',
            positions: [{ wallet: '0xbbb222222222', side: 'under', invested: 2999, avgPrice: 0.546, entryLine: 6.5 }],
          },
        },
      },
    },
  ]);
  const profiles = new Map([
    ['111111', { bySport: { NBA: { whitelistTier: 'CONFIRMED', positions: { n: 14, wins: 8, losses: 6, invested: 1000, settledPnl: 225 }, form: { actionL10: { w: 7, l: 3 } }, byMarket: { ML: { positions: { n: 10, wins: 6, losses: 4, dollarRoi: 12.5 } } } } } }],
    ['222222', { bySport: { NHL: { whitelistTier: 'CONFIRMED', positions: { n: 10, wins: 6, losses: 4, invested: 5000, settledPnl: 360 }, recentActionWindow: { n: 4, wins: 3, losses: 1, settledPnl: 80, dollarRoi: 4 }, byMarket: { TOTAL: { positions: { n: 20, wins: 12, losses: 8, dollarRoi: 7.2 }, recentActionWindow: { n: 6, wins: 4, losses: 2, dollarRoi: 9 } } } } } }],
  ]);
  const pubs = publishBoard(feeds.games, profiles, {
    NHL: { phi_edm: { commence: '2026-11-12T02:10:00Z', movement: { direction: 'away' } } },
    NBA: { okc_por: { movement: { direction: 'away' } } },
  }, '2026-11-11');
  const thunder = pubs.find((g) => g.away === 'Thunder').markets[0].sides[0];
  const rockets = pubs.find((g) => g.home === 'Rockets').markets[0].sides[0];
  const flyersGame = pubs.find((g) => g.away === 'Flyers');
  const under = flyersGame.markets[0].sides[0];
  assert.equal(thunder.tickets[0].sameNight, rockets.tickets[0].sameNight);
  assert.notEqual(thunder.tickets[0].sameNight, under.tickets[0].sameNight);
  assert.equal(thunder.recordOf, 'one wallet, NBA, all markets');
  assert.equal(under.pick, 'Under 6.5');
  assert.equal(under.tickets[0].price, '-120');
  assert.equal(under.tickets[0].line, 6.5);
  assert.equal(under.tickets[0].sharp.size, 'press');
  assert.equal(under.tickets[0].sharp.vsUsual, 6);
  assert.equal(under.tickets[0].sharp.market.record, '12-8');
  assert.equal(under.tickets[0].sharp.l30.record, '3-1');
  assert.equal(under.opposed, 'unopposed');
  assert.equal(thunder.tickets[0].sharp.form, 'L10 7-3');
  assert.equal(thunder.tickets[0].lineMove, 'with');
  assert.equal(flyersGame.kickoffEt.includes('9:10'), true);
  const text = JSON.stringify(pubs);
  assert.equal(text.includes('111111'), false);
  assert.equal(text.includes('222222'), false);
  assert.equal(text.includes('0x'), false);
});

test('today attaches the money and keeps the locked side', async () => {
  const feeds = indexFeeds([{
    market: 'ML',
    data: {
      NHL: {
        nsh_ana: {
          away: 'Predators',
          home: 'Ducks',
          positions: [
            { wallet: '0xabc123456789', name: 'Whale', side: 'home', invested: 800 },
            { wallet: '0xdef123456780', side: 'away', invested: 900 },
          ],
        },
      },
    },
  }]);
  const profiles = new Map([
    ['456789', { bySport: { NHL: { whitelistTier: 'CONFIRMED', positions: { n: 10, wins: 6, losses: 4, invested: 1000, settledPnl: 100 } } } }],
    ['456780', { bySport: { NHL: { whitelistTier: 'CONFIRMED', positions: { n: 8, wins: 3, losses: 5, invested: 800, settledPnl: -40 } } } }],
  ]);
  const reply = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 9,
    method: 'tools/call',
    params: { name: 'today', arguments: { date: '2026-11-11' } },
  }, {
    loadLocked: async () => [{
      sport: 'NHL',
      away: 'Predators',
      home: 'Ducks',
      pick: 'Ducks',
      market: 'ML',
      side: 'home',
      units: 1,
      status: 'locked',
    }],
    loadAction: async () => ({
      scannedAt: '2026-11-11T15:00:00Z',
      profiles,
      games: feeds.games,
    }),
  });
  const body = JSON.parse(reply.result.content[0].text);
  assert.equal(body.plays.length, 1);
  assert.equal(body.plays[0].pick, 'Ducks');
  assert.equal(body.plays[0].alignment, 'against');
  assert.equal(body.plays[0].money.side, 'away');
  assert.equal(body.plays[0].action[0].moneyOn, 'away');
  assert.equal(body.site.includes('utm_source=mcp'), true);
  assert.equal(body.board.length, 1);
  assert.equal(body.board[0].lead.dollars, 900);
  const text = JSON.stringify(body);
  assert.equal(text.includes('Whale'), false);
  assert.equal(text.includes('0x'), false);

  const card = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 10,
    method: 'tools/call',
    params: { name: 'locked_card', arguments: { date: '2026-11-11' } },
  }, {
    loadLocked: async () => [{
      sport: 'NHL',
      away: 'Predators',
      home: 'Ducks',
      pick: 'Ducks',
      market: 'ML',
      side: 'home',
      units: 1,
      status: 'locked',
    }],
    loadAction: async () => ({
      scannedAt: '2026-11-11T15:00:00Z',
      profiles,
      games: feeds.games,
    }),
  });
  const cardBody = JSON.parse(card.result.content[0].text);
  assert.equal(cardBody.plays[0].action[0].moneyOn, 'away');
});

test('best price carries the hit edge, and the agreeing lock sorts first', () => {
  const price = quotePrice({
    current: { home: -136, away: 120 },
    bestHome: -127,
    bestHomeBook: 'FanDuel',
  }, 'ML', 'home', 1, 'Ducks');
  assert.equal(price.best, '-127');
  assert.equal(price.bestBook, 'FanDuel');
  assert.equal(price.actualWin, 55.6);
  assert.equal(price.actualWinN, 36);
  assert.equal(price.bestImplied, 55.9);
  assert.equal(price.hitEdge, -0.3);

  const sorted = sortPlays([
    { pick: 'A', alignment: 'against', money: { dollars: 900 }, kickoffEt: 'a' },
    { pick: 'B', alignment: 'with', money: { dollars: 100 }, kickoffEt: 'b' },
  ]);
  assert.equal(sorted[0].pick, 'B');

  const record = emptyRecord();
  accumulate(record, { sport: 'NHL', market: 'ML', status: 'win', units: 1, profit: 0.78 });
  accumulate(record, { sport: 'NHL', market: 'ML', status: 'loss', units: 1, profit: -1 });
  const done = finishRecord(record, '2026-06-01', '2026-11-10');
  assert.equal(done.all.record, '1-1');
  assert.equal(done.bySport[0].sport, 'NHL');
  assert.equal(done.bySportMarket[0].market, 'ML');
});

test('a specialist post contrasts the sport with the overall record', async () => {
  const presses = Array.from({ length: 7 }, (_, i) => ({
    date: `2026-11-0${i + 1}`,
    won: 1,
    sizeBand: 'press',
    invested: 400,
  }));
  const specialist = {
    positions: { n: 98, wins: 50, losses: 48, invested: 50000, settledPnl: 1000, dollarRoi: 2 },
    bySport: {
      CFB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 23, wins: 17, losses: 6, invested: 23000, settledPnl: 112000, dollarRoi: 66 },
        byMarket: {
          SPREAD: { positions: { n: 15, wins: 12, losses: 3, settledPnl: 112000, dollarRoi: 80 } },
        },
        form: { actionL10: { w: 10, l: 0 }, recentAction: presses },
      },
    },
  };
  const ordinary = {
    positions: { n: 40, wins: 30, losses: 10, invested: 20000, settledPnl: 4000, dollarRoi: 20 },
    bySport: {
      CFB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 16, wins: 8, losses: 8, invested: 16000, settledPnl: -500, dollarRoi: -3 },
      },
    },
  };
  const feeds = indexFeeds([{
    market: 'SPREAD',
    data: {
      CFB: {
        baylor_tcu: {
          away: 'Baylor',
          home: 'TCU',
          positions: [
            { wallet: '0x000000aaaaaa', side: 'away', invested: 2000, odds: -113, entryLine: 7.5 },
            { wallet: '0x000000bbbbbb', side: 'home', invested: 800, odds: -110, entryLine: -7.5 },
          ],
        },
      },
    },
  }]);
  const profiles = new Map([
    ['aaaaaa', specialist],
    ['bbbbbb', ordinary],
  ]);
  const ctx = {
    loadAction: async () => ({ scannedAt: '2026-11-12T18:00:00Z', profiles, games: feeds.games }),
  };
  const found = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 11,
    method: 'tools/call',
    params: { name: 'find_specialists', arguments: { sport: 'CFB', date: '2026-11-12' } },
  }, ctx);
  const board = JSON.parse(found.result.content[0].text);
  assert.equal(board.specialists[0].sport, '17-6');
  assert.equal(board.specialists[0].overall, '50-48');
  assert.equal(board.specialists[0].bettingBig, true);
  assert.match(board.specialists[0].post, /college football specialist/);
  assert.match(board.specialists[0].post, /Presses \(1\.5x\+\): 7-0/);
  assert.match(board.specialists[0].post, /Last 10: 10-0/);
  assert.ok(board.specialists[0].gap > board.specialists[1].gap);

  feeds.games.push({
    sport: 'NBA',
    gameKey: 'phx_den',
    away: 'Suns',
    home: 'Nuggets',
    markets: {
      ML: [{ wallet: '0x000000cccccc', side: 'away', invested: 5000, odds: -150 }],
    },
  });
  profiles.set('cccccc', {
    positions: { n: 40, wins: 22, losses: 18, invested: 20000, settledPnl: 100, dollarRoi: 1 },
    bySport: {
      NBA: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 20, wins: 12, losses: 8, invested: 10000, settledPnl: 500, dollarRoi: 5 },
      },
    },
  });

  const one = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 12,
    method: 'tools/call',
    params: { name: 'wallet_profile', arguments: { query: 'Baylor at TCU', pick: 'Baylor +7.5', sport: 'CFB', date: '2026-11-12' } },
  }, ctx);
  const body = JSON.parse(one.result.content[0].text);
  assert.equal(body.overall.record, '50-48');
  assert.equal(body.focus, 'CFB');
  assert.equal(body.markets.SPREAD.record, '12-3');
  assert.equal(body.biggestYet, true);
  assert.match(body.post, /Baylor \+7\.5/);
  assert.match(body.tonight[0].price, /-113/);
  assert.equal(body.tonight[0].vsUsual, 2);
  const text = JSON.stringify(body);
  assert.equal(text.includes('aaaaaa'), false);
  assert.equal(text.includes('0x'), false);
  assert.equal(text.includes('bbbbbb'), false);
  assert.equal(text.includes('Suns'), false);

  const suns = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 14,
    method: 'tools/call',
    params: { name: 'wallet_profile', arguments: { query: 'Suns', pick: 'Suns', date: '2026-11-12' } },
  }, ctx);
  const sunsBody = JSON.parse(suns.result.content[0].text);
  assert.equal(sunsBody.overall.record, '22-18');
  assert.equal(sunsBody.focus, 'NBA');

  const missing = await handleMcpMessage({
    jsonrpc: '2.0',
    id: 13,
    method: 'tools/call',
    params: { name: 'wallet_profile', arguments: { query: 'Memphis', pick: 'Suns', date: '2026-11-12' } },
  }, ctx);
  assert.match(missing.result.content[0].text, /No confirmed ticket/);
});

test('oauth code checks the challenge and rejects other sites', () => {
  assert.equal(redirectAllowed('https://chatgpt.com/callback'), true);
  assert.equal(redirectAllowed('https://evil.example/callback'), false);
  const verifier = 'a-verifier-that-is-long-enough';
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  const code = issueCode(challenge);
  assert.equal(verifyCode(code, verifier), true);
  assert.equal(verifyCode(code, 'nope'), false);
});

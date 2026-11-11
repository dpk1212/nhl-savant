const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const {
  SERVER_NAME,
  publicLockedSide,
  indexFeeds,
  publicGame,
  gameMatches,
  TOOLS,
  handleMcpMessage,
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
  assert.deepEqual(tools.map((t) => t.name), ['today', 'locked_card', 'game_action', 'sport_action']);
  assert.equal(tools.every((t) => t.annotations.readOnlyHint === true), true);
  assert.equal(tools.every((t) => t.annotations.openWorldHint === false), true);
  assert.equal(TOOLS[0].name, 'today');
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
  const pub = publicGame(game, profiles);
  const text = JSON.stringify(pub);
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
  assert.equal(body.plays[0].action[0].moneyOn, 'away');
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

test('oauth code checks the challenge and rejects other sites', () => {
  assert.equal(redirectAllowed('https://chatgpt.com/callback'), true);
  assert.equal(redirectAllowed('https://evil.example/callback'), false);
  const verifier = 'a-verifier-that-is-long-enough';
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  const code = issueCode(challenge);
  assert.equal(verifyCode(code, verifier), true);
  assert.equal(verifyCode(code, 'nope'), false);
});

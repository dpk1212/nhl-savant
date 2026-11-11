/**
 * Public Sharp Flow answers for Perplexity and ChatGPT.
 * Locked card and confirmed action, rolled up. No wallet identities,
 * no stake path, no model fields.
 */

const crypto = require('crypto');

const SERVER_NAME = 'NHL Savant - Sharpflow';
const SERVER_VERSION = '1.0.0';
const MIN_DOLLARS = 500;
const PROTOCOL = '2025-03-26';

const INSTRUCTIONS = [
  'When someone asks what to know today, call today once and answer from that payload.',
  'Lead with the locked plays in start order, then where the confirmed money is on those same games.',
  'The locked play and the money side can differ. Say so in one line when they do.',
  'If every stake is the same size, say that once.',
  'Do not name wallets. Do not explain how a stake was chosen. Do not invent a rank.',
  'Do not add a section listing what this feed does not contain.',
  'Do not ask for another tool call to finish the same day.',
].join(' ');

const READ = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

const TOOLS = [
  {
    name: 'today',
    title: "Today's Sharp Flow",
    description: 'The whole day in one read: every staked lock, and the confirmed money on those same games. Use this for any question about today.',
    annotations: { ...READ, title: "Today's Sharp Flow" },
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Game date YYYY-MM-DD in US Eastern. Defaults to today.' },
        sport: { type: 'string', description: 'Optional sport, such as NHL, NBA, NFL, CFB, CBB.' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'locked_card',
    title: 'Locked card',
    annotations: { ...READ, title: 'Locked card' },
    description: 'Staked Sharp Flow locks for a date. Each row is the play, the price, the units, and the result if the game is graded. No staking math.',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Game date YYYY-MM-DD in US Eastern. Defaults to today.' },
        sport: { type: 'string', description: 'Optional sport, such as NHL, NBA, NFL, CFB, CBB.' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'game_action',
    title: 'Game action',
    annotations: { ...READ, title: 'Game action' },
    description: 'Confirmed action on one game, rolled up by market and side. Dollars, how many confirmed wallets, and their combined record. No names.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Team, matchup, or game key. Example: Ducks, or Predators at Ducks.' },
        sport: { type: 'string', description: 'Optional sport filter.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'sport_action',
    title: 'Sport action',
    annotations: { ...READ, title: 'Sport action' },
    description: 'Tonight’s confirmed action for one sport, one rollup per game. Dollars and combined records only.',
    inputSchema: {
      type: 'object',
      properties: {
        sport: { type: 'string', description: 'Sport code. Example: NHL. Omit to list every sport that has action.' },
      },
      additionalProperties: false,
    },
  },
];

function etDate(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function etStamp(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) return null;
  return new Date(n).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function fold(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function shortWallet(value) {
  return String(value || '').toLowerCase().slice(-6);
}

function fmtOdds(odds) {
  const n = Number(odds);
  if (!Number.isFinite(n) || n === 0) return null;
  const r = Math.round(n);
  return r > 0 ? `+${r}` : String(r);
}

function toWin(odds, units) {
  const o = Number(odds);
  const u = Number(units);
  if (!Number.isFinite(o) || !Number.isFinite(u) || u <= 0 || o === 0) return null;
  const win = o < 0 ? u * (100 / Math.abs(o)) : u * (o / 100);
  return Math.round(win * 100) / 100;
}

function emptyPool() {
  return { wins: 0, losses: 0, invested: 0, settled: 0, hasSettled: false };
}

function addPool(pool, part) {
  if (!part) return;
  pool.wins += part.wins || 0;
  pool.losses += part.losses || 0;
  if (Number.isFinite(part.invested) && part.invested > 0) pool.invested += part.invested;
  if (Number.isFinite(part.settled)) {
    pool.settled += part.settled;
    pool.hasSettled = true;
  }
}

function finishPool(pool) {
  const decided = pool.wins + pool.losses;
  const out = {
    record: decided > 0 ? `${pool.wins}-${pool.losses}` : null,
    winPct: decided > 0 ? Math.round((1000 * pool.wins) / decided) / 10 : null,
  };
  if (pool.hasSettled) out.dollars = Math.round(pool.settled);
  if (pool.invested > 0 && pool.hasSettled) {
    out.returnPct = Math.round((1000 * pool.settled) / pool.invested) / 10;
  }
  return out;
}

function careerOf(rec) {
  const pos = rec?.positions;
  if (!pos) return null;
  const wins = Number(pos.wins) || 0;
  const n = Number(pos.n) || (wins + (Number(pos.losses) || 0));
  const losses = Number.isFinite(Number(pos.losses)) ? Number(pos.losses) : Math.max(0, n - wins);
  if (wins + losses <= 0 && !Number.isFinite(Number(pos.settledPnl))) return null;
  return {
    wins,
    losses,
    invested: Number(pos.invested),
    settled: Number(pos.settledPnl),
  };
}

function last30Of(rec) {
  const w = rec?.recentActionWindow;
  if (!w) return null;
  const wins = Number(w.wins) || 0;
  const n = Number(w.n) || (wins + (Number(w.losses) || 0));
  const losses = Number.isFinite(Number(w.losses)) ? Number(w.losses) : Math.max(0, n - wins);
  if (wins + losses <= 0 && !Number.isFinite(Number(w.settledPnl))) return null;
  return {
    wins,
    losses,
    invested: Number(w.invested),
    settled: Number(w.settledPnl),
  };
}

function isConfirmed(profile, sport) {
  const tier = profile?.bySport?.[sport]?.whitelistTier;
  return String(tier || '').toUpperCase() === 'CONFIRMED';
}

function pickLabel(side, away, home, line) {
  if (side === 'over') return line != null ? `Over ${line}` : 'Over';
  if (side === 'under') return line != null ? `Under ${line}` : 'Under';
  if (side === 'draw') return 'Draw';
  const team = side === 'away' ? away : side === 'home' ? home : side;
  if (line == null || line === '') return team || side;
  const n = Number(line);
  const shown = Number.isFinite(n) ? `${n > 0 ? '+' : ''}${n}` : String(line);
  return `${team} ${shown}`.trim();
}

function publicLockedSide(pick, sideKey, market) {
  const sd = pick?.sides?.[sideKey];
  if (!sd || sd.superseded) return null;
  const units = Number(sd.finalUnits);
  if (!(units > 0)) return null;
  if (sd.lockStage !== 'LOCKED') return null;
  const health = sd.health?.status;
  if (health === 'MUTED' || health === 'CANCELLED') return null;

  const away = pick.away || null;
  const home = pick.home || null;
  const line = sd.lock?.line ?? sd.peak?.line ?? null;
  const odds = sd.lock?.odds ?? sd.peak?.odds ?? null;
  const outcome = sd.result?.outcome || null;
  const scores = pick.result || {};
  const awayScore = Number(scores.awayScore);
  const homeScore = Number(scores.homeScore);
  const graded = outcome === 'WIN' || outcome === 'LOSS' || outcome === 'PUSH';

  return {
    sport: pick.sport || null,
    date: pick.date || null,
    matchup: away && home ? `${away} at ${home}` : null,
    away,
    home,
    kickoffEt: etStamp(pick.commenceTime),
    market,
    side: sideKey,
    pick: pickLabel(sideKey, away, home, market === 'ML' ? null : line),
    line: market === 'ML' ? null : (line == null ? null : Number(line)),
    units: Math.round(units * 100) / 100,
    odds: fmtOdds(odds),
    toWin: toWin(odds, units),
    status: graded ? outcome.toLowerCase() : 'locked',
    score: graded && Number.isFinite(awayScore) && Number.isFinite(homeScore)
      ? { away: awayScore, home: homeScore }
      : null,
  };
}

function indexFeeds(feeds) {
  const games = new Map();
  let scannedAt = null;
  for (const feed of feeds || []) {
    const data = feed?.data || {};
    if (data.scannedAt) scannedAt = data.scannedAt;
    for (const [sport, board] of Object.entries(data)) {
      if (!board || typeof board !== 'object' || Array.isArray(board)) continue;
      if (sport === 'scannedAt') continue;
      for (const [gameKey, gd] of Object.entries(board)) {
        if (!gd || !Array.isArray(gd.positions)) continue;
        const id = `${sport}|${gameKey}`;
        if (!games.has(id)) {
          games.set(id, {
            sport,
            gameKey,
            away: gd.away || gd.awayTeam || null,
            home: gd.home || gd.homeTeam || null,
            markets: {},
          });
        }
        const game = games.get(id);
        if (!game.away && (gd.away || gd.awayTeam)) game.away = gd.away || gd.awayTeam;
        if (!game.home && (gd.home || gd.homeTeam)) game.home = gd.home || gd.homeTeam;
        game.markets[feed.market] = gd.positions;
      }
    }
  }
  return { games: [...games.values()], scannedAt };
}

function gameMatches(game, query) {
  const q = fold(query);
  if (!q) return false;
  const key = fold(game.gameKey).replace(/ /g, '');
  const qKey = q.replace(/ /g, '');
  if (key && (qKey === key || qKey.includes(key))) return true;
  const names = [fold(game.away), fold(game.home)].filter(Boolean);
  const tokens = q.split(' ').filter((t) => t.length >= 2 && t !== 'at' && t !== 'vs');
  if (!tokens.length) return false;
  return tokens.every((t) => names.some((n) => n.includes(t)));
}

function rollupPositions(positions, sport, profiles) {
  const bySide = new Map();
  for (const pos of positions || []) {
    const invested = Number(pos?.invested || pos?.size || 0) || 0;
    if (invested < MIN_DOLLARS) continue;
    const short = shortWallet(pos.walletShort || pos.wallet);
    const profile = profiles.get(short);
    if (!isConfirmed(profile, sport)) continue;
    const side = pos.side;
    if (!side) continue;
    if (!bySide.has(side)) {
      bySide.set(side, {
        side,
        dollars: 0,
        wallets: new Set(),
        career: emptyPool(),
        last30: emptyPool(),
      });
    }
    const row = bySide.get(side);
    row.dollars += invested;
    if (!row.wallets.has(short)) {
      row.wallets.add(short);
      const rec = profile.bySport[sport];
      addPool(row.career, careerOf(rec));
      addPool(row.last30, last30Of(rec));
    }
  }

  const sides = [...bySide.values()].map((row) => ({
    side: row.side,
    dollars: Math.round(row.dollars),
    confirmed: row.wallets.size,
    book: finishPool(row.career),
    last30: finishPool(row.last30),
  })).sort((a, b) => b.dollars - a.dollars);

  let moneyOn = null;
  if (sides.length === 1) moneyOn = sides[0].side;
  else if (sides.length > 1) {
    moneyOn = sides[0].dollars === sides[1].dollars ? 'split' : sides[0].side;
  }
  return { moneyOn, sides };
}

function publicGame(game, profiles) {
  const markets = Object.entries(game.markets).map(([market, positions]) => {
    const roll = rollupPositions(positions, game.sport, profiles);
    return {
      market,
      moneyOn: roll.moneyOn,
      sides: roll.sides.map((side) => ({
        ...side,
        pick: pickLabel(side.side, game.away, game.home, null),
      })),
    };
  }).filter((m) => m.sides.length > 0);

  return {
    sport: game.sport,
    matchup: game.away && game.home ? `${game.away} at ${game.home}` : game.gameKey,
    away: game.away,
    home: game.home,
    markets,
  };
}

function shortsInGames(games) {
  const shorts = new Set();
  for (const game of games) {
    for (const positions of Object.values(game.markets)) {
      for (const pos of positions || []) {
        const invested = Number(pos?.invested || pos?.size || 0) || 0;
        if (invested < MIN_DOLLARS) continue;
        const short = shortWallet(pos.walletShort || pos.wallet);
        if (short) shorts.add(short);
      }
    }
  }
  return [...shorts];
}

function buildToday(plays, games, profiles) {
  return (plays || []).map((play) => {
    const sport = String(play.sport || '').toUpperCase();
    const game = (games || []).find((g) => (
      String(g.sport || '').toUpperCase() === sport
      && gameMatches(g, `${play.away || ''} ${play.home || ''}`)
    ));
    const pub = game ? publicGame(game, profiles || new Map()) : null;
    return {
      ...play,
      action: pub && pub.markets.length ? pub.markets : null,
    };
  });
}

function textBlock(value) {
  return {
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    structuredContent: value,
  };
}

function toolError(message) {
  return {
    content: [{ type: 'text', text: message }],
    isError: true,
  };
}

async function callTool(name, args, ctx) {
  const a = args || {};
  if (name === 'today') {
    const date = a.date || etDate();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return toolError('date must be YYYY-MM-DD');
    const sport = a.sport ? String(a.sport).toUpperCase() : null;
    const [plays, action] = await Promise.all([
      ctx.loadLocked({ date, sport }),
      ctx.loadAction(),
    ]);
    const games = sport ? action.games.filter((g) => g.sport === sport) : action.games;
    return textBlock({
      source: 'Sharp Flow day. Locked card, with confirmed action of $500 and up on those games.',
      date,
      sport,
      scannedAt: action.scannedAt,
      plays: buildToday(plays, games, action.profiles),
    });
  }
  if (name === 'locked_card') {
    const date = a.date || etDate();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return toolError('date must be YYYY-MM-DD');
    const sport = a.sport ? String(a.sport).toUpperCase() : null;
    const plays = await ctx.loadLocked({ date, sport });
    return textBlock({
      source: 'Sharp Flow locked card',
      date,
      sport,
      plays,
    });
  }
  if (name === 'game_action') {
    const query = String(a.query || '').trim();
    if (!query) return toolError('query is required');
    const sport = a.sport ? String(a.sport).toUpperCase() : null;
    const { games, scannedAt, profiles } = await ctx.loadAction();
    const hits = games.filter((g) => (!sport || g.sport === sport) && gameMatches(g, query));
    const shown = hits.slice(0, 5).map((g) => publicGame(g, profiles)).filter((g) => g.markets.length);
    return textBlock({
      source: 'Confirmed action, $500 and up, rolled up',
      scannedAt,
      query,
      matches: shown,
      truncated: hits.length > shown.length,
    });
  }
  if (name === 'sport_action') {
    const sport = a.sport ? String(a.sport).toUpperCase() : null;
    const { games, scannedAt, profiles } = await ctx.loadAction();
    const wanted = sport ? games.filter((g) => g.sport === sport) : games;
    const bySport = new Map();
    for (const game of wanted) {
      const pub = publicGame(game, profiles);
      if (!pub.markets.length) continue;
      if (!bySport.has(game.sport)) bySport.set(game.sport, []);
      bySport.get(game.sport).push(pub);
    }
    const sports = [...bySport.entries()].map(([code, list]) => ({ sport: code, games: list }));
    return textBlock({
      source: 'Confirmed action, $500 and up, rolled up',
      scannedAt,
      sports,
    });
  }
  return toolError(`Unknown tool ${name}`);
}

function rpcResult(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function rpcError(id, code, message) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

async function handleMcpMessage(msg, ctx) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
    return rpcError(msg?.id ?? null, -32600, 'Invalid request');
  }
  const { id, method, params } = msg;
  try {
    if (method === 'initialize') {
      const clientVersion = params?.protocolVersion;
      return rpcResult(id, {
        protocolVersion: typeof clientVersion === 'string' && clientVersion ? clientVersion : PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions: INSTRUCTIONS,
      });
    }
    if (method === 'ping') return rpcResult(id, {});
    if (method === 'tools/list') return rpcResult(id, { tools: TOOLS });
    if (method === 'resources/list') return rpcResult(id, { resources: [] });
    if (method === 'prompts/list') return rpcResult(id, { prompts: [] });
    if (method === 'tools/call') {
      const result = await callTool(params?.name, params?.arguments, ctx);
      return rpcResult(id, result);
    }
    if (method.startsWith('notifications/')) return null;
    return rpcError(id, -32601, `Method not found: ${method}`);
  } catch (err) {
    return rpcError(id, -32603, err?.message || 'Server error');
  }
}

const REDIRECT_HOSTS = ['chatgpt.com', 'openai.com', 'perplexity.ai', 'claude.ai'];

function redirectAllowed(uri) {
  try {
    const url = new URL(uri);
    if (url.protocol !== 'https:') return false;
    return REDIRECT_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

function issueCode(codeChallenge) {
  return Buffer.from(JSON.stringify({
    ch: codeChallenge || '',
    exp: Date.now() + 10 * 60 * 1000,
  })).toString('base64url');
}

function verifyCode(code, verifier) {
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(String(code || ''), 'base64url').toString());
  } catch {
    return false;
  }
  if (!parsed || !(parsed.exp > Date.now())) return false;
  if (!parsed.ch) return true;
  if (!verifier) return false;
  const hash = crypto.createHash('sha256').update(verifier).digest('base64url');
  return hash === parsed.ch;
}

module.exports = {
  SERVER_NAME,
  MIN_DOLLARS,
  TOOLS,
  etDate,
  publicLockedSide,
  indexFeeds,
  gameMatches,
  publicGame,
  buildToday,
  shortsInGames,
  handleMcpMessage,
  redirectAllowed,
  issueCode,
  verifyCode,
};

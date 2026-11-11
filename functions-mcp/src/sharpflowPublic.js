/**
 * Public Sharp Flow answers for Perplexity and ChatGPT.
 * Locked card and confirmed action, rolled up. No wallet identities,
 * no stake path, no model fields.
 */

const crypto = require('crypto');
const { unitMarketHit } = require('./sharpflowHit');

const SERVER_NAME = 'NHL Savant - Sharpflow';
const SERVER_VERSION = '1.0.0';
const MIN_DOLLARS = 500;
const PROTOCOL = '2025-03-26';

const SITE = 'https://nhlsavant.com/?utm_source=mcp&utm_medium=sharpflow';

const INSTRUCTIONS = [
  'Call today or locked_card once. The payload is the whole day.',
  'Locks with confirmed money on the same side come first. That order is agreement, then dollars. It is not an edge ranking.',
  'A record is that sport, all markets. When confirmed is 1, it is one wallet. When confirmed is more than 1, it is those wallets pooled.',
  'sharp on a ticket is the Action tab for that wallet: size versus their usual, last-10 form, last-30 dollars, and the record in this market. opposed is unopposed or contested.',
  'sameNight letters match the same wallet across games tonight only. The letter is not a name and it changes tomorrow.',
  'Each ticket has the price paid and the line. kickoffEt is the game time.',
  'Do not name a wallet. Do not explain how a stake was chosen.',
  'End with the site link.',
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
    description: 'Call this for any question about today. The response includes actionTab: one row per confirmed ticket of $500 and up, largest dollars first. Each row has price, line, sharp.size (press, usual, lean, or light), sharp.vsUsual (this ticket divided by that wallet usual bet in the sport), sharp.form, sharp.market, and opposed. No wallet names and no wallet ids. Always call. Do not answer from an earlier snapshot.',
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
    description: 'Same payload as today. Call this. actionTab is one row per confirmed ticket, largest dollars first, with sharp.size and sharp.vsUsual. vsUsual is this ticket divided by that wallet usual bet in the sport. The usual dollar amount and the wallet id are not included. No wallet names. Do not answer from an earlier snapshot.',
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
    description: 'Confirmed tickets on one game. Each side lists tickets with price, line, sharp.size, sharp.vsUsual, form, and the record in that market. No wallet names.',
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
    description: 'Tonight’s confirmed tickets for one sport. Each game lists tickets with price, line, sharp.size, and sharp.vsUsual. No wallet names.',
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

function ticketOf(pos, market) {
  const raw = Number(pos?.entryAvgPrice ?? pos?.avgPrice ?? pos?.price);
  let prob = null;
  if (Number.isFinite(raw) && raw > 0) {
    if (raw <= 1) prob = raw;
    else if (raw <= 100) prob = raw / 100;
  }
  const odds = Number(pos?.odds);
  const american = Number.isFinite(odds) && odds !== 0 ? Math.round(odds) : americanFromProb(prob);
  let line = null;
  if (market === 'TOTAL' || market === 'SPREAD') {
    const n = Number(pos?.entryLine ?? pos?.totalLine ?? pos?.spreadLine);
    if (Number.isFinite(n)) line = n;
  }
  return { price: fmtOdds(american), line };
}

function returnPctOf(agg) {
  const roi = Number(agg?.dollarRoi);
  if (Number.isFinite(roi)) return Math.round(roi * 10) / 10;
  const invested = Number(agg?.invested);
  const pnl = Number(agg?.settledPnl);
  if (invested > 0 && Number.isFinite(pnl)) return Math.round((1000 * pnl) / invested) / 10;
  return null;
}

function recordSnap(agg) {
  if (!agg || !(Number(agg.n) > 0)) return null;
  const wins = Number(agg.wins) || 0;
  const losses = Number.isFinite(Number(agg.losses)) ? Number(agg.losses) : Math.max(0, Number(agg.n) - wins);
  const snap = { record: `${wins}-${losses}` };
  const ret = returnPctOf(agg);
  if (ret != null) snap.returnPct = ret;
  if (Number.isFinite(Number(agg.settledPnl))) snap.dollars = Math.round(Number(agg.settledPnl));
  return snap;
}

function sharpOf(profile, sport, market, invested) {
  const rec = profile?.bySport?.[sport];
  const sharp = {};
  const n = Number(rec?.positions?.n) || 0;
  const bookInvested = Number(rec?.positions?.invested);
  if (invested > 0 && n > 0 && bookInvested > 0) {
    const ratio = invested / (bookInvested / n);
    sharp.vsUsual = Math.round(ratio * 10) / 10;
    if (ratio >= 1.5) sharp.size = 'press';
    else if (ratio >= 1) sharp.size = 'usual';
    else if (ratio >= 0.5) sharp.size = 'lean';
    else sharp.size = 'light';
  }
  const form = rec?.form;
  const l10 = form?.actionL10 || form?.l10;
  const l5 = form?.actionL5 || form?.l5;
  if (l10 && (Number(l10.w) + Number(l10.l)) > 0) sharp.form = `L10 ${l10.w}-${l10.l}`;
  else if (l5 && (Number(l5.w) + Number(l5.l)) > 0) sharp.form = `L5 ${l5.w}-${l5.l}`;
  const l30 = recordSnap(rec?.recentActionWindow);
  if (l30) sharp.l30 = l30;
  const mkt = rec?.byMarket?.[market];
  const marketBook = recordSnap(mkt?.positions);
  const marketL30 = recordSnap(mkt?.recentActionWindow);
  if (marketBook || marketL30) {
    sharp.market = {};
    if (marketBook) sharp.market.record = marketBook.record;
    if (marketBook?.returnPct != null) sharp.market.returnPct = marketBook.returnPct;
    if (marketL30) sharp.market.l30 = marketL30;
  }
  return Object.keys(sharp).length ? sharp : null;
}

function lineMove(prices, sport, gameKey, side, market) {
  if (market !== 'ML') return null;
  const dir = prices?.[sport]?.[gameKey]?.movement?.direction;
  if (!dir || side === 'over' || side === 'under') return null;
  if (dir === side) return 'with';
  if (dir === 'away' || dir === 'home') return 'against';
  return null;
}

function rollupPositions(positions, sport, profiles, market) {
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
        byWallet: new Map(),
        career: emptyPool(),
        last30: emptyPool(),
      });
    }
    const row = bySide.get(side);
    row.dollars += invested;
    const ticket = ticketOf(pos, market);
    const held = row.byWallet.get(short);
    if (!held) {
      row.byWallet.set(short, {
        short,
        dollars: invested,
        price: ticket.price,
        line: ticket.line,
        sharp: sharpOf(profile, sport, market, invested),
      });
    } else {
      held.dollars += invested;
      if (held.price !== ticket.price) held.price = null;
      if (held.line !== ticket.line) held.line = null;
    }
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
    tickets: [...row.byWallet.values()].map((t) => ({
      ...t,
      dollars: Math.round(t.dollars),
    })),
  })).sort((a, b) => b.dollars - a.dollars);

  let moneyOn = null;
  if (sides.length === 1) moneyOn = sides[0].side;
  else if (sides.length > 1) {
    moneyOn = sides[0].dollars === sides[1].dollars ? 'split' : sides[0].side;
  }
  return { moneyOn, sides };
}

function sharedLine(tickets) {
  const lines = (tickets || []).map((t) => t.line).filter((v) => v != null);
  if (!lines.length || lines.some((v) => v !== lines[0])) return null;
  return lines[0];
}

function kickoffOf(prices, sport, gameKey) {
  const c = prices?.[sport]?.[gameKey]?.commence;
  if (c == null || c === '') return null;
  if (typeof c === 'number') return etStamp(c > 1e12 ? c : c * 1000);
  const ms = Date.parse(c);
  return Number.isFinite(ms) ? etStamp(ms) : null;
}

function publicGame(game, profiles, prices) {
  const markets = Object.entries(game.markets).map(([market, positions]) => {
    const roll = rollupPositions(positions, game.sport, profiles, market);
    return {
      market,
      moneyOn: roll.moneyOn,
      sides: roll.sides.map((side) => ({
        ...side,
        pick: pickLabel(side.side, game.away, game.home, market === 'ML' ? null : sharedLine(side.tickets)),
      })),
    };
  }).filter((m) => m.sides.length > 0);

  return {
    sport: game.sport,
    gameKey: game.gameKey,
    matchup: game.away && game.home ? `${game.away} at ${game.home}` : game.gameKey,
    away: game.away,
    home: game.home,
    kickoffEt: kickoffOf(prices, game.sport, game.gameKey),
    markets,
  };
}

function nightLetter(index) {
  let n = index;
  let s = '';
  while (n >= 0) {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

function nightKey(date, short) {
  return crypto.createHash('sha256').update(`${date}|${short}`).digest('hex');
}

function sealNight(games, date, prices) {
  const shorts = new Set();
  for (const game of games || []) {
    for (const market of game.markets || []) {
      for (const side of market.sides || []) {
        for (const ticket of side.tickets || []) {
          if (ticket.short) shorts.add(ticket.short);
        }
      }
    }
  }
  const ordered = [...shorts].sort((a, b) => nightKey(date, a).localeCompare(nightKey(date, b)));
  const letters = new Map(ordered.map((short, i) => [short, nightLetter(i)]));
  for (const game of games || []) {
    const sport = game.sport || 'this sport';
    for (const market of game.markets || []) {
      for (const side of market.sides || []) {
        const n = side.confirmed || 0;
        side.recordOf = n === 1
          ? `one wallet, ${sport}, all markets`
          : `${n} wallets pooled, ${sport}, all markets`;
        const other = { away: 'home', home: 'away', over: 'under', under: 'over' }[side.side];
        const foe = (market.sides || []).find((row) => row.side === other);
        side.opposedBy = foe?.confirmed || 0;
        side.opposed = side.opposedBy > 0 ? 'contested' : 'unopposed';
        side.tickets = (side.tickets || []).map((ticket) => {
          const out = { sameNight: letters.get(ticket.short) || null, dollars: ticket.dollars };
          if (ticket.price) out.price = ticket.price;
          if (ticket.line != null) out.line = ticket.line;
          if (ticket.sharp) out.sharp = ticket.sharp;
          const move = lineMove(prices, game.sport, game.gameKey, side.side, market.market);
          if (move) out.lineMove = move;
          return out;
        });
      }
    }
  }
  return games;
}

function publishBoard(games, profiles, prices, date) {
  const pubs = [];
  for (const game of games || []) {
    const pub = publicGame(game, profiles, prices);
    if (pub.markets.length) pubs.push(pub);
  }
  return sealNight(pubs, date || etDate(), prices);
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
      gameKey: game?.gameKey || null,
      action: pub && pub.markets.length ? pub.markets : null,
    };
  });
}

function moneyLine(market) {
  if (!market || !market.moneyOn) return null;
  const lead = (market.sides || []).find((s) => s.side === market.moneyOn) || market.sides?.[0];
  if (!lead) return { side: market.moneyOn };
  return {
    side: market.moneyOn,
    dollars: lead.dollars,
    confirmed: lead.confirmed,
    record: lead.book?.record || null,
    returnPct: lead.book?.returnPct ?? null,
    last30: lead.last30?.record || null,
    recordOf: lead.recordOf || null,
    opposed: lead.opposed || null,
    sameNight: (lead.tickets || []).map((t) => t.sameNight).filter(Boolean),
  };
}

const ACTION_CAP = 40;

function actionRows(pubs) {
  const rows = [];
  for (const pub of pubs || []) {
    for (const market of pub.markets || []) {
      for (const side of market.sides || []) {
        for (const ticket of side.tickets || []) {
          rows.push({
            sport: pub.sport,
            matchup: pub.matchup,
            kickoffEt: pub.kickoffEt || null,
            market: market.market,
            pick: side.pick,
            opposed: side.opposed,
            opposedBy: side.opposedBy,
            recordOf: side.recordOf,
            ...ticket,
          });
        }
      }
    }
  }
  rows.sort((a, b) => b.dollars - a.dollars);
  return rows;
}

function alignmentOf(play) {
  const market = (play.action || []).find((m) => m.market === play.market);
  const money = moneyLine(market);
  if (!money) return { alignment: 'none', money: null };
  if (money.side === 'split') return { alignment: 'split', money };
  if (money.side === play.side) return { alignment: 'with', money };
  return { alignment: 'against', money };
}

const ALIGN_RANK = { with: 0, against: 1, split: 2, none: 3 };

function impliedPct(american) {
  const n = Number(american);
  if (!Number.isFinite(n) || n === 0) return null;
  const p = n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
  return Math.round(p * 1000) / 10;
}

function americanFromProb(p) {
  if (p == null || !Number.isFinite(p) || p <= 0 || p >= 1) return null;
  if (p >= 0.5) return Math.round((-100 * p) / (1 - p));
  return Math.round((100 * (1 - p)) / p);
}

function noVig(oddsList) {
  const raw = (oddsList || []).map((o) => {
    const n = Number(o);
    if (!Number.isFinite(n) || n === 0) return null;
    return n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
  });
  if (!raw.length || raw.some((p) => p == null)) return null;
  const sum = raw.reduce((s, p) => s + p, 0);
  if (!(sum > 0)) return null;
  return americanFromProb(raw[0] / sum);
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function quotePrice(game, market, side, units, pick) {
  if (!game) return null;
  let fair = null;
  let best = null;
  let bestBook = null;
  let line = null;
  let bestLine = null;
  if (market === 'ML') {
    const cur = game.current || {};
    const home = num(cur.home);
    const away = num(cur.away);
    const draw = num(cur.draw);
    const hasDraw = draw != null;
    if (side === 'away') {
      best = num(game.bestAway);
      bestBook = game.bestAwayBook || null;
      fair = hasDraw ? noVig([away, home, draw]) : noVig([away, home]);
    } else if (side === 'home') {
      best = num(game.bestHome);
      bestBook = game.bestHomeBook || null;
      fair = hasDraw ? noVig([home, away, draw]) : noVig([home, away]);
    } else if (side === 'draw') {
      best = num(game.bestDraw);
      bestBook = game.bestDrawBook || null;
      fair = hasDraw ? noVig([draw, away, home]) : null;
    }
  } else if (market === 'SPREAD') {
    const cur = game.spreadCurrent || {};
    line = side === 'away' ? num(cur.awayLine) : num(cur.homeLine);
    const ours = side === 'away' ? num(cur.awayOdds) : num(cur.homeOdds);
    const opp = side === 'away' ? num(cur.homeOdds) : num(cur.awayOdds);
    fair = noVig([ours, opp]);
    const chip = side === 'away' ? game.bestAwaySpread : game.bestHomeSpread;
    best = num(chip?.odds);
    bestBook = chip?.book || null;
    bestLine = num(chip?.line);
  } else if (market === 'TOTAL') {
    const cur = game.totalCurrent || {};
    line = num(cur.line);
    const ours = side === 'over' ? num(cur.overOdds) : num(cur.underOdds);
    const opp = side === 'over' ? num(cur.underOdds) : num(cur.overOdds);
    fair = noVig([ours, opp]);
    const chip = side === 'over' ? game.bestOver : game.bestUnder;
    best = num(chip?.odds);
    bestBook = chip?.book || null;
    bestLine = num(chip?.line);
  }
  const hit = unitMarketHit(units, market, pick, best);
  const bestImplied = impliedPct(best);
  const hitEdge = hit && bestImplied != null ? Math.round((hit.wr - bestImplied) * 10) / 10 : null;
  const price = {};
  if (fair != null) price.fair = fmtOdds(fair);
  if (best != null) price.best = fmtOdds(best);
  if (bestBook) price.bestBook = bestBook;
  if (line != null) price.line = line;
  if (bestLine != null && line != null && bestLine !== line) price.bestLine = bestLine;
  if (hit) {
    price.actualWin = hit.wr;
    price.actualWinN = hit.n;
    price.actualWinLabel = hit.label;
  }
  if (bestImplied != null) price.bestImplied = bestImplied;
  if (hitEdge != null) price.hitEdge = hitEdge;
  return Object.keys(price).length ? price : null;
}

function presentPlay(play, prices) {
  const { alignment, money } = alignmentOf(play);
  const pinn = play.gameKey && prices ? prices[play.sport]?.[play.gameKey] : null;
  const price = quotePrice(pinn, play.market, play.side, play.units, play.pick);
  const { gameKey, ...rest } = play;
  return { ...rest, alignment, money, price };
}

function sortPlays(plays) {
  return [...plays].sort((a, b) => (
    (ALIGN_RANK[a.alignment] ?? 9) - (ALIGN_RANK[b.alignment] ?? 9)
    || (b.money?.dollars || 0) - (a.money?.dollars || 0)
    || String(a.kickoffEt || '').localeCompare(String(b.kickoffEt || ''))
  ));
}

function boardRows(pubs) {
  const rows = [];
  for (const pub of pubs || []) {
    let lead = null;
    for (const market of pub.markets || []) {
      const money = moneyLine(market);
      if (!money || !Number.isFinite(money.dollars)) continue;
      if (!lead || money.dollars > lead.dollars) lead = { market: market.market, ...money };
    }
    rows.push({
      sport: pub.sport,
      matchup: pub.matchup,
      away: pub.away,
      home: pub.home,
      kickoffEt: pub.kickoffEt || null,
      lead,
      markets: pub.markets,
    });
  }
  rows.sort((a, b) => (
    (b.lead?.dollars || 0) - (a.lead?.dollars || 0)
    || (b.lead?.returnPct || 0) - (a.lead?.returnPct || 0)
  ));
  return rows;
}

const BOARD_CAP = 25;

function emptyBucket() {
  return { wins: 0, losses: 0, pushes: 0, units: 0, profit: 0 };
}

function addGraded(bucket, row) {
  if (!bucket || !row) return;
  if (row.status === 'win') bucket.wins += 1;
  else if (row.status === 'loss') bucket.losses += 1;
  else if (row.status === 'push') bucket.pushes += 1;
  else return;
  bucket.units += Number(row.units) || 0;
  if (Number.isFinite(row.profit)) bucket.profit += row.profit;
}

function finishBucket(bucket) {
  const decided = bucket.wins + bucket.losses;
  return {
    record: `${bucket.wins}-${bucket.losses}`,
    pushes: bucket.pushes,
    units: Math.round(bucket.units * 100) / 100,
    profit: Math.round(bucket.profit * 100) / 100,
    winPct: decided ? Math.round((1000 * bucket.wins) / decided) / 10 : null,
  };
}

function gradedStake(pick, sideKey, market) {
  const row = publicLockedSide(pick, sideKey, market);
  if (!row || row.status === 'locked') return null;
  const sd = pick?.sides?.[sideKey];
  if (sd?.result?.tracked === true) return null;
  const profit = Number(sd?.result?.profit);
  return {
    sport: row.sport || 'NA',
    market,
    status: row.status,
    units: row.units,
    profit: Number.isFinite(profit) ? profit : null,
  };
}

function emptyRecord() {
  return { all: emptyBucket(), sports: {}, cells: {} };
}

function accumulate(record, row) {
  if (!row) return record;
  addGraded(record.all, row);
  const sport = row.sport || 'NA';
  if (!record.sports[sport]) record.sports[sport] = emptyBucket();
  addGraded(record.sports[sport], row);
  const cell = `${sport}|${row.market}`;
  if (!record.cells[cell]) record.cells[cell] = emptyBucket();
  addGraded(record.cells[cell], row);
  return record;
}

function finishRecord(record, from, through) {
  const sports = Object.entries(record.sports || {})
    .map(([sport, bucket]) => ({ sport, ...finishBucket(bucket) }))
    .sort((a, b) => b.profit - a.profit);
  const cells = Object.entries(record.cells || {})
    .map(([key, bucket]) => {
      const [sport, market] = key.split('|');
      return { sport, market, ...finishBucket(bucket) };
    })
    .sort((a, b) => b.profit - a.profit);
  return {
    from,
    through,
    note: 'Graded staked locks. A stand-down is not in this record.',
    all: finishBucket(record.all || emptyBucket()),
    bySport: sports,
    bySportMarket: cells,
  };
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

async function dayPayload(args, ctx) {
  const a = args || {};
  const date = a.date || etDate();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return toolError('date must be YYYY-MM-DD');
  const sport = a.sport ? String(a.sport).toUpperCase() : null;
  const [plays, action] = await Promise.all([
    ctx.loadLocked({ date, sport }),
    ctx.loadAction(),
  ]);
  const games = sport ? action.games.filter((g) => g.sport === sport) : action.games;
  const [record, prices] = await Promise.all([
    ctx.loadRecord ? ctx.loadRecord() : null,
    ctx.loadPrices ? ctx.loadPrices() : null,
  ]);
  const pubs = publishBoard(games, action.profiles, prices, date);
  const playsOut = sortPlays(plays.map((play) => {
    const playSport = String(play.sport || '').toUpperCase();
    const pub = pubs.find((g) => (
      String(g.sport || '').toUpperCase() === playSport
      && gameMatches(g, `${play.away || ''} ${play.home || ''}`)
    ));
    return presentPlay({
      ...play,
      gameKey: pub?.gameKey || null,
      action: pub?.markets?.length ? pub.markets : null,
    }, prices);
  }));
  const board = boardRows(pubs);
  const tape = actionRows(pubs);
  return textBlock({
    source: 'Sharp Flow day. plays are staked locks, same-side money first. That order is agreement then dollars, not an edge rank. actionTab is the Action tab: each confirmed ticket, largest dollars first, with size versus usual, last-10 form, last-30 dollars, this market\'s record, and opposed or contested. A record on the side is that sport, all markets. confirmed 1 is one wallet. sameNight letters match a wallet across tonight only. No names. End with site.',
    site: SITE,
    date,
    sport,
    scannedAt: action.scannedAt,
    record,
    plays: playsOut,
    actionTab: tape.slice(0, ACTION_CAP),
    actionTabCount: tape.length,
    actionTabShown: Math.min(tape.length, ACTION_CAP),
    board: board.slice(0, BOARD_CAP),
    boardCount: board.length,
    boardShown: Math.min(board.length, BOARD_CAP),
  });
}

async function callTool(name, args, ctx) {
  const a = args || {};
  if (name === 'today' || name === 'locked_card') return dayPayload(a, ctx);
  if (name === 'game_action') {
    const query = String(a.query || '').trim();
    if (!query) return toolError('query is required');
    const sport = a.sport ? String(a.sport).toUpperCase() : null;
    const { games, scannedAt, profiles } = await ctx.loadAction();
    const prices = ctx.loadPrices ? await ctx.loadPrices() : null;
    const hits = games.filter((g) => (!sport || g.sport === sport) && gameMatches(g, query));
    const shown = publishBoard(hits, profiles, prices, etDate()).slice(0, 5).map(({ gameKey, ...pub }) => pub);
    return textBlock({
      source: 'Confirmed tickets, $500 and up. Each ticket has sharp.size and sharp.vsUsual. No wallet names.',
      scannedAt,
      query,
      matches: shown,
      truncated: hits.length > shown.length,
    });
  }
  if (name === 'sport_action') {
    const sport = a.sport ? String(a.sport).toUpperCase() : null;
    const { games, scannedAt, profiles } = await ctx.loadAction();
    const prices = ctx.loadPrices ? await ctx.loadPrices() : null;
    const wanted = sport ? games.filter((g) => g.sport === sport) : games;
    const pubs = publishBoard(wanted, profiles, prices, etDate());
    const bySport = new Map();
    for (const pub of pubs) {
      const { gameKey, ...rest } = pub;
      if (!bySport.has(pub.sport)) bySport.set(pub.sport, []);
      bySport.get(pub.sport).push(rest);
    }
    const sports = [...bySport.entries()].map(([code, list]) => ({ sport: code, games: list }));
    return textBlock({
      source: 'Confirmed tickets, $500 and up. Each ticket has sharp.size and sharp.vsUsual. No wallet names.',
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
  SITE,
  publicGame,
  publishBoard,
  buildToday,
  presentPlay,
  sortPlays,
  boardRows,
  gradedStake,
  emptyRecord,
  accumulate,
  finishRecord,
  quotePrice,
  shortsInGames,
  handleMcpMessage,
  redirectAllowed,
  issueCode,
  verifyCode,
};

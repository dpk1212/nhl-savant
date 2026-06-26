/**
 * NHL Savant Intelligence Desk — Market Intelligence Content Generator
 * Produces non-pick intelligence posts from tracked wallet / market data.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

const PATHS = {
  WALLETS: join(ROOT, 'data/wallet-profiles.json'),
  LEADERBOARD: join(ROOT, 'public/sports_sharps.json'),
  POS: join(ROOT, 'public/sharp_positions.json'),
  FLOW: join(ROOT, 'public/polymarket_data.json'),
  KALSHI: join(ROOT, 'public/kalshi_data.json'),
  EXCLUDED: join(ROOT, 'public/sharp_intel_excluded_wallets.json'),
  MATRIX: join(ROOT, 'public/win_matrix.json'),
  OUT: join(ROOT, 'public/social_today.json'),
};

const SPORTS = ['NHL', 'CBB', 'MLB', 'NBA', 'SOC'];
const STALE_MS = 24 * 60 * 60 * 1000;

function loadJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function getETDate(iso = new Date().toISOString()) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const y = parts.find((p) => p.type === 'year').value;
  const m = parts.find((p) => p.type === 'month').value;
  const day = parts.find((p) => p.type === 'day').value;
  return `${y}-${m}-${day}`;
}

function fmtMoney(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtVol(n) {
  if (n >= 1_000_000) return '$' + Math.round(n / 1_000_000) + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K';
  return fmtMoney(n);
}

function parseTs(obj) {
  const raw = obj.updatedAt || obj.scannedAt || obj.generatedAt;
  return raw ? new Date(raw).getTime() : NaN;
}

function isStale(files) {
  const now = Date.now();
  for (const f of files) {
    if (!f.data) return true;
    const ts = parseTs(f.data);
    if (!Number.isFinite(ts) || now - ts > STALE_MS) return true;
  }
  return false;
}

function iterPosGames(pos) {
  const games = [];
  for (const sport of SPORTS) {
    const block = pos[sport];
    if (!block || typeof block !== 'object') continue;
    for (const [gameKey, game] of Object.entries(block)) {
      if (!game?.positions?.length) continue;
      games.push({ sport, gameKey, game });
    }
  }
  return games;
}

function getTeamNames(gameKey, game) {
  const away = game.away;
  const home = game.home;
  if (away && home) return { away, home };
  const pos = game.positions?.[0];
  if (pos?.side === 'home') {
    return { away: pos.outcome === game.home ? game.away : pos.outcome, home: pos.outcome };
  }
  if (pos?.side === 'away') {
    return { away: pos.outcome, home: game.home || null };
  }
  const parts = gameKey.split('_');
  return { away: parts[0], home: parts[1] };
}

function resolveTeamNames(pos, flow, gameKey, sportHint) {
  if (sportHint && flow[sportHint]?.[gameKey]) {
    const g = flow[sportHint][gameKey];
    if (g.awayTeam && g.homeTeam) return { away: g.awayTeam, home: g.homeTeam };
  }
  for (const sport of SPORTS) {
    const g = flow[sport]?.[gameKey];
    if (g?.awayTeam && g?.homeTeam) return { away: g.awayTeam, home: g.homeTeam };
  }
  for (const sport of SPORTS) {
    const g = pos[sport]?.[gameKey];
    if (g?.away && g?.home) return { away: g.away, home: g.home };
  }
  const parts = gameKey.split('_');
  return { away: parts[0], home: parts[1] };
}

function resolveWalletName(wallet, posName, leaderboard, wallets) {
  if (posName && posName !== 'null') return posName;
  const lb = leaderboard[wallet?.toLowerCase()] || leaderboard[wallet];
  if (lb?.name) return lb.name;
  for (const prof of Object.values(wallets.profiles || {})) {
    if (prof.walletAddress?.toLowerCase() === wallet?.toLowerCase()) {
      return prof.walletShort;
    }
  }
  return null;
}

function buildI1(leaderboard, pos, wallets) {
  const active = new Map();
  for (const { sport, gameKey, game } of iterPosGames(pos)) {
    for (const p of game.positions) {
      if (p.leaderboardRank == null || p.leaderboardRank > 25) continue;
      const key = p.wallet?.toLowerCase();
      if (!key) continue;
      if (!active.has(key)) {
        active.set(key, {
          wallet: p.wallet,
          name: p.name,
          games: new Set(),
          sportPnlTotal: p.sportPnlTotal,
          sportROI: p.sportROI,
          avgSportBet: p.avgSportBet,
          leaderboardRank: p.leaderboardRank,
          sportVol: p.sportVol,
          sport,
        });
      }
      const a = active.get(key);
      a.games.add(`${sport}:${gameKey}`);
      if (p.leaderboardRank < a.leaderboardRank) a.leaderboardRank = p.leaderboardRank;
      if (p.name) a.name = p.name;
    }
  }

  const candidates = [...active.values()]
    .map((a) => {
      const name = resolveWalletName(a.wallet, a.name, leaderboard, wallets);
      if (!name) return null;
      return {
        ...a,
        name,
        gameCount: a.games.size,
        score: (100 - a.leaderboardRank) * 10 + a.gameCount,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.leaderboardRank - b.leaderboardRank);

  if (!candidates.length) return null;

  const pick = candidates[0];
  let sportVol = pick.sportVol;
  for (const prof of Object.values(wallets.profiles || {})) {
    if (prof.walletAddress?.toLowerCase() === pick.wallet?.toLowerCase()) {
      sportVol = prof.positionsContext?.sportVol ?? sportVol;
      if (prof.positionsContext?.sportPnlTotal != null) pick.sportPnlTotal = prof.positionsContext.sportPnlTotal;
      if (prof.positionsContext?.sportROI != null) pick.sportROI = prof.positionsContext.sportROI;
      break;
    }
  }

  const sportLabel = pick.sport || 'sports';
  const text = `🔍 SHARP SPOTLIGHT: ${pick.name}

A wallet we've tracked all season.
• Polymarket ${sportLabel} P&L: ${fmtMoney(pick.sportPnlTotal)}
• ROI: ${pick.sportROI}% over ${fmtVol(sportVol || 0)} traded
• Leaderboard rank: #${pick.leaderboardRank} of thousands
• Avg bet: ${fmtMoney(pick.avgSportBet)}

Today they're in on ${pick.gameCount} games. This is who we watch so you don't have to.`;

  return {
    pillar: 'I1_SPOTLIGHT',
    text,
    sourceFields: {
      name: pick.name,
      sportPnlTotal: pick.sportPnlTotal,
      sportROI: pick.sportROI,
      sportVol: sportVol || 0,
      leaderboardRank: pick.leaderboardRank,
      avgSportBet: pick.avgSportBet,
      gameCount: pick.gameCount,
      sport: sportLabel,
    },
  };
}

function buildI2(pos, excluded) {
  const walletsScanned = pos.walletsScanned ?? 0;
  const mmExcluded = pos.mmExcluded ?? (Array.isArray(excluded?.mmExcluded) ? excluded.mmExcluded.length : 0);
  const tradersExcluded = pos.tradersExcluded ?? (Array.isArray(excluded?.tradersExcluded) ? excluded.tradersExcluded.length : 0);
  const totalExcluded = pos.totalExcluded ?? mmExcluded + tradersExcluded;

  if (!walletsScanned) return null;

  const text = `🤖 THE BOT REPORT

Today's "sharp money" before we cleaned it:
• ${walletsScanned} wallets scanned
• ${mmExcluded} market makers stripped
• ${tradersExcluded} arb bots removed
→ ${totalExcluded} fake "sharps" filtered out

When someone says "sharps are on X," ask: which ones? Most of it is bots.`;

  return {
    pillar: 'I2_BOT_REPORT',
    text,
    sourceFields: { walletsScanned, mmExcluded, tradersExcluded, totalExcluded },
  };
}

function buildI3(flow, kalshi, pos) {
  let best = null;

  for (const sport of SPORTS) {
    const fBlock = flow[sport];
    const kBlock = kalshi[sport];
    if (!fBlock || !kBlock) continue;

    for (const gameKey of Object.keys(fBlock)) {
      if (gameKey.startsWith('_') || !kBlock[gameKey]) continue;
      const f = fBlock[gameKey];
      const k = kBlock[gameKey];
      if (!f?.priceHistory?.current) continue;

      const polyAway = Math.round(f.priceHistory.current);
      const polyHome = Math.round(100 - polyAway);
      const teams = resolveTeamNames(pos, flow, gameKey, sport);

      const checks = [
        { team: teams.away, polyProb: polyAway, kalshiProb: Math.round(k.awayProb) },
        { team: teams.home, polyProb: polyHome, kalshiProb: Math.round(k.homeProb) },
      ];

      for (const c of checks) {
        const gap = Math.abs(c.polyProb - c.kalshiProb);
        if (gap >= 4 && (!best || gap > best.gap)) {
          best = { sport, gameKey, away: teams.away, home: teams.home, gap, ...c };
        }
      }
    }
  }

  if (!best) return null;

  const text = `📊 MARKET DISAGREEMENT — ${best.away} @ ${best.home}

Polymarket: ${best.polyProb}% ${best.team}
Kalshi: ${best.kalshiProb}% ${best.team}
Gap: ${best.gap} pts

Two markets, same game, different price. We watch which one converges.`;

  return {
    pillar: 'I3_CROSS_MARKET',
    text,
    sourceFields: {
      gameKey: best.gameKey,
      away: best.away,
      home: best.home,
      team: best.team,
      polyProb: best.polyProb,
      kalshiProb: best.kalshiProb,
      gap: best.gap,
    },
  };
}

function collectFlowMoves(flow) {
  const moves = [];
  for (const sport of SPORTS) {
    const block = flow[sport];
    if (!block) continue;
    for (const [gameKey, game] of Object.entries(block)) {
      if (gameKey.startsWith('_')) continue;
      const whales = game.whales?.topTrades || [];
      const scan = (node, marketKey, outcomes) => {
        const change = node?.priceHistory?.change;
        if (change == null) return;
        moves.push({
          sport,
          gameKey,
          game,
          marketKey,
          outcomes,
          change,
          priceHistory: node.priceHistory,
          whales,
        });
      };
      scan(game, 'ml', [game.awayTeam, game.homeTeam].filter(Boolean));
      if (game.polySpread) scan(game.polySpread, 'polySpread', game.polySpread.outcomes);
      if (game.polyTotal) scan(game.polyTotal, 'polyTotal', game.polyTotal.outcomes);
    }
  }
  return moves;
}

function movedOutcomeLabel(move, teams) {
  const { outcomes, priceHistory } = move;
  if (outcomes?.length >= 2) {
    const first = outcomes[0];
    const second = outcomes[1];
    if (priceHistory.change > 0) return priceHistory.current >= 50 ? first : second;
    return priceHistory.open >= 50 ? first : second;
  }
  if (priceHistory.change > 0) {
    return priceHistory.current >= 50 ? teams.home : teams.away;
  }
  return priceHistory.open >= 50 ? teams.home : teams.away;
}

function buildI4(flow, pos) {
  const moves = collectFlowMoves(flow)
    .filter((m) => Math.abs(m.change) >= 10 && m.whales.length >= 2)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  const best = moves[0];
  if (!best) return null;

  const teams = resolveTeamNames(pos, flow, best.gameKey, best.sport);
  const open = Math.round(best.priceHistory.open);
  const current = Math.round(best.priceHistory.current);
  const team = movedOutcomeLabel(best, teams);

  const trades = best.whales
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 2);

  const tradeLines = trades
    .map((t) => `• ${fmtMoney(t.amount)} ${t.side} from ${t.traderName}`)
    .join('\n');

  const text = `🔬 LINE MOVE AUTOPSY — ${teams.away} @ ${teams.home}

${team} moved ${open}¢ → ${current}¢ (${best.change > 0 ? '+' : ''}${Math.round(best.change)} pts) today.

Who did it:
${tradeLines}

Not a guess. The actual tape. This is what a real move looks like.`;

  return {
    pillar: 'I4_LINE_MOVE',
    text,
    sourceFields: {
      gameKey: best.gameKey,
      marketKey: best.marketKey,
      away: teams.away,
      home: teams.home,
      team,
      open,
      current,
      change: best.change,
      topTrades: trades.map((t) => ({ amount: t.amount, side: t.side, traderName: t.traderName })),
    },
  };
}

function buildI5(pos, wallets, dateStr) {
  const gameAgg = new Map();

  for (const { sport, gameKey, game } of iterPosGames(pos)) {
    const key = `${sport}:${gameKey}`;
    const teams = getTeamNames(gameKey, game);
    const matchup = `${teams.away} @ ${teams.home}`;

    if (!gameAgg.has(key)) {
      gameAgg.set(key, { matchup, away: 0, home: 0, draw: 0, wallets: new Set() });
    }
    const agg = gameAgg.get(key);

    for (const p of game.positions) {
      agg.wallets.add(p.wallet || p.name);
      const inv = p.invested || 0;
      if (p.side === 'away') agg.away += inv;
      else if (p.side === 'home') agg.home += inv;
      else agg.draw += inv;
    }
  }

  const ranked = [...gameAgg.values()]
    .map((g) => {
      const total = g.away + g.home + g.draw;
      const sides = [
        { side: 'away', val: g.away },
        { side: 'home', val: g.home },
        { side: 'draw', val: g.draw },
      ].sort((a, b) => b.val - a.val);
      const leanSide = sides[0].side;
      const matchupParts = g.matchup.split(' @ ');
      const leaning =
        leanSide === 'away' ? matchupParts[0] : leanSide === 'home' ? matchupParts[1] : 'draw';
      return { ...g, total, walletCount: g.wallets.size, leaning };
    })
    .filter((g) => g.total > 0)
    .sort((a, b) => b.total - a.total);

  if (!ranked.length) return null;

  const walletTotal = wallets.totals?.wallets ?? 0;
  let count = Math.min(3, ranked.length);
  let text = '';

  while (count >= 1) {
    const top = ranked.slice(0, count);
    const lines = top
      .map(
        (g, i) =>
          `${i + 1}. ${g.matchup}: ${fmtMoney(g.total)} (${g.walletCount} wallets, ${g.leaning})`
      )
      .join('\n');
    text = `🗺️ SMART MONEY MAP — ${dateStr}

${walletTotal} tracked wallets today:

${lines}

Concentration = conviction.`;
    if (text.length <= 280) break;
    count -= 1;
  }

  if (text.length > 280) return null;

  return {
    pillar: 'I5_SMART_MONEY_MAP',
    text,
    sourceFields: {
      date: dateStr,
      walletTotal,
      topGames: ranked.slice(0, count).map((g) => ({
        matchup: g.matchup,
        total: g.total,
        walletCount: g.walletCount,
        leaning: g.leaning,
      })),
    },
  };
}

function buildI6(matrix, wallets, flow) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const variant = dayOfYear % 3;

  if (variant === 0 && matrix?.cells?.all) {
    let n = 0;
    let w = 0;
    for (const [key, cell] of Object.entries(matrix.cells.all)) {
      const dw = parseInt(key.split(',')[0], 10);
      if (dw >= 2) {
        n += cell.n;
        w += cell.w;
      }
    }
    if (n >= 10) {
      const wr = Math.round((w / n) * 100);
      const text = `🧠 DATA STUDY

Across ${n} graded sides, when proven-wallet margin is +2+, the side hit ${wr}%.

Sample: ${matrix.sample?.gradedWithWalletDetails ?? n} graded sides, ${matrix.sample?.dateRange?.join(' to ') ?? 'season'}.

We don't guess. We've tracked this all season. Thread on what it means 👇`;

      return {
        pillar: 'I6_DATA_STUDY',
        text,
        sourceFields: { variant: 'matrix_margin_2plus', n, w, wr, sample: matrix.sample },
      };
    }
  }

  if (variant === 1 && wallets?.totals) {
    const { wallets: wCount, walletBets, positions } = wallets.totals;
    const text = `🧠 DATA STUDY

We've graded ${walletBets} featured bets + ${positions} on-chain positions across ${wCount} wallets this season.

Sample: dual-ROI dossiers since ${wallets.v8Cutover ?? 'V8 cutover'}.

We don't guess. We've tracked this all season. Thread on what it means 👇`;

    return {
      pillar: 'I6_DATA_STUDY',
      text,
      sourceFields: { variant: 'wallet_totals', walletBets, positions, wallets: wCount },
    };
  }

  let agree = 0;
  let total = 0;
  for (const sport of SPORTS) {
    const block = flow[sport];
    if (!block) continue;
    for (const [, game] of Object.entries(block)) {
      if (!game?.awayMoneyPct) continue;
      total++;
      const moneySide = game.awayMoneyPct >= game.homeMoneyPct ? 'away' : 'home';
      const ticketSide = game.awayTicketPct >= game.homeTicketPct ? 'away' : 'home';
      if (moneySide === ticketSide) agree++;
    }
  }

  if (total >= 5) {
    const pct = Math.round((agree / total) * 100);
    const text = `🧠 DATA STUDY

The public and the money agree only ${pct}% of the time on Polymarket.

Sample: ${total} games on today's slate.

We don't guess. We've tracked this all season. Thread on what it means 👇`;

    return {
      pillar: 'I6_DATA_STUDY',
      text,
      sourceFields: { variant: 'public_money_agree', agree, total, pct },
    };
  }

  return null;
}

function selectPosts(candidates, prevPillars) {
  const order = [
    'I2_BOT_REPORT',
    'I5_SMART_MONEY_MAP',
    'I1_SPOTLIGHT',
    'I4_LINE_MOVE',
    'I3_CROSS_MARKET',
    'I6_DATA_STUDY',
  ];
  const byPillar = Object.fromEntries(candidates.map((p) => [p.pillar, p]));
  const floor = ['I2_BOT_REPORT', 'I5_SMART_MONEY_MAP'];
  const selected = [];
  const used = new Set();

  for (const pillar of floor) {
    if (byPillar[pillar]) {
      selected.push(byPillar[pillar]);
      used.add(pillar);
    }
  }

  const extras = order.filter((p) => !floor.includes(p));
  const rotated = extras.filter((p) => !prevPillars.includes(p));
  const pool = rotated.length >= 1 ? rotated : extras;

  for (const pillar of pool) {
    if (selected.length >= 4) break;
    if (!byPillar[pillar] || used.has(pillar)) continue;
    selected.push(byPillar[pillar]);
    used.add(pillar);
  }

  if (selected.length < 1) {
    for (const pillar of order) {
      if (byPillar[pillar] && !used.has(pillar)) {
        selected.push(byPillar[pillar]);
        used.add(pillar);
      }
      if (selected.length >= 2) break;
    }
  }

  return selected.slice(0, 4);
}

function main() {
  const wallets = loadJson(PATHS.WALLETS);
  const leaderboard = loadJson(PATHS.LEADERBOARD);
  const pos = loadJson(PATHS.POS);
  const flow = loadJson(PATHS.FLOW);
  const kalshi = loadJson(PATHS.KALSHI);
  const excluded = loadJson(PATHS.EXCLUDED);
  const matrix = loadJson(PATHS.MATRIX);

  const generatedAt = new Date().toISOString();
  const date = getETDate(generatedAt);

  const stale = isStale([
    { data: wallets },
    { data: pos },
    { data: flow },
    { data: kalshi },
    { data: excluded },
  ]);

  if (stale) {
    const out = {
      generatedAt,
      date,
      posts: [{ pillar: 'NONE', text: 'DATA_STALE — skipped run' }],
    };
    writeFileSync(PATHS.OUT, JSON.stringify(out, null, 2) + '\n');
    console.log(out.posts[0].text);
    process.exit(0);
  }

  let prevPillars = [];
  const prev = loadJson(PATHS.OUT);
  if (prev?.posts) {
    prevPillars = prev.posts.map((p) => p.pillar).filter(Boolean);
  }

  const candidates = [
    buildI2(pos, excluded),
    buildI5(pos, wallets, date),
    buildI1(leaderboard, pos, wallets),
    buildI4(flow, pos),
    buildI3(flow, kalshi, pos),
    buildI6(matrix, wallets, flow),
  ].filter(Boolean);

  const posts = selectPosts(candidates, prevPillars);

  if (!posts.length) {
    posts.push({ pillar: 'NONE', text: 'DATA_STALE — skipped run' });
  }

  const out = { generatedAt, date, posts };
  writeFileSync(PATHS.OUT, JSON.stringify(out, null, 2) + '\n');

  for (const p of posts) {
    console.log('---');
    console.log(p.text);
    console.log('');
  }
}

main();

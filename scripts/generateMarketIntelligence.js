#!/usr/bin/env node
/**
 * NHL Savant Intelligence Desk — deterministic market-intelligence social posts.
 * Reads public/ + data/ artifacts and writes public/social_today.json.
 */
import { readFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SPORTS = ['NHL', 'CBB', 'MLB', 'NBA', 'SOC'];
const POS_META_KEYS = new Set([
  'scannedAt', 'walletsScanned', 'mmExcluded', 'sportLosersExcluded',
  'noSportExcluded', 'tradersExcluded', 'totalExcluded',
]);

function loadJson(relPath) {
  const full = join(ROOT, relPath);
  return JSON.parse(readFileSync(full, 'utf8'));
}

function fmtMoney(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtVol(n) {
  if (n >= 1_000_000) {
    const m = Math.round(n / 100_000) / 10;
    return `$${m}M`;
  }
  if (n >= 1_000) {
    return `$${Math.round(n / 1_000)}K`;
  }
  return fmtMoney(n);
}

function etDateString(iso = new Date().toISOString()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}

function isFreshTimestamp(ts, nowMs) {
  if (!ts) return false;
  const ms = new Date(ts).getTime();
  if (Number.isNaN(ms)) return false;
  return nowMs - ms <= 24 * 60 * 60 * 1000;
}

function collectStaleness(files, nowMs) {
  const issues = [];
  for (const { path, fields } of files) {
    let found = false;
    try {
      const data = loadJson(path);
      const stat = statSync(join(ROOT, path));
      for (const field of fields) {
        const parts = field.split('.');
        let val = data;
        for (const p of parts) {
          val = val?.[p];
        }
        if (val && isFreshTimestamp(val, nowMs)) {
          found = true;
          break;
        }
      }
      if (!found && isFreshTimestamp(stat.mtime.toISOString(), nowMs)) {
        found = true;
      }
    } catch {
      issues.push(path);
      continue;
    }
    if (!found) issues.push(path);
  }
  return issues;
}

function iterPosGames(pos) {
  const games = [];
  for (const sport of SPORTS) {
    const sportGames = pos[sport];
    if (!sportGames || typeof sportGames !== 'object') continue;
    for (const [gameKey, game] of Object.entries(sportGames)) {
      games.push({ sport, gameKey, game });
    }
  }
  return games;
}

function isMemorableName(name) {
  if (!name || typeof name !== 'string') return false;
  if (name.startsWith('0x')) return false;
  return name.length <= 32;
}

function buildI1(WALLETS, LEADERBOARD, POS) {
  const top25 = Object.entries(LEADERBOARD)
    .filter(([k]) => !k.startsWith('_'))
    .map(([addr, w]) => ({ addr, ...w }))
    .sort((a, b) => b.sportPnlTotal - a.sportPnlTotal)
    .slice(0, 25);

  const posByWallet = new Map();
  for (const { gameKey, game } of iterPosGames(POS)) {
    for (const p of game.positions || []) {
      const key = (p.wallet || '').toLowerCase();
      if (!key) continue;
      if (!posByWallet.has(key)) {
        posByWallet.set(key, {
          name: p.name,
          games: new Set(),
          sportPnlTotal: p.sportPnlTotal,
          sportROI: p.sportROI,
          avgSportBet: p.avgSportBet,
          leaderboardRank: p.leaderboardRank,
          sportVol: p.sportVol,
        });
      }
      const entry = posByWallet.get(key);
      entry.games.add(gameKey);
      if (p.name && isMemorableName(p.name)) entry.name = p.name;
    }
  }

  let pick = null;
  const top25Active = top25
    .filter((w) => posByWallet.has(w.addr.toLowerCase()))
    .map((w) => {
      const pos = posByWallet.get(w.addr.toLowerCase());
      return {
        ...w,
        gameCount: pos.games.size,
        displayName: pos.name || w.name,
        sportVol: pos.sportVol,
      };
    })
    .sort((a, b) => {
      const aMem = isMemorableName(a.displayName) ? 0 : 1;
      const bMem = isMemorableName(b.displayName) ? 0 : 1;
      if (aMem !== bMem) return aMem - bMem;
      if (b.gameCount !== a.gameCount) return b.gameCount - a.gameCount;
      return (a.displayName || '').localeCompare(b.displayName || '');
    });

  if (top25Active.length > 0 && isMemorableName(top25Active[0].displayName)) {
    pick = top25Active[0];
  } else {
    const rankFallback = [...posByWallet.values()]
      .filter((p) => p.leaderboardRank != null && p.leaderboardRank <= 25 && isMemorableName(p.name))
      .sort((a, b) => {
        if (a.leaderboardRank !== b.leaderboardRank) return a.leaderboardRank - b.leaderboardRank;
        if (b.games.size !== a.games.size) return b.games.size - a.games.size;
        return (a.name || '').localeCompare(b.name || '');
      });
    if (rankFallback.length === 0) return null;
    const f = rankFallback[0];
    pick = {
      name: f.name,
      displayName: f.name,
      sportPnlTotal: f.sportPnlTotal,
      sportROI: f.sportROI,
      avgSportBet: f.avgSportBet,
      leaderboardRank: f.leaderboardRank,
      sportVol: f.sportVol,
      gameCount: f.games.size,
      seasonProfile: false,
    };
  }

  if (!pick) return null;

  const name = pick.displayName || pick.name;
  const gameCount = pick.gameCount ?? posByWallet.get(pick.addr?.toLowerCase())?.games.size ?? 0;

  let sportVol = pick.sportVol;
  if (sportVol == null && pick.addr) {
    const prof = Object.values(WALLETS.profiles).find(
      (p) => p.walletAddress?.toLowerCase() === pick.addr.toLowerCase(),
    );
    sportVol = prof?.positionsContext?.sportVol;
  }
  if (sportVol == null) return null;

  const volLine = fmtVol(sportVol);
  const text = `🔍 SHARP SPOTLIGHT: ${name}

A wallet we've tracked all season.
• Polymarket P&L: ${fmtMoney(pick.sportPnlTotal)}
• ROI: ${pick.sportROI}% over ${volLine} traded
• Leaderboard rank: #${pick.leaderboardRank} of thousands
• Avg bet: ${fmtMoney(pick.avgSportBet)}

Today they're in on ${gameCount} games. This is who we watch so you don't have to.`;

  return {
    pillar: 'I1_SPOTLIGHT',
    text,
    sourceFields: {
      name,
      sportPnlTotal: pick.sportPnlTotal,
      sportROI: pick.sportROI,
      sportVol,
      leaderboardRank: pick.leaderboardRank,
      avgSportBet: pick.avgSportBet,
      gameCount,
    },
  };
}

function buildI2(POS) {
  const walletsScanned = POS.walletsScanned;
  const mmExcluded = POS.mmExcluded;
  const tradersExcluded = POS.tradersExcluded;
  const totalExcluded = POS.totalExcluded;

  if (walletsScanned == null || mmExcluded == null || tradersExcluded == null || totalExcluded == null) {
    return null;
  }

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

function buildI3(FLOW, KALSHI) {
  const gaps = [];
  for (const sport of SPORTS) {
    const flowSport = FLOW[sport];
    const kalshiSport = KALSHI[sport];
    if (!flowSport || !kalshiSport) continue;

    for (const [gameKey, flow] of Object.entries(flowSport)) {
      const kal = kalshiSport[gameKey];
      if (!kal || !flow.priceHistory) continue;

      const away = flow.awayTeam || flow.away;
      const home = flow.homeTeam || flow.home;
      const polyHome = flow.homeProb ?? flow.priceHistory.current;
      const polyAway = flow.awayProb ?? (polyHome != null ? 100 - polyHome : null);
      if (polyHome == null || polyAway == null) continue;

      for (const [team, polyP, kalP] of [
        [home, polyHome, kal.homeProb],
        [away, polyAway, kal.awayProb],
      ]) {
        if (team == null || kalP == null) continue;
        const polyProb = Math.round(polyP);
        const kalshiProb = Math.round(kalP);
        const gap = Math.abs(polyProb - kalshiProb);
        if (gap >= 4) {
          gaps.push({ away, home, team, polyProb, kalshiProb, gap, sport, gameKey });
        }
      }
    }
  }

  if (gaps.length === 0) return null;

  gaps.sort((a, b) => {
    if (b.gap !== a.gap) return b.gap - a.gap;
    if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
    if (a.gameKey !== b.gameKey) return a.gameKey.localeCompare(b.gameKey);
    return (a.team || '').localeCompare(b.team || '');
  });

  const g = gaps[0];
  const text = `📊 MARKET DISAGREEMENT — ${g.away} @ ${g.home}

Two markets, different prices:
• Polymarket: ${g.polyProb}% ${g.team}
• Kalshi: ${g.kalshiProb}% ${g.team}
• Gap: ${g.gap} pts

One of them is wrong. We watch which way it converges.`;

  return {
    pillar: 'I3_CROSS_MARKET',
    text,
    sourceFields: {
      away: g.away,
      home: g.home,
      team: g.team,
      polyProb: g.polyProb,
      kalshiProb: g.kalshiProb,
      gap: g.gap,
      sport: g.sport,
      gameKey: g.gameKey,
    },
  };
}

function buildI4(FLOW) {
  const moves = [];
  for (const sport of SPORTS) {
    const flowSport = FLOW[sport];
    if (!flowSport) continue;
    for (const [gameKey, flow] of Object.entries(flowSport)) {
      const change = flow.priceHistory?.change;
      if (change == null || Math.abs(change) < 10) continue;
      const away = flow.awayTeam || flow.away;
      const home = flow.homeTeam || flow.home;
      const open = Math.round(flow.priceHistory.open);
      const current = Math.round(flow.priceHistory.current);
      const trades = [...(flow.whales?.topTrades || [])].sort((a, b) => b.amount - a.amount);
      if (trades.length < 2) continue;
      const team = flow.homeProb != null && flow.priceHistory.current === flow.homeProb
        ? home
        : away;
      moves.push({ sport, gameKey, away, home, team, open, current, change, trades });
    }
  }

  if (moves.length === 0) return null;

  moves.sort((a, b) => {
    const diff = Math.abs(b.change) - Math.abs(a.change);
    if (diff !== 0) return diff;
    if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
    return a.gameKey.localeCompare(b.gameKey);
  });

  const m = moves[0];
  const t1 = m.trades[0];
  const t2 = m.trades[1];
  const changeRounded = Math.round(m.change);
  const text = `🔬 LINE MOVE AUTOPSY — ${m.away} @ ${m.home}

${m.team} moved ${m.open}¢ → ${m.current}¢ (${changeRounded} pts) today.

Who did it:
• ${fmtMoney(t1.amount)} ${t1.side} from ${t1.traderName}
• ${fmtMoney(t2.amount)} ${t2.side} from ${t2.traderName}

Not a guess. The actual tape. This is what a real move looks like.`;

  return {
    pillar: 'I4_LINE_MOVE',
    text,
    sourceFields: {
      away: m.away,
      home: m.home,
      team: m.team,
      open: m.open,
      current: m.current,
      change: m.change,
      trade1: t1,
      trade2: t2,
    },
  };
}

function buildI5(WALLETS, POS, dateEt) {
  const gameAgg = new Map();

  for (const { gameKey, game } of iterPosGames(POS)) {
    const away = game.away;
    const home = game.home;
    if (!away || !home) continue;
    const matchup = `${away} @ ${home}`;
    if (!gameAgg.has(gameKey)) {
      gameAgg.set(gameKey, {
        matchup,
        wallets: new Set(),
        away$: 0,
        home$: 0,
        draw$: 0,
        away,
        home,
      });
    }
    const agg = gameAgg.get(gameKey);
    for (const p of game.positions || []) {
      agg.wallets.add(p.name || p.wallet);
      const inv = p.invested || 0;
      if (p.side === 'away') agg.away$ += inv;
      else if (p.side === 'home') agg.home$ += inv;
      else if (p.side === 'draw') agg.draw$ += inv;
    }
  }

  const ranked = [...gameAgg.values()]
    .map((g) => {
      const total = g.away$ + g.home$ + g.draw$;
      const sides = [
        { side: g.away, amount: g.away$ },
        { side: g.home, amount: g.home$ },
        { side: 'Draw', amount: g.draw$ },
      ].sort((a, b) => b.amount - a.amount);
      return {
        matchup: g.matchup,
        total,
        walletCount: g.wallets.size,
        leanSide: sides[0].side,
        gameKey: g.matchup,
      };
    })
    .filter((g) => g.total > 0)
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.matchup.localeCompare(b.matchup);
    });

  if (ranked.length < 3) return null;

  const top3 = ranked.slice(0, 3);
  const walletTotal = WALLETS.totals?.wallets;
  if (walletTotal == null) return null;

  const lines = top3.map(
    (g, i) => `${i + 1}. ${g.matchup}: ${fmtMoney(g.total)} (${g.walletCount} → ${g.leanSide})`,
  );

  const text = `🗺️ SMART MONEY MAP — ${dateEt}

${walletTotal} wallets today:
${lines.join('\n')}

Concentration = conviction.`;

  return {
    pillar: 'I5_SMART_MONEY_MAP',
    text,
    sourceFields: {
      date: dateEt,
      wallets: walletTotal,
      games: top3.map((g) => ({
        matchup: g.matchup,
        total: Math.round(g.total),
        walletCount: g.walletCount,
        leanSide: g.leanSide,
      })),
    },
  };
}

function buildI6(WALLETS, MATRIX, FLOW, dayOfYear) {
  const studyType = dayOfYear % 3;

  if (studyType === 0) {
    const cells = MATRIX.cells?.all || {};
    let n = 0;
    let w = 0;
    for (const [key, cell] of Object.entries(cells)) {
      const dw = parseInt(key.split(',')[0].replace('+', ''), 10);
      if (dw >= 2) {
        n += cell.n;
        w += cell.w;
      }
    }
    if (n === 0) return null;
    const wr = Math.round((w / n) * 1000) / 10;
    const text = `🧠 DATA STUDY

Across ${n} graded sides, when proven-wallet margin is +2+, the side hit ${wr}%.

Sample: ${n} graded sides since ${MATRIX.sample?.dateRange?.[0] || 'season start'}.

We don't guess. We've tracked this all season. Thread on what it means 👇`;

    return {
      pillar: 'I6_DATA_STUDY',
      text,
      sourceFields: { n, w, wr, study: 'matrix_dw_plus2' },
    };
  }

  if (studyType === 1) {
    const { wallets, walletBets, positions } = WALLETS.totals || {};
    if (wallets == null || walletBets == null || positions == null) return null;
    const text = `🧠 DATA STUDY

We've graded ${walletBets} featured bets + ${positions} on-chain positions across ${wallets} wallets this season.

Sample: full tracked corpus through ${WALLETS.generatedAt?.slice(0, 10) || 'today'}.

We don't guess. We've tracked this all season. Thread on what it means 👇`;

    return {
      pillar: 'I6_DATA_STUDY',
      text,
      sourceFields: { wallets, walletBets, positions, study: 'wallet_totals' },
    };
  }

  let agree = 0;
  let total = 0;
  for (const sport of SPORTS) {
    const flowSport = FLOW[sport];
    if (!flowSport) continue;
    for (const flow of Object.values(flowSport)) {
      if (flow.awayMoneyPct == null || flow.homeMoneyPct == null) continue;
      const moneyFav = flow.awayMoneyPct > flow.homeMoneyPct ? 'away' : 'home';
      const ticketFav = flow.awayTicketPct > flow.homeTicketPct ? 'away' : 'home';
      total += 1;
      if (moneyFav === ticketFav) agree += 1;
    }
  }
  if (total === 0) return null;
  const pct = Math.round((agree / total) * 100);
  const text = `🧠 DATA STUDY

The public and the money agree only ${pct}% of the time on Polymarket.

Sample: ${total} games on today's slate.

We don't guess. We've tracked this all season. Thread on what it means 👇`;

  return {
    pillar: 'I6_DATA_STUDY',
    text,
    sourceFields: { agree, total, pct, study: 'flow_ticket_money' },
  };
}

function selectPosts(candidates, dayOfYear) {
  const order = ['I2_BOT_REPORT', 'I5_SMART_MONEY_MAP', 'I1_SPOTLIGHT', 'I3_CROSS_MARKET', 'I4_LINE_MOVE', 'I6_DATA_STUDY'];
  const byPillar = new Map(candidates.map((p) => [p.pillar, p]));

  const posts = [];
  const floor = ['I2_BOT_REPORT', 'I5_SMART_MONEY_MAP'];
  for (const pillar of floor) {
    if (byPillar.has(pillar)) posts.push(byPillar.get(pillar));
  }

  const rotateStart = dayOfYear % 4;
  const optionalOrder = ['I1_SPOTLIGHT', 'I3_CROSS_MARKET', 'I4_LINE_MOVE', 'I6_DATA_STUDY'];
  const rotated = [...optionalOrder.slice(rotateStart), ...optionalOrder.slice(0, rotateStart)];

  for (const pillar of rotated) {
    if (posts.length >= 4) break;
    if (byPillar.has(pillar) && !posts.some((p) => p.pillar === pillar)) {
      posts.push(byPillar.get(pillar));
    }
  }

  while (posts.length < 2) {
    for (const pillar of order) {
      if (posts.length >= 2) break;
      if (byPillar.has(pillar) && !posts.some((p) => p.pillar === pillar)) {
        posts.push(byPillar.get(pillar));
      }
    }
    break;
  }

  return posts.slice(0, 4);
}

function main() {
  const now = new Date();
  const nowMs = now.getTime();
  const generatedAt = now.toISOString();
  const dateEt = etDateString(generatedAt);

  const stale = collectStaleness(
    [
      { path: 'data/wallet-profiles.json', fields: ['generatedAt'] },
      { path: 'public/sports_sharps.json', fields: ['_meta.lastGapEnrichment'] },
      { path: 'public/sharp_positions.json', fields: ['scannedAt'] },
      { path: 'public/polymarket_data.json', fields: ['_meta.updatedAt', 'updatedAt'] },
      { path: 'public/kalshi_data.json', fields: ['_meta.updatedAt', 'updatedAt'] },
      { path: 'public/sharp_intel_excluded_wallets.json', fields: ['updatedAt'] },
      { path: 'public/win_matrix.json', fields: ['generatedAt'] },
    ],
    nowMs,
  );

  if (stale.length > 0) {
    const output = {
      generatedAt,
      date: dateEt,
      posts: [{ pillar: 'NONE', text: 'DATA_STALE — skipped run', sourceFields: { stale } }],
    };
    writeFileSync(join(ROOT, 'public/social_today.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
    console.log(output.posts[0].text);
    return;
  }

  const WALLETS = loadJson('data/wallet-profiles.json');
  const LEADERBOARD = loadJson('public/sports_sharps.json');
  const POS = loadJson('public/sharp_positions.json');
  const FLOW = loadJson('public/polymarket_data.json');
  const KALSHI = loadJson('public/kalshi_data.json');
  const EXCLUDED = loadJson('public/sharp_intel_excluded_wallets.json');
  const MATRIX = loadJson('public/win_matrix.json');

  const dayOfYear = Math.floor(
    (nowMs - new Date(now.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000),
  );

  const candidates = [
    buildI1(WALLETS, LEADERBOARD, POS),
    buildI2(POS),
    buildI3(FLOW, KALSHI),
    buildI4(FLOW),
    buildI5(WALLETS, POS, dateEt),
    dayOfYear % 7 < 2 ? buildI6(WALLETS, MATRIX, FLOW, dayOfYear) : null,
  ].filter(Boolean);

  const posts = selectPosts(candidates, dayOfYear);

  const output = { generatedAt, date: dateEt, posts };
  writeFileSync(join(ROOT, 'public/social_today.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');

  for (const post of posts) {
    console.log('---');
    console.log(post.text);
    console.log(`[${post.pillar}] ${post.text.length} chars`);
  }
}

main();

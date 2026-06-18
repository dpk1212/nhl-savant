/**
 * NHL Savant Intelligence Desk — autonomous market-intelligence content.
 * Reads public data artifacts and writes public/social_today.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const FILES = {
  WALLETS: path.join(ROOT, 'data/wallet-profiles.json'),
  LEADERBOARD: path.join(ROOT, 'public/sports_sharps.json'),
  POS: path.join(ROOT, 'public/sharp_positions.json'),
  FLOW: path.join(ROOT, 'public/polymarket_data.json'),
  KALSHI: path.join(ROOT, 'public/kalshi_data.json'),
  EXCLUDED: path.join(ROOT, 'public/sharp_intel_excluded_wallets.json'),
  MATRIX: path.join(ROOT, 'public/win_matrix.json'),
};

const OUT = path.join(ROOT, 'public/social_today.json');
const MAX_TWEET = 280;
const STALE_MS = 24 * 60 * 60 * 1000;

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getETDate(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function fmtMoney(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtVol(n) {
  const v = Math.abs(n);
  if (v >= 1_000_000) return '$' + (Math.round(v / 100_000) / 10).toFixed(1).replace(/\.0$/, '') + 'M';
  if (v >= 1_000) return '$' + Math.round(v / 1000) + 'K';
  return fmtMoney(n);
}

function sportGames(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => !k.startsWith('_') && typeof v === 'object' && v !== null && !Array.isArray(v))
  );
}

function freshestTimestamp(...values) {
  const dates = values.filter(Boolean).map((v) => new Date(v).getTime()).filter((t) => !Number.isNaN(t));
  return dates.length ? new Date(Math.max(...dates)) : null;
}

function isStale(now, ...timestamps) {
  const fresh = freshestTimestamp(...timestamps);
  if (!fresh) return true;
  return now - fresh > STALE_MS;
}

function assertTweetLen(text, pillar) {
  if (text.length > MAX_TWEET && pillar !== 'I6_DATA_STUDY') {
    throw new Error(`${pillar} exceeds ${MAX_TWEET} chars (${text.length})`);
  }
}

function getTop25Addresses(leaderboard) {
  const entries = Object.entries(leaderboard)
    .filter(([k]) => !k.startsWith('_'))
    .filter(([, e]) => e.leaderboardRank != null && e.leaderboardRank <= 25)
    .sort((a, b) => a[1].leaderboardRank - b[1].leaderboardRank);
  return entries;
}

function buildI2(excluded, posMeta) {
  const mmExcluded = Array.isArray(excluded.mmExcluded) ? excluded.mmExcluded.length : excluded.mmExcluded;
  const tradersExcluded = Array.isArray(excluded.tradersExcluded)
    ? excluded.tradersExcluded.length
    : excluded.tradersExcluded;
  const walletsScanned = posMeta.walletsScanned;
  const totalExcluded = posMeta.totalExcluded;

  const text = `🤖 THE BOT REPORT

Today's "sharp money" before we cleaned it:
• ${walletsScanned} wallets scanned
• ${mmExcluded} market makers stripped
• ${tradersExcluded} arb bots removed
→ ${totalExcluded} fake "sharps" filtered out

When someone says "sharps are on X," ask: which ones? Most of it is bots.`;

  assertTweetLen(text, 'I2_BOT_REPORT');
  return {
    pillar: 'I2_BOT_REPORT',
    text,
    sourceFields: { walletsScanned, mmExcluded, tradersExcluded, totalExcluded },
  };
}

function buildI5(pos, wallets, date) {
  const gameAgg = [];
  for (const [sport, games] of Object.entries(sportGames(pos))) {
    for (const [gk, g] of Object.entries(games)) {
      let awayInv = 0;
      let homeInv = 0;
      const walletSet = new Set();
      for (const p of g.positions || []) {
        walletSet.add(p.wallet || p.name);
        if (p.side === 'away') awayInv += p.invested;
        else homeInv += p.invested;
      }
      const total = awayInv + homeInv;
      if (total <= 0) continue;
      const lean = awayInv >= homeInv ? g.away || 'away' : g.home || 'home';
      gameAgg.push({
        matchup: `${g.away || gk} @ ${g.home || gk}`,
        total,
        n: walletSet.size,
        lean,
      });
    }
  }
  gameAgg.sort((a, b) => b.total - a.total);
  const top3 = gameAgg.slice(0, 3);
  if (top3.length < 3) return null;

  const walletCount = wallets.totals.wallets;
  const lines = top3.map(
    (g, i) => `${i + 1}. ${g.matchup}: ${fmtMoney(g.total)} (${g.n}, ${g.lean})`
  );

  const text = `🗺️ SMART MONEY MAP — ${date}

${walletCount} wallets tracked:
${lines.join('\n')}

Concentration = conviction.`;

  assertTweetLen(text, 'I5_SMART_MONEY_MAP');
  return {
    pillar: 'I5_SMART_MONEY_MAP',
    text,
    sourceFields: {
      date,
      walletCount,
      games: top3.map((g) => ({ matchup: g.matchup, total: g.total, wallets: g.n, lean: g.lean })),
    },
  };
}

function findWalletProfile(wallets, address) {
  for (const profile of Object.values(wallets.profiles || {})) {
    if (profile.walletAddress?.toLowerCase() === address.toLowerCase()) return profile;
  }
  return null;
}

function buildI1(leaderboard, pos, wallets) {
  const top25 = getTop25Addresses(leaderboard);
  const top25Set = new Set(top25.map(([addr]) => addr.toLowerCase()));

  const active = new Map();
  for (const [, games] of Object.entries(sportGames(pos))) {
    for (const [, g] of Object.entries(games)) {
      for (const p of g.positions || []) {
        const addr = (p.wallet || '').toLowerCase();
        if (!top25Set.has(addr)) continue;
        if (!active.has(addr)) {
          active.set(addr, {
            name: p.name,
            wallet: p.wallet,
            games: new Set(),
            sport: null,
          });
        }
        const entry = active.get(addr);
        entry.games.add(`${g.away} @ ${g.home}`);
        if (!entry.sport) {
          for (const [sport, sg] of Object.entries(sportGames(pos))) {
            if (sg && Object.values(sg).includes(g)) entry.sport = sport;
          }
        }
      }
    }
  }

  // Re-scan for sport keys
  for (const [sport, games] of Object.entries(sportGames(pos))) {
    for (const [, g] of Object.entries(games)) {
      for (const p of g.positions || []) {
        const addr = (p.wallet || '').toLowerCase();
        if (active.has(addr)) active.get(addr).sport = sport;
      }
    }
  }

  if (active.size === 0) return null;

  let pick = null;
  for (const [addr, info] of active) {
    const lb = leaderboard[Object.keys(leaderboard).find((k) => k.toLowerCase() === addr)];
    if (!lb) continue;
    const candidate = { addr, info, lb };
    if (!pick || lb.leaderboardRank < pick.lb.leaderboardRank) pick = candidate;
  }
  if (!pick) return null;

  const { info, lb, addr } = pick;
  const profile = findWalletProfile(wallets, addr);
  const sportVol = profile?.positionsContext?.sportVol ?? lb.overallVol ?? 0;
  const sportROI = lb.sportROI ?? profile?.positionsContext?.sportROI;
  const nGames = info.games.size;
  const sportLabel = info.sport || 'sports';

  const text = `🔍 SHARP SPOTLIGHT: ${info.name}

A wallet we've tracked all season.
• Polymarket ${sportLabel} P&L: ${fmtMoney(lb.sportPnlTotal)}
• ROI: ${sportROI}% over ${fmtVol(sportVol)} traded
• Leaderboard rank: #${lb.leaderboardRank} of thousands
• Avg bet: ${fmtMoney(lb.avgSportBet)}

Today they're in on ${nGames} game${nGames === 1 ? '' : 's'}. This is who we watch so you don't have to.`;

  assertTweetLen(text, 'I1_SPOTLIGHT');
  return {
    pillar: 'I1_SPOTLIGHT',
    text,
    sourceFields: {
      name: info.name,
      sport: sportLabel,
      sportPnlTotal: lb.sportPnlTotal,
      sportROI,
      sportVol,
      leaderboardRank: lb.leaderboardRank,
      avgSportBet: lb.avgSportBet,
      gamesToday: nGames,
    },
  };
}

function buildI3(flow, kalshi) {
  let best = null;
  for (const sport of Object.keys({ ...sportGames(flow), ...sportGames(kalshi) })) {
    const fg = sportGames(flow)[sport] || {};
    const kg = sportGames(kalshi)[sport] || {};
    for (const gk of new Set([...Object.keys(fg), ...Object.keys(kg)])) {
      const f = fg[gk];
      const k = kg[gk];
      if (!f || !k) continue;
      const pa = Math.round(f.awayProb ?? f.priceHistory?.current ?? 0);
      const ph = Math.round(f.homeProb ?? 100 - pa);
      const ka = Math.round(k.awayProb);
      const kh = Math.round(k.homeProb);
      const away = f.away || gk;
      const home = f.home || gk;
      const candidates = [
        { team: f.away || away, polyProb: pa, kalshiProb: ka },
        { team: f.home || home, polyProb: ph, kalshiProb: kh },
      ];
      for (const c of candidates) {
        const gap = Math.abs(c.polyProb - c.kalshiProb);
        if (gap >= 4 && (!best || gap > best.gap)) {
          best = { away, home, ...c, gap, sport, gk };
        }
      }
    }
  }
  if (!best) return null;

  const text = `📊 MARKET DISAGREEMENT — ${best.away} @ ${best.home}

Same game, two prediction markets, different prices:
• Polymarket: ${best.polyProb}% ${best.team}
• Kalshi: ${best.kalshiProb}% ${best.team}
• Gap: ${best.gap} pts

When the markets disagree this much, one of them is wrong. We watch which way it converges.`;

  assertTweetLen(text, 'I3_CROSS_MARKET');
  return {
    pillar: 'I3_CROSS_MARKET',
    text,
    sourceFields: {
      away: best.away,
      home: best.home,
      team: best.team,
      polyProb: best.polyProb,
      kalshiProb: best.kalshiProb,
      gap: best.gap,
    },
  };
}

function buildI4(flow) {
  let best = null;
  for (const [, games] of Object.entries(sportGames(flow))) {
    for (const [gk, f] of Object.entries(games)) {
      const change = f.priceHistory?.change;
      if (change == null) continue;
      const abs = Math.abs(change);
      if (abs >= 10 && (!best || abs > Math.abs(best.change))) {
        const pa = Math.round(f.awayProb ?? f.priceHistory?.current ?? 0);
        const ph = Math.round(f.homeProb ?? 100 - pa);
        const team = change > 0 ? f.away || gk.split('_')[0] : f.home || gk.split('_')[1];
        const open = Math.round(change > 0 ? f.priceHistory.open : 100 - f.priceHistory.open);
        const current = Math.round(change > 0 ? f.priceHistory.current : 100 - f.priceHistory.current);
        best = {
          away: f.away || gk,
          home: f.home || gk,
          team,
          open,
          current,
          change: Math.round(change),
          topTrades: (f.whales?.topTrades || []).slice(0, 2),
        };
      }
    }
  }
  if (!best || best.topTrades.length < 2) return null;

  const tradeLines = best.topTrades.map(
    (t) => `• ${fmtMoney(t.amount)} ${t.side} from ${t.traderName}`
  );

  const text = `🔬 LINE MOVE AUTOPSY — ${best.away} @ ${best.home}

${best.team} moved ${best.open}¢ → ${best.current}¢ (${best.change} pts) today.

Who did it:
${tradeLines.join('\n')}

Not a guess. The actual tape. This is what a real move looks like.`;

  assertTweetLen(text, 'I4_LINE_MOVE');
  return {
    pillar: 'I4_LINE_MOVE',
    text,
    sourceFields: {
      away: best.away,
      home: best.home,
      team: best.team,
      open: best.open,
      current: best.current,
      change: best.change,
      topTrades: best.topTrades,
    },
  };
}

function buildI6(flow, wallets, matrix, dayOfWeek) {
  // ~1-2x/week: Mon/Thu deterministic rotation
  const runStudy = dayOfWeek === 1 || dayOfWeek === 4;
  if (!runStudy) return null;

  const studyIndex = dayOfWeek === 1 ? 0 : 1;
  const studies = [];

  const cell = matrix.cells?.all?.['+2,+2'];
  if (cell?.n >= 3) {
    studies.push({
      finding: `Across ${cell.n} graded sides, when proven-wallet margin is +2+, the side hit ${cell.wr}%.`,
      sample: `${cell.n} consensus-cell sides (${matrix.sample?.dateRange?.join(' to ') || 'season'})`,
      sourceFields: { study: 'matrix_plus2_plus2', n: cell.n, wr: cell.wr, roi: cell.roi },
    });
  }

  let agree = 0;
  let total = 0;
  for (const [, games] of Object.entries(sportGames(flow))) {
    for (const [, f] of Object.entries(games)) {
      if (f.awayMoneyPct == null || f.awayTicketPct == null) continue;
      total += 1;
      const moneyFav = f.awayMoneyPct >= f.homeMoneyPct ? 'away' : 'home';
      const ticketFav = f.awayTicketPct >= f.homeTicketPct ? 'away' : 'home';
      if (moneyFav === ticketFav) agree += 1;
    }
  }
  if (total > 0) {
    const pct = Math.round((agree / total) * 100);
    studies.push({
      finding: `The public and the money agree only ${pct}% of the time on Polymarket.`,
      sample: `${total} games on today's slate`,
      sourceFields: { study: 'flow_ticket_money_agree', agree, total, pct },
    });
  }

  const t = wallets.totals;
  if (t?.wallets && t?.walletBets && t?.positions) {
    studies.push({
      finding: `We've graded ${t.walletBets} featured bets + ${t.positions} on-chain positions across ${t.wallets} wallets this season.`,
      sample: `${t.wallets} tracked wallets`,
      sourceFields: { study: 'wallet_totals', ...t },
    });
  }

  const chosen = studies[studyIndex % studies.length];
  if (!chosen) return null;

  const text = `🧠 DATA STUDY

${chosen.finding}

Sample: ${chosen.sample}.

We don't guess. We've tracked this all season. Thread on what it means 👇`;

  return {
    pillar: 'I6_DATA_STUDY',
    text,
    sourceFields: chosen.sourceFields,
  };
}

function lastPillarsFromPrevious() {
  try {
    const prev = loadJson(OUT);
    return (prev.posts || []).map((p) => p.pillar);
  } catch {
    return [];
  }
}

function rotateOrder(candidates, lastPillars) {
  const last = lastPillars[0];
  const sorted = [...candidates].sort((a, b) => {
    const aRepeat = a.pillar === last ? 1 : 0;
    const bRepeat = b.pillar === last ? 1 : 0;
    if (aRepeat !== bRepeat) return aRepeat - bRepeat;
    return a.priority - b.priority;
  });
  return sorted;
}

function main() {
  const now = new Date();
  const generatedAt = now.toISOString();
  const date = getETDate(now);

  let wallets;
  let leaderboard;
  let pos;
  let flow;
  let kalshi;
  let excluded;
  let matrix;

  try {
    wallets = loadJson(FILES.WALLETS);
    leaderboard = loadJson(FILES.LEADERBOARD);
    pos = loadJson(FILES.POS);
    flow = loadJson(FILES.FLOW);
    kalshi = loadJson(FILES.KALSHI);
    excluded = loadJson(FILES.EXCLUDED);
    matrix = loadJson(FILES.MATRIX);
  } catch (err) {
    console.error('Missing data file:', err.message);
    const stale = {
      generatedAt,
      date,
      posts: [{ pillar: 'NONE', text: 'DATA_STALE — skipped run' }],
    };
    fs.writeFileSync(OUT, JSON.stringify(stale, null, 2) + '\n');
    console.log(stale.posts[0].text);
    process.exit(0);
  }

  const stale = isStale(
    now,
    wallets.generatedAt,
    excluded.updatedAt,
    pos.scannedAt,
    flow.updatedAt || flow._meta?.updatedAt,
    kalshi.updatedAt || kalshi._meta?.updatedAt,
    matrix.generatedAt
  );

  if (stale) {
    const out = {
      generatedAt,
      date,
      posts: [{ pillar: 'NONE', text: 'DATA_STALE — skipped run' }],
    };
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
    console.log(out.posts[0].text);
    return;
  }

  const posMeta = {
    walletsScanned: pos.walletsScanned,
    totalExcluded: pos.totalExcluded,
  };

  const candidates = [];
  const i2 = buildI2(excluded, posMeta);
  if (i2) candidates.push({ ...i2, priority: 1 });

  const i5 = buildI5(pos, wallets, date);
  if (i5) candidates.push({ ...i5, priority: 2 });

  const i1 = buildI1(leaderboard, pos, wallets);
  if (i1) candidates.push({ ...i1, priority: 3 });

  const i3 = buildI3(flow, kalshi);
  if (i3) candidates.push({ ...i3, priority: 4 });

  const i4 = buildI4(flow);
  if (i4) candidates.push({ ...i4, priority: 5 });

  const etDay = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' })).getDay();
  const i6 = buildI6(flow, wallets, matrix, etDay);
  if (i6) candidates.push({ ...i6, priority: 6 });

  const lastPillars = lastPillarsFromPrevious();
  const ordered = rotateOrder(candidates, lastPillars);

  // Floor: I2 + I5; target 2-4 posts
  const floor = ordered.filter((p) => p.pillar === 'I2_BOT_REPORT' || p.pillar === 'I5_SMART_MONEY_MAP');
  const extras = ordered.filter((p) => !floor.includes(p));
  const posts = [...floor, ...extras].slice(0, 4).map(({ pillar, text, sourceFields }) => ({
    pillar,
    text,
    sourceFields,
  }));

  if (posts.length === 0) {
    posts.push({ pillar: 'NONE', text: 'DATA_STALE — skipped run' });
  }

  const out = { generatedAt, date, posts };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');

  for (const post of posts) {
    console.log('---');
    console.log(post.text);
    console.log(`[${post.pillar}] ${post.text.length} chars`);
  }
  console.log(`\nWrote ${OUT} (${posts.length} posts)`);
}

main();

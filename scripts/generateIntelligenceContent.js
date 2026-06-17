/**
 * NHL Savant Intelligence Desk — Market Intelligence Content Generator
 *
 * Produces non-pick intelligence posts from tracked wallet / market data.
 * Output: public/social_today.json
 *
 * Usage: node scripts/generateIntelligenceContent.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_PATH = join(ROOT, 'public', 'social_today.json');

const SPORTS = ['MLB', 'NBA', 'NHL', 'CBB', 'SOC'];
const POS_META_KEYS = new Set([
  'scannedAt', 'walletsScanned', 'mmExcluded', 'sportLosersExcluded',
  'noSportExcluded', 'tradersExcluded', 'totalExcluded',
]);
const PILLAR_IDS = ['I2_BOT', 'I5_MAP', 'I3_CROSS', 'I1_SPOTLIGHT', 'I6_STUDY', 'I4_AUTOPSY'];
const MAX_TWEET = 280;
const STALE_MS = 24 * 60 * 60 * 1000;

function loadJson(relPath) {
  const full = join(ROOT, relPath);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, 'utf8'));
}

function getETDate(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function parseTs(value) {
  if (value == null) return null;
  if (typeof value === 'number') return value < 1e12 ? value * 1000 : value;
  const n = Date.parse(value);
  return Number.isNaN(n) ? null : n;
}

function freshestTs(...values) {
  return values.map(parseTs).filter(Boolean).sort((a, b) => b - a)[0] ?? null;
}

function isStale(now, ...timestamps) {
  const latest = freshestTs(...timestamps);
  if (!latest) return true;
  return now.getTime() - latest > STALE_MS;
}

function formatMoney(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function formatVol(n) {
  const v = Math.abs(n);
  if (v >= 1_000_000) return '$' + Math.round(v / 1_000_000) + 'M';
  if (v >= 1_000) return '$' + Math.round(v / 1_000) + 'K';
  return formatMoney(v);
}

function clampTweet(text) {
  if (text.length <= MAX_TWEET) return text;
  const lines = text.split('\n');
  while (lines.join('\n').length > MAX_TWEET && lines.length > 2) {
    lines.splice(-2, 1);
  }
  let out = lines.join('\n');
  if (out.length > MAX_TWEET) out = out.slice(0, MAX_TWEET - 1) + '…';
  return out;
}

function isMemorableName(name) {
  if (!name) return false;
  if (name.length > 24) return false;
  return !/^0x[0-9a-f]/i.test(name);
}

function displayName({ leaderboardName, posName, walletShort }) {
  if (isMemorableName(leaderboardName)) return leaderboardName;
  if (isMemorableName(posName)) return posName;
  if (walletShort) return walletShort;
  return leaderboardName || posName || walletShort;
}

function profileByAddress(profiles, address) {
  const lower = address.toLowerCase();
  return Object.values(profiles).find(p => p.walletAddress?.toLowerCase() === lower) || null;
}

function iterFlowGames(flow) {
  const games = [];
  for (const sport of SPORTS) {
    for (const [gameKey, game] of Object.entries(flow[sport] || {})) {
      games.push({ sport, gameKey, game });
    }
  }
  return games;
}

function iterPosGames(pos) {
  const games = [];
  for (const sport of Object.keys(pos)) {
    if (POS_META_KEYS.has(sport)) continue;
    for (const [gameKey, game] of Object.entries(pos[sport] || {})) {
      if (!game?.positions?.length) continue;
      games.push({ sport, gameKey, game });
    }
  }
  return games;
}

function buildI2(pos) {
  const sourceFields = {
    walletsScanned: pos.walletsScanned,
    mmExcluded: pos.mmExcluded,
    tradersExcluded: pos.tradersExcluded,
    totalExcluded: pos.totalExcluded,
  };
  if (sourceFields.walletsScanned == null) return null;

  const text = clampTweet(`🤖 THE BOT REPORT

Today's "sharp money" before we cleaned it:
• ${sourceFields.walletsScanned} wallets scanned
• ${sourceFields.mmExcluded} market makers stripped
• ${sourceFields.tradersExcluded} arb bots removed
→ ${sourceFields.totalExcluded} fake "sharps" filtered out

When someone says "sharps are on X," ask: which ones? Most of it is bots.`);

  return { pillar: 'I2_BOT', text, sourceFields };
}

function buildI5(pos, wallets, dateET) {
  const agg = new Map();

  for (const { game } of iterPosGames(pos)) {
    const away = game.away;
    const home = game.home;
    const matchup = away && home ? `${away} @ ${home}` : null;
    if (!matchup) continue;

    let awayInv = 0;
    let homeInv = 0;
    const walletSet = new Set();

    for (const p of game.positions) {
      const id = (p.wallet || p.name || '').toLowerCase();
      if (id) walletSet.add(id);
      if (p.side === 'away') awayInv += p.invested || 0;
      else if (p.side === 'home') homeInv += p.invested || 0;
    }

    const total = awayInv + homeInv;
    if (total <= 0) continue;

    const side = homeInv >= awayInv ? 'home' : 'away';
    agg.set(matchup, {
      matchup,
      total,
      wallets: walletSet.size,
      side,
      awayInv,
      homeInv,
    });
  }

  const ranked = [...agg.values()].sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.matchup.localeCompare(b.matchup);
  });

  if (ranked.length < 1) return null;

  const top = ranked.slice(0, 3);
  const walletCount = wallets.totals?.wallets;
  if (walletCount == null) return null;

  const lines = top.map((g, i) =>
    `${i + 1}. ${g.matchup}: ${formatMoney(g.total)} (${g.wallets}, ${g.side})`
  );

  const text = clampTweet(`🗺️ SMART MONEY MAP — ${dateET}

${walletCount} wallets today:
${lines.join('\n')}

Concentration = conviction.`);

  return {
    pillar: 'I5_MAP',
    text,
    sourceFields: {
      date: dateET,
      walletsTracked: walletCount,
      games: top.map(g => ({
        matchup: g.matchup,
        total: Math.round(g.total),
        walletCount: g.wallets,
        side: g.side,
      })),
    },
  };
}

function buildI3(flow, kalshi) {
  let best = null;

  for (const sport of SPORTS) {
    for (const [gameKey, flowGame] of Object.entries(flow[sport] || {})) {
      const kalGame = kalshi[sport]?.[gameKey];
      const current = flowGame?.priceHistory?.current;
      if (!kalGame || current == null) continue;

      const away = flowGame.awayTeam;
      const home = flowGame.homeTeam;
      if (!away || !home) continue;

      const polyAway = Math.round(current);
      const polyHome = Math.round(100 - current);
      const kalAway = Math.round(kalGame.awayProb);
      const kalHome = Math.round(kalGame.homeProb);
      const awayGap = Math.abs(polyAway - kalAway);
      const homeGap = Math.abs(polyHome - kalHome);

      const candidates = [
        { side: 'away', team: away, polyProb: polyAway, kalshiProb: kalAway, gap: awayGap },
        { side: 'home', team: home, polyProb: polyHome, kalshiProb: kalHome, gap: homeGap },
      ];

      for (const c of candidates) {
        if (c.gap < 4) continue;
        const entry = {
          sport,
          gameKey,
          away,
          home,
          ...c,
        };
        if (!best || c.gap > best.gap || (c.gap === best.gap && gameKey < best.gameKey)) {
          best = entry;
        }
      }
    }
  }

  if (!best) return null;

  const text = clampTweet(`📊 MARKET DISAGREEMENT — ${best.away} @ ${best.home}

• Polymarket: ${best.polyProb}% ${best.team}
• Kalshi: ${best.kalshiProb}% ${best.team}
• Gap: ${best.gap} pts

Two markets, same game, different prices. We watch which way it converges.`);

  return {
    pillar: 'I3_CROSS',
    text,
    sourceFields: {
      sport: best.sport,
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

function buildI4(flow) {
  let best = null;

  for (const { sport, gameKey, game } of iterFlowGames(flow)) {
    const change = game?.priceHistory?.change;
    if (change == null) continue;
    const absChange = Math.abs(change);
    if (absChange < 10) continue;

    const away = game.awayTeam;
    const home = game.homeTeam;
    if (!away || !home) continue;

    const entry = { sport, gameKey, game, change, absChange, away, home };
    if (!best || entry.absChange > best.absChange || (entry.absChange === best.absChange && gameKey < best.gameKey)) {
      best = entry;
    }
  }

  if (!best) return null;

  const open = Math.round(best.game.priceHistory.open);
  const current = Math.round(best.game.priceHistory.current);
  const roundedChange = Math.round(best.change);
  const movedSide = roundedChange >= 0 ? 'away' : 'home';
  const team = movedSide === 'away' ? best.away : best.home;

  const topTrades = [...(best.game.whales?.topTrades || [])]
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 2)
    .map(t => ({
      amount: t.amount,
      side: t.side,
      traderName: t.traderName || 'unknown',
    }));

  if (topTrades.length < 1) return null;

  const whoLines = topTrades.map(t => `• ${formatMoney(t.amount)} ${t.side} from ${t.traderName}`);

  const text = clampTweet(`🔬 LINE MOVE AUTOPSY — ${best.away} @ ${best.home}

${team} moved ${open}¢ → ${current}¢ (${roundedChange} pts) today.

Who did it:
${whoLines.join('\n')}

Not a guess. The actual tape. This is what a real move looks like.`);

  return {
    pillar: 'I4_AUTOPSY',
    text,
    sourceFields: {
      sport: best.sport,
      gameKey: best.gameKey,
      away: best.away,
      home: best.home,
      team,
      open,
      current,
      change: roundedChange,
      topTrades,
    },
  };
}

function buildI1(leaderboard, pos, wallets) {
  const entries = Object.entries(leaderboard).filter(([k]) => k !== '_meta');
  const top25 = entries
    .sort((a, b) => b[1].sportPnlTotal - a[1].sportPnlTotal)
    .slice(0, 25);

  const active = new Map();

  for (const { sport, game } of iterPosGames(pos)) {
    for (const p of game.positions) {
      const addr = (p.wallet || '').toLowerCase();
      if (!addr) continue;
      if (!active.has(addr)) {
        active.set(addr, { sports: new Set(), games: 0, posName: p.name });
      }
      const row = active.get(addr);
      row.games += 1;
      row.sports.add(sport);
      if (p.name) row.posName = p.name;
    }
  }

  const candidates = top25
    .filter(([addr]) => active.has(addr.toLowerCase()))
    .map(([addr, lb]) => {
      const act = active.get(addr.toLowerCase());
      const profile = profileByAddress(wallets.profiles || {}, addr);
      const name = displayName({
        leaderboardName: lb.name,
        posName: act.posName,
        walletShort: profile?.walletShort,
      });
      const sport = [...act.sports].sort()[0];
      return {
        addr,
        name,
        lb,
        profile,
        gamesToday: act.games,
        sport,
      };
    })
    .sort((a, b) => {
      const aMem = isMemorableName(a.name) ? 0 : 1;
      const bMem = isMemorableName(b.name) ? 0 : 1;
      if (aMem !== bMem) return aMem - bMem;
      return a.lb.leaderboardRank - b.lb.leaderboardRank;
    });

  if (!candidates.length) return null;

  const pick = candidates[0];
  const sportVol = pick.profile?.positionsContext?.sportVol;
  const sportLabel = pick.sport || 'sports';

  const text = clampTweet(`🔍 SHARP SPOTLIGHT: ${pick.name}

A wallet we've tracked all season.
• Polymarket ${sportLabel} P&L: ${formatMoney(pick.lb.sportPnlTotal)}
• ROI: ${pick.lb.sportROI}% over ${sportVol != null ? formatVol(sportVol) : 'tracked volume'} traded
• Leaderboard rank: #${pick.lb.leaderboardRank} of thousands
• Avg bet: ${formatMoney(pick.lb.avgSportBet)}

Today they're in on ${pick.gamesToday} game${pick.gamesToday === 1 ? '' : 's'}. This is who we watch so you don't have to.`);

  return {
    pillar: 'I1_SPOTLIGHT',
    text,
    sourceFields: {
      name: pick.name,
      wallet: pick.addr,
      sportPnlTotal: pick.lb.sportPnlTotal,
      sportROI: pick.lb.sportROI,
      sportVol,
      leaderboardRank: pick.lb.leaderboardRank,
      avgSportBet: pick.lb.avgSportBet,
      gamesToday: pick.gamesToday,
      sport: sportLabel,
    },
  };
}

function buildI6(flow, wallets, matrix, dateET) {
  const dayNum = parseInt(dateET.replace(/-/g, ''), 10);
  const variant = dayNum % 3;

  if (variant === 0) {
    const cell = matrix?.cells?.all?.['+2,+2'];
    if (!cell?.n) return null;
    const text = clampTweet(`🧠 DATA STUDY

Across ${cell.n} graded sides, when proven-wallet margin is +2+, the side hit ${cell.wr}%.

Sample: ${matrix.sample?.gradedWithWalletDetails ?? cell.n} graded sides with wallet details.

We don't guess. We've tracked this all season. Thread on what it means 👇`);
    return {
      pillar: 'I6_STUDY',
      text,
      sourceFields: {
        study: 'matrix_plus2_plus2',
        n: cell.n,
        wr: cell.wr,
        roi: cell.roi,
        sample: matrix.sample?.gradedWithWalletDetails,
      },
    };
  }

  if (variant === 1) {
    const totals = wallets.totals;
    if (!totals?.wallets) return null;
    const text = clampTweet(`🧠 DATA STUDY

We've graded ${totals.walletBets} featured bets + ${totals.positions} on-chain positions across ${totals.wallets} wallets this season.

Sample: full tracked-wallet corpus since ${wallets.v8Cutover || 'cutover'}.

We don't guess. We've tracked this all season. Thread on what it means 👇`);
    return {
      pillar: 'I6_STUDY',
      text,
      sourceFields: {
        study: 'wallet_totals',
        wallets: totals.wallets,
        walletBets: totals.walletBets,
        positions: totals.positions,
      },
    };
  }

  let agree = 0;
  let total = 0;
  for (const { game } of iterFlowGames(flow)) {
    if (game.awayMoneyPct == null || game.homeMoneyPct == null) continue;
    if (game.awayTicketPct == null || game.homeTicketPct == null) continue;
    total += 1;
    const moneySide = game.awayMoneyPct > game.homeMoneyPct ? 'away' : 'home';
    const ticketSide = game.awayTicketPct > game.homeTicketPct ? 'away' : 'home';
    if (moneySide === ticketSide) agree += 1;
  }
  if (!total) return null;
  const pct = Math.round((agree / total) * 100);

  const text = clampTweet(`🧠 DATA STUDY

On today's Polymarket slate, ticket % and money % agree on the same side only ${pct}% of the time.

Sample: ${total} markets scanned.

We don't guess. We've tracked this all season. Thread on what it means 👇`);

  return {
    pillar: 'I6_STUDY',
    text,
    sourceFields: {
      study: 'ticket_money_agreement',
      agree,
      total,
      agreementPct: pct,
    },
  };
}

function rotateOrder(dateET, previousPillars = []) {
  const dayNum = parseInt(dateET.replace(/-/g, ''), 10);
  const shift = dayNum % PILLAR_IDS.length;
  const rotated = [...PILLAR_IDS.slice(shift), ...PILLAR_IDS.slice(0, shift)];

  if (!previousPillars.length) return rotated;

  const last = previousPillars[0];
  const withoutRepeat = rotated.filter((p, i) => !(i === 0 && p === last));
  if (withoutRepeat[0] === last) {
    return [...withoutRepeat.slice(1), withoutRepeat[0]];
  }
  return withoutRepeat;
}

function selectPosts(candidates, order) {
  const byPillar = new Map(candidates.filter(Boolean).map(p => [p.pillar, p]));
  const selected = [];
  const seen = new Set();

  for (const pillar of order) {
    const post = byPillar.get(pillar);
    if (post && !seen.has(pillar)) {
      selected.push(post);
      seen.add(pillar);
    }
    if (selected.length >= 4) break;
  }

  if (!selected.some(p => p.pillar === 'I2_BOT' || p.pillar === 'I5_MAP')) {
    for (const floor of ['I2_BOT', 'I5_MAP']) {
      if (selected.length >= 4) break;
      const post = byPillar.get(floor);
      if (post && !seen.has(floor)) {
        selected.unshift(post);
        seen.add(floor);
      }
    }
  }

  while (selected.length < 2) {
    for (const floor of ['I2_BOT', 'I5_MAP']) {
      const post = byPillar.get(floor);
      if (post && !seen.has(floor)) {
        selected.push(post);
        seen.add(floor);
      }
    }
    break;
  }

  return selected.slice(0, 4);
}

function main() {
  const now = new Date();
  const dateET = getETDate(now);

  const wallets = loadJson('data/wallet-profiles.json');
  const leaderboard = loadJson('public/sports_sharps.json');
  const pos = loadJson('public/sharp_positions.json');
  const flow = loadJson('public/polymarket_data.json');
  const kalshi = loadJson('public/kalshi_data.json');
  const excluded = loadJson('public/sharp_intel_excluded_wallets.json');
  const matrix = loadJson('public/win_matrix.json');

  const stale = [wallets, leaderboard, pos, flow, kalshi, excluded, matrix].some(f => !f)
    || isStale(
      now,
      wallets?.generatedAt,
      leaderboard?._meta?.lastGapEnrichment,
      pos?.scannedAt,
      flow?.updatedAt,
      kalshi?.updatedAt,
      excluded?.updatedAt,
      matrix?.generatedAt,
    );

  if (stale) {
    const out = {
      generatedAt: now.toISOString(),
      date: dateET,
      posts: [{ pillar: 'NONE', text: 'DATA_STALE — skipped run' }],
    };
    writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log(out.posts[0].text);
    return;
  }

  let previousPillars = [];
  if (existsSync(OUT_PATH)) {
    try {
      const prev = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
      previousPillars = (prev.posts || []).map(p => p.pillar).filter(Boolean);
    } catch {
      previousPillars = [];
    }
  }

  const candidates = [
    buildI2(pos),
    buildI5(pos, wallets, dateET),
    buildI3(flow, kalshi),
    buildI4(flow),
    buildI1(leaderboard, pos, wallets),
    buildI6(flow, wallets, matrix, dateET),
  ];

  const order = rotateOrder(dateET, previousPillars);
  const posts = selectPosts(candidates, order);

  if (!posts.length) {
    const out = {
      generatedAt: now.toISOString(),
      date: dateET,
      posts: [{ pillar: 'NONE', text: 'DATA_STALE — skipped run' }],
    };
    writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log(out.posts[0].text);
    return;
  }

  const out = {
    generatedAt: now.toISOString(),
    date: dateET,
    posts,
  };

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  for (const post of posts) {
    console.log('\n--- ' + post.pillar + ' (' + post.text.length + ' chars) ---\n');
    console.log(post.text);
  }
}

main();

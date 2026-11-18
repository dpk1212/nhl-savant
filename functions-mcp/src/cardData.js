/**
 * Numbers for the shareable cards.
 * Same settled bets as wallet_profile: graded, not postponed, pushes out of the W-L.
 */

const { sizeLabel } = require('./sharpflowWallet');
const { gradeRow, marketOf, usualFor } = require('./walletRecent');

const MIN_CURVE = 5;
const MIN_CELL = 10;
const MIN_STREAK = 5;
const MIN_NIGHT = 3;
const HOT_MIN = 8;
const HOT_RATE = 0.55;
const SIZE_ORDER = ['under 0.5x', '0.5x', '1x', '1.5x and up'];

const FACE = {
  NHL: 'hockey',
  NBA: 'basketball',
  NFL: 'football',
  CFB: 'college football',
  CBB: 'college basketball',
  ATP: 'tennis',
  MLB: 'baseball',
  UFC: 'a fight',
  SOC: 'soccer',
  WNBA: 'basketball',
};

function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function face(sport) {
  return FACE[sport] || sport || 'this sport';
}

function marketWord(market) {
  if (market === 'ML') return 'moneyline';
  if (market === 'SPREAD') return 'spread';
  if (market === 'TOTAL') return 'total';
  return 'bet';
}

function fmtPct(n) {
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n * 10) / 10;
  const body = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${rounded > 0 ? '+' : ''}${body}%`;
}

function fmtMoney(n) {
  if (!Number.isFinite(n)) return null;
  const abs = Math.abs(Math.round(n));
  const sign = n < 0 ? '-' : '';
  if (abs >= 1000) {
    const k = abs / 1000;
    const body = k >= 100 || Math.abs(k - Math.round(k)) < 0.05
      ? String(Math.round(k))
      : k.toFixed(1).replace(/\.0$/, '');
    return `${sign}$${body}K`;
  }
  return `${sign}$${abs}`;
}

function quiet(message) {
  return { message, post: message };
}

function settle(row) {
  const bet = gradeRow(row);
  if (!bet || bet.result === 'push') return null;
  const id = String(row?.walletShort || row?.id || '').toLowerCase();
  const usual = Number(row?.usual);
  return {
    ...bet,
    id: /^[0-9a-f]{6}$/.test(id) ? id : null,
    usual: usual > 0 ? usual : null,
  };
}

function inWindow(bet, today, days) {
  if (!days) return true;
  return bet.date >= addDays(today, -(days - 1)) && bet.date <= today;
}

function tally(bets) {
  let invested = 0;
  let settled = 0;
  let wins = 0;
  let losses = 0;
  for (const bet of bets) {
    invested += bet.invested;
    settled += bet.settled;
    if (bet.result === 'W') wins += 1;
    else losses += 1;
  }
  return {
    record: `${wins}-${losses}`,
    wins,
    losses,
    roiPct: invested > 0 ? Math.round((1000 * settled) / invested) / 10 : null,
    invested,
    settled,
  };
}

function downsample(values, max) {
  if (values.length <= max) return values.slice();
  const out = [];
  for (let i = 0; i < max; i += 1) {
    const idx = Math.round((i * (values.length - 1)) / (max - 1));
    out.push(values[idx]);
  }
  return out;
}

function curveOf(bets) {
  const ordered = bets.slice().sort((a, b) => (
    String(a.date).localeCompare(String(b.date)) || (a.at || 0) - (b.at || 0)
  ));
  let invested = 0;
  let settled = 0;
  let peak = -Infinity;
  let drawdown = 0;
  const points = [];
  for (const bet of ordered) {
    invested += bet.invested;
    settled += bet.settled;
    const roi = invested > 0 ? (100 * settled) / invested : 0;
    points.push(Math.round(roi * 10) / 10);
    if (roi > peak) peak = roi;
    if (peak - roi > drawdown) drawdown = peak - roi;
  }
  const book = tally(ordered);
  return {
    record: book.record,
    roiPct: book.roiPct,
    peakPct: points.length ? Math.round(peak * 10) / 10 : null,
    drawdownPct: points.length ? Math.round(drawdown * 10) / 10 : null,
    points: downsample(points, 48),
  };
}

function profitCurve({ id, profile, rows, sport = null, market = null, window = '30d', today }) {
  const days = window === 'all' ? null : window === '90d' ? 90 : 30;
  const label = window === 'all' ? 'all time' : window === '90d' ? '90 days' : '30 days';
  const wantedMarket = market ? marketOf(market) : null;
  const bets = [];
  for (const row of rows || []) {
    const bet = settle(row);
    if (!bet) continue;
    if (sport && bet.sport !== sport) continue;
    if (wantedMarket && bet.market !== wantedMarket) continue;
    if (!inWindow(bet, today, days)) continue;
    bets.push(bet);
  }
  if (bets.length < MIN_CURVE) {
    return quiet(`Wallet ..${id}. Not enough history for a ${label} curve.`);
  }
  const curve = curveOf(bets);
  const where = [sport ? face(sport) : null, wantedMarket ? marketWord(wantedMarket) : null, label]
    .filter(Boolean)
    .join(', ');
  const post = [
    `Wallet ..${id}.`,
    `Running return, ${where}: ${curve.record}, ${fmtPct(curve.roiPct)} ROI.`,
    `Peak ${fmtPct(curve.peakPct)}. Deepest drop ${fmtPct(-Math.abs(curve.drawdownPct))}.`,
  ].join('\n');
  return {
    post,
    data: {
      id,
      sport: sport || null,
      market: wantedMarket,
      window: window === '90d' || window === 'all' ? window : '30d',
      record: curve.record,
      roiPct: curve.roiPct,
      peakPct: curve.peakPct,
      drawdownPct: curve.drawdownPct,
      points: curve.points,
    },
  };
}

function hotSide(last30) {
  const match = String(last30?.record || '').match(/^(\d+)-(\d+)$/);
  if (!match) return false;
  const wins = Number(match[1]);
  const losses = Number(match[2]);
  const n = wins + losses;
  if (n < HOT_MIN) return false;
  return wins / n >= HOT_RATE;
}

function moneyBoard({ games, sport = null, date }) {
  const rows = [];
  for (const game of games || []) {
    if (sport && game.sport !== sport) continue;
    for (const market of game.markets || []) {
      const sides = (market.sides || []).slice(0, 2).map((side) => ({
        pick: side.pick || side.side,
        dollars: Math.round(Number(side.dollars) || 0),
        wallets: Number(side.confirmed) || 0,
        hot: hotSide(side.last30),
      }));
      if (!sides.length) continue;
      rows.push({
        sport: game.sport,
        matchup: game.matchup,
        market: market.market,
        dollars: sides.reduce((sum, side) => sum + side.dollars, 0),
        sides,
      });
    }
  }
  rows.sort((a, b) => b.dollars - a.dollars);
  if (!rows.length) return quiet('No confirmed money on the board tonight.');
  const shown = rows.slice(0, 8);
  const lines = shown.map((row) => {
    const body = row.sides.map((side) => {
      const hot = side.hot ? ', hot' : '';
      const wallets = `${side.wallets} wallet${side.wallets === 1 ? '' : 's'}`;
      return `${side.pick} ${fmtMoney(side.dollars)} (${wallets}${hot})`;
    }).join(' vs ');
    return `${row.matchup}, ${marketWord(row.market)}: ${body}.`;
  });
  const post = [
    sport ? `Tonight's ${face(sport)} money.` : "Tonight's sharp money.",
    '',
    ...lines,
  ].join('\n');
  return {
    post,
    data: {
      date: date || null,
      sport: sport || null,
      games: shown.map(({ dollars, ...row }) => row),
      gameCount: rows.length,
    },
  };
}

function cellsOf(profile) {
  const cells = [];
  for (const [sport, rec] of Object.entries(profile?.bySport || {})) {
    for (const [market, row] of Object.entries(rec?.byMarket || {})) {
      const window = row?.recentActionWindow;
      const n = Number(window?.n) || 0;
      const roi = Number(window?.dollarRoi);
      if (n < MIN_CELL || !Number.isFinite(roi)) continue;
      const code = marketOf(market);
      if (!code) continue;
      const wins = Number(window.wins) || 0;
      const losses = Number.isFinite(Number(window.losses))
        ? Number(window.losses)
        : Math.max(0, n - wins);
      cells.push({
        sport,
        market: code,
        record: `${wins}-${losses}`,
        roiPct: Math.round(roi * 10) / 10,
        n,
      });
    }
  }
  return cells;
}

function hotVsSlipping({ id, profile, rows, today }) {
  const cells = cellsOf(profile);
  if (cells.length < 2) {
    return quiet(`Wallet ..${id}. Not enough history for a hot and slipping pair.`);
  }
  const ranked = cells.slice().sort((a, b) => b.roiPct - a.roiPct || b.n - a.n);
  const hot = ranked[0];
  const slipping = ranked[ranked.length - 1];
  if (hot.sport === slipping.sport && hot.market === slipping.market) {
    return quiet(`Wallet ..${id}. Not enough history for a hot and slipping pair.`);
  }
  const from = addDays(today, -29);
  const curveFor = (cell) => curveOf((rows || []).map(settle).filter((bet) => (
    bet && bet.sport === cell.sport && bet.market === cell.market && bet.date >= from && bet.date <= today
  )));
  const hotCurve = curveFor(hot);
  const slipCurve = curveFor(slipping);
  const post = [
    `Wallet ..${id}.`,
    `Hot, last 30 days: ${face(hot.sport)} ${marketWord(hot.market)}, ${hot.record}, ${fmtPct(hot.roiPct)} ROI.`,
    `Slipping, last 30 days: ${face(slipping.sport)} ${marketWord(slipping.market)}, ${slipping.record}, ${fmtPct(slipping.roiPct)} ROI.`,
  ].join('\n');
  return {
    post,
    data: {
      id,
      hot: { ...hot, points: hotCurve.points },
      slipping: { ...slipping, points: slipCurve.points },
    },
  };
}

function streakStrip({ id, profile, rows, sport = null, filter = {}, today }) {
  const bets = [];
  for (const row of rows || []) {
    const bet = settle(row);
    if (!bet) continue;
    if (today && bet.date > today) continue;
    if (sport && bet.sport !== sport) continue;
    if (filter.market && bet.market !== filter.market) continue;
    const usual = usualFor(profile, bet.sport);
    const size = usual ? sizeLabel(bet.invested / usual) : null;
    if (filter.size && size !== filter.size) continue;
    if (filter.odds && bet.priceBand !== filter.odds) continue;
    bets.push(bet);
  }
  bets.sort((a, b) => String(a.date).localeCompare(String(b.date)) || (a.at || 0) - (b.at || 0));
  if (bets.length < MIN_STREAK) {
    return quiet(`Wallet ..${id}. Not enough history for a streak.`);
  }
  const last = bets.slice(-20);
  const results = last.map((bet) => bet.result);
  const book = tally(last);
  const recent = tally(last.slice(-5));
  const phrase = [sport ? face(sport) : null, filter.market ? marketWord(filter.market) : null, filter.size, filter.odds]
    .filter(Boolean)
    .join(', ');
  const post = [
    `Wallet ..${id}.`,
    phrase ? `Last ${results.length} settled bets, ${phrase}.` : `Last ${results.length} settled bets.`,
    `${book.record}, ${fmtPct(book.roiPct)} ROI. Last 5: ${recent.record}.`,
  ].join('\n');
  return {
    post,
    data: {
      id,
      sport: sport || null,
      market: filter.market || null,
      size: filter.size || null,
      odds: filter.odds || null,
      results,
      last5: recent.record,
      record: book.record,
      roiPct: book.roiPct,
    },
  };
}

function morningRecap({ rows, date }) {
  const bets = (rows || []).map(settle).filter(Boolean).filter((bet) => bet.date === date);
  if (!bets.length) return quiet(`No settled card for ${date}.`);
  const buckets = new Map(SIZE_ORDER.map((label) => [label, []]));
  const byWallet = new Map();
  let invested = 0;
  for (const bet of bets) {
    invested += bet.invested;
    const usual = Number(bet.usual);
    const size = usual > 0 ? sizeLabel(bet.invested / usual) : null;
    if (size && buckets.has(size)) buckets.get(size).push(bet);
    if (!bet.id) continue;
    if (!byWallet.has(bet.id)) byWallet.set(bet.id, []);
    byWallet.get(bet.id).push(bet);
  }
  const bySize = SIZE_ORDER.map((size) => {
    const list = buckets.get(size);
    if (!list.length) return null;
    const book = tally(list);
    return { size, record: book.record, roiPct: book.roiPct };
  }).filter(Boolean);
  const wallets = [...byWallet.entries()]
    .map(([id, list]) => ({ id, n: list.length, ...tally(list) }))
    .filter((row) => row.n >= MIN_NIGHT)
    .sort((a, b) => (b.roiPct ?? -999) - (a.roiPct ?? -999));
  const best = wallets[0] ? { id: wallets[0].id, record: wallets[0].record, roiPct: wallets[0].roiPct } : null;
  const worst = wallets.length > 1
    ? { id: wallets[wallets.length - 1].id, record: wallets[wallets.length - 1].record, roiPct: wallets[wallets.length - 1].roiPct }
    : null;
  const lines = [
    `Last night, ${date}.`,
    `Confirmed money ${fmtMoney(invested)}.`,
  ];
  for (const row of bySize) lines.push(`${row.size} went ${row.record}, ${fmtPct(row.roiPct)} ROI.`);
  if (best) lines.push(`Best wallet ..${best.id}, ${best.record}, ${fmtPct(best.roiPct)} ROI.`);
  if (worst) lines.push(`Worst wallet ..${worst.id}, ${worst.record}, ${fmtPct(worst.roiPct)} ROI.`);
  return {
    post: lines.join('\n'),
    data: {
      date,
      totalDollars: Math.round(invested),
      bySize,
      best,
      worst,
    },
  };
}

module.exports = {
  MIN_CURVE,
  MIN_CELL,
  MIN_STREAK,
  MIN_NIGHT,
  profitCurve,
  moneyBoard,
  hotVsSlipping,
  streakStrip,
  morningRecap,
  curveOf,
  tally,
};

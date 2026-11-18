/**
 * Last five settled bets for one wallet already on tonight's board.
 * Bands only. The rows keep sport, market, result, and three labels.
 */

const { sizeLabel } = require('./sharpflowWallet');

const MARKETS = ['ML', 'SPREAD', 'TOTAL'];
const SIZE_CHOICES = ['under 0.5x', '0.5x', '1x', '1.5x and up'];
const ODDS_CHOICES = ['-200 or shorter', '-199 to -121', '-120 to +120', '+121 to +200', 'longer than +200'];
const ARG_KEYS = new Set(['id', 'sport', 'market', 'size', 'odds']);

const SPORT_FACE = {
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

function usualFor(profile, sport) {
  const rec = profile?.bySport?.[sport]?.positions;
  const n = Number(rec?.n) || 0;
  const invested = Number(rec?.invested);
  if (n > 0 && invested > 0) return Math.round(invested / n);
  return null;
}

function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function dateBucket(gameDate, today) {
  if (!gameDate || !today || gameDate > today) return null;
  if (gameDate >= addDays(today, -2)) return 'last 3 days';
  const weekStart = addDays(today, -new Date(`${today}T12:00:00Z`).getUTCDay());
  if (gameDate >= weekStart) return 'this week';
  if (gameDate >= addDays(today, -13)) return 'last 2 weeks';
  return 'older';
}

function marketOf(raw) {
  const s = String(raw || '').trim().toUpperCase();
  if (s === 'ML' || s === 'MONEYLINE' || s === 'H2H') return 'ML';
  if (s === 'SPREAD' || s === 'SPREADS') return 'SPREAD';
  if (s === 'TOTAL' || s === 'TOTALS') return 'TOTAL';
  return null;
}

function americanOf(row) {
  const direct = [row?.pinnacleOdds, row?.bestRetailOdds, row?.odds]
    .map((value) => Number(value))
    .find((value) => Number.isFinite(value) && value !== 0);
  if (direct != null) return Math.round(direct);
  const raw = Number(row?.avgPrice);
  if (!Number.isFinite(raw)) return null;
  const prob = raw > 1 && raw <= 100 ? raw / 100 : raw;
  if (!(prob > 0 && prob < 1)) return null;
  if (prob >= 0.5) return Math.round((-100 * prob) / (1 - prob));
  return Math.round((100 * (1 - prob)) / prob);
}

function oddsBand(american) {
  if (!Number.isFinite(american) || american === 0) return null;
  if (american <= -200) return '-200 or shorter';
  if (american <= -121) return '-199 to -121';
  if (american <= 120) return '-120 to +120';
  if (american <= 200) return '+121 to +200';
  return 'longer than +200';
}

function fmtPct(n) {
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n * 10) / 10;
  const body = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${rounded > 0 ? '+' : ''}${body}%`;
}

function validateRecentArgs(args) {
  const a = args && typeof args === 'object' ? args : {};
  const keys = Object.keys(a).filter((key) => a[key] != null && String(a[key]).trim() !== '');
  if (keys.some((key) => !ARG_KEYS.has(key))) {
    return { error: 'Pass id, an optional sport, and at most one of market, size, or odds.' };
  }
  const filters = ['market', 'size', 'odds'].filter((key) => keys.includes(key));
  if (filters.length > 1) {
    return { error: 'Pass a sport and at most one of market, size, or odds.' };
  }
  if (!keys.includes('id')) return { error: 'Pass the six-character id the site shows.' };
  const id = String(a.id).trim().toLowerCase().replace(/^\.+/, '');
  if (!/^[0-9a-f]{6}$/.test(id)) {
    return { error: 'Pass the six-character id the site shows. A letter changes when the board changes.' };
  }
  let sport = null;
  if (keys.includes('sport')) {
    sport = String(a.sport).trim().toUpperCase();
    if (!/^[A-Z0-9]{2,8}$/.test(sport)) return { error: 'sport is a code such as NBA or NHL.' };
  }
  const filter = {};
  if (keys.includes('market')) {
    const market = String(a.market).trim().toUpperCase();
    if (!MARKETS.includes(market)) return { error: 'market is ML, SPREAD, or TOTAL.' };
    filter.market = market;
  }
  if (keys.includes('size')) {
    const size = String(a.size).trim();
    if (!SIZE_CHOICES.includes(size)) return { error: 'size is under 0.5x, 0.5x, 1x, or 1.5x and up.' };
    filter.size = size;
  }
  if (keys.includes('odds')) {
    const odds = String(a.odds).trim();
    if (!ODDS_CHOICES.includes(odds)) {
      return { error: 'odds is -200 or shorter, -199 to -121, -120 to +120, +121 to +200, or longer than +200.' };
    }
    filter.odds = odds;
  }
  return { id, sport, filter };
}

function gradeRow(row) {
  if (!row || typeof row !== 'object') return null;
  if (row.status && row.status !== 'GRADED') return null;
  if (row.postponed === true) return null;
  const invested = Number(row.invested ?? row.size ?? 0);
  if (!(invested > 0)) return null;
  const settled = Number(row.settledPnl ?? row.positionPnl ?? 0);
  const marked = String(row.result || '').toUpperCase();
  const date = /^\d{4}-\d{2}-\d{2}/.test(String(row.date || '')) ? String(row.date).slice(0, 10) : null;
  if (!date) return null;
  const at = Number(row.gradedAt) || 0;
  const sport = row.sport ? String(row.sport).toUpperCase() : null;
  const market = marketOf(row.marketType ?? row.market);
  const priceBand = oddsBand(americanOf(row));
  if (marked === 'PUSH') {
    return { sport, market, date, at, invested, settled: Number.isFinite(settled) ? settled : 0, result: 'push', priceBand };
  }
  if (!Number.isFinite(settled) || Math.abs(settled) <= 1e-9) return null;
  return {
    sport,
    market,
    date,
    at,
    invested,
    settled,
    result: settled > 0 ? 'W' : 'L',
    priceBand,
  };
}

function slicePhrase(sport, filter) {
  const parts = [];
  if (sport) parts.push(SPORT_FACE[sport] || sport);
  if (filter?.market) parts.push(filter.market === 'ML' ? 'moneyline' : filter.market.toLowerCase());
  if (filter?.size) parts.push(filter.size);
  if (filter?.odds) parts.push(filter.odds);
  return parts.join(', ');
}

function resultWord(result) {
  if (result === 'W') return 'win';
  if (result === 'L') return 'loss';
  return 'push';
}

function marketWord(market) {
  if (market === 'ML') return 'moneyline';
  if (market === 'SPREAD') return 'spread';
  if (market === 'TOTAL') return 'total';
  return 'bet';
}

function writeRecentPost({ id, phrase, bets, summary }) {
  const lines = [`Wallet ..${id}.`];
  if (!bets.length) {
    lines.push(phrase ? `Not enough history, ${phrase}.` : 'Not enough history.');
    return lines.join('\n');
  }
  lines.push(phrase ? `Last 5 settled bets, ${phrase}.` : 'Last 5 settled bets.');
  lines.push('');
  const pushes = summary.pushes
    ? `, ${summary.pushes} push${summary.pushes === 1 ? '' : 'es'}`
    : '';
  const roi = fmtPct(summary.roiPct);
  lines.push(`${summary.record}${pushes}${roi ? `, ${roi} ROI` : ''}.`);
  lines.push('');
  for (const bet of bets) {
    const face = SPORT_FACE[bet.sport] || bet.sport || 'A';
    const size = bet.size || 'size not sized';
    const price = bet.priceBand || 'price not banded';
    lines.push(`${face} ${marketWord(bet.market)}, ${bet.when}, ${size}, ${price}, ${resultWord(bet.result)}.`);
  }
  return lines.join('\n');
}

function recentRead({ id, profile, rows, sport = null, filter = {}, today }) {
  const phrase = slicePhrase(sport, filter);
  const graded = [];
  for (const row of rows || []) {
    const bet = gradeRow(row);
    if (!bet) continue;
    if (sport && bet.sport !== sport) continue;
    if (filter.market && bet.market !== filter.market) continue;
    const usual = usualFor(profile, bet.sport);
    const size = usual ? sizeLabel(bet.invested / usual) : null;
    if (filter.size && size !== filter.size) continue;
    if (filter.odds && bet.priceBand !== filter.odds) continue;
    graded.push({ ...bet, size, when: dateBucket(bet.date, today) });
  }
  graded.sort((a, b) => (
    String(b.date).localeCompare(String(a.date))
    || (b.at || 0) - (a.at || 0)
    || String(a.sport || '').localeCompare(String(b.sport || ''))
    || String(a.market || '').localeCompare(String(b.market || ''))
    || String(a.result).localeCompare(String(b.result))
  ));
  const base = {
    id,
    sport: sport || null,
    slice: phrase || null,
  };
  if (graded.length < 5) {
    return {
      ...base,
      bets: [],
      message: 'not enough history',
      post: writeRecentPost({ id, phrase, bets: [], summary: null }),
    };
  }
  const five = graded.slice(0, 5).map((bet) => ({
    sport: bet.sport,
    market: bet.market,
    result: bet.result,
    priceBand: bet.priceBand,
    size: bet.size,
    when: bet.when,
  }));
  const invested = graded.slice(0, 5).reduce((sum, bet) => sum + bet.invested, 0);
  const settled = graded.slice(0, 5).reduce((sum, bet) => sum + bet.settled, 0);
  const wins = five.filter((bet) => bet.result === 'W').length;
  const losses = five.filter((bet) => bet.result === 'L').length;
  const pushes = five.filter((bet) => bet.result === 'push').length;
  const summary = {
    record: `${wins}-${losses}`,
    roiPct: invested > 0 ? Math.round((1000 * settled) / invested) / 10 : null,
    n: 5,
  };
  if (pushes) summary.pushes = pushes;
  return {
    ...base,
    bets: five,
    summary,
    post: writeRecentPost({ id, phrase, bets: five, summary }),
  };
}

module.exports = {
  MARKETS,
  SIZE_CHOICES,
  ODDS_CHOICES,
  validateRecentArgs,
  gradeRow,
  dateBucket,
  oddsBand,
  americanOf,
  recentRead,
};

/**
 * One wallet from tonight's board, in the shape of a short post.
 * The letter is the only identity. No name, no address.
 */

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
  CS2: 'Counter-Strike',
  LOL: 'League of Legends',
};

const SIZE_BANDS = [
  ['press', 'Presses (1.5x+)'],
  ['full', 'Normal'],
  ['lean', 'Near usual'],
  ['light', 'Light'],
];

const MIN_COMPARE = 8;

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bookOf(agg) {
  if (!agg) return null;
  const wins = Number(agg.wins) || 0;
  const losses = Number.isFinite(num(agg.losses))
    ? Number(agg.losses)
    : Math.max(0, (Number(agg.n) || 0) - wins);
  if (wins + losses <= 0) return null;
  let returnPct = num(agg.dollarRoi);
  if (returnPct == null) returnPct = num(agg.returnPct);
  const invested = num(agg.invested);
  const settled = num(agg.settledPnl);
  if (returnPct == null && invested > 0 && settled != null) {
    returnPct = Math.round((1000 * settled) / invested) / 10;
  }
  const out = {
    record: `${wins}-${losses}`,
    wins,
    losses,
  };
  if (returnPct != null) out.returnPct = Math.round(returnPct * 10) / 10;
  if (settled != null) out.dollars = Math.round(settled);
  return out;
}

function fmtUsd(n) {
  if (!Number.isFinite(n)) return null;
  const sign = n < 0 ? '-' : '+';
  const abs = Math.abs(Math.round(n));
  if (abs >= 1000) {
    const k = abs / 1000;
    const body = k >= 100 || Math.abs(k - Math.round(k)) < 0.05
      ? String(Math.round(k))
      : k.toFixed(1).replace(/\.0$/, '');
    return `${sign}$${body}K`;
  }
  return `${sign}$${abs}`;
}

function fmtPct(n) {
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n * 10) / 10;
  const body = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${rounded > 0 ? '+' : ''}${body}%`;
}

function recordPhrase(book) {
  if (!book) return null;
  const bits = [book.record];
  const pct = fmtPct(book.returnPct);
  const dollars = fmtUsd(book.dollars);
  if (pct) bits.push(`${pct} ROI`);
  else if (dollars) bits.push(dollars);
  return bits.join(', ');
}

function marketPhrase(name, book) {
  if (!book) return null;
  const dollars = fmtUsd(book.dollars);
  return dollars ? `${name}: ${book.record}, ${dollars}` : `${name}: ${book.record}`;
}

function sizeRows(bands) {
  const rows = [];
  for (const [id, label] of SIZE_BANDS) {
    const band = bands?.[id];
    const wins = Number(band?.wins) || 0;
    const losses = Number.isFinite(num(band?.losses)) ? Number(band.losses) : 0;
    const n = Number(band?.n) || (wins + losses);
    if (!(n > 0)) continue;
    rows.push({ id, label, record: `${wins}-${losses}`, n });
  }
  return rows;
}

function sizeFromLegs(legs) {
  const buckets = { press: [], full: [], lean: [], light: [] };
  for (const leg of legs || []) {
    const id = leg?.sizeBand;
    if (!buckets[id]) continue;
    const won = leg.won === 1 || leg.won === true;
    const lost = leg.won === 0 || leg.won === false;
    if (!won && !lost) continue;
    buckets[id].push(won ? 1 : 0);
  }
  const bands = {};
  for (const id of Object.keys(buckets)) {
    const rows = buckets[id];
    const wins = rows.filter((w) => w === 1).length;
    bands[id] = { n: rows.length, wins, losses: rows.length - wins };
  }
  return sizeRows(bands);
}

function sizeFromProfile(profile) {
  const bands = profile?.sizeRatioBands?.positions?.bands || profile?.sizeRatioBands?.bands;
  return sizeRows(bands);
}

function last10Of(form, legs) {
  const l10 = form?.actionL10 || form?.l10;
  const w = Number(l10?.w);
  const l = Number(l10?.l);
  if (Number.isFinite(w) && Number.isFinite(l) && w + l > 0) return `${w}-${l}`;
  const decided = (legs || []).filter((leg) => leg.won === 0 || leg.won === 1 || leg.won === true || leg.won === false);
  const slice = decided.slice(-10);
  if (!slice.length) return null;
  const wins = slice.filter((leg) => leg.won === 1 || leg.won === true).length;
  return `${wins}-${slice.length - wins}`;
}

function streakOf(legs) {
  const ordered = (legs || [])
    .filter((leg) => leg && (leg.won === 0 || leg.won === 1 || leg.won === true || leg.won === false))
    .slice()
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  if (!ordered.length) return null;
  const lastWin = ordered[ordered.length - 1].won === 1 || ordered[ordered.length - 1].won === true;
  let n = 0;
  for (let i = ordered.length - 1; i >= 0; i -= 1) {
    const win = ordered[i].won === 1 || ordered[i].won === true;
    if (win !== lastWin) break;
    n += 1;
  }
  return { kind: lastWin ? 'win' : 'loss', n };
}

function biggestRecent(legs) {
  let max = 0;
  for (const leg of legs || []) {
    const invested = num(leg?.invested);
    if (invested > max) max = invested;
  }
  return max > 0 ? Math.round(max) : null;
}

function sportBooks(profile) {
  const out = [];
  for (const [sport, rec] of Object.entries(profile?.bySport || {})) {
    const book = bookOf(rec?.positions);
    if (!book) continue;
    const markets = {};
    for (const [market, row] of Object.entries(rec?.byMarket || {})) {
      const marketBook = bookOf(row?.positions);
      if (marketBook) markets[market] = marketBook;
    }
    out.push({
      sport,
      ...book,
      markets,
      last10: last10Of(rec?.form, rec?.form?.recentAction),
    });
  }
  out.sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses));
  return out;
}

function wr(book) {
  if (!book) return null;
  const n = book.wins + book.losses;
  if (n < MIN_COMPARE) return null;
  return book.wins / n;
}

function ticketsFor(games, short) {
  const out = [];
  for (const game of games || []) {
    for (const market of game.markets || []) {
      for (const side of market.sides || []) {
        for (const ticket of side.tickets || []) {
          if (ticket.short !== short) continue;
          out.push({
            sport: game.sport,
            matchup: game.matchup,
            kickoffEt: game.kickoffEt || null,
            market: market.market,
            pick: side.pick,
            price: ticket.price || null,
            line: ticket.line ?? null,
            dollars: ticket.dollars,
            vsUsual: ticket.sharp?.vsUsual ?? null,
            size: ticket.sharp?.size || null,
          });
        }
      }
    }
  }
  return out;
}

function ticketLine(ticket) {
  const price = ticket.price ? ` (${ticket.price})` : '';
  const size = Number.isFinite(ticket.vsUsual) ? `, ${ticket.vsUsual}x his usual` : '';
  return `${ticket.pick}${price}${size}`;
}

function writePost({ sport, overall, sportBook, bySize, last10, streak, tickets, biggestYet }) {
  const face = SPORT_FACE[sport] || sport;
  const sportWr = wr(sportBook);
  const overallWr = wr(overall);
  const gap = sportWr != null && overallWr != null ? (sportWr - overallWr) * 100 : null;
  const lines = [];
  if (sport === 'ATP' && tickets.some((t) => t.size === 'press' || (t.vsUsual || 0) >= 1.5)) {
    lines.push('Tailing a tennis sharp.');
  } else if (gap != null && gap >= 8) {
    lines.push(`Found a ${face} specialist.`);
  } else if (face) {
    lines.push(`A ${face} wallet on tonight's board.`);
  }
  lines.push('');
  const overallText = overall ? `Overall he's ${overall.record}.` : null;
  const sportText = sportBook
    ? `In ${sport}: ${recordPhrase(sportBook)}.`
    : null;
  if (overallText && sportText) lines.push(`${overallText} ${sportText}`);
  else if (sportText) lines.push(sportText);
  else if (overallText) lines.push(overallText);
  for (const name of ['SPREAD', 'TOTAL', 'ML']) {
    const phrase = marketPhrase(
      name === 'SPREAD' ? 'Spreads' : name === 'TOTAL' ? 'Totals' : 'Moneyline',
      sportBook?.markets?.[name],
    );
    if (phrase) lines.push(phrase);
  }
  if (bySize.length) {
    lines.push(bySize.map((row) => `${row.label}: ${row.record}`).join('. ') + '.');
  }
  if (last10) lines.push(`Last 10: ${last10}.`);
  if (streak && streak.n >= 3) {
    lines.push(streak.kind === 'win' ? `Current streak: ${streak.n} wins.` : `Current streak: ${streak.n} losses.`);
  }
  if (tickets.length) {
    lines.push('');
    const biggest = biggestYet ? ', his biggest in the last 30 days' : '';
    const body = tickets.map(ticketLine).join('. ');
    lines.push(`Tonight: ${body}${biggest}.`);
  }
  return lines.filter((line, i, all) => line !== '' || (i > 0 && all[i - 1] !== '')).join('\n');
}

function profileRead(profile, tickets, { letter, sport = null } = {}) {
  const tonight = tickets || [];
  const sports = sportBooks(profile);
  const focus = sport
    || (tonight.length && tonight.every((t) => t.sport === tonight[0].sport) ? tonight[0].sport : null)
    || sports[0]?.sport
    || null;
  const sportRec = profile?.bySport?.[focus] || null;
  const legs = sportRec?.form?.recentAction || [];
  const recentSize = sizeFromLegs(legs);
  const bySize = recentSize.length ? recentSize : sizeFromProfile(profile);
  const bySizeScope = recentSize.length ? 'last 30 days in this sport' : 'whole book';
  const recentMax = biggestRecent(legs);
  const tonightMax = tonight.reduce((m, t) => Math.max(m, Number(t.dollars) || 0), 0);
  const biggestYet = recentMax != null && tonightMax > recentMax;
  const overall = bookOf(profile?.positions);
  const sportBook = sports.find((row) => row.sport === focus) || null;
  const last10 = sportBook?.last10 || last10Of(sportRec?.form, legs);
  const streak = streakOf(legs);
  const post = writePost({
    sport: focus,
    overall,
    sportBook,
    bySize,
    last10,
    streak,
    tickets: tonight,
    biggestYet,
  });
  return {
    sameNight: letter,
    overall,
    sports: sports.map(({ markets, ...row }) => row),
    focus,
    markets: sportBook?.markets || {},
    bySize,
    bySizeScope,
    last10,
    streak,
    biggestRecent: recentMax,
    biggestYet,
    tonight,
    post,
  };
}

function specialistRank(rows, sport) {
  const ranked = [];
  for (const row of rows || []) {
    const read = profileRead(row.profile, row.tickets, { letter: row.letter, sport });
    const sportBook = (read.sports || []).find((item) => item.sport === sport);
    const sportRate = wr(sportBook);
    const overallRate = wr(read.overall);
    if (sportRate == null || overallRate == null) continue;
    const gap = Math.round((sportRate - overallRate) * 1000) / 10;
    const bettingBig = (row.tickets || []).some((t) => t.size === 'press' || (Number(t.vsUsual) || 0) >= 1.5);
    ranked.push({
      sameNight: row.letter,
      gap,
      overall: read.overall?.record || null,
      sport: sportBook?.record || null,
      returnPct: sportBook?.returnPct ?? null,
      last10: read.last10,
      bettingBig,
      tonight: read.tonight,
      post: read.post,
    });
  }
  ranked.sort((a, b) => b.gap - a.gap || String(a.sameNight).localeCompare(String(b.sameNight)));
  return ranked.slice(0, 5);
}

module.exports = {
  profileRead,
  specialistRank,
  ticketsFor,
  bookOf,
  MIN_COMPARE,
};

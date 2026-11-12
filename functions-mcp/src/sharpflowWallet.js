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

const SIZE_BUCKETS = [
  { id: 'light', label: 'under 0.5x', min: 0, max: 0.5 },
  { id: 'lean', label: '0.5x', min: 0.5, max: 1 },
  { id: 'full', label: '1x', min: 1, max: 1.5 },
  { id: 'press', label: '1.5x and up', min: 1.5, max: Infinity },
];

const MIN_COMPARE = 8;

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function sizeLabel(ratio) {
  if (!Number.isFinite(ratio) || ratio <= 0) return null;
  const bucket = SIZE_BUCKETS.find((row) => ratio >= row.min && ratio < row.max) || SIZE_BUCKETS[SIZE_BUCKETS.length - 1];
  return bucket.label;
}

function bookOf(agg, window = 'all time') {
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
    window,
  };
  if (returnPct != null) out.returnPct = Math.round(returnPct * 10) / 10;
  if (settled != null) out.dollars = Math.round(settled);
  return out;
}

function fmtDollars(n) {
  if (!Number.isFinite(n)) return null;
  const abs = Math.abs(Math.round(n));
  if (abs >= 1000) {
    const k = abs / 1000;
    const body = k >= 100 || Math.abs(k - Math.round(k)) < 0.05
      ? String(Math.round(k))
      : k.toFixed(1).replace(/\.0$/, '');
    return `$${body}K`;
  }
  return `$${abs}`;
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
  const when = book.window || 'all time';
  const body = dollars ? `${book.record}, ${dollars}` : book.record;
  return `${name}, ${when}: ${body}`;
}

function sizeRows(bands, window, scope) {
  const rows = [];
  for (const bucket of SIZE_BUCKETS) {
    const band = bands?.[bucket.id];
    const wins = Number(band?.wins) || 0;
    const losses = Number.isFinite(num(band?.losses)) ? Number(band.losses) : 0;
    const n = Number(band?.n) || (wins + losses);
    if (!(n > 0)) continue;
    rows.push({
      id: bucket.id,
      label: bucket.label,
      record: `${wins}-${losses}`,
      n,
      window,
      scope,
    });
  }
  return rows;
}

function sizeFromLegs(legs, scope) {
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
  return sizeRows(bands, 'last 30 days', scope);
}

function storedBands(block) {
  return block?.positions?.bands || block?.bands || null;
}

function sizeFromStored(block, window, scope) {
  return sizeRows(storedBands(block), window, scope);
}

function sizeFromBets(bets, sport, usual) {
  if (!Array.isArray(bets) || !(usual > 0)) return [];
  const buckets = { press: [], full: [], lean: [], light: [] };
  for (const bet of bets) {
    if (sport && String(bet?.sport || '').toUpperCase() !== sport) continue;
    const invested = num(bet?.invested);
    if (!(invested > 0)) continue;
    const won = bet.won === 1 || bet.won === true;
    const lost = bet.won === 0 || bet.won === false;
    if (!won && !lost) continue;
    const ratio = invested / usual;
    const bucket = SIZE_BUCKETS.find((row) => ratio >= row.min && ratio < row.max) || SIZE_BUCKETS[SIZE_BUCKETS.length - 1];
    buckets[bucket.id].push(won ? 1 : 0);
  }
  const bands = {};
  for (const id of Object.keys(buckets)) {
    const rows = buckets[id];
    const wins = rows.filter((w) => w === 1).length;
    bands[id] = { n: rows.length, wins, losses: rows.length - wins };
  }
  return sizeRows(bands, 'all time', sport);
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
    const book = bookOf(rec?.positions, 'all time');
    if (!book) continue;
    const markets = {};
    for (const [market, row] of Object.entries(rec?.byMarket || {})) {
      const marketBook = bookOf(row?.positions, 'all time');
      if (!marketBook) continue;
      const last30 = bookOf(row?.recentActionWindow, 'last 30 days');
      markets[market] = last30 ? { ...marketBook, last30 } : marketBook;
    }
    const last30 = bookOf(rec?.recentActionWindow, 'last 30 days');
    out.push({
      sport,
      ...book,
      ...(last30 ? { last30 } : {}),
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
            vsUsualAll: ticket.sharp?.vsUsualAll ?? null,
            usualSport: ticket.sharp?.usualSport ?? null,
            usualAll: ticket.sharp?.usualAll ?? null,
            size: ticket.sharp?.size || null,
          });
        }
      }
    }
  }
  return out;
}

function ticketLine(ticket, sport) {
  const face = SPORT_FACE[sport] || sport || 'this sport';
  const price = ticket.price ? ` (${ticket.price})` : '';
  const dollars = Number.isFinite(ticket.dollars) ? `, ${fmtDollars(ticket.dollars)}` : '';
  const parts = [`${ticket.pick}${price}${dollars}`];
  if (Number.isFinite(ticket.vsUsual)) {
    const usual = Number.isFinite(ticket.usualSport) ? ` (${fmtDollars(ticket.usualSport)})` : '';
    parts.push(`${ticket.vsUsual}x his ${face} usual${usual}`);
  }
  if (Number.isFinite(ticket.vsUsualAll)) {
    const usual = Number.isFinite(ticket.usualAll) ? ` (${fmtDollars(ticket.usualAll)})` : '';
    parts.push(`${ticket.vsUsualAll}x his usual across all sports${usual}`);
  }
  return parts.join(', ');
}

function whereOf(scope) {
  if (!scope || scope === 'all sports') return 'across all sports';
  return `in ${SPORT_FACE[scope] || scope}`;
}

function sizeSentences(split) {
  if (!split?.buckets?.length) return [];
  const where = whereOf(split.scope);
  const usual = Number.isFinite(split.usual) ? `, usual ${fmtDollars(split.usual)}` : '';
  const press = split.buckets.find((row) => row.id === 'press');
  const rest = split.buckets.filter((row) => row.id !== 'press');
  const lines = [];
  if (press) lines.push(`1.5x and up, ${split.window} ${where}${usual}: ${press.record}.`);
  if (rest.length) {
    const body = rest.map((row) => `${row.label}: ${row.record}`).join('. ');
    lines.push(`Other sizes, ${split.window} ${where}${usual}: ${body}.`);
  }
  return lines;
}

function usualSportOf(profile, sport) {
  const rec = profile?.bySport?.[sport]?.positions;
  const n = Number(rec?.n) || 0;
  const invested = Number(rec?.invested);
  if (n > 0 && invested > 0) return Math.round(invested / n);
  return null;
}

function usualAllOf(profile) {
  const usual = Number(profile?.sizeRatioBands?.usual);
  return Number.isFinite(usual) && usual > 0 ? Math.round(usual) : null;
}

function splitOf(buckets, window, scope, usual) {
  if (!buckets?.length) return null;
  return { window, scope, usual: Number.isFinite(usual) ? usual : null, buckets };
}

function writePost({ id, letter, sport, overall, sportBook, bySize, last10, streak, tickets, biggestYet }) {
  const face = SPORT_FACE[sport] || sport;
  const sportWr = wr(sportBook);
  const overallWr = wr(overall);
  const gap = sportWr != null && overallWr != null ? (sportWr - overallWr) * 100 : null;
  const lines = [];
  if (id) lines.push(`Wallet ..${id}.`);
  if (letter) lines.push(`Tonight's letter is ${letter}. It changes when the board changes.`);
  if (sport === 'ATP' && tickets.some((t) => t.size === '1.5x and up' || (t.vsUsual || 0) >= 1.5)) {
    lines.push('Tailing a tennis sharp.');
  } else if (gap != null && gap >= 8) {
    lines.push(`Found a ${face} specialist.`);
  } else if (face) {
    lines.push(`A ${face} wallet on tonight's board.`);
  }
  lines.push('');
  const since = overall?.since ? ` since ${overall.since}` : '';
  if (overall) lines.push(`Overall, all time${since}: ${recordPhrase(overall)}.`);
  if (sportBook) {
    lines.push(`In ${face}, all time: ${recordPhrase(sportBook)}.`);
    if (sportBook.last30) lines.push(`In ${face}, last 30 days: ${recordPhrase(sportBook.last30)}.`);
  }
  for (const name of ['SPREAD', 'TOTAL', 'ML']) {
    const phrase = marketPhrase(
      name === 'SPREAD' ? 'Spreads' : name === 'TOTAL' ? 'Totals' : 'Moneyline',
      sportBook?.markets?.[name],
    );
    if (phrase) lines.push(phrase);
  }
  for (const key of ['sport', 'allSports', 'last30']) {
    lines.push(...sizeSentences(bySize?.[key]));
  }
  if (last10) lines.push(`Last 10 bets: ${last10}.`);
  if (streak && streak.n >= 3) {
    const window = streak.window ? `, ${streak.window}` : '';
    lines.push(streak.kind === 'win'
      ? `Current streak${window}: ${streak.n} wins.`
      : `Current streak${window}: ${streak.n} losses.`);
  }
  if (tickets.length) {
    lines.push('');
    const biggest = biggestYet ? ', his biggest in the last 30 days' : '';
    const body = tickets.map((ticket) => ticketLine(ticket, sport)).join('. ');
    lines.push(`Tonight: ${body}${biggest}.`);
  }
  return lines.filter((line, i, all) => line !== '' || (i > 0 && all[i - 1] !== '')).join('\n');
}

function profileRead(profile, tickets, { letter, sport = null, id = null, bets = null } = {}) {
  const tonight = tickets || [];
  const sports = sportBooks(profile);
  const focus = sport
    || (tonight.length && tonight.every((t) => t.sport === tonight[0].sport) ? tonight[0].sport : null)
    || sports[0]?.sport
    || null;
  const sportRec = profile?.bySport?.[focus] || null;
  const legs = sportRec?.form?.recentAction || [];
  const sportUsual = usualSportOf(profile, focus);
  const allUsual = usualAllOf(profile);
  const since = profile?.firstBetDate || null;
  const through = profile?.lastBetDate || null;
  const storedSport = sizeFromStored(sportRec?.sizeRatioBands, 'all time', focus);
  const computedSport = storedSport.length ? storedSport : sizeFromBets(bets, focus, sportUsual);
  const bySize = {
    sport: splitOf(computedSport, 'all time', focus, sportUsual),
    allSports: splitOf(sizeFromStored(profile?.sizeRatioBands, 'all time', 'all sports'), 'all time', 'all sports', allUsual),
    last30: splitOf(sizeFromLegs(legs, focus), 'last 30 days', focus, sportUsual),
  };
  const recentMax = biggestRecent(legs);
  const tonightMax = tonight.reduce((m, t) => Math.max(m, Number(t.dollars) || 0), 0);
  const biggestYet = recentMax != null && tonightMax > recentMax;
  const overall = bookOf(profile?.positions, 'all time');
  if (overall && since) overall.since = since;
  if (overall && through) overall.through = through;
  const sportBook = sports.find((row) => row.sport === focus) || null;
  const last10 = sportBook?.last10 || last10Of(sportRec?.form, legs);
  const streak = streakOf(legs);
  if (streak) streak.window = 'last 30 days';
  const post = writePost({
    id,
    letter,
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
    id: id || null,
    sameNight: letter || null,
    overall,
    sports: sports.map(({ markets, ...row }) => row),
    focus,
    markets: sportBook?.markets || {},
    usual: {
      sport: sportUsual,
      allSports: allUsual,
    },
    bySize,
    last10,
    last10Window: last10 ? 'last 10 bets' : null,
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
    const read = profileRead(row.profile, row.tickets, {
      letter: row.letter,
      sport,
      id: row.id || null,
      bets: row.bets || null,
    });
    const sportBook = (read.sports || []).find((item) => item.sport === sport);
    const sportRate = wr(sportBook);
    const overallRate = wr(read.overall);
    if (sportRate == null || overallRate == null) continue;
    const gap = Math.round((sportRate - overallRate) * 1000) / 10;
    const bettingBig = (row.tickets || []).some((t) => t.size === '1.5x and up' || (Number(t.vsUsual) || 0) >= 1.5);
    ranked.push({
      id: row.id || null,
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
  sizeLabel,
  MIN_COMPARE,
};

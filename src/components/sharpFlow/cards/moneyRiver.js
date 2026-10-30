/**
 * Display model for the locked money river.
 * Counts, records, and dollars come from the wallets already on the card.
 * A pooled win rate is shown only when every sharp on our side has a record.
 * Win, record, and profit come from each sharp's Source B book.
 * L30 ROI is that same book's last-30-day dollar ROI, stake-weighted
 * by this play. A stat is omitted unless every sharp on our side has it.
 * The wallet line prints those same three figures. The dots are the
 * graded bets behind that window, oldest first.
 */
import { HC_RATIO } from '../../../lib/ags.js';
import { ourSideLabel, theirSideLabel } from './boardFaceLine.js';

const ROW_H = 32;
const NODE_GAP = 8;
const RIBBON_GAP = 2;
const SHARP_CAP = 4;
const OPP_CAP = 2;
const LOSER_CAP = 3;

export function fmtRiverUsd(v) {
  const n = Math.round(Number(v) || 0);
  if (Math.abs(n) >= 1000) {
    const k = n / 1000;
    const body = Math.abs(k) >= 100 || Math.abs(k - Math.round(k)) < 0.05
      ? String(Math.round(k))
      : k.toFixed(1);
    return `$${body}K`;
  }
  return `$${n}`;
}

export function walletRecord(w) {
  const from = (s) => {
    const m = String(s || '').trim().match(/^(\d+)\s*-\s*(\d+)/);
    if (!m) return null;
    const wins = Number(m[1]);
    const losses = Number(m[2]);
    if (wins + losses <= 0) return null;
    return { wins, losses, label: `${wins}-${losses}` };
  };
  const trust = w?.trust || {};
  const secondary = Array.isArray(trust.secondary)
    ? trust.secondary.map(from).find(Boolean)
    : null;
  if (secondary) return secondary;
  const trustRec = from(trust.record);
  if (trustRec) return trustRec;
  const own = from(w?.record);
  if (own) return own;
  if (Number.isFinite(w?.wins) && Number.isFinite(w?.losses) && (w.wins + w.losses) > 0) {
    return { wins: w.wins, losses: w.losses, label: `${w.wins}-${w.losses}` };
  }
  return null;
}

function isWinnerPool(w) {
  if (!w) return false;
  if (w.whitelisted === true) return true;
  const t = String(w.whitelist || '').toUpperCase();
  return t === 'CONFIRMED' || t === 'FLAT';
}

function isLoser(w) {
  return !!w && (Number(w.invested) || 0) > 0 && !isWinnerPool(w);
}

function isSharp(w) {
  if (!w || isLoser(w)) return false;
  if (String(w.whitelist || '').toUpperCase() === 'CONFIRMED') return true;
  return !!w.proven;
}

function shortId(w) {
  return String(w?.short || w?.wallet || '').slice(-6).toLowerCase();
}

function poolOf(f) {
  const profiles = new Map();
  for (const w of (Array.isArray(f?.wallets) ? f.wallets : [])) {
    const id = shortId(w);
    if (id) profiles.set(id, w);
  }
  const source = (Array.isArray(f?.mapWallets) && f.mapWallets.length)
    ? f.mapWallets
    : (Array.isArray(f?.wallets) ? f.wallets : []);
  return source
    .filter((w) => (Number(w?.invested) || 0) > 0)
    .map((w) => {
      const profile = profiles.get(shortId(w));
      const ratio = Number(w?.displaySizeRatio ?? w?.sizeRatio);
      const profileRatio = Number(profile?.displaySizeRatio ?? profile?.sizeRatio);
      return {
        ...(profile || {}),
        ...w,
        short: String(w.short || w.wallet || profile?.short || '').slice(-6),
        side: w.side === 'against' ? 'against' : 'ours',
        trust: w.trust || profile?.trust || null,
        record: w.record || profile?.record || null,
        wins: Number.isFinite(w?.wins) ? w.wins : profile?.wins,
        losses: Number.isFinite(w?.losses) ? w.losses : profile?.losses,
        sizeRatio: Number.isFinite(ratio) ? ratio : (Number.isFinite(profileRatio) ? profileRatio : null),
        trustScore: Number(w?.trustScore) || Number(profile?.trustScore) || 0,
        roi: Number.isFinite(w?.roi) ? w.roi : (Number.isFinite(profile?.roi) ? profile.roi : null),
        dollarRoi: Number.isFinite(w?.dollarRoi) ? w.dollarRoi : (Number.isFinite(profile?.dollarRoi) ? profile.dollarRoi : null),
        bookPnl: Number.isFinite(w?.bookPnl) ? w.bookPnl : (Number.isFinite(profile?.bookPnl) ? profile.bookPnl : null),
        l30Roi: Number.isFinite(w?.l30Roi) ? w.l30Roi : (Number.isFinite(profile?.l30Roi) ? profile.l30Roi : null),
        recent: Array.isArray(w?.recent) && w.recent.length
          ? w.recent
          : (Array.isArray(profile?.recent) ? profile.recent : null),
        proven: w.proven ?? profile?.proven ?? false,
        whitelist: w.whitelist || profile?.whitelist || null,
        whitelisted: w.whitelisted ?? profile?.whitelisted ?? false,
        invested: Number(w.invested) || 0,
      };
    });
}

function kindOf(w) {
  if (isLoser(w)) return 'loser';
  if (!isSharp(w)) return null;
  if (w.side !== 'against' && Number.isFinite(w.sizeRatio) && w.sizeRatio >= HC_RATIO) return 'hc';
  if (w.side === 'against') return 'opp';
  return 'sharp';
}

function byStake(a, b) {
  return (b.invested || 0) - (a.invested || 0);
}

function cap(list, n) {
  const sorted = list.slice().sort(byStake);
  return { shown: sorted.slice(0, n), hidden: sorted.slice(n) };
}

function walletRoi(w) {
  if (Number.isFinite(w?.roi)) return w.roi;
  if (Number.isFinite(w?.dollarRoi)) return w.dollarRoi;
  return null;
}

export function fmtRoi(n) {
  const rounded = Math.round(Number(n) * 10) / 10;
  if (!Number.isFinite(rounded)) return null;
  const body = Math.abs(rounded - Math.round(rounded)) < 0.05
    ? String(Math.round(rounded))
    : rounded.toFixed(1);
  return `${rounded > 0 ? '+' : ''}${body}%`;
}

export function fmtSignedUsd(v) {
  const n = Math.round(Number(v) || 0);
  const body = fmtRiverUsd(Math.abs(n));
  if (n > 0) return `+${body}`;
  if (n < 0) return `-${body}`;
  return body;
}

/** The book the strip adds up. Wins and losses beat a trust caption. */
function proofRecord(w) {
  const wins = Number(w?.wins);
  const losses = Number(w?.losses);
  if (Number.isFinite(w?.wins) && Number.isFinite(w?.losses) && (wins + losses) > 0) {
    return { wins, losses, label: `${wins}-${losses}` };
  }
  return walletRecord(w);
}

function rowLine(w, rec) {
  const profit = Number.isFinite(w?.bookPnl) ? fmtSignedUsd(w.bookPnl) : null;
  const stake = w?.invested ? fmtRiverUsd(w.invested) : null;
  return [
    rec?.label ? rec.label.replace('-', '\u2013') : null,
    Number.isFinite(w?.l30Roi) ? fmtRoi(w.l30Roi) : null,
    profit || stake,
  ].filter(Boolean).join(' \u00b7 ');
}

function rowFrom(w, kind) {
  const rec = proofRecord(w);
  return {
    key: `${kind}-${w.side}-${w.short}`,
    short: w.short,
    side: w.side === 'against' ? 'against' : 'ours',
    kind,
    invested: w.invested,
    record: rec?.label || null,
    l30Roi: Number.isFinite(w?.l30Roi) ? w.l30Roi : null,
    bookPnl: Number.isFinite(w?.bookPnl) ? w.bookPnl : null,
    roi: walletRoi(w),
    meta: rowLine(w, rec),
    more: 0,
  };
}

function moreRow(side, kind, hidden) {
  if (!hidden.length) return null;
  const invested = hidden.reduce((s, w) => s + (Number(w.invested) || 0), 0);
  return {
    key: `more-${side}-${kind}`,
    short: null,
    side,
    kind,
    invested,
    record: null,
    roi: null,
    more: hidden.length,
  };
}

function stampSide(split, side) {
  if (!split) return 0;
  const n = Number(side === 'against' ? split.theirs : split.ours);
  return Number.isFinite(n) ? n : 0;
}

function placeRibbons(group) {
  const stack = group.list.reduce((s, r) => s + r.thick, 0) + Math.max(0, group.list.length - 1) * RIBBON_GAP;
  let y = group.top + (group.nodeH - stack) / 2;
  for (const row of group.list) {
    row.targetY = y + row.thick / 2;
    y += row.thick + RIBBON_GAP;
  }
}

/**
 * Sankey geometry. Stake sets the thickness. Each side is one block: the
 * rows and the destination share a center, so a single wallet meets its
 * pile in a straight line and a cluster fans into it.
 */
export function layoutRiver(rows, { rowH = ROW_H, minH = {} } = {}) {
  const tagged = rows.map((r) => ({ ...r }));
  const groups = [
    { side: 'ours', list: tagged.filter((r) => r.side !== 'against') },
    { side: 'against', list: tagged.filter((r) => r.side === 'against') },
  ].filter((g) => g.list.length);
  if (!tagged.length) {
    return { rows: tagged, height: rowH, ourBox: null, theirBox: null };
  }

  const maxInv = Math.max(1, ...tagged.map((r) => r.invested || 0));
  for (const row of tagged) {
    const t = Math.max(0, row.invested || 0) / maxInv;
    row.thick = 2.4 + Math.pow(t, 0.75) * 14;
  }

  let cursor = 0;
  for (const group of groups) {
    const gaps = Math.max(0, group.list.length - 1) * RIBBON_GAP;
    const sum = group.list.reduce((s, r) => s + r.thick, 0);
    const maxStack = 34;
    if (sum + gaps > maxStack) {
      const scale = (maxStack - gaps) / sum;
      group.list.forEach((r) => { r.thick *= scale; });
    }
    const stack = group.list.reduce((s, r) => s + r.thick, 0) + gaps;
    const rowsH = group.list.length * rowH;
    const wanted = Math.max(minH[group.side] || 54, Math.ceil(stack + 16));
    const blockH = Math.max(rowsH, wanted);
    group.nodeH = wanted;
    const mid = cursor + blockH / 2;
    group.top = mid - group.nodeH / 2;
    const span = (group.list.length - 1) * rowH;
    const first = mid - span / 2;
    group.list.forEach((row, i) => { row.y = first + i * rowH; });
    cursor += blockH + NODE_GAP;
  }

  for (const group of groups) placeRibbons(group);

  const height = Math.max(cursor - NODE_GAP, rowH);
  const box = (side) => {
    const group = groups.find((g) => g.side === side);
    return group ? { top: group.top, height: group.nodeH } : null;
  };
  return { rows: tagged, height, ourBox: box('ours'), theirBox: box('against') };
}

/** Newest graded bets across our sharps, oldest on the left. No invented order. */
export function chronoDots(sharps) {
  const legs = [];
  for (const w of sharps) {
    const tape = Array.isArray(w?.recent) ? w.recent : [];
    for (const leg of tape) {
      const won = leg?.won === 1 || leg?.won === true ? 1
        : leg?.won === 0 || leg?.won === false ? 0
        : null;
      if (won == null) continue;
      legs.push({ date: leg?.date ? String(leg.date) : '', won });
    }
  }
  if (legs.length < 2) return null;
  legs.sort((a, b) => a.date.localeCompare(b.date));
  return legs.slice(-20).map((leg) => (leg.won === 1 ? 'win' : 'loss'));
}

function winLabel(wins, losses) {
  const decided = wins + losses;
  if (decided <= 0) return null;
  const pct = Math.round((wins / decided) * 1000) / 10;
  return Number.isInteger(pct) ? String(pct) : pct.toFixed(1);
}

function pooled(sharps) {
  if (sharps.length < 2) return null;
  const books = sharps.map(proofRecord);
  if (books.some((b) => !b)) return null;
  const wins = books.reduce((s, b) => s + b.wins, 0);
  const losses = books.reduce((s, b) => s + b.losses, 0);
  const label = winLabel(wins, losses);
  if (!label) return null;
  return { wins, losses, label, record: `${wins}\u2013${losses}` };
}

function displaySide(f, which) {
  const label = which === 'against' ? theirSideLabel(f) : ourSideLabel(f);
  if (which === 'ours' && label === 'our side') {
    const pick = String(f?.pickLabel || '').replace(/\s+ML$/i, '').trim();
    if (pick && !/^(over|under)\b/i.test(pick)) {
      const nick = pick.split(/\s+/).filter(Boolean).pop();
      if (nick) return nick;
    }
  }
  return label;
}

function dashRecord(rec) {
  return rec ? rec.label.replace('-', '\u2013') : null;
}

/** Book profit, summed. Null unless every sharp on our side has one. */
function combinedProfit(sharps) {
  if (!sharps.length) return null;
  const books = sharps.map((w) => (Number.isFinite(w?.bookPnl) ? w.bookPnl : null));
  if (books.some((n) => n == null)) return null;
  return fmtSignedUsd(books.reduce((s, n) => s + n, 0));
}

/** Stake-weighted L30 ROI. Null unless every sharp on our side has one. */
function combinedL30(sharps) {
  if (!sharps.length) return null;
  const books = sharps.map((w) => {
    if (!Number.isFinite(w?.l30Roi)) return null;
    return { roi: w.l30Roi, invested: Math.max(0, Number(w.invested) || 0) };
  });
  if (books.some((b) => !b)) return null;
  const stake = books.reduce((s, b) => s + b.invested, 0);
  if (stake <= 0) return null;
  return fmtRoi(books.reduce((s, b) => s + b.roi * b.invested, 0) / stake);
}

/** Pill height the river must reserve so the destination copy fits. */
function pillBlock(p) {
  if (!p?.lines?.length) return 54;
  const body = p.lines.reduce((sum, line) => {
    if (line.tone === 'quiet') return sum + (line.caption ? 24 : 13);
    return sum + (line.caption ? 28 : 17);
  }, 0);
  return Math.max(56, 28 + body + p.lines.length);
}

function pill(side, title, sharpUsd, loserUsd, sharpPct, loserPct) {
  const lines = [];
  if (side !== 'against' && sharpUsd > 0) {
    lines.push({ text: fmtRiverUsd(sharpUsd), caption: null, tone: 'sharp' });
    if (sharpPct != null) lines.push({ text: `${sharpPct}%`, caption: 'of sharp money', tone: 'quiet' });
    if (loserUsd > 0) lines.push({ text: fmtRiverUsd(loserUsd), caption: 'losers', tone: 'loser' });
  } else if (sharpUsd > 0 && loserUsd > 0) {
    lines.push({ text: fmtRiverUsd(sharpUsd), caption: 'sharp', tone: 'sharp' });
    lines.push({ text: fmtRiverUsd(loserUsd), caption: 'losers', tone: 'loser' });
  } else if (sharpUsd > 0) {
    lines.push({ text: fmtRiverUsd(sharpUsd), caption: null, tone: 'sharp' });
    if (sharpPct != null) lines.push({ text: `${sharpPct}%`, caption: 'of sharp money', tone: 'quiet' });
  } else if (loserUsd > 0) {
    lines.push({ text: fmtRiverUsd(loserUsd), caption: null, tone: 'loser' });
    if (loserPct != null) lines.push({ text: `${loserPct}%`, caption: 'of loser money', tone: 'quiet' });
  } else {
    return null;
  }
  const tone = loserUsd > sharpUsd ? 'fade' : (side === 'against' ? 'opp' : 'ours');
  return { side, title: String(title || '').toUpperCase(), lines, tone, sharpUsd, loserUsd };
}

/**
 * @returns {object|null}
 */
export function buildMoneyRiver(f) {
  if (!f) return null;
  const all = poolOf(f).map((w) => ({ ...w, kind: kindOf(w) })).filter((w) => w.kind);
  const ourHc = all.filter((w) => w.kind === 'hc');
  const ourSharp = all.filter((w) => w.kind === 'sharp');
  const ourLosers = all.filter((w) => w.kind === 'loser' && w.side !== 'against');
  const opp = all.filter((w) => w.kind === 'opp');
  const theirLosers = all.filter((w) => w.kind === 'loser' && w.side === 'against');

  const sharps = [...ourHc, ...ourSharp];
  const hcShown = cap(ourHc, Math.min(SHARP_CAP, ourHc.length));
  const sharpRoom = Math.max(0, SHARP_CAP - hcShown.shown.length);
  const sharpShown = cap(ourSharp, sharpRoom);
  const loserRoom = theirLosers.length ? 1 : 2;
  const ourLoserShown = cap(ourLosers, loserRoom);
  const oppShown = cap(opp, OPP_CAP);
  const theirLoserShown = cap(theirLosers, LOSER_CAP);

  const rows = [
    ...hcShown.shown.sort(byStake).map((w) => rowFrom(w, 'hc')),
    ...sharpShown.shown.sort(byStake).map((w) => rowFrom(w, 'sharp')),
    ...ourLoserShown.shown.sort(byStake).map((w) => rowFrom(w, 'loser')),
    moreRow('ours', ourLoserShown.hidden.length ? 'loser' : 'sharp', [
      ...hcShown.hidden, ...sharpShown.hidden, ...ourLoserShown.hidden,
    ]),
    ...oppShown.shown.sort(byStake).map((w) => rowFrom(w, 'opp')),
    ...theirLoserShown.shown.sort(byStake).map((w) => rowFrom(w, 'loser')),
    moreRow('against', theirLoserShown.hidden.length || theirLosers.length ? 'loser' : 'opp', [
      ...oppShown.hidden, ...theirLoserShown.hidden,
    ]),
  ].filter(Boolean);

  const sum = (list) => list.reduce((s, w) => s + (Number(w.invested) || 0), 0);
  const ourSharpUsd = sum(sharps);
  const theirSharpUsd = sum(opp);
  const sharpTotal = ourSharpUsd + theirSharpUsd;
  const ourLoserUsd = Math.max(sum(ourLosers), stampSide(f?.boardMoneyLosers || f?.boardMoney?.losers, 'ours'));
  const theirLoserUsd = Math.max(sum(theirLosers), stampSide(f?.boardMoneyLosers || f?.boardMoney?.losers, 'against'));
  const loserTotal = ourLoserUsd + theirLoserUsd;
  const sharpPct = (usd) => (sharpTotal > 0 ? Math.round((usd / sharpTotal) * 100) : null);
  const loserPct = (usd) => (loserTotal > 0 ? Math.round((usd / loserTotal) * 100) : null);

  const bookGap = (side, kind, walletUsd, bookUsd) => {
    const gap = Math.round(bookUsd - walletUsd);
    if (gap < 50) return null;
    const row = rows.find((r) => r.side === side && r.more > 0 && r.kind === kind);
    if (row) {
      row.invested += gap;
      return null;
    }
    return {
      key: `book-${side}-${kind}`,
      short: null,
      side,
      kind,
      invested: gap,
      record: null,
      more: 0,
      book: true,
    };
  };

  const extra = [
    bookGap('ours', 'loser', sum(ourLosers), ourLoserUsd),
    bookGap('against', 'loser', sum(theirLosers), theirLoserUsd),
  ].filter(Boolean);
  // Book remainder sits with the side it belongs to, just before the other side.
  const withBook = [];
  let placedOurs = false;
  for (const row of rows) {
    if (!placedOurs && row.side === 'against') {
      withBook.push(...extra.filter((r) => r.side === 'ours'));
      placedOurs = true;
    }
    withBook.push(row);
  }
  if (!placedOurs) withBook.push(...extra.filter((r) => r.side === 'ours'));
  withBook.push(...extra.filter((r) => r.side === 'against'));

  const pool = pooled(sharps);
  const n = sharps.length;
  const solo = n === 1 ? proofRecord(sharps[0]) : null;
  const winPct = pool?.label || (solo ? winLabel(solo.wins, solo.losses) : null);
  const l30 = combinedL30(sharps);
  const profit = combinedProfit(sharps);
  const recordValue = pool ? pool.record : (solo ? dashRecord(solo) : null);
  const tone = (text) => (String(text).startsWith('-') ? 'loss' : 'plain');
  const stats = [
    winPct ? { value: `${winPct}%`, label: 'Win', tone: 'plain' } : null,
    l30 ? { value: l30, label: 'L30 ROI', tone: tone(l30) } : null,
    profit ? { value: profit, label: 'Profit', tone: tone(profit) } : null,
    recordValue ? { value: recordValue, label: 'Record', tone: 'plain' } : null,
  ].filter(Boolean);
  const dots = chronoDots(sharps);
  const panel = n > 0 && (stats.length || dots) ? {
    eyebrow: 'Combined',
    stats,
    dots,
    dotLabel: dots ? `Last ${dots.length}` : null,
  } : null;

  const oursName = displaySide(f, 'ours');
  const theirsName = displaySide(f, 'against');
  const ourPill = pill('ours', oursName, ourSharpUsd, ourLoserUsd, sharpPct(ourSharpUsd), loserPct(ourLoserUsd));
  const theirPill = pill('against', theirsName, theirSharpUsd, theirLoserUsd, sharpPct(theirSharpUsd), loserPct(theirLoserUsd));
  const laid = layoutRiver(withBook, {
    minH: { ours: pillBlock(ourPill), against: pillBlock(theirPill) },
  });
  if (!laid.rows.length && ourSharpUsd <= 0 && theirSharpUsd <= 0 && loserTotal <= 0) return null;

  return {
    panel,
    rows: laid.rows,
    height: laid.height,
    ourBox: laid.ourBox,
    theirBox: laid.theirBox,
    ourPill,
    theirPill,
  };
}

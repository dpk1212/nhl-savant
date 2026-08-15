/**
 * Pinnacle steam — same units as pinnapi `drop_pct` and ClosingDime / SharpMoney
 * "X% in the last hour".
 *
 * dropPct = (fromDec − toDec) / fromDec × 100 when the price shortens.
 * Positive = steam toward this side (favorite getting more expensive).
 *
 * Quant floors (sharp-book, not retail juice):
 *   2.0%  WATCH  — noise / juice; stored, not painted
 *   3.0%  STEAM  — pinnapi default min_drop; a real event
 *   4.5%  GOLD   — ClosingDime gold-card (~4.75% last hour)
 * Gold + rising limits = the Yankees-ML combo (limits explode while price drops).
 */

import { linesClose } from './pinnacleMain.js';

export const STEAM_WATCH_PCT = 2;
export const STEAM_EVENT_PCT = 3;
export const STEAM_GOLD_PCT = 4.5;
export const STEAM_HOUR_SEC = 3600;
export const STEAM_LIMIT_RISE_USD = 2000;
export const STEAM_LIMIT_RISE_MULT = 1.45;

export function americanToDecimal(american) {
  const a = Number(american);
  if (!Number.isFinite(a) || a === 0) return null;
  if (a > 0) return 1 + a / 100;
  return 1 + 100 / Math.abs(a);
}

/** Positive = this side shortened (steam on). */
export function decimalDropPct(fromAmerican, toAmerican) {
  const from = americanToDecimal(fromAmerican);
  const to = americanToDecimal(toAmerican);
  if (from == null || to == null || from <= 1) return null;
  return +(((from - to) / from) * 100).toFixed(2);
}

export function steamTierFromPct(dropPct) {
  const p = Number(dropPct);
  if (!Number.isFinite(p) || p < STEAM_WATCH_PCT) return null;
  if (p >= STEAM_GOLD_PCT) return 'gold';
  if (p >= STEAM_EVENT_PCT) return 'steam';
  return 'watch';
}

function histMax(h, marketType) {
  if (!h || typeof h !== 'object') return null;
  const mt = String(marketType || 'ml').toLowerCase();
  if (mt === 'total') return h.maxTotal ?? h.max ?? null;
  if (mt === 'spread') return h.maxSpread ?? h.max ?? null;
  return h.maxMoneyLine ?? h.max ?? null;
}

function spreadRowOnTicketLine(row, sideIsAway, line) {
  if (!row || !Number.isFinite(Number(line))) return false;
  const ln = sideIsAway ? Number(row.awayLine) : Number(row.homeLine);
  return linesClose(ln, line);
}

function marketHist(pinnGame, marketType) {
  const mt = String(marketType || 'ml').toLowerCase();
  if (mt === 'total') return Array.isArray(pinnGame?.totalHistory) ? pinnGame.totalHistory : [];
  if (mt === 'spread') return Array.isArray(pinnGame?.spreadHistory) ? pinnGame.spreadHistory : [];
  return Array.isArray(pinnGame?.history) ? pinnGame.history : [];
}

function oddsAt(h, { isTotal, isSpread, sideIsAway, pickDraw }) {
  if (!h) return null;
  if (isTotal) return sideIsAway ? h.underOdds : h.overOdds;
  if (isSpread) return sideIsAway ? h.awayOdds : h.homeOdds;
  if (pickDraw) return Number.isFinite(h.draw) ? h.draw : null;
  return sideIsAway ? h.away : h.home;
}

function filterHist(hist, { isTotal, isSpread, sideIsAway, line }) {
  if (isTotal && Number.isFinite(line)) {
    return hist.filter((h) => Math.abs(Number(h.line) - Number(line)) <= 0.051);
  }
  if (isSpread && Number.isFinite(line)) {
    return hist.filter((h) => spreadRowOnTicketLine(h, sideIsAway, line));
  }
  return hist;
}

function wantMarket(marketType) {
  const mt = String(marketType || 'ml').toLowerCase();
  if (mt === 'total') return 'total';
  if (mt === 'spread') return 'spread';
  return 'ml';
}

function wantSide(marketType, sideNorm) {
  const mt = String(marketType || 'ml').toLowerCase();
  const s = String(sideNorm || '').toLowerCase();
  if (mt === 'total') return (s === 'away' || s === 'under') ? 'under' : 'over';
  if (s === 'away') return 'away';
  if (s === 'draw') return 'draw';
  return 'home';
}

export function matchSteamDrops(drops, {
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
  minDropPct = STEAM_EVENT_PCT,
  sinceSec = null,
  untilSec = null,
} = {}) {
  if (!Array.isArray(drops) || !drops.length) return [];
  const wantMkt = wantMarket(marketType);
  const side = wantSide(marketType, sideNorm);
  const out = [];
  for (const d of drops) {
    if (!d || d.market !== wantMkt || d.side !== side) continue;
    if (!(Number(d.dropPct) >= minDropPct)) continue;
    if (Number.isFinite(sinceSec) && Number.isFinite(d.t) && d.t < sinceSec) continue;
    if (Number.isFinite(untilSec) && Number.isFinite(d.t) && d.t > untilSec) continue;
    if (wantMkt !== 'ml' && Number.isFinite(line) && Number.isFinite(d.points)
        && Math.abs(d.points - line) > 0.051) {
      continue;
    }
    out.push(d);
  }
  return out.sort((a, b) => (a.t || 0) - (b.t || 0));
}

/** Epoch seconds. Accepts ms, sec, or ISO / Date-parseable commence. */
export function commenceSecOf(raw) {
  if (raw == null || raw === '') return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw > 1e12 ? Math.floor(raw / 1000) : Math.floor(raw);
  }
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
}

function windowStats(matched, sinceSec) {
  const inWin = Number.isFinite(sinceSec)
    ? matched.filter((d) => Number.isFinite(d.t) && d.t >= sinceSec)
    : matched;
  let maxDrop = null;
  let last = null;
  for (const d of inWin) {
    const p = Number(d.dropPct);
    if (!Number.isFinite(p)) continue;
    if (maxDrop == null || p > maxDrop) maxDrop = p;
    last = d;
  }
  return {
    count: inWin.length,
    maxDrop: maxDrop == null ? null : +Number(maxDrop).toFixed(2),
    fromOdds: last?.fromOdds ?? null,
    toOdds: last?.toOdds ?? null,
  };
}

function limitRisingOf(maxOpen, maxNow) {
  if (!Number.isFinite(maxOpen) || !Number.isFinite(maxNow) || maxOpen <= 0) return false;
  return (maxNow - maxOpen) >= STEAM_LIMIT_RISE_USD || maxNow >= maxOpen * STEAM_LIMIT_RISE_MULT;
}

function emptyWindow() {
  return { dropPct: null, count: 0, maxDrop: null, fromOdds: null, toOdds: null, shortSession: false };
}

/**
 * Live steam summary for one ticket side.
 * Tape → last-hour / since-open %. Drops API → event counts.
 */
export function summarizeSteam(pinnGame, {
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
  nowSec = Math.floor(Date.now() / 1000),
  freezeAtMs = null,
} = {}) {
  const empty = {
    lastHour: emptyWindow(),
    sinceOpen: emptyWindow(),
    tier: null,
    show: false,
    goldConfirmed: false,
    limitRising: false,
    tag: null,
    tagShort: null,
    tip: null,
    at: nowSec,
  };
  if (!pinnGame) return empty;

  const commenceSec = commenceSecOf(freezeAtMs)
    ?? commenceSecOf(pinnGame.commence)
    ?? commenceSecOf(pinnGame.commenceTime)
    ?? commenceSecOf(pinnGame.starts);
  const frozen = Number.isFinite(commenceSec) && nowSec >= commenceSec;
  if (frozen) nowSec = commenceSec;

  const mt = String(marketType || 'ml').toLowerCase();
  const isTotal = mt === 'total';
  const isSpread = mt === 'spread';
  const sideIsAway = sideNorm === 'away' || sideNorm === 'under' || sideNorm === 'draw';
  const pickDraw = sideNorm === 'draw';
  const ctx = { isTotal, isSpread, sideIsAway, pickDraw };

  // Alt lines live in the same history bag — never compare 7.5 vs 9.5.
  let pinLine = Number.isFinite(line) ? Number(line) : null;
  if (pinLine == null && isTotal) {
    pinLine = Number.isFinite(Number(pinnGame.totalCurrent?.line))
      ? Number(pinnGame.totalCurrent.line)
      : (Number.isFinite(Number(pinnGame.fairTotal?.line)) ? Number(pinnGame.fairTotal.line) : null);
  }
  if (pinLine == null && isSpread) {
    const sc = pinnGame.spreadCurrent;
    pinLine = sideIsAway
      ? (Number.isFinite(Number(sc?.awayLine)) ? Number(sc.awayLine) : null)
      : (Number.isFinite(Number(sc?.homeLine)) ? Number(sc.homeLine) : null);
    if (pinLine == null && pinnGame.fairSpread) {
      pinLine = sideIsAway
        ? (Number.isFinite(Number(pinnGame.fairSpread.awayLine)) ? Number(pinnGame.fairSpread.awayLine) : null)
        : (Number.isFinite(Number(pinnGame.fairSpread.homeLine)) ? Number(pinnGame.fairSpread.homeLine) : null);
    }
  }

  let hist = filterHist(marketHist(pinnGame, mt), {
    isTotal, isSpread, sideIsAway, line: pinLine,
  });
  if (frozen) {
    hist = hist.filter((h) => !Number.isFinite(h?.t) || h.t <= nowSec);
  }
  const hourAgo = nowSec - STEAM_HOUR_SEC;

  let openOdds = hist.length ? oddsAt(hist[0], ctx) : null;
  let nowOdds = hist.length ? oddsAt(hist[hist.length - 1], ctx) : null;
  let hourOdds = null;
  let hourPointT = null;
  let maxOpen = null;
  let maxNow = null;

  for (const h of hist) {
    const mx = Number(histMax(h, mt));
    if (Number.isFinite(mx) && mx > 0) {
      if (maxOpen == null) maxOpen = mx;
      maxNow = mx;
    }
    if (Number.isFinite(h?.t) && h.t <= hourAgo) {
      const o = oddsAt(h, ctx);
      if (Number.isFinite(o)) {
        hourOdds = o;
        hourPointT = h.t;
      }
    }
  }

  const pinnedToLine = (isTotal || isSpread) && Number.isFinite(pinLine);
  if (!pinnedToLine) {
    if (openOdds == null) {
      if (isTotal) openOdds = pinnGame.totalOpener
        ? (sideIsAway ? pinnGame.totalOpener.underOdds : pinnGame.totalOpener.overOdds)
        : null;
      else if (isSpread) openOdds = pinnGame.spreadOpener
        ? (sideIsAway ? pinnGame.spreadOpener.awayOdds : pinnGame.spreadOpener.homeOdds)
        : null;
      else {
        const op = pinnGame.opener;
        openOdds = op ? (pickDraw ? op.draw : sideIsAway ? op.away : op.home) : null;
      }
    }
    if (nowOdds == null && !frozen) {
      if (isTotal) nowOdds = pinnGame.totalCurrent
        ? (sideIsAway ? pinnGame.totalCurrent.underOdds : pinnGame.totalCurrent.overOdds)
        : null;
      else if (isSpread) nowOdds = pinnGame.spreadCurrent
        ? (sideIsAway ? pinnGame.spreadCurrent.awayOdds : pinnGame.spreadCurrent.homeOdds)
        : null;
      else {
        const cur = pinnGame.current;
        nowOdds = cur ? (pickDraw ? cur.draw : sideIsAway ? cur.away : cur.home) : null;
      }
    }
    if (maxNow == null && !frozen) {
      maxNow = isTotal
        ? (pinnGame.maxTotal ?? pinnGame.totalCurrent?.max ?? null)
        : isSpread
          ? (pinnGame.maxSpread ?? pinnGame.spreadCurrent?.max ?? null)
          : (pinnGame.maxMoneyLine ?? pinnGame.max ?? null);
    }
    if (maxOpen == null) {
      maxOpen = isTotal
        ? (pinnGame.totalOpener?.max ?? null)
        : isSpread
          ? (pinnGame.spreadOpener?.max ?? null)
          : (pinnGame.opener?.max ?? null);
    }
  }

  const shortSession = hourOdds == null && hist.length >= 1;
  if (hourOdds == null) hourOdds = openOdds;

  const sinceOpenPct = decimalDropPct(openOdds, nowOdds);
  const lastHourPct = decimalDropPct(hourOdds, nowOdds);

  const matched = matchSteamDrops(pinnGame.steamDrops, {
    marketType: mt,
    sideNorm,
    line: pinLine,
    minDropPct: STEAM_EVENT_PCT,
    untilSec: frozen ? nowSec : null,
  });
  const hourDrops = windowStats(matched, hourAgo);
  const openDrops = windowStats(matched, null);

  const lastHour = {
    dropPct: lastHourPct,
    count: hourDrops.count,
    maxDrop: hourDrops.maxDrop,
    fromOdds: Number.isFinite(hourOdds) ? hourOdds : hourDrops.fromOdds,
    toOdds: Number.isFinite(nowOdds) ? nowOdds : hourDrops.toOdds,
    shortSession,
    fromT: hourPointT,
  };
  const sinceOpen = {
    dropPct: sinceOpenPct,
    count: openDrops.count,
    maxDrop: openDrops.maxDrop,
    fromOdds: Number.isFinite(openOdds) ? openOdds : openDrops.fromOdds,
    toOdds: Number.isFinite(nowOdds) ? nowOdds : openDrops.toOdds,
    shortSession: false,
  };

  const limitRising = limitRisingOf(maxOpen, maxNow);
  const displayPct = Number.isFinite(lastHourPct) && lastHourPct >= STEAM_WATCH_PCT
    ? lastHourPct
    : (Number.isFinite(sinceOpenPct) && sinceOpenPct >= STEAM_WATCH_PCT ? sinceOpenPct : null);
  const peakPct = Math.max(
    Number.isFinite(lastHourPct) ? lastHourPct : -Infinity,
    Number.isFinite(sinceOpenPct) ? sinceOpenPct : -Infinity,
    Number.isFinite(hourDrops.maxDrop) ? hourDrops.maxDrop : -Infinity,
  );
  const hasEvent = hourDrops.count >= 1 || openDrops.count >= 1
    || (Number.isFinite(peakPct) && peakPct >= STEAM_EVENT_PCT);

  let tier = null;
  if (Number.isFinite(lastHourPct) && lastHourPct >= STEAM_GOLD_PCT) tier = 'gold';
  else if (hasEvent || (Number.isFinite(lastHourPct) && lastHourPct >= STEAM_EVENT_PCT)
    || (Number.isFinite(sinceOpenPct) && sinceOpenPct >= STEAM_EVENT_PCT)) {
    tier = 'steam';
  } else if (Number.isFinite(displayPct) && displayPct >= STEAM_WATCH_PCT) {
    tier = 'watch';
  }

  const goldConfirmed = tier === 'gold' && limitRising;
  const show = tier === 'gold' || tier === 'steam';
  const window = Number.isFinite(lastHourPct) && lastHourPct >= STEAM_EVENT_PCT
    ? (shortSession ? 'open' : '1h')
    : (Number.isFinite(sinceOpenPct) && sinceOpenPct >= STEAM_EVENT_PCT ? 'open' : (shortSession ? 'open' : '1h'));
  const pct = Number.isFinite(lastHourPct) && lastHourPct >= STEAM_WATCH_PCT
    ? lastHourPct
    : (Number.isFinite(sinceOpenPct) ? sinceOpenPct : hourDrops.maxDrop);
  const count = window === '1h' ? hourDrops.count : openDrops.count;

  let tag = null;
  let tagShort = null;
  if (show && Number.isFinite(pct) && pct > 0) {
    const pctTxt = `${pct.toFixed(1)}%`;
    if (goldConfirmed) {
      tag = `GOLD ${pctTxt}`;
      tagShort = `GOLD ${pctTxt}`;
    } else if (tier === 'gold') {
      tag = `${pctTxt} ${window}`;
      tagShort = pctTxt;
    } else if (count >= 2) {
      tag = `${count}× ${pctTxt}`;
      tagShort = `${count}×`;
    } else {
      tag = `${pctTxt} ${window}`;
      tagShort = pctTxt;
    }
  }

  const tipBits = [];
  if (Number.isFinite(lastHourPct)) tipBits.push(`last hour ${lastHourPct >= 0 ? '+' : ''}${lastHourPct.toFixed(1)}%`);
  if (Number.isFinite(sinceOpenPct)) tipBits.push(`since open ${sinceOpenPct >= 0 ? '+' : ''}${sinceOpenPct.toFixed(1)}%`);
  if (hourDrops.count) tipBits.push(`${hourDrops.count} steam print${hourDrops.count === 1 ? '' : 's'} (1h)`);
  if (limitRising) tipBits.push('limits rising');
  const tip = tipBits.length
    ? `Pinnacle steam · ${tipBits.join(' · ')}`
    : 'Pinnacle steam';

  return {
    lastHour,
    sinceOpen,
    tier,
    show,
    goldConfirmed,
    limitRising,
    tag,
    tagShort,
    tip,
    at: nowSec,
    frozen,
    maxOpen: Number.isFinite(maxOpen) ? maxOpen : null,
    maxNow: Number.isFinite(maxNow) ? maxNow : null,
  };
}

/** Compact Firestore / tabSnapshot stamp. */
export function compactSteam(summary) {
  if (!summary || !summary.tier) return null;
  return {
    lastHourPct: Number.isFinite(summary.lastHour?.dropPct) ? summary.lastHour.dropPct : null,
    sinceOpenPct: Number.isFinite(summary.sinceOpen?.dropPct) ? summary.sinceOpen.dropPct : null,
    lastHourCount: Number(summary.lastHour?.count) || 0,
    sinceOpenCount: Number(summary.sinceOpen?.count) || 0,
    tier: summary.tier,
    goldConfirmed: !!summary.goldConfirmed,
    limitRising: !!summary.limitRising,
    tag: summary.tag || null,
    at: summary.at || null,
    frozen: !!summary.frozen,
  };
}

export function steamForGame(pinnacleHistory, sport, gameKey, {
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
  nowSec = Math.floor(Date.now() / 1000),
  freezeAtMs = null,
} = {}) {
  const g = pinnacleHistory?.[sport]?.[gameKey] || null;
  return summarizeSteam(g, { marketType, sideNorm, line, nowSec, freezeAtMs });
}

/**
 * Exchange book vs Pinnacle.
 *
 * The number that matters is the price where real size can be lifted, and
 * whether that price moved with Pinnacle. A resting dollar total is not a vote.
 *
 * Gap is in probability points. Positive means this book's inside price is
 * softer than Pinnacle (a better fill, and a refusal of the sharp number
 * when the gap is wide and size is still sitting there).
 */
import { americanFromProb, impliedFromAmerican } from './oddsEv.js';

export const SIZE_FLOOR_USD = 500;
export const OFF_SIZE_USD = 1000;
export const WITH_GAP_PP = 1.5;
export const OFF_GAP_PP = 3;
export const SHORTEN_PP = 1.5;
export const TAPE_KEEP = 16;
export const TAPE_HOUR_MS = 60 * 60 * 1000;

export function fmtUsd(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v >= 1000) {
    const k = v / 1000;
    return `$${k >= 10 ? Math.round(k) : (Math.round(k * 10) / 10)}K`;
  }
  return `$${Math.round(v)}`;
}

export function fmtAmerican(o) {
  const n = Number(o);
  if (!Number.isFinite(n) || n === 0) return '—';
  return n > 0 ? `+${n}` : `${n}`;
}

/** Kalshi returns bids only. A NO bid at X is a YES ask at 1−X. Best ask first. */
export function asksFromKalshiNoBids(noDollars) {
  const rows = Array.isArray(noDollars) ? noDollars : [];
  const asks = [];
  for (let i = rows.length - 1; i >= 0; i--) {
    const bid = Number(rows[i]?.[0]);
    const count = Number(rows[i]?.[1]);
    if (!(bid > 0 && bid < 1) || !(count > 0)) continue;
    const prob = +(1 - bid).toFixed(4);
    if (!(prob > 0.01 && prob < 0.99)) continue;
    asks.push({ prob, sizeUsd: Math.round(count * prob) });
  }
  return asks;
}

/** Polymarket CLOB asks: price is 0–1, size is shares. Best (lowest) ask first. */
export function asksFromPoly(asks) {
  const rows = Array.isArray(asks) ? asks : [];
  return rows.map((a) => {
    const prob = Number(a?.price);
    const shares = Number(a?.size);
    if (!(prob > 0.01 && prob < 0.99) || !(shares > 0)) return null;
    return { prob, sizeUsd: Math.round(shares * prob) };
  }).filter(Boolean).sort((a, b) => a.prob - b.prob);
}

/**
 * Walk asks until `floorUsd` is filled.
 * inside = best ask. vwap = dollar-weighted probability of the walk.
 */
export function walkAsks(asks, floorUsd = SIZE_FLOOR_USD) {
  const levels = [];
  let filled = 0;
  let weighted = 0;
  for (const lvl of asks || []) {
    if (!(lvl?.prob > 0 && lvl.prob < 1) || !(lvl.sizeUsd > 0)) continue;
    levels.push({
      prob: lvl.prob,
      american: americanFromProb(lvl.prob),
      sizeUsd: lvl.sizeUsd,
    });
    const room = floorUsd - filled;
    if (room > 0) {
      const take = Math.min(lvl.sizeUsd, room);
      weighted += take * lvl.prob;
      filled += take;
    }
  }
  const inside = levels[0] || null;
  return {
    insideProb: inside ? inside.prob : null,
    insideAmerican: inside ? inside.american : null,
    insideSizeUsd: inside ? inside.sizeUsd : 0,
    sizeUsd: Math.round(filled),
    vwapProb: filled > 0 ? +(weighted / filled).toFixed(4) : null,
    levels: levels.slice(0, 6),
  };
}

export function gapPp(pinAmerican, insideProb) {
  const pin = impliedFromAmerican(pinAmerican);
  if (pin == null || !(insideProb > 0 && insideProb < 1)) return null;
  return +((pin - insideProb) * 100).toFixed(1);
}

/**
 * with  — inside is on the Pinnacle number
 * off   — inside is ≥3pp softer and ≥$1k is still resting
 * near  — a gap, not wide enough to call a refusal
 * thin  — under $500 at the inside walk
 */
export function bookRead({ pinAmerican, insideProb, sizeUsd, hourAgoProb }) {
  const gap = gapPp(pinAmerican, insideProb);
  let shortenedPp = null;
  if (Number.isFinite(hourAgoProb) && insideProb > 0 && insideProb < 1) {
    shortenedPp = +((insideProb - hourAgoProb) * 100).toFixed(1);
  }
  const size = Number(sizeUsd) || 0;
  let read = 'thin';
  if (size >= SIZE_FLOOR_USD && gap != null) {
    if (Math.abs(gap) <= WITH_GAP_PP) read = 'with';
    else if (gap >= OFF_GAP_PP && size >= OFF_SIZE_USD) read = 'off';
    else read = 'near';
  }
  return { gapPp: gap, shortenedPp, read };
}

export function appendInsideTape(prev, point, now = Date.now()) {
  const tape = (Array.isArray(prev) ? prev : [])
    .filter((p) => p && Number.isFinite(p.t) && p.insideProb > 0);
  if (point && Number.isFinite(point.t) && point.insideProb > 0) tape.push(point);
  const cut = now - 6 * TAPE_HOUR_MS;
  const trimmed = tape.filter((p) => p.t >= cut).slice(-TAPE_KEEP);
  const hourAgo = [...trimmed].reverse().find((p) => now - p.t >= TAPE_HOUR_MS - 5 * 60 * 1000);
  return { tape: trimmed, hourAgoProb: hourAgo?.insideProb ?? null };
}

export function pickCardBook(doc, { sport, gameKey, marketType, side, line } = {}) {
  const g = doc?.games?.[`${sport}|${gameKey}`];
  if (!g || !side) return null;
  const mt = String(marketType || 'ml').toLowerCase();
  if (mt === 'ml') {
    const ours = g.ml?.[side] || null;
    const otherKey = side === 'away' ? 'home' : side === 'home' ? 'away' : null;
    const other = otherKey ? (g.ml?.[otherKey] || null) : null;
    if (!ours && !other) return null;
    return { ours, other };
  }
  const rows = mt === 'spread' ? g.spreads : mt === 'total' ? g.totals : null;
  if (!Array.isArray(rows) || !rows.length) return null;
  const want = Number(line);
  const close = (r) => Number.isFinite(r?.line) && Number.isFinite(want)
    && Math.abs(Math.abs(r.line) - Math.abs(want)) < 0.26;
  // "Team wins by over 2.5" is that team laying 2.5, not getting 2.5.
  // A plus card is the No on the opponent's market. A minus card is the Yes.
  if (mt === 'spread') {
    const margin = rows.filter((r) => /wins by over/i.test(r?.label || ''));
    if (margin.length && Number.isFinite(want) && want !== 0) {
      const own = margin.find((r) => close(r) && r.yesSide === side);
      const opp = margin.find((r) => close(r) && r.yesSide && r.yesSide !== side);
      if (want > 0 && opp) {
        const pin = Number.isFinite(opp.noPin) ? opp.noPin : (own?.pinAmerican ?? null);
        return {
          ours: { pinAmerican: pin, venues: opp.noVenues || {} },
          other: { pinAmerican: opp.pinAmerican ?? null, venues: opp.venues || {} },
        };
      }
      if (want < 0 && own) {
        const otherPin = Number.isFinite(own.noPin) ? own.noPin : (opp?.pinAmerican ?? null);
        return {
          ours: { pinAmerican: own.pinAmerican ?? null, venues: own.venues || {} },
          other: { pinAmerican: otherPin, venues: own.noVenues || {} },
        };
      }
    }
  }
  if (mt === 'total') {
    const over = rows.find((r) => close(r) && (r.yesSide === 'home' || /^over/i.test(r.label || '')));
    if (over) {
      const onOver = side !== 'away';
      return onOver
        ? {
          ours: { pinAmerican: over.pinAmerican ?? null, venues: over.venues || {} },
          other: { pinAmerican: over.noPin ?? null, venues: over.noVenues || {} },
        }
        : {
          ours: { pinAmerican: over.noPin ?? null, venues: over.noVenues || {} },
          other: { pinAmerican: over.pinAmerican ?? null, venues: over.venues || {} },
        };
    }
  }
  const hit = rows.find((r) => close(r) && r.yesSide === side)
    || rows.find((r) => close(r) && r.yesSide && r.yesSide !== side)
    || rows.find(close);
  if (!hit) return null;
  const onYes = !hit.yesSide || hit.yesSide === side;
  const yesNode = { pinAmerican: hit.pinAmerican ?? null, venues: hit.venues || {} };
  const noNode = { pinAmerican: hit.noPin ?? null, venues: hit.noVenues || {} };
  return onYes ? { ours: yesNode, other: noNode } : { ours: noNode, other: yesNode };
}

export function liquidityCaption(side) {
  if (!side) return null;
  const { read, gapPp: gap, shortenedPp, insideAmerican, sizeUsd } = side;
  const bits = [];
  if (read === 'with') bits.push('Inside price is on the Pinnacle number.');
  else if (read === 'off') {
    bits.push(`Inside is ${Math.abs(gap).toFixed(1)}pp softer than Pinnacle, with ${fmtUsd(sizeUsd) || 'size'} still resting.`);
  } else if (read === 'near' && gap != null) {
    bits.push(`Inside is ${Math.abs(gap).toFixed(1)}pp from Pinnacle.`);
  } else if (read === 'thin') {
    bits.push(`Under ${fmtUsd(SIZE_FLOOR_USD)} at the inside.`);
  }
  if (Number.isFinite(shortenedPp) && shortenedPp >= SHORTEN_PP) {
    bits.push(`It shortened ${shortenedPp.toFixed(1)}pp this hour.`);
  }
  if (Number.isFinite(insideAmerican) && !bits.length) {
    bits.push(`Inside ${fmtAmerican(insideAmerican)}.`);
  }
  return bits.join(' ') || null;
}

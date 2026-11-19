/**
 * Polymarket line as steam for the sports with no book tape.
 *
 * The chart already stores a day of prices and the fetcher already pulls
 * the last hour. This turns those two series into the same percents the
 * book tape uses. Positive means this side shortened. The day series is
 * the since-open window, because that is the line on the card. The last
 * hour is the 1h series when it has two points, otherwise the day point
 * at or before an hour ago.
 */

import { decimalDropPct } from './steamMove.js';

function sideProb(raw, complement) {
  const p = Number(raw);
  if (!(p > 0 && p < 1)) return null;
  const q = complement ? 1 - p : p;
  return q > 0 && q < 1 ? q : null;
}

function americanFromProb(p) {
  if (!(p > 0.01 && p < 0.99)) return null;
  return p >= 0.5
    ? Math.round((-100 * p) / (1 - p))
    : Math.round((100 * (1 - p)) / p);
}

function pointsOf(history, complement) {
  const out = [];
  for (const row of history || []) {
    const prob = sideProb(row?.p, complement);
    if (prob == null) continue;
    const t = Number(row?.t);
    out.push({ t: Number.isFinite(t) ? t : null, p: prob });
  }
  return out;
}

function hourAgoProb(day, hour, nowSec) {
  if (hour.length >= 2) return hour[0].p;
  const nowT = day[day.length - 1].t ?? nowSec;
  if (!Number.isFinite(nowT)) return null;
  const cutoff = nowT - 3600;
  let chosen = null;
  for (const row of day) {
    if (row.t != null && row.t <= cutoff) chosen = row;
  }
  return chosen ? chosen.p : null;
}

/**
 * @param {Array<{t?: number, p: number}>} histDay prices over the chart window, p in 0–1
 * @param {Array<{t?: number, p: number}>} histHour prices over the last hour
 * @returns {{ lastHourPct: number|null, sinceOpenPct: number|null }|null}
 */
export function polySteamPcts(histDay, histHour, { complement = false, nowSec = null } = {}) {
  const day = pointsOf(histDay, complement);
  if (day.length < 2) return null;
  const nowAm = americanFromProb(day[day.length - 1].p);
  const openAm = americanFromProb(day[0].p);
  const sinceOpen = decimalDropPct(openAm, nowAm);
  const hourP = hourAgoProb(day, pointsOf(histHour, complement), nowSec);
  const lastHour = hourP == null ? null : decimalDropPct(americanFromProb(hourP), nowAm);
  const sinceOpenPct = Number.isFinite(sinceOpen) ? sinceOpen : null;
  const lastHourPct = Number.isFinite(lastHour) ? lastHour : null;
  if (lastHourPct == null && sinceOpenPct == null) return null;
  return { lastHourPct, sinceOpenPct };
}

function finiteOrNull(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** The side's stored Polymarket steam. Missing is not a move. */
export function polySteamForSide(polySteam, side) {
  const row = polySteam?.[String(side || '').toLowerCase()];
  if (!row || typeof row !== 'object') return null;
  const lastHourPct = finiteOrNull(row.lastHourPct);
  const sinceOpenPct = finiteOrNull(row.sinceOpenPct);
  if (lastHourPct == null && sinceOpenPct == null) return null;
  return { lastHourPct, sinceOpenPct };
}

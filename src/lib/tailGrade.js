/** Shared tail grading. The score grader writes the result; the desk displays it. */

const EPOCH_OK = Date.parse('2020-01-01T00:00:00Z');

export function usableCommenceMs(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < EPOCH_OK) return null;
  return n;
}

export function etDateKey(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n)) return null;
  return new Date(n).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

/** Eastern date of first pitch, else the date saved on the tail, else the day it was marked. */
export function tailGameDate(tail) {
  const commence = usableCommenceMs(tail?.commenceMs);
  if (commence) return etDateKey(commence);
  const saved = String(tail?.date || '').slice(0, 10);
  if (/^20\d{2}-\d{2}-\d{2}$/.test(saved)) return saved;
  const tailed = Number(tail?.tailedAt);
  if (Number.isFinite(tailed) && tailed >= EPOCH_OK) return etDateKey(tailed);
  return null;
}

/** Spread/total number. Moneyline has no line. Falls back to the pick label ("Under 8.5"). */
export function tailLine(tail) {
  const market = String(tail?.marketType || '').toUpperCase();
  if (market === 'ML' || market === 'MONEYLINE') return null;
  const direct = Number(tail?.line ?? tail?.entryLine);
  if (Number.isFinite(direct)) return direct;
  const m = String(tail?.pick || '').match(/([+-]?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function outcomeToTailStatus(outcome) {
  if (outcome === 'WIN') return 'won';
  if (outcome === 'LOSS') return 'lost';
  if (outcome === 'PUSH') return 'push';
  return null;
}

export function customerTailPnl(stake, american, status) {
  const s = Number(stake);
  const o = Number(american);
  if (status === 'push') return 0;
  if (!(s > 0) || !Number.isFinite(o) || o === 0) return null;
  if (status === 'lost') return -Math.round(s);
  if (status !== 'won') return null;
  const win = o > 0 ? s * (o / 100) : s * (100 / Math.abs(o));
  return Math.round(win);
}

/** A result the score grader already wrote. The desk must not replace it. */
export function graderTailResult(tail) {
  if (tail?.gradedBy !== 'grader') return null;
  const status = tail.status === 'won' || tail.status === 'lost' || tail.status === 'push'
    ? tail.status
    : null;
  if (!status) return null;
  const pnl = Number(tail.pnl);
  return { status, pnl: Number.isFinite(pnl) ? pnl : customerTailPnl(tail.stake, tail.myAmerican, status) };
}

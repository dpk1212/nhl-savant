/**
 * Frozen ticket tape for analysis: card EV + Pinnacle steam.
 * Tracking only — does not size units.
 *
 * EV is flagged ticket vs same-line no-vig fair (Over 8.5 −100 vs −113 → +3.1%).
 * Steam is last-hour / since-open decimal drop (6.4% open, 3.9% 1h).
 */

import { linesClose } from './pinnacleMain.js';
import {
  evPctVsFairProb,
  fairProbFromNoVig,
  noVigFairAmerican,
} from './oddsEv.js';
import { compactSteam, summarizeSteam } from './steamMove.js';

function twoWay(us, them) {
  if (!Number.isFinite(us) || !Number.isFinite(them)) return null;
  return [us, them];
}

export function fairPairFromPinnGame(pinnGame, {
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
} = {}) {
  if (!pinnGame) return null;
  const mt = String(marketType || 'ml').toLowerCase();
  const side = String(sideNorm || '').toLowerCase();

  if (mt === 'total') {
    const rows = [
      ...(Array.isArray(pinnGame.totalLines) ? pinnGame.totalLines : []),
      pinnGame.totalCurrent,
    ].filter(Boolean);
    const row = Number.isFinite(Number(line))
      ? rows.find((r) => Math.abs(Number(r.line) - Number(line)) <= 0.051)
      : (rows.find((r) => r.isMain) || pinnGame.totalCurrent);
    if (!row) return null;
    return (side === 'under' || side === 'away')
      ? twoWay(row.underOdds, row.overOdds)
      : twoWay(row.overOdds, row.underOdds);
  }

  if (mt === 'spread') {
    const rows = [
      ...(Array.isArray(pinnGame.spreadLines) ? pinnGame.spreadLines : []),
      pinnGame.spreadCurrent,
    ].filter(Boolean);
    const row = Number.isFinite(Number(line))
      ? rows.find((r) => {
        const ln = side === 'away' ? Number(r.awayLine) : Number(r.homeLine);
        return linesClose(ln, line);
      })
      : (rows.find((r) => r.isMain) || pinnGame.spreadCurrent);
    if (!row) return null;
    return side === 'away'
      ? twoWay(row.awayOdds, row.homeOdds)
      : twoWay(row.homeOdds, row.awayOdds);
  }

  const cur = pinnGame.current || pinnGame.opener;
  if (!cur) return null;
  if (side === 'draw' && Number.isFinite(cur.draw)
      && Number.isFinite(cur.away) && Number.isFinite(cur.home)) {
    return [cur.draw, cur.away, cur.home];
  }
  return side === 'away'
    ? twoWay(cur.away, cur.home)
    : twoWay(cur.home, cur.away);
}

export function captureTicketTape({
  pinnGame = null,
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
  offerOdds = null,
  commenceMs = null,
  nowMs = Date.now(),
} = {}) {
  const pair = fairPairFromPinnGame(pinnGame, { marketType, sideNorm, line });
  const fairProb = pair ? fairProbFromNoVig(pair, 0) : null;
  const fairOdds = pair ? noVigFairAmerican(pair, 0) : null;
  const evPct = (fairProb != null && Number.isFinite(Number(offerOdds)))
    ? evPctVsFairProb(offerOdds, fairProb)
    : null;

  const steamSummary = pinnGame
    ? summarizeSteam(pinnGame, {
      marketType,
      sideNorm,
      line,
      nowSec: Math.floor(Number(nowMs) / 1000),
      freezeAtMs: commenceMs,
    })
    : null;
  const steam = compactSteam(steamSummary);

  return {
    evPct: Number.isFinite(evPct) ? evPct : null,
    fairOdds: Number.isFinite(fairOdds) ? fairOdds : null,
    fairProb: Number.isFinite(fairProb) ? fairProb : null,
    offerOdds: Number.isFinite(Number(offerOdds)) ? Number(offerOdds) : null,
    steam,
  };
}

/** Write analysis stamps onto a pick side / action doc (mutates target). */
export function applyTicketTapeStamps(target, snap) {
  if (!target || !snap) return target;
  target.v8_ticketEvPct = Number.isFinite(snap.evPct) ? snap.evPct : null;
  target.v8_ticketEvFair = Number.isFinite(snap.fairOdds) ? snap.fairOdds : null;
  target.v8_ticketEvOffer = Number.isFinite(snap.offerOdds) ? snap.offerOdds : null;
  target.v8_steam = snap.steam || null;
  target.v8_steamLastHourPct = snap.steam?.lastHourPct ?? null;
  target.v8_steamSinceOpenPct = snap.steam?.sinceOpenPct ?? null;
  target.v8_steamTier = snap.steam?.tier ?? null;
  return target;
}

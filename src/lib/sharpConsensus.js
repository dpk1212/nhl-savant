/**
 * Pinnacle-heavy sharp consensus on this ticket line.
 *
 * Posted prices, probability-space average, then back to American.
 * Circa / Bookmaker are not in The Odds API — do not pretend they are.
 * BetOnline / LowVig copy Pin and are not a second vote.
 */
import { americanFromProb, evPctVsFairProb, impliedFromAmerican } from './oddsEv.js';

function bookKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Raw weights. Missing sleeves are dropped and the rest renormalize. */
export const SHARP_CONSENSUS_WEIGHTS = {
  pinnacle: 70,
  betfair: 18,
  matchbook: 7,
  novig: 5,
};

export const SHOP_BOOK_PREFER = [
  'betfair_ex_eu', 'betfair_ex_uk', 'matchbook',
  'draftkings', 'fanduel', 'betmgm', 'caesars', 'fanatics',
  'betonlineag', 'bookmaker', 'circa',
];

export function consensusSleeve(name) {
  const k = bookKey(name);
  if (!k) return null;
  if (k === 'pinnacle' || k.includes('pinn')) return 'pinnacle';
  if (k.includes('betfair')) return 'betfair';
  if (k.includes('matchbook')) return 'matchbook';
  if (k === 'novig' || k.includes('novig')) return 'novig';
  return null;
}

function takeSleeveOdds(existing, next) {
  if (!Number.isFinite(existing)) return next;
  if (!Number.isFinite(next) || existing === next) return existing;
  const a = impliedFromAmerican(existing);
  const b = impliedFromAmerican(next);
  if (a == null || b == null) return existing;
  return americanFromProb((a + b) / 2);
}

export function sharpConsensusFromBooks(books) {
  const best = {
    pinnacle: null,
    betfair: null,
    matchbook: null,
    novig: null,
  };
  for (const b of books || []) {
    if (!b || !Number.isFinite(b.odds)) continue;
    const sleeve = consensusSleeve(b.name);
    if (!sleeve) continue;
    best[sleeve] = takeSleeveOdds(best[sleeve], b.odds);
  }

  let wSum = 0;
  let pSum = 0;
  const used = [];
  for (const [sleeve, weight] of Object.entries(SHARP_CONSENSUS_WEIGHTS)) {
    const odds = best[sleeve];
    const p = impliedFromAmerican(odds);
    if (p == null) continue;
    wSum += weight;
    pSum += weight * p;
    used.push({ sleeve, odds, weight });
  }
  if (!(wSum > 0)) return { odds: null, prob: null, used: [] };

  const prob = pSum / wSum;
  return {
    odds: americanFromProb(prob),
    prob,
    used,
  };
}

/** Green / hero EV: offer must be a strictly better American than consensus. */
export function evPctVsConsensus(offerOdds, consensusOdds) {
  if (!Number.isFinite(offerOdds) || !Number.isFinite(consensusOdds)) return null;
  if (!(offerOdds > consensusOdds)) return null;
  const consensusP = impliedFromAmerican(consensusOdds);
  if (consensusP == null) return null;
  const ev = evPctVsFairProb(offerOdds, consensusP);
  return Number.isFinite(ev) && ev > 0 ? ev : null;
}

export function bookBeatsConsensus(book, consensusOdds) {
  if (!book || !Number.isFinite(book.odds) || !Number.isFinite(consensusOdds)) return false;
  const k = bookKey(book.name);
  if (k === 'lowvig' || k === 'lv' || k.includes('lowvig')) return false;
  if (k === 'pinnacle') return false;
  return book.odds > consensusOdds;
}

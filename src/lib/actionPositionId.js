/**
 * Action Firestore identity — one doc per wallet + game + market + side + line.
 *
 * SPREAD/TOTAL used to omit line, so Cardinals +1.5 and −1.5 wrote the same
 * `…_SPREAD_away` row and last scan write won. v12 then scored the surviving
 * ticket, not the fattest same-side stake.
 *
 * ML stays lineless (one moneyline outcome per side). SPREAD/TOTAL always
 * append a Firestore-safe line token (`p1p5`, `m1p5`, `p8p5`, or `na`).
 *
 * Identity uses the vault ticket `entryLine` only — never Pinnacle current —
 * so two Poly alts cannot collapse onto the sportsbook main.
 */

export function ticketLineForActionId(pos) {
  const n = Number(pos?.entryLine);
  return Number.isFinite(n) ? n : null;
}

/** Firestore-safe line token. +1.5 → p1p5, −1.5 → m1p5, 8.5 → p8p5. */
export function lineTokenForActionId(marketType, line) {
  const mkt = String(marketType || '').toUpperCase();
  if (mkt !== 'SPREAD' && mkt !== 'TOTAL') return '';
  if (line == null || line === '') return 'na';
  const n = Number(line);
  if (!Number.isFinite(n)) return 'na';
  const sign = n < 0 ? 'm' : 'p';
  const rounded = Math.round(Math.abs(n) * 1000) / 1000;
  const body = String(rounded).replace('.', 'p');
  return `${sign}${body}`;
}

export function walletTail8(wallet) {
  return String(wallet || '').slice(-8);
}

function linelessDocId(pos) {
  return `${pos.date}_${pos.sport}_${pos.gameKey}_${walletTail8(pos.wallet)}_${pos.marketType}_${pos.side}`;
}

/** Pre-line-identity Action id (wallet + game + market + side, no line). */
export function legacyLinelessDocId(pos) {
  return linelessDocId(pos);
}

export function positionDocId(pos) {
  const base = linelessDocId(pos);
  const tok = lineTokenForActionId(pos.marketType, ticketLineForActionId(pos));
  return tok ? `${base}_${tok}` : base;
}

export function linelessSoftKey(wallet, sport, gameKey, marketType, side) {
  return `${String(wallet || '').toLowerCase()}|${sport}|${gameKey}|${marketType}|${side}`;
}

export function softPositionKey(wallet, sport, gameKey, marketType, side, line) {
  const base = linelessSoftKey(wallet, sport, gameKey, marketType, side);
  const tok = lineTokenForActionId(marketType, line);
  return tok ? `${base}|${tok}` : base;
}

export function isLegacyLinelessActionDoc(docId, pos) {
  const mkt = String(pos?.marketType || '').toUpperCase();
  if (mkt !== 'SPREAD' && mkt !== 'TOTAL') return false;
  return String(docId) === legacyLinelessDocId(pos);
}

/** Lineless PENDING sibling should EXIT once a lined successor is in this scan. */
export function shouldSupersedeLinelessActionDoc(docId, data, supersededLinelessKeys) {
  if (!isLegacyLinelessActionDoc(docId, data)) return false;
  const k = linelessSoftKey(data.wallet, data.sport, data.gameKey, data.marketType, data.side);
  return supersededLinelessKeys instanceof Set && supersededLinelessKeys.has(k);
}

/**
 * Pick the consensus line from vote buckets.
 * TOTAL: most invested, then n.
 * SPREAD (and other count-first markets): most wallets, invested as tiebreak
 * so one wallet's $1,022 +1.5 beats the same wallet's $276 −1.5.
 */
export function selectVotedLine(counts, { byInvested = false } = {}) {
  let bestLine = null;
  let bestN = -1;
  let bestInv = -1;
  for (const [ln, c] of counts) {
    const n = Number(c?.n) || 0;
    const invested = Number(c?.invested) || 0;
    const beats = byInvested
      ? (invested > bestInv || (invested === bestInv && n > bestN))
      : (n > bestN || (n === bestN && invested > bestInv));
    if (beats) {
      bestLine = ln;
      bestN = n;
      bestInv = invested;
    }
  }
  return bestLine;
}

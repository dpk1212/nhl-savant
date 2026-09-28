/**
 * Locked-card wallet map: HARD+ specialist labels (display only).
 * Same bar as mute exception / GOLD — n≥4 WR≥62 $ROI≥10 on sport×this market.
 */
import {
  isHardMarketWallet,
  marketPositions,
  normalizeMarketType,
} from './marketSkillMuteOverlay.js';

/** Same 1.5× edge as size-band press / S/T press hold. */
export const MARKET_SPECIALIST_PRESS_SR = 1.5;

export function walletDisplaySizeRatio(w) {
  const sr = Number(w?.displaySizeRatio ?? w?.sizeRatio);
  return Number.isFinite(sr) && sr > 0 ? sr : null;
}

export function walletIsHardMarket(profile, sport, marketType) {
  const mkt = normalizeMarketType(marketType);
  if (!mkt || !sport) return false;
  const mBook = marketPositions(profile, sport, mkt);
  return !!(mBook.schema && isHardMarketWallet(mBook.pos));
}

export function isMarketSpecialistPress(w) {
  const sr = walletDisplaySizeRatio(w);
  return !!w?.hardMarket && sr != null && sr >= MARKET_SPECIALIST_PRESS_SR;
}

/**
 * Selected-wallet sentence on the locked clarity map.
 * HARD+ (sport×this market) sized ≥1.5× is the specialist press we hold.
 */
export function selectedWalletHeadline(selected, {
  againstSel = false,
  selectedTopQ = false,
  sizeHot = false,
  isBiggest = false,
} = {}) {
  if (!selected) return 'No wallets on the board';
  const specialist = !!selected.hardMarket;
  const press = specialist && sizeHot;
  if (againstSel) {
    if (press) return 'Market specialist sized up — other side';
    if (specialist) return 'Market specialist on the other side';
    return 'On the other side — weak track record';
  }
  if (press) return 'Market specialist sized up';
  if (specialist) return 'Market specialist on this market';
  if (selectedTopQ && sizeHot) return 'One of our best on price — and betting above their usual';
  if (selectedTopQ) return 'One of our best on price';
  if (isBiggest && selected.proven) return 'This is the lead wallet on this play';
  if (selected.proven) return 'A proven winner on this side';
  return 'Secondary wallet — on the board, not the stake path';
}

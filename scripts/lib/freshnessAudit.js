/**
 * Read-only labels for the 30-minute freshness bag.
 *
 * The live prune in syncPickStateAuthoritative is unchanged. This module
 * only names which door would have dropped a pending row, so a log can
 * tell silence apart from a truncated book.
 *
 * Silence: the wallet missed this cycle's heartbeat. The exit pass does
 * not stamp EXITED. After 30 minutes the freshness filter drops the row
 * from the score unless it is on the Action JSON or the wallet is trusted.
 *
 * Truncated book: the fetch succeeded, so the wallet is in okWallets, but
 * the open-asset list stopped at a page (500 / 1,000 / 1,500). A ticket
 * past that page is stamped EXITED asset_absent the same cycle. The
 * silence keep would not hold it.
 */

export const FRESHNESS_WINDOW_MS = 30 * 60 * 1000;
export const POSITION_PAGE_SIZE = 500;
export const POSITION_PAGE_CAP = 1500;
export const OPEN_SIZE_FLOOR = 0.1;

/** Sports the live scan-board keep actually walks. ATP / CS2 / LOL are not in it. */
export const LIVE_SCAN_BOARD_SPORTS = ['NHL', 'NBA', 'MLB', 'CBB', 'CFB', 'NFL', 'SOC', 'UFC', 'WNBA'];

export function walletShort(wallet) {
  return String(wallet || '').slice(-6).toLowerCase();
}

export function updatedAtMs(p) {
  const ts = p?.updatedAt;
  if (!ts) return 0;
  if (typeof ts.toMillis === 'function') {
    const ms = ts.toMillis();
    return Number.isFinite(ms) ? ms : 0;
  }
  if (typeof ts._seconds === 'number') return ts._seconds * 1000;
  if (Number.isFinite(ts.seconds)) return ts.seconds * 1000;
  if (ts instanceof Date) return ts.getTime();
  if (typeof ts === 'string') {
    const t = Date.parse(ts);
    return Number.isFinite(t) ? t : 0;
  }
  const n = Number(ts);
  if (!Number.isFinite(n) || n === 0) return 0;
  return n > 1e12 ? n : n * 1000;
}

export function pageBoundary(openAssetCount) {
  const n = Number(openAssetCount) || 0;
  if (n >= POSITION_PAGE_CAP) return POSITION_PAGE_CAP;
  if (n === POSITION_PAGE_SIZE * 2) return POSITION_PAGE_SIZE * 2;
  if (n === POSITION_PAGE_SIZE) return POSITION_PAGE_SIZE;
  return null;
}

function rowsOf(body) {
  if (body == null) return null;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  return null;
}

function hasMore(body) {
  return !!(body && !Array.isArray(body) && body.pagination?.has_more);
}

function tokenId(row) {
  return String(row?.token_id ?? row?.asset ?? '');
}

function sizeOf(row) {
  const n = Number(row?.current_size ?? row?.size);
  return Number.isFinite(n) ? n : 0;
}

function sizedHit(rows, asset) {
  if (!Array.isArray(rows)) return null;
  return rows.find((row) => tokenId(row) === String(asset) && sizeOf(row) > OPEN_SIZE_FLOOR) || null;
}

/**
 * Classify one condition-scoped read.
 * A null body, an unexpected shape, or a page that says more rows exist
 * stays UNKNOWN. Empty is closed only after OPEN, CLOSED, and REDEEMABLE
 * all returned arrays.
 */
export function classifyPositionRead({ open, closed, redeemable, redeemableLost, asset } = {}) {
  if (!asset) return { polyClass: 'UNKNOWN', currentSize: null, polyNote: 'missing_asset' };
  const openRows = rowsOf(open);
  if (openRows == null) return { polyClass: 'UNKNOWN', currentSize: null, polyNote: 'open_failed' };
  if (hasMore(open)) return { polyClass: 'UNKNOWN', currentSize: null, polyNote: 'open_has_more' };
  const ghost = sizedHit(openRows, asset);
  if (ghost) return { polyClass: 'GHOST', currentSize: sizeOf(ghost), polyNote: null };

  const closedRows = rowsOf(closed);
  if (closedRows == null) return { polyClass: 'UNKNOWN', currentSize: null, polyNote: 'closed_failed' };
  if (closedRows.some((row) => tokenId(row) === String(asset))) {
    return { polyClass: 'TRUE_CLOSED', currentSize: null, polyNote: null };
  }

  const redRows = rowsOf(redeemable);
  if (redRows == null) return { polyClass: 'UNKNOWN', currentSize: null, polyNote: 'redeemable_failed' };
  const resolved = sizedHit(redRows, asset);
  if (resolved) return { polyClass: 'RESOLVED', currentSize: sizeOf(resolved), polyNote: null };

  if (redeemableLost !== undefined) {
    const lostRows = rowsOf(redeemableLost);
    if (lostRows == null) return { polyClass: 'UNKNOWN', currentSize: null, polyNote: 'redeemable_lost_failed' };
    const lost = sizedHit(lostRows, asset);
    if (lost) return { polyClass: 'RESOLVED', currentSize: sizeOf(lost), polyNote: 'redeemable_lost' };
  }

  return { polyClass: 'TRUE_CLOSED', currentSize: null, polyNote: 'empty_open_closed_redeemable' };
}

/**
 * Name the door for one position. Does not decide the live score.
 * `onScanBoard` is the live keep (the sports that helper walks).
 * `onScanJson` is the file itself, including tennis and esports.
 */
export function describeFreshnessRow(p, {
  maxUpdatedMs = 0,
  onScanBoard = false,
  onScanJson = false,
  trusted = false,
  inOkWallets = false,
  assetInOpenAssets = false,
  openAssetCount = 0,
  t15Pinned = false,
  nowMs = Date.now(),
} = {}) {
  const status = String(p?.status || '');
  const at = updatedAtMs(p);
  const ageMin = at > 0 && nowMs > at ? Math.round((nowMs - at) / 60000) : null;
  const fresh = at === 0 || (maxUpdatedMs > 0 && at >= maxUpdatedMs - FRESHNESS_WINDOW_MS);
  const boundary = pageBoundary(openAssetCount);
  const pending = status === 'PENDING';
  const asset = p?.asset ? String(p.asset) : '';
  const scannedMissing = pending && inOkWallets && !!asset && !assetInOpenAssets;
  const wouldExitAbsent = scannedMissing && !t15Pinned;
  const sportOmitted = !!p?.sport && !LIVE_SCAN_BOARD_SPORTS.includes(p.sport);

  let mechanism = 'fresh';
  if (status === 'EXITED') mechanism = 'already_exited';
  else if (!pending) mechanism = 'not_pending';
  else if (fresh) mechanism = 'fresh';
  else if (onScanBoard) mechanism = 'kept_scan_board';
  else if (trusted) mechanism = 'kept_trust';
  else if (onScanJson && sportOmitted) mechanism = 'scan_board_sport_omitted';
  else if (!inOkWallets) mechanism = 'silence_prune';
  else if (scannedMissing && t15Pinned) mechanism = 't15_held';
  else if (scannedMissing && boundary) mechanism = 'truncated_book';
  else if (scannedMissing) mechanism = 'scanned_missing_asset';
  else if (inOkWallets && assetInOpenAssets) mechanism = 'open_but_unwritten';
  else if (inOkWallets && !asset) mechanism = 'legacy_no_asset';
  else mechanism = 'silence_prune';

  const wouldPrune = pending && !fresh && !onScanBoard && !trusted;

  return {
    walletShort: walletShort(p?.wallet),
    sport: p?.sport || null,
    gameKey: p?.gameKey || null,
    marketType: p?.marketType || null,
    side: p?.side || null,
    invested: Number(p?.invested) || 0,
    status: status || null,
    exitReason: p?.exitReason || null,
    ageMin,
    fresh,
    onScanBoard: !!onScanBoard,
    onScanJson: !!onScanJson,
    scanBoardSportOmitted: sportOmitted,
    trusted: !!trusted,
    inOkWallets: !!inOkWallets,
    assetInOpenAssets: !!assetInOpenAssets,
    openAssetCount: Number(openAssetCount) || 0,
    pageBoundary: boundary,
    t15Pinned: !!t15Pinned,
    wouldPrune,
    wouldExitAbsent,
    mechanism,
    hasAsset: !!asset,
    hasCondition: !!p?.conditionId,
  };
}

export function needsPolyRead(row, focusShort) {
  if (!row) return false;
  if (focusShort && row.walletShort === focusShort) return true;
  if (row.wouldPrune) return true;
  if (row.mechanism === 'truncated_book' || row.mechanism === 't15_held') return true;
  if (row.pageBoundary && row.wouldExitAbsent) return true;
  return false;
}

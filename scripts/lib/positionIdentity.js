/**
 * Identity for sharp_action_positions docs.
 *
 * Legacy id is date+sport+game+wallet8+market+side — two spread tickets on
 * the same side (Kennesaw +10.5 and +8.5) collided and the later write
 * ate the earlier one. Polymarket `asset` is the real token. Fall back to
 * the entry line when asset is missing so alt numbers still split.
 */

export function lineToken(pos) {
  const mkt = String(pos?.marketType || '').toUpperCase();
  const raw = mkt === 'SPREAD'
    ? (pos?.entryLine ?? pos?.spreadLine)
    : mkt === 'TOTAL'
      ? (pos?.entryLine ?? pos?.totalLine)
      : null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return '';
  const sign = n < 0 ? 'm' : 'p';
  return `${sign}${String(Math.abs(n)).replace('.', '_')}`;
}

export function assetTail(asset) {
  const s = String(asset || '');
  if (!s) return '';
  return s.length > 16 ? s.slice(-12) : s;
}

export function positionDocIdLegacy(pos) {
  const wallet = String(pos?.wallet || '');
  return `${pos.date}_${pos.sport}_${pos.gameKey}_${wallet.slice(-8)}_${pos.marketType}_${pos.side}`;
}

export function positionDocId(pos) {
  const base = positionDocIdLegacy(pos);
  const tail = assetTail(pos?.asset);
  if (tail) return `${base}_${tail}`;
  const line = lineToken(pos);
  return line ? `${base}_${line}` : base;
}

/**
 * Keep writing the legacy doc when it is this same ticket (no asset yet,
 * or the same asset). A different asset on the legacy id is a collision —
 * that row stays put and this ticket gets the asset-suffixed id.
 */
export function resolvePositionDocId(pos, legacyData = null) {
  const next = positionDocId(pos);
  const legacy = positionDocIdLegacy(pos);
  if (next === legacy) return { id: next, reusedLegacy: false };
  if (legacyData && typeof legacyData === 'object') {
    const oldAsset = legacyData.asset != null && legacyData.asset !== ''
      ? String(legacyData.asset)
      : '';
    const newAsset = pos?.asset != null && pos.asset !== '' ? String(pos.asset) : '';
    if (!oldAsset || oldAsset === newAsset) {
      return { id: legacy, reusedLegacy: true };
    }
  }
  return { id: next, reusedLegacy: false };
}

export function softPositionKey(wallet, sport, gameKey, marketType, side, extra = '') {
  const base = `${String(wallet || '').toLowerCase()}|${sport}|${gameKey}|${marketType}|${side}`;
  return extra ? `${base}|${extra}` : base;
}

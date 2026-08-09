/**
 * Sport book for UI “Why we trust them” — same rule LockedClarity / receipts use.
 *
 * Source A = featured picks (bySport.picks / flatRoi)
 * Source B = on-chain positions (bySport.positions / positionFlatRoi)
 *
 * When both exist (≥2 decided), pick the stronger book (positive ROI first,
 * then WR, then ROI). Action + locked cards must share this helper.
 */
export function sportBookForDisplay(sportRec) {
  if (!sportRec) return null;
  const pos = sportRec.positions || null;
  const pk = sportRec.picks || null;
  const mk = (r, kind, roi) => ({
    wins: r.wins || 0,
    losses: r.losses || 0,
    wr: r.wr ?? null,
    roi: Number.isFinite(roi) ? roi : null,
    kind,
    n: r.n || ((r.wins || 0) + (r.losses || 0)),
  });

  const candidates = [];
  if (pk && (pk.n || 0) >= 2 && ((pk.wins || 0) + (pk.losses || 0)) > 0) {
    candidates.push(mk(pk, 'picks', pk.flatRoi));
  }
  if (pos && (pos.n || 0) >= 2 && ((pos.wins || 0) + (pos.losses || 0)) > 0) {
    candidates.push(mk(pos, 'positions', pos.positionFlatRoi));
  }
  if (candidates.length === 0) {
    if (pos && (pos.n || 0) > 0) {
      return mk(pos, 'positions', pos.positionFlatRoi ?? (pk?.flatRoi ?? null));
    }
    if (pk && (pk.n || 0) > 0) return mk(pk, 'picks', pk.flatRoi);
    return null;
  }
  if (candidates.length === 1) return candidates[0];

  const score = (c) => {
    const wr = Number.isFinite(c.wr) ? c.wr : -1;
    const roi = Number.isFinite(c.roi) ? c.roi : -999;
    const posRoi = roi > 0 ? 1 : 0;
    return posRoi * 1e6 + wr * 1e3 + roi;
  };
  return candidates.sort((a, b) => score(b) - score(a))[0];
}

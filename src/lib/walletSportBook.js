/**
 * Sport book for UI “Why we trust them” — same rule LockedClarity / receipts use.
 *
 * Source A = featured picks (bySport.picks / flatRoi)
 * Source B = on-chain positions (bySport.positions / positionFlatRoi + dollarRoi)
 *
 * When both exist (≥2 decided), pick the stronger book (positive ROI first,
 * then WR, then ROI). Action + locked cards must share this helper.
 */
export function sportBookForDisplay(sportRec) {
  if (!sportRec) return null;
  const pos = sportRec.positions || null;
  const pk = sportRec.picks || null;
  const mk = (r, kind, roi, extra = {}) => ({
    wins: r.wins || 0,
    losses: r.losses || 0,
    wr: r.wr ?? null,
    roi: Number.isFinite(roi) ? roi : null,
    kind,
    n: r.n || ((r.wins || 0) + (r.losses || 0)),
    ...extra,
  });

  const candidates = [];
  if (pk && (pk.n || 0) >= 2 && ((pk.wins || 0) + (pk.losses || 0)) > 0) {
    candidates.push(mk(pk, 'picks', pk.flatRoi));
  }
  if (pos && (pos.n || 0) >= 2 && ((pos.wins || 0) + (pos.losses || 0)) > 0) {
    candidates.push(mk(pos, 'positions', pos.positionFlatRoi, {
      dollarRoi: Number.isFinite(pos.dollarRoi) ? pos.dollarRoi : null,
    }));
  }
  if (candidates.length === 0) {
    if (pos && (pos.n || 0) > 0) {
      return mk(pos, 'positions', pos.positionFlatRoi ?? (pk?.flatRoi ?? null), {
        dollarRoi: Number.isFinite(pos.dollarRoi) ? pos.dollarRoi : null,
      });
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

/**
 * Collapsed Locked Zone A — prefer Source B (positions) when the sport book
 * has a real sample; fall back to Source A picks. Attaches $ ROI + L30 window.
 */
export function sportTrustBookPreferB(sportRec) {
  if (!sportRec) return null;
  const pos = sportRec.positions || null;
  const pk = sportRec.picks || null;
  const recent = sportRec.recentActionWindow || null;

  const fromPos = pos && (pos.n || 0) >= 2 && ((pos.wins || 0) + (pos.losses || 0)) > 0
    ? {
      wins: pos.wins || 0,
      losses: pos.losses || 0,
      wr: Number.isFinite(pos.wr) ? pos.wr : null,
      roi: Number.isFinite(pos.positionFlatRoi) ? pos.positionFlatRoi
        : (Number.isFinite(pos.dollarRoi) ? pos.dollarRoi : null),
      dollarRoi: Number.isFinite(pos.dollarRoi) ? pos.dollarRoi : null,
      kind: 'positions',
      n: pos.n || ((pos.wins || 0) + (pos.losses || 0)),
    }
    : null;

  const fromPicks = pk && (pk.n || 0) >= 2 && ((pk.wins || 0) + (pk.losses || 0)) > 0
    ? {
      wins: pk.wins || 0,
      losses: pk.losses || 0,
      wr: Number.isFinite(pk.wr) ? pk.wr : null,
      roi: Number.isFinite(pk.flatRoi) ? pk.flatRoi : null,
      dollarRoi: null,
      kind: 'picks',
      n: pk.n || ((pk.wins || 0) + (pk.losses || 0)),
    }
    : null;

  const book = fromPos || fromPicks || sportBookForDisplay(sportRec);
  if (!book) return null;

  const recentPnl = Number.isFinite(recent?.settledPnl) ? recent.settledPnl : null;
  const recentRoi = Number.isFinite(recent?.dollarRoi) ? recent.dollarRoi : null;
  const recentN = Number(recent?.n) || 0;

  return {
    ...book,
    roi: Number.isFinite(book.roi) ? Math.round(book.roi) : null,
    dollarRoi: Number.isFinite(book.dollarRoi) ? Math.round(book.dollarRoi) : null,
    wr: Number.isFinite(book.wr) ? Math.round(book.wr) : null,
    record: ((book.wins || 0) + (book.losses || 0)) > 0
      ? `${book.wins || 0}-${book.losses || 0}`
      : null,
    recentPnl: recentN >= 8 && recentPnl != null ? Math.round(recentPnl) : null,
    recentRoi: recentN >= 8 && recentRoi != null ? Math.round(recentRoi) : null,
    recentN,
  };
}

/**
 * Pick the most sensational true number for novice trust.
 * Priority: L30 $ profit → L30 $ ROI → lifetime $ ROI → flat ROI → WR.
 */
export function pickSensationalTrust(book) {
  if (!book) return null;
  const cands = [];

  if (Number.isFinite(book.recentPnl) && book.recentPnl > 0) {
    const v = book.recentPnl;
    const label = v >= 1000
      ? `L30 +$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K`
      : `L30 +$${Math.round(v)}`;
    cands.push({ score: 5000 + Math.min(v / 100, 800), label, tone: 'hot', kind: 'l30pnl' });
  }
  if (Number.isFinite(book.recentRoi) && book.recentRoi > 0) {
    cands.push({
      score: 4000 + book.recentRoi,
      label: `L30 +${book.recentRoi}% ROI`,
      tone: book.recentRoi >= 20 ? 'hot' : 'good',
      kind: 'l30roi',
    });
  }
  if (Number.isFinite(book.dollarRoi) && book.dollarRoi > 0) {
    cands.push({
      score: 3000 + book.dollarRoi,
      label: `+${book.dollarRoi}% $ ROI`,
      tone: book.dollarRoi >= 25 ? 'hot' : 'good',
      kind: 'dollarRoi',
    });
  }
  if (Number.isFinite(book.roi) && book.roi > 0) {
    cands.push({
      score: 2000 + book.roi,
      label: `+${book.roi}% ROI`,
      tone: book.roi >= 25 ? 'hot' : 'good',
      kind: 'roi',
    });
  }
  if (Number.isFinite(book.wr) && book.wr >= 55) {
    cands.push({
      score: 1000 + book.wr,
      label: `${book.wr}% WR`,
      tone: book.wr >= 62 ? 'hot' : 'good',
      kind: 'wr',
    });
  }

  cands.sort((a, b) => b.score - a.score);
  const banger = cands[0] || null;

  // Secondary quiet stats — don't repeat the banger kind
  const secondary = [];
  if (book.record) secondary.push(book.record);
  if (banger?.kind !== 'wr' && Number.isFinite(book.wr)) secondary.push(`${book.wr}% WR`);
  if (banger?.kind !== 'roi' && banger?.kind !== 'dollarRoi' && banger?.kind !== 'l30roi'
      && Number.isFinite(book.roi) && book.roi !== 0) {
    secondary.push(`${book.roi > 0 ? '+' : ''}${book.roi}% ROI`);
  } else if (banger?.kind !== 'dollarRoi' && Number.isFinite(book.dollarRoi) && book.dollarRoi !== 0
      && banger?.kind !== 'l30roi') {
    secondary.push(`${book.dollarRoi > 0 ? '+' : ''}${book.dollarRoi}% $`);
  }

  return {
    record: book.record || null,
    banger,
    secondary: secondary.slice(0, 2),
    bookKind: book.kind || null,
  };
}

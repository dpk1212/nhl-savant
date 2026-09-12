/**
 * All-time Sharp Flow P&L bundle — same object loadAllTimePnL used to
 * build in the browser from three full collection scans.
 *
 * Built once ~hourly on the server (scripts/buildSharpFlowPnl.mjs) and
 * served as public/sharp-flow-pnl.json so every homepage visit is a
 * static fetch, not 4k–8k Firestore reads.
 *
 * Keep this in lock-step with the Record / AGS-U / L7-L30 consumers in
 * SharpFlow.jsx. Do not slim the `picks` row shape.
 */

export const AGS_U_CUTOVER = '2026-05-14';
export const STARS_LIVE_DATE = '2026-04-06';
export const SHARP_FLOW_PNL_VERSION = 18;

function emptyTierBucket() {
  return {
    wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0,
    totalPicks: 0, pendingPicks: 0,
    trackedPicks: 0, trackedWins: 0, trackedLosses: 0,
  };
}

function emptyStarBucket() {
  return { wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0, totalPicks: 0, label: '' };
}

const starBucket = (s) => (s >= 4.5 ? 5 : s >= 3.5 ? 4 : s >= 2.5 ? 3 : s >= 1.5 ? 2 : 1);

/** Stars on the snap, else 3. Unstamped pre-v7 docs are rare; do not re-run the v7 star model here. */
function starsFromSnap(snap) {
  const s = snap?.stars;
  return Number.isFinite(s) ? s : 3;
}

/**
 * Headline W-L-P / units / profit — MUTED / CANCELLED / SHADOW / tracked-only excluded.
 * @param {object[]} docs
 */
export function tallySidesFromDocs(docs) {
  let wins = 0, losses = 0, pushes = 0, totalProfit = 0, totalUnits = 0;
  for (const data of docs) {
    if (data.sides) {
      for (const sideData of Object.values(data.sides)) {
        if (sideData.status !== 'COMPLETED') continue;
        if (sideData.superseded || sideData.health?.status === 'CANCELLED' || sideData.health?.status === 'MUTED' || sideData.lockStage === 'SHADOW') continue;
        const u = sideData.finalUnits
          ?? sideData.v8_agsUnitsApplied
          ?? sideData.peak?.units
          ?? sideData.lock?.units
          ?? 0;
        const isTrackedOnly = sideData.result?.tracked === true;
        if (isTrackedOnly) continue;
        totalUnits += u;
        const profit = sideData.result?.profit ?? 0;
        if (sideData.result?.outcome === 'WIN') { wins++; totalProfit += profit; }
        else if (sideData.result?.outcome === 'LOSS') { losses++; totalProfit += profit; }
        else if (sideData.result?.outcome === 'PUSH') { pushes++; }
      }
    } else {
      if (data.status !== 'COMPLETED') continue;
      const u = data.units ?? 0;
      if (!u) continue;
      totalUnits += u;
      const profit = data.result?.profit ?? 0;
      if (data.result?.outcome === 'WIN') { wins++; totalProfit += profit; }
      else if (data.result?.outcome === 'LOSS') { losses++; totalProfit += profit; }
      else if (data.result?.outcome === 'PUSH') { pushes++; }
    }
  }
  return { wins, losses, pushes, totalProfit: +totalProfit.toFixed(2), totalUnits, record: `${wins}-${losses}${pushes > 0 ? `-${pushes}` : ''}` };
}

/**
 * @param {object[]} docs ticket docs with `_marketType` ('ml'|'spread'|'total')
 * @returns {{ pregame, all, byStars, byAgsTier, agsTierMeta, picks, generatedAt?: string }}
 */
export function buildSharpFlowPnl(docs) {
  const overall = tallySidesFromDocs(docs);
  const byStars = {};
  const picks = [];
  const byAgsTier = {
    ELITE: emptyTierBucket(),
    PREMIUM: emptyTierBucket(),
    LOCK: emptyTierBucket(),
    LEAN: emptyTierBucket(),
    WEAK: emptyTierBucket(),
    FADE: emptyTierBucket(),
  };

  const processSide = (data, sd, mt) => {
    const isPostDeploy = data.date >= STARS_LIVE_DATE;
    const isPostAgsuCutover = (data.date || '') >= AGS_U_CUTOVER;
    const u = sd.finalUnits
      ?? sd.v8_agsUnitsApplied
      ?? sd.peak?.units
      ?? sd.lock?.units
      ?? 0;
    const isTrackedOnly = sd.result?.tracked === true;
    const isCancelled = !!(sd.superseded || sd.health?.status === 'CANCELLED' || sd.health?.status === 'MUTED' || sd.lockStage === 'SHADOW' || isTrackedOnly);
    const bestSnap = sd.peak || sd.lock;
    const lockSnap = sd.lock || bestSnap;
    const s = bestSnap?.stars ?? starsFromSnap(bestSnap);
    const key = starBucket(s);
    if (!byStars[key]) byStars[key] = emptyStarBucket();
    if (!isCancelled) byStars[key].totalPicks++;
    if (sd.status === 'COMPLETED' && !isCancelled) {
      byStars[key].totalUnits += u;
      if (sd.result?.outcome === 'WIN') { byStars[key].wins++; byStars[key].totalProfit += (sd.result?.profit || 0); }
      else if (sd.result?.outcome === 'LOSS') { byStars[key].losses++; byStars[key].totalProfit -= u; }
      else if (sd.result?.outcome === 'PUSH') { byStars[key].pushes++; }
    }

    if (isPostAgsuCutover) {
      const cronTier = (typeof sd.v8_agsV12Tier === 'string' && sd.v8_agsV12Tier !== 'UNKNOWN')
        ? sd.v8_agsV12Tier
        : (typeof sd.v8_agsTier === 'string' && sd.v8_agsTier !== 'UNKNOWN')
          ? sd.v8_agsTier
          : (typeof sd.v8_lockTier === 'string' ? sd.v8_lockTier : null);
      if (cronTier && byAgsTier[cronTier]) {
        const tierBucket = byAgsTier[cronTier];
        const shippedLive = u > 0 && !isTrackedOnly && !isCancelled;
        if (shippedLive || isTrackedOnly) {
          if (shippedLive) tierBucket.totalPicks++;
          else tierBucket.trackedPicks++;
          if (sd.status === 'COMPLETED') {
            const outcome = sd.result?.outcome;
            if (shippedLive) {
              tierBucket.totalUnits += u;
              if (outcome === 'WIN') { tierBucket.wins++; tierBucket.totalProfit += (sd.result?.profit || 0); }
              else if (outcome === 'LOSS') { tierBucket.losses++; tierBucket.totalProfit -= u; }
              else if (outcome === 'PUSH') { tierBucket.pushes++; }
            } else {
              if (outcome === 'WIN') tierBucket.trackedWins++;
              else if (outcome === 'LOSS') tierBucket.trackedLosses++;
            }
          } else if (shippedLive) {
            tierBucket.pendingPicks++;
          }
        }
      }
    }
    const pickStars = isPostDeploy ? (bestSnap?.stars ?? 0) : s;
    if (pickStars >= 2.5 || typeof sd.v8_hcStakeTier === 'string') {
      const lkStars = lockSnap?.stars ?? 0;
      const lkEV = lockSnap?.evEdge ?? null;
      const pkEV = bestSnap?.evEdge ?? null;
      const regime = bestSnap?.regime || lockSnap?.regime || null;
      const pick = {
        date: data.date, sport: data.sport || 'NHL', marketType: mt,
        stars: pickStars, lockStars: lkStars, lockEV: lkEV, peakEV: pkEV,
        units: u, status: sd.status || 'PENDING', outcome: null, profit: 0,
        clv: null, cancelled: isCancelled, tracked: isTrackedOnly, regime,
        v8_topPick: sd.v8_topPick,
        v8_superTopPick: sd.v8_superTopPick,
        v8_lockTier: sd.v8_lockTier,
        v8_systemVersion: sd.v8_systemVersion,
        v8_ags: Number.isFinite(sd.v8_ags) ? sd.v8_ags : null,
        v8_agsTier: typeof sd.v8_agsTier === 'string' ? sd.v8_agsTier : null,
        v8_agsComponents: sd.v8_agsComponents || null,
        v8_hcStakeTier: typeof sd.v8_hcStakeTier === 'string' ? sd.v8_hcStakeTier : null,
        v8_agsV12: Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null,
        v8_agsV12Tier: typeof sd.v8_agsV12Tier === 'string' ? sd.v8_agsV12Tier : null,
        team: sd.team || null,
        away: data.away || null,
        home: data.home || null,
        oddsLock: Number.isFinite(sd.lock?.odds) ? sd.lock.odds
                : Number.isFinite(sd.peak?.odds) ? sd.peak.odds
                : null,
      };
      if (sd.status === 'COMPLETED') {
        pick.outcome = sd.result?.outcome || null;
        if (isTrackedOnly) { pick.profit = 0; }
        else if (sd.result?.outcome === 'WIN') { pick.profit = sd.result?.profit || 0; }
        else if (sd.result?.outcome === 'LOSS') { pick.profit = -u; }
        if (sd.result?.clv != null) pick.clv = sd.result.clv;
      }
      picks.push(pick);
    }
  };

  for (const data of docs) {
    const mt = data._marketType || data.marketType || 'ml';
    if (data.sides) {
      for (const sd of Object.values(data.sides)) processSide(data, sd, mt);
    } else {
      const isPostDeploy = data.date >= STARS_LIVE_DATE;
      const s = data.stars ?? starsFromSnap(data);
      const key = starBucket(s);
      if (!byStars[key]) byStars[key] = emptyStarBucket();
      byStars[key].totalPicks++;
      const u = data.units || 1;
      if (data.status === 'COMPLETED') {
        byStars[key].totalUnits += u;
        if (data.result?.outcome === 'WIN') { byStars[key].wins++; byStars[key].totalProfit += (data.result?.profit || 0); }
        else if (data.result?.outcome === 'LOSS') { byStars[key].losses++; byStars[key].totalProfit -= u; }
        else if (data.result?.outcome === 'PUSH') { byStars[key].pushes++; }
      }
      const pickStars = isPostDeploy ? (data.stars ?? 0) : s;
      if (pickStars >= 2.5) {
        const pick = { date: data.date, sport: data.sport || 'NHL', marketType: mt, stars: pickStars, units: u, status: data.status || 'PENDING', outcome: null, profit: 0 };
        if (data.status === 'COMPLETED') {
          pick.outcome = data.result?.outcome || null;
          if (data.result?.outcome === 'WIN') { pick.profit = data.result?.profit || 0; }
          else if (data.result?.outcome === 'LOSS') { pick.profit = -u; }
        }
        picks.push(pick);
      }
    }
  }

  for (const v of Object.values(byStars)) {
    v.totalProfit = +v.totalProfit.toFixed(2);
    v.record = `${v.wins}-${v.losses}${v.pushes > 0 ? `-${v.pushes}` : ''}`;
    v.roi = v.totalUnits > 0 ? +((v.totalProfit / v.totalUnits) * 100).toFixed(1) : 0;
  }

  for (const v of Object.values(byAgsTier)) {
    v.totalProfit = +v.totalProfit.toFixed(2);
    v.gradedPicks = v.wins + v.losses + v.pushes;
    v.record = `${v.wins}-${v.losses}${v.pushes > 0 ? `-${v.pushes}` : ''}`;
    v.roi = v.totalUnits > 0 ? +((v.totalProfit / v.totalUnits) * 100).toFixed(1) : 0;
    v.trackedRecord = `${v.trackedWins}-${v.trackedLosses}`;
  }

  return {
    pregame: overall,
    all: overall,
    byStars,
    byAgsTier,
    agsTierMeta: { since: AGS_U_CUTOVER },
    picks,
  };
}

export function isSharpFlowPnlBundle(data) {
  return !!(data && Array.isArray(data.picks) && data.byAgsTier && data.all);
}

/**
 * Age of a built bundle. Use generatedAt, never filesystem mtime —
 * `git checkout` / `reset --hard` resets mtime to now and the fetch
 * loop then skipped the rebuild forever (frozen at 2026-09-11 17:05Z).
 * Missing or invalid generatedAt → Infinity (rebuild).
 */
export function pnlBundleAgeMs(bundleOrJson, now = Date.now()) {
  try {
    const j = typeof bundleOrJson === 'string' ? JSON.parse(bundleOrJson) : bundleOrJson;
    const t = Date.parse(j?.generatedAt);
    return Number.isFinite(t) ? now - t : Infinity;
  } catch {
    return Infinity;
  }
}

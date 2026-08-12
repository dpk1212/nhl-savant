/**
 * Sport-local "usual" stake for SHADOW / Size vs usual.
 *
 * Prefer per-sport average over cross-sport sports_sharps.avgSportBet so an
 * NFL-heavy wallet's MLB toe-in isn't judged against a $40K all-sports mean.
 *
 * Resolution order (matches locked-card / Action displaySizeRatio):
 *   1. walletProfiles.bySport[sport].positions invested/n
 *   2. sports_sharps.perSport[sport].avgBet (or invested/bets)
 *   3. fallback (stamped cross-sport avgSportBet, etc.)
 */

function perSportAvg(ss, sport) {
  if (!ss || !sport) return null;
  const ps = ss.perSport?.[sport] || ss.perSport?.[String(sport).toUpperCase()];
  if (!ps) return null;
  if (Number(ps.avgBet) > 0) return Number(ps.avgBet);
  const bets = Number(ps.bets) || 0;
  const invested = Number(ps.invested) || 0;
  if (bets > 0 && invested > 0) return invested / bets;
  return null;
}

function profileSportAvg(prof, sport) {
  if (!prof || !sport) return null;
  const rec = prof.bySport?.[sport] || prof.bySport?.[String(sport).toUpperCase()];
  const pos = rec?.positions;
  const n = Number(pos?.n) || 0;
  const invested = Number(pos?.invested);
  if (n > 0 && Number.isFinite(invested) && invested > 0) return invested / n;
  return null;
}

/**
 * @param {object} opts
 * @param {string} opts.sport
 * @param {object|null} [opts.sportsSharp]  sports_sharps[addr] row
 * @param {object|null} [opts.profile]      sharpWalletProfiles / wallet-profiles row
 * @param {number|null} [opts.fallback]     stamped avgSportBet / cross-sport
 * @returns {{ usual: number, source: string }}
 */
export function resolveSportUsualBet({
  sport,
  sportsSharp = null,
  profile = null,
  fallback = null,
} = {}) {
  const fromProf = profileSportAvg(profile, sport);
  if (fromProf > 0) return { usual: Math.round(fromProf), source: 'profile.bySport.positions' };

  const fromSs = perSportAvg(sportsSharp, sport);
  if (fromSs > 0) return { usual: Math.round(fromSs), source: 'sports_sharps.perSport' };

  const fb = Number(fallback);
  if (Number.isFinite(fb) && fb > 0) return { usual: Math.round(fb), source: 'fallback' };

  return { usual: 0, source: 'none' };
}

/** CJS + ESM friendly for scan scripts. */
export default { resolveSportUsualBet };

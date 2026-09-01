/**
 * Close the Action ↔ v12 feed gap.
 *
 * Action desk reads public/sharp_positions*.json (CONFIRMED/FLAT).
 * Staking math (syncPickStateAuthoritative) reads Firestore
 * sharp_action_positions PENDING after exclusion + 30‑min freshness prune.
 *
 * Those two sources can diverge: a Tier A CONFIRMED ticket can sit on
 * Action while EXITED / stale-pruned / never-written docs keep it out of
 * the live group → FOOLS sees FLAT-only → 0u. Real incident: MLB phi_laa
 * 2026-08-29 wallet …4417bc (CONFIRMED, ~1.9× sport-usual) missing from
 * peak.walletDetails while FLAT $30K led the side.
 *
 * This module rehydrates scan-board proven tickets into the live bag and
 * stamps sport-local sizeRatio so HC / v12 quality match Action sizing.
 */

import { resolveSportUsualBet } from './sportUsualBet.js';
import { stakeSizeRatio } from '../../src/lib/sizeRatioBands.js';
import { positionToWalletDetail } from '../../src/lib/ags.js';
import {
  acceptFullGameSidePosition,
  acceptFullGameTotalPosition,
} from './totalMarketFilter.js';

/** Same floor as writeSharpActions SHADOW_MIN_MULTIPLIER. */
export const SCAN_BOARD_SHADOW_MIN = 0.10;

const SPORTS = ['NHL', 'NBA', 'MLB', 'CBB', 'CFB', 'NFL', 'SOC', 'UFC', 'WNBA'];
const PROVEN_TIERS = new Set(['CONFIRMED', 'FLAT']);

export function softPositionKey(wallet, sport, gameKey, marketType, side) {
  return `${String(wallet || '').toLowerCase()}|${sport}|${gameKey}|${marketType}|${side}`;
}

export function positionSoftKey(p) {
  return softPositionKey(p.wallet, p.sport, p.gameKey, p.marketType, p.side);
}

function shortId(wallet) {
  return String(wallet || '').slice(-6).toLowerCase();
}

function profileFor(walletProfiles, wallet) {
  if (!walletProfiles) return null;
  const short = shortId(wallet);
  if (!short) return null;
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(short)
      || walletProfiles.get(short.toUpperCase())
      || walletProfiles.get(String(wallet || '').toLowerCase())
      || null;
  }
  return walletProfiles[short] || walletProfiles[short.toUpperCase()] || null;
}

/**
 * Soft keys for every open row still on the scan JSON board.
 * Used to exempt still-open scan tickets from freshness prune.
 */
export function collectScanSoftKeys(posFiles) {
  const keys = new Set();
  for (const { data: posData, mkt } of posFiles || []) {
    if (!posData) continue;
    for (const sport of SPORTS) {
      const sportGames = posData[sport] || {};
      for (const [gameKey, gd] of Object.entries(sportGames)) {
        for (const pos of (gd.positions || [])) {
          if (!pos?.wallet || !pos?.side) continue;
          keys.add(softPositionKey(pos.wallet, sport, gameKey, mkt, pos.side));
        }
      }
    }
  }
  return keys;
}

/**
 * Proven (CONFIRMED|FLAT) scan-board positions that clear the SHADOW size
 * floor — same population writeSharpActions is willing to upsert.
 *
 * @returns {object[]} Firestore-shaped position rows (not yet written)
 */
export function collectScanBoardProvenPositions({
  posFiles,
  walletProfiles,
  excludedSet = null,
  date = null,
  shadowMin = SCAN_BOARD_SHADOW_MIN,
  polyData = null,
} = {}) {
  const out = [];
  for (const { data: posData, mkt } of posFiles || []) {
    if (!posData) continue;
    for (const sport of SPORTS) {
      const sportGames = posData[sport] || {};
      for (const [gameKey, gd] of Object.entries(sportGames)) {
        for (const pos of (gd.positions || [])) {
          const wallet = String(pos.wallet || '');
          const wLower = wallet.toLowerCase();
          if (!wLower || !pos.side) continue;
          if (excludedSet?.has(wLower)) continue;
          const title = pos.title || '';
          const slug = pos.slug || pos.eventSlug || '';
          const fgOk = String(mkt || '').toUpperCase() === 'TOTAL'
            ? acceptFullGameTotalPosition({
              title, slug, entryLine: pos.entryLine ?? pos.totalLine ?? null,
            }).ok
            : acceptFullGameSidePosition({
              title,
              slug,
              conditionId: pos.conditionId,
              fgConditionId: polyData?.[sport]?.[gameKey]?.polyMl?.conditionId,
              marketType: mkt,
              sport,
            }).ok;
          if (!fgOk) continue;

          const profile = profileFor(walletProfiles, wallet);
          const tier = String(profile?.bySport?.[sport]?.whitelistTier || '').toUpperCase();
          if (!PROVEN_TIERS.has(tier)) continue;

          const { usual: avgBet } = resolveSportUsualBet({
            sport,
            profile,
            fallback: pos.avgSportBet || 0,
          });
          const invested = Number(pos.invested) || 0;
          if (!(avgBet > 0) || !(invested > 0)) continue;
          const rawMult = invested / avgBet;
          if (rawMult < shadowMin) continue;

          const sizeRatio = +rawMult.toFixed(4);
          out.push({
            _id: date
              ? `${date}_${sport}_${gameKey}_${wallet.slice(-8)}_${mkt}_${pos.side}`
              : null,
            _hydratedFromScan: true,
            date: date || null,
            sport,
            gameKey,
            away: gd.away || null,
            home: gd.home || null,
            wallet,
            walletShort: shortId(wallet),
            marketType: mkt,
            side: pos.side,
            invested,
            size: Number(pos.size) || invested,
            avgPrice: Number(pos.avgPrice) || 0,
            curPrice: Number(pos.curPrice) || 0,
            avgSportBet: avgBet,
            betMultiplier: sizeRatio,
            // Sport-local — do NOT stamp cross-sport v8_sizeRatio here.
            // positionToWalletDetail prefers v8_sizeRatio; leaving it unset
            // lets invested/avgSportBet (sport-local) drive size.
            v8_sizeRatio: sizeRatio,
            sportROI: Number(pos.sportROI) || 0,
            sportPnlTotal: Number(pos.sportPnlTotal) || 0,
            totalPnl: Number(pos.totalPnl) || 0,
            entryLine: pos.entryLine ?? null,
            title: pos.title || null,
            slug: pos.slug || null,
            asset: pos.asset || null,
            conditionId: pos.conditionId || null,
            status: 'PENDING',
            qualificationTier: rawMult >= 0.75 ? 'VAULT' : 'SHADOW',
            vaultQualified: rawMult >= 0.75,
          });
        }
      }
    }
  }
  return out;
}

/**
 * Append scan-board proven rows missing from the live Firestore set.
 * Live rows win on soft-key collision (keep Firestore truth when present).
 */
export function mergeScanBoardIntoLive(livePositions, scanPositions) {
  const live = Array.isArray(livePositions) ? [...livePositions] : [];
  const have = new Set(live.map(positionSoftKey).filter(Boolean));
  let added = 0;
  for (const p of scanPositions || []) {
    const k = positionSoftKey(p);
    if (!k || have.has(k)) continue;
    live.push(p);
    have.add(k);
    added += 1;
  }
  return { positions: live, added };
}

/**
 * Map positions → walletDetails with sport-local sizeRatio for stake math.
 * Fixes cross-sport avgSportBet / v8_sizeRatio starving HC (≥1.5×) for
 * wallets that Action shows as Press on sport-usual.
 */
export function mapPositionsToStakeWalletDetails(positions, sport, walletProfiles) {
  if (!Array.isArray(positions)) return [];
  const out = [];
  for (const p of positions) {
    const d = positionToWalletDetail(p);
    if (!d) continue;
    const profile = profileFor(walletProfiles, d.wallet || p.wallet);
    const sp = sport || p.sport;
    const sr = stakeSizeRatio(d, profile, sp);
    if (Number.isFinite(sr) && sr > 0) d.sizeRatio = sr;
    out.push(d);
  }
  return out;
}

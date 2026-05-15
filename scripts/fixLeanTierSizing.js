/**
 * fixLeanTierSizing.js — DEPRECATED / RETIRED (AGS-Unified v9)
 * ============================================================
 *
 * This script is a v7.0-era hotfix that no longer makes sense under
 * AGS-Unified v9 sizing, and running it would actively REGRESS today's
 * slate. It is intentionally a hard-fail no-op now so nobody invokes it
 * by reflex.
 *
 * What this script used to do
 * ---------------------------
 * Under v7.0, the live wallet-consensus Σ ladder treated Σ = Δw+Δq ∈ {3,4}
 * as a "LEAN" tier that was supposed to ship at 0u (tracked-only). A
 * bug in the early SharpFlow.jsx clamp logic was letting LEAN picks
 * still stamp peak.units = 0.5 (or worse, ride forward at v6.6 sizing
 * of 1u/2u/3u) on Firestore. This script swept the slate, classified
 * each side via lockTierFromDeltas(Δw, Δq), and forcibly zeroed
 * peak.units / lock.units on any LEAN side.
 *
 * Why it must not run under AGS-U v9
 * ----------------------------------
 * AGS-Unified v9 replaced the Σ ladder entirely:
 *   - LEAN tier (AGS-U ∈ [q40, q60)) ships at 0.50× the base stake
 *     (≈0.5u SPREAD/TOTAL, ≈0.8u ML) — it is NOT a 0u tracked tier
 *     anymore.
 *   - Tier is derived from AGS-U via agsTierFromValue + agsSizeMultiplier
 *     in src/lib/ags.js, NOT from Δw / Δq sums.
 *   - Hard mute (0u) is the FADE tier (AGS-U < q20), gated on
 *     meetsAgsHardMute + AGS_MIN_PROVEN_WALLETS proven floor.
 *
 * If this script were run today it would:
 *   1. Re-zero every LEAN-tier side whose Δw/Δq happen to fall in
 *      {3,4}, overwriting the cron-stamped 0.5× units the user is
 *      already seeing on the locked-picks page.
 *   2. Stamp v8_lockTier = 'LEAN' on those sides (a v7 tier-string,
 *      not the v9 canonical tier).
 *   3. Force the grader to book them at 0u PnL even though the user's
 *      actual stake under v9 is non-zero.
 *
 * The canonical AGS-U v9 lock/mute/size path is implemented in
 * scripts/syncPickStateAuthoritative.js (server cron) and stamped on
 * every cycle. There is no remaining need for a side-channel sizing
 * patcher: if the cron disagrees with the doc, the cron is right.
 *
 * If you actually need to repair a damaged slate, write a brand-new
 * script that drives off computeAgsFromPositions / agsSizeMultiplier
 * — do NOT resurrect this one.
 */

console.error('[fixLeanTierSizing] RETIRED — see header comment.');
console.error('  This script encodes the v7.0 Σ-ladder LEAN→0u rule and');
console.error('  WILL regress AGS-U v9 sizing if run. Canonical sizing is');
console.error('  owned by scripts/syncPickStateAuthoritative.js (server cron).');
console.error('  If you need to repair a slate, build a new patcher on top of');
console.error('  computeAgsFromPositions / agsSizeMultiplier in src/lib/ags.js.');
process.exit(1);

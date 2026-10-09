/**
 * Press ladder — the authoritative stake policy from PRESS_LADDER_FROM.
 *
 * Research (Aug 1 → Oct 5, 3,184 V12 sides, day-of inputs): the side wins
 * when a seasoned wallet sizes up on it, the money is with it, and no
 * informed wallet is against it. Agreement, quality margin, form, history
 * vs price and every rescue path were negative without a press.
 *
 * Gate (all four, read from the live walletDetails each cycle until T-15):
 *   1. money share   Σ$ FOR ÷ Σ$ (FOR + AG) ≥ 0.60
 *   2. seasoned press ≥1 FOR wallet with sport book n ≥ 15 and
 *                    sizeRatio ≥ 1.5 (invested ÷ sport-local usual stake)
 *   3. no Door-2 AG  zero AG wallets whose sport book is Door-2 CONFIRMED
 *                    (n ≥ 6, WR ≥ 55, $ROI > 3 — whitelistTier.js)
 *   4. Door-2 FOR    ≥1 FOR wallet whose sport book is Door-2 CONFIRMED
 *
 * Ladder (1–5u) from the biggest seasoned press on the side:
 *   band  ≥3× → 5 · ≥2× → 4 · else 3
 *   price −0 clean (no steam, not a heavy ML favorite ≥ 60% implied)
 *         −1 moved and FOR-wallet edge ≥ 0
 *         −2 moved and FOR-wallet edge < 0
 *   units band − step (floor 1) for bands 5 and 3; band 4 is cut to
 *         2 / 1 / 2 (PRESS_BAND_4_UNITS, 2026-10-09); a side under .50
 *         implied is capped at 1u whatever the band (PRESS dog cap).
 *   edge = mean sport WR of FOR wallets with n ≥ 10, minus the implied win %
 *          of the ticket price (ML) or 52.4 (spreads / totals at −110).
 *
 * Rescue rung R6 (2u, re-sized 2026-10-07 from 1u on 20-9 +27.9%) when gate 2
 * fails: ≥2 FOR wallets with n ≥ 15 each at sizeRatio ≥ 1.0, zero Door-2 AG,
 * money ≥ 0.60. Removed if 60 stamped R6 plays are negative.
 *
 * Exception rung PRESS-X (3u steam off / 2u steam on) when ONLY gate 3 fails: gates 1, 2, 4 pass,
 * Door-2 margin (FOR − AG) ≥ 1, and every Door-2 AG wallet is betting under
 * its own sport-local usual size (sizeRatio < 1.0). Research on the 99
 * gate-3-only failures: 18-5 +32.5% (P2 +33.5%, P3 +31.5%), fourteen
 * different lead pressers. Tied/negative margin −2.4%; AG at/over normal
 * size −4.8%; more presses FOR did not rescue (−7.5%). No price step; the
 * audit split is steam off 13-3 +46.5% (3u) / steam on 5-2 +0.5% (2u).
 * Judged in the stamp record like R6.
 *
 * Rung PRESS-N when gate 4 fails with nothing informed on either side:
 * money ≥ 0.60, seasoned press ≥ 1.5×, zero Door-2 FOR and zero Door-2 AG,
 * and the biggest presser's sport book has ≥ 50 bets → 3u clean and moved
 * (moved raised to 3u 2026-10-09 on 23-11 +8.0%)
 * (clean re-sized 2026-10-07 from 2u on 43-21 +27.4%).
 * Research: 66-32 +20.6% flat (P1 +20.7%, P2 +13.3%, P3 +26.7%), 21 lead
 * pressers; clean 42-18 +32.7%, moved 24-14 +1.6%; presser with 30-49 bets
 * was 10-11 −25.0%, so the depth line is part of the rule.
 *
 * Rescue rung PRESS-U (2u from 2026-10-09; 1u at launch) when gate 2 fails for the same shape: money ≥ 0.60,
 * Door-2 FOR ≥ 1, Door-2 margin ≥ 1, every Door-2 AG wallet under 1.0× its
 * usual size, no seasoned press. Research 18-11 +11.9% (P2 −15.5%, P3 +26.4%)
 * on 29 plays — directional, not period-confirmed; shipped at 1u on the R6
 * contract (promote after 60 stamped plays positive, remove if 60 negative).
 *
 * Rescue rung STEAM-C (2u, re-sized 2026-10-07 from 1u) — the market overrules a small dissent. Pinnacle
 * steam is ON toward this side (the same steamOn the price step reads),
 * ≥1 Door-2 AG wallet, Door-2 margin (FOR − AG) ≤ 0, every Door-2 AG wallet
 * under 1.0× its usual size, and no seasoned press against (AG n ≥ 15 at
 * ≥ 1.5×). No money gate. Research on the steam era (Aug 19 → Oct 5, 2,352
 * sides at 0u): 57-27 +31.6% flat, positive in all four half-months
 * (+16.8 · +51.5 · +28.6 · +21.3), ML 27-14 / spread 8-3 / total 22-10,
 * already-on 27-14 / arriving 30-13, 28 of 39 days positive; p 0.0001 vs
 * the 0u pile. The same wallet shape with steam OFF is 134-167 −17.6%, and
 * steam toward a side the proven wallets are FOR is negative (margin ≥ +1
 * with steam 88-101 −16.0%) — steam only matters as the book disagreeing
 * with a proven wallet. A Door-2 AG at/over 1.0× (43-49 −3.5%) or a press
 * against (35-41 −6.4%) kills it. Removed if 60 stamped plays are negative.
 *
 * Rescue rung STEAM-S (2u, from STEAM_S_FROM) — the market overrules a
 * seasoned wallet's ordinary bet. Pinnacle steam is ON toward this side,
 * no seasoned press on either side, ≥1 AG wallet with the biggest AG at
 * 1.0–1.5× its usual (a normal-size bet, not a press and not dust),
 * seasoned (n ≥ 15) wallets AG ≥ seasoned FOR with at least one seasoned
 * AG, money FOR 0.20–0.60 (the 50/50 book the ladder has no rung for), and
 * the side is not a long dog (implied ≥ 0.40; fail-closed without odds).
 * Research on the steam era (Aug 19 → Oct 5, every V12 side): 27-6 +55.2%
 * flat (P2 10-2 · P3 17-4), positive in all four half-months, 0u part
 * 19-5 +48.5%, ML 11-3 / spread 5-2 / total 11-1, MLB 20-4 / other 7-2,
 * already-on 14-5 / arriving 13-1. The same wallet shape with steam OFF is
 * 18-28 −24.4%; with the AG under 1.0× 8-5 (0u 4-4, STEAM-C's territory);
 * when our seasoned wallets outnumber theirs (margin ≥ 1) steam confirming
 * the lean is 45-36 with the 0u part 25-27 — so the rung stops at even.
 * One wallet (…4b912c) is the seasoned AG on 17 of 30 open plays; without
 * it 12-1. Same promotion contract as R6. Sits after STEAM-C and R6 in
 * the ladder; never overlaps a money-gated rung (money < 0.60 here).
 *
 * Rescue rung SOLO-Q (1u, from SOLO_Q_FROM) — the quiet unopposed favourite.
 * Zero wallets against, Pinnacle steam OFF toward the side, implied in
 * [0.50, 0.60), and the FOR side is either dust (every FOR wallet under
 * 0.75× its usual) or one ordinary bet (biggest FOR 1.0–1.5×) from a wallet
 * whose sport last-10 is hot (≥ 8 decided, ≥ 70% won). Research on the
 * steam era (Aug 19 → Oct 5, all 590 unopposed V12 sides): 61-26 +31.1%
 * flat, 0u part 59-25 +31.3%, P2 22-10 · P3 39-16, every half positive,
 * 7 of 8 weeks positive, max drawdown 4.0u, calibration +17pp; ML 18-4 /
 * spread 18-9 / total 25-13; MLB 29-9, football/hockey/WNBA 29-16; without
 * the two busiest wallets 40-15. Dust 47-23, ordinary+hot 14-3. Every
 * neighbour fails: steam ON 10-10, implied .60–.70 18-16, .40–.50 15-35
 * −41.9%, light band (.75–1×) 9-15, ordinary without hot form 7-15, a single
 * dust wallet against 33-28. Pre-steam weeks (Aug 1–18, no steam tape) were
 * 19-23 for the shape — the one control against it. Price comes first on the
 * unopposed book (under 50% implied 60-109 −28%); steam toward a lonely side
 * reads the opposite way from the opposed book (market caught up, price
 * gone). Same promotion contract as R6. Sits after STEAM-S; the money gate
 * passes trivially on an unopposed side so it must stay below every
 * money-gated rung. Fails closed without lock odds.
 *
 * FADE-F (from FADE_F_FROM) — the lone streaking loser. A floor wallet is a
 * wallet whose sport book is n ≥ 15 at WR ≤ 45 (the mirror of Door 2). When
 * exactly one floor wallet is in the market (both sides), it is on a 3+
 * bet losing streak across its recent action, it bet under 1.5× its usual,
 * and its side is priced under 65% implied, the market is a FLOOR-FADE
 * market and the floor side loses. Two policies, both fail-closed:
 *   veto  — our side IS the floor side → 0u whatever rung fired
 *           (reason fade_f_veto_of_<rung>:...; mutedBy FADE_F_VETO_MUTED_BY)
 *   rescue — our side is AGAINST the floor side and no rung fired → 2u
 *           (tier FADE-F). A side already staked keeps its stake (3-4 on
 *           the staked part; the lift is in the 0u part).
 * Research, market level (Source B, Apr 19 → Oct 4, 340 clean markets):
 * floor side 89-251 −12.5pp, fade +18.0% at the inferred price and
 * 70-139 +22.9% at the other side's real paid odds; every period negative;
 * the same shape with streak 0–2 is −1.0pp. On V12 sides (Aug 1 → Oct 5):
 * pick against the floor side 34-19 +17.9%, 0u part 31-15 +24.2% (era
 * 22-14, pre 9-1, steam off 23-8), control without the streak 99-82 +1.1%;
 * pick is the floor side 17-33 −33.2% (0u 16-29, staked 1-4), control
 * 109-107. Streak read from the merged bySport[*].form.recentAction
 * (career, pushes skipped). Same promotion contract as R6.
 *
 * Rescue rung PRESS-M (1u, from PRESS_M_FROM) — the mirror. When the V12
 * side of a market is at 0u under this ladder and the OTHER side carries the
 * shape (money ≥ 0.60, seasoned press ≥ 1.5×, zero Door-2 against; Door-2
 * FOR either way) while its own v12 score is ≤ 0, that other side is staked
 * 1u. Never while any sibling side carries units; the V12 side is
 * superseded while the mirror is live. See evaluatePressMirror().
 *
 * TRUST layer (from TRUST_FROM, 2026-10-09) — wallet trust status
 * (src/lib/walletTrustStatus.js: tier floors on the wallet's running edge
 * vs its own prices + last-10 form, walked forward per wallet × sport, read
 * from profile.bySport[sport].trust). Live book Jun 1 → Oct 9, moneylines:
 * a tier-4+ form-ON wallet FOR 120-60 66.7% +21.1% (554u → +116.7u) vs
 * 259-217 54.4% +2.2% without (p = .023); MLB ML 81-37 vs 172-167 (p = .003);
 * every month ≥ 60.5%. Spreads + totals 97-94 vs 198-195 (p = .95) — no
 * gate there; the market-level status is stamped as a shadow.
 *   • Every side carries v8_trust* (FOR / AG statuses, sport + market gate).
 *   • TRUST-G (1u): moneyline the ladder left at gate_fail / 0u, legacy V12
 *     sizing would have staked it, and a tier-4+ form-ON wallet is FOR.
 *     Retro cell Aug 1 → Oct 5: 34-21 61.8% +12.3%, every one gate_fail.
 *   • Gated ML floor (2026-10-09 evening): a staked moneyline rung
 *     (TRUST-G excepted) with a trusted wallet FOR and the side's implied in
 *     [ML_FLOOR_IMPLIED_MIN, ML_FLOOR_IMPLIED_MAX) floors at ML_FLOOR_UNITS.
 *     Live book Jun 1 → Oct 9: gate ON at .50–.65 is 76-24 (+18pp vs price,
 *     every month ≥ 11pp except Oct), the sub-3u part 20-4; gate OFF at the
 *     same prices 36-48 in the sub-3u part. A blanket floor replayed −36u;
 *     this one +43u at 4u, same drawdown. Under .50 the price is the edge
 *     and the gate adds nothing (the PRESS dog cap stands); .65+ loses
 *     with or without the gate. oddsCap at the call site still rules.
 *   • Spreads / totals cap at ST_CAP_UNITS.
 *   • v8_trustLift: shadow flag on gated moneyline rungs — no units beyond
 *     the floor yet.
 *
 * Everything else between the v12 score gate and the odds cap (HC ladder,
 * rescues, floors, tape, EDGE bands, the mute chain, HARD+ layer, form×tier)
 * is retired for pickDate ≥ PRESS_LADDER_FROM. The v12 score > 0 gate,
 * manual stake, oddsCap, operator kill and the T-15 freeze stay.
 *
 * Fail-closed: missing walletDetails or profiles → nothing fires (0u).
 */
import { isConfirmedSportRec } from './whitelistTier.js';
import { stakeSizeRatio } from './sizeRatioBands.js';
import { isTrustedWallet, isTrustOn, isTrustOff, TRUST_TIER_MIN } from './walletTrustStatus.js';

/** Stakes follow the press ladder for pick dates on/after this. */
export const PRESS_LADDER_FROM = '2026-10-06';
/** Shadow stamps (v8_press*) are written from this date regardless. */
export const PRESS_STAMP_FROM = '2026-10-06';

export const PRESS_MONEY_MIN = 0.6;
export const PRESS_SEASONED_N = 15;
export const PRESS_RATIO_MIN = 1.5;
export const PRESS_BAND_5 = 3.0;
export const PRESS_BAND_4 = 2.0;
export const PRESS_EDGE_MIN_N = 10;
export const PRESS_HEAVY_FAV_IMPLIED = 0.60;
/** PRESS band 4 units by price step [clean, moved edge ≥ 0, moved edge < 0] (cut 2026-10-09). */
export const PRESS_BAND_4_UNITS = [2, 1, 2];
/** PRESS dog cap (2026-10-09): side implied under this → PRESS_DOG_UNITS whatever the band. */
export const PRESS_DOG_IMPLIED_MAX = 0.50;
export const PRESS_DOG_UNITS = 1;
export const PRESS_ST_IMPLIED_PCT = 52.4;

/**
 * Rung sizing (re-sized 2026-10-07 from the Aug 1 → Oct 5 audit, every
 * rung re-run on the live wallet rows with the live oddsCap; yardstick is
 * PRESS band 3 clean, 3u for 31-22 +8.9% flat):
 *   STEAM-C 1u → 2u     57-27 +31.6%, +18.5pp, 4/4 half-months positive
 *   PRESS-N clean 2u → 3u   43-21 +27.4%; moved 1u → 3u on 2026-10-09 (23-11 +8.0%)
 *   PRESS-U 1u → 2u on 2026-10-09 (18-11 +11.9%)
 *   PRESS band 4 cut to 2 / 1 / 2 and the PRESS dog cap added 2026-10-09 (see pressUnits)
 *   PRESS-X 2u → 3u steam off (13-3 +46.5%); steam on stays 2u (5-2 +0.5%)
 *   STEAM-S 1u → 2u     17-5 +45.5% (27-6 in its research)
 *   PRESS-R6 1u → 2u    20-9 +27.9%
 *   FADE-F 1u → 2u      29-14 +24.0%
 * PRESS-U, SOLO-Q and PRESS-M stay 1u. Locked sides keep the units they
 * were sealed with (the T-15 freeze), so the new sizes reach unlocked
 * sides on the next sync.
 */
export const R6_MIN_VETERANS = 2;
export const R6_RATIO_MIN = 1.0;
export const R6_UNITS = 2;

/** PRESS-X: Door-2 margin (FOR − AG) must be at least this. */
export const PRESS_X_MIN_MARGIN = 1;
/** PRESS-X: every Door-2 AG wallet must be under this × its usual size. */
export const PRESS_X_AG_RATIO_MAX = 1.0;
/** PRESS-X: 3u with steam off, 2u with steam on (the only split it has). */
export const PRESS_X_UNITS = 3;
export const PRESS_X_UNITS_STEAM_ON = 2;
/** PRESS-N: no Door-2 wallet on either side; presser book must be this deep. */
export const PRESS_N_MIN_PRESSER_N = 50;
/** PRESS-N: 3u clean and moved (moved raised from 1u 2026-10-09; 23-11 +8.0%). */
export const PRESS_N_UNITS_CLEAN = 3;
export const PRESS_N_UNITS_MOVED = 3;
/** PRESS-U: the same shape with no seasoned press (2u from 2026-10-09; 18-11 +11.9%). */
export const PRESS_U_UNITS = 2;
/** STEAM-C: Door-2 margin (FOR − AG) must be at most this. */
export const STEAM_C_MAX_MARGIN = 0;
export const STEAM_C_UNITS = 2;

/**
 * STEAM-S (2u, from STEAM_S_FROM) — steam toward this side against a
 * seasoned wallet's normal-size bet, on the no-press 50/50 book.
 */
export const STEAM_S_FROM = '2026-10-07';
export const STEAM_S_UNITS = 2;
/** STEAM-S: biggest AG wallet's size ratio must sit in [MIN, MAX). */
export const STEAM_S_AG_RATIO_MIN = 1.0;
export const STEAM_S_AG_RATIO_MAX = 1.5;
/** STEAM-S: money share FOR must sit in [MIN, MAX). */
export const STEAM_S_MONEY_MIN = 0.2;
export const STEAM_S_MONEY_MAX = 0.6;
/** STEAM-S: side implied win % must be at least this (no long dogs). */
export const STEAM_S_IMPLIED_MIN = 0.40;

/**
 * SOLO-Q (1u, from SOLO_Q_FROM) — the quiet unopposed favourite. Zero wallets
 * against, steam off, implied in [MIN, MAX), and the FOR side is either dust
 * (every FOR under DUST_MAX of usual) or one ordinary bet (biggest FOR in
 * [ORD_MIN, ORD_MAX)) from a wallet whose sport last-10 is hot.
 */
export const SOLO_Q_FROM = '2026-10-07';
export const SOLO_Q_UNITS = 1;
export const SOLO_Q_IMPLIED_MIN = 0.50;
export const SOLO_Q_IMPLIED_MAX = 0.60;
/** SOLO-Q dust: biggest FOR size ratio under this (unknown ratio counts as dust). */
export const SOLO_Q_DUST_MAX = 0.75;
/** SOLO-Q ordinary bet: biggest FOR size ratio in [MIN, MAX). */
export const SOLO_Q_ORD_MIN = 1.0;
export const SOLO_Q_ORD_MAX = 1.5;
/** SOLO-Q hot form: sport last-10 with at least HOT_N decided and HOT_WR win share. */
export const SOLO_Q_HOT_N = 8;
export const SOLO_Q_HOT_WR = 0.70;

/**
 * PRESS-M (mirror, 1u) — the ladder's shape on the side V12 did not promote.
 * Fires only when the V12 side of the same market sits at 0u and the other
 * side carries money ≥ 0.60, a seasoned press ≥ 1.5× and zero Door-2 wallet
 * against it (Door-2 FOR either way). Research Aug 1 → Oct 5 on 0u V12
 * sides whose opposite side had this shape: V12 side 30-66 flat; the mirror
 * 66-30 +20.4% (P1 13-7 · P2 23-13 · P3 30-10), 36 distinct pressers;
 * no Door-2 on either side 36-14, full PRESS shape 30-16. One side per
 * market: the V12 side is superseded while the mirror is live and the
 * mirror never fires when any sibling side carries units.
 */
export const PRESS_M_FROM = '2026-10-07';
export const PRESS_M_UNITS = 1;
export const PRESS_M_STAKE_TIER = 'PRESS-M';
export const PRESS_M_SUPERSEDED_REASON = 'press_m_mirror';

/**
 * FADE-F (from FADE_F_FROM) — the lone streaking loser. Floor wallet = sport
 * book n ≥ PRESS_SEASONED_N at WR ≤ FADE_F_FLOOR_WR_MAX. Exactly one floor
 * wallet in the market, on a losing streak ≥ FADE_F_STREAK_MIN, bet under
 * FADE_F_RATIO_MAX of its usual, its side under FADE_F_FLOOR_IMPLIED_MAX.
 * Against us at 0u → 2u rescue; for us → veto (0u).
 */
export const FADE_F_FROM = '2026-10-07';
export const FADE_F_UNITS = 2;
export const FADE_F_STAKE_TIER = 'FADE-F';
export const FADE_F_VETO_MUTED_BY = 'fade-f-veto';
export const FADE_F_FLOOR_WR_MAX = 45;
export const FADE_F_STREAK_MIN = 3;
export const FADE_F_RATIO_MAX = 1.5;
export const FADE_F_FLOOR_IMPLIED_MAX = 0.65;

export const PRESS_STAKE_TIER = 'PRESS';
export const PRESS_R6_STAKE_TIER = 'PRESS-R6';
export const PRESS_X_STAKE_TIER = 'PRESS-X';
export const PRESS_U_STAKE_TIER = 'PRESS-U';
export const PRESS_N_STAKE_TIER = 'PRESS-N';
export const STEAM_C_STAKE_TIER = 'STEAM-C';
export const STEAM_S_STAKE_TIER = 'STEAM-S';
export const SOLO_Q_STAKE_TIER = 'SOLO-Q';
export const PRESS_GATE_MUTED_BY = 'press-gate';

// TRUST layer — see header. Sport-level status feeds the moneyline gate;
// market-level status is a shadow stamp for spreads / totals.
export const TRUST_FROM = '2026-10-09';
export const TRUST_G_STAKE_TIER = 'TRUST-G';
export const TRUST_G_UNITS = 1;
/** Staked moneyline rungs with a trusted wallet FOR floor here inside the implied window (TRUST-G exempt). */
export const ML_FLOOR_UNITS = 4;
export const ML_FLOOR_IMPLIED_MIN = 0.50;
export const ML_FLOOR_IMPLIED_MAX = 0.65;
/** Spread / total rungs cap here. */
export const ST_CAP_UNITS = 2;
export { TRUST_TIER_MIN };

export function isTrustLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TRUST_FROM;
}

export function isSteamSLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= STEAM_S_FROM && isPressLadderLive(pickDate);
}

export function isSoloQLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= SOLO_Q_FROM && isPressLadderLive(pickDate);
}

export function isFadeFLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= FADE_F_FROM && isPressLadderLive(pickDate);
}

/**
 * Career losing streak from the profile's recent action: every
 * bySport[*].form.recentAction row merged and sorted by date (stable, so
 * same-day rows keep export order), pushes (settledPnl 0) skipped, trailing
 * consecutive losses counted. 0 when there is no decided action.
 */
export function careerLossStreak(profile) {
  const bySport = profile?.bySport;
  if (!bySport || typeof bySport !== 'object') return 0;
  const rows = [];
  for (const rec of Object.values(bySport)) {
    const ra = rec?.form?.recentAction;
    if (!Array.isArray(ra)) continue;
    for (const r of ra) {
      if (!r || typeof r !== 'object') continue;
      const pnl = Number(r.settledPnl);
      const won = Number(r.won) === 1;
      if (!won && Number.isFinite(pnl) && pnl === 0) continue; // push
      rows.push({ date: String(r.date || ''), won });
    }
  }
  if (rows.length === 0) return 0;
  rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  let streak = 0;
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].won) break;
    streak++;
  }
  return streak;
}

/** Floor 2: the mirror of Door 2 — a seasoned sport book at WR ≤ FADE_F_FLOOR_WR_MAX. */
export function isFloor2Row(row) {
  return !!row && (Number(row.n) || 0) >= PRESS_SEASONED_N
    && Number.isFinite(row.wr) && row.wr <= FADE_F_FLOOR_WR_MAX;
}

/**
 * FLOOR-FADE read for one side from its wallet rows (both directions) and
 * the side's implied win probability.
 *   status 'BOOST'  the market's only floor wallet is AGAINST this side
 *   status 'VETO'   it is FOR this side
 *   status null     not a FLOOR-FADE market (reason says which leg failed)
 * Fail-closed: unknown size ratio or missing odds → null.
 */
export function evaluateFloorFade(rows, implied) {
  const floors = (rows || []).filter(isFloor2Row);
  const base = { status: null, floorCount: floors.length, wallet: null, dir: null, n: null, wr: null, streak: null, ratio: null, floorImplied: null };
  if (floors.length !== 1) return { ...base, reason: floors.length === 0 ? 'no_floor_wallet' : `floor_wallets_${floors.length}` };
  const f = floors[0];
  const streak = Number(f.streak) || 0;
  const ratio = Number.isFinite(f.ratio) ? f.ratio : null;
  const floorImplied = implied == null ? null : (f.dir === 'FOR' ? implied : 1 - implied);
  const info = {
    ...base,
    wallet: f.wallet, dir: f.dir, n: f.n, wr: f.wr, streak,
    ratio: ratio == null ? null : Math.round(ratio * 100) / 100,
    floorImplied: floorImplied == null ? null : Math.round(floorImplied * 1000) / 1000,
  };
  if (streak < FADE_F_STREAK_MIN) return { ...info, reason: `streak_${streak}` };
  if (ratio == null) return { ...info, reason: 'ratio_unknown' };
  if (ratio >= FADE_F_RATIO_MAX) return { ...info, reason: `pressing_${info.ratio}x` };
  if (floorImplied == null) return { ...info, reason: 'no_odds' };
  if (floorImplied >= FADE_F_FLOOR_IMPLIED_MAX) return { ...info, reason: `floor_fav_${Math.round(floorImplied * 100)}` };
  const tag = `${f.wallet}_n${f.n}_wr${Math.round(f.wr)}_streak${streak}_${info.ratio}x_floor${Math.round(floorImplied * 100)}`;
  return f.dir === 'AG'
    ? { ...info, status: 'BOOST', reason: `floor_against_${tag}` }
    : { ...info, status: 'VETO', reason: `floor_for_${tag}` };
}

/**
 * Hot sport form for SOLO-Q: last-10 decided positions in the sport, at least
 * SOLO_Q_HOT_N of them, won at SOLO_Q_HOT_WR or better. Reads the profile's
 * bySport[sport].form.actionL10 ({ w, l }); null/thin → false.
 */
export function isHotL10(l10) {
  if (!l10 || typeof l10 !== 'object') return false;
  const w = Number(l10.w) || 0;
  const l = Number(l10.l) || 0;
  const n = w + l;
  return n >= SOLO_Q_HOT_N && w / n >= SOLO_Q_HOT_WR;
}

export function isPressLadderLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= PRESS_LADDER_FROM;
}

export function isPressStampLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= PRESS_STAMP_FROM;
}

export function isPressMirrorLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= PRESS_M_FROM && isPressLadderLive(pickDate);
}

/** The pressed-side shape PRESS-M needs: money, seasoned press, zero Door-2 against. */
export function isPressMirrorShape(evalResult) {
  const g = evalResult && evalResult.gate;
  return !!(g && g.money && g.seasPress && g.noDoor2Ag);
}

/**
 * PRESS-M decision for one side.
 *   shapeEval  evaluatePressLadder() for THIS side (the pressed side)
 *   scoreV12   this side's live v12 score (null = no signal)
 *   siblings   [{ side, scoreV12, ladderUnits, stakedUnits }] for every other
 *              side of the market: ladderUnits = that side's own ladder result
 *              on the same walletDetails, stakedUnits = units it currently
 *              carries in Firestore (manual stake included).
 * Fires when the shape holds here, this side is not a V12 side (score ≤ 0 or
 * null), a V12 side exists among the siblings (score > 0) and no sibling
 * carries or would carry units. Fail-closed on missing inputs.
 */
export function evaluatePressMirror({ shapeEval, scoreV12, siblings = [] }) {
  const base = { fires: false, rung: null, units: 0, v12Side: null, v12Score: null, siblingStaked: null };
  if (!shapeEval || !Array.isArray(siblings) || siblings.length === 0) {
    return { ...base, reason: 'mirror_no_inputs' };
  }
  if (!isPressMirrorShape(shapeEval)) {
    return { ...base, reason: `mirror_shape_fail:${shapeEval.reason || 'gate'}` };
  }
  if (Number.isFinite(scoreV12) && scoreV12 > 0) {
    return { ...base, reason: 'mirror_side_is_v12' };
  }
  const v12 = siblings
    .filter((s) => Number.isFinite(s.scoreV12) && s.scoreV12 > 0)
    .sort((a, b) => b.scoreV12 - a.scoreV12)[0] || null;
  if (!v12) {
    return { ...base, reason: 'mirror_no_v12_side' };
  }
  const staked = siblings.find((s) => (Number(s.ladderUnits) || 0) > 0 || (Number(s.stakedUnits) || 0) > 0) || null;
  if (staked) {
    return {
      ...base,
      v12Side: v12.side,
      v12Score: v12.scoreV12,
      siblingStaked: staked.side,
      reason: `mirror_sibling_staked:${staked.side}`,
    };
  }
  return {
    fires: true,
    rung: PRESS_M_STAKE_TIER,
    units: PRESS_M_UNITS,
    v12Side: v12.side,
    v12Score: v12.scoreV12,
    siblingStaked: null,
    reason: `press_m_mirror_of_${v12.side}${shapeEval.gate.door2For ? '_door2' : '_no_door2'}`,
  };
}

/** The ladder eval re-labelled as PRESS-M so pressStamp() records the rung we staked. */
export function pressMirrorEval(shapeEval, mirror) {
  if (!shapeEval || !mirror || !mirror.fires) return shapeEval;
  return {
    ...shapeEval,
    rung: PRESS_M_STAKE_TIER,
    units: PRESS_M_UNITS,
    band: null,
    priceStep: null,
    reason: mirror.reason,
  };
}

/** Compact Firestore stamp for the mirror decision (null-safe for Firestore). */
export function pressMirrorStamp(mirror, shapeEval, now) {
  if (!mirror) return null;
  return {
    v8_pressMirror: {
      fires: !!mirror.fires,
      v12Side: mirror.v12Side ?? null,
      v12Score: Number.isFinite(mirror.v12Score) ? Math.round(mirror.v12Score * 1000) / 1000 : null,
      siblingStaked: mirror.siblingStaked ?? null,
      shapeRung: shapeEval?.rung ?? null,
      shapeUnits: Number.isFinite(shapeEval?.units) ? shapeEval.units : 0,
      reason: mirror.reason || null,
      at: now,
    },
  };
}

function shortId(wallet) {
  return String(wallet || '').slice(-6).toLowerCase();
}

export function profileForWallet(walletProfiles, wallet) {
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

export function impliedFromAmerican(o) {
  if (o == null || !Number.isFinite(Number(o)) || Number(o) === 0) return null;
  const n = Number(o);
  return n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
}

/**
 * Sport book for one wallet as production exports it:
 * profile.bySport[sport].positions = { n, wins, wr, invested, settledPnl, dollarRoi }.
 */
export function sportBook(profile, sport, marketType = null) {
  const rec = profile?.bySport?.[sport];
  const pos = rec?.positions;
  if (!pos || typeof pos !== 'object') return null;
  const n = Number(pos.n) || 0;
  const wr = Number(pos.wr);
  const l10 = rec?.form?.actionL10;
  const mkt = marketType ? String(marketType).toUpperCase() : null;
  return {
    n,
    wr: Number.isFinite(wr) ? wr : null,
    door2: isConfirmedSportRec(rec),
    l10: l10 && typeof l10 === 'object' ? { w: Number(l10.w) || 0, l: Number(l10.l) || 0 } : null,
    trust: trustPick(rec?.trust),
    trustMkt: mkt ? trustPick(rec?.byMarket?.[mkt]?.trust) : null,
  };
}

/** Compact trust record off a profile node; null when the export has not stamped one. */
function trustPick(t) {
  if (!t || typeof t !== 'object' || typeof t.status !== 'string') return null;
  return {
    status: t.status,
    tier: Number(t.tier) || 0,
    n: Number(t.n) || 0,
    edge: Number.isFinite(Number(t.edge)) ? Number(t.edge) : null,
    formOn: t.formOn === true,
  };
}

/**
 * Per-wallet row the gate reads: direction, dollars, sport-local size ratio,
 * sport book depth / WR / Door-2 flag, trust status (sport + market).
 */
export function pressWalletRows(walletDetails, side, sport, walletProfiles, marketType = null) {
  const rows = [];
  for (const wd of walletDetails || []) {
    if (!wd || !wd.side) continue;
    const invested = Number(wd.invested) || 0;
    if (!(invested > 0)) continue;
    const profile = profileForWallet(walletProfiles, wd.wallet);
    const book = sportBook(profile, sport, marketType);
    const sr = stakeSizeRatio(wd, profile, sport);
    rows.push({
      wallet: shortId(wd.wallet),
      dir: wd.side === side ? 'FOR' : 'AG',
      invested,
      ratio: Number.isFinite(sr) && sr > 0 ? sr : null,
      n: book?.n ?? 0,
      wr: book?.wr ?? null,
      door2: book?.door2 === true,
      l10: book?.l10 ?? null,
      streak: careerLossStreak(profile),
      trust: book?.trust ?? null,
      trustMkt: book?.trustMkt ?? null,
    });
  }
  return rows;
}

/**
 * Trust read for one side: FOR / AG wallet statuses at the sport level
 * (the moneyline gate) and the market level (shadow). `gate` = at least one
 * FOR wallet with tier ≥ TRUST_TIER_MIN and form ON.
 */
export function trustRead(rows) {
  const pack = (r, t) => ({
    wallet: r.wallet,
    status: t?.status ?? 'UNPROVEN',
    tier: t?.tier ?? 0,
    n: t?.n ?? 0,
    edge: t?.edge ?? null,
  });
  const forRows = rows.filter((r) => r.dir === 'FOR');
  const agRows = rows.filter((r) => r.dir === 'AG');
  const sportFor = forRows.map((r) => pack(r, r.trust));
  const sportAg = agRows.map((r) => pack(r, r.trust));
  const mktFor = forRows.map((r) => pack(r, r.trustMkt));
  const mktAg = agRows.map((r) => pack(r, r.trustMkt));
  const trusted = (list) => list.filter((w) => isTrustedWallet(w)).map((w) => w.wallet);
  const count = (list, fn) => list.filter((w) => fn(w.status)).length;
  return {
    gate: trusted(sportFor).length >= 1,
    gateWallets: trusted(sportFor),
    agTrusted: trusted(sportAg),
    forOn: count(sportFor, isTrustOn),
    forOff: count(sportFor, isTrustOff),
    agOn: count(sportAg, isTrustOn),
    agOff: count(sportAg, isTrustOff),
    for: sportFor,
    ag: sportAg,
    mktGate: trusted(mktFor).length >= 1,
    mktFor,
    mktAg,
    lift: false,
    rule: null,
  };
}

export function pressBand(maxRatio) {
  if (!Number.isFinite(maxRatio) || maxRatio < PRESS_RATIO_MIN) return null;
  if (maxRatio >= PRESS_BAND_5) return 5;
  if (maxRatio >= PRESS_BAND_4) return 4;
  return 3;
}

/**
 * PRESS units for a band × price step, then the dog cap (2026-10-09).
 * Bands 5 and 3 keep band − step (floor 1): 5/4/3 and 3/2/1. Band 4
 * (presser 2–3×) is cut to PRESS_BAND_4_UNITS: clean 19-17 −0.5% on the
 * Aug 1 → Oct 5 re-run (was 4u), moved edge ≥ 0 4-6 −18% (was 3u), moved
 * edge < 0 17-5 +4.9% (stays 2u). A side priced under PRESS_DOG_IMPLIED_MAX
 * implied is capped at PRESS_DOG_UNITS whatever the band: PRESS dogs were
 * 18-21 −11.6% flat, 135u → −15.5u, clean band 3 under .50 5-11. The cap
 * reads the side's own price on every market type (a +105 spread is a
 * dog); with no price there is no cap.
 */
export function pressUnits(band, priceStep, implied) {
  const step = Number.isFinite(priceStep) ? priceStep : 0;
  let units = band === 4
    ? PRESS_BAND_4_UNITS[Math.min(step, PRESS_BAND_4_UNITS.length - 1)]
    : Math.max(1, band - step);
  if (implied != null && implied < PRESS_DOG_IMPLIED_MAX) units = Math.min(units, PRESS_DOG_UNITS);
  return units;
}

export function isPressDog(implied) {
  return implied != null && implied < PRESS_DOG_IMPLIED_MAX;
}

/**
 * Mean sport WR of FOR wallets with n ≥ 10 minus the implied win % of the
 * price. Null when no FOR wallet is deep enough.
 */
export function pressEdge(rows, marketType, sideOdds) {
  const deep = rows.filter((r) => r.dir === 'FOR' && r.n >= PRESS_EDGE_MIN_N && Number.isFinite(r.wr));
  if (deep.length === 0) return null;
  const meanWr = deep.reduce((t, r) => t + r.wr, 0) / deep.length;
  let impliedPct = PRESS_ST_IMPLIED_PCT;
  if (String(marketType).toUpperCase() === 'ML') {
    const p = impliedFromAmerican(sideOdds);
    if (p != null) impliedPct = p * 100;
  }
  return meanWr - impliedPct;
}

export function isHeavyFavorite(marketType, sideOdds) {
  if (String(marketType).toUpperCase() !== 'ML') return false;
  const p = impliedFromAmerican(sideOdds);
  return p != null && p >= PRESS_HEAVY_FAV_IMPLIED;
}

export function pressPriceStep({ steamOn, heavyFav, edge }) {
  const clean = !steamOn && !heavyFav;
  if (clean) return 0;
  return edge != null && edge >= 0 ? 1 : 2;
}

/**
 * Evaluate the gate, the ladder and the R6 rung for one side.
 *
 * @returns {{
 *   gate: { money: boolean, seasPress: boolean, noDoor2Ag: boolean, door2For: boolean, pass: boolean },
 *   moneyShare: number|null, door2Ag: number, door2For: number,
 *   presser: { wallet, ratio, n, wr }|null, maxRatio: number,
 *   band: number|null, priceStep: number|null, edge: number|null,
 *   steamOn: boolean, heavyFav: boolean,
 *   veterans: Array<{ wallet, ratio, n, wr }>,
 *   dissenters: Array<{ wallet, ratio, n, wr }>,
 *   rung: 'PRESS'|'PRESS-X'|'PRESS-N'|'PRESS-U'|'STEAM-C'|'PRESS-R6'|'STEAM-S'|'SOLO-Q'|'FADE-F'|'TRUST-G'|null, units: number, reason: string,
 *   floorFade: { status: 'BOOST'|'VETO'|null, floorCount, wallet, dir, n, wr, streak, ratio, floorImplied, reason }|null,
 *   trust: { gate, gateWallets, agTrusted, forOn, forOff, agOn, agOff, for, ag, mktGate, mktFor, mktAg, lift, rule }|null
 * }}
 * pickDate gates the dated rungs (STEAM-S from STEAM_S_FROM, SOLO-Q from
 * SOLO_Q_FROM, FADE-F from FADE_F_FROM); null → those rungs stay off.
 *
 * FADE-F sits over the whole ladder: a VETO zeroes any rung the core chose
 * (reason fade_f_veto_of_<rung>:…); a BOOST stakes FADE_F_UNITS only when the
 * core left the side at 0u. Staked sides keep their rung and units.
 *
 * The TRUST layer (from TRUST_FROM) runs last: `trust` (FOR / AG statuses,
 * gate) is attached on every evaluated side; TRUST-G rescues a gate_fail
 * moneyline that legacy V12 sizing (`legacyUnits` > 0) would have staked
 * when a trusted wallet is FOR; staked moneyline rungs with a trusted wallet
 * FOR floor at ML_FLOOR_UNITS inside the implied window; spread / total
 * rungs cap at ST_CAP_UNITS. FADE-F VETO stays a veto.
 */
export function evaluatePressLadder(args = {}) {
  const core = evaluatePressLadderCore(args);
  const { pickDate = null } = args;
  const floorFade = core.floorFade ?? null;
  let out = core;
  if (floorFade && isFadeFLive(pickDate)) {
    if (floorFade.status === 'VETO') {
      const of = core.units > 0 ? core.rung : 'none';
      out = { ...core, rung: null, units: 0, reason: `fade_f_veto_of_${of}:${floorFade.reason}` };
    } else if (floorFade.status === 'BOOST' && core.units === 0) {
      out = { ...core, rung: FADE_F_STAKE_TIER, units: FADE_F_UNITS, reason: `fade_f_${floorFade.reason}` };
    }
  }
  return applyTrustLayer(out, args);
}

/**
 * Attach the trust read and, when live, apply TRUST-G / the ML floor / the
 * spread-total cap. Pure: returns a new result object.
 */
export function applyTrustLayer(result, {
  walletDetails, side, sport, marketType, walletProfiles, sideOdds = null, pickDate = null, legacyUnits = null,
} = {}) {
  const rows = (Array.isArray(walletDetails) && walletDetails.length && side && sport && walletProfiles)
    ? pressWalletRows(walletDetails, side, sport, walletProfiles, marketType)
    : [];
  const trust = rows.length ? trustRead(rows) : null;
  const out = { ...result, trust };
  if (!trust || !isTrustLive(pickDate)) return out;

  const isML = String(marketType).toUpperCase() === 'ML';
  const implied = impliedFromAmerican(sideOdds);
  const rules = [];
  const vetoed = typeof out.reason === 'string' && out.reason.startsWith('fade_f_veto');

  if (isML && out.units === 0 && !vetoed
    && typeof out.reason === 'string' && out.reason.startsWith('gate_fail')
    && Number(legacyUnits) > 0 && trust.gate) {
    out.rung = TRUST_G_STAKE_TIER;
    out.units = TRUST_G_UNITS;
    out.reason = `trust_g_for_${trust.gateWallets.join('+')}_legacy${Number(legacyUnits)}u:${out.reason}`;
    rules.push('trust_g');
  }

  const inFloorWindow = implied != null && implied >= ML_FLOOR_IMPLIED_MIN && implied < ML_FLOOR_IMPLIED_MAX;
  if (isML && out.units > 0 && out.rung !== TRUST_G_STAKE_TIER
    && trust.gate && inFloorWindow && out.units < ML_FLOOR_UNITS) {
    out.units = ML_FLOOR_UNITS;
    out.reason = `${out.reason}+ml_floor${ML_FLOOR_UNITS}_gate_${trust.gateWallets.join('+')}`;
    rules.push('ml_floor');
  }

  if (!isML && out.units > ST_CAP_UNITS) {
    out.units = ST_CAP_UNITS;
    out.reason = `${out.reason}+st_cap${ST_CAP_UNITS}`;
    rules.push('st_cap');
  }

  out.trust = {
    ...trust,
    lift: isML && out.units > 0 && out.rung !== TRUST_G_STAKE_TIER && trust.gate,
    rule: rules.length ? rules.join('+') : null,
  };
  return out;
}

function evaluatePressLadderCore({
  walletDetails,
  side,
  sport,
  marketType,
  walletProfiles,
  sideOdds = null,
  steamOn = false,
  pickDate = null,
} = {}) {
  const empty = {
    gate: { money: false, seasPress: false, noDoor2Ag: false, door2For: false, pass: false },
    moneyShare: null, door2Ag: 0, door2For: 0,
    presser: null, maxRatio: 0, band: null, priceStep: null, edge: null,
    steamOn: !!steamOn, heavyFav: isHeavyFavorite(marketType, sideOdds),
    veterans: [], dissenters: [], rung: null, units: 0, reason: 'no_wallet_details', floorFade: null,
  };
  if (!Array.isArray(walletDetails) || walletDetails.length === 0 || !side || !sport) return empty;
  if (!walletProfiles) return { ...empty, reason: 'no_wallet_profiles' };

  const rows = pressWalletRows(walletDetails, side, sport, walletProfiles, marketType);
  if (rows.length === 0) return { ...empty, reason: 'no_wallet_rows' };
  // FLOOR-FADE read is computed on every evaluated side so the stamp carries
  // it even where the policy is not live yet or the side is already staked.
  empty.floorFade = evaluateFloorFade(rows, impliedFromAmerican(sideOdds));

  const forRows = rows.filter((r) => r.dir === 'FOR');
  const agRows = rows.filter((r) => r.dir === 'AG');
  const dollarsFor = forRows.reduce((t, r) => t + r.invested, 0);
  const dollarsAll = rows.reduce((t, r) => t + r.invested, 0);
  const moneyShare = dollarsAll > 0 ? dollarsFor / dollarsAll : null;

  const seasonedFor = forRows.filter((r) => r.n >= PRESS_SEASONED_N && Number.isFinite(r.ratio));
  const pressers = seasonedFor
    .filter((r) => r.ratio >= PRESS_RATIO_MIN)
    .sort((a, b) => b.ratio - a.ratio);
  const presser = pressers[0] || null;
  const maxRatio = presser ? presser.ratio : 0;
  const door2Ag = agRows.filter((r) => r.door2).length;
  const door2For = forRows.filter((r) => r.door2).length;

  const gate = {
    money: moneyShare != null && moneyShare >= PRESS_MONEY_MIN,
    seasPress: pressers.length >= 1,
    noDoor2Ag: door2Ag === 0,
    door2For: door2For >= 1,
    pass: false,
  };
  gate.pass = gate.money && gate.seasPress && gate.noDoor2Ag && gate.door2For;

  const heavyFav = isHeavyFavorite(marketType, sideOdds);
  const edge = pressEdge(rows, marketType, sideOdds);
  const strip = (r) => ({ wallet: r.wallet, ratio: Math.round(r.ratio * 100) / 100, n: r.n, wr: r.wr });

  if (gate.pass) {
    const band = pressBand(maxRatio);
    const priceStep = pressPriceStep({ steamOn: !!steamOn, heavyFav, edge });
    const implied = impliedFromAmerican(sideOdds);
    const dog = isPressDog(implied);
    const units = pressUnits(band, priceStep, implied);
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: strip(presser), maxRatio, band, priceStep, edge,
      steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
      veterans: [],
      dissenters: [],
      rung: PRESS_STAKE_TIER, units,
      reason: `press_${band}_${priceStep === 0 ? 'clean' : (priceStep === 1 ? 'moved_edge_pos' : 'moved_edge_neg')}${dog ? '_dog_cap' : ''}`,
    };
  }

  // PRESS-X — only gate 3 failed, informed FOR outnumber informed AG, and
  // every informed AG wallet is under its own normal size.
  const dissenters = agRows.filter((r) => r.door2).sort((a, b) => b.ratio - a.ratio);
  const margin = door2For - door2Ag;
  const pressX = gate.money && gate.seasPress && gate.door2For && !gate.noDoor2Ag
    && margin >= PRESS_X_MIN_MARGIN
    && dissenters.length > 0
    && dissenters.every((r) => Number.isFinite(r.ratio) && r.ratio < PRESS_X_AG_RATIO_MAX);
  if (pressX) {
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: strip(presser), maxRatio, band: pressBand(maxRatio), priceStep: null, edge,
      steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
      veterans: [],
      dissenters: dissenters.map(strip),
      rung: PRESS_X_STAKE_TIER, units: steamOn ? PRESS_X_UNITS_STEAM_ON : PRESS_X_UNITS,
      reason: `press_x_margin${margin}_ag_under_size_steam_${steamOn ? 'on' : 'off'}`,
    };
  }

  // PRESS-N — a deep-book press with the money and no informed wallet on
  // either side. Without a Door-2 wallet to vouch, the press itself must
  // come from a long record; price moved halves it.
  const pressN = gate.money && gate.seasPress && !gate.door2For && gate.noDoor2Ag
    && presser && presser.n >= PRESS_N_MIN_PRESSER_N;
  if (pressN) {
    const moved = !!steamOn || heavyFav;
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: strip(presser), maxRatio, band: pressBand(maxRatio), priceStep: moved ? 1 : 0, edge,
      steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
      veterans: [],
      dissenters: [],
      rung: PRESS_N_STAKE_TIER, units: moved ? PRESS_N_UNITS_MOVED : PRESS_N_UNITS_CLEAN,
      reason: `press_n_deep${presser.n}_${moved ? 'moved' : 'clean'}`,
    };
  }

  // PRESS-U — the PRESS-X shape with no seasoned press: proven FOR outnumber
  // proven AG and every proven AG wallet is under its own normal size. 1u.
  const pressU = gate.money && !gate.seasPress && gate.door2For && !gate.noDoor2Ag
    && margin >= PRESS_X_MIN_MARGIN
    && dissenters.length > 0
    && dissenters.every((r) => Number.isFinite(r.ratio) && r.ratio < PRESS_X_AG_RATIO_MAX);
  if (pressU) {
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: null, maxRatio, band: null, priceStep: null, edge,
      steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
      veterans: [],
      dissenters: dissenters.map(strip),
      rung: PRESS_U_STAKE_TIER, units: PRESS_U_UNITS,
      reason: `press_u_margin${margin}_ag_under_size_no_press`,
    };
  }

  // STEAM-C — the market overrules a small dissent: Pinnacle steam toward
  // this side, proven wallets net against (margin ≤ 0) but every one of
  // them under its own normal size, and nobody seasoned pressing against.
  const pressAg = agRows.some((r) => r.n >= PRESS_SEASONED_N && Number.isFinite(r.ratio) && r.ratio >= PRESS_RATIO_MIN);
  const steamC = !!steamOn && !gate.noDoor2Ag
    && margin <= STEAM_C_MAX_MARGIN
    && dissenters.length > 0
    && dissenters.every((r) => Number.isFinite(r.ratio) && r.ratio < PRESS_X_AG_RATIO_MAX)
    && !pressAg;
  if (steamC) {
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: presser ? strip(presser) : null, maxRatio, band: null, priceStep: null, edge,
      steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
      veterans: [],
      dissenters: dissenters.map(strip),
      rung: STEAM_C_STAKE_TIER, units: STEAM_C_UNITS,
      reason: `steam_c_margin${margin}_ag_under_size_steam_on`,
    };
  }

  // R6 — two veterans at normal size, only when there is no seasoned press.
  const veterans = seasonedFor.filter((r) => r.ratio >= R6_RATIO_MIN).sort((a, b) => b.ratio - a.ratio);
  const r6 = !gate.seasPress
    && veterans.length >= R6_MIN_VETERANS
    && gate.noDoor2Ag
    && gate.money;
  if (r6) {
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: null, maxRatio, band: null, priceStep: null, edge,
      steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
      veterans: veterans.map(strip),
      dissenters: [],
      rung: PRESS_R6_STAKE_TIER, units: R6_UNITS,
      reason: 'r6_two_veterans',
    };
  }

  // STEAM-S — the market overrules a seasoned wallet's ordinary bet. Steam
  // toward this side, nobody pressing on either side, the biggest AG at a
  // normal size (1.0–1.5×), seasoned wallets AG ≥ seasoned FOR, money FOR
  // in the 50/50 band (0.20–0.60), and not a long dog. Dated rung.
  const seasonedForN = forRows.filter((r) => r.n >= PRESS_SEASONED_N).length;
  const seasonedAgN = agRows.filter((r) => r.n >= PRESS_SEASONED_N).length;
  const agMaxRatio = agRows.length
    ? Math.max(...agRows.map((r) => (Number.isFinite(r.ratio) ? r.ratio : 0)))
    : null;
  const implied = impliedFromAmerican(sideOdds);
  const steamS = isSteamSLive(pickDate)
    && !!steamOn
    && !gate.seasPress
    && !pressAg
    && agRows.length >= 1
    && agMaxRatio != null && agMaxRatio >= STEAM_S_AG_RATIO_MIN && agMaxRatio < STEAM_S_AG_RATIO_MAX
    && seasonedAgN >= 1
    && seasonedForN <= seasonedAgN
    && moneyShare != null && moneyShare >= STEAM_S_MONEY_MIN && moneyShare < STEAM_S_MONEY_MAX
    && implied != null && implied >= STEAM_S_IMPLIED_MIN;
  if (steamS) {
    const opponents = agRows
      .filter((r) => r.n >= PRESS_SEASONED_N)
      .sort((a, b) => (b.ratio || 0) - (a.ratio || 0));
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: null, maxRatio, band: null, priceStep: null, edge,
      steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
      veterans: veterans.map(strip),
      dissenters: opponents.map((r) => ({ wallet: r.wallet, ratio: Math.round((r.ratio || 0) * 100) / 100, n: r.n, wr: r.wr })),
      rung: STEAM_S_STAKE_TIER, units: STEAM_S_UNITS,
      reason: `steam_s_seas${seasonedForN}v${seasonedAgN}_ag${Math.round(agMaxRatio * 100) / 100}x_money${Math.round(moneyShare * 100)}_steam_on`,
    };
  }

  // SOLO-Q — the quiet unopposed favourite. Nobody against, steam off, the
  // price a slight favourite (implied .50–.60), and the FOR side is either
  // dust (every FOR under 0.75× usual; unknown ratio counts as dust, as in
  // the research) or one ordinary bet (biggest FOR 1.0–1.5×) from a wallet
  // whose sport last-10 is hot. Any seasoned press FOR is PRESS land and
  // never reaches here (biggest FOR < 1.5× by construction). Dated rung.
  const forMaxRatio = forRows.length
    ? Math.max(...forRows.map((r) => (Number.isFinite(r.ratio) ? r.ratio : 0)))
    : null;
  const hotFor = forRows.filter((r) => isHotL10(r.l10));
  const soloDust = forMaxRatio != null && forMaxRatio < SOLO_Q_DUST_MAX;
  const soloOrdinary = forMaxRatio != null && forMaxRatio >= SOLO_Q_ORD_MIN && forMaxRatio < SOLO_Q_ORD_MAX && hotFor.length >= 1;
  const soloQ = isSoloQLive(pickDate)
    && !steamOn
    && agRows.length === 0
    && forRows.length >= 1
    && implied != null && implied >= SOLO_Q_IMPLIED_MIN && implied < SOLO_Q_IMPLIED_MAX
    && (soloDust || soloOrdinary);
  if (soloQ) {
    const shape = soloDust ? 'dust' : 'ordinary_hot';
    const named = (soloDust ? forRows : hotFor).slice().sort((a, b) => (b.ratio || 0) - (a.ratio || 0));
    return {
      gate, moneyShare, door2Ag, door2For,
      presser: null, maxRatio, band: null, priceStep: null, edge,
      steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
      veterans: named.map((r) => ({ wallet: r.wallet, ratio: Math.round((r.ratio || 0) * 100) / 100, n: r.n, wr: r.wr })),
      dissenters: [],
      rung: SOLO_Q_STAKE_TIER, units: SOLO_Q_UNITS,
      reason: `solo_q_${shape}_for${Math.round(forMaxRatio * 100) / 100}x_imp${Math.round(implied * 100)}_steam_off_unopposed`,
    };
  }

  const failed = [];
  if (!gate.money) failed.push('money');
  if (!gate.seasPress) failed.push('no_seasoned_press');
  if (!gate.noDoor2Ag) failed.push('door2_against');
  if (!gate.door2For) failed.push('no_door2_for');
  return {
    gate, moneyShare, door2Ag, door2For,
    presser: presser ? strip(presser) : null, maxRatio, band: null, priceStep: null, edge,
    steamOn: !!steamOn, heavyFav, floorFade: empty.floorFade,
    veterans: veterans.map(strip),
    dissenters: dissenters.map(strip),
    rung: null, units: 0,
    reason: `gate_fail:${failed.join(',')}`,
  };
}

/** Compact Firestore stamp for the shadow / live record. */
export function pressStamp(evalResult, now) {
  if (!evalResult) return null;
  const e = evalResult;
  return {
    v8_pressGate: {
      money: e.gate.money,
      seasPress: e.gate.seasPress,
      noDoor2Ag: e.gate.noDoor2Ag,
      door2For: e.gate.door2For,
      pass: e.gate.pass,
    },
    v8_pressMoneyShare: e.moneyShare == null ? null : Math.round(e.moneyShare * 1000) / 1000,
    v8_pressDoor2Ag: e.door2Ag,
    v8_pressDoor2For: e.door2For,
    v8_pressPresser: e.presser,
    v8_pressVeterans: e.veterans.length ? e.veterans.slice(0, 4) : null,
    v8_pressDissenters: Array.isArray(e.dissenters) && e.dissenters.length ? e.dissenters.slice(0, 4) : null,
    v8_pressBand: e.band,
    v8_pressPriceStep: e.priceStep,
    v8_pressEdge: e.edge == null ? null : Math.round(e.edge * 10) / 10,
    v8_pressSteamOn: e.steamOn,
    v8_pressHeavyFav: e.heavyFav,
    v8_pressRung: e.rung,
    v8_pressUnits: e.units,
    v8_pressReason: e.reason,
    v8_pressFloorFade: e.floorFade ? {
      status: e.floorFade.status ?? null,
      wallet: e.floorFade.wallet ?? null,
      dir: e.floorFade.dir ?? null,
      n: e.floorFade.n ?? null,
      wr: e.floorFade.wr ?? null,
      streak: e.floorFade.streak ?? null,
      ratio: e.floorFade.ratio ?? null,
      floorImplied: e.floorFade.floorImplied ?? null,
      reason: e.floorFade.reason ?? null,
    } : null,
    ...trustStamp(e.trust),
    v8_pressAt: now,
  };
}

/** v8_trust* fields — written on every evaluated side (null when no read). */
export function trustStamp(trust) {
  const t = trust ?? null;
  const pack = (list) => (Array.isArray(list) && list.length
    ? list.slice(0, 6).map((w) => ({ wallet: w.wallet, status: w.status, tier: w.tier, n: w.n }))
    : null);
  return {
    v8_trustGate: t ? t.gate === true : null,
    v8_trustGateWallets: t && t.gateWallets.length ? t.gateWallets.slice(0, 4) : null,
    v8_trustAgTrusted: t && t.agTrusted.length ? t.agTrusted.slice(0, 4) : null,
    v8_trustCounts: t ? { forOn: t.forOn, forOff: t.forOff, agOn: t.agOn, agOff: t.agOff } : null,
    v8_trustFor: t ? pack(t.for) : null,
    v8_trustAg: t ? pack(t.ag) : null,
    v8_trustMktGate: t ? t.mktGate === true : null,
    v8_trustMktFor: t ? pack(t.mktFor) : null,
    v8_trustMktAg: t ? pack(t.mktAg) : null,
    v8_trustLift: t ? t.lift === true : null,
    v8_trustRule: t ? (t.rule ?? null) : null,
  };
}

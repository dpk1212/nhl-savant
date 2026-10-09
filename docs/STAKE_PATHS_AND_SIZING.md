# Stake paths & unit sizing (production)

_Status: **LIVE** · stack `v12abcde` + **tape** (2026-07-15) + **EDGE/net Path C** (2026-07-19) + **EDGE band size on A/C** (2026-07-20; **mute&lt;7 / ×0.75** from 2026-07-22)_  
_Code: `scripts/syncPickStateAuthoritative.js` · HC ladder: `src/lib/ags.js` (`agsV12HcStake`) · tape: `src/lib/walletClvSkill.js`_  
_Related: [`TAPE_SIZING.md`](./TAPE_SIZING.md) · [`SKILL_FEATURES.md`](./SKILL_FEATURES.md) · [`WINNER_ALIGN_IMPLEMENTATION.md`](./WINNER_ALIGN_IMPLEMENTATION.md) · **[`HARD_AND_PROVEN_WEEK_2026-09-26.md`](./HARD_AND_PROVEN_WEEK_2026-09-26.md)** (HARD+ overlays + Door 2 Proven, 2026-09-24…26)_

---

## PRESS LADDER — authoritative stake from 2026-10-06

_Code: `src/lib/pressLadderOverlay.js` · wired in `scripts/syncPickStateAuthoritative.js` (create + reconcile) · tests `tests/testPressLadderOverlay.mjs`_

From `PRESS_LADDER_FROM = 2026-10-06` the press ladder is the **only** thing that sets `finalUnits` and `v8_hcStakeTier` on a side. AGS v12 still selects the side (`score > 0` or 0u). The legacy chain below (Paths A–E, EDGE, tape, qConv, FOOLS, flinch, climate, steam-tail, HARD+, form×tier) keeps running and keeps writing its stamps as diagnostics, and its unit decision is overwritten right before the odds-cap choke. Manual stake (`manualStake`) still wins. Operator kill still wins. T-15 freeze unchanged.

**Inputs (all day-of, from the live sync):** `wd` = live hydrated wallet details on the side (`mapPositionsToStakeWalletDetails`), each wallet's `sizeRatio` = this bet ÷ that wallet's **sport-local** mean graded stake (`stakeSizeRatio`), the wallet's sport book `bySport[sport].positions` (`n`, `wr`, `dollarRoi`) from `data/wallet-profiles.json`, Door 2 = `isConfirmedSportRec` (n≥6 · WR≥55 · $ROI>3), Pinnacle side odds, steam from the ticket tape (`isSteamOn`).

**Gate (all four):**

| # | Gate | Rule |
|---|------|------|
| 1 | Money | FOR dollars ÷ all dollars on the market **≥ 60%** |
| 2 | Seasoned press | ≥1 FOR wallet with sport `n ≥ 15` and `sizeRatio ≥ 1.5×` |
| 3 | No Door-2 against | 0 Door-2 wallets on the other side |
| 4 | Door-2 for | ≥1 Door-2 wallet on our side |

**Ladder (gate passes):** band from the largest press — `≥3.0× → 5` · `≥2.0× → 4` · else `3`. Price step — **0** when clean (no steam, not a heavy ML favorite ≥ 60% implied), **−1** when moved and edge ≥ 0, **−2** when moved and edge < 0. Edge = mean WR of FOR wallets with `n ≥ 10` minus implied (ML) or 52.4 (spread / total). Units = band − step (floor 1u) for bands 5 and 3: **5 / 4 / 3u** and **3 / 2 / 1u**. **Band 4 (2–3×) is cut to 2 / 1 / 2u** (2026-10-09; `PRESS_BAND_4_UNITS`): clean 19-17 −0.5% on the Aug 1 → Oct 5 re-run, moved edge ≥ 0 4-6 −18%, moved edge < 0 17-5 +4.9%. **Dog cap** (2026-10-09): a side priced **under 50% implied** on any market type is **1u** whatever the band (`PRESS_DOG_IMPLIED_MAX`, `PRESS_DOG_UNITS`; reason suffix `_dog_cap`; no price → no cap): PRESS dogs were 18-21 −11.6% flat, 135u → −15.5u, clean band 3 under .50 5-11. Odds cap applies after. Stamp tier **`PRESS`**.

**R6 rung (gate 2 fails):** no seasoned press, but **≥2** seasoned FOR wallets at `sizeRatio ≥ 1.0×`, 0 Door-2 against, money ≥ 60% → **2u**, tier **`PRESS-R6`** (1u at launch 2026-10-06; 2u from the 2026-10-07 sizing audit, 20-9 +27.9% on the Aug 1 → Oct 5 re-run). Removed if 60 stamped plays are negative.

**PRESS-X rung (only gate 3 fails; 2026-10-06 midday):** gates 1, 2, 4 pass, Door-2 margin (for − against) **≥ +1**, and **every** Door-2 against wallet is betting **under 1.0×** its own sport-local usual size → **3u with steam off / 2u with steam on**, tier **`PRESS-X`**, no price step (2u flat at launch; split 2026-10-07 on the audit: steam off 13-3 +46.5%, steam on 5-2 +0.5%). Research on the 99 gate-3-only failures: 18-5 +32.5% (P2 +33.5%, P3 +31.5%), fourteen lead pressers; tied/negative margin −2.4%; against at/over normal size −4.8%; thin against (under 15 bets) −32.4% overall but 4-2 inside this shape, so it is allowed and watched. Stamps `v8_pressDissenters`. Judged in the stamp record like R6.

**PRESS-N rung (gate 4 fails with nothing informed either side; 2026-10-06 afternoon):** money ≥ 60%, seasoned press ≥ 1.5×, **zero** Door-2 FOR and **zero** Door-2 against, and the biggest presser's sport book has **≥ 50 bets** → **3u clean and moved** (moved = steam on or heavy ML favourite; still stamped as price step 1), tier **`PRESS-N`** (2u clean / 1u moved at launch; clean 3u from the 2026-10-07 audit on 43-21 +27.4%; moved raised to 3u 2026-10-09 on 23-11 +8.0%). Research: 66-32 +20.6% flat, positive in all three periods (P1 +20.7%, P2 +13.3%, P3 +26.7%), 21 lead pressers, +20.5% without the largest; clean 42-18 +32.7%, moved 24-14 +1.6%; presser with 30-49 bets 10-11 −25.0% and 15-29 bets 11-7 +6.2%, which is why the depth line is in the rule. Unit-weighted +25.2%. Same promotion/removal contract as R6.

**PRESS-U rung (gate 2 fails, 2026-10-06 afternoon):** money ≥ 60%, Door-2 FOR ≥ 1, Door-2 margin **≥ +1**, every Door-2 against wallet **under 1.0×** its usual size, and **no** seasoned press → **2u flat**, tier **`PRESS-U`** (1u at launch; 2u from 2026-10-09 on 18-11 +11.9%). Research: 18-11 +11.9% on 29 plays (P2 5-5 −15.5%, P3 13-6 +26.4%); directional, not period-confirmed, and the no-press control (against at/over 1.0×) was 8-6 +8.2%, so the undersize test is unproven without a press. Shipped at 1u on the R6 contract: promote to 2u after 60 stamped plays with positive flat ROI, remove if 60 are negative. Stamps `v8_pressDissenters`.

**STEAM-C rung (the market overrules a small dissent, 2026-10-06 evening):** Pinnacle steam **on** toward this side (the same `isSteamOn` input the price step reads: tier steam/gold or tape steam-on at lock), **≥ 1** Door-2 against wallet, Door-2 margin **≤ 0**, every Door-2 against wallet **under 1.0×** its usual size, and **no** seasoned press against (AG wallet with n ≥ 15 at ≥ 1.5×). **No money gate.** → **2u flat**, tier **`STEAM-C`** (1u at launch; 2u from the 2026-10-07 audit: 57-27 +31.6%, +18.5pp, every half-month positive, both sides of .50 positive). Research on the steam era (Aug 19 → Oct 5, 2,352 sides at 0u): 57-27 +31.6% flat, positive in all four half-months (+16.8 · +51.5 · +28.6 · +21.3), ML 27-14 / spread 8-3 / total 22-10, steam already-on 27-14 / arriving 30-13, 28 of 39 days positive, p 0.0001 vs the 0u pile; the same wallet shape with steam off is 134-167 −17.6%, and steam toward a side the proven wallets are FOR is negative (Door-2 margin ≥ +1 with steam 88-101 −16.0%). A Door-2 against at/over 1.0× (43-49 −3.5%) or a seasoned press against (35-41 −6.4%) kills it. Steam is a lock-time input, so the rung fires on the cycle steam turns on (already-on at first flag, arriving at T-60 / T-15) and the T-15 freeze settles it. Removed if 60 stamped plays are negative. Stamps `v8_pressDissenters` and `v8_pressSteamOn`.

**PRESS-M rung (the mirror of a muted V12 side, 2026-10-07):** the V12 side of a market sits at **0u** under the ladder and the **other** side carries the ladder shape — money **≥ 60%**, seasoned (n ≥ 15) press **≥ 1.5×**, **zero** Door-2 against (Door-2 FOR either way) — while its own v12 score is ≤ 0 or no-signal → that other side is staked **1u flat**, tier **`PRESS-M`**. One side per market: the mirror never fires while any sibling side carries units (ladder or manual), and the V12 side is written `superseded: true, supersededReason: press_m_mirror` (0u record intact, card hidden) for as long as the mirror carries units; when the mirror drops to 0u it is superseded by the normal v12 side-flip and the V12 side comes back. Mechanics: on an existing doc the V12 side's reconcile supersedes itself, the doc goes ghost and the create-missing pass builds the mirror side (`v8_pressMirrorForceCreate`, `promotedBy = ags-unified-v12`, `lockStageReason = press_m_mirror`); a mirror side that already has a stake-side doc promotes itself in reconcile (`appliedReason = press_m_ags_bypass`). Research Aug 1 → Oct 5 on the 96 0u V12 sides whose opposite side had this shape: V12 side 30-66 flat; the mirror 66-30 +20.4% (P1 13-7 · P2 23-13 · P3 30-10), 36 distinct pressers, no Door-2 either side 36-14, full PRESS shape 30-16; the same gates without the V12 mute (money alone 156-145, press without money 36-37, unseasoned press 33-22) did not separate. Other-side lock odds in the backtest were approximated (ML 1 − implied + 2.25% vig, spreads/totals −110); W-L exact. Same contract as R6: promote to 2u after 60 stamped plays with positive flat ROI, remove if 60 are negative. Stamps `v8_pressMirror {fires, v12Side, v12Score, siblingStaked, shapeRung, shapeUnits, reason, at}`; `v8_pressRung = PRESS-M`, `v8_pressUnits = 1` on the staked side.

**STEAM-S rung (the market overrules a seasoned wallet's ordinary bet, 2026-10-07):** Pinnacle steam **on** toward this side (the same `isSteamOn` input STEAM-C reads, already-on or arriving), **no** seasoned press on either side (gate 2 fails and no AG wallet with n ≥ 15 at ≥ 1.5×), **≥ 1** AG wallet with the biggest AG at **1.0–1.5×** its usual (a normal-size bet, not a press and not dust), seasoned (n ≥ 15) wallets **AG ≥ FOR** with **≥ 1** seasoned AG, money FOR **20–60%**, and implied win % **≥ 40%** (fail-closed when the side has no odds) → **2u flat**, tier **`STEAM-S`** (1u at launch; 2u from the 2026-10-07 audit, 17-5 +45.5% on the live-row re-run, 27-6 in its research). Sits after STEAM-C and R6 in the ladder (money < 60% here, so it never overlaps a money-gated rung). Research on the steam era (Aug 19 → Oct 5, every V12 side): 27-6 +55.2% flat (P2 10-2 · P3 17-4), positive in all four half-months, 0u part 19-5 +48.5%, ML 11-3 / spread 5-2 / total 11-1, MLB 20-4 / other 7-2, steam already-on 14-5 / arriving 13-1; the same wallet shape with steam off is 18-28 −24.4%; the AG under 1.0× is 8-5 with the 0u part 4-4 (STEAM-C's wallet); when our seasoned wallets outnumber theirs (margin ≥ 1) steam confirming the lean is 45-36 with the 0u part 25-27, so the rung stops at even; a ladder-rejected pressed side with steam toward it is 17-36, so the no-press-FOR line is part of the rule. One wallet (…4b912c) is the seasoned AG on 17 of the 30 open plays; without it 12-1. Removed if 60 stamped plays are negative. Stamps `v8_pressDissenters` (the seasoned AG wallets), `v8_pressVeterans`, `v8_pressSteamOn`, `v8_pressRung = STEAM-S`, `v8_pressReason = steam_s_seas<F>v<A>_ag<ratio>x_money<pct>_steam_on`.

**SOLO-Q rung (the quiet unopposed favourite, 2026-10-07):** **zero** wallets against, Pinnacle steam **off** toward this side (same `isSteamOn` input, negated), implied win % in **[50%, 60%)** (fail-closed when the side has no odds), and the FOR side is either **dust** (every FOR wallet under **0.75×** its usual; an unknown size ratio counts as dust, as in the research) or **one ordinary bet** (biggest FOR at **1.0–1.5×**) from a wallet whose sport last-10 is **hot** (`bySport[sport].form.actionL10`, ≥ 8 decided, ≥ 70% won) → **1u flat**, tier **`SOLO-Q`**. Sits after STEAM-S. The money gate passes trivially on an unopposed side (money share 1.0), so every money-gated rung keeps precedence; a seasoned press FOR is PRESS / PRESS-N land and never reaches this rung (biggest FOR < 1.5× by construction). Research on the steam era (Aug 19 → Oct 5, all 590 unopposed V12 sides): 61-26 +31.1% flat (0u part 59-25 +31.3%), P2 22-10 · P3 39-16, every half-month positive, 7 of 8 weeks positive, max drawdown 4.0u, calibration +17pp; ML 18-4 / spread 18-9 / total 25-13; MLB 29-9, football/hockey/WNBA 29-16; without the two busiest wallets 40-15; dust 47-23, ordinary + hot 14-3; Door-2 FOR ≥ 1 inside it 25-5 (the tier-up candidate). Every neighbour fails: steam ON 10-10, implied 60–70% 18-16, 40–50% 15-35 −41.9%, the light band (0.75–1×) 9-15, the ordinary bet without hot form 7-15, a single dust wallet against 33-28. Why: price comes first on the unopposed book (under 50% implied is 60-109 −28% and loses in every era and sport), steam toward a lonely side is the market catching up (50%+ with steam ON 40-34, OFF 147-94), and form matters only where the wallet actually bet. The one control against it: the pre-steam weeks (Aug 1–18, no steam tape) were 19-23 for the shape. Same contract as R6: promote to 2u after 60 stamped plays with positive flat ROI, remove if 60 are negative. Stamps `v8_pressVeterans` (the FOR wallets named by the shape), `v8_pressDissenters = []`, `v8_pressSteamOn = false`, `v8_pressRung = SOLO-Q`, `v8_pressReason = solo_q_<dust|ordinary_hot>_for<ratio>x_imp<pct>_steam_off_unopposed`.

**FADE-F (the lone streaking loser, 2026-10-07) — a rescue rung and a veto over the whole ladder.** A **floor wallet** is the mirror of Door 2: sport book **n ≥ 15 at WR ≤ 45**. A market is a **FLOOR-FADE** market when **exactly one** floor wallet is in it (either side), it is on a **career losing streak ≥ 3** (every `bySport[*].form.recentAction` row merged by date, pushes skipped, trailing losses counted — computed client-side from the existing profile export), it bet **under 1.5×** its usual (fail-closed when the size ratio is unknown), and **its side** is priced **under 65% implied** (fail-closed when the side has no odds; the floor side's implied is `1 − ours` when it is against us). Then: **the floor wallet is against us and no rung fired → 2u flat, tier `FADE-F`** (1u at launch; 2u from the 2026-10-07 audit, 29-14 +24.0%) (reason `fade_f_floor_against_<wallet>_n<n>_wr<wr>_streak<k>_<ratio>x_floor<pct>`); **the floor wallet is on our side → 0u whatever rung fired** (reason `fade_f_veto_of_<rung|none>:floor_for_…`, `mutedBy = fade-f-veto`); **a side the ladder already staked keeps its rung and units** (the staked part of the shape is 3-4; the lift is in the 0u part). Steam is not an input. Research, market level (Source B walk-forward, Apr 19 → Oct 4, 340 clean two-sided markets): the floor side is **89-251 (26.2%, −12.5pp vs price)**; fading it is **+18.0% at the inferred price** and **70-139 +22.9% at the other side's real paid odds** (209 markets with both prices); every period negative for the floor side; **+61.4u over 24 weeks, 3 losing weeks, worst −3.3u**; the same wallet shape with streak 0–2 is 557-634 **−1.0pp** (the streak is the signal); monotone in the streak (≥2 −9.0, ≥3 −12.5, ≥5 −15.0pp); best at .50–.65 (37-60), the .65+ cap holds (8-2 the other way); CFB is the one sport where it fails (10-14). On V12 sides (Aug 1 → Oct 5, every side staked or not): **pick against the floor side 34-19 +17.9%**, 0u part **31-15 +24.2%** (steam era 22-14 +9.7%, pre-steam 9-1, steam off 23-8 +42.2%, steam on 8-7), staked part 3-4; the control without the streak (pick against a floor wallet that is not streaking) is 119-96 +0.9%, 0u part 99-82. **Pick is the floor side 17-33 −33.2%** (0u 16-29, staked 1-4 −3.4u: PRESS phi_laa W, sfg_tex L, lva_nyl L; PRESS-R6 nym_wsh L, tbr_atl L); control 109-107 −3.5%, staked 15-8. The sport-local-streak variant is weaker (BOOST 0u 32-19 +15.7%, VETO 21-29 −19.1%), so the career streak is the rule. 0u BOOST rows by upstream mute: none 12-4, ags-quality-veto 7-1 (these stay at 0u — the v12 score ≤ 0 gate is upstream of the ladder and unchanged), fools-gold-flat 2-4, tape-weak 2-2, steam-tail 2-0, believed-cut 2-0, ev-drift-edge 0-2; by sport MLB 19-6, CFB 6-4, NFL 2-3, WNBA 3-0, NHL 1-0, SOC 0-1, UFC 0-1; roughly 5 rescues a week. Removed if 60 stamped plays are negative; the veto is reviewed against its own 60. Stamps `v8_pressFloorFade = { status: BOOST|VETO|null, wallet, dir, n, wr, streak, ratio, floorImplied, reason }` on every evaluated side (so the read is on record where the policy did nothing), `v8_pressRung = FADE-F` / `v8_pressReason` on a rescue, `v8_pressRung = null`, `v8_pressUnits = 0` and the veto reason on a veto.

**Sizing audit (2026-10-07, Aug 1 → Oct 5, every V12 side, the ladder re-run on the live wallet rows with the live oddsCap):** the staked book was 437-224, flat +19.2%, 1,165u → +199u (+17.1% per unit), maxDD −28.7u. Yardstick: PRESS band 3 clean, 3u for 31-22 +8.9% flat (Kelly 11%). Rungs above that per unit were re-sized: STEAM-C 1u → 2u (57-27 +31.6%, Kelly 29%, 4/4 halves), PRESS-N clean 2u → 3u (43-21 +27.4%), PRESS-X 2u → 3u steam off / 2u steam on (13-3 +46.5% / 5-2 +0.5%), STEAM-S 1u → 2u (17-5 +45.5%), PRESS-R6 1u → 2u (20-9 +27.9%), FADE-F 1u → 2u (29-14 +24.0%). Left alone: PRESS-U 1u (18-11 +11.9%), SOLO-Q 1u (77-46 +17.5%, P1 19-22), PRESS-M 1u, PRESS band 5 clean 5u (15-6 +40.8%). Open on the PRESS side (proposed, not shipped): PRESS at implied < .50 is 18-21 −11.6% flat (135u → −15.5u) and PRESS ML favourites at implied ≥ .60 are 50-18 +0.8% (148u → −1.9u); sizing both at 1u would have been 459u → +72.6u against 636u → +60.4u with maxDD −16u instead of −28u. Band 4 (2–3×) 40-28 −1.3% is a watch. The 60-play removal contract stays on every rung; locked sides keep the units they were sealed with.

**Re-audit (2026-10-09, historical records + live Oct 6–8):** live staked book 10-7, 32u → −0.1u on 17 plays (2u level 3-5; 0u pile 27-25). Shipped from the record review: PRESS band 4 cut to 2 / 1 / 2u, PRESS dog cap (implied < .50 → 1u), PRESS-N 3u clean and moved, PRESS-U 2u. Still open from the same review (records, not shipped): STEAM-C 57-27 → 3u, SOLO-Q 77-46 → 2u, PRESS-M 66-30 → 2u, PRESS band 5 step 2 20-9 −2.1% → 1u, band 3 step 1 5-4 → 1u, PRESS-X 13-3 / 5-2 → 1u flat, PRESS-R6 20-9 → 1u, STEAM-S 17-5 → 1u, FADE-F 29-14 → 1u, PRESS ML favourites ≥ .60 implied 50-18 +0.8% → 1u. Shrinkage note: the rung records are in-sample (each rung was found by searching the same window); at k = 50 plays of prior weight the small rungs shrink to +3.5% (PRESS-X), +3.7% (R6), +6.8% (STEAM-S), +5.6% (FADE-F), while STEAM-C holds +16% and PRESS-N clean +11%.

**TRUST layer (2026-10-09) — wallet trust status, TRUST-G, the ML floor, the spread/total cap.** Every Source B wallet carries a **trust status per sport** (`profile.bySport[sport].trust`, rebuilt nightly by `exportWalletProfiles.js` from its graded positions at their own entry prices; `src/lib/walletTrustStatus.js`): running edge = WR − mean price over all decided bets; **tier** 0 under 10 bets, then 5 / 4 / 3 / 2 / 1 at edge ≥ +8 / +4 / 0 / −4 / below; **peak** = best tier held, **FALLEN** while below it until regained; **form** = last-10 wins − Σ price ≥ 0 (ON by default under 5); status **UNPROVEN · STABLE_ON · REGAINED_ON · FALLEN_ON · STABLE_OFF · FALLEN_OFF**, bookkeeping once per day before that day's bets. A wallet is **trusted** at tier ≥ 4 with form ON (STABLE_ON or REGAINED_ON). The same machine per sport × market is stamped as `byMarket[market].trust` (shadow). On every evaluated side the ladder writes `v8_trustGate` (a trusted wallet is FOR), `v8_trustGateWallets`, `v8_trustAgTrusted`, `v8_trustCounts {forOn, forOff, agOn, agOff}`, `v8_trustFor` / `v8_trustAg` (wallet, status, tier, n), `v8_trustMktGate` / `v8_trustMktFor` / `v8_trustMktAg` (market-level), `v8_trustLift`, `v8_trustRule`. Evidence, live book Jun 1 → Oct 9 at lock odds: **moneylines with a trusted wallet FOR 120-60 (66.7%, +21.1%, 554u → +116.7u) vs 259-217 (54.4%, +2.2%) without one (p = .023)**; MLB ML 81-37 vs 172-167 (p = .003); every month ≥ 60.5%; during the Sep 14 → Oct 9 drawdown 29-13 +21.2u vs 25-31 −31.0u. Spreads + totals 97-94 vs 198-195 (p = .95) at the sport level and the totals market-level status inverted (52-62) — **no gate on spreads or totals**, shadow only. Rules, all from `TRUST_FROM`: **(1) TRUST-G rescue, 1u, moneyline only** — the ladder left the side at `gate_fail` (0u), the legacy chain would have staked it (`legacyUnits` > 0, the pre-ladder `finalUnitsApplied`), and a trusted wallet is FOR → `v8_pressRung = TRUST-G`, reason `trust_g_for_<wallets>_legacy<u>u:gate_fail:…`. Retro Aug 1 → Oct 5 cell: 34-21 61.8% +12.3% (every one a gate_fail). TRUST-G yields the market to PRESS-M (when a sibling carries the mirror shape with no V12 score, the legacy stake goes in as 0) and is exempt from the ML floor. FADE-F VETO stays a veto. **(2) ML floor** — a staked moneyline rung (TRUST-G excepted) under `ML_FLOOR_UNITS = 3` at implied ≥ .50 is raised to 3u (reason `+ml_floor3`); dogs under .50 keep the PRESS dog cap and `oddsCap` at the call site still rules long prices. **(3) Spread / total cap** — any spread or total rung above `ST_CAP_UNITS = 2` is cut to 2u (reason `+st_cap2`). **(4) Lift (shadow)** — `v8_trustLift = true` on a staked moneyline rung with a trusted wallet FOR (retro ladder YES · gate YES 26-7 78.8% +37%; ladder YES · gate NO 48-18 72.7%); no units move on it yet. Trusted wallets as of 2026-10-09: MLB 32, SOC 31, NBA 21, NFL 15, CFB 14, NHL 12, WNBA 7, UFC 5. Same 60-play review contract as every rung.

**Otherwise 0u.** `health.status = MUTED`, `mutedBy = press-gate` (`fade-f-veto` when FADE-F zeroed the side; `ags-quality-veto` when the v12 score is ≤ 0), `v8_hcStakeTier = MONITORING`.

**Stamps (every cycle from `PRESS_STAMP_FROM = 2026-10-06`, live from the 2026-10-06 midday cycle):** `v8_pressGate {money, seasPress, noDoor2Ag, door2For, pass}` · `v8_pressMoneyShare` · `v8_pressDoor2Ag` · `v8_pressDoor2For` · `v8_pressPresser {wallet, ratio, n, wr}` · `v8_pressVeterans[]` · `v8_pressDissenters[]` · `v8_pressBand` · `v8_pressPriceStep` · `v8_pressEdge` · `v8_pressSteamOn` · `v8_pressHeavyFav` · `v8_pressRung` · `v8_pressUnits` · `v8_pressReason` · `v8_pressAt` · `v8_pressApplied` (true when the ladder set the stake).

**Retired for live dates:** Q1 / UNOPP / HARD+ floors and rescues, RANK / SHARP / DISSENT / WINNER rescues, EDGE band, EDGE/net, tape dial, qConv, FOOLS, flinch, maxSR, no-CONFIRMED, TOP-crowded, Ev-drift, climate, sport unlock, steam-tail, fav-juice, unit-tier, board share, st-fat, market-skill, HARD exception / AG / S-T require, GOLD stack cap, form×tier. Their stamps still write; their units do not ship.

**Research basis:** V12 sides Aug 1 → Oct 5, 2026, day-of wallet state. Door-2-anchored BASE 213 sides +8.3% ROI (P2 +3.7, P3 +16.1), ladder +75.9u on 639u, OOS Aug 1 – Sep 10 +5.7u / 325u; with R6 at 1u 244 plays, +82.0u / 670u. Caveats recorded in the press-ladder critique: no clean holdout, top-3 presser wallets carry 85u of 154u, 60% MLB.

---

## Where we are (2026-07-22) — legacy chain, diagnostic for 2026-10-06+

| Layer | Role | Live rule |
|-------|------|-----------|
| **AGS v12** | Side select | `score > 0` or no stake |
| **Paths A–D + Q1 / UNOPP** | Who + base u | HC → RANK → SHARP/LEAN → **CONFIRMED-Q1 @ 2–3u** → **CONFIRMED-UNOPP @ 1u** → DISSENT |
| **TOP NEITHER mute** | Hard kill | TOP/TOP+ with E&lt;5 **and** net&lt;5 → **0u** |
| **FadeTop** | Toxic AG | top AG WR ≥ 60 beating FOR → **0u** · **2026-09-18+ SHARP-LEAN ML proven ≥50% HOLDS** (continues to tape / leftover / steam-tail / board-share) |
| **EDGE band size** | A/C dial | E&lt;7 → **0u** · 7–10 → ×**0.75** · ≥10 → ×**1.25** · **RANK/DISSENT/CONFIRMED-UNOPP exempt** |
| **EDGE/net size** | Soft dial (non–A/C) | BOTH ×**1.25** · ONE hold · NEITHER ×**0.5** on remaining soft tiers · **RANK exempt** |
| **Tape** | Near-final dial | `&lt;0` mute (except **RANK** / **CONFIRMED-UNOPP**) · mid hold · `≥2.89` ×**1.35** · fail-open if missing |
| **qConv Q1 mute** | Near-final mute (2026-08-03+; Path A+RANK+UNOPP/Q1 exempt) | Path C SHARP* · `qConv <` expanding Q1 of prior staked → **0u** · fail-open if missing |
| **FOOLS-gold mute** | Final mute (2026-08-05+) | Path A/B/C + CONFIRMED-UNOPP · best proven FOR = **FLAT** → **0u MUTED** · fail-open if bestFOR missing · DISSENT/manual exempt |
| **Flinch / fail-open leftover mute** | Last mute (2026-08-19+) | Still **&lt;4u** AND (odds-capped native-4u path **or** tape BOOST **or** E≥10 **or** FAIL_OPEN) → **0u** · **4u+ never touched** · **A/B arriving HOLDs** (2026-09-09+) · Q1/UNOPP floors cannot revive |
| **Sport Confirmed unlock CAP** | Absolute last (2026-08-29+) | **NFL / CFB only** · sport-wide CONFIRMED n → max u (&lt;5→1 · 5–9→2 · 10–14→3 · ≥15→full) · CAP only · deep sports EXEMPT |
| **HARD+ last steps** | Overlay (2026-09-24…26) | Market-skill · HARD exception · HARD+ AG mute · S/T HARD+ FOR require · see week memo |
| **Who-floor HARD+ FOR** | Q1 / T arriving (2026-09-28+) | Q1 and lean arriving 1→2 need ≥1 HARD+ FOR · fail-open if we cannot judge · mid 4u boost unchanged |
| **GOLD-stack 4u cap** | Last size choke (2026-09-26+) | Off-stack **>4u → 4u**. Stack (HARD+ FOR only · proven ≥75%) keeps 5–6u. Fail-open if we cannot judge. |
| **Proven bag** | Who v12 scores (2026-09-26) | Source B n≥6 WR≥55 $ROI>3 · A-only out · FLAT gone · **2026-10-05:** HARD+ v12 presence and market-prior quality **rolled back**. Hydrate / no-CONFIRMED / v11 / v12 quality are Door 2 sport book only. HARD+ is overlay (floor / mute-exception / AG / S/T require / Action Top). HC / Q1 / UNOPP / unlock / Action stay Door 2. |
| **T-15** | Freeze | No further rewrite |

**Paths pick who. EDGE band sizes A/C. Tape dials size. qConv cuts the Path C Q1 tail (Path A + RANK + UNOPP/Q1 exempt). FOOLS cancels FLAT-led. Leftover mute cancels believed-then-cut stubs and sub-4 FAIL_OPEN. CONFIRMED-UNOPP fills sized unopposed CONFIRMED left at 0u, including after mutes — leftover mute still wins after that restore.**

Skill metrics (EDGE / netCLV / Tape / bucket) stamp every pre–T-15 cycle — see [`SKILL_FEATURES.md`](./SKILL_FEATURES.md).

---

## End-to-end pipeline (every pre–T-15 sync)

```
1. AGS v12 score
   └─ score ≤ 0 → FADE / muted → 0u  (stop)

2. Path A — HC margin ladder          → SUPER/TOP/MINI/CONFIRMED/MONITORING
   └─ overlays: MINI- (no proven-$) · TOP+ (legacy pre-retune only)
   └─ TOP/TOP+ EDGE-net hard mute: NEITHER → 0u

3. If still 0u → Path B RANK rescue   → RANK @ 4u
   └─ **2026-09-19+** eligible wallet = CONFIRMED/FLAT/WR50 **and** Action n≥8 (featured n only if Action book is empty)
4. If still 0u → Path C SHARP rescue  → SHARP @ 3u (BOTH) / SHARP-LEAN @ 1.5u (ONE)
5. CONFIRMED-Q1 (2026-08-08+) → floor **2u** (3u if size≥1×)
   └─ ≥1 FOR: CONFIRMED × flatDollar Q1 × **sport-local** size≥0.5 · **opposed OK** · hard floor after mutes
   └─ **2026-09-28+** also needs ≥1 HARD+ FOR (sport×market). Q1 answers WHO; HARD+ is the board. Fail-open if we cannot judge.
6. If still 0u → CONFIRMED-UNOPP → 1u
   └─ ≥1 live CONFIRMED FOR **sport-local** size ≥ 0.5 · zero CONFIRMED on AG · **hard floor after mutes**
7. If still 0u → Path D DISSENT       → DISSENT @ 1u  (MLB only)

7. Winner-align fadeTop≥60 mute       → 0u if toxic AG top WR
   └─ **2026-09-18+** SHARP-LEAN **ML** proven $ ≥50% → HOLD (do not mute; later filters still run)
   └─ missing proven $ is not an exception · SPREAD/TOTAL and Path A/RANK/SHARP still fade
   └─ EDGE size / WINNER rescue / Policy E  → FROZEN (no unit effect)

8. EDGE band size (Path A/C, 2026-07-20+)
   └─ 2026-07-22+: EDGE < 7 or missing → 0u · 7 ≤ E < 10 → ×0.75 · E ≥ 10 → ×1.25
   └─ 2026-07-20..21: EDGE < 5 or missing → 0u · 5 ≤ E < 10 → ×0.5 · E ≥ 10 → ×1.25
   └─ RANK / DISSENT / CONFIRMED-UNOPP exempt → legacy EDGE/net soft size (step 8b)

8b. EDGE/net size overlay (soft) — only when EDGE band did not apply
   └─ BOTH → path × 1.25 (≤6u)
   └─ ONE  → hold
   └─ NEITHER → ×0.5 on MINI / MINI- / SHARP* / CONFIRMED
   └─ RANK / DISSENT / null → hold (RANK never shrunk here)
   └─ missing EDGE and net → fail-open (hold)

9. Tape mute / hold / boost
   └─ RANK / CONFIRMED-UNOPP exempt from tape mute only (still boosts)

10. qConv Q1 mute (2026-08-03+; Path A + RANK + UNOPP/Q1 exempt)
   └─ qConv = Σ sizeRatio×(WR−50) FOR − AG
   └─ thr = expanding Q1 of prior staked A/B/C (Jun15+)
   └─ Path C SHARP* only · below thr → 0u
   └─ Path A (SUPER/TOP/MINI/…) + RANK exempt · fail-open if missing · DISSENT/manual exempt

11. FOOLS-gold mute (2026-08-05+)     → 0u if FLAT-led
11b. Q1 / UNOPP hard floor after mutes
     └─ **2026-09-28+** Q1 floor / AGS bypass skipped when HARD+ FOR = 0
11c. Flinch / fail-open leftover mute (2026-08-19+)
     └─ still <4u AND (native-4u plus-money OR tape BOOST OR E≥10 OR FAIL_OPEN) → 0u
     └─ 4u+ EXEMPT · unflagged tickets HOLD at exact incoming units
     └─ A/B arriving (off→on) HOLD · no-steam / already-on still MUTE
     └─ **2026-09-28+** S/T arriving = juiceSteam only (walk paint is not steamOn)
     └─ **2026-09-28+** lean arriving 1→2 needs ≥1 HARD+ FOR else 0u (`arriving_no_hard_for`). Mid 2–3u→4u unchanged.
     └─ mutedBy=believed-cut | fail-open-sub4
12. Odds cap + global 6u cap (already applied on path/tape; mute is 0u)
12b. Sport Confirmed unlock CAP (2026-08-29+) — **NFL / CFB only**
     └─ sport-wide CONFIRMED count gates max publishable units
     └─ <5 → 1u · 5–9 → 2u · 10–14 → 3u · ≥15 → full ladder
     └─ CAP only (never mute to 0) · after all mutes · MLB/deep sports EXEMPT
12c. Board $ share mute (2026-09-17+)
     └─ mute 25–45 · <25 keep only proven ≥50% · missing details fail-open
     └─ mutedBy=board-share
12d. Spread/total fat mute (2026-09-17+) — **SPREAD / TOTAL only**
     └─ leftover BOTH (EDGE≥10 ∧ tape BOOST) any current units → 0u
     └─ arriving (off→on) and units ≥4 → 0u
     └─ ML exempt · BOTH reason wins if both fire · fail-open if both unknown
     └─ mutedBy=st-fat
12e. no-CONFIRMED (2026-08-23+) then **market-skill** (2026-09-24+)
     └─ ML: ≥1 FOR sport×ML B `n≥6 WR≥52` else 0u
     └─ S/T: qual$ AGREE + HARD slip (`n≥4 WR≥62 $ROI≥10`) else 0u
     └─ mutedBy=no-confirmed | ml-mkt-skill | st-qual-wipe | st-hard-slip
12f. HARD mute-exception (2026-09-24+) — restore listed mutes if ≥1 HARD FOR
     └─ tape-weak **S/T stays muted** · rescuedBy=hard-mkt-hold
     └─ **2026-10-04+** 1-HARD restore needs that HARD FOR sized **≥1.0×** (0.18× stays muted)
     └─ **2026-09-28+** 2+ unique HARD+ FOR and 0 HARD+ AG also restores steam-tail / leftover / st-fat / tape-weak S/T
     └─ **2026-09-29+** 2+ unique HARD+ FOR and margin (FOR−AG) ≥ +1 (2-1 HOLDs, 2-2 stays muted)
     └─ **2026-10-04+** 2-for also needs ≥1 of those HARD+ FOR sized **≥1.0×**
     └─ size = max(uPre, 3) capped 4u · unique wallets not duplicate listings
     └─ skip ev-drift / fav-juice / unstamped 0u / fade · rescuedBy=hard-2for-hold
     └─ **2026-09-28+** S/T 1 HARD+ FOR sized ≥1.5× sport usual and 0 HARD+ AG restores the same mute set at uPre capped 4u (no 3u floor)
     └─ ML stays on 1-for / 2-for · skip board-share · 2-for still wins when ≥2 HARD · rescuedBy=hard-st-press-hold
12g. HARD+ AG mute (2026-09-25+) — ≥1 HARD on the other side → 0u · mutedBy=hard-ag
     └─ **2026-09-29+** mute only when HARD AG ≥1 **and** margin (FOR−AG) ≤ 0
     └─ 2-1 / 3-2 HOLD · 1-1 / 0-1 / 1-2 MUTE · GOLD stays FOR-only
12h. S/T HARD+ FOR require (2026-09-26+) — SPREAD/TOTAL needs ≥1 HARD FOR else 0u
     └─ **2026-10-04+** that HARD FOR must be sized **≥1.0×** (lights remute)
     └─ ML exempt · 4u+ not exempt · mutedBy=st-hard-for
12i. GOLD-stack size cap (2026-09-26+) — off-stack >4u → 4u
     └─ stack (HARD+ FOR only · proven ≥75%) keeps fat
     └─ fail-open HOLD if we cannot judge · cappedBy=gold-stack-cap
12j. HARD+ margin floor (2026-09-30+) — unique HARD margin (FOR−AG) ≥ +1 and ≥1 HARD FOR at ≥1.0× → 2u
     └─ fills MONITORING / unstamped 0u so v12 ships size · also leftover / steam-tail / market-skill / **board-share**
     └─ 1-0 / 2-0 / 2-1 qualify · 1-1 / 0-1 / 1-2 stay 0u · live ≥2u not resized
     └─ skip ev-drift / fav-juice / fade / operator / ev-lt2 / hard-ag · flooredBy=hard-unopp-hold
     └─ MONITORING promote tier HARD-UNOPP · fail-open HOLD if schema missing
13. T-15 → freeze
```

Rescues **never up-size** an already-staked Path A ticket — they only fill `0u` holes. The HARD+ margin floor also fills unstamped MONITORING `0u` and bumps live lean `<2u` to `2u`.

---

## Cutover dates

| Date | What went live |
|------|----------------|
| **2026-06-15** | Path A HC stake tiers (`v12.1`) |
| **2026-06-26** | Path C SHARP rescue (+ MINI- cut; TOP+ boost on) |
| **2026-07-12** | Path C retune · Path D · Path E winner-align (EDGE stake era) |
| **2026-07-15** | **Tape sizing** · EDGE stake overrides **frozen** |
| **2026-07-19** | **Path C = EDGE/net two-gate** · **TOP NEITHER hard mute** · **board-wide BOTH×1.25 / NEITHER×0.5** · **RANK tape-mute exempt** · proven-$ Path C retired |
| **2026-07-20** | **EDGE band size on Path A/C** — mute E&lt;5 · half 5–10 · boost ≥10 ×1.25 · RANK/DISSENT exempt (replaces BOTH/NEITHER soft size on A/C) |
| **2026-07-22** | **EDGE band v2** — mute E&lt;7 · ×0.75 on 7–10 · boost ≥10 ×1.25 (cuts the 5–7 poison slice; mid slightly less shrunk) |
| **2026-08-03** | **EDGE abs bands** on A/C · **qConv Q1 mute** on A/B/C (after tape) |
| **2026-08-16** | **CONFIRMED-UNOPP hard floor after mutes** — tape/qConv/FOOLS cannot leave qualifying unopposed CONFIRMED at 0u · qConv no longer mutes UNOPP |
| **2026-08-16** | **Stake size = sport-local volume** — Path A HC / mini-HC, Q1, and UNOPP use invested / this wallet's usual in that sport (same as locked-card "Size vs usual"). Model `v8_sizeRatio` is fallback only. AGS features stay on model size. |
| **2026-08-19** | **Flinch / fail-open leftover mute** — still &lt;4u AND (odds-capped native RANK/TOP/SUPER **or** tape BOOST leftover **or** E≥10 leftover **or** tape FAIL_OPEN) → **0u**. 4u+ never touched. Native 3u RANK/TOP favorites without those flags stay. After Q1/UNOPP restore so those floors cannot revive a stub. |
| **2026-09-09** | **Leftover A/B arriving HOLD** — leftover mute skips when Source A/B CONFIRMED and steam arrived (off→on). No-steam / already-on leftover still 0u. Later mutes (maxSR, ev-drift, T) still run. **Policy T native 2–3u A/B arriving → 4u.** 1u arriving stays floor 2u. Climate/unlock shrink not restacked. |
| **2026-09-28** | **S/T walk is not steamOn** — main-line walk still paints on the card (`lineWalkPts` / `+6.5 → +4.5`) but cannot set arriving, Policy T floor/boost/4u-confirm, or leftover arriving-HOLD. `juiceSteam` = 3%+ drop on the first-write pin while \|main−pin\| < 0.5. ML steam unchanged. Juice-stable S/T unchanged. |
| **2026-09-28** | **Who-floor HARD+ FOR** — Q1 floor / AGS bypass and Policy T lean arriving 1→2 need ≥1 HARD+ FOR on this sport×market. Do not invent 2u on a board GOLD would refuse. Fail-open if we cannot judge. Mid arriving 2–3u→4u, UNOPP 1u fill, and S/T last-step remute unchanged. |
| **2026-09-28** | **HARD 2+ FOR / 0 AG hold** — unique HARD+ FOR ≥2 and HARD+ AG = 0 restores steam-tail / leftover / st-fat / tape-weak (incl S/T) at max(uPre, 3) capped 4u. Skip ev-drift / fav-juice / unstamped 0u / fade. Unique wallets, not duplicate listings. |
| **2026-09-28** | **HARD S/T press hold** — SPREAD/TOTAL unique HARD+ FOR ≥1 sized ≥1.5× sport usual and HARD+ AG = 0 restores the same mute set at uPre capped 4u (no 3u floor). ML stays on 1-for / 2-for. Skip board-share / ev-drift / fav-juice / unstamped / fade. 2-for still wins when ≥2 HARD. |
| **2026-08-29** | **Sport Confirmed unlock CAP** — NFL / CFB only. Sport-wide CONFIRMED count gates max units: &lt;5→1u · 5–9→2u · 10–14→3u · ≥15→full. Absolute last after mutes. CAP only (never mute). MLB / SOC / deep sports untouched. |
| **2026-09-18** | **Fade proven-$ hold** — SHARP-LEAN ML with proven $ share ≥50% skips fadeTop mute and continues to the next filter. Missing proven still fades. SPREAD/TOTAL and SUPER/TOP/MINI/RANK/SHARP still fade. |
| **2026-09-19** | **Source B lock** — v12 quality + RANK n read Action first (featured n only if Action is empty). T−15 scan-drop stays PENDING for grade. |
| **2026-09-24** | **Market-skill mute** — ML FOR n≥6 WR≥52 · S/T qual$ + HARD slip. **HARD mute-exception** after. |
| **2026-09-25** | **HARD+ AG mute** — HARD wallet on the other side → 0u. |
| **2026-09-29** | **HARD+ unique-wallet margin** — AG mute only when HARD AG ≥1 and (FOR−AG) ≤ 0. 2-1 HOLD, 1-1 MUTE. 2-for rescue if ≥2 HARD FOR and margin ≥ +1. GOLD stays FOR-only. S/T press stays 0 AG. Binary any-AG remains on 09-25…09-28 tickets. |
| **2026-09-30** | **HARD+ margin floor** — unique HARD margin (FOR−AG) ≥ +1 and ≥1 HARD FOR sized ≥1.0× sport usual publishes 2u (MONITORING / listed leftover / steam-tail / market-skill). 1-1 stays 0u. Skip ev-drift / fav-juice / fade. `flooredBy=hard-unopp-hold`. |
| **2026-10-01** | **HARD+ margin floor punches board-share** — same ≥+1 × ≥1.0× 2u floor restores `mutedBy=board-share` (25–45% all-$ FOR). Steelers ML hole. Ev-lt2 / fav-juice / fade / hard-ag still skip. |
| **2026-10-01** | **HARD+ floor 2+ FOR lean** — ≥2 unique HARD FOR each sized ≥0.5× also clears the size gate (Steelers 0.87× / 0.96×). 1 HARD FOR still needs ≥1.0×. |
| **2026-10-02** | **HARD+ floor lean 2-for rolled back** — size-clear is ≥1 HARD FOR at ≥1.0× only. Steelers-shaped 0.87× / 0.96× stays 0u. |
| **2026-10-02** | **HARD+ floor board-share punches through** — `mutedBy=board-share` restores at ≥+1 × ≥1.0×. Lean 2-for stays rolled back. Ev-lt2 / fav-juice / fade / hard-ag still skip. |
| **2026-09-26** | **S/T HARD+ FOR require** — spreads/totals need ≥1 HARD FOR. |
| **2026-09-26** | **Door 2 Proven** — Source B n≥6 WR≥55 $ROI>3. A-only cannot be Proven. FLAT not assigned. See [`HARD_AND_PROVEN_WEEK_2026-09-26.md`](./HARD_AND_PROVEN_WEEK_2026-09-26.md). |
| **2026-10-02** | **HARD+ market Proven carve** — Door 2 **or** HARD+ on this ticket market for hydrate / no-CONFIRMED / v11 Proven bag. Fail-closed if market missing. Does **not** sport-confirm HARD+ (v12 quality, HC, Q1, UNOPP, unlock, Action, GOLD proven $, calibration unchanged). |
| **2026-10-02** | **HARD+ market v12 quality** — HARD+ specialists score v12 quality from **this market book** (n + ROI), not the sport rollup. Missing market fail-closed. HC / Q1 / UNOPP / unlock / Action / GOLD / calibration isProven stay Door 2. Overlays still mute/size after. |
| **2026-10-03** | **HARD+ market prior wins Door 2 sport rollup** — if HARD+ on this ticket market, v12 quality uses that market book even when the wallet is sport CONFIRMED. CONFIRMED and not HARD+ here stays sport. |
| **2026-10-04** | **HARD+ full-size gate** — mute-exception 1-for / 2-for and S/T HARD+ FOR require need ≥1 HARD FOR sized **≥1.0×** sport usual. Floor already had this bar. Lights (0.18× / 0.08×) stay muted — do not treat them as the Source B ≥1.0× 74% book. Size unknown is not full. |
| **2026-10-05** | **HARD+ v12 feed rolled back** — hydrate / no-CONFIRMED / v11 Proven / v12 quality are Door 2 sport book only. HARD+-only wallets do not count in v12. Door 2 + HARD+ uses the **sport** rollup, not the market book. Overlays unchanged. |
| **2026-09-26** | **GOLD-stack 4u cap** — off-stack tickets cannot publish above 4u. EDGE + tape can still fatten the stack to 6u. Ball State ML hole. |
| **2026-09-19** | **Featured → Action union** — a shipped featured lock that Source B missed is merged onto Their Action so the result counts. Do not hide Featured to paper over the miss. |
| **2026-08-12** | **qConv Q1 mute** scoped to Path C only (Path A + RANK exempt; UNOPP later exempt 08-16) |
| **2026-08-05** | **FOOLS-gold mute** — best proven FOR=FLAT → 0u (after qConv); briefly 1u clamp then restored |
| **2026-08-08** | **CONFIRMED-UNOPP promote** — CONFIRMED × size≥0.5× × unopposed → 1u (after SHARP / before DISSENT) · FOOLS back to hard 0u cancel |

---

## Path A — HC model (primary book)

**What it is:** High-conviction wallet margin. Count CONFIRMED wallets that are *sized up* on our side vs against.

**Definitions**
- **Full HC wallet:** `whitelistTier = CONFIRMED` and **sport-local** size ≥ 1.5 (`HC_RATIO`)
- **Mini-HC wallet:** `CONFIRMED` and **sport-local** `1.0 ≤ size < 1.5` (`HC_MINI_FLOOR`)
- Size = invested / this wallet's usual in that sport (same as the locked card). Model `v8_sizeRatio` is fallback only. AGS `dHcSizeRatio` still uses model size.
- **hcMargin** = (# full-HC FOR) − (# full-HC AG)
- **miniHcMargin** = same for mini-HC band
- Requires `agsV12 score > 0` and score tier **≠ WEAK** (WEAK → MONITORING 0u)

### Path A unit ladder (before overlays / tape)

| Condition | Tier | Base u | UI label |
|-----------|------|-------:|----------|
| hcMargin **== 2** | `SUPER` | **6** | MAX PLAY |
| hcMargin **== 1** | `TOP` | **4** | TOP PICK |
| hcMargin **≥ 3** | `CONFIRMED` | **1** | CONFIRMED (late pile-on → small) |
| hcMargin ≤ 0, miniHcMargin ≥ 1 | `MINI` | **3** | STRONG |
| else | `MONITORING` | **0** | watch only |
| score ≤ 0 | `FADE` | **0** | muted |

Then **oddsCap** (see below).

### Path A overlays

| Starting tier | Gate | Result | Notes |
|---------------|------|--------|-------|
| `TOP` | proven-$ + mean FOR wr ≥ 50 | `TOP+` @ 5u | **OFF from 2026-07-12** |
| `MINI` | no proven-$ backer | `MINI-` @ **1u** | kept |
| `TOP` / `TOP+` | EDGE/net **NEITHER** | **0u** hard mute | from 2026-07-19 |

**Proven-$ backer:** ≥1 FOR wallet with `positions.dollarRoi ≥ 10%` on ≥8 settled positions.

---

## Path B — RANK (2-for-0 whitelist rescue)

**What it is:** When HC leaves the pick at **0u**, rescue if the whitelist stack is one-sided.

**Qualifies when**
- `score > 0`, still `0u` after Path A (+ overlays)
- ≥ **2** eligible wallets FOR, **0** AGAINST
- Eligible wallet: `whitelistTier ∈ {CONFIRMED, FLAT, WR50}` and sport featured `picks.n ≥ 8`

| Tier | Units |
|------|------:|
| `RANK` | **4u** → oddsCap |

**Skill exemptions (2026-07-19+):** RANK is **not** shrunk by EDGE/net NEITHER soft size, and is **not** muted by tape `&lt; 0` (still eligible for tape boost). Jun1+ CF: RANK NEITHER stayed ~+11% ROI.

Does **not** up-size SUPER/TOP/MINI already staked.

---

## Path C — SHARP (EDGE / netCLV rescue door)

**What it is:** When A and B leave **0u**, rescue from wallet skill signals.

**Live from 2026-07-19** (replaces proven-$ / SHARP-PRIME Path C):

| Gate | Tier | Units |
|------|------|------:|
| EDGE ≥ 5 **and** netCLV ≥ 5 | `SHARP` | **3u** |
| Exactly one of those | `SHARP-LEAN` | **1.5u** |
| Neither | — | **0u** |

Requires `score > 0`, still `0u`, not RANK-rescued. Then oddsCap + soft size + tape. Never up-sizes A/B.

**Legacy** (2026-06-26 … 2026-07-18): proven-$ + mean `picks.wr` + forCount. Historical tickets keep those stamps.

---

## Path D — DISSENT (contrib-margin rescue)

**Qualifies when**
- `score > 0`, still `0u` after A/B/C  
- **MLB only** · odds ≤ **+200**  
- `contribMargin ≤ 0` · max FOR share **&lt; 0.35**

| Tier | Units |
|------|------:|
| `DISSENT` | **1u** → oddsCap |

Live from **2026-07-12**. Not in the soft-NEITHER shrink set (hold through edge-net size).

---

## Path E — WINNER / winner-align (historical stake era)

**2026-07-12 … 2026-07-14:** EDGE mute/size/rescue + Policy E could change units.  
**2026-07-15+:** EDGE still stamped; **fadeTop≥60 mute only**; EDGE size/rescue/Policy E **frozen**.

---

## EDGE band size — Path A/C (2026-07-20+)

Runs **after** paths + fadeTop, **before** tape. Does not change path tier — only units.

Applies to: `SUPER` · `TOP` · `TOP+` · `MINI` · `MINI-` · `CONFIRMED` · `SHARP` · `SHARP-PRIME` · `SHARP-LEAN`

### Live (2026-07-22+)

| EDGE | Action | Units |
|------|--------|-------|
| missing or **&lt; 7** | **MUTE** | **0u** |
| **7 ≤ E &lt; 10** | **SOFT** | path × **0.75** |
| **≥ 10** | **BOOST** | path × **1.25** (≤6u, oddsCap) |

### Legacy (2026-07-20 … 2026-07-21)

| EDGE | Action | Units |
|------|--------|-------|
| missing or **&lt; 5** | **MUTE** | **0u** |
| **5 ≤ E &lt; 10** | **HALF** | path × **0.5** |
| **≥ 10** | **BOOST** | path × **1.25** (≤6u, oddsCap) |

**Exempt:** `RANK` (Path B) · `DISSENT` (Path D) — keep base path size (then tape).

Jun15+ CF (actual units): mute&lt;7 · keep 7–10 · boost≥10 lifts the book vs mute&lt;5·half 5–10 — the 5–7 slice was the poison (−36% ROI). Thresholds can regress; monitor live.

Stamps: `v8_edgeBandAction` (`MUTE` \| `SOFT` \| `HALF` \| `BOOST` \| `HOLD` \| `EXEMPT` \| `PASS`) · `v8_edgeBand` (`LT7` \| `LT5` \| `MID` \| `GE10` \| `MISSING`) · `v8_unitsPreEdgeBand`

This **replaces** BOTH/NEITHER soft size on A/C (no double boost).

---

## EDGE/net size overlay (2026-07-19+)

Runs **after** paths + fadeTop, **before** tape — **only when EDGE band did not apply** (non–A/C tiers). Does not change path tier — only units.

| Bucket | Action | Applies to |
|--------|--------|------------|
| **BOTH** (E≥5 & net≥5) | path × **1.25** (≤6u, oddsCap) | staked tiers not on EDGE band |
| **ONE** | hold | all |
| **NEITHER** | path × **0.5** | `MINI`… (legacy; A/C now on EDGE band) |
| **NEITHER** | hold | `RANK`, `DISSENT`, untiered |
| no EDGE **and** no net | fail-open hold | all |

**TOP/TOP+ NEITHER** is already **0u** upstream (hard mute).

Stamps: `v8_edgeNetSizeAction` (`BOOST` \| `HALF` \| `HOLD` \| `PASS`) · `v8_unitsPreEdgeNetSize`

---

## Tape — final size modifier (2026-07-15+)

```
EDGE   = mean(FOR sport WR) − (mean(AG) ?? 50)
netCLV = mean(FOR causal %+CLV) − (mean(AG) ?? 62)
tape   = 2·(EDGE/10) + 1.5·(netCLV/10)
```

| Tape | Action | Units |
|------|--------|-------|
| missing | **FAIL_OPEN** | keep post–edge-net units |
| **&lt; 0** | **MUTE** → 0u | except **RANK** → HOLD |
| mid | **HOLD** | unchanged |
| **≥ 2.89** | **BOOST** | × **1.35**, oddsCap, ≤ **6u** |

**Skill top floors (2026-07-21+):** BOTH (E≥10 ∧ tape boost) → **≥5u** · ONE (exactly one) → **≥4u** (oddsCap, ≤6).

Details: [`TAPE_SIZING.md`](./TAPE_SIZING.md).

---

## How every final unit size is reached

| Situation | Path | After EDGE band / soft | After tape | Final |
|-----------|------|------------------------|------------|------:|
| TOP, EDGE 3 (any net) | 4u | band MUTE (&lt;7) | — | **0u** |
| TOP, EDGE 6 | 4u | band MUTE (5–7 cut) | — | **0u** |
| TOP, EDGE 7 | 4u | band ×0.75 → 3u | hold | **3u** |
| TOP, EDGE 12, tape mid | 4u | band ×1.25 → 5u | hold | **5u** |
| TOP, NEITHER (pre-band) | 4u | hard mute | — | **0u** |
| MINI, EDGE 4 | 3u | band MUTE | — | **0u** |
| RANK, tape &lt; 0 | 4u | exempt | mute-exempt HOLD | **4u** |
| RANK, tape ≥2.89 | 4u | exempt | ×1.35 | **5.4u** |
| SHARP, EDGE 12, tape mid | 3u | band ×1.25 → 3.75u | hold | **3.75u** |
| SHARP, EDGE 12, tape ≥2.89 | 3u | band → 3.75u | ×1.35 → 5.06 → BOTH floor | **5u–6u** |
| SHARP-LEAN, EDGE 2 (net≥5) | 1.5u | band MUTE | — | **0u** |
| Any, fadeTop≥60 | Nu | — | — | **0u** |

### Odds caps

| American odds | Max units |
|---------------|----------:|
| ≥ +200 | 1.0 |
| ≥ +151 | 1.5 |
| +121 … +150 | 2.5 |
| **≤ +120** (incl. all favorites) | uncapped by odds (still ≤ **6u** global) |

---

## Unit cheat sheet (base → possible finals)

| Tier | Base u | After soft size + tape (typical) |
|------|-------:|----------------------------------|
| SUPER | 6 | 0 (tape mute) · 6 (hold/boost-capped) |
| TOP | 4 | 0 (NEITHER or tape) · 4 · **5** (BOTH) · **5.4** (tape boost) |
| MINI | 3 | 0 · **1.5** (NEITHER half) · 3 · **~5** (BOTH+boost) |
| MINI- | 1 | 0 · **0.5** · 1 · **1.35** |
| CONFIRMED | 1 | 0 · **0.5** · 1 · **1.35** |
| RANK | 4 | 4 (tape-mute exempt) · **5.4** (boost) |
| SHARP | 3 | 0 · **1.5** · **3.75** · **~5** |
| SHARP-LEAN | 1.5 | 0 · **0.75** · **1.875** · **~2.5** |
| DISSENT | 1 | 0 · 1 · **1.35** |
| MONITORING / FADE | 0 | 0 |

---

## Key stamps (Firestore)

| Field | Meaning |
|-------|---------|
| `v8_hcStakeTier` | Path tier |
| `finalUnits` | Canonical stake |
| `v8_edgeNetBucket` | `BOTH` \| `ONE` \| `NEITHER` |
| `v8_edgeNetSizeAction` | `BOOST` \| `HALF` \| `HOLD` \| `PASS` |
| `v8_unitsPreEdgeNetSize` | Units before soft size |
| `v8_tapeScore` / `v8_tapeAction` | Tape + `MUTE\|HOLD\|BOOST\|FAIL_OPEN` |
| `v8_unitsPreTape` | Units entering tape (after soft size) |
| `v8_winnerAlignEdge` / `v8_netMeanPrior` | EDGE / netCLV |
| `mutedBy` | `winner_align_fade` · `tape-weak` · `believed-cut` · `fail-open-sub4` · `board-share` · `st-fat` · … |

Full schema: [`SKILL_FEATURES.md`](./SKILL_FEATURES.md).

---

## Display grouping (UI / report)

| Display | Paths | Typical u |
|---------|-------|-----------|
| MAX PLAY | SUPER | 6 |
| TOP PICK | TOP, TOP+ | 4–5.4 |
| SHARP PLAY | RANK, SHARP, SHARP-LEAN, SHARP-PRIME, WINNER | 0.75–6 |
| STRONG | MINI | 1.5–5 |
| LEAN | CONFIRMED, MINI-, DISSENT | 0.5–1.35 |

---

## Evidence snapshot (Jun1+ actual staked CF)

| Policy | Tickets/day | PnL | ROI |
|--------|------------:|----:|----:|
| Path only | ~9.7 | +43u | 3.4% |
| Tape alone | ~7.0 | +103u | 10.5% |
| Soft gate on tape (shipped intent) | ~7.0 | +114u | 11.9% |

Soft stack ≈ **+11u / +1.4pp ROI** on top of live tape with **flat daily ticket count**.

---

## Operator checklist

1. Score must be **> 0** or nothing stakes.  
2. Read **`v8_hcStakeTier` + `finalUnits` + `v8_edgeNetBucket` + `v8_edgeNetSizeAction` + `v8_tapeAction`**.  
3. `0u` + `tape-weak` = tape skip (RANK should not get this).  
4. `0u` + TOP tier + bucket NEITHER = intentional TOP mute.  
5. `HALF` = soft NEITHER shrink — ticket stays on the board at half size.  
6. Missing tape → fail-open; missing both EDGE and net → soft-size fail-open.  
7. Deploy `main` so fetch cron runs this SHA; restamp pre–T-15 ACTIVE; graded/T-15 frozen keep old units.

# Two-Week Re-evaluation Tasks

Living checklist of trial features that need a hard look at a fixed date.
Add new entries at the top with a one-line summary + `Re-eval by:` date.

---

## v2 wallet-promotion: Source-B-only path

- **Shipped**: 2026-05-10  (commit TBD on push)
- **Re-eval by**: 2026-05-24
- **Owner**: dale
- **Files touched**: `scripts/exportWalletProfiles.js`
- **What changed**: `classifyWhitelistTier()` now accepts a Source-B-only
  promotion path. Previously a wallet had to be flat-profitable on
  featured picks (Source A, `peak.v8Scoring.walletDetails`) to earn FLAT
  or CONFIRMED. Now `positionFlatRoi > 0` from `sharp_action_positions`
  (Source B) also qualifies, gated at `B_ONLY_MIN_BETS = 5` (vs A's 2).
  Each `bySport[sport]` record stamps `whitelistSource ∈ {A, A+B, B}`
  for audit. `WHITELIST_VERSION` bumped 1 → 2.
- **Day-0 lift** (2026-05-10 dry-run):
  - MLB: 8 → 18 FLAT-or-better (+10, **+125%**, 55.6% from B-only)
  - NHL: 11 → 20 (+9, +82%, 45% from B-only)
  - NBA: 35 → 56 (+21, +60%, 37.5% from B-only)

### Re-eval checklist (run on / after 2026-05-24)

1. **Pull the v2 cohort** — every wallet whose `bySport[sport].whitelistSource ∈ {B, A+B}`
   on or after 2026-05-10. (Snapshot the JSON first; the field is overwritten every 2h.)
2. **Compare cohort outcomes** since trial start:
   - For each B-only wallet × sport, compute realized flat ROI on featured
     picks they appeared on AFTER promotion.
   - Compare to the A-only cohort over the same window.
   - Did B-only wallets behave like A-only sharps, or are they noise?
3. **Pick-level lift on engine signals** — pull every LOCKED side shipped
   2026-05-10 → 2026-05-24 and recompute Δw / HC / AGS with v1 gates
   (Source-A-only) vs v2 gates (current). Diff the win rate of the picks
   whose tier ranking *changed* because of the new wallets.
4. **Decide**: keep, tighten (raise `B_ONLY_MIN_BETS`), restrict to a subset
   of sports, or roll back.
- Roll-back is a one-line revert in `scripts/exportWalletProfiles.js` —
  set `B_ONLY_MIN_BETS = Infinity` (or revert to v1 gate). The next
  cron rebuild propagates within ~2h.

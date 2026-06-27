# A Twitter Research Report — 2026-06-27 12:26 PM ET · MIDDAY

> State of the account: profitable but quiet (0 RTs in the labeled sample). This run focuses on **upcoming plays** and pulls the **real sharp-money tape** — which corrected a key read from the morning run. Data fresh (positions re-scanned 15:06 UTC, picks 15:00 UTC).
>
> Read this, then open `AA_TWITTER_NEXT_STEPS.md` for the drafts.

---

## Sharp-money tape — upcoming plays (NOW PARSING CORRECTLY)

Source `public/sharp_positions.json` (schema: `sport → gameKey → {positions[]}`; each position has `invested` $, `side`, `name`, `tier`, `sportROI`, `leaderboardRank`, `sportPnl`).

| Play | Sharp $ on our side | % of ML $ | Wallets | Biggest single bet |
|------|---------------------|-----------|---------|--------------------|
| **Portugal ML +100** | **$742K** | **88%** | 13 | **$186K** — suntori (PROVEN, #319, +$231K) |
| Atlanta Braves ML +112 | $30K | 92% | 4 | $20K — phonesculptor (ELITE, #171, 100% ROI, +$592K) |
| England ML -550 | $92K | 65% | 7 | $32K — suntori |
| Croatia ML -130 (SUPER) | $115K | **51% (SPLIT)** | 11 | $36K — suntori |
| Cincinnati Reds ML -112 | $10K | 97% | 1 (thin) | $10K — lluucckkyy (ELITE, 450% ROI) |
| Detroit Tigers ML -129 | $14K | **38% (money against)** | 2 | $11K — lluucckkyy |

**Headline:** Portugal is the whale story — the single biggest position on the entire board ($186K) and the most lopsided money ($742K vs $99K), at **plus money**. Braves is the clean second plus-money sharp play.

**⚠️ Morning-run correction:** Croatia was framed as the day's lopsided SUPER lock. The real tape shows its **money is split 51/49** — it's a model + proven-winner conviction play, NOT a money-lopsided one. Do not post it as "zero dissent." This is exactly why the run needs the real $ tape.

---

## Growth & trends (Phase 1)
- **Sharp-vs-public board (@PatrickE_Vegas, 103K)** remains the niche's top structure: split → proof → verdict. Today's Portugal $742K-vs-$99K is a perfect fit.
- In-lane niche posts run long, **77% emoji**, **89% numbers**, **11% questions** — dense number-heavy boards win.
- Whale-tape (single outsized position) is our proven original format — and we now have a real $186K position to anchor it.

## How we're performing (Phase 2)
- Labeled n=5, avg **5.2 likes**, **0 RTs**. Gap = shareability (no standalone quotable line).
- Best post `2070640305364160568` ("other", 6L). sharp_public_board avg 4.5 (n2).
- Mandate this run: lead with the **$ market read** (now that the tape parses), one RT line, binary close.

## Tooling note (resolved)
The morning run couldn't parse `sharp_positions.json`; the schema is `sport → gameKey → positions[]` keyed by `side` (home/away/draw), with `invested` as the dollar field. `TWITTER_LOOP.md` Phase 3 now documents this so every future run pulls real $.

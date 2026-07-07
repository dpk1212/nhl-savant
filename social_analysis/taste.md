# TASTE — the file that separates us from slop

## PART -1 — THE TWO GATES (7/7 PM — read this first, every run)
Tonight every hero scored SHIP (85-114) on its FIRST draft under the old
linter and still needed 3-6 owner catches before it was actually top-1%.
SHIP means "no measured anti-pattern." It does not mean elite. Two commands
are now mandatory before ANY draft is shown as finished:
1. `node scripts/tweetLint.mjs --purpose <X> "<text>"` — bar is now **ELITE**
   (score >=105 AND all 5 gates: authority present, proprietary punch
   present, not a naked grade, scroll-stopping hook, no critical violation).
2. `node scripts/dayCoherenceCheck.mjs "<text>"` — reads what ACTUALLY
   posted today (real API data — the posted text can diverge from the
   draft; this happened tonight) and flags unpaid grade promises + repeated
   numbers/angles.
A draft that is ELITE but incoherent with the day's real timeline is still a
failure, and a draft that's coherent but generic is still a failure. Both,
every time.

> Read this BEFORE drafting anything. Rules prevent bad tweets; exemplars and
> rejections define good ones. This file is updated every time a post wins,
> a draft dies, or a niche specimen teaches something.

## PART 0 — THE RECEIPT STACK (7/7 — the single biggest finding to date)

The owner bookmarked three of OUR OWN tweets from April 2026. They out-earned
tonight's entire slate 2-5x on impressions (7,223 / 11,074 / 10,172 vs a
~1,900-2,700 baseline) using a format the loop had fully abandoned:

1. **Rowdy magic ML (7,223 impr):** "Sharps went 2-0 in the NBA play-in
   yesterday… and today a lot of the sharper money is showing up on Orlando.
   / Magic ML / 12 sharps / $147.3K invested / 70% of sharp money / Best Magic
   receipts: / 23c4 $46.2K / 9723 $37.6K / afd2 $24.6K / 266e $18.9K"
2. **Cubs ML (11,074 impr, our best of the three):** "This is exactly why I
   built this tool. / The public is on the Pirates. Pinnacle is moving with
   the Pirates. Prediction markets are moving with the Pirates. / And yet...
   / every sharp dollar we've tracked is on the Cubs. / Cubs ML -140 / 5 sharp
   bettors / $16.8K invested / 99.9% of tracked [sharp money]"
3. **Hawks dog (10,172 impr):** "Everybody is loading up NBA favorites today.
   / Cavs. Nuggets. Knicks. Rockets. / Our board only found one sharp dog
   worth talking about: / Hawks ML +200 / 3 sharps / $43.8K invested / 100% of
   tracked sharp money / +$1.2M combined P&L / Largest bet: / e8f1 / $29.4K /
   +6.1% ROI / 8.6x avg size"

**THE SKELETON (mandatory for Money Moved / Decision Window heroes when a
pick has 3+ tracked wallets):**
1. Contrarian or persona setup (public/consensus lists building tension, or a
   mission-stakes line) → "And yet..." / open-loop pivot.
2. The pick, isolated on its own line.
3. THE RECEIPT BLOCK: sharp count · $ invested · % of matchup money (or "% of
   tracked sharp money") · optionally the pool's combined P&L.
4. NAMED RECEIPTS: up to 4 lines of `<last-4-hex-wallet-tag>  $<amount>` —
   this is our house anonymization (last 4 hex chars of the public wallet
   address, NEVER the full address, NEVER a display name/handle). Generate
   with `node scripts/walletReceipts.mjs <gameKey> <ml|spread|total>
   [outcome]` — never hand-type these numbers.
5. Optional: the single largest bet's ROI and size-vs-their-own-average
   multiple ("8.6x avg size") — the specificity IS the authority.
6. Close: locks-in-X framing.
**This supersedes the earlier "individual-wallet $ banned" rule** — named,
anonymized (last-4-only) wallet receipts are OUR proven house style, not a
violation. `tweetLint.mjs` now scores 2+ named receipt lines +12 and waives
most of the length penalty (dwell is scored; the bookmarked exemplars ran
300-450 chars).

## PART 1 — EXEMPLARS (what good looks like, with receipts)

### Ours (by measured performance)
1. **Spain locked countdown — 4,116 views (our best distribution ever)**
   "Locked, 15 minutes to kickoff... Spain ML at even money. Someone asked me
   this morning for the sharp side of this game. Here it is — 12 of the 20
   winning wallets we track took Spain..."
   WHY: live decision moment + insider specificity + community callback. Urgency was real, not manufactured.
2. **July 4 record post — 4,395 views, 15 likes (best likes ever)**
   "Happy 4th. While the burgers hit the grill, the sharps are already working. +47 units since June 1..."
   WHY: holiday moment + strength + specific number + zero begging.
3. **Trent QT — 3,753 views**
   "At noon I posted that the winning sharp bettors we track are leaning Belgium... I feel a lot better about it now."
   WHY: rode a bigger account's velocity; the reader completes the joke; zero dunk.
4. **Whale story — 3,250 views**
   "One of the top 10 winners we track just bet almost 2x his normal size."
   WHY: a character + an anomaly + curiosity. The money as protagonist.
5. **Noon Belgium lean — best engagement score (5L/3R)**
   "As of noon: the winning bettors we track are leaning Belgium tonight."
   WHY: plain insider fact, timestamped, with real stakes. Calm authority.

### Niche winners (swipe file, pulled 7/7 via X API — full corpus with metrics: competitor_corpus.json)
1. **@invisiblestats — 152,931 views:** "Scott Foster is head official for Game 5,
   and he's NOT the 'extender' everyone thinks he is..." → myth-bust data reveal
   on the day's biggest story. Not a pick.
2. **@invisiblestats — 25K views, 65 replies (repeatable engine):** "I just found
   an INSANE ML system active on just 1 team today... L10y: 60% / L5y: 74% /
   This year: 88%" → STAT STAIRCASE + withheld play. Replies beg for the name.
3. **@PatrickE_Vegas — 54K views:** public floods USA, BetMGM trader: "There's
   nothing more to say than go Belgium." → insider access + one killer quote.
4. **@WizBetz — 733K views:** "This is a much bigger deal than people think." →
   authority TAKE on news. His picks do 13K; his take did 733K.
LAW FROM THE SPECIMENS: growth posts are data-backed authority on the story
everyone's already arguing about. Pick posts and recaps are retention, not reach.

### Quantified meta (7/7 — 191 posts from 5 niche accounts, views normalized
### to each account's median so format effects separate from audience size)
- **Line-1 open loop ("...") = 2.1x.** The single biggest measured format
  edge. invisiblestats' two monsters (52K, 35K vs 7.6K median) both open
  "Something very [special/uncomfortable] is about to happen in tonight's
  X..." — a prophecy the reader must resolve. OUR VERSION: "Something
  unusual is happening in tonight's [game]..." → the wallet data. This
  format is our moat wearing their best-performing costume.
- **First-person stakes line 1 = 2.5x.** Trent's 838K post is "I have bet
  against the US in every major sport the last 3 years." Persona + stakes.
  Our calm version: "I've watched these 20 wallets every day since June 1."
- **Long posts (>200 chars) UNDERPERFORM (1.30x vs 1.54x).** Reach posts are
  short; depth goes in the self-reply/thread. Trent's average is 70 chars.
- **Thread pointer (🧵/👇) = 2.1x** — commits the reader to a next beat.
- **Receipt emojis (✅❌) = 0.78x of no-receipt posts** — UNLESS the receipts
  ARE the story (Trent's 1-11 fade list). Scorecard-as-furniture loses;
  receipts-as-identity wins. Our Graded franchise is RETAIN, not REACH.
- **A literal "?" barely matters for reach (1.51x vs 1.46x).** What drives
  replies is an emotional statement that DEMANDS response ("Can I please
  bet the US tonight" — 759 replies, no question mark), not interrogation.
- **What the leaders' own FLOPS share:** link-out news reports ("Updated
  odds report: [link]"), balanced analysis with no tension, engagement
  begging ("Didn't get 100 likes, but..."). Furniture formats, even from
  90K-follower accounts, die at 0.3–0.5x.
- **Every account's income is 1–2 outliers per week (max/median 5–10x).**
  Baseline posts hold the floor; engineered swings move the follower count.
  This confirms G0: distribution events are a discipline, not luck.

## PART 2 — THE REJECTION LOG (what the owner kills, and why — never repeat)

From the 13-draft morning of 7/7 (the founding dataset):
| Draft | Hook/idea | Verdict | Law extracted |
|---|---|---|---|
| happy-L lead | "best L of the year" | KILLED | Never lead a day with a loss. Wins first, always. |
| receipts v2 | claimed site-only picks were "posted" | KILLED | Verify what went PUBLIC (ledger) vs what's on the board (Firestore). |
| FOMO guilt | "the difference was the whole profit margin" | KILLED | FOMO framed as OUR failure = negative narrative. |
| ad close | "See what you're scrolling past." | KILLED | Ad-speak closes read junior. The ask is one calm fact. |
| debate close | "should the top play be free? Convince me" | KILLED | NEVER debate the paywall. Members pay; that's the business. |
| "I cost you money" | engineered guilt hook | KILLED | Clever-engineered hooks read fake. Believable > clever. |
| "weak link in my own operation" | self-deprecation | KILLED | Violates winning narrative. We are not the joke. |
| stat card | record + wall + trial | KILLED as "junior intern" | A stat card with no story/uniqueness is slop even when true. |
| comeback arc | "Five days ago we were down 11 units" | KILLED | Drawdowns are never hooks. Lead green. |
| ATH + $10k→$15.7k + receipts + "chart doesn't need a salesman" | ACCEPTED | The record is the star; dollars make it visceral; the ask stated as fact. |

From 7/7 afternoon (Over window):
| Draft | Hook/idea | Verdict | Law extracted |
|---|---|---|---|
| Over countdown with win buried | "Locked. First pitch 2:16." + one throwaway line "same board cashed the noon ML" | KILLED by owner | **THE COMBO LAW: when a fresh win and a live pick coexist, they are ONE post — the cashed win IS the hook/receipt, the live pick IS the urgency. Never bury a same-day 4u winner in a subordinate clause, and never split them into two posts.** Winning combo: "4 units cashed at noon. 4 more locked for 2:16." |

From 7/7 evening (three-ML hero — took THREE versions; learn this one):
| Draft | Hook/idea | Verdict | Law extracted |
|---|---|---|---|
| "Three moneylines, 9 units, one window" | correct hook + clean list, no story turn | SO CLOSE, not elite (owner) | A high-lint post is still flat without one viral detail. |
| "crossed the counter" + "Proven money doesn't take dogs for fun" | generic narrative turn | KILLED — "NOT IT" (owner) | **THE PUNCH LAW: the viral detail must be OUR PROPRIETARY WALLET/SIZING DATA, not a clever narrative turn anyone could write. Unanimity ("every proven winner took X, not one took Y") or a sizing anomaly ("2x his normal size"). Pull the pick's wallet fields (provenWinnersFor/Against, consensus deltas) BEFORE drafting — the moat is the punch. If the punch could appear on any capper's feed, it isn't ours.** |
| wallet-unanimity punch, no record | "Tonight they got loud" with no proof of why the wallets matter | STILL NOT OPTIMAL (owner) | Four layers required: stakes → authority record → proprietary punch → live receipt. |
| four layers, but punch stated abstractly | "every proven winner took Seattle" with no dollars | SUPERSEDED by owner's own draft | **THE TOP-1% HERO (settled 7/7, owner-authored shape): the punch is stated in DOLLARS AND PERCENTAGES from the live wallet scan — "$121K of tracked sharp money on Seattle. $14K on Miami." + a per-play receipt stack ("Mariners ML +105 — 89% of the sharp dollars"). Pull `public/sharp_positions.json`, aggregate invested $ by side/tier, and quote the REAL figures (aggregated pool totals are now APPROVED; individual-wallet dollar figures remain banned). Numbers must come from the scan THIS run — owner's example figures are placeholders, never copy them. Close: soft site mention with NO link ("the full board's on the site — everything graded here after").** |

DATA-MEANING TRAP (7/7 — owner caught a near-fabrication): the board's
"proven X-Y" / "wallets Xfor/Yagainst" is a HEADCOUNT of proven winners on
each side of THIS pick — NOT a historical win-loss record. "That signal has
fired twice before: 2-0" was FALSE and nearly shipped. Records come from
socialRecords.mjs ONLY; wallet counts are described as counts ("every proven
winner took X, none took Y"), never as track records.

Standing kill-list (any draft matching these dies before the user sees it):
- Negative/self-deprecating hooks of any kind (loss, guilt, drawdown, mistake).
- Generic stat cards without a story, character, or live moment.
- Engineered-clever hooks that a real bettor wouldn't say out loud.
- Anything debating, apologizing for, or working around the paywall.
- Ad-speak ("don't miss out", "see what you're missing", "sign up").
- Claims about what was posted without checking the ledger.
- Numbers not verified THIS run.

### Our own timing data (7/7 — directional, n=12; re-read from `analyze` each run)
- 12:00–14:00 ET posts average ~2.9K views; 07:00–09:00 posts ~1.2K. The
  "morning post" should land closer to late morning/noon when the betting
  audience is actually on the timeline — not at 8 AM because we're awake.
- Best measured early velocity: a live grade post (~2.0K views/hour) and the
  locked-countdown post (~830/hour). Live moments carry velocity; recaps crawl.

## PART 3 — THE VOICE IN ONE LINE
A winning professional who watches proven money move in real time and says
what he sees — calm, specific, timestamped, a little wry, never begging.

# NHL Savant — Social Media Juggernaut System

**Goal:** Turn the Sharp Flow data moat into a high-volume, high-engagement Twitter/X content engine that runs with minimal manual effort while sounding 100% human and authoritative.

**Core Philosophy (non-negotiable):**
- We are an **intelligence desk**, not a picks account.
- Every post exposes something hidden, teaches market mechanics, profiles a real sharp, or maps smart-money flow.
- Data is the product. Picks are the byproduct.
- Never sound like a tout. No hype, no "lock it in", no unit counts, no DM-for-slip.

---

## The 3-Agent Automation Loop

### Agent 1 — Doc Miner (scheduled, ~daily or per major fetch)
**Trigger:** Cron (e.g., 7:00 AM ET + optional evening run) or after a full fetch-polymarket cycle.

**What it does:**
- Reads all primary Sharp Flow artifacts:
  - `public/sports_sharps.json`
  - `public/sharp_positions*.json`
  - `public/polymarket_data.json` + `kalshi_data.json`
  - `public/pinnacle_history.json`
  - `public/sharp_intel_excluded_wallets.json`
  - `data/wallet-profiles.json` + Firestore `sharpWalletProfiles`
  - `DAILY_AGSU_REPORT.md` (latest)
  - `top_picks_ranked.json`
  - `win_matrix.json`
- Computes high-signal "content packets" (not raw JSON dumps).
- Writes one structured Markdown file per day:
  - `content_sources/YYYY-MM-DD.md`

**Output contract (content_sources/YYYY-MM-DD.md):**
```markdown
# Content Sources — 2026-06-19

## 1. Sharp Convergence Candidates (HC margin ≥ +1 or strong AGS-U)
- [game] — [side] — HC +X — N wallets — $Y total — AGS qZ

## 2. Public vs Sharp Divergence (money/ticket split ≥ 15pp or whale opposes tickets)
- [game] — Tickets 62% on X / Money 81% on Y — Whale $Z on Y

## 3. Whale Tape Highlights (largest single trades or unusual sizing)
- [walletShort] — $[amt] @ [price]¢ on [outcome] — [game]

## 4. Wallet Spotlights (top 3–5 wallets active today with memorable names or big moves)
- [name] (short) — sportPnl $X — current position on [game] $Y

## 5. Bot/MM Exclusion Stats (daily)
- Excluded today: N wallets ($M volume filtered)

## 6. AGS-U Performance Snapshot (from DAILY_AGSU_REPORT)
- Last 7 days: ELITE 68% WR, q90 71% WR, overall edge +4.2u

## 7. Line Movement / CLV Signals (Pinnacle vs retail)
- [game] — Pinnacle moved 4¢ toward sharp side while retail stayed flat

## 8. Historical Context (win_matrix or past similar setups)
- Sides with this HC margin historically hit 61% (n=87)
```

This file is the **single source of truth** for the Idea Generator. It is human-readable and agent-friendly.

---

### Agent 2 — Idea Generator (triggered by new content source or on schedule)
**Trigger:** New file in `content_sources/` or daily at 8:00 AM ET.

**What it does:**
- Reads the latest `content_sources/YYYY-MM-DD.md`
- Generates 6–10 post ideas, each tagged with:
  - Pillar (I1–I5 or new)
  - Hook (first 8–12 words)
  - Key data points to use
  - Suggested format (single tweet, 2-tweet thread, image + tweet, etc.)
  - Priority (High/Med/Low) based on virality potential
- Writes `content_ideas/YYYY-MM-DD.json` (or a Firestore collection for the Writer to consume).

**Idea object shape:**
```json
{
  "id": "2026-06-19-03",
  "pillar": "I2",
  "hook": "Everyone is betting the Yankees because the public loves them.",
  "data": ["Tickets 67% on NYY", "Money 78% on TOR", "3 proven wallets $41K on TOR"],
  "format": "single",
  "priority": "High",
  "notes": "Strong money/ticket split + whale backing"
}
```

---

### Agent 3 — Social Expert Writer (the voice)
**Trigger:** Manual (you pick an idea) or autonomous on High-priority ideas.

**What it does:**
- Loads `TWITTER_AGENT_INSTRUCTIONS.md` + `TWITTER_STRATEGY.md` as permanent memory.
- Takes one idea from the pending list.
- Writes the final post/thread in the exact voice:
  - Human, authoritative, data-journalism tone.
  - Short paragraphs. Strong first line.
  - Ends with the data flex, never a hard CTA.
  - Uses the exact templates from the instructions where they fit.
- Optionally generates an image prompt for a chart or visual.
- Outputs ready-to-post text + any supporting assets.

**Voice rules (enforced in prompt):**
- Never say "we're posting picks" or "tail this".
- Never use "🔥", "🚀", "💰" spam.
- Always attribute numbers to the tape ("the wallets", "the leaderboard", "on-chain").
- If a post could have been written by any other account, rewrite it.

---

## Supporting Docs (to be created / maintained)

| Doc | Purpose | Owner |
|-----|---------|-------|
| `SOCIAL_JUGGERNAUT_SYSTEM.md` | This file — the master architecture | You + Agent |
| `TWITTER_STRATEGY.md` | The 5 pillars + mining workflow (already exists) | Static |
| `TWITTER_AGENT_INSTRUCTIONS.md` | Exact voice + templates + data contracts (already exists) | Static |
| `content_sources/YYYY-MM-DD.md` | Daily mined intelligence packets | Agent 1 |
| `content_ideas/YYYY-MM-DD.json` | Slate of post ideas ready for writing | Agent 2 |
| `posted/YYYY-MM-DD.json` | Log of what was actually posted (for learning) | Manual or Agent 3 |

---

## Implementation Roadmap

**Phase 1 (now)**
- Create this system doc.
- Build Agent 1 (Doc Miner) as a Cursor Automation (cron trigger, reads repo files, writes `content_sources/`).
- Manually run it once to generate today's source doc.

**Phase 2**
- Build Agent 2 (Idea Generator) — can be a second automation or the same agent with different instructions.
- Build Agent 3 (Social Expert) — the one that actually writes the tweet text.

**Phase 3 (stretch)**
- Add a feedback loop: log posted threads + basic engagement signals (if available via X API) so the Idea Generator learns what performs.
- Add image generation step (chart of money/ticket split, whale tape screenshot, etc.).

---

## Success Metrics (what "good" looks like)

- 3–6 high-quality posts per day without you writing every word.
- Engagement rate on intelligence posts ≥ current pick-post engagement.
- Zero "this sounds like a bot" replies.
- People quote-tweet the data ("this is why I follow this account").

---

**Next action:** We will create the first automation (Doc Miner) using Cursor Automations right now.

Ready?
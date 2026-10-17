# Analytics ingest — fluid timeline (mandatory)

**Trigger:** Dale drops / attaches an X analytics export (usually `account_analytics_content_*.csv`), a **GA4 trial overlay / `trial_started` paste**, or says “use this CSV / latest analytics.”  
**Law:** Parse → synthesize → write the matching living file **before** drafting any tweet.  
**Two scoreboards:**
- **Attention** = content CSV (engagements, replies, profile visits, URL clicks) > vanity impressions
- **Trials** = GA4 overlay (`trial_overlay.md`) — **north star**. High impressions without a fork do not count.

When the two conflict (Aug 2 11.9k impr / 2 t.co trials · Sep 9 mid-eng / 11 trials): **trials win the ask decision; attention still wins the give-hook decision.**

---

## Detect drop type

| Drop | Write | Do not wipe |
|------|--------|-------------|
| **Content CSV** | `SHARED/recent_timeline_latest.md` + **LIVING WINDOW** in `hormozi_tweet_process.md` | **TRIAL OVERLAY** block · `trial_overlay.md` |
| **Account overview CSV** | Rank **days** in timeline notes. Keep last content-CSV top-10 as hook law. | Post-level hook chart · trial overlay |
| **Trial overlay / GA4 paste** | `trial_overlay.md` + **TRIAL OVERLAY** block in `hormozi_tweet_process.md` + source notes | Content-CSV living window (unless a CSV landed the same run) |

Copy CSVs into `researcher/knowledge/sources/`. Save overlay pastes as `sources/trial_overlay_YYYY-MM-DD_notes.md`.

---

## Pipeline (content CSV)

### 1 · Load
- Read the CSV (path under uploads/assets/chat attach)
- **Detect type:**
  - **Content** (typical): Post text, Impressions, Engagements, Likes, Replies, Reposts, Profile visits, Detail expands, URL Clicks, Date → rank posts (steps 2–3)
  - **Account overview** (daily totals, no post text): Date, Impressions, Likes, Engagements, Replies, Profile visits, New follows, Create Post, … → rank **days**, not hooks. Keep the last content-CSV top-10 as hook law until a new content export lands. Do not invent post-level SPCL from daily totals.
- Note date window + CSV type in the timeline file header
- If the same message also has a trial overlay, run **both** pipelines. Overlay ask-shape outranks CSV “cold, never ask.”

### 2 · Rank
Sort top **10** by:
1. Engagements (primary)
2. Replies (tie-break — conversation)
3. Profile visits / URL clicks (compliance proxies)
4. Impressions (reach only — secondary)

Also list bottom / soft opens (high imp + ~0 replies, or soft diary line-1 with weak eng).

### 3 · SPCL tag each winner (1–2 letters)
For each top post, name which letters it **owned** (not all four):

| Letter | Observable in the open |
|--------|------------------------|
| S | Scarce $ / printer / sized units we control |
| P | Say–do / cash then return / kept showing up |
| C | Hard receipt / split contrast / third-party |
| L | Dale voice / confession — only if that’s the spear |

Aggregate **SPCL mix** for the window (what’s hot).

### 4 · Messaging continuity
- Themes spent this window (don’t echo)
- Unfinished stakes / serialization still open
- Silhouettes safe to reuse **if** they fit tomorrow’s ONE idea
- **Ask temperature:** from overlay first (proof+invite vs price), then CSV proof density. URL clicks are a dead proxy (`?ref=` broken).

### 5 · Write
Overwrite `twitter_agents/SHARED/recent_timeline_latest.md` using its template.  
**Also overwrite** the **LIVING WINDOW** block in `hormozi_tweet_process.md` (winners · deaths · ask temp · hook addendum). **Do not overwrite the TRIAL OVERLAY block.**  
Merge winners / spent / ask temp / FORWARD LOOK into `SHARED/messaging_continuity.md`.  
One-line commit optional if on a long-running desk branch; otherwise fine as working file each run.

### 6 · Hand off
Only then run `hormozi_tweet_process.md` (PURPOSE → ONE → hook QA using this file + `trial_overlay.md`).

---

## Pipeline (trial overlay / GA4 paste)

1. **Lock the numbers Dale gave** — do not invent per-tweet causality. Note property id, TZ, event count, method (`?ref=` broken = overlay).
2. **Write** `trial_overlay.md` (headline · sources · sess→trial · spike table · write/skip · ask law).
3. **Overwrite** the **TRIAL OVERLAY** block at the top of `hormozi_tweet_process.md` (after the read-list, before LIVING WINDOW).
4. **Patch ASK rows** that still say “soft trial in SR only” if the overlay changed the ask shape.
5. **Save** `sources/trial_overlay_YYYY-MM-DD_notes.md`.
6. Merge ask-shape into `messaging_continuity.md`. Do not draft unless Dale also dumped a spine.

---

## If no CSV
Still refresh timeline from last 5–10 known posts / COPY_PASTE qualitatively. Mark `Sources: no CSV — qualitative only`. Keep `trial_overlay.md` as the compliance law.

---

## Example so-what
CSV (Sep 8–14) shows `$79.5k` as eng king and MVP25 as a 9-eng death.  
Overlay (Jul 17–Sep 13) shows Aug 2’s 11.9k-impr `$5.35` SR = 2 t.co trials, and Sep 9’s honest L = 11 trials.  
→ next ask = hard number then a fork **in the same tweet**. Never open on the convert paragraph. Never hide the trial under 300 impressions. Ticket-slip reach is not a trial plan by itself.

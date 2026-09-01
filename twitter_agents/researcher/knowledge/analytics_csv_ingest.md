# Analytics CSV Ingest — fluid timeline (mandatory)

**Trigger:** Dale drops / attaches an X analytics export (usually `account_analytics_content_*.csv`) or says “use this CSV / latest analytics.”  
**Law:** Parse → synthesize → write `SHARED/recent_timeline_latest.md` **before** drafting any tweet.  
**Scoreboard:** right-avatar engagement (engagements, replies, profile visits, URL clicks) > vanity impressions alone (Hormozi educator litmus).

---

## Pipeline

### 1 · Load
- Read the CSV (path under uploads/assets/chat attach)
- Confirm columns (typical): Post text, Impressions, Engagements, Likes, Replies, Reposts, Profile visits, Detail expands, URL Clicks, Date
- Note date window in the timeline file header

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
- **Ask temperature:** cold / warm / hot from URL clicks + proof density

### 5 · Write
Overwrite `twitter_agents/SHARED/recent_timeline_latest.md` using its template.  
One-line commit optional if on a long-running desk branch; otherwise fine as working file each run.

### 6 · Hand off
Only then run `hormozi_tweet_process.md` (PURPOSE → ONE → hook QA using this file).

---

## If no CSV
Still refresh timeline from last 5–10 known posts / COPY_PASTE qualitatively. Mark `Sources: no CSV — qualitative only`.

---

## Example so-what
CSV shows `#1 eng = “Most people try to become sharp…”` and `#1 imp = “EVERY TIME WE WENT OVER 5u”`  
→ next draft’s hook QA must consider those silhouettes **when** they fit the spine — never paste them onto an unrelated QT.

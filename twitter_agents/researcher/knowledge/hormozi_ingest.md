# Hormozi Transcript Ingest — max leverage (mandatory)

**Trigger:** Dale pastes / attaches / links an Alex Hormozi transcript, teaching, or notes and wants it in the system (or says “add this,” “lock this,” “use this”).  
**Law:** Do **not** skim and write one cute tweet. Run this full synthesis. Old Twitter craft stays retired.  
**Model bias:** Use full reasoning capacity — extract, conflict-check, Sharp-Flow-map, update canon, prove so-what. Surface uncertainty; never invent Hormozi quotes.

---

## Goal

Turn raw teaching into **operating law** the tweet desk can execute:
- Clear definitions (operational, not vibes)
- Sharp Flow mapping (dream · board · sized units · trial ask)
- Updates to pathway / SPCL / Qual / Value / Diagnostic as earned
- Kill list of misreads we must stop

---

## Pipeline (run in order)

### 1 · Capture (source of truth)
- Save raw notes under `twitter_agents/researcher/knowledge/sources/hormozi_<topic>_YYYY-MM-DD_notes.md`
- Header: date · Dale capture · topic · medium (live / YT / book) · pairing canons
- Prefer Dale’s pasted transcript as locked source; if only a link, fetch what we can and label gaps

### 2 · Extract (unbounded pass — parallel lenses)
Read the whole thing. Pull into buckets (skip empty buckets):

| Bucket | Extract |
|--------|---------|
| **Definitions** | Terms with operational meaning (e.g. Status = control of reinforcers) |
| **Laws / formulas** | Equations, ordered steps, “if forced to pick one” |
| **Anti-patterns** | What he says fails (toss salad, majoring in minors, automate first, half-truth) |
| **Proof / empirics** | Numbers he cites — mark **Hormozi-claimed, not independently verified** |
| **Ask / offer economics** | Free vs ask · ask sizing · guarantees · bonuses |
| **Content manufacturing** | Qual · Algorithm steps · volume · stuff vs container |
| **Trust / education** | Show-me · proof is pudding · whole truth · easy instructions + conviction |
| **Examples** | Stories we can map (bartender, color grade, agency imposter, etc.) |

For every claim run: **What does that mean? How do you know? So what?**

### 3 · Conflict check
- Diff vs existing canons (`hormozi_*.md`, `TWITTER.md`, `hormozi_tweet_process.md`, brand dream)
- Table: **New** · **Sharpens** · **Contradicts** · **Resolution** (Dale spine wins if conflict with product law)
- Do not silently overwrite; call contradictions out in the notes + PR/commit message

### 4 · Sharp Flow map (mandatory)
Translate into our domain only where SPCL exists:

| Hormozi lever | Sharp Flow seat |
|---------------|-----------------|
| Dream outcome | Size up when we + printers confident — **without becoming sharp** |
| Likelihood | Public grades · wallet $ · sized tiers · OG ledgers · v12 curve |
| Time delay | Before tipoff / lock alerts — not “study for years” |
| Effort | Kill become-sharp homework; keep betting; change *when* they press |
| Status | Scarce printer board / sized lock book |
| Power | Say–do: pointed → graded; soft day → still showing up |
| Credibility | Hard UI / third-party tags / beat-close / units |
| Qual | Stuff = receipts + whole truth; container = format |
| Ask | Free trial — watch and grade yourself (SR when PURPOSE=ask) |

If a teaching doesn’t map, park it under “not our domain” — don’t force fashion-tips-from-money-guy errors.

### 5 · Canon update (write the operating file)
- **New topic** → new `hormozi_<topic>.md` canon (laws + SF map + agent checklist)
- **Extension** → patch the existing canon; bump “Source locked” date/line
- Always keep `sources/*_notes.md` as the transcript digest
- Update `hormozi_tweet_process.md` **only if** the teaching changes WHO/PURPOSE/HOOK/ASK rules
- Update `SHARED/brand_seed.md` soft-ask / dream lines only when the dream/ask truly shifts
- INDEX + `research_log.md` + `strategist/memory/what_works.md` one entry each

### 6 · Desk leverage (so what for tomorrow’s tweets)
Write a short **Leverage card** at the bottom of the canon (or in notes):

```
LEVERAGE CARD
- Prefer hooks shaped like: …
- Own SPCL letters when teaching applies: …
- Kill: …
- Example ONE ideas this unlocks: …
- Ask temperature impact: …
```

### 7 · Prove ingest (Qual litmus)
Before claiming “locked”:
- [ ] Source notes file exists with date
- [ ] Canon has operational definitions (not slogans)
- [ ] SF map table filled
- [ ] Conflicts listed or “none”
- [ ] Tweet pathway / brand updated **only if earned**
- [ ] One concrete example: “If Dale asks for X tweet tomorrow, we now do Y differently because of this teaching”

### 8 · Commit / PR
On Hormozi OS branch: commit canon + notes + pathway patches; update PR body with the leverage card.

---

## Anti-patterns for ingest (Dale hate list)

- Skim → one poetic summary → no file updates
- Name-drop frameworks in tweets without changing operating law
- Import every Hormozi topic into every post (toss salad)
- Automate tweet gen before deleting bad requirements
- Treat views as the scoreboard

---

## Triggers (agent must auto-start)

| Dale does | You do |
|-----------|--------|
| Pastes Hormozi transcript / “add this teaching” | **This ingest pipeline** end-to-end |
| Drops analytics CSV | `analytics_csv_ingest.md` → refresh `recent_timeline_latest.md` |
| Asks for a tweet after either drop | Ingest/timeline **first**, then `hormozi_tweet_process.md` |

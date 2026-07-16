# Twitter Growth Org — closed loop (Social Neuron shape, our moat)

Goal: 10K followers · 1K subscribers. **Never auto-publish.**

Inspired by Social Neuron’s Ideate → Create → Distribute → Analyze → Learn,
implemented with our agents + proprietary sharp-wallet receipts.

## Stages

| SN stage | Our step | Owner |
|----------|----------|-------|
| Analyze | `growthPulse.mjs --save` | Parent / script |
| Learn | `twitterLearn.mjs` → ledger + learn brief | Script (auto after pulse) |
| Ideate | idea_queue (8–15) + angle_candidates | Researcher |
| — | Coach craft autopsy | Coach |
| Create | chosen_angle → hero/SR copy | Strategist pick → Editor |
| Brand gate | brand_seed + saver bans | Editor + `saveTwitterDrafts.mjs` |
| Distribute | distribution_job + compose links | Strategist · Dale posts |

## Agent pipeline (every run)

```
Pulse → Learn → Coach → Researcher(Ideate + angles) → Strategist(pick) → Editor → BrandGate → Save
```

**Model law (Dale 2026-07-12):** every Task subagent launches with
`model: grok-4.5-fast-xhigh` (Grok). No Claude/GPT/Composer for loop agents
unless Dale overrides for that run. See `.cursor/rules/subagent-model-grok.mdc`.

| Step | Agent | Rule | Output |
|------|-------|------|--------|
| −2 | Pulse | `scripts/growthPulse.mjs` | `growth_pulse.json` |
| −1 | Learn | `scripts/twitterLearn.mjs` | `learning_ledger.json` + `learn_brief_latest.md` |
| 0 | **Coach** | `.cursor/rules/twitter-coach.mdc` | COACH BRIEF |
| 1 | **Researcher** | `.cursor/rules/twitter-researcher.mdc` | idea_queue + angle_candidates |
| 2 | **Strategist** | `.cursor/rules/twitter-strategist.mdc` | chosen_angle + strategyPass |
| 3 | **Editor** | `.cursor/rules/twitter-editor.mdc` | Final copy + editorPass |

Dale spine/angle = **override** when he dumps one — not the default.
Missing learn brief / empty idea_queue / missing angle_candidates → FAIL
(unless Dale override).

## Shared sources of truth

- `SHARED/brand_seed.md` — Brand Brain 8/8 essentials
- `SHARED/learn_brief_latest.md` · `learning_ledger.json` — Learn weights
- `twitter_drafts/idea_queue.json` — Ideate cards
- `researcher/knowledge/inspiration_board.md` — generate-from-this
- `SHARED/coach_brief_latest.md` — write-better
- `BRAND_MESSAGING.md` · `MY_VOICE_PROFILE.md` · `ALGO_PSYCH_PLAYBOOK.md`
- `TWITTER.md` — loop bible
- `twitter_drafts/growth_pulse.json` — measured OVER/UNDER

## Interviews

Each agent interviews Dale once (then refreshes when voice/strategy shifts).
Status: each agent's `INTERVIEW.md`. Answers: `memory/brand_answers.md`.

## Knowledge compounds

Learn script weights mechanics → vault kill/promote.
Coach → `coach/memory/`. Researcher → `researcher/knowledge/`.
Strategist → `strategist/memory/`. Editor → craft locks / fail patterns.

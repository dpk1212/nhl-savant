# Idea queue (Ideate stage)

Cheap angle cards **before** Editor craft. Researcher writes 8–15 per loop.
Strategist picks 1–2. Rest stay for later runs.

## Schema (`twitter_drafts/idea_queue.json`)

```json
{
  "schemaVersion": 1,
  "updatedAt": "ISO",
  "runLabel": "2026-07-12_…",
  "ideas": [
    {
      "id": "iq_001",
      "mode": "research|brainstorm|campaign|trends",
      "status": "queued|picked|used|killed",
      "job": "RECEIPT_CONFESSION|…",
      "topic": "one sentence",
      "hook_promise": "what line 1 owes",
      "viral_why": "why now — cite learn mechanic or teacher id",
      "predicted_band": "OVER|PAR|UNDER",
      "learn_mechanic": "confession_costly|…",
      "evidence": "pulse id / board id / board receipt",
      "inspiration_ref": null
    }
  ]
}
```

## Modes (Social Neuron analogue)

| Mode | Use when |
|------|----------|
| research | Competitor / teacher mechanic + our receipts |
| brainstorm | Brand-voice volume around live board |
| campaign | Multi-post series (tear / weekend purple) |
| trends | Timely WC / MLB discourse join |

## Law

- Empty queue → FAIL Researcher (unless `daleAuthoredSpine`)
- Picked ideas must expand into full `angle_candidates` packages
- Cite `learning_ledger.json` prefer/avoid in `viral_why` / `learn_mechanic`

# Closed positions (EXITED) + scan heartbeat

## Problem

`writeSharpActions` only upserts positions the scanner still sees as open. When a wallet closes or flips sides, the old Firestore doc used to stay `PENDING` with a frozen `updatedAt`. Live staking then inferred absence via a **30‑minute freshness prune** — slow, and unable to tell “wallet exited” from “wallet not scanned this cycle.”

## What we ship

### 1. Polymarket identity on every open position

Scan → JSON → Firestore:

| Field | Source |
|-------|--------|
| `asset` | outcome token id (`/positions`) |
| `conditionId` | market condition |
| `outcomeIndex` | outcome index |
| `eventId` | event id (when present) |

Doc id unchanged: `{date}_{sport}_{gameKey}_{wallet8}_{ML\|SPREAD\|TOTAL}_{side}`.

### 2. `scanHeartbeat` on `sharp_positions*.json`

Written by `scanSharpPositions.js`, merged by `scanWhitelistedWallets.js` for supplemental fetches:

```json
{
  "scanHeartbeat": {
    "scannedAt": "ISO",
    "okWallets": ["0x…"],
    "openAssets": { "0x…": ["assetId", "…"] }
  }
}
```

- **`okWallets`**: addresses whose `/positions` fetch returned an array this cycle.
- **`openAssets`**: every `asset` on that response (not only today’s matched games).

API failure → wallet omitted from `okWallets` → **no EXITED stamp**.

### 3. `status: 'EXITED'` in `writeSharpActions`

After the upsert pass, for each today’s `PENDING` doc **not** in the current qualifying write set:

1. Wallet must be in `scanHeartbeat.okWallets`.
2. If doc has `asset` → EXITED when that asset is absent from `openAssets[wallet]`.
3. Else (legacy) → EXITED when soft key `(wallet, sport, gameKey, market, side)` is absent from the scan JSONs.

Fields set: `status`, `exitedAt`, `exitReason` (`asset_absent` | `soft_key_absent_legacy`).

If an EXITED position reappears in the scan → reset to `PENDING` and clear exit fields.

### 4. Staking filter

`syncPickStateAuthoritative` keeps **only `PENDING`** for HC / RANK / AGS. Freshness (30 min) remains as a silence safety net for wallets not in `okWallets`.

### 5. Grading

`gradeSharpActions` still queries `status == 'PENDING'` only. Closed-before-settle rows stay `EXITED` and are not graded as game W/L (correct: their PnL is the exit price, not the final).

## Cron path

`.github/workflows/fetch-polymarket.yml`:

`scanSharpPositions` → `scanWhitelistedWallets` → `writeSharpActions` → `syncPickStateAuthoritative`

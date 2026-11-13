/**
 * Held-check for tickets the 30-minute freshness prune just left off the
 * live board. The prune itself is unchanged. This list is the tickets it
 * dropped, and a later step asks Polymarket whether those wallets still
 * hold the asset. A failed call leaves the ticket dropped.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

export const MAX_CONFIRM_WALLETS = 60;
export const CONFIRM_BUDGET_MS = 45_000;
export const CONFIRM_FILE_MAX_AGE_MS = 20 * 60 * 1000;
export const CANDIDATE_FILE = 'prune_candidates.json';

export function pruneCandidatePath(root) {
  return join(root, 'tmp', CANDIDATE_FILE);
}

export function writePruneCandidates(filePath, { date, candidates, writtenAt = new Date().toISOString() } = {}) {
  const rows = Array.isArray(candidates) ? candidates : [];
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify({
    writtenAt,
    date: date || null,
    count: rows.length,
    candidates: rows,
  }));
  return rows.length;
}

export function candidatesAreFresh(file, nowMs, maxAgeMs = CONFIRM_FILE_MAX_AGE_MS) {
  const t = Date.parse(file?.writtenAt);
  return Number.isFinite(t) && Number.isFinite(nowMs) && nowMs - t >= 0 && nowMs - t <= maxAgeMs;
}

/** Assets still open. A zero size is not a hold. */
export function heldAssetSet(rows) {
  const set = new Set();
  if (!Array.isArray(rows)) return set;
  for (const row of rows) {
    const asset = row?.asset != null && row.asset !== '' ? String(row.asset) : '';
    const size = Number(row?.size);
    if (asset && Number.isFinite(size) && size > 0) set.add(asset);
  }
  return set;
}

export function walletsInOrder(candidates, cap = MAX_CONFIRM_WALLETS) {
  const out = [];
  const seen = new Set();
  for (const row of candidates || []) {
    const wallet = String(row?.wallet || '').toLowerCase();
    if (!wallet || seen.has(wallet)) continue;
    seen.add(wallet);
    out.push(wallet);
    if (out.length >= cap) break;
  }
  return out;
}

/**
 * `heldByWallet` maps a lowercased wallet to its open-asset set, or null
 * when that wallet's fetch failed. Null keeps the ticket dropped and does
 * not call it closed.
 */
export function selectHeldCandidates(candidates, heldByWallet) {
  const keep = [];
  const absent = [];
  const failed = [];
  const noAsset = [];
  const unchecked = [];
  for (const row of candidates || []) {
    const wallet = String(row?.wallet || '').toLowerCase();
    const asset = row?.asset != null && row.asset !== '' ? String(row.asset) : '';
    if (!row?.id || !wallet || !asset) {
      noAsset.push(row);
      continue;
    }
    if (!heldByWallet || !heldByWallet.has(wallet)) {
      unchecked.push(row);
      continue;
    }
    const held = heldByWallet.get(wallet);
    if (held == null) {
      failed.push(row);
      continue;
    }
    if (held.has(asset)) keep.push(row);
    else absent.push(row);
  }
  return { keep, absent, failed, noAsset, unchecked };
}

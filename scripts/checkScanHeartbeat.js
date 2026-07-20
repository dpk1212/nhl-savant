#!/usr/bin/env node
/**
 * Cadence guard for the market-data cycle.
 *
 * Exit 0 if public/scan_heartbeat.json (or sharp_positions.scannedAt) is fresh.
 * Exit 1 if missing / unparseable / older than MAX_AGE_SEC.
 *
 * Used by fetch-polymarket.yml after scanSharpPositions so a "success" exit
 * with a stale/missing write can't silently pass as a healthy cycle.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');
const MAX_AGE_SEC = Number(process.env.SCAN_HEARTBEAT_MAX_AGE_SEC || 600); // 10 min

function readScannedAt() {
  const hbPath = join(PUBLIC, 'scan_heartbeat.json');
  if (existsSync(hbPath)) {
    try {
      const hb = JSON.parse(readFileSync(hbPath, 'utf8'));
      if (hb?.scannedAt) return hb.scannedAt;
    } catch { /* fall through */ }
  }
  const posPath = join(PUBLIC, 'sharp_positions.json');
  if (existsSync(posPath)) {
    try {
      const pos = JSON.parse(readFileSync(posPath, 'utf8'));
      if (pos?.scannedAt) return pos.scannedAt;
    } catch { /* fall through */ }
  }
  return null;
}

const scannedAt = readScannedAt();
if (!scannedAt) {
  console.error('[checkScanHeartbeat] FAIL — no scannedAt in heartbeat or sharp_positions');
  process.exit(1);
}
const ageSec = (Date.now() - new Date(scannedAt).getTime()) / 1000;
if (!Number.isFinite(ageSec) || ageSec < -60) {
  console.error(`[checkScanHeartbeat] FAIL — unparseable scannedAt=${scannedAt}`);
  process.exit(1);
}
if (ageSec > MAX_AGE_SEC) {
  console.error(`[checkScanHeartbeat] FAIL — scannedAt=${scannedAt} age=${ageSec.toFixed(0)}s > ${MAX_AGE_SEC}s`);
  process.exit(1);
}
console.log(`[checkScanHeartbeat] OK — scannedAt=${scannedAt} age=${ageSec.toFixed(0)}s`);
process.exit(0);

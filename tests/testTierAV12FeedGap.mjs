/**
 * Regression: Action CONFIRMED Tier A must feed v12 / FOOLS math.
 *
 * Incident 2026-08-29 MLB phi_laa — wallet …4417bc CONFIRMED ~1.9× sport-usual
 * on Action, missing from live PENDING bag → FOOLS bestFor=FLAT → 0u.
 *
 * Run: node tests/testTierAV12FeedGap.mjs
 */
import assert from 'assert';
import {
  collectScanBoardProvenPositions,
  collectScanSoftKeys,
  mapPositionsToStakeWalletDetails,
  mergeScanBoardIntoLive,
  positionSoftKey,
  SCAN_BOARD_SHADOW_MIN,
} from '../scripts/lib/hydrateLivePositionsFromScan.js';
import {
  bestProvenForSide,
  applyFoolsGoldMuteOverlay,
} from '../src/lib/walletClvSkill.js';
import { HC_RATIO, aggregateSideProven } from '../src/lib/ags.js';

const WALLET_A = '0x3814198398e2d02c0e8fba652345995cf84417bc'; // 4417bc CONFIRMED
const WALLET_FLAT = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa4fe4c4';

function profileMap() {
  const m = new Map();
  m.set('4417bc', {
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 30, invested: 30 * 540 }, // usual $540
        picks: { n: 40, flatRoi: -11.4 },
      },
    },
  });
  m.set('4fe4c4', {
    bySport: {
      MLB: {
        whitelistTier: 'FLAT',
        positions: { n: 20, invested: 20 * 12000 },
        picks: { n: 50, flatRoi: 5.2 },
      },
    },
  });
  return m;
}

function scanFiles() {
  return [
    {
      mkt: 'ML',
      data: {
        MLB: {
          phi_laa: {
            away: 'Philadelphia Phillies',
            home: 'Los Angeles Angels',
            positions: [
              {
                wallet: WALLET_A,
                side: 'away',
                invested: 1035,
                avgSportBet: 2002, // cross-sport trap
                sportROI: 2.2,
              },
              {
                wallet: WALLET_FLAT,
                side: 'away',
                invested: 29996,
                avgSportBet: 9528,
                sportROI: 19,
              },
            ],
          },
        },
      },
    },
  ];
}

// ── 1. Scan board collects Tier A despite cross-sport < 0.75 ──────────────
{
  const rows = collectScanBoardProvenPositions({
    posFiles: scanFiles(),
    walletProfiles: profileMap(),
    date: '2026-08-29',
  });
  const a = rows.find((r) => r.walletShort === '4417bc');
  assert.ok(a, 'CONFIRMED Tier A must be collected from scan board');
  assert.ok(a.v8_sizeRatio >= 1.5, `sport-local size expected ≥1.5, got ${a.v8_sizeRatio}`);
  assert.ok(a.avgSportBet < 1000, `sport usual ~540 stamped, got ${a.avgSportBet}`);
  assert.equal(a.qualificationTier, 'VAULT');
  console.log('✓ scan board collects CONFIRMED Tier A at sport-local size');
}

// ── 2. Merge restores Tier A missing from Firestore live set ─────────────
{
  const scan = collectScanBoardProvenPositions({
    posFiles: scanFiles(),
    walletProfiles: profileMap(),
    date: '2026-08-29',
  });
  // Live bag: only the FLAT whale (Tier A dropped by EXITED/freshness)
  const liveOnlyFlat = [
    {
      wallet: WALLET_FLAT,
      walletShort: '4fe4c4',
      sport: 'MLB',
      gameKey: 'phi_laa',
      marketType: 'ML',
      side: 'away',
      invested: 29996,
      avgSportBet: 12000,
      v8_sizeRatio: 2.5,
      status: 'PENDING',
    },
  ];
  const { positions, added } = mergeScanBoardIntoLive(liveOnlyFlat, scan);
  assert.equal(added, 1, 'exactly one hydrated row (Tier A)');
  assert.ok(
    positions.some((p) => positionSoftKey(p).includes('4417bc') || p.walletShort === '4417bc'),
    'merged live set must include Tier A',
  );
  console.log('✓ merge hydrates missing Tier A into live bag');
}

// ── 3. Soft keys exempt scan-board tickets from freshness drop ───────────
{
  const keys = collectScanSoftKeys(scanFiles());
  const k = `${WALLET_A.toLowerCase()}|MLB|phi_laa|ML|away`;
  assert.ok(keys.has(k), 'scan soft key present for Tier A');
  console.log('✓ scan soft keys cover Tier A for freshness exempt');
}

// ── 4. Without Tier A → FOOLS FLAT mute; with Tier A → CONFIRMED holds ───
{
  const profiles = profileMap();
  const flatOnly = mapPositionsToStakeWalletDetails(
    [{
      wallet: WALLET_FLAT,
      side: 'away',
      invested: 29996,
      avgSportBet: 12000,
      v8_sizeRatio: 0.5, // poisoned cross stamp — sport-local overlay fixes
    }],
    'MLB',
    profiles,
  );
  const bestFlat = bestProvenForSide(flatOnly, 'away', 'MLB', profiles);
  assert.equal(bestFlat.tier, 'FLAT');
  const foolsFlat = applyFoolsGoldMuteOverlay({
    units: 4,
    tier: 'RANK',
    bestForTier: bestFlat.tier,
    pickDate: '2026-08-29',
  });
  assert.equal(foolsFlat.mutedBy, 'fools-gold-flat');
  assert.equal(foolsFlat.units, 0);

  const both = mapPositionsToStakeWalletDetails(
    [
      {
        wallet: WALLET_FLAT,
        side: 'away',
        invested: 29996,
        avgSportBet: 12000,
        v8_sizeRatio: 2.5,
      },
      {
        wallet: WALLET_A,
        side: 'away',
        invested: 1035,
        // Cross-sport stamp that made Vault HC / old math blind:
        avgSportBet: 2002,
        v8_sizeRatio: 0.52,
      },
    ],
    'MLB',
    profiles,
  );
  const tierA = both.find((w) => w.wallet === '4417bc');
  assert.ok(tierA.sizeRatio >= HC_RATIO, `sport-local overlay → HC size, got ${tierA.sizeRatio}`);
  const bestBoth = bestProvenForSide(both, 'away', 'MLB', profiles);
  assert.equal(bestBoth.tier, 'CONFIRMED', 'Tier A must beat FLAT as best proven FOR');
  const foolsOk = applyFoolsGoldMuteOverlay({
    units: 4,
    tier: 'RANK',
    bestForTier: bestBoth.tier,
    pickDate: '2026-08-29',
  });
  assert.equal(foolsOk.mutedBy, null);
  assert.equal(foolsOk.units, 4);
  console.log('✓ Tier A in bag → FOOLS does not mute; sport-local size ≥ HC');
}

// ── 5. HC aggregate counts Tier A at sport-local ≥ 1.5× ───────────────────
{
  const profiles = profileMap();
  const wd = mapPositionsToStakeWalletDetails(
    [{
      wallet: WALLET_A,
      side: 'away',
      invested: 1035,
      avgSportBet: 2002,
      v8_sizeRatio: 0.52,
    }],
    'MLB',
    profiles,
  );
  const isProven = (w, sport) => {
    const t = profiles.get(String(w).slice(-6).toLowerCase())?.bySport?.[sport]?.whitelistTier;
    return t === 'CONFIRMED' || t === 'FLAT';
  };
  const isHc = (w, sport) =>
    profiles.get(String(w).slice(-6).toLowerCase())?.bySport?.[sport]?.whitelistTier === 'CONFIRMED';
  const agg = aggregateSideProven(wd, 'away', 'MLB', isProven, isHc);
  assert.ok(agg, 'agg present');
  assert.ok(wd[0].sizeRatio >= HC_RATIO, `sizeRatio ≥ ${HC_RATIO}, got ${wd[0].sizeRatio}`);
  assert.ok(agg.forHcCount >= 1, `forHcCount ≥ 1, got ${agg.forHcCount}`);
  console.log('✓ sport-local sizeRatio feeds HC (≥1.5×) for Tier A Press');
}

console.log(`\nAll Tier-A→v12 feed gap tests passed (shadowMin=${SCAN_BOARD_SHADOW_MIN}).`);

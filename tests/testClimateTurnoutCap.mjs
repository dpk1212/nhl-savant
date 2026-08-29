/**
 * Climate turnout CAP — RED half exposure.
 * Usage: node tests/testClimateTurnoutCap.mjs
 */
import assert from 'assert';
import {
  CLIMATE_TURNOUT_GATE_FROM,
  CLIMATE_RED_EXPOSURE,
  isClimateTurnoutGateLive,
  classifyClimateColor,
  ticketAbFeatures,
  buildClimateBySport,
  applyClimateTurnoutOverlay,
  climateForSport,
  sharpLetterForWallet,
  climateProgressScore,
} from '../src/lib/climateTurnoutCap.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(CLIMATE_TURNOUT_GATE_FROM === '2026-08-29', 'cutover date');
ok(CLIMATE_RED_EXPOSURE === 0.5, 'half exposure');
ok(isClimateTurnoutGateLive('2026-08-29'), 'live on cutover');
ok(!isClimateTurnoutGateLive('2026-08-28'), 'not live before');

// ── classify ─────────────────────────────────────────────────────────────
{
  const r = classifyClimateColor({ activeA: 0, activeAB: 2, rosterAB: 10 });
  ok(r.color === 'RED' && r.activeA === 0, 'activeA=0 → RED');
}
{
  const y = classifyClimateColor({ activeA: 2, activeAB: 3, rosterAB: 20 });
  ok(y.color === 'YELLOW', 'some A not green → YELLOW');
}
{
  const g1 = classifyClimateColor({ activeA: 2, activeAB: 6, rosterAB: 20 });
  ok(g1.color === 'GREEN', 'activeAB≥6 → GREEN');
}
{
  const g2 = classifyClimateColor({ activeA: 1, activeAB: 4, rosterAB: 10 });
  ok(g2.color === 'GREEN' && g2.pctABRoster === 40, 'pctAB≥35 → GREEN');
}

// ── Q map helpers ────────────────────────────────────────────────────────
const qBySport = new Map([
  ['MLB', new Map([['aaaaaa', 1], ['bbbbbb', 2], ['cccccc', 3]])],
  ['NFL', new Map([['dddddd', 1]])],
]);
ok(sharpLetterForWallet('MLB', 'xxaaaaaa', qBySport) === 'A', 'Q1 → A');
ok(sharpLetterForWallet('MLB', 'bbbbbb', qBySport) === 'B', 'Q2 → B');
ok(sharpLetterForWallet('MLB', 'cccccc', qBySport) === 'C', 'Q3 → C');

{
  const f = ticketAbFeatures({
    walletDetails: [
      { wallet: 'aaaaaa', side: 'home' },
      { wallet: 'bbbbbb', side: 'home' },
      { wallet: 'cccccc', side: 'home' },
      { wallet: 'dddddd', side: 'away' },
    ],
    side: 'home',
    sport: 'MLB',
    qBySport,
  });
  ok(f.hasA && f.hasAB && f.nA === 1 && f.nB === 1 && f.nAB === 2, 'ticket A/B features');
}
{
  const f = ticketAbFeatures({
    walletDetails: [{ wallet: 'cccccc', side: 'home' }],
    side: 'home',
    sport: 'MLB',
    qBySport,
  });
  ok(!f.hasA && !f.hasAB, 'C-only → no AB');
}

// ── buildClimateBySport ──────────────────────────────────────────────────
{
  const climate = buildClimateBySport([
    {
      sport: 'MLB',
      side: 'home',
      walletDetails: [
        { wallet: 'cccccc', side: 'home' }, // C only
      ],
    },
  ], qBySport);
  const mlb = climateForSport(climate, 'mlb');
  ok(mlb?.color === 'RED' && mlb.activeA === 0, 'no A on FORs → RED');
}
{
  const climate = buildClimateBySport([
    {
      sport: 'MLB',
      side: 'home',
      walletDetails: [
        { wallet: 'aaaaaa', side: 'home' },
        { wallet: 'bbbbbb', side: 'home' },
      ],
    },
    {
      sport: 'NFL',
      side: 'away',
      walletDetails: [{ wallet: 'zzzzzz', side: 'away' }],
    },
  ], qBySport);
  ok(climateForSport(climate, 'MLB')?.color === 'GREEN', 'A+B on tiny roster → GREEN via pct');
  ok(climateForSport(climate, 'NFL')?.color === 'RED', 'NFL no A → RED');
}

// ── overlay ──────────────────────────────────────────────────────────────
function half(args) {
  return applyClimateTurnoutOverlay({ pickDate: '2026-08-29', ...args });
}

{
  const r = half({ units: 5.4, climateColor: 'RED' });
  ok(r.action === 'HALF' && r.units === 2.7, '5.4 × 0.5 → 2.7');
  ok(r.unitsPrePolicy === 5.4, 'preserves pre');
  ok(String(r.reason).includes('climate_red_half'), 'reason');
}
{
  const r = half({ units: 4, climateColor: 'RED' });
  ok(r.action === 'HALF' && r.units === 2, '4 → 2');
}
{
  const r = half({ units: 1, climateColor: 'RED' });
  ok(r.action === 'HALF' && r.units === 0.5, '1 → 0.5');
}
{
  const r = half({ units: 5.4, climateColor: 'GREEN' });
  ok(r.action === 'HOLD' && r.units === 5.4, 'GREEN full');
}
{
  const r = half({ units: 5.4, climateColor: 'YELLOW' });
  ok(r.action === 'HOLD' && r.units === 5.4, 'YELLOW full');
}
{
  const r = applyClimateTurnoutOverlay({
    units: 5.4, climateColor: 'RED', pickDate: '2026-08-28',
  });
  ok(r.action === 'EXEMPT' && r.units === 5.4 && r.reason === 'pre_cutover', 'history untouched');
}
{
  const r = half({ units: 0, climateColor: 'RED' });
  ok(r.action === 'PASS' && r.units === 0, '0u PASS');
}
{
  // never mute
  const r = half({ units: 0.01, climateColor: 'RED' });
  ok(r.units > 0, 'dust stays >0');
}

// Compose with unlock mentally: climate then unlock
{
  const climate = half({ units: 5.4, climateColor: 'RED' });
  ok(climate.units === 2.7, 'climate first');
  // unlock would then min(2.7, 1) = 1 on thin NFL — call site order
}

// ── progress score (UI stoplight 0–100) ─────────────────────────────────
ok(climateProgressScore({ color: 'RED', activeA: 0, activeAB: 2 }) === 0, 'RED → 0');
ok(climateProgressScore({ activeA: 0, activeAB: 5, pctABRoster: 50 }) === 0, 'no A → 0');
{
  const s = climateProgressScore({ color: 'YELLOW', activeA: 1, activeAB: 3, pctABRoster: 10 });
  ok(s === 50, `AB=3/6 → 50 (got ${s})`);
}
{
  const s = climateProgressScore({ color: 'YELLOW', activeA: 1, activeAB: 1, pctABRoster: 20 });
  // max(1/6*100≈17, 20/35*100≈57) → 57
  ok(s === 57, `pct path → 57 (got ${s})`);
}
ok(climateProgressScore({ color: 'GREEN', activeA: 2, activeAB: 6, pctABRoster: 10 }) === 100, 'AB≥6 → 100');
ok(climateProgressScore({ color: 'GREEN', activeA: 1, activeAB: 4, pctABRoster: 40 }) === 100, 'pct≥35 → 100');

console.log(`ok ${n} climate turnout tests`);

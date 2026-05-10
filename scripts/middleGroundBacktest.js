/**
 * middleGroundBacktest.js — find the WR/ROI/volume sweet spot between
 * v7 (too loose: 9.3 picks/day, 45% WR, −9.7% ROI) and A_drop_flat
 * (too strict: 1.8 picks/day, 68% WR, +31.8% ROI).
 *
 * Tests middle-ground configs that keep volume up while still using
 * the vault findings to demote FLAT-contamination:
 *
 *   M1 — Weighted Δw: FLAT = 0.5, CONFIRMED = 1.0, HC-CONFIRMED = 1.5
 *        Lock if Σ_w ≥ 5 (where Σ_w = Δw_weighted + Δq)
 *   M2 — Same as M1 but with HC-CONFIRMED = 2.0 (stronger HC bonus)
 *   M3 — Tiered sizing (v7 floor stays — Σ ≥ 5 — but units scale by
 *        wallet-tier purity of the contributors):
 *          purity ≥ 0.75 (mostly CONFIRMED) → full ladder × 1.0
 *          purity 0.50–0.75               → 0.75 × ladder
 *          purity < 0.50  (FLAT-dominant) → 0.5  × ladder
 *          (purity = CONFIRMED_for / (CONFIRMED_for + FLAT_for))
 *   M4 — FLAT contributes only when CONFIRMED also present on same side
 *        (FLAT can amplify CONFIRMED but cannot drive a pick alone)
 *   M5 — Δw_legacy ≥ 1 floor + require ≥1 CONFIRMED on the for side
 *        (cheapest possible carve-out: FLAT-only stacks are killed,
 *         everything else stays — keeps v7 spirit, removes the trap)
 *   M6 — M5 with units scaled by HC count (size up on conviction, no
 *        change to pick selection)
 *
 * Output: MIDDLE_GROUND_BACKTEST.md
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
const db = admin.firestore();

const V6_CUTOVER  = '2026-04-18';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;
const MIN_BETS    = 2;
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const americanToDecimal = (o) => (o === 0 ? 1.91 : (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o)));
const flatProfit = (o, win) => (win ? americanToDecimal(o) - 1 : -1);
const sign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const pct  = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%';

function summarize(rows, scaleFn = null) {
  if (!rows.length) return { n: 0 };
  const wins = rows.filter(r => r.won === 1).length;
  const losses = rows.length - wins;
  const wr = (wins / rows.length) * 100;
  const flat = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flat / rows.length) * 100;
  // Peak PnL: if scaleFn, compute scaled units; else use stored peakPnl
  const peak = scaleFn
    ? rows.reduce((s, r) => {
        const scale = scaleFn(r);
        const u = r.peakUnits * scale;
        return s + (r.won ? u * (americanToDecimal(r.odds) - 1) : -u);
      }, 0)
    : rows.reduce((s, r) => s + r.peakPnl, 0);
  return { n: rows.length, wins, losses, wr, flat, flatRoi, peak };
}

// ── Tier timeline (mirrors prior backtests) ────────────────────────
async function buildTierTimeline() {
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  profSnap.forEach(doc => profiles.set(doc.id, doc.data()));

  const walletKeyToFull = new Map();
  for (const [key, p] of profiles) {
    const full = p.walletAddress || null;
    if (full) {
      walletKeyToFull.set(key, full);
      walletKeyToFull.set(full.slice(-6), full);
      walletKeyToFull.set(full.slice(0, 6), full);
    } else {
      walletKeyToFull.set(key, key);
    }
  }

  const aBets = [];
  for (const [col] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date = d.date;
      const sides = d.sides || {};
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk]?.result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      if (!winningSide) continue;
      const seen = new Set();
      const peakOddsBySide = new Map();
      for (const [sk, sd] of Object.entries(sides)) {
        peakOddsBySide.set(sk, sd?.peak?.peakOdds ?? sd?.lock?.lockOdds ?? sd?.peak?.odds ?? sd?.lock?.odds ?? 0);
      }
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          const dedupe = `${doc.id}_${w.wallet}`;
          if (seen.has(dedupe)) continue;
          seen.add(dedupe);
          aBets.push({
            date, sport, wallet: w.wallet,
            won: w.side === winningSide ? 1 : 0,
            odds: peakOddsBySide.get(w.side) ?? 0,
          });
        }
      }
    }
  }
  const bSnap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const bBets = [];
  bSnap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    if (invested <= 0) return;
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    const walletShort = d.walletShort || String(d.wallet).slice(0, 6);
    bBets.push({ date: d.date, sport: d.sport, walletShort, invested, settledPnl });
  });

  const events = [];
  for (const b of aBets) {
    const canonical = walletKeyToFull.get(b.wallet) || b.wallet;
    events.push({ date: b.date, sport: b.sport, canonical, source: 'A', payload: b });
  }
  for (const b of bBets) {
    const canonical = walletKeyToFull.get(b.walletShort) || b.walletShort;
    events.push({ date: b.date, sport: b.sport, canonical, source: 'B', payload: b });
  }
  events.sort((x, y) => (x.date || '').localeCompare(y.date || ''));

  const stat = new Map();
  function getStat(canonical, sport) {
    const k = `${canonical}|${sport}`;
    let s = stat.get(k);
    if (!s) {
      s = { aN: 0, aWins: 0, aFlatPnl: 0, bN: 0, bInvested: 0, bPnl: 0,
            firstWR50: null, firstFlat: null, firstConfirmed: null };
      stat.set(k, s);
    }
    return s;
  }
  for (const e of events) {
    if (!e.sport || !e.canonical) continue;
    const s = getStat(e.canonical, e.sport);
    if (e.source === 'A') {
      s.aN += 1;
      s.aWins += e.payload.won;
      s.aFlatPnl += flatProfit(e.payload.odds, e.payload.won === 1);
    } else {
      s.bN += 1;
      s.bInvested += e.payload.invested;
      s.bPnl += e.payload.settledPnl;
    }
    const aMet  = s.aN >= MIN_BETS && s.aFlatPnl > 0;
    const aWr50 = s.aN >= MIN_BETS && s.aWins / s.aN >= 0.5;
    const bMet  = s.bN >= MIN_BETS && s.bInvested > 0 && (s.bPnl / s.bInvested) > 0;
    if (aMet && bMet && !s.firstConfirmed) s.firstConfirmed = e.date;
    if (aMet         && !s.firstFlat)      s.firstFlat      = e.date;
    if (aWr50        && !s.firstWR50)      s.firstWR50      = e.date;
  }

  function tierAsOf(canonical, sport, date) {
    const k = `${canonical}|${sport}`;
    const s = stat.get(k);
    if (!s) return null;
    if (s.firstConfirmed && s.firstConfirmed <= date) return 'CONFIRMED';
    if (s.firstFlat      && s.firstFlat      <= date) return 'FLAT';
    if (s.firstWR50      && s.firstWR50      <= date) return 'WR50';
    return null;
  }
  return { walletKeyToFull, tierAsOf };
}

function aggregateTier(walletDetails, sideKey, sport, date, lensFn) {
  const out = {
    confFor: 0, confAg: 0, flatFor: 0, flatAg: 0,
    hcConfFor: 0, hcConfAg: 0, qFor: 0, qAg: 0,
  };
  if (!Array.isArray(walletDetails) || !sideKey) return out;
  for (const w of walletDetails) {
    if (!w?.side || !w?.wallet) continue;
    const isFor = w.side === sideKey;
    const tier = lensFn(w.wallet, sport, date);
    const sizeRatio = Number(w.sizeRatio ?? 0);
    const hc = sizeRatio >= HC_RATIO;
    if (tier === 'CONFIRMED') {
      if (isFor) { out.confFor++; if (hc) out.hcConfFor++; }
      else       { out.confAg++;  if (hc) out.hcConfAg++; }
    } else if (tier === 'FLAT') {
      if (isFor) out.flatFor++; else out.flatAg++;
    }
    if ((Number(w.contribution) || 0) >= QUALITY_CUT) {
      if (isFor) out.qFor++; else out.qAg++;
    }
  }
  out.dq = out.qFor - out.qAg;
  out.dwLegacy = (out.confFor + out.flatFor) - (out.confAg + out.flatAg);
  return out;
}

async function loadPicks(lensFn) {
  const rows = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date = d.date;
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        if (side.superseded) continue;
        if (side.health?.status === 'CANCELLED' || side.health?.status === 'MUTED') continue;
        if (side.lockStage === 'SHADOW') continue;
        const peak = side.peak || side.lock || {};
        if ((peak?.stars ?? 0) < 2.5) continue;
        const odds = peak?.peakOdds ?? side.lock?.lockOdds ?? peak?.odds ?? side.lock?.odds ?? null;
        const peakUnits = peak?.units || 1;
        const won = oc === 'WIN' ? 1 : 0;
        const wd = peak?.v8Scoring?.walletDetails;
        const t = aggregateTier(wd, sideKey, sport, date, lensFn);
        const dw = t.dwLegacy;
        const dq = t.dq;
        if (odds == null) continue;
        const flat = flatProfit(odds, won === 1);
        const peakPnl = won ? (peakUnits * (americanToDecimal(odds) - 1)) : -peakUnits;
        rows.push({
          date, sport, market, sideKey, docId: doc.id,
          dw, dq, sum: dw + dq,
          ...t,
          odds, won, peakUnits, peakPnl, flat,
          // pre-existing v7 dashboard inclusion:
          inDashboardV7: true,
        });
      }
    }
  }
  return rows;
}

// ── Middle-ground decision rules ───────────────────────────────────
// All keep v7's Δq cut and the Δq ≥ 1 requirement.
function dwWeighted(r, flatW, hcBonus) {
  // Each CONFIRMED counts 1, each HC-CONFIRMED counts (1 + hcBonus),
  // each FLAT counts flatW.
  const forSide = r.confFor + r.hcConfFor * hcBonus + r.flatFor * flatW;
  const agSide  = r.confAg  + r.hcConfAg  * hcBonus + r.flatAg  * flatW;
  return forSide - agSide;
}

function purity(r) {
  // CONFIRMED share of CONFIRMED+FLAT on the FOR side. Defaults to 1
  // if there are no whitelisted contributors at all (the pick can't
  // be tagged on this signal — fall back to v7 sizing).
  const denom = r.confFor + r.flatFor;
  return denom > 0 ? r.confFor / denom : 1;
}

// ── Main ───────────────────────────────────────────────────────────
(async () => {
  console.log('[1/3] Building tier timeline…');
  const { walletKeyToFull, tierAsOf } = await buildTierTimeline();
  const lens = (walletKey, sport, date) => {
    const canonical = walletKeyToFull.get(walletKey) || walletKey;
    return tierAsOf(canonical, sport, date);
  };
  console.log('[2/3] Loading picks…');
  const all = await loadPicks(lens);
  const dates = [...new Set(all.map(r => r.date))].sort();
  const numDays = dates.length;
  console.log(`      ${all.length} graded sides · ${numDays} days · ${dates[0]} → ${dates[numDays - 1]}`);
  console.log('[3/3] Running middle-ground configs…');

  const sports = [...new Set(all.map(r => r.sport))].sort();

  // ── v7 status quo (the bleeding baseline) ──────────────────────
  const v7 = all.filter(r => r.dw >= 1 && r.dq >= 1 && r.sum >= 5);
  const v7Sum = summarize(v7);

  // ── Configs ────────────────────────────────────────────────────
  const CONFIGS = [
    {
      id: 'v7_status_quo',
      label: 'v7 status quo (CONF+FLAT count equally, Σ≥5)',
      filter: (r) => r.dw >= 1 && r.dq >= 1 && r.sum >= 5,
      sizeScale: () => 1,
      changesUnits: false,
    },
    {
      id: 'A_drop_flat',
      label: 'A_drop_flat (CONFIRMED only, Σ≥5)',
      filter: (r) => {
        const dwA = r.confFor - r.confAg;
        return dwA >= 1 && r.dq >= 1 && (dwA + r.dq) >= 5;
      },
      sizeScale: () => 1,
      changesUnits: false,
    },
    {
      id: 'M1_flat_half',
      label: 'M1: Δw weighted (FLAT=0.5, HC=1.5), Σ_w≥5',
      filter: (r) => {
        const dwW = dwWeighted(r, 0.5, 0.5);
        return dwW >= 1 && r.dq >= 1 && (dwW + r.dq) >= 5;
      },
      sizeScale: () => 1,
      changesUnits: false,
    },
    {
      id: 'M2_flat_half_hc_strong',
      label: 'M2: Δw weighted (FLAT=0.5, HC=2.0), Σ_w≥5',
      filter: (r) => {
        const dwW = dwWeighted(r, 0.5, 1.0);
        return dwW >= 1 && r.dq >= 1 && (dwW + r.dq) >= 5;
      },
      sizeScale: () => 1,
      changesUnits: false,
    },
    {
      id: 'M3_purity_resize',
      label: 'M3: keep v7 lock set, scale units by purity',
      filter: (r) => r.dw >= 1 && r.dq >= 1 && r.sum >= 5,
      sizeScale: (r) => {
        const p = purity(r);
        if (p >= 0.75) return 1.0;
        if (p >= 0.50) return 0.75;
        return 0.5;
      },
      changesUnits: true,
    },
    {
      id: 'M4_flat_must_have_conf',
      label: 'M4: FLAT counts only when CONFIRMED also on same side',
      filter: (r) => {
        const flatForEffective = r.confFor > 0 ? r.flatFor : 0;
        const flatAgEffective  = r.confAg  > 0 ? r.flatAg  : 0;
        const forW = r.confFor + flatForEffective;
        const agW  = r.confAg  + flatAgEffective;
        const dw = forW - agW;
        return dw >= 1 && r.dq >= 1 && (dw + r.dq) >= 5;
      },
      sizeScale: () => 1,
      changesUnits: false,
    },
    {
      id: 'M5_v7_plus_conf_required',
      label: 'M5: v7 floor + require ≥1 CONFIRMED on FOR side',
      filter: (r) => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.confFor >= 1,
      sizeScale: () => 1,
      changesUnits: false,
    },
    {
      id: 'M6_M5_with_HC_resize',
      label: 'M6: M5 + size ×1.5 if HC dominance, ×0.75 if FLAT-heavy',
      filter: (r) => r.dw >= 1 && r.dq >= 1 && r.sum >= 5 && r.confFor >= 1,
      sizeScale: (r) => {
        if (r.hcConfFor >= 1 && r.hcConfAg === 0) return 1.5;
        if (r.flatFor > r.confFor) return 0.75;
        return 1.0;
      },
      changesUnits: true,
    },
    {
      id: 'M7_M5_drop_flat_only_picks',
      label: 'M7: v7 floor + drop picks where ≥75% of FOR is FLAT',
      filter: (r) => {
        if (!(r.dw >= 1 && r.dq >= 1 && r.sum >= 5)) return false;
        const denom = r.confFor + r.flatFor;
        if (denom === 0) return true; // no whitelist → defer to v7
        return (r.flatFor / denom) < 0.75;
      },
      sizeScale: () => 1,
      changesUnits: false,
    },
  ];

  // ── Apply each config and collect metrics ─────────────────────
  const results = [];
  for (const cfg of CONFIGS) {
    const ship = all.filter(cfg.filter);
    const s = summarize(ship, cfg.changesUnits ? cfg.sizeScale : null);
    const dWR = s.wr != null && v7Sum.wr != null ? s.wr - v7Sum.wr : null;
    const dROI = s.flatRoi != null && v7Sum.flatRoi != null ? s.flatRoi - v7Sum.flatRoi : null;
    const dPeak = s.peak != null && v7Sum.peak != null ? s.peak - v7Sum.peak : null;
    const volPerDay = s.n / numDays;
    const volPctChange = v7Sum.n ? ((s.n - v7Sum.n) / v7Sum.n) * 100 : null;
    // Per-sport
    const bySport = {};
    for (const sport of sports) {
      const sub = ship.filter(r => r.sport === sport);
      bySport[sport] = summarize(sub, cfg.changesUnits ? cfg.sizeScale : null);
    }
    results.push({ cfg, s, dWR, dROI, dPeak, volPerDay, volPctChange, bySport });
  }

  // ── Build report ──────────────────────────────────────────────
  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  out.push('# MIDDLE GROUND BACKTEST');
  out.push('');
  out.push(`Generated: ${nowET} ET · sample ${all.length} graded sides · ${dates[0]} → ${dates[numDays - 1]} (${numDays} days)`);
  out.push('');
  out.push('Tests middle-ground configs that keep volume up while still applying vault findings to demote FLAT-contamination. Goal: find a rule that holds ~4-7 picks/day at 55%+ WR / +5%+ flat ROI — between v7 (9.3/day, bleeding) and A_drop_flat (1.8/day, +32% ROI).');
  out.push('');
  out.push('All evaluations under L2 (point-in-time) tier lens.');
  out.push('');

  // §1 — headline table
  out.push('## §1. Headline — all configs ranked by daily volume × ROI');
  out.push('');
  out.push('| Config | Picks | Picks/day | WR | ΔWR | Flat ROI | ΔROI | Peak PnL | ΔPeak | Vol Δ |');
  out.push('|---|---|---|---|---|---|---|---|---|---|');
  // Show v7 first as anchor
  const v7Row = results.find(x => x.cfg.id === 'v7_status_quo');
  out.push(`| **${v7Row.cfg.label}** | ${v7Row.s.n} | **${v7Row.volPerDay.toFixed(1)}** | ${pct(v7Row.s.wr)} | — | ${sign(v7Row.s.flatRoi, 1)}% | — | ${sign(v7Row.s.peak, 2)}u | — | — |`);
  for (const r of results) {
    if (r.cfg.id === 'v7_status_quo') continue;
    out.push(`| ${r.cfg.label} | ${r.s.n} | **${r.volPerDay.toFixed(1)}** | ${pct(r.s.wr)} | ${sign(r.dWR, 1)} | ${sign(r.s.flatRoi, 1)}% | ${sign(r.dROI, 1)} | ${sign(r.s.peak, 2)}u | ${sign(r.dPeak, 2)}u | ${sign(r.volPctChange, 1)}% |`);
  }
  out.push('');

  // §2 — sweet-spot interpretation
  out.push('## §2. Sweet-spot read');
  out.push('');
  out.push('Sweet spot target: ≥4 picks/day, ≥55% WR, ≥+5% flat ROI, peak PnL > 0.');
  out.push('');
  out.push('| Config | Picks/day | WR | Flat ROI | Peak | All gates met? |');
  out.push('|---|---|---|---|---|---|');
  for (const r of results) {
    if (r.cfg.id === 'v7_status_quo') continue;
    const passVol = r.volPerDay >= 4;
    const passWR  = r.s.wr != null && r.s.wr >= 55;
    const passROI = r.s.flatRoi != null && r.s.flatRoi >= 5;
    const passPeak = r.s.peak != null && r.s.peak > 0;
    const allPass = passVol && passWR && passROI && passPeak;
    const emoji = (b) => b ? '✅' : '❌';
    out.push(`| ${r.cfg.label} | ${emoji(passVol)} ${r.volPerDay.toFixed(1)} | ${emoji(passWR)} ${pct(r.s.wr)} | ${emoji(passROI)} ${sign(r.s.flatRoi, 1)}% | ${emoji(passPeak)} ${sign(r.s.peak, 2)}u | ${allPass ? '**SHIP**' : '—'} |`);
  }
  out.push('');

  // §3 — per-sport for the most promising
  out.push('## §3. Per-sport breakdown (configs that pass §2 sweet-spot OR have ≥4 picks/day)');
  out.push('');
  for (const r of results) {
    if (r.cfg.id === 'v7_status_quo') continue;
    const interesting = r.volPerDay >= 4 || (r.s.wr >= 55 && r.s.flatRoi >= 5);
    if (!interesting) continue;
    out.push(`### ${r.cfg.label}`);
    out.push('');
    out.push('| Sport | N | Picks/day | WR | Flat ROI | Peak PnL |');
    out.push('|---|---|---|---|---|---|');
    for (const sport of sports) {
      const s = r.bySport[sport];
      if (!s || !s.n) {
        out.push(`| ${sport} | 0 | 0.0 | — | — | — |`);
        continue;
      }
      out.push(`| ${sport} | ${s.n} | ${(s.n / numDays).toFixed(1)} | ${pct(s.wr)} | ${sign(s.flatRoi, 1)}% | ${sign(s.peak, 2)}u |`);
    }
    out.push('');
  }

  // §4 — recommendation
  out.push('## §4. Reading');
  out.push('');
  out.push('Configs ranked by **flat-PnL × volume** trade-off:');
  out.push('');
  // Compute composite score: (flatRoi/100) × picks_per_day, only for configs with WR > 50
  const ranked = results
    .filter(r => r.cfg.id !== 'v7_status_quo' && r.s.wr > 50 && r.s.n > 0)
    .map(r => ({ ...r, score: (r.s.flatRoi / 100) * r.volPerDay }))
    .sort((a, b) => b.score - a.score);
  for (let i = 0; i < ranked.length; i++) {
    const r = ranked[i];
    out.push(`${i + 1}. **${r.cfg.label}** — ${r.volPerDay.toFixed(1)}/day · ${pct(r.s.wr)} WR · ${sign(r.s.flatRoi, 1)}% ROI · ${sign(r.s.peak, 2)}u peak  *(EV/day score: ${r.score.toFixed(3)})*`);
  }
  out.push('');
  out.push('EV/day score = (flat ROI as decimal) × (picks per day). Higher is better. This is a rough approximation of expected u/day if we sized at 1u flat — the real ladder has ROI-correlated sizing so actual peak-unit results may differ.');
  out.push('');

  const md = out.join('\n');
  const outPath = join(REPO_ROOT, 'MIDDLE_GROUND_BACKTEST.md');
  writeFileSync(outPath, md);
  console.log(`      Wrote ${outPath}`);
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});

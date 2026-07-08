/**
 * Sharp Flow — Premium Whale Trade Intelligence
 *
 * Game-centric view: every game's full money story in one place.
 * Sharp Signals surface where money disagrees with tickets (the edge).
 * Expandable game cards show individual whale trades in context.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, memo, Fragment } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Activity, Zap, BarChart3, Eye, ArrowUpRight, ArrowDownRight, Minus, DollarSign, Workflow, Lock, CheckCircle, Circle, Clock, AlertTriangle, ShieldCheck, Sparkles, Flame, Check, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Bar, ReferenceDot, Cell, Area, AreaChart, ReferenceLine } from 'recharts';
import { resolveOutcomeSide } from '../utils/teamNameMapper';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteField } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import {
  AGS_FALLBACK_CALIBRATION,
  AGS_MIN_PROVEN_WALLETS,
  AGS_TIER_META,
  AGS_V12_STAKE_TIER_META,
  AGS_V12_STAKE_PATH,
  AGS_V12_DISPLAY_TIERS,
  AGS_V12_PATH_TO_DISPLAY,
  HC_RATIO,
  aggregateSideProven,
  agsSizeMultiplier,
  agsTierFromValue,
  agsV12TierFromValue,
  agsV12Conviction,
  computeAgs,
  computeAgsFromPositions,
  computeAgsV12FromPositions,
  meetsAgsHardMute,
  meetsAgsLockFloor,
  positionToWalletDetail,
} from '../lib/ags.js';
// Browser-side mirror of scripts/syncPickStateAuthoritative.js::buildWalletPriorStatsFn
// — feeds aggregateSideV12 the per-sport prior stats (whitelist tier,
// historical pick count, flat ROI) that the v12 quality calc weighs. Used
// by SharpPositionCard to compute a v12 tier for UNLOCKED game cards so
// the chip/banner speak v12 vocabulary before the cron stamps the doc.
// LOCKED cards continue to mirror the cron's authoritative v12 stamp.
function buildWalletPriorStatsFnForUI(walletProfiles) {
  if (!walletProfiles || typeof walletProfiles.get !== 'function') return null;
  return (walletShort, sport) => {
    if (!walletShort || !sport) return null;
    const key = String(walletShort).toLowerCase();
    const profile = walletProfiles.get(key) || walletProfiles.get(key.toUpperCase());
    const sportRec = profile?.bySport?.[sport];
    if (!sportRec) return null;
    // Mirror cron walletPriorStatsFromSportRec: Source A primary, Source-B
    // (on-chain) flat-ROI mirror fallback for B-only qualified wallets so their
    // v12 quality isn't zeroed (matters for SOC + any B-only CONFIRMED wallet).
    const picksN = Number(sportRec.picks?.n) || 0;
    if (picksN >= 2) {
      return {
        tier: sportRec.whitelistTier || null,
        priorN: picksN,
        priorRoi: Number(sportRec.picks?.flatRoi) || 0,
      };
    }
    return {
      tier: sportRec.whitelistTier || null,
      priorN: Number(sportRec.positions?.n) || 0,
      priorRoi: Number(sportRec.positions?.positionFlatRoi) || 0,
    };
  };
}

// ─── Brand Design System ──────────────────────────────────────────────────────
const B = {
  gold:       '#D4AF37',
  goldHover:  '#E5C158',
  goldDim:    'rgba(212, 175, 55, 0.10)',
  goldBorder: 'rgba(212, 175, 55, 0.25)',
  goldGlow:   'rgba(212, 175, 55, 0.15)',
  green:      '#10B981',
  greenDim:   'rgba(16, 185, 129, 0.12)',
  red:        '#EF4444',
  redDim:     'rgba(239, 68, 68, 0.12)',
  blue:       '#3B82F6',
  blueDim:    'rgba(59, 130, 246, 0.12)',
  sky:        '#0EA5E9',
  purple:     '#8B5CF6',
  bg:         '#0B0F1F',
  card:       '#151923',
  cardAlt:    '#1A1F2E',
  surface:    'rgba(21, 25, 35, 0.95)',
  border:     'rgba(37, 43, 59, 0.8)',
  borderSubtle: 'rgba(26, 32, 48, 0.6)',
  text:       '#F8FAFC',
  textSec:    '#94A3B8',
  textMuted:  '#64748B',
  textSubtle: '#475569',
};

const T = {
  hero:    { fontSize: '1.5rem',   fontWeight: 900, lineHeight: 1.2 },
  heading: { fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.01em' },
  sub:     { fontSize: '0.938rem', fontWeight: 700, lineHeight: 1.4 },
  body:    { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },
  label:   { fontSize: '0.75rem',  fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.03em' },
  caption: { fontSize: '0.688rem', fontWeight: 500, lineHeight: 1.5 },
  micro:   { fontSize: '0.625rem', fontWeight: 600, lineHeight: 1.4 },
  tiny:    { fontSize: '0.563rem', fontWeight: 700, lineHeight: 1.4, letterSpacing: '0.05em', textTransform: 'uppercase' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtVol(v) {
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000) return sign + '$' + (abs / 1_000_000).toFixed(1) + 'M';
  if (abs >= 1_000)     return sign + '$' + (abs / 1_000).toFixed(1) + 'K';
  return sign + '$' + Math.round(abs);
}

function fmtPct(v) { return v != null ? v.toFixed(1) + '%' : '—'; }

function fmtTime(ts) {
  if (!ts) return { et: '', ago: '' };
  const epoch = typeof ts === 'number' ? ts : Date.parse(ts);
  if (isNaN(epoch)) return { et: '', ago: '' };
  const diffMin = Math.round((Date.now() - epoch) / 60000);
  const etStr = new Date(epoch).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true,
  });
  if (diffMin < 1)  return { et: etStr, ago: 'just now' };
  if (diffMin < 60) return { et: etStr, ago: `${diffMin}m ago` };
  const h = Math.floor(diffMin / 60);
  if (h < 24) return { et: etStr, ago: `${h}h ago` };
  return { et: etStr, ago: `${Math.floor(h / 24)}d ago` };
}

function sportStyle(sport) {
  if (sport === 'CBB') return { color: '#FF6B35', bg: 'rgba(255,107,53,0.12)', icon: '🏀' };
  if (sport === 'MLB') return { color: '#E31837', bg: 'rgba(227,24,55,0.12)', icon: '⚾' };
  if (sport === 'NBA') return { color: '#FF8C00', bg: 'rgba(255,140,0,0.12)', icon: '🏀' };
  if (sport === 'SOC') return { color: '#2ECC71', bg: 'rgba(46,204,113,0.12)', icon: '⚽' };
  return { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', icon: '🏒' };
}

function tierInfo(amt) {
  if (amt >= 10_000) return { label: 'WHALE', color: B.gold,  bg: B.goldDim };
  if (amt >= 5_000)  return { label: 'SHARK', color: B.gold,  bg: B.goldDim };
  if (amt >= 1_000)  return { label: 'SHARP', color: B.sky,   bg: B.blueDim };
  return null;
}

// ─── Sharp Flow Unit Sizing ───────────────────────────────────────────────────

const TIER_WEIGHT = { ELITE: 3, SHARP: 2, PROVEN: 1.5, ACTIVE: 1 };

/** Phase 2 UI: resolve whitelist tier for a wallet in a given sport.
 *  Returns 'CONFIRMED' | 'FLAT' | 'WR50' | null — only CONFIRMED/FLAT count
 *  toward the {SPORT} WINNER chip (WR50 is LODO-noise per our whitelist spec).
 */
function resolveWalletWhitelistTier(fullWallet, sport) {
  if (!fullWallet || !sport) return null;
  const short = String(fullWallet).slice(-6);
  return getWalletProfile(short)?.bySport?.[sport]?.whitelistTier || null;
}

/** Phase 2 UI: returns true if the wallet is a {SPORT} WINNER (CONFIRMED or FLAT). */
function isSportWinner(fullWallet, sport) {
  const tier = resolveWalletWhitelistTier(fullWallet, sport);
  return tier === 'CONFIRMED' || tier === 'FLAT';
}

// Model-parity conviction floor. writeSharpActions drops any position with
// invested < 0.10× the wallet's avg sport bet (SHADOW_MIN_MULTIPLIER), so the
// staking cron literally cannot see those token bets. The card must not count
// them as full receipts either, or "4 proven winners backing" renders on a
// pick the model stakes off 1-2 wallets. Entries without a sizeRatio (legacy
// stamps) are assumed counted.
const MODEL_MIN_CONVICTION = 0.10;
function isModelCounted(w) {
  const sr = Number(w?.sizeRatio);
  return !Number.isFinite(sr) || sr <= 0 || sr >= MODEL_MIN_CONVICTION;
}

/**
 * The record that EARNED the wallet its whitelist badge — never a
 * contradicting one. A wallet can be whitelisted via Source A (featured-pick
 * flat ROI) while its on-chain $ record is negative; showing the on-chain
 * record next to a PROVEN badge reads as nonsense ("how can you be negative
 * and on our whitelist?"). whitelistSource tells us which signal promoted the
 * wallet, so we display THAT record.
 * Returns { wins, losses, wr, roi, kind: 'picks'|'positions' } or null.
 */
function whitelistRecordForDisplay(walletShort, sport) {
  const sr = getWalletProfile(walletShort)?.bySport?.[sport];
  if (!sr) return null;
  const isWinner = sr.whitelistTier === 'CONFIRMED' || sr.whitelistTier === 'FLAT';
  const pos = sr.positions || null;
  const pk = sr.picks || null;
  // ROI is display-guarded to finite values: 4 stored profiles carried
  // picks.flatRoi = Infinity (odds=0 bug in exportWalletProfiles, since
  // fixed) which rendered "+Infinity% ROI" on the card. Until those docs
  // regenerate, show the record without an ROI figure.
  const mk = (r, kind, roi) => ({
    wins: r.wins || 0, losses: r.losses || 0,
    wr: r.wr ?? null, roi: Number.isFinite(roi) ? roi : null, kind,
  });
  // Promoted purely on featured-pick performance → show the pick record.
  if (isWinner && sr.whitelistSource === 'A' && pk && pk.n > 0) {
    return mk(pk, 'picks', pk.flatRoi);
  }
  if (pos && (pos.n || 0) > 0) {
    return mk(pos, 'positions', pos.positionFlatRoi ?? (pk?.flatRoi ?? null));
  }
  if (pk && pk.n > 0) return mk(pk, 'picks', pk.flatRoi);
  return null;
}

/** UI: grouped sports leaderboard rank (no raw # or percentile shown). */
function groupedSportsRankLabel(rank) {
  if (rank == null || rank <= 0) return null;
  if (rank <= 10) return 'TOP 10';
  if (rank <= 20) return 'TOP 20';
  if (rank <= 50) return 'TOP 50';
  if (rank <= 100) return 'TOP 100';
  if (rank <= 500) return 'TOP 500';
  return null;
}

/** Internal: rank tier multiplier for money / quality weighting (not shown in UI). */
function leaderboardRankMultiplier(rank) {
  if (rank == null || rank <= 0) return 1;
  if (rank <= 10) return 2.5;
  if (rank <= 20) return 2.1;
  if (rank <= 50) return 1.85;
  if (rank <= 100) return 1.55;
  if (rank <= 500) return 1.25;
  return 1.05;
}

/**
 * Internal scalar: percentile × sports volume × tier profile × rank tier, per wallet row.
 * Used only inside computeSharpFeatures (not displayed).
 */
function sharpRowProfileMoneyWeight(p) {
  const tierW = TIER_WEIGHT[p.tier] || 1;
  const pct = p.sportsLbPercentileTop;
  const pctNorm = pct != null ? Math.max(0.12, Math.min(1, pct / 100)) : 0.4;
  const vol = p.sportVol || 0;
  const moneyNorm = Math.min(2.8, 0.3 + Math.log10(1 + vol / 1e6) * 1.2);
  const rankM = leaderboardRankMultiplier(p.leaderboardRank);
  return rankM * pctNorm * moneyNorm * (tierW / 3);
}

// ─── V7 Frozen Population Stats (extracted from 411-pick dataset, two-sided overlay 2026-04-06) ──
const V7_STATS = {
  avgBet:    { mean: 4162.2509, std: 7251.2948, lo: 216, hi: 24028.625 },
  invested:  { mean: 27502.2117, std: 57067.398, lo: 693.25, hi: 169147 },
  moneyPct:  { mean: 78.1736, std: 15.8987 },
  walletPct: { mean: 62.8166, std: 16.2884 },
  counter:   { mean: 21.7202, std: 15.9326 },
  sharpCount:{ mean: 5.6375, std: 3.3849 },
  qp:        { mean: 1.8273, std: 1.9919 },
  liveCLV:   { mean: 0.0002, std: 0.0303 },
  moneyEdge: { mean: 1.6817, std: 1.3664 },
  sharpEdge: { mean: 1.3601, std: 0.7109 },
  mktDominance: { mean: 1.5531, std: 0.9004 },
  againstSC: { mean: 0.9197, std: 1.6243 },
  thresholds: { p15: -10.5783, p30: -5.6661, p50: 0.8229, p75: 7.1263, p87: 8.8538, p93: 10.36, p97: 13.1826 },
};

function v7Winsorize(val, lo, hi) { return Math.max(lo, Math.min(hi, val)); }
function v7Z(val, mean, std) { return std > 0 ? (val - mean) / std : 0; }

function oddsBand(odds) {
  if (odds == null) return 'COIN_FLIP';
  const p = impliedProb(odds);
  if (p == null) return 'COIN_FLIP';
  if (p >= 0.70) return 'HEAVY_FAV';
  if (p >= 0.55) return 'SLIGHT_FAV';
  if (p >= 0.45) return 'COIN_FLIP';
  if (p >= 0.35) return 'SLIGHT_DOG';
  return 'LONG_DOG';
}

function v7QualityProxy({ moneyPct, sharpCount, avgBet, counterSharp,
                          pinnConfirms, lineMovingWith, evEdge, sport, odds }) {
  let score = 0;
  if ((moneyPct || 0) >= 90) score += 2;
  else if ((moneyPct || 0) >= 75) score += 1;
  else if ((moneyPct || 0) < 55) score -= 1;

  if (sharpCount <= 4 && avgBet >= 2000) score += 1.5;
  else if (sharpCount <= 6 && avgBet >= 1000) score += 0.5;

  if (counterSharp <= 5) score += 1;
  else if (counterSharp >= 35) score -= 1.5;

  if (lineMovingWith && pinnConfirms) score += 1;
  else if (lineMovingWith) score += 0.5;

  if (evEdge < -0.5) score += 0.5;
  else if (evEdge > 2) score -= 0.5;

  const ob = oddsBand(odds);
  if ((sport === 'NHL' || sport === 'CBB') && ob === 'SLIGHT_DOG'
      && (moneyPct || 0) >= 70) score += 0.5;
  if (sharpCount >= 7 && (moneyPct || 0) < 65) score -= 1;

  return score;
}

function v7Contradictions({ moneyPct, counterSharp, sharpCount, evEdge, qp }) {
  let count = 0;
  if ((moneyPct || 0) >= 80 && counterSharp >= 30) count++;
  if (sharpCount >= 7 && (moneyPct || 0) < 65) count++;
  if (evEdge > 0 && qp < 0) count++;
  return count;
}

function consensusGrade(moneyPct, walletPct) {
  const avg = moneyPct * 0.6 + walletPct * 0.4;
  if (avg >= 80) return { label: 'DOMINANT', color: B.green, penalty: 0, score: avg };
  if (avg >= 65) return { label: 'STRONG', color: B.green, penalty: 0, score: avg };
  if (avg >= 55) return { label: 'LEAN', color: B.gold, penalty: -0.5, score: avg };
  return { label: 'CONTESTED', color: B.red, penalty: -1, score: avg };
}

function computeSharpFeatures(positions, consensusSide) {
  const conPos = positions.filter(p => p.side === consensusSide);
  const oppPos = positions.filter(p => p.side && p.side !== consensusSide);

  const dedup = (arr) => {
    const m = new Map();
    for (const p of arr) {
      const ex = m.get(p.wallet);
      if (!ex || (p.invested || 0) > (ex.invested || 0)) m.set(p.wallet, p);
    }
    return [...m.values()];
  };
  const conDeduped = dedup(conPos);
  const oppDeduped = dedup(oppPos);

  // Net-position approach: wallets on both sides count on their dominant side
  // with the difference as invested (e.g. $1K con + $500 opp → $500 net on con side)
  const conMap = new Map(conDeduped.map(p => [p.wallet, p]));
  const oppMap = new Map(oppDeduped.map(p => [p.wallet, p]));
  const allWallets = new Set([...conMap.keys(), ...oppMap.keys()]);
  const conWallets = [];
  const oppWallets = [];
  for (const w of allWallets) {
    const c = conMap.get(w);
    const o = oppMap.get(w);
    if (c && !o) { conWallets.push(c); continue; }
    if (o && !c) { oppWallets.push(o); continue; }
    const cInv = c.invested || 0;
    const oInv = o.invested || 0;
    const net = Math.abs(cInv - oInv);
    if (net < 1) continue;
    if (cInv > oInv) conWallets.push({ ...c, invested: net });
    else oppWallets.push({ ...o, invested: net });
  }
  const totalWallets = conWallets.length + oppWallets.length;

  const qualitySum = conWallets.reduce((s, p) => s + (TIER_WEIGHT[p.tier] || 1), 0);
  const maxPossible = totalWallets > 0 ? totalWallets * 3 : 1;
  const breadth = totalWallets > 0 ? qualitySum / maxPossible : 0;

  const conTotalInvested = conWallets.reduce((s, p) => s + (p.invested || 0), 0);
  const avgInvested = conWallets.length > 0 ? conTotalInvested / conWallets.length : 0;
  const conviction = avgInvested > 0 ? Math.min(1, Math.max(0, (Math.log10(avgInvested) - 2) / 2)) : 0;

  const maxWalletInv = conWallets.length > 0 ? Math.max(...conWallets.map(p => p.invested || 0)) : 0;
  const concentration = conTotalInvested > 0 ? maxWalletInv / conTotalInvested : 0;

  const tierScore = (wallets) => wallets.reduce((s, p) => {
    const t = p.tier;
    return s + (t === 'ELITE' ? 3 : t === 'SHARP' ? 2 : 0);
  }, 0);
  const counterSharpScore = Math.max(0, tierScore(oppWallets) - tierScore(conWallets));

  const oppTotalInv = oppWallets.reduce((s, p) => s + (p.invested || 0), 0);
  const total = conTotalInvested + oppTotalInv;
  const conMoneyPct = total > 0 ? (conTotalInvested / total) * 100 : 50;
  const conWalletPct = totalWallets > 0 ? (conWallets.length / totalWallets) * 100 : 50;
  const avgScore = conMoneyPct * 0.6 + conWalletPct * 0.4;
  const consensusTier = avgScore >= 80 ? 'DOMINANT' : avgScore >= 65 ? 'STRONG' : avgScore >= 55 ? 'LEAN' : 'CONTESTED';

  const sportSharpCount = conWallets.filter(p => p.sportVerified === true).length;

  const dominantWallet = conWallets.length > 0
    ? conWallets.reduce((best, p) => (p.invested || 0) > (best.invested || 0) ? p : best, conWallets[0])
    : null;
  const dominantTier = dominantWallet?.tier || null;

  const rankWeightedConInvested = conWallets.reduce(
    (s, p) => s + (p.invested || 0) * leaderboardRankMultiplier(p.leaderboardRank), 0,
  );
  const rankWeightedOppInvested = oppWallets.reduce(
    (s, p) => s + (p.invested || 0) * leaderboardRankMultiplier(p.leaderboardRank), 0,
  );
  const conProfileMoneyRaw = conWallets.reduce(
    (s, p) => s + sharpRowProfileMoneyWeight(p) * (p.invested || 0), 0,
  );
  const oppProfileMoneyRaw = oppWallets.reduce(
    (s, p) => s + sharpRowProfileMoneyWeight(p) * (p.invested || 0), 0,
  );
  const profileMoneyDenom = conProfileMoneyRaw + oppProfileMoneyRaw + 1e-9;
  const consensusProfileMoneyIndex = 100 * (conProfileMoneyRaw / profileMoneyDenom);

  return {
    breadth, conviction, concentration, counterSharpScore, consensusTier,
    conWalletCount: conWallets.length, oppWalletCount: oppWallets.length,
    conTotalInvested, oppTotalInv, avgScore, sportSharpCount, dominantTier,
    conMoneyPct, conWalletPct,
    rankWeightedConInvested,
    rankWeightedOppInvested,
    consensusProfileMoneyIndex,
  };
}

// v6 Two-Factor ML unit ladder — stars are the two-factor Vault Star.
// Floor-pick minimum: 0.75u. Elite: 3.0u. Sub-floor picks (stars < 3.5)
// return 0 because they can't lock per Floor G. consensusPenalty /
// regimeBonus are kept as no-ops so legacy callers don't error, but
// sizing is driven entirely by stars now.
// v7.2/v7.3 ML unit ladder — HC-margin tiered. The ×1.5 v7.1 multiplier
// stays for HC_m=+1 picks; HC_m≥+2 graduates to ×1.75 (the SUPER-HC
// cohort: 9-1 / +7.65u net / +76.5% ROI in WALLET_HC_MARGIN_ANALYSIS).
//
//   ELITE  (Σ ≥ +7) → 4.0u   ×1.5 if HC_m=+1 → 6.0u capped 4.5u
//                            ×1.75 if HC_m≥+2 → 7.0u capped 4.5u
//   5.0★   (Σ ≥ +6) → 3.0u   ×1.5 → 4.5u capped 3.5u
//                            ×1.75 → 5.25u capped 3.5u
//   4.5★   (Σ = +5) → 2.0u   ×1.5 → 3.0u capped 3.5u
//                            ×1.75 → 3.5u
//   4.0★   (Σ = +4) → 1.25u  ×1.5 → 1.88u  /  ×1.75 → 2.19u
//   3.5★   (Σ = +3) → 0.75u  ×1.5 → 1.13u  /  ×1.75 → 1.31u
//   <3.5★  (Σ = +2) → 0.5u   when LOCKED AND HC_m ≥ +1 (v7.3 lock floor)
//   <3.5★  (Σ = +1) → 0.5u   when LOCKED AND HC_m ≥ +1 (v7.3 lock floor)
//   <3.5★  any other  → 0
// Legacy v7.1 path retained for picks dated < V7_2_CUTOVER_DATE.
// AGS-Unified v9 — units come from base × AGS-U sizing multiplier.
// Stars / consensusPenalty / regimeBonus / lockTier / hcDominant inputs
// are accepted for callsite compatibility but IGNORED. opts.ags is the
// only signal consulted. Falls back to 0 (no ship) when AGS is missing.
function calculateUnits(_stars, _consensusPenalty = 0, odds = null, _regimeBonus = 0,
                       _lockTier = null, _hcDominant = false, opts = {}) {
  const ags = Number.isFinite(opts.ags) ? opts.ags : null;
  return agsuUnitsFromAgs(ags, 'ml', odds, getAgsCalibration());
}

function unitTier(units) {
  if (units >= 2.5) return { label: 'MAX', color: '#10B981', icon: '🔥' };
  if (units >= 1.5) return { label: 'STRONG', color: '#D4AF37', icon: '⚡' };
  return { label: 'STANDARD', color: '#94A3B8', icon: '✓' };
}

// AGS-Unified v9 — single source of truth for the top-right star badge.
// Maps an AGS-U value (or missing/insufficient signal) to a 4-tuple of
// stars + label + label color + background. Every UI surface that talks
// about "what tier is this pick" — top-right badge inside SharpPositionCard,
// the locked-picks header in LockedPickCard, the AGS-U Consensus Panel
// body banner — derives from this one function so they cannot disagree.
//
// Star → tier mapping is the same as agsuStarsFromAgs:
//   5.0 ELITE    ≥ q90  · 2.00× sizing
//   4.5 PREMIUM  ≥ q80  · 1.50× sizing
//   4.0 LOCK     ≥ q60  · 1.10× sizing
//   3.0 LEAN     ≥ q40  · 0.50× sizing
//   2.5 WEAK     ≥ q20  · 0.20× sizing
//   1.0 FADE     < q20  · 0u (hard mute)
const AGSU_STAR_LABELS = {
  5:   { label: 'ELITE PLAY',    color: B.green,   bg: B.greenDim,                summary: 'Top decile AGS-U — maximum sharp conviction' },
  4.5: { label: 'PREMIUM PLAY',  color: B.green,   bg: B.greenDim,                summary: 'Top quintile AGS-U — premium sharp alignment' },
  4:   { label: 'STRONG PLAY',   color: B.green,   bg: 'rgba(16,185,129,0.08)',   summary: 'Above lock floor — full standard size' },
  3.5: { label: 'STRONG PLAY',   color: B.green,   bg: 'rgba(16,185,129,0.08)',   summary: 'Above lock floor — full standard size' },
  3:   { label: 'SOLID PLAY',    color: B.gold,    bg: B.goldDim,                 summary: 'Lean tier — half-stake position' },
  2.5: { label: 'TRACKING',      color: B.gold,    bg: B.goldDim,                 summary: 'Weak tier — small reduced-size position' },
  2:   { label: 'TRACKING',      color: B.gold,    bg: B.goldDim,                 summary: 'Early AGS-U signal' },
  1.5: { label: 'DEVELOPING',    color: B.textSec, bg: 'rgba(255,255,255,0.04)',  summary: 'Sharp signal still forming' },
  1:   { label: 'HARD MUTE',     color: B.red,     bg: B.redDim,                  summary: 'AGS-U below fade floor — not playable' },
};

function agsuBadgeFromAgs(ags, calibration = null) {
  const cal = calibration || getAgsCalibration();
  const stars = agsuStarsFromAgs(Number.isFinite(ags) ? ags : null, cal);
  const meta = AGSU_STAR_LABELS[stars] || AGSU_STAR_LABELS[1];
  return { stars, ...meta };
}

function profitFromOdds(odds, units) {
  if (odds > 0) return units * (odds / 100);
  return units * (100 / Math.abs(odds));
}

// Return a copy of a pinnacle/odds game record with the away/home-oriented
// fields swapped. World Cup matches are neutral-site, so the Odds API and
// Polymarket can disagree on which country is "home" — when the direct game
// key misses we look up the reversed key and flip it so away/home line up
// with the card's orientation.
function flipPinnGame(g) {
  if (!g) return g;
  const swapAH = (o) => (o && typeof o === 'object' && ('away' in o || 'home' in o))
    ? { ...o, away: o.home, home: o.away } : o;
  const flippedBooks = {};
  for (const [k, v] of Object.entries(g.allBooks || {})) {
    flippedBooks[k] = { ...v, away: v.home, home: v.away };
  }
  return {
    ...g,
    current: swapAH(g.current),
    opener: swapAH(g.opener),
    bestAway: g.bestHome, bestHome: g.bestAway,
    bestAwayBook: g.bestHomeBook, bestHomeBook: g.bestAwayBook,
    movement: g.movement ? {
      ...g.movement,
      away: g.movement.home, home: g.movement.away,
      direction: g.movement.direction === 'away' ? 'home' : g.movement.direction === 'home' ? 'away' : g.movement.direction,
    } : g.movement,
    ev: g.ev ? { away: g.ev.home, home: g.ev.away } : g.ev,
    history: Array.isArray(g.history) ? g.history.map(h => ({ ...h, away: h.home, home: h.away })) : g.history,
    allBooks: flippedBooks,
    awayTeam: g.homeTeam, homeTeam: g.awayTeam,
  };
}

// V7 Unified Star Rating (rateStarsV7) — DELETED 2026-05-15. ~160 lines of
// dead code, never called outside its own definition (last verified by
// the AGS-U v9 legacy-gate audit). Replaced wholesale by rateStarsV8
// (which now itself derives stars from AGS-U via agsuStarsFromAgs).
// V7_STATS / v7Z / v7Winsorize / v7QualityProxy / v7Contradictions are
// retained because rateStarsV8's internal CLV z-score still consumes
// them; they are NOT decision gates.
//
// renderHeroChips — also deleted 2026-05-15 (never called).

// ─── V8 Wallet-Contribution Star Rating ──────────────────────────────────────

function buildV8Normalization(sportsSharps) {
  if (!sportsSharps) return null;
  const addrs = Object.keys(sportsSharps).filter(k => k !== '_meta');
  if (addrs.length === 0) return null;

  const roiArr = addrs.map(a => sportsSharps[a].sportROI || 0).sort((a, b) => a - b);
  const pnlArr = addrs.map(a => sportsSharps[a].sportPnlTotal || sportsSharps[a].totalPnl || 0).sort((a, b) => a - b);

  const withRank = addrs
    .filter(a => sportsSharps[a].leaderboardRank != null)
    .sort((a, b) => sportsSharps[a].leaderboardRank - sportsSharps[b].leaderboardRank);
  const K = withRank.length;
  const internalRankMap = {};
  withRank.forEach((addr, i) => { internalRankMap[addr] = i + 1; });

  return { roiArr, pnlArr, internalRankMap, K, walletCount: addrs.length, sportsSharps };
}

function percentileOf(sortedArr, val) {
  let count = 0;
  for (let i = 0; i < sortedArr.length; i++) {
    if (sortedArr[i] < val) count++;
    else break;
  }
  return (count / sortedArr.length) * 100;
}

// AGS-Unified v9 vault-star — stars are derived from AGS-U quintile
// placement via agsuStarsFromAgs. Legacy Δw / Δq / HC / pickDate args
// are accepted for callsite back-compat but IGNORED. When AGS is null
// (mid-page render before walletDetails loads) we fall back to a 1.0★
// neutral so nothing renders stronger than the data warrants.
function vaultStarFromDeltas(_dw, _dq, _hcMargin = 0, _pickDate = null, ags = null) {
  return agsuStarsFromAgs(Number.isFinite(ags) ? ags : null, getAgsCalibration());
}

// AGS-Unified v9 lock-tier classifier — single source of truth for
// tiering across the UI, the cron (syncPickStateAuthoritative.js), and
// downstream reporting. Returns one of:
//
//   ELITE   : AGS-U ≥ q90 (top decile)        — 2.00× sizing ladder
//   PREMIUM : AGS-U ≥ q80                     — 1.50×
//   LOCK    : AGS-U ≥ q60 (lock floor)        — 1.10×
//   LEAN    : AGS-U ≥ q40 (½-stake band)      — 0.50×
//   WEAK    : AGS-U ≥ q20                     — 0.20×
//   FADE    : AGS-U <  q20 (hard mute)        — 0.00×  (meetsAgsHardMute)
//
// Legacy Δw / Δq / hcDominant args are accepted for callsite back-compat
// but IGNORED. The legacy 'LOCKED' / 'MUTED' enum is no longer produced;
// callers comparing against those strings have been migrated — anything
// new that needs "is this side shipping" should test
// tier ∈ {ELITE, PREMIUM, LOCK} (full size) or
// tier ∈ {ELITE, PREMIUM, LOCK, LEAN, WEAK} (any non-zero stake).
function lockTierFromDeltas(_dw, _dq, _hcDominant = false, opts = {}) {
  const ags = Number.isFinite(opts.ags) ? opts.ags : null;
  return agsuLockTierFromAgs(ags, getAgsCalibration());
}

function rateStarsV8({ positions, consensusSide, v8Norm, pinnMoveSize = 0, timeToGame = null, lockOdds = null, pinnCurrentOdds = null, sport = null, pickDate = null }) {
  if (!v8Norm || !positions || positions.length === 0) {
    return {
      stars: 1, rawScore: 0, effectiveScore: 0,
      label: 'MONITORING', color: B.textSec, bg: 'rgba(255,255,255,0.04)',
      summary: 'No data', isActionable: false, regime: 'NO_MOVE',
      walletPlayScore: 0, forSide: 0, againstSide: 0, conWalletCount: 0,
      qualityProxy: 0, moneyEdge_z: 0, mktDom_z: 0, againstSC_z: 0,
      disagreement: 0, contradictions: 0, liveCLV_z: null, regimeMultiplier: null,
    };
  }

  const { roiArr, pnlArr, internalRankMap, K, sportsSharps: ss } = v8Norm;

  const dedup = (arr) => {
    const m = new Map();
    for (const p of arr) {
      const ex = m.get(p.wallet);
      if (!ex || (p.invested || 0) > (ex.invested || 0)) m.set(p.wallet, p);
    }
    return [...m.values()];
  };

  const conRaw = positions.filter(p => p.side === consensusSide);
  const oppRaw = positions.filter(p => p.side && p.side !== consensusSide);
  const conDeduped = dedup(conRaw);
  const oppDeduped = dedup(oppRaw);

  const conMap = new Map(conDeduped.map(p => [p.wallet, p]));
  const oppMap = new Map(oppDeduped.map(p => [p.wallet, p]));
  const allWallets = new Set([...conMap.keys(), ...oppMap.keys()]);
  const conWallets = [];
  const oppWallets = [];
  for (const w of allWallets) {
    const c = conMap.get(w);
    const o = oppMap.get(w);
    if (c && !o) { conWallets.push(c); continue; }
    if (o && !c) { oppWallets.push(o); continue; }
    const cInv = c.invested || 0;
    const oInv = o.invested || 0;
    const net = Math.abs(cInv - oInv);
    if (net < 1) continue;
    if (cInv > oInv) conWallets.push({ ...c, invested: net });
    else oppWallets.push({ ...o, invested: net });
  }

  function walletContributionDetail(p) {
    const w = ss[p.wallet] || {};
    const roi = p.sportROI ?? w.sportROI ?? 0;
    const pnl = p.sportPnl ?? w.sportPnlTotal ?? p.totalPnl ?? w.totalPnl ?? 0;
    const roiNorm = percentileOf(roiArr, roi);
    const pnlNorm = percentileOf(pnlArr, pnl);

    const hasRank = (w.leaderboardRank != null) && internalRankMap[p.wallet];
    let walletBase, rankNorm = null;
    if (hasRank) {
      const ir = internalRankMap[p.wallet];
      rankNorm = K > 1 ? 100 * (1 - (ir - 1) / (K - 1)) : 50;
      walletBase = 0.60 * roiNorm + 0.25 * rankNorm + 0.15 * pnlNorm;
    } else {
      walletBase = 0.65 * roiNorm + 0.35 * pnlNorm;
    }

    const avgBet = p.avgSportBet || w.avgSportBet || 0;
    const sizeRatio = avgBet > 0 ? (p.invested || 0) / avgBet : 1;
    const convictionMult = Math.max(0.70, Math.min(1.60, 1 + 0.30 * Math.log(sizeRatio)));
    const contribution = walletBase * convictionMult;

    return {
      contribution,
      detail: {
        wallet: p.wallet?.slice(-6) || '???',
        side: p.side,
        invested: Math.round(p.invested || 0),
        roi: +roi.toFixed(1),
        pnl: Math.round(pnl),
        rank: w.leaderboardRank || null,
        source: w.source || null,
        roiNorm: +roiNorm.toFixed(1),
        pnlNorm: +pnlNorm.toFixed(1),
        rankNorm: rankNorm != null ? +rankNorm.toFixed(1) : null,
        walletBase: +walletBase.toFixed(1),
        sizeRatio: +sizeRatio.toFixed(2),
        convictionMult: +convictionMult.toFixed(3),
        contribution: +contribution.toFixed(1),
      },
    };
  }

  let forSide = 0, maxContrib = 0;
  const walletDetails = [];
  for (const p of conWallets) {
    const { contribution, detail } = walletContributionDetail(p);
    forSide += contribution;
    maxContrib = Math.max(maxContrib, contribution);
    walletDetails.push(detail);
  }

  let againstSide = 0;
  for (const p of oppWallets) {
    const { contribution, detail } = walletContributionDetail(p);
    againstSide += contribution;
    walletDetails.push(detail);
  }

  const walletCountFor = conWallets.length;
  const topShare = forSide > 0 ? maxContrib / forSide : 1;
  const netEdge = (forSide - 0.85 * againstSide) / 100;
  const breadthBonus = 2 * Math.log(1 + walletCountFor);
  const concCoeff = walletCountFor <= 2 ? 4 : 5;
  const concPenalty = concCoeff * topShare;
  const walletPlayScore = netEdge + breadthBonus - concPenalty;

  // Regime detection (kept for lock/shadow determination, does NOT affect stars)
  let regime = 'NO_MOVE';
  if (timeToGame != null && timeToGame <= 60 && pinnMoveSize >= 0.01) {
    regime = 'NEAR_START';
  } else if (timeToGame != null && timeToGame <= 120 && pinnMoveSize >= 0.015) {
    regime = 'NEAR_START';
  } else if (pinnMoveSize >= 0.02) {
    regime = 'CLEAR_MOVE';
  } else if (pinnMoveSize > 0) {
    regime = 'SMALL_MOVE';
  }

  // Live CLV (kept for pick health evaluation)
  let liveCLV_z = null;
  if (lockOdds != null && pinnCurrentOdds != null) {
    const lockP = impliedProb(lockOdds);
    const curP = impliedProb(pinnCurrentOdds);
    if (lockP != null && curP != null && lockP !== curP) {
      const liveCLV = curP - lockP;
      liveCLV_z = V7_STATS.liveCLV.std > 0 ? (liveCLV - V7_STATS.liveCLV.mean) / V7_STATS.liveCLV.std : 0;
    }
  }

  // AGS-Unified v9 star derivation. The star rating is a direct projection
  // of the AGS-U value through agsuStarsFromAgs (q90 → 5★, q80 → 4.5★,
  // q60 → 4★, q40 → 3★, q20 → 2.5★, FADE → 1★). Δw / Δq / HC margin are
  // still computed on `wc` for diagnostic display but no longer participate
  // in the star or label assignment. If the profile cache hasn't loaded
  // yet, or there are no proven wallets on this side, we fall back to
  // 1★ MONITORING so we never bluff confidence the system doesn't have.
  const wc = computeWalletConsensus(walletDetails, sport, consensusSide, pickDate);
  const deltaWinner = wc.delta;
  const deltaQuality = wc.qualityMargin;
  const wcHcMargin = (wc.hcConfFor || 0) - (wc.hcConfAg || 0);

  // AGS-U star derivation uses the SHARED computeAgsFromPositions helper
  // (same path the cron's createMissingPicks + every-cycle refresh uses).
  // Operating on raw positions instead of walletDetails ensures the star
  // rating reflects the same number the cron will stamp on the doc.
  let agsForStars = null;
  if (sport && WALLET_PROFILES_CACHE && Array.isArray(positions) && positions.length > 0) {
    const agsRes = computeAgsFromPositions(
      positions, consensusSide, sport, getAgsCalibration(), isProvenForAgs, isHcEligibleForAgs, walletStatsForAgs,
    );
    if (agsRes && Number.isFinite(agsRes.ags)
        && agsRes.provenTotalCount >= AGS_MIN_PROVEN_WALLETS) {
      agsForStars = agsRes.ags;
    }
  }
  const stars = agsuStarsFromAgs(agsForStars, getAgsCalibration());

  // Star → label map is shared with the SharpPositionCard badge and the
  // LockedPickCard summary via the module-level AGSU_STAR_LABELS table.
  const info = AGSU_STAR_LABELS[stars] || AGSU_STAR_LABELS[1];

  const v8Scoring = {
    walletPlayScore: +walletPlayScore.toFixed(4),
    forSide: +forSide.toFixed(1),
    againstSide: +againstSide.toFixed(1),
    netEdge: +netEdge.toFixed(4),
    breadthBonus: +breadthBonus.toFixed(4),
    topShare: +topShare.toFixed(4),
    concPenalty: +concPenalty.toFixed(4),
    walletCountFor,
    walletCountAgainst: oppWallets.length,
    walletDetails,
    // v6 two-factor fields — diagnostic only under AGS-U v9. vaultStar
    // is no longer derived here (it used to come from
    // vaultStarFromDeltas, which is now AGS-U-driven); the v8Scoring
    // shape is preserved with a null placeholder for backward
    // compatibility with consumers that read this property.
    deltaWinner,
    deltaQuality,
    vaultStar: null,
    qualityForT30: wc.qualityForT30,
    qualityAgT30: wc.qualityAgT30,
    forW: wc.forW,
    agW: wc.agW,
  };

  return {
    stars, rawScore: walletPlayScore, effectiveScore: walletPlayScore,
    ...info, isActionable: stars >= 2.5, regime, walletPlayScore,
    forSide, againstSide, conWalletCount: walletCountFor,
    qualityProxy: 0, moneyEdge_z: 0, mktDom_z: 0, againstSC_z: 0,
    disagreement: 0, contradictions: 0, liveCLV_z, regimeMultiplier: null,
    v8Scoring,
  };
}

// V8 star thresholds — bootstrapped from live position data (58 plays, 2026-04-16)
// Calibrated so multi-wallet consensus plays earn 3-5 stars and single-wallet plays
// are structurally capped at 2.0. Refine as sample grows.
const V8_STAR_THRESHOLDS = {
  p30: -3.0,
  p50: 0.0,
  p65: 1.5,
  p78: 3.0,
  p88: 4.5,
  p95: 6.0,
  p98: 7.5,
};

// ─── Pick Health Evaluation (Mute / Cancel overlay) ──────────────────────────
// V8-native: uses WalletPlayScore instead of star deltas.
// Lock range = WPS >= 0.0 (maps to >= 2.5 stars).
//
// V8.4 fix: we evaluate the opposing side's WPS *on every tick*, not only
// when the wallet-count-based `consensusSide` has already tipped. The old
// behavior missed cases where a late heavy-conviction wave landed on the
// opposite side (e.g. 2 whales @ $35k dwarfing 3 small bettors @ $8k) —
// wallet count still said consensus = locked side, so sideFlipped=false and
// no flip evaluation ever ran. Now the ratchet-threshold check fires whenever
// the opposite side's WPS has genuinely eclipsed the locked side's threshold.

const LOCK_RANGE_WPS = 0.0; // V8_STAR_THRESHOLDS.p50
const OPP_CANCEL_GAP = 0.5; // opp WPS must be at least this much above locked side to trigger CANCEL
const OPP_MUTE_GAP = 1.0;   // opp WPS must be this much stronger (but below ratchet) to MUTE

// ─── Phase 2 — Wallet-Consensus V8 Integration ───────────────────────────────
// See PHASE_2_WALLET_CONSENSUS_PLAN.md for derivation.
//
// For each sport with a populated whitelist (from sharpWalletProfiles.bySport),
// we count how many profitable-in-sport wallets are FOR our pick vs AGAINST.
// Δ = forW − agW drives bonus / penalty / promotion / MUTE / CANCEL.
//
// Per-sport action gating (v1):
//   NBA, MLB, NHL — full ladder (bonus + mute + cancel + promote)
//   CBB           — inert until whitelist populates
//
// V8.3 (2026-04-22 backtest): wallet-consensus Δ is the cleanest monotonic
// signal in the system — 16 graded STRONG_FOR picks → 69% WR / +76% flat ROI,
// 10 LEAN_FOR picks → 70% WR / +31% flat ROI, 27 Δ ≤ 0 picks → 22% WR /
// −61% flat. Per-regime head-to-head vs meanBase_F / maxRoiN_F
// (scripts/predictorShootout.js 2026-04-22): Δ spread +136.6%,
// meanBase_F +12.0%, maxRoiN_F −24.2%. Δ dominates every regime where it
// has sample including NEAR_START (the fat middle where fmean fails). The
// whitelist itself is already per-sport, so we do NOT need additional
// per-sport action gating — every sport with whitelisted wallet data gets
// the full ladder.
//
// LADDER (v5, universal):
//   Δ ≥ +2  STRONG_FOR   → +0.50u unit bonus + PROMOTION (agW = 0 required)
//   Δ = +1  LEAN_FOR     → +0.10u unit bonus + PROMOTION (agW = 0 required)
//   Δ =  0  NEUTRAL      → no action (absence of profitable-wallet signal)
//   Δ = −1  FADE_WEAK    → MUTE   (profitable-wallet dissent)
//   Δ ≤ −2  FADE_STRONG  → CANCEL (strong profitable-wallet dissent)
//
// Config below is the single kill-switch — flip any flag to `false` and
// redeploy to disable the lever for that sport.
const WHITELIST_INTERVENTION = {
  NBA: { bonus: true, mute: true, cancel: true, promote: true },
  MLB: { bonus: true, mute: true, cancel: true, promote: true },
  NHL: { bonus: true, mute: true, cancel: true, promote: true },
  CBB: { bonus: true, mute: true, cancel: true, promote: true },
  NFL: { bonus: true, mute: true, cancel: true, promote: true },
  SOC: { bonus: true, mute: true, cancel: true, promote: true },
};
// v6 = Two-Factor overhaul. Δ_winner + Δ_quality@T30 are now the sole
// drivers of stars/units/lock/mute/cancel for Sharp Intel. Floor G
// (Δw≥+1 AND Δq≥+1) is the only promotion path. WPS/regime/contribTier
// downgraded to diagnostic-only. See V8_TWO_FACTOR_BACKTEST.md for the
// pre-ship validation (74 picks, +43 ROI-points lift vs V8).
//
// v7.1 — bump 6 → 7. HC-dominance fields (v8_hcConfFor / v8_hcConfAg /
// v8_hcDominant), v8_systemVersion, v8_topPick / v8_superTopPick are
// now stamped. needsConsensusRestamp() picks up the new version on next
// sync so every active doc re-stamps once after deploy.
const WHITELIST_CONSENSUS_VERSION = 9;   // bumped 8 → 9 for v7.3 HC-margin floor lowering (Σ=1/Σ=2) + MUTE override
const QUALITY_CONTRIB_CUT = 30;   // T=30 — validated by V8_CONTRIBUTION_EDGE

// ─── AGS-Unified v9 — single gate / single signal ────────────────────
// All v7.x cutover predicates and HC-multiplier ladders were retired
// on 2026-05-14 when AGS-U v9 shipped. Lock / mute / sizing now flow
// exclusively through src/lib/ags.js — see the AGS-U Consensus Panel
// inside SharpPositionCard for the user-facing surface.
//
// AGS_U_CUTOVER is the first date AGS-U v9 promoted picks live. Any
// performance numbers shown for the AGS-U system itself MUST window
// to picks on or after this date — pre-cutover picks were graded
// under the legacy v7.x ladders and don't share the same tier math.
const AGS_U_CUTOVER = '2026-05-14';

// V12_LAUNCH is the first date AGS-U v12 was authoritative in production.
// The public performance surface uses this — not AGS_U_CUTOVER — as the
// "what is the model doing right now" boundary. Picks on or after this
// date were scored by v12's wallet-quality formula and absolute-units
// ladder (5/3/1/0.5/0.25u). Picks before this date were scored by v9,
// v10, or v11 (retired logistic-regression models) or by the legacy
// stars system and are bucketed into the archive view.
const V12_LAUNCH = '2026-06-01';

// Resolve the cron-stamped AGS-U tier on a graded pick (v8_agsTier preferred,
// v8_lockTier fallback). Shared by the performance dashboard and paywall so
// both surfaces count the exact same v12-era pick population.
function resolveAgsuTier(p) {
  if (typeof p?.v8_agsTier === 'string' && p.v8_agsTier !== 'UNKNOWN' && AGS_TIER_META[p.v8_agsTier]) return p.v8_agsTier;
  if (typeof p?.v8_lockTier === 'string' && AGS_TIER_META[p.v8_lockTier]) return p.v8_lockTier;
  return null;
}

// Headline v12-era stats — mirrors the dashboard hero (§ AGS-U performance):
//   • date ≥ V12_LAUNCH, not cancelled, not tracked-only, has outcome
//   • must resolve to a known AGS-U tier (same gate as rawAgsuPicks)
//   • profit = Σ stored result.profit (not recomputed from units)
function computeV12EraStats(picks) {
  if (!Array.isArray(picks) || picks.length === 0) return { ready: false };
  const graded = picks.filter(p =>
    p && p.date && !p.cancelled && p.date >= V12_LAUNCH && !p.tracked && p.outcome && resolveAgsuTier(p)
  );
  let w = 0, l = 0, pu = 0, profit = 0, units = 0;
  for (const p of graded) {
    units += (p.units || 0);
    profit += (p.profit || 0);
    if (p.outcome === 'WIN') w++;
    else if (p.outcome === 'LOSS') l++;
    else if (p.outcome === 'PUSH') pu++;
  }
  const totalGraded = w + l + pu;
  if (totalGraded === 0) return { ready: false };
  const winPct = (w + l) > 0 ? (w / (w + l)) * 100 : 0;
  const roi = units > 0 ? (profit / units) * 100 : 0;
  const launchMs = new Date(V12_LAUNCH + 'T12:00:00').getTime();
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const todayMs = new Date(todayStr + 'T12:00:00').getTime();
  const daysLive = Math.max(1, Math.round((todayMs - launchMs) / 86400000) + 1);
  return {
    ready: true, w, l, pu, totalGraded, profit, units, winPct, roi,
    isProfit: profit >= 0, daysLive,
    record: `${w}-${l}${pu > 0 ? `-${pu}` : ''}`,
  };
}

// Sharp Flow paywall — limited-time promo (mirrors Pricing.jsx PROMO_CODES.SUMMER).
const PAYWALL_PROMO = {
  code: 'SUMMER',
  discount: 0.33,
  label: 'Summer Launch',
  fullPrice: 25.99,
  endMs: new Date('2026-09-01T04:00:00Z').getTime(), // midnight ET Aug 31
};
//
// Stubbed eligibility helpers below return `true` unconditionally so
// any straggling caller that hasn't been swept will short-circuit to
// the AGS-U path. They will be removed in a follow-up sweep.
const isV71Eligible = () => true;
const isV72Eligible = () => true;
const isV73Eligible = () => true;
const isV74Eligible = () => true;

// Legacy lock-floor helper retained as an AGS-U shim. Δw / HC inputs
// are accepted for callsite compatibility but ignored — only the AGS-U
// q20 hard-mute floor and the proven-wallet floor are honored.
function meetsV74Floor(_dw, _hcMargin, ags = null, agsProvenTotal = null) {
  if (ags == null || !Number.isFinite(ags)) return false;
  if (agsProvenTotal != null && agsProvenTotal < AGS_MIN_PROVEN_WALLETS) return false;
  if (meetsAgsHardMute(ags, getAgsCalibration())) return false;
  return true;
}

// True iff the pick should display in the locked-picks list right now.
// Honors v7.4 for post-cutover dates; pre-cutover picks fall through to
// the previous (LEAN-permissive) display rules so historical context
// stays intact.
//
// Phase 3 — also lets AGS-rescued picks through. Without this, a side
// rescued by AGS (lockStage='LOCKED', promotedBy='ags-rescue') with
// dw < 1 / dq < 1 / HC = 0 would fail meetsV74Floor and get hidden,
// defeating the whole point of the rescue route. The rescue check uses
// the FROZEN AGS stamp (`v8_ags`) plus the AGS_LOCK_FLOOR + min-wallet
// guards from src/lib/ags.js.
// AGS-Unified v9 display gate. Δw / Δq / HC inputs are accepted for
// callsite compatibility but ignored — picks above the q20 hard-mute
// floor with ≥ AGS_MIN_PROVEN_WALLETS proven wallets display. Below
// q20 (FADE) and insufficient-proven-wallets ⇒ hidden. Graded picks
// always show so historical PnL audit trails stay intact.
function passesV74DisplayGate({ isGraded, agsValue, agsProvenTotal }) {
  if (isGraded) return true;
  if (!Number.isFinite(agsValue)) return false;
  if (meetsAgsHardMute(agsValue, getAgsCalibration())) return false;
  if (agsProvenTotal != null && agsProvenTotal < AGS_MIN_PROVEN_WALLETS) return false;
  return true;
}

// Set of promotedBy values that count as a legitimate ship to the locked
// picks list. Includes v7.0 floor sources and every v7.x HC variant. Sync
// + restamp paths use this so newly-added promotion sources flow through
// without per-callsite edits.
const PROMOTED_BY_FLOORS = new Set([
  'two-factor-floor',         // Σ ≥ +5 (legacy v7.0 / v7.1 / v7.2 / v7.3)
  'contribution',             // legacy contrib-tier path
  'whitelist',                // legacy whitelist path
  'hc-dominance',             // v7.1 HC_DOM (Σ ∈ {3,4})
  'v72-hc-margin',            // v7.2 HC_margin ≥ +1 (Σ ∈ {3,4})
  'v72-sigma2-lock',          // v7.2 Σ=2 ∧ HC_m ≥ +2 (NEW lock)
  'v72-sigma2-lean',          // v7.2 Σ=2 ∧ HC_m  = +1 (NEW lean — superseded by v7.3 LOCK)
  'v73-sigma1-hc',            // v7.3 Σ=1 ∧ HC_m ≥ +1 (NEW lock floor)
  'v73-sigma2-hc',            // v7.3 Σ=2 ∧ HC_m ≥ +1 (graduates v7.2 LEAN to LOCK)
  'v73-hc-rescue',            // v7.3 dw=0 OR dq=0 ∧ HC_m ≥ +1 (rescued from MUTE)
  'v74-hc-margin',            // v7.4 HC_m ≥ +1                — legacy (kept for historical pick display)
  'v75-dw2',                  // v7.5 Δw ≥ +2                  — legacy (kept for historical pick display)
  'v75-dw1-ags',              // v7.5 Δw ≥ +1 ∧ AGS ≥ AGS_DW1_FLOOR — legacy (kept for historical pick display)
  'ags-rescue',               // Phase 3 — AGS rescue           — legacy (kept for historical pick display)
  'ags-unified-v9',           // AGS-Unified v9 — current single source of truth (post-2026-05-14 cutover)
]);
function isPromotedBy(promotedBy) {
  return PROMOTED_BY_FLOORS.has(promotedBy);
}

// Module-level cache of sharpWalletProfiles, keyed by walletShort (last 6
// chars of address). Populated by a React effect in useMarketData; read
// synchronously by helpers below. Null until first load completes.
let WALLET_PROFILES_CACHE = null;
function setWalletProfilesCache(profiles) {
  WALLET_PROFILES_CACHE = profiles;
}
function getWalletProfile(walletShort) {
  if (!WALLET_PROFILES_CACHE || !walletShort) return null;
  return WALLET_PROFILES_CACHE.get(walletShort) || null;
}

// A wallet "counts" toward forW / agW only if it's profitable in the current
// sport — whitelistTier ∈ {CONFIRMED, FLAT}. WR50 is LODO-noise, excluded.
function isWhitelistedForSport(walletShort, sport) {
  const p = getWalletProfile(walletShort);
  const tier = p?.bySport?.[sport]?.whitelistTier;
  return tier === 'CONFIRMED' || tier === 'FLAT';
}

// ── AGS calibration cache ────────────────────────────────────────────────
// Loaded async at app boot from Firestore agsCalibration/current. Falls
// back to AGS_FALLBACK_CALIBRATION (hardcoded last-known-good in
// src/lib/ags.js) if Firestore is unreachable. Never blocks rendering —
// stamping is a no-op when the cache is null.
let AGS_CALIBRATION_CACHE = null;
function setAgsCalibrationCache(cal) { AGS_CALIBRATION_CACHE = cal; }
function getAgsCalibration() { return AGS_CALIBRATION_CACHE || AGS_FALLBACK_CALIBRATION; }

// Adapter so the shared AGS module's aggregateSideProven can use the
// already-loaded WALLET_PROFILES_CACHE without duplicating the lookup.
function isProvenForAgs(walletShort, sport) {
  return isWhitelistedForSport(walletShort, sport);
}

// HC eligibility — CONFIRMED tier only. The HC_RATIO sizeRatio threshold
// is enforced inside aggregateSideProven. Stricter than isProvenForAgs.
function isHcEligibleForAgs(walletShort, sport) {
  const p = getWalletProfile(walletShort);
  return p?.bySport?.[sport]?.whitelistTier === 'CONFIRMED';
}

// v11 — returns wallet's top-level profile.picks aggregate at scoring time.
// Drives the dWinnerCtPreA feature. Production-side mirror of
// buildWalletStatsFn in scripts/syncPickStateAuthoritative.js so the UI
// computes the same AGS-U score the cron will stamp.
function walletStatsForAgs(walletShort) {
  const p = getWalletProfile(walletShort);
  if (!p?.picks) return null;
  return {
    picksN: Number(p.picks.n) || 0,
    picksFlatRoi: Number(p.picks.flatRoi) || 0,
  };
}

// ─── AGS-Unified v9 helpers (UI-side) ────────────────────────────────────
// Mirror of scripts/syncPickStateAuthoritative.js — every gate (lock,
// mute, tier, sizing) reads ONLY from the AGS-U composite + calibration.
// Δw / HC / Δq are computed for diagnostic display ONLY; never consulted
// to decide anything.
const AGSU_BASE_UNITS_ML = 2.50;
const AGSU_BASE_UNITS_SPREAD_TOTAL = 1.50;
function agsuOddsCap(units, odds) {
  if (!Number.isFinite(odds)) return units;
  if (odds >= 200) return Math.min(units, 1.0);
  if (odds >= 151) return Math.min(units, 1.5);
  if (odds >= 100) return Math.min(units, 2.5);
  return units;
}
function agsuStarsFromAgs(ags, calibration) {
  if (ags == null || !Number.isFinite(ags)) return 1.0;
  const q = (calibration && calibration.quintiles) ? calibration.quintiles : AGS_FALLBACK_CALIBRATION.quintiles;
  if (ags >= q.q90) return 5.0;
  if (ags >= q.q80) return 4.5;
  if (ags >= q.q60) return 4.0;
  if (ags >= q.q40) return 3.0;
  if (ags >= q.q20) return 2.5;
  return 1.0;
}
function agsuLockTierFromAgs(ags, calibration) {
  return agsTierFromValue(ags, calibration);
}
function agsuUnitsFromAgs(ags, marketType, odds, calibration) {
  if (ags == null || !Number.isFinite(ags)) return 0;
  const m = agsSizeMultiplier(ags, calibration);
  if (m === 0) return 0;
  const base = (marketType === 'spread' || marketType === 'total' || marketType === 'SPREAD' || marketType === 'TOTAL')
    ? AGSU_BASE_UNITS_SPREAD_TOTAL
    : AGSU_BASE_UNITS_ML;
  return Math.round(agsuOddsCap(base * m, odds) * 100) / 100;
}

function classifyDelta(forW, agW) {
  const delta = forW - agW;
  if (forW + agW === 0) return { delta: 0, verdict: 'NEUTRAL' };
  if (delta >= 2)  return { delta, verdict: 'STRONG_FOR' };
  if (delta === 1) return { delta, verdict: 'LEAN_FOR' };
  if (delta === 0) return { delta, verdict: 'NEUTRAL' };
  if (delta === -1) return { delta, verdict: 'FADE_WEAK' };
  return { delta, verdict: 'FADE_STRONG' };
}

// Main wallet-consensus helper. Returns a stable shape that feeds
// decideLockStage / computeRegimeBonus / evaluatePickHealth / attribution.
//
// v6 (Two-Factor Overhaul): returns BOTH winner margin (Δ_winner =
// forW − agW, whitelist-tier gated) AND quality margin (Δ_quality =
// qualityForT30 − qualityAgT30 at contribution ≥ QUALITY_CONTRIB_CUT).
// Both drive stars, units, locks, mutes, and cancels.
//
// Safe to call with missing data — returns a NEUTRAL / no-action result.
//
// `pickDate` is optional. When provided, gates the v7.3 HC-margin MUTE
// override (HC_m ≥ +1 suppresses the dw≤0 / dq≤0 / sum<3 mutes; CANCEL
// at dw ≤ −2 still fires unconditionally). Pre-cutover picks see the
// legacy v6.6 hybrid floor.
function computeWalletConsensus(walletDetails, sport, sideKey, pickDate = null) {
  const result = {
    forW: 0, agW: 0, delta: 0, verdict: 'NEUTRAL',
    qualityForT30: 0, qualityAgT30: 0, qualityMargin: 0,
    // v7.1 — HC dominance fields. Populated alongside forW/agW. See
    // WALLET_GATE_SCALE_TEST.md §3 for why HC dominance is the only
    // wallet-tier gate that produced positive lift in 5/5 Σ buckets.
    hcConfFor: 0, hcConfAg: 0, hcDominant: false,
    unitBonus: 0, lockAction: null, promotionEligible: false,
    sportConfig: WHITELIST_INTERVENTION[sport] || { bonus: false, mute: false, cancel: false, promote: false },
    enabled: !!WHITELIST_INTERVENTION[sport],
    sport: sport || null,
  };
  if (!Array.isArray(walletDetails) || !sport || !sideKey) return result;

  // Quality margin is whitelist-independent — contribution ≥ T30 is itself
  // the quality filter. Compute it even when the profile cache hasn't
  // loaded yet so Δq never silently stamps as 0.
  let qFor = 0, qAg = 0;
  for (const d of walletDetails) {
    if ((d?.contribution ?? 0) < QUALITY_CONTRIB_CUT) continue;
    if (d.side === sideKey) qFor++;
    else if (d.side) qAg++;
  }
  result.qualityForT30 = qFor;
  result.qualityAgT30 = qAg;
  result.qualityMargin = qFor - qAg;

  // Winner margin requires profile cache. If not ready, return with
  // quality populated but delta=0 — the stamping layer will re-run later.
  if (!WALLET_PROFILES_CACHE) return result;

  // Single pass: compute forW/agW (whitelist-gated CONFIRMED+FLAT) AND
  // HC counts (CONFIRMED-only at sizeRatio ≥ HC_RATIO).
  let forW = 0, agW = 0, hcF = 0, hcA = 0;
  for (const d of walletDetails) {
    if (!d?.wallet) continue;
    if (!isWhitelistedForSport(d.wallet, sport)) continue;
    const isFor = d.side === sideKey;
    if (isFor) forW++;
    else if (d.side) agW++;
    // HC = CONFIRMED tier ∧ sizeRatio ≥ HC_RATIO. Look up the profile tier
    // directly so FLAT wallets (also returned by isWhitelistedForSport)
    // don't count toward HC. Profile shape: profile.bySport[sport].whitelistTier.
    const profile = getWalletProfile(d.wallet);
    const tier = profile?.bySport?.[sport]?.whitelistTier ?? null;
    if (tier === 'CONFIRMED' && (d.sizeRatio ?? 0) >= HC_RATIO) {
      if (isFor) hcF++;
      else if (d.side) hcA++;
    }
  }
  const { delta, verdict } = classifyDelta(forW, agW);
  result.forW = forW; result.agW = agW; result.delta = delta; result.verdict = verdict;
  result.hcConfFor = hcF; result.hcConfAg = hcA;
  result.hcDominant = hcF >= 1 && hcA === 0;

  const cfg = result.sportConfig;

  // LEGACY-DIAGNOSTIC ONLY — the Δw/Δq/HC ladder below sets
  // result.lockAction so the in-memory wallet-consensus object still
  // exposes a sensible MUTE/CANCEL/PROMOTE field for legacy callers
  // (diagnostic logging, ranking reports, attribution narratives).
  // It DOES NOT drive any user-visible decision under AGS-U v9:
  //   - Live lock/mute decisions: decideLockStage + evaluatePickHealth
  //     (both AGS-U-canonical, gated on meetsAgsHardMute +
  //     AGS_MIN_PROVEN_WALLETS).
  //   - Sizing: agsSizeMultiplier / agsuUnitsFromAgs.
  //   - Persisted mute stamp (v8_walletConsensusMuteTriggered): now
  //     overwritten in stampWalletConsensus from the AGS-U hard-mute
  //     boolean, not from this lockAction value.
  //   - Drift detection (restampDriftedSides): compares against the
  //     AGS-U hard-mute boolean, not lockAction.
  //
  // The Δw/Δq/HC arithmetic below is preserved so historical pickets
  // and any pre-v9 doc still in flight read the same lockAction value
  // they would have read at lock time.
  const dw = delta;
  const dq = result.qualityMargin;
  const hcMargin = hcF - hcA;
  const v73HcOverride = isV73Eligible(pickDate) && hcMargin >= 1;

  if (dw <= -2) {
    if (cfg.cancel) result.lockAction = 'CANCEL';
    else if (cfg.mute) result.lockAction = 'MUTE';
    return result;
  }
  if (dw <= 0) {
    // v7.3 — HC margin rescues the dw=0 cohort. dw=−1 still mutes
    // (winners actively flipped off; too strong a fade to override).
    if (v73HcOverride && dw === 0) {
      // fall through to the v7.3 promotion check below
    } else {
      if (cfg.mute) result.lockAction = 'MUTE';
      return result;
    }
  }
  if (dq <= 0) {
    if (v73HcOverride) {
      // fall through to the v7.3 promotion check below
    } else {
      if (cfg.mute) result.lockAction = 'MUTE';
      return result;
    }
  }
  if (dw + dq < 3) {
    if (v73HcOverride) {
      // fall through to the v7.3 promotion check below
    } else {
      if (cfg.mute) result.lockAction = 'MUTE';
      return result;
    }
  }

  // v6.6 PROMOTION — Hybrid floor. Δw ≥ +1 AND Δq ≥ +1 AND Δw+Δq ≥ +3.
  // v7.3 PROMOTION — additionally HC_m ≥ +1 ∧ dw ≥ 0 ∧ dq ≥ 0 ∧ sum ≥ +1.
  // v7.4 PROMOTION — Σ floor tightens to ≥ +5 (was +3 under v6.6/v7.3).
  // The HC route is unchanged. Removes the LEAN cohort from being eligible.
  // unitBonus is no longer summed into sizing — sizing is derived from
  // the two-factor star directly. Retained here only so legacy callers
  // and ranking reports read a consistent value (0 always).
  if (cfg.promote) {
    // Diagnostic-only flag — kept on the consensus object so legacy
    // ranking reports / locked-list filters that haven't migrated to
    // AGS-U yet still get a sensible answer. Real promotion decisions
    // live in decideLockStage (AGS-U gate).
    if (dw >= 1 && dq >= 1 && (dw + dq) >= 5) {
      result.promotionEligible = true;
    } else if (v73HcOverride && dw >= 0 && dq >= 0 && (dw + dq) >= 1) {
      result.promotionEligible = true;
    }
  }
  result.unitBonus = 0;

  return result;
}

// v6.6 Two-Factor Health Engine. Purely Δ-driven — no more WPS /
// sideFlipped / opp-dominance gates. Rules in precedence order, all
// symmetric to the hybrid lock floor (Δw ≥ +1 AND Δq ≥ +1 AND Δw+Δq ≥ +3).
// If a locked pick decays below the floor on any axis it mutes.
//
//   CANCEL  (Δ_winner ≤ −2)                       reason: 'winners_killed'
//   MUTE    (Δ_winner = −1)                       reason: 'winners_faded'
//   MUTE    (Δ_winner = 0)                        reason: 'winners_below_floor'
//   MUTE    (Δ_winner ≥ +1 AND Δ_quality ≤ 0)     reason: 'quality_below_floor'
//   MUTE    (Δw ≥ +1 ∧ Δq ≥ +1 ∧ Δw+Δq < +3)      reason: 'sum_below_floor'  ← hybrid
//   ACTIVE  otherwise
//
// Rationale (user report 2026-04-24): a pick locked at Δw=+2 / Δq=+2
// that fades to Δw=0 / Δq=+1 used to sit ACTIVE at full units even
// though Sharp Intel showed "TRACKING — 1 of 2 signals" on the same
// game. Below-floor on EITHER axis now mutes.
//
// WPS flip / opp-side dominance are retained in the returned `reasons`
// as diagnostic tags only — they never change status anymore. Gated by
// `timeToGame <= 5` to match legacy "too close to flip" behavior.
// AGS-Unified v9 health engine. Single signal, single decision:
//   AGS-U missing                    → MUTED  (no_ags_signal)
//   < AGS_MIN_PROVEN_WALLETS proven  → MUTED  (insufficient_proven_wallets)
//   < q20 (calibrated hard mute)     → MUTED  (ags_hard_mute)
//   else                             → ACTIVE
//
// WPS / sideFlipped / oppSideWPS are computed for diagnostic tags only —
// they never change status. Δw / HC margin come along for the ride as
// `walletDelta` / `qualityMargin` so legacy chip rendering still has
// the numbers, but they don't drive the decision.
function evaluatePickHealth({
  currentWPS,
  oppSideWPS,
  lockWPS,
  sideFlipped,
  flipBeatThreshold,
  timeToGame,
  currentStars,
  walletConsensus,
  pickDate = null,
  agsValue = null,
  agsProvenTotal = null,
  lockStage = null,
}) {
  const wpsDelta = (currentWPS != null && lockWPS != null) ? currentWPS - lockWPS : 0;
  const dw = walletConsensus?.delta ?? 0;
  const dq = walletConsensus?.qualityMargin ?? 0;
  const diagnostic = [];
  if (sideFlipped) diagnostic.push('wps_flipped_diag');
  if (oppSideWPS != null && currentWPS != null && oppSideWPS - currentWPS >= OPP_MUTE_GAP) {
    diagnostic.push('opp_side_stronger_diag');
  }

  const cal = getAgsCalibration();
  const tooCloseForWhitelist = timeToGame != null && timeToGame <= 5;

  if (!tooCloseForWhitelist) {
    if (!Number.isFinite(agsValue)) {
      return {
        status: 'MUTED',
        reasons: ['no_ags_signal', ...diagnostic],
        currentStars, wpsDelta,
        walletDelta: dw, qualityMargin: dq,
      };
    }
    if (agsProvenTotal != null && agsProvenTotal < AGS_MIN_PROVEN_WALLETS) {
      return {
        status: 'MUTED',
        reasons: ['insufficient_proven_wallets', ...diagnostic],
        currentStars, wpsDelta,
        walletDelta: dw, qualityMargin: dq,
      };
    }
    if (meetsAgsHardMute(agsValue, cal)) {
      return {
        status: 'MUTED',
        reasons: ['ags_hard_mute', ...diagnostic],
        currentStars, wpsDelta,
        walletDelta: dw, qualityMargin: dq,
      };
    }
  }

  return {
    status: 'ACTIVE',
    reasons: diagnostic,
    currentStars, wpsDelta,
    walletDelta: dw, qualityMargin: dq,
  };
}

// v7.2/v7.3 Spread/Total unit ladder — HC margin tiered, mirrors calculateUnits.
//   ELITE  (Σ ≥ +7) → 2.5u   ×1.5 → 3.75 capped 3.5u  /  ×1.75 → 4.38 capped 3.5u
//   5.0★   (Σ ≥ +6) → 2.0u   ×1.5 → 3.0u capped 2.0u  /  ×1.75 → 3.5u capped 2.0u
//   4.5★   (Σ = +5) → 1.5u   ×1.5 → 2.25 capped 2.0u  /  ×1.75 → 2.63 capped 2.0u
//   4.0★, 3.5★      → 0u when lockTier === 'LEAN'
//   <3.5★  (Σ ∈ {1,2}) → 0.5u  when LOCK ∧ HC_m ≥ +1 (v7.3 lock floor)
//   <3.5★  (Σ = +2)    → 0.25u  legacy v7.2 LOCK ∧ HC_m ≥ +2 path
// Legacy v7.1/v7.0 paths preserved for pre-cutover picks.
// AGS-Unified v9 — spread/total units come from base × AGS-U multiplier.
// All legacy params (stars, lockTier, hcDominant, etc.) accepted for
// callsite compatibility but IGNORED. opts.ags is the only signal.
function calculateSpreadTotalUnits(_stars, _consensusPenalty = 0, odds = null, _regimeBonus = 0,
                                   _lockTier = null, _hcDominant = false, opts = {}) {
  const ags = Number.isFinite(opts.ags) ? opts.ags : null;
  return agsuUnitsFromAgs(ags, 'spread', odds, getAgsCalibration());
}

// v6.4 — Live stars/units on the locked-pick card.
//
// The card stores peak.stars and peak.units (the state at the pick's
// strongest moment). But stars & units are just a function of Δw/Δq
// through vaultStarFromDeltas + the unit ladder — so we should drive them
// off the LIVE Δw/Δq every render, not the frozen peak. That's the whole
// thing. If Δ decays, stars drop, units drop.
//
// Graded picks keep peak values so realized PnL stays consistent with
// the recommendation the system actually made at lock time.
// AGS-Unified v9 — live sizing is base × AGS-U sizing multiplier × odds cap.
// Δw / Δq / HC inputs are accepted for callsite compatibility but IGNORED.
// Stars and tier are derived from the AGS-U value via agsuStarsFromAgs and
// agsuLockTierFromAgs. `isDownsized` fires only when the live AGS-U has
// genuinely dropped vs the peak-unit baseline, so the UI badge tracks
// real degradation rather than the legacy multi-route flicker.
// Star projection from the cron-stamped AGS-U tier. Mirrors agsuStarsFromAgs
// but takes the tier directly so the UI is invariant to calibration drift
// between the cron's snapshot and whatever's in the browser cache. The
// cron stamps the tier with the live Firestore calibration — that's the
// number we shipped on, the number we sized at, and the number the user
// sees on the card.
function starsFromAgsuTier(tier) {
  // v12.1 product stake tiers.
  // Conviction scale (matches AGS_V12_STAKE_TIER_META.stars): MAX/TOP=5,
  // STRONG=4, SOLID=3, LEAN=2 — keyed to bet size, not the internal path.
  if (tier === 'SUPER') return 5.0;       // MAX PLAY (6u)
  if (tier === 'TOP+') return 5.0;        // TOP PLAY (5u)
  if (tier === 'TOP') return 4.0;         // STRONG PLAY (4u)
  if (tier === 'RANK') return 4.0;        // STRONG PLAY (4u)
  if (tier === 'SHARP-PRIME') return 4.0; // STRONG PLAY (4u)
  if (tier === 'SHARP') return 3.0;       // SOLID PLAY (3u)
  if (tier === 'MINI') return 3.0;        // SOLID PLAY (3u)
  if (tier === 'CONFIRMED') return 2.0;   // LEAN (1u)
  if (tier === 'MINI-') return 2.0;       // LEAN (1u)
  if (tier === 'MONITORING') return 0.0;
  // Legacy score-quintile tiers.
  if (tier === 'ELITE') return 5.0;
  if (tier === 'PREMIUM') return 4.5;
  if (tier === 'LOCK') return 4.0;
  if (tier === 'LEAN') return 3.0;
  if (tier === 'WEAK') return 2.5;
  return 1.0; // FADE / UNKNOWN / null
}

function computeLiveSizing({ peakStars, peakUnits, marketType, oddsForLadder,
                              liveAgs = null,
                              liveAgsProvenFor = null,
                              liveAgsProvenAg = null,
                              // CRON-FIRST OVERRIDES — when the
                              // syncPickStateAuthoritative cron has
                              // stamped an authoritative tier + finalUnits
                              // on this side, the UI MUST display those
                              // exact values. They were computed with the
                              // live Firestore calibration that the
                              // grader and sizing engine actually use, so
                              // any client-side recomputation (which can
                              // run against stale fallback calibration
                              // during the ~seconds between page mount
                              // and the agsCalibration/current fetch
                              // completing) is guaranteed to be a worse
                              // approximation. Skip the live-derive path
                              // entirely when these are present.
                              cronTier = null,
                              cronUnits = null }) {
  // CRON-FIRST PATH. If the cron has stamped tier + finalUnits, mirror
  // them directly. Stars derive from the tier (not from a recompute
  // against the browser-cached calibration) so a deployed bundle with a
  // stale AGS_FALLBACK_CALIBRATION never drags a LEAN pick down to WEAK
  // (today's Cavs/Pistons total bug — calibration q40 drifted from the
  // hardcoded fallback's +0.20 to Firestore's -0.08, so the UI
  // recomputation classified ags=-0.027 as WEAK while the cron correctly
  // stamped it as LEAN).
  if (cronTier && cronUnits != null && Number.isFinite(cronUnits)) {
    return {
      liveStars: starsFromAgsuTier(cronTier),
      liveUnits: cronUnits,
      liveTier: cronTier,
      isDownsized: cronUnits < (peakUnits || 0) && cronUnits > 0,
      agsTrim: null, // The multiplier is already baked into cronUnits.
      agsRescue: false,
    };
  }

  const cal = getAgsCalibration();
  const liveAgsForCalls = Number.isFinite(liveAgs) ? liveAgs : null;
  const agsProvenTotal = (Number(liveAgsProvenFor) || 0) + (Number(liveAgsProvenAg) || 0);

  if (liveAgsForCalls == null || peakStars == null) {
    return { liveStars: peakStars, liveUnits: peakUnits || 0, isDownsized: false, liveTier: null, agsTrim: null, agsRescue: false };
  }

  const liveStars = agsuStarsFromAgs(liveAgsForCalls, cal);
  const liveTier = agsuLockTierFromAgs(liveAgsForCalls, cal);

  // Hard mute when AGS-U is below q20 OR proven-wallet floor not met.
  const passesProvenFloor = agsProvenTotal === 0 || agsProvenTotal >= AGS_MIN_PROVEN_WALLETS;
  const hardMuted = meetsAgsHardMute(liveAgsForCalls, cal) || !passesProvenFloor;
  const liveUnits = hardMuted ? 0 : agsuUnitsFromAgs(liveAgsForCalls, marketType, oddsForLadder, cal);

  // AGS sizing multiplier — exposed as `agsTrim` for the UI chip so users
  // can see the calibration-aware sizing decision (e.g. ×1.50 for PREMIUM
  // tier, ×0.20 for WEAK).
  const mult = agsSizeMultiplier(liveAgsForCalls, cal);
  const baseUnits = (marketType === 'spread' || marketType === 'total') ? AGSU_BASE_UNITS_SPREAD_TOTAL : AGSU_BASE_UNITS_ML;
  const agsTrim = mult !== 1.0
    ? { mult, before: Math.round(baseUnits * 100) / 100, after: liveUnits }
    : null;

  const isDownsized = liveUnits < (peakUnits || 0) && liveUnits > 0;

  return {
    liveStars,
    liveUnits,
    liveTier,
    isDownsized,
    agsTrim,
    agsRescue: false, // route-specific rescue retired in v9
  };
}

// ─── Sharp Flow Locked Picks — Firebase ───────────────────────────────────────

function todayET() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function gameDate(commenceTime) {
  if (!commenceTime) return todayET();
  return new Date(commenceTime).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

// Contribution-tier classifier (see scripts/contributionEdgeMap.js + V8_CONTRIBUTION_EDGE.md).
// Rules derived from 18-pick V8 sample, T=50:
//   STRONG:   qFor≥3 AND qAgainst=0   OR   qFor≥2 AND margin≥+1
//   STANDARD: qFor≥1 AND margin≥+1 AND maxContrib_F≥50
//   MUTE:     margin<0                     (stored only — not acted on yet)
//   LEAN:     anything else (includes qFor=0 signal-less picks)
// We use STRONG as an additional path to LOCKED alongside regime.
function classifyContributionTier(v8Scoring, sideKey) {
  const wd = v8Scoring?.walletDetails;
  if (!Array.isArray(wd) || !sideKey) return null;
  const forW = wd.filter(w => w.side === sideKey);
  const agW = wd.filter(w => w.side !== sideKey);
  const qFor50 = forW.filter(w => (w?.contribution ?? 0) >= 50).length;
  const qAg50 = agW.filter(w => (w?.contribution ?? 0) >= 50).length;
  const margin50 = qFor50 - qAg50;
  const maxContribF = forW.reduce((m, w) => Math.max(m, w?.contribution ?? 0), 0);
  if (margin50 < 0) return 'MUTE';
  if ((qFor50 >= 3 && qAg50 === 0) || (qFor50 >= 2 && margin50 >= 1)) return 'STRONG';
  if (qFor50 >= 1 && margin50 >= 1 && maxContribF >= 50) return 'STANDARD';
  return 'LEAN';
}

// Single source of truth for lockStage + who promoted it + which v7.0
// sub-tier the pick currently sits in (ELITE / LOCKED / LEAN / MUTED).
//
// Write threshold (Δw ≥ +1 ∧ Δq ≥ +1 ∧ Δw+Δq ≥ +3) is unchanged from
// v6.6 — every qualifying pick still flows into the Locked Picks list
// so it can be tracked. What changes in v7.0 is the SIZING tier:
//
//   ELITE  (Σ ≥ +7)  → max ladder + ELITE bonus (4.0u ML / 2.5u S+T)
//   LOCKED (Σ ∈ 5,6) → standard ladder (3.0u/2.0u ML, 2.0u/1.5u S+T)
//   LEAN   (Σ ∈ 3,4) → tracked but 0u ("would-have-locked under v6.6
//                       but didn't clear the v7.0 Σ ≥ +5 lock floor")
//   MUTED  (Σ < +3 OR Δw ≤ 0 OR Δq ≤ 0) — handled by health engine.
//
// Rationale (V6_FULL_ANALYSIS, N=104, 4/18–4/28). Σ ≥ +5 is the first
// cumulative cohort to clear t = 1.96 on the flat-PnL t-test (+35.2%
// flat ROI on N=31). Σ ∈ {3,4} is directionally flat (-7% / -28.8%
// flat ROI). Raising the lock floor from Σ ≥ +3 to Σ ≥ +5 drops the
// negative-EV mass while keeping the +0.319 Δw+Δq correlation intact.
// LEAN preserves visibility on the {3,4} cohort so we can monitor
// edge regression without bleeding bankroll.
// AGS-Unified v9 — single source of truth for lockStage + promotedBy.
// Ship floor is q20 (the hard-mute boundary). Picks above q20 with
// ≥ AGS_MIN_PROVEN_WALLETS proven wallets LOCK; sizing band determines
// stake (ELITE 2.00× → PREMIUM 1.50× → LOCK 1.10× → LEAN 0.50× → WEAK 0.20×).
// Picks at or below q20 (FADE) → SHADOW. This preserves 100% of the
// volume validated in the v9 holdout backtest while concentrating size
// on the picks with the strongest aggregate proven-wallet signal.
function decideLockStage(_regime, v8Scoring, sideKey, sport = null, _baseStars = 0, pickDate = null) {
  const contribTier = classifyContributionTier(v8Scoring, sideKey);
  if (!sport) {
    return { stage: 'SHADOW', contribTier, promotedBy: null, dw: 0, dq: 0,
             lockTier: 'FADE', hcDominant: false, hcMargin: 0 };
  }
  const wc = computeWalletConsensus(v8Scoring?.walletDetails, sport, sideKey, pickDate);
  const dw = wc.delta || 0;
  const dq = wc.qualityMargin || 0;
  const hcDominant = !!wc.hcDominant;
  const hcMargin = (wc.hcConfFor || 0) - (wc.hcConfAg || 0);
  const sport_cfg = WHITELIST_INTERVENTION[sport];

  // Compute AGS-U from frozen walletDetails using both proven + HC predicates.
  let agsValue = null;
  let agsProvenTotal = null;
  let agsTier = 'UNKNOWN';
  if (Array.isArray(v8Scoring?.walletDetails) && v8Scoring.walletDetails.length > 0) {
    const agg = aggregateSideProven(
      v8Scoring.walletDetails, sideKey, sport, isProvenForAgs, isHcEligibleForAgs, walletStatsForAgs,
    );
    if (agg) {
      const agsR = computeAgs(agg, getAgsCalibration());
      if (agsR) {
        agsValue = agsR.ags;
        agsProvenTotal = agsR.provenForCount + agsR.provenAgCount;
        agsTier = agsR.tier;
      }
    }
  }

  if (!sport_cfg?.promote) {
    return { stage: 'SHADOW', contribTier, promotedBy: null, dw, dq, lockTier: agsTier, hcDominant, hcMargin };
  }
  if (agsValue == null || agsProvenTotal == null || agsProvenTotal < AGS_MIN_PROVEN_WALLETS) {
    return { stage: 'SHADOW', contribTier, promotedBy: null, dw, dq, lockTier: agsTier, hcDominant, hcMargin };
  }
  if (meetsAgsHardMute(agsValue, getAgsCalibration())) {
    return { stage: 'SHADOW', contribTier, promotedBy: null, dw, dq, lockTier: agsTier, hcDominant, hcMargin };
  }

  return {
    stage: 'LOCKED',
    contribTier,
    promotedBy: 'ags-unified-v9',
    dw, dq, lockTier: agsTier, hcDominant, hcMargin,
  };
}

// Minimum dollars behind a side to even consider writing the pick.
// Baseline $5k; relaxed to $2.5k when contribution tier is STRONG/STANDARD
// (we trust the qualified-sharp signal even at lower aggregate volume).
//
// IMPORTANT — this floor is the LOCKED dollar gate. SHADOW writes use the
// relaxed `minInvestedFloorShadow` below so the tracked-but-not-shipped
// pool is wide enough to evaluate AGS / Δw / HC margin attribution.
function minInvestedFloor(contribTier) {
  if (contribTier === 'STRONG' || contribTier === 'STANDARD') return 2500;
  return 5000;
}

// V8.6 — Relaxed dollar floor for SHADOW writes ONLY. The LOCKED path
// continues to require `minInvestedFloor` ($5k / $2.5k). SHADOWs are
// tracked-but-not-shipped picks that exist purely so AGS, Δw, HC margin,
// and walletDetails are captured on a much wider sample. Lowering the
// floor here ~5x expands the SHADOW pool without touching what we ship.
//   $1k baseline, $500 when contrib tier is STRONG/STANDARD.
function minInvestedFloorShadow(contribTier) {
  if (contribTier === 'STRONG' || contribTier === 'STANDARD') return 500;
  return 1000;
}

// V8.2 — CLEAR_MOVE sizing bonus.
// Historical finding (N=11 V8-era picks): CLEAR_MOVE regime carries a
// 72.7% WR / +29.5% flat ROI edge and every sub-partition of CLEAR_MOVE
// (by star, contribTier, Δcontribution) was profitable.  We bump every
// CLEAR_MOVE pick by a flat +0.5u.  Replaces the old starDelta
// topPickBonus which rarely fired in production.
function clearMoveSizeBonus(regime) {
  return regime === 'CLEAR_MOVE' ? 0.5 : 0;
}

// V8.3 — wallet-crew quality modifier (regime-agnostic).
// meanBase_F = average walletBase across for-side wallets. Full-sample
// (N=42) split showed the strongest, cleanest separation in the V8 data:
//   ≥55  : N=14  WR 71.4%  flatROI +33.9%  (every regime profitable)
//   50-55: N= 8  WR 62.5%  flatROI +12.1%  (neutral band)
//   <50  : N=20  WR 30.0%  flatROI -35.6%  (bleeder in every regime)
// Applies everywhere — this signal is decoupled from regime and
// stacks with clearMoveSizeBonus (they measure different things:
// market confirmation vs wallet-crew caliber).
function computeMeanBaseF(v8Scoring, sideKey) {
  const forW = (v8Scoring?.walletDetails || [])
    .filter(w => w.side === (v8Scoring?.consensusSide || sideKey));
  if (!forW.length) return null;
  return forW.reduce((s, w) => s + (w.walletBase ?? 0), 0) / forW.length;
}

function qualityBonus(v8Scoring, sideKey) {
  const meanBase = computeMeanBaseF(v8Scoring, sideKey);
  if (meanBase == null) return 0;
  if (meanBase >= 55) return 0.25;
  if (meanBase < 50)  return -0.25;
  return 0;   // 50–55 neutral band
}

// TOP PICK / SUPER TOP PICK predicates — AGS-Unified v9.
//
//   SUPER TOP PICK (filled gold ribbon + glow): AGS-U tier === ELITE  (≥ q90)
//   TOP PICK       (outlined gold ribbon):      AGS-U tier === PREMIUM (≥ q80)
//   NO BADGE                                    : everything else (LOCK/LEAN/WEAK/FADE)
//
// Per the v9 holdout backtest (N=67), the ELITE bucket runs ~80% WR /
// +41% ROI per pick and the PREMIUM bucket runs ~75% WR / +35% ROI —
// the same separation that historically distinguished the legacy
// Δw≥+2/Δq≥+2 cohort. By tying the ribbon to AGS-U directly we get a
// single signal for "is this a premium play?" that also drives sizing.
//
// Source of truth: `side.v8_agsTier` (stamped by syncPickStateAuthoritative)
// with `side.v8_ags` as a fallback for tier derivation when the stamp
// hasn't been refreshed yet on a historical doc.
function evaluateTopPickTier(peak, lock, sideKey, promotedRegime = null,
                             _walletDelta = null, _walletAgW = null, qualityMargin = null,
                             side = null, _pickDate = null) {
  const regime = peak?.regime ?? lock?.regime ?? promotedRegime ?? null;
  const v8 = peak?.v8Scoring ?? lock?.v8Scoring ?? null;
  const meanBaseF = computeMeanBaseF(v8, sideKey);

  // v12.1 (HC-margin staking) — cron-authoritative. When the cron has stamped
  // a product stake tier, the ribbon comes from it, NOT the score quintile:
  //   SUPER → filled gold "SUPER TOP PICK", TOP → outlined gold "TOP PICK".
  //   CONFIRMED / MONITORING / FADE → no gold ribbon (own labels handled in card).
  const hcStakeTier = side?.v8_hcStakeTier || null;
  if (hcStakeTier) {
    const isSuperTopPick = hcStakeTier === 'SUPER';
    const isTopPick = isSuperTopPick || hcStakeTier === 'TOP' || hcStakeTier === 'TOP+';
    return { isTopPick, isSuperTopPick, hcStakeTier, regime, meanBaseF, qualityMargin };
  }

  // Legacy (pre-v12.1) — prefer the stamped tier, then derive from stamped
  // AGS-U value, then fall through to "no badge" (no AGS-U signal → not top).
  let tier = side?.v8_agsTier || null;
  if (!tier && Number.isFinite(side?.v8_ags)) {
    tier = agsTierFromValue(side.v8_ags, getAgsCalibration());
  }
  const isSuperTopPick = tier === 'ELITE';
  const isTopPick      = isSuperTopPick || tier === 'PREMIUM';

  return { isTopPick, isSuperTopPick, hcStakeTier: null, regime, meanBaseF, qualityMargin };
}

// V8.3 — NEAR_START elite-wallet modifier (regime-specific).
// maxRoiN_F = highest roiNorm across for-side wallets.  Inside NEAR_START
// (N=22) the split is extreme:
//   ≥70  : N=11  WR 63.6%  flatROI +42.6%
//   50-70: N=10  WR 20.0%  flatROI -60.2%   ← toxic band
// Outside NEAR_START the signal is weak, so we gate this rule by regime.
function nearStartMaxRoiBonus(regime, v8Scoring, sideKey) {
  if (regime !== 'NEAR_START') return 0;
  const forW = (v8Scoring?.walletDetails || [])
    .filter(w => w.side === (v8Scoring?.consensusSide || sideKey));
  if (!forW.length) return 0;
  const maxRoi = forW.reduce((m, w) => Math.max(m, w.roiNorm ?? 0), 0);
  if (maxRoi >= 70) return 0.25;
  if (maxRoi >= 50) return -0.25;
  return 0;   // <50 has only N=1 — stay neutral
}

// v6: sizing is derived entirely from the two-factor star. This helper is
// retained for legacy callers and always returns 0 now. Regime / meanBase_F
// / NEAR_START-maxRoi / whitelist-bonus stacking is gone.
function computeRegimeBonus(_regime, _v8Scoring, _sideKey, _sport = null) {
  return 0;
}

// Phase 2: stamp wallet-consensus attribution fields on a sideData object.
// Mutates `target` in place. Always safe to call — missing data → no-op stamps.
//
// IMPORTANT: the profile cache (`WALLET_PROFILES_CACHE`) is loaded async at
// app boot. If syncs fire before it populates, every wallet fails
// `isWhitelistedForSport`, which silently stamps forW=0/agW=0/NEUTRAL onto
// live locked picks. To avoid poisoning the doc, skip stamping entirely
// until the cache is ready; a later sync will stamp with real values.
function stampWalletConsensus(target, v8Scoring, sideKey, sport, baseStars, promotedBy, pickDate = null) {
  if (!WALLET_PROFILES_CACHE) return;
  const wc = computeWalletConsensus(v8Scoring?.walletDetails, sport, sideKey, pickDate);
  target.v8_walletConsensusVersion = WHITELIST_CONSENSUS_VERSION;
  target.v8_walletConsensusSport = sport || null;
  target.v8_walletConsensusEnabled = !!WHITELIST_INTERVENTION[sport];
  target.v8_walletConsensusForW = wc.forW;
  target.v8_walletConsensusAgW = wc.agW;
  target.v8_walletConsensusDelta = wc.delta;
  target.v8_walletConsensusVerdict = wc.verdict;
  target.v8_walletConsensusStarBonus = wc.unitBonus;
  // AGS-Unified v9: mute/cancel stamps now reflect the AGS-U hard-mute
  // gate, NOT the legacy Δw/Δq lockAction. This keeps the
  // restampDriftedSides drift detection aligned with the cron's actual
  // mute decision (meetsAgsHardMute + proven floor) instead of the
  // pre-v9 two-factor floor. wc.lockAction is preserved on the in-memory
  // object for legacy diagnostic logging only — nothing reads it for
  // user-visible decisions.
  // Note: agsuMuteTriggered is filled in below once stampAgsValue is
  // computed (AGS-U pipeline runs a few lines down). We default-stamp
  // false here and overwrite when the AGS-U gate fires.
  target.v8_walletConsensusMuteTriggered = false;
  target.v8_walletConsensusCancelTriggered = wc.lockAction === 'CANCEL';
  target.v8_walletConsensusPromotionTriggered = isPromotedBy(promotedBy);
  target.v8_walletConsensusBaseStars = baseStars || 0;
  // v6 two-factor fields
  target.v8_walletConsensusQualityForT30 = wc.qualityForT30;
  target.v8_walletConsensusQualityAgT30 = wc.qualityAgT30;
  target.v8_walletConsensusQualityMargin = wc.qualityMargin;
  const stampHcMargin = (wc.hcConfFor || 0) - (wc.hcConfAg || 0);
  // v7.5 — compute AGS first so the star floor + lock tier reflect the
  // Δw=1+AGS route. Mirrors scripts/syncPickStateAuthoritative.js ordering.
  let stampAgsValue = null;
  let stampAgsProvenTotal = null;
  let stampAgsResult = null;
  const wdEarly = v8Scoring?.walletDetails;
  if (Array.isArray(wdEarly) && wdEarly.length > 0) {
    const aggE = aggregateSideProven(wdEarly, sideKey, sport, isProvenForAgs, isHcEligibleForAgs, walletStatsForAgs);
    if (aggE) {
      stampAgsResult = computeAgs(aggE, getAgsCalibration());
      if (stampAgsResult) {
        stampAgsValue = stampAgsResult.ags;
        stampAgsProvenTotal = stampAgsResult.provenForCount + stampAgsResult.provenAgCount;
      }
    }
  }
  target.v8_vaultStar = (wc.forW || wc.agW || wc.qualityMargin !== 0 || stampHcMargin >= 1)
    ? vaultStarFromDeltas(wc.delta, wc.qualityMargin, stampHcMargin, pickDate, stampAgsValue)
    : null;
  // v7.1/v7.2/v7.3 — HC dominance + margin + cohort labels + system version.
  // Pre-cutover picks get v8_systemVersion: '7.0' (or '7.1' for the
  // 1-day window); post-V7_2 picks get '7.2'; post-V7_3 picks get '7.3'.
  // Daily report partitions cohorts by this stamp + promotedBy.
  target.v8_hcConfFor    = wc.hcConfFor;
  target.v8_hcConfAg     = wc.hcConfAg;
  target.v8_hcDominant   = wc.hcDominant;
  target.v8_hcMargin     = (wc.hcConfFor || 0) - (wc.hcConfAg || 0);
  const v73Active = isV73Eligible(pickDate);
  const v72Active = isV72Eligible(pickDate);
  target.v8_systemVersion = v73Active ? '7.3'
    : v72Active ? '7.2'
    : isV71Eligible(pickDate) ? '7.1'
    : '7.0';
  // v7.2/v7.3/v7.5 frozen lock-tier — AGS-aware (Δw=1+AGS route + ELITE).
  //
  // v12 NOTE: this is the V11-derived tier. The cron (syncPickStateAuthoritative)
  // is authoritative for `v8_lockTier` in v12, deriving it from the v12 score
  // (computeAgsV12 → agsV12TierFromValue). The browser can no longer clobber
  // that field — we route the V11 computation to `v8_lockTierV11` for
  // diagnostic / drift purposes. Pre-cron-touch picks will simply not have a
  // v8_lockTier for ~8 min until the next cron cycle stamps it.
  const liveTier = lockTierFromDeltas(wc.delta, wc.qualityMargin, wc.hcDominant, {
    pickDate,
    hcMargin: target.v8_hcMargin,
    ags: stampAgsValue,
    agsProvenTotal: stampAgsProvenTotal,
  });
  target.v8_lockTierV11 = liveTier;
  // AGS-Unified v9 TOP / SUPER badge stamps:
  //   SUPER TOP PICK = AGS-U tier ≡ ELITE   (≥ q90 — top decile)
  //   TOP PICK       = AGS-U tier ≡ PREMIUM (≥ q80) OR SUPER
  // Both flags require the pick to ship at full size — tier ∈
  // {ELITE, PREMIUM, LOCK}. LEAN/WEAK ship at reduced size but do NOT
  // earn the gold ribbon. evaluateTopPickTier() reads these stamps
  // first and only falls back to derivation from v8_agsTier / v8_ags
  // when the stamp is missing.
  //
  // BUG FIX (AGS-U v9): the previous check was
  // `liveTier === 'LOCKED' || liveTier === 'ELITE'`, but
  // `lockTierFromDeltas` returns the canonical AGS-U tier strings
  // ('ELITE' / 'PREMIUM' / 'LOCK' / 'LEAN' / 'WEAK' / 'FADE') — never
  // 'LOCKED'. So PREMIUM-tier picks (q80-q90) silently failed the
  // isShipped check and never earned the gold ribbon. Use the canonical
  // set instead.
  const isShipped = liveTier === 'ELITE'
    || liveTier === 'PREMIUM'
    || liveTier === 'LOCK';
  const agsTierStamp = stampAgsResult?.tier || null;
  // v12.1 — when the cron has stamped a product stake tier on this side, the
  // browser MUST defer to it so the gold ribbon never disagrees with the
  // authoritative HC-margin model. SUPER → super ribbon, TOP → top ribbon;
  // CONFIRMED / MONITORING → no gold ribbon.
  if (target.v8_hcStakeTier) {
    target.v8_topPick      = ['SUPER', 'TOP', 'TOP+'].includes(target.v8_hcStakeTier);
    target.v8_superTopPick = target.v8_hcStakeTier === 'SUPER';
  } else {
    target.v8_topPick      = isShipped && (agsTierStamp === 'ELITE' || agsTierStamp === 'PREMIUM');
    target.v8_superTopPick = isShipped && agsTierStamp === 'ELITE';
  }

  // AGS (AggregateScore) — already computed above (stampAgsResult).
  //
  // v12 NOTE: V11 stamps are now DIAGNOSTIC ONLY. The cron
  // (syncPickStateAuthoritative + computeAgsV12) is the single source of
  // truth for `v8_agsTier`, `health`, `mutedBy`, `finalUnits`, etc., all
  // derived from the v12 score. The browser used to overwrite these from
  // a V11 computation on every session, which clobbered the cron's v12
  // values within seconds — manifesting as "v8_agsTier = FADE while
  // v8_agsV12 = 0.987 / ELITE" mismatches in Firestore.
  //
  // Fix: stamp the V11 score + components into `v8_agsV11*` slots so
  // historical reports + drift analysis still have V11 truth, but DO NOT
  // touch the canonical fields (v8_agsTier, mutedBy, health) — those
  // belong to the cron now.
  if (stampAgsResult) {
    target.v8_ags = stampAgsResult.ags;
    target.v8_agsTierV11 = stampAgsResult.tier;
    target.v8_agsQuintile = stampAgsResult.quintile;
    target.v8_agsComponents = stampAgsResult.components;
    target.v8_agsProvenForCount = stampAgsResult.provenForCount;
    target.v8_agsProvenAgCount = stampAgsResult.provenAgCount;
    target.v8_agsCalibrationSource = stampAgsResult.calibrationSource || 'firestore';
    target.v8_agsEvaluatedAt = Date.now();
    // Diagnostic only — what V11's hard-mute gate would have said this
    // tick. NOT consulted for any decision (v12 mute is `score ≤ 0`).
    target.v8_walletConsensusMuteTriggered = (
      stampAgsProvenTotal >= AGS_MIN_PROVEN_WALLETS
      && Number.isFinite(stampAgsValue)
      && meetsAgsHardMute(stampAgsValue, getAgsCalibration())
    );
  }

  // ── Health reconciliation — DISABLED in v12 ───────────────────────────
  // Pre-v12 the browser wrote `target.health = {...}` here, computed from
  // the V11 hard-mute gate (proven wallet floor + meetsAgsHardMute). That
  // was needed because the V11 cron sometimes left stale `health.status`
  // on picks promoted inside the T-15 freeze window.
  //
  // In v12 the cron's reconcileSide writes a coherent `health` block
  // every cycle from `evaluateBaseHealthV12({ scoreV12 })` (the
  // authoritative `score ≤ 0 → MUTED` rule). The browser stamping V11
  // health here would clobber the v12 health every session — e.g.
  // setting `health.status = 'ACTIVE'` and `reasons = []` on a pick the
  // cron just muted with `agsv12_mute_below_zero`.
  //
  // We retain the V11 computation locally for diagnostic / display
  // purposes only — but do NOT write it back to the doc. `target.health`
  // is now cron-owned.
  const healthReasons = [];
  let healthStatus = 'ACTIVE';
  if (!Number.isFinite(stampAgsValue)) {
    healthStatus = 'MUTED';
    healthReasons.push('no_ags_signal');
  } else if (stampAgsProvenTotal != null && stampAgsProvenTotal < AGS_MIN_PROVEN_WALLETS) {
    healthStatus = 'MUTED';
    healthReasons.push('insufficient_proven_wallets');
  } else {
    const cal = getAgsCalibration();
    if (meetsAgsHardMute(stampAgsValue, cal)) {
      healthStatus = 'MUTED';
      healthReasons.push('ags_hard_mute');
    }
  }
  // Diagnostic mirror — V11 health stamp kept on a sidecar field so
  // historical reports + drift checks still have V11 truth available.
  // Does NOT overwrite the cron-owned `health` block.
  target.healthV11 = {
    status: healthStatus,
    reasons: healthReasons,
    walletDelta: wc.delta,
    qualityMargin: wc.qualityMargin,
    hcMargin: target.v8_hcMargin,
    evaluatedAt: Date.now(),
    syncedBy: 'client-stamp',
    ags: Number.isFinite(stampAgsValue) ? stampAgsValue : null,
  };
}

// Phase 2: true if the existing side is missing a stamp or has a stale one.
// Used by sync paths that would otherwise be `no_change` or `maxev_updated`
// to backfill attribution once the profile cache is loaded.
function needsConsensusRestamp(existingSide) {
  if (!WALLET_PROFILES_CACHE) return false;
  const v = existingSide?.v8_walletConsensusVersion;
  return v == null || v < WHITELIST_CONSENSUS_VERSION;
}

// v5.4: drift-restamp ALL non-superseded sides, not just the current
// consensus side. v5.3 only re-stamped the side passed into the sync;
// when consensus *flipped* to a brand-new side (e.g. Oilers becomes
// the live consensus while the doc still has only a Ducks side), the
// stale Ducks Δ would never be touched — so the fade signal from a
// late-arriving NHL WINNER never propagated to mute the old pick.
//
// This helper iterates every non-superseded side, computes its live
// Δ from the same walletDetails (which carries both sides' wallets),
// and restamps any that have drifted from their stored values. The
// regime/v8Scoring args reflect the CURRENT consensus side; for OTHER
// sides we fall back to that side's stored peak.regime/v8Scoring so
// decideLockStage produces a reasonable promotedBy label.
async function restampDriftedSides({ ref, sides, currentSideKey, sport, regime, v8Scoring, currentStars, pickDate = null, lastSyncAt = null }) {
  if (!WALLET_PROFILES_CACHE) return null;
  if (!v8Scoring?.walletDetails) return null;

  // v7.4 — server cron is authoritative. If the cron wrote v8_* stamps
  // within V7_4_CRON_DEFER_WINDOW_MS (7 min), the browser's restamp
  // would just clobber fresh canonical state with the browser's
  // (potentially stale) walletDetails snapshot. This is the same defer
  // pattern syncPickHealth uses (SHARP_FLOW_SYSTEM.md §race-condition
  // guards #3) — extended here to close the last browser-write path
  // that was bypassing the cron-authoritative contract.
  //
  // Detect cron-fresh by checking the SIDES for a server-cron syncedBy
  // stamp (cron's reconcileSide writes health.syncedBy='server-cron'
  // and createMissingLockedPicks writes source='cron-auto-create' on
  // the sides). If any non-superseded side was last touched by the
  // cron within the window, skip the restamp entirely. The cron will
  // re-evaluate drift on its own next cycle (~8 min) anyway.
  if (isV74Eligible(pickDate) && lastSyncAt && (Date.now() - lastSyncAt) < V7_4_CRON_DEFER_WINDOW_MS) {
    const anyCronFresh = Object.values(sides || {}).some(sd =>
      sd?.health?.syncedBy === 'server-cron' || sd?.cronCreated === true
    );
    if (anyCronFresh) return null; // cron-fresh — leave it alone
  }

  const updates = {};
  let touched = 0;

  for (const [sideKey, stored] of Object.entries(sides || {})) {
    if (!stored) continue;
    if (stored.status === 'COMPLETED') continue;
    if (stored.superseded) continue;
    const liveWc = computeWalletConsensus(v8Scoring.walletDetails, sport, sideKey, pickDate);
    // AGS-Unified v9 drift signal — compare against the AGS-U hard-mute
    // gate, not the legacy Δw/Δq lockAction. stampWalletConsensus now
    // writes v8_walletConsensusMuteTriggered as the AGS-U hard-mute
    // boolean, so drift fires when the AGS-U gate would flip.
    const liveAgg = aggregateSideProven(v8Scoring.walletDetails, sideKey, sport, isProvenForAgs, isHcEligibleForAgs, walletStatsForAgs);
    const liveAgsRes = liveAgg ? computeAgs(liveAgg, getAgsCalibration()) : null;
    const liveAgsValue = liveAgsRes?.ags ?? null;
    const liveAgsProvenTotal = liveAgsRes
      ? (liveAgsRes.provenForCount + liveAgsRes.provenAgCount)
      : 0;
    const liveAgsHardMuted = liveAgsProvenTotal >= AGS_MIN_PROVEN_WALLETS
      && Number.isFinite(liveAgsValue)
      && meetsAgsHardMute(liveAgsValue, getAgsCalibration());
    const drifted =
      stored.v8_walletConsensusDelta !== liveWc.delta ||
      stored.v8_walletConsensusVerdict !== liveWc.verdict ||
      !!stored.v8_walletConsensusMuteTriggered !== liveAgsHardMuted ||
      !!stored.v8_walletConsensusCancelTriggered !== (liveWc.lockAction === 'CANCEL') ||
      // v7.1 — also restamp when HC dominance state has flipped or when
      // we're upgrading a doc to consensus version 7 for the first time.
      !!stored.v8_hcDominant !== !!liveWc.hcDominant ||
      (stored.v8_walletConsensusVersion ?? 0) < WHITELIST_CONSENSUS_VERSION;
    if (!drifted) continue;

    const isCurrent = sideKey === currentSideKey;
    const sideStars = isCurrent ? (currentStars || 0) : (stored.peak?.stars || stored.lock?.stars || 0);
    const sideRegime = isCurrent ? regime : (stored.peak?.regime || stored.lock?.regime || null);
    const sideV8 = isCurrent ? v8Scoring : (stored.peak?.v8Scoring || v8Scoring);
    const decision = decideLockStage(sideRegime, sideV8, sideKey, sport, sideStars, pickDate);
    const patch = {};
    // Always stamp from the LIVE walletDetails (v8Scoring), not the side's
    // stored peak.v8Scoring.walletDetails — that snapshot is what we're
    // trying to reconcile away from.
    stampWalletConsensus(patch, v8Scoring, sideKey, sport, sideStars, decision.promotedBy, pickDate);
    updates[sideKey] = patch;
    touched++;
  }

  if (touched === 0) return null;
  await setDoc(ref, { sides: updates, lastWriteAt: Date.now(), lastAction: 'consensus_drift_restamp' }, { merge: true });
  return { touched };
}

function buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, opposition, walletProfile, regime, qualityProxy, v8Scoring, sport = null, pickDate = null) {
  const now = Date.now();
  const tier = unitTier(units).label;
  const snapshot = { odds, book, pinnacleOdds, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units, unitTier: tier, consensusStrength, stars: stars || 0 };
  if (opposition) snapshot.opposition = opposition;
  if (walletProfile) snapshot.walletProfile = walletProfile;
  if (regime) snapshot.regime = regime;
  if (qualityProxy != null) snapshot.qualityProxy = qualityProxy;
  if (v8Scoring) snapshot.v8Scoring = v8Scoring;
  const { stage: lockStage, contribTier, promotedBy } = decideLockStage(regime, v8Scoring, side, sport, stars || 0, pickDate);
  const base = {
    team,
    lock: { ...snapshot, lockedAt: now },
    peak: { ...snapshot, updatedAt: now },
    maxEV: evEdge || 0,
    maxEVAt: now,
    lockStage,
    contribTier: contribTier || null,
    status: 'PENDING',
    result: { outcome: null, profit: null, gradedAt: null },
  };
  if (lockStage === 'LOCKED') {
    base.promotedBy = promotedBy;
    if (isPromotedBy(promotedBy)) {
      base.promotedAt = now;
      base.promotedRegime = regime || null;
    }
  }
  stampWalletConsensus(base, v8Scoring, side, sport, stars || 0, promotedBy, pickDate);
  return base;
}

async function syncPickToFirebase({ date, sport, gameKey, away, home, commenceTime, side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, opposition, walletProfile, regime, qualityProxy, v8Scoring }) {
  try {
    const PREGAME_BUFFER_MS = 5 * 60 * 1000;
    const docId = `${date}_${sport}_${gameKey}`;
    if (!commenceTime || Date.now() >= commenceTime - PREGAME_BUFFER_MS) {
      return { docId, action: 'no_change' };
    }
    const contribTier = classifyContributionTier(v8Scoring, side);
    // V8.6 — Sync layer enforces the SHADOW dollar floor only. The
    // LOCKED dollar floor (`minInvestedFloor`) is enforced upstream at
    // the `isLocked = twoFactorFloor && meetsInvest` check, so any
    // LOCKED-intent caller already cleared the strict $5k/$2.5k bar.
    // Using the shadow floor here lets relaxed-gate SHADOW writes land.
    const minInv = minInvestedFloorShadow(contribTier);
    if ((totalInvested || 0) < minInv) {
      console.warn(`[syncPickToFirebase] REJECTED ${docId}: totalInvested $${totalInvested} < $${minInv} shadow minimum (contribTier=${contribTier})`);
      return { docId, action: 'no_change' };
    }

    const ref = doc(db, 'sharpFlowPicks', docId);
    const existing = await getDoc(ref);

    if (!existing.exists()) {
      const sideData = buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, opposition, walletProfile, regime, qualityProxy, v8Scoring, sport, date);
      await setDoc(ref, {
        date, sport, gameKey, away, home, commenceTime: commenceTime || null,
        lockType: 'PREGAME',
        sides: { [side]: sideData },
        flipBeatThreshold: v8Scoring?.walletPlayScore ?? null,
        status: 'PENDING',
        result: { awayScore: null, homeScore: null, winner: null },
        source: 'ui_card_sync',
        createdAt: Date.now(),
      });
      return { docId, action: 'created' };
    }

    const data = existing.data();
    if (data.status === 'COMPLETED') return { docId, action: 'no_change' };
    const sides = data.sides || {};
    // v7.1 — every downstream branch needs the persisted pick date so
    // pre-cutover docs stay on v7.0 logic even when re-stamped today.
    const pickDate = data.date || date;

    if (sides[side]) {
      if (sides[side].status === 'COMPLETED') return { docId, action: 'no_change' };

      const isReflip = !!sides[side].superseded;

      const currentMaxEV = sides[side].maxEV ?? 0;
      const currentEV = evEdge || 0;
      const evIsNewMax = currentEV > currentMaxEV;

      const currentPeak = sides[side].peak?.units || 0;
      const currentPeakStars = sides[side].peak?.stars || 0;
      // AGS-Unified v9 sizing — the incoming `units` value is already
      // sized by agsuUnitsFromAgs (band multiplier × base × odds cap).
      // We do not re-clamp here; the only adjustment is the FADE-tier
      // hard mute (units → 0) and a 0.0u floor to prevent NaNs.
      const decision = decideLockStage(regime, v8Scoring, side, sport, stars || 0, pickDate);
      const isMuted = decision.lockTier === 'FADE';
      const bumpedUnits = isMuted ? 0 : Math.max(units, 0);
      // Allow peak to DECREASE when transitioning into FADE — otherwise
      // the monotonic max-rule would freeze peak.units at the previous
      // non-muted value and we'd ship muted picks at the old size.
      const peakShouldWrite = isReflip || isMuted || bumpedUnits > currentPeak || stars > currentPeakStars;
      if (peakShouldWrite) {
        // v12 cleanup: peak.units / peak.unitTier / peak.stars are now
        // cron-authoritative (syncPickStateAuthoritative refreshes them
        // every cycle from v12). The browser used to compute these via
        // v9's decideLockStage which OVERRIDES v12 (e.g. Nationals 2026-
        // 06-01 was v12=ELITE/5u/5★ but v9 was FADE → browser stamped
        // peak.units=0/stars=1 every position scan, undoing cron's
        // refresh in seconds). Keep only the descriptive market-side
        // fields the cron doesn't compute (odds / EV / criteria etc.).
        const peakData = { odds, book, pinnacleOdds, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, consensusStrength, updatedAt: Date.now() };
        if (opposition) peakData.opposition = opposition;
        if (walletProfile) peakData.walletProfile = walletProfile;
        if (regime) peakData.regime = regime;
        if (qualityProxy != null) peakData.qualityProxy = qualityProxy;
        if (v8Scoring) peakData.v8Scoring = v8Scoring;
        const mergeData = { sides: { [side]: { peak: peakData } }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: isReflip ? 'side_reflipped' : 'peak_updated' };
        if (evIsNewMax) { mergeData.sides[side].maxEV = currentEV; mergeData.sides[side].maxEVAt = Date.now(); }
        mergeData.sides[side].contribTier = decision.contribTier || null;
        // v12 cleanup: lockStage / promotedBy / promotedAt / lock.regime are
        // OWNED by the syncPickStateAuthoritative cron (which runs the v12
        // gate every ~8 min). The browser must NOT promote SHADOW→LOCKED
        // here — v9's decideLockStage doesn't see v12 score, so any UI-side
        // promotion would re-lock picks that v12 demoted to FADE/SHADOW.
        // Diagnostic-only stamp so we can see what the legacy v9 path would
        // have decided.
        mergeData.sides[side].lockStageV9 = decision.stage;
        mergeData.sides[side].lockTierV9 = decision.lockTier || null;
        stampWalletConsensus(mergeData.sides[side], v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        if (isReflip) {
          mergeData.sides[side].superseded = false;
          mergeData.sides[side].supersededAt = null;
          const reflipWPS = v8Scoring?.walletPlayScore ?? null;
          if (reflipWPS != null) mergeData.flipBeatThreshold = reflipWPS;
          // v12 cleanup: do NOT write lockStage/promotedBy on reflip — cron
          // re-evaluates from frozen walletDetails and stamps authoritatively.
          // We only clear `superseded` here and mark the other side superseded.
          stampWalletConsensus(mergeData.sides[side], v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
          for (const [otherSide] of Object.entries(sides)) {
            if (otherSide === side) continue;
            if (!mergeData.sides[otherSide]) mergeData.sides[otherSide] = {};
            mergeData.sides[otherSide].superseded = true;
            mergeData.sides[otherSide].supersededAt = Date.now();
          }
        }
        await setDoc(ref, mergeData, { merge: true });
        return { docId, action: isReflip ? 'side_reflipped' : 'peak_updated' };
      }

      {
        // v12 cleanup: SHADOW→LOCKED promotion is cron-authoritative now.
        // The browser used to fire a promotion patch here based on v9's
        // decideLockStage, which clobbered v12 SHADOW decisions. Removed.
        if (sides[side].lockStage === 'SHADOW' && decision.stage === 'LOCKED') {
          // No-op — cron will handle promotion based on v12 score > 0.
        }
      }

      if (evIsNewMax) {
        const patch = { maxEV: currentEV, maxEVAt: Date.now() };
        if (needsConsensusRestamp(sides[side])) {
          stampWalletConsensus(patch, v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        }
        await setDoc(ref, {
          sides: { [side]: patch },
          lastWriteAt: Date.now(),
        }, { merge: true });
        return { docId, action: 'maxev_updated' };
      }

      // Phase 2 backfill: if the stamp is missing/stale and the profile
      // cache is now loaded, write an attribution-only patch so already-
      // locked stable picks pick up their wallet-consensus fields.
      if (needsConsensusRestamp(sides[side])) {
        const patch = {};
        stampWalletConsensus(patch, v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        if (Object.keys(patch).length) {
          await setDoc(ref, {
            sides: { [side]: patch },
            lastWriteAt: Date.now(), lastAction: 'consensus_backfill',
          }, { merge: true });
          return { docId, action: 'consensus_backfill' };
        }
      }

      // v5.4: drift-restamp ALL non-superseded sides (incl. current).
      const restamp = await restampDriftedSides({ ref, sides, currentSideKey: side, sport, regime, v8Scoring, currentStars: stars || 0, pickDate, lastSyncAt: data.lastSyncAt || data.lastWriteAt || 0 });
      if (restamp) return { docId, action: 'consensus_drift_restamp' };

      return { docId, action: 'no_change' };
    }

    // ─── new-side branch: sides[side] does not yet exist ───
    const existingSides = Object.entries(sides);
    const existingBestStars = existingSides.reduce((max, [, sd]) => {
      const s = sd.peak?.stars || sd.lock?.stars || 0;
      return s > max ? s : max;
    }, 0);

    // v5.4: even if we ultimately decide NOT to create this new side
    // (because its V8 stars don't beat the existing best), we still need
    // to refresh the existing side's Δ stamp from live walletDetails.
    // Otherwise an Oilers-side render with af1697 onboard would never
    // touch the orphaned Ducks side and Ducks Δ would stay frozen.
    await restampDriftedSides({ ref, sides, currentSideKey: side, sport, regime, v8Scoring, currentStars: stars || 0, pickDate, lastSyncAt: data.lastSyncAt || data.lastWriteAt || 0 });

    // v5.4: allow a NEW side with whitelist promotion eligibility
    // (Δ ≥ +1, agW = 0, baseStars ≥ 1.0) to supersede an existing locked
    // side that lacks whitelist support — even when its V8 stars are
    // below the existing peak. This is the path the user has been asking
    // for: "find these plays and play them." When sharps with proven
    // sport-specific edges arrive on the OTHER side after peak, the new
    // side is the play, even if its raw V8 score is lower.
    const newSideDecision = decideLockStage(regime, v8Scoring, side, sport, stars || 0, pickDate);
    const newSideHasWhitelistPromo =
      newSideDecision.stage === 'LOCKED' && isPromotedBy(newSideDecision.promotedBy);

    if (stars <= existingBestStars && !newSideHasWhitelistPromo) {
      const originalSide = existingSides.find(([, sd]) => sd.lock && !sd.superseded)?.[0];
      return { docId, action: 'no_change', originalSide };
    }
    const sideData = buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, opposition, walletProfile, regime, qualityProxy, v8Scoring, sport, pickDate);
    const newWPS = v8Scoring?.walletPlayScore ?? null;
    const action = newSideHasWhitelistPromo && stars <= existingBestStars ? 'side_added_whitelist' : 'side_added';
    const mergePayload = { sides: { [side]: sideData }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: action };
    if (newWPS != null) mergePayload.flipBeatThreshold = newWPS;
    for (const [existingSide] of existingSides) {
      mergePayload.sides[existingSide] = { ...mergePayload.sides[existingSide], superseded: true, supersededAt: Date.now() };
    }
    await setDoc(ref, mergePayload, { merge: true });
    return { docId, action };
  } catch (err) {
    console.warn('Failed to sync pick:', err.message);
    return { docId: `${date}_${sport}_${gameKey}`, action: 'error' };
  }
}

async function syncPregameSnapshot({ docId, side, snapshot }) {
  try {
    const ref = doc(db, 'sharpFlowPicks', docId);
    const existing = await getDoc(ref);
    if (!existing.exists()) return { action: 'no_doc' };
    const data = existing.data();
    if (data.status === 'COMPLETED') return { action: 'no_change' };
    if (!data.sides?.[side]?.lock) return { action: 'no_lock' };
    if (data.sides[side].pregame) return { action: 'already_captured' };
    await setDoc(ref, {
      sides: { [side]: { pregame: { ...snapshot, capturedAt: Date.now() } } },
      source: 'ui_pregame_sync', lastWriteAt: Date.now(), lastAction: 'pregame_captured',
    }, { merge: true });
    return { action: 'pregame_captured' };
  } catch (err) {
    console.warn('Failed to sync pregame snapshot:', err.message);
    return { action: 'error' };
  }
}

// ─── Pick Health Sync (independent of peak sync) ──────────────────────────────

// v7.4 — server cron is authoritative. If the cron wrote within this many
// ms, the browser defers and skips its own health write to avoid clobbering
// fresh canonical state with the browser's (potentially stale) data
// snapshot. Cron runs every ~8 min, so this guard window covers 7-of-8
// minutes — only the last ~1 min of each cron cycle is browser-eligible
// (and even then, the cron will overwrite again on its next cycle).
const V7_4_CRON_DEFER_WINDOW_MS = 7 * 60 * 1000;

async function syncPickHealth({ docId, collection: colName, side, health }) {
  try {
    const ref = doc(db, colName, docId);
    const existing = await getDoc(ref);
    if (!existing.exists()) return;
    const data = existing.data();
    if (data.status === 'COMPLETED') return;
    let targetSide = side;
    if (!data.sides?.[side]?.lock) {
      const original = Object.entries(data.sides || {})
        .find(([, sd]) => sd.lock && !sd.superseded);
      if (!original) return;
      targetSide = original[0];
    }
    // v7.4 — defer to recent cron writes. The cron's syncedBy stamp on
    // health.{} marks server-authored writes; if the doc was last touched
    // by the cron within the defer window, the browser skips so the
    // cron's canonical view wins.
    if (isV74Eligible(data.date)) {
      const sd = data.sides?.[targetSide];
      const lastSync = data.lastSyncAt || sd?.health?.evaluatedAt || 0;
      const wasCron = sd?.health?.syncedBy === 'server-cron';
      if (wasCron && lastSync && (Date.now() - lastSync) < V7_4_CRON_DEFER_WINDOW_MS) {
        return; // cron-fresh — leave it alone
      }
    }
    await setDoc(ref, {
      sides: { [targetSide]: { health: { ...health, evaluatedAt: Date.now() } } },
      lastWriteAt: Date.now(),
    }, { merge: true });
  } catch (err) {
    console.warn('[syncPickHealth] error:', err.message);
  }
}

// ─── Spread/Total Firebase Sync ───────────────────────────────────────────────

function buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, walletProfile, regime, qualityProxy, v8Scoring, sport = null, pickDate = null) {
  const now = Date.now();
  const tier = unitTier(units).label;
  const snapshot = { odds, book, pinnacleOdds, line, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units, unitTier: tier, consensusStrength, stars: stars || 0 };
  if (walletProfile) snapshot.walletProfile = walletProfile;
  if (regime) snapshot.regime = regime;
  if (qualityProxy != null) snapshot.qualityProxy = qualityProxy;
  if (v8Scoring) snapshot.v8Scoring = v8Scoring;
  const { stage: lockStage, contribTier, promotedBy } = decideLockStage(regime, v8Scoring, side, sport, stars || 0, pickDate);
  const base = {
    team,
    lock: { ...snapshot, lockedAt: now },
    peak: { ...snapshot, updatedAt: now },
    maxEV: evEdge || 0,
    maxEVAt: now,
    lockStage,
    contribTier: contribTier || null,
    status: 'PENDING',
    result: { outcome: null, profit: null, gradedAt: null },
  };
  if (lockStage === 'LOCKED') {
    base.promotedBy = promotedBy;
    if (isPromotedBy(promotedBy)) {
      base.promotedAt = now;
      base.promotedRegime = regime || null;
    }
  }
  stampWalletConsensus(base, v8Scoring, side, sport, stars || 0, promotedBy, pickDate);
  return base;
}

async function syncSpreadPickToFirebase({ date, sport, gameKey, away, home, commenceTime, side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, walletProfile, regime, qualityProxy, v8Scoring }) {
  try {
    const PREGAME_BUFFER_MS = 5 * 60 * 1000;
    const docId = `${date}_${sport}_${gameKey}_spread`;
    if (!commenceTime || Date.now() >= commenceTime - PREGAME_BUFFER_MS) {
      return { docId, action: 'no_change' };
    }
    const contribTier = classifyContributionTier(v8Scoring, side);
    // V8.6 — sync layer enforces SHADOW floor only (see syncPickToFirebase).
    const minInv = minInvestedFloorShadow(contribTier);
    if ((totalInvested || 0) < minInv) {
      console.warn(`[syncSpreadPickToFirebase] REJECTED ${docId}: totalInvested $${totalInvested} < $${minInv} shadow minimum (contribTier=${contribTier})`);
      return { docId, action: 'no_change' };
    }
    const ref = doc(db, 'sharpFlowSpreads', docId);
    const existing = await getDoc(ref);

    if (!existing.exists()) {
      const sideData = buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, walletProfile, regime, qualityProxy, v8Scoring, sport, date);
      await setDoc(ref, {
        date, sport, gameKey, away, home, commenceTime: commenceTime || null,
        marketType: 'spread', lockType: 'PREGAME',
        sides: { [side]: sideData },
        status: 'PENDING',
        result: { awayScore: null, homeScore: null, winner: null },
        source: 'ui_card_sync', createdAt: Date.now(),
      });
      return { docId, action: 'created' };
    }

    const data = existing.data();
    if (data.status === 'COMPLETED') return { docId, action: 'no_change' };
    const sides = data.sides || {};
    const pickDate = data.date || date;

    if (sides[side]) {
      if (sides[side].status === 'COMPLETED') return { docId, action: 'no_change' };
      const needsCsPatch = consensusStrength?.moneyPct != null && sides[side].lock?.consensusStrength?.moneyPct == null;
      const currentPeak = sides[side].peak?.units || 0;
      const currentPeakStars = sides[side].peak?.stars || 0;
      // AGS-Unified v9 sizing — `units` is pre-sized by agsuUnitsFromAgs;
      // we only mute FADE-tier picks to 0u and floor at 0u for safety.
      const decision = decideLockStage(regime, v8Scoring, side, sport, stars || 0, pickDate);
      const isMuted = decision.lockTier === 'FADE';
      const bumpedUnits = isMuted ? 0 : Math.max(units, 0);
      const peakShouldWrite = isMuted || bumpedUnits > currentPeak || stars > currentPeakStars;
      if (peakShouldWrite) {
        // v12 cleanup: units / unitTier / stars are cron-authoritative.
        // See ML branch above for full rationale.
        const peakData = { odds, book, pinnacleOdds, line, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, consensusStrength, updatedAt: Date.now() };
        if (walletProfile) peakData.walletProfile = walletProfile;
        if (regime) peakData.regime = regime;
        if (qualityProxy != null) peakData.qualityProxy = qualityProxy;
        if (v8Scoring) peakData.v8Scoring = v8Scoring;
        const mergeObj = { sides: { [side]: { peak: peakData } }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: 'peak_updated' };
        if (needsCsPatch) mergeObj.sides[side].lock = { ...sides[side].lock, consensusStrength };
        mergeObj.sides[side].contribTier = decision.contribTier || null;
        mergeObj.sides[side].lockStageV9 = decision.stage;
        mergeObj.sides[side].lockTierV9 = decision.lockTier || null;
        stampWalletConsensus(mergeObj.sides[side], v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        await setDoc(ref, mergeObj, { merge: true });
        return { docId, action: 'peak_updated' };
      }
      {
        if (sides[side].lockStage === 'SHADOW' && decision.stage === 'LOCKED') {
          // No-op — cron will handle promotion based on v12 score > 0.
        }
      }
      if (needsCsPatch) {
        const patch = { lock: { consensusStrength }, peak: { ...sides[side].peak, consensusStrength } };
        if (needsConsensusRestamp(sides[side])) {
          stampWalletConsensus(patch, v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        }
        await setDoc(ref, { sides: { [side]: patch }, lastWriteAt: Date.now() }, { merge: true });
        return { docId, action: 'cs_patched' };
      }
      // Phase 2 backfill (spreads).
      if (needsConsensusRestamp(sides[side])) {
        const patch = {};
        stampWalletConsensus(patch, v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        if (Object.keys(patch).length) {
          await setDoc(ref, { sides: { [side]: patch }, lastWriteAt: Date.now(), lastAction: 'consensus_backfill' }, { merge: true });
          return { docId, action: 'consensus_backfill' };
        }
      }
      // v5.4: drift-restamp ALL non-superseded sides (spreads).
      const restamp = await restampDriftedSides({ ref, sides, currentSideKey: side, sport, regime, v8Scoring, currentStars: stars || 0, pickDate, lastSyncAt: data.lastSyncAt || data.lastWriteAt || 0 });
      if (restamp) return { docId, action: 'consensus_drift_restamp' };
      return { docId, action: 'no_change' };
    }

    // ─── new-side branch (spreads) ───
    const existingSides = Object.entries(sides);
    const existingBestStars = existingSides.reduce((max, [, sd]) => {
      const s = sd.peak?.stars || sd.lock?.stars || 0;
      return s > max ? s : max;
    }, 0);

    // v5.4: refresh existing side stamps even if we don't create the new side.
    await restampDriftedSides({ ref, sides, currentSideKey: side, sport, regime, v8Scoring, currentStars: stars || 0, pickDate, lastSyncAt: data.lastSyncAt || data.lastWriteAt || 0 });

    // v5.4: whitelist-promotion override on side creation gate.
    const newSideDecision = decideLockStage(regime, v8Scoring, side, sport, stars || 0, pickDate);
    const newSideHasWhitelistPromo =
      newSideDecision.stage === 'LOCKED' && isPromotedBy(newSideDecision.promotedBy);

    if (stars <= existingBestStars && !newSideHasWhitelistPromo) {
      const originalSide = existingSides.find(([, sd]) => sd.lock && !sd.superseded)?.[0];
      return { docId, action: 'no_change', originalSide };
    }
    const sideData = buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, walletProfile, regime, qualityProxy, v8Scoring, sport, pickDate);
    const action = newSideHasWhitelistPromo && stars <= existingBestStars ? 'side_added_whitelist' : 'side_added';
    const mergePayload = { sides: { [side]: sideData }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: action };
    for (const [existingSide] of existingSides) {
      mergePayload.sides[existingSide] = { ...mergePayload.sides[existingSide], superseded: true, supersededAt: Date.now() };
    }
    await setDoc(ref, mergePayload, { merge: true });
    return { docId, action };
  } catch (err) {
    console.warn('Failed to sync spread pick:', err.message);
    return { docId: `${date}_${sport}_${gameKey}_spread`, action: 'error' };
  }
}

async function syncTotalPickToFirebase({ date, sport, gameKey, away, home, commenceTime, side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, walletProfile, regime, qualityProxy, v8Scoring }) {
  try {
    const PREGAME_BUFFER_MS = 5 * 60 * 1000;
    const docId = `${date}_${sport}_${gameKey}_total`;
    if (!commenceTime || Date.now() >= commenceTime - PREGAME_BUFFER_MS) {
      return { docId, action: 'no_change' };
    }
    const contribTier = classifyContributionTier(v8Scoring, side);
    // V8.6 — sync layer enforces SHADOW floor only (see syncPickToFirebase).
    const minInv = minInvestedFloorShadow(contribTier);
    if ((totalInvested || 0) < minInv) {
      console.warn(`[syncTotalPickToFirebase] REJECTED ${docId}: totalInvested $${totalInvested} < $${minInv} shadow minimum (contribTier=${contribTier})`);
      return { docId, action: 'no_change' };
    }
    const ref = doc(db, 'sharpFlowTotals', docId);
    const existing = await getDoc(ref);

    if (!existing.exists()) {
      const sideData = buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, walletProfile, regime, qualityProxy, v8Scoring, sport, date);
      await setDoc(ref, {
        date, sport, gameKey, away, home, commenceTime: commenceTime || null,
        marketType: 'total', lockType: 'PREGAME',
        sides: { [side]: sideData },
        status: 'PENDING',
        result: { awayScore: null, homeScore: null, winner: null },
        source: 'ui_card_sync', createdAt: Date.now(),
      });
      return { docId, action: 'created' };
    }

    const data = existing.data();
    if (data.status === 'COMPLETED') return { docId, action: 'no_change' };
    const sides = data.sides || {};
    const pickDate = data.date || date;

    if (sides[side]) {
      if (sides[side].status === 'COMPLETED') return { docId, action: 'no_change' };
      const needsCsPatch = consensusStrength?.moneyPct != null && sides[side].lock?.consensusStrength?.moneyPct == null;
      const currentPeak = sides[side].peak?.units || 0;
      const currentPeakStars = sides[side].peak?.stars || 0;
      // AGS-Unified v9 sizing — `units` is pre-sized by agsuUnitsFromAgs;
      // we only mute FADE-tier picks to 0u and floor at 0u for safety.
      const decision = decideLockStage(regime, v8Scoring, side, sport, stars || 0, pickDate);
      const isMuted = decision.lockTier === 'FADE';
      const bumpedUnits = isMuted ? 0 : Math.max(units, 0);
      const peakShouldWrite = isMuted || bumpedUnits > currentPeak || stars > currentPeakStars;
      if (peakShouldWrite) {
        // v12 cleanup: units / unitTier / stars are cron-authoritative.
        // See ML branch above for full rationale.
        const peakData = { odds, book, pinnacleOdds, line, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, consensusStrength, updatedAt: Date.now() };
        if (walletProfile) peakData.walletProfile = walletProfile;
        if (regime) peakData.regime = regime;
        if (qualityProxy != null) peakData.qualityProxy = qualityProxy;
        if (v8Scoring) peakData.v8Scoring = v8Scoring;
        const mergeObj = { sides: { [side]: { peak: peakData } }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: 'peak_updated' };
        if (needsCsPatch) mergeObj.sides[side].lock = { ...sides[side].lock, consensusStrength };
        mergeObj.sides[side].contribTier = decision.contribTier || null;
        mergeObj.sides[side].lockStageV9 = decision.stage;
        mergeObj.sides[side].lockTierV9 = decision.lockTier || null;
        stampWalletConsensus(mergeObj.sides[side], v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        await setDoc(ref, mergeObj, { merge: true });
        return { docId, action: 'peak_updated' };
      }
      {
        // v12 cleanup: SHADOW→LOCKED promotion is cron-authoritative now.
        if (sides[side].lockStage === 'SHADOW' && decision.stage === 'LOCKED') {
          // No-op — cron will handle promotion based on v12 score > 0.
        }
      }
      if (needsCsPatch) {
        const patch = { lock: { consensusStrength }, peak: { ...sides[side].peak, consensusStrength } };
        if (needsConsensusRestamp(sides[side])) {
          stampWalletConsensus(patch, v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        }
        await setDoc(ref, { sides: { [side]: patch }, lastWriteAt: Date.now() }, { merge: true });
        return { docId, action: 'cs_patched' };
      }
      // Phase 2 backfill (totals).
      if (needsConsensusRestamp(sides[side])) {
        const patch = {};
        stampWalletConsensus(patch, v8Scoring, side, sport, stars || 0, decision.promotedBy, pickDate);
        if (Object.keys(patch).length) {
          await setDoc(ref, { sides: { [side]: patch }, lastWriteAt: Date.now(), lastAction: 'consensus_backfill' }, { merge: true });
          return { docId, action: 'consensus_backfill' };
        }
      }
      // v5.4: drift-restamp ALL non-superseded sides (totals).
      const restamp = await restampDriftedSides({ ref, sides, currentSideKey: side, sport, regime, v8Scoring, currentStars: stars || 0, pickDate, lastSyncAt: data.lastSyncAt || data.lastWriteAt || 0 });
      if (restamp) return { docId, action: 'consensus_drift_restamp' };
      return { docId, action: 'no_change' };
    }

    // ─── new-side branch (totals) ───
    const existingSides = Object.entries(sides);
    const existingBestStars = existingSides.reduce((max, [, sd]) => {
      const s = sd.peak?.stars || sd.lock?.stars || 0;
      return s > max ? s : max;
    }, 0);

    // v5.4: refresh existing side stamps even if we don't create the new side.
    await restampDriftedSides({ ref, sides, currentSideKey: side, sport, regime, v8Scoring, currentStars: stars || 0, pickDate, lastSyncAt: data.lastSyncAt || data.lastWriteAt || 0 });

    // v5.4: whitelist-promotion override on side creation gate.
    const newSideDecision = decideLockStage(regime, v8Scoring, side, sport, stars || 0, pickDate);
    const newSideHasWhitelistPromo =
      newSideDecision.stage === 'LOCKED' && isPromotedBy(newSideDecision.promotedBy);

    if (stars <= existingBestStars && !newSideHasWhitelistPromo) {
      const originalSide = existingSides.find(([, sd]) => sd.lock && !sd.superseded)?.[0];
      return { docId, action: 'no_change', originalSide };
    }
    const sideData = buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, walletProfile, regime, qualityProxy, v8Scoring, sport, pickDate);
    const action = newSideHasWhitelistPromo && stars <= existingBestStars ? 'side_added_whitelist' : 'side_added';
    const mergePayload = { sides: { [side]: sideData }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: action };
    for (const [existingSide] of existingSides) {
      mergePayload.sides[existingSide] = { ...mergePayload.sides[existingSide], superseded: true, supersededAt: Date.now() };
    }
    await setDoc(ref, mergePayload, { merge: true });
    return { docId, action };
  } catch (err) {
    console.warn('Failed to sync total pick:', err.message);
    return { docId: `${date}_${sport}_${gameKey}_total`, action: 'error' };
  }
}

async function loadLockedPicks() {
  try {
    const today = todayET();
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const dateFilter = [today, yesterday];

    const [mlSnap, spreadSnap, totalSnap] = await Promise.all([
      getDocs(query(collection(db, 'sharpFlowPicks'), where('date', 'in', dateFilter))),
      getDocs(query(collection(db, 'sharpFlowSpreads'), where('date', 'in', dateFilter))),
      getDocs(query(collection(db, 'sharpFlowTotals'), where('date', 'in', dateFilter))),
    ]);

    const picks = {};
    mlSnap.forEach(d => { picks[d.id] = { ...d.data(), marketType: 'ml' }; });
    spreadSnap.forEach(d => { picks[d.id] = { ...d.data(), marketType: 'spread' }; });
    totalSnap.forEach(d => { picks[d.id] = { ...d.data(), marketType: 'total' }; });

    const ids = Object.keys(picks);
    for (const id of ids) {
      const data = picks[id];
      if (!data.sport || !data.gameKey) continue;
      const canonicalId = `${data.date}_${data.sport}_${data.gameKey}`;
      const legacyId = `${data.date}_${data.gameKey}`;
      if (id === legacyId && picks[canonicalId]) {
        delete picks[legacyId];
      }
    }
    return picks;
  } catch (err) {
    console.warn('Failed to load locked picks:', err.message);
    return {};
  }
}

function tallySides(snap) {
  let wins = 0, losses = 0, pushes = 0, totalProfit = 0, totalUnits = 0;
  snap.forEach(d => {
    const data = d.data();
    if (data.sides) {
      for (const sideData of Object.values(data.sides)) {
        if (sideData.status !== 'COMPLETED') continue;
        // v5.6: MUTED plays are excluded from totals exactly like CANCELLED — a
        // muted play is one we explicitly told the user to stand down on (health
        // signal degraded post-lock), so its outcome must not pollute win-rate,
        // ROI, or PnL graphs. Cards keep showing the muted state post-grade for
        // historical context (see LockedPickCard isMuted gate).
        if (sideData.superseded || sideData.health?.status === 'CANCELLED' || sideData.health?.status === 'MUTED' || sideData.lockStage === 'SHADOW') continue;
        // LEAN / 0u tracking plays grade as displays-only — they NEVER bet
        // money. Exclude from W-L-P record, ROI, totalUnits, totalProfit.
        // The result.tracked flag (set by the Cloud Function grader v2)
        // is the canonical signal; legacy graded picks fall back to the
        // unit/lockStage/v8 tier signals so they retroactively get the
        // same treatment.
        // AGS-U v9: prefer the cron-stamped finalUnits for tally math (it's
        // the canonical staking unit the grader booked PnL against). Fall
        // back to peak/lock for legacy docs. Tracked-only is the grader's
        // explicit result.tracked flag — NOT a tier-based proxy, since v9
        // LEAN ships at non-zero units.
        const u = sideData.finalUnits
          ?? sideData.v8_agsUnitsApplied
          ?? sideData.peak?.units
          ?? sideData.lock?.units
          ?? 0;
        const isTrackedOnly = sideData.result?.tracked === true;
        if (isTrackedOnly) continue;
        totalUnits += u;
        const profit = sideData.result?.profit ?? 0;
        if (sideData.result?.outcome === 'WIN') { wins++; totalProfit += profit; }
        else if (sideData.result?.outcome === 'LOSS') { losses++; totalProfit += profit; }
        else if (sideData.result?.outcome === 'PUSH') { pushes++; }
      }
    } else {
      if (data.status !== 'COMPLETED') return;
      const u = data.units ?? 0;
      if (!u) return;
      totalUnits += u;
      const profit = data.result?.profit ?? 0;
      if (data.result?.outcome === 'WIN') { wins++; totalProfit += profit; }
      else if (data.result?.outcome === 'LOSS') { losses++; totalProfit += profit; }
      else if (data.result?.outcome === 'PUSH') { pushes++; }
    }
  });
  return { wins, losses, pushes, totalProfit: +totalProfit.toFixed(2), totalUnits, record: `${wins}-${losses}${pushes > 0 ? `-${pushes}` : ''}` };
}

function estimateStarsFromSnap(snap) {
  if (!snap) return 3;
  const mp = snap.consensusStrength?.moneyPct ?? 65;
  const sc = snap.sharpCount || 0;
  const inv = snap.totalInvested || 0;
  const avgBet = sc > 0 ? inv / sc : 0;
  const cSharp = mp != null ? Math.max(0, 100 - mp) : 20;
  const pinnConf = !!snap.criteria?.pinnacleConfirms;
  const lineWith = !!snap.criteria?.lineMovingWith;
  const ev = snap.evEdge || 0;

  const avgBet_w = v7Winsorize(avgBet, V7_STATS.avgBet.lo, V7_STATS.avgBet.hi);
  const invested_w = v7Winsorize(inv, V7_STATS.invested.lo, V7_STATS.invested.hi);
  const moneyPct_z = v7Z(mp, V7_STATS.moneyPct.mean, V7_STATS.moneyPct.std);
  const avgBet_z = v7Z(avgBet_w, V7_STATS.avgBet.mean, V7_STATS.avgBet.std);
  const invested_z = v7Z(invested_w, V7_STATS.invested.mean, V7_STATS.invested.std);
  const counterSharp_z = v7Z(cSharp, V7_STATS.counter.mean, V7_STATS.counter.std);
  const sharpCount_z = v7Z(Math.min(sc, 6), V7_STATS.sharpCount.mean, V7_STATS.sharpCount.std);
  const qp = v7QualityProxy({ moneyPct: mp, sharpCount: sc, avgBet, counterSharp: cSharp, pinnConfirms: pinnConf, lineMovingWith: lineWith, evEdge: ev, sport: null, odds: snap.odds });
  const qp_z = v7Z(qp, V7_STATS.qp.mean, V7_STATS.qp.std);
  const contras = v7Contradictions({ moneyPct: mp, counterSharp: cSharp, sharpCount: sc, evEdge: ev, qp });
  const pinnCond = (pinnConf && qp >= 0) ? 1 : 0;
  const evCond = (ev > 0 && qp >= 0) ? 1 : 0;
  const raw = 3.0 * moneyPct_z + 1.5 * avgBet_z + 1.2 * invested_z + 1.0 * qp_z
    + 0.8 * sharpCount_z + 0.6 * pinnCond + 0.4 * evCond
    - 2.5 * counterSharp_z - 1.5 * v7Z(snap.consensusStrength?.walletPct ?? 60, V7_STATS.walletPct.mean, V7_STATS.walletPct.std)
    - 2.0 * contras;
  const t = V7_STATS.thresholds;
  let stars = raw < t.p15 ? 1 : raw < t.p30 ? 2 : raw < t.p50 ? 2.5
            : raw < t.p75 ? 3 : raw < t.p87 ? 3.5 : raw < t.p93 ? 4
            : raw < t.p97 ? 4.5 : 5;
  if (stars >= 5 && (qp < 1 || contras >= 2)) stars = 4.5;
  if (stars >= 4.5 && contras >= 2) stars = Math.min(stars, 4);
  return stars;
}

async function loadAllTimePnL() {
  try {
    // v17 — picks now carry AGS-U context (v8_ags, v8_agsTier,
    // v8_agsComponents, team labels, lock odds) so the new AGS-U
    // Performance Dashboard can render a per-pick ledger with tier
    // badge, AGS-U value, dominant feature, and proper sport/market
    // filtering without an extra Firestore read. v16 byAgsTier
    // tier counters (wins/losses/pushes/pending/tracked + roi) are
    // preserved unchanged so the existing Locked-Picks-Today tier
    // scorecard keeps working.
    const cacheKey = 'sharpFlow_pnl_v18';
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < 30 * 60 * 1000 && data.picks) return data;
    }
    const [mlSnap, spreadSnap, totalSnap] = await Promise.all([
      getDocs(collection(db, 'sharpFlowPicks')),
      getDocs(collection(db, 'sharpFlowSpreads')),
      getDocs(collection(db, 'sharpFlowTotals')),
    ]);
    const allDocs = [];
    mlSnap.forEach(d => allDocs.push({ ...d.data(), _marketType: 'ml' }));
    spreadSnap.forEach(d => allDocs.push({ ...d.data(), _marketType: 'spread' }));
    totalSnap.forEach(d => allDocs.push({ ...d.data(), _marketType: 'total' }));
    const combinedDocs = { docs: mlSnap.docs, forEach(fn) { allDocs.forEach(item => fn({ data: () => item })); } };
    const overall = tallySides(combinedDocs);
    const snap = combinedDocs;

    const byStars = {};
    const picks = [];
    // AGS-U tier scorecard, populated only from picks on/after AGS_U_CUTOVER.
    // `live` rolls picks that actually shipped real money (units > 0,
    // not tracked-only) into W-L / ROI / PnL totals. `tracked` rolls
    // intentionally-tracked-only picks (FADE / 0u, or pre-AGS-U-grader
    // tracked LEAN's) into a parallel record-keeping bucket so the
    // headline numbers stay clean but volume is visible.
    const emptyTierBucket = () => ({
      // Graded counts (W+L+P). `totalPicks` stays as the "all shipped
      // live" sum (graded + pending) for back-compat, but the UI now
      // reads `wins+losses+pushes` for the headline N so the record
      // can never visually disagree with the count.
      wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0,
      totalPicks: 0, pendingPicks: 0,
      trackedPicks: 0, trackedWins: 0, trackedLosses: 0,
    });
    const byAgsTier = {
      ELITE:   emptyTierBucket(),
      PREMIUM: emptyTierBucket(),
      LOCK:    emptyTierBucket(),
      LEAN:    emptyTierBucket(),
      WEAK:    emptyTierBucket(),
      FADE:    emptyTierBucket(),
    };
    const starBucket = (s) => s >= 4.5 ? 5 : s >= 3.5 ? 4 : s >= 2.5 ? 3 : s >= 1.5 ? 2 : 1;
    const emptyBucket = () => ({ wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0, totalPicks: 0, label: '' });
    const STARS_LIVE_DATE = '2026-04-06';
    snap.forEach(d => {
      const data = d.data();
      const mt = data._marketType || data.marketType || 'ml';
      const isPostDeploy = data.date >= STARS_LIVE_DATE;
      const isPostAgsuCutover = (data.date || '') >= AGS_U_CUTOVER;
      const processSide = (sd) => {
        // v5.6: treat MUTED the same as CANCELLED for tallying purposes — both
        // mean "the live signal told us to stand down before tip", so the graded
        // outcome should not count toward record / ROI / PnL graphs. The pick
        // is still pushed into `picks` with cancelled=true so individual cards
        // still render the muted styling and the historical outcome.
        // LEAN / 0u tracking plays get the same treatment — they were
        // explicitly tracked-only and never bet, so they don't pollute PnL.
        // AGS-U v9: tracked iff grader stamped result.tracked === true. Tier
        // is no longer a proxy (LEAN ships 0.5× under v9).
        const u = sd.finalUnits
          ?? sd.v8_agsUnitsApplied
          ?? sd.peak?.units
          ?? sd.lock?.units
          ?? 0;
        const isTrackedOnly = sd.result?.tracked === true;
        const isCancelled = !!(sd.superseded || sd.health?.status === 'CANCELLED' || sd.health?.status === 'MUTED' || sd.lockStage === 'SHADOW' || isTrackedOnly);
        const bestSnap = sd.peak || sd.lock;
        const lockSnap = sd.lock || bestSnap;
        const s = bestSnap?.stars ?? estimateStarsFromSnap(bestSnap);
        const key = starBucket(s);
        if (!byStars[key]) byStars[key] = emptyBucket();
        if (!isCancelled) byStars[key].totalPicks++;
        if (sd.status === 'COMPLETED' && !isCancelled) {
          byStars[key].totalUnits += u;
          if (sd.result?.outcome === 'WIN') { byStars[key].wins++; byStars[key].totalProfit += (sd.result?.profit || 0); }
          else if (sd.result?.outcome === 'LOSS') { byStars[key].losses++; byStars[key].totalProfit -= u; }
          else if (sd.result?.outcome === 'PUSH') { byStars[key].pushes++; }
        }

        // ─── AGS-U tier scorecard (post-cutover only) ─────────────
        // Mirrors the dashboard / daily report's "live vs tracked"
        // split exactly: live = real money shipped (units > 0, not
        // grader-tracked-only); tracked = 0u/tracked plays kept
        // separate so the headline tier ROI doesn't get diluted by
        // intentionally-tracked picks.
        if (isPostAgsuCutover) {
          // v12-first: graded picks won't have v12 (only v11 was stamped
          // at grade time) — fall through to v8_agsTier. Live picks now
          // have v12 stamped by the cron and we want analytics to bucket
          // them under their v12 tier (PREMIUM/LOCK/etc.) not the stale v11.
          const cronTier = (typeof sd.v8_agsV12Tier === 'string' && sd.v8_agsV12Tier !== 'UNKNOWN')
            ? sd.v8_agsV12Tier
            : (typeof sd.v8_agsTier === 'string' && sd.v8_agsTier !== 'UNKNOWN')
              ? sd.v8_agsTier
              : (typeof sd.v8_lockTier === 'string' ? sd.v8_lockTier : null);
          if (cronTier && byAgsTier[cronTier]) {
            const tierBucket = byAgsTier[cronTier];
            const shippedLive = u > 0 && !isTrackedOnly && !isCancelled;
            if (shippedLive || isTrackedOnly) {
              if (shippedLive) tierBucket.totalPicks++;
              else tierBucket.trackedPicks++;
              if (sd.status === 'COMPLETED') {
                const outcome = sd.result?.outcome;
                if (shippedLive) {
                  tierBucket.totalUnits += u;
                  if (outcome === 'WIN')      { tierBucket.wins++;   tierBucket.totalProfit += (sd.result?.profit || 0); }
                  else if (outcome === 'LOSS'){ tierBucket.losses++; tierBucket.totalProfit -= u; }
                  else if (outcome === 'PUSH'){ tierBucket.pushes++; }
                } else {
                  if (outcome === 'WIN')      tierBucket.trackedWins++;
                  else if (outcome === 'LOSS') tierBucket.trackedLosses++;
                }
              } else if (shippedLive) {
                // Pending / not yet graded — kept separate so the
                // headline tier record is always pure W-L-P arithmetic.
                tierBucket.pendingPicks++;
              }
            }
          }
        }
        const pickStars = isPostDeploy ? (bestSnap?.stars ?? 0) : s;
        // Include any pick with a stamped stake tier even if its snapshot stars
        // are low — v12abc SHARP/MINI rescues are staked off proven money, not
        // the (often WEAK) score, so the stars gate would otherwise hide them
        // and the Tier Performance wouldn't match the AGS-U report.
        if (pickStars >= 2.5 || typeof sd.v8_hcStakeTier === 'string') {
          const lkStars = lockSnap?.stars ?? 0;
          const lkEV = lockSnap?.evEdge ?? null;
          const pkEV = bestSnap?.evEdge ?? null;
          const regime = bestSnap?.regime || lockSnap?.regime || null;
          // v14 — carry the V7.2+ stamped TOP PICK / lock-tier fields so
          // the Performance dashboard's "Top Pick" filter can match the
          // production badge logic instead of the legacy starDelta proxy.
          // Pre-v7.1 docs have these undefined and the filter falls back
          // to the legacy rule for backward compatibility.
          const pick = {
            date: data.date, sport: data.sport || 'NHL', marketType: mt,
            stars: pickStars, lockStars: lkStars, lockEV: lkEV, peakEV: pkEV,
            units: u, status: sd.status || 'PENDING', outcome: null, profit: 0,
            clv: null, cancelled: isCancelled, tracked: isTrackedOnly, regime,
            v8_topPick: sd.v8_topPick,
            v8_superTopPick: sd.v8_superTopPick,
            v8_lockTier: sd.v8_lockTier,
            v8_systemVersion: sd.v8_systemVersion,
            // v17 — AGS-U context for the new Performance Dashboard ledger.
            // null-safe; pre-cutover picks won't have these and the ledger
            // filters them out via the AGS_U_CUTOVER date guard.
            v8_ags: Number.isFinite(sd.v8_ags) ? sd.v8_ags : null,
            v8_agsTier: typeof sd.v8_agsTier === 'string' ? sd.v8_agsTier : null,
            v8_agsComponents: sd.v8_agsComponents || null,
            // v12abc — carry the stamped stake tier (the staking PATH) + v12
            // score so the Tier Performance scoreboard can bucket picks into the
            // 5 display tiers and MATCH the AGS-U daily report.
            v8_hcStakeTier: typeof sd.v8_hcStakeTier === 'string' ? sd.v8_hcStakeTier : null,
            v8_agsV12: Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null,
            v8_agsV12Tier: typeof sd.v8_agsV12Tier === 'string' ? sd.v8_agsV12Tier : null,
            team: sd.team || null,
            away: data.away || null,
            home: data.home || null,
            oddsLock: Number.isFinite(sd.lock?.odds) ? sd.lock.odds
                    : Number.isFinite(sd.peak?.odds) ? sd.peak.odds
                    : null,
          };
          if (sd.status === 'COMPLETED') {
            pick.outcome = sd.result?.outcome || null;
            // Tracked-only LEAN picks always grade at 0u PnL regardless of W/L.
            if (isTrackedOnly) { pick.profit = 0; }
            else if (sd.result?.outcome === 'WIN') { pick.profit = sd.result?.profit || 0; }
            else if (sd.result?.outcome === 'LOSS') { pick.profit = -u; }
            if (sd.result?.clv != null) pick.clv = sd.result.clv;
          }
          picks.push(pick);
        }
      };
      if (data.sides) {
        for (const sd of Object.values(data.sides)) processSide(sd);
      } else {
        const s = data.stars ?? estimateStarsFromSnap(data);
        const key = starBucket(s);
        if (!byStars[key]) byStars[key] = emptyBucket();
        byStars[key].totalPicks++;
        const u = data.units || 1;
        if (data.status === 'COMPLETED') {
          byStars[key].totalUnits += u;
          if (data.result?.outcome === 'WIN') { byStars[key].wins++; byStars[key].totalProfit += (data.result?.profit || 0); }
          else if (data.result?.outcome === 'LOSS') { byStars[key].losses++; byStars[key].totalProfit -= u; }
          else if (data.result?.outcome === 'PUSH') { byStars[key].pushes++; }
        }
        const pickStars = isPostDeploy ? (data.stars ?? 0) : s;
        if (pickStars >= 2.5) {
          const pick = { date: data.date, sport: data.sport || 'NHL', marketType: mt, stars: pickStars, units: u, status: data.status || 'PENDING', outcome: null, profit: 0 };
          if (data.status === 'COMPLETED') {
            pick.outcome = data.result?.outcome || null;
            if (data.result?.outcome === 'WIN') { pick.profit = data.result?.profit || 0; }
            else if (data.result?.outcome === 'LOSS') { pick.profit = -u; }
          }
          picks.push(pick);
        }
      }
    });

    for (const v of Object.values(byStars)) {
      v.totalProfit = +v.totalProfit.toFixed(2);
      v.record = `${v.wins}-${v.losses}${v.pushes > 0 ? `-${v.pushes}` : ''}`;
      v.roi = v.totalUnits > 0 ? +((v.totalProfit / v.totalUnits) * 100).toFixed(1) : 0;
    }

    for (const v of Object.values(byAgsTier)) {
      v.totalProfit = +v.totalProfit.toFixed(2);
      v.gradedPicks = v.wins + v.losses + v.pushes;
      v.record = `${v.wins}-${v.losses}${v.pushes > 0 ? `-${v.pushes}` : ''}`;
      v.roi = v.totalUnits > 0 ? +((v.totalProfit / v.totalUnits) * 100).toFixed(1) : 0;
      v.trackedRecord = `${v.trackedWins}-${v.trackedLosses}`;
    }
    const agsTierMeta = { since: AGS_U_CUTOVER };

    const result = { pregame: overall, all: overall, byStars, byAgsTier, agsTierMeta, picks };
    try { sessionStorage.setItem(cacheKey, JSON.stringify({ data: result, ts: Date.now() })); } catch {}
    return result;
  } catch (err) {
    console.warn('Failed to load all-time P&L:', err.message);
    const empty = { wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0, record: '0-0' };
    return { pregame: { ...empty }, all: { ...empty }, byStars: {} };
  }
}

// ─── User Watchlist ───────────────────────────────────────────────────────────

async function loadUserPicks(uid) {
  if (!uid) return {};
  try {
    const date = todayET();
    const ref = doc(db, 'user_sharp_actions', `${uid}_${date}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().picks || {}) : {};
  } catch (err) {
    console.warn('Failed to load user picks:', err.message);
    return {};
  }
}

async function toggleUserPick(uid, date, gameKey, pickData) {
  if (!uid) return;
  const docRef = doc(db, 'user_sharp_actions', `${uid}_${date}`);
  if (pickData) {
    await setDoc(docRef, { userId: uid, date, picks: { [gameKey]: { ...pickData, addedAt: Date.now() } } }, { merge: true });
  } else {
    await setDoc(docRef, { picks: { [gameKey]: deleteField() } }, { merge: true });
  }
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

// QUALIFIED-WALLET FILTER (2026-05-03) — Sharp Intel cards display ONLY
// positions/dollars belonging to whitelisted wallets (CONFIRMED + FLAT
// per sport, the same set that drives the dw lock math). The whitelist
// graduated from a small experimental list to a large enough roster
// that the user wants every visible aggregate (sharp count, $ totals,
// money-split %, P&L sums, wallet detail list, card sort order, and
// the consensus-side determination itself) restricted to it. Wallets
// outside the whitelist (WR50 — losing track record in this sport, or
// untracked) get dropped here so nothing downstream sees them.
//
// Applied once at the JSON-load layer. Re-aggregates summary so the
// money-split bars, totals, and consensus side reflect the filtered set.
// Games with zero qualifying positions get dropped entirely (no card).
//
// Side-effect on lock math: dq (qualityForT30 − qualityAgT30) was
// computed from "any T30+ contributor regardless of whitelist tier"
// inside computeWalletConsensus. After this filter, dq counts only
// "T30+ contributor AND whitelisted" — a slight tightening. forW/agW,
// HC margin, hcDominant are unaffected (they already filtered to
// whitelisted/CONFIRMED wallets only).
const SHARP_INTEL_SPORTS = new Set(['NHL', 'CBB', 'MLB', 'NBA', 'NFL', 'SOC']);
function filterToQualifiedWallets(rawData, profilesMap) {
  if (!rawData) return null;
  if (!profilesMap || profilesMap.size === 0) return null;
  const out = {};
  for (const [k, v] of Object.entries(rawData)) {
    // Pass-through non-sport keys (scannedAt, walletsScanned, mmExcluded, etc.)
    if (!SHARP_INTEL_SPORTS.has(k)) {
      out[k] = v;
      continue;
    }
    const sport = k;
    if (typeof v !== 'object' || v === null) {
      out[k] = v;
      continue;
    }
    const filteredSport = {};
    for (const [gameKey, gd] of Object.entries(v)) {
      if (!gd || typeof gd !== 'object' || !Array.isArray(gd.positions)) continue;
      const positions = gd.positions.filter(p => {
        const short = String(p?.wallet || '').slice(-6).toLowerCase();
        if (!short) return false;
        const profile = profilesMap.get(short);
        const tier = profile?.bySport?.[sport]?.whitelistTier;
        return tier === 'CONFIRMED' || tier === 'FLAT';
      });
      if (positions.length === 0) continue;
      // Re-aggregate summary from the filtered positions so the money
      // bars, totals, and consensus side all reflect the qualified set.
      // Detect total-market (sides over/under) vs ML/spread (away/home).
      const isTotal = positions.some(p => p.side === 'over' || p.side === 'under');
      let summary;
      if (isTotal) {
        summary = { sharpOver: 0, sharpUnder: 0, overInvested: 0, underInvested: 0 };
        for (const p of positions) {
          const inv = p.invested || 0;
          if (p.side === 'over') { summary.sharpOver++; summary.overInvested += inv; }
          else if (p.side === 'under') { summary.sharpUnder++; summary.underInvested += inv; }
        }
        summary.consensus = summary.overInvested > summary.underInvested ? 'over'
                          : summary.underInvested > summary.overInvested ? 'under'
                          : null;
        summary.totalInvested = summary.overInvested + summary.underInvested;
      } else {
        summary = { sharpAway: 0, sharpHome: 0, awayInvested: 0, homeInvested: 0 };
        if (sport === 'SOC') { summary.sharpDraw = 0; summary.drawInvested = 0; }
        for (const p of positions) {
          const inv = p.invested || 0;
          if (p.side === 'away') { summary.sharpAway++; summary.awayInvested += inv; }
          else if (p.side === 'home') { summary.sharpHome++; summary.homeInvested += inv; }
          else if (p.side === 'draw') {
            summary.sharpDraw = (summary.sharpDraw || 0) + 1;
            summary.drawInvested = (summary.drawInvested || 0) + inv;
          }
        }
        // 3-way aware (drawInvested is 0/absent outside SOC)
        const dInv = summary.drawInvested || 0;
        summary.consensus = (summary.awayInvested > summary.homeInvested && summary.awayInvested > dInv) ? 'away'
                          : (summary.homeInvested > summary.awayInvested && summary.homeInvested > dInv) ? 'home'
                          : (dInv > summary.awayInvested && dInv > summary.homeInvested) ? 'draw'
                          : null;
        summary.totalInvested = summary.awayInvested + summary.homeInvested + dInv;
      }
      filteredSport[gameKey] = { ...gd, positions, summary };
    }
    out[sport] = filteredSport;
  }
  return out;
}

function useMarketData() {
  const [polyData, setPolyData] = useState(null);
  const [kalshiData, setKalshiData] = useState(null);
  const [whaleProfiles, setWhaleProfiles] = useState(null);
  const [pinnacleHistory, setPinnacleHistory] = useState(null);
  const [sharpPositions, setSharpPositions] = useState(null);
  const [spreadPositions, setSpreadPositions] = useState(null);
  const [totalPositions, setTotalPositions] = useState(null);
  const [sportsSharps, setSportsSharps] = useState(null);
  const [intelExcludedWallets, setIntelExcludedWallets] = useState(null);
  const [walletProfiles, setWalletProfiles] = useState(null); // Map<walletShort, profile>
  const [loading, setLoading] = useState(true);

  // v6.3 live refresh — the fetch-polymarket.yml workflow ships a new
  // scanSharpPositions snapshot every ~8 min. Without a poller, open
  // tabs would sit on stale Sharp Intel until the user reloaded. We
  // refetch all market-JSON sources every 8 min; the 5 position/market
  // streams that actually drive Sharp Intel get a fresh snapshot, while
  // slow-moving sources (whale_profiles, sports_sharps) ride along
  // cheaply. Refresh pauses when the tab is hidden to save bandwidth.
  useEffect(() => {
    let cancelled = false;

    const loadAll = async ({ initial = false } = {}) => {
      const cb = `?t=${Date.now()}`;
      try {
        const [p, k, wp, ph, sp, ss, sprP, totP, excl] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}polymarket_data.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}kalshi_data.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}whale_profiles.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}pinnacle_history.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}sharp_positions.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}sports_sharps.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}sharp_spread_positions.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}sharp_total_positions.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${import.meta.env.BASE_URL}sharp_intel_excluded_wallets.json${cb}`).then(r => r.ok ? r.json() : null).catch(() => null),
        ]);
        if (cancelled) return;
        if (p)    setPolyData(p);
        if (k)    setKalshiData(k);
        if (wp)   setWhaleProfiles(wp);
        if (ph)   setPinnacleHistory(ph);
        if (sp)   setSharpPositions(sp);
        if (ss)   setSportsSharps(ss);
        if (sprP) setSpreadPositions(sprP);
        if (totP) setTotalPositions(totP);
        if (excl) setIntelExcludedWallets(excl);
        if (initial) setLoading(false);
        if (!initial && sp) {
          const scannedAt = sp?.scannedAt ? new Date(sp.scannedAt).toISOString() : '—';
          console.log(`[SharpFlow] live refresh @ ${new Date().toISOString()} (scan@${scannedAt})`);
        }
      } catch (err) {
        if (initial) setLoading(false);
        console.warn('[SharpFlow] live refresh failed:', err?.message || err);
      }
    };

    loadAll({ initial: true });

    const REFRESH_MS = 8 * 60 * 1000;
    let timer = null;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => {
        if (document.visibilityState === 'visible') loadAll({ initial: false });
      }, REFRESH_MS);
    };
    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadAll({ initial: false });
        start();
      } else {
        stop();
      }
    };
    start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Phase 2: fetch sharpWalletProfiles and populate the module-level cache
  // so computeWalletConsensus / getWalletProfile can resolve whitelist
  // tiers synchronously. Keyed by walletShort (doc id).
  //
  // v7.4 — refresh on the same 8-min cadence as the position JSONs (was
  // once per session). The whitelist tier promotions/demotions land via
  // the daily wallet-classifier cron, so a tab open through that boundary
  // would see stale tiers and either count a freshly-CONFIRMED sharp
  // wrong or keep counting a demoted one. Reload on visibilitychange too
  // so tab-back-after-an-hour doesn't render stale lock decisions.
  //
  // Also fetches the AGS calibration doc on the same cadence so the
  // displayed AGS values track the daily-refreshed normalizers.
  useEffect(() => {
    let cancelled = false;
    const loadProfiles = async () => {
      try {
        const snap = await getDocs(collection(db, 'sharpWalletProfiles'));
        if (cancelled) return;
        const m = new Map();
        snap.forEach(d => { m.set(d.id, d.data()); });
        setWalletProfiles(m);
        setWalletProfilesCache(m);
        console.log(`[walletProfiles] Loaded ${m.size} profiles into Phase-2 cache`);
      } catch (err) {
        console.warn('[walletProfiles] fetch failed:', err.message);
      }
      // AGS calibration — small, fetched alongside profiles; falls back to
      // hardcoded last-known-good if Firestore is unreachable.
      try {
        const calSnap = await getDoc(doc(db, 'agsCalibration', 'current'));
        if (cancelled) return;
        if (calSnap.exists()) {
          const cal = calSnap.data();
          if (cal && cal.normalizers) {
            setAgsCalibrationCache({ ...cal, source: cal.source || 'firestore' });
            console.log(`[agsCalibration] Loaded — sampleSize=${cal.sampleSize ?? '?'} computedAt=${cal.computedAt ?? '?'}`);
          }
        } else {
          setAgsCalibrationCache(AGS_FALLBACK_CALIBRATION);
          console.log('[agsCalibration] doc missing, using fallback calibration');
        }
      } catch (err) {
        console.warn('[agsCalibration] fetch failed, using fallback:', err.message);
        setAgsCalibrationCache(AGS_FALLBACK_CALIBRATION);
      }
    };
    loadProfiles();
    const REFRESH_MS = 8 * 60 * 1000;
    let timer = null;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => {
        if (document.visibilityState === 'visible') loadProfiles();
      }, REFRESH_MS);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { loadProfiles(); start(); }
      else stop();
    };
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Apply qualified-wallet filter ONCE here so every downstream
  // consumer (cards, sharpStats, vault convergences, locked-list
  // builders) sees the same filtered view. Returns null until both
  // the position JSON and walletProfiles cache are loaded; existing
  // null-safe access patterns throughout the consumer handle that.
  const qualifiedSharpPositions = useMemo(
    () => filterToQualifiedWallets(sharpPositions, walletProfiles),
    [sharpPositions, walletProfiles]
  );
  const qualifiedSpreadPositions = useMemo(
    () => filterToQualifiedWallets(spreadPositions, walletProfiles),
    [spreadPositions, walletProfiles]
  );
  const qualifiedTotalPositions = useMemo(
    () => filterToQualifiedWallets(totalPositions, walletProfiles),
    [totalPositions, walletProfiles]
  );

  return {
    polyData, kalshiData, whaleProfiles, pinnacleHistory,
    sharpPositions: qualifiedSharpPositions,
    spreadPositions: qualifiedSpreadPositions,
    totalPositions: qualifiedTotalPositions,
    sportsSharps, intelExcludedWallets, walletProfiles, loading,
  };
}

function buildGameData(polyData, kalshiData) {
  const games = [];

  const processSport = (sport) => {
    const polyGames = polyData?.[sport] || {};
    const kalshiGames = kalshiData?.[sport] || {};
    const allKeys = new Set([...Object.keys(polyGames), ...Object.keys(kalshiGames)]);

    for (const key of allKeys) {
      const poly = polyGames[key];
      const kalshi = kalshiGames[key];

      const awayProb = poly?.awayProb ?? kalshi?.awayProb ?? null;
      const homeProb = poly?.homeProb ?? kalshi?.homeProb ?? null;
      // 3-way (soccer): draw is a third priced outcome on the same game
      const drawProb = poly?.drawProb ?? null;
      const polyVol = poly?.volume24h || 0;
      const kalshiVol = kalshi?.volume24h || 0;
      const volume = polyVol + kalshiVol;

      const polyFlow = poly || {};
      const kalshiFlow = kalshi?.tradeFlow || {};
      const polyTrades = poly?.tradeCount || 0;
      const polyCash = poly?.sampleCash || 0;
      const kTrades = kalshiFlow?.tradeCount || 0;
      const kCash = kalshiFlow?.sampleCash || 0;
      const totalTrades = polyTrades + kTrades;
      const totalCash = polyCash + kCash;

      // 3-way (soccer): home% is NOT the complement of away% (draw holds the
      // remainder), so use Polymarket's per-side percentages directly.
      const isThreeWay = sport === 'SOC';
      const awayTicketPct = isThreeWay ? (polyFlow.awayTicketPct || 0) : totalTrades > 0
        ? Number(((((polyFlow.awayTicketPct || 0) / 100 * polyTrades) + ((kalshiFlow.awayTicketPct || 0) / 100 * kTrades)) / totalTrades * 100).toFixed(1))
        : polyFlow.awayTicketPct || kalshiFlow.awayTicketPct || 0;
      const homeTicketPct = isThreeWay ? (polyFlow.homeTicketPct || 0) : totalTrades > 0 ? Number((100 - awayTicketPct).toFixed(1)) : polyFlow.homeTicketPct || kalshiFlow.homeTicketPct || 0;
      const awayMoneyPct = isThreeWay ? (polyFlow.awayMoneyPct || 0) : totalCash > 0
        ? Number(((((polyFlow.awayMoneyPct || 0) / 100 * polyCash) + ((kalshiFlow.awayMoneyPct || 0) / 100 * kCash)) / totalCash * 100).toFixed(1))
        : polyFlow.awayMoneyPct || kalshiFlow.awayMoneyPct || 0;
      const homeMoneyPct = isThreeWay ? (polyFlow.homeMoneyPct || 0) : totalCash > 0 ? Number((100 - awayMoneyPct).toFixed(1)) : polyFlow.homeMoneyPct || kalshiFlow.homeMoneyPct || 0;

      const away = poly?.awayTeam || key.split('_')[0]?.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase()) || '';
      const home = poly?.homeTeam || key.split('_').slice(1).join('_')?.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase()) || '';

      const polyWhales = poly?.whales?.topTrades || [];
      const kalshiWhales = kalshi?.whales?.topTrades || [];
      const whaleCount = (poly?.whales?.count || 0) + (kalshi?.whales?.count || 0);
      const whaleCash = (poly?.whales?.totalCash || 0) + (kalshi?.whales?.totalCash || 0);

      const allWhales = [
        ...polyWhales.map(t => ({ ...t, source: 'Polymarket', sport, away, home })),
        ...kalshiWhales.map(t => ({ ...t, source: 'Kalshi', sport, away, home })),
      ].sort((a, b) => b.amount - a.amount);

      // Price movement
      const polyHistory = poly?.priceHistory;
      const kalshiHistory = kalshi?.priceHistory;
      const priceChange = polyHistory?.change ?? kalshiHistory?.change ?? null;
      const priceOpen = polyHistory?.open ?? kalshiHistory?.open ?? null;
      const priceCurrent = polyHistory?.current ?? kalshiHistory?.current ?? null;

      // Whale direction analysis
      let whaleBuyAway = 0, whaleBuyHome = 0, whaleSellAway = 0, whaleSellHome = 0;
      let whaleCashAway = 0, whaleCashHome = 0;
      for (const w of allWhales) {
        const side = resolveOutcomeSide(w.outcome, away, home);
        // SOC: Draw whales and unattributed No-side trades carry no
        // away/home direction — exclude from the 2-way whale tally.
        if (sport === 'SOC' && side === null) continue;
        const isAway = side === 'away';
        if (w.side === 'BUY') {
          if (isAway) { whaleBuyAway++; whaleCashAway += w.amount; }
          else { whaleBuyHome++; whaleCashHome += w.amount; }
        } else {
          if (isAway) whaleSellAway++;
          else whaleSellHome++;
        }
      }
      const whaleDirection = whaleCashAway > whaleCashHome ? 'away' : whaleCashHome > whaleCashAway ? 'home' : null;

      const ticketDivergence = Math.abs(awayTicketPct - awayMoneyPct);

      // Most recent trade timestamp (for "Starting Soon" sort — active games bubble up)
      const latestTradeTs = allWhales.length > 0
        ? Math.max(...allWhales.map(w => w.ts || 0))
        : 0;

      // Price move is tracked on the away team's price
      // Positive = away team's odds improving, Negative = away team's odds dropping (home improving)
      const priceMovedTeam = priceChange > 0 ? away : priceChange < 0 ? home : null;

      // Spread and total market data (Polymarket + Kalshi)
      const polySpread = poly?.polySpread || null;
      const polyTotal = poly?.polyTotal || null;
      const kalshiSpreads = kalshi?.spreads || null;
      const kalshiTotals = kalshi?.totals || null;

      games.push({
        key, sport, away, home, awayProb, homeProb, drawProb, volume,
        awayTicketPct, homeTicketPct, awayMoneyPct, homeMoneyPct,
        drawMoneyPct: poly?.drawMoneyPct ?? null,
        drawTicketPct: poly?.drawTicketPct ?? null,
        totalTrades, totalCash, whaleCount, whaleCash,
        allWhales, ticketDivergence,
        priceChange, priceOpen, priceCurrent, priceMovedTeam,
        whaleDirection, whaleCashAway, whaleCashHome,
        whaleBuyAway, whaleBuyHome,
        polyVol, kalshiVol, latestTradeTs,
        polySpread, polyTotal, kalshiSpreads, kalshiTotals,
      });
    }
  };

  processSport('CBB');
  processSport('NHL');
  processSport('MLB');
  processSport('NBA');
  processSport('SOC');

  games.sort((a, b) => b.volume - a.volume);
  return games;
}

// ─── Reusable UI Pieces ───────────────────────────────────────────────────────

function FlowBar({ leftPct, rightPct, leftLabel, rightLabel, leftColor, rightColor, height = 14 }) {
  const leftWins = leftPct >= rightPct;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ ...T.micro, color: leftWins ? B.text : B.textMuted }}>
          {leftLabel} {leftPct}%
        </span>
        <span style={{ ...T.micro, color: !leftWins ? B.text : B.textMuted }}>
          {rightPct}% {rightLabel}
        </span>
      </div>
      <div style={{
        display: 'flex', height, borderRadius: '6px', overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)', gap: '2px',
      }}>
        {leftPct > 0 && <div style={{
          width: `${leftPct}%`, borderRadius: '6px 0 0 6px',
          background: leftWins
            ? `linear-gradient(90deg, ${leftColor || B.blue}, ${leftColor || '#60A5FA'})`
            : `${leftColor || B.blue}30`,
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        }} />}
        {rightPct > 0 && <div style={{
          width: `${rightPct}%`, borderRadius: '0 6px 6px 0',
          background: !leftWins
            ? `linear-gradient(90deg, ${rightColor || B.green}, ${rightColor || '#34D399'})`
            : `${rightColor || B.green}30`,
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        }} />}
      </div>
    </div>
  );
}

function PriceArrow({ change }) {
  if (change == null || change === 0) return <Minus size={12} color={B.textMuted} />;
  return change > 0
    ? <ArrowUpRight size={14} color={B.green} />
    : <ArrowDownRight size={14} color={B.red} />;
}

function Badge({ children, color, bg }) {
  return (
    <span style={{
      ...T.tiny, padding: '0.15rem 0.45rem', borderRadius: '5px',
      color, background: bg, display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
    }}>{children}</span>
  );
}

function SharpFlowInfo({ isMobile }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: isMobile ? '22px' : '24px', height: isMobile ? '22px' : '24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.06) 100%)',
          border: '1px solid rgba(251,191,36,0.25)', cursor: 'pointer',
          transition: 'all 0.2s ease', padding: 0,
        }}
        aria-label="How Sharp Flow works"
      >
        <span style={{ fontSize: isMobile ? '0.75rem' : '0.813rem', fontWeight: 700, color: 'rgba(251,191,36,0.85)' }}>?</span>
      </button>

      {isOpen && (
        <>
          {isMobile && <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 }} />}
          <div style={{
            position: isMobile ? 'fixed' : 'absolute', zIndex: 999,
            top: isMobile ? '50%' : '100%', left: isMobile ? '50%' : 'auto', right: isMobile ? 'auto' : 0,
            transform: isMobile ? 'translate(-50%,-50%)' : 'none', marginTop: isMobile ? 0 : '10px',
            width: isMobile ? 'calc(100vw - 48px)' : '340px', maxWidth: '380px',
            padding: isMobile ? '1.25rem' : '1rem',
            background: 'linear-gradient(145deg, rgba(15,23,42,0.99) 0%, rgba(30,41,59,0.99) 100%)',
            border: '1px solid rgba(251,191,36,0.2)', borderRadius: '14px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(251,191,36,0.95)' }}>How Sharp Flow Works</span>
              </div>
              {isMobile && <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem' }}>★</span>
                  <span style={{ fontSize: '0.813rem', fontWeight: 700, color: B.gold }}>Conviction Star Rating</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                  Every play is scored using a <strong style={{ color: B.gold }}>proprietary weighted signal model</strong> that evaluates multiple dimensions of sharp activity, market pricing, and directional momentum. The result is a 0.5–5.0 conviction rating that captures the full strength of the signal.
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <Lock size={12} color={B.green} />
                  <span style={{ fontSize: '0.813rem', fontWeight: 700, color: B.green }}>Locking & Unit Sizing</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                  Plays that exceed our <strong style={{ color: B.green }}>conviction threshold</strong> are automatically locked and tracked with dynamically sized units. Higher-rated plays receive larger positions. Built-in safeguards penalize thin volume and split consensus before a play can lock.
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <Eye size={12} color="#60A5FA" />
                  <span style={{ fontSize: '0.813rem', fontWeight: 700, color: '#60A5FA' }}>Game Cards</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                  Each card shows the <strong style={{ color: '#60A5FA' }}>full sharp money picture</strong> — both sides of the action, real-time line movement, market pricing, best available odds, and a signal checklist. All positions are verified from public on-chain and exchange data.
                </p>
              </div>

              <div style={{
                marginTop: '0.25rem', padding: '0.625rem 0.75rem',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(212,175,55,0.06) 100%)',
                border: `1px solid rgba(16,185,129,0.15)`, borderRadius: '8px',
              }}>
                <p style={{ fontSize: '0.688rem', color: 'rgba(148,163,184,0.95)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                  Every locked play is graded after the game. Performance is tracked by conviction tier to validate the model. <span style={{ color: B.green }}>The star rating drives every decision</span> — what you see is what powers the recommendation.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SectionHead({ title, subtitle, icon: Icon, style: overrideStyle }) {
  return (
    <div style={{ marginBottom: '0.875rem', ...overrideStyle }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
        {Icon && <Icon size={16} color={B.gold} style={{ opacity: 0.7 }} />}
        <h2 style={{ ...T.sub, color: B.text, margin: 0 }}>{title}</h2>
      </div>
      {subtitle && (
        <p style={{ ...T.micro, color: B.textMuted, margin: '0.15rem 0 0 0', paddingLeft: Icon ? '1.5rem' : 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function MetricPill({ label, value, accent }) {
  return (
    <div>
      <div style={{ ...T.micro, color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{
        ...T.caption, fontWeight: 700, fontFeatureSettings: "'tnum'",
        color: accent ? B.gold : B.textSec,
      }}>
        {value}
      </div>
    </div>
  );
}

function WhaleTradeRow({ trade, whaleProfiles }) {
  const time = fmtTime(trade.ts);
  const ti = tierInfo(trade.amount);
  const addr = trade.wallet ? trade.wallet.toLowerCase() : null;
  const profile = addr && whaleProfiles ? whaleProfiles[addr] : null;
  const addrShort = addr ? `...${addr.slice(-4)}` : null;
  const tierColors = {
    ELITE: { color: B.gold, bg: B.goldDim },
    PROVEN: { color: B.green, bg: B.greenDim },
    ACTIVE: { color: B.sky, bg: B.blueDim },
    DEGEN: { color: B.red, bg: B.redDim },
    LOSING: { color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  };
  const tc = profile ? tierColors[profile.tier] : null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.4rem 0.6rem', borderRadius: '6px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${B.borderSubtle}`,
      flexWrap: 'wrap',
    }}>
      <Badge
        color={trade.side === 'BUY' ? B.green : B.red}
        bg={trade.side === 'BUY' ? B.greenDim : B.redDim}
      >{trade.side}</Badge>
      <span style={{
        ...T.caption, fontWeight: 800, fontFeatureSettings: "'tnum'",
        color: ti?.color || B.text, minWidth: '55px',
      }}>
        {fmtVol(trade.amount)}
      </span>
      {ti && <Badge color={ti.color} bg={ti.bg}>{ti.label}</Badge>}
      <span style={{ ...T.caption, color: B.text, flex: 1 }}>
        {trade.outcome || '—'}
      </span>
      {addrShort && (
        <span style={{
          ...T.micro, color: B.textMuted,
          padding: '0.1rem 0.3rem', borderRadius: '3px',
          background: 'rgba(255,255,255,0.04)',
          fontFeatureSettings: "'tnum'",
        }}>
          {addrShort}
        </span>
      )}
      {profile && (
        <span style={{
          ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
          color: (profile.totalPnl || 0) >= 0 ? B.green : B.red,
        }}>
          {(profile.totalPnl || 0) >= 0 ? '+' : ''}{fmtVol(profile.totalPnl || 0)}
        </span>
      )}
      {tc && <Badge color={tc.color} bg={tc.bg}>{profile.tier}</Badge>}
      <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
        @{trade.price}¢
      </span>
      <span style={{ ...T.micro, color: B.textSubtle }}>{time.ago}</span>
    </div>
  );
}

// ─── Unified Game Card (every game, premium layout) ───────────────────────────

const GameFlowCard = memo(function GameFlowCard({ game, isMobile, whaleProfiles, pinnacleHistory, polyData }) {
  const [showTrades, setShowTrades] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [marketTab, setMarketTab] = useState('ml');
  const ss = sportStyle(game.sport);
  const awayShort = game.away.split(' ').pop();
  const homeShort = game.home.split(' ').pop();
  const pinnGame = pinnacleHistory?.[game.sport]?.[game.key];
  const allBooks = pinnGame?.allBooks || {};
  const commenceTime = pinnGame?.commence ? new Date(pinnGame.commence).getTime() : null;
  const nowMs = Date.now();
  const MAX_GAME_MS = 6 * 60 * 60 * 1000;
  const isGameLive = commenceTime && nowMs >= commenceTime && (nowMs - commenceTime) < MAX_GAME_MS;
  const gameTimeFormatted = commenceTime
    ? new Date(commenceTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' })
    : null;
  // 3-way (soccer): Draw can be the ticket/money favorite too
  const hasDraw = game.sport === 'SOC' && game.drawMoneyPct != null;
  const drawTicketPctVal = hasDraw ? (game.drawTicketPct || 0) : -1;
  const drawMoneyPctVal = hasDraw ? (game.drawMoneyPct || 0) : -1;
  const ticketFav = (drawTicketPctVal > game.awayTicketPct && drawTicketPctVal > game.homeTicketPct) ? 'draw'
    : game.awayTicketPct >= game.homeTicketPct ? 'away' : 'home';
  const moneyFav = (drawMoneyPctVal > game.awayMoneyPct && drawMoneyPctVal > game.homeMoneyPct) ? 'draw'
    : game.awayMoneyPct >= game.homeMoneyPct ? 'away' : 'home';
  const isReverse = ticketFav !== moneyFav && game.ticketDivergence >= 10;
  const hasDivergence = game.ticketDivergence >= 10;
  const moneyTeam = moneyFav === 'draw' ? 'Draw' : moneyFav === 'away' ? awayShort : homeShort;
  const moneyPct = moneyFav === 'draw' ? drawMoneyPctVal : moneyFav === 'away' ? game.awayMoneyPct : game.homeMoneyPct;
  const ticketPctOnMoneySide = moneyFav === 'draw' ? Math.max(drawTicketPctVal, 0) : moneyFav === 'away' ? game.awayTicketPct : game.homeTicketPct;

  const pinnAway = pinnGame?.current?.away;
  const pinnHome = pinnGame?.current?.home;
  const openAway = pinnGame?.opener?.away;
  const openHome = pinnGame?.opener?.home;
  const bestAwayOdds = pinnGame?.bestAway;
  const bestHomeOdds = pinnGame?.bestHome;
  const bestAwayBook = pinnGame?.bestAwayBook;
  const bestHomeBook = pinnGame?.bestHomeBook;
  const pinnAwayProb = impliedProb(pinnAway);
  const pinnHomeProb = impliedProb(pinnHome);
  const bestAwayProb = impliedProb(bestAwayOdds);
  const bestHomeProb = impliedProb(bestHomeOdds);
  const evAway = (pinnAwayProb && bestAwayProb) ? +((pinnAwayProb - bestAwayProb) * 100).toFixed(1) : null;
  const evHome = (pinnHomeProb && bestHomeProb) ? +((pinnHomeProb - bestHomeProb) * 100).toFixed(1) : null;
  const pinnMoveDir = pinnGame?.movement?.direction;
  const bookEntries = Object.entries(allBooks).filter(([k]) => k !== 'pinnacle');

  const maxEV = Math.max(evAway || 0, evHome || 0);
  const evSide = (evAway || 0) >= (evHome || 0) ? 'away' : 'home';
  const evTeamShort = evSide === 'away' ? awayShort : homeShort;
  const evBook = evSide === 'away' ? bestAwayBook : bestHomeBook;
  const evVal = evSide === 'away' ? evAway : evHome;
  const bestOddsOnMoneySide = moneyFav === 'away' ? bestAwayOdds : bestHomeOdds;
  const bestBookOnMoneySide = moneyFav === 'away' ? bestAwayBook : bestHomeBook;
  const pinnOnMoneySide = moneyFav === 'away' ? pinnAway : pinnHome;
  const pinnProbOnMoneySide = moneyFav === 'away' ? pinnAwayProb : pinnHomeProb;
  const evOnMoneySide = moneyFav === 'away' ? evAway : evHome;

  const pinnConfirms = pinnMoveDir && pinnMoveDir === moneyFav;
  const whaleAligned = game.whaleCount >= 3 && game.whaleDirection === moneyFav;

  const polyGame = polyData?.[game.sport]?.[game.key];
  const polyPoints = polyGame?.priceHistory?.points || [];
  const pinnHistory = pinnGame?.history || [];
  const pinnConsensusPoints = pinnHistory.map(h => moneyFav === 'away' ? h.away : h.home);

  const criteria = [
    { label: 'Reverse Line Move', met: isReverse },
    { label: '+EV Edge', met: maxEV > 0 },
    { label: 'Pinnacle Confirms', met: !!pinnConfirms },
    { label: 'Whale Consensus', met: !!whaleAligned },
    { label: 'High Volume', met: game.totalCash >= 500000 },
  ];
  const criteriaMet = criteria.filter(c => c.met).length;

  const accentColor = criteriaMet >= 3 ? B.green : isReverse ? B.gold : hasDivergence ? B.green : null;
  const accentBorder = criteriaMet >= 3 ? 'rgba(16,185,129,0.35)' : isReverse ? B.goldBorder : hasDivergence ? 'rgba(16,185,129,0.25)' : B.border;

  const awayCash = game.totalCash * (game.awayMoneyPct / 100);
  const homeCash = game.totalCash * (game.homeMoneyPct / 100);
  const drawCash = hasDraw ? game.totalCash * ((game.drawMoneyPct || 0) / 100) : 0;
  const awayWhales = game.whaleBuyAway || 0;
  const homeWhales = game.whaleBuyHome || 0;

  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${accentBorder}`,
    }}>
      <div style={{
        height: '3px',
        background: accentColor
          ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
          : `linear-gradient(90deg, transparent, ${B.border}, transparent)`,
      }} />

      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.75rem 1rem 0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', minWidth: 0 }}>
          <Badge color={ss.color} bg={ss.bg}>{ss.icon} {game.sport}</Badge>
          <span style={{ ...T.body, fontWeight: 700, color: B.text }}>
            {game.away} <span style={{ color: B.textMuted, fontWeight: 400 }}>vs</span> {game.home}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
          {(gameTimeFormatted || isGameLive) && (
            <span style={{
              ...T.micro, fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '5px',
              fontFeatureSettings: "'tnum'",
              ...(isGameLive ? {
                color: '#fff', background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              } : {
                color: B.textSec, background: 'rgba(255,255,255,0.04)',
              }),
            }}>
              {isGameLive ? '● LIVE' : `${gameTimeFormatted} ET`}
            </span>
          )}
          {hasDivergence && (
            <span style={{
              ...T.micro, fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '5px',
              color: B.gold, background: B.goldDim, border: `1px solid ${B.goldBorder}`,
            }}>
              {game.ticketDivergence.toFixed(0)}pt SPLIT
            </span>
          )}
          {isReverse && (
            <span style={{
              ...T.micro, fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '5px',
              color: '#fff', background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              border: '1px solid rgba(239,68,68,0.4)',
            }}>
              RLM
            </span>
          )}
        </div>
      </div>

      {/* ── Market Direction (hero section) ── */}
      <div style={{
        margin: '0 0.75rem 0.5rem', padding: '0.75rem',
        borderRadius: '10px',
        background: criteriaMet >= 3
          ? 'linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.02) 100%)'
          : isReverse
            ? 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)'
            : `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`,
        border: `1px solid ${criteriaMet >= 3 ? 'rgba(16,185,129,0.25)' : isReverse ? B.goldBorder : B.borderSubtle}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: '0.375rem',
        }}>
          <span style={{ ...T.micro, fontWeight: 800, color: criteriaMet >= 3 ? B.green : isReverse ? B.gold : B.textSec, letterSpacing: '0.06em' }}>
            MARKET DIRECTION
          </span>
          <span style={{
            ...T.micro, fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '5px',
            color: criteriaMet >= 3 ? '#fff' : criteriaMet >= 2 ? B.gold : B.textMuted,
            background: criteriaMet >= 3 ? 'linear-gradient(135deg, #10B981, #059669)' : criteriaMet >= 2 ? B.goldDim : 'rgba(255,255,255,0.04)',
            border: `1px solid ${criteriaMet >= 3 ? 'rgba(16,185,129,0.4)' : criteriaMet >= 2 ? B.goldBorder : B.border}`,
            fontSize: '0.6rem',
          }}>
            {criteriaMet}/5
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: B.text, letterSpacing: '-0.01em' }}>
            {moneyFav === 'draw' ? 'Draw' : `${moneyTeam} ML`}
          </span>
          {pinnOnMoneySide != null && (
            <span style={{ ...T.caption, fontWeight: 700, color: B.gold, fontFeatureSettings: "'tnum'" }}>
              {fmtOdds(pinnOnMoneySide)}
            </span>
          )}
          {pinnProbOnMoneySide != null && (
            <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
              ({(pinnProbOnMoneySide * 100).toFixed(1)}%)
            </span>
          )}
        </div>
        <div style={{ ...T.micro, color: B.textSec, lineHeight: 1.4, marginBottom: '0.5rem' }}>
          {moneyPct.toFixed(1)}% of {fmtVol(game.totalCash)} on {moneyTeam}
          {isReverse ? ` despite only ${ticketPctOnMoneySide.toFixed(1)}% of tickets` : ''}
        </div>
        {bestOddsOnMoneySide != null && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.375rem 0.5rem', borderRadius: '6px',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${B.borderSubtle}`,
          }}>
            <div>
              <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem' }}>BEST PRICE</div>
              <div style={{ ...T.sub, fontWeight: 800, color: B.text, fontFeatureSettings: "'tnum'" }}>
                {fmtOdds(bestOddsOnMoneySide)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem' }}>{bestBookOnMoneySide || 'Best Book'}</div>
              {evOnMoneySide != null && evOnMoneySide > 0 && (
                <div style={{ ...T.micro, fontWeight: 800, color: evOnMoneySide >= 3 ? B.green : '#A3E635' }}>
                  +{evOnMoneySide}% EV
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Signal Checklist ── */}
      {criteriaMet > 0 && (
        <div style={{
          margin: '0 0.75rem 0.5rem', padding: '0.5rem 0.625rem',
          borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${B.borderSubtle}`,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.375rem',
          }}>
            <span style={{ ...T.micro, fontWeight: 700, color: criteriaMet >= 3 ? B.green : B.textSec, letterSpacing: '0.06em', fontSize: '0.575rem' }}>
              {criteriaMet >= 4 ? 'STRONG ALIGNMENT' : criteriaMet >= 3 ? 'SIGNALS ALIGNED' : 'SIGNAL CHECK'}
            </span>
            <span style={{ ...T.micro, color: B.textMuted }}>{criteriaMet}/5</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 0.5rem' }}>
            {criteria.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {c.met
                  ? <CheckCircle size={11} color={B.green} />
                  : <Circle size={11} color='rgba(255,255,255,0.12)' />}
                <span style={{ ...T.micro, fontSize: '0.575rem', color: c.met ? B.green : B.textMuted, fontWeight: c.met ? 600 : 400 }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Market Tab Strip ── */}
      {(() => {
        const hasSpread = !!(pinnGame?.spreadCurrent || game?.polySpread || (game?.kalshiSpreads?.length > 0));
        const hasTotal = !!(pinnGame?.totalCurrent || game?.polyTotal || (game?.kalshiTotals?.length > 0));
        if (!hasSpread && !hasTotal) return null;
        return <MarketTabStrip active={marketTab} onChange={setMarketTab} hasSpread={hasSpread} hasTotal={hasTotal} spreadLocked={false} totalLocked={false} />;
      })()}

      {marketTab === 'spread' && (
        <div style={{ margin: '0.375rem 0.75rem 0.5rem' }}>
          <SpreadPanel pinnGame={pinnGame} game={game} isMobile={isMobile} />
        </div>
      )}
      {marketTab === 'total' && (
        <div style={{ margin: '0.375rem 0.75rem 0.5rem' }}>
          <TotalPanel pinnGame={pinnGame} game={game} isMobile={isMobile} />
        </div>
      )}

      {marketTab === 'ml' && <>
      {/* ── Side-by-side flow comparison ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: hasDraw ? '1fr 1fr 1fr' : '1fr auto 1fr',
        margin: '0 0.75rem 0.5rem', gap: hasDraw ? '0.375rem' : 0,
      }}>
        {[
          { side: 'away', team: awayShort, ticketPct: game.awayTicketPct, moneyPct: game.awayMoneyPct, cash: awayCash, whales: awayWhales },
          hasDraw
            ? { side: 'draw', team: 'Draw', ticketPct: Math.max(drawTicketPctVal, 0), moneyPct: Math.max(drawMoneyPctVal, 0), cash: drawCash, whales: 0 }
            : null,
          { side: 'home', team: homeShort, ticketPct: game.homeTicketPct, moneyPct: game.homeMoneyPct, cash: homeCash, whales: homeWhales },
        ].map((item, idx) => {
          if (!item) return (
            <div key="vs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ ...T.micro, color: B.textMuted, fontWeight: 600 }}>vs</span>
            </div>
          );
          const isMoneySide = item.side === moneyFav;
          return (
            <div key={item.side} style={{
              padding: '0.5rem',
              borderRadius: '8px',
              background: isMoneySide
                ? 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 100%)'
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isMoneySide ? B.goldBorder : B.borderSubtle}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <span style={{ ...T.caption, fontWeight: 800, color: isMoneySide ? B.text : B.textSec }}>
                  {item.team}
                </span>
                {isMoneySide && (
                  <span style={{
                    ...T.micro, fontSize: '0.5rem', fontWeight: 800, padding: '0.1rem 0.3rem', borderRadius: '3px',
                    color: B.gold, background: B.goldDim, border: `1px solid ${B.goldBorder}`,
                  }}>
                    MONEY SIDE
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...T.micro, fontSize: '0.575rem', color: B.textMuted }}>Tickets</span>
                  <span style={{ ...T.micro, fontSize: '0.575rem', color: B.textSec, fontWeight: 600, fontFeatureSettings: "'tnum'" }}>{item.ticketPct.toFixed(1)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...T.micro, fontSize: '0.575rem', color: isMoneySide ? B.gold : B.textMuted }}>Money</span>
                  <span style={{ ...T.micro, fontSize: '0.575rem', color: isMoneySide ? B.gold : B.textSec, fontWeight: 700, fontFeatureSettings: "'tnum'" }}>{item.moneyPct.toFixed(1)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...T.micro, fontSize: '0.575rem', color: B.textMuted }}>Volume</span>
                  <span style={{ ...T.micro, fontSize: '0.575rem', color: B.textSec, fontFeatureSettings: "'tnum'" }}>{fmtVol(item.cash)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Flow bars (compact) ── */}
      <div style={{ padding: '0 0.75rem 0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{ ...T.micro, fontSize: '0.55rem', color: B.textMuted, minWidth: '38px' }}>TICKETS</span>
          <div style={{ flex: 1 }}>
            <FlowBar leftPct={game.awayTicketPct} rightPct={game.homeTicketPct} leftLabel={awayShort} rightLabel={homeShort} height={12} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
          <span style={{ ...T.micro, fontSize: '0.55rem', color: B.gold, minWidth: '38px' }}>MONEY</span>
          <div style={{ flex: 1 }}>
            <FlowBar leftPct={game.awayMoneyPct} rightPct={game.homeMoneyPct} leftLabel={awayShort} rightLabel={homeShort} leftColor={B.gold} rightColor={B.gold} height={12} />
          </div>
        </div>
      </div>

      {/* ── Pinnacle Fair Value ── */}
      {pinnAway != null && (
        <div style={{
          margin: '0 0.75rem 0.5rem', borderRadius: '8px', overflow: 'hidden',
          border: `1px solid ${B.borderSubtle}`,
        }}>
          <div style={{
            padding: '0.375rem 0.625rem',
            background: 'rgba(212,175,55,0.04)',
            borderBottom: `1px solid ${B.borderSubtle}`,
          }}>
            <span style={{ ...T.micro, fontWeight: 700, color: B.gold, letterSpacing: '0.06em', fontSize: '0.575rem' }}>
              PINNACLE FAIR VALUE
            </span>
          </div>
          <div style={{ padding: '0.5rem 0.625rem', background: 'rgba(255,255,255,0.015)' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem', marginBottom: '0.375rem',
            }}>
              {[
                { team: awayShort, odds: pinnAway, prob: pinnAwayProb, open: openAway, ev: evAway, bestOdds: bestAwayOdds, bestBook: bestAwayBook, side: 'away' },
                { team: homeShort, odds: pinnHome, prob: pinnHomeProb, open: openHome, ev: evHome, bestOdds: bestHomeOdds, bestBook: bestHomeBook, side: 'home' },
              ].map(s => (
                <div key={s.side}>
                  <div style={{ ...T.micro, color: s.side === moneyFav ? B.gold : B.textMuted, fontWeight: 600, marginBottom: '0.15rem' }}>{s.team}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: B.text, fontFeatureSettings: "'tnum'" }}>
                      {fmtOdds(s.odds)}
                    </span>
                    {s.prob != null && (
                      <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                        ({(s.prob * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                  {s.open != null && s.odds !== s.open && (
                    <div style={{ ...T.micro, fontSize: '0.575rem', color: s.odds < s.open ? B.green : B.red, fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
                      Open {fmtOdds(s.open)} → Now {fmtOdds(s.odds)}
                    </div>
                  )}
                  {s.ev != null && s.ev > 0 && (
                    <div style={{ ...T.micro, fontWeight: 800, color: s.ev >= 3 ? B.green : '#A3E635', marginTop: '0.1rem' }}>
                      +{s.ev}% EV <span style={{ fontWeight: 400, color: B.textMuted }}>@ {s.bestBook}</span>
                    </div>
                  )}
                  {s.bestOdds != null && s.bestOdds !== s.odds && (
                    <div style={{ ...T.micro, fontSize: '0.575rem', color: B.textSec, fontFeatureSettings: "'tnum'", marginTop: '0.1rem' }}>
                      Best: {fmtOdds(s.bestOdds)} <span style={{ color: B.textMuted }}>({s.bestBook})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {pinnMoveDir && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                paddingTop: '0.375rem', borderTop: `1px solid ${B.borderSubtle}`,
              }}>
                {pinnConfirms ? <CheckCircle size={11} color={B.green} /> : <Circle size={11} color={B.red} />}
                <span style={{ ...T.micro, fontSize: '0.575rem', fontWeight: 700, color: pinnConfirms ? B.green : B.red }}>
                  {pinnConfirms
                    ? `Pinnacle confirms — line moving toward ${moneyTeam}`
                    : `Pinnacle opposes ${moneyTeam} — line moving toward ${pinnMoveDir === 'away' ? awayShort : homeShort}`}
                </span>
              </div>
            )}
          </div>

          {/* Book prices */}
          {bookEntries.length > 1 && (
            <>
              <button onClick={() => setShowBooks(!showBooks)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                padding: '0.375rem 0.625rem', cursor: 'pointer',
                background: 'none', border: 'none', borderTop: `1px solid ${B.borderSubtle}`,
              }}>
                <span style={{ ...T.micro, fontSize: '0.575rem', color: B.textMuted }}>
                  Book Prices — {moneyTeam} ML
                </span>
                <span style={{ ...T.micro, fontSize: '0.575rem', color: B.gold, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {showBooks ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  {bookEntries.length + 1} books
                </span>
              </button>
              {showBooks && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {[['pinnacle', { name: 'Pinnacle', away: pinnAway, home: pinnHome }], ...bookEntries]
                    .sort(([, a], [, b]) => {
                      const aO = moneyFav === 'away' ? a.away : a.home;
                      const bO = moneyFav === 'away' ? b.away : b.home;
                      return bO - aO;
                    })
                    .map(([key, book]) => {
                      const odds = moneyFav === 'away' ? book.away : book.home;
                      const isBest = odds === bestOddsOnMoneySide && evOnMoneySide > 0;
                      const isPinn = key === 'pinnacle';
                      return (
                        <div key={key} style={{
                          flex: '1 1 auto', minWidth: '65px',
                          padding: '0.375rem 0.5rem',
                          borderRight: `1px solid ${B.borderSubtle}`,
                          borderTop: `1px solid ${B.borderSubtle}`,
                          background: isBest ? B.greenDim : 'transparent',
                        }}>
                          <div style={{ ...T.micro, fontSize: '0.55rem', color: isPinn ? B.gold : B.textMuted, fontWeight: isPinn ? 700 : 400 }}>
                            {book.name}
                          </div>
                          <div style={{ ...T.caption, fontWeight: 700, color: isBest ? B.green : isPinn ? B.gold : B.text, fontFeatureSettings: "'tnum'" }}>
                            {fmtOdds(odds)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Price Movement Sparklines ── */}
      {(pinnConsensusPoints.length >= 2 || polyPoints.length >= 2) && (
        <div style={{
          margin: '0 0.75rem 0.5rem', padding: '0.5rem 0.625rem',
          borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${B.borderSubtle}`,
        }}>
          <div style={{ ...T.micro, fontWeight: 700, color: B.textMuted, letterSpacing: '0.06em', fontSize: '0.575rem', marginBottom: '0.375rem' }}>
            PRICE MOVEMENT
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {pinnConsensusPoints.length >= 2 && (
              <MiniSparkline
                points={pinnConsensusPoints.map(o => impliedProb(o) * 100)}
                label={`Pinnacle — ${moneyTeam} ML`}
                startLabel={fmtOdds(pinnConsensusPoints[0])}
                endLabel={fmtOdds(pinnConsensusPoints[pinnConsensusPoints.length - 1])}
                color={B.gold}
                width={isMobile ? 130 : 140}
                height={32}
              />
            )}
            {polyPoints.length >= 2 && (
              <MiniSparkline
                points={polyPoints}
                label={`Prediction Market — ${awayShort}`}
                startLabel={`${polyPoints[0]}¢`}
                endLabel={`${polyPoints[polyPoints.length - 1]}¢`}
                color={B.green}
                width={isMobile ? 130 : 140}
                height={32}
              />
            )}
          </div>
        </div>
      )}
      </>}

      {/* ── Summary stats strip ── */}
      <div style={{
        display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center',
        padding: '0.25rem 0.75rem 0.5rem',
      }}>
        <span style={{ ...T.micro, fontSize: '0.575rem', fontFeatureSettings: "'tnum'", color: B.textSec, padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(255,255,255,0.04)' }}>
          {fmtVol(game.volume)} vol
        </span>
        <span style={{ ...T.micro, fontSize: '0.575rem', fontFeatureSettings: "'tnum'", color: B.textSec, padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(255,255,255,0.04)' }}>
          {game.totalTrades.toLocaleString()} bets
        </span>
        {game.whaleCount > 0 && (
          <span style={{ ...T.micro, fontSize: '0.575rem', fontFeatureSettings: "'tnum'", color: B.gold, fontWeight: 700, padding: '0.1rem 0.35rem', borderRadius: '4px', background: B.goldDim }}>
            {game.whaleCount} whales · {fmtVol(game.whaleCash)}
          </span>
        )}
        {game.priceChange != null && game.priceChange !== 0 && (
          <span style={{ ...T.micro, fontSize: '0.575rem', fontFeatureSettings: "'tnum'", fontWeight: 700, color: game.priceChange > 0 ? B.green : B.red, padding: '0.1rem 0.35rem', borderRadius: '4px', background: game.priceChange > 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
            {game.priceMovedTeam?.split(' ').pop()} {game.priceChange > 0 ? '↑' : '↓'} {Math.abs(game.priceChange)}¢
          </span>
        )}
      </div>

      {/* ── Whale trades (expandable) ── */}
      {game.allWhales.length > 0 && (
        <div style={{ borderTop: `1px solid ${B.borderSubtle}` }}>
          <button onClick={() => setShowTrades(!showTrades)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.5rem 0.75rem', width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              {showTrades ? <ChevronUp size={12} color={B.gold} /> : <ChevronDown size={12} color={B.gold} />}
              <span style={{ ...T.micro, color: B.gold, fontWeight: 700 }}>
                {game.allWhales.length} WHALE TRADE{game.allWhales.length !== 1 ? 'S' : ''}
              </span>
            </div>
            <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
              {fmtVol(game.whaleCash)} total
            </span>
          </button>
          {showTrades && (
            <div style={{ padding: '0 0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {game.allWhales.slice(0, 10).map((w, i) => (
                <WhaleTradeRow key={`${w.ts}-${i}`} trade={w} whaleProfiles={whaleProfiles} />
              ))}
              {game.allWhales.length > 10 && (
                <div style={{ ...T.micro, color: B.textMuted, textAlign: 'center', padding: '0.25rem' }}>
                  +{game.allWhales.length - 10} more trades
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ─── Top Trade Card (condensed leaderboard card) ──────────────────────────────

function TopTradeChip({ trade, rank }) {
  const ti = tierInfo(trade.amount);
  const time = fmtTime(trade.ts);
  const isRanked = rank >= 0;
  const isTop = rank === 0;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.625rem 0.875rem', borderRadius: '10px',
      background: isTop
        ? `linear-gradient(135deg, rgba(212,175,55,0.10) 0%, ${B.card} 100%)`
        : `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${isTop ? B.goldBorder : B.border}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {isTop && <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
        background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)`,
      }} />}

      {/* Rank or time indicator */}
      <div style={{
        minWidth: isRanked ? '22px' : 'auto', height: '22px', borderRadius: '6px',
        padding: isRanked ? 0 : '0 0.4rem',
        background: isTop ? B.goldDim : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isTop ? B.goldBorder : B.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: isRanked ? '22px' : 'auto',
        ...T.micro, fontWeight: 800, color: isTop ? B.gold : B.textMuted,
        flexShrink: 0,
      }}>
        {isRanked ? rank + 1 : time.ago}
      </div>

      {/* Amount */}
      <div style={{
        ...T.heading, color: B.gold, fontFeatureSettings: "'tnum'", minWidth: '75px',
      }}>
        {fmtVol(trade.amount)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Badge
            color={trade.side === 'BUY' ? B.green : B.red}
            bg={trade.side === 'BUY' ? B.greenDim : B.redDim}
          >{trade.side}</Badge>
          <span style={{ ...T.caption, fontWeight: 700, color: B.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {trade.outcome || '—'}
          </span>
          {ti && <Badge color={ti.color} bg={ti.bg}>{ti.label}</Badge>}
        </div>
        <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.15rem' }}>
          {trade.away} vs {trade.home} · @{trade.price}¢ · {time.ago}
        </div>
      </div>

      {/* Sport */}
      <Badge color={sportStyle(trade.sport).color} bg={sportStyle(trade.sport).bg}>
        {trade.sport}
      </Badge>
    </div>
  );
}

// ─── Money Flow View ──────────────────────────────────────────────────────────

function MoneyFlowView({ games, isMobile }) {
  const [showPositions, setShowPositions] = useState(false);
  const [tradeView, setTradeView] = useState('largest');

  const flowGames = useMemo(() => {
    return [...games]
      .filter(g => g.totalCash > 0)
      .sort((a, b) => b.totalCash - a.totalCash);
  }, [games]);

  const topTrades = useMemo(() => {
    const all = [];
    for (const g of games) {
      for (const w of g.allWhales) all.push(w);
    }
    return all.sort((a, b) => b.amount - a.amount).slice(0, 10);
  }, [games]);

  const recentTrades = useMemo(() => {
    const all = [];
    for (const g of games) {
      for (const w of g.allWhales) all.push(w);
    }
    return all.filter(t => t.ts).sort((a, b) => b.ts - a.ts).slice(0, 10);
  }, [games]);

  if (flowGames.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '3rem', borderRadius: '12px',
        background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
        border: `1px solid ${B.border}`,
      }}>
        <Workflow size={32} color={B.textMuted} style={{ marginBottom: '0.75rem' }} />
        <div style={{ ...T.sub, color: B.text, marginBottom: '0.375rem' }}>No money flow data</div>
        <div style={{ ...T.label, color: B.textSec }}>Switch sports or wait for trading to begin.</div>
      </div>
    );
  }

  const totalMoney = flowGames.reduce((s, g) => s + g.totalCash, 0);
  const maxGameCash = flowGames[0].totalCash;

  // Find the team receiving the most money across all games
  const teamTotals = {};
  for (const g of flowGames) {
    const awayCash = g.totalCash * (g.awayMoneyPct / 100);
    const homeCash = g.totalCash * (g.homeMoneyPct / 100);
    const awayName = g.away.split(' ').pop();
    const homeName = g.home.split(' ').pop();
    teamTotals[awayName] = (teamTotals[awayName] || 0) + awayCash;
    teamTotals[homeName] = (teamTotals[homeName] || 0) + homeCash;
  }
  const topTeam = Object.entries(teamTotals).sort((a, b) => b[1] - a[1])[0];

  // Count reverse signals
  const reverseCount = flowGames.filter(g => {
    const ticketFav = g.awayTicketPct >= g.homeTicketPct ? 'away' : 'home';
    const moneyFav = g.awayMoneyPct >= g.homeMoneyPct ? 'away' : 'home';
    return ticketFav !== moneyFav;
  }).length;

  return (
    <div>
      {/* Explainer */}
      <div style={{
        padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem',
        background: `linear-gradient(135deg, rgba(212,175,55,0.05) 0%, ${B.card} 100%)`,
        border: `1px solid ${B.borderSubtle}`,
      }}>
        <div style={{ ...T.caption, fontWeight: 700, color: B.text, marginBottom: '0.25rem' }}>
          How to read this chart
        </div>
        <div style={{ ...T.micro, color: B.textSec, lineHeight: 1.6 }}>
          Each row is one game, sorted by total money sampled. <span style={{ color: B.gold }}>Gold bars</span> show
          the side receiving more money (sharp side). <span style={{ color: B.textMuted }}>Gray bars</span> show the
          lesser side. Thicker bars = more total money in that game. <span style={{ color: B.gold }}>REVERSE</span> means
          the public is betting one side on tickets but the money is going the other way — a classic sharp signal.
        </div>
      </div>

      {/* Summary header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '0.625rem', marginBottom: '1.5rem',
      }}>
        <FlowStatCard
          icon={DollarSign} label="Sampled Volume" value={fmtVol(totalMoney)} accent={B.gold}
          hint="From individual trades we can analyze by side"
        />
        <FlowStatCard
          icon={BarChart3} label="Games" value={flowGames.length}
          hint="Games with trade-level flow data"
        />
        <FlowStatCard
          icon={TrendingUp} label="Top Destination" value={topTeam ? `${topTeam[0]}` : '—'} accent={B.gold}
          hint={topTeam ? `${fmtVol(topTeam[1])} flowing to this team` : ''}
        />
        <FlowStatCard
          icon={Eye} label="Reverse Signals" value={reverseCount} accent={reverseCount > 0 ? B.gold : null}
          hint="Money & tickets on opposite sides"
        />
      </div>

      {/* Largest Positions (collapsible) */}
      {topTrades.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => setShowPositions(!showPositions)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '0.625rem 0.875rem', borderRadius: '10px',
            cursor: 'pointer', border: `1px solid ${B.borderSubtle}`,
            background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {showPositions ? <ChevronUp size={14} color={B.gold} /> : <ChevronDown size={14} color={B.gold} />}
              <TrendingUp size={14} color={B.gold} style={{ opacity: 0.7 }} />
              <span style={{ ...T.sub, color: B.text, margin: 0 }}>Largest Positions</span>
              <span style={{ ...T.micro, color: B.textMuted }}>
                Top 10 whale trades today
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {showPositions && ['largest', 'recent'].map(key => (
                <span key={key} onClick={e => { e.stopPropagation(); setTradeView(key); }} style={{
                  padding: '0.2rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
                  ...T.micro, fontWeight: 700,
                  border: tradeView === key ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                  background: tradeView === key ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
                  color: tradeView === key ? B.gold : B.textMuted,
                }}>
                  {key === 'largest' ? 'Largest' : 'Most Recent'}
                </span>
              ))}
            </div>
          </button>
          {showPositions && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.625rem' }}>
              {(tradeView === 'largest' ? topTrades : recentTrades).map((t, i) => (
                <TopTradeChip key={`${t.ts}-${i}`} trade={t} rank={tradeView === 'largest' ? i : -1} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Column header */}
      {!isMobile && (
        <div style={{
          display: 'grid', gridTemplateColumns: '140px 1fr 80px 1fr 140px',
          gap: '0.5rem', alignItems: 'center',
          padding: '0 0.5rem 0.5rem',
        }}>
          <div style={{ ...T.tiny, color: B.textMuted, letterSpacing: '0.06em' }}>AWAY</div>
          <div style={{ ...T.tiny, color: B.gold, letterSpacing: '0.06em', textAlign: 'center' }}>
            MONEY FLOW
          </div>
          <div style={{ ...T.tiny, color: B.textMuted, letterSpacing: '0.06em', textAlign: 'center' }}>SAMPLED</div>
          <div style={{ ...T.tiny, color: B.gold, letterSpacing: '0.06em', textAlign: 'center' }}>
            MONEY FLOW
          </div>
          <div style={{ ...T.tiny, color: B.textMuted, letterSpacing: '0.06em', textAlign: 'right' }}>HOME</div>
        </div>
      )}

      {/* Flow rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {flowGames.map(g => (
          <FlowRow key={g.key} game={g} maxCash={maxGameCash} isMobile={isMobile} />
        ))}
      </div>

      {/* Key takeaways footer */}
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '0.75rem', marginTop: '1.25rem',
      }}>
        {[
          {
            title: 'Follow the Money',
            body: 'Games with heavy one-sided money (80%+) indicate strong conviction from large bettors. The bigger the total, the more meaningful the signal.',
          },
          {
            title: 'Reverse Signals Matter',
            body: 'When the majority of tickets go one way but the money goes the other, it often means sharp bettors are taking the contrarian side.',
          },
          {
            title: 'Bar Thickness',
            body: 'Thicker bars represent games with higher total money volume. Focus on the thickest rows — they carry the most conviction.',
          },
        ].map(tip => (
          <div key={tip.title} style={{
            padding: '0.75rem', borderRadius: '8px',
            background: `linear-gradient(135deg, ${B.card} 0%, rgba(212,175,55,0.03) 100%)`,
            border: `1px solid ${B.borderSubtle}`,
          }}>
            <div style={{ ...T.micro, fontWeight: 700, color: B.gold, marginBottom: '0.25rem', letterSpacing: '0.04em' }}>
              {tip.title}
            </div>
            <div style={{ ...T.micro, color: B.textSec, lineHeight: 1.5, fontSize: '0.55rem' }}>
              {tip.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowRow({ game, maxCash, isMobile }) {
  const awayShort = game.away.split(' ').pop();
  const homeShort = game.home.split(' ').pop();
  const awayCash = game.totalCash * (game.awayMoneyPct / 100);
  const homeCash = game.totalCash * (game.homeMoneyPct / 100);
  const awayWins = game.awayMoneyPct >= game.homeMoneyPct;
  const ss = sportStyle(game.sport);

  // Bar thickness: scale by this game's volume relative to the largest game
  const sizeRatio = maxCash > 0 ? game.totalCash / maxCash : 0;
  const barHeight = Math.max(10, Math.round(8 + sizeRatio * 22));

  // Divergence detection
  const ticketFav = game.awayTicketPct >= game.homeTicketPct ? 'away' : 'home';
  const moneyFav = game.awayMoneyPct >= game.homeMoneyPct ? 'away' : 'home';
  const isReverse = ticketFav !== moneyFav && game.ticketDivergence >= 10;

  if (isMobile) {
    return (
      <div style={{
        borderRadius: '10px', overflow: 'hidden',
        background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
        border: `1px solid ${isReverse ? B.goldBorder : B.border}`,
        padding: '0.75rem',
      }}>
        {isReverse && <div style={{ height: '1.5px', background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)`, margin: '-0.75rem -0.75rem 0.625rem' }} />}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Badge color={ss.color} bg={ss.bg}>{game.sport}</Badge>
            <span style={{ ...T.caption, fontWeight: 700, color: B.text }}>{game.away} vs {game.home}</span>
          </div>
          <span style={{ ...T.caption, fontWeight: 700, color: B.gold, fontFeatureSettings: "'tnum'" }}>
            {fmtVol(game.totalCash)}
          </span>
        </div>

        {/* Flow bar */}
        <div style={{ marginBottom: '0.375rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ ...T.micro, fontWeight: 700, color: awayWins ? B.gold : B.textMuted }}>
              {awayShort} {game.awayMoneyPct}%
            </span>
            <span style={{ ...T.micro, fontWeight: 700, color: !awayWins ? B.gold : B.textMuted }}>
              {game.homeMoneyPct}% {homeShort}
            </span>
          </div>
          <div style={{
            display: 'flex', height: `${barHeight}px`, borderRadius: '6px',
            overflow: 'hidden', gap: '2px', background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{
              width: `${game.awayMoneyPct}%`, borderRadius: '6px 0 0 6px',
              background: awayWins
                ? `linear-gradient(90deg, ${B.gold}, ${B.goldHover})`
                : `rgba(148,163,184,0.15)`,
              transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            }} />
            <div style={{
              width: `${game.homeMoneyPct}%`, borderRadius: '0 6px 6px 0',
              background: !awayWins
                ? `linear-gradient(90deg, ${B.gold}, ${B.goldHover})`
                : `rgba(148,163,184,0.15)`,
              transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>{fmtVol(awayCash)}</span>
            <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>{fmtVol(homeCash)}</span>
          </div>
        </div>

        {/* Divergence flag */}
        {isReverse && (() => {
          const sharpSide = moneyFav === 'away' ? awayShort : homeShort;
          const publicSide = ticketFav === 'away' ? awayShort : homeShort;
          return (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '0.15rem',
              ...T.micro, color: B.gold, marginTop: '0.25rem',
              padding: '0.375rem 0.5rem', borderRadius: '6px',
              background: `rgba(212,175,55,0.06)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                <Eye size={10} /> Reverse Signal
              </div>
              <span style={{ color: B.textSec, fontSize: '0.55rem', lineHeight: 1.3 }}>
                Public is backing <strong style={{ color: B.text }}>{publicSide}</strong> on tickets but
                the money favors <strong style={{ color: B.gold }}>{sharpSide}</strong> —
                sharps may be on the other side
              </span>
            </div>
          );
        })()}
      </div>
    );
  }

  // Desktop: 5-column grid
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '140px 1fr 80px 1fr 140px',
      gap: '0.5rem', alignItems: 'center',
      padding: '0.5rem', borderRadius: '10px',
      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${isReverse ? B.goldBorder : B.border}`,
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}>
      {isReverse && <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
        background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)`,
      }} />}

      {/* Away team label */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Badge color={ss.color} bg={ss.bg}>{game.sport}</Badge>
          <span style={{ ...T.caption, fontWeight: 700, color: awayWins ? B.text : B.textSec }}>
            {awayShort}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', paddingLeft: '0.25rem' }}>
          <span style={{
            ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
            color: awayWins ? B.gold : B.textMuted,
          }}>
            {game.awayMoneyPct}%
          </span>
          <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
            ({fmtVol(awayCash)})
          </span>
        </div>
      </div>

      {/* Away bar (right-aligned, flows toward center) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          width: `${game.awayMoneyPct}%`, height: `${barHeight}px`,
          borderRadius: '6px 2px 2px 6px',
          background: awayWins
            ? `linear-gradient(90deg, ${B.gold}40, ${B.gold})`
            : 'linear-gradient(90deg, rgba(148,163,184,0.08), rgba(148,163,184,0.2))',
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          minWidth: '4px',
        }} />
      </div>

      {/* Center: total amount */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          ...T.body, fontWeight: 800, color: B.gold, fontFeatureSettings: "'tnum'",
        }}>
          {fmtVol(game.totalCash)}
        </div>
        {isReverse && (() => {
          const sharpSide = moneyFav === 'away' ? awayShort : homeShort;
          return (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem',
              marginTop: '0.2rem',
            }} title={`Public tickets favor the other side, but the money favors ${sharpSide} — a classic sharp indicator`}>
              <Eye size={9} color={B.gold} />
              <span style={{ ...T.tiny, color: B.gold, fontSize: '0.5rem' }}>&#x21C4; REVERSE</span>
            </div>
          );
        })()}
      </div>

      {/* Home bar (left-aligned, flows from center) */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{
          width: `${game.homeMoneyPct}%`, height: `${barHeight}px`,
          borderRadius: '2px 6px 6px 2px',
          background: !awayWins
            ? `linear-gradient(90deg, ${B.gold}, ${B.gold}40)`
            : 'linear-gradient(90deg, rgba(148,163,184,0.2), rgba(148,163,184,0.08))',
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          minWidth: '4px',
        }} />
      </div>

      {/* Home team label */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', alignItems: 'flex-end' }}>
        <span style={{ ...T.caption, fontWeight: 700, color: !awayWins ? B.text : B.textSec }}>
          {homeShort}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
            ({fmtVol(homeCash)})
          </span>
          <span style={{
            ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
            color: !awayWins ? B.gold : B.textMuted,
          }}>
            {game.homeMoneyPct}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── EV Utilities ──────────────────────────────────────────────────────────────

function impliedProb(american) {
  if (american == null) return null;
  if (american > 0) return 100 / (american + 100);
  return Math.abs(american) / (Math.abs(american) + 100);
}

function probToAmerican(prob) {
  if (prob == null || prob <= 0 || prob >= 1) return null;
  if (prob >= 0.5) return Math.round(-100 * prob / (1 - prob));
  return Math.round(100 * (1 - prob) / prob);
}

function fmtOdds(american) {
  if (american == null) return '—';
  return american > 0 ? `+${american}` : `${american}`;
}

// ─── Sharp Position Card (elevated, full-featured) ────────────────────────────

// ─── Market Tab Strip (ML | Spread | Total) ──────────────────────────────────

const MarketTabStrip = memo(function MarketTabStrip({ active, onChange, hasSpread, hasTotal, spreadLocked, totalLocked }) {
  const tabs = [
    { id: 'ml', label: 'ML' },
    ...(hasSpread ? [{ id: 'spread', label: 'Spread' }] : []),
    ...(hasTotal ? [{ id: 'total', label: 'Total' }] : []),
  ];
  if (tabs.length <= 1) return null;
  return (
    <div style={{ display: 'flex', gap: '0.25rem', padding: '0.375rem 0.625rem 0' }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        const isLocked = (t.id === 'spread' && spreadLocked) || (t.id === 'total' && totalLocked);
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
            ...T.micro, fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.04em',
            border: isActive ? `1px solid ${B.goldBorder}` : isLocked ? `1px solid rgba(16,185,129,0.5)` : `1px solid ${B.border}`,
            background: isActive ? B.goldDim : isLocked ? 'rgba(16,185,129,0.08)' : 'transparent',
            color: isActive ? B.gold : isLocked ? B.green : B.textMuted,
            boxShadow: isLocked && !isActive ? '0 0 6px rgba(16,185,129,0.3)' : 'none',
            transition: 'all 0.15s ease',
          }}>
            {isLocked && !isActive ? '🔒 ' : ''}{t.label}
          </button>
        );
      })}
    </div>
  );
});

// ─── Spread Panel — Pinnacle spread lines + prediction market data ───────────

function SpreadPanel({ pinnGame, game, isMobile }) {
  const sc = pinnGame?.spreadCurrent;
  const so = pinnGame?.spreadOpener;
  const sm = pinnGame?.spreadMovement;
  const bestAway = pinnGame?.bestAwaySpread;
  const bestHome = pinnGame?.bestHomeSpread;
  const spreadHist = pinnGame?.spreadHistory || [];
  const awayShort = game.away.split(' ').pop();
  const homeShort = game.home.split(' ').pop();

  const hasAnyData = sc || bestAway || bestHome;
  if (!hasAnyData) {
    return (
      <div style={{ padding: '0.75rem 0.625rem', textAlign: 'center' }}>
        <span style={{ ...T.caption, color: B.textMuted }}>No spread data available</span>
      </div>
    );
  }

  const spreadPoints = spreadHist.map(h => h.awayLine);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {sc && (
        <div style={{
          borderRadius: '8px', overflow: 'hidden',
          border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.015)',
        }}>
          <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
            <span style={{ ...T.micro, color: B.textMuted }}>Pinnacle Spread</span>
          </div>
          <div style={{ padding: '0.5rem 0.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ ...T.label, color: B.text, fontWeight: 700 }}>
                {awayShort} {sc.awayLine > 0 ? '+' : ''}{sc.awayLine}
              </span>
              <span style={{ ...T.micro, color: B.textMuted }}>
                {fmtOdds(sc.awayOdds)}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
              {so && sm && sm.awayLine !== 0 && (
                <span style={{
                  ...T.micro, fontWeight: 700,
                  color: sm.awayLine < 0 ? B.green : sm.awayLine > 0 ? B.red : B.textMuted,
                }}>
                  {sm.awayLine > 0 ? '+' : ''}{sm.awayLine.toFixed(1)}
                </span>
              )}
              {so && (
                <span style={{ ...T.micro, color: B.textSubtle, fontSize: '0.5rem' }}>
                  Open: {so.awayLine > 0 ? '+' : ''}{so.awayLine}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
              <span style={{ ...T.label, color: B.text, fontWeight: 700 }}>
                {homeShort} {sc.homeLine > 0 ? '+' : ''}{sc.homeLine}
              </span>
              <span style={{ ...T.micro, color: B.textMuted }}>
                {fmtOdds(sc.homeOdds)}
              </span>
            </div>
          </div>
        </div>
      )}

      {(bestAway || bestHome) && (
        <div style={{
          borderRadius: '8px', overflow: 'hidden',
          border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.015)',
        }}>
          <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
            <span style={{ ...T.micro, color: B.textMuted }}>Best Retail Spread</span>
          </div>
          <div style={{ padding: '0.5rem 0.625rem', display: 'flex', justifyContent: 'space-between' }}>
            {bestAway && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ ...T.label, color: B.green, fontWeight: 700 }}>
                  {awayShort} {bestAway.line > 0 ? '+' : ''}{bestAway.line} ({fmtOdds(bestAway.odds)})
                </span>
                <span style={{ ...T.micro, color: B.textMuted }}>{bestAway.book}</span>
              </div>
            )}
            {bestHome && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.15rem' }}>
                <span style={{ ...T.label, color: B.green, fontWeight: 700 }}>
                  {homeShort} {bestHome.line > 0 ? '+' : ''}{bestHome.line} ({fmtOdds(bestHome.odds)})
                </span>
                <span style={{ ...T.micro, color: B.textMuted }}>{bestHome.book}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {spreadPoints.length >= 2 && (
        <div style={{ padding: '0.25rem 0.625rem' }}>
          <MiniSparkline
            points={spreadPoints}
            color={B.gold}
            label={`Pinnacle Spread — ${awayShort}`}
            startLabel={`${spreadPoints[0] > 0 ? '+' : ''}${spreadPoints[0]}`}
            endLabel={`${spreadPoints[spreadPoints.length - 1] > 0 ? '+' : ''}${spreadPoints[spreadPoints.length - 1]}`}
          />
        </div>
      )}
    </div>
  );
}

// ─── Total Panel — Pinnacle O/U lines + prediction market data ───────────────

function TotalPanel({ pinnGame, game, isMobile }) {
  const tc = pinnGame?.totalCurrent;
  const to = pinnGame?.totalOpener;
  const tm = pinnGame?.totalMovement;
  const bestOver = pinnGame?.bestOver;
  const bestUnder = pinnGame?.bestUnder;
  const totalHist = pinnGame?.totalHistory || [];

  const hasAnyData = tc || bestOver || bestUnder;
  if (!hasAnyData) {
    return (
      <div style={{ padding: '0.75rem 0.625rem', textAlign: 'center' }}>
        <span style={{ ...T.caption, color: B.textMuted }}>No totals data available</span>
      </div>
    );
  }

  const totalPoints = totalHist.map(h => h.line);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {tc && (
        <div style={{
          borderRadius: '8px', overflow: 'hidden',
          border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.015)',
        }}>
          <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
            <span style={{ ...T.micro, color: B.textMuted }}>Pinnacle Total</span>
          </div>
          <div style={{ padding: '0.5rem 0.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ ...T.label, color: B.green, fontWeight: 700 }}>
                O {tc.line}
              </span>
              <span style={{ ...T.micro, color: B.textMuted }}>{fmtOdds(tc.overOdds)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
              {to && tm && tm.line !== 0 && (
                <span style={{
                  ...T.micro, fontWeight: 700,
                  color: tm.line > 0 ? B.green : tm.line < 0 ? B.red : B.textMuted,
                }}>
                  {tm.line > 0 ? '+' : ''}{tm.line.toFixed(1)}
                </span>
              )}
              {to && (
                <span style={{ ...T.micro, color: B.textSubtle, fontSize: '0.5rem' }}>
                  Open: {to.line}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
              <span style={{ ...T.label, color: B.red, fontWeight: 700 }}>
                U {tc.line}
              </span>
              <span style={{ ...T.micro, color: B.textMuted }}>{fmtOdds(tc.underOdds)}</span>
            </div>
          </div>
        </div>
      )}

      {(bestOver || bestUnder) && (
        <div style={{
          borderRadius: '8px', overflow: 'hidden',
          border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.015)',
        }}>
          <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
            <span style={{ ...T.micro, color: B.textMuted }}>Best Retail Total</span>
          </div>
          <div style={{ padding: '0.5rem 0.625rem', display: 'flex', justifyContent: 'space-between' }}>
            {bestOver && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ ...T.label, color: B.green, fontWeight: 700 }}>
                  O {bestOver.line} ({fmtOdds(bestOver.odds)})
                </span>
                <span style={{ ...T.micro, color: B.textMuted }}>{bestOver.book}</span>
              </div>
            )}
            {bestUnder && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.15rem' }}>
                <span style={{ ...T.label, color: B.red, fontWeight: 700 }}>
                  U {bestUnder.line} ({fmtOdds(bestUnder.odds)})
                </span>
                <span style={{ ...T.micro, color: B.textMuted }}>{bestUnder.book}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {totalPoints.length >= 2 && (
        <div style={{ padding: '0.25rem 0.625rem' }}>
          <MiniSparkline
            points={totalPoints}
            color={B.gold}
            label="Pinnacle O/U Line"
            startLabel={`${totalPoints[0]}`}
            endLabel={`${totalPoints[totalPoints.length - 1]}`}
          />
        </div>
      )}
    </div>
  );
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

const MiniSparkline = memo(function MiniSparkline({ points, width = 140, height = 32, color = B.gold, label, startLabel, endLabel }) {
  if (!points || points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 3;
  const xStep = (width - pad * 2) / (points.length - 1);
  const yH = height - pad * 2;
  const pts = points.map((v, i) => ({
    x: pad + i * xStep,
    y: pad + yH - ((v - min) / range) * yH,
  }));
  // Catmull-Rom → cubic bezier: smooth flowing curve instead of the
  // old jagged polyline. tension 0.18 keeps peaks honest.
  const d = (() => {
    if (pts.length === 2) return `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)} L${pts[1].x.toFixed(1)},${pts[1].y.toFixed(1)}`;
    const t = 0.18;
    let path = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) * t;
      const c1y = p1.y + (p2.y - p0.y) * t;
      const c2x = p2.x - (p3.x - p1.x) * t;
      const c2y = p2.y - (p3.y - p1.y) * t;
      path += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  })();
  const lastPt = pts[pts.length - 1];
  const trend = points[points.length - 1] > points[0] ? B.green : points[points.length - 1] < points[0] ? B.red : B.textMuted;
  const gid = `sg-${(label || 'spark').replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
      {label && (
        <span style={{ ...T.micro, color: B.textMuted, marginBottom: '0.1rem' }}>{label}</span>
      )}
      <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="70%" stopColor={color} stopOpacity="0.05" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${d} L${lastPt.x.toFixed(1)},${height} L${pts[0].x.toFixed(1)},${height} Z`}
          fill={`url(#${gid})`}
        />
        <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        {/* glowing live end-dot: breathing halo + core */}
        <circle className="sf-spark-halo" cx={lastPt.x} cy={lastPt.y} r={4.5} fill={trend} opacity={0.25} />
        <circle cx={lastPt.x} cy={lastPt.y} r={2.25} fill={trend} stroke="rgba(0,0,0,0.4)" strokeWidth={0.75} />
      </svg>
      {(startLabel || endLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', width }}>
          <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.5rem', fontFeatureSettings: "'tnum'" }}>{startLabel || ''}</span>
          <span style={{ ...T.micro, color: trend, fontWeight: 700, fontSize: '0.5rem', fontFeatureSettings: "'tnum'" }}>{endLabel || ''}</span>
        </div>
      )}
    </div>
  );
});

// V6 rateStars removed — replaced by rateStarsV7 defined above (unified for ML + spread/total)

const HEALTH_REASON_LABELS = {
  // v6.3 two-factor reasons (primary triggers) — all symmetric to the
  // lock floor Δw ≥ +1 AND Δq ≥ +1. Anything below floor on either axis
  // mutes; Δw ≤ −2 cancels.
  winners_killed:       'Proven winners now strongly against this pick (Δw ≤ −2)',
  winners_faded:        'A proven winner flipped off this pick (Δw = −1)',
  winners_below_floor:  'Proven-winner margin dropped below lock floor (Δw = 0)',
  quality_below_floor:  'Quality-wallet margin dropped below lock floor (Δq ≤ 0)',
  quality_faded:        'Quality wallets collapsed to the other side (Δq ≤ −3)',
  // diagnostic-only reasons (never mute/cancel on their own in v6)
  wps_flipped_diag:        'Wallet-count flipped (diagnostic only)',
  opp_side_stronger_diag:  'Opposing side gaining WPS (diagnostic only)',
  // legacy labels retained so historical cards still render copy
  below_lock_range: 'Score dropped below lock range',
  side_flipped: 'Sharps flipped to other side',
  flip_rejected: 'Flip rejected — threshold not met',
  near_start: 'Near game start — holding active',
  opp_side_dominates: 'Opposing side now stronger than lock threshold',
  opp_side_stronger: 'Opposing side gaining conviction',
  whitelist_fade_weak:   'Sport winners leaning against this pick',
  whitelist_fade_strong: 'Sport winners strongly against this pick',
  // Phase 3 — AGS-driven decisions surface as their own reasons so the
  // dashboard chip explains *why* a pick is muted/active when AGS is
  // overriding the headline floor.
  ags_quality_veto:    'Wallet-stack score below confirmation gate (AGS < −1) — auto-muted',
  ags_rescue:          'Wallet-stack score above lock floor (AGS ≥ +5) — auto-rescued',
  v73_hc_rescue:       'HC margin override rescued this pick from the v6.6 mute floor',
  sum_below_floor:     'Δw + Δq below the v7.4 lock floor (Σ < 5)',
};

// ─── V12 Conviction (proprietary-safe) ─────────────────────────────────────────
// Surfaces HOW the wallet signal feeds the V12 model without exposing the raw
// score, quintile cutoffs, or internal feature names. We show directional
// strength (support share + a vague qualitative label) per driver and an
// overall conviction meter keyed to the shipped tier.
const V12_TIER_FILL = { ELITE: 1, PREMIUM: 0.82, LOCK: 0.62, LEAN: 0.42, WEAK: 0.26 };
const V12_TIER_READ = {
  ELITE: 'Among our strongest conviction signals',
  PREMIUM: 'Premium-tier sharp conviction',
  LOCK: 'Solid lock conviction',
  LEAN: 'Lean conviction — reduced stake',
  WEAK: 'Minimal conviction — exposure only',
};

function v12DriverState(forV, agV) {
  const f = Math.max(0, forV || 0);
  const a = Math.max(0, agV || 0);
  const total = f + a;
  if (total === 0) return { share: 0.5, label: 'neutral', tone: 'muted', active: false };
  const share = f / total;
  if (a === 0 && f > 0) return { share, label: 'no dissent', tone: 'pos', active: true };
  if (share >= 0.75) return { share, label: 'strongly for', tone: 'pos', active: true };
  if (share >= 0.56) return { share, label: 'leaning for', tone: 'pos', active: true };
  if (share >= 0.45) return { share, label: 'split', tone: 'mid', active: true };
  return { share, label: 'fading', tone: 'neg', active: true };
}

function v12MoneyState(moneyPct) {
  if (moneyPct == null) return { share: 0.5, label: 'neutral', tone: 'muted', active: false };
  const share = Math.max(0, Math.min(1, moneyPct / 100));
  if (moneyPct >= 85) return { share, label: 'one-sided', tone: 'pos', active: true };
  if (moneyPct >= 70) return { share, label: 'dominant', tone: 'pos', active: true };
  if (moneyPct >= 55) return { share, label: 'leaning', tone: 'mid', active: true };
  return { share, label: 'split', tone: 'mid', active: true };
}

// Compact one-word read for the collapsed card.
function v12OverallTag({ forW, agW, hcFor, hcAg, moneyPct }) {
  const pm = (forW || 0) - (agW || 0);
  const hm = (hcFor || 0) - (hcAg || 0);
  const money = moneyPct || 0;
  if ((agW || 0) === 0 && (forW || 0) > 0 && money >= 70) return { label: 'heavily backed', tone: 'pos' };
  if (pm >= 1 || hm >= 1 || money >= 70) return { label: 'backed', tone: 'pos' };
  if (pm <= -1 || hm <= -1) return { label: 'contested', tone: 'neg' };
  return { label: 'mixed', tone: 'mid' };
}

// BackingWalletStrip — the receipts. Surfaces the ACTUAL proven wallets
// behind a locked pick (lifted from the stamped walletDetails snapshot)
// with each wallet's stored sport track record (getWalletProfile cache).
// This is the differentiated "data we store and share" moment: instead of
// an abstract "1 proven winner" count, the user sees who is on the pick,
// their real-money W-L / ROI in this sport, and how hard they sized it.
function BackingWalletStrip({ wallets, sport, accent = B.green, isMobile }) {
  if (!Array.isArray(wallets) || wallets.length === 0) return null;
  const sportUp = (sport || '').toUpperCase();

  const enriched = wallets.map((w) => {
    const short = String(w.wallet || '').slice(-6);
    const profile = getWalletProfile(short);
    // Whitelist-coherent record: show the record that EARNED the badge
    // (featured-pick record for Source-A promotions, on-chain record
    // otherwise) so a PROVEN wallet never renders with a negative ROI.
    const wlRec = whitelistRecordForDisplay(short, sport);
    const rec = wlRec;
    const flatRoiDisp = wlRec?.roi ?? null;
    const decided = wlRec ? (wlRec.wins || 0) + (wlRec.losses || 0) : 0;
    const winner = isSportWinner(short, sport);
    // Model parity: token bets (< 0.10× the wallet's avg sport bet) are
    // invisible to the staking cron — badge them instead of counting them.
    const counted = isModelCounted(w);
    const rankGroup = groupedSportsRankLabel(w.rank);
    const eliteRank = w.rank != null && w.rank > 0 && w.rank <= 20;
    // Size edge: bigger than this wallet's own median, and they win more
    // when they load up (cross-sport own-median buckets).
    const sz = profile?.sizeSignal;
    let sizeEdge = null;
    if (sz && sz.medianInvested > 0 && (w.invested || 0) > 0) {
      const ratio = w.invested / sz.medianInvested;
      if (ratio >= 1.5) {
        const bucket = ratio >= 2 ? sz.wayAbove : sz.above;
        if (bucket && bucket.n >= 3 && bucket.wr != null) sizeEdge = { ratio, wr: bucket.wr };
      }
    }
    const tierLabel = eliteRank ? 'ELITE' : winner ? 'PROVEN' : 'TRACKED';
    const tierColor = eliteRank ? B.gold : winner ? B.green : B.textSec;
    const tierBg = eliteRank ? B.goldDim : winner ? B.greenDim : 'rgba(148,163,184,0.10)';
    return { ...w, short, profile, rec, flatRoiDisp, decided, winner, counted, rankGroup, sizeEdge, tierLabel, tierColor, tierBg, hasRecord: !!rec && decided >= 4 };
  });

  // Model-counted wallets first (they're what the stake is built on), then
  // winners, then most-decided record, then biggest stake.
  enriched.sort((a, b) =>
    (Number(b.counted) - Number(a.counted)) ||
    (Number(b.winner) - Number(a.winner)) ||
    (b.decided - a.decided) ||
    ((b.invested || 0) - (a.invested || 0))
  );

  const cap = isMobile ? 3 : 4;
  const shown = enriched.slice(0, cap);
  const more = enriched.length - shown.length;
  // "N proven" counts only wallets the model actually counted — matches the
  // cron's whitelist consensus, not the raw tracked-wallet list.
  const winnerCount = enriched.filter(e => e.winner && e.counted).length;
  const tokenCount = enriched.filter(e => !e.counted).length;

  return (
    <div style={{
      margin: '0.85rem 0 0', padding: '0 1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.55rem' }}>
        <span style={{ ...T.tiny, fontSize: '0.5rem', color: B.textSubtle, letterSpacing: '0.14em', fontWeight: 700 }}>THE RECEIPTS</span>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${B.borderSubtle}, transparent)` }} />
        <span style={{ ...T.micro, fontWeight: 800, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
          {winnerCount > 0
            ? <><span style={{ color: B.green }}>{winnerCount} proven</span> · {enriched.length} wallet{enriched.length !== 1 ? 's' : ''}</>
            : <>{enriched.length} wallet{enriched.length !== 1 ? 's' : ''}</>}
          {tokenCount > 0 && <span style={{ color: B.textSubtle }}> · {tokenCount} token</span>}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {shown.map((e, i) => (
          <div key={`${e.short}-${i}`} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto' : 'minmax(0,1fr) auto',
            gap: '0.4rem 0.6rem', alignItems: 'center',
            padding: '0.5rem 0.1rem 0.5rem 0.6rem',
            borderTop: i === 0 ? 'none' : `1px solid ${B.borderSubtle}`,
            borderLeft: e.winner ? `2px solid ${e.tierColor}` : '2px solid transparent',
          }}>
            {/* Identity + record (left column) */}
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.22rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                <span style={{
                  ...T.micro, fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.05em',
                  padding: '0.08rem 0.32rem', borderRadius: '4px',
                  color: e.tierColor, background: e.tierBg, border: `1px solid ${e.tierColor}44`,
                }}>{e.tierLabel}</span>
                {e.rankGroup && (
                  <span style={{ ...T.micro, fontSize: '0.5rem', fontWeight: 800, color: '#CBD5E1', background: 'rgba(148,163,184,0.10)', border: '1px solid rgba(148,163,184,0.20)', padding: '0.08rem 0.32rem', borderRadius: '4px' }}>{e.rankGroup}</span>
                )}
                {e.winner && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.18rem', ...T.micro, fontSize: '0.5rem', fontWeight: 800, color: B.gold }}>
                    <CheckCircle size={9} style={{ strokeWidth: 3 }} />{sportUp}
                  </span>
                )}
                {!e.counted && (
                  <span
                    title={`Bet is under ${Math.round(MODEL_MIN_CONVICTION * 100)}% of this wallet's average ${sportUp} bet — the model doesn't count token-sized positions toward the stake`}
                    style={{ ...T.micro, fontSize: '0.5rem', fontWeight: 800, color: B.textSubtle, background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.18)', padding: '0.08rem 0.32rem', borderRadius: '4px', letterSpacing: '0.05em' }}
                  >TOKEN BET</span>
                )}
                <span style={{ ...T.micro, fontSize: '0.55rem', color: B.textMuted, fontFeatureSettings: "'tnum'" }}>…{e.short.slice(-4)}</span>
              </div>
              {e.hasRecord ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap', fontFeatureSettings: "'tnum'" }}>
                  <span style={{ ...T.caption, fontWeight: 900, color: B.text }}>{e.rec.wins}-{e.rec.losses}</span>
                  <span style={{ ...T.micro, fontSize: '0.56rem', color: B.textSec }}>{Math.round(e.rec.wr)}% W</span>
                  {e.flatRoiDisp != null && (
                    <span style={{ ...T.micro, fontSize: '0.56rem', fontWeight: 800, color: e.flatRoiDisp >= 0 ? B.green : B.red }}>
                      {e.flatRoiDisp >= 0 ? '+' : ''}{Math.round(e.flatRoiDisp)}% ROI
                    </span>
                  )}
                  <span style={{ ...T.micro, fontSize: '0.5rem', color: B.textSubtle, letterSpacing: '0.04em' }}>{sportUp} {e.rec?.kind === 'picks' ? 'pick record' : 'record'}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', fontFeatureSettings: "'tnum'" }}>
                  <span style={{ ...T.caption, fontWeight: 900, color: (e.pnl || 0) >= 0 ? B.green : B.red }}>
                    {(e.pnl || 0) >= 0 ? '+' : ''}{fmtVol(e.pnl || 0)}
                  </span>
                  <span style={{ ...T.micro, fontSize: '0.5rem', color: B.textSubtle, letterSpacing: '0.04em' }}>{sportUp} profit</span>
                </div>
              )}
              {e.sizeEdge && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.05rem' }}>
                  <Zap size={9} color="#FBBF24" style={{ flexShrink: 0, fill: 'rgba(245,158,11,0.35)' }} />
                  <span style={{ ...T.micro, fontSize: '0.52rem', color: '#FBBF24', fontWeight: 700, fontFeatureSettings: "'tnum'" }}>
                    Loading up {e.sizeEdge.ratio.toFixed(1)}× · {Math.round(e.sizeEdge.wr)}% W when sized up
                  </span>
                </div>
              )}
            </div>

            {/* Stake on this pick (right column) */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ ...T.caption, fontWeight: 900, color: accent, fontFeatureSettings: "'tnum'", lineHeight: 1 }}>{fmtVol(e.invested)}</div>
              <div style={{ ...T.micro, fontSize: '0.5rem', color: B.textMuted, letterSpacing: '0.04em', marginTop: '0.15rem' }}>on this pick</div>
            </div>
          </div>
        ))}
      </div>

      {more > 0 && (
        <div style={{ ...T.micro, fontSize: '0.56rem', color: B.textMuted, textAlign: 'center', marginTop: '0.45rem', letterSpacing: '0.03em' }}>
          + {more} more backing wallet{more !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

// THE CASE — the cohesive verdict. One plain-language thesis (the story)
// built from the real data, plus a single conviction meter. Replaces the
// old debug-style stack of full-width driver bars. The wallet receipts
// render separately right below via BackingWalletStrip.
function V12ConvictionPanel({ tier, tierColor, tierBg, forW, agW, qFor, qAg, hcFor, hcAg, moneyPct, sport, accentColor, isMobile, backingWallets, totalInvested }) {
  const sportUp = (sport || '').toUpperCase();
  const fill = V12_TIER_FILL[tier] ?? 0.5;
  const mc = tierColor || accentColor || B.green;
  const tierWord = tier ? (tier.charAt(0) + tier.slice(1).toLowerCase()) : 'Strong';

  // Lead proven-winner record (largest decided sample) for the thesis.
  // Model-counted wallets only, and the whitelist-coherent record — the
  // thesis must never pair "proven winner" with a negative ROI.
  const leadRec = (() => {
    if (!Array.isArray(backingWallets)) return null;
    let best = null, bestDecided = 3;
    for (const w of backingWallets) {
      const short = String(w.wallet || '').slice(-6);
      if (!isSportWinner(short, sport)) continue;
      if (!isModelCounted(w)) continue;
      const rec = whitelistRecordForDisplay(short, sport);
      const decided = rec ? (rec.wins || 0) + (rec.losses || 0) : 0;
      if (decided > bestDecided) { bestDecided = decided; best = rec; }
    }
    return best;
  })();

  const fw = forW || 0, aw = agW || 0, qf = qFor || 0;
  const money = moneyPct != null ? Math.round(moneyPct) : null;

  return (
    <div style={{ padding: '1rem 1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{ ...T.tiny, fontSize: '0.5rem', color: B.textSubtle, letterSpacing: '0.14em', fontWeight: 700 }}>THE CASE</span>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${B.borderSubtle}, transparent)` }} />
        {tier && (
          <span style={{ ...T.micro, fontWeight: 800, color: mc, background: tierBg || `${mc}1a`, border: `1px solid ${mc}55`, padding: '0.12rem 0.45rem', borderRadius: '5px', letterSpacing: '0.04em' }}>{tier}</span>
        )}
      </div>

      {/* The thesis — one designed sentence that tells the story */}
      <div style={{ ...T.caption, color: B.textSec, lineHeight: 1.6, marginBottom: '0.7rem' }}>
        <span style={{ color: mc, fontWeight: 800 }}>{tierWord} conviction.</span>{' '}
        {fw > 0 ? (
          <>
            <span style={{ color: B.text, fontWeight: 700 }}>{fw} proven {sportUp} winner{fw !== 1 ? 's' : ''}</span>
            {leadRec ? <span style={{ color: B.textMuted, fontFeatureSettings: "'tnum'" }}> ({leadRec.wins}-{leadRec.losses}{leadRec.roi != null ? <>, {leadRec.roi >= 0 ? '+' : ''}{Math.round(leadRec.roi)}% ROI</> : ''})</span> : null}
            {' '}backing{qf > 0 ? <>, <span style={{ color: B.text, fontWeight: 700 }}>{qf} quality wallet{qf !== 1 ? 's' : ''}</span> confirming</> : ''}
          </>
        ) : (
          <span style={{ color: B.text, fontWeight: 700 }}>Sharp wallets aligned</span>
        )}
        {totalInvested ? <> — <span style={{ color: B.text, fontWeight: 700, fontFeatureSettings: "'tnum'" }}>{fmtVol(totalInvested)}</span> in</> : ''}
        {money != null ? <>{totalInvested ? ' at ' : ' — '}<span style={{ color: mc, fontWeight: 700 }}>{money}% of sharp money</span></> : ''}
        {aw > 0 ? <>, <span style={{ color: B.red, fontWeight: 700 }}>{aw} against</span>.</> : <span style={{ color: B.green, fontWeight: 700 }}> · no dissent.</span>}
      </div>

      {/* Conviction meter — keyed to tier, no raw score shown */}
      <div style={{ height: '7px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.round(fill * 100)}%`, height: '100%', borderRadius: '4px', background: `linear-gradient(90deg, ${mc}66, ${mc})`, boxShadow: `0 0 10px ${mc}55` }} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SharpLockCardV2 — premium flagship locked-pick card.
// Collapsed row scans fast (crest · pick · price · edge · conviction tier);
// expanding unseals a cinematic verdict band with an animated AGSU V12
// conviction gauge (1–100), the payoff numbers, the receipts, the sharp-
// money split, line history and lifecycle. Reuses BackingWalletStrip for the
// proven-wallet enrichment so the receipts stay authoritative.
// ════════════════════════════════════════════════════════════════════════
function useSlkCountUp(target, run, ms = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) { setV(0); return; }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(target); return;
    }
    let raf, start;
    const tick = (t) => {
      if (start == null) start = t;
      const prog = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - prog, 3);
      setV(target * eased);
      if (prog < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

// Semicircle gauge — same geometry/feel as the live card's ConvictionGauge
// so the locked card reads as a sibling of the Sharp Position card. The
// number is the literal AGSU V12 score on a 0–100 face.
function SlkRing({ value, color, tier, run, size = 124 }) {
  const sw = 9;
  const r = (size - sw) / 2 - 2;
  const cx = size / 2;
  const cy = r + sw / 2 + 2;
  const semicirc = Math.PI * r;
  const animated = useSlkCountUp(value, run, 1100);
  const dash = (Math.max(0, Math.min(100, animated)) / 100) * semicirc;
  const h = cy + sw / 2 + 2;
  return (
    <div style={{ position: 'relative', width: size, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(148,163,184,0.13)" strokeWidth={sw} strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${dash} ${semicirc}`}
          style={{ filter: `drop-shadow(0 0 5px ${color}88)`, transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
        <text x={cx} y={cy - 9} textAnchor="middle" fill={B.text} fontSize="30" fontWeight="900"
          style={{ fontFeatureSettings: "'tnum'", letterSpacing: '-0.03em' }}>{Math.round(animated)}</text>
      </svg>
      <div style={{ marginTop: '-2px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <span style={{ fontSize: '0.46rem', color: B.textSubtle, letterSpacing: '0.14em', fontWeight: 800 }}>AGSU V12</span>
        <span style={{ fontSize: '0.56rem', fontWeight: 800, color, letterSpacing: '0.07em' }}>{tier}</span>
      </div>
    </div>
  );
}

// Consensus checklist row — mirrors the live card's `Driver` exactly so
// the locked card's "why" reads with the same brand vocabulary.
function SlkDriver({ met, label, detail, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.16rem 0', minHeight: '20px' }}>
      {met
        ? <CheckCircle size={12} color={color} strokeWidth={2.5} />
        : <Circle size={12} color={B.textMuted} strokeWidth={1.5} />}
      <span style={{ fontSize: '0.66rem', color: met ? B.text : B.textSec, fontWeight: met ? 700 : 500, lineHeight: 1.15 }}>{label}</span>
      <span style={{ fontSize: '0.64rem', fontFeatureSettings: "'tnum'", color: met ? color : B.textMuted, fontWeight: 700, marginLeft: 'auto', lineHeight: 1.15 }}>{detail}</span>
    </div>
  );
}

function SlkLabel({ children }) {
  return <div style={{ fontSize: '0.55rem', color: B.textSubtle, letterSpacing: '0.12em', fontWeight: 700 }}>{children}</div>;
}

function SlkPayRow({ label, value, sub, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem' }}>
      <span style={{ fontSize: '0.7rem', color: B.textMuted, fontWeight: 600 }}>{label}</span>
      <span style={{ textAlign: 'right' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 800, color, fontFeatureSettings: "'tnum'", letterSpacing: '-0.01em' }}>{value}</span>
        {sub && <span style={{ fontSize: '0.6rem', color: B.textMuted, marginLeft: '0.5rem' }}>{sub}</span>}
      </span>
    </div>
  );
}

function SlkMoney({ totalInvested, moneyPct, teamShort, otherTeam, accent, run }) {
  const amt = useSlkCountUp(totalInvested || 0, run, 1100);
  const pct = useSlkCountUp(moneyPct || 0, run, 1100);
  const fmtV = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${Math.round(v)}`);
  return (
    <div style={{ padding: '1rem 1rem 0' }}>
      <SlkLabel>SHARP MONEY AT LOCK</SlkLabel>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.55rem' }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: accent, fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em' }}>{fmtV(amt)}</span>
        <span style={{ fontSize: '0.6rem', color: B.textMuted, fontFeatureSettings: "'tnum'" }}>{Math.round(pct)}% {teamShort} · {Math.max(0, 100 - moneyPct)}% {otherTeam}</span>
      </div>
      <div style={{ marginTop: '0.5rem', height: '7px', borderRadius: '4px', background: 'rgba(148,163,184,0.12)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${accent}aa, ${accent})`, borderRadius: '4px' }} />
      </div>
    </div>
  );
}

// Distinct accent per conviction tier so the list isn't a wall of green.
// A premium ladder: gold (apex) → green → blue → amber → orange.
const LOCK_TIER_ACCENT = {
  ELITE:   '#E8B85C',
  PREMIUM: '#22C55E',
  LOCK:    '#3B82F6',
  LEAN:    '#F59E0B',
  WEAK:    '#F97316',
  FADE:    '#EF4444',
};

// ─── Lock Countdown Pill ──────────────────────────────────────────────────────
// Live countdown to the pick's lock moment (15 min before first pitch/kick).
// Three escalating states, all speaking the card's glass-pill vocabulary:
//   > 1h out   — quiet glass, clock icon, "LOCKS IN 2H 14M"
//   ≤ 1h out   — gold, urgency building
//   ≤ 15m out  — red with a soft breathing glow, seconds ticking
//   post-lock  — green "LOCKED" seal, worn through the live game until graded
const LOCK_LEAD_MS = 15 * 60 * 1000;
const LockCountdown = memo(function LockCountdown({ gameTime, isGraded }) {
  const gameEpoch = gameTime ? (typeof gameTime === 'number' ? gameTime : Date.parse(gameTime)) : null;
  const valid = gameEpoch != null && !isNaN(gameEpoch);
  const lockEpoch = valid ? gameEpoch - LOCK_LEAD_MS : null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Once locked the pill is static — no more ticking needed.
    if (!valid || isGraded || Date.now() >= lockEpoch) return undefined;
    // Tick each second inside the final 10 min (seconds display), else every 30s.
    const fast = lockEpoch - Date.now() < 10 * 60 * 1000;
    const id = setInterval(() => setNow(Date.now()), fast ? 1000 : 30000);
    return () => clearInterval(id);
  }, [valid, isGraded, gameEpoch, lockEpoch, now]);

  if (!valid || isGraded) return null;

  const pillBase = {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0,
    padding: '0.22rem 0.5rem', borderRadius: '999px',
    fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.07em',
    fontFeatureSettings: "'tnum'", lineHeight: 1, whiteSpace: 'nowrap',
  };

  // Post-lock, pre-game: the sealed state.
  if (now >= lockEpoch) {
    return (
      <span style={{
        ...pillBase, color: B.green,
        background: 'linear-gradient(135deg, rgba(16,185,129,0.16), rgba(5,150,105,0.08))',
        border: '1px solid rgba(16,185,129,0.35)',
        boxShadow: '0 0 12px -4px rgba(16,185,129,0.5)',
      }}>
        <Lock size={9} strokeWidth={2.6} /> LOCKED
      </span>
    );
  }

  const rem = lockEpoch - now;
  const h = Math.floor(rem / 36e5);
  const m = Math.floor((rem % 36e5) / 6e4);
  const s = Math.floor((rem % 6e4) / 1e3);
  const label = h > 0 ? `${h}H ${String(m).padStart(2, '0')}M`
    : rem >= 10 * 60 * 1000 ? `${m}M`
    : `${m}:${String(s).padStart(2, '0')}`;

  const urgent = rem <= 15 * 60 * 1000;           // inside 15 min — red, breathing
  const closing = !urgent && rem <= 60 * 60 * 1000; // inside the hour — gold
  const c = urgent ? '#F87171' : closing ? B.gold : B.textSec;
  return (
    <span
      className={urgent ? 'sf-lock-urgent' : undefined}
      title={`Locks 15 min before start · ${new Date(lockEpoch).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' })} ET`}
      style={{
        ...pillBase, color: c,
        background: urgent ? 'linear-gradient(135deg, rgba(248,113,113,0.16), rgba(220,38,38,0.07))'
          : closing ? 'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(245,158,11,0.05))'
          : 'rgba(255,255,255,0.045)',
        border: `1px solid ${urgent ? 'rgba(248,113,113,0.4)' : closing ? 'rgba(245,158,11,0.32)' : 'rgba(255,255,255,0.1)'}`,
      }}
    >
      <Clock size={9} strokeWidth={2.6} />
      <span style={{ opacity: 0.75, fontWeight: 700 }}>LOCKS IN</span>
      <span style={{ fontSize: '0.62rem' }}>{label}</span>
    </span>
  );
});

const SharpLockCardV2 = memo(function SharpLockCardV2({ pick, isMobile }) {
  const {
    team, away, home, sport, units, odds, book, lockedAt, peakAt, gameTime,
    status, outcome, profit, closingOdds, totalInvested, evEdge, consensusStrength,
    pinnacleOdds, marketType, line, superseded, health, lockTier, trackedOnly,
    agsValueV12, agsValue, agsTierV12, agsTier, backingWallets, hcConfFor,
    isTopPick: isTopPickPre, isSuperTopPick: isSuperTopPickPre, hcStakeTier,
  } = pick;
  const isTopPick = !!isTopPickPre;
  const isSuperTopPick = !!isSuperTopPickPre;
  // v12.1 product stake tier (cron-authoritative). When present it drives the
  // badge/label/units; null on pre-cutover picks (legacy score-quintile path).
  const stakeMeta = hcStakeTier ? (AGS_V12_STAKE_TIER_META[hcStakeTier] || null) : null;
  const isMonitoring = hcStakeTier === 'MONITORING';
  const isConfirmed = hcStakeTier === 'CONFIRMED';
  const isMini = hcStakeTier === 'MINI';
  const isMiniMinus = hcStakeTier === 'MINI-';
  // RANK-RESCUE (2-for-0 wallet slice). Staked off sharp-wallet consensus, NOT
  // the v12 score quintile — so the card must NOT lead with the (often WEAK)
  // score or it reads as a low-quality pick. It gets its own violet identity.
  const isRank = hcStakeTier === 'RANK';
  // v12abc SHARP-RESCUE (proven-$ + win-rate consensus). Like RANK, these are
  // rescued from a (usually WEAK) score, so they get their own violet identity
  // and the stake strip rather than the misleading score-quintile strip.
  const isSharp = hcStakeTier === 'SHARP' || hcStakeTier === 'SHARP-PRIME';
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const isGraded = status === 'COMPLETED' && !!outcome;
  const isWin = outcome === 'WIN';
  const isLoss = outcome === 'LOSS';
  const healthStatus = health?.status || 'ACTIVE';
  const isMuted = healthStatus === 'MUTED';
  const isCancelled = healthStatus === 'CANCELLED';
  const isTrackedGrade = isGraded && !!trackedOnly;

  const tierKey = agsTierV12 || agsTier || lockTier || 'LOCK';
  // v12abc — EVERY product stake tier (incl. SUPER/TOP) drives the strip from
  // the user-facing conviction meta, so the pill always reads as a plain
  // strength (MAX/STRONG/LEAN…), never the internal score-quintile. Only legacy
  // picks (no stamped stake tier → stakeMeta null) fall back to the score tier.
  const useStakeStrip = !!stakeMeta;
  const tierMeta = useStakeStrip ? stakeMeta : (AGS_TIER_META[tierKey] || AGS_TIER_META.LOCK);
  const accent = isCancelled ? B.red
    : isMuted ? '#F59E0B'
    : isGraded ? (isWin ? B.green : isLoss ? B.red : B.gold)
    : useStakeStrip ? stakeMeta.color
    : (LOCK_TIER_ACCENT[tierKey] || tierMeta.color || B.green);

  const score = agsValueV12 != null ? agsValueV12 : agsValue;
  // Display the literal AGSU V12 score on a 0–100 face (raw score ×100),
  // so the number on the gauge IS the real model score, not a re-mapping.
  const conviction = (score != null && Number.isFinite(score))
    ? Math.max(0, Math.min(100, Math.round(score * 100)))
    : 0;
  const backers = Array.isArray(backingWallets) ? backingWallets.length : 0;
  // Qualified backers = proven sport winners (whitelist CONFIRMED/FLAT) that
  // the model actually COUNTED (≥ 0.10× conviction) — matches the cron's
  // whitelist consensus, not the raw tracked-wallet list.
  const provenBackers = Array.isArray(backingWallets)
    ? backingWallets.filter(w => w && isModelCounted(w) && isSportWinner(String(w.wallet || '').slice(-6), sport)).length
    : 0;

  const isTotal = marketType === 'total';
  // TOTAL picks split Over vs Under — never "44% 9.5 · 56% Astros".
  const totalDir = isTotal ? ((team || '').toLowerCase().startsWith('under') ? 'Under' : 'Over') : null;
  const teamShort = isTotal ? totalDir : ((team || '').split(' ').pop() || team);
  const awayShort = (away || '').split(' ').pop() || away;
  const homeShort = (home || '').split(' ').pop() || home;
  const otherTeam = isTotal
    ? (totalDir === 'Over' ? 'Under' : 'Over')
    : (teamShort === awayShort ? homeShort : awayShort);
  const pickLabel = marketType === 'spread'
    ? `${teamShort} ${line > 0 ? '+' : ''}${line}`
    : isTotal ? (team || 'Total')
    : `${teamShort} ML`;
  const marketTag = marketType === 'spread' ? 'SPREAD' : isTotal ? 'TOTAL' : 'ML';

  const fmtO = (o) => (o == null ? '—' : o > 0 ? `+${o}` : `${o}`);
  const fmtV = (v) => (v == null ? '—' : v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`);
  const fmtET = (ts) => {
    if (!ts) return '';
    const e = typeof ts === 'number' ? ts : Date.parse(ts);
    if (isNaN(e)) return typeof ts === 'string' ? ts : '';
    return new Date(e).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true });
  };
  const fmtU = (u) => (Number.isFinite(u) ? (u < 1 ? u.toFixed(2) : u % 1 === 0 ? u.toFixed(0) : u.toFixed(1)) : '—');

  const ip = (o) => (o == null ? null : o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100));
  const lockProb = ip(odds);
  const closeProb = ip(closingOdds);
  const liveCLV = (lockProb != null && closeProb != null) ? +(closeProb - lockProb).toFixed(4) : null;
  const clvPct = liveCLV != null ? +(liveCLV * 100).toFixed(1) : null;
  const fairProb = ip(pinnacleOdds);
  const toWin = profitFromOdds(odds, units);
  const moneyPct = consensusStrength?.moneyPct;

  const gameEpoch = gameTime ? (typeof gameTime === 'number' ? gameTime : Date.parse(gameTime)) : null;
  const gameStarted = gameEpoch != null && !isNaN(gameEpoch) && Date.now() >= gameEpoch;

  // Sealed state — starts at lock (15 min before first pitch/kick) and is worn
  // through the live game until the pick grades. Ticks every 15s until the
  // game starts (so the banner appears on time and flips to LIVE), then the
  // seal is permanent and the timer retires.
  const [sealNow, setSealNow] = useState(() => Date.now());
  useEffect(() => {
    if (gameEpoch == null || isNaN(gameEpoch) || isGraded || Date.now() >= gameEpoch) return undefined;
    const id = setInterval(() => setSealNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, [gameEpoch, isGraded]);
  // Monitoring cards are tracked, not staked — nothing to lock, so they never
  // wear the countdown pill or the seal.
  const isSealed = gameEpoch != null && !isNaN(gameEpoch) && !isGraded && !isCancelled
    && !isMonitoring && sealNow >= gameEpoch - LOCK_LEAD_MS;
  const sealLive = isSealed && sealNow >= gameEpoch;

  // Header vocabulary borrowed verbatim from the live Sharp Position card:
  // a sport badge, the matchup with the pick side weighted bright, and the
  // unified state·stars·tier·units strip.
  const ss = sportStyle(sport);
  const tierStars = useStakeStrip ? (stakeMeta.stars || 0) : starsFromAgsuTier(tierKey);
  const statePill = isCancelled ? 'VOID' : isMuted ? 'MUTE' : superseded ? 'FLIP'
    : isGraded ? (isWin ? 'WON' : isLoss ? 'LOST' : 'PUSH')
    : isMonitoring ? 'WATCH' : 'PLAY';
  const pickIsAway = !isTotal && teamShort === awayShort;
  const pickIsHome = !isTotal && teamShort === homeShort;

  const matchupEl = (
    <span style={{
      ...T.body, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden',
      textOverflow: 'ellipsis', minWidth: 0,
      textDecoration: isCancelled ? 'line-through' : 'none',
    }}>
      <span style={{ color: pickIsAway ? B.text : B.textSec, fontWeight: pickIsAway ? 800 : 600 }}>{awayShort}</span>
      <span style={{ color: B.textMuted, fontWeight: 400 }}> vs </span>
      <span style={{ color: pickIsHome ? B.text : B.textSec, fontWeight: pickIsHome ? 800 : 600 }}>{homeShort}</span>
    </span>
  );

  const tierStrip = (
    <span
      title={hcStakeTier ? `Path: ${hcStakeTier}${AGS_V12_STAKE_PATH[hcStakeTier] ? ` · ${AGS_V12_STAKE_PATH[hcStakeTier]}` : ''}` : undefined}
      style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0,
      padding: '0.3rem 0.55rem', borderRadius: '6px',
      background: `${accent}14`, border: `1px solid ${accent}40`, color: accent,
      fontFeatureSettings: "'tnum'",
    }}>
      {statePill !== 'PLAY' && (
        <span style={{ fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.08em', padding: '0.18rem 0.36rem', borderRadius: '3px', background: accent, color: '#0a0a0a', lineHeight: 1 }}>{statePill}</span>
      )}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.05rem' }}>
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= Math.floor(tierStars);
          const half = !filled && i + 0.5 === tierStars;
          return filled
            ? <span key={i} style={{ fontSize: '0.5rem', color: accent, lineHeight: 1 }}>★</span>
            : half
            ? <span key={i} style={{ position: 'relative', display: 'inline-block', fontSize: '0.5rem', lineHeight: 1, width: '0.5rem' }}><span style={{ color: 'rgba(255,255,255,0.15)' }}>★</span><span style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', width: '50%', color: accent }}>★</span></span>
            : <span key={i} style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>★</span>;
        })}
      </span>
      <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.05em', lineHeight: 1 }}>{tierMeta.label}</span>
    </span>
  );

  // Bettor-first stat block: the stake and price read as boldly as our
  // AGSU conviction, so the actionable numbers don't take a back seat.
  const StatCol = ({ label, value, color, meter }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.26rem', minWidth: '40px' }}>
      <span style={{ fontSize: '1.18rem', fontWeight: 800, color, fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '0.42rem', fontWeight: 800, color: B.textSubtle, letterSpacing: '0.11em', lineHeight: 1, whiteSpace: 'nowrap' }}>{label}</span>
      {meter && (
        <div style={{ width: '30px', height: '2.5px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div style={{ width: `${Math.max(0, Math.min(100, conviction))}%`, height: '100%', background: accent, borderRadius: '2px' }} />
        </div>
      )}
    </div>
  );
  const StatDivider = () => <div style={{ width: '1px', alignSelf: 'stretch', minHeight: '26px', background: B.borderSubtle }} />;
  const statBlock = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexShrink: 0 }}>
      <StatCol label="ODDS" value={fmtO(odds)} color={B.text} />
      <StatDivider />
      {isGraded
        ? <StatCol label="P&L" value={`${(isTrackedGrade ? 0 : (profit || 0)) > 0 ? '+' : ''}${(isTrackedGrade ? 0 : (profit || 0)).toFixed(1)}u`} color={isWin ? B.green : isLoss ? B.red : B.textSec} />
        : <StatCol label="STAKE" value={Number.isFinite(units) && units > 0 ? `${fmtU(units)}u` : '—'} color={B.text} />}
      <StatDivider />
      {(isRank || isSharp)
        ? <StatCol label="QUALIFIED" value={provenBackers > 0 ? provenBackers : (backers > 0 ? backers : '—')} color={accent} />
        : <StatCol label="AGSU V12" value={conviction > 0 ? conviction : '—'} color={accent} meter />}
    </div>
  );

  // v12abc — the single conviction pill (stars + MAX/STRONG/LEAN… colored by the
  // gradient) is now the ONLY tier tag on the card, so there is no separate
  // header ribbon to double-label against. MAX/TOP plays read premium via the
  // gold pill + gold card glow instead of a standalone gold ribbon.
  const topBadge = null;

  // Secondary context only: book · time (+ CLV when graded). The stake and
  // price now live in the bold stat block, so they're no longer buried here.
  const metaLine = (
    <span style={{ fontSize: '0.62rem', color: B.textMuted, letterSpacing: '0.01em', fontFeatureSettings: "'tnum'" }}>
      {book || ''}
      {gameTime ? `${book ? ' · ' : ''}${isGraded ? (gameStarted ? 'Final' : fmtET(gameTime)) : fmtET(gameTime) + ' ET'}` : ''}
      {isGraded && clvPct != null ? <span style={{ color: clvPct > 0 ? B.green : clvPct < 0 ? B.red : B.textMuted, fontWeight: 700 }}> · CLV {clvPct > 0 ? '+' : ''}{clvPct}%</span> : null}
    </span>
  );

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="sf-glass"
      style={{
        position: 'relative', borderRadius: '16px', overflow: 'hidden',
        background: open
          ? 'linear-gradient(180deg, rgba(28,33,48,0.97) 0%, rgba(18,23,35,0.98) 100%)'
          : 'linear-gradient(180deg, rgba(23,28,42,0.93) 0%, rgba(15,19,30,0.95) 100%)',
        border: `1px solid ${isSealed ? 'rgba(16,185,129,0.32)' : open ? `${accent}3a` : hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.065)'}`,
        boxShadow: (open
          ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 26px 58px -22px rgba(0,0,0,0.85), 0 0 24px -12px ${accent}33`
          : hover
          ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 34px -18px rgba(0,0,0,0.7)'
          : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px -16px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.45)')
          + (isSealed ? ', 0 0 30px -12px rgba(16,185,129,0.55)' : ''),
        opacity: isCancelled ? 0.6 : isMuted || superseded || isTrackedGrade ? 0.78 : 1,
        transition: 'background .2s ease, border-color .2s ease, box-shadow .3s ease',
      }}
    >
      {/* Restrained tier cue — a soft corner light, not a full wash, so the
          card reads premium-neutral and the tiers don't all look green. */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(120% 78% at 100% 0%, ${accent}${open ? '20' : '10'} 0%, transparent 52%)` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px', background: isSealed ? B.green : accent, opacity: open ? 0.9 : 0.55 }} />

      {/* Sealed banner — the pick is locked (from 15 min before start). The
          card wears the emerald seal through the live game until the pick
          grades; the tail flips from the start time to LIVE at first
          pitch/kick. */}
      {isSealed && (
        <div className="sf-lock-seal" style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.4rem', padding: '0.34rem 0.9rem',
          background: 'linear-gradient(90deg, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.08) 50%, rgba(16,185,129,0.22) 100%)',
          borderBottom: '1px solid rgba(16,185,129,0.35)',
        }}>
          <Lock size={10} color={B.green} strokeWidth={2.8} />
          <span style={{ fontSize: '0.56rem', fontWeight: 900, letterSpacing: '0.2em', color: B.green, lineHeight: 1 }}>
            PICK LOCKED
          </span>
          <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(16,185,129,0.75)', fontFeatureSettings: "'tnum'", lineHeight: 1 }}>
            {sealLive ? '· LIVE' : `· STARTS ${fmtET(gameTime)} ET`}
          </span>
        </div>
      )}

      {/* Collapsed row — mirrors the live Sharp Position card header.
          Desktop keeps a single dense row; mobile stacks so the matchup,
          big odds, and tier strip each get room to breathe. */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'relative', width: '100%', cursor: 'pointer', background: 'transparent',
          border: 'none', textAlign: 'left', color: 'inherit', font: 'inherit', display: 'block',
        }}
      >
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', padding: '0.85rem 0.9rem' }}>
            {/* sport · matchup · top-pick · chevron */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
              <Badge color={ss.color} bg={ss.bg}>{ss.icon} {sport}</Badge>
              <span style={{ flex: 1, minWidth: 0, fontSize: '0.74rem' }}>{matchupEl}</span>
              {topBadge}
              <ChevronDown size={16} color={B.textMuted} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s ease' }} />
            </div>
            {/* the pick — hero */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isCancelled ? B.textMuted : B.text, letterSpacing: '-0.02em', lineHeight: 1.05, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: isCancelled ? 'line-through' : 'none' }}>{pickLabel}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                {tierStrip}
                {metaLine}
                {!isMonitoring && <LockCountdown gameTime={gameTime} isGraded={isGraded} />}
              </div>
            </div>
            {/* bettor stat block — full width, the actionable numbers */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-around',
              padding: '0.55rem 0.4rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.025)', border: `1px solid ${B.borderSubtle}`,
            }}>
              {statBlock}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 0.95rem' }}>
            <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                <Badge color={ss.color} bg={ss.bg}>{ss.icon} {sport}</Badge>
                {matchupEl}
                {topBadge}
              </div>
              <div style={{ fontSize: '1.22rem', fontWeight: 800, color: isCancelled ? B.textMuted : B.text, letterSpacing: '-0.02em', lineHeight: 1.05, textDecoration: isCancelled ? 'line-through' : 'none' }}>{pickLabel}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tierStrip}
                {metaLine}
                {!isMonitoring && <LockCountdown gameTime={gameTime} isGraded={isGraded} />}
              </div>
            </div>

            {statBlock}

            <ChevronDown size={16} color={B.textMuted} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s ease' }} />
          </div>
        )}
      </button>

      {/* Expanded sheet */}
      {open && (
        <div className="sf-reveal" style={{ position: 'relative' }}>
          {/* Sharp consensus + AGSU V12 verdict — brand-matched to the
              live Sharp Position card (checklist drivers + semicircle gauge). */}
          <div style={{ position: 'relative', borderTop: `1px solid ${B.border}`, padding: '0.9rem 1rem 0' }}>
            <div style={{
              borderRadius: '12px', padding: '0.8rem 0.85rem',
              background: `linear-gradient(135deg, ${accent}16 0%, ${accent}07 58%, transparent 100%)`,
              border: `1px solid ${accent}22`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.55rem', color: B.textSubtle, letterSpacing: '0.12em', fontWeight: 800 }}>SHARP CONSENSUS</span>
                {evEdge != null && (
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: evEdge > 0 ? B.green : B.textSec, fontFeatureSettings: "'tnum'", letterSpacing: '0.02em' }}>
                    {evEdge > 0 ? '+' : ''}{evEdge}% EDGE
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SlkDriver met={provenBackers > 0} label={`Proven ${sport || 'sport'} winners backing`} detail={provenBackers > 0 ? `${provenBackers}` : '—'} color={accent} />
                  <SlkDriver met={(hcConfFor || 0) > 0} label="High-conviction sharps confirming" detail={(hcConfFor || 0) > 0 ? `${hcConfFor} HC` : '—'} color={accent} />
                  <SlkDriver met={moneyPct != null && moneyPct >= 60} label="Money concentrated on this side" detail={moneyPct != null ? `${moneyPct}%` : '—'} color={accent} />
                </div>
                <SlkRing value={conviction} color={accent} tier={isGraded ? outcome : tierMeta.label} run={open} />
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <SlkPayRow label={isGraded ? 'Settled' : 'Locked'} value={fmtO(odds)} sub={`${book || ''}${pinnacleOdds ? ` · fair ${fmtO(pinnacleOdds)}` : ''}`} color={isGraded ? B.text : B.green} />
              <SlkPayRow
                label={isGraded ? 'Result' : 'Payout'}
                value={isGraded ? `${(profit || 0) > 0 ? '+' : ''}${(isTrackedGrade ? 0 : (profit || 0)).toFixed(2)}u` : `+${toWin.toFixed(2)}u`}
                sub={isGraded ? `${outcome} · ${fmtU(units)}u` : `on ${fmtU(units)}u risk`}
                color={isGraded ? (isWin ? B.green : isLoss ? B.red : B.textSec) : B.green}
              />
            </div>
          </div>

          {/* Why locked */}
          <div style={{ padding: '1.1rem 1rem 0' }}>
            <SlkLabel>WHY IT'S LOCKED</SlkLabel>
            <p style={{ fontSize: '0.92rem', color: B.text, lineHeight: 1.5, margin: '0.6rem 0 0', fontWeight: 500 }}>
              {Array.isArray(backingWallets) && backingWallets.length > 0
                ? (provenBackers > 0
                    ? <><b>{provenBackers}</b> proven {(sport || '').toUpperCase()} winner{provenBackers === 1 ? '' : 's'} back {teamShort}{backingWallets.length > provenBackers ? <span style={{ color: B.textMuted, fontWeight: 500 }}> ({backingWallets.length} tracked wallets, {fmtV(totalInvested)})</span> : <> (<b>{fmtV(totalInvested)}</b>)</>}</>
                    : <>{backingWallets.length} tracked {backingWallets.length === 1 ? 'wallet' : 'wallets'} put <b>{fmtV(totalInvested)}</b> behind {teamShort}</>)
                : <>Sharp money locked behind {teamShort}</>}
              {moneyPct != null && <span style={{ color: accent, fontWeight: 700 }}> — {moneyPct}% of sharp money</span>}
              {moneyPct != null && moneyPct >= 100 ? ', zero dissent.' : '.'}
            </p>
          </div>

          {/* Receipts (reuses the enriched wallet strip) */}
          {Array.isArray(backingWallets) && backingWallets.length > 0 && (
            <BackingWalletStrip wallets={backingWallets} sport={sport} accent={accent} isMobile={isMobile} />
          )}

          {/* Sharp money split */}
          {moneyPct != null && totalInvested != null && (
            <SlkMoney totalInvested={totalInvested} moneyPct={moneyPct} teamShort={teamShort} otherTeam={otherTeam} accent={accent} run={open} />
          )}

          {/* Line history + CLV */}
          <div style={{ padding: '1.1rem 1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <SlkLabel>{pickLabel} — LINE HISTORY</SlkLabel>
              {clvPct != null && <span style={{ fontSize: '0.6rem', fontWeight: 700, color: clvPct > 0 ? B.green : clvPct < 0 ? B.red : B.textMuted, fontFeatureSettings: "'tnum'" }}>CLV {clvPct > 0 ? '+' : ''}{clvPct}%</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: '0.6rem' }}>
              {[
                { label: book || 'Locked', value: fmtO(odds), color: B.text, first: true },
                { label: 'Pinnacle', value: fmtO(pinnacleOdds), color: B.textSec },
                { label: 'Now', value: fmtO(closingOdds), color: clvPct > 0 ? B.green : clvPct < 0 ? B.red : B.textSec },
              ].map((c, i) => (
                <div key={c.label} style={{ textAlign: c.first ? 'left' : 'center', borderLeft: c.first ? 'none' : `1px solid ${B.borderSubtle}`, paddingLeft: c.first ? 0 : '0.5rem' }}>
                  <div style={{ fontSize: '0.55rem', color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem', fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: c.color, fontFeatureSettings: "'tnum'", letterSpacing: '-0.01em' }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lifecycle */}
          {(lockedAt || peakAt || gameTime) && (
            <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {[
                  lockedAt && { label: 'Locked', time: fmtET(lockedAt), color: B.green },
                  peakAt && peakAt !== lockedAt && { label: 'Peak', time: fmtET(peakAt), color: B.gold },
                  gameTime && { label: 'Game', time: isGraded || gameStarted ? 'Final' : fmtET(gameTime), color: isGraded ? B.textMuted : accent },
                ].filter(Boolean).map((s, i, arr) => (
                  <Fragment key={s.label}>
                    {i > 0 && <div style={{ flex: 1, height: '1px', background: B.border, marginTop: '4px' }} />}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}99` }} />
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: s.color, letterSpacing: '0.03em' }}>{s.label}</span>
                      <span style={{ fontSize: '0.6rem', color: B.textMuted, fontFeatureSettings: "'tnum'" }}>{s.time}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

const LockedPickCard = memo(function LockedPickCard({ pick, isMobile }) {
  const { team, away, home, sport, stars, peakStars, lockStars, units, peakUnits, isDownsized, odds, book, peakAt, lockedAt, gameTime, status, outcome, profit, lockPinnOdds, closingOdds, clv, sharpCount, totalInvested, evEdge, lockEV, criteriaMet, criteria, consensusStrength, pinnacleOdds, marketType, line, superseded, health, lockTier, trackedOnly, isTopPick: isTopPickPre, isSuperTopPick: isSuperTopPickPre, walletConsensusDelta, walletConsensusForW, walletConsensusAgW, walletConsensusQualityMargin, walletConsensusQualityForT30, walletConsensusQualityAgT30, hcDominant, hcConfFor, hcConfAg, hcMargin, systemVersion, promotedBy, v73HcRescue, agsValue, agsTier, agsQuintile, agsProvenForCount, agsProvenAgCount, agsValueV12, agsTierV12, agsQuintileV12, backingWallets } = pick;
  // v12 is authoritative when stamped — every chip/badge that renders an
  // AGS number must speak v12 vocabulary (the lock-above-zero rule, the
  // tier-bucket Qs, the score). The legacy `agsValue` / `agsTier` /
  // `agsQuintile` stay available as a fallback for old graded docs that
  // pre-date v12 stamping.
  const agsValueDisplay   = agsValueV12 != null ? agsValueV12 : agsValue;
  const agsTierDisplay    = agsTierV12 || agsTier;
  const agsQuintileDisplay = agsQuintileV12 != null ? agsQuintileV12 : agsQuintile;
  // v7.1/v7.2/v7.3 — render the gold "HC ×N" chip when the pick is post-cutover
  // AGS-Unified v9 — the legacy HC / Σ / hc-dominance route chips are
  // retired. Diagnostic values still flow through so we can compute an
  // HC chip for picks that historically locked under v74-hc-margin
  // (display-only tag — does not affect sizing or lock decisions). All
  // active picks promote with promotedBy='ags-unified-v9'.
  const hcMarginVal = Number.isFinite(hcMargin)
    ? hcMargin
    : ((hcConfFor || 0) - (hcConfAg || 0));
  const isHcSuper    = hcMarginVal >= 2;
  const isHcStandard = hcMarginVal === 1;
  const showHcChip   = isHcSuper || isHcStandard;
  const hcChipMult   = isHcSuper ? '1.75' : '1.5';
  // Legacy promoted-by flags — only used on GRADED picks now (historical
  // attribution chips). Live picks read pure AGS-U tier; we no longer
  // surface a separate "rescued / Σ-floor / HC-promoted" treatment on
  // them because the AGS-U ladder is the sole sizing route.
  const wasSigma2Promoted = promotedBy === 'v72-sigma2-lock'
    || promotedBy === 'v72-sigma2-lean'
    || promotedBy === 'v73-sigma2-hc';
  const wasSigma1Promoted = promotedBy === 'v73-sigma1-hc';
  const wasHcRescued = promotedBy === 'v73-hc-rescue' || promotedBy === 'ags-rescue' || !!v73HcRescue;
  const [expanded, setExpanded] = useState(false);
  const ss = sportStyle(sport);
  const starDelta = (lockStars != null && stars != null) ? stars - lockStars : 0;
  // V8.4 two-tier TOP PICK system (replaces legacy starDelta ≥ 1.0 rule):
  //   • isTopPick       — regular gold-outlined ribbon (CLEAR_MOVE regime)
  //   • isSuperTopPick  — filled gold ribbon w/ glow (CLEAR_MOVE + meanBase_F ≥ 55)
  // Both flags are precomputed by evaluateTopPickTier() in the locked-list
  // builder so the rule can OR across lock + peak snapshots.
  const isTopPick = !!isTopPickPre;
  const isSuperTopPick = !!isSuperTopPickPre;
  // ── UNIFIED TIER LANGUAGE ──────────────────────────────────────────
  // The right-side rating chip, the top-left AGS pill, and the page-
  // level AGS-U Tier Scorecard all speak the same vocabulary so the
  // user can group picks by tier at a glance. When the cron has
  // stamped a v8_agsTier we use it VERBATIM — same label, same color,
  // same star count as the scorecard tile. Legacy star-bucket labels
  // (PREMIUM PLAY / SOLID PLAY / TRACKING / etc.) are only used as a
  // pre-cutover fallback for docs the v9 cron never re-stamped.
  const tierMetaForCard = (agsTier && AGS_TIER_META[agsTier]) ? AGS_TIER_META[agsTier] : null;
  const legacyStarLabels = {
    5: 'ELITE PLAY', 4.5: 'PREMIUM PLAY',
    4: 'STRONG PLAY', 3.5: 'STRONG PLAY',
    3: 'SOLID PLAY', 2.5: 'TRACKING',
    2: 'TRACKING', 1.5: 'DEVELOPING',
    1: 'HARD MUTE',
  };
  const starLabel = tierMetaForCard
    ? tierMetaForCard.label
    : (legacyStarLabels[stars] || (stars >= 3 ? 'SOLID PLAY' : 'HARD MUTE'));
  const starColor = tierMetaForCard
    ? tierMetaForCard.color
    : (stars >= 4 ? B.green : stars >= 3 ? B.gold : stars >= 2 ? B.gold : B.red);
  const starChipBg = tierMetaForCard
    ? tierMetaForCard.bg
    : (stars >= 4 ? B.greenDim : B.goldDim);
  const starChipBorder = tierMetaForCard
    ? `${tierMetaForCard.color}55`
    : (stars >= 4 ? 'rgba(16,185,129,0.2)' : B.goldBorder);
  // Display stars are tier-derived when a tier is present so the
  // icons can't visually disagree with the label (a PREMIUM tier
  // always shows ★★★★½, never four ★ with "PREMIUM" text).
  const displayStars = tierMetaForCard ? starsFromAgsuTier(agsTier) : stars;
  const isGraded = status === 'COMPLETED' && outcome;
  const isWin = outcome === 'WIN';
  const isLoss = outcome === 'LOSS';

  const healthStatus = health?.status || 'ACTIVE';
  // v5.6: keep MUTED/CANCELLED visual state even after the pick is graded.
  // Previously these flags flipped off once the result landed, which made a
  // muted losing play (e.g. Red Sox 2026-04-22) look identical to a normal
  // locked loss in the post-game card. Keeping the flag on preserves the
  // amber accent + WEAKENING badge so users can see the system told them to
  // stand down. Performance totals already exclude these (tallySides /
  // loadAllTimePnL / SharpFlowProfitChart all skip cancelled === true).
  const isMuted = healthStatus === 'MUTED';
  const isCancelled = healthStatus === 'CANCELLED';
  const healthReasons = health?.reasons || [];

  // AGS-Unified v12 tier flags. Every shipped tier gets its own flag so
  // the hero label + unit chip + accent color tell the user exactly
  // what stake the v12 ladder assigned (cron is authoritative — these
  // flags read v8_agsTier which is now v12-stamped):
  //
  //   ELITE   > v12 q80  → 5.00u — gold "ELITE LOCK · 5u"
  //   PREMIUM > v12 q60  → 3.00u — green "PREMIUM LOCK · 3u"
  //   LOCK    > v12 q40  → 1.00u — green "LOCKED · 1u"
  //   LEAN    > v12 q20  → 0.50u — blue  "LEAN · 0.5u"
  //   WEAK    > 0        → 0.25u — amber "WEAK · 0.25u"
  //   FADE    ≤ 0        → 0.00u — hard mute (no bet; renders as MUTED)
  //
  // (Quintile boundaries are computed on positive-only scores — see
  // src/lib/ags.js::agsV12TierFromValue + AGS_V12_FALLBACK_CALIBRATION.)
  //
  // Historical (v6 / v7) graded picks that WERE shipped at 0u keep the
  // tracked-only treatment via `isTrackedGrade` below — that legacy
  // record is preserved so PnL doesn't shift retroactively.
  const isElite   = lockTier === 'ELITE'   && !isGraded;
  const isPremium = lockTier === 'PREMIUM' && !isGraded;
  const isLock    = lockTier === 'LOCK'    && !isGraded;
  const isLean    = lockTier === 'LEAN'    && !isGraded;
  const isWeak    = lockTier === 'WEAK'    && !isGraded;

  // v7.4 fix — graded LEAN/0u tracked-only picks. The card still shows
  // the W/L outcome (informational — "would have won/lost") but the unit
  // chip reads 0u, the PnL reads 0.00u, and the visual treatment matches
  // graded MUTED picks (amber/blue accent, dimmed) so they never read
  // as a normal -1u loss line. Source of truth: the `trackedOnly` flag
  // computed by the locked-list builder, which honors result.tracked
  // from the Cloud Function grader plus the legacy unit/lockStage/v8
  // signals for picks graded before the grader fix.
  const isTrackedGrade = isGraded && !!trackedOnly;

  // AGS-Unified v9 DOWNSIZED gate — TIER-based, not unit-based.
  //
  // The legacy gate (`isDownsized = liveUnits < peakUnits`) was apples-
  // to-oranges: peak.units is a monotonic high-water mark that often
  // carries values from the pre-AGS-U sizing system (e.g. 3.0u from the
  // old 3-unit clamp at lock time), while live units come from the
  // AGS-U sizing ladder (band × base × odds-cap). That mismatch made
  // PREMIUM-tier picks render with "↓ 3u → 2.5u" strikethroughs even
  // though they're still top-quintile conviction — a contradiction the
  // user (correctly) called out as broken.
  //
  // Under AGS-U v9 the only thing that matters for "did this pick get
  // downgraded" is whether the AGS-U TIER itself stepped down meaning-
  // fully. We derive peak's tier from peak.stars (proxy that stamps on
  // every snapshot under both old + new sizing systems) and compare to
  // live tier. The chip fires only when:
  //   • Live tier dropped 2+ bands (e.g. ELITE → LOCK), or
  //   • Live tier fell out of the lock tiers into LEAN/WEAK regardless
  //     of how far it dropped (a meaningful conviction collapse).
  // It is silent on 1-band drops within the top tiers (ELITE→PREMIUM,
  // PREMIUM→LOCK) because those picks are still high-conviction and
  // the tier ribbon already conveys the live conviction level.
  const AGSU_TIER_RANK = { ELITE: 5, PREMIUM: 4, LOCK: 3, LEAN: 2, WEAK: 1, FADE: 0 };
  const peakTierFromStars = peakStars == null
    ? null
    : peakStars >= 5.0 ? 'ELITE'
    : peakStars >= 4.5 ? 'PREMIUM'
    : peakStars >= 4.0 ? 'LOCK'
    : peakStars >= 3.0 ? 'LEAN'
    : peakStars >= 2.5 ? 'WEAK'
    : 'FADE';
  const liveTierForRank = lockTier;
  const peakRank = AGSU_TIER_RANK[peakTierFromStars] ?? 0;
  const liveRank = AGSU_TIER_RANK[liveTierForRank] ?? 0;
  const meaningfulTierDrop = peakRank > 0 && liveRank > 0
    && ( (peakRank - liveRank) >= 2 || (liveRank <= 2 && peakRank >= 3) );
  const showDownsize = meaningfulTierDrop && !isGraded && !isMuted && !isCancelled && !superseded;
  const DOWNSIZE_AMBER = '#D4AF37'; // gold/amber — less severe than #F59E0B (mute)
  // Tier accent colors are sourced from AGS_TIER_META so the lock
  // card body (money bars, tier chips, tier transitions, narrative
  // copy) speaks the same palette as the top-of-page AGS-U Tier
  // Scorecard and the right-side rating chip. The legacy names
  // (LEAN_BLUE / WEAK_AMBER / ELITE_GOLD) are kept so all existing
  // usages don't have to be renamed — only their underlying value
  // shifts: LEAN went blue → yellow, WEAK stays orange-family,
  // ELITE went gold → AGS green. Previously the LEAN card had a
  // yellow scorecard tile and yellow outer chips but a blue body,
  // and the user (correctly) called that out as broken.
  const LEAN_BLUE     = AGS_TIER_META.LEAN.color;  // #facc15 yellow — was #60A5FA
  const WEAK_AMBER    = AGS_TIER_META.WEAK.color;  // #f97316 orange — was #F59E0B
  const ELITE_GOLD    = AGS_TIER_META.ELITE.color; // #16a34a green  — was #D4AF37
  // Tier accent ordering (worst→best so each clobbers the prior in a
  // ternary chain): CANCELLED > MUTED > TRACKED > FADE-class (none, we
  // mute upstream) > WEAK > LEAN > LOCK (default green) > PREMIUM > ELITE.
  // Graded LEAN picks adopt the LEAN-blue palette so their card chrome
  // reads "tracked, no money at risk" instead of normal win/loss colors.
  const accentColor = isCancelled ? B.red
    : isMuted ? '#F59E0B'
    : isTrackedGrade ? LEAN_BLUE
    : isElite ? ELITE_GOLD
    : isPremium ? B.green
    : isLean ? LEAN_BLUE
    : isWeak ? WEAK_AMBER
    : showDownsize ? DOWNSIZE_AMBER
    : isGraded ? (isWin ? B.green : isLoss ? B.red : B.gold)
    : B.green;
  // Authoritative display label for TOTAL picks. We ALWAYS re-derive the
  // label from `line` (which itself falls through peak.line → lock.line →
  // closingLine in the upstream selector) instead of trusting whatever
  // string is in `team`. Two real bugs this catches:
  //
  //   1. Bare "OVER" / "UNDER" stamped by the older cron path before the
  //      2026-05-10 team-label fix (still in already-written docs).
  //   2. Corrupted "Over 1" / "Under 1" baked in when consensusLine
  //      picked up a Polymarket entryLine=1 placeholder at lock time
  //      (NBA SAS/MIN total incident, 2026-05-10). Even after peak.line
  //      gets refreshed to the real value, the team field stayed "Over 1"
  //      and the old renderer trusted it verbatim.
  //
  // Strategy: extract the over/under direction from team (case-insensitive,
  // tolerant of "Over X"/"OVER"/"over"), then combine with the live line
  // when it's a plausible total. Fall back to bare direction when line is
  // missing/garbage so the user at least sees "Over" instead of "Over 1".
  const displayTeam = (() => {
    if (marketType !== 'total') return team;
    const tStr = (team || '').trim();
    const m = tStr.match(/^(over|under)/i);
    if (!m) return team;
    const dir = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
    // Plausibility: every real total is ≥ 1.5 (NHL ~5, MLB ~7, NBA ~210).
    // Reject the entryLine=1 garbage explicitly.
    if (Number.isFinite(line) && line >= 1.5) return `${dir} ${line}`;
    return dir;
  })();
  // TOTAL picks label as Over/Under — the last-word split would yield the
  // line number ("9.5") and pair it against a team name in money splits.
  const dtIsTotal = /^(over|under)/i.test(displayTeam || '');
  const dtDir = dtIsTotal ? ((displayTeam || '').toLowerCase().startsWith('under') ? 'Under' : 'Over') : null;
  const teamShort = dtIsTotal ? dtDir : (displayTeam?.split(' ').pop() || displayTeam);
  const awayShort = away?.split(' ').pop() || away;
  const homeShort = home?.split(' ').pop() || home;
  const otherTeam = dtIsTotal
    ? (dtDir === 'Over' ? 'Under' : 'Over')
    : (teamShort === awayShort ? homeShort : awayShort);
  const ut = unitTier(units);
  const potentialWin = profitFromOdds(odds, units);

  const fmtET = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true });
  };
  const fmtV = (v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`;
  const fmtO = (o) => o > 0 ? `+${o}` : `${o}`;

  const betOdds = odds || lockPinnOdds;
  const lockProb = betOdds ? (betOdds < 0 ? Math.abs(betOdds) / (Math.abs(betOdds) + 100) : 100 / (betOdds + 100)) : null;
  const closeProb = closingOdds ? (closingOdds < 0 ? Math.abs(closingOdds) / (Math.abs(closingOdds) + 100) : 100 / (closingOdds + 100)) : null;
  const liveCLV = (lockProb && closeProb) ? +(closeProb - lockProb).toFixed(4) : null;
  const clvPct = liveCLV != null ? (liveCLV * 100).toFixed(1) : null;
  const clvPositive = liveCLV != null && liveCLV > 0;
  const pinnProb = pinnacleOdds ? (pinnacleOdds < 0 ? Math.abs(pinnacleOdds) / (Math.abs(pinnacleOdds) + 100) : 100 / (pinnacleOdds + 100)) : null;

  const criteriaList = criteria ? [
    { key: 'sharps3Plus', label: '3+ Sharp Bettors', met: criteria.sharps3Plus },
    { key: 'plusEV', label: '+EV Edge', met: criteria.plusEV },
    { key: 'pinnacleConfirms', label: 'Pinnacle Confirms', met: criteria.pinnacleConfirms },
    { key: 'invested10kPlus', label: '$10K+ on Side', met: criteria.invested10kPlus },
    { key: 'lineMovingWith', label: 'Line Moving With Play', met: criteria.lineMovingWith },
    { key: 'predMarketAligns', label: 'Pred. Market Aligns', met: criteria.predMarketAligns },
  ] : [];
  const metCount = criteriaMet || criteriaList.filter(c => c.met).length;
  const avgBet = (sharpCount && totalInvested) ? Math.round(totalInvested / sharpCount) : null;

  // AGS-Unified v9 tier-color spine. Single source of truth for the
  // tier-color stripe on the left edge of the card AND the top accent
  // bar. Colors pull DIRECTLY from AGS_TIER_META so the card spine,
  // the top-left tier ribbon, the right-side rating chip, AND the
  // page-level AGS-U Tier Scorecard all share one palette. Previously
  // a LEAN card had a blue spine while the LEAN scorecard tile was
  // yellow — same tier, different colors, broke visual grouping.
  // Worst→best order so the most severe state wins ties.
  const spineTierMeta = AGS_TIER_META[lockTier] || null;
  const tierSpineColor =
      isCancelled    ? '#EF4444'
    : isMuted        ? '#F59E0B'
    : isTrackedGrade ? LEAN_BLUE
    : spineTierMeta  ? spineTierMeta.color
    : superseded     ? '#EF4444'
    : isTopPick      ? '#D4AF37'
    : isGraded ? (isWin ? B.green : isLoss ? '#EF4444' : B.gold)
    : B.green;
  const tierSpineSoft =
      isCancelled    ? 'rgba(239,68,68,0.35)'
    : isMuted        ? 'rgba(245,158,11,0.35)'
    : isTrackedGrade ? 'rgba(96,165,250,0.35)'
    : spineTierMeta  ? `${spineTierMeta.color}66`
    : superseded     ? 'rgba(239,68,68,0.30)'
    : isTopPick      ? 'rgba(212,175,55,0.45)'
    // Graded picks: border tints with the outcome so a stack of
    // resolved cards reads at a glance — wins glow green, losses
    // glow red. Pushes downstream from the default "always faint
    // green" border that was making graded LOSS picks look identical
    // to graded WIN picks (and made the whole tab feel "muted" vs
    // the live tab).
    : isGraded && isWin  ? 'rgba(16,185,129,0.30)'
    : isGraded && isLoss ? 'rgba(239,68,68,0.30)'
    : isGraded           ? 'rgba(212,175,55,0.25)'
    : 'rgba(16,185,129,0.20)';

  return (
    <div className="sf-card sf-glass" style={{
      borderRadius: '16px', overflow: 'hidden', position: 'relative',
      opacity: isCancelled ? 0.45 : isMuted ? 0.65 : superseded ? 0.55 : isTrackedGrade ? 0.7 : 1,
      background: superseded
        ? 'linear-gradient(160deg, rgba(26,31,46,0.72) 0%, rgba(21,25,35,0.66) 45%, rgba(17,21,31,0.78) 100%)'
        : isTrackedGrade
        ? 'linear-gradient(160deg, rgba(96,165,250,0.05) 0%, rgba(21,25,35,0.66) 30%, rgba(17,21,31,0.78) 100%)'
        : isElite
        ? 'linear-gradient(160deg, rgba(212,175,55,0.09) 0%, rgba(21,25,35,0.66) 30%, rgba(17,21,31,0.78) 100%)'
        : isLean
        ? 'linear-gradient(160deg, rgba(250,204,21,0.05) 0%, rgba(21,25,35,0.66) 30%, rgba(17,21,31,0.78) 100%)'
        : isWeak
        ? 'linear-gradient(160deg, rgba(245,158,11,0.05) 0%, rgba(21,25,35,0.66) 30%, rgba(17,21,31,0.78) 100%)'
        // Graded picks get a very faint outcome wash — wins drift
        // green, losses drift red — so the Yesterday tab reads with
        // the same visual richness as the Live tab instead of all
        // cards looking identical and "muted".
        : isGraded && isWin
        ? 'linear-gradient(160deg, rgba(16,185,129,0.06) 0%, rgba(21,25,35,0.66) 35%, rgba(17,21,31,0.78) 100%)'
        : isGraded && isLoss
        ? 'linear-gradient(160deg, rgba(239,68,68,0.05) 0%, rgba(21,25,35,0.66) 35%, rgba(17,21,31,0.78) 100%)'
        : isTopPick && !isMuted && !isCancelled
        ? 'linear-gradient(160deg, rgba(212,175,55,0.07) 0%, rgba(21,25,35,0.66) 30%, rgba(17,21,31,0.78) 100%)'
        : 'linear-gradient(160deg, rgba(26,31,46,0.72) 0%, rgba(21,25,35,0.66) 45%, rgba(17,21,31,0.78) 100%)',
      border: `1px solid ${tierSpineSoft}`,
      boxShadow: isCancelled || isMuted || superseded || isTrackedGrade ? '0 8px 24px rgba(0,0,0,0.25)'
        : isElite
        ? '0 0 24px rgba(212,175,55,0.22), 0 0 48px rgba(212,175,55,0.08), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)'
        : isSuperTopPick
        ? '0 0 24px rgba(212,175,55,0.18), 0 0 48px rgba(212,175,55,0.06), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)'
        : isTopPick
        ? '0 0 20px rgba(212,175,55,0.12), 0 0 40px rgba(212,175,55,0.04), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)'
        : isWin ? '0 0 16px rgba(16,185,129,0.04), 0 8px 24px rgba(0,0,0,0.3)' : isLoss ? '0 0 16px rgba(239,68,68,0.04), 0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
    }}>
      {/* Left tier-spine — 4px stripe in the AGS-U tier color so the
          conviction tier is scannable at a glance when the cards are
          stacked in a list. Replaces the legacy top accent that was
          easy to miss. */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
        background: `linear-gradient(180deg, ${tierSpineColor} 0%, ${tierSpineColor} 100%)`,
        boxShadow: isElite ? `0 0 12px ${tierSpineColor}aa` : 'none',
        pointerEvents: 'none',
      }} />
      {/* Top accent — kept thin (2px) so the left spine reads as the
          primary tier marker. Color matches the spine. */}
      <div style={{ height: '2px', background: `linear-gradient(90deg, transparent 0%, ${tierSpineColor} 50%, transparent 100%)`, opacity: 0.55 }} />

      {/* ─── Collapsed: compact summary ─── */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.625rem 0.875rem 0.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <Badge color={ss.color} bg={ss.bg}>{ss.icon} {sport}</Badge>
            {marketType && marketType !== 'ml' && (
              <Badge color={marketType === 'spread' ? '#8B5CF6' : '#F59E0B'} bg={marketType === 'spread' ? 'rgba(139,92,246,0.12)' : 'rgba(245,158,11,0.12)'}>
                {marketType === 'spread' ? 'SPREAD' : 'TOTAL'}
              </Badge>
            )}
            {superseded && (
              <Badge color="#EF4444" bg="rgba(239,68,68,0.12)">FLIPPED</Badge>
            )}
            {isCancelled && (
              <Badge color="#EF4444" bg="rgba(239,68,68,0.12)">CANCELLED</Badge>
            )}
            {isMuted && !isCancelled && (
              <Badge color="#F59E0B" bg="rgba(245,158,11,0.12)">WEAKENING</Badge>
            )}
            {isTrackedGrade && !isMuted && !isCancelled && !superseded && (
              <span
                title={`TRACKED-ONLY — this side was logged but auto-sized at 0u (AGS-U hard mute / FADE tier), or it's a legacy v6/v7 graded LEAN that shipped at 0u before AGS-U v9. The W/L outcome is informational; no money was at risk and no PnL is recorded.`}
                style={{
                  ...T.micro, fontWeight: 800, letterSpacing: '0.05em',
                  padding: '0.15rem 0.5rem', borderRadius: '4px',
                  color: '#60A5FA', background: 'rgba(96,165,250,0.12)',
                  border: '1px solid rgba(96,165,250,0.35)',
                }}
              >
                TRACKED
              </span>
            )}
            {/* AGS-Unified v9 tier ribbon — the SOLE source of conviction
                truth in the header. Drives directly from `lockTier` (not
                the gated isElite/isPremium/etc flags) so GRADED picks
                also retain their tier identity badge on the Yesterday
                tab — knowing "this was a PREMIUM win" or "this was a
                LEAN loss" is critical for retrospective analysis.
                Suppressed only when the pick is genuinely off-state:
                muted, cancelled, superseded by a reflip, or tracked-only
                (LEAN-style 0u tracking grades render TRACKED instead).
                For graded picks, the ribbon is slightly desaturated so
                the WIN/LOSS outcome chip remains the dominant signal. */}
            {!isMuted && !isCancelled && !superseded && !isTrackedGrade && (() => {
              // v12-first AGS for the chip (see destructure above).
              const agsTxt = (agsValueDisplay != null && Number.isFinite(agsValueDisplay))
                ? `${agsValueDisplay >= 0 ? '+' : ''}${agsValueDisplay.toFixed(2)}`
                : null;
              // Tier ribbon colors are pulled DIRECTLY from AGS_TIER_META
              // so the ribbon, the right-side rating chip, and the
              // page-level AGS-U Tier Scorecard all share one color
              // palette (ELITE dark-green → PREMIUM green → LOCK lime →
              // LEAN yellow → WEAK orange → FADE red). Previously each
              // surface had its own ad-hoc color per tier (LEAN was
              // blue here but yellow in the scorecard) which broke the
              // visual grouping the user needs to scan picks fast.
              const tierStakes = {
                ELITE:   { stake: '5u',     tipBand: '> v12 q80 (top quintile of positive scores)' },
                PREMIUM: { stake: '3u',     tipBand: '> v12 q60' },
                LOCK:    { stake: '1u',     tipBand: '> v12 q40' },
                LEAN:    { stake: '0.5u',   tipBand: '> v12 q20' },
                WEAK:    { stake: '0.25u',  tipBand: '> 0 (lowest positive)' },
              };
              const tierMetaPalette = AGS_TIER_META[lockTier];
              const tierStakeMeta = tierStakes[lockTier];
              if (!tierMetaPalette || !tierStakeMeta) return null;
              // v12: render the ACTUAL cron-stamped unit size, not the
              // ladder default. Odds caps / regime trim can pull a
              // PREMIUM pick down to 2.5u — the chip must reflect that
              // truth or the user sees "PREMIUM · 3u" up top while the
              // body line shows "2.5u @ +160".
              const ribbonUnits = Number.isFinite(units) ? units : null;
              const ribbonStake = ribbonUnits != null
                ? `${ribbonUnits.toFixed(ribbonUnits >= 1 ? 1 : 2)}u`
                : tierStakeMeta.stake;
              const tierSpec = {
                label:   tierMetaPalette.label,
                stake:   ribbonStake,
                color:   lockTier === 'ELITE' ? '#fff' : tierMetaPalette.color,
                bg:      lockTier === 'ELITE'
                          ? `linear-gradient(135deg, ${tierMetaPalette.color} 0%, ${tierMetaPalette.color}cc 100%)`
                          : tierMetaPalette.bg,
                border:  `${tierMetaPalette.color}80`,
                glow:    lockTier === 'ELITE' ? `0 0 8px ${tierMetaPalette.color}66` : 'none',
                fontWeight: lockTier === 'ELITE' ? 900 : 800,
                tipBand: tierStakeMeta.tipBand,
              };
              const ribbonOpacity = isGraded ? 0.78 : 1;
              const ribbonGlow = isGraded ? 'none' : tierSpec.glow;
              return (
                <span
                  title={`AGS-U v12 ${tierSpec.label} tier${agsTxt ? ` (v12 score = ${agsTxt})` : ''} — ${tierSpec.tipBand}.${isGraded ? ' Outcome already graded.' : ''} Sizing ladder: ELITE 5u · PREMIUM 3u · LOCK 1u · LEAN 0.5u · WEAK 0.25u · FADE 0u (muted).`}
                  style={{
                    ...T.micro, fontWeight: tierSpec.fontWeight, letterSpacing: '0.05em',
                    padding: '0.2rem 0.55rem', borderRadius: '5px',
                    color: tierSpec.color, background: tierSpec.bg,
                    border: `1px solid ${tierSpec.border}`,
                    boxShadow: ribbonGlow,
                    opacity: ribbonOpacity,
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  }}
                >
                  <span>{tierSpec.label} · {tierSpec.stake}</span>
                </span>
              );
            })()}
            {showDownsize && peakTierFromStars && (
              <span
                title={`Conviction stepped down: peak ${peakTierFromStars} (${peakStars != null ? peakStars.toFixed(1) : '—'}★) → live ${liveTierForRank} (${stars != null ? stars.toFixed(1) : '—'}★). Live stake follows the AGS-U sizing ladder for the current tier.`}
                style={{
                  // Secondary visual: smaller + lower contrast so the
                  // AGS-U tier ribbon owns the conviction story. Chip
                  // fires ONLY on meaningful tier drops (≥2 bands OR
                  // fell into LEAN/WEAK from a lock tier), never on
                  // single-band transitions within the top tiers.
                  ...T.micro, fontWeight: 700, letterSpacing: '0.04em',
                  padding: '0.1rem 0.4rem', borderRadius: '3px',
                  color: DOWNSIZE_AMBER, background: 'rgba(212,175,55,0.07)',
                  border: '1px dashed rgba(212,175,55,0.30)',
                  opacity: 0.85,
                }}
              >
                ↓ {peakTierFromStars}→{liveTierForRank}
              </span>
            )}
            <span style={{ ...T.body, fontWeight: 700, color: isCancelled ? B.textMuted : B.text, textDecoration: isCancelled ? 'line-through' : 'none', ...(isMobile ? { flexBasis: '100%', marginTop: '0.15rem', fontSize: '0.9rem' } : {}) }}>
              {/* Masthead: the locked side reads bright, the opponent
                  recedes — verdict legible from the matchup alone.
                  Totals (no side team) keep both equal. */}
              {(() => {
                const pickIsHome = displayTeam && home && (displayTeam === home || home.includes(displayTeam) || displayTeam.includes(home));
                const pickIsAway = !pickIsHome && displayTeam && away && (displayTeam === away || away.includes(displayTeam) || displayTeam.includes(away));
                const hasSide = pickIsHome || pickIsAway;
                return (
                  <>
                    <span style={{
                      color: isCancelled ? B.textMuted : hasSide && !pickIsAway ? B.textSec : B.text,
                      fontWeight: hasSide && pickIsAway ? 800 : hasSide ? 600 : 700,
                    }}>{away}</span>
                    <span style={{ color: B.textMuted, fontWeight: 400 }}> vs </span>
                    <span style={{
                      color: isCancelled ? B.textMuted : hasSide && !pickIsHome ? B.textSec : B.text,
                      fontWeight: hasSide && pickIsHome ? 800 : hasSide ? 600 : 700,
                    }}>{home}</span>
                  </>
                );
              })()}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {isTopPick && !superseded && !isMuted && !isCancelled && (
              <span
                title={
                  isSuperTopPick
                    ? `${walletConsensusForW ?? '?'} proven ${sport} winners backing, ${walletConsensusAgW ?? 0} against (Δw=+${walletConsensusDelta ?? 2}, Δq=${(walletConsensusQualityMargin ?? 0) >= 0 ? '+' : ''}${walletConsensusQualityMargin ?? 0})`
                    : `${walletConsensusForW ?? 1} proven ${sport} winner backing, ${walletConsensusAgW ?? 0} against (Δw=+${walletConsensusDelta ?? 1}, Δq=${(walletConsensusQualityMargin ?? 0) >= 0 ? '+' : ''}${walletConsensusQualityMargin ?? 0})`
                }
                style={{
                  ...T.micro, fontWeight: 900, letterSpacing: '0.07em',
                  padding: '0.18rem 0.55rem', borderRadius: '5px',
                  whiteSpace: 'nowrap',
                  color: isSuperTopPick ? '#1A1404' : '#D4AF37',
                  background: isSuperTopPick
                    ? 'linear-gradient(120deg, #B8962E 0%, #E5C158 35%, #F5D060 50%, #E5C158 65%, #B8962E 100%)'
                    : 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(245,208,96,0.08) 100%)',
                  border: isSuperTopPick
                    ? '1px solid rgba(245,208,96,0.8)'
                    : '1px solid rgba(212,175,55,0.35)',
                  boxShadow: isSuperTopPick
                    ? '0 0 12px rgba(212,175,55,0.45), inset 0 1px 0 rgba(255,255,255,0.45)'
                    : 'none',
                  textShadow: isSuperTopPick ? '0 1px 0 rgba(255,255,255,0.25)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                }}
              >
                {isSuperTopPick ? <Zap size={9} strokeWidth={3} fill="#1A1404" /> : <TrendingUp size={9} strokeWidth={3} />}
                <span>{isSuperTopPick ? (isMobile ? 'SUPER' : 'SUPER TOP PICK') : (isMobile ? 'TOP' : 'TOP PICK')}</span>
              </span>
            )}
            {/* v6.1 — hero chips removed from header. The narrative + LOCK
                CRITERIA block below carry the winner/quality story in full
                sentences; chips duplicated the signal and crowded the header
                on mobile. Helper retained for possible reuse elsewhere. */}
            <span style={{
              ...T.micro, fontWeight: 800, letterSpacing: '0.04em',
              padding: '0.15rem 0.5rem', borderRadius: '5px',
              color: starColor, background: starChipBg,
              border: `1px solid ${starChipBorder}`,
              display: 'flex', alignItems: 'center', gap: '0.2rem',
            }}>
              {Array.from({ length: 5 }, (_, i) => {
                const filled = i + 1 <= Math.floor(displayStars);
                const half = !filled && i + 0.5 === displayStars;
                return filled ? <span key={i} style={{ fontSize: '0.5rem', color: starColor, lineHeight: 1 }}>★</span>
                  : half ? <span key={i} style={{ position: 'relative', display: 'inline-block', fontSize: '0.5rem', lineHeight: 1, width: '0.5rem' }}><span style={{ color: 'rgba(255,255,255,0.15)' }}>★</span><span style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', width: '50%', color: starColor }}>★</span></span>
                  : <span key={i} style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>★</span>;
              })}
            </span>
          </div>
        </div>

        {/* Bet row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.25rem 0.875rem 0.375rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={10} color={accentColor} />
            <span style={{ ...T.label, fontWeight: 700, color: isCancelled ? B.textMuted : B.text, textDecoration: isCancelled ? 'line-through' : 'none' }}>{displayTeam}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isCancelled || (isMuted && isGraded) ? (
              <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                <span style={{ textDecoration: 'line-through' }}>{peakUnits ?? units}u</span> 0u @ {fmtO(odds)} · {book}
              </span>
            ) : isTrackedGrade ? (
              <span style={{ ...T.micro, color: LEAN_BLUE, fontFeatureSettings: "'tnum'", fontWeight: 700 }}>
                TRACKED · 0u @ {fmtO(odds)} · {book}
              </span>
            ) : showDownsize ? (
              <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                <span style={{ color: DOWNSIZE_AMBER, fontWeight: 800 }}>{units}u</span>
                {' '}@ {fmtO(odds)} · {book}
                {peakTierFromStars && (
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.55rem', color: DOWNSIZE_AMBER, opacity: 0.85 }}>
                    ↓ {peakTierFromStars}→{liveTierForRank}
                  </span>
                )}
              </span>
            ) : (
              <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                {units}u @ {fmtO(odds)} · {book}
              </span>
            )}
            {isGraded ? (
              isMuted ? (
                // v5.6: show outcome for context but de-emphasize — this play
                // was muted before tip, so the result is informational only and
                // does not contribute to PnL.
                <span style={{
                  ...T.micro, fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px',
                  color: B.textMuted, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  letterSpacing: '0.04em',
                }}>MUTED · {outcome}</span>
              ) : isTrackedGrade ? (
                // v7.4 fix: graded LEAN tracked-only play. Show outcome for
                // context with the tracking-blue palette so it never reads
                // as a normal win/loss row. PnL still renders "0.00u" below.
                // Explicit blue (not LEAN_BLUE constant) because LEAN_BLUE
                // is now the AGS_TIER_META.LEAN yellow under the unified
                // palette; tracked/0u plays keep their distinct blue signal.
                <span style={{
                  ...T.micro, fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px',
                  color: '#60A5FA', background: 'rgba(96,165,250,0.10)',
                  border: '1px solid rgba(96,165,250,0.30)',
                  letterSpacing: '0.04em',
                }}>TRACKED · {outcome}</span>
              ) : (
                <span style={{
                  ...T.micro, fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px',
                  color: isWin ? '#fff' : isLoss ? '#fff' : B.textSec,
                  background: isWin ? 'linear-gradient(135deg, #10B981, #059669)' : isLoss ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'rgba(255,255,255,0.06)',
                }}>{outcome}</span>
              )
            ) : (
              <span style={{ ...T.micro, fontWeight: 700, color: B.gold, padding: '0.15rem 0.45rem', borderRadius: '4px', background: B.goldDim }}>PENDING</span>
            )}
            {isGraded && !isMuted && !isTrackedGrade && (
              <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: isWin ? B.green : isLoss ? B.red : B.textSec }}>
                {isWin ? '+' : isLoss ? '' : ''}{(profit || 0).toFixed(2)}u
              </span>
            )}
            {isGraded && (isMuted || isTrackedGrade) && (
              <span style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", color: isTrackedGrade ? LEAN_BLUE : B.textMuted }}>
                0.00u
              </span>
            )}
            {!isGraded && gameTime && (
              <span style={{ ...T.micro, color: B.textMuted }}>{fmtET(gameTime)} ET</span>
            )}
          </div>
        </div>

        {/* Quick stats footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.25rem 0.875rem 0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
            {!isCancelled && (walletConsensusForW != null || consensusStrength?.moneyPct != null) && (() => {
              const t = v12OverallTag({ forW: walletConsensusForW, agW: walletConsensusAgW, hcFor: hcConfFor, hcAg: hcConfAg, moneyPct: consensusStrength?.moneyPct });
              const c = t.tone === 'pos' ? B.green : t.tone === 'neg' ? B.red : B.gold;
              return (
                <span style={{
                  ...T.micro, fontSize: '0.52rem', fontWeight: 800, color: c,
                  background: `${c}1a`, border: `1px solid ${c}33`,
                  padding: '0.05rem 0.32rem', borderRadius: '4px', letterSpacing: '0.04em',
                  display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                }}>
                  <Activity size={8} /> V12 · {t.label.toUpperCase()}
                </span>
              );
            })()}
            <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem' }}>Peak: {peakAt ? fmtET(peakAt) : '—'}</span>
            {starDelta > 0 && (
              <span style={{
                ...T.micro, fontSize: '0.55rem', fontWeight: 700, fontFeatureSettings: "'tnum'",
                color: isTopPick ? '#D4AF37' : B.textSec,
              }}>
                {lockStars}★→{stars}★
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {clvPct != null && (
              <span style={{ ...T.micro, fontWeight: 700, fontSize: '0.6rem', fontFeatureSettings: "'tnum'", color: clvPositive ? B.green : liveCLV < 0 ? B.red : B.textMuted }}>
                CLV {clvPositive ? '+' : ''}{clvPct}%
              </span>
            )}
            <ChevronDown size={12} color={B.textMuted} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </div>
        </div>

        {/* Health status reasons */}
        {(isMuted || isCancelled) && healthReasons.length > 0 && (
          <div style={{ padding: '0 0.875rem 0.375rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {healthReasons.map(r => (
              <span key={r} style={{
                ...T.micro, fontSize: '0.5rem', fontWeight: 600,
                padding: '0.1rem 0.35rem', borderRadius: '3px',
                color: isCancelled ? '#FCA5A5' : '#FCD34D',
                background: isCancelled ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                border: `1px solid ${isCancelled ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
              }}>
                {HEALTH_REASON_LABELS[r] || r}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Expanded: full premium detail ─── */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${B.border}` }}>

          {/* ─── ACT 1 · THE BET ─── de-boxed hero. No nested card: just a
              soft tier glow + generous space so the pick + price are the
              single hero moment (Robinhood-style), not another widget. The
              tier/units/AGS already live in the collapsed header above, so we
              do NOT repeat them here — only a one-line status read for
              non-standard tiers. */}
          <div style={{
            padding: '1.15rem 1rem 0.5rem',
            position: 'relative',
            background: `radial-gradient(120% 70% at 82% -10%, ${accentColor}10 0%, transparent 62%)`,
          }}>
            {(() => {
              // Edge-state note ONLY — normal locks render nothing; the
              // conviction + backing wallets below carry the story. The
              // tier/units/AGS chips that used to sit here were a duplicate
              // of the always-visible collapsed header, so they're gone.
              const noteStyle = { ...T.micro, color: B.textSec, lineHeight: 1.5, marginBottom: '0.7rem' };
              if (isCancelled) return (<div style={noteStyle}><span style={{ color: B.red, fontWeight: 700 }}>Signal killed</span> — proven winners flipped against this side after lock.</div>);
              if (isMuted)     return (<div style={noteStyle}><span style={{ color: '#F59E0B', fontWeight: 700 }}>Signal fading</span> — conviction weakened since lock. Stand down.</div>);
              if (isLean)      return (<div style={noteStyle}><span style={{ color: LEAN_BLUE, fontWeight: 700 }}>Lean · ½ stake</span> — moderate conviction; sized at half a standard lock.</div>);
              if (isWeak)      return (<div style={noteStyle}><span style={{ color: WEAK_AMBER, fontWeight: 700 }}>Weak · ⅕ stake</span> — minimum exposure, just above the mute floor.</div>);
              if (isTrackedGrade) return (<div style={noteStyle}><span style={{ color: LEAN_BLUE, fontWeight: 700 }}>Tracked only</span> — graded for the record; contributes 0u to P&amp;L.</div>);
              return null;
            })()}

            {/* Bet line: the pick + the locked price as the two hero numbers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.625rem', alignItems: 'center' }}>
              <div>
                <div style={{ ...T.micro, fontSize: '0.56rem', color: accentColor, marginBottom: '0.3rem', letterSpacing: '0.12em', fontWeight: 800 }}>
                  THE PICK
                </div>
                <div style={{
                  fontSize: '1.7rem', fontWeight: 900, color: B.text,
                  lineHeight: 1.05, letterSpacing: '-0.025em',
                }}>
                  {marketType === 'spread' ? `${teamShort} ${line > 0 ? '+' : ''}${line}` : marketType === 'total' ? displayTeam : `${teamShort} ML`}
                </div>
                {pinnProb && (
                  <div style={{ ...T.micro, fontSize: '0.62rem', color: B.textMuted, marginTop: '0.35rem', fontFeatureSettings: "'tnum'" }}>
                    Fair value {fmtO(pinnacleOdds)} · {(pinnProb * 100).toFixed(1)}%{evEdge > 0 ? <span style={{ color: B.green, fontWeight: 700 }}>{'  ·  +'}{evEdge}% EV</span> : null}
                  </div>
                )}
              </div>
              <div style={{ width: '1px', height: '52px', background: `linear-gradient(180deg, transparent, ${B.border}, transparent)` }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...T.micro, fontSize: '0.56rem', color: B.textMuted, marginBottom: '0.3rem', letterSpacing: '0.12em', fontWeight: 700 }}>LOCKED AT</div>
                <div style={{
                  fontSize: '1.85rem', fontWeight: 900,
                  color: evEdge > 0 ? B.green : B.text,
                  lineHeight: 1, letterSpacing: '-0.025em',
                  fontFeatureSettings: "'tnum'",
                }}>{fmtO(odds)}</div>
                <div style={{ ...T.micro, fontSize: '0.58rem', color: B.textMuted, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{book}</div>
              </div>
            </div>

            {/* Risk / Result row — de-boxed; a hairline rule separates it from
                the hero numbers instead of a nested colored box. */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: '0.85rem', paddingTop: '0.7rem',
              borderTop: `1px solid ${B.borderSubtle}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                <span style={{ ...T.micro, color: B.textMuted }}>Risk</span>
                {/* Live AGS-U-sized stake — always show the actual live
                    unit count. Strikethrough/peak-unit comparison was
                    removed because peak.units carries values from the
                    pre-AGS-U sizing system (apples-to-oranges). The tier
                    transition chip below conveys conviction drop. */}
                <span style={{
                  ...T.micro, fontWeight: 800,
                  color: (isMuted || isCancelled) && !isGraded ? B.textMuted : B.text,
                  fontFeatureSettings: "'tnum'",
                  textDecoration: (isMuted || isCancelled) && !isGraded ? 'line-through' : 'none',
                }}>{units}u</span>
                {(isMuted || isCancelled) && !isGraded && (
                  <span style={{ ...T.micro, fontWeight: 900, color: isCancelled ? B.red : '#F59E0B', fontFeatureSettings: "'tnum'" }}>→ 0u</span>
                )}
                {showDownsize && peakTierFromStars && (
                  <span
                    title={`Conviction stepped down from ${peakTierFromStars} (peak) to ${liveTierForRank} (live). The live stake follows the AGS-U sizing ladder for the current tier.`}
                    style={{
                      ...T.micro, fontWeight: 700, letterSpacing: '0.04em',
                      padding: '0.05rem 0.35rem', borderRadius: '3px',
                      color: DOWNSIZE_AMBER, background: 'rgba(212,175,55,0.08)',
                      border: '1px dashed rgba(212,175,55,0.35)',
                    }}
                  >
                    {peakTierFromStars} → {liveTierForRank}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>{isGraded ? 'Result' : 'To win'}</span>
                  <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: isGraded ? (isWin ? B.green : isLoss ? B.red : B.textSec) : (isLean ? LEAN_BLUE : isWeak ? WEAK_AMBER : (isMuted || isCancelled) ? B.textMuted : showDownsize ? DOWNSIZE_AMBER : B.green) }}>
                    {/* LEAN/WEAK ship real money; only MUTED/CANCELLED are 0. */}
                    {isGraded ? `${isWin ? '+' : isLoss ? '' : ''}${(profit || 0).toFixed(2)}u` : `+${((isMuted || isCancelled) ? 0 : potentialWin).toFixed(2)}u`}
                  </span>
                </div>
                {clvPct != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ ...T.micro, color: B.textMuted }}>CLV</span>
                    <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: clvPositive ? B.green : liveCLV < 0 ? B.red : B.textMuted }}>
                      {clvPositive ? '+' : ''}{clvPct}%
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ─── ACT 2 · THE CASE ─── one plain-language thesis (the story)
              + a conviction meter, followed by the actual proven wallets that
              back it. The hero above answers "what"; this answers "why" and
              shows the receipts. Proprietary-safe: no raw score / quintile /
              internal feature names. */}
          {(walletConsensusForW != null || consensusStrength?.moneyPct != null || agsTierDisplay) && (
            <V12ConvictionPanel
              tier={agsTierDisplay}
              tierColor={(AGS_TIER_META[agsTierDisplay] && AGS_TIER_META[agsTierDisplay].color) || accentColor}
              tierBg={AGS_TIER_META[agsTierDisplay] && AGS_TIER_META[agsTierDisplay].bg}
              forW={walletConsensusForW}
              agW={walletConsensusAgW}
              qFor={walletConsensusQualityForT30}
              qAg={walletConsensusQualityAgT30}
              hcFor={hcConfFor}
              hcAg={hcConfAg}
              moneyPct={consensusStrength?.moneyPct}
              sport={sport}
              accentColor={accentColor}
              isMobile={isMobile}
              backingWallets={backingWallets}
              totalInvested={totalInvested}
            />
          )}

          {/* The receipts — actual proven wallets backing this pick, each with
              its stored sport track record. Lifted from the stamped
              walletDetails snapshot; only renders when we have wallet rows. */}
          {Array.isArray(backingWallets) && backingWallets.length > 0 && (
            <BackingWalletStrip
              wallets={backingWallets}
              sport={sport}
              accent={accentColor}
              isMobile={isMobile}
            />
          )}

          {/* ─── ACT 3 · THE MARKET ─── sharp money + the line, grouped under
              one header so the market read is a single cohesive section. */}
          <div style={{ padding: '1rem 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ ...T.tiny, fontSize: '0.5rem', color: B.textSubtle, letterSpacing: '0.14em', fontWeight: 700 }}>THE MARKET</span>
            <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${B.borderSubtle}, transparent)` }} />
          </div>

          {/* Sharp money split — amounts as the hero, one clean bar */}
          {consensusStrength?.moneyPct != null && (() => {
            const myPct = consensusStrength.moneyPct;
            const pct = myPct / 100;
            const totalBoth = pct > 0 ? totalInvested / pct : totalInvested;
            const otherAmt = Math.round(totalBoth - totalInvested);
            return (
              <div style={{ padding: '0.7rem 1rem 0' }}>
                <div style={{ ...T.micro, fontSize: '0.52rem', color: B.textMuted, letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Sharp money at lock</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem', fontFeatureSettings: "'tnum'" }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', minWidth: 0 }}>
                    <span style={{ ...T.body, fontWeight: 900, color: accentColor, letterSpacing: '-0.01em' }}>{fmtV(totalInvested)}</span>
                    <span style={{ ...T.micro, fontSize: '0.58rem', color: B.textSec }}>{teamShort} · {myPct}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ ...T.micro, fontSize: '0.58rem', color: B.textMuted }}>{100 - myPct}% · {otherTeam}</span>
                    <span style={{ ...T.caption, fontWeight: 700, color: B.textMuted }}>{fmtV(otherAmt)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ width: `${myPct}%`, background: `linear-gradient(90deg, ${accentColor}99, ${accentColor})`, borderRadius: '4px' }} />
                </div>
              </div>
            );
          })()}

          {/* Book Prices — de-boxed: plain columns split by hairlines, no
              table fill. CLV lives once, up in the bet row. */}
          <div style={{ padding: '0.85rem 1rem 0' }}>
            <div style={{ ...T.micro, fontSize: '0.52rem', color: B.textMuted, letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              {marketType === 'spread' ? `${teamShort} ${line > 0 ? '+' : ''}${line}` : marketType === 'total' ? displayTeam : `${teamShort} ML`} — line history
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {[
                { label: book || 'Locked', value: odds ? fmtO(odds) : '—', color: B.text },
                { label: 'Pinnacle', value: pinnacleOdds ? fmtO(pinnacleOdds) : '—', color: B.textSec },
                { label: 'Now', value: closingOdds ? fmtO(closingOdds) : '—', color: clvPositive ? B.green : liveCLV != null && liveCLV < 0 ? B.red : B.textSec },
              ].map((col, i) => (
                <div key={col.label} style={{
                  textAlign: i === 0 ? 'left' : 'center',
                  paddingLeft: i === 0 ? '0' : '0.375rem',
                  borderLeft: i > 0 ? `1px solid ${B.borderSubtle}` : 'none',
                }}>
                  <div style={{ ...T.micro, fontSize: '0.52rem', color: B.textMuted, marginBottom: '0.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.label}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: col.color, fontFeatureSettings: "'tnum'", letterSpacing: '-0.01em' }}>{col.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline — milestone rail: glowing dots joined by a gradient
              line so the pick's lifecycle (Locked → Peak → Game) reads as
              a journey instead of a text breadcrumb. */}
          {(() => {
            const gameEpoch = gameTime ? (typeof gameTime === 'number' ? gameTime : Date.parse(gameTime)) : null;
            const gameStarted = gameEpoch != null && !isNaN(gameEpoch) && Date.now() >= gameEpoch;
            const stops = [];
            if (lockedAt) stops.push({ label: 'Locked', time: fmtET(lockedAt), color: B.green });
            if (peakAt && peakAt !== lockedAt) stops.push({ label: 'Peak', time: fmtET(peakAt), color: B.gold });
            if (gameTime) stops.push({ label: 'Game', time: fmtET(gameTime), color: gameStarted ? B.red : B.textMuted, live: gameStarted && !isGraded });
            if (stops.length === 0) return null;
            return (
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                padding: '0.7rem 1.25rem 0.8rem',
              }}>
                {stops.map((s, i) => (
                  <Fragment key={s.label}>
                    {i > 0 && (
                      <div style={{
                        flex: 1, maxWidth: '90px', height: '1px', marginTop: '3.5px',
                        background: `linear-gradient(90deg, ${stops[i - 1].color}55, ${s.color}55)`,
                      }} />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0 0.5rem' }}>
                      <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: s.color,
                        boxShadow: `0 0 8px ${s.color}80`,
                        ...(s.live ? { animation: 'pulse 2s ease-in-out infinite' } : {}),
                      }} />
                      <span style={{ ...T.micro, fontSize: '0.55rem', fontWeight: 700, color: s.color, letterSpacing: '0.05em' }}>{s.label}</span>
                      <span style={{ ...T.micro, fontSize: '0.55rem', color: B.textMuted, fontFeatureSettings: "'tnum'", marginTop: '-0.15rem' }}>{s.time}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════
// SharpPositionCard — v12 display state model
// ════════════════════════════════════════════════════════════════════════
//
// Every visual cue on the live game card (header tier strip, action box
// title, banner, units pill, accent color) derives from ONE value:
// `displayState`. This eliminates the long-standing "LOCKED IN + WEAK
// 0.0u + RECOMMENDED BET + HARD MUTE" contradiction users were seeing
// when the legacy v11 `isLockedInFirestore` flag, v12 tier, and live
// health gate disagreed on a render.
//
// State -> visual mapping:
//   PLAY     — cron-stamped LOCK/PREMIUM/ELITE with finalUnits > 0.
//              Emerald accent. Full bet rendering.
//   TRACKING — cron-stamped WEAK/LEAN (0.25u/0.5u tracking-only stake).
//              Amber accent. "TRACKING BET" headline.
//   MUTED    — cron-stamped FADE or finalUnits === 0. Red accent.
//              "SHARP CONSENSUS — not playable" headline.
//   PREVIEW  — cron hasn't evaluated yet (browser-only / pre-lock).
//              Gold accent. "AWAITING CRON v12 EVAL" headline. Browser
//              still shows the v12-tier preview but doesn't claim a bet.
//
// Units derive from cron's `finalUnits` when present, otherwise from the
// v12 ladder (PLAY tiers fall back via V12_LADDER, TRACKING tiers same;
// MUTED is always 0; PREVIEW shows '—').
const V12_LADDER = Object.freeze({
  ELITE: 5.0, PREMIUM: 3.0, LOCK: 1.0, LEAN: 0.5, WEAK: 0.25, FADE: 0,
});

const AGS_V12_DISPLAY_META = Object.freeze({
  PLAY: {
    pill: 'PLAY',
    headline: 'RECOMMENDED BET',
    color:  AGS_TIER_META.PREMIUM.color,   // emerald
    bg:     'rgba(34,197,94,0.08)',
    bgSoft: 'rgba(34,197,94,0.03)',
    border: 'rgba(34,197,94,0.22)',
    bannerLabel: null,                     // header strip carries the state
  },
  TRACKING: {
    pill: 'TRACKING',
    headline: 'TRACKING BET (reduced size)',
    color:  AGS_TIER_META.LEAN.color,      // amber
    bg:     'rgba(250,204,21,0.08)',
    bgSoft: 'rgba(250,204,21,0.03)',
    border: 'rgba(250,204,21,0.22)',
    bannerLabel: null,
  },
  MUTED: {
    pill: 'MUTED',
    headline: 'SHARP CONSENSUS — not playable',
    color:  AGS_TIER_META.FADE.color,      // red
    bg:     'rgba(239,68,68,0.06)',
    bgSoft: 'rgba(239,68,68,0.02)',
    border: 'rgba(239,68,68,0.20)',
    bannerLabel: null,
  },
  PREVIEW: {
    pill: 'MONITORING',
    headline: 'MONITORING — awaiting auto-lock',
    color:  '#d4af37',                     // gold
    bg:     'rgba(212,175,55,0.06)',
    bgSoft: 'rgba(212,175,55,0.02)',
    border: 'rgba(212,175,55,0.20)',
    bannerLabel: null,
  },
  // v12.1 — non-HC / WEAK-tier HC sides: tracked for context, never staked.
  MONITORING: {
    pill: 'MONITORING',
    headline: 'MONITORING — tracked, not staked',
    color:  '#6B7280',                     // grey
    bg:     'rgba(107,114,128,0.08)',
    bgSoft: 'rgba(107,114,128,0.03)',
    border: 'rgba(107,114,128,0.22)',
    bannerLabel: null,
  },
});

// Pure helper — derives the unified display state from cron stamps
// (tier + units) plus the resolved browser-side v12 tier fallback.
// Centralized so the ML / Spread / Total tabs can each derive their
// own state from their own cron props without re-implementing the
// logic.
function deriveDisplayState({ cronTier, cronUnits, fallbackTier, cronStakeTier = null }) {
  // v12.1 — when the cron has stamped a product stake tier, the live card
  // speaks the product vocabulary (SUPER / TOP / CONFIRMED / MONITORING)
  // and the size comes from the HC-based finalUnits.
  if (cronStakeTier) {
    if (cronStakeTier === 'MONITORING') {
      return { state: 'MONITORING', tier: 'MONITORING', units: 0 };
    }
    if (cronStakeTier === 'FADE') {
      return { state: 'MUTED', tier: 'FADE', units: 0 };
    }
    const u = Number.isFinite(cronUnits) ? cronUnits : 0;
    return { state: 'PLAY', tier: cronStakeTier, units: u };
  }
  const tier = cronTier || fallbackTier || null;
  // Cron hasn't seen this side yet → browser still has tier preview but
  // we can't claim a bet (no finalUnits stamped). Show as PREVIEW.
  if (cronTier == null) {
    return { state: 'PREVIEW', tier, units: null };
  }
  // Cron explicitly muted: FADE tier OR finalUnits === 0.
  if (cronTier === 'FADE' || cronUnits === 0) {
    return { state: 'MUTED', tier: 'FADE', units: 0 };
  }
  const units = Number.isFinite(cronUnits) ? cronUnits : (V12_LADDER[cronTier] ?? 0);
  if (cronTier === 'WEAK' || cronTier === 'LEAN') {
    return { state: 'TRACKING', tier: cronTier, units };
  }
  return { state: 'PLAY', tier: cronTier, units };
}

// ─── Wallet Dossier Row ───────────────────────────────────────────────────────
// Premium per-wallet line for the expanded card. Leads with the proprietary
// track record we grade + store (per-sport real-money W/L, ROI, settled profit)
// and the "sizes up = wins more" edge tied to the live bet — not just the raw
// snapshot. Internal whitelist plumbing (source A/B, verdict codes) is hidden on
// purpose; users only see signal that helps them decide.
function WalletDossierRow({ p, gd, now, isMobile, market = 'ml', accent = B.gold }) {
  const posColor = p.pnl >= 0 ? B.green : B.red;
  const tc = p.tier === 'ELITE' ? { color: B.gold, bg: B.goldDim } : { color: B.green, bg: B.greenDim };
  const rankGroup = groupedSportsRankLabel(p.leaderboardRank);
  const isWinner = isSportWinner(p.wallet, gd.sport);

  const seenAgo = p.firstSeen ? (() => {
    const mins = Math.round((now - new Date(p.firstSeen).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
    return `${Math.round(mins / 1440)}d ago`;
  })() : null;

  // Position label varies by market (team / team+line / Over·Under line).
  let sideLabel;
  if (market === 'total') {
    sideLabel = `${p.side === 'over' ? 'Over' : 'Under'}${p.entryLine != null ? ' ' + p.entryLine : ''}`;
  } else {
    const sideTeam = p.side === 'draw' ? 'Draw' : p.side === 'away' ? gd.away : gd.home;
    const short = sideTeam.split(' ').pop();
    sideLabel = market === 'spread' && p.entryLine != null
      ? `${short} ${p.entryLine > 0 ? '+' : ''}${p.entryLine}`
      : short;
  }

  // Stored, graded track record for THIS sport (real-money on-chain results).
  const profile = getWalletProfile(p.wallet.slice(-6));
  const rec = profile?.bySport?.[gd.sport]?.positions;
  const picksRec = profile?.bySport?.[gd.sport]?.picks || null;
  // Show the whitelist-qualifying metric (FLAT/unit ROI) — the same axis the
  // cron uses to promote a wallet to a sport WINNER — not dollar ROI/PnL, which
  // is sizing-skewed and can read deeply negative for a legitimately FLAT wallet.
  const flatRoiDisp = rec?.positionFlatRoi != null ? rec.positionFlatRoi
    : (picksRec?.flatRoi != null ? picksRec.flatRoi : null);
  const decided = rec ? (rec.wins || 0) + (rec.losses || 0) : 0;
  const hasRecord = !!rec && decided >= 4;

  // Size edge — is this bet bigger than the wallet's own median, and do they
  // win more when they size up? sizeSignal buckets are own-median, cross-sport.
  const sz = profile?.sizeSignal;
  let sizeEdge = null;
  if (sz && sz.medianInvested > 0 && p.invested > 0) {
    const ratio = p.invested / sz.medianInvested;
    if (ratio >= 1.5) {
      const bucket = ratio >= 2 ? sz.wayAbove : sz.above;
      if (bucket && bucket.n >= 3 && bucket.wr != null) sizeEdge = { ratio, wr: bucket.wr };
    }
  }

  return (
    <div className="sf-card" style={{
      padding: isMobile ? '0.6rem 0.65rem' : '0.7rem 0.8rem',
      borderRadius: '12px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 55%), rgba(255,255,255,0.012)',
      border: `1px solid ${B.borderSubtle}`,
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      {/* Identity */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0, flexWrap: 'wrap' }}>
          <Badge color={tc.color} bg={tc.bg}>{p.tier}</Badge>
          {rankGroup && (
            <span style={{ ...T.tiny, padding: '0.15rem 0.4rem', borderRadius: '5px', color: '#CBD5E1', background: 'rgba(148,163,184,0.10)', border: '1px solid rgba(148,163,184,0.20)' }}>{rankGroup}</span>
          )}
          {isWinner && (
            <span style={{ ...T.tiny, padding: '0.15rem 0.4rem', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: B.gold, background: B.goldDim, border: `1px solid ${B.goldBorder}`, textShadow: '0 0 6px rgba(212,175,55,0.35)' }}>
              <CheckCircle size={9} style={{ strokeWidth: 3 }} />{gd.sport} WINNER
            </span>
          )}
          <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>…{p.wallet.slice(-4)}</span>
        </div>
        {seenAgo && <span style={{ ...T.micro, color: B.textMuted, whiteSpace: 'nowrap', fontFeatureSettings: "'tnum'" }}>{seenAgo}</span>}
      </div>

      {/* Verified track record (stored) — or lifetime fallback for thin samples */}
      {hasRecord ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', flexWrap: 'wrap', fontFeatureSettings: "'tnum'" }}>
          <span style={{ ...T.tiny, color: B.textMuted, alignSelf: 'center' }}>{gd.sport} RECORD</span>
          <span style={{ ...T.sub, fontWeight: 900, color: B.text }}>{rec.wins}-{rec.losses}</span>
          <span style={{ ...T.caption, color: B.textSec }}>{Math.round(rec.wr)}% W</span>
          {flatRoiDisp != null && (
            <span style={{ ...T.micro, fontWeight: 800, padding: '0.12rem 0.4rem', borderRadius: '6px', alignSelf: 'center', color: flatRoiDisp >= 0 ? B.green : B.red, background: flatRoiDisp >= 0 ? B.greenDim : B.redDim }}>
              {flatRoiDisp >= 0 ? '+' : ''}{Math.round(flatRoiDisp)}% ROI
            </span>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap', fontFeatureSettings: "'tnum'" }}>
          <span style={{ ...T.tiny, color: B.textMuted, alignSelf: 'center' }}>LIFETIME</span>
          <span style={{ ...T.sub, fontWeight: 900, color: (p.totalPnl || 0) >= 0 ? B.green : B.red }}>
            {(p.totalPnl || 0) >= 0 ? '+' : ''}{fmtVol(p.totalPnl || 0)}
          </span>
          <span style={{ ...T.micro, color: B.textMuted, alignSelf: 'center' }}>sports profit</span>
        </div>
      )}

      {/* Size edge — the proprietary "they win more when they load up" signal */}
      {sizeEdge && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.35rem 0.5rem', borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.04) 100%)',
          border: '1px solid rgba(245,158,11,0.28)',
        }}>
          <Zap size={12} color="#F59E0B" style={{ flexShrink: 0, fill: 'rgba(245,158,11,0.35)' }} />
          <span style={{ ...T.micro, color: '#FBBF24', fontWeight: 700, fontFeatureSettings: "'tnum'" }}>
            Loading up — {sizeEdge.ratio.toFixed(1)}× their usual size · {Math.round(sizeEdge.wr)}% W when sizing up
          </span>
        </div>
      )}

      {/* This game's position */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
        paddingTop: '0.5rem', borderTop: `1px solid ${B.borderSubtle}`, fontFeatureSettings: "'tnum'",
      }}>
        <span style={{ ...T.tiny, color: B.textMuted }}>THIS GAME</span>
        <span style={{ ...T.caption, color: accent, fontWeight: 800 }}>{sideLabel}</span>
        <span style={{ ...T.caption, color: B.textSec }}>{fmtVol(p.invested)} @ {Math.round(p.avgPrice * 100)}¢</span>
        <span style={{ ...T.caption, fontWeight: 800, color: posColor }}>{p.pnl >= 0 ? '+' : ''}{fmtVol(p.pnl)}</span>
      </div>
    </div>
  );
}

const SharpPositionCard = memo(function SharpPositionCard({ gd, pinnacleHistory, polyData, isMobile, onPickSynced, onHealthSynced, isMyPick, onToggleMyPick, canPickGames, gameFlowMap, spreadPositions, totalPositions, originalLockedSide, originalLockStars, originalLockWPS, originalFlipBeatThreshold, originalSpreadLockStars, originalSpreadLockWPS, originalTotalLockStars, originalTotalLockWPS, v8Norm, walletProfiles,
  // CRON-FIRST OVERRIDES (per market). When the syncPickStateAuthoritative
  // cron has stamped tier + finalUnits on the synced doc for this game/market,
  // use those values verbatim instead of the client-side rateStarsV8 +
  // decideLockStage + calculateSpreadTotalUnits chain. The client recompute
  // can drift from the cron when the browser-cached AGS calibration is stale,
  // which produces the "WEAK on lock card vs 5★ LOCK on live card" bug
  // (Cavs/Pistons total, 2026-05-17). Cron-stamped values are derived from
  // the live Firestore calibration that the grader and bankroll math use.
  mlCronTier = null, mlCronUnits = null, mlCronStakeTier = null,
  spreadCronTier = null, spreadCronUnits = null, spreadCronStakeTier = null,
  totalCronTier = null, totalCronUnits = null, totalCronStakeTier = null,
}) {
  const [showWallets, setShowWallets] = useState(false);
  const [walletSideFilter, setWalletSideFilter] = useState('all');
  const [showSpreadWallets, setShowSpreadWallets] = useState(false);
  const [spreadWalletFilter, setSpreadWalletFilter] = useState('all');
  const [showTotalWallets, setShowTotalWallets] = useState(false);
  const [totalWalletFilter, setTotalWalletFilter] = useState('all');
  const [marketTab, setMarketTab] = useState('ml');
  const lastSyncedStars = useRef(null);
  const lastSyncedSide = useRef(null);
  const lastSyncedSpreadStars = useRef(null);
  const lockSpreadStarsRef = useRef(originalSpreadLockStars ?? null);
  const lockSpreadRawScoreRef = useRef(null);
  const lockSpreadWPSRef = useRef(originalSpreadLockWPS ?? null);
  const lastSyncedTotalStars = useRef(null);
  const lockTotalStarsRef = useRef(originalTotalLockStars ?? null);
  const lockTotalRawScoreRef = useRef(null);
  const lockTotalWPSRef = useRef(originalTotalLockWPS ?? null);
  const pregameSynced = useRef(false);
  const lockOddsRef = useRef(null);
  const lockStarsRef = useRef(originalLockStars ?? null);
  const lockRawScoreRef = useRef(null);
  const lockWPSRef = useRef(originalLockWPS ?? null);
  const flipBeatThresholdRef = useRef(originalFlipBeatThreshold ?? null);
  const lockedSideRef = useRef(originalLockedSide || null);
  const ss = sportStyle(gd.sport);
  const s = gd.summary;
  const consensusSide = s.consensus;
  const consensusTeam = consensusSide === 'draw' ? 'Draw' : consensusSide === 'away' ? gd.away : gd.home;
  const consensusShort = consensusTeam.split(' ').pop();
  const oppTeam = consensusSide === 'draw' ? 'Either Team' : consensusSide === 'away' ? gd.home : gd.away;
  const oppShort = consensusSide === 'draw' ? 'Teams' : oppTeam.split(' ').pop();
  const awayShort = gd.away.split(' ').pop();
  const homeShort = gd.home.split(' ').pop();
  let pinnGame = pinnacleHistory?.[gd.sport]?.[gd.key];
  // SOC neutral-site fallback: try the reversed key and flip away/home so the
  // odds line up with this card's orientation (see flipPinnGame).
  if (!pinnGame && gd.sport === 'SOC' && gd.key) {
    const parts = gd.key.split('_');
    if (parts.length === 2) {
      const rev = pinnacleHistory?.SOC?.[`${parts[1]}_${parts[0]}`];
      if (rev) pinnGame = flipPinnGame(rev);
    }
  }
  const allBooks = pinnGame?.allBooks || {};
  const polyGameData = polyData?.[gd.sport]?.[gd.key];
  const commenceTime = polyGameData?.commence ? new Date(polyGameData.commence).getTime()
    : pinnGame?.commence ? new Date(pinnGame.commence).getTime() : null;
  const nowMs = Date.now();
  const MAX_GAME_MS = 6 * 60 * 60 * 1000;
  const isGameLive = commenceTime && nowMs >= commenceTime && (nowMs - commenceTime) < MAX_GAME_MS;
  const minsUntilStart = commenceTime ? Math.round((commenceTime - nowMs) / 60000) : null;

  const gameTimeLabel = (() => {
    if (!commenceTime) return null;
    if (isGameLive) return 'LIVE';
    if (minsUntilStart <= 30) return `${minsUntilStart}min`;
    const hours = Math.floor(minsUntilStart / 60);
    const mins = minsUntilStart % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  })();

  const gameTimeFormatted = commenceTime
    ? new Date(commenceTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York' })
    : null;

  // Draw-aware per-side odds resolvers. For 2-way sports the 'draw' branch is
  // never hit, so these are identical to the old `away ? a : b` ternaries — but
  // a 3-way soccer DRAW pick now reads the draw line instead of leaking the
  // home/favorite price (which produced "Draw ML -1100" = France's odds).
  const sideCurrentOdds = (sk) => sk === 'away' ? pinnGame?.current?.away : sk === 'draw' ? pinnGame?.current?.draw : pinnGame?.current?.home;
  const sideBookOdds = (book, sk) => sk === 'away' ? book?.away : sk === 'draw' ? book?.draw : book?.home;
  const consensusOdds = sideCurrentOdds(consensusSide);
  const oppOdds = consensusSide === 'away' ? pinnGame?.current?.home : pinnGame?.current?.away;
  const bestRetail = consensusSide === 'away' ? pinnGame?.bestAway : consensusSide === 'draw' ? pinnGame?.bestDraw : pinnGame?.bestHome;
  const bestBook = consensusSide === 'away' ? pinnGame?.bestAwayBook : consensusSide === 'draw' ? pinnGame?.bestDrawBook : pinnGame?.bestHomeBook;
  const pinnProb = impliedProb(consensusOdds);
  const retailProb = impliedProb(bestRetail);
  const evEdge = (pinnProb && retailProb) ? +((pinnProb - retailProb) * 100).toFixed(1) : null;
  const hasEV = evEdge != null && evEdge > 0;

  const pinnMoved = pinnGame?.movement?.direction;
  const pinnConfirms = pinnMoved === consensusSide;

  const uniqueWallets = new Set(gd.positions.map(p => p.wallet)).size;
  // Phase 2: count {SPORT} WINNER wallets on each side of the ML market.
  const sportWinnerForCount = (() => {
    if (!gd.sport || !consensusSide) return 0;
    const s = new Set();
    gd.positions.forEach(p => { if (p.side === consensusSide && isSportWinner(p.wallet, gd.sport)) s.add(p.wallet); });
    return s.size;
  })();
  const sportWinnerAgCount = (() => {
    if (!gd.sport || !consensusSide) return 0;
    const s = new Set();
    gd.positions.forEach(p => { if (p.side && p.side !== consensusSide && isSportWinner(p.wallet, gd.sport)) s.add(p.wallet); });
    return s.size;
  })();

  // Per-side aggregation (3-way aware: draw* stay 0 outside SOC)
  const awayPositions = gd.positions.filter(p => p.side === 'away');
  const homePositions = gd.positions.filter(p => p.side === 'home');
  const drawPositions = gd.positions.filter(p => p.side === 'draw');
  const awayWallets = new Set(awayPositions.map(p => p.wallet)).size;
  const homeWallets = new Set(homePositions.map(p => p.wallet)).size;
  const drawWallets = new Set(drawPositions.map(p => p.wallet)).size;
  const awayInvested = s.awayInvested || 0;
  const homeInvested = s.homeInvested || 0;
  const drawInvested = s.drawInvested || 0;
  const awayLifetimePnl = awayPositions.reduce((sum, p) => sum + (p.totalPnl || 0), 0);
  const homeLifetimePnl = homePositions.reduce((sum, p) => sum + (p.totalPnl || 0), 0);
  const drawLifetimePnl = drawPositions.reduce((sum, p) => sum + (p.totalPnl || 0), 0);
  const totalLifetimePnl = awayLifetimePnl + homeLifetimePnl + drawLifetimePnl;
  const totalInvested = awayInvested + homeInvested + drawInvested;
  const awayPct = totalInvested > 0 ? (awayInvested / totalInvested) * 100 : 50;

  const consensusPositions = consensusSide === 'draw' ? drawPositions : consensusSide === 'away' ? awayPositions : homePositions;
  const consensusWalletCount = consensusSide === 'draw' ? drawWallets : consensusSide === 'away' ? awayWallets : homeWallets;
  const consensusInvestedAmt = consensusSide === 'draw' ? drawInvested : consensusSide === 'away' ? awayInvested : homeInvested;
  const consensusLifetimePnl = consensusSide === 'draw' ? drawLifetimePnl : consensusSide === 'away' ? awayLifetimePnl : homeLifetimePnl;
  const consensusAvgBet = consensusWalletCount > 0 ? consensusInvestedAmt / consensusPositions.length : 0;
  const oppPositions = gd.positions.filter(p => p.side && p.side !== consensusSide);
  const oppAvgBet = oppPositions.length > 0 ? (totalInvested - consensusInvestedAmt) / oppPositions.length : 0;
  const awayAvgBet = awayPositions.length > 0 ? awayInvested / awayPositions.length : 0;
  const homeAvgBet = homePositions.length > 0 ? homeInvested / homePositions.length : 0;

  // Price movement data
  const pinnHistory = pinnGame?.history || [];
  const polyPriceHistory = polyGameData?.priceHistory;
  const polyPoints = polyPriceHistory?.points || [];
  const pinnAwayPoints = pinnHistory.map(h => h.away);
  const pinnHomePoints = pinnHistory.map(h => h.home);
  const pinnDrawPoints = pinnHistory.map(h => h.draw);
  const pinnConsensusPoints = consensusSide === 'away' ? pinnAwayPoints : consensusSide === 'draw' ? pinnDrawPoints : pinnHomePoints;

  // Directional context: use opener-to-current (not sparkline) to avoid intraday noise
  const pinnOpenOdds = consensusSide === 'away' ? pinnGame?.opener?.away : consensusSide === 'draw' ? pinnGame?.opener?.draw : pinnGame?.opener?.home;
  const pinnCurrentOdds = sideCurrentOdds(consensusSide);
  const pinnOpenProb = impliedProb(pinnOpenOdds);
  const pinnCurrentProb = impliedProb(pinnCurrentOdds);
  const pinnMovingWith = !!(pinnOpenProb && pinnCurrentProb) && pinnCurrentProb > pinnOpenProb;
  const pinnMovingAgainst = !!(pinnOpenProb && pinnCurrentProb) && pinnCurrentProb < pinnOpenProb;

  const polyMovingWith = polyPoints.length >= 2 && (() => {
    const pFirst = polyPoints[0];
    const pLast = polyPoints[polyPoints.length - 1];
    if (consensusSide === 'away') return pLast > pFirst;
    return pLast < pFirst;
  })();
  const polyMovingAgainst = polyPoints.length >= 2 && (() => {
    const pFirst = polyPoints[0];
    const pLast = polyPoints[polyPoints.length - 1];
    if (consensusSide === 'away') return pLast < pFirst;
    return pLast > pFirst;
  })();

  // Consensus strength — 3-way aware. Use the draw-aware per-side aggregates
  // computed above (consensusWalletCount / consensusInvestedAmt) and treat the
  // "opponent" as ALL non-consensus sides. For 2-way sports drawWallets/
  // drawInvested are 0, so these are identical to the old home/away math.
  const consensusWallets = consensusWalletCount;
  const oppWallets = new Set(oppPositions.map(p => p.wallet)).size;
  const consensusInvested = consensusInvestedAmt;
  const oppInvestedAmt = totalInvested - consensusInvestedAmt;
  const moneyPct = totalInvested > 0 ? (consensusInvested / totalInvested) * 100 : 50;
  const walletPct = (consensusWallets + oppWallets) > 0 ? (consensusWallets / (consensusWallets + oppWallets)) * 100 : 50;
  const cGrade = consensusGrade(moneyPct, walletPct);

  // Decomposed sharp features for V3 star rating
  const sharpFeatures = computeSharpFeatures(gd.positions, consensusSide);

  // Compute opposing side's raw stars (no flip penalty) for flip-detection
  const oppSide = consensusSide === 'away' ? 'home' : 'away';
  const oppBestRetail = oppSide === 'away' ? pinnGame?.bestAway : pinnGame?.bestHome;
  const oppPinnProb = impliedProb(oppOdds);
  const oppRetailProb = impliedProb(oppBestRetail);
  const oppEvEdge = (oppPinnProb && oppRetailProb) ? +((oppPinnProb - oppRetailProb) * 100).toFixed(1) : null;
  const oppPinnConfirms = pinnMoved === oppSide;
  const oppPinnOpenOdds = oppSide === 'away' ? pinnGame?.opener?.away : pinnGame?.opener?.home;
  const oppPinnCurrentOdds = oppSide === 'away' ? pinnGame?.current?.away : pinnGame?.current?.home;
  const oppPinnOpenProb = impliedProb(oppPinnOpenOdds);
  const oppPinnCurrentProb = impliedProb(oppPinnCurrentOdds);
  const oppPinnMovingWith = !!(oppPinnOpenProb && oppPinnCurrentProb) && oppPinnCurrentProb > oppPinnOpenProb;
  const oppPinnMovingAgainst = !!(oppPinnOpenProb && oppPinnCurrentProb) && oppPinnCurrentProb < oppPinnOpenProb;
  const oppPolyMovingWith = polyPoints.length >= 2 && (oppSide === 'away'
    ? polyPoints[polyPoints.length - 1] > polyPoints[0]
    : polyPoints[polyPoints.length - 1] < polyPoints[0]);
  const oppSharpFeatures = computeSharpFeatures(gd.positions, oppSide);
  // pickDate threaded into rateStarsV8 so vaultStarFromDeltas can apply
  // the v7.4 HC star floor (HC margin drives stars directly when dw+dq
  // is weak, e.g., HC=+2 with dw=0/dq=0 → 4.5★ instead of 2.25★).
  const pickDate = commenceTime ? gameDate(commenceTime) : null;
  const oppSr = rateStarsV8({
    positions: gd.positions, consensusSide: oppSide, v8Norm,
    pinnMoveSize: 0, timeToGame: null, sport: gd.sport, pickDate,
  });
  const oppPeakStars = oppSr.stars;

  // RLM data from game flow
  const flowGame = gameFlowMap?.[`${gd.sport}_${gd.key}`];
  const ticketPctOnConsensusSide = flowGame
    ? (consensusSide === 'away' ? flowGame.awayTicketPct : flowGame.homeTicketPct) || 0
    : 0;
  const flowTicketDiv = flowGame?.ticketDivergence || 0;
  const rlmActive = ticketPctOnConsensusSide < 50 && flowTicketDiv >= 10;

  // Lock-In Criteria System
  const criteria = [
    { id: 'sharps', label: '3+ Sharp Bettors', met: consensusWallets >= 3 },
    { id: 'ev', label: '+EV Edge', met: hasEV },
    { id: 'pinnacle', label: 'Pinnacle Confirms', met: pinnConfirms },
    { id: 'invested', label: '$10K+ on Side', met: consensusInvested >= 10000 },
    { id: 'pinnMove', label: 'Line Moving With Play', met: pinnMovingWith },
    { id: 'predMarket', label: 'Pred. Market Aligns', met: polyMovingWith },
  ];
  const criteriaMet = criteria.filter(c => c.met).length;
  const betOdds = bestRetail || consensusOdds;
  const mlPinnMoveSize = pinnMovingWith ? Math.max((pinnCurrentProb && pinnOpenProb) ? Math.abs(pinnCurrentProb - pinnOpenProb) : 0, 0.02) : (pinnCurrentProb && pinnOpenProb) ? Math.abs(pinnCurrentProb - pinnOpenProb) : 0;
  const sr = rateStarsV8({
    positions: gd.positions, consensusSide, v8Norm,
    pinnMoveSize: mlPinnMoveSize,
    timeToGame: commenceTime ? (commenceTime - Date.now()) / 60000 : null,
    lockOdds: lockOddsRef.current,
    pinnCurrentOdds,
    sport: gd.sport,
    pickDate,
  });

  // ─── V12-AWARE STAR OVERRIDE ──────────────────────────────────────────
  // `sr` came back from rateStarsV8, which is the legacy V11 wallet-
  // play-score star generator. It routinely returns 4 stars (and thus
  // `isActionable=true`) for sides that AGS-U v12 has hard-muted
  // (e.g. 2026-06-02 col_laa·away — cron stamped v12=0.000/FADE/0u/
  // SHADOW, but rateStarsV8 returned 4 stars from the at-lock snapshot
  // and the card rendered "RECOMMENDED BET · Risk 2.5u · MAX · 🔥"
  // simultaneously with "HARD MUTE — signal too weak to play"). Every
  // gate downstream — isActionable, calculateUnits, "RECOMMENDED BET"
  // vs "SHARP CONSENSUS" header, accentColor, the units pill — reads
  // `sr.stars` / `sr.isActionable`. So we resolve v12 once at the top
  // and overwrite `sr` to match. v12-tier → star mapping comes from
  // `starsFromAgsuTier` (ELITE 5.0, PREMIUM 4.5, LOCK 4.0, LEAN 3.0,
  // WEAK 2.5, FADE 1.0), so the 2.5★ `isActionable` threshold is
  // satisfied for WEAK and up, muted for FADE. Single source of
  // truth. earlyV12Tier is also reused below as `liveV12Tier` for the
  // tier-chip / banner so we don't compute v12 twice per render.
  // Full v12 result retained (not just the tier) so downstream display
  // surfaces — consensus-panel quintile bar, conviction gauge gating —
  // can read the SAME v12 score/quintile the tier strip uses instead of
  // falling back to the legacy v9 computation.
  const earlyV12Res = (() => {
    if (!consensusSide || !Array.isArray(gd.positions) || gd.positions.length === 0) return null;
    if (!walletProfiles || walletProfiles.size === 0) return null;
    const walletPriorStatsFn = buildWalletPriorStatsFnForUI(walletProfiles);
    if (!walletPriorStatsFn) return null;
    const cal = getAgsCalibration();
    if (!cal || !cal.v12Quintiles) return null;
    try {
      return computeAgsV12FromPositions(gd.positions, consensusSide, gd.sport, cal, walletPriorStatsFn);
    } catch { return null; }
  })();
  const earlyV12Tier = (() => {
    if (mlCronTier && AGS_TIER_META[mlCronTier]) return mlCronTier;
    return earlyV12Res?.tier && AGS_TIER_META[earlyV12Res.tier] ? earlyV12Res.tier : null;
  })();
  if (earlyV12Tier) {
    const v12Stars = starsFromAgsuTier(earlyV12Tier);
    sr.stars = v12Stars;
    sr.isActionable = v12Stars >= 2.5;
  }
  // Align with the allPosGames counter (8336): skip only truly extreme odds
  // (pinnProb >= 0.95). Previously a stricter 0.85 cap here hid cards that
  // the counter still included, so the header count disagreed with the
  // rendered list.
  const isExtremeOdds = pinnProb != null && pinnProb >= 0.95;
  if (isExtremeOdds) return null;
  // v5.5: legacy gate kept the system from ever creating a Firebase doc for
  // a sub-2.5★ play, which meant the whitelist promotion path inside
  // syncPickToFirebase (gated at baseStars≥1.0) literally never ran on
  // 1-2★ margin plays. The Dodgers ML 4/22 case (1 sharp, $48.6K, 1 MLB
  // WINNER, 2★ LEAN) was invisible to the system for that reason. We now
  // also accept a sub-2.5★ side when decideLockStage says it would be
  // promoted via whitelist (Δ≥+1, agW=0, baseStars≥1.0). This is the
  // renderer-side companion to the syncPickToFirebase-side override
  // shipped in v5.4.
  // v6.6 Two-Factor Lock Gate: Hybrid Floor (Δw≥+1 ∧ Δq≥+1 ∧ Δw+Δq≥+3)
  // is the sole promotion path. The dollar floor is delegated to the
  // engine's `minInvestedFloor(contribTier)` ($2.5k STRONG/STANDARD,
  // $5k LEAN) — the same gate `syncPickToFirebase` enforces on write.
  // The previous renderer-side hard $10k gate was stricter than the
  // engine and silently blocked locks (e.g. 4/27 TEX ML at $3.4k with
  // Δw=+2 / Δq=+3 / contribTier=STRONG): `isLocked` and `isShadow`
  // both went false, the sync useEffect returned early, and
  // syncPickToFirebase never ran.
  // pickDate computed earlier (threaded into rateStarsV8 + decideLockStage
  // + calculateUnits so v7.x cutover gates fire correctly). ET-normalized
  // via gameDate(commenceTime), matching what the sync layer stamps.
  const decision = sr?.v8Scoring && consensusSide && gd.sport
    ? decideLockStage(sr.regime, sr.v8Scoring, consensusSide, gd.sport, sr.stars, pickDate)
    : null;

  // AGS-Unified v9 — compute AGS-U for the consensus side EARLY so it can
  // drive sizing, the top-right star badge, and the consensus panel from
  // the same value.
  //
  // SINGLE SOURCE OF TRUTH: this calls computeAgsFromPositions from
  // src/lib/ags.js — the EXACT helper scripts/syncPickStateAuthoritative.js
  // uses for createMissingPicks and the every-cycle AGS refresh. Same
  // positions, same positionToWalletDetail mapping, same aggregateSideProven,
  // same computeAgs. The UI cannot drift from the cron's math because both
  // call the same function.
  //
  // The legacy path here built walletDetails from rateStarsV8's deduped /
  // cross-side-netted positions — a DIFFERENT shape from what the cron
  // sees, which is why ELITE/PREMIUM badges could appear on picks the
  // cron's math actually scored as LOCK or FADE. That divergence is gone.
  const liveLockedSideKey = lockedSideRef.current || consensusSide;
  // liveLockedV8 is the v8Scoring snapshot for the LOCKED-side view, kept
  // for downstream consumers that still read walletDetails for live
  // computeWalletConsensus (Δw / Δq / HC margin diagnostic display).
  // AGS-U itself no longer reads this — it goes straight through
  // computeAgsFromPositions on raw positions to match the cron.
  const liveLockedV8 = (lockedSideRef.current && lockedSideRef.current !== consensusSide)
    ? oppSr?.v8Scoring
    : sr?.v8Scoring;
  const liveAgsCalibration = getAgsCalibration();
  const liveAgs = (Array.isArray(gd.positions) && gd.positions.length > 0)
    ? computeAgsFromPositions(gd.positions, liveLockedSideKey, gd.sport, liveAgsCalibration, isProvenForAgs, isHcEligibleForAgs, walletStatsForAgs)
    : null;
  const liveAgsValue = Number.isFinite(liveAgs?.ags) ? liveAgs.ags : null;
  const liveAgsBadge = agsuBadgeFromAgs(liveAgsValue, liveAgsCalibration);
  const liveAgsTier  = liveAgsValue != null
    ? agsTierFromValue(liveAgsValue, liveAgsCalibration)
    : 'FADE';

  // Star + label come straight from AGS-U so the corner badge stays in
  // lockstep with the AGS-U Consensus Panel body. The old rateStarsV8
  // path (Δw / Δq / HC) is no longer consulted for display.
  sr.stars = liveAgsBadge.stars;
  sr.label = liveAgsBadge.label;
  sr.color = liveAgsBadge.color;
  sr.bg    = liveAgsBadge.bg;
  if (oppSr) {
    const oppAgs = (Array.isArray(gd.positions) && gd.positions.length > 0)
      ? computeAgsFromPositions(gd.positions, oppSide, gd.sport, liveAgsCalibration, isProvenForAgs, isHcEligibleForAgs, walletStatsForAgs)
      : null;
    const oppAgsValue = Number.isFinite(oppAgs?.ags) ? oppAgs.ags : null;
    const oppBadge = agsuBadgeFromAgs(oppAgsValue, liveAgsCalibration);
    oppSr.stars = oppBadge.stars;
    oppSr.label = oppBadge.label;
    oppSr.color = oppBadge.color;
    oppSr.bg    = oppBadge.bg;
  }

  // v7.1/v7.2/v7.3 — accept any registered floor source as a valid
  // lock-floor promotion (single source of truth: PROMOTED_BY_FLOORS).
  // All produce decision.stage === 'LOCKED' (LEAN ships at 0u).
  const twoFactorFloor = isPromotedBy(decision?.promotedBy);
  const minInvForSide = minInvestedFloor(decision?.contribTier);
  const minInvForSideShadow = minInvestedFloorShadow(decision?.contribTier);
  const meetsInvest = consensusInvested >= minInvForSide;
  const meetsInvestShadow = consensusInvested >= minInvForSideShadow;
  const meetsThreshold = meetsInvest && sr.stars >= 3.5;
  // v12: cron is authoritative — if AGS-U v12 has resolved this side as
  // FADE (either cron-stamped or browser-recomputed via the same library
  // function), it CANNOT be locked. decideLockStage / isPromotedBy / the
  // legacy two-factor floor still return promotedBy='ags-unified-v9' for
  // these sides (the v9 floor doesn't know about v12), so without this
  // gate isLocked stays true → the in-card sync useEffect stamps
  // lockedSideRef.current → isLockedInFirestore becomes true via the OR
  // branch → "LOCKED IN" badge + Risk pill render on top of v12-FADE
  // (2026-06-02 col_laa / sdp_phi). One line, kills the contradiction.
  const isCronFadeMute = earlyV12Tier === 'FADE';
  const isLocked = twoFactorFloor && meetsInvest && !isCronFadeMute;
  // V8.6 — SHADOW gate relaxed (stars ≥ 1.0 + minInvestedFloorShadow) so
  // we capture AGS / Δw / HC margin / walletDetails on a much wider tracked
  // sample. LOCKED path is untouched — `isLocked` still requires the strict
  // `meetsInvest` and the v7.4/v7.5 floor.
  const isShadow = meetsInvestShadow && !twoFactorFloor && sr.stars >= 1.0;

  // `isLocked` is the CLIENT-side AGS-U lock verdict. It drives the sync
  // write (only fires when isLocked / isShadow is true and we're pre-T-15).
  // `isLockedInFirestore` is what we use for every user-facing surface
  // ("LOCKED IN" badge, Risk row, units pill, "PLAY LOCKED — TIER"
  // banner). It is true only when the parent has observed an active
  // locked side for this game in Firestore (originalLockedSide prop) or
  // when our own sync has stamped lockedSideRef. This prevents the card
  // from claiming "LOCKED IN — Risk 1.5u" for a game that is post-T-15
  // and never got written, since once we cross T-15 the sync effect
  // returns early and the doc is never created. The locked-picks page
  // and the live card now share the same source of truth.
  const isLockedInFirestore = isLocked
    && (originalLockedSide === consensusSide
        || lockedSideRef.current === consensusSide);
  const lockType = isLockedInFirestore ? (isGameLive ? 'LIVE' : 'PREGAME') : null;
  const lockTierLive = decision?.lockTier || 'MUTED';
  const hcDominant = !!decision?.hcDominant;
  const hcMargin = decision?.hcMargin ?? 0;
  const sumDelta = (decision?.dw ?? 0) + (decision?.dq ?? 0);

  // Units derive directly from the AGS-U value. agsuUnitsFromAgs applies
  // the 6-band sizing ladder + odds cap and returns 0 when ags is null
  // or below the hard-mute floor. We gate on `isLockedInFirestore` (not
  // just the client-side `isLocked`) so we never claim "Risk 1.5u" for
  // a pick that hasn't actually been stamped to Firestore — otherwise
  // the live card and the locked-picks page would disagree.
  const unitsLive = isLockedInFirestore
    ? calculateUnits(sr.stars, cGrade.penalty, betOdds, computeRegimeBonus(sr.regime, sr.v8Scoring, consensusSide, gd.sport), lockTierLive, hcDominant, { pickDate, hcMargin, sum: sumDelta, ags: liveAgsValue })
    : 0;
  // CRON-FIRST: when the cron has stamped tier + finalUnits on the synced
  // ML doc for this game, use those exactly. Falls back to the live derive
  // when the cron hasn't stamped yet (pre-lock preview).
  const lockTier = mlCronTier || lockTierLive;
  const units = mlCronUnits != null ? mlCronUnits : unitsLive;
  // Stars derive from the resolved tier so the ★★★ display matches the
  // tier badge exactly (no LEAN-tier-with-5★ contradictions).
  const renderedStars = mlCronTier ? starsFromAgsuTier(mlCronTier) : sr.stars;
  // v12 chip meta. When the cron has stamped a v12 tier, the top-right
  // rating chip should speak v12 vocabulary (ELITE / PREMIUM / LOCK /
  // LEAN / WEAK / FADE with v12 colors) instead of the legacy
  // rateStarsV8 label ("ELITE PLAY" / "STRONG PLAY" / etc.) which is a
  // pure star-count bucket and disagrees with v12 on most picks. The
  // recommended-units pill already mirrors mlCronUnits, so showing a
  // v12-tier-aligned chip removes the "card says ELITE PLAY but
  // recommended is 0.0u" contradiction the user has been seeing.
  // The v12 tier was already resolved at the top of the component
  // (earlyV12Tier — cron stamp first, then a browser computation via
  // computeAgsV12FromPositions for unlocked cards). Reuse it so we
  // never compute v12 twice per render, and so the tier on the chip /
  // banner is guaranteed to match the tier that drove sr.stars + the
  // sizing pill. Note: the old `liveV12Tier` was wrapped in useMemo
  // and was declared *after* the `if (isExtremeOdds) return null` at
  // line ~6273 — a latent rules-of-hooks violation that React would
  // crash on if pinnProb crossed the 0.95 threshold mid-session. The
  // top-of-component resolution removes that gun.
  const effectiveV12Tier = earlyV12Tier;
  // NOTE: the legacy `chipLabel` / `chipColor` / `chipBg` / `chipBorderCron`
  // derivations were removed when the header chip was replaced with the
  // unified `displayMeta`-driven tier strip below. Visuals now read
  // exclusively from `displayState`. Keeping `effectiveV12Tier` because
  // both the consensus panel + `deriveDisplayState` PREVIEW fallback
  // consume it.
  const ut = unitTier(units);
  const potentialWin = isLockedInFirestore ? profitFromOdds(betOdds, units) : 0;

  // ─── UNIFIED v12 DISPLAY STATE (PLAY / TRACKING / MUTED / PREVIEW) ───
  // Single source of truth that drives every visual cue on the card. The
  // legacy gates (`isLockedInFirestore` / `isActionable` / live health
  // status) routinely disagreed on a render — manifested as the
  // "LOCKED IN + WEAK 0.0u + RECOMMENDED BET + HARD MUTE" stack the user
  // was seeing. From here on, the header tier strip, action box title,
  // accent color, and banner ALL read from `displayState` so they can't
  // contradict each other. Cron stamps are authoritative; the browser
  // fallback (`effectiveV12Tier`) only shows up as PREVIEW when the cron
  // has not yet evaluated.
  const displayML = deriveDisplayState({
    cronTier: mlCronTier,
    cronUnits: mlCronUnits,
    fallbackTier: effectiveV12Tier,
    cronStakeTier: mlCronStakeTier,
  });
  const displayState = displayML.state;
  const displayTier = displayML.tier;
  const displayUnits = displayML.units;
  const displayMeta = AGS_V12_DISPLAY_META[displayState];

  useEffect(() => {
    if ((!isLocked && !isShadow) || isGameLive || !commenceTime || !onPickSynced) return;
    if (Date.now() >= commenceTime - 15 * 60 * 1000) return;
    if (lastSyncedSide.current && consensusSide !== lastSyncedSide.current) {
      lastSyncedStars.current = null;
      lockStarsRef.current = null;
      lockRawScoreRef.current = null;
    }
    if (lastSyncedStars.current !== null && sr.stars <= lastSyncedStars.current && !isLocked) return;
    const date = gameDate(commenceTime);
    syncPickToFirebase({
      date, sport: gd.sport, gameKey: gd.key, away: gd.away, home: gd.home,
      commenceTime, side: consensusSide, team: consensusTeam,
      odds: betOdds, book: bestBook || 'Pinnacle',
      pinnacleOdds: consensusOdds, evEdge,
      criteriaMet,
      criteria: {
        sharps3Plus: consensusWallets >= 3, plusEV: hasEV,
        pinnacleConfirms: pinnConfirms, invested10kPlus: consensusInvested >= 10000,
        lineMovingWith: pinnMovingWith, predMarketAligns: polyMovingWith,
      },
      sharpCount: consensusWallets, totalInvested: consensusInvested,
      units, consensusStrength: { moneyPct: Math.round(moneyPct), walletPct: Math.round(walletPct), grade: cGrade.label },
      stars: sr.stars,
      opposition: {
        sharpCount: oppSharpFeatures.conWalletCount,
        totalInvested: oppSharpFeatures.conTotalInvested,
        avgBet: oppSharpFeatures.conWalletCount > 0 ? Math.round(oppSharpFeatures.conTotalInvested / oppSharpFeatures.conWalletCount) : 0,
        stars: oppPeakStars,
        counterSharpScore: sharpFeatures.counterSharpScore,
        consensusTier: oppSharpFeatures.consensusTier,
      },
      walletProfile: {
        breadth: +(sharpFeatures.breadth || 0).toFixed(3),
        conviction: +(sharpFeatures.conviction || 0).toFixed(3),
        concentration: +(sharpFeatures.concentration || 0).toFixed(3),
        counterSharpScore: sharpFeatures.counterSharpScore || 0,
        sportSharpCount: sharpFeatures.sportSharpCount || 0,
        dominantTier: sharpFeatures.dominantTier || null,
        conWalletCount: sharpFeatures.conWalletCount || 0,
        oppWalletCount: sharpFeatures.oppWalletCount || 0,
        consensusTier: sharpFeatures.consensusTier || 'LEAN',
      },
      regime: sr.regime,
      qualityProxy: sr.qualityProxy,
      v8Scoring: sr.v8Scoring,
    }).then(({ docId, action, originalSide }) => {
      if (action === 'error') return;
      lastSyncedStars.current = sr.stars;
      lastSyncedSide.current = consensusSide;
      if (!lockOddsRef.current) lockOddsRef.current = betOdds;
      if (lockStarsRef.current == null) lockStarsRef.current = sr.stars;
      if (lockRawScoreRef.current == null) lockRawScoreRef.current = sr.rawScore;
      if (lockWPSRef.current == null) lockWPSRef.current = sr.walletPlayScore;
      if (flipBeatThresholdRef.current == null) flipBeatThresholdRef.current = sr.walletPlayScore;
      if (action === 'side_added') {
        flipBeatThresholdRef.current = sr.walletPlayScore;
        lockWPSRef.current = sr.walletPlayScore;
        lockedSideRef.current = consensusSide;
      }
      if (!lockedSideRef.current) lockedSideRef.current = originalSide || consensusSide;
      if (action !== 'no_change') {
        onPickSynced(docId, consensusSide, { odds: betOdds, book: bestBook || 'Pinnacle', pinnacleOdds: pinnOdds, criteriaMet, criteria: { sharps3Plus: consensusWallets >= 3, plusEV: hasEV, pinnacleConfirms: pinnConfirms, invested10kPlus: consensusInvested >= 10000, lineMovingWith: pinnMovingWith, predMarketAligns: polyMovingWith }, sharpCount: consensusWallets, totalInvested: consensusInvested, evEdge: bestEV, units, unitTier: ut.label, consensusStrength: { moneyPct: Math.round(moneyPct), walletPct: Math.round(walletPct), grade: cGrade.label }, stars: sr.stars, team: consensusTeam }, { sport: gd.sport, away: gd.away, home: gd.home, commenceTime }, action);
      }
    });
  }, [isLocked, isShadow, sr.stars, consensusSide]);

  // Pregame snapshot — capture full state ~30 min before game for lock→pregame analysis
  useEffect(() => {
    if ((!isLocked && !isShadow) || isGameLive || !commenceTime || pregameSynced.current) return;
    const now = Date.now();
    const msUntilGame = commenceTime - now;
    const PREGAME_WINDOW = 35 * 60 * 1000;
    const PREGAME_CUTOFF = 5 * 60 * 1000;
    if (msUntilGame > PREGAME_WINDOW || msUntilGame < PREGAME_CUTOFF) return;
    const date = gameDate(commenceTime);
    const docId = `${date}_${gd.sport}_${gd.key}`;
    pregameSynced.current = true;
    syncPregameSnapshot({
      docId, side: consensusSide,
      snapshot: {
        odds: betOdds, book: bestBook || 'Pinnacle',
        pinnacleOdds: consensusOdds, evEdge: evEdge || 0,
        criteriaMet,
        criteria: {
          sharps3Plus: consensusWallets >= 3, plusEV: hasEV,
          pinnacleConfirms: pinnConfirms, invested10kPlus: consensusInvested >= 10000,
          lineMovingWith: pinnMovingWith, predMarketAligns: polyMovingWith,
        },
        sharpCount: consensusWallets, totalInvested: consensusInvested,
        units, stars: sr.stars,
        consensusStrength: { moneyPct: Math.round(moneyPct), walletPct: Math.round(walletPct), grade: cGrade.label },
        opposition: {
          sharpCount: oppSharpFeatures.conWalletCount,
          totalInvested: oppSharpFeatures.conTotalInvested,
          avgBet: oppSharpFeatures.conWalletCount > 0 ? Math.round(oppSharpFeatures.conTotalInvested / oppSharpFeatures.conWalletCount) : 0,
          stars: oppPeakStars,
          counterSharpScore: sharpFeatures.counterSharpScore,
        },
        minutesBeforeGame: Math.round(msUntilGame / 60000),
        regime: sr.regime,
        qualityProxy: sr.qualityProxy,
      },
    });
  });

  // ─── ML Pick Health Evaluation ──────────────────────────────────────────────
  const wasEverLocked = isLocked || lockStarsRef.current != null || originalLockedSide != null;
  const sideFlipped = lockedSideRef.current != null && consensusSide !== lockedSideRef.current;
  // Resolve WPS from the LOCKED side's perspective — regardless of which side
  // wallet-count consensus currently favors. When sideFlipped, `sr` is the
  // opposing-to-lock side's score and `oppSr` is the locked side's score.
  const lockedSideWPS = sideFlipped ? oppSr.walletPlayScore : sr.walletPlayScore;
  const oppToLockWPS  = sideFlipped ? sr.walletPlayScore    : oppSr.walletPlayScore;
  const lockedSideStars = sideFlipped ? oppSr.stars : sr.stars;
  const mlLockedSideKey = liveLockedSideKey;
  const mlLockedV8 = liveLockedV8;
  // v7.3 — derive pickDate from commenceTime so v7.3 HC overrides apply
  // to live computeWalletConsensus + evaluatePickHealth calls.
  const mlPickDate = commenceTime ? gameDate(commenceTime) : null;
  const mlWalletConsensus = wasEverLocked
    ? computeWalletConsensus(mlLockedV8?.walletDetails, gd.sport, mlLockedSideKey, mlPickDate)
    : null;
  // mlAgs aliases the early-hoisted liveAgs computation (single source of
  // truth — see comment block above `liveLockedSideKey`). Keeps the
  // downstream code paths (health gate, consensus panel) unchanged.
  const mlAgs = liveAgs;
  const mlAgsProvenTotal = mlAgs ? (mlAgs.provenForCount + mlAgs.provenAgCount) : null;
  const mlHealth = wasEverLocked ? evaluatePickHealth({
    currentWPS: lockedSideWPS,
    oppSideWPS: oppToLockWPS,
    lockWPS: lockWPSRef.current,
    sideFlipped,
    flipBeatThreshold: flipBeatThresholdRef.current,
    timeToGame: commenceTime ? (commenceTime - Date.now()) / 60000 : null,
    currentStars: lockedSideStars,
    walletConsensus: mlWalletConsensus,
    pickDate: mlPickDate,
    agsValue: mlAgs?.ags ?? null,
    agsProvenTotal: mlAgsProvenTotal,
    lockStage: lockedSideRef.current ? 'LOCKED' : null,
  }) : { status: 'ACTIVE', reasons: [], currentStars: sr.stars, wpsDelta: 0 };

  const lastHealthRef = useRef(null);
  useEffect(() => {
    if (!wasEverLocked || !commenceTime) return;
    // v12 cleanup: do NOT propagate the browser's v11-computed mlHealth
    // into the parent's lockedPicks React state via onHealthSynced. The
    // parent overwrites sd.health with mlHealth, which then renders the
    // LockedPickCard as MUTED/WEAKENING+ags_hard_mute even when Firestore
    // (cron-authoritative) has health=ACTIVE. The Firestore-loaded value
    // from loadLockedPicks() is the truth.
    // const date = gameDate(commenceTime);
    // const docId = `${date}_${gd.sport}_${gd.key}`;
    // const healthSide = lockedSideRef.current || consensusSide;
    // if (onHealthSynced) onHealthSynced(docId, healthSide, mlHealth);
    // syncPickHealth({ docId, collection: 'sharpFlowPicks', side: healthSide, health: mlHealth });
  }, [wasEverLocked, mlHealth.status, sr.walletPlayScore, oppSr.walletPlayScore]);

  // ─── Spread Position Lock Detection ───────────────────────────────────────
  const spreadGameData = spreadPositions?.[gd.sport]?.[gd.key];
  const spreadSummary = spreadGameData?.summary;
  const spreadConsensusSide = spreadSummary?.consensus;
  const spreadConsensuTeam = spreadConsensusSide === 'away' ? gd.away : gd.home;

  const spreadPinnLine = pinnGame?.spreadCurrent;
  const spreadPinnOdds = spreadConsensusSide === 'away'
    ? pinnGame?.spreadCurrent?.awayOdds : pinnGame?.spreadCurrent?.homeOdds;
  const spreadBestRetail = spreadConsensusSide === 'away'
    ? pinnGame?.bestAwaySpread?.odds : pinnGame?.bestHomeSpread?.odds;
  const spreadBestBook = spreadConsensusSide === 'away'
    ? pinnGame?.bestAwaySpread?.book : pinnGame?.bestHomeSpread?.book;
  const spreadLine = spreadConsensusSide === 'away'
    ? pinnGame?.spreadCurrent?.awayLine : pinnGame?.spreadCurrent?.homeLine;

  const spreadPinnProb = impliedProb(spreadPinnOdds);
  const spreadRetailProb = impliedProb(spreadBestRetail);
  const spreadEvEdge = (spreadPinnProb && spreadRetailProb) ? +((spreadPinnProb - spreadRetailProb) * 100).toFixed(1) : null;

  const spreadOpenLine = pinnGame?.spreadOpener;
  const spreadLineMovedWith = spreadOpenLine && spreadPinnLine && spreadConsensusSide === 'away'
    ? (spreadPinnLine.awayLine < spreadOpenLine.awayLine)
    : spreadOpenLine && spreadPinnLine ? (spreadPinnLine.homeLine < spreadOpenLine.homeLine) : false;
  const spreadLineMovedAgainst = spreadOpenLine && spreadPinnLine && spreadConsensusSide === 'away'
    ? (spreadPinnLine.awayLine > spreadOpenLine.awayLine)
    : spreadOpenLine && spreadPinnLine ? (spreadPinnLine.homeLine > spreadOpenLine.homeLine) : false;
  const spreadOpenOdds = spreadConsensusSide === 'away'
    ? pinnGame?.spreadOpener?.awayOdds : pinnGame?.spreadOpener?.homeOdds;
  const spreadOpenProb = impliedProb(spreadOpenOdds);
  const spreadCurrentProb = impliedProb(spreadPinnOdds);
  const spreadOddsMovedWith = !!(spreadOpenProb && spreadCurrentProb) && spreadCurrentProb > spreadOpenProb;
  const spreadOddsMovedAgainst = !!(spreadOpenProb && spreadCurrentProb) && spreadCurrentProb < spreadOpenProb;
  const spreadPinnMovedWith = spreadLineMovedWith || spreadOddsMovedWith;
  const spreadPinnMovedAgainst = spreadLineMovedAgainst || spreadOddsMovedAgainst;
  const spreadPinnMoveSize = (() => {
    const probDelta = (spreadOpenProb && spreadCurrentProb) ? Math.abs(spreadCurrentProb - spreadOpenProb) : 0;
    if (spreadLineMovedWith || spreadLineMovedAgainst) return Math.max(probDelta, 0.02);
    return probDelta;
  })();

  const spreadSharpFeatures = spreadGameData ? computeSharpFeatures(spreadGameData.positions || [], spreadConsensusSide) : null;
  const spreadPinnConfirms = !!spreadPinnLine && spreadConsensusSide === 'away'
    ? (spreadPinnLine.awayLine < 0)
    : !!spreadPinnLine && (spreadPinnLine.homeLine < 0);
  const spreadBetOdds = spreadBestRetail || spreadPinnOdds;
  const spreadSr = spreadGameData ? rateStarsV8({
    positions: spreadGameData.positions || [], consensusSide: spreadConsensusSide, v8Norm,
    pinnMoveSize: spreadPinnMoveSize,
    timeToGame: commenceTime ? (commenceTime - Date.now()) / 60000 : null,
    lockOdds: null, pinnCurrentOdds: spreadPinnOdds,
    sport: gd.sport,
    pickDate,
  }) : null;

  const spreadWhaleOverride = spreadSharpFeatures
    && (spreadSharpFeatures.conWalletCount || 0) === 1
    && (spreadSharpFeatures.conTotalInvested || 0) >= 25000
    && spreadGameData?.positions?.some(p => p.side === spreadConsensusSide && (p.sportPnl || 0) >= 500000);
  // v6.6 Two-Factor spread lock gate — identical policy to ML. Dollar
  // floor delegated to engine `minInvestedFloor(contribTier)` so the
  // renderer can't be stricter than the engine (see ML gate above).
  const spreadPickDate = commenceTime ? gameDate(commenceTime) : null;
  const spreadDecision = spreadSr?.v8Scoring && spreadConsensusSide && gd.sport
    ? decideLockStage(spreadSr.regime, spreadSr.v8Scoring, spreadConsensusSide, gd.sport, spreadSr.stars, spreadPickDate)
    : null;
  const spreadTwoFactorFloor = isPromotedBy(spreadDecision?.promotedBy);
  const spreadMinInv = minInvestedFloor(spreadDecision?.contribTier);
  const spreadMinInvShadow = minInvestedFloorShadow(spreadDecision?.contribTier);
  const spreadMeetsInvest = (spreadSharpFeatures?.conTotalInvested || 0) >= spreadMinInv;
  const spreadMeetsInvestShadow = (spreadSharpFeatures?.conTotalInvested || 0) >= spreadMinInvShadow;
  const spreadMeetsThreshold = spreadSr && spreadMeetsInvest && spreadSr.stars >= 3.5;
  const isSpreadLockedRaw = !!spreadSr && spreadTwoFactorFloor && spreadMeetsInvest;
  // V8.6 — SHADOW gate relaxed (mirror of ML).
  const isSpreadShadow = !!spreadSr && spreadMeetsInvestShadow && !spreadTwoFactorFloor && spreadSr.stars >= 1.0;
  const spreadLockTierLive = spreadDecision?.lockTier || 'MUTED';
  const spreadHcDominant = !!spreadDecision?.hcDominant;
  const spreadHcMargin = spreadDecision?.hcMargin ?? 0;
  const spreadSumDelta = (spreadDecision?.dw ?? 0) + (spreadDecision?.dq ?? 0);
  const spreadUnitsLive = (isSpreadLockedRaw || isSpreadShadow)
    ? calculateSpreadTotalUnits(spreadSr.stars, 0, spreadBetOdds, computeRegimeBonus(spreadSr.regime, spreadSr.v8Scoring, spreadConsensusSide, gd.sport), spreadLockTierLive, spreadHcDominant, { pickDate: spreadPickDate, hcMargin: spreadHcMargin, sum: spreadSumDelta })
    : 0;
  // CRON-FIRST overrides (see ML / total comments above).
  const spreadLockTier = spreadCronTier || spreadLockTierLive;
  const spreadUnits = spreadCronUnits != null ? spreadCronUnits : spreadUnitsLive;
  const isSpreadLocked = isSpreadLockedRaw
    || (!!spreadCronTier && spreadCronTier !== 'FADE' && spreadCronTier !== 'UNKNOWN' && (spreadCronUnits ?? 0) > 0);
  const spreadRenderedStars = spreadCronStakeTier ? starsFromAgsuTier(spreadCronStakeTier)
    : spreadCronTier ? starsFromAgsuTier(spreadCronTier) : (spreadSr?.stars ?? 0);

  useEffect(() => {
    if ((!isSpreadLocked && !isSpreadShadow) || isGameLive || !commenceTime || !onPickSynced || !spreadConsensusSide) return;
    if (Date.now() >= commenceTime - 15 * 60 * 1000) return;
    if (lastSyncedSpreadStars.current !== null && spreadSr.stars <= lastSyncedSpreadStars.current && !isSpreadLocked) return;
    const date = gameDate(commenceTime);
    syncSpreadPickToFirebase({
      date, sport: gd.sport, gameKey: gd.key, away: gd.away, home: gd.home,
      commenceTime, side: spreadConsensusSide, team: spreadConsensuTeam,
      line: spreadLine, odds: spreadBetOdds, book: spreadBestBook || 'Pinnacle',
      pinnacleOdds: spreadPinnOdds, evEdge: spreadEvEdge,
      criteriaMet: spreadSharpFeatures ? (spreadSharpFeatures.conWalletCount >= 3 ? 1 : 0) + (spreadEvEdge > 0 ? 1 : 0) + (spreadPinnMovedWith ? 1 : 0) : 0,
      criteria: {
        sharps3Plus: spreadSharpFeatures?.conWalletCount >= 3,
        plusEV: spreadEvEdge > 0,
        lineMovingWith: spreadPinnMovedWith,
      },
      sharpCount: spreadSharpFeatures?.conWalletCount || 0,
      totalInvested: spreadSharpFeatures?.conTotalInvested || 0,
      units: spreadUnits, consensusStrength: { moneyPct: Math.round(spreadSharpFeatures?.conMoneyPct ?? 50), walletPct: Math.round(spreadSharpFeatures?.conWalletPct ?? 50), grade: spreadSharpFeatures?.consensusTier || 'LEAN' },
      stars: spreadSr.stars,
      walletProfile: spreadSharpFeatures ? {
        breadth: +(spreadSharpFeatures.breadth || 0).toFixed(3),
        conviction: +(spreadSharpFeatures.conviction || 0).toFixed(3),
        concentration: +(spreadSharpFeatures.concentration || 0).toFixed(3),
        counterSharpScore: spreadSharpFeatures.counterSharpScore || 0,
        sportSharpCount: spreadSharpFeatures.sportSharpCount || 0,
        dominantTier: spreadSharpFeatures.dominantTier || null,
        conWalletCount: spreadSharpFeatures.conWalletCount || 0,
        oppWalletCount: spreadSharpFeatures.oppWalletCount || 0,
        consensusTier: spreadSharpFeatures.consensusTier || 'LEAN',
      } : null,
      regime: spreadSr.regime,
      qualityProxy: spreadSr.qualityProxy,
      v8Scoring: spreadSr.v8Scoring,
    }).then(({ docId, action }) => {
      if (action === 'error') return;
      lastSyncedSpreadStars.current = spreadSr.stars;
      if (lockSpreadStarsRef.current == null) lockSpreadStarsRef.current = spreadSr.stars;
      if (lockSpreadRawScoreRef.current == null) lockSpreadRawScoreRef.current = spreadSr.rawScore;
      if (lockSpreadWPSRef.current == null) lockSpreadWPSRef.current = spreadSr.walletPlayScore;
      if (action !== 'no_change') {
        onPickSynced(docId, spreadConsensusSide, { odds: spreadBetOdds, book: spreadBestBook || 'Pinnacle', pinnacleOdds: spreadPinnOdds, line: spreadLine, criteriaMet: spreadSharpFeatures ? (spreadSharpFeatures.conWalletCount >= 3 ? 1 : 0) + (spreadEvEdge > 0 ? 1 : 0) + (spreadPinnMovedWith ? 1 : 0) : 0, criteria: { sharps3Plus: spreadSharpFeatures?.conWalletCount >= 3, plusEV: spreadEvEdge > 0, lineMovingWith: spreadPinnMovedWith }, sharpCount: spreadSharpFeatures?.conWalletCount || 0, totalInvested: spreadSharpFeatures?.conTotalInvested || 0, evEdge: spreadEvEdge, units: spreadUnits, unitTier: unitTier(spreadUnits).label, consensusStrength: { moneyPct: Math.round(spreadSharpFeatures?.conMoneyPct ?? 50), walletPct: Math.round(spreadSharpFeatures?.conWalletPct ?? 50), grade: spreadSharpFeatures?.consensusTier || 'LEAN' }, stars: spreadSr.stars, team: spreadConsensuTeam }, { sport: gd.sport, away: gd.away, home: gd.home, commenceTime, marketType: 'spread' }, action);
      }
    });
  }, [isSpreadLocked, isSpreadShadow, spreadSr?.stars]);

  // ─── Spread Pick Health Evaluation ────────────────────────────────────────
  const spreadWasEverLocked = isSpreadLocked || lastSyncedSpreadStars.current != null || lockSpreadStarsRef.current != null;
  const spreadPickDateLive = commenceTime ? gameDate(commenceTime) : null;
  const spreadWalletConsensus = spreadWasEverLocked && spreadSr
    ? computeWalletConsensus(spreadSr.v8Scoring?.walletDetails, gd.sport, spreadConsensusSide, spreadPickDateLive)
    : null;
  const spreadAgs = (() => {
    if (!spreadWasEverLocked || !spreadSr) return null;
    const pos = spreadGameData?.positions;
    if (!Array.isArray(pos) || pos.length === 0) return null;
    return computeAgsFromPositions(pos, spreadConsensusSide, gd.sport, getAgsCalibration(), isProvenForAgs, isHcEligibleForAgs, walletStatsForAgs);
  })();
  const spreadAgsProvenTotal = spreadAgs ? (spreadAgs.provenForCount + spreadAgs.provenAgCount) : null;
  const spreadHealth = spreadWasEverLocked && spreadSr ? evaluatePickHealth({
    currentWPS: spreadSr.walletPlayScore,
    lockWPS: lockSpreadWPSRef.current,
    sideFlipped: false,
    newSideWPS: null,
    flipBeatThreshold: null,
    timeToGame: commenceTime ? (commenceTime - Date.now()) / 60000 : null,
    currentStars: spreadSr.stars,
    walletConsensus: spreadWalletConsensus,
    pickDate: spreadPickDateLive,
    agsValue: spreadAgs?.ags ?? null,
    agsProvenTotal: spreadAgsProvenTotal,
    lockStage: isSpreadLocked ? 'LOCKED' : null,
  }) : { status: 'ACTIVE', reasons: [], currentStars: spreadSr?.stars || 0, wpsDelta: 0 };

  const lastSpreadHealthRef = useRef(null);
  useEffect(() => {
    if (!spreadWasEverLocked || !commenceTime || !spreadConsensusSide) return;
    // v12 cleanup: see ML branch above for full rationale.
    // const date = gameDate(commenceTime);
    // const docId = `${date}_${gd.sport}_${gd.key}_spread`;
    // if (onHealthSynced) onHealthSynced(docId, spreadConsensusSide, spreadHealth);
    // syncPickHealth({ docId, collection: 'sharpFlowSpreads', side: spreadConsensusSide, health: spreadHealth });
  }, [spreadWasEverLocked, spreadHealth.status, spreadSr?.walletPlayScore]);

  // ─── Total (O/U) Position Lock Detection ───────────────────────────────────
  const totalGameData = totalPositions?.[gd.sport]?.[gd.key];
  const totalSummary = totalGameData?.summary;
  const totalConsensusSide = totalSummary?.consensus; // 'over' or 'under'

  const totalPinnLine = pinnGame?.totalCurrent;
  const totalPinnOdds = totalConsensusSide === 'over'
    ? pinnGame?.totalCurrent?.overOdds : pinnGame?.totalCurrent?.underOdds;
  const totalBestRetail = totalConsensusSide === 'over'
    ? pinnGame?.bestOverTotal?.odds : pinnGame?.bestUnderTotal?.odds;
  const totalBestBook = totalConsensusSide === 'over'
    ? pinnGame?.bestOverTotal?.book : pinnGame?.bestUnderTotal?.book;
  const totalLine = pinnGame?.totalCurrent?.line;

  const totalPinnProb = impliedProb(totalPinnOdds);
  const totalRetailProb = impliedProb(totalBestRetail);
  const totalEvEdge = (totalPinnProb && totalRetailProb) ? +((totalPinnProb - totalRetailProb) * 100).toFixed(1) : null;

  const totalOpenLine = pinnGame?.totalOpener;
  const totalLineMovedWith = totalOpenLine && totalPinnLine && totalConsensusSide === 'over'
    ? (totalPinnLine.line > totalOpenLine.line)
    : totalOpenLine && totalPinnLine ? (totalPinnLine.line < totalOpenLine.line) : false;
  const totalLineMovedAgainst = totalOpenLine && totalPinnLine && totalConsensusSide === 'over'
    ? (totalPinnLine.line < totalOpenLine.line)
    : totalOpenLine && totalPinnLine ? (totalPinnLine.line > totalOpenLine.line) : false;
  const totalOpenOdds = totalConsensusSide === 'over'
    ? pinnGame?.totalOpener?.overOdds : pinnGame?.totalOpener?.underOdds;
  const totalOpenProb = impliedProb(totalOpenOdds);
  const totalCurrentProb = impliedProb(totalPinnOdds);
  const totalOddsMovedWith = !!(totalOpenProb && totalCurrentProb) && totalCurrentProb > totalOpenProb;
  const totalOddsMovedAgainst = !!(totalOpenProb && totalCurrentProb) && totalCurrentProb < totalOpenProb;
  const totalPinnMovedWith = totalLineMovedWith || totalOddsMovedWith;
  const totalPinnMovedAgainst = totalLineMovedAgainst || totalOddsMovedAgainst;
  const totalPinnMoveSize = (() => {
    const probDelta = (totalOpenProb && totalCurrentProb) ? Math.abs(totalCurrentProb - totalOpenProb) : 0;
    if (totalLineMovedWith || totalLineMovedAgainst) return Math.max(probDelta, 0.02);
    return probDelta;
  })();

  const totalPinnConfirms = !!totalPinnLine && !!totalLine;
  const totalSharpFeatures = totalGameData ? computeSharpFeatures(totalGameData.positions || [], totalConsensusSide) : null;
  const totalBetOdds = totalBestRetail || totalPinnOdds;
  const totalSr = totalGameData ? rateStarsV8({
    positions: totalGameData.positions || [], consensusSide: totalConsensusSide, v8Norm,
    pinnMoveSize: totalPinnMoveSize,
    timeToGame: commenceTime ? (commenceTime - Date.now()) / 60000 : null,
    lockOdds: null, pinnCurrentOdds: totalPinnOdds,
    sport: gd.sport,
    pickDate,
  }) : null;

  const totalWhaleOverride = totalSharpFeatures
    && (totalSharpFeatures.conWalletCount || 0) === 1
    && (totalSharpFeatures.conTotalInvested || 0) >= 25000
    && totalGameData?.positions?.some(p => p.side === totalConsensusSide && (p.sportPnl || 0) >= 500000);
  // v6.6 Two-Factor totals lock gate — identical policy to ML/spread.
  // Dollar floor delegated to engine `minInvestedFloor(contribTier)`.
  const totalPickDate = commenceTime ? gameDate(commenceTime) : null;
  const totalDecision = totalSr?.v8Scoring && totalConsensusSide && gd.sport
    ? decideLockStage(totalSr.regime, totalSr.v8Scoring, totalConsensusSide, gd.sport, totalSr.stars, totalPickDate)
    : null;
  const totalTwoFactorFloor = isPromotedBy(totalDecision?.promotedBy);
  const totalMinInv = minInvestedFloor(totalDecision?.contribTier);
  const totalMinInvShadow = minInvestedFloorShadow(totalDecision?.contribTier);
  const totalMeetsInvest = (totalSharpFeatures?.conTotalInvested || 0) >= totalMinInv;
  const totalMeetsInvestShadow = (totalSharpFeatures?.conTotalInvested || 0) >= totalMinInvShadow;
  const totalMeetsThreshold = totalSr && totalMeetsInvest && totalSr.stars >= 3.5;
  const isTotalLockedRaw = !!totalSr && totalTwoFactorFloor && totalMeetsInvest;
  // V8.6 — SHADOW gate relaxed (mirror of ML).
  const isTotalShadow = !!totalSr && totalMeetsInvestShadow && !totalTwoFactorFloor && totalSr.stars >= 1.0;
  const totalLockTierLive = totalDecision?.lockTier || 'MUTED';
  const totalHcDominant = !!totalDecision?.hcDominant;
  const totalHcMargin = totalDecision?.hcMargin ?? 0;
  const totalSumDelta = (totalDecision?.dw ?? 0) + (totalDecision?.dq ?? 0);
  const totalUnitsLive = (isTotalLockedRaw || isTotalShadow)
    ? calculateSpreadTotalUnits(totalSr.stars, 0, totalBetOdds, computeRegimeBonus(totalSr.regime, totalSr.v8Scoring, totalConsensusSide, gd.sport), totalLockTierLive, totalHcDominant, { pickDate: totalPickDate, hcMargin: totalHcMargin, sum: totalSumDelta })
    : 0;
  // CRON-FIRST: when the cron has stamped tier + finalUnits on the synced
  // total doc for this game, mirror those values verbatim. Live-derived
  // values are only used as a pre-lock preview (no synced doc yet) or as
  // a fallback when the cron hasn't run since the doc was created.
  const totalLockTier = totalCronTier || totalLockTierLive;
  const totalUnits = totalCronUnits != null ? totalCronUnits : totalUnitsLive;
  // A pick is "locked" for display purposes when EITHER the live ladder
  // says so OR the cron has stamped a non-FADE tier on the synced doc.
  // The cron's tier is the authoritative shipped-ness signal: anything
  // non-FADE with finalUnits > 0 was actually promoted.
  const isTotalLocked = isTotalLockedRaw
    || (!!totalCronTier && totalCronTier !== 'FADE' && totalCronTier !== 'UNKNOWN' && (totalCronUnits ?? 0) > 0);
  const totalRenderedStars = totalCronStakeTier ? starsFromAgsuTier(totalCronStakeTier)
    : totalCronTier ? starsFromAgsuTier(totalCronTier) : (totalSr?.stars ?? 0);

  useEffect(() => {
    if ((!isTotalLocked && !isTotalShadow) || isGameLive || !commenceTime || !onPickSynced || !totalConsensusSide) return;
    if (Date.now() >= commenceTime - 15 * 60 * 1000) return;
    if (lastSyncedTotalStars.current !== null && totalSr.stars <= lastSyncedTotalStars.current && !isTotalLocked) return;
    const date = gameDate(commenceTime);
    syncTotalPickToFirebase({
      date, sport: gd.sport, gameKey: gd.key, away: gd.away, home: gd.home,
      commenceTime, side: totalConsensusSide,
      team: totalConsensusSide === 'over' ? `Over ${totalLine}` : `Under ${totalLine}`,
      line: totalLine, odds: totalBetOdds, book: totalBestBook || 'Pinnacle',
      pinnacleOdds: totalPinnOdds, evEdge: totalEvEdge,
      criteriaMet: totalSharpFeatures ? (totalSharpFeatures.conWalletCount >= 3 ? 1 : 0) + (totalEvEdge > 0 ? 1 : 0) + (totalPinnMovedWith ? 1 : 0) : 0,
      criteria: {
        sharps3Plus: totalSharpFeatures?.conWalletCount >= 3,
        plusEV: totalEvEdge > 0,
        lineMovingWith: totalPinnMovedWith,
      },
      sharpCount: totalSharpFeatures?.conWalletCount || 0,
      totalInvested: totalSharpFeatures?.conTotalInvested || 0,
      units: totalUnits, consensusStrength: { moneyPct: Math.round(totalSharpFeatures?.conMoneyPct ?? 50), walletPct: Math.round(totalSharpFeatures?.conWalletPct ?? 50), grade: totalSharpFeatures?.consensusTier || 'LEAN' },
      stars: totalSr.stars,
      walletProfile: totalSharpFeatures ? {
        breadth: +(totalSharpFeatures.breadth || 0).toFixed(3),
        conviction: +(totalSharpFeatures.conviction || 0).toFixed(3),
        concentration: +(totalSharpFeatures.concentration || 0).toFixed(3),
        counterSharpScore: totalSharpFeatures.counterSharpScore || 0,
        sportSharpCount: totalSharpFeatures.sportSharpCount || 0,
        dominantTier: totalSharpFeatures.dominantTier || null,
        conWalletCount: totalSharpFeatures.conWalletCount || 0,
        oppWalletCount: totalSharpFeatures.oppWalletCount || 0,
        consensusTier: totalSharpFeatures.consensusTier || 'LEAN',
      } : null,
      regime: totalSr.regime,
      qualityProxy: totalSr.qualityProxy,
      v8Scoring: totalSr.v8Scoring,
    }).then(({ docId, action }) => {
      if (action === 'error') return;
      lastSyncedTotalStars.current = totalSr.stars;
      if (lockTotalStarsRef.current == null) lockTotalStarsRef.current = totalSr.stars;
      if (lockTotalRawScoreRef.current == null) lockTotalRawScoreRef.current = totalSr.rawScore;
      if (lockTotalWPSRef.current == null) lockTotalWPSRef.current = totalSr.walletPlayScore;
      if (action !== 'no_change') {
        const totalTeamLabel = totalConsensusSide === 'over' ? `Over ${totalLine}` : `Under ${totalLine}`;
        onPickSynced(docId, totalConsensusSide, { odds: totalBetOdds, book: totalBestBook || 'Pinnacle', pinnacleOdds: totalPinnOdds, line: totalLine, criteriaMet: totalSharpFeatures ? (totalSharpFeatures.conWalletCount >= 3 ? 1 : 0) + (totalEvEdge > 0 ? 1 : 0) + (totalPinnMovedWith ? 1 : 0) : 0, criteria: { sharps3Plus: totalSharpFeatures?.conWalletCount >= 3, plusEV: totalEvEdge > 0, lineMovingWith: totalPinnMovedWith }, sharpCount: totalSharpFeatures?.conWalletCount || 0, totalInvested: totalSharpFeatures?.conTotalInvested || 0, evEdge: totalEvEdge, units: totalUnits, unitTier: unitTier(totalUnits).label, consensusStrength: { moneyPct: Math.round(totalSharpFeatures?.conMoneyPct ?? 50), walletPct: Math.round(totalSharpFeatures?.conWalletPct ?? 50), grade: totalSharpFeatures?.consensusTier || 'LEAN' }, stars: totalSr.stars, team: totalTeamLabel }, { sport: gd.sport, away: gd.away, home: gd.home, commenceTime, marketType: 'total' }, action);
      }
    });
  }, [isTotalLocked, isTotalShadow, totalSr?.stars]);

  // ─── Total Pick Health Evaluation ─────────────────────────────────────────
  const totalWasEverLocked = isTotalLocked || lastSyncedTotalStars.current != null || lockTotalStarsRef.current != null;
  const totalPickDateLive = commenceTime ? gameDate(commenceTime) : null;
  const totalWalletConsensus = totalWasEverLocked && totalSr
    ? computeWalletConsensus(totalSr.v8Scoring?.walletDetails, gd.sport, totalConsensusSide, totalPickDateLive)
    : null;
  const totalAgs = (() => {
    if (!totalWasEverLocked || !totalSr) return null;
    const pos = totalGameData?.positions;
    if (!Array.isArray(pos) || pos.length === 0) return null;
    return computeAgsFromPositions(pos, totalConsensusSide, gd.sport, getAgsCalibration(), isProvenForAgs, isHcEligibleForAgs, walletStatsForAgs);
  })();
  const totalAgsProvenTotal = totalAgs ? (totalAgs.provenForCount + totalAgs.provenAgCount) : null;
  const totalHealth = totalWasEverLocked && totalSr ? evaluatePickHealth({
    currentWPS: totalSr.walletPlayScore,
    lockWPS: lockTotalWPSRef.current,
    sideFlipped: false,
    newSideWPS: null,
    flipBeatThreshold: null,
    timeToGame: commenceTime ? (commenceTime - Date.now()) / 60000 : null,
    currentStars: totalSr.stars,
    walletConsensus: totalWalletConsensus,
    pickDate: totalPickDateLive,
    agsValue: totalAgs?.ags ?? null,
    agsProvenTotal: totalAgsProvenTotal,
    lockStage: isTotalLocked ? 'LOCKED' : null,
  }) : { status: 'ACTIVE', reasons: [], currentStars: totalSr?.stars || 0, wpsDelta: 0 };

  const lastTotalHealthRef = useRef(null);
  useEffect(() => {
    if (!totalWasEverLocked || !commenceTime || !totalConsensusSide) return;
    // v12 cleanup: see ML branch above for full rationale.
    // const date = gameDate(commenceTime);
    // const docId = `${date}_${gd.sport}_${gd.key}_total`;
    // if (onHealthSynced) onHealthSynced(docId, totalConsensusSide, totalHealth);
    // syncPickHealth({ docId, collection: 'sharpFlowTotals', side: totalConsensusSide, health: totalHealth });
  }, [totalWasEverLocked, totalHealth.status, totalSr?.walletPlayScore]);

  const isActionable = sr.isActionable;
  // Card-level accent driven by the same displayMeta as every other
  // visual cue. Eliminates the "green LOCKED IN border around a card
  // whose body says HARD MUTE" mismatch users were seeing.
  const accentColor = displayMeta.color;
  const accentBorder = displayMeta.border;

  return (
    <div className="sf-card sf-glass" style={{
      borderRadius: '16px', overflow: 'hidden', position: 'relative',
      background: 'linear-gradient(160deg, rgba(26,31,46,0.72) 0%, rgba(21,25,35,0.66) 45%, rgba(17,21,31,0.78) 100%)',
      border: isMyPick ? `1px solid ${B.goldBorder}` : `1px solid ${accentBorder}`,
      boxShadow: isMyPick
        ? `0 0 14px ${B.goldGlow}, 0 12px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`
        : `0 2px 16px ${accentColor}10, 0 12px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 0.5px rgba(255,255,255,0.03)`,
    }}>
      {/* Left-edge accent ribbon — state-colored ticket stub feel.
          3px wide, full card height, soft top/bottom fade. */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: '3px',
        background: `linear-gradient(180deg, transparent 0%, ${accentColor} 12%, ${accentColor} 88%, transparent 100%)`,
        opacity: 0.85,
      }} />
      {/* Top accent — subtle 2px hairline tinted by displayState. */}
      <div style={{
        height: '2px',
        background: `linear-gradient(90deg, transparent 0%, ${accentColor}aa 25%, ${accentColor} 50%, ${accentColor}aa 75%, transparent 100%)`,
      }} />

      {/* ─── Header row ──────────────────────────────────────────────
          Two columns: left = sport badge + matchup + time-caption
          stacked vertically so the time never wraps to its own row;
          right = unified tier strip vertically centered. */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.65rem 0.9rem 0.5rem', gap: '0.6rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem', minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
            <Badge color={ss.color} bg={ss.bg}>{ss.icon} {gd.sport}</Badge>
            <span style={{
              ...T.body, fontWeight: 700, color: B.text,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              minWidth: 0,
            }}>
              {/* Masthead: the sharp-consensus side reads bright, the
                  opposing side recedes — the card's verdict is legible
                  from the matchup line alone. Draw/no-consensus keeps
                  both sides equal. */}
              <span style={{
                color: consensusSide === 'home' ? B.textSec : B.text,
                fontWeight: consensusSide === 'home' ? 600 : 800,
              }}>{gd.away}</span>
              <span style={{ color: B.textMuted, fontWeight: 400 }}> vs </span>
              <span style={{
                color: consensusSide === 'away' ? B.textSec : B.text,
                fontWeight: consensusSide === 'away' ? 600 : 800,
              }}>{gd.home}</span>
            </span>
          </div>
          {gameTimeLabel && (
            <span style={{
              ...T.micro, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.05em',
              fontFeatureSettings: "'tnum'",
              alignSelf: 'flex-start',
              ...(isGameLive ? {
                padding: '0.12rem 0.4rem', borderRadius: '4px',
                color: '#fff', background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                animation: 'pulse 2s ease-in-out infinite',
              } : minsUntilStart <= 60 ? {
                color: '#F59E0B',
              } : {
                color: B.textMuted,
              }),
            }}>
              {isGameLive ? '● LIVE' : gameTimeFormatted ? `${gameTimeFormatted} ET` : gameTimeLabel}
            </span>
          )}
        </div>
        {/* ─── UNIFIED TIER STRIP ──────────────────────────────────────
            Single pill that carries state + tier + units. Replaces the
            old LOCKED IN pill + separate star chip combo. Color +
            content driven by `displayMeta` (one source of truth — can't
            disagree with the action box or banner below). */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.25rem 0.55rem 0.25rem 0.3rem',
            borderRadius: '6px',
            background: displayMeta.bg,
            border: `1px solid ${displayMeta.border}`,
            color: displayMeta.color,
            fontFeatureSettings: "'tnum'",
          }}>
            {/* State badge — PLAY / TRACKING / MUTED / EVALUATING */}
            <span style={{
              fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.08em',
              padding: '0.18rem 0.4rem', borderRadius: '3px',
              background: displayMeta.color, color: '#0a0a0a',
              lineHeight: 1,
            }}>
              {displayState === 'PLAY' && lockType === 'LIVE' ? 'LIVE' : displayMeta.pill}
            </span>
            {/* Stars — derived from `displayTier` (the v12 tier we show
                right next to them) instead of the legacy `renderedStars`
                fallback. Was producing "MONITORING ★★★★★ FADE" on
                PREVIEW cards because `renderedStars` fell back to the
                v11 `sr.stars` 5-star bucket when no cron stamp was set.
                ELITE=5 PREMIUM=4.5 LOCK=4 LEAN=3 WEAK=2.5 FADE=1. */}
            {(() => {
              const tierStars = starsFromAgsuTier(displayTier);
              return (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.1rem' }}>
                  {Array.from({ length: 5 }, (_, i) => {
                    const filled = i + 1 <= Math.floor(tierStars);
                    const half = !filled && i + 0.5 === tierStars;
                    return filled ? (
                      <span key={i} style={{ fontSize: '0.5rem', color: displayMeta.color, lineHeight: 1 }}>★</span>
                    ) : half ? (
                      <span key={i} style={{ position: 'relative', display: 'inline-block', fontSize: '0.5rem', lineHeight: 1, width: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.15)' }}>★</span>
                        <span style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', width: '50%', color: displayMeta.color }}>★</span>
                      </span>
                    ) : (
                      <span key={i} style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>★</span>
                    );
                  })}
                </span>
              );
            })()}
            {/* Tier label */}
            <span style={{
              fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.04em',
              lineHeight: 1,
            }}>
              {(displayTier && AGS_V12_STAKE_TIER_META[displayTier]?.short) || displayTier || '—'}
            </span>
            {/* Units — omitted on PREVIEW (no stamp yet) and on MUTED
                (always 0; redundant with the red FADE tier + MUTED pill). */}
            {displayUnits != null && displayUnits > 0 && (
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, opacity: 0.85,
                lineHeight: 1,
                paddingLeft: '0.35rem',
                borderLeft: `1px solid ${displayMeta.color}40`,
              }}>
                {displayUnits >= 1 ? displayUnits.toFixed(1) : displayUnits.toFixed(2)}u
              </span>
            )}
          </span>
        </div>
      </div>

      {/* ─── Action Box — visual hero, single state surface ──────────
          Layout pass redesigned for clarity:
            • Headline only renders on non-PLAY states (PLAY's pill in
              the tier strip is already the "RECOMMENDED BET" signal —
              showing both was the #1 source of clutter).
            • Narrative is the rich storytelling line; avg-bet caption is
              gone (its info lives in the tag pills below).
            • Bet display becomes the visual hero: bigger team name on
              the left, bigger odds on the right, single book+price
              caption underneath each side.
            • Risk row drops the redundant TIER pill (already in strip
              above). Just RISK / TO WIN with tabular alignment. */}
      <div style={{
        margin: '0.5rem 0.875rem 0', padding: '0.8rem 0.9rem',
        borderRadius: '12px',
        background: `radial-gradient(130% 160% at 88% 0%, ${displayMeta.color}14 0%, transparent 55%), linear-gradient(135deg, ${displayMeta.bg} 0%, ${displayMeta.bgSoft} 100%)`,
        border: `1px solid ${displayMeta.border}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}>
        {/* Headline ONLY for non-PLAY states. PLAY pick: skip — the
            tier strip already carries the call to action. */}
        {displayState !== 'PLAY' && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.45rem',
          }}>
            <span style={{
              ...T.label, fontWeight: 800, color: displayMeta.color,
              letterSpacing: '0.05em',
            }}>
              {displayMeta.headline}
            </span>
            {hasEV && (
              <span style={{
                ...T.micro, fontWeight: 800, color: B.green,
                padding: '0.18rem 0.45rem', borderRadius: '4px',
                background: B.greenDim,
                fontFeatureSettings: "'tnum'",
              }}>
                +{evEdge}% EV
              </span>
            )}
          </div>
        )}

        {/* Concise narrative — proven winners + HC + P&L in one tight
            line. Cancel/mute states invert to fading copy. */}
        {(() => {
          const fv = mlAgs?.featureValues ?? null;
          const v8 = sr?.v8Scoring;
          const forW = fv?.forCount ?? v8?.forW ?? 0;
          const agW  = fv?.agCount  ?? v8?.agW  ?? 0;
          const hcFor = fv?.forHcCount ?? 0;
          const dCount = fv?.dCount ?? (forW - agW);
          const sportUp = (gd.sport || '').toUpperCase();
          const hStat = mlHealth?.status || 'ACTIVE';
          const isMutedLive = hStat === 'MUTED';
          const isCancelledLive = hStat === 'CANCELLED';

          let lead;
          if (isCancelledLive) {
            lead = (
              <>
                <span style={{ color: B.red, fontWeight: 700 }}>Signal killed</span> · {Math.abs(dCount)} proven {sportUp} winner{Math.abs(dCount) !== 1 ? 's' : ''} now against
              </>
            );
          } else if (isMutedLive) {
            lead = (
              <>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>Signal fading</span> · {agW > 0 ? <>{agW} {sportUp} winner{agW !== 1 ? 's' : ''} now against, {forW} still backing</> : <>sharp money collapsed off this side</>}
              </>
            );
          } else if (forW > 0) {
            const segs = [];
            segs.push(<span key="w" style={{ color: displayMeta.color, fontWeight: 700 }}>{forW} proven {sportUp} winner{forW !== 1 ? 's' : ''}</span>);
            if (hcFor > 0) segs.push(<span key="hc"> · <span style={{ color: B.green, fontWeight: 700 }}>{hcFor} HC sharp{hcFor !== 1 ? 's' : ''}</span></span>);
            if (consensusLifetimePnl) segs.push(<span key="pnl"> · <span style={{ color: B.green, fontWeight: 700 }}>+{fmtVol(consensusLifetimePnl)}</span> P&L</span>);
            if (pinnConfirms) segs.push(<span key="pc"> · <span style={{ color: B.green, fontWeight: 700 }}>Pinn confirms</span></span>);
            lead = <>{segs}</>;
          } else {
            const segs = [];
            segs.push(<span key="b">{consensusWalletCount} sharp{consensusWalletCount !== 1 ? 's' : ''} backing</span>);
            if (consensusInvestedAmt) segs.push(<span key="inv"> · <span style={{ color: displayMeta.color, fontWeight: 700 }}>{fmtVol(consensusInvestedAmt)}</span> invested</span>);
            if (consensusLifetimePnl) segs.push(<span key="pnl"> · <span style={{ color: B.green, fontWeight: 700 }}>+{fmtVol(consensusLifetimePnl)}</span> P&L</span>);
            lead = <>{segs}</>;
          }

          return (
            <div style={{
              ...T.micro, fontSize: '0.66rem', color: B.textSec,
              lineHeight: 1.4, marginBottom: '0.55rem',
            }}>
              {lead}
            </div>
          );
        })()}

        {/* HERO BET DISPLAY — the visual centerpiece of the card.
            Two columns: team (left, big) / price + book (right, big).
            Single quiet "BET AT" / "TRACK AT" / "BEST PRICE" caption. */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: (bestRetail || consensusOdds) ? '1fr auto' : '1fr',
          gap: '0.75rem', alignItems: 'center',
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '1.6rem', fontWeight: 900, color: B.text,
              lineHeight: 1.08, letterSpacing: '-0.02em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              textShadow: `0 0 24px ${displayMeta.color}25`,
            }}>
              {consensusShort} ML
            </div>
            {pinnProb && (
              <div style={{
                ...T.micro, fontSize: '0.62rem', color: B.textMuted,
                marginTop: '0.25rem', letterSpacing: '0.03em',
                fontFeatureSettings: "'tnum'",
              }}>
                fair {fmtOdds(consensusOdds)} · {(pinnProb * 100).toFixed(0)}% implied
              </div>
            )}
          </div>
          {(bestRetail || consensusOdds) && (
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '1.75rem', fontWeight: 900,
                color: hasEV ? B.green : B.text,
                lineHeight: 1, letterSpacing: '-0.02em',
                fontFeatureSettings: "'tnum'",
                textShadow: hasEV ? '0 0 20px rgba(16,185,129,0.25)' : 'none',
              }}>
                {fmtOdds(bestRetail || consensusOdds)}
              </div>
              <div style={{
                ...T.micro, fontSize: '0.6rem',
                color: B.textMuted, marginTop: '0.3rem',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                {bestBook || 'Pinnacle'} · {displayState === 'PLAY' ? 'bet at' : displayState === 'TRACKING' ? 'track at' : 'best price'}
              </div>
            </div>
          )}
        </div>

        {/* RISK / TO WIN — PLAY/TRACKING only. No tier pill on the
            right (already shown in the header tier strip above). */}
        {(displayState === 'PLAY' || displayState === 'TRACKING') && displayUnits != null && displayUnits > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            marginTop: '0.6rem', padding: '0.45rem 0.65rem',
            borderRadius: '7px',
            background: displayMeta.bgSoft,
            border: `1px solid ${displayMeta.border}`,
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{
                ...T.micro, fontSize: '0.55rem', color: B.textMuted,
                letterSpacing: '0.08em',
              }}>RISK</span>
              <span style={{
                fontSize: '0.95rem', fontWeight: 900, color: B.text,
                fontFeatureSettings: "'tnum'", lineHeight: 1,
              }}>
                {displayUnits >= 1 ? displayUnits.toFixed(1) : displayUnits.toFixed(2)}u
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', justifyContent: 'flex-end' }}>
              <span style={{
                ...T.micro, fontSize: '0.55rem', color: B.textMuted,
                letterSpacing: '0.08em',
              }}>TO WIN</span>
              <span style={{
                fontSize: '0.95rem', fontWeight: 900, color: B.green,
                fontFeatureSettings: "'tnum'", lineHeight: 1,
              }}>
                +{profitFromOdds(betOdds, displayUnits).toFixed(2)}u
              </span>
            </div>
          </div>
        )}

        {/* Bottom: confidence factors */}
        <div style={{
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
          marginTop: '0.5rem', paddingTop: '0.45rem',
          borderTop: `1px solid ${displayMeta.border}`,
        }}>
          {/* v6 pill strip — kept pills are the ones users actually act on.
              DOMINANT/STRONG consensus grade and RLM flag demoted to the
              diagnostics caption below since they no longer gate anything. */}
          {(() => {
            const v8 = sr?.v8Scoring;
            const forW = v8?.forW ?? 0;
            const sportUp = (gd.sport || '').toUpperCase();
            const primaryLabel = forW > 0
              ? `${forW} ${sportUp} WINNER${forW !== 1 ? 'S' : ''}`
              : `${consensusWalletCount} sharp bettor${consensusWalletCount !== 1 ? 's' : ''}`;
            const primaryBg  = forW > 0 ? B.greenDim : B.goldDim;
            const primaryCol = forW > 0 ? B.green   : B.gold;
            return (
              <>
                <span style={{
                  ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
                  background: primaryBg, color: primaryCol, fontWeight: 700,
                }}>
                  {primaryLabel}
                </span>
                <span style={{
                  ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
                  background: 'rgba(255,255,255,0.04)', color: B.textSec,
                }}>
                  {fmtVol(consensusInvestedAmt)} invested
                </span>
                {pinnConfirms && (
                  <span style={{
                    ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
                    background: B.greenDim, color: B.green, fontWeight: 600,
                  }}>
                    ✓ Pinnacle confirms
                  </span>
                )}
                {pinnMoved && !pinnConfirms && (
                  <span style={{
                    ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
                    background: B.redDim, color: B.red, fontWeight: 600,
                  }}>
                    ✗ Pinnacle opposes
                  </span>
                )}
                {hasEV && (
                  <span style={{
                    ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
                    background: B.greenDim, color: B.green, fontWeight: 700,
                  }}>
                    +{evEdge}% edge
                  </span>
                )}
                {sharpFeatures.concentration > 0.8 && (
                  <span style={{
                    ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
                    background: 'rgba(239,68,68,0.08)', color: '#F87171', fontWeight: 600,
                  }}>
                    {(sharpFeatures.concentration * 100).toFixed(0)}% 1-wallet
                  </span>
                )}
                {sharpFeatures.counterSharpScore >= 3 && (
                  <span style={{
                    ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
                    background: 'rgba(239,68,68,0.08)', color: '#F87171', fontWeight: 600,
                  }}>
                    Counter-sharp
                  </span>
                )}
              </>
            );
          })()}
        </div>
        {/* Diagnostics caption — consensus grade + RLM live here now, dimmed
            to communicate "context, not a gate". The v6 gate is the 2/2
            criteria block above. */}
        {(cGrade?.label || rlmActive) && (
          <div style={{
            ...T.micro, fontSize: '0.56rem', color: B.textMuted,
            marginTop: '0.4rem', letterSpacing: '0.04em', textTransform: 'lowercase',
          }}>
            <span style={{ opacity: 0.7 }}>diagnostics · </span>
            {cGrade?.label && <span>sharp money {Math.round(cGrade.score)}% ({cGrade.label.toLowerCase()})</span>}
            {cGrade?.label && rlmActive && <span> · </span>}
            {rlmActive && <span>line move +{flowTicketDiv.toFixed(0)}pt (reverse)</span>}
          </div>
        )}
      </div>

      {/* ─── AGS-U Consensus Panel (compressed) ─────────────────────────
          The verbose tier banner ("PLAY LOCKED — PREMIUM" / "HARD MUTE")
          is GONE — the header tier strip carries state + tier + units in
          a single accent. What stays:
            • 3 driver rows (proven winners, HC sharps, money %)
            • 5-segment quintile bar on the right showing rolling rank
          Tightened to ~18px per row, ~6px quintile bar height, and the
          surface uses `displayMeta` so it shares an accent with the rest
          of the card instead of computing its own.
            Source: mlAgs.featureValues (single render-side computation). */}
      {(() => {
        const sportLabel = (gd.sport || '').toString().toUpperCase();
        const healthStatus = mlHealth?.status || 'ACTIVE';
        const isCancelledLive = healthStatus === 'CANCELLED';

        // v12-first: the quintile bar + signal gate read the SAME v12
        // score/quintile that drives the header tier strip and sizing
        // (earlyV12Res). Legacy v9 (mlAgs) is only a fallback for renders
        // where the browser can't compute v12 (no wallet profiles /
        // calibration yet). Driver rows below stay on mlAgs.featureValues
        // — those are raw position features (proven counts, HC counts,
        // money share), model-version-agnostic by construction.
        const agsValue = Number.isFinite(earlyV12Res?.score)
          ? earlyV12Res.score
          : (Number.isFinite(mlAgs?.ags) ? mlAgs.ags : null);
        const agsQuintile = earlyV12Res?.quintile ?? mlAgs?.quintile ?? null;
        const fv = mlAgs?.featureValues ?? null;
        const dCount = fv?.dCount ?? 0;
        const dHcCount = fv?.dHcCount ?? 0;
        const forContribShare = Number.isFinite(fv?.forContribShare) ? fv.forContribShare : null;
        const forCount = fv?.forCount ?? 0;
        const agCount = fv?.agCount ?? 0;
        const forHcCount = fv?.forHcCount ?? 0;
        const totalProven = forCount + agCount;

        // Driver rows — three plain-English checks tied 1:1 to the AGS-U
        // feature set. Not gates; explanations of what made the score.
        const drv1Met = dCount >= 1;
        const drv2Met = dHcCount >= 1;
        const drv3Met = forContribShare != null && forContribShare >= 0.65;

        const Driver = ({ met, label, detail }) => (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.12rem 0',
            minHeight: '18px',
          }}>
            {met
              ? <CheckCircle size={11} color={displayMeta.color} strokeWidth={2.5} />
              : <Circle size={11} color={B.textMuted} strokeWidth={1.5} />
            }
            <span style={{
              ...T.micro, fontSize: '0.62rem',
              color: met ? B.text : B.textSec,
              fontWeight: met ? 700 : 500,
              lineHeight: 1.1,
            }}>
              {label}
            </span>
            <span style={{
              ...T.micro, fontSize: '0.6rem', fontFeatureSettings: "'tnum'",
              color: met ? displayMeta.color : B.textMuted,
              fontWeight: 700, marginLeft: 'auto',
              lineHeight: 1.1,
            }}>
              {detail}
            </span>
          </div>
        );

        // Quintile indicator — 5 segments, filled by quintile, accent
        // sourced from displayMeta so it color-matches the header strip
        // and action box. Slim 6px height to stay unobtrusive.
        const QuintileBar = () => {
          if (agsQuintile == null) return null;
          return (
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  width: '7px', height: '6px', borderRadius: '1px',
                  background: i <= agsQuintile ? displayMeta.color : 'rgba(255,255,255,0.08)',
                  opacity: i <= agsQuintile ? 1 : 0.45,
                }} />
              ))}
            </div>
          );
        };

        // Mini caption: kept ultra-short, replaces the prior banner. It
        // exists only to disambiguate the live health status (e.g. line
        // cancellation) — the tier + state are already in the header.
        let captionLabel = null;
        let captionColor = B.textMuted;
        if (isCancelledLive) {
          captionLabel = 'PICK CANCELLED — winners against';
          captionColor = B.red;
        } else if (agsValue == null) {
          captionLabel = 'GATHERING SHARP SIGNAL';
          captionColor = B.textMuted;
        }

        return (
          <div style={{
            margin: '0.5rem 0.875rem 0', padding: '0.5rem 0.65rem',
            borderRadius: '10px',
            background: displayMeta.bgSoft,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '0.25rem', gap: '0.5rem',
              minHeight: '12px',
            }}>
              {captionLabel
                ? <span style={{ ...T.micro, fontSize: '0.55rem', color: captionColor, fontWeight: 800, letterSpacing: '0.05em' }}>{captionLabel}</span>
                : <span style={{ ...T.micro, fontSize: '0.55rem', color: B.textMuted, fontWeight: 700, letterSpacing: '0.05em' }}>SHARP CONSENSUS</span>}
              {agsValue != null && <QuintileBar />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Driver
                  met={drv1Met}
                  label={`Proven ${sportLabel || 'sport'} winners backing`}
                  detail={`${forCount}–${agCount}`}
                />
                <Driver
                  met={drv2Met}
                  label="High-conviction sharps confirming"
                  detail={forHcCount > 0 ? `${forHcCount} HC` : (totalProven > 0 ? '0 HC' : '—')}
                />
                <Driver
                  met={drv3Met}
                  label="Money concentrated on this side"
                  detail={forContribShare != null ? `${Math.round(forContribShare * 100)}%` : '—'}
                />
              </div>
              {forContribShare != null && (
                <ConvictionGauge pct={forContribShare * 100} accent={accentColor} />
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Market Tab Strip ── */}
      {(() => {
        const hasSpread = !!(pinnGame?.spreadCurrent || flowGame?.polySpread || (flowGame?.kalshiSpreads?.length > 0));
        const hasTotal = !!(pinnGame?.totalCurrent || flowGame?.polyTotal || (flowGame?.kalshiTotals?.length > 0));
        if (!hasSpread && !hasTotal) return null;
        return <MarketTabStrip active={marketTab} onChange={setMarketTab} hasSpread={hasSpread} hasTotal={hasTotal} spreadLocked={!!(isSpreadLocked || isSpreadShadow)} totalLocked={!!(isTotalLocked || isTotalShadow)} />;
      })()}

      {marketTab === 'spread' && (
        <div style={{ padding: '0.5rem 0.875rem' }}>
          {/* ─── Spread Lock-In Criteria ─── */}
          {spreadSharpFeatures && (() => {
            const sCriteria = [
              { id: 's3', met: (spreadSharpFeatures.conWalletCount || 0) >= 2, label: '2+ Sharp Bettors' },
              { id: 'sinv', met: (spreadSharpFeatures.conTotalInvested || 0) >= 10000, label: '$10K+ on Side' },
              { id: 'sev', met: spreadEvEdge > 0, label: '+EV Edge' },
              { id: 'spinn', met: spreadPinnConfirms, label: 'Pinnacle Confirms' },
              { id: 'sline', met: spreadPinnMovedWith, label: 'Line Moving With' },
            ];
            const sMetCount = sCriteria.filter(c => c.met).length;
            return (
              <div style={{
                padding: '0.5rem 0.625rem', borderRadius: '8px', marginBottom: '0.5rem',
                background: isSpreadLocked && spreadLockTier === 'LEAN'
                  ? 'linear-gradient(135deg, rgba(250,204,21,0.06) 0%, rgba(250,204,21,0.02) 100%)'
                  : isSpreadLocked
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)'
                  : isSpreadShadow
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSpreadLocked && spreadLockTier === 'LEAN' ? 'rgba(250,204,21,0.40)' : isSpreadLocked ? 'rgba(16,185,129,0.25)' : isSpreadShadow ? 'rgba(212,175,55,0.25)' : B.borderSubtle}`,
              }}>
                {(isSpreadLocked || isSpreadShadow) && spreadSr ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '1rem' }}>{'★'.repeat(Math.floor(spreadRenderedStars))}{spreadRenderedStars % 1 ? '½' : ''}</span>
                    <span style={{ ...T.micro, fontWeight: 700, color:
                      isSpreadLocked && (spreadLockTier === 'ELITE' || spreadLockTier === 'PREMIUM') ? B.gold
                      : isSpreadLocked && spreadLockTier === 'LOCK' ? B.green
                      : isSpreadLocked && spreadLockTier === 'LEAN' ? '#60A5FA'
                      : isSpreadLocked && spreadLockTier === 'WEAK' ? '#F59E0B'
                      : isSpreadLocked ? B.green : B.gold }}>
                      {isSpreadLocked && spreadLockTier && spreadLockTier !== 'MUTED' && spreadLockTier !== 'FADE' && spreadLockTier !== 'UNKNOWN'
                        ? `SPREAD ${spreadLockTier}`
                        : isSpreadLocked ? 'SPREAD LOCK' : 'SPREAD TRACKING'} — {spreadConsensuTeam} {spreadLine > 0 ? '+' : ''}{spreadLine}
                    </span>
                    <span style={{ ...T.micro, color: B.textSec, marginLeft: 'auto' }}>
                      {spreadUnits}u @ {fmtOdds(spreadBetOdds)}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>SPREAD CRITERIA ({sMetCount}/5)</span>
                    <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: sMetCount >= 4 ? B.green : sMetCount >= 3 ? B.gold : B.textMuted }}>{sMetCount}/5</span>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '0.25rem' }}>
                  {sCriteria.map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.15rem 0' }}>
                      {c.met
                        ? <CheckCircle size={11} color={B.green} strokeWidth={2.5} />
                        : <Circle size={11} color={B.textMuted} strokeWidth={1.5} />
                      }
                      <span style={{ ...T.micro, fontSize: '0.5625rem', color: c.met ? B.green : B.textMuted, fontWeight: c.met ? 700 : 400 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Position Battle — Spread */}
          {spreadGameData && spreadGameData.positions?.length > 0 && (() => {
            const sPos = spreadGameData.positions;
            const sSummary = spreadGameData.summary;
            const awayPos = sPos.filter(p => p.side === 'away');
            const homePos = sPos.filter(p => p.side === 'home');
            const awayW = new Set(awayPos.map(p => p.wallet)).size;
            const homeW = new Set(homePos.map(p => p.wallet)).size;
            const awayInv = sSummary.awayInvested || 0;
            const homeInv = sSummary.homeInvested || 0;
            const totalInv = awayInv + homeInv;
            const awayPnl = awayPos.reduce((s, p) => s + (p.totalPnl || 0), 0);
            const homePnl = homePos.reduce((s, p) => s + (p.totalPnl || 0), 0);
            const awayAvg = awayPos.length > 0 ? awayInv / awayPos.length : 0;
            const homeAvg = homePos.length > 0 ? homeInv / homePos.length : 0;
            const consSide = sSummary.consensus;
            const consIsAway = consSide === 'away';
            const moneyRatio = totalInv > 0 ? Math.round((Math.max(awayInv, homeInv) / totalInv) * 100) : 50;
            const consTeamShort = (consIsAway ? gd.away : gd.home).split(' ').pop();
            const sc = pinnGame?.spreadCurrent;

            const panelStyle = (isActive) => ({
              flex: 1, padding: '0.625rem', borderRadius: '8px',
              background: isActive ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.015)',
              border: `1px solid ${isActive ? 'rgba(139,92,246,0.3)' : B.borderSubtle}`,
              position: 'relative', overflow: 'hidden',
            });

            return (
              <div style={{ marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>Spread Money — Both Sides</span>
                  <span style={{ ...T.micro, fontWeight: 800, color: '#8B5CF6', padding: '0.1rem 0.3rem', borderRadius: '3px', background: 'rgba(139,92,246,0.12)' }}>
                    {moneyRatio}% {consTeamShort}
                  </span>
                  {sc && <span style={{ ...T.micro, color: B.textMuted }}>({sc.awayLine > 0 ? '+' : ''}{sc.awayLine})</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={panelStyle(consIsAway)}>
                    {consIsAway && <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: '#8B5CF6', borderRadius: '8px 0 0 8px' }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                      {consIsAway && <span style={{ ...T.micro, fontSize: '0.5rem', fontWeight: 900, padding: '0.1rem 0.3rem', borderRadius: '3px', color: '#fff', background: '#8B5CF6' }}>SHARP SIDE</span>}
                      <span style={{ ...T.sub, fontWeight: 900, color: consIsAway ? B.text : B.textMuted }}>{awayShort}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <div>
                        <div style={{ ...T.heading, fontWeight: 900, color: consIsAway ? '#8B5CF6' : B.textSec, fontFeatureSettings: "'tnum'" }}>{fmtVol(awayInv)}</div>
                        <div style={{ ...T.micro, color: B.textMuted }}>{awayW} sharp{awayW !== 1 ? 's' : ''} · avg {fmtVol(awayAvg)}</div>
                      </div>
                      <div style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", padding: '0.15rem 0.4rem', borderRadius: '4px', color: awayPnl >= 0 ? B.green : B.red, background: awayPnl >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                        {awayPnl >= 0 ? '+' : ''}{fmtVol(awayPnl)} sports P&L
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 0.125rem', flexShrink: 0 }}>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>VS</span>
                  </div>
                  <div style={panelStyle(!consIsAway)}>
                    {!consIsAway && <div style={{ position: 'absolute', top: 0, right: 0, width: '3px', height: '100%', background: '#8B5CF6', borderRadius: '0 8px 8px 0' }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                      <span style={{ ...T.sub, fontWeight: 900, color: !consIsAway ? B.text : B.textMuted }}>{homeShort}</span>
                      {!consIsAway && <span style={{ ...T.micro, fontSize: '0.5rem', fontWeight: 900, padding: '0.1rem 0.3rem', borderRadius: '3px', color: '#fff', background: '#8B5CF6' }}>SHARP SIDE</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ ...T.heading, fontWeight: 900, color: !consIsAway ? '#8B5CF6' : B.textSec, fontFeatureSettings: "'tnum'", textAlign: 'right' }}>{fmtVol(homeInv)}</div>
                        <div style={{ ...T.micro, color: B.textMuted, textAlign: 'right' }}>{homeW} sharp{homeW !== 1 ? 's' : ''} · avg {fmtVol(homeAvg)}</div>
                      </div>
                      <div style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", padding: '0.15rem 0.4rem', borderRadius: '4px', color: homePnl >= 0 ? B.green : B.red, background: homePnl >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                        {homePnl >= 0 ? '+' : ''}{fmtVol(homePnl)} sports P&L
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ─── Spread Market Flow Bar ─── */}
          {spreadGameData && spreadGameData.positions?.length > 0 && (() => {
            const sSummary = spreadGameData.summary;
            const awayInv = sSummary.awayInvested || 0;
            const homeInv = sSummary.homeInvested || 0;
            const totalInv = awayInv + homeInv;
            const awayPctS = totalInv > 0 ? (awayInv / totalInv) * 100 : 50;
            const homePctS = totalInv > 0 ? (homeInv / totalInv) * 100 : 50;
            const consSide = sSummary.consensus;
            const consIsAway = consSide === 'away';
            const accentC = '#8B5CF6';
            const bars = [{ label: 'Sharp Money', awayVal: awayPctS, homeVal: homePctS }];
            return (
              <div style={{
                marginBottom: '0.625rem', borderRadius: '8px', overflow: 'hidden',
                border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}`,
                }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>Market Flow</span>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>{awayShort}</span>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>{homeShort}</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {bars.map(bar => {
                    const awayWins = bar.awayVal > bar.homeVal;
                    const homeWins = bar.homeVal > bar.awayVal;
                    const awayColor = consIsAway && awayWins ? accentC : awayWins ? B.textSec : B.textMuted;
                    const homeColor = !consIsAway && homeWins ? accentC : homeWins ? B.textSec : B.textMuted;
                    const barAwayBg = awayWins
                      ? (consIsAway ? `linear-gradient(90deg, ${accentC}44, ${accentC})` : `linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.18))`)
                      : 'rgba(255,255,255,0.05)';
                    const barHomeBg = homeWins
                      ? (!consIsAway ? `linear-gradient(90deg, ${accentC}, ${accentC}44)` : `linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))`)
                      : 'rgba(255,255,255,0.05)';
                    return (
                      <div key={bar.label}>
                        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 36px', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ ...T.micro, fontSize: '0.625rem', fontWeight: 800, fontFeatureSettings: "'tnum'", color: awayColor, textAlign: 'left' }}>
                            {bar.awayVal.toFixed(0)}%
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                            <div style={{ display: 'flex', height: '5px', borderRadius: '2.5px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                              <div style={{ width: `${bar.awayVal}%`, background: barAwayBg, borderRadius: '2.5px 0 0 2.5px', transition: 'width 0.5s cubic-bezier(.4,0,.2,1)' }} />
                              <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                              <div style={{ width: `${bar.homeVal}%`, background: barHomeBg, borderRadius: '0 2.5px 2.5px 0', transition: 'width 0.5s cubic-bezier(.4,0,.2,1)' }} />
                            </div>
                            <span style={{ ...T.micro, fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', letterSpacing: '0.03em' }}>{bar.label}</span>
                          </div>
                          <span style={{ ...T.micro, fontSize: '0.625rem', fontWeight: 800, fontFeatureSettings: "'tnum'", color: homeColor, textAlign: 'right' }}>
                            {bar.homeVal.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <SpreadPanel pinnGame={pinnGame} game={flowGame || { away: gd.away, home: gd.home }} isMobile={isMobile} />

          {/* ─── Pinnacle Spread Line Confirmation ─── */}
          {pinnGame?.spreadOpener && pinnGame?.spreadCurrent && (() => {
            const so = pinnGame.spreadOpener;
            const sc = pinnGame.spreadCurrent;
            return (
              <div style={{
                display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center',
                padding: '0.375rem 0.625rem', marginTop: '0.25rem',
                borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${B.borderSubtle}`,
              }}>
                <span style={{ ...T.micro, color: B.gold, fontWeight: 600 }}>Pinnacle</span>
                <span style={{ ...T.micro, color: B.textSec }}>
                  Open: {so.awayLine > 0 ? '+' : ''}{so.awayLine} / {so.homeLine > 0 ? '+' : ''}{so.homeLine}
                </span>
                <span style={{ ...T.micro, color: B.text, fontWeight: 600 }}>
                  Now: {sc.awayLine > 0 ? '+' : ''}{sc.awayLine} / {sc.homeLine > 0 ? '+' : ''}{sc.homeLine}
                </span>
                {spreadPinnMovedWith && <span style={{ ...T.micro, color: B.green, fontWeight: 700 }}>✓ Confirms</span>}
                {spreadPinnMovedAgainst && <span style={{ ...T.micro, color: B.red, fontWeight: 700 }}>✗ Opposes</span>}
              </div>
            );
          })()}

          {/* ─── Spread Price Movement — Polymarket ─── */}
          {flowGame?.polySpread?.priceHistory && flowGame.polySpread.priceHistory.points?.length >= 2 && (() => {
            const pH = flowGame.polySpread.priceHistory;
            const polySpreadPts = pH.points;
            const consIsAway = spreadGameData?.summary?.consensus === 'away';
            const polyMoving = pH.change > 0 === consIsAway;
            const polyAgainst = pH.change > 0 !== consIsAway && pH.change !== 0;
            return (
              <div style={{
                borderRadius: '8px', overflow: 'hidden', marginTop: '0.5rem',
                border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>Prediction Market — Spread</span>
                </div>
                <div style={{ padding: '0.5rem 0.625rem' }}>
                  <MiniSparkline
                    points={polySpreadPts}
                    color={polyMoving ? B.green : polyAgainst ? B.red : B.sky}
                    label={`${flowGame.polySpread.title || 'Spread'}`}
                    startLabel={`${pH.open}¢`}
                    endLabel={`${pH.current}¢`}
                    width={isMobile ? 120 : 140}
                    height={32}
                  />
                  <span style={{
                    ...T.micro, fontSize: '0.5rem', fontWeight: 700, marginTop: '0.15rem', display: 'block',
                    color: polyMoving ? B.green : polyAgainst ? B.red : B.textMuted,
                  }}>
                    {polyMoving ? '↑ Moving with play' : polyAgainst ? '↓ Moving against play' : '— Stable'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Spread Wallet Trades */}
          {spreadGameData && spreadGameData.positions?.length > 0 && (() => {
            const sPos = spreadGameData.positions;
            const uniqueSpreadWallets = new Set(sPos.map(p => p.wallet)).size;
            const sSummary = spreadGameData.summary;
            const consSide = sSummary.consensus;
            // Phase 2: {SPORT} WINNER counts for this spread market
            const sprWinFor = new Set();
            const sprWinAg = new Set();
            sPos.forEach(p => {
              if (!isSportWinner(p.wallet, gd.sport)) return;
              if (p.side === consSide) sprWinFor.add(p.wallet);
              else if (p.side) sprWinAg.add(p.wallet);
            });
            const sprWinForCt = sprWinFor.size, sprWinAgCt = sprWinAg.size;
            const consShort = (consSide === 'away' ? gd.away : gd.home).split(' ').pop();
            const oppShort2 = (consSide === 'away' ? gd.home : gd.away).split(' ').pop();
            const totalPnl = sPos.reduce((s, p) => s + (p.totalPnl || 0), 0);
            const now = Date.now();
            const sideOpts = [
              { key: 'all', label: 'All Bets' },
              { key: 'consensus', label: consShort },
              { key: 'opposing', label: oppShort2 },
            ];
            const filtered = sPos.filter(p => {
              if (spreadWalletFilter === 'consensus' && p.side !== consSide) return false;
              if (spreadWalletFilter === 'opposing' && p.side === consSide) return false;
              return true;
            }).sort((a, b) => (b.sportVerified ? 1 : 0) - (a.sportVerified ? 1 : 0));

            return <>
              <button onClick={() => setShowSpreadWallets(!showSpreadWallets)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', cursor: 'pointer', padding: '0.5rem 0.625rem', borderRadius: '8px',
                background: 'rgba(139,92,246,0.04)', border: `1px solid ${B.borderSubtle}`, marginTop: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  {showSpreadWallets ? <ChevronUp size={12} color="#8B5CF6" /> : <ChevronDown size={12} color="#8B5CF6" />}
                  <span style={{ ...T.micro, color: '#8B5CF6', fontWeight: 700 }}>
                    {uniqueSpreadWallets} SPREAD SHARP{uniqueSpreadWallets !== 1 ? 'S' : ''}
                    {sprWinForCt > 0 && <span style={{ color: B.gold, fontWeight: 900 }}> · {sprWinForCt} {gd.sport} WINNER{sprWinForCt !== 1 ? 'S' : ''}</span>}
                    {sprWinAgCt > sprWinForCt && <span style={{ color: B.red, fontWeight: 900 }}> · {sprWinAgCt} {gd.sport} FADING</span>}
                  </span>
                </div>
                <span style={{ ...T.micro, color: B.textSec }}>
                  Combined P&L: <span style={{ fontWeight: 700, color: totalPnl >= 0 ? B.green : B.red }}>{totalPnl >= 0 ? '+' : ''}{fmtVol(totalPnl)}</span>
                </span>
              </button>
              {showSpreadWallets && (
                <div style={{ marginTop: '0.375rem', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${B.borderSubtle}` }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center', padding: '0.5rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ ...T.micro, color: B.textMuted, marginRight: '0.25rem' }}>Side:</span>
                    {sideOpts.map(o => (
                      <button key={o.key} onClick={() => setSpreadWalletFilter(o.key)} style={{ ...T.micro, fontWeight: spreadWalletFilter === o.key ? 700 : 400, padding: '0.15rem 0.45rem', borderRadius: '4px', cursor: 'pointer', border: 'none', color: spreadWalletFilter === o.key ? '#8B5CF6' : B.textMuted, background: spreadWalletFilter === o.key ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)' }}>{o.label}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.6rem' }}>
                    {filtered.map((p, i) => (
                      <WalletDossierRow key={`${p.wallet}-${i}`} p={p} gd={gd} now={now} isMobile={isMobile} market="spread" accent="#8B5CF6" />
                    ))}
                  </div>
                </div>
              )}
            </>;
          })()}
        </div>
      )}
      {marketTab === 'total' && (
        <div style={{ padding: '0.5rem 0.875rem' }}>
          {/* ─── Total Lock-In Criteria ─── */}
          {totalSharpFeatures && (() => {
            const tCriteria = [
              { id: 't3', met: (totalSharpFeatures.conWalletCount || 0) >= 2, label: '2+ Sharp Bettors' },
              { id: 'tinv', met: (totalSharpFeatures.conTotalInvested || 0) >= 10000, label: '$10K+ on Side' },
              { id: 'tev', met: totalEvEdge > 0, label: '+EV Edge' },
              { id: 'tpinn', met: totalPinnConfirms, label: 'Pinnacle Confirms' },
              { id: 'tline', met: totalPinnMovedWith, label: 'Line Moving With' },
            ];
            const tMetCount = tCriteria.filter(c => c.met).length;
            return (
              <div style={{
                padding: '0.5rem 0.625rem', borderRadius: '8px', marginBottom: '0.5rem',
                background: isTotalLocked && totalLockTier === 'LEAN'
                  ? 'linear-gradient(135deg, rgba(250,204,21,0.06) 0%, rgba(250,204,21,0.02) 100%)'
                  : isTotalLocked
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)'
                  : isTotalShadow
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isTotalLocked && totalLockTier === 'LEAN' ? 'rgba(250,204,21,0.40)' : isTotalLocked ? 'rgba(16,185,129,0.25)' : isTotalShadow ? 'rgba(212,175,55,0.25)' : B.borderSubtle}`,
              }}>
                {(isTotalLocked || isTotalShadow) && totalSr ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '1rem' }}>{'★'.repeat(Math.floor(totalRenderedStars))}{totalRenderedStars % 1 ? '½' : ''}</span>
                    <span style={{ ...T.micro, fontWeight: 700, color:
                      isTotalLocked && (totalLockTier === 'ELITE' || totalLockTier === 'PREMIUM') ? B.gold
                      : isTotalLocked && totalLockTier === 'LOCK' ? B.green
                      : isTotalLocked && totalLockTier === 'LEAN' ? '#60A5FA'
                      : isTotalLocked && totalLockTier === 'WEAK' ? '#F59E0B'
                      : isTotalLocked ? B.green : B.gold }}>
                      {isTotalLocked && totalLockTier && totalLockTier !== 'MUTED' && totalLockTier !== 'FADE' && totalLockTier !== 'UNKNOWN'
                        ? `TOTAL ${totalLockTier}`
                        : isTotalLocked ? 'TOTAL LOCK' : 'TOTAL TRACKING'} — {totalConsensusSide === 'over' ? 'Over' : 'Under'} {totalLine}
                    </span>
                    <span style={{ ...T.micro, color: B.textSec, marginLeft: 'auto' }}>
                      {totalUnits}u @ {fmtOdds(totalBetOdds)}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>TOTAL CRITERIA ({tMetCount}/5)</span>
                    <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: tMetCount >= 4 ? B.green : tMetCount >= 3 ? B.gold : B.textMuted }}>{tMetCount}/5</span>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '0.25rem' }}>
                  {tCriteria.map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.15rem 0' }}>
                      {c.met
                        ? <CheckCircle size={11} color={B.green} strokeWidth={2.5} />
                        : <Circle size={11} color={B.textMuted} strokeWidth={1.5} />
                      }
                      <span style={{ ...T.micro, fontSize: '0.5625rem', color: c.met ? B.green : B.textMuted, fontWeight: c.met ? 700 : 400 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Position Battle — Totals */}
          {totalGameData && totalGameData.positions?.length > 0 && (() => {
            const tPos = totalGameData.positions;
            const tSummary = totalGameData.summary;
            const overPos = tPos.filter(p => p.side === 'over');
            const underPos = tPos.filter(p => p.side === 'under');
            // NET-after-dedup totals (matches the cron / sizing math
            // exactly so the locked card and live card never disagree).
            // The legacy raw-sum (tSummary.overInvested / underInvested)
            // double-counts wallets that hedged both sides — produced
            // today's $69.8K live vs $56.1K locked mismatch on the
            // Cavs/Pistons total. computeSharpFeatures nets each wallet
            // to its dominant side so a $10K-Over / $20K-Under wallet
            // contributes $10K to Under (its true conviction), matching
            // exactly what the cron stamps as peak.totalInvested.
            const overSf = computeSharpFeatures(tPos, 'over');
            const overW = overSf.conWalletCount;
            const underW = overSf.oppWalletCount;
            const overInv = overSf.conTotalInvested;
            const underInv = overSf.oppTotalInv;
            const totalInv = overInv + underInv;
            const overPnl = overPos.reduce((s, p) => s + (p.totalPnl || 0), 0);
            const underPnl = underPos.reduce((s, p) => s + (p.totalPnl || 0), 0);
            const overAvg = overW > 0 ? overInv / overW : 0;
            const underAvg = underW > 0 ? underInv / underW : 0;
            const consSide = tSummary.consensus;
            const isOver = consSide === 'over';
            const moneyRatio = totalInv > 0 ? Math.round((Math.max(overInv, underInv) / totalInv) * 100) : 50;
            const tl = pinnGame?.totalCurrent?.line;

            const panelStyle = (isActive) => ({
              flex: 1, padding: '0.625rem', borderRadius: '8px',
              background: isActive ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.015)',
              border: `1px solid ${isActive ? 'rgba(245,158,11,0.3)' : B.borderSubtle}`,
              position: 'relative', overflow: 'hidden',
            });

            return (
              <div style={{ marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>Total Money — Both Sides</span>
                  <span style={{ ...T.micro, fontWeight: 800, color: '#F59E0B', padding: '0.1rem 0.3rem', borderRadius: '3px', background: 'rgba(245,158,11,0.12)' }}>
                    {moneyRatio}% {isOver ? 'Over' : 'Under'}
                  </span>
                  {tl && <span style={{ ...T.micro, color: B.textMuted }}>({tl})</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={panelStyle(isOver)}>
                    {isOver && <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: '#F59E0B', borderRadius: '8px 0 0 8px' }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                      {isOver && <span style={{ ...T.micro, fontSize: '0.5rem', fontWeight: 900, padding: '0.1rem 0.3rem', borderRadius: '3px', color: '#fff', background: '#F59E0B' }}>SHARP SIDE</span>}
                      <span style={{ ...T.sub, fontWeight: 900, color: isOver ? B.text : B.textMuted }}>Over{tl ? ` ${tl}` : ''}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <div>
                        <div style={{ ...T.heading, fontWeight: 900, color: isOver ? '#F59E0B' : B.textSec, fontFeatureSettings: "'tnum'" }}>{fmtVol(overInv)}</div>
                        <div style={{ ...T.micro, color: B.textMuted }}>{overW} sharp{overW !== 1 ? 's' : ''} · avg {fmtVol(overAvg)}</div>
                      </div>
                      <div style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", padding: '0.15rem 0.4rem', borderRadius: '4px', color: overPnl >= 0 ? B.green : B.red, background: overPnl >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                        {overPnl >= 0 ? '+' : ''}{fmtVol(overPnl)} sports P&L
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 0.125rem', flexShrink: 0 }}>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>VS</span>
                  </div>
                  <div style={panelStyle(!isOver)}>
                    {!isOver && <div style={{ position: 'absolute', top: 0, right: 0, width: '3px', height: '100%', background: '#F59E0B', borderRadius: '0 8px 8px 0' }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                      <span style={{ ...T.sub, fontWeight: 900, color: !isOver ? B.text : B.textMuted }}>Under{tl ? ` ${tl}` : ''}</span>
                      {!isOver && <span style={{ ...T.micro, fontSize: '0.5rem', fontWeight: 900, padding: '0.1rem 0.3rem', borderRadius: '3px', color: '#fff', background: '#F59E0B' }}>SHARP SIDE</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ ...T.heading, fontWeight: 900, color: !isOver ? '#F59E0B' : B.textSec, fontFeatureSettings: "'tnum'", textAlign: 'right' }}>{fmtVol(underInv)}</div>
                        <div style={{ ...T.micro, color: B.textMuted, textAlign: 'right' }}>{underW} sharp{underW !== 1 ? 's' : ''} · avg {fmtVol(underAvg)}</div>
                      </div>
                      <div style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", padding: '0.15rem 0.4rem', borderRadius: '4px', color: underPnl >= 0 ? B.green : B.red, background: underPnl >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                        {underPnl >= 0 ? '+' : ''}{fmtVol(underPnl)} sports P&L
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ─── Total Market Flow Bar ─── */}
          {totalGameData && totalGameData.positions?.length > 0 && (() => {
            const tSummary = totalGameData.summary;
            const overInv = tSummary.overInvested || 0;
            const underInv = tSummary.underInvested || 0;
            const totalInvT = overInv + underInv;
            const overPctT = totalInvT > 0 ? (overInv / totalInvT) * 100 : 50;
            const underPctT = totalInvT > 0 ? (underInv / totalInvT) * 100 : 50;
            const consSide = tSummary.consensus;
            const consIsOver = consSide === 'over';
            const accentC = '#8B5CF6';
            const bars = [{ label: 'Sharp Money', awayVal: overPctT, homeVal: underPctT }];
            return (
              <div style={{
                marginBottom: '0.625rem', borderRadius: '8px', overflow: 'hidden',
                border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}`,
                }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>Market Flow</span>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>Over</span>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>Under</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {bars.map(bar => {
                    const overWins = bar.awayVal > bar.homeVal;
                    const underWins = bar.homeVal > bar.awayVal;
                    const overColor = consIsOver && overWins ? accentC : overWins ? B.textSec : B.textMuted;
                    const underColor = !consIsOver && underWins ? accentC : underWins ? B.textSec : B.textMuted;
                    const barOverBg = overWins
                      ? (consIsOver ? `linear-gradient(90deg, ${accentC}44, ${accentC})` : `linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.18))`)
                      : 'rgba(255,255,255,0.05)';
                    const barUnderBg = underWins
                      ? (!consIsOver ? `linear-gradient(90deg, ${accentC}, ${accentC}44)` : `linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))`)
                      : 'rgba(255,255,255,0.05)';
                    return (
                      <div key={bar.label}>
                        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 36px', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ ...T.micro, fontSize: '0.625rem', fontWeight: 800, fontFeatureSettings: "'tnum'", color: overColor, textAlign: 'left' }}>
                            {bar.awayVal.toFixed(0)}%
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                            <div style={{ display: 'flex', height: '5px', borderRadius: '2.5px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                              <div style={{ width: `${bar.awayVal}%`, background: barOverBg, borderRadius: '2.5px 0 0 2.5px', transition: 'width 0.5s cubic-bezier(.4,0,.2,1)' }} />
                              <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                              <div style={{ width: `${bar.homeVal}%`, background: barUnderBg, borderRadius: '0 2.5px 2.5px 0', transition: 'width 0.5s cubic-bezier(.4,0,.2,1)' }} />
                            </div>
                            <span style={{ ...T.micro, fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', letterSpacing: '0.03em' }}>{bar.label}</span>
                          </div>
                          <span style={{ ...T.micro, fontSize: '0.625rem', fontWeight: 800, fontFeatureSettings: "'tnum'", color: underColor, textAlign: 'right' }}>
                            {bar.homeVal.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <TotalPanel pinnGame={pinnGame} game={flowGame || { away: gd.away, home: gd.home }} isMobile={isMobile} />

          {/* ─── Pinnacle Total Line Confirmation ─── */}
          {pinnGame?.totalOpener && pinnGame?.totalCurrent && (() => {
            const to = pinnGame.totalOpener;
            const tc = pinnGame.totalCurrent;
            return (
              <div style={{
                display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center',
                padding: '0.375rem 0.625rem', marginTop: '0.25rem',
                borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${B.borderSubtle}`,
              }}>
                <span style={{ ...T.micro, color: B.gold, fontWeight: 600 }}>Pinnacle</span>
                <span style={{ ...T.micro, color: B.textSec }}>
                  Open: {to.line}
                </span>
                <span style={{ ...T.micro, color: B.text, fontWeight: 600 }}>
                  Now: {tc.line}
                </span>
                {totalPinnMovedWith && <span style={{ ...T.micro, color: B.green, fontWeight: 700 }}>✓ Confirms</span>}
                {totalPinnMovedAgainst && <span style={{ ...T.micro, color: B.red, fontWeight: 700 }}>✗ Opposes</span>}
              </div>
            );
          })()}

          {/* ─── Total Price Movement — Polymarket ─── */}
          {flowGame?.polyTotal?.priceHistory && flowGame.polyTotal.priceHistory.points?.length >= 2 && (() => {
            const pH = flowGame.polyTotal.priceHistory;
            const polyTotalPts = pH.points;
            const consIsOver = totalGameData?.summary?.consensus === 'over';
            const polyMoving = consIsOver ? pH.change > 0 : pH.change < 0;
            const polyAgainst = consIsOver ? pH.change < 0 : pH.change > 0;
            return (
              <div style={{
                borderRadius: '8px', overflow: 'hidden', marginTop: '0.5rem',
                border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>Prediction Market — Total</span>
                </div>
                <div style={{ padding: '0.5rem 0.625rem' }}>
                  <MiniSparkline
                    points={polyTotalPts}
                    color={polyMoving ? B.green : polyAgainst ? B.red : B.sky}
                    label={`${flowGame.polyTotal.title || 'O/U'}`}
                    startLabel={`${pH.open}¢`}
                    endLabel={`${pH.current}¢`}
                    width={isMobile ? 120 : 140}
                    height={32}
                  />
                  <span style={{
                    ...T.micro, fontSize: '0.5rem', fontWeight: 700, marginTop: '0.15rem', display: 'block',
                    color: polyMoving ? B.green : polyAgainst ? B.red : B.textMuted,
                  }}>
                    {polyMoving ? '↑ Moving with play' : polyAgainst ? '↓ Moving against play' : '— Stable'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Total Wallet Trades */}
          {totalGameData && totalGameData.positions?.length > 0 && (() => {
            const tPos = totalGameData.positions;
            const uniqueTotalWallets = new Set(tPos.map(p => p.wallet)).size;
            const tSummary = totalGameData.summary;
            const consSide = tSummary.consensus;
            // Phase 2: {SPORT} WINNER counts for this totals market
            const totWinFor = new Set();
            const totWinAg = new Set();
            tPos.forEach(p => {
              if (!isSportWinner(p.wallet, gd.sport)) return;
              if (p.side === consSide) totWinFor.add(p.wallet);
              else if (p.side) totWinAg.add(p.wallet);
            });
            const totWinForCt = totWinFor.size, totWinAgCt = totWinAg.size;
            const totalPnl = tPos.reduce((s, p) => s + (p.totalPnl || 0), 0);
            const now = Date.now();
            const sideOpts = [
              { key: 'all', label: 'All Bets' },
              { key: 'consensus', label: consSide === 'over' ? 'Over' : 'Under' },
              { key: 'opposing', label: consSide === 'over' ? 'Under' : 'Over' },
            ];
            const filtered = tPos.filter(p => {
              if (totalWalletFilter === 'consensus' && p.side !== consSide) return false;
              if (totalWalletFilter === 'opposing' && p.side === consSide) return false;
              return true;
            }).sort((a, b) => (b.sportVerified ? 1 : 0) - (a.sportVerified ? 1 : 0));

            return <>
              <button onClick={() => setShowTotalWallets(!showTotalWallets)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', cursor: 'pointer', padding: '0.5rem 0.625rem', borderRadius: '8px',
                background: 'rgba(245,158,11,0.04)', border: `1px solid ${B.borderSubtle}`, marginTop: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  {showTotalWallets ? <ChevronUp size={12} color="#F59E0B" /> : <ChevronDown size={12} color="#F59E0B" />}
                  <span style={{ ...T.micro, color: '#F59E0B', fontWeight: 700 }}>
                    {uniqueTotalWallets} TOTAL SHARP{uniqueTotalWallets !== 1 ? 'S' : ''}
                    {totWinForCt > 0 && <span style={{ color: B.gold, fontWeight: 900 }}> · {totWinForCt} {gd.sport} WINNER{totWinForCt !== 1 ? 'S' : ''}</span>}
                    {totWinAgCt > totWinForCt && <span style={{ color: B.red, fontWeight: 900 }}> · {totWinAgCt} {gd.sport} FADING</span>}
                  </span>
                </div>
                <span style={{ ...T.micro, color: B.textSec }}>
                  Combined P&L: <span style={{ fontWeight: 700, color: totalPnl >= 0 ? B.green : B.red }}>{totalPnl >= 0 ? '+' : ''}{fmtVol(totalPnl)}</span>
                </span>
              </button>
              {showTotalWallets && (
                <div style={{ marginTop: '0.375rem', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${B.borderSubtle}` }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center', padding: '0.5rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ ...T.micro, color: B.textMuted, marginRight: '0.25rem' }}>Side:</span>
                    {sideOpts.map(o => (
                      <button key={o.key} onClick={() => setTotalWalletFilter(o.key)} style={{ ...T.micro, fontWeight: totalWalletFilter === o.key ? 700 : 400, padding: '0.15rem 0.45rem', borderRadius: '4px', cursor: 'pointer', border: 'none', color: totalWalletFilter === o.key ? '#F59E0B' : B.textMuted, background: totalWalletFilter === o.key ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)' }}>{o.label}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.6rem' }}>
                    {filtered.map((p, i) => (
                      <WalletDossierRow key={`${p.wallet}-${i}`} p={p} gd={gd} now={now} isMobile={isMobile} market="total" accent="#F59E0B" />
                    ))}
                  </div>
                </div>
              )}
            </>;
          })()}
        </div>
      )}

      {marketTab === 'ml' && <div style={{ padding: '0.75rem 0.875rem' }}>
        {/* ─── Position Battle — Both Sides ─── */}
        {(awayWallets > 0 || homeWallets > 0) && (() => {
          const awaySide = consensusSide === 'away';
          const homeSide = consensusSide === 'home';
          const moneyRatio = totalInvested > 0 ? Math.round((Math.max(awayInvested, homeInvested) / totalInvested) * 100) : 50;

          // ── Qualified sharp money (proven winners we actually follow) ──────
          // The $ bars above are ALL tracked sharp money — they can pile onto
          // the favorite even when the proven, whitelisted winners (the wallets
          // the model trusts) sit on the OTHER side. This callout isolates the
          // qualified signal and anchors to the locked/AGS side so the card can
          // never imply the opposite side is "the play".
          const provenSideAgg = (side) => {
            let n = 0, money = 0, pnl = 0; const seen = new Set();
            for (const p of gd.positions) {
              if (!p || p.side !== side || !(p.invested > 0)) continue;
              if (!isSportWinner(p.wallet, gd.sport)) continue;
              if (seen.has(p.wallet)) continue; seen.add(p.wallet);
              n++; money += p.invested || 0; pnl += (p.totalPnl || p.sportPnlTotal || 0);
            }
            return { n, money, pnl };
          };
          const qLockSide = (liveLockedSideKey === 'away' || liveLockedSideKey === 'home') ? liveLockedSideKey : consensusSide;
          const qOffSide = qLockSide === 'away' ? 'home' : 'away';
          const qLockShort = qLockSide === 'away' ? awayShort : homeShort;
          const qOffShort = qOffSide === 'away' ? awayShort : homeShort;
          const provLock = provenSideAgg(qLockSide);
          const provOff = provenSideAgg(qOffSide);
          const fvQ = mlAgs?.featureValues ?? null;
          const qForCount = fvQ?.forCount ?? provLock.n;
          const qAgCount = fvQ?.agCount ?? provOff.n;
          const qHcCount = fvQ?.forHcCount ?? 0;
          const qContrib = Number.isFinite(fvQ?.forContribShare) ? Math.round(fvQ.forContribShare * 100) : null;
          const qHasData = (qForCount + qAgCount) > 0 || (provLock.n + provOff.n) > 0;
          const qDisagrees = qHasData && qLockSide !== consensusSide;
          // Asymmetry follows the data: the sharp side takes ~60% of the
          // row and glows; the dead side compresses and dims.
          const panelStyle = (isActive) => ({
            flex: isActive ? 1.55 : 1, padding: isActive ? '0.5rem 0.6rem' : '0.4rem 0.5rem',
            borderRadius: '10px',
            background: isActive
              ? `radial-gradient(120% 150% at 50% 0%, ${accentColor}12 0%, transparent 60%), linear-gradient(135deg, ${accentColor}0e 0%, ${accentColor}03 100%)`
              : 'rgba(255,255,255,0.015)',
            border: `1px solid ${isActive ? `${accentColor}40` : B.borderSubtle}`,
            boxShadow: isActive ? `0 0 14px ${accentColor}14, inset 0 1px 0 rgba(255,255,255,0.04)` : 'none',
            opacity: isActive ? 1 : 0.7,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          });

          const SidePanel = ({ team, wallets, invested, pnl, avgBet, isActive, align }) => (
            <div style={panelStyle(isActive)}>
              {isActive && (
                <div style={{
                  position: 'absolute', top: 0, [align === 'left' ? 'left' : 'right']: 0,
                  width: '2px', height: '100%',
                  background: accentColor,
                  borderRadius: align === 'left' ? '8px 0 0 8px' : '0 8px 8px 0',
                }} />
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
                marginBottom: '0.3rem',
              }}>
                {isActive && align === 'left' && (
                  <span style={{
                    ...T.micro, fontSize: '0.46rem', fontWeight: 900,
                    padding: '0.08rem 0.28rem', borderRadius: '3px',
                    color: '#fff', background: accentColor,
                  }}>MOST $</span>
                )}
                <span style={{
                  ...T.sub, fontWeight: 900,
                  color: isActive ? B.text : B.textMuted,
                }}>
                  {team}
                </span>
                {isActive && align === 'right' && (
                  <span style={{
                    ...T.micro, fontSize: '0.46rem', fontWeight: 900,
                    padding: '0.08rem 0.28rem', borderRadius: '3px',
                    color: '#fff', background: accentColor,
                  }}>MOST $</span>
                )}
              </div>

              <div style={{
                display: 'flex', flexDirection: 'column', gap: '0.2rem',
                alignItems: align === 'right' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    fontSize: isActive ? '1.25rem' : '0.875rem', fontWeight: 900,
                    color: isActive ? accentColor : B.textSec,
                    fontFeatureSettings: "'tnum'", lineHeight: 1.1, letterSpacing: '-0.01em',
                    textShadow: isActive ? `0 0 18px ${accentColor}30` : 'none',
                  }}>
                    {fmtVol(invested)}
                  </div>
                  <div style={{ ...T.micro, fontSize: '0.55rem', color: B.textMuted, lineHeight: 1.15 }}>
                    {wallets} sharp{wallets !== 1 ? 's' : ''} · avg {fmtVol(avgBet)}
                  </div>
                </div>
                <div style={{
                  ...T.micro, fontSize: '0.58rem',
                  fontWeight: 700, fontFeatureSettings: "'tnum'",
                  padding: '0.1rem 0.32rem', borderRadius: '4px',
                  color: pnl >= 0 ? B.green : B.red,
                  background: pnl >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                  lineHeight: 1.1,
                }}>
                  {pnl >= 0 ? '+' : ''}{fmtVol(pnl)} P&L
                </div>
              </div>
            </div>
          );

          return (
            <div style={{ marginBottom: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.4rem' }}>
                <span style={{ ...T.tiny, fontSize: '0.55rem', color: B.textSubtle, letterSpacing: '0.09em' }}>ALL TRACKED MONEY — BOTH SIDES</span>
                <span style={{
                  ...T.micro, fontWeight: 800, color: B.textSec,
                  padding: '0.1rem 0.32rem', borderRadius: '3px',
                  background: 'rgba(255,255,255,0.05)', fontFeatureSettings: "'tnum'",
                }}>
                  {moneyRatio}% {consensusShort}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                <SidePanel team={awayShort} wallets={awayWallets} invested={awayInvested} pnl={awayLifetimePnl} avgBet={awayAvgBet} isActive={awaySide} align="left" />

                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '0 0.05rem', flexShrink: 0,
                }}>
                  <span style={{
                    ...T.micro, fontSize: '0.52rem', color: B.textMuted, fontWeight: 800,
                    width: '22px', height: '22px', borderRadius: '50%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${B.border}`, background: 'rgba(255,255,255,0.02)',
                    letterSpacing: '0.02em',
                  }}>VS</span>
                </div>

                <SidePanel team={homeShort} wallets={homeWallets} invested={homeInvested} pnl={homeLifetimePnl} avgBet={homeAvgBet} isActive={homeSide} align="right" />
              </div>

              {/* ─── Qualified sharp money (proven winners we follow) ─── */}
              {qHasData && (
                <div style={{
                  marginTop: '0.5rem', padding: '0.5rem 0.6rem', borderRadius: '10px',
                  background: `${accentColor}0c`, border: `1px solid ${accentColor}33`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.4rem' }}>
                    <ShieldCheck size={11} color={accentColor} strokeWidth={2.5} />
                    <span style={{ ...T.tiny, fontSize: '0.55rem', color: accentColor, letterSpacing: '0.08em', fontWeight: 900 }}>QUALIFIED SHARP MONEY</span>
                    <span style={{ ...T.micro, fontSize: '0.5rem', color: B.textMuted, fontWeight: 600 }}>proven winners we follow</span>
                    {qContrib != null && (
                      <span style={{
                        marginLeft: 'auto', ...T.micro, fontWeight: 800, color: accentColor,
                        padding: '0.1rem 0.32rem', borderRadius: '3px',
                        background: `${accentColor}15`, fontFeatureSettings: "'tnum'",
                      }}>
                        {qContrib}% {qLockShort}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                    <div style={{ flex: 1.4, padding: '0.4rem 0.5rem', borderRadius: '8px', background: `${accentColor}10`, border: `1px solid ${accentColor}40` }}>
                      <div style={{ ...T.sub, fontWeight: 900, color: B.text, lineHeight: 1.1 }}>{qLockShort}</div>
                      <div style={{ ...T.micro, fontSize: '0.6rem', color: accentColor, fontWeight: 800, lineHeight: 1.3 }}>
                        {qForCount} proven winner{qForCount !== 1 ? 's' : ''}{qHcCount > 0 ? ` · ${qHcCount} HC` : ''}
                      </div>
                      <div style={{ ...T.micro, fontSize: '0.58rem', color: provLock.pnl >= 0 ? B.green : B.red, fontWeight: 700, fontFeatureSettings: "'tnum'" }}>
                        {fmtVol(provLock.money)} · {provLock.pnl >= 0 ? '+' : ''}{fmtVol(provLock.pnl)} net
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: '0.4rem 0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.015)', border: `1px solid ${B.borderSubtle}`, opacity: 0.75 }}>
                      <div style={{ ...T.sub, fontWeight: 800, color: B.textMuted, lineHeight: 1.1 }}>{qOffShort}</div>
                      <div style={{ ...T.micro, fontSize: '0.6rem', color: B.textMuted, fontWeight: 700, lineHeight: 1.3 }}>
                        {qAgCount} proven{qAgCount !== 1 ? 's' : ''}
                      </div>
                      <div style={{ ...T.micro, fontSize: '0.58rem', color: provOff.pnl >= 0 ? B.green : B.red, fontWeight: 700, fontFeatureSettings: "'tnum'" }}>
                        {fmtVol(provOff.money)} · {provOff.pnl >= 0 ? '+' : ''}{fmtVol(provOff.pnl)} net
                      </div>
                    </div>
                  </div>
                  {qDisagrees && (
                    <div style={{ marginTop: '0.4rem', ...T.micro, fontSize: '0.58rem', color: B.gold, fontWeight: 600, lineHeight: 1.35 }}>
                      Most tracked money is on {consensusShort} ({moneyRatio}%), but the proven winners — and our model — back {qLockShort}.
                    </div>
                  )}
                </div>
              )}

              {/* ─── Market Flow Split ─── */}
              {(() => {
                const bars = [
                  { label: 'Sharp Money', awayVal: awayPct, homeVal: 100 - awayPct },
                  ...(flowGame ? [
                    { label: 'Public Tickets', awayVal: flowGame.awayTicketPct || 50, homeVal: flowGame.homeTicketPct || 50 },
                    { label: 'Public Money', awayVal: flowGame.awayMoneyPct || 50, homeVal: flowGame.homeMoneyPct || 50 },
                  ] : []),
                ];
                return (
                  <div style={{
                    marginTop: '0.55rem', paddingTop: '0.5rem',
                    borderTop: `1px solid ${B.borderSubtle}`,
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0 0.1rem 0.3rem',
                    }}>
                      <span style={{ ...T.tiny, fontSize: '0.55rem', color: B.textSubtle, letterSpacing: '0.09em' }}>MARKET FLOW</span>
                      <div style={{ display: 'flex', gap: '0.7rem' }}>
                        <span style={{ ...T.micro, fontSize: '0.58rem', color: B.textMuted, fontWeight: 700 }}>{awayShort}</span>
                        <span style={{ ...T.micro, fontSize: '0.58rem', color: B.textMuted, fontWeight: 700 }}>{homeShort}</span>
                      </div>
                    </div>
                    <div style={{ padding: '0 0.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {bars.map(bar => {
                        const awayWins = bar.awayVal > bar.homeVal;
                        const homeWins = bar.homeVal > bar.awayVal;
                        const awayColor = awaySide && awayWins ? accentColor : awayWins ? B.textSec : B.textMuted;
                        const homeColor = homeSide && homeWins ? accentColor : homeWins ? B.textSec : B.textMuted;
                        const barAwayBg = awayWins
                          ? (awaySide ? `linear-gradient(90deg, ${accentColor}44, ${accentColor})` : `linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.18))`)
                          : 'rgba(255,255,255,0.05)';
                        const barHomeBg = homeWins
                          ? (homeSide ? `linear-gradient(90deg, ${accentColor}, ${accentColor}44)` : `linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))`)
                          : 'rgba(255,255,255,0.05)';
                        return (
                          <div key={bar.label}>
                            <div style={{
                              display: 'grid', gridTemplateColumns: '36px 1fr 36px',
                              alignItems: 'center', gap: '0.375rem',
                            }}>
                              <span style={{
                                ...T.micro, fontSize: '0.625rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
                                color: awayColor, textAlign: 'left',
                              }}>
                                {bar.awayVal.toFixed(0)}%
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                                <div style={{
                                  display: 'flex', height: '7px', borderRadius: '3.5px', overflow: 'hidden',
                                  background: 'rgba(255,255,255,0.04)',
                                  boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.3)',
                                }}>
                                  <div className="sf-bar-left" style={{
                                    width: `${bar.awayVal}%`, background: barAwayBg,
                                    borderRadius: awayWins ? '3.5px' : '3.5px 0 0 3.5px',
                                    boxShadow: awaySide && awayWins ? `0 0 8px ${accentColor}50` : 'none',
                                    transition: 'width 0.5s cubic-bezier(.4,0,.2,1)',
                                  }} />
                                  <div style={{ width: '2px', background: 'rgba(11,15,31,0.9)', flexShrink: 0 }} />
                                  <div className="sf-bar-right" style={{
                                    width: `${bar.homeVal}%`, background: barHomeBg,
                                    borderRadius: homeWins ? '3.5px' : '0 3.5px 3.5px 0',
                                    boxShadow: homeSide && homeWins ? `0 0 8px ${accentColor}50` : 'none',
                                    transition: 'width 0.5s cubic-bezier(.4,0,.2,1)',
                                  }} />
                                </div>
                                <span style={{
                                  ...T.micro, fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)',
                                  textAlign: 'center', letterSpacing: '0.05em', textTransform: 'uppercase',
                                }}>
                                  {bar.label}
                                </span>
                              </div>
                              <span style={{
                                ...T.micro, fontSize: '0.625rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
                                color: homeColor, textAlign: 'right',
                              }}>
                                {bar.homeVal.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* ─── Price Movement — Sparklines with directional context ─── */}
        {(pinnConsensusPoints.length >= 2 || polyPoints.length >= 2) && (
          <div style={{
            marginBottom: '0.5rem', paddingTop: '0.5rem',
            borderTop: `1px solid ${B.borderSubtle}`,
          }}>
            <div style={{ padding: '0 0.1rem 0.35rem' }}>
              <span style={{ ...T.tiny, fontSize: '0.55rem', color: B.textSubtle, letterSpacing: '0.09em' }}>PRICE MOVEMENT</span>
            </div>
            <div style={{
              display: 'flex', gap: '0.65rem', padding: '0 0.1rem',
              flexWrap: 'wrap', alignItems: 'flex-start',
            }}>
              {pinnConsensusPoints.length >= 2 && (
                <div style={{ flex: '1 1 130px' }}>
                  <MiniSparkline
                    points={pinnConsensusPoints}
                    color={pinnMovingWith ? B.green : pinnMovingAgainst ? B.red : B.gold}
                    label={`Pinnacle — ${consensusShort} ML`}
                    startLabel={fmtOdds(pinnConsensusPoints[0])}
                    endLabel={fmtOdds(pinnConsensusPoints[pinnConsensusPoints.length - 1])}
                    width={isMobile ? 120 : 140}
                    height={32}
                  />
                  <span style={{
                    ...T.micro, fontSize: '0.5rem', fontWeight: 700, marginTop: '0.15rem', display: 'block',
                    color: pinnMovingWith ? B.green : pinnMovingAgainst ? B.red : B.textMuted,
                  }}>
                    {pinnMovingWith ? '↑ Moving with play' : pinnMovingAgainst ? '↓ Moving against play' : '— No movement'}
                  </span>
                </div>
              )}
              {polyPoints.length >= 2 && (
                <div style={{ flex: '1 1 130px' }}>
                  <MiniSparkline
                    points={polyPoints}
                    color={polyMovingWith ? B.green : polyMovingAgainst ? B.red : B.sky}
                    label={`Prediction Market — ${awayShort}`}
                    startLabel={`${polyPriceHistory.open}¢`}
                    endLabel={`${polyPriceHistory.current}¢`}
                    width={isMobile ? 120 : 140}
                    height={32}
                  />
                  <span style={{
                    ...T.micro, fontSize: '0.5rem', fontWeight: 700, marginTop: '0.15rem', display: 'block',
                    color: polyMovingWith ? B.green : polyMovingAgainst ? B.red : B.textMuted,
                  }}>
                    {polyMovingWith ? '↑ Moving with play' : polyMovingAgainst ? '↓ Moving against play' : '— No movement'}
                  </span>
                </div>
              )}
              {pinnGame?.opener && pinnGame?.current && (
                <div style={{
                  flex: '1 1 100%', display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
                  alignItems: 'center', paddingTop: '0.25rem',
                  borderTop: `1px solid ${B.borderSubtle}`,
                }}>
                  <span style={{ ...T.micro, color: B.gold, fontWeight: 600 }}>Pinnacle</span>
                  <span style={{ ...T.micro, color: B.textSec }}>
                    Open: {fmtOdds(pinnGame.opener.away)} / {fmtOdds(pinnGame.opener.home)}
                  </span>
                  <span style={{ ...T.micro, color: B.text, fontWeight: 600 }}>
                    Now: {fmtOdds(pinnGame.current.away)} / {fmtOdds(pinnGame.current.home)}
                  </span>
                  {pinnConfirms && (
                    <span style={{ ...T.micro, color: B.green, fontWeight: 700 }}>✓ Confirms</span>
                  )}
                  {pinnMoved && !pinnConfirms && (
                    <span style={{ ...T.micro, color: B.red, fontWeight: 700 }}>✗ Opposes</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>}

      <div style={{ padding: '0 0.875rem 0.75rem' }}>
        {/* ─── Book Prices ─── */}
        {pinnGame && Object.keys(allBooks).length > 1 && (
          <div style={{
            marginBottom: '0.5rem', paddingTop: '0.5rem',
            borderTop: `1px solid ${B.borderSubtle}`,
          }}>
            <div style={{ padding: '0 0.1rem 0.35rem' }}>
              <span style={{ ...T.tiny, fontSize: '0.55rem', color: B.textSubtle, letterSpacing: '0.09em' }}>
                BOOK PRICES — {consensusShort} ML
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
              {Object.entries(allBooks)
                .filter(([, b]) => sideBookOdds(b, consensusSide) != null)
                .sort(([, a], [, b]) => {
                  const aO = sideBookOdds(a, consensusSide);
                  const bO = sideBookOdds(b, consensusSide);
                  return bO - aO;
                })
                .map(([key, book]) => {
                  const odds = sideBookOdds(book, consensusSide);
                  const isBest = odds === bestRetail && hasEV;
                  const isPinn = key === 'pinnacle';
                  return (
                    <div key={key} style={{
                      flex: '1 1 auto', minWidth: '60px',
                      padding: '0.3rem 0.4rem',
                      borderRight: `1px solid ${B.borderSubtle}`,
                      background: isBest
                        ? 'linear-gradient(180deg, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.04) 100%)'
                        : 'transparent',
                      boxShadow: isBest ? 'inset 0 0 0 1px rgba(16,185,129,0.35)' : 'none',
                      position: 'relative',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ ...T.micro, fontSize: '0.55rem', color: isPinn ? B.gold : B.textMuted, fontWeight: isPinn ? 700 : 400, lineHeight: 1.15 }}>
                          {book.name}
                        </span>
                        {isBest && (
                          <span style={{
                            fontSize: '0.42rem', fontWeight: 900, letterSpacing: '0.08em',
                            padding: '0.05rem 0.22rem', borderRadius: '2.5px',
                            color: '#04110B', background: B.green,
                            lineHeight: 1.3,
                          }}>BEST</span>
                        )}
                      </div>
                      <div style={{
                        ...T.caption, fontWeight: isBest ? 900 : 700,
                        color: isBest ? B.green : isPinn ? B.gold : B.text,
                        lineHeight: 1.1, fontFeatureSettings: "'tnum'",
                        textShadow: isBest ? '0 0 10px rgba(16,185,129,0.35)' : 'none',
                      }}>
                        {fmtOdds(odds)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ─── Verified Sharps (collapsible, with filters) ─── */}
        <button onClick={() => setShowWallets(!showWallets)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', cursor: 'pointer',
          padding: '0.5rem 0.625rem', borderRadius: '8px',
          background: 'rgba(212,175,55,0.04)',
          border: `1px solid ${B.borderSubtle}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            {showWallets ? <ChevronUp size={12} color={B.gold} /> : <ChevronDown size={12} color={B.gold} />}
            {/* v6 — the hero chip up top already carries the winner/fading story.
                This toggle stays as a plain affordance to expand the wallet list. */}
            <span style={{ ...T.micro, color: B.gold, fontWeight: 700 }}>
              {showWallets ? 'HIDE' : 'VIEW'} {uniqueWallets} SHARP {uniqueWallets !== 1 ? 'WALLETS' : 'WALLET'}
            </span>
          </div>
          <span style={{ ...T.micro, color: B.textSec }}>
            Combined P&L: <span style={{ fontWeight: 700, color: totalLifetimePnl >= 0 ? B.green : B.red }}>
              {totalLifetimePnl >= 0 ? '+' : ''}{fmtVol(totalLifetimePnl)}
            </span>
          </span>
        </button>
        {showWallets && (() => {
          const sideOpts = [
            { key: 'all', label: 'All Bets' },
            { key: 'consensus', label: consensusShort },
            { key: 'opposing', label: gd.sport === 'SOC' ? 'Opposing' : consensusSide === 'away' ? homeShort : awayShort },
          ];
          const now = Date.now();
          const filtered = gd.positions.filter(p => {
            if (walletSideFilter === 'consensus' && p.side !== consensusSide) return false;
            if (walletSideFilter === 'opposing' && p.side === consensusSide) return false;
            return true;
          }).sort((a, b) => (b.sportVerified ? 1 : 0) - (a.sportVerified ? 1 : 0));

          return (
            <div style={{
              marginTop: '0.375rem', borderRadius: '10px', overflow: 'hidden',
              border: `1px solid ${B.borderSubtle}`,
              animation: 'fadeIn 0.3s ease both',
            }}>
              {/* Filter bar */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center',
                padding: '0.5rem 0.625rem',
                borderBottom: `1px solid ${B.borderSubtle}`,
                background: 'rgba(255,255,255,0.02)',
              }}>
                <span style={{ ...T.micro, color: B.textMuted, marginRight: '0.25rem' }}>Side:</span>
                {sideOpts.map(o => (
                  <button key={o.key} onClick={() => setWalletSideFilter(o.key)} style={{
                    ...T.micro, fontWeight: walletSideFilter === o.key ? 700 : 400,
                    padding: '0.15rem 0.45rem', borderRadius: '4px', cursor: 'pointer',
                    border: 'none',
                    color: walletSideFilter === o.key ? B.gold : B.textMuted,
                    background: walletSideFilter === o.key ? B.goldDim : 'rgba(255,255,255,0.04)',
                  }}>
                    {o.label}
                  </button>
                ))}
              </div>

              {/* Filtered count */}
              {walletSideFilter !== 'all' && (
                <div style={{
                  padding: '0.25rem 0.625rem',
                  borderBottom: `1px solid ${B.borderSubtle}`,
                  background: 'rgba(255,255,255,0.015)',
                }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>
                    Showing {filtered.length} of {gd.positions.length} positions
                  </span>
                </div>
              )}

              {/* Position rows — premium wallet dossiers */}
              {filtered.length === 0 ? (
                <div style={{ padding: '1rem 0.625rem', textAlign: 'center' }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>No positions match filters</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.6rem' }}>
                  {filtered.map((p, i) => (
                    <WalletDossierRow key={`${p.wallet}-${i}`} p={p} gd={gd} now={now} isMobile={isMobile} market="ml" accent={B.gold} />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        <div style={{ padding: '0 0.875rem 0.875rem', marginTop: '0.375rem' }}>
          {canPickGames ? (
            <button
              onClick={() => onToggleMyPick(gd.key, isMyPick ? null : { side: consensusSide, team: consensusTeam, sport: gd.sport })}
              style={{
                width: '100%', padding: '0.625rem 0.75rem', borderRadius: '10px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                border: isMyPick ? `1.5px solid rgba(212,175,55,0.55)` : `1.5px solid ${B.goldBorder}`,
                background: isMyPick
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.01) 100%)',
                color: isMyPick ? B.goldHover : B.gold,
                boxShadow: isMyPick ? `0 0 12px ${B.goldGlow}` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <CheckCircle size={15} style={{ strokeWidth: isMyPick ? 2.5 : 2 }} />
              {isMyPick ? '✓ On Watchlist' : '+ Add to Watchlist'}
            </button>
          ) : (
            <a
              href="#/pricing"
              style={{
                width: '100%', padding: '0.625rem 0.75rem', borderRadius: '10px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                border: `1.5px solid ${B.goldBorder}`,
                background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.01) 100%)',
                color: B.gold,
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              }}
            >
              <Lock size={13} />
              + Add to Watchlist
              <span style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.7, marginLeft: '0.15rem' }}>PRO</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

// ─── Profit Over Time Chart ───────────────────────────────────────────────────

const starBucketLabel = (s) => s >= 4.5 ? 5 : s >= 3.5 ? 4 : 3;

const SharpFlowProfitChart = memo(function SharpFlowProfitChart({ picks }) {
  const [showChart, setShowChart] = useState(false);
  const [chartSport, setChartSport] = useState('ALL');
  const [chartStars, setChartStars] = useState('ALL');

  const chartData = useMemo(() => {
    if (!picks || picks.length === 0) return [];
    // v5.6: exclude cancelled/muted/superseded picks from the cumulative
    // profit curve. `pick.cancelled` is set by loadAllTimePnL → processSide
    // whenever the side was MUTED, CANCELLED, superseded, or never left
    // SHADOW. Counting those would inflate or deflate the equity curve with
    // outcomes the system explicitly told users to skip.
    const completed = picks.filter(p => p.status === 'COMPLETED' && p.outcome && !p.cancelled);
    if (completed.length === 0) return [];

    const filtered = completed.filter(p => {
      if (chartSport !== 'ALL' && p.sport !== chartSport) return false;
      if (chartStars !== 'ALL' && starBucketLabel(p.stars) !== chartStars) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
    let cumulative = 0;
    return sorted.map((p, i) => {
      cumulative += p.profit;
      return {
        index: i + 1,
        date: new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        profit: +cumulative.toFixed(2),
        pickProfit: p.profit,
        sport: p.sport,
        stars: p.stars,
      };
    });
  }, [picks, chartSport, chartStars]);

  const finalProfit = chartData.length > 0 ? chartData[chartData.length - 1].profit : 0;
  const isProfit = finalProfit >= 0;
  const totalPicks = chartData.length;

  const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    const v = payload[0].value;
    return (
      <div style={{
        background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px', padding: '0.6rem 0.75rem', backdropFilter: 'blur(8px)',
      }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem' }}>
          {d.date} · Pick #{d.index}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: v >= 0 ? '#10B981' : '#EF4444' }}>
          {v >= 0 ? '+' : ''}{v.toFixed(2)}u
        </div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
          This pick: {d.pickProfit >= 0 ? '+' : ''}{d.pickProfit.toFixed(2)}u · {d.sport} · {d.stars}★
        </div>
      </div>
    );
  };

  const FilterBtn = ({ isActive, onClick, children, color }) => (
    <button onClick={onClick} style={{
      padding: '0.3rem 0.7rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', cursor: 'pointer',
      border: isActive ? `1.5px solid ${color || B.gold}` : '1px solid rgba(255,255,255,0.1)',
      background: isActive ? `${color || B.gold}22` : 'rgba(255,255,255,0.03)',
      color: isActive ? (color || B.gold) : 'rgba(255,255,255,0.5)',
      transition: 'all 0.2s ease', letterSpacing: '0.03em',
    }}>{children}</button>
  );

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <button onClick={() => setShowChart(c => !c)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.625rem 0.875rem', borderRadius: '8px', cursor: 'pointer',
        background: 'rgba(255,255,255,0.02)', border: `1px solid ${B.borderSubtle}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={15} color={B.green} />
          <span style={{ ...T.micro, fontWeight: 700, color: B.text, letterSpacing: '0.04em' }}>Profit Over Time</span>
          {totalPicks > 0 && (
            <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.6rem' }}>· {totalPicks} picks</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {totalPicks > 0 && (
            <span style={{
              padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 800,
              color: isProfit ? B.green : B.red,
              background: isProfit ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${isProfit ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}>
              {isProfit ? '+' : ''}{finalProfit.toFixed(1)}u
            </span>
          )}
          {showChart ? <ChevronUp size={13} color={B.textMuted} /> : <ChevronDown size={13} color={B.textMuted} />}
        </div>
      </button>

      {showChart && (
        <div style={{
          marginTop: '0.5rem', padding: '1rem', borderRadius: '8px',
          background: 'rgba(17,24,39,0.4)', border: `1px solid ${B.borderSubtle}`,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.375rem' }}>Sport</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {[{ k: 'ALL', l: 'All Sports' }, { k: 'NHL', l: 'NHL' }, { k: 'CBB', l: 'CBB' }, { k: 'MLB', l: 'MLB' }, { k: 'NBA', l: 'NBA' }, { k: 'SOC', l: 'SOC' }].map(s => (
                  <FilterBtn key={s.k} isActive={chartSport === s.k} onClick={() => setChartSport(s.k)} color="#3B82F6">{s.l}</FilterBtn>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.375rem' }}>Rating</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {[{ k: 'ALL', l: 'All Ratings', c: '#64748B' }, { k: 5, l: '★★★★★', c: '#10B981' }, { k: 4, l: '★★★★', c: '#059669' }, { k: 3, l: '★★★', c: '#0EA5E9' }].map(r => (
                  <FilterBtn key={r.k} isActive={chartStars === r.k} onClick={() => setChartStars(r.k)} color={r.c}>{r.l}</FilterBtn>
                ))}
              </div>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <TrendingUp size={24} color={B.textMuted} style={{ marginBottom: '0.5rem' }} />
              <div style={{ ...T.micro, color: B.textMuted }}>No graded picks match these filters yet.</div>
            </div>
          ) : (
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.25)" style={{ fontSize: '0.65rem' }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.25)" style={{ fontSize: '0.65rem' }} tickLine={false} tickFormatter={v => `${v >= 0 ? '+' : ''}${v}u`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="profit" stroke={isProfit ? '#10B981' : '#EF4444'} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: isProfit ? '#10B981' : '#EF4444' }} animationDuration={400} />
                  <Line type="monotone" dataKey={() => 0} stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── CountUp ─────────────────────────────────────────────────────────────
// Odometer animation — eases a number from its previously-displayed value
// to the new target on mount and on every value change. Used across the
// Performance dashboard hero KPIs so figures assemble themselves on reveal
// (the same credibility cue the top-of-page stat cards use). Continues
// smoothly from the current animated value if the target changes mid-flight.
function CountUp({ value, format, duration = 950, style, className }) {
  const target = Number.isFinite(value) ? value : 0;
  const [display, setDisplay] = useState(0);
  const curRef = useRef(0);
  const rafRef = useRef(null);
  useEffect(() => {
    const from = curRef.current;
    if (from === target) { setDisplay(target); return undefined; }
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      const cur = from + (target - from) * eased;
      curRef.current = cur;
      setDisplay(cur);
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
      else { curRef.current = target; setDisplay(target); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  const fmt = format || ((n) => `${Math.round(n)}`);
  return <span style={style} className={className}>{fmt(display)}</span>;
}

// ─── ConvictionGauge ─────────────────────────────────────────────────────
// Semicircular arc gauge — the card's iconic "how loaded is this side"
// visual. Sweeps in on mount via stroke-dasharray transition.
function ConvictionGauge({ pct, accent }) {
  const r = 25, cx = 32, cy = 32, sw = 5.5;
  const clamped = Math.max(0, Math.min(100, pct || 0));
  const circ = Math.PI * r;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', flexShrink: 0 }}>
      <svg width="64" height="36" viewBox="0 0 64 36" style={{ display: 'block', overflow: 'visible' }}>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={sw} strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={accent} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * circ} ${circ}`}
          style={{
            filter: `drop-shadow(0 0 3px ${accent}88)`,
            transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <text x={cx} y={cy - 1} textAnchor="middle" fill={accent} fontSize="13.5" fontWeight="900"
          style={{ fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em' }}>
          {Math.round(clamped)}%
        </text>
      </svg>
      <span style={{
        fontSize: '0.42rem', fontWeight: 800, letterSpacing: '0.12em',
        color: B.textSubtle, textTransform: 'uppercase', whiteSpace: 'nowrap',
        lineHeight: 1,
      }}>
        Money on side
      </span>
    </div>
  );
}

// ─── SharpTape ───────────────────────────────────────────────────────────
// Trading-floor ticker: the most recent verified-sharp entries across
// every tracked game stream right-to-left above the card grid. Pure
// CSS marquee (duplicated content, translateX(-50%) loop), pauses on
// hover, edge-faded via mask. Makes the page feel ALIVE before a
// single card is read.
const SharpTape = memo(function SharpTape({ sharpPositions }) {
  const items = useMemo(() => {
    const out = [];
    for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC']) {
      const games = sharpPositions?.[sport] || {};
      for (const gd of Object.values(games)) {
        for (const p of gd.positions || []) {
          if (!p.firstSeen || !(p.invested >= 1000)) continue;
          const ts = new Date(p.firstSeen).getTime();
          if (isNaN(ts)) continue;
          const team = p.side === 'draw' ? 'Draw' : p.side === 'away' ? gd.away : gd.home;
          if (!team) continue;
          out.push({
            sport,
            team: team.split(' ').pop(),
            invested: p.invested,
            price: p.avgPrice,
            pnl: p.totalPnl || 0,
            ts,
          });
        }
      }
    }
    out.sort((a, b) => b.ts - a.ts);
    return out.slice(0, 18);
  }, [sharpPositions]);

  if (items.length < 4) return null;

  const agoTxt = (ts) => {
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 60) return `${m}m`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.round(h / 24)}d`;
  };

  const renderRun = (prefix) => items.map((it, i) => (
    <span key={`${prefix}-${i}`} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
      padding: '0 1.15rem', whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0,
        background: it.pnl >= 0 ? B.green : '#F59E0B',
        boxShadow: `0 0 6px ${it.pnl >= 0 ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}`,
      }} />
      <span style={{ ...T.micro, fontSize: '0.58rem', fontWeight: 600, color: B.textSubtle, letterSpacing: '0.05em' }}>{it.sport}</span>
      <span style={{ ...T.micro, fontSize: '0.62rem', fontWeight: 800, color: B.text, letterSpacing: '0.03em' }}>{it.team.toUpperCase()}</span>
      <span style={{ ...T.micro, fontSize: '0.62rem', fontWeight: 800, color: B.gold, fontFeatureSettings: "'tnum'" }}>{fmtVol(it.invested)}</span>
      {Number.isFinite(it.price) && (
        <span style={{ ...T.micro, fontSize: '0.58rem', color: B.textMuted, fontFeatureSettings: "'tnum'" }}>@{Math.round(it.price * 100)}¢</span>
      )}
      <span style={{ ...T.micro, fontSize: '0.58rem', fontWeight: 700, color: it.pnl >= 0 ? B.green : B.red, fontFeatureSettings: "'tnum'" }}>
        {it.pnl >= 0 ? '+' : ''}{fmtVol(it.pnl)}
      </span>
      <span style={{ ...T.micro, fontSize: '0.55rem', color: B.textSubtle, fontFeatureSettings: "'tnum'" }}>{agoTxt(it.ts)}</span>
    </span>
  ));

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.65rem',
      marginBottom: '0.85rem', padding: '0.45rem 0.65rem',
      borderRadius: '10px',
      background: 'linear-gradient(160deg, rgba(26,31,46,0.55) 0%, rgba(17,21,31,0.65) 100%)',
      border: `1px solid ${B.borderSubtle}`,
      overflow: 'hidden',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0,
        padding: '0.18rem 0.5rem', borderRadius: '5px',
        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
      }}>
        <span style={{
          width: '5px', height: '5px', borderRadius: '50%', background: B.green,
          boxShadow: '0 0 6px rgba(16,185,129,0.7)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <span style={{ ...T.micro, fontSize: '0.55rem', fontWeight: 900, color: B.green, letterSpacing: '0.1em' }}>SHARP TAPE</span>
      </span>
      <div className="sf-tape" style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <div className="sf-tape-track" style={{ animationDuration: `${Math.max(40, items.length * 5)}s` }}>
          {renderRun('a')}
          {renderRun('b')}
        </div>
      </div>
    </div>
  );
});

export default function SharpFlow() {
  const { polyData, kalshiData, whaleProfiles, pinnacleHistory, sharpPositions, spreadPositions, totalPositions, sportsSharps, intelExcludedWallets, walletProfiles, loading } = useMarketData();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription(user);
  const [sportFilter, setSportFilter] = useState('All');
  const [viewMode, setViewMode] = useState('whaleSignals');
  const [vaultSportFilter, setVaultSportFilter] = useState('ALL');
  const [vaultSortMode, setVaultSortMode] = useState('pnl');
  const [expandedVaultRow, setExpandedVaultRow] = useState(null);
  const [showConvergence, setShowConvergence] = useState(true);
  const [actionSortMode, setActionSortMode] = useState('size');
  const [actionSportFilter, setActionSportFilter] = useState('ALL');
  const [actionMarketFilter, setActionMarketFilter] = useState('ALL');
  const [actionStatusFilter, setActionStatusFilter] = useState('PREGAME');
  const [expandedActionCard, setExpandedActionCard] = useState(null);
  const [gameSort, setGameSort] = useState('time');
  const [signalType, setSignalType] = useState('upcoming');
  // View/sort selection survives refresh — landing on Locked Picks
  // every reload (regardless of where the user was) was a UX bug.
  // First-time visitors still default to 'locked'.
  const [sortBy, setSortBy] = useState(() => {
    try { return localStorage.getItem('sf_view_v1') || 'locked'; } catch { return 'locked'; }
  });
  useEffect(() => {
    try { localStorage.setItem('sf_view_v1', sortBy); } catch { /* private mode */ }
  }, [sortBy]);
  const [lockedPicks, setLockedPicks] = useState({});
  const [allTimePnL, setAllTimePnL] = useState(null);
  // AGS-U Performance Dashboard. One bar covers everything now:
  // v12-LIVE is the default scope; the user can toggle to ALL-TIME inside
  // the expanded body to surface every pick ever graded (legacy stars +
  // v9 + v10 + v11 + v12). The standalone Pre-v12 archive bar was retired
  // 2026-06-11 per UX feedback ("I want 1 bar only").
  const [showAgsuPerf, setShowAgsuPerf] = useState(false);
  // 'v12' (default, the live model since 2026-06-01) | 'all' (every era).
  const [agsuEraScope, setAgsuEraScope] = useState('v12');
  const [agsuDateRange, setAgsuDateRange] = useState('all');
  const [agsuSport, setAgsuSport] = useState('ALL');
  // agsuMarket — ML / Spread / Total drilldown, reinstated 2026-07-02 under
  // the league row. Values: 'ALL' | 'ML' | 'SPREAD' | 'TOTAL' (compared
  // against the pick's marketType, which is lowercase 'ml'/'spread'/'total').
  const [agsuMarket, setAgsuMarket] = useState('ALL');
  // Sub-sections inside the dashboard — all collapsed by default so the
  // first impression is clean (era pills + filters + 4 KPIs + curve only).
  const [showAgsuLedger, setShowAgsuLedger] = useState(false);
  const [showAgsuTiers, setShowAgsuTiers] = useState(false);
  const [lockedDay, setLockedDay] = useState('today');
  const [lockedStatusFilter, setLockedStatusFilter] = useState('all');
  const [lockedSort, setLockedSort] = useState('stars');
  const [lockedSportFilter, setLockedSportFilter] = useState('All');
  const [lockedMarketFilter, setLockedMarketFilter] = useState('all');
  const [showCancelled, setShowCancelled] = useState(false);
  const [picksLoaded, setPicksLoaded] = useState(false);
  const [userPicks, setUserPicks] = useState({});
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  // Load existing locked picks on mount
  useEffect(() => {
    loadLockedPicks().then(picks => {
      setLockedPicks(picks);
      setPicksLoaded(true);
    });
  }, []);
  // Load user's watchlist on mount (premium users only)
  useEffect(() => {
    if (user?.uid && isPremium) {
      loadUserPicks(user.uid).then(setUserPicks);
    }
  }, [user?.uid, isPremium]);

  const pnlLoadedRef = useRef(false);
  useEffect(() => {
    // Load the all-time P&L bundle as soon as the user lands on a
    // surface that consumes it: the Performance tab, the free-user
    // paywall (uses pregame totals), or the Locked Picks list (uses
    // `byAgsTier` for the post-cutover Q-tier scorecard). One fetch
    // serves them all; sessionStorage caches for 30 min.
    if ((showAgsuPerf || !isPremium || sortBy === 'locked') && !pnlLoadedRef.current) {
      pnlLoadedRef.current = true;
      loadAllTimePnL().then(setAllTimePnL);
    }
  }, [showAgsuPerf, isPremium, sortBy]);


  const onPickSynced = useCallback((docId, side, snap, meta, action) => {
    setLockedPicks(prev => {
      const next = { ...prev };
      const prevDoc = next[docId] || {};
      const prevSides = prevDoc.sides || {};
      const updatedSides = { ...prevSides };
      if (action === 'side_added') {
        for (const sk of Object.keys(updatedSides)) {
          if (sk !== side) updatedSides[sk] = { ...updatedSides[sk], superseded: true, supersededAt: Date.now() };
        }
      }
      // v12 cleanup: deep-merge peak/lock so the cron-stamped tier-driven
      // fields (stars / units / unitTier / team) survive when the browser
      // sends a descriptive-fields-only snap. Pre-v12 we did `peak: snap`
      // which REPLACED the whole peak object, wiping cron's authoritative
      // stars / units / unitTier and dropping the LockedPickCard back to
      // peak.stars=undefined → "DEVELOPING" / no tier.
      const prevSide = updatedSides[side] || {};
      const prevPeak = prevSide.peak || {};
      const prevLock = prevSide.lock || null;
      const mergedPeak = { ...prevPeak, ...snap };
      // If the snap omits stars/units/unitTier (post-v12 browser sync),
      // prevPeak's cron-stamped values win. If snap explicitly provides
      // them (legacy path), those win — matches the old replace behavior.
      updatedSides[side] = {
        ...prevSide,
        peak: mergedPeak,
        lock: prevLock || mergedPeak,
        team: snap.team || prevSide.team,
      };
      const docUpdate = { ...prevDoc, sides: updatedSides };
      if (meta) { docUpdate.sport = meta.sport; docUpdate.away = meta.away; docUpdate.home = meta.home; docUpdate.commenceTime = meta.commenceTime; if (meta.marketType) docUpdate.marketType = meta.marketType; }
      next[docId] = docUpdate;
      return next;
    });
  }, []);

  const onHealthSynced = useCallback((docId, side, health) => {
    setLockedPicks(prev => {
      const doc = prev[docId];
      if (!doc?.sides?.[side]) return prev;
      return {
        ...prev,
        [docId]: {
          ...doc,
          sides: { ...doc.sides, [side]: { ...doc.sides[side], health } },
        },
      };
    });
  }, []);

  const onToggleMyPick = useCallback((gameKey, pickData) => {
    if (!user?.uid) return;
    const isAdding = !userPicks[gameKey];
    setUserPicks(prev => {
      if (isAdding) return { ...prev, [gameKey]: { ...pickData, addedAt: Date.now() } };
      const next = { ...prev };
      delete next[gameKey];
      return next;
    });
    toggleUserPick(user.uid, todayET(), gameKey, isAdding ? pickData : null).catch(console.warn);
  }, [user?.uid, userPicks]);

  const allGames = useMemo(
    () => (polyData || kalshiData) ? buildGameData(polyData, kalshiData) : [],
    [polyData, kalshiData]
  );

  const filteredGames = useMemo(() => {
    let g = allGames;
    if (sportFilter !== 'All') g = g.filter(gm => gm.sport === sportFilter);
    return g;
  }, [allGames, sportFilter]);

  const gameFlowMap = useMemo(() => {
    const m = {};
    for (const g of allGames) m[`${g.sport}_${g.key}`] = g;
    return m;
  }, [allGames]);

  const signalCount = useMemo(() => {
    return filteredGames.filter(g => g.totalTrades > 0 && g.ticketDivergence >= 10).length;
  }, [filteredGames]);

  const sortedGames = useMemo(() => {
    const g = [...filteredGames];
    if (gameSort === 'time') {
      g.sort((a, b) => {
        const aT = pinnacleHistory?.[a.sport]?.[a.key]?.commence;
        const bT = pinnacleHistory?.[b.sport]?.[b.key]?.commence;
        return (aT ? new Date(aT).getTime() : Infinity) - (bT ? new Date(bT).getTime() : Infinity);
      });
    }
    else if (gameSort === 'volume') g.sort((a, b) => b.volume - a.volume);
    else if (gameSort === 'divergence') g.sort((a, b) => b.ticketDivergence - a.ticketDivergence);
    else if (gameSort === 'whales') g.sort((a, b) => b.whaleCash - a.whaleCash);
    else if (gameSort === 'active') g.sort((a, b) => b.latestTradeTs - a.latestTradeTs);
    return g;
  }, [filteredGames, gameSort, pinnacleHistory]);

  const { totalVol, totalTrades, totalWhales } = useMemo(() => {
    let vol = 0, trades = 0, whales = 0;
    for (const g of filteredGames) { vol += g.volume; trades += g.totalTrades; whales += g.whaleCount; }
    return { totalVol: vol, totalTrades: trades, totalWhales: whales };
  }, [filteredGames]);

  const sharpStats = useMemo(() => {
    const allEliteProven = whaleProfiles ? Object.entries(whaleProfiles).filter(([, p]) => ['ELITE', 'PROVEN'].includes(p.tier)) : [];
    const sportSharpsAddrs = sportsSharps ? new Set(Object.keys(sportsSharps).filter(k => k !== '_meta')) : new Set();

    const isClean = (addr, p) => {
      if ((p.mmScore || 0) > 40) return false;
      const lookup = sportsSharps?.[addr];
      if (lookup) return (lookup.sportPnlTotal || 0) > 0 || lookup.monthlyQualified;
      const aggSportPnl = Object.values(p.sportPnl || {}).reduce((s, v) => s + v, 0);
      return aggSportPnl > 0;
    };

    const mmExcluded = allEliteProven.filter(([, p]) => (p.mmScore || 0) > 40).length;
    const nonMM = allEliteProven.filter(([, p]) => (p.mmScore || 0) <= 40);
    const noSport = nonMM.filter(([addr, p]) => !isClean(addr, p)).length;
    const totalExcluded = mmExcluded + noSport;

    const cleanEntries = allEliteProven.filter(([addr, p]) => isClean(addr, p));
    const cleanAddrs = new Set(cleanEntries.map(([addr]) => addr));

    const supplementalCount = [...sportSharpsAddrs].filter(addr => {
      if (cleanAddrs.has(addr)) return false;
      const w = sportsSharps[addr];
      return (w?.sportPnlTotal || 0) > 0 || w?.monthlyQualified;
    }).length;

    let totalSharpInvested = 0;
    for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC']) {
      const sg = sharpPositions?.[sport] || {};
      for (const gd of Object.values(sg)) totalSharpInvested += gd.summary?.totalInvested || 0;
    }

    const cleanPnl = cleanEntries.reduce((s, [addr, p]) => {
      const lookup = sportsSharps?.[addr];
      return s + (lookup ? (lookup.sportPnlTotal || 0) : (p.totalPnl || 0));
    }, 0);
    const supplementalPnl = [...sportSharpsAddrs].filter(addr => {
      if (cleanAddrs.has(addr)) return false;
      const w = sportsSharps[addr];
      return (w?.sportPnlTotal || 0) > 0 || w?.monthlyQualified;
    }).reduce((s, addr) => s + (sportsSharps[addr]?.sportPnlTotal || 0), 0);

    return {
      trackedCount: cleanAddrs.size + supplementalCount,
      totalExcluded, mmExcluded, sportLosers: 0, noSport, supplementalCount,
      gamesWithPos: sharpPositions
        ? Object.values(sharpPositions.NHL || {}).length
          + Object.values(sharpPositions.CBB || {}).length
          + Object.values(sharpPositions.NBA || {}).length
          + Object.values(sharpPositions.MLB || {}).length
        : 0,
      totalSharpPnl: cleanPnl + supplementalPnl,
      totalSharpInvested,
    };
  }, [whaleProfiles, sharpPositions, sportsSharps]);

  const VAULT_SIZE = 25;

  const v8Norm = useMemo(() => buildV8Normalization(sportsSharps), [sportsSharps]);

  const intelExcludedSet = useMemo(() => {
    const xs = intelExcludedWallets?.excluded;
    if (!Array.isArray(xs) || xs.length === 0) return null;
    return new Set(xs.map((a) => (a || '').toLowerCase()));
  }, [intelExcludedWallets]);

  const vaultData = useMemo(() => {
    if (!sportsSharps) return null;
    const entries = Object.entries(sportsSharps)
      .filter(([k]) => k !== '_meta')
      .filter(([addr]) => !intelExcludedSet?.has(addr.toLowerCase()))
      .map(([addr, w]) => ({
        wallet: addr,
        name: '***' + addr.slice(-4),
        totalPnl: w.totalPnl || 0,
        sportPnlTotal: w.sportPnlTotal || 0,
        overallPnl: w.overallPnl ?? w.totalPnl ?? 0,
        overallVol: w.overallVol ?? w.vol ?? 0,
        sportMarkets: w.sportMarkets || {},
        marketsTraded: w.marketsTraded || 0,
        vol: w.vol || 0,
        roi: w.sportROI || (w.vol > 0 ? (w.totalPnl / w.vol) * 100 : 0),
        avgBet: w.avgSportBet || (w.marketsTraded > 0 ? w.vol / w.marketsTraded : 0),
        sportBets: w.sportBetCount || Object.values(w.sportMarkets || {}).reduce((s, v) => s + v, 0),
        sportsActive: Object.keys(w.sportMarkets || {}).length,
        leaderboardRank: w.leaderboardRank || null,
        perSport: w.perSport || {},
        recentResults: w.recentResults || [],
        weeklyPnl: w.weeklyPnl ?? null,
        weeklyRank: w.weeklyRank ?? null,
        dailyPnl: w.dailyPnl ?? null,
      }))
      .sort((a, b) => b.sportPnlTotal - a.sportPnlTotal)
      .slice(0, VAULT_SIZE);

    const walletSet = new Set(entries.map(e => e.wallet.toLowerCase()));

    const todayPositions = {};
    const convergenceMap = {};
    for (const sport of ['NHL', 'NBA', 'MLB', 'CBB', 'NFL']) {
      const sportGames = sharpPositions?.[sport] || {};
      for (const [gameKey, gd] of Object.entries(sportGames)) {
        if (!gd.positions) continue;
        for (const pos of gd.positions) {
          const wLower = pos.wallet?.toLowerCase();
          if (!wLower || !walletSet.has(wLower)) continue;
          if (!todayPositions[wLower]) todayPositions[wLower] = [];
          todayPositions[wLower].push({ ...pos, sport, gameKey, away: gd.away, home: gd.home });
          const convKey = `${sport}_${gameKey}_${pos.side}`;
          if (!convergenceMap[convKey]) convergenceMap[convKey] = {
            sport, gameKey, away: gd.away, home: gd.home, side: pos.side,
            team: pos.side === 'home' ? gd.home : gd.away, sharps: [],
          };
          const entry = entries.find(e => e.wallet.toLowerCase() === wLower);
          convergenceMap[convKey].sharps.push({
            name: entry?.name || pos.name, sportPnl: entry?.sportPnlTotal || 0,
            invested: pos.invested || 0, wallet: wLower,
          });
        }
      }
    }

    const convergences = Object.values(convergenceMap)
      .filter(c => c.sharps.length >= 2)
      .sort((a, b) => b.sharps.length - a.sharps.length);

    const activeCount = entries.filter(e => todayPositions[e.wallet.toLowerCase()]?.length > 0).length;
    const combinedPnl = entries.reduce((s, e) => s + e.sportPnlTotal, 0);

    const actionPositions = [];
    const posFiles = [
      { data: sharpPositions, mkt: 'ML' },
      { data: spreadPositions, mkt: 'SPREAD' },
      { data: totalPositions, mkt: 'TOTAL' },
    ];
    for (const { data: posData, mkt } of posFiles) {
      if (!posData) continue;
      for (const sport of ['NHL', 'NBA', 'MLB', 'CBB', 'NFL']) {
        const sportGames = posData[sport] || {};
        for (const [gameKey, gd] of Object.entries(sportGames)) {
          if (!gd.positions) continue;
          const gameCommence = polyData?.[sport]?.[gameKey]?.commence
            ? new Date(polyData[sport][gameKey].commence).getTime()
            : pinnacleHistory?.[sport]?.[gameKey]?.commence
              ? new Date(pinnacleHistory[sport][gameKey].commence).getTime()
              : null;
          for (const pos of gd.positions) {
            const wLower = pos.wallet?.toLowerCase();
            if (!wLower) continue;
            if (intelExcludedSet?.has(wLower)) continue;
            if (gameCommence && pos.firstSeen && new Date(pos.firstSeen).getTime() >= gameCommence) continue;
            const avgBet = pos.avgSportBet || 0;
            if (avgBet <= 0) continue;
            if (pos.invested < avgBet * 0.75) continue;
            if (pos.invested < 5000) continue;
            const teamName = pos.side === 'home' || pos.side === 'over'
              ? (pos.side === 'over' ? 'Over' : gd.home)
              : (pos.side === 'under' ? 'Under' : gd.away);
            const mult = avgBet > 0 ? pos.invested / avgBet : 0;
            const displayRoi = Math.min(pos.sportROI || 0, 999.9);
            actionPositions.push({
              ...pos,
              sport,
              gameKey,
              away: gd.away,
              home: gd.home,
              marketType: mkt,
              teamName,
              betMultiplier: mult,
              displayRoi,
            });
          }
        }
      }
    }

    // ── Vault HC Margin (premium-tier badging, client-side mirror) ──────────
    // Mirrors scripts/writeSharpActions.js → computeVaultHcSignals so the UI
    // surfaces HC +1 / HC +2+ badges on Today's Action cards every ~8 min
    // (live JSON refresh) without waiting for the 2-hour Firestore write.
    // HC = whitelistTier === 'CONFIRMED' AND sizeRatio ≥ HC_RATIO.
    //
    // Group positions by (sport, gameKey, marketType) once, dedupe each
    // wallet's bet on each side (max invested wins), then for each position
    // count HC backers vs HC faders relative to its side.
    const allGameMarketGroups = new Map();
    const posFilesForHc = [
      { data: sharpPositions, mkt: 'ML' },
      { data: spreadPositions, mkt: 'SPREAD' },
      { data: totalPositions, mkt: 'TOTAL' },
    ];
    for (const { data: posData, mkt } of posFilesForHc) {
      if (!posData) continue;
      for (const sport of ['NHL', 'NBA', 'MLB', 'CBB', 'NFL']) {
        const sportGames = posData[sport] || {};
        for (const [gameKey, gd] of Object.entries(sportGames)) {
          if (!gd.positions) continue;
          const groupKey = `${sport}|${gameKey}|${mkt}`;
          // Dedupe by wallet+side, keep max invested.
          const seen = new Map();
          for (const pos of gd.positions) {
            if (!pos.wallet || !pos.side) continue;
            const k = `${pos.wallet.toLowerCase()}|${pos.side}`;
            const cur = seen.get(k);
            if (!cur || (pos.invested || 0) > (cur.invested || 0)) seen.set(k, pos);
          }
          const details = [];
          for (const p of seen.values()) {
            const avgBet = p.avgSportBet || 0;
            const sizeRatio = avgBet > 0 ? (p.invested || 0) / avgBet : 0;
            details.push({
              wallet: p.wallet,
              walletShort: String(p.wallet).slice(-6),
              side: p.side,
              sizeRatio,
            });
          }
          allGameMarketGroups.set(groupKey, { sport, details });
        }
      }
    }
    const hcCountsByGroup = new Map(); // groupKey|side → { hcConfFor, hcConfAg }
    for (const [groupKey, { sport, details }] of allGameMarketGroups) {
      // Count CONFIRMED + sizeRatio ≥ HC_RATIO wallets per side.
      const sideHcCounts = new Map();
      for (const d of details) {
        const tier = getWalletProfile(d.walletShort)?.bySport?.[sport]?.whitelistTier;
        if (tier !== 'CONFIRMED') continue;
        if (d.sizeRatio < HC_RATIO) continue;
        sideHcCounts.set(d.side, (sideHcCounts.get(d.side) || 0) + 1);
      }
      // For each side that appears in details, compute hcConfFor/Ag.
      const sidesSeen = new Set(details.map(d => d.side).filter(Boolean));
      for (const mySide of sidesSeen) {
        let hcConfFor = sideHcCounts.get(mySide) || 0;
        let hcConfAg = 0;
        for (const [s, n] of sideHcCounts) {
          if (s !== mySide) hcConfAg += n;
        }
        hcCountsByGroup.set(`${groupKey}|${mySide}`, { hcConfFor, hcConfAg });
      }
    }
    // Stamp HC fields on every actionPosition (drives badges + auto-pin sort).
    for (const ap of actionPositions) {
      const sport = ap.sport;
      const groupKey = `${sport}|${ap.gameKey}|${ap.marketType}`;
      const sideKey = `${groupKey}|${ap.side}`;
      const counts = hcCountsByGroup.get(sideKey) || { hcConfFor: 0, hcConfAg: 0 };
      const hcMargin = counts.hcConfFor - counts.hcConfAg;
      let hcTier = null;
      if (hcMargin >= 2) hcTier = 'HC_DOMINANT';
      else if (hcMargin === 1) hcTier = 'HC_STANDARD';
      else if (hcMargin <= -1) hcTier = 'HC_FADE';
      // isHcWallet — this wallet itself qualifies as HC on its side.
      const myAvgBet = ap.avgSportBet || 0;
      const mySizeRatio = myAvgBet > 0 ? (ap.invested || 0) / myAvgBet : 0;
      const myTier = getWalletProfile(String(ap.wallet).slice(-6))?.bySport?.[sport]?.whitelistTier || null;
      const isHcWallet = myTier === 'CONFIRMED' && mySizeRatio >= HC_RATIO;
      ap.vault_hcConfFor = counts.hcConfFor;
      ap.vault_hcConfAg = counts.hcConfAg;
      ap.vault_hcMargin = hcMargin;
      ap.vault_hcTier = hcTier;
      ap.vault_isHcWallet = isHcWallet;
    }

    return { entries, todayPositions, convergences, activeCount, combinedPnl, actionPositions };
    // walletProfiles is intentionally in deps so vaultData re-computes once the
    // sharpWalletProfiles cache populates — this drives HC badge availability.
  }, [sportsSharps, sharpPositions, spreadPositions, totalPositions, intelExcludedSet, polyData, pinnacleHistory, walletProfiles]);

  // v7.4 — block render until ALL fetch sources are loaded. The lock-state
  // pipeline (decideLockStage / computeWalletConsensus) reads wallet
  // whitelist tiers from the module-level cache populated by the
  // sharpWalletProfiles Firestore fetch. If we render before that fetch
  // resolves, every wallet looks tier=null → CONFIRMED sharps don't get
  // counted → dw=0 → cards flash MUTED/WEAKENING for half a second before
  // the second render flips them to ACTIVE. That two-step flip is what
  // causes the "card says weakening but Firebase says HC=+1" mismatch.
  // Gating on walletProfiles being non-null kills the race; the splash
  // stays up until every input the lock decision reads is in memory.
  if (loading || authLoading || subLoading || walletProfiles == null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: B.textSec }}>
        <div style={{ textAlign: 'center' }}>
          <Zap size={32} color={B.gold} style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
          <div style={{ ...T.body }}>Loading Sharp Flow...</div>
        </div>
      </div>
    );
  }

  const isFreeUser = !isPremium;

  if (filteredGames.length === 0) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <PageHeader sportFilter={sportFilter} setSportFilter={setSportFilter} viewMode={viewMode} setViewMode={setViewMode} isMobile={isMobile} />
        <div style={{
          textAlign: 'center', padding: '3rem', borderRadius: '12px',
          background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
          border: `1px solid ${B.border}`, marginTop: '2rem',
        }}>
          <Activity size={32} color={B.textMuted} style={{ marginBottom: '0.75rem' }} />
          <div style={{ ...T.sub, color: B.text, marginBottom: '0.375rem' }}>No market activity detected</div>
          <div style={{ ...T.label, color: B.textSec }}>
            {sportFilter !== 'All' ? `No ${sportFilter} data found. Try All.` : 'Data will populate once trading begins.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '1rem' : '1.5rem 1rem', position: 'relative' }}>
      {/* Ambient aurora — fixed light field behind the glass cards. Two
          slow-drifting radial pools (brand gold + emerald) plus a deep
          blue wash give the backdrop-filter blur something to refract,
          which is what sells the glassmorphism. pointer-events: none and
          z-index below content; honors prefers-reduced-motion via CSS. */}
      <div className="sf-aurora" aria-hidden="true" />
      <PageHeader sportFilter={sportFilter} setSportFilter={setSportFilter} viewMode={viewMode} setViewMode={setViewMode} isMobile={isMobile} />

      {/* ─── Sharp Vault View ─── */}
      {viewMode === 'sharpVault' && isFreeUser && (
        <SharpFlowPaywall isMobile={isMobile} pnlData={allTimePnL} />
      )}
      {viewMode === 'sharpVault' && !isFreeUser && vaultData && (() => {
        const { entries, todayPositions, convergences, activeCount, combinedPnl, actionPositions } = vaultData;
        const SPORT_COLORS = { NBA: '#FF8C00', NHL: '#D4AF37', MLB: '#E31837', CBB: '#FF6B35', NFL: '#4CAF50', SOC: '#2ECC71' };
        const sportIcons = { NBA: '\u{1F3C0}', NHL: '\u{1F3D2}', MLB: '\u26BE', CBB: '\u{1F3C0}', NFL: '\u{1F3C8}', SOC: '\u26BD' };

        let filteredEntries = vaultSportFilter === 'ALL'
          ? [...entries]
          : [...entries].filter(e => (e.sportMarkets[vaultSportFilter] || 0) > 0);

        const sortFns = {
          pnl: (a, b) => b.sportPnlTotal - a.sportPnlTotal,
          roi: (a, b) => (b.sportBets >= 20 ? b.roi : -999) - (a.sportBets >= 20 ? a.roi : -999),
          weekly: (a, b) => (b.weeklyPnl ?? -Infinity) - (a.weeklyPnl ?? -Infinity),
          avgbet: (a, b) => b.avgBet - a.avgBet,
          volume: (a, b) => b.vol - a.vol,
        };
        filteredEntries.sort(sortFns[vaultSortMode] || sortFns.pnl);

        const avgRoi = entries.length > 0 ? entries.reduce((s, e) => s + e.roi, 0) / entries.length : 0;
        const combinedVol = entries.reduce((s, e) => s + e.vol, 0);
        const weeklyTotal = entries.reduce((s, e) => s + (e.weeklyPnl || 0), 0);

        return (
          <div>
            {/* Vault Header */}
            <div style={{
              background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
              border: `1px solid ${B.goldBorder}`, borderRadius: '14px',
              overflow: 'hidden', marginBottom: '1.25rem',
            }}>
              <div style={{
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${B.gold}, ${B.gold}80, transparent)`,
              }} />
              <div style={{ padding: isMobile ? '1.25rem 1rem' : '1.5rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                  <Lock size={18} color={B.gold} style={{ opacity: 0.8 }} />
                  <span style={{ ...T.heading, color: B.text, letterSpacing: '-0.01em' }}>Sharp Vault</span>
                </div>
                <p style={{ ...T.label, color: B.textMuted, margin: 0, lineHeight: 1.6 }}>
                  The top 10 sport-proven bettors ranked by verified profit. When multiple specialists converge on the same game, pay attention.
                </p>

                {/* Inline Hero Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                  gap: '0.75rem', marginTop: '1rem',
                  paddingTop: '1rem', borderTop: `1px solid ${B.border}`,
                }}>
                  {[
                    { label: 'ELITE SHARPS', value: String(entries.length), color: B.gold },
                    { label: 'COMBINED P&L', value: `+${fmtVol(combinedPnl)}`, color: B.green },
                    { label: 'AVG ROI', value: `+${avgRoi.toFixed(1)}%`, color: avgRoi >= 5 ? B.green : '#22D3EE' },
                    { label: 'THIS WEEK', value: weeklyTotal !== 0 ? `${weeklyTotal >= 0 ? '+' : ''}${fmtVol(weeklyTotal)}` : '—', color: weeklyTotal > 0 ? B.green : weeklyTotal < 0 ? B.red : B.textMuted },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: isMobile && i > 1 ? 'center' : undefined }}>
                      <div style={{ ...T.heading, color: s.color, fontFeatureSettings: "'tnum'", fontSize: isMobile ? '1rem' : '1.125rem' }}>
                        {s.value}
                      </div>
                      <div style={{ ...T.micro, color: B.textMuted, letterSpacing: '0.06em', marginTop: '0.125rem' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Convergence — Collapsible */}
            <div style={{ marginBottom: '1.25rem' }}>
              <button onClick={() => setShowConvergence(!showConvergence)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.625rem 0.875rem', borderRadius: '10px', cursor: 'pointer',
                background: convergences.length > 0 ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${convergences.length > 0 ? B.goldBorder : B.borderSubtle}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
                  <span style={{ ...T.label, color: B.gold, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Today's Convergence
                  </span>
                  {convergences.length > 0 && (
                    <span style={{
                      ...T.micro, padding: '0.1rem 0.4rem', borderRadius: '4px',
                      background: B.goldDim, color: B.gold, fontWeight: 800,
                    }}>{convergences.length}</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {convergences.length === 0 && (
                    <span style={{ ...T.micro, color: B.textMuted }}>No convergence detected</span>
                  )}
                  {showConvergence
                    ? <ChevronUp size={14} color={B.gold} />
                    : <ChevronDown size={14} color={B.gold} />}
                </div>
              </button>
              {showConvergence && convergences.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.625rem' }}>
                  {convergences.map((c, ci) => (
                    <div key={ci} style={{
                      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                      border: `1px solid ${B.goldBorder}`, borderRadius: '12px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)`,
                      }} />
                      <div style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              ...T.micro, padding: '0.2rem 0.5rem', borderRadius: '5px',
                              background: (SPORT_COLORS[c.sport] || B.gold) + '18',
                              color: SPORT_COLORS[c.sport] || B.gold, fontWeight: 700,
                              border: `1px solid ${(SPORT_COLORS[c.sport] || B.gold)}30`,
                            }}>{sportIcons[c.sport] || ''} {c.sport}</span>
                            <span style={{ ...T.body, color: B.text, fontWeight: 700 }}>
                              {c.away} <span style={{ color: B.textMuted, fontWeight: 400 }}>vs</span> {c.home}
                            </span>
                          </div>
                          <span style={{
                            ...T.micro, padding: '0.2rem 0.6rem', borderRadius: '6px',
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                            color: B.gold, fontWeight: 800, letterSpacing: '0.04em',
                            border: `1px solid ${B.goldBorder}`,
                          }}>
                            {c.sharps.length} ALIGNED
                          </span>
                        </div>
                        <div style={{ ...T.sub, color: B.text, marginBottom: '0.625rem', fontWeight: 700 }}>
                          {c.sharps.length} specialists on <span style={{ color: B.gold }}>{c.team}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          {c.sharps.map((sh, si) => (
                            <div key={si} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '0.375rem 0.5rem', borderRadius: '6px',
                              background: 'rgba(255,255,255,0.02)',
                            }}>
                              <span style={{ ...T.label, color: B.textSec, fontWeight: 600 }}>{sh.name}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <span style={{ ...T.micro, color: B.green, fontWeight: 700, fontFeatureSettings: "'tnum'" }}>
                                  +{fmtVol(sh.sportPnl)} sports
                                </span>
                                <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                                  {fmtVol(sh.invested)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Today's Action Feed ─── */}
            {(() => {
              const actionSortFns = {
                size: (a, b) => (b.invested || 0) - (a.invested || 0),
                roi: (a, b) => (b.displayRoi || 0) - (a.displayRoi || 0),
                conviction: (a, b) => (b.betMultiplier || 0) - (a.betMultiplier || 0),
              };
              // HC priority — premium HC +2+ pins first, HC +1 next, everything
              // else last. Within each tier we fall back to the chosen sort mode.
              // HC_FADE (HC margin ≤ −1) is intentionally NOT pinned — those are
              // positions where proven HC sharps are betting the OTHER side.
              const hcRank = (p) => {
                if (p.vault_hcTier === 'HC_DOMINANT') return 0;
                if (p.vault_hcTier === 'HC_STANDARD') return 1;
                return 2;
              };
              const now = Date.now();
              const MAX_GAME_MS = 6 * 60 * 60 * 1000;
              const enriched = (actionPositions || []).map(p => {
                const ct = polyData?.[p.sport]?.[p.gameKey]?.commence
                  ? new Date(polyData[p.sport][p.gameKey].commence).getTime()
                  : pinnacleHistory?.[p.sport]?.[p.gameKey]?.commence
                    ? new Date(pinnacleHistory[p.sport][p.gameKey].commence).getTime()
                    : null;
                const isLive = ct && now >= ct && (now - ct) < MAX_GAME_MS;
                return { ...p, _commenceTime: ct, _isLive: !!isLive };
              });

              const pregameCount = enriched.filter(p => !p._isLive).length;
              const liveCount = enriched.filter(p => p._isLive).length;
              const hcDomCount = enriched.filter(p => p.vault_hcTier === 'HC_DOMINANT').length;
              const hcStdCount = enriched.filter(p => p.vault_hcTier === 'HC_STANDARD').length;

              let filtered = [...enriched];
              if (actionStatusFilter === 'PREGAME') filtered = filtered.filter(p => !p._isLive);
              else if (actionStatusFilter === 'LIVE') filtered = filtered.filter(p => p._isLive);
              if (actionSportFilter !== 'ALL') filtered = filtered.filter(p => p.sport === actionSportFilter);
              if (actionMarketFilter !== 'ALL') filtered = filtered.filter(p => p.marketType === actionMarketFilter);
              const baseSort = actionSortFns[actionSortMode] || actionSortFns.size;
              // HC tier ALWAYS dominates user-selected sort — premium signal
              // wins over size / ROI / conviction. Within tier: chosen mode.
              const sorted = filtered.sort((a, b) => {
                const r = hcRank(a) - hcRank(b);
                return r !== 0 ? r : baseSort(a, b);
              });

              const sportCounts = {};
              const mktCounts = {};
              for (const ap of enriched) {
                if (actionStatusFilter === 'PREGAME' && ap._isLive) continue;
                if (actionStatusFilter === 'LIVE' && !ap._isLive) continue;
                sportCounts[ap.sport] = (sportCounts[ap.sport] || 0) + 1;
                mktCounts[ap.marketType] = (mktCounts[ap.marketType] || 0) + 1;
              }

              const MKT_STYLE = {
                ML: { color: B.green, bg: B.greenDim, border: `${B.green}44` },
                SPREAD: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.44)' },
                TOTAL: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.44)' },
              };

              return (
                <div style={{ marginBottom: '1.5rem' }}>
                  {/* Header + Sort */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.green }} />
                      <span style={{ ...T.label, color: B.green, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Today's Action
                      </span>
                      {sorted.length > 0 && (
                        <span style={{
                          ...T.micro, padding: '0.1rem 0.4rem', borderRadius: '4px',
                          background: B.greenDim, color: B.green, fontWeight: 800,
                        }}>{sorted.length}</span>
                      )}
                      {/* Premium HC tier counters — surfaced inline so users
                          immediately know whether the Vault has any HC +1 / +2
                          plays today. Auto-pinned to the front of the feed. */}
                      {hcDomCount > 0 && (
                        <span title="Positions on a side with proven HC margin ≥ +2 — strongest signal we've validated; auto-pinned to top" style={{
                          ...T.micro, padding: '0.1rem 0.45rem', borderRadius: '4px',
                          color: '#1a1a1a',
                          background: `linear-gradient(135deg, ${B.gold} 0%, #F5D77B 100%)`,
                          border: `1px solid ${B.gold}`,
                          boxShadow: '0 0 8px rgba(212,175,55,0.35)',
                          fontWeight: 900, letterSpacing: '0.04em',
                        }}>★★ HC +2 · {hcDomCount}</span>
                      )}
                      {hcStdCount > 0 && (
                        <span title="Positions on a side with proven HC margin = +1 — auto-pinned after HC +2 plays" style={{
                          ...T.micro, padding: '0.1rem 0.45rem', borderRadius: '4px',
                          color: B.gold, background: 'rgba(212,175,55,0.14)',
                          border: `1px solid ${B.gold}66`,
                          fontWeight: 800, letterSpacing: '0.04em',
                        }}>★ HC +1 · {hcStdCount}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {[
                        { id: 'size', label: 'Size' },
                        { id: 'roi', label: 'ROI' },
                        { id: 'conviction', label: 'Conviction' },
                      ].map(sm => (
                        <button key={sm.id} onClick={() => setActionSortMode(sm.id)} style={{
                          padding: '0.25rem 0.55rem', borderRadius: '5px', cursor: 'pointer',
                          ...T.micro, fontWeight: 700, fontSize: '0.55rem',
                          border: actionSortMode === sm.id ? `1px solid ${B.green}44` : `1px solid ${B.border}`,
                          background: actionSortMode === sm.id ? `${B.green}18` : 'transparent',
                          color: actionSortMode === sm.id ? B.green : B.textMuted,
                          transition: 'all 0.2s ease',
                        }}>{sm.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Status + Sport + Market Filters */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    {[
                      { id: 'PREGAME', label: 'Pregame', cnt: pregameCount, color: B.green },
                      { id: 'LIVE', label: 'Live', cnt: liveCount, color: '#EF4444' },
                      { id: 'ALL', label: 'All', cnt: enriched.length, color: B.textSec },
                    ].map(sf => (
                      <button key={sf.id} onClick={() => setActionStatusFilter(sf.id)} style={{
                        padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
                        ...T.micro, fontWeight: 700, fontSize: '0.55rem',
                        border: actionStatusFilter === sf.id ? `1px solid ${sf.color}44` : `1px solid ${B.border}`,
                        background: actionStatusFilter === sf.id ? `${sf.color}18` : 'transparent',
                        color: actionStatusFilter === sf.id ? sf.color : B.textMuted,
                        transition: 'all 0.2s ease',
                      }}>{sf.label} <span style={{ opacity: 0.6 }}>({sf.cnt})</span></button>
                    ))}
                    <div style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.15rem' }} />
                    {['ALL', 'NBA', 'NHL', 'MLB', 'CBB', 'NFL', 'SOC'].map(sp => {
                      const statusFiltered = enriched.filter(p => actionStatusFilter === 'PREGAME' ? !p._isLive : actionStatusFilter === 'LIVE' ? p._isLive : true);
                      const cnt = sp === 'ALL' ? statusFiltered.length : (sportCounts[sp] || 0);
                      if (sp !== 'ALL' && cnt === 0) return null;
                      const sc = SPORT_COLORS[sp] || B.green;
                      const isActive = actionSportFilter === sp;
                      return (
                        <button key={sp} onClick={() => setActionSportFilter(sp)} style={{
                          padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
                          ...T.micro, fontWeight: 700, fontSize: '0.55rem',
                          border: isActive ? `1px solid ${sc}44` : `1px solid ${B.border}`,
                          background: isActive ? `${sc}18` : 'transparent',
                          color: isActive ? sc : B.textMuted,
                          transition: 'all 0.2s ease',
                        }}>{sp} <span style={{ opacity: 0.6 }}>({cnt})</span></button>
                      );
                    })}
                    <div style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.15rem' }} />
                    {['ALL', 'ML', 'SPREAD', 'TOTAL'].map(mk => {
                      const statusFiltered = enriched.filter(p => actionStatusFilter === 'PREGAME' ? !p._isLive : actionStatusFilter === 'LIVE' ? p._isLive : true);
                      const cnt = mk === 'ALL' ? statusFiltered.length : (mktCounts[mk] || 0);
                      if (mk !== 'ALL' && cnt === 0) return null;
                      const ms = MKT_STYLE[mk] || { color: B.green, bg: B.greenDim, border: `${B.green}44` };
                      const isActive = actionMarketFilter === mk;
                      return (
                        <button key={mk} onClick={() => setActionMarketFilter(mk)} style={{
                          padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
                          ...T.micro, fontWeight: 700, fontSize: '0.55rem',
                          border: isActive ? `1px solid ${ms.border}` : `1px solid ${B.border}`,
                          background: isActive ? ms.bg : 'transparent',
                          color: isActive ? ms.color : B.textMuted,
                          transition: 'all 0.2s ease',
                        }}>{mk} <span style={{ opacity: 0.6 }}>({cnt})</span></button>
                      );
                    })}
                  </div>

                  {sorted.length === 0 ? (
                    <div style={{
                      textAlign: 'center', padding: '1.5rem', borderRadius: '12px',
                      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                      border: `1px solid ${B.border}`,
                    }}>
                      <Activity size={16} color={B.textMuted} style={{ marginBottom: '0.375rem', opacity: 0.5 }} />
                      <div style={{ ...T.label, color: B.textMuted }}>No meaningful sharp action detected today</div>
                      <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.25rem' }}>Showing positions at 0.75x average bet size or higher</div>
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : sorted.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                      gap: '0.75rem',
                    }}>
                      {sorted.map((p, idx) => {
                        const cardKey = `${p.wallet}_${p.gameKey}_${p.marketType}_${p.side}`;
                        const isExpanded = expandedActionCard === cardKey;
                        const tc = p.tier === 'ELITE'
                          ? { color: B.gold, bg: B.goldDim, accent: B.gold }
                          : p.tier === 'PROVEN'
                            ? { color: B.green, bg: B.greenDim, accent: B.green }
                            : { color: B.green, bg: B.greenDim, accent: B.green };
                        const rankGroup = groupedSportsRankLabel(p.leaderboardRank);
                        const ss = sportStyle(p.sport);
                        const posColor = (p.pnl || 0) >= 0 ? B.green : B.red;
                        const pnlColor = (p.totalPnl || 0) >= 0 ? B.green : B.red;
                        const timeDiff = p.firstSeen ? now - new Date(p.firstSeen).getTime() : 0;
                        const timeLabel = timeDiff > 0
                          ? timeDiff < 3600000 ? `${Math.round(timeDiff / 60000)}m ago`
                            : timeDiff < 86400000 ? `${Math.round(timeDiff / 3600000)}h ago`
                            : `${Math.round(timeDiff / 86400000)}d ago`
                          : '';

                        const pinnGame = pinnacleHistory?.[p.sport]?.[p.gameKey];
                        const commenceTime = pinnGame?.commence ? new Date(pinnGame.commence).getTime() : null;
                        const isLocked = commenceTime && now >= commenceTime;

                        let pinnOdds = null, bestRetail = null, bestBook = null, evEdge = null, allBooks = {}, spreadLine = null, totalLine = null;
                        if (pinnGame) {
                          if (p.marketType === 'ML') {
                            // 3-way aware: a soccer draw reads the draw line, not the home fallback.
                            pinnOdds = p.side === 'away' ? pinnGame.current?.away : p.side === 'draw' ? pinnGame.current?.draw : pinnGame.current?.home;
                            bestRetail = p.side === 'away' ? pinnGame.bestAway : p.side === 'draw' ? pinnGame.bestDraw : pinnGame.bestHome;
                            bestBook = p.side === 'away' ? pinnGame.bestAwayBook : p.side === 'draw' ? pinnGame.bestDrawBook : pinnGame.bestHomeBook;
                            allBooks = pinnGame.allBooks || {};
                          } else if (p.marketType === 'SPREAD') {
                            pinnOdds = p.side === 'away' ? pinnGame.spreadCurrent?.awayOdds : pinnGame.spreadCurrent?.homeOdds;
                            spreadLine = p.side === 'away' ? pinnGame.spreadCurrent?.awayLine : pinnGame.spreadCurrent?.homeLine;
                            bestRetail = p.side === 'away' ? pinnGame.bestAwaySpread?.odds : pinnGame.bestHomeSpread?.odds;
                            bestBook = p.side === 'away' ? pinnGame.bestAwaySpread?.book : pinnGame.bestHomeSpread?.book;
                          } else {
                            pinnOdds = p.side === 'over' ? pinnGame.totalCurrent?.overOdds : pinnGame.totalCurrent?.underOdds;
                            totalLine = pinnGame.totalCurrent?.line;
                            bestRetail = p.side === 'over' ? pinnGame.bestOverTotal?.odds : pinnGame.bestUnderTotal?.odds;
                            bestBook = p.side === 'over' ? pinnGame.bestOverTotal?.book : pinnGame.bestUnderTotal?.book;
                          }
                          if (!isLocked) {
                            const pinnProb = impliedProb(pinnOdds);
                            const retailProb = impliedProb(bestRetail);
                            evEdge = (pinnProb && retailProb) ? +((pinnProb - retailProb) * 100).toFixed(1) : null;
                          }
                        }
                        const hasEV = !isLocked && evEdge != null && evEdge > 0;
                        const sharpEntryOdds = probToAmerican(p.avgPrice);

                        const mktLabel = p.marketType === 'SPREAD' ? 'Spread' : p.marketType === 'TOTAL' ? 'Total' : 'ML';
                        const displayLine = spreadLine != null ? spreadLine : p.entryLine;
                        const lineStr = p.marketType === 'SPREAD' && displayLine != null ? ` ${displayLine > 0 ? '+' : ''}${displayLine}` : '';
                        const totalDisplayLine = totalLine != null ? totalLine : p.entryLine;
                        const totalStr = p.marketType === 'TOTAL' && totalDisplayLine != null ? ` ${totalDisplayLine}` : '';
                        const teamDisplay = `${p.teamName}${lineStr}${totalStr}`;
                        const isHighConviction = p.betMultiplier >= 3;
                        // Vault HC Margin tier — overrides HIGH CONVICTION /
                        // SHARP POSITION when present. HC_DOMINANT (margin ≥ +2)
                        // gets premium platinum-gold treatment with glow ring;
                        // HC_STANDARD (margin = +1) gets a gold outline. See
                        // computeVaultHcSignals() for the full classification.
                        const isHcDominant = p.vault_hcTier === 'HC_DOMINANT';
                        const isHcStandard = p.vault_hcTier === 'HC_STANDARD';
                        const isHcFade = p.vault_hcTier === 'HC_FADE';
                        const isHcTier = isHcDominant || isHcStandard;
                        const boxAccentColor = isHcTier ? B.gold : hasEV ? B.green : isHighConviction ? B.gold : tc.accent;
                        const boxBg = isHcDominant
                          ? 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.04) 100%)'
                          : isHcStandard
                            ? 'linear-gradient(135deg, rgba(212,175,55,0.11) 0%, rgba(212,175,55,0.02) 100%)'
                            : hasEV
                              ? 'linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.02) 100%)'
                              : isHighConviction
                                ? 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)'
                                : `linear-gradient(135deg, ${tc.bg} 0%, rgba(255,255,255,0.01) 100%)`;
                        const boxBorder = isHcDominant
                          ? 'rgba(212,175,55,0.55)'
                          : isHcStandard
                            ? 'rgba(212,175,55,0.35)'
                            : hasEV ? 'rgba(16,185,129,0.25)' : isHighConviction ? 'rgba(212,175,55,0.2)' : B.borderSubtle;
                        const hcMarginNum = p.vault_hcMargin ?? 0;
                        const boxLabel = isHcDominant
                          ? `PROVEN HC +${hcMarginNum}`
                          : isHcStandard
                            ? 'PROVEN HC +1'
                            : hasEV ? 'EV OPPORTUNITY' : isHighConviction ? 'HIGH CONVICTION' : 'SHARP POSITION';

                        const pinnConfirmsPlay = (() => {
                          if (!pinnGame) return false;
                          const hist = p.marketType === 'ML' ? (pinnGame.history || []) : p.marketType === 'SPREAD' ? (pinnGame.spreadHistory || []) : (pinnGame.totalHistory || []);
                          if (hist.length < 2) return false;
                          const getOdds = (h) => p.marketType === 'ML' ? (p.side === 'away' ? h.away : p.side === 'draw' ? h.draw : h.home) : p.marketType === 'SPREAD' ? (p.side === 'away' ? h.awayOdds : h.homeOdds) : (p.side === 'over' ? h.overOdds : h.underOdds);
                          const openOdds = getOdds(hist[0]);
                          const curOdds = getOdds(hist[hist.length - 1]);
                          if (!openOdds || !curOdds) return false;
                          return impliedProb(curOdds) > impliedProb(openOdds);
                        })();

                        // Card-level premium treatment for HC tiers — gold
                        // outline + soft glow ring around the entire card so
                        // these positions are unmistakable in a long feed.
                        const cardBorder = isHcDominant
                          ? '1.5px solid rgba(212,175,55,0.60)'
                          : isHcStandard
                            ? '1px solid rgba(212,175,55,0.40)'
                            : `1px solid ${isLocked ? 'rgba(99,102,241,0.35)' : hasEV ? `${B.green}35` : B.borderSubtle}`;
                        const cardBoxShadow = isHcDominant
                          ? '0 0 24px rgba(212,175,55,0.20), inset 0 0 0 1px rgba(212,175,55,0.25)'
                          : isHcStandard
                            ? '0 0 12px rgba(212,175,55,0.12)'
                            : 'none';
                        const topAccentBar = isHcTier
                          ? `linear-gradient(90deg, transparent 0%, ${B.gold}cc 25%, ${B.gold} 50%, ${B.gold}cc 75%, transparent 100%)`
                          : isLocked
                            ? 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 30%, rgba(99,102,241,0.9) 50%, rgba(99,102,241,0.5) 70%, transparent 100%)'
                            : `linear-gradient(90deg, transparent 0%, ${boxAccentColor}88 30%, ${boxAccentColor} 50%, ${boxAccentColor}88 70%, transparent 100%)`;

                        return (
                          <div key={`${cardKey}_${idx}`} style={{
                            borderRadius: '14px', overflow: 'hidden',
                            background: `linear-gradient(145deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                            border: cardBorder,
                            boxShadow: cardBoxShadow,
                            transition: 'box-shadow 0.3s ease',
                          }}>
                            <div style={{
                              height: isHcDominant ? '4px' : '3px',
                              background: topAccentBar,
                            }} />

                            {/* ── Header: Matchup + Sport + Badges ── */}
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '0.75rem 1rem 0.5rem', flexWrap: 'wrap', gap: '0.35rem',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                                <Badge color={ss.color} bg={ss.bg}>{ss.icon} {p.sport}</Badge>
                                <span style={{ ...T.body, fontWeight: 700, color: B.text }}>
                                  {p.away} <span style={{ color: B.textMuted, fontWeight: 400 }}>vs</span> {p.home}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                {/* PROVEN HC chip — premium gold marker for
                                    positions on a side with HC margin ≥ +1.
                                    Strongest single edge we've validated. */}
                                {isHcDominant && (
                                  <span title={`${p.vault_hcConfFor} proven CONFIRMED-tier whales sized 1.5×+ on this side, ${p.vault_hcConfAg} on the other`} style={{
                                    ...T.micro, fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '5px',
                                    color: '#1a1a1a',
                                    background: `linear-gradient(135deg, ${B.gold} 0%, #F5D77B 100%)`,
                                    border: `1px solid ${B.gold}`,
                                    boxShadow: '0 0 10px rgba(212,175,55,0.45)',
                                    letterSpacing: '0.04em', textTransform: 'uppercase',
                                    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                                  }}>★★ HC +{hcMarginNum}</span>
                                )}
                                {isHcStandard && (
                                  <span title={`${p.vault_hcConfFor} proven CONFIRMED-tier whale sized 1.5×+ on this side, 0 on the other`} style={{
                                    ...T.micro, fontWeight: 800, padding: '0.18rem 0.5rem', borderRadius: '5px',
                                    color: B.gold, background: 'rgba(212,175,55,0.14)',
                                    border: `1px solid ${B.gold}66`,
                                    letterSpacing: '0.04em', textTransform: 'uppercase',
                                    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                                  }}>★ HC +1</span>
                                )}
                                {isHcFade && (
                                  <span title={`${p.vault_hcConfAg} proven HC sharp${p.vault_hcConfAg !== 1 ? 's' : ''} on the other side — fade flag`} style={{
                                    ...T.micro, fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '5px',
                                    color: B.red, background: 'rgba(239,68,68,0.10)',
                                    border: '1px solid rgba(239,68,68,0.30)',
                                    letterSpacing: '0.04em', textTransform: 'uppercase',
                                  }}>HC FADE {p.vault_hcMargin}</span>
                                )}
                                <Badge color={tc.color} bg={tc.bg}>{p.tier}</Badge>
                                {rankGroup && (
                                  <span style={{
                                    ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '5px',
                                    background: 'rgba(34,211,238,0.08)', color: '#22D3EE',
                                    border: '1px solid rgba(34,211,238,0.2)', fontWeight: 700,
                                  }}>{rankGroup}</span>
                                )}
                                <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'", opacity: 0.6 }}>
                                  ...{p.wallet.slice(-4)}
                                </span>
                                {isLocked && (
                                  <span style={{
                                    ...T.micro, fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '5px',
                                    color: '#818CF8', background: 'rgba(99,102,241,0.12)',
                                    border: '1px solid rgba(99,102,241,0.25)', letterSpacing: '0.04em',
                                  }}>🔒 LOCKED</span>
                                )}
                                {timeLabel && !isLocked && (
                                  <span style={{
                                    ...T.micro, fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '5px',
                                    fontFeatureSettings: "'tnum'", color: B.textSec, background: 'rgba(255,255,255,0.04)',
                                  }}>{timeLabel}</span>
                                )}
                              </div>
                            </div>

                            {/* ── Hero Section ── */}
                            <div style={{
                              margin: '0 0.75rem', padding: '0.75rem',
                              borderRadius: '10px',
                              background: boxBg,
                              border: `1px solid ${boxBorder}`,
                            }}>
                              {/* Label row */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ ...T.label, fontWeight: 800, color: boxAccentColor, letterSpacing: '0.03em' }}>
                                  {boxLabel}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                  {hasEV && (
                                    <span style={{
                                      ...T.body, fontWeight: 900, color: B.green,
                                      padding: '0.2rem 0.6rem', borderRadius: '5px',
                                      background: B.greenDim, fontFeatureSettings: "'tnum'",
                                    }}>+{evEdge}% EV</span>
                                  )}
                                  {p.betMultiplier >= 1.5 && (
                                    <span style={{
                                      ...T.micro, fontWeight: 800, color: B.gold,
                                      padding: '0.2rem 0.5rem', borderRadius: '5px',
                                      background: B.goldDim, fontFeatureSettings: "'tnum'",
                                    }}>{p.betMultiplier.toFixed(1)}x avg</span>
                                  )}
                                </div>
                              </div>

                              {/* Hero: Invested + Team/Price */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 900, fontSize: '1.5rem', color: B.gold, fontFeatureSettings: "'tnum'", lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                                      {fmtVol(p.invested)}
                                    </span>
                                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 600 }}>on</span>
                                  </div>
                                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: B.text, lineHeight: 1.2, marginTop: '0.2rem' }}>
                                    {teamDisplay} {mktLabel}
                                  </div>
                                </div>
                                {(sharpEntryOdds || pinnOdds) && (
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.1rem', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.5rem', fontWeight: 600 }}>
                                      {sharpEntryOdds ? 'BET AT' : 'FAIR VALUE'}
                                    </div>
                                    <div style={{
                                      fontWeight: 900, fontSize: '1.35rem', lineHeight: 1.1,
                                      color: sharpEntryOdds ? B.green : B.text,
                                      fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em',
                                    }}>
                                      {fmtOdds(sharpEntryOdds || pinnOdds)}
                                    </div>
                                    <div style={{ ...T.micro, color: B.textSec, marginTop: '0.1rem', fontWeight: 600 }}>
                                      {sharpEntryOdds ? 'Sharp Entry' : 'Pinnacle'}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Stats line */}
                              <div style={{ ...T.micro, color: B.textSec, marginTop: '0.4rem', lineHeight: 1.5, fontFeatureSettings: "'tnum'" }}>
                                {p.betMultiplier >= 1.5 && <><span style={{ color: B.gold, fontWeight: 700 }}>{p.betMultiplier.toFixed(1)}x</span> avg bet · </>}<span style={{ color: p.displayRoi > 0 ? B.green : p.displayRoi < 0 ? B.red : B.textSec, fontWeight: 700 }}>{p.displayRoi > 0 ? '+' : ''}{p.displayRoi.toFixed(1)}%</span> ROI{(p.totalPnl || 0) > 0 && <> · <span style={{ color: B.green, fontWeight: 700 }}>+{fmtVol(p.totalPnl)}</span> lifetime</>}{pinnOdds && <> · Fair {fmtOdds(pinnOdds)} ({(impliedProb(pinnOdds) * 100).toFixed(1)}%)</>}
                              </div>

                              {/* Signal chips */}
                              <div
                                onClick={(e) => { e.stopPropagation(); setExpandedActionCard(isExpanded ? null : cardKey); }}
                                style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem', paddingTop: '0.45rem', borderTop: `1px solid ${boxBorder}`, cursor: 'pointer' }}
                              >
                                {pinnConfirmsPlay && (
                                  <span style={{ ...T.micro, padding: '0.2rem 0.5rem', borderRadius: '5px', fontWeight: 700, color: B.green, background: B.greenDim }}>
                                    ✓ Pinnacle Confirms
                                  </span>
                                )}
                                {hasEV && (
                                  <span style={{ ...T.micro, padding: '0.2rem 0.5rem', borderRadius: '5px', fontWeight: 800, color: B.green, background: B.greenDim, fontFeatureSettings: "'tnum'" }}>
                                    +{evEdge}% EV Edge
                                  </span>
                                )}
                                {(p.pnl || 0) !== 0 && (
                                  <span style={{ ...T.micro, padding: '0.2rem 0.5rem', borderRadius: '5px', fontWeight: 700, fontFeatureSettings: "'tnum'", background: posColor === B.green ? B.greenDim : B.redDim, color: posColor }}>
                                    P&L: {p.pnl >= 0 ? '+' : ''}{fmtVol(p.pnl)}
                                  </span>
                                )}
                                <span style={{ ...T.micro, padding: '0.2rem 0.5rem', borderRadius: '5px', fontWeight: 600, background: 'rgba(255,255,255,0.04)', color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                                  @ {Math.round(p.avgPrice * 100)}¢
                                </span>
                              </div>
                            </div>

                            {/* ── Footer: Lifetime P&L + expand ── */}
                            <div
                              onClick={() => setExpandedActionCard(isExpanded ? null : cardKey)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.5rem 0.75rem 0.75rem',
                                marginTop: '0.35rem',
                                cursor: 'pointer',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {p.totalPnl != null && p.totalPnl !== 0 && (
                                  <span style={{
                                    ...T.micro, fontWeight: 700, color: pnlColor, fontFeatureSettings: "'tnum'",
                                  }}>
                                    {p.totalPnl >= 0 ? '+' : ''}{fmtVol(p.totalPnl)} lifetime sports P&L
                                  </span>
                                )}
                              </div>
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.25rem',
                                ...T.micro, color: B.textMuted, fontSize: '0.6rem',
                              }}>
                                <span>{isExpanded ? 'Less' : 'Details'}</span>
                                <ChevronDown size={11} color={B.textMuted} style={{
                                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                                  transition: 'transform 0.2s ease',
                                }} />
                              </div>
                            </div>

                            {/* ─── Expanded: Chart + Book Prices + Pinnacle + EV ─── */}
                            {isExpanded && pinnGame && (
                              <div style={{
                                padding: '0 0.875rem 0.75rem',
                                borderTop: `1px solid ${B.borderSubtle}`,
                              }}>
                                {/* ─── Pinnacle Timeline Chart ─── */}
                                {(() => {
                                  const hist = p.marketType === 'ML'
                                    ? (pinnGame.history || [])
                                    : p.marketType === 'SPREAD'
                                      ? (pinnGame.spreadHistory || [])
                                      : (pinnGame.totalHistory || []);
                                  if (hist.length < 2) return null;

                                  const getOdds = (h) => {
                                    if (p.marketType === 'ML') return p.side === 'away' ? h.away : p.side === 'draw' ? h.draw : h.home;
                                    if (p.marketType === 'SPREAD') return p.side === 'away' ? h.awayOdds : h.homeOdds;
                                    return p.side === 'over' ? h.overOdds : h.underOdds;
                                  };
                                  const getLine = (h) => {
                                    if (p.marketType === 'SPREAD') return p.side === 'away' ? h.awayLine : h.homeLine;
                                    if (p.marketType === 'TOTAL') return h.line;
                                    return null;
                                  };

                                  const polyGame = polyData?.[p.sport]?.[p.gameKey];
                                  const allWhaleTrades = polyGame?.whales?.topTrades || [];
                                  const whaleTrades = allWhaleTrades.filter(w => {
                                    const tradeSide = resolveOutcomeSide(w.outcome, p.away, p.home);
                                    const sharpSide = p.side;
                                    if (w.side === 'BUY') return tradeSide === sharpSide;
                                    return tradeSide !== sharpSide;
                                  });

                                  const allGamePositions = [];
                                  const posSource = p.marketType === 'ML' ? sharpPositions : p.marketType === 'SPREAD' ? spreadPositions : totalPositions;
                                  const gameData = posSource?.[p.sport]?.[p.gameKey];
                                  if (gameData?.positions) {
                                    for (const pos of gameData.positions) {
                                      if (pos.firstSeen && pos.wallet?.toLowerCase() === p.wallet?.toLowerCase()) {
                                        allGamePositions.push({
                                          ts: new Date(pos.firstSeen).getTime(),
                                          invested: pos.invested || 0,
                                          wallet: pos.wallet,
                                          side: pos.side,
                                          isCurrentWallet: true,
                                        });
                                      }
                                    }
                                  }

                                  const pinnTMin = hist[0].t * 1000;
                                  const pinnTMax = hist[hist.length - 1].t * 1000;

                                  const allTimestamps = [pinnTMin, pinnTMax];
                                  for (const w of whaleTrades) { if (w.ts) allTimestamps.push(w.ts); }
                                  for (const sp of allGamePositions) { if (sp.ts) allTimestamps.push(sp.ts); }
                                  const tMin = Math.min(...allTimestamps);
                                  const tMax = Math.max(...allTimestamps);

                                  const openOdds = getOdds(hist[0]);
                                  const openProb = impliedProb(openOdds);
                                  const openProbPct = openProb ? +(openProb * 100).toFixed(1) : null;

                                  const prePinnTrades = whaleTrades.filter(w => (w.ts || 0) < pinnTMin);
                                  const prePoints = [];
                                  if (tMin < pinnTMin) {
                                    const preBucketSize = Math.max((pinnTMin - tMin) / Math.max(prePinnTrades.length, 3), 600000);
                                    const preBuckets = {};
                                    for (const w of prePinnTrades) {
                                      const bi = Math.floor((w.ts - tMin) / preBucketSize);
                                      preBuckets[bi] = (preBuckets[bi] || 0) + (w.amount || 0);
                                    }
                                    const preSlots = new Set([0, ...Object.keys(preBuckets).map(Number)]);
                                    for (const bi of [...preSlots].sort((a, b) => a - b)) {
                                      const ts = tMin + bi * preBucketSize;
                                      prePoints.push({
                                        ts, odds: openOdds, prob: openProbPct,
                                        line: getLine(hist[0]),
                                        vol: preBuckets[bi] || 0,
                                        label: new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                                      });
                                    }
                                  }

                                  const pinnPoints = hist.map((h) => {
                                    const ts = h.t * 1000;
                                    const odds = getOdds(h);
                                    const prob = impliedProb(odds);
                                    return {
                                      ts, odds,
                                      prob: prob ? +(prob * 100).toFixed(1) : null,
                                      line: getLine(h),
                                      vol: 0,
                                      label: new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                                    };
                                  });

                                  for (const w of whaleTrades) {
                                    const wTs = w.ts || 0;
                                    if (wTs >= pinnTMin) {
                                      let closest = 0;
                                      let closestDist = Infinity;
                                      for (let i = 0; i < pinnPoints.length; i++) {
                                        const dist = Math.abs(pinnPoints[i].ts - wTs);
                                        if (dist < closestDist) { closestDist = dist; closest = i; }
                                      }
                                      pinnPoints[closest].vol += w.amount || 0;
                                    }
                                  }

                                  const chartData = [...prePoints, ...pinnPoints];
                                  const maxVol = Math.max(...chartData.map(d => d.vol), 1);

                                  const sharpMarkers = allGamePositions;

                                  const probMin = Math.min(...chartData.filter(d => d.prob != null).map(d => d.prob));
                                  const probMax = Math.max(...chartData.filter(d => d.prob != null).map(d => d.prob));
                                  const probPad = Math.max((probMax - probMin) * 0.15, 2);

                                  const CustomTooltip = ({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0]?.payload;
                                    if (!d) return null;
                                    return (
                                      <div style={{
                                        background: B.card, border: `1px solid ${B.border}`, borderRadius: '8px',
                                        padding: '0.4rem 0.6rem', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                      }}>
                                        <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.15rem' }}>{d.label}</div>
                                        <div style={{ ...T.micro, fontWeight: 800, color: B.gold, fontFeatureSettings: "'tnum'" }}>
                                          {fmtOdds(d.odds)} ({d.prob}%)
                                        </div>
                                        {d.line != null && (
                                          <div style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                                            Line: {d.line > 0 ? '+' : ''}{d.line}
                                          </div>
                                        )}
                                        {d.vol > 0 && (
                                          <div style={{ ...T.micro, color: '#22D3EE', fontFeatureSettings: "'tnum'" }}>
                                            Vol: {fmtVol(d.vol)}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  };

                                  return (
                                    <div style={{
                                      marginTop: '0.625rem', borderRadius: '8px',
                                      background: 'rgba(255,255,255,0.02)',
                                      border: `1px solid ${B.borderSubtle}`,
                                      overflow: 'hidden',
                                    }}>
                                      <div style={{
                                        padding: '0.4rem 0.625rem',
                                        borderBottom: `1px solid ${B.borderSubtle}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                      }}>
                                        <span style={{ ...T.micro, color: B.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                          Price Movement — {p.teamName} {mktLabel}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <div style={{ width: 8, height: 2, background: B.gold, borderRadius: 1 }} />
                                            <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.5rem' }}>Pinnacle</span>
                                          </div>
                                          {whaleTrades.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                              <div style={{ width: 6, height: 6, background: 'rgba(34,211,238,0.35)', borderRadius: 1 }} />
                                              <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.5rem' }}>Volume</span>
                                            </div>
                                          )}
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <div style={{ width: 6, height: 6, background: B.green, borderRadius: '50%' }} />
                                            <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.5rem' }}>Sharp Entry</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div style={{ padding: '0.25rem 0.25rem 0 0.25rem' }}>
                                        <ResponsiveContainer width="100%" height={150}>
                                          <ComposedChart data={chartData} margin={{ top: 12, right: 8, bottom: 0, left: 4 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={B.borderSubtle} vertical={false} />
                                            <XAxis
                                              dataKey="label" tick={{ fill: B.textMuted, fontSize: 9 }}
                                              axisLine={{ stroke: B.borderSubtle }} tickLine={false}
                                              interval={Math.max(0, Math.floor(chartData.length / 5) - 1)}
                                            />
                                            <YAxis
                                              yAxisId="prob" domain={[Math.floor(probMin - probPad), Math.ceil(probMax + probPad)]}
                                              tick={{ fill: B.gold, fontSize: 9, fontWeight: 700 }}
                                              axisLine={false} tickLine={false} width={32}
                                              tickFormatter={v => `${v}%`}
                                            />
                                            <YAxis
                                              yAxisId="vol" orientation="right" hide
                                              domain={[0, maxVol * 3]}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar yAxisId="vol" dataKey="vol" radius={[2, 2, 0, 0]} maxBarSize={12}>
                                              {chartData.map((d, i) => (
                                                <Cell key={i} fill={d.vol > 0 ? 'rgba(34,211,238,0.25)' : 'transparent'} />
                                              ))}
                                            </Bar>
                                            <Line
                                              yAxisId="prob" type="monotone" dataKey="prob"
                                              stroke={B.gold} strokeWidth={2} dot={false}
                                              activeDot={{ r: 3, fill: B.gold, stroke: B.card, strokeWidth: 2 }}
                                            />
                                            {sharpMarkers.map((sm, si) => {
                                              const closest = chartData.reduce((best, d) =>
                                                Math.abs(d.ts - sm.ts) < Math.abs(best.ts - sm.ts) ? d : best
                                              , chartData[0]);
                                              if (!closest || closest.prob == null) return null;
                                              const dotSize = Math.max(4, Math.min(10, Math.sqrt(sm.invested / 1000) * 2));
                                              return (
                                                <ReferenceDot
                                                  key={si} yAxisId="prob"
                                                  x={closest.label} y={closest.prob}
                                                  r={dotSize}
                                                  fill={sm.isCurrentWallet ? B.green : 'rgba(16,185,129,0.5)'}
                                                  stroke={sm.isCurrentWallet ? '#fff' : B.green}
                                                  strokeWidth={sm.isCurrentWallet ? 2 : 1}
                                                  isFront
                                                />
                                              );
                                            })}
                                          </ComposedChart>
                                        </ResponsiveContainer>
                                      </div>
                                      {/* Open → Now + sharp entries labels */}
                                      <div style={{
                                        padding: '0.25rem 0.625rem 0.5rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        flexWrap: 'wrap', gap: '0.3rem',
                                      }}>
                                        <div style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                                          <span style={{ color: B.gold, fontWeight: 700 }}>Pinnacle</span>{' '}
                                          Open: {fmtOdds(getOdds(hist[0]))} → Now: {fmtOdds(getOdds(hist[hist.length - 1]))}
                                          {pinnGame.movement?.direction && (
                                            <span style={{
                                              marginLeft: '0.4rem',
                                              color: pinnGame.movement.direction === p.side ? B.green : B.red,
                                              fontWeight: 700,
                                            }}>
                                              {pinnGame.movement.direction === p.side ? '✓ Moving with play' : '✗ Moving against'}
                                            </span>
                                          )}
                                        </div>
                                        <div style={{ ...T.micro, color: B.textMuted, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                          {sharpMarkers.length > 0 && (
                                            <span>{sharpMarkers.length} sharp entr{sharpMarkers.length === 1 ? 'y' : 'ies'} · {fmtVol(sharpMarkers.reduce((s, m) => s + m.invested, 0))}</span>
                                          )}
                                          {whaleTrades.length > 0 && (
                                            <span style={{ color: '#22D3EE' }}>{whaleTrades.length} supporting whale trades · {fmtVol(whaleTrades.reduce((s, t) => s + (t.amount || 0), 0))}</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* Pinnacle Fair Value */}
                                <div style={{
                                  marginTop: '0.625rem', borderRadius: '8px',
                                  background: 'rgba(212,175,55,0.04)',
                                  border: `1px solid ${B.gold}22`,
                                  overflow: 'hidden',
                                }}>
                                  <div style={{
                                    padding: '0.35rem 0.625rem',
                                    borderBottom: `1px solid ${B.gold}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  }}>
                                    <span style={{ ...T.micro, color: B.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                      Pinnacle Fair Value
                                    </span>
                                    {hasEV && (
                                      <span style={{
                                        ...T.micro, padding: '0.1rem 0.4rem', borderRadius: '4px',
                                        background: evEdge >= 3 ? B.greenDim : 'rgba(163,230,53,0.1)',
                                        color: evEdge >= 3 ? B.green : '#A3E635',
                                        fontWeight: 800, fontFeatureSettings: "'tnum'",
                                      }}>+{evEdge}% EV Edge</span>
                                    )}
                                  </div>
                                  <div style={{ padding: '0.5rem 0.625rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div>
                                      <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.15rem' }}>Pinnacle</div>
                                      <div style={{ ...T.sub, fontWeight: 900, color: B.gold, fontFeatureSettings: "'tnum'" }}>
                                        {fmtOdds(pinnOdds)}
                                      </div>
                                      {pinnOdds && (
                                        <div style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                                          {(impliedProb(pinnOdds) * 100).toFixed(1)}% implied
                                        </div>
                                      )}
                                    </div>
                                    {bestRetail && bestRetail !== pinnOdds && (
                                      <div>
                                        <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.15rem' }}>Best Retail</div>
                                        <div style={{ ...T.sub, fontWeight: 900, color: hasEV ? B.green : B.text, fontFeatureSettings: "'tnum'" }}>
                                          {fmtOdds(bestRetail)}
                                        </div>
                                        <div style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                                          {bestBook || '—'}
                                        </div>
                                      </div>
                                    )}
                                    {(displayLine != null || totalLine != null) && (
                                      <div>
                                        <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.15rem' }}>Line</div>
                                        <div style={{ ...T.sub, fontWeight: 900, color: B.text, fontFeatureSettings: "'tnum'" }}>
                                          {p.marketType === 'SPREAD' && displayLine != null ? `${displayLine > 0 ? '+' : ''}${displayLine}` : (totalDisplayLine != null ? totalDisplayLine : totalLine)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* All Book Prices (ML only — full allBooks grid) */}
                                {p.marketType === 'ML' && Object.keys(allBooks).length > 1 && (
                                  <div style={{
                                    marginTop: '0.5rem', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${B.borderSubtle}`,
                                    overflow: 'hidden',
                                  }}>
                                    <div style={{
                                      padding: '0.35rem 0.625rem',
                                      borderBottom: `1px solid ${B.borderSubtle}`,
                                    }}>
                                      <span style={{ ...T.micro, color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Book Prices — {p.teamName} ML
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                      {Object.entries(allBooks)
                                        .filter(([, b]) => (p.side === 'away' ? b.away : p.side === 'draw' ? b.draw : b.home) != null)
                                        .sort(([, a], [, b]) => {
                                          const aO = p.side === 'away' ? a.away : p.side === 'draw' ? a.draw : a.home;
                                          const bO = p.side === 'away' ? b.away : p.side === 'draw' ? b.draw : b.home;
                                          return bO - aO;
                                        })
                                        .map(([key, book]) => {
                                          const odds = p.side === 'away' ? book.away : p.side === 'draw' ? book.draw : book.home;
                                          const isBest = odds === bestRetail && hasEV;
                                          const isPinn = key === 'pinnacle';
                                          return (
                                            <div key={key} style={{
                                              flex: '1 1 auto', minWidth: '70px',
                                              padding: '0.4rem 0.5rem',
                                              borderRight: `1px solid ${B.borderSubtle}`,
                                              background: isBest ? B.greenDim : 'transparent',
                                            }}>
                                              <div style={{ ...T.micro, color: isPinn ? B.gold : B.textMuted, fontWeight: isPinn ? 700 : 400 }}>
                                                {book.name}
                                              </div>
                                              <div style={{
                                                ...T.caption, fontWeight: 700,
                                                color: isBest ? B.green : isPinn ? B.gold : B.text,
                                                fontFeatureSettings: "'tnum'",
                                              }}>
                                                {fmtOdds(odds)}
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>
                                )}

                                {/* EV Opportunity Summary */}
                                {hasEV && (
                                  <div style={{
                                    marginTop: '0.5rem', padding: '0.45rem 0.625rem',
                                    borderRadius: '8px',
                                    background: `linear-gradient(135deg, ${B.greenDim} 0%, rgba(16,185,129,0.04) 100%)`,
                                    border: `1px solid ${B.green}30`,
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                  }}>
                                    <span style={{ fontSize: '0.75rem' }}>⚡</span>
                                    <span style={{ ...T.micro, color: B.green, fontWeight: 700 }}>
                                      +{evEdge}% EV opportunity at {bestBook || 'Best Retail'}
                                    </span>
                                    <span style={{ ...T.micro, color: B.textMuted }}>
                                      — Pinnacle {fmtOdds(pinnOdds)} vs {bestBook || 'retail'} {fmtOdds(bestRetail)}
                                    </span>
                                  </div>
                                )}

                                {!hasEV && !Object.keys(allBooks).length && (
                                  <div style={{
                                    marginTop: '0.5rem', padding: '0.4rem 0.625rem',
                                    borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${B.borderSubtle}`,
                                  }}>
                                    <span style={{ ...T.micro, color: B.textMuted }}>
                                      No retail book data available for this market
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {isExpanded && !pinnGame && (
                              <div style={{
                                padding: '0.5rem 0.875rem 0.75rem',
                                borderTop: `1px solid ${B.borderSubtle}`,
                              }}>
                                <span style={{ ...T.micro, color: B.textMuted }}>
                                  No Pinnacle data available for this game
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Sort Mode + Sport Filter + Leaderboard Header */}
            <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
                  <span style={{ ...T.label, color: B.gold, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Leaderboard
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {['ALL', 'NBA', 'NHL', 'MLB', 'CBB', 'NFL', 'SOC'].map(sp => (
                    <button key={sp} onClick={() => setVaultSportFilter(sp)} style={{
                      padding: '0.25rem 0.55rem', borderRadius: '5px', cursor: 'pointer',
                      ...T.micro, fontWeight: 700, fontSize: '0.575rem',
                      border: vaultSportFilter === sp ? `1px solid ${(SPORT_COLORS[sp] || B.gold)}44` : `1px solid ${B.border}`,
                      background: vaultSportFilter === sp ? `${SPORT_COLORS[sp] || B.gold}18` : 'transparent',
                      color: vaultSportFilter === sp ? (SPORT_COLORS[sp] || B.gold) : B.textMuted,
                      transition: 'all 0.2s ease',
                    }}>{sp}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'pnl', label: 'All-Time P&L' },
                  { id: 'roi', label: 'Best ROI' },
                  { id: 'weekly', label: 'Hot This Week' },
                  { id: 'volume', label: 'Most Volume' },
                  { id: 'avgbet', label: 'Biggest Bets' },
                ].map(sm => (
                  <button key={sm.id} onClick={() => setVaultSortMode(sm.id)} style={{
                    padding: '0.25rem 0.55rem', borderRadius: '5px', cursor: 'pointer',
                    ...T.micro, fontWeight: 700, fontSize: '0.55rem',
                    border: vaultSortMode === sm.id ? `1px solid ${B.gold}44` : `1px solid ${B.border}`,
                    background: vaultSortMode === sm.id ? `${B.gold}18` : 'transparent',
                    color: vaultSortMode === sm.id ? B.gold : B.textMuted,
                    transition: 'all 0.2s ease',
                  }}>{sm.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredEntries.map((e, idx) => {
                const isExpanded = expandedVaultRow === e.wallet;
                const positions = todayPositions[e.wallet.toLowerCase()] || [];
                const isActive = positions.length > 0;
                const displayPnl = e.sportPnlTotal;
                const isTop3 = idx < 3;
                const medalColors = ['#D4AF37', '#C0C0C0', '#CD7F32'];
                const rowAccent = isTop3 ? medalColors[idx] : isActive ? '#22D3EE' : B.border;

                return (
                  <div key={e.wallet} style={{
                    background: isTop3
                      ? `linear-gradient(135deg, ${B.card} 0%, rgba(212,175,55,0.03) 100%)`
                      : `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                    border: `1px solid ${isExpanded ? B.goldBorder : isTop3 ? 'rgba(212,175,55,0.15)' : B.border}`,
                    borderRadius: '12px', overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{
                      height: isTop3 ? '3px' : '2px',
                      background: `linear-gradient(90deg, transparent 5%, ${rowAccent}${isTop3 ? '' : '40'} 50%, transparent 95%)`,
                    }} />
                    {/* Compact Row */}
                    <div
                      onClick={() => setExpandedVaultRow(isExpanded ? null : e.wallet)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '30px 1fr auto 18px' : '30px 1.4fr 0.8fr 0.7fr 0.5fr 0.7fr 18px',
                        alignItems: 'center', gap: isMobile ? '0.375rem' : '0.625rem',
                        padding: isTop3 ? '0.875rem 1rem' : '0.7rem 1rem',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Rank */}
                      <div style={{
                        width: isTop3 ? '28px' : '24px', height: isTop3 ? '28px' : '24px',
                        borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: isTop3
                          ? `linear-gradient(135deg, ${medalColors[idx]}25, ${medalColors[idx]}08)`
                          : 'rgba(255,255,255,0.03)',
                        border: isTop3 ? `1.5px solid ${medalColors[idx]}50` : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: isTop3 ? `0 0 8px ${medalColors[idx]}15` : 'none',
                      }}>
                        <span style={{
                          ...T.micro, fontWeight: 900,
                          color: isTop3 ? medalColors[idx] : B.textMuted,
                          fontSize: isTop3 ? '0.7rem' : '0.6rem',
                        }}>{idx + 1}</span>
                      </div>

                      {/* Name + Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                        <span style={{
                          ...T.body, color: isTop3 ? B.text : B.textSec,
                          fontWeight: isTop3 ? 800 : 600,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          fontSize: isTop3 ? '0.9rem' : undefined,
                        }}>
                          {e.name}
                        </span>
                        {e.leaderboardRank && e.leaderboardRank <= 25 && (
                          <span style={{
                            ...T.micro, padding: '0.1rem 0.3rem', borderRadius: '3px',
                            background: e.leaderboardRank <= 10 ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.05)',
                            color: e.leaderboardRank <= 10 ? B.gold : B.textMuted,
                            fontWeight: 800, fontSize: '0.45rem',
                            border: `1px solid ${e.leaderboardRank <= 10 ? B.goldBorder : B.borderSubtle}`,
                          }}>#{e.leaderboardRank}</span>
                        )}
                        {isActive && (
                          <span style={{
                            ...T.micro, padding: '0.1rem 0.35rem', borderRadius: '3px',
                            background: 'rgba(34,211,238,0.1)', color: '#22D3EE',
                            fontWeight: 700, fontSize: '0.5rem',
                            border: '1px solid rgba(34,211,238,0.2)',
                          }}>ACTIVE</span>
                        )}
                        {e.weeklyPnl != null && e.weeklyPnl > 10000 && (
                          <span style={{
                            ...T.micro, padding: '0.1rem 0.3rem', borderRadius: '3px',
                            background: 'rgba(34,197,94,0.1)', color: B.green,
                            fontWeight: 700, fontSize: '0.45rem',
                            border: '1px solid rgba(34,197,94,0.2)',
                          }}>HOT</span>
                        )}
                      </div>

                      {/* Sport PnL */}
                      <div style={{ textAlign: isMobile ? 'right' : 'left' }}>
                        <span style={{
                          ...(isTop3 ? T.sub : T.label), color: B.green,
                          fontWeight: 800, fontFeatureSettings: "'tnum'",
                          fontSize: isTop3 ? '0.975rem' : undefined,
                        }}>
                          +{fmtVol(displayPnl)}
                        </span>
                      </div>

                      {/* Desktop-only stats */}
                      {!isMobile && <>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{
                            ...T.label, fontWeight: 700, fontFeatureSettings: "'tnum'",
                            color: e.roi >= 5 ? B.green : e.roi >= 1 ? '#22D3EE' : B.textSec,
                          }}>
                            {e.roi >= 0 ? '+' : ''}{e.roi.toFixed(1)}%
                          </span>
                          <div style={{ ...T.micro, color: B.textSubtle, fontSize: '0.5rem' }}>ROI</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{
                            ...T.label, fontWeight: 700, fontFeatureSettings: "'tnum'",
                            color: e.weeklyPnl != null ? (e.weeklyPnl > 0 ? B.green : e.weeklyPnl < 0 ? B.red : B.textMuted) : B.textMuted,
                          }}>
                            {e.weeklyPnl != null ? `${e.weeklyPnl >= 0 ? '+' : ''}${fmtVol(e.weeklyPnl)}` : '—'}
                          </span>
                          <div style={{ ...T.micro, color: B.textSubtle, fontSize: '0.5rem' }}>THIS WEEK</div>
                        </div>
                      </>}

                      {/* Chevron */}
                      {isExpanded
                        ? <ChevronUp size={13} color={B.textMuted} />
                        : <ChevronDown size={13} color={B.textMuted} />}
                    </div>

                    {/* Expanded Card */}
                    {isExpanded && (
                      <div style={{
                        borderTop: `1px solid ${B.border}`, padding: '1rem',
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)',
                      }}>
                        {/* Stat Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                          gap: '0.5rem', marginBottom: '1rem',
                        }}>
                          {[
                            { label: 'SPORT P&L', value: `+${fmtVol(e.sportPnlTotal)}`, color: B.green },
                            { label: 'OVERALL P&L', value: `${e.overallPnl >= 0 ? '+' : ''}${fmtVol(e.overallPnl)}`, color: e.overallPnl >= 0 ? B.green : B.red },
                            { label: 'VOLUME', value: fmtVol(e.vol), color: B.textSec },
                            { label: 'ROI', value: `${e.roi >= 0 ? '+' : ''}${e.roi.toFixed(1)}%`, color: e.roi >= 5 ? B.green : e.roi >= 1 ? '#22D3EE' : B.textSec },
                            { label: 'THIS WEEK', value: e.weeklyPnl != null ? `${e.weeklyPnl >= 0 ? '+' : ''}${fmtVol(e.weeklyPnl)}` : '—', color: e.weeklyPnl > 0 ? B.green : e.weeklyPnl < 0 ? B.red : B.textMuted },
                            { label: 'AVG BET', value: fmtVol(e.avgBet), color: B.textSec },
                            { label: 'SPORT BETS', value: e.sportBets.toLocaleString(), color: B.textSec },
                          ].map((stat, si) => (
                            <div key={si} style={{
                              textAlign: 'center', padding: '0.5rem 0.375rem',
                              borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
                              border: `1px solid ${B.borderSubtle}`,
                            }}>
                              <div style={{ ...T.sub, color: stat.color, fontWeight: 800, fontFeatureSettings: "'tnum'" }}>
                                {stat.value}
                              </div>
                              <div style={{ ...T.micro, color: B.textMuted, fontWeight: 600, letterSpacing: '0.06em', marginTop: '0.125rem' }}>
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Per-Sport P&L Breakdown */}
                        <div style={{
                          display: 'flex', flexDirection: 'column', gap: '0.5rem',
                          marginBottom: (e.recentResults?.length > 0 || positions.length > 0) ? '1rem' : 0,
                        }}>
                          <div style={{ ...T.micro, color: B.textMuted, fontWeight: 700, letterSpacing: '0.06em' }}>SPORT BREAKDOWN</div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {Object.entries(e.perSport || {})
                              .filter(([, s]) => s.bets > 0)
                              .sort(([, a], [, b]) => (b.pnl || 0) - (a.pnl || 0))
                              .map(([sport, s]) => (
                                  <div key={sport} style={{
                                    padding: '0.5rem 0.65rem', borderRadius: '8px',
                                    background: (SPORT_COLORS[sport] || B.gold) + '0A',
                                    border: `1px solid ${(SPORT_COLORS[sport] || B.gold)}25`,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                                    minWidth: '80px',
                                  }}>
                                    <span style={{
                                      ...T.label, fontWeight: 800, fontFeatureSettings: "'tnum'",
                                      color: s.pnl >= 0 ? B.green : B.red, fontSize: '0.75rem',
                                    }}>
                                      {s.pnl >= 0 ? '+' : ''}{fmtVol(s.pnl)}
                                    </span>
                                    <span style={{ ...T.micro, color: SPORT_COLORS[sport] || B.gold, fontWeight: 700, fontSize: '0.55rem' }}>
                                      {sport}
                                    </span>
                                    <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.5rem' }}>
                                      {s.bets} bets{s.roi != null ? ` · ${s.roi >= 0 ? '+' : ''}${s.roi}%` : ''}
                                    </span>
                                  </div>
                                ))
                            }
                            {Object.keys(e.perSport || {}).length === 0 && Object.entries(e.sportMarkets)
                              .filter(([, v]) => v > 0)
                              .sort(([, a], [, b]) => b - a)
                              .map(([sport, bets]) => (
                                  <div key={sport} style={{
                                    padding: '0.4rem 0.6rem', borderRadius: '8px',
                                    background: (SPORT_COLORS[sport] || B.gold) + '0A',
                                    border: `1px solid ${(SPORT_COLORS[sport] || B.gold)}25`,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem',
                                    minWidth: '70px',
                                  }}>
                                    <span style={{
                                      ...T.label, fontWeight: 800, fontFeatureSettings: "'tnum'",
                                      color: SPORT_COLORS[sport] || B.gold,
                                    }}>
                                      {bets}
                                    </span>
                                    <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.525rem' }}>
                                      {sport} market{bets !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                ))
                            }
                          </div>
                        </div>

                        {/* Recent Results */}
                        {e.recentResults?.length > 0 && (
                          <div style={{
                            borderTop: `1px solid ${B.border}`, paddingTop: '0.75rem',
                            marginBottom: positions.length > 0 ? '1rem' : 0,
                          }}>
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              marginBottom: '0.5rem',
                            }}>
                              <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700, letterSpacing: '0.06em' }}>
                                RESOLVED BETS
                              </span>
                              <span style={{ ...T.micro, color: B.textSec, fontWeight: 700, fontFeatureSettings: "'tnum'" }}>
                                Last {e.recentResults.length}: {e.recentResults.filter(r => r.won).length}W-{e.recentResults.filter(r => !r.won).length}L
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              {e.recentResults.slice(0, 8).map((r, ri) => {
                                const sportColor = SPORT_COLORS[r.sport] || B.gold;
                                const timeAgo = r.timestamp ? (() => {
                                  const diff = Math.floor((Date.now() / 1000 - r.timestamp) / 3600);
                                  return diff < 24 ? `${diff}h ago` : `${Math.floor(diff / 24)}d ago`;
                                })() : '';
                                const isWin = r.won != null ? r.won : r.realizedPnl >= 0;
                                return (
                                  <div key={ri} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.35rem 0.5rem', borderRadius: '6px',
                                    background: isWin ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0, flex: 1 }}>
                                      <span style={{
                                        ...T.micro, fontWeight: 900, fontSize: '0.6rem',
                                        color: isWin ? B.green : B.red,
                                      }}>{isWin ? 'W' : 'L'}</span>
                                      <span style={{
                                        ...T.micro, padding: '0.1rem 0.3rem', borderRadius: '3px',
                                        background: sportColor + '15', color: sportColor,
                                        fontWeight: 700, fontSize: '0.45rem',
                                      }}>{r.sport}</span>
                                      <span style={{
                                        ...T.micro, color: B.textSec, fontWeight: 500,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        fontSize: '0.6rem',
                                      }}>{r.title}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                      {r.size > 0 && <span style={{
                                        ...T.micro, fontWeight: 600, fontFeatureSettings: "'tnum'",
                                        color: B.textMuted, fontSize: '0.5rem',
                                      }}>
                                        {fmtVol(r.size)}
                                      </span>}
                                      <span style={{
                                        ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
                                        color: isWin ? B.green : B.red, fontSize: '0.6rem',
                                      }}>
                                        {r.realizedPnl >= 0 ? '+' : ''}{fmtVol(r.realizedPnl)}
                                      </span>
                                      {timeAgo && <span style={{ ...T.micro, color: B.textSubtle, fontSize: '0.5rem' }}>{timeAgo}</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Today's Positions */}
                        {positions.length > 0 && (
                          <div style={{
                            borderTop: `1px solid ${B.border}`, paddingTop: '0.75rem',
                          }}>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '0.375rem',
                              marginBottom: '0.5rem',
                            }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22D3EE', boxShadow: '0 0 6px rgba(34,211,238,0.4)' }} />
                              <span style={{ ...T.micro, color: '#22D3EE', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                Live Positions
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                              {positions.map((pos, pi) => (
                                <div key={pi} style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '0.5rem 0.75rem', borderRadius: '8px',
                                  background: 'rgba(34,211,238,0.03)',
                                  border: '1px solid rgba(34,211,238,0.1)',
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{
                                      ...T.micro, padding: '0.15rem 0.4rem', borderRadius: '4px',
                                      background: (SPORT_COLORS[pos.sport] || B.gold) + '18',
                                      color: SPORT_COLORS[pos.sport] || B.gold, fontWeight: 700,
                                      border: `1px solid ${(SPORT_COLORS[pos.sport] || B.gold)}25`,
                                    }}>{pos.sport}</span>
                                    <span style={{ ...T.label, color: B.textSec, fontWeight: 600 }}>
                                      {pos.away} <span style={{ color: B.textSubtle }}>vs</span> {pos.home}
                                    </span>
                                    <span style={{
                                      ...T.micro, color: B.gold, fontWeight: 800,
                                      padding: '0.1rem 0.3rem', borderRadius: '3px',
                                      background: B.goldDim,
                                    }}>
                                      {pos.outcome || (pos.side === 'home' ? pos.home : pos.away)}
                                    </span>
                                  </div>
                                  <span style={{ ...T.label, color: B.green, fontWeight: 700, fontFeatureSettings: "'tnum'" }}>
                                    {fmtVol(pos.invested)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredEntries.length === 0 && vaultSportFilter !== 'ALL' && (
              <div style={{
                textAlign: 'center', padding: '2.5rem 1.5rem', borderRadius: '12px',
                background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                border: `1px solid ${B.border}`,
              }}>
                <Lock size={20} color={B.textMuted} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                <div style={{ ...T.body, color: B.textMuted, fontWeight: 600 }}>No elite sharps profitable in {vaultSportFilter}</div>
                <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.25rem' }}>Try a different sport filter</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── Money Flow View ─── */}
      {viewMode === 'flow' && (
        <MoneyFlowView games={filteredGames} isMobile={isMobile} />
      )}

      {/* ─── Whale Signals View ─── */}
      {viewMode === 'whaleSignals' && (() => {
        return (
          <div>
            {/* Stat cards */}
            <div className="sf-stagger" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.625rem', marginBottom: '1.5rem',
            }}>
              <FlowStatCard icon={Eye} label="Sharp Bettors" value={sharpStats.trackedCount} rawValue={sharpStats.trackedCount} accent={B.gold}
                hint={sharpStats.totalExcluded > 0 ? `${sharpStats.totalExcluded} non-sharp bettors filtered` : 'Verified sport bettors tracked'} />
              <FlowStatCard icon={DollarSign} label="Sharp Money Today" value={fmtVol(sharpStats.totalSharpInvested)} rawValue={sharpStats.totalSharpInvested} fmt={fmtVol} accent={B.green}
                hint="Total verified sharp $ on today's games" />
            </div>

            {/* ─── AGS-U Performance Dashboard (primary, since 2026-05-14 cutover) ─── */}
            {(() => {
              const hasData = allTimePnL && (allTimePnL.picks?.length > 0);

              // ─── Filter AGS-U picks ────────────────────────────────────
              // Only post-cutover. Mirrors the LP-scorecard's tier
              // resolution exactly so the dashboard hero, tier matrix,
              // and ledger all count the same set of picks — and the
              // numbers match the cron-graded byAgsTier aggregation.
              // Rule: prefer v8_agsTier if it's a known tier; if it's
              // missing or 'UNKNOWN', fall back to v8_lockTier; if
              // neither resolves to a known tier, the pick is excluded
              // (the AGS-U system can't claim credit/blame for a pick
              // it couldn't score). Resolved tier is stashed as
              // _resolvedTier on a shallow-cloned object so we don't
              // mutate the cached pick.
              const resolveTier = resolveAgsuTier;
              // Era-aware scope: 'v12' (live model only, the default) vs
              // 'all' (every pick ever graded, including legacy-stars era
              // before AGS-U existed). In v12 scope we require both the
              // date guard and a cron-resolved AGS-U tier — anything that
              // didn't get a v8_agsTier or v8_lockTier stamp is excluded
              // because v12 can't honestly own picks it never scored. In
              // 'all' scope we include every non-cancelled pick; legacy
              // stars-era picks lacking an AGS-U tier are tagged 'LEGACY'
              // so they're counted in the headline KPIs but skipped in
              // the AGS-U tier breakdown (which has no bucket for them).
              const rawAgsuPicks = ((allTimePnL?.picks || [])
                .map(p => {
                  if (!p || !p.date || p.cancelled) return null;
                  if (agsuEraScope === 'v12' && p.date < V12_LAUNCH) return null;
                  const tier = resolveTier(p);
                  if (agsuEraScope === 'v12' && !tier) return null;
                  return { ...p, _resolvedTier: tier || 'LEGACY', _stakeTier: (typeof p.v8_hcStakeTier === 'string' ? p.v8_hcStakeTier : null) };
                })
                .filter(Boolean));
              const isAgsuFiltered = agsuDateRange !== 'all' || agsuSport !== 'ALL' || agsuMarket !== 'ALL';
              const nowEt = new Date();
              const todayEt = nowEt.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
              const yesterdayEt = new Date(nowEt.getTime() - 86400000).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
              const passesAgsuFilter = (p) => {
                if (agsuSport !== 'ALL' && p.sport !== agsuSport) return false;
                if (agsuMarket !== 'ALL' && (p.marketType || 'ml').toUpperCase() !== agsuMarket) return false;
                if (agsuDateRange === 'all') return true;
                if (agsuDateRange === 'today') return p.date === todayEt;
                if (agsuDateRange === 'yesterday') return p.date === yesterdayEt;
                if (agsuDateRange === '7d') {
                  const d = new Date(nowEt); d.setDate(d.getDate() - 7);
                  return p.date >= d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                }
                if (agsuDateRange === '30d') {
                  const d = new Date(nowEt); d.setDate(d.getDate() - 30);
                  return p.date >= d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                }
                return true;
              };
              const agsuPicks = rawAgsuPicks.filter(passesAgsuFilter);

              // ─── Aggregate hero metrics from filtered picks ────────────
              const liveGraded = agsuPicks.filter(p => !p.tracked && p.outcome && p.outcome !== 'PUSH');
              const liveWins = liveGraded.filter(p => p.outcome === 'WIN').length;
              const liveLosses = liveGraded.filter(p => p.outcome === 'LOSS').length;
              const livePushes = agsuPicks.filter(p => !p.tracked && p.outcome === 'PUSH').length;
              const livePending = agsuPicks.filter(p => !p.tracked && p.units > 0 && (!p.outcome || p.status !== 'COMPLETED')).length;
              const trackedCount = agsuPicks.filter(p => p.tracked).length;
              const totalUnitsLive = agsuPicks.filter(p => !p.tracked && p.outcome).reduce((s, p) => s + (p.units || 0), 0);
              const totalProfitLive = agsuPicks.filter(p => !p.tracked && p.outcome).reduce((s, p) => s + (p.profit || 0), 0);
              const totalGradedLive = liveWins + liveLosses + livePushes;
              const liveWinPct = (liveWins + liveLosses) > 0 ? ((liveWins / (liveWins + liveLosses)) * 100) : 0;
              const liveRoi = totalUnitsLive > 0 ? ((totalProfitLive / totalUnitsLive) * 100) : 0;
              const recordTxt = `${liveWins}-${liveLosses}${livePushes > 0 ? `-${livePushes}` : ''}`;

              // CLV stats removed from the hero strip 2026-06-11 (jargon
              // for lay users). If we add a "Pro view" disclosure later,
              // the same one-line computation belongs there:
              //   avgCLV    = mean(p.clv) across {p : p.clv != null && p.outcome}
              //   beatClose = share where p.clv > 0
              // Right now the equity curve carries the trend story
              // adequately and CLV doesn't need to be in front of every user.

              // ─── Per-tier breakdown from filtered picks ────────────────
              // v12ab STAKE tiers — the actual sizing system (HC-margin ladder
              // + RANK-RESCUE), NOT the score quintile. The score-quintile tiers
              // (ELITE/PREMIUM/…) only SELECT the side; they don't size it, so
              // bucketing performance by them was misleading. We bucket by the
              // cron-stamped v8_hcStakeTier instead.
              // Condensed to the 5 shared display tiers (AGS_V12_DISPLAY_TIERS)
              // — identical grouping to the AGS-U daily report, so the numbers
              // here MATCH the report. Each tier rolls up its internal staking
              // paths (e.g. SHARP PLAY = RANK 2-for-0 + SHARP/SHARP-PRIME).
              const TIER_DEFS = AGS_V12_DISPLAY_TIERS.map(dt => ({ key: dt.key, size: dt.unitsLabel }));
              const STAKE_TIER_META = AGS_V12_DISPLAY_TIERS.reduce((m, dt) => {
                m[dt.key] = { label: dt.label, color: dt.color, sub: dt.sub };
                return m;
              }, {});
              const tierAgg = {};
              for (const t of TIER_DEFS) tierAgg[t.key] = { wins:0, losses:0, pushes:0, units:0, profit:0, pending:0, tracked:0, sparkPnL:[] };
              const sortedByDate = [...agsuPicks].sort((a,b) => (a.date||'').localeCompare(b.date||''));
              for (const p of sortedByDate) {
                // Bucket by the DISPLAY tier (path → display group). Picks without
                // a stake tier are pre-v12a score-ladder picks; MONITORING/FADE
                // are 0u (not staked) — none map to a display tier, so they fall
                // through (excluded from the staked scoreboard).
                const display = p._stakeTier ? AGS_V12_PATH_TO_DISPLAY[p._stakeTier] : null;
                if (!display || !tierAgg[display]) continue;
                const b = tierAgg[display];
                if (p.tracked) { b.tracked++; continue; }
                if (!p.outcome) { if (p.units > 0) b.pending++; continue; }
                if (p.outcome === 'WIN')  { b.wins++;   b.profit += (p.profit || 0); b.units += p.units; }
                else if (p.outcome === 'LOSS'){ b.losses++; b.profit -= p.units;        b.units += p.units; }
                else if (p.outcome === 'PUSH'){ b.pushes++; }
                const last = b.sparkPnL.length > 0 ? b.sparkPnL[b.sparkPnL.length-1] : 0;
                const inc = p.outcome === 'WIN' ? (p.profit || 0) : p.outcome === 'LOSS' ? -p.units : 0;
                b.sparkPnL.push(last + inc);
              }

              // Sparkline data + inline component removed 2026-06-11 with the
              // hero-card facelift. At 64×18 they were unreadable; the
              // expanded equity curve carries trend now. Profit/ROI colors
              // are still computed for the hero KPI text and for the equity
              // curve area fill.
              const heroProfitColor = totalProfitLive > 0 ? B.green : totalProfitLive < 0 ? B.red : B.textSec;
              const heroRoiColor = liveRoi > 0 ? B.green : liveRoi < 0 ? B.red : B.textSec;

              // ─── Equity curve (hoisted to dashboard scope) ─────────────
              // The cumulative-profit curve is now the hero centerpiece
              // (Robinhood-style), so its computation lives up here where
              // both the hero chart and the stat rail can read it. One
              // anchor point per calendar day at end-of-day cumulative P/L;
              // realized picks only (no pending / tracked-only).
              const eq = (() => {
                const realized = [...agsuPicks]
                  .filter(p => !p.tracked && p.outcome && p.status === 'COMPLETED')
                  .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
                const byDate = new Map();
                let cum = 0;
                for (const p of realized) {
                  cum += (p.profit || 0);
                  const day = p.date;
                  const existing = byDate.get(day);
                  const pnl = p.profit || 0;
                  const isWin = p.outcome === 'WIN';
                  const isLoss = p.outcome === 'LOSS';
                  if (!existing) {
                    let dateMs, dateLabel;
                    try {
                      dateMs = new Date(day + 'T12:00:00').getTime();
                      dateLabel = new Date(day + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    } catch { dateMs = 0; dateLabel = day; }
                    byDate.set(day, {
                      date: day, dateMs, dateLabel,
                      picks: 1, wins: isWin ? 1 : 0, losses: isLoss ? 1 : 0,
                      dayPnl: pnl, dayStake: p.units || 0, cum: +cum.toFixed(2),
                    });
                  } else {
                    existing.picks += 1;
                    if (isWin) existing.wins += 1;
                    if (isLoss) existing.losses += 1;
                    existing.dayPnl += pnl;
                    existing.dayStake += (p.units || 0);
                    existing.cum = +cum.toFixed(2);
                  }
                }
                const curve = [...byDate.values()].sort((a, b) => a.dateMs - b.dateMs);
                const totalPicks = realized.length;
                const finalCum = curve.length > 0 ? curve[curve.length - 1].cum : 0;
                const isProfit = finalCum >= 0;
                const minCum = curve.length > 0 ? Math.min(0, ...curve.map(d => d.cum)) : 0;
                const maxCum = curve.length > 0 ? Math.max(0, ...curve.map(d => d.cum)) : 0;
                const peak = curve.reduce((acc, d) => d.cum > acc.cum ? d : acc, { cum: -Infinity, dateLabel: '—' });
                const trough = curve.reduce((acc, d) => d.cum < acc.cum ? d : acc, { cum: Infinity, dateLabel: '—' });
                const drawdown = peak.cum > -Infinity ? finalCum - peak.cum : 0;
                const bestDay = curve.reduce((acc, d) => (acc == null || d.dayPnl > acc.dayPnl) ? d : acc, null);
                const worstDay = curve.reduce((acc, d) => (acc == null || d.dayPnl < acc.dayPnl) ? d : acc, null);
                const STARTING_BANKROLL = 10000;
                const DOLLARS_PER_UNIT = 100;
                const dollarsCurrent = STARTING_BANKROLL + (finalCum * DOLLARS_PER_UNIT);
                const fmt$ = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
                return { curve, totalPicks, finalCum, isProfit, minCum, maxCum, peak, trough, drawdown, bestDay, worstDay, STARTING_BANKROLL, dollarsCurrent, fmt$ };
              })();

              // ─── Recent picks ledger (last 20 graded/pending, newest first) ──
              const ledgerRows = [...agsuPicks]
                .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                .slice(0, 20);
              const featureLabels = {
                dCount: 'Δcount',
                dHcSizeRatio: 'ΔHCsize',
                dSumRankNorm: 'ΔΣrank',
                dWinnerCtPreA: 'Δwinners',
                // legacy v10 fields still present on historical picks
                dHcCount: 'ΔHCcount',
                dConvictionAvg: 'ΔavgConv',
                forContribShare: 'forShare',
              };
              const topDriverOf = (p) => {
                const c = p.v8_agsComponents || {};
                let best = null, bestAbs = 0;
                for (const k of Object.keys(featureLabels)) {
                  const v = Number(c[k]);
                  if (Number.isFinite(v) && Math.abs(v) > bestAbs) { best = k; bestAbs = Math.abs(v); }
                }
                if (!best) return null;
                return { key: best, label: featureLabels[best], z: c[best] };
              };

              // Era-aware copy. v12 = live model, ALL-TIME = every era
              // lumped (legacy stars + v9/10/11 + v12) for a "full house"
              // record the user can drill into without it ever feeling
              // hidden.
              const isV12Scope = agsuEraScope === 'v12';
              const eraLabel = isV12Scope ? 'AGS-U v12' : 'AGS-U · All Time';
              const eraSinceLabel = isV12Scope
                ? `since ${V12_LAUNCH}`
                : 'every era · stars · v9 · v10 · v11 · v12';

              // Filter-aware scope label — a single source of truth that
              // every panel uses to describe what the user is currently
              // looking at. Without this, switching to "Today" leaves the
              // PROFIT card still saying "v12 ERA" while the numbers shrink
              // to a one-day slice, which reads as a bug. Examples:
              //   v12 + All + All        → "v12 ERA"
              //   v12 + Today + All      → "v12 · TODAY"
              //   v12 + 7D + MLB         → "v12 · LAST 7D · MLB"
              //   All + All + All        → "ALL TIME"
              //   All + Yesterday + NHL  → "YESTERDAY · NHL"
              // hasActiveSubFilter is true whenever date or sport differ
              // from their defaults — that drives the "FILTERED" indicator
              // on the collapsed bar.
              const dateRangeLabel = (
                agsuDateRange === 'today'     ? 'TODAY'     :
                agsuDateRange === 'yesterday' ? 'YESTERDAY' :
                agsuDateRange === '7d'        ? 'LAST 7D'   :
                agsuDateRange === '30d'       ? 'LAST 30D'  :
                null
              );
              const sportLabel = agsuSport !== 'ALL' ? agsuSport : null;
              const marketLabel = agsuMarket !== 'ALL'
                ? (agsuMarket === 'ML' ? 'ML' : agsuMarket === 'SPREAD' ? 'SPREAD' : 'TOTALS')
                : null;
              const hasActiveSubFilter = dateRangeLabel != null || sportLabel != null || marketLabel != null;
              const scopeLabel = (() => {
                const base = isV12Scope
                  ? (hasActiveSubFilter ? 'v12' : 'v12 ERA')
                  : (hasActiveSubFilter ? null : 'ALL TIME');
                const parts = [base, dateRangeLabel, sportLabel, marketLabel].filter(Boolean);
                return parts.join(' · ');
              })();

              return (
                <div style={{ marginBottom: '1rem' }}>
                  {/* ── Collapsed/expanded header ──────────────────── */}
                  <button onClick={() => setShowAgsuPerf(p => !p)} className="sf-glass" style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(26,31,46,0.62) 35%, rgba(17,21,31,0.7) 100%)',
                    border: `1px solid ${B.goldBorder}`,
                    borderRadius: showAgsuPerf ? '14px 14px 0 0' : '14px',
                    padding: '0.85rem 1.1rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: showAgsuPerf
                      ? 'inset 0 1px 0 rgba(255,255,255,0.05)'
                      : '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                    transition: 'box-shadow 0.25s ease, border-radius 0.25s ease',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: isV12Scope ? B.green : B.textMuted,
                        boxShadow: isV12Scope ? `0 0 10px ${B.green}, 0 0 4px ${B.green}` : 'none',
                        animation: isV12Scope ? 'pulse 2s ease-in-out infinite' : 'none',
                      }} />
                      <span style={{ ...T.micro, fontWeight: 900, color: B.gold, letterSpacing: '0.10em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                        {eraLabel}
                      </span>
                      {isV12Scope && (
                        <span style={{
                          ...T.micro, fontWeight: 800, fontSize: '0.55rem',
                          padding: '0.1rem 0.35rem', borderRadius: '3px',
                          color: B.green, background: B.greenDim,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          border: `1px solid ${B.green}33`,
                        }}>
                          LIVE
                        </span>
                      )}
                      <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.58rem', letterSpacing: '0.04em' }}>
                        {eraSinceLabel}
                      </span>
                      {hasData && (
                        <>
                          {/* Filter indicator on the collapsed bar — when the
                              user has drilled into a date or sport, the
                              summary chip silently shows filtered numbers
                              instead of era totals. Without this pill they
                              can't tell. Pill carries the actual scope
                              label so it reads as "v12 · TODAY · MLB". */}
                          {hasActiveSubFilter && (
                            <span style={{
                              ...T.micro, fontWeight: 800, fontSize: '0.55rem',
                              padding: '0.1rem 0.4rem', borderRadius: '3px',
                              color: B.gold, background: B.goldDim,
                              border: `1px solid ${B.gold}33`,
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                            }}>
                              {[dateRangeLabel, sportLabel, marketLabel].filter(Boolean).join(' · ')}
                            </span>
                          )}
                          <span style={{
                            ...T.micro, fontWeight: 800, fontSize: '0.65rem',
                            padding: '0.15rem 0.5rem', borderRadius: '4px',
                            color: totalProfitLive >= 0 ? B.green : B.red,
                            background: totalProfitLive >= 0 ? B.greenDim : B.redDim,
                            fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                          }}>
                            {totalGradedLive === 0
                              ? 'no graded picks'
                              : `${recordTxt} · ${(liveWinPct).toFixed(1)}% · ${totalProfitLive >= 0 ? '+' : ''}${totalProfitLive.toFixed(2)}u`}
                          </span>
                        </>
                      )}
                    </div>
                    {showAgsuPerf ? <ChevronUp size={14} color={B.textMuted} /> : <ChevronDown size={14} color={B.textMuted} />}
                  </button>

                  {/* ── Body ──────────────────────────────────────── */}
                  {showAgsuPerf && (
                    <div className="sf-glass" style={{
                      background: 'linear-gradient(180deg, rgba(20,25,38,0.72) 0%, rgba(15,19,29,0.78) 100%)',
                      border: `1px solid ${B.border}`,
                      borderTop: 'none',
                      borderRadius: '0 0 14px 14px',
                      padding: isMobile ? '1rem' : '1.25rem 1.25rem 1.1rem',
                      position: 'relative', overflow: 'hidden',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                    }}>
                      {/* Premium atmosphere ─────────────────────────
                          Three stacked decorations give the body a sense
                          of place instead of "another flat dark card":
                          (1) a hairline gold-glint top accent,
                          (2) a soft radial wash from top-center
                              (gold→transparent at 4% opacity) — works
                              like stage lighting on the hero KPIs,
                          (3) a faint inset bottom shadow for depth.
                          All decorative, pointerEvents: 'none' so they
                          never block clicks. */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 50%, transparent 100%)',
                        pointerEvents: 'none',
                      }} />
                      <div style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                        width: '70%', height: '260px',
                        background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.045) 0%, rgba(212,175,55,0.018) 35%, transparent 70%)',
                        pointerEvents: 'none', zIndex: 0,
                      }} />
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 100%)',
                        pointerEvents: 'none', zIndex: 0,
                      }} />
                      {/* All real content sits above the atmosphere */}
                      <div style={{ position: 'relative', zIndex: 1 }}>

                      {/* ── Era toggle ──────────────────────────────
                          Two pills the user can flip between. v12 is the
                          default and what the page is "advertising"; All
                          Time is one click away so historical data is
                          accessible without ever feeling buried. This is
                          the load-bearing UX for "one bar covers
                          everything" — DON'T move it below the fold. */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        marginBottom: '0.875rem', flexWrap: 'wrap',
                      }}>
                        <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                          ERA
                        </span>
                        <div style={{
                          display: 'inline-flex',
                          padding: '0.18rem', borderRadius: '7px',
                          background: 'rgba(0,0,0,0.35)',
                          border: `1px solid ${B.borderSubtle}`,
                          gap: '0.15rem',
                        }}>
                          {[
                            { id: 'v12', label: 'v12 LIVE', sub: 'since Jun 1' },
                            { id: 'all', label: 'All Time', sub: 'every era' },
                          ].map(opt => {
                            const active = agsuEraScope === opt.id;
                            return (
                              <button key={opt.id} onClick={() => setAgsuEraScope(opt.id)} style={{
                                padding: '0.3rem 0.65rem', borderRadius: '5px', cursor: 'pointer',
                                border: 'none',
                                background: active
                                  ? (opt.id === 'v12'
                                      ? `linear-gradient(135deg, ${B.greenDim} 0%, rgba(16,185,129,0.05) 100%)`
                                      : `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`)
                                  : 'transparent',
                                boxShadow: active ? 'inset 0 0 0 1px rgba(255,255,255,0.06)' : 'none',
                                transition: 'all 0.2s ease',
                                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.05rem',
                              }}>
                                <span style={{
                                  ...T.micro, fontWeight: 900, fontSize: '0.62rem',
                                  color: active ? (opt.id === 'v12' ? B.green : B.gold) : B.textSec,
                                  letterSpacing: '0.06em', textTransform: 'uppercase',
                                }}>
                                  {opt.label}
                                </span>
                                <span style={{
                                  ...T.micro, fontWeight: 600, fontSize: '0.5rem',
                                  color: active ? B.textSec : B.textMuted,
                                  letterSpacing: '0.04em',
                                }}>
                                  {opt.sub}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* ── League filter (compact) ─────────────────
                          Date range moved under the equity chart as a
                          Robinhood-style time selector. This row is just
                          the league context the user is viewing. */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem', letterSpacing: '0.08em', fontWeight: 700, marginRight: '0.15rem' }}>LEAGUE</span>
                        {[
                          { id: 'ALL', label: 'ALL', color: B.gold },
                          { id: 'MLB', label: 'MLB', color: '#E31837' },
                          { id: 'NBA', label: 'NBA', color: '#FF8C00' },
                          { id: 'NHL', label: 'NHL', color: '#D4AF37' },
                          { id: 'CBB', label: 'CBB', color: '#FF6B35' },
                          { id: 'SOC', label: 'SOC', color: '#2ECC71' },
                        ].map(opt => (
                          <button key={opt.id} onClick={() => setAgsuSport(opt.id)} style={{
                            padding: '0.22rem 0.6rem', borderRadius: '6px', cursor: 'pointer',
                            ...T.micro, fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.04em',
                            border: agsuSport === opt.id ? `1px solid ${opt.color}66` : `1px solid ${B.border}`,
                            background: agsuSport === opt.id ? `${opt.color}1f` : 'transparent',
                            color: agsuSport === opt.id ? opt.color : B.textMuted,
                            transition: 'all 0.2s ease',
                          }}>{opt.label}</button>
                        ))}
                        {hasActiveSubFilter && (
                          <button
                            onClick={() => { setAgsuDateRange('all'); setAgsuSport('ALL'); setAgsuMarket('ALL'); }}
                            style={{
                              padding: '0.22rem 0.55rem', borderRadius: '6px', cursor: 'pointer',
                              ...T.micro, fontWeight: 800, fontSize: '0.55rem',
                              border: `1px solid ${B.borderSubtle}`,
                              background: 'transparent',
                              color: B.textMuted,
                              letterSpacing: '0.06em',
                              transition: 'all 0.2s ease',
                              marginLeft: '0.3rem',
                            }}
                            title="Reset date + league + market filters"
                          >
                            CLEAR
                          </button>
                        )}
                      </div>

                      {/* ── Market filter (compact) ─────────────────
                          Mirrors the league row so power users can split
                          performance by bet type (ML / Spread / Totals).
                          Compares against pick.marketType ('ml'/'spread'/
                          'total'), which is lowercase, so ids are upper. */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem', letterSpacing: '0.08em', fontWeight: 700, marginRight: '0.15rem' }}>MARKET</span>
                        {[
                          { id: 'ALL', label: 'ALL', color: B.gold },
                          { id: 'ML', label: 'ML', color: '#60A5FA' },
                          { id: 'SPREAD', label: 'SPREAD', color: '#A78BFA' },
                          { id: 'TOTAL', label: 'TOTALS', color: '#34D399' },
                        ].map(opt => (
                          <button key={opt.id} onClick={() => setAgsuMarket(opt.id)} style={{
                            padding: '0.22rem 0.6rem', borderRadius: '6px', cursor: 'pointer',
                            ...T.micro, fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.04em',
                            border: agsuMarket === opt.id ? `1px solid ${opt.color}66` : `1px solid ${B.border}`,
                            background: agsuMarket === opt.id ? `${opt.color}1f` : 'transparent',
                            color: agsuMarket === opt.id ? opt.color : B.textMuted,
                            transition: 'all 0.2s ease',
                          }}>{opt.label}</button>
                        ))}
                      </div>

                      {!hasData && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                          <span style={{ ...T.label, color: B.textMuted }}>Loading AGS-U performance data…</span>
                        </div>
                      )}

                      {/* Filtered-to-zero empty state — single body-level
                          message that replaces the 4 per-panel "no data"
                          fallbacks (PROFIT '—', Best/Worst threshold,
                          Equity Curve '< 2 days', Recent Picks 'no
                          match'). When the user hits zero with active
                          filters we offer a one-click reset. */}
                      {hasData && agsuPicks.length === 0 && (
                        <div style={{
                          textAlign: 'center', padding: '2.5rem 1.5rem',
                          borderRadius: '10px',
                          background: 'linear-gradient(140deg, rgba(212,175,55,0.04) 0%, rgba(15,23,42,0.45) 100%)',
                          border: `1px dashed ${B.borderSubtle}`,
                        }}>
                          <div style={{ ...T.micro, color: B.gold, fontWeight: 900, letterSpacing: '0.12em', fontSize: '0.58rem', marginBottom: '0.5rem' }}>
                            ◆ NO PICKS MATCH
                          </div>
                          <div style={{ ...T.body, color: B.textSec, marginBottom: '0.85rem', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                            {hasActiveSubFilter
                              ? <>No <span style={{ color: B.text, fontWeight: 700 }}>{scopeLabel}</span> picks. Try a wider date range or a different sport.</>
                              : isV12Scope
                                ? <>No v12 picks in this slice yet. Switch to <span style={{ color: B.text, fontWeight: 700 }}>All Time</span> to see historical results.</>
                                : <>No graded picks in this slice yet.</>
                            }
                          </div>
                          {hasActiveSubFilter && (
                            <button
                              onClick={() => { setAgsuDateRange('all'); setAgsuSport('ALL'); setAgsuMarket('ALL'); }}
                              style={{
                                padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer',
                                ...T.micro, fontWeight: 800, fontSize: '0.62rem',
                                border: `1px solid ${B.goldBorder}`,
                                background: `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`,
                                color: B.gold,
                                letterSpacing: '0.06em',
                              }}
                            >
                              CLEAR FILTERS
                            </button>
                          )}
                        </div>
                      )}

                      {hasData && agsuPicks.length > 0 && (
                        <>
                          {/* ── Robinhood-style scoreboard + equity hero ──
                              The cumulative-profit curve is the centerpiece.
                              Giant profit number up top, a change line with
                              ROI + dollar translation beneath, then the
                              full-width equity chart, then a time-range
                              selector under the chart (Robinhood pattern).
                              Mobile: everything stacks — number scales down,
                              chart shortens, range pills stretch full-width. */}
                          {(() => {
                            const dollarProfit = totalProfitLive * 100;
                            const dollarSign = dollarProfit >= 0 ? '+$' : '-$';
                            const dollarFmt = Math.abs(dollarProfit).toLocaleString('en-US', { maximumFractionDigits: 0 });
                            const profitGradient = totalProfitLive >= 0
                              ? `linear-gradient(135deg, ${B.green} 0%, #34D399 100%)`
                              : `linear-gradient(135deg, ${B.red} 0%, #F87171 100%)`;
                            const { curve, isProfit, minCum, maxCum, bestDay, worstDay } = eq;
                            // zero-crossing split point (fraction from top of plot where cum = 0)
                            const gradOff = (() => {
                              if (maxCum <= 0) return 0;        // entirely at/below 0 → all red
                              if (minCum >= 0) return 1;        // entirely at/above 0 → all green
                              return maxCum / (maxCum - minCum);
                            })();
                            const lastCum = curve.length ? curve[curve.length - 1].cum : 0;
                            const lastPos = lastCum >= 0;
                            const lastColor = lastPos ? B.green : B.red;
                            // calm current-value marker pinned to the most recent point
                            const renderEndDot = (dp) => {
                              if (dp == null || dp.index !== curve.length - 1 || dp.cx == null || dp.cy == null) return null;
                              return (
                                <g key="eq-end-dot" style={{ pointerEvents: 'none' }}>
                                  <circle cx={dp.cx} cy={dp.cy} r={6} fill="none" stroke={lastColor} strokeOpacity={0.25} strokeWidth={1.5} />
                                  <circle cx={dp.cx} cy={dp.cy} r={3.2} fill={lastColor} stroke={B.bg} strokeWidth={1.5} />
                                </g>
                              );
                            };
                            const daysLive = (() => {
                              const dates = agsuPicks.map(p => p.date).filter(Boolean).sort();
                              if (dates.length === 0) return null;
                              try {
                                const first = new Date(dates[0] + 'T12:00:00').getTime();
                                const last = new Date(dates[dates.length - 1] + 'T12:00:00').getTime();
                                return Math.max(1, Math.round((last - first) / 86400000) + 1);
                              } catch { return null; }
                            })();
                            return (
                              <div
                                className="sf-glass"
                                style={{
                                position: 'relative', overflow: 'hidden',
                                padding: isMobile ? '1.15rem 1.1rem 1rem' : '1.5rem 1.6rem 1.25rem',
                                borderRadius: '16px', marginBottom: '0.875rem',
                                // Calm layered surface: a whisper of top-light + a near-
                                // neutral elevated plane. No color wash — depth comes from
                                // the surface gradient + soft shadow, not a glow.
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 16%, rgba(255,255,255,0) 48%), linear-gradient(180deg, rgba(30,36,49,0.72) 0%, rgba(18,22,31,0.78) 100%)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                // Soft, real elevation: crisp top inner highlight + a large
                                // diffuse ambient shadow + a tighter contact shadow.
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.4), 0 24px 56px -28px rgba(0,0,0,0.85)',
                              }}>
                                {/* eyebrow: label + LIVE + sample */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                                  <span style={{ ...T.micro, color: B.gold, fontWeight: 900, letterSpacing: '0.12em', fontSize: '0.56rem' }}>
                                    ◆ TOTAL PROFIT · {scopeLabel}
                                  </span>
                                  {isV12Scope && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: B.greenDim, border: `1px solid ${B.green}33` }}>
                                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: B.green, boxShadow: `0 0 6px ${B.green}`, animation: 'pulse 2s ease-in-out infinite' }} />
                                      <span style={{ ...T.micro, color: B.green, fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.1em' }}>LIVE</span>
                                    </span>
                                  )}
                                  {daysLive != null && (
                                    <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.56rem', letterSpacing: '0.04em' }}>
                                      <span style={{ color: B.textSec, fontWeight: 800 }}>{daysLive}</span>d · <span style={{ color: B.textSec, fontWeight: 800 }}>{totalGradedLive}</span> graded
                                    </span>
                                  )}
                                </div>

                                {/* giant profit number */}
                                <div style={{ lineHeight: 1 }}>
                                  {totalGradedLive === 0 ? (
                                    <span style={{ display: 'inline-block', fontSize: isMobile ? '2.7rem' : '3.6rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', color: B.textSec }}>—</span>
                                  ) : (
                                    <CountUp value={totalProfitLive} format={(n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}u`} style={{
                                      display: 'inline-block', fontSize: isMobile ? '2.7rem' : '3.6rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em',
                                      fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                                      color: totalProfitLive >= 0 ? B.green : B.red,
                                      backgroundImage: profitGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                    }} />
                                  )}
                                </div>

                                {/* change line: ROI chip + dollar translation */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginTop: '0.5rem', fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' }}>
                                  {totalGradedLive === 0 ? (
                                    <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.7rem' }}>no graded picks yet</span>
                                  ) : (
                                    <>
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.18rem 0.5rem', borderRadius: '6px', background: liveRoi >= 0 ? B.greenDim : B.redDim, border: `1px solid ${liveRoi >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                                        {liveRoi >= 0 ? <TrendingUp size={12} color={B.green} /> : <TrendingDown size={12} color={B.red} />}
                                        <span style={{ ...T.micro, fontWeight: 900, fontSize: '0.72rem', color: liveRoi >= 0 ? B.green : B.red }}>{liveRoi >= 0 ? '+' : ''}{liveRoi.toFixed(1)}% ROI</span>
                                      </span>
                                      <span style={{ ...T.micro, color: B.textSec, fontSize: '0.68rem' }}>
                                        ≈ <span style={{ color: B.text, fontWeight: 800 }}>{dollarSign}{dollarFmt}</span> <span style={{ color: B.textMuted }}>@ $100/unit</span>
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* equity chart — calm, premium analytics centerpiece */}
                                {curve.length >= 2 ? (
                                  <div style={{ marginTop: '1rem', marginLeft: isMobile ? '-0.4rem' : '-0.6rem', marginRight: isMobile ? '-0.4rem' : '-0.6rem' }}>
                                    <ResponsiveContainer width="100%" height={isMobile ? 168 : 226}>
                                      <AreaChart data={curve} margin={{ top: 12, right: 10, left: 6, bottom: 0 }}>
                                        <defs>
                                          {/* split fill — green above the zero line, red below */}
                                          <linearGradient id="agsuFillSplit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0" stopColor={B.green} stopOpacity={0.16} />
                                            <stop offset={Math.max(0, gradOff - 0.0001)} stopColor={B.green} stopOpacity={0.01} />
                                            <stop offset={gradOff} stopColor={B.red} stopOpacity={0.01} />
                                            <stop offset="1" stopColor={B.red} stopOpacity={0.15} />
                                          </linearGradient>
                                          {/* split stroke — line color flips at the zero crossing */}
                                          <linearGradient id="agsuStrokeSplit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0" stopColor={B.green} />
                                            <stop offset={Math.max(0, gradOff - 0.0001)} stopColor={B.green} />
                                            <stop offset={gradOff} stopColor={B.red} />
                                            <stop offset="1" stopColor={B.red} />
                                          </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="dateMs" type="number" scale="time" domain={['dataMin', 'dataMax']} tick={{ fill: B.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={isMobile ? 30 : 50} tickFormatter={(ms) => { try { return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return ''; } }} />
                                        <YAxis hide domain={[Math.floor(minCum) - 1, Math.ceil(maxCum) + 1]} />
                                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.10)" strokeDasharray="4 4" />
                                        <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1 }} content={({ active, payload }) => {
                                          if (!active || !payload?.[0]) return null;
                                          const d = payload[0].payload;
                                          const dayRoi = d.dayStake > 0 ? (d.dayPnl / d.dayStake) * 100 : null;
                                          const dayColor = d.dayPnl > 0 ? B.green : d.dayPnl < 0 ? B.red : B.textSec;
                                          const cumColor = d.cum > 0 ? B.green : d.cum < 0 ? B.red : B.textSec;
                                          return (
                                            <div style={{ background: 'rgba(17,24,39,0.96)', border: `1px solid ${dayColor}55`, borderRadius: '8px', padding: '0.55rem 0.7rem', backdropFilter: 'blur(8px)', boxShadow: '0 8px 24px rgba(0,0,0,0.45)', minWidth: 190 }}>
                                              <div style={{ fontSize: '0.6rem', color: B.textMuted, marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: B.text, fontWeight: 800 }}>{d.dateLabel}</span>
                                                <span>{d.picks} pick{d.picks === 1 ? '' : 's'}</span>
                                              </div>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '0.58rem', color: B.textMuted }}>{d.wins}-{d.losses}{dayRoi != null ? ` · ${dayRoi >= 0 ? '+' : ''}${dayRoi.toFixed(1)}%` : ''}</span>
                                                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: dayColor, fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' }}>{d.dayPnl >= 0 ? '+' : ''}{d.dayPnl.toFixed(2)}u</span>
                                              </div>
                                              <div style={{ marginTop: '0.3rem', paddingTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <span style={{ fontSize: '0.54rem', color: B.textMuted, letterSpacing: '0.06em' }}>CUM EOD</span>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: cumColor, fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' }}>{d.cum >= 0 ? '+' : ''}{d.cum.toFixed(2)}u</span>
                                              </div>
                                            </div>
                                          );
                                        }} />
                                        <Area type="monotone" dataKey="cum" baseValue={0} stroke="url(#agsuStrokeSplit)" strokeWidth={2} fill="url(#agsuFillSplit)" isAnimationActive={true} animationDuration={850} dot={renderEndDot} activeDot={{ r: 4, fill: lastColor, stroke: B.bg, strokeWidth: 2 }} />
                                      </AreaChart>
                                    </ResponsiveContainer>
                                  </div>
                                ) : (
                                  <div style={{ marginTop: '0.9rem', padding: '1.5rem 1rem', textAlign: 'center', ...T.micro, color: B.textMuted, fontStyle: 'italic', fontSize: '0.62rem' }}>
                                    Equity curve appears once 2+ days are graded.
                                  </div>
                                )}

                                {/* time-range selector under chart (Robinhood) */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                  {[
                                    { id: 'today', label: 'Today' },
                                    { id: 'yesterday', label: 'Yest' },
                                    { id: '7d', label: '7D' },
                                    { id: '30d', label: '30D' },
                                    { id: 'all', label: 'All' },
                                  ].map(opt => {
                                    const active = agsuDateRange === opt.id;
                                    return (
                                      <button key={opt.id} onClick={() => setAgsuDateRange(opt.id)} style={{
                                        flex: isMobile ? '1 1 0' : '0 0 auto',
                                        padding: '0.3rem 0.7rem', borderRadius: '7px', cursor: 'pointer',
                                        ...T.micro, fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.04em',
                                        border: active ? `1px solid ${(isProfit ? B.green : B.red)}55` : `1px solid ${B.border}`,
                                        background: active ? (isProfit ? B.greenDim : B.redDim) : 'transparent',
                                        color: active ? (isProfit ? B.green : B.red) : B.textMuted,
                                        transition: 'all 0.18s ease',
                                      }}>{opt.label}</button>
                                    );
                                  })}
                                  {bestDay && worstDay && !isMobile && (
                                    <span style={{ marginLeft: 'auto', ...T.micro, color: B.textMuted, fontSize: '0.55rem', letterSpacing: '0.03em', fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' }}>
                                      best <span style={{ color: B.green, fontWeight: 700 }}>+{bestDay.dayPnl.toFixed(2)}u</span> · worst <span style={{ color: B.red, fontWeight: 700 }}>{worstDay.dayPnl.toFixed(2)}u</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* ── KPI stat rail ──────────────────────────
                              Compact uniform tiles for the supporting
                              metrics that used to be the RECORD/WIN%/ROI
                              trio, now expanded to also surface RISKED,
                              PENDING, PEAK and DRAWDOWN. Desktop: 6 across.
                              Mobile: 3×2 grid. Count-up on numeric values. */}
                          {(() => {
                            const tiles = [
                              { label: 'WIN %',    value: totalGradedLive === 0 ? '—' : <CountUp value={liveWinPct} format={(n) => `${n.toFixed(1)}%`} />, sub: 'breakeven 52.4%', color: liveWinPct >= 52.4 ? B.green : liveWinPct >= 50 ? B.textSec : B.red },
                              { label: 'RECORD',   value: recordTxt, sub: `${totalGradedLive} graded`, color: B.text },
                              { label: 'RISKED',   value: <CountUp value={totalUnitsLive} format={(n) => `${n.toFixed(1)}u`} />, sub: 'total staked', color: B.text },
                              { label: 'PENDING',  value: livePending, sub: 'open picks', color: livePending > 0 ? B.gold : B.textSec },
                              { label: 'PEAK',     value: eq.curve.length ? <CountUp value={eq.peak.cum} format={(n) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}u`} /> : '—', sub: eq.curve.length ? eq.peak.dateLabel : 'no data', color: B.green },
                              { label: 'DRAWDOWN', value: eq.curve.length ? <CountUp value={eq.drawdown} format={(n) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}u`} /> : '—', sub: 'from peak', color: eq.drawdown < 0 ? B.red : B.textSec },
                            ];
                            return (
                              <div className="sf-stagger" style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
                                gap: '0.5rem', marginBottom: '0.875rem',
                              }}>
                                {tiles.map(t => (
                                  <div key={t.label} className="sf-card" style={{
                                    padding: '0.6rem 0.65rem', borderRadius: '11px',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(15,23,42,0.32) 100%)',
                                    border: `1px solid ${B.borderSubtle}`,
                                    position: 'relative', overflow: 'hidden',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.035)',
                                  }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '30%', height: '1px', background: `linear-gradient(90deg, ${B.gold} 0%, transparent 100%)`, opacity: 0.35, pointerEvents: 'none' }} />
                                    <div style={{ ...T.micro, color: B.textMuted, fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.5rem' }}>{t.label}</div>
                                    <div style={{ fontSize: isMobile ? '1.05rem' : '1.2rem', fontWeight: 900, color: t.color, lineHeight: 1.1, marginTop: '0.3rem', letterSpacing: '-0.01em', fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' }}>{t.value}</div>
                                    <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.5rem', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.sub}</div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}

                          {/* ── Band 2: Best/Worst tier highlight ──
                              Two cards instead of six. The lay user sees
                              at a glance which conviction bucket is
                              actually paying off and which one is
                              dragging. "Show all tiers" expands the
                              original 6-card matrix for power users.
                              Best/Worst are chosen by ROI among tiers
                              with at least 5 graded picks (smaller
                              samples are too noisy to crown a "best").
                              If no tier clears the threshold yet, we
                              fall back to the highest-volume tier so
                              the user always sees a concrete answer. */}
                          {(() => {
                            const MIN_GRADED = 5;
                            const tierStats = TIER_DEFS.map(t => {
                              const b = tierAgg[t.key];
                              const graded = b.wins + b.losses + b.pushes;
                              const tierRoi = b.units > 0 ? (b.profit / b.units) * 100 : null;
                              return { key: t.key, size: t.size, b, graded, tierRoi };
                            });
                            const qualified = tierStats.filter(s => s.graded >= MIN_GRADED && s.tierRoi != null);
                            const fallback = tierStats.filter(s => s.graded > 0)
                              .sort((a, b) => b.graded - a.graded);
                            const best = qualified.length > 0
                              ? [...qualified].sort((a, b) => b.tierRoi - a.tierRoi)[0]
                              : fallback[0];
                            const TierHighlight = ({ slot, stat, fallbackMsg }) => {
                              if (!stat) {
                                return (
                                  <div style={{
                                    padding: '0.85rem 1rem', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.015)',
                                    border: `1px solid ${B.borderSubtle}`,
                                    minHeight: '110px', display: 'flex', flexDirection: 'column',
                                  }}>
                                    <div style={{ ...T.micro, color: B.textMuted, fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.52rem', marginBottom: '0.4rem' }}>
                                      {slot}
                                    </div>
                                    <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.62rem', fontStyle: 'italic' }}>
                                      {fallbackMsg}
                                    </div>
                                  </div>
                                );
                              }
                              const meta = STAKE_TIER_META[stat.key] || { label: stat.key, color: B.gold };
                              const slotIsBest = slot === 'BEST TIER';
                              const headColor = slotIsBest ? B.green : B.red;
                              const headTint = slotIsBest ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)';
                              const roiPositive = stat.tierRoi != null && stat.tierRoi >= 0;
                              return (
                                <div className="sf-card" style={{
                                  padding: isMobile ? '0.95rem 1rem' : '1.05rem 1.15rem 1rem 1.2rem',
                                  borderRadius: '12px',
                                  background: `linear-gradient(140deg, ${headTint} 0%, rgba(255,255,255,0.02) 35%, rgba(15,23,42,0.40) 100%)`,
                                  border: `1px solid ${meta.color}40`,
                                  position: 'relative', overflow: 'hidden',
                                  boxShadow: `0 10px 30px -14px ${meta.color}55, inset 0 1px 0 rgba(255,255,255,0.04)`,
                                }}>
                                  {/* Tier-color ribbon (left edge) */}
                                  <div style={{
                                    position: 'absolute', top: 0, bottom: 0, left: 0,
                                    width: '3px', background: meta.color, boxShadow: `0 0 8px ${meta.color}99`,
                                  }} />
                                  {/* Gold corner glint — mirrors hero/support card device for unity */}
                                  <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '35%', height: '1px',
                                    background: `linear-gradient(90deg, ${B.gold} 0%, transparent 100%)`,
                                    opacity: 0.4, pointerEvents: 'none',
                                  }} />
                                  {/* Eyebrow row — slot caption (left) + trend icon (right).
                                      Tier label moves below the ROI hero so the eyebrow line
                                      reads cleanly as "BEST / WORST" without competing
                                      typography. */}
                                  <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    marginBottom: '0.5rem', gap: '0.5rem',
                                  }}>
                                    <span style={{ ...T.micro, color: headColor, fontWeight: 900, letterSpacing: '0.12em', fontSize: '0.55rem' }}>
                                      ◆ {slot}
                                    </span>
                                    {roiPositive
                                      ? <TrendingUp size={13} color={B.green} />
                                      : <TrendingDown size={13} color={B.red} />}
                                  </div>
                                  {/* HERO: ROI as the big number */}
                                  <div style={{
                                    fontSize: isMobile ? '1.95rem' : '2.2rem',
                                    fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em',
                                    color: roiPositive ? B.green : B.red,
                                    fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                                  }}>
                                    {stat.tierRoi == null ? '—' : <CountUp value={stat.tierRoi} format={(n) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`} />}
                                  </div>
                                  {/* Tier identity caption — first thing after the hero number */}
                                  <div style={{
                                    ...T.micro, fontWeight: 800, fontSize: '0.6rem',
                                    color: meta.color, letterSpacing: '0.08em',
                                    marginTop: '0.4rem',
                                  }}>
                                    {meta.label}{meta.sub ? <span style={{ color: B.textMuted, fontWeight: 600, letterSpacing: '0.03em' }}> · {meta.sub}</span> : null}{stat.size ? <span style={{ color: B.textMuted, fontWeight: 600, letterSpacing: '0.04em' }}> · {stat.size}/play</span> : null}
                                  </div>
                                  {/* Sub-line: record · profit · graded.
                                      Reformatted into a single rhythmic line with consistent
                                      muted dot separators and matched type sizes — eliminates
                                      the visual "squeeze" the previous version had. */}
                                  <div style={{
                                    display: 'flex', alignItems: 'baseline', gap: '0.45rem',
                                    marginTop: '0.3rem', flexWrap: 'wrap',
                                    fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                                  }}>
                                    <span style={{ ...T.micro, color: B.text, fontWeight: 800, fontSize: '0.7rem' }}>
                                      {stat.b.wins}-{stat.b.losses}{stat.b.pushes > 0 ? `-${stat.b.pushes}` : ''}
                                    </span>
                                    <span style={{ ...T.micro, color: B.textSubtle, fontSize: '0.65rem' }}>·</span>
                                    <span style={{
                                      ...T.micro, fontWeight: 800, fontSize: '0.7rem',
                                      color: stat.b.profit >= 0 ? B.green : B.red,
                                    }}>
                                      {stat.b.profit >= 0 ? '+' : ''}{stat.b.profit.toFixed(2)}u
                                    </span>
                                    <span style={{ ...T.micro, color: B.textSubtle, fontSize: '0.65rem' }}>·</span>
                                    <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.62rem' }}>
                                      {stat.graded} graded
                                    </span>
                                  </div>
                                </div>
                              );
                            };
                            return (
                              <div style={{ marginBottom: '0.875rem' }}>
                                {/* Unified section header — ◆ eyebrow on the left,
                                    expand toggle on the right, and a hairline gold
                                    rule beneath. Same device used by Equity Curve
                                    and Recent Picks below so the dashboard reads as
                                    one document, not three stacked widgets. */}
                                <div style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  marginBottom: '0.45rem', paddingBottom: '0.4rem',
                                  borderBottom: `1px solid ${B.borderSubtle}`,
                                  backgroundImage: `linear-gradient(90deg, ${B.gold}22 0%, transparent 60%)`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundSize: '100% 1px',
                                  backgroundPosition: 'bottom left',
                                }}>
                                  <span style={{ ...T.micro, color: B.gold, fontWeight: 900, letterSpacing: '0.12em', fontSize: '0.58rem' }}>
                                    ◆ TIER PERFORMANCE
                                  </span>
                                  <button onClick={() => setShowAgsuTiers(p => !p)} style={{
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                                    padding: '0.1rem 0.3rem',
                                  }}>
                                    <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem', letterSpacing: '0.05em' }}>
                                      {showAgsuTiers ? 'HIDE ALL TIERS' : 'SHOW ALL TIERS'}
                                    </span>
                                    {showAgsuTiers ? <ChevronUp size={11} color={B.textMuted} /> : <ChevronDown size={11} color={B.textMuted} />}
                                  </button>
                                </div>
                                <div className="sf-stagger" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                                  <TierHighlight slot="BEST TIER" stat={best} fallbackMsg={`No tier has ≥${MIN_GRADED} graded picks yet`} />
                                </div>

                                {showAgsuTiers && (
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : `repeat(${TIER_DEFS.length}, 1fr)`,
                                    gap: '0.5rem', marginTop: '0.625rem',
                                  }}>
                                    {TIER_DEFS.map(t => {
                                      const b = tierAgg[t.key];
                                      const meta = STAKE_TIER_META[t.key];
                                      const graded = b.wins + b.losses + b.pushes;
                                      const tierRoi = b.units > 0 ? (b.profit / b.units) * 100 : 0;
                                      const winPct = (b.wins + b.losses) > 0 ? (b.wins / (b.wins + b.losses)) * 100 : null;
                                      const hasActivity = graded > 0 || b.pending > 0 || b.tracked > 0;
                                      const profitColor = b.profit > 0 ? B.green : b.profit < 0 ? B.red : B.textSec;
                                      const roiColor = tierRoi > 0 ? B.green : tierRoi < 0 ? B.red : B.textSec;
                                      return (
                                        <div key={t.key} style={{
                                          padding: '0.55rem 0.65rem 0.5rem 0.8rem',
                                          borderRadius: '7px',
                                          background: hasActivity
                                            ? 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(15,23,42,0.5) 100%)'
                                            : 'rgba(255,255,255,0.015)',
                                          border: `1px solid ${hasActivity ? `${meta.color}33` : B.borderSubtle}`,
                                          opacity: hasActivity ? 1 : 0.45,
                                          position: 'relative', overflow: 'hidden',
                                        }}>
                                          {hasActivity && (
                                            <div style={{
                                              position: 'absolute', top: 0, bottom: 0, left: 0,
                                              width: '3px', background: meta.color, boxShadow: `0 0 6px ${meta.color}66`,
                                            }} />
                                          )}
                                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.25rem', marginBottom: '0.35rem' }}>
                                            <span style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0 }}>
                                              <span style={{ ...T.micro, fontWeight: 900, color: meta.color, fontSize: '0.6rem', letterSpacing: '0.06em' }}>
                                                {meta.label}
                                              </span>
                                              {meta.sub && (
                                                <span style={{ ...T.micro, fontWeight: 700, color: B.textMuted, fontSize: '0.46rem', letterSpacing: '0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                  {meta.sub}
                                                </span>
                                              )}
                                            </span>
                                            <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.5rem', fontWeight: 700, padding: '0.08rem 0.25rem', borderRadius: '3px', background: 'rgba(0,0,0,0.25)', flexShrink: 0 }}>
                                              {t.size}
                                            </span>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', lineHeight: 1 }}>
                                            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: B.text, fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' }}>
                                              {b.wins}-{b.losses}{b.pushes > 0 ? `-${b.pushes}` : ''}
                                            </span>
                                          </div>
                                          {winPct != null && (
                                            <div style={{
                                              height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)',
                                              overflow: 'hidden', position: 'relative', margin: '0.3rem 0 0.25rem',
                                            }}>
                                              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.25)' }} />
                                              <div style={{
                                                height: '100%', width: `${winPct}%`, borderRadius: '2px',
                                                background: winPct >= 50 ? `linear-gradient(90deg, ${B.green}, ${B.green}cc)` : `linear-gradient(90deg, ${B.red}, ${B.red}cc)`,
                                              }} />
                                            </div>
                                          )}
                                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.3rem', marginTop: '0.25rem' }}>
                                            <span style={{ ...T.micro, fontWeight: 800, fontSize: '0.68rem', color: graded > 0 ? roiColor : B.textMuted, fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' }}>
                                              {graded === 0 ? '—' : `${tierRoi >= 0 ? '+' : ''}${tierRoi.toFixed(1)}%`}
                                            </span>
                                            <span style={{ ...T.micro, fontWeight: 800, fontSize: '0.68rem', color: graded > 0 ? profitColor : B.textMuted, fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' }}>
                                              {graded === 0 ? '' : `${b.profit >= 0 ? '+' : ''}${b.profit.toFixed(2)}u`}
                                            </span>
                                          </div>
                                          {(b.pending > 0 || b.tracked > 0) && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.3rem' }}>
                                              {b.pending > 0 && (
                                                <span style={{ ...T.micro, fontWeight: 700, fontSize: '0.48rem', letterSpacing: '0.05em', padding: '0.08rem 0.25rem', borderRadius: '3px', color: B.textSec, background: 'rgba(255,255,255,0.04)' }}>
                                                  +{b.pending} PEND
                                                </span>
                                              )}
                                              {b.tracked > 0 && (
                                                <span style={{ ...T.micro, fontWeight: 700, fontSize: '0.48rem', letterSpacing: '0.05em', padding: '0.08rem 0.25rem', borderRadius: '3px', color: '#60A5FA', background: 'rgba(96,165,250,0.08)' }}>
                                                  +{b.tracked} TRK
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* ── Bankroll lens caption ──────────────────
                              The equity curve is now the hero centerpiece
                              above, so this slim line is all that remains of
                              the old standalone chart band — it keeps the
                              dollar storytelling ($10k → today at $100/u)
                              without rendering a second chart. */}
                          {eq.curve.length >= 2 && (
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                              flexWrap: 'wrap', marginBottom: '0.875rem',
                              padding: '0.5rem 0.7rem', borderRadius: '9px',
                              background: 'rgba(255,255,255,0.018)', border: `1px dashed ${B.borderSubtle}`,
                              fontSize: '0.6rem', color: B.textSec, letterSpacing: '0.03em',
                              fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                            }}>
                              <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.52rem' }}>BANKROLL LENS</span>
                              <span>{eq.fmt$(eq.STARTING_BANKROLL)} → <span style={{ color: eq.isProfit ? B.green : B.red, fontWeight: 800 }}>{eq.fmt$(eq.dollarsCurrent)}</span></span>
                              <span style={{ color: B.textMuted }}>at a steady $100/unit stake</span>
                            </div>
                          )}

                          {/* ── Band 5: Recent picks ledger (full width) ── */}
                          <div>
                            {/* Recent Picks bar — uses the same unified section-header
                                pattern as TIER PERFORMANCE and EQUITY CURVE above
                                (◆ eyebrow + count chip + gold hairline). The card
                                background is dropped when collapsed so the row reads
                                as a section header rather than a third heavy panel. */}
                            <div className={showAgsuLedger ? 'sf-glass' : undefined} style={{
                              padding: showAgsuLedger ? '0.75rem 0.875rem' : '0',
                              borderRadius: '12px',
                              background: showAgsuLedger ? 'rgba(15,23,42,0.32)' : 'transparent',
                              border: showAgsuLedger ? `1px solid ${B.borderSubtle}` : 'none',
                              boxShadow: showAgsuLedger ? 'inset 0 1px 0 rgba(255,255,255,0.03)' : 'none',
                            }}>
                              <button
                                onClick={() => setShowAgsuLedger(p => !p)}
                                style={{
                                  width: '100%',
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: showAgsuLedger ? '0 0 0.4rem' : '0.5rem 0.4rem 0.5rem 0.1rem',
                                  backgroundColor: 'transparent',
                                  border: 'none', cursor: 'pointer',
                                  borderBottom: `1px solid ${B.borderSubtle}`,
                                  backgroundImage: `linear-gradient(90deg, ${B.gold}22 0%, transparent 60%)`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundSize: '100% 1px',
                                  backgroundPosition: 'bottom left',
                                  marginBottom: showAgsuLedger ? '0.5rem' : 0,
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <span style={{ ...T.micro, color: B.gold, fontWeight: 900, letterSpacing: '0.12em', fontSize: '0.58rem' }}>
                                  ◆ RECENT AGS-U PICKS
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{ ...T.micro, color: B.textSec, fontSize: '0.58rem', letterSpacing: '0.04em' }}>
                                    <span style={{ color: B.text, fontWeight: 800 }}>{ledgerRows.length}</span> of {agsuPicks.length}
                                  </span>
                                  {showAgsuLedger ? <ChevronUp size={12} color={B.textMuted} /> : <ChevronDown size={12} color={B.textMuted} />}
                                </span>
                              </button>
                              {showAgsuLedger && ledgerRows.length === 0 && (
                                <div style={{ ...T.micro, color: B.textMuted, padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
                                  No picks match current filters.
                                </div>
                              )}
                              {showAgsuLedger && (
                              <div className="sf-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                {ledgerRows.map((p, i) => {
                                  const meta = AGS_TIER_META[p._resolvedTier] || AGS_TIER_META.UNKNOWN;
                                  const drv = topDriverOf(p);
                                  const isWin = p.outcome === 'WIN';
                                  const isLoss = p.outcome === 'LOSS';
                                  const isPush = p.outcome === 'PUSH';
                                  const isPending = !p.outcome;
                                  const isTracked = p.tracked;
                                  // Outcome chip — pill-shaped, color-coded
                                  // status badge that reads like a betting
                                  // ticket result rather than a plain text
                                  // cell. The chip carries both the label
                                  // (WIN/LOSS/PUSH/PEND/TRK) and the unit
                                  // delta so the eye lands on one bound
                                  // glyph per row instead of a comma'd
                                  // sentence.
                                  const chip = isTracked
                                    ? { label: 'TRK',  color: '#60A5FA', bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.30)', delta: '' }
                                    : isPending
                                    ? { label: 'PEND', color: B.textSec, bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.20)', delta: '' }
                                    : isPush
                                    ? { label: 'PUSH', color: B.textSec, bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.20)', delta: '0.00u' }
                                    : isWin
                                    ? { label: 'WIN',  color: B.green, bg: B.greenDim, border: 'rgba(16,185,129,0.30)', delta: `+${(p.profit || 0).toFixed(2)}u` }
                                    : isLoss
                                    ? { label: 'LOSS', color: B.red, bg: B.redDim, border: 'rgba(239,68,68,0.30)', delta: `${(p.profit || 0).toFixed(2)}u` }
                                    : { label: '—', color: B.textMuted, bg: 'transparent', border: B.borderSubtle, delta: '' };
                                  return (
                                    <div
                                      key={i}
                                      className="agsu-ledger-row"
                                      style={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? '52px 1fr auto' : '52px 1fr 88px auto',
                                        alignItems: 'center', gap: isMobile ? '0.55rem' : '0.7rem',
                                        padding: '0.45rem 0.6rem 0.45rem 0.65rem',
                                        borderRadius: '7px',
                                        background: 'linear-gradient(90deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)',
                                        borderLeft: `3px solid ${meta.color}`,
                                        boxShadow: `0 0 12px -8px ${meta.color}66`,
                                        transition: 'transform 0.15s ease, background 0.15s ease',
                                      }}
                                    >
                                      <span style={{
                                        ...T.micro, fontWeight: 900, color: meta.color,
                                        fontSize: '0.58rem', letterSpacing: '0.06em',
                                      }}>
                                        {meta.short}
                                      </span>
                                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                        <div style={{
                                          ...T.micro, color: B.text, fontWeight: 700, fontSize: '0.68rem',
                                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                          letterSpacing: '-0.005em',
                                        }}>
                                          {p.team || (p.away && p.home ? `${p.away} @ ${p.home}` : '—')}
                                        </div>
                                        <div style={{
                                          ...T.micro, color: B.textMuted, fontSize: '0.55rem',
                                          fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                                        }}>
                                          {p.date} · {p.sport} · {(p.marketType || 'ml').toUpperCase()}
                                          {drv ? <span style={{ color: B.textSubtle }}>{`  ·  ${drv.label} ${drv.z >= 0 ? '+' : ''}${drv.z.toFixed(1)}`}</span> : null}
                                        </div>
                                      </div>
                                      {!isMobile && (
                                        <span style={{
                                          ...T.micro, color: B.textSec, fontSize: '0.6rem',
                                          textAlign: 'right', letterSpacing: '0.02em',
                                          fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                                        }}>
                                          {p.v8_ags != null ? (
                                            <>
                                              <span style={{ color: B.textMuted, fontSize: '0.5rem', letterSpacing: '0.08em', marginRight: '0.3rem' }}>SCORE</span>
                                              {p.v8_ags >= 0 ? '+' : ''}{p.v8_ags.toFixed(2)}
                                            </>
                                          ) : '—'}
                                        </span>
                                      )}
                                      {/* Outcome chip — single bound glyph */}
                                      <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                        padding: '0.18rem 0.45rem', borderRadius: '5px',
                                        background: chip.bg,
                                        border: `1px solid ${chip.border}`,
                                        fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                                      }}>
                                        <span style={{
                                          ...T.micro, color: chip.color,
                                          fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.08em',
                                        }}>
                                          {chip.label}
                                        </span>
                                        {chip.delta && (
                                          <span style={{
                                            ...T.micro, color: chip.color,
                                            fontSize: '0.65rem', fontWeight: 800,
                                            letterSpacing: '-0.005em',
                                          }}>
                                            {chip.delta}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              )}
                            </div>

                          </div>

                          {/* Footer microcopy */}
                          <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.75rem', fontSize: '0.55rem', opacity: 0.6, textAlign: 'right' }}>
                            {agsuPicks.length} pick{agsuPicks.length === 1 ? '' : 's'}
                            {isV12Scope ? ` since ${V12_LAUNCH}` : ' across every era'}
                            {isAgsuFiltered ? ' · filtered' : ''}
                          </div>
                        </>
                      )}
                      </div>{/* /atmosphere zIndex wrapper */}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Pre-v12 Archive bar removed 2026-06-11. All historical data
                is now reachable through the v12 dashboard's era toggle
                (v12 LIVE ↔ All Time). One bar, one source of truth. */}

            {/* ─── Sharp Positions Section ─── */}
            {/* v12 fix: always render this section. The Locked Picks list
                (sortBy === 'locked') lives inside it and pulls from Firestore,
                NOT from live sharpPositions. Gating on gamesWithPos > 0 used
                to hide the user's entire Locked Picks tab any time the live
                position scanner came back empty (e.g. between cycles, or
                when only the picks-creating sports had no live wallets that
                cycle). The SharpPositionCards div below is already hidden
                via inline style when sortBy === 'locked', so always-render
                is safe. */}
            {(() => {
              const allPosGames = [];
              const nowMs = Date.now();
              // v12 sort support — the cards DISPLAY the v12 tier (cron
              // stamp first, browser compute fallback), so the Rating
              // sort must rank by the same value. The legacy `sr.stars`
              // (v8 rating) stays as `_stars` for games v12 can't score.
              const v12SortCal = getAgsCalibration();
              const v12SortStatsFn = (walletProfiles && walletProfiles.size > 0)
                ? buildWalletPriorStatsFnForUI(walletProfiles)
                : null;
              const v12SortToday = todayET();
              for (const sport of ['NHL', 'CBB', 'MLB', 'NBA', 'SOC']) {
                if (sportFilter !== 'All' && sport !== sportFilter) continue;
                const sportGames = sharpPositions?.[sport] || {};
                for (const [key, gd] of Object.entries(sportGames)) {
                  if (!gd.positions || gd.positions.length === 0) continue;
                  if ((gd.summary?.totalInvested || 0) < 1000) continue;
                  const pg = pinnacleHistory?.[sport]?.[key];
                  const ct = pg?.commence ? new Date(pg.commence).getTime() : null;
                  const isLive = ct && nowMs >= ct;

                  const ss = gd.summary;
                  const cSide = ss.consensus;
                  const cOdds = cSide === 'away' ? pg?.current?.away : cSide === 'draw' ? pg?.current?.draw : pg?.current?.home;
                  const bRetail = cSide === 'away' ? pg?.bestAway : cSide === 'draw' ? pg?.bestDraw : pg?.bestHome;
                  const pProb = impliedProb(cOdds);
                  if (pProb != null && pProb >= 0.95) continue;
                  const rProb = impliedProb(bRetail);
                  const ev = (pProb && rProb) ? +((pProb - rProb) * 100).toFixed(1) : null;
                  const pinnConf = pg?.movement?.direction === cSide;
                  const cOpenOdds = cSide === 'away' ? pg?.opener?.away : cSide === 'draw' ? pg?.opener?.draw : pg?.opener?.home;
                  const cCurOdds = cSide === 'away' ? pg?.current?.away : cSide === 'draw' ? pg?.current?.draw : pg?.current?.home;
                  const cOpenP = impliedProb(cOpenOdds);
                  const cCurP = impliedProb(cCurOdds);
                  const pinnMoveWith = !!(cOpenP && cCurP) && cCurP > cOpenP;
                  const pinnMoveAgainst = !!(cOpenP && cCurP) && cCurP < cOpenP;
                  const cInv = cSide === 'away' ? (ss.awayInvested || 0) : (ss.homeInvested || 0);
                  const awayPos = gd.positions.filter(p => p.side === 'away');
                  const homePos = gd.positions.filter(p => p.side === 'home');
                  const cWallets = cSide === 'away' ? new Set(awayPos.map(p => p.wallet)).size : new Set(homePos.map(p => p.wallet)).size;
                  const oWallets = cSide === 'away' ? new Set(homePos.map(p => p.wallet)).size : new Set(awayPos.map(p => p.wallet)).size;
                  const polyG = polyData?.[sport]?.[key];
                  const polyPts = polyG?.priceHistory?.points || [];
                  const polyMoveWith = polyPts.length >= 2 && ((cSide === 'away' && polyPts[polyPts.length-1] > polyPts[0]) || (cSide === 'home' && polyPts[polyPts.length-1] < polyPts[0]));

                  const sf = computeSharpFeatures(gd.positions, cSide);

                  const oSide = cSide === 'away' ? 'home' : 'away';
                  const oOdds = oSide === 'away' ? pg?.current?.away : pg?.current?.home;
                  const oBestRetail = oSide === 'away' ? pg?.bestAway : pg?.bestHome;
                  const oPProb = impliedProb(oOdds);
                  const oRProb = impliedProb(oBestRetail);
                  const oEv = (oPProb && oRProb) ? +((oPProb - oRProb) * 100).toFixed(1) : null;
                  const oPinnConf = pg?.movement?.direction === oSide;
                  const oOpenOdds = oSide === 'away' ? pg?.opener?.away : pg?.opener?.home;
                  const oCurOdds = oSide === 'away' ? pg?.current?.away : pg?.current?.home;
                  const oOpenP = impliedProb(oOpenOdds);
                  const oCurP = impliedProb(oCurOdds);
                  const oPinnMoveWith = !!(oOpenP && oCurP) && oCurP > oOpenP;
                  const oPinnMoveAgainst = !!(oOpenP && oCurP) && oCurP < oOpenP;
                  const oPolyMoveWith = polyPts.length >= 2 && ((oSide === 'away' && polyPts[polyPts.length-1] > polyPts[0]) || (oSide === 'home' && polyPts[polyPts.length-1] < polyPts[0]));
                  const osf = computeSharpFeatures(gd.positions, oSide);
                  const oBetOdds = oBestRetail || oOdds;
                  const oInv = oSide === 'away' ? (ss.awayInvested || 0) : (ss.homeInvested || 0);
                  const oMoneyPct = ss.totalInvested > 0 ? (oInv / ss.totalInvested) * 100 : 50;
                  const oWalletPct = (cWallets + oWallets) > 0 ? (oWallets / (cWallets + oWallets)) * 100 : 50;
                  const sortPickDate = ct ? gameDate(ct) : null;
                  const oSr = rateStarsV8({
                    positions: gd.positions, consensusSide: oSide, v8Norm,
                    pinnMoveSize: 0, timeToGame: null, sport, pickDate: sortPickDate,
                  });

                  const sortFlowGame = gameFlowMap?.[`${sport}_${key}`];
                  const sortTicketOnCon = sortFlowGame
                    ? (cSide === 'away' ? sortFlowGame.awayTicketPct : sortFlowGame.homeTicketPct) || 0
                    : 0;
                  const sortFlowDiv = sortFlowGame?.ticketDivergence || 0;
                  const sortRLM = sortTicketOnCon < 50 && sortFlowDiv >= 10;

                  const cBetOdds = bRetail || cOdds;
                  const sortMoneyPct = ss.totalInvested > 0 ? (cInv / ss.totalInvested) * 100 : 50;
                  const sortWalletPct = (cWallets + oWallets) > 0 ? (cWallets / (cWallets + oWallets)) * 100 : 50;
                  const sr = rateStarsV8({
                    positions: gd.positions, consensusSide: cSide, v8Norm,
                    pinnMoveSize: 0, timeToGame: null, sport, pickDate: sortPickDate,
                  });

                  if (sortBy === 'locked') continue;
                  if (sortBy === 'myPicks' && !userPicks[key]) continue;
                  if (sortBy === 'live' && !isLive) continue;
                  if (sortBy !== 'live' && sortBy !== 'myPicks' && isLive) continue;

                  // Resolve the v12 rating for THIS game — mirror of the
                  // card's earlyV12Tier chain: cron-stamped v8_agsV12Tier
                  // on any non-superseded side first, then a browser
                  // computation via the same library function.
                  let v12SortStars = null;
                  const sortLockDoc = lockedPicks[`${v12SortToday}_${sport}_${key}`];
                  if (sortLockDoc?.sides) {
                    for (const sdd of Object.values(sortLockDoc.sides)) {
                      if (!sdd || sdd.superseded) continue;
                      const tt = (typeof sdd.v8_agsV12Tier === 'string' && sdd.v8_agsV12Tier !== 'UNKNOWN') ? sdd.v8_agsV12Tier : null;
                      if (!tt) continue;
                      const st = starsFromAgsuTier(tt);
                      if (v12SortStars == null || st > v12SortStars) v12SortStars = st;
                    }
                  }
                  if (v12SortStars == null && v12SortStatsFn && v12SortCal?.v12Quintiles && cSide) {
                    try {
                      const r = computeAgsV12FromPositions(gd.positions, cSide, sport, v12SortCal, v12SortStatsFn);
                      if (r?.tier) v12SortStars = starsFromAgsuTier(r.tier);
                    } catch { /* fall through to legacy _stars */ }
                  }
                  allPosGames.push({ key, sport, ...gd, _commence: ct, _isLive: isLive, _stars: sr.stars, _v12Stars: v12SortStars, _ev: ev, _wallets: cWallets + oWallets, _invested: ss.totalInvested || 0 });
                }
              }

              // Rating ranks by what the card SHOWS: v12 stars when
              // resolvable, legacy v8 stars otherwise.
              const ratingOf = (g) => (g._v12Stars != null ? g._v12Stars : g._stars);
              const sortFns = {
                stars: (a, b) => ratingOf(b) - ratingOf(a) || b._invested - a._invested,
                live: (a, b) => b._invested - a._invested,
                time: (a, b) => (a._commence || Infinity) - (b._commence || Infinity),
                edge: (a, b) => b._ev - a._ev || ratingOf(b) - ratingOf(a),
                money: (a, b) => b._invested - a._invested,
                wallets: (a, b) => b._wallets - a._wallets || b._invested - a._invested,
                myPicks: (a, b) => ratingOf(b) - ratingOf(a) || b._invested - a._invested,
              };
              allPosGames.sort(sortFns[sortBy] || sortFns.stars);

              return (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <SectionHead
                      title={sortBy === 'locked' ? `Locked Picks — ${lockedDay === 'today' ? 'Today' : 'Yesterday'}` : sortBy === 'myPicks' ? `My Watchlist (${allPosGames.length})` : `Sharp Positions (${allPosGames.length} games)`}
                      subtitle={sortBy === 'locked' ? `All plays that crossed the conviction threshold ${lockedDay === 'today' ? 'today' : 'yesterday'} at peak snapshot` : sortBy === 'myPicks' ? 'Games you added to your watchlist today' : `Open bets from ${sharpStats.trackedCount} verified directional sharps — market makers excluded`}
                      icon={sortBy === 'locked' ? Lock : sortBy === 'myPicks' ? CheckCircle : Eye}
                    />
                    <SharpFlowInfo isMobile={isMobile} />
                  </div>
                  {/* ─── View switcher + sort controls ──────────────────
                      Views (WHERE you are) and sorts (HOW it's ordered)
                      were previously one undifferentiated chip row —
                      users read "Locked" as a filter and lost their
                      place. Now: a segmented control owns the three
                      views; sort pills only render in the Positions
                      view where they apply. */}
                  {(() => {
                    const isLockedView = sortBy === 'locked';
                    const isWatchView = sortBy === 'myPicks';
                    const watchCount = Object.keys(userPicks).length;
                    const views = [
                      { id: 'positions', label: 'Live Positions', icon: Eye, count: !isLockedView && !isWatchView ? allPosGames.length : null, color: B.gold },
                      { id: 'locked', label: 'Locked Picks', icon: Lock, count: null, color: B.green },
                      { id: 'watchlist', label: 'Watchlist', icon: CheckCircle, count: watchCount > 0 ? watchCount : null, color: '#818CF8' },
                    ];
                    const activeView = isLockedView ? 'locked' : isWatchView ? 'watchlist' : 'positions';
                    const selectView = (id) => {
                      if (id === 'locked') setSortBy('locked');
                      else if (id === 'watchlist') setSortBy('myPicks');
                      else if (isLockedView || isWatchView) setSortBy('stars');
                    };
                    return (
                      <>
                        <div style={{
                          display: 'inline-flex', gap: '2px',
                          padding: '3px', borderRadius: '11px',
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${B.border}`,
                          marginBottom: '0.6rem',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                        }}>
                          {views.map(v => {
                            const active = activeView === v.id;
                            const VIcon = v.icon;
                            return (
                              <button key={v.id} onClick={() => selectView(v.id)} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                padding: isMobile ? '0.4rem 0.65rem' : '0.45rem 0.95rem',
                                borderRadius: '8px', cursor: 'pointer', border: 'none',
                                ...T.micro, fontWeight: active ? 800 : 600,
                                fontSize: isMobile ? '0.6rem' : '0.66rem',
                                letterSpacing: '0.04em',
                                color: active ? v.color : B.textMuted,
                                background: active
                                  ? `linear-gradient(135deg, ${v.color}1c 0%, ${v.color}08 100%)`
                                  : 'transparent',
                                boxShadow: active
                                  ? `inset 0 0 0 1px ${v.color}40, 0 2px 8px rgba(0,0,0,0.25)`
                                  : 'none',
                                transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                              }}>
                                <VIcon size={11} strokeWidth={2.5} style={{ opacity: active ? 1 : 0.55 }} />
                                <span>{v.label}</span>
                                {v.count != null && (
                                  <span style={{
                                    ...T.micro, fontSize: '0.52rem', fontWeight: 800,
                                    padding: '0.06rem 0.32rem', borderRadius: '4px',
                                    fontFeatureSettings: "'tnum'",
                                    color: active ? v.color : B.textMuted,
                                    background: active ? `${v.color}1f` : 'rgba(255,255,255,0.05)',
                                  }}>{v.count}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {activeView === 'positions' && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            marginBottom: '0.75rem', flexWrap: 'wrap',
                          }}>
                            <span style={{ ...T.tiny, fontSize: '0.52rem', color: B.textSubtle, letterSpacing: '0.09em' }}>SORT</span>
                            {[
                              { id: 'stars', label: '★ Rating' },
                              { id: 'time', label: 'Game Time' },
                              { id: 'edge', label: '+EV Edge' },
                              { id: 'money', label: '$ Invested' },
                              { id: 'wallets', label: '# Sharps' },
                              { id: 'live', label: '● Live Now' },
                            ].map(opt => {
                              const isActive = sortBy === opt.id;
                              const ac = opt.id === 'live' ? { border: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.12)', color: B.red } : null;
                              return (
                                <button key={opt.id} onClick={() => setSortBy(opt.id)} style={{
                                  padding: '0.22rem 0.6rem', borderRadius: '6px', cursor: 'pointer',
                                  ...T.micro, fontWeight: 700,
                                  border: isActive ? `1px solid ${ac?.border || B.goldBorder}` : `1px solid ${B.border}`,
                                  background: isActive
                                    ? ac?.bg || `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                                    : 'transparent',
                                  color: isActive ? ac?.color || B.gold : B.textMuted,
                                  transition: 'all 0.2s ease',
                                }}>{opt.label}</button>
                              );
                            })}
                          </div>
                        )}
                        {activeView !== 'positions' && <div style={{ marginBottom: '0.35rem' }} />}
                      </>
                    );
                  })()}

                  {/* Always render SharpPositionCards so health effects stay alive */}
                  <div style={sortBy === 'locked' ? { display: 'none' } : undefined}>
                    <SharpTape sharpPositions={sharpPositions} />
                    <div className="sf-stagger" style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : allPosGames.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                      gap: '0.75rem',
                    }}>
                      {(isFreeUser ? allPosGames.slice(0, 1) : allPosGames).map(gd => {
                        const gdDocId = `${todayET()}_${gd.sport}_${gd.key}`;
                        const gdLock = lockedPicks[gdDocId];
                        // v12: ONLY treat a side as "currently locked" when the
                        // cron's lockStage === 'LOCKED'. The legacy filter
                        // `sd.lock && !sd.superseded` was a stale snapshot —
                        // the `.lock` sub-object is the SNAPSHOT taken at the
                        // moment of original lock and stays on the doc forever
                        // (used by the locked-picks list to render the "at-lock"
                        // criteria grid). When v12 later demotes a pick to
                        // SHADOW the `.lock` snapshot survives, so this filter
                        // kept returning the side and the card incorrectly
                        // rendered "LOCKED IN" + Risk pill for FADE/SHADOW
                        // picks (e.g. NYM/SEA·away on 2026-06-01 evening,
                        // v12=FADE/0u but UI showed "LOCKED IN · 0.00u").
                        // CRON-V12 SOURCE-OF-TRUTH GATE — see Locked Picks
                        // loop below for full rationale. The live game
                        // cards "LOCKED IN" badge / sizing must also
                        // ONLY surface sides the cron has actually
                        // evaluated under v12. Half-stamped sides
                        // (browser-only lockStage='LOCKED' with no
                        // finalUnits + no v12 eval) would otherwise
                        // decorate the live card with a stale v11
                        // tier — same root cause as the PIT@ATL bug.
                        const isLiveLockedSide = ([, sd]) => sd
                          && sd.lockStage === 'LOCKED'
                          && !sd.superseded
                          && sd.v8_agsV12EvaluatedAt != null
                          && Number.isFinite(sd.finalUnits)
                          && sd.health?.syncedBy === 'server-cron';
                        const gdActiveSideEntry = gdLock ? Object.entries(gdLock.sides || {}).find(isLiveLockedSide) : null;
                        const gdOriginalSide = gdActiveSideEntry?.[0] || null;
                        const gdLockStars = gdActiveSideEntry?.[1]?.lock?.stars ?? null;
                        const gdLockWPS = gdActiveSideEntry?.[1]?.lock?.v8Scoring?.walletPlayScore ?? null;
                        const gdFlipBeatThreshold = gdLock?.flipBeatThreshold ?? null;
                        const gdSpreadLock = lockedPicks[`${gdDocId}_spread`];
                        const gdSpreadSideEntry = gdSpreadLock ? Object.entries(gdSpreadLock.sides || {}).find(isLiveLockedSide) : null;
                        const gdSpreadLockStars = gdSpreadSideEntry?.[1]?.lock?.stars ?? null;
                        const gdSpreadLockWPS = gdSpreadSideEntry?.[1]?.lock?.v8Scoring?.walletPlayScore ?? null;
                        const gdTotalLock = lockedPicks[`${gdDocId}_total`];
                        const gdTotalSideEntry = gdTotalLock ? Object.entries(gdTotalLock.sides || {}).find(isLiveLockedSide) : null;
                        const gdTotalLockStars = gdTotalSideEntry?.[1]?.lock?.stars ?? null;
                        const gdTotalLockWPS = gdTotalSideEntry?.[1]?.lock?.v8Scoring?.walletPlayScore ?? null;
                        // CRON-FIRST OVERRIDES — the syncPickStateAuthoritative
                        // cron stamps the authoritative tier + finalUnits on
                        // every locked side every cycle. The live game card
                        // does its own AGS-U calculation from raw positions
                        // (rateStarsV8 → decideLockStage → calculateSpreadTotalUnits)
                        // which is a parallel reimplementation that can drift
                        // from the cron when the browser-cached calibration
                        // is stale. Pass the cron's values down so the card
                        // can mirror them and only fall back to live derive
                        // when the cron hasn't stamped yet.
                        // v12-first tier resolution for the live game card
                        // overrides — same fix applied to the Locked Picks
                        // list above. The cron stamps BOTH v11 and v12 and
                        // they can disagree; v12 is the authoritative ladder.
                        const pickV12Tier = (side) => (typeof side?.v8_agsV12Tier === 'string' && side.v8_agsV12Tier !== 'UNKNOWN')
                          ? side.v8_agsV12Tier
                          : (typeof side?.v8_agsTier === 'string' && side.v8_agsTier !== 'UNKNOWN')
                            ? side.v8_agsTier
                            : (typeof side?.v8_lockTier === 'string' ? side.v8_lockTier : null);
                        const pickV12Units = (side) => Number.isFinite(side?.finalUnits) ? side.finalUnits
                                            : Number.isFinite(side?.v8_agsV12UnitsApplied) ? side.v8_agsV12UnitsApplied
                                            : Number.isFinite(side?.v8_agsUnitsApplied) ? side.v8_agsUnitsApplied
                                            : null;
                        // v12.1 product stake tier (cron-authoritative). null on
                        // pre-cutover picks → live card keeps the score-quintile path.
                        const pickHcStakeTier = (side) => side?.v8_hcStakeTier || null;
                        const gdMlCronSide = gdActiveSideEntry?.[1];
                        const gdMlCronTier = pickV12Tier(gdMlCronSide);
                        const gdMlCronUnits = pickV12Units(gdMlCronSide);
                        const gdMlCronStakeTier = pickHcStakeTier(gdMlCronSide);
                        const gdSpreadCronSide = gdSpreadSideEntry?.[1];
                        const gdSpreadCronTier = pickV12Tier(gdSpreadCronSide);
                        const gdSpreadCronUnits = pickV12Units(gdSpreadCronSide);
                        const gdSpreadCronStakeTier = pickHcStakeTier(gdSpreadCronSide);
                        const gdTotalCronSide = gdTotalSideEntry?.[1];
                        const gdTotalCronTier = pickV12Tier(gdTotalCronSide);
                        const gdTotalCronUnits = pickV12Units(gdTotalCronSide);
                        const gdTotalCronStakeTier = pickHcStakeTier(gdTotalCronSide);
                        return <SharpPositionCard key={gd.key} gd={gd} pinnacleHistory={pinnacleHistory} polyData={polyData} isMobile={isMobile} onPickSynced={onPickSynced} onHealthSynced={onHealthSynced} isMyPick={!!userPicks[gd.key]} onToggleMyPick={onToggleMyPick} canPickGames={!!(user && isPremium)} gameFlowMap={gameFlowMap} spreadPositions={spreadPositions} totalPositions={totalPositions} originalLockedSide={gdOriginalSide} originalLockStars={gdLockStars} originalLockWPS={gdLockWPS} originalFlipBeatThreshold={gdFlipBeatThreshold} originalSpreadLockStars={gdSpreadLockStars} originalSpreadLockWPS={gdSpreadLockWPS} originalTotalLockStars={gdTotalLockStars} originalTotalLockWPS={gdTotalLockWPS} v8Norm={v8Norm} walletProfiles={walletProfiles} mlCronTier={gdMlCronTier} mlCronUnits={gdMlCronUnits} mlCronStakeTier={gdMlCronStakeTier} spreadCronTier={gdSpreadCronTier} spreadCronUnits={gdSpreadCronUnits} spreadCronStakeTier={gdSpreadCronStakeTier} totalCronTier={gdTotalCronTier} totalCronUnits={gdTotalCronUnits} totalCronStakeTier={gdTotalCronStakeTier} />;
                      })}
                    </div>
                    {isFreeUser && <SharpFlowPaywall isMobile={isMobile} lockedCount={allPosGames.length > 1 ? allPosGames.length - 1 : 0} pnlData={allTimePnL} />}
                  </div>

                  {sortBy === 'locked' && isFreeUser ? (
                    <SharpFlowPaywall isMobile={isMobile} pnlData={allTimePnL} />
                  ) : sortBy === 'locked' ? (() => {
                    const today = todayET();
                    const yesterdayD = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
                    const yesterday = yesterdayD.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                    const targetDate = lockedDay === 'today' ? today : yesterday;
                    const allLockedArr = [];
                    for (const [docId, doc] of Object.entries(lockedPicks)) {
                      if (!docId.startsWith(targetDate)) continue;
                      const docSport = doc.sport || 'NHL';
                      for (const [sideKey, sd] of Object.entries(doc.sides || {})) {
                        if (sd.lockStage === 'SHADOW' || sd.superseded) continue;
                        // ─── TRACKED-ONLY HARD GATE ───────────────────────
                        // result.tracked=true means the grader logged the
                        // outcome but ZERO money was at risk (sized at 0u
                        // because v12 said FADE/WEAK or shipped at 0u for
                        // some other reason). These are shadow logs, not
                        // locks. They have NO place in a "Locked Picks"
                        // historical view — surfacing them as
                        // TRACKED-WIN / TRACKED-LOSS chips makes users
                        // (correctly) think we're claiming credit/blame
                        // for picks we never made. Skip unconditionally,
                        // before the graded-bypass below can let them
                        // slip through.
                        if (sd.result?.tracked === true) continue;
                        // ─── CRON-V12 SOURCE-OF-TRUTH GATE ────────────────
                        // Locked Picks ONLY shows sides the cron has
                        // actually evaluated under v12 logic. The signal:
                        //   1. cron ran v12 → v8_agsV12EvaluatedAt stamped
                        //   2. cron stamped a deterministic bet size →
                        //      finalUnits is a finite number (0 or > 0)
                        //   3. cron wrote the health block →
                        //      health.syncedBy === 'server-cron'
                        // Half-stamped sides (browser wrote lockStage +
                        // v8_ags v11 fields on a side-flip but the cron
                        // hit T-15 freeze before it could finish) are
                        // INVISIBLE here. They have no v12 tier, no
                        // finalUnits, and the grader marks them
                        // tracked=true / 0u — so surfacing them as
                        // "LOCKED · ELITE 2.25u" from a stale browser
                        // v11 stamp is a lie. That's the PIT@ATL
                        // Over 8 (2026-06-07) bug. Never again.
                        //
                        // Graded picks (status=COMPLETED + result.outcome)
                        // bypass this gate so historical results keep
                        // rendering regardless of stamp shape — the
                        // ledger value is already frozen on result.profit.
                        const sdAlreadyGradedGate = sd.status === 'COMPLETED' && !!sd.result?.outcome;
                        const cronEvaluatedV12 = sd.v8_agsV12EvaluatedAt != null
                          && Number.isFinite(sd.finalUnits)
                          && sd.health?.syncedBy === 'server-cron';
                        if (!sdAlreadyGradedGate && !cronEvaluatedV12) continue;
                        // v12 mute gate. When the cron has stamped v12 and
                        // v12 says FADE (score ≤ q20 cutoff, units=0), the
                        // side is muted under the new ladder regardless of
                        // the legacy lockStage. The cron sometimes leaves
                        // such picks at lockStage='LOCKED' from a pre-v12
                        // promotion (promotedBy=ags-unified-v9) — surfacing
                        // them here as "Locked Picks" with their old V11
                        // tier label ("ELITE 0u +0.00") was the contradiction
                        // the user flagged on sfg_mil / sdp_phi (2026-06-02).
                        // Skip them entirely; v12=FADE means "do not bet".
                        const sdGradedEarly = sd.status === 'COMPLETED' && !!sd.result?.outcome;
                        if (!sdGradedEarly && sd.v8_agsV12Tier === 'FADE') continue;
                        // Also skip un-graded sides that the health monitor
                        // explicitly muted/cancelled AND that lack any v12
                        // stamp — these have no defensible tier label
                        // (cle_nyy_total over 2026-06-02 surfaced as
                        // "WEAKENING · SOLID PLAY · 0.75u" with no tier at
                        // all). Graded sides still flow through so historical
                        // PnL keeps rendering.
                        const healthStatusEarly = typeof sd.health === 'object' ? sd.health?.status : sd.health;
                        if (!sdGradedEarly
                            && (healthStatusEarly === 'MUTED' || healthStatusEarly === 'CANCELLED')
                            && !Number.isFinite(sd.v8_agsV12)) continue;
                        // v7.4 single-floor display gate. For post-cutover
                        // picks, only render sides that currently pass the
                        // floor (HC ≥ +1 OR Σ ≥ 5). Graded picks always
                        // render (so historical results are visible).
                        // CANCELLED picks (dw ≤ -2) also pass through here
                        // and are toggled on by the existing "Show
                        // cancelled" UI button.
                        const sdGraded = sd.status === 'COMPLETED' && !!sd.result?.outcome;
                        const agsProvenTotal = (sd.v8_agsProvenForCount != null && sd.v8_agsProvenAgCount != null)
                          ? sd.v8_agsProvenForCount + sd.v8_agsProvenAgCount
                          : null;
                        // v12 cleanup: when the cron has stamped v8_agsV12,
                        // v12 IS the authoritative gate. lockStage='LOCKED'
                        // already means v12 score > 0 (cron enforces this).
                        // The legacy passesV74DisplayGate checks v11 hard-
                        // mute and v11 proven-wallet count, which are NOT
                        // valid filters under v12 (e.g. Nationals 2026-06-01
                        // is v12=0.987/ELITE but v11=-0.29/FADE — v11 gate
                        // would hide our biggest pick of the day).
                        const hasV12Stamp = Number.isFinite(sd.v8_agsV12);
                        if (!hasV12Stamp) {
                          if (!passesV74DisplayGate({
                            pickDate: doc.date,
                            dw: sd.v8_walletConsensusDelta,
                            dq: sd.v8_walletConsensusQualityMargin,
                            hcMargin: Number.isFinite(sd.v8_hcMargin)
                              ? sd.v8_hcMargin
                              : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0)),
                            dwLock: sd.lock?.v8Scoring?.delta,
                            dqLock: sd.lock?.v8Scoring?.qualityMargin,
                            hcMarginLock: sd.lock?.v8Scoring?.hcMargin,
                            isGraded: sdGraded,
                            agsValue: Number.isFinite(sd.v8_ags) ? sd.v8_ags : null,
                            agsProvenTotal,
                            promotedBy: sd.promotedBy || null,
                          })) continue;
                        }
                        const peak = sd.peak || sd.lock || {};
                        const lock = sd.lock || {};
                        const stars = peak.stars || lock.stars || 0;
                        // Pre-v7.4 legacy: hide low-star picks. Under v7.4 the
                        // canonical display gate is passesV74DisplayGate (above);
                        // a pick passing the HC route can legitimately stamp
                        // 2.25★ (dw=0 ∧ dq=0 ∧ HC≥+1 — strongest single signal,
                        // small base) and must still render. Skip the old gate
                        // when the v7.4 contract owns the decision.
                        if (!isV74Eligible(doc.date) && stars < 2.5) continue;
                        // ?? not || — preserve peak.units = 0 (LEAN tracking
                        // plays). Falsy-or fallback to 1 was the bug behind
                        // every LEAN graded pick rendering as a -1u loss.
                        const peakUnits = peak.units ?? lock.units ?? 0;
                        const peakStars = stars;
                        // CANONICAL bet size. finalUnits is the single source
                        // of truth — written every cycle by the cron and
                        // frozen at T-15. Used for both LIVE display (past
                        // T-15) and GRADED display so the user's risk/PnL
                        // never changes from what they saw on the live card.
                        // Falls back to v8_agsUnitsApplied → peakUnits only
                        // for legacy docs that pre-date finalUnits.
                        const finalUnitsRaw = sd.finalUnits
                          ?? sd.v8_agsUnitsApplied
                          ?? peakUnits;
                        const finalUnits = (typeof finalUnitsRaw === 'number'
                          && Number.isFinite(finalUnitsRaw)
                          && finalUnitsRaw >= 0)
                          ? finalUnitsRaw
                          : peakUnits;
                        // AGS-U v9: a side is "tracked-only" (0u, MUTED-style
                        // chrome, 0 PnL) ONLY when the Cloud Function grader
                        // explicitly stamped result.tracked === true. Under
                        // AGS-U v9 LEAN-tier ships at 0.50× (non-zero) units
                        // and MUST render at its cron-stamped finalUnits —
                        // we no longer infer "tracked" from lockStage / tier
                        // / zero-peak. Legacy graded picks already carry the
                        // explicit tracked stamp from the v6/v7 grader.
                        const isTrackedOnly = sd.result?.tracked === true;
                        const lockOddsValid = lock.odds && Math.abs(lock.odds) <= 400;
                        const lockStars = lock.stars || 0;
                        const marketTypeKey = doc.marketType || 'ml';
                        // Odds fallback: lock.odds → peak.odds → closingOdds.
                        // closingOdds is the authoritative Pinnacle close set
                        // by updateClosingOdds.js every fetch cycle. The cron's
                        // create-missing path may write sparse peak data
                        // (line=null, odds=null) but closingOdds is always
                        // populated post-T-15 — fall back to it so the card
                        // never renders "0 · pinnacle".
                        const cardOdds = lockOddsValid ? lock.odds
                          : (peak.odds || lock.odds || sd.closingOdds || 0);
                        // v6.6 — health is engine-truth. evaluatePickHealth
                        // is the single source of truth for ACTIVE / MUTED /
                        // CANCELLED under the hybrid floor. Earlier code self-
                        // healed any "two-factor" mute back to ACTIVE; that
                        // override pre-dates v6 and was actively un-muting
                        // valid Δw≤0 / sum-below-floor mutes (e.g. the
                        // 2026-04-27 VGK ML pick that decayed 2/+2 → 0/0).
                        // Now we honor whatever evaluatePickHealth wrote.
                        const healthResolved = sd.superseded
                          ? { status: 'CANCELLED', reasons: ['side_flipped'] }
                          : (sd.health || { status: 'ACTIVE', reasons: [] });
                        // v6.4 — recompute stars/units LIVE from stored Δw/Δq.
                        // The stored deltas naturally freeze at T-15 because
                        // syncPickToFirebase stops writing then (v6.5), so
                        // inside the lock-in window the "live" recompute is
                        // effectively the T-15 snapshot. Graded picks keep
                        // peak values so realized PnL stays locked to what
                        // the system recommended at lock time.
                        const isGradedSide = sd.status === 'COMPLETED' && !!sd.result?.outcome;
                        // For graded picks, prefer peakUnits when finalUnits
                        // got zeroed by a pre-T-15 demote-to-MUTED cycle. The
                        // canonical bet size is whatever was committed at lock
                        // time (peak.units / lock.units) — that's also what
                        // the grader uses to compute result.profit. If the
                        // cron later wrote finalUnits=0 because the live tier
                        // dropped to MUTED, the user STILL placed the bet at
                        // peakUnits and was graded on peakUnits, so the
                        // displayed unit risk must reflect that. Keeps the
                        // locked-picks list in lockstep with the Performance
                        // dashboard (which reads result.profit directly).
                        const gradedDisplayUnits = (Number.isFinite(finalUnits) && finalUnits > 0)
                          ? finalUnits
                          : (Number.isFinite(peakUnits) && peakUnits > 0 ? peakUnits : finalUnits);
                        // CRON-FIRST sizing. The cron stamps the
                        // authoritative tier (`v8_agsTier`) and bet size
                        // (`finalUnits`) every cycle using the live
                        // Firestore calibration — that IS the sizing
                        // decision the grader and bankroll math use. The
                        // UI must mirror it exactly. computeLiveSizing
                        // now short-circuits to these values when present
                        // and only falls back to client recomputation
                        // when the cron hasn't stamped yet (cold start /
                        // no proven wallets / off-calendar pick).
                        // v12 tier-first resolution. The cron stamps BOTH
                        // legacy v11 (`v8_agsTier`) and v12 (`v8_agsV12Tier`)
                        // every cycle, and the two CAN disagree — e.g.
                        // tex_stl_total·under on 2026-06-02 had
                        // v11=LEAN/q3/+0.08 but v12=PREMIUM/q4/+0.98 and the
                        // card was rendering "LEAN · 3.0u +0.98" (label v11,
                        // units v12, AGS v12). Prefer v12 whenever it's
                        // stamped so the label, units and AGS all reflect
                        // the same scoring run.
                        const cronTier = (typeof sd.v8_agsV12Tier === 'string' && sd.v8_agsV12Tier !== 'UNKNOWN')
                          ? sd.v8_agsV12Tier
                          : (typeof sd.v8_agsTier === 'string' && sd.v8_agsTier !== 'UNKNOWN')
                            ? sd.v8_agsTier
                            : (typeof sd.v8_lockTier === 'string' ? sd.v8_lockTier : null);
                        const cronUnits = Number.isFinite(sd.finalUnits) ? sd.finalUnits
                                        : Number.isFinite(sd.v8_agsV12UnitsApplied) ? sd.v8_agsV12UnitsApplied
                                        : Number.isFinite(sd.v8_agsUnitsApplied) ? sd.v8_agsUnitsApplied
                                        : null;
                        const sizing = isGradedSide
                          ? { liveStars: peakStars, liveUnits: gradedDisplayUnits, isDownsized: false, liveTier: cronTier }
                          : computeLiveSizing({
                              peakStars,
                              peakUnits,
                              marketType: marketTypeKey,
                              oddsForLadder: cardOdds,
                              cronTier,
                              cronUnits,
                              liveDw: sd.v8_walletConsensusDelta ?? null,
                              liveDq: sd.v8_walletConsensusQualityMargin ?? null,
                              // v7.1/v7.2 — thread HC dominance, HC margin
                              // and pick date so the live ladder matches the
                              // v7.2 HC-margin rule for post-cutover picks,
                              // v7.1 HC_DOM for the 1-day window, and the v7.0
                              // ladder for historic picks. liveHcMargin falls
                              // back to liveHcDominant ? 1 : 0 inside
                              // computeLiveSizing when undefined.
                              liveHcDominant: !!sd.v8_hcDominant,
                              liveHcMargin: Number.isFinite(sd.v8_hcMargin)
                                ? sd.v8_hcMargin
                                : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0)),
                              pickDate: doc.date ?? null,
                              // Phase 2 — AGS sizing modifier. Stamped by the
                              // server cron + the client stamper; null on
                              // legacy picks or sides without proven wallets.
                              // Only consulted by the FALLBACK branch in
                              // computeLiveSizing when cronTier/cronUnits
                              // are missing — the cron-first path above
                              // ignores it because the tier is already
                              // resolved.
                              liveAgs: Number.isFinite(sd.v8_ags) ? sd.v8_ags : null,
                              liveAgsProvenFor: Number.isFinite(sd.v8_agsProvenForCount) ? sd.v8_agsProvenForCount : null,
                              liveAgsProvenAg: Number.isFinite(sd.v8_agsProvenAgCount) ? sd.v8_agsProvenAgCount : null,
                            });
                        const displayStars = isGradedSide ? peakStars : sizing.liveStars;
                        const displayUnits = sizing.liveUnits;
                        const liveTier = sizing.liveTier;
                        // Realized PnL uses peak (the recommendation the system
                        // committed to at lock time). Live decay is a display
                        // advisory for picks you haven't placed yet. LEAN /
                        // tracked-only picks always realize 0u PnL — they were
                        // never bet, so the W/L outcome is informational only.
                        // PnL: trust the grader's stamped result.profit for
                        // both WIN and LOSS — it was computed at grade time
                        // from the lock-time bet size (lock.units). Re-deriving
                        // -(finalUnits) for LOSS broke when the cron's pre-T-15
                        // demote zeroed finalUnits but the bet still got
                        // graded on the original size (Toronto BJ / COL-PHI /
                        // HOU-CIN incident, 2026-05-10: dashboard showed
                        // "0u LOSS 0.00u" while result.profit had the real
                        // -1.13u / -0.64u losses stamped). Fall back to
                        // -(finalUnits) only when result.profit is missing.
                        const profit = isTrackedOnly
                          ? 0
                          : sd.result?.outcome === 'WIN' ? (sd.result?.profit || 0)
                          : sd.result?.outcome === 'LOSS' ? (
                              Number.isFinite(sd.result?.profit) ? sd.result.profit : -(finalUnits)
                            ) : 0;
                        // AGS-U v9 tier resolution chain — every shipped
                        // pick MUST resolve to a tier badge for the user.
                        // Order of preference (most → least trustworthy):
                        //   1) cronTier — `sd.v8_agsTier` if present,
                        //      otherwise `sd.v8_lockTier`. Stamped by the
                        //      syncPickStateAuthoritative cron every cycle
                        //      pre-T-15 using the live Firestore
                        //      calibration. THIS is the tier the grader
                        //      and bankroll math use.
                        //   2) sizing.liveTier — fallback client
                        //      recomputation (cron hasn't stamped yet —
                        //      cold start / no proven wallets).
                        //   3) null — only when both are missing AND the
                        //      pick is graded.
                        const resolvedTier = cronTier
                          ?? liveTier
                          ?? null;
                        // LIVE-NOW descriptive stats. The cron stamps
                        // peak.{sharpCount, totalInvested, consensusStrength}
                        // every cycle, but it runs on a clock and lags the
                        // raw position feed by a cycle or two — which
                        // produced today's ugly mismatch: the live game
                        // card showed 6 sharps / $69.8K while the locked
                        // card (reading peak.*) showed 5 sharps / $56.1K
                        // on the same Cavs/Pistons total. Same pick, same
                        // side, different numbers because they were sampled
                        // at different times.
                        //
                        // For PENDING picks, recompute the descriptive
                        // chips from raw live positions so both cards
                        // mirror reality. We keep peak.* as the fallback
                        // for graded picks (where the live feed has
                        // already churned past game time and the historical
                        // snapshot is what we want to show) and for any
                        // game whose positions haven't been polled this
                        // session.
                        //
                        // The cron's finalUnits / v8_agsTier are NOT
                        // overridden — sizing decisions belong to the
                        // cron, descriptive chrome belongs to live data.
                        const livePosSource = marketTypeKey === 'spread' ? spreadPositions
                                            : marketTypeKey === 'total'  ? totalPositions
                                            : sharpPositions;
                        const liveGameData = livePosSource?.[docSport]?.[doc.gameKey];
                        const liveSf = (liveGameData?.positions && !sdGraded)
                          ? computeSharpFeatures(liveGameData.positions, sideKey)
                          : null;
                        const liveSharpCount = liveSf ? (liveSf.conWalletCount ?? null) : null;
                        const liveTotalInvested = liveSf ? (liveSf.conTotalInvested ?? null) : null;
                        const liveMoneyPct = liveSf && Number.isFinite(liveSf.conMoneyPct)
                          ? Math.round(liveSf.conMoneyPct) : null;
                        const liveWalletPct = liveSf && Number.isFinite(liveSf.conWalletPct)
                          ? Math.round(liveSf.conWalletPct) : null;
                        const liveConsensusGrade = liveSf?.consensusTier ?? null;
                        allLockedArr.push({
                          key: `${docId}:${sideKey}`,
                          team: sd.team || sideKey,
                          away: doc.away || '', home: doc.home || '',
                          sport: docSport,
                          stars: displayStars,
                          peakStars,
                          lockStars,
                          units: displayUnits,
                          peakUnits,
                          isDownsized: sizing.isDownsized,
                          lockTier: resolvedTier,
                          odds: cardOdds,
                          // Default to 'Pinnacle' when neither peak nor lock
                          // book is set — closingOdds is from Pinnacle, so
                          // when we fell back to closingOdds the book label
                          // should reflect that source instead of rendering
                          // "0 · " (empty book).
                          book: lockOddsValid
                            ? (lock.book || peak.book || 'Pinnacle')
                            : (peak.book || lock.book || (sd.closingOdds ? 'Pinnacle' : '')),
                          peakAt: peak.updatedAt || lock.lockedAt,
                          lockedAt: lock.lockedAt || null,
                          gameTime: doc.commenceTime,
                          status: sd.status || doc.status || 'PENDING',
                          outcome: sd.result?.outcome || null,
                          profit,
                          lockPinnOdds: peak.pinnacleOdds || lock.pinnacleOdds || null,
                          closingOdds: sd.closingOdds || null,
                          clv: sd.result?.clv ?? null,
                          sharpCount: liveSharpCount ?? peak.sharpCount ?? lock.sharpCount ?? null,
                          totalInvested: liveTotalInvested ?? peak.totalInvested ?? lock.totalInvested ?? null,
                          evEdge: peak.evEdge ?? lock.evEdge ?? null,
                          lockEV: lock.evEdge ?? null,
                          criteriaMet: peak.criteriaMet || lock.criteriaMet || 0,
                          criteria: peak.criteria || lock.criteria || null,
                          consensusStrength: liveSf
                            ? {
                                moneyPct: liveMoneyPct ?? 50,
                                walletPct: liveWalletPct ?? 50,
                                grade: liveConsensusGrade || 'LEAN',
                              }
                            : (() => {
                                const cs = peak.consensusStrength || lock.consensusStrength || null;
                                if (cs && cs.moneyPct == null) {
                                  const g = cs.grade || '';
                                  if (g === 'DOMINANT') return { ...cs, moneyPct: 85, walletPct: 75 };
                                  if (g === 'STRONG') return { ...cs, moneyPct: 70, walletPct: 65 };
                                  if (g === 'LEAN') return { ...cs, moneyPct: 58, walletPct: 55 };
                                  return { ...cs, moneyPct: 50, walletPct: 50 };
                                }
                                return cs;
                              })(),
                          // Snapshot-time numbers — surfaced separately so the
                          // detail view can show "5 → 6 sharps since lock"
                          // when conditions evolve, instead of silently
                          // overwriting the lock-snapshot context.
                          lockSharpCount: lock.sharpCount ?? null,
                          lockTotalInvested: lock.totalInvested ?? null,
                          peakSharpCount: peak.sharpCount ?? null,
                          peakTotalInvested: peak.totalInvested ?? null,
                          pinnacleOdds: peak.pinnacleOdds || lock.pinnacleOdds || sd.closingOdds || null,
                          marketType: marketTypeKey,
                          // line fallback: peak.line → lock.line → closingLine.
                          // PENDING spread: if lock/peak sign-flips vs closingLine
                          // (Polymarket entryLine bug), Pinnacle close wins.
                          line: (() => {
                            const locked = peak.line ?? lock.line;
                            const close = sd.closingLine;
                            if (marketTypeKey === 'spread' && sd.status === 'PENDING'
                                && locked != null && close != null && locked === -close && locked !== 0) {
                              return close;
                            }
                            return locked ?? close ?? null;
                          })(),
                          superseded: !!sd.superseded,
                          health: healthResolved,
                          // True when this side was a LEAN / 0u tracked-only
                          // play. The card renderer uses this to apply MUTED
                          // styling and a "TRACKED" badge instead of WIN/LOSS
                          // chrome. Wins and losses on tracked picks are
                          // informational; they contribute 0u to PnL.
                          trackedOnly: isTrackedOnly,
                          // V8.3 Phase 2 — wallet consensus attribution (stamped by syncPickToFirebase).
                          // These flow into the PROVEN CONSENSUS UI badge on Δ ≥ +2 picks.
                          walletConsensusDelta: sd.v8_walletConsensusDelta ?? null,
                          walletConsensusVerdict: sd.v8_walletConsensusVerdict ?? null,
                          walletConsensusForW: sd.v8_walletConsensusForW ?? null,
                          walletConsensusAgW: sd.v8_walletConsensusAgW ?? null,
                          walletConsensusQualityMargin: sd.v8_walletConsensusQualityMargin ?? null,
                          walletConsensusQualityForT30: sd.v8_walletConsensusQualityForT30 ?? null,
                          walletConsensusQualityAgT30: sd.v8_walletConsensusQualityAgT30 ?? null,
                          // Backing wallets — the actual proven wallets behind
                          // this side, lifted from the stamped peak/lock
                          // v8Scoring.walletDetails snapshot. Filtered to the
                          // consensus side + a real stake, sorted by size.
                          // The card enriches each with its stored sport
                          // track record (getWalletProfile) at render so we
                          // surface WHO is on the pick, not just a count.
                          backingWallets: (() => {
                            const wd = sd.peak?.v8Scoring?.walletDetails
                              || sd.lock?.v8Scoring?.walletDetails
                              || peak?.v8Scoring?.walletDetails
                              || lock?.v8Scoring?.walletDetails
                              || null;
                            if (!Array.isArray(wd)) return null;
                            const rows = wd
                              .filter(w => w && w.side === sideKey && (w.invested || 0) > 0)
                              .map(w => ({
                                wallet: w.wallet,
                                invested: w.invested || 0,
                                roi: w.roi || 0,
                                pnl: w.pnl || 0,
                                rank: w.rank ?? null,
                                // conviction vs the wallet's avg sport bet —
                                // powers the model-parity TOKEN BET badge
                                sizeRatio: Number.isFinite(w.sizeRatio) ? w.sizeRatio : null,
                              }))
                              .sort((a, b) => (b.invested || 0) - (a.invested || 0));
                            return rows.length ? rows : null;
                          })(),
                          // v7.1 TOP PICK tiers — read from stamped fields when
                          // the pick is post-cutover and has been stamped under
                          // consensus version 7. Pre-cutover picks fall through
                          // to the legacy Δw ≥ +2 path.
                          //   v7.1 SUPER TOP PICK = LOCKED ∧ HC dominance
                          //   v7.1 TOP PICK       = LOCKED ∧ Σ ≥ +5
                          //   v7.0 (legacy)       = Δw ≥ +2 (super if Δq ≥ +2)
                          ...evaluateTopPickTier(
                            peak,
                            lock,
                            sideKey,
                            sd.promotedRegime,
                            sd.v8_walletConsensusDelta,
                            sd.v8_walletConsensusAgW,
                            sd.v8_walletConsensusQualityMargin,
                            sd,
                            doc.date ?? null,
                          ),
                          // v7.1/v7.2/v7.3 — surface HC dominance + margin +
                          // promotion path on the card so the UI can render
                          // the gold "HC ×1.5" / "HC ×1.75" chip and the
                          // "PROMOTED · HC" / "Σ=2 LEAN→LOCK" / "RESCUED" tooltips.
                          hcDominant: !!sd.v8_hcDominant,
                          hcConfFor: sd.v8_hcConfFor ?? 0,
                          hcConfAg:  sd.v8_hcConfAg ?? 0,
                          hcMargin:  Number.isFinite(sd.v8_hcMargin)
                            ? sd.v8_hcMargin
                            : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0)),
                          systemVersion: sd.v8_systemVersion || '7.0',
                          promotedBy: sd.promotedBy || null,
                          v73HcRescue: !!sd.v8_v73HcRescue,
                          // AGS — Phase 1: read-only badge. Stamped by
                          // server cron + browser stamper; null on legacy
                          // picks or when no proven wallets are present.
                          agsValue: Number.isFinite(sd.v8_ags) ? sd.v8_ags : null,
                          agsTier: sd.v8_agsTier || null,
                          agsQuintile: Number.isFinite(sd.v8_agsQuintile) ? sd.v8_agsQuintile : null,
                          agsProvenForCount: sd.v8_agsProvenForCount ?? null,
                          agsProvenAgCount: sd.v8_agsProvenAgCount ?? null,
                          // v12 raw — single source of truth for the AGS
                          // number rendered on the tier chip. Without this
                          // we displayed `agsValue` (legacy v11) next to a
                          // v12 tier label, producing rows like
                          // "ELITE -0.4" (v11=-0.39, v12=0.99) and
                          // "LOCK -0.1" (v11=-0.12, v12=0.97) that look
                          // like negative-AGS picks shouldn't be locked
                          // under the v12 lock-above-zero rule. They ARE
                          // well above zero in v12 — the wrong number was
                          // being shown.
                          agsValueV12: Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null,
                          agsTierV12: sd.v8_agsV12Tier || null,
                          agsQuintileV12: Number.isFinite(sd.v8_agsV12Quintile) ? sd.v8_agsV12Quintile : null,
                          // v12.1 — product stake tier from the HC margin
                          // (cron-authoritative; null on pre-cutover picks).
                          // SUPER / TOP / CONFIRMED / MONITORING / FADE.
                          hcStakeTier: sd.v8_hcStakeTier || null,
                          isMonitoring: sd.v8_hcStakeTier === 'MONITORING',
                        });
                      }
                    }
                    const sportFiltered = lockedSportFilter === 'All' ? allLockedArr : allLockedArr.filter(p => p.sport === lockedSportFilter);
                    const lockedArr = lockedMarketFilter === 'all' ? sportFiltered : sportFiltered.filter(p => (p.marketType || 'ml') === lockedMarketFilter);
                    const statusFiltered = lockedStatusFilter === 'all' ? lockedArr
                      : lockedStatusFilter === 'pending' ? lockedArr.filter(p => !p.outcome)
                      : lockedStatusFilter === 'won' ? lockedArr.filter(p => p.outcome === 'WIN')
                      : lockedArr.filter(p => p.outcome === 'LOSS');
                    const cancelledCount = statusFiltered.filter(p => (p.health?.status || 'ACTIVE') === 'CANCELLED' && !p.outcome).length;
                    const mutedCount = statusFiltered.filter(p => (p.health?.status || 'ACTIVE') === 'MUTED' && !p.outcome).length;
                    const filteredLocked = showCancelled ? statusFiltered : statusFiltered.filter(p => (p.health?.status || 'ACTIVE') !== 'CANCELLED' || !!p.outcome);
                    const healthOrder = { ACTIVE: 0, MUTED: 1, CANCELLED: 2 };
                    filteredLocked.sort((a, b) => {
                      if (a.superseded !== b.superseded) return a.superseded ? 1 : -1;
                      const aH = healthOrder[a.health?.status || 'ACTIVE'] || 0;
                      const bH = healthOrder[b.health?.status || 'ACTIVE'] || 0;
                      if (aH !== bH) return aH - bH;
                      // V8.4: TOP PICK priority mirrors the two-tier badge,
                      // using the precomputed flags from evaluateTopPickTier.
                      //   2 = SUPER TOP PICK (CLEAR_MOVE + meanBase_F ≥ 55)
                      //   1 = regular TOP PICK (CLEAR_MOVE)
                      //   0 = neither
                      const tierRank = (p) => p.isSuperTopPick ? 2 : p.isTopPick ? 1 : 0;
                      const aTop = tierRank(a);
                      const bTop = tierRank(b);
                      if (aTop !== bTop) return bTop - aTop;
                      if (lockedSort === 'stars') return b.stars - a.stars || b.units - a.units;
                      const tA = a.gameTime ? new Date(a.gameTime).getTime() : 0;
                      const tB = b.gameTime ? new Date(b.gameTime).getTime() : 0;
                      return tA - tB || b.stars - a.stars;
                    });
                    // v12.1 — MONITORING picks (0u, non-HC or WEAK-tier HC) are
                    // shown for volume but never staked: they are excluded from
                    // the record / units / ROI ledger entirely.
                    const stakedLockedArr = lockedArr.filter(p => !p.isMonitoring);
                    const pendingCount = stakedLockedArr.filter(p => !p.outcome).length;
                    const wonCount = stakedLockedArr.filter(p => p.outcome === 'WIN').length;
                    const lostCount = stakedLockedArr.filter(p => p.outcome === 'LOSS').length;
                    const sportCounts = {};
                    allLockedArr.forEach(p => { sportCounts[p.sport] = (sportCounts[p.sport] || 0) + 1; });
                    const sportColorMap = { NHL: '#D4AF37', MLB: '#E31837', NBA: '#FF8C00', CBB: '#FF6B35', NFL: '#4CAF50', SOC: '#2ECC71' };
                    const activeSports = Object.keys(sportCounts).sort();

                    // ── AGS-U Tier Scorecard (REMOVED 2026-05-22) ─────────
                    // The inline scorecard that previously lived here was
                    // a duplicate of the new AGS-U Performance Dashboard
                    // at the top of the page (see the "AGS-U PERFORMANCE"
                    // section in the Whale Signals view). Tier numbers
                    // surfaced here didn't match the dashboard's hero
                    // because the two used different pick-resolution
                    // rules. We retired this surface and made the
                    // top-of-page dashboard the single source of truth.

                    // ─── Today's Ledger — at-a-glance band ────────────
                    // Record / exposure / payout / realized, computed
                    // from the sport+market-filtered set so the numbers
                    // track the filters the user has applied.
                    const ledgerPending = stakedLockedArr.filter(p => !p.outcome);
                    const ledgerUnitsAtRisk = ledgerPending.reduce((s, p) => s + (Number.isFinite(p.units) ? p.units : 0), 0);
                    const ledgerToWin = ledgerPending.reduce((s, p) => {
                      const u = Number.isFinite(p.units) ? p.units : 0;
                      const o = p.odds;
                      if (!u || !Number.isFinite(o) || o === 0) return s;
                      return s + (o > 0 ? u * (o / 100) : u * (100 / Math.abs(o)));
                    }, 0);
                    const ledgerRealized = stakedLockedArr.filter(p => p.outcome).reduce((s, p) => s + (p.profit || 0), 0);
                    const ledgerClvVals = stakedLockedArr.map(p => p.clv).filter(v => Number.isFinite(v));
                    const ledgerAvgClv = ledgerClvVals.length ? ledgerClvVals.reduce((s, v) => s + v, 0) / ledgerClvVals.length : null;
                    const ledgerCells = [
                      { label: 'RECORD', value: `${wonCount}–${lostCount}`, color: wonCount > lostCount ? B.green : wonCount < lostCount ? B.red : B.text },
                      { label: 'PENDING', value: `${pendingCount}`, color: B.gold },
                      { label: 'UNITS AT RISK', value: `${ledgerUnitsAtRisk.toFixed(1)}u`, color: B.text },
                      { label: 'TO WIN', value: `+${ledgerToWin.toFixed(1)}u`, color: B.green },
                      ...(wonCount + lostCount > 0 ? [{ label: 'REALIZED P&L', value: `${ledgerRealized >= 0 ? '+' : ''}${ledgerRealized.toFixed(2)}u`, color: ledgerRealized >= 0 ? B.green : B.red }] : []),
                      ...(ledgerAvgClv != null ? [{ label: 'AVG CLV', value: `${ledgerAvgClv >= 0 ? '+' : ''}${ledgerAvgClv.toFixed(1)}%`, color: ledgerAvgClv >= 0 ? B.green : B.red }] : []),
                    ];
                    const FilterGroup = ({ label, children }) => (
                      isMobile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%', minWidth: 0 }}>
                          <span style={{ ...T.tiny, fontSize: '0.46rem', color: B.textSubtle, letterSpacing: '0.12em' }}>{label}</span>
                          <div className="sf-chiprail" style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', paddingBottom: '0.1rem' }}>
                            {children}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                          <span style={{ ...T.tiny, fontSize: '0.48rem', color: B.textSubtle, letterSpacing: '0.1em', marginRight: '0.1rem' }}>{label}</span>
                          {children}
                        </div>
                      )
                    );
                    const chipStyle = (active, color) => ({
                      padding: '0.22rem 0.6rem', borderRadius: '6px', cursor: 'pointer',
                      ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                      border: active ? `1px solid ${color}44` : `1px solid ${B.border}`,
                      background: active ? `${color}16` : 'transparent',
                      color: active ? color : B.textMuted,
                      transition: 'all 0.2s ease',
                      fontFeatureSettings: "'tnum'",
                      flexShrink: 0, whiteSpace: 'nowrap',
                    });
                    const filterGroups = (
                      <>
                        <FilterGroup label="DAY">
                          {[
                            { id: 'today', label: 'Today' },
                            { id: 'yesterday', label: 'Yesterday' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setLockedDay(opt.id)} style={chipStyle(lockedDay === opt.id, B.green)}>{opt.label}</button>
                          ))}
                        </FilterGroup>
                        <FilterGroup label="STATUS">
                          {[
                            { id: 'all', label: `All ${lockedArr.length}`, color: B.gold },
                            { id: 'pending', label: `Pending ${pendingCount}`, color: B.gold },
                            { id: 'won', label: `Won ${wonCount}`, color: B.green },
                            { id: 'lost', label: `Lost ${lostCount}`, color: B.red },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setLockedStatusFilter(opt.id)} style={chipStyle(lockedStatusFilter === opt.id, opt.color)}>{opt.label}</button>
                          ))}
                        </FilterGroup>
                        <FilterGroup label="SPORT">
                          {[{ id: 'All', label: 'All', color: B.gold }, ...activeSports.map(s => ({ id: s, label: s, color: sportColorMap[s] || B.gold }))].map(opt => (
                            <button key={opt.id} onClick={() => setLockedSportFilter(opt.id)} style={chipStyle(lockedSportFilter === opt.id, opt.color)}>
                              {opt.label}{opt.id !== 'All' && sportCounts[opt.id] ? ` ${sportCounts[opt.id]}` : ''}
                            </button>
                          ))}
                        </FilterGroup>
                        <FilterGroup label="MARKET">
                          {[
                            { id: 'all', label: 'All', color: B.gold },
                            { id: 'ml', label: 'ML', color: B.green },
                            { id: 'spread', label: 'Spread', color: '#8B5CF6' },
                            { id: 'total', label: 'Total', color: '#F59E0B' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setLockedMarketFilter(opt.id)} style={chipStyle(lockedMarketFilter === opt.id, opt.color)}>{opt.label}</button>
                          ))}
                        </FilterGroup>
                        <FilterGroup label="ORDER">
                          {[
                            { id: 'stars', label: '★ Rating' },
                            { id: 'time', label: 'Game Time' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setLockedSort(opt.id)} style={chipStyle(lockedSort === opt.id, B.gold)}>{opt.label}</button>
                          ))}
                        </FilterGroup>
                        {(cancelledCount > 0 || mutedCount > 0) && (
                          <FilterGroup label="HEALTH">
                            {mutedCount > 0 && (
                              <span style={{ ...T.micro, fontSize: '0.55rem', fontWeight: 600, color: '#F59E0B' }}>
                                {mutedCount} weakening
                              </span>
                            )}
                            {cancelledCount > 0 && (
                              <button onClick={() => setShowCancelled(v => !v)} style={chipStyle(showCancelled, '#EF4444')}>
                                {showCancelled ? 'Hide' : 'Show'} cancelled ({cancelledCount})
                              </button>
                            )}
                          </FilterGroup>
                        )}
                      </>
                    );
                    // Compact active-selection summary for the collapsed mobile
                    // drawer — only surfaces non-default picks so the closed bar
                    // tells the user what's filtered without opening it.
                    const summaryBits = [
                      lockedDay === 'yesterday' ? 'Yesterday' : 'Today',
                      lockedStatusFilter !== 'all' ? (lockedStatusFilter.charAt(0).toUpperCase() + lockedStatusFilter.slice(1)) : null,
                      lockedSportFilter !== 'All' ? lockedSportFilter : null,
                      lockedMarketFilter !== 'all' ? lockedMarketFilter.toUpperCase() : null,
                      lockedSort === 'time' ? 'By time' : null,
                    ].filter(Boolean);
                    return (
                      <>
                        {lockedArr.length > 0 && (
                          <div style={{
                            display: 'flex', flexWrap: 'wrap',
                            borderRadius: '12px', overflow: 'hidden',
                            background: 'linear-gradient(160deg, rgba(26,31,46,0.6) 0%, rgba(17,21,31,0.7) 100%)',
                            border: `1px solid ${B.borderSubtle}`,
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                            marginBottom: '0.6rem',
                          }}>
                            {ledgerCells.map((c, i) => (
                              <div key={c.label} style={{
                                flex: '1 1 auto', minWidth: isMobile ? '30%' : '90px',
                                padding: '0.55rem 0.8rem',
                                borderRight: i < ledgerCells.length - 1 ? `1px solid ${B.borderSubtle}` : 'none',
                                display: 'flex', flexDirection: 'column', gap: '0.18rem',
                              }}>
                                <span style={{ ...T.tiny, fontSize: '0.48rem', color: B.textSubtle, letterSpacing: '0.1em' }}>{c.label}</span>
                                <span style={{
                                  fontSize: '1.05rem', fontWeight: 900, color: c.color,
                                  fontFeatureSettings: "'tnum'", lineHeight: 1.05, letterSpacing: '-0.01em',
                                }}>{c.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {isMobile ? (
                          <details className="sf-mfilters" style={{
                            borderRadius: '10px', marginBottom: '0.6rem', overflow: 'hidden',
                            background: 'rgba(255,255,255,0.02)', border: `1px solid ${B.borderSubtle}`,
                          }}>
                            <summary style={{
                              display: 'flex', alignItems: 'center', gap: '0.5rem',
                              padding: '0.6rem 0.75rem', cursor: 'pointer',
                            }}>
                              <Workflow size={13} color={B.gold} style={{ flexShrink: 0 }} />
                              <span style={{ ...T.micro, fontWeight: 800, letterSpacing: '0.08em', color: B.text, flexShrink: 0 }}>FILTERS</span>
                              <span style={{
                                ...T.micro, fontSize: '0.6rem', color: B.textMuted, fontWeight: 600,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0,
                              }}>{summaryBits.join(' · ')}</span>
                              <ChevronDown size={15} color={B.textMuted} className="sf-mfilters-chev" style={{ flexShrink: 0 }} />
                            </summary>
                            <div style={{
                              display: 'flex', flexDirection: 'column', gap: '0.55rem',
                              padding: '0.2rem 0.75rem 0.75rem',
                            }}>
                              {filterGroups}
                            </div>
                          </details>
                        ) : (
                          <div style={{
                            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                            gap: '0.45rem 1rem',
                            padding: '0.5rem 0.65rem', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.02)',
                            border: `1px solid ${B.borderSubtle}`,
                            marginBottom: '0.6rem',
                          }}>
                            {filterGroups}
                          </div>
                        )}
                        {filteredLocked.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '2rem', color: B.textMuted, ...T.label }}>
                            {lockedArr.length === 0
                              ? `No locked picks for ${lockedDay === 'today' ? 'today' : 'yesterday'}`
                              : `No ${lockedStatusFilter === 'pending' ? 'pending' : lockedStatusFilter === 'won' ? 'winning' : 'losing'} picks`}
                          </div>
                        ) : (() => {
                          // v12.1 — split staked picks (SUPER/TOP/CONFIRMED) from
                          // MONITORING (0u, non-staked). Monitoring renders below
                          // in a muted grey section so volume stays visible but is
                          // clearly not part of the staked card / ledger.
                          const stakedCards = filteredLocked.filter(p => !p.isMonitoring);
                          const monitoringCards = filteredLocked.filter(p => p.isMonitoring);
                          return (
                            <>
                              {stakedCards.length > 0 && (
                                <div className="sf-stagger" style={{
                                  display: 'grid',
                                  gridTemplateColumns: isMobile ? '1fr' : stakedCards.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                                  gap: '0.75rem',
                                }}>
                                  {stakedCards.map(p => (
                                    <SharpLockCardV2 key={p.key} pick={p} isMobile={isMobile} />
                                  ))}
                                </div>
                              )}
                              {monitoringCards.length > 0 && (
                                <div style={{ marginTop: stakedCards.length > 0 ? '1.25rem' : 0 }}>
                                  <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    margin: '0 0 0.6rem 0.1rem',
                                  }}>
                                    <span style={{
                                      ...T.micro, fontWeight: 800, letterSpacing: '0.12em',
                                      color: '#6B7280', fontSize: '0.6rem',
                                    }}>MONITORING</span>
                                    <span style={{
                                      ...T.tiny, color: B.textSubtle, fontSize: '0.55rem',
                                    }}>tracked, not staked · {monitoringCards.length}</span>
                                    <div style={{ flex: 1, height: '1px', background: B.borderSubtle }} />
                                  </div>
                                  <div className="sf-stagger" style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : monitoringCards.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                                    gap: '0.75rem',
                                    opacity: 0.78,
                                  }}>
                                    {monitoringCards.map(p => (
                                      <SharpLockCardV2 key={p.key} pick={p} isMobile={isMobile} />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </>
                    );
                  })() : (
                    <>
                      {/* Context legend */}
                      <div style={{
                        display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
                        marginBottom: '1rem', padding: '0.625rem 0.875rem',
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, rgba(212,175,55,0.04) 0%, ${B.card} 100%)`,
                        border: `1px solid ${B.borderSubtle}`,
                      }}>
                        <span style={{ ...T.micro, color: B.textSec }}>
                          <span style={{ color: B.gold, fontWeight: 700 }}>ELITE</span> = $100K+ sports profit
                        </span>
                        <span style={{ ...T.micro, color: B.textSec }}>
                          <span style={{ color: B.green, fontWeight: 700 }}>PROVEN</span> = $25K+ sports profit
                        </span>
                        <span style={{ ...T.micro, color: B.textSec }}>
                          <span style={{ fontWeight: 700, color: B.green }}>+$5.5M</span> = all-time P&L on Polymarket
                        </span>
                        <span style={{ ...T.micro, color: B.textSec }}>
                          <span style={{ fontWeight: 700, color: B.green }}>+EV</span> = retail book price beats Pinnacle fair value
                        </span>
                        {sharpStats.totalExcluded > 0 && (
                          <span style={{ ...T.micro, color: B.textSec }}>
                            <span style={{ fontWeight: 700, color: B.red }}>FILTERED</span> = {sharpStats.mmExcluded} MMs + {sharpStats.noSport} non-sport removed
                          </span>
                        )}
                      </div>
                      {allPosGames.length === 0 && sortBy === 'myPicks' ? (
                        <div style={{
                          textAlign: 'center', padding: '2.5rem 1rem', borderRadius: '12px',
                          background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                          border: `1px solid ${B.border}`,
                        }}>
                          <CheckCircle size={28} color="#818CF8" style={{ marginBottom: '0.5rem' }} />
                          {user && isPremium ? (
                            <>
                              <div style={{ ...T.body, color: B.textSec, fontWeight: 600, marginBottom: '0.25rem' }}>Watchlist is empty</div>
                              <div style={{ ...T.micro, color: B.textMuted }}>Browse the games and tap "Add to Watchlist" on any card to start tracking.</div>
                            </>
                          ) : (
                            <>
                              <div style={{ ...T.body, color: B.textSec, fontWeight: 600, marginBottom: '0.25rem' }}>Build your personal watchlist</div>
                              <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.75rem' }}>Pro members can save games to their watchlist for easy tracking.</div>
                              <a href="#/pricing" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.5rem 1.25rem', borderRadius: '8px',
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(129,140,248,0.08) 100%)',
                                border: '1px solid rgba(99,102,241,0.3)',
                                color: '#A5B4FC', fontWeight: 700, fontSize: '0.8rem',
                                textDecoration: 'none', transition: 'all 0.2s ease',
                              }}>
                                <Lock size={13} /> Unlock Watchlist
                              </a>
                            </>
                          )}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })()}

            {sharpStats.gamesWithPos === 0 && sortBy !== 'locked' && sortBy !== 'myPicks' && (
              <div style={{
                textAlign: 'center', padding: '3rem', borderRadius: '12px',
                background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                border: `1px solid ${B.border}`,
              }}>
                <Eye size={28} color={B.textMuted} style={{ marginBottom: '0.5rem' }} />
                <div style={{ ...T.sub, color: B.text, marginBottom: '0.25rem' }}>No sharp positions detected</div>
                <div style={{ ...T.label, color: B.textSec }}>
                  Positions appear when verified sharp bettors have open bets on today's games.
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── Signals View (default) ─── */}
      {viewMode === 'signals' && <>

      {/* ─── Headline Metrics ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '0.625rem', marginBottom: '2rem',
      }}>
        <FlowStatCard icon={DollarSign} label="Market Volume" value={fmtVol(totalVol)} accent={B.gold}
          hint="Exchange-reported 24h volume" />
        <FlowStatCard icon={BarChart3} label="Trades" value={totalTrades}
          hint="Individual trades sampled" />
        <FlowStatCard icon={Activity} label="Whale Positions" value={totalWhales} accent={totalWhales > 20 ? B.gold : null}
          hint="Large bets ($500+) detected" />
        <FlowStatCard icon={Eye} label="Sharp Signals" value={signalCount} accent={signalCount > 0 ? B.gold : null}
          hint="Games where money & tickets disagree" />
      </div>

      {/* ─── All Games (unified view) ─── */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionHead
          title={`Market Signals (${sortedGames.length} games)`}
          subtitle="Full market flow — all bettors, all money, all ticket action across every book"
          icon={BarChart3}
        />
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '0.875rem',
          background: `linear-gradient(135deg, rgba(212,175,55,0.04) 0%, ${B.card} 100%)`,
          border: `1px solid ${B.borderSubtle}`,
        }}>
          <Activity size={12} color={B.gold} style={{ flexShrink: 0 }} />
          <span style={{ ...T.micro, color: B.textSec, lineHeight: 1.4 }}>
            <span style={{ color: B.gold, fontWeight: 700 }}>Signals</span> tracks where all money is flowing — public, sharps, and whales combined.
            For verified sharp bettor positions only, see <span style={{ color: B.gold, fontWeight: 700 }}>Sharp Intel</span>.
          </span>
        </div>
        <div style={{
          display: 'flex', gap: '0.375rem', marginBottom: '0.875rem',
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span style={{ ...T.micro, color: B.textMuted, marginRight: '0.125rem' }}>Sort:</span>
          {[
            { key: 'time', label: 'Game Time' },
            { key: 'divergence', label: 'Divergence' },
            { key: 'volume', label: 'Volume' },
            { key: 'whales', label: 'Whale $' },
            { key: 'active', label: 'Most Active' },
          ].map(s => (
            <button key={s.key} onClick={() => setGameSort(s.key)} style={{
              padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
              ...T.micro, fontWeight: 700,
              border: gameSort === s.key ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
              background: gameSort === s.key ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
              color: gameSort === s.key ? B.gold : B.textMuted,
              transition: 'all 0.2s ease',
            }}>{s.label}</button>
          ))}
          <div style={{ width: '1px', height: '16px', background: B.border, margin: '0 0.25rem' }} />
          <span style={{ ...T.micro, color: B.textMuted, marginRight: '0.125rem' }}>Show:</span>
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'live', label: '● Live' },
            { key: 'all', label: 'All' },
            { key: 'signals', label: 'Signals Only' },
            { key: 'reverse', label: 'Reverse Only' },
          ].map(s => {
            const isLive = s.key === 'live';
            const active = signalType === s.key;
            return (
              <button key={s.key} onClick={() => setSignalType(s.key)} style={{
                padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
                ...T.micro, fontWeight: 700,
                border: active
                  ? `1px solid ${isLive ? 'rgba(239,68,68,0.5)' : B.goldBorder}`
                  : `1px solid ${B.border}`,
                background: active
                  ? isLive ? 'rgba(239,68,68,0.15)' : `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                  : 'transparent',
                color: active ? (isLive ? '#EF4444' : B.gold) : B.textMuted,
                transition: 'all 0.2s ease',
              }}>{s.label}</button>
            );
          })}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '0.75rem',
        }}>
          {sortedGames
            .filter(g => {
              const pg = pinnacleHistory?.[g.sport]?.[g.key];
              const ct = pg?.commence ? new Date(pg.commence).getTime() : null;
              const live = ct && Date.now() >= ct;
              if (signalType === 'upcoming') return !live;
              if (signalType === 'live') return live;
              if (signalType === 'all') return true;
              if (signalType === 'signals') return g.ticketDivergence >= 10;
              if (signalType === 'reverse') {
                const tf = g.awayTicketPct >= g.homeTicketPct ? 'away' : 'home';
                const mf = g.awayMoneyPct >= g.homeMoneyPct ? 'away' : 'home';
                return tf !== mf && g.ticketDivergence >= 10;
              }
              return true;
            })
            .map(g => <GameFlowCard key={g.key} game={g} isMobile={isMobile} whaleProfiles={whaleProfiles} pinnacleHistory={pinnacleHistory} polyData={polyData} />)
          }
        </div>
      </div>

      </>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
      padding: '0.875rem 1.25rem', borderRadius: '10px',
      background: 'linear-gradient(135deg, rgba(21,25,35,0.9) 0%, rgba(26,31,46,0.7) 100%)',
      border: `1px solid ${B.border}`,
      minWidth: '110px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: accent ? `linear-gradient(90deg, transparent 0%, ${accent}40 50%, transparent 100%)` : 'transparent',
      }} />
      {Icon && <Icon size={14} color={accent || B.textMuted} style={{ opacity: 0.6, marginBottom: '0.125rem' }} />}
      <span style={{
        ...T.heading, color: accent || B.text, fontFeatureSettings: "'tnum'",
      }}>{value}</span>
      <span style={{
        ...T.micro, color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{label}</span>
    </div>
  );
}

const FlowStatCard = memo(function FlowStatCard({ icon: Icon, label, value, accent, hint, rawValue, fmt }) {
  // Count-up: when a numeric rawValue (+ formatter) is supplied, the
  // stat sweeps from 0 to its value on mount — odometer credibility.
  const [shown, setShown] = useState(rawValue != null ? 0 : null);
  useEffect(() => {
    if (rawValue == null || !Number.isFinite(rawValue)) return;
    let raf; const t0 = performance.now(); const dur = 1100;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(rawValue * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rawValue]);
  const display = (rawValue != null && Number.isFinite(rawValue) && shown != null)
    ? (fmt ? fmt(shown) : Math.round(shown).toLocaleString())
    : value;
  const ac = accent || B.gold;
  return (
    <div className="sf-card sf-glass" style={{
      display: 'flex', flexDirection: 'column', gap: '0.45rem',
      padding: '1rem 1.15rem 0.95rem', borderRadius: '14px',
      background: `linear-gradient(150deg, ${ac}14 0%, rgba(255,255,255,0.015) 32%, rgba(15,23,42,0.32) 100%)`,
      border: `1px solid ${ac}2e`,
      boxShadow: `0 12px 32px -16px ${ac}55, inset 0 1px 0 rgba(255,255,255,0.045)`,
      minWidth: '110px', position: 'relative', overflow: 'hidden',
    }}>
      {/* accent corner wash + top hairline */}
      <div style={{ position: 'absolute', top: '-45%', right: '-20%', width: '62%', height: '130%', background: `radial-gradient(circle, ${ac}24 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent 0%, ${ac}70 50%, transparent 100%)`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
        {Icon && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '24px', height: '24px', borderRadius: '7px',
            background: `${ac}1f`, border: `1px solid ${ac}38`,
            boxShadow: `0 0 12px -4px ${ac}66`,
          }}>
            <Icon size={13} color={ac} />
          </span>
        )}
        <span style={{ ...T.micro, color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, fontSize: '0.55rem' }}>{label}</span>
      </div>
      <span style={{
        fontSize: '1.7rem', fontWeight: 900, color: accent || B.text, lineHeight: 1,
        letterSpacing: '-0.02em', position: 'relative',
        fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
      }}>{display}</span>
      {hint && (
        <span style={{
          ...T.micro, color: B.textSec, fontSize: '0.56rem', lineHeight: 1.35,
          opacity: 0.78, position: 'relative',
        }}>{hint}</span>
      )}
    </div>
  );
});

function SportTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.375rem' }}>
      {['All', 'CBB', 'NHL', 'MLB', 'NBA', 'SOC'].map(key => {
        const isActive = active === key;
        const ss = key === 'All' ? null : sportStyle(key);
        return (
          <button key={key} onClick={() => onChange(key)} style={{
            padding: '0.5rem 1.125rem', borderRadius: '8px', cursor: 'pointer',
            ...T.tiny,
            border: isActive ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
            background: isActive ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
            color: isActive ? B.gold : B.textMuted,
            transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {ss ? `${ss.icon} ` : '⚡ '}{key}
          </button>
        );
      })}
    </div>
  );
}

function SharpFlowPaywall({ isMobile, lockedCount, pnlData }) {
  const [now, setNow] = useState(Date.now());

  const { fullPrice, discount, endMs, code: promoCode, label: promoLabel } = PAYWALL_PROMO;
  const promoPrice = (fullPrice * (1 - discount)).toFixed(2);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, endMs - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const promoActive = remaining > 0;

  const v12Proof = computeV12EraStats(pnlData?.picks || []);

  // Features rewritten as proof-backed bullets. Numbers come straight
  // from v12Proof when available, fall back to neutral copy otherwise.
  const features = v12Proof.ready ? [
    { label: `Verified track record · ${v12Proof.record} (${v12Proof.winPct.toFixed(1)}%)`, sub: `${v12Proof.totalGraded} graded picks since v12 launch` },
    { label: `Conviction-sized auto-locks · 5u → 0.25u ladder`, sub: 'ELITE plays at 5u, weak edges at 0.25u, fades muted' },
    { label: '200+ sharp wallets tracked nightly', sub: 'Verified profitable accounts, refreshed 4× per day' },
    { label: 'Pinnacle fair odds + best-retail EV scoring', sub: 'Every lock is graded against closing-line value' },
    { label: 'Full audit trail · every pick, every day', sub: 'Auto-graded each night, no cherry-picking, no edits' },
    { label: 'Live market flow · tickets, money, whale action', sub: 'Reverse line moves and conviction alerts as they happen' },
  ] : [
    { label: 'Verified sharp bettor tracking in real time', sub: '200+ profitable wallets refreshed nightly' },
    { label: 'Pinnacle fair value + best retail EV edge', sub: 'Every lock graded against closing line' },
    { label: 'Auto-locked plays with smart unit sizing', sub: 'Conviction tier drives 0.25u → 5u sizing' },
    { label: 'Full market flow — tickets, money, whale action', sub: 'Reverse line moves and conviction alerts' },
    { label: 'Line movement alerts + RLM detection', sub: 'Real-time when the market moves against the public' },
    { label: 'Complete performance dashboard with ROI tracking', sub: 'Equity curve, tier breakdown, full audit trail' },
  ];

  return (
    <div style={{
      marginTop: '2rem', borderRadius: '16px', overflow: 'hidden',
      background: `linear-gradient(145deg, rgba(212,175,55,0.08) 0%, ${B.card} 35%, rgba(16,185,129,0.05) 100%)`,
      border: `1px solid rgba(212,175,55,0.3)`,
      boxShadow: '0 4px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.10)',
      position: 'relative',
    }}>
      {/* Gold hairline glint along the top — matches the dashboard body */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Promo banner strip */}
      {promoActive && (
        <div style={{
          background: 'linear-gradient(90deg, #D4AF37 0%, #F5D060 50%, #D4AF37 100%)',
          padding: '0.55rem 1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          letterSpacing: '0.06em',
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#0B1120', textTransform: 'uppercase' }}>
            {promoLabel.toUpperCase()} · 33% OFF FOR LIFE
          </span>
        </div>
      )}

      <div style={{ padding: isMobile ? '1.75rem 1.25rem 1.5rem' : '2rem 2rem 1.75rem', position: 'relative' }}>

        {/* ── PROOF HERO ──────────────────────────────────────
            The bridge from "you just scrolled past 86-73-2 ·
            +26.80u of proof" to "now buy this". Free users see
            the dashboard fully — this banner makes sure those
            numbers don't evaporate when they hit the upgrade
            wall. If the PnL feed hasn't loaded yet, we still
            show premium chrome but skip the bragging numbers. */}
        {v12Proof.ready ? (
          <div style={{ marginBottom: isMobile ? '1.5rem' : '1.75rem' }}>
            {/* Section eyebrow — matches dashboard "since launch" telemetry row. */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              marginBottom: '0.65rem', flexWrap: 'wrap',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.15rem 0.5rem', borderRadius: '4px',
                background: B.greenDim, border: `1px solid ${B.green}33`,
              }}>
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: B.green,
                  boxShadow: `0 0 6px ${B.green}`,
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                <span style={{ ...T.micro, color: B.green, fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.12em' }}>
                  LIVE
                </span>
              </span>
              <span style={{ ...T.micro, color: B.gold, fontWeight: 900, letterSpacing: '0.12em', fontSize: '0.58rem' }}>
                ◆ AGS-U v12 PERFORMANCE
              </span>
              <span style={{ ...T.micro, color: B.textSec, fontSize: '0.58rem', letterSpacing: '0.05em' }}>
                <span style={{ color: B.text, fontWeight: 800 }}>{v12Proof.daysLive}</span> day{v12Proof.daysLive === 1 ? '' : 's'} live
                <span style={{ color: B.textSubtle, margin: '0 0.4rem' }}>·</span>
                <span style={{ color: B.text, fontWeight: 800 }}>{v12Proof.totalGraded}</span> graded
              </span>
            </div>

            {/* ── Unified hero card ─────────────────────────────
                Exact same 1-feature + 3-supporting shape as the
                dashboard PROFIT card. The PROFIT feature spans
                ~half the row with a gradient hero number and a
                $-on-$100/u translation; RECORD / WIN% / ROI sit
                as three small supporting cards on the right with
                matching chrome (same border tone, same corner
                glints, same inset highlight). Free users see
                this and the logged-in dashboard hero are the
                same object. */}
            {(() => {
              const dollarsPerUnit = 100;
              const dollarProfit = v12Proof.profit * dollarsPerUnit;
              const dollarSign = dollarProfit >= 0 ? '+$' : '-$';
              const dollarFmt = Math.abs(dollarProfit).toLocaleString('en-US', { maximumFractionDigits: 0 });
              const profitGradient = v12Proof.isProfit
                ? `linear-gradient(135deg, ${B.green} 0%, #34D399 100%)`
                : `linear-gradient(135deg, ${B.red} 0%, #F87171 100%)`;
              const heroBg = v12Proof.isProfit
                ? `linear-gradient(140deg, rgba(16,185,129,0.10) 0%, rgba(255,255,255,0.018) 35%, rgba(15,23,42,0.55) 100%)`
                : `linear-gradient(140deg, rgba(239,68,68,0.10) 0%, rgba(255,255,255,0.018) 35%, rgba(15,23,42,0.55) 100%)`;
              const heroBorder = v12Proof.isProfit ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.28)';
              const heroShadow = v12Proof.isProfit
                ? '0 8px 28px -10px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.04)'
                : '0 8px 28px -10px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.04)';
              const supportCard = (eyebrow, value, valueColor, sub) => (
                <div style={{
                  padding: '0.7rem 0.8rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(15,23,42,0.55) 100%)',
                  border: `1px solid ${B.borderSubtle}`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.025)',
                }}>
                  {/* Gold corner glint — matches the hero card device, scaled down */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '30%', height: '1px',
                    background: `linear-gradient(90deg, ${B.gold} 0%, transparent 100%)`,
                    opacity: 0.35, pointerEvents: 'none',
                  }} />
                  <div style={{ ...T.micro, color: B.textMuted, fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.52rem' }}>
                    {eyebrow}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '1.2rem' : '1.35rem', fontWeight: 900,
                    color: valueColor, lineHeight: 1.1,
                    fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.01em', marginTop: '0.35rem',
                  }}>
                    {value}
                  </div>
                  <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem', marginTop: '0.25rem' }}>
                    {sub}
                  </div>
                </div>
              );
              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.05fr) minmax(0, 1fr)',
                  gap: '0.7rem',
                }}>
                  {/* PROFIT — feature card */}
                  <div style={{
                    position: 'relative', overflow: 'hidden',
                    padding: isMobile ? '1.1rem 1.1rem 1rem' : '1.25rem 1.3rem 1.15rem',
                    borderRadius: '12px',
                    background: heroBg,
                    border: `1px solid ${heroBorder}`,
                    boxShadow: heroShadow,
                  }}>
                    {/* Gold corner glints */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '40%', height: '1px',
                      background: `linear-gradient(90deg, ${B.gold} 0%, transparent 100%)`,
                      opacity: 0.5, pointerEvents: 'none',
                    }} />
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '1px', height: '40%',
                      background: `linear-gradient(180deg, ${B.gold} 0%, transparent 100%)`,
                      opacity: 0.5, pointerEvents: 'none',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <span style={{
                        ...T.micro, color: B.gold, fontWeight: 900,
                        letterSpacing: '0.12em', fontSize: '0.55rem',
                      }}>
                        ◆ TOTAL PROFIT · v12 ERA
                      </span>
                      {v12Proof.isProfit
                        ? <TrendingUp size={13} color={B.green} />
                        : <TrendingDown size={13} color={B.red} />}
                    </div>
                    {/* Gradient hero number — see dashboard equivalent for
                        the same inline-block + backgroundImage rationale. */}
                    <div style={{ lineHeight: 1 }}>
                      <span style={{
                        display: 'inline-block',
                        fontSize: isMobile ? '2.4rem' : '2.85rem',
                        fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em',
                        fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                        color: v12Proof.isProfit ? B.green : B.red,
                        backgroundImage: profitGradient,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
                        {v12Proof.isProfit ? '+' : ''}{v12Proof.profit.toFixed(2)}u
                      </span>
                    </div>
                    <div style={{
                      ...T.micro, color: B.textSec, fontSize: '0.68rem',
                      marginTop: '0.4rem', letterSpacing: '0.02em',
                      fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums',
                    }}>
                      ≈ <span style={{ color: B.text, fontWeight: 800 }}>{dollarSign}{dollarFmt}</span> if you wagered <span style={{ color: B.textMuted }}>$100/unit</span>
                    </div>
                  </div>

                  {/* Supporting trio */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                  }}>
                    {supportCard('RECORD', v12Proof.record, B.text, `${v12Proof.totalGraded} graded`)}
                    {supportCard(
                      'WIN %',
                      `${v12Proof.winPct.toFixed(1)}%`,
                      v12Proof.winPct >= 52.4 ? B.green : v12Proof.winPct >= 50 ? B.textSec : B.red,
                      'breakeven 52.4%'
                    )}
                    {supportCard(
                      'ROI',
                      `${v12Proof.roi >= 0 ? '+' : ''}${v12Proof.roi.toFixed(1)}%`,
                      v12Proof.roi >= 0 ? B.green : B.red,
                      `${v12Proof.units.toFixed(1)}u risked`
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* Fallback hero — premium chrome without bragging numbers */
          <div style={{
            marginBottom: '1.5rem',
            padding: isMobile ? '1rem 1.1rem' : '1.1rem 1.3rem',
            borderRadius: '12px',
            background: 'linear-gradient(140deg, rgba(212,175,55,0.06) 0%, rgba(15,23,42,0.5) 100%)',
            border: '1px solid rgba(212,175,55,0.25)',
            display: 'flex', alignItems: 'center', gap: '0.7rem',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.2rem 0.55rem', borderRadius: '5px',
              background: B.greenDim, border: `1px solid ${B.green}33`,
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: B.green, boxShadow: `0 0 6px ${B.green}`,
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              <span style={{ ...T.micro, color: B.green, fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.12em' }}>
                LIVE
              </span>
            </span>
            <span style={{ ...T.micro, color: B.gold, fontWeight: 900, letterSpacing: '0.1em', fontSize: '0.65rem' }}>
              AGS-U v12 TRACKING
            </span>
          </div>
        )}

        {/* ── Headline + subhead ────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {/* Lock badge — replaces the old 🏒🏀 emoji.
              Circular gold-haloed glyph that visually anchors
              the "unlock" idea and stays on-brand with the
              dashboard's gold/dark palette. */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '54px', height: '54px', borderRadius: '50%',
            background: 'linear-gradient(140deg, rgba(212,175,55,0.18) 0%, rgba(15,23,42,0.55) 100%)',
            border: '1px solid rgba(212,175,55,0.35)',
            boxShadow: '0 6px 24px -6px rgba(212,175,55,0.30), inset 0 1px 0 rgba(255,255,255,0.06)',
            marginBottom: '0.85rem', position: 'relative',
          }}>
            <Lock size={22} color={B.gold} strokeWidth={2.2} />
          </div>
          <h2 style={{
            fontSize: isMobile ? '1.4rem' : '1.75rem', fontWeight: 900,
            color: B.text, margin: '0 0 0.55rem 0', letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            {lockedCount
              ? <><span style={{ color: B.gold }}>{lockedCount} more game{lockedCount !== 1 ? 's' : ''}</span> locked behind Sharp Flow</>
              : <>Unlock the <span style={{
                  display: 'inline-block',
                  color: B.gold,
                  backgroundImage: `linear-gradient(135deg, ${B.gold} 0%, ${B.goldHover} 100%)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>live signal</span></>}
          </h2>
          <p style={{
            ...T.body, color: B.textSec, margin: '0 auto', maxWidth: '540px', lineHeight: 1.7,
          }}>
            {v12Proof.ready
              ? <>The numbers above are <span style={{ color: B.text, fontWeight: 700 }}>real picks</span>, auto-graded every night
                  against closing lines. Sharp Flow surfaces the same locks in real time — sized, tagged, and ready to bet.</>
              : <>We track <span style={{ color: B.text, fontWeight: 700 }}>200+ verified sharp bettors</span>, score every pick by conviction,
                  and auto-size the locks. Every result is graded the same way the dashboard above shows it.</>}
          </p>
        </div>

        {/* ── Features grid — proof-backed bullets ──────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '0.65rem 1.25rem', marginBottom: '1.75rem',
          maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.55rem',
              padding: '0.35rem 0',
            }}>
              <div style={{
                flexShrink: 0, marginTop: '0.1rem',
                width: '16px', height: '16px', borderRadius: '50%',
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={10} color={B.green} strokeWidth={3} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ ...T.label, color: B.text, fontWeight: 700, lineHeight: 1.35, fontSize: '0.78rem' }}>
                  {f.label}
                </div>
                <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.62rem', lineHeight: 1.45, marginTop: '0.15rem' }}>
                  {f.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pricing + promo card ──────────────────────────── */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.20) 100%)',
          borderRadius: '14px', padding: isMobile ? '1.5rem 1.25rem' : '1.75rem 2rem',
          border: `1px solid rgba(212,175,55,0.25)`,
          maxWidth: '480px', margin: '0 auto',
          position: 'relative', overflow: 'hidden',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {/* Tier-ribbon accent — same device as the dashboard's tier cards */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: '3px',
            background: `linear-gradient(180deg, ${B.gold} 0%, ${B.green} 100%)`,
            boxShadow: `0 0 10px ${B.gold}55`,
          }} />

          {/* Countdown timer */}
          {promoActive && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ ...T.micro, color: B.gold, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem', fontSize: '0.62rem' }}>
                  SUMMER LAUNCH OFFER ENDS IN
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {[
                    { val: days, label: 'DAYS' },
                    { val: hours, label: 'HRS' },
                    { val: minutes, label: 'MIN' },
                    { val: seconds, label: 'SEC' },
                  ].map(t => (
                    <div key={t.label} style={{
                      background: 'linear-gradient(180deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.04) 100%)',
                      border: '1px solid rgba(212,175,55,0.30)',
                      borderRadius: '8px', padding: '0.5rem 0.6rem', minWidth: isMobile ? '50px' : '58px',
                      textAlign: 'center',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}>
                      <div style={{
                        fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 900, color: B.gold,
                        fontFeatureSettings: "'tnum'", lineHeight: 1, letterSpacing: '-0.02em',
                      }}>
                        {String(t.val).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: B.textMuted, letterSpacing: '0.1em', marginTop: '0.2rem' }}>
                        {t.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price display with discount — green gradient hero */}
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem',
                marginBottom: '0.6rem',
              }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: isMobile ? '2.1rem' : '2.5rem', fontWeight: 900,
                  color: B.green,
                  backgroundImage: `linear-gradient(135deg, ${B.green} 0%, #34D399 100%)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em',
                }}>
                  ${promoPrice}
                </span>
                <span style={{ ...T.body, color: B.textSec, fontWeight: 600 }}>/mo</span>
                <span style={{
                  fontSize: '1.05rem', color: B.textMuted, textDecoration: 'line-through', fontWeight: 600,
                  opacity: 0.55, fontFeatureSettings: "'tnum'",
                }}>
                  ${fullPrice}
                </span>
              </div>

              {/* Promo code callout */}
              <div style={{
                textAlign: 'center', marginBottom: '1rem',
                padding: '0.6rem 0.75rem', borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.04) 100%)',
                border: '1px solid rgba(212,175,55,0.30)',
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: B.textSec }}>
                  Use code </span>
                <span style={{
                  fontSize: '0.88rem', fontWeight: 900, color: B.gold,
                  padding: '0.15rem 0.5rem', borderRadius: '4px',
                  background: 'rgba(212,175,55,0.18)', letterSpacing: '0.08em',
                }}>{promoCode}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: B.textSec }}>
                  {' '}— </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: B.green }}>
                  33% off for life
                </span>
              </div>
            </>
          )}

          {/* Non-promo pricing */}
          {!promoActive && (
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <span style={{
                display: 'inline-block',
                fontSize: isMobile ? '2.1rem' : '2.4rem', fontWeight: 900,
                color: B.green,
                backgroundImage: `linear-gradient(135deg, ${B.green} 0%, #34D399 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em',
              }}>
                $25.99
              </span>
              <span style={{ ...T.body, color: B.textSec, fontWeight: 600 }}>/mo</span>
            </div>
          )}

          {/* Free trial badge */}
          <div style={{
            textAlign: 'center', marginBottom: '0.85rem',
            padding: '0.55rem 0.75rem', borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 100%)',
            border: '1px solid rgba(99,102,241,0.28)',
          }}>
            <span style={{ ...T.label, color: '#A5B4FC', fontWeight: 800, letterSpacing: '0.05em' }}>5-DAY FREE TRIAL</span>
            <span style={{ ...T.micro, color: B.textSec, marginLeft: '0.4rem' }}>— full access, cancel anytime</span>
          </div>

          {/* CTA — green gradient w/ gold-halo hover */}
          <a
            href={promoActive ? `#/pricing?promo=${promoCode}` : '#/pricing'}
            className="sharpflow-paywall-cta"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
              padding: '0.95rem 1.5rem', borderRadius: '11px',
              background: `linear-gradient(135deg, ${B.green} 0%, #059669 100%)`,
              color: '#fff', fontWeight: 900, fontSize: isMobile ? '1.05rem' : '1.02rem',
              textDecoration: 'none', letterSpacing: '0.01em',
              boxShadow: '0 6px 24px rgba(16,185,129,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {promoActive ? 'Claim Summer Offer →' : 'Start Free Trial →'}
          </a>

          {/* Trust badges */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '1.1rem',
            marginTop: '0.85rem', flexWrap: 'wrap',
          }}>
            <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.6rem' }}>✓ 5 days free</span>
            <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.6rem' }}>✓ Cancel anytime</span>
            <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.6rem' }}>✓ Auto-graded results</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ sportFilter, setSportFilter, viewMode, setViewMode, isMobile }) {
  return (
    <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: `1px solid ${B.border}` }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row', gap: '0.75rem',
      }}>
        <div>
          <h1 style={{
            fontSize: isMobile ? '1.375rem' : '1.75rem', fontWeight: 900,
            color: B.text, margin: 0, display: 'flex', alignItems: 'center',
            gap: '0.625rem', letterSpacing: '-0.02em',
          }}>
            <Zap size={isMobile ? 20 : 24} color={B.gold} fill={B.gold} style={{ opacity: 0.9 }} />
            Sharp Flow
          </h1>
          <p style={{ ...T.label, color: B.textSec, margin: '0.375rem 0 0 0' }}>
            Real-time market intelligence across prediction markets
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          {/* View mode toggle */}
          <div style={{
            display: 'flex', borderRadius: '8px', overflow: 'hidden',
            border: `1px solid ${B.border}`,
          }}>
            <button onClick={() => setViewMode('signals')} style={{
              padding: '0.5rem 0.875rem', cursor: 'pointer',
              ...T.tiny, display: 'flex', alignItems: 'center', gap: '0.3rem',
              border: 'none', borderRight: `1px solid ${B.border}`,
              background: viewMode === 'signals'
                ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                : 'transparent',
              color: viewMode === 'signals' ? B.gold : B.textMuted,
              transition: 'all 0.2s ease',
            }}>
              <BarChart3 size={12} /> Signals
            </button>
            <button onClick={() => setViewMode('flow')} style={{
              padding: '0.5rem 0.875rem', cursor: 'pointer',
              ...T.tiny, display: 'flex', alignItems: 'center', gap: '0.3rem',
              border: 'none', borderRight: `1px solid ${B.border}`,
              background: viewMode === 'flow'
                ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                : 'transparent',
              color: viewMode === 'flow' ? B.gold : B.textMuted,
              transition: 'all 0.2s ease',
            }}>
              <Workflow size={12} /> Money Flow
            </button>
            <button onClick={() => setViewMode('whaleSignals')} style={{
              padding: '0.5rem 0.875rem', cursor: 'pointer',
              ...T.tiny, display: 'flex', alignItems: 'center', gap: '0.3rem',
              border: 'none', borderRight: `1px solid ${B.border}`,
              background: viewMode === 'whaleSignals'
                ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                : 'transparent',
              color: viewMode === 'whaleSignals' ? B.gold : B.textMuted,
              transition: 'all 0.2s ease',
            }}>
              <Zap size={12} /> Sharp Intel
            </button>
            <button onClick={() => setViewMode('sharpVault')} style={{
              padding: '0.5rem 0.875rem', cursor: 'pointer',
              ...T.tiny, display: 'flex', alignItems: 'center', gap: '0.3rem',
              border: 'none',
              background: viewMode === 'sharpVault'
                ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                : 'transparent',
              color: viewMode === 'sharpVault' ? B.gold : B.textMuted,
              transition: 'all 0.2s ease',
            }}>
              <Lock size={12} /> Sharp Vault
            </button>
          </div>
          <SportTabs active={sportFilter} onChange={setSportFilter} />
        </div>
      </div>
    </div>
  );
}

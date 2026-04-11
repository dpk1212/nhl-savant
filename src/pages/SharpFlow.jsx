/**
 * Sharp Flow — Premium Whale Trade Intelligence
 *
 * Game-centric view: every game's full money story in one place.
 * Sharp Signals surface where money disagrees with tickets (the edge).
 * Expandable game cards show individual whale trades in context.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Activity, Zap, BarChart3, Eye, ArrowUpRight, ArrowDownRight, Minus, DollarSign, Workflow, Lock, CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { resolveOutcomeSide } from '../utils/teamNameMapper';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteField } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

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
  if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000)     return '$' + (v / 1_000).toFixed(1) + 'K';
  return '$' + Math.round(v);
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

  return {
    breadth, conviction, concentration, counterSharpScore, consensusTier,
    conWalletCount: conWallets.length, oppWalletCount: oppWallets.length,
    conTotalInvested, oppTotalInv, avgScore, sportSharpCount, dominantTier,
    conMoneyPct, conWalletPct,
  };
}

function calculateUnits(stars, consensusPenalty = 0, odds = null) {
  let units = stars >= 5 ? 3.5 : stars >= 4.5 ? 3 : stars >= 4 ? 2.5 : stars >= 3.5 ? 2 : stars >= 3 ? 1.5 : 1;
  units += consensusPenalty;
  units = Math.min(Math.max(units, 0.5), 5);
  if (odds != null && odds >= 200) units = Math.min(units, 0.5);
  else if (odds != null && odds >= 151) units = Math.min(units, 1.0);
  else if (odds != null && odds >= 100) units = Math.min(units, 2.0);
  return units;
}

function unitTier(units) {
  if (units >= 3) return { label: 'MAX', color: '#10B981', icon: '🔥' };
  if (units >= 2) return { label: 'STRONG', color: '#D4AF37', icon: '⚡' };
  return { label: 'STANDARD', color: '#94A3B8', icon: '✓' };
}

function profitFromOdds(odds, units) {
  if (odds > 0) return units * (odds / 100);
  return units * (100 / Math.abs(odds));
}

// ─── Spread/Total Conviction Rating ───────────────────────────────────────────

function rateSpreadTotalStars({
  evEdge = 0, pinnConfirms = false, pinnMovingWith = false, pinnMovingAgainst = false,
  polyMovingWith = false,
  breadth = 0, conviction = 0, concentration = 0, counterSharpScore = 0,
  consensusTier = 'LEAN',
  sportSharpCount = 0,
  pinnProb = null, dominantTier = null, conWalletCount = 0,
  odds = null, sport = null,
} = {}) {
  let pts = 0;

  if (breadth >= 0.5) pts += 3;
  else if (breadth >= 0.35) pts += 2;
  else if (breadth >= 0.2) pts += 1;
  else if (breadth >= 0.1) pts += 0.5;

  // Pinnacle alignment (max 3 pts / -1 penalty)
  if (pinnConfirms && pinnMovingWith) pts += 3;
  else if (pinnConfirms) pts += 1.5;
  else if (pinnMovingWith) pts += 1.5;
  if (pinnMovingAgainst) pts -= 1;

  if (conviction >= 0.8) pts += 1.5;
  else if (conviction >= 0.5) pts += 1;
  else if (conviction >= 0.25) pts += 0.5;

  // Concentration penalty — softened when ELITE-led with multi-wallet confirmation
  if (concentration > 0.9) {
    pts -= (dominantTier === 'ELITE' && conWalletCount >= 4) ? 0.5 : 1;
  } else if (concentration > 0.8) {
    pts -= (dominantTier === 'ELITE' && conWalletCount >= 4) ? 0.25 : 0.5;
  }

  if (counterSharpScore >= 6) pts -= 3;
  else if (counterSharpScore >= 3) pts -= 2;
  else if (counterSharpScore >= 1) pts -= 1;

  if (evEdge > 3) pts += 3.5;
  else if (evEdge > 2) pts += 2.5;
  else if (evEdge > 1) pts += 1.5;
  else if (evEdge > 0) pts += 0.5;

  // Implied probability — small nudge based on Pinnacle line
  if (pinnProb != null) {
    if (pinnProb >= 0.75) pts += 0.5;
    else if (pinnProb < 0.30) pts -= 0.5;
  }

  // Consensus strength bonus — overwhelming sharp agreement
  if (consensusTier === 'DOMINANT') pts += 2;
  else if (consensusTier === 'STRONG') pts += 1;

  if (polyMovingWith) {
    if (consensusTier === 'LEAN' || consensusTier === 'CONTESTED') pts += 1.5;
    else if (consensusTier === 'STRONG') pts += 0.5;
    else pts += 0.25;
  }

  if (sportSharpCount >= 3) pts += 1.5;
  else if (sportSharpCount >= 2) pts += 1;
  else if (sportSharpCount >= 1) pts += 0.5;

  // Dog penalty — long dogs historically lose at high rates
  if (odds != null && odds >= 200) pts -= 2;
  else if (odds != null && odds >= 151) pts -= 1;

  // NBA dog penalty — NBA dogs are 3-20 (13% WR)
  if (sport === 'NBA' && odds != null && odds >= 100) pts -= 1.5;

  const maxPts = 15;
  const raw = (pts / maxPts) * 5;
  const stars = Math.min(5, Math.max(0.5, Math.round(raw * 2) / 2));

  const labels = {
    5:   { label: 'ELITE PLAY',  color: B.green,   bg: B.greenDim },
    4.5: { label: 'ELITE PLAY',  color: B.green,   bg: B.greenDim },
    4:   { label: 'STRONG PLAY', color: B.green,   bg: 'rgba(16,185,129,0.08)' },
    3.5: { label: 'STRONG PLAY', color: B.green,   bg: 'rgba(16,185,129,0.08)' },
    3:   { label: 'SOLID PLAY',  color: B.green,   bg: 'rgba(16,185,129,0.08)' },
    2.5: { label: 'SOLID PLAY',  color: B.gold,    bg: B.goldDim },
    2:   { label: 'LEAN',        color: B.gold,    bg: B.goldDim },
    1.5: { label: 'DEVELOPING',  color: B.textSec, bg: 'rgba(255,255,255,0.04)' },
    1:   { label: 'MONITORING',  color: B.textSec, bg: 'rgba(255,255,255,0.04)' },
    0.5: { label: 'MONITORING',  color: B.textSec, bg: 'rgba(255,255,255,0.04)' },
  };
  const info = labels[stars] || labels[1];
  return { stars, pts, maxPts, ...info, isActionable: stars >= 3 };
}

function calculateSpreadTotalUnits(stars, consensusPenalty = 0, odds = null) {
  let units = stars >= 5 ? 2.0 : stars >= 4.5 ? 1.75 : stars >= 4 ? 1.5
             : stars >= 3.5 ? 1.25 : stars >= 3 ? 1.0 : 0.5;
  units += consensusPenalty;
  units = Math.min(Math.max(units, 0.5), 2);
  if (odds != null && odds >= 200) units = Math.min(units, 0.5);
  else if (odds != null && odds >= 151) units = Math.min(units, 0.75);
  else if (odds != null && odds >= 100) units = Math.min(units, 1.0);
  return units;
}

// ─── Sharp Flow Locked Picks — Firebase ───────────────────────────────────────

function todayET() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function gameDate(commenceTime) {
  if (!commenceTime) return todayET();
  return new Date(commenceTime).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, opposition) {
  const now = Date.now();
  const tier = unitTier(units).label;
  const snapshot = { odds, book, pinnacleOdds, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units, unitTier: tier, consensusStrength, stars: stars || 0 };
  if (opposition) snapshot.opposition = opposition;
  return {
    team,
    lock: { ...snapshot, lockedAt: now },
    peak: { ...snapshot, updatedAt: now },
    maxEV: evEdge || 0,
    maxEVAt: now,
    status: 'PENDING',
    result: { outcome: null, profit: null, gradedAt: null },
  };
}

async function syncPickToFirebase({ date, sport, gameKey, away, home, commenceTime, side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, opposition }) {
  try {
    const PREGAME_BUFFER_MS = 5 * 60 * 1000;
    const docId = `${date}_${sport}_${gameKey}`;
    if (!commenceTime || Date.now() >= commenceTime - PREGAME_BUFFER_MS) {
      return { docId, action: 'no_change' };
    }

    const ref = doc(db, 'sharpFlowPicks', docId);
    const existing = await getDoc(ref);

    if (!existing.exists()) {
      const sideData = buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, opposition);
      await setDoc(ref, {
        date, sport, gameKey, away, home, commenceTime: commenceTime || null,
        lockType: 'PREGAME',
        sides: { [side]: sideData },
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

    if (sides[side]) {
      if (sides[side].status === 'COMPLETED') return { docId, action: 'no_change' };

      const currentMaxEV = sides[side].maxEV ?? 0;
      const currentEV = evEdge || 0;
      const evIsNewMax = currentEV > currentMaxEV;

      const currentPeak = sides[side].peak?.units || 0;
      const currentPeakStars = sides[side].peak?.stars || 0;
      const lockStars = sides[side].lock?.stars || stars;
      const starDelta = stars - lockStars;
      const topPickBonus = starDelta >= 1.5 ? 1.0 : starDelta >= 1.0 ? 0.5 : 0;
      const bumpedUnits = Math.min(Math.max(units + topPickBonus, 0.5), 5);
      if (bumpedUnits > currentPeak || stars > currentPeakStars) {
        const tier = unitTier(bumpedUnits).label;
        const peakData = { odds, book, pinnacleOdds, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units: bumpedUnits, unitTier: tier, consensusStrength, stars: stars || 0, updatedAt: Date.now() };
        if (opposition) peakData.opposition = opposition;
        const mergeData = { sides: { [side]: { peak: peakData } }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: 'peak_updated' };
        if (evIsNewMax) { mergeData.sides[side].maxEV = currentEV; mergeData.sides[side].maxEVAt = Date.now(); }
        await setDoc(ref, mergeData, { merge: true });
        return { docId, action: 'peak_updated' };
      }

      if (evIsNewMax) {
        await setDoc(ref, {
          sides: { [side]: { maxEV: currentEV, maxEVAt: Date.now() } },
          lastWriteAt: Date.now(),
        }, { merge: true });
        return { docId, action: 'maxev_updated' };
      }

      return { docId, action: 'no_change' };
    }

    const existingSides = Object.entries(sides);
    const existingBestStars = existingSides.reduce((max, [, sd]) => {
      const s = sd.peak?.stars || sd.lock?.stars || 0;
      return s > max ? s : max;
    }, 0);
    if (stars <= existingBestStars) {
      return { docId, action: 'no_change' };
    }
    const sideData = buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars, opposition);
    const mergePayload = { sides: { [side]: sideData }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: 'side_added' };
    for (const [existingSide] of existingSides) {
      mergePayload.sides[existingSide] = { ...mergePayload.sides[existingSide], superseded: true, supersededAt: Date.now() };
    }
    await setDoc(ref, mergePayload, { merge: true });
    return { docId, action: 'side_added' };
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

// ─── Spread/Total Firebase Sync ───────────────────────────────────────────────

function buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars) {
  const now = Date.now();
  const tier = unitTier(units).label;
  const snapshot = { odds, book, pinnacleOdds, line, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units, unitTier: tier, consensusStrength, stars: stars || 0 };
  return {
    team,
    lock: { ...snapshot, lockedAt: now },
    peak: { ...snapshot, updatedAt: now },
    maxEV: evEdge || 0,
    maxEVAt: now,
    status: 'PENDING',
    result: { outcome: null, profit: null, gradedAt: null },
  };
}

async function syncSpreadPickToFirebase({ date, sport, gameKey, away, home, commenceTime, side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars }) {
  try {
    const PREGAME_BUFFER_MS = 5 * 60 * 1000;
    const docId = `${date}_${sport}_${gameKey}_spread`;
    if (!commenceTime || Date.now() >= commenceTime - PREGAME_BUFFER_MS) {
      return { docId, action: 'no_change' };
    }
    const ref = doc(db, 'sharpFlowSpreads', docId);
    const existing = await getDoc(ref);

    if (!existing.exists()) {
      const sideData = buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars);
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

    if (sides[side]) {
      if (sides[side].status === 'COMPLETED') return { docId, action: 'no_change' };
      const needsCsPatch = consensusStrength?.moneyPct != null && sides[side].lock?.consensusStrength?.moneyPct == null;
      const currentPeak = sides[side].peak?.units || 0;
      const currentPeakStars = sides[side].peak?.stars || 0;
      const lockStars = sides[side].lock?.stars || stars;
      const starDelta = stars - lockStars;
      const topPickBonus = starDelta >= 1.5 ? 0.5 : starDelta >= 1.0 ? 0.25 : 0;
      const bumpedUnits = Math.min(Math.max(units + topPickBonus, 0.5), 2);
      if (bumpedUnits > currentPeak || stars > currentPeakStars) {
        const tier = unitTier(bumpedUnits).label;
        const peakData = { odds, book, pinnacleOdds, line, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units: bumpedUnits, unitTier: tier, consensusStrength, stars: stars || 0, updatedAt: Date.now() };
        const mergeObj = { sides: { [side]: { peak: peakData } }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: 'peak_updated' };
        if (needsCsPatch) mergeObj.sides[side].lock = { ...sides[side].lock, consensusStrength };
        await setDoc(ref, mergeObj, { merge: true });
        return { docId, action: 'peak_updated' };
      }
      if (needsCsPatch) {
        await setDoc(ref, { sides: { [side]: { lock: { consensusStrength }, peak: { ...sides[side].peak, consensusStrength } } }, lastWriteAt: Date.now() }, { merge: true });
        return { docId, action: 'cs_patched' };
      }
      return { docId, action: 'no_change' };
    }

    const existingSides = Object.entries(sides);
    const existingBestStars = existingSides.reduce((max, [, sd]) => {
      const s = sd.peak?.stars || sd.lock?.stars || 0;
      return s > max ? s : max;
    }, 0);
    if (stars <= existingBestStars) {
      return { docId, action: 'no_change' };
    }
    const sideData = buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars);
    const mergePayload = { sides: { [side]: sideData }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: 'side_added' };
    for (const [existingSide] of existingSides) {
      mergePayload.sides[existingSide] = { ...mergePayload.sides[existingSide], superseded: true, supersededAt: Date.now() };
    }
    await setDoc(ref, mergePayload, { merge: true });
    return { docId, action: 'side_added' };
  } catch (err) {
    console.warn('Failed to sync spread pick:', err.message);
    return { docId: `${date}_${sport}_${gameKey}_spread`, action: 'error' };
  }
}

async function syncTotalPickToFirebase({ date, sport, gameKey, away, home, commenceTime, side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars }) {
  try {
    const PREGAME_BUFFER_MS = 5 * 60 * 1000;
    const docId = `${date}_${sport}_${gameKey}_total`;
    if (!commenceTime || Date.now() >= commenceTime - PREGAME_BUFFER_MS) {
      return { docId, action: 'no_change' };
    }
    const ref = doc(db, 'sharpFlowTotals', docId);
    const existing = await getDoc(ref);

    if (!existing.exists()) {
      const sideData = buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars);
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

    if (sides[side]) {
      if (sides[side].status === 'COMPLETED') return { docId, action: 'no_change' };
      const needsCsPatch = consensusStrength?.moneyPct != null && sides[side].lock?.consensusStrength?.moneyPct == null;
      const currentPeak = sides[side].peak?.units || 0;
      const currentPeakStars = sides[side].peak?.stars || 0;
      const lockStars = sides[side].lock?.stars || stars;
      const starDelta = stars - lockStars;
      const topPickBonus = starDelta >= 1.5 ? 0.5 : starDelta >= 1.0 ? 0.25 : 0;
      const bumpedUnits = Math.min(Math.max(units + topPickBonus, 0.5), 2);
      if (bumpedUnits > currentPeak || stars > currentPeakStars) {
        const tier = unitTier(bumpedUnits).label;
        const peakData = { odds, book, pinnacleOdds, line, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units: bumpedUnits, unitTier: tier, consensusStrength, stars: stars || 0, updatedAt: Date.now() };
        const mergeObj = { sides: { [side]: { peak: peakData } }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: 'peak_updated' };
        if (needsCsPatch) mergeObj.sides[side].lock = { ...sides[side].lock, consensusStrength };
        await setDoc(ref, mergeObj, { merge: true });
        return { docId, action: 'peak_updated' };
      }
      if (needsCsPatch) {
        await setDoc(ref, { sides: { [side]: { lock: { consensusStrength }, peak: { ...sides[side].peak, consensusStrength } } }, lastWriteAt: Date.now() }, { merge: true });
        return { docId, action: 'cs_patched' };
      }
      return { docId, action: 'no_change' };
    }

    const existingSides = Object.entries(sides);
    const existingBestStars = existingSides.reduce((max, [, sd]) => {
      const s = sd.peak?.stars || sd.lock?.stars || 0;
      return s > max ? s : max;
    }, 0);
    if (stars <= existingBestStars) {
      return { docId, action: 'no_change' };
    }
    const sideData = buildSpreadTotalSideData(side, team, line, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars);
    const mergePayload = { sides: { [side]: sideData }, source: 'ui_card_sync', lastWriteAt: Date.now(), lastAction: 'side_added' };
    for (const [existingSide] of existingSides) {
      mergePayload.sides[existingSide] = { ...mergePayload.sides[existingSide], superseded: true, supersededAt: Date.now() };
    }
    await setDoc(ref, mergePayload, { merge: true });
    return { docId, action: 'side_added' };
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
        const u = sideData.peak?.units || sideData.lock?.units || 1;
        totalUnits += u;
        const profit = sideData.result?.profit ?? 0;
        if (sideData.result?.outcome === 'WIN') { wins++; totalProfit += profit; }
        else if (sideData.result?.outcome === 'LOSS') { losses++; totalProfit += profit; }
        else if (sideData.result?.outcome === 'PUSH') { pushes++; }
      }
    } else {
      if (data.status !== 'COMPLETED') return;
      const u = data.units || 1;
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
  let pts = 0;
  const cg = snap.consensusStrength?.grade || '';
  // Approximate breadth from old consensus grade
  if (cg === 'DOMINANT') pts += 3;
  else if (cg === 'STRONG') pts += 2;
  else if (cg === 'LEAN') pts += 0.5;
  else if (cg === 'CONTESTED') pts += 0;
  // Pinnacle alignment
  const pinnConf = !!snap.criteria?.pinnacleConfirms;
  const lineWith = !!snap.criteria?.lineMovingWith;
  if (pinnConf && lineWith) pts += 3; else if (pinnConf) pts += 1.5; else if (lineWith) pts += 1.5;
  // Approximate conviction from totalInvested / sharpCount
  const sc = snap.sharpCount || 0;
  const inv = snap.totalInvested || 0;
  const avgInv = sc > 0 ? inv / sc : inv;
  const conv = avgInv > 0 ? Math.min(1, Math.max(0, (Math.log10(avgInv) - 2) / 2)) : 0;
  if (conv >= 0.8) pts += 1.5; else if (conv >= 0.5) pts += 1; else if (conv >= 0.25) pts += 0.5;
  // EV edge
  const ev = snap.evEdge || 0;
  if (ev > 3) pts += 1; else if (ev > 1) pts += 0.5; else if (ev > 0) pts -= 0.5;
  // Pred market
  if (snap.criteria?.predMarketAligns) pts += 0.5;
  const raw = (pts / 12) * 5;
  return Math.min(5, Math.max(0.5, Math.round(raw * 2) / 2));
}

async function loadAllTimePnL() {
  try {
    const cacheKey = 'sharpFlow_pnl_v11';
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
    const starBucket = (s) => s >= 4.5 ? 5 : s >= 3.5 ? 4 : s >= 2.5 ? 3 : s >= 1.5 ? 2 : 1;
    const emptyBucket = () => ({ wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0, totalPicks: 0, label: '' });
    const STARS_LIVE_DATE = '2026-03-26';
    snap.forEach(d => {
      const data = d.data();
      const mt = data._marketType || data.marketType || 'ml';
      const isPostDeploy = data.date >= STARS_LIVE_DATE;
      const processSide = (sd) => {
        const bestSnap = sd.peak || sd.lock;
        const lockSnap = sd.lock || bestSnap;
        const s = bestSnap?.stars ?? estimateStarsFromSnap(bestSnap);
        const key = starBucket(s);
        if (!byStars[key]) byStars[key] = emptyBucket();
        byStars[key].totalPicks++;
        const u = bestSnap?.units || 1;
        if (sd.status === 'COMPLETED') {
          byStars[key].totalUnits += u;
          if (sd.result?.outcome === 'WIN') { byStars[key].wins++; byStars[key].totalProfit += (sd.result?.profit || 0); }
          else if (sd.result?.outcome === 'LOSS') { byStars[key].losses++; byStars[key].totalProfit -= u; }
          else if (sd.result?.outcome === 'PUSH') { byStars[key].pushes++; }
        }
        const pickStars = isPostDeploy ? (bestSnap?.stars ?? 0) : s;
        if (pickStars >= 2.5) {
          const lkStars = lockSnap?.stars ?? 0;
          const lkEV = lockSnap?.evEdge ?? null;
          const pkEV = bestSnap?.evEdge ?? null;
          const pick = { date: data.date, sport: data.sport || 'NHL', marketType: mt, stars: pickStars, lockStars: lkStars, lockEV: lkEV, peakEV: pkEV, units: u, status: sd.status || 'PENDING', outcome: null, profit: 0, clv: null };
          if (sd.status === 'COMPLETED') {
            pick.outcome = sd.result?.outcome || null;
            if (sd.result?.outcome === 'WIN') { pick.profit = sd.result?.profit || 0; }
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

    const result = { pregame: overall, all: overall, byStars, picks };
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

function useMarketData() {
  const [polyData, setPolyData] = useState(null);
  const [kalshiData, setKalshiData] = useState(null);
  const [whaleProfiles, setWhaleProfiles] = useState(null);
  const [pinnacleHistory, setPinnacleHistory] = useState(null);
  const [sharpPositions, setSharpPositions] = useState(null);
  const [spreadPositions, setSpreadPositions] = useState(null);
  const [totalPositions, setTotalPositions] = useState(null);
  const [sportsSharps, setSportsSharps] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}polymarket_data.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}kalshi_data.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}whale_profiles.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}pinnacle_history.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}sharp_positions.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}sports_sharps.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}sharp_spread_positions.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}sharp_total_positions.json`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([p, k, wp, ph, sp, ss, sprP, totP]) => {
      setPolyData(p);
      setKalshiData(k);
      setWhaleProfiles(wp);
      setPinnacleHistory(ph);
      setSharpPositions(sp);
      setSportsSharps(ss);
      setSpreadPositions(sprP);
      setTotalPositions(totP);
      setLoading(false);
    });
  }, []);

  return { polyData, kalshiData, whaleProfiles, pinnacleHistory, sharpPositions, spreadPositions, totalPositions, sportsSharps, loading };
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

      const awayTicketPct = totalTrades > 0
        ? Number(((((polyFlow.awayTicketPct || 0) / 100 * polyTrades) + ((kalshiFlow.awayTicketPct || 0) / 100 * kTrades)) / totalTrades * 100).toFixed(1))
        : polyFlow.awayTicketPct || kalshiFlow.awayTicketPct || 0;
      const homeTicketPct = totalTrades > 0 ? Number((100 - awayTicketPct).toFixed(1)) : polyFlow.homeTicketPct || kalshiFlow.homeTicketPct || 0;
      const awayMoneyPct = totalCash > 0
        ? Number(((((polyFlow.awayMoneyPct || 0) / 100 * polyCash) + ((kalshiFlow.awayMoneyPct || 0) / 100 * kCash)) / totalCash * 100).toFixed(1))
        : polyFlow.awayMoneyPct || kalshiFlow.awayMoneyPct || 0;
      const homeMoneyPct = totalCash > 0 ? Number((100 - awayMoneyPct).toFixed(1)) : polyFlow.homeMoneyPct || kalshiFlow.homeMoneyPct || 0;

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
        key, sport, away, home, awayProb, homeProb, volume,
        awayTicketPct, homeTicketPct, awayMoneyPct, homeMoneyPct,
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
  const ticketFav = game.awayTicketPct >= game.homeTicketPct ? 'away' : 'home';
  const moneyFav = game.awayMoneyPct >= game.homeMoneyPct ? 'away' : 'home';
  const isReverse = ticketFav !== moneyFav && game.ticketDivergence >= 10;
  const hasDivergence = game.ticketDivergence >= 10;
  const moneyTeam = moneyFav === 'away' ? awayShort : homeShort;
  const moneyPct = moneyFav === 'away' ? game.awayMoneyPct : game.homeMoneyPct;
  const ticketPctOnMoneySide = moneyFav === 'away' ? game.awayTicketPct : game.homeTicketPct;

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
            {moneyTeam} ML
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
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        margin: '0 0.75rem 0.5rem', gap: 0,
      }}>
        {[
          { side: 'away', team: awayShort, ticketPct: game.awayTicketPct, moneyPct: game.awayMoneyPct, cash: awayCash, whales: awayWhales },
          null,
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
  const pad = 2;
  const xStep = (width - pad * 2) / (points.length - 1);
  const yH = height - pad * 2;
  const pts = points.map((v, i) => ({
    x: pad + i * xStep,
    y: pad + yH - ((v - min) / range) * yH,
  }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const lastPt = pts[pts.length - 1];
  const trend = points[points.length - 1] > points[0] ? B.green : points[points.length - 1] < points[0] ? B.red : B.textMuted;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
      {label && (
        <span style={{ ...T.micro, color: B.textMuted, marginBottom: '0.1rem' }}>{label}</span>
      )}
      <svg width={width} height={height} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`sg-${label?.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${d} L${lastPt.x.toFixed(1)},${height} L${pts[0].x.toFixed(1)},${height} Z`}
          fill={`url(#sg-${label?.replace(/\s/g, '')})`}
        />
        <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastPt.x} cy={lastPt.y} r={2.5} fill={trend} />
      </svg>
      {(startLabel || endLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', width }}>
          <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.5rem' }}>{startLabel || ''}</span>
          <span style={{ ...T.micro, color: trend, fontWeight: 700, fontSize: '0.5rem' }}>{endLabel || ''}</span>
        </div>
      )}
    </div>
  );
});

function rateStars({
  evEdge = 0, pinnConfirms = false, pinnMovingWith = false, pinnMovingAgainst = false,
  polyMovingWith = false, oppPeakStars = 0,
  breadth = 0, conviction = 0, concentration = 0, counterSharpScore = 0,
  consensusTier = 'LEAN',
  isRLM = false, ticketDivergence = 0,
  sportSharpCount = 0,
  pinnProb = null, dominantTier = null, conWalletCount = 0,
  odds = null, sport = null,
} = {}) {
  let pts = 0;

  // Sharp breadth — quality-weighted wallet diversity (max 3 pts)
  if (breadth >= 0.5) pts += 3;
  else if (breadth >= 0.35) pts += 2;
  else if (breadth >= 0.2) pts += 1;
  else if (breadth >= 0.1) pts += 0.5;

  // Pinnacle alignment (max 3 pts / -1 penalty)
  if (pinnConfirms && pinnMovingWith) pts += 3;
  else if (pinnConfirms) pts += 1.5;
  else if (pinnMovingWith) pts += 1.5;
  if (pinnMovingAgainst) pts -= 1;

  // Sharp conviction — log-dollar per wallet (max 1.5 pts)
  if (conviction >= 0.8) pts += 1.5;
  else if (conviction >= 0.5) pts += 1;
  else if (conviction >= 0.25) pts += 0.5;

  // Concentration penalty — softened when ELITE-led with multi-wallet confirmation
  if (concentration > 0.9) {
    pts -= (dominantTier === 'ELITE' && conWalletCount >= 4) ? 0.5 : 1;
  } else if (concentration > 0.8) {
    pts -= (dominantTier === 'ELITE' && conWalletCount >= 4) ? 0.25 : 0.5;
  }

  // Counter-sharp penalty — contested games are 30.8% WR
  if (counterSharpScore >= 6) pts -= 3;
  else if (counterSharpScore >= 3) pts -= 2;
  else if (counterSharpScore >= 1) pts -= 1;

  // EV edge — strongest predictive signal, steep curve (max 3.5 pts)
  if (evEdge > 3) pts += 3.5;
  else if (evEdge > 2) pts += 2.5;
  else if (evEdge > 1) pts += 1.5;
  else if (evEdge > 0) pts += 0.5;

  // Implied probability — small nudge based on Pinnacle line
  if (pinnProb != null) {
    if (pinnProb >= 0.75) pts += 0.5;
    else if (pinnProb < 0.30) pts -= 0.5;
  }

  // Consensus strength bonus — overwhelming sharp agreement
  if (consensusTier === 'DOMINANT') pts += 2;
  else if (consensusTier === 'STRONG') pts += 1;

  // Prediction market — conditional on breadth tier
  if (polyMovingWith) {
    if (consensusTier === 'LEAN' || consensusTier === 'CONTESTED') pts += 1.5;
    else if (consensusTier === 'STRONG') pts += 0.5;
    else pts += 0.25;
  }

  // RLM interaction — public opposes + line confirms sharps
  if (isRLM && pinnMovingWith && ticketDivergence >= 10) pts += 1.5;
  else if (isRLM && ticketDivergence >= 10) pts += 0.75;

  // Sport specialist bonus — wallets profitable in this specific sport (max 1.5 pts)
  if (sportSharpCount >= 3) pts += 1.5;
  else if (sportSharpCount >= 2) pts += 1;
  else if (sportSharpCount >= 1) pts += 0.5;

  // Flip penalty — opposing side already locked at peak
  if (oppPeakStars >= 4.5) pts -= 2;
  else if (oppPeakStars >= 3.5) pts -= 1.5;
  else if (oppPeakStars >= 3) pts -= 1;

  // Dog penalty — long dogs +176+ are 2-20 (9.1% WR), +251+ are 0-12
  if (odds != null && odds >= 200) pts -= 2;
  else if (odds != null && odds >= 151) pts -= 1;

  // NBA dog penalty — NBA dogs are 3-20 (13% WR), -24.4u
  if (sport === 'NBA' && odds != null && odds >= 100) pts -= 1.5;

  const maxPts = 15;
  const raw = (pts / maxPts) * 5;
  const stars = Math.min(5, Math.max(0.5, Math.round(raw * 2) / 2));

  const labels = {
    5:   { label: 'ELITE PLAY',    color: B.green,   bg: B.greenDim,                          summary: 'Maximum conviction — all signals aligned' },
    4.5: { label: 'ELITE PLAY',    color: B.green,   bg: B.greenDim,                          summary: 'Near-perfect signal alignment' },
    4:   { label: 'STRONG PLAY',   color: B.green,   bg: 'rgba(16,185,129,0.08)',             summary: 'Strong conviction — dominant consensus + confirming signals' },
    3.5: { label: 'STRONG PLAY',   color: B.green,   bg: 'rgba(16,185,129,0.08)',             summary: 'Above-average conviction across multiple signals' },
    3:   { label: 'SOLID PLAY',    color: B.green,   bg: 'rgba(16,185,129,0.08)',             summary: 'Strong consensus with confirming signals' },
    2.5: { label: 'SOLID PLAY',    color: B.gold,    bg: B.goldDim,                           summary: 'Good consensus support — meets conviction threshold' },
    2:   { label: 'LEAN',          color: B.gold,    bg: B.goldDim,                           summary: 'Moderate sharp interest — limited confirmation' },
    1.5: { label: 'DEVELOPING',    color: B.textSec, bg: 'rgba(255,255,255,0.04)',             summary: 'Early sharp activity — watching for more signals' },
    1:   { label: 'MONITORING',    color: B.textSec, bg: 'rgba(255,255,255,0.04)',             summary: 'Low activity — not yet actionable' },
    0.5: { label: 'MONITORING',    color: B.textSec, bg: 'rgba(255,255,255,0.04)',             summary: 'Minimal data available' },
  };
  const info = labels[stars] || labels[1];
  const isActionable = stars >= 3;

  return { stars, pts, maxPts, ...info, isActionable };
}

const LockedPickCard = memo(function LockedPickCard({ pick, isMobile }) {
  const { team, away, home, sport, stars, lockStars, units, odds, book, peakAt, lockedAt, gameTime, status, outcome, profit, lockPinnOdds, closingOdds, clv, sharpCount, totalInvested, evEdge, lockEV, criteriaMet, criteria, consensusStrength, pinnacleOdds, marketType, line, superseded } = pick;
  const [expanded, setExpanded] = useState(false);
  const ss = sportStyle(sport);
  const starDelta = (lockStars != null && stars != null) ? stars - lockStars : 0;
  const isTopPick = starDelta >= 1.0;
  const evDelta = (evEdge != null && lockEV != null) ? +(evEdge - lockEV).toFixed(2) : 0;
  const isEVConfirmed = isTopPick && evDelta > 0;
  const starLabels = { 5: 'ELITE PLAY', 4.5: 'ELITE PLAY', 4: 'STRONG PLAY', 3.5: 'STRONG PLAY', 3: 'SOLID PLAY', 2.5: 'SOLID PLAY' };
  const starLabel = starLabels[stars] || 'SOLID PLAY';
  const starColor = stars >= 4 ? B.green : B.gold;
  const isGraded = status === 'COMPLETED' && outcome;
  const isWin = outcome === 'WIN';
  const isLoss = outcome === 'LOSS';
  const accentColor = isGraded ? (isWin ? B.green : isLoss ? B.red : B.gold) : B.green;
  const teamShort = team?.split(' ').pop() || team;
  const awayShort = away?.split(' ').pop() || away;
  const homeShort = home?.split(' ').pop() || home;
  const otherTeam = teamShort === awayShort ? homeShort : awayShort;
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
    { key: 'invested7kPlus', label: '$7K+ on Side', met: criteria.invested7kPlus },
    { key: 'lineMovingWith', label: 'Line Moving With Play', met: criteria.lineMovingWith },
    { key: 'predMarketAligns', label: 'Pred. Market Aligns', met: criteria.predMarketAligns },
  ] : [];
  const metCount = criteriaMet || criteriaList.filter(c => c.met).length;
  const avgBet = (sharpCount && totalInvested) ? Math.round(totalInvested / sharpCount) : null;

  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden', position: 'relative',
      opacity: superseded ? 0.55 : 1,
      background: superseded
        ? `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`
        : isTopPick
        ? `linear-gradient(135deg, rgba(212,175,55,0.06) 0%, ${B.card} 30%, ${B.cardAlt} 100%)`
        : `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: superseded
        ? `1px solid rgba(239,68,68,0.3)`
        : isEVConfirmed
        ? '1px solid rgba(212,175,55,0.6)'
        : isTopPick
        ? '1px solid rgba(212,175,55,0.45)'
        : `1px solid ${isGraded ? (isWin ? 'rgba(16,185,129,0.2)' : isLoss ? 'rgba(239,68,68,0.2)' : B.border) : 'rgba(16,185,129,0.18)'}`,
      boxShadow: superseded ? 'none'
        : isEVConfirmed
        ? '0 0 24px rgba(212,175,55,0.18), 0 0 48px rgba(212,175,55,0.06)'
        : isTopPick
        ? '0 0 20px rgba(212,175,55,0.12), 0 0 40px rgba(212,175,55,0.04)'
        : isWin ? '0 0 16px rgba(16,185,129,0.04)' : isLoss ? '0 0 16px rgba(239,68,68,0.04)' : 'none',
    }}>
      {/* Top accent */}
      <div style={{ height: isTopPick ? '3px' : '3px', background: isTopPick
        ? 'linear-gradient(90deg, transparent, #D4AF37, #F5D060, #D4AF37, transparent)'
        : `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

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
            <span style={{ ...T.body, fontWeight: 700, color: B.text }}>
              {away} <span style={{ color: B.textMuted, fontWeight: 400 }}>vs</span> {home}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {isTopPick && !superseded && (
              <span style={{
                ...T.micro, fontWeight: 900, letterSpacing: '0.06em',
                padding: '0.15rem 0.5rem', borderRadius: '5px',
                color: isEVConfirmed ? '#fff' : '#D4AF37',
                background: isEVConfirmed
                  ? 'linear-gradient(135deg, #D4AF37 0%, #B8962E 50%, #D4AF37 100%)'
                  : 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(245,208,96,0.08) 100%)',
                border: isEVConfirmed
                  ? '1px solid rgba(245,208,96,0.6)'
                  : '1px solid rgba(212,175,55,0.35)',
                boxShadow: isEVConfirmed ? '0 0 8px rgba(212,175,55,0.3)' : 'none',
                display: 'flex', alignItems: 'center', gap: '0.2rem',
              }}>
                {isEVConfirmed ? <Zap size={9} strokeWidth={3} fill="#fff" /> : <TrendingUp size={9} strokeWidth={3} />}
                <span>TOP PICK</span>
              </span>
            )}
            <span style={{
              ...T.micro, fontWeight: 800, letterSpacing: '0.04em',
              padding: '0.15rem 0.5rem', borderRadius: '5px',
              color: starColor, background: stars >= 4 ? B.greenDim : B.goldDim,
              border: `1px solid ${stars >= 4 ? 'rgba(16,185,129,0.2)' : B.goldBorder}`,
              display: 'flex', alignItems: 'center', gap: '0.2rem',
            }}>
              {Array.from({ length: 5 }, (_, i) => {
                const filled = i + 1 <= Math.floor(stars);
                const half = !filled && i + 0.5 === stars;
                return filled ? <span key={i} style={{ fontSize: '0.5rem', color: starColor, lineHeight: 1 }}>★</span>
                  : half ? <span key={i} style={{ position: 'relative', display: 'inline-block', fontSize: '0.5rem', lineHeight: 1, width: '0.5rem' }}><span style={{ color: 'rgba(255,255,255,0.15)' }}>★</span><span style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', width: '50%', color: starColor }}>★</span></span>
                  : <span key={i} style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>★</span>;
              })}
              <span style={{ marginLeft: '0.15rem' }}>{starLabel}</span>
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
            <span style={{ ...T.label, fontWeight: 700, color: B.text }}>{team}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
              {units}u @ {fmtO(odds)} · {book}
            </span>
            {isGraded ? (
              <span style={{
                ...T.micro, fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px',
                color: isWin ? '#fff' : isLoss ? '#fff' : B.textSec,
                background: isWin ? 'linear-gradient(135deg, #10B981, #059669)' : isLoss ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'rgba(255,255,255,0.06)',
              }}>{outcome}</span>
            ) : (
              <span style={{ ...T.micro, fontWeight: 700, color: B.gold, padding: '0.15rem 0.45rem', borderRadius: '4px', background: B.goldDim }}>PENDING</span>
            )}
            {isGraded && (
              <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: isWin ? B.green : isLoss ? B.red : B.textSec }}>
                {isWin ? '+' : isLoss ? '' : ''}{(profit || 0).toFixed(2)}u
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
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
      </div>

      {/* ─── Expanded: full premium detail ─── */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${B.border}` }}>

          {/* Hero action box */}
          <div style={{
            margin: '0.75rem 0.875rem 0', padding: '0.75rem',
            borderRadius: '10px',
            background: isGraded
              ? (isWin ? 'linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.02) 100%)' : isLoss ? 'linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(239,68,68,0.02) 100%)' : 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)')
              : 'linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.02) 100%)',
            border: `1px solid ${isGraded ? (isWin ? 'rgba(16,185,129,0.25)' : isLoss ? 'rgba(239,68,68,0.25)' : B.goldBorder) : 'rgba(16,185,129,0.25)'}`,
          }}>
            {/* Narrative + unit badge */}
            <div style={{ marginBottom: '0.625rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ ...T.label, fontWeight: 800, color: accentColor }}>
                  {isGraded ? (isWin ? 'WINNING BET' : isLoss ? 'LOSING BET' : 'PUSH') : 'LOCKED BET'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{
                    ...T.body, fontWeight: 900, color: '#fff',
                    padding: '0.2rem 0.6rem', borderRadius: '5px',
                    background: isGraded
                      ? (isWin ? 'linear-gradient(135deg, #10B981, #059669)' : isLoss ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #64748B, #475569)')
                      : 'linear-gradient(135deg, #10B981, #059669)',
                    border: `1px solid ${isWin ? 'rgba(16,185,129,0.4)' : isLoss ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
                    fontFeatureSettings: "'tnum'",
                  }}>
                    {ut.icon} {units}u
                  </span>
                  {evEdge > 0 && (
                    <span style={{ ...T.body, fontWeight: 900, color: B.green, padding: '0.2rem 0.6rem', borderRadius: '5px', background: B.greenDim }}>
                      +{evEdge}% EV
                    </span>
                  )}
                </div>
              </div>
              <div style={{ ...T.micro, color: B.textSec, lineHeight: 1.5, marginTop: '0.15rem' }}>
                {sharpCount || '—'} sharp bettor{sharpCount !== 1 ? 's' : ''} invested <span style={{ color: B.gold, fontWeight: 700 }}>{totalInvested ? fmtV(totalInvested) : '—'}</span> on {teamShort}{avgBet ? ` (avg ${fmtV(avgBet)}/bet)` : ''}.{criteria?.pinnacleConfirms ? ` Pinnacle confirmed the play at lock.` : ''}{evEdge > 0 ? ` +${evEdge}% EV edge at ${book}.` : ''}
              </div>
            </div>

            {/* Bet line: team + fair value | locked odds + book */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.625rem', alignItems: 'center' }}>
              <div>
                <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.2rem' }}>
                  {sharpCount || '—'} sharp{sharpCount !== 1 ? 's' : ''} backing
                </div>
                <div style={{ ...T.heading, fontWeight: 900, color: B.text }}>
                  {marketType === 'spread' ? `${teamShort} ${line > 0 ? '+' : ''}${line}` : marketType === 'total' ? teamShort : `${teamShort} ML`}
                </div>
                {pinnProb && (
                  <div style={{ ...T.micro, color: B.textSec, marginTop: '0.15rem' }}>
                    Fair value: {fmtO(pinnacleOdds)} ({(pinnProb * 100).toFixed(1)}%)
                  </div>
                )}
              </div>
              <div style={{ width: '1px', height: '40px', background: B.borderSubtle }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.2rem' }}>LOCKED AT</div>
                <div style={{ ...T.heading, fontWeight: 900, color: evEdge > 0 ? B.green : B.text }}>{fmtO(odds)}</div>
                <div style={{ ...T.micro, color: B.textSec, marginTop: '0.15rem' }}>{book}</div>
              </div>
            </div>

            {/* Risk / Result row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: '0.625rem', padding: '0.375rem 0.5rem', borderRadius: '6px',
              background: isGraded ? (isWin ? 'rgba(16,185,129,0.06)' : isLoss ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)') : 'rgba(16,185,129,0.06)',
              border: `1px solid ${isGraded ? (isWin ? 'rgba(16,185,129,0.15)' : isLoss ? 'rgba(239,68,68,0.15)' : B.borderSubtle) : 'rgba(16,185,129,0.15)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ ...T.micro, color: B.textSec }}>Risk</span>
                <span style={{ ...T.micro, fontWeight: 800, color: B.text, fontFeatureSettings: "'tnum'" }}>{units}u</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ ...T.micro, color: B.textSec }}>{isGraded ? 'Result' : 'To Win'}</span>
                <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: isGraded ? (isWin ? B.green : isLoss ? B.red : B.textSec) : B.green }}>
                  {isGraded ? `${isWin ? '+' : isLoss ? '' : ''}${(profit || 0).toFixed(2)}u` : `+${potentialWin.toFixed(2)}u`}
                </span>
              </div>
              <span style={{
                ...T.micro, fontWeight: 800, color: ut.color,
                padding: '0.1rem 0.35rem', borderRadius: '4px',
                background: ut.color === B.green ? B.greenDim : ut.color === B.gold ? B.goldDim : 'rgba(255,255,255,0.04)',
              }}>
                {ut.icon} {ut.label}
              </span>
            </div>

            {/* Confidence tags */}
            <div style={{
              display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
              marginTop: '0.625rem', paddingTop: '0.5rem',
              borderTop: `1px solid ${isGraded ? (isWin ? 'rgba(16,185,129,0.15)' : isLoss ? 'rgba(239,68,68,0.12)' : 'rgba(212,175,55,0.12)') : 'rgba(16,185,129,0.15)'}`,
            }}>
              {sharpCount && <span style={{ ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px', background: B.goldDim, color: B.gold, fontWeight: 600 }}>{sharpCount} sharp bettor{sharpCount !== 1 ? 's' : ''}</span>}
              {totalInvested && <span style={{ ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: B.textSec }}>{fmtV(totalInvested)} invested</span>}
              {criteria?.pinnacleConfirms && <span style={{ ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px', background: B.greenDim, color: B.green, fontWeight: 600 }}>✓ Pinnacle confirms</span>}
              {consensusStrength?.grade && <span style={{ ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600, background: (consensusStrength.grade === 'DOMINANT' || consensusStrength.grade === 'STRONG') ? B.greenDim : B.goldDim, color: (consensusStrength.grade === 'DOMINANT' || consensusStrength.grade === 'STRONG') ? B.green : B.gold }}>{consensusStrength.grade} ({consensusStrength.moneyPct}%)</span>}
              {evEdge > 0 && <span style={{ ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px', background: B.greenDim, color: B.green, fontWeight: 700 }}>+{evEdge}% edge</span>}
              {clvPct != null && <span style={{ ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700, fontFeatureSettings: "'tnum'", color: clvPositive ? B.green : liveCLV < 0 ? B.red : B.textMuted, background: clvPositive ? B.greenDim : liveCLV < 0 ? B.redDim : 'rgba(255,255,255,0.04)' }}>CLV {clvPositive ? '+' : ''}{clvPct}%</span>}
            </div>
          </div>

          {/* Lock-In Criteria */}
          {criteriaList.length > 0 && (
            <div style={{
              margin: '0.5rem 0.875rem 0', padding: '0.5rem 0.625rem', borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)',
              border: '1px solid rgba(16,185,129,0.25)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <span style={{ ...T.micro, color: B.green, fontWeight: 700 }}>
                  PLAY LOCKED — {stars >= 4.5 ? '★★★★★ ELITE' : stars >= 3.5 ? '★★★★ STRONG' : '★★★ SOLID'}
                </span>
                <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: metCount >= 4 ? B.green : B.gold }}>{metCount}/6</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '0.25rem' }}>
                {criteriaList.map(c => (
                  <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle size={11} color={c.met ? B.green : 'rgba(255,255,255,0.12)'} />
                    <span style={{ ...T.micro, color: c.met ? B.green : B.textMuted, fontWeight: c.met ? 600 : 400 }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sharp Money Battle */}
          {consensusStrength?.moneyPct != null && (
            <div style={{ padding: '0.75rem 0.875rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                <span style={{ ...T.micro, color: B.textMuted }}>Sharp Money — At Lock</span>
                <span style={{ ...T.micro, fontWeight: 800, color: accentColor, padding: '0.1rem 0.3rem', borderRadius: '3px', background: `${accentColor}15` }}>
                  {consensusStrength.moneyPct}% {teamShort}
                </span>
              </div>
              {(() => {
                const pct = consensusStrength.moneyPct / 100;
                const totalBoth = pct > 0 ? totalInvested / pct : totalInvested;
                const otherAmt = Math.round(totalBoth - totalInvested);
                return (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1, padding: '0.5rem 0.625rem', borderRadius: '8px', background: 'rgba(255,255,255,0.015)', border: `1px solid ${B.borderSubtle}` }}>
                      <div style={{ ...T.micro, fontWeight: 700, color: B.textMuted, marginBottom: '0.25rem' }}>{otherTeam}</div>
                      <div style={{ ...T.heading, fontWeight: 900, color: B.textSec, fontFeatureSettings: "'tnum'" }}>{fmtV(otherAmt)}</div>
                      <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.1rem' }}>{100 - consensusStrength.moneyPct}%</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>VS</span>
                    </div>
                    <div style={{
                      flex: 1, padding: '0.5rem 0.625rem', borderRadius: '8px',
                      background: `linear-gradient(135deg, ${accentColor}12 0%, ${accentColor}04 100%)`,
                      border: `1px solid ${accentColor}40`, position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{ position: 'absolute', top: 0, right: 0, width: '3px', height: '100%', background: accentColor, borderRadius: '0 8px 8px 0' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                        <span style={{ ...T.micro, fontWeight: 700, color: B.text }}>{teamShort}</span>
                        <span style={{ ...T.micro, fontSize: '0.5rem', fontWeight: 900, padding: '0.05rem 0.25rem', borderRadius: '3px', color: '#fff', background: accentColor }}>SHARP SIDE</span>
                      </div>
                      <div style={{ ...T.heading, fontWeight: 900, color: accentColor, fontFeatureSettings: "'tnum'" }}>{fmtV(totalInvested)}</div>
                      <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.1rem' }}>{consensusStrength.moneyPct}%</div>
                    </div>
                  </div>
                );
              })()}

              {/* Market flow bar */}
              <div style={{
                marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden',
                border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}`, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>Market Flow</span>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>{otherTeam}</span>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>{teamShort}</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem 0.625rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 36px', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ ...T.micro, fontSize: '0.625rem', fontWeight: 800, fontFeatureSettings: "'tnum'", color: B.textMuted, textAlign: 'left' }}>
                      {100 - consensusStrength.moneyPct}%
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                      <div style={{ display: 'flex', height: '5px', borderRadius: '2.5px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ width: `${100 - consensusStrength.moneyPct}%`, background: 'rgba(255,255,255,0.05)', borderRadius: '2.5px 0 0 2.5px' }} />
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                        <div style={{ width: `${consensusStrength.moneyPct}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}44)`, borderRadius: '0 2.5px 2.5px 0' }} />
                      </div>
                      <span style={{ ...T.micro, fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', letterSpacing: '0.03em' }}>Sharp Money</span>
                    </div>
                    <span style={{ ...T.micro, fontSize: '0.625rem', fontWeight: 800, fontFeatureSettings: "'tnum'", color: accentColor, textAlign: 'right' }}>
                      {consensusStrength.moneyPct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Book Prices */}
          <div style={{
            margin: '0.625rem 0.875rem 0', borderRadius: '8px', overflow: 'hidden',
            border: `1px solid ${B.borderSubtle}`, background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{
              padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ ...T.micro, color: B.textMuted }}>Book Prices — {marketType === 'spread' ? `${teamShort} ${line > 0 ? '+' : ''}${line}` : marketType === 'total' ? teamShort : `${teamShort} ML`}</span>
              {clvPct != null && (
                <span style={{ ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'", color: clvPositive ? B.green : liveCLV < 0 ? B.red : B.textMuted }}>
                  CLV {clvPositive ? '+' : ''}{clvPct}%
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
              {[
                { label: book || 'Locked', value: odds ? fmtO(odds) : '—', color: B.text },
                { label: 'Pinnacle', value: pinnacleOdds ? fmtO(pinnacleOdds) : '—', color: B.textSec },
                { label: 'Current', value: closingOdds ? fmtO(closingOdds) : '—', color: clvPositive ? B.green : liveCLV != null && liveCLV < 0 ? B.red : B.textSec },
              ].map((col, i) => (
                <div key={col.label} style={{
                  textAlign: 'center', padding: '0.625rem 0.375rem',
                  borderRight: i < 2 ? `1px solid ${B.borderSubtle}` : 'none',
                }}>
                  <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.25rem', fontWeight: 600 }}>{col.label}</div>
                  <div style={{ ...T.sub, fontWeight: 900, color: col.color, fontFeatureSettings: "'tnum'" }}>{col.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.625rem 0.875rem 0.75rem', flexWrap: 'wrap',
          }}>
            {lockedAt && <span style={{ ...T.micro, color: B.green, fontWeight: 600 }}>Locked {fmtET(lockedAt)}</span>}
            {peakAt && peakAt !== lockedAt && (
              <>
                <span style={{ color: B.borderSubtle, fontSize: '0.5rem' }}>▸</span>
                <span style={{ ...T.micro, color: B.gold, fontWeight: 600 }}>Peak {fmtET(peakAt)}</span>
              </>
            )}
            {gameTime && (
              <>
                <span style={{ color: B.borderSubtle, fontSize: '0.5rem' }}>▸</span>
                <span style={{ ...T.micro, color: B.textMuted }}>Game {fmtET(gameTime)}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

const SharpPositionCard = memo(function SharpPositionCard({ gd, pinnacleHistory, polyData, isMobile, onPickSynced, isMyPick, onToggleMyPick, canPickGames, gameFlowMap, spreadPositions, totalPositions }) {
  const [showWallets, setShowWallets] = useState(false);
  const [walletSideFilter, setWalletSideFilter] = useState('all');
  const [showSpreadWallets, setShowSpreadWallets] = useState(false);
  const [spreadWalletFilter, setSpreadWalletFilter] = useState('all');
  const [showTotalWallets, setShowTotalWallets] = useState(false);
  const [totalWalletFilter, setTotalWalletFilter] = useState('all');
  const [marketTab, setMarketTab] = useState('ml');
  const lastSyncedStars = useRef(null);
  const lastSyncedSpreadStars = useRef(null);
  const lastSyncedTotalStars = useRef(null);
  const pregameSynced = useRef(false);
  const ss = sportStyle(gd.sport);
  const s = gd.summary;
  const consensusSide = s.consensus;
  const consensusTeam = consensusSide === 'away' ? gd.away : gd.home;
  const consensusShort = consensusTeam.split(' ').pop();
  const oppTeam = consensusSide === 'away' ? gd.home : gd.away;
  const oppShort = oppTeam.split(' ').pop();
  const awayShort = gd.away.split(' ').pop();
  const homeShort = gd.home.split(' ').pop();
  const pinnGame = pinnacleHistory?.[gd.sport]?.[gd.key];
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

  const consensusOdds = consensusSide === 'away' ? pinnGame?.current?.away : pinnGame?.current?.home;
  const oppOdds = consensusSide === 'away' ? pinnGame?.current?.home : pinnGame?.current?.away;
  const bestRetail = consensusSide === 'away' ? pinnGame?.bestAway : pinnGame?.bestHome;
  const bestBook = consensusSide === 'away' ? pinnGame?.bestAwayBook : pinnGame?.bestHomeBook;
  const pinnProb = impliedProb(consensusOdds);
  const retailProb = impliedProb(bestRetail);
  const evEdge = (pinnProb && retailProb) ? +((pinnProb - retailProb) * 100).toFixed(1) : null;
  const hasEV = evEdge != null && evEdge > 0;

  const pinnMoved = pinnGame?.movement?.direction;
  const pinnConfirms = pinnMoved === consensusSide;

  const uniqueWallets = new Set(gd.positions.map(p => p.wallet)).size;

  // Per-side aggregation
  const awayPositions = gd.positions.filter(p => p.side === 'away');
  const homePositions = gd.positions.filter(p => p.side === 'home');
  const awayWallets = new Set(awayPositions.map(p => p.wallet)).size;
  const homeWallets = new Set(homePositions.map(p => p.wallet)).size;
  const awayInvested = s.awayInvested || 0;
  const homeInvested = s.homeInvested || 0;
  const awayLifetimePnl = awayPositions.reduce((sum, p) => sum + (p.totalPnl || 0), 0);
  const homeLifetimePnl = homePositions.reduce((sum, p) => sum + (p.totalPnl || 0), 0);
  const totalLifetimePnl = awayLifetimePnl + homeLifetimePnl;
  const totalInvested = awayInvested + homeInvested;
  const awayPct = totalInvested > 0 ? (awayInvested / totalInvested) * 100 : 50;

  const consensusPositions = consensusSide === 'away' ? awayPositions : homePositions;
  const consensusWalletCount = consensusSide === 'away' ? awayWallets : homeWallets;
  const consensusInvestedAmt = consensusSide === 'away' ? awayInvested : homeInvested;
  const consensusLifetimePnl = consensusSide === 'away' ? awayLifetimePnl : homeLifetimePnl;
  const consensusAvgBet = consensusWalletCount > 0 ? consensusInvestedAmt / consensusPositions.length : 0;
  const oppPositions = consensusSide === 'away' ? homePositions : awayPositions;
  const oppAvgBet = oppPositions.length > 0 ? (consensusSide === 'away' ? homeInvested : awayInvested) / oppPositions.length : 0;
  const awayAvgBet = awayPositions.length > 0 ? awayInvested / awayPositions.length : 0;
  const homeAvgBet = homePositions.length > 0 ? homeInvested / homePositions.length : 0;

  // Price movement data
  const pinnHistory = pinnGame?.history || [];
  const polyPriceHistory = polyGameData?.priceHistory;
  const polyPoints = polyPriceHistory?.points || [];
  const pinnAwayPoints = pinnHistory.map(h => h.away);
  const pinnHomePoints = pinnHistory.map(h => h.home);
  const pinnConsensusPoints = consensusSide === 'away' ? pinnAwayPoints : pinnHomePoints;

  // Directional context: use opener-to-current (not sparkline) to avoid intraday noise
  const pinnOpenOdds = consensusSide === 'away' ? pinnGame?.opener?.away : pinnGame?.opener?.home;
  const pinnCurrentOdds = consensusSide === 'away' ? pinnGame?.current?.away : pinnGame?.current?.home;
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

  // Consensus strength
  const consensusWallets = consensusSide === 'away' ? awayWallets : homeWallets;
  const oppWallets = consensusSide === 'away' ? homeWallets : awayWallets;
  const consensusInvested = consensusSide === 'away' ? awayInvested : homeInvested;
  const oppInvestedAmt = consensusSide === 'away' ? homeInvested : awayInvested;
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
  const oppSr = rateStars({
    evEdge: oppEvEdge || 0, pinnConfirms: oppPinnConfirms,
    pinnMovingWith: oppPinnMovingWith, pinnMovingAgainst: oppPinnMovingAgainst,
    polyMovingWith: oppPolyMovingWith,
    breadth: oppSharpFeatures.breadth, conviction: oppSharpFeatures.conviction,
    concentration: oppSharpFeatures.concentration, counterSharpScore: oppSharpFeatures.counterSharpScore,
    consensusTier: oppSharpFeatures.consensusTier,
    sportSharpCount: oppSharpFeatures.sportSharpCount,
    pinnProb: oppPinnProb, dominantTier: oppSharpFeatures.dominantTier, conWalletCount: oppSharpFeatures.conWalletCount,
    odds: oppBestRetail || oppOdds, sport: gd.sport,
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
    { id: 'invested', label: '$7K+ on Side', met: consensusInvested >= 7000 },
    { id: 'pinnMove', label: 'Line Moving With Play', met: pinnMovingWith },
    { id: 'predMarket', label: 'Pred. Market Aligns', met: polyMovingWith },
  ];
  const criteriaMet = criteria.filter(c => c.met).length;
  const betOdds = bestRetail || consensusOdds;
  const sr = rateStars({
    evEdge: evEdge || 0, pinnConfirms, pinnMovingWith, pinnMovingAgainst,
    polyMovingWith, oppPeakStars,
    breadth: sharpFeatures.breadth, conviction: sharpFeatures.conviction,
    concentration: sharpFeatures.concentration, counterSharpScore: sharpFeatures.counterSharpScore,
    consensusTier: sharpFeatures.consensusTier,
    isRLM: rlmActive, ticketDivergence: flowTicketDiv,
    sportSharpCount: sharpFeatures.sportSharpCount,
    pinnProb, dominantTier: sharpFeatures.dominantTier, conWalletCount: sharpFeatures.conWalletCount,
    odds: betOdds, sport: gd.sport,
  });
  const isExtremeOdds = pinnProb != null && pinnProb >= 0.85;
  if (isExtremeOdds) return null;
  const isLocked = sr.stars >= 2.5 && consensusInvested >= 7000;
  const lockType = isLocked ? (isGameLive ? 'LIVE' : 'PREGAME') : null;

  const units = isLocked ? calculateUnits(sr.stars, cGrade.penalty, betOdds) : 0;
  const ut = unitTier(units);
  const potentialWin = isLocked ? profitFromOdds(betOdds, units) : 0;

  useEffect(() => {
    if (!isLocked || isGameLive || !commenceTime || !onPickSynced) return;
    if (Date.now() >= commenceTime - 5 * 60 * 1000) return;
    if (lastSyncedStars.current !== null && sr.stars <= lastSyncedStars.current) return;
    const date = gameDate(commenceTime);
    syncPickToFirebase({
      date, sport: gd.sport, gameKey: gd.key, away: gd.away, home: gd.home,
      commenceTime, side: consensusSide, team: consensusTeam,
      odds: betOdds, book: bestBook || 'Pinnacle',
      pinnacleOdds: consensusOdds, evEdge,
      criteriaMet,
      criteria: {
        sharps3Plus: consensusWallets >= 3, plusEV: hasEV,
        pinnacleConfirms: pinnConfirms, invested7kPlus: consensusInvested >= 7000,
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
    }).then(({ docId, action }) => {
      if (action === 'error') return;
      lastSyncedStars.current = sr.stars;
      if (action !== 'no_change') {
        onPickSynced(docId, consensusSide, { odds: betOdds, book: bestBook || 'Pinnacle', pinnacleOdds: pinnOdds, criteriaMet, criteria: { sharps3Plus: consensusWallets >= 3, plusEV: hasEV, pinnacleConfirms: pinnConfirms, invested7kPlus: consensusInvested >= 7000, lineMovingWith: pinnMovingWith, predMarketAligns: polyMovingWith }, sharpCount: consensusWallets, totalInvested: consensusInvested, evEdge: bestEV, units, unitTier: ut.label, consensusStrength: { moneyPct: Math.round(moneyPct), walletPct: Math.round(walletPct), grade: cGrade.label }, stars: sr.stars, team: consensusTeam }, { sport: gd.sport, away: gd.away, home: gd.home, commenceTime }, action);
      }
    });
  }, [isLocked, sr.stars]);

  // Pregame snapshot — capture full state ~30 min before game for lock→pregame analysis
  useEffect(() => {
    if (!isLocked || isGameLive || !commenceTime || pregameSynced.current) return;
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
          pinnacleConfirms: pinnConfirms, invested7kPlus: consensusInvested >= 7000,
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
      },
    });
  });

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
  const spreadPinnMovedWith = spreadOpenLine && spreadPinnLine && spreadConsensusSide === 'away'
    ? (spreadPinnLine.awayLine < spreadOpenLine.awayLine)
    : spreadOpenLine && spreadPinnLine ? (spreadPinnLine.homeLine < spreadOpenLine.homeLine) : false;
  const spreadPinnMovedAgainst = spreadOpenLine && spreadPinnLine && spreadConsensusSide === 'away'
    ? (spreadPinnLine.awayLine > spreadOpenLine.awayLine)
    : spreadOpenLine && spreadPinnLine ? (spreadPinnLine.homeLine > spreadOpenLine.homeLine) : false;

  const spreadSharpFeatures = spreadGameData ? computeSharpFeatures(spreadGameData.positions || [], spreadConsensusSide) : null;
  const spreadPinnConfirms = !!spreadPinnLine && spreadConsensusSide === 'away'
    ? (spreadPinnLine.awayLine < 0)
    : !!spreadPinnLine && (spreadPinnLine.homeLine < 0);
  const spreadBetOdds = spreadBestRetail || spreadPinnOdds;
  const spreadSr = spreadSharpFeatures ? rateSpreadTotalStars({
    evEdge: spreadEvEdge || 0,
    pinnConfirms: spreadPinnConfirms,
    pinnMovingWith: spreadPinnMovedWith,
    pinnMovingAgainst: spreadPinnMovedAgainst,
    breadth: spreadSharpFeatures.breadth,
    conviction: spreadSharpFeatures.conviction,
    concentration: spreadSharpFeatures.concentration,
    counterSharpScore: spreadSharpFeatures.counterSharpScore,
    consensusTier: spreadSharpFeatures.consensusTier,
    sportSharpCount: spreadSharpFeatures.sportSharpCount,
    pinnProb: spreadPinnProb, dominantTier: spreadSharpFeatures.dominantTier, conWalletCount: spreadSharpFeatures.conWalletCount,
    odds: spreadBetOdds, sport: gd.sport,
  }) : null;

  const isSpreadLocked = spreadSr && spreadSr.stars >= 2.5
    && (spreadSharpFeatures?.conWalletCount || 0) >= 2
    && (spreadSharpFeatures?.conTotalInvested || 0) >= 5000;
  const spreadUnits = isSpreadLocked ? calculateSpreadTotalUnits(spreadSr.stars, 0, spreadBetOdds) : 0;

  useEffect(() => {
    if (!isSpreadLocked || isGameLive || !commenceTime || !onPickSynced || !spreadConsensusSide) return;
    if (Date.now() >= commenceTime - 5 * 60 * 1000) return;
    if (lastSyncedSpreadStars.current !== null && spreadSr.stars <= lastSyncedSpreadStars.current) return;
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
    }).then(({ docId, action }) => {
      if (action === 'error') return;
      lastSyncedSpreadStars.current = spreadSr.stars;
      if (action !== 'no_change') {
        onPickSynced(docId, spreadConsensusSide, { odds: spreadBetOdds, book: spreadBestBook || 'Pinnacle', pinnacleOdds: spreadPinnOdds, line: spreadLine, criteriaMet: spreadSharpFeatures ? (spreadSharpFeatures.conWalletCount >= 3 ? 1 : 0) + (spreadEvEdge > 0 ? 1 : 0) + (spreadPinnMovedWith ? 1 : 0) : 0, criteria: { sharps3Plus: spreadSharpFeatures?.conWalletCount >= 3, plusEV: spreadEvEdge > 0, lineMovingWith: spreadPinnMovedWith }, sharpCount: spreadSharpFeatures?.conWalletCount || 0, totalInvested: spreadSharpFeatures?.conTotalInvested || 0, evEdge: spreadEvEdge, units: spreadUnits, unitTier: unitTier(spreadUnits).label, consensusStrength: { moneyPct: Math.round(spreadSharpFeatures?.conMoneyPct ?? 50), walletPct: Math.round(spreadSharpFeatures?.conWalletPct ?? 50), grade: spreadSharpFeatures?.consensusTier || 'LEAN' }, stars: spreadSr.stars, team: spreadConsensuTeam }, { sport: gd.sport, away: gd.away, home: gd.home, commenceTime, marketType: 'spread' }, action);
      }
    });
  }, [isSpreadLocked, spreadSr?.stars]);

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
  const totalPinnMovedWith = totalOpenLine && totalPinnLine && totalConsensusSide === 'over'
    ? (totalPinnLine.line > totalOpenLine.line)
    : totalOpenLine && totalPinnLine ? (totalPinnLine.line < totalOpenLine.line) : false;
  const totalPinnMovedAgainst = totalOpenLine && totalPinnLine && totalConsensusSide === 'over'
    ? (totalPinnLine.line < totalOpenLine.line)
    : totalOpenLine && totalPinnLine ? (totalPinnLine.line > totalOpenLine.line) : false;

  const totalPinnConfirms = !!totalPinnLine && !!totalLine;
  const totalSharpFeatures = totalGameData ? computeSharpFeatures(totalGameData.positions || [], totalConsensusSide) : null;
  const totalBetOdds = totalBestRetail || totalPinnOdds;
  const totalSr = totalSharpFeatures ? rateSpreadTotalStars({
    evEdge: totalEvEdge || 0,
    pinnConfirms: totalPinnConfirms,
    pinnMovingWith: totalPinnMovedWith,
    pinnMovingAgainst: totalPinnMovedAgainst,
    breadth: totalSharpFeatures.breadth,
    conviction: totalSharpFeatures.conviction,
    concentration: totalSharpFeatures.concentration,
    counterSharpScore: totalSharpFeatures.counterSharpScore,
    consensusTier: totalSharpFeatures.consensusTier,
    sportSharpCount: totalSharpFeatures.sportSharpCount,
    pinnProb: totalPinnProb, dominantTier: totalSharpFeatures.dominantTier, conWalletCount: totalSharpFeatures.conWalletCount,
    odds: totalBetOdds, sport: gd.sport,
  }) : null;

  const isTotalLocked = totalSr && totalSr.stars >= 2.5
    && (totalSharpFeatures?.conWalletCount || 0) >= 2
    && (totalSharpFeatures?.conTotalInvested || 0) >= 5000;
  const totalUnits = isTotalLocked ? calculateSpreadTotalUnits(totalSr.stars, 0, totalBetOdds) : 0;

  useEffect(() => {
    if (!isTotalLocked || isGameLive || !commenceTime || !onPickSynced || !totalConsensusSide) return;
    if (Date.now() >= commenceTime - 5 * 60 * 1000) return;
    if (lastSyncedTotalStars.current !== null && totalSr.stars <= lastSyncedTotalStars.current) return;
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
    }).then(({ docId, action }) => {
      if (action === 'error') return;
      lastSyncedTotalStars.current = totalSr.stars;
      if (action !== 'no_change') {
        const totalTeamLabel = totalConsensusSide === 'over' ? `Over ${totalLine}` : `Under ${totalLine}`;
        onPickSynced(docId, totalConsensusSide, { odds: totalBetOdds, book: totalBestBook || 'Pinnacle', pinnacleOdds: totalPinnOdds, line: totalLine, criteriaMet: totalSharpFeatures ? (totalSharpFeatures.conWalletCount >= 3 ? 1 : 0) + (totalEvEdge > 0 ? 1 : 0) + (totalPinnMovedWith ? 1 : 0) : 0, criteria: { sharps3Plus: totalSharpFeatures?.conWalletCount >= 3, plusEV: totalEvEdge > 0, lineMovingWith: totalPinnMovedWith }, sharpCount: totalSharpFeatures?.conWalletCount || 0, totalInvested: totalSharpFeatures?.conTotalInvested || 0, evEdge: totalEvEdge, units: totalUnits, unitTier: unitTier(totalUnits).label, consensusStrength: { moneyPct: Math.round(totalSharpFeatures?.conMoneyPct ?? 50), walletPct: Math.round(totalSharpFeatures?.conWalletPct ?? 50), grade: totalSharpFeatures?.consensusTier || 'LEAN' }, stars: totalSr.stars, team: totalTeamLabel }, { sport: gd.sport, away: gd.away, home: gd.home, commenceTime, marketType: 'total' }, action);
      }
    });
  }, [isTotalLocked, totalSr?.stars]);

  const isActionable = sr.isActionable;
  const accentColor = isLocked ? B.green : isActionable ? B.green : B.gold;
  const accentBorder = isLocked ? 'rgba(16,185,129,0.4)' : isActionable ? 'rgba(16,185,129,0.3)' : B.goldBorder;

  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: isMyPick ? '1px solid rgba(99,102,241,0.5)' : `1px solid ${accentBorder}`,
      boxShadow: isMyPick ? '0 0 12px rgba(99,102,241,0.15)' : undefined,
    }}>
      {/* Top accent */}
      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
      }} />

      {/* ─── Header row ─── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.875rem 1rem 0.375rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge color={ss.color} bg={ss.bg}>{ss.icon} {gd.sport}</Badge>
          <span style={{ ...T.body, fontWeight: 700, color: B.text }}>
            {gd.away} <span style={{ color: B.textMuted, fontWeight: 400 }}>vs</span> {gd.home}
          </span>
          {gameTimeLabel && (
            <span style={{
              ...T.micro, fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px',
              fontFeatureSettings: "'tnum'",
              ...(isGameLive ? {
                color: '#fff', background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                animation: 'pulse 2s ease-in-out infinite',
              } : minsUntilStart <= 60 ? {
                color: '#F59E0B', background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.25)',
              } : {
                color: B.textSec, background: 'rgba(255,255,255,0.04)',
              }),
            }}>
              {isGameLive ? '● LIVE' : gameTimeFormatted ? `${gameTimeFormatted} ET` : gameTimeLabel}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          {isLocked && (
            <span style={{
              ...T.micro, fontWeight: 900, letterSpacing: '0.04em',
              padding: '0.2rem 0.6rem', borderRadius: '5px',
              color: '#fff',
              background: lockType === 'LIVE'
                ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                : 'linear-gradient(135deg, #10B981, #059669)',
              border: `1px solid ${lockType === 'LIVE' ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'}`,
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              boxShadow: `0 0 8px ${lockType === 'LIVE' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
            }}>
              <Lock size={10} /> {lockType === 'LIVE' ? 'LIVE LOCK' : 'LOCKED IN'}
            </span>
          )}
          <span style={{
            ...T.micro, fontWeight: 800, letterSpacing: '0.04em',
            padding: '0.2rem 0.6rem', borderRadius: '5px',
            color: sr.color, background: sr.bg,
            border: `1px solid ${isActionable ? 'rgba(16,185,129,0.2)' : B.goldBorder}`,
            display: 'flex', alignItems: 'center', gap: '0.2rem',
          }}>
            {Array.from({ length: 5 }, (_, i) => {
              const filled = i + 1 <= Math.floor(sr.stars);
              const half = !filled && i + 0.5 === sr.stars;
              return filled ? (
                <span key={i} style={{ fontSize: '0.5rem', color: sr.color, lineHeight: 1 }}>★</span>
              ) : half ? (
                <span key={i} style={{ position: 'relative', display: 'inline-block', fontSize: '0.5rem', lineHeight: 1, width: '0.5rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>★</span>
                  <span style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', width: '50%', color: sr.color }}>★</span>
                </span>
              ) : (
                <span key={i} style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>★</span>
              );
            })}
            <span style={{ marginLeft: '0.15rem' }}>{sr.label}</span>
          </span>
        </div>
      </div>

      {/* ─── Action Box — always present, tells user what to do ─── */}
      <div style={{
        margin: '0.375rem 0.875rem 0', padding: '0.75rem',
        borderRadius: '10px',
        background: isActionable
          ? 'linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.02) 100%)'
          : `linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)`,
        border: `1px solid ${isActionable ? 'rgba(16,185,129,0.25)' : B.goldBorder}`,
      }}>
        {/* Top: Recommendation + narrative */}
        <div style={{ marginBottom: '0.625rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.25rem',
          }}>
            <span style={{ ...T.label, fontWeight: 800, color: isActionable ? B.green : B.gold }}>
              {isActionable ? 'RECOMMENDED BET' : 'SHARP CONSENSUS'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              {isLocked && (
                <span style={{
                  ...T.body, fontWeight: 900, color: '#fff',
                  padding: '0.2rem 0.6rem', borderRadius: '5px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  fontFeatureSettings: "'tnum'",
                }}>
                  {ut.icon} {units.toFixed(1)}u
                </span>
              )}
              {hasEV && (
                <span style={{
                  ...T.body, fontWeight: 900, color: B.green,
                  padding: '0.2rem 0.6rem', borderRadius: '5px',
                  background: B.greenDim,
                }}>
                  +{evEdge}% EV
                </span>
              )}
            </div>
          </div>
          <div style={{ ...T.micro, color: B.textSec, lineHeight: 1.5, marginTop: '0.15rem' }}>
            {consensusWalletCount} sharp bettor{consensusWalletCount !== 1 ? 's have' : ' has'} invested <span style={{ color: B.gold, fontWeight: 700 }}>{fmtVol(consensusInvestedAmt)}</span> on {consensusShort} (avg <span style={{ fontWeight: 700 }}>{fmtVol(consensusAvgBet)}</span>/bet) with a combined <span style={{ color: B.green, fontWeight: 700 }}>+{fmtVol(consensusLifetimePnl)}</span> lifetime P&L.{pinnConfirms ? ` Pinnacle's line confirms the play.` : ''}{hasEV ? ` +${evEdge}% EV edge at ${bestBook}.` : ''}
          </div>
        </div>

        {/* Middle: The actual bet */}
        <div style={{
          display: 'grid', gridTemplateColumns: (bestRetail || consensusOdds) ? '1fr auto 1fr' : '1fr',
          gap: '0.625rem', alignItems: 'center',
        }}>
          <div>
            <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.2rem' }}>
              {consensusWalletCount} sharp{consensusWalletCount !== 1 ? 's' : ''} backing
            </div>
            <div style={{ ...T.heading, fontWeight: 900, color: B.text }}>
              {consensusShort} ML
            </div>
            {pinnProb && (
              <div style={{ ...T.micro, color: B.textSec, marginTop: '0.15rem' }}>
                Fair value: {fmtOdds(consensusOdds)} ({(pinnProb * 100).toFixed(1)}%)
              </div>
            )}
          </div>
          {(bestRetail || consensusOdds) && (
            <>
              <div style={{ width: '1px', height: '40px', background: B.borderSubtle }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.2rem' }}>
                  {isActionable ? 'BET AT' : 'BEST PRICE'}
                </div>
                <div style={{
                  ...T.heading, fontWeight: 900,
                  color: hasEV ? B.green : B.text,
                }}>
                  {fmtOdds(bestRetail || consensusOdds)}
                </div>
                <div style={{ ...T.micro, color: B.textSec, marginTop: '0.15rem' }}>
                  {bestBook || 'Pinnacle'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Unit sizing + risk/reward when locked */}
        {isLocked && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '0.625rem', padding: '0.375rem 0.5rem',
            borderRadius: '6px',
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ ...T.micro, color: B.textSec }}>Risk</span>
              <span style={{ ...T.micro, fontWeight: 800, color: B.text, fontFeatureSettings: "'tnum'" }}>
                {units.toFixed(1)}u
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ ...T.micro, color: B.textSec }}>To Win</span>
              <span style={{ ...T.micro, fontWeight: 800, color: B.green, fontFeatureSettings: "'tnum'" }}>
                +{potentialWin.toFixed(2)}u
              </span>
            </div>
            <span style={{
              ...T.micro, fontWeight: 800, color: ut.color,
              padding: '0.1rem 0.35rem', borderRadius: '4px',
              background: ut.color === B.green ? B.greenDim : ut.color === B.gold ? B.goldDim : 'rgba(255,255,255,0.04)',
            }}>
              {ut.icon} {ut.label}
            </span>
          </div>
        )}

        {/* Bottom: confidence factors */}
        <div style={{
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
          marginTop: '0.625rem', paddingTop: '0.5rem',
          borderTop: `1px solid ${isActionable ? 'rgba(16,185,129,0.15)' : 'rgba(212,175,55,0.12)'}`,
        }}>
          <span style={{
            ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
            background: B.goldDim, color: B.gold, fontWeight: 600,
          }}>
            {consensusWalletCount} sharp bettor{consensusWalletCount !== 1 ? 's' : ''}
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
          <span style={{
            ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
            fontWeight: 600,
            background: cGrade.color === B.green ? B.greenDim : cGrade.color === B.gold ? B.goldDim : B.redDim,
            color: cGrade.color,
          }}>
            {cGrade.label} ({Math.round(cGrade.score)}%)
          </span>
          {hasEV && (
            <span style={{
              ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
              background: B.greenDim, color: B.green, fontWeight: 700,
            }}>
              +{evEdge}% edge
            </span>
          )}
          {rlmActive && (
            <span style={{
              ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
              background: 'rgba(99,102,241,0.12)', color: '#818CF8', fontWeight: 700,
            }}>
              RLM +{flowTicketDiv.toFixed(0)}pt
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
        </div>
      </div>

      {/* ─── Lock-In Criteria Checklist ─── */}
      <div style={{
        margin: '0.5rem 0.875rem 0', padding: '0.5rem 0.625rem',
        borderRadius: '8px',
        background: isLocked
          ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)'
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isLocked ? 'rgba(16,185,129,0.25)' : B.borderSubtle}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '0.375rem',
        }}>
          <span style={{ ...T.micro, color: isLocked ? B.green : B.textMuted, fontWeight: 700 }}>
            {isLocked ? `PLAY LOCKED — ${sr.stars >= 4.5 ? '★★★★★ ELITE' : sr.stars >= 3.5 ? '★★★★ STRONG' : sr.stars >= 3 ? '★★★ SOLID' : '★★½ SOLID'}` : `LOCK-IN CRITERIA (${criteriaMet}/6)`}
          </span>
          <span style={{
            ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'",
            color: criteriaMet >= 5 ? B.green : criteriaMet >= 4 ? B.green : criteriaMet >= 3 ? B.gold : B.textMuted,
          }}>
            {criteriaMet}/6
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '0.25rem',
        }}>
          {criteria.map(c => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.15rem 0',
            }}>
              {c.met
                ? <CheckCircle size={11} color={B.green} strokeWidth={2.5} />
                : <Circle size={11} color={B.textMuted} strokeWidth={1.5} />
              }
              <span style={{
                ...T.micro, fontSize: '0.5625rem',
                color: c.met ? B.green : B.textMuted,
                fontWeight: c.met ? 700 : 400,
              }}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Market Tab Strip ── */}
      {(() => {
        const hasSpread = !!(pinnGame?.spreadCurrent || flowGame?.polySpread || (flowGame?.kalshiSpreads?.length > 0));
        const hasTotal = !!(pinnGame?.totalCurrent || flowGame?.polyTotal || (flowGame?.kalshiTotals?.length > 0));
        if (!hasSpread && !hasTotal) return null;
        return <MarketTabStrip active={marketTab} onChange={setMarketTab} hasSpread={hasSpread} hasTotal={hasTotal} spreadLocked={!!isSpreadLocked} totalLocked={!!isTotalLocked} />;
      })()}

      {marketTab === 'spread' && (
        <div style={{ padding: '0.5rem 0.875rem' }}>
          {/* ─── Spread Lock-In Criteria ─── */}
          {spreadSharpFeatures && (() => {
            const sCriteria = [
              { id: 's3', met: (spreadSharpFeatures.conWalletCount || 0) >= 2, label: '2+ Sharp Bettors' },
              { id: 'sinv', met: (spreadSharpFeatures.conTotalInvested || 0) >= 5000, label: '$5K+ on Side' },
              { id: 'sev', met: spreadEvEdge > 0, label: '+EV Edge' },
              { id: 'spinn', met: spreadPinnConfirms, label: 'Pinnacle Confirms' },
              { id: 'sline', met: spreadPinnMovedWith, label: 'Line Moving With' },
            ];
            const sMetCount = sCriteria.filter(c => c.met).length;
            return (
              <div style={{
                padding: '0.5rem 0.625rem', borderRadius: '8px', marginBottom: '0.5rem',
                background: isSpreadLocked
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSpreadLocked ? 'rgba(16,185,129,0.25)' : B.borderSubtle}`,
              }}>
                {isSpreadLocked && spreadSr ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '1rem' }}>{'★'.repeat(Math.floor(spreadSr.stars))}{spreadSr.stars % 1 ? '½' : ''}</span>
                    <span style={{ ...T.micro, fontWeight: 700, color: B.green }}>SPREAD LOCK — {spreadConsensuTeam} {spreadLine > 0 ? '+' : ''}{spreadLine}</span>
                    <span style={{ ...T.micro, color: B.textSec, marginLeft: 'auto' }}>{spreadUnits}u @ {fmtOdds(spreadBetOdds)}</span>
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
                        {awayPnl >= 0 ? '+' : ''}{fmtVol(awayPnl)} lifetime
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
                        {homePnl >= 0 ? '+' : ''}{fmtVol(homePnl)} lifetime
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
                  <span style={{ ...T.micro, color: '#8B5CF6', fontWeight: 700 }}>{uniqueSpreadWallets} SPREAD SHARP{uniqueSpreadWallets !== 1 ? 'S' : ''}</span>
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
                  {filtered.map((p, i) => {
                    const sideTeam = p.side === 'away' ? gd.away : gd.home;
                    const sideShort = sideTeam.split(' ').pop();
                    const posColor = p.pnl >= 0 ? B.green : B.red;
                    const lifeColor = (p.totalPnl || 0) >= 0 ? B.green : B.red;
                    const tc = p.tier === 'ELITE' ? { color: B.gold, bg: B.goldDim } : { color: B.green, bg: B.greenDim };
                    const seenAgo = p.firstSeen ? (() => { const mins = Math.round((now - new Date(p.firstSeen).getTime()) / 60000); return mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.round(mins / 60)}h ago` : `${Math.round(mins / 1440)}d ago`; })() : null;
                    return (
                      <div key={`${p.wallet}-${i}`} style={{ padding: '0.5rem 0.625rem', borderBottom: i < filtered.length - 1 ? `1px solid ${B.borderSubtle}` : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                            <Badge color={tc.color} bg={tc.bg}>{p.tier}</Badge>
                            <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>...{p.wallet.slice(-4)}</span>
                            <span style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", color: lifeColor, padding: '0.1rem 0.3rem', borderRadius: '3px', background: (p.totalPnl || 0) >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>{(p.totalPnl || 0) >= 0 ? '+' : ''}{fmtVol(p.totalPnl || 0)} lifetime</span>
                          </div>
                          {seenAgo && <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'", whiteSpace: 'nowrap' }}>{seenAgo}</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.25rem' }}>
                          <span style={{ ...T.micro, color: '#8B5CF6', fontWeight: 700 }}>{sideShort}</span>
                          <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>{fmtVol(p.invested)} @ {Math.round(p.avgPrice * 100)}¢</span>
                          <span style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", color: posColor }}>{p.pnl >= 0 ? '+' : ''}{fmtVol(p.pnl)}</span>
                        </div>
                      </div>
                    );
                  })}
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
              { id: 'tinv', met: (totalSharpFeatures.conTotalInvested || 0) >= 5000, label: '$5K+ on Side' },
              { id: 'tev', met: totalEvEdge > 0, label: '+EV Edge' },
              { id: 'tpinn', met: totalPinnConfirms, label: 'Pinnacle Confirms' },
              { id: 'tline', met: totalPinnMovedWith, label: 'Line Moving With' },
            ];
            const tMetCount = tCriteria.filter(c => c.met).length;
            return (
              <div style={{
                padding: '0.5rem 0.625rem', borderRadius: '8px', marginBottom: '0.5rem',
                background: isTotalLocked
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isTotalLocked ? 'rgba(16,185,129,0.25)' : B.borderSubtle}`,
              }}>
                {isTotalLocked && totalSr ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '1rem' }}>{'★'.repeat(Math.floor(totalSr.stars))}{totalSr.stars % 1 ? '½' : ''}</span>
                    <span style={{ ...T.micro, fontWeight: 700, color: B.green }}>TOTAL LOCK — {totalConsensusSide === 'over' ? 'Over' : 'Under'} {totalLine}</span>
                    <span style={{ ...T.micro, color: B.textSec, marginLeft: 'auto' }}>{totalUnits}u @ {fmtOdds(totalBetOdds)}</span>
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
            const overW = new Set(overPos.map(p => p.wallet)).size;
            const underW = new Set(underPos.map(p => p.wallet)).size;
            const overInv = tSummary.overInvested || 0;
            const underInv = tSummary.underInvested || 0;
            const totalInv = overInv + underInv;
            const overPnl = overPos.reduce((s, p) => s + (p.totalPnl || 0), 0);
            const underPnl = underPos.reduce((s, p) => s + (p.totalPnl || 0), 0);
            const overAvg = overPos.length > 0 ? overInv / overPos.length : 0;
            const underAvg = underPos.length > 0 ? underInv / underPos.length : 0;
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
                        {overPnl >= 0 ? '+' : ''}{fmtVol(overPnl)} lifetime
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
                        {underPnl >= 0 ? '+' : ''}{fmtVol(underPnl)} lifetime
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
                  <span style={{ ...T.micro, color: '#F59E0B', fontWeight: 700 }}>{uniqueTotalWallets} TOTAL SHARP{uniqueTotalWallets !== 1 ? 'S' : ''}</span>
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
                  {filtered.map((p, i) => {
                    const sideLabel = p.side === 'over' ? 'Over' : 'Under';
                    const posColor = p.pnl >= 0 ? B.green : B.red;
                    const lifeColor = (p.totalPnl || 0) >= 0 ? B.green : B.red;
                    const tc = p.tier === 'ELITE' ? { color: B.gold, bg: B.goldDim } : { color: B.green, bg: B.greenDim };
                    const seenAgo = p.firstSeen ? (() => { const mins = Math.round((now - new Date(p.firstSeen).getTime()) / 60000); return mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.round(mins / 60)}h ago` : `${Math.round(mins / 1440)}d ago`; })() : null;
                    return (
                      <div key={`${p.wallet}-${i}`} style={{ padding: '0.5rem 0.625rem', borderBottom: i < filtered.length - 1 ? `1px solid ${B.borderSubtle}` : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                            <Badge color={tc.color} bg={tc.bg}>{p.tier}</Badge>
                            <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>...{p.wallet.slice(-4)}</span>
                            <span style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", color: lifeColor, padding: '0.1rem 0.3rem', borderRadius: '3px', background: (p.totalPnl || 0) >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>{(p.totalPnl || 0) >= 0 ? '+' : ''}{fmtVol(p.totalPnl || 0)} lifetime</span>
                          </div>
                          {seenAgo && <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'", whiteSpace: 'nowrap' }}>{seenAgo}</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.25rem' }}>
                          <span style={{ ...T.micro, color: '#F59E0B', fontWeight: 700 }}>{sideLabel}</span>
                          <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>{fmtVol(p.invested)} @ {Math.round(p.avgPrice * 100)}¢</span>
                          <span style={{ ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", color: posColor }}>{p.pnl >= 0 ? '+' : ''}{fmtVol(p.pnl)}</span>
                        </div>
                      </div>
                    );
                  })}
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
          const panelStyle = (isActive) => ({
            flex: 1, padding: '0.625rem',
            borderRadius: '8px',
            background: isActive
              ? `linear-gradient(135deg, ${accentColor}12 0%, ${accentColor}04 100%)`
              : 'rgba(255,255,255,0.015)',
            border: `1px solid ${isActive ? `${accentColor}40` : B.borderSubtle}`,
            position: 'relative',
            overflow: 'hidden',
          });

          const SidePanel = ({ team, wallets, invested, pnl, avgBet, isActive, align }) => (
            <div style={panelStyle(isActive)}>
              {isActive && (
                <div style={{
                  position: 'absolute', top: 0, [align === 'left' ? 'left' : 'right']: 0,
                  width: '3px', height: '100%',
                  background: accentColor,
                  borderRadius: align === 'left' ? '8px 0 0 8px' : '0 8px 8px 0',
                }} />
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
                marginBottom: '0.5rem',
              }}>
                {isActive && align === 'left' && (
                  <span style={{
                    ...T.micro, fontSize: '0.5rem', fontWeight: 900,
                    padding: '0.1rem 0.3rem', borderRadius: '3px',
                    color: '#fff', background: accentColor,
                  }}>SHARP SIDE</span>
                )}
                <span style={{
                  ...T.sub, fontWeight: 900,
                  color: isActive ? B.text : B.textMuted,
                }}>
                  {team}
                </span>
                {isActive && align === 'right' && (
                  <span style={{
                    ...T.micro, fontSize: '0.5rem', fontWeight: 900,
                    padding: '0.1rem 0.3rem', borderRadius: '3px',
                    color: '#fff', background: accentColor,
                  }}>SHARP SIDE</span>
                )}
              </div>

              <div style={{
                display: 'flex', flexDirection: 'column', gap: '0.375rem',
                alignItems: align === 'right' ? 'flex-end' : 'flex-start',
              }}>
                <div>
                  <div style={{ ...T.heading, fontWeight: 900, color: isActive ? accentColor : B.textSec, fontFeatureSettings: "'tnum'" }}>
                    {fmtVol(invested)}
                  </div>
                  <div style={{ ...T.micro, color: B.textMuted }}>
                    {wallets} sharp{wallets !== 1 ? 's' : ''} · avg {fmtVol(avgBet)}
                  </div>
                </div>
                <div style={{
                  ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
                  padding: '0.15rem 0.4rem', borderRadius: '4px',
                  color: pnl >= 0 ? B.green : B.red,
                  background: pnl >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                }}>
                  {pnl >= 0 ? '+' : ''}{fmtVol(pnl)} lifetime
                </div>
              </div>
            </div>
          );

          return (
            <div style={{ marginBottom: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                <span style={{ ...T.micro, color: B.textMuted }}>Sharp Money — Both Sides</span>
                <span style={{
                  ...T.micro, fontWeight: 800, color: accentColor,
                  padding: '0.1rem 0.3rem', borderRadius: '3px',
                  background: `${accentColor}15`,
                }}>
                  {moneyRatio}% {consensusShort}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <SidePanel team={awayShort} wallets={awayWallets} invested={awayInvested} pnl={awayLifetimePnl} avgBet={awayAvgBet} isActive={awaySide} align="left" />

                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '0 0.125rem', flexShrink: 0,
                }}>
                  <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>VS</span>
                </div>

                <SidePanel team={homeShort} wallets={homeWallets} invested={homeInvested} pnl={homeLifetimePnl} avgBet={homeAvgBet} isActive={homeSide} align="right" />
              </div>

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
                    marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden',
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
                                  display: 'flex', height: '5px', borderRadius: '2.5px', overflow: 'hidden',
                                  background: 'rgba(255,255,255,0.03)',
                                }}>
                                  <div style={{
                                    width: `${bar.awayVal}%`, background: barAwayBg,
                                    borderRadius: '2.5px 0 0 2.5px',
                                    transition: 'width 0.5s cubic-bezier(.4,0,.2,1)',
                                  }} />
                                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                                  <div style={{
                                    width: `${bar.homeVal}%`, background: barHomeBg,
                                    borderRadius: '0 2.5px 2.5px 0',
                                    transition: 'width 0.5s cubic-bezier(.4,0,.2,1)',
                                  }} />
                                </div>
                                <span style={{
                                  ...T.micro, fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)',
                                  textAlign: 'center', letterSpacing: '0.03em',
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
            borderRadius: '8px', overflow: 'hidden',
            border: `1px solid ${B.borderSubtle}`, marginBottom: '0.625rem',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
              <span style={{ ...T.micro, color: B.textMuted }}>Price Movement</span>
            </div>
            <div style={{
              display: 'flex', gap: '0.75rem', padding: '0.5rem 0.625rem',
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
            borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${B.borderSubtle}`, marginBottom: '0.625rem',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
              <span style={{ ...T.micro, color: B.textMuted }}>
                Book Prices — {consensusShort} ML
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {Object.entries(allBooks)
                .sort(([, a], [, b]) => {
                  const aO = consensusSide === 'away' ? a.away : a.home;
                  const bO = consensusSide === 'away' ? b.away : b.home;
                  return bO - aO;
                })
                .map(([key, book]) => {
                  const odds = consensusSide === 'away' ? book.away : book.home;
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
            <span style={{ ...T.micro, color: B.gold, fontWeight: 700 }}>
              {uniqueWallets} VERIFIED SHARP{uniqueWallets !== 1 ? 'S' : ''}
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
            { key: 'opposing', label: consensusSide === 'away' ? homeShort : awayShort },
          ];
          const now = Date.now();
          const filtered = gd.positions.filter(p => {
            if (walletSideFilter === 'consensus' && p.side !== consensusSide) return false;
            if (walletSideFilter === 'opposing' && p.side === consensusSide) return false;
            return true;
          }).sort((a, b) => (b.sportVerified ? 1 : 0) - (a.sportVerified ? 1 : 0));

          return (
            <div style={{
              marginTop: '0.375rem', borderRadius: '8px', overflow: 'hidden',
              border: `1px solid ${B.borderSubtle}`,
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

              {/* Position rows */}
              {filtered.length === 0 ? (
                <div style={{ padding: '1rem 0.625rem', textAlign: 'center' }}>
                  <span style={{ ...T.micro, color: B.textMuted }}>No positions match filters</span>
                </div>
              ) : filtered.map((p, i) => {
                const sideTeam = p.side === 'away' ? gd.away : gd.home;
                const sideShort = sideTeam.split(' ').pop();
                const posColor = p.pnl >= 0 ? B.green : B.red;
                const lifeColor = (p.totalPnl || 0) >= 0 ? B.green : B.red;
                const tc = p.tier === 'ELITE'
                  ? { color: B.gold, bg: B.goldDim }
                  : { color: B.green, bg: B.greenDim };
                const seenAgo = p.firstSeen ? (() => {
                  const mins = Math.round((now - new Date(p.firstSeen).getTime()) / 60000);
                  if (mins < 60) return `${mins}m ago`;
                  const hrs = Math.round(mins / 60);
                  if (hrs < 24) return `${hrs}h ago`;
                  return `${Math.round(hrs / 24)}d ago`;
                })() : null;

                return (
                  <div key={`${p.wallet}-${i}`} style={{
                    padding: '0.5rem 0.625rem',
                    borderBottom: i < filtered.length - 1 ? `1px solid ${B.borderSubtle}` : 'none',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: '0.5rem', marginBottom: '0.25rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                        <Badge color={tc.color} bg={tc.bg}>{p.tier}</Badge>
                        <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                          ...{p.wallet.slice(-4)}
                        </span>
                        <span style={{
                          ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
                          color: lifeColor,
                          padding: '0.1rem 0.3rem', borderRadius: '3px',
                          background: (p.totalPnl || 0) >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                        }}>
                          {(p.totalPnl || 0) >= 0 ? '+' : ''}{fmtVol(p.totalPnl || 0)} lifetime
                        </span>
                        {p.sportVerified && p.sportPnl > 0 && (
                          <span style={{
                            ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
                            color: '#22D3EE',
                            padding: '0.1rem 0.3rem', borderRadius: '3px',
                            background: 'rgba(6,182,212,0.08)',
                          }}>
                            +{fmtVol(p.sportPnl)} {gd.sport}
                          </span>
                        )}
                      </div>
                      {seenAgo && (
                        <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'", whiteSpace: 'nowrap' }}>
                          {seenAgo}
                        </span>
                      )}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      paddingLeft: '0.25rem',
                    }}>
                      <span style={{ ...T.micro, color: B.gold, fontWeight: 700 }}>
                        {sideShort}
                      </span>
                      <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                        {fmtVol(p.invested)} @ {Math.round(p.avgPrice * 100)}¢
                      </span>
                      <span style={{
                        ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'", color: posColor,
                      }}>
                        {p.pnl >= 0 ? '+' : ''}{fmtVol(p.pnl)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        <div style={{ padding: '0 0.875rem 0.875rem', marginTop: '0.375rem' }}>
          {canPickGames ? (
            <button
              onClick={() => onToggleMyPick(gd.key, isMyPick ? null : { side: consensusSide, team: consensusTeam, sport: gd.sport })}
              style={{
                width: '100%', padding: '0.625rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                border: isMyPick ? '1.5px solid rgba(99,102,241,0.6)' : '1.5px solid rgba(99,102,241,0.25)',
                background: isMyPick
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(129,140,248,0.10) 100%)'
                  : 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(129,140,248,0.02) 100%)',
                color: isMyPick ? '#A5B4FC' : '#818CF8',
                boxShadow: isMyPick ? '0 0 10px rgba(99,102,241,0.2)' : 'none',
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
                width: '100%', padding: '0.625rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                border: '1.5px solid rgba(99,102,241,0.25)',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(129,140,248,0.02) 100%)',
                color: '#818CF8',
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
    const completed = picks.filter(p => p.status === 'COMPLETED' && p.outcome);
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
                {[{ k: 'ALL', l: 'All Sports' }, { k: 'NHL', l: 'NHL' }, { k: 'CBB', l: 'CBB' }, { k: 'MLB', l: 'MLB' }, { k: 'NBA', l: 'NBA' }].map(s => (
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

export default function SharpFlow() {
  const { polyData, kalshiData, whaleProfiles, pinnacleHistory, sharpPositions, spreadPositions, totalPositions, sportsSharps, loading } = useMarketData();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription(user);
  const [sportFilter, setSportFilter] = useState('All');
  const [viewMode, setViewMode] = useState('whaleSignals');
  const [vaultSportFilter, setVaultSportFilter] = useState('ALL');
  const [expandedVaultRow, setExpandedVaultRow] = useState(null);
  const [gameSort, setGameSort] = useState('time');
  const [signalType, setSignalType] = useState('upcoming');
  const [sortBy, setSortBy] = useState('stars');
  const [lockedPicks, setLockedPicks] = useState({});
  const [allTimePnL, setAllTimePnL] = useState(null);
  const [showPerf, setShowPerf] = useState(false);
  const [perfDateRange, setPerfDateRange] = useState('all');
  const [lockedDay, setLockedDay] = useState('today');
  const [lockedStatusFilter, setLockedStatusFilter] = useState('all');
  const [lockedSort, setLockedSort] = useState('stars');
  const [lockedSportFilter, setLockedSportFilter] = useState('All');
  const [lockedMarketFilter, setLockedMarketFilter] = useState('all');
  const [perfSport, setPerfSport] = useState('ALL');
  const [perfMarket, setPerfMarket] = useState('all');
  const [perfGrowth, setPerfGrowth] = useState('all');
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
    if ((showPerf || !isPremium) && !pnlLoadedRef.current) {
      pnlLoadedRef.current = true;
      loadAllTimePnL().then(setAllTimePnL);
    }
  }, [showPerf, isPremium]);

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
      updatedSides[side] = { ...updatedSides[side], peak: snap, lock: updatedSides[side]?.lock || snap, team: snap.team };
      const docUpdate = { ...prevDoc, sides: updatedSides };
      if (meta) { docUpdate.sport = meta.sport; docUpdate.away = meta.away; docUpdate.home = meta.home; docUpdate.commenceTime = meta.commenceTime; if (meta.marketType) docUpdate.marketType = meta.marketType; }
      next[docId] = docUpdate;
      return next;
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

  const filteredPnL = useMemo(() => {
    if (!allTimePnL) return null;
    const rawPicks = allTimePnL.picks || [];
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const yesterdayD = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterdayD.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    let cutoff = null;
    if (perfDateRange === 'today') cutoff = todayStr;
    else if (perfDateRange === 'yesterday') cutoff = yesterdayStr;
    else if (perfDateRange === '7d') {
      const d = new Date(now); d.setDate(d.getDate() - 7);
      cutoff = d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    } else if (perfDateRange === '30d') {
      const d = new Date(now); d.setDate(d.getDate() - 30);
      cutoff = d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    }
    const filtered = rawPicks.filter(p => {
      if (perfSport !== 'ALL' && p.sport !== perfSport) return false;
      if (perfMarket !== 'all' && (p.marketType || 'ml') !== perfMarket) return false;
      if (perfGrowth === 'topPick') {
        const delta = (p.lockStars != null && p.stars != null) ? p.stars - p.lockStars : 0;
        if (delta < 1.0) return false;
      } else if (perfGrowth === 'golden') {
        const delta = (p.lockStars != null && p.stars != null) ? p.stars - p.lockStars : 0;
        const evD = (p.peakEV != null && p.lockEV != null) ? p.peakEV - p.lockEV : 0;
        if (delta < 1.0 || evD <= 0) return false;
      }
      if (perfDateRange === 'today') return p.date === todayStr;
      if (perfDateRange === 'yesterday') return p.date === yesterdayStr;
      if (cutoff) return p.date >= cutoff;
      return true;
    });
    const starBucket = (s) => s >= 4.5 ? 5 : s >= 3.5 ? 4 : s >= 2.5 ? 3 : s >= 1.5 ? 2 : 1;
    const emptyBucket = () => ({ wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0, totalPicks: 0 });
    let wins = 0, losses = 0, pushes = 0, totalProfit = 0, totalUnits = 0;
    const byStars = {};
    for (const p of filtered) {
      const key = starBucket(p.stars);
      if (!byStars[key]) byStars[key] = emptyBucket();
      byStars[key].totalPicks++;
      if (p.status !== 'COMPLETED' && !p.outcome) continue;
      if (!p.outcome) continue;
      const u = p.units || 1;
      totalUnits += u;
      byStars[key].totalUnits += u;
      if (p.outcome === 'WIN') { wins++; totalProfit += p.profit; byStars[key].wins++; byStars[key].totalProfit += p.profit; }
      else if (p.outcome === 'LOSS') { losses++; totalProfit -= u; byStars[key].losses++; byStars[key].totalProfit -= u; }
      else if (p.outcome === 'PUSH') { pushes++; byStars[key].pushes++; }
    }
    for (const v of Object.values(byStars)) {
      v.totalProfit = +v.totalProfit.toFixed(2);
      v.record = `${v.wins}-${v.losses}${v.pushes > 0 ? `-${v.pushes}` : ''}`;
      v.roi = v.totalUnits > 0 ? +((v.totalProfit / v.totalUnits) * 100).toFixed(1) : 0;
    }
    return {
      pregame: { wins, losses, pushes, totalProfit: +totalProfit.toFixed(2), totalUnits, record: `${wins}-${losses}${pushes > 0 ? `-${pushes}` : ''}` },
      byStars,
    };
  }, [allTimePnL, perfDateRange, perfSport, perfMarket, perfGrowth]);

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
    const allEliteProven = whaleProfiles ? Object.values(whaleProfiles).filter(p => ['ELITE', 'PROVEN'].includes(p.tier)) : [];
    const mmExcluded = allEliteProven.filter(p => (p.mmScore || 0) > 40).length;
    const sportLosers = allEliteProven.filter(p => {
      if ((p.mmScore || 0) > 40) return false;
      return Object.values(p.sportPnl || {}).reduce((s, v) => s + v, 0) < -100000;
    }).length;
    const totalExcluded = mmExcluded + sportLosers;
    const cleanWallets = allEliteProven.filter(p => {
      if ((p.mmScore || 0) > 40) return false;
      return Object.values(p.sportPnl || {}).reduce((s, v) => s + v, 0) >= -100000;
    });
    let totalSharpInvested = 0;
    for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
      const sg = sharpPositions?.[sport] || {};
      for (const gd of Object.values(sg)) totalSharpInvested += gd.summary?.totalInvested || 0;
    }
    return {
      trackedCount: allEliteProven.length - totalExcluded,
      totalExcluded, mmExcluded, sportLosers,
      gamesWithPos: sharpPositions ? Object.values(sharpPositions.NHL || {}).length + Object.values(sharpPositions.CBB || {}).length + Object.values(sharpPositions.NBA || {}).length : 0,
      totalSharpPnl: cleanWallets.reduce((s, p) => s + (p.totalPnl || 0), 0),
      totalSharpInvested,
    };
  }, [whaleProfiles, sharpPositions]);

  const VAULT_SIZE = 10;

  const vaultData = useMemo(() => {
    if (!sportsSharps) return null;
    const entries = Object.entries(sportsSharps)
      .filter(([k]) => k !== '_meta')
      .map(([addr, w]) => ({
        wallet: addr,
        name: '***' + addr.slice(-4),
        totalPnl: w.totalPnl || 0,
        sportPnl: w.sportPnl || {},
        sportPnlTotal: w.sportPnlTotal || 0,
        sportMarkets: w.sportMarkets || {},
        marketsTraded: w.marketsTraded || 0,
        vol: w.vol || 0,
        roi: w.vol > 0 ? (w.totalPnl / w.vol) * 100 : 0,
        avgBet: w.marketsTraded > 0 ? w.vol / w.marketsTraded : 0,
        sportBets: Object.values(w.sportMarkets || {}).reduce((s, v) => s + v, 0),
        sportsProfitable: Object.values(w.sportPnl || {}).filter(v => v > 0).length,
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
            name: entry?.name || pos.name, sportPnl: entry?.sportPnl?.[sport] || 0,
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

    return { entries, todayPositions, convergences, activeCount, combinedPnl };
  }, [sportsSharps, sharpPositions]);

  if (loading || authLoading || subLoading) {
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '1rem' : '1.5rem 1rem' }}>
      <PageHeader sportFilter={sportFilter} setSportFilter={setSportFilter} viewMode={viewMode} setViewMode={setViewMode} isMobile={isMobile} />

      {/* ─── Sharp Vault View ─── */}
      {viewMode === 'sharpVault' && isFreeUser && (
        <SharpFlowPaywall isMobile={isMobile} pnlData={allTimePnL} />
      )}
      {viewMode === 'sharpVault' && !isFreeUser && vaultData && (() => {
        const { entries, todayPositions, convergences, activeCount, combinedPnl } = vaultData;
        const SPORT_COLORS = { NBA: '#FF8C00', NHL: '#D4AF37', MLB: '#E31837', CBB: '#FF6B35', NFL: '#4CAF50' };
        const sportIcons = { NBA: '\u{1F3C0}', NHL: '\u{1F3D2}', MLB: '\u26BE', CBB: '\u{1F3C0}', NFL: '\u{1F3C8}' };

        const filteredEntries = vaultSportFilter === 'ALL'
          ? entries
          : [...entries]
              .filter(e => (e.sportPnl[vaultSportFilter] || 0) > 0)
              .sort((a, b) => (b.sportPnl[vaultSportFilter] || 0) - (a.sportPnl[vaultSportFilter] || 0));

        const avgRoi = entries.length > 0 ? entries.reduce((s, e) => s + e.roi, 0) / entries.length : 0;

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
                    { label: 'AVG ROI', value: `${avgRoi.toFixed(1)}%`, color: avgRoi >= 1 ? '#22D3EE' : B.textSec },
                    { label: 'ACTIVE TODAY', value: String(activeCount), color: activeCount > 0 ? '#22D3EE' : B.textMuted },
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

            {/* Today's Convergence */}
            {convergences.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem',
                }}>
                  <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
                  <span style={{ ...T.label, color: B.gold, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Today's Convergence
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
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
                                  +{fmtVol(sh.sportPnl)} {c.sport}
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
              </div>
            )}
            {convergences.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '1.5rem', borderRadius: '12px',
                background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                border: `1px solid ${B.border}`, marginBottom: '1.5rem',
              }}>
                <Activity size={16} color={B.textMuted} style={{ marginBottom: '0.375rem', opacity: 0.5 }} />
                <div style={{ ...T.label, color: B.textMuted }}>No elite convergence detected today</div>
                <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.25rem' }}>Convergence fires when 2+ specialists align on the same side</div>
              </div>
            )}

            {/* Sport Filter + Leaderboard Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
                <span style={{ ...T.label, color: B.gold, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Leaderboard
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                {['ALL', 'NBA', 'NHL', 'MLB', 'CBB', 'NFL'].map(sp => (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredEntries.map((e, idx) => {
                const isExpanded = expandedVaultRow === e.wallet;
                const positions = todayPositions[e.wallet.toLowerCase()] || [];
                const isActive = positions.length > 0;
                const displayPnl = vaultSportFilter === 'ALL' ? e.sportPnlTotal : (e.sportPnl[vaultSportFilter] || 0);
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
                        gridTemplateColumns: isMobile ? '30px 1fr auto 18px' : '30px 1.4fr 1fr 0.6fr 0.6fr 0.5fr 18px',
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

                      {/* Name + Active */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
                        <span style={{
                          ...T.body, color: isTop3 ? B.text : B.textSec,
                          fontWeight: isTop3 ? 800 : 600,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          fontSize: isTop3 ? '0.9rem' : undefined,
                        }}>
                          {e.name}
                        </span>
                        {isActive && (
                          <span style={{
                            ...T.micro, padding: '0.1rem 0.35rem', borderRadius: '3px',
                            background: 'rgba(34,211,238,0.1)', color: '#22D3EE',
                            fontWeight: 700, fontSize: '0.5rem',
                            border: '1px solid rgba(34,211,238,0.2)',
                          }}>ACTIVE</span>
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
                          <span style={{ ...T.label, color: B.textMuted, fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
                            {fmtVol(e.avgBet)}
                          </span>
                          <div style={{ ...T.micro, color: B.textSubtle, fontSize: '0.5rem' }}>AVG BET</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ ...T.label, color: B.textMuted, fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
                            {e.marketsTraded.toLocaleString()}
                          </span>
                          <div style={{ ...T.micro, color: B.textSubtle, fontSize: '0.5rem' }}>BETS</div>
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
                          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                          gap: '0.5rem', marginBottom: '1rem',
                        }}>
                          {[
                            { label: 'SPORT P&L', value: `+${fmtVol(e.sportPnlTotal)}`, color: B.green },
                            { label: 'OVERALL P&L', value: `${e.totalPnl >= 0 ? '+' : ''}${fmtVol(e.totalPnl)}`, color: e.totalPnl >= 0 ? B.green : B.red },
                            { label: 'VOLUME', value: fmtVol(e.vol), color: B.textSec },
                            { label: 'ROI', value: `${e.roi >= 0 ? '+' : ''}${e.roi.toFixed(1)}%`, color: e.roi >= 5 ? B.green : e.roi >= 1 ? '#22D3EE' : B.textSec },
                            { label: 'AVG BET', value: fmtVol(e.avgBet), color: B.textSec },
                            { label: 'TOTAL BETS', value: e.marketsTraded.toLocaleString(), color: B.textSec },
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

                        {/* Sport Breakdown */}
                        <div style={{
                          display: 'flex', flexDirection: 'column', gap: '0.5rem',
                          marginBottom: positions.length > 0 ? '1rem' : 0,
                        }}>
                          <div style={{ ...T.micro, color: B.textMuted, fontWeight: 700, letterSpacing: '0.06em' }}>SPORT BREAKDOWN</div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {Object.entries(e.sportPnl)
                              .filter(([, v]) => v > 0)
                              .sort(([, a], [, b]) => b - a)
                              .map(([sport, pnl]) => {
                                const bets = e.sportMarkets[sport] || 0;
                                return (
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
                                      +{fmtVol(pnl)}
                                    </span>
                                    <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.525rem' }}>
                                      {sport} · {bets} bet{bets !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>

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
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: '0.625rem', marginBottom: '1.5rem',
            }}>
              <FlowStatCard icon={Eye} label="Sharp Bettors" value={sharpStats.trackedCount} accent={B.gold}
                hint={sharpStats.totalExcluded > 0 ? `${sharpStats.totalExcluded} non-sharp bettors filtered` : 'ELITE + PROVEN directional bettors'} />
              <FlowStatCard icon={DollarSign} label="Sharp Money Today" value={fmtVol(sharpStats.totalSharpInvested)} accent={B.green}
                hint="Total verified sharp $ on today's games" />
              <FlowStatCard icon={TrendingUp} label="Combined Lifetime P&L" value={`+${fmtVol(sharpStats.totalSharpPnl)}`} accent={B.green}
                hint="Aggregate P&L of all tracked sharp bettors" />
            </div>

            {/* ─── Pick Performance Tracker ─── */}
            {(() => {
              const hasData = allTimePnL && (allTimePnL.picks?.length > 0);
              const fp = hasData ? (filteredPnL || { pregame: allTimePnL.pregame, byStars: allTimePnL.byStars }) : null;
              const pnl = fp?.pregame || { wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0, record: '—' };
              const totalGraded = pnl.wins + pnl.losses + pnl.pushes;
              const winPct = totalGraded > 0 ? ((pnl.wins / totalGraded) * 100).toFixed(1) : '0.0';
              const roi = pnl.totalUnits > 0 ? ((pnl.totalProfit / pnl.totalUnits) * 100).toFixed(1) : '0.0';
              const stars = fp?.byStars || {};
              const isFiltered = perfDateRange !== 'all' || perfSport !== 'ALL' || perfMarket !== 'all' || perfGrowth !== 'all';
              const dateLabels = { today: 'Today', yesterday: 'Yesterday', '7d': 'Last 7 Days', '30d': 'Last 30 Days', all: 'All Time' };
              const growthLabels = { all: '', topPick: ' · ▲ Top Pick' };

              return (
                <div style={{ marginBottom: '1rem' }}>
                  <button onClick={() => setShowPerf(p => !p)} style={{
                    width: '100%', background: 'linear-gradient(135deg, rgba(21,25,35,0.95) 0%, rgba(26,31,46,0.8) 100%)',
                    border: `1px solid ${B.goldBorder}`, borderRadius: '10px', padding: '0.75rem 1rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <BarChart3 size={15} color={B.gold} />
                      <span style={{ ...T.micro, fontWeight: 800, color: B.gold, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Pick Performance
                      </span>
                      {hasData ? (
                        <span style={{
                          ...T.micro, fontWeight: 700, color: B.green, fontSize: '0.7rem',
                          background: B.greenDim, padding: '0.15rem 0.5rem', borderRadius: '4px',
                        }}>
                          {pnl.record} · {winPct}% · {pnl.totalProfit >= 0 ? '+' : ''}{pnl.totalProfit.toFixed(1)}u
                        </span>
                      ) : showPerf ? (
                        <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.65rem' }}>Loading...</span>
                      ) : null}
                    </div>
                    {showPerf ? <ChevronUp size={14} color={B.textMuted} /> : <ChevronDown size={14} color={B.textMuted} />}
                  </button>

                  {showPerf && !hasData && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(21,25,35,0.95) 0%, rgba(26,31,46,0.8) 100%)',
                      border: `1px solid ${B.border}`, borderTop: 'none',
                      borderRadius: '0 0 10px 10px', padding: '2rem',
                      marginTop: '-1px', textAlign: 'center',
                    }}>
                      <span style={{ ...T.label, color: B.textMuted }}>Loading performance data...</span>
                    </div>
                  )}

                  {showPerf && hasData && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(21,25,35,0.95) 0%, rgba(26,31,46,0.8) 100%)',
                      border: `1px solid ${B.border}`, borderTop: 'none',
                      borderRadius: '0 0 10px 10px', padding: '1rem',
                      marginTop: '-1px',
                    }}>
                      {/* Date range + Sport filters */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                          {[
                            { id: 'today', label: 'Today' },
                            { id: 'yesterday', label: 'Yesterday' },
                            { id: '7d', label: '7D' },
                            { id: '30d', label: '30D' },
                            { id: 'all', label: 'All Time' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setPerfDateRange(opt.id)} style={{
                              padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
                              ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                              border: perfDateRange === opt.id ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                              background: perfDateRange === opt.id ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
                              color: perfDateRange === opt.id ? B.gold : B.textMuted,
                              transition: 'all 0.2s ease',
                            }}>{opt.label}</button>
                          ))}
                          <span style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.125rem' }} />
                          {[
                            { id: 'ALL', label: 'ALL', color: B.gold },
                            { id: 'NHL', label: 'NHL', color: '#D4AF37' },
                            { id: 'CBB', label: 'CBB', color: '#FF6B35' },
                            { id: 'MLB', label: 'MLB', color: '#E31837' },
                            { id: 'NBA', label: 'NBA', color: '#FF8C00' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setPerfSport(opt.id)} style={{
                              padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
                              ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                              border: perfSport === opt.id ? `1px solid ${opt.color}33` : `1px solid ${B.border}`,
                              background: perfSport === opt.id ? `${opt.color}18` : 'transparent',
                              color: perfSport === opt.id ? opt.color : B.textMuted,
                              transition: 'all 0.2s ease',
                            }}>{opt.label}</button>
                          ))}
                          <span style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.125rem' }} />
                          {[
                            { id: 'all', label: 'All Markets' },
                            { id: 'ml', label: 'ML' },
                            { id: 'spread', label: 'Spread' },
                            { id: 'total', label: 'Total' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setPerfMarket(opt.id)} style={{
                              padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
                              ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                              border: perfMarket === opt.id ? `1px solid ${opt.id === 'spread' ? '#8B5CF633' : opt.id === 'total' ? '#F59E0B33' : B.goldBorder}` : `1px solid ${B.border}`,
                              background: perfMarket === opt.id ? (opt.id === 'spread' ? 'rgba(139,92,246,0.1)' : opt.id === 'total' ? 'rgba(245,158,11,0.1)' : B.goldDim) : 'transparent',
                              color: perfMarket === opt.id ? (opt.id === 'spread' ? '#8B5CF6' : opt.id === 'total' ? '#F59E0B' : B.gold) : B.textMuted,
                              transition: 'all 0.2s ease',
                            }}>{opt.label}</button>
                          ))}
                          <span style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.125rem' }} />
                          <button onClick={() => setPerfGrowth(perfGrowth === 'topPick' ? 'all' : 'topPick')} style={{
                            padding: '0.2rem 0.5rem', borderRadius: '5px', cursor: 'pointer',
                            ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                            border: perfGrowth === 'topPick' ? '1px solid rgba(212,175,55,0.45)' : `1px solid ${B.border}`,
                            background: perfGrowth === 'topPick' ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))' : 'transparent',
                            color: perfGrowth === 'topPick' ? '#D4AF37' : B.textMuted,
                            transition: 'all 0.2s ease',
                          }}>▲ Top Pick</button>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                        gap: '0.5rem', marginBottom: '1rem',
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ ...T.heading, color: B.text, fontSize: '1.1rem' }}>{pnl.record}</div>
                          <div style={{ ...T.micro, color: B.textMuted }}>RECORD</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ ...T.heading, color: B.green, fontSize: '1.1rem' }}>{winPct}%</div>
                          <div style={{ ...T.micro, color: B.textMuted }}>WIN RATE</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ ...T.heading, color: pnl.totalProfit >= 0 ? B.green : B.red, fontSize: '1.1rem' }}>
                            {pnl.totalProfit >= 0 ? '+' : ''}{pnl.totalProfit.toFixed(1)}u
                          </div>
                          <div style={{ ...T.micro, color: B.textMuted }}>PROFIT</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ ...T.heading, color: Number(roi) >= 0 ? B.green : B.red, fontSize: '1.1rem' }}>
                            {Number(roi) >= 0 ? '+' : ''}{roi}%
                          </div>
                          <div style={{ ...T.micro, color: B.textMuted }}>ROI</div>
                        </div>
                      </div>

                      <div style={{ borderTop: `1px solid ${B.border}`, paddingTop: '0.75rem' }}>
                        <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                          BY CONVICTION RATING
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          {[5, 4, 3, 2].map(n => {
                            const s = stars[n];
                            if (!s) return null;
                            const starLabels = { 5: 'ELITE', 4: 'STRONG', 3: 'SOLID', 2: 'DEVELOPING' };
                            const graded = s.wins + s.losses + s.pushes;
                            const sWinPct = graded > 0 ? ((s.wins / graded) * 100).toFixed(0) : '—';
                            return (
                              <div key={n} style={{
                                display: 'grid', gridTemplateColumns: '90px 1fr 60px 60px 60px',
                                alignItems: 'center', gap: '0.5rem',
                                padding: '0.4rem 0.5rem', borderRadius: '6px',
                                background: n === 5 ? B.goldDim : 'rgba(255,255,255,0.02)',
                                border: n === 5 ? `1px solid ${B.goldBorder}` : `1px solid transparent`,
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <span style={{ color: B.gold, fontSize: '0.65rem', letterSpacing: '-1px' }}>
                                    {'★'.repeat(n)}{'☆'.repeat(5 - n)}
                                  </span>
                                </div>
                                <div style={{
                                  height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                                }}>
                                  {graded > 0 && (
                                    <div style={{
                                      height: '100%', borderRadius: '2px', width: `${(s.wins / graded) * 100}%`,
                                      background: `linear-gradient(90deg, ${B.green}, ${B.green}cc)`,
                                    }} />
                                  )}
                                </div>
                                <span style={{ ...T.micro, color: B.textSec, textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                                  {s.record}
                                </span>
                                <span style={{ ...T.micro, color: graded > 0 ? B.text : B.textMuted, textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                                  {sWinPct}{graded > 0 ? '%' : ''}
                                </span>
                                <span style={{
                                  ...T.micro, textAlign: 'right', fontFeatureSettings: "'tnum'",
                                  color: s.totalProfit > 0 ? B.green : s.totalProfit < 0 ? B.red : B.textMuted,
                                }}>
                                  {s.totalProfit > 0 ? '+' : ''}{s.totalProfit.toFixed(1)}u
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.5rem', fontSize: '0.55rem', opacity: 0.6 }}>
                          {totalGraded} graded picks{isFiltered ? ` · ${dateLabels[perfDateRange]}${perfSport !== 'ALL' ? ` · ${perfSport}` : ''}${perfMarket !== 'all' ? ` · ${perfMarket.toUpperCase()}` : ''}${growthLabels[perfGrowth]}` : ' since Mar 16'}
                        </div>

                        <SharpFlowProfitChart picks={(() => {
                          const raw = allTimePnL?.picks || [];
                          if (!isFiltered) return raw;
                          return raw.filter(p => {
                            if (perfSport !== 'ALL' && p.sport !== perfSport) return false;
                            if (perfGrowth === 'topPick') { const d = (p.lockStars != null ? p.stars - p.lockStars : 0); if (d < 1.0) return false; }
                            else if (perfGrowth === 'golden') { const d = (p.lockStars != null ? p.stars - p.lockStars : 0); const e = (p.peakEV != null && p.lockEV != null ? p.peakEV - p.lockEV : 0); if (d < 1.0 || e <= 0) return false; }
                            if (perfDateRange === 'all') return true;
                            const now = new Date();
                            const todayS = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                            const yesterdayS = new Date(now.getTime() - 86400000).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                            if (perfDateRange === 'today') return p.date === todayS;
                            if (perfDateRange === 'yesterday') return p.date === yesterdayS;
                            const daysMap = { '7d': 7, '30d': 30 };
                            if (daysMap[perfDateRange]) { const dd = new Date(now); dd.setDate(dd.getDate() - daysMap[perfDateRange]); return p.date >= dd.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); }
                            return true;
                          });
                        })()} />

                        {/* CLV Metrics */}
                        {(() => {
                          const rawP = fp?.pregame ? (filteredPnL ? (allTimePnL?.picks || []).filter(p => {
                            if (perfSport !== 'ALL' && p.sport !== perfSport) return false;
                            if (perfMarket !== 'all' && (p.marketType || 'ml') !== perfMarket) return false;
                            if (perfGrowth === 'topPick') { const d = (p.lockStars != null ? p.stars - p.lockStars : 0); if (d < 1.0) return false; }
                            else if (perfGrowth === 'golden') { const d = (p.lockStars != null ? p.stars - p.lockStars : 0); const e = (p.peakEV != null && p.lockEV != null ? p.peakEV - p.lockEV : 0); if (d < 1.0 || e <= 0) return false; }
                            if (perfDateRange === 'all') return true;
                            const now = new Date();
                            const todayS = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                            const yesterdayS = new Date(now.getTime() - 86400000).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                            if (perfDateRange === 'today') return p.date === todayS;
                            if (perfDateRange === 'yesterday') return p.date === yesterdayS;
                            const daysMap = { '7d': 7, '30d': 30 };
                            if (daysMap[perfDateRange]) {
                              const d = new Date(now); d.setDate(d.getDate() - daysMap[perfDateRange]);
                              return p.date >= d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                            }
                            return true;
                          }) : allTimePnL?.picks || []) : [];
                          const clvPicks = rawP.filter(p => p.clv != null && p.outcome);
                          if (clvPicks.length === 0) return null;
                          const avgCLV = clvPicks.reduce((s, p) => s + p.clv, 0) / clvPicks.length;
                          const clvPositive = clvPicks.filter(p => p.clv > 0).length;
                          const clvPosRate = (clvPositive / clvPicks.length * 100).toFixed(0);
                          return (
                            <div style={{ borderTop: `1px solid ${B.border}`, paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                              <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                                CLV — CLOSING LINE VALUE
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                <div style={{ textAlign: 'center', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                                  <div style={{ ...T.heading, fontSize: '1rem', color: avgCLV > 0 ? B.green : avgCLV < 0 ? B.red : B.text }}>
                                    {avgCLV > 0 ? '+' : ''}{(avgCLV * 100).toFixed(1)}%
                                  </div>
                                  <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem' }}>AVG CLV</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                                  <div style={{ ...T.heading, fontSize: '1rem', color: Number(clvPosRate) >= 50 ? B.green : B.red }}>
                                    {clvPosRate}%
                                  </div>
                                  <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem' }}>BEAT CLOSE</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                                  <div style={{ ...T.heading, fontSize: '1rem', color: B.text }}>
                                    {clvPicks.length}
                                  </div>
                                  <div style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem' }}>CLV PICKS</div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ─── Sharp Positions Section ─── */}
            {sharpStats.gamesWithPos > 0 && (() => {
              const allPosGames = [];
              const nowMs = Date.now();
              for (const sport of ['NHL', 'CBB', 'MLB', 'NBA']) {
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
                  const cOdds = cSide === 'away' ? pg?.current?.away : pg?.current?.home;
                  const bRetail = cSide === 'away' ? pg?.bestAway : pg?.bestHome;
                  const pProb = impliedProb(cOdds);
                  if (pProb != null && pProb >= 0.85) continue;
                  const rProb = impliedProb(bRetail);
                  const ev = (pProb && rProb) ? +((pProb - rProb) * 100).toFixed(1) : null;
                  const pinnConf = pg?.movement?.direction === cSide;
                  const cOpenOdds = cSide === 'away' ? pg?.opener?.away : pg?.opener?.home;
                  const cCurOdds = cSide === 'away' ? pg?.current?.away : pg?.current?.home;
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
                  const oSr = rateStars({
                    evEdge: oEv || 0, pinnConfirms: oPinnConf,
                    pinnMovingWith: oPinnMoveWith, pinnMovingAgainst: oPinnMoveAgainst,
                    polyMovingWith: oPolyMoveWith,
                    breadth: osf.breadth, conviction: osf.conviction,
                    concentration: osf.concentration, counterSharpScore: osf.counterSharpScore,
                    consensusTier: osf.consensusTier,
                    sportSharpCount: osf.sportSharpCount,
                    odds: oBetOdds, sport,
                  });

                  const sortFlowGame = gameFlowMap?.[`${sport}_${key}`];
                  const sortTicketOnCon = sortFlowGame
                    ? (cSide === 'away' ? sortFlowGame.awayTicketPct : sortFlowGame.homeTicketPct) || 0
                    : 0;
                  const sortFlowDiv = sortFlowGame?.ticketDivergence || 0;
                  const sortRLM = sortTicketOnCon < 50 && sortFlowDiv >= 10;

                  const cBetOdds = bRetail || cOdds;
                  const sr = rateStars({
                    evEdge: ev || 0, pinnConfirms: pinnConf,
                    pinnMovingWith: pinnMoveWith, pinnMovingAgainst: pinnMoveAgainst,
                    polyMovingWith: polyMoveWith, oppPeakStars: oSr.stars,
                    breadth: sf.breadth, conviction: sf.conviction,
                    concentration: sf.concentration, counterSharpScore: sf.counterSharpScore,
                    consensusTier: sf.consensusTier,
                    isRLM: sortRLM, ticketDivergence: sortFlowDiv,
                    sportSharpCount: sf.sportSharpCount,
                    odds: cBetOdds, sport,
                  });

                  if (sortBy === 'locked') continue;
                  if (sortBy === 'myPicks' && !userPicks[key]) continue;
                  if (sortBy === 'live' && !isLive) continue;
                  if (sortBy !== 'live' && sortBy !== 'myPicks' && isLive) continue;

                  allPosGames.push({ key, sport, ...gd, _commence: ct, _isLive: isLive, _stars: sr.stars, _ev: ev, _wallets: cWallets + oWallets, _invested: ss.totalInvested || 0 });
                }
              }

              const sortFns = {
                stars: (a, b) => b._stars - a._stars || b._invested - a._invested,
                live: (a, b) => b._invested - a._invested,
                time: (a, b) => (a._commence || Infinity) - (b._commence || Infinity),
                edge: (a, b) => b._ev - a._ev || b._stars - a._stars,
                money: (a, b) => b._invested - a._invested,
                wallets: (a, b) => b._wallets - a._wallets || b._invested - a._invested,
                myPicks: (a, b) => b._stars - a._stars || b._invested - a._invested,
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
                  {/* Sort bar */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.75rem', flexWrap: 'wrap',
                  }}>
                    <span style={{ ...T.micro, color: B.textMuted, fontWeight: 600 }}>Sort:</span>
                    {[
                      { id: 'stars', label: '★ Rating' },
                      { id: 'time', label: '⏱ Game Time' },
                      { id: 'edge', label: '+EV Edge' },
                      { id: 'money', label: '$ Invested' },
                      { id: 'wallets', label: '# Sharps' },
                      { id: 'live', label: '● Live' },
                      { id: 'locked', label: '🔒 Locked' },
                      { id: 'myPicks', label: '⭐ My Watchlist' },
                    ].map(opt => {
                      const isActive = sortBy === opt.id;
                      const accentMap = { live: { border: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.12)', color: B.red }, locked: { border: 'rgba(16,185,129,0.4)', bg: B.greenDim, color: B.green }, myPicks: { border: 'rgba(99,102,241,0.4)', bg: 'rgba(99,102,241,0.12)', color: '#818CF8' } };
                      const ac = accentMap[opt.id];
                      return (
                      <button key={opt.id} onClick={() => setSortBy(opt.id)} style={{
                        padding: '0.25rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
                        ...T.micro, fontWeight: 700,
                        border: isActive
                          ? `1px solid ${ac?.border || B.goldBorder}`
                          : `1px solid ${B.border}`,
                        background: isActive
                          ? ac?.bg || `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                          : 'transparent',
                        color: isActive
                          ? ac?.color || B.gold
                          : B.textMuted,
                        transition: 'all 0.2s ease',
                      }}>{opt.label}{opt.id === 'myPicks' && Object.keys(userPicks).length > 0 ? ` (${Object.keys(userPicks).length})` : ''}</button>
                      );
                    })}
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
                        const peak = sd.peak || sd.lock || {};
                        const lock = sd.lock || {};
                        const stars = peak.stars || lock.stars || 0;
                        if (stars < 2.5) continue;
                        const units = peak.units || lock.units || 1;
                        const profit = sd.result?.outcome === 'WIN' ? (sd.result?.profit || 0) : sd.result?.outcome === 'LOSS' ? -(units) : 0;
                        const lockOddsValid = lock.odds && Math.abs(lock.odds) <= 400;
                        const lockStars = lock.stars || 0;
                        allLockedArr.push({
                          key: `${docId}:${sideKey}`,
                          team: sd.team || sideKey,
                          away: doc.away || '', home: doc.home || '',
                          sport: docSport, stars, lockStars, units,
                          odds: lockOddsValid ? lock.odds : (peak.odds || lock.odds || 0),
                          book: lockOddsValid ? (lock.book || peak.book || '') : (peak.book || lock.book || ''),
                          peakAt: peak.updatedAt || lock.lockedAt,
                          lockedAt: lock.lockedAt || null,
                          gameTime: doc.commenceTime,
                          status: sd.status || doc.status || 'PENDING',
                          outcome: sd.result?.outcome || null,
                          profit,
                          lockPinnOdds: peak.pinnacleOdds || lock.pinnacleOdds || null,
                          closingOdds: sd.closingOdds || null,
                          clv: sd.result?.clv ?? null,
                          sharpCount: peak.sharpCount || lock.sharpCount || null,
                          totalInvested: peak.totalInvested || lock.totalInvested || null,
                          evEdge: peak.evEdge ?? lock.evEdge ?? null,
                          lockEV: lock.evEdge ?? null,
                          criteriaMet: peak.criteriaMet || lock.criteriaMet || 0,
                          criteria: peak.criteria || lock.criteria || null,
                          consensusStrength: (() => {
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
                          pinnacleOdds: peak.pinnacleOdds || lock.pinnacleOdds || null,
                          marketType: doc.marketType || 'ml',
                          line: peak.line || lock.line || null,
                          superseded: !!sd.superseded,
                        });
                      }
                    }
                    const sportFiltered = lockedSportFilter === 'All' ? allLockedArr : allLockedArr.filter(p => p.sport === lockedSportFilter);
                    const lockedArr = lockedMarketFilter === 'all' ? sportFiltered : sportFiltered.filter(p => (p.marketType || 'ml') === lockedMarketFilter);
                    const filteredLocked = lockedStatusFilter === 'all' ? lockedArr
                      : lockedStatusFilter === 'pending' ? lockedArr.filter(p => !p.outcome)
                      : lockedStatusFilter === 'won' ? lockedArr.filter(p => p.outcome === 'WIN')
                      : lockedArr.filter(p => p.outcome === 'LOSS');
                    filteredLocked.sort((a, b) => {
                      if (a.superseded !== b.superseded) return a.superseded ? 1 : -1;
                      const aDelta = (a.lockStars != null ? a.stars - a.lockStars : 0);
                      const bDelta = (b.lockStars != null ? b.stars - b.lockStars : 0);
                      const aTop = aDelta >= 1.0 ? 1 : 0;
                      const bTop = bDelta >= 1.0 ? 1 : 0;
                      if (aTop !== bTop) return bTop - aTop;
                      if (lockedSort === 'stars') return b.stars - a.stars || b.units - a.units;
                      const tA = a.gameTime ? new Date(a.gameTime).getTime() : 0;
                      const tB = b.gameTime ? new Date(b.gameTime).getTime() : 0;
                      return tA - tB || b.stars - a.stars;
                    });
                    const pendingCount = lockedArr.filter(p => !p.outcome).length;
                    const wonCount = lockedArr.filter(p => p.outcome === 'WIN').length;
                    const lostCount = lockedArr.filter(p => p.outcome === 'LOSS').length;
                    const sportCounts = {};
                    allLockedArr.forEach(p => { sportCounts[p.sport] = (sportCounts[p.sport] || 0) + 1; });
                    const sportColorMap = { NHL: '#D4AF37', MLB: '#E31837', NBA: '#FF8C00', CBB: '#FF6B35', NFL: '#4CAF50' };
                    const activeSports = Object.keys(sportCounts).sort();
                    return (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          {[
                            { id: 'today', label: 'Today' },
                            { id: 'yesterday', label: 'Yesterday' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setLockedDay(opt.id)} style={{
                              padding: '0.2rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
                              ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                              border: lockedDay === opt.id ? '1px solid rgba(16,185,129,0.4)' : `1px solid ${B.border}`,
                              background: lockedDay === opt.id ? B.greenDim : 'transparent',
                              color: lockedDay === opt.id ? B.green : B.textMuted,
                              transition: 'all 0.2s ease',
                            }}>{opt.label}</button>
                          ))}
                          <span style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.125rem' }} />
                          {[
                            { id: 'all', label: `All (${lockedArr.length})` },
                            { id: 'pending', label: `Pending (${pendingCount})` },
                            { id: 'won', label: `Won (${wonCount})`, color: B.green },
                            { id: 'lost', label: `Lost (${lostCount})`, color: B.red },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setLockedStatusFilter(opt.id)} style={{
                              padding: '0.2rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
                              ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                              border: lockedStatusFilter === opt.id ? `1px solid ${(opt.color || B.gold)}44` : `1px solid ${B.border}`,
                              background: lockedStatusFilter === opt.id ? `${(opt.color || B.gold)}18` : 'transparent',
                              color: lockedStatusFilter === opt.id ? (opt.color || B.gold) : B.textMuted,
                              transition: 'all 0.2s ease',
                            }}>{opt.label}</button>
                          ))}
                          <span style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.125rem' }} />
                          {[{ id: 'All', label: 'All', color: B.gold }, ...activeSports.map(s => ({ id: s, label: s, color: sportColorMap[s] || B.gold }))].map(opt => (
                            <button key={opt.id} onClick={() => setLockedSportFilter(opt.id)} style={{
                              padding: '0.2rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
                              ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                              border: lockedSportFilter === opt.id ? `1px solid ${opt.color}44` : `1px solid ${B.border}`,
                              background: lockedSportFilter === opt.id ? `${opt.color}18` : 'transparent',
                              color: lockedSportFilter === opt.id ? opt.color : B.textMuted,
                              transition: 'all 0.2s ease',
                            }}>{opt.label}{opt.id !== 'All' && sportCounts[opt.id] ? ` (${sportCounts[opt.id]})` : ''}</button>
                          ))}
                          <span style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.125rem' }} />
                          {[
                            { id: 'all', label: 'All Markets', color: B.gold },
                            { id: 'ml', label: 'ML', color: B.green },
                            { id: 'spread', label: 'Spread', color: '#8B5CF6' },
                            { id: 'total', label: 'Total', color: '#F59E0B' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setLockedMarketFilter(opt.id)} style={{
                              padding: '0.2rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
                              ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                              border: lockedMarketFilter === opt.id ? `1px solid ${opt.color}44` : `1px solid ${B.border}`,
                              background: lockedMarketFilter === opt.id ? `${opt.color}18` : 'transparent',
                              color: lockedMarketFilter === opt.id ? opt.color : B.textMuted,
                              transition: 'all 0.2s ease',
                            }}>{opt.label}</button>
                          ))}
                          <span style={{ width: '1px', height: '14px', background: B.border, margin: '0 0.125rem' }} />
                          {[
                            { id: 'stars', label: 'Rating' },
                            { id: 'time', label: 'Game Time' },
                          ].map(opt => (
                            <button key={opt.id} onClick={() => setLockedSort(opt.id)} style={{
                              padding: '0.2rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
                              ...T.micro, fontWeight: 700, fontSize: '0.6rem',
                              border: lockedSort === opt.id ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                              background: lockedSort === opt.id ? B.goldDim : 'transparent',
                              color: lockedSort === opt.id ? B.gold : B.textMuted,
                              transition: 'all 0.2s ease',
                            }}>{opt.label}</button>
                          ))}
                        </div>
                        {filteredLocked.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '2rem', color: B.textMuted, ...T.label }}>
                            {lockedArr.length === 0
                              ? `No locked picks for ${lockedDay === 'today' ? 'today' : 'yesterday'}`
                              : `No ${lockedStatusFilter === 'pending' ? 'pending' : lockedStatusFilter === 'won' ? 'winning' : 'losing'} picks`}
                          </div>
                        ) : (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : filteredLocked.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                            gap: '0.75rem',
                          }}>
                            {filteredLocked.map(p => (
                              <LockedPickCard key={p.key} pick={p} isMobile={isMobile} />
                            ))}
                          </div>
                        )}
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
                          <span style={{ color: B.gold, fontWeight: 700 }}>ELITE</span> = $100K+ lifetime profit
                        </span>
                        <span style={{ ...T.micro, color: B.textSec }}>
                          <span style={{ color: B.green, fontWeight: 700 }}>PROVEN</span> = $25K+ lifetime profit
                        </span>
                        <span style={{ ...T.micro, color: B.textSec }}>
                          <span style={{ fontWeight: 700, color: B.green }}>+$5.5M</span> = all-time P&L on Polymarket
                        </span>
                        <span style={{ ...T.micro, color: B.textSec }}>
                          <span style={{ fontWeight: 700, color: B.green }}>+EV</span> = retail book price beats Pinnacle fair value
                        </span>
                        {sharpStats.totalExcluded > 0 && (
                          <span style={{ ...T.micro, color: B.textSec }}>
                            <span style={{ fontWeight: 700, color: B.red }}>FILTERED</span> = {sharpStats.mmExcluded} MMs + {sharpStats.sportLosers} sport losers removed
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
                      ) : (
                        <>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : allPosGames.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                            gap: '0.75rem',
                          }}>
                            {(isFreeUser ? allPosGames.slice(0, 1) : allPosGames).map(gd => (
                              <SharpPositionCard key={gd.key} gd={gd} pinnacleHistory={pinnacleHistory} polyData={polyData} isMobile={isMobile} onPickSynced={onPickSynced} isMyPick={!!userPicks[gd.key]} onToggleMyPick={onToggleMyPick} canPickGames={!!(user && isPremium)} gameFlowMap={gameFlowMap} spreadPositions={spreadPositions} totalPositions={totalPositions} />
                            ))}
                          </div>
                          {isFreeUser && <SharpFlowPaywall isMobile={isMobile} lockedCount={allPosGames.length > 1 ? allPosGames.length - 1 : 0} pnlData={allTimePnL} />}
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })()}

            {sharpStats.gamesWithPos === 0 && (
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

const FlowStatCard = memo(function FlowStatCard({ icon: Icon, label, value, accent, hint }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
      padding: '0.875rem 1.25rem 0.625rem', borderRadius: '10px',
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
      {hint && (
        <span style={{
          ...T.micro, color: B.textSec, fontSize: '0.55rem', marginTop: '0.2rem',
          textAlign: 'center', lineHeight: 1.3, opacity: 0.7,
        }}>{hint}</span>
      )}
    </div>
  );
});

function SportTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.375rem' }}>
      {['All', 'CBB', 'NHL', 'MLB', 'NBA'].map(key => {
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
  const picks = (pnlData?.picks || []).filter(p => p.outcome);
  const wins = picks.filter(p => p.outcome === 'WIN').length;
  const losses = picks.filter(p => p.outcome === 'LOSS').length;
  const pushes = picks.filter(p => p.outcome === 'PUSH').length;
  const graded = wins + losses + pushes;
  const totalProfit = picks.reduce((s, p) => s + (p.profit || 0), 0);
  const totalUnits = picks.reduce((s, p) => s + (p.units || 1), 0);
  const winPct = graded > 0 ? ((wins / graded) * 100).toFixed(1) : null;
  const roi = totalUnits > 0 ? ((totalProfit / totalUnits) * 100).toFixed(1) : null;
  const profitStr = graded > 0 ? (totalProfit >= 0 ? `+${totalProfit.toFixed(1)}u` : `${totalProfit.toFixed(1)}u`) : null;

  const features = [
    'Verified sharp bettor tracking in real time',
    'Pinnacle fair value + best retail EV edge',
    'Auto-locked plays with smart unit sizing',
    'Full market flow — tickets, money, & whale action',
    'Line movement alerts + reverse line moves',
    'Complete performance dashboard with ROI tracking',
  ];

  return (
    <div style={{
      marginTop: '2rem', borderRadius: '16px', overflow: 'hidden',
      background: `linear-gradient(135deg, rgba(212,175,55,0.06) 0%, ${B.card} 30%, rgba(16,185,129,0.04) 100%)`,
      border: `1px solid rgba(212,175,55,0.25)`,
      boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
    }}>
      <div style={{ padding: isMobile ? '2rem 1.25rem' : '2.5rem 2rem' }}>

        {graded > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem',
            marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem',
          }}>
            {[
              { label: 'WIN RATE', value: `${winPct}%`, color: parseFloat(winPct) >= 55 ? B.green : B.text },
              { label: 'PROFIT', value: profitStr, color: totalProfit >= 0 ? B.green : B.red },
              { label: 'ROI', value: `${roi > 0 ? '+' : ''}${roi}%`, color: parseFloat(roi) >= 0 ? B.green : B.red },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: 'center', padding: '0.75rem 0.5rem', borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)', border: `1px solid ${B.border}`,
              }}>
                <div style={{ fontSize: isMobile ? '1.25rem' : '1.4rem', fontWeight: 900, color: s.color, fontFeatureSettings: "'tnum'" }}>
                  {s.value}
                </div>
                <div style={{ ...T.micro, color: B.textMuted, fontWeight: 700, letterSpacing: '0.06em', marginTop: '0.2rem' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Lock size={36} color={B.gold} style={{ marginBottom: '0.75rem', opacity: 0.85 }} />
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: 900,
            color: B.text, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em',
          }}>
            {lockedCount ? <><span style={{ color: B.gold }}>{lockedCount} more game{lockedCount !== 1 ? 's' : ''}</span> locked</> : <>Sharp Flow is <span style={{ color: B.gold }}>Pro Only</span></>}
          </h2>
          <p style={{
            ...T.body, color: B.textSec, margin: '0 auto', maxWidth: '520px', lineHeight: 1.65,
          }}>
            {lockedCount
              ? <>Upgrade to unlock all sharp intel cards, auto-locked plays, the Sharp Vault, and full performance tracking.</>
              : <>We track <span style={{ color: B.text, fontWeight: 700 }}>200+ verified sharp bettors</span> across
            prediction markets, surface their real positions on today's games, and combine it with Pinnacle
            fair odds, EV edges, and full market flow — so you bet with an edge, not a hunch.</>}
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '0.5rem 1.5rem', marginBottom: '1.75rem', maxWidth: '540px', margin: '0 auto 1.75rem',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={13} color={B.green} />
              <span style={{ ...T.label, color: B.textSec }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: isMobile ? '1.25rem' : '1.5rem',
          border: `1px solid ${B.border}`, maxWidth: '480px', margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: isMobile ? '2rem' : '2.25rem', fontWeight: 900, color: B.green }}>$25.99</span>
            <span style={{ ...T.body, color: B.textSec, fontWeight: 600 }}>/mo</span>
          </div>

          <div style={{
            textAlign: 'center', marginBottom: '0.75rem',
            padding: '0.5rem 0.75rem', borderRadius: '8px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          }}>
            <span style={{ ...T.label, color: '#818CF8', fontWeight: 800 }}>5-DAY FREE TRIAL</span>
            <span style={{ ...T.micro, color: B.textSec, marginLeft: '0.4rem' }}>— full access, cancel anytime</span>
          </div>

          <a href="#/pricing" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: '8px',
            background: `linear-gradient(135deg, ${B.green}, #059669)`,
            color: '#fff', fontWeight: 800, fontSize: isMobile ? '1rem' : '0.95rem',
            textDecoration: 'none', letterSpacing: '0.01em',
            boxShadow: '0 2px 12px rgba(16,185,129,0.3)',
          }}>
            Start Free Trial →
          </a>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: '1rem',
            marginTop: '0.75rem',
          }}>
            <span style={{ ...T.micro, color: B.textMuted }}>✓ 5 days free</span>
            <span style={{ ...T.micro, color: B.textMuted }}>✓ Cancel anytime</span>
            <span style={{ ...T.micro, color: B.textMuted }}>✓ All picks verified</span>
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

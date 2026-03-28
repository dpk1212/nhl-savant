/**
 * Sharp Flow — Premium Whale Trade Intelligence
 *
 * Game-centric view: every game's full money story in one place.
 * Sharp Signals surface where money disagrees with tickets (the edge).
 * Expandable game cards show individual whale trades in context.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Activity, Zap, BarChart3, Eye, ArrowUpRight, ArrowDownRight, Minus, DollarSign, Workflow, Lock, CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';
import { resolveOutcomeSide } from '../utils/teamNameMapper';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
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
  return { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', icon: '🏒' };
}

function tierInfo(amt) {
  if (amt >= 10_000) return { label: 'WHALE', color: B.gold,  bg: B.goldDim };
  if (amt >= 5_000)  return { label: 'SHARK', color: B.gold,  bg: B.goldDim };
  if (amt >= 1_000)  return { label: 'SHARP', color: B.sky,   bg: B.blueDim };
  return null;
}

// ─── Sharp Flow Unit Sizing ───────────────────────────────────────────────────

function consensusGrade(moneyPct, walletPct) {
  const avg = (moneyPct + walletPct) / 2;
  if (avg >= 80) return { label: 'DOMINANT', color: B.green, penalty: 0, score: avg };
  if (avg >= 65) return { label: 'STRONG', color: B.green, penalty: 0, score: avg };
  if (avg >= 55) return { label: 'LEAN', color: B.gold, penalty: -0.5, score: avg };
  return { label: 'CONTESTED', color: B.red, penalty: -1, score: avg };
}

function calculateUnits(stars, consensusPenalty = 0) {
  let units = stars >= 5 ? 3.5 : stars >= 4.5 ? 3 : stars >= 4 ? 2.5 : stars >= 3.5 ? 2 : 1.5;
  units += consensusPenalty;
  return Math.min(Math.max(units, 0.5), 5);
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

// ─── Sharp Flow Locked Picks — Firebase ───────────────────────────────────────

function todayET() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function gameDate(commenceTime) {
  if (!commenceTime) return todayET();
  return new Date(commenceTime).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars) {
  const now = Date.now();
  const tier = unitTier(units).label;
  const snapshot = { odds, book, pinnacleOdds, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units, unitTier: tier, consensusStrength, stars: stars || 0 };
  return {
    team,
    lock: { ...snapshot, lockedAt: now },
    peak: { ...snapshot, updatedAt: now },
    status: 'PENDING',
    result: { outcome: null, profit: null, gradedAt: null },
  };
}

async function syncPickToFirebase({ date, sport, gameKey, away, home, commenceTime, side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars }) {
  try {
    const docId = `${date}_${gameKey}`;
    const ref = doc(db, 'sharpFlowPicks', docId);
    const existing = await getDoc(ref);

    if (!existing.exists()) {
      const sideData = buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars);
      await setDoc(ref, {
        date, sport, gameKey, away, home, commenceTime: commenceTime || null,
        lockType: 'PREGAME',
        sides: { [side]: sideData },
        status: 'PENDING',
        result: { awayScore: null, homeScore: null, winner: null },
      });
      return { docId, action: 'created' };
    }

    const data = existing.data();
    const sides = data.sides || {};

    if (sides[side]) {
      const currentPeak = sides[side].peak?.units || 0;
      const currentPeakStars = sides[side].peak?.stars || 0;
      if (units > currentPeak || stars > currentPeakStars) {
        const tier = unitTier(units).label;
        await setDoc(ref, {
          sides: { [side]: { peak: { odds, book, pinnacleOdds, evEdge: evEdge || 0, criteriaMet, criteria, sharpCount, totalInvested, units, unitTier: tier, consensusStrength, stars: stars || 0, updatedAt: Date.now() } } }
        }, { merge: true });
        return { docId, action: 'peak_updated' };
      }
      return { docId, action: 'no_change' };
    }

    const sideData = buildSideData(side, team, odds, book, pinnacleOdds, evEdge, criteriaMet, criteria, sharpCount, totalInvested, units, consensusStrength, stars);
    await setDoc(ref, { sides: { [side]: sideData } }, { merge: true });
    return { docId, action: 'side_added' };
  } catch (err) {
    console.warn('Failed to sync pick:', err.message);
    return { docId: `${date}_${gameKey}`, action: 'error' };
  }
}

async function loadLockedPicks() {
  try {
    const today = todayET();
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const q = query(
      collection(db, 'sharpFlowPicks'),
      where('date', 'in', [today, yesterday]),
    );
    const snap = await getDocs(q);
    const picks = {};
    snap.forEach(d => { picks[d.id] = d.data(); });
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
        if (sideData.result?.outcome === 'WIN') { wins++; totalProfit += (sideData.result?.profit || 0); }
        else if (sideData.result?.outcome === 'LOSS') { losses++; totalProfit -= u; }
        else if (sideData.result?.outcome === 'PUSH') { pushes++; }
      }
    } else {
      if (data.status !== 'COMPLETED') return;
      const u = data.units || 1;
      totalUnits += u;
      if (data.result?.outcome === 'WIN') { wins++; totalProfit += (data.result?.profit || 0); }
      else if (data.result?.outcome === 'LOSS') { losses++; totalProfit -= u; }
      else if (data.result?.outcome === 'PUSH') { pushes++; }
    }
  });
  return { wins, losses, pushes, totalProfit: +totalProfit.toFixed(2), totalUnits, record: `${wins}-${losses}${pushes > 0 ? `-${pushes}` : ''}` };
}

function estimateStarsFromSnap(snap) {
  if (!snap) return 3;
  let pts = 0;
  const sc = snap.sharpCount || 0;
  if (sc >= 5) pts += 3; else if (sc >= 3) pts += 2; else if (sc >= 1) pts += 1;
  const inv = snap.totalInvested || 0;
  if (inv >= 25000) pts += 2; else if (inv >= 7000) pts += 1; else pts -= 1;
  const ev = snap.evEdge || 0;
  if (ev > 3) pts += 2; else if (ev > 0) pts += 1;
  if (snap.criteria?.pinnacleConfirms) pts += 1;
  if (snap.criteria?.lineMovingWith) pts += 1;
  const cg = snap.consensusStrength?.grade || '';
  if (cg === 'DOMINANT') pts += 1.5; else if (cg === 'STRONG') pts += 1; else if (cg === 'LEAN') pts += 0.5; else if (cg === 'CONTESTED') pts -= 1.5;
  if (snap.criteria?.predMarketAligns) pts += 0.5;
  const raw = (pts / 11) * 5;
  return Math.min(5, Math.max(0.5, Math.round(raw * 2) / 2));
}

async function loadAllTimePnL() {
  try {
    const cacheKey = 'sharpFlow_pnl_v7';
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < 30 * 60 * 1000 && data.picks) return data;
    }
    const snap = await getDocs(collection(db, 'sharpFlowPicks'));
    const overall = tallySides(snap);

    const byStars = {};
    const picks = [];
    const starBucket = (s) => s >= 4.5 ? 5 : s >= 3.5 ? 4 : s >= 2.5 ? 3 : s >= 1.5 ? 2 : 1;
    const emptyBucket = () => ({ wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0, totalPicks: 0, label: '' });
    const STARS_LIVE_DATE = '2026-03-26';
    snap.forEach(d => {
      const data = d.data();
      const isPostDeploy = data.date >= STARS_LIVE_DATE;
      const processSide = (sd) => {
        const bestSnap = sd.peak || sd.lock;
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
        if (pickStars >= 3) {
          const pick = { date: data.date, sport: data.sport || 'NHL', stars: pickStars, units: u, status: sd.status || 'PENDING', outcome: null, profit: 0 };
          if (sd.status === 'COMPLETED') {
            pick.outcome = sd.result?.outcome || null;
            if (sd.result?.outcome === 'WIN') { pick.profit = sd.result?.profit || 0; }
            else if (sd.result?.outcome === 'LOSS') { pick.profit = -u; }
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
        if (pickStars >= 3) {
          const pick = { date: data.date, sport: data.sport || 'NHL', stars: pickStars, units: u, status: data.status || 'PENDING', outcome: null, profit: 0 };
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

// ─── Data Loading ─────────────────────────────────────────────────────────────

function useMarketData() {
  const [polyData, setPolyData] = useState(null);
  const [kalshiData, setKalshiData] = useState(null);
  const [whaleProfiles, setWhaleProfiles] = useState(null);
  const [pinnacleHistory, setPinnacleHistory] = useState(null);
  const [sharpPositions, setSharpPositions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}polymarket_data.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}kalshi_data.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}whale_profiles.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}pinnacle_history.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}sharp_positions.json`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([p, k, wp, ph, sp]) => {
      setPolyData(p);
      setKalshiData(k);
      setWhaleProfiles(wp);
      setPinnacleHistory(ph);
      setSharpPositions(sp);
      setLoading(false);
    });
  }, []);

  return { polyData, kalshiData, whaleProfiles, pinnacleHistory, sharpPositions, loading };
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

      games.push({
        key, sport, away, home, awayProb, homeProb, volume,
        awayTicketPct, homeTicketPct, awayMoneyPct, homeMoneyPct,
        totalTrades, totalCash, whaleCount, whaleCash,
        allWhales, ticketDivergence,
        priceChange, priceOpen, priceCurrent, priceMovedTeam,
        whaleDirection, whaleCashAway, whaleCashHome,
        whaleBuyAway, whaleBuyHome,
        polyVol, kalshiVol, latestTradeTs,
      });
    }
  };

  processSport('CBB');
  processSport('NHL');
  processSport('MLB');

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
                  Pinnacle {pinnConfirms ? 'confirms' : 'opposes'} — line moving toward {pinnMoveDir === 'away' ? awayShort : homeShort}
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

function rateStars(evEdge, sharpCount, pinnConfirms, totalInvested, consensusGradeLabel, pinnMovingWith, polyMovingWith, oppPeakStars = 0) {
  let pts = 0;

  // Sharp wallet conviction (max 3 pts)
  if (sharpCount >= 5) pts += 3;
  else if (sharpCount >= 3) pts += 2;
  else if (sharpCount >= 1) pts += 1;

  // Money deployed (max 2 pts, penalize thin volume)
  if (totalInvested >= 25000) pts += 2;
  else if (totalInvested >= 7000) pts += 1;
  else pts -= 1;

  // EV edge (max 2 pts)
  if (evEdge > 3) pts += 2;
  else if (evEdge > 0) pts += 1;

  // Pinnacle alignment (max 2 pts)
  if (pinnConfirms) pts += 1;
  if (pinnMovingWith) pts += 1;

  // Consensus strength (max 1.5 pts, CONTESTED penalized)
  if (consensusGradeLabel === 'DOMINANT') pts += 1.5;
  else if (consensusGradeLabel === 'STRONG') pts += 1;
  else if (consensusGradeLabel === 'LEAN') pts += 0.5;
  else if (consensusGradeLabel === 'CONTESTED') pts -= 1.5;

  // Prediction market alignment (max 0.5 pts)
  if (polyMovingWith) pts += 0.5;

  // Flip penalty — opposing side already locked at peak
  if (oppPeakStars >= 4.5) pts -= 2;
  else if (oppPeakStars >= 3.5) pts -= 1.5;
  else if (oppPeakStars >= 3) pts -= 1;

  const maxPts = 11;
  const raw = (pts / maxPts) * 5;
  const stars = Math.min(5, Math.max(0.5, Math.round(raw * 2) / 2));

  const labels = {
    5:   { label: 'ELITE PLAY',    color: B.green,   bg: B.greenDim,                         summary: 'Maximum conviction — all signals aligned' },
    4.5: { label: 'ELITE PLAY',    color: B.green,   bg: B.greenDim,                         summary: 'Near-perfect signal alignment' },
    4:   { label: 'STRONG PLAY',   color: B.green,   bg: 'rgba(16,185,129,0.08)',             summary: 'Strong conviction — sharps + line movement agree' },
    3.5: { label: 'STRONG PLAY',   color: B.green,   bg: 'rgba(16,185,129,0.08)',             summary: 'Above-average conviction across multiple signals' },
    3:   { label: 'SOLID PLAY',    color: B.gold,    bg: B.goldDim,                           summary: 'Good sharp support — some confirming signals' },
    2.5: { label: 'LEAN',          color: B.gold,    bg: B.goldDim,                           summary: 'Moderate sharp interest — limited confirmation' },
    2:   { label: 'DEVELOPING',    color: B.textSec, bg: 'rgba(255,255,255,0.04)',             summary: 'Early sharp activity — watching for more signals' },
    1.5: { label: 'DEVELOPING',    color: B.textSec, bg: 'rgba(255,255,255,0.04)',             summary: 'Minimal sharp activity so far' },
    1:   { label: 'MONITORING',    color: B.textSec, bg: 'rgba(255,255,255,0.04)',             summary: 'Low activity — not yet actionable' },
    0.5: { label: 'MONITORING',    color: B.textSec, bg: 'rgba(255,255,255,0.04)',             summary: 'Minimal data available' },
  };
  const info = labels[stars] || labels[1];
  const isActionable = stars >= 3.5;

  return { stars, pts, maxPts, ...info, isActionable };
}

const LockedPickCard = memo(function LockedPickCard({ pick, isMobile }) {
  const { team, away, home, sport, stars, units, odds, book, peakAt, gameTime, status, outcome, profit } = pick;
  const ss = sportStyle(sport);
  const starLabels = { 5: 'ELITE PLAY', 4.5: 'ELITE PLAY', 4: 'STRONG PLAY', 3.5: 'STRONG PLAY', 3: 'SOLID PLAY' };
  const starLabel = starLabels[stars] || 'SOLID PLAY';
  const starColor = stars >= 3.5 ? B.green : B.gold;
  const isGraded = status === 'COMPLETED' && outcome;
  const isWin = outcome === 'WIN';
  const isLoss = outcome === 'LOSS';

  const fmtET = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${isGraded ? (isWin ? 'rgba(16,185,129,0.3)' : isLoss ? 'rgba(239,68,68,0.3)' : B.border) : 'rgba(16,185,129,0.2)'}`,
      borderRadius: '10px', padding: isMobile ? '0.75rem' : '0.875rem',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            ...T.micro, fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px',
            color: ss.color, background: ss.bg,
          }}>{sport}</span>
          <span style={{ ...T.label, color: B.text, fontWeight: 700 }}>
            {away} <span style={{ color: B.textMuted, fontWeight: 500 }}>vs</span> {home}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{
            ...T.micro, fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '5px',
            color: starColor, background: stars >= 3.5 ? B.greenDim : B.goldDim,
            border: `1px solid ${stars >= 3.5 ? 'rgba(16,185,129,0.2)' : B.goldBorder}`,
            display: 'flex', alignItems: 'center', gap: '0.15rem',
          }}>
            {Array.from({ length: 5 }, (_, i) => {
              const filled = i + 1 <= Math.floor(stars);
              const half = !filled && i + 0.5 === stars;
              return filled ? (
                <span key={i} style={{ fontSize: '0.45rem', color: starColor, lineHeight: 1 }}>★</span>
              ) : half ? (
                <span key={i} style={{ position: 'relative', display: 'inline-block', fontSize: '0.45rem', lineHeight: 1, width: '0.45rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>★</span>
                  <span style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', width: '50%', color: starColor }}>★</span>
                </span>
              ) : (
                <span key={i} style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>★</span>
              );
            })}
            <span style={{ marginLeft: '0.1rem' }}>{starLabel}</span>
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.5rem 0.625rem', borderRadius: '8px',
        background: isGraded
          ? (isWin ? 'rgba(16,185,129,0.06)' : isLoss ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)')
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isGraded ? (isWin ? 'rgba(16,185,129,0.15)' : isLoss ? 'rgba(239,68,68,0.15)' : B.borderSubtle) : B.borderSubtle}`,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={10} color={B.green} />
            <span style={{ ...T.label, color: B.text, fontWeight: 700 }}>{team}</span>
          </div>
          <span style={{ ...T.micro, color: B.textSec }}>
            {units}u @ {odds > 0 ? '+' : ''}{odds} <span style={{ color: B.textMuted }}>·</span> {book}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.15rem' }}>
          {isGraded ? (
            <>
              <span style={{
                ...T.micro, fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px',
                color: isWin ? B.green : isLoss ? B.red : B.textSec,
                background: isWin ? B.greenDim : isLoss ? B.redDim : 'rgba(255,255,255,0.04)',
              }}>
                {outcome === 'PUSH' ? 'PUSH' : isWin ? 'WIN' : 'LOSS'}
              </span>
              <span style={{
                ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
                color: isWin ? B.green : isLoss ? B.red : B.textSec,
              }}>
                {isWin ? '+' : isLoss ? '-' : ''}{Math.abs(profit || 0).toFixed(2)}u
              </span>
            </>
          ) : (
            <>
              <span style={{
                ...T.micro, fontWeight: 700, color: B.gold,
                padding: '0.1rem 0.4rem', borderRadius: '4px', background: B.goldDim,
              }}>PENDING</span>
              <span style={{ ...T.micro, color: B.textMuted }}>{gameTime ? fmtET(gameTime) + ' ET' : ''}</span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ ...T.micro, color: B.textMuted, fontSize: '0.55rem' }}>
          Peak: {peakAt ? fmtET(peakAt) : '—'}
        </span>
      </div>
    </div>
  );
});

const SharpPositionCard = memo(function SharpPositionCard({ gd, pinnacleHistory, polyData, isMobile, onPickSynced }) {
  const [showWallets, setShowWallets] = useState(false);
  const [walletSideFilter, setWalletSideFilter] = useState('all');
  const lastSyncedStars = useRef(null);
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

  // Directional context: is price moving WITH the recommended play?
  // For ML odds, LOWER number = MORE favored (e.g. +141→+137 = getting shorter = moving WITH)
  // Compare implied probabilities so it works for both positive and negative odds
  const pinnFirstProb = impliedProb(pinnConsensusPoints[0]);
  const pinnLastProb = impliedProb(pinnConsensusPoints[pinnConsensusPoints.length - 1]);
  const pinnMovingWith = pinnConsensusPoints.length >= 2 && pinnLastProb > pinnFirstProb;
  const pinnMovingAgainst = pinnConsensusPoints.length >= 2 && pinnLastProb < pinnFirstProb;

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

  // Compute opposing side's raw stars (no flip penalty) for flip-detection
  const oppSide = consensusSide === 'away' ? 'home' : 'away';
  const oppBestRetail = oppSide === 'away' ? pinnGame?.bestAway : pinnGame?.bestHome;
  const oppPinnProb = impliedProb(oppOdds);
  const oppRetailProb = impliedProb(oppBestRetail);
  const oppEvEdge = (oppPinnProb && oppRetailProb) ? +((oppPinnProb - oppRetailProb) * 100).toFixed(1) : null;
  const oppPinnConfirms = pinnMoved === oppSide;
  const oppPinnPoints = oppSide === 'away' ? pinnAwayPoints : pinnHomePoints;
  const oppPinnFirstProb = impliedProb(oppPinnPoints[0]);
  const oppPinnLastProb = impliedProb(oppPinnPoints[oppPinnPoints.length - 1]);
  const oppPinnMovingWith = oppPinnPoints.length >= 2 && oppPinnLastProb > oppPinnFirstProb;
  const oppPolyMovingWith = polyPoints.length >= 2 && (oppSide === 'away'
    ? polyPoints[polyPoints.length - 1] > polyPoints[0]
    : polyPoints[polyPoints.length - 1] < polyPoints[0]);
  const oppMoneyPct = totalInvested > 0 ? (oppInvestedAmt / totalInvested) * 100 : 50;
  const oppWalletPct = (consensusWallets + oppWallets) > 0 ? (oppWallets / (consensusWallets + oppWallets)) * 100 : 50;
  const oppCGrade = consensusGrade(oppMoneyPct, oppWalletPct);
  const oppSr = rateStars(oppEvEdge || 0, oppWallets, oppPinnConfirms, oppInvestedAmt, oppCGrade.label, oppPinnMovingWith, oppPolyMovingWith);
  const oppPeakStars = oppSr.stars;

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
  const sr = rateStars(evEdge || 0, consensusWallets, pinnConfirms, consensusInvested, cGrade.label, pinnMovingWith, polyMovingWith, oppPeakStars);
  const isLocked = sr.stars >= 3;
  const lockType = isLocked ? (isGameLive ? 'LIVE' : 'PREGAME') : null;

  const betOdds = bestRetail || consensusOdds;
  const units = isLocked ? calculateUnits(sr.stars, cGrade.penalty) : 0;
  const ut = unitTier(units);
  const potentialWin = isLocked ? profitFromOdds(betOdds, units) : 0;

  useEffect(() => {
    if (!isLocked || isGameLive || !commenceTime || !onPickSynced) return;
    if (lastSyncedStars.current !== null && sr.stars <= lastSyncedStars.current) return;
    const date = gameDate(commenceTime);
    const docId = `${date}_${gd.key}`;
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
    }).then(({ action }) => {
      if (action === 'error') return;
      lastSyncedStars.current = sr.stars;
      if (action !== 'no_change') {
        onPickSynced(docId, consensusSide, { odds: betOdds, criteriaMet, units, unitTier: ut.label, stars: sr.stars });
      }
    });
  }, [isLocked, sr.stars]);

  const isActionable = sr.isActionable;
  const accentColor = isLocked ? B.green : isActionable ? B.green : B.gold;
  const accentBorder = isLocked ? 'rgba(16,185,129,0.4)' : isActionable ? 'rgba(16,185,129,0.3)' : B.goldBorder;

  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${accentBorder}`,
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
          display: 'grid', gridTemplateColumns: bestBook ? '1fr auto 1fr' : '1fr',
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
          {bestBook && (
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
                  {fmtOdds(bestRetail)}
                </div>
                <div style={{ ...T.micro, color: B.textSec, marginTop: '0.15rem' }}>
                  {bestBook}
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
            {isLocked ? `PLAY LOCKED — ${sr.stars >= 4.5 ? '★★★★★ ELITE' : sr.stars >= 3.5 ? '★★★★ STRONG' : '★★★ SOLID'}` : `LOCK-IN CRITERIA (${criteriaMet}/6)`}
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

      <div style={{ padding: '0.75rem 0.875rem' }}>
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

              {/* Money flow bar */}
              <div style={{
                display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden',
                marginTop: '0.375rem',
                background: B.borderSubtle,
              }}>
                <div style={{
                  width: `${awayPct}%`,
                  background: awaySide
                    ? `linear-gradient(90deg, ${accentColor}88, ${accentColor})`
                    : 'rgba(148,163,184,0.25)',
                  transition: 'width 0.4s ease',
                }} />
                <div style={{
                  width: `${100 - awayPct}%`,
                  background: homeSide
                    ? `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`
                    : 'rgba(148,163,184,0.25)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
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
          });

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
      </div>
    </div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SharpFlow() {
  const { polyData, kalshiData, whaleProfiles, pinnacleHistory, sharpPositions, loading } = useMarketData();
  const [sportFilter, setSportFilter] = useState('All');
  const [viewMode, setViewMode] = useState('whaleSignals');
  const [gameSort, setGameSort] = useState('time');
  const [signalType, setSignalType] = useState('upcoming');
  const [sortBy, setSortBy] = useState('stars');
  const [lockedPicks, setLockedPicks] = useState({});
  const [allTimePnL, setAllTimePnL] = useState(null);
  const [showPerf, setShowPerf] = useState(false);
  const [perfDateRange, setPerfDateRange] = useState('all');
  const [lockedDay, setLockedDay] = useState('today');
  const [perfSport, setPerfSport] = useState('ALL');
  const [picksLoaded, setPicksLoaded] = useState(false);
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

  // Lazy-load P&L data only when performance section is opened
  const pnlLoadedRef = useRef(false);
  useEffect(() => {
    if (showPerf && !pnlLoadedRef.current) {
      pnlLoadedRef.current = true;
      loadAllTimePnL().then(setAllTimePnL);
    }
  }, [showPerf]);

  const onPickSynced = useCallback((docId, side, snap) => {
    setLockedPicks(prev => {
      const next = { ...prev };
      const prevDoc = next[docId] || {};
      const prevSides = prevDoc.sides || {};
      next[docId] = { ...prevDoc, sides: { ...prevSides, [side]: { ...prevSides[side], peak: snap, lock: prevSides[side]?.lock || snap } } };
      return next;
    });
  }, []);

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
  }, [allTimePnL, perfDateRange, perfSport]);

  const allGames = useMemo(
    () => (polyData || kalshiData) ? buildGameData(polyData, kalshiData) : [],
    [polyData, kalshiData]
  );

  const filteredGames = useMemo(() => {
    let g = allGames;
    if (sportFilter !== 'All') g = g.filter(gm => gm.sport === sportFilter);
    return g;
  }, [allGames, sportFilter]);

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
    for (const sport of ['NHL', 'CBB', 'MLB']) {
      const sg = sharpPositions?.[sport] || {};
      for (const gd of Object.values(sg)) totalSharpInvested += gd.summary?.totalInvested || 0;
    }
    return {
      trackedCount: allEliteProven.length - totalExcluded,
      totalExcluded, mmExcluded, sportLosers,
      gamesWithPos: sharpPositions ? Object.values(sharpPositions.NHL || {}).length + Object.values(sharpPositions.CBB || {}).length : 0,
      totalSharpPnl: cleanWallets.reduce((s, p) => s + (p.totalPnl || 0), 0),
      totalSharpInvested,
    };
  }, [whaleProfiles, sharpPositions]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: B.textSec }}>
        <div style={{ textAlign: 'center' }}>
          <Zap size={32} color={B.gold} style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
          <div style={{ ...T.body }}>Loading Sharp Flow...</div>
        </div>
      </div>
    );
  }

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

      {/* ─── Founding Member Promo ─── */}
      <FoundingMemberBanner isMobile={isMobile} />

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
              const isFiltered = perfDateRange !== 'all' || perfSport !== 'ALL';
              const dateLabels = { today: 'Today', yesterday: 'Yesterday', '7d': 'Last 7 Days', '30d': 'Last 30 Days', all: 'All Time' };

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
                          {totalGraded} graded picks{isFiltered ? ` · ${dateLabels[perfDateRange]}${perfSport !== 'ALL' ? ` · ${perfSport}` : ''}` : ' since Mar 16'}
                        </div>
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
              for (const sport of ['NHL', 'CBB', 'MLB']) {
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
                  const uw = new Set(gd.positions.map(p => p.wallet)).size;
                  const cOdds = cSide === 'away' ? pg?.current?.away : pg?.current?.home;
                  const bRetail = cSide === 'away' ? pg?.bestAway : pg?.bestHome;
                  const pProb = impliedProb(cOdds);
                  const rProb = impliedProb(bRetail);
                  const ev = (pProb && rProb) ? +((pProb - rProb) * 100).toFixed(1) : 0;
                  const pinnH = pg?.history || [];
                  const pinnPts = pinnH.map(h => cSide === 'away' ? h.away : h.home);
                  const pFirstP = impliedProb(pinnPts[0]);
                  const pLastP = impliedProb(pinnPts[pinnPts.length - 1]);
                  const pinnMoveWith = pinnPts.length >= 2 && pLastP > pFirstP;
                  const pinnConf = pg?.movement?.direction === cSide;
                  const cInv = cSide === 'away' ? (ss.awayInvested || 0) : (ss.homeInvested || 0);
                  const moneyPct = (ss.totalInvested || 0) > 0 ? (cInv / ss.totalInvested) * 100 : 50;
                  const cWallets = cSide === 'away' ? new Set(gd.positions.filter(p => p.side === 'away').map(p => p.wallet)).size : new Set(gd.positions.filter(p => p.side === 'home').map(p => p.wallet)).size;
                  const oWallets = uw - cWallets;
                  const wPct = (cWallets + oWallets) > 0 ? (cWallets / (cWallets + oWallets)) * 100 : 50;
                  const cg = consensusGrade(moneyPct, wPct);
                  const polyG = polyData?.[sport]?.[key];
                  const polyPts = polyG?.priceHistory?.points || [];
                  const polyMoveWith = polyPts.length >= 2 && ((cSide === 'away' && polyPts[polyPts.length-1] > polyPts[0]) || (cSide === 'home' && polyPts[polyPts.length-1] < polyPts[0]));

                  // Opposing side stars for flip penalty
                  const oSide = cSide === 'away' ? 'home' : 'away';
                  const oOdds = oSide === 'away' ? pg?.current?.away : pg?.current?.home;
                  const oBestRetail = oSide === 'away' ? pg?.bestAway : pg?.bestHome;
                  const oPProb = impliedProb(oOdds);
                  const oRProb = impliedProb(oBestRetail);
                  const oEv = (oPProb && oRProb) ? +((oPProb - oRProb) * 100).toFixed(1) : 0;
                  const oPinnConf = pg?.movement?.direction === oSide;
                  const oPinnPts = pinnH.map(h => oSide === 'away' ? h.away : h.home);
                  const oPFirstP = impliedProb(oPinnPts[0]);
                  const oPLastP = impliedProb(oPinnPts[oPinnPts.length - 1]);
                  const oPinnMoveWith = oPinnPts.length >= 2 && oPLastP > oPFirstP;
                  const oPolyMoveWith = polyPts.length >= 2 && ((oSide === 'away' && polyPts[polyPts.length-1] > polyPts[0]) || (oSide === 'home' && polyPts[polyPts.length-1] < polyPts[0]));
                  const oInv = oSide === 'away' ? (ss.awayInvested || 0) : (ss.homeInvested || 0);
                  const oMoneyPct = (ss.totalInvested || 0) > 0 ? (oInv / ss.totalInvested) * 100 : 50;
                  const oWPct = (cWallets + oWallets) > 0 ? (oWallets / (cWallets + oWallets)) * 100 : 50;
                  const oCg = consensusGrade(oMoneyPct, oWPct);
                  const oSr = rateStars(oEv, oWallets, oPinnConf, oInv, oCg.label, oPinnMoveWith, oPolyMoveWith);

                  const sr = rateStars(ev, cWallets, pinnConf, cInv, cg.label, pinnMoveWith, polyMoveWith, oSr.stars);

                  if (sortBy === 'locked') continue;
                  if (sortBy === 'live' && !isLive) continue;
                  if (sortBy !== 'live' && isLive) continue;

                  allPosGames.push({ key, sport, ...gd, _commence: ct, _isLive: isLive, _stars: sr.stars, _ev: ev, _wallets: uw, _invested: ss.totalInvested || 0 });
                }
              }

              const sortFns = {
                stars: (a, b) => b._stars - a._stars || b._invested - a._invested,
                live: (a, b) => b._invested - a._invested,
                time: (a, b) => (a._commence || Infinity) - (b._commence || Infinity),
                edge: (a, b) => b._ev - a._ev || b._stars - a._stars,
                money: (a, b) => b._invested - a._invested,
                wallets: (a, b) => b._wallets - a._wallets || b._invested - a._invested,
              };
              allPosGames.sort(sortFns[sortBy] || sortFns.stars);

              return (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <SectionHead
                      title={sortBy === 'locked' ? `Locked Picks — ${lockedDay === 'today' ? 'Today' : 'Yesterday'}` : `Sharp Positions (${allPosGames.length} games)`}
                      subtitle={sortBy === 'locked' ? `All plays that crossed the conviction threshold ${lockedDay === 'today' ? 'today' : 'yesterday'} at peak snapshot` : `Open bets from ${sharpStats.trackedCount} verified directional sharps — market makers excluded`}
                      icon={sortBy === 'locked' ? Lock : Eye}
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
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setSortBy(opt.id)} style={{
                        padding: '0.25rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
                        ...T.micro, fontWeight: 700,
                        border: sortBy === opt.id
                          ? `1px solid ${opt.id === 'live' ? 'rgba(239,68,68,0.4)' : opt.id === 'locked' ? 'rgba(16,185,129,0.4)' : B.goldBorder}`
                          : `1px solid ${B.border}`,
                        background: sortBy === opt.id
                          ? opt.id === 'live' ? 'rgba(239,68,68,0.12)' : opt.id === 'locked' ? B.greenDim : `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                          : 'transparent',
                        color: sortBy === opt.id
                          ? opt.id === 'live' ? B.red : opt.id === 'locked' ? B.green : B.gold
                          : B.textMuted,
                        transition: 'all 0.2s ease',
                      }}>{opt.label}</button>
                    ))}
                  </div>

                  {sortBy === 'locked' ? (() => {
                    const today = todayET();
                    const yesterdayD = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
                    const yesterday = yesterdayD.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
                    const targetDate = lockedDay === 'today' ? today : yesterday;
                    const lockedArr = [];
                    for (const [docId, doc] of Object.entries(lockedPicks)) {
                      if (!docId.startsWith(targetDate)) continue;
                      const docSport = doc.sport || 'NHL';
                      if (sportFilter !== 'All' && docSport !== sportFilter) continue;
                      for (const [sideKey, sd] of Object.entries(doc.sides || {})) {
                        const peak = sd.peak || sd.lock || {};
                        const lock = sd.lock || {};
                        const stars = peak.stars || lock.stars || 0;
                        if (stars < 3) continue;
                        const units = peak.units || lock.units || 1;
                        const profit = sd.result?.outcome === 'WIN' ? (sd.result?.profit || 0) : sd.result?.outcome === 'LOSS' ? -(units) : 0;
                        lockedArr.push({
                          key: `${docId}:${sideKey}`,
                          team: sd.team || sideKey,
                          away: doc.away || '', home: doc.home || '',
                          sport: docSport, stars, units,
                          odds: peak.odds || lock.odds || 0,
                          book: peak.book || lock.book || '',
                          peakAt: peak.updatedAt || lock.lockedAt,
                          gameTime: doc.commenceTime,
                          status: sd.status || doc.status || 'PENDING',
                          outcome: sd.result?.outcome || null,
                          profit,
                        });
                      }
                    }
                    lockedArr.sort((a, b) => b.stars - a.stars || b.units - a.units);
                    return (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem' }}>
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
                        </div>
                        {lockedArr.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '2rem', color: B.textMuted, ...T.label }}>
                            No locked picks for {lockedDay === 'today' ? 'today' : 'yesterday'}
                          </div>
                        ) : (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : lockedArr.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                            gap: '0.75rem',
                          }}>
                            {lockedArr.map(p => (
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
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : allPosGames.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                        gap: '0.75rem',
                      }}>
                        {allPosGames.map(gd => (
                          <SharpPositionCard key={gd.key} gd={gd} pinnacleHistory={pinnacleHistory} polyData={polyData} isMobile={isMobile} onPickSynced={onPickSynced} />
                        ))}
                      </div>
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
      {['All', 'CBB', 'NHL', 'MLB'].map(key => {
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

function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(() => {
    const diff = targetDate - Date.now();
    return diff > 0 ? diff : 0;
  });
  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      const diff = targetDate - Date.now();
      setRemaining(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate, remaining <= 0]);
  const totalH = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { totalH, m, s, expired: remaining <= 0 };
}

const PROMO_DEADLINE = new Date('2026-03-31T03:59:00Z').getTime(); // March 30 11:59 PM ET

function FoundingMemberBanner({ isMobile }) {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription(user);
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const countdown = useCountdown(PROMO_DEADLINE);

  if (authLoading || subLoading || isPremium || dismissed) return null;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText('SHARPMONEY'); } catch { /* fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setDismissed(true);
  };

  const features = [
    'Verified sharp bettor tracking in real time',
    'Pinnacle fair value + best retail EV edge',
    'Auto-locked plays with smart unit sizing',
    'Full market flow — tickets, money, & whale action',
    'Line movement alerts + reverse line moves',
    'Complete performance dashboard with ROI tracking',
  ];

  const pad = (n) => String(n).padStart(2, '0');
  const isUrgent = countdown.totalH < 24;
  const countdownText = countdown.expired
    ? 'OFFER EXPIRED'
    : `${countdown.totalH}h ${pad(countdown.m)}m ${pad(countdown.s)}s`;

  const CountdownUnit = ({ value, label, wide }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: wide ? (isMobile ? '3.5rem' : '4rem') : (isMobile ? '3rem' : '3.5rem') }}>
      <span style={{
        fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 900,
        color: isUrgent ? '#ef4444' : '#f59e0b',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>{wide ? value : pad(value)}</span>
      <span style={{ ...T.micro, color: B.textMuted, fontWeight: 600, marginTop: '0.2rem' }}>{label}</span>
    </div>
  );

  const CountdownSep = () => (
    <span style={{
      fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 900,
      color: isUrgent ? '#ef4444' : '#f59e0b',
      lineHeight: 1, opacity: 0.6, alignSelf: 'flex-start', paddingTop: '0.1rem',
    }}>:</span>
  );

  return (
    <div style={{
      position: 'relative',
      marginBottom: '1.5rem',
      borderRadius: '14px',
      overflow: 'hidden',
      background: `linear-gradient(135deg, rgba(212,175,55,0.08) 0%, ${B.card} 35%, rgba(239,68,68,0.04) 100%)`,
      border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
      boxShadow: isUrgent
        ? '0 0 20px rgba(239,68,68,0.08), 0 4px 20px rgba(0,0,0,0.3)'
        : '0 0 15px rgba(245,158,11,0.06), 0 4px 20px rgba(0,0,0,0.3)',
    }}>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Top accent line */}
      <div style={{
        height: '3px',
        background: isUrgent
          ? 'linear-gradient(90deg, #ef4444, #f59e0b, #ef4444)'
          : 'linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b)',
      }} />

      {/* Collapsed header — always visible */}
      <button onClick={() => setExpanded(p => !p)} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0.75rem 1rem' : '0.75rem 2rem',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
          <span style={{ fontSize: '0.85rem' }}>🏆</span>
          <span style={{ ...T.label, color: B.gold, letterSpacing: '0.04em' }}>FOUNDING MEMBER — </span>
          <span style={{ ...T.label, color: B.green, fontWeight: 800 }}>50% OFF FOR LIFE</span>
          {!isMobile && <>
            <span style={{ ...T.label, color: B.textMuted }}>· Code:</span>
            <span style={{ ...T.label, color: B.gold, fontWeight: 900, letterSpacing: '0.03em' }}>SHARPMONEY</span>
          </>}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            ...T.micro, fontWeight: 800, letterSpacing: '0.02em',
            padding: '0.15rem 0.5rem', borderRadius: '4px',
            background: isUrgent ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
            color: isUrgent ? '#ef4444' : '#f59e0b',
            animation: 'pulseGlow 2s ease-in-out infinite',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <Clock size={10} />
            {countdownText}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {expanded
            ? <ChevronUp size={16} color={B.textMuted} />
            : <ChevronDown size={16} color={B.textMuted} />}
          <span onClick={handleDismiss} style={{ color: B.textMuted, fontSize: '0.875rem', lineHeight: 1, padding: '0.125rem' }}>✕</span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: isMobile ? '0 1rem 1.25rem' : '0 2rem 1.75rem' }}>
          <div style={{ height: '1px', background: B.borderSubtle, marginBottom: '1rem' }} />

          {/* Urgency bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 0.875rem', borderRadius: '8px',
            background: isUrgent ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.06)',
            border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.15)'}`,
            marginBottom: '1rem',
          }}>
            <AlertTriangle size={14} color={isUrgent ? '#ef4444' : '#f59e0b'} />
            <span style={{ ...T.label, color: isUrgent ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>
              {countdown.expired
                ? 'This offer has expired.'
                : isUrgent
                  ? 'FINAL HOURS — Free access and founding member pricing end Monday at midnight ET'
                  : `Less than ${countdown.totalH} hours left — free access and founding member pricing end Monday at midnight ET`}
            </span>
          </div>

          {/* Countdown timer */}
          {!countdown.expired && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: isMobile ? '0.375rem' : '0.5rem',
              padding: '1rem', marginBottom: '1.25rem', borderRadius: '10px',
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.15)'}`,
            }}>
              <CountdownUnit value={countdown.totalH} label="HOURS" wide />
              <CountdownSep />
              <CountdownUnit value={countdown.m} label="MIN" />
              <CountdownSep />
              <CountdownUnit value={countdown.s} label="SEC" />
            </div>
          )}

          <h2 style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 900,
            color: B.text, margin: '0 0 0.375rem 0', lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            You're early. <span style={{ color: B.gold }}>That pays off.</span>
          </h2>
          <p style={{
            ...T.body, color: B.textSec, margin: '0 0 0.25rem 0',
            maxWidth: '600px', lineHeight: 1.6,
          }}>
            We track <span style={{ color: B.text, fontWeight: 700 }}>200+ verified sharp bettors</span>, surface their real positions
            on today's games, and combine it with Pinnacle fair odds, EV edges, and full market flow
            — so you bet with an edge, not a hunch. Lock in <span style={{ color: B.green, fontWeight: 700 }}>50% off forever</span> before the paywall goes live.
          </p>
          <p style={{
            ...T.label, color: B.textMuted, margin: '0 0 1.25rem 0', fontStyle: 'italic',
          }}>
            Free access ends Monday at midnight ET. The founding member discount goes with it — lock your rate now.
          </p>

          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '0.4rem 1.5rem',
            marginBottom: '1.25rem',
          }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={13} color={B.green} />
                <span style={{ ...T.label, color: B.textSec }}>{f}</span>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '0.75rem' : '1rem',
          }}>
            {/* Code block */}
            <button onClick={handleCopy} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 1.25rem', borderRadius: '8px',
              background: 'rgba(212,175,55,0.08)',
              border: `1.5px dashed ${B.gold}`,
              cursor: 'pointer', transition: 'all 0.2s ease',
              width: isMobile ? '100%' : 'auto', justifyContent: 'center',
            }}>
              <span style={{ ...T.label, color: B.textSec }}>Code:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: B.gold, letterSpacing: '0.04em' }}>SHARPMONEY</span>
              <span style={{
                ...T.micro, padding: '0.15rem 0.5rem', borderRadius: '4px',
                background: copied ? B.greenDim : 'rgba(212,175,55,0.12)',
                color: copied ? B.green : B.gold,
                fontWeight: 700, transition: 'all 0.2s ease',
              }}>
                {copied ? '✓ Copied' : 'Copy'}
              </span>
            </button>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: isMobile ? '1.375rem' : '1.5rem', fontWeight: 900, color: B.green }}>$13/mo</span>
              <span style={{
                ...T.label, color: B.textMuted,
                textDecoration: 'line-through', opacity: 0.6,
              }}>$25.99</span>
              <span style={{
                ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
                background: B.greenDim, color: B.green, fontWeight: 800,
              }}>50% OFF FOREVER</span>
            </div>
          </div>

          {/* Link to pricing */}
          <a href="#/pricing?promo=SHARPMONEY" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            marginTop: '1rem', padding: isMobile ? '0.75rem 1.5rem' : '0.625rem 1.5rem', borderRadius: '8px',
            background: `linear-gradient(135deg, ${B.green}, #059669)`,
            color: '#fff', fontWeight: 800, fontSize: isMobile ? '1rem' : '0.9rem',
            textDecoration: 'none', letterSpacing: '0.01em',
            transition: 'all 0.2s ease',
            width: isMobile ? '100%' : 'auto', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(16,185,129,0.3)',
          }}>
            Lock In 50% Off Forever →
          </a>
        </div>
      )}
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
              border: 'none',
              background: viewMode === 'whaleSignals'
                ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                : 'transparent',
              color: viewMode === 'whaleSignals' ? B.gold : B.textMuted,
              transition: 'all 0.2s ease',
            }}>
              <Zap size={12} /> Sharp Intel
            </button>
          </div>
          <SportTabs active={sportFilter} onChange={setSportFilter} />
        </div>
      </div>
    </div>
  );
}

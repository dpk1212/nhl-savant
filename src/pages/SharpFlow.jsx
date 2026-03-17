/**
 * Sharp Flow — Premium Whale Trade Intelligence
 *
 * Game-centric view: every game's full money story in one place.
 * Sharp Signals surface where money disagrees with tickets (the edge).
 * Expandable game cards show individual whale trades in context.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Activity, Zap, BarChart3, Eye, ArrowUpRight, ArrowDownRight, Minus, DollarSign, Workflow, Lock, CheckCircle, Circle } from 'lucide-react';
import { resolveOutcomeSide } from '../utils/teamNameMapper';
import { collection, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

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
  return sport === 'CBB'
    ? { color: '#FF6B35', bg: 'rgba(255,107,53,0.12)', icon: '🏀' }
    : { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', icon: '🏒' };
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

function calculateUnits(criteriaMet, evEdge, sharpCount, totalInvested, consensusPenalty = 0) {
  let units = criteriaMet >= 6 ? 3 : criteriaMet >= 5 ? 2 : 1;

  if (evEdge >= 5) units += 0.5;
  else if (evEdge >= 3) units += 0.25;

  if (sharpCount >= 5) units += 0.5;
  else if (sharpCount >= 4) units += 0.25;

  if (totalInvested >= 20000) units += 0.5;
  else if (totalInvested >= 10000) units += 0.25;

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

async function writeLockedPick(pick) {
  try {
    const docId = `${pick.date}_${pick.gameKey}`;
    await setDoc(doc(db, 'sharpFlowPicks', docId), pick, { merge: true });
  } catch (err) {
    console.warn('Failed to write locked pick:', err.message);
  }
}

async function loadLockedPicks(date) {
  try {
    const q = query(
      collection(db, 'sharpFlowPicks'),
      where('date', '==', date),
      orderBy('lockedAt', 'desc'),
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

async function loadAllTimePnL() {
  try {
    const q = query(
      collection(db, 'sharpFlowPicks'),
      where('status', '==', 'COMPLETED'),
    );
    const snap = await getDocs(q);
    const tally = (filter) => {
      let wins = 0, losses = 0, pushes = 0, totalProfit = 0, totalUnits = 0;
      snap.forEach(d => {
        const p = d.data();
        if (!filter(p)) return;
        if (p.result?.outcome === 'WIN') { wins++; totalProfit += (p.result?.profit || 0); }
        else if (p.result?.outcome === 'LOSS') { losses++; totalProfit += -(p.units || 1); }
        else if (p.result?.outcome === 'PUSH') { pushes++; }
        totalUnits += (p.units || 1);
      });
      return { wins, losses, pushes, totalProfit: +totalProfit.toFixed(2), totalUnits, record: `${wins}-${losses}${pushes > 0 ? `-${pushes}` : ''}` };
    };
    return {
      pregame: tally(p => p.lockType !== 'LIVE'),
      live: tally(p => p.lockType === 'LIVE'),
      all: tally(() => true),
    };
  } catch (err) {
    console.warn('Failed to load all-time P&L:', err.message);
    const empty = { wins: 0, losses: 0, pushes: 0, totalProfit: 0, totalUnits: 0, record: '0-0' };
    return { pregame: { ...empty }, live: { ...empty }, all: { ...empty } };
  }
}

function todayET() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
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

// ─── Sharp Signal Card (games with ticket/money divergence) ───────────────────

function SharpSignalCard({ game, isMobile, whaleProfiles }) {
  const [showTrades, setShowTrades] = useState(false);
  const ss = sportStyle(game.sport);
  const ticketFav = game.awayTicketPct >= game.homeTicketPct ? 'away' : 'home';
  const moneyFav = game.awayMoneyPct >= game.homeMoneyPct ? 'away' : 'home';
  const isReverse = ticketFav !== moneyFav;
  const sharpTeam = moneyFav === 'away' ? game.away : game.home;
  const sharpPct = moneyFav === 'away' ? game.awayMoneyPct : game.homeMoneyPct;
  const pubTeam = ticketFav === 'away' ? game.away : game.home;
  const pubPct = ticketFav === 'away' ? game.awayTicketPct : game.homeTicketPct;
  const awayShort = game.away.split(' ').pop();
  const homeShort = game.home.split(' ').pop();

  const verdictColor = isReverse ? B.gold : B.green;

  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${B.border}`,
      transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Top accent bar */}
      <div style={{
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${verdictColor}, transparent)`,
      }} />

      {/* ── Row 1: Matchup header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.875rem 1rem 0.625rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge color={ss.color} bg={ss.bg}>{ss.icon} {game.sport}</Badge>
          <span style={{ ...T.body, color: B.text }}>{game.away}</span>
          <span style={{ ...T.caption, color: B.textMuted }}>vs</span>
          <span style={{ ...T.body, color: B.text }}>{game.home}</span>
        </div>
        {game.awayProb != null && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...T.micro, color: B.textSubtle, marginBottom: '0.1rem' }}>MARKET ODDS</div>
            <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
              {game.away.split(' ').pop()} {fmtPct(game.awayProb)} | {game.home.split(' ').pop()} {fmtPct(game.homeProb)}
            </span>
          </div>
        )}
      </div>

      {/* ── Row 2: Verdict banner (most important info) ── */}
      <div style={{
        margin: '0 0.75rem', padding: '0.625rem 0.875rem', borderRadius: '8px',
        background: isReverse ? 'rgba(212,175,55,0.07)' : 'rgba(16,185,129,0.06)',
        border: `1px solid ${isReverse ? B.goldBorder : 'rgba(16,185,129,0.15)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.75rem', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isReverse ? <Eye size={16} color={B.gold} /> : <TrendingUp size={16} color={B.green} />}
          <div>
            <div style={{ ...T.label, fontWeight: 700, color: verdictColor }}>
              {isReverse
                ? `Sharps loading ${sharpTeam}`
                : `Heavy conviction on ${sharpTeam}`}
            </div>
            <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.1rem' }}>
              {isReverse
                ? `${sharpPct}% of money vs ${pubPct}% of tickets on ${pubTeam}`
                : `${sharpPct}% of money and tickets aligned`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            ...T.tiny, color: B.gold, background: B.goldDim,
            padding: '0.2rem 0.6rem', borderRadius: '6px',
          }}>
            {game.ticketDivergence.toFixed(0)}pt SPLIT
          </div>
          {isReverse && (
            <div style={{
              ...T.tiny, color: B.red, background: B.redDim,
              padding: '0.2rem 0.5rem', borderRadius: '6px',
            }}>
              REVERSE
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: Stacked flow bars (easy visual comparison) ── */}
      <div style={{ padding: '0.875rem 1rem 0.625rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {/* Tickets bar */}
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '0.25rem',
            }}>
              <span style={{ ...T.tiny, color: B.textMuted, letterSpacing: '0.06em' }}>
                TICKETS
              </span>
              <span style={{ ...T.micro, color: B.textMuted }}>{game.totalTrades} bets</span>
            </div>
            <FlowBar
              leftPct={game.awayTicketPct} rightPct={game.homeTicketPct}
              leftLabel={awayShort} rightLabel={homeShort}
              height={16}
            />
          </div>
          {/* Money bar */}
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '0.25rem',
            }}>
              <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.06em' }}>
                MONEY
              </span>
              <span style={{ ...T.micro, color: B.textMuted }}>{fmtVol(game.totalCash)} sampled</span>
            </div>
            <FlowBar
              leftPct={game.awayMoneyPct} rightPct={game.homeMoneyPct}
              leftLabel={awayShort} rightLabel={homeShort}
              leftColor={B.gold} rightColor={B.gold}
              height={16}
            />
          </div>
        </div>
      </div>

      {/* ── Row 4: Metrics grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
        gap: '1px',
        margin: '0 0.75rem 0.75rem',
        borderRadius: '8px', overflow: 'hidden',
        background: B.borderSubtle,
      }}>
        {[
          { label: 'Volume', value: fmtVol(game.volume), accent: game.volume >= 100_000 },
          { label: 'Whale #', value: game.whaleCount, accent: game.whaleCount >= 10 },
          { label: 'Whale $', value: fmtVol(game.whaleCash), accent: game.whaleCash >= 5_000 },
          ...(game.priceChange != null && game.priceChange !== 0 ? [{
            label: `${game.priceMovedTeam?.split(' ').pop() || ''} Moving`,
            value: `${game.priceChange > 0 ? '↑' : '↓'} ${Math.abs(game.priceChange)}¢`,
            accent: false,
            color: game.priceChange > 0 ? B.green : B.red,
          }] : []),
          ...(game.whaleDirection ? [{
            label: 'Whale Side',
            value: game.whaleDirection === 'away' ? awayShort : homeShort,
            accent: true,
          }] : []),
        ].map((m, i) => (
          <div key={i} style={{
            padding: '0.5rem 0.625rem', textAlign: 'center',
            background: 'rgba(21,25,35,0.9)',
          }}>
            <div style={{ ...T.micro, color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>
              {m.label}
            </div>
            <div style={{
              ...T.caption, fontWeight: 700, fontFeatureSettings: "'tnum'",
              color: m.color || (m.accent ? B.gold : B.textSec),
            }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 5: Expandable whale trades ── */}
      {game.allWhales.length > 0 && (
        <div style={{
          padding: '0 1rem 0.875rem',
          borderTop: `1px solid ${B.borderSubtle}`,
        }}>
          <button onClick={() => setShowTrades(!showTrades)} style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            background: 'none', border: 'none', cursor: 'pointer',
            ...T.micro, color: B.textSec, padding: '0.625rem 0 0',
            width: '100%',
          }}>
            {showTrades ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showTrades ? 'Hide' : 'View'} {game.allWhales.length} whale trades ({fmtVol(game.whaleCash)})
          </button>
          {showTrades && (
            <div style={{
              marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem',
            }}>
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

// ─── Game Flow Row (compact game summary in grid) ─────────────────────────────

function GameFlowCard({ game, isMobile, whaleProfiles }) {
  const [expanded, setExpanded] = useState(false);
  const ss = sportStyle(game.sport);
  const moneyFav = game.awayMoneyPct >= game.homeMoneyPct ? 'away' : 'home';
  const moneyTeam = moneyFav === 'away' ? game.away : game.home;
  const moneyPct = moneyFav === 'away' ? game.awayMoneyPct : game.homeMoneyPct;
  const hasDivergence = game.ticketDivergence >= 10;

  return (
    <div style={{
      borderRadius: '10px', overflow: 'hidden',
      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${hasDivergence ? B.goldBorder : B.border}`,
      transition: 'all 0.2s ease',
    }}>
      {hasDivergence && (
        <div style={{
          height: '1.5px',
          background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)`,
        }} />
      )}

      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: isMobile ? '0.75rem' : '0.75rem 1rem',
          cursor: 'pointer',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr auto' : '2fr 1fr 1fr 1fr auto',
          gap: isMobile ? '0.5rem' : '1rem',
          alignItems: 'center',
        }}
      >
        {/* Col 1: Matchup */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.2rem' }}>
            <Badge color={ss.color} bg={ss.bg}>{game.sport}</Badge>
            <span style={{ ...T.caption, fontWeight: 700, color: B.text }}>
              {game.away} vs {game.home}
            </span>
          </div>
          {game.awayProb != null && (
            <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
              Market: {game.away.split(' ').pop()} {fmtPct(game.awayProb)} | {game.home.split(' ').pop()} {fmtPct(game.homeProb)}
            </span>
          )}
        </div>

        {/* Col 2: Money flow */}
        {!isMobile && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...T.micro, color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>
              Money
            </div>
            <div style={{ ...T.caption, fontWeight: 700, color: hasDivergence ? B.gold : B.textSec, fontFeatureSettings: "'tnum'" }}>
              {moneyPct}% {moneyTeam.split(' ').pop()}
            </div>
          </div>
        )}

        {/* Col 3: Volume */}
        {!isMobile && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...T.micro, color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>
              Vol
            </div>
            <div style={{ ...T.caption, fontWeight: 700, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
              {fmtVol(game.volume)}
            </div>
          </div>
        )}

        {/* Col 4: Whales */}
        {!isMobile && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...T.micro, color: B.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>
              Whales
            </div>
            <div style={{ ...T.caption, fontWeight: 700, color: game.whaleCount > 0 ? B.textSec : B.textSubtle, fontFeatureSettings: "'tnum'" }}>
              {game.whaleCount > 0 ? `${game.whaleCount} (${fmtVol(game.whaleCash)})` : '—'}
            </div>
          </div>
        )}

        {/* Mobile: condensed right side */}
        {isMobile && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...T.caption, fontWeight: 700, color: hasDivergence ? B.gold : B.textSec, fontFeatureSettings: "'tnum'" }}>
              {moneyPct}% {moneyTeam.split(' ').pop()}
            </div>
            <div style={{ ...T.micro, color: B.textMuted }}>{fmtVol(game.volume)} · {game.whaleCount} whales</div>
          </div>
        )}

        {/* Expand icon */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {expanded ? <ChevronUp size={14} color={B.textMuted} /> : <ChevronDown size={14} color={B.textMuted} />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          padding: '0 1rem 1rem',
          borderTop: `1px solid ${B.borderSubtle}`,
        }}>
          <div style={{ paddingTop: '0.75rem' }}>
            {/* Flow bars */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ ...T.tiny, color: B.textMuted, marginBottom: '0.3rem', letterSpacing: '0.06em' }}>TICKETS</div>
                <FlowBar
                  leftPct={game.awayTicketPct} rightPct={game.homeTicketPct}
                  leftLabel={game.away.split(' ').pop()} rightLabel={game.home.split(' ').pop()}
                />
              </div>
              <div>
                <div style={{ ...T.tiny, color: B.gold, marginBottom: '0.3rem', letterSpacing: '0.06em' }}>MONEY</div>
                <FlowBar
                  leftPct={game.awayMoneyPct} rightPct={game.homeMoneyPct}
                  leftLabel={game.away.split(' ').pop()} rightLabel={game.home.split(' ').pop()}
                  leftColor={B.gold} rightColor={B.gold}
                />
              </div>
            </div>

            {/* Metrics */}
            <div style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap',
              padding: '0.5rem 0.625rem', borderRadius: '6px',
              background: 'rgba(255,255,255,0.02)', marginBottom: '0.5rem',
            }}>
              <MetricPill label="Trades" value={game.totalTrades} />
              <MetricPill label="Sample $" value={fmtVol(game.totalCash)} />
              <MetricPill label="Whales" value={game.whaleCount} accent={game.whaleCount > 10} />
              <MetricPill label="Whale $" value={fmtVol(game.whaleCash)} accent={game.whaleCash >= 5000} />
              {game.priceChange != null && game.priceChange !== 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <PriceArrow change={game.priceChange} />
                  <MetricPill
                    label={`${game.priceMovedTeam?.split(' ').pop() || ''} Moving`}
                    value={`${game.priceChange > 0 ? '↑' : '↓'} ${Math.abs(game.priceChange)}¢`}
                  />
                </div>
              )}
            </div>

            {/* Whale trades */}
            {game.allWhales.length > 0 && (
              <div>
                <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.375rem' }}>
                  Individual whale positions:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {game.allWhales.slice(0, 8).map((w, i) => (
                    <WhaleTradeRow key={`${w.ts}-${i}`} trade={w} whaleProfiles={whaleProfiles} />
                  ))}
                  {game.allWhales.length > 8 && (
                    <div style={{ ...T.micro, color: B.textMuted, textAlign: 'center', padding: '0.25rem' }}>
                      +{game.allWhales.length - 8} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const flowGames = useMemo(() => {
    return [...games]
      .filter(g => g.totalCash > 0)
      .sort((a, b) => b.totalCash - a.totalCash);
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

// ─── Whale Signal Scoring ──────────────────────────────────────────────────────

function scoreWhaleSignal(game, whaleProfiles, pinnacleData, sharpPositionsData) {
  const pinnGame = pinnacleData?.[game.sport]?.[game.key] || null;
  const sharpPos = sharpPositionsData?.[game.sport]?.[game.key] || null;

  if ((!game.allWhales || game.allWhales.length === 0) && !sharpPos) return null;

  // Analyze whale money by profitability — smart $ vs degen $
  let smartAway = 0, smartHome = 0, degenAway = 0, degenHome = 0;
  let unknownAway = 0, unknownHome = 0;
  let bestSharpTier = 'UNKNOWN';
  let bestSharpWallet = null;

  for (const w of game.allWhales) {
    const side = resolveOutcomeSide(w.outcome, game.away, game.home);
    const isAway = side === 'away';
    const addr = w.wallet?.toLowerCase();
    const profile = addr && whaleProfiles ? whaleProfiles[addr] : null;
    const pnl = profile?.totalPnl || 0;
    const cash = w.amount || 0;

    if (profile && pnl > 5000) {
      if (isAway) smartAway += cash; else smartHome += cash;
      const tierRank = { ELITE: 4, PROVEN: 3, ACTIVE: 2 };
      if ((tierRank[profile.tier] || 0) > ({ ELITE: 4, PROVEN: 3, ACTIVE: 2, UNKNOWN: 0 }[bestSharpTier] || 0)) {
        bestSharpTier = profile.tier;
        bestSharpWallet = { ...profile, address: w.wallet };
      }
    } else if (profile && pnl < -10000) {
      if (isAway) degenAway += cash; else degenHome += cash;
    } else {
      if (isAway) unknownAway += cash; else unknownHome += cash;
    }
  }

  // Determine signal direction: follow sharp, fade degen
  const smartDir = smartAway > smartHome ? 'away' : smartHome > smartAway ? 'home' : null;
  const degenDir = degenAway > degenHome ? 'away' : degenHome > degenAway ? 'home' : null;
  const fadeDir = degenDir === 'away' ? 'home' : degenDir === 'home' ? 'away' : null;
  const rawDir = game.whaleDirection;

  // Sharp position consensus direction
  const sharpPosDir = sharpPos?.summary?.consensus || null;

  // Priority: sharp money > sharp positions > fade degens > raw volume
  let signalDir = smartDir || sharpPosDir || fadeDir || rawDir;
  if (!signalDir) return null;

  const isAway = signalDir === 'away';
  const smartCash = isAway ? smartAway : smartHome;
  const degenCashOnOpp = isAway ? degenHome : degenAway;
  const totalSignalCash = isAway ? game.whaleCashAway : game.whaleCashHome;

  let score = 0;
  const factors = [];
  let signalType = 'volume';

  // Sharp wallet following
  if (smartCash > 0) {
    signalType = 'sharp';
    if (smartCash >= 25000) {
      score += 30;
      factors.push({ label: `Sharp $${fmtVol(smartCash)} following`, pts: 30 });
    } else if (smartCash >= 5000) {
      score += 20;
      factors.push({ label: `Sharp $${fmtVol(smartCash)} following`, pts: 20 });
    } else {
      score += 12;
      factors.push({ label: `Sharp $${fmtVol(smartCash)} following`, pts: 12 });
    }
  }

  // Degen fade signal
  if (fadeDir === signalDir && degenCashOnOpp > 10000) {
    signalType = signalType === 'sharp' ? 'sharp+fade' : 'fade';
    score += 15;
    factors.push({ label: `Fade degen $${fmtVol(degenCashOnOpp)}`, pts: 15 });
  }

  // Wallet tier bonus
  if (bestSharpTier === 'ELITE') {
    score += 20;
    factors.push({ label: 'ELITE wallet', pts: 20 });
  } else if (bestSharpTier === 'PROVEN') {
    score += 12;
    factors.push({ label: 'PROVEN wallet', pts: 12 });
  }

  // If no sharp or fade signal, fall back to raw volume (weaker)
  if (signalType === 'volume') {
    const whaleCash = isAway ? game.whaleCashAway : game.whaleCashHome;
    if (whaleCash >= 25000) {
      score += 10;
      factors.push({ label: `$${fmtVol(whaleCash)} volume`, pts: 10 });
    } else if (whaleCash >= 1000) {
      score += 5;
      factors.push({ label: `$${fmtVol(whaleCash)} volume`, pts: 5 });
    }
  }

  // Pinnacle movement confirmation
  if (pinnGame?.movement) {
    const pinnDir = pinnGame.movement.direction;
    if ((isAway && pinnDir === 'away') || (!isAway && pinnDir === 'home')) {
      score += 20;
      factors.push({ label: 'Pinnacle confirms', pts: 20 });
    }
  }

  // +EV on retail book
  const pinnOdds = isAway ? pinnGame?.current?.away : pinnGame?.current?.home;
  const bestRetail = isAway ? pinnGame?.bestAway : pinnGame?.bestHome;
  const bestBook = isAway ? pinnGame?.bestAwayBook : pinnGame?.bestHomeBook;
  const pinnProb = impliedProb(pinnOdds);
  const retailProb = impliedProb(bestRetail);
  let evEdge = null;

  if (pinnProb && retailProb) {
    evEdge = +((pinnProb - retailProb) * 100).toFixed(1);
    if (evEdge > 3) {
      score += 25;
      factors.push({ label: `+${evEdge}% EV (${bestBook})`, pts: 25 });
    } else if (evEdge > 1) {
      score += 15;
      factors.push({ label: `+${evEdge}% EV (${bestBook})`, pts: 15 });
    } else if (evEdge > 0) {
      score += 5;
      factors.push({ label: `+${evEdge}% EV (${bestBook})`, pts: 5 });
    }
  }

  // Ticket/money divergence
  if (game.ticketDivergence >= 10) {
    score += 8;
    factors.push({ label: `${Math.round(game.ticketDivergence)}pt split`, pts: 8 });
  }

  // Cross-platform volume
  if (game.awayMoneyPct != null) {
    const pct = isAway ? game.awayMoneyPct : game.homeMoneyPct;
    if (pct >= 60) {
      score += 7;
      factors.push({ label: 'Cross-platform volume', pts: 7 });
    }
  }

  // Sharp wallet positions (from proactive scan)
  let sharpPosCount = 0;
  let sharpPosInvested = 0;
  if (sharpPos) {
    const s = sharpPos.summary;
    const posCount = isAway ? s.sharpAway : s.sharpHome;
    const posInvested = isAway ? s.awayInvested : s.homeInvested;
    if (posCount > 0) {
      sharpPosCount = posCount;
      sharpPosInvested = posInvested;
      if (posInvested >= 10000) {
        score += 20;
        factors.push({ label: `${posCount} sharp wallet(s) positioned`, pts: 20 });
      } else if (posCount >= 2) {
        score += 15;
        factors.push({ label: `${posCount} sharp wallets in`, pts: 15 });
      } else {
        score += 8;
        factors.push({ label: `Sharp wallet positioned`, pts: 8 });
      }
    }
    // If sharp positions disagree with signal direction, it's a conflicting signal
    if (s.consensus && s.consensus !== (isAway ? 'away' : 'home') && s.totalInvested > 1000) {
      score -= 10;
      factors.push({ label: 'Sharp positions oppose', pts: -10 });
    }
  }

  const whaleCash = isAway ? game.whaleCashAway : game.whaleCashHome;

  return {
    score: Math.min(Math.max(score, 0), 100),
    side: isAway ? 'away' : 'home',
    teamName: isAway ? game.away : game.home,
    whaleCash,
    smartCash,
    signalType,
    bestTier: bestSharpTier,
    bestWallet: bestSharpWallet,
    factors,
    pinnacle: pinnGame,
    evEdge,
    pinnOdds,
    bestRetail,
    bestBook,
    pinnProb: pinnProb ? +(pinnProb * 100).toFixed(1) : null,
    sharpPositions: sharpPos,
    sharpPosCount,
    sharpPosInvested,
  };
}

function WhaleSignalCard({ game, signal, isMobile, whaleProfiles }) {
  const [expanded, setExpanded] = useState(false);
  const ss = sportStyle(game.sport);
  const teamShort = signal.teamName.split(' ').pop();
  const hasEV = signal.evEdge != null && signal.evEdge > 0;
  const barColor = hasEV ? B.green : signal.score >= 50 ? B.gold : B.sky;
  const pinnacle = signal.pinnacle;
  const allBooks = pinnacle?.allBooks || {};

  return (
    <div style={{
      background: B.card, borderRadius: '12px', overflow: 'hidden',
      border: `1px solid ${hasEV ? 'rgba(16,185,129,0.3)' : B.border}`,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.875rem 1rem',
        borderBottom: `1px solid ${B.borderSubtle}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            ...T.micro, fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px',
            background: ss.bg, color: ss.color, letterSpacing: '0.05em',
          }}>{game.sport}</span>
          <span style={{ ...T.caption, fontWeight: 700, color: B.text }}>
            {game.away} <span style={{ color: B.textMuted, fontWeight: 400 }}>vs</span> {game.home}
          </span>
        </div>
        <div style={{
          ...T.small, fontWeight: 800, color: barColor,
          display: 'flex', alignItems: 'center', gap: '0.25rem',
        }}>
          <Zap size={14} /> {signal.score}
        </div>
      </div>

      {/* ─── Actionable Bet Box ─── */}
      {hasEV && signal.bestBook && (
        <div style={{
          margin: '0.75rem 1rem 0', padding: '0.75rem',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)',
          border: '1px solid rgba(16,185,129,0.25)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0.5rem',
          }}>
            <span style={{ ...T.caption, fontWeight: 800, color: B.green }}>
              +EV OPPORTUNITY
            </span>
            <span style={{
              ...T.small, fontWeight: 900, color: B.green,
              padding: '0.15rem 0.5rem', borderRadius: '4px',
              background: B.greenDim,
            }}>
              +{signal.evEdge}% EV
            </span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            gap: '0.5rem', alignItems: 'center',
          }}>
            <div>
              <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.15rem' }}>BET</div>
              <div style={{ ...T.body, fontWeight: 800, color: B.text }}>
                {teamShort} ML
              </div>
            </div>
            <div style={{ width: '1px', height: '30px', background: B.borderSubtle }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.15rem' }}>BEST PRICE</div>
              <div style={{ ...T.body, fontWeight: 800, color: B.green }}>
                {fmtOdds(signal.bestRetail)}
              </div>
              <div style={{ ...T.micro, color: B.textSec }}>
                {signal.bestBook}
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '0.5rem', paddingTop: '0.375rem',
            borderTop: '1px solid rgba(16,185,129,0.15)',
          }}>
            <span style={{ ...T.micro, color: B.textMuted }}>
              Fair value: {fmtOdds(signal.pinnOdds)} ({signal.pinnProb}%)
            </span>
            <span style={{ ...T.micro, color: B.textMuted }}>
              {fmtVol(signal.whaleCash)} whale $
            </span>
          </div>
        </div>
      )}

      {/* ─── No EV but still a signal ─── */}
      {!hasEV && (
        <div style={{ padding: '0.75rem 1rem 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
          }}>
            <div style={{
              padding: '0.4rem 0.75rem', borderRadius: '8px',
              background: `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`,
              border: `1px solid ${B.goldBorder}`,
            }}>
              <span style={{ ...T.caption, fontWeight: 800, color: B.gold }}>
                {signal.sharpPosCount > 0 && signal.signalType === 'volume'
                  ? `${signal.sharpPosCount} sharp wallet${signal.sharpPosCount > 1 ? 's' : ''} → ${teamShort}`
                  : signal.signalType === 'fade' ? `Fade degens → ${teamShort}`
                  : signal.signalType === 'sharp+fade' ? `Sharp + Fade → ${teamShort}`
                  : signal.signalType === 'sharp' ? `Sharp money → ${teamShort}`
                  : `Volume → ${teamShort}`}
              </span>
            </div>
            {signal.bestTier !== 'UNKNOWN' && (
              <Badge
                color={signal.bestTier === 'ELITE' ? B.gold : B.green}
                bg={signal.bestTier === 'ELITE' ? B.goldDim : B.greenDim}
              >{signal.bestTier}</Badge>
            )}
            <span style={{ ...T.micro, color: B.textMuted, marginLeft: 'auto' }}>
              {fmtVol(signal.whaleCash)} whale $
              {!pinnacle && ' · No book data yet'}
            </span>
          </div>
        </div>
      )}

      <div style={{ padding: '0.75rem 1rem' }}>
        {/* Score bar */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ ...T.micro, color: B.textMuted }}>Signal Strength</span>
            <span style={{ ...T.micro, color: barColor, fontWeight: 700 }}>{signal.score}/100</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '3px', width: `${signal.score}%`,
              background: `linear-gradient(90deg, ${barColor}, ${barColor}90)`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Factor pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.5rem' }}>
          {signal.factors.map((f, i) => (
            <span key={i} style={{
              ...T.micro, padding: '0.2rem 0.5rem', borderRadius: '4px',
              background: f.label.includes('EV') ? B.greenDim : 'rgba(255,255,255,0.04)',
              border: `1px solid ${f.label.includes('EV') ? 'rgba(16,185,129,0.2)' : B.borderSubtle}`,
              color: f.label.includes('EV') ? B.green : B.textSec,
            }}>
              {f.label} <span style={{ color: B.green, fontWeight: 700 }}>+{f.pts}</span>
            </span>
          ))}
        </div>

        {/* Book comparison */}
        {pinnacle && Object.keys(allBooks).length > 1 && (
          <div style={{
            borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${B.borderSubtle}`, marginBottom: '0.5rem',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '0.375rem 0.625rem', borderBottom: `1px solid ${B.borderSubtle}` }}>
              <span style={{ ...T.micro, color: B.textMuted }}>Book Prices — {signal.side === 'away' ? game.away : game.home} ML</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {Object.entries(allBooks)
                .sort(([, a], [, b]) => {
                  const aOdds = signal.side === 'away' ? a.away : a.home;
                  const bOdds = signal.side === 'away' ? b.away : b.home;
                  return bOdds - aOdds;
                })
                .map(([key, book]) => {
                  const odds = signal.side === 'away' ? book.away : book.home;
                  const isBest = odds === signal.bestRetail;
                  const isPinn = key === 'pinnacle';
                  return (
                    <div key={key} style={{
                      flex: '1 1 auto', minWidth: '80px',
                      padding: '0.4rem 0.625rem',
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

        {/* Pinnacle movement */}
        {pinnacle?.opener && pinnacle?.current && (
          <div style={{
            display: 'flex', gap: '1rem', padding: '0.375rem 0.625rem',
            borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${B.borderSubtle}`, marginBottom: '0.5rem',
          }}>
            <span style={{ ...T.micro, color: B.gold, fontWeight: 600 }}>Pinnacle</span>
            <span style={{ ...T.micro, color: B.textSec }}>
              Open: {fmtOdds(pinnacle.opener.away)} / {fmtOdds(pinnacle.opener.home)}
            </span>
            <span style={{ ...T.micro, color: B.text, fontWeight: 600 }}>
              Now: {fmtOdds(pinnacle.current.away)} / {fmtOdds(pinnacle.current.home)}
            </span>
            {pinnacle.movement?.direction && (
              <span style={{
                ...T.micro, fontWeight: 700, marginLeft: 'auto',
                color: pinnacle.movement.direction === signal.side ? B.green : B.red,
              }}>
                {pinnacle.movement.direction === signal.side ? '✓ Confirms' : '✗ Opposes'}
              </span>
            )}
          </div>
        )}

        {/* Sharp Positions (proactive wallet scan) */}
        {signal.sharpPositions && signal.sharpPositions.positions?.length > 0 && (
          <SharpPositionsBlock positions={signal.sharpPositions} game={game} signal={signal} />
        )}

        {/* Expand whale trades */}
        <button onClick={() => setExpanded(!expanded)} style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer',
          ...T.micro, color: B.textMuted, background: 'none', border: 'none', padding: '0.25rem 0',
        }}>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Hide' : 'Show'} whale trades ({game.allWhales.length})
        </button>
        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.375rem' }}>
            {game.allWhales.slice(0, 8).map((w, i) => (
              <WhaleTradeRow key={`${w.ts}-${i}`} trade={w} whaleProfiles={whaleProfiles} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SharpPositionsBlock({ positions, game, signal }) {
  const pos = positions.positions;
  const summary = positions.summary;
  const awayShort = game.away.split(' ').pop();
  const homeShort = game.home.split(' ').pop();
  const consensusTeam = summary.consensus === 'away' ? awayShort : homeShort;

  return (
    <div style={{
      borderRadius: '8px', marginBottom: '0.5rem', overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.01) 100%)',
      border: `1px solid ${B.goldBorder}`,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.5rem 0.625rem',
        borderBottom: `1px solid rgba(212,175,55,0.12)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ ...T.micro, fontWeight: 700, color: B.gold }}>
            SHARP WALLETS IN
          </span>
          <span style={{ ...T.micro, color: B.textSec }}>
            {pos.length} position{pos.length !== 1 ? 's' : ''} · {fmtVol(summary.totalInvested)} invested
          </span>
        </div>
        {summary.consensus && (
          <span style={{
            ...T.micro, fontWeight: 800, color: B.gold,
            padding: '0.1rem 0.4rem', borderRadius: '4px',
            background: B.goldDim,
          }}>
            {consensusTeam}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {pos.map((p, i) => {
          const sideTeam = p.side === 'away' ? game.away : game.home;
          const sideShort = sideTeam.split(' ').pop();
          const pnlColor = p.pnl >= 0 ? B.green : B.red;
          const tierColors = {
            ELITE: { color: B.gold, bg: B.goldDim },
            PROVEN: { color: B.green, bg: B.greenDim },
          };
          const tc = tierColors[p.tier] || { color: B.textMuted, bg: 'rgba(255,255,255,0.04)' };

          return (
            <div key={`${p.wallet}-${i}`} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 0.625rem',
              borderBottom: i < pos.length - 1 ? `1px solid rgba(212,175,55,0.08)` : 'none',
              flexWrap: 'wrap',
            }}>
              <Badge color={tc.color} bg={tc.bg}>{p.tier}</Badge>
              <span style={{
                ...T.micro, color: B.text, fontWeight: 600,
                maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                ...{p.wallet.slice(-4)}
              </span>
              <span style={{
                ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
                color: p.totalPnl >= 0 ? B.green : B.red,
              }}>
                {p.totalPnl >= 0 ? '+' : ''}{fmtVol(p.totalPnl)}
              </span>
              <span style={{ ...T.micro, color: B.gold, fontWeight: 700 }}>
                {sideShort}
              </span>
              <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                {fmtVol(p.invested)} @ {Math.round(p.avgPrice * 100)}¢
              </span>
              <span style={{
                ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
                color: pnlColor, marginLeft: 'auto',
              }}>
                {p.pnl >= 0 ? '+' : ''}{fmtVol(p.pnl)}
              </span>
              <span style={{
                ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'",
              }}>
                now {Math.round(p.curPrice * 100)}¢
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sharp Position Card (elevated, full-featured) ────────────────────────────

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

function MiniSparkline({ points, width = 140, height = 32, color = B.gold, label, startLabel, endLabel }) {
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
}

function rateValue(evEdge, sharpCount, pinnConfirms, totalInvested) {
  let pts = 0;
  if (evEdge > 3) pts += 4;
  else if (evEdge > 1) pts += 3;
  else if (evEdge > 0) pts += 2;
  if (sharpCount >= 3) pts += 3;
  else if (sharpCount >= 2) pts += 2;
  else pts += 1;
  if (pinnConfirms) pts += 2;
  if (totalInvested >= 10000) pts += 2;
  else if (totalInvested >= 3000) pts += 1;

  if (pts >= 8) return { label: 'STRONG VALUE', color: B.green, bg: B.greenDim, icon: '◆◆◆' };
  if (pts >= 5) return { label: 'VALUE', color: B.green, bg: 'rgba(16,185,129,0.08)', icon: '◆◆' };
  if (pts >= 3) return { label: 'LEAN', color: B.gold, bg: B.goldDim, icon: '◆' };
  return { label: 'MONITOR', color: B.textSec, bg: 'rgba(255,255,255,0.04)', icon: '○' };
}

function SharpPositionCard({ gd, pinnacleHistory, polyData, isMobile }) {
  const [showWallets, setShowWallets] = useState(false);
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

  // Price movement data
  const pinnHistory = pinnGame?.history || [];
  const polyGame = polyData?.[gd.sport]?.[gd.key];
  const polyPriceHistory = polyGame?.priceHistory;
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

  // Lock-In Criteria System
  const criteria = [
    { id: 'sharps', label: '3+ Sharp Wallets', met: uniqueWallets >= 3 },
    { id: 'ev', label: '+EV Edge', met: hasEV },
    { id: 'pinnacle', label: 'Pinnacle Confirms', met: pinnConfirms },
    { id: 'invested', label: '$5K+ Invested', met: s.totalInvested >= 5000 },
    { id: 'pinnMove', label: 'Line Moving With Play', met: pinnMovingWith },
    { id: 'predMarket', label: 'Pred. Market Aligns', met: polyMovingWith },
  ];
  const criteriaMet = criteria.filter(c => c.met).length;
  const isLocked = criteriaMet >= 4 && cGrade.label !== 'CONTESTED';
  const commenceTime = pinnGame?.commence ? new Date(pinnGame.commence).getTime() : null;
  const isGameLive = commenceTime && Date.now() >= commenceTime;
  const lockType = isLocked ? (isGameLive ? 'LIVE' : 'PREGAME') : null;

  const betOdds = bestRetail || consensusOdds;
  const units = isLocked ? calculateUnits(criteriaMet, evEdge || 0, uniqueWallets, s.totalInvested, cGrade.penalty) : 0;
  const ut = unitTier(units);
  const potentialWin = isLocked ? profitFromOdds(betOdds, units) : 0;

  const vr = rateValue(evEdge || 0, uniqueWallets, pinnConfirms, s.totalInvested);
  const isActionable = vr.label === 'STRONG VALUE' || vr.label === 'VALUE';
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
            color: vr.color, background: vr.bg,
            border: `1px solid ${isActionable ? 'rgba(16,185,129,0.2)' : B.goldBorder}`,
          }}>
            {vr.icon} {vr.label}
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
        {/* Top: Recommendation + EV badge + Units */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '0.625rem',
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

        {/* Middle: The actual bet */}
        <div style={{
          display: 'grid', gridTemplateColumns: bestBook ? '1fr auto 1fr' : '1fr',
          gap: '0.625rem', alignItems: 'center',
        }}>
          <div>
            <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.2rem' }}>
              {uniqueWallets} sharp{uniqueWallets !== 1 ? 's' : ''} backing
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
            {uniqueWallets} sharp wallet{uniqueWallets !== 1 ? 's' : ''}
          </span>
          <span style={{
            ...T.micro, padding: '0.15rem 0.45rem', borderRadius: '4px',
            background: 'rgba(255,255,255,0.04)', color: B.textSec,
          }}>
            {fmtVol(s.totalInvested)} invested
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
            {isLocked ? 'PLAY LOCKED — ALL CRITERIA MET' : `LOCK-IN CRITERIA (${criteriaMet}/6)`}
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

          const SidePanel = ({ team, wallets, invested, pnl, isActive, align }) => (
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
                    {wallets} sharp{wallets !== 1 ? 's' : ''}
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
                <SidePanel team={awayShort} wallets={awayWallets} invested={awayInvested} pnl={awayLifetimePnl} isActive={awaySide} align="left" />

                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '0 0.125rem', flexShrink: 0,
                }}>
                  <span style={{ ...T.micro, color: B.textMuted, fontWeight: 700 }}>VS</span>
                </div>

                <SidePanel team={homeShort} wallets={homeWallets} invested={homeInvested} pnl={homeLifetimePnl} isActive={homeSide} align="right" />
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

        {/* ─── Wallet Positions (collapsible) ─── */}
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
        {showWallets && (
          <div style={{
            marginTop: '0.375rem', borderRadius: '8px', overflow: 'hidden',
            border: `1px solid ${B.borderSubtle}`,
          }}>
            {gd.positions.map((p, i) => {
              const sideTeam = p.side === 'away' ? gd.away : gd.home;
              const sideShort = sideTeam.split(' ').pop();
              const posColor = p.pnl >= 0 ? B.green : B.red;
              const lifeColor = (p.totalPnl || 0) >= 0 ? B.green : B.red;
              const tc = p.tier === 'ELITE'
                ? { color: B.gold, bg: B.goldDim }
                : { color: B.green, bg: B.greenDim };

              return (
                <div key={`${p.wallet}-${i}`} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 0.625rem',
                  borderBottom: i < gd.positions.length - 1 ? `1px solid ${B.borderSubtle}` : 'none',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  flexWrap: 'wrap',
                }}>
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
                  <span style={{ ...T.micro, color: B.gold, fontWeight: 700, marginLeft: 'auto' }}>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SharpFlow() {
  const { polyData, kalshiData, whaleProfiles, pinnacleHistory, sharpPositions, loading } = useMarketData();
  const [sportFilter, setSportFilter] = useState('All');
  const [viewMode, setViewMode] = useState('whaleSignals');
  const [gameSort, setGameSort] = useState('volume');
  const [signalSort, setSignalSort] = useState('divergence');
  const [signalType, setSignalType] = useState('all');
  const [tradeView, setTradeView] = useState('largest');
  const [whaleIntelSport, setWhaleIntelSport] = useState('All');
  const [lockedPicks, setLockedPicks] = useState({});
  const [allTimePnL, setAllTimePnL] = useState(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Load existing locked picks + all-time P&L on mount
  useEffect(() => {
    loadLockedPicks(todayET()).then(setLockedPicks);
    loadAllTimePnL().then(setAllTimePnL);
  }, []);

  // Auto-lock qualifying picks to Firebase
  const syncLockedPicks = useCallback(() => {
    if (!sharpPositions || !pinnacleHistory) return;
    const date = todayET();
    for (const sport of ['NHL', 'CBB']) {
      const sportGames = sharpPositions?.[sport] || {};
      for (const [key, gd] of Object.entries(sportGames)) {
        if (!gd.positions || gd.positions.length === 0) continue;
        const s = gd.summary;
        const side = s.consensus;
        const team = side === 'away' ? gd.away : gd.home;
        const pinnGame = pinnacleHistory?.[sport]?.[key];
        const uniqueWallets = new Set(gd.positions.map(p => p.wallet)).size;
        const odds = side === 'away' ? pinnGame?.current?.away : pinnGame?.current?.home;
        const bestRetail = side === 'away' ? pinnGame?.bestAway : pinnGame?.bestHome;
        const bestBook = side === 'away' ? pinnGame?.bestAwayBook : pinnGame?.bestHomeBook;
        const pinnProb = impliedProb(odds);
        const retailProb = impliedProb(bestRetail);
        const evEdge = (pinnProb && retailProb) ? +((pinnProb - retailProb) * 100).toFixed(1) : null;
        const hasEV = evEdge != null && evEdge > 0;
        const pinnMoved = pinnGame?.movement?.direction;
        const pinnConfirms = pinnMoved === side;

        const pinnHistory = pinnGame?.history || [];
        const pinnPoints = side === 'away' ? pinnHistory.map(h => h.away) : pinnHistory.map(h => h.home);
        const pinnFirstP = impliedProb(pinnPoints[0]);
        const pinnLastP = impliedProb(pinnPoints[pinnPoints.length - 1]);
        const pinnMovingWith = pinnPoints.length >= 2 && pinnLastP > pinnFirstP;

        const polyGame = polyData?.[sport]?.[key];
        const polyPts = polyGame?.priceHistory?.points || [];
        const polyMovingWith = polyPts.length >= 2 && (side === 'away'
          ? polyPts[polyPts.length - 1] > polyPts[0]
          : polyPts[polyPts.length - 1] < polyPts[0]);

        // Consensus strength
        const awayPositions = gd.positions.filter(p => p.side === 'away');
        const homePositions = gd.positions.filter(p => p.side === 'home');
        const consWallets = side === 'away' ? new Set(awayPositions.map(p => p.wallet)).size : new Set(homePositions.map(p => p.wallet)).size;
        const oppWallets = side === 'away' ? new Set(homePositions.map(p => p.wallet)).size : new Set(awayPositions.map(p => p.wallet)).size;
        const consInvested = side === 'away' ? (s.awayInvested || 0) : (s.homeInvested || 0);
        const oppInvested = side === 'away' ? (s.homeInvested || 0) : (s.awayInvested || 0);
        const totalInv = consInvested + oppInvested;
        const mPct = totalInv > 0 ? (consInvested / totalInv) * 100 : 50;
        const wPct = (consWallets + oppWallets) > 0 ? (consWallets / (consWallets + oppWallets)) * 100 : 50;
        const cGrade = consensusGrade(mPct, wPct);

        const checks = [
          uniqueWallets >= 3,
          hasEV,
          pinnConfirms,
          s.totalInvested >= 5000,
          pinnMovingWith,
          polyMovingWith,
        ];
        const criteriaMet = checks.filter(Boolean).length;
        const docId = `${date}_${key}`;

        if (criteriaMet >= 4 && cGrade.label !== 'CONTESTED' && !lockedPicks[docId]) {
          const commenceTime = pinnGame?.commence ? new Date(pinnGame.commence).getTime() : null;
          const isLive = commenceTime && Date.now() >= commenceTime;
          const lockType = isLive ? 'LIVE' : 'PREGAME';

          const betOdds = bestRetail || odds;
          const units = calculateUnits(criteriaMet, evEdge || 0, uniqueWallets, s.totalInvested, cGrade.penalty);
          const potentialProfit = profitFromOdds(betOdds, units);
          const pick = {
            date,
            sport,
            gameKey: key,
            away: gd.away,
            home: gd.home,
            consensusSide: side,
            consensusTeam: team,
            market: 'MONEYLINE',
            lockType,
            consensusStrength: { moneyPct: Math.round(mPct), walletPct: Math.round(wPct), grade: cGrade.label },
            criteriaMet,
            criteria: {
              sharps3Plus: uniqueWallets >= 3,
              plusEV: hasEV,
              pinnacleConfirms: pinnConfirms,
              invested5kPlus: s.totalInvested >= 5000,
              lineMovingWith: pinnMovingWith,
              predMarketAligns: polyMovingWith,
            },
            odds: betOdds,
            book: bestBook || 'Pinnacle',
            pinnacleOdds: odds || null,
            evEdge: evEdge || 0,
            sharpCount: uniqueWallets,
            totalInvested: s.totalInvested,
            units,
            unitTier: unitTier(units).label,
            potentialProfit: +potentialProfit.toFixed(2),
            lockedAt: Date.now(),
            status: 'PENDING',
            result: {
              outcome: null,
              awayScore: null,
              homeScore: null,
              winner: null,
              profit: null,
              gradedAt: null,
            },
          };
          writeLockedPick(pick);
          setLockedPicks(prev => ({ ...prev, [docId]: pick }));
        }
      }
    }
  }, [sharpPositions, pinnacleHistory, polyData, lockedPicks]);

  useEffect(() => { syncLockedPicks(); }, [syncLockedPicks]);

  const allGames = useMemo(
    () => (polyData || kalshiData) ? buildGameData(polyData, kalshiData) : [],
    [polyData, kalshiData]
  );

  const filteredGames = useMemo(() => {
    let g = allGames;
    if (sportFilter !== 'All') g = g.filter(gm => gm.sport === sportFilter);
    return g;
  }, [allGames, sportFilter]);

  const sharpSignals = useMemo(() => {
    let signals = filteredGames.filter(g => g.totalTrades > 0 && g.ticketDivergence >= 10);

    if (signalType === 'reverse') {
      signals = signals.filter(g => {
        const ticketFav = g.awayTicketPct >= g.homeTicketPct ? 'away' : 'home';
        const moneyFav = g.awayMoneyPct >= g.homeMoneyPct ? 'away' : 'home';
        return ticketFav !== moneyFav;
      });
    }

    if (signalSort === 'divergence') signals.sort((a, b) => b.ticketDivergence - a.ticketDivergence);
    else if (signalSort === 'volume') signals.sort((a, b) => b.volume - a.volume);
    else if (signalSort === 'whales') signals.sort((a, b) => b.whaleCash - a.whaleCash);
    else if (signalSort === 'active') signals.sort((a, b) => b.latestTradeTs - a.latestTradeTs);

    return signals;
  }, [filteredGames, signalSort, signalType]);

  const sortedGames = useMemo(() => {
    const g = [...filteredGames];
    if (gameSort === 'volume') g.sort((a, b) => b.volume - a.volume);
    else if (gameSort === 'divergence') g.sort((a, b) => b.ticketDivergence - a.ticketDivergence);
    else if (gameSort === 'whales') g.sort((a, b) => b.whaleCash - a.whaleCash);
    else if (gameSort === 'active') g.sort((a, b) => b.latestTradeTs - a.latestTradeTs);
    return g;
  }, [filteredGames, gameSort]);

  const topTrades = useMemo(() => {
    const all = [];
    for (const g of filteredGames) {
      for (const w of g.allWhales) all.push(w);
    }
    return all.sort((a, b) => b.amount - a.amount).slice(0, 10);
  }, [filteredGames]);

  const recentTrades = useMemo(() => {
    const all = [];
    for (const g of filteredGames) {
      for (const w of g.allWhales) all.push(w);
    }
    return all.filter(t => t.ts).sort((a, b) => b.ts - a.ts).slice(0, 10);
  }, [filteredGames]);

  const whaleSignals = useMemo(() => {
    return filteredGames
      .map(g => ({ game: g, signal: scoreWhaleSignal(g, whaleProfiles, pinnacleHistory, sharpPositions) }))
      .filter(({ signal }) => signal && signal.score >= 20)
      .sort((a, b) => {
        const aEV = a.signal.evEdge || 0;
        const bEV = b.signal.evEdge || 0;
        if (aEV > 0 && bEV <= 0) return -1;
        if (bEV > 0 && aEV <= 0) return 1;
        if (aEV > 0 && bEV > 0) return bEV - aEV;
        return b.signal.score - a.signal.score;
      });
  }, [filteredGames, whaleProfiles, pinnacleHistory, sharpPositions]);

  const totalVol = filteredGames.reduce((s, g) => s + g.volume, 0);
  const totalTrades = filteredGames.reduce((s, g) => s + g.totalTrades, 0);
  const totalWhales = filteredGames.reduce((s, g) => s + g.whaleCount, 0);

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

      {/* ─── Money Flow View ─── */}
      {viewMode === 'flow' && (
        <MoneyFlowView games={filteredGames} isMobile={isMobile} />
      )}

      {/* ─── Whale Signals View ─── */}
      {viewMode === 'whaleSignals' && (() => {
        const evSignals = whaleSignals.filter(({ signal }) => signal.evEdge > 0);
        const otherSignals = whaleSignals.filter(({ signal }) => !signal.evEdge || signal.evEdge <= 0);
        const trackedCount = whaleProfiles ? Object.values(whaleProfiles).filter(p => ['ELITE', 'PROVEN'].includes(p.tier)).length : 0;
        const gamesWithPos = sharpPositions
          ? Object.values(sharpPositions.NHL || {}).length + Object.values(sharpPositions.CBB || {}).length
          : 0;
        const posWithSignals = whaleSignals.filter(({ signal }) => signal.sharpPosCount > 0).length;
        const scannedAt = sharpPositions?.scannedAt
          ? fmtTime(sharpPositions.scannedAt).ago
          : null;

        return (
          <div>
            {/* Sharp tracker summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '0.625rem', marginBottom: '1.5rem',
            }}>
              <FlowStatCard icon={Eye} label="Wallets Tracked" value={trackedCount} accent={B.gold}
                hint="ELITE + PROVEN profitable bettors" />
              <FlowStatCard icon={Lock} label="Locked Plays"
                value={(() => {
                  const locked = Object.values(lockedPicks);
                  const pre = locked.filter(p => p.lockType !== 'LIVE');
                  const live = locked.filter(p => p.lockType === 'LIVE');
                  const preU = pre.reduce((s, p) => s + (p.units || 1), 0);
                  const liveU = live.reduce((s, p) => s + (p.units || 1), 0);
                  if (live.length > 0) return `${pre.length} (${preU.toFixed(1)}u) + ${live.length} live`;
                  return `${pre.length} (${preU.toFixed(1)}u)`;
                })()}
                accent={Object.keys(lockedPicks).length > 0 ? B.green : null}
                hint="Today's locked plays — 4+ criteria met" />
              <FlowStatCard icon={TrendingUp} label="Pre-Game Record"
                value={allTimePnL ? allTimePnL.pregame.record : '—'}
                accent={allTimePnL && allTimePnL.pregame.totalProfit > 0 ? B.green : allTimePnL && allTimePnL.pregame.totalProfit < 0 ? B.red : null}
                hint={allTimePnL
                  ? `${allTimePnL.pregame.totalProfit >= 0 ? '+' : ''}${allTimePnL.pregame.totalProfit.toFixed(1)}u profit${allTimePnL.live.wins + allTimePnL.live.losses > 0 ? ` · Live: ${allTimePnL.live.record}` : ''}`
                  : 'Tracking performance over time'} />
              <FlowStatCard icon={Zap} label="+EV Spots" value={evSignals.length} accent={evSignals.length > 0 ? B.green : null}
                hint="Actionable mispriced lines" />
            </div>

            {/* ─── Sharp Positions Section ─── */}
            {gamesWithPos > 0 && (() => {
              const allPosGames = [];
              for (const sport of ['NHL', 'CBB']) {
                if (whaleIntelSport !== 'All' && sport !== whaleIntelSport) continue;
                const sportGames = sharpPositions?.[sport] || {};
                for (const [key, gd] of Object.entries(sportGames)) {
                  if (!gd.positions || gd.positions.length === 0) continue;
                  if ((gd.summary?.totalInvested || 0) < 1000) continue;
                  allPosGames.push({ key, sport, ...gd });
                }
              }
              allPosGames.sort((a, b) => (b.summary?.totalInvested || 0) - (a.summary?.totalInvested || 0));

              return (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <SectionHead
                      title={`Sharp Positions (${allPosGames.length} games)`}
                      subtitle="Open bets from ELITE & PROVEN wallets — blockchain-verified profitable bettors on Polymarket"
                      icon={Eye}
                      style={{ marginBottom: 0 }}
                    />
                    <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                      {['All', 'NHL', 'CBB'].map(s => (
                        <button key={s} onClick={() => setWhaleIntelSport(s)} style={{
                          padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
                          ...T.micro, fontWeight: 700,
                          border: whaleIntelSport === s ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                          background: whaleIntelSport === s ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
                          color: whaleIntelSport === s ? B.gold : B.textMuted,
                          transition: 'all 0.2s ease',
                        }}>{s}</button>
                      ))}
                    </div>
                  </div>
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
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : allPosGames.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                    gap: '0.75rem',
                  }}>
                    {allPosGames.map(gd => (
                      <SharpPositionCard key={gd.key} gd={gd} pinnacleHistory={pinnacleHistory} polyData={polyData} isMobile={isMobile} />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* +EV Opportunities */}
            <SectionHead
              title={evSignals.length > 0 ? `+EV Opportunities (${evSignals.length})` : 'Whale Intel'}
              subtitle={evSignals.length > 0
                ? 'Sharp money + mispriced retail books — actionable edges'
                : 'Whale trades + Pinnacle lines — scanning for mispriced retail books'}
              icon={Zap}
            />

            {evSignals.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : evSignals.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                gap: '0.75rem', marginBottom: '1.5rem',
              }}>
                {evSignals.map(({ game, signal }) => (
                  <WhaleSignalCard key={game.key} game={game} signal={signal} isMobile={isMobile} whaleProfiles={whaleProfiles} />
                ))}
              </div>
            )}

            {/* Other signals (no +EV yet) */}
            {otherSignals.length > 0 && (
              <>
                <SectionHead
                  title={`Monitoring (${otherSignals.length})`}
                  subtitle="Whale activity detected — watching for retail mispricing"
                  icon={Eye}
                />
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : otherSignals.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                  gap: '0.75rem',
                }}>
                  {otherSignals.map(({ game, signal }) => (
                    <WhaleSignalCard key={game.key} game={game} signal={signal} isMobile={isMobile} whaleProfiles={whaleProfiles} />
                  ))}
                </div>
              </>
            )}

            {whaleSignals.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '3rem', borderRadius: '12px',
                background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                border: `1px solid ${B.border}`,
              }}>
                <Zap size={28} color={B.textMuted} style={{ marginBottom: '0.5rem' }} />
                <div style={{ ...T.sub, color: B.text, marginBottom: '0.25rem' }}>No whale activity detected</div>
                <div style={{ ...T.label, color: B.textSec }}>
                  Signals surface when whale trades appear and book prices are available for comparison.
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
        <FlowStatCard icon={Eye} label="Sharp Signals" value={sharpSignals.length} accent={sharpSignals.length > 0 ? B.gold : null}
          hint="Games where money & tickets disagree" />
      </div>

      {/* ─── Top Whale Positions (condensed leaderboard) ─── */}
      {topTrades.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <SectionHead
              title="Largest Positions"
              subtitle={tradeView === 'largest' ? 'The 10 biggest individual whale trades today' : 'The most recent whale trades today'}
              icon={TrendingUp}
              style={{ marginBottom: 0 }}
            />
            <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
              {[
                { key: 'largest', label: 'Largest' },
                { key: 'recent', label: 'Most Recent' },
              ].map(s => (
                <button key={s.key} onClick={() => setTradeView(s.key)} style={{
                  padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
                  ...T.micro, fontWeight: 700,
                  border: tradeView === s.key ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                  background: tradeView === s.key ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
                  color: tradeView === s.key ? B.gold : B.textMuted,
                  transition: 'all 0.2s ease',
                }}>{s.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(tradeView === 'largest' ? topTrades : recentTrades).map((t, i) => <TopTradeChip key={`${t.ts}-${i}`} trade={t} rank={tradeView === 'largest' ? i : -1} />)}
          </div>
        </div>
      )}

      {/* ─── Sharp Signals (most valuable section) ─── */}
      {sharpSignals.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <SectionHead
            title={`Sharp Signals (${sharpSignals.length})`}
            subtitle="Games where money and tickets disagree — the clearest edge indicators"
            icon={Eye}
          />

          {/* Signal filters */}
          <div style={{
            display: 'flex', gap: '0.375rem', marginBottom: '0.875rem',
            flexWrap: 'wrap', alignItems: 'center',
          }}>
            <span style={{ ...T.micro, color: B.textMuted, marginRight: '0.25rem' }}>Sort:</span>
            {[
              { key: 'divergence', label: 'Divergence' },
              { key: 'volume', label: 'Volume' },
              { key: 'whales', label: 'Whale $' },
              { key: 'active', label: 'Most Active' },
            ].map(s => (
              <button key={s.key} onClick={() => setSignalSort(s.key)} style={{
                padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
                ...T.micro, fontWeight: 700,
                border: signalSort === s.key ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                background: signalSort === s.key ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
                color: signalSort === s.key ? B.gold : B.textMuted,
                transition: 'all 0.2s ease',
              }}>{s.label}</button>
            ))}
            <div style={{ width: '1px', height: '16px', background: B.border, margin: '0 0.25rem' }} />
            <span style={{ ...T.micro, color: B.textMuted, marginRight: '0.25rem' }}>Show:</span>
            {[
              { key: 'all', label: 'All Signals' },
              { key: 'reverse', label: 'Reverse Only' },
            ].map(s => (
              <button key={s.key} onClick={() => setSignalType(s.key)} style={{
                padding: '0.3rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
                ...T.micro, fontWeight: 700,
                border: signalType === s.key ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                background: signalType === s.key ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
                color: signalType === s.key ? B.gold : B.textMuted,
                transition: 'all 0.2s ease',
              }}>{s.label}</button>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : sharpSignals.length === 1 ? '1fr' : 'repeat(2, 1fr)',
            gap: '0.75rem',
          }}>
            {sharpSignals.map(g => <SharpSignalCard key={g.key} game={g} isMobile={isMobile} whaleProfiles={whaleProfiles} />)}
          </div>
        </div>
      )}


      {/* ─── All Games (sortable, expandable) ─── */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionHead
          title={`All Games (${sortedGames.length})`}
          subtitle="Click any game to see full flow breakdown and individual whale trades"
          icon={BarChart3}
        />
        <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
          {[
            { key: 'volume', label: 'Volume' },
            { key: 'divergence', label: 'Divergence' },
            { key: 'whales', label: 'Whale $' },
            { key: 'active', label: 'Most Active' },
          ].map(s => (
            <button key={s.key} onClick={() => setGameSort(s.key)} style={{
              padding: '0.35rem 0.875rem', borderRadius: '6px', cursor: 'pointer',
              ...T.micro, fontWeight: 700,
              border: gameSort === s.key ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
              background: gameSort === s.key ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)` : 'transparent',
              color: gameSort === s.key ? B.gold : B.textMuted,
              transition: 'all 0.2s ease',
            }}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sortedGames.map(g => <GameFlowCard key={g.key} game={g} isMobile={isMobile} whaleProfiles={whaleProfiles} />)}
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
      border: `1px solid ${B.border}`, backdropFilter: 'blur(8px)',
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

function FlowStatCard({ icon: Icon, label, value, accent, hint }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
      padding: '0.875rem 1.25rem 0.625rem', borderRadius: '10px',
      background: 'linear-gradient(135deg, rgba(21,25,35,0.9) 0%, rgba(26,31,46,0.7) 100%)',
      border: `1px solid ${B.border}`, backdropFilter: 'blur(8px)',
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
}

function SportTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.375rem' }}>
      {['All', 'CBB', 'NHL'].map(key => {
        const isActive = active === key;
        const ss = key === 'CBB' ? sportStyle('CBB') : key === 'NHL' ? sportStyle('NHL') : null;
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
              <Zap size={12} /> Whale Intel
            </button>
          </div>
          <SportTabs active={sportFilter} onChange={setSportFilter} />
        </div>
      </div>
    </div>
  );
}

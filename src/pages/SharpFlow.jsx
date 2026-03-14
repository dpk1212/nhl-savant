/**
 * Sharp Flow — Premium Whale Trade Intelligence
 *
 * Game-centric view: every game's full money story in one place.
 * Sharp Signals surface where money disagrees with tickets (the edge).
 * Expandable game cards show individual whale trades in context.
 */

import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Activity, Zap, BarChart3, Eye, ArrowUpRight, ArrowDownRight, Minus, DollarSign, Workflow } from 'lucide-react';

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

// ─── Data Loading ─────────────────────────────────────────────────────────────

function useMarketData() {
  const [polyData, setPolyData] = useState(null);
  const [kalshiData, setKalshiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}polymarket_data.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${import.meta.env.BASE_URL}kalshi_data.json`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([p, k]) => {
      setPolyData(p);
      setKalshiData(k);
      setLoading(false);
    });
  }, []);

  return { polyData, kalshiData, loading };
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
        const isAway = w.outcome?.toLowerCase().includes(away.split(' ').pop().toLowerCase());
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

function SectionHead({ title, subtitle, icon: Icon }) {
  return (
    <div style={{ marginBottom: '0.875rem' }}>
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

function SharpSignalCard({ game, isMobile }) {
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
                <WhaleTradeRow key={`${w.ts}-${i}`} trade={w} />
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

function WhaleTradeRow({ trade }) {
  const time = fmtTime(trade.ts);
  const ti = tierInfo(trade.amount);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.4rem 0.6rem', borderRadius: '6px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${B.borderSubtle}`,
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
      <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
        @{trade.price}¢
      </span>
      <span style={{ ...T.micro, color: B.textSubtle }}>{time.ago}</span>
    </div>
  );
}

// ─── Game Flow Row (compact game summary in grid) ─────────────────────────────

function GameFlowCard({ game, isMobile }) {
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
                    <WhaleTradeRow key={`${w.ts}-${i}`} trade={w} />
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
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.625rem 0.875rem', borderRadius: '10px',
      background: rank === 0
        ? `linear-gradient(135deg, rgba(212,175,55,0.10) 0%, ${B.card} 100%)`
        : `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${rank === 0 ? B.goldBorder : B.border}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {rank === 0 && <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
        background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)`,
      }} />}

      {/* Rank */}
      <div style={{
        width: '22px', height: '22px', borderRadius: '6px',
        background: rank === 0 ? B.goldDim : 'rgba(255,255,255,0.04)',
        border: `1px solid ${rank === 0 ? B.goldBorder : B.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...T.micro, fontWeight: 800, color: rank === 0 ? B.gold : B.textMuted,
        flexShrink: 0,
      }}>
        {rank + 1}
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SharpFlow() {
  const { polyData, kalshiData, loading } = useMarketData();
  const [sportFilter, setSportFilter] = useState('All');
  const [viewMode, setViewMode] = useState('signals');
  const [gameSort, setGameSort] = useState('volume');
  const [signalSort, setSignalSort] = useState('divergence');
  const [signalType, setSignalType] = useState('all');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
    return all.sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [filteredGames]);

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
            {sharpSignals.map(g => <SharpSignalCard key={g.key} game={g} isMobile={isMobile} />)}
          </div>
        </div>
      )}

      {/* ─── Top Whale Positions (condensed leaderboard) ─── */}
      {topTrades.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <SectionHead
            title="Largest Positions"
            subtitle="The 5 biggest individual whale trades today"
            icon={TrendingUp}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {topTrades.map((t, i) => <TopTradeChip key={`${t.ts}-${i}`} trade={t} rank={i} />)}
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
          {sortedGames.map(g => <GameFlowCard key={g.key} game={g} isMobile={isMobile} />)}
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
              border: 'none',
              background: viewMode === 'flow'
                ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
                : 'transparent',
              color: viewMode === 'flow' ? B.gold : B.textMuted,
              transition: 'all 0.2s ease',
            }}>
              <Workflow size={12} /> Money Flow
            </button>
          </div>
          <SportTabs active={sportFilter} onChange={setSportFilter} />
        </div>
      </div>
    </div>
  );
}

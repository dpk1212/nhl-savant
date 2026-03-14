/**
 * Sharp Flow — Premium Whale Trade Intelligence
 *
 * Aggregates every individual whale trade across Polymarket + Kalshi
 * for all CBB and NHL games into a single trading-intelligence page.
 */

import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Filter } from 'lucide-react';

const GOLD = '#F59E0B';
const GOLD_DIM = 'rgba(245, 158, 11, 0.15)';
const GOLD_BORDER = 'rgba(245, 158, 11, 0.3)';
const GREEN = '#10B981';
const RED = '#EF4444';
const SKY = '#0EA5E9';
const SURFACE = 'rgba(15, 23, 42, 0.95)';
const SURFACE_ALT = 'rgba(30, 41, 59, 0.6)';
const BORDER = 'rgba(148, 163, 184, 0.08)';
const TEXT = '#F1F5F9';
const TEXT_DIM = 'rgba(255,255,255,0.4)';
const TEXT_MUTED = 'rgba(255,255,255,0.2)';

function fmtVol(v) {
  if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M';
  if (v >= 1000) return '$' + (v / 1000).toFixed(1) + 'K';
  return '$' + v;
}

function fmtTime(ts) {
  if (!ts) return { et: '', ago: '' };
  const epoch = typeof ts === 'number' ? ts : Date.parse(ts);
  if (isNaN(epoch)) return { et: '', ago: '' };
  const now = Date.now();
  const diffMin = Math.round((now - epoch) / 60000);
  const etStr = new Date(epoch).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true,
  });
  if (diffMin < 1) return { et: etStr, ago: 'just now' };
  if (diffMin < 60) return { et: etStr, ago: `${diffMin}m ago` };
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return { et: etStr, ago: `${diffHr}h ago` };
  return { et: etStr, ago: `${Math.floor(diffHr / 24)}d ago` };
}

function amountColor(amt) {
  if (amt >= 5000) return GOLD;
  if (amt >= 1000) return SKY;
  return TEXT;
}

function amountTier(amt) {
  if (amt >= 10000) return 'MEGA';
  if (amt >= 5000) return 'LARGE';
  if (amt >= 1000) return 'MID';
  return '';
}

function gameLabel(key) {
  return key.replace(/_/g, ' vs ').replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Data Loading ─────────────────────────────────────────────────────────

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

function buildAllTrades(polyData, kalshiData) {
  const trades = [];
  const games = {};

  const processSport = (sport) => {
    const polyGames = polyData?.[sport] || {};
    const kalshiGames = kalshiData?.[sport] || {};
    const allKeys = new Set([...Object.keys(polyGames), ...Object.keys(kalshiGames)]);

    for (const key of allKeys) {
      const poly = polyGames[key];
      const kalshi = kalshiGames[key];

      const awayProb = poly?.awayProb ?? kalshi?.awayProb ?? null;
      const homeProb = poly?.homeProb ?? kalshi?.homeProb ?? null;
      const volume = (poly?.volume24h || 0) + (kalshi?.volume24h || 0);

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

      const away = key.split('_')[0]?.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase()) || '';
      const home = key.split('_').slice(1).join('_')?.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase()) || '';

      const polyWhales = poly?.whales?.topTrades || [];
      const kalshiWhales = kalshi?.whales?.topTrades || [];
      const whaleCount = (poly?.whales?.count || 0) + (kalshi?.whales?.count || 0);
      const whaleCash = (poly?.whales?.totalCash || 0) + (kalshi?.whales?.totalCash || 0);

      const gameInfo = {
        key, sport, away, home, awayProb, homeProb, volume,
        awayTicketPct, homeTicketPct, awayMoneyPct, homeMoneyPct,
        totalTrades, totalCash, whaleCount, whaleCash,
      };
      games[key] = gameInfo;

      for (const t of polyWhales) {
        trades.push({ ...t, gameKey: key, sport, away, home, source: 'poly' });
      }
      for (const t of kalshiWhales) {
        trades.push({ ...t, gameKey: key, sport, away, home, source: 'kalshi' });
      }
    }
  };

  processSport('CBB');
  processSport('NHL');

  trades.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  return { trades, games };
}

// ─── Components ───────────────────────────────────────────────────────────

function SportTabs({ active, onChange }) {
  const tabs = ['All', 'CBB', 'NHL'];
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
          letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
          border: active === t ? `1px solid ${GOLD_BORDER}` : `1px solid ${BORDER}`,
          background: active === t ? GOLD_DIM : 'transparent',
          color: active === t ? GOLD : TEXT_DIM,
          transition: 'all 0.2s ease',
        }}>
          {t === 'CBB' ? '🏀 CBB' : t === 'NHL' ? '🏒 NHL' : '⚡ All'}
        </button>
      ))}
    </div>
  );
}

function StatPill({ label, value, accent }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem',
      padding: '0.5rem 1rem', borderRadius: '8px',
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`,
      minWidth: '100px',
    }}>
      <span style={{ fontSize: '1.125rem', fontWeight: 800, color: accent || TEXT, fontFeatureSettings: "'tnum'" }}>
        {value}
      </span>
      <span style={{ fontSize: '0.625rem', fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
    </div>
  );
}

function TopTradeCard({ trade, rank }) {
  const time = fmtTime(trade.ts);
  const tierLabel = amountTier(trade.amount);
  return (
    <div style={{
      flex: '0 0 200px', padding: '1rem', borderRadius: '12px',
      background: `linear-gradient(135deg, rgba(245, 158, 11, ${0.12 - rank * 0.02}) 0%, rgba(15, 23, 42, 0.95) 100%)`,
      border: `1px solid ${rank === 0 ? GOLD_BORDER : BORDER}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '0.5rem', right: '0.5rem', width: '22px', height: '22px',
        borderRadius: '50%', background: rank === 0 ? GOLD_DIM : 'rgba(255,255,255,0.05)',
        border: `1px solid ${rank === 0 ? GOLD_BORDER : BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.625rem', fontWeight: 800, color: rank === 0 ? GOLD : TEXT_DIM,
      }}>
        {rank + 1}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: GOLD, fontFeatureSettings: "'tnum'", marginBottom: '0.25rem' }}>
        {fmtVol(trade.amount)}
      </div>
      {tierLabel && (
        <span style={{
          fontSize: '0.5rem', fontWeight: 800, color: GOLD, background: GOLD_DIM,
          padding: '0.1rem 0.4rem', borderRadius: '4px', letterSpacing: '0.08em',
          marginBottom: '0.35rem', display: 'inline-block',
        }}>{tierLabel}</span>
      )}
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: TEXT, marginBottom: '0.15rem' }}>
        {trade.side === 'BUY' ? '▲' : '▼'} {trade.outcome || trade.away}
      </div>
      <div style={{ fontSize: '0.625rem', color: TEXT_DIM, marginBottom: '0.25rem' }}>
        {trade.away} vs {trade.home}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.625rem', color: TEXT_MUTED, fontFeatureSettings: "'tnum'" }}>
          @{trade.price}¢
        </span>
        <span style={{ fontSize: '0.5rem', color: TEXT_MUTED }}>
          {time.ago}
        </span>
      </div>
      <span style={{
        position: 'absolute', bottom: '0.5rem', right: '0.5rem',
        fontSize: '0.5rem', fontWeight: 600, color: TEXT_MUTED,
        background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '3px',
      }}>
        {trade.sport}
      </span>
    </div>
  );
}

function FlowBar({ awayPct, homePct, awayLabel, homeLabel, height = 12 }) {
  const favAway = awayPct >= homePct;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <span style={{ fontSize: '0.5rem', fontWeight: 600, color: favAway ? TEXT : TEXT_DIM }}>{awayLabel} {awayPct}%</span>
        <span style={{ fontSize: '0.5rem', fontWeight: 600, color: !favAway ? TEXT : TEXT_DIM }}>{homePct}% {homeLabel}</span>
      </div>
      <div style={{ display: 'flex', height: `${height}px`, borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', gap: '1px' }}>
        {awayPct > 0 && <div style={{ width: `${awayPct}%`, background: favAway ? 'linear-gradient(90deg, #3B82F6, #60A5FA)' : 'rgba(59,130,246,0.25)', transition: 'width 0.4s ease' }} />}
        {homePct > 0 && <div style={{ width: `${homePct}%`, background: !favAway ? `linear-gradient(90deg, ${GREEN}, #34D399)` : `${GREEN}40`, transition: 'width 0.4s ease' }} />}
      </div>
    </div>
  );
}

function DivergenceCard({ game }) {
  const ticketFav = game.awayTicketPct >= game.homeTicketPct ? 'away' : 'home';
  const moneyFav = game.awayMoneyPct >= game.homeMoneyPct ? 'away' : 'home';
  const divergence = Math.abs(game.awayTicketPct - game.awayMoneyPct);
  const sharpTeam = moneyFav === 'away' ? game.away : game.home;
  const signal = ticketFav !== moneyFav
    ? `Sharps loading ${sharpTeam}`
    : `Heavy money on ${sharpTeam}`;

  return (
    <div style={{
      padding: '0.75rem', borderRadius: '10px',
      background: SURFACE, border: `1px solid ${GOLD_BORDER}`,
      minWidth: '280px', flex: '1 1 280px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: TEXT }}>
          {game.away} vs {game.home}
        </span>
        <span style={{
          fontSize: '0.5rem', fontWeight: 800, color: GOLD, background: GOLD_DIM,
          padding: '0.1rem 0.4rem', borderRadius: '4px', letterSpacing: '0.05em',
        }}>
          {divergence.toFixed(0)}pt SPLIT
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.5rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tickets</span>
          <FlowBar awayPct={game.awayTicketPct} homePct={game.homeTicketPct} awayLabel={game.away} homeLabel={game.home} height={10} />
        </div>
        <div>
          <span style={{ fontSize: '0.5rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Money</span>
          <FlowBar awayPct={game.awayMoneyPct} homePct={game.homeMoneyPct} awayLabel={game.away} homeLabel={game.home} height={10} />
        </div>
      </div>
      <div style={{
        fontSize: '0.625rem', fontWeight: 700, color: GOLD,
        display: 'flex', alignItems: 'center', gap: '0.3rem',
      }}>
        💰 {signal}
      </div>
    </div>
  );
}

function HeatmapTile({ game, maxVol, onClick }) {
  const ratio = maxVol > 0 ? game.whaleCash / maxVol : 0;
  const lopsided = Math.abs((game.awayMoneyPct || 50) - 50);
  const intensity = Math.min(0.4, 0.08 + lopsided / 100 * 0.5);
  const parts = game.key.split('_');
  const abbr = parts.length >= 2
    ? (parts[0].substring(0, 3) + ' v ' + parts[parts.length - 1].substring(0, 3)).toUpperCase()
    : game.key.toUpperCase();

  return (
    <div onClick={onClick} style={{
      padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
      background: `rgba(245, 158, 11, ${intensity})`,
      border: `1px solid rgba(245, 158, 11, ${0.1 + ratio * 0.3})`,
      minWidth: `${60 + ratio * 40}px`, flex: `0 0 ${60 + ratio * 40}px`,
      textAlign: 'center', transition: 'all 0.2s ease',
    }}>
      <div style={{ fontSize: '0.625rem', fontWeight: 700, color: TEXT, marginBottom: '0.15rem' }}>{abbr}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: GOLD, fontFeatureSettings: "'tnum'" }}>{fmtVol(game.whaleCash)}</div>
      <div style={{ fontSize: '0.5rem', color: TEXT_DIM }}>{game.whaleCount} trades</div>
      <div style={{
        fontSize: '0.438rem', fontWeight: 600, color: TEXT_MUTED, marginTop: '0.15rem',
        background: 'rgba(255,255,255,0.05)', borderRadius: '3px', padding: '0.05rem 0.2rem',
      }}>{game.sport}</div>
    </div>
  );
}

function TradeRow({ trade, expanded, onToggle }) {
  const time = fmtTime(trade.ts);
  const ac = amountColor(trade.amount);
  return (
    <>
      <tr onClick={onToggle} style={{ cursor: 'pointer', borderBottom: `1px solid ${BORDER}` }}>
        <td style={{ ...cellStyle, width: '110px' }}>
          <div style={{ fontSize: '0.688rem', fontWeight: 600, color: TEXT_DIM, fontFeatureSettings: "'tnum'" }}>{time.et}</div>
          <div style={{ fontSize: '0.5rem', color: TEXT_MUTED }}>{time.ago}</div>
        </td>
        <td style={{ ...cellStyle, width: '40px' }}>
          <span style={{
            fontSize: '0.5rem', fontWeight: 700, padding: '0.1rem 0.3rem', borderRadius: '3px',
            background: trade.sport === 'CBB' ? 'rgba(255,107,53,0.15)' : 'rgba(212,175,55,0.15)',
            color: trade.sport === 'CBB' ? '#FF6B35' : '#D4AF37',
          }}>{trade.sport}</span>
        </td>
        <td style={{ ...cellStyle, minWidth: '120px' }}>
          <div style={{ fontSize: '0.688rem', fontWeight: 600, color: TEXT }}>{trade.away} vs {trade.home}</div>
        </td>
        <td style={cellStyle}>
          <span style={{ fontSize: '0.688rem', fontWeight: 700, color: TEXT }}>{trade.outcome || '—'}</span>
        </td>
        <td style={{ ...cellStyle, width: '50px' }}>
          <span style={{
            fontSize: '0.563rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '4px',
            background: trade.side === 'BUY' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: trade.side === 'BUY' ? GREEN : RED,
          }}>{trade.side}</span>
        </td>
        <td style={{ ...cellStyle, textAlign: 'right', width: '90px' }}>
          <span style={{ fontSize: '0.813rem', fontWeight: 800, color: ac, fontFeatureSettings: "'tnum'" }}>
            {fmtVol(trade.amount)}
          </span>
        </td>
        <td style={{ ...cellStyle, textAlign: 'right', width: '60px' }}>
          <span style={{ fontSize: '0.688rem', color: TEXT_DIM, fontFeatureSettings: "'tnum'" }}>@{trade.price}¢</span>
        </td>
        <td style={{ ...cellStyle, width: '30px', textAlign: 'center' }}>
          {expanded ? <ChevronUp size={12} color={TEXT_DIM} /> : <ChevronDown size={12} color={TEXT_DIM} />}
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
          <td colSpan={8} style={{ padding: '0.5rem 0.75rem' }}>
            <TradeRowExpanded trade={trade} />
          </td>
        </tr>
      )}
    </>
  );
}

function TradeRowExpanded({ trade }) {
  return (
    <div style={{ fontSize: '0.625rem', color: TEXT_DIM, display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <div>
        <span style={{ color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.5rem' }}>Implied Prob</span>
        <div style={{ fontWeight: 700, color: TEXT, fontSize: '0.75rem' }}>{trade.price}%</div>
      </div>
      <div>
        <span style={{ color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.5rem' }}>Source</span>
        <div style={{ fontWeight: 600, color: TEXT }}>{trade.source === 'poly' ? 'Polymarket' : 'Kalshi'}</div>
      </div>
      <div>
        <span style={{ color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.5rem' }}>Matchup</span>
        <div style={{ fontWeight: 600, color: TEXT }}>{trade.away} @ {trade.home}</div>
      </div>
      <div>
        <span style={{ color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.5rem' }}>Position</span>
        <div style={{ fontWeight: 700, color: trade.side === 'BUY' ? GREEN : RED }}>
          {trade.side} {trade.outcome} @{trade.price}¢ — {fmtVol(trade.amount)}
        </div>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: '0.6rem 0.5rem',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};

// ─── Mobile Trade Card (used instead of table rows on small screens) ──────

function MobileTradeCard({ trade }) {
  const time = fmtTime(trade.ts);
  const ac = amountColor(trade.amount);
  const tier = amountTier(trade.amount);
  return (
    <div style={{
      padding: '0.75rem', borderRadius: '10px', background: SURFACE, border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${ac}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
        <div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: ac, fontFeatureSettings: "'tnum'" }}>{fmtVol(trade.amount)}</span>
          {tier && <span style={{ fontSize: '0.438rem', fontWeight: 800, color: GOLD, background: GOLD_DIM, padding: '0.05rem 0.3rem', borderRadius: '3px', marginLeft: '0.3rem' }}>{tier}</span>}
        </div>
        <span style={{
          fontSize: '0.563rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '4px',
          background: trade.side === 'BUY' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: trade.side === 'BUY' ? GREEN : RED,
        }}>{trade.side}</span>
      </div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: TEXT, marginBottom: '0.15rem' }}>{trade.outcome || '—'}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.625rem', color: TEXT_DIM }}>{trade.away} vs {trade.home}</span>
        <span style={{ fontSize: '0.5rem', color: TEXT_MUTED }}>{time.et} · {time.ago}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <span style={{ fontSize: '0.5rem', color: TEXT_MUTED }}>@{trade.price}¢ implied</span>
        <span style={{
          fontSize: '0.438rem', fontWeight: 700, padding: '0.05rem 0.25rem', borderRadius: '3px',
          background: trade.sport === 'CBB' ? 'rgba(255,107,53,0.12)' : 'rgba(212,175,55,0.12)',
          color: trade.sport === 'CBB' ? '#FF6B35' : '#D4AF37',
        }}>{trade.sport} · {trade.source === 'poly' ? 'Poly' : 'Kalshi'}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────

export default function SharpFlow() {
  const { polyData, kalshiData, loading } = useMarketData();
  const [sportFilter, setSportFilter] = useState('All');
  const [sortBy, setSortBy] = useState('time');
  const [expandedRow, setExpandedRow] = useState(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const { trades: allTrades, games: allGames } = useMemo(
    () => (polyData || kalshiData) ? buildAllTrades(polyData, kalshiData) : { trades: [], games: {} },
    [polyData, kalshiData]
  );

  const filteredTrades = useMemo(() => {
    let t = allTrades;
    if (sportFilter !== 'All') t = t.filter(tr => tr.sport === sportFilter);
    if (sortBy === 'amount') t = [...t].sort((a, b) => b.amount - a.amount);
    else t = [...t].sort((a, b) => (b.ts || 0) - (a.ts || 0));
    return t;
  }, [allTrades, sportFilter, sortBy]);

  const filteredGames = useMemo(() => {
    let g = Object.values(allGames);
    if (sportFilter !== 'All') g = g.filter(gm => gm.sport === sportFilter);
    return g;
  }, [allGames, sportFilter]);

  const topTrades = useMemo(() => {
    return [...filteredTrades].sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [filteredTrades]);

  const divergentGames = useMemo(() => {
    return filteredGames
      .filter(g => g.totalTrades > 0 && Math.abs(g.awayTicketPct - g.awayMoneyPct) >= 10)
      .sort((a, b) => Math.abs(b.awayTicketPct - b.awayMoneyPct) - Math.abs(a.awayTicketPct - a.awayMoneyPct));
  }, [filteredGames]);

  const heatmapGames = useMemo(() => {
    return filteredGames.filter(g => g.whaleCount > 0).sort((a, b) => b.whaleCash - a.whaleCash);
  }, [filteredGames]);

  const totalWhaleCash = filteredTrades.reduce((s, t) => s + t.amount, 0);
  const biggestTrade = filteredTrades.length > 0 ? Math.max(...filteredTrades.map(t => t.amount)) : 0;
  const gamesWithActivity = heatmapGames.length;
  const maxHeatVol = heatmapGames.length > 0 ? Math.max(...heatmapGames.map(g => g.whaleCash)) : 1;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: TEXT_DIM }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Loading Sharp Flow...</div>
        </div>
      </div>
    );
  }

  if (filteredTrades.length === 0) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Header sportFilter={sportFilter} setSportFilter={setSportFilter} />
        <div style={{
          textAlign: 'center', padding: '3rem', borderRadius: '12px',
          background: SURFACE, border: `1px solid ${BORDER}`, marginTop: '2rem',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📡</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: TEXT, marginBottom: '0.25rem' }}>No whale activity detected</div>
          <div style={{ fontSize: '0.75rem', color: TEXT_DIM }}>
            {sportFilter !== 'All' ? `No ${sportFilter} whale trades found. Try switching to All.` : 'Market data will populate once games are scheduled and trading begins.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '1rem' : '1.5rem 1rem' }}>
      <Header sportFilter={sportFilter} setSportFilter={setSportFilter} />

      {/* Aggregate Stats */}
      <div style={{
        display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center',
        marginBottom: '1.5rem',
      }}>
        <StatPill label="Whale Volume" value={fmtVol(totalWhaleCash)} accent={GOLD} />
        <StatPill label="Trades" value={filteredTrades.length} />
        <StatPill label="Biggest Trade" value={fmtVol(biggestTrade)} accent={GOLD} />
        <StatPill label="Active Games" value={gamesWithActivity} />
      </div>

      {/* Section 1: Top 5 Largest Trades */}
      {topTrades.length > 0 && (
        <Section title="Largest Trades" subtitle="Biggest individual bets today">
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {topTrades.map((t, i) => <TopTradeCard key={`${t.gameKey}-${t.ts}-${i}`} trade={t} rank={i} />)}
          </div>
        </Section>
      )}

      {/* Section 2: Game Activity Heatmap */}
      {heatmapGames.length > 0 && (
        <Section title="Game Activity" subtitle="Sized by volume, colored by conviction">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {heatmapGames.map(g => (
              <HeatmapTile key={g.key} game={g} maxVol={maxHeatVol} onClick={() => {}} />
            ))}
          </div>
        </Section>
      )}

      {/* Section 3: Smart Money Divergence */}
      {divergentGames.length > 0 && (
        <Section title="Smart Money Divergence" subtitle="Where money disagrees with ticket count">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {divergentGames.slice(0, 4).map(g => <DivergenceCard key={g.key} game={g} />)}
          </div>
        </Section>
      )}

      {/* Section 4: Trade Table */}
      <Section title="All Whale Trades" subtitle={`${filteredTrades.length} trades across ${gamesWithActivity} games`}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <SortButton label="Recent" active={sortBy === 'time'} onClick={() => setSortBy('time')} />
          <SortButton label="Biggest" active={sortBy === 'amount'} onClick={() => setSortBy('amount')} />
        </div>

        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredTrades.slice(0, 50).map((t, i) => (
              <MobileTradeCard key={`${t.gameKey}-${t.ts}-${i}`} trade={t} />
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: `1px solid ${BORDER}`, background: SURFACE }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid rgba(148,163,184,0.15)` }}>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>Sport</th>
                  <th style={thStyle}>Game</th>
                  <th style={thStyle}>Team</th>
                  <th style={thStyle}>Side</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Price</th>
                  <th style={{ ...thStyle, width: '30px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.slice(0, 50).map((t, i) => (
                  <TradeRow
                    key={`${t.gameKey}-${t.ts}-${i}`}
                    trade={t}
                    expanded={expandedRow === i}
                    onToggle={() => setExpandedRow(expandedRow === i ? null : i)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}

const thStyle = {
  padding: '0.6rem 0.5rem',
  textAlign: 'left',
  fontSize: '0.563rem',
  fontWeight: 700,
  color: TEXT_MUTED,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
};

function Header({ sportFilter, setSportFilter }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div>
          <h1 style={{
            fontSize: '1.5rem', fontWeight: 900, color: TEXT, margin: 0,
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ color: GOLD }}>⚡</span> Sharp Flow
          </h1>
          <p style={{ fontSize: '0.75rem', color: TEXT_DIM, margin: '0.25rem 0 0 0' }}>
            Real-time whale trades across prediction markets
          </p>
        </div>
        <SportTabs active={sportFilter} onChange={setSportFilter} />
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.625rem', color: TEXT_MUTED, margin: '0.15rem 0 0 0' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function SortButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.625rem', fontWeight: 700,
      cursor: 'pointer', border: `1px solid ${active ? GOLD_BORDER : BORDER}`,
      background: active ? GOLD_DIM : 'transparent', color: active ? GOLD : TEXT_DIM,
      transition: 'all 0.2s ease',
    }}>
      {label}
    </button>
  );
}

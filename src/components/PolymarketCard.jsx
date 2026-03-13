/**
 * MarketIntelCard — Unified Prediction Market Intelligence
 *
 * Merges Polymarket + Kalshi into a single premium view.
 * No source attribution — just clean, actionable market data.
 *
 * Collapsed: consensus probability bar + model agreement signal.
 * Expanded: price trend, smart money flow, whale activity,
 *           spread markets, game totals.
 */

import { useState } from 'react';
import { BarChart3, ChevronDown, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { TYPOGRAPHY, MOBILE_SPACING } from '../utils/designSystem';

const ACCENT = '#10B981';
const ACCENT_DARK = '#059669';
const ACCENT_GLOW = 'rgba(16, 185, 129, 0.25)';
const AMBER = '#F59E0B';
const SKY = '#0EA5E9';
const RED = '#F87171';

export default function PolymarketCard({
  data, kalshiData, isMobile, awayTeam, homeTeam,
  modelAwayProb, modelHomeProb, modelPick,
}) {
  const [expanded, setExpanded] = useState(false);
  const hasPoly = !!data;
  const hasKalshi = !!kalshiData;
  if (!hasPoly && !hasKalshi) return null;

  // ─── Polymarket data ────────────────────────────────────────────────
  const {
    volume24h: polyVol = 0, liveVolume: polyLive,
    priceMove1h,
    awayMoneyPct: polyAwayMoney, homeMoneyPct: polyHomeMoney,
    awayTicketPct: polyAwayTicket, homeTicketPct: polyHomeTicket,
    tradeCount: polyTradeCount,
    awayProb: polyAwayPct, homeProb: polyHomePct,
    priceHistory, whales,
  } = data || {};

  // ─── Kalshi data ────────────────────────────────────────────────────
  const kAwayPct = kalshiData?.awayProb ?? null;
  const kHomePct = kalshiData?.homeProb ?? null;
  const kVol = kalshiData?.volume24h ?? 0;
  const kSpreads = kalshiData?.spreads ?? null;
  const kTotals = kalshiData?.totals ?? null;
  const hasKalshiProb = kAwayPct != null && kHomePct != null;

  // ─── Consensus probabilities ───────────────────────────────────────
  const hasPolyProb = polyAwayPct != null && polyHomePct != null;
  const hasAnyProb = hasPolyProb || hasKalshiProb;

  let consAwayPct, consHomePct;
  if (hasPolyProb && hasKalshiProb) {
    consAwayPct = Number(((polyAwayPct + kAwayPct) / 2).toFixed(1));
    consHomePct = Number(((polyHomePct + kHomePct) / 2).toFixed(1));
  } else if (hasPolyProb) {
    consAwayPct = polyAwayPct;
    consHomePct = polyHomePct;
  } else {
    consAwayPct = kAwayPct;
    consHomePct = kHomePct;
  }

  const totalVol = (polyLive ?? polyVol ?? 0) + kVol;
  if (totalVol <= 0 && !hasAnyProb) return null;

  const away = awayTeam || data?.awayTeam || kalshiData?.awayTeam || '?';
  const home = homeTeam || data?.homeTeam || kalshiData?.homeTeam || '?';
  const consFavAway = hasAnyProb ? consAwayPct >= consHomePct : null;
  const hasModelProb = modelAwayProb != null && modelHomeProb != null && modelAwayProb > 0;

  // ─── Agreement signal ──────────────────────────────────────────────
  let agreementSignal = null;
  if (hasAnyProb && hasModelProb && modelPick) {
    const pickIsAway = modelPick === 'away' || modelPick === away;
    const consPick = pickIsAway ? consAwayPct : consHomePct;
    const modelPickProb = pickIsAway ? modelAwayProb : modelHomeProb;
    const mktAgrees = consPick > 50;
    const delta = Math.abs(consPick - modelPickProb).toFixed(0);
    const pickTeam = pickIsAway ? away : home;

    if (mktAgrees) {
      agreementSignal = {
        agrees: true, label: 'AGREES',
        detail: consPick > modelPickProb
          ? `Markets +${delta}% more bullish on ${pickTeam}`
          : `Markets aligned, model +${delta}% more confident`,
        color: ACCENT,
      };
    } else {
      agreementSignal = {
        agrees: false, label: 'DIVERGES',
        detail: `Markets favor ${consFavAway ? away : home} — contrarian edge`,
        color: AMBER,
      };
    }
  }

  // ─── Derived data ──────────────────────────────────────────────────
  const volTier = (() => {
    if (totalVol >= 500_000) return { label: 'HIGH VOL', color: ACCENT };
    if (totalVol >= 100_000) return { label: 'MOD VOL', color: SKY };
    if (totalVol >= 10_000) return { label: 'LOW VOL', color: AMBER };
    return { label: 'THIN', color: '#64748B' };
  })();

  const formatVol = (v) => {
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
    return `$${Math.round(v)}`;
  };

  const hasWhales = whales && whales.count > 0;
  const hasPriceHist = priceHistory?.points?.length >= 3;
  const whaleTopTrades = whales?.topTrades || [];

  const formatWhaleTime = (ts) => {
    if (!ts) return null;
    const epoch = typeof ts === 'number' ? ts : Date.parse(ts);
    if (isNaN(epoch)) return null;
    const now = Date.now();
    const diffMs = now - epoch;
    const diffMin = Math.round(diffMs / 60000);
    const etStr = new Date(epoch).toLocaleTimeString('en-US', {
      timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true,
    });
    if (diffMin < 1) return { et: etStr, ago: 'just now' };
    if (diffMin < 60) return { et: etStr, ago: `${diffMin}m ago` };
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return { et: etStr, ago: `${diffHr}h ago` };
    return { et: etStr, ago: `${Math.floor(diffHr / 24)}d ago` };
  };


  // Price movement
  const priceChange = priceHistory?.change ?? null;
  const priceMoveDir = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'flat';
  const priceMoveTo = priceChange > 0 ? away : priceChange < 0 ? home : null;
  const moveColor = priceChange === 0 || priceChange == null ? '#94A3B8' : priceChange > 0 ? ACCENT : RED;

  const priceMove1hVal = priceMove1h != null ? Number(priceMove1h) : null;

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${ACCENT}30`,
        borderRadius: MOBILE_SPACING.borderRadius,
        boxShadow: `0 4px 20px rgba(0,0,0,0.2), 0 0 24px ${ACCENT_GLOW}`,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'polyFadeIn 0.4s ease-out both',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 32px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.2), 0 0 24px ${ACCENT_GLOW}`;
      }}
    >
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: '-30%', right: '-10%',
        width: '120px', height: '120px',
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
        borderRadius: '50%', opacity: 0.08, filter: 'blur(30px)', pointerEvents: 'none',
      }} />

      {/* ─── Collapsed Header ─────────────────────────────────────────── */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          cursor: 'pointer',
          padding: isMobile ? '0.75rem 0.875rem' : '0.875rem 1.125rem',
        }}
      >
        {/* Top row: icon + label + volume + tier */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: hasAnyProb ? '0.5rem' : 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px', height: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
              borderRadius: '6px', boxShadow: `0 0 10px ${ACCENT_GLOW}`,
            }}>
              <BarChart3 size={12} color="white" strokeWidth={2.5} />
            </div>
            <span style={{
              ...TYPOGRAPHY.label,
              fontSize: isMobile ? '0.625rem' : TYPOGRAPHY.label.size,
              color: 'rgba(255,255,255,0.5)',
            }}>
              Market Intel
            </span>
            {totalVol > 0 && (
              <span style={{
                fontSize: '0.563rem', color: '#94A3B8', fontWeight: '600',
                fontFeatureSettings: "'tnum'",
              }}>
                {formatVol(totalVol)}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            {volTier && (
              <span style={{
                fontSize: '0.5rem', fontWeight: '700', letterSpacing: '0.05em',
                color: volTier.color, textTransform: 'uppercase',
                padding: '0.1rem 0.3rem',
                background: `${volTier.color}15`, borderRadius: '4px',
                border: `1px solid ${volTier.color}30`,
              }}>
                {volTier.label}
              </span>
            )}
            {polyLive != null && (
              <span style={{
                fontSize: '0.5rem', fontWeight: '600', color: ACCENT,
                display: 'flex', alignItems: 'center', gap: '0.2rem',
              }}>
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: ACCENT, animation: 'polyPulse 2s ease-in-out infinite',
                }} />
                Live
              </span>
            )}
            <ChevronDown
              size={14}
              color="rgba(255,255,255,0.4)"
              style={{
                transition: 'transform 0.2s ease',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              }}
            />
          </div>
        </div>

        {/* Consensus probability bar */}
        {hasAnyProb && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: '0.3rem',
            }}>
              <span style={{
                fontSize: isMobile ? '0.625rem' : '0.688rem',
                fontWeight: '700',
                color: consFavAway ? '#F1F5F9' : 'rgba(255,255,255,0.5)',
                fontFeatureSettings: "'tnum'",
              }}>
                {away} <span style={{ fontWeight: '800', color: consFavAway ? ACCENT : 'inherit' }}>{consAwayPct}%</span>
              </span>
              <span style={{
                fontSize: '0.438rem', fontWeight: '600', color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Moneyline
              </span>
              <span style={{
                fontSize: isMobile ? '0.625rem' : '0.688rem',
                fontWeight: '700',
                color: !consFavAway ? '#F1F5F9' : 'rgba(255,255,255,0.5)',
                fontFeatureSettings: "'tnum'",
              }}>
                <span style={{ fontWeight: '800', color: !consFavAway ? ACCENT : 'inherit' }}>{consHomePct}%</span> {home}
              </span>
            </div>
            <div style={{
              display: 'flex', height: '5px', borderRadius: '3px',
              overflow: 'hidden', background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: `${consAwayPct}%`,
                background: consFavAway
                  ? `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`
                  : 'rgba(255,255,255,0.18)',
                transition: 'width 0.5s ease',
              }} />
              <div style={{
                width: `${consHomePct}%`,
                background: !consFavAway
                  ? `linear-gradient(90deg, ${ACCENT_DARK} 0%, ${ACCENT} 100%)`
                  : 'rgba(255,255,255,0.18)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Agreement signal */}
        {agreementSignal && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            marginTop: '0.4rem',
          }}>
            <span style={{
              fontSize: '0.563rem', fontWeight: '800',
              color: agreementSignal.color, textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {agreementSignal.agrees ? '✓' : '⚡'} {agreementSignal.label}
            </span>
            <span style={{
              fontSize: '0.5rem', fontWeight: '500',
              color: 'rgba(255,255,255,0.45)',
            }}>
              {agreementSignal.detail}
            </span>
          </div>
        )}
      </div>

      {/* ─── Expanded Content ──────────────────────────────────────────── */}
      {expanded && (
        <div style={{
          padding: isMobile ? '0 0.875rem 0.875rem' : '0 1.125rem 1rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          animation: 'polySlideDown 0.25s ease-out',
        }}>

          {/* ── 1. 24h Price Trend ──────────────────────────────────────── */}
          {hasPriceHist && (() => {
            const change = priceHistory.change;
            const rising = change > 0;
            const movingTeam = rising ? away : home;
            const cColor = change === 0 ? '#94A3B8' : rising ? ACCENT : RED;
            const interpretation = change === 0
              ? 'Holding steady — no significant movement'
              : `${movingTeam} gaining confidence — market is ${rising ? 'buying' : 'selling'} ${away}`;
            return (
              <div style={{
                padding: '0.625rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '0.25rem',
                }}>
                  <SectionLabel>24h Price Trend</SectionLabel>
                  <span style={{
                    fontSize: '0.563rem', fontWeight: '700', color: cColor,
                    fontFeatureSettings: "'tnum'",
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                  }}>
                    {change > 0 ? <TrendingUp size={10} /> : change < 0 ? <TrendingDown size={10} /> : null}
                    {priceHistory.open}% → {priceHistory.current}%
                  </span>
                </div>
                <Sparkline points={priceHistory.points} color={cColor} height={36} />
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: '0.25rem',
                }}>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.25)', fontFeatureSettings: "'tnum'" }}>
                    Low: {priceHistory.low}%
                  </span>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.25)', fontFeatureSettings: "'tnum'" }}>
                    High: {priceHistory.high}%
                  </span>
                </div>
                <InsightPill color={cColor} icon={change > 0 ? '↑' : change < 0 ? '↓' : '→'}>
                  {interpretation}
                </InsightPill>
                {priceMove1hVal != null && priceMove1hVal !== 0 && (
                  <InsightPill
                    color={priceMove1hVal > 0 ? ACCENT : RED}
                    style={{ marginTop: '0.375rem' }}
                    bold
                  >
                    Last 1h: {priceMove1hVal > 0 ? '+' : ''}{priceMove1hVal}% toward {priceMove1hVal > 0 ? away : home}
                  </InsightPill>
                )}
              </div>
            );
          })()}

          {/* ── 2. Money & Ticket Flow (per team) ──────────────────────── */}
          {polyAwayTicket > 0 && polyHomeTicket > 0 && (
            <div style={{
              padding: '0.625rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <SectionLabel>Where The Money Is Going</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.375rem' }}>
                {/* Ticket split */}
                <TeamFlowBar
                  label="Tickets"
                  awayPct={polyAwayTicket}
                  homePct={polyHomeTicket}
                  away={away}
                  home={home}
                  total={polyTradeCount}
                  unit="trades"
                />
                {/* Money split */}
                <TeamFlowBar
                  label="Money"
                  awayPct={polyAwayMoney}
                  homePct={polyHomeMoney}
                  away={away}
                  home={home}
                  total={polyLive ?? polyVol}
                  unit="dollars"
                />
              </div>
              {polyAwayMoney > 0 && polyAwayTicket > 0 && Math.abs(polyAwayMoney - polyAwayTicket) > 8 && (
                <InsightPill color={AMBER} icon="💰" style={{ marginTop: '0.5rem' }}>
                  {polyAwayMoney > polyAwayTicket
                    ? `Big money favors ${away} more than ticket count — sharps loading ${away}`
                    : `Big money favors ${home} more than ticket count — sharps loading ${home}`}
                </InsightPill>
              )}
            </div>
          )}

          {/* ── 3. Whale Activity ──────────────────────────────────────── */}
          {hasWhales && (() => {
            const allWhales = whales.topTrades || [];
            let awayTotal = 0, homeTotal = 0;
            for (const wt of allWhales) {
              const team = resolveOutcomeTeam(wt.outcome, away, home);
              if (team === away) awayTotal += wt.amount;
              else if (team === home) homeTotal += wt.amount;
            }
            const teamTotal = awayTotal + homeTotal;
            const awayPctWhale = teamTotal > 0 ? Math.round(awayTotal / teamTotal * 100) : 0;
            const homePctWhale = teamTotal > 0 ? Math.round(homeTotal / teamTotal * 100) : 0;
            const whaleFavAway = awayTotal >= homeTotal;

            return (
            <div style={{
              padding: '0.625rem 0',
              borderBottom: (kSpreads?.length > 0 || kTotals?.length > 0) ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                marginBottom: '0.4rem',
              }}>
                <AlertTriangle size={10} color={AMBER} strokeWidth={2.5} />
                <span style={{
                  fontSize: '0.5rem', fontWeight: '700',
                  color: AMBER, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  Whale Trades ({whales.count} over $500)
                </span>
                <span style={{
                  fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)',
                  marginLeft: 'auto', fontFeatureSettings: "'tnum'",
                }}>
                  {formatVol(whales.totalCash)} total
                </span>
              </div>

              {/* Whale money split by team */}
              {teamTotal > 0 && (awayTotal > 0 || homeTotal > 0) && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginBottom: '0.2rem',
                  }}>
                    <span style={{
                      fontSize: '0.5rem', fontWeight: '700',
                      color: whaleFavAway ? '#F1F5F9' : 'rgba(255,255,255,0.45)',
                      fontFeatureSettings: "'tnum'",
                    }}>
                      {away} {awayPctWhale}%
                      <span style={{ fontWeight: '500', color: 'rgba(255,255,255,0.25)', marginLeft: '0.25rem' }}>
                        {formatVol(awayTotal)}
                      </span>
                    </span>
                    <span style={{
                      fontSize: '0.438rem', fontWeight: '600', color: 'rgba(255,255,255,0.2)',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      Whale $
                    </span>
                    <span style={{
                      fontSize: '0.5rem', fontWeight: '700',
                      color: !whaleFavAway ? '#F1F5F9' : 'rgba(255,255,255,0.45)',
                      fontFeatureSettings: "'tnum'",
                    }}>
                      <span style={{ fontWeight: '500', color: 'rgba(255,255,255,0.25)', marginRight: '0.25rem' }}>
                        {formatVol(homeTotal)}
                      </span>
                      {homePctWhale}% {home}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', height: '6px', borderRadius: '3px',
                    overflow: 'hidden', background: 'rgba(255,255,255,0.06)',
                  }}>
                    {awayPctWhale > 0 && (
                      <div style={{
                        width: `${awayPctWhale}%`,
                        background: whaleFavAway
                          ? `linear-gradient(90deg, ${AMBER} 0%, ${AMBER}CC 100%)`
                          : `${AMBER}60`,
                        transition: 'width 0.5s ease',
                      }} />
                    )}
                    {homePctWhale > 0 && (
                      <div style={{
                        width: `${homePctWhale}%`,
                        background: !whaleFavAway
                          ? `linear-gradient(90deg, ${AMBER}CC 0%, ${AMBER} 100%)`
                          : `${AMBER}60`,
                        transition: 'width 0.5s ease',
                      }} />
                    )}
                  </div>
                </div>
              )}
              {whaleTopTrades.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {whaleTopTrades.map((t, i) => {
                    const outcomeTeam = resolveOutcomeTeam(t.outcome, away, home);
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.3rem 0.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{
                            fontSize: '0.5rem', fontWeight: '700',
                            color: t.side === 'BUY' ? ACCENT : RED,
                            textTransform: 'uppercase', width: '28px',
                          }}>
                            {t.side}
                          </span>
                          <span style={{ fontSize: '0.625rem', fontWeight: '700', color: '#F1F5F9' }}>
                            {outcomeTeam}
                          </span>
                          {t.price && (
                            <span style={{
                              fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)',
                              fontFeatureSettings: "'tnum'",
                            }}>
                              @{t.price}¢
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{
                            fontSize: '0.688rem', fontWeight: '800',
                            color: t.amount >= 5000 ? AMBER : t.amount >= 1000 ? SKY : '#94A3B8',
                            fontFeatureSettings: "'tnum'",
                          }}>
                            {formatVol(t.amount)}
                          </span>
                          {(() => {
                            const wt = formatWhaleTime(t.ts);
                            if (!wt) return null;
                            return (
                              <span style={{
                                fontSize: '0.438rem', color: 'rgba(255,255,255,0.3)',
                                fontFeatureSettings: "'tnum'",
                                display: 'flex', alignItems: 'center', gap: '0.2rem',
                              }}>
                                <span>{wt.et} ET</span>
                                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                                <span style={{ color: ACCENT, fontWeight: '600' }}>{wt.ago}</span>
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            );
          })()}

          {/* ── 4. Spread Markets ──────────────────────────────────────── */}
          {kSpreads && kSpreads.length > 0 && (
            <div style={{
              padding: '0.625rem 0',
              borderBottom: kTotals?.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <SectionLabel>Spread Markets</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.375rem' }}>
                {kSpreads.map((s, i) => (
                  <MarketRow key={i} label={s.label} prob={s.prob} volume={s.volume} />
                ))}
              </div>
            </div>
          )}

          {/* ── 5. Game Totals ─────────────────────────────────────────── */}
          {kTotals && kTotals.length > 0 && (
            <div style={{ padding: '0.625rem 0' }}>
              <SectionLabel>Game Totals</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.375rem' }}>
                {kTotals.map((t, i) => (
                  <MarketRow key={i} label={t.label} prob={t.prob} volume={t.volume} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes polyFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes polyPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes polySlideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 900px; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <span style={{
      fontSize: '0.5rem', fontWeight: '700', color: 'rgba(255,255,255,0.35)',
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {children}
    </span>
  );
}

function InsightPill({ children, color, icon, bold, style }) {
  return (
    <div style={{
      marginTop: '0.375rem', padding: '0.3rem 0.5rem',
      background: `${color}08`, borderRadius: '6px',
      border: `1px solid ${color}15`,
      display: 'flex', alignItems: 'center', gap: '0.3rem',
      ...style,
    }}>
      {icon && (
        <span style={{ fontSize: '0.563rem', fontWeight: '700', color }}>
          {icon}
        </span>
      )}
      <span style={{
        fontSize: '0.563rem',
        fontWeight: bold ? '700' : '500',
        color: bold ? color : 'rgba(255,255,255,0.5)',
      }}>
        {children}
      </span>
    </div>
  );
}

function MarketRow({ label, prob, volume }) {
  const hot = prob >= 60;
  const cold = prob <= 30;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.3rem 0.5rem',
      background: hot ? `${ACCENT}08` : 'rgba(255,255,255,0.03)',
      borderRadius: '5px',
      border: `1px solid ${hot ? `${ACCENT}20` : 'rgba(255,255,255,0.04)'}`,
    }}>
      <span style={{
        fontSize: '0.563rem', fontWeight: '500',
        color: 'rgba(255,255,255,0.6)', flex: 1,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          fontSize: '0.625rem', fontWeight: '700',
          color: hot ? ACCENT : cold ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.6)',
          fontFeatureSettings: "'tnum'",
        }}>
          {prob}%
        </span>
        {volume > 0 && (
          <span style={{
            fontSize: '0.438rem', color: 'rgba(255,255,255,0.25)',
            fontFeatureSettings: "'tnum'",
          }}>
            {volume.toLocaleString()} contracts
          </span>
        )}
      </div>
    </div>
  );
}

function resolveOutcomeTeam(outcome, away, home) {
  if (!outcome) return away;
  const o = outcome.toLowerCase();
  if (o === 'yes') return away;
  if (o === 'no') return home;
  const nAway = away.toLowerCase().replace(/[^a-z0-9]/g, '');
  const nHome = home.toLowerCase().replace(/[^a-z0-9]/g, '');
  const nO = o.replace(/[^a-z0-9]/g, '');
  if (nO.includes(nAway) || nAway.includes(nO)) return away;
  if (nO.includes(nHome) || nHome.includes(nO)) return home;
  return outcome;
}


function fmtVol(v) {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${Math.round(v)}`;
}

function TeamFlowBar({ label, awayPct, homePct, away, home, total, unit }) {
  const favAway = awayPct >= homePct;
  const awayAmt = total > 0 ? Math.round(total * awayPct / 100) : 0;
  const homeAmt = total > 0 ? Math.round(total * homePct / 100) : 0;
  const isDollars = unit === 'dollars';
  const fmtAmt = (n) => isDollars ? fmtVol(n) : n.toLocaleString();
  const hasTotal = total > 0;

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: '0.2rem',
      }}>
        <span style={{
          fontSize: '0.5rem', fontWeight: '700',
          color: favAway ? '#F1F5F9' : 'rgba(255,255,255,0.4)',
          fontFeatureSettings: "'tnum'",
        }}>
          {away} {awayPct}%
          {hasTotal && (
            <span style={{ fontWeight: '500', color: 'rgba(255,255,255,0.25)', marginLeft: '0.25rem', fontSize: '0.438rem' }}>
              {fmtAmt(awayAmt)}
            </span>
          )}
        </span>
        <span style={{
          fontSize: '0.438rem', fontWeight: '600', color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          display: 'flex', alignItems: 'center', gap: '0.3rem',
        }}>
          {label}
          {hasTotal && (
            <span style={{ fontWeight: '500', color: 'rgba(255,255,255,0.15)' }}>
              ({isDollars ? fmtVol(total) : total.toLocaleString()})
            </span>
          )}
        </span>
        <span style={{
          fontSize: '0.5rem', fontWeight: '700',
          color: !favAway ? '#F1F5F9' : 'rgba(255,255,255,0.4)',
          fontFeatureSettings: "'tnum'",
        }}>
          {hasTotal && (
            <span style={{ fontWeight: '500', color: 'rgba(255,255,255,0.25)', marginRight: '0.25rem', fontSize: '0.438rem' }}>
              {fmtAmt(homeAmt)}
            </span>
          )}
          {homePct}% {home}
        </span>
      </div>
      <div style={{
        display: 'flex', height: '16px', borderRadius: '4px',
        overflow: 'hidden', background: 'rgba(255,255,255,0.04)',
        gap: '1px',
      }}>
        <div style={{
          width: `${awayPct}%`,
          background: favAway
            ? `linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)`
            : 'rgba(59,130,246,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'width 0.5s ease',
          minWidth: awayPct > 10 ? '40px' : '0',
        }}>
          {awayPct > 20 && (
            <span style={{
              fontSize: '0.5rem', fontWeight: '700', color: 'white',
              whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}>
              {awayPct}%
            </span>
          )}
        </div>
        <div style={{
          width: `${homePct}%`,
          background: !favAway
            ? `linear-gradient(90deg, ${ACCENT} 0%, #34D399 100%)`
            : `${ACCENT}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'width 0.5s ease',
          minWidth: homePct > 10 ? '40px' : '0',
        }}>
          {homePct > 20 && (
            <span style={{
              fontSize: '0.5rem', fontWeight: '700', color: 'white',
              whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}>
              {homePct}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Sparkline({ points, color, height = 36 }) {
  if (!points || points.length < 2) return null;
  const width = 200;
  const pad = 2;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (p - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  });

  const gradId = `sg-${Math.random().toString(36).slice(2, 8)}`;
  const fillCoords = [`${pad},${height}`, ...coords, `${width - pad},${height}`].join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: `${height}px`, display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillCoords} fill={`url(#${gradId})`} />
      <polyline points={coords.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1].split(',')[0]} cy={coords[coords.length - 1].split(',')[1]} r="2.5" fill={color} />
    </svg>
  );
}

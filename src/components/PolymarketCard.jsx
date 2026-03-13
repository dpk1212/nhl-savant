/**
 * PolymarketCard — Market Intelligence (Collapsible)
 *
 * Collapsed: probability bar + agreement signal as header.
 * Expanded: sparkline, whale trade table, flow bars (tickets + money), stats.
 */

import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, ChevronDown, AlertTriangle } from 'lucide-react';
import { TYPOGRAPHY, MOBILE_SPACING } from '../utils/designSystem';

const ACCENT = '#10B981';
const ACCENT_DARK = '#059669';
const ACCENT_GLOW = 'rgba(16, 185, 129, 0.25)';

export default function PolymarketCard({ data, isMobile, awayTeam, homeTeam, modelAwayProb, modelHomeProb, modelPick }) {
  const [expanded, setExpanded] = useState(false);
  if (!data) return null;

  const {
    volume24h, liveVolume, moneyBuyPct, moneySellPct, ticketBuyPct, ticketSellPct,
    buyPct, sellPct, // backward compat
    priceMove1h, tradeCount,
    awayProb: mktAwayPct, homeProb: mktHomePct,
    priceHistory, whales,
  } = data;

  const mBuyPct = moneyBuyPct ?? buyPct ?? 0;
  const mSellPct = moneySellPct ?? sellPct ?? 0;
  const tBuyPct = ticketBuyPct ?? mBuyPct;
  const tSellPct = ticketSellPct ?? mSellPct;

  const vol = liveVolume ?? volume24h ?? 0;
  if (vol <= 0 && mktAwayPct == null) return null;

  const hasMarketProb = mktAwayPct != null && mktHomePct != null;
  const hasModelProb = modelAwayProb != null && modelHomeProb != null && modelAwayProb > 0;

  const away = awayTeam || data.awayTeam || '?';
  const home = homeTeam || data.homeTeam || '?';
  const mktFavAway = hasMarketProb ? mktAwayPct >= mktHomePct : null;

  // Model vs Market comparison
  let agreementSignal = null;
  if (hasMarketProb && hasModelProb && modelPick) {
    const pickIsAway = modelPick === 'away' || modelPick === away;
    const mktPickProb = pickIsAway ? mktAwayPct : mktHomePct;
    const modelPickProb = pickIsAway ? modelAwayProb : modelHomeProb;
    const mktAgrees = mktPickProb > 50;
    const delta = Math.abs(mktPickProb - modelPickProb).toFixed(0);
    const pickTeam = pickIsAway ? away : home;

    if (mktAgrees) {
      const mktMoreConfident = mktPickProb > modelPickProb;
      agreementSignal = {
        agrees: true, label: 'AGREES',
        detail: mktMoreConfident
          ? `Market +${delta}% more bullish on ${pickTeam}`
          : `Market aligned, model +${delta}% more confident`,
        color: ACCENT,
      };
    } else {
      agreementSignal = {
        agrees: false, label: 'DIVERGES',
        detail: `Market favors ${mktFavAway ? away : home} — contrarian edge`,
        color: '#F59E0B',
      };
    }
  }

  // Price move context — toward which team
  const priceMoveContext = (() => {
    if (priceMove1h == null || !hasMarketProb) return null;
    const move = Number(priceMove1h);
    if (move === 0) return { text: 'Stable', color: '#94A3B8' };
    // Price refers to first team (away). Positive = away gaining, negative = home gaining
    const towardTeam = move > 0 ? away : home;
    return {
      text: `${move > 0 ? '+' : ''}${priceMove1h}% toward ${towardTeam}`,
      color: move > 0 ? ACCENT : '#F87171',
    };
  })();

  const volTier = (() => {
    if (vol >= 500_000) return { label: 'HIGH', color: ACCENT };
    if (vol >= 100_000) return { label: 'MOD', color: '#0EA5E9' };
    if (vol >= 10_000) return { label: 'LOW', color: '#F59E0B' };
    return { label: 'THIN', color: '#64748B' };
  })();

  const formatVol = (v) => {
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
    return `$${Math.round(v)}`;
  };

  const hasWhales = whales && whales.count > 0;
  const hasPriceHist = priceHistory && priceHistory.points && priceHistory.points.length >= 3;
  const whaleTopTrades = whales?.topTrades || [];

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

      {/* Clickable Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          cursor: 'pointer',
          padding: isMobile ? '0.75rem 0.875rem' : '0.875rem 1.125rem',
        }}
      >
        {/* Top row: icon, title, badges */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: hasMarketProb ? '0.5rem' : 0,
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
            {vol > 0 && (
              <span style={{ fontSize: '0.563rem', color: '#94A3B8', fontWeight: '600', fontFeatureSettings: "'tnum'" }}>
                {formatVol(vol)}
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
            {liveVolume != null && (
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

        {/* Probability bar (always visible) */}
        {hasMarketProb && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: '0.3rem',
            }}>
              <span style={{
                fontSize: isMobile ? '0.625rem' : '0.688rem',
                fontWeight: '700', color: mktFavAway ? '#F1F5F9' : 'rgba(255,255,255,0.5)',
                fontFeatureSettings: "'tnum'",
              }}>
                {away} <span style={{ fontWeight: '800', color: mktFavAway ? ACCENT : 'inherit' }}>{mktAwayPct}%</span>
              </span>
              <span style={{
                fontSize: isMobile ? '0.625rem' : '0.688rem',
                fontWeight: '700', color: !mktFavAway ? '#F1F5F9' : 'rgba(255,255,255,0.5)',
                fontFeatureSettings: "'tnum'",
              }}>
                <span style={{ fontWeight: '800', color: !mktFavAway ? ACCENT : 'inherit' }}>{mktHomePct}%</span> {home}
              </span>
            </div>
            <div style={{
              display: 'flex', height: '5px', borderRadius: '3px',
              overflow: 'hidden', background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: `${mktAwayPct}%`,
                background: mktFavAway
                  ? `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`
                  : 'rgba(255,255,255,0.18)',
                transition: 'width 0.5s ease',
              }} />
              <div style={{
                width: `${mktHomePct}%`,
                background: !mktFavAway
                  ? `linear-gradient(90deg, ${ACCENT_DARK} 0%, ${ACCENT} 100%)`
                  : 'rgba(255,255,255,0.18)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Agreement signal (always visible) */}
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

      {/* Expanded Content */}
      {expanded && (
        <div style={{
          padding: isMobile ? '0 0.875rem 0.875rem' : '0 1.125rem 1rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          animation: 'polySlideDown 0.25s ease-out',
        }}>
          {/* Row: Sparkline + Price Move */}
          {(hasPriceHist || priceMoveContext) && (
            <div style={{
              padding: '0.625rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {hasPriceHist && (
                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '0.3rem',
                  }}>
                    <span style={{ fontSize: '0.5rem', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      24h Price ({away})
                    </span>
                    <span style={{
                      fontSize: '0.563rem', fontWeight: '700',
                      color: priceHistory.change >= 0 ? ACCENT : '#F87171',
                      fontFeatureSettings: "'tnum'",
                    }}>
                      {priceHistory.change >= 0 ? '+' : ''}{priceHistory.change}%
                    </span>
                  </div>
                  <Sparkline points={priceHistory.points} color={priceHistory.change >= 0 ? ACCENT : '#F87171'} height={32} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.25)', fontFeatureSettings: "'tnum'" }}>L: {priceHistory.low}%</span>
                    <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.25)', fontFeatureSettings: "'tnum'" }}>H: {priceHistory.high}%</span>
                  </div>
                </div>
              )}
              {priceMoveContext && (
                <div style={{
                  marginTop: hasPriceHist ? '0.5rem' : 0,
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                }}>
                  <span style={{ fontSize: '0.5rem', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>1h:</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: '700', color: priceMoveContext.color, fontFeatureSettings: "'tnum'" }}>
                    {priceMoveContext.text}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Flow Bars: Tickets + Money */}
          <div style={{
            padding: '0.625rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <FlowBar label="% of Tickets" buyPct={tBuyPct} sellPct={tSellPct} awayTeam={away} homeTeam={home} isMobile={isMobile} />
            <FlowBar label="% of Money" buyPct={mBuyPct} sellPct={mSellPct} awayTeam={away} homeTeam={home} isMobile={isMobile} style={{ marginTop: '0.5rem' }} />
          </div>

          {/* Whale Trades Table */}
          {hasWhales && (
            <div style={{ padding: '0.625rem 0' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                marginBottom: '0.4rem',
              }}>
                <AlertTriangle size={10} color="#F59E0B" strokeWidth={2.5} />
                <span style={{
                  fontSize: '0.5rem', fontWeight: '700',
                  color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  Whale Trades ({whales.count} over $500)
                </span>
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto', fontFeatureSettings: "'tnum'" }}>
                  {formatVol(whales.totalCash)} total
                </span>
              </div>
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
                            color: t.side === 'BUY' ? ACCENT : '#F87171',
                            textTransform: 'uppercase', width: '28px',
                          }}>
                            {t.side}
                          </span>
                          <span style={{
                            fontSize: '0.625rem', fontWeight: '700',
                            color: '#F1F5F9',
                          }}>
                            {outcomeTeam}
                          </span>
                          {t.price && (
                            <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontFeatureSettings: "'tnum'" }}>
                              @{t.price}¢
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{
                            fontSize: '0.688rem', fontWeight: '800',
                            color: t.amount >= 5000 ? '#F59E0B' : t.amount >= 1000 ? '#0EA5E9' : '#94A3B8',
                            fontFeatureSettings: "'tnum'",
                          }}>
                            {formatVol(t.amount)}
                          </span>
                          {t.ts && (
                            <span style={{ fontSize: '0.438rem', color: 'rgba(255,255,255,0.2)', fontFeatureSettings: "'tnum'" }}>
                              {t.ts}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
          to { opacity: 1; max-height: 600px; }
        }
      `}</style>
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

function FlowBar({ label, buyPct, sellPct, awayTeam, homeTeam, isMobile, style }) {
  return (
    <div style={style}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '0.25rem',
      }}>
        <span style={{ fontSize: '0.5rem', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
      </div>
      <div style={{
        display: 'flex', height: '14px', borderRadius: '4px',
        overflow: 'hidden', background: 'rgba(255,255,255,0.04)', position: 'relative',
      }}>
        <div style={{
          width: `${buyPct}%`,
          background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT}CC 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'width 0.5s ease', minWidth: buyPct > 5 ? '40px' : '0',
        }}>
          {buyPct > 15 && (
            <span style={{ fontSize: '0.5rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {buyPct}% Buy
            </span>
          )}
        </div>
        <div style={{
          width: `${sellPct}%`,
          background: `linear-gradient(90deg, #F8717180 0%, #F87171 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'width 0.5s ease', minWidth: sellPct > 5 ? '40px' : '0',
        }}>
          {sellPct > 15 && (
            <span style={{ fontSize: '0.5rem', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {sellPct}% Sell
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Sparkline({ points, color, height = 32 }) {
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
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillCoords} fill={`url(#${gradId})`} />
      <polyline points={coords.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1].split(',')[0]} cy={coords[coords.length - 1].split(',')[1]} r="2.5" fill={color} />
    </svg>
  );
}

/**
 * PolymarketCard — Market Intelligence
 *
 * Actionable Polymarket data: market probability bar, model vs market comparison,
 * 24h price sparkline, whale activity, smart money flow, and volume context.
 */

import { BarChart3, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { TYPOGRAPHY, MOBILE_SPACING } from '../utils/designSystem';

const ACCENT = '#10B981';
const ACCENT_DARK = '#059669';
const ACCENT_GLOW = 'rgba(16, 185, 129, 0.25)';

export default function PolymarketCard({ data, isMobile, awayTeam, homeTeam, modelAwayProb, modelHomeProb, modelPick }) {
  if (!data) return null;

  const {
    volume24h, liveVolume, buyPct, sellPct, priceMove1h, tradeCount,
    awayProb: mktAwayPct, homeProb: mktHomePct,
    priceHistory, whales,
  } = data;

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
        agrees: true,
        label: 'AGREES',
        detail: mktMoreConfident
          ? `Market +${delta}% more bullish on ${pickTeam}`
          : `Market aligned, model +${delta}% more confident`,
        color: ACCENT,
      };
    } else {
      agreementSignal = {
        agrees: false,
        label: 'DIVERGES',
        detail: `Market favors ${mktFavAway ? away : home} — contrarian edge`,
        color: '#F59E0B',
      };
    }
  }

  // Smart money signal
  const flowSignal = (() => {
    if (buyPct == null) return null;
    if (buyPct >= 85) return { label: 'Heavy Buying', color: ACCENT, icon: TrendingUp };
    if (buyPct >= 65) return { label: 'Buying Pressure', color: '#0EA5E9', icon: TrendingUp };
    if (buyPct <= 15) return { label: 'Heavy Selling', color: '#F87171', icon: TrendingDown };
    if (buyPct <= 35) return { label: 'Sell Pressure', color: '#F59E0B', icon: TrendingDown };
    return { label: 'Balanced', color: '#94A3B8', icon: Minus };
  })();

  // Volume tier
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

  return (
    <div
      className="polymarket-card"
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${ACCENT}30`,
        borderRadius: MOBILE_SPACING.borderRadius,
        padding: isMobile ? '0.875rem' : '1.125rem',
        boxShadow: `0 4px 20px rgba(0,0,0,0.2), 0 0 24px ${ACCENT_GLOW}`,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'polyFadeIn 0.4s ease-out both',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 32px ${ACCENT_GLOW}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.2), 0 0 24px ${ACCENT_GLOW}`;
      }}
    >
      {/* Background glow orb */}
      <div style={{
        position: 'absolute', top: '-30%', right: '-10%',
        width: '120px', height: '120px',
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
        borderRadius: '50%', opacity: 0.08, filter: 'blur(30px)', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '28px', height: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
            borderRadius: '8px', boxShadow: `0 0 12px ${ACCENT_GLOW}`,
          }}>
            <BarChart3 size={14} color="white" strokeWidth={2.5} />
          </div>
          <span style={{
            ...TYPOGRAPHY.label,
            fontSize: isMobile ? TYPOGRAPHY.caption.size : TYPOGRAPHY.label.size,
            color: 'rgba(255,255,255,0.5)',
          }}>
            Market Intel
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          {volTier && (
            <span style={{
              fontSize: '0.5rem', fontWeight: '700', letterSpacing: '0.05em',
              color: volTier.color, textTransform: 'uppercase',
              padding: '0.125rem 0.375rem',
              background: `${volTier.color}15`, borderRadius: '4px',
              border: `1px solid ${volTier.color}30`,
            }}>
              {volTier.label}
            </span>
          )}
          {liveVolume != null && (
            <span style={{
              fontSize: '0.5rem', fontWeight: '600', color: ACCENT,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              display: 'flex', alignItems: 'center', gap: '0.2rem',
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: ACCENT, display: 'inline-block',
                animation: 'polyPulse 2s ease-in-out infinite',
              }} />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Market Probability Bar */}
      {hasMarketProb && (
        <div style={{ marginBottom: '0.625rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: '0.375rem',
          }}>
            <span style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              fontWeight: '700', color: mktFavAway ? '#F1F5F9' : 'rgba(255,255,255,0.6)',
              fontFeatureSettings: "'tnum'",
            }}>
              {away} <span style={{ fontWeight: '800', color: mktFavAway ? ACCENT : 'inherit' }}>{mktAwayPct}%</span>
            </span>
            <span style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              fontWeight: '700', color: !mktFavAway ? '#F1F5F9' : 'rgba(255,255,255,0.6)',
              fontFeatureSettings: "'tnum'",
            }}>
              <span style={{ fontWeight: '800', color: !mktFavAway ? ACCENT : 'inherit' }}>{mktHomePct}%</span> {home}
            </span>
          </div>
          <div style={{
            display: 'flex', height: '6px', borderRadius: '3px',
            overflow: 'hidden', background: 'rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: `${mktAwayPct}%`,
              background: mktFavAway
                ? `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`
                : 'rgba(255,255,255,0.2)',
              borderRadius: '3px 0 0 3px',
              transition: 'width 0.5s ease',
            }} />
            <div style={{
              width: `${mktHomePct}%`,
              background: !mktFavAway
                ? `linear-gradient(90deg, ${ACCENT_DARK} 0%, ${ACCENT} 100%)`
                : 'rgba(255,255,255,0.2)',
              borderRadius: '0 3px 3px 0',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}

      {/* Model vs Market Agreement */}
      {agreementSignal && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 0.625rem',
          background: `${agreementSignal.color}10`,
          border: `1px solid ${agreementSignal.color}25`,
          borderRadius: '8px',
          marginBottom: '0.625rem',
        }}>
          <span style={{
            fontSize: '0.625rem', fontWeight: '800',
            color: agreementSignal.color, textTransform: 'uppercase',
            letterSpacing: '0.05em', whiteSpace: 'nowrap',
          }}>
            {agreementSignal.agrees ? '✓' : '⚡'} {agreementSignal.label}
          </span>
          <span style={{
            fontSize: isMobile ? '0.563rem' : '0.625rem',
            fontWeight: '500', color: 'rgba(255,255,255,0.55)',
            lineHeight: '1.3',
          }}>
            {agreementSignal.detail}
          </span>
        </div>
      )}

      {/* Price History Sparkline + Whale Activity Row */}
      {(hasPriceHist || hasWhales) && (
        <div style={{
          display: 'flex', gap: '0.625rem', marginBottom: '0.625rem',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}>
          {/* 24h Price Sparkline */}
          {hasPriceHist && (
            <div style={{
              flex: '1 1 55%', minWidth: '140px',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '0.375rem',
              }}>
                <span style={{
                  fontSize: '0.5rem', fontWeight: '600',
                  color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  24h Price
                </span>
                <span style={{
                  fontSize: '0.563rem', fontWeight: '700',
                  color: priceHistory.change >= 0 ? ACCENT : '#F87171',
                  fontFeatureSettings: "'tnum'",
                }}>
                  {priceHistory.change >= 0 ? '+' : ''}{priceHistory.change}%
                </span>
              </div>
              <Sparkline
                points={priceHistory.points}
                color={priceHistory.change >= 0 ? ACCENT : '#F87171'}
                height={28}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '0.25rem',
              }}>
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontFeatureSettings: "'tnum'" }}>
                  L: {priceHistory.low}%
                </span>
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontFeatureSettings: "'tnum'" }}>
                  H: {priceHistory.high}%
                </span>
              </div>
            </div>
          )}

          {/* Whale Activity */}
          {hasWhales && (
            <div style={{
              flex: '1 1 40%', minWidth: '120px',
              padding: '0.5rem',
              background: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.12)',
              borderRadius: '8px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                marginBottom: '0.375rem',
              }}>
                <AlertTriangle size={10} color="#F59E0B" strokeWidth={2.5} />
                <span style={{
                  fontSize: '0.5rem', fontWeight: '700',
                  color: '#F59E0B', textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  Whale Activity
                </span>
              </div>
              <div style={{ fontSize: isMobile ? '0.75rem' : '0.813rem', fontWeight: '800', color: '#F1F5F9', marginBottom: '0.25rem', fontFeatureSettings: "'tnum'" }}>
                {whales.count} large trade{whales.count !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: '0.563rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4', fontFeatureSettings: "'tnum'" }}>
                {formatVol(whales.totalCash)} total
                {whales.largest >= 1000 && <> · max {formatVol(whales.largest)}</>}
              </div>
              <div style={{
                display: 'flex', gap: '0.375rem', marginTop: '0.3rem',
              }}>
                {whales.buyCount > 0 && (
                  <span style={{ fontSize: '0.5rem', fontWeight: '700', color: ACCENT }}>
                    {whales.buyCount} buy{whales.buyCount !== 1 ? 's' : ''}
                  </span>
                )}
                {whales.sellCount > 0 && (
                  <span style={{ fontSize: '0.5rem', fontWeight: '700', color: '#F87171' }}>
                    {whales.sellCount} sell{whales.sellCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom stats row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '0.375rem',
      }}>
        {vol > 0 && (
          <MiniStat label="Volume" value={formatVol(vol)} isMobile={isMobile} />
        )}
        {flowSignal && (
          <MiniStat label="Flow" isMobile={isMobile} renderValue={() => {
            const Icon = flowSignal.icon;
            return (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: flowSignal.color, fontWeight: '700', fontSize: isMobile ? '0.688rem' : '0.75rem' }}>
                <Icon size={11} strokeWidth={2.5} /> {flowSignal.label}
              </span>
            );
          }} />
        )}
        {priceMove1h != null && (
          <MiniStat
            label="1h Move"
            value={`${Number(priceMove1h) >= 0 ? '+' : ''}${priceMove1h}%`}
            valueColor={Number(priceMove1h) > 0 ? ACCENT : Number(priceMove1h) < 0 ? '#F87171' : '#94A3B8'}
            isMobile={isMobile}
          />
        )}
        {tradeCount > 0 && (
          <MiniStat label="Trades" value={tradeCount.toLocaleString()} isMobile={isMobile} />
        )}
      </div>

      <style>{`
        @keyframes polyFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes polyPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/** SVG Sparkline — compact inline price chart */
function Sparkline({ points, color, height = 28 }) {
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

  const gradId = `spark-grad-${Math.random().toString(36).slice(2, 8)}`;
  const fillCoords = [
    `${pad},${height}`,
    ...coords,
    `${width - pad},${height}`,
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: `${height}px`, display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillCoords} fill={`url(#${gradId})`} />
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current price dot */}
      {(() => {
        const lastCoord = coords[coords.length - 1].split(',');
        return (
          <circle cx={lastCoord[0]} cy={lastCoord[1]} r="2.5" fill={color} />
        );
      })()}
    </svg>
  );
}

function MiniStat({ label, value, valueColor, isMobile, renderValue }) {
  return (
    <div style={{ textAlign: 'center', minWidth: isMobile ? '48px' : '56px' }}>
      <div style={{
        fontSize: '0.5rem', fontWeight: '600',
        color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
        letterSpacing: '0.04em', marginBottom: '0.125rem',
      }}>
        {label}
      </div>
      {renderValue ? renderValue() : (
        <div style={{
          fontSize: isMobile ? '0.688rem' : '0.75rem',
          fontWeight: '700', color: valueColor || '#94A3B8',
          fontFeatureSettings: "'tnum'",
        }}>
          {value}
        </div>
      )}
    </div>
  );
}

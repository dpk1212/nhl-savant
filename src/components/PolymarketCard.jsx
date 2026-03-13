/**
 * PolymarketCard — Market Intelligence
 *
 * Shows actionable Polymarket data: market-implied probability with visual bar,
 * model vs market comparison (agrees/diverges), smart money signal, volume context.
 */

import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TYPOGRAPHY, MOBILE_SPACING } from '../utils/designSystem';

const ACCENT = '#10B981';
const ACCENT_DARK = '#059669';
const ACCENT_GLOW = 'rgba(16, 185, 129, 0.25)';

export default function PolymarketCard({ data, isMobile, awayTeam, homeTeam, modelAwayProb, modelHomeProb, modelPick }) {
  if (!data) return null;

  const {
    volume24h, liveVolume, buyPct, sellPct, priceMove1h, tradeCount,
    awayProb: mktAwayPct, homeProb: mktHomePct,
  } = data;

  const vol = liveVolume ?? volume24h ?? 0;
  if (vol <= 0 && mktAwayPct == null) return null;

  const hasMarketProb = mktAwayPct != null && mktHomePct != null;
  const hasModelProb = modelAwayProb != null && modelHomeProb != null && modelAwayProb > 0;

  const away = awayTeam || data.awayTeam || '?';
  const home = homeTeam || data.homeTeam || '?';

  // Determine market's favorite
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
          ? `Market ${delta > 0 ? `+${delta}%` : ''} more bullish on ${pickTeam}`
          : `Market aligned, model ${delta > 0 ? `+${delta}%` : ''} more confident`,
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

  // Smart money signal from buy/sell ratio
  const flowSignal = (() => {
    if (buyPct == null) return null;
    if (buyPct >= 85) return { label: 'Heavy Buying', color: ACCENT, icon: TrendingUp };
    if (buyPct >= 65) return { label: 'Buying Pressure', color: '#0EA5E9', icon: TrendingUp };
    if (buyPct <= 15) return { label: 'Heavy Selling', color: '#F87171', icon: TrendingDown };
    if (buyPct <= 35) return { label: 'Selling Pressure', color: '#F59E0B', icon: TrendingDown };
    return { label: 'Balanced', color: '#94A3B8', icon: Minus };
  })();

  // Volume tier
  const volTier = (() => {
    if (vol >= 500_000) return { label: 'HIGH', color: ACCENT };
    if (vol >= 100_000) return { label: 'MODERATE', color: '#0EA5E9' };
    if (vol >= 10_000) return { label: 'LOW', color: '#F59E0B' };
    return { label: 'THIN', color: '#64748B' };
  })();

  const formatVol = (v) => {
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
    return `$${Math.round(v)}`;
  };

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
        marginBottom: hasMarketProb ? '0.75rem' : '0.625rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

      {/* Market Probability Bar (the headline feature) */}
      {hasMarketProb && (
        <div style={{ marginBottom: '0.75rem' }}>
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
          {/* Probability split bar */}
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

      {/* Model vs Market Agreement Signal */}
      {agreementSignal && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.625rem',
          background: `${agreementSignal.color}10`,
          border: `1px solid ${agreementSignal.color}25`,
          borderRadius: '8px',
          marginBottom: '0.75rem',
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

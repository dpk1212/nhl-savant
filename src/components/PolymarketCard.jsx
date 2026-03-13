/**
 * PolymarketCard — Volume & Price Movement
 *
 * Premium-styled card showing Polymarket activity: 24h volume,
 * buy/sell split, trade count, and 1h price move.
 * Uses design system tokens for consistent branding.
 */

import { BarChart3 } from 'lucide-react';
import { TYPOGRAPHY, MOBILE_SPACING } from '../utils/designSystem';

const ACCENT = '#10B981';
const ACCENT_DARK = '#059669';
const ACCENT_GLOW = 'rgba(16, 185, 129, 0.25)';

export default function PolymarketCard({ data, isMobile }) {
  if (!data) return null;

  const { volume24h, liveVolume, buyPct, sellPct, priceMove1h, tradeCount } = data;
  const vol = liveVolume ?? volume24h ?? 0;
  const hasVol = vol > 0;
  const hasFlow = buyPct != null || sellPct != null;
  const hasMove = priceMove1h != null;
  const hasTrades = tradeCount != null && tradeCount > 0;

  if (!hasVol && !hasFlow && !hasMove) return null;

  const stats = [];
  if (hasVol) stats.push('vol');
  if (hasFlow) stats.push('flow');
  if (hasMove) stats.push('move');
  if (hasTrades) stats.push('trades');

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
        padding: isMobile ? '0.875rem' : '1rem',
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
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: '120px',
        height: '120px',
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
        borderRadius: '50%',
        opacity: 0.08,
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      {/* Header: Icon + Polymarket branding */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
            borderRadius: '8px',
            boxShadow: `0 0 12px ${ACCENT_GLOW}`,
          }}>
            <BarChart3 size={14} color="white" strokeWidth={2.5} />
          </div>
          <span style={{
            ...TYPOGRAPHY.label,
            fontSize: isMobile ? TYPOGRAPHY.caption.size : TYPOGRAPHY.label.size,
            color: 'rgba(255,255,255,0.5)',
          }}>
            Polymarket
          </span>
        </div>
        {liveVolume != null && (
          <span style={{
            fontSize: '0.563rem',
            fontWeight: '600',
            color: ACCENT,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}>
            <span style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: ACCENT,
              display: 'inline-block',
              animation: 'polyPulse 2s ease-in-out infinite',
            }} />
            Live
          </span>
        )}
      </div>

      {/* Stats grid — columns adapt to available data */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: isMobile ? '0.5rem' : '0.75rem',
      }}>
        {hasVol && (
          <StatCell
            label="24h Volume"
            value={formatVol(vol)}
            valueColor="#F1F5F9"
            isMobile={isMobile}
          />
        )}

        {hasFlow && (
          <StatCell
            label="Buy / Sell"
            isMobile={isMobile}
            renderValue={() => (
              <div style={{
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                fontWeight: '800',
                fontFeatureSettings: "'tnum'",
              }}>
                <span style={{ color: ACCENT }}>{buyPct ?? 0}%</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.15rem' }}>/</span>
                <span style={{ color: '#F87171' }}>{sellPct ?? 0}%</span>
              </div>
            )}
          />
        )}

        {hasMove && (
          <StatCell
            label="1h Move"
            value={`${Number(priceMove1h) >= 0 ? '+' : ''}${priceMove1h}%`}
            valueColor={Number(priceMove1h) >= 0 ? ACCENT : '#F87171'}
            isMobile={isMobile}
          />
        )}

        {hasTrades && (
          <StatCell
            label="Trades"
            value={tradeCount.toLocaleString()}
            valueColor="#94A3B8"
            isMobile={isMobile}
          />
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

function StatCell({ label, value, valueColor, isMobile, renderValue }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        ...TYPOGRAPHY.caption,
        fontSize: isMobile ? '0.563rem' : TYPOGRAPHY.caption.size,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '0.25rem',
      }}>
        {label}
      </div>
      {renderValue ? renderValue() : (
        <div style={{
          fontSize: isMobile ? '0.875rem' : '1rem',
          fontWeight: '800',
          color: valueColor || '#F1F5F9',
          fontFeatureSettings: "'tnum'",
        }}>
          {value}
        </div>
      )}
    </div>
  );
}

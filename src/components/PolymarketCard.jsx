/**
 * PolymarketCard — Volume & Price Movement
 *
 * Premium-styled card showing Polymarket activity: 24h volume,
 * buy/sell split, and 1h price move. Matches design system.
 */

import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { ELEVATION, TYPOGRAPHY, GRADIENTS } from '../utils/designSystem';

const ACCENT = '#10B981';
const ACCENT_GLOW = 'rgba(16, 185, 129, 0.25)';

export default function PolymarketCard({ data, isMobile }) {
  if (!data) return null;

  const { volume24h, liveVolume, buyPct, sellPct, priceMove1h, tradeCount } = data;
  const vol = liveVolume ?? volume24h ?? 0;
  const hasVol = vol > 0;
  const hasFlow = buyPct != null || sellPct != null;
  const hasMove = priceMove1h != null;

  if (!hasVol && !hasFlow && !hasMove) return null;

  const formatVol = (v) => {
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
    return `$${Math.round(v)}`;
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${ACCENT}30`,
        borderRadius: '12px',
        padding: isMobile ? '0.875rem' : '1rem',
        boxShadow: `0 4px 20px rgba(0,0,0,0.2), 0 0 24px ${ACCENT_GLOW}`,
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: '120px',
        height: '120px',
        background: GRADIENTS.hero,
        borderRadius: '50%',
        opacity: 0.08,
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${ACCENT} 0%, #059669 100%)`,
          borderRadius: '8px',
          boxShadow: `0 0 12px ${ACCENT_GLOW}`,
        }}>
          <BarChart3 size={16} color="white" strokeWidth={2.5} />
        </div>
        <span style={{
          fontSize: isMobile ? '0.688rem' : '0.75rem',
          fontWeight: '700',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Polymarket
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: isMobile ? '0.5rem' : '0.75rem',
      }}>
        {hasVol && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: isMobile ? '0.563rem' : '0.625rem',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: '0.25rem',
            }}>
              Volume
            </div>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: '800',
              color: '#F1F5F9',
              fontFeatureSettings: "'tnum'",
            }}>
              {formatVol(vol)}
            </div>
          </div>
        )}

        {hasFlow && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: isMobile ? '0.563rem' : '0.625rem',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: '0.25rem',
            }}>
              Flow
            </div>
            <div style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              fontWeight: '800',
              fontFeatureSettings: "'tnum'",
            }}>
              <span style={{ color: '#10B981' }}>{buyPct ?? 0}%</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.2rem' }}>/</span>
              <span style={{ color: '#F87171' }}>{sellPct ?? 0}%</span>
            </div>
          </div>
        )}

        {hasMove && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: isMobile ? '0.563rem' : '0.625rem',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: '0.25rem',
            }}>
              1h Move
            </div>
            <div style={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: '800',
              color: Number(priceMove1h) >= 0 ? '#10B981' : '#F87171',
              fontFeatureSettings: "'tnum'",
            }}>
              {Number(priceMove1h) >= 0 ? '+' : ''}{priceMove1h}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Shared Sharp Vault design tokens (mirrors SharpFlow brand system). */

export const B = {
  gold: '#D4AF37',
  goldHover: '#E5C158',
  goldDim: 'rgba(212, 175, 55, 0.10)',
  goldBorder: 'rgba(212, 175, 55, 0.25)',
  goldGlow: 'rgba(212, 175, 55, 0.15)',
  green: '#10B981',
  greenDim: 'rgba(16, 185, 129, 0.12)',
  red: '#EF4444',
  redDim: 'rgba(239, 68, 68, 0.12)',
  sky: '#0EA5E9',
  bg: '#0B0F1F',
  card: '#151923',
  cardAlt: '#1A1F2E',
  border: 'rgba(37, 43, 59, 0.8)',
  borderSubtle: 'rgba(26, 32, 48, 0.6)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textSubtle: '#475569',
};

export const T = {
  heading: { fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.01em' },
  sub: { fontSize: '0.938rem', fontWeight: 700, lineHeight: 1.4 },
  body: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },
  label: { fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.03em' },
  micro: { fontSize: '0.625rem', fontWeight: 600, lineHeight: 1.4 },
  tiny: { fontSize: '0.563rem', fontWeight: 700, lineHeight: 1.4, letterSpacing: '0.05em', textTransform: 'uppercase' },
};

export const SPORT_COLORS = {
  NBA: '#FF8C00', WNBA: '#F472B6', NHL: '#D4AF37', MLB: '#E31837',
  CBB: '#FF6B35', NFL: '#4CAF50', SOC: '#2ECC71', UFC: '#C0392B',
};

export function fmtVol(v) {
  const n = Number(v) || 0;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

export function signedVol(v) {
  const n = Number(v) || 0;
  return `${n >= 0 ? '+' : ''}${fmtVol(n)}`;
}

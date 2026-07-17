import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { B, T, SPORT_COLORS, fmtVol, signedVol } from './vaultTheme';

const TABS = [
  { id: 'open', label: 'Open positions' },
  { id: 'track', label: 'Track record' },
  { id: 'sports', label: 'Sports' },
];

/**
 * Slide-over wallet profile — open legs, Source A/B track, sport tiers.
 */
export default function VaultWalletDrawer({
  wallet,
  entry,
  openLegs = [],
  isMobile,
  onClose,
}) {
  const [tab, setTab] = useState('open');

  useEffect(() => {
    setTab('open');
  }, [wallet]);

  useEffect(() => {
    if (!wallet) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [wallet, onClose]);

  const sortedLegs = useMemo(
    () => [...openLegs].sort((a, b) => (b.invested || 0) - (a.invested || 0)),
    [openLegs],
  );

  if (!wallet || !entry) return null;

  const pnl = entry.sportPnlTotal || 0;
  const roi = entry.roi;
  const week = entry.weeklyPnl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        display: 'flex', justifyContent: 'flex-end',
        background: 'rgba(0,0,0,0.55)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        style={{
          width: isMobile ? '100%' : 'min(420px, 100vw)',
          height: isMobile ? 'min(88vh, 100%)' : '100%',
          marginTop: isMobile ? 'auto' : 0,
          background: `linear-gradient(180deg, ${B.cardAlt} 0%, ${B.bg} 100%)`,
          borderLeft: isMobile ? 'none' : `1px solid ${B.goldBorder}`,
          borderTop: isMobile ? `1px solid ${B.goldBorder}` : 'none',
          borderRadius: isMobile ? '16px 16px 0 0' : 0,
          display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.45)',
          animation: 'sf-card-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        <div style={{
          padding: '1rem 1.1rem 0.75rem',
          borderBottom: `1px solid ${B.borderSubtle}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div>
              <div style={{ ...T.tiny, color: B.gold, letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                Whitelist wallet
              </div>
              <div style={{ ...T.heading, color: B.text, fontSize: '1.25rem' }}>
                {entry.name || `***${wallet.slice(-4)}`}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'transparent', border: `1px solid ${B.border}`,
                borderRadius: '8px', padding: '0.35rem', cursor: 'pointer',
                color: B.textMuted, display: 'flex',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem', marginTop: '0.85rem',
          }}>
            {[
              { label: 'Sports P&L', value: signedVol(pnl), color: pnl >= 0 ? B.green : B.red },
              { label: 'ROI', value: roi != null ? `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%` : '—', color: B.text },
              { label: 'This week', value: week == null ? '—' : signedVol(week), color: week == null ? B.textMuted : week >= 0 ? B.green : B.red },
            ].map((k) => (
              <div key={k.label} style={{
                padding: '0.5rem 0.55rem', borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${B.borderSubtle}`,
              }}>
                <div style={{ ...T.micro, color: B.textSubtle }}>{k.label}</div>
                <div style={{ ...T.sub, color: k.color, fontFeatureSettings: "'tnum'", marginTop: '0.15rem' }}>
                  {k.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.85rem' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                style={{
                  ...T.micro, flex: 1, padding: '0.4rem 0.35rem', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: 700,
                  border: tab === t.id ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                  background: tab === t.id ? B.goldDim : 'transparent',
                  color: tab === t.id ? B.gold : B.textMuted,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem 1.1rem 1.5rem' }}>
          {tab === 'open' && (
            sortedLegs.length === 0 ? (
              <div style={{ ...T.body, color: B.textMuted, textAlign: 'center', padding: '2rem 0.5rem' }}>
                No sized open legs in today’s ML / spread / total feeds
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {sortedLegs.map((leg, i) => {
                  const sc = SPORT_COLORS[leg.sport] || B.gold;
                  return (
                    <div
                      key={`${leg.gameKey}-${leg.marketType}-${leg.side}-${i}`}
                      style={{
                        padding: '0.65rem 0.75rem', borderRadius: '10px',
                        background: B.card, border: `1px solid ${B.border}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{
                          ...T.micro, padding: '0.15rem 0.4rem', borderRadius: '4px',
                          background: sc + '18', color: sc, fontWeight: 800,
                        }}>{leg.sport}</span>
                        <span style={{ ...T.label, color: B.gold, fontWeight: 800, fontFeatureSettings: "'tnum'" }}>
                          {fmtVol(leg.invested)}
                        </span>
                      </div>
                      <div style={{ ...T.body, color: B.text, marginTop: '0.35rem', fontWeight: 700 }}>
                        {leg.away} vs {leg.home}
                      </div>
                      <div style={{ ...T.micro, color: B.textSec, marginTop: '0.2rem' }}>
                        {leg.marketType} · <span style={{ color: B.gold }}>{leg.teamName || leg.side}</span>
                        {leg.betMultiplier >= 1.5 && (
                          <span style={{ color: B.gold }}> · {leg.betMultiplier.toFixed(1)}×</span>
                        )}
                        {leg.vault_isHcWallet && (
                          <span style={{ color: B.gold, fontWeight: 800 }}> · HC</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {tab === 'track' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <TrackBlock
                title="Source A — picks"
                subtitle="Graded pick history from sharpFlow wallet details"
                rows={[
                  { label: 'Win rate', value: entry.picks?.n ? `${entry.picks.wr}%` : '—' },
                  { label: 'Sample', value: entry.picks?.n ? String(entry.picks.n) : '—' },
                  { label: 'Flat ROI', value: entry.picks?.n ? `${entry.picks.flatRoi}%` : '—' },
                  { label: 'W–L', value: entry.picks?.n ? `${entry.picks.wins}-${entry.picks.losses}` : '—' },
                ]}
              />
              <TrackBlock
                title="Source B — positions"
                subtitle="Dollar-settled position aggregate from profile"
                rows={[
                  { label: 'Win rate', value: entry.positionsTrack?.n ? `${entry.positionsTrack.wr}%` : '—' },
                  { label: 'Sample', value: entry.positionsTrack?.n ? String(entry.positionsTrack.n) : '—' },
                  { label: 'Dollar ROI', value: entry.positionsTrack?.dollarRoi != null ? `${entry.positionsTrack.dollarRoi}%` : '—' },
                  { label: 'Settled P&L', value: entry.positionsTrack?.settledPnl != null ? signedVol(entry.positionsTrack.settledPnl) : '—' },
                ]}
              />
              <TrackBlock
                title="CLV skill"
                subtitle="Causal % of graded positions that beat the close"
                rows={[
                  { label: 'Beats close', value: entry.clvSkill?.pctPos != null ? `${entry.clvSkill.pctPos}%` : '—' },
                  { label: 'Sample', value: entry.clvSkill?.n != null ? String(entry.clvSkill.n) : '—' },
                  { label: 'Since', value: entry.clvSkill?.since || '—' },
                ]}
              />
            </div>
          )}

          {tab === 'sports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ ...T.micro, color: B.textSubtle, marginBottom: '0.35rem' }}>
                Whitelist tier + activity counts only — never per-sport $
              </div>
              {Object.entries(entry.bySport || {})
                .filter(([, rec]) => rec?.whitelistTier === 'CONFIRMED' || rec?.whitelistTier === 'FLAT')
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([sport, rec]) => {
                  const sc = SPORT_COLORS[sport] || B.gold;
                  const bets = rec?.picks?.n ?? entry.perSport?.[sport]?.bets ?? null;
                  return (
                    <div
                      key={sport}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem', borderRadius: '10px',
                        background: B.card, border: `1px solid ${B.border}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          ...T.label, fontWeight: 800, color: sc,
                          minWidth: 36,
                        }}>{sport}</span>
                        <span style={{
                          ...T.tiny, padding: '0.15rem 0.4rem', borderRadius: '4px',
                          color: rec.whitelistTier === 'CONFIRMED' ? '#1a1a1a' : B.textSec,
                          background: rec.whitelistTier === 'CONFIRMED'
                            ? `linear-gradient(135deg, ${B.gold}, #F5D77B)`
                            : 'rgba(148,163,184,0.12)',
                        }}>
                          {rec.whitelistTier}
                        </span>
                      </div>
                      <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                        {bets != null ? `${bets} bets` : '—'}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrackBlock({ title, subtitle, rows }) {
  return (
    <div style={{
      borderRadius: '10px', border: `1px solid ${B.border}`,
      background: B.card, padding: '0.75rem 0.85rem',
    }}>
      <div style={{ ...T.label, color: B.text, fontWeight: 800 }}>{title}</div>
      <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.15rem', marginBottom: '0.55rem' }}>
        {subtitle}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
        {rows.map((r) => (
          <div key={r.label}>
            <div style={{ ...T.tiny, color: B.textSubtle }}>{r.label}</div>
            <div style={{ ...T.body, color: B.textSec, fontFeatureSettings: "'tnum'", marginTop: '0.1rem' }}>
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

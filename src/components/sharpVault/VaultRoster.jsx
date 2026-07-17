import React, { useEffect, useMemo, useRef, useState } from 'react';
import { B, T, fmtVol, signedVol } from './vaultTheme';

const SORTS = [
  { id: 'pnl', label: 'P&L' },
  { id: 'roi', label: 'ROI' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'clv', label: 'CLV' },
  { id: 'active', label: 'Active' },
];

const PICK_N_MIN = 10;
const CLV_N_MIN = 8;
const HOT_N = 5;

const DESKTOP_COLS = 'minmax(130px,1.5fr) 0.85fr 0.65fr 0.7fr 0.7fr 0.75fr 0.65fr 0.9fr';

/**
 * Full whitelist roster — Hot strip + truth-bound columns.
 * Money from LB / positionsContext; no per-sport $.
 */
export default function VaultRoster({
  entries = [],
  actionPositions = [],
  selectedWallet = null,
  isMobile,
  onSelectWallet,
}) {
  const [sortBy, setSortBy] = useState('pnl');
  const rowRefs = useRef({});

  const hcWallets = useMemo(() => {
    const s = new Set();
    for (const p of actionPositions) {
      if (p.vault_isHcWallet) s.add((p.wallet || '').toLowerCase());
    }
    return s;
  }, [actionPositions]);

  const selected = selectedWallet ? String(selectedWallet).toLowerCase() : null;

  const hot = useMemo(() => {
    return [...entries]
      .filter((e) => (e.openInvested || 0) > 0)
      .sort((a, b) => (b.openInvested || 0) - (a.openInvested || 0))
      .slice(0, HOT_N);
  }, [entries]);

  const sorted = useMemo(() => {
    const list = [...entries];
    list.sort((a, b) => {
      if (sortBy === 'roi') return (b.roi ?? -999) - (a.roi ?? -999);
      if (sortBy === 'weekly') return (b.weeklyPnl ?? -1e12) - (a.weeklyPnl ?? -1e12);
      if (sortBy === 'clv') return (b.clvSkill?.pctPos ?? -1) - (a.clvSkill?.pctPos ?? -1);
      if (sortBy === 'active') return (b.openInvested || 0) - (a.openInvested || 0);
      return (b.sportPnlTotal || 0) - (a.sportPnlTotal || 0);
    });
    return list;
  }, [entries, sortBy]);

  useEffect(() => {
    if (!selected) return;
    const el = rowRefs.current[selected];
    if (el?.scrollIntoView) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selected]);

  return (
    <section style={{ marginBottom: '1.75rem' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
            <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.08em' }}>Roster</span>
            <span style={{
              ...T.micro, padding: '0.1rem 0.4rem', borderRadius: '4px',
              background: B.goldDim, color: B.gold, fontWeight: 800,
            }}>{entries.length}</span>
          </div>
          <div style={{ ...T.label, color: B.textMuted, fontWeight: 500 }}>
            Full whitelist · money from Polymarket sports LB · no per-sport $
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortBy(s.id)}
              style={{
                ...T.micro, padding: '0.25rem 0.55rem', borderRadius: '999px', cursor: 'pointer',
                border: sortBy === s.id ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                background: sortBy === s.id ? B.goldDim : 'transparent',
                color: sortBy === s.id ? B.gold : B.textMuted, fontWeight: 700,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hot now — live size without a second board */}
      {hot.length > 0 && (
        <div className="sf-stagger" style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(hot.length, 5)}, 1fr)`,
          gap: '0.45rem',
          marginBottom: '0.85rem',
        }}>
          {hot.map((e) => {
            const w = e.wallet.toLowerCase();
            const isHc = hcWallets.has(w);
            const isSel = selected === w;
            const clv = e.clvSkill?.pctPos;
            return (
              <button
                key={w}
                type="button"
                onClick={() => onSelectWallet?.(e.wallet)}
                style={{
                  textAlign: 'left', cursor: 'pointer', color: 'inherit',
                  padding: '0.65rem 0.75rem', borderRadius: '10px',
                  background: isSel
                    ? 'rgba(212,175,55,0.12)'
                    : `linear-gradient(145deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                  border: isSel
                    ? `1px solid ${B.gold}`
                    : isHc
                      ? `1px solid ${B.goldBorder}`
                      : `1px solid ${B.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                  <span style={{ ...T.label, color: B.text, fontWeight: 800 }}>
                    {e.name || `***${w.slice(-4)}`}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', background: B.green,
                      boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                    }} />
                    {isHc && (
                      <span style={{ ...T.tiny, color: B.gold }}>HC</span>
                    )}
                  </span>
                </div>
                <div style={{
                  ...T.sub, color: B.gold, fontWeight: 900, fontFeatureSettings: "'tnum'",
                  marginTop: '0.3rem', fontSize: '0.95rem',
                }}>
                  {fmtVol(e.openInvested)}
                </div>
                <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.15rem', fontFeatureSettings: "'tnum'" }}>
                  {clv != null && (e.clvSkill?.n || 0) >= CLV_N_MIN ? `CLV ${clv.toFixed(0)}%` : 'CLV —'}
                  {' · '}
                  {e.roi != null ? `ROI ${e.roi.toFixed(1)}%` : 'ROI —'}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div style={{
        borderRadius: '12px', overflow: 'hidden',
        border: `1px solid ${B.border}`,
        background: B.card,
      }}>
        {!isMobile && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: DESKTOP_COLS,
            gap: '0.5rem', padding: '0.55rem 0.85rem',
            borderBottom: `1px solid ${B.borderSubtle}`,
            background: 'rgba(0,0,0,0.2)',
          }}>
            {['Wallet', 'Sports P&L', 'ROI', 'Vol', 'Week', 'Pick WR', 'CLV', 'Open'].map((h) => (
              <span key={h} style={{ ...T.tiny, color: B.textSubtle }}>{h}</span>
            ))}
          </div>
        )}
        <div style={{ maxHeight: isMobile ? 'none' : '420px', overflowY: 'auto' }}>
          {sorted.map((e, i) => {
            const w = e.wallet.toLowerCase();
            const picksN = e.picks?.n || 0;
            const picksWr = e.picks?.wr;
            const clvN = e.clvSkill?.n || 0;
            const clvPct = e.clvSkill?.pctPos;
            const week = e.weeklyPnl;
            const isLive = (e.openInvested || 0) > 0;
            const isHc = hcWallets.has(w);
            const isSel = selected === w;
            const tiers = [
              ...(e.confirmedSports || []).map((s) => ({ s, t: 'C' })),
              ...(e.flatSports || []).filter((s) => !(e.confirmedSports || []).includes(s)).map((s) => ({ s, t: 'F' })),
            ].slice(0, 4);

            return (
              <button
                key={e.wallet}
                type="button"
                ref={(el) => { rowRefs.current[w] = el; }}
                onClick={() => onSelectWallet?.(e.wallet)}
                className="sf-fade-in"
                style={{
                  width: '100%', display: isMobile ? 'flex' : 'grid',
                  gridTemplateColumns: DESKTOP_COLS,
                  flexDirection: isMobile ? 'column' : undefined,
                  gap: isMobile ? '0.35rem' : '0.5rem',
                  alignItems: isMobile ? 'stretch' : 'center',
                  padding: isMobile ? '0.75rem 0.85rem' : '0.55rem 0.85rem',
                  cursor: 'pointer', textAlign: 'left', color: 'inherit',
                  background: isSel
                    ? 'rgba(212,175,55,0.10)'
                    : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  border: 'none',
                  borderLeft: isSel ? `2px solid ${B.gold}` : '2px solid transparent',
                  borderBottom: `1px solid ${B.borderSubtle}`,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {isLive && (
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: B.green, boxShadow: '0 0 6px rgba(16,185,129,0.55)',
                      }} />
                    )}
                    <span style={{ ...T.label, color: B.text, fontWeight: 800 }}>
                      {e.name || `***${String(e.wallet || '').slice(-4)}`}
                    </span>
                    {isHc && (
                      <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.04em' }}>HC</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                    {tiers.map(({ s, t }) => (
                      <span key={`${s}-${t}`} style={{
                        ...T.tiny, letterSpacing: '0.02em', padding: '0.05rem 0.3rem', borderRadius: '3px',
                        color: t === 'C' ? B.gold : B.textSec,
                        background: t === 'C' ? B.goldDim : 'rgba(148,163,184,0.1)',
                        border: `1px solid ${t === 'C' ? B.goldBorder : B.border}`,
                      }}>
                        {s} {t}
                      </span>
                    ))}
                  </div>
                </div>
                {isMobile ? (
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem',
                    ...T.micro, color: B.textSec,
                  }}>
                    <span><span style={{ color: B.textSubtle }}>P&L </span>
                      <span style={{ color: (e.sportPnlTotal || 0) >= 0 ? B.green : B.red, fontWeight: 800 }}>
                        {signedVol(e.sportPnlTotal)}
                      </span>
                    </span>
                    <span><span style={{ color: B.textSubtle }}>Vol </span>
                      {(e.vol || 0) > 0 ? fmtVol(e.vol) : '—'}
                    </span>
                    <span><span style={{ color: B.textSubtle }}>Open </span>
                      {isLive ? fmtVol(e.openInvested) : '—'}
                    </span>
                  </div>
                ) : (
                  <>
                    <span style={{
                      ...T.label, fontWeight: 800, fontFeatureSettings: "'tnum'",
                      color: (e.sportPnlTotal || 0) >= 0 ? B.green : B.red,
                    }}>
                      {signedVol(e.sportPnlTotal)}
                    </span>
                    <span style={{ ...T.label, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                      {e.roi != null ? `${e.roi.toFixed(1)}%` : '—'}
                    </span>
                    <span style={{ ...T.label, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                      {(e.vol || 0) > 0 ? fmtVol(e.vol) : '—'}
                    </span>
                    <span style={{
                      ...T.label, fontFeatureSettings: "'tnum'",
                      color: week == null ? B.textSubtle : week >= 0 ? B.green : B.red,
                    }}>
                      {week == null ? '—' : signedVol(week)}
                    </span>
                    <span style={{ ...T.label, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                      {picksN >= PICK_N_MIN && picksWr != null
                        ? `${picksWr.toFixed(0)}% · ${picksN}`
                        : '—'}
                    </span>
                    <span style={{ ...T.label, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                      {clvN >= CLV_N_MIN && clvPct != null
                        ? `${clvPct.toFixed(0)}%`
                        : '—'}
                    </span>
                    <span style={{ ...T.label, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                      {isLive
                        ? `${fmtVol(e.openInvested)} · ${e.openMarkets || 0}`
                        : '—'}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

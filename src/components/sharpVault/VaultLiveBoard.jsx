import React, { useMemo, useState } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { B, T, SPORT_COLORS, fmtVol } from './vaultTheme';

function hcRank(tier) {
  if (tier === 'HC_DOMINANT') return 0;
  if (tier === 'HC_STANDARD') return 1;
  if (tier === 'HC_FADE') return 3;
  return 2;
}

/**
 * Cluster sized whitelist positions by game|market|side.
 * Pins HC_DOMINANT → HC_STANDARD → invested size.
 */
export default function VaultLiveBoard({ actionPositions = [], sportFilter = 'ALL', isMobile, onSelectWallet }) {
  const [expandedKey, setExpandedKey] = useState(null);

  const rows = useMemo(() => {
    const map = new Map();
    for (const p of actionPositions) {
      if (sportFilter !== 'ALL' && p.sport !== sportFilter) continue;
      const key = `${p.sport}|${p.gameKey}|${p.marketType}|${p.side}`;
      let row = map.get(key);
      if (!row) {
        row = {
          key,
          sport: p.sport,
          gameKey: p.gameKey,
          marketType: p.marketType,
          side: p.side,
          away: p.away,
          home: p.home,
          teamName: p.teamName,
          invested: 0,
          wallets: [],
          hcTier: null,
          hcMargin: 0,
        };
        map.set(key, row);
      }
      row.invested += p.invested || 0;
      row.wallets.push({
        wallet: (p.wallet || '').toLowerCase(),
        name: '***' + String(p.wallet || '').slice(-4),
        invested: p.invested || 0,
        isHc: !!p.vault_isHcWallet,
        betMultiplier: p.betMultiplier || 0,
      });
      const r = hcRank(p.vault_hcTier);
      if (row.hcTier == null || r < hcRank(row.hcTier)) {
        row.hcTier = p.vault_hcTier;
        row.hcMargin = p.vault_hcMargin ?? 0;
      }
    }
    const list = [...map.values()].map((row) => {
      row.wallets.sort((a, b) => b.invested - a.invested);
      return row;
    });
    list.sort((a, b) => {
      const hr = hcRank(a.hcTier) - hcRank(b.hcTier);
      if (hr !== 0) return hr;
      return b.invested - a.invested;
    });
    return list;
  }, [actionPositions, sportFilter]);

  return (
    <section style={{ marginBottom: '1.75rem' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
            <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.08em' }}>Live Board</span>
            {rows.length > 0 && (
              <span style={{
                ...T.micro, padding: '0.1rem 0.4rem', borderRadius: '4px',
                background: B.goldDim, color: B.gold, fontWeight: 800,
              }}>{rows.length}</span>
            )}
          </div>
          <div style={{ ...T.label, color: B.textMuted, fontWeight: 500 }}>
            Where CONFIRMED / FLAT wallets are sized in right now — HC pinned first
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '2rem 1rem', borderRadius: '12px',
          background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
          border: `1px solid ${B.border}`,
        }}>
          <Activity size={18} color={B.textMuted} style={{ marginBottom: '0.5rem', opacity: 0.45 }} />
          <div style={{ ...T.body, color: B.textMuted }}>No sized whitelist positions right now</div>
          <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.25rem' }}>
            Sized legs (≥0.75× avg · ≥$5K) from the whitelist will appear here
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="sf-stagger">
          {rows.map((row) => {
            const open = expandedKey === row.key;
            const sc = SPORT_COLORS[row.sport] || B.gold;
            const isHcDom = row.hcTier === 'HC_DOMINANT';
            const isHcStd = row.hcTier === 'HC_STANDARD';
            return (
              <div
                key={row.key}
                style={{
                  borderRadius: '12px', overflow: 'hidden',
                  background: `linear-gradient(145deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                  border: isHcDom
                    ? '1.5px solid rgba(212,175,55,0.55)'
                    : isHcStd
                      ? '1px solid rgba(212,175,55,0.35)'
                      : `1px solid ${B.border}`,
                  boxShadow: isHcDom ? '0 0 20px rgba(212,175,55,0.12)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedKey(open ? null : row.key)}
                  style={{
                    width: '100%', display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr auto' : 'auto 1fr auto auto auto 18px',
                    alignItems: 'center', gap: isMobile ? '0.5rem' : '0.75rem',
                    padding: '0.85rem 1rem', cursor: 'pointer',
                    background: 'transparent', border: 'none', textAlign: 'left', color: 'inherit',
                  }}
                >
                  <span style={{
                    ...T.micro, padding: '0.2rem 0.45rem', borderRadius: '5px',
                    background: sc + '18', color: sc, fontWeight: 800,
                    border: `1px solid ${sc}30`,
                  }}>{row.sport}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ ...T.body, color: B.text, fontWeight: 700 }}>
                      {row.away} <span style={{ color: B.textMuted, fontWeight: 400 }}>vs</span> {row.home}
                    </div>
                    <div style={{ ...T.micro, color: B.textSec, marginTop: '0.15rem' }}>
                      <span style={{ color: B.gold, fontWeight: 800 }}>{row.teamName}</span>
                      {' · '}{row.marketType}
                      {' · '}{row.wallets.length} wallet{row.wallets.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {!isMobile && (isHcDom || isHcStd) && (
                    <span style={{
                      ...T.micro, fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '5px',
                      color: isHcDom ? '#1a1a1a' : B.gold,
                      background: isHcDom
                        ? `linear-gradient(135deg, ${B.gold} 0%, #F5D77B 100%)`
                        : 'rgba(212,175,55,0.14)',
                      border: `1px solid ${B.gold}${isHcDom ? '' : '66'}`,
                    }}>
                      {isHcDom ? `★★ HC +${row.hcMargin}` : '★ HC +1'}
                    </span>
                  )}
                  <span style={{
                    ...T.sub, color: B.gold, fontWeight: 900, fontFeatureSettings: "'tnum'",
                    fontSize: isMobile ? '0.95rem' : undefined,
                  }}>
                    {fmtVol(row.invested)}
                  </span>
                  {!isMobile && (
                    <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                      {row.wallets.slice(0, 3).map((w) => w.name).join(' · ')}
                    </span>
                  )}
                  {open
                    ? <ChevronUp size={14} color={B.textMuted} />
                    : <ChevronDown size={14} color={B.textMuted} />}
                </button>
                {open && (
                  <div style={{
                    borderTop: `1px solid ${B.borderSubtle}`,
                    padding: '0.65rem 1rem 0.85rem',
                    display: 'flex', flexDirection: 'column', gap: '0.35rem',
                  }}>
                    {row.wallets.map((w) => (
                      <button
                        key={w.wallet}
                        type="button"
                        onClick={() => onSelectWallet?.(w.wallet)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.4rem 0.55rem', borderRadius: '8px', cursor: 'pointer',
                          background: 'rgba(255,255,255,0.02)', border: `1px solid ${B.borderSubtle}`,
                          color: 'inherit',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ ...T.label, color: B.textSec, fontWeight: 700 }}>{w.name}</span>
                          {w.isHc && (
                            <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.04em' }}>HC</span>
                          )}
                          {w.betMultiplier >= 1.5 && (
                            <span style={{ ...T.micro, color: B.gold, fontFeatureSettings: "'tnum'" }}>
                              {w.betMultiplier.toFixed(1)}×
                            </span>
                          )}
                        </span>
                        <span style={{ ...T.label, color: B.green, fontWeight: 800, fontFeatureSettings: "'tnum'" }}>
                          {fmtVol(w.invested)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

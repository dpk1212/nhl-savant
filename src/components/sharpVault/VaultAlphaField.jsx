import React, { useMemo, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from 'recharts';
import { B, T, fmtVol } from './vaultTheme';

const CLV_N_MIN = 8;
const TOGGLES = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active today' },
  { id: 'hc', label: 'Heavy size' },
];

function topLegLine(legs, sportFilter) {
  if (!legs?.length) return null;
  const filtered = sportFilter === 'ALL'
    ? legs
    : legs.filter((l) => l.sport === sportFilter);
  if (!filtered.length) return null;
  const top = [...filtered].sort((a, b) => (b.invested || 0) - (a.invested || 0))[0];
  const label = top.teamName || top.side || '';
  return `${top.marketType || ''} ${label} · ${fmtVol(top.invested)}`.trim();
}

/**
 * CLV × Sports ROI scatter — live size woven in via halos; thin wallets omitted.
 */
export default function VaultAlphaField({
  entries = [],
  actionPositions = [],
  openLegsByWallet = {},
  sportFilter = 'ALL',
  selectedWallet = null,
  isMobile,
  onSelectWallet,
}) {
  const [toggle, setToggle] = useState('all');

  const hcWallets = useMemo(() => {
    const s = new Set();
    for (const p of actionPositions) {
      if (p.vault_isHcWallet) s.add((p.wallet || '').toLowerCase());
    }
    return s;
  }, [actionPositions]);

  const selected = selectedWallet ? String(selectedWallet).toLowerCase() : null;

  const points = useMemo(() => {
    const out = [];
    for (const e of entries) {
      const clv = e.clvSkill?.pctPos;
      const clvN = e.clvSkill?.n || 0;
      if (clv == null || clvN < CLV_N_MIN) continue;
      const roi = e.roi;
      if (roi == null || !Number.isFinite(roi)) continue;
      if ((e.vol || 0) <= 0) continue;

      if (sportFilter !== 'ALL') {
        const sports = e.whitelistSports || [];
        if (!sports.includes(sportFilter)) continue;
      }

      const w = (e.wallet || '').toLowerCase();
      const open = e.openInvested || 0;
      const isHc = hcWallets.has(w);
      if (toggle === 'active' && open <= 0) continue;
      if (toggle === 'hc' && !isHc) continue;

      const confirmedN = (e.confirmedSports || []).length;
      const flatOnly = confirmedN === 0;
      const weekAbs = Math.abs(e.weeklyPnl || 0);
      const z = Math.max(40, Math.min(280, weekAbs > 0 ? Math.sqrt(weekAbs) * 2.2 : Math.sqrt(e.vol || 0) * 0.35));
      const legs = openLegsByWallet[w] || [];
      const liveLine = topLegLine(legs, sportFilter);

      out.push({
        wallet: w,
        name: e.name || `***${w.slice(-4)}`,
        x: clv,
        y: roi,
        z,
        clvN,
        open,
        isLive: open > 0,
        isHc,
        picksWr: e.picks?.wr,
        picksN: e.picks?.n || 0,
        sports: (e.whitelistSports || []).join(', '),
        flatOnly,
        weeklyPnl: e.weeklyPnl,
        liveLine,
        selected: selected === w,
      });
    }
    // Selected + live on top of paint order
    out.sort((a, b) => {
      if (a.selected !== b.selected) return a.selected ? 1 : -1;
      if (a.isHc !== b.isHc) return a.isHc ? 1 : -1;
      if (a.isLive !== b.isLive) return a.isLive ? 1 : -1;
      return 0;
    });
    return out;
  }, [entries, sportFilter, toggle, hcWallets, openLegsByWallet, selected]);

  const liveCount = points.filter((p) => p.isLive).length;
  const hcCount = points.filter((p) => p.isHc).length;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: B.cardAlt, border: `1px solid ${B.goldBorder}`,
        borderRadius: '10px', padding: '0.65rem 0.75rem', minWidth: 180,
        boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <span style={{ ...T.label, color: B.gold, fontWeight: 800 }}>{d.name}</span>
          {d.isHc && (
            <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.04em' }}>Heavy</span>
          )}
          {d.isLive && !d.isHc && (
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: B.green,
              boxShadow: '0 0 6px rgba(16,185,129,0.7)',
            }} />
          )}
        </div>
        <div style={{ ...T.micro, color: B.textSec, lineHeight: 1.7 }}>
          <div>Beat close {d.x.toFixed(1)}% · {d.clvN} bets</div>
          <div>Sports ROI {d.y >= 0 ? '+' : ''}{d.y.toFixed(1)}%</div>
          {d.picksN >= 10 && d.picksWr != null && (
            <div>Win rate {d.picksWr.toFixed(0)}% · {d.picksN} picks</div>
          )}
          <div>Sports: {d.sports || '—'}</div>
          <div>Open now {d.open > 0 ? fmtVol(d.open) : '—'}</div>
          {d.liveLine && (
            <div style={{ color: B.gold, fontWeight: 700, marginTop: '0.2rem' }}>
              {d.liveLine}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleScatterClick = (data) => {
    const w = data?.payload?.wallet || data?.wallet;
    if (w) onSelectWallet?.(w);
  };

  return (
    <section style={{ marginBottom: '1.75rem' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
            <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.08em' }}>Alpha Field</span>
            <span style={{
              ...T.micro, padding: '0.1rem 0.4rem', borderRadius: '4px',
              background: B.goldDim, color: B.gold, fontWeight: 800,
            }}>{points.length}</span>
            {liveCount > 0 && (
              <span style={{ ...T.micro, color: B.green, fontWeight: 700 }}>
                {liveCount} live
              </span>
            )}
            {hcCount > 0 && (
              <span style={{ ...T.micro, color: B.gold, fontWeight: 700 }}>
                {hcCount} heavy
              </span>
            )}
          </div>
          <div style={{ ...T.label, color: B.textMuted, fontWeight: 500 }}>
            Beat the close vs sports ROI · ring = betting today · bright = heavy size
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {TOGGLES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setToggle(t.id)}
              style={{
                ...T.micro, padding: '0.25rem 0.55rem', borderRadius: '999px', cursor: 'pointer',
                border: toggle === t.id ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                background: toggle === t.id ? B.goldDim : 'transparent',
                color: toggle === t.id ? B.gold : B.textMuted, fontWeight: 700,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="sf-fade-in"
        style={{
          position: 'relative',
          borderRadius: '12px', border: `1px solid ${B.border}`,
          background: `linear-gradient(160deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
          padding: isMobile ? '0.5rem 0.25rem 0.75rem' : '0.75rem 0.5rem 1rem',
          height: isMobile ? 300 : 400,
        }}
      >
        {/* Quadrant whispers — composition only, not claims */}
        {!isMobile && points.length > 0 && (
          <>
            <span style={{
              position: 'absolute', top: 18, right: 22, ...T.tiny,
              color: 'rgba(212,175,55,0.35)', letterSpacing: '0.06em', pointerEvents: 'none', zIndex: 1,
            }}>Skill + ROI</span>
            <span style={{
              position: 'absolute', top: 18, left: 56, ...T.tiny,
              color: 'rgba(148,163,184,0.28)', letterSpacing: '0.06em', pointerEvents: 'none', zIndex: 1,
            }}>Volume without skill</span>
            <span style={{
              position: 'absolute', bottom: 44, right: 22, ...T.tiny,
              color: 'rgba(148,163,184,0.28)', letterSpacing: '0.06em', pointerEvents: 'none', zIndex: 1,
            }}>Skill, cold book</span>
            <span style={{
              position: 'absolute', bottom: 44, left: 56, ...T.tiny,
              color: 'rgba(148,163,184,0.22)', letterSpacing: '0.06em', pointerEvents: 'none', zIndex: 1,
            }}>Thin edge</span>
          </>
        )}

        {points.length === 0 ? (
          <div style={{
            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body, color: B.textMuted, textAlign: 'center', padding: '1rem',
          }}>
            Not enough wallets with a clear track record for this filter
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 16, bottom: 28, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
              <XAxis
                type="number" dataKey="x" name="Beat close"
                domain={['auto', 'auto']}
                tick={{ fill: B.textMuted, fontSize: 10 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: 'Beat the close %', position: 'insideBottom', offset: -12, fill: B.textSubtle, fontSize: 10 }}
              />
              <YAxis
                type="number" dataKey="y" name="ROI"
                domain={['auto', 'auto']}
                tick={{ fill: B.textMuted, fontSize: 10 }}
                tickFormatter={(v) => `${v}%`}
                width={48}
                label={{ value: 'Sports ROI', angle: -90, position: 'insideLeft', fill: B.textSubtle, fontSize: 10 }}
              />
              <ZAxis type="number" dataKey="z" range={[36, 260]} />
              <ReferenceLine y={0} stroke="rgba(148,163,184,0.28)" />
              <ReferenceLine x={50} stroke="rgba(212,175,55,0.22)" strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: B.goldBorder }} />
              <Scatter
                data={points}
                onClick={handleScatterClick}
                style={{ cursor: 'pointer' }}
              >
                {points.map((p) => {
                  let stroke = p.flatOnly ? 'rgba(148,163,184,0.45)' : 'rgba(212,175,55,0.35)';
                  let strokeWidth = 1;
                  let fillOpacity = p.isLive || p.isHc ? 0.9 : 0.55;
                  if (p.isLive) {
                    stroke = B.gold;
                    strokeWidth = 2;
                  }
                  if (p.isHc) {
                    stroke = B.goldHover;
                    strokeWidth = 2.5;
                  }
                  if (p.selected) {
                    stroke = '#F8FAFC';
                    strokeWidth = 3;
                    fillOpacity = 1;
                  }
                  return (
                    <Cell
                      key={p.wallet}
                      fill={p.flatOnly ? 'rgba(148,163,184,0.5)' : B.gold}
                      fillOpacity={fillOpacity}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      className={p.isLive && !p.selected ? 'vault-live-halo' : undefined}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
      <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.45rem', lineHeight: 1.5 }}>
        Only wallets with enough history to trust ({CLV_N_MIN}+ graded bets and real sports volume).
        Hover a live wallet for its largest open bet — full markets are on Locked Picks and Live.
      </div>
    </section>
  );
}

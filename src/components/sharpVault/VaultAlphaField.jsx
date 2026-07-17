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
  { id: 'hc', label: 'HC wallets' },
];

/**
 * CLV × Sports ROI scatter — axes require real samples; thin wallets omitted.
 */
export default function VaultAlphaField({
  entries = [],
  actionPositions = [],
  sportFilter = 'ALL',
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
      if (toggle === 'active' && open <= 0) continue;
      if (toggle === 'hc' && !hcWallets.has(w)) continue;

      const confirmedN = (e.confirmedSports || []).length;
      const flatOnly = confirmedN === 0;
      const weekAbs = Math.abs(e.weeklyPnl || 0);
      const z = Math.max(40, Math.min(280, weekAbs > 0 ? Math.sqrt(weekAbs) * 2.2 : Math.sqrt(e.vol || 0) * 0.35));

      out.push({
        wallet: w,
        name: e.name || `***${w.slice(-4)}`,
        x: clv,
        y: roi,
        z,
        clvN,
        open,
        picksWr: e.picks?.wr,
        picksN: e.picks?.n || 0,
        sports: (e.whitelistSports || []).join(', '),
        flatOnly,
        weeklyPnl: e.weeklyPnl,
      });
    }
    return out;
  }, [entries, sportFilter, toggle, hcWallets]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: B.cardAlt, border: `1px solid ${B.goldBorder}`,
        borderRadius: '10px', padding: '0.65rem 0.75rem', minWidth: 160,
      }}>
        <div style={{ ...T.label, color: B.gold, fontWeight: 800, marginBottom: '0.35rem' }}>{d.name}</div>
        <div style={{ ...T.micro, color: B.textSec, lineHeight: 1.7 }}>
          <div>CLV {d.x.toFixed(1)}% · n={d.clvN}</div>
          <div>Sports ROI {d.y >= 0 ? '+' : ''}{d.y.toFixed(1)}%</div>
          {d.picksN >= 10 && d.picksWr != null && (
            <div>Pick WR {d.picksWr.toFixed(0)}% · {d.picksN}</div>
          )}
          <div>Sports: {d.sports || '—'}</div>
          <div>Open {d.open > 0 ? fmtVol(d.open) : '—'}</div>
        </div>
      </div>
    );
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
          </div>
          <div style={{ ...T.label, color: B.textMuted, fontWeight: 500 }}>
            Beats-close skill × sports ROI · radius = weekly heat / volume
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
          borderRadius: '12px', border: `1px solid ${B.border}`,
          background: `linear-gradient(160deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
          padding: isMobile ? '0.5rem 0.25rem 0.75rem' : '0.75rem 0.5rem 1rem',
          height: isMobile ? 280 : 360,
        }}
      >
        {points.length === 0 ? (
          <div style={{
            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...T.body, color: B.textMuted, textAlign: 'center', padding: '1rem',
          }}>
            Not enough wallets with CLV + ROI samples for this filter
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, bottom: 28, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis
                type="number" dataKey="x" name="CLV"
                domain={['auto', 'auto']}
                tick={{ fill: B.textMuted, fontSize: 10 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: 'Beats close %', position: 'insideBottom', offset: -12, fill: B.textSubtle, fontSize: 10 }}
              />
              <YAxis
                type="number" dataKey="y" name="ROI"
                domain={['auto', 'auto']}
                tick={{ fill: B.textMuted, fontSize: 10 }}
                tickFormatter={(v) => `${v}%`}
                width={48}
                label={{ value: 'Sports ROI', angle: -90, position: 'insideLeft', fill: B.textSubtle, fontSize: 10 }}
              />
              <ZAxis type="number" dataKey="z" range={[40, 280]} />
              <ReferenceLine y={0} stroke="rgba(148,163,184,0.25)" />
              <ReferenceLine x={50} stroke="rgba(212,175,55,0.2)" strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: B.goldBorder }} />
              <Scatter
                data={points}
                onClick={(d) => d?.wallet && onSelectWallet?.(d.wallet)}
                style={{ cursor: 'pointer' }}
              >
                {points.map((p) => (
                  <Cell
                    key={p.wallet}
                    fill={p.flatOnly ? 'rgba(148,163,184,0.55)' : B.gold}
                    fillOpacity={0.75}
                    stroke={p.flatOnly ? B.textMuted : B.goldHover}
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
      <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.45rem', lineHeight: 1.5 }}>
        Axes require real samples (CLV n ≥ {CLV_N_MIN}, LB volume &gt; 0). Thin wallets omitted.
        Gold = CONFIRMED in ≥1 sport · gray = FLAT-only.
      </div>
    </section>
  );
}

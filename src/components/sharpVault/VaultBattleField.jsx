import React, { useEffect, useMemo, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from 'recharts';
import { B, T, fmtVol, SPORT_COLORS } from './vaultTheme';

const CLV_N_MIN = 8;
const MIN_INVESTED = 250;
const MKT_ORDER = ['ML', 'SPREAD', 'TOTAL'];
const MKT_LABELS = { ML: 'Moneyline', SPREAD: 'Spread', TOTAL: 'Total' };

const CLS_META = {
  proven: { label: 'Proven', color: B.gold },
  cold: { label: 'Cold', color: B.red },
  tracked: { label: 'Tracked', color: '#94A3B8' },
};

/** left team owns negative x, right team positive, draw pinned center. */
const SIDE_SIGN = { away: -1, over: -1, home: 1, under: 1, draw: 0 };

function sideLabel(sideKey, game) {
  if (sideKey === 'over') return 'Over';
  if (sideKey === 'under') return 'Under';
  if (sideKey === 'home') return game.home;
  if (sideKey === 'away') return game.away;
  if (sideKey === 'draw') return 'Draw';
  return sideKey;
}

/** Signed log-money coordinate: ±log10(invested/MIN). $250→0, $2.5K→1, $25K→2… */
function moneyX(invested, sign) {
  const mag = Math.log10(Math.max(invested, MIN_INVESTED) / MIN_INVESTED);
  return sign * Math.max(mag, 0.08); // nudge off the center line so sides read
}

function xTickLabel(v) {
  const abs = Math.abs(v);
  const dollars = MIN_INVESTED * (10 ** abs);
  if (abs < 0.04) return '';
  return fmtVol(dollars);
}

function gameTime(commence) {
  if (!commence) return null;
  const d = new Date(commence);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Battle Field — Alpha-Field-style scatter for one game.
 * Sides face off across the center line; height = wallet ROI;
 * distance from center = money on the ticket; gold = proven, red = cold.
 */
export default function VaultBattleField({
  battleGames = [],
  sportFilter = 'ALL',
  selectedWallet = null,
  isMobile,
  onSelectWallet,
}) {
  const games = useMemo(
    () => (sportFilter === 'ALL' ? battleGames : battleGames.filter((g) => g.sport === sportFilter)),
    [battleGames, sportFilter],
  );

  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    if (!games.length) { setSelectedId(null); return; }
    if (!games.some((g) => g.id === selectedId)) setSelectedId(games[0].id);
  }, [games, selectedId]);
  const game = games.find((g) => g.id === selectedId) || null;

  const availableMkts = useMemo(
    () => (game ? MKT_ORDER.filter((m) => game.markets[m]?.wallets?.length > 0) : []),
    [game],
  );
  const [mkt, setMkt] = useState('ML');
  useEffect(() => {
    if (availableMkts.length && !availableMkts.includes(mkt)) setMkt(availableMkts[0]);
  }, [availableMkts, mkt]);

  const selected = selectedWallet ? String(selectedWallet).toLowerCase() : null;

  const { points, xMax, sideTotals, leftKey, rightKey } = useMemo(() => {
    const empty = { points: [], xMax: 2, sideTotals: {}, leftKey: null, rightKey: null };
    if (!game) return empty;
    const wallets = game.markets[mkt]?.wallets || [];
    if (!wallets.length) return empty;

    const totals = {};
    const out = [];
    let maxAbs = 1;
    for (const w of wallets) {
      const sign = SIDE_SIGN[w.side] ?? 1;
      const x = moneyX(w.invested, sign);
      maxAbs = Math.max(maxAbs, Math.abs(x));
      const roi = w.roi == null ? 0 : Math.max(-30, Math.min(60, w.roi));
      const t = totals[w.side] || (totals[w.side] = { invested: 0, proven: 0, provenInvested: 0, n: 0 });
      t.invested += w.invested; t.n++;
      if (w.cls === 'proven') { t.proven++; t.provenInvested += w.invested; }
      out.push({
        ...w,
        x,
        y: roi,
        roiRaw: w.roi,
        z: Math.max(50, Math.min(300, 50 + w.sizeRatio * 60)),
        selected: selected === w.wallet,
      });
    }
    // Paint proven above tracked, selected on top.
    out.sort((a, b) => {
      if (a.selected !== b.selected) return a.selected ? 1 : -1;
      if ((a.cls === 'proven') !== (b.cls === 'proven')) return a.cls === 'proven' ? 1 : -1;
      return 0;
    });
    const lk = mkt === 'TOTAL' ? 'over' : 'away';
    const rk = mkt === 'TOTAL' ? 'under' : 'home';
    return { points: out, xMax: Math.ceil(maxAbs * 1.15 * 10) / 10, sideTotals: totals, leftKey: lk, rightKey: rk };
  }, [game, mkt, selected]);

  if (!games.length) return null;

  const left = sideTotals[leftKey];
  const right = sideTotals[rightKey];
  const draw = sideTotals.draw;
  const provenSide = (left?.provenInvested || 0) === (right?.provenInvested || 0)
    ? null
    : (left?.provenInvested || 0) > (right?.provenInvested || 0) ? 'left' : 'right';

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    const meta = CLS_META[d.cls] || CLS_META.tracked;
    return (
      <div style={{
        background: B.cardAlt, border: `1px solid ${B.goldBorder}`,
        borderRadius: '10px', padding: '0.65rem 0.75rem', minWidth: 190,
        boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <span style={{ ...T.label, color: meta.color, fontWeight: 800 }}>{d.name}</span>
          <span style={{ ...T.tiny, color: meta.color, letterSpacing: '0.04em' }}>{meta.label}</span>
        </div>
        <div style={{ ...T.micro, color: B.textSec, lineHeight: 1.7 }}>
          <div style={{ color: B.text, fontWeight: 700 }}>
            {sideLabel(d.side, game)} · {fmtVol(d.invested)}
            {d.sizeRatio >= 1.5 && <span style={{ color: B.gold }}> · {d.sizeRatio.toFixed(1)}× usual</span>}
          </div>
          {d.roiRaw != null && <div>Sports ROI {d.roiRaw >= 0 ? '+' : ''}{d.roiRaw.toFixed(1)}%</div>}
          {d.clvPct != null && d.clvN >= CLV_N_MIN && <div>Beat close {d.clvPct.toFixed(0)}% · {d.clvN} bets</div>}
          {d.picksN >= 10 && d.picksWr != null && <div>With us {d.picksWr.toFixed(0)}% · {d.picksN} picks</div>}
          {d.inVault && <div style={{ color: B.gold, marginTop: '0.2rem' }}>Tap to open wallet profile</div>}
        </div>
      </div>
    );
  };

  const handleClick = (data) => {
    const p = data?.payload || data;
    if (p?.inVault && p?.wallet) onSelectWallet?.(p.wallet);
  };

  return (
    <section style={{ marginBottom: '1.75rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
          <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.08em' }}>Battle Field</span>
          <span style={{
            ...T.micro, padding: '0.1rem 0.4rem', borderRadius: '4px',
            background: B.goldDim, color: B.gold, fontWeight: 800,
          }}>{games.length}</span>
        </div>
        <div style={{ ...T.label, color: B.textMuted, fontWeight: 500 }}>
          Pick a game · sides face off across the line · gold = proven · height = wallet ROI · distance = money
        </div>
      </div>

      {/* Game selector strip */}
      <div style={{
        display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem',
        marginBottom: '0.75rem', WebkitOverflowScrolling: 'touch',
      }}>
        {games.map((g) => {
          const isSel = g.id === selectedId;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedId(g.id)}
              style={{
                flexShrink: 0, textAlign: 'left', cursor: 'pointer', color: 'inherit',
                padding: '0.45rem 0.6rem', borderRadius: '10px',
                background: isSel
                  ? 'rgba(212,175,55,0.12)'
                  : `linear-gradient(145deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                border: isSel ? `1px solid ${B.gold}` : `1px solid ${B.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ ...T.tiny, color: SPORT_COLORS[g.sport] || B.textSec, letterSpacing: '0.06em' }}>
                  {g.sport}
                </span>
                <span style={{ ...T.micro, color: isSel ? B.text : B.textSec, fontWeight: 800, whiteSpace: 'nowrap' }}>
                  {g.away} @ {g.home}
                </span>
              </div>
              <div style={{ ...T.tiny, color: B.textMuted, marginTop: '0.2rem', fontFeatureSettings: "'tnum'" }}>
                {fmtVol(g.totalInvested)} · {g.walletCount} wallets
                {g.provenInvested > 0 && <span style={{ color: B.gold }}> · {fmtVol(g.provenInvested)} proven</span>}
              </div>
            </button>
          );
        })}
      </div>

      {game && (
        <div
          className="sf-fade-in"
          style={{
            position: 'relative',
            borderRadius: '12px', border: `1px solid ${B.border}`,
            background: `linear-gradient(160deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
            padding: isMobile ? '0.5rem 0.25rem 0.75rem' : '0.75rem 0.5rem 1rem',
          }}
        >
          {/* Header — side banners face off */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'start',
            gap: '0.5rem', padding: isMobile ? '0.4rem 0.6rem 0.2rem' : '0.5rem 1rem 0.25rem',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                ...T.body, fontWeight: 900,
                color: provenSide === 'left' ? B.gold : B.text,
              }}>
                {game && sideLabel(leftKey, game)}
              </div>
              <div style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'", marginTop: '0.1rem' }}>
                {left ? <>{fmtVol(left.invested)} · {left.n} wallets{left.proven > 0 && <span style={{ color: B.gold }}> · {left.proven} proven</span>}</> : '—'}
              </div>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '0.1rem' }}>
              <div style={{ ...T.tiny, color: B.textSubtle, letterSpacing: '0.08em' }}>
                {game.sport}{gameTime(game.commence) ? ` · ${gameTime(game.commence)}` : ''}
              </div>
              {availableMkts.length > 1 && (
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.3rem', justifyContent: 'center' }}>
                  {availableMkts.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMkt(m)}
                      style={{
                        ...T.tiny, padding: '0.2rem 0.45rem', borderRadius: '999px', cursor: 'pointer',
                        border: mkt === m ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
                        background: mkt === m ? B.goldDim : 'transparent',
                        color: mkt === m ? B.gold : B.textMuted, fontWeight: 700,
                      }}
                    >
                      {MKT_LABELS[m]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ minWidth: 0, textAlign: 'right' }}>
              <div style={{
                ...T.body, fontWeight: 900,
                color: provenSide === 'right' ? B.gold : B.text,
              }}>
                {game && sideLabel(rightKey, game)}
              </div>
              <div style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'", marginTop: '0.1rem' }}>
                {right ? <>{fmtVol(right.invested)} · {right.n} wallets{right.proven > 0 && <span style={{ color: B.gold }}> · {right.proven} proven</span>}</> : '—'}
              </div>
            </div>
          </div>

          <div style={{ height: isMobile ? 300 : 380 }}>
            {points.length === 0 ? (
              <div style={{
                height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...T.body, color: B.textMuted,
              }}>
                No tracked money on this market yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, bottom: 24, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.10)" />
                  <XAxis
                    type="number" dataKey="x"
                    domain={[-xMax, xMax]}
                    tick={{ fill: B.textMuted, fontSize: 10 }}
                    tickFormatter={xTickLabel}
                    label={{ value: 'Money on the ticket', position: 'insideBottom', offset: -10, fill: B.textSubtle, fontSize: 10 }}
                  />
                  <YAxis
                    type="number" dataKey="y"
                    domain={['auto', 'auto']}
                    tick={{ fill: B.textMuted, fontSize: 10 }}
                    tickFormatter={(v) => `${v}%`}
                    width={44}
                    label={{ value: 'Sports ROI', angle: -90, position: 'insideLeft', fill: B.textSubtle, fontSize: 10 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 280]} />
                  <ReferenceLine x={0} stroke="rgba(212,175,55,0.30)" strokeDasharray="4 4" />
                  <ReferenceLine y={0} stroke="rgba(148,163,184,0.25)" />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: B.goldBorder }} />
                  <Scatter data={points} onClick={handleClick} style={{ cursor: 'pointer' }}>
                    {points.map((p) => {
                      const meta = CLS_META[p.cls] || CLS_META.tracked;
                      let stroke = p.cls === 'proven' ? B.goldHover : 'rgba(148,163,184,0.4)';
                      if (p.cls === 'cold') stroke = B.red;
                      let strokeWidth = p.sizeRatio >= 1.5 ? 2 : 1;
                      let fillOpacity = p.cls === 'proven' ? 0.9 : p.cls === 'cold' ? 0.75 : 0.45;
                      if (p.selected) { stroke = '#F8FAFC'; strokeWidth = 3; fillOpacity = 1; }
                      return (
                        <Cell
                          key={`${p.wallet}-${p.side}`}
                          fill={meta.color}
                          fillOpacity={fillOpacity}
                          stroke={stroke}
                          strokeWidth={strokeWidth}
                          className={p.sizeRatio >= 1.5 && p.cls === 'proven' && !p.selected ? 'vault-live-halo' : undefined}
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend + draw note */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem',
            flexWrap: 'wrap', paddingTop: '0.25rem',
          }}>
            {Object.entries(CLS_META).map(([k, m]) => (
              <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', ...T.tiny, color: B.textMuted }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, opacity: k === 'tracked' ? 0.5 : 0.9 }} />
                {m.label}
              </span>
            ))}
            <span style={{ ...T.tiny, color: B.textSubtle }}>ring = 1.5×+ usual size</span>
            {draw && (
              <span style={{ ...T.tiny, color: B.textSubtle }}>
                Draw money sits on the center line · {fmtVol(draw.invested)}
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.45rem', lineHeight: 1.5 }}>
        Proven = Vault-verified winner · Cold = negative graded record with us (10+ picks) ·
        Tracked = watched, no verdict yet. Positions under $250 omitted. Tap a proven dot for the full profile.
      </div>
    </section>
  );
}

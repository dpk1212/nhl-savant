import React, { useEffect, useMemo, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from 'recharts';
import { B, T, fmtVol, SPORT_COLORS } from './vaultTheme';

const CLV_N_MIN = 8;
const MIN_INVESTED = 250;
const TOGGLES = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active today' },
  { id: 'hc', label: 'Heavy size' },
];
const MKT_ORDER = ['ML', 'SPREAD', 'TOTAL'];
const MKT_LABELS = { ML: 'Moneyline', SPREAD: 'Spread', TOTAL: 'Total' };

const CLS_META = {
  proven: { label: 'Proven', color: B.gold },
  cold: { label: 'Cold', color: B.red },
  tracked: { label: 'Tracked', color: '#94A3B8' },
};

/** left team owns negative x, right team positive, draw pinned center. */
const SIDE_SIGN = { away: -1, over: -1, home: 1, under: 1, draw: 0 };

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
  if (abs < 0.04) return '';
  return fmtVol(MIN_INVESTED * (10 ** abs));
}

function gameTime(commence) {
  if (!commence) return null;
  const d = new Date(commence);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Alpha Field — one chart, two lenses.
 * "All wallets": CLV × sports ROI skill field (qualified wallets only).
 * Game selected: battle layout — sides face off across the center line,
 * height = wallet ROI, distance = money, gold proven / red cold / slate tracked.
 */
export default function VaultAlphaField({
  entries = [],
  actionPositions = [],
  openLegsByWallet = {},
  battleGames = [],
  sportFilter = 'ALL',
  selectedWallet = null,
  isMobile,
  onSelectWallet,
}) {
  const [toggle, setToggle] = useState('all');
  const [gameId, setGameId] = useState(null); // null = field mode
  const [mkt, setMkt] = useState('ML');

  const games = useMemo(
    () => (sportFilter === 'ALL' ? battleGames : battleGames.filter((g) => g.sport === sportFilter)),
    [battleGames, sportFilter],
  );
  useEffect(() => {
    if (gameId && !games.some((g) => g.id === gameId)) setGameId(null);
  }, [games, gameId]);
  const game = gameId ? games.find((g) => g.id === gameId) || null : null;

  const availableMkts = useMemo(
    () => (game ? MKT_ORDER.filter((m) => game.markets[m]?.wallets?.length > 0) : []),
    [game],
  );
  useEffect(() => {
    if (availableMkts.length && !availableMkts.includes(mkt)) setMkt(availableMkts[0]);
  }, [availableMkts, mkt]);

  const hcWallets = useMemo(() => {
    const s = new Set();
    for (const p of actionPositions) {
      if (p.vault_isHcWallet) s.add((p.wallet || '').toLowerCase());
    }
    return s;
  }, [actionPositions]);

  const selected = selectedWallet ? String(selectedWallet).toLowerCase() : null;

  // ── Field mode points (CLV × ROI, qualified wallets) ──────────────────────
  const fieldPoints = useMemo(() => {
    if (game) return [];
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
    out.sort((a, b) => {
      if (a.selected !== b.selected) return a.selected ? 1 : -1;
      if (a.isHc !== b.isHc) return a.isHc ? 1 : -1;
      if (a.isLive !== b.isLive) return a.isLive ? 1 : -1;
      return 0;
    });
    return out;
  }, [game, entries, sportFilter, toggle, hcWallets, openLegsByWallet, selected]);

  // ── Battle mode points (side × ROI × money) ───────────────────────────────
  const battle = useMemo(() => {
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
    out.sort((a, b) => {
      if (a.selected !== b.selected) return a.selected ? 1 : -1;
      if ((a.cls === 'proven') !== (b.cls === 'proven')) return a.cls === 'proven' ? 1 : -1;
      return 0;
    });
    const lk = mkt === 'TOTAL' ? 'over' : 'away';
    const rk = mkt === 'TOTAL' ? 'under' : 'home';
    return { points: out, xMax: Math.ceil(maxAbs * 1.15 * 10) / 10, sideTotals: totals, leftKey: lk, rightKey: rk };
  }, [game, mkt, selected]);

  const isBattle = !!game;
  const points = isBattle ? battle.points : fieldPoints;
  const liveCount = fieldPoints.filter((p) => p.isLive).length;
  const hcCount = fieldPoints.filter((p) => p.isHc).length;

  const left = battle.sideTotals[battle.leftKey];
  const right = battle.sideTotals[battle.rightKey];
  const draw = battle.sideTotals.draw;
  const provenSide = (left?.provenInvested || 0) === (right?.provenInvested || 0)
    ? null
    : (left?.provenInvested || 0) > (right?.provenInvested || 0) ? 'left' : 'right';

  const FieldTooltip = ({ active, payload }) => {
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

  const BattleTooltip = ({ active, payload }) => {
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
          <div style={{ color: B.gold, marginTop: '0.2rem' }}>Tap to open positions</div>
        </div>
      </div>
    );
  };

  const handleScatterClick = (data) => {
    const p = data?.payload || data;
    if (!p?.wallet) return;
    // Battle dots always open — open legs are fed from the RAW position
    // scan so tracked / cross-sport tickets show up (not just vault-qualified).
    // Pass the active game so the drawer leads with that sport/matchup.
    if (isBattle && game) {
      onSelectWallet?.(p.wallet, { sport: game.sport, gameKey: game.gameKey });
    } else {
      onSelectWallet?.(p.wallet);
    }
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
            {!isBattle && liveCount > 0 && (
              <span style={{ ...T.micro, color: B.green, fontWeight: 700 }}>
                {liveCount} live
              </span>
            )}
            {!isBattle && hcCount > 0 && (
              <span style={{ ...T.micro, color: B.gold, fontWeight: 700 }}>
                {hcCount} heavy
              </span>
            )}
          </div>
          <div style={{ ...T.label, color: B.textMuted, fontWeight: 500 }}>
            {isBattle
              ? 'Sides face off across the line · gold = proven in this sport · height = wallet ROI · distance = money'
              : 'Beat the close vs sports ROI · ring = betting today · bright = heavy size'}
          </div>
        </div>
        {!isBattle && (
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
        )}
      </div>

      {/* Lens strip — the whole field, or one game's battle */}
      {games.length > 0 && (
        <div style={{
          display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem',
          marginBottom: '0.75rem', WebkitOverflowScrolling: 'touch',
        }}>
          <button
            type="button"
            onClick={() => setGameId(null)}
            style={{
              flexShrink: 0, cursor: 'pointer', color: 'inherit', textAlign: 'left',
              padding: '0.45rem 0.7rem', borderRadius: '10px',
              background: !gameId ? 'rgba(212,175,55,0.12)' : `linear-gradient(145deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
              border: !gameId ? `1px solid ${B.gold}` : `1px solid ${B.border}`,
            }}
          >
            <div style={{ ...T.micro, color: !gameId ? B.gold : B.textSec, fontWeight: 800, whiteSpace: 'nowrap' }}>
              All wallets
            </div>
            <div style={{ ...T.tiny, color: B.textMuted, marginTop: '0.2rem' }}>Skill field</div>
          </button>
          {games.map((g) => {
            const isSel = g.id === gameId;
            // Selected chip mirrors the active market toggle so a TOTAL-only
            // wallet never inflates "N wallets" while the MONEYLINE map is empty of that dot.
            const mktStats = isSel ? g.markets?.[mkt] : null;
            const chipInvested = mktStats?.totalInvested ?? g.totalInvested;
            const chipWallets = mktStats?.walletCount ?? g.walletCount;
            const chipProven = mktStats?.provenInvested ?? g.provenInvested;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGameId(g.id)}
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
                  {fmtVol(chipInvested)} · {chipWallets} wallets
                  {chipProven > 0 && <span style={{ color: B.gold }}> · {fmtVol(chipProven)} proven</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div
        className="sf-fade-in"
        style={{
          position: 'relative',
          borderRadius: '12px', border: `1px solid ${B.border}`,
          background: `linear-gradient(160deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
          padding: isMobile ? '0.5rem 0.25rem 0.75rem' : '0.75rem 0.5rem 1rem',
        }}
      >
        {/* Battle header — side banners face off */}
        {isBattle && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'start',
            gap: '0.5rem', padding: isMobile ? '0.4rem 0.6rem 0.2rem' : '0.5rem 1rem 0.25rem',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ ...T.body, fontWeight: 900, color: provenSide === 'left' ? B.gold : B.text }}>
                {sideLabel(battle.leftKey, game)}
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
              <div style={{ ...T.body, fontWeight: 900, color: provenSide === 'right' ? B.gold : B.text }}>
                {sideLabel(battle.rightKey, game)}
              </div>
              <div style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'", marginTop: '0.1rem' }}>
                {right ? <>{fmtVol(right.invested)} · {right.n} wallets{right.proven > 0 && <span style={{ color: B.gold }}> · {right.proven} proven</span>}</> : '—'}
              </div>
            </div>
          </div>
        )}

        {/* Quadrant whispers — field mode only */}
        {!isBattle && !isMobile && points.length > 0 && (
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

        <div style={{ height: isMobile ? 300 : 400 }}>
          {points.length === 0 ? (
            <div style={{
              height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...T.body, color: B.textMuted, textAlign: 'center', padding: '1rem',
            }}>
              {isBattle
                ? 'No tracked money on this market yet'
                : 'Not enough wallets with a clear track record for this filter'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 16, right: 16, bottom: 28, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
                {isBattle ? (
                  <XAxis
                    type="number" dataKey="x"
                    domain={[-battle.xMax, battle.xMax]}
                    tick={{ fill: B.textMuted, fontSize: 10 }}
                    tickFormatter={xTickLabel}
                    label={{ value: 'Money on the ticket', position: 'insideBottom', offset: -12, fill: B.textSubtle, fontSize: 10 }}
                  />
                ) : (
                  <XAxis
                    type="number" dataKey="x" name="Beat close"
                    domain={['auto', 'auto']}
                    tick={{ fill: B.textMuted, fontSize: 10 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{ value: 'Beat the close %', position: 'insideBottom', offset: -12, fill: B.textSubtle, fontSize: 10 }}
                  />
                )}
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
                {isBattle
                  ? <ReferenceLine x={0} stroke="rgba(212,175,55,0.30)" strokeDasharray="4 4" />
                  : <ReferenceLine x={50} stroke="rgba(212,175,55,0.22)" strokeDasharray="4 4" />}
                <Tooltip
                  content={isBattle ? <BattleTooltip /> : <FieldTooltip />}
                  cursor={{ stroke: B.goldBorder }}
                />
                <Scatter
                  data={points}
                  onClick={handleScatterClick}
                  style={{ cursor: 'pointer' }}
                >
                  {points.map((p) => {
                    if (isBattle) {
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
                    }
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

        {/* Battle legend */}
        {isBattle && (
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
                Draw money on the center line · {fmtVol(draw.invested)}
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.45rem', lineHeight: 1.5 }}>
        {isBattle
          ? 'Proven = Vault-verified winner in this sport · Cold = negative graded record with us (10+ picks) · Tracked = open ticket, not sport-proven. Positions under $250 omitted. Tap a proven dot for the full profile.'
          : `Only wallets with enough history to trust (${CLV_N_MIN}+ graded bets and real sports volume). Hover a live wallet for its largest open bet — full markets are on Locked Picks and Live.`}
      </div>
    </section>
  );
}

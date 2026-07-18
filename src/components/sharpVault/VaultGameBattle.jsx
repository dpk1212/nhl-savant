import React, { useEffect, useMemo, useState } from 'react';
import { B, T, fmtVol, SPORT_COLORS } from './vaultTheme';

const CLV_N_MIN = 8;
const MKT_ORDER = ['ML', 'SPREAD', 'TOTAL'];
const MKT_LABELS = { ML: 'Moneyline', SPREAD: 'Spread', TOTAL: 'Total' };

const CLS_META = {
  proven: { label: 'Proven', color: B.gold, dim: B.goldDim, border: B.goldBorder },
  cold: { label: 'Cold', color: B.red, dim: B.redDim, border: 'rgba(239,68,68,0.3)' },
  tracked: { label: 'Tracked', color: B.textSec, dim: 'rgba(148,163,184,0.1)', border: B.border },
};

function sideLabel(sideKey, game) {
  if (sideKey === 'over') return 'Over';
  if (sideKey === 'under') return 'Under';
  if (sideKey === 'home') return game.home;
  if (sideKey === 'away') return game.away;
  if (sideKey === 'draw') return 'Draw';
  return sideKey;
}

function orderedSides(mktRec) {
  const keys = Object.keys(mktRec.sides);
  const rank = { away: 0, over: 0, home: 1, under: 1, draw: 2 };
  return keys.sort((a, b) => (rank[a] ?? 3) - (rank[b] ?? 3));
}

/** Mean beat-close % across proven wallets with a trustable CLV sample. */
function provenClv(side) {
  const vals = (side?.wallets || [])
    .filter((w) => w.cls === 'proven' && w.clvPct != null && w.clvN >= CLV_N_MIN)
    .map((w) => w.clvPct);
  if (!vals.length) return null;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

function gameTime(commence) {
  if (!commence) return null;
  const d = new Date(commence);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** One A-vs-B metric row — screenshot "THE BATTLE" style with mirrored bars. */
function MetricRow({ label, a, b, fmt, higherWins = true, isMobile }) {
  const aNum = a ?? 0;
  const bNum = b ?? 0;
  const max = Math.max(Math.abs(aNum), Math.abs(bNum)) || 1;
  const aPct = Math.abs(aNum) / max;
  const bPct = Math.abs(bNum) / max;
  const aLeads = higherWins ? aNum > bNum : aNum < bNum;
  const bLeads = higherWins ? bNum > aNum : bNum < aNum;
  const render = (v) => (v == null ? '—' : fmt(v));
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '58px 1fr 58px' : '80px 1fr 80px',
      alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0',
    }}>
      <span style={{
        ...T.label, fontWeight: 800, fontFeatureSettings: "'tnum'", textAlign: 'left',
        color: aLeads ? B.gold : B.textSec,
      }}>{render(a)}</span>
      <div>
        <div style={{ ...T.tiny, color: B.textSubtle, textAlign: 'center', marginBottom: '0.25rem' }}>
          {label}
        </div>
        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(148,163,184,0.12)', overflow: 'hidden', transform: 'scaleX(-1)' }}>
            <div style={{
              width: `${aPct * 100}%`, height: '100%', borderRadius: 2,
              background: aLeads ? B.gold : 'rgba(148,163,184,0.45)',
            }} />
          </div>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(148,163,184,0.12)', overflow: 'hidden' }}>
            <div style={{
              width: `${bPct * 100}%`, height: '100%', borderRadius: 2,
              background: bLeads ? B.gold : 'rgba(148,163,184,0.45)',
            }} />
          </div>
        </div>
      </div>
      <span style={{
        ...T.label, fontWeight: 800, fontFeatureSettings: "'tnum'", textAlign: 'right',
        color: bLeads ? B.gold : B.textSec,
      }}>{render(b)}</span>
    </div>
  );
}

function WalletChip({ w, onSelectWallet, isMobile }) {
  const meta = CLS_META[w.cls] || CLS_META.tracked;
  const showMult = w.sizeRatio >= 1.5;
  return (
    <button
      type="button"
      onClick={() => { if (w.inVault) onSelectWallet?.(w.wallet); }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.4rem', width: '100%', textAlign: 'left', cursor: w.inVault ? 'pointer' : 'default',
        padding: isMobile ? '0.4rem 0.5rem' : '0.35rem 0.55rem',
        borderRadius: '8px', color: 'inherit',
        background: w.cls === 'proven' ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${w.cls === 'proven' ? B.goldBorder : B.borderSubtle}`,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
        <span style={{
          ...T.tiny, padding: '0.05rem 0.3rem', borderRadius: '3px', flexShrink: 0,
          color: meta.color, background: meta.dim, border: `1px solid ${meta.border}`,
        }}>{meta.label}</span>
        <span style={{ ...T.micro, color: B.text, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {w.name}
        </span>
        {showMult && (
          <span style={{ ...T.tiny, color: B.gold, flexShrink: 0 }}>{w.sizeRatio.toFixed(1)}×</span>
        )}
      </span>
      <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'", fontWeight: 700, flexShrink: 0 }}>
        {fmtVol(w.invested)}
        {w.clvPct != null && w.clvN >= CLV_N_MIN && (
          <span style={{ color: B.textSubtle }}> · {w.clvPct.toFixed(0)}%</span>
        )}
      </span>
    </button>
  );
}

/**
 * Battle Map — per-game war room. Game selector strip + head-to-head pane
 * showing EVERY tracked wallet (proven / cold / tracked) split by side.
 */
export default function VaultGameBattle({
  battleGames = [],
  sportFilter = 'ALL',
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
    () => (game ? MKT_ORDER.filter((m) => game.markets[m] && Object.keys(game.markets[m].sides).length > 0) : []),
    [game],
  );
  const [mkt, setMkt] = useState('ML');
  useEffect(() => {
    if (availableMkts.length && !availableMkts.includes(mkt)) setMkt(availableMkts[0]);
  }, [availableMkts, mkt]);

  if (!games.length) return null;

  const mktRec = game?.markets?.[mkt];
  const sides = mktRec ? orderedSides(mktRec) : [];
  const twoSided = sides.length >= 2;
  const [sa, sb, ...extraSides] = sides;
  const A = mktRec?.sides?.[sa];
  const bSide = mktRec?.sides?.[sb];
  const totalPot = (A?.invested || 0) + (bSide?.invested || 0);
  const aMoneyPct = totalPot > 0 ? ((A?.invested || 0) / totalPot) * 100 : 50;
  const provenLean = (A?.provenInvested || 0) >= (bSide?.provenInvested || 0) ? sa : sb;
  const provenLeanSide = provenLean === sa ? A : bSide;
  const hasProven = (A?.provenCount || 0) + (bSide?.provenCount || 0) > 0;

  return (
    <section style={{ marginBottom: '1.75rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: B.gold }} />
          <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.08em' }}>Battle Map</span>
          <span style={{
            ...T.micro, padding: '0.1rem 0.4rem', borderRadius: '4px',
            background: B.goldDim, color: B.gold, fontWeight: 800,
          }}>{games.length}</span>
        </div>
        <div style={{ ...T.label, color: B.textMuted, fontWeight: 500 }}>
          Pick a game · every tracked wallet mapped to its side · gold = our proven winners
        </div>
      </div>

      {/* Game selector strip */}
      <div style={{
        display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.5rem',
        marginBottom: '0.75rem', WebkitOverflowScrolling: 'touch',
      }}>
        {games.map((g) => {
          const isSel = g.id === selectedId;
          const time = gameTime(g.commence);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedId(g.id)}
              style={{
                flexShrink: 0, textAlign: 'left', cursor: 'pointer', color: 'inherit',
                padding: '0.5rem 0.65rem', borderRadius: '10px', minWidth: 148,
                background: isSel
                  ? 'rgba(212,175,55,0.12)'
                  : `linear-gradient(145deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
                border: isSel ? `1px solid ${B.gold}` : `1px solid ${B.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <span style={{
                  ...T.tiny, color: SPORT_COLORS[g.sport] || B.textSec, letterSpacing: '0.06em',
                }}>{g.sport}</span>
                {time && <span style={{ ...T.tiny, color: B.textSubtle }}>{time}</span>}
              </div>
              <div style={{ ...T.micro, color: B.text, fontWeight: 800, whiteSpace: 'nowrap' }}>
                {g.away} @ {g.home}
              </div>
              <div style={{ ...T.tiny, color: B.textMuted, marginTop: '0.25rem', fontFeatureSettings: "'tnum'" }}>
                {fmtVol(g.totalInvested)} · {g.walletCount} wallets
                {g.provenInvested > 0 && (
                  <span style={{ color: B.gold }}> · {fmtVol(g.provenInvested)} proven</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {game && mktRec && (
        <div
          className="sf-fade-in"
          style={{
            borderRadius: '12px', border: `1px solid ${B.border}`,
            background: `linear-gradient(160deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
            padding: isMobile ? '0.85rem 0.75rem' : '1.1rem 1.25rem',
          }}
        >
          {/* Header — matchup + market tabs */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem',
          }}>
            <div>
              <div style={{ ...T.sub, color: B.text, fontWeight: 800 }}>
                {game.away} @ {game.home}
              </div>
              <div style={{ ...T.tiny, color: B.textSubtle, marginTop: '0.15rem', letterSpacing: '0.05em' }}>
                {game.sport}{gameTime(game.commence) ? ` · ${gameTime(game.commence)}` : ''} · {game.walletCount} tracked wallets
              </div>
            </div>
            {availableMkts.length > 1 && (
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {availableMkts.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMkt(m)}
                    style={{
                      ...T.micro, padding: '0.25rem 0.55rem', borderRadius: '999px', cursor: 'pointer',
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

          {twoSided ? (
            <>
              {/* Side headers + money split */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ ...T.body, color: provenLean === sa && hasProven ? B.gold : B.text, fontWeight: 900 }}>
                    {sideLabel(sa, game)}
                  </div>
                  {provenLean === sa && hasProven && (provenLeanSide?.provenCount || 0) > 0 && (
                    <span style={{
                      ...T.tiny, color: B.gold, background: B.goldDim, border: `1px solid ${B.goldBorder}`,
                      padding: '0.05rem 0.35rem', borderRadius: '3px',
                    }}>Our side</span>
                  )}
                </div>
                <span style={{ ...T.tiny, color: B.textSubtle }}>VS</span>
                <div style={{ minWidth: 0, textAlign: 'right' }}>
                  <div style={{ ...T.body, color: provenLean === sb && hasProven ? B.gold : B.text, fontWeight: 900 }}>
                    {sideLabel(sb, game)}
                  </div>
                  {provenLean === sb && hasProven && (provenLeanSide?.provenCount || 0) > 0 && (
                    <span style={{
                      ...T.tiny, color: B.gold, background: B.goldDim, border: `1px solid ${B.goldBorder}`,
                      padding: '0.05rem 0.35rem', borderRadius: '3px',
                    }}>Our side</span>
                  )}
                </div>
              </div>
              <div style={{
                display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden',
                marginBottom: '0.35rem', background: 'rgba(148,163,184,0.12)',
              }}>
                <div style={{ width: `${aMoneyPct}%`, background: B.gold, opacity: 0.85 }} />
                <div style={{ width: `${100 - aMoneyPct}%`, background: 'rgba(148,163,184,0.4)' }} />
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                ...T.tiny, color: B.textSubtle, marginBottom: '0.85rem', fontFeatureSettings: "'tnum'",
              }}>
                <span>{aMoneyPct.toFixed(0)}% of head-to-head money</span>
                <span>{(100 - aMoneyPct).toFixed(0)}%</span>
              </div>

              {/* THE BATTLE metric rows */}
              <div style={{
                borderTop: `1px solid ${B.borderSubtle}`, borderBottom: `1px solid ${B.borderSubtle}`,
                padding: '0.35rem 0', marginBottom: '0.9rem',
              }}>
                <MetricRow label="Proven winners" a={A?.provenCount || 0} b={bSide?.provenCount || 0} fmt={(v) => String(v)} isMobile={isMobile} />
                <MetricRow label="Proven money" a={A?.provenInvested || 0} b={bSide?.provenInvested || 0} fmt={fmtVol} isMobile={isMobile} />
                <MetricRow label="All tracked money" a={A?.invested || 0} b={bSide?.invested || 0} fmt={fmtVol} isMobile={isMobile} />
                <MetricRow
                  label="Beat the close (proven)"
                  a={provenClv(A)} b={provenClv(bSide)}
                  fmt={(v) => `${v.toFixed(0)}%`} isMobile={isMobile}
                />
                {((A?.coldCount || 0) + (bSide?.coldCount || 0)) > 0 && (
                  <MetricRow
                    label="Cold money (fade tape)"
                    a={A?.coldInvested || 0} b={bSide?.coldInvested || 0}
                    fmt={fmtVol} higherWins={false} isMobile={isMobile}
                  />
                )}
              </div>

              {/* Wallet rosters per side */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '0.85rem' : '1rem',
              }}>
                {[{ key: sa, side: A }, { key: sb, side: bSide }].map(({ key, side }) => (
                  <div key={key}>
                    <div style={{ ...T.tiny, color: B.textSubtle, letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      {sideLabel(key, game)} · {(side?.wallets || []).length} wallets
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {(side?.wallets || []).map((w) => (
                        <WalletChip key={`${w.wallet}-${key}`} w={w} onSelectWallet={onSelectWallet} isMobile={isMobile} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 3-way markets (soccer draw etc.) — remaining outcomes below the battle */}
              {extraSides.length > 0 && (
                <div style={{ marginTop: '0.9rem', paddingTop: '0.75rem', borderTop: `1px solid ${B.borderSubtle}` }}>
                  {extraSides.map((key) => {
                    const side = mktRec.sides[key];
                    return (
                      <div key={key} style={{ marginBottom: '0.5rem' }}>
                        <div style={{ ...T.tiny, color: B.textSubtle, letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                          {sideLabel(key, game)} · {(side?.wallets || []).length} wallets · {fmtVol(side?.invested || 0)}
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                          gap: '0.3rem',
                        }}>
                          {(side?.wallets || []).map((w) => (
                            <WalletChip key={`${w.wallet}-${key}`} w={w} onSelectWallet={onSelectWallet} isMobile={isMobile} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* One-sided market — no battle, still show the roster honestly */
            <div>
              <div style={{ ...T.label, color: B.textMuted, marginBottom: '0.5rem' }}>
                All tracked money is on one side — no battle here yet
              </div>
              {sides.map((key) => (
                <div key={key}>
                  <div style={{ ...T.body, color: B.text, fontWeight: 900, marginBottom: '0.4rem' }}>
                    {sideLabel(key, game)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {(mktRec.sides[key]?.wallets || []).map((w) => (
                      <WalletChip key={w.wallet} w={w} onSelectWallet={onSelectWallet} isMobile={isMobile} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.45rem', lineHeight: 1.5 }}>
        Proven = Vault-verified winner · Cold = negative graded record with us (10+ picks) ·
        Tracked = watched wallet, no verdict yet. Positions under $250 omitted.
        Tap a proven wallet to open its full profile.
      </div>
    </section>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { B, T, SPORT_COLORS, fmtVol, signedVol } from './vaultTheme';

const TABS = [
  { id: 'open', label: 'Open positions' },
  { id: 'track', label: 'Track record' },
  { id: 'sports', label: 'Sports' },
];

/**
 * Slide-over wallet profile — open legs, Source A/B track, sport tiers.
 * When opened from a Battle Field dot, `focusLeg` pins that sport/game first;
 * other sports sit in collapsed "More" sections below.
 */
export default function VaultWalletDrawer({
  wallet,
  entry,
  openLegs = [],
  focusLeg = null, // { sport, gameKey } | null
  isMobile,
  onClose,
}) {
  const [tab, setTab] = useState('open');
  // Sport keys expanded in the "More" accordion. Focus sport is always open.
  const [expandedSports, setExpandedSports] = useState(() => new Set());

  useEffect(() => {
    setTab('open');
    setExpandedSports(new Set());
  }, [wallet, focusLeg?.sport, focusLeg?.gameKey]);

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

  const openSections = useMemo(() => {
    if (!sortedLegs.length) return null;
    const focusSport = focusLeg?.sport || null;
    const focusKey = focusLeg?.gameKey || null;

    const focusGameLegs = focusSport && focusKey
      ? sortedLegs.filter((l) => l.sport === focusSport && l.gameKey === focusKey)
      : [];
    const focusSportOther = focusSport
      ? sortedLegs.filter((l) => l.sport === focusSport && (!focusKey || l.gameKey !== focusKey))
      : [];

    const bySport = new Map();
    for (const leg of sortedLegs) {
      if (focusSport && leg.sport === focusSport) continue;
      if (!bySport.has(leg.sport)) bySport.set(leg.sport, []);
      bySport.get(leg.sport).push(leg);
    }
    const otherSports = [...bySport.entries()]
      .map(([sport, legs]) => ({
        sport,
        legs,
        invested: legs.reduce((s, l) => s + (l.invested || 0), 0),
      }))
      .sort((a, b) => b.invested - a.invested);

    return { focusSport, focusGameLegs, focusSportOther, otherSports };
  }, [sortedLegs, focusLeg]);

  if (!wallet || !entry) return null;

  const pnl = entry.sportPnlTotal || 0;
  const roi = entry.roi;
  const week = entry.weeklyPnl;

  const toggleSport = (sport) => {
    setExpandedSports((prev) => {
      const next = new Set(prev);
      if (next.has(sport)) next.delete(sport);
      else next.add(sport);
      return next;
    });
  };

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
                {entry._battleOnly ? 'Tracked wallet' : 'Vault wallet'}
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
                No open sports bets for this wallet right now
              </div>
            ) : openSections?.focusSport ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Pinned game from the battle-map click */}
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                    marginBottom: '0.4rem',
                  }}>
                    <span style={{ ...T.tiny, color: B.gold, letterSpacing: '0.1em', fontWeight: 800 }}>
                      THIS GAME · {openSections.focusSport}
                    </span>
                    <span style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                      {openSections.focusGameLegs.length} open
                    </span>
                  </div>
                  {openSections.focusGameLegs.length === 0 ? (
                    <div style={{
                      ...T.micro, color: B.textMuted, padding: '0.75rem',
                      borderRadius: '10px', border: `1px dashed ${B.border}`,
                    }}>
                      No open ticket on this matchup for this wallet
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {openSections.focusGameLegs.map((leg, i) => (
                        <LegCard key={`focus-${leg.gameKey}-${leg.marketType}-${leg.side}-${i}`} leg={leg} highlight />
                      ))}
                    </div>
                  )}
                </div>

                {openSections.focusSportOther.length > 0 && (
                  <SportAccordion
                    sport={openSections.focusSport}
                    legs={openSections.focusSportOther}
                    expanded
                    onToggle={() => {}}
                    label={`More ${openSections.focusSport}`}
                    forceOpen
                  />
                )}

                {openSections.otherSports.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ ...T.tiny, color: B.textSubtle, letterSpacing: '0.1em', fontWeight: 800, marginTop: '0.25rem' }}>
                      OTHER SPORTS
                    </div>
                    {openSections.otherSports.map(({ sport, legs, invested }) => (
                      <SportAccordion
                        key={sport}
                        sport={sport}
                        legs={legs}
                        invested={invested}
                        expanded={expandedSports.has(sport)}
                        onToggle={() => toggleSport(sport)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Roster / field click — group by sport, first expanded, rest collapsed
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {groupLegsBySport(sortedLegs).map(({ sport, legs, invested }, idx) => {
                  const open = expandedSports.size === 0
                    ? idx === 0
                    : expandedSports.has(sport);
                  return (
                    <SportAccordion
                      key={sport}
                      sport={sport}
                      legs={legs}
                      invested={invested}
                      expanded={open}
                      onToggle={() => {
                        setExpandedSports((prev) => {
                          const groups = groupLegsBySport(sortedLegs);
                          const next = new Set(prev);
                          if (prev.size === 0 && groups[0]) next.add(groups[0].sport);
                          if (next.has(sport)) next.delete(sport);
                          else next.add(sport);
                          return next;
                        });
                      }}
                    />
                  );
                })}
              </div>
            )
          )}

          {tab === 'track' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <TrackBlock
                title="Pick record"
                subtitle="How their featured picks have finished"
                rows={[
                  { label: 'Win rate', value: entry.picks?.n ? `${entry.picks.wr}%` : '—' },
                  { label: 'Picks graded', value: entry.picks?.n ? String(entry.picks.n) : '—' },
                  { label: 'Even-stake ROI', value: entry.picks?.n ? `${entry.picks.flatRoi}%` : '—' },
                  { label: 'Record', value: entry.picks?.n ? `${entry.picks.wins}-${entry.picks.losses}` : '—' },
                ]}
              />
              <TrackBlock
                title="Position record"
                subtitle="How their real-money sports positions have settled"
                rows={[
                  { label: 'Win rate', value: entry.positionsTrack?.n ? `${entry.positionsTrack.wr}%` : '—' },
                  { label: 'Positions graded', value: entry.positionsTrack?.n ? String(entry.positionsTrack.n) : '—' },
                  { label: 'Dollar ROI', value: entry.positionsTrack?.dollarRoi != null ? `${entry.positionsTrack.dollarRoi}%` : '—' },
                  { label: 'Settled P&L', value: entry.positionsTrack?.settledPnl != null ? signedVol(entry.positionsTrack.settledPnl) : '—' },
                ]}
              />
              <TrackBlock
                title="Beat the close"
                subtitle="Share of graded bets that got a better price than the closing line"
                rows={[
                  { label: 'Beat close', value: entry.clvSkill?.pctPos != null ? `${entry.clvSkill.pctPos}%` : '—' },
                  { label: 'Bets graded', value: entry.clvSkill?.n != null ? String(entry.clvSkill.n) : '—' },
                  { label: 'Since', value: entry.clvSkill?.since || '—' },
                ]}
              />
            </div>
          )}

          {tab === 'sports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ ...T.micro, color: B.textSubtle, marginBottom: '0.35rem' }}>
                Sports where this wallet qualifies · activity only, not profit by sport
              </div>
              {Object.entries(entry.bySport || {})
                .filter(([, rec]) => rec?.whitelistTier === 'CONFIRMED' || rec?.whitelistTier === 'FLAT')
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([sport, rec]) => {
                  const sc = SPORT_COLORS[sport] || B.gold;
                  const bets = rec?.picks?.n ?? entry.perSport?.[sport]?.bets ?? null;
                  const tierLabel = rec.whitelistTier === 'CONFIRMED' ? 'Proven' : 'Steady';
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
                          {tierLabel}
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

function groupLegsBySport(legs) {
  const bySport = new Map();
  for (const leg of legs) {
    if (!bySport.has(leg.sport)) bySport.set(leg.sport, []);
    bySport.get(leg.sport).push(leg);
  }
  return [...bySport.entries()]
    .map(([sport, sportLegs]) => ({
      sport,
      legs: sportLegs,
      invested: sportLegs.reduce((s, l) => s + (l.invested || 0), 0),
    }))
    .sort((a, b) => b.invested - a.invested);
}

function SportAccordion({ sport, legs, invested, expanded, onToggle, label, forceOpen }) {
  const sc = SPORT_COLORS[sport] || B.gold;
  const open = forceOpen || expanded;
  const total = invested ?? legs.reduce((s, l) => s + (l.invested || 0), 0);
  return (
    <div style={{
      borderRadius: '10px',
      border: `1px solid ${B.border}`,
      background: B.card,
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={forceOpen ? undefined : onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '0.5rem', padding: '0.65rem 0.75rem', cursor: forceOpen ? 'default' : 'pointer',
          background: 'transparent', border: 'none', color: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{
            ...T.micro, padding: '0.15rem 0.4rem', borderRadius: '4px',
            background: sc + '18', color: sc, fontWeight: 800,
          }}>{sport}</span>
          <span style={{ ...T.micro, color: B.textSec, fontWeight: 700 }}>
            {label || `${legs.length} open`}
          </span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ ...T.micro, color: B.gold, fontWeight: 800, fontFeatureSettings: "'tnum'" }}>
            {fmtVol(total)}
          </span>
          {!forceOpen && (
            <ChevronDown
              size={14}
              style={{
                color: B.textMuted,
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.18s ease',
              }}
            />
          )}
        </span>
      </button>
      {open && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '0.4rem',
          padding: '0 0.55rem 0.55rem',
        }}>
          {legs.map((leg, i) => (
            <LegCard key={`${sport}-${leg.gameKey}-${leg.marketType}-${leg.side}-${i}`} leg={leg} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Polymarket avgPrice (0–1) → American odds string, e.g. -108 / +150. */
function fmtProbOdds(prob) {
  if (prob == null || !(prob > 0) || !(prob < 1)) return null;
  const am = prob >= 0.5
    ? Math.round(-100 * prob / (1 - prob))
    : Math.round(100 * (1 - prob) / prob);
  return am > 0 ? `+${am}` : `${am}`;
}

function fmtEntryLine(leg) {
  const line = leg.entryLine;
  if (line == null || Number.isNaN(Number(line))) return null;
  const n = Number(line);
  const mkt = String(leg.marketType || '').toUpperCase();
  if (mkt === 'SPREAD') return n > 0 ? `+${n}` : `${n}`;
  if (mkt === 'TOTAL') return `${n}`;
  return null;
}

function LegCard({ leg, highlight }) {
  const sc = SPORT_COLORS[leg.sport] || B.gold;
  const lineStr = fmtEntryLine(leg);
  const oddsStr = fmtProbOdds(leg.avgPrice);
  const pickLabel = [leg.teamName || leg.side, lineStr].filter(Boolean).join(' ');
  return (
    <div
      style={{
        padding: '0.65rem 0.75rem', borderRadius: '10px',
        background: highlight ? 'rgba(212,175,55,0.08)' : B.card,
        border: highlight ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
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
        {leg.marketType} · <span style={{ color: B.gold }}>{pickLabel}</span>
        {oddsStr && (
          <span style={{ color: B.text, fontFeatureSettings: "'tnum'", fontWeight: 700 }}>
            {' '}· {oddsStr}
          </span>
        )}
        {leg.betMultiplier >= 1.5 && (
          <span style={{ color: B.gold }}> · {leg.betMultiplier.toFixed(1)}×</span>
        )}
        {leg.vault_isHcWallet && (
          <span style={{ color: B.gold, fontWeight: 800 }}> · Heavy</span>
        )}
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

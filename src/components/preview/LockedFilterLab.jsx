/**
 * Locked filter bar sandbox. The real bar, with a fixture slate.
 * Open at #/locked-filter-lab.
 */
import { useMemo, useState } from 'react';
import LockedFilterBar from '../sharpFlow/LockedFilterBar';
import { defaultLockedFilter, describeLockedSlate } from '../../lib/lockedFilter.js';

const NOW = Date.now();
const FUTURE = NOW + 4 * 60 * 60 * 1000;
const PAST = NOW - 2 * 60 * 60 * 1000;

function row(i, sport, extra = {}) {
  const commenceMs = extra.commenceMs ?? FUTURE;
  return {
    key: `${extra.slateDay || 'today'}-${sport}-${i}`,
    team: extra.team || `${sport} side ${i}`,
    sport,
    marketType: extra.marketType || 'ml',
    units: extra.units ?? 1,
    odds: extra.odds ?? -110,
    stars: extra.stars ?? 3,
    isMonitoring: !!extra.isMonitoring,
    health: { status: extra.health || 'ACTIVE' },
    outcome: extra.outcome ?? null,
    status: extra.status || 'PENDING',
    commenceMs,
    gameTime: new Date(commenceMs).toISOString(),
    profit: extra.profit ?? 0,
    slateDay: extra.slateDay || 'today',
  };
}

function buildToday() {
  const rows = [];
  let n = 0;
  const add = (sport, count, extra) => {
    for (let i = 0; i < count; i += 1) rows.push(row(++n, sport, extra));
  };
  add('CFB', 6, { marketType: 'spread', units: 2.5 });
  add('CFB', 2, { marketType: 'ml', units: 1.5 });
  add('NBA', 4, { units: 2 });
  add('NHL', 3, { units: 1 });
  add('NFL', 2, { units: 3 });
  add('MLB', 1, { units: 1 });
  add('CBB', 3, { health: 'MUTED', units: 1 });
  add('NBA', 2, { commenceMs: PAST, units: 2, team: 'Live NBA' });
  add('NHL', 1, { outcome: 'WIN', status: 'COMPLETED', profit: 1.8, commenceMs: PAST, units: 2, team: 'Won NHL' });
  add('NFL', 1, { outcome: 'LOSS', status: 'COMPLETED', profit: -1.1, commenceMs: PAST, units: 1, team: 'Lost NFL' });
  add('CFB', 2, { isMonitoring: true, units: 0, team: 'No Play CFB' });
  add('NBA', 1, { health: 'CANCELLED', units: 1, team: 'Cancelled NBA' });
  return rows;
}

function buildYesterday() {
  return [
    row(1, 'NHL', { slateDay: 'yesterday', outcome: 'WIN', status: 'COMPLETED', profit: 2.2, commenceMs: PAST, units: 2, team: 'Yesterday win' }),
    row(2, 'NBA', { slateDay: 'yesterday', outcome: 'LOSS', status: 'COMPLETED', profit: -1, commenceMs: PAST, units: 1, team: 'Yesterday loss' }),
    row(3, 'CFB', { slateDay: 'yesterday', outcome: 'WIN', status: 'COMPLETED', profit: 3.4, commenceMs: PAST, units: 2.5, team: 'Yesterday CFB' }),
  ];
}

export default function LockedFilterLab() {
  const picksByDay = useMemo(() => ({ today: buildToday(), yesterday: buildYesterday() }), []);
  const [filter, setFilter] = useState(defaultLockedFilter);
  const dayPicks = picksByDay[filter.day] || [];
  const view = describeLockedSlate(dayPicks, filter);
  return (
    <div style={{ minHeight: '100vh', background: '#0B0F1F', color: '#F4F7FB', fontFamily: "Inter, system-ui, sans-serif" }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000, height: 56,
        display: 'flex', alignItems: 'center', padding: '0 16px',
        background: 'rgba(17, 24, 39, 0.98)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontWeight: 700, letterSpacing: '0.04em',
      }}
      >
        Sharp Flow
      </nav>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem 1rem 6rem' }}>
        <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: 800 }}>
          {`Locked Picks — ${filter.day === 'today' ? 'Today' : 'Yesterday'}`}
        </h2>
        <p style={{ margin: '0 0 0.7rem', color: '#647089', fontSize: 12 }}>
          Plays that crossed the conviction threshold.
        </p>
        <LockedFilterBar
          picksByDay={picksByDay}
          filter={filter}
          view={view}
          onChange={setFilter}
        />
        {view.feed.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#647089', padding: '2rem' }}>No plays in this view</div>
        ) : view.feed.map((p) => (
          <article
            key={p.key}
            data-testid="lab-card"
            style={{
              marginBottom: 10,
              padding: '14px 16px',
              borderRadius: 14,
              background: '#151923',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              opacity: p.isMonitoring ? 0.7 : 1,
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{p.team}</div>
              <div style={{ color: '#9AA6BD', fontSize: 12, marginTop: 2 }}>{p.sport} · {p.marketType}</div>
            </div>
            <div style={{ fontVariantNumeric: 'tabular-nums', color: '#E8D28A', fontWeight: 700 }}>
              {p.isMonitoring ? '0u' : `${Number(p.units).toFixed(1)}u`}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

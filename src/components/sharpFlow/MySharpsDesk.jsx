/**
 * My Sharps — portfolio book, then the blotter.
 * Hero is always the list. Positions are open / upcoming / closed.
 */
import React, { useMemo, useState } from 'react';
import { buildDeskLedger, buildDeskReport } from '../../lib/mySharpsDesk.js';

const B = {
  gold: '#D4AF37',
  goldSoft: '#E8D28A',
  goldDim: 'rgba(212, 175, 55, 0.10)',
  goldLine: 'rgba(212, 175, 55, 0.28)',
  green: '#10B981',
  greenDim: 'rgba(16, 185, 129, 0.10)',
  red: '#EF4444',
  redDim: 'rgba(239, 68, 68, 0.10)',
  panel: '#151923',
  panelHover: '#1A1F2E',
  line: '#252B3B',
  hair: 'rgba(255,255,255,0.06)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textFaint: '#475569',
};

const T = {
  display: {
    fontSize: '3rem',
    fontWeight: 800,
    lineHeight: 0.92,
    letterSpacing: '-0.055em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  metric: {
    fontSize: '1.28rem',
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: 650,
    letterSpacing: '-0.02em',
  },
  label: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: B.textMuted,
  },
  body: { fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.4 },
  meta: { fontSize: '0.74rem', fontWeight: 500, lineHeight: 1.35 },
};

function fmtVol(v, { signed = true } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = !signed ? '' : (n < 0 ? '−' : (n > 0 ? '+' : ''));
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function pnlColor(n, fallback = B.textMuted) {
  if (!Number.isFinite(n) || n === 0) return fallback;
  return n > 0 ? B.green : B.red;
}

function LockedState({ signedIn }) {
  return (
    <div style={{ padding: '3.2rem 0 2.6rem' }}>
      <div style={{ ...T.display, fontSize: '1.55rem', color: B.text, marginBottom: 10 }}>
        {signedIn ? 'Star the wallets you trust.' : 'Sign in to keep a desk.'}
      </div>
      <div style={{ ...T.body, color: B.textMuted }}>
        {signedIn ? 'Then this page is the report on their book.' : 'Then star wallets on All Sharps.'}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '3.2rem 0 2.6rem' }}>
      <div style={{ ...T.display, fontSize: '1.55rem', color: B.text, marginBottom: 10 }}>Nobody on the desk</div>
      <div style={{ ...T.body, color: B.textMuted }}>Switch to All Sharps and star a wallet.</div>
    </div>
  );
}

function Panel({ children, pad = '1.2rem 1.25rem 1.15rem' }) {
  return (
    <div style={{
      background: B.panel,
      border: `1px solid ${B.line}`,
      borderRadius: 16,
      padding: pad,
    }}
    >
      {children}
    </div>
  );
}

function Kpi({ label, value, tone, sub }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={T.label}>{label}</div>
      <div style={{ ...T.metric, color: tone || B.text, marginTop: 8 }}>{value}</div>
      {sub ? (
        <div style={{ ...T.meta, color: B.textMuted, marginTop: 6, fontFeatureSettings: "'tnum'" }}>{sub}</div>
      ) : null}
    </div>
  );
}

function Allocation({ sports }) {
  const parts = (sports || []).filter((s) => s.openInvested > 0);
  const total = parts.reduce((s, x) => s + x.openInvested, 0);
  if (!parts.length || !(total > 0)) return null;
  return (
    <div style={{ display: 'flex', height: 5, borderRadius: 99, overflow: 'hidden', background: B.hair, margin: '0 0 18px' }}>
      {parts.map((s, i) => (
        <div
          key={s.sport}
          title={`${s.sport} ${fmtVol(s.openInvested, { signed: false })}`}
          style={{
            width: `${Math.max(3, (s.openInvested / total) * 100)}%`,
            background: B.gold,
            opacity: 1 - (i * 0.22),
          }}
        />
      ))}
    </div>
  );
}

function SportRow({ s }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 12,
      padding: '0.78rem 0',
      borderBottom: `1px solid ${B.hair}`,
      alignItems: 'baseline',
    }}
    >
      <div>
        <div style={{ ...T.name, color: B.text }}>{s.sport}</div>
        <div style={{ ...T.meta, color: B.textMuted, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
          {s.honest?.text && s.honest.text !== '—' ? s.honest.text : '—'}
          {s.openN ? `  ·  ${s.openN} open` : ''}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T.name, color: pnlColor(s.l30Pnl), fontFeatureSettings: "'tnum'" }}>
          {fmtVol(s.l30Pnl)}
        </div>
        {s.openInvested ? (
          <div style={{ ...T.meta, color: B.goldSoft, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
            {fmtVol(s.openInvested, { signed: false })} in
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PositionRow({ item, mode, isMobile }) {
  const [hot, setHot] = useState(false);
  const result = mode === 'closed'
    ? (item.won ? 'W' : 'L')
    : (item.live ? 'Live' : item.when);
  const resultTone = mode === 'closed'
    ? (item.won ? B.green : B.red)
    : (item.live ? B.gold : B.textMuted);
  const money = mode === 'closed'
    ? (Number.isFinite(item.pnl) ? fmtVol(item.pnl) : '—')
    : fmtVol(item.invested, { signed: false });
  const moneyTone = mode === 'closed' ? pnlColor(item.pnl, B.textMuted) : B.goldSoft;
  const who = mode === 'closed'
    ? item.tag
    : (item.walletN > 1 ? `${item.walletN} on the list` : (item.tags?.[0] || ''));

  return (
    <div
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : 'minmax(0, 1.4fr) minmax(0, 1fr) auto auto',
        gap: isMobile ? 12 : '12px 20px',
        alignItems: 'center',
        padding: isMobile ? '0.85rem 0.15rem' : '0.92rem 0.35rem',
        borderBottom: `1px solid ${B.hair}`,
        background: hot ? B.panelHover : 'transparent',
        margin: '0 -0.35rem',
        borderRadius: 8,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ ...T.name, color: B.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.pick}
        </div>
        <div style={{ ...T.meta, color: B.textMuted, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {[item.matchup, item.sport, item.market].filter(Boolean).join('  ·  ')}
        </div>
      </div>
      {!isMobile ? (
        <div style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'" }}>
          {who}
          {item.american ? `  ·  ${item.american}` : ''}
        </div>
      ) : null}
      <div style={{
        ...T.name,
        color: moneyTone,
        fontFeatureSettings: "'tnum'",
        textAlign: 'right',
        justifySelf: 'end',
      }}
      >
        {money}
      </div>
      <div style={{ justifySelf: 'end' }}>
        <span style={{
          ...T.meta,
          fontWeight: 700,
          letterSpacing: mode === 'closed' ? '0.04em' : 0,
          color: resultTone,
          background: mode === 'closed'
            ? (item.won ? B.greenDim : B.redDim)
            : (item.live ? B.goldDim : 'transparent'),
          border: item.live || mode === 'closed' ? `1px solid ${item.live ? B.goldLine : (item.won ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.28)')}` : '1px solid transparent',
          padding: '0.18rem 0.45rem',
          borderRadius: 6,
          fontFeatureSettings: "'tnum'",
        }}
        >
          {result}
        </span>
      </div>
    </div>
  );
}

function Ledger({ ledger, isMobile }) {
  const fallback = ledger.openN ? 'open' : ledger.upcomingN ? 'upcoming' : 'closed';
  const [tab, setTab] = useState(null);
  const active = tab || fallback;
  const groups = ledger.groups?.[active] || [];
  const empty = {
    open: 'Nothing live.',
    upcoming: 'Nothing later on the book.',
    closed: 'No graded tickets yet.',
  };

  const tabs = [
    { id: 'open', label: 'Open', n: ledger.openN, extra: ledger.openN ? fmtVol(ledger.openInvested, { signed: false }) : null },
    { id: 'upcoming', label: 'Upcoming', n: ledger.upcomingN, extra: ledger.upcomingN ? fmtVol(ledger.upcomingInvested, { signed: false }) : null },
    { id: 'closed', label: 'Closed', n: ledger.closedN, extra: ledger.closedHonest?.text && ledger.closedHonest.text !== '—' ? ledger.closedHonest.text : null },
  ];

  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={T.label}>Positions</div>
        {active === 'closed' && Number.isFinite(ledger.closedPnl) ? (
          <div style={{ ...T.meta, color: pnlColor(ledger.closedPnl), fontFeatureSettings: "'tnum'" }}>
            {fmtVol(ledger.closedPnl)} on this tape
          </div>
        ) : null}
      </div>

      <Panel pad="0.85rem 1.1rem 0.55rem">
        <div
          role="tablist"
          aria-label="Position status"
          style={{
            display: 'flex',
            gap: 4,
            padding: 3,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${B.line}`,
            marginBottom: 6,
          }}
        >
          {tabs.map((t) => {
            const on = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '0.48rem 0.4rem',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: on ? B.goldDim : 'transparent',
                  color: on ? B.goldSoft : B.textMuted,
                  boxShadow: on ? `inset 0 0 0 1px ${B.goldLine}` : 'none',
                }}
              >
                <div style={{ ...T.meta, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {t.label}
                  <span style={{ fontFeatureSettings: "'tnum'", marginLeft: 6, fontWeight: 650 }}>{t.n || 0}</span>
                </div>
                {!isMobile && t.extra ? (
                  <div style={{ ...T.meta, color: on ? B.goldSoft : B.textFaint, marginTop: 2, fontFeatureSettings: "'tnum'" }}>
                    {t.extra}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        {groups.length ? groups.map((g) => (
          <div key={`${active}:${g.dateKey}`} style={{ paddingTop: 8 }}>
            {g.label ? (
              <div style={{ ...T.label, color: B.textFaint, padding: '0.7rem 0.15rem 0.15rem' }}>{g.label}</div>
            ) : null}
            {g.items.map((item) => (
              <PositionRow key={item.id} item={item} mode={active} isMobile={isMobile} />
            ))}
          </div>
        )) : (
          <div style={{ ...T.body, color: B.textFaint, padding: '1.4rem 0.2rem 1.2rem' }}>{empty[active]}</div>
        )}
      </Panel>
    </div>
  );
}

export default function MySharpsDesk({
  ready = false,
  signedIn = false,
  roster = [],
  walletProfiles = null,
  shorts = [],
  actionRows = [],
  weekRows = [],
  recentLegs = [],
  dateKey = null,
  todayKey = null,
  isMobile = false,
}) {
  const report = useMemo(
    () => buildDeskReport({
      roster,
      walletProfiles,
      shorts,
      actionRows,
      weekRows,
      recentLegs,
      dateKey,
      todayKey,
    }),
    [roster, walletProfiles, shorts, actionRows, weekRows, recentLegs, dateKey, todayKey],
  );

  const ledger = useMemo(
    () => buildDeskLedger({
      actionRows: weekRows?.length ? weekRows : actionRows,
      recentLegs,
      todayKey,
    }),
    [weekRows, actionRows, recentLegs, todayKey],
  );

  if (!ready) return <LockedState signedIn={signedIn} />;
  if (!roster.length) return <EmptyState />;

  const pnl = report.l30?.pnl;
  const heroTone = Number.isFinite(pnl) ? (pnl > 0 ? B.green : pnl < 0 ? B.red : B.text) : B.text;
  const rec = report.l30?.honest;
  const weekSub = [
    report.weekHonest?.text && report.weekHonest.text !== '—' ? report.weekHonest.text : null,
    Number.isFinite(report.weekPnl) ? fmtVol(report.weekPnl) : null,
  ].filter(Boolean).join('  ·  ') || 'No graded week yet';

  return (
    <div style={{ margin: '0.15rem 0 2.8rem' }}>
      <div style={{ ...T.label, color: B.textFaint, marginBottom: 14 }}>
        Portfolio
        <span style={{ letterSpacing: 0, textTransform: 'none', fontWeight: 500, marginLeft: 10 }}>
          {report.walletN} {report.walletN === 1 ? 'sharp' : 'sharps'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ ...T.display, color: heroTone, fontSize: isMobile ? '2.35rem' : '3.05rem' }}>
          {Number.isFinite(pnl) ? fmtVol(pnl) : '—'}
        </span>
        {rec?.record ? (
          <span style={{ ...T.body, color: B.textSec, fontFeatureSettings: "'tnum'", fontSize: '1.02rem' }}>
            {rec.record}
            {rec.showPct ? <span style={{ color: B.textMuted }}>  ·  {rec.wr}%</span> : null}
          </span>
        ) : null}
      </div>
      <div style={{ ...T.meta, color: B.textFaint, marginTop: 8, marginBottom: 22 }}>Last 30 days across the list</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))',
        gap: isMobile ? '18px 16px' : 0,
        padding: isMobile ? '0 0 8px' : '18px 0',
        borderTop: `1px solid ${B.line}`,
        borderBottom: `1px solid ${B.line}`,
        marginBottom: 22,
      }}
      >
        <div style={!isMobile ? { paddingRight: 22 } : null}>
          <Kpi
            label={report.dayLabel}
            value={report.todayN || 0}
            tone={report.todayN ? B.text : B.textFaint}
            sub={report.todayN ? `${fmtVol(report.todayInvested, { signed: false })} on the slate` : 'No tickets this day'}
          />
        </div>
        <div style={!isMobile ? { padding: '0 22px', borderLeft: `1px solid ${B.hair}` } : null}>
          <Kpi
            label="This week"
            value={report.weekGradedN || report.weekN || 0}
            sub={weekSub}
          />
        </div>
        <div style={!isMobile ? { padding: '0 22px', borderLeft: `1px solid ${B.hair}` } : null}>
          <Kpi
            label="Open"
            value={ledger.openN ? fmtVol(ledger.openInvested, { signed: false }) : 'Quiet'}
            tone={ledger.openN ? B.goldSoft : B.textFaint}
            sub={ledger.openN
              ? `${ledger.openN} ${ledger.openN === 1 ? 'position' : 'positions'}`
              : 'Nothing live'}
          />
        </div>
        <div style={!isMobile ? { paddingLeft: 22, borderLeft: `1px solid ${B.hair}` } : null}>
          <Kpi
            label="Best sport"
            value={report.bestSport?.sport || '—'}
            sub={report.bestSport ? `${fmtVol(report.bestSport.l30Pnl)} L30` : 'Need a book'}
          />
        </div>
      </div>

      <Panel>
        <div style={{ ...T.label, marginBottom: 12 }}>Book</div>
        <Allocation sports={report.sports} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr',
          gap: isMobile ? 8 : 28,
        }}
        >
          <div>
            {report.sports.length ? report.sports.map((s) => (
              <SportRow key={s.sport} s={s} />
            )) : (
              <div style={{ ...T.body, color: B.textFaint, padding: '0.5rem 0' }}>No sport book yet.</div>
            )}
          </div>
          <div>
            {report.markets.length ? report.markets.map((m) => (
              <div
                key={m.market}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '0.78rem 0',
                  borderBottom: `1px solid ${B.hair}`,
                  alignItems: 'baseline',
                }}
              >
                <div>
                  <div style={{ ...T.name, color: B.text }}>{m.label}</div>
                  <div style={{ ...T.meta, color: B.textMuted, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
                    {m.honest?.text || '—'}
                  </div>
                </div>
                <div style={{ ...T.name, color: pnlColor(m.pnl), fontFeatureSettings: "'tnum'" }}>
                  {m.pnl ? fmtVol(m.pnl) : '—'}
                </div>
              </div>
            )) : (
              <div style={{ ...T.body, color: B.textFaint, padding: '0.5rem 0' }}>No market book yet.</div>
            )}
          </div>
        </div>
      </Panel>

      <Ledger ledger={ledger} isMobile={isMobile} />
    </div>
  );
}

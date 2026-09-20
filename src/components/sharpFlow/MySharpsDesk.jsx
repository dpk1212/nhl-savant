/**
 * My Sharps portfolio report — the book of every starred sharp.
 * Today, week, P/L, open money, sports, markets. Tickets and tail come later.
 */
import React, { useMemo } from 'react';
import { buildDeskReport } from '../../lib/mySharpsDesk.js';

const B = {
  gold: '#D4AF37',
  goldSoft: '#E8D28A',
  green: '#10B981',
  red: '#EF4444',
  panel: '#151923',
  line: '#252B3B',
  hair: 'rgba(255,255,255,0.06)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textFaint: '#475569',
};

const T = {
  display: {
    fontSize: '2.55rem',
    fontWeight: 700,
    lineHeight: 0.95,
    letterSpacing: '-0.05em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  metric: {
    fontSize: '1.55rem',
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
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: B.textMuted,
  },
  body: { fontSize: '0.84rem', fontWeight: 500, lineHeight: 1.4 },
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

function LockedState({ signedIn }) {
  return (
    <div style={{ padding: '3rem 0 2.4rem' }}>
      <div style={{ ...T.display, fontSize: '1.4rem', color: B.text, marginBottom: 10 }}>
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
    <div style={{ padding: '3rem 0 2.4rem' }}>
      <div style={{ ...T.display, fontSize: '1.4rem', color: B.text, marginBottom: 10 }}>Nobody on the desk</div>
      <div style={{ ...T.body, color: B.textMuted }}>Switch to All Sharps and star a wallet.</div>
    </div>
  );
}

function Card({ label, value, tone, sub, wide }) {
  return (
    <div style={{
      background: B.panel,
      border: `1px solid ${B.line}`,
      borderRadius: 16,
      padding: '1.05rem 1.15rem 1.1rem',
      minWidth: 0,
      gridColumn: wide ? '1 / -1' : 'auto',
    }}>
      <div style={T.label}>{label}</div>
      <div style={{ ...T.metric, color: tone || B.text, marginTop: 10 }}>{value}</div>
      {sub ? (
        <div style={{ ...T.meta, color: B.textMuted, marginTop: 8, fontFeatureSettings: "'tnum'" }}>{sub}</div>
      ) : null}
    </div>
  );
}

function SportRow({ s, maxPnl }) {
  const span = Math.max(8, Math.round((Math.abs(s.l30Pnl) / (maxPnl || 1)) * 100));
  return (
    <div style={{ padding: '0.7rem 0', borderBottom: `1px solid ${B.hair}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <span style={{ ...T.name, color: B.text }}>{s.sport}</span>
        <span style={{
          ...T.name,
          color: s.l30Pnl > 0 ? B.green : s.l30Pnl < 0 ? B.red : B.textMuted,
          fontFeatureSettings: "'tnum'",
        }}
        >
          {fmtVol(s.l30Pnl)}
        </span>
      </div>
      <div style={{ height: 3, background: B.hair, margin: '8px 0 7px', display: 'flex' }}>
        <div style={{
          width: `${span}%`,
          background: s.l30Pnl < 0 ? B.red : B.gold,
          opacity: 0.7,
        }}
        />
      </div>
      <div style={{ ...T.meta, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
        {s.honest?.text && s.honest.text !== '—' ? s.honest.text : '—'}
        {s.openN ? `  ·  ${s.openN} open  ${fmtVol(s.openInvested, { signed: false })}` : ''}
      </div>
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

  if (!ready) return <LockedState signedIn={signedIn} />;
  if (!roster.length) return <EmptyState />;

  const pnl = report.l30?.pnl;
  const heroTone = Number.isFinite(pnl) ? (pnl > 0 ? B.green : pnl < 0 ? B.red : B.text) : B.text;
  const maxPnl = Math.max(1, ...report.sports.map((s) => Math.abs(s.l30Pnl) || 0));
  const weekSub = [
    report.weekHonest?.text && report.weekHonest.text !== '—' ? report.weekHonest.text : null,
    Number.isFinite(report.weekPnl) ? fmtVol(report.weekPnl) : null,
    report.weekOpenN ? `${report.weekOpenN} still open` : null,
  ].filter(Boolean).join('  ·  ') || 'No graded week yet';

  return (
    <div style={{ margin: '0.25rem 0 2.8rem' }}>
      <div style={{ ...T.label, marginBottom: 12 }}>
        Portfolio
        <span style={{ letterSpacing: 0, textTransform: 'none', fontWeight: 500, marginLeft: 10, color: B.textFaint }}>
          {report.walletN} {report.walletN === 1 ? 'sharp' : 'sharps'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 6 }}>
        <span style={{ ...T.display, color: heroTone, fontSize: isMobile ? '2.15rem' : '2.6rem' }}>
          {Number.isFinite(pnl) ? fmtVol(pnl) : '—'}
        </span>
        {report.l30?.honest?.text && report.l30.honest.text !== '—' ? (
          <span style={{ ...T.body, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
            {report.l30.honest.text}
          </span>
        ) : null}
      </div>
      <div style={{ ...T.meta, color: B.textFaint, marginBottom: 22 }}>L30 profit across the list</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))',
        gap: 10,
      }}>
        <Card
          label={report.dayLabel}
          value={report.todayN || 0}
          tone={report.todayN ? B.text : B.textFaint}
          sub={report.todayN
            ? `${fmtVol(report.todayInvested, { signed: false })} on the slate`
            : 'No tickets this day'}
        />
        <Card
          label="This week"
          value={report.weekGradedN || report.weekN || 0}
          sub={weekSub}
        />
        <Card
          label="Open"
          value={report.openN ? fmtVol(report.openInvested, { signed: false }) : 'Quiet'}
          tone={report.openN ? B.goldSoft : B.textFaint}
          sub={report.openN ? `${report.openN} positions` : 'Nothing live'}
        />
        <Card
          label="Best sport"
          value={report.bestSport?.sport || '—'}
          tone={B.text}
          sub={report.bestSport
            ? `${fmtVol(report.bestSport.l30Pnl)} L30`
            : 'Need a book'}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
        gap: 10,
        marginTop: 10,
      }}>
        <div style={{
          background: B.panel,
          border: `1px solid ${B.line}`,
          borderRadius: 16,
          padding: '1.05rem 1.15rem 0.85rem',
        }}>
          <div style={{ ...T.label, marginBottom: 8 }}>By sport</div>
          {report.sports.length ? report.sports.map((s) => (
            <SportRow key={s.sport} s={s} maxPnl={maxPnl} />
          )) : (
            <div style={{ ...T.body, color: B.textFaint, padding: '0.6rem 0' }}>No sport book yet.</div>
          )}
        </div>

        <div style={{
          background: B.panel,
          border: `1px solid ${B.line}`,
          borderRadius: 16,
          padding: '1.05rem 1.15rem 0.85rem',
        }}>
          <div style={{ ...T.label, marginBottom: 8 }}>Markets</div>
          {report.markets.length ? report.markets.map((m) => (
            <div
              key={m.market}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '0.75rem 0',
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
              <div style={{
                ...T.name,
                color: m.pnl > 0 ? B.green : m.pnl < 0 ? B.red : B.textMuted,
                fontFeatureSettings: "'tnum'",
              }}
              >
                {m.pnl ? fmtVol(m.pnl) : '—'}
              </div>
            </div>
          )) : (
            <div style={{ ...T.body, color: B.textFaint, padding: '0.6rem 0' }}>No market book yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

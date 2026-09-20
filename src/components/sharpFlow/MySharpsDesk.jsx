/**
 * My Sharps — collapsible control desk on Action.
 * Roster + aggregate / single tracking. Plays list stays on the parent.
 */
import React from 'react';
import { ChevronDown, Star, Trash2 } from 'lucide-react';
import { fmtWalletTag } from '../../lib/mySharps.js';

const B = {
  gold: '#D4AF37',
  goldDim: 'rgba(212, 175, 55, 0.12)',
  goldBorder: 'rgba(212, 175, 55, 0.32)',
  green: '#10B981',
  greenDim: 'rgba(16, 185, 129, 0.14)',
  red: '#EF4444',
  amber: '#F59E0B',
  card: '#141821',
  cardAlt: '#1A1F2E',
  border: 'rgba(37, 43, 59, 0.9)',
  borderSubtle: 'rgba(26, 32, 48, 0.75)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textSubtle: '#475569',
};

const T = {
  name: { fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' },
  money: { fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', fontFeatureSettings: "'tnum'" },
  body: { fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.35 },
  micro: { fontSize: '0.68rem', fontWeight: 600, lineHeight: 1.3 },
  tiny: {
    fontSize: '0.58rem', fontWeight: 700, lineHeight: 1.25,
    letterSpacing: '0.08em', textTransform: 'uppercase',
  },
};

function fmtVol(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function signedPnl(v) {
  if (!Number.isFinite(Number(v))) return '—';
  const n = Number(v);
  return `${n >= 0 ? '+' : '−'}${fmtVol(Math.abs(n)).replace('-', '')}`;
}

function Seg({ options, value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', padding: 3, borderRadius: 999,
      border: `1px solid ${B.goldBorder}`, background: 'rgba(8,10,16,0.55)',
    }}>
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              ...T.tiny,
              border: 'none',
              background: on ? B.goldDim : 'transparent',
              color: on ? B.gold : B.textMuted,
              padding: '0.38rem 0.85rem',
              borderRadius: 999,
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Metric({ id, label, value, sub, active, onClick, tone }) {
  const color = tone === 'up' ? B.green : tone === 'down' ? B.red : (active ? B.gold : B.text);
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '0.7rem 0.8rem',
        borderRadius: 10,
        border: `1px solid ${active ? B.goldBorder : B.border}`,
        background: active ? B.goldDim : B.cardAlt,
        cursor: 'pointer',
        minWidth: 0,
      }}
    >
      <div style={{ ...T.tiny, color: active ? B.gold : B.textSubtle, marginBottom: 6 }}>{label}</div>
      <div style={{ ...T.money, color, fontSize: '1.05rem' }}>{value}</div>
      {sub ? <div style={{ ...T.micro, color: B.textMuted, marginTop: 4 }}>{sub}</div> : null}
    </button>
  );
}

function LockedState({ signedIn }) {
  return (
    <div style={{
      textAlign: 'center', padding: '2rem 1.25rem', borderRadius: 12,
      border: `1px solid ${B.goldBorder}`, background: B.card,
    }}>
      <Star size={18} color={B.gold} style={{ marginBottom: 10 }} />
      <div style={{ ...T.name, color: B.text, marginBottom: 6 }}>My Sharps</div>
      <div style={{ ...T.body, color: B.textSec, maxWidth: 360, margin: '0 auto' }}>
        {signedIn
          ? 'Premium keeps the wallets you star — your desk, across days.'
          : 'Sign in to star wallets from Action and build your own sharp list.'}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '1.75rem 1.2rem', borderRadius: 12,
      border: `1px solid ${B.border}`, background: B.card,
    }}>
      <div style={{ ...T.name, color: B.text, marginBottom: 6 }}>Nobody on your desk yet</div>
      <div style={{ ...T.body, color: B.textSec }}>
        Switch to All Sharps and star a wallet. They stay here — not just today’s slate.
      </div>
    </div>
  );
}

export default function MySharpsDesk({
  ready = false,
  signedIn = false,
  collapsed = false,
  onToggleCollapse,
  scope = 'agg',
  onScope,
  focusShort = null,
  onFocus,
  section = 'action',
  onSection,
  roster = [],
  dash = null,
  onRemove,
  cap = 40,
  isMobile = false,
}) {
  if (!ready) return <LockedState signedIn={signedIn} />;
  if (!roster.length) return <EmptyState />;

  const d = dash || {};
  const l30tone = Number.isFinite(d.l30?.pnl)
    ? (d.l30.pnl >= 0 ? 'up' : 'down')
    : null;

  return (
    <div style={{
      marginBottom: '0.9rem',
      borderRadius: 14,
      border: `1px solid ${B.goldBorder}`,
      background: `linear-gradient(180deg, ${B.cardAlt} 0%, ${B.card} 100%)`,
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={onToggleCollapse}
        style={{
          display: 'flex', width: '100%', alignItems: 'center', gap: 12,
          padding: '0.85rem 1rem', border: 'none', background: 'transparent',
          cursor: 'pointer', color: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ width: 3, height: 16, borderRadius: 2, background: B.gold, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ ...T.tiny, color: B.gold }}>Sharps control</span>
            <span style={{
              ...T.micro, color: B.gold, background: B.goldDim, borderRadius: 4,
              padding: '0.08rem 0.38rem', fontWeight: 800,
            }}>
              {d.walletN}/{cap}
            </span>
          </div>
          {collapsed ? (
            <div style={{ ...T.micro, color: B.textMuted, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
              {d.actionN} on the board · {fmtVol(d.actionInvested)}
              {d.l30 ? ` · L30 ${signedPnl(d.l30.pnl)}` : ''}
            </div>
          ) : (
            <div style={{ ...T.micro, color: B.textMuted, marginTop: 4 }}>
              {scope === 'single' && focusShort
                ? `Tracking ${fmtWalletTag(focusShort)}`
                : 'Aggregate desk · every wallet you saved'}
            </div>
          )}
        </div>
        <ChevronDown
          size={16}
          color={B.gold}
          style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 180ms ease' }}
        />
      </button>

      {!collapsed && (
        <div style={{ padding: '0 1rem 1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <Seg
              value={scope}
              onChange={onScope}
              options={[
                { id: 'agg', label: 'Aggregate' },
                { id: 'single', label: 'Single sharp' },
              ]}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))',
            gap: 8,
            marginBottom: 14,
          }}>
            <Metric
              id="action"
              label="Action today"
              value={d.actionN || 0}
              sub={`${fmtVol(d.actionInvested)} · ${d.unopposedN || 0} unopposed`}
              active={section === 'action'}
              onClick={() => onSection('action')}
            />
            <Metric
              id="recent"
              label="Recent results"
              value={d.recentN ? `${d.recentW}–${d.recentL}` : '—'}
              sub={d.recentN ? `${d.recentN} graded legs` : 'No recent book'}
              active={section === 'recent'}
              onClick={() => onSection('recent')}
              tone={d.recentW > d.recentL ? 'up' : (d.recentL > d.recentW ? 'down' : null)}
            />
            <Metric
              id="sized"
              label="Sized up"
              value={d.sizedUpN || 0}
              sub={`${fmtVol(d.sizedUpInvested)} · 1.5×+`}
              active={section === 'sized'}
              onClick={() => onSection('sized')}
            />
            <Metric
              id="l30"
              label="L30 results"
              value={d.l30 ? signedPnl(d.l30.pnl) : '—'}
              sub={d.l30
                ? `${d.l30.wins ?? '—'}–${d.l30.losses ?? '—'} · ${d.l30.wr != null ? `${d.l30.wr}%` : '—'}`
                : 'Waiting on a window'}
              active={section === 'l30'}
              onClick={() => onSection('l30')}
              tone={l30tone}
            />
          </div>

          <div style={{ ...T.tiny, color: B.textSubtle, marginBottom: 8 }}>Your sharps</div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            maxHeight: isMobile ? 280 : 340, overflow: 'auto',
          }}>
            {roster.map((r) => {
              const on = scope === 'single' && focusShort === r.walletShort;
              return (
                <div
                  key={r.walletShort}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr auto' : '7.5rem 1fr auto auto',
                    gap: 10,
                    alignItems: 'center',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 10,
                    border: `1px solid ${on ? B.goldBorder : B.border}`,
                    background: on ? B.goldDim : 'rgba(8,10,16,0.35)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onScope('single');
                      onFocus(r.walletShort === focusShort ? null : r.walletShort);
                    }}
                    style={{
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      textAlign: 'left', padding: 0, color: 'inherit',
                    }}
                  >
                    <div style={{ ...T.body, fontWeight: 800, color: on ? B.gold : B.text, fontFeatureSettings: "'tnum'" }}>
                      {r.tag}
                    </div>
                    <div style={{ ...T.micro, color: B.textMuted }}>
                      {r.sports.length ? r.sports.join(' · ') : '—'}
                    </div>
                  </button>
                  {!isMobile && (
                    <div style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                      {r.openN ? `${r.openN} live · ${fmtVol(r.openInvested)}` : 'Quiet today'}
                      {r.l30 ? ` · L30 ${signedPnl(r.l30.pnl)}` : ''}
                    </div>
                  )}
                  <div style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'", textAlign: 'right' }}>
                    {r.l30?.wr != null ? `${r.l30.wr}%` : '—'}
                  </div>
                  <button
                    type="button"
                    title="Remove from My Sharps"
                    onClick={() => onRemove(r.walletShort)}
                    style={{
                      border: `1px solid ${B.border}`, background: 'transparent',
                      color: B.textMuted, borderRadius: 7, padding: '0.28rem 0.38rem',
                      cursor: 'pointer', display: 'grid', placeItems: 'center',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {section === 'recent' && d.recentLegs?.length ? (
            <div style={{ marginTop: 14 }}>
              <div style={{ ...T.tiny, color: B.textSubtle, marginBottom: 8 }}>Recent book</div>
              {d.recentLegs.slice(0, 10).map((leg, i) => (
                <div
                  key={`${leg.walletShort}-${leg.date}-${i}`}
                  style={{
                    display: 'flex', justifyContent: 'space-between', gap: 8,
                    padding: '0.38rem 0', borderBottom: `1px solid ${B.borderSubtle}`,
                    ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'",
                  }}
                >
                  <span>
                    <span style={{ color: B.textSubtle }}>{fmtWalletTag(leg.walletShort)}</span>
                    {' · '}
                    {leg.sport || ''} {leg.side || ''} {Number.isFinite(Number(leg.line)) ? leg.line : ''}
                  </span>
                  <span style={{ color: leg.won === 1 ? B.green : B.red, fontWeight: 800 }}>
                    {leg.won === 1 ? 'W' : 'L'}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <div style={{ ...T.micro, color: B.textSubtle, marginTop: 14 }}>
            Plays below are your sharps, largest relative size first.
          </div>
        </div>
      )}
    </div>
  );
}

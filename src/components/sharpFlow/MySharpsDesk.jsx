/**
 * My Sharps — who to tail.
 * Heat, sport×market book, Tail / Sit / Watch. Plays stay on the parent.
 */
import React from 'react';
import { ChevronDown, Star, Trash2 } from 'lucide-react';
import { fmtWalletTag } from '../../lib/mySharps.js';
import { rosterMatchesSection } from '../../lib/mySharpsDesk.js';

const B = {
  gold: '#D4AF37',
  goldDim: 'rgba(212, 175, 55, 0.12)',
  goldBorder: 'rgba(212, 175, 55, 0.32)',
  green: '#10B981',
  greenDim: 'rgba(16, 185, 129, 0.14)',
  red: '#EF4444',
  redDim: 'rgba(239, 68, 68, 0.12)',
  amber: '#F59E0B',
  amberDim: 'rgba(245, 158, 11, 0.12)',
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

const LEAN_TONE = {
  tail: { fg: B.green, bg: B.greenDim, bd: 'rgba(16, 185, 129, 0.35)' },
  sit: { fg: B.red, bg: B.redDim, bd: 'rgba(239, 68, 68, 0.35)' },
  watch: { fg: B.amber, bg: B.amberDim, bd: 'rgba(245, 158, 11, 0.32)' },
};

const HEAT_TONE = {
  hot: { fg: B.green, bg: B.greenDim },
  cold: { fg: B.red, bg: B.redDim },
  even: { fg: B.textSec, bg: 'rgba(148, 163, 184, 0.10)' },
  quiet: { fg: B.textMuted, bg: 'rgba(100, 116, 139, 0.10)' },
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

function Chip({ tone, children }) {
  return (
    <span style={{
      ...T.tiny,
      color: tone.fg,
      background: tone.bg,
      border: tone.bd ? `1px solid ${tone.bd}` : 'none',
      borderRadius: 4,
      padding: '0.14rem 0.38rem',
      letterSpacing: '0.1em',
    }}>
      {children}
    </span>
  );
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

function Metric({ label, value, sub, active, onClick, tone }) {
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
      <div style={{ ...T.body, color: B.textSec, maxWidth: 380, margin: '0 auto' }}>
        {signedIn
          ? 'Premium keeps the wallets you star — their book, heat, and whether to tail.'
          : 'Sign in to star wallets from Action and track who to tail.'}
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
        Switch to All Sharps and star a wallet. You will see their book, heat, and a tail or sit lean.
      </div>
    </div>
  );
}

function formLine(r) {
  const bits = [];
  const l5 = r.form?.actionL5 || r.form?.l5;
  const l10 = r.form?.actionL10 || r.form?.l10;
  if (l5 && Number(l5.w) + Number(l5.l) > 0) bits.push(`L5 ${l5.w}–${l5.l}`);
  if (l10 && Number(l10.w) + Number(l10.l) > 0) bits.push(`L10 ${l10.w}–${l10.l}`);
  if (r.clv?.priorClvPct != null) bits.push(`Beat close ${r.clv.priorClvPct}%`);
  if (r.l30Honest?.text && r.l30Honest.text !== '—') bits.push(`L30 ${r.l30Honest.text}`);
  return bits.join(' · ') || 'No recent book';
}

function SkillCard({ r, on, isMobile, onSelect, onRemove }) {
  const leanTone = LEAN_TONE[r.lean?.key] || LEAN_TONE.watch;
  const heatTone = HEAT_TONE[r.heat?.key] || HEAT_TONE.quiet;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto',
        gap: 10,
        alignItems: 'start',
        padding: '0.75rem 0.8rem',
        borderRadius: 10,
        border: `1px solid ${on ? B.goldBorder : B.border}`,
        background: on ? B.goldDim : 'rgba(8,10,16,0.35)',
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          textAlign: 'left', padding: 0, color: 'inherit', minWidth: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          <Chip tone={leanTone}>{r.lean?.label || 'Watch'}</Chip>
          <Chip tone={heatTone}>{r.heat?.label || 'Quiet'}</Chip>
          <span style={{
            ...T.body, fontWeight: 800, color: on ? B.gold : B.text,
            fontFeatureSettings: "'tnum'",
          }}>
            {r.tag}
          </span>
          <span style={{ ...T.micro, color: B.textMuted }}>
            {r.sports.length ? r.sports.join(' · ') : '—'}
          </span>
        </div>
        {r.books?.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            {r.books.map((b) => (
              <span
                key={`${b.sport}-${b.market}`}
                style={{
                  ...T.micro,
                  color: B.textSec,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${B.borderSubtle}`,
                  borderRadius: 4,
                  padding: '0.12rem 0.38rem',
                  fontFeatureSettings: "'tnum'",
                }}
              >
                {r.sports.length > 1 ? `${b.sport} ` : ''}{b.label} {b.honest?.text || `${b.wins}–${b.losses}`}
              </span>
            ))}
          </div>
        ) : (
          r.bookHonest?.text && r.bookHonest.text !== '—' ? (
            <div style={{ ...T.micro, color: B.textSec, marginBottom: 6, fontFeatureSettings: "'tnum'" }}>
              Book {r.bookHonest.text}
              {r.book?.roi != null && r.bookHonest.showPct ? ` · ${r.book.roi >= 0 ? '+' : ''}${r.book.roi}% ROI` : ''}
            </div>
          ) : null
        )}
        <div style={{ ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
          {formLine(r)}
        </div>
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
          {r.openN ? `${r.openN} live · ${fmtVol(r.openInvested)}` : 'Quiet today'}
          {r.lean?.reason ? ` · ${r.lean.reason}` : ''}
        </div>
      </button>
      <button
        type="button"
        title="Remove from My Sharps"
        onClick={onRemove}
        style={{
          border: `1px solid ${B.border}`, background: 'transparent',
          color: B.textMuted, borderRadius: 7, padding: '0.28rem 0.38rem',
          cursor: 'pointer', display: 'grid', placeItems: 'center', marginTop: 2,
        }}
      >
        <Trash2 size={13} />
      </button>
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
  const shown = roster.filter((r) => rosterMatchesSection(r, section));
  const tailLive = d.liveByLean?.tail;
  const sitLive = d.liveByLean?.sit;

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
            <span style={{ ...T.tiny, color: B.gold }}>Who to tail</span>
            <span style={{
              ...T.micro, color: B.gold, background: B.goldDim, borderRadius: 4,
              padding: '0.08rem 0.38rem', fontWeight: 800,
            }}>
              {d.walletN}/{cap}
            </span>
          </div>
          {collapsed ? (
            <div style={{ ...T.micro, color: B.textMuted, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
              {d.lean?.tail || 0} tail · {d.lean?.sit || 0} sit · {d.heat?.hot || 0} hot · {d.heat?.cold || 0} cold
              {d.actionN ? ` · ${d.actionN} live` : ''}
            </div>
          ) : (
            <div style={{ ...T.micro, color: B.textMuted, marginTop: 4 }}>
              {scope === 'single' && focusShort
                ? `Tracking ${fmtWalletTag(focusShort)}`
                : 'Book, heat, and a lean — your list, not the whole firehose'}
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
              label="Tail"
              value={d.lean?.tail || 0}
              sub={tailLive?.n
                ? `${tailLive.n} live · ${fmtVol(tailLive.invested)}`
                : 'Nobody running hot'}
              active={section === 'tail'}
              onClick={() => onSection(section === 'tail' ? 'action' : 'tail')}
              tone={d.lean?.tail ? 'up' : null}
            />
            <Metric
              label="Sit"
              value={d.lean?.sit || 0}
              sub={sitLive?.n
                ? `${sitLive.n} live · leave them`
                : 'Nobody to sit'}
              active={section === 'sit'}
              onClick={() => onSection(section === 'sit' ? 'action' : 'sit')}
              tone={d.lean?.sit ? 'down' : null}
            />
            <Metric
              label="Hot"
              value={d.heat?.hot || 0}
              sub={d.heat?.even ? `${d.heat.even} even` : 'L5 / L10 form'}
              active={section === 'hot'}
              onClick={() => onSection(section === 'hot' ? 'action' : 'hot')}
              tone={d.heat?.hot ? 'up' : null}
            />
            <Metric
              label="Cold"
              value={d.heat?.cold || 0}
              sub={d.heat?.quiet ? `${d.heat.quiet} quiet` : 'L5 / L10 form'}
              active={section === 'cold'}
              onClick={() => onSection(section === 'cold' ? 'action' : 'cold')}
              tone={d.heat?.cold ? 'down' : null}
            />
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 8, gap: 8,
          }}>
            <div style={{ ...T.tiny, color: B.textSubtle }}>
              {section === 'action' ? 'Your sharps' : `${section} · ${shown.length}`}
            </div>
            <button
              type="button"
              onClick={() => onSection('action')}
              style={{
                ...T.tiny, border: 'none', background: 'transparent',
                color: section === 'action' ? B.textSubtle : B.gold, cursor: 'pointer',
              }}
            >
              {section === 'action' ? `${d.actionN || 0} live below` : 'Show all'}
            </button>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            maxHeight: isMobile ? 360 : 440, overflow: 'auto',
          }}>
            {shown.length === 0 ? (
              <div style={{ ...T.micro, color: B.textMuted, padding: '0.6rem 0.2rem' }}>
                Nobody in this cut. Show all to see the full desk.
              </div>
            ) : shown.map((r) => (
              <SkillCard
                key={r.walletShort}
                r={r}
                on={scope === 'single' && focusShort === r.walletShort}
                isMobile={isMobile}
                onSelect={() => {
                  onScope('single');
                  onFocus(r.walletShort === focusShort ? null : r.walletShort);
                }}
                onRemove={() => onRemove(r.walletShort)}
              />
            ))}
          </div>

          <div style={{ ...T.micro, color: B.textSubtle, marginTop: 14 }}>
            Tail and sit use their sport book and recent form. Thin samples stay Watch — we will not dress a 3–0 as 100%.
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * The locked face under the pick. One proof number, then the river:
 * each wallet drawn into the pile it joined.
 */
import { useId } from 'react';
import { Star } from 'lucide-react';
import { buildMoneyRiver, fmtRiverUsd } from './moneyRiver.js';
import { normalizeWalletShort } from '../../../lib/mySharps.js';

const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
};
const GREEN = '#3DDC97';
const GOLD = '#E8D28A';
const AMBER = '#D4A574';
const CORAL = '#F07167';

const INK = {
  hc: GOLD,
  sharp: GREEN,
  opp: AMBER,
  loser: CORAL,
};

const RIBBON = {
  hc: ['#C6A15A', '#F6E7B2'],
  sharp: ['#1EAE6C', '#8CFFC8'],
  opp: ['#C49262', '#F0D0AE'],
  loser: ['#D15A52', '#FFC1B8'],
};

function ribbonPath(y0, w, y1) {
  const x1 = 72;
  const dx = 30;
  const y0a = y0 - w / 2;
  const y0b = y0 + w / 2;
  const y1a = y1 - w / 2;
  const y1b = y1 + w / 2;
  return `M 0 ${y0a} C ${dx} ${y0a}, ${x1 - dx} ${y1a}, ${x1} ${y1a} L ${x1} ${y1b} C ${x1 - dx} ${y1b}, ${dx} ${y0b}, 0 ${y0b} Z`;
}

const PILL_SKIN = {
  ours: {
    border: '1px solid rgba(61,220,151,0.55)',
    background: 'linear-gradient(180deg, rgba(61,220,151,0.16), rgba(61,220,151,0.04))',
    shadow: '0 0 22px -8px rgba(61,220,151,0.8)',
  },
  opp: {
    border: '1px solid rgba(212,165,116,0.5)',
    background: 'linear-gradient(180deg, rgba(212,165,116,0.14), rgba(212,165,116,0.04))',
    shadow: '0 0 18px -8px rgba(212,165,116,0.55)',
  },
  fade: {
    border: '1px solid rgba(240,113,103,0.55)',
    background: 'linear-gradient(180deg, rgba(240,113,103,0.16), rgba(240,113,103,0.04))',
    shadow: '0 0 22px -8px rgba(240,113,103,0.7)',
  },
};

function rowName(row) {
  if (row.more > 0) return `+${row.more} more`;
  if (row.book) return '+ more';
  return row.short ? `\u2026${row.short}` : 'wallet';
}

function rowMeta(row) {
  const stake = fmtRiverUsd(row.invested);
  if (row.record) return `${row.record} \u00b7 ${stake}`;
  return stake;
}

function RiverRow({ row, mine }) {
  const color = INK[row.kind] || C.textSec;
  const named = mine && row.short && mine.has(normalizeWalletShort(row.short));
  return (
    <div style={{
      height: 32,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
    }}
    >
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12.5,
          fontWeight: 680,
          letterSpacing: '-0.02em',
          color: named ? GOLD : C.text,
          lineHeight: 1.1,
        }}
        >
          {row.kind === 'hc' ? (
            <Star size={10} fill={GOLD} color={GOLD} strokeWidth={2.4} />
          ) : null}
          {rowName(row)}
        </span>
        <span style={{
          display: 'block',
          marginTop: 1,
          fontSize: 10.5,
          fontWeight: 550,
          color: C.textMuted,
          fontFeatureSettings: "'tnum'",
          letterSpacing: '0.01em',
          lineHeight: 1.1,
        }}
        >
          {rowMeta(row)}
        </span>
      </span>
      <span style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        flexShrink: 0,
        background: color,
        boxShadow: `0 0 0 3px ${color}22`,
      }}
      />
    </div>
  );
}

function Destination({ pill, top, height }) {
  if (!pill) return null;
  const skin = PILL_SKIN[pill.tone] || PILL_SKIN.ours;
  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top,
      height,
      borderRadius: 12,
      border: skin.border,
      background: skin.background,
      boxShadow: skin.shadow,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 10px',
      gap: 1,
    }}
    >
      <div style={{
        fontSize: 9,
        fontWeight: 750,
        letterSpacing: '0.12em',
        color: C.textMuted,
        lineHeight: 1.2,
      }}
      >
        {pill.title}
      </div>
      {pill.lines.map((line) => (
        <div
          key={`${line.tone}-${line.text}-${line.caption || ''}`}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 5,
            minWidth: 0,
          }}
        >
          <span style={{
            fontSize: line.tone === 'quiet' ? 10.5 : 14,
            fontWeight: line.tone === 'quiet' ? 600 : 740,
            letterSpacing: line.tone === 'quiet' ? '0.01em' : '-0.03em',
            color: line.tone === 'loser' ? CORAL : line.tone === 'quiet' ? C.textSec : C.text,
            fontFeatureSettings: "'tnum'",
            lineHeight: 1.05,
            whiteSpace: 'nowrap',
          }}
          >
            {line.text}
          </span>
          {line.caption ? (
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: line.tone === 'loser' ? 'rgba(240,113,103,0.85)' : C.textMuted,
              letterSpacing: '0.01em',
            }}
            >
              {line.caption}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Proof({ panel }) {
  if (!panel?.hero) return null;
  const stats = panel.stats || [];
  return (
    <div style={{
      padding: '14px 14px 12px',
      borderRadius: 14,
      background: 'linear-gradient(180deg, rgba(61,220,151,0.11), rgba(61,220,151,0.035) 42%, rgba(8,12,22,0.2))',
      border: '1px solid rgba(61,220,151,0.24)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
    }}
    >
      <div style={{
        fontSize: 10.5,
        fontWeight: 750,
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
        color: GREEN,
      }}
      >
        {panel.eyebrow}
        {panel.combined ? (
          <span style={{ color: 'rgba(61,220,151,0.62)' }}>{' · Combined'}</span>
        ) : null}
      </div>
      {panel.sub ? (
        <div style={{
          marginTop: 5,
          fontSize: 12.5,
          fontWeight: 600,
          color: 'rgba(61,220,151,0.82)',
          letterSpacing: '0.01em',
        }}
        >
          {panel.sub}
        </div>
      ) : null}
      <div style={{ textAlign: 'center', paddingTop: 12, paddingBottom: stats.length ? 12 : 2 }}>
        <div style={{
          fontSize: 46,
          fontWeight: 740,
          letterSpacing: '-0.055em',
          color: GREEN,
          lineHeight: 0.88,
          fontFeatureSettings: "'tnum'",
        }}
        >
          {panel.hero}
        </div>
        <div style={{
          marginTop: 7,
          fontSize: 10,
          fontWeight: 750,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(61,220,151,0.7)',
        }}
        >
          {panel.caption}
        </div>
      </div>
      {stats.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          borderTop: '1px solid rgba(61,220,151,0.16)',
          paddingTop: 10,
        }}
        >
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', minWidth: 0 }}>
              <div style={{
                fontSize: 16,
                fontWeight: 720,
                letterSpacing: '-0.03em',
                color: C.text,
                fontFeatureSettings: "'tnum'",
                lineHeight: 1,
              }}
              >
                {stat.value}
              </div>
              <div style={{
                marginTop: 5,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.textMuted,
              }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Legend({ rows }) {
  const kinds = new Set(rows.map((r) => r.kind));
  const items = [
    kinds.has('hc') ? { kind: 'hc', label: 'sized up' } : null,
    kinds.has('sharp') ? { kind: 'sharp', label: 'sharp' } : null,
    kinds.has('opp') ? { kind: 'opp', label: 'other side' } : null,
    kinds.has('loser') ? { kind: 'loser', label: 'loser' } : null,
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px 12px',
      marginTop: 8,
    }}
    >
      {items.map((item) => (
        <span
          key={item.kind}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 10.5,
            fontWeight: 550,
            color: C.textMuted,
          }}
        >
          {item.kind === 'hc' ? (
            <Star size={9} fill={GOLD} color={GOLD} />
          ) : (
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: INK[item.kind],
            }}
            />
          )}
          {item.label}
        </span>
      ))}
    </div>
  );
}

export default function LockedCollapsedRiver({ f, mine = null }) {
  const model = buildMoneyRiver(f);
  const rawId = useId();
  const gid = `river${rawId.replace(/:/g, '')}`;
  if (!model) return null;
  const mineIds = new Set((mine || []).map((w) => w.id));

  return (
    <div data-river="" style={{ marginTop: 16 }}>
      <Proof panel={model.panel} />

      {model.rows.length > 0 && (
        <div style={{ marginTop: model.panel ? 14 : 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 4,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.textFaint,
          }}
          >
            <span>Wallet · record · stake</span>
            <span>Where it went</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              {model.rows.map((row) => (
                <RiverRow key={row.key} row={row} mine={mineIds} />
              ))}
            </div>
            <svg
              width="72"
              height={model.height}
              viewBox={`0 0 72 ${model.height}`}
              aria-hidden
              style={{ flex: '0 0 72px', display: 'block' }}
            >
              <defs>
                {model.rows.map((row) => {
                  const [from, to] = RIBBON[row.kind] || RIBBON.sharp;
                  return (
                    <linearGradient key={row.key} id={`${gid}-${row.key}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor={from} />
                      <stop offset="1" stopColor={to} />
                    </linearGradient>
                  );
                })}
              </defs>
              {model.rows.map((row) => (
                <path
                  key={row.key}
                  d={ribbonPath(row.y, row.thick, row.targetY)}
                  fill={`url(#${gid}-${row.key})`}
                  opacity="0.92"
                />
              ))}
            </svg>
            <div style={{ position: 'relative', flex: '0 0 116px', height: model.height }}>
              {model.ourPill && model.ourBox ? (
                <Destination pill={model.ourPill} top={model.ourBox.top} height={model.ourBox.height} />
              ) : null}
              {model.theirPill && model.theirBox ? (
                <Destination pill={model.theirPill} top={model.theirBox.top} height={model.theirBox.height} />
              ) : null}
            </div>
          </div>
          <Legend rows={model.rows} />
        </div>
      )}
    </div>
  );
}

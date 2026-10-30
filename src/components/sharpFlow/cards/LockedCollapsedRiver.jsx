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
      height: 34,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
    }}
    >
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        flexShrink: 0,
        background: color,
        boxShadow: `0 0 8px ${color}`,
      }}
      />
      <span style={{ minWidth: 0 }}>
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
    </div>
  );
}

function Destination({ pill, top }) {
  if (!pill) return null;
  const skin = PILL_SKIN[pill.tone] || PILL_SKIN.ours;
  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top,
      height: 70,
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
  return (
    <div style={{
      padding: '13px 14px 14px',
      borderRadius: 14,
      background: 'linear-gradient(180deg, rgba(61,220,151,0.10), rgba(61,220,151,0.03) 46%, rgba(8,12,22,0.15))',
      border: '1px solid rgba(61,220,151,0.22)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 28px -16px rgba(61,220,151,0.7)',
    }}
    >
      <div style={{
        fontSize: 10,
        fontWeight: 750,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: GREEN,
      }}
      >
        {panel.eyebrow}
      </div>
      {panel.sub ? (
        <div style={{
          marginTop: 4,
          fontSize: 12,
          fontWeight: 550,
          color: C.textSec,
          letterSpacing: '0.01em',
        }}
        >
          {panel.sub}
        </div>
      ) : null}
      <div style={{ textAlign: 'center', paddingTop: panel.sub ? 10 : 12 }}>
        <div style={{
          fontSize: 42,
          fontWeight: 730,
          letterSpacing: '-0.05em',
          color: GREEN,
          lineHeight: 0.9,
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
          color: 'rgba(61,220,151,0.72)',
        }}
        >
          {panel.caption}
        </div>
        {panel.support ? (
          <div style={{
            marginTop: 6,
            fontSize: 15,
            fontWeight: 650,
            letterSpacing: '-0.03em',
            color: C.text,
            fontFeatureSettings: "'tnum'",
          }}
          >
            {panel.support}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Strip({ tone, kicker, text, detail }) {
  const gold = tone === 'gold';
  const warn = tone === 'warn';
  const color = gold ? GOLD : CORAL;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 10,
      padding: '8px 10px',
      borderRadius: 9,
      background: gold ? 'rgba(232,210,138,0.06)' : warn ? 'rgba(240,113,103,0.08)' : 'rgba(240,113,103,0.05)',
      border: `1px solid ${gold ? 'rgba(232,210,138,0.28)' : 'rgba(240,113,103,0.28)'}`,
      borderLeft: `3px solid ${color}`,
    }}
    >
      <span style={{
        minWidth: 0,
        fontSize: 12,
        fontWeight: 600,
        color: C.text,
        letterSpacing: '-0.01em',
        fontFeatureSettings: "'tnum'",
      }}
      >
        <span style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.12em',
          color,
          marginRight: 6,
        }}
        >
          {kicker}
        </span>
        {text}
      </span>
      {detail ? (
        <span style={{
          flexShrink: 0,
          fontSize: 11.5,
          fontWeight: 680,
          color: gold ? C.textSec : CORAL,
          fontFeatureSettings: "'tnum'",
          letterSpacing: '-0.01em',
        }}
        >
          {detail}
        </span>
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
  const glowId = `river${rawId.replace(/:/g, '')}`;
  if (!model) return null;
  const mineIds = new Set((mine || []).map((w) => w.id));
  const maxStake = Math.max(1, ...model.rows.map((r) => r.invested || 0));
  const channels = model.rows.map((row) => {
    const endY = row.side === 'against' ? model.theirY : model.ourY;
    if (endY == null) return null;
    const width = 2.4 + 6.5 * Math.sqrt((row.invested || 0) / maxStake);
    return { row, endY, width, color: INK[row.kind] || GREEN };
  }).filter(Boolean);

  return (
    <div data-river="" style={{ marginTop: 18 }}>
      <Proof panel={model.panel} />

      {model.rows.length > 0 && (
        <div style={{ marginTop: model.panel ? 16 : 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 6,
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
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              {model.rows.map((row) => (
                <RiverRow key={row.key} row={row} mine={mineIds} />
              ))}
            </div>
            <svg
              width="78"
              height={model.height}
              viewBox={`0 0 78 ${model.height}`}
              aria-hidden
              style={{ flex: '0 0 78px', overflow: 'visible' }}
            >
              <defs>
                <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2.1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {channels.map(({ row, endY, width, color }) => {
                const d = `M 0 ${row.y} C 30 ${row.y}, 50 ${endY}, 78 ${endY}`;
                return (
                  <g key={row.key} filter={`url(#${glowId})`}>
                    <path d={d} fill="none" stroke={color} strokeWidth={width + 3.5} strokeLinecap="round" opacity="0.22" />
                    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity="0.95" />
                  </g>
                );
              })}
            </svg>
            <div style={{ position: 'relative', flex: '0 0 118px', height: model.height }}>
              {model.ourPill && model.ourY != null ? (
                <Destination pill={model.ourPill} top={model.ourY - model.pillH / 2} />
              ) : null}
              {model.theirPill && model.theirY != null ? (
                <Destination pill={model.theirPill} top={model.theirY - model.pillH / 2} />
              ) : null}
            </div>
          </div>
          <Legend rows={model.rows} />
        </div>
      )}

      {model.lead ? (
        <div style={{ marginTop: 12 }}>
          <Strip
            tone="gold"
            kicker="Lead"
            text={[`\u2026${model.lead.short}`, model.lead.proof].filter(Boolean).join(' \u00b7 ')}
            detail={model.allMoney ? `All money ${model.allMoney.text}` : null}
          />
        </div>
      ) : null}
      {model.fade ? (
        <div style={{ marginTop: 6 }}>
          <Strip
            tone={model.fade.warn ? 'warn' : 'fade'}
            kicker="Fade"
            text={model.fade.text}
            detail={model.fade.detail}
          />
        </div>
      ) : null}
    </div>
  );
}

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
  hc: ['#C6A15A', '#F8E7B0'],
  sharp: ['#14915A', '#B6FFD9'],
  opp: ['#C49262', '#F6D7B6'],
  loser: ['#D15A52', '#FFD0C8'],
};

const FLOW_W = 108;
const DOT_X = 14;
const ROW_H = 32;

function flowPath(y0, y1) {
  const x1 = FLOW_W - 1;
  const bend = (x1 - DOT_X) * 0.46;
  return `M ${DOT_X} ${y0} C ${DOT_X + bend} ${y0}, ${x1 - bend} ${y1}, ${x1} ${y1}`;
}

function flowPoint(y0, y1, t) {
  const x0 = DOT_X;
  const x1 = FLOW_W - 1;
  const bend = (x1 - x0) * 0.46;
  const c1 = x0 + bend;
  const c2 = x1 - bend;
  const u = 1 - t;
  return {
    x: u * u * u * x0 + 3 * u * u * t * c1 + 3 * u * t * t * c2 + t * t * t * x1,
    y: u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1,
  };
}

const PILL_SKIN = {
  ours: {
    border: '1px solid rgba(94,232,168,0.72)',
    background: 'linear-gradient(180deg, rgba(16,36,30,0.98), rgba(8,16,18,0.96))',
    shadow: '0 0 0 1px rgba(61,220,151,0.12), 0 10px 28px -16px rgba(61,220,151,0.95)',
  },
  opp: {
    border: '1px solid rgba(224,180,138,0.62)',
    background: 'linear-gradient(180deg, rgba(36,26,18,0.98), rgba(14,12,10,0.96))',
    shadow: '0 0 0 1px rgba(212,165,116,0.12), 0 10px 24px -16px rgba(212,165,116,0.7)',
  },
  fade: {
    border: '1px solid rgba(255,138,130,0.7)',
    background: 'linear-gradient(180deg, rgba(40,16,16,0.98), rgba(16,10,12,0.96))',
    shadow: '0 0 0 1px rgba(240,113,103,0.14), 0 10px 28px -16px rgba(240,113,103,0.9)',
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
    </div>
  );
}

function Destination({ pill, top, height }) {
  if (!pill) return null;
  const skin = PILL_SKIN[pill.tone] || PILL_SKIN.ours;
  return (
    <div data-pill="" style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top,
      height,
      borderRadius: 14,
      border: skin.border,
      background: skin.background,
      boxShadow: skin.shadow,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 11px',
      gap: 1,
      overflow: 'hidden',
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
            fontSize: line.tone === 'quiet' ? 10.5 : 16,
            fontWeight: line.tone === 'quiet' ? 600 : 750,
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

function HeroFigure({ text }) {
  const m = String(text).match(/^(.*?)(%)$/);
  if (!m) return text;
  return (
    <>
      {m[1]}
      <span style={{ fontSize: '0.58em', letterSpacing: '-0.04em', marginLeft: 1 }}>{m[2]}</span>
    </>
  );
}

function RecordMark({ value }) {
  const parts = String(value).split('\u2013');
  if (parts.length !== 2) return value;
  return (
    <span>
      <span style={{ color: GREEN }}>{parts[0]}</span>
      <span style={{ color: 'rgba(244,247,251,0.28)' }}>{'\u2013'}</span>
      <span style={{ color: CORAL }}>{parts[1]}</span>
    </span>
  );
}

function RecordDots({ dots }) {
  if (!dots || (dots.green + dots.red) < 2) return null;
  const cells = [
    ...Array(dots.green).fill('win'),
    ...Array(dots.red).fill('loss'),
  ];
  return (
    <div aria-hidden style={{ display: 'flex', justifyContent: 'center', marginTop: 13 }}>
      {cells.map((tone, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            marginLeft: i === 0 ? 0 : (i === dots.green ? 10 : 5),
            borderRadius: '50%',
            background: tone === 'win' ? GREEN : '#E15A52',
            boxShadow: tone === 'win'
              ? '0 0 0 3px rgba(61,220,151,0.12), 0 0 8px rgba(61,220,151,0.9)'
              : '0 0 0 3px rgba(225,90,82,0.1), 0 0 6px rgba(225,90,82,0.55)',
          }}
        />
      ))}
    </div>
  );
}

function Proof({ panel }) {
  if (!panel?.hero) return null;
  const stats = panel.stats || [];
  return (
    <div data-proof="" style={{
      padding: '15px 16px 13px',
      borderRadius: 16,
      background: 'linear-gradient(180deg, rgba(61,220,151,0.16), rgba(61,220,151,0.05) 34%, rgba(6,12,18,0.42))',
      border: '1px solid rgba(61,220,151,0.34)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 16px 36px -28px rgba(61,220,151,0.9)',
    }}
    >
      <div style={{
        fontSize: 10.5,
        fontWeight: 750,
        letterSpacing: '0.14em',
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
          color: 'rgba(186,232,210,0.78)',
          letterSpacing: '0.01em',
        }}
        >
          {panel.sub}
        </div>
      ) : null}
      <div style={{ textAlign: 'center', paddingTop: 14 }}>
        <div style={{
          fontSize: 54,
          fontWeight: 760,
          letterSpacing: '-0.06em',
          color: '#5EF0B1',
          lineHeight: 0.84,
          fontFeatureSettings: "'tnum'",
          textShadow: '0 0 28px rgba(61,220,151,0.38)',
        }}
        >
          <HeroFigure text={panel.hero} />
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 10,
          fontWeight: 750,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(61,220,151,0.72)',
        }}
        >
          {panel.caption}
        </div>
        {panel.dots ? <RecordDots dots={panel.dots} /> : null}
      </div>
      {stats.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          borderTop: '1px solid rgba(61,220,151,0.2)',
          marginTop: panel.dots ? 10 : 12,
          paddingTop: 11,
        }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                minWidth: 0,
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div style={{
                fontSize: 18,
                fontWeight: 730,
                letterSpacing: '-0.03em',
                color: C.text,
                fontFeatureSettings: "'tnum'",
                lineHeight: 1,
              }}
              >
                {stat.label === 'Record' ? <RecordMark value={stat.value} /> : stat.value}
              </div>
              <div style={{
                marginTop: 6,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.13em',
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
            <div style={{ position: 'relative', flex: '1 1 auto', minWidth: 0, height: model.height }}>
              {model.rows.map((row) => (
                <div
                  key={row.key}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 4,
                    top: row.y - ROW_H / 2,
                    height: ROW_H,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <RiverRow row={row} mine={mineIds} />
                </div>
              ))}
            </div>
            <svg
              width={FLOW_W}
              height={model.height}
              viewBox={`0 0 ${FLOW_W} ${model.height}`}
              aria-hidden
              style={{ flex: `0 0 ${FLOW_W}px`, display: 'block', overflow: 'visible', marginLeft: -DOT_X }}
            >
              <defs>
                <filter id={`${gid}-glow`} filterUnits="userSpaceOnUse" x={-24} y={-28} width={FLOW_W + 48} height={model.height + 56}>
                  <feGaussianBlur stdDeviation="1.8" />
                </filter>
                {model.rows.map((row) => {
                  const [from, to] = RIBBON[row.kind] || RIBBON.sharp;
                  return (
                    <linearGradient key={row.key} id={`${gid}-${row.key}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={FLOW_W} y2="0">
                      <stop offset="0" stopColor={from} />
                      <stop offset="1" stopColor={to} />
                    </linearGradient>
                  );
                })}
              </defs>
              {model.rows.length > 1 ? (
                <line
                  x1={DOT_X}
                  y1={Math.min(...model.rows.map((r) => r.y))}
                  x2={DOT_X}
                  y2={Math.max(...model.rows.map((r) => r.y))}
                  stroke="rgba(244,247,251,0.16)"
                  strokeWidth="1"
                />
              ) : null}
              {model.rows.map((row) => {
                const color = INK[row.kind] || GREEN;
                return (
                  <path
                    key={`glow-${row.key}`}
                    d={flowPath(row.y, row.targetY)}
                    fill="none"
                    stroke={color}
                    strokeWidth={row.thick + 5}
                    strokeLinecap="round"
                    opacity="0.28"
                    filter={`url(#${gid}-glow)`}
                  />
                );
              })}
              {model.rows.map((row) => (
                <path
                  key={row.key}
                  d={flowPath(row.y, row.targetY)}
                  fill="none"
                  stroke={`url(#${gid}-${row.key})`}
                  strokeWidth={row.thick}
                  strokeLinecap="round"
                />
              ))}
              {model.rows.map((row) => (
                row.thick < 5 ? null : (
                  <path
                    key={`core-${row.key}`}
                    d={flowPath(row.y, row.targetY)}
                    fill="none"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth={Math.min(2.2, row.thick * 0.14)}
                    strokeLinecap="round"
                  />
                )
              ))}
              {model.rows.map((row) => {
                if (row.thick < 6) return null;
                return [0.42, 0.68].map((t) => {
                  const p = flowPoint(row.y, row.targetY, t);
                  return (
                    <circle
                      key={`spark-${row.key}-${t}`}
                      cx={p.x}
                      cy={p.y}
                      r={row.thick > 12 ? 1.35 : 1.05}
                      fill="#fff"
                      opacity="0.8"
                    />
                  );
                });
              })}
              {model.rows.map((row) => {
                const color = INK[row.kind] || GREEN;
                return (
                  <g key={`dot-${row.key}`}>
                    <circle cx={DOT_X} cy={row.y} r="6.4" fill={color} opacity="0.18" />
                    <circle cx={DOT_X} cy={row.y} r="4.3" fill="#0c1218" />
                    <circle cx={DOT_X} cy={row.y} r="3.25" fill={color} />
                  </g>
                );
              })}
            </svg>
            <div style={{ position: 'relative', flex: '0 0 122px', height: model.height, zIndex: 1 }}>
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

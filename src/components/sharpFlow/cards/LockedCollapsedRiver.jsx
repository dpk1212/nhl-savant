/**
 * The locked face under the pick. Four quiet stats, then the river:
 * each wallet drawn into the pile it joined.
 */
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { buildMoneyRiver, fmtRiverUsd, fmtRoi } from './moneyRiver.js';
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

const DOT_X = 8;
const ROW_H = 32;
const LABEL_W = 158;
const PILL_W = 132;

function flowPath(y0, y1, width) {
  const x1 = Math.max(DOT_X + 28, width - 1);
  const bend = (x1 - DOT_X) * 0.46;
  return `M ${DOT_X} ${y0} C ${DOT_X + bend} ${y0}, ${x1 - bend} ${y1}, ${x1} ${y1}`;
}

function flowPoint(y0, y1, width, t) {
  const x0 = DOT_X;
  const x1 = Math.max(x0 + 28, width - 1);
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
  const roi = Number.isFinite(row.roi) ? fmtRoi(row.roi) : null;
  return [row.record, roi, stake].filter(Boolean).join(' \u00b7 ');
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
            display: 'flex',
            flexDirection: line.tone === 'quiet' ? 'column' : 'row',
            alignItems: line.tone === 'quiet' ? 'flex-start' : 'baseline',
            gap: line.tone === 'quiet' ? 0 : 5,
            minWidth: 0,
          }}
          >
            <span style={{
              fontSize: line.tone === 'quiet' ? 12 : 16,
              fontWeight: line.tone === 'quiet' ? 700 : 750,
              letterSpacing: line.tone === 'quiet' ? '-0.02em' : '-0.03em',
              color: line.tone === 'loser' ? CORAL : line.tone === 'quiet' ? C.text : C.text,
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
                fontWeight: 650,
                color: line.tone === 'loser' ? 'rgba(240,113,103,0.85)' : C.textSec,
                letterSpacing: '0.01em',
                lineHeight: 1.15,
              }}
              >
                {line.caption}
              </span>
            ) : null}
          </span>
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
  if (!Array.isArray(dots) || dots.length < 2) return null;
  return (
    <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
      {dots.map((tone, i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: tone === 'win' ? GREEN : '#E15A52',
          }}
        />
      ))}
    </div>
  );
}

const TONE = {
  plain: C.text,
  up: '#2fd57e',
  loss: '#f0524f',
  record: C.text,
};

function ProofStat({ stat }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontSize: 17,
        fontWeight: 680,
        letterSpacing: '-0.03em',
        color: TONE[stat.tone] || C.text,
        fontFeatureSettings: "'tnum'",
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
      >
        {stat.tone === 'record' ? <RecordMark value={stat.value} /> : <HeroFigure text={stat.value} />}
      </div>
      <div style={{
        marginTop: 5,
        fontSize: 8.5,
        fontWeight: 650,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: C.textMuted,
        lineHeight: 1.25,
      }}
      >
        {stat.label}
      </div>
    </div>
  );
}

function Proof({ panel }) {
  const stats = panel?.stats || [];
  const dots = Array.isArray(panel?.dots) ? panel.dots : [];
  if (!stats.length && dots.length < 2) return null;
  return (
    <div data-proof="" style={{ paddingTop: 2 }}>
      {stats.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          columnGap: 10,
        }}
        >
          {stats.map((stat) => <ProofStat key={stat.label} stat={stat} />)}
        </div>
      ) : null}
      {dots.length >= 2 ? <RecordDots dots={dots} /> : null}
    </div>
  );
}

function Legend({ rows }) {
  const kinds = new Set(rows.map((r) => r.kind));
  const items = [
    kinds.has('hc') ? { kind: 'hc', label: 'Sized up' } : null,
    kinds.has('sharp') ? { kind: 'sharp', label: 'Sharp' } : null,
    kinds.has('opp') ? { kind: 'opp', label: 'Other side' } : null,
    kinds.has('loser') ? { kind: 'loser', label: 'Loser' } : null,
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
  const flowRef = useRef(null);
  const [flowW, setFlowW] = useState(120);
  useLayoutEffect(() => {
    const el = flowRef.current;
    if (!el) return undefined;
    const read = () => {
      const w = Math.round(el.clientWidth);
      if (w > 48) setFlowW(w);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [model?.height, model?.rows?.length]);
  if (!model) return null;
  const mineIds = new Set((mine || []).map((w) => w.id));
  const spines = [];
  model.rows.forEach((row) => {
    const side = row.side === 'against' ? 'against' : 'ours';
    const last = spines[spines.length - 1];
    if (!last || last.side !== side) spines.push({ side, ys: [row.y] });
    else last.ys.push(row.y);
  });

  return (
    <div data-river="" style={{ marginTop: 14 }}>
      <Proof panel={model.panel} />

      {model.rows.length > 0 && (
        <div style={{ marginTop: model.panel ? 14 : 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            marginBottom: 6,
            fontSize: 9,
            fontWeight: 750,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: C.textFaint,
          }}
          >
            <span style={{ flex: `0 0 ${LABEL_W}px` }}>Wallets</span>
            <span style={{ flex: '1 1 auto' }} />
            <span style={{ flex: `0 0 ${PILL_W}px`, textAlign: 'right' }}>Where it went</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', flex: `0 0 ${LABEL_W}px`, width: LABEL_W, height: model.height }}>
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
            <div ref={flowRef} style={{ flex: '1 1 auto', minWidth: 72, height: model.height }}>
            <svg
              width="100%"
              height={model.height}
              viewBox={`0 0 ${flowW} ${model.height}`}
              preserveAspectRatio="none"
              aria-hidden
              style={{ display: 'block', overflow: 'visible' }}
            >
              <defs>
                <filter id={`${gid}-glow`} filterUnits="userSpaceOnUse" x={-12} y={-20} width={flowW + 24} height={model.height + 40}>
                  <feGaussianBlur stdDeviation="1.2" />
                </filter>
                {model.rows.map((row) => {
                  const [from, to] = RIBBON[row.kind] || RIBBON.sharp;
                  return (
                    <linearGradient key={row.key} id={`${gid}-${row.key}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={flowW} y2="0">
                      <stop offset="0" stopColor={from} />
                      <stop offset="1" stopColor={to} />
                    </linearGradient>
                  );
                })}
              </defs>
              {spines.map((spine) => (
                spine.ys.length > 1 ? (
                  <line
                    key={spine.side}
                    x1={DOT_X}
                    y1={Math.min(...spine.ys)}
                    x2={DOT_X}
                    y2={Math.max(...spine.ys)}
                    stroke="rgba(244,247,251,0.16)"
                    strokeWidth="1"
                  />
                ) : null
              ))}
              {model.rows.map((row) => {
                const color = INK[row.kind] || GREEN;
                return (
                  <path
                    key={`glow-${row.key}`}
                    d={flowPath(row.y, row.targetY, flowW)}
                    fill="none"
                    stroke={color}
                    strokeWidth={row.thick + 2.5}
                    strokeLinecap="round"
                    opacity="0.22"
                    filter={`url(#${gid}-glow)`}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
              {model.rows.map((row) => (
                <path
                  key={row.key}
                  d={flowPath(row.y, row.targetY, flowW)}
                  fill="none"
                  stroke={`url(#${gid}-${row.key})`}
                  strokeWidth={row.thick}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {model.rows.map((row) => (
                row.thick < 6 ? null : (
                  <path
                    key={`core-${row.key}`}
                    d={flowPath(row.y, row.targetY, flowW)}
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={Math.min(1.6, row.thick * 0.16)}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )
              ))}
              {model.rows.map((row) => {
                if (row.thick < 7) return null;
                return [0.45, 0.72].map((t) => {
                  const p = flowPoint(row.y, row.targetY, flowW, t);
                  return (
                    <circle
                      key={`spark-${row.key}-${t}`}
                      cx={p.x}
                      cy={p.y}
                      r="1.1"
                      fill="#fff"
                      opacity="0.75"
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
            </div>
            <div style={{ position: 'relative', flex: `0 0 ${PILL_W}px`, width: PILL_W, height: model.height, zIndex: 1 }}>
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

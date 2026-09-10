/**
 * Collapsed Locked — Zone A trust band.
 *
 * Dual audience on one face:
 *   Novice: one sentence they can act on (is anyone good against us?).
 *   Advanced: lead book, record, $ on this, × usual, contested $ vs $.
 * The record is the proof — do not also stamp Proven.
 * Contested dollars are qualified board, not the wide Full-split under the chart.
 */
const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
};
const GREEN = '#2fd57e';
const VS = '#F07167';
const GOLD_HI = '#E8D28A';
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

function fmtUsd(v) {
  if (v == null || !Number.isFinite(Number(v)) || Number(v) <= 0) return null;
  const n = Number(v);
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`;
  }
  return `$${Math.round(n)}`;
}

function pickLeadWallet(f) {
  const pool = (Array.isArray(f?.wallets) && f.wallets.length
    ? f.wallets
    : (Array.isArray(f?.mapWallets) ? f.mapWallets.filter((w) => w.side === 'ours' || !w.side) : []))
    .filter((w) => w && (w.invested || 0) > 0);

  if (!pool.length) return null;
  const proven = pool.filter((w) => w.proven);
  const list = (proven.length ? proven : pool).slice();
  list.sort((a, b) => {
    const ts = (Number(b.trustScore) || 0) - (Number(a.trustScore) || 0);
    if (ts) return ts;
    return (b.invested || 0) - (a.invested || 0);
  });
  return list[0];
}

/**
 * The gaudy number must never go missing. If the biggest wallet here has no
 * résumé, find the best banger (L30 profit etc.) among ALL our-side wallets
 * and credit it to its owner.
 */
function bestBangerWallet(f, excludeShort = null) {
  const pool = (Array.isArray(f?.wallets) && f.wallets.length
    ? f.wallets
    : (Array.isArray(f?.mapWallets) ? f.mapWallets.filter((w) => w.side === 'ours' || !w.side) : []))
    .filter((w) => w && (w.invested || 0) > 0 && w.trust?.banger);
  if (!pool.length) return null;
  const sorted = [...pool].sort((a, b) => (b.trust.banger.score || 0) - (a.trust.banger.score || 0));
  const top = sorted[0];
  if (excludeShort && top.short === excludeShort) return sorted[1] || null;
  return top;
}

function boardContext(f) {
  // Qualified board only — same Contested/Unopposed logic as before battle bars.
  // Do NOT use wide Full-split (whales/flow/other-markets); that belongs under the chart.
  const sideUsd = Number(f.sharpUsd ?? f.sideInvested) || 0;
  const againstUsd = Number(f.against?.invested) || 0;
  const againstProven = Math.max(0, Number(f.against?.proven) || 0);
  const proven = Math.max(0, Number(f.confirmedOnSide) || 0);
  const muted = String(f.tapeAction || '').toLowerCase() === 'mute' || !!(f.mutedBy);
  const units = Number(f.units) || 0;
  const unopposed = againstUsd < 50 && againstProven === 0;
  const contested = againstProven >= 1 || againstUsd >= 500;

  const noStake = !(units > 0);
  if (muted && noStake) {
    return { tone: 'warn', label: 'Muted', detail: null, tip: 'System stood down' };
  }
  if (contested) {
    const ours = sideUsd > 0 ? fmtUsd(sideUsd) : null;
    const theirs = againstUsd > 0 ? fmtUsd(againstUsd) : `${againstProven} vs`;
    return {
      tone: 'warn',
      label: 'Contested',
      detail: ours ? `${ours} vs ${theirs}` : `vs ${theirs}`,
      tip: 'Qualified sharp $ on both sides (not the Full-split bar under the chart)',
    };
  }
  if (unopposed) {
    return {
      tone: noStake ? 'neutral' : 'trust',
      label: 'Unopposed',
      detail: sideUsd > 0 ? fmtUsd(sideUsd) : (proven >= 1 ? `${proven} proven` : null),
      tip: 'No qualified sharp $ against — Full split under the chart can still show other flow',
    };
  }
  if (proven >= 1 || sideUsd > 0) {
    return {
      tone: 'system',
      label: proven >= 1 ? `${proven} proven` : 'On side',
      detail: sideUsd > 0 ? fmtUsd(sideUsd) : null,
      tip: 'Sharp dollars on this side',
    };
  }
  return null;
}

const TONE = {
  trust: GREEN,
  warn: VS,
  system: GOLD_HI,
  hot: GREEN,
  good: GOLD_HI,
  neutral: C.textSec,
};

/**
 * The synthesis layer. The card used to hand the reader 25 raw numbers and
 * make them compute the conclusion. These two sentences ARE the conclusion —
 * and the figures inside them are set as jewelry: white-hot dollars, gold
 * size ratios, red threats. The prose is the design (no betting app sets
 * editorial inline-figure typography; this is the brand's dinner-table voice
 * with receipts baked into the sentence).
 *
 * Runs: { t, k } where k ∈ plain · fig (white 700) · gold · good · warn · dim.
 */
const R = (t, k = 'plain') => ({ t, k });

function oursPool(f) {
  return (Array.isArray(f?.wallets) && f.wallets.length
    ? f.wallets
    : (Array.isArray(f?.mapWallets) ? f.mapWallets.filter((w) => w.side === 'ours' || !w.side) : []))
    .filter((w) => w && (w.invested || 0) > 0);
}

const srOf = (w) => Number(w?.displaySizeRatio ?? w?.sizeRatio);

/**
 * Headline selection — lead with the most impressive TRUE story, never the
 * smallest number on the card:
 *   1. High-conviction slam (proven winner ≥1.5× usual) — name it.
 *   2. Proven lead carrying a real share of the board — their dollars.
 *   3. The board total with the proven count aboard.
 *   4. Biggest wallet, plain.
 * A sub-1× size ratio never makes the headline; it stays on the quiet rail.
 */
function buildHeadline(f, lead, oursTotal) {
  const sport = f.sport || lead?.sport || '';
  const provenCount = Math.max(0, Number(f.confirmedOnSide) || 0);
  const pool = oursPool(f);
  // Same money The Board figure above displays — headline and blocks must agree.
  const trackedTotal = pool.reduce((s, w) => s + (w.invested || 0), 0) || oursTotal;

  const hc = pool
    .filter((w) => w.proven && Number.isFinite(srOf(w)) && srOf(w) >= 1.5)
    .sort((a, b) => (b.invested || 0) - (a.invested || 0))[0] || null;

  if (hc) {
    const others = Math.max(0, provenCount - 1);
    const who = [
      R(`A proven ${sport} winner has `),
      R(fmtUsd(hc.invested), 'fig'),
      R(' on this — '),
      R(`${srOf(hc).toFixed(1)}× their usual size`, 'gold'),
    ];
    if (others > 0) who.push(R(', with '), R(`${others} more`, 'fig'), R(' proven alongside'));
    who.push(R('.'));
    return who;
  }

  const leadUsd = Number(lead?.invested) || 0;
  const leadCarries = lead?.proven && leadUsd > 0
    && (trackedTotal <= 0 || leadUsd >= Math.max(500, trackedTotal * 0.3));
  if (leadCarries) {
    const sr = srOf(lead);
    const others = Math.max(0, provenCount - 1);
    const who = [
      R(`A proven ${sport} winner has `),
      R(fmtUsd(leadUsd), 'fig'),
      R(' on this'),
    ];
    if (Number.isFinite(sr) && sr >= 1.0) {
      who.push(R(' — '), R(`${sr.toFixed(1)}× their usual size`, 'gold'));
    }
    if (others > 0) who.push(R(', with '), R(`${others} more`, 'fig'), R(' proven alongside'));
    who.push(R('.'));
    return who;
  }

  if (trackedTotal >= 500 && provenCount >= 1) {
    return [
      R(fmtUsd(trackedTotal), 'fig'),
      R(' of tracked money is on this — with '),
      R(`${provenCount} proven ${provenCount === 1 ? 'winner' : 'winners'}`, 'fig'),
      R(' aboard.'),
    ];
  }

  if (lead) {
    const name = lead.proven ? `A proven ${sport} winner` : `The biggest ${sport} wallet here`;
    const who = [R(name)];
    if (leadUsd > 0) {
      who.push(R(' has '), R(fmtUsd(leadUsd), 'fig'), R(' on this.'));
    } else {
      who.push(R(' is on this.'));
    }
    return who;
  }
  return null;
}

function buildVerdict(f, lead, board, sizeBit, boardAbove = false) {
  const ours = Number(f.sharpUsd ?? f.sideInvested) || 0;
  const theirs = Number(f.against?.invested) || 0;
  const theirProven = Math.max(0, Number(f.against?.proven) || 0);

  const who = buildHeadline(f, lead, ours);

  let boardLine = null;
  let boardTone = 'neutral';
  if (board?.label === 'Contested' && (ours > 0 || theirs > 0)) {
    const pct = ours + theirs > 0 ? Math.round((ours / (ours + theirs)) * 100) : null;
    // Color the actor, not the sentence — "one proven bettor" carries the
    // warning; the rest of the clause stays calm prose.
    const holderRuns = theirProven >= 1
      ? [
        R(theirProven === 1 ? 'one proven bettor' : `${theirProven} proven bettors`, 'warn'),
        R(' took the other side'),
      ]
      : [R('the rest sits on the other side')];
    if (boardAbove) {
      // The board figure above already states the dollars and the split —
      // the sentence keeps only the insight the blocks can't say aloud.
      if (theirProven >= 1) {
        boardLine = [
          R(theirProven === 1 ? 'One proven bettor' : `${theirProven} proven bettors`, 'warn'),
          R(' took the other side.'),
        ];
        boardTone = 'warn';
      } else if (pct != null && pct < 40) {
        // 21% here is not "split" — say it straight. Losses stay visible.
        boardLine = [R('Most of the tracked money is against this one.', 'warn')];
        boardTone = 'warn';
      } else if (pct != null && pct < 60) {
        boardLine = [R('Tracked money is split on this one.', 'plain')];
        boardTone = 'warn';
      } else {
        boardLine = null;
      }
    } else if (pct != null && pct >= 60) {
      boardLine = [
        R(fmtUsd(ours), 'fig'),
        R(' of qualified money is here against '),
        R(fmtUsd(theirs), 'dim'),
        R(' — '),
        ...holderRuns,
        R('.'),
      ];
      boardTone = theirProven >= 1 ? 'warn' : 'trust';
    } else {
      boardLine = [
        R('Qualified money is split — '),
        R(fmtUsd(ours), 'fig'),
        R(' here, '),
        R(fmtUsd(theirs), 'warn'),
        R(' against; '),
        ...holderRuns,
        R('.'),
      ];
      boardTone = 'warn';
    }
  } else if (board?.label === 'Unopposed') {
    boardLine = boardAbove
      ? null
      : (ours > 0
        ? [R('No qualified money is against it', 'good'), R(' — '), R(fmtUsd(ours), 'fig'), R(' on this side.')]
        : [R('No qualified money is against it', 'good'), R('.')]);
    boardTone = 'trust';
  } else if (board?.label === 'Muted') {
    boardLine = [R('The system stood this one down.', 'warn')];
    boardTone = 'warn';
  }

  return { who, boardLine, boardTone };
}

const RUN_STYLE = {
  plain: null,
  fig: { color: C.text, fontWeight: 700 },
  gold: { color: GOLD_HI, fontWeight: 600 },
  good: { color: GREEN, fontWeight: 600 },
  warn: { color: VS, fontWeight: 550 },
  dim: { color: C.textMuted, fontWeight: 600 },
};

function Runs({ runs }) {
  return runs.map((r, i) => (
    RUN_STYLE[r.k]
      ? <span key={i} style={RUN_STYLE[r.k]}>{r.t}</span>
      : <span key={i}>{r.t}</span>
  ));
}

export default function LockedCollapsedStrength({ f, face = 'original', boardAbove = false }) {
  if (!f) return null;

  const lead = pickLeadWallet(f);
  const trust = lead?.trust || null;
  const board = boardContext(f);
  const noStake = !(Number(f.units) > 0);
  const provenExtra = Math.max(0, (Number(f.confirmedOnSide) || 0) - (lead?.proven ? 1 : 0));
  const sr = Number(lead?.displaySizeRatio ?? lead?.sizeRatio);
  const sizeBit = Number.isFinite(sr) && sr > 0
    ? (sr >= 1.5 ? `${sr.toFixed(1)}× usual` : sr < 0.75 ? `${sr.toFixed(1)}× usual` : null)
    : null;
  const onPlay = lead?.invested > 0 ? fmtUsd(lead.invested) : null;

  if (!lead && !board) return null;

  const bar = noStake
    ? (board?.tone === 'warn' ? VS : C.textSec)
    : (board
      ? (TONE[board.tone] || C.textSec)
      : (trust?.banger ? (TONE[trust.banger.tone] || GREEN) : GOLD_HI));

  const sport = f.sport || lead?.sport || '';

  if (face === 'subscriber') {
    const v = buildVerdict(f, lead, board, sizeBit, boardAbove);
    return (
      <div style={{ marginTop: 18, marginBottom: 16 }}>
        {/* Verdict — the novice reads these two sentences and is done. The
            base text sits back; the live figures inside it carry the light. */}
        {v.who && (
          <div style={{
            fontSize: 15, fontWeight: 480, letterSpacing: '-0.008em',
            color: C.textSec, lineHeight: 1.55, fontFeatureSettings: "'tnum'",
          }}>
            <Runs runs={v.who} />
          </div>
        )}
        {v.boardLine && (
          <div
            title={board?.tip}
            style={{
              marginTop: v.who ? 5 : 0,
              fontSize: 13.5, fontWeight: 450, color: C.textMuted,
              lineHeight: 1.55, fontFeatureSettings: "'tnum'", letterSpacing: '0.002em',
            }}
          >
            <Runs runs={v.boardLine} />
          </div>
        )}

        {/* Résumé — the advanced reader's proof digits, one quiet rail. */}
        {lead && (
          <div style={{
            marginTop: 12,
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 10, flexWrap: 'wrap',
            fontSize: 12.5, fontWeight: 550, color: C.textMuted,
            fontFeatureSettings: "'tnum'",
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap', minWidth: 0 }}>
              <span style={{
                fontSize: 11, fontWeight: 450, color: C.textFaint,
                letterSpacing: '0.01em',
              }}>
                Led by
              </span>
              <span style={{ color: C.textSec, fontWeight: 650, letterSpacing: '0.01em' }}>
                …{lead.short || '————'}
              </span>
              {(trust?.secondary || []).map((s) => (
                <span key={s} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 7 }}>
                  <span style={{ color: C.textFaint, fontWeight: 450, fontSize: 11 }}>·</span>
                  <span style={{ color: C.textSec, fontWeight: 600 }}>{s}</span>
                </span>
              ))}
            </div>
            {trust?.banger ? (
              <span style={{
                fontSize: 13, fontWeight: 700, letterSpacing: '-0.015em',
                color: noStake ? C.textSec : (TONE[trust.banger.tone] || GREEN),
              }}>
                {trust.banger.label}
              </span>
            ) : (() => {
              // Lead has no résumé — surface the best one on our side.
              const bw = bestBangerWallet(f, lead.short);
              if (!bw) return null;
              return (
                <span style={{
                  display: 'inline-flex', alignItems: 'baseline', gap: 6,
                  fontFeatureSettings: "'tnum'",
                }}>
                  <span style={{ fontSize: 10.5, fontWeight: 500, color: C.textFaint }}>
                    …{bw.short || '————'}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 700, letterSpacing: '-0.015em',
                    color: noStake ? C.textSec : (TONE[bw.trust.banger.tone] || GREEN),
                  }}>
                    {bw.trust.banger.label}
                  </span>
                </span>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ marginTop: 16, marginBottom: 14 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
        <div style={{
          width: 3, flexShrink: 0, borderRadius: 2,
          background: bar, minHeight: 44,
        }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Lead sharp — sport-specific Source B trust */}
          {lead && (
            <div style={{ marginBottom: board ? 8 : 0 }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                gap: 10, flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
                  <span style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.12em', color: C.textFaint, textTransform: 'uppercase',
                  }}>
                    {sport ? `${sport} lead` : 'Lead'}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: C.textSec,
                    fontFeatureSettings: "'tnum'", letterSpacing: '0.02em',
                  }}>
                    …{lead.short || '————'}
                  </span>
                  {lead.proven && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                      color: noStake ? C.textMuted : GREEN, textTransform: 'uppercase',
                    }}>
                      Proven
                    </span>
                  )}
                  {provenExtra > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.textFaint }}>
                      +{provenExtra} proven
                    </span>
                  )}
                </div>
                {trust?.banger && (
                  <span style={{
                    fontSize: 15, fontWeight: 750, letterSpacing: '-0.02em',
                    color: noStake ? C.textSec : (TONE[trust.banger.tone] || GREEN),
                    fontFeatureSettings: "'tnum'",
                  }}>
                    {trust.banger.label}
                  </span>
                )}
              </div>

              <div style={{
                marginTop: 4,
                display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                fontSize: 12, fontWeight: 600, color: C.textMuted,
                fontFeatureSettings: "'tnum'",
              }}>
                {(trust?.secondary || []).map((s) => (
                  <span key={s} style={{ color: C.textSec }}>{s}</span>
                ))}
                {(trust?.secondary || []).length > 0 && (onPlay || sizeBit) && (
                  <span style={{ color: C.textFaint }}>·</span>
                )}
                {onPlay && (
                  <span>{onPlay} on this</span>
                )}
                {onPlay && sizeBit && <span style={{ color: C.textFaint }}>·</span>}
                {sizeBit && <span>{sizeBit}</span>}
              </div>
            </div>
          )}

          {/* Board context — never a naked label */}
          {board && (
            <div
              title={board.tip}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap',
                paddingTop: lead ? 8 : 0,
                borderTop: lead ? '1px solid rgba(148,163,184,0.10)' : 'none',
              }}
            >
              <span style={{
                fontSize: 13, fontWeight: 750, letterSpacing: '-0.015em',
                color: TONE[board.tone] || C.text,
              }}>
                {board.label}
              </span>
              {board.detail && (
                <span style={{
                  fontSize: 13, fontWeight: 600, color: C.textSec,
                  fontFeatureSettings: "'tnum'",
                }}>
                  {board.detail}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

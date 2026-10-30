/**
 * The scoreboard. Two piles of tracked dollars.
 * One material per side: solid on the pick, stripes on the other.
 * Both dollar figures are the same size. Crests live here, once.
 */
import TeamCrest, { boardCrestName } from './TeamCrest.jsx';
import { ourSideLabel, sideDollars, theirSideLabel } from './boardFaceLine.js';

const C = {
  text: '#F4F7FB',
  textMuted: '#647089',
};
const GREEN = '#2fd57e';
const VS = '#F07167';
const STRIPES = 'repeating-linear-gradient(135deg, rgba(7,9,18,0.45) 0px, rgba(7,9,18,0.45) 2.5px, transparent 2.5px, transparent 5.5px)';

function fmtUsd(v) {
  const n = Number(v) || 0;
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`;
  }
  return `$${Math.round(n)}`;
}

export default function LockedCollapsedBoard({ f }) {
  if (!f) return null;
  const { ours: oursUsd, theirs: theirsUsd } = sideDollars(f);
  const total = oursUsd + theirsUsd;
  if (total <= 0) return null;

  const end = (which, usd) => {
    const label = which === 'ours' ? ourSideLabel(f) : theirSideLabel(f);
    const crest = boardCrestName(f, which);
    const right = which === 'against';
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, minWidth: 0,
        flexDirection: right ? 'row-reverse' : 'row',
      }}>
        {crest ? <TeamCrest name={crest} sport={f.sport} size={28} /> : null}
        <div style={{ textAlign: right ? 'right' : 'left', minWidth: 0 }}>
          <div style={{
            fontSize: '1.18rem',
            fontWeight: 720,
            letterSpacing: '-0.03em',
            color: C.text,
            fontFeatureSettings: "'tnum'",
            lineHeight: 1,
          }}
          >
            {fmtUsd(usd)}
          </div>
          <div style={{
            marginTop: 4,
            fontSize: 11,
            fontWeight: 600,
            color: C.textMuted,
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}
          >
            {label}
          </div>
        </div>
      </div>
    );
  };

  const bar = (usd, against) => (
    <div
      title={against ? `${fmtUsd(usd)} on ${theirSideLabel(f)}` : `${fmtUsd(usd)} on ${ourSideLabel(f)}`}
      style={{
        flex: `${Math.max(usd, 1)} 1 0px`,
        minWidth: 8,
        height: '100%',
        borderRadius: 6,
        background: against ? VS : GREEN,
        backgroundImage: against ? STRIPES : undefined,
        opacity: against ? 0.92 : 0.88,
      }}
    />
  );

  return (
    <div data-board="score" style={{ marginTop: 18, position: 'relative' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
      }}
      >
        {oursUsd > 0 ? end('ours', oursUsd) : <span />}
        {theirsUsd > 0 ? end('against', theirsUsd) : null}
      </div>
      <div style={{
        display: 'flex', alignItems: 'stretch', height: 12, marginTop: 10,
        gap: oursUsd > 0 && theirsUsd > 0 ? 8 : 0,
      }}
      >
        {oursUsd > 0 ? bar(oursUsd, false) : null}
        {theirsUsd > 0 ? bar(theirsUsd, true) : null}
      </div>
    </div>
  );
}

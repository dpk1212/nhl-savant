/**
 * Confirmed poster. A sweep is one lit crest. A split is two crests
 * meeting on a diagonal, the larger pile in front.
 * Dollars are confirmed winners on this market only.
 */
import TeamCrest, { boardCrestName } from './TeamCrest.jsx';
import { confirmedSplit, ourSideLabel, theirSideLabel } from './boardFaceLine.js';

const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
};

function fmtUsd(v) {
  const n = Number(v) || 0;
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`;
  }
  return `$${Math.round(n)}`;
}

function Mark({ f, which, size, ghost = false, glow = false }) {
  const crest = boardCrestName(f, which);
  const word = which === 'ours' ? ourSideLabel(f) : theirSideLabel(f);
  const plate = crest ? (
    <TeamCrest name={crest} sport={f.sport} size={size} />
  ) : (
    <div style={{
      fontSize: Math.round(size * 0.42),
      fontWeight: 750,
      letterSpacing: '-0.045em',
      lineHeight: 0.9,
      color: ghost ? C.textMuted : C.text,
    }}
    >
      {word}
    </div>
  );
  return (
    <div style={{ position: 'relative', width: crest ? size : undefined, height: crest ? size : undefined }}>
      {glow ? (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: '46%',
            width: size * 1.85,
            height: size * 1.85,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 38%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <div style={ghost ? { filter: 'grayscale(1)', opacity: 0.42 } : { position: 'relative' }}>
        {plate}
      </div>
    </div>
  );
}

function Caption({ usd, team, ghost = false, align = 'left', showTeam = true }) {
  return (
    <div style={{ textAlign: align, marginTop: 8 }}>
      <div style={{
        fontSize: ghost ? '1.05rem' : '1.65rem',
        fontWeight: ghost ? 640 : 750,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        color: ghost ? C.textMuted : C.text,
        fontFeatureSettings: "'tnum'",
      }}
      >
        {usd > 0 ? fmtUsd(usd) : 'none'}
      </div>
      {usd > 0 ? (
        <div style={{
          marginTop: 5,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: C.textSec,
        }}
        >
          confirmed
        </div>
      ) : null}
      {showTeam ? (
        <div style={{
          marginTop: 4,
          fontSize: 12,
          fontWeight: 600,
          color: ghost ? C.textMuted : C.textSec,
          letterSpacing: '0.01em',
        }}
        >
          {team}
        </div>
      ) : null}
    </div>
  );
}

export default function LockedCollapsedBoard({ f }) {
  if (!f) return null;
  const { ours, theirs } = confirmedSplit(f);
  if (ours <= 0 && theirs <= 0) return null;

  const sweep = ours <= 0 || theirs <= 0;
  const oursLabel = ourSideLabel(f);
  const theirsLabel = theirSideLabel(f);

  if (sweep) {
    const oursWon = ours > 0;
    const stack = (side) => (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: side.align === 'right' ? 'flex-end' : 'flex-start',
        position: 'relative',
        zIndex: side.hero ? 1 : 0,
      }}
      >
        <Mark f={f} which={side.which} size={side.hero ? 128 : 42} ghost={!side.hero} glow={side.hero} />
        <Caption usd={side.usd} team={side.team} ghost={!side.hero} align={side.align} showTeam={!!boardCrestName(f, side.which)} />
      </div>
    );
    const left = oursWon
      ? { which: 'ours', usd: ours, team: oursLabel, align: 'left', hero: true }
      : { which: 'ours', usd: 0, team: oursLabel, align: 'left', hero: false };
    const right = oursWon
      ? { which: 'against', usd: 0, team: theirsLabel, align: 'right', hero: false }
      : { which: 'against', usd: theirs, team: theirsLabel, align: 'right', hero: true };
    return (
      <div
        data-board="score"
        data-poster="sweep"
        style={{
          marginTop: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
        }}
      >
        {stack(left)}
        {stack(right)}
      </div>
    );
  }

  const oursFront = ours >= theirs;
  const crest = (which, front) => (
    <div style={{
      position: 'relative',
      zIndex: front ? 2 : 1,
      marginRight: which === 'ours' ? -34 : 0,
      marginLeft: which === 'against' ? -34 : 0,
      transform: front ? 'translateY(-8px)' : 'translateY(14px)',
    }}
    >
      <Mark f={f} which={which} size={front ? 108 : 86} glow={front} />
    </div>
  );

  return (
    <div data-board="score" data-poster="split" style={{ marginTop: 16 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        minHeight: 124,
      }}
      >
        {crest('ours', oursFront)}
        {crest('against', !oursFront)}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 18,
        marginTop: 12,
      }}
      >
        <Caption usd={ours} team={oursLabel} showTeam={!!boardCrestName(f, 'ours')} />
        <Caption usd={theirs} team={theirsLabel} align="right" showTeam={!!boardCrestName(f, 'against')} />
      </div>
    </div>
  );
}

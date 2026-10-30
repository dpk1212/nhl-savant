import { useState } from 'react';
import { getTeamIdentity, teamLogoUrl } from '../../../utils/teamIdentity.js';

/** Light-plate crest. Totals and unknown clubs fall through to a monogram. */
export default function TeamCrest({ name, sport, size = 42, dim = false }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? null : teamLogoUrl(name, sport);
  const id = getTeamIdentity(name, sport);
  const abbr = /^(over|under)$/i.test(String(name || ''))
    ? String(name).slice(0, 1).toUpperCase()
    : (id.abbr && id.abbr !== '?' ? id.abbr : String(sport || '').slice(0, 3));
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: Math.max(6, Math.round(size * 0.26)),
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      opacity: dim ? 0.72 : 1,
      background: src
        ? 'radial-gradient(circle at 50% 42%, #ffffff 0%, #eceae4 72%)'
        : `linear-gradient(145deg, ${id.c1}, ${id.c2})`,
      border: src ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.08)',
      boxShadow: src
        ? (size < 36
          ? '0 2px 6px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.65)'
          : '0 6px 16px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.65)')
        : 'inset 0 1px 0 rgba(255,255,255,0.06)',
    }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={size - 8}
          height={size - 8}
          onError={() => setFailed(true)}
          style={{ width: size - 10, height: size - 10, objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <span style={{
          color: '#fff',
          fontWeight: 800,
          fontSize: Math.max(10, size * 0.28),
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
        >
          {abbr}
        </span>
      )}
    </div>
  );
}

function isTotalPick(f) {
  return /^(over|under)\b/i.test(String(f?.pickLabel || '').trim());
}

/** Full club name for the pick crest. Totals have no club. */
export function pickCrestName(f) {
  if (!f || isTotalPick(f)) return null;
  if (f.side === 'home') return f.home || f.homeShort || null;
  if (f.side === 'away') return f.away || f.awayShort || null;
  return null;
}

/** Full club name for one end of the money scoreboard. */
export function boardCrestName(f, which) {
  if (!f || isTotalPick(f)) return null;
  const oursHome = f.side === 'home';
  const oursAway = f.side === 'away';
  if (!oursHome && !oursAway) return null;
  if (which === 'ours') return oursHome ? (f.home || f.homeShort) : (f.away || f.awayShort);
  return oursHome ? (f.away || f.awayShort) : (f.home || f.homeShort);
}

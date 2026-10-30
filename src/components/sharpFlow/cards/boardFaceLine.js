/**
 * The line under the confirmed poster.
 * A sweep names the side that has the winners. A split names the fight.
 * The résumé is the record plus last-30 proof. It does not restate the
 * dollars already on the poster, and it does not lead with a wallet hash.
 */

function nick(s) {
  const w = String(s || '').trim().split(/\s+/).filter(Boolean);
  return w.length ? w[w.length - 1] : '';
}

export function ourSideLabel(f) {
  const pick = String(f?.pickLabel || '').trim();
  const total = pick.match(/^(Over|Under)\b/i);
  if (total) {
    const w = total[1];
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }
  if (f?.side === 'home') return f.homeShort || nick(f.home) || 'our side';
  if (f?.side === 'away') return f.awayShort || nick(f.away) || 'our side';
  return 'our side';
}

export function theirSideLabel(f) {
  if (f?.against?.abbr) return f.against.abbr;
  const pick = String(f?.pickLabel || '').trim();
  if (/^over\b/i.test(pick)) return 'Under';
  if (/^under\b/i.test(pick)) return 'Over';
  if (f?.side === 'home') return f.awayShort || nick(f.away) || 'other side';
  if (f?.side === 'away') return f.homeShort || nick(f.home) || 'other side';
  return 'other side';
}

/** Confirmed-winner dollars. Same stamp the poster draws. */
export function confirmedSplit(f) {
  const stamped = f?.boardMoneyConfirmed || f?.boardMoney?.confirmed;
  return {
    ours: Math.max(0, Number(stamped?.ours) || 0),
    theirs: Math.max(0, Number(stamped?.theirs) || 0),
  };
}

function onThe(label) {
  if (label === 'our side' || label === 'other side') return label;
  return `the ${label}`;
}

function proofOf(lead) {
  if (!lead) return null;
  const trust = lead.trust || {};
  const record = (trust.secondary || []).find((s) => /^\d+\s*-\s*\d+/.test(String(s)));
  const bits = [];
  if (record) bits.push(record);
  if (trust.banger?.label) bits.push(trust.banger.label);
  return bits.length ? bits.join(', ') : null;
}

/**
 * @returns {{ headline: string|null, proof: string|null, wallet: string|null } | string | null}
 * A string is the muted stand-down. Otherwise headline is the picture's
 * sentence and proof + wallet are the quieter signature.
 */
export function buildBoardFaceLine(f, lead) {
  if (!f) return null;
  const muted = String(f.tapeAction || '').toLowerCase() === 'mute' || !!f.mutedBy;
  const units = Number(f.units) || 0;
  if (muted && !(units > 0)) return 'The system stood this one down.';

  const { ours, theirs } = confirmedSplit(f);
  let headline = null;
  if (ours > 0 && theirs <= 0) {
    headline = `Confirmed winners are on ${onThe(ourSideLabel(f))}.`;
  } else if (theirs > 0 && ours <= 0) {
    headline = `Confirmed winners are on ${onThe(theirSideLabel(f))}.`;
  } else if (ours > 0 && theirs > 0) {
    if (theirs >= ours * 2) headline = `Most of the confirmed money is on ${onThe(theirSideLabel(f))}.`;
    else if (ours >= theirs * 2) headline = `Most of the confirmed money is on ${onThe(ourSideLabel(f))}.`;
    else headline = 'Confirmed on both sides.';
  }

  const proof = proofOf(lead);
  const wallet = lead?.short ? `…${lead.short}` : null;
  if (!headline && !proof && !wallet) return null;
  return { headline, proof, wallet };
}

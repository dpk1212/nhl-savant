/**
 * The line under the locked scoreboard.
 * It follows the picture: a buried side says so, a proven fight says so,
 * and the résumé is the record plus last-30 proof. It does not restate
 * the dollars already printed on the bar, and it does not lead with a wallet hash.
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

/** Same dollars the scoreboard draws. */
export function sideDollars(f) {
  if (!f) return { ours: 0, theirs: 0 };
  let rows = [];
  if (Array.isArray(f.mapWallets) && f.mapWallets.length) rows = f.mapWallets;
  else if (Array.isArray(f.wallets) && f.wallets.length) {
    rows = f.wallets.map((w) => ({ ...w, side: w.side === 'against' ? 'against' : 'ours' }));
  }
  rows = rows.filter((w) => (Number(w?.invested) || 0) > 0);
  if (rows.length) {
    const sum = (side) => rows
      .filter((w) => (side === 'against' ? w.side === 'against' : w.side !== 'against'))
      .reduce((s, w) => s + (Number(w.invested) || 0), 0);
    return { ours: sum('ours'), theirs: sum('against') };
  }
  return {
    ours: Number(f.sharpUsd ?? f.sideInvested) || 0,
    theirs: Number(f.against?.invested) || 0,
  };
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

  const { ours, theirs } = sideDollars(f);
  const mountain = theirs > 0 && theirs >= ours * 2;
  const theirProven = Math.max(0, Number(f.against?.proven) || 0);
  const ourProven = Math.max(0, Number(f.confirmedOnSide) || 0);
  const both = ourProven >= 1 && theirProven >= 1;

  let headline = null;
  if (mountain) {
    headline = `Most of the tracked money is on the ${theirSideLabel(f)}.`;
  } else if (both) {
    headline = 'Proven on both sides.';
  }

  const proof = proofOf(lead);
  const wallet = lead?.short ? `…${lead.short}` : null;
  if (!headline && !proof && !wallet) return null;
  return { headline, proof, wallet };
}

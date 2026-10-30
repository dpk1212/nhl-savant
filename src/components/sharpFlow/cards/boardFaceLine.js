/**
 * One line under the locked scoreboard. It names people.
 * It does not restate the dollars already sitting on the two ends of the bar.
 */
export function buildBoardFaceLine(f, lead) {
  if (!f) return null;
  const muted = String(f.tapeAction || '').toLowerCase() === 'mute' || !!f.mutedBy;
  const units = Number(f.units) || 0;
  if (muted && !(units > 0)) return 'The system stood this one down.';

  const theirProven = Math.max(0, Number(f.against?.proven) || 0);
  const ourProven = Math.max(0, Number(f.confirmedOnSide) || 0);
  const both = ourProven >= 1 && theirProven >= 1;
  const bits = [];
  if (both) bits.push('Proven on both sides.');

  if (lead) {
    const trust = lead.trust || {};
    const tail = [...(trust.secondary || [])];
    if (trust.banger?.label) tail.push(trust.banger.label);
    const detail = tail.filter(Boolean).join(', ');
    if (lead.short || detail) {
      const who = lead.short
        ? `…${lead.short} ${both ? 'leads ours' : 'leads'}`
        : (both ? 'Ours leads' : 'The lead');
      bits.push(detail ? `${who}, ${detail}.` : `${who}.`);
    }
  }

  return bits.length ? bits.join(' ') : null;
}

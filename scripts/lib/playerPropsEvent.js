/**
 * Polymarket MLB player-prop boards are separate events:
 *   slug  mlb-tex-min-2026-09-27-player-props
 *   title "Texas Rangers vs. Minnesota Twins - Player Props"
 * They are not the game. A vs-title parse would still resolve both clubs
 * and steal the game key from the moneyline event.
 */

export function isPlayerPropsEvent(title, slug = '') {
  const s = String(slug || '');
  if (/player-props/i.test(s)) return true;
  return /\bplayer props\b/i.test(String(title || ''));
}

/** "Minnesota Twins - Player Props" → "Minnesota Twins". */
export function stripPlayerPropsSuffix(name) {
  const s = String(name || '').trim();
  if (!s) return s;
  return s.replace(/\s*[-–—:|]\s*player props\s*$/i, '').replace(/\s+/g, ' ').trim();
}

export function cleanStoredTeam(stored, preferred) {
  const raw = String(stored || '').trim();
  if (!raw || !/\bplayer props\b/i.test(raw)) return null;
  const pref = stripPlayerPropsSuffix(preferred);
  if (pref && !/\bplayer props\b/i.test(pref)) return pref;
  const stripped = stripPlayerPropsSuffix(raw);
  return stripped && stripped !== raw ? stripped : null;
}

/**
 * ATP singles moneyline resolution — shared by fetch, scan, grading, and
 * wallet sport classification.
 *
 * Polymarket match events look like:
 *   slug:  atp-passaro-torre-2026-10-12
 *   title: Maia: Francesco Passaro vs Tiago Torres
 *   ML market sportsMarketType "moneyline", outcomes are full player names.
 * Child markets (set winner, game spread, match total) share the event but
 * have longer slugs. This sport is moneyline only — those never attach.
 *
 * Game keys are normalized full names, e.g. "francescopassaro_tiagotorres".
 * Slug tokens (passaro/torre) are opaque and are not the key.
 *
 * Series: Polymarket sports id 45, series 10365. Doubles are a different
 * series (atp-doubles) and are rejected.
 */

const ATP_POLY_BACK_MS = 6 * 3600 * 1000;
const ATP_POLY_FWD_MS = 72 * 3600 * 1000;

const PROP_SLUG = /completed-match|set-winner|first-set|set-total|match-total|set-handicap|game-handicap|handicap|qualify|rankings|winner-tennis|doubles|totals-/i;
const PROP_TITLE = /\b(set\s*\d|first\s+set|set\s+handicap|game\s+spread|game\s+handicap|match\s+o\/u|o\/u|over\/under|total\s+sets|spread|handicap|qualify|rankings|champion|retirement)\b/i;
const MARKET_PREFIX = /^(set\s*\d|first\s+set|set\s+handicap|game\s+spread|game\s+handicap|match|total|over|under|spread)/i;

/** Fold diacritics then strip non-alphanumerics. */
export function normalizePlayerName(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** "G. Perricard" and "Giovanni Perricard" share a last-name key when the first is an initial. */
export function resolveATPPlayer(raw) {
  if (!raw) return null;
  let cleaned = String(raw)
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+,?\s*(jr\.?|sr\.?|ii|iii|iv)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned || PROP_TITLE.test(cleaned)) return null;
  const n = normalizePlayerName(cleaned);
  if (!n || n.length < 3) return null;
  return n;
}

export function makeATPGameKey(a, b) {
  const aa = resolveATPPlayer(a);
  const bb = resolveATPPlayer(b);
  if (!aa || !bb || aa === bb) return null;
  return `${aa}_${bb}`;
}

export function playersMatch(rawA, rawB) {
  const a = resolveATPPlayer(rawA);
  const b = resolveATPPlayer(rawB);
  return !!(a && b && a === b);
}

/**
 * True for a main-match event slug. Drops futures, doubles, and every
 * child market (set winner, totals, handicaps).
 *   ✅ atp-passaro-torre-2026-10-12
 *   ✅ atp-de-minaur-sinner-2026-10-13
 *   ❌ atp-passaro-torre-2026-10-12-match-total-21pt5
 *   ❌ atp-doubles-...
 */
export function isMainATPMatchSlug(slug) {
  const s = String(slug || '').toLowerCase();
  if (!s.startsWith('atp-') || s.startsWith('atp-doubles')) return false;
  if (!/^atp-.+-\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  if (PROP_SLUG.test(s)) return false;
  return true;
}

export function isAtpPolyWindow(startIso, nowMs = Date.now()) {
  const startMs = startIso ? new Date(startIso).getTime() : NaN;
  if (!Number.isFinite(startMs) || !Number.isFinite(nowMs)) return false;
  return startMs >= nowMs - ATP_POLY_BACK_MS && startMs <= nowMs + ATP_POLY_FWD_MS;
}

/**
 * "Maia: Francesco Passaro vs Tiago Torres" → [Francesco Passaro, Tiago Torres]
 * Set / spread / total titles return null.
 */
export function extractATPPlayersFromTitle(title) {
  let t = String(title || '').trim();
  if (!t || PROP_TITLE.test(t)) return null;
  const colon = t.match(/^([^:]{1,48}):\s+(.+)$/);
  if (colon && !MARKET_PREFIX.test(colon[1]) && /\bvs\.?\b/i.test(colon[2])) {
    t = colon[2].trim();
  }
  if (PROP_TITLE.test(t)) return null;
  const m = t.match(/^(.+?)\s+vs\.?\s+(.+?)\s*$/i);
  if (!m) return null;
  const a = m[1].trim().replace(/\s+/g, ' ');
  const b = m[2].trim().replace(/\s+/g, ' ');
  if (a.length < 2 || b.length < 2) return null;
  if (!resolveATPPlayer(a) || !resolveATPPlayer(b)) return null;
  return [a, b];
}

/** Wallet-universe tag. ML match titles and main-match slugs only. */
export function isATPMarketTitle(title, slug = '') {
  if (isMainATPMatchSlug(slug)) return true;
  const s = String(slug || '').toLowerCase();
  if (s.startsWith('atp-') && !isMainATPMatchSlug(s)) return false;
  if (PROP_TITLE.test(title || '')) return false;
  if (/\batp\b/i.test(title || '') && extractATPPlayersFromTitle(title)) return true;
  return false;
}

export function isGradableATPMainML(pos) {
  if (!pos) return false;
  const mt = (pos.marketType || pos.market || 'ml').toString().toLowerCase();
  if (mt && mt !== 'ml' && mt !== 'moneyline' && mt !== 'h2h') return false;
  const slug = pos.slug || pos.eventSlug || '';
  if (slug && !isMainATPMatchSlug(slug) && /^atp-/i.test(slug)) return false;
  const blob = [pos.title, pos.marketTitle, pos.outcome, pos.teamName, pos.team, pos.sideLabel]
    .filter(Boolean).join(' ');
  if (PROP_TITLE.test(blob) && !extractATPPlayersFromTitle(pos.title || '')) return false;
  if (PROP_TITLE.test(pos.title || '')) return false;
  return true;
}

/**
 * Match a position to today's ATP board. Slug wins when it is the main
 * match slug. Titles must name both players. Spreads and totals return null.
 */
export function matchATPPositionTitle(posTitle, todaysGames, slug = '') {
  const games = todaysGames || {};
  const s = String(slug || '').toLowerCase();
  // A set / total / handicap slug must not attach as the match moneyline.
  if (s.startsWith('atp-') && !isMainATPMatchSlug(s)) return null;
  if (isMainATPMatchSlug(slug)) {
    for (const [fullKey, g] of Object.entries(games)) {
      if (!fullKey.startsWith('ATP:')) continue;
      const gSlug = String(g?.eventSlug || g?.slug || '').toLowerCase();
      if (gSlug && gSlug === String(slug).toLowerCase()) {
        return {
          key: fullKey.slice(4),
          sport: 'ATP',
          side: null,
          awayName: g.away,
          homeName: g.home,
        };
      }
    }
  }
  if (PROP_TITLE.test(posTitle || '')) return null;
  const pair = extractATPPlayersFromTitle(posTitle);
  if (!pair) return null;
  const key = makeATPGameKey(pair[0], pair[1]);
  const rev = makeATPGameKey(pair[1], pair[0]);
  if (key && games[`ATP:${key}`]) {
    const g = games[`ATP:${key}`];
    return { key, sport: 'ATP', side: null, awayName: g.away, homeName: g.home };
  }
  if (rev && games[`ATP:${rev}`]) {
    const g = games[`ATP:${rev}`];
    return { key: rev, sport: 'ATP', side: null, awayName: g.away, homeName: g.home };
  }
  return null;
}

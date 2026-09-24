/**
 * Same-day MLB doubleheaders share away_home. Suffix the later game `__2`
 * so Polymarket events, Pinnacle tape, and sharp positions stay on the
 * correct first-pitch.
 *
 * 2026-08-17 Cards–Reds: stl_cin (1:41 ET, reused rainout event) vs
 * stl_cin__2 (6:40 ET).
 */

export const DH_SUFFIX = '__2';
const DH_GAP_MS = 90 * 60 * 1000;

export function baseGameKey(key) {
  return String(key || '').replace(/__2$/, '');
}

export function dhSecondKey(baseKey) {
  return `${baseGameKey(baseKey)}${DH_SUFFIX}`;
}

/** Eastern calendar date of a first pitch. Late West Coast games stay on the ET night. */
export function etDateOf(iso) {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  return new Date(ms).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function etToday(now) {
  return new Date(now).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

/**
 * Two Odds API rows, one matchup. A same-day pair 90+ minutes apart is a
 * doubleheader. The next night (10:11 PM ET → 02:11Z the next calendar day)
 * is not — it must keep the base key and land on its own ET date.
 */
export function preferSlateCommence(current, incoming, now = new Date()) {
  const today = etToday(now);
  const curDay = etDateOf(current);
  const nextDay = etDateOf(incoming);
  if (curDay === today && nextDay !== today) return current;
  if (nextDay === today && curDay !== today) return incoming;
  const curMs = Date.parse(current);
  const nextMs = Date.parse(incoming);
  const nowMs = now.getTime();
  const curFuture = Number.isFinite(curMs) && curMs >= nowMs;
  const nextFuture = Number.isFinite(nextMs) && nextMs >= nowMs;
  if (curFuture && !nextFuture) return current;
  if (nextFuture && !curFuture) return incoming;
  if (!Number.isFinite(curMs)) return incoming;
  if (!Number.isFinite(nextMs)) return current;
  return curMs <= nextMs ? current : incoming;
}

/** First Odds API row for a matchup → base key. Same-day second game → `__2`. */
export function allocateScheduleKey(validSet, commenceMap, sport, baseKey, commence, now = new Date()) {
  const slot = `${sport}:${baseKey}`;
  if (!validSet.has(baseKey)) {
    validSet.add(baseKey);
    if (commence) commenceMap[slot] = commence;
    return baseKey;
  }
  const prev = commenceMap[slot];
  const sameDay = !!(prev && commence && etDateOf(prev) && etDateOf(prev) === etDateOf(commence));
  if (sameDay && isDoubleheaderPair(prev, commence)) {
    const k2 = dhSecondKey(baseKey);
    if (!validSet.has(k2)) validSet.add(k2);
    if (commence && !commenceMap[`${sport}:${k2}`]) commenceMap[`${sport}:${k2}`] = commence;
    return k2;
  }
  if (commence && prev && preferSlateCommence(prev, commence, now) === commence) {
    commenceMap[slot] = commence;
  }
  return baseKey;
}

/** Map a Poly/Kalshi startTime onto the Odds API slot with the closer commence. */
export function pickScheduleKeyByStart(sport, baseKey, eventStart, commenceMap, validSet) {
  const k1 = baseGameKey(baseKey);
  const k2 = dhSecondKey(k1);
  if (!validSet?.has(k2)) return k1;
  const t = eventStart ? Date.parse(eventStart) : NaN;
  const c1 = commenceMap[`${sport}:${k1}`];
  const c2 = commenceMap[`${sport}:${k2}`];
  if (!Number.isFinite(t) || !c1 || !c2) return k1;
  const d1 = Math.abs(t - Date.parse(c1));
  const d2 = Math.abs(t - Date.parse(c2));
  return d2 < d1 ? k2 : k1;
}

/** Prefer the board card whose poly event id equals the position's event. */
export function resolveDoubleheaderMatch(match, pos, polyData) {
  if (!match?.sport || !match.key) return match;
  const sportBucket = polyData?.[match.sport];
  if (!sportBucket || typeof sportBucket !== 'object') return match;
  const k1 = baseGameKey(match.key);
  const k2 = dhSecondKey(k1);
  if (!sportBucket[k2]) return match;

  const posId = pos?.eventId != null && pos.eventId !== '' ? String(pos.eventId) : null;
  if (posId) {
    for (const k of [k1, k2]) {
      const pg = sportBucket[k];
      if (pg && pg.eventId != null && String(pg.eventId) === posId) {
        return k === match.key ? match : { ...match, key: k };
      }
    }
  }

  const posStart = pos?.startTime || pos?.eventStartTime || null;
  const t = posStart ? Date.parse(posStart) : NaN;
  if (!Number.isFinite(t)) return match;
  let best = match.key;
  let bestD = Infinity;
  for (const k of [k1, k2]) {
    const pg = sportBucket[k];
    const c = pg?.polyGameTime || pg?.commence;
    if (!c) continue;
    const d = Math.abs(t - Date.parse(c));
    if (d < bestD) {
      bestD = d;
      best = k;
    }
  }
  return best === match.key ? match : { ...match, key: best };
}

export function isDoubleheaderPair(commenceA, commenceB) {
  const a = Date.parse(commenceA);
  const b = Date.parse(commenceB);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) >= DH_GAP_MS;
}

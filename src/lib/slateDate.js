/**
 * ET calendar-day slate gate.
 * Odds API MMA / some sport endpoints return the next card, not "today".
 */
export function etDateFromIso(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

export function todayEt(now = Date.now()) {
  return new Date(now).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

/**
 * True when commence is today's ET date, or the event already started and
 * is still inside `liveMs` (fight/game in progress that listed yesterday UTC).
 */
export function isOnTodaysEtSlate(commenceIso, {
  now = Date.now(),
  liveMs = 6 * 60 * 60 * 1000,
} = {}) {
  if (!commenceIso) return false;
  const day = etDateFromIso(commenceIso);
  if (day && day === todayEt(now)) return true;
  const t = Date.parse(commenceIso);
  if (!Number.isFinite(t)) return false;
  return t <= now && (now - t) < liveMs;
}

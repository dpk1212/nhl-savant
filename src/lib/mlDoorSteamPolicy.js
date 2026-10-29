/**
 * Moneyline door × steam timing. NHL, NBA, NFL, CFB only.
 * Live from ML_DOOR_STEAM_FROM. Spreads, totals, and every other sport
 * are untouched. Three rules, measured on the graded v12+ book
 * (2026-10-06 through 2026-10-28), prices under +200:
 *
 *   BOOST +1u  favorite, Door-2 margin exactly +1 or +2, timing already_gold.
 *              The 20 tickets already bet would have added +6.1u.
 *   CUT  → 0u  tape exists, timing never, Door-2 margin exactly +1,
 *              odds present and under +200. 18-18, −25.7u on 93.5u.
 *   RESCUE 1u  favorite the press gate zeroed, timing never, Door-2 even
 *              or margin exactly +2. 15-1, +10.6u at 1u.
 *
 * Timing uses the same read as that measurement. A row is steam-on when
 * juice steam is on, or (juice not explicitly off and) the tier is steam
 * or gold and the shorten is at least 3% (last hour or since open). A
 * missing pair of percents on a steam/gold tier fails open to on.
 * Gold is steam-on and (gold confirmed, tier gold, or a 4.5% shorten).
 * already_gold: on at the first tape row and gold at the lock row.
 * never: tape exists, off at the first row and off at the lock row.
 * The lock row is the live snap when this cycle has one, else the T-15
 * row, else the last row. No tape → no action.
 *
 * Door-2 margin is door2For − door2Ag from the ladder result, and only
 * when the ladder actually counted wallets. Margin +3 is not in the
 * boost. Margin +2 with no shorten stays staked. Fades are not cut.
 * The rescue does not override favorite-juice, the press-edge clamp,
 * a fade veto, or an AGS quality veto: the caller passes pressGateMuted
 * only when the mute reason would be press-gate.
 */

export const ML_DOOR_STEAM_FROM = '2026-10-29';
export const ML_DOOR_NEVER_MUTED_BY = 'ml-door-never';
export const ML_DOOR_RESCUE_BY = 'ml-door-rescue';
export const ML_DOOR_STAKE_TIER = 'ML-DOOR';
export const ML_DOOR_MAX_UNITS = 6;

/** Actions are lowercase. The cron must use this, not a capital compare. */
export function mlDoorKind(action) {
  return String(action || '').toLowerCase();
}

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);
const UNCOUNTED = new Set(['no_wallet_details', 'no_wallet_profiles', 'no_wallet_rows']);
const STEAM_PCT = 3;
const GOLD_PCT = 4.5;

function num(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** A live capture with no steam object is a missed read, not "steam off". */
function rowFromLive(liveSnap) {
  if (!liveSnap || typeof liveSnap !== 'object') return null;
  if (liveSnap.steam && typeof liveSnap.steam === 'object') return liveSnap.steam;
  if (liveSnap.gate || liveSnap.tier != null || typeof liveSnap.juiceSteam === 'boolean') {
    return liveSnap;
  }
  return null;
}

/** Matches policySteamOn: juice false is not steam, even on a walk. */
export function mlDoorSteamOn(row) {
  if (!row) return false;
  if (row.juiceSteam === true) return true;
  if (row.juiceSteam === false) return false;
  if (row.tier !== 'steam' && row.tier !== 'gold') return false;
  const lh = num(row.lastHourPct);
  const so = num(row.sinceOpenPct);
  if (lh == null && so == null) return true;
  return (lh != null && lh >= STEAM_PCT) || (so != null && so >= STEAM_PCT);
}

export function mlDoorIsGold(row) {
  if (!mlDoorSteamOn(row)) return false;
  if (row.goldConfirmed === true || row.tier === 'gold') return true;
  const lh = num(row.lastHourPct);
  const so = num(row.sinceOpenPct);
  return Math.max(lh ?? -Infinity, so ?? -Infinity) >= GOLD_PCT;
}

/**
 * already_gold | already_steam | arriving_gold | arriving_steam | faded | never.
 * null when there is no first row to compare against the lock.
 */
export function classifyMlDoorTiming(tapeLog, liveSnap) {
  const rows = Array.isArray(tapeLog) ? tapeLog.filter(Boolean) : [];
  if (rows.length === 0) return null;
  const first = rows.find((r) => r.gate === 'first') || rows[0];
  const live = rowFromLive(liveSnap);
  const t15 = [...rows].reverse().find((r) => r.gate === 't15');
  const lock = live || t15 || rows[rows.length - 1];
  if (!first || !lock) return null;
  const onFirst = mlDoorSteamOn(first);
  const onLock = mlDoorSteamOn(lock);
  const goldLock = mlDoorIsGold(lock);
  if (!onFirst && goldLock) return 'arriving_gold';
  if (!onFirst && onLock) return 'arriving_steam';
  if (onFirst && goldLock) return 'already_gold';
  if (onFirst && onLock) return 'already_steam';
  if (onFirst && !onLock) return 'faded';
  return 'never';
}

function hold(units, extra = {}) {
  return {
    units,
    action: 'skip',
    reason: null,
    mutedBy: null,
    rescuedBy: null,
    timing: extra.timing ?? null,
    margin: extra.margin ?? null,
    unitsPrePolicy: units,
  };
}

/**
 * @returns {{
 *   units: number, action: 'skip'|'hold'|'boost'|'cut'|'rescue',
 *   reason: string|null, mutedBy: string|null, rescuedBy: string|null,
 *   timing: string|null, margin: number|null, unitsPrePolicy: number,
 * }}
 */
export function applyMlDoorSteamPolicy({
  units,
  sport,
  marketType,
  odds,
  pickDate,
  door2For = null,
  door2Ag = null,
  door2Known = false,
  tapeLog = null,
  liveSnap = null,
  pressGateMuted = false,
  manualStake = false,
} = {}) {
  const u = num(units);
  const base = u == null ? 0 : u;
  if (manualStake) return hold(base);
  if (typeof pickDate !== 'string' || pickDate < ML_DOOR_STEAM_FROM) return hold(base);
  if (!SPORTS.has(String(sport || '').toUpperCase())) return hold(base);
  if (String(marketType || '').toUpperCase() !== 'ML') return hold(base);
  if (!door2Known) return hold(base);

  const forN = num(door2For);
  const agN = num(door2Ag);
  if (forN == null || agN == null) return hold(base);
  const margin = forN - agN;
  const timing = classifyMlDoorTiming(tapeLog, liveSnap);
  if (!timing) return hold(base, { margin });

  const price = num(odds);
  const favorite = price != null && price < 0;
  const normal = price != null && price < 200;

  if (timing === 'never' && margin === 1 && normal && base > 0) {
    return {
      units: 0,
      action: 'cut',
      reason: 'ml_door_never: Door-2 margin +1 with steam off at first and at lock, price under +200 → 0u',
      mutedBy: ML_DOOR_NEVER_MUTED_BY,
      rescuedBy: null,
      timing,
      margin,
      unitsPrePolicy: base,
    };
  }

  if (timing === 'already_gold' && favorite && (margin === 1 || margin === 2) && base > 0) {
    const next = Math.min(ML_DOOR_MAX_UNITS, Math.round((base + 1) * 100) / 100);
    if (next > base + 0.001) {
      return {
        units: next,
        action: 'boost',
        reason: `ml_door_boost: favorite, Door-2 margin ${margin > 0 ? '+' : ''}${margin}, already gold → +1u`,
        mutedBy: null,
        rescuedBy: null,
        timing,
        margin,
        unitsPrePolicy: base,
      };
    }
  }

  if (pressGateMuted && base === 0 && timing === 'never' && favorite && (margin === 0 || margin === 2)) {
    return {
      units: 1,
      action: 'rescue',
      reason: `ml_door_rescue: favorite, steam never, Door-2 margin ${margin > 0 ? '+' : ''}${margin}, press gate → 1u`,
      mutedBy: null,
      rescuedBy: ML_DOOR_RESCUE_BY,
      timing,
      margin,
      unitsPrePolicy: base,
    };
  }

  return {
    units: base,
    action: 'hold',
    reason: null,
    mutedBy: null,
    rescuedBy: null,
    timing,
    margin,
    unitsPrePolicy: base,
  };
}

export function mlDoorSteamStamp(policy) {
  if (!policy || policy.action === 'skip') return {};
  return {
    v8_mlDoorAction: policy.action,
    v8_mlDoorReason: policy.reason ?? null,
    v8_mlDoorTiming: policy.timing ?? null,
    v8_mlDoorMargin: policy.margin ?? null,
    v8_unitsPreMlDoor: policy.unitsPrePolicy,
  };
}

export function isMlDoorSteamLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= ML_DOOR_STEAM_FROM;
}

export { UNCOUNTED as ML_DOOR_UNCOUNTED_REASONS };

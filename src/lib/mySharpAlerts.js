/**
 * My Sharp alerts — beta settings and the together / pressing / exiting copy.
 * The sender (scripts/sendMySharpAlerts.mjs) and the account card share this.
 * Delivery is OneSignal external_id for the beta roster. No new OneSignal tag.
 */

export const MY_SHARP_ALERT_CAP = 20;
export const MY_SHARP_ALERT_COLLECTION = 'mySharpAlertBeta';
export const MY_SHARP_ALERT_ROSTER_ID = 'roster';
export const PRESS_RATIO = 1.5;

export const ALERT_OPTIONS = [
  {
    id: 'together',
    title: 'Together',
    blurb: 'Two or more of your sharps are on the same bet.',
  },
  {
    id: 'pressing',
    title: 'Pressing',
    blurb: 'One of your sharps is in for 1.5× their usual, or more.',
  },
  {
    id: 'exiting',
    title: 'Exiting',
    blurb: 'One of your sharps gets out of a bet.',
  },
];

const SIDE_OPP = {
  away: 'home',
  home: 'away',
  over: 'under',
  under: 'over',
  draw: null,
};

export function emptyAlertPrefs() {
  return { together: true, pressing: true, exiting: true };
}

export function readAlertMember(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    together: raw.together === true,
    pressing: raw.pressing === true,
    exiting: raw.exiting === true,
    joinedAt: Number.isFinite(Number(raw.joinedAt)) ? Number(raw.joinedAt) : Date.now(),
  };
}

export function alertSpotsLeft(roster) {
  const cap = Number(roster?.cap) > 0 ? Number(roster.cap) : MY_SHARP_ALERT_CAP;
  const used = roster?.members && typeof roster.members === 'object'
    ? Object.keys(roster.members).length
    : 0;
  return { cap, used, left: Math.max(0, cap - used) };
}

export function fmtStake(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v >= 1000) {
    const k = v / 1000;
    const text = k >= 10 ? String(Math.round(k)) : k.toFixed(1);
    return `$${text}K`;
  }
  return `$${Math.round(v)}`;
}

export function walletLabel(row) {
  const name = typeof row?.name === 'string' ? row.name.replace(/\s+/g, ' ').trim() : '';
  if (name) return name.slice(0, 22);
  const short = String(row?.walletShort || '').toLowerCase().slice(-6);
  return short || 'A sharp';
}

function normMarket(raw) {
  const m = String(raw || '').trim().toUpperCase();
  if (m === 'MONEYLINE') return 'ML';
  if (m === 'SPREADS') return 'SPREAD';
  if (m === 'TOTALS') return 'TOTAL';
  return m;
}

function pickLabel(row) {
  const market = normMarket(row?.marketType);
  const team = row?.team || row?.outcome || 'the side';
  if (market === 'ML') return `${team} ML`;
  if (market === 'SPREAD') return `${team} spread`;
  if (market === 'TOTAL') return `${team} total`;
  return `${team} ${market}`.trim();
}

function matchup(row) {
  const away = row?.away || 'Away';
  const home = row?.home || 'Home';
  return `${away} @ ${home}`;
}

function ticketId(row) {
  const sport = String(row?.sport || '').toUpperCase();
  const gameKey = String(row?.gameKey || '').toLowerCase();
  const market = normMarket(row?.marketType);
  const side = String(row?.side || '').toLowerCase();
  if (!sport || !gameKey || !market || !side) return null;
  return `${sport}|${gameKey}|${market}|${side}`;
}

function clusterId(row) {
  const id = ticketId(row);
  if (!id) return null;
  return id.split('|').slice(0, 3).join('|');
}

function nameList(rows, limit = 3) {
  const ordered = [...rows].sort((a, b) => (Number(b.invested) || 0) - (Number(a.invested) || 0));
  const shown = ordered.slice(0, limit).map((row) => {
    const ratio = Number(row.ratio);
    const pressing = Number.isFinite(ratio) && ratio >= PRESS_RATIO;
    const money = fmtStake(row.invested);
    const bits = [walletLabel(row)];
    if (pressing) bits.push(`${ratio.toFixed(1)}×`);
    if (money && pressing) bits.push(money);
    return bits.join(' ');
  });
  const extra = ordered.length - shown.length;
  if (extra > 0) shown.push(`${extra} more`);
  return shown.join(', ');
}

/**
 * One user's open rows and fresh exits → the pushes we still owe them.
 * Together covers a ticket that is also pressing, so both switches don't
 * double-ping the same bet. Pressing still fires on its own when together
 * is off, or when only one sharp is on the bet.
 */
export function planMySharpAlerts({ prefs, rows = [], exits = [] } = {}) {
  const alerts = [];
  const togetherOn = prefs?.together === true;
  const pressingOn = prefs?.pressing === true;
  const exitingOn = prefs?.exiting === true;

  const byTicket = new Map();
  const byCluster = new Map();
  for (const row of rows) {
    const id = ticketId(row);
    const cluster = clusterId(row);
    if (!id || !cluster) continue;
    if (!byTicket.has(id)) byTicket.set(id, []);
    byTicket.get(id).push(row);
    if (!byCluster.has(cluster)) byCluster.set(cluster, []);
    byCluster.get(cluster).push(row);
  }

  for (const [id, list] of byTicket) {
    const shorts = [...new Set(list.map((r) => r.walletShort).filter(Boolean))];
    const first = list[0];
    const opp = SIDE_OPP[String(first.side || '').toLowerCase()] ?? null;
    const cluster = byCluster.get(clusterId(first)) || [];
    const split = opp
      ? cluster.some((r) => String(r.side || '').toLowerCase() === opp)
      : false;
    const together = shorts.length >= 2 && !split;
    const presses = list.filter((r) => Number(r.ratio) >= PRESS_RATIO);
    const pick = pickLabel(first);
    const game = matchup(first);

    if (together && togetherOn) {
      const pressBit = presses.length
        ? ` ${presses.length} pressing: ${nameList(presses)}.`
        : '';
      alerts.push({
        reason: 'together',
        stamp: `together:${id}`,
        heading: 'Your sharps · Together',
        body: `${shorts.length} of your sharps are together on ${pick} — ${game}.${pressBit}`,
        gameKey: first.gameKey,
      });
      continue;
    }

    if (pressingOn && presses.length) {
      const lead = [...presses].sort((a, b) => (Number(b.ratio) || 0) - (Number(a.ratio) || 0))[0];
      const money = fmtStake(lead.invested);
      const moneyBit = money ? ` (${money})` : '';
      const body = presses.length === 1
        ? `${walletLabel(lead)} is pressing ${pick} ${Number(lead.ratio).toFixed(1)}×${moneyBit} — ${game}.`
        : `${presses.length} of your sharps are pressing ${pick} — ${game}. ${nameList(presses)}.`;
      alerts.push({
        reason: 'pressing',
        stamp: `pressing:${id}`,
        heading: 'Your sharps · Pressing',
        body,
        gameKey: first.gameKey,
      });
    }
  }

  if (exitingOn) {
    for (const row of exits) {
      const id = ticketId(row);
      const short = row.walletShort;
      if (!id || !short) continue;
      alerts.push({
        reason: 'exiting',
        stamp: `exiting:${id}:${short}`,
        heading: 'Your sharps · Exited',
        body: `${walletLabel(row)} exited ${pickLabel(row)} — ${matchup(row)}.`,
        gameKey: row.gameKey,
      });
    }
  }

  return alerts;
}

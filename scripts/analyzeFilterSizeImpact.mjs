/**
 * Filter & size impact — Policy T (2026-08-31) and the Aug 19–Sep 5 overlay stack.
 *
 *   node scripts/analyzeFilterSizeImpact.mjs
 *
 * Reads public Firestore (sharpFlowPicks / Spreads / Totals). Same live-book
 * definition as dailyAgsUReport.js: AGS-U promoted, COMPLETED, WIN/LOSS,
 * live = finalUnits > 0 and result.tracked !== true.
 *
 * Writes:
 *   /opt/cursor/artifacts/filter_size_impact.json
 *   /opt/cursor/artifacts/filter_size_impact_summary.md
 */
import { writeFileSync, mkdirSync } from 'fs';

const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const T_FROM = '2026-08-31';
const STEAM_FROM = '2026-08-19';
const CLIMATE_FROM = '2026-08-29';
const FAV_FROM = '2026-09-05';
const V12_FROM = '2026-06-01';

function decodeValue(v) {
  if (v == null || typeof v !== 'object') return v;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) return decodeMap(v.mapValue?.fields || {});
  if ('arrayValue' in v) return (v.arrayValue?.values || []).map(decodeValue);
  return v;
}
function decodeMap(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields || {})) out[k] = decodeValue(v);
  return out;
}

async function listCollection(col) {
  const docs = [];
  let pageToken = '';
  for (;;) {
    const u = new URL(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${col}`);
    u.searchParams.set('pageSize', '300');
    if (pageToken) u.searchParams.set('pageToken', pageToken);
    const res = await fetch(u);
    if (!res.ok) throw new Error(`${col} ${res.status} ${await res.text()}`);
    const body = await res.json();
    for (const d of body.documents || []) {
      docs.push({
        id: String(d.name || '').split('/').pop(),
        ...decodeMap(d.fields || {}),
      });
    }
    pageToken = body.nextPageToken || '';
    if (!pageToken) break;
  }
  return docs;
}

function isAgsu(tag) {
  return typeof tag === 'string' && tag.startsWith('ags-unified-v');
}

function unitBand(u) {
  const x = Number(u) || 0;
  if (x <= 0) return '0u';
  if (x < 1.25) return '≤1u';
  if (x < 3.5) return '2–3u';
  if (x < 4.75) return '4u';
  if (x < 5.35) return '5u';
  if (x < 5.9) return '5.4u';
  return '6u';
}

function wilson(w, n, z = 1.96) {
  if (!(n > 0)) return null;
  const p = w / n;
  const z2 = z * z;
  const den = 1 + z2 / n;
  const mid = p + z2 / (2 * n);
  const half = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return {
    lo: Math.max(0, (mid - half) / den),
    hi: Math.min(1, (mid + half) / den),
  };
}

function agg(rows) {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  const days = new Set();
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += r.units || 0;
    pnl += Number.isFinite(r.profit) ? r.profit : 0;
    if (r.won === 1) w++;
    else if (r.won === 0) l++;
    if (r.date) days.add(r.date);
  }
  const wr = n ? w / n : null;
  const ci = wilson(w, n);
  const dayN = days.size || 0;
  return {
    n, w, l, stake: +stake.toFixed(2), pnl: +pnl.toFixed(2),
    wr, wrPct: wr != null ? +(wr * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
    days: dayN,
    perDay: dayN ? +(n / dayN).toFixed(2) : null,
    pnlPerDay: dayN ? +(pnl / dayN).toFixed(2) : null,
    uPerTicket: n ? +(stake / n).toFixed(2) : null,
  };
}

function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wrPct == null ? '—' : `${a.wrPct}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n} · ${a.w}-${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi}`;
}

function groupCount(rows, keyFn) {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r) || '(none)';
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r);
  }
  return [...m.entries()]
    .map(([k, v]) => ({ key: k, ...agg(v) }))
    .sort((a, b) => b.n - a.n);
}

function windowOf(rows, lo, hiIncl) {
  return rows.filter((r) => r.date >= lo && r.date <= hiIncl);
}

function dailyBoard(rows) {
  const by = new Map();
  for (const r of rows) {
    if (!by.has(r.date)) by.set(r.date, { live: [], muted: [] });
    const bucket = r.live ? 'live' : 'muted';
    by.get(r.date)[bucket].push(r);
  }
  return [...by.keys()].sort().map((date) => {
    const live = agg(by.get(date).live);
    const muted = agg(by.get(date).muted);
    return {
      date,
      evaluated: by.get(date).live.length + by.get(date).muted.length,
      live: live.n,
      muted: muted.n,
      w: live.w,
      l: live.l,
      wrPct: live.wrPct,
      stake: live.stake,
      pnl: live.pnl,
      roi: live.roi,
    };
  });
}

function extractSides(doc, market) {
  const out = [];
  const sides = doc.sides || {};
  for (const [sideKey, sd] of Object.entries(sides)) {
    if (!sd || typeof sd !== 'object') continue;
    if (sd.superseded) continue;
    if (!isAgsu(sd.promotedBy)) continue;
    const date = doc.date;
    if (!date || date < V12_FROM) continue;
    const lock = sd.lock || {};
    const peak = sd.peak || lock;
    const status = sd.status || doc.status;
    const res = sd.result || {};
    const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0) || 0;
    const outcome = res.outcome || null;
    const won = outcome === 'WIN' ? 1 : outcome === 'LOSS' ? 0 : null;
    const odds = Number(peak.odds || lock.odds || 0) || 0;
    const computedProfit = won == null
      ? null
      : (won ? (odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100)) : -units);
    const profit = Number.isFinite(res.profit) ? res.profit : computedProfit;
    const tracked = res.tracked === true || units === 0;
    const live = status === 'COMPLETED' && won != null && !tracked && units > 0;
    const mutedGraded = status === 'COMPLETED' && won != null && (tracked || units === 0);
    out.push({
      docId: doc.id,
      date,
      sport: doc.sport || 'NHL',
      market,
      sideKey,
      team: sd.team || sideKey,
      status,
      outcome,
      won,
      units,
      profit: Number.isFinite(profit) ? profit : null,
      tracked: res.tracked === true,
      live,
      mutedGraded,
      pending: status !== 'COMPLETED' || (status === 'COMPLETED' && !outcome),
      odds,
      path: sd.v8_hcStakeTier || null,
      tapeAction: sd.v8_tapeAction || null,
      qConvAction: sd.v8_qConvAction || null,
      mutedBy: sd.mutedBy || null,
      steamTailAction: sd.v8_steamTailAction || null,
      steamTailReason: sd.v8_steamTailReason || null,
      steamArriving: sd.v8_steamTailArriving ?? sd.v8_steamArriving ?? null,
      steamOnLock: sd.v8_steamTailOnLock ?? sd.v8_steamOnLock ?? null,
      sharpAB: sd.v8_steamTailSharpAB ?? null,
      favJuiceAction: sd.v8_favJuiceAction || null,
      climateColor: sd.v8_climateColor || null,
      climateAction: sd.v8_climateAction || null,
      sportUnlock: sd.v8_sportUnlockAction || null,
      unitsPreTape: Number.isFinite(sd.v8_unitsPreTape) ? sd.v8_unitsPreTape : null,
      unitsPreQConv: Number.isFinite(sd.v8_unitsPreQConv) ? sd.v8_unitsPreQConv : null,
      unitsPreSteam: Number.isFinite(Number(sd.v8_unitsPreSteamTail)) ? Number(sd.v8_unitsPreSteamTail) : null,
      band: unitBand(units),
    });
  }
  return out;
}

function markdownTable(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

const all = [];
for (const [col, market] of COLS) {
  process.stderr.write(`fetch ${col}…\n`);
  const docs = await listCollection(col);
  process.stderr.write(`  ${docs.length} docs\n`);
  for (const doc of docs) all.push(...extractSides(doc, market));
}

const graded = all.filter((r) => r.won != null);
const live = graded.filter((r) => r.live);
const muted = graded.filter((r) => r.mutedGraded);
const pendingLive = all.filter((r) => r.pending && r.units > 0);

const eras = {
  v12_pre_steam: windowOf(live, V12_FROM, '2026-08-18'),
  steam_pre_T: windowOf(live, STEAM_FROM, '2026-08-30'),
  climate_pre_T: windowOf(live, CLIMATE_FROM, '2026-08-30'),
  post_T: windowOf(live, T_FROM, '2099-01-01'),
  t_pre_fav: windowOf(live, T_FROM, '2026-09-04'),
  t_plus_fav: windowOf(live, FAV_FROM, '2099-01-01'),
  last8_pre_T: windowOf(live, '2026-08-23', '2026-08-30'),
};

const mutedPost = windowOf(muted, T_FROM, '2099-01-01');
const mutedPre = windowOf(muted, STEAM_FROM, '2026-08-30');
function americanProfit(won, units, odds) {
  if (won == null || !(units > 0)) return 0;
  if (won) return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
  return -units;
}
function muteCf(rows) {
  const tickets = rows.map((r) => {
    const pre = (Number(r.unitsPreSteam) > 0 ? r.unitsPreSteam : null)
      ?? (Number(r.unitsPreQConv) > 0 ? r.unitsPreQConv : null)
      ?? (Number(r.unitsPreTape) > 0 ? r.unitsPreTape : null)
      ?? 1;
    const cf = americanProfit(r.won, pre, r.odds);
    return {
      date: r.date, sport: r.sport, market: r.market, team: r.team,
      path: r.path, reason: r.steamTailReason || r.mutedBy,
      pre, odds: r.odds, outcome: r.outcome, cf: +cf.toFixed(2),
    };
  });
  const stake = tickets.reduce((s, t) => s + t.pre, 0);
  const pnl = tickets.reduce((s, t) => s + t.cf, 0);
  const w = tickets.filter((t) => t.outcome === 'WIN').length;
  const l = tickets.filter((t) => t.outcome === 'LOSS').length;
  return {
    n: tickets.length, w, l, stake: +stake.toFixed(2), pnl: +pnl.toFixed(2),
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
    tickets: tickets.sort((a, b) => b.pre - a.pre || a.date.localeCompare(b.date)),
  };
}
const steamMutedPost = mutedPost.filter((r) => r.mutedBy === 'steam-tail');
const favMutedPost = mutedPost.filter((r) => r.mutedBy === 'fav-juice');
const steamCf = muteCf(steamMutedPost);
const steamCfByReason = {};
for (const reason of [...new Set(steamMutedPost.map((r) => r.steamTailReason || '(none)'))]) {
  steamCfByReason[reason] = muteCf(steamMutedPost.filter((r) => (r.steamTailReason || '(none)') === reason));
}
const favCf = muteCf(favMutedPost);
const evCf = muteCf(mutedPost.filter((r) => r.mutedBy === 'ev-drift-edge'));
const topCf = muteCf(mutedPost.filter((r) => r.mutedBy === 'top-crowded'));

const dailyLive = dailyBoard(graded.filter((r) => r.date >= STEAM_FROM));

const payload = {
  generatedAt: new Date().toISOString(),
  source: 'public Firestore nhl-savant sharpFlow*',
  nSides: all.length,
  nGraded: graded.length,
  nLive: live.length,
  nMuted: muted.length,
  nPendingLive: pendingLive.length,
  eras: Object.fromEntries(Object.entries(eras).map(([k, v]) => [k, { ...agg(v), sample: v.slice(0, 3).map((r) => r.docId) }])),
  postT: {
    live: agg(eras.post_T),
    byBand: groupCount(eras.post_T, (r) => r.band),
    byPath: groupCount(eras.post_T, (r) => r.path),
    bySport: groupCount(eras.post_T, (r) => r.sport),
    byMarket: groupCount(eras.post_T, (r) => r.market),
    byTape: groupCount(eras.post_T, (r) => r.tapeAction),
    bySteamAction: groupCount(eras.post_T, (r) => r.steamTailAction),
    byMutedByOnLive: groupCount(eras.post_T, (r) => r.mutedBy),
    tickets: eras.post_T
      .slice()
      .sort((a, b) => (a.date + a.sport + a.team).localeCompare(b.date + b.sport + b.team))
      .map((r) => ({
        date: r.date, sport: r.sport, market: r.market, team: r.team,
        units: r.units, odds: r.odds, path: r.path, outcome: r.outcome,
        profit: r.profit, mutedBy: r.mutedBy, steam: r.steamTailAction,
        tape: r.tapeAction, band: r.band,
      })),
  },
  preT: {
    live: agg(eras.steam_pre_T),
    byBand: groupCount(eras.steam_pre_T, (r) => r.band),
    byPath: groupCount(eras.steam_pre_T, (r) => r.path),
    bySport: groupCount(eras.steam_pre_T, (r) => r.sport),
  },
  mutes: {
    postT: {
      all: agg(mutedPost),
      byMutedBy: groupCount(mutedPost, (r) => r.mutedBy),
      steamTail: { ...agg(steamMutedPost), byReason: groupCount(steamMutedPost, (r) => r.steamTailReason), cf: steamCf, cfByReason: steamCfByReason },
      favJuice: { ...agg(favMutedPost), cf: favCf },
      evDrift: evCf,
      topCrowded: topCf,
    },
    steamWindowPreT: {
      all: agg(mutedPre),
      byMutedBy: groupCount(mutedPre, (r) => r.mutedBy),
    },
  },
  pendingLive: pendingLive.map((r) => ({
    date: r.date, sport: r.sport, market: r.market, team: r.team,
    units: r.units, path: r.path, mutedBy: r.mutedBy, steam: r.steamTailAction,
  })),
  daily: dailyLive,
};

mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/filter_size_impact.json', JSON.stringify(payload, null, 2));

const lines = [];
const a = (label, rows) => `${label}: ${fmt(agg(rows))}`;
lines.push('# Filter/size impact — machine summary');
lines.push(`Generated ${payload.generatedAt}`);
lines.push('');
lines.push('## Era live books');
for (const [k, v] of Object.entries(payload.eras)) {
  lines.push(`- **${k}**: ${fmt(v)} · ${v.perDay}/day · ${v.pnlPerDay}u/day · ${v.uPerTicket}u/ticket · ${v.days} days`);
}
lines.push('');
lines.push('## Post-T by unit band');
for (const r of payload.postT.byBand) lines.push(`- ${r.key}: ${fmt(r)}`);
lines.push('');
lines.push('## Post-T by path');
for (const r of payload.postT.byPath) lines.push(`- ${r.key}: ${fmt(r)}`);
lines.push('');
lines.push('## Post-T by sport');
for (const r of payload.postT.bySport) lines.push(`- ${r.key}: ${fmt(r)}`);
lines.push('');
lines.push('## Post-T mutes by mutedBy');
for (const r of payload.mutes.postT.byMutedBy) lines.push(`- ${r.key}: ${fmt(r)} (CF 1u not applied — this is graded muted W-L at 0u)`);
lines.push('');
lines.push('## Steam-tail muted reasons');
for (const r of payload.mutes.postT.steamTail.byReason) lines.push(`- ${r.key}: ${fmt(r)}`);
lines.push('');
lines.push('## Steam-tail mute CF (pre-policy units)');
lines.push(`- all: ${steamCf.n} · ${steamCf.w}-${steamCf.l} · ${steamCf.stake}u · ${steamCf.pnl >= 0 ? '+' : ''}${steamCf.pnl}u · ${steamCf.roi}%`);
for (const [k, v] of Object.entries(steamCfByReason)) {
  lines.push(`- ${k}: ${v.n} · ${v.w}-${v.l} · ${v.stake}u · ${v.pnl >= 0 ? '+' : ''}${v.pnl}u · ${v.roi}%`);
  for (const t of v.tickets.filter((x) => x.pre >= 4).slice(0, 12)) {
    lines.push(`  - ${t.date} ${t.sport} ${t.team} pre ${t.pre}u ${t.odds} ${t.outcome} CF ${t.cf >= 0 ? '+' : ''}${t.cf}`);
  }
}
lines.push(`- fav-juice CF: ${favCf.n} · ${favCf.w}-${favCf.l} · ${favCf.stake}u · ${favCf.pnl >= 0 ? '+' : ''}${favCf.pnl}u`);
lines.push(`- ev-drift CF: ${evCf.n} · ${evCf.w}-${evCf.l} · ${evCf.stake}u · ${evCf.pnl >= 0 ? '+' : ''}${evCf.pnl}u`);
lines.push(`- top-crowded CF: ${topCf.n} · ${topCf.w}-${topCf.l} · ${topCf.stake}u · ${topCf.pnl >= 0 ? '+' : ''}${topCf.pnl}u`);
lines.push('');
lines.push('## Daily live (steam-from)');
lines.push(markdownTable(
  ['Date', 'Live', 'W-L', 'WR', 'Stake', 'PnL', 'ROI'],
  payload.daily.filter((d) => d.live > 0).map((d) => [
    d.date, String(d.live), `${d.w}-${d.l}`, d.wrPct == null ? '—' : `${d.wrPct}%`,
    d.stake.toFixed(1), (d.pnl >= 0 ? '+' : '') + d.pnl.toFixed(2),
    d.roi == null ? '—' : `${d.roi >= 0 ? '+' : ''}${d.roi}%`,
  ]),
));
lines.push('');
lines.push(`Pending live tickets: ${pendingLive.length}`);
writeFileSync('/opt/cursor/artifacts/filter_size_impact_summary.md', lines.join('\n'));
console.log(lines.join('\n'));
console.error(`wrote artifacts · live ${live.length} muted ${muted.length} pendingLive ${pendingLive.length}`);

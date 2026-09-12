/**
 * Unit-tier + steam/EV cut scoreboard.
 *
 *   node scripts/analyzeUnitTierSteamBook.mjs
 *
 * Public Firestore AGSU sides (staked + muted). Re-run as the tape log grows.
 * Writes stdout + /opt/cursor/artifacts/unit_tier_steam_scoreboard.{md,json}
 */
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { analyzeTicketTapeLog } from '../src/lib/ticketTapeCapture.js';
import { agsV12UnitTierFromUnits, AGS_V12_UNIT_TIERS } from '../src/lib/ags.js';
import { steamTailBand } from '../src/lib/steamTailPolicy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const CUTS = {
  'steam-tail': { phase: 'T Aug31', live: '2026-08-31', what: '≤1u junk; unconfirmed 4u/fat' },
  'believed-cut': { phase: 'leftover Aug19', live: '2026-08-19', what: 'sub-4 believed-then-cut' },
  'fail-open-sub4': { phase: 'leftover Aug19', live: '2026-08-19', what: 'sub-4 FAIL_OPEN' },
  'maxsr-sub4': { phase: 'T-era Aug20', live: '2026-08-20', what: 'sub-4 maxSR < 1' },
  'no-confirmed': { phase: 'T-era', live: '2026-08-20', what: 'zero CONFIRMED on FOR' },
  'top-crowded': { phase: 'T-era Aug26', live: '2026-08-26', what: 'TOP crowded conviction' },
  'ev-drift-edge': { phase: 'T-era Aug26', live: '2026-08-26', what: 'EDGE≥15 and Ev faded' },
  'fav-juice': { phase: 'Sep5', live: '2026-09-05', what: 'favorites juicier than −375' },
  'ev-lt2-no-steam': { phase: 'Sep11 overlay', live: '2026-09-11', what: 'live EV < −2, no steam' },
  'tape-weak': { phase: 'pre-steam', live: '2026-07-20', what: 'tape score < 0' },
  'qconv-q1': { phase: 'pre-steam', live: '2026-08-03', what: 'qConv Q1 Path C' },
  'fools-gold-flat': { phase: 'pre-steam', live: '2026-08-05', what: 'best FOR is FLAT' },
  'winner_align_fade': { phase: 'pre-steam', live: null, what: 'winner-align fade' },
  'ags-quality-veto': { phase: 'AGS gate', live: null, what: 'v12 quality veto' },
  'muted-unstamped': { phase: 'pre-stamp / other', live: null, what: '0u with no mutedBy' },
};

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
    u.searchParams.set('pageSize', '100');
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

function num(x) {
  if (x == null || x === '') return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function firstPositive(...vals) {
  for (const v of vals) {
    const n = num(v);
    if (n != null && n > 0) return n;
  }
  return 0;
}

function profitAt(odds, units, won) {
  if (!(units > 0) || won == null) return 0;
  if (!won) return -units;
  if (!Number.isFinite(odds) || odds === 0) return 0;
  return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
}

export function fmt(rows, { unitsKey = 'units', pnlKey = 'profit' } = {}) {
  let w = 0, l = 0, stake = 0, pnl = 0, pending = 0;
  for (const r of rows) {
    if (r.won == null) { pending++; continue; }
    if (r.won) w++;
    else l++;
    stake += r[unitsKey] || 0;
    pnl += r[pnlKey] || 0;
  }
  const n = w + l;
  const wr = n ? (100 * w / n) : 0;
  const roi = stake ? (100 * pnl / stake) : 0;
  return { n, w, l, pending, wr, pnl, stake, roi };
}

function line(label, rows, opts) {
  const a = fmt(rows, opts);
  if (!a.n && !a.pending) return `${label.padEnd(28)}  —`;
  return `${String(label).padEnd(28)} ${String(a.n).padStart(4)}  ${String(a.w).padStart(3)}-${String(a.l).padEnd(3)}  ${a.wr.toFixed(1).padStart(5)}%  ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1).padStart(7)}u  roi=${a.roi.toFixed(1).padStart(6)}%  stake=${a.stake.toFixed(1)}`;
}

function collectRows(packs) {
  const rows = [];
  for (const { mkt, docs } of packs) {
    for (const data of docs) {
      const sides = data.sides;
      if (!sides || typeof sides !== 'object') continue;
      const date = String(data.date || '');
      const sport = data.sport || '?';
      for (const [side, sd] of Object.entries(sides)) {
        if (!sd || sd.superseded) continue;
        if (!isAgsu(sd.promotedBy)) continue;
        const res = sd.result || data.result || {};
        if (res.tracked === true && !(sd.mutedBy || (num(sd.finalUnits) || 0) <= 0)) continue;
        const outcome = res.outcome;
        const won = outcome === 'WIN' ? true : outcome === 'LOSS' ? false : null;
        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        let actual = num(sd.finalUnits);
        if (actual == null) actual = num(sd.v8_agsUnitsApplied);
        if (actual == null) actual = num(peak.units) || 0;
        const odds = num(peak.odds) ?? num(lock.odds);
        let profit = num(res.profit);
        if (profit == null && won != null && actual > 0) profit = profitAt(odds, actual, won);
        if (profit == null) profit = 0;
        const tape = analyzeTicketTapeLog(sd.v8_ticketTapeLog || sd.ticketTapeLog || []);
        const incoming = firstPositive(
          sd.v8_unitsPreUnitTierEvSteam,
          actual > 0 ? actual : 0,
          sd.v8_unitsPreFavJuice,
          sd.v8_unitsPreSteamTail,
          sd.v8_unitsPreClimate,
          sd.v8_unitsPreEvDrift,
          sd.v8_unitsPreTopCrowded,
          sd.v8_unitsPreNoConfirmed,
          sd.v8_unitsPreMaxSrSub4,
          sd.v8_unitsPreFlinchFailOpen,
          sd.v8_unitsPreTape,
          peak.units,
          lock.units,
        );
        const muted = actual <= 0;
        const cfProfit = won == null ? 0 : profitAt(odds, incoming, won);
        rows.push({
          date,
          sport,
          mkt,
          team: sd.team || side,
          units: actual,
          incoming,
          odds,
          won,
          profit: muted ? 0 : profit,
          cfProfit,
          muted,
          mutedBy: sd.mutedBy || (muted ? 'muted-unstamped' : null),
          lockTier: sd.v8_lockTier || sd.v8_agsV12Tier || null,
          path: sd.v8_hcStakeTier || null,
          tile: agsV12UnitTierFromUnits(actual),
          inTile: agsV12UnitTierFromUnits(incoming),
          band: steamTailBand(actual),
          inBand: steamTailBand(incoming),
          hasLog: tape.n > 0,
          steamOn: !!tape.steamOnLock,
          arriving: !!(tape.n && !tape.steamOnFirst && tape.steamOnLock),
          evLock: tape.evLock,
          lastHour: tape.lastHourLock,
          steamTailAction: sd.v8_steamTailAction || null,
          steamTailReason: sd.v8_steamTailReason || null,
          unitTierAction: sd.v8_unitTierEvSteamAction || null,
          q1: !!sd.v8_confirmedQ1Promote,
          unopp: !!sd.v8_confirmedUnoppPromote,
        });
      }
    }
  }
  return rows;
}

function section(outPush, title) {
  outPush('');
  outPush(`## ${title}`);
  outPush('');
}

export function cutWorking(a) {
  if (a.n < 8) {
    if (a.n >= 5 && a.wr >= 70 && a.pnl > 10) return 'WATCH — muted pile is winning (thin n)';
    return 'thin — keep logging';
  }
  if (a.wr <= 50 && a.pnl <= 0) return 'WORKING — cut is trash';
  if (a.pnl < -3) return 'WORKING — cut leaks units';
  if (a.wr >= 62 && a.pnl > 3) return 'WATCH — muted pile is winning';
  if (a.wr >= 56) return 'WATCH — muted WR is healthy';
  return 'hold — mixed';
}

export function promoteRead(a) {
  if (a.n < 8) return 'thin — keep logging';
  if (a.pnl > 5 && a.wr >= 55) return 'WORKING — promote is +';
  if (a.pnl < -3) return 'WATCH — promote is leaking';
  return 'hold — mixed';
}

function ticketLine(r) {
  const wl = r.won == null ? 'pend' : r.won ? 'W' : 'L';
  const pnl = r.muted ? r.cfProfit : r.profit;
  const sign = pnl >= 0 ? '+' : '';
  const mute = r.muted ? ` mutedBy=${r.mutedBy || '—'}` : '';
  return `  ${r.date} ${r.sport} ${r.team} in=${r.incoming} ship=${r.units} ${r.lockTier || '—'}/${r.path || '—'} arr=${r.arriving ? 'Y' : 'N'} ev=${r.evLock ?? '—'} lh=${r.lastHour ?? '—'} ${wl} ${sign}${pnl.toFixed(1)}${mute}`;
}

function handleLine(label, rows, opts, extra = '') {
  const a = fmt(rows, opts);
  const tag = extra || cutWorking(a);
  return `${line(label, rows, opts)}  ${tag}`;
}

async function main() {
  console.log('Fetching Firestore…');
  const packs = [];
  for (const [col, mkt] of COLS) {
    const docs = await listCollection(col);
    console.log(`  ${col}: ${docs.length}`);
    packs.push({ mkt, docs });
  }
  const rows = collectRows(packs);
  const t = rows.filter((r) => r.date >= '2026-08-31');
  const steam = rows.filter((r) => r.date >= '2026-08-19');
  const shipped = t.filter((r) => !r.muted);
  const muted = t.filter((r) => r.muted);
  const shippedG = shipped.filter((r) => r.won != null);
  const tape = t.filter((r) => r.hasLog);

  const out = [];
  const push = (s = '') => { out.push(s); console.log(s); };

  const tileOrder = ['MAX', 'TOP', 'STRONG', 'MID', 'LEAN'];
  const cf = { unitsKey: 'incoming', pnlKey: 'cfProfit' };
  const mutedG = muted.filter((r) => r.won != null && r.incoming > 0);
  const steamShip = steam.filter((r) => !r.muted && r.won != null);
  const steamTail = mutedG.filter((r) => r.mutedBy === 'steam-tail');
  const promoAll = t.filter((r) => r.unitTierAction === 'PROMOTE' && r.won != null);
  const promoShip = promoAll.filter((r) => !r.muted);
  const promoThenMute = promoAll.filter((r) => r.muted);
  const tailFloor = t.filter((r) => r.steamTailAction === 'FLOOR' && r.won != null);
  const tailBoost = t.filter((r) => r.steamTailAction === 'BOOST' && r.won != null);
  const q1 = t.filter((r) => r.q1 && !r.muted && r.won != null);
  const tShip = shipped.filter((r) => r.date >= '2026-08-31');
  const strong = shippedG.filter((r) => r.tile === 'STRONG');

  const handleCuts = [
    ['T ≤1u junk (steam-tail lean)', steamTail.filter((r) => r.inBand === 'lean')],
    ['T unconfirmed 4u (steam-tail u4)', steamTail.filter((r) => r.inBand === 'u4')],
    ['T unconfirmed fat (steam-tail fat)', steamTail.filter((r) => r.inBand === 'fat')],
    ['T leftover mid (steam-tail mid)', steamTail.filter((r) => r.inBand === 'mid')],
    ['−375 fav-juice', mutedG.filter((r) => r.mutedBy === 'fav-juice')],
    ['EV < −2 no steam', mutedG.filter((r) => r.mutedBy === 'ev-lt2-no-steam')],
    ['believed-cut leftover', mutedG.filter((r) => r.mutedBy === 'believed-cut')],
    ['tape-weak', mutedG.filter((r) => r.mutedBy === 'tape-weak')],
    ['maxsr-sub4', mutedG.filter((r) => r.mutedBy === 'maxsr-sub4')],
    ['top-crowded', mutedG.filter((r) => r.mutedBy === 'top-crowded')],
    ['ev-drift-edge', mutedG.filter((r) => r.mutedBy === 'ev-drift-edge')],
    ['winner_align_fade', mutedG.filter((r) => r.mutedBy === 'winner_align_fade')],
    ['muted-unstamped', mutedG.filter((r) => r.mutedBy === 'muted-unstamped')],
  ];

  push(`# Unit-tier + steam/EV cut scoreboard`);
  push('');
  push(`_Generated ${new Date().toISOString()} · AGSU sides Aug 31+ (T live) unless noted._`);
  push('');
  push('Re-run: `node scripts/analyzeUnitTierSteamBook.mjs`');
  push('');
  push('WATCH ≠ revert. Two-phase steam/EV sample is still filling. Do not change production sizing from a WATCH row.');

  section(push, 'Handle at a glance');
  push('Shipped tiles = Bankroll Lens (`agsV12UnitTierFromUnits`). Cuts scored at recoverable incoming size (counterfactual).');
  push('');
  push('```');
  push(line('SHIPPED Aug31+', shippedG));
  for (const k of tileOrder) {
    const meta = AGS_V12_UNIT_TIERS.find((x) => x.key === k);
    const sub = shippedG.filter((r) => r.tile === k);
    const tag = k === 'LEAN' && !sub.length
      ? 'WORKING — T emptied ≤1u'
      : k === 'STRONG' && fmt(sub).pnl > 10
        ? 'the book'
        : k === 'TOP' && fmt(sub).pnl < 0
          ? 'flat / under'
          : k === 'MID' && fmt(sub).pnl < 0
            ? 'flat / under'
            : '';
    push(handleLine(`${meta.label} (${meta.unitsLabel})`, sub, undefined, tag));
  }
  push('');
  push(handleLine('unit-tier PROMOTE shipped', promoShip, undefined, 'Sep 11 old OR until Fetch restamps'));
  push(handleLine('unit-tier PROMOTE then muted', promoThenMute, cf, 'stamp then later 0u'));
  push(handleLine('T arriving FLOOR →2u', tailFloor, undefined, promoteRead(fmt(tailFloor))));
  push(handleLine('T arriving mid BOOST →4u', tailBoost, undefined, promoteRead(fmt(tailBoost))));
  push(handleLine('CONFIRMED-Q1 floor shipped', q1, undefined, fmt(q1).pnl > 0 ? 'WORKING — floor is +' : cutWorking(fmt(q1))));
  push('');
  push('Cuts @ incoming (is the mute still doing the job?):');
  const handleCutRows = [];
  for (const [label, rs] of handleCuts) {
    const a = fmt(rs, cf);
    handleCutRows.push({ label, ...a, verdict: cutWorking(a) });
    push(handleLine(label, rs, cf));
  }
  push('```');

  section(push, 'What is live (sizing stack, last step wins)');
  push(`1. Path / tape / leftover / maxSR / no-CONFIRMED / crowded / Ev-drift / climate / sport unlock`);
  push(`2. **Policy T (Aug 31)** — cut ≤1u junk; floor A/B arriving ≤1u → 2u; native 2–3u A/B arriving → 4u; keep 4u and 5.4u+ iff A/B + steam on at lock; always keep 5u`);
  push(`3. **−375 mute (Sep 5)** — favorites juicier than −375 → 0u`);
  push(`4. **Unit-tier overlay (Sep 11 mute / Sep 12 timing promote)** — mute live EV < −2 with no steam; promote 2–<4u → 4u only if arriving or last-hour ≥ 3%, not LEAN/FADE, lock-EV < −1 veto`);
  push('');
  push(`Tape-log coverage Aug 31+: **${tape.length}/${t.length}** sides (${(100 * tape.length / (t.length || 1)).toFixed(0)}%). Steam/EV cuts only fire when the log or Pin game is observable — this is the database we are still filling.`);

  section(push, '1. Shipped unit tiles (Bankroll Lens)');
  push('These are **shipped size**, not path. 0u muted sides are not in a tile.');
  push('');
  push('```');
  push(line('ALL shipped Aug31+', shippedG));
  for (const k of tileOrder) {
    const sub = shippedG.filter((r) => r.tile === k);
    const meta = AGS_V12_UNIT_TIERS.find((x) => x.key === k);
    push(line(`${meta.label} (${meta.unitsLabel})`, sub));
  }
  push('');
  push('Steam-live Aug19+ shipped (includes pre-T 1u junk):');
  push(line('ALL shipped Aug19+', steamShip));
  for (const k of tileOrder) {
    const meta = AGS_V12_UNIT_TIERS.find((x) => x.key === k);
    push(line(`${meta.label} (${meta.unitsLabel})`, steamShip.filter((r) => r.tile === k)));
  }
  push('```');

  section(push, '2. Steam size bands on shipped T-window');
  push('```');
  for (const b of ['lean', 'mid', 'u4', 'u5', 'fat']) {
    push(line(b, shippedG.filter((r) => r.band === b)));
  }
  push('```');

  section(push, '3. Lock tier inside the 3u (STRONG) tile — flatten check');
  push('T flattened quality into 3u. Units stopped meaning path quality.');
  push('');
  push('```');
  push(line('3u all', strong));
  for (const tier of ['ELITE', 'PREMIUM', 'LOCK', 'WEAK', 'LEAN', 'FADE']) {
    push(line(`3u ${tier}`, strong.filter((r) => r.lockTier === tier)));
  }
  push('```');

  section(push, '4. Promote paths (stamped), by incoming unit band');
  push('Incoming uses `v8_unitsPreUnitTierEvSteam` when present so a 4u stamp does not look like it arrived as 4u.');
  push('Sep 11 unit-tier PROMOTE stamps used the old OR (steam-on / EV[0,1) / lh≥2). Next Fetch restamps timing-only.');
  push('');
  push('```');
  push(line('unit-tier PROMOTE shipped', promoShip));
  push(line('  incoming mid 2–3u', promoShip.filter((r) => r.inBand === 'mid')));
  push(line('unit-tier PROMOTE then muted', promoThenMute, cf));
  push(line('T arriving FLOOR →2u', tailFloor));
  push(line('T arriving mid BOOST →4u', tailBoost));
  push(line('CONFIRMED-Q1 floor (shipped)', q1));
  push('```');
  if (promoShip.length) {
    push('Unit-tier promote shipped:');
    for (const r of [...promoShip].sort((a, b) => a.date.localeCompare(b.date))) push(ticketLine(r));
  }
  if (promoThenMute.length) {
    push('Unit-tier promote then muted (counterfactual @ incoming):');
    for (const r of [...promoThenMute].sort((a, b) => a.date.localeCompare(b.date))) push(ticketLine(r));
  }

  section(push, '5. Cut / mute paths — is the cut still working?');
  push('Muted sides graded as if they had shipped at recoverable pre-size (`incoming`).');
  push('WORKING = the pile we cut is ≤50% WR or −PnL. WATCH = muted pile is winning — sample or a leak. WATCH ≠ revert.');
  push('');
  push('```');
  push(line('ALL muted Aug31+ @ incoming', mutedG, cf));
  push(handleLine('  T steam-tail lean ≤1u', steamTail.filter((r) => r.inBand === 'lean'), cf));
  push(handleLine('  T steam-tail mid', steamTail.filter((r) => r.inBand === 'mid'), cf));
  push(handleLine('  T steam-tail u4', steamTail.filter((r) => r.inBand === 'u4'), cf));
  push(handleLine('  T steam-tail fat', steamTail.filter((r) => r.inBand === 'fat'), cf));
  const byCut = new Map();
  for (const r of mutedG) {
    const k = r.mutedBy || 'unstamped';
    if (!byCut.has(k)) byCut.set(k, []);
    byCut.get(k).push(r);
  }
  const cutRows = [];
  for (const [k, rs] of [...byCut.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const a = fmt(rs, cf);
    const meta = CUTS[k] || { phase: '?', what: k };
    cutRows.push({ key: k, ...meta, ...a, verdict: cutWorking(a) });
    push(`${line(k, rs, cf)}  ${cutWorking(a)}`);
    push(`    ${meta.phase} · ${meta.what}`);
  }
  push('```');

  section(push, '6. Steam-era cuts × incoming unit band');
  push('```');
  const steamCuts = ['steam-tail', 'ev-lt2-no-steam', 'fav-juice', 'ev-drift-edge', 'believed-cut', 'maxsr-sub4'];
  for (const k of steamCuts) {
    const rs = mutedG.filter((r) => r.mutedBy === k);
    if (!rs.length) continue;
    push(k);
    push(line('  all', rs, cf));
    for (const b of ['lean', 'mid', 'u4', 'u5', 'fat']) {
      const sub = rs.filter((r) => r.inBand === b);
      if (sub.length) push(line(`  incoming ${b}`, sub, cf));
    }
  }
  push('```');

  section(push, '7. Database fill — tape / steam / EV');
  push('```');
  push(`T-window sides              ${t.length}`);
  push(`  shipped                   ${shipped.length}  graded ${shippedG.length}`);
  push(`  muted                     ${muted.length}  graded ${muted.filter((r) => r.won != null).length}`);
  push(`  tape log                  ${tape.length} (${(100 * tape.length / (t.length || 1)).toFixed(0)}%)`);
  push(`  shipped + tape            ${tShip.filter((r) => r.hasLog).length}/${tShip.length}`);
  push(`  muted + tape              ${muted.filter((r) => r.hasLog).length}/${muted.length}`);
  push(`  arriving (tape)           ${t.filter((r) => r.arriving).length}`);
  push(`  steam on lock (tape)      ${t.filter((r) => r.steamOn).length}`);
  push(`  lock EV present           ${t.filter((r) => r.evLock != null).length}`);
  push('```');
  push('');
  push('Sep 12 timing promote just landed. Unit-tier PROMOTE stamps before today used the old OR (steam-on / EV[0,1) / lh≥2). Read those stamps as the wide rule; new stamps after the next Fetch are timing-only.');

  const text = out.join('\n');
  const artifactDir = '/opt/cursor/artifacts';
  try { mkdirSync(artifactDir, { recursive: true }); } catch { /* ok */ }
  writeFileSync(join(artifactDir, 'unit_tier_steam_scoreboard.md'), `${text}\n`);
  writeFileSync(join(artifactDir, 'unit_tier_steam_scoreboard.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    tWindow: { n: t.length, shipped: shipped.length, muted: muted.length, tape: tape.length },
    shippedTiles: Object.fromEntries(tileOrder.map((k) => [k, fmt(shippedG.filter((r) => r.tile === k))])),
    handleCuts: handleCutRows,
    cuts: cutRows,
  }, null, 2));
  writeFileSync(join(ROOT, 'docs/UNIT_TIER_STEAM_SCOREBOARD.md'), `${text}\n`);
  console.log('\nWrote /opt/cursor/artifacts/unit_tier_steam_scoreboard.md and docs/UNIT_TIER_STEAM_SCOREBOARD.md');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

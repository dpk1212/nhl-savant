#!/usr/bin/env node
/**
 * Steam-era separators — can edge / tape / wallets split W from L?
 *
 *   node scripts/analyzeSteamSeparators.mjs
 *
 * Windows: steam era Aug 19+ · T Aug 31+ · last 7 · last 2.
 * Live book first. Mute CF on the same slices (did we cut the good cell?).
 * No policy.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { enrichTicketTapeFromSide } from '../src/lib/ticketTapeCapture.js';
import { sourceFlagsFromSportRec, sportRecFromProfiles } from '../src/lib/steamTailPolicy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const LEFTOVER_FROM = '2026-08-19';
const T_FROM = '2026-08-31';
const PAPER_HI = '2026-08-08'.replace('08-08', '09-08');
const TAPE_BOOST_ABOVE = 2.89;

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
      docs.push({ id: String(d.name || '').split('/').pop(), ...decodeMap(d.fields || {}) });
    }
    pageToken = body.nextPageToken || '';
    if (!pageToken) break;
  }
  return docs;
}

function isAgsu(tag) {
  return typeof tag === 'string' && tag.startsWith('ags-unified-v');
}
function americanProfit(won, units, odds) {
  if (won == null || !(units > 0)) return 0;
  if (won) return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
  return -units;
}
function wilson(w, n, z = 1.96) {
  if (!(n > 0)) return null;
  const p = w / n;
  const z2 = z * z;
  const den = 1 + z2 / n;
  const mid = p + z2 / (2 * n);
  const half = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return { lo: Math.max(0, (mid - half) / den), hi: Math.min(1, (mid + half) / den) };
}
function firstFinitePositive(...xs) {
  for (const x of xs) {
    const n = Number(x);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}
function agg(rows, uKey = 'u', pKey = 'pnl') {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += Number(r[uKey]) || 0;
    pnl += Number.isFinite(Number(r[pKey])) ? Number(r[pKey]) : 0;
    if (r.won === 1) w++;
    else l++;
  }
  const ci = wilson(w, n);
  return {
    n, w, l,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    wr: n ? +((w / n) * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wr == null ? '—' : `${a.wr}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n} · ${a.w}–${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi}`;
}
function cells(a) {
  if (!a || !a.n) return ['0', '—', '—', '—', '—', '—'];
  return [
    String(a.n),
    `${a.w}–${a.l}`,
    a.wr == null ? '—' : `${a.wr}%`,
    a.wrLo != null ? `${a.wrLo}–${a.wrHi}` : '—',
    `${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}`,
    a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`,
  ];
}
function mdTable(headers, rows) {
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}`;
}
function signed(n, d = 2) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return `${x >= 0 ? '+' : ''}${x.toFixed(d)}`;
}
function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const rawProfiles = JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8'));
const profiles = rawProfiles.profiles || rawProfiles;

function recOf(short, sport) {
  return sportRecFromProfiles(profiles, short, sport);
}
function flagsOf(short, sport) {
  return sourceFlagsFromSportRec(recOf(short, sport));
}
function isProven(short, sport) {
  const f = flagsOf(short, sport);
  return !!(f.confirmed || f.flat);
}

function edgeBand(e) {
  if (!Number.isFinite(e)) return 'no edge stamp';
  if (e < 0) return 'edge <0';
  if (e < 5) return 'edge 0–5';
  if (e < 10) return 'edge 5–10';
  if (e < 15) return 'edge 10–15';
  return 'edge 15+';
}
function tapeActBand(a) {
  const x = String(a || '').toUpperCase().replace(/-/g, '_');
  if (!x) return 'no tape action';
  if (x === 'BOOST') return 'BOOST';
  if (x === 'FAIL_OPEN') return 'FAIL_OPEN';
  if (x === 'HOLD') return 'HOLD';
  if (x === 'MUTE' || x === 'CUT') return 'MUTE/CUT';
  if (x === 'PASS') return 'PASS';
  return x;
}
function tapeScoreBand(t) {
  if (!Number.isFinite(t)) return 'no tape score';
  if (t < 2.0) return 'tape <2 (weak)';
  if (t < TAPE_BOOST_ABOVE) return `tape 2–${TAPE_BOOST_ABOVE} (hold)`;
  if (t < 4) return `tape ${TAPE_BOOST_ABOVE}–4 (boost)`;
  return 'tape 4+ (boost+)';
}
function srBand(sr) {
  if (!Number.isFinite(sr)) return 'no sizeRatio';
  if (sr < 0.75) return 'lead <0.75×';
  if (sr < 1.25) return 'lead ~1× (0.75–1.25)';
  if (sr < 1.75) return 'lead 1.25–1.75×';
  return 'lead ≥1.75×';
}
function shareBand(p) {
  if (!Number.isFinite(p)) return 'no $ split';
  if (p < 0.25) return '$ share <25%';
  if (p < 0.40) return '$ share 25–40%';
  if (p < 0.60) return '$ share 40–60%';
  return '$ share ≥60%';
}
function provenBand(forN, agN) {
  if (!Number.isFinite(forN) && !Number.isFinite(agN)) return 'no proven stamp';
  const f = Number(forN) || 0;
  const a = Number(agN) || 0;
  if (f === 0) return '0 proven with';
  if (a === 0) return `${Math.min(f, 4)}+ proven, 0 against`;
  if (f >= a + 2) return 'proven margin ≥+2';
  if (f > a) return 'proven margin +1';
  if (f === a) return 'proven tied';
  return 'proven against ≥+1';
}
function evBand(e) {
  if (!Number.isFinite(e)) return 'no EV stamp';
  if (e < 0) return 'EV <0';
  if (e < 3) return 'EV 0–3%';
  if (e < 6) return 'EV 3–6%';
  return 'EV ≥6%';
}
function oddsBand(o) {
  if (!Number.isFinite(o)) return 'no odds';
  if (o <= -150) return 'short ≤−150';
  if (o < -110) return '−149 to −111';
  if (o <= 110) return 'pick’em −110 to +110';
  if (o <= 150) return '+111 to +150';
  return 'dog ≥+151';
}

console.error('fetch…');
const packs = await Promise.all(COLS.map(async ([col, mkt]) => {
  const docs = await listCollection(col);
  console.error(`  ${col} ${docs.length}`);
  return { mkt, docs };
}));

const rows = [];
for (const { mkt, docs } of packs) {
  for (const data of docs) {
    if (!data.sides || data.date < LEFTOVER_FROM) continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (!sd || sd.superseded) continue;
      if (!isAgsu(sd.promotedBy)) continue;
      const status = sd.status || data.status;
      const res = sd.result || {};
      const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
      if (won == null) continue;
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const u = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0) || 0;
      const odds = Number(peak.odds || lock.odds || 0) || 0;
      const tracked = res.tracked === true || u === 0;
      const live = status === 'COMPLETED' && !tracked && u > 0;
      const uPre = firstFinitePositive(
        Number(sd.v8_unitsPreFlinchFailOpen),
        Number(sd.v8_unitsPreSteamTail),
        Number(sd.v8_unitsPreQConv),
        Number(sd.v8_unitsPreTape),
        Number(sd.v8_unitsPreClimate),
        u > 0 ? u : null,
      ) ?? 1;
      const pnl = live ? (Number.isFinite(res.profit) ? res.profit : americanProfit(won, u, odds)) : 0;
      const pnlPre = americanProfit(won, uPre, odds);

      const tape = enrichTicketTapeFromSide(sd);
      const steamOn = sd.v8_steamTailOnLock != null
        ? !!sd.v8_steamTailOnLock
        : !!tape.ticketTape?.steamOnLock;
      const steamOnFirst = tape.ticketTape?.n > 0
        ? !!tape.ticketTape.steamOnFirst
        : (sd.v8_steamTailArriving === true ? false : steamOn);
      const arriving = sd.v8_steamTailArriving != null
        ? !!sd.v8_steamTailArriving
        : (!steamOnFirst && steamOn);

      const sport = data.sport || 'NHL';
      const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || []);
      let forA = 0; let forB = 0;
      let provenFor = 0; let provenAg = 0;
      let $for = 0; let $ag = 0;
      let lead = null;
      const seen = new Set();
      for (const w of wd) {
        if (!w) continue;
        const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
        if (!short || seen.has(short)) continue;
        seen.add(short);
        const onOurs = String(w.side) === String(sideKey);
        const inv = Number(w.invested) || 0;
        const sr = Number(w.sizeRatio);
        const f = flagsOf(short, sport);
        if (onOurs) {
          $for += inv;
          if (f.a) forA++;
          if (f.b) forB++;
          if (f.confirmed || f.flat) provenFor++;
          if (!lead || inv > lead.inv) {
            lead = { short, inv, sr, roi: Number(w.roi), confirmed: f.confirmed, a: f.a, b: f.b };
          }
        } else {
          $ag += inv;
          if (f.confirmed || f.flat) provenAg++;
        }
      }
      const stampFor = Number(sd.v8_agsProvenForCount);
      const stampAg = Number(sd.v8_agsProvenAgCount);
      if (Number.isFinite(stampFor)) provenFor = stampFor;
      if (Number.isFinite(stampAg)) provenAg = stampAg;

      const edge = Number.isFinite(sd.v8_winnerAlignEdge) ? Number(sd.v8_winnerAlignEdge) : null;
      const edgeFor = Number.isFinite(sd.v8_winnerAlignMeanFor) ? Number(sd.v8_winnerAlignMeanFor) : null;
      const edgeAg = Number.isFinite(sd.v8_winnerAlignMeanAg) ? Number(sd.v8_winnerAlignMeanAg) : null;
      const edgeBoth = sd.v8_winnerAlignHasBoth === true;
      const tapeScore = Number.isFinite(sd.v8_tapeScore) ? Number(sd.v8_tapeScore) : null;
      const tapeAction = String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_') || null;
      const evLock = Number.isFinite(tape.ticketTape?.evLock) ? tape.ticketTape.evLock
        : (Number.isFinite(tape.ticketEvPct) ? tape.ticketEvPct : null);
      const $tot = $for + $ag;
      const share = $tot > 0 ? $for / $tot : null;
      const e10 = edge != null && edge >= 10;
      const boost = tapeAction === 'BOOST' || (tapeScore != null && tapeScore >= TAPE_BOOST_ABOVE);
      const combo = e10 && boost ? 'BOTH E10+BOOST' : e10 ? 'E10 only' : boost ? 'BOOST only' : 'neither';

      rows.push({
        date: data.date,
        sport,
        mkt,
        team: sd.team || sideKey,
        path: sd.v8_hcStakeTier || null,
        won,
        odds,
        u,
        pnl,
        uPre,
        pnlPre,
        live,
        mutedBy: sd.mutedBy || null,
        arriving,
        steamOn,
        sharpAB: sd.v8_steamTailSharpAB != null ? !!sd.v8_steamTailSharpAB : (forA + forB > 0),
        forA,
        forB,
        provenFor,
        provenAg,
        $for,
        $ag,
        share,
        leadSr: lead?.sr ?? null,
        leadRoi: lead?.roi ?? null,
        leadInv: lead?.inv ?? null,
        edge,
        edgeFor,
        edgeAg,
        edgeBoth,
        tapeScore,
        tapeAction,
        evLock,
        e10,
        boost,
        combo,
        steamAction: sd.v8_steamTailAction || null,
      });
    }
  }
}

const liveOf = (rs) => rs.filter((r) => r.live);
const muteOf = (rs) => rs.filter((r) => !r.live);
const win = (rs, lo, hi) => rs.filter((r) => r.date >= lo && r.date <= hi);

const dates = [...new Set(rows.map((r) => r.date))].sort();
const lastDate = dates[dates.length - 1];
const liveDates = [...new Set(liveOf(rows).map((r) => r.date))].sort();
const last2Lo = liveDates.slice(-2)[0];
const last2Hi = liveDates[liveDates.length - 1];
const weekLo = addDays(lastDate, -6);

const steam = rows;
const tEra = win(rows, T_FROM, lastDate);
const tPre = win(rows, T_FROM, PAPER_HI);
const last2 = win(rows, last2Lo, last2Hi);
const week = win(rows, weekLo, lastDate);
const extra = win(rows, '2026-09-09', lastDate);

const windows = [
  ['Last 2', last2],
  ['Last 7', week],
  ['T pre-HOLD', tPre],
  ['HOLD+bump', extra],
  ['Full T', tEra],
  ['Steam era', steam],
];

const out = [];
const p = (s = '') => out.push(s);

function sliceTable(title, keyFn, order = null) {
  p(`### ${title}`);
  p('');
  const keys = new Set();
  for (const [, rs] of windows) {
    for (const r of liveOf(rs)) keys.add(keyFn(r));
  }
  let list = [...keys];
  if (order) {
    const rank = new Map(order.map((k, i) => [k, i]));
    list.sort((a, b) => (rank.has(a) ? rank.get(a) : 99) - (rank.has(b) ? rank.get(b) : 99) || String(a).localeCompare(String(b)));
  } else {
    list.sort();
  }
  const header = ['Slice', ...windows.map(([n]) => n)];
  const body = list.map((k) => [
    k,
    ...windows.map(([, rs]) => fmt(agg(liveOf(rs).filter((r) => keyFn(r) === k)))),
  ]);
  p(mdTable(header, body));
  p('');
}

function muteTable(title, keyFn, order = null) {
  p(`### ${title} — mute CF (pre units)`);
  p('');
  const keys = new Set();
  for (const r of muteOf(tEra)) keys.add(keyFn(r));
  let list = [...keys];
  if (order) {
    const rank = new Map(order.map((k, i) => [k, i]));
    list.sort((a, b) => (rank.has(a) ? rank.get(a) : 99) - (rank.has(b) ? rank.get(b) : 99) || String(a).localeCompare(String(b)));
  } else list.sort();
  const body = list.map((k) => [
    k,
    fmt(agg(muteOf(last2).filter((r) => keyFn(r) === k), 'uPre', 'pnlPre')),
    fmt(agg(muteOf(week).filter((r) => keyFn(r) === k), 'uPre', 'pnlPre')),
    fmt(agg(muteOf(tEra).filter((r) => keyFn(r) === k), 'uPre', 'pnlPre')),
  ]);
  p(mdTable(['Slice', 'Last 2 CF', 'Last 7 CF', 'Full T CF'], body));
  p('');
}

p('# Steam-era separators — edge, tape, wallets');
p('');
p(`_Pulled ${new Date().toISOString()}. Graded AGS-U ${LEFTOVER_FROM}–${lastDate}. Last 2 live dates **${last2Lo}–${last2Hi}**. Last 7 **${weekLo}–${lastDate}**._`);
p('_Live book unless labeled mute CF. Mute CF: **positive = we cut winners.**_');
p('_**No policy.**_');
p('');

p('## 0. Coverage (T-era graded)');
{
  const t = tEra;
  const n = t.length;
  const live = liveOf(t);
  const has = (fn) => t.filter(fn).length;
  p('');
  p(mdTable(
    ['Stamp', 'T graded', 'T live'],
    [
      ['any', String(n), String(live.length)],
      ['winnerAlign edge', String(has((r) => Number.isFinite(r.edge))), String(liveOf(t).filter((r) => Number.isFinite(r.edge)).length)],
      ['tape action', String(has((r) => r.tapeAction)), String(liveOf(t).filter((r) => r.tapeAction).length)],
      ['tape score', String(has((r) => Number.isFinite(r.tapeScore))), String(liveOf(t).filter((r) => Number.isFinite(r.tapeScore)).length)],
      ['lock EV', String(has((r) => Number.isFinite(r.evLock))), String(liveOf(t).filter((r) => Number.isFinite(r.evLock)).length)],
      ['lead sizeRatio', String(has((r) => Number.isFinite(r.leadSr))), String(liveOf(t).filter((r) => Number.isFinite(r.leadSr)).length)],
      ['$ split', String(has((r) => Number.isFinite(r.share))), String(liveOf(t).filter((r) => Number.isFinite(r.share)).length)],
      ['proven for/ag', String(has((r) => Number.isFinite(r.provenFor))), String(liveOf(t).filter((r) => Number.isFinite(r.provenFor)).length)],
    ],
  ));
  p('');
}

p('## 1. Headline live books');
p('');
p(mdTable(
  ['Window', 'Live'],
  windows.map(([n, rs]) => [n, fmt(agg(liveOf(rs)))]),
));
p('');

p('## 2. EDGE (winner-align pp: our wallets’ beat-close vs theirs)');
p('');
sliceTable('Live by edge band', (r) => edgeBand(r.edge), [
  'no edge stamp', 'edge <0', 'edge 0–5', 'edge 5–10', 'edge 10–15', 'edge 15+',
]);
p('Has both sides of the edge (not a 50% fill):');
p('');
sliceTable('Live by edge has-both', (r) => (r.edgeBoth ? 'edge both sides' : 'edge one-sided / fill'), [
  'edge both sides', 'edge one-sided / fill',
]);
muteTable('Edge band', (r) => edgeBand(r.edge), [
  'no edge stamp', 'edge <0', 'edge 0–5', 'edge 5–10', 'edge 10–15', 'edge 15+',
]);

p('## 3. TAPE (score + action)');
p('');
sliceTable('Live by tape action', (r) => tapeActBand(r.tapeAction), [
  'BOOST', 'HOLD', 'FAIL_OPEN', 'MUTE/CUT', 'PASS', 'no tape action',
]);
sliceTable('Live by tape score', (r) => tapeScoreBand(r.tapeScore), [
  'no tape score', 'tape <2 (weak)', `tape 2–${TAPE_BOOST_ABOVE} (hold)`, `tape ${TAPE_BOOST_ABOVE}–4 (boost)`, 'tape 4+ (boost+)',
]);
muteTable('Tape action', (r) => tapeActBand(r.tapeAction), [
  'BOOST', 'HOLD', 'FAIL_OPEN', 'MUTE/CUT', 'PASS', 'no tape action',
]);

p('## 4. EDGE × TAPE — the leftover floor combo');
p('');
p('BOTH = EDGE≥10 AND tape BOOST. That is what leftover uses to floor 4u/5u — and what leftover mutes when still sub-4.');
p('');
sliceTable('Live by E10 × BOOST', (r) => r.combo, [
  'BOTH E10+BOOST', 'E10 only', 'BOOST only', 'neither',
]);
muteTable('E10 × BOOST', (r) => r.combo, [
  'BOTH E10+BOOST', 'E10 only', 'BOOST only', 'neither',
]);

p('## 5. WALLETS');
p('');
sliceTable('Live by proven for vs against', (r) => provenBand(r.provenFor, r.provenAg));
sliceTable('Live by $ share on our side', (r) => shareBand(r.share), [
  'no $ split', '$ share <25%', '$ share 25–40%', '$ share 40–60%', '$ share ≥60%',
]);
sliceTable('Live by lead wallet size vs usual', (r) => srBand(r.leadSr), [
  'no sizeRatio', 'lead <0.75×', 'lead ~1× (0.75–1.25)', 'lead 1.25–1.75×', 'lead ≥1.75×',
]);
sliceTable('Live by Source A/B on our side', (r) => (r.sharpAB ? 'A/B on our side' : 'no A/B'), [
  'A/B on our side', 'no A/B',
]);
muteTable('Proven for vs against', (r) => provenBand(r.provenFor, r.provenAg));
muteTable('Lead size vs usual', (r) => srBand(r.leadSr), [
  'no sizeRatio', 'lead <0.75×', 'lead ~1× (0.75–1.25)', 'lead 1.25–1.75×', 'lead ≥1.75×',
]);

p('## 6. Ticket EV at lock + steam arriving');
p('');
sliceTable('Live by lock EV', (r) => evBand(r.evLock), [
  'no EV stamp', 'EV <0', 'EV 0–3%', 'EV 3–6%', 'EV ≥6%',
]);
sliceTable('Live by steam lifecycle', (r) => (r.arriving ? 'arriving' : (r.steamOn ? 'already-on' : 'no steam')), [
  'arriving', 'already-on', 'no steam',
]);
sliceTable('Live by odds', (r) => oddsBand(r.odds), [
  'short ≤−150', '−149 to −111', 'pick’em −110 to +110', '+111 to +150', 'dog ≥+151',
]);

p('## 7. Did any separator survive the last 2 days?');
p('');
p('A real separator has to work in the *hot* T window **and** not reverse in Sep 15–16. Last 2 days are 8–19 −41u — if a cell is still green there, that is signal. If everything went red, it is a cold book, not a dead feature.');
p('');
{
  const tests = [
    ['edge 10+', (r) => Number.isFinite(r.edge) && r.edge >= 10],
    ['edge 15+', (r) => Number.isFinite(r.edge) && r.edge >= 15],
    ['tape BOOST', (r) => r.tapeAction === 'BOOST' || (Number.isFinite(r.tapeScore) && r.tapeScore >= TAPE_BOOST_ABOVE)],
    ['BOTH E10+BOOST', (r) => r.combo === 'BOTH E10+BOOST'],
    ['E10 only', (r) => r.combo === 'E10 only'],
    ['BOOST only', (r) => r.combo === 'BOOST only'],
    ['neither E10 nor BOOST', (r) => r.combo === 'neither'],
    ['0 proven against', (r) => (r.provenAg || 0) === 0 && (r.provenFor || 0) >= 1],
    ['proven against ≥1', (r) => (r.provenAg || 0) >= 1],
    ['$ share ≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
    ['$ share <25%', (r) => Number.isFinite(r.share) && r.share < 0.25],
    ['lead ≥1.25×', (r) => Number.isFinite(r.leadSr) && r.leadSr >= 1.25],
    ['lead <0.75×', (r) => Number.isFinite(r.leadSr) && r.leadSr < 0.75],
    ['A/B on side', (r) => r.sharpAB],
    ['arriving', (r) => r.arriving],
    ['already-on', (r) => r.steamOn && !r.arriving],
    ['EV ≥6%', (r) => Number.isFinite(r.evLock) && r.evLock >= 6],
    ['EV <0', (r) => Number.isFinite(r.evLock) && r.evLock < 0],
    ['MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL'],
    ['MLB not TOTAL', (r) => r.sport === 'MLB' && r.mkt !== 'TOTAL'],
  ];
  p(mdTable(
    ['Cell', 'T pre-HOLD live', 'Last 7 live', 'Last 2 live', 'Full T live'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(liveOf(tPre).filter(fn))),
      fmt(agg(liveOf(week).filter(fn))),
      fmt(agg(liveOf(last2).filter(fn))),
      fmt(agg(liveOf(tEra).filter(fn))),
    ]),
  ));
  p('');
}

p('## 8. Last 2 days — ticket tape (edge / tape / wallets on each live play)');
p('');
{
  const live = liveOf(last2).slice().sort((a, b) => (a.pnl || 0) - (b.pnl || 0));
  p('```');
  for (const r of live) {
    const e = Number.isFinite(r.edge) ? `e${r.edge.toFixed(1)}` : 'e—';
    const ts = Number.isFinite(r.tapeScore) ? `t${r.tapeScore.toFixed(2)}` : 't—';
    const sr = Number.isFinite(r.leadSr) ? `${r.leadSr.toFixed(2)}×` : 'sr—';
    const sh = Number.isFinite(r.share) ? `${Math.round(r.share * 100)}%` : '$—';
    const ev = Number.isFinite(r.evLock) ? `ev${r.evLock.toFixed(1)}` : 'ev—';
    p(`${r.date} ${(r.sport || '').padEnd(4)} ${(r.mkt || '').padEnd(6)} ${(r.team || '').slice(0, 24).padEnd(24)} ${String(r.u).padStart(4)}u ${r.won ? 'W' : 'L'} ${signed(r.pnl).padStart(7)}  ${e.padStart(7)} ${ts.padStart(6)} ${(r.tapeAction || '—').padEnd(10)} ${r.combo.padEnd(16)} P${r.provenFor || 0}/A${r.provenAg || 0} ${sh.padStart(4)} lead ${sr.padStart(6)} ${ev} ${r.arriving ? 'ARR' : (r.steamOn ? 'ON' : '')}`);
  }
  p('```');
  p('');
}

p('## 9. Mute CF on the cells that look like separators');
p('');
{
  const tests = [
    ['BOTH E10+BOOST muted', (r) => r.combo === 'BOTH E10+BOOST'],
    ['E10 only muted', (r) => r.combo === 'E10 only'],
    ['BOOST only muted', (r) => r.combo === 'BOOST only'],
    ['0 proven against muted', (r) => (r.provenAg || 0) === 0 && (r.provenFor || 0) >= 1],
    ['lead ≥1.25× muted', (r) => Number.isFinite(r.leadSr) && r.leadSr >= 1.25],
    ['arriving muted', (r) => r.arriving],
    ['FAIL_OPEN tape muted', (r) => r.tapeAction === 'FAIL_OPEN'],
  ];
  p(mdTable(
    ['Muted cell', 'Last 2 CF', 'Last 7 CF', 'Full T CF'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(muteOf(last2).filter(fn), 'uPre', 'pnlPre')),
      fmt(agg(muteOf(week).filter(fn), 'uPre', 'pnlPre')),
      fmt(agg(muteOf(tEra).filter(fn), 'uPre', 'pnlPre')),
    ]),
  ));
  p('');
}

const payload = {
  generatedAt: new Date().toISOString(),
  lastDate,
  last2: { lo: last2Lo, hi: last2Hi, live: agg(liveOf(last2)) },
  week: { lo: weekLo, hi: lastDate, live: agg(liveOf(week)) },
  tEra: { live: agg(liveOf(tEra)) },
  n: rows.length,
};

mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/STEAM_SEPARATORS.md', `${out.join('\n')}\n`);
writeFileSync('/opt/cursor/artifacts/steam_separators.json', JSON.stringify(payload, null, 2));
writeFileSync(join(ROOT, 'docs/STEAM_SEPARATORS_2026-09-17.md'), `${out.join('\n')}\n`);
writeFileSync('/opt/cursor/artifacts/steam_separator_rows.json', JSON.stringify(rows.map((r) => ({
  date: r.date, sport: r.sport, mkt: r.mkt, team: r.team, live: r.live, won: r.won,
  u: r.u, pnl: r.pnl, uPre: r.uPre, pnlPre: r.pnlPre, odds: r.odds, path: r.path,
  edge: r.edge, tapeScore: r.tapeScore, tapeAction: r.tapeAction, combo: r.combo,
  provenFor: r.provenFor, provenAg: r.provenAg, share: r.share, leadSr: r.leadSr,
  evLock: r.evLock, arriving: r.arriving, steamOn: r.steamOn, sharpAB: r.sharpAB,
  mutedBy: r.mutedBy,
})), null, 2));
console.log(out.join('\n'));
console.error(`wrote separators · graded ${rows.length} live ${liveOf(rows).length} through ${lastDate}`);

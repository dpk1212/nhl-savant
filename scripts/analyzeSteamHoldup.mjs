/**
 * Hold-up of the Aug 31 steam-tail paper on the extra ~10 days.
 *
 * Same cells as scripts/analyzeGoldSteamAb.mjs / docs/CLOSING_DIME_STEAM_EDGE.md,
 * split discovery (08-19–08-30) vs hold-up (08-31–now), using PRE-policy units
 * so muted tails are visible.
 *
 *   node scripts/analyzeSteamHoldup.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { enrichTicketTapeFromSide, steamGoldLockLabel } from '../src/lib/ticketTapeCapture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const DISC_LO = '2026-08-19';
const DISC_HI = '2026-08-30';
const HOLD_LO = '2026-08-31';
const T_FROM = '2026-08-31';

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
function logBinomP(n, k, p) {
  if (k > n || k < 0) return -Infinity;
  let s = 0;
  for (let i = 1; i <= k; i++) s += Math.log(n - k + i) - Math.log(i);
  return s + k * Math.log(p) + (n - k) * Math.log(1 - p);
}
function binomGe(k, n, p) {
  if (!(n > 0) || k > n) return null;
  if (k <= 0) return 1;
  let acc = 0;
  for (let i = k; i <= n; i++) acc += Math.exp(logBinomP(n, i, p));
  return Math.min(1, acc);
}
function agg(rows, unitKey = 'unitsPre', pnlKey = 'profitPre') {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  const days = new Set();
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += r[unitKey] || 0;
    pnl += Number.isFinite(r[pnlKey]) ? r[pnlKey] : 0;
    if (r.won === 1) w++; else l++;
    if (r.date) days.add(r.date);
  }
  const wr = n ? w / n : null;
  const ci = wilson(w, n);
  const dayN = days.size || 0;
  return {
    n, w, l,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    wr, wrPct: wr != null ? +(wr * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
    days: dayN,
    perDay: dayN ? +(n / dayN).toFixed(2) : null,
    pnlPerDay: dayN ? +(pnl / dayN).toFixed(2) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wrPct == null ? '—' : `${a.wrPct}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n} · ${a.w}-${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi}`;
}
function sourceFlags(rec) {
  if (!rec) return { a: false, b: false, confirmed: false };
  const tier = String(rec.whitelistTier || '').toUpperCase();
  const src = String(rec.whitelistSource || '').toUpperCase();
  const picksN = Number(rec.picks?.n) || 0;
  const posN = Number(rec.positions?.n) || 0;
  const a = src.includes('A') || (picksN >= 2 && src === '' && tier === 'CONFIRMED');
  const b = src.includes('B') || (posN >= 4 && src === '' && tier === 'CONFIRMED');
  return { a: tier === 'CONFIRMED' && a, b: tier === 'CONFIRMED' && b, confirmed: tier === 'CONFIRMED' };
}

const profilesJson = JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8'));
const profiles = profilesJson.profiles || profilesJson;
function profileOf(short, sport) {
  const p = profiles[short] || profiles[String(short || '').toLowerCase()];
  if (!p) return null;
  return p.bySport?.[sport] || null;
}

console.error('Fetching collections…');
const packs = await Promise.all(COLS.map(async ([col, mkt]) => ({ mkt, docs: await listCollection(col) })));
for (const p of packs) console.error(`  ${p.mkt}: ${p.docs.length}`);

const rows = [];
for (const { mkt, docs } of packs) {
  for (const data of docs) {
    if (!data.sides || typeof data.sides !== 'object') continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (!sd || sd.superseded) continue;
      if ((sd.status || data.status) !== 'COMPLETED') continue;
      if (!isAgsu(sd.promotedBy)) continue;
      const res = sd.result || {};
      const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
      if (won == null) continue;
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const unitsFinal = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0) || 0;
      const odds = Number(peak.odds || lock.odds || 0) || 0;
      const profitFinal = Number.isFinite(res.profit) ? res.profit : americanProfit(won, unitsFinal, odds);
      const preSteam = Number(sd.v8_unitsPreSteamTail);
      const preQ = Number(sd.v8_unitsPreQConv);
      const preTape = Number(sd.v8_unitsPreTape);
      const preClimate = Number(sd.v8_unitsPreClimate);
      const unitsPre = (Number.isFinite(preSteam) && preSteam > 0 ? preSteam : null)
        ?? (Number.isFinite(preQ) && preQ > 0 ? preQ : null)
        ?? (Number.isFinite(preTape) && preTape > 0 ? preTape : null)
        ?? (unitsFinal > 0 ? unitsFinal : 1);
      const profitPre = americanProfit(won, unitsPre, odds);
      const tape = enrichTicketTapeFromSide(sd);
      const goldLabel = steamGoldLockLabel(tape.ticketTape, tape.steam);
      const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
        .filter((w) => w && w.wallet && w.side);
      const sport = data.sport || 'NHL';
      let forA = 0; let forB = 0;
      const seen = new Set();
      for (const w of wd) {
        if (w.side !== sideKey) continue;
        const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
        if (!short || seen.has(short)) continue;
        seen.add(short);
        const flags = sourceFlags(profileOf(short, sport));
        if (flags.a) forA++;
        if (flags.b) forB++;
      }
      const steamOn = !!tape.ticketTape?.steamOnLock;
      const steamOnFirst = !!tape.ticketTape?.steamOnFirst;
      const steamArriving = !steamOnFirst && steamOn;
      const hasLog = (tape.ticketTape?.n || 0) > 0;
      const sharpAB = forA + forB > 0;
      const stampedAB = sd.v8_steamTailSharpAB === true;
      rows.push({
        date: data.date,
        sport,
        mkt,
        team: sd.team || sideKey,
        won,
        odds,
        unitsFinal,
        profitFinal,
        unitsPre,
        profitPre,
        bandPre: unitBand(unitsPre),
        bandFinal: unitBand(unitsFinal),
        live: unitsFinal > 0 && res.tracked !== true,
        mutedBy: sd.mutedBy || null,
        steamAction: sd.v8_steamTailAction || null,
        steamReason: sd.v8_steamTailReason || null,
        steamOn,
        steamArriving,
        steamAlready: steamOnFirst && steamOn,
        hasLog,
        gold: goldLabel === 'gold+limits' || goldLabel === 'gold-flat' || goldLabel === 'gold',
        goldConfirmed: goldLabel === 'gold+limits',
        sharpAB,
        stampedAB,
        path: sd.v8_hcStakeTier || null,
        tapeAction: sd.v8_tapeAction || null,
      });
    }
  }
}

const win = (lo, hi) => rows.filter((r) => r.date >= lo && r.date <= hi);
const disc = win(DISC_LO, DISC_HI);
const hold = win(HOLD_LO, '2099-01-01');
const steamEra = win(DISC_LO, '2099-01-01');

const tape = (rs) => rs.filter((r) => r.hasLog);
const live = (rs) => rs.filter((r) => r.live);
const recon = (rs) => rs.filter((r) => r.live || r.mutedBy === 'steam-tail');
const is23 = (r) => r.unitsPre >= 1.25 && r.unitsPre < 4;
const isFat = (r) => r.unitsPre >= 5.35;
const is4 = (r) => r.unitsPre >= 4 && r.unitsPre < 5.35;
const isLean = (r) => r.unitsPre > 0 && r.unitsPre < 1.25;

const out = [];
const push = (s = '') => { out.push(s); console.log(s); };
const cell = (label, rs, keys) => push(`${label.padEnd(42)} ${fmt(agg(rs, keys?.u || 'unitsPre', keys?.p || 'profitPre'))}`);

push(`Steam hold-up  ·  ${new Date().toISOString()}`);
push(`Discovery ${DISC_LO}–${DISC_HI}  ·  Hold-up ${HOLD_LO}+  ·  graded sides ${rows.length}`);
push('Format: N · W-L · WR (Wilson) · stake · PnL · ROI   [PRE-policy units unless marked FINAL]');
push('');

push('=== A. Did T touch 2–3u? ===');
push('Policy: 2–3u is HOLD. Floor arriving 1u→2u is the only way a ticket ENTERS 2–3u because of T.');
const hold23pre = hold.filter(is23);
const hold23live = live(hold).filter((r) => r.bandFinal === '2–3u');
const hold23nativeLive = hold23live.filter((r) => r.steamAction !== 'FLOOR');
const hold23floor = live(hold).filter((r) => r.steamAction === 'FLOOR');
const disc23live = live(disc).filter((r) => r.bandFinal === '2–3u' || (r.unitsFinal >= 1.25 && r.unitsFinal < 4));
cell('2–3u LIVE pre-T (Aug 19–30, final u)', disc23live, { u: 'unitsFinal', p: 'profitFinal' });
cell('2–3u LIVE post-T native (not floor)', hold23nativeLive, { u: 'unitsFinal', p: 'profitFinal' });
cell('2–3u LIVE post-T including floor', hold23live, { u: 'unitsFinal', p: 'profitFinal' });
cell('arriving FLOOR 1u→2u (T size change)', hold23floor, { u: 'unitsFinal', p: 'profitFinal' });
push(`  steamAction on native 2–3u live: ${[...new Set(hold23nativeLive.map((r) => r.steamAction || 'none'))].join(', ')}`);
push(`  mutedBy on native 2–3u live: ${[...new Set(hold23nativeLive.map((r) => r.mutedBy || 'none'))].join(', ')}`);
push('');
push('2–3u × steam (PRE units, reconstructed = live + steam-tail mutes)');
const d23 = recon(disc).filter(is23);
const h23 = recon(hold).filter(is23);
cell('DISC 2–3u all', d23);
cell('DISC 2–3u A/B arriving', d23.filter((r) => r.sharpAB && r.steamArriving));
cell('DISC 2–3u A/B steam at lock', d23.filter((r) => r.sharpAB && r.steamOn));
cell('DISC 2–3u no steam at lock', d23.filter((r) => !r.steamOn));
cell('HOLD 2–3u all', h23);
cell('HOLD 2–3u A/B arriving', h23.filter((r) => r.sharpAB && r.steamArriving));
cell('HOLD 2–3u A/B steam at lock', h23.filter((r) => r.sharpAB && r.steamOn));
cell('HOLD 2–3u no steam at lock', h23.filter((r) => !r.steamOn));
push('If we had required A/B steam on 2–3u post-T (CUT no-steam):');
cell('  KEEP 2–3u with A/B steam', h23.filter((r) => r.sharpAB && r.steamOn));
cell('  CUT  2–3u without A/B steam', h23.filter((r) => !(r.sharpAB && r.steamOn)));
push('');

push('=== B. Did muting fat/4u cost profit? (hold-up window, PRE units) ===');
const holdSteamMutes = hold.filter((r) => r.mutedBy === 'steam-tail');
cell('ALL steam-tail mutes', holdSteamMutes);
for (const reason of ['lean_no_arriving', 'unconfirmed_4u', 'unconfirmed_fat']) {
  cell(`  ${reason}`, holdSteamMutes.filter((r) => r.steamReason === reason));
}
cell('Fat WITH A/B steam (T kept — live)', live(hold).filter((r) => r.unitsFinal >= 5.35));
cell('Fat WITHOUT A/B steam (T muted)', holdSteamMutes.filter((r) => r.steamReason === 'unconfirmed_fat'));
cell('4u WITHOUT A/B steam (T muted)', holdSteamMutes.filter((r) => r.steamReason === 'unconfirmed_4u'));
cell('4u LIVE post-T', live(hold).filter((r) => r.bandFinal === '4u'));
cell('5u LIVE post-T (T always ships 5u)', live(hold).filter((r) => r.bandFinal === '5u'));
push('Net T vs “ship the tails too” on this window:');
{
  const actual = agg(live(hold), 'unitsFinal', 'profitFinal');
  const plusTails = {
    n: actual.n + holdSteamMutes.length,
    pnl: +(actual.pnl + agg(holdSteamMutes).pnl).toFixed(2),
  };
  push(`  ACTUAL T shipped                 ${fmt(actual)}`);
  push(`  T + ship every steam-tail mute   n=${plusTails.n}  PnL ${plusTails.pnl >= 0 ? '+' : ''}${plusTails.pnl}u  (Δ ${agg(holdSteamMutes).pnl >= 0 ? '+' : ''}${agg(holdSteamMutes).pnl}u vs T)`);
  const noFatMute = hold.filter((r) => r.live || (r.mutedBy === 'steam-tail' && r.steamReason === 'unconfirmed_fat'));
  const fatOnly = holdSteamMutes.filter((r) => r.steamReason === 'unconfirmed_fat');
  push(`  T + keep unconfirmed fat only    ${fmt(agg([...live(hold).map((r) => ({ ...r, unitsPre: r.unitsFinal, profitPre: r.profitFinal })), ...fatOnly]))}`);
  const leanOnly = holdSteamMutes.filter((r) => r.steamReason === 'lean_no_arriving');
  const u4Only = holdSteamMutes.filter((r) => r.steamReason === 'unconfirmed_4u');
  push(`  Δ from 1u cut                    ${agg(leanOnly).pnl >= 0 ? 'left' : 'saved'} ${Math.abs(agg(leanOnly).pnl).toFixed(2)}u`);
  push(`  Δ from 4u unconfirmed mute       ${agg(u4Only).pnl >= 0 ? 'left' : 'saved'} ${Math.abs(agg(u4Only).pnl).toFixed(2)}u`);
  push(`  Δ from fat unconfirmed mute      ${agg(fatOnly).pnl >= 0 ? 'left' : 'saved'} ${Math.abs(agg(fatOnly).pnl).toFixed(2)}u`);
}
push('');

push('=== C. Original steam cells — discovery vs hold-up (tape-log, PRE units, reconstructed) ===');
function steamCells(label, rs) {
  const t = tape(recon(rs));
  push(`-- ${label}  tape-log n=${t.length} --`);
  cell('tape-log reconstructed', t);
  cell('A/B + arriving', t.filter((r) => r.sharpAB && r.steamArriving));
  cell('steam arriving (any)', t.filter((r) => r.steamArriving));
  cell('A/B + steam at lock', t.filter((r) => r.sharpAB && r.steamOn));
  cell('A/B + no steam', t.filter((r) => r.sharpAB && !r.steamOn));
  cell('steam already on (on→on)', t.filter((r) => r.steamAlready));
  cell('no steam at lock', t.filter((r) => !r.steamOn));
  cell('steam at lock, no A/B', t.filter((r) => !r.sharpAB && r.steamOn));
  cell('any gold', t.filter((r) => r.gold));
  cell('gold+limits', t.filter((r) => r.goldConfirmed));
  cell('5.4u+ A/B steam', t.filter((r) => isFat(r) && r.sharpAB && r.steamOn));
  cell('5.4u+ no A/B steam', t.filter((r) => isFat(r) && !(r.sharpAB && r.steamOn)));
}
steamCells('DISCOVERY Aug 19–30 (the paper)', disc);
push('');
steamCells('HOLD-UP Aug 31+ (new 10 days)', hold);
push('');
steamCells('COMBINED Aug 19+', steamEra);
push('');

push('=== D. Luck vs process ===');
{
  const a = agg(live(hold), 'unitsFinal', 'profitFinal');
  const pPre = 0.542;
  const pPaper = 0.61;
  const pV12 = 0.549;
  push(`Post-T live: ${a.n} · ${a.w}-${a.l} · ${a.wrPct}% · +${a.pnl}u`);
  push(`P(≥${a.w} wins | n=${a.n}, p=pre-T 54.2%)   ${binomGe(a.w, a.n, pPre)?.toFixed(4)}`);
  push(`P(≥${a.w} wins | n=${a.n}, p=T-paper 61%)    ${binomGe(a.w, a.n, pPaper)?.toFixed(4)}`);
  push(`P(≥${a.w} wins | n=${a.n}, p=V12 54.9%)      ${binomGe(a.w, a.n, pV12)?.toFixed(4)}`);
  const a23 = agg(hold23nativeLive, 'unitsFinal', 'profitFinal');
  const disc23a = agg(disc23live, 'unitsFinal', 'profitFinal');
  push(`Native 2–3u WR pre-T ${disc23a.wrPct}% → post-T ${a23.wrPct}%`);
  if (a23.n && disc23a.wr) {
    push(`P(≥${a23.w} wins on 2–3u | n=${a23.n}, p=pre-T 2–3u ${disc23a.wr.toFixed(3)})  ${binomGe(a23.w, a23.n, disc23a.wr)?.toFixed(4)}`);
  }
  const noSpike = live(hold).filter((r) => r.date !== '2026-09-01');
  cell('post-T minus Sep 1 spike (FINAL)', noSpike, { u: 'unitsFinal', p: 'profitFinal' });
  const noSep8 = live(hold).filter((r) => r.date !== '2026-09-08');
  cell('post-T minus Sep 8 red day (FINAL)', noSep8, { u: 'unitsFinal', p: 'profitFinal' });
  push(`Green days post-T: ${[...new Set(live(hold).filter((r) => r.live).map((r) => r.date))].length} calendar days with a live ticket`);
}
push('');

push('=== E. Are we maximizing? Recipe CFs on HOLD-UP window (PRE units, recon book) ===');
{
  const book = recon(hold);
  const ship = (pred) => book.filter(pred);
  const Tpred = (r) => {
    if (isLean(r)) return !!(r.sharpAB && r.steamArriving);
    if (r.bandPre === '4u' || isFat(r)) return !!(r.sharpAB && r.steamOn);
    return true; // 2–3u and 5u
  };
  const Cpred = (r) => {
    if (isLean(r)) return !!(r.sharpAB && r.steamArriving);
    if (isFat(r)) return !!(r.sharpAB && r.steamOn);
    return true;
  };
  const keepFat = (r) => {
    if (isLean(r)) return !!(r.sharpAB && r.steamArriving);
    if (r.bandPre === '4u') return !!(r.sharpAB && r.steamOn);
    return true; // keep fat + 2–3u + 5u
  };
  const steamOn23 = (r) => {
    if (!Tpred(r)) return false;
    if (is23(r) && !(r.sharpAB && r.steamOn)) return false;
    return true;
  };
  const arrivingOnly = (r) => !!(r.sharpAB && r.steamArriving);
  const cut1uOnly = (r) => !isLean(r) || !!(r.sharpAB && r.steamArriving);
  const muteAllFat = (r) => Tpred(r) && !isFat(r);
  cell('Actual T live (FINAL units)', live(hold), { u: 'unitsFinal', p: 'profitFinal' });
  cell('T reconstructed (PRE, should ≈ actual + floor Δ)', ship(Tpred));
  cell('C (mute fat unless A/B steam; KEEP 4u)', ship(Cpred));
  cell('T but KEEP unconfirmed fat', ship(keepFat));
  cell('T + ALSO require A/B steam on 2–3u', ship(steamOn23));
  cell('ONLY-ship A/B arriving (~2/day paper)', ship(arrivingOnly));
  cell('Cut 1u only (keep fat + 4u)', ship(cut1uOnly));
  cell('Mute ALL fat (even with steam)', ship(muteAllFat));
}
push('');
push('=== E2. Same recipes on COMBINED steam era (Aug 19+) ===');
{
  const book = recon(steamEra);
  const Tpred = (r) => {
    if (isLean(r)) return !!(r.sharpAB && r.steamArriving);
    if (r.bandPre === '4u' || isFat(r)) return !!(r.sharpAB && r.steamOn);
    return true;
  };
  const keepFat = (r) => {
    if (isLean(r)) return !!(r.sharpAB && r.steamArriving);
    if (r.bandPre === '4u') return !!(r.sharpAB && r.steamOn);
    return true;
  };
  const steamOn23 = (r) => Tpred(r) && (!(is23(r)) || (r.sharpAB && r.steamOn));
  const arrivingOnly = (r) => !!(r.sharpAB && r.steamArriving);
  cell('T', book.filter(Tpred));
  cell('T keep fat', book.filter(keepFat));
  cell('T + steam-gate 2–3u', book.filter(steamOn23));
  cell('Only A/B arriving', book.filter(arrivingOnly));
}

push('');
push('=== F. Fat cell hold-up (the original −8.9% leak) ===');
cell('DISC 5.4u+ no A/B steam', recon(disc).filter((r) => isFat(r) && !(r.sharpAB && r.steamOn)));
cell('HOLD 5.4u+ no A/B steam', recon(hold).filter((r) => isFat(r) && !(r.sharpAB && r.steamOn)));
cell('COMBINED 5.4u+ no A/B steam', recon(steamEra).filter((r) => isFat(r) && !(r.sharpAB && r.steamOn)));
cell('DISC 5.4u+ WITH A/B steam', recon(disc).filter((r) => isFat(r) && r.sharpAB && r.steamOn));
cell('HOLD 5.4u+ WITH A/B steam', recon(hold).filter((r) => isFat(r) && r.sharpAB && r.steamOn));
cell('COMBINED 5.4u+ WITH A/B steam', recon(steamEra).filter((r) => isFat(r) && r.sharpAB && r.steamOn));

mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/steam_holdup.md', out.join('\n'));
writeFileSync('/opt/cursor/artifacts/steam_holdup.json', JSON.stringify({
  generatedAt: new Date().toISOString(),
  n: rows.length,
  holdLive: agg(live(hold), 'unitsFinal', 'profitFinal'),
  hold23native: agg(hold23nativeLive, 'unitsFinal', 'profitFinal'),
  disc23: agg(disc23live, 'unitsFinal', 'profitFinal'),
  holdSteamMutes: agg(holdSteamMutes),
}, null, 2));
console.error('wrote /opt/cursor/artifacts/steam_holdup.md');

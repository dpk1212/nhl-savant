/**
 * exportSharpTierCellStats.js
 *
 * As-of day-of Sharp tier (flatDollar Q among CONFIRMED-in-sport) × size band
 * × opposed/unopposed historic WR / $ROI lookup for Action row stamps.
 *
 * Opposition matches Action desk: other as-of CONFIRMED on opposite side of
 * sport|gameKey|marketType with counted size ≥ 0.10×.
 *
 * Stamp contract (applied client-side via src/lib/sharpTierCellStats.js):
 *   exact cell → tier×size → tier×sized/light → hide (min n = 40)
 *
 * Usage:
 *   node scripts/exportSharpTierCellStats.js
 *   node scripts/exportSharpTierCellStats.js --write-firebase
 *
 * Out:
 *   data/sharp-tier-cell-stats.json
 *   public/sharp-tier-cell-stats.json
 *   Firestore sharpFlowMeta/sharpTierCellStats (with --write-firebase)
 *
 * Cadence: grade-sharp-actions.yml after exportWalletProfiles.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const argv = new Set(process.argv.slice(2));
const WRITE_FB = argv.has('--write-firebase');

if (!admin.apps.length) {
  const sakPath = join(ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
const db = admin.firestore();

const V8_CUTOVER = '2026-04-18';
const FROM = '2026-06-15';
const COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };
const WHITELIST_MIN_BETS = 2;
const B_ONLY_MIN_BETS = 5;
const MIN_N_FEAT = 8;
/** Match Action MODEL_MIN_SIZE — token bets don't count as opposed money. */
const COUNTED_MIN_SIZE = 0.10;
const TIER_LETTER = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
const SIZE_BANDS = ['light', 'lean', 'full', 'press'];
const STAMP_MIN_N = 40;

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => (Number.isFinite(odds) && odds !== 0
  ? (won ? americanToDecimal(odds) - 1 : -1) : null);
const shortWalletId = (w) => String(w || '').replace(/^0x/i, '').slice(-6).toLowerCase();

function picksAgg(bets) {
  const n = bets.length;
  const wins = bets.filter((b) => b.won === 1).length;
  const flatBets = bets.filter((b) => Number.isFinite(b.flat));
  const flatPnl = flatBets.reduce((s, b) => s + b.flat, 0);
  return {
    n, wins,
    wr: n ? (100 * wins) / n : null,
    flatRoi: flatBets.length ? (100 * flatPnl) / flatBets.length : null,
  };
}
function positionsAgg(bets) {
  const n = bets.length;
  const wins = bets.filter((b) => b.won === 1).length;
  const invested = bets.reduce((s, b) => s + b.invested, 0);
  const pnl = bets.reduce((s, b) => s + b.settledPnl, 0);
  const flatSum = bets.reduce((s, b) => s + (b.flat ?? 0), 0);
  return {
    n, wins,
    wr: n ? (100 * wins) / n : null,
    dollarRoi: invested > 0 ? (100 * pnl) / invested : null,
    positionFlatRoi: n ? (100 * flatSum) / n : null,
  };
}
function classifyTier(p, q) {
  p = p || { n: 0 }; q = q || { n: 0 };
  const flatOkA = p.n >= WHITELIST_MIN_BETS && (p.flatRoi ?? 0) > 0;
  const flatOkB = q.n >= B_ONLY_MIN_BETS && (q.positionFlatRoi ?? 0) > 0;
  const dollarOk = q.n >= WHITELIST_MIN_BETS && q.dollarRoi != null && q.dollarRoi > 0;
  if ((flatOkA || flatOkB) && dollarOk) return 'CONFIRMED';
  if (flatOkA || flatOkB) return 'FLAT';
  return null;
}

function isCountedSize(sr) {
  if (!Number.isFinite(sr)) return true; // legacy — match Action
  return sr >= COUNTED_MIN_SIZE;
}

function sizeBand(sr) {
  if (!Number.isFinite(sr) || sr <= 0) return null;
  if (sr < 0.5) return 'light';
  if (sr < 1.0) return 'lean';
  if (sr < 1.5) return 'full';
  return 'press';
}

function zScores(xs) {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length) || 1;
  return { z: xs.map((x) => (x - m) / sd), m, sd };
}

function assignQ(scoreByWallet) {
  const arr = [...scoreByWallet.entries()].filter(([, s]) => Number.isFinite(s));
  arr.sort((a, b) => b[1] - a[1]);
  const out = new Map();
  const n = arr.length;
  if (n < 4) return out;
  arr.forEach(([w], i) => out.set(w, Math.min(4, Math.floor((i / n) * 4) + 1)));
  return out;
}

function summ(legs) {
  const n = legs.length;
  if (!n) return { n: 0, wr: null, roi: null, record: '0-0', invested: 0, pnl: 0 };
  const w = legs.filter((l) => l.won === 1).length;
  const inv = legs.reduce((s, l) => s + l.invested, 0);
  const pnl = legs.reduce((s, l) => s + l.settledPnl, 0);
  return {
    n,
    record: `${w}-${n - w}`,
    wr: +((100 * w) / n).toFixed(1),
    roi: inv > 0 ? +((100 * pnl) / inv).toFixed(1) : null,
    invested: Math.round(inv),
    pnl: Math.round(pnl),
  };
}

/** Action-matching cluster (no line pin). */
function clusterKey(pos) {
  return `${pos.date}|${pos.sport}|${pos.gameKey || 'nogame'}|${pos.marketType}`;
}

async function loadWalletBets() {
  const bets = [];
  for (const [col] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V8_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      if (!Object.values(sides).some((s) => s.result?.outcome === 'WIN' || s.result?.outcome === 'LOSS')) continue;
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk].result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      if (!winningSide) continue;
      const seen = new Set();
      for (const [, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          const short = shortWalletId(w.wallet);
          const k = `${doc.id}_${short}`;
          if (seen.has(k)) continue;
          seen.add(k);
          const betOdds = sides[w.side]?.peak?.odds ?? sides[w.side]?.lock?.odds ?? peak.odds ?? 0;
          const won = w.side === winningSide ? 1 : 0;
          bets.push({
            date: d.date, sport: d.sport, wallet: short, won,
            flat: flatProfit(betOdds, won === 1),
          });
        }
      }
    }
  }
  return bets;
}

async function loadPositions() {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach((doc) => {
    const d = doc.data();
    if (!d.wallet || !d.date || !d.sport) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    if (invested <= 0 || Math.abs(settledPnl) <= 1e-9) return;
    const stampedSr = Number(d.sizeRatio ?? d.betMultiplier ?? d.v8_sizeRatio);
    const avgSportBet = Number(d.avgSportBet);
    const side = String(d.side || '').toLowerCase();
    if (!side || !OPPOSITE[side]) return;
    rows.push({
      date: d.date,
      sport: d.sport,
      walletShort: d.walletShort || shortWalletId(d.wallet),
      invested,
      settledPnl,
      won: settledPnl > 0 ? 1 : 0,
      sizeRatio: Number.isFinite(stampedSr) && stampedSr > 0 ? stampedSr
        : (Number.isFinite(avgSportBet) && avgSportBet > 0 ? invested / avgSportBet : null),
      side,
      marketType: d.marketType || 'ML',
      gameKey: d.gameKey || null,
    });
  });
  return rows;
}

function buildProfiles(priorBets, priorPos) {
  const pickBy = new Map();
  const posBy = new Map();
  for (const b of priorBets) {
    const k = `${b.wallet}|${b.sport}`;
    if (!pickBy.has(k)) pickBy.set(k, []);
    pickBy.get(k).push(b);
  }
  for (const b of priorPos) {
    const k = `${b.walletShort}|${b.sport}`;
    if (!posBy.has(k)) posBy.set(k, []);
    posBy.get(k).push(b);
  }
  const profiles = new Map();
  for (const key of new Set([...pickBy.keys(), ...posBy.keys()])) {
    const [wallet, sport] = key.split('|');
    const picks = picksAgg(pickBy.get(key) || []);
    const positions = positionsAgg(posBy.get(key) || []);
    const tier = classifyTier(picks, positions);
    if (!profiles.has(wallet)) profiles.set(wallet, { bySport: {} });
    profiles.get(wallet).bySport[sport] = { tier, picks, positions };
  }
  return profiles;
}

function addToBucket(map, key, leg) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(leg);
}

(async () => {
  console.log('Loading graded positions + wallet bets…');
  const walletBets = await loadWalletBets();
  const positions = await loadPositions();
  console.log(`bets ${walletBets.length} · positions ${positions.length}`);

  const betsByDate = new Map();
  const posByDate = new Map();
  for (const b of walletBets) {
    if (!betsByDate.has(b.date)) betsByDate.set(b.date, []);
    betsByDate.get(b.date).push(b);
  }
  for (const b of positions) {
    if (!posByDate.has(b.date)) posByDate.set(b.date, []);
    posByDate.get(b.date).push(b);
  }
  const allDates = [...new Set([...betsByDate.keys(), ...posByDate.keys()])].sort();

  let priorBets = [];
  let priorPos = [];
  const dayMeta = new Map();

  for (const D of allDates) {
    const profiles = buildProfiles(priorBets, priorPos);
    const sports = new Set();
    for (const [, p] of profiles) for (const sp of Object.keys(p.bySport)) sports.add(sp);

    const qBySport = new Map();
    const confirmedWalletsBySport = new Map();

    for (const sport of sports) {
      const confirmed = new Set();
      const rows = [];
      for (const [wallet, p] of profiles) {
        const bs = p.bySport[sport];
        if (bs?.tier !== 'CONFIRMED') continue;
        confirmed.add(wallet);
        const flatRoi = bs.picks?.n >= MIN_N_FEAT && Number.isFinite(bs.picks.flatRoi) ? bs.picks.flatRoi
          : (bs.positions?.n >= MIN_N_FEAT && Number.isFinite(bs.positions.positionFlatRoi)
            ? bs.positions.positionFlatRoi : null);
        const dollarRoi = bs.positions?.n >= MIN_N_FEAT && Number.isFinite(bs.positions.dollarRoi)
          ? bs.positions.dollarRoi : null;
        rows.push({ wallet, flatRoi, dollarRoi });
      }
      confirmedWalletsBySport.set(sport, confirmed);
      if (rows.length < 4) continue;

      const elFd = rows.filter((r) => Number.isFinite(r.flatRoi) && Number.isFinite(r.dollarRoi));
      let flatDollar = new Map();
      if (elFd.length >= 4) {
        const zf = zScores(elFd.map((r) => r.flatRoi)).z;
        const zd = zScores(elFd.map((r) => r.dollarRoi)).z;
        const m = new Map();
        elFd.forEach((r, i) => m.set(r.wallet, zf[i] + zd[i]));
        flatDollar = assignQ(m);
      }
      qBySport.set(sport, flatDollar);
    }

    dayMeta.set(D, { profiles, qBySport, confirmedWalletsBySport });
    if (betsByDate.has(D)) priorBets = priorBets.concat(betsByDate.get(D));
    if (posByDate.has(D)) priorPos = priorPos.concat(posByDate.get(D));
  }

  // Index same-day positions for opposition (Action cluster)
  const posByCluster = new Map();
  for (const pos of positions) {
    if (!pos.gameKey) continue;
    const ck = clusterKey(pos);
    if (!posByCluster.has(ck)) posByCluster.set(ck, []);
    posByCluster.get(ck).push(pos);
  }

  const legs = [];
  let skippedNoQ = 0;
  let skippedNoGame = 0;
  for (const pos of positions) {
    if (pos.date < FROM) continue;
    const meta = dayMeta.get(pos.date);
    if (!meta) continue;
    const tier = meta.profiles.get(pos.walletShort)?.bySport?.[pos.sport]?.tier;
    if (tier !== 'CONFIRMED') continue;
    const qMap = meta.qBySport.get(pos.sport);
    const q = qMap?.get(pos.walletShort) ?? null;
    if (!q) { skippedNoQ++; continue; }
    const band = sizeBand(pos.sizeRatio);
    if (!band) continue;
    if (!pos.gameKey) { skippedNoGame++; continue; }

    const oppSide = OPPOSITE[pos.side];
    const peers = posByCluster.get(clusterKey(pos)) || [];
    const confirmedSet = meta.confirmedWalletsBySport.get(pos.sport) || new Set();
    let nConfirmedAg = 0;
    for (const p of peers) {
      if (p.side !== oppSide) continue;
      if (p.walletShort === pos.walletShort) continue;
      if (!confirmedSet.has(p.walletShort)) continue;
      if (!isCountedSize(p.sizeRatio)) continue;
      nConfirmedAg++;
    }
    const unopposed = nConfirmedAg === 0;

    legs.push({
      date: pos.date,
      sport: pos.sport,
      won: pos.won,
      invested: pos.invested,
      settledPnl: pos.settledPnl,
      sizeBand: band,
      sized: band === 'light' ? 'light' : 'sized',
      tier: TIER_LETTER[q],
      q,
      unopposed,
      opp: unopposed ? 'unopposed' : 'opposed',
    });
  }

  // ── Aggregate buckets ───────────────────────────────────────────
  const cells = new Map();
  const byTierSize = new Map();
  const byTierSized = new Map();
  const byTier = new Map();
  const byOpp = new Map();

  for (const l of legs) {
    addToBucket(cells, `${l.tier}|${l.sizeBand}|${l.opp}`, l);
    addToBucket(byTierSize, `${l.tier}|${l.sizeBand}`, l);
    addToBucket(byTierSized, `${l.tier}|${l.sized}`, l);
    addToBucket(byTier, l.tier, l);
    addToBucket(byOpp, l.opp, l);
  }

  const toObj = (map) => {
    const o = {};
    for (const [k, arr] of [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      o[k] = summ(arr);
    }
    return o;
  };

  // Ensure full 32-cell grid keys exist (even empty) for product clarity
  const cellsFull = {};
  for (const t of ['A', 'B', 'C', 'D']) {
    for (const b of SIZE_BANDS) {
      for (const opp of ['unopposed', 'opposed']) {
        const k = `${t}|${b}|${opp}`;
        cellsFull[k] = cells.has(k) ? summ(cells.get(k)) : summ([]);
      }
    }
  }

  const stampableExact = Object.entries(cellsFull)
    .filter(([, s]) => s.n >= STAMP_MIN_N)
    .map(([k, s]) => ({ key: k, ...s }));

  const out = {
    version: 1,
    method: [
      'As-of CONFIRMED-in-sport graded sharp_action_positions from',
      FROM,
      '+. Sharp tier = day-of flatDollar Q (z(flatRoi)+z(dollarRoi)) among CONFIRMED in that sport.',
      'Size bands: light <0.5×, lean 0.5–1×, full 1–1.5×, press ≥1.5× (stamped cross-sport sizeRatio).',
      'Unopposed = zero other as-of CONFIRMED on opposite side of date|sport|gameKey|marketType with size ≥0.10× (Action-matched).',
    ].join(' '),
    generatedAt: new Date().toISOString(),
    from: FROM,
    stamp: {
      minN: STAMP_MIN_N,
      hideBelow: 20,
      ladder: ['exact (tier|size|opp)', 'tier|size', 'tier|sized|light', 'hide'],
    },
    universe: {
      ...summ(legs),
      skippedNoQ,
      skippedNoGameKey: skippedNoGame,
      pctUnopposed: legs.length
        ? +((100 * legs.filter((l) => l.unopposed).length) / legs.length).toFixed(1)
        : null,
    },
    byOpp: toObj(byOpp),
    byTier: toObj(byTier),
    byTierSized: toObj(byTierSized),
    byTierSize: toObj(byTierSize),
    cells: cellsFull,
    stampableExact,
  };

  const dataDir = join(ROOT, 'data');
  const publicDir = join(ROOT, 'public');
  mkdirSync(dataDir, { recursive: true });
  mkdirSync(publicDir, { recursive: true });
  const dataPath = join(dataDir, 'sharp-tier-cell-stats.json');
  const publicPath = join(publicDir, 'sharp-tier-cell-stats.json');
  const json = JSON.stringify(out, null, 2);
  writeFileSync(dataPath, json);
  writeFileSync(publicPath, json);
  console.log(`Wrote ${dataPath}`);
  console.log(`Wrote ${publicPath}`);
  console.log(JSON.stringify({
    universe: out.universe,
    byTier: out.byTier,
    byOpp: out.byOpp,
    stampableExactN: stampableExact.length,
    sampleStampable: stampableExact.slice(0, 8),
  }, null, 2));

  if (WRITE_FB) {
    await db.collection('sharpFlowMeta').doc('sharpTierCellStats').set(out);
    console.log('Wrote Firestore sharpFlowMeta/sharpTierCellStats');
  } else {
    console.log('(Dry run for Firebase — pass --write-firebase to publish)');
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

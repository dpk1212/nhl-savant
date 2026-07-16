/**
 * Whitelist deep dive: internal tracked W/L/PnL vs Polymarket API,
 * plus CLV leaderboard (retrocomputed from entry + closingPinnacleOdds
 * because historical clv field is still null until new grades land).
 *
 * Output: /tmp/whitelist_deep_dive.json
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = 'https://data-api.polymarket.com';
const OUT = '/tmp/whitelist_deep_dive.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(readFileSync(join(ROOT, 'serviceAccountKey.json'), 'utf8'))),
  });
}
const db = admin.firestore();

function impliedProb(odds) {
  if (odds == null || odds === 0 || !Number.isFinite(Number(odds))) return null;
  const o = Number(odds);
  return o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100);
}
const rnd = (x, n = 1) => (x == null || !Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchJson(url, attempts = 3) {
  for (let a = 0; a < attempts; a++) {
    try {
      const r = await fetch(url, { headers: { accept: 'application/json' } });
      if (!r.ok) {
        if (a < attempts - 1) { await sleep(200 * (a + 1)); continue; }
        return null;
      }
      return await r.json();
    } catch {
      if (a < attempts - 1) { await sleep(300 * (a + 1)); continue; }
      return null;
    }
  }
  return null;
}

function computeClv(pos) {
  const close = pos.closingPinnacleOdds;
  const closeProb = impliedProb(close);
  if (closeProb == null) return null;
  const entryPinn = pos.entryPinnacleOdds ?? pos.pinnacleOdds ?? null;
  if (entryPinn != null) {
    const ep = impliedProb(entryPinn);
    if (ep != null) return { clv: rnd((closeProb - ep) * 100, 2), source: 'pinnacle' };
  }
  const entryPm = pos.entryAvgPrice ?? pos.avgPrice ?? null;
  if (entryPm != null && entryPm > 0.01 && entryPm < 0.99) {
    return { clv: rnd((closeProb - entryPm) * 100, 2), source: 'polymarket' };
  }
  return null;
}

async function mapPool(items, concurrency, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return out;
}

(async () => {
  console.log('Loading profiles + graded positions…');
  const [profSnap, gradedSnap] = await Promise.all([
    db.collection('sharpWalletProfiles').get(),
    db.collection('sharp_action_positions').where('status', '==', 'GRADED').get(),
  ]);

  // Resolve addresses: profile.walletAddress or sports_sharps suffix match
  let sharps = {};
  const ssPath = join(ROOT, 'public/sports_sharps.json');
  if (existsSync(ssPath)) sharps = JSON.parse(readFileSync(ssPath, 'utf8'));
  const addrByShort = new Map();
  for (const [addr, v] of Object.entries(sharps)) {
    if (!addr.startsWith('0x')) continue;
    addrByShort.set(addr.slice(-6).toLowerCase(), addr.toLowerCase());
    if (v?.wallet) addrByShort.set(String(v.wallet).slice(-6).toLowerCase(), addr.toLowerCase());
  }

  // Whitelist wallets: any sport CONFIRMED or FLAT (proven) — also include WR50 for CLV context
  const wallets = [];
  for (const doc of profSnap.docs) {
    const p = doc.data();
    const short = (p.walletShort || doc.id).toLowerCase().slice(-6);
    const sports = [];
    let bestTier = null;
    for (const [sport, rec] of Object.entries(p.bySport || {})) {
      const t = rec.whitelistTier;
      if (!t) continue;
      sports.push({
        sport,
        tier: t,
        src: rec.whitelistSource || null,
        picksN: +(rec.picks?.n || 0),
        picksW: +(rec.picks?.wins || 0),
        picksL: +(rec.picks?.losses || 0),
        picksWr: rec.picks?.wr ?? null,
        picksFlatPnl: rec.picks?.flatPnl ?? null,
        picksFlatRoi: rec.picks?.flatRoi ?? null,
        posN: +(rec.positions?.n || 0),
        posW: +(rec.positions?.wins || 0),
        posL: +(rec.positions?.losses || 0),
        posWr: rec.positions?.wr ?? null,
        dollarRoi: rec.positions?.dollarRoi ?? null,
        settledPnl: rec.positions?.settledPnl ?? null,
        invested: rec.positions?.invested ?? null,
        posFlatRoi: rec.positions?.positionFlatRoi ?? null,
      });
      if (t === 'CONFIRMED' || (t === 'FLAT' && bestTier !== 'CONFIRMED') || (!bestTier && t === 'WR50')) {
        bestTier = t === 'CONFIRMED' ? 'CONFIRMED' : t === 'FLAT' ? 'FLAT' : bestTier || 'WR50';
      }
    }
    if (!sports.length) continue;
    const provenSports = sports.filter(s => s.tier === 'CONFIRMED' || s.tier === 'FLAT');
    if (!provenSports.length && !sports.some(s => s.tier === 'WR50')) continue;

    const addr = (p.walletAddress && String(p.walletAddress).startsWith('0x'))
      ? String(p.walletAddress).toLowerCase()
      : (addrByShort.get(short) || null);

    // Internal totals across ALL sports on profile (not just proven)
    const intPicks = p.picks || {};
    const intPos = p.positions || {};

    wallets.push({
      short,
      addr,
      name: null,
      bestTier: provenSports.some(s => s.tier === 'CONFIRMED') ? 'CONFIRMED'
        : provenSports.length ? 'FLAT' : 'WR50',
      confirmedSports: sports.filter(s => s.tier === 'CONFIRMED').map(s => s.sport),
      flatSports: sports.filter(s => s.tier === 'FLAT').map(s => s.sport),
      wr50Sports: sports.filter(s => s.tier === 'WR50').map(s => s.sport),
      sports,
      internal: {
        picksN: +(intPicks.n || 0),
        picksW: +(intPicks.wins || 0),
        picksL: +(intPicks.losses || 0),
        picksWr: intPicks.wr ?? null,
        picksFlatPnl: intPicks.flatPnl ?? null,
        picksFlatRoi: intPicks.flatRoi ?? null,
        posN: +(intPos.n || 0),
        posW: +(intPos.wins || 0),
        posL: +(intPos.losses || 0),
        posWr: intPos.wr ?? null,
        settledPnl: intPos.settledPnl ?? null,
        dollarRoi: intPos.dollarRoi ?? null,
        invested: intPos.invested ?? null,
        posFlatRoi: intPos.positionFlatRoi ?? null,
      },
      sizeSignal: p.sizeSignal || null,
      verdict: p.verdict || null,
    });
  }

  // Proven-only set for main tables; keep WR50 for CLV pool
  const proven = wallets.filter(w => w.bestTier === 'CONFIRMED' || w.bestTier === 'FLAT');
  console.log(`Whitelist profiles with tiers: ${wallets.length} (proven C+F: ${proven.length})`);

  // CLV from graded positions keyed by walletShort
  const clvByWallet = new Map(); // short -> { n, sum, wins, losses, settledPnl, invested, bySource }
  let clvEligible = 0, clvComputed = 0, clvNull = 0;
  for (const doc of gradedSnap.docs) {
    const pos = doc.data();
    const short = (pos.walletShort || (pos.wallet || '').slice(-6) || '').toLowerCase();
    if (!short) continue;
    const computed = computeClv(pos);
    clvEligible++;
    if (!computed) { clvNull++; continue; }
    clvComputed++;
    if (!clvByWallet.has(short)) {
      clvByWallet.set(short, {
        n: 0, sum: 0, wins: 0, losses: 0, pushes: 0,
        settledPnl: 0, invested: 0, pinnacle: 0, polymarket: 0,
      });
    }
    const c = clvByWallet.get(short);
    c.n++;
    c.sum += computed.clv;
    if (computed.source === 'pinnacle') c.pinnacle++;
    else c.polymarket++;
    if (pos.result === 'WIN') c.wins++;
    else if (pos.result === 'LOSS') c.losses++;
    else c.pushes++;
    c.settledPnl += Number(pos.settledPnl || 0);
    c.invested += Number(pos.invested || 0);
  }
  console.log(`CLV retro: eligible graded=${clvEligible}, computed=${clvComputed}, no-entry=${clvNull}`);

  // Attach CLV to wallets
  for (const w of wallets) {
    const c = clvByWallet.get(w.short);
    if (!c || c.n < 1) {
      w.clv = null;
      continue;
    }
    w.clv = {
      n: c.n,
      avgClv: rnd(c.sum / c.n, 2),
      wr: rnd(100 * c.wins / Math.max(1, c.wins + c.losses), 1),
      wins: c.wins,
      losses: c.losses,
      settledPnl: rnd(c.settledPnl, 0),
      invested: rnd(c.invested, 0),
      dollarRoi: c.invested > 0 ? rnd(100 * c.settledPnl / c.invested, 1) : null,
      pinnacleN: c.pinnacle,
      polymarketN: c.polymarket,
    };
  }

  // API fetch for proven wallets with addresses (cap concurrency)
  const withAddr = proven.filter(w => w.addr);
  console.log(`Fetching Polymarket API for ${withAddr.length} proven wallets…`);
  await mapPool(withAddr, 4, async (w) => {
    try {
      const [lbSport, lbMonth, value, traded, closed] = await Promise.all([
        fetchJson(`${DATA}/v1/leaderboard?category=SPORTS&timePeriod=ALL&user=${w.addr}&limit=1`),
        fetchJson(`${DATA}/v1/leaderboard?category=SPORTS&timePeriod=MONTH&user=${w.addr}&limit=1`),
        fetchJson(`${DATA}/value?user=${w.addr}`),
        fetchJson(`${DATA}/traded?user=${w.addr}`),
        fetchJson(`${DATA}/closed-positions?user=${w.addr}&limit=50&sortBy=TIMESTAMP&sortDirection=DESC`),
      ]);
      const lb = Array.isArray(lbSport) ? lbSport[0] : null;
      const lbm = Array.isArray(lbMonth) ? lbMonth[0] : null;
      const val = Array.isArray(value) ? value[0]?.value : (value?.value ?? null);
      const tradedN = traded?.traded ?? null;

      let closedN = 0, closedPnl = 0, closedWins = 0, closedLosses = 0;
      if (Array.isArray(closed)) {
        for (const p of closed) {
          closedN++;
          const rp = Number(p.realizedPnl || 0);
          closedPnl += rp;
          const cp = Number(p.curPrice || 0);
          if (cp >= 0.95) closedWins++;
          else if (cp <= 0.05) closedLosses++;
        }
      }

      w.name = lb?.userName || lbm?.userName || null;
      w.api = {
        sportsRank: lb?.rank != null ? Number(lb.rank) : null,
        sportsPnl: lb?.pnl != null ? rnd(lb.pnl, 0) : null,
        sportsVol: lb?.vol != null ? rnd(lb.vol, 0) : null,
        sportsRoi: lb?.vol > 0 ? rnd(100 * lb.pnl / lb.vol, 1) : null,
        monthPnl: lbm?.pnl != null ? rnd(lbm.pnl, 0) : null,
        monthVol: lbm?.vol != null ? rnd(lbm.vol, 0) : null,
        portfolioValue: val != null ? rnd(Number(val), 0) : null,
        marketsTraded: tradedN,
        recentClosedN: closedN || null,
        recentClosedPnl: closedN ? rnd(closedPnl, 0) : null,
        recentClosedWr: (closedWins + closedLosses) > 0
          ? rnd(100 * closedWins / (closedWins + closedLosses), 1) : null,
        xUsername: lb?.xUsername || null,
        verifiedBadge: lb?.verifiedBadge ?? null,
      };
    } catch (e) {
      w.api = { error: String(e.message || e) };
    }
    await sleep(80);
    return w;
  });

  // ── Summaries ──
  const sumInternal = (arr) => {
    let picksW = 0, picksL = 0, flatPnl = 0, posW = 0, posL = 0, settled = 0, invested = 0;
    for (const w of arr) {
      picksW += w.internal.picksW;
      picksL += w.internal.picksL;
      flatPnl += Number(w.internal.picksFlatPnl || 0);
      posW += w.internal.posW;
      posL += w.internal.posL;
      settled += Number(w.internal.settledPnl || 0);
      invested += Number(w.internal.invested || 0);
    }
    const picksN = picksW + picksL;
    const posN = posW + posL;
    return {
      wallets: arr.length,
      picksN, picksW, picksL,
      picksWr: picksN ? rnd(100 * picksW / picksN, 1) : null,
      picksFlatPnl: rnd(flatPnl, 1),
      posN, posW, posL,
      posWr: posN ? rnd(100 * posW / posN, 1) : null,
      settledPnl: rnd(settled, 0),
      invested: rnd(invested, 0),
      dollarRoi: invested > 0 ? rnd(100 * settled / invested, 1) : null,
    };
  };

  const withApi = proven.filter(w => w.api?.sportsPnl != null);
  const apiTot = {
    wallets: withApi.length,
    sportsPnl: rnd(withApi.reduce((s, w) => s + (w.api.sportsPnl || 0), 0), 0),
    sportsVol: rnd(withApi.reduce((s, w) => s + (w.api.sportsVol || 0), 0), 0),
  };
  apiTot.sportsRoi = apiTot.sportsVol > 0 ? rnd(100 * apiTot.sportsPnl / apiTot.sportsVol, 1) : null;

  const withClv = wallets.filter(w => w.clv && w.clv.n >= 3);
  const clvAvg = withClv.length
    ? rnd(withClv.reduce((s, w) => s + w.clv.avgClv, 0) / withClv.length, 2)
    : null;

  const topInternalSettled = [...proven]
    .filter(w => w.internal.settledPnl != null)
    .sort((a, b) => (b.internal.settledPnl || 0) - (a.internal.settledPnl || 0))
    .slice(0, 15)
    .map(w => ({
      short: w.short, name: w.name, tier: w.bestTier,
      sports: w.confirmedSports.concat(w.flatSports).join(','),
      posN: w.internal.posN, posWr: w.internal.posWr,
      settledPnl: rnd(w.internal.settledPnl, 0),
      dollarRoi: w.internal.dollarRoi,
      picksN: w.internal.picksN, picksWr: w.internal.picksWr, picksFlatPnl: rnd(w.internal.picksFlatPnl, 1),
      apiSportsPnl: w.api?.sportsPnl ?? null, apiSportsRoi: w.api?.sportsRoi ?? null,
      avgClv: w.clv?.avgClv ?? null, clvN: w.clv?.n ?? null,
    }));

  const worstInternalSettled = [...proven]
    .filter(w => w.internal.settledPnl != null && w.internal.posN >= 3)
    .sort((a, b) => (a.internal.settledPnl || 0) - (b.internal.settledPnl || 0))
    .slice(0, 10)
    .map(w => ({
      short: w.short, name: w.name, tier: w.bestTier,
      posN: w.internal.posN, settledPnl: rnd(w.internal.settledPnl, 0),
      dollarRoi: w.internal.dollarRoi, avgClv: w.clv?.avgClv ?? null, clvN: w.clv?.n ?? null,
      apiSportsPnl: w.api?.sportsPnl ?? null,
    }));

  const topApiPnl = [...withApi]
    .sort((a, b) => (b.api.sportsPnl || 0) - (a.api.sportsPnl || 0))
    .slice(0, 15)
    .map(w => ({
      short: w.short, name: w.name, tier: w.bestTier,
      apiRank: w.api.sportsRank, apiPnl: w.api.sportsPnl, apiVol: w.api.sportsVol, apiRoi: w.api.sportsRoi,
      monthPnl: w.api.monthPnl, marketsTraded: w.api.marketsTraded, portfolioValue: w.api.portfolioValue,
      intSettled: rnd(w.internal.settledPnl, 0), intRoi: w.internal.dollarRoi,
      avgClv: w.clv?.avgClv ?? null, clvN: w.clv?.n ?? null,
    }));

  const bestClv = [...withClv]
    .sort((a, b) => b.clv.avgClv - a.clv.avgClv)
    .slice(0, 15)
    .map(w => ({
      short: w.short, name: w.name, tier: w.bestTier,
      avgClv: w.clv.avgClv, n: w.clv.n, wr: w.clv.wr,
      settledPnl: w.clv.settledPnl, dollarRoi: w.clv.dollarRoi,
      intSettled: rnd(w.internal.settledPnl, 0),
      apiSportsPnl: w.api?.sportsPnl ?? null,
      sourceMix: `${w.clv.pinnacleN}p/${w.clv.polymarketN}pm`,
    }));

  const worstClv = [...withClv]
    .sort((a, b) => a.clv.avgClv - b.clv.avgClv)
    .slice(0, 15)
    .map(w => ({
      short: w.short, name: w.name, tier: w.bestTier,
      avgClv: w.clv.avgClv, n: w.clv.n, wr: w.clv.wr,
      settledPnl: w.clv.settledPnl, dollarRoi: w.clv.dollarRoi,
      intSettled: rnd(w.internal.settledPnl, 0),
      apiSportsPnl: w.api?.sportsPnl ?? null,
      sourceMix: `${w.clv.pinnacleN}p/${w.clv.polymarketN}pm`,
    }));

  // CLV vs PnL correlation (simple)
  const both = withClv.filter(w => w.clv.settledPnl != null && w.clv.n >= 5);
  let corrHint = null;
  if (both.length >= 10) {
    const xs = both.map(w => w.clv.avgClv);
    const ys = both.map(w => w.clv.settledPnl);
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const my = ys.reduce((a, b) => a + b, 0) / ys.length;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < xs.length; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      dx += (xs[i] - mx) ** 2;
      dy += (ys[i] - my) ** 2;
    }
    corrHint = dx > 0 && dy > 0 ? rnd(num / Math.sqrt(dx * dy), 3) : null;
  }

  // Quintiles of avgClv → mean settled PnL / WR
  const sortedClv = [...withClv].filter(w => w.clv.n >= 5).sort((a, b) => a.clv.avgClv - b.clv.avgClv);
  const quintiles = [];
  if (sortedClv.length >= 10) {
    const q = 5;
    const size = Math.floor(sortedClv.length / q);
    for (let i = 0; i < q; i++) {
      const slice = sortedClv.slice(i * size, i === q - 1 ? sortedClv.length : (i + 1) * size);
      const avgClv = rnd(slice.reduce((s, w) => s + w.clv.avgClv, 0) / slice.length, 2);
      const avgPnl = rnd(slice.reduce((s, w) => s + w.clv.settledPnl, 0) / slice.length, 0);
      const avgWr = rnd(slice.reduce((s, w) => s + w.clv.wr, 0) / slice.length, 1);
      const avgRoi = rnd(slice.reduce((s, w) => s + (w.clv.dollarRoi || 0), 0) / slice.length, 1);
      quintiles.push({ q: i + 1, n: slice.length, avgClv, avgWr, avgSettledPnl: avgPnl, avgDollarRoi: avgRoi });
    }
  }

  const out = {
    meta: {
      generatedAt: new Date().toISOString(),
      provenWallets: proven.length,
      confirmed: proven.filter(w => w.bestTier === 'CONFIRMED').length,
      flat: proven.filter(w => w.bestTier === 'FLAT').length,
      withAddress: withAddr.length,
      gradedPositions: gradedSnap.size,
      clvRetro: { eligible: clvEligible, computed: clvComputed, noEntry: clvNull, walletsWithClvGe3: withClv.length },
      note: 'CLV retrocomputed: closePinnacle − entry (entryPinnacleOdds|pinnacleOdds, else entryAvgPrice|avgPrice). Stored clv field still null historically.',
    },
    internalTotals: {
      allProven: sumInternal(proven),
      confirmedOnly: sumInternal(proven.filter(w => w.bestTier === 'CONFIRMED')),
      flatOnly: sumInternal(proven.filter(w => w.bestTier === 'FLAT')),
    },
    apiTotals: apiTot,
    clvSummary: {
      walletsWithClvGe3: withClv.length,
      meanAvgClv: clvAvg,
      corrAvgClvVsSettledPnl_nGe5: corrHint,
      quintiles,
    },
    topInternalSettled,
    worstInternalSettled,
    topApiSportsPnl: topApiPnl,
    bestClv,
    worstClv,
  };

  writeFileSync(OUT, JSON.stringify(out));
  // Compact wallet dump for canvas (proven only, key fields)
  writeFileSync('/tmp/whitelist_deep_dive_wallets.json', JSON.stringify(
    proven.map(w => ({
      short: w.short, name: w.name, tier: w.bestTier,
      confirmed: w.confirmedSports, flat: w.flatSports,
      int: w.internal, api: w.api || null, clv: w.clv,
    }))
  ));
  console.log('Wrote', OUT);
  console.log(JSON.stringify({
    meta: out.meta,
    internalTotals: out.internalTotals,
    apiTotals: out.apiTotals,
    clvSummary: out.clvSummary,
    bestClvTop3: out.bestClv.slice(0, 3),
    worstClvTop3: out.worstClv.slice(0, 3),
  }, null, 2));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

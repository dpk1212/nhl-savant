/**
 * Discover fat tickets on today's games → official sports PnL gate →
 * MM/trader fail-closed check → supplemental scan list.
 *
 * Does NOT invent W/L books. Sport $ is leaderboard category=SPORTS only.
 *
 * Usage: node scripts/discoverScanSupplement.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { isWNBAMarketTitle } from './lib/wnbaTeams.js';
import { isNFLMarketTitle } from './lib/nflTeams.js';
import { isUFCMarketTitle } from './lib/ufcFighters.js';
import { isSoccerMarketTitle } from './lib/soccerTeams.js';
import { isNonFullGameTotalMarket } from './lib/totalMarketFilter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const DATA = 'https://data-api.polymarket.com';
const GAMMA = 'https://gamma-api.polymarket.com';
const OUT_PATH = join(PUBLIC, 'sharp_scan_supplement.json');

const MIN_POSITION_USD = 2000;
const REJECT_TTL_MS = 24 * 60 * 60 * 1000;
const CLOSED_CAP = 300;
const HOLDERS_LIMIT = 100;
const PAGE_DELAY_MS = 80;
const CHURN_VOL_PNL = 100;
const CHURN_ROI_MAX = 2;
const BOTH_SIDES_REJECT = 25;
const BOTH_SIDES_PASS = 15;
const HOLD_PASS = 55;
const EARLY_FLIP = 55;
const HOLD_FLIP_MAX = 40;
const MIN_SPORTS_MARKETS = 8;

const SPORT_KEYS = ['NHL', 'CBB', 'MLB', 'NBA', 'SOC', 'UFC', 'WNBA', 'NFL'];

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadJSON(filename) {
  const p = join(PUBLIC, filename);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

function parseJsonField(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return []; }
  }
  return [];
}

function classifySport(title) {
  const t = (title || '').toLowerCase();
  if (isWNBAMarketTitle(title)) return 'WNBA';
  if (isNFLMarketTitle(title)) return 'NFL';
  if (/\bmlb\b|baseball|world series/.test(t)) return 'MLB';
  if (/\bnba\b/.test(t)) return 'NBA';
  if (/\bnhl\b|hockey|stanley cup/.test(t)) return 'NHL';
  if (/\bncaa\b|march madness|college basketball/.test(t)) return 'CBB';
  if (isUFCMarketTitle(title)) return 'UFC';
  if (isSoccerMarketTitle(title)) return 'SOC';
  return null;
}

async function fetchJson(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 429) {
        await sleep(1000 * (i + 1));
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch {
      if (i === 2) return null;
      await sleep(400 * (i + 1));
    }
  }
  return null;
}

function lbRow(raw) {
  const row = Array.isArray(raw) ? raw[0] : raw;
  if (!row || row.pnl == null) return null;
  const pnl = Number(row.pnl);
  const vol = Number(row.vol) || 0;
  if (!Number.isFinite(pnl)) return null;
  return {
    name: row.userName || null,
    pnl,
    vol,
    rank: row.rank != null ? Number(row.rank) : null,
    roi: vol > 0 ? +((pnl / vol) * 100).toFixed(1) : null,
  };
}

function pickFgMarkets(ev) {
  const markets = ev?.markets || [];
  let ml = null;
  let spread = null;
  const fgTotals = [];
  for (const m of markets) {
    const git = (m.groupItemTitle || '').toLowerCase();
    const q = (m.question || '').toLowerCase();
    const slug = (m.slug || '').toLowerCase();
    const outs = parseJsonField(m.outcomes);
    const hasOU = outs.some((o) => /^(over|under)$/i.test(o));
    if (git.includes('spread') || q.includes('spread:')) {
      if (!spread) spread = m;
    } else if (hasOU && (git.includes('o/u') || git.includes('over') || git.includes('under') || q.includes('o/u'))) {
      if (isNonFullGameTotalMarket(`${m.groupItemTitle || ''} ${m.question || ''}`, slug)) continue;
      fgTotals.push(m);
    } else if (!ml) {
      ml = m;
    }
  }
  if (!ml) ml = markets[0] || null;
  let total = null;
  if (fgTotals.length) {
    const score = (m) => {
      const slug = (m.slug || '').toLowerCase();
      const mainSlug = /(?:^|-)total-\d/.test(slug) && !/f5|team|1h|half/.test(slug) ? 1e12 : 0;
      return mainSlug + (Number(m.liquidityNum ?? m.liquidity ?? 0) || 0);
    };
    fgTotals.sort((a, b) => score(b) - score(a));
    total = fgTotals[0];
  }
  return [ml, spread, total].filter(Boolean);
}

function analyzeClosedSports(closed) {
  const sports = [];
  for (const p of closed) {
    const sport = classifySport(p.title || '')
      || (String(p.eventSlug || p.slug || '').startsWith('mlb-') ? 'MLB' : null);
    if (!sport) continue;
    const curRaw = p.curPrice;
    const curPrice = (curRaw === null || curRaw === undefined || curRaw === '')
      ? 0.5
      : Number(curRaw);
    const settled = Number.isFinite(curPrice) && (curPrice >= 0.95 || curPrice <= 0.05);
    sports.push({
      conditionId: p.conditionId || '',
      eventSlug: p.eventSlug || '',
      title: p.title || '',
      outcomeIndex: p.outcomeIndex,
      settled,
    });
  }
  const byCond = new Map();
  for (const p of sports) {
    const key = p.conditionId || `${p.eventSlug}|${p.title}`;
    if (!byCond.has(key)) byCond.set(key, []);
    byCond.get(key).push(p);
  }
  let markets = 0;
  let bothSidesMarkets = 0;
  let settledLegs = 0;
  let earlyExitLegs = 0;
  for (const legs of byCond.values()) {
    markets++;
    const outcomes = new Set(legs.map((l) => String(l.outcomeIndex)));
    if (outcomes.size > 1) bothSidesMarkets++;
    for (const l of legs) {
      if (l.settled) settledLegs++;
      else earlyExitLegs++;
    }
  }
  const n = sports.length;
  return {
    markets,
    bothSidesPct: markets ? +((bothSidesMarkets / markets) * 100).toFixed(1) : 0,
    holdToResolvePct: n ? +((settledLegs / n) * 100).toFixed(1) : 0,
    earlyExitPct: n ? +((earlyExitLegs / n) * 100).toFixed(1) : 0,
  };
}

function directionalVerdict(stats) {
  const n = stats.markets || 0;
  const both = stats.bothSidesPct || 0;
  const hold = stats.holdToResolvePct || 0;
  const early = stats.earlyExitPct || 0;
  if (n < MIN_SPORTS_MARKETS) {
    return { ok: false, label: 'THIN', why: `only ${n} sports markets` };
  }
  if (both >= BOTH_SIDES_REJECT) {
    return { ok: false, label: 'HEDGE_TRADER', why: `${both}% both-sides` };
  }
  if (early >= EARLY_FLIP && hold < HOLD_FLIP_MAX) {
    return { ok: false, label: 'FLIPPER_MM', why: `${early}% early-exit, hold ${hold}%` };
  }
  if (hold >= HOLD_PASS && both < BOTH_SIDES_PASS) {
    return { ok: true, label: 'DIRECTIONAL_SHARP', why: `hold ${hold}%, both-sides ${both}%` };
  }
  return { ok: false, label: 'MIXED', why: `hold ${hold}% / both ${both}% / early ${early}%` };
}

async function fetchClosed(addr) {
  const closed = [];
  for (let offset = 0; offset < CLOSED_CAP; offset += 50) {
    const page = await fetchJson(
      `${DATA}/closed-positions?user=${addr}&limit=50&offset=${offset}&sortBy=TIMESTAMP&sortDirection=DESC`,
    );
    await sleep(PAGE_DELAY_MS);
    if (!page || !Array.isArray(page) || page.length === 0) break;
    closed.push(...page);
    if (page.length < 50) break;
  }
  return closed;
}

function addrSetFromSharps(doc) {
  const s = new Set();
  if (!doc || typeof doc !== 'object') return s;
  for (const k of Object.keys(doc)) {
    if (k === '_meta') continue;
    if (typeof k === 'string' && k.startsWith('0x')) s.add(k.toLowerCase());
  }
  return s;
}

async function run() {
  console.log('=== Discover scan supplement ===\n');
  const poly = loadJSON('polymarket_data.json');
  if (!poly) {
    console.log('No polymarket_data.json — nothing to do');
    return;
  }

  const now = Date.now();
  const existing = existsSync(OUT_PATH)
    ? JSON.parse(readFileSync(OUT_PATH, 'utf8'))
    : { wallets: {}, rejects: {} };
  if (!existing.wallets) existing.wallets = {};
  if (!existing.rejects) existing.rejects = {};
  for (const [k, v] of Object.entries(existing.rejects)) {
    if (!v?.until || v.until < now) delete existing.rejects[k];
  }

  const known = new Set([
    ...addrSetFromSharps(loadJSON('sports_sharps.json')),
    ...addrSetFromSharps(loadJSON('whale_profiles.json')),
    ...Object.keys(existing.wallets).map((a) => a.toLowerCase()),
  ]);

  const exclDoc = loadJSON('sharp_intel_excluded_wallets.json') || {};
  const excluded = new Set(
    [...(exclDoc.excluded || []), ...(exclDoc.mmExcluded || []), ...(exclDoc.tradersExcluded || [])]
      .map((a) => String(a || '').toLowerCase())
      .filter(Boolean),
  );
  const force = new Set(
    ((loadJSON('sharp_intel_force_include.json') || {}).wallets || [])
      .map((w) => String(w?.addr || w || '').toLowerCase())
      .filter(Boolean),
  );

  const games = [];
  for (const sport of SPORT_KEYS) {
    for (const [gameKey, g] of Object.entries(poly[sport] || {})) {
      if (g?.eventId) games.push({ sport, gameKey, eventId: String(g.eventId), title: g.title || gameKey });
    }
  }
  console.log(`Today's games with eventId: ${games.length}`);

  // wallet -> { maxUsd, foundOn[], bothSidesMarkets: Set }
  const fat = new Map();
  const bothSidesTonight = new Set();

  for (const game of games) {
    const ev = await fetchJson(`${GAMMA}/events/${game.eventId}`);
    await sleep(PAGE_DELAY_MS);
    if (!ev) continue;
    const markets = pickFgMarkets(ev);
    for (const m of markets) {
      const cid = m.conditionId;
      if (!cid) continue;
      const prices = parseJsonField(m.outcomePrices).map(Number);
      const holdersDoc = await fetchJson(`${DATA}/holders?market=${cid}&limit=${HOLDERS_LIMIT}`);
      await sleep(PAGE_DELAY_MS);
      if (!Array.isArray(holdersDoc)) continue;

      const usdByWallet = new Map();
      for (const side of holdersDoc) {
        const idx = side.holders?.[0]?.outcomeIndex;
        const price = Number.isFinite(prices[idx]) ? prices[idx] : null;
        for (const h of side.holders || []) {
          const addr = String(h.proxyWallet || '').toLowerCase();
          if (!addr.startsWith('0x')) continue;
          const px = Number.isFinite(prices[h.outcomeIndex])
            ? prices[h.outcomeIndex]
            : (price != null ? price : null);
          if (px == null || px <= 0) continue;
          const usd = Number(h.amount || 0) * px;
          if (usd < MIN_POSITION_USD) continue;
          const prev = usdByWallet.get(addr) || { usd: 0, outcomes: new Set(), name: h.name || h.pseudonym };
          prev.usd += usd;
          prev.outcomes.add(String(h.outcomeIndex));
          if (h.name) prev.name = h.name;
          usdByWallet.set(addr, prev);
        }
      }
      for (const [addr, rec] of usdByWallet) {
        if (rec.outcomes.size > 1) bothSidesTonight.add(addr);
        const row = fat.get(addr) || { maxUsd: 0, name: rec.name, foundOn: [] };
        if (rec.usd > row.maxUsd) row.maxUsd = rec.usd;
        row.foundOn.push({
          sport: game.sport,
          gameKey: game.gameKey,
          usd: Math.round(rec.usd),
          conditionId: cid,
        });
        fat.set(addr, row);
      }
    }
  }

  const candidates = [...fat.entries()]
    .filter(([addr]) => !known.has(addr))
    .sort((a, b) => b[1].maxUsd - a[1].maxUsd);

  console.log(`Fat tickets (≥$${MIN_POSITION_USD.toLocaleString()}): ${fat.size} · new vs known: ${candidates.length}`);

  const stats = {
    skippedKnown: fat.size - candidates.length,
    skippedRejected: 0,
    skippedExcluded: 0,
    skippedBothSides: 0,
    skippedPnl: 0,
    skippedChurn: 0,
    skippedClosed: 0,
    added: 0,
  };

  const reject = (addr, reason) => {
    existing.rejects[addr] = { reason, until: now + REJECT_TTL_MS };
  };

  for (const [addr, rec] of candidates) {
    const cached = existing.rejects[addr];
    if (cached?.until > now) {
      stats.skippedRejected++;
      continue;
    }

    if (excluded.has(addr) && !force.has(addr)) {
      console.log(`  skip ${rec.name || addr.slice(-6)} — already excluded (MM/trader)`);
      reject(addr, 'excluded_list');
      stats.skippedExcluded++;
      continue;
    }

    if (bothSidesTonight.has(addr) && !force.has(addr)) {
      console.log(`  skip ${rec.name || addr.slice(-6)} — both sides tonight ($${Math.round(rec.maxUsd)})`);
      reject(addr, 'both_sides_tonight');
      stats.skippedBothSides++;
      continue;
    }

    const allRaw = await fetchJson(`${DATA}/v1/leaderboard?category=SPORTS&timePeriod=ALL&user=${addr}&limit=1`);
    await sleep(PAGE_DELAY_MS);
    const monthRaw = await fetchJson(`${DATA}/v1/leaderboard?category=SPORTS&timePeriod=MONTH&user=${addr}&limit=1`);
    await sleep(PAGE_DELAY_MS);
    const all = lbRow(allRaw);
    const month = lbRow(monthRaw);
    const name = all?.name || month?.name || rec.name || addr.slice(-6);

    if (!all || all.pnl <= 0 || !month || month.pnl <= 0) {
      const why = !all || all.pnl <= 0 ? 'lifetime_red' : 'month_red';
      console.log(`  skip ${name} — ${why} (all=${all ? Math.round(all.pnl) : 'none'} month=${month ? Math.round(month.pnl) : 'none'})`);
      reject(addr, why);
      stats.skippedPnl++;
      continue;
    }

    const ratio = all.pnl > 0 ? all.vol / all.pnl : Infinity;
    const roi = all.roi ?? 0;
    if (!force.has(addr) && ratio > CHURN_VOL_PNL && roi < CHURN_ROI_MAX) {
      console.log(`  skip ${name} — churn ${ratio.toFixed(0)}× vol/pnl at ${roi}% ROI`);
      reject(addr, `churn_${Math.round(ratio)}x_${roi}pct`);
      stats.skippedChurn++;
      continue;
    }

    let directionalWhy = 'force_include';
    if (!force.has(addr)) {
      const closed = await fetchClosed(addr);
      const v = directionalVerdict(analyzeClosedSports(closed));
      if (!v.ok) {
        console.log(`  skip ${name} — ${v.label} (${v.why})`);
        reject(addr, `${v.label}:${v.why}`);
        stats.skippedClosed++;
        continue;
      }
      directionalWhy = `${v.label}: ${v.why}`;
    }

    delete existing.rejects[addr];
    existing.wallets[addr] = {
      addr,
      name,
      sportPnlTotal: Math.round(all.pnl),
      sportVol: Math.round(all.vol),
      sportROI: all.roi,
      leaderboardRank: all.rank,
      monthPnl: Math.round(month.pnl),
      monthVol: Math.round(month.vol),
      monthROI: month.roi,
      monthRank: month.rank,
      avgSportBet: Math.round(rec.maxUsd),
      foundOn: rec.foundOn.slice(0, 8),
      directionalWhy,
      addedAt: new Date().toISOString(),
      source: 'scan_supplement',
    };
    stats.added++;
    console.log(
      `  ADD ${name}  all +$${Math.round(all.pnl).toLocaleString()} (${all.roi}%) `
      + `month +$${Math.round(month.pnl).toLocaleString()}  ticket ~$${Math.round(rec.maxUsd).toLocaleString()}  ${directionalWhy}`,
    );
  }

  existing.updatedAt = new Date().toISOString();
  existing.minPositionUsd = MIN_POSITION_USD;
  existing.walletCount = Object.keys(existing.wallets).length;
  writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2), 'utf8');

  console.log('\n--- result ---');
  console.log(JSON.stringify(stats, null, 2));
  console.log(`Supplement wallets: ${existing.walletCount} → ${OUT_PATH}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

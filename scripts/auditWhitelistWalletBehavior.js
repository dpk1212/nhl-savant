/**
 * Both-sides / hold-to-resolve audit for ALL CONFIRMED + FLAT wallets
 * (from data/wallet-profiles.json), not just the exclusion list.
 *
 * Same signals as auditExcludedWalletBehavior.js:
 *   bothSidesPct, holdToResolvePct, sport ROI → DIRECTIONAL / HEDGE / MIXED…
 *
 * Usage:
 *   node scripts/auditWhitelistWalletBehavior.js
 *   node scripts/auditWhitelistWalletBehavior.js --max-closed 1000 --concurrency 3
 *   node scripts/auditWhitelistWalletBehavior.js --tiers CONFIRMED
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { isWNBAMarketTitle } from './lib/wnbaTeams.js';
import { isUFCMarketTitle } from './lib/ufcFighters.js';
import { isSoccerMarketTitle } from './lib/soccerTeams.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_API = 'https://data-api.polymarket.com';
const OUT_PATH = join(ROOT, 'public', 'whitelist_wallet_behavior_audit.json');

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SPORT_KEYWORDS = {
  NHL: ['nhl', 'hockey', 'stanley cup'],
  CBB: ['ncaa', 'march madness', 'college basketball'],
  NBA: ['nba', 'lakers', 'celtics', 'warriors', 'bucks', 'nuggets'],
  NFL: ['nfl', 'super bowl'],
  MLB: ['mlb', 'baseball', 'world series', 'yankees', 'dodgers', 'braves',
    'astros', 'phillies', 'padres', 'mets', 'cubs', 'red sox'],
};

function classifySport(title) {
  const t = (title || '').toLowerCase();
  if (isWNBAMarketTitle(title)) return 'WNBA';
  for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return sport;
    }
  }
  if (isUFCMarketTitle(title)) return 'UFC';
  if (isSoccerMarketTitle(title)) return 'SOC';
  if (/\b(atp|wta|tennis|ufc|mma|mlb|nba|nhl|nfl|wnba|soccer|football|baseball)\b/i.test(t)) {
    if (/\b(atp|wta|tennis)\b/i.test(t)) return 'TENNIS';
    return 'OTHER_SPORT';
  }
  return null;
}

function loadJSON(rel) {
  const p = join(ROOT, rel.startsWith('data/') || rel.startsWith('public/') ? rel : join('public', rel));
  const alt = join(ROOT, 'public', rel);
  const path = existsSync(p) ? p : alt;
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

function argVal(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 429) {
        await sleep(Math.pow(2, i + 1) * 1000);
        continue;
      }
      if (!res.ok) throw new Error(`${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries) return null;
      await sleep(800 * (i + 1));
    }
  }
  return null;
}

async function fetchClosedSports(addr, maxClosed) {
  const closed = [];
  for (let offset = 0; offset < maxClosed; offset += 50) {
    const page = await fetchWithRetry(
      `${DATA_API}/closed-positions?user=${addr}&limit=50&offset=${offset}&sortBy=TIMESTAMP&sortDirection=DESC`,
    );
    await sleep(100);
    if (!page || !Array.isArray(page) || page.length === 0) break;
    closed.push(...page);
    if (page.length < 50) break;
  }
  return closed;
}

function analyzeClosed(closed) {
  const sports = [];
  for (const p of closed) {
    const sport = classifySport(p.title || '')
      || (String(p.eventSlug || p.slug || '').startsWith('mlb-') ? 'MLB' : null);
    if (!sport) continue;
    const bought = Number(p.totalBought || 0);
    const avgPrice = Number(p.avgPrice || 0);
    const invested = bought > 0 && avgPrice > 0 ? bought * avgPrice : 0;
    const curRaw = p.curPrice;
    const curPrice = (curRaw === null || curRaw === undefined || curRaw === '')
      ? 0.5
      : Number(curRaw);
    const realizedPnl = Number(p.realizedPnl || 0);
    const settled = Number.isFinite(curPrice) && (curPrice >= 0.95 || curPrice <= 0.05);
    sports.push({
      sport,
      title: p.title || '',
      eventSlug: p.eventSlug || '',
      conditionId: p.conditionId || '',
      outcome: p.outcome || '',
      outcomeIndex: p.outcomeIndex,
      invested,
      avgPrice,
      curPrice,
      realizedPnl,
      settled,
      won: settled ? curPrice >= 0.95 : null,
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
  let oneSidedSettled = 0;
  let settledLegs = 0;
  let earlyExitLegs = 0;
  let invested = 0;
  let pnl = 0;
  let wins = 0;
  let losses = 0;
  const bySport = {};

  for (const legs of byCond.values()) {
    markets++;
    const outcomes = new Set(legs.map((l) => String(l.outcomeIndex)));
    const isBoth = outcomes.size > 1;
    if (isBoth) bothSidesMarkets++;
    const anySettled = legs.some((l) => l.settled);
    if (!isBoth && anySettled) oneSidedSettled++;

    for (const l of legs) {
      invested += l.invested;
      pnl += l.realizedPnl;
      if (l.settled) {
        settledLegs++;
        if (l.won) wins++;
        else losses++;
      } else {
        earlyExitLegs++;
      }
      if (!bySport[l.sport]) bySport[l.sport] = { n: 0, invested: 0, pnl: 0, both: 0, settled: 0 };
      bySport[l.sport].n++;
      bySport[l.sport].invested += l.invested;
      bySport[l.sport].pnl += l.realizedPnl;
      if (l.settled) bySport[l.sport].settled++;
    }
    if (isBoth) {
      for (const s of new Set(legs.map((l) => l.sport))) {
        if (!bySport[s]) bySport[s] = { n: 0, invested: 0, pnl: 0, both: 0, settled: 0 };
        bySport[s].both++;
      }
    }
  }

  const sportsLegs = sports.length;
  const holdToResolvePct = sportsLegs ? +((settledLegs / sportsLegs) * 100).toFixed(1) : 0;
  const bothSidesPct = markets ? +((bothSidesMarkets / markets) * 100).toFixed(1) : 0;
  const earlyExitPct = sportsLegs ? +((earlyExitLegs / sportsLegs) * 100).toFixed(1) : 0;
  const roi = invested > 0 ? +((pnl / invested) * 100).toFixed(1) : null;
  const wr = (wins + losses) > 0 ? +((wins / (wins + losses)) * 100).toFixed(1) : null;

  return {
    sportsLegs,
    markets,
    bothSidesMarkets,
    oneSidedSettled,
    settledLegs,
    earlyExitLegs,
    wins,
    losses,
    wr,
    invested: Math.round(invested),
    pnl: Math.round(pnl),
    roi,
    holdToResolvePct,
    bothSidesPct,
    earlyExitPct,
    bySport,
  };
}

function verdict(stats) {
  const n = stats.markets || 0;
  const both = stats.bothSidesPct || 0;
  const hold = stats.holdToResolvePct || 0;
  const early = stats.earlyExitPct || 0;
  const roi = stats.roi ?? 0;

  if (n < 8) return { label: 'THIN', why: `only ${n} sports markets in sample` };
  if (both >= 25) {
    return { label: 'HEDGE_TRADER', why: `${both.toFixed(0)}% of markets had both outcomes` };
  }
  if (hold >= 55 && both < 15 && n >= 12) {
    const edge = roi >= 5 ? 'with edge' : roi >= 0 ? 'flat/small edge' : 'negative ROI';
    return { label: 'DIRECTIONAL_SHARP', why: `${hold.toFixed(0)}% hold-to-resolve, ${both.toFixed(0)}% both-sides, ${edge}` };
  }
  if (early >= 55 && hold < 40) {
    return { label: 'FLIPPER_MM', why: `${early.toFixed(0)}% early-exit legs, hold ${hold.toFixed(0)}%` };
  }
  return {
    label: 'MIXED',
    why: `hold ${hold.toFixed(0)}% / both-sides ${both.toFixed(0)}% / early ${early.toFixed(0)}% / ROI ${roi.toFixed(1)}%`,
  };
}

function loadTargets(tierFilter) {
  const profiles = loadJSON('data/wallet-profiles.json');
  const excl = loadJSON('sharp_intel_excluded_wallets.json') || {};
  const force = new Set(
    ((loadJSON('sharp_intel_force_include.json') || {}).wallets || [])
      .map((w) => String(w?.addr || '').toLowerCase())
      .filter(Boolean),
  );
  const mm = new Set((excl.mmExcluded || []).map((a) => String(a).toLowerCase()));
  const traders = new Set((excl.tradersExcluded || []).map((a) => String(a).toLowerCase()));
  const excluded = new Set((excl.excluded || []).map((a) => String(a).toLowerCase()));

  const want = new Set(tierFilter);
  const out = [];
  for (const p of Object.values(profiles?.profiles || {})) {
    const addr = String(p.walletAddress || '').toLowerCase();
    if (!addr.startsWith('0x')) continue;
    const tiers = {};
    for (const [sport, rec] of Object.entries(p.bySport || {})) {
      const t = rec?.whitelistTier;
      if (t && want.has(t)) tiers[sport] = t;
    }
    if (!Object.keys(tiers).length) continue;
    const best = Object.values(tiers).includes('CONFIRMED') ? 'CONFIRMED' : 'FLAT';
    out.push({
      addr,
      short: addr.slice(-6),
      name: p.name || p.walletShort || addr.slice(-6),
      bestTier: best,
      tiers,
      confirmedSports: Object.entries(tiers).filter(([, t]) => t === 'CONFIRMED').map(([s]) => s),
      flatSports: Object.entries(tiers).filter(([, t]) => t === 'FLAT').map(([s]) => s),
      excluded: excluded.has(addr),
      mm: mm.has(addr),
      trader: traders.has(addr),
      forceInclude: force.has(addr),
      exclusionTag: force.has(addr) ? 'FORCE_INCLUDE'
        : (mm.has(addr) && traders.has(addr) ? 'MM+TRADER'
          : mm.has(addr) ? 'MM'
            : traders.has(addr) ? 'TRADER'
              : excluded.has(addr) ? 'EXCLUDED'
                : 'CLEAR'),
    });
  }
  out.sort((a, b) => {
    if (a.bestTier !== b.bestTier) return a.bestTier === 'CONFIRMED' ? -1 : 1;
    return (a.name || '').localeCompare(b.name || '');
  });
  return out;
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
  return results;
}

async function main() {
  const maxClosed = Number(argVal('--max-closed', 1000));
  const concurrency = Number(argVal('--concurrency', 3));
  const tierArg = argVal('--tiers', 'CONFIRMED,FLAT');
  const tiers = tierArg.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
  const outOverride = argVal('--out', null);

  const targets = loadTargets(tiers);
  console.log(`\nWhitelist behavior audit — tiers=${tiers.join('+')}`);
  console.log(`targets=${targets.length}  maxClosed=${maxClosed}  concurrency=${concurrency}\n`);

  const results = await mapPool(targets, concurrency, async (t, i) => {
    process.stdout.write(`[${i + 1}/${targets.length}] ${t.name} (${t.bestTier}/${t.exclusionTag}) … `);
    const closed = await fetchClosedSports(t.addr, maxClosed);
    if (!closed) {
      console.log('API fail');
      return { ...t, error: 'api_fail', verdict: 'ERR', recommendation: 'REVIEW' };
    }
    const stats = analyzeClosed(closed);
    const v = verdict(stats);
    console.log(
      `${v.label}  mkts=${stats.markets} hold=${stats.holdToResolvePct}% both=${stats.bothSidesPct}% ROI=${stats.roi}%`,
    );
    const recommendation =
      v.label === 'DIRECTIONAL_SHARP' ? 'DIRECTIONAL'
        : v.label === 'HEDGE_TRADER' || v.label === 'FLIPPER_MM' ? 'HEDGE_LIKE'
          : v.label === 'THIN' ? 'THIN'
            : 'REVIEW';
    return {
      addr: t.addr,
      short: t.short,
      name: t.name,
      bestTier: t.bestTier,
      confirmedSports: t.confirmedSports,
      flatSports: t.flatSports,
      exclusionTag: t.exclusionTag,
      excluded: t.excluded,
      forceInclude: t.forceInclude,
      closedFetched: closed.length,
      ...stats,
      verdict: v.label,
      why: v.why,
      recommendation,
    };
  });

  const byVerdict = {};
  const byRec = {};
  const byExcl = {};
  for (const r of results) {
    byVerdict[r.verdict || 'ERR'] = (byVerdict[r.verdict || 'ERR'] || 0) + 1;
    byRec[r.recommendation || 'ERR'] = (byRec[r.recommendation || 'ERR'] || 0) + 1;
    byExcl[r.exclusionTag || '?'] = (byExcl[r.exclusionTag || '?'] || 0) + 1;
  }

  // Conflict: excluded but directional / clear but hedge
  const falseExcluded = results.filter((r) =>
    r.excluded && !r.forceInclude && r.recommendation === 'DIRECTIONAL');
  const clearButHedge = results.filter((r) =>
    !r.excluded && r.recommendation === 'HEDGE_LIKE');

  const out = {
    auditedAt: new Date().toISOString(),
    mode: 'whitelist_confirmed_flat',
    tiers,
    maxClosed,
    concurrency,
    summary: {
      wallets: results.length,
      byVerdict,
      byRec,
      byExclTag: byExcl,
      falseExcludedN: falseExcluded.length,
      clearButHedgeN: clearButHedge.length,
    },
    falseExcluded: falseExcluded.map((r) => ({
      name: r.name, short: r.short, addr: r.addr, tag: r.exclusionTag,
      both: r.bothSidesPct, hold: r.holdToResolvePct, roi: r.roi,
      sports: [...(r.confirmedSports || []), ...(r.flatSports || [])],
      why: r.why,
    })),
    clearButHedge: clearButHedge.map((r) => ({
      name: r.name, short: r.short, addr: r.addr,
      both: r.bothSidesPct, hold: r.holdToResolvePct, roi: r.roi,
      sports: [...(r.confirmedSports || []), ...(r.flatSports || [])],
      why: r.why,
    })),
    results,
  };

  const dest = outOverride ? join(ROOT, outOverride) : OUT_PATH;
  writeFileSync(dest, JSON.stringify(out, null, 2), 'utf8');

  console.log('\n════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('════════════════════════════════════════');
  console.log('By verdict:', byVerdict);
  console.log('By recommendation:', byRec);
  console.log('By exclusion tag:', byExcl);
  console.log(`\nFALSE EXCLUDED (excluded + DIRECTIONAL): ${falseExcluded.length}`);
  for (const r of falseExcluded.slice(0, 40)) {
    console.log(`  ${r.name} [${r.exclusionTag}] both=${r.bothSidesPct}% hold=${r.holdToResolvePct}% ROI=${r.roi}%`);
  }
  console.log(`\nCLEAR BUT HEDGE-LIKE (not excluded + HEDGE/FLIPPER): ${clearButHedge.length}`);
  for (const r of clearButHedge.slice(0, 40)) {
    console.log(`  ${r.name} both=${r.bothSidesPct}% hold=${r.holdToResolvePct}% ROI=${r.roi}%`);
  }
  console.log(`\nWrote ${dest}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Audit excluded (MM/trader) wallets via Polymarket closed-positions API.
 *
 * Question: are they market-making / hedging both sides, or directional
 * bettors who buy a side and wait for the sports event to resolve?
 *
 * Signals (per wallet, sports markets only):
 *   - holdToResolvePct  : closed legs with curPrice ∈ {~0,~1} (settled)
 *   - bothSidesPct      : distinct markets where they held BOTH outcomes
 *   - oneSidedResolved  : settled markets with only one outcome held
 *   - sportRoi / nSports : from settled sports book
 *
 * Verdicts:
 *   DIRECTIONAL_SHARP — high hold%, low both-sides%, meaningful sample + ROI
 *   HEDGE_TRADER      — often both outcomes of the same market
 *   FLIPPER_MM        — lots of markets, low hold-to-resolve, thin sport edge
 *   MIXED / THIN      — inconclusive
 *
 * Usage:
 *   node scripts/auditExcludedWalletBehavior.js --prototype
 *   node scripts/auditExcludedWalletBehavior.js --limit 40
 *   node scripts/auditExcludedWalletBehavior.js --limit 80 --max-closed 800
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
const OUT_PATH = join(ROOT, 'public', 'excluded_wallet_behavior_audit.json');

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
  // Broad tennis / misc sports — still "sports resolved" for behavior
  if (/\b(atp|wta|tennis|ufc|mma|mlb|nba|nhl|nfl|wnba|soccer|football|baseball)\b/i.test(t)) {
    if (/\b(atp|wta|tennis)\b/i.test(t)) return 'TENNIS';
    return 'OTHER_SPORT';
  }
  return null;
}

function loadJSON(rel) {
  const p = join(ROOT, 'public', rel);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
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
      `${DATA_API}/closed-positions?user=${addr}&limit=50&offset=${offset}&sortBy=TIMESTAMP&sortDirection=DESC`
    );
    await sleep(120);
    if (!page || !Array.isArray(page) || page.length === 0) break;
    closed.push(...page);
    if (page.length < 50) break;
  }
  return closed;
}

function analyzeClosed(closed) {
  const sports = [];
  for (const p of closed) {
    const sport = classifySport(p.title || '');
    if (!sport) continue;
    const bought = Number(p.totalBought || 0);
    const avgPrice = Number(p.avgPrice || 0);
    const invested = bought > 0 && avgPrice > 0 ? bought * avgPrice : 0;
    const curPrice = Number(p.curPrice || 0.5);
    const realizedPnl = Number(p.realizedPnl || 0);
    const settled = curPrice >= 0.95 || curPrice <= 0.05;
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
      timestamp: p.timestamp || 0,
    });
  }

  // Group by market (conditionId) — both-sides = ≥2 distinct outcomes
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
  let earlyExitLegs = 0; // closed while mid-price (not yet / never held to print)
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
      const sportsIn = new Set(legs.map((l) => l.sport));
      for (const s of sportsIn) {
        if (!bySport[s]) bySport[s] = { n: 0, invested: 0, pnl: 0, both: 0, settled: 0 };
        bySport[s].both++;
      }
    }
  }

  const legs = sports.length;
  const holdToResolvePct = legs > 0 ? (100 * settledLegs) / legs : null;
  const bothSidesPct = markets > 0 ? (100 * bothSidesMarkets) / markets : null;
  const earlyExitPct = legs > 0 ? (100 * earlyExitLegs) / legs : null;
  const roi = invested > 0 ? (100 * pnl) / invested : null;
  const wr = (wins + losses) > 0 ? (100 * wins) / (wins + losses) : null;

  for (const s of Object.values(bySport)) {
    s.invested = Math.round(s.invested);
    s.pnl = Math.round(s.pnl);
    s.roi = s.invested > 0 ? +(100 * s.pnl / s.invested).toFixed(1) : null;
  }

  return {
    sportsLegs: legs,
    markets,
    bothSidesMarkets,
    oneSidedSettled,
    settledLegs,
    earlyExitLegs,
    wins,
    losses,
    wr: wr != null ? +wr.toFixed(1) : null,
    invested: Math.round(invested),
    pnl: Math.round(pnl),
    roi: roi != null ? +roi.toFixed(1) : null,
    holdToResolvePct: holdToResolvePct != null ? +holdToResolvePct.toFixed(1) : null,
    bothSidesPct: bothSidesPct != null ? +bothSidesPct.toFixed(1) : null,
    earlyExitPct: earlyExitPct != null ? +earlyExitPct.toFixed(1) : null,
    bySport,
  };
}

function verdict(stats) {
  const n = stats.markets || 0;
  const hold = stats.holdToResolvePct ?? 0;
  const both = stats.bothSidesPct ?? 0;
  const roi = stats.roi ?? 0;
  const early = stats.earlyExitPct ?? 0;

  if (n < 8) return { label: 'THIN', why: `only ${n} sports markets in sample` };

  // Hedge / MM: regularly on both outcomes
  if (both >= 25) {
    return { label: 'HEDGE_TRADER', why: `${both.toFixed(0)}% of markets had both outcomes` };
  }

  // Directional: holds to print, rarely both-sides, real sample
  if (hold >= 55 && both < 15 && n >= 12) {
    const edge = roi >= 5 ? 'with edge' : roi >= 0 ? 'flat/small edge' : 'negative ROI';
    return { label: 'DIRECTIONAL_SHARP', why: `${hold.toFixed(0)}% hold-to-resolve, ${both.toFixed(0)}% both-sides, ${edge}` };
  }

  // Flipper / scalp: mostly closed mid-market
  if (early >= 55 && hold < 40) {
    return { label: 'FLIPPER_MM', why: `${early.toFixed(0)}% early-exit legs, hold ${hold.toFixed(0)}%` };
  }

  return {
    label: 'MIXED',
    why: `hold ${hold.toFixed(0)}% / both-sides ${both.toFixed(0)}% / early ${early.toFixed(0)}% / ROI ${roi.toFixed(1)}%`,
  };
}

function pickTargets({ prototype, limit }) {
  const excl = loadJSON('sharp_intel_excluded_wallets.json');
  const ss = loadJSON('sports_sharps.json') || {};
  const wp = loadJSON('whale_profiles.json') || {};
  if (!excl) throw new Error('missing sharp_intel_excluded_wallets.json');

  const mm = new Set((excl.mmExcluded || []).map((a) => a.toLowerCase()));
  const traders = new Set((excl.tradersExcluded || []).map((a) => a.toLowerCase()));
  const all = new Set((excl.excluded || []).map((a) => a.toLowerCase()));

  const PROTO = [
    '0x5268527977f700f9bf9b6d5cd843859e4e70135d', // HomeRunHazard TRADER
    '0xf7f0b0b1e9c0fe02ccad926916ee31aef74b912c', // wapol MM
    '0x84cfffc3f16dcc353094de30d4a45226eccd2f63', // mooseborzoi
  ];

  // Find sentrio by short
  for (const [a, p] of Object.entries(wp)) {
    if ((p.name || '').toLowerCase() === 'sentrio') PROTO.push(a);
  }

  if (prototype) {
    return [...new Set(PROTO.map((a) => a.toLowerCase()))].map((addr) => {
      const w = ss[addr] || Object.entries(ss).find(([k]) => k.toLowerCase() === addr)?.[1];
      const p = wp[addr] || Object.entries(wp).find(([k]) => k.toLowerCase() === addr)?.[1];
      return {
        addr,
        name: w?.name || p?.name || addr.slice(-6),
        tag: mm.has(addr) && traders.has(addr) ? 'MM+TRADER'
          : mm.has(addr) ? 'MM' : traders.has(addr) ? 'TRADER' : 'EXCLUDED',
        sportPnl: w?.sportPnlTotal ?? null,
        sportROI: w?.sportROI ?? null,
        wnba: w?.perSport?.WNBA || null,
        mmScore: p?.mmScore ?? null,
      };
    });
  }

  // Rank excluded wallets by sports activity (prefer WNBA / high sport PnL)
  const scored = [];
  for (const addr of all) {
    const w = ss[addr] || Object.entries(ss).find(([k]) => k.toLowerCase() === addr)?.[1];
    const p = wp[addr] || Object.entries(wp).find(([k]) => k.toLowerCase() === addr)?.[1];
    if (!w && !p) continue;
    const wnbaBets = w?.perSport?.WNBA?.bets || w?.sportMarkets?.WNBA || p?.sportMarkets?.WNBA || 0;
    const sportPnl = w?.sportPnlTotal || 0;
    const sportMarkets = Object.values(w?.sportMarkets || p?.sportMarkets || {}).reduce((s, v) => s + v, 0);
    if (sportPnl <= 0 && sportMarkets < 20 && wnbaBets < 5) continue;
    const score = wnbaBets * 50 + Math.min(sportPnl, 5e6) / 1000 + sportMarkets;
    scored.push({
      addr,
      name: w?.name || p?.name || addr.slice(-6),
      tag: mm.has(addr) && traders.has(addr) ? 'MM+TRADER'
        : mm.has(addr) ? 'MM' : traders.has(addr) ? 'TRADER' : 'EXCLUDED',
      sportPnl,
      sportROI: w?.sportROI ?? null,
      wnba: w?.perSport?.WNBA || null,
      mmScore: p?.mmScore ?? null,
      score,
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

async function main() {
  const prototype = process.argv.includes('--prototype');
  const limit = Number(argVal('--limit', prototype ? 10 : 40));
  const maxClosed = Number(argVal('--max-closed', 400));

  const targets = pickTargets({ prototype, limit });
  console.log(`\nAuditing ${targets.length} excluded wallets via closed-positions API`);
  console.log(`maxClosed=${maxClosed}  mode=${prototype ? 'prototype' : 'ranked'}\n`);

  const results = [];
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    process.stdout.write(`[${i + 1}/${targets.length}] ${t.name} (${t.tag}) … `);
    const closed = await fetchClosedSports(t.addr, maxClosed);
    if (!closed) {
      console.log('API fail');
      results.push({ ...t, error: 'api_fail' });
      continue;
    }
    const stats = analyzeClosed(closed);
    const v = verdict(stats);
    console.log(
      `${v.label}  sportsMarkets=${stats.markets} hold=${stats.holdToResolvePct}% both=${stats.bothSidesPct}% ROI=${stats.roi}%`
    );
    results.push({
      addr: t.addr,
      name: t.name,
      currentTag: t.tag,
      mmScore: t.mmScore,
      catalogSportPnl: t.sportPnl,
      catalogSportROI: t.sportROI,
      catalogWnba: t.wnba,
      closedFetched: closed.length,
      ...stats,
      verdict: v.label,
      why: v.why,
      recommendation:
        v.label === 'DIRECTIONAL_SHARP' ? 'CONSIDER_REINSTATE'
          : v.label === 'HEDGE_TRADER' || v.label === 'FLIPPER_MM' ? 'KEEP_EXCLUDED'
            : 'REVIEW',
    });
    await sleep(80);
  }

  const byVerdict = {};
  const byRec = {};
  for (const r of results) {
    byVerdict[r.verdict || 'ERR'] = (byVerdict[r.verdict || 'ERR'] || 0) + 1;
    byRec[r.recommendation || 'ERR'] = (byRec[r.recommendation || 'ERR'] || 0) + 1;
  }

  const out = {
    auditedAt: new Date().toISOString(),
    mode: prototype ? 'prototype' : 'ranked',
    maxClosed,
    summary: { wallets: results.length, byVerdict, byRec },
    results,
  };
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8');

  console.log('\n════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('════════════════════════════════════════');
  console.log('By verdict:', byVerdict);
  console.log('By recommendation:', byRec);
  console.log('\nCONSIDER_REINSTATE:');
  for (const r of results.filter((x) => x.recommendation === 'CONSIDER_REINSTATE')) {
    console.log(
      `  ${r.name} (${r.currentTag})  hold=${r.holdToResolvePct}% both=${r.bothSidesPct}% ` +
      `ROI=${r.roi}% W-L=${r.wins}-${r.losses}  ${r.why}`
    );
  }
  console.log('\nKEEP_EXCLUDED:');
  for (const r of results.filter((x) => x.recommendation === 'KEEP_EXCLUDED').slice(0, 20)) {
    console.log(
      `  ${r.name} (${r.currentTag})  hold=${r.holdToResolvePct}% both=${r.bothSidesPct}% ` +
      `ROI=${r.roi}%  ${r.why}`
    );
  }
  console.log(`\nWrote ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

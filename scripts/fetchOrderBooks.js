/**
 * Order-book chain. Runs beside fetch-polymarket and fetch-kalshi.
 * Those jobs keep matching games. This one only reads their ids and
 * pulls the book: Kalshi orderbook + Polymarket CLOB.
 *
 * Novig and ProphetX need partner credentials. Without them the file
 * records the skip and the card does not invent a ladder.
 *
 * Usage: node scripts/fetchOrderBooks.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { lookupPinnGame } from './lib/ufcFighters.js';
import {
  asksFromKalshiNoBids,
  asksFromPoly,
  walkAsks,
  bookRead,
  appendInsideTape,
} from '../src/lib/orderBookLiquidity.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
dotenv.config({ path: join(ROOT, '.env') });
const OUT = join(ROOT, 'public', 'orderbook_liquidity.json');
const KALSHI = 'https://api.elections.kalshi.com/trade-api/v2';
const CLOB = 'https://clob.polymarket.com';
const SPORTS = ['NHL', 'MLB', 'NBA', 'NFL', 'CFB', 'CBB', 'WNBA', 'UFC', 'SOC'];

const httpFetch = typeof globalThis.fetch === 'function'
  ? globalThis.fetch
  : (await import('node-fetch')).default;

function readJson(name) {
  const p = join(ROOT, 'public', name);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function getJson(url) {
  const res = await httpFetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function teamSide(label, away, home) {
  const s = String(label || '').toLowerCase();
  if (/^over\b/.test(s)) return 'home';
  if (/^under\b/.test(s)) return 'away';
  const a = String(away || '').toLowerCase();
  const h = String(home || '').toLowerCase();
  const hit = (name) => {
    if (!name) return false;
    if (s.includes(name)) return true;
    const last = name.split(' ').pop();
    return last && last.length > 3 && s.includes(last);
  };
  if (hit(a)) return 'away';
  if (hit(h)) return 'home';
  return null;
}

function pinAmerican(game, market, side, line) {
  if (!game) return null;
  if (market === 'ml') {
    const n = side === 'away' ? game.current?.away : game.current?.home;
    return Number.isFinite(n) ? n : null;
  }
  if (market === 'spread') {
    const cur = game.spreadCurrent;
    if (!cur) return null;
    const main = side === 'away' ? cur.awayLine : cur.homeLine;
    if (Number.isFinite(line) && Number.isFinite(main) && Math.abs(Math.abs(line) - Math.abs(main)) >= 0.26) return null;
    const n = side === 'away' ? cur.awayOdds : cur.homeOdds;
    return Number.isFinite(n) ? n : null;
  }
  const cur = game.totalCurrent;
  if (!cur) return null;
  if (Number.isFinite(line) && Number.isFinite(cur.line) && Math.abs(line - cur.line) >= 0.26) return null;
  const n = side === 'home' ? cur.overOdds : cur.underOdds;
  return Number.isFinite(n) ? n : null;
}

function packSide(asks, pin, prevTape, now) {
  const walked = walkAsks(asks);
  const { tape, hourAgoProb } = appendInsideTape(
    prevTape,
    walked.insideProb ? { t: now, insideProb: walked.insideProb, sizeUsd: walked.insideSizeUsd } : null,
    now,
  );
  const read = bookRead({
    pinAmerican: pin,
    insideProb: walked.insideProb,
    sizeUsd: walked.sizeUsd,
    hourAgoProb,
  });
  return {
    insideAmerican: walked.insideAmerican,
    insideProb: walked.insideProb,
    sizeUsd: walked.sizeUsd,
    levels: walked.levels,
    gapPp: read.gapPp,
    shortenedPp: read.shortenedPp,
    read: read.read,
    tape,
  };
}

async function kalshiBook(ticker) {
  if (!ticker) return { yes: [], no: [] };
  const data = await getJson(`${KALSHI}/markets/${encodeURIComponent(ticker)}/orderbook`);
  const book = data?.orderbook_fp || data?.orderbook || {};
  return {
    yes: asksFromKalshiNoBids(book.no_dollars || book.no || []),
    no: asksFromKalshiNoBids(book.yes_dollars || book.yes || []),
  };
}

// Boards written before the ticker fields existed still carry the event
// ticker. The two moneyline markets hang off that event.
async function kalshiEventMarkets(eventTicker) {
  if (!eventTicker) return [];
  const data = await getJson(`${KALSHI}/markets?event_ticker=${encodeURIComponent(eventTicker)}&limit=100`);
  return Array.isArray(data?.markets) ? data.markets : [];
}

function tickerForTeam(markets, team) {
  const want = String(team || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (!want) return null;
  const named = markets.find((m) => String(m.yes_sub_title || '').toLowerCase().includes(want));
  if (named?.ticker) return named.ticker;
  const last = want.split(' ').filter((w) => w.length > 2).pop();
  if (!last) return null;
  const loose = markets.find((m) => String(m.yes_sub_title || '').toLowerCase().includes(last));
  return loose?.ticker || null;
}

async function polyAsks(tokenId) {
  if (!tokenId) return [];
  const data = await getJson(`${CLOB}/book?token_id=${encodeURIComponent(tokenId)}`);
  return asksFromPoly(data?.asks);
}

function prevGame(prev, sport, gameKey) {
  return prev?.games?.[`${sport}|${gameKey}`] || null;
}

async function main() {
  const now = Date.now();
  const kalshi = readJson('kalshi_data.json') || {};
  const poly = readJson('polymarket_data.json') || {};
  const pinn = readJson('pinnacle_history.json') || {};
  const prev = readJson('orderbook_liquidity.json') || {};
  const games = {};
  let books = 0;
  let failed = 0;

  const keys = new Set();
  for (const sport of SPORTS) {
    for (const gameKey of Object.keys(kalshi[sport] || {})) keys.add(`${sport}|${gameKey}`);
    for (const gameKey of Object.keys(poly[sport] || {})) keys.add(`${sport}|${gameKey}`);
  }

  for (const id of keys) {
    const [sport, gameKey] = id.split('|');
    const k = kalshi[sport]?.[gameKey] || null;
    const p = poly[sport]?.[gameKey] || null;
    const pin = lookupPinnGame(pinn, sport, gameKey);
    const old = prevGame(prev, sport, gameKey);
    const away = k?.awayTeam || p?.awayTeam || pin?.awayTeam || '';
    const home = k?.homeTeam || p?.homeTeam || pin?.homeTeam || '';
    const row = { sport, gameKey, away, home, ml: {}, spreads: [], totals: [] };

    const take = async (label, fn) => {
      try {
        const asks = await fn();
        books++;
        await sleep(60);
        return asks;
      } catch (err) {
        failed++;
        console.warn(`  ${label}: ${err.message}`);
        return [];
      }
    };

    // Moneyline books, one venue at a time.
    row.ml = {};
    const mlVenues = { away: {}, home: {} };
    let awayTicker = k?.awayTicker || null;
    let homeTicker = k?.homeTicker || null;
    if (k?.eventTicker && (!awayTicker || !homeTicker)) {
      try {
        const markets = await kalshiEventMarkets(k.eventTicker);
        awayTicker = awayTicker || tickerForTeam(markets, away);
        homeTicker = homeTicker || tickerForTeam(markets, home);
        if (awayTicker && awayTicker === homeTicker) homeTicker = null;
        await sleep(60);
      } catch (err) {
        console.warn(`  kalshi ${id} event: ${err.message}`);
      }
    }
    if (awayTicker) {
      const book = await take(`kalshi ${id} ML away`, () => kalshiBook(awayTicker));
      mlVenues.away.kalshi = book?.yes || [];
    }
    if (homeTicker) {
      const book = await take(`kalshi ${id} ML home`, () => kalshiBook(homeTicker));
      mlVenues.home.kalshi = book?.yes || [];
    }
    const tokens = p?.polyMl?.tokenIds;
    if (Array.isArray(tokens) && tokens[0]) {
      const a = await take(`poly ${id} ML a`, () => polyAsks(tokens[0]));
      const b = tokens[1] ? await take(`poly ${id} ML b`, () => polyAsks(tokens[1])) : [];
      const t0Away = p.polyMl.token0IsAway !== false;
      mlVenues[t0Away ? 'away' : 'home'].poly = a;
      mlVenues[t0Away ? 'home' : 'away'].poly = b;
    }
    for (const side of ['away', 'home']) {
      const venues = {};
      const pinPx = pinAmerican(pin, 'ml', side);
      for (const [venue, asks] of Object.entries(mlVenues[side])) {
        if (!asks?.length) continue;
        venues[venue] = packSide(asks, pinPx, old?.ml?.[side]?.venues?.[venue]?.tape, now);
      }
      if (Object.keys(venues).length) row.ml[side] = { pinAmerican: pinPx, venues };
    }

    const spreadRows = Array.isArray(k?.spreads) ? k.spreads : [];
    for (const s of spreadRows) {
      if (!s?.ticker) continue;
      const book = await take(`kalshi ${id} spread ${s.line}`, () => kalshiBook(s.ticker));
      if (!book?.yes?.length && !book?.no?.length) continue;
      const yesSide = teamSide(s.label, away, home);
      const noSide = yesSide === 'away' ? 'home' : yesSide === 'home' ? 'away' : null;
      const yesPin = pinAmerican(pin, 'spread', yesSide || 'home', s.line);
      const noPin = noSide ? pinAmerican(pin, 'spread', noSide, s.line) : null;
      row.spreads.push({
        line: s.line,
        label: s.label,
        yesSide,
        pinAmerican: yesPin,
        noPin,
        venues: book.yes?.length ? { kalshi: packSide(book.yes, yesPin, null, now) } : {},
        noVenues: book.no?.length ? { kalshi: packSide(book.no, noPin, null, now) } : {},
      });
    }

    const polySpread = p?.polySpread;
    if (Array.isArray(polySpread?.tokenIds) && polySpread.tokenIds[0]) {
      const asks = await take(`poly ${id} spread`, () => polyAsks(polySpread.tokenIds[0]));
      if (asks.length) {
        const yesSide = teamSide(polySpread.outcomes?.[0] || polySpread.title, away, home);
        const pinPx = pinAmerican(pin, 'spread', yesSide || 'home', polySpread.line);
        const existing = row.spreads.find((r) => Number.isFinite(r.line) && Number.isFinite(polySpread.line)
          && Math.abs(Math.abs(r.line) - Math.abs(polySpread.line)) < 0.26 && r.yesSide === yesSide);
        const packed = packSide(asks, pinPx, null, now);
        if (existing) existing.venues.poly = packed;
        else row.spreads.push({ line: polySpread.line, label: polySpread.title, yesSide, pinAmerican: pinPx, venues: { poly: packed } });
      }
    }

    const totalRows = Array.isArray(k?.totals) ? k.totals : [];
    for (const t of totalRows) {
      if (!t?.ticker) continue;
      const book = await take(`kalshi ${id} total ${t.line}`, () => kalshiBook(t.ticker));
      if (!book?.yes?.length && !book?.no?.length) continue;
      const yesSide = /under/i.test(t.label) ? 'away' : 'home';
      const noSide = yesSide === 'home' ? 'away' : 'home';
      const yesPin = pinAmerican(pin, 'total', yesSide, t.line);
      const noPin = pinAmerican(pin, 'total', noSide, t.line);
      const oldTotal = old?.totals?.find((x) => x.line === t.line && x.yesSide === yesSide);
      row.totals.push({
        line: t.line,
        label: t.label,
        yesSide,
        pinAmerican: yesPin,
        noPin,
        venues: book.yes?.length ? { kalshi: packSide(book.yes, yesPin, oldTotal?.venues?.kalshi?.tape, now) } : {},
        noVenues: book.no?.length ? { kalshi: packSide(book.no, noPin, oldTotal?.noVenues?.kalshi?.tape, now) } : {},
      });
    }

    const polyTotal = p?.polyTotal;
    if (Array.isArray(polyTotal?.tokenIds) && polyTotal.tokenIds[0]) {
      const asks = await take(`poly ${id} total`, () => polyAsks(polyTotal.tokenIds[0]));
      if (asks.length) {
        const name = polyTotal.outcomes?.[0] || polyTotal.title || '';
        const yesSide = /under/i.test(name) ? 'away' : 'home';
        const pinPx = pinAmerican(pin, 'total', yesSide, polyTotal.line);
        const packed = packSide(asks, pinPx, null, now);
        const existing = row.totals.find((r) => Number.isFinite(r.line) && Number.isFinite(polyTotal.line)
          && Math.abs(r.line - polyTotal.line) < 0.26 && r.yesSide === yesSide);
        if (existing) existing.venues.poly = packed;
        else row.totals.push({ line: polyTotal.line, label: polyTotal.title, yesSide, pinAmerican: pinPx, venues: { poly: packed } });
      }
    }

    if (row.ml.away || row.ml.home || row.spreads.length || row.totals.length) {
      games[id] = row;
    }
  }

  const novig = process.env.NOVIG_CLIENT_ID && process.env.NOVIG_CLIENT_SECRET;
  const prophet = process.env.PROPHETX_ACCESS_KEY && process.env.PROPHETX_SECRET_KEY;
  const out = {
    updatedAt: new Date(now).toISOString(),
    venues: {
      kalshi: 'book',
      polymarket: 'book',
      novig: novig ? 'credentials-present' : 'no-credentials',
      prophetx: prophet ? 'credentials-present' : 'no-credentials',
    },
    games,
  };
  writeFileSync(OUT, JSON.stringify(out));
  console.log(`Wrote ${Object.keys(games).length} games, ${books} books, ${failed} misses → ${OUT}`);
  if (!novig) console.log('Novig book skipped — set NOVIG_CLIENT_ID and NOVIG_CLIENT_SECRET');
  if (!prophet) console.log('ProphetX book skipped — set PROPHETX_ACCESS_KEY and PROPHETX_SECRET_KEY');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Wallet positions. Data API v1 (`/positions?offset=`) was retired (HTTP 410)
 * on 2026-11-02 and every scan after that wrote an empty board. v2 is
 * `GET /v2/positions` with `{ data, pagination.next_cursor }`. Rows are mapped
 * back to the v1 field names the scan already matches on.
 *
 * A full page means later rows exist. Read two more pages, 1,500 rows.
 * A failed later page keeps the pages already read so a timeout cannot
 * drop rows the scan already had.
 */

export const POSITION_PAGE_SIZE = 500;
export const MAX_POSITION_PAGES = 3;
const POSITIONS_V2 = 'https://data-api.polymarket.com/v2/positions';

let secondPagesRead = 0;
let thirdPagesRead = 0;

export function takeSecondPageCount() {
  const n = secondPagesRead;
  secondPagesRead = 0;
  return n;
}

export function takeThirdPageCount() {
  const n = thirdPagesRead;
  thirdPagesRead = 0;
  return n;
}

function notePagesRead(n) {
  if (n > 1) secondPagesRead += 1;
  if (n > 2) thirdPagesRead += 1;
}

function mergeAllPages(pages) {
  let rows = [];
  for (const page of pages) rows = mergePositionPages(rows, page);
  return rows;
}

/** Drop a later page's duplicate asset so a shifting sort cannot double-count. */
export function mergePositionPages(first, second) {
  const rows = [];
  const seen = new Set();
  for (const page of [first, second]) {
    if (!Array.isArray(page)) continue;
    for (const p of page) {
      const asset = p?.asset != null && p.asset !== '' ? String(p.asset) : '';
      if (asset) {
        if (seen.has(asset)) continue;
        seen.add(asset);
      }
      rows.push(p);
    }
  }
  return rows;
}

/**
 * @param {(offset: number) => Promise<Array|null>} fetchPage
 *   Resolves an array, or null when that page failed.
 * @returns {Promise<Array|null>} null only when the first page failed.
 */
export async function fetchTwoPositionPages(fetchPage) {
  const first = await fetchPage(0);
  if (!Array.isArray(first)) return first ?? null;
  if (first.length < POSITION_PAGE_SIZE) return first;
  let second = null;
  try {
    second = await fetchPage(POSITION_PAGE_SIZE);
  } catch {
    second = null;
  }
  if (!Array.isArray(second)) return first;
  secondPagesRead += 1;
  return mergePositionPages(first, second);
}

/** v2 row → the v1 shape scanSharpPositions and the whitelist scan already read. */
export function positionFromV2(row) {
  if (!row || typeof row !== 'object') return null;
  const rawIndex = row.outcome_index;
  const outcomeIndex = rawIndex == null || rawIndex === '' || Number(rawIndex) === 999
    ? null
    : Number(rawIndex);
  return {
    asset: row.token_id ?? '',
    conditionId: row.condition_id ?? '',
    title: row.title || '',
    slug: row.slug || '',
    eventSlug: row.event_slug || '',
    outcome: row.outcome || '',
    outcomeIndex,
    size: row.current_size ?? 0,
    avgPrice: row.avg_price ?? 0,
    curPrice: row.current_price ?? 0,
    cashPnl: row.unrealized_pnl ?? 0,
    eventId: row.event_id ?? '',
  };
}

/**
 * Open positions for one wallet. `fetchJson` resolves the parsed body, or
 * null when the request failed. Returns [] when the wallet has none, and
 * null only when the first page failed.
 * @param {string} user
 * @param {(url: string) => Promise<object|null>} fetchJson
 */
export async function fetchOpenPositionsV2(user, fetchJson) {
  if (!user || typeof fetchJson !== 'function') return null;
  const pages = [];
  let cursor = '';
  for (let page = 0; page < MAX_POSITION_PAGES; page++) {
    const params = new URLSearchParams({
      user: String(user),
      limit: String(POSITION_PAGE_SIZE),
      status: 'OPEN',
    });
    if (cursor) params.set('cursor', cursor);
    let body = null;
    try {
      body = await fetchJson(`${POSITIONS_V2}?${params}`);
    } catch {
      body = null;
    }
    const data = body && Array.isArray(body.data) ? body.data : null;
    if (!data) {
      notePagesRead(pages.length);
      return pages.length ? mergeAllPages(pages) : null;
    }
    pages.push(data.map(positionFromV2).filter(Boolean));
    const next = body.pagination?.next_cursor;
    if (!body.pagination?.has_more || !next || data.length < POSITION_PAGE_SIZE) break;
    cursor = String(next);
  }
  notePagesRead(pages.length);
  return mergeAllPages(pages);
}

// Cloudflare answers 429, with no Retry-After, to Node's default fetch
// signature. The same URL with a browser User-Agent returns 200. Starts stay
// 80ms apart (125 per 10s) so a healthy scan remains under the 200
// /v2/positions reads per 10s window.
export const POSITION_START_GAP_MS = 80;
const RATE_LIMIT_RETRIES = 6;
const POSITION_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

export function createPacedJsonFetch(httpFetch, {
  gapMs = POSITION_START_GAP_MS,
  retries = 3,
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  now = () => Date.now(),
  warn = () => {},
} = {}) {
  let nextSlot = 0;
  let coolUntil = 0;
  let strike = 0;
  let lastWarn = 0;

  return async function paced(url) {
    let hits = 0;
    let otherFails = 0;
    while (hits <= RATE_LIMIT_RETRIES && otherFails <= retries) {
      const t = now();
      const slot = Math.max(t, nextSlot, coolUntil);
      nextSlot = slot + gapMs;
      if (slot > t) await sleep(slot - t);
      let res;
      try {
        res = await httpFetch(url, { headers: POSITION_HEADERS });
      } catch {
        otherFails += 1;
        if (otherFails > retries) return null;
        await sleep(400 * otherFails);
        continue;
      }
      if (res?.status === 429) {
        hits += 1;
        strike += 1;
        const ra = Number(res.headers?.get?.('retry-after'));
        const wait = Number.isFinite(ra) && ra > 0
          ? Math.min(120000, Math.max(15000, ra * 1000))
          : Math.min(90000, 30000 * Math.min(strike, 3));
        coolUntil = Math.max(coolUntil, now() + wait);
        nextSlot = Math.max(nextSlot, coolUntil);
        if (now() - lastWarn >= 15000) {
          lastWarn = now();
          warn(`Rate limited, pausing ${Math.round(wait / 1000)}s`);
        }
        if (hits > RATE_LIMIT_RETRIES) return null;
        continue;
      }
      if (!res?.ok) {
        otherFails += 1;
        if (otherFails > retries) return null;
        await sleep(400 * otherFails);
        continue;
      }
      strike = 0;
      try {
        return await res.json();
      } catch {
        otherFails += 1;
        if (otherFails > retries) return null;
      }
    }
    return null;
  };
}

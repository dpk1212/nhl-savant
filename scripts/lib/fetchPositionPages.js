/**
 * Wallet positions. Data API v1 (`/positions?offset=`) was retired (HTTP 410)
 * on 2026-11-02 and every scan after that wrote an empty board. v2 is
 * `GET /v2/positions` with `{ data, pagination.next_cursor }`. Rows are mapped
 * back to the v1 field names the scan already matches on.
 *
 * A full page means later rows exist. Read one more page. A failed second
 * page keeps the first page so a timeout cannot drop a wallet the scan
 * already had.
 */

export const POSITION_PAGE_SIZE = 500;
const POSITIONS_V2 = 'https://data-api.polymarket.com/v2/positions';

let secondPagesRead = 0;

export function takeSecondPageCount() {
  const n = secondPagesRead;
  secondPagesRead = 0;
  return n;
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
  for (let page = 0; page < 2; page++) {
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
    if (!data) return pages.length ? mergePositionPages(pages[0], []) : null;
    pages.push(data.map(positionFromV2).filter(Boolean));
    const next = body.pagination?.next_cursor;
    if (!body.pagination?.has_more || !next || data.length < POSITION_PAGE_SIZE) break;
    cursor = String(next);
  }
  if (pages.length > 1) secondPagesRead += 1;
  return mergePositionPages(pages[0], pages[1] || []);
}

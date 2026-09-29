/**
 * Polymarket's positions endpoint caps a response at 500 rows, ordered by
 * share count. A full page means later rows exist. Read one more page.
 * A failed second page keeps the first page so a timeout cannot drop a
 * wallet the scan already had.
 */

export const POSITION_PAGE_SIZE = 500;

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

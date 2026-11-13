/**
 * Data API v2 shapes for the fat-ticket discover pass.
 * v1 `/holders`, `/v1/leaderboard`, and `/closed-positions` have been
 * HTTP 410 since 2026-11-02. Discover was still calling them, so a sharp
 * wallet that is not already in sports_sharps never reached the scan.
 */

import { BOARD_SPORT_SLUG, SOC_SLUG_LEAGUES, slugLeague } from '../../src/lib/sportSlug.js';

/** NBA/NHL/… slug when the title never says the sport. MLB already had a one-off. */
export function sportFromBoardSlug(slug) {
  const league = slugLeague(slug);
  if (!league) return null;
  if (SOC_SLUG_LEAGUES.has(league)) return 'SOC';
  for (const [sport, token] of Object.entries(BOARD_SPORT_SLUG)) {
    if (token === league) return sport;
  }
  return null;
}

/**
 * Official sports leaderboard row.
 * v2 `?user=` returns `{ data: { pnl, volume, rank_pnl, user_name } }`.
 * v1 returned the row, or a one-element array, with `vol` and `userName`.
 */
export function lbRow(raw) {
  let row = raw;
  if (row && typeof row === 'object' && !Array.isArray(row) && row.data && !Array.isArray(row.data)) {
    row = row.data;
  } else if (row && typeof row === 'object' && Array.isArray(row.data)) {
    row = row.data[0];
  } else if (Array.isArray(row)) {
    row = row[0];
  }
  if (!row || row.pnl == null) return null;
  const pnl = Number(row.pnl);
  const vol = Number(row.volume ?? row.vol) || 0;
  if (!Number.isFinite(pnl)) return null;
  const rankRaw = row.rank_pnl != null ? row.rank_pnl : row.rank;
  return {
    name: row.user_name || row.userName || null,
    pnl,
    vol,
    rank: rankRaw != null ? Number(rankRaw) : null,
    roi: vol > 0 ? +((pnl / vol) * 100).toFixed(1) : null,
  };
}

/** v2 `{ data: [{ holders }] }` and the retired top-level array, both in the old field names. */
export function holderGroups(raw) {
  const blocks = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
  if (!blocks) return null;
  return blocks.map((block) => ({
    holders: (block?.holders || []).map((h) => ({
      proxyWallet: h.proxyWallet || h.proxy_wallet || '',
      amount: h.amount,
      outcomeIndex: h.outcomeIndex != null ? h.outcomeIndex : h.outcome_index,
      name: h.name || h.pseudonym || null,
      pseudonym: h.pseudonym || null,
    })),
  }));
}

/** One closed-positions page. v2 is `{ data, pagination.next_cursor }`. */
export function closedRowsFromPage(raw) {
  const rows = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
  if (!rows) return { rows: [], nextCursor: '', hasMore: false };
  const mapped = rows.map((p) => ({
    title: p.title || '',
    slug: p.slug || '',
    eventSlug: p.eventSlug || p.event_slug || '',
    curPrice: p.curPrice != null ? p.curPrice : p.current_price,
    conditionId: p.conditionId || p.condition_id || '',
    outcomeIndex: p.outcomeIndex != null ? p.outcomeIndex : p.outcome_index,
  }));
  const pag = raw?.pagination || {};
  return {
    rows: mapped,
    nextCursor: pag.next_cursor || '',
    hasMore: !!pag.has_more && !!pag.next_cursor,
  };
}

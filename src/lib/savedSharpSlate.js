/**
 * My Sharps slate for Sharp Intel.
 * The Intel feed is Proven-only. Saved wallets are joined back from the raw scan.
 */
import {
  buildConfirmedActionRows,
  mergePortfolioActionRows,
  filterActionRows,
} from './confirmedActionDesk.js';
import {
  buildMySharpsBoard,
  filterRowsToMySharps,
  groupPortfolioBets,
  rowsForBetsFeed,
} from './mySharpsDesk.js';

export function buildSavedSharpGroups({
  sharpPositions = null,
  spreadPositions = null,
  totalPositions = null,
  rawSharpPositions = null,
  rawSpreadPositions = null,
  rawTotalPositions = null,
  walletProfiles = null,
  pinnacleHistory = null,
  polyData = null,
  portfolioShorts = null,
  roster = [],
  names = {},
  tails = {},
  sportFilter = 'All',
  dateKey = null,
  nowMs = Date.now(),
} = {}) {
  const qualified = buildConfirmedActionRows({
    sharpPositions,
    spreadPositions,
    totalPositions,
    walletProfiles,
    pinnacleHistory,
    polyData,
    sportFilter,
    portfolioShorts,
  }).rows;
  const haveRaw = rawSharpPositions || rawSpreadPositions || rawTotalPositions;
  const rawRows = haveRaw
    ? buildConfirmedActionRows({
      sharpPositions: rawSharpPositions,
      spreadPositions: rawSpreadPositions,
      totalPositions: rawTotalPositions,
      walletProfiles,
      pinnacleHistory,
      polyData,
      sportFilter,
      portfolioShorts,
    }).rows
    : [];
  const rows = mergePortfolioActionRows(qualified, rawRows);
  const dated = filterActionRows(rows, {
    sport: sportFilter,
    dateKey,
    nowMs,
    minInvested: 0,
  });
  const mine = filterRowsToMySharps(dated, portfolioShorts);
  const fed = rowsForBetsFeed(mine, roster);
  const board = buildMySharpsBoard(fed);
  return groupPortfolioBets(board.tickets, { names, tails, walletProfiles });
}

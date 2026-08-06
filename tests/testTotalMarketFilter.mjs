/**
 * Full-game total market filter (F5 / team total / alt-line guards).
 * Usage: node tests/testTotalMarketFilter.mjs
 */
import assert from 'assert';
import {
  isNonFullGameTotalMarket,
  parseTotalEntryLine,
  isMainishTotalLine,
  looksLikeMlbF5Line,
  acceptFullGameTotalPosition,
} from '../scripts/lib/totalMarketFilter.js';

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed++;
}

// DET@SEA 2026-08-06 — real Polymarket titles
ok(
  isNonFullGameTotalMarket('Detroit Tigers vs. Seattle Mariners: 1st 5 Innings O/U 3.5', 'mlb-det-sea-2026-08-06-f5-total-3pt5'),
  'F5 title rejected',
);
ok(
  !isNonFullGameTotalMarket('Detroit Tigers vs. Seattle Mariners: O/U 7.5', 'mlb-det-sea-2026-08-06-total-7pt5'),
  'full-game O/U 7.5 accepted',
);
ok(
  !isNonFullGameTotalMarket('Detroit Tigers vs. Seattle Mariners: O/U 6.5', 'mlb-det-sea-2026-08-06-total-6pt5'),
  'full-game alt O/U 6.5 is FG (alt gate separate)',
);

ok(isNonFullGameTotalMarket('Team Total: Tigers O/U 3.5', ''), 'team total rejected');
ok(isNonFullGameTotalMarket('Lakers vs Celtics 1st Half O/U 110.5', ''), '1H rejected');
ok(isNonFullGameTotalMarket('NRFI', 'mlb-foo-nrfi'), 'NRFI rejected');

ok(parseTotalEntryLine('O/U 7.5') === 7.5, 'parse 7.5');
ok(parseTotalEntryLine('1st 5 Innings O/U 3.5') === 3.5, 'parse F5 line');

ok(isMainishTotalLine(7.5, 7.5), 'main == main');
ok(isMainishTotalLine(6.5, 7.5), '±1 alt kept');
ok(!isMainishTotalLine(5.5, 7.5), '±2 alt dropped');
ok(isMainishTotalLine(6.5, null), 'no main → allow');

ok(looksLikeMlbF5Line(3.5), '3.5 looks F5');
ok(!looksLikeMlbF5Line(7.5), '7.5 not F5 heuristic');

ok(
  !acceptFullGameTotalPosition({
    title: 'Detroit Tigers vs. Seattle Mariners: 1st 5 Innings O/U 3.5',
    slug: 'mlb-det-sea-2026-08-06-f5-total-3pt5',
    entryLine: 3.5,
    mainLine: 7.5,
    sport: 'MLB',
  }).ok,
  'accept rejects F5',
);
ok(
  acceptFullGameTotalPosition({
    title: 'Detroit Tigers vs. Seattle Mariners: O/U 7.5',
    slug: 'mlb-det-sea-2026-08-06-total-7pt5',
    entryLine: 7.5,
    mainLine: 7.5,
    sport: 'MLB',
  }).ok,
  'accept keeps main FG',
);
ok(
  acceptFullGameTotalPosition({
    title: 'Detroit Tigers vs. Seattle Mariners: O/U 6.5',
    entryLine: 6.5,
    mainLine: 7.5,
    sport: 'MLB',
  }).ok,
  'accept keeps ±1 FG alt',
);
ok(
  !acceptFullGameTotalPosition({
    title: '',
    slug: '',
    entryLine: 3.5,
    mainLine: 7.5,
    sport: 'MLB',
  }).ok,
  'titleless MLB 3.5 rejected by heuristic',
);
ok(
  !acceptFullGameTotalPosition({
    title: 'Detroit Tigers vs. Seattle Mariners: O/U 5.5',
    entryLine: 5.5,
    mainLine: 7.5,
    sport: 'MLB',
  }).ok,
  'far alt rejected vs main 7.5',
);

console.log(`OK — ${passed} assertions`);

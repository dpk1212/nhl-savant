/**
 * Full-game total + period ML/spread market filter.
 * Usage: node tests/testTotalMarketFilter.mjs
 */
import assert from 'assert';
import {
  isNonFullGameTotalMarket,
  isPeriodOrSegmentMarket,
  parseTotalEntryLine,
  isMainishTotalLine,
  looksLikeMlbF5Line,
  acceptFullGameTotalPosition,
  acceptFullGameSidePosition,
  pickFullGameMlMarket,
  pickFullGameSpreadMarket,
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
ok(
  isNonFullGameTotalMarket('Michigan State 1H Team Total: O/U 12.5', 'cfb-toledo-mst-2026-09-04-1h-team-total-mst-12pt5'),
  '1H team total rejected',
);

ok(parseTotalEntryLine('O/U 7.5') === 7.5, 'parse 7.5');
ok(parseTotalEntryLine('1st 5 Innings O/U 3.5') === 3.5, 'parse F5 line');

ok(isMainishTotalLine(7.5, 7.5), 'main == main');
ok(isMainishTotalLine(6.5, 7.5), '±1 alt kept');
ok(isMainishTotalLine(5.5, 7.5), '±2 alt kept (maxDiff 2.5)');
ok(!isMainishTotalLine(4.5, 7.5), '±3 alt dropped');
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
    title: 'Detroit Tigers vs. Seattle Mariners: O/U 4.5',
    entryLine: 4.5,
    mainLine: 7.5,
    sport: 'MLB',
  }).ok,
  'far alt rejected vs main 7.5',
);

// ── CFB period ML/spread (Toledo @ Michigan State 2026-09-04, event 912889)
const TOL_FG = {
  title: 'Toledo vs. Michigan State',
  slug: 'cfb-toledo-mst-2026-09-04',
};
const TOL_4Q = {
  title: 'Toledo vs. Michigan State: 4Q Moneyline',
  slug: 'cfb-toledo-mst-2026-09-04-4q-moneyline',
};
ok(isPeriodOrSegmentMarket(TOL_4Q.title, TOL_4Q.slug), '4Q ML is period');
ok(!isPeriodOrSegmentMarket(TOL_FG.title, TOL_FG.slug), 'full-game ML is not period');
ok(
  isPeriodOrSegmentMarket('Toledo vs. Michigan State: 1Q Moneyline', 'cfb-toledo-mst-2026-09-04-1q-moneyline'),
  '1Q ML is period',
);
ok(
  isPeriodOrSegmentMarket('Toledo vs. Michigan State: 1H Moneyline', 'cfb-toledo-mst-2026-09-04-1h-moneyline'),
  '1H ML is period',
);
ok(
  isPeriodOrSegmentMarket('Toledo vs. Michigan State: 2H Moneyline', 'cfb-toledo-mst-2026-09-04-2h-moneyline'),
  '2H ML is period',
);
ok(
  isPeriodOrSegmentMarket('1Q Spread: Michigan State (-0.5)', 'cfb-toledo-mst-2026-09-04-1q-spread-home-0pt5'),
  '1Q spread is period',
);
ok(
  isPeriodOrSegmentMarket('4Q Spread: Michigan State (-3.5)', 'cfb-toledo-mst-2026-09-04-4q-spread-home-3pt5'),
  '4Q spread is period',
);
ok(
  isPeriodOrSegmentMarket('1H Spread: Michigan State (-4.5)', 'cfb-toledo-mst-2026-09-04-1h-spread-home-4pt5'),
  '1H spread is period',
);
ok(
  !isPeriodOrSegmentMarket('Spread: Michigan State (-10.5)', 'cfb-toledo-mst-2026-09-04-spread-home-10pt5'),
  'full-game spread is not period',
);
ok(
  !isPeriodOrSegmentMarket('Colorado vs. Georgia Tech', 'cfb-colo-gt-2026-09-04'),
  'colo_gt full ML is not period',
);
ok(
  isPeriodOrSegmentMarket('Colorado vs. Georgia Tech: 1Q Moneyline', 'cfb-colo-gt-2026-09-04-1q-moneyline'),
  'colo_gt 1Q ML is period',
);

ok(!acceptFullGameSidePosition(TOL_4Q).ok, 'acceptFullGameSide rejects 4Q ML');
ok(acceptFullGameSidePosition(TOL_FG).ok, 'acceptFullGameSide keeps full ML');
ok(
  !acceptFullGameSidePosition({
    title: '',
    slug: '',
    conditionId: '0xe075437767b3f7dabf5b70c2a246c7d515e4dfc7f1ca91d440406334e99de746',
    fgConditionId: '0x3c0c0fa752368746b6d751bcd692084d3bab92e721647f0090705856fd5f3b0b',
    marketType: 'ml',
    sport: 'CFB',
  }).ok,
  'titleless 4Q rejected by ML conditionId mismatch',
);
ok(
  acceptFullGameSidePosition({
    title: '',
    slug: '',
    conditionId: '0x3c0c0fa752368746b6d751bcd692084d3bab92e721647f0090705856fd5f3b0b',
    fgConditionId: '0x3c0c0fa752368746b6d751bcd692084d3bab92e721647f0090705856fd5f3b0b',
    marketType: 'ml',
    sport: 'CFB',
  }).ok,
  'titleless FG kept when conditionId matches',
);
ok(
  !acceptFullGameSidePosition({
    title: '1Q Spread: Michigan State (-0.5)',
    slug: 'cfb-toledo-mst-2026-09-04-1q-spread-home-0pt5',
  }).ok,
  'acceptFullGameSide rejects 1Q spread',
);
ok(
  acceptFullGameSidePosition({
    title: 'Spread: Michigan State (-10.5)',
    slug: 'cfb-toledo-mst-2026-09-04-spread-home-10pt5',
  }).ok,
  'acceptFullGameSide keeps full spread',
);

// Picker: 4Q listed first must not win polyMl; event slug wins.
const tolMarkets = [
  { slug: 'cfb-toledo-mst-2026-09-04-4q-moneyline', question: 'Toledo vs. Michigan State: 4Q Moneyline', groupItemTitle: '4Q Moneyline', outcomes: ['Toledo', 'Michigan State'] },
  { slug: 'cfb-toledo-mst-2026-09-04-1h-moneyline', question: 'Toledo vs. Michigan State: 1H Moneyline', groupItemTitle: '1H Moneyline', outcomes: ['Toledo', 'Michigan State'] },
  { slug: 'cfb-toledo-mst-2026-09-04', question: 'Toledo vs. Michigan State', groupItemTitle: '', outcomes: ['Toledo', 'Michigan State'] },
  { slug: 'cfb-toledo-mst-2026-09-04-1q-spread-home-0pt5', question: '1Q Spread: Michigan State (-0.5)', groupItemTitle: '1Q Spread -0.5', outcomes: ['Toledo', 'Michigan State'] },
  { slug: 'cfb-toledo-mst-2026-09-04-spread-home-10pt5', question: 'Spread: Michigan State (-10.5)', groupItemTitle: '', outcomes: ['Toledo', 'Michigan State'] },
  { slug: 'cfb-toledo-mst-2026-09-04-total-49pt5', question: 'O/U 49.5', groupItemTitle: '', outcomes: ['Over', 'Under'] },
];
const mlPick = pickFullGameMlMarket(tolMarkets, 'cfb-toledo-mst-2026-09-04');
ok(mlPick?.slug === 'cfb-toledo-mst-2026-09-04', 'ML picker prefers event-slug market over 4Q listed first');
const spPick = pickFullGameSpreadMarket(tolMarkets);
ok(spPick?.slug === 'cfb-toledo-mst-2026-09-04-spread-home-10pt5', 'spread picker skips 1Q spread');

console.log(`OK — ${passed} assertions`);

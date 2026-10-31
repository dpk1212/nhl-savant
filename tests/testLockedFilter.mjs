/**
 * Locked filter counts, URL, and sort universe.
 * Usage: node tests/testLockedFilter.mjs
 */
import assert from 'assert';
import {
  defaultLockedFilter,
  describeLockedSlate,
  lockedFilterBadgeCount,
  lockedFiltersEqual,
  mergeLockedFilterSearch,
  parseLockedFilter,
  resolveLockedFilter,
  serializeLockedFilterQuery,
} from '../src/lib/lockedFilter.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

const NOW = Date.parse('2026-10-31T18:00:00Z');
const FUTURE = NOW + 3 * 60 * 60 * 1000;
const PAST = NOW - 3 * 60 * 60 * 1000;

function pick(over) {
  return {
    sport: 'NHL',
    marketType: 'ml',
    units: 2,
    odds: -110,
    stars: 3,
    isMonitoring: false,
    health: { status: 'ACTIVE' },
    outcome: null,
    status: 'PENDING',
    commenceMs: FUTURE,
    gameTime: new Date(FUTURE).toISOString(),
    profit: 0,
    ...over,
  };
}

const slate = [
  pick({ sport: 'CFB', marketType: 'spread', units: 3, team: 'cfb-spread' }),
  pick({ sport: 'CFB', marketType: 'ml', units: 1, team: 'cfb-ml' }),
  pick({ sport: 'NBA', units: 2.5, team: 'nba' }),
  pick({ sport: 'NHL', units: 1, commenceMs: PAST, gameTime: new Date(PAST).toISOString(), team: 'live' }),
  pick({ sport: 'NHL', outcome: 'WIN', status: 'COMPLETED', profit: 2, commenceMs: PAST, team: 'won' }),
  pick({ sport: 'NHL', outcome: 'LOSS', status: 'COMPLETED', profit: -1.5, commenceMs: PAST, team: 'lost' }),
  pick({ sport: 'NHL', outcome: 'PUSH', status: 'COMPLETED', profit: 0, commenceMs: PAST, team: 'push' }),
  pick({ sport: 'CFB', health: { status: 'MUTED' }, units: 1.5, team: 'weak' }),
  pick({ sport: 'NBA', health: { status: 'CANCELLED' }, team: 'cancelled' }),
  pick({ sport: 'NHL', isMonitoring: true, units: 0, team: 'noplay' }),
];

const view = describeLockedSlate(slate, defaultLockedFilter(), NOW);

ok(view.feed.every((p) => p.team !== 'cancelled'), 'open cancelled stays out of the default feed');
ok(view.feed.some((p) => p.team === 'noplay'), 'No Play cards count in the pending feed');
ok(view.feed.some((p) => p.team === 'weak'), 'weakening stays in the feed until the toggle is on');
ok(!view.feed.some((p) => p.team === 'live' || p.team === 'won'), 'default status is pending, not live or settled');

ok(view.statusCounts.pending === view.feed.length, 'Pending segment matches the pending feed');
const live = describeLockedSlate(slate, { ...defaultLockedFilter(), status: 'live' }, NOW);
ok(live.statusCounts.live === live.feed.length, 'Live segment matches the live feed');
ok(live.feed.length === 1 && live.feed[0].team === 'live', 'live bucket is ungraded after commence');

const settled = describeLockedSlate(slate, { ...defaultLockedFilter(), status: 'settled' }, NOW);
ok(settled.feed.map((p) => p.team).sort().join() === 'lost,push,won', 'settled is won, lost, and push');
ok(settled.statusCounts.settled === settled.feed.length, 'Settled segment matches the settled feed');

const won = describeLockedSlate(slate, { ...defaultLockedFilter(), status: 'won' }, NOW);
ok(won.feed.length === 1 && won.feed[0].team === 'won', 'sheet can narrow settled to won');
ok(won.statusCounts.settled === 3, 'Settled segment stays the full settled count when Won is selected');

const weak = describeLockedSlate(slate, { ...defaultLockedFilter(), sport: 'CFB', weak: true }, NOW);
ok(weak.feed.length === 1 && weak.feed[0].team === 'weak', 'weakening stacks with sport');
ok(weak.weakCount === 1, 'weakening chip count is the stacked feed');
ok(weak.allCount === 1, 'All count keeps weakening and clears sport');

const cfb = describeLockedSlate(slate, { ...defaultLockedFilter(), sport: 'CFB' }, NOW);
ok(cfb.feed.length === cfb.sports.find((s) => s.id === 'CFB').count, 'CFB chip count matches the feed');
ok(cfb.sports[0].id === 'CFB', 'sports sort by feed count, highest first');
ok(cfb.sports.every((s) => s.id !== 'MLB'), 'sports with no cards are absent');
ok(cfb.dayLine.text === view.dayLine.text, 'the day line does not move when a sport chip is tapped');
ok(!cfb.dayLine.text.includes('noplay') , 'day line is a sentence');
ok(view.dayLine.text.startsWith('1\u20131 · '), 'today line leads with the staked record');
ok(view.dayLine.text.includes('pending'), 'today line names pending');
ok(view.dayLine.text.includes('live'), 'today line names live');
ok(view.dayLine.text.includes('risk'), 'today line names risk');
ok(view.dayLine.text.includes('to win'), 'today line names units to win');
ok(!view.dayLine.text.includes('0 pending') || view.dayLine.pending !== 0, 'pending word tracks the count');

ok(view.dayLine.pending === 5, 'day pending is the staked book, including a cancelled ticket, not the No Play card');
ok(!view.dayLine.text.includes('6 pending'), 'No Play is outside the day line');

const y = describeLockedSlate(slate, { ...defaultLockedFilter(), day: 'yesterday' }, NOW);
ok(!y.dayLine.text.includes('risk'), 'yesterday does not read risk');
ok(!y.dayLine.text.includes('to win'), 'yesterday does not read to-win');
ok(y.dayLine.text.includes('+0.5u') || y.dayLine.text.includes('0.5u'), 'yesterday reads realized profit');
ok(y.dayLine.text.startsWith('1\u20131'), 'yesterday still leads with the record');

ok(view.pill === `Pending ${view.feed.length}`, 'default pill is status plus the feed count');
const pill = describeLockedSlate(slate, { ...defaultLockedFilter(), sport: 'CFB', market: 'spread' }, NOW);
ok(pill.pill === `Pending · CFB · Spread ${pill.feed.length}`, 'pill names sport, market, and the feed count');
ok(pill.feed.length === 1 && pill.feed[0].team === 'cfb-spread', 'market filter matches the pill count');

ok(lockedFilterBadgeCount(defaultLockedFilter()) === 0, 'defaults do not light the badge');
ok(lockedFilterBadgeCount({ ...defaultLockedFilter(), sport: 'CFB', market: 'spread', weak: true }) === 3, 'badge counts each non-default');

const q = serializeLockedFilterQuery({ status: 'pending', sport: 'CFB', market: 'spread', sort: 'units', day: 'today', weak: false, cancelled: false });
ok(q === '?sport=cfb&market=spread', 'URL omits defaults');
ok(serializeLockedFilterQuery(defaultLockedFilter()) === '', 'a default view has an empty query');
const round = parseLockedFilter(q).filter;
ok(round.sport === 'CFB' && round.market === 'spread' && round.status === 'pending', 'query parses back onto the filter');
ok(parseLockedFilter('?status=inprogress').filter.status === 'live', 'in progress is the live status');

const shared = resolveLockedFilter('?sport=nba', { sport: 'CFB', status: 'live' });
ok(shared.sport === 'NBA' && shared.status === 'pending', 'a shared link beats storage');
const stored = resolveLockedFilter('', { sport: 'CFB', day: 'yesterday', weak: true });
ok(stored.sport === 'CFB' && stored.day === 'yesterday' && stored.weak === true, 'storage fills in when the URL is bare');
ok(lockedFiltersEqual(stored, { sport: 'cfb', day: 'yesterday', weak: 1 }), 'normalize accepts stored shapes');

ok(mergeLockedFilterSearch('?checkout=success', { ...defaultLockedFilter(), status: 'live' }) === '?checkout=success&status=live', 'filter query keeps unrelated params');

const byUnits = describeLockedSlate(slate, { ...defaultLockedFilter(), status: 'all', cancelled: true }, NOW);
ok(byUnits.feed[0].units >= byUnits.feed[1].units || byUnits.feed[0].health?.status !== 'ACTIVE', 'default order is units inside a health band');

const profit = describeLockedSlate(
  [
    pick({ team: 'open-big', units: 5 }),
    pick({ team: 'win-small', outcome: 'WIN', status: 'COMPLETED', profit: 0.4, units: 1, commenceMs: PAST }),
    pick({ team: 'win-big', outcome: 'WIN', status: 'COMPLETED', profit: 3, units: 1, commenceMs: PAST }),
  ],
  { ...defaultLockedFilter(), status: 'all', sort: 'profit' },
  NOW,
);
ok(profit.feed.map((p) => p.team).join() === 'win-big,win-small,open-big', 'profit ranks graded results and leaves open plays on units');

const win = describeLockedSlate(
  [
    pick({ team: 'a', units: 1 }),
    pick({ team: 'b', units: 4 }),
  ],
  { ...defaultLockedFilter(), sort: 'winpct' },
  NOW,
);
ok(win.feed.map((p) => p.team).join() === 'b,a', 'win % with no rate on the play stays on units');

console.log(`testLockedFilter: ${n} assertions passed`);

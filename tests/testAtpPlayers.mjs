import assert from 'node:assert/strict';
import {
  isMainATPMatchSlug,
  extractATPPlayersFromTitle,
  makeATPGameKey,
  isATPMarketTitle,
  isGradableATPMainML,
  matchATPPositionTitle,
} from '../scripts/lib/atpPlayers.js';

const slug = 'atp-passaro-torre-2026-10-12';
assert.equal(isMainATPMatchSlug(slug), true);
assert.equal(isMainATPMatchSlug('atp-passaro-torre-2026-10-12-match-total-21pt5'), false);
assert.equal(isMainATPMatchSlug('atp-passaro-torre-2026-10-12-set-handicap-home-1pt5'), false);
assert.equal(isMainATPMatchSlug('atp-doubles-a-b-2026-10-12'), false);
assert.equal(isMainATPMatchSlug('atp-de-minaur-sinner-2026-10-13'), true);

const pair = extractATPPlayersFromTitle('Maia: Francesco Passaro vs Tiago Torres');
assert.deepEqual(pair, ['Francesco Passaro', 'Tiago Torres']);
assert.equal(extractATPPlayersFromTitle('Set 1 Winner: Francesco Passaro vs Tiago Torres'), null);
assert.equal(extractATPPlayersFromTitle('Passaro vs. Torres: Match O/U 21.5'), null);

assert.equal(makeATPGameKey('Francesco Passaro', 'Tiago Torres'), 'francescopassaro_tiagotorres');
assert.equal(isATPMarketTitle('Maia: Francesco Passaro vs Tiago Torres', slug), true);
assert.equal(isATPMarketTitle('Passaro vs Torres: Match O/U 21.5', `${slug}-match-total-21pt5`), false);
assert.equal(isGradableATPMainML({ marketType: 'ML', title: 'Maia: Francesco Passaro vs Tiago Torres', slug }), true);
assert.equal(isGradableATPMainML({ marketType: 'SPREAD', title: 'Game Spread: Francesco Passaro (-4.5)' }), false);

const games = {
  'ATP:francescopassaro_tiagotorres': {
    away: 'Francesco Passaro',
    home: 'Tiago Torres',
    eventSlug: slug,
  },
};
const bySlug = matchATPPositionTitle('Francesco Passaro', games, slug);
assert.equal(bySlug?.key, 'francescopassaro_tiagotorres');
assert.equal(bySlug?.sport, 'ATP');
assert.equal(matchATPPositionTitle('Passaro vs Torres: Total Sets O/U 2.5', games, `${slug}-set-totals-2pt5`), null);
assert.equal(matchATPPositionTitle('Maia: Francesco Passaro vs Tiago Torres', games, `${slug}-first-set-winner-Passaro-vs-Torres`), null);

console.log('testAtpPlayers ok');

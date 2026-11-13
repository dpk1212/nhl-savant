import assert from 'node:assert/strict';
import { chooseSettledEvent } from '../scripts/lib/settledMoneyline.js';
import { isMainATPMatchSlug, playersMatch } from '../scripts/lib/atpPlayers.js';

function event(slug, outcomes, prices, type = 'moneyline', closed = true) {
  return {
    slug,
    markets: [{
      sportsMarketType: type,
      closed,
      outcomes,
      outcomePrices: prices,
    }],
  };
}

const shang = event(
  'atp-sweeny-shang-2026-11-12',
  ['Dane Sweeny', 'Juncheng Shang'],
  ['0', '1'],
);
const oldSweeny = event(
  'atp-sweeny-coppeja-2026-10-06',
  ['Dane Sweeny', 'Kimmer Coppejans'],
  ['0', '1'],
);
const setOnly = event(
  'atp-sweeny-shang-2026-11-12',
  ['Dane Sweeny', 'Juncheng Shang'],
  ['0', '1'],
  'tennis_first_set_winner',
);

const picked = chooseSettledEvent([oldSweeny, setOnly, shang], {
  date: '2026-11-12',
  away: 'Dane Sweeny',
  home: 'Juncheng Shang',
  acceptSlug: isMainATPMatchSlug,
  namesMatch: playersMatch,
});
assert.equal(picked.slug, 'atp-sweeny-shang-2026-11-12');
assert.equal(picked.settlement.winner, 'Juncheng Shang');

const live = event(
  'atp-sweeny-shang-2026-11-12',
  ['Dane Sweeny', 'Juncheng Shang'],
  ['0.4', '0.6'],
);
assert.equal(chooseSettledEvent([live], {
  date: '2026-11-12',
  away: 'Dane Sweeny',
  home: 'Juncheng Shang',
  acceptSlug: isMainATPMatchSlug,
  namesMatch: playersMatch,
}), null);

const twin = event(
  'atp-sweeny-shang-2026-11-12-b',
  ['Dane Sweeny', 'Juncheng Shang'],
  ['1', '0'],
);
assert.equal(isMainATPMatchSlug(twin.slug), false);
const other = event(
  'atp-sweeny-shangb-2026-11-12',
  ['Dane Sweeny', 'Juncheng Shang'],
  ['1', '0'],
);
assert.equal(chooseSettledEvent([shang, other], {
  date: '2026-11-12',
  away: 'Dane Sweeny',
  home: 'Juncheng Shang',
  acceptSlug: isMainATPMatchSlug,
  namesMatch: playersMatch,
}), null);

console.log('chooseSettledEvent ok');

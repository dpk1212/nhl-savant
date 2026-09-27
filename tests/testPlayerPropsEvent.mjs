import assert from 'assert';
import {
  isPlayerPropsEvent,
  stripPlayerPropsSuffix,
  cleanStoredTeam,
} from '../scripts/lib/playerPropsEvent.js';

assert.equal(
  isPlayerPropsEvent(
    'Texas Rangers vs. Minnesota Twins - Player Props',
    'mlb-tex-min-2026-09-27-player-props',
  ),
  true,
);
assert.equal(
  isPlayerPropsEvent('Texas Rangers vs. Minnesota Twins', 'mlb-tex-min-2026-09-27'),
  false,
);
assert.equal(
  stripPlayerPropsSuffix('Minnesota Twins - Player Props'),
  'Minnesota Twins',
);
assert.equal(
  stripPlayerPropsSuffix('Texas Rangers vs. Minnesota Twins - Player Props'),
  'Texas Rangers vs. Minnesota Twins',
);
assert.equal(
  cleanStoredTeam('Minnesota Twins - Player Props', 'Minnesota Twins'),
  'Minnesota Twins',
);
assert.equal(cleanStoredTeam('Minnesota Twins', 'Minnesota Twins'), null);
console.log('testPlayerPropsEvent ok');

/**
 * Two spread tickets on the same side must not share a Firestore id.
 * Run: node tests/testPositionIdentity.mjs
 */
import assert from 'node:assert/strict';
import {
  assetTail,
  lineToken,
  positionDocId,
  positionDocIdLegacy,
  resolvePositionDocId,
} from '../scripts/lib/positionIdentity.js';
import { buildGradedPlays } from '../src/lib/mySharpsDesk.js';

const wallet = '0xe18ecc345e00ee7c4f2d1f676f3dd2acb112f826';
const base = {
  date: '2026-10-22',
  sport: 'CFB',
  gameKey: 'lib_kenn',
  wallet,
  marketType: 'SPREAD',
  side: 'home',
};

const plus105 = {
  ...base,
  entryLine: 10.5,
  asset: '11111111111111111111111111111111111111111111111111111111111111111111111111111',
};
const plus85 = {
  ...base,
  entryLine: 8.5,
  asset: '22222222222222222222222222222222222222222222222222222222222222222222222222222',
};

assert.equal(positionDocIdLegacy(plus105), positionDocIdLegacy(plus85), 'legacy id collided');
assert.notEqual(positionDocId(plus105), positionDocId(plus85), 'asset-suffixed ids split');
assert.ok(positionDocId(plus105).endsWith(assetTail(plus105.asset)));
assert.equal(lineToken(plus105), 'p10_5');
assert.equal(lineToken({ marketType: 'SPREAD', entryLine: -6.5 }), 'm6_5');

const keepLegacy = resolvePositionDocId(plus85, { asset: plus85.asset });
assert.equal(keepLegacy.id, positionDocIdLegacy(plus85));
assert.equal(keepLegacy.reusedLegacy, true);

const split = resolvePositionDocId(plus105, { asset: plus85.asset });
assert.equal(split.id, positionDocId(plus105));
assert.equal(split.reusedLegacy, false);

const emptyLegacy = resolvePositionDocId(plus105, { invested: 8200 });
assert.equal(emptyLegacy.reusedLegacy, true, 'empty asset on the old row is this ticket');

const noLegacy = resolvePositionDocId(plus105, null);
assert.equal(noLegacy.id, positionDocId(plus105));

const plays = buildGradedPlays([
  {
    walletShort: '12f826',
    sport: 'CFB',
    date: '2026-10-22',
    gameKey: 'lib_kenn',
    marketType: 'SPREAD',
    side: 'home',
    label: 'Kennesaw State',
    line: 10.5,
    invested: 27200,
    won: 0,
    settledPnl: -27200,
    away: 'Liberty',
    home: 'Kennesaw State',
  },
  {
    walletShort: '12f826',
    sport: 'CFB',
    date: '2026-10-22',
    gameKey: 'lib_kenn',
    marketType: 'SPREAD',
    side: 'home',
    label: 'Kennesaw State',
    line: 8.5,
    invested: 8200,
    won: 0,
    settledPnl: -8200,
    away: 'Liberty',
    home: 'Kennesaw State',
  },
]);
assert.equal(plays.n, 2, 'both Kennesaw numbers stay on the graded book');
assert.equal(plays.losses, 2);
assert.equal(plays.pnl, -35400);

console.log('OK — position identity splits alt-line tickets');

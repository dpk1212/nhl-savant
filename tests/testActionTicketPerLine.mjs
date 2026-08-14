/**
 * Action identity is per ticket line so +1.5 and −1.5 both persist,
 * and same-side v12 collapse keeps the fattest stake.
 * Usage: node tests/testActionTicketPerLine.mjs
 */
import assert from 'node:assert/strict';
import {
  collapseHedgedWalletsV12,
  positionToWalletDetail,
  agsV12WalletQuality,
} from '../src/lib/ags.js';
import {
  isLegacyLinelessActionDoc,
  legacyLinelessDocId,
  lineTokenForActionId,
  linelessSoftKey,
  positionDocId,
  selectVotedLine,
  shouldSupersedeLinelessActionDoc,
  softPositionKey,
  ticketLineForActionId,
} from '../src/lib/actionPositionId.js';

const WAPOL = '0xf7f0b0b1e9c0fe02ccad926916ee31aef74b912c';
const SHADOW_MIN = 0.10;
const USUAL = 425;

const base = {
  date: '2026-08-14',
  sport: 'MLB',
  gameKey: 'stl_chc',
  wallet: WAPOL,
  marketType: 'SPREAD',
  side: 'away',
};

const plus15 = { ...base, entryLine: 1.5, invested: 1022, avgSportBet: USUAL };
const minus15 = { ...base, entryLine: -1.5, invested: 276, avgSportBet: USUAL };
const plus25 = { ...base, entryLine: 2.5, invested: 9, avgSportBet: USUAL };

assert.equal(lineTokenForActionId('SPREAD', 1.5), 'p1p5');
assert.equal(lineTokenForActionId('SPREAD', -1.5), 'm1p5');
assert.equal(lineTokenForActionId('SPREAD', 2.5), 'p2p5');
assert.equal(lineTokenForActionId('TOTAL', 8.5), 'p8p5');
assert.equal(lineTokenForActionId('TOTAL', 9.5), 'p9p5');
assert.equal(lineTokenForActionId('ML', 1.5), '');
assert.equal(lineTokenForActionId('SPREAD', null), 'na');
assert.equal(ticketLineForActionId({ entryLine: 1.5, spreadLine: -1.5 }), 1.5,
  'identity uses vault entryLine, not Pinnacle spreadLine');

const oldPlus = legacyLinelessDocId(plus15);
const oldMinus = legacyLinelessDocId(minus15);
assert.equal(oldPlus, oldMinus, 'old identity collided +1.5 with −1.5');
assert.equal(oldPlus, '2026-08-14_MLB_stl_chc_f74b912c_SPREAD_away');

const idPlus = positionDocId(plus15);
const idMinus = positionDocId(minus15);
const idAlt = positionDocId(plus25);
assert.notEqual(idPlus, idMinus, 'lined identity must keep both away spreads');
assert.notEqual(idPlus, idAlt);
assert.ok(idPlus.endsWith('_p1p5'));
assert.ok(idMinus.endsWith('_m1p5'));
assert.ok(idAlt.endsWith('_p2p5'));
assert.notEqual(idPlus, oldPlus);

const lastWrite = new Map();
for (const row of [plus15, minus15]) lastWrite.set(legacyLinelessDocId(row), row);
assert.equal(lastWrite.get(oldPlus).invested, 276, 'lineless last-write was the $276 −1.5');

const persist = new Map();
for (const row of [plus15, minus15]) persist.set(positionDocId(row), row);
assert.equal(persist.size, 2);
assert.equal(persist.get(idPlus).invested, 1022);
assert.equal(persist.get(idMinus).invested, 276);

assert.ok(plus15.invested / USUAL >= SHADOW_MIN);
assert.ok(minus15.invested / USUAL >= SHADOW_MIN);
assert.ok(plus25.invested / USUAL < SHADOW_MIN, '$9 +2.5 stays below SHADOW 0.10×');

const ml = { ...base, marketType: 'ML', side: 'away', entryLine: null };
assert.equal(positionDocId(ml), '2026-08-14_MLB_stl_chc_f74b912c_ML_away');
assert.equal(softPositionKey(WAPOL, 'MLB', 'stl_chc', 'ML', 'away'), linelessSoftKey(WAPOL, 'MLB', 'stl_chc', 'ML', 'away'));

const over85 = {
  ...base, marketType: 'TOTAL', side: 'over', entryLine: 8.5,
};
const over95 = {
  ...base, marketType: 'TOTAL', side: 'over', entryLine: 9.5,
};
assert.notEqual(positionDocId(over85), positionDocId(over95));
assert.ok(positionDocId(over85).endsWith('_p8p5'));
assert.ok(positionDocId(over95).endsWith('_p9p5'));
assert.equal(legacyLinelessDocId(over85), legacyLinelessDocId(over95));

const superseded = new Set([linelessSoftKey(WAPOL, 'MLB', 'stl_chc', 'SPREAD', 'away')]);
assert.equal(isLegacyLinelessActionDoc(oldPlus, plus15), true);
assert.equal(isLegacyLinelessActionDoc(idPlus, plus15), false);
assert.equal(shouldSupersedeLinelessActionDoc(oldPlus, plus15, superseded), true);
assert.equal(shouldSupersedeLinelessActionDoc(idPlus, plus15, superseded), false);

const dustyFirst = positionToWalletDetail({
  wallet: WAPOL, walletShort: '4b912c', side: 'away',
  invested: 276, avgSportBet: USUAL, v8_sizeRatio: 0.65,
});
const actionSized = positionToWalletDetail({
  wallet: WAPOL, walletShort: '4b912c', side: 'away',
  invested: 1022, avgSportBet: USUAL, v8_sizeRatio: 2.4,
});
assert.equal(dustyFirst.invested, 276);
assert.equal(actionSized.invested, 1022);

const collapsed = collapseHedgedWalletsV12([dustyFirst, actionSized]);
assert.equal(collapsed.length, 1);
assert.equal(collapsed[0].invested, 1022, 'same-side collapse keeps $1022, not legs[0]=$276');
assert.equal(collapsed[0].sizeRatio, 2.4);

const tiedStamp = collapseHedgedWalletsV12([
  positionToWalletDetail({
    wallet: WAPOL, walletShort: '4b912c', side: 'away',
    invested: 276, avgSportBet: USUAL, v8_sizeRatio: 2.4,
  }),
  positionToWalletDetail({
    wallet: WAPOL, walletShort: '4b912c', side: 'away',
    invested: 1022, avgSportBet: USUAL, v8_sizeRatio: 2.4,
  }),
]);
assert.equal(tiedStamp[0].invested, 1022, 'sizeRatio tie → fattest invested');

const qDust = agsV12WalletQuality({
  tier: 'CONFIRMED', priorN: 131, priorRoi: 0.8, sizeRatio: 0.65,
});
const qAction = agsV12WalletQuality({
  tier: 'CONFIRMED', priorN: 131, priorRoi: 0.8, sizeRatio: 2.4,
});
assert.ok(qAction > qDust, `Action-sized quality ${qAction} must beat $276 quality ${qDust}`);

const spreadVotes = new Map([
  [1.5, { n: 1, invested: 1022 }],
  [-1.5, { n: 1, invested: 276 }],
]);
assert.equal(selectVotedLine(spreadVotes, { byInvested: false }), 1.5,
  'spread count-tie prefers the $1022 +1.5 line');
assert.equal(selectVotedLine(new Map([
  [-1.5, { n: 1, invested: 276 }],
  [1.5, { n: 1, invested: 1022 }],
]), { byInvested: false }), 1.5);

const totalVotes = new Map([
  [8.5, { n: 1, invested: 400 }],
  [9.5, { n: 2, invested: 50 }],
]);
assert.equal(selectVotedLine(totalVotes, { byInvested: true }), 8.5,
  'totals still pick most invested, not most wallets');

const hedgeAway = positionToWalletDetail({
  wallet: WAPOL, walletShort: '4b912c', side: 'away',
  invested: 1022, avgSportBet: USUAL, v8_sizeRatio: 2.4,
});
const hedgeHome = positionToWalletDetail({
  wallet: WAPOL, walletShort: '4b912c', side: 'home',
  invested: 100, avgSportBet: USUAL, v8_sizeRatio: 0.2,
});
const hedged = collapseHedgedWalletsV12([hedgeAway, hedgeHome]);
assert.equal(hedged.length, 1);
assert.equal(hedged[0].side, 'away', 'opposed hedge still drops sub-floor home dust');

console.log('testActionTicketPerLine: ok');

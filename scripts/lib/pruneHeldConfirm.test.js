import assert from 'node:assert/strict';
import test from 'node:test';
import {
  candidatesAreFresh,
  heldAssetSet,
  selectHeldCandidates,
  walletsInOrder,
} from './pruneHeldConfirm.js';

const row = (over = {}) => ({
  id: 'doc1',
  wallet: '0xABC',
  asset: 'asset-1',
  sport: 'NBA',
  marketType: 'TOTAL',
  gameKey: 'mil_orl',
  side: 'under',
  ...over,
});

test('an open size is a hold and a zero size is not', () => {
  const held = heldAssetSet([
    { asset: 'a', size: 27000 },
    { asset: 'b', size: 0 },
    { asset: '', size: 5 },
    { asset: 'c', size: 'nope' },
  ]);
  assert.equal(held.has('a'), true);
  assert.equal(held.has('b'), false);
  assert.equal(held.has('c'), false);
});

test('a held asset is kept, a missing one stays dropped, a failed fetch is not a close', () => {
  const held = new Map([
    ['0xabc', heldAssetSet([{ asset: 'asset-1', size: 10 }])],
    ['0xdef', null],
  ]);
  const out = selectHeldCandidates([
    row(),
    row({ id: 'doc2', asset: 'asset-9' }),
    row({ id: 'doc3', wallet: '0xDEF', asset: 'asset-3' }),
    row({ id: 'doc4', asset: '' }),
    row({ id: 'doc5', wallet: '0x999' }),
  ], held);
  assert.deepEqual(out.keep.map((r) => r.id), ['doc1']);
  assert.deepEqual(out.absent.map((r) => r.id), ['doc2']);
  assert.deepEqual(out.failed.map((r) => r.id), ['doc3']);
  assert.equal(out.noAsset.length, 1);
  assert.deepEqual(out.unchecked.map((r) => r.id), ['doc5']);
});

test('the wallet cap stops and a stale file is ignored', () => {
  const wallets = walletsInOrder([
    row({ wallet: '0x1' }),
    row({ wallet: '0x1' }),
    row({ wallet: '0x2' }),
    row({ wallet: '0x3' }),
  ], 2);
  assert.deepEqual(wallets, ['0x1', '0x2']);
  const now = Date.parse('2026-11-13T22:00:00Z');
  assert.equal(candidatesAreFresh({ writtenAt: '2026-11-13T21:50:00Z' }, now), true);
  assert.equal(candidatesAreFresh({ writtenAt: '2026-11-13T21:00:00Z' }, now), false);
  assert.equal(candidatesAreFresh({}, now), false);
});

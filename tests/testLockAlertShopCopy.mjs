/**
 * The Cloud Function deploys only functions/. The shop it sends must be
 * the same module the card uses.
 * Run: node tests/testLockAlertShopCopy.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hiddenSrc = readFileSync('src/lib/shopRailHidden.js', 'utf8');
const hiddenFn = readFileSync('functions/src/shop/shopRailHidden.mjs', 'utf8');
assert.equal(hiddenFn, hiddenSrc, 'shopRailHidden copy drifted');

const shopSrc = readFileSync('src/lib/t15BestLock.js', 'utf8')
  .replace("from './shopRailHidden.js'", "from './shopRailHidden.mjs'");
const shopFn = readFileSync('functions/src/shop/t15BestLock.mjs', 'utf8');
assert.equal(shopFn, shopSrc, 't15BestLock copy drifted — recopy into functions/src/shop');

console.log('testLockAlertShopCopy: all passed');

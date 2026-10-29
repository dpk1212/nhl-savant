/**
 * Which facts get the big type on an Action ticket.
 * Usage: node tests/testActionReasons.mjs
 */
import assert from 'node:assert/strict';
import { actionCardReasons } from '../src/lib/confirmedActionDesk.js';

const keys = (row) => actionCardReasons(row).heroes.map((h) => h.key);

const best = {
  topPlay: true,
  opposed: 'clear',
  opposedBy: 0,
  pinMove: 'with',
  steam: { show: true, tag: '7.0% open', tier: 'steam' },
  displaySizeRatio: 1,
  displaySizeBand: 'lean',
  displaySizeLabel: 'lean',
  l30Pnl: 6000,
  sportAction: { roi: 35 },
  form: { l10: { w: 7, l: 3 } },
};
assert.deepEqual(keys(best), ['size', 'book', 'spot']);
assert.equal(actionCardReasons(best).heroes[0].title, '1.0× lean');
assert.equal(actionCardReasons(best).heroes[0].figure, '1.0×');
assert.equal(actionCardReasons(best).heroes[0].mark, 'lean');
assert.equal(actionCardReasons(best).heroes[0].sub, 'Under their usual');
assert.equal(actionCardReasons(best).heroes[1].title, '+$6.0K');
assert.equal(actionCardReasons(best).heroes[1].window, '30d');
assert.equal(actionCardReasons(best).heroes[1].sub, '+35% ROI');
assert.equal(actionCardReasons(best).heroes[2].title, 'Top play');
assert.equal(actionCardReasons(best).heroes[2].sub, 'Unopposed');
assert.deepEqual(actionCardReasons(best).support, ['Line with · Steam 7.0% open', 'L10 7-3']);
assert.equal(actionCardReasons(best).support.some((s) => /steam/i.test(s) && s.startsWith('Line')), true);

const pressFight = {
  topPlay: false,
  opposed: 'contested',
  opposedBy: 2,
  displaySizeRatio: 8.6,
  displaySizeBand: 'press',
  displaySizeLabel: 'press',
  l30Pnl: 4600,
  sportAction: { roi: 41 },
  form: { l10: { w: 2, l: 0 } },
};
assert.deepEqual(keys(pressFight), ['size', 'book', 'spot']);
assert.equal(actionCardReasons(pressFight).heroes[0].sub, 'Bigger than their usual');
assert.equal(actionCardReasons(pressFight).heroes[0].tone, 'gold');
assert.equal(actionCardReasons(pressFight).heroes[2].title, 'Contested · 2');
assert.ok(actionCardReasons(pressFight).support.includes('L10 2-0'));
assert.equal(actionCardReasons(pressFight).support.some((s) => s.startsWith('Line')), false);

const light = {
  opposed: 'contested',
  opposedBy: 1,
  displaySizeRatio: 0.2,
  displaySizeBand: 'light',
  displaySizeLabel: 'light',
  l30Pnl: -1200,
  form: { l10: { w: 8, l: 2 } },
  trust: { roi: 12 },
};
assert.equal(actionCardReasons(light).heroes[0].sub, 'Smaller than their usual');
assert.equal(actionCardReasons(light).heroes[1].title, '-$1.2K');
assert.equal(actionCardReasons(light).heroes[1].tone, 'red');
assert.equal(actionCardReasons(light).heroes[1].window, '30d');
assert.equal(actionCardReasons(light).heroes[1].sub, 'Book +12% ROI');
assert.equal(actionCardReasons(light).heroes[1].subTone, 'green');

const noBook = {
  opposed: 'clear',
  displaySizeRatio: 1.1,
  displaySizeBand: 'full',
  displaySizeLabel: 'usual',
  trust: { roi: 18 },
};
assert.deepEqual(keys(noBook), ['size', 'book', 'spot']);
assert.equal(actionCardReasons(noBook).heroes[1].title, '+18% ROI');
assert.equal(actionCardReasons(noBook).heroes[1].sub, 'Sport book');

console.log('testActionReasons: ok');

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
  displaySizeBand: 'full',
  displaySizeLabel: 'usual',
  form: { l10: { w: 7, l: 3 } },
};
assert.deepEqual(keys(best), ['top', 'field', 'line'], 'a full best ticket keeps top, field, and the line');
assert.equal(actionCardReasons(best).heroes[0].sub, 'Market specialist');
assert.equal(actionCardReasons(best).heroes[1].title, 'Unopposed');
assert.equal(actionCardReasons(best).heroes[2].sub, 'Steam 7.0% open');
assert.deepEqual(actionCardReasons(best).support, ['1.0× usual', 'L10 7-3']);

const pressFight = {
  topPlay: false,
  opposed: 'contested',
  opposedBy: 2,
  displaySizeRatio: 8.6,
  displaySizeBand: 'press',
  displaySizeLabel: 'press',
  form: { l10: { w: 2, l: 0 } },
};
assert.deepEqual(keys(pressFight), ['field', 'size'], 'a short hot streak does not take a seat from the press');
assert.equal(actionCardReasons(pressFight).heroes[0].title, 'Contested · 2');
assert.equal(actionCardReasons(pressFight).heroes[1].sub, 'Bigger than their usual');
assert.deepEqual(actionCardReasons(pressFight).support, ['L10 2-0']);

const lightHot = {
  opposed: 'contested',
  opposedBy: 1,
  displaySizeRatio: 0.2,
  displaySizeBand: 'light',
  displaySizeLabel: 'light',
  form: { l10: { w: 8, l: 2 } },
};
assert.deepEqual(keys(lightHot), ['field', 'size', 'form']);
assert.equal(actionCardReasons(lightHot).heroes[2].sub, '8 of their last 10');

const crowded = {
  topPlay: true,
  opposed: 'clear',
  pinMove: 'with',
  steam: { show: true, tag: '4.0% 1h' },
  displaySizeRatio: 2.2,
  displaySizeBand: 'press',
  displaySizeLabel: 'press',
  form: { l10: { w: 8, l: 2 } },
};
assert.deepEqual(keys(crowded), ['top', 'field', 'line'], 'form drops before the line when four reasons compete');
assert.ok(actionCardReasons(crowded).support.includes('2.2× press'));
assert.ok(actionCardReasons(crowded).support.includes('L10 8-2'));

const cold = {
  opposed: 'clear',
  displaySizeRatio: 1,
  displaySizeBand: 'full',
  displaySizeLabel: 'usual',
  form: { l10: { w: 2, l: 8 } },
};
assert.equal(actionCardReasons(cold).heroes.find((h) => h.key === 'form').sub, 'Only 2 of their last 10');

console.log('testActionReasons: ok');

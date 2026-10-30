/**
 * The line under the locked scoreboard names people.
 * It does not restate the dollars already printed on the bar.
 */
import { buildBoardFaceLine } from '../src/components/sharpFlow/cards/boardFaceLine.js';

const lead = {
  short: '1895dc',
  proven: true,
  invested: 760,
  trust: {
    secondary: ['14-8', '64% WR'],
    banger: { label: 'L30 +$5.6K', tone: 'hot' },
  },
};

const both = buildBoardFaceLine({
  sport: 'NBA',
  units: 2,
  confirmedOnSide: 1,
  against: { proven: 1, invested: 405 },
  sharpUsd: 760,
}, lead);

if (!both.startsWith('Proven on both sides.')) throw new Error(both);
if (!both.includes('…1895dc leads ours, 14-8, 64% WR, L30 +$5.6K.')) throw new Error(both);
if (both.includes('$760') || both.includes('$405')) throw new Error(`restated the bar: ${both}`);
if (/took the other side/i.test(both)) throw new Error(both);

const oursOnly = buildBoardFaceLine({
  units: 2,
  confirmedOnSide: 1,
  against: { proven: 0, invested: 0 },
  sharpUsd: 760,
}, lead);
if (oursOnly.includes('Proven on both sides')) throw new Error(oursOnly);
if (!oursOnly.includes('…1895dc leads, 14-8, 64% WR, L30 +$5.6K.')) throw new Error(oursOnly);
if (oursOnly.includes('$760')) throw new Error(oursOnly);

const muted = buildBoardFaceLine({
  units: 0,
  tapeAction: 'mute',
  confirmedOnSide: 0,
  against: { proven: 0 },
}, null);
if (muted !== 'The system stood this one down.') throw new Error(muted);

console.log('board face line ok');

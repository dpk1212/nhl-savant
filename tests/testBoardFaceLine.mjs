/**
 * The line under the locked scoreboard follows the picture.
 * It does not restate the dollars on the bar, and it does not lead with a wallet hash.
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

function assertFace(face, { headline, proof, wallet }) {
  if (!face || typeof face === 'string') throw new Error(JSON.stringify(face));
  if (face.headline !== headline) throw new Error(`headline ${face.headline}`);
  if (face.proof !== proof) throw new Error(`proof ${face.proof}`);
  if (face.wallet !== wallet) throw new Error(`wallet ${face.wallet}`);
  const blob = `${face.headline || ''} ${face.proof || ''}`;
  if (blob.includes('64% WR')) throw new Error(`win rate leaked: ${blob}`);
  if (/\$760|\$405|\$3\.4K|\$33K|\$3400|\$33000/.test(blob)) throw new Error(`restated the bar: ${blob}`);
}

const both = buildBoardFaceLine({
  sport: 'NBA',
  units: 2,
  confirmedOnSide: 1,
  against: { proven: 1, invested: 405, abbr: 'Celtics' },
  sharpUsd: 760,
}, lead);
assertFace(both, {
  headline: 'Proven on both sides.',
  proof: '14-8, L30 +$5.6K',
  wallet: '…1895dc',
});

const oursOnly = buildBoardFaceLine({
  units: 2,
  confirmedOnSide: 1,
  against: { proven: 0, invested: 0 },
  sharpUsd: 760,
}, lead);
assertFace(oursOnly, {
  headline: null,
  proof: '14-8, L30 +$5.6K',
  wallet: '…1895dc',
});

const buried = buildBoardFaceLine({
  units: 1,
  side: 'away',
  away: 'Los Angeles Lakers',
  home: 'Golden State Warriors',
  confirmedOnSide: 1,
  against: { proven: 0, invested: 33000, abbr: 'Warriors' },
  sharpUsd: 3400,
}, lead);
assertFace(buried, {
  headline: 'Most of the tracked money is on the Warriors.',
  proof: '14-8, L30 +$5.6K',
  wallet: '…1895dc',
});
if (/proven on both/i.test(buried.headline)) throw new Error(buried.headline);

const buriedProven = buildBoardFaceLine({
  units: 1,
  confirmedOnSide: 1,
  against: { proven: 2, invested: 20000, abbr: 'Celtics' },
  sharpUsd: 4000,
}, lead);
if (buriedProven.headline !== 'Most of the tracked money is on the Celtics.') {
  throw new Error(buriedProven.headline);
}

const muted = buildBoardFaceLine({
  units: 0,
  tapeAction: 'mute',
  confirmedOnSide: 0,
  against: { proven: 0 },
}, null);
if (muted !== 'The system stood this one down.') throw new Error(muted);

console.log('board face line ok');

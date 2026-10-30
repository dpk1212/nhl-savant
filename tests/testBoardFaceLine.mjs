/**
 * The line under the confirmed poster follows that picture.
 * It does not restate the dollars on the poster, and it does not lead with a wallet hash.
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
  if (/\$760|\$405|\$2K|\$2\.0K|\$33K|\$2000|\$33000/.test(blob)) throw new Error(`restated the poster: ${blob}`);
}

const both = buildBoardFaceLine({
  sport: 'NBA',
  units: 2,
  side: 'away',
  away: 'Chicago Bulls',
  home: 'Boston Celtics',
  against: { abbr: 'Celtics' },
  boardMoneyConfirmed: { ours: 760, theirs: 405 },
}, lead);
assertFace(both, {
  headline: 'Confirmed on both sides.',
  proof: '14-8, L30 +$5.6K',
  wallet: '…1895dc',
});

const sweep = buildBoardFaceLine({
  units: 1,
  side: 'away',
  away: 'Los Angeles Lakers',
  home: 'Golden State Warriors',
  against: { abbr: 'Warriors', invested: 33000 },
  sharpUsd: 3400,
  boardMoneyConfirmed: { ours: 2000, theirs: 0 },
}, lead);
assertFace(sweep, {
  headline: 'Confirmed winners are on the Lakers.',
  proof: '14-8, L30 +$5.6K',
  wallet: '…1895dc',
});
if (/warriors/i.test(sweep.headline) && /tracked/i.test(sweep.headline)) throw new Error(sweep.headline);

const buriedConfirmed = buildBoardFaceLine({
  units: 1,
  side: 'away',
  away: 'Chicago Bulls',
  home: 'Boston Celtics',
  against: { abbr: 'Celtics' },
  boardMoneyConfirmed: { ours: 4000, theirs: 20000 },
}, lead);
if (buriedConfirmed.headline !== 'Most of the confirmed money is on the Celtics.') {
  throw new Error(buriedConfirmed.headline);
}

const oursHeavy = buildBoardFaceLine({
  units: 2,
  side: 'home',
  away: 'Carolina Panthers',
  home: 'Jacksonville Jaguars',
  against: { abbr: 'Panthers' },
  boardMoneyConfirmed: { ours: 9800, theirs: 2400 },
}, lead);
if (oursHeavy.headline !== 'Most of the confirmed money is on the Jaguars.') {
  throw new Error(oursHeavy.headline);
}

const muted = buildBoardFaceLine({
  units: 0,
  tapeAction: 'mute',
  boardMoneyConfirmed: { ours: 0, theirs: 0 },
}, null);
if (muted !== 'The system stood this one down.') throw new Error(muted);

console.log('board face line ok');

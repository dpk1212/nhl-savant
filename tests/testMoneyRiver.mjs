/**
 * The river tells the wallet battle with numbers the card already has.
 * A pooled win rate appears only when every sharp on our side has a record.
 */
import { buildMoneyRiver } from '../src/components/sharpFlow/cards/moneyRiver.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const buried = buildMoneyRiver({
  sport: 'NBA',
  side: 'away',
  away: 'Los Angeles Lakers',
  home: 'Golden State Warriors',
  pickLabel: 'Lakers ML',
  units: 1,
  confirmedOnSide: 1,
  sharpUsd: 3400,
  against: { abbr: 'Warriors', proven: 0, invested: 33000 },
  wallets: [{
    short: '1895dc',
    proven: true,
    whitelisted: true,
    whitelist: 'CONFIRMED',
    invested: 3400,
    sizeRatio: 1.6,
    trustScore: 5600,
    trust: {
      record: '14-8',
      banger: { label: 'L30 +$5.6K' },
      secondary: ['14-8', '64% WR'],
    },
  }],
  mapWallets: [
    { short: '1895dc', side: 'ours', invested: 3400, proven: true, whitelisted: true, whitelist: 'CONFIRMED' },
    { short: 'war99', side: 'against', invested: 33000, proven: false, whitelist: 'WR50' },
  ],
  boardMoneyFull: { ours: 3400, theirs: 33000 },
  boardMoneyLosers: { ours: 0, theirs: 33000 },
  boardMoneyConfirmed: { ours: 3400, theirs: 0 },
});

assert(buried.panel.hero === '100%', buried.panel.hero);
assert(buried.panel.caption === 'of sharp money', buried.panel.caption);
assert(buried.panel.support == null, 'one wallet is not a pooled record');
assert(buried.ourPill.lines[0].text === '$3.4K', buried.ourPill.lines[0].text);
assert(buried.ourPill.lines.some((l) => l.text === '100% of sharp $'), 'sharp share');
assert(buried.theirPill.tone === 'fade', buried.theirPill.tone);
assert(buried.theirPill.lines[0].text === '$33K', buried.theirPill.lines[0].text);
assert(buried.fade.text === '1 loser on Warriors', buried.fade.text);
assert(buried.lead.proof === '14-8 · L30 +$5.6K', buried.lead.proof);
assert(buried.allMoney.text === 'Warriors 91%', buried.allMoney.text);
assert(!JSON.stringify(buried).includes('14.2'), 'no example roi');

const split = buildMoneyRiver({
  sport: 'NFL',
  side: 'home',
  home: 'Jacksonville Jaguars',
  away: 'Carolina Panthers',
  pickLabel: 'Jaguars ML',
  units: 2,
  against: { abbr: 'CAR', proven: 1, invested: 5600 },
  wallets: [],
  mapWallets: [
    { short: 'a91f2c', side: 'ours', invested: 6200, sizeRatio: 1.8, whitelist: 'CONFIRMED', whitelisted: true, proven: true, record: '14-7' },
    { short: 'b3e811', side: 'ours', invested: 3600, sizeRatio: 1.2, whitelist: 'CONFIRMED', whitelisted: true, proven: true, record: '9-6' },
    { short: 'c9vs01', side: 'against', invested: 2400, sizeRatio: 1.1, whitelist: 'CONFIRMED', whitelisted: true, proven: true, record: '8-5' },
    { short: 'lose01', side: 'against', invested: 3200, whitelist: 'WR50', record: '6-11' },
    { short: 'lose02', side: 'ours', invested: 900, whitelist: 'WR50', record: '4-9' },
  ],
  boardMoneyLosers: { ours: 900, theirs: 3200 },
  boardMoneyFull: { ours: 11600, theirs: 9800 },
});

assert(split.panel.hero === '63.9%', split.panel.hero);
assert(split.panel.caption === 'win', split.panel.caption);
assert(split.panel.support === '23\u201313', split.panel.support);
assert(split.panel.sub.includes('1 sized up'), split.panel.sub);
assert(split.rows.some((r) => r.kind === 'hc' && r.short === 'a91f2c'), 'sized-up row');
assert(split.rows.some((r) => r.kind === 'opp'), 'opposing sharp');
assert(split.rows.some((r) => r.kind === 'loser' && r.side === 'ours'), 'loser on our side');
assert(split.ourPill.lines.some((l) => l.text === '80% of sharp $'), JSON.stringify(split.ourPill.lines));
assert(split.ourPill.lines[0].text === '$9.8K', split.ourPill.lines[0].text);
assert(split.fade.text === '1 loser on CAR', split.fade.text);
assert(split.allMoney.text === 'Jaguars 54%', split.allMoney.text);

const incomplete = buildMoneyRiver({
  units: 2,
  pickLabel: 'Lakers ML',
  side: 'away',
  away: 'Lakers',
  home: 'Warriors',
  mapWallets: [
    { short: 'aaaaaa', side: 'ours', invested: 1000, whitelist: 'CONFIRMED', proven: true, record: '10-4' },
    { short: 'bbbbbb', side: 'ours', invested: 800, whitelist: 'CONFIRMED', proven: true },
  ],
});
assert(incomplete.panel.caption === 'of sharp money', 'missing record blocks the pool');
assert(incomplete.panel.support == null, incomplete.panel.support);

console.log('money river ok');

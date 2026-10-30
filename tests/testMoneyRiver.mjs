/**
 * The river tells the wallet battle with numbers the card already has.
 * A pooled win rate appears only when every sharp on our side has a record.
 */
import { buildMoneyRiver, fmtSignedUsd } from '../src/components/sharpFlow/cards/moneyRiver.js';

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

assert(buried.panel.eyebrow === 'Combined Proven Sharps', buried.panel.eyebrow);
assert(buried.panel.stats.map((s) => s.label).join('|') === 'Win|Record', JSON.stringify(buried.panel.stats));
assert(buried.panel.stats[0].value === '63.6%', buried.panel.stats[0].value);
assert(buried.panel.stats.some((s) => s.label === 'Record' && s.value === '14\u20138'), JSON.stringify(buried.panel.stats));
assert(!buried.panel.stats.some((s) => /sharp/i.test(s.label)), 'sharp money stays on the river');
assert(buried.ourPill.lines[0].text === '$3.4K', buried.ourPill.lines[0].text);
assert(buried.ourPill.lines.some((l) => l.text === '100%' && l.caption === 'of sharp money'), 'sharp share');
assert(!buried.panel.stats.some((s) => s.label === 'ROI'), 'no roi on the wallet, no roi stat');
assert(buried.theirPill.tone === 'fade', buried.theirPill.tone);
assert(buried.theirPill.lines[0].text === '$33K', buried.theirPill.lines[0].text);
assert(buried.rows.every((r) => r.thick > 0 && Number.isFinite(r.targetY)), 'ribbon geometry');
assert(buried.panel.dots == null, 'a record with no tape draws no dots');
const buriedSharp = buried.rows.find((r) => r.short === '1895dc');
const buriedFade = buried.rows.find((r) => r.side === 'against');
assert(buriedFade.thick > buriedSharp.thick * 2, 'stake sets the width');
assert(Math.abs(buriedSharp.y - buriedSharp.targetY) < 0.5, 'one wallet meets its pile');
assert(Math.abs(buriedFade.y - buriedFade.targetY) < 0.5, 'the fade meets its pile');
assert(!JSON.stringify(buried).includes('14.2'), 'no example roi');
assert(!('fade' in buried) && !('lead' in buried), 'lead and fade are gone');

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

assert(split.panel.eyebrow === 'Combined Proven Sharps', split.panel.eyebrow);
assert(split.panel.stats[0].label === 'Win', split.panel.stats[0].label);
assert(split.panel.stats[0].value === '63.9%', split.panel.stats[0].value);
assert(split.panel.stats.some((s) => s.value === '23\u201313'), JSON.stringify(split.panel.stats));
assert(!split.panel.stats.some((s) => /sharp|sized/i.test(s.label)), JSON.stringify(split.panel.stats));
assert(split.rows.some((r) => r.kind === 'hc' && r.short === 'a91f2c'), 'sized-up row');
assert(split.rows.some((r) => r.kind === 'opp'), 'opposing sharp');
assert(split.rows.some((r) => r.kind === 'loser' && r.side === 'ours'), 'loser on our side');
assert(split.ourPill.lines.some((l) => l.text === '80%' && l.caption === 'of sharp money'), JSON.stringify(split.ourPill.lines));
assert(!split.panel.stats.some((s) => /roi/i.test(s.label)), 'records without roi are not blended');
assert(split.ourPill.lines[0].text === '$9.8K', split.ourPill.lines[0].text);
const oursFlow = split.rows.filter((r) => r.side !== 'against');
for (let i = 1; i < oursFlow.length; i += 1) {
  assert(oursFlow[i].targetY > oursFlow[i - 1].targetY, 'ribbons stack');
}
assert(split.panel.dots == null, 'no tape, no dots');
const ordered = split.rows.slice().sort((a, b) => a.y - b.y);
for (let i = 1; i < ordered.length; i += 1) {
  assert(ordered[i].y - ordered[i - 1].y >= 31, 'rows stay apart');
}
assert(split.ourBox.top + split.ourBox.height <= split.theirBox.top, 'piles stay apart');

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
assert(incomplete.panel == null, 'a missing record blocks the combined strip');

const rated = buildMoneyRiver({
  pickLabel: 'Lakers ML',
  side: 'away',
  away: 'Lakers',
  home: 'Warriors',
  mapWallets: [
    { short: 'aaaaaa', side: 'ours', invested: 2000, whitelist: 'CONFIRMED', proven: true, record: '10-4', roi: 20 },
    { short: 'bbbbbb', side: 'ours', invested: 1000, whitelist: 'CONFIRMED', proven: true, record: '8-6', roi: 10 },
  ],
});
assert(!rated.panel.stats.some((s) => /roi/i.test(s.label)), 'all-time roi is not labeled L30');
assert(rated.rows.find((r) => r.short === 'aaaaaa').roi === 20, 'row keeps its all-time roi');
assert(!rated.panel.stats.some((s) => s.label === 'Profit'), 'roi without book profit stays off the strip');

const partialRoi = buildMoneyRiver({
  pickLabel: 'Lakers ML',
  side: 'away',
  away: 'Lakers',
  home: 'Warriors',
  mapWallets: [
    { short: 'aaaaaa', side: 'ours', invested: 2000, whitelist: 'CONFIRMED', proven: true, record: '10-4', roi: 20 },
    { short: 'bbbbbb', side: 'ours', invested: 1000, whitelist: 'CONFIRMED', proven: true, record: '8-6' },
  ],
});
assert(!partialRoi.panel.stats.some((s) => /roi/i.test(s.label)), 'a missing roi blocks the blend');

const tape = buildMoneyRiver({
  pickLabel: 'Lakers ML',
  side: 'away',
  away: 'Lakers',
  home: 'Warriors',
  mapWallets: [
    {
      short: 'aaaaaa', side: 'ours', invested: 2000, whitelist: 'CONFIRMED', proven: true,
      record: '10-4', roi: 20, l30Roi: 20, bookPnl: 4000,
      recent: [
        { date: '2026-10-01', won: 1 },
        { date: '2026-10-03', won: 0 },
      ],
    },
    {
      short: 'bbbbbb', side: 'ours', invested: 1000, whitelist: 'CONFIRMED', proven: true,
      record: '8-6', roi: 10, l30Roi: 10, bookPnl: -800,
      recent: [
        { date: '2026-10-02', won: 0 },
        { date: '2026-10-04', won: 1 },
      ],
    },
  ],
});
assert(JSON.stringify(tape.panel.dots) === JSON.stringify(['win', 'loss', 'loss', 'win']), JSON.stringify(tape.panel.dots));
assert(tape.panel.eyebrow === 'Combined Proven Sharps', tape.panel.eyebrow);
assert(tape.panel.dotLabel === 'Last 4', tape.panel.dotLabel);
assert(
  tape.panel.stats.map((s) => s.label).join('|') === 'Win|L30 ROI|Profit|Record',
  tape.panel.stats.map((s) => s.label).join('|'),
);
assert(tape.panel.stats.find((s) => s.label === 'L30 ROI').value === '+16.7%', tape.panel.stats.find((s) => s.label === 'L30 ROI').value);
assert(tape.rows.find((r) => r.short === 'aaaaaa').meta === '10\u20134 \u00b7 +20% \u00b7 +$4K', tape.rows.find((r) => r.short === 'aaaaaa').meta);
assert(tape.rows.find((r) => r.short === 'bbbbbb').meta === '8\u20136 \u00b7 +10% \u00b7 -$800', tape.rows.find((r) => r.short === 'bbbbbb').meta);
assert(tape.panel.stats.find((s) => s.label === 'Profit').value === '+$3.2K', tape.panel.stats.find((s) => s.label === 'Profit').value);
assert(!tape.panel.stats.some((s) => /sharp/i.test(s.label)));

const oneMissingPnl = buildMoneyRiver({
  pickLabel: 'Lakers ML',
  side: 'away',
  away: 'Lakers',
  home: 'Warriors',
  mapWallets: [
    { short: 'aaaaaa', side: 'ours', invested: 2000, whitelist: 'CONFIRMED', proven: true, record: '10-4', roi: 20, bookPnl: 4000 },
    { short: 'bbbbbb', side: 'ours', invested: 1000, whitelist: 'CONFIRMED', proven: true, record: '8-6', roi: 10 },
  ],
});
assert(!oneMissingPnl.panel.stats.some((s) => s.label === 'Profit'), 'one missing profit blocks the sum');

const oneBook = buildMoneyRiver({
  pickLabel: 'Bulls +15.5',
  side: 'away',
  away: 'Bulls',
  home: 'Celtics',
  mapWallets: [{
    short: 'bulls1', side: 'ours', invested: 760, whitelist: 'CONFIRMED', proven: true,
    wins: 10, losses: 4, bookPnl: 1600, l30Roi: 44, roi: 12,
    trust: { secondary: ['14-8'], record: '14-8' },
    record: '14-8',
  }],
});
assert(oneBook.panel.stats.map((s) => `${s.label}:${s.value}`).join('|') === 'Win:71.4%|L30 ROI:+44%|Profit:+$1.6K|Record:10\u20134', oneBook.panel.stats.map((s) => s.value).join('|'));
assert(oneBook.rows[0].meta === '10\u20134 \u00b7 +44% \u00b7 +$1.6K', oneBook.rows[0].meta);

assert(fmtSignedUsd(1006000) === '+$1.01M', fmtSignedUsd(1006000));
assert(fmtSignedUsd(1000000) === '+$1M', fmtSignedUsd(1000000));
assert(fmtSignedUsd(2500000) === '+$2.5M', fmtSignedUsd(2500000));
assert(fmtSignedUsd(-1200000) === '-$1.2M', fmtSignedUsd(-1200000));
assert(fmtSignedUsd(999600) === '+$1M', fmtSignedUsd(999600));
assert(fmtSignedUsd(940) === '+$940', fmtSignedUsd(940));
assert(fmtSignedUsd(25900) === '+$25.9K', fmtSignedUsd(25900));

console.log('money river ok');

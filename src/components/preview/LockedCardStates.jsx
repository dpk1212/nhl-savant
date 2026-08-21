/**
 * LockedCardStates — production LockedPositionCardView fixtures.
 * Open at #/locked-card-states.
 */
import { LockedPositionCardView } from '../sharpFlow/cards/PositionCards';

const now = Date.now();
const H = 36e5;
const t0 = now - 8 * H;

const pinPath = (open, mid, close, max = 1900) => ([
  { t: t0 / 1000, odds: open, max: Math.round(max * 0.55) },
  { t: (t0 + 2.5 * H) / 1000, odds: mid, max: Math.round(max * 0.7) },
  { t: (t0 + 5 * H) / 1000, odds: close, max },
  { t: (t0 + 7 * H) / 1000, odds: close - 2, max },
]);

const leadTrust = {
  short: 'eeabaf',
  proven: true,
  whitelisted: true,
  whitelist: 'CONFIRMED',
  invested: 5400,
  sizeRatio: 1.6,
  displaySizeRatio: 1.6,
  sport: 'NFL',
  trustScore: 4600,
  trust: {
    record: '8-3',
    banger: { label: '+60% ROI', tone: 'hot', kind: 'roi', score: 2060 },
    secondary: ['8-3', '73% WR'],
    bookKind: 'positions',
  },
  trustBook: {
    record: '8-3', wr: 73, roi: 60, dollarRoi: 48, kind: 'positions', n: 11,
  },
};

/** Both-side board for battle bars (FULL / LOSERS / CONFIRMED+HC). */
const showcaseBoard = [
  { ...leadTrust, side: 'ours' },
  {
    short: 'flat01', side: 'ours', proven: true, whitelisted: true, whitelist: 'FLAT',
    invested: 2100, sizeRatio: 0.9, displaySizeRatio: 0.9,
  },
  {
    short: 'lose9a', side: 'against', proven: false, whitelisted: false, whitelist: 'WR50',
    invested: 1800, sizeRatio: 0.4, displaySizeRatio: 0.4,
  },
];

const contestedBoard = [
  {
    ...leadTrust, short: 'a91f2c', side: 'ours', invested: 6200,
    sizeRatio: 1.8, displaySizeRatio: 1.8, whitelist: 'CONFIRMED', whitelisted: true, proven: true,
  },
  {
    short: 'b3e811', side: 'ours', proven: true, whitelisted: true, whitelist: 'CONFIRMED',
    invested: 3600, sizeRatio: 1.2, displaySizeRatio: 1.2,
  },
  {
    short: 'flat22', side: 'ours', proven: true, whitelisted: true, whitelist: 'FLAT',
    invested: 1800, sizeRatio: 0.7, displaySizeRatio: 0.7,
  },
  {
    short: 'c9vs01', side: 'against', proven: true, whitelisted: true, whitelist: 'CONFIRMED',
    invested: 2400, sizeRatio: 1.1, displaySizeRatio: 1.1,
  },
  {
    short: 'lose01', side: 'against', proven: false, whitelisted: false, whitelist: 'WR50',
    invested: 3200, sizeRatio: 0.5, displaySizeRatio: 0.5,
  },
  {
    short: 'lose02', side: 'ours', proven: false, whitelisted: false, whitelist: 'WR50',
    invested: 900, sizeRatio: 0.3, displaySizeRatio: 0.3,
  },
];

const base = {
  sport: 'NFL',
  away: 'New York Jets',
  home: 'Pittsburgh Steelers',
  gameTime: '7:00 PM',
  pickLabel: 'Over 37.5',
  lockOdds: 100,
  gotOdds: -122,
  heroOdds: 100,
  mainNowLabel: 'flagged at Over 36.5 · -122',
  ticketOffMain: true,
  instrumentVariant: 'ALT',
  peakOdds: -118,
  nowOdds: -120,
  fairLine: -109,
  sharpEntryOdds: -108,
  currentFairOdds: -120,
  bestOdds: -102,
  liveBestOdds: -102,
  clvPct: 1.4,
  units: 5.4,
  toWin: 4.43,
  pathBaseUnits: 1.5,
  unitsPreTape: 1.5,
  tapeAction: 'boost',
  stakePath: 'TOP',
  confirmedOnSide: 1,
  sharpUsd: 7500,
  sideInvested: 7500,
  moneyPct: 81,
  against: { abbr: 'Under', proven: 0, invested: 0 },
  wallets: [leadTrust],
  mapWallets: showcaseBoard,
  pinnMax: 2100,
  pinnMovePp: 2.6,
  steam: { show: true, tag: '4.8% open', tagShort: '4.8%', tier: 'gold' },
  pinPath: pinPath(-104, -118, -120, 2100),
  evFlagged: -2.8,
  edge: 14,
};

const FIXTURES = [
  {
    title: 'Showcase — unopposed + killer lead',
    f: { ...base, commenceMs: now + 12 * H },
  },
  {
    title: 'Contested — big ticket needs wallet context',
    f: {
      ...base,
      sport: 'NFL',
      away: 'Carolina Panthers',
      home: 'Jacksonville Jaguars',
      gameTime: '7:30 PM',
      pickLabel: 'Jaguars ML',
      lockOdds: 108,
      gotOdds: 117,
      heroOdds: 108,
      mainNowLabel: null,
      ticketOffMain: false,
      instrumentVariant: 'MAIN',
      units: 5.4,
      toWin: 5.83,
      sharpUsd: 11600,
      sideInvested: 11600,
      moneyPct: 78,
      confirmedOnSide: 2,
      against: { abbr: 'CAR', proven: 1, invested: 5600, avgRoi: -4 },
      wallets: [
        {
          ...leadTrust,
          short: 'a91f2c',
          invested: 6200,
          sizeRatio: 1.8,
          displaySizeRatio: 1.8,
          whitelist: 'CONFIRMED',
          whitelisted: true,
          trust: {
            record: '14-7',
            banger: { label: 'L30 +$18K', tone: 'hot', kind: 'l30pnl', score: 5180 },
            secondary: ['14-7', '67% WR'],
            bookKind: 'positions',
          },
          trustScore: 5700,
        },
        { short: 'b3e811', proven: true, whitelisted: true, whitelist: 'CONFIRMED',
          invested: 3600, sizeRatio: 1.2, displaySizeRatio: 1.2, trustScore: 2100,
          trust: { record: '9-6', banger: { label: '+22% ROI', tone: 'good', kind: 'roi', score: 2022 }, secondary: ['9-6'] } },
      ],
      mapWallets: contestedBoard,
      fairLine: -135,
      sharpEntryOdds: -135,
      currentFairOdds: -140,
      bestOdds: -130,
      liveBestOdds: -130,
      gotOdds: 117,
      lockOdds: 108,
      evFlagged: 1.2,
      pinnMovePp: -9.4,
      steam: { show: false },
      pinPath: pinPath(-125, -135, -140, 1800),
      commenceMs: now + 12.5 * H,
    },
  },
  {
    title: 'MLB — Source B lead',
    f: {
      ...base,
      sport: 'MLB',
      away: 'Atlanta Braves',
      home: 'Milwaukee Brewers',
      gameTime: '4:11 PM',
      pickLabel: 'Brewers ML',
      lockOdds: -126,
      gotOdds: -126,
      heroOdds: -126,
      mainNowLabel: null,
      ticketOffMain: false,
      units: 4.0,
      toWin: 3.17,
      tapeAction: 'hold',
      pathBaseUnits: 4.0,
      unitsPreTape: 4.0,
      wallets: [{
        ...leadTrust,
        sport: 'MLB',
        trust: {
          record: '22-14',
          banger: { label: '+41% $ ROI', tone: 'hot', kind: 'dollarRoi', score: 3041 },
          secondary: ['22-14', '61% WR'],
          bookKind: 'positions',
        },
      }],
      commenceMs: now + 9 * H,
      pinPath: pinPath(-118, -124, -120, 1900),
      sharpEntryOdds: -118,
      currentFairOdds: -120,
      fairLine: -119,
      bestOdds: -115,
      liveBestOdds: -115,
      evFlagged: 0.4,
      pinnMovePp: 1.1,
    },
  },
  {
    title: 'Tracked — muted',
    f: {
      ...base,
      pickLabel: 'Mariners ML',
      sport: 'MLB',
      units: 0,
      toWin: 0,
      mutedBy: 'tape-weak',
      tapeAction: 'mute',
      unitsPreTape: 1.5,
      stakePath: 'MONITORING',
      wallets: [],
      confirmedOnSide: 0,
      sharpUsd: 0,
      commenceMs: now + 5 * H,
      pinPath: null,
    },
  },
];

export default function LockedCardStates() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0F1F', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ color: '#9aa6bd', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', marginBottom: 18 }}>
          LOCKED CARD — ZONE A / PRICE DESK / BATTLE BARS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 18 }}>
          {FIXTURES.map(({ title, f }) => (
            <div key={title}>
              <div style={{ color: '#647089', fontSize: '0.62rem', fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>
                {title}
              </div>
              <LockedPositionCardView f={f} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

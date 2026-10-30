/**
 * LockedCardStates — production LockedPositionCardView fixtures.
 * Open at #/locked-card-states.
 */
import { useState } from 'react';
import { LockedPositionCardView } from '../sharpFlow/cards/PositionCards';
import { normalizeWalletShort } from '../../lib/mySharps.js';

const tape = (day, marks) => marks.split('').map((mark, i) => ({
  date: `2026-10-${String(day + i).padStart(2, '0')}`,
  won: mark === 'W' ? 1 : 0,
}));

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
  hardMarket: true,
  priorClvPct: 61,
  roi: 26,
  wr: 73,
  record: '11-4',
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
  bookPnl: 8400,
  recent: tape(8, 'WLWWLWWW'),
};

/** Both-side board for battle bars (FULL / LOSERS / CONFIRMED+HC). */
const showcaseBoard = [
  { ...leadTrust, side: 'ours' },
  {
    short: 'flat01', side: 'ours', proven: true, whitelisted: true, whitelist: 'FLAT',
    invested: 2100, sizeRatio: 0.9, displaySizeRatio: 0.9,
    record: '8-7', wr: 53, roi: 4, priorClvPct: 51,
    bookPnl: 1100,
    recent: tape(9, 'LWLWWLW'),
  },
  {
    short: 'lose9a', side: 'against', proven: false, whitelisted: false, whitelist: 'WR50',
    invested: 1800, sizeRatio: 0.4, displaySizeRatio: 0.4,
    record: '5-12', wr: 29, roi: -24, priorClvPct: 36,
  },
];

const contestedBoard = [
  {
    short: 'a91f2c', side: 'ours', invested: 6200,
    sizeRatio: 1.8, displaySizeRatio: 1.8, whitelist: 'CONFIRMED', whitelisted: true, proven: true,
    hardMarket: true, priorClvPct: 58, roi: 22, wr: 67, record: '14-7',
    bookPnl: 18600,
    recent: tape(8, 'WWLWWWLW'),
  },
  {
    short: 'b3e811', side: 'ours', proven: true, whitelisted: true, whitelist: 'CONFIRMED',
    invested: 3600, sizeRatio: 1.2, displaySizeRatio: 1.2,
    record: '9-6', wr: 60, roi: 14, priorClvPct: 54,
    bookPnl: 6400,
    recent: tape(9, 'WLWWLWL'),
  },
  {
    short: 'flat22', side: 'ours', proven: true, whitelisted: true, whitelist: 'FLAT',
    invested: 1800, sizeRatio: 0.7, displaySizeRatio: 0.7,
    record: '7-6', wr: 54, roi: 3, priorClvPct: 49,
    bookPnl: 900,
    recent: tape(11, 'LWWLWL'),
  },
  {
    short: 'c9vs01', side: 'against', proven: true, whitelisted: true, whitelist: 'CONFIRMED',
    invested: 2400, sizeRatio: 1.1, displaySizeRatio: 1.1,
    hardMarket: true, priorClvPct: 52, roi: 12, wr: 63, record: '8-5',
  },
  {
    short: 'lose01', side: 'against', proven: false, whitelisted: false, whitelist: 'WR50',
    invested: 3200, sizeRatio: 0.5, displaySizeRatio: 0.5,
    record: '6-11', wr: 35, roi: -18, priorClvPct: 41,
  },
  {
    short: 'lose02', side: 'ours', proven: false, whitelisted: false, whitelist: 'WR50',
    skillEligible: true,
    invested: 900, sizeRatio: 0.3, displaySizeRatio: 0.3,
    record: '4-9', wr: 31, roi: -22, priorClvPct: 38,
  },
];

const base = {
  sport: 'NFL',
  away: 'New York Jets',
  home: 'Pittsburgh Steelers',
  gameTime: '7:00 PM',
  pickLabel: 'Over 37.5',
  ourMarketLabel: 'Over 37.5',
  ticketLine: 37.5,
  marketType: 'total',
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
  boardMoneyFull: { ours: 7500, theirs: 1800, total: 9300, oursPct: 81 },
  boardMoneyLosers: { ours: 0, theirs: 1800, total: 1800, oursPct: 0 },
  boardMoneyConfirmed: { ours: 5400, theirs: 0, total: 5400, oursPct: 100 },
  boardMoneyHcPct: 100,
  boardMoneyHcOurs: 5400,
  boardMoneyNonHcOurs: 0,
  boardMoneySources: { wallets: 7500, exchange: 1800 },
  pinnMax: 2100,
  pinnMovePp: 2.6,
  steam: { show: true, tag: '4.8% open', tagShort: '4.8%', tier: 'gold' },
  pinPath: pinPath(-104, -118, -120, 2100),
  evFlagged: -2.8,
  edge: 14,
  bestBook: 'FanDuel',
  liveBestBook: 'FanDuel',
  books: [
    { name: 'Pinnacle', odds: -109, line: 37.5, sharp: true },
    { name: 'FanDuel', odds: -102, best: true, line: 37.5 },
    { name: 'DraftKings', odds: -126, line: 37.5 },
    { name: 'BetMGM', odds: -120, line: 37.5 },
    { name: 'Circa', odds: -105, line: 37.5 },
    { name: 'Novig', odds: -106, line: 37.5 },
    { name: 'Polymarket', odds: -101, line: 37.5 },
    { name: 'Kalshi', odds: -114, line: 37.5 },
  ],
};

const FIXTURES = [
  {
    title: 'Showcase — GOLD stack (HARD+ FOR · proven ≥75%)',
    f: {
      ...base,
      commenceMs: now + 12 * H,
      goldStack: true,
      goldStackTip: 'Inside stack — HARD+ FOR only · proven 86%',
    },
  },
  {
    title: 'Contested — IN, EDGE 14 does not gold it',
    f: {
      ...base,
      sport: 'NFL',
      away: 'Carolina Panthers',
      home: 'Jacksonville Jaguars',
      gameTime: '7:30 PM',
      pickLabel: 'Jaguars ML',
      ourMarketLabel: 'Jaguars ML',
      marketType: 'ml',
      side: 'home',
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
      boardMoneyFull: { ours: 11600, theirs: 9800, total: 21400, oursPct: 54 },
      boardMoneyLosers: { ours: 900, theirs: 7400, total: 8300, oursPct: 11 },
      boardMoneyConfirmed: { ours: 9800, theirs: 2400, total: 12200, oursPct: 80 },
      boardMoneyHcPct: 63,
      boardMoneyHcOurs: 6200,
      boardMoneyNonHcOurs: 3600,
      boardMoneySources: { wallets: 15200, exchange: 6200 },
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
      marketType: 'ml',
      side: 'home',
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
      goldStack: true,
      goldStackTip: 'Inside stack — HARD+ FOR only · proven 91%',
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
    title: 'NO PLAY — muted on tape',
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
      commenceMs: now + 5 * H,
      pinPath: null,
    },
  },
  {
    title: 'Buried — the other side has the money',
    f: {
      ...base,
      sport: 'NBA',
      away: 'Los Angeles Lakers',
      home: 'Golden State Warriors',
      side: 'away',
      gameTime: '10:10 PM',
      pickLabel: 'Lakers ML',
      ourMarketLabel: 'Lakers ML',
      marketType: 'ml',
      units: 1,
      toWin: 0.71,
      heroOdds: -133,
      bestOdds: -133,
      lockOdds: -133,
      gotOdds: -133,
      mainNowLabel: null,
      ticketOffMain: false,
      instrumentVariant: 'MAIN',
      confirmedOnSide: 1,
      sharpUsd: 3400,
      sideInvested: 3400,
      against: { abbr: 'Warriors', proven: 0, invested: 33000 },
      wallets: [{
        ...leadTrust,
        short: '1895dc',
        invested: 3400,
        sport: 'NBA',
        trust: {
          record: '14-8',
          banger: { label: 'L30 +$5.6K', tone: 'hot', kind: 'l30pnl', score: 5600 },
          secondary: ['14-8', '64% WR'],
          bookKind: 'positions',
        },
        bookPnl: 5600,
        recent: tape(6, 'LWWLWWWLWWLWW'),
      }],
      mapWallets: [
        { short: '1895dc', side: 'ours', invested: 3400, proven: true, whitelisted: true, whitelist: 'CONFIRMED' },
        { short: 'war99', side: 'against', invested: 33000, proven: false, whitelist: 'WR50' },
      ],
      boardMoneyFull: { ours: 3400, theirs: 33000, total: 36400, oursPct: 9 },
      boardMoneyLosers: { ours: 0, theirs: 33000, total: 33000, oursPct: 0 },
      boardMoneyConfirmed: { ours: 3400, theirs: 0, total: 3400, oursPct: 100 },
      boardMoneyHcPct: 0,
      boardMoneyHcOurs: 0,
      boardMoneyNonHcOurs: 3400,
      commenceMs: now + 11 * H,
      goldStack: false,
    },
  },
  {
    title: 'NO PLAY — unopposed, below size bar',
    f: {
      ...base,
      pickLabel: 'Mariners ML',
      sport: 'MLB',
      units: 0,
      toWin: 0,
      tapeAction: 'hold',
      stakePath: 'MONITORING',
      commenceMs: now + 5 * H,
      pinPath: null,
      mapWallets: [{ ...leadTrust, side: 'ours' }],
      against: { abbr: 'Under', proven: 0, invested: 0 },
      boardMoneyFull: { ours: 7500, theirs: 0, total: 7500, oursPct: 100 },
      boardMoneyLosers: { ours: 0, theirs: 0, total: 0, oursPct: 0 },
      boardMoneyConfirmed: { ours: 5400, theirs: 0, total: 5400, oursPct: 100 },
    },
  },
];

function LabCard({ title, f }) {
  const [shorts, setShorts] = useState(() => new Set(['b3e811']));
  const mySharps = {
    shorts,
    names: { b3e811: 'Harbor' },
    ready: true,
    atCap: false,
    onToggle: async ({ walletShort }) => {
      const id = normalizeWalletShort(walletShort);
      if (!id) return { reason: 'auth' };
      setShorts((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      return {};
    },
  };
  return (
    <div>
      <div style={{ color: '#647089', fontSize: '0.62rem', fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>
        {title}
      </div>
      <LockedPositionCardView f={f} mySharps={mySharps} />
    </div>
  );
}

export default function LockedCardStates() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0F1F', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ color: '#9aa6bd', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', marginBottom: 18 }}>
          LOCKED CARD — GOLD = HARD+ FOR · PROVEN ≥75% STACK
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 18 }}>
          {FIXTURES.map(({ title, f }) => (
            <LabCard key={title} title={title} f={f} />
          ))}
        </div>
      </div>
    </div>
  );
}

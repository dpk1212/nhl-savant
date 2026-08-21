/**
 * LockedCardStates — renders the PRODUCTION LockedPositionCardView (the same
 * component Sharp Flow mounts) with one fixture per visual state, so card
 * design changes can be reviewed without Firebase. Open at #/locked-card-states.
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

const leadWallet = {
  short: 'eeabaf',
  proven: true,
  invested: 5400,
  sizeRatio: 0.33,
  record: '8-3',
  wr: 73,
  roi: 60,
  priorClvPct: 64,
};

const base = {
  sport: 'MLB',
  away: 'Chicago White Sox',
  home: 'Toronto Blue Jays',
  gameTime: '3:08 PM',
  pickLabel: 'Sox ML',
  lockOdds: -112,
  gotOdds: -112,
  peakOdds: -118,
  nowOdds: -108,
  fairLine: -109,
  sharpEntryOdds: -104,
  currentFairOdds: -108,
  clvPct: 1.4,
  units: 5.4,
  toWin: 4.82,
  pathBaseUnits: 1.5,
  unitsPreTape: 1.5,
  tapeAction: 'boost',
  stakePath: 'TOP',
  confirmedOnSide: 1,
  sharpUsd: 5400,
  sideInvested: 5400,
  vaultOnSide: 0,
  against: { abbr: 'TOR', label: 'Blue Jays', proven: 0, invested: 0 },
  wallets: [leadWallet],
  pinnMax: 1900,
  pinnMovePp: 2.6,
  steam: { show: true, tag: '4.8% open', tagShort: '4.8%', tier: 'gold', tip: 'Pinnacle steamed toward entry' },
  marketSignals: { warnAgainst: false, steamedAgainst: false },
  pinPath: pinPath(-104, -112, -108, 1900),
  evFlagged: -2.8,
};

const FIXTURES = [
  {
    title: 'Showcase — unopposed + boost + steam',
    f: {
      ...base,
      sport: 'NFL',
      away: 'New York Jets',
      home: 'Pittsburgh Steelers',
      gameTime: '7:00 PM',
      pickLabel: 'Over 37.5',
      lockOdds: 100,
      gotOdds: 100,
      heroOdds: 100,
      mainNowLabel: 'flagged at Over 36.5 · -122',
      ticketOffMain: true,
      instrumentVariant: 'ALT',
      lineMoved: true,
      sharpEntryOdds: -104,
      currentFairOdds: -120,
      fairLine: -109,
      pinPath: pinPath(-104, -118, -120, 2100),
      pinnMax: 2100,
      commenceMs: now + 12 * H,
      edge: 14,
    },
  },
  {
    title: 'Closing — contested board',
    f: {
      ...base,
      pickLabel: 'Tigers ML',
      lockOdds: -185,
      gotOdds: -185,
      clvPct: 0.6,
      units: 4.0,
      toWin: 2.16,
      tapeAction: 'hold',
      unitsPreTape: 4.0,
      pathBaseUnits: 4.0,
      against: { abbr: 'KC', label: 'Royals', proven: 1, invested: 3200 },
      confirmedOnSide: 2,
      sharpUsd: 9800,
      wallets: [
        { ...leadWallet, sizeRatio: 1.8, invested: 6200 },
        { short: 'a91f2c', proven: true, invested: 3600, sizeRatio: 1.2 },
      ],
      steam: { show: false },
      pinnMovePp: -1.1,
      commenceMs: now + 0.8 * H,
      pinPath: pinPath(-170, -180, -188, 1500),
      sharpEntryOdds: -170,
      currentFairOdds: -188,
    },
  },
  {
    title: 'Urgent — locks < 15m',
    f: {
      ...base,
      pickLabel: 'Over 8.5',
      stakePath: 'MINI',
      lockOdds: -110,
      gotOdds: -110,
      clvPct: 0.4,
      units: 4.0,
      toWin: 3.64,
      tapeAction: 'hold',
      pathBaseUnits: 4.0,
      unitsPreTape: 4.0,
      steam: { show: true, tag: 'Steam', tagShort: '2.1%', tier: 'green', tip: 'Steam with' },
      commenceMs: now + (12 * 60 * 1000) + (15 * 60 * 1000),
    },
  },
  {
    title: 'Frozen — ticket SET',
    f: {
      ...base,
      pickLabel: 'Brewers ML',
      stakePath: 'SHARP',
      lockOdds: -126,
      gotOdds: -126,
      clvPct: 1.7,
      units: 4.0,
      toWin: 3.17,
      commenceMs: now + 10 * 60 * 1000,
      tapeAction: 'boost',
      pathBaseUnits: 2.0,
      unitsPreTape: 2.0,
    },
  },
  {
    title: 'Tracked — tape mute',
    f: {
      ...base,
      pickLabel: 'Mariners ML',
      lockOdds: -137,
      gotOdds: -137,
      clvPct: 1.5,
      units: 0,
      toWin: 0,
      commenceMs: now + 5 * H,
      mutedBy: 'tape-weak',
      unitsPreTape: 1.5,
      tapeAction: 'mute',
      stakePath: 'MONITORING',
      steam: { show: false },
      against: { abbr: 'TEX', proven: 0, invested: 0 },
    },
  },
  {
    title: 'Graded — WIN',
    f: {
      ...base,
      pickLabel: 'Rays ML',
      lockOdds: -106,
      gotOdds: -106,
      clvPct: 0.7,
      units: 4.0,
      toWin: 3.77,
      commenceMs: now - 5 * H,
      graded: true,
      outcome: 'WIN',
      profit: 3.77,
      tapeAction: 'hold',
      pathBaseUnits: 4.0,
    },
  },
  {
    title: 'Graded — LOSS',
    f: {
      ...base,
      pickLabel: 'Coria ML',
      sport: 'UFC',
      lockOdds: -1100,
      gotOdds: -1100,
      clvPct: -1.2,
      units: 3.0,
      toWin: 0.27,
      commenceMs: now - 5 * H,
      graded: true,
      outcome: 'LOSS',
      profit: -3.0,
      pinPath: null,
      steam: { show: false },
    },
  },
];

export default function LockedCardStates() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0F1F', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ color: '#9aa6bd', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', marginBottom: 18 }}>
          LOCKED CARD — COLLAPSED STATES (PRODUCTION COMPONENT)
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

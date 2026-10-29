/**
 * Populated Action board — #/action-card-lab
 * Fixture only. No auth, no live wallets.
 */
import React, { useEffect, useState } from 'react';
import ConfirmedActionDesk from '../sharpFlow/ConfirmedActionDesk.jsx';

const LAB_UID = 'action-card-lab';
if (typeof window !== 'undefined') {
  window.localStorage.removeItem(`sf_my_sharps_v1:${LAB_UID}`);
}

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const commence = new Date(Date.now() + 90 * 60 * 1000).toISOString();
const nowSec = Math.floor(Date.now() / 1000);

function curve(end) {
  const steps = [0.04, 0.18, 0.36, 0.28, 0.52, 0.7, 0.84, 1];
  return steps.map((t, i) => (i === steps.length - 1 ? end : Math.round(end * t)));
}

function legs(sport, away, home, side) {
  return [0, 1, 2, 3, 4].map((i) => ({
    date: `2026-10-${18 + i}`,
    sport,
    away,
    home,
    side,
    marketType: 'ML',
    odds: -140 - i * 8,
    invested: 400 + i * 120,
    sizeRatio: 0.8 + i * 0.15,
    sizeBand: i >= 3 ? 'press' : 'lean',
    won: 1,
    dollarPnl: 180 + i * 90,
    flat: 0.4,
    label: side === 'away' ? away : home,
  }));
}

function book({ n, wr, roi, flat, invested }) {
  const wins = Math.round(n * wr / 100);
  return {
    n,
    wr,
    wins,
    losses: n - wins,
    dollarRoi: roi,
    positionFlatRoi: flat,
    invested,
  };
}

function profile({
  sport, roi, flat, n = 24, wr = 68, invested, hardMarket = null, l10, l30, clv = 56,
  away, home, side,
}) {
  const positions = book({ n, wr, roi, flat, invested });
  const byMarket = hardMarket
    ? {
      [hardMarket]: {
        positions: { n: 14, wr: 79, wins: 11, losses: 3, dollarRoi: 41, positionFlatRoi: 22 },
        recentActionWindow: {
          n: 18, wins: 14, losses: 4, wr: 78, dollarRoi: 35, settledPnl: l30, days: 30,
        },
      },
    }
    : {};
  return {
    clvSkill: { n: 22, pctPos: clv },
    bySport: {
      [sport]: {
        whitelistTier: 'CONFIRMED',
        positions,
        picks: { n: 28, wins: 22, losses: 6, wr: 79, flatRoi: flat },
        form: {
          l10,
          l5: { w: 4, l: 1 },
          actionL10: l10,
          actionL5: { w: 4, l: 1 },
          actionDollarEnd: l30,
          actionDollarCurve: curve(l30),
          flatCurveDays: 30,
          recentAction: legs(sport, away, home, side),
        },
        recentActionWindow: {
          n: 18, wins: l10.w + 4, losses: l10.l, wr: 80, dollarRoi: 34, settledPnl: l30, days: 30,
        },
        byMarket,
      },
    },
  };
}

function filler(sport, roi) {
  return profile({
    sport, roi, flat: roi * 0.6, n: 12, wr: 60, invested: 20000,
    l10: { w: 6, l: 4 }, l30: 2000, clv: 52,
    away: 'Away', home: 'Home', side: 'home',
  });
}

const profiles = new Map([
  ['a1a1a1', profile({
    sport: 'NFL', roi: 90, flat: 70, n: 22, wr: 79, invested: 18150,
    hardMarket: 'ML', l10: { w: 7, l: 3 }, l30: 6000, clv: 45,
    away: 'Panthers', home: 'Packers', side: 'home',
  })],
  ['a2a2a2', profile({
    sport: 'NFL', roi: 72, flat: 54, n: 20, wr: 71, invested: 50000,
    l10: { w: 5, l: 5 }, l30: 14000, clv: 48,
    away: 'Panthers', home: 'Packers', side: 'home',
  })],
  ['a3a3a3', profile({
    sport: 'NFL', roi: 18, flat: 12, n: 16, wr: 58, invested: 24000,
    l10: { w: 4, l: 6 }, l30: -800, clv: 51,
    away: 'Panthers', home: 'Packers', side: 'away',
  })],
  ['a4a4a4', filler('NFL', 9)],
  ['b1b1b1', profile({
    sport: 'CS2', roi: 88, flat: 60, n: 18, wr: 74, invested: Math.round((12100 / 8.6) * 18),
    l10: { w: 2, l: 0 }, l30: 4800, clv: 66,
    away: 'Eternal Fire', home: 'Astralis', side: 'away',
  })],
  ['b1foe1', profile({
    sport: 'CS2', roi: 22, flat: 14, n: 10, wr: 60, invested: 18000,
    l10: { w: 5, l: 5 }, l30: 900, clv: 50,
    away: 'Eternal Fire', home: 'Astralis', side: 'home',
  })],
  ['b1foe2', profile({
    sport: 'CS2', roi: 16, flat: 10, n: 10, wr: 57, invested: 16000,
    l10: { w: 4, l: 6 }, l30: 400, clv: 49,
    away: 'Eternal Fire', home: 'Astralis', side: 'home',
  })],
  ['b4b4b4', filler('CS2', 8)],
  ['b2b2b2', profile({
    sport: 'CS2', roi: 48, flat: 30, n: 16, wr: 66, invested: Math.round((7300 / 2.2) * 16),
    hardMarket: 'ML', l10: { w: 6, l: 4 }, l30: 6100, clv: 61,
    away: 'TYLOO', home: 'Iberian Soul', side: 'home',
  })],
  ['c1c1c1', profile({
    sport: 'NBA', roi: 64, flat: 40, n: 30, wr: 62, invested: 210000,
    l10: { w: 8, l: 2 }, l30: 55000, clv: 56,
    away: 'Trail Blazers', home: 'Grizzlies', side: 'home',
  })],
  ['c2c2c2', profile({
    sport: 'NBA', roi: 20, flat: 11, n: 12, wr: 58, invested: 22000,
    l10: { w: 5, l: 5 }, l30: 1200, clv: 50,
    away: 'Trail Blazers', home: 'Grizzlies', side: 'away',
  })],
  ['c3c3c3', filler('NBA', 12)],
  ['c4c4c4', filler('NBA', 7)],
]);

function ticket({
  sport, gameKey, away, home, side, wallet, invested, price, hoursAgo, market = 'ML', line = null,
}) {
  const slug = `${sport.toLowerCase()}-${gameKey.replace('_', '-')}-${today}`;
  return {
    wallet: `0x${'ab'.repeat(18)}${wallet}`,
    side,
    invested,
    v8_sizeRatio: null,
    entryAvgPrice: price,
    firstSeen: new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString(),
    commenceTime: commence,
    slug,
    status: 'PENDING',
    ...(line == null ? {} : { entryLine: line, spreadLine: line }),
  };
}

const sharpPositions = {
  NFL: {
    car_gb: {
      away: 'Panthers',
      home: 'Packers',
      positions: [
        ticket({
          sport: 'NFL', gameKey: 'car_gb', away: 'Panthers', home: 'Packers',
          side: 'home', wallet: 'a1a1a1', invested: 825, price: 0.65, hoursAgo: 23,
        }),
      ],
    },
  },
  CS2: {
    ast_fire: {
      away: 'Eternal Fire',
      home: 'Astralis',
      positions: [
        ticket({
          sport: 'CS2', gameKey: 'ast_fire', away: 'Eternal Fire', home: 'Astralis',
          side: 'away', wallet: 'b1b1b1', invested: 12100, price: 0.38, hoursAgo: 2,
        }),
        ticket({
          sport: 'CS2', gameKey: 'ast_fire', away: 'Eternal Fire', home: 'Astralis',
          side: 'home', wallet: 'b1foe1', invested: 2400, price: 0.62, hoursAgo: 3,
        }),
        ticket({
          sport: 'CS2', gameKey: 'ast_fire', away: 'Eternal Fire', home: 'Astralis',
          side: 'home', wallet: 'b1foe2', invested: 1800, price: 0.6, hoursAgo: 4,
        }),
      ],
    },
    tyl_ibs: {
      away: 'TYLOO',
      home: 'Iberian Soul',
      positions: [
        ticket({
          sport: 'CS2', gameKey: 'tyl_ibs', away: 'TYLOO', home: 'Iberian Soul',
          side: 'home', wallet: 'b2b2b2', invested: 7300, price: 0.59, hoursAgo: 3,
        }),
      ],
    },
  },
  NBA: {
    por_mem: {
      away: 'Trail Blazers',
      home: 'Grizzlies',
      positions: [
        ticket({
          sport: 'NBA', gameKey: 'por_mem', away: 'Trail Blazers', home: 'Grizzlies',
          side: 'home', wallet: 'c1c1c1', invested: 1400, price: 0.28, hoursAgo: 2,
        }),
        ticket({
          sport: 'NBA', gameKey: 'por_mem', away: 'Trail Blazers', home: 'Grizzlies',
          side: 'away', wallet: 'c2c2c2', invested: 900, price: 0.72, hoursAgo: 5,
        }),
      ],
    },
  },
};

const spreadPositions = {
  NFL: {
    car_gb: {
      away: 'Panthers',
      home: 'Packers',
      positions: [
        ticket({
          sport: 'NFL', gameKey: 'car_gb', away: 'Panthers', home: 'Packers',
          side: 'home', wallet: 'a2a2a2', invested: 1500, price: 0.52, hoursAgo: 72,
          market: 'SPREAD', line: -3.5,
        }),
        ticket({
          sport: 'NFL', gameKey: 'car_gb', away: 'Panthers', home: 'Packers',
          side: 'away', wallet: 'a3a3a3', invested: 1100, price: 0.48, hoursAgo: 20,
          market: 'SPREAD', line: 3.5,
        }),
      ],
    },
  },
};

const pinnacleHistory = {
  NFL: {
    car_gb: {
      movement: { direction: 'home' },
      opener: { home: -158, away: 142, max: 5000 },
      current: { home: -174, away: 156, max: 5600 },
      history: [
        { t: nowSec - 5000, home: -158, away: 142, maxMoneyLine: 5000 },
        { t: nowSec - 40, home: -174, away: 156, maxMoneyLine: 5600 },
      ],
    },
  },
};

function usePhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

export default function ActionCardLab() {
  const phone = usePhone();
  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090f',
      color: '#F8FAFC',
      padding: phone ? '0.85rem 0.55rem 3rem' : '1.4rem 1.1rem 4rem',
    }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <ConfirmedActionDesk
          sharpPositions={sharpPositions}
          spreadPositions={spreadPositions}
          totalPositions={{}}
          rawSharpPositions={sharpPositions}
          rawSpreadPositions={spreadPositions}
          rawTotalPositions={{}}
          walletProfiles={profiles}
          pinnacleHistory={pinnacleHistory}
          sportFilter="All"
          isMobile={phone}
          user={{ uid: LAB_UID, email: 'lab@local.test' }}
          isPremium
        />
      </div>
    </div>
  );
}

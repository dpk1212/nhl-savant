/**
 * Populated My Sharps desk — #/my-sharps-lab
 * Fixture only. No auth, no live wallets.
 */
import React, { useMemo } from 'react';
import { parseMySharpsDoc } from '../../lib/mySharps.js';
import { buildMySharpsRoster } from '../../lib/mySharpsDesk.js';
import MySharpsDesk from '../sharpFlow/MySharpsDesk.jsx';

const state = parseMySharpsDoc({
  mySharps: {
    members: {
      e4ec62: { walletShort: 'e4ec62', addedAt: 1 },
      162937: { walletShort: '162937', addedAt: 2 },
      abcdef: { walletShort: 'abcdef', addedAt: 3 },
      aaaaaa: { walletShort: 'aaaaaa', addedAt: 4 },
    },
  },
});

const profiles = new Map([
  ['e4ec62', {
    clvSkill: { n: 18, pctPos: 62 },
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 10, wins: 7, losses: 3, wr: 70, settledPnl: 439000, dollarRoi: 18 },
        positions: { n: 20, wins: 12, losses: 8, wr: 60, positionFlatRoi: 8, dollarRoi: 11 },
        form: {
          actionL5: { w: 4, l: 1 },
          actionL10: { w: 7, l: 3 },
          actionDollarCurve: [0, 40000, 90000, 70000, 120000, 180000, 250000, 310000, 380000, 439000],
        },
        byMarket: {
          ML: { positions: { n: 10, wins: 7, losses: 3, wr: 70, dollarRoi: 16 } },
          TOTAL: { positions: { n: 6, wins: 4, losses: 2, wr: 67, dollarRoi: 11 } },
        },
      },
    },
  }],
  ['162937', {
    clvSkill: { n: 12, pctPos: 58 },
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 12, wins: 7, losses: 5, wr: 58, settledPnl: 162000, dollarRoi: 9 },
        positions: { n: 16, wins: 9, losses: 7, wr: 56, positionFlatRoi: 6, dollarRoi: 8 },
        form: { actionL5: { w: 3, l: 2 }, actionL10: { w: 6, l: 4 } },
        byMarket: {
          TOTAL: { positions: { n: 8, wins: 5, losses: 3, wr: 62, dollarRoi: 10 } },
        },
      },
    },
  }],
  ['abcdef', {
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 3, wins: 3, losses: 0, wr: 100, settledPnl: 9000, dollarRoi: 40 },
        form: { actionL5: { w: 3, l: 0 } },
      },
    },
  }],
  ['aaaaaa', {
    bySport: {
      CFB: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 10, wins: 3, losses: 7, wr: 30, settledPnl: -84000, dollarRoi: -12 },
        positions: { n: 14, wins: 5, losses: 9, wr: 36, positionFlatRoi: -8, dollarRoi: -10 },
        form: { actionL5: { w: 1, l: 4 }, actionL10: { w: 3, l: 7 } },
        byMarket: {
          ML: { positions: { n: 9, wins: 3, losses: 6, wr: 33, dollarRoi: -14 } },
        },
      },
    },
  }],
]);

const actionRows = [
  {
    walletShort: 'e4ec62', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'over',
    team: 'Over', marketLabel: 'O 47.5', away: 'SEA', home: 'ARI', americanLabel: '-110',
    invested: 162500, displaySizeRatio: 2.1, opposed: 'clear',
    commenceMs: Date.parse('2026-09-20T16:00:00-04:00'), commenceDateKey: '2026-09-20',
  },
  {
    walletShort: '162937', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'over',
    team: 'Over', marketLabel: 'O 47.5', away: 'SEA', home: 'ARI', americanLabel: '-108',
    invested: 122100, displaySizeRatio: 1.4, opposed: 'clear',
    commenceMs: Date.parse('2026-09-20T16:00:00-04:00'), commenceDateKey: '2026-09-20',
  },
  {
    walletShort: 'abcdef', sport: 'NFL', gameKey: 'sea_ari', marketType: 'TOTAL', side: 'under',
    team: 'Under', marketLabel: 'U 47.5', away: 'SEA', home: 'ARI',
    invested: 11000, displaySizeRatio: 0.6, opposed: 'contested',
    commenceMs: Date.parse('2026-09-20T16:00:00-04:00'), commenceDateKey: '2026-09-20',
  },
  {
    walletShort: 'aaaaaa', sport: 'CFB', gameKey: 'lsu_ala', marketType: 'ML', side: 'home',
    team: 'Bama', marketLabel: 'ML', away: 'LSU', home: 'Bama', americanLabel: '-142',
    invested: 88000, displaySizeRatio: 1.8, opposed: 'clear',
    commenceMs: Date.parse('2026-09-21T20:00:00-04:00'), commenceDateKey: '2026-09-21',
  },
];

const recentLegs = [
  { walletShort: 'e4ec62', won: 1, dollarPnl: 14000, date: '2026-09-19', sport: 'NFL', marketType: 'ML', side: 'away', team: 'Seahawks', gameKey: 'sea_ari' },
  { walletShort: 'e4ec62', won: 1, dollarPnl: 8200, date: '2026-09-19', sport: 'NFL', marketType: 'SPREAD', side: 'home', team: 'Chiefs', line: -3.5, gameKey: 'den_kc' },
  { walletShort: '162937', won: 0, dollarPnl: -4100, date: '2026-09-18', sport: 'MLB', marketType: 'TOTAL', side: 'under', line: 7.5, gameKey: 'wsh_stl' },
  { walletShort: 'aaaaaa', won: 0, dollarPnl: -6200, date: '2026-09-18', sport: 'CFB', marketType: 'ML', side: 'home', team: 'Bama', gameKey: 'lsu_ala' },
];

export default function MySharpsDeskLab() {
  const roster = useMemo(
    () => buildMySharpsRoster(state, {
      walletProfiles: profiles,
      actionRows,
      sportFilter: 'All',
    }),
    [],
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0F1F',
      color: '#F8FAFC',
      padding: '2.2rem 1.6rem 4rem',
    }}
    >
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <MySharpsDesk
          ready
          signedIn
          roster={roster}
          walletProfiles={profiles}
          shorts={['e4ec62', '162937', 'abcdef', 'aaaaaa']}
          actionRows={actionRows.filter((r) => r.commenceDateKey === '2026-09-20')}
          weekRows={actionRows}
          recentLegs={recentLegs}
          dateKey="2026-09-20"
          todayKey="2026-09-20"
          isMobile={false}
        />
      </div>
    </div>
  );
}

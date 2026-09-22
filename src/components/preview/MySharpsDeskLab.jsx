/**
 * Populated My Sharps desk — #/my-sharps-lab
 * Fixture only. No auth, no live wallets.
 */
import React, { useMemo, useState } from 'react';
import { parseMySharpsDoc, tailFromTicket, toggleMySharpMember } from '../../lib/mySharps.js';
import { buildMySharpsRoster } from '../../lib/mySharpsDesk.js';
import MySharpsDesk from '../sharpFlow/MySharpsDesk.jsx';

const seed = parseMySharpsDoc({
  mySharps: {
    members: {
      e4ec62: { walletShort: 'e4ec62', addedAt: 1, name: 'Bands' },
      '51176e': { walletShort: '51176e', addedAt: 2, name: 'Harbor' },
    },
    tails: {
      'MLB|nyy_tex|ML|away': {
        id: 'MLB|nyy_tex|ML|away',
        pick: 'Mets',
        matchup: 'NYM @ TEX',
        sport: 'MLB',
        gameKey: 'nyy_tex',
        marketType: 'ML',
        side: 'away',
        theirAmerican: 118,
        myAmerican: 110,
        stake: 1800,
        tailedAt: 2,
        wallets: ['51176e'],
        status: 'open',
      },
    },
  },
});

const profiles = new Map([
  ['e4ec62', {
    clvSkill: { n: 22, pctPos: 61 },
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 40, wins: 26, losses: 14, wr: 65, settledPnl: 51000, dollarRoi: 14 },
        positions: { n: 90, wins: 54, losses: 36, wr: 60, positionFlatRoi: 8, dollarRoi: 11, invested: 420000 },
        form: { actionL5: { w: 4, l: 1 }, actionL10: { w: 7, l: 3 } },
        byMarket: {
          ML: { positions: { n: 28, wins: 15, losses: 13, wr: 54, dollarRoi: 2 } },
          TOTAL: { positions: { n: 48, wins: 31, losses: 17, wr: 65, dollarRoi: 19 }, recentActionWindow: { n: 16, wins: 11, losses: 5, wr: 69, settledPnl: 28000, dollarRoi: 22 } },
          SPREAD: { positions: { n: 14, wins: 6, losses: 8, wr: 43, dollarRoi: -8 } },
        },
      },
    },
  }],
  ['51176e', {
    clvSkill: { n: 18, pctPos: 64 },
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 30, wins: 20, losses: 10, wr: 67, settledPnl: 39300, dollarRoi: 16 },
        positions: { n: 73, wins: 48, losses: 25, wr: 66, positionFlatRoi: 9, dollarRoi: 12, invested: 310000 },
        form: { actionL10: { w: 4, l: 6 } },
        byMarket: {
          ML: { positions: { n: 40, wins: 28, losses: 12, wr: 70, dollarRoi: 18 }, recentActionWindow: { n: 12, wins: 9, losses: 3, wr: 75, settledPnl: 22000, dollarRoi: 17 } },
          SPREAD: { positions: { n: 18, wins: 9, losses: 9, wr: 50, dollarRoi: 1 } },
          TOTAL: { positions: { n: 15, wins: 6, losses: 9, wr: 40, dollarRoi: -11 } },
        },
      },
    },
  }],
  ['c0ffee', {
    clvSkill: { n: 40, pctPos: 58 },
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 120, wins: 72, losses: 48, wr: 60, settledPnl: 88000, dollarRoi: 22 },
        positions: { n: 210, wins: 124, losses: 86, wr: 59, dollarRoi: 22, invested: 900000 },
        form: { actionL10: { w: 7, l: 3 } },
        byMarket: {
          TOTAL: { positions: { n: 140, wins: 86, losses: 54, wr: 61, dollarRoi: 21 } },
        },
      },
    },
  }],
  ['badbad', {
    clvSkill: { n: 12, pctPos: 48 },
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 18, wins: 7, losses: 11, wr: 39, settledPnl: -14000, dollarRoi: -9 },
        positions: { n: 40, wins: 16, losses: 24, wr: 40, dollarRoi: -6, invested: 80000 },
        form: { actionL10: { w: 3, l: 7 } },
        byMarket: {
          ML: { positions: { n: 22, wins: 8, losses: 14, wr: 36, dollarRoi: -12 } },
        },
      },
    },
  }],
]);

const actionRows = [
  {
    walletShort: 'e4ec62', sport: 'MLB', gameKey: 'tor_bal', marketType: 'TOTAL', side: 'under',
    team: 'Under', marketLabel: 'U 8.5', away: 'TOR', home: 'BAL', americanLabel: '-154', americanOdds: -154,
    invested: 4900, displaySizeRatio: 1.1, opposed: 'clear',
    commenceMs: Date.parse('2026-09-22T18:36:00-04:00'),
  },
  {
    walletShort: '51176e', sport: 'MLB', gameKey: 'tor_bal', marketType: 'TOTAL', side: 'under',
    team: 'Under', marketLabel: 'U 8.5', away: 'TOR', home: 'BAL', americanLabel: '-150', americanOdds: -150,
    invested: 2000, displaySizeRatio: 1.2, opposed: 'clear',
    commenceMs: Date.parse('2026-09-22T18:36:00-04:00'),
  },
  {
    walletShort: '51176e', sport: 'MLB', gameKey: 'hou_sea', marketType: 'TOTAL', side: 'under',
    team: 'Under', marketLabel: 'U 7.5', away: 'HOU', home: 'SEA', americanLabel: '-108', americanOdds: -108,
    invested: 2200, displaySizeRatio: 1.1, opposed: 'clear',
    commenceMs: Date.parse('2026-09-22T21:41:00-04:00'),
  },
  {
    walletShort: 'e4ec62', sport: 'MLB', gameKey: 'hou_sea', marketType: 'TOTAL', side: 'over',
    team: 'Over', marketLabel: 'O 7.5', away: 'HOU', home: 'SEA', americanLabel: '-102', americanOdds: -102,
    invested: 1800, displaySizeRatio: 0.9, opposed: 'contested',
    commenceMs: Date.parse('2026-09-22T21:41:00-04:00'),
  },
  {
    walletShort: 'e4ec62', sport: 'MLB', gameKey: 'stl_pit', marketType: 'ML', side: 'home',
    team: 'Pirates', marketLabel: 'ML', away: 'STL', home: 'PIT', americanLabel: '-149', americanOdds: -149,
    invested: 6400, displaySizeRatio: 2.1, opposed: 'clear', pinMove: 'with',
    commenceMs: Date.parse('2026-09-22T18:41:00-04:00'),
  },
  {
    walletShort: '51176e', sport: 'MLB', gameKey: 'nyy_tex', marketType: 'ML', side: 'away',
    team: 'Mets', marketLabel: 'ML', away: 'NYM', home: 'TEX', americanLabel: '+122', americanOdds: 122,
    invested: 2000, displaySizeRatio: 0.8, opposed: 'clear',
    commenceMs: Date.parse('2026-09-22T20:05:00-04:00'),
  },
];

const recentLegs = [
  { walletShort: '51176e', won: 1, dollarPnl: 900, date: '2026-09-21', sport: 'MLB', marketType: 'ML', side: 'home', team: 'Yankees', gameKey: 'bos_nyy' },
  { walletShort: 'e4ec62', won: 0, dollarPnl: -1400, date: '2026-09-21', sport: 'MLB', marketType: 'TOTAL', side: 'over', line: 8.5, gameKey: 'laa_oak' },
];

export default function MySharpsDeskLab() {
  const [state, setState] = useState(seed);
  const roster = useMemo(
    () => buildMySharpsRoster(state, { walletProfiles: profiles, actionRows, sportFilter: 'All' }),
    [state],
  );
  const shorts = roster.map((r) => r.walletShort);

  return (
    <div style={{ minHeight: '100vh', background: '#0B0F1F', color: '#F8FAFC', padding: '1.6rem 1.2rem 4rem' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <MySharpsDesk
          ready
          signedIn
          roster={roster}
          walletProfiles={profiles}
          shorts={shorts}
          actionRows={actionRows}
          weekRows={actionRows}
          recentLegs={recentLegs}
          tails={state.tails}
          cap={40}
          isMobile={false}
          onRename={(short, name) => setState((cur) => ({
            ...cur,
            members: {
              ...cur.members,
              [short]: { ...cur.members[short], name: name || null },
            },
          }))}
          onRemove={(short) => setState((cur) => toggleMySharpMember(cur, { walletShort: short }, { remove: true }))}
          onAdd={(row) => {
            const member = {
              walletShort: row.walletShort,
              addedAt: Date.now(),
              sort: Date.now(),
              name: null,
              muted: false,
            };
            if (state.members[row.walletShort]) return { ok: true, already: true };
            setState((cur) => toggleMySharpMember(cur, member));
            return { ok: true };
          }}
          onTail={(ticket, patch) => {
            const tail = tailFromTicket(ticket, patch);
            if (!tail) return { ok: false };
            setState((cur) => ({ ...cur, tails: { ...cur.tails, [tail.id]: tail } }));
            return { ok: true, tail };
          }}
          onUntail={(id) => setState((cur) => {
            const tails = { ...cur.tails };
            delete tails[id];
            return { ...cur, tails };
          })}
        />
      </div>
    </div>
  );
}

/**
 * Populated My Sharps desk — #/my-sharps-lab
 * Fixture only. No auth, no live wallets.
 */
import React, { useMemo, useState } from 'react';
import { parseMySharpsDoc, tailFromTicket, toggleBetsFeed, toggleMySharpMember } from '../../lib/mySharps.js';
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

function bookPath(end, n = 24) {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const t = i / (n - 1);
    const ease = t * t * (3 - 2 * t);
    const wave = Math.sin(t * Math.PI * 3.2) * end * 0.08 * (1 - t * 0.4);
    out.push(Math.round(ease * end + wave));
  }
  out[0] = Math.round(end * 0.04);
  out[n - 1] = end;
  return out;
}

const profiles = new Map([
  ['e4ec62', {
    clvSkill: { n: 22, pctPos: 61 },
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 40, wins: 26, losses: 14, wr: 65, settledPnl: 51000, dollarRoi: 14 },
        positions: { n: 90, wins: 54, losses: 36, wr: 60, positionFlatRoi: 8, dollarRoi: 11, invested: 420000 },
        form: {
          actionL5: { w: 4, l: 1 },
          actionL10: { w: 7, l: 3 },
          actionDollarCurve: bookPath(51000),
          recentAction: [
            { date: '2026-09-20', marketType: 'TOTAL', side: 'under', line: 8.5, gameKey: 'tor_bal', away: 'TOR', home: 'BAL', invested: 4900, dollarPnl: 2100, won: 1 },
            { date: '2026-09-19', marketType: 'ML', side: 'home', team: 'Yankees', gameKey: 'bos_nyy', away: 'BOS', home: 'NYY', invested: 3200, dollarPnl: -1400, won: 0 },
            { date: '2026-09-18', marketType: 'TOTAL', side: 'over', line: 9, gameKey: 'laa_oak', away: 'LAA', home: 'OAK', invested: 1800, dollarPnl: 900, won: 1 },
          ],
        },
        byMarket: {
          ML: { positions: { n: 28, wins: 15, losses: 13, wr: 54, dollarRoi: 2, invested: 140000 }, recentActionWindow: { n: 10, wins: 6, losses: 4, wr: 60, settledPnl: 6400, dollarRoi: 8 } },
          TOTAL: { positions: { n: 48, wins: 31, losses: 17, wr: 65, dollarRoi: 19, invested: 230400 }, recentActionWindow: { n: 16, wins: 11, losses: 5, wr: 69, settledPnl: 28000, dollarRoi: 22 } },
          SPREAD: { positions: { n: 14, wins: 6, losses: 8, wr: 43, dollarRoi: -8, invested: 42000 } },
        },
      },
      CFB: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 6, wins: 4, losses: 2, wr: 67, settledPnl: 8200, dollarRoi: 18 },
        positions: { n: 12, wins: 8, losses: 4, wr: 67, dollarRoi: 15, invested: 96000 },
        form: {
          recentAction: [
            { date: '2026-09-20', marketType: 'ML', side: 'home', team: 'Georgia', gameKey: 'ala_uga', away: 'Alabama', home: 'Georgia', invested: 8000, dollarPnl: 4200, won: 1 },
            { date: '2026-09-13', marketType: 'ML', side: 'away', team: 'Oregon', gameKey: 'ore_osu', away: 'Oregon', home: 'Ohio State', invested: 6400, dollarPnl: -6400, won: 0 },
          ],
        },
        byMarket: {
          ML: { positions: { n: 8, wins: 6, losses: 2, wr: 75, dollarRoi: 21, invested: 64000 }, recentActionWindow: { n: 4, wins: 3, losses: 1, settledPnl: 6100, dollarRoi: 19 } },
          SPREAD: { positions: { n: 4, wins: 2, losses: 2, wr: 50, dollarRoi: -4, invested: 32000 } },
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
        form: {
          actionL10: { w: 4, l: 6 },
          actionDollarCurve: bookPath(39300),
          recentAction: [
            { date: '2026-09-21', marketType: 'ML', side: 'away', team: 'Mets', gameKey: 'nym_tex', away: 'NYM', home: 'TEX', dollarPnl: 1600, won: 1 },
            { date: '2026-09-18', marketType: 'SPREAD', side: 'home', team: 'Orioles', line: -1.5, gameKey: 'tor_bal', away: 'TOR', home: 'BAL', dollarPnl: -900, won: 0 },
          ],
        },
        byMarket: {
          ML: { positions: { n: 40, wins: 28, losses: 12, wr: 70, dollarRoi: 18 }, recentActionWindow: { n: 12, wins: 9, losses: 3, wr: 75, settledPnl: 22000, dollarRoi: 17 } },
          SPREAD: { positions: { n: 18, wins: 9, losses: 9, wr: 50, dollarRoi: 1 } },
          TOTAL: { positions: { n: 15, wins: 6, losses: 9, wr: 40, dollarRoi: -11, invested: 45000 }, recentActionWindow: { n: 8, wins: 3, losses: 5, wr: 38, settledPnl: -4200, dollarRoi: -9 } },
        },
      },
      NFL: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 4, wins: 3, losses: 1, wr: 75, settledPnl: 3800, dollarRoi: 18 },
        positions: { n: 4, wins: 3, losses: 1, wr: 75, dollarRoi: 18, invested: 21000 },
        form: { actionL5: { w: 3, l: 1 } },
        byMarket: {
          SPREAD: { positions: { n: 4, wins: 3, losses: 1, wr: 75, dollarRoi: 18 }, recentActionWindow: { n: 4, wins: 3, losses: 1, settledPnl: 3800, dollarRoi: 18 } },
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
        form: {
          actionL10: { w: 7, l: 3 },
          actionDollarCurve: [0, 20000, 44000, 61000, 88000],
          recentAction: Array.from({ length: 12 }, (_, i) => ({
            date: `2026-09-${String(20 - (i % 18)).padStart(2, '0')}`,
            marketType: 'TOTAL',
            side: i % 3 === 0 ? 'over' : 'under',
            line: 8 + (i % 3),
            gameKey: `nyy_bos_${i}`,
            away: 'NYY',
            home: 'BOS',
            dollarPnl: i % 3 === 0 ? -800 : 1400,
            won: i % 3 === 0 ? 0 : 1,
          })),
        },
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
  ['thin22', {
    clvSkill: { n: 3, pctPos: 66 },
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 3, wins: 3, losses: 0, wr: 100, dollarRoi: 140, invested: 6000 },
        form: {
          recentAction: [
            { date: '2026-09-14', marketType: 'SPREAD', side: 'home', team: 'Bills', line: -3.5, gameKey: 'mia_buf', away: 'MIA', home: 'BUF', dollarPnl: 900, won: 1 },
            { date: '2026-09-07', marketType: 'SPREAD', side: 'away', team: 'Ravens', line: -2.5, gameKey: 'bal_kc', away: 'BAL', home: 'KC', dollarPnl: 700, won: 1 },
          ],
        },
        byMarket: {
          SPREAD: { positions: { n: 3, wins: 3, losses: 0, wr: 100, dollarRoi: 140 } },
        },
      },
    },
  }],
  ['quiet9', {
    clvSkill: { n: 40, pctPos: 57 },
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 0, wins: 0, losses: 0, settledPnl: 0, dollarRoi: null },
        positions: { n: 45, wins: 32, losses: 13, wr: 71.1, dollarRoi: 45, invested: 1781035 },
        form: {
          actionL10: { w: 4, l: 6 },
          actionDollarCurve: bookPath(485846),
          actionDollarEnd: 485846,
          flatCurveFrom: '2026-06-02',
          actionCurveScope: 'recent',
          actionCurveFrom: '2026-06-02',
          recentAction: [],
          recentActionTotalN: 0,
          curveLegs: [
            { date: '2026-06-20', marketType: 'TOTAL', side: 'over', line: 8.5, gameKey: 'nyy_bos', away: 'NYY', home: 'BOS', dollarPnl: 18400, won: 1 },
            { date: '2026-06-18', marketType: 'ML', side: 'home', label: 'Dodgers', gameKey: 'sf_lad', away: 'SF', home: 'LAD', dollarPnl: -9200, won: 0 },
            { date: '2026-06-16', marketType: 'TOTAL', side: 'under', line: 9, gameKey: 'chc_stl', away: 'CHC', home: 'STL', dollarPnl: 12100, won: 1 },
            { date: '2026-06-14', marketType: 'SPREAD', side: 'away', label: 'Yankees', line: -1.5, gameKey: 'nyy_bos', away: 'NYY', home: 'BOS', dollarPnl: 6400, won: 1 },
            { date: '2026-06-11', marketType: 'ML', side: 'away', label: 'Braves', gameKey: 'atl_nym', away: 'ATL', home: 'NYM', dollarPnl: -4800, won: 0 },
            { date: '2026-06-08', marketType: 'TOTAL', side: 'over', line: 7.5, gameKey: 'hou_tex', away: 'HOU', home: 'TEX', dollarPnl: 22100, won: 1 },
          ],
        },
        byMarket: {
          ML: { positions: { n: 13, wins: 10, losses: 3, wr: 77, dollarRoi: 49 } },
          SPREAD: { positions: { n: 6, wins: 1, losses: 5, wr: 17, dollarRoi: -77 } },
          TOTAL: { positions: { n: 26, wins: 21, losses: 5, wr: 81, dollarRoi: 54 } },
        },
      },
    },
  }],
  ['stale9', {
    clvSkill: { n: 12, pctPos: 78 },
    bySport: {
      MLB: {
        whitelistTier: 'CONFIRMED',
        recentActionWindow: { n: 0, wins: 0, losses: 0, settledPnl: 0 },
        positions: { n: 89, wins: 55, losses: 34, wr: 62, dollarRoi: 28, invested: 2400000 },
        form: {
          actionL10: { w: 4, l: 6 },
          actionDollarCurve: bookPath(-262000),
          actionDollarEnd: -262000,
          flatCurveFrom: '2026-06-04',
          recentAction: [],
          recentActionTotalN: 0,
        },
        byMarket: {
          ML: { positions: { n: 42, wins: 24, losses: 18, wr: 57, dollarRoi: 16 } },
          TOTAL: { positions: { n: 47, wins: 31, losses: 16, wr: 66, dollarRoi: 47 } },
        },
      },
    },
  }],
  ['deep22', {
    clvSkill: { n: 30, pctPos: 62 },
    bySport: {
      NFL: {
        whitelistTier: 'CONFIRMED',
        positions: { n: 160, wins: 96, losses: 64, wr: 60, dollarRoi: 18, invested: 720000 },
        form: { actionL10: { w: 8, l: 2 } },
        byMarket: {
          SPREAD: { positions: { n: 90, wins: 54, losses: 36, wr: 60, dollarRoi: 16 } },
        },
      },
    },
  }],
]);

const actionRows = [
  {
    walletShort: 'e4ec62', sport: 'MLB', gameKey: 'tor_bal', marketType: 'TOTAL', side: 'under',
    team: 'Under', marketLabel: 'U 8.5', away: 'TOR', home: 'BAL', americanLabel: '-154', americanOdds: -154,
    invested: 14000, displaySizeRatio: 3.0, opposed: 'clear', pinMove: 'with', entryLine: 8.5,
    steam: { show: true, tier: 'gold', goldConfirmed: true, tag: 'GOLD 4.2%' },
    commenceMs: Date.parse('2026-09-22T18:36:00-04:00'),
  },
  {
    walletShort: '51176e', sport: 'MLB', gameKey: 'tor_bal', marketType: 'TOTAL', side: 'under',
    team: 'Under', marketLabel: 'U 8.5', away: 'TOR', home: 'BAL', americanLabel: '-100', americanOdds: -100,
    invested: 4200, displaySizeRatio: 1.0, opposed: 'clear', entryLine: 8.5,
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
    invested: 9800, displaySizeRatio: 2.1, opposed: 'clear', pinMove: 'with',
    commenceMs: Date.parse('2026-09-22T18:41:00-04:00'),
  },
  {
    walletShort: '51176e', sport: 'MLB', gameKey: 'nyy_tex', marketType: 'ML', side: 'away',
    team: 'Mets', marketLabel: 'ML', away: 'NYM', home: 'TEX', americanLabel: '+122', americanOdds: 122,
    invested: 2000, displaySizeRatio: 0.8, opposed: 'clear',
    steam: { show: true, tier: 'steam', goldConfirmed: false, tag: '2× 3.1%' },
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
          onToggleBets={(short, sport, market) => setState((cur) => toggleBetsFeed(cur, short, sport, market))}
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

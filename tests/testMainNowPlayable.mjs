/**
 * Hero = the ticket we lock/grade. Book MAIN is the subtitle when different.
 * Usage: node tests/testMainNowPlayable.mjs
 */
import assert from 'node:assert/strict';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

const commence = Date.now() + (3 * 3600 * 1000);
const t = Math.floor(Date.now() / 1000);

const pinnacleHistory = {
  MLB: {
    mil_lad: {
      totalHistory: [
        { t, line: 9.5, overOdds: 172, underOdds: -212, max: 1875 },
        { t, line: 7.5, overOdds: -121, underOdds: 104, max: 1875 },
        { t, line: 8, overOdds: -109, underOdds: -103, max: 1875 },
        { t, line: 8.5, overOdds: 114, underOdds: -133, max: 1875 },
        { t, line: 9, overOdds: 147, underOdds: -175, max: 1875 },
      ],
      // Stale stamp — highest alt. Unlabeled board falls back to pick'em.
      totalCurrent: { line: 9.5, overOdds: 172, underOdds: -212, max: 1875 },
      totalLines: [
        { line: 6.5, overOdds: -204, underOdds: 166, max: 1875 },
        { line: 7.5, overOdds: -121, underOdds: 104, max: 1875 },
        { line: 8, overOdds: -109, underOdds: -103, max: 1875 },
        { line: 8.5, overOdds: 114, underOdds: -133, max: 1875 },
        { line: 9, overOdds: 147, underOdds: -175, max: 1875 },
        { line: 9.5, overOdds: 172, underOdds: -212, max: 1875 },
      ],
      spreadCurrent: { homeLine: -1.5, awayLine: 1.5, homeOdds: 124, awayOdds: -140, max: 2500, isMain: true },
      spreadLines: [
        { homeLine: 1, awayLine: -1, homeOdds: -259, awayOdds: 210, max: 2500 },
        { homeLine: -1, awayLine: 1, homeOdds: -123, awayOdds: 107, max: 2500 },
        { homeLine: -1.5, awayLine: 1.5, homeOdds: 124, awayOdds: -140, max: 2500, isMain: true },
        { homeLine: 1.5, awayLine: -1.5, homeOdds: -313, awayOdds: 240, max: 2500 },
      ],
    },
    tex_laa: {
      spreadHistory: [
        { t, homeLine: 1, awayLine: -1, homeOdds: 100, awayOdds: -112, max: 10000 },
        { t, homeLine: 1.5, awayLine: -1.5, homeOdds: -117, awayOdds: 102, max: 10000, isMain: true },
        { t, homeLine: 3, awayLine: -3, homeOdds: -325, awayOdds: 265, max: 10000 },
      ],
      spreadCurrent: { homeLine: 1.5, awayLine: -1.5, homeOdds: -117, awayOdds: 102, max: 10000, isMain: true },
      spreadLines: [
        { homeLine: 1, awayLine: -1, homeOdds: 100, awayOdds: -112, max: 10000 },
        { homeLine: 1.5, awayLine: -1.5, homeOdds: -117, awayOdds: 102, max: 10000, isMain: true },
        { homeLine: 3, awayLine: -3, homeOdds: -325, awayOdds: 265, max: 10000 },
      ],
    },
  },
  WNBA: {
    // Live shape 2026-08-13: Pinnacle pick'em is 173.5; labeled main is 170.5.
    atl_con: {
      totalCurrent: { line: 170.5, overOdds: -118, underOdds: -110, isMain: true },
      totalLines: [
        { line: 168.5, overOdds: -120, underOdds: -110, fairBook: 'draftkings' },
        { line: 170.5, overOdds: -118, underOdds: -110, fairBook: 'betmgm', isMain: true },
        { line: 173.5, overOdds: -110, underOdds: -110, fairBook: 'pinnacle' },
      ],
    },
  },
};

const mil = mapLockedPickToCardFixture({
  key: '2026-08-13_MLB_mil_lad_total:under',
  sport: 'MLB',
  gameKey: 'mil_lad',
  marketType: 'total',
  side: 'under',
  team: 'Under 7.5',
  line: 7.5,
  odds: 122,
  units: 1,
  gameTime: commence,
  status: 'PENDING',
  away: 'Milwaukee Brewers',
  home: 'Los Angeles Dodgers',
}, { pinnacleHistory });

assert.equal(mil.ticketLine, 7.5);
assert.equal(mil.pickLabel, 'Under 7.5', 'hero is the ticket we lock');
assert.equal(mil.heroOdds, 122);
assert.equal(mil.playableLine, 8, 'book main still tracked as playable');
assert.match(mil.mainNowLabel || '', /main Under 8/);
assert.match(mil.mainNowLabel || '', /-103/);
assert.ok(!/9\.5/.test(mil.mainNowLabel || ''), `got ${mil.mainNowLabel}`);

const laa = mapLockedPickToCardFixture({
  key: '2026-08-13_MLB_tex_laa_spread:home',
  sport: 'MLB',
  gameKey: 'tex_laa',
  marketType: 'spread',
  side: 'home',
  team: 'Angels',
  line: 1.5,
  odds: -117,
  units: 1,
  gameTime: commence,
  status: 'PENDING',
  away: 'Texas Rangers',
  home: 'Los Angeles Angels',
}, { pinnacleHistory });

assert.equal(laa.ticketLine, 1.5);
assert.equal(laa.playableLine, 1.5, 'labeled run line 1.5, not +1 alt');
assert.ok(!laa.mainNowLabel, `ticket is already the run line, got ${laa.mainNowLabel}`);

const dodgers = mapLockedPickToCardFixture({
  key: '2026-08-13_MLB_mil_lad_spread:home',
  sport: 'MLB',
  gameKey: 'mil_lad',
  marketType: 'spread',
  side: 'home',
  team: 'Dodgers',
  line: -1.5,
  odds: 163,
  units: 1,
  gameTime: commence,
  status: 'PENDING',
  away: 'Milwaukee Brewers',
  home: 'Los Angeles Dodgers',
}, { pinnacleHistory });

assert.equal(dodgers.playableLine, -1.5, 'MLB run line is -1.5, not +1');
assert.ok(!dodgers.mainNowLabel, `got ${dodgers.mainNowLabel}`);

const atl = mapLockedPickToCardFixture({
  key: '2026-08-13_WNBA_atl_con_total:under',
  sport: 'WNBA',
  gameKey: 'atl_con',
  marketType: 'total',
  side: 'under',
  team: 'Under 168.5',
  line: 168.5,
  odds: -110,
  units: 1,
  gameTime: commence,
  status: 'PENDING',
  away: 'Atlanta Dream',
  home: 'Connecticut Sun',
}, { pinnacleHistory });

assert.equal(atl.playableLine, 170.5, 'labeled total, not Pinnacle pick-em 173.5');
assert.equal(atl.pickLabel, 'Under 168.5', 'hero is the ticket');
assert.match(atl.mainNowLabel || '', /main Under 170\.5/);
assert.ok(!/173\.5/.test(atl.pickLabel || ''), `got ${atl.pickLabel}`);

// Frozen: last pre-T-15 board / isMain, not live totalCurrent.
const freezeCommence = Date.now() - (30 * 60 * 1000);
const freezeAt = freezeCommence - (15 * 60 * 1000);
const tPre = Math.floor((freezeAt - 60_000) / 1000);
const tPost = Math.floor((freezeAt + 60_000) / 1000);
const frozenHist = {
  MLB: {
    was_lva: {
      totalHistory: [
        { t: tPre, line: 170.5, overOdds: -110, underOdds: -110, max: 2000, isMain: true },
        { t: tPre, line: 169.5, overOdds: -105, underOdds: 113, max: 2000 },
        { t: tPre, line: 172, overOdds: 112, underOdds: -132, max: 2000 },
        { t: tPost, line: 173.5, overOdds: -110, underOdds: -110, max: 2000, isMain: true },
      ],
      totalCurrent: { line: 173.5, overOdds: -110, underOdds: -110, max: 2000 },
      totalLines: [
        { line: 173.5, overOdds: -110, underOdds: -110, max: 2000, isMain: true },
      ],
    },
  },
};
const was = mapLockedPickToCardFixture({
  key: '2026-08-13_MLB_was_lva_total:under',
  sport: 'MLB',
  gameKey: 'was_lva',
  marketType: 'total',
  side: 'under',
  team: 'Under 169.5',
  line: 169.5,
  odds: 113,
  units: 1,
  gameTime: freezeCommence,
  status: 'PENDING',
  away: 'Washington Nationals',
  home: 'Las Vegas Aces',
}, { pinnacleHistory: frozenHist });

assert.equal(was.playableLine, 170.5, 'frozen main is last pre-T-15 isMain, not live 173.5');
assert.equal(was.pickLabel, 'Under 169.5', 'locked hero stays the stamped ticket');
assert.equal(was.ticketLine, 169.5);
assert.match(was.mainNowLabel || '', /main Under 170\.5/);
assert.ok(!/173\.5/.test(was.pickLabel || ''), `got ${was.pickLabel}`);

const fever = mapLockedPickToCardFixture({
  key: '2026-08-16_WNBA_ind_atl:away',
  sport: 'WNBA',
  gameKey: 'ind_atl',
  marketType: 'ml',
  side: 'away',
  team: 'Indiana Fever',
  odds: 223,
  units: 1.5,
  gameTime: commence,
  status: 'PENDING',
  away: 'Indiana Fever',
  home: 'Atlanta Dream',
  vaultPositions: [
    { side: 'away', avgPrice: 0.45, invested: 562, slug: 'wnba-ind-atl-2026-08-16' },
    { side: 'away', avgPrice: 0.31, invested: 260, slug: 'canpl-sup-ott-2026-08-16-ott' },
    { side: 'away', avgPrice: 0.45, invested: 108, slug: 'wnba-ind-atl-2026-08-16' },
    { side: 'away', avgPrice: 0.15, invested: 59, slug: 'mex-ame-asl-2026-08-16-asl' },
  ],
}, {
  pinnacleHistory: {
    WNBA: {
      ind_atl: {
        opener: { away: 118, home: -144 },
        current: { away: 110, home: -130 },
        history: [
          { t, away: 118, home: -144 },
          { t, away: 110, home: -130 },
        ],
      },
    },
  },
});
assert.equal(fever.pickLabel, 'Fever ML');
assert.equal(fever.heroOdds, 110, 'hero is book NOW, not vault +223');
assert.equal(fever.lockOdds, 122, 'flagged is majority Poly, not soccer mix');
assert.match(fever.mainNowLabel || '', /flagged at \+122/);

const cards = mapLockedPickToCardFixture({
  key: '2026-08-16_MLB_stl_chc:away',
  sport: 'MLB',
  gameKey: 'stl_chc',
  marketType: 'ml',
  side: 'away',
  team: 'St. Louis Cardinals',
  odds: 156,
  units: 1,
  gameTime: commence,
  status: 'PENDING',
  away: 'St. Louis Cardinals',
  home: 'Chicago Cubs',
  vaultPositions: [
    { side: 'away', avgPrice: 0.391, invested: 200, slug: 'mlb-stl-chc-2026-08-16' },
  ],
}, {
  pinnacleHistory: {
    MLB: {
      stl_chc: {
        opener: { away: 139, home: -164 },
        current: { away: 159, home: -185 },
        history: [
          { t, away: 139, home: -164 },
          { t, away: 159, home: -185 },
        ],
      },
    },
  },
});
assert.equal(cards.pickLabel, 'Cardinals ML');
assert.equal(cards.heroOdds, 159, 'ML hero is NOW even when juice is close');
assert.match(cards.mainNowLabel || '', /flagged at \+156/);

// Cubs @ Mariners: vault locked SEA +1.5 −170. Book main later flipped to
// SEA −1.5 +180. Hero must stay the ticket we grade — never the opposite run line.
const seaBoard = {
  MLB: {
    chc_sea: {
      spreadCurrent: {
        homeLine: -1.5, awayLine: 1.5, homeOdds: 180, awayOdds: -205, max: 4000, isMain: true,
      },
      spreadLines: [
        { homeLine: -1.5, awayLine: 1.5, homeOdds: 180, awayOdds: -205, max: 4000, isMain: true },
        { homeLine: 1.5, awayLine: -1.5, homeOdds: -170, awayOdds: 150, max: 2500 },
      ],
      spreadHistory: [
        { t, homeLine: 1.5, awayLine: -1.5, homeOdds: -170, awayOdds: 150, max: 2500 },
        { t, homeLine: -1.5, awayLine: 1.5, homeOdds: 180, awayOdds: -205, max: 4000, isMain: true },
      ],
    },
  },
};
const seaPick = {
  key: '2026-08-22_MLB_chc_sea_spread:home',
  sport: 'MLB',
  gameKey: 'chc_sea',
  marketType: 'spread',
  side: 'home',
  team: 'Seattle Mariners',
  line: 1.5,
  odds: -170,
  units: 1,
  status: 'PENDING',
  away: 'Chicago Cubs',
  home: 'Seattle Mariners',
};
const seaLive = mapLockedPickToCardFixture({
  ...seaPick,
  gameTime: commence,
}, { pinnacleHistory: seaBoard });
assert.equal(seaLive.ticketLine, 1.5);
assert.equal(seaLive.playableLine, -1.5);
assert.equal(seaLive.pickLabel, 'Mariners +1.5', 'sign flip must not become the hero');
assert.equal(seaLive.heroOdds, -170);
assert.match(seaLive.mainNowLabel || '', /main Mariners -1\.5/);
assert.match(seaLive.mainNowLabel || '', /\+180/);

const seaLocked = mapLockedPickToCardFixture({
  ...seaPick,
  gameTime: Date.now() - (30 * 60 * 1000),
  status: 'COMPLETED',
  outcome: 'WIN',
  profit: 0.59,
}, { pinnacleHistory: seaBoard });
assert.equal(seaLocked.pickLabel, 'Mariners +1.5', 'graded hero matches the ticket');
assert.equal(seaLocked.heroOdds, -170);
assert.equal(seaLocked.ticketLine, 1.5);

const cin = mapLockedPickToCardFixture({
  key: '2026-08-23_MLB_cin_ari_total:under',
  sport: 'MLB',
  gameKey: 'cin_ari',
  marketType: 'total',
  side: 'under',
  team: 'Under 10.5',
  line: 10.5,
  odds: -186,
  units: 1,
  gameTime: commence,
  status: 'PENDING',
  away: 'Cincinnati Reds',
  home: 'Arizona Diamondbacks',
}, {
  pinnacleHistory: {
    MLB: {
      cin_ari: {
        totalCurrent: { line: 8.5, overOdds: -119, underOdds: 106, isMain: true },
        totalLines: [
          { line: 8.5, overOdds: -119, underOdds: 106, isMain: true },
          { line: 10.5, overOdds: 155, underOdds: -186 },
        ],
      },
    },
  },
});
assert.equal(cin.pickLabel, 'Under 10.5');
assert.equal(cin.heroOdds, -186);
assert.match(cin.mainNowLabel || '', /main Under 8\.5/);
assert.match(cin.mainNowLabel || '', /\+106/);

console.log('testMainNowPlayable: ok');

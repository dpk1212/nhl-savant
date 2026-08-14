/**
 * "Main now" = pick'em on the current board, not last alt / stale totalCurrent.
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
      // Stale stamp — highest alt. Board pick'em must win.
      totalCurrent: { line: 9.5, overOdds: 172, underOdds: -212, max: 1875 },
      totalLines: [
        { line: 6.5, overOdds: -204, underOdds: 166, max: 1875 },
        { line: 7.5, overOdds: -121, underOdds: 104, max: 1875 },
        { line: 8, overOdds: -109, underOdds: -103, max: 1875 },
        { line: 8.5, overOdds: 114, underOdds: -133, max: 1875 },
        { line: 9, overOdds: 147, underOdds: -175, max: 1875 },
        { line: 9.5, overOdds: 172, underOdds: -212, max: 1875 },
      ],
    },
    tex_laa: {
      spreadHistory: [
        { t, homeLine: 1, awayLine: -1, homeOdds: 100, awayOdds: -112, max: 10000 },
        { t, homeLine: 1.5, awayLine: -1.5, homeOdds: -117, awayOdds: 102, max: 10000 },
        { t, homeLine: 3, awayLine: -3, homeOdds: -325, awayOdds: 265, max: 10000 },
      ],
      spreadCurrent: { homeLine: 1, awayLine: -1, homeOdds: 100, awayOdds: -112, max: 10000 },
      spreadLines: [
        { homeLine: 1, awayLine: -1, homeOdds: 100, awayOdds: -112, max: 10000 },
        { homeLine: 1.5, awayLine: -1.5, homeOdds: -117, awayOdds: 102, max: 10000 },
        { homeLine: 3, awayLine: -3, homeOdds: -325, awayOdds: 265, max: 10000 },
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
assert.equal(mil.pickLabel, 'Under 7.5');
assert.equal(mil.playableLine, 8, 'main is pick-em 8, not stale 9.5');
assert.match(mil.mainNowLabel || '', /Main now Under 8/);
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
assert.equal(laa.playableLine, 1, 'main is +1, not last hist alt +3');
assert.match(laa.mainNowLabel || '', /Main now Angels \+1/);
assert.match(laa.mainNowLabel || '', /\+100/);
assert.ok(!/-325/.test(laa.mainNowLabel || ''), `got ${laa.mainNowLabel}`);

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
assert.match(was.mainNowLabel || '', /Main now Under 170\.5/);
assert.ok(!/173\.5/.test(was.mainNowLabel || ''), `got ${was.mainNowLabel}`);

console.log('testMainNowPlayable: ok');

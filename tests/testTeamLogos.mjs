/**
 * Crest URLs for both sides of a ticket, including college and soccer.
 * Usage: node tests/testTeamLogos.mjs
 */
import assert from 'node:assert/strict';
import { teamLogoUrl } from '../src/utils/teamIdentity.js';
import { logoForTeam } from '../src/utils/teamLogoIndex.js';

assert.match(teamLogoUrl('Panthers', 'NFL'), /teamlogos\/nfl\/500(-dark)?\/car\.png$/);
assert.match(teamLogoUrl('Packers', 'NFL'), /\/gb\.png$/);
assert.match(teamLogoUrl('Grizzlies', 'NBA'), /\/mem\.png$/);
assert.match(teamLogoUrl('Michigan Wolverines', 'CFB'), /teamlogos\/ncaa\/500/);
assert.match(teamLogoUrl('Duke', 'CBB'), /teamlogos\/ncaa\/500/);
assert.match(teamLogoUrl('Aces', 'WNBA'), /teamlogos\/wnba\/500/);
assert.match(teamLogoUrl('Manchester United', 'SOC'), /teamlogos\/soccer\/500/);
assert.match(teamLogoUrl('Eternal Fire', 'CS2'), /^https:\/\/r2\.thesportsdb\.com\//);
assert.match(teamLogoUrl('Astralis', 'CS2'), /^https:\/\/r2\.thesportsdb\.com\//);
assert.equal(logoForTeam('Over', 'NFL'), null);
assert.equal(teamLogoUrl('Not A Real Club', 'CS2'), null);

console.log('testTeamLogos: ok');

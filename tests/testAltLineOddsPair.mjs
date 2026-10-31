/**
 * Inverted-sign alt: vault Poly JSU +4.5 (KSU −4.5 token) vs book MAIN JSU −3.
 * Books do not quote JSU +4.5. Hero line stays the vault alt; juice must
 * not be MAIN +101 glued onto +4.5, and flagged −3 must carry book juice.
 *
 * Same-line alts (chi_ten) and one-wallet alts (Liberty −3.5) stay put.
 * Usage: node tests/testAltLineOddsPair.mjs
 */
import assert from 'node:assert/strict';
import { repairCrossedLineOdds, americanFromPolyPrice } from '../src/lib/ticketInstrument.js';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

assert.equal(americanFromPolyPrice(0.736), -279);

// Unit: crossed JSU pair uncrosses. Hero line does not flip.
{
  const r = repairCrossedLineOdds({
    heroLine: 4.5,
    heroOdds: 101,
    mainLine: -3,
    mainOdds: 100,
    vaultLine: 4.5,
    vaultOdds: -279,
    sameLineBookOdds: null,
    flaggedLine: -3,
    flaggedOdds: -279,
  });
  assert.equal(r.heroLine, 4.5, 'one-wallet alt keeps +4.5');
  assert.equal(r.heroOdds, -279, 'hero juice is vault Poly, not MAIN +101');
  assert.equal(r.flaggedLine, -3);
  assert.equal(r.flaggedOdds, 100, 'flagged −3 carries book MAIN, not Poly −279');
  assert.equal(r.repaired, true);
}

// Unit: same-line book alt (chi_ten) is left alone.
{
  const r = repairCrossedLineOdds({
    heroLine: 2.5,
    heroOdds: -108,
    mainLine: 1,
    mainOdds: -112,
    vaultLine: 2.5,
    vaultOdds: 110,
    sameLineBookOdds: -108,
    flaggedLine: null,
    flaggedOdds: null,
  });
  assert.equal(r.heroLine, 2.5);
  assert.equal(r.heroOdds, -108);
  assert.equal(r.repaired, false);
}

// Unit: MAIN ticket is left alone.
{
  const r = repairCrossedLineOdds({
    heroLine: -3,
    heroOdds: 100,
    mainLine: -3,
    mainOdds: 100,
    vaultLine: -3,
    vaultOdds: -279,
    sameLineBookOdds: 100,
    flaggedLine: null,
    flaggedOdds: null,
  });
  assert.equal(r.heroOdds, 100);
  assert.equal(r.repaired, false);
}

const commence = Date.now() + (5 * 60 * 60 * 1000);
const jsuVault = [
  {
    wallet: '0xfamily1',
    side: 'away',
    outcome: 'Jacksonville State',
    title: 'Spread: Kennesaw State (-4.5)',
    entryLine: -4.5,
    avgPrice: 0.736,
    invested: 2000,
    size: 2717,
    tier: 'ELITE',
  },
];
const jsuPinn = {
  CFB: {
    jvst_kenn: {
      commence: new Date(commence).toISOString(),
      awayTeam: 'Jacksonville State',
      homeTeam: 'Kennesaw State',
      spreadCurrent: {
        awayLine: -3, homeLine: 3, awayOdds: 100, homeOdds: -112, isMain: true,
      },
      spreadHistory: [
        {
          t: Math.floor((commence - 8 * 3600_000) / 1000),
          awayLine: -3, awayOdds: 100, homeLine: 3, homeOdds: -112, isMain: true,
        },
        {
          t: Math.floor((commence - 2 * 3600_000) / 1000),
          awayLine: -2.5, awayOdds: -105, homeLine: 2.5, homeOdds: -115,
        },
        {
          t: Math.floor((commence - 1 * 3600_000) / 1000),
          awayLine: -3.5, awayOdds: 105, homeLine: 3.5, homeOdds: -125,
        },
      ],
      spreadLines: [
        { awayLine: -1, homeLine: 1, awayOdds: -120, homeOdds: 100 },
        { awayLine: -2.5, homeLine: 2.5, awayOdds: -105, homeOdds: -115 },
        { awayLine: -3, homeLine: 3, awayOdds: 100, homeOdds: -112, isMain: true },
        { awayLine: -3.5, homeLine: 3.5, awayOdds: 105, homeOdds: -125 },
        { awayLine: -4.5, homeLine: 4.5, awayOdds: 120, homeOdds: -140 },
      ],
    },
  },
};

const crossed = mapLockedPickToCardFixture({
  key: '2026-10-07_CFB_jvst_kenn_spread:away',
  sport: 'CFB',
  gameKey: 'jvst_kenn',
  marketType: 'spread',
  side: 'away',
  pickSide: 'away',
  team: 'Jacksonville State',
  line: 4.5,
  odds: 101,
  units: 0,
  book: 'Polymarket',
  oddsSource: 'poly_avgPrice',
  lockPinnOdds: 101,
  pinnacleOdds: 101,
  flaggedLine: -3,
  flaggedOdds: -279,
  polyReceipt: -279,
  gameTime: commence,
  lockedAt: commence - 8 * 3600_000,
  status: 'PENDING',
  away: 'Jacksonville State',
  home: 'Kennesaw State',
  vaultPositions: jsuVault,
}, {
  pinnacleHistory: jsuPinn,
  spreadPositions: { CFB: { jvst_kenn: { positions: jsuVault } } },
});

assert.match(crossed.pickLabel, /Jacksonville State \+4\.5/, crossed.pickLabel);
assert.equal(crossed.heroOdds, -279, `hero juice is Poly −279, got ${crossed.heroOdds}`);
assert.ok(
  Number.isFinite(crossed.heroOdds) && crossed.heroOdds !== 101 && crossed.heroOdds !== 100,
  `must not glue MAIN +100/+101 onto +4.5, got ${crossed.heroOdds}`,
);
assert.match(
  String(crossed.mainNowLabel || crossed.flaggedAtLabel || ''),
  /flagged at Jacksonville State −3 · \+100|flagged at Jacksonville State -3 · \+100/,
  `flagged must be book MAIN −3 +100, got ${crossed.mainNowLabel || crossed.flaggedAtLabel}`,
);
assert.ok(
  !String(crossed.mainNowLabel || '').includes('-279'),
  `flagged must not carry Poly −279 on MAIN −3, got ${crossed.mainNowLabel}`,
);

// Two wallets on the side: existing multi-wallet path keeps book MAIN.
const twoWallet = [
  ...jsuVault,
  {
    wallet: '0xclicker',
    side: 'away',
    outcome: 'Jacksonville State',
    title: 'Spread: Jacksonville State (-2.5)',
    entryLine: -2.5,
    avgPrice: 0.53,
    invested: 400,
    size: 755,
  },
];
const mainCard = mapLockedPickToCardFixture({
  key: '2026-10-07_CFB_jvst_kenn_spread:away:multi',
  sport: 'CFB',
  gameKey: 'jvst_kenn',
  marketType: 'spread',
  side: 'away',
  pickSide: 'away',
  team: 'Jacksonville State',
  line: -3,
  odds: 100,
  units: 0,
  book: 'Pinnacle',
  oddsSource: 'pinnacle',
  lockPinnOdds: 100,
  pinnacleOdds: 100,
  gameTime: commence,
  status: 'PENDING',
  away: 'Jacksonville State',
  home: 'Kennesaw State',
  vaultPositions: twoWallet,
}, {
  pinnacleHistory: jsuPinn,
  spreadPositions: { CFB: { jvst_kenn: { positions: twoWallet } } },
});
assert.match(mainCard.pickLabel, /Jacksonville State -3/, mainCard.pickLabel);
assert.equal(mainCard.heroOdds, 100, `two-wallet hero stays MAIN +100, got ${mainCard.heroOdds}`);

console.log('testAltLineOddsPair: ok');

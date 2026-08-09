/**
 * Spread side + entryLine — alt market / wrong-team regression.
 * Usage: node tests/testResolveSpreadSide.mjs
 */
import assert from 'assert';
import {
  resolveSpreadSide,
  resolveSpreadEntryLine,
} from '../scripts/lib/resolvePositionSide.js';

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed++;
}

const away = 'Cleveland Guardians';
const home = 'Chicago White Sox';
const mainPoly = {
  line: -1.5,
  title: 'Spread -1.5',
  outcomes: ['Chicago White Sox', 'Cleveland Guardians'], // NOT this position's market order
};

// CLE@CWS 2026-08-09 — away-1.5 market; old idx0+mainPoly → home (WRONG)
{
  const r = resolveSpreadSide({
    title: 'Spread: Cleveland Guardians (-1.5)',
    outcome: 'Cleveland Guardians',
    outcomeIndex: 0,
    awayName: away,
    homeName: home,
    marketOutcomes: mainPoly.outcomes,
  });
  ok(r.side === 'away', `Guardians position → away (got ${r.side} via ${r.source})`);
  ok(r.source === 'outcome', `source=outcome (got ${r.source})`);

  const line = resolveSpreadEntryLine({
    title: 'Spread: Cleveland Guardians (-1.5)',
    outcome: 'Cleveland Guardians',
    outcomeIndex: 0,
    side: r.side,
    awayName: away,
    homeName: home,
    polySpread: mainPoly,
  });
  ok(line === -1.5, `Guardians -1.5 entryLine (got ${line})`);
}

// Other side of titled market: "Spread: Phillies (-1.5)" holding Blue Jays
{
  const a = 'Toronto Blue Jays';
  const h = 'Philadelphia Phillies';
  const r = resolveSpreadSide({
    title: 'Spread: Philadelphia Phillies (-1.5)',
    outcome: 'Toronto Blue Jays',
    outcomeIndex: 1,
    awayName: a,
    homeName: h,
    marketOutcomes: ['Philadelphia Phillies', 'Toronto Blue Jays'],
  });
  ok(r.side === 'away', `Jays token → away (got ${r.side})`);
  const line = resolveSpreadEntryLine({
    title: 'Spread: Philadelphia Phillies (-1.5)',
    outcome: 'Toronto Blue Jays',
    side: 'away',
    awayName: a,
    homeName: h,
    polySpread: { line: -1.5, outcomes: ['Philadelphia Phillies', 'Toronto Blue Jays'] },
  });
  ok(line === 1.5, `Jays +1.5 on Phillies -1.5 market (got ${line})`);
}

// Mets -1.5 mislabeled as home via main poly [Pirates, Mets] idx0
{
  const a = 'New York Mets';
  const h = 'Pittsburgh Pirates';
  const r = resolveSpreadSide({
    title: 'Spread: New York Mets (-1.5)',
    outcome: 'New York Mets',
    outcomeIndex: 0,
    awayName: a,
    homeName: h,
    marketOutcomes: ['Pittsburgh Pirates', 'New York Mets'],
  });
  ok(r.side === 'away', `Mets → away not home (got ${r.side})`);
}

console.log(`OK ${passed} assertions`);

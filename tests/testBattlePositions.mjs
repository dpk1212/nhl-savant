import assert from 'assert';
import { selectBattlePositions } from '../src/lib/battlePositions.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

const nhl = [
  { wallet: '0xaaa', side: 'away', invested: 75 },
  { wallet: '0xbbb', side: 'home', invested: 247 },
];
const thin = selectBattlePositions(nhl);
ok(thin.length === 2, 'thin NHL slate still plots');
ok(thin.reduce((s, p) => s + p.invested, 0) === 322, 'thin slate keeps the real dollars');

const mixed = selectBattlePositions([
  { wallet: '0xaaa', side: 'away', invested: 80 },
  { wallet: '0xccc', side: 'home', invested: 4000 },
]);
ok(mixed.length === 1 && mixed[0].invested === 4000, 'floor still hides dust when a real ticket exists');

ok(selectBattlePositions([]).length === 0, 'empty game plots nothing');
ok(selectBattlePositions([{ wallet: '0xaaa', side: 'away', invested: 500 }], { excluded: new Set(['0xaaa']) }).length === 0, 'excluded wallet stays out');

const dup = selectBattlePositions([
  { wallet: '0xAAA', side: 'away', invested: 90 },
  { wallet: '0xaaa', side: 'away', invested: 140 },
]);
ok(dup.length === 1 && dup[0].invested === 140, 'same wallet+side keeps the larger ticket');

console.log(`ok ${n}`);

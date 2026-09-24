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
ok(selectBattlePositions(nhl).length === 0, 'under the floor stays off the field');

const mixed = selectBattlePositions([
  { wallet: '0xaaa', side: 'away', invested: 80 },
  { wallet: '0xccc', side: 'home', invested: 4000 },
]);
ok(mixed.length === 1 && mixed[0].invested === 4000, 'a ticket at the floor plots, dust does not');

ok(selectBattlePositions([]).length === 0, 'empty game plots nothing');
ok(selectBattlePositions([{ wallet: '0xaaa', side: 'away', invested: 500 }], { excluded: new Set(['0xaaa']) }).length === 0, 'excluded wallet stays out');
ok(selectBattlePositions([{ wallet: '0xaaa', side: 'away', invested: 250 }]).length === 1, 'exactly the floor counts');

const dup = selectBattlePositions([
  { wallet: '0xAAA', side: 'away', invested: 300 },
  { wallet: '0xaaa', side: 'away', invested: 900 },
]);
ok(dup.length === 1 && dup[0].invested === 900, 'same wallet+side keeps the larger ticket');

console.log(`ok ${n}`);

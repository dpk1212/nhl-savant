/**
 * Wallets to plot on an Alpha Field game chip.
 * Prefer tickets at or above the floor. When every tracked ticket on a thin
 * market (NHL preseason) is under the floor, plot those instead of a $0 chip.
 */
export function selectBattlePositions(positions, { minInvested = 250, excluded } = {}) {
  const big = [];
  const small = [];
  for (const pos of positions || []) {
    const wallet = pos?.wallet?.toLowerCase();
    if (!wallet || !pos.side) continue;
    if (excluded?.has(wallet)) continue;
    const invested = pos.invested || 0;
    if (invested <= 0) continue;
    if (invested < minInvested) small.push(pos);
    else big.push(pos);
  }
  const pool = big.length ? big : small;
  const seen = new Map();
  for (const pos of pool) {
    const key = `${pos.wallet.toLowerCase()}|${pos.side}`;
    const cur = seen.get(key);
    if (!cur || (pos.invested || 0) > (cur.invested || 0)) seen.set(key, pos);
  }
  return [...seen.values()];
}

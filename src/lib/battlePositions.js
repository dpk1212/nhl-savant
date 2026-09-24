/**
 * Wallets to plot on an Alpha Field game chip.
 * The floor is absolute: a ticket under it is not on the field. A game whose
 * tickets are all under the floor returns nothing, so the chip is omitted
 * instead of rendering as $0.
 */
export function selectBattlePositions(positions, { minInvested = 250, excluded } = {}) {
  const seen = new Map();
  for (const pos of positions || []) {
    const wallet = pos?.wallet?.toLowerCase();
    if (!wallet || !pos.side) continue;
    if (excluded?.has(wallet)) continue;
    const invested = pos.invested || 0;
    if (invested < minInvested) continue;
    const key = `${wallet}|${pos.side}`;
    const cur = seen.get(key);
    if (!cur || invested > (cur.invested || 0)) seen.set(key, pos);
  }
  return [...seen.values()];
}

/**
 * A closed Polymarket match moneyline. Map winners and set winners are
 * not this market. One outcome at 1 and the rest at 0 is a settlement.
 * Anything in between is still trading, or a void, and stays ungraded.
 */

function asList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Closed match moneyline.
 * { winner } when one outcome paid 1 and the rest paid 0.
 * { voided: true } when every outcome paid 0.5 (a cancelled match).
 * null while the market is still trading.
 * The event can stay open after the match moneyline has already paid
 * (map and total markets still trade), so the moneyline's own close is the gate.
 */
export function settledMoneyline(event) {
  if (!event) return null;
  const markets = Array.isArray(event.markets) ? event.markets : [];
  const ml = markets.find((m) => String(m?.sportsMarketType || '').toLowerCase() === 'moneyline' && (m.closed === true || m.closed === 'true'));
  if (!ml) return null;
  const outcomes = asList(ml.outcomes).map((name) => String(name || '').trim());
  const prices = asList(ml.outcomePrices).map((price) => Number(price));
  if (outcomes.length < 2 || outcomes.length !== prices.length) return null;
  if (outcomes.some((name) => !name) || prices.some((price) => !Number.isFinite(price))) return null;
  const winners = outcomes.filter((name, i) => prices[i] >= 0.99);
  const losers = outcomes.filter((name, i) => prices[i] <= 0.01);
  if (winners.length === 1 && losers.length === outcomes.length - 1) return { winner: winners[0] };
  if (prices.every((price) => Math.abs(price - 0.5) < 0.001)) return { voided: true };
  return null;
}

export function settledMoneylineWinner(event) {
  return settledMoneyline(event)?.winner || null;
}

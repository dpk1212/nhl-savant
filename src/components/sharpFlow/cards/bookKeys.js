/** Prediction-market / exchange books (Odds API `us_ex`). Not retail "best". */
export const EXCHANGE_BOOK_KEYS = ['novig', 'polymarket', 'kalshi'];

export function shopBookKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

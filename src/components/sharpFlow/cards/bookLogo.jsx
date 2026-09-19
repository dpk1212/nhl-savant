/**
 * Official sportsbook marks for the shop strip.
 * Files live in public/books/ — Cipher SVG app icons where we have them,
 * App Store / site icons otherwise. No letter-mark fallbacks for known books.
 */
export function shopBookKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Prediction-market / exchange books (Odds API `us_ex`). Not retail "best". */
export const EXCHANGE_BOOK_KEYS = ['novig', 'polymarket', 'kalshi'];

/** Unique brands with a real mark on disk. Aliases (circasports, hardrockbet) share a file. */
export const BOOK_LOGO_BRANDS = [
  'FanDuel',
  'DraftKings',
  'BetMGM',
  'Caesars',
  'Fanatics',
  'Circa',
  'BetOnline',
  'Bookmaker',
  'Pinnacle',
  'BetRivers',
  'bet365',
  'Hard Rock',
  'PointsBet',
  'Polymarket',
  'Kalshi',
  'Novig',
  'Betfair',
  'Matchbook',
];

const FILES = {
  fanduel: '/books/fanduel.svg',
  draftkings: '/books/draftkings.svg',
  betmgm: '/books/betmgm.svg',
  caesars: '/books/caesars.svg',
  fanatics: '/books/fanatics.png',
  circa: '/books/circa.png',
  circasports: '/books/circa.png',
  betonlineag: '/books/betonlineag.png',
  betonline: '/books/betonlineag.png',
  bookmaker: '/books/bookmaker.png',
  pinnacle: '/books/pinnacle.png',
  betrivers: '/books/betrivers.svg',
  bet365: '/books/bet365.svg',
  hardrock: '/books/hardrock.png',
  hardrockbet: '/books/hardrock.png',
  pointsbet: '/books/pointsbet.svg',
  polymarket: '/books/polymarket.png',
  kalshi: '/books/kalshi.png',
  novig: '/books/novig.png',
  betfair: '/books/betfair.svg',
  betfairexeu: '/books/betfair.svg',
  betfairexuk: '/books/betfair.svg',
  betfairexchange: '/books/betfair.svg',
  matchbook: '/books/matchbook.svg',
};

function resolveId(name) {
  const k = shopBookKey(name);
  if (FILES[k]) return k;
  if (k.includes('fanduel') || (k.startsWith('fan') && k.includes('duel'))) return 'fanduel';
  if (k.includes('draftking') || k === 'dk') return 'draftkings';
  if (k.includes('mgm')) return 'betmgm';
  if (k.includes('caesar') || k.includes('williamhill') || k === 'czr') return 'caesars';
  if (k.includes('fanatic')) return 'fanatics';
  if (k.includes('circa')) return 'circa';
  if (k.includes('online') || k === 'bol') return 'betonlineag';
  if (k.includes('bookmaker') || k === 'bm') return 'bookmaker';
  if (k.includes('pinn')) return 'pinnacle';
  if (k.includes('river')) return 'betrivers';
  if (k.includes('365')) return 'bet365';
  if (k.includes('hardrock')) return 'hardrock';
  if (k.includes('pointsbet') || k === 'pb') return 'pointsbet';
  if (k.includes('poly')) return 'polymarket';
  if (k.includes('kalshi')) return 'kalshi';
  if (k.includes('novig')) return 'novig';
  if (k.includes('betfair')) return 'betfair';
  if (k.includes('matchbook')) return 'matchbook';
  if (k.includes('lowvig') || k === 'lv') return null;
  return null;
}

export function bookLogoSrc(name) {
  const id = resolveId(name);
  return id ? FILES[id] : null;
}

export function BookLogo({ name, size = 22 }) {
  const src = bookLogoSrc(name);
  const dim = { width: size, height: size, display: 'block', objectFit: 'cover', borderRadius: Math.round(size * 0.22) };
  if (src) {
    return <img src={src} alt="" width={size} height={size} draggable={false} style={dim} />;
  }
  const letter = String(name || '?').replace(/[^a-zA-Z]/g, '').slice(0, 1).toUpperCase() || '?';
  return (
    <span
      aria-hidden="true"
      style={{
        ...dim,
        background: '#1E293B',
        color: '#E2E8F0',
        fontSize: Math.round(size * 0.46),
        fontWeight: 700,
        lineHeight: `${size}px`,
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {letter}
    </span>
  );
}

/**
 * Locked hero juice: best available book + logo + implied %, then green
 * EV vs Pinnacle-heavy sharp consensus when that book beats it.
 */
import { fmtAmericanWithPm } from '../../../lib/oddsEv.js';
import { resolveHeroShop } from '../../../lib/shopTicketLine.js';
import { BookLogo } from './bookLogo.jsx';

function fmtAmericanOnly(o) {
  const n = Number(o);
  if (!Number.isFinite(n) || n === 0) return '—';
  return n > 0 ? `+${n}` : `${n}`;
}

const GREEN = '#2fd57e';

export default function HeroShopPrice({
  bestOdds,
  bestBook,
  books,
  fallbackOdds,
  americanOnly = false,
  logoSize = 18,
  fontSize = '1.12rem',
}) {
  const { odds, book, evPct } = resolveHeroShop({
    bestOdds, bestBook, books, fallbackOdds,
  });
  if (!Number.isFinite(odds)) return null;
  const priceLabel = americanOnly ? fmtAmericanOnly(odds) : fmtAmericanWithPm(odds);
  const evLabel = Number.isFinite(evPct) ? `+${evPct.toFixed(1)}%` : null;
  const tip = [
    book ? `Best available · ${book}` : 'Best available',
    evLabel ? `${evLabel} vs sharp consensus` : null,
  ].filter(Boolean).join(' · ');

  return (
    <span
      title={tip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize,
        fontWeight: 550,
        letterSpacing: '-0.02em',
        color: '#9aa6bd',
        lineHeight: 1.05,
        fontFeatureSettings: "'tnum'",
      }}
    >
      {book ? (
        <span style={{
          width: logoSize, height: logoSize, borderRadius: 4, overflow: 'hidden',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <BookLogo name={book} size={logoSize} />
        </span>
      ) : null}
      <span>{priceLabel}</span>
      {evLabel ? (
        <span style={{
          color: GREEN, fontWeight: 750, letterSpacing: '-0.03em',
        }}>
          {evLabel}
        </span>
      ) : null}
    </span>
  );
}

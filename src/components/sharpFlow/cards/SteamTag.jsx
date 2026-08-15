/**
 * Compact steam pill — sits next to pick / odds on Locked + Action cards.
 */
const GOLD = '#D4AF37';
const GOLD_HI = '#E8D28A';
const GREEN = '#10B981';

export default function SteamTag({ steam, compact = false }) {
  if (!steam?.show || !steam.tag) return null;
  const gold = steam.tier === 'gold';
  const color = gold ? GOLD_HI : GREEN;
  const border = gold ? 'rgba(212,175,55,0.45)' : 'rgba(16,185,129,0.35)';
  const bg = gold
    ? 'linear-gradient(180deg, rgba(232,210,138,0.18) 0%, rgba(212,175,55,0.08) 100%)'
    : 'rgba(16,185,129,0.10)';

  return (
    <span
      title={steam.tip || 'Pinnacle steam'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? 3 : 4,
        fontSize: compact ? 9 : 10,
        fontWeight: 800,
        letterSpacing: '0.04em',
        padding: compact ? '2px 6px' : '3px 7px',
        borderRadius: 5,
        color,
        background: bg,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
        fontFeatureSettings: "'tnum'",
        lineHeight: 1.15,
        boxShadow: gold ? `0 0 0 1px rgba(212,175,55,0.12)` : 'none',
      }}
    >
      <span style={{ color: gold ? GOLD : GREEN, fontSize: compact ? 8 : 9, fontWeight: 900 }}>
        ⚡
      </span>
      {steam.tag}
    </span>
  );
}

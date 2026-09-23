import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { isMySharpShort } from '../../lib/mySharps.js';
import { B, T } from './vaultTheme';

const GOLD_HI = '#F3E3AC';

/**
 * Add / remove a vault wallet from My Sharps.
 * Hidden until the account can save, unless this wallet is already on the list.
 */
export default function MySharpToggle({
  mySharps,
  wallet,
  walletShort,
  sport = null,
  compact = false,
}) {
  const [note, setNote] = useState('');
  const id = walletShort || wallet;
  const saved = isMySharpShort(mySharps?.shorts, id);
  const show = !!(mySharps?.onToggle && id && (saved || mySharps.ready));
  if (!show) return null;

  const blocked = !saved && !!mySharps.atCap;
  const label = saved
    ? 'Remove from My Sharps'
    : (blocked ? 'My Sharps is full' : 'Add to My Sharps');
  const aria = saved
    ? 'Remove from My Sharps'
    : (blocked ? 'My Sharps is full' : 'Add to My Sharps');

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        disabled={blocked}
        aria-label={aria}
        title={aria}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (blocked || !mySharps?.onToggle) return;
          const res = await mySharps.onToggle({
            walletShort: id,
            wallet: wallet || null,
            sport: sport || null,
          });
          if (res?.reason === 'cap') setNote('My Sharps is full');
          else if (res?.reason === 'auth') setNote('Sign in to save a sharp');
          else setNote('');
        }}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: compact ? '0.28rem 0.55rem' : '0.4rem 0.75rem',
          borderRadius: 999, cursor: blocked ? 'default' : 'pointer',
          fontFamily: 'inherit',
          fontSize: compact ? '0.68rem' : '0.75rem',
          fontWeight: 700, letterSpacing: '0.01em', whiteSpace: 'nowrap',
          color: saved ? '#0a0904' : GOLD_HI,
          background: saved
            ? 'linear-gradient(180deg, #F3E3AC 0%, #E8D28A 42%, #D4AF37 100%)'
            : 'rgba(212,175,55,0.08)',
          border: `1px solid ${saved ? 'transparent' : 'rgba(212,175,55,0.45)'}`,
          opacity: blocked ? 0.55 : 1,
        }}
      >
        <Star size={compact ? 11 : 12} fill={saved ? '#0a0904' : 'none'} color={saved ? '#0a0904' : GOLD_HI} />
        {label}
      </button>
      {note ? (
        <div style={{ ...T.micro, color: B.gold, marginTop: '0.25rem' }}>{note}</div>
      ) : null}
    </div>
  );
}

import { Gauge } from 'lucide-react';
import { useUnitDisplayScale } from '../hooks/useUnitDisplayScale';
import { UNIT_DISPLAY_SCALE } from '../lib/unitDisplayScale.js';

const cardShell = {
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '16px',
  padding: '2rem',
  marginBottom: '2rem',
};

export default function UnitTiersCard({ user }) {
  const { scale, setUnitDisplayScale, saving } = useUnitDisplayScale(user);

  return (
    <div style={cardShell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(212, 175, 55, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Gauge size={20} color="#D4AF37" strokeWidth={2.5} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>
          Unit Tiers
        </h3>
      </div>

      <p style={{ fontSize: '0.938rem', color: 'rgba(241, 245, 249, 0.8)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
        How locked plays are sized on your board — and in lock-alert pushes.
        The engine still locks the full book. Conservative halves every ticket
        so you play a 1–3u ladder instead of 1–6u. Saved to your account.
      </p>

      <div
        role="radiogroup"
        aria-label="Unit tier"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
        }}
      >
        <ModeOption
          selected={scale === UNIT_DISPLAY_SCALE.FULL}
          disabled={saving}
          onSelect={() => setUnitDisplayScale(UNIT_DISPLAY_SCALE.FULL)}
          title="Full"
          subtitle="Standard 1–6u book"
          accent="#D4AF37"
        />
        <ModeOption
          selected={scale === UNIT_DISPLAY_SCALE.CONSERVATIVE}
          disabled={saving}
          onSelect={() => setUnitDisplayScale(UNIT_DISPLAY_SCALE.CONSERVATIVE)}
          title="Conservative"
          subtitle="Half size · 1–3u ladder"
          accent="#10B981"
        />
      </div>
    </div>
  );
}

function ModeOption({ selected, disabled, onSelect, title, subtitle, accent }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      style={{
        textAlign: 'left',
        padding: '0.75rem 0.875rem',
        borderRadius: 10,
        cursor: disabled ? 'wait' : 'pointer',
        background: selected ? `${accent}18` : 'rgba(15, 23, 42, 0.45)',
        border: `1px solid ${selected ? `${accent}66` : 'rgba(148, 163, 184, 0.2)'}`,
        color: '#F1F5F9',
      }}
    >
      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: selected ? accent : '#F1F5F9' }}>
        {title}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'rgba(241, 245, 249, 0.55)', marginTop: 2 }}>
        {subtitle}
      </div>
    </button>
  );
}

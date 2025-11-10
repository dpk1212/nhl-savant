// ✨ TRULY MINIMAL PREMIUM HEADER - Apple/Linear/Stripe Level
// 
// PHILOSOPHY:
// - ONE line, perfect spacing
// - No gradients, no glows, no shimmer
// - Clean typography as the design element
// - Subtle backgrounds, not busy
// - Information hierarchy through size/weight only

<div style={{
  background: 'rgba(17, 24, 39, 0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '10px',
  padding: isMobile ? '0.625rem 0.875rem' : '0.75rem 1.25rem',
  marginBottom: isMobile ? '1rem' : '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  flexWrap: 'wrap'
}}>
  {/* Left: Date/Time info - clean text */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <span style={{
      fontSize: isMobile ? '0.813rem' : '0.875rem',
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '600',
      letterSpacing: '-0.01em'
    }}>
      {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
    </span>
    
    {/* Subtle dot separator */}
    <span style={{
      width: '3px',
      height: '3px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.3)'
    }} />
    
    <LiveClock />
    
    {startingGoalies && startingGoalies.games && (
      <>
        <span style={{
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.3)'
        }} />
        <span style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          color: '#10B981',
          fontWeight: '600'
        }}>
          🥅 {confirmedGoalies}/{totalGoalies}
        </span>
      </>
    )}
  </div>

  {/* Right: MINIMAL stat badges - no gradients, just clean boxes */}
  <div style={{ 
    display: 'flex',
    gap: isMobile ? '0.5rem' : '0.625rem',
    alignItems: 'center'
  }}>
    {/* Games - Clean slate badge */}
    <div style={{
      padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
      background: 'rgba(148, 163, 184, 0.1)',
      borderRadius: '6px',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{
        fontSize: isMobile ? '1.125rem' : '1.25rem',
        fontWeight: '700',
        color: '#CBD5E1'
      }}>
        {allEdges.length}
      </span>
      <span style={{
        fontSize: isMobile ? '0.625rem' : '0.688rem',
        color: 'rgba(203, 213, 225, 0.7)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.03em'
      }}>
        Games
      </span>
    </div>

    {/* +EV - Clean blue badge */}
    <div style={{
      padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
      background: 'rgba(59, 130, 246, 0.12)',
      borderRadius: '6px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{
        fontSize: isMobile ? '1.125rem' : '1.25rem',
        fontWeight: '700',
        color: '#60A5FA'
      }}>
        {opportunityCounts.total}
      </span>
      <span style={{
        fontSize: isMobile ? '0.625rem' : '0.688rem',
        color: 'rgba(96, 165, 250, 0.9)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.03em'
      }}>
        +EV
      </span>
    </div>

    {/* Elite - Clean gold badge */}
    <div style={{
      padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
      background: 'rgba(212, 175, 55, 0.12)',
      borderRadius: '6px',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{
        fontSize: isMobile ? '1.125rem' : '1.25rem',
        fontWeight: '700',
        color: '#D4AF37'
      }}>
        {opportunityCounts.highValue}
      </span>
      <span style={{
        fontSize: isMobile ? '0.625rem' : '0.688rem',
        color: 'rgba(212, 175, 55, 0.9)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.03em'
      }}>
        Elite
      </span>
    </div>
  </div>
</div>





import React from 'react';

// Skeleton loading component for better UX
export const SkeletonCard = ({ isMobile = false }) => (
  <div className="elevated-card skeleton-card" style={{
    animationDelay: '0s',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div className="skeleton-shimmer" />
    
    {/* Header skeleton */}
    <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
      <div className="skeleton-block" style={{ width: '40%', height: '24px', marginBottom: '0.5rem' }} />
      <div className="skeleton-block" style={{ width: '20%', height: '14px' }} />
    </div>
    
    {/* Content skeleton */}
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
      <div>
        <div className="skeleton-block" style={{ width: '60%', height: '16px', marginBottom: '1rem' }} />
        <div className="skeleton-block" style={{ width: '100%', height: '80px', marginBottom: '0.75rem' }} />
        <div className="skeleton-block" style={{ width: '80%', height: '16px' }} />
      </div>
      <div>
        <div className="skeleton-block" style={{ width: '60%', height: '16px', marginBottom: '1rem' }} />
        <div className="skeleton-block" style={{ width: '100%', height: '80px', marginBottom: '0.75rem' }} />
        <div className="skeleton-block" style={{ width: '80%', height: '16px' }} />
      </div>
    </div>
  </div>
);

export const SkeletonOpportunityRow = () => (
  <tr style={{ borderTop: '1px solid var(--color-border)' }}>
    <td style={{ padding: '1rem' }}>
      <div className="skeleton-block" style={{ width: '80%', height: '16px' }} />
    </td>
    <td style={{ padding: '1rem' }}>
      <div className="skeleton-block" style={{ width: '60%', height: '14px' }} />
    </td>
    <td style={{ padding: '1rem' }}>
      <div className="skeleton-block" style={{ width: '70%', height: '16px' }} />
    </td>
    <td style={{ padding: '1rem' }}>
      <div className="skeleton-block" style={{ width: '50%', height: '16px' }} />
    </td>
    <td style={{ padding: '1rem' }}>
      <div className="skeleton-block" style={{ width: '60%', height: '16px' }} />
    </td>
    <td style={{ padding: '1rem' }}>
      <div className="skeleton-block" style={{ width: '50px', height: '50px', borderRadius: '8px' }} />
    </td>
    <td style={{ padding: '1rem' }}>
      <div className="skeleton-block" style={{ width: '70px', height: '32px', borderRadius: '6px' }} />
    </td>
  </tr>
);

export const SkeletonHero = ({ isMobile = false }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '16px',
    padding: isMobile ? '1.5rem' : '2rem',
    marginBottom: '2rem',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div className="skeleton-shimmer" />
    
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: '2rem' }}>
      <div style={{ flex: 1 }}>
        <div className="skeleton-block" style={{ width: '60%', height: '40px', marginBottom: '1rem' }} />
        <div className="skeleton-block" style={{ width: '40%', height: '16px', marginBottom: '0.5rem' }} />
        <div className="skeleton-block" style={{ width: '80%', height: '14px' }} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexDirection: isMobile ? 'row' : 'column' }}>
        <div className="skeleton-block" style={{ width: '120px', height: '60px', borderRadius: '8px' }} />
        <div className="skeleton-block" style={{ width: '120px', height: '60px', borderRadius: '8px' }} />
      </div>
    </div>
  </div>
);

export const LoadingDots = () => (
  <div className="loading-dots">
    <span className="dot"></span>
    <span className="dot"></span>
    <span className="dot"></span>
  </div>
);


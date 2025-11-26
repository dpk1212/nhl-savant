import { getGradeColor } from '../utils/basketballGrading';

/**
 * Grade Badge Component
 * Displays prediction grade (A+ through F)
 */
export function GradeBadge({ grade, size = 'normal', showDetails = false, gradeData = null }) {
  if (!grade) return null;
  
  const colors = getGradeColor(grade);
  const isLarge = size === 'large';
  
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          background: colors.bg,
          color: colors.text,
          padding: isLarge ? '12px 20px' : '6px 12px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: isLarge ? '24px' : '16px',
          boxShadow: `0 4px 12px ${colors.glow}`,
          display: 'inline-block',
          minWidth: isLarge ? '60px' : '40px',
          textAlign: 'center'
        }}
      >
        {grade}
      </div>
      
      {showDetails && gradeData && (
        <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
          <div>
            {gradeData.winnerCorrect ? '✅ Winner' : '❌ Winner'}
          </div>
          <div>
            ±{gradeData.scoreError} pts avg
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Grade Stats Summary Component
 * Premium collapsible grading statistics
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function GradeStats({ stats }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!stats || stats.totalGames === 0) {
    return null;
  }
  
  const isMobile = window.innerWidth < 768;
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: isMobile ? '1.125rem' : '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 80px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header - Collapsible */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          width: '100%',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: isExpanded ? '1rem' : '0',
          gap: '0.75rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            flexShrink: 0
          }}>
            📊
          </div>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: isMobile ? '1.125rem' : '1.375rem', 
              fontWeight: '900',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              lineHeight: 1.2
            }}>
              Grading Summary
            </h3>
            <div style={{
              fontSize: '0.688rem',
              color: 'rgba(139, 92, 246, 0.7)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '0.125rem'
            }}>
              Model Accuracy
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Preview when collapsed */}
          {!isExpanded && (
            <div style={{ 
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              fontWeight: '800',
              color: stats.winnerAccuracy >= 70 ? '#10B981' : '#8B5CF6',
              background: stats.winnerAccuracy >= 70
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: `1px solid ${stats.winnerAccuracy >= 70 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
              padding: '0.5rem 0.875rem',
              borderRadius: '10px',
              fontFeatureSettings: "'tnum'"
            }}>
              {stats.totalGames} graded • {stats.winnerAccuracy}% accurate
            </div>
          )}
          {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
        </div>
      </button>
      
      {/* Expanded Stats Grid */}
      {isExpanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '0.75rem' : '1rem'
        }}>
          <StatBox
            label="Total Graded"
            value={stats.totalGames}
            icon="🎯"
          />
          <StatBox
            label="Winner Accuracy"
            value={`${stats.winnerAccuracy}%`}
            icon="✅"
          />
          <StatBox
            label="Avg Error"
            value={`±${stats.avgScoreError} pts`}
            icon="📏"
          />
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, icon }) {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '16px',
      padding: isMobile ? '1rem' : '1.25rem',
      textAlign: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ 
        fontSize: isMobile ? '1.75rem' : '2rem', 
        marginBottom: '0.5rem',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
      }}>
        {icon}
      </div>
      <div style={{ 
        fontSize: isMobile ? '1.75rem' : '2rem', 
        fontWeight: '900', 
        color: '#8B5CF6', 
        marginBottom: '0.5rem',
        fontFeatureSettings: "'tnum'",
        letterSpacing: '-0.03em',
        textShadow: '0 2px 16px rgba(139, 92, 246, 0.4)'
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: isMobile ? '0.688rem' : '0.75rem', 
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        {label}
      </div>
    </div>
  );
}



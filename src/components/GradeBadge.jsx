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
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '16px',
      padding: isMobile ? '1rem' : '1.25rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 0 40px rgba(139, 92, 246, 0.08)',
      overflow: 'hidden'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '4px',
            height: '32px',
            background: 'linear-gradient(to bottom, #8B5CF6, #7C3AED)',
            borderRadius: '4px'
          }}></div>
          <h3 style={{ 
            margin: 0, 
            fontSize: isMobile ? '1.125rem' : '1.25rem', 
            fontWeight: '900',
            color: '#f1f5f9',
            letterSpacing: '-0.02em'
          }}>
            📊 Today's Grading Summary
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Preview when collapsed */}
          {!isExpanded && (
            <div style={{ 
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              fontWeight: '700',
              color: stats.winnerAccuracy >= 70 ? '#10B981' : '#8B5CF6'
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
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.03) 100%)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '12px',
      padding: isMobile ? '0.75rem' : '1rem',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'default'
    }}>
      <div style={{ 
        fontSize: isMobile ? '1.5rem' : '1.75rem', 
        marginBottom: '0.375rem',
        filter: 'grayscale(0.2)'
      }}>
        {icon}
      </div>
      <div style={{ 
        fontSize: isMobile ? '1.375rem' : '1.5rem', 
        fontWeight: '900', 
        color: '#f1f5f9', 
        marginBottom: '0.25rem',
        fontFeatureSettings: "'tnum'",
        letterSpacing: '-0.02em'
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: isMobile ? '0.688rem' : '0.75rem', 
        color: '#8B5CF6',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
    </div>
  );
}



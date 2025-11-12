import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * BetGradeHistory Component
 * 
 * Shows transparency about how a bet's ensemble grade changed over time
 * as odds shifted throughout the day. Helps users understand:
 * - When bet was first recommended (displayedGrade)
 * - How grade changed as market odds moved
 * - Whether bet maintained quality until game time
 */
export function BetGradeHistory({ bet, isMobile = false }) {
  const history = bet.history || [];
  const displayedGrade = bet.displayedGrade || bet.prediction?.qualityGrade;
  const currentGrade = bet.prediction?.qualityGrade;
  
  // Helper to format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Helper to get grade color
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return '#D4AF37';  // Gold
      case 'A': return '#10B981';   // Green
      case 'B': return '#8B5CF6';   // Purple
      case 'C': return '#F59E0B';   // Amber
      case 'D': return '#EF4444';   // Red
      default: return '#64748B';    // Gray
    }
  };
  
  // Helper to determine trend icon
  const getTrendIcon = (oldGrade, newGrade) => {
    const gradeOrder = ['D', 'C', 'B', 'A', 'A+'];
    const oldIndex = gradeOrder.indexOf(oldGrade);
    const newIndex = gradeOrder.indexOf(newGrade);
    
    if (newIndex > oldIndex) return <TrendingUp size={14} color="#10B981" />;
    if (newIndex < oldIndex) return <TrendingDown size={14} color="#EF4444" />;
    return <Minus size={14} color="#64748B" />;
  };
  
  // If no history or grade changes, show simple display
  if (!history || history.length === 0 || !displayedGrade) {
    return (
      <div style={{
        padding: isMobile ? '0.75rem' : '1rem',
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px solid rgba(148, 163, 184, 0.08)',
        borderRadius: '8px'
      }}>
        <div style={{
          fontSize: isMobile ? '0.813rem' : '0.875rem',
          color: '#94A3B8',
          fontWeight: '600'
        }}>
          Recommended as <span style={{ 
            color: getGradeColor(displayedGrade),
            fontWeight: '700'
          }}>Grade {displayedGrade}</span>
        </div>
      </div>
    );
  }
  
  // Check if grade changed
  const gradeChanged = history.some(entry => 
    entry.qualityGrade && entry.qualityGrade !== displayedGrade
  );
  
  return (
    <div style={{
      padding: isMobile ? '0.75rem' : '1rem',
      background: gradeChanged 
        ? 'rgba(139, 92, 246, 0.05)' 
        : 'rgba(15, 23, 42, 0.5)',
      border: gradeChanged
        ? '1px solid rgba(139, 92, 246, 0.2)'
        : '1px solid rgba(148, 163, 184, 0.08)',
      borderRadius: '8px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)'
      }}>
        <div style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          fontWeight: '700',
          color: '#94A3B8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {gradeChanged ? '📊 Grade History' : '✅ Quality Grade'}
        </div>
        {gradeChanged && (
          <div style={{
            fontSize: '0.688rem',
            color: '#64748B',
            fontWeight: '600'
          }}>
            {history.length} update{history.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      {/* Original Display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: gradeChanged ? '0.75rem' : '0',
        padding: '0.5rem 0.75rem',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '6px'
      }}>
        <div style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          color: '#94A3B8',
          fontWeight: '500'
        }}>
          First shown:
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem'
        }}>
          <span style={{
            fontSize: isMobile ? '0.813rem' : '0.875rem',
            fontWeight: '800',
            color: getGradeColor(displayedGrade)
          }}>
            Grade {displayedGrade}
          </span>
          {bet.displayedAt && (
            <span style={{
              fontSize: '0.688rem',
              color: '#64748B',
              fontWeight: '500'
            }}>
              at {formatTime(bet.displayedAt)}
            </span>
          )}
        </div>
      </div>
      
      {/* History Timeline */}
      {gradeChanged && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {history
            .filter(entry => entry.qualityGrade) // Only show entries with grade data
            .map((entry, index) => {
              const prevGrade = index === 0 ? displayedGrade : history[index - 1]?.qualityGrade;
              const isUpgrade = entry.qualityGrade !== prevGrade;
              
              if (!isUpgrade) return null; // Skip if grade didn't change
              
              return (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                    borderRadius: '6px'
                  }}
                >
                  {getTrendIcon(prevGrade, entry.qualityGrade)}
                  <div style={{
                    fontSize: '0.688rem',
                    color: '#64748B',
                    fontWeight: '500'
                  }}>
                    {formatTime(entry.timestamp)}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: isMobile ? '0.75rem' : '0.813rem',
                    fontWeight: '700'
                  }}>
                    <span style={{ color: getGradeColor(prevGrade) }}>
                      {prevGrade}
                    </span>
                    <span style={{ color: '#64748B' }}>→</span>
                    <span style={{ color: getGradeColor(entry.qualityGrade) }}>
                      {entry.qualityGrade}
                    </span>
                  </div>
                  {entry.agreement && (
                    <div style={{
                      fontSize: '0.688rem',
                      color: '#94A3B8',
                      marginLeft: 'auto'
                    }}>
                      {(entry.agreement * 100).toFixed(1)}% agreement
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
      
      {/* Current Grade (if different from displayed) */}
      {currentGrade && currentGrade !== displayedGrade && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '6px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: isMobile ? '0.75rem' : '0.813rem'
          }}>
            <span style={{ color: '#94A3B8', fontWeight: '500' }}>
              Current:
            </span>
            <span style={{
              fontWeight: '800',
              color: getGradeColor(currentGrade)
            }}>
              Grade {currentGrade}
            </span>
            {bet.prediction?.agreement && (
              <span style={{
                fontSize: '0.688rem',
                color: '#64748B',
                marginLeft: 'auto'
              }}>
                {(bet.prediction.agreement * 100).toFixed(1)}% agreement
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BetGradeHistory;


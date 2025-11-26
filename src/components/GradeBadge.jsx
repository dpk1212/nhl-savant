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
 * Shows overall grading statistics
 */
export function GradeStats({ stats }) {
  if (!stats || stats.totalGames === 0) {
    return null;
  }
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.7))',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '18px', 
        color: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📊 Today's Grading Summary
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px'
      }}>
        <StatBox
          label="Total Graded"
          value={stats.totalGames}
          icon="🎯"
        />
        <StatBox
          label="Avg Grade"
          value={stats.avgGrade.toFixed(2)}
          icon="📈"
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
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid rgba(71, 85, 105, 0.2)',
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>
        {icon}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
        {label}
      </div>
    </div>
  );
}



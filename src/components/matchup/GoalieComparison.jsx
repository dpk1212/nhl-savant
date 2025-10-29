/**
 * Goalie Comparison - Head-to-head goalie matchup
 * Visual rings showing save % and GSAX comparison
 */

export default function GoalieComparison({ awayTeam, homeTeam, awayGoalie, homeGoalie, goalieEdge }) {
  if (!awayGoalie || !homeGoalie) {
    return null;
  }

  const awayS

avePct = (awayGoalie.savePct || 0.900) * 100;
  const homeSavePct = (homeGoalie.savePct || 0.900) * 100;
  const awayGSAX = awayGoalie.gsax || 0;
  const homeGSAX = homeGoalie.gsax || 0;

  const getSaveColor = (savePct) => {
    if (savePct >= 92) return '#10B981';
    if (savePct >= 90) return '#3B82F6';
    if (savePct >= 88) return '#F59E0B';
    return '#EF4444';
  };

  const getGSAXColor = (gsax) => {
    if (gsax >= 5) return '#10B981';
    if (gsax >= 0) return '#3B82F6';
    if (gsax >= -5) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#F1F5F9',
        marginBottom: '0.5rem',
        textAlign: 'center'
      }}>
        Goalie Showdown
      </h2>

      {goalieEdge !== 0 && (
        <p style={{
          fontSize: '0.875rem',
          color: '#94A3B8',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          {Math.abs(goalieEdge) > 5 
            ? `${goalieEdge > 0 ? awayGoalie.name : homeGoalie.name} has significant edge`
            : 'Closely matched goalies'}
        </p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        {/* Away Goalie */}
        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          background: 'rgba(15, 23, 42, 0.3)',
          borderRadius: '12px'
        }}>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '0.5rem'
          }}>
            {awayGoalie.name}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#94A3B8',
            marginBottom: '1.5rem'
          }}>
            {awayTeam.name}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '1rem'
          }}>
            <div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: getSaveColor(awaySavePct)
              }}>
                {awaySavePct.toFixed(1)}%
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Save %
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: getGSAXColor(awayGSAX)
              }}>
                {awayGSAX > 0 ? '+' : ''}{awayGSAX.toFixed(1)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                GSAX
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '0.5rem',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#94A3B8'
          }}>
            {awayGoalie.gamesPlayed || 0} GP | {awayGoalie.wins || 0}-{awayGoalie.losses || 0}
          </div>
        </div>

        {/* Home Goalie */}
        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          background: 'rgba(15, 23, 42, 0.3)',
          borderRadius: '12px'
        }}>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '0.5rem'
          }}>
            {homeGoalie.name}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#94A3B8',
            marginBottom: '1.5rem'
          }}>
            {homeTeam.name}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '1rem'
          }}>
            <div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: getSaveColor(homeSavePct)
              }}>
                {homeSavePct.toFixed(1)}%
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Save %
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: getGSAXColor(homeGSAX)
              }}>
                {homeGSAX > 0 ? '+' : ''}{homeGSAX.toFixed(1)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                GSAX
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '0.5rem',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#94A3B8'
          }}>
            {homeGoalie.gamesPlayed || 0} GP | {homeGoalie.wins || 0}-{homeGoalie.losses || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

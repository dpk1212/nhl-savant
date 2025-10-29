/**
 * Goalie Comparison - Head-to-head goalie matchup
 * Visual rings showing save % and GSAX comparison
 */

export default function GoalieComparison({ awayTeam, homeTeam, awayGoalie, homeGoalie, goalieEdge }) {
  // Create default goalies with league-average stats when not specified
  const defaultAwayGoalie = {
    name: `${awayTeam.name} Goalie`,
    savePct: 0.905,
    gsax: 0,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    isDefault: true
  };

  const defaultHomeGoalie = {
    name: `${homeTeam.name} Goalie`,
    savePct: 0.905,
    gsax: 0,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    isDefault: true
  };

  const finalAwayGoalie = awayGoalie || defaultAwayGoalie;
  const finalHomeGoalie = homeGoalie || defaultHomeGoalie;

  const awaySavePct = (finalAwayGoalie.savePct || 0.905) * 100;
  const homeSavePct = (finalHomeGoalie.savePct || 0.905) * 100;
  const awayGSAX = finalAwayGoalie.gsax || 0;
  const homeGSAX = finalHomeGoalie.gsax || 0;

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

      {goalieEdge !== 0 && !finalAwayGoalie.isDefault && !finalHomeGoalie.isDefault && (
        <p style={{
          fontSize: '0.875rem',
          color: '#94A3B8',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          {Math.abs(goalieEdge) > 5 
            ? `${goalieEdge > 0 ? finalAwayGoalie.name : finalHomeGoalie.name} has significant edge`
            : 'Closely matched goalies'}
        </p>
      )}
      
      {(finalAwayGoalie.isDefault || finalHomeGoalie.isDefault) && (
        <p style={{
          fontSize: '0.875rem',
          color: '#F59E0B',
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '0.75rem',
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '8px'
        }}>
          ⚠️ Using league-average goalie stats (specific starter not yet confirmed)
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
            {finalAwayGoalie.name}
            {finalAwayGoalie.isDefault && <span style={{ color: '#F59E0B', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(League Avg)</span>}
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

          {!finalAwayGoalie.isDefault && (
            <div style={{
              marginTop: '1rem',
              padding: '0.5rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#94A3B8'
            }}>
              {finalAwayGoalie.gamesPlayed || 0} GP | {finalAwayGoalie.wins || 0}-{finalAwayGoalie.losses || 0}
            </div>
          )}
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
            {finalHomeGoalie.name}
            {finalHomeGoalie.isDefault && <span style={{ color: '#F59E0B', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(League Avg)</span>}
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

          {!finalHomeGoalie.isDefault && (
            <div style={{
              marginTop: '1rem',
              padding: '0.5rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#94A3B8'
            }}>
              {finalHomeGoalie.gamesPlayed || 0} GP | {finalHomeGoalie.wins || 0}-{finalHomeGoalie.losses || 0}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Recent Form Timeline - Last 10 games W/L record
 * Visual timeline showing recent performance
 */

export default function RecentFormTimeline({ awayTeam, homeTeam, awayForm, homeForm }) {
  if (!awayForm || !homeForm) {
    return null;
  }

  const renderFormBadge = (game) => {
    const bgColor = game.result === 'W' ? '#10B981' : game.result === 'L' ? '#EF4444' : '#64748B';
    
    return (
      <div
        key={game.date}
        title={`${game.result} ${game.score} vs ${game.opponent} (${game.isHome ? 'Home' : 'Away'})`}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#FFFFFF',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {game.result}
      </div>
    );
  };

  const getRecord = (form) => {
    const wins = form.filter(g => g.result === 'W').length;
    const losses = form.filter(g => g.result === 'L').length;
    return `${wins}-${losses}`;
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
        marginBottom: '0.5rem'
      }}>
        Recent Form
      </h2>
      <p style={{
        fontSize: '0.875rem',
        color: '#94A3B8',
        marginBottom: '2rem'
      }}>
        Last 10 games (most recent on right)
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* Away Team Form */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#F1F5F9'
              }}>
                {awayTeam.name}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#94A3B8'
              }}>
                {awayTeam.code}
              </div>
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#3B82F6'
            }}>
              {getRecord(awayForm)}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {awayForm.slice().reverse().map((game, idx) => renderFormBadge(game))}
          </div>
        </div>

        {/* Home Team Form */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#F1F5F9'
              }}>
                {homeTeam.name}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#94A3B8'
              }}>
                {homeTeam.code}
              </div>
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#10B981'
            }}>
              {getRecord(homeForm)}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {homeForm.slice().reverse().map((game, idx) => renderFormBadge(game))}
          </div>
        </div>
      </div>
    </div>
  );
}

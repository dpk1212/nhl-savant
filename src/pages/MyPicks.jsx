import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, TrendingUp, Target, Calendar } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import { useFirebaseBets } from '../hooks/useFirebaseBets';
import { useLiveScores } from '../hooks/useLiveScores';
import { calculateBookmarkStats, groupBookmarksByStatus, formatProfit, formatPercentage } from '../utils/bookmarkStats';
import BookmarkButton from '../components/BookmarkButton';
import RatingBadge from '../components/RatingBadge';

const MyPicks = () => {
  const { bookmarks, toggleBookmark, loading: bookmarksLoading } = useBookmarks();
  const { bets: completedBets, loading: betsLoading } = useFirebaseBets();
  const { liveScores } = useLiveScores();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Calculate statistics
  const stats = calculateBookmarkStats(bookmarks, completedBets);
  
  // Group bookmarks by status
  const grouped = groupBookmarksByStatus(bookmarks, completedBets, liveScores);
  
  // Loading state
  if (bookmarksLoading || betsLoading) {
    return (
      <div style={{ 
        maxWidth: '80rem', 
        margin: '0 auto', 
        padding: isMobile ? '1rem' : '2rem 1rem' 
      }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ 
            margin: '0 auto 1rem',
            width: '40px',
            height: '40px',
            border: '3px solid rgba(212, 175, 55, 0.3)',
            borderTopColor: '#D4AF37',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading your picks...</p>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (bookmarks.length === 0) {
    return (
      <div style={{ 
        maxWidth: '80rem', 
        margin: '0 auto', 
        padding: isMobile ? '1rem' : '2rem 1rem' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px',
          padding: isMobile ? '2rem 1rem' : '3rem 2rem',
          textAlign: 'center'
        }}>
          <Bookmark 
            size={64} 
            color="rgba(212, 175, 55, 0.4)" 
            style={{ margin: '0 auto 1.5rem' }}
          />
          <h1 style={{ 
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'var(--color-text-primary)'
          }}>
            Start Tracking Your Picks
          </h1>
          <p style={{ 
            fontSize: isMobile ? '0.938rem' : '1rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Bookmark your favorite recommendations to track their performance automatically. 
            We'll calculate your wins, losses, and total profit.
          </p>
          <Link 
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              color: '#000',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            }}
          >
            <Target size={20} />
            View Today's Games
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ 
      maxWidth: '80rem', 
      margin: '0 auto', 
      padding: isMobile ? '1rem' : '2rem 1rem' 
    }}>
      {/* Header with Stats */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        padding: isMobile ? '1.5rem' : '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Shimmer effect */}
        <div className="shine-overlay" />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <Bookmark size={32} color="#D4AF37" />
            <div>
              <h1 style={{ 
                fontSize: isMobile ? '1.75rem' : '2.5rem',
                fontWeight: '800',
                marginBottom: '0.25rem',
                color: '#D4AF37',
                letterSpacing: '-0.02em'
              }}>
                My Picks
              </h1>
              <p style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: isMobile ? '0.875rem' : '0.938rem'
              }}>
                Track your bookmarked recommendations
              </p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '1rem' : '1.5rem'
          }}>
            <StatCard 
              icon={<Bookmark size={20} />}
              label="Total Picks"
              value={stats.totalBookmarked}
              color="#D4AF37"
            />
            <StatCard 
              icon={<Target size={20} />}
              label="Win Rate"
              value={stats.completedCount > 0 ? `${stats.winRate.toFixed(1)}%` : '-'}
              color={stats.winRate >= 52 ? '#10B981' : '#64748B'}
              subtitle={`${stats.wins}-${stats.losses}${stats.pushes > 0 ? `-${stats.pushes}` : ''}`}
            />
            <StatCard 
              icon={<TrendingUp size={20} />}
              label="Total Profit"
              value={formatProfit(stats.totalProfit)}
              color={stats.totalProfit > 0 ? '#10B981' : stats.totalProfit < 0 ? '#EF4444' : '#64748B'}
            />
            <StatCard 
              icon={<Calendar size={20} />}
              label="Pending"
              value={stats.pending}
              color="#3B82F6"
            />
          </div>
        </div>
      </div>
      
      {/* Picks Sections */}
      {grouped.upcoming.length > 0 && (
        <PicksSection 
          title="Upcoming Games"
          picks={grouped.upcoming}
          type="upcoming"
          toggleBookmark={toggleBookmark}
          isMobile={isMobile}
        />
      )}
      
      {grouped.live.length > 0 && (
        <PicksSection 
          title="Live Now"
          picks={grouped.live}
          type="live"
          toggleBookmark={toggleBookmark}
          isMobile={isMobile}
        />
      )}
      
      {grouped.completed.length > 0 && (
        <PicksSection 
          title="Completed"
          picks={grouped.completed}
          type="completed"
          toggleBookmark={toggleBookmark}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color, subtitle }) => (
  <div style={{
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1.25rem'
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      marginBottom: '0.5rem',
      color: color
    }}>
      {icon}
      <span style={{ 
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--color-text-secondary)'
      }}>
        {label}
      </span>
    </div>
    <div style={{ 
      fontSize: '1.875rem',
      fontWeight: '700',
      color: color,
      lineHeight: '1'
    }}>
      {value}
    </div>
    {subtitle && (
      <div style={{ 
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        marginTop: '0.25rem'
      }}>
        {subtitle}
      </div>
    )}
  </div>
);

// Picks Section Component
const PicksSection = ({ title, picks, type, toggleBookmark, isMobile }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{
      fontSize: isMobile ? '1.25rem' : '1.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
      color: 'var(--color-text-primary)'
    }}>
      {title} ({picks.length})
    </h2>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '1rem'
    }}>
      {picks.map(pick => (
        <PickCard 
          key={pick.betId}
          pick={pick}
          type={type}
          toggleBookmark={toggleBookmark}
          isMobile={isMobile}
        />
      ))}
    </div>
  </div>
);

// Pick Card Component
const PickCard = ({ pick, type, toggleBookmark, isMobile }) => {
  const handleRemoveBookmark = () => {
    toggleBookmark({
      betId: pick.betId,
      game: pick.game,
      bet: pick.bet
    });
  };
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.98) 0%, rgba(17, 24, 39, 0.98) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.25rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: isMobile ? '1rem' : '1.125rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem'
          }}>
            {pick.game.awayTeam} @ {pick.game.homeTeam}
          </div>
          <div style={{ 
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}>
            {pick.game.gameTime}
          </div>
        </div>
        
        <BookmarkButton 
          isBookmarked={true}
          onClick={handleRemoveBookmark}
          size="small"
        />
      </div>
      
      {/* Pick Details */}
      <div style={{
        background: 'rgba(212, 175, 55, 0.08)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '8px',
        padding: isMobile ? '0.75rem' : '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ 
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#D4AF37',
          marginBottom: '0.5rem'
        }}>
          💰 {pick.bet.pick}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.813rem',
          color: 'var(--color-text-secondary)'
        }}>
          <span>Odds: {pick.bet.odds > 0 ? '+' : ''}{pick.bet.odds}</span>
          <span>EV: +{pick.bet.evPercent.toFixed(1)}%</span>
          <RatingBadge evPercent={pick.bet.evPercent} size="small" />
        </div>
      </div>
      
      {/* Result (if completed) */}
      {type === 'completed' && pick.result && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '8px',
          background: pick.result.outcome === 'WIN' 
            ? 'rgba(16, 185, 129, 0.1)' 
            : pick.result.outcome === 'LOSS'
            ? 'rgba(239, 68, 68, 0.1)'
            : 'rgba(100, 116, 139, 0.1)',
          border: pick.result.outcome === 'WIN'
            ? '1px solid rgba(16, 185, 129, 0.3)'
            : pick.result.outcome === 'LOSS'
            ? '1px solid rgba(239, 68, 68, 0.3)'
            : '1px solid rgba(100, 116, 139, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: pick.result.outcome === 'WIN'
              ? '#10B981'
              : pick.result.outcome === 'LOSS'
              ? '#EF4444'
              : '#64748B'
          }}>
            {pick.result.outcome}
          </span>
          <span style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: pick.result.profit > 0
              ? '#10B981'
              : pick.result.profit < 0
              ? '#EF4444'
              : '#64748B'
          }}>
            {formatProfit(pick.result.profit)}
          </span>
        </div>
      )}
      
      {/* Live indicator */}
      {type === 'live' && pick.liveScore && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span className="live-dot" />
            LIVE
          </span>
          <span style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)'
          }}>
            {pick.liveScore.awayScore} - {pick.liveScore.homeScore}
          </span>
        </div>
      )}
    </div>
  );
};

export default MyPicks;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Lock, TrendingUp, BarChart3, Calendar, ExternalLink } from 'lucide-react';

/**
 * Today's Picks Preview - Public Page for LLM Citations
 * Shows high-level summary of today's best NHL and CBB picks
 * Does NOT reveal specific teams, odds, or full analysis (premium only)
 * Updated daily, optimized for AI assistant citations
 */

const TodaysPicksPreview = () => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreviewData();
  }, []);

  async function loadPreviewData() {
    try {
      setLoading(true);
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`/data/todays-picks-preview.json${cacheBuster}`);
      
      if (response.ok) {
        const data = await response.json();
        setPreviewData(data);
      } else {
        // Fallback to example data if file doesn't exist yet
        setPreviewData({
          date: new Date().toISOString().split('T')[0],
          nhl: {
            totalGames: 8,
            qualityPicks: 4,
            averageEV: 4.2,
            bestGradeAvailable: 'A',
            topMatchupPreview: 'Elite xG team vs struggling goalie (negative GSAE)'
          },
          cbb: {
            totalGames: 45,
            qualityPicks: 7,
            averageEV: 5.8,
            bestGradeAvailable: 'A+',
            topMatchupPreview: 'Top-10 efficiency vs bottom-50 defense'
          },
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Failed to load preview:', err);
      // Use fallback data
      setPreviewData({
        date: new Date().toISOString().split('T')[0],
        nhl: {
          totalGames: 8,
          qualityPicks: 4,
          averageEV: 4.2,
          bestGradeAvailable: 'A',
          topMatchupPreview: 'Elite xG team vs struggling goalie (negative GSAE)'
        },
        cbb: {
          totalGames: 45,
          qualityPicks: 7,
          averageEV: 5.8,
          bestGradeAvailable: 'A+',
          topMatchupPreview: 'Top-10 efficiency vs bottom-50 defense'
        },
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--color-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--color-border)',
            borderTopColor: '#D4AF37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading today's preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background)',
      paddingBottom: '4rem'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(11, 15, 31, 1) 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3rem 1rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Target size={40} color="#D4AF37" />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#F8FAFC',
              margin: 0
            }}>
              🎯 Today's Picks Preview
            </h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            High-level summary of today's best +EV betting opportunities for NHL and College Basketball.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#D4AF37" />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.938rem' }}>
                {formatDate(previewData.date)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#10B981" />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.938rem' }}>
                Last updated: {formatTime(previewData.lastUpdated)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* NHL Section */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              NHL Picks Today
            </h2>
            <div style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#D4AF37'
            }}>
              {previewData.nhl.totalGames} Games Today
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Quality Picks */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <BarChart3 size={32} color="#3B82F6" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                {previewData.nhl.qualityPicks}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Quality Picks (Grade A or Better)
              </div>
            </div>

            {/* Average EV */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <TrendingUp size={32} color="#10B981" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                {previewData.nhl.averageEV.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Average EV on Quality Picks
              </div>
            </div>

            {/* Best Grade */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <Target size={32} color="#D4AF37" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                {previewData.nhl.bestGradeAvailable}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Best Grade Available Today
              </div>
            </div>
          </div>

          {/* Top Matchup Preview */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#D4AF37', marginBottom: '0.5rem' }}>
              TOP MATCHUP PREVIEW
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              {previewData.nhl.topMatchupPreview}
            </div>
          </div>

          {/* Locked Content Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed var(--color-border)',
            borderRadius: '12px'
          }}>
            <Lock size={24} color="#94A3B8" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.938rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                Full picks, odds, and analysis available to premium members
              </div>
              <div style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)' }}>
                See exact teams, EV percentages, unit sizing, and AI-generated insights
              </div>
            </div>
          </div>
        </div>

        {/* CBB Section */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              College Basketball Picks Today
            </h2>
            <div style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#3B82F6'
            }}>
              {previewData.cbb.totalGames} Games Today
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Quality Picks */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <BarChart3 size={32} color="#3B82F6" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                {previewData.cbb.qualityPicks}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Quality Picks (Grade A or Better)
              </div>
            </div>

            {/* Average EV */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <TrendingUp size={32} color="#10B981" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                {previewData.cbb.averageEV.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Average EV on Quality Picks
              </div>
            </div>

            {/* Best Grade */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <Target size={32} color="#D4AF37" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                {previewData.cbb.bestGradeAvailable}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Best Grade Available Today
              </div>
            </div>
          </div>

          {/* Top Matchup Preview */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3B82F6', marginBottom: '0.5rem' }}>
              TOP MATCHUP PREVIEW
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              {previewData.cbb.topMatchupPreview}
            </div>
          </div>

          {/* Locked Content Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed var(--color-border)',
            borderRadius: '12px'
          }}>
            <Lock size={24} color="#94A3B8" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.938rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                Full picks, odds, and analysis available to premium members
              </div>
              <div style={{ fontSize: '0.813rem', color: 'var(--color-text-secondary)' }}>
                See exact teams, EV percentages, unit sizing, and efficiency ratings
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            Get Full Access to Today's Picks
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            lineHeight: 1.6,
            maxWidth: '700px',
            margin: '0 auto 2rem'
          }}>
            See all picks with exact teams, odds, EV percentages, unit sizing, and full AI-generated analysis. Track your performance, bookmark favorites, and get live win probability updates.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                color: '#0A0E27',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
              }}
            >
              Start Free Trial
            </Link>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = '#D4AF37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              View Full Dashboard
              <ExternalLink size={18} />
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            marginBottom: '1.5rem'
          }}>
            How NHL Savant Finds +EV Picks
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#D4AF37', marginBottom: '0.5rem' }}>
                1. CALCULATE TRUE WIN PROBABILITY
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                NHL: xGF per 60, PDO regression, goalie GSAE, rest factors. CBB: Adjusted efficiency ratings (offensive minus defensive).
              </p>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3B82F6', marginBottom: '0.5rem' }}>
                2. ENSEMBLE CALIBRATION
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Blend our model with established sources (MoneyPuck for NHL, D-Ratings + Haslametrics for CBB) for improved accuracy.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10B981', marginBottom: '0.5rem' }}>
                3. COMPARE TO MARKET ODDS
              </div>
              <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Calculate Expected Value (EV%) by comparing our probability to implied market probability. Publish only +EV opportunities.
              </p>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <Link
              to="/methodology"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#D4AF37',
                textDecoration: 'none',
                fontSize: '0.938rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFD700';
                e.currentTarget.style.gap = '0.75rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D4AF37';
                e.currentTarget.style.gap = '0.5rem';
              }}
            >
              Read Full Methodology →
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TodaysPicksPreview;


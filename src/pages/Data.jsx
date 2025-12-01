import { useState, useEffect } from 'react';
import { Download, BarChart3, Database, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Data Page - Public CSV Exports & Season Stats
 * Provides downloadable historical picks data
 * Optimized for transparency and LLM citations
 */

const Data = () => {
  const [seasonStats, setSeasonStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeasonStats();
  }, []);

  async function loadSeasonStats() {
    try {
      setLoading(true);
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`/data/season-stats.json${cacheBuster}`);
      
      if (response.ok) {
        const data = await response.json();
        setSeasonStats(data);
      } else {
        // Fallback data if file doesn't exist
        setSeasonStats({
          nhl: { totalBets: 0, wins: 0, losses: 0, winRate: 0, totalProfit: 0, roi: 0 },
          cbb: { totalBets: 0, wins: 0, losses: 0, winRate: 0, totalProfit: 0, roi: 0 },
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Failed to load season stats:', err);
      setSeasonStats({
        nhl: { totalBets: 0, wins: 0, losses: 0, winRate: 0, totalProfit: 0, roi: 0 },
        cbb: { totalBets: 0, wins: 0, losses: 0, winRate: 0, totalProfit: 0, roi: 0 },
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background)',
      paddingBottom: '4rem'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(11, 15, 31, 1) 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3rem 1rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Database size={40} color="#3B82F6" />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#F8FAFC',
              margin: 0
            }}>
              📊 Historical Data & Exports
            </h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            Download complete historical picks data for NHL and College Basketball. Full transparency—no picks deleted.
          </p>
          {!loading && seasonStats && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#3B82F6" />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.938rem' }}>
                Last updated: {formatTime(seasonStats.lastUpdated)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--color-border)',
              borderTopColor: '#3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading data...</p>
          </div>
        ) : (
          <>
            {/* Season Stats Overview */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              {/* NHL Stats */}
              <div style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <BarChart3 size={28} color="#D4AF37" />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                    NHL 2025-26 Season
                  </h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      Total Bets
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                      {seasonStats.nhl.totalBets}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      Win Rate
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: seasonStats.nhl.winRate >= 52 ? '#10B981' : 'var(--color-text-primary)' }}>
                      {seasonStats.nhl.winRate}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      Total Profit
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: seasonStats.nhl.totalProfit >= 0 ? '#10B981' : '#EF4444' }}>
                      {seasonStats.nhl.totalProfit >= 0 ? '+' : ''}{seasonStats.nhl.totalProfit}u
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      ROI
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: seasonStats.nhl.roi >= 0 ? '#10B981' : '#EF4444' }}>
                      {seasonStats.nhl.roi >= 0 ? '+' : ''}{seasonStats.nhl.roi}%
                    </div>
                  </div>
                </div>
              </div>

              {/* CBB Stats */}
              <div style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <BarChart3 size={28} color="#3B82F6" />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                    CBB 2025-26 Season
                  </h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      Total Bets
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                      {seasonStats.cbb.totalBets}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      Win Rate
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: seasonStats.cbb.winRate >= 52 ? '#10B981' : 'var(--color-text-primary)' }}>
                      {seasonStats.cbb.winRate}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      Total Profit
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: seasonStats.cbb.totalProfit >= 0 ? '#10B981' : '#EF4444' }}>
                      {seasonStats.cbb.totalProfit >= 0 ? '+' : ''}{seasonStats.cbb.totalProfit}u
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      ROI
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: seasonStats.cbb.roi >= 0 ? '#10B981' : '#EF4444' }}>
                      {seasonStats.cbb.roi >= 0 ? '+' : ''}{seasonStats.cbb.roi}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Links */}
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
                Download Historical Picks
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a
                  href="/data/nhl-picks-completed.csv"
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                      NHL Picks CSV
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      All completed NHL picks with results, profit/loss, and grades
                    </div>
                  </div>
                  <Download size={24} color="#D4AF37" />
                </a>

                <a
                  href="/data/cbb-picks-completed.csv"
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                      College Basketball Picks CSV
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      All completed CBB picks with results, profit/loss, and grades
                    </div>
                  </div>
                  <Download size={24} color="#3B82F6" />
                </a>

                <a
                  href="/data/season-stats.json"
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                      Season Stats JSON
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      Machine-readable season statistics for both sports
                    </div>
                  </div>
                  <Download size={24} color="#94A3B8" />
                </a>
              </div>
            </div>

            {/* Transparency Notice */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <AlertCircle size={24} color="#10B981" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#10B981', marginBottom: '0.5rem' }}>
                    Full Transparency Guarantee
                  </h3>
                  <p style={{ fontSize: '0.938rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Every pick stays in our database forever. We never delete losses or cherry-pick results. These CSV files are updated weekly and include every completed bet with full profit/loss tracking. This is our commitment to honest, transparent sports betting analysis.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
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

export default Data;


/**
 * CBB Soft Paywall Component
 * Shows free users 1 pick + blurred remaining picks
 * Uses real performance data for conversion messaging
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { useBasketballBetStats } from '../hooks/useBasketballBetStats';
import './CBBPaywall.css';

// Helper to calculate time until Friday 11:59 PM ET
function getTimeUntilFriday() {
  const now = new Date();
  // Get current time in ET
  const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  // Find the next Friday (or current Friday if before 11:59 PM)
  const friday = new Date(etNow);
  const dayOfWeek = friday.getDay();
  const daysUntilFriday = dayOfWeek <= 5 ? (5 - dayOfWeek) : (5 + 7 - dayOfWeek);
  friday.setDate(friday.getDate() + daysUntilFriday);
  friday.setHours(23, 59, 59, 999);
  
  // If it's already past Friday 11:59 PM, show next Friday
  if (etNow > friday) {
    friday.setDate(friday.getDate() + 7);
  }
  
  const diff = friday - etNow;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total: diff };
}

export function CBBEarlyAccessBanner() {
  const { user } = useAuth();
  const { isPremium, isFree } = useSubscription(user);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(getTimeUntilFriday());
  
  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilFriday());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Only show to free users
  if (!isFree) return null;
  
  return (
    <div className="cbb-early-access-banner">
      <div className="banner-content">
        <span className="banner-icon">🏆</span>
        <span className="banner-text">
          <strong>Free access ends Friday 11:59 PM ET!</strong> Lock <strong>40% off for life</strong> — <strong>$15.99/mo</strong> <s style={{opacity: 0.7}}>$25.99</s> • Code: <strong>HEREFIRST</strong>
          <span style={{ marginLeft: '8px', color: '#F59E0B', fontWeight: '700' }}>
            ⏰ {countdown.days}d {countdown.hours}h {countdown.minutes}m left
          </span>
        </span>
        <button 
          className="banner-cta"
          onClick={() => navigate('/pricing')}
        >
          Lock 40% Off →
        </button>
      </div>
    </div>
  );
}

export function CBBSoftPaywall({ games, onUpgradeClick, onDismiss }) {
  const { user } = useAuth();
  const { isPremium, isFree } = useSubscription(user);
  const { stats, loading: statsLoading } = useBasketballBetStats();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(getTimeUntilFriday());
  
  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilFriday());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Premium users see everything
  if (isPremium) {
    return null;
  }
  
  // Free users see only first game
  const freeGame = games[0];
  const lockedGames = games.slice(1);
  
  if (lockedGames.length === 0) {
    return null; // No locked content to show
  }
  
  // Calculate locked value
  const lockedEV = lockedGames.reduce((sum, g) => sum + (g.prediction?.bestEV || 0), 0);
  const avgGrade = lockedGames.length > 0 
    ? Math.round(lockedGames.filter(g => g.prediction?.grade === 'A+' || g.prediction?.grade === 'A').length / lockedGames.length * 100)
    : 0;
  
  return (
    <div className="cbb-soft-paywall">
      {/* Blurred Preview */}
      <div className="locked-picks-container">
        <div className="blurred-picks">
          {lockedGames.map((game, idx) => (
            <div key={idx} className="game-card-blur">
              <div className="blur-content">
                <div className="grade-hint">{game.prediction?.grade || 'A'}</div>
                <div className="ev-hint">+{(game.prediction?.bestEV || 0).toFixed(1)}%</div>
                <div className="team-hint">●●●●●●</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Unlock Panel */}
        <div className="unlock-panel">
          {/* Urgency Banner with Countdown */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              color: '#F87171', 
              fontWeight: '700', 
              fontSize: '0.938rem',
              marginBottom: '0.25rem'
            }}>
              🚨 Free access ends Friday 11:59 PM ET
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <span>⏰</span>
              <span style={{ 
                color: '#FBBF24', 
                fontWeight: '800',
                fontFamily: 'ui-monospace, monospace',
                letterSpacing: '0.05em'
              }}>
                {countdown.days}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>remaining</span>
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'rgba(255,255,255,0.6)', 
              marginTop: '0.375rem' 
            }}>
              Lock in <strong style={{ color: '#10B981' }}>40% off for life</strong> before it's gone!
            </div>
          </div>
          
          <div className="lock-icon">🔒</div>
          
          <h2 className="unlock-title">
            {lockedGames.length} More {lockedGames.length === 1 ? 'Play' : 'Plays'} Hidden
          </h2>
          
          {/* Verified Results - Live Data - Premium Visual */}
          {!statsLoading && stats.gradedBets > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#10B981',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                <span>📈</span> VERIFIED RESULTS • LIVE
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 0.5rem'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: '#10B981',
                    fontFeatureSettings: "'tnum'",
                    textShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                  }}>
                    +{stats.unitsWon.toFixed(1)}u
                  </div>
                  <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Season Profit
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 0.5rem'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: '#60A5FA',
                    fontFeatureSettings: "'tnum'"
                  }}>
                    {stats.winRate.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Win Rate
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 0.5rem'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: '#FBBF24',
                    fontFeatureSettings: "'tnum'"
                  }}>
                    ${Math.round(stats.unitsWon * 100).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    on $100 bets
                  </div>
                </div>
              </div>
              
              {/* Record badge */}
              <div style={{
                marginTop: '0.75rem',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.7)'
              }}>
                <span style={{ fontWeight: '700', color: '#10B981' }}>{stats.wins}-{stats.losses}</span> record • <span style={{ fontWeight: '600' }}>{stats.gradedBets}</span> verified picks
              </div>
            </div>
          )}
          
          {/* Founding Rate + Promo Code */}
          <div className="value-calculation">
            <div className="calc-row" style={{ justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>Founding Rate:</span>
              <span><strong style={{ color: '#10B981' }}>$15.99/mo</strong> <s style={{opacity: 0.5, fontSize: '0.85em'}}>$25.99</s></span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.813rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
              40% off locked forever — <strong style={{ color: '#F59E0B' }}>ends Friday!</strong>
            </div>
            {/* Promo code reminder */}
            <div style={{ 
              marginTop: '0.75rem',
              padding: '0.625rem 0.75rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '0.875rem'
            }}>
              <span style={{ color: '#D4AF37' }}>💰 Use code <strong>HEREFIRST</strong> at checkout</span>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                Sign up now before free access ends!
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="paywall-actions">
            <button 
              className="cta-primary"
              onClick={() => navigate('/pricing')}
            >
              Start Free Trial →
            </button>
            
            {/* Soft Dismiss - Full Access Preview */}
            <button 
              onClick={() => {
                // Call parent dismiss handler to show full content
                if (onDismiss) {
                  onDismiss();
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                marginTop: '0.75rem',
                padding: '0.5rem',
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              Continue with free preview →
            </button>
          </div>
          
          <div className="paywall-footer">
            <div className="trust-badge">✓ Cancel anytime</div>
            <div className="trust-badge">✓ All picks verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CBBUpgradeModal({ show, onClose }) {
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useBasketballBetStats();
  const [showingFullStats, setShowingFullStats] = useState(false);
  const [countdown, setCountdown] = useState(getTimeUntilFriday());
  
  // Update countdown every second
  useEffect(() => {
    if (!show) return;
    const timer = setInterval(() => {
      setCountdown(getTimeUntilFriday());
    }, 1000);
    return () => clearInterval(timer);
  }, [show]);
  
  if (!show) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cbb-upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {/* Header */}
        <div className="modal-header">
          <h2>🏀 Unlock Full CBB Dashboard</h2>
          <p className="modal-subtitle">
            Join sharp bettors profiting from data-driven insights
          </p>
        </div>
        
        {/* Performance Section */}
        <div className="modal-performance">
          <div className="performance-header">
            <h3>Our Verified Track Record</h3>
            {!statsLoading && (
              <span className="picks-count">{stats.gradedBets} Verified Picks</span>
            )}
          </div>
          
          {!statsLoading && stats.gradedBets > 0 ? (
            <>
              <div className="performance-grid">
                <div className="perf-card">
                  <div className="perf-value profit">+{stats.unitsWon.toFixed(1)}u</div>
                  <div className="perf-label">Season Profit</div>
                </div>
                <div className="perf-card">
                  <div className="perf-value">{stats.winRate.toFixed(1)}%</div>
                  <div className="perf-label">Win Rate</div>
                </div>
                <div className="perf-card">
                  <div className="perf-value roi">{stats.wins}-{stats.losses}</div>
                  <div className="perf-label">Record</div>
                </div>
              </div>
              
              {/* Remove grade breakdown since useBasketballBetStats doesn't have topGrades */}
              {false && (
                <div className="grade-breakdown">
                  <div className="grade-stat">
                    <span className="grade-badge aplus">A+</span>
                    <span className="grade-record">
                      {stats.topGrades.aPlus.wins}-{stats.topGrades.aPlus.total - stats.topGrades.aPlus.wins}
                    </span>
                    <span className="grade-profit">
                      {stats.topGrades.aPlus.profit >= 0 ? '+' : ''}{stats.topGrades.aPlus.profit.toFixed(1)}u
                    </span>
                  </div>
                  {stats.topGrades.a.total > 0 && (
                    <div className="grade-stat">
                      <span className="grade-badge a">A</span>
                      <span className="grade-record">
                        {stats.topGrades.a.wins}-{stats.topGrades.a.total - stats.topGrades.a.wins}
                      </span>
                      <span className="grade-profit">
                        {stats.topGrades.a.profit >= 0 ? '+' : ''}{stats.topGrades.a.profit.toFixed(1)}u
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="loading-stats">Loading performance data...</div>
          )}
        </div>
        
        {/* Pricing Section */}
        <div className="modal-pricing">
          <div className="pricing-card featured">
            <div className="early-access-badge">
              🏆 40% OFF FOR LIFE
            </div>
            
            <div className="price-display">
              <div className="price-main">
                <span className="price-amount">$15.99</span>
                <span className="price-period">/month</span>
                <span style={{marginLeft: '0.5rem', opacity: 0.6, textDecoration: 'line-through', fontSize: '1.25rem'}}>$25.99</span>
              </div>
              <div className="price-lock">
                🔒 Locked forever — thanks for being early
              </div>
            </div>
            
            <div className="features-list">
              <div className="feature">✅ All CBB picks daily (4-8 games)</div>
              <div className="feature">✅ Full model breakdowns + matchup intel</div>
              <div className="feature">✅ Real-time odds tracking</div>
              <div className="feature">✅ Closing line value analysis</div>
              <div className="feature">✅ Performance tracking dashboard</div>
              <div className="feature">✅ Priority Discord community</div>
            </div>
            
            <div className="limited-access-note" style={{ 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem'
            }}>
              <div style={{ marginBottom: '0.375rem' }}>
                🚨 <strong>Free access ends Friday 11:59 PM ET!</strong>
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Lock <strong style={{ color: '#10B981' }}>40% off for life</strong> — $15.99/mo • Code: <strong style={{ color: '#D4AF37' }}>HEREFIRST</strong>
              </div>
              <div style={{ 
                marginTop: '0.5rem',
                fontSize: '0.813rem',
                color: '#FBBF24',
                fontWeight: '700'
              }}>
                ⏰ {countdown.days}d {countdown.hours}h {countdown.minutes}m remaining
              </div>
            </div>
            
            <button 
              className="cta-trial"
              onClick={() => navigate('/pricing')}
            >
              Start Free Trial
            </button>
            
            <div className="trial-details">
              Full access • Cancel anytime • All picks verified
            </div>
          </div>
        </div>
        
        {/* Social Proof */}
        <div className="modal-social-proof">
          <div className="testimonials">
            <div className="testimonial">
              "Best CBB model I've found. +34u in 3 weeks." - @sharpbettor
            </div>
            <div className="testimonial">
              "The matchup intel alone is worth it. Consistent CLV." - @datadriven
            </div>
          </div>
          
          {!statsLoading && stats.gradedBets > 0 && (
            <div className="recent-results">
              <strong>Season Record:</strong> {stats.wins}-{stats.losses} ({stats.winRate.toFixed(1)}% win rate) • +{stats.unitsWon.toFixed(1)}u profit
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="modal-footer-actions">
          <button className="stay-free-btn" onClick={onClose}>
            Continue with free preview →
          </button>
        </div>
      </div>
    </div>
  );
}


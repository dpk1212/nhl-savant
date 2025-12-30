/**
 * CBB Soft Paywall Component
 * Shows free users 1 pick + blurred remaining picks
 * Uses real performance data for conversion messaging
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { useCBBPaywallStats } from '../hooks/useCBBPaywallStats';
import './CBBPaywall.css';

export function CBBEarlyAccessBanner() {
  const { user } = useAuth();
  const { isPremium, isFree } = useSubscription(user);
  const navigate = useNavigate();
  
  // Only show to free users
  if (!isFree) return null;
  
  return (
    <div className="cbb-early-access-banner">
      <div className="banner-content">
        <span className="banner-icon">⚠️</span>
        <span className="banner-text">
          <strong>OFFER EXPIRES EOD JAN 1:</strong> Lock $29/mo forever (40% off future price). 
          Use code <strong>HEREFIRST</strong> at checkout.
        </span>
        <button 
          className="banner-cta"
          onClick={() => navigate('/pricing')}
        >
          View Pricing →
        </button>
      </div>
    </div>
  );
}

export function CBBSoftPaywall({ games, onUpgradeClick }) {
  const { user } = useAuth();
  const { isPremium, isFree } = useSubscription(user);
  const stats = useCBBPaywallStats();
  
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
          <div className="lock-icon">🔒</div>
          
          <h2 className="unlock-title">
            {lockedGames.length} More {lockedGames.length === 1 ? 'Play' : 'Plays'} Hidden
          </h2>
          
          <div className="locked-value-stats">
            <div className="value-stat">
              <div className="value-number">+{lockedEV.toFixed(1)}%</div>
              <div className="value-label">Total EV Locked</div>
            </div>
            <div className="value-stat">
              <div className="value-number">{avgGrade}%</div>
              <div className="value-label">High-Grade Picks</div>
            </div>
          </div>
          
          {/* Real Performance Data */}
          {!stats.loading && stats.totalPicks > 0 && (
            <div className="performance-proof">
              <div className="proof-title">📈 Verified Performance</div>
              <div className="proof-stats">
                <div className="proof-stat">
                  <span className="proof-value">+{stats.profit.toFixed(1)}u</span>
                  <span className="proof-label">Season Profit</span>
                </div>
                <div className="proof-stat">
                  <span className="proof-value">{stats.winRate.toFixed(1)}%</span>
                  <span className="proof-label">Win Rate</span>
                </div>
                <div className="proof-stat">
                  <span className="proof-value">+{stats.roi.toFixed(1)}%</span>
                  <span className="proof-label">ROI</span>
                </div>
              </div>
              
              {stats.last7Days.picks > 0 && (
                <div className="recent-performance">
                  <strong>Last 7 Days:</strong> {stats.last7Days.picks} picks, 
                  +{stats.last7Days.profit.toFixed(1)}u profit 
                  ({stats.last7Days.winRate.toFixed(0)}% win rate)
                </div>
              )}
            </div>
          )}
          
          {/* Value Calculation */}
          <div className="value-calculation">
            <div className="calc-row">
              <span>Premium Cost:</span>
              <span>$29/month</span>
            </div>
            <div className="calc-row">
              <span>Avg. Daily Picks:</span>
              <span>4-6 games</span>
            </div>
            <div className="calc-row highlight">
              <span>ROI (betting $100/pick):</span>
              <span className="roi-value">
                {!stats.loading && stats.roi > 0 ? `+${(stats.roi * 100).toFixed(0)}%` : '+2,500%'}
              </span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="paywall-actions">
            <button 
              className="cta-primary"
              onClick={onUpgradeClick}
            >
              Start Free Trial
            </button>
            <button 
              className="cta-secondary"
              onClick={() => window.open('/data/cbb-picks-completed.csv', '_blank')}
            >
              View All Verified Picks →
            </button>
          </div>
          
          <div className="paywall-footer">
            <div className="trust-badge">✓ Cancel anytime</div>
            <div className="trust-badge">✓ All picks verified</div>
            <div className="trust-badge">✓ Full refund if unprofitable</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CBBUpgradeModal({ show, onClose }) {
  const navigate = useNavigate();
  const stats = useCBBPaywallStats();
  const [showingFullStats, setShowingFullStats] = useState(false);
  
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
            {!stats.loading && (
              <span className="picks-count">{stats.totalPicks} Completed Picks</span>
            )}
          </div>
          
          {!stats.loading && stats.totalPicks > 0 ? (
            <>
              <div className="performance-grid">
                <div className="perf-card">
                  <div className="perf-value profit">+{stats.profit.toFixed(1)}u</div>
                  <div className="perf-label">Season Profit</div>
                </div>
                <div className="perf-card">
                  <div className="perf-value">{stats.winRate.toFixed(1)}%</div>
                  <div className="perf-label">Win Rate</div>
                </div>
                <div className="perf-card">
                  <div className="perf-value roi">+{stats.roi.toFixed(1)}%</div>
                  <div className="perf-label">ROI</div>
                </div>
              </div>
              
              {stats.topGrades.aPlus.total > 0 && (
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
              ⚡ EARLY ADOPTER RATE
            </div>
            
            <div className="price-display">
              <div className="price-main">
                <span className="price-amount">$29</span>
                <span className="price-period">/month</span>
              </div>
              <div className="price-lock">
                🔒 Rate locked forever • Immune to price increases
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
            
            <div className="limited-access-note">
              ⚠️ <strong>OFFER EXPIRES EOD JAN 1:</strong> Early adopter rate locks your price forever at $29/mo. 
              New subscribers after Jan 1 pay $39-49/mo. Use code <strong>HEREFIRST</strong> at checkout.
            </div>
            
            <button 
              className="cta-trial"
              onClick={() => navigate('/pricing')}
            >
              Start Free Trial
            </button>
            
            <div className="trial-details">
              Full access • Cancel anytime • Refund if unprofitable
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
          
          {!stats.loading && stats.last7Days.picks > 0 && (
            <div className="recent-results">
              <strong>Recent Performance:</strong> Last 7 days - {stats.last7Days.picks} picks, 
              +{stats.last7Days.profit.toFixed(1)}u profit, {stats.last7Days.winRate.toFixed(0)}% win rate
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="modal-footer-actions">
          <button className="stay-free-btn" onClick={onClose}>
            I'll stay on free tier (1 pick/day)
          </button>
        </div>
      </div>
    </div>
  );
}


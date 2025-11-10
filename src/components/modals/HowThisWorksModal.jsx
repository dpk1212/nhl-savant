/**
 * How This Works Modal - Educational content for new users
 * Explains +EV concept, social proof, and drives trial signup
 */

import React from 'react';
import { X } from 'lucide-react';

const HowThisWorksModal = ({ isOpen, onClose, onTryFree, isMobile }) => {
  if (!isOpen) return null;

  const handleHideForever = () => {
    localStorage.setItem('nhlsavant_hide_how_it_works', 'true');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: isMobile ? '1rem' : '2rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
          border: '2px solid #00d9ff',
          borderRadius: '16px',
          padding: isMobile ? '1.5rem' : '2.5rem',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 0 50px rgba(0, 217, 255, 0.4)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobile ? '1rem' : '1.5rem',
            right: isMobile ? '1rem' : '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          <X size={20} color="#ffffff" />
        </button>

        {/* Title */}
        <h2 style={{
          fontSize: isMobile ? '1.5rem' : '1.75rem',
          fontWeight: '800',
          color: '#00d9ff',
          marginBottom: '1rem',
          marginTop: 0,
          textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
          letterSpacing: '-0.02em'
        }}>
          What Are You Actually Looking At?
        </h2>

        {/* Intro */}
        <p style={{
          fontSize: isMobile ? '0.938rem' : '1rem',
          color: 'rgba(255, 255, 255, 0.9)',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          You see a pick like <span style={{ color: '#00d9ff', fontWeight: '700' }}>"NSH ML +158"</span> with{' '}
          <span style={{ color: '#10B981', fontWeight: '700' }}>"+4.3% EV"</span>.
          <br /><br />
          Most people have no idea what that means. Here's the truth:
        </p>

        {/* Section 1: How Our Model Works */}
        <div style={{
          background: 'rgba(0, 217, 255, 0.05)',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em'
          }}>
            HOW OUR MODEL FINDS VALUE
          </h3>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            marginBottom: '1rem'
          }}>
            Our model analyzes <strong style={{ color: '#00d9ff' }}>20+ advanced metrics</strong> the public doesn't see:
          </p>
          <ul style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            margin: 0,
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Expected goals (xG) and shot quality</li>
            <li style={{ marginBottom: '0.5rem' }}>Goalie matchups and recent form</li>
            <li style={{ marginBottom: '0.5rem' }}>Rest days, travel, and schedule spots</li>
            <li style={{ marginBottom: '0.5rem' }}>Line combinations and defensive pairings</li>
            <li style={{ marginBottom: '0.5rem' }}>Special teams efficiency and matchups</li>
          </ul>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            Then it compares our probability to the market odds. When there's a gap? That's <strong style={{ color: '#10B981' }}>+EV (positive expected value)</strong>.
          </p>
        </div>

        {/* Section 2: The Market Gets It Wrong */}
        <div style={{
          background: 'rgba(255, 107, 107, 0.05)',
          border: '1px solid rgba(255, 107, 107, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em'
          }}>
            THE MARKET GETS IT WRONG
          </h3>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            marginBottom: '1rem'
          }}>
            The betting public makes predictable mistakes:
          </p>
          <ul style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            margin: 0,
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#ff6b6b' }}>Hammering overs</strong> because "goals are fun" (ignoring defensive matchups)</li>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#ff6b6b' }}>Betting heavy favorites</strong> blindly (inflating their odds)</li>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#ff6b6b' }}>Chasing big names</strong> like McDavid, Matthews (regardless of matchup)</li>
            <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#ff6b6b' }}>Ignoring goalie matchups</strong> and back-to-back situations</li>
          </ul>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            <strong style={{ color: '#00d9ff' }}>Example:</strong> Everyone thinks NYR has a 60% chance to beat NSH. But when you dig into rest days, goalie stats, defensive metrics—NSH is actually 55% to win. That 5% gap? <strong style={{ color: '#10B981' }}>That's where money lives.</strong>
          </p>
        </div>

        {/* Section 2: Why This Matters */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em'
          }}>
            WHY THIS MATTERS
          </h3>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            margin: 0
          }}>
            One +EV bet? You might lose. That's normal.
            <br /><br />
            <strong style={{ color: '#10B981' }}>One hundred +EV bets? You win big.</strong> That's math.
            <br /><br />
            Our job is finding those gaps before anyone else does.
          </p>
        </div>

        {/* Section 3: Proof */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.05)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em'
          }}>
            PROOF WE'RE ACTUALLY DOING IT
          </h3>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            marginBottom: '1rem'
          }}>
            We track everything publicly. Every pick. Every loss. Every win.
          </p>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: isMobile ? '1.75rem' : '2rem',
              fontWeight: '800',
              color: '#A78BFA',
              textShadow: '0 0 20px rgba(167, 139, 250, 0.6)',
              marginBottom: '0.25rem'
            }}>
              26% ROI
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'rgba(167, 139, 250, 0.8)',
              fontWeight: '600'
            }}>
              Since Oct 2025
            </div>
          </div>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            margin: 0
          }}>
            All results public. Nothing hidden.
            <br /><br />
            If you want to see what this looks like in real time, that's what the trial is for.
          </p>
        </div>

        {/* Section 4: No Hidden Agenda */}
        <p style={{
          fontSize: isMobile ? '0.875rem' : '0.938rem',
          color: 'rgba(255, 255, 255, 0.85)',
          lineHeight: '1.7',
          marginBottom: '2rem'
        }}>
          We're not trying to sell you on hype. We're just showing you picks with actual edge and letting you decide if you want to follow along.
          <br /><br />
          Click below to see today's picks and how this actually works.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem'
        }}>
          <button
            onClick={onTryFree}
            style={{
              flex: isMobile ? '0' : '1',
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(0, 217, 255, 0.1) 100%)',
              border: '2px solid #00d9ff',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
              textShadow: '0 0 10px rgba(0, 217, 255, 0.6)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.3) 0%, rgba(0, 217, 255, 0.15) 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(0, 217, 255, 0.1) 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Try Free →
          </button>

          <button
            onClick={handleHideForever}
            style={{
              flex: isMobile ? '0' : '1',
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.938rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            Got it, don't show again
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowThisWorksModal;


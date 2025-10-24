/**
 * Premium Splash Screen - Dynamic, Professional, Smooth
 * Enhanced with sophisticated animations and seamless transition
 */

import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('initial'); // initial, reveal, stats, complete, fade-out

  useEffect(() => {
    // Orchestrated animation sequence
    const timer1 = setTimeout(() => setPhase('reveal'), 100);      // Logo reveal
    const timer2 = setTimeout(() => setPhase('stats'), 800);       // Stats appear
    const timer3 = setTimeout(() => setPhase('complete'), 1400);   // Hold
    const timer4 = setTimeout(() => setPhase('fade-out'), 2000);   // Fade out
    const timer5 = setTimeout(() => onComplete(), 2300);           // Complete
    
    // Skip on any interaction
    const handleSkip = (e) => {
      e.preventDefault();
      setPhase('fade-out');
      setTimeout(onComplete, 300);
    };
    
    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);
    window.addEventListener('touchstart', handleSkip);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('touchstart', handleSkip);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9999,
      background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 50%, #0f1419 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: phase === 'fade-out' ? 0 : 1,
      transition: 'opacity 0.3s cubic-bezier(0.4, 0, 1, 1)',
      overflow: 'hidden'
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '200%',
        height: '200%',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.02) 50px, rgba(255,255,255,0.02) 51px),
          repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.02) 50px, rgba(255,255,255,0.02) 51px)
        `,
        opacity: phase === 'initial' ? 0 : 0.5,
        transition: 'opacity 1.5s ease'
      }} />
      
      {/* Main content */}
      <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo with stagger animation */}
        <div style={{
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <h1 style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: '900',
            letterSpacing: '-0.04em',
            margin: 0,
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 50%, #a1a1aa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            opacity: phase === 'initial' ? 0 : 1,
            transform: phase === 'initial' ? 'translateY(30px)' : 'translateY(0)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            textShadow: '0 0 60px rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}>
            NHL SAVANT
          </h1>
        </div>
        
        {/* Animated underline */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.8), transparent)',
          width: phase === 'reveal' || phase === 'stats' || phase === 'complete' ? '280px' : '0',
          maxWidth: '90vw',
          margin: '0 auto 1.5rem',
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
        }} />
        
        {/* Tagline */}
        <p style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
          fontWeight: '600',
          letterSpacing: '0.15em',
          margin: '0 0 2rem 0',
          color: 'rgba(255, 255, 255, 0.6)',
          textTransform: 'uppercase',
          opacity: phase === 'stats' || phase === 'complete' ? 1 : 0,
          transform: phase === 'stats' || phase === 'complete' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
        }}>
          Advanced NHL Analytics
        </p>
        
        {/* Dynamic stats preview */}
        <div style={{
          display: 'flex',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
          justifyContent: 'center',
          opacity: phase === 'stats' || phase === 'complete' ? 1 : 0,
          transform: phase === 'stats' || phase === 'complete' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s'
        }}>
          {/* Stat 1 */}
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: '#10b981',
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem',
              textShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
            }}>
              <span style={{
                display: 'inline-block',
                animation: phase === 'stats' || phase === 'complete' ? 'countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
              }}>
                {phase === 'stats' || phase === 'complete' ? '94.2%' : '0%'}
              </span>
            </div>
            <div style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Accuracy
            </div>
          </div>
          
          {/* Divider */}
          <div style={{
            width: '1px',
            background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)',
            alignSelf: 'stretch'
          }} />
          
          {/* Stat 2 */}
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: '#3b82f6',
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem',
              textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{
                display: 'inline-block',
                animation: phase === 'stats' || phase === 'complete' ? 'countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' : 'none'
              }}>
                {phase === 'stats' || phase === 'complete' ? '+12.4%' : '+0%'}
              </span>
            </div>
            <div style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Edge
            </div>
          </div>
          
          {/* Divider */}
          <div style={{
            width: '1px',
            background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)',
            alignSelf: 'stretch'
          }} />
          
          {/* Stat 3 */}
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: '#d4af37',
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem',
              textShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
            }}>
              <span style={{
                display: 'inline-block',
                animation: phase === 'stats' || phase === 'complete' ? 'countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' : 'none'
              }}>
                {phase === 'stats' || phase === 'complete' ? '1.2M+' : '0'}
              </span>
            </div>
            <div style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Data Points
            </div>
          </div>
        </div>
      </div>
      
      {/* Skip hint */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: '0.75rem',
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.25)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        opacity: phase === 'complete' ? 1 : 0,
        transition: 'opacity 0.5s ease 0.3s'
      }}>
        Press any key to continue
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Premium Splash Screen - Minimal, Fast, Elegant
 * Apple/Stripe/Linear inspired - First-class experience
 */

import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('fade-in'); // fade-in, reveal, fade-out

  useEffect(() => {
    // Phase 1: Fade in (0-0.5s)
    const timer1 = setTimeout(() => setPhase('reveal'), 300);
    
    // Phase 2: Reveal (0.5-1.5s)
    const timer2 = setTimeout(() => setPhase('fade-out'), 1500);
    
    // Phase 3: Complete (1.5-2s)
    const timer3 = setTimeout(() => onComplete(), 2000);
    
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
      background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: phase === 'fade-out' ? 0 : 1,
      transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Logo Container */}
      <div style={{
        textAlign: 'center',
        opacity: phase === 'fade-in' ? 0 : 1,
        transform: phase === 'fade-in' ? 'translateY(20px)' : 'translateY(0)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Main Logo */}
        <h1 style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: '900',
          letterSpacing: '-0.03em',
          margin: 0,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        }}>
          NHL SAVANT
        </h1>
        
        {/* Tagline */}
        <p style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
          fontWeight: '500',
          letterSpacing: '0.1em',
          margin: 0,
          color: 'rgba(255, 255, 255, 0.5)',
          textTransform: 'uppercase',
          opacity: phase === 'reveal' ? 1 : 0,
          transform: phase === 'reveal' ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
        }}>
          Advanced NHL Analytics
        </p>
        
        {/* Subtle accent line */}
        <div style={{
          width: phase === 'reveal' ? '120px' : '0',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)',
          margin: '1.5rem auto 0',
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
        }} />
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
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        opacity: phase === 'reveal' ? 1 : 0,
        transition: 'opacity 0.5s ease 0.6s'
      }}>
        Press any key to skip
      </div>
    </div>
  );
}

/**
 * CSS Fallback Splash Screen
 * For devices without WebGL support
 */

import { useEffect, useState } from 'react';

export default function SplashScreenFallback({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 3000);
    const completeTimer = setTimeout(() => onComplete(), 3500);
    
    const handleSkip = () => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    };
    
    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);
    window.addEventListener('touchstart', handleSkip);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('touchstart', handleSkip);
    };
  }, [onComplete]);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* Animated Logo */}
      <div
        style={{
          fontSize: '3rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #3B82F6 0%, #D4AF37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '2rem',
          animation: 'fadeInUp 1s ease-out',
        }}
      >
        🏒 NHL SAVANT
      </div>
      
      {/* Animated Stats */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '3rem',
          animation: 'fadeInUp 1s ease-out 0.3s backwards',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#60A5FA', fontWeight: '700' }}>4</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>GAMES</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#3B82F6', fontWeight: '700' }}>4</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>+EV</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#D4AF37', fontWeight: '700' }}>3</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>ELITE</div>
        </div>
      </div>
      
      {/* Loading Bar */}
      <div
        style={{
          width: '200px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '1px',
          overflow: 'hidden',
          animation: 'fadeInUp 1s ease-out 0.6s backwards',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6 0%, #D4AF37 100%)',
            animation: 'loadingBar 3s ease-out forwards',
          }}
        />
      </div>
      
      {/* Skip Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Press any key or tap to skip
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes loadingBar {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}






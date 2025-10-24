/**
 * useSplashScreen Hook
 * Manages splash screen visibility and first-visit tracking
 */

import { useState, useEffect } from 'react';

const SPLASH_SEEN_KEY = 'nhl_savant_splash_seen';

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  
  useEffect(() => {
    // Check if user has seen splash before
    const hasSeenSplash = localStorage.getItem(SPLASH_SEEN_KEY);
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const webglSupported = !!gl;
    
    setHasWebGL(webglSupported);
    
    // Show splash only on first visit
    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);
  
  const dismissSplash = () => {
    setShowSplash(false);
    localStorage.setItem(SPLASH_SEEN_KEY, 'true');
    localStorage.setItem('nhl_savant_splash_date', new Date().toISOString());
  };
  
  // Force show splash (for testing)
  const forceShowSplash = () => {
    localStorage.removeItem(SPLASH_SEEN_KEY);
    setShowSplash(true);
  };
  
  return {
    showSplash,
    hasWebGL,
    dismissSplash,
    forceShowSplash,
  };
}


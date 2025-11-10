/**
 * Conversion Buttons - "How This Works" & "Try Free"
 * Premium, sleek, side-by-side buttons for user education and trial signup
 */

import React, { useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import HowThisWorksModal from './modals/HowThisWorksModal';
import TryFreeModal from './modals/TryFreeModal';

const ConversionButtons = ({ user, isPremium, isMobile }) => {
  const [showHowThisWorks, setShowHowThisWorks] = useState(false);
  const [showTryFree, setShowTryFree] = useState(false);

  // Check if user has hidden "How This Works" permanently
  const [hideHowThisWorks] = useState(() => {
    return localStorage.getItem('nhlsavant_hide_how_it_works') === 'true';
  });

  // Premium users only see "How This Works" button (educational)
  const showTryFreeButton = !isPremium;

  return (
    <>
      {/* Buttons Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.5rem' : '0.75rem',
        marginBottom: isMobile ? '1.5rem' : '2rem',
        paddingTop: isMobile ? '0.5rem' : '1rem'
      }}>
        {/* How This Works Button */}
        <button
          onClick={() => setShowHowThisWorks(true)}
          style={{
            flex: showTryFreeButton ? '1' : '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: isMobile ? '0.75rem 1rem' : '0.875rem 1.25rem',
            background: 'transparent',
            border: '2px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '10px',
            color: '#00d9ff',
            fontSize: isMobile ? '0.813rem' : '0.875rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.02em',
            boxShadow: '0 0 0 rgba(0, 217, 255, 0)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.6)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 217, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
            e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 217, 255, 0)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <HelpCircle size={isMobile ? 16 : 18} strokeWidth={2.5} />
          <span>{isMobile ? 'How It Works' : 'How This Works'}</span>
        </button>

        {/* Try Free Button - Only show for non-premium users */}
        {showTryFreeButton && (
          <button
            onClick={() => setShowTryFree(true)}
            style={{
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: isMobile ? '0.75rem 1rem' : '0.875rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(0, 217, 255, 0.08) 100%)',
              border: '2px solid #00d9ff',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: isMobile ? '0.813rem' : '0.875rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '0.02em',
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
              textShadow: '0 0 10px rgba(0, 217, 255, 0.6)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.25) 0%, rgba(0, 217, 255, 0.15) 100%)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(0, 217, 255, 0.08) 100%)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <Sparkles size={isMobile ? 16 : 18} strokeWidth={2.5} />
            <span>Try Free</span>
          </button>
        )}
      </div>

      {/* Modals */}
      <HowThisWorksModal 
        isOpen={showHowThisWorks}
        onClose={() => setShowHowThisWorks(false)}
        onTryFree={() => {
          setShowHowThisWorks(false);
          setShowTryFree(true);
        }}
        isMobile={isMobile}
      />

      <TryFreeModal 
        isOpen={showTryFree}
        onClose={() => setShowTryFree(false)}
        isMobile={isMobile}
      />
    </>
  );
};

export default ConversionButtons;


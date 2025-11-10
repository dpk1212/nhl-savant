/**
 * Conversion Buttons - "How This Works"
 * Educational button for all users (premium + free)
 * Note: Auto-popup handles primary conversion flow
 */

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import HowThisWorksModal from './modals/HowThisWorksModal';

const ConversionButtons = ({ user, isPremium, isMobile }) => {
  const [showHowThisWorks, setShowHowThisWorks] = useState(false);

  // Check if user has hidden "How This Works" permanently
  const [hideHowThisWorks] = useState(() => {
    return localStorage.getItem('nhlsavant_hide_how_it_works') === 'true';
  });

  // Don't render if user has hidden it forever
  if (hideHowThisWorks) {
    return null;
  }

  return (
    <>
      {/* Button Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: isMobile ? '1.5rem' : '2rem',
        paddingTop: isMobile ? '0.5rem' : '1rem'
      }}>
        {/* How This Works Button */}
        <button
          onClick={() => setShowHowThisWorks(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: isMobile ? '0.75rem 1.25rem' : '0.875rem 1.5rem',
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
      </div>

      {/* Modal */}
      <HowThisWorksModal 
        isOpen={showHowThisWorks}
        onClose={() => setShowHowThisWorks(false)}
        isMobile={isMobile}
      />
    </>
  );
};

export default ConversionButtons;


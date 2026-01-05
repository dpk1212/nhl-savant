import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analytics, logEvent as firebaseLogEvent } from '../firebase/config';

// Wrapper for analytics logging
const logEvent = (eventName, params) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

/**
 * UpgradeModal - Redirects to pricing page
 * 
 * Instead of showing a modal popup, we now redirect users to the full
 * pricing page which includes the spin-for-discount feature.
 */
const UpgradeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // When modal opens, redirect to pricing page instead
  useEffect(() => {
    if (isOpen) {
      logEvent('upgrade_modal_redirect_to_pricing', { 
        source: 'free_limit_reached' 
      });
      onClose(); // Close the modal state
      navigate('/pricing'); // Redirect to pricing page with spin-for-discount
    }
  }, [isOpen, navigate, onClose]);
  
  // Return null - we redirect instead of showing a modal
  return null;
};

export default UpgradeModal;

import { useState, useEffect } from 'react';
import { Share2, Check } from 'lucide-react';
import { formatShareText, copyToClipboard, getConfidenceLevel } from '../utils/shareUtils';
import { getBetHook } from '../services/perplexityService';
import { canShareFiles, isMobileDevice } from '../utils/deviceDetection';
import ShareableCard from './ShareableCard';

/**
 * ShareButton - OPTIMIZED Premium share button
 * ONE BUTTON - Smart sharing with device-specific fallbacks
 */
const ShareButton = ({ 
  game, 
  bestEdge, 
  advantages = [], 
  angle = null,
  variant = 'compact', // 'compact' or 'full'
  isMobile = false 
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [fetchedAngle, setFetchedAngle] = useState(null);
  
  // Fetch betting angle from Firebase if not provided
  useEffect(() => {
    if (!angle && game?.awayTeam && game?.homeTeam && bestEdge) {
      const fetchAngle = async () => {
        try {
          const hook = await getBetHook(game.awayTeam, game.homeTeam);
          if (hook) {
            setFetchedAngle(hook);
          }
        } catch (error) {
          console.error('Error fetching bet angle for share:', error);
        }
      };
      fetchAngle();
    }
  }, [game?.awayTeam, game?.homeTeam, bestEdge, angle]);

  // Prepare share data
  const getShareData = () => {
    if (!game || !bestEdge) return null;

    const confidence = getConfidenceLevel(bestEdge.evPercent, bestEdge.modelProb);

    return {
      teams: {
        away: game.awayTeam,
        home: game.homeTeam
      },
      gameTime: game.gameTime,
      bet: {
        pick: bestEdge.pick,
        odds: bestEdge.odds,
        ev: bestEdge.evPercent,
        confidence: confidence
      },
      advantages: advantages,
      angle: angle || fetchedAngle
    };
  };

  // SIMPLIFIED: One button, one action
  const handleShare = async () => {
    const data = getShareData();
    if (!data) return;

    setIsSharing(true);
    setShareData(data);
  };

  const handleShareComplete = async (imageBlob) => {
    setIsSharing(false);
    const data = getShareData();
    const text = formatShareText(data);
    
    try {
      // SMART FALLBACK CHAIN - Try best option first, gracefully degrade
      
      // Option 1: Native share with image + text (BEST - mobile)
      if (navigator.share) {
        const file = new File([imageBlob], 'nhl-savant-pick.png', { type: 'image/png' });
        
        const sharePayload = {
          title: `NHL Savant Pick: ${data.teams.away} @ ${data.teams.home}`,
          text: text,
          files: [file]
        };

        // Check if we can share files
        const canShare = await canShareFiles();
        
        if (canShare && navigator.canShare && navigator.canShare(sharePayload)) {
          try {
            await navigator.share(sharePayload);
            setShareSuccess(true);
            setTimeout(() => setShareSuccess(false), 2000);
            setShareData(null);
            return;
          } catch (shareError) {
            // User cancelled or share failed, continue to fallback
            if (shareError.name === 'AbortError') {
              // User cancelled - just close
              setShareData(null);
              return;
            }
            console.log('Share with files failed, trying text-only...', shareError);
          }
        }
        
        // Option 2: Native share with TEXT only, download image separately
        try {
          await navigator.share({
            title: `NHL Savant Pick: ${data.teams.away} @ ${data.teams.home}`,
            text: text
          });
          
          // After sharing text, download the image
          const url = URL.createObjectURL(imageBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `nhl-savant-${data.teams.away}-${data.teams.home}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
          setShareData(null);
          return;
        } catch (shareError) {
          if (shareError.name === 'AbortError') {
            setShareData(null);
            return;
          }
          // Continue to fallback
        }
      }

      // Option 3: Copy text + download image (desktop fallback)
      const copySuccess = await copyToClipboard(text);
      
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nhl-savant-${data.teams.away}-${data.teams.home}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (copySuccess) {
        alert('✅ Text copied to clipboard!\n📸 Image downloaded!\n\nPaste the text and attach the image to share.');
      }

      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch (error) {
      console.error('All share methods failed:', error);
      // Last resort: just copy text
      const fallbackCopy = await copyToClipboard(text);
      if (fallbackCopy) {
        alert('Text copied to clipboard! You can share it manually.');
      } else {
        alert('Unable to share. Please try again.');
      }
    }
    
    setShareData(null);
  };

  const handleShareError = (error) => {
    setIsSharing(false);
    setShareData(null);
    console.error('Share generation failed:', error);
    alert('Failed to generate share. Please try again.');
  };

  // Compact variant (for header)
  if (variant === 'compact') {
    return (
      <>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
        `}</style>
        
        <button
            onClick={handleShare}
            disabled={isSharing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: isMobile ? '0.5rem' : '0.625rem 0.875rem',
              background: shareSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
              border: shareSuccess ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: shareSuccess ? '#10B981' : '#3B82F6',
              fontSize: '0.875rem',
              fontWeight: '700',
              cursor: isSharing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isSharing ? 0.8 : 1,
              animation: isSharing ? 'pulse 1.5s ease-in-out infinite' : 'none'
            }}
          onMouseEnter={(e) => {
            if (!isSharing) {
              e.currentTarget.style.background = shareSuccess ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.25)';
              e.currentTarget.style.borderColor = shareSuccess ? 'rgba(16, 185, 129, 0.5)' : 'rgba(59, 130, 246, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = shareSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)';
            e.currentTarget.style.borderColor = shareSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)';
          }}
        >
          {shareSuccess ? <Check size={16} /> : <Share2 size={16} />}
          {!isMobile && (shareSuccess ? 'Shared!' : isSharing ? 'Creating...' : 'Share')}
        </button>

        {shareData && (
          <ShareableCard
            shareData={shareData}
            onComplete={handleShareComplete}
            onError={handleShareError}
          />
        )}
      </>
    );
  }

  // Full variant (for hero card)
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
      
      <button
            onClick={handleShare}
            disabled={isSharing}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              width: '100%',
              background: shareSuccess
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
              border: shareSuccess ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '10px',
              color: shareSuccess ? '#10B981' : '#3B82F6',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: isSharing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: shareSuccess
                ? '0 4px 12px rgba(16, 185, 129, 0.15)'
                : '0 4px 12px rgba(59, 130, 246, 0.15)',
              opacity: isSharing ? 0.8 : 1,
              animation: isSharing ? 'pulse 1.5s ease-in-out infinite' : 'none'
            }}
        onMouseEnter={(e) => {
          if (!isSharing) {
            if (shareSuccess) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.15) 100%)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.25)';
            } else {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.25)';
            }
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (shareSuccess) {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.15)';
          } else {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
          }
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        >
          {shareSuccess ? <Check size={20} /> : <Share2 size={20} />}
          {shareSuccess ? 'Shared!' : isSharing ? 'Creating Share...' : 'Share This Pick'}
        </button>

      {shareData && (
        <ShareableCard
          shareData={shareData}
          onComplete={handleShareComplete}
          onError={handleShareError}
        />
      )}
    </>
  );
};

export default ShareButton;


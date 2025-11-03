import { useState, useEffect } from 'react';
import { Share2, Check } from 'lucide-react';
import { formatShareText, getConfidenceLevel } from '../utils/shareUtils';
import { getBetHook } from '../services/perplexityService';
import ShareableCard from './ShareableCard';

/**
 * ShareButton - SIMPLIFIED Premium share button
 * ONE BUTTON - Shares beautiful image + formatted text together
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
    
    try {
      // Try native share with BOTH image and text
      if (navigator.share && navigator.canShare) {
        const text = formatShareText(data);
        const file = new File([imageBlob], 'nhl-savant-pick.png', { type: 'image/png' });
        
        const shareData = {
          title: `NHL Savant Pick: ${data.teams.away} @ ${data.teams.home}`,
          text: text,
          files: [file]
        };

        // Check if we can share files
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
          setShareData(null);
          return;
        }
      }

      // Fallback: Just download the image (they can copy text manually)
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
    } catch (error) {
      console.error('Share failed:', error);
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
            opacity: isSharing ? 0.6 : 1
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
          {!isMobile && (shareSuccess ? 'Shared!' : 'Share')}
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
          opacity: isSharing ? 0.6 : 1
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
        {shareSuccess ? 'Shared!' : 'Share This Pick'}
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


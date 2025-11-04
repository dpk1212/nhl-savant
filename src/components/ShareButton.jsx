import { useState, useEffect } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { formatShareText, copyToClipboard, getConfidenceLevel } from '../utils/shareUtils';
import { getBetHook } from '../services/perplexityService';
import { isMobileDevice } from '../utils/deviceDetection';

/**
 * ShareButton - SIMPLIFIED Premium text share button
 * TEXT ONLY - Fast, reliable, mobile-optimized
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

  // SIMPLIFIED: Text-only sharing (FAST & RELIABLE)
  const handleShare = async () => {
    const data = getShareData();
    if (!data) return;

    setIsSharing(true);
    
    try {
      const text = formatShareText(data);
      const url = 'https://dpk1212.github.io/nhl-savant/';
      const title = `NHL Savant Pick: ${data.teams.away} @ ${data.teams.home}`;
      
      // Try native share first (mobile preferred)
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: text,
            url: url
          });
          
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
          setIsSharing(false);
          return;
        } catch (shareError) {
          // User cancelled or share not available
          if (shareError.name === 'AbortError') {
            setIsSharing(false);
            return;
          }
          // Fall through to clipboard
        }
      }
      
      // Fallback: Copy to clipboard
      const fullText = `${text}\n\n${url}`;
      const copySuccess = await copyToClipboard(fullText);
      
      if (copySuccess) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } else {
        alert('Unable to copy. Please try again.');
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert('Unable to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
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
          {!isMobile && (shareSuccess ? 'Shared!' : isSharing ? 'Sharing...' : 'Share')}
        </button>
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
          {shareSuccess ? 'Shared!' : isSharing ? 'Sharing...' : 'Share This Pick'}
        </button>
    </>
  );
};

export default ShareButton;


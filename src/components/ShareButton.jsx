import { useState, useRef, useEffect } from 'react';
import { Share2, Image, Copy, Check } from 'lucide-react';
import { handleNativeShare, formatShareText, copyToClipboard, getConfidenceLevel } from '../utils/shareUtils';
import { getBetHook } from '../services/perplexityService';
import ShareableCard from './ShareableCard';

/**
 * ShareButton - Premium share button with dropdown options
 * Offers: Native Share, Image Download, Copy Text
 */
const ShareButton = ({ 
  game, 
  bestEdge, 
  advantages = [], 
  angle = null,
  variant = 'compact', // 'compact' or 'full'
  isMobile = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [fetchedAngle, setFetchedAngle] = useState(null);
  const dropdownRef = useRef(null);
  
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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
      angle: angle || fetchedAngle // Use provided angle or fetched from Firebase
    };
  };

  const handleShare = async (method) => {
    const data = getShareData();
    if (!data) return;

    if (method === 'native') {
      const result = await handleNativeShare(data);
      if (result.success && result.method === 'clipboard') {
        // Fallback to clipboard - show success
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setIsOpen(false);
        }, 2000);
      } else if (result.success) {
        setIsOpen(false);
      }
    } else if (method === 'text') {
      const text = formatShareText(data);
      const success = await copyToClipboard(text);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setIsOpen(false);
        }, 2000);
      }
    } else if (method === 'image') {
      setIsGeneratingImage(true);
      setShareData(data);
    }
  };

  const handleImageComplete = () => {
    setIsGeneratingImage(false);
    setShareData(null);
    setImageSuccess(true);
    setTimeout(() => {
      setImageSuccess(false);
      setIsOpen(false);
    }, 2000);
  };

  const handleImageError = (error) => {
    setIsGeneratingImage(false);
    setShareData(null);
    console.error('Image generation failed:', error);
    alert('Failed to generate image. Please try again.');
  };

  // Compact variant (for header)
  if (variant === 'compact') {
    return (
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: isMobile ? '0.5rem' : '0.625rem 0.875rem',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            color: '#3B82F6',
            fontSize: '0.875rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
          }}
        >
          <Share2 size={16} />
          {!isMobile && 'Share'}
        </button>

        {isOpen && (
          <DropdownMenu
            onShare={handleShare}
            copySuccess={copySuccess}
            imageSuccess={imageSuccess}
            isGeneratingImage={isGeneratingImage}
          />
        )}

        {shareData && (
          <ShareableCard
            shareData={shareData}
            onComplete={handleImageComplete}
            onError={handleImageError}
          />
        )}
      </div>
    );
  }

  // Full variant (for hero card)
  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          width: '100%',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '10px',
          color: '#3B82F6',
          fontSize: '1rem',
          fontWeight: '800',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
        }}
      >
        <Share2 size={20} />
        Share This Pick
      </button>

      {isOpen && (
        <DropdownMenu
          onShare={handleShare}
          copySuccess={copySuccess}
          imageSuccess={imageSuccess}
          isGeneratingImage={isGeneratingImage}
          fullWidth={true}
        />
      )}

      {shareData && (
        <ShareableCard
          shareData={shareData}
          onComplete={handleImageComplete}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

/**
 * Dropdown Menu Component
 */
const DropdownMenu = ({ onShare, copySuccess, imageSuccess, isGeneratingImage, fullWidth = false }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        right: fullWidth ? 0 : 'auto',
        minWidth: fullWidth ? 'auto' : '240px',
        background: 'linear-gradient(135deg, #1A1F3A 0%, #0F1628 100%)',
        border: '1px solid rgba(100, 116, 139, 0.3)',
        borderRadius: '12px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
        padding: '0.5rem',
        zIndex: 1000,
        animation: 'slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Native Share */}
      <button
        onClick={() => onShare('native')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '0.875rem 1rem',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          color: '#F1F5F9',
          fontSize: '0.9375rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Share2 size={18} color="#3B82F6" />
        <span>Share</span>
        {copySuccess && (
          <Check size={16} color="#10B981" style={{ marginLeft: 'auto' }} />
        )}
      </button>

      {/* Save as Image */}
      <button
        onClick={() => onShare('image')}
        disabled={isGeneratingImage}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '0.875rem 1rem',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          color: isGeneratingImage ? '#64748B' : '#F1F5F9',
          fontSize: '0.9375rem',
          fontWeight: '600',
          cursor: isGeneratingImage ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left',
          opacity: isGeneratingImage ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (!isGeneratingImage) {
            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Image size={18} color={isGeneratingImage ? '#64748B' : '#A78BFA'} />
        <span>{isGeneratingImage ? 'Generating...' : 'Save as Image'}</span>
        {imageSuccess && (
          <Check size={16} color="#10B981" style={{ marginLeft: 'auto' }} />
        )}
      </button>

      {/* Copy Text */}
      <button
        onClick={() => onShare('text')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '0.875rem 1rem',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          color: '#F1F5F9',
          fontSize: '0.9375rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Copy size={18} color="#10B981" />
        <span>Copy Text</span>
        {copySuccess && (
          <Check size={16} color="#10B981" style={{ marginLeft: 'auto' }} />
        )}
      </button>
    </div>
  );
};

export default ShareButton;


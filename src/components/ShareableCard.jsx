import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { Loader } from 'lucide-react';

/**
 * ShareableCard - Generates PREMIUM shareable images
 * SIMPLIFIED - No preview, just generates and returns blob
 */
const ShareableCard = ({ shareData, onComplete, onError }) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (shareData && isGenerating) {
      generateImage();
    }
  }, [shareData]);

  const generateImage = async () => {
    if (!cardRef.current) return;

    try {
      // Wait for fonts and rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      setDownloadProgress(30);

      // Generate high-quality canvas
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0A0E27',
        scale: 3, // ULTRA HIGH QUALITY
        logging: false,
        width: 1200,
        height: 675,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: true
      });

      setDownloadProgress(70);

      // Convert to blob and return to parent
      canvas.toBlob((blob) => {
        if (blob) {
          setDownloadProgress(100);
          setIsGenerating(false);
          onComplete?.(blob);
        } else {
          onError?.('Failed to create image blob');
          setIsGenerating(false);
        }
      }, 'image/png', 1.0);
    } catch (err) {
      console.error('Image generation error:', err);
      onError?.(err.message);
      setIsGenerating(false);
    }
  };

  if (!shareData) return null;

  const { teams, gameTime, bet, advantages = [], angle } = shareData;

  // Calculate model probability percentage for visual display
  const modelProbPercent = (bet.confidence.level === 'VERY HIGH' ? 65 : 
                            bet.confidence.level === 'HIGH' ? 58 :
                            bet.confidence.level === 'MEDIUM' ? 52 : 48);

  return (
    <>
      {/* Hidden Card for Rendering */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
        width: '1200px',
        height: '675px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#F1F5F9',
        overflow: 'hidden'
      }}
    >
      {/* PREMIUM REDESIGNED BACKGROUND */}
      <div style={{
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #0A0E27 0%, #141B2D 30%, #1A1F3A 60%, #0F1628 100%)
        `,
        padding: '50px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Premium Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.03) 50%, transparent 100%),
            radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.05) 0%, transparent 40%),
            radial-gradient(ellipse at bottom left, rgba(59, 130, 246, 0.05) 0%, transparent 40%)
          `,
          pointerEvents: 'none'
        }} />
        
        {/* Grid Pattern Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(100, 116, 139, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 116, 139, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          opacity: 0.3
        }} />

        {/* Premium Header with Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '35px',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #F1F5F9 0%, #D4AF37 50%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              marginBottom: '8px'
            }}>
              NHL SAVANT
            </div>
            <div style={{
              fontSize: '16px',
              color: '#64748B',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              AI-Powered Betting Analysis
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '12px 20px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#10B981',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '4px'
            }}>
              VALUE PICK
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '900',
              color: '#10B981',
              fontFeatureSettings: '"tnum"'
            }}>
              +{bet.ev.toFixed(1)}% EV
            </div>
          </div>
        </div>

        {/* Matchup with Enhanced Typography */}
        <div style={{
          marginBottom: '32px',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#64748B',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '12px'
          }}>
            {gameTime || 'Today\'s Game'}
          </div>
          <div style={{
            fontSize: '72px',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            color: '#F1F5F9',
            lineHeight: '1',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            {teams.away} <span style={{ 
              color: '#64748B', 
              fontWeight: '400',
              fontSize: '56px',
              verticalAlign: 'middle'
            }}>@</span> {teams.home}
          </div>
        </div>

        {/* Hero Bet Section - REDESIGNED */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 50%, rgba(59, 130, 246, 0.06) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '28px',
          position: 'relative',
          zIndex: 1,
          boxShadow: `
            0 8px 32px rgba(16, 185, 129, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `
        }}>
          {/* Glow Effect */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3))',
            borderRadius: '20px',
            filter: 'blur(8px)',
            opacity: 0.3,
            zIndex: -1
          }} />
          
          {/* Header Row: Pick + Confidence Badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{
                fontSize: '16px',
                color: '#64748B',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '10px'
              }}>
                💰 RECOMMENDED BET
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#F1F5F9',
                letterSpacing: '-0.02em',
                lineHeight: '1',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                {bet.pick}
              </div>
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${bet.confidence.color}30, ${bet.confidence.color}20)`,
              border: `2px solid ${bet.confidence.color}60`,
              borderRadius: '12px',
              padding: '12px 20px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '12px',
                color: bet.confidence.color,
                fontWeight: '700',
                marginBottom: '4px',
                letterSpacing: '0.05em'
              }}>
                CONFIDENCE
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '900',
                color: bet.confidence.color
              }}>
                {bet.confidence.level}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Odds */}
            <div style={{
              background: 'rgba(100, 116, 139, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(100, 116, 139, 0.3)'
            }}>
              <div style={{
                fontSize: '13px',
                color: '#94A3B8',
                fontWeight: '700',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Odds
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#F1F5F9',
                fontFeatureSettings: '"tnum"'
              }}>
                {bet.odds > 0 ? '+' : ''}{bet.odds}
              </div>
            </div>

            {/* Expected Value */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}>
              <div style={{
                fontSize: '13px',
                color: '#10B981',
                fontWeight: '700',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Expected Value
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#10B981',
                fontFeatureSettings: '"tnum"'
              }}>
                +{bet.ev.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Probability Visualization */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid rgba(100, 116, 139, 0.2)'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#94A3B8',
              fontWeight: '700',
              marginBottom: '10px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textAlign: 'center'
            }}>
              Model Win Probability
            </div>
            <div style={{
              position: 'relative',
              height: '28px',
              background: 'rgba(100, 116, 139, 0.2)',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(100, 116, 139, 0.3)'
            }}>
              {/* Probability Bar */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${modelProbPercent}%`,
                background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                borderRadius: '14px',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                transition: 'width 1s ease-out'
              }} />
              {/* Percentage Label */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '900',
                color: '#F1F5F9',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                fontFeatureSettings: '"tnum"'
              }}>
                {modelProbPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Key Advantages */}
        {advantages.length > 0 && (
          <div style={{
            background: 'rgba(100, 116, 139, 0.1)',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '32px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              fontSize: '18px',
              color: '#10B981',
              fontWeight: '800',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '22px' }}>✓</span>
              KEY ADVANTAGES
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {advantages.slice(0, 3).map((adv, idx) => {
                // Clean up bullet if it exists
                const cleanAdv = adv.replace(/^[•\-\*]\s*/, '');
                return (
                  <div
                    key={idx}
                    style={{
                      fontSize: '22px',
                      color: '#E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      lineHeight: '1.4'
                    }}
                  >
                    <span style={{
                      color: '#10B981',
                      fontSize: '28px',
                      fontWeight: 'bold'
                    }}>•</span>
                    {cleanAdv}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Betting Angle */}
        {angle && (
          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              fontSize: '20px',
              color: '#E2E8F0',
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}>
              "{angle}"
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '60px',
          right: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(100, 116, 139, 0.2)',
          paddingTop: '24px'
        }}>
          <div style={{
            fontSize: '18px',
            color: '#64748B',
            fontWeight: '600'
          }}>
            📊 Powered by NHL Savant
          </div>
          <div style={{
            fontSize: '18px',
            color: '#94A3B8',
            fontWeight: '600'
          }}>
            nhlsavant.com
          </div>
        </div>
      </div>
    </div>

      {/* SIMPLIFIED LOADING STATE */}
      {isGenerating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            textAlign: 'center',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {/* Animated Loader */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              position: 'relative'
            }}>
              <Loader
                size={80}
                color="#10B981"
                style={{
                  animation: 'spin 1s linear infinite'
                }}
              />
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>

            {/* Loading Text */}
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#F1F5F9',
              marginBottom: '12px'
            }}>
              Creating Your Share...
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '300px',
              height: '6px',
              background: 'rgba(100, 116, 139, 0.3)',
              borderRadius: '3px',
              overflow: 'hidden',
              margin: '0 auto'
            }}>
              <div style={{
                width: `${downloadProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                borderRadius: '3px',
                transition: 'width 0.3s ease-out',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
              }} />
            </div>

            <div style={{
              fontSize: '14px',
              color: '#94A3B8',
              marginTop: '12px'
            }}>
              {downloadProgress < 30 && 'Preparing canvas...'}
              {downloadProgress >= 30 && downloadProgress < 70 && 'Rendering premium graphics...'}
              {downloadProgress >= 70 && 'Almost ready...'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareableCard;


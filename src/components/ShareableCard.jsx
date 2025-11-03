import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { downloadShareImage } from '../utils/shareUtils';

/**
 * ShareableCard - Generates beautiful shareable images
 * Hidden component that renders a premium card for social media sharing
 */
const ShareableCard = ({ shareData, onComplete, onError }) => {
  const cardRef = useRef(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (shareData && !isRendering) {
      generateImage();
    }
  }, [shareData]);

  const generateImage = async () => {
    if (!cardRef.current || isRendering) return;

    setIsRendering(true);

    try {
      // Wait for any fonts/images to load
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate canvas from the card
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0A0E27',
        scale: 2, // Higher quality
        logging: false,
        width: 1200,
        height: 675
      });

      // Download the image
      const result = await downloadShareImage(canvas, shareData);
      
      if (result.success) {
        onComplete?.(result);
      } else {
        onError?.(result.error);
      }
    } catch (err) {
      console.error('Image generation error:', err);
      onError?.(err.message);
    } finally {
      setIsRendering(false);
    }
  };

  if (!shareData) return null;

  const { teams, gameTime, bet, advantages = [], angle } = shareData;

  return (
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
      {/* Background with gradient */}
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #0A0E27 100%)',
        padding: '60px',
        position: 'relative'
      }}>
        {/* Decorative gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              fontSize: '42px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}>
              NHL SAVANT
            </div>
          </div>
          <div style={{
            fontSize: '20px',
            color: '#94A3B8',
            fontWeight: '600'
          }}>
            {gameTime || 'Today'}
          </div>
        </div>

        {/* Matchup */}
        <div style={{
          marginBottom: '40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            fontSize: '64px',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            color: '#F1F5F9',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            {teams.away} <span style={{ color: '#64748B', fontWeight: '400' }}>@</span> {teams.home}
          </div>
        </div>

        {/* Hero Bet Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          padding: '36px',
          marginBottom: '32px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
        }}>
          {/* Best Value Header */}
          <div style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#10B981',
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '28px' }}>💰</span>
            BEST VALUE
          </div>

          {/* Pick and Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '24px',
            alignItems: 'center'
          }}>
            {/* Pick */}
            <div>
              <div style={{
                fontSize: '18px',
                color: '#94A3B8',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '700'
              }}>
                The Bet
              </div>
              <div style={{
                fontSize: '38px',
                fontWeight: '900',
                color: '#F1F5F9',
                letterSpacing: '-0.01em'
              }}>
                {bet.pick}
              </div>
            </div>

            {/* EV */}
            <div>
              <div style={{
                fontSize: '16px',
                color: '#94A3B8',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '700'
              }}>
                Value
              </div>
              <div style={{
                fontSize: '42px',
                fontWeight: '900',
                color: '#10B981',
                fontFeatureSettings: '"tnum"'
              }}>
                +{bet.ev.toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#64748B' }}>EV</div>
            </div>

            {/* Confidence */}
            <div>
              <div style={{
                fontSize: '16px',
                color: '#94A3B8',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '700'
              }}>
                Confidence
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '900',
                color: bet.confidence.color,
                letterSpacing: '-0.01em'
              }}>
                {bet.confidence.level}
              </div>
            </div>

            {/* Odds */}
            <div>
              <div style={{
                fontSize: '16px',
                color: '#94A3B8',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '700'
              }}>
                Odds
              </div>
              <div style={{
                fontSize: '42px',
                fontWeight: '900',
                color: '#F1F5F9',
                fontFeatureSettings: '"tnum"'
              }}>
                {bet.odds > 0 ? '+' : ''}{bet.odds}
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
  );
};

export default ShareableCard;


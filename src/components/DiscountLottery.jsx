import { useState, useEffect } from 'react';
import { Gift, Sparkles, Clock } from 'lucide-react';

const PRIZES = [
  { code: 'Savant15', discount: 15, color: '#8B5CF6', weight: 50 },
  { code: 'MVP25', discount: 25, color: '#3B82F6', weight: 30 },
  { code: 'NHL40', discount: 40, color: '#10B981', weight: 15 },
  { code: 'BANG55', discount: 55, color: '#D4AF37', weight: 5 }
];

export default function DiscountLottery({ 
  onCodeRevealed, 
  variant = 'welcome',  // 'welcome' | 'daily-return'
  spinsRemaining: propSpinsRemaining = null,
  onSpinComplete = null
}) {
  const [hasSpun, setHasSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [spinsRemaining, setSpinsRemaining] = useState(propSpinsRemaining);

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nhl_savant_discount_spin');
    if (stored) {
      const data = JSON.parse(stored);
      const expiresAt = new Date(data.expiresAt);
      
      if (expiresAt > new Date()) {
        setHasSpun(true);
        setWonPrize(data.prize);
        setTimeLeft(Math.floor((expiresAt - new Date()) / 1000));
      } else {
        // Expired, clear it
        localStorage.removeItem('nhl_savant_discount_spin');
      }
    }

    // Set spins remaining from prop or mock data
    if (propSpinsRemaining !== null) {
      setSpinsRemaining(propSpinsRemaining);
    } else {
      // Mock "spins remaining" (reset daily) for welcome variant
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem('nhl_savant_spins_reset');
      if (lastReset !== today) {
        localStorage.setItem('nhl_savant_spins_reset', today);
        localStorage.setItem('nhl_savant_spins_left', '47'); // Start with random number
      }
      setSpinsRemaining(localStorage.getItem('nhl_savant_spins_left') || '47');
    }
  }, [propSpinsRemaining]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          localStorage.removeItem('nhl_savant_discount_spin');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Weighted random selection
  const selectPrize = () => {
    const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const prize of PRIZES) {
      random -= prize.weight;
      if (random <= 0) return prize;
    }
    return PRIZES[0];
  };

  const handleSpin = () => {
    setIsSpinning(true);

    // Spin animation duration
    setTimeout(() => {
      const prize = selectPrize();
      setWonPrize(prize);
      setHasSpun(true);
      setIsSpinning(false);
      
      // Set 10 minute expiry
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      localStorage.setItem('nhl_savant_discount_spin', JSON.stringify({
        prize,
        expiresAt: expiresAt.toISOString()
      }));
      setTimeLeft(600); // 10 minutes in seconds

      // Decrease spins remaining
      const remaining = parseInt(spinsRemaining) - 1;
      setSpinsRemaining(remaining.toString());
      localStorage.setItem('nhl_savant_spins_left', remaining.toString());

      // Notify parent component
      if (onCodeRevealed) {
        onCodeRevealed(prize.code);
      }
      
      // Notify spin complete callback
      if (onSpinComplete) {
        onSpinComplete(prize.code);
      }
    }, 3000); // 3 second spin
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasSpun && wonPrize && timeLeft > 0) {
    // Show won prize with countdown
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: `2px solid ${wonPrize.color}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 0%, ${wonPrize.color}40, transparent 70%)`,
          opacity: 0.3,
          animation: 'pulse 2s ease-in-out infinite'
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Trophy icon */}
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${wonPrize.color}, ${wonPrize.color}80)`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${wonPrize.color}60`
          }}>
            <Sparkles size={24} color="#FFFFFF" />
          </div>

          {/* Win message */}
          <div style={{
            fontSize: '24px',
            fontWeight: '900',
            color: wonPrize.color,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em'
          }}>
            🎉 YOU WON {wonPrize.discount}% OFF!
          </div>

          {/* Promo code */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '12px 24px',
            borderRadius: '8px',
            border: `1px solid ${wonPrize.color}40`,
            marginBottom: '16px'
          }}>
            <span style={{
              fontSize: '11px',
              color: '#94A3B8',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              CODE:
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: '800',
              color: wonPrize.color,
              fontFamily: 'monospace',
              letterSpacing: '0.1em'
            }}>
              {wonPrize.code}
            </span>
          </div>

          {/* Countdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '14px',
            color: '#F59E0B',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            <Clock size={16} />
            <span>Expires in {formatTime(timeLeft)}</span>
          </div>

          {/* CTA */}
          <div style={{
            fontSize: '12px',
            color: '#94A3B8',
            marginBottom: '8px'
          }}>
            Code will be auto-applied at checkout
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // Show spin wheel
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
      border: '2px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Sparkle overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
        animation: 'shimmer 2s ease-in-out infinite'
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <Gift size={20} color="#D4AF37" />
          <span style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#D4AF37',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {variant === 'daily-return' ? 'WELCOME BACK! SPIN FOR A DISCOUNT' : 'SPIN FOR YOUR EXCLUSIVE DISCOUNT'}
          </span>
        </div>
        
        {/* Show spins remaining for daily-return variant */}
        {variant === 'daily-return' && spinsRemaining !== null && (
          <div style={{
            fontSize: '14px',
            color: '#60A5FA',
            fontWeight: '700',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <Sparkles size={16} />
            <span>{spinsRemaining} {spinsRemaining === 1 ? 'Spin' : 'Spins'} Left Today</span>
          </div>
        )}
        
        {/* Subtitle for daily-return variant */}
        {variant === 'daily-return' && (
          <div style={{
            fontSize: '13px',
            color: '#94A3B8',
            marginBottom: '16px',
            lineHeight: '1.4'
          }}>
            Tired of losing bets without a system?<br/>
            Try Premium Risk-Free!
          </div>
        )}

        {/* Prize Wheel */}
        <div style={{
          width: '180px',
          height: '180px',
          margin: '0 auto 20px',
          position: 'relative'
        }}>
          {/* Wheel */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'relative',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.5)',
            transform: isSpinning ? 'rotate(1800deg)' : 'rotate(0deg)',
            transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
            background: 'conic-gradient(from 0deg, #8B5CF6 0deg 180deg, #3B82F6 180deg 270deg, #10B981 270deg 337.5deg, #D4AF37 337.5deg 360deg)'
          }}>
            {/* Center circle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E293B, #0F172A)',
              border: '3px solid #D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
            }}>
              🎰
            </div>
          </div>

          {/* Pointer */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '20px solid #D4AF37',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
            zIndex: 10
          }} />
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          style={{
            width: '100%',
            padding: '16px',
            background: isSpinning 
              ? 'linear-gradient(135deg, #64748B, #475569)'
              : 'linear-gradient(135deg, #D4AF37, #B8941F)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '800',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: isSpinning ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: isSpinning 
              ? 'none' 
              : '0 4px 12px rgba(212, 175, 55, 0.4)',
            opacity: isSpinning ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isSpinning) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSpinning) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
            }
          }}
        >
          {isSpinning ? (
            <>
              <Sparkles size={16} style={{ display: 'inline', marginRight: '8px' }} />
              SPINNING...
            </>
          ) : (
            '🎲 SPIN THE WHEEL'
          )}
        </button>

        {/* Scarcity messaging */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#F59E0B',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <Clock size={14} />
            <span>Only {spinsRemaining} codes remaining today</span>
          </div>
          <div style={{
            fontSize: '11px',
            color: '#94A3B8'
          }}>
            One spin per user • Expires in 10 minutes
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}


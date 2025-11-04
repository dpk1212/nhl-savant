import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react';
import TourProgress from './TourProgress';

/**
 * Tour Card Component
 * Glassmorphic floating card with tour instructions
 */
const TourCard = ({
  title,
  description,
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  position,
  isMobile
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 100 : 20,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      y: isMobile ? 100 : -20,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'fixed',
        width: isMobile ? 'calc(100% - 32px)' : '400px',
        maxWidth: isMobile ? 'none' : '90vw',
        zIndex: 10001,
        pointerEvents: 'auto'
      }}
    >
      {/* Glassmorphic Card */}
      <div
        style={{
          background: 'rgba(21, 25, 35, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '16px',
          boxShadow: `
            0 0 40px rgba(212, 175, 55, 0.25),
            0 20px 60px rgba(0, 0, 0, 0.6),
            inset 0 0 0 1px rgba(255, 255, 255, 0.05)
          `,
          padding: isMobile ? '1.5rem' : '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Shimmer overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
            animation: 'shimmer 3s infinite',
            pointerEvents: 'none'
          }}
        />

        {/* Close button */}
        <button
          onClick={onSkip}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(148, 163, 184, 0.1)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            e.currentTarget.style.color = 'var(--color-danger)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
          aria-label="Skip tour"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Progress indicator */}
        {totalSteps > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <TourProgress currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        )}

        {/* Content */}
        <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          {/* Title with icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            {isLastStep && <Sparkles size={20} color="var(--color-accent)" />}
            <h3 style={{
              fontSize: isMobile ? '1.125rem' : '1.25rem',
              fontWeight: '700',
              color: 'var(--color-accent)',
              margin: 0,
              textShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
            }}>
              {title}
            </h3>
          </div>

          {/* Description */}
          <p style={{
            fontSize: isMobile ? '0.938rem' : '1rem',
            lineHeight: '1.7',
            color: 'var(--color-text-secondary)',
            margin: 0
          }}>
            {description}
          </p>
        </div>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Previous button */}
          {!isFirstStep ? (
            <button
              onClick={onPrev}
              style={{
                flex: '0 0 auto',
                padding: '0.75rem 1rem',
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              Previous
            </button>
          ) : (
            <div />
          )}

          {/* Next/Complete button */}
          <button
            onClick={isLastStep ? onComplete : onNext}
            style={{
              flex: isFirstStep ? '1 1 auto' : '0 0 auto',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, var(--color-accent) 0%, #C4A02C 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'var(--color-background)',
              fontSize: '0.875rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            }}
          >
            {isLastStep ? (
              <>
                <Sparkles size={16} strokeWidth={2.5} />
                Got It!
              </>
            ) : (
              <>
                Next
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;


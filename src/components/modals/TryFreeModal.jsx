/**
 * Try Free Modal - Pre-signup conversion modal
 * Shows value proposition and drives users to pricing page
 */

import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TryFreeModal = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChoosePlan = () => {
    onClose();
    navigate('/account'); // Navigate to account page where pricing/subscription is handled
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: isMobile ? '1rem' : '2rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
          border: '2px solid #00d9ff',
          borderRadius: '16px',
          padding: isMobile ? '1.5rem' : '2.5rem',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 0 50px rgba(0, 217, 255, 0.4)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobile ? '1rem' : '1.5rem',
            right: isMobile ? '1rem' : '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          <X size={20} color="#ffffff" />
        </button>

        {/* Title */}
        <h2 style={{
          fontSize: isMobile ? '1.5rem' : '1.75rem',
          fontWeight: '800',
          color: '#00d9ff',
          marginBottom: '1rem',
          marginTop: 0,
          textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
          letterSpacing: '-0.02em'
        }}>
          You're About to See Exactly How This Works
        </h2>

        {/* Intro - What Happens */}
        <p style={{
          fontSize: isMobile ? '0.938rem' : '1rem',
          color: 'rgba(255, 255, 255, 0.9)',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          Here's what happens:
        </p>

        {/* Steps */}
        <div style={{ marginBottom: '2rem' }}>
          {[
            {
              num: '1️⃣',
              title: 'You sign up (30 seconds)',
              desc: null
            },
            {
              num: '2️⃣',
              title: 'You see today's picks',
              desc: 'Full breakdowns on why each one has edge. The matchups. The data. Everything.'
            },
            {
              num: '3️⃣',
              title: 'You watch it play out',
              desc: 'Free trial means full access. See the model in real time.'
            }
          ].map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}
            >
              <span style={{
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                {step.num}
              </span>
              <div>
                <div style={{
                  fontSize: isMobile ? '0.938rem' : '1rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: step.desc ? '0.25rem' : 0
                }}>
                  {step.title}
                </div>
                {step.desc && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.5'
                  }}>
                    {step.desc}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section 1: Why Free Trials Convert */}
        <div style={{
          background: 'rgba(0, 217, 255, 0.05)',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em'
          }}>
            WHY FREE TRIALS ACTUALLY CONVERT
          </h3>
          <p style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.7',
            margin: 0
          }}>
            People who try this don't leave.
            <br /><br />
            <strong style={{ color: '#00d9ff' }}>Why?</strong> Because they see the picks work. They see the process is real. They see we're not like Twitter touts.
            <br /><br />
            After your free trial, most people stay. That's not pressure. That's just what happens when you show people something real.
          </p>
        </div>

        {/* Section 2: What You'll See Immediately */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em'
          }}>
            WHAT YOU'LL SEE IMMEDIATELY
          </h3>
          <div style={{
            display: 'grid',
            gap: '0.75rem'
          }}>
            {[
              'Today's +EV picks (with exact confidence grades)',
              'Why each pick has edge (in plain English)',
              'How the model found it (the actual data)',
              'Real-time results tracking',
              'Your profit/loss counter (updated daily)'
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: isMobile ? '0.875rem' : '0.938rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: '1.6'
                }}
              >
                <span style={{
                  color: '#10B981',
                  flexShrink: 0,
                  fontSize: '1.125rem',
                  marginTop: '-0.125rem'
                }}>
                  ✅
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleChoosePlan}
          style={{
            width: '100%',
            padding: '1.25rem',
            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(0, 217, 255, 0.1) 100%)',
            border: '2px solid #00d9ff',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: isMobile ? '1rem' : '1.125rem',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.4)',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.3) 0%, rgba(0, 217, 255, 0.15) 100%)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 217, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(0, 217, 255, 0.1) 100%)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.4)';
          }}
        >
          <span>Choose Your Plan</span>
          <ArrowRight size={20} strokeWidth={3} />
        </button>

        <p style={{
          fontSize: '0.813rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          marginTop: '1rem',
          marginBottom: 0,
          lineHeight: '1.5'
        }}>
          All three options include full access for your trial period.
          <br />
          No long-term commitment. Just picks and proof.
        </p>
      </div>
    </div>
  );
};

export default TryFreeModal;


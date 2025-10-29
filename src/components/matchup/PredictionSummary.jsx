/**
 * Prediction Summary Card - PREMIUM REDESIGN
 * Bold, confident, marketing-ready presentation
 */

import { TrendingUp, Target, Zap, Trophy } from 'lucide-react';

export default function PredictionSummary({ awayTeam, homeTeam, prediction, gameTime }) {
  if (!prediction) return null;

  const { 
    awayScore, 
    homeScore, 
    awayWinProb, 
    homeWinProb,
    recommendedBet,
    confidence,
    evPercent 
  } = prediction;

  const total = awayScore + homeScore;
  const favorite = awayWinProb > homeWinProb ? awayTeam : homeTeam;
  const favoriteProb = Math.max(awayWinProb, homeWinProb);
  const favoriteScore = awayWinProb > homeWinProb ? awayScore : homeScore;
  const underdogScore = awayWinProb > homeWinProb ? homeScore : awayScore;
  const underdog = awayWinProb > homeWinProb ? homeTeam : awayTeam;

  // Confidence color
  const confidenceColor = confidence === 'HIGH' ? '#10B981' : confidence === 'MEDIUM' ? '#F59E0B' : '#64748B';
  const confidenceBg = confidence === 'HIGH' ? 'rgba(16, 185, 129, 0.15)' : confidence === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(100, 116, 139, 0.15)';

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '2px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem'
          }}>
            Model Prediction
          </div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: '900',
            color: '#F1F5F9',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            {awayTeam.code} @ {homeTeam.code}
          </h2>
        </div>
        {gameTime && gameTime !== 'TBD' && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: '700',
            color: '#10B981'
          }}>
            <Zap size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
            {gameTime}
          </div>
        )}
      </div>

      {/* Main Prediction - Large & Bold */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
        border: '2px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Left: Favorite Info */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <Trophy size={28} color="#10B981" strokeWidth={2.5} />
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Projected Winner
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10B981', lineHeight: 1 }}>
                  {favorite.code}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: '#F1F5F9'
            }}>
              {favoriteProb.toFixed(0)}% Win Probability
            </div>
          </div>

          {/* Right: Score Prediction */}
          <div style={{
            textAlign: 'right',
            flex: 1,
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Predicted Score
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#F1F5F9',
              lineHeight: 1
            }}>
              {favoriteScore.toFixed(1)} - {underdogScore.toFixed(1)}
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#64748B',
              marginTop: '0.5rem'
            }}>
              Total: {total.toFixed(1)} goals
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Bet */}
      {recommendedBet && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          alignItems: 'center',
          background: confidenceBg,
          border: `2px solid ${confidenceColor}40`,
          borderRadius: '12px',
          padding: '1.25rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{
              fontSize: '0.6875rem',
              fontWeight: '700',
              color: confidenceColor,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem'
            }}>
              Recommended Bet
            </div>
            <div style={{
              fontSize: '1.375rem',
              fontWeight: '900',
              color: '#F1F5F9',
              marginBottom: '0.25rem'
            }}>
              {recommendedBet}
            </div>
            {evPercent && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <TrendingUp size={16} color={confidenceColor} />
                <span style={{
                  fontSize: '0.9375rem',
                  fontWeight: '700',
                  color: confidenceColor
                }}>
                  +{evPercent.toFixed(1)}% Expected Value
                </span>
              </div>
            )}
          </div>

          {confidence && (
            <div style={{
              background: confidenceColor,
              color: '#FFFFFF',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: `0 4px 12px ${confidenceColor}40`
            }}>
              {confidence}
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @media (max-width: 768px) {
          .prediction-summary h2 {
            font-size: 1.5rem !important;
          }
          .prediction-summary-score {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

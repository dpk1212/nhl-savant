/**
 * Prediction Summary Card
 * Matches Today's Games page recommendations
 * Shows predicted score, win probability, recommended bet
 */

import { TrendingUp, Target } from 'lucide-react';

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

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#F1F5F9',
          margin: 0
        }}>
          {awayTeam.code} @ {homeTeam.code}
        </h3>
        {gameTime && (
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94A3B8'
          }}>
            {gameTime}
          </span>
        )}
      </div>

      {/* Prediction */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {/* Predicted Score */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            letterSpacing: '0.05em'
          }}>
            Predicted Score
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            color: '#F1F5F9'
          }}>
            {awayScore.toFixed(1)} - {homeScore.toFixed(1)}
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#64748B',
            marginTop: '0.25rem'
          }}>
            Total: {total.toFixed(1)}
          </div>
        </div>

        {/* Win Probability */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            letterSpacing: '0.05em'
          }}>
            Win Probability
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            color: '#F1F5F9'
          }}>
            {favorite.code} {favoriteProb.toFixed(0)}%
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#64748B',
            marginTop: '0.25rem'
          }}>
            {awayTeam.code} {awayWinProb.toFixed(0)}% - {homeTeam.code} {homeWinProb.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Recommended Bet */}
      {recommendedBet && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '8px'
            }}>
              <Target size={18} color="#10B981" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#10B981',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Our Recommendation
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '800',
              color: '#F1F5F9'
            }}>
              {recommendedBet}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {confidence && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: confidence === 'HIGH' ? '#10B981' : confidence === 'MEDIUM' ? '#F59E0B' : '#94A3B8',
                  background: confidence === 'HIGH' ? 'rgba(16, 185, 129, 0.2)' : confidence === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  {confidence}
                </span>
              )}
              {evPercent && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <TrendingUp size={14} color="#10B981" />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#10B981'
                  }}>
                    +{evPercent.toFixed(1)}% EV
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @media (max-width: 768px) {
          .prediction-summary-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}


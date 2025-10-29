/**
 * Sticky Summary Bar - Always-visible key metrics that follow scroll
 * Premium glassmorphism design with smooth animations
 */

import { Activity, Target, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StickySummaryBar({ awayTeam, homeTeam, matchupData }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!matchupData || !matchupData.edges) return null;

  const { edges } = matchupData;
  const overallAdv = edges.overall;

  if (!overallAdv) return null;

  const favTeam = overallAdv.favorite === 'away' ? awayTeam : homeTeam;
  const favProb = overallAdv.favorite === 'away' ? overallAdv.awayAdvantage : overallAdv.homeAdvantage;

  return (
    <div style={{
      position: 'sticky',
      top: '60px',
      zIndex: 100,
      marginBottom: '2rem',
      transform: isSticky ? 'scale(0.95)' : 'scale(1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isSticky ? 1 : 0.95
    }}>
      <div style={{
        background: isSticky
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        boxShadow: isSticky
          ? '0 20px 60px 0 rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)'
          : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Game Matchup */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Activity size={24} color="#3B82F6" />
          <div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: '#F1F5F9'
            }}>
              {awayTeam.code} <span style={{ color: '#64748B' }}>@</span> {homeTeam.code}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#94A3B8'
            }}>
              {matchupData.gameTime || 'TBD'}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(148, 163, 184, 0.3) 50%, transparent 100%)',
          display: window.innerWidth < 768 ? 'none' : 'block'
        }} />

        {/* Win Probability */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1.25rem',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <Target size={20} color="#3B82F6" />
          <div>
            <div style={{
              fontSize: '0.75rem',
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Favorite
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#3B82F6'
            }}>
              {favTeam.code} {favProb}%
            </div>
          </div>
        </div>

        {/* xGoals Edge */}
        {edges.xGoalsAway !== 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Shield size={20} color="#10B981" />
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                xGoals Edge
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#10B981'
              }}>
                {edges.xGoalsAway > 0 ? awayTeam.code : homeTeam.code} +{Math.abs(edges.xGoalsAway).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Confidence Badge */}
        <div style={{
          padding: '0.5rem 1rem',
          background: 
            overallAdv.confidence === 'high' ? 'rgba(16, 185, 129, 0.1)' :
            overallAdv.confidence === 'medium' ? 'rgba(245, 158, 11, 0.1)' :
            'rgba(100, 116, 139, 0.1)',
          borderRadius: '8px',
          border: `1px solid ${
            overallAdv.confidence === 'high' ? 'rgba(16, 185, 129, 0.3)' :
            overallAdv.confidence === 'medium' ? 'rgba(245, 158, 11, 0.3)' :
            'rgba(100, 116, 139, 0.3)'
          }`
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color:
              overallAdv.confidence === 'high' ? '#10B981' :
              overallAdv.confidence === 'medium' ? '#F59E0B' :
              '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {overallAdv.confidence} confidence
          </div>
        </div>
      </div>
    </div>
  );
}


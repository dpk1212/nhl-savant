/**
 * QuickStory Component
 * Provides a plain-language explanation of why this is the best bet
 */

import { TYPOGRAPHY, ELEVATION } from '../utils/designSystem';

const QuickStory = ({ game, bestEdge, factors, isMobile }) => {
  if (!bestEdge || !factors || factors.length === 0) return null;
  
  // Generate story from top factors and bet type
  const generateStory = () => {
    const topFactors = factors.slice(0, 3);
    const { awayTeam, homeTeam } = game;
    const betType = bestEdge.type || bestEdge.market;
    const pick = bestEdge.pick || bestEdge.displayPick;
    
    // Determine which team has the advantage
    const teamAdvantages = {
      away: 0,
      home: 0
    };
    
    topFactors.forEach(factor => {
      if (factor.awayMetric && factor.homeMetric) {
        if (factor.awayMetric.value > factor.homeMetric.value) {
          teamAdvantages.away++;
        } else {
          teamAdvantages.home++;
        }
      }
    });
    
    const favoredTeam = teamAdvantages.away > teamAdvantages.home ? awayTeam : homeTeam;
    const otherTeam = favoredTeam === awayTeam ? homeTeam : awayTeam;
    
    // Build narrative based on bet type
    let narrative = '';
    
    if (betType === 'TOTAL' || betType === 'total') {
      const isUnder = pick.includes('UNDER') || pick.includes('U ');
      const modelTotal = game.edges.total?.predictedTotal || 0;
      const marketTotal = game.edges.total?.marketTotal || 0;
      const edge = Math.abs(modelTotal - marketTotal);
      
      if (isUnder) {
        // Under narrative - focus on defensive strengths
        const defensiveFactors = topFactors.filter(f => 
          f.name.includes('Against') || f.name.includes('Defense') || f.name.includes('Save')
        );
        
        if (defensiveFactors.length >= 2) {
          narrative = `Both teams show strong defensive metrics. ${favoredTeam} ranks in the top third for preventing high-danger chances, while ${otherTeam}'s recent games have trended under. `;
        } else {
          narrative = `Defensive matchup favors a lower-scoring game. ${favoredTeam}'s ability to limit quality chances combined with ${otherTeam}'s offensive struggles create conditions for an UNDER. `;
        }
        narrative += `Our model projects ${modelTotal.toFixed(1)} total goals; market has ${marketTotal.toFixed(1)}. Edge: ${edge.toFixed(1)} goals.`;
      } else {
        // Over narrative - focus on offensive strengths
        const offensiveFactors = topFactors.filter(f => 
          f.name.includes('For') || f.name.includes('Offense') || f.name.includes('Scoring')
        );
        
        if (offensiveFactors.length >= 2) {
          narrative = `High-octane offensive matchup. ${favoredTeam} generates elite scoring chances, and ${otherTeam} allows them at an above-average rate. `;
        } else {
          narrative = `Offensive conditions favor a high-scoring game. ${favoredTeam}'s recent form shows increased scoring, while ${otherTeam}'s defense has struggled. `;
        }
        narrative += `Our model projects ${modelTotal.toFixed(1)} total goals; market has ${marketTotal.toFixed(1)}. Edge: ${edge.toFixed(1)} goals.`;
      }
    } else {
      // Moneyline narrative - focus on team advantage
      const teamPick = pick.includes(awayTeam) ? awayTeam : homeTeam;
      const opponent = teamPick === awayTeam ? homeTeam : awayTeam;
      const modelProb = (teamPick === awayTeam ? game.edges.moneyline?.away?.modelProb : game.edges.moneyline?.home?.modelProb) || 0;
      
      narrative = `${teamPick}'s advanced metrics show clear advantages in key areas. `;
      
      if (topFactors.length > 0) {
        const topFactor = topFactors[0];
        narrative += `Their ${topFactor.name.toLowerCase()} ranks significantly better than ${opponent}, `;
      }
      
      if (topFactors.length > 1) {
        const secondFactor = topFactors[1];
        narrative += `and they also excel in ${secondFactor.name.toLowerCase()}. `;
      }
      
      narrative += `Our model gives ${teamPick} a ${(modelProb * 100).toFixed(0)}% chance to win, creating value at current odds.`;
    }
    
    return narrative;
  };
  
  const story = generateStory();
  
  return (
    <div style={{ 
      padding: isMobile ? '1rem' : '1.25rem',
      background: 'rgba(212, 175, 55, 0.08)',
      border: ELEVATION.flat.border,
      borderRadius: '10px',
      margin: isMobile ? '0.75rem' : '1.25rem'
    }}>
      <div style={{ 
        fontSize: TYPOGRAPHY.label.size, 
        fontWeight: TYPOGRAPHY.heading.weight, 
        color: 'var(--color-accent)', 
        marginBottom: '0.625rem',
        textTransform: TYPOGRAPHY.label.textTransform,
        letterSpacing: TYPOGRAPHY.label.letterSpacing,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📖 THE QUICK STORY
      </div>
      <div style={{ 
        fontSize: TYPOGRAPHY.body.size, 
        lineHeight: '1.6', 
        color: 'var(--color-text-primary)',
        fontWeight: TYPOGRAPHY.caption.weight
      }}>
        {story}
      </div>
    </div>
  );
};

export default QuickStory;


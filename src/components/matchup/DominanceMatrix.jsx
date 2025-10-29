/**
 * Dominance Matrix - Mobile-first stats comparison table
 * Shows all key metrics with heatmap colors and percentile ranks
 * 
 * FIXED ISSUES:
 * 1. Corsi/Fenwick now display as percentages (multiply by 100)
 * 2. PP/PK percentages correctly calculated from situation-specific data
 */

import { CheckCircle2, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { calculatePercentileRank } from '../../utils/matchupCalculations';

export default function DominanceMatrix({ awayTeam, homeTeam, matchupData, dataProcessor }) {
  const [expandedMetric, setExpandedMetric] = useState(null);

  if (!matchupData || !dataProcessor) return null;

  const awayStats = matchupData.away.stats5v5;
  const homeStats = matchupData.home.stats5v5;
  const awayPP = matchupData.away.powerPlay;
  const awayPK = matchupData.away.penaltyKill;
  const homePP = matchupData.home.powerPlay;
  const homePK = matchupData.home.penaltyKill;

  // Build metrics array
  const metrics = [];

  // 1. Offense 5v5
  const awayXGF = awayStats?.xGF_per60 || 0;
  const homeXGF = homeStats?.xGF_per60 || 0;
  const awayXGFRank = calculatePercentileRank(dataProcessor, awayTeam.code, 'xGoalsFor', '5on5', true);
  const homeXGFRank = calculatePercentileRank(dataProcessor, homeTeam.code, 'xGoalsFor', '5on5', true);
  
  metrics.push({
    id: 'offense',
    label: 'Offense 5v5',
    unit: 'xGF/60',
    awayValue: awayXGF,
    homeValue: homeXGF,
    awayRank: awayXGFRank,
    homeRank: homeXGFRank,
    higherIsBetter: true
  });

  // 2. Defense 5v5
  const awayXGA = awayStats?.xGA_per60 || 0;
  const homeXGA = homeStats?.xGA_per60 || 0;
  const awayXGARank = calculatePercentileRank(dataProcessor, awayTeam.code, 'xGoalsAgainst', '5on5', false);
  const homeXGARank = calculatePercentileRank(dataProcessor, homeTeam.code, 'xGoalsAgainst', '5on5', false);
  
  metrics.push({
    id: 'defense',
    label: 'Defense 5v5',
    unit: 'xGA/60',
    awayValue: awayXGA,
    homeValue: homeXGA,
    awayRank: awayXGARank,
    homeRank: homeXGARank,
    higherIsBetter: false
  });

  // 3. PP Efficiency - FIXED: Use actual percentage
  if (awayPP && homePP && awayPP.percentage !== undefined && homePP.percentage !== undefined) {
    const awayPPPct = awayPP.percentage * 100; // Convert decimal to percentage
    const homePPPct = homePP.percentage * 100;
    
    metrics.push({
      id: 'powerplay',
      label: 'Power Play',
      unit: '%',
      awayValue: awayPPPct,
      homeValue: homePPPct,
      awayRank: { 
        percentile: awayPPPct * 4, 
        tier: awayPPPct > 25 ? 'ELITE' : awayPPPct > 20 ? 'STRONG' : awayPPPct > 15 ? 'AVG' : 'WEAK'
      },
      homeRank: { 
        percentile: homePPPct * 4, 
        tier: homePPPct > 25 ? 'ELITE' : homePPPct > 20 ? 'STRONG' : homePPPct > 15 ? 'AVG' : 'WEAK'
      },
      higherIsBetter: true
    });
  }

  // 4. PK Efficiency - FIXED: Use actual percentage
  if (awayPK && homePK && awayPK.percentage !== undefined && homePK.percentage !== undefined) {
    const awayPKPct = awayPK.percentage * 100; // Convert decimal to percentage
    const homePKPct = homePK.percentage * 100;
    
    metrics.push({
      id: 'penaltykill',
      label: 'Penalty Kill',
      unit: '%',
      awayValue: awayPKPct,
      homeValue: homePKPct,
      awayRank: { 
        percentile: awayPKPct * 1.2, 
        tier: awayPKPct > 85 ? 'ELITE' : awayPKPct > 80 ? 'STRONG' : awayPKPct > 75 ? 'AVG' : 'WEAK'
      },
      homeRank: { 
        percentile: homePKPct * 1.2, 
        tier: homePKPct > 85 ? 'ELITE' : homePKPct > 80 ? 'STRONG' : homePKPct > 75 ? 'AVG' : 'WEAK'
      },
      higherIsBetter: true
    });
  }

  // 5. Goaltending
  if (matchupData.away.goalie && matchupData.home.goalie && 
      !matchupData.away.goalie.isDefault && !matchupData.home.goalie.isDefault) {
    const awayGSAX = matchupData.away.goalie.gsax || 0;
    const homeGSAX = matchupData.home.goalie.gsax || 0;
    
    metrics.push({
      id: 'goaltending',
      label: 'Goaltending',
      unit: 'GSAX',
      awayValue: awayGSAX,
      homeValue: homeGSAX,
      awayRank: { percentile: 50 + (awayGSAX * 4), tier: awayGSAX > 5 ? 'ELITE' : awayGSAX > 0 ? 'STRONG' : 'AVG' },
      homeRank: { percentile: 50 + (homeGSAX * 4), tier: homeGSAX > 5 ? 'ELITE' : homeGSAX > 0 ? 'STRONG' : 'AVG' },
      higherIsBetter: true
    });
  }

  // 6. HD Shot Quality
  const awayHDPct = awayStats?.highDanger_xGF_per60 || 0;
  const homeHDPct = homeStats?.highDanger_xGF_per60 || 0;
  const awayHDRank = calculatePercentileRank(dataProcessor, awayTeam.code, 'highDangerxGoalsFor', '5on5', true);
  const homeHDRank = calculatePercentileRank(dataProcessor, homeTeam.code, 'highDangerxGoalsFor', '5on5', true);
  
  metrics.push({
    id: 'shotquality',
    label: 'HD xG',
    unit: '/60',
    awayValue: awayHDPct,
    homeValue: homeHDPct,
    awayRank: awayHDRank,
    homeRank: homeHDRank,
    higherIsBetter: true
  });

  // 7. Corsi % - FIXED: Multiply by 100
  const awayCorsi = (awayStats?.corsiPercentage || 0) * 100; // FIX: Convert decimal to percentage
  const homeCorsi = (homeStats?.corsiPercentage || 0) * 100;
  
  metrics.push({
    id: 'corsi',
    label: 'Corsi %',
    unit: '%',
    awayValue: awayCorsi,
    homeValue: homeCorsi,
    awayRank: { percentile: awayCorsi * 2, tier: awayCorsi > 55 ? 'ELITE' : awayCorsi > 50 ? 'STRONG' : awayCorsi > 48 ? 'AVG' : 'WEAK' },
    homeRank: { percentile: homeCorsi * 2, tier: homeCorsi > 55 ? 'ELITE' : homeCorsi > 50 ? 'STRONG' : homeCorsi > 48 ? 'AVG' : 'WEAK' },
    higherIsBetter: true
  });

  // 8. Fenwick % - FIXED: Multiply by 100
  const awayFenwick = (awayStats?.fenwickPercentage || 0) * 100; // FIX: Convert decimal to percentage
  const homeFenwick = (homeStats?.fenwickPercentage || 0) * 100;
  
  metrics.push({
    id: 'fenwick',
    label: 'Fenwick %',
    unit: '%',
    awayValue: awayFenwick,
    homeValue: homeFenwick,
    awayRank: { percentile: awayFenwick * 2, tier: awayFenwick > 55 ? 'ELITE' : awayFenwick > 50 ? 'STRONG' : awayFenwick > 48 ? 'AVG' : 'WEAK' },
    homeRank: { percentile: homeFenwick * 2, tier: homeFenwick > 55 ? 'ELITE' : homeFenwick > 50 ? 'STRONG' : homeFenwick > 48 ? 'AVG' : 'WEAK' },
    higherIsBetter: true
  });

  // Calculate advantages
  let awayAdvantages = 0;
  let homeAdvantages = 0;

  metrics.forEach(metric => {
    const diff = metric.higherIsBetter 
      ? metric.awayValue - metric.homeValue
      : metric.homeValue - metric.awayValue;
    
    const threshold = metric.higherIsBetter 
      ? metric.awayValue * 0.05 
      : metric.awayValue * 0.05;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) awayAdvantages++;
      else homeAdvantages++;
    }
  });

  const getValueColor = (value, opponentValue, higherIsBetter) => {
    const diff = higherIsBetter ? value - opponentValue : opponentValue - value;
    const threshold = Math.abs(value * 0.05);
    
    if (Math.abs(diff) < threshold) return 'rgba(100, 116, 139, 0.3)'; // Neutral
    if (diff > 0) return 'rgba(16, 185, 129, 0.3)'; // Green
    return 'rgba(239, 68, 68, 0.3)'; // Red
  };

  const getEdgeIcon = (awayValue, homeValue, higherIsBetter) => {
    const diff = higherIsBetter ? awayValue - homeValue : homeValue - awayValue;
    const threshold = Math.abs(awayValue * 0.05);
    
    if (Math.abs(diff) < threshold) {
      return <Minus size={16} color="#64748B" />;
    }
    
    if (diff > 0) {
      return <CheckCircle2 size={16} color="#10B981" strokeWidth={2.5} />;
    } else {
      return <CheckCircle2 size={16} color="#EF4444" strokeWidth={2.5} />;
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem'
      }}>
        Dominance Matrix
      </h2>

      {/* Table */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        {/* Header Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 60px',
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>
            Metric
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', textAlign: 'center', textTransform: 'uppercase' }}>
            {awayTeam.code}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', textAlign: 'center', textTransform: 'uppercase' }}>
            {homeTeam.code}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', textAlign: 'center', textTransform: 'uppercase' }}>
            Edge
          </div>
        </div>

        {/* Metric Rows */}
        {metrics.map((metric, index) => (
          <div key={metric.id}>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 60px',
                padding: '1rem',
                borderBottom: index < metrics.length - 1 ? '1px solid rgba(148, 163, 184, 0.05)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onClick={() => setExpandedMetric(expandedMetric === metric.id ? null : metric.id)}
            >
              {/* Label */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#F1F5F9', marginBottom: '0.25rem' }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748B' }}>
                  {metric.unit}
                </div>
              </div>

              {/* Away Value */}
              <div style={{
                textAlign: 'center',
                background: getValueColor(metric.awayValue, metric.homeValue, metric.higherIsBetter),
                borderRadius: '8px',
                padding: '0.5rem',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}>
                <div style={{ fontSize: '1.125rem', fontWeight: '800', color: '#F1F5F9' }}>
                  {metric.awayValue.toFixed(metric.unit === '%' ? 1 : 2)}
                </div>
                {metric.awayRank && (
                  <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#94A3B8' }}>
                    {metric.awayRank.percentile?.toFixed(0)}%ile
                  </div>
                )}
              </div>

              {/* Home Value */}
              <div style={{
                textAlign: 'center',
                background: getValueColor(metric.homeValue, metric.awayValue, metric.higherIsBetter),
                borderRadius: '8px',
                padding: '0.5rem',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}>
                <div style={{ fontSize: '1.125rem', fontWeight: '800', color: '#F1F5F9' }}>
                  {metric.homeValue.toFixed(metric.unit === '%' ? 1 : 2)}
                </div>
                {metric.homeRank && (
                  <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#94A3B8' }}>
                    {metric.homeRank.percentile?.toFixed(0)}%ile
                  </div>
                )}
              </div>

              {/* Edge Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getEdgeIcon(metric.awayValue, metric.homeValue, metric.higherIsBetter)}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedMetric === metric.id && (
              <div style={{
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
                fontSize: '0.8125rem',
                color: '#94A3B8'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: '#F1F5F9' }}>{awayTeam.code}:</span> {metric.awayRank?.tier || 'N/A'}
                  </div>
                  <div>
                    <span style={{ fontWeight: '600', color: '#F1F5F9' }}>{homeTeam.code}:</span> {metric.homeRank?.tier || 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Summary */}
        <div style={{
          padding: '1rem',
          background: 'rgba(15, 23, 42, 0.8)',
          borderTop: '2px solid rgba(148, 163, 184, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#F1F5F9', textTransform: 'uppercase' }}>
            Overall Advantages
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: '800', 
              color: awayAdvantages > homeAdvantages ? '#10B981' : '#64748B' 
            }}>
              {awayTeam.code}: {awayAdvantages}/{metrics.length}
            </div>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: '800', 
              color: homeAdvantages > awayAdvantages ? '#10B981' : '#64748B' 
            }}>
              {homeTeam.code}: {homeAdvantages}/{metrics.length}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dominance-matrix-grid {
            grid-template-columns: 1.5fr 1fr 1fr 50px !important;
            padding: 0.75rem !important;
          }
          .dominance-matrix-value {
            font-size: 1rem !important;
          }
          .dominance-matrix-percentile {
            font-size: 0.625rem !important;
          }
        }
      `}</style>
    </div>
  );
}

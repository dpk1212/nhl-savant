/**
 * Bet History Panel with Premium Summary
 * Shows performance breakdown by category + individual pick history
 */

import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, List } from 'lucide-react';

// Define sort orders for each category
const CONFIDENCE_ORDER = ['5u MAX', '4u HIGH', '3u STRONG', '2u MODERATE', '1u SMALL', '0.5u MINIMAL'];
const ODDS_ORDER = ['Heavy Favorite', 'Moderate Favorite', 'Slight Favorite', "Pick'em", 'Slight Dog', 'Underdog'];
const GRADE_ORDER = ['A+', 'A', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'F', 'Unknown'];

// Category Performance Card
function CategoryCard({ title, data, colorBase, icon, onSelect, selectedFilter, isMobile, sortOrder }) {
  const entries = Object.entries(data).sort((a, b) => {
    if (sortOrder) {
      const indexA = sortOrder.indexOf(a[0]);
      const indexB = sortOrder.indexOf(b[0]);
      // Items not in sortOrder go to the end
      const orderA = indexA === -1 ? 999 : indexA;
      const orderB = indexB === -1 ? 999 : indexB;
      return orderA - orderB;
    }
    // Fallback to count sort
    return (b[1].wins + b[1].losses) - (a[1].wins + a[1].losses);
  });
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: isMobile ? '1rem' : '1.25rem',
      height: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <span style={{ fontSize: '1.125rem' }}>{icon}</span>
        <span style={{
          fontSize: isMobile ? '0.875rem' : '0.938rem',
          fontWeight: '700',
          color: 'rgba(255,255,255,0.95)',
          textTransform: 'uppercase',
          letterSpacing: '0.03em'
        }}>
          {title}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {entries.slice(0, 5).map(([key, stats]) => {
          const total = stats.wins + stats.losses;
          const winRate = total > 0 ? (stats.wins / total * 100) : 0;
          const isSelected = selectedFilter === key;
          const isProfitable = stats.profit > 0;
          
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.625rem 0.75rem',
                background: isSelected 
                  ? `linear-gradient(135deg, ${colorBase}25 0%, ${colorBase}15 100%)`
                  : 'rgba(255,255,255,0.03)',
                border: isSelected ? `1px solid ${colorBase}50` : '1px solid transparent',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.375rem'
              }}>
                <span style={{
                  fontSize: isMobile ? '0.75rem' : '0.813rem',
                  fontWeight: '600',
                  color: isSelected ? colorBase : 'rgba(255,255,255,0.85)'
                }}>
                  {key}
                </span>
                <span style={{
                  fontSize: '0.688rem',
                  fontWeight: '700',
                  color: isProfitable ? '#10B981' : '#EF4444',
                  fontFeatureSettings: "'tnum'"
                }}>
                  {isProfitable ? '+' : ''}{stats.profit.toFixed(1)}u
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '0.375rem'
              }}>
                <div style={{
                  width: `${winRate}%`,
                  height: '100%',
                  background: winRate >= 60 ? '#10B981' : winRate >= 50 ? '#F59E0B' : '#EF4444',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.625rem',
                color: 'rgba(255,255,255,0.5)'
              }}>
                <span>{stats.wins}W - {stats.losses}L</span>
                <span style={{ 
                  fontWeight: '700',
                  color: winRate >= 60 ? '#10B981' : winRate >= 50 ? '#F59E0B' : 'rgba(255,255,255,0.6)'
                }}>
                  {winRate.toFixed(0)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BetHistoryPanel({ bets, isMobile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'yesterday', 'week', 'month'
  
  // Sort by date (newest first) and filter for graded bets only
  const sortedBets = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return bets
      .filter(b => {
        if (!b.result?.outcome) return false;
        
        const betTime = b.timestamp?.toDate?.() || new Date(b.timestamp || 0);
        
        if (timeFilter === 'yesterday') {
          return betTime >= startOfYesterday && betTime < startOfToday;
        } else if (timeFilter === 'week') {
          return betTime >= weekAgo;
        } else if (timeFilter === 'month') {
          return betTime >= monthAgo;
        }
        return true; // 'all'
      })
      .sort((a, b) => {
        const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp || 0);
        const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp || 0);
        return timeB - timeA;
      });
  }, [bets, timeFilter]);

  // Calculate category breakdowns
  const categoryStats = useMemo(() => {
    const getOddsRange = (odds) => {
      if (!odds) return 'Unknown';
      if (odds <= -500) return 'Heavy Favorite';
      if (odds <= -200) return 'Moderate Favorite';
      if (odds <= -110) return 'Slight Favorite';
      if (odds < 110) return "Pick'em";
      if (odds < 200) return 'Slight Dog';
      return 'Underdog';
    };

    const getUnitTier = (units) => {
      if (units >= 5) return '5u MAX';
      if (units >= 4) return '4u HIGH';
      if (units >= 3) return '3u STRONG';
      if (units >= 2) return '2u MODERATE';
      if (units >= 1) return '1u SMALL';
      return '0.5u MINIMAL';
    };

    const byUnits = {};
    const byOdds = {};
    const byGrade = {};

    sortedBets.forEach(bet => {
      const odds = bet.bet?.odds;
      const grade = bet.prediction?.grade || bet.prediction?.qualityGrade || 'Unknown';
      const isWin = bet.result?.outcome === 'WIN';
      const profit = bet.result?.profit || 0;
      
      // Unit priority: use stored values, or back-calculate from profit
      let units = bet.result?.units 
        ?? bet.staticUnitSize 
        ?? bet.prediction?.staticUnitSize 
        ?? bet.prediction?.unitSize 
        ?? bet.unitSize;
      
      // If no units stored but profit exists, back-calculate
      if (!units && profit !== 0) {
        if (!isWin) {
          units = Math.abs(profit);
        } else if (odds) {
          const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
          units = Math.round(profit / decimal * 10) / 10;
        }
      }
      units = units || 1;

      const unitTier = getUnitTier(units);
      if (!byUnits[unitTier]) byUnits[unitTier] = { wins: 0, losses: 0, profit: 0, bets: [] };
      byUnits[unitTier][isWin ? 'wins' : 'losses']++;
      byUnits[unitTier].profit += profit;
      byUnits[unitTier].bets.push(bet);

      const oddsRange = getOddsRange(odds);
      if (!byOdds[oddsRange]) byOdds[oddsRange] = { wins: 0, losses: 0, profit: 0, bets: [] };
      byOdds[oddsRange][isWin ? 'wins' : 'losses']++;
      byOdds[oddsRange].profit += profit;
      byOdds[oddsRange].bets.push(bet);

      if (!byGrade[grade]) byGrade[grade] = { wins: 0, losses: 0, profit: 0, bets: [] };
      byGrade[grade][isWin ? 'wins' : 'losses']++;
      byGrade[grade].profit += profit;
      byGrade[grade].bets.push(bet);
    });

    return { byUnits, byOdds, byGrade };
  }, [sortedBets]);

  // Filter bets based on selection
  const filteredBets = useMemo(() => {
    if (!selectedFilter) return sortedBets;
    
    if (activeCategory === 'units') {
      return categoryStats.byUnits[selectedFilter]?.bets || [];
    } else if (activeCategory === 'odds') {
      return categoryStats.byOdds[selectedFilter]?.bets || [];
    } else if (activeCategory === 'grade') {
      return categoryStats.byGrade[selectedFilter]?.bets || [];
    }
    return sortedBets;
  }, [sortedBets, selectedFilter, activeCategory, categoryStats]);

  const visibleBets = filteredBets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBets.length;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatOdds = (odds) => {
    if (!odds) return '-';
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  const handleCategorySelect = (category, key) => {
    if (selectedFilter === key && activeCategory === category) {
      setSelectedFilter(null);
      setActiveCategory('all');
    } else {
      setSelectedFilter(key);
      setActiveCategory(category);
    }
    setVisibleCount(20);
  };

  if (!sortedBets.length) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0.875rem 1rem' : '1rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: isExpanded ? '1rem' : 0,
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <List size={isMobile ? 18 : 20} color="rgba(59, 130, 246, 0.8)" />
          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: isMobile ? '0.875rem' : '0.938rem' }}>
            {isExpanded ? 'Hide' : 'Show'} Bet History
          </span>
          <span style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.1)',
            padding: '0.125rem 0.5rem',
            borderRadius: '999px'
          }}>
            {sortedBets.length} picks
          </span>
        </div>
        {isExpanded ? <ChevronUp size={isMobile ? 18 : 20} /> : <ChevronDown size={isMobile ? 18 : 20} />}
      </button>

      {isExpanded && (
        <>
          {/* PREMIUM SUMMARY SECTION */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.5) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: isMobile ? '1rem' : '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                fontSize: isMobile ? '1.125rem' : '1.25rem',
                fontWeight: '800',
                color: 'rgba(255,255,255,0.95)',
                marginBottom: '0.25rem',
                letterSpacing: '-0.02em'
              }}>
                📊 Performance Breakdown
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
                Click any category to filter picks below
              </div>
              
              {/* Time Filter Buttons */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {[
                  { key: 'all', label: 'All Time' },
                  { key: 'month', label: 'This Month' },
                  { key: 'week', label: 'This Week' },
                  { key: 'yesterday', label: 'Yesterday' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTimeFilter(key);
                      setSelectedFilter(null);
                      setActiveCategory('all');
                      setVisibleCount(20);
                    }}
                    style={{
                      padding: isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                      background: timeFilter === key 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)'
                        : 'rgba(255,255,255,0.05)',
                      border: timeFilter === key 
                        ? '1px solid rgba(59, 130, 246, 0.5)' 
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: timeFilter === key ? '#3B82F6' : 'rgba(255,255,255,0.7)',
                      fontSize: isMobile ? '0.75rem' : '0.813rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              <CategoryCard 
                title="By Confidence" 
                data={categoryStats.byUnits} 
                colorBase="#3B82F6"
                icon="🎯"
                onSelect={(key) => handleCategorySelect('units', key)}
                selectedFilter={activeCategory === 'units' ? selectedFilter : null}
                isMobile={isMobile}
                sortOrder={CONFIDENCE_ORDER}
              />
              <CategoryCard 
                title="By Odds Range" 
                data={categoryStats.byOdds} 
                colorBase="#10B981"
                icon="📈"
                onSelect={(key) => handleCategorySelect('odds', key)}
                selectedFilter={activeCategory === 'odds' ? selectedFilter : null}
                isMobile={isMobile}
                sortOrder={ODDS_ORDER}
              />
              <CategoryCard 
                title="By Grade" 
                data={categoryStats.byGrade} 
                colorBase="#F59E0B"
                icon="⭐"
                onSelect={(key) => handleCategorySelect('grade', key)}
                selectedFilter={activeCategory === 'grade' ? selectedFilter : null}
                isMobile={isMobile}
                sortOrder={GRADE_ORDER}
              />
            </div>

            {selectedFilter && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.813rem', color: 'rgba(255,255,255,0.9)' }}>
                  Showing: <strong style={{ color: '#3B82F6' }}>{selectedFilter}</strong> ({filteredBets.length} picks)
                </span>
                <button
                  onClick={() => { setSelectedFilter(null); setActiveCategory('all'); }}
                  style={{
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          {/* INDIVIDUAL PICKS LIST */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: isMobile ? '1rem' : '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ fontSize: isMobile ? '0.938rem' : '1rem', fontWeight: '700', color: 'rgba(255,255,255,0.95)' }}>
                📋 Recent Picks
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                Showing {visibleBets.length} of {filteredBets.length}
              </div>
            </div>

            {/* Column Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr auto auto auto' : '2fr 1fr 1fr 1fr 1fr',
              gap: isMobile ? '0.5rem' : '1rem',
              padding: '0.5rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '0.5rem'
            }}>
              <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase' }}>Pick</div>
              {!isMobile && <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center' }}>Odds</div>}
              <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center' }}>Units</div>
              <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center' }}>Result</div>
              <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>P/L</div>
            </div>

            {/* Bet Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {visibleBets.map((bet, idx) => {
                const isWin = bet.result?.outcome === 'WIN';
                const profit = bet.result?.profit || 0;
                const odds = bet.bet?.odds;
                
                // Unit priority: use stored values, or back-calculate from profit
                let units = bet.result?.units 
                  ?? bet.staticUnitSize 
                  ?? bet.prediction?.staticUnitSize 
                  ?? bet.prediction?.unitSize 
                  ?? bet.unitSize;
                
                // If no units stored but profit exists, back-calculate
                if (!units && profit !== 0) {
                  if (!isWin) {
                    // LOSS: you lose exactly what you bet
                    units = Math.abs(profit);
                  } else if (odds) {
                    // WIN: profit = units * decimal_odds
                    const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
                    units = Math.round(profit / decimal * 10) / 10; // Round to 1 decimal
                  }
                }
                units = units || 1; // Final fallback
                
                const team = bet.bet?.team || bet.prediction?.pick || 'Unknown';
                
                return (
                  <div
                    key={bet.id || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr auto auto auto' : '2fr 1fr 1fr 1fr 1fr',
                      gap: isMobile ? '0.5rem' : '1rem',
                      padding: isMobile ? '0.625rem 0.5rem' : '0.75rem 0.5rem',
                      background: isWin 
                        ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)'
                        : 'linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%)',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${isWin ? '#10B981' : '#EF4444'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                      {isWin ? (
                        <CheckCircle size={isMobile ? 14 : 16} color="#10B981" style={{ flexShrink: 0 }} />
                      ) : (
                        <XCircle size={isMobile ? 14 : 16} color="#EF4444" style={{ flexShrink: 0 }} />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: isMobile ? '0.813rem' : '0.875rem',
                          fontWeight: '600',
                          color: 'rgba(255,255,255,0.95)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {team}
                        </div>
                        <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)' }}>
                          {formatDate(bet.timestamp)}
                          {isMobile && odds && ` • ${formatOdds(odds)}`}
                        </div>
                      </div>
                    </div>
                    {!isMobile && (
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                        {formatOdds(odds)}
                      </div>
                    )}
                    <div style={{ fontSize: isMobile ? '0.813rem' : '0.875rem', fontWeight: '700', color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
                      {units.toFixed(1)}u
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{
                        padding: isMobile ? '0.25rem 0.5rem' : '0.25rem 0.625rem',
                        borderRadius: '6px',
                        fontSize: isMobile ? '0.688rem' : '0.75rem',
                        fontWeight: '800',
                        background: isWin ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: isWin ? '#10B981' : '#EF4444',
                        border: `1px solid ${isWin ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {isWin ? 'WIN' : 'LOSS'}
                      </span>
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.813rem' : '0.875rem',
                      fontWeight: '800',
                      color: profit >= 0 ? '#10B981' : '#EF4444',
                      textAlign: 'right'
                    }}>
                      {profit >= 0 ? '+' : ''}{profit.toFixed(2)}u
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <button
                onClick={() => setVisibleCount(prev => prev + 20)}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  color: '#3B82F6',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Load More ({filteredBets.length - visibleCount} remaining)
              </button>
            )}

            {/* Summary Footer */}
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-around',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Total Wins</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10B981' }}>
                  {filteredBets.filter(b => b.result?.outcome === 'WIN').length}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Total Losses</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#EF4444' }}>
                  {filteredBets.filter(b => b.result?.outcome === 'LOSS').length}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.688rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Net Profit</div>
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: '800', 
                  color: filteredBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0) >= 0 ? '#10B981' : '#EF4444'
                }}>
                  {filteredBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0) >= 0 ? '+' : ''}
                  {filteredBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0).toFixed(2)}u
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BetHistoryPanel;


/**
 * Basketball Bet Diagnostic Page
 * Shows all bets in Firebase with detailed breakdown of grades, units, and profit calculations
 */

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUnitSize, calculateUnitProfit } from '../utils/staggeredUnits';

const BasketballBetDiagnostic = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadBets();
  }, []);

  async function loadBets() {
    try {
      const betsSnapshot = await getDocs(collection(db, 'basketball_bets'));
      const betsData = betsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by date (newest first)
      betsData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      setBets(betsData);

      // Calculate stats
      const pending = betsData.filter(b => !b.result?.outcome);
      const completed = betsData.filter(b => b.result?.outcome);
      const wins = completed.filter(b => b.result.outcome === 'WIN').length;
      const losses = completed.filter(b => b.result.outcome === 'LOSS').length;

      const totalProfit = completed.reduce((sum, bet) => sum + (bet.result.profit || 0), 0);
      const totalRisked = completed.reduce((sum, bet) => {
        const grade = bet.prediction?.grade || 'B';
        return sum + getUnitSize(grade);
      }, 0);

      setStats({
        total: betsData.length,
        pending: pending.length,
        completed: completed.length,
        wins,
        losses,
        winRate: completed.length > 0 ? ((wins / completed.length) * 100).toFixed(1) : '0.0',
        totalProfit: totalProfit.toFixed(2),
        totalRisked: totalRisked.toFixed(2),
        roi: totalRisked > 0 ? ((totalProfit / totalRisked) * 100).toFixed(1) : '0.0'
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading bets:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#fff', fontFamily: 'monospace' }}>
        <h1>🔍 Loading Basketball Bets...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: '#fff', fontFamily: 'monospace', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>🔍 Basketball Bet Diagnostic</h1>

      {/* Stats Summary */}
      {stats && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#10B981' }}>📊 Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>TOTAL BETS</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>PENDING</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B' }}>{stats.pending}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>COMPLETED</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>{stats.completed}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>RECORD</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.wins}-{stats.losses}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>WIN RATE</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: stats.winRate >= 50 ? '#10B981' : '#EF4444' }}>{stats.winRate}%</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>UNITS RISKED</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalRisked}u</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>PROFIT</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: parseFloat(stats.totalProfit) >= 0 ? '#10B981' : '#EF4444' }}>
                {parseFloat(stats.totalProfit) >= 0 ? '+' : ''}{stats.totalProfit}u
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>ROI</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: parseFloat(stats.roi) >= 0 ? '#10B981' : '#EF4444' }}>
                {parseFloat(stats.roi) >= 0 ? '+' : ''}{stats.roi}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bets List */}
      <div>
        {bets.map((bet, i) => {
          const grade = bet.prediction?.grade || 'N/A';
          const units = getUnitSize(grade);
          const outcome = bet.result?.outcome;
          const profit = bet.result?.profit || 0;
          const odds = bet.bet?.odds || 0;

          // Calculate potential profit for pending bets
          const potentialWin = calculateUnitProfit(grade, odds, true);
          const potentialLoss = calculateUnitProfit(grade, odds, false);

          return (
            <div
              key={bet.id}
              style={{
                backgroundColor: outcome ? 
                  (outcome === 'WIN' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)') :
                  'rgba(245, 158, 11, 0.05)',
                border: `1px solid ${outcome ? 
                  (outcome === 'WIN' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)') :
                  'rgba(245, 158, 11, 0.3)'}`,
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {bet.game?.awayTeam} @ {bet.game?.homeTeam}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    {bet.date} • {bet.game?.gameTime || 'TBD'}
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: outcome ?
                    (outcome === 'WIN' ? '#10B981' : '#EF4444') :
                    '#F59E0B'
                }}>
                  {outcome || 'PENDING'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '5px' }}>PICK</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {bet.bet?.team} ({odds > 0 ? '+' : ''}{odds})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '5px' }}>GRADE</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#8B5CF6' }}>
                    {grade}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '5px' }}>UNITS RISKED</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {units}u
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '5px' }}>
                    {outcome ? 'PROFIT' : 'IF WIN / IF LOSS'}
                  </div>
                  {outcome ? (
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: profit >= 0 ? '#10B981' : '#EF4444'
                    }}>
                      {profit >= 0 ? '+' : ''}{profit.toFixed(2)}u
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px' }}>
                      <span style={{ color: '#10B981', fontWeight: 'bold' }}>+{potentialWin.toFixed(2)}u</span>
                      {' / '}
                      <span style={{ color: '#EF4444', fontWeight: 'bold' }}>{potentialLoss.toFixed(2)}u</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expand ID */}
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', color: '#9CA3AF', fontSize: '11px' }}>Show Details</summary>
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontSize: '11px' }}>
                  <div><strong>Bet ID:</strong> {bet.id}</div>
                  <div><strong>Model Win %:</strong> {bet.prediction?.ensembleAwayProb ? 
                    (bet.bet?.team === bet.game?.awayTeam ? 
                      (bet.prediction.ensembleAwayProb * 100).toFixed(1) : 
                      (bet.prediction.ensembleHomeProb * 100).toFixed(1)
                    ) : 'N/A'}%</div>
                  <div><strong>Market Win %:</strong> {bet.prediction?.marketAwayProb ?
                    (bet.bet?.team === bet.game?.awayTeam ?
                      (bet.prediction.marketAwayProb * 100).toFixed(1) :
                      (bet.prediction.marketHomeProb * 100).toFixed(1)
                    ) : 'N/A'}%</div>
                  <div><strong>EV:</strong> {bet.prediction?.evPercent ? 
                    (bet.prediction.evPercent > 0 ? '+' : '') + bet.prediction.evPercent.toFixed(1) + '%' : 
                    'N/A'}</div>
                  {outcome && (
                    <div><strong>Winner:</strong> {bet.result?.winnerTeam || 'Unknown'}</div>
                  )}
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BasketballBetDiagnostic;


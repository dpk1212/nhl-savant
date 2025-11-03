/**
 * SEO Header - AI-generated matchup analysis
 * Uses Perplexity AI with caching and refresh capability
 */

import { useState, useEffect } from 'react';
import { getMatchupAnalysis } from '../../services/perplexityService';
import { RefreshCw } from 'lucide-react';

export default function SEOHeader({ matchupData }) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (matchupData) {
      loadAnalysis();
    }
  }, [matchupData?.away?.name, matchupData?.home?.name]);

  const loadAnalysis = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await getMatchupAnalysis(
        matchupData.away.name,
        matchupData.home.name,
        forceRefresh
      );
      setAnalysis(result);
    } catch (error) {
      console.error('Error loading analysis:', error);
      setAnalysis('Expert analysis temporarily unavailable.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (!matchupData) return null;

  return (
    <div className="elevated-card" style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '0.25rem'
          }}>
            Expert Analysis
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#D4AF37'
          }}>
            AI-Powered Hot Takes
          </p>
        </div>

        <button
          onClick={() => loadAnalysis(true)}
          disabled={loading || refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: refreshing 
              ? 'rgba(59, 130, 246, 0.2)'
              : 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            color: '#3B82F6',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!refreshing) {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!refreshing) {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            }
          }}
        >
          <RefreshCw 
            size={16} 
            style={{
              animation: refreshing ? 'spin 1s linear infinite' : 'none'
            }}
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{
        fontSize: '0.9375rem',
        lineHeight: '1.7',
        color: '#CBD5E1',
        whiteSpace: 'pre-wrap'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: '#64748B'
          }}>
            <div style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              Loading expert analysis...
            </div>
          </div>
        ) : (
          analysis
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

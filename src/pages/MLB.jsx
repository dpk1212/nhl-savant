import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import PolymarketCard from '../components/PolymarketCard';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import {
  ELEVATION,
  TYPOGRAPHY,
  MOBILE_SPACING,
  getGradeColorScale,
} from '../utils/designSystem';
import {
  Target,
  TrendingUp,
  ChevronDown,
  Clock,
  Zap,
  Shield,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';

const MLB_GREEN = '#22C55E';
const MLB_DARK = '#16A34A';
const MLB_GLOW = 'rgba(34, 197, 94, 0.2)';
const ACCENT = '#10B981';
const AMBER = '#F59E0B';

const MLB = () => {
  const [loading, setLoading] = useState(true);
  const [mlbData, setMlbData] = useState(null);
  const [pinnacleData, setPinnacleData] = useState(null);
  const [polymarketData, setPolymarketData] = useState(null);
  const [kalshiData, setKalshiData] = useState(null);
  const [firebaseBets, setFirebaseBets] = useState(new Map());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sortOrder, setSortOrder] = useState('ev');
  const [showAllGames, setShowAllGames] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const { isPremium } = useSubscription(user);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadMLBData();
  }, []);

  const loadMLBData = async () => {
    try {
      setLoading(true);
      const base = import.meta.env.BASE_URL;

      const [picksRes, pinnRes, polyRes, kalshiRes] = await Promise.allSettled([
        fetch(`${base}mlb_model_picks.json`).then(r => r.ok ? r.json() : null),
        fetch(`${base}pinnacle_history.json`).then(r => r.ok ? r.json() : null),
        fetch(`${base}polymarket_data.json`).then(r => r.ok ? r.json() : null),
        fetch(`${base}kalshi_data.json`).then(r => r.ok ? r.json() : null),
      ]);

      const picks = picksRes.status === 'fulfilled' ? picksRes.value : null;
      const pinn = pinnRes.status === 'fulfilled' ? pinnRes.value : null;
      const poly = polyRes.status === 'fulfilled' ? polyRes.value : null;
      const kal = kalshiRes.status === 'fulfilled' ? kalshiRes.value : null;

      if (!picks || !picks.picks) {
        setError('No MLB picks data available yet. Check back after the daily pipeline runs.');
        setLoading(false);
        return;
      }

      setMlbData(picks);
      setPinnacleData(pinn?.MLB || {});
      setPolymarketData(poly?.MLB || {});
      setKalshiData(kal?.MLB || {});

      // Fetch Firebase bets for today
      try {
        const now = new Date();
        const etDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const todayStr = `${etDate.getFullYear()}-${String(etDate.getMonth() + 1).padStart(2, '0')}-${String(etDate.getDate()).padStart(2, '0')}`;

        const betsSnapshot = await getDocs(
          query(collection(db, 'mlb_bets'), where('date', '==', todayStr))
        );
        const betsData = new Map();
        betsSnapshot.forEach((doc) => {
          const bet = doc.data();
          if (bet.type === 'EVALUATION') return;
          const nk = (name) => name?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
          const key = `${nk(bet.game?.awayTeam)}_${nk(bet.game?.homeTeam)}`;
          betsData.set(key, bet);
        });
        setFirebaseBets(betsData);
      } catch (fbErr) {
        console.warn('Could not load Firebase MLB bets:', fbErr.message);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load MLB data:', err);
      setError('Failed to load MLB data. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s ease-in-out infinite' }}>⚾</div>
          <div style={{ color: MLB_GREEN, fontWeight: '700', fontSize: '1.125rem' }}>Loading MLB Model Picks...</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.813rem', marginTop: '0.5rem' }}>Fetching today's edges</div>
        </div>
        <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }`}</style>
      </div>
    );
  }

  if (error || !mlbData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px',
          padding: '2rem',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚾</div>
          <h2 style={{ color: '#F1F5F9', fontWeight: '800', fontSize: '1.25rem', margin: '0 0 0.75rem' }}>
            {error || 'No Data Available'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
            MLB model picks are generated daily at 3 PM ET. Check back soon.
          </p>
          <button
            onClick={() => { setError(null); loadMLBData(); }}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: `linear-gradient(135deg, ${MLB_GREEN}, ${MLB_DARK})`,
              color: 'white',
              fontWeight: '700',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { picks, evaluations, date, lastUpdated, gamesEvaluated, picksCount } = mlbData;
  const updatedTime = lastUpdated ? new Date(lastUpdated).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) : null;

  // Sort picks
  const sortedPicks = [...picks].sort((a, b) => {
    if (sortOrder === 'ev') return (b.ev || 0) - (a.ev || 0);
    if (sortOrder === 'units') return (b.units || 0) - (a.units || 0);
    if (sortOrder === 'time') return new Date(a.commenceTime) - new Date(b.commenceTime);
    return (b.ev || 0) - (a.ev || 0);
  });

  // All evaluations (includes non-picks) for the "All Games" view
  const sortedEvaluations = evaluations
    ? [...evaluations].sort((a, b) => (b.ev || 0) - (a.ev || 0))
    : [];

  const totalUnits = picks.reduce((sum, p) => sum + (p.units || 0), 0);
  const avgEV = picks.length > 0 ? (picks.reduce((s, p) => s + (p.ev || 0), 0) / picks.length) : 0;
  const aGrades = picks.filter(p => p.grade === 'A').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '-60px' : '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '400px' : '700px',
        height: isMobile ? '400px' : '700px',
        background: `radial-gradient(ellipse at center, ${MLB_GLOW} 0%, rgba(34,197,94,0.05) 40%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        padding: isMobile ? '1rem' : '20px',
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? '1.25rem' : '1.5rem' }}>
          {/* Title row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}>
            <span style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', lineHeight: 1 }}>⚾</span>
            <div>
              <h1 style={{
                fontSize: isMobile ? '1.375rem' : '1.75rem',
                fontWeight: '900',
                color: '#F1F5F9',
                margin: 0,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}>
                MLB Model Picks
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.25rem',
              }}>
                <span style={{
                  fontSize: '0.688rem',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.4)',
                }}>
                  {date}
                </span>
                {updatedTime && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.5rem' }}>●</span>
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: '600',
                      color: MLB_GREEN,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}>
                      <span style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: MLB_GREEN,
                        animation: 'mlbPulse 2s ease-in-out infinite',
                      }} />
                      Updated {updatedTime} ET
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: isMobile ? '0.5rem' : '0.75rem',
          }}>
            <StatBox label="Picks" value={picksCount} icon={Target} color={MLB_GREEN} isMobile={isMobile} />
            <StatBox label="Avg EV" value={`+${avgEV.toFixed(1)}%`} icon={TrendingUp} color={ACCENT} isMobile={isMobile} />
            <StatBox label="Total Units" value={totalUnits.toFixed(1)} icon={Zap} color={AMBER} isMobile={isMobile} />
            <StatBox label="A Grades" value={aGrades} icon={Shield} color="#3B82F6" isMobile={isMobile} />
          </div>
        </div>

        {/* Sort controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '0.688rem',
            fontWeight: '700',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>Sort:</span>
          {[
            { id: 'ev', label: 'Best Edge' },
            { id: 'units', label: 'Units' },
            { id: 'time', label: 'Game Time' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSortOrder(s.id)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.688rem',
                fontWeight: '700',
                border: sortOrder === s.id ? `1px solid ${MLB_GREEN}40` : '1px solid rgba(255,255,255,0.08)',
                background: sortOrder === s.id
                  ? `linear-gradient(135deg, ${MLB_GREEN}15 0%, ${MLB_GREEN}08 100%)`
                  : 'rgba(255,255,255,0.03)',
                color: sortOrder === s.id ? MLB_GREEN : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {s.label}
            </button>
          ))}

          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => setShowAllGames(!showAllGames)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.688rem',
                fontWeight: '700',
                border: showAllGames ? `1px solid ${AMBER}40` : '1px solid rgba(255,255,255,0.08)',
                background: showAllGames
                  ? `linear-gradient(135deg, ${AMBER}15 0%, ${AMBER}08 100%)`
                  : 'rgba(255,255,255,0.03)',
                color: showAllGames ? AMBER : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {showAllGames ? `All Games (${gamesEvaluated})` : `Picks Only (${picksCount})`}
            </button>
          </div>
        </div>

        {/* Game Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '1rem' }}>
          {showAllGames
            ? sortedEvaluations.map((ev, idx) => (
                <MLBGameCard
                  key={`${ev.awayCode}_${ev.homeCode}_${idx}`}
                  game={ev}
                  rank={idx + 1}
                  isMobile={isMobile}
                  pinnacleData={pinnacleData}
                  polymarketData={polymarketData}
                  kalshiData={kalshiData}
                  firebaseBets={firebaseBets}
                  isPick={ev.action === 'BET' && ev.units > 0}
                  allPicks={picks}
                />
              ))
            : sortedPicks.map((pick, idx) => (
                <MLBGameCard
                  key={`${pick.awayCode}_${pick.homeCode}_${idx}`}
                  game={pick}
                  rank={idx + 1}
                  isMobile={isMobile}
                  pinnacleData={pinnacleData}
                  polymarketData={polymarketData}
                  kalshiData={kalshiData}
                  firebaseBets={firebaseBets}
                  isPick={true}
                  allPicks={picks}
                />
              ))
          }
        </div>

        {/* Methodology note */}
        <div style={{
          marginTop: '2rem',
          padding: isMobile ? '1rem' : '1.25rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.5rem',
          }}>
            Methodology
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.7,
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Ensemble model blending DRatings + Dimers win probabilities.
            Fair odds compared against sharp (Pinnacle) and retail books.
            Only positive EV plays with verified edges are surfaced as picks.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes mlbPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes mlbFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};


// ─── Stat Box ───────────────────────────────────────────────────────────────
function StatBox({ label, value, icon: Icon, color, isMobile }) {
  return (
    <div style={{
      padding: isMobile ? '0.625rem 0.5rem' : '0.75rem',
      background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
      border: `1px solid ${color}20`,
      borderRadius: '10px',
      textAlign: 'center',
    }}>
      <Icon size={isMobile ? 14 : 16} color={color} strokeWidth={2.5} style={{ marginBottom: '0.25rem' }} />
      <div style={{
        fontSize: isMobile ? '1rem' : '1.125rem',
        fontWeight: '900',
        color: '#F1F5F9',
        fontFeatureSettings: "'tnum'",
        lineHeight: 1.2,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.563rem',
        fontWeight: '700',
        color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginTop: '0.125rem',
      }}>
        {label}
      </div>
    </div>
  );
}


// ─── MLB Game Card ──────────────────────────────────────────────────────────
function MLBGameCard({ game, rank, isMobile, pinnacleData, polymarketData, kalshiData, firebaseBets, isPick, allPicks }) {
  const [expanded, setExpanded] = useState(false);

  const nk = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const gameKey = `${nk(game.awayCode || game.awayTeam)}_${nk(game.homeCode || game.homeTeam)}`;

  // Resolve full pick data (evaluations don't carry all fields)
  const pickData = isPick
    ? allPicks?.find(p => nk(p.awayCode) === nk(game.awayCode) && nk(p.homeCode) === nk(game.homeCode)) || game
    : game;

  const {
    awayTeam, homeTeam, awayCode, homeCode,
    ensembleAwayProb, ensembleHomeProb,
    ev, grade, modelsAgree, confidence,
    awayPitcher, homePitcher, predictedTotal,
  } = game;

  const pick = pickData.pick || null;
  const pickSide = pickData.side || null;
  const odds = pickData.odds || null;
  const book = pickData.book || null;
  const units = pickData.units || 0;
  const commenceTime = pickData.commenceTime || game.commenceTime;

  const gradeColors = getGradeColorScale(grade || 'N/A');
  const awayProb = ensembleAwayProb != null ? Math.round(ensembleAwayProb * 100) : null;
  const homeProb = ensembleHomeProb != null ? Math.round(ensembleHomeProb * 100) : null;
  const favAway = (awayProb || 0) >= (homeProb || 0);

  // Format game time
  const formatTime = (iso) => {
    if (!iso) return 'TBD';
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Pinnacle data
  const pinnGame = pinnacleData?.[gameKey] || null;
  const pinnOpener = pinnGame?.opener || null;
  const pinnCurrent = pinnGame?.current || null;
  const pinnMovement = pinnGame?.movement || null;

  // Market intel keys
  const polyKey = gameKey;
  const polyData = polymarketData?.[polyKey] || null;
  const kalshiGameData = kalshiData?.[polyKey] || null;

  const formatOdds = (o) => {
    if (o == null) return '—';
    return o > 0 ? `+${o}` : `${o}`;
  };

  const cardBorder = isPick
    ? `1.5px solid ${gradeColors.borderColor}40`
    : '1px solid rgba(255,255,255,0.06)';
  const cardShadow = isPick
    ? `0 4px 20px ${gradeColors.borderColor}15`
    : 'none';

  return (
    <div
      style={{
        background: isPick
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.7) 100%)',
        borderRadius: isMobile ? MOBILE_SPACING.borderRadius : '16px',
        border: cardBorder,
        boxShadow: cardShadow,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isPick ? 1 : 0.7,
        animation: 'mlbFadeIn 0.4s ease-out both',
        animationDelay: `${rank * 0.05}s`,
      }}
    >
      {/* ─── Card Header (clickable) ────────────────────────────────────── */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          cursor: 'pointer',
          padding: isMobile ? '0.875rem' : '1rem 1.125rem',
          background: isPick
            ? `linear-gradient(135deg, rgba(0,0,0,0.2) 0%, ${gradeColors.borderColor}06 100%)`
            : 'rgba(0,0,0,0.15)',
        }}
      >
        {/* Row 1: Grade + Teams + Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '0.5rem' : '0.75rem',
          marginBottom: isMobile ? '0.5rem' : '0.625rem',
        }}>
          {/* Grade badge */}
          <div style={{
            width: isMobile ? '30px' : '34px',
            height: isMobile ? '30px' : '34px',
            borderRadius: '10px',
            background: isPick
              ? `linear-gradient(135deg, ${gradeColors.borderColor}25 0%, ${gradeColors.borderColor}10 100%)`
              : 'rgba(100,116,139,0.1)',
            border: isPick
              ? `1.5px solid ${gradeColors.borderColor}50`
              : '1px solid rgba(100,116,139,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '0.813rem' : '0.875rem',
            fontWeight: '900',
            color: isPick ? gradeColors.color : '#64748B',
            flexShrink: 0,
          }}>
            {isPick ? (grade || '?') : '—'}
          </div>

          {/* Teams */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: isMobile ? '0.938rem' : '1.063rem',
              fontWeight: '800',
              color: '#F1F5F9',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}>
              {awayTeam} <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: '500', fontSize: '0.75em' }}>@</span> {homeTeam}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: '0.125rem',
            }}>
              <Clock size={10} color="rgba(255,255,255,0.35)" strokeWidth={2.5} />
              <span style={{
                fontSize: '0.625rem',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.4)',
              }}>
                {formatTime(commenceTime)} ET
              </span>
              {awayPitcher && homePitcher && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.5rem' }}>●</span>
                  <span style={{
                    fontSize: '0.563rem',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.3)',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                    {awayPitcher} vs {homePitcher}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Expand chevron */}
          <ChevronDown
            size={16}
            color="rgba(255,255,255,0.3)"
            strokeWidth={2.5}
            style={{
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              flexShrink: 0,
            }}
          />
        </div>

        {/* Row 2: Model probability bar */}
        {awayProb != null && homeProb != null && (
          <div style={{ marginBottom: isPick ? (isMobile ? '0.5rem' : '0.625rem') : 0 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '0.2rem',
            }}>
              <span style={{
                fontSize: isMobile ? '0.625rem' : '0.688rem',
                fontWeight: '700',
                color: favAway ? '#F1F5F9' : 'rgba(255,255,255,0.45)',
                fontFeatureSettings: "'tnum'",
              }}>
                {awayCode?.toUpperCase()} <span style={{ fontWeight: '800', color: favAway ? MLB_GREEN : 'inherit' }}>{awayProb}%</span>
              </span>
              <span style={{
                fontSize: '0.438rem',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Model Win %
              </span>
              <span style={{
                fontSize: isMobile ? '0.625rem' : '0.688rem',
                fontWeight: '700',
                color: !favAway ? '#F1F5F9' : 'rgba(255,255,255,0.45)',
                fontFeatureSettings: "'tnum'",
              }}>
                <span style={{ fontWeight: '800', color: !favAway ? MLB_GREEN : 'inherit' }}>{homeProb}%</span> {homeCode?.toUpperCase()}
              </span>
            </div>
            <div style={{
              display: 'flex',
              height: '5px',
              borderRadius: '3px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: `${awayProb}%`,
                background: favAway
                  ? `linear-gradient(90deg, ${MLB_GREEN} 0%, ${MLB_DARK} 100%)`
                  : 'rgba(255,255,255,0.15)',
                transition: 'width 0.5s ease',
              }} />
              <div style={{
                width: `${homeProb}%`,
                background: !favAway
                  ? `linear-gradient(90deg, ${MLB_DARK} 0%, ${MLB_GREEN} 100%)`
                  : 'rgba(255,255,255,0.15)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Row 3: Pick recommendation line (only for BET picks) */}
        {isPick && pick && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.375rem' : '0.5rem',
            padding: isMobile ? '0.5rem 0.625rem' : '0.5rem 0.75rem',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${gradeColors.borderColor}10 0%, ${gradeColors.borderColor}05 100%)`,
            border: `1px solid ${gradeColors.borderColor}25`,
            flexWrap: 'wrap',
          }}>
            {/* Pick team */}
            <span style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              fontWeight: '900',
              color: '#F1F5F9',
            }}>
              {pick}
            </span>

            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.563rem' }}>|</span>

            {/* Odds */}
            <span style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              fontWeight: '900',
              color: 'white',
              fontFeatureSettings: "'tnum'",
            }}>
              {formatOdds(odds)}
            </span>

            {book && (
              <span style={{
                fontSize: '0.5rem',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.3)',
              }}>
                {book}
              </span>
            )}

            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.563rem' }}>|</span>

            {/* Units */}
            <span style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              fontWeight: '900',
              color: gradeColors.color,
              fontFeatureSettings: "'tnum'",
            }}>
              {units}u
            </span>

            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.563rem' }}>|</span>

            {/* EV */}
            <span style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              fontWeight: '800',
              color: MLB_GREEN,
              fontFeatureSettings: "'tnum'",
            }}>
              +{(ev || 0).toFixed(1)}% EV
            </span>

            {/* Model agreement */}
            {modelsAgree != null && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.563rem' }}>|</span>
                <span style={{
                  fontSize: '0.563rem',
                  fontWeight: '800',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                  background: modelsAgree ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                  color: modelsAgree ? '#10B981' : '#F59E0B',
                  border: `1px solid ${modelsAgree ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                }}>
                  {modelsAgree ? 'MODELS AGREE' : 'MODELS SPLIT'}
                </span>
              </>
            )}

            {/* Confidence */}
            {confidence === 'HIGH' && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.563rem' }}>|</span>
                <span style={{
                  fontSize: '0.5rem',
                  fontWeight: '800',
                  color: '#3B82F6',
                  letterSpacing: '0.04em',
                }}>
                  HIGH CONF
                </span>
              </>
            )}
          </div>
        )}

        {/* Non-pick evaluation label */}
        {!isPick && (
          <div style={{
            marginTop: '0.375rem',
            fontSize: '0.625rem',
            fontWeight: '700',
            color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            No edge — evaluate only {ev != null && `(${ev > 0 ? '+' : ''}${ev.toFixed(1)}% EV)`}
          </div>
        )}
      </div>

      {/* ─── Expanded Details ────────────────────────────────────────────── */}
      {expanded && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          animation: 'mlbFadeIn 0.25s ease-out',
        }}>
          {/* Pinnacle Line Data */}
          {pinnGame && (
            <div style={{
              padding: isMobile ? '0.75rem 0.875rem' : '0.875rem 1.125rem',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                marginBottom: '0.5rem',
              }}>
                <Activity size={12} color={MLB_GREEN} strokeWidth={2.5} />
                <span style={{
                  fontSize: '0.563rem',
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  Pinnacle Line Movement
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: '0.5rem',
                alignItems: 'center',
              }}>
                {/* Away odds */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '0.5rem',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.3)',
                    marginBottom: '0.25rem',
                  }}>
                    {awayCode?.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem' }}>
                    {pinnOpener?.away != null && (
                      <span style={{
                        fontSize: '0.563rem',
                        color: 'rgba(255,255,255,0.3)',
                        textDecoration: 'line-through',
                        fontFeatureSettings: "'tnum'",
                      }}>
                        {formatOdds(pinnOpener.away)}
                      </span>
                    )}
                    <span style={{
                      fontSize: isMobile ? '0.875rem' : '0.938rem',
                      fontWeight: '800',
                      color: '#F1F5F9',
                      fontFeatureSettings: "'tnum'",
                    }}>
                      {pinnCurrent?.away != null ? formatOdds(pinnCurrent.away) : '—'}
                    </span>
                  </div>
                </div>

                {/* Movement arrow */}
                <div style={{ textAlign: 'center' }}>
                  {pinnMovement?.direction ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.125rem',
                    }}>
                      {pinnMovement.direction === 'away' ? (
                        <ArrowUpRight size={16} color={MLB_GREEN} strokeWidth={2.5} />
                      ) : pinnMovement.direction === 'home' ? (
                        <ArrowDownRight size={16} color="#EF4444" strokeWidth={2.5} />
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>→</span>
                      )}
                      <span style={{
                        fontSize: '0.5rem',
                        fontWeight: '700',
                        color: pinnMovement.direction === 'away' ? MLB_GREEN
                          : pinnMovement.direction === 'home' ? '#EF4444'
                          : 'rgba(255,255,255,0.3)',
                        textTransform: 'uppercase',
                      }}>
                        {pinnMovement.direction === 'away' ? `→ ${awayCode?.toUpperCase()}`
                          : pinnMovement.direction === 'home' ? `→ ${homeCode?.toUpperCase()}`
                          : 'STABLE'}
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>vs</span>
                  )}
                </div>

                {/* Home odds */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '0.5rem',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.3)',
                    marginBottom: '0.25rem',
                  }}>
                    {homeCode?.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem' }}>
                    {pinnOpener?.home != null && (
                      <span style={{
                        fontSize: '0.563rem',
                        color: 'rgba(255,255,255,0.3)',
                        textDecoration: 'line-through',
                        fontFeatureSettings: "'tnum'",
                      }}>
                        {formatOdds(pinnOpener.home)}
                      </span>
                    )}
                    <span style={{
                      fontSize: isMobile ? '0.875rem' : '0.938rem',
                      fontWeight: '800',
                      color: '#F1F5F9',
                      fontFeatureSettings: "'tnum'",
                    }}>
                      {pinnCurrent?.home != null ? formatOdds(pinnCurrent.home) : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Best available odds from all books */}
              {pinnGame?.bestAway != null && pinnGame?.bestHome != null && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.375rem 0.5rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontSize: '0.5rem',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    Best Available
                  </span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: '700',
                      color: '#F1F5F9',
                      fontFeatureSettings: "'tnum'",
                    }}>
                      {awayCode?.toUpperCase()} {formatOdds(pinnGame.bestAway?.odds || pinnGame.bestAway)}
                    </span>
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: '700',
                      color: '#F1F5F9',
                      fontFeatureSettings: "'tnum'",
                    }}>
                      {homeCode?.toUpperCase()} {formatOdds(pinnGame.bestHome?.odds || pinnGame.bestHome)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Model Details */}
          <div style={{
            padding: isMobile ? '0.75rem 0.875rem' : '0.875rem 1.125rem',
            borderBottom: (polyData || kalshiGameData) ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div style={{
              fontSize: '0.563rem',
              fontWeight: '700',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.5rem',
            }}>
              Model Breakdown
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
              gap: '0.5rem',
            }}>
              {awayPitcher && (
                <DetailCell label="Away SP" value={awayPitcher} isMobile={isMobile} />
              )}
              {homePitcher && (
                <DetailCell label="Home SP" value={homePitcher} isMobile={isMobile} />
              )}
              {predictedTotal != null && (
                <DetailCell label="Pred. Total" value={predictedTotal.toFixed(1)} isMobile={isMobile} />
              )}
              <DetailCell
                label="Fair Away"
                value={ensembleAwayProb != null ? `${(ensembleAwayProb * 100).toFixed(1)}%` : '—'}
                isMobile={isMobile}
              />
              <DetailCell
                label="Fair Home"
                value={ensembleHomeProb != null ? `${(ensembleHomeProb * 100).toFixed(1)}%` : '—'}
                isMobile={isMobile}
              />
              {ev != null && (
                <DetailCell
                  label="Expected Value"
                  value={`${ev > 0 ? '+' : ''}${ev.toFixed(2)}%`}
                  color={ev > 0 ? MLB_GREEN : '#EF4444'}
                  isMobile={isMobile}
                />
              )}
            </div>
          </div>

          {/* Market Intelligence — Polymarket + Kalshi */}
          {(polyData || kalshiGameData) && (
            <div style={{ padding: isMobile ? '0 0.875rem 0.75rem' : '0 1.125rem 0.875rem' }}>
              <PolymarketCard
                data={polyData}
                kalshiData={kalshiGameData}
                isMobile={isMobile}
                awayTeam={awayTeam}
                homeTeam={homeTeam}
                modelAwayProb={awayProb}
                modelHomeProb={homeProb}
                modelPick={pickSide || (favAway ? 'away' : 'home')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ─── Detail Cell ────────────────────────────────────────────────────────────
function DetailCell({ label, value, color, isMobile }) {
  return (
    <div style={{
      padding: '0.375rem 0.5rem',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '6px',
      border: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        fontSize: '0.438rem',
        fontWeight: '700',
        color: 'rgba(255,255,255,0.25)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '0.125rem',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: isMobile ? '0.688rem' : '0.75rem',
        fontWeight: '700',
        color: color || '#F1F5F9',
        fontFeatureSettings: "'tnum'",
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        {value}
      </div>
    </div>
  );
}


export default MLB;

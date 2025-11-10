/**
 * Player Threat Matrix - Infrared Digital Stat Map
 * Stunning thermal imaging-style visualization of elite NHL players
 */

import { useState, useEffect } from 'react';
import { Flame, Shield, Zap, Target } from 'lucide-react';
import { getElitePlayers } from '../../utils/playerDataProcessor';

const PlayerThreatMatrix = ({ isMobile }) => {
  const [players, setPlayers] = useState({
    offensive: [],
    defensive: [],
    powerplay: [],
    twoway: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getElitePlayers(8);
        console.log('📊 Elite players loaded:', {
          offensive: data.offensive.length,
          defensive: data.defensive.length,
          powerplay: data.powerplay.length,
          twoway: data.twoway.length
        });
        
        // Debug: Log first player from each category
        if (data.offensive.length > 0) {
          console.log('🔥 Sample Offensive player:', data.offensive[0]);
        }
        if (data.defensive.length > 0) {
          console.log('🛡️ Sample Defensive player:', data.defensive[0]);
        }
        if (data.powerplay.length > 0) {
          console.log('⚡ Sample PP player:', data.powerplay[0]);
        }
        if (data.twoway.length > 0) {
          console.log('🎯 Sample Two-Way player:', data.twoway[0]);
        }
        
        setPlayers(data);
      } catch (err) {
        console.error('❌ Error loading elite players:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
        borderRadius: '16px',
        padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        marginBottom: isMobile ? '1.5rem' : '2rem',
        textAlign: 'center',
        color: '#00d9ff',
        border: '1px solid rgba(0, 217, 255, 0.2)'
      }}>
        <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>SCANNING ELITE PLAYERS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
        borderRadius: '16px',
        padding: isMobile ? '2rem 1rem' : '3rem 2rem',
        marginBottom: isMobile ? '1.5rem' : '2rem',
        textAlign: 'center',
        color: '#ff4444',
        border: '1px solid rgba(255, 68, 68, 0.3)'
      }}>
        <div style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>
          ⚠️ PLAYER DATA UNAVAILABLE
        </div>
        <div style={{ fontSize: '0.75rem', color: '#7aa3b8', marginTop: '0.5rem' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
      borderRadius: '16px',
      padding: isMobile ? '2rem 1rem' : '3rem 2rem',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(0, 217, 255, 0.3)',
      boxShadow: '0 0 40px rgba(0, 217, 255, 0.15)'
    }}>
      {/* Scanline Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
        animation: 'scanline 3s linear infinite',
        opacity: 0.6
      }} />
      
      {/* Background Grid Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.4,
        pointerEvents: 'none'
      }} />

      {/* Title Section */}
      <div style={{ 
        marginBottom: isMobile ? '2rem' : '2.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00d9ff',
            boxShadow: '0 0 10px #00d9ff',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: '800',
            margin: 0,
            color: '#00d9ff',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.8), 0 0 40px rgba(0, 217, 255, 0.4)'
          }}>
            Elite Player Radar
          </h2>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00d9ff',
            boxShadow: '0 0 10px #00d9ff',
            animation: 'pulse 2s ease-in-out infinite 1s'
          }} />
        </div>
        <p style={{
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          color: '#7aa3b8',
          textAlign: 'center',
          margin: 0,
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Thermal signature analysis • Top 8 per category
        </p>
      </div>

      {/* Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '1.5rem' : '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <CategorySection
          title="Offensive Threats"
          icon={Flame}
          players={players.offensive}
          color="#ff4444"
          secondaryColor="#ff8800"
          isMobile={isMobile}
          renderStats={(player) => (
            <>
              <StatBar label="PTS" value={player.points} max={50} color="#ff4444" />
              <StatBar label="G" value={player.goals} max={30} color="#ff6644" />
              <StatBar label="HD xG" value={player.highDangerxGoals} max={10} color="#ff8844" decimals={1} />
            </>
          )}
        />

        <CategorySection
          title="Defensive Anchors"
          icon={Shield}
          players={players.defensive}
          color="#4488ff"
          secondaryColor="#00d9ff"
          isMobile={isMobile}
          renderStats={(player) => (
            <>
              <StatBar label="BLK" value={player.blocks} max={40} color="#4488ff" />
              <StatBar label="HITS" value={player.hits} max={80} color="#6699ff" />
              <StatBar label="TK" value={player.takeaways} max={20} color="#88aaff" />
            </>
          )}
        />

        <CategorySection
          title="Power Play Elite"
          icon={Zap}
          players={players.powerplay}
          color="#aa44ff"
          secondaryColor="#dd66ff"
          isMobile={isMobile}
          renderStats={(player) => (
            <>
              <StatBar label="PP PTS" value={player.ppPoints} max={15} color="#aa44ff" />
              <StatBar label="PP G" value={player.ppGoals} max={10} color="#bb55ff" />
              <StatBar label="PP TOI" value={player.ppIceTime} max={100} color="#cc66ff" suffix="m" />
            </>
          )}
        />

        <CategorySection
          title="Two-Way Forces"
          icon={Target}
          players={players.twoway}
          color="#00d9ff"
          secondaryColor="#ffffff"
          isMobile={isMobile}
          renderStats={(player) => (
            <>
              <StatBar label="GS" value={player.gameScore} max={30} color="#00d9ff" decimals={1} />
              <StatBar label="xG%" value={player.onIceXGPercent * 100} max={100} color="#44ddff" decimals={0} suffix="%" />
              <StatBar label="PTS" value={player.points} max={50} color="#88eeff" />
            </>
          )}
        />
      </div>

      {/* Add keyframes for animations */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(800px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const CategorySection = ({ title, icon: Icon, players, color, secondaryColor, isMobile, renderStats }) => {
  return (
    <div style={{
      background: 'rgba(10, 14, 26, 0.6)',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.25rem',
      border: `1px solid ${color}33`,
      boxShadow: `0 0 20px ${color}22`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <Icon 
          size={isMobile ? 18 : 20} 
          color={color}
          style={{ 
            filter: `drop-shadow(0 0 8px ${color})`,
            animation: 'glow 2s ease-in-out infinite'
          }}
        />
        <h3 style={{
          fontSize: isMobile ? '0.875rem' : '0.938rem',
          fontWeight: '700',
          margin: 0,
          color: color,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textShadow: `0 0 10px ${color}88`
        }}>
          {title}
        </h3>
      </div>

      {/* Players List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxHeight: isMobile ? '400px' : '500px',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '0.5rem'
      }}>
        {players.map((player, index) => (
          <PlayerCard
            key={player.playerId || index}
            player={player}
            rank={index + 1}
            color={color}
            secondaryColor={secondaryColor}
            isMobile={isMobile}
            renderStats={renderStats}
          />
        ))}
      </div>
    </div>
  );
};

const PlayerCard = ({ player, rank, color, secondaryColor, isMobile, renderStats }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${color}11 0%, ${color}05 100%)`,
        borderRadius: '10px',
        padding: isMobile ? '1rem' : '1.125rem',
        border: `1px solid ${color}${isHovered ? '66' : '33'}`,
        boxShadow: isHovered ? `0 0 20px ${color}55, 0 0 40px ${color}22` : `0 0 10px ${color}11`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Thermal gradient background */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100%',
        background: `radial-gradient(circle at right, ${secondaryColor}15, transparent)`,
        opacity: isHovered ? 0.8 : 0.4,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }} />

      {/* Player Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          minWidth: isMobile ? '20px' : '24px',
          height: isMobile ? '20px' : '24px',
          borderRadius: '4px',
          background: `linear-gradient(135deg, ${color} 0%, ${secondaryColor} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '0.688rem' : '0.75rem',
          fontWeight: '800',
          color: '#0a0e1a',
          boxShadow: `0 0 10px ${color}66`
        }}>
          {rank}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? '0.875rem' : '0.938rem',
            fontWeight: '800',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: `0 0 10px ${color}77`,
            marginBottom: '0.25rem'
          }}>
            {player.name}
          </div>
          <div style={{
            fontSize: isMobile ? '0.75rem' : '0.813rem',
            color: '#7aa3b8',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <span style={{ 
              color: color,
              fontWeight: '700',
              textShadow: `0 0 8px ${color}55`,
              letterSpacing: '0.05em'
            }}>
              {player.team}
            </span>
            <span style={{ color: `${color}66`, fontSize: '0.625rem' }}>●</span>
            <span style={{ 
              fontWeight: '600',
              color: '#9ab8c8',
              letterSpacing: '0.02em'
            }}>
              {player.position}
            </span>
            <span style={{ color: `${color}66`, fontSize: '0.625rem' }}>●</span>
            <span style={{ 
              fontSize: '0.688rem',
              color: '#7aa3b8'
            }}>
              {player.gamesPlayed}GP
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        position: 'relative',
        zIndex: 1,
        marginTop: '0.75rem'
      }}>
        {renderStats(player)}
      </div>
    </div>
  );
};

const StatBar = ({ label, value, max, color, decimals = 0, suffix = '' }) => {
  // Handle undefined/null values
  const safeValue = value ?? 0;
  const percentage = Math.min((safeValue / max) * 100, 100);
  const displayValue = decimals > 0 ? safeValue.toFixed(decimals) : Math.round(safeValue);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <div style={{
        minWidth: '50px',
        fontSize: '0.75rem',
        color: color,
        fontWeight: '700',
        letterSpacing: '0.02em',
        textShadow: `0 0 6px ${color}44`
      }}>
        {label}
      </div>
      <div style={{
        flex: 1,
        height: '8px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        border: `1px solid ${color}22`
      }}>
        <div style={{
          width: `${Math.max(percentage, 2)}%`, // Minimum 2% width for visibility
          height: '100%',
          background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
          boxShadow: `0 0 10px ${color}99`,
          transition: 'width 0.5s ease'
        }} />
      </div>
      <div style={{
        minWidth: '45px',
        fontSize: '0.875rem',
        color: '#ffffff',
        fontWeight: '800',
        textAlign: 'right',
        textShadow: `0 0 8px ${color}88`
      }}>
        {displayValue}{suffix}
      </div>
    </div>
  );
};

export default PlayerThreatMatrix;


import { CheckCircle, AlertCircle, Database } from 'lucide-react';

const DataStatus = ({ dataProcessor, loading, error }) => {
  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
        border: '1px solid rgba(0, 217, 255, 0.3)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 0 20px rgba(0, 217, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
          animation: 'scanline 2s linear infinite'
        }} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{ animation: 'spin 1s linear infinite' }}>
            <Database size={18} color="#00d9ff" style={{ filter: 'drop-shadow(0 0 6px #00d9ff)' }} />
          </div>
          <span style={{
            color: '#00d9ff',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(0, 217, 255, 0.6)'
          }}>
            LOADING NHL DATA...
          </span>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a0a0e 0%, #190f14 100%)',
        border: '1px solid rgba(255, 68, 68, 0.4)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 0 20px rgba(255, 68, 68, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={18} color="#ff4444" style={{ filter: 'drop-shadow(0 0 6px #ff4444)' }} />
          <span style={{
            color: '#ff4444',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(255, 68, 68, 0.6)'
          }}>
            {error}
          </span>
        </div>
      </div>
    );
  }

  if (!dataProcessor) {
    return null;
  }

  const dataCount = dataProcessor.processedData?.length || 0;
  const teams = [...new Set(dataProcessor.processedData.map(d => d.name))].length;
  const situations = [...new Set(dataProcessor.processedData.map(d => d.situation))].length;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1419 100%)',
      border: '1px solid rgba(0, 217, 255, 0.3)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 30px rgba(0, 217, 255, 0.15)'
    }}>
      {/* Background grid pattern */}
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
      
      {/* Pulsing indicator dot */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#00d9ff',
        boxShadow: '0 0 12px #00d9ff',
        animation: 'pulse 2s ease-in-out infinite'
      }} />
      
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <CheckCircle 
            size={18} 
            color="#00d9ff" 
            style={{ 
              marginTop: '0.125rem',
              flexShrink: 0,
              filter: 'drop-shadow(0 0 6px #00d9ff)'
            }} 
          />
          <div>
            <h3 style={{
              fontWeight: '700',
              color: '#00d9ff',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(0, 217, 255, 0.6)'
            }}>
              Data Verified & Loaded
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, auto)',
              gap: '1.5rem',
              fontSize: '0.813rem'
            }}>
              <div>
                <span style={{ color: '#7aa3b8' }}>Data Points: </span>
                <span style={{ 
                  fontWeight: '700', 
                  color: '#ffffff',
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
                }}>
                  {dataCount}
                </span>
              </div>
              <div>
                <span style={{ color: '#7aa3b8' }}>Teams: </span>
                <span style={{ 
                  fontWeight: '700', 
                  color: '#ffffff',
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
                }}>
                  {teams}
                </span>
              </div>
              <div>
                <span style={{ color: '#7aa3b8' }}>Situations: </span>
                <span style={{ 
                  fontWeight: '700', 
                  color: '#ffffff',
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
                }}>
                  {situations}
                </span>
              </div>
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: '#7aa3b8',
              marginTop: '0.5rem',
              letterSpacing: '0.02em'
            }}>
              All calculations verified and ready for analysis
            </p>
          </div>
        </div>
        <div style={{ 
          textAlign: 'right',
          minWidth: '120px'
        }}>
          <p style={{
            fontSize: '0.688rem',
            color: '#7aa3b8',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Source:
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#00d9ff',
            fontFamily: 'monospace',
            textShadow: '0 0 8px rgba(0, 217, 255, 0.4)'
          }}>
            nhl_data.csv
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default DataStatus;

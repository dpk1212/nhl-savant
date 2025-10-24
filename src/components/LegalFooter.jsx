/**
 * Legal Footer Component
 * Displays on every page with essential disclaimers
 */

import { Link } from 'react-router-dom';
import { AlertTriangle, Scale, Phone } from 'lucide-react';

const LegalFooter = () => {
  return (
    <footer style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderTop: '1px solid var(--color-border)',
      padding: '2rem 1rem',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Critical Disclaimer Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.05) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '0.813rem',
              lineHeight: '1.6',
              color: 'var(--color-text-primary)',
              margin: 0,
              fontWeight: '600'
            }}>
              <strong>Entertainment & Educational Use Only:</strong> All content is for informational purposes and does not constitute betting, financial, or investment advice. Sports betting involves financial risk. Only bet what you can afford to lose. You are solely responsible for your betting decisions.
            </p>
          </div>
        </div>

        {/* Links & Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '1.5rem'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              NHL Savant
            </h3>
            <p style={{
              fontSize: '0.813rem',
              lineHeight: '1.6',
              color: 'var(--color-text-muted)',
              margin: 0
            }}>
              Advanced NHL analytics and statistical modeling for sports enthusiasts. Not a gambling operator or sportsbook.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Scale size={16} />
              Legal
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link 
                  to="/disclaimer" 
                  style={{
                    fontSize: '0.813rem',
                    color: '#3B82F6',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#60A5FA'}
                  onMouseLeave={(e) => e.target.style.color = '#3B82F6'}
                >
                  Terms & Disclaimer
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a 
                  href="https://www.ncpgambling.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.813rem',
                    color: '#3B82F6',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#60A5FA'}
                  onMouseLeave={(e) => e.target.style.color = '#3B82F6'}
                >
                  Responsible Gambling
                </a>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Phone size={16} />
              Need Help?
            </h3>
            <p style={{
              fontSize: '0.813rem',
              lineHeight: '1.6',
              color: 'var(--color-text-muted)',
              margin: '0 0 0.5rem 0'
            }}>
              <strong>Gambling Problem?</strong><br />
              Call 1-800-GAMBLER
            </p>
            <p style={{
              fontSize: '0.813rem',
              lineHeight: '1.6',
              color: 'var(--color-text-muted)',
              margin: 0
            }}>
              Available 24/7 for confidential support
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            maxWidth: '800px',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              <strong>18+/21+ Only.</strong> Verify sports betting is legal in your jurisdiction before placing wagers.
            </p>
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} NHL Savant. All rights reserved. We are not affiliated with the NHL or any sportsbook operator.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;


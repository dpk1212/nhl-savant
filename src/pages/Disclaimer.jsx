/**
 * Legal Disclaimer & Terms of Use
 * Comprehensive legal protection for NHL Savant
 */

import { AlertTriangle, Shield, Scale, Info } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid var(--color-border)'
        }}>
          <Scale size={36} color="#F59E0B" />
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: 'var(--color-text-primary)',
              margin: 0,
              marginBottom: '0.5rem'
            }}>
              Legal Disclaimer & Terms of Use
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              margin: 0
            }}>
              Last Updated: October 24, 2025
            </p>
          </div>
        </div>

        {/* Critical Warning Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)',
          border: '2px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem'
        }}>
          <AlertTriangle size={24} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '800',
              color: '#F59E0B',
              margin: '0 0 0.75rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ⚠️ IMPORTANT: READ BEFORE USE
            </h3>
            <p style={{
              fontSize: '0.938rem',
              lineHeight: '1.6',
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              <strong>All sports betting involves financial risk. Only bet what you can afford to lose.</strong> The content on this site is for entertainment and educational purposes only and does not constitute betting, financial, or investment advice. You are solely responsible for your betting decisions.
            </p>
          </div>
        </div>

        {/* Main Content Sections */}
        <Section
          icon={Info}
          title="1. Nature of Service"
          content={
            <>
              <p><strong>NHL Savant is an information and analytics service, NOT a gambling operator.</strong></p>
              <p>We provide:</p>
              <ul>
                <li><strong>Statistical analysis</strong> of NHL games using publicly available data</li>
                <li><strong>Predictive models</strong> based on historical performance metrics</li>
                <li><strong>Educational content</strong> about sports analytics and probability</li>
                <li><strong>Data visualization</strong> tools for understanding team performance</li>
              </ul>
              <p>We do NOT:</p>
              <ul>
                <li>Accept bets, wagers, or any form of payment for gambling</li>
                <li>Operate as a sportsbook or gambling platform</li>
                <li>Guarantee wins, profits, or specific outcomes</li>
                <li>Provide personalized betting advice tailored to your situation</li>
              </ul>
            </>
          }
        />

        <Section
          icon={Shield}
          title="2. Entertainment & Educational Purpose"
          content={
            <>
              <p><strong>ALL CONTENT IS FOR ENTERTAINMENT AND EDUCATIONAL PURPOSES ONLY.</strong></p>
              <p>Our predictions, analyses, and "recommended picks" are:</p>
              <ul>
                <li>Algorithmic outputs based on statistical models</li>
                <li>Historical performance indicators, not future guarantees</li>
                <li>Educational demonstrations of sports analytics methodology</li>
                <li>NOT betting advice, financial advice, or professional recommendations</li>
              </ul>
              <p><strong>You should NOT rely on our content as the sole basis for any betting decision.</strong> Always conduct your own research and analysis.</p>
            </>
          }
        />

        <Section
          icon={AlertTriangle}
          title="3. No Guarantees or Warranties"
          content={
            <>
              <p><strong>WE MAKE NO REPRESENTATIONS OR WARRANTIES OF ANY KIND.</strong></p>
              <p>Specifically:</p>
              <ul>
                <li><strong>Past performance does not guarantee future results.</strong> Historical accuracy does not predict future predictions.</li>
                <li><strong>No betting system is foolproof.</strong> All sports outcomes involve uncertainty and randomness.</li>
                <li><strong>We do not guarantee accuracy.</strong> Our models are imperfect and subject to error.</li>
                <li><strong>We do not guarantee profitability.</strong> Following our picks may result in financial losses.</li>
                <li><strong>Data may be incomplete or incorrect.</strong> We rely on third-party data sources that may contain errors.</li>
              </ul>
              <p>Any implied or expressed warranties, including fitness for a particular purpose, are expressly disclaimed.</p>
            </>
          }
        />

        <Section
          icon={Scale}
          title="4. Limitation of Liability"
          content={
            <>
              <p><strong>YOU USE THIS SERVICE ENTIRELY AT YOUR OWN RISK.</strong></p>
              <p><strong>NHL Savant, its operators, developers, and affiliates accept NO LIABILITY OR RESPONSIBILITY for:</strong></p>
              <ul>
                <li>Any financial losses incurred from betting decisions</li>
                <li>Inaccurate predictions or incorrect data</li>
                <li>Lost profits or missed opportunities</li>
                <li>Technical errors, downtime, or service interruptions</li>
                <li>Damages resulting from reliance on our content</li>
                <li>Any indirect, incidental, consequential, or punitive damages</li>
              </ul>
              <p><strong>You are solely and exclusively responsible for:</strong></p>
              <ul>
                <li>All betting decisions and their consequences</li>
                <li>Verifying the accuracy of information before use</li>
                <li>Determining your own risk tolerance</li>
                <li>Managing your bankroll and finances</li>
              </ul>
            </>
          }
        />

        <Section
          icon={Info}
          title="5. User Responsibilities"
          content={
            <>
              <p><strong>By using NHL Savant, you agree to:</strong></p>
              <ul>
                <li><strong>Age Requirement:</strong> Be at least 21 years of age (or 18+ if legal in your jurisdiction)</li>
                <li><strong>Legal Compliance:</strong> Verify that sports betting is legal in your jurisdiction before placing any wagers</li>
                <li><strong>Responsible Gambling:</strong> Only bet what you can afford to lose without impacting your financial well-being</li>
                <li><strong>Independent Judgment:</strong> Make your own betting decisions based on your own research and analysis</li>
                <li><strong>Risk Acceptance:</strong> Accept full responsibility for all outcomes of your betting activity</li>
              </ul>
              <p><strong>If you have a gambling problem:</strong></p>
              <ul>
                <li>Call 1-800-GAMBLER (1-800-426-2537)</li>
                <li>Visit <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>ncpgambling.org</a></li>
                <li>Seek professional help immediately</li>
              </ul>
            </>
          }
        />

        <Section
          icon={Shield}
          title="6. Terminology & Interpretation"
          content={
            <>
              <p><strong>When we use terms like "recommended bet," "best bet," or "value pick," we mean:</strong></p>
              <ul>
                <li>Our statistical model identifies a probability discrepancy</li>
                <li>This is an analytical observation, NOT a directive to bet</li>
                <li>These are educational examples of statistical analysis in action</li>
                <li>You should interpret these as "model projections" or "data-driven analysis"</li>
              </ul>
              <p>These terms do NOT constitute advice, recommendations, or guarantees of any kind.</p>
            </>
          }
        />

        <Section
          icon={Info}
          title="7. State & Jurisdiction Laws"
          content={
            <>
              <p><strong>Sports betting laws vary by state and country.</strong></p>
              <p><strong>Your Responsibilities:</strong></p>
              <ul>
                <li>Verify sports betting is legal in your jurisdiction</li>
                <li>Comply with all local, state, and federal gambling laws</li>
                <li>Use only licensed and regulated sportsbooks in your area</li>
                <li>Report any gambling winnings for tax purposes as required</li>
              </ul>
              <p><strong>NHL Savant does NOT:</strong></p>
              <ul>
                <li>Provide legal advice about gambling laws</li>
                <li>Verify your eligibility to place bets</li>
                <li>Assume responsibility for your legal compliance</li>
              </ul>
            </>
          }
        />

        <Section
          icon={Shield}
          title="8. Changes to Terms"
          content={
            <>
              <p>We reserve the right to modify these terms at any time. Changes become effective immediately upon posting. Your continued use of NHL Savant constitutes acceptance of the updated terms.</p>
              <p>Check this page regularly for updates.</p>
            </>
          }
        />

        <Section
          icon={Scale}
          title="9. Indemnification"
          content={
            <>
              <p><strong>You agree to indemnify and hold harmless NHL Savant, its operators, developers, and affiliates from:</strong></p>
              <ul>
                <li>Any claims arising from your use of this service</li>
                <li>Your betting decisions and their consequences</li>
                <li>Your violation of these terms</li>
                <li>Your violation of applicable laws</li>
              </ul>
            </>
          }
        />

        {/* Bottom Banner */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            margin: 0
          }}>
            By using NHL Savant, you acknowledge that you have read, understood, and agree to these terms.
          </p>
        </div>

        {/* Contact */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
          fontSize: '0.813rem',
          color: 'var(--color-text-muted)'
        }}>
          <p>Questions? Contact us at: <strong>legal@nhlsavant.com</strong></p>
        </div>
      </div>
    </div>
  );
};

// Section Component
const Section = ({ icon: Icon, title, content }) => (
  <div style={{
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem'
    }}>
      <Icon size={24} color="#10B981" />
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '800',
        color: 'var(--color-text-primary)',
        margin: 0
      }}>
        {title}
      </h2>
    </div>
    <div style={{
      fontSize: '0.938rem',
      lineHeight: '1.7',
      color: 'var(--color-text-primary)'
    }}>
      {content}
      <style>{`
        p { margin: 0 0 1rem 0; }
        p:last-child { margin-bottom: 0; }
        ul { margin: 0.5rem 0 1rem 0; padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }
        strong { color: var(--color-text-primary); font-weight: 700; }
        a { color: #3B82F6; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>
    </div>
  </div>
);

export default Disclaimer;


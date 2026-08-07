/**
 * Data — SharpFlow Learn / transparency surface.
 * Points to live Record + legacy model CSV archives for SEO/proof.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Download, Calendar, ExternalLink, ScrollText } from 'lucide-react';

const GOLD = '#D4AF37';
const MUTED = 'rgba(232, 238, 248, 0.62)';
const TEXT = '#E8EEF8';
const LINE = 'rgba(232, 238, 248, 0.12)';
const PANEL = 'rgba(18, 26, 43, 0.92)';

const Data = () => {
  const [seasonStats, setSeasonStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/data/season-stats.json?t=${Date.now()}`);
        if (!res.ok) throw new Error('missing');
        const data = await res.json();
        if (!cancelled) setSeasonStats(data);
      } catch {
        if (!cancelled) {
          setSeasonStats({
            nhl: { totalBets: 0, wins: 0, losses: 0, winRate: 0, totalProfit: 0, roi: 0 },
            cbb: { totalBets: 0, wins: 0, losses: 0, winRate: 0, totalProfit: 0, roi: 0 },
            lastUpdated: new Date().toISOString(),
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const exports = [
    {
      href: '/data/nhl-picks-completed.csv',
      title: 'NHL model picks (CSV)',
      blurb: 'Completed NHL model book — results and unit P&L. Legacy model archive, not the SharpFlow Engine ledger.',
      accent: GOLD,
    },
    {
      href: '/data/cbb-picks-completed.csv',
      title: 'CBB model picks (CSV)',
      blurb: 'Completed college basketball model book. Legacy model archive for research and transparency.',
      accent: '#7EB6FF',
    },
    {
      href: '/data/season-stats.json',
      title: 'Season stats (JSON)',
      blurb: 'Machine-readable summary stats for the model archives above.',
      accent: '#94A3B8',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(900px 420px at 0% -10%, rgba(212,175,55,0.12), transparent 55%),
        #0b1220
      `,
      color: TEXT,
      paddingBottom: '4rem',
    }}>
      <header style={{ borderBottom: `1px solid ${LINE}`, padding: '2.75rem 1.25rem 2rem' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Database size={28} color={GOLD} />
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
            }}>
              Data & transparency
            </h1>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '1.05rem', lineHeight: 1.65, color: MUTED, maxWidth: 640 }}>
            SharpFlow’s live proof surface is the graded Engine Record. Below you’ll also find downloadable
            archives from our sport-model books — kept public so history isn’t a marketing edit.
          </p>
          {!loading && seasonStats?.lastUpdated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: MUTED, fontSize: '0.88rem' }}>
              <Calendar size={16} color={GOLD} />
              Model archive stats updated {formatTime(seasonStats.lastUpdated)}
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: '0 auto', padding: '2rem 1.25rem 0' }}>
        {/* Primary CTA — SharpFlow Record */}
        <section style={{
          background: `linear-gradient(135deg, rgba(212,175,55,0.14), ${PANEL})`,
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: 16,
          padding: '1.5rem 1.4rem',
          marginBottom: '1.75rem',
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ScrollText size={22} color={GOLD} />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 0.45rem', fontSize: '1.2rem', fontWeight: 800 }}>
                SharpFlow Record (live)
              </h2>
              <p style={{ margin: '0 0 1rem', fontSize: '0.92rem', lineHeight: 1.65, color: MUTED }}>
                The Engine ledger — timestamped stakes, graded after the game, losses included.
                This is the book to judge SharpFlow on. It is separate from NHL/CBB model CSVs below.
              </p>
              <Link
                to="/record"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.7rem 1.15rem',
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${GOLD}, #FFD700)`,
                  color: '#0A0E27',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                Open Record <ExternalLink size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Model archive summary */}
        {!loading && seasonStats && (
          <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.75rem',
          }}>
            {[
              { key: 'nhl', label: 'NHL model archive', color: GOLD },
              { key: 'cbb', label: 'CBB model archive', color: '#7EB6FF' },
            ].map(({ key, label, color }) => {
              const s = seasonStats[key] || {};
              return (
                <div key={key} style={{
                  background: PANEL,
                  border: `1px solid ${LINE}`,
                  borderRadius: 14,
                  padding: '1.25rem',
                }}>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color }}>
                    {label}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Stat label="Bets" value={s.totalBets ?? '—'} />
                    <Stat label="Win rate" value={s.winRate != null ? `${s.winRate}%` : '—'} />
                    <Stat
                      label="Profit"
                      value={s.totalProfit != null ? `${s.totalProfit >= 0 ? '+' : ''}${s.totalProfit}u` : '—'}
                      tone={s.totalProfit >= 0 ? '#34D399' : '#F87171'}
                    />
                    <Stat
                      label="ROI"
                      value={s.roi != null ? `${s.roi >= 0 ? '+' : ''}${s.roi}%` : '—'}
                      tone={s.roi >= 0 ? '#34D399' : '#F87171'}
                    />
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <section style={{
          background: PANEL,
          border: `1px solid ${LINE}`,
          borderRadius: 16,
          padding: '1.5rem 1.35rem',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem', fontWeight: 800 }}>
            Downloadable archives
          </h2>
          <p style={{ margin: '0 0 1.15rem', fontSize: '0.88rem', color: MUTED, lineHeight: 1.55 }}>
            These files document sport-model history. They are not a dump of wallet identities,
            proprietary scores, or Engine internals.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {exports.map((ex) => (
              <a
                key={ex.href}
                href={ex.href}
                download
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem 1.15rem',
                  borderRadius: 12,
                  border: `1px solid ${LINE}`,
                  background: 'rgba(255,255,255,0.02)',
                  textDecoration: 'none',
                  color: TEXT,
                }}
              >
                <div>
                  <div style={{ fontWeight: 750, marginBottom: '0.25rem', color: ex.accent }}>{ex.title}</div>
                  <div style={{ fontSize: '0.85rem', color: MUTED, lineHeight: 1.5 }}>{ex.blurb}</div>
                </div>
                <Download size={22} color={ex.accent} style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </section>

        <section style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.28)',
          borderRadius: 14,
          padding: '1.15rem 1.25rem',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '0.95rem', fontWeight: 800, color: '#6EE7B7' }}>
            Transparency policy
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: MUTED }}>
            We do not delete graded Engine decisions to clean up a story. Legacy model CSVs remain available
            for audit. Internal methods stay private; outcomes stay public. For privacy terms, see{' '}
            <a href="/privacy.html" style={{ color: GOLD }}>Privacy Policy</a>.
          </p>
        </section>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link to="/methodology" style={ghostBtn}>How it works</Link>
          <Link to="/faq" style={ghostBtn}>FAQ</Link>
          <Link to="/record" style={{ ...ghostBtn, background: `linear-gradient(135deg, ${GOLD}, #FFD700)`, color: '#0A0E27', border: 'none' }}>
            Open Record
          </Link>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(232,238,248,0.4)' }}>
          Last updated: August 7, 2026 · SharpFlow
        </p>
      </main>
    </div>
  );
};

function Stat({ label, value, tone = TEXT }) {
  return (
    <div>
      <div style={{ fontSize: '0.72rem', color: MUTED, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: tone }}>{value}</div>
    </div>
  );
}

const ghostBtn = {
  display: 'inline-flex',
  padding: '0.65rem 1rem',
  borderRadius: 10,
  border: `1px solid ${LINE}`,
  color: TEXT,
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: '0.88rem',
  background: 'rgba(255,255,255,0.03)',
};

export default Data;

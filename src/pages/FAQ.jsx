/**
 * FAQ — SharpFlow Learn surface.
 * Premium, SEO-ready, Schema.org FAQPage. No IP leakage.
 */
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';

const FAQS = {
    product: {
      title: 'What SharpFlow is',
      questions: [
        {
          id: 'p1',
          question: 'What is SharpFlow?',
          answer: 'SharpFlow is a sports-market intelligence product. We map where verified sharp money sits on today’s games, decide when that picture is clear enough to act (the Prediction Engine), and grade every Engine decision in public — wins and losses included.',
          link: { text: 'Open the Market', url: '/' },
        },
        {
          id: 'p2',
          question: 'How is this different from a tipster or handicapping service?',
          answer: 'Tipsters sell opinions. SharpFlow sells a loop: live money map → selective stakes → public ledger. You can see the tape, see who is behind it, see what cleared the Engine, and audit the Record. We are not a sportsbook and we do not take bets.',
          link: { text: 'How it works', url: '/methodology' },
        },
        {
          id: 'p3',
          question: 'What do Market, Engine, Sharps, and Record mean?',
          answer: 'Market is today’s money map. Engine is what cleared our bar to stake. Sharps is the wallet ledger — who has historically beaten these markets. Record is the graded book for Engine decisions. Those four tabs are the product.',
          link: { text: 'Read the full walkthrough', url: '/methodology' },
        },
        {
          id: 'p4',
          question: 'Which sports does SharpFlow cover?',
          answer: 'The Market tracks sharp flow across in-season sports boards (for example MLB, NHL, NFL, WNBA, soccer, and UFC when those markets are live). Coverage expands with the calendar. Sport chips on the Market let you filter the board.',
          link: { text: 'View today’s Market', url: '/' },
        },
        {
          id: 'p5',
          question: 'What happened to NHL Savant?',
          answer: 'NHL Savant was the original brand when the product was hockey-first. SharpFlow is the same company and data stack, repositioned around the multi-sport money map and decision engine. Sport-specific models (NHL, MLB, CBB) still live under Models.',
          link: { text: 'Browse Models', url: '/todays-games' },
        },
      ],
    },
    using: {
      title: 'Using the product',
      questions: [
        {
          id: 'u1',
          question: 'How should I use SharpFlow day to day?',
          answer: 'Start on Market to see where money is contested. Check Engine for what we actually staked. Use Sharps when you want context on who is driving a side. End on Record to grade results over time. The live board moves all day — tweets and screenshots lag the product.',
          link: { text: 'Open Market', url: '/' },
        },
        {
          id: 'u2',
          question: 'Why are some games monitored but not staked?',
          answer: 'Because clarity beats activity. When the money map is thin, two-sided, or otherwise unclear, the Engine stays out. Mute and watch states are intentional — overtrading is how books bleed.',
          link: { text: 'Open Engine', url: '/engine' },
        },
        {
          id: 'u3',
          question: 'When do picks lock?',
          answer: 'Engine stakes lock ahead of game time so the book is fair to audit. Exact lock windows can vary by market; the card always shows countdown and status. Anything posted after lock does not belong in the graded Record.',
          link: null,
        },
        {
          id: 'u4',
          question: 'Do you recommend parlays?',
          answer: 'No. Parlays stack juice against you by design. SharpFlow is built around selective singles and a graded unit book — not parlays, teasers, or promo bait.',
          link: null,
        },
        {
          id: 'u5',
          question: 'Is this financial or betting advice?',
          answer: 'No. SharpFlow is an information and analytics product for entertainment and education. You are solely responsible for whether and how you use it, and for complying with the laws where you live.',
          link: { text: 'Terms of Use', url: '/terms.html' },
        },
      ],
    },
    models: {
      title: 'Models & sport pages',
      questions: [
        {
          id: 'm1',
          question: 'What are the NHL / MLB / CBB model pages?',
          answer: 'Those are sport-specific model surfaces from our earlier product lines. They remain available under Models for users who want that view. They are not the same thing as the SharpFlow Engine book — check labels carefully when comparing records.',
          link: { text: 'NHL Model', url: '/todays-games' },
        },
        {
          id: 'm2',
          question: 'Where is the SharpFlow graded record vs the NHL model record?',
          answer: 'SharpFlow Record (top nav → Record) is the Engine ledger. NHL Model Record lives under Models and grades the hockey model book. Mixing them is how people get confused — we keep them separate on purpose.',
          link: { text: 'SharpFlow Record', url: '/record' },
        },
        {
          id: 'm3',
          question: 'Will you publish the exact formulas behind the Engine?',
          answer: 'No. We describe the product loop and show graded outcomes. Internal scoring, wallet qualification, and sizing rules are proprietary. The proof is the public Record, not a recipe card for competitors.',
          link: { text: 'How it works', url: '/methodology' },
        },
      ],
    },
    pricing: {
      title: 'Pricing & access',
      questions: [
        {
          id: 'pr1',
          question: 'How much does SharpFlow cost?',
          answer: 'Plans start with a short free trial so you can watch the Market and grade the Engine yourself. Current tiers: Scout (weekly), Elite (monthly), and Pro (annual). Full feature access during trial. See Pricing for live numbers.',
          link: { text: 'View pricing', url: '/pricing' },
        },
        {
          id: 'pr2',
          question: 'Can I try before I pay?',
          answer: 'Yes. Every plan includes a free trial (typically 5–10 days depending on tier). Use that window to follow the board and verify the Record — then decide.',
          link: { text: 'Start free trial', url: '/pricing' },
        },
        {
          id: 'pr3',
          question: 'What do I get with a paid plan?',
          answer: 'Full access to Market, Engine, Sharps, and Record across covered sports, plus account features tied to your plan. We do not sell “secret picks” in DMs — the product is the board.',
          link: { text: 'Open Account', url: '/account' },
        },
      ],
    },
    trust: {
      title: 'Trust, risk & results',
      questions: [
        {
          id: 't1',
          question: 'Do you hide losses?',
          answer: 'No. Graded losses stay on the Record. If a service only shows winners, treat that as marketing, not a book.',
          link: { text: 'View Record', url: '/record' },
        },
        {
          id: 't2',
          question: 'What happens during a cold stretch?',
          answer: 'Variance is real in every sports market. Short samples swing. What matters is process quality and long-horizon results on a timestamped ledger — not any single week’s narrative.',
          link: { text: 'View Record', url: '/record' },
        },
        {
          id: 't3',
          question: 'What ROI should I expect?',
          answer: 'Anyone promising a fixed ROI is selling fantasy. Professional edges in liquid sports markets are often small and noisy. Use the Record to judge us; size risk only with money you can afford to lose.',
          link: null,
        },
        {
          id: 't4',
          question: 'Where can I download historical data?',
          answer: 'The Data page hosts exportable archives for legacy model books (NHL / CBB CSVs) and points you to the live SharpFlow Record for the Engine ledger.',
          link: { text: 'Open Data', url: '/data' },
        },
        {
          id: 't5',
          question: 'I think I have a gambling problem. What should I do?',
          answer: 'Stop using betting products and get help. Call 1-800-GAMBLER or visit ncpgambling.org. SharpFlow is not a crisis service, but we take responsible use seriously.',
          link: null,
        },
      ],
    },
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    product: true,
    using: false,
    models: false,
    pricing: false,
    trust: false,
  });
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleQuestion = (id) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filterQuestions = (questions) => {
    if (!searchTerm.trim()) return questions;
    const q = searchTerm.toLowerCase();
    return questions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  };

  const schema = useMemo(() => {
    const all = Object.values(FAQS).flatMap((cat) => cat.questions);
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: all.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0b1220', paddingBottom: '3rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div style={{
        background: 'radial-gradient(900px 420px at 10% -20%, rgba(212,175,55,0.16), transparent 55%), #0b1220',
        borderBottom: '1px solid rgba(232,238,248,0.1)',
        padding: '2.75rem 1.25rem 2rem',
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <HelpCircle size={28} color={GOLD} />
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#E8EEF8',
              fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
            }}>
              Frequently asked questions
            </h1>
          </div>
          <p style={{ margin: '0 0 1.5rem', color: 'rgba(232,238,248,0.62)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 640 }}>
            Straight answers about SharpFlow — what it is, how to use Market and Engine, and where the proof lives.
          </p>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="search"
              placeholder="Search FAQs…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.75rem',
                background: 'rgba(18,26,43,0.95)',
                border: '1px solid rgba(232,238,248,0.12)',
                borderRadius: 12,
                color: '#E8EEF8',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '1.75rem 1.25rem 0' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}>
          {Object.entries(FAQS).map(([key, cat]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                toggleCategory(key);
                document.getElementById(`category-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 999,
                border: `1px solid ${expandedCategories[key] ? 'rgba(212,175,55,0.45)' : 'rgba(232,238,248,0.12)'}`,
                background: expandedCategories[key] ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: expandedCategories[key] ? GOLD : 'rgba(232,238,248,0.7)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {Object.entries(FAQS).map(([key, category]) => {
          const filtered = filterQuestions(category.questions);
          if (searchTerm && filtered.length === 0) return null;
          return (
            <section key={key} id={`category-${key}`} style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => toggleCategory(key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.15rem',
                  background: 'rgba(18,26,43,0.92)',
                  border: '1px solid rgba(232,238,248,0.12)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  marginBottom: '0.6rem',
                }}
              >
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#E8EEF8' }}>
                  {category.title}
                </h2>
                {expandedCategories[key] ? <ChevronUp size={20} color={GOLD} /> : <ChevronDown size={20} color="#94A3B8" />}
              </button>

              {expandedCategories[key] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filtered.map((faq) => (
                    <div
                      key={faq.id}
                      style={{
                        background: 'rgba(18,26,43,0.85)',
                        border: '1px solid rgba(232,238,248,0.1)',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleQuestion(faq.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.95rem 1.1rem',
                          background: expandedQuestions.has(faq.id) ? 'rgba(212,175,55,0.06)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          color: '#E8EEF8',
                          fontWeight: 650,
                          fontSize: '0.95rem',
                        }}
                      >
                        <span>{faq.question}</span>
                        {expandedQuestions.has(faq.id) ? <ChevronUp size={18} color={GOLD} /> : <ChevronDown size={18} color="#64748B" />}
                      </button>
                      {expandedQuestions.has(faq.id) && (
                        <div style={{ padding: '0 1.1rem 1.1rem' }}>
                          <p style={{ margin: '0 0 0.65rem', color: 'rgba(232,238,248,0.68)', lineHeight: 1.65, fontSize: '0.92rem' }}>
                            {faq.answer}
                          </p>
                          {faq.link && (
                            faq.link.url.endsWith('.html') ? (
                              <a href={faq.link.url} style={{ color: GOLD, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                                {faq.link.text} →
                              </a>
                            ) : (
                              <Link to={faq.link.url} style={{ color: GOLD, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                                {faq.link.text} →
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <div style={{
          marginTop: '2rem',
          padding: '1.75rem 1.5rem',
          borderRadius: 16,
          border: '1px solid rgba(212,175,55,0.28)',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(18,26,43,0.9))',
          textAlign: 'center',
        }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem', fontWeight: 800, color: '#E8EEF8' }}>
            Watch it grade itself
          </h2>
          <p style={{ margin: '0 0 1.25rem', color: 'rgba(232,238,248,0.65)', lineHeight: 1.6 }}>
            Start with a free trial. Follow the Market, check the Engine, and audit the Record — losses included.
          </p>
          <Link
            to="/pricing"
            style={{
              display: 'inline-block',
              padding: '0.85rem 1.5rem',
              borderRadius: 10,
              background: `linear-gradient(135deg, ${GOLD}, #FFD700)`,
              color: '#0A0E27',
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            Start free trial
          </Link>
        </div>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(232,238,248,0.4)' }}>
          Last updated: August 7, 2026 · SharpFlow
        </p>
      </div>
    </div>
  );
};

export default FAQ;

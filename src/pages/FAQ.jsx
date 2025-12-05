import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * FAQ Page - Optimized for LLM Citations
 * 40 questions across 5 categories
 * Structured format with Schema.org FAQPage markup
 */

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    nhl: true,
    cbb: false,
    methodology: false,
    pricing: false,
    performance: false
  });
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const faqs = {
    nhl: {
      title: 'NHL Betting',
      questions: [
        {
          id: 'nhl-1',
          question: 'How do I find +EV NHL picks?',
          answer: 'Finding +EV (positive expected value) NHL picks requires comparing your calculated win probability against what the odds imply. NHL Savant does this automatically—we calculate true win probability using our proprietary model, then flag picks where we see meaningful edge over the market.',
          link: { text: 'See today\'s +EV picks', url: '/' }
        },
        {
          id: 'nhl-2',
          question: 'What is PDO regression in hockey betting?',
          answer: 'PDO = shooting % + save %. League average is 1.000. Teams above 1.02 are "lucky" and due for negative regression; teams below 0.98 are "unlucky" and due for positive regression. Markets don\'t always adjust fast enough, creating potential betting edges.',
          link: { text: 'Learn about PDO', url: '/guides/pdo-regression-nhl-betting' }
        },
        {
          id: 'nhl-3',
          question: 'What makes NHL Savant\'s model different?',
          answer: 'We use a proprietary ensemble approach that combines multiple prediction models with our own adjustments for goalie matchups, rest advantage, and situational factors. This multi-model approach reduces variance and catches edges that single-model systems miss.',
          link: { text: 'View methodology', url: '/methodology' }
        },
        {
          id: 'nhl-4',
          question: 'Do you recommend NHL parlays?',
          answer: 'No. Parlays are -EV by design due to compounding juice. We only recommend +EV single plays (moneylines). No props, no teasers, no hype—just mathematically sound bets.',
          link: null
        },
        {
          id: 'nhl-5',
          question: 'How much does NHL Savant cost?',
          answer: '$25.99/month (Elite plan) or $150/year (Pro plan, best value at $12.50/month). Weekly Scout plan is $7.99. All plans include both NHL and college basketball. Free trial included: 5-10 days depending on plan.',
          link: { text: 'See all pricing options', url: '/pricing' }
        },
        {
          id: 'nhl-6',
          question: 'What happens during a losing streak?',
          answer: 'Variance is inevitable in sports betting. Even the best models have cold stretches. What matters is long-term EV, not any single week. We communicate losses honestly and track everything publicly on our performance dashboard.',
          link: { text: 'View our live performance', url: '/performance' }
        },
        {
          id: 'nhl-7',
          question: 'Can I try NHL Savant before paying?',
          answer: 'Yes. Free trial is 5-10 days depending on plan (Scout: 5 days, Elite: 7 days, Pro: 10 days). Full access to all features during trial. See the picks, verify the results, then decide.',
          link: { text: 'Start free trial', url: '/pricing' }
        },
        {
          id: 'nhl-8',
          question: 'What types of NHL bets does the model recommend?',
          answer: 'We focus primarily on moneylines because that\'s where our model shows the strongest edge. We grade each pick (A+ through C) based on confidence level, and provide recommended unit sizes. No parlays, no props—just clean, +EV moneyline plays.',
          link: { text: 'See today\'s picks', url: '/' }
        },
        {
          id: 'nhl-9',
          question: 'What\'s a good NHL betting ROI?',
          answer: 'Professional sharp bettors target 3-5% ROI long-term. Higher ROIs are possible in smaller samples but expect variance. Any sustained ROI above 3% is excellent in NHL betting.',
          link: null
        },
        {
          id: 'nhl-10',
          question: 'How accurate are NHL betting models?',
          answer: 'Even the best models predict winners at 52-58% accuracy. That\'s all you need for profitability when betting +EV plays. Win rate alone doesn\'t matter—ROI is what counts.',
          link: { text: 'See our current accuracy', url: '/performance' }
        },
        {
          id: 'nhl-11',
          question: 'How often do you release NHL picks?',
          answer: 'We release picks daily during the NHL season, typically by early afternoon ET. Every game on the slate is analyzed, and we highlight the ones with positive expected value.',
          link: null
        },
        {
          id: 'nhl-12',
          question: 'Do you factor in starting goalies?',
          answer: 'Yes. Goalie matchups are a critical part of our model. We factor in each goalie\'s performance metrics and adjust our predictions accordingly. When starting goalies are confirmed, our predictions update automatically.',
          link: null
        }
      ]
    },
    cbb: {
      title: 'College Basketball Betting',
      questions: [
        {
          id: 'cbb-1',
          question: 'How do I find +EV college basketball picks?',
          answer: 'College basketball requires analyzing adjusted efficiency ratings and comparing them to market odds. NHL Savant uses a proprietary ensemble model that combines multiple prediction systems to find games where the market has mispriced win probability.',
          link: { text: 'See CBB picks', url: '/basketball' }
        },
        {
          id: 'cbb-2',
          question: 'Why is college basketball better for +EV betting than the NBA?',
          answer: 'More games (350+ teams vs 30 NBA teams), fewer sharp bettors, lines move slower, and more data inefficiency. This creates more mispriced opportunities than you\'d find in the heavily-analyzed NBA market.',
          link: null
        },
        {
          id: 'cbb-3',
          question: 'What\'s the best March Madness betting strategy?',
          answer: 'Use efficiency data to find mispriced seeds. Avoid emotional Cinderella picks. Focus on mid-seed matchups (5-12 upset opportunities) and teams whose underlying metrics don\'t match their seed. We publish tournament picks throughout March.',
          link: null
        },
        {
          id: 'cbb-4',
          question: 'What makes your college basketball model accurate?',
          answer: 'We use an ensemble approach that combines multiple respected prediction systems with our own proprietary adjustments. This multi-source validation means we only recommend picks where multiple models agree there\'s value.',
          link: null
        },
        {
          id: 'cbb-5',
          question: 'How do injuries impact college basketball EV?',
          answer: 'Much more than NBA/NHL. Thinner rosters mean star player injuries can reduce win probability by 8-12%. Markets often adjust slowly to these changes, creating +EV opportunities when you\'re tracking lineup news.',
          link: null
        },
        {
          id: 'cbb-6',
          question: 'Should I bet college basketball props?',
          answer: 'No. Props typically have 5-7% hold (worse than sides), making them -EV. We stick to moneylines and spreads only where the math actually works in your favor.',
          link: null
        },
        {
          id: 'cbb-7',
          question: 'What\'s home court advantage worth in college basketball?',
          answer: '2.5-3.5 points depending on arena and atmosphere. Small school gyms typically carry less advantage than hostile environments like Duke\'s Cameron Indoor. We factor venue into every prediction.',
          link: null
        },
        {
          id: 'cbb-8',
          question: 'How many college basketball picks do you release daily?',
          answer: 'It varies based on where we see value. Some days we might have 10+ picks, other days just 2-3. We only release picks where our model shows positive expected value—we\'d rather miss games than force bad bets.',
          link: null
        },
        {
          id: 'cbb-9',
          question: 'Do you cover mid-major and small conference games?',
          answer: 'Yes. In fact, smaller conferences often have more betting value because they\'re less efficiently priced by the market. Our model covers all D1 games where we have sufficient data.',
          link: null
        },
        {
          id: 'cbb-10',
          question: 'Do you have college basketball picks during March Madness?',
          answer: 'Yes. We publish picks for all tournament games. Note that tournament variance is extreme (single-elimination). We focus on +EV plays and avoid parlays even when it\'s tempting.',
          link: null
        }
      ]
    },
    methodology: {
      title: 'Methodology & Model',
      questions: [
        {
          id: 'meth-1',
          question: 'How does the NHL Savant model work?',
          answer: 'We use a proprietary ensemble approach that combines multiple prediction models, then applies our own adjustments for goalie matchups, rest advantage, and other situational factors. We compare our calculated win probability to market odds to identify +EV opportunities.',
          link: { text: 'View methodology', url: '/methodology' }
        },
        {
          id: 'meth-2',
          question: 'What is expected goals (xG)?',
          answer: 'xG measures the quality of scoring chances, not just shot count. A slot shot has higher xG than a point shot. xG per 60 minutes is one of the most predictive offensive metrics in hockey analytics.',
          link: null
        },
        {
          id: 'meth-3',
          question: 'What is GSAE?',
          answer: 'Goals Saved Above Expected. Measures how many goals a goalie prevents compared to what an average goalie would allow on those same shots. Positive GSAE = elite goalie. Negative GSAE = struggling goalie.',
          link: null
        },
        {
          id: 'meth-4',
          question: 'What does "ensemble model" mean?',
          answer: 'An ensemble model combines multiple prediction sources rather than relying on just one. By blending different approaches, we reduce variance and improve accuracy. Our picks only hit when multiple models agree there\'s value.',
          link: null
        },
        {
          id: 'meth-5',
          question: 'What\'s the Top Scorers feature?',
          answer: 'Our premium feature analyzes NHL player matchups using multiple factors including opponent defense quality, pace, goalie performance, and player shot volume. Shows which players have favorable scoring matchups tonight.',
          link: { text: 'See Top Scorers', url: '/top-scorers' }
        },
        {
          id: 'meth-6',
          question: 'What\'s the Hot Takes feature?',
          answer: 'AI-generated expert analysis for every NHL game. Provides structured insights including model prediction, scoring outlook, and betting angles. Combines our quantitative analysis with readable narrative.',
          link: { text: 'See Hot Takes', url: '/matchup-insights' }
        },
        {
          id: 'meth-7',
          question: 'How do you track live win probability?',
          answer: 'During games, we calculate real-time win probability based on current score, period, and pre-game prediction. Shows how your bet is performing live so you can follow along.',
          link: null
        },
        {
          id: 'meth-8',
          question: 'How are bets graded automatically?',
          answer: 'Our system automatically fetches final scores, matches them to our picks, and calculates profit/loss. Everything updates on the performance dashboard without any manual entry required.',
          link: null
        },
        {
          id: 'meth-9',
          question: 'What does each grade (A+, A, B+, etc.) mean?',
          answer: 'Grades reflect our confidence in each pick based on the strength of the edge. A+ and A grades indicate high-confidence plays where multiple factors align. B+ and B are solid plays with good value. C grades are lower confidence but still positive EV.',
          link: null
        },
        {
          id: 'meth-10',
          question: 'How do you calculate recommended unit size?',
          answer: 'Unit sizing is based on our confidence level and historical performance patterns. Higher-graded picks with stronger edges get larger unit recommendations. We cap maximum exposure to protect against variance.',
          link: null
        }
      ]
    },
    pricing: {
      title: 'Pricing & Trials',
      questions: [
        {
          id: 'price-1',
          question: 'What\'s included in each plan?',
          answer: 'All plans include the same features: full NHL and college basketball picks, AI Hot Takes, Top Scorers analysis, performance tracking, and live win probability. The only difference is commitment level—weekly, monthly, or annual.',
          link: { text: 'Compare plans', url: '/pricing' }
        },
        {
          id: 'price-2',
          question: 'How does the free trial work?',
          answer: 'Sign up for any plan and get 5-10 days free (Scout: 5 days, Elite: 7 days, Pro: 10 days). Full access to every feature during trial. If you love it, continue. If not, cancel before trial ends with zero charge.',
          link: { text: 'Start free trial', url: '/pricing' }
        },
        {
          id: 'price-3',
          question: 'Can I cancel anytime?',
          answer: 'Yes. All subscriptions are managed through Stripe. You can cancel, change plans, or update payment method anytime via the Account page. No questions asked, no cancellation fees.',
          link: { text: 'Manage account', url: '/account' }
        },
        {
          id: 'price-4',
          question: 'What payment methods do you accept?',
          answer: 'All major credit cards via Stripe. Secure, encrypted, PCI-compliant payment processing. Your payment information is never stored on our servers.',
          link: null
        },
        {
          id: 'price-5',
          question: 'Is there a money-back guarantee?',
          answer: 'The free trial IS your guarantee. Test all the picks for 5-10 days before paying a cent. See the results, verify the transparency, then decide. If it\'s not for you, cancel before trial ends—zero risk.',
          link: null
        },
        {
          id: 'price-6',
          question: 'What\'s the best value plan?',
          answer: 'The annual Pro plan ($150/year) saves you 52% vs monthly pricing. That\'s just $12.50/month—less than the cost of one losing bet. Plus you get the longest free trial (10 days).',
          link: { text: 'View annual plan', url: '/pricing' }
        },
        {
          id: 'price-7',
          question: 'Do you offer refunds?',
          answer: 'We offer a generous free trial instead of refunds. This lets you fully test the service before any charge. If you forget to cancel during trial, contact us and we\'ll work with you.',
          link: null
        },
        {
          id: 'price-8',
          question: 'Can I upgrade or downgrade my plan?',
          answer: 'Yes. You can switch plans anytime from your Account page. Upgrades take effect immediately, downgrades take effect at your next billing cycle.',
          link: { text: 'Manage subscription', url: '/account' }
        }
      ]
    },
    performance: {
      title: 'Performance & Transparency',
      questions: [
        {
          id: 'perf-1',
          question: 'Where can I see your track record?',
          answer: 'Every bet is tracked publicly on the Performance Dashboard. Updated daily with win/loss records, ROI, units, and profit. We show every loss—nothing is hidden or deleted.',
          link: { text: 'View live performance', url: '/performance' }
        },
        {
          id: 'perf-2',
          question: 'Do you delete losing picks?',
          answer: 'Never. Every pick stays in the database forever. Full transparency is our competitive advantage—we\'re not Twitter touts who delete losses. You can export the complete history anytime.',
          link: null
        },
        {
          id: 'perf-3',
          question: 'What\'s your current season ROI?',
          answer: 'Check the Performance Dashboard for real-time numbers updated daily. ROI will fluctuate week to week—that\'s normal variance. What matters is long-term positive expected value.',
          link: { text: 'Live performance data', url: '/performance' }
        },
        {
          id: 'perf-4',
          question: 'How do you handle losing streaks?',
          answer: 'We communicate them honestly. Cold streaks happen to every model—it\'s variance, not a broken system. Over 100+ bets, variance smooths out. We focus on process (finding +EV) over short-term outcomes.',
          link: null
        },
        {
          id: 'perf-5',
          question: 'Can I download your historical picks?',
          answer: 'Yes. CSV exports with all historical picks, results, and profit/loss are available. Complete transparency so you can audit our performance yourself.',
          link: { text: 'View data exports', url: '/data' }
        },
        {
          id: 'perf-6',
          question: 'How do I know NHL Savant is legitimate?',
          answer: 'Every pick is timestamped and tracked publicly before game time. We show every loss alongside every win. We offer a free trial so you can verify our results before paying anything. Unlike shady cappers, we have nothing to hide.',
          link: { text: 'Start free trial', url: '/pricing' }
        },
        {
          id: 'perf-7',
          question: 'What\'s your win rate?',
          answer: 'Win rate varies by sport and grade level, typically 50-60%. But win rate alone is misleading—what matters is ROI. A 52% win rate on +EV bets is profitable. Check our dashboard for current numbers.',
          link: { text: 'View performance', url: '/performance' }
        },
        {
          id: 'perf-8',
          question: 'How do you compare to other betting services?',
          answer: 'Unlike most services, we: (1) track every pick publicly, (2) show every loss, (3) never recommend parlays, (4) focus only on +EV plays, (5) offer a free trial to verify before paying. We compete on transparency, not hype.',
          link: null
        }
      ]
    }
  };

  // Filter questions based on search
  const filterQuestions = (questions) => {
    if (!searchTerm) return questions;
    return questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Generate Schema.org FAQPage markup
  const generateSchemaMarkup = () => {
    const allQuestions = Object.values(faqs).flatMap(cat => cat.questions);
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allQuestions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    };
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background)',
      paddingBottom: '4rem'
    }}>
      {/* Schema.org Markup */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchemaMarkup())}
      </script>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(11, 15, 31, 1) 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3rem 1rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <HelpCircle size={40} color="#D4AF37" />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#F8FAFC',
              margin: 0
            }}>
              ❓ Frequently Asked Questions
            </h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Everything you need to know about NHL Savant's +EV betting model, methodology, pricing, and performance.
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              color="#94A3B8" 
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                color: 'var(--color-text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Jump Links */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Categories
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {Object.entries(faqs).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => {
                  toggleCategory(key);
                  document.getElementById(`category-${key}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: expandedCategories[key] 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid',
                  borderColor: expandedCategories[key] ? 'rgba(212, 175, 55, 0.4)' : 'var(--color-border)',
                  borderRadius: '8px',
                  color: expandedCategories[key] ? '#D4AF37' : 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!expandedCategories[key]) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!expandedCategories[key]) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.borderColor = 'var(--color-border)';
                  }
                }}
              >
                {cat.title} ({cat.questions.length})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        {Object.entries(faqs).map(([key, category]) => {
          const filteredQuestions = filterQuestions(category.questions);
          if (filteredQuestions.length === 0 && searchTerm) return null;

          return (
            <div key={key} id={`category-${key}`} style={{ marginBottom: '2rem' }}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  background: 'linear-gradient(135deg, var(--color-card) 0%, rgba(21, 25, 35, 0.95) 100%)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--color-text-primary)',
                  margin: 0
                }}>
                  {category.title}
                </h2>
                {expandedCategories[key] ? (
                  <ChevronUp size={24} color="#D4AF37" />
                ) : (
                  <ChevronDown size={24} color="#94A3B8" />
                )}
              </button>

              {/* Questions */}
              {expandedCategories[key] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredQuestions.map((faq) => (
                    <div
                      key={faq.id}
                      style={{
                        background: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        transition: 'all 0.2s'
                      }}
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleQuestion(faq.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.25rem',
                          background: expandedQuestions.has(faq.id) 
                            ? 'rgba(212, 175, 55, 0.05)' 
                            : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = expandedQuestions.has(faq.id)
                            ? 'rgba(212, 175, 55, 0.05)'
                            : 'transparent';
                        }}
                      >
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: 'var(--color-text-primary)',
                          flex: 1
                        }}>
                          {faq.question}
                        </span>
                        {expandedQuestions.has(faq.id) ? (
                          <ChevronUp size={20} color="#D4AF37" style={{ flexShrink: 0, marginLeft: '1rem' }} />
                        ) : (
                          <ChevronDown size={20} color="#94A3B8" style={{ flexShrink: 0, marginLeft: '1rem' }} />
                        )}
                      </button>

                      {/* Answer */}
                      {expandedQuestions.has(faq.id) && (
                        <div style={{
                          padding: '0 1.25rem 1.25rem',
                          borderTop: '1px solid var(--color-border)',
                          animation: 'fadeIn 0.3s ease-in'
                        }}>
                          <p style={{
                            fontSize: '0.938rem',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.7,
                            marginBottom: faq.link ? '1rem' : 0,
                            marginTop: '1rem'
                          }}>
                            {faq.answer}
                          </p>
                          {faq.link && (
                            <Link
                              to={faq.link.url}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#D4AF37',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#FFD700';
                                e.currentTarget.style.gap = '0.75rem';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#D4AF37';
                                e.currentTarget.style.gap = '0.5rem';
                              }}
                            >
                              {faq.link.text} →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            Ready to Start Finding +EV Picks?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Get daily +EV picks for NHL and College Basketball with full transparency. Try free for 2-5 days.
          </p>
          <Link
            to="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
              color: '#0A0E27',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            }}
          >
            Start Free Trial
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: '1400px',
        margin: '3rem auto 0',
        padding: '0 1rem',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          marginBottom: '0.5rem'
        }}>
          Last Updated: December 5, 2025
        </p>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)'
        }}>
          Have a question not listed here? <Link to="/" style={{ color: '#D4AF37', textDecoration: 'none' }}>Contact us</Link>
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ;


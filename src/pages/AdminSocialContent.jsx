/**
 * Admin Social Content Page
 * Hidden admin page for viewing and copying social media content
 * 
 * Auth-gated, only accessible to admin users
 * One-click copy buttons for Twitter/Reddit/Perplexity
 */

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { Copy, CheckCircle, RefreshCw, Twitter, MessageCircle, Search, Calendar, BookOpen } from 'lucide-react';

export default function AdminSocialContent() {
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedItem, setCopiedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      loadContent();
    }
  }, [user, selectedDate]);

  async function loadContent() {
    setLoading(true);
    try {
      const docRef = doc(db, 'socialContent', selectedDate);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data());
      } else {
        setContent(null);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
    setLoading(false);
  }

  const copyToClipboard = (text, itemId) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemId);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const copyTwitterThread = () => {
    const fullThread = content.morningPicks.twitterThread.join('\n\n---\n\n');
    copyToClipboard(fullThread, 'twitter-thread');
  };

  const copyRedditPost = () => {
    const fullPost = `${content.morningPicks.redditTitle}\n\n${content.morningPicks.redditBody}`;
    copyToClipboard(fullPost, 'reddit-full');
  };

  // Auth check
  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔒 Admin Access Required</h1>
        <p style={{ color: '#666' }}>Please sign in to access this page.</p>
      </div>
    );
  }

  // Admin check (adjust email to match your admin email)
  const adminEmails = ['dale@nhlsavant.com', 'dalekolnitys@gmail.com'];
  if (!adminEmails.includes(user.email)) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔒 Unauthorized</h1>
        <p style={{ color: '#666' }}>This page is restricted to admin users only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <RefreshCw style={{ width: '3rem', height: '3rem', color: '#6366f1', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '4rem', background: '#f9fafb', borderRadius: '8px' }}>
          <Calendar style={{ width: '3rem', height: '3rem', color: '#666', margin: '0 auto' }} />
          <h2 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>No Content Generated Yet</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Content for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} has not been generated.
          </p>
          <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.875rem' }}>
            Content generates automatically at 8 AM ET (morning) and 11 PM ET (night).
          </p>
          <button 
            onClick={loadContent}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '1.5rem auto 0'
            }}
          >
            <RefreshCw style={{ width: '1rem', height: '1rem' }} />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const CopyButton = ({ onClick, itemId, label = 'Copy' }) => (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        background: copiedItem === itemId ? '#10b981' : '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        transition: 'all 0.2s'
      }}
    >
      {copiedItem === itemId ? (
        <>
          <CheckCircle style={{ width: '1rem', height: '1rem' }} />
          Copied!
        </>
      ) : (
        <>
          <Copy style={{ width: '1rem', height: '1rem' }} />
          {label}
        </>
      )}
    </button>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          🔒 Social Media Content
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#666' }}>
          <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          {content.morningPicks && (
            <span style={{ fontSize: '0.875rem' }}>
              Generated: {new Date(content.morningPicks.generatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Date Selector & Refresh */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}
        />
        <button
          onClick={loadContent}
          style={{
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <RefreshCw style={{ width: '1rem', height: '1rem' }} />
          Refresh
        </button>
      </div>

      {/* Morning Picks Section */}
      {content.morningPicks && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', padding: '1rem', borderRadius: '8px 8px 0 0', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Twitter style={{ width: '1.25rem', height: '1.25rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Morning Picks - Twitter Thread</h2>
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
              {content.morningPicks.pickCount} picks | Top: {content.morningPicks.topPickTeam} (+{content.morningPicks.topPickEV}% EV)
            </p>
          </div>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              {content.morningPicks.twitterThread.map((tweet, i) => (
                <div key={i} style={{ marginBottom: '1.5rem', borderLeft: '3px solid #1DA1F2', paddingLeft: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Tweet {i + 1}/{content.morningPicks.twitterThread.length}
                  </div>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                    {tweet}
                  </pre>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <CopyButton onClick={copyTwitterThread} itemId="twitter-thread" label="Copy Full Thread" />
              <CopyButton 
                onClick={() => copyToClipboard(content.morningPicks.twitterThread[0], 'twitter-first')} 
                itemId="twitter-first" 
                label="Copy First Tweet" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Reply Templates */}
      {content.morningPicks?.replyTemplates && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ background: '#1DA1F2', padding: '1rem', borderRadius: '8px 8px 0 0', color: 'white' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>💬 Reply/Quote Templates</h2>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
              For extending reach throughout the day
            </p>
          </div>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1.5rem' }}>
            {Object.entries(content.morningPicks.replyTemplates).map(([key, template]) => (
              <div key={key} style={{ marginBottom: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 0.75rem 0' }}>
                  {template}
                </pre>
                <CopyButton 
                  onClick={() => copyToClipboard(template, `reply-${key}`)} 
                  itemId={`reply-${key}`} 
                  label="Copy" 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reddit Post */}
      {content.morningPicks && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ background: '#FF4500', padding: '1rem', borderRadius: '8px 8px 0 0', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircle style={{ width: '1.25rem', height: '1.25rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Morning Picks - Reddit Post</h2>
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
              Post to r/sportsbook
            </p>
          </div>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#666' }}>Title:</div>
              <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {content.morningPicks.redditTitle}
              </div>
              <CopyButton 
                onClick={() => copyToClipboard(content.morningPicks.redditTitle, 'reddit-title')} 
                itemId="reddit-title" 
                label="Copy Title" 
              />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#666' }}>Body:</div>
              <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', maxHeight: '400px', overflow: 'auto' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                  {content.morningPicks.redditBody}
                </pre>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <CopyButton 
                  onClick={() => copyToClipboard(content.morningPicks.redditBody, 'reddit-body')} 
                  itemId="reddit-body" 
                  label="Copy Body" 
                />
                <CopyButton 
                  onClick={copyRedditPost} 
                  itemId="reddit-full" 
                  label="Copy Title + Body" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Perplexity Q&A */}
      {content.morningPicks?.perplexityQA && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ background: '#20808d', padding: '1rem', borderRadius: '8px 8px 0 0', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search style={{ width: '1.25rem', height: '1.25rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Perplexity Q&A</h2>
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
              For LLM citations - post as Reddit comment or Perplexity page
            </p>
          </div>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1.5rem' }}>
            <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                {content.morningPicks.perplexityQA}
              </pre>
            </div>
            <CopyButton 
              onClick={() => copyToClipboard(content.morningPicks.perplexityQA, 'perplexity')} 
              itemId="perplexity" 
              label="Copy Q&A" 
            />
          </div>
        </div>
      )}

      {/* Night Results */}
      {content.nightResults && (
        <>
          <div style={{ marginTop: '3rem', marginBottom: '3rem', borderTop: '2px solid #e5e7eb', paddingTop: '3rem' }}>
            <div style={{ background: 'linear-gradient(to right, #1f2937, #374151)', padding: '1rem', borderRadius: '8px 8px 0 0', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Twitter style={{ width: '1.25rem', height: '1.25rem' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Night Results - Twitter Thread</h2>
              </div>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
                {content.nightResults.todayRecord} | {content.nightResults.todayProfit >= 0 ? '+' : ''}{content.nightResults.todayProfit}u | {content.nightResults.todayROI}% ROI
              </p>
            </div>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                {content.nightResults.twitterThread.map((tweet, i) => (
                  <div key={i} style={{ marginBottom: '1.5rem', borderLeft: '3px solid #1f2937', paddingLeft: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#1f2937', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      Tweet {i + 1}/{content.nightResults.twitterThread.length}
                    </div>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                      {tweet}
                    </pre>
                  </div>
                ))}
              </div>
              <CopyButton 
                onClick={() => copyToClipboard(content.nightResults.twitterThread.join('\n\n---\n\n'), 'night-twitter')} 
                itemId="night-twitter" 
                label="Copy Full Thread" 
              />
            </div>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <div style={{ background: '#FF4500', padding: '1rem', borderRadius: '8px 8px 0 0', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Night Results - Reddit Post</h2>
              </div>
            </div>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#666' }}>Title:</div>
                <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {content.nightResults.redditTitle}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#666' }}>Body:</div>
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', maxHeight: '400px', overflow: 'auto' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                    {content.nightResults.redditBody}
                  </pre>
                </div>
                <CopyButton 
                  onClick={() => copyToClipboard(`${content.nightResults.redditTitle}\n\n${content.nightResults.redditBody}`, 'night-reddit')} 
                  itemId="night-reddit" 
                  label="Copy Title + Body" 
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Weekly Recap */}
      {content.weeklyRecap && (
        <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '2px solid #e5e7eb' }}>
          <div style={{ background: 'linear-gradient(to right, #059669, #10b981)', padding: '1rem', borderRadius: '8px 8px 0 0', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ width: '1.25rem', height: '1.25rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Weekly Recap (Sunday)</h2>
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
              {content.weeklyRecap.weekRecord} | {content.weeklyRecap.weekProfit >= 0 ? '+' : ''}{content.weeklyRecap.weekProfit}u
            </p>
          </div>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1.5rem' }}>
            {/* Twitter and Reddit content similar to above */}
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Content available - copy buttons work same as above</div>
            <CopyButton 
              onClick={() => copyToClipboard(content.weeklyRecap.twitterThread.join('\n\n---\n\n'), 'weekly-twitter')} 
              itemId="weekly-twitter" 
              label="Copy Twitter Thread" 
            />
          </div>
        </div>
      )}

      {/* Educational Content */}
      {content.educational && (
        <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '2px solid #e5e7eb' }}>
          <div style={{ background: 'linear-gradient(to right, #7c3aed, #a855f7)', padding: '1rem', borderRadius: '8px 8px 0 0', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen style={{ width: '1.25rem', height: '1.25rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Educational Content (Bi-weekly Wednesday)</h2>
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9, textTransform: 'capitalize' }}>
              Topic: {content.educational.topic.replace('-', ' ')}
              {content.educational.perplexityGenerated && ' • Generated with Perplexity AI'}
            </p>
          </div>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1.5rem' }}>
            <CopyButton 
              onClick={() => copyToClipboard(content.educational.twitterThread.join('\n\n---\n\n'), 'edu-twitter')} 
              itemId="edu-twitter" 
              label="Copy Twitter Thread" 
            />
          </div>
        </div>
      )}

      {/* Usage Guide */}
      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e40af' }}>📝 Daily Workflow</h3>
        <div style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#1e3a8a' }}>
          <p><strong>Morning (8:30 AM):</strong></p>
          <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Review generated content on this page (2 min)</li>
            <li>Copy Twitter thread → paste into Twitter (30 sec)</li>
            <li>Copy Reddit title + body → paste into r/sportsbook (1 min)</li>
            <li>Copy Perplexity Q&A → paste as Reddit comment or Perplexity page (30 sec)</li>
          </ol>
          <p style={{ marginTop: '1rem' }}><strong>Night (11:15 PM):</strong></p>
          <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Copy Twitter results → post (30 sec)</li>
            <li>Copy Reddit results → post (1 min)</li>
          </ol>
          <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Total: ~7 minutes/day</p>
        </div>
      </div>
    </div>
  );
}


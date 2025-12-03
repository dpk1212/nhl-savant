import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, Crown, Calendar, TrendingUp, LogOut, ArrowLeft, RefreshCw } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

// CSS keyframes for spin animation
const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Account = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { tier, isPremium, isTrial, daysRemaining, status, createdAt, refresh } = useSubscription(user);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  // Sync subscription from Stripe (for users who paid but Firebase wasn't updated)
  const handleSyncSubscription = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      console.log('🔄 Syncing subscription from Stripe...');
      const result = await refresh(true); // Force refresh from Stripe
      
      if (result?.isActive) {
        setSyncMessage({ type: 'success', text: `✅ Found your ${result.tier} subscription! Page will refresh...` });
        // Refresh page after 2 seconds to show updated status
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setSyncMessage({ type: 'info', text: 'No active subscription found in Stripe. If you just subscribed, please wait a moment and try again.' });
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncMessage({ type: 'error', text: 'Unable to sync. Please try again or contact support.' });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoadingPortal(true);
    try {
      console.log('Opening Stripe Customer Portal...');
      
      // Call Cloud Function to create portal session
      const createPortal = httpsCallable(functions, 'createPortalSession');
      const result = await createPortal({ 
        returnUrl: window.location.href 
      });
      
      // Redirect to Stripe Customer Portal
      window.location.href = result.data.url;
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Unable to open billing portal. Please try again or contact support.');
      setIsLoadingPortal(false);
    }
  };

  const tierDisplayNames = {
    free: 'Free',
    scout: 'Scout',
    elite: 'Elite',
    pro: 'SAVANT PRO'
  };

  const tierColors = {
    free: '#94A3B8',
    scout: '#60A5FA',
    elite: '#8B5CF6',
    pro: '#D4AF37'
  };

  const formattedCreatedAt = createdAt ? new Date(createdAt.toDate()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  return (
    <>
      <style>{spinKeyframes}</style>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #0A0E27 100%)',
        padding: '2rem 1.5rem 4rem 1.5rem'
      }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '10px',
            color: 'rgba(241, 245, 249, 0.8)',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '2rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em'
          }}>
            Account Settings
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(241, 245, 249, 0.7)',
            margin: 0
          }}>
            Manage your subscription and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} color="#D4AF37" strokeWidth={2} />
              )}
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#F1F5F9',
                marginBottom: '0.5rem'
              }}>
                {user.displayName || 'NHL Savant User'}
              </h2>
              <p style={{
                fontSize: '0.938rem',
                color: 'rgba(241, 245, 249, 0.7)',
                marginBottom: '0.75rem'
              }}>
                {user.email}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: `rgba(${tierColors[tier] === '#D4AF37' ? '212, 175, 55' : tierColors[tier] === '#60A5FA' ? '59, 130, 246' : tierColors[tier] === '#8B5CF6' ? '139, 92, 246' : '148, 163, 184'}, 0.15)`,
                border: `1px solid rgba(${tierColors[tier] === '#D4AF37' ? '212, 175, 55' : tierColors[tier] === '#60A5FA' ? '59, 130, 246' : tierColors[tier] === '#8B5CF6' ? '139, 92, 246' : '148, 163, 184'}, 0.3)`,
                borderRadius: '8px'
              }}>
                {tier === 'pro' && <Crown size={16} color={tierColors[tier]} />}
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: tierColors[tier]
                }}>
                  {tierDisplayNames[tier]} {isTrial && `(Trial: ${daysRemaining}d left)`}
                </span>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <div>
              <div style={{ fontSize: '0.813rem', color: 'rgba(241, 245, 249, 0.6)', marginBottom: '0.25rem' }}>
                Member Since
              </div>
              <div style={{ fontSize: '0.938rem', fontWeight: '600', color: '#F1F5F9' }}>
                {formattedCreatedAt}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.813rem', color: 'rgba(241, 245, 249, 0.6)', marginBottom: '0.25rem' }}>
                Account Status
              </div>
              <div style={{ fontSize: '0.938rem', fontWeight: '600', color: isPremium ? '#10B981' : '#F1F5F9' }}>
                {status === 'active' || status === 'trialing' ? 'Active' : status === 'past_due' ? 'Past Due' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(212, 175, 55, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={20} color="#D4AF37" strokeWidth={2.5} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#F1F5F9',
              margin: 0
            }}>
              Subscription
            </h3>
          </div>

          {isPremium ? (
            <>
              <p style={{
                fontSize: '0.938rem',
                color: 'rgba(241, 245, 249, 0.8)',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                You're currently on the <strong style={{ color: tierColors[tier] }}>{tierDisplayNames[tier]}</strong> plan.
                {isTrial && ` Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleManageBilling}
                  disabled={isLoadingPortal}
                  style={{
                    padding: '0.875rem 1.5rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '10px',
                    color: '#60A5FA',
                    fontSize: '0.938rem',
                    fontWeight: '600',
                    cursor: isLoadingPortal ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: isLoadingPortal ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoadingPortal) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoadingPortal) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                    }
                  }}
                >
                  <CreditCard size={18} />
                  {isLoadingPortal ? 'Loading...' : 'Manage Billing'}
                </button>

                {tier !== 'pro' && (
                  <button
                    onClick={() => navigate('/pricing')}
                    style={{
                      padding: '0.875rem 1.5rem',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#0A0E27',
                      fontSize: '0.938rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.3)';
                    }}
                  >
                    <Crown size={18} />
                    Upgrade Plan
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p style={{
                fontSize: '0.938rem',
                color: 'rgba(241, 245, 249, 0.8)',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                You're currently on the <strong>Free</strong> plan. Upgrade to unlock unlimited access to all +EV picks.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <button
                  onClick={() => navigate('/pricing')}
                  style={{
                    padding: '0.875rem 1.5rem',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#0A0E27',
                    fontSize: '0.938rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.3)';
                  }}
                >
                  <Crown size={18} />
                  View Premium Plans
                </button>

                {/* Sync Button - For users who subscribed but Firebase wasn't updated */}
                <button
                  onClick={handleSyncSubscription}
                  disabled={isSyncing}
                  style={{
                    padding: '0.875rem 1.5rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    color: '#10B981',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: isSyncing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: isSyncing ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSyncing) {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSyncing) {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                    }
                  }}
                >
                  <RefreshCw size={16} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                  {isSyncing ? 'Syncing...' : 'Already Subscribed?'}
                </button>
              </div>

              {/* Sync Status Message */}
              {syncMessage && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: syncMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' :
                              syncMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' :
                              'rgba(59, 130, 246, 0.15)',
                  border: `1px solid ${syncMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' :
                                        syncMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                                        'rgba(59, 130, 246, 0.3)'}`,
                  color: syncMessage.type === 'success' ? '#10B981' :
                         syncMessage.type === 'error' ? '#EF4444' :
                         '#60A5FA'
                }}>
                  {syncMessage.text}
                </div>
              )}

              <p style={{
                fontSize: '0.75rem',
                color: 'rgba(241, 245, 249, 0.5)',
                marginTop: '1rem',
                fontStyle: 'italic'
              }}>
                💡 Already paid but showing as Free? Click "Already Subscribed?" to sync your account.
              </p>
            </>
          )}
        </div>

        {/* Sign Out Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#F1F5F9',
            marginBottom: '0.75rem'
          }}>
            Account Actions
          </h3>
          <p style={{
            fontSize: '0.938rem',
            color: 'rgba(241, 245, 249, 0.7)',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Need help? Contact us at Math@NHLSavant.com
          </p>

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            style={{
              padding: '0.875rem 1.5rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#EF4444',
              fontSize: '0.938rem',
              fontWeight: '600',
              cursor: isSigningOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isSigningOut ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSigningOut) {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSigningOut) {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }
            }}
          >
            <LogOut size={18} />
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Account;


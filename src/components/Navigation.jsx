import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, BarChart3, BookOpen, Search, Target, User, LogOut, CreditCard, Crown, Flame, HelpCircle, Database, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import AuthModal from './AuthModal';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sportsMenuOpen, setSportsMenuOpen] = useState(false);

  const sports = [
    { id: 'nhl', label: 'NHL', emoji: '🏒', path: '/', color: '#D4AF37' },
    { id: 'cbb', label: 'College BB', emoji: '🏀', path: '/basketball', color: '#FF6B35' },
    { id: 'mlb', label: 'Baseball', emoji: '⚾', path: '/mlb', color: '#E31837', badge: 'NEW' },
  ];
  
  const { user, signOut, loading: authLoading } = useAuth();
  const { tier, isPremium, isTrial, daysRemaining, loading: subscriptionLoading } = useSubscription(user);
  
  // Premium navigation links with Lucide icons
  const navLinks = [
    { path: '/', label: "Today's Games", icon: Target },
    { path: '/sharp-flow', label: 'Sharp Flow', icon: TrendingUp },
    { path: '/dashboard', label: 'Analytics Hub', icon: BarChart3 },
    { path: '/performance', label: 'Performance', icon: TrendingUp },
    { path: '/methodology', label: 'Methodology', icon: BookOpen },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/data', label: 'Data', icon: Database },
    { path: '/inspector', label: 'Data Inspector', icon: Search }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(17, 24, 39, 0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '0.875rem 1rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {/* MINIMAL PREMIUM Logo - Apple-level simplicity */}
        <Link to="/" style={{
          fontSize: '1.125rem',
          fontWeight: '700',
          color: '#D4AF37',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          letterSpacing: '-0.015em',
          transition: 'color 0.2s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFD700';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#D4AF37';
        }}>
          🏒 <span style={{ display: window.innerWidth < 400 ? 'none' : 'inline' }}>NHL Savant</span>
        </Link>

        {/* Sport Switcher Dropdown */}
        <div className="sport-switcher" style={{ position: 'relative', marginLeft: 'auto', marginRight: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => {
              setSportsMenuOpen(!sportsMenuOpen);
              setUserMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.75rem',
              background: sportsMenuOpen
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
              border: sportsMenuOpen
                ? '1px solid rgba(255, 255, 255, 0.2)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.813rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.01em'
            }}
            onMouseEnter={(e) => {
              if (!sportsMenuOpen) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              }
            }}
            onMouseLeave={(e) => {
              if (!sportsMenuOpen) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>🏟️</span>
            <span className="sport-switcher-label" style={{ whiteSpace: 'nowrap' }}>Sports</span>
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              style={{
                transition: 'transform 0.2s ease',
                transform: sportsMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                opacity: 0.7
              }}
            />
          </button>

          {sportsMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0.5rem',
                minWidth: '200px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                animation: 'slideDown 0.2s ease-out',
                zIndex: 1001
              }}
              onMouseLeave={() => setSportsMenuOpen(false)}
            >
              {sports.map((sport) => {
                const isActive = sport.path === '/'
                  ? location.pathname === '/' || (!location.pathname.startsWith('/basketball') && !location.pathname.startsWith('/mlb') && !['/basketball', '/mlb'].includes(location.pathname))
                  : location.pathname.startsWith(sport.path);

                return (
                  <Link
                    key={sport.id}
                    to={sport.path}
                    onClick={() => setSportsMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.625rem 0.75rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive ? sport.color : 'rgba(255, 255, 255, 0.8)',
                      background: isActive
                        ? `linear-gradient(135deg, ${sport.color}18 0%, ${sport.color}08 100%)`
                        : 'transparent',
                      border: isActive
                        ? `1px solid ${sport.color}40`
                        : '1px solid transparent',
                      marginBottom: '0.25rem',
                      transition: 'all 0.2s ease',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>{sport.emoji}</span>
                    <span>{sport.label}</span>
                    {isActive && (
                      <div style={{
                        marginLeft: 'auto',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: sport.color,
                        boxShadow: `0 0 8px ${sport.color}`
                      }} />
                    )}
                    {sport.badge && (
                      <span style={{
                        marginLeft: isActive ? '0' : 'auto',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.6rem',
                        fontWeight: '800',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: sport.color,
                        background: `${sport.color}15`,
                        border: `1px solid ${sport.color}30`,
                        whiteSpace: 'nowrap',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}>
                        {sport.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Premium Desktop Navigation */}
        <div className="desktop-nav" style={{
          display: 'none',
          gap: '0.625rem',
          alignItems: 'center'
        }}>
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            const isHovered = hoveredLink === link.path;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => setHoveredLink(link.path)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  padding: '0.625rem 1.125rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  color: isActive ? '#D4AF37' : isHovered ? '#FFD700' : 'rgba(255, 255, 255, 0.7)',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)'
                    : isHovered
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
                    : 'transparent',
                  border: isActive 
                    ? '1px solid rgba(212, 175, 55, 0.3)'
                    : '1px solid transparent',
                  boxShadow: isActive 
                    ? '0 4px 12px rgba(212, 175, 55, 0.2), 0 0 20px rgba(212, 175, 55, 0.1) inset'
                    : isHovered
                    ? '0 4px 12px rgba(255, 255, 255, 0.1)'
                    : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  letterSpacing: '0.02em',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Animated background shimmer */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)',
                    animation: 'shimmer 3s infinite'
                  }} />
                )}
                <Icon size={16} strokeWidth={2.5} />
                {link.label}
              </Link>
            );
          })}
          
          {/* Upgrade Button (Free Users Only) */}
          {user && !isPremium && !authLoading && !subscriptionLoading && (
            <Link
              to="/pricing"
              style={{
                padding: '0.625rem 1.125rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: '700',
                textDecoration: 'none',
                color: '#0A0E27',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                animation: 'pulse 2s ease-in-out infinite'
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
              <Crown size={16} strokeWidth={2.5} />
              Upgrade
            </Link>
          )}
          
          {/* User Menu or Sign In Button */}
          {!authLoading && (
            user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setSportsMenuOpen(false); }}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    <User size={20} color="#D4AF37" strokeWidth={2.5} />
                  )}
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.5rem)',
                      right: 0,
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      minWidth: '220px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                      animation: 'slideDown 0.2s ease-out',
                      zIndex: 1000
                    }}
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    {/* User Info */}
                    <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#F1F5F9', marginBottom: '0.25rem' }}>
                        {user.displayName || user.email}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(241, 245, 249, 0.6)' }}>
                        {isPremium ? (
                          <span style={{ color: '#D4AF37', fontWeight: '600' }}>
                            {tier?.toUpperCase()} {isTrial && `(${daysRemaining}d trial)`}
                          </span>
                        ) : (
                          <span>Free Tier</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'rgba(241, 245, 249, 0.9)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        marginBottom: '0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <User size={16} />
                      Account
                    </Link>
                    
                    {isPremium && (
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: 'rgba(241, 245, 249, 0.9)',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          marginBottom: '0.25rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <CreditCard size={16} />
                        Billing
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#EF4444',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                style={{
                  padding: '0.625rem 1.125rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60A5FA',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <User size={16} strokeWidth={2.5} />
                Sign In
              </button>
            )
          )}
        </div>

        {/* PREMIUM Mobile Auth Section - Minimal & Sleek */}
        <div className="mobile-auth" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginLeft: 'auto'
        }}>
          {!authLoading && !user && (
            <button
              onClick={() => setAuthModalOpen(true)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                border: 'none',
                color: '#0A0E27',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                flexShrink: 0
              }}
            >
              <User size={13} strokeWidth={2.5} />
              <span className="sign-in-text">Sign In</span>
            </button>
          )}
          
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '0',
                  borderRadius: '50%',
                  background: user.photoURL ? 'transparent' : 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)',
                  border: user.photoURL ? '2px solid rgba(212, 175, 55, 0.4)' : '2px solid rgba(212, 175, 55, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                ) : (
                  <User size={16} color="#D4AF37" strokeWidth={2.5} />
                )}
              </button>
              
              {/* Mobile User Dropdown - Compact */}
              {userMenuOpen && (
                <div 
                  className="mobile-user-dropdown"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '10px',
                    padding: '0.5rem',
                    minWidth: '180px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    animation: 'slideDown 0.2s ease-out',
                    zIndex: 1001
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Compact User Info */}
                  <div style={{ 
                    padding: '0.5rem', 
                    borderBottom: '1px solid rgba(148, 163, 184, 0.08)', 
                    marginBottom: '0.375rem' 
                  }}>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: '600', 
                      color: '#F1F5F9', 
                      marginBottom: '0.15rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.displayName || user.email?.split('@')[0]}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(241, 245, 249, 0.5)' }}>
                      {isPremium ? (
                        <span style={{ color: '#D4AF37', fontWeight: '600' }}>
                          {tier?.toUpperCase()}
                        </span>
                      ) : (
                        <span>Free</span>
                      )}
                    </div>
                  </div>
                  
                  <Link
                    to="/account"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: 'rgba(241, 245, 249, 0.9)',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      marginBottom: '0.25rem'
                    }}
                  >
                    <User size={14} />
                    Account
                  </Link>
                  
                  {isPremium && (
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: 'rgba(241, 245, 249, 0.9)',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        marginBottom: '0.25rem'
                      }}
                    >
                      <CreditCard size={14} />
                      Billing
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      signOut();
                      setUserMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: '#EF4444',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Mobile Menu Button - Sleek & Compact */}
          <button
            className="mobile-menu-btn"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setUserMenuOpen(false);
              setSportsMenuOpen(false);
            }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            background: mobileMenuOpen 
              ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)'
              : 'rgba(255, 255, 255, 0.05)',
            border: mobileMenuOpen 
              ? '1px solid rgba(212, 175, 55, 0.3)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: mobileMenuOpen ? '#D4AF37' : 'rgba(255, 255, 255, 0.9)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            width: '32px',
            height: '32px'
            }}
          >
            {mobileMenuOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
        </button>
        </div>
      </div>

      {/* Premium Mobile Menu Dropdown - Compact & Sleek */}
      {mobileMenuOpen && (
        <div className="mobile-nav" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.98) 0%, rgba(17, 24, 39, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
          padding: '0.625rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          animation: 'slideDown 0.3s ease-out',
          maxHeight: 'calc(100vh - 60px)',
          overflowY: 'auto'
        }}>
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.8)',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)'
                    : 'transparent',
                  border: isActive 
                    ? '1px solid rgba(212, 175, 55, 0.3)'
                    : '1px solid transparent',
                  boxShadow: isActive 
                    ? '0 2px 8px rgba(212, 175, 55, 0.2)'
                    : 'none',
                  marginBottom: '0.25rem',
                  transition: 'all 0.2s ease',
                  animation: `slideIn 0.3s ease-out ${index * 0.03}s both`
                }}
              >
                <Icon size={16} strokeWidth={2.5} />
                {link.label}
                {isActive && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#D4AF37',
                    boxShadow: '0 0 6px rgba(212, 175, 55, 0.6)'
                  }} />
                )}
              </Link>
            );
          })}
          
          {/* Sports Section */}
          <div style={{
            marginTop: '0.5rem',
            marginBottom: '0.25rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.688rem',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.35)'
            }}>
              Sports
            </div>
            {sports.map((sport, index) => {
              const isActive = sport.path === '/'
                ? location.pathname === '/' || (!location.pathname.startsWith('/basketball') && !location.pathname.startsWith('/mlb'))
                : location.pathname.startsWith(sport.path);

              return (
                <Link
                  key={sport.id}
                  to={sport.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    color: isActive ? sport.color : 'rgba(255, 255, 255, 0.8)',
                    background: isActive
                      ? `linear-gradient(135deg, ${sport.color}18 0%, ${sport.color}08 100%)`
                      : 'transparent',
                    border: isActive
                      ? `1px solid ${sport.color}40`
                      : '1px solid transparent',
                    marginBottom: '0.25rem',
                    transition: 'all 0.2s ease',
                    animation: `slideIn 0.3s ease-out ${(navLinks.length + index) * 0.03}s both`
                  }}
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{sport.emoji}</span>
                  {sport.label}
                  {isActive && (
                    <div style={{
                      marginLeft: 'auto',
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: sport.color,
                      boxShadow: `0 0 6px ${sport.color}`
                    }} />
                  )}
                  {sport.badge && (
                    <span style={{
                      marginLeft: isActive ? '0' : 'auto',
                      padding: '0.125rem 0.4rem',
                      borderRadius: '999px',
                      fontSize: '0.6rem',
                      fontWeight: '800',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: sport.color,
                      background: `${sport.color}15`,
                      border: `1px solid ${sport.color}30`,
                      whiteSpace: 'nowrap'
                    }}>
                      {sport.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* User Actions (if logged in) */}
          {user && (
            <div style={{
              marginTop: '0.625rem',
              paddingTop: '0.625rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {!isPremium && (
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    color: '#0A0E27',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                    marginBottom: '0.25rem'
                  }}
                >
                  <Crown size={16} strokeWidth={2.5} />
                  Upgrade
                </Link>
              )}
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'transparent',
                  border: '1px solid transparent',
                  marginBottom: '0.25rem'
                }}
              >
                <User size={16} strokeWidth={2.5} />
                Account
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#EF4444',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} strokeWidth={2.5} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Premium CSS for responsive behavior and animations */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-auth { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-auth { display: flex !important; }
        }
        @media (max-width: 640px) {
          .sport-switcher-label { display: none !important; }
        }
        @media (max-width: 400px) {
          .sign-in-text { display: none !important; }
        }
        
        /* Premium Animations */
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
};

export default Navigation;

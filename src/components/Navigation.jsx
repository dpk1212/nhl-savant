import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, BarChart3, BookOpen, Search, Target, LineChart, Bookmark, User, LogOut, CreditCard, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import AuthModal from './AuthModal';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const { user, signOut, loading: authLoading } = useAuth();
  const { tier, isPremium, isTrial, daysRemaining, loading: subscriptionLoading } = useSubscription(user);
  
  // Premium navigation links with Lucide icons
  const navLinks = [
    { path: '/', label: "Today's Games", icon: Target },
    { path: '/my-picks', label: 'My Picks', icon: Bookmark },
    { path: '/matchup-insights', label: 'Hot Takes', icon: LineChart },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/performance', label: 'Performance', icon: TrendingUp },
    { path: '/methodology', label: 'Methodology', icon: BookOpen },
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
      padding: '0.75rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* MINIMAL PREMIUM Logo - Apple-level simplicity */}
        <Link to="/" style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#D4AF37',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          letterSpacing: '-0.015em',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFD700';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#D4AF37';
        }}>
          🏒 <span>NHL Savant</span>
        </Link>

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
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
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

        {/* Premium Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.625rem',
            background: mobileMenuOpen 
              ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            border: mobileMenuOpen 
              ? '1px solid rgba(212, 175, 55, 0.3)'
              : '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            color: mobileMenuOpen ? '#D4AF37' : 'rgba(255, 255, 255, 0.9)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: mobileMenuOpen 
              ? '0 4px 12px rgba(212, 175, 55, 0.2)'
              : '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (!mobileMenuOpen) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            if (!mobileMenuOpen) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }
          }}
        >
          {mobileMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Premium Mobile Menu Dropdown */}
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
          padding: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          animation: 'slideDown 0.3s ease-out'
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
                  gap: '0.75rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
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
                    ? '0 4px 12px rgba(212, 175, 55, 0.2)'
                    : 'none',
                  marginBottom: index < navLinks.length - 1 ? '0.5rem' : 0,
                  transition: 'all 0.3s ease',
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <Icon size={20} strokeWidth={2.5} />
                {link.label}
                {isActive && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#D4AF37',
                    boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)'
                  }} />
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Premium CSS for responsive behavior and animations */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
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

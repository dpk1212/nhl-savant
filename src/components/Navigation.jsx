/**
 * SharpFlow primary navigation.
 * Product loop: Board · Locks · Sharps · Record
 * Relocated: Models (NHL/MLB/CBB) · Learn (How it works / FAQ / Data)
 * Removed from primary: Analytics Hub, Data Inspector, Today's Games as peer tabs
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, TrendingUp, BarChart3, BookOpen, Target, User, LogOut, CreditCard,
  Crown, HelpCircle, Database, ChevronDown, Lock, Layers, Zap,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import AuthModal from './AuthModal';

const GOLD = '#D4AF37';

const primaryLinks = [
  { path: '/', label: 'Market', icon: Zap, match: (p) => p === '/' || p === '/sharp-flow' || p === '/board' || p === '/market' },
  { path: '/engine', label: 'Engine', icon: Target, match: (p) => p === '/engine' || p === '/locks' },
  { path: '/sharps', label: 'Sharps', icon: Lock, match: (p) => p === '/sharps' },
  { path: '/record', label: 'Record', icon: BarChart3, match: (p) => p === '/record' },
];

const modelLinks = [
  { path: '/todays-games', label: 'NHL Model', emoji: '🏒', color: GOLD },
  { path: '/performance', label: 'NHL Model Record', emoji: '📊', color: GOLD },
  { path: '/mlb', label: 'MLB Model', emoji: '⚾', color: '#E31837' },
  { path: '/basketball', label: 'CBB Model', emoji: '🏀', color: '#FF6B35' },
];

const learnLinks = [
  { path: '/methodology', label: 'How it works', icon: BookOpen },
  { path: '/faq', label: 'FAQ', icon: HelpCircle },
  { path: '/data', label: 'Data', icon: Database },
];

function NavLinkStyled({ to, label, icon: Icon, active, onClick, onHover, hovered }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={() => onHover?.(to)}
      onMouseLeave={() => onHover?.(null)}
      style={{
        padding: '0.55rem 0.9rem',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: 600,
        textDecoration: 'none',
        color: active ? GOLD : hovered ? '#FFD700' : 'rgba(255, 255, 255, 0.72)',
        background: active
          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)'
          : hovered
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
            : 'transparent',
        border: active ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
        boxShadow: active ? '0 4px 12px rgba(212, 175, 55, 0.18)' : 'none',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
      }}
    >
      {Icon ? <Icon size={15} strokeWidth={2.5} /> : null}
      {label}
    </Link>
  );
}

function DropdownMenu({ open, onClose, align = 'left', children, minWidth = 200 }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 0.45rem)',
        [align]: 0,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '0.5rem',
        minWidth,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        animation: 'sfNavSlideDown 0.2s ease-out',
        zIndex: 1001,
      }}
      onMouseLeave={onClose}
    >
      {children}
    </div>
  );
}

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const navRef = useRef(null);

  const { user, signOut, loading: authLoading } = useAuth();
  const { tier, isPremium, loading: subscriptionLoading } = useSubscription(user);

  const path = location.pathname;
  const modelsActive = modelLinks.some((m) => path.startsWith(m.path));
  const learnActive = learnLinks.some((l) => path.startsWith(l.path));

  useEffect(() => {
    const onDocClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setModelsOpen(false);
        setLearnOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setModelsOpen(false);
    setLearnOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(17, 24, 39, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '0.75rem 1rem',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Link
          to="/"
          onClick={closeMenus}
          style={{
            fontSize: '1.125rem',
            fontWeight: 800,
            color: GOLD,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          <TrendingUp size={18} strokeWidth={2.5} />
          <span>SharpFlow</span>
        </Link>

        {/* Desktop */}
        <div className="sf-desktop-nav" style={{ display: 'none', gap: '0.35rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          {primaryLinks.map((link) => (
            <NavLinkStyled
              key={link.path}
              to={link.path}
              label={link.label}
              icon={link.icon}
              active={link.match(path)}
              hovered={hoveredLink === link.path}
              onHover={setHoveredLink}
            />
          ))}

          {/* Models */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => { setModelsOpen((v) => !v); setLearnOpen(false); setUserMenuOpen(false); }}
              style={{
                padding: '0.55rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: modelsActive || modelsOpen ? GOLD : 'rgba(255, 255, 255, 0.72)',
                background: modelsActive || modelsOpen
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)'
                  : 'transparent',
                border: modelsActive || modelsOpen ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Layers size={15} strokeWidth={2.5} />
              Models
              <ChevronDown size={14} style={{ opacity: 0.7, transform: modelsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            <DropdownMenu open={modelsOpen} onClose={() => setModelsOpen(false)}>
              <div style={{ padding: '0.35rem 0.65rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                Sport models
              </div>
              {modelLinks.map((m) => {
                const active = path.startsWith(m.path);
                return (
                  <Link
                    key={m.path}
                    to={m.path}
                    onClick={closeMenus}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: active ? m.color : 'rgba(255,255,255,0.85)',
                      background: active ? `${m.color}18` : 'transparent',
                      border: active ? `1px solid ${m.color}40` : '1px solid transparent',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '0.2rem',
                    }}
                  >
                    <span>{m.emoji}</span>
                    {m.label}
                  </Link>
                );
              })}
            </DropdownMenu>
          </div>

          {/* Learn */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => { setLearnOpen((v) => !v); setModelsOpen(false); setUserMenuOpen(false); }}
              style={{
                padding: '0.55rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: learnActive || learnOpen ? GOLD : 'rgba(255, 255, 255, 0.72)',
                background: learnActive || learnOpen
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)'
                  : 'transparent',
                border: learnActive || learnOpen ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <BookOpen size={15} strokeWidth={2.5} />
              Learn
              <ChevronDown size={14} style={{ opacity: 0.7, transform: learnOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            <DropdownMenu open={learnOpen} onClose={() => setLearnOpen(false)} align="right">
              {learnLinks.map((l) => {
                const Icon = l.icon;
                const active = path.startsWith(l.path);
                return (
                  <Link
                    key={l.path}
                    to={l.path}
                    onClick={closeMenus}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: active ? GOLD : 'rgba(255,255,255,0.85)',
                      background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '0.2rem',
                    }}
                  >
                    <Icon size={15} />
                    {l.label}
                  </Link>
                );
              })}
            </DropdownMenu>
          </div>

          {user && !isPremium && !authLoading && !subscriptionLoading && (
            <Link
              to="/pricing"
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
                color: '#0A0E27',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Crown size={15} strokeWidth={2.5} />
              Upgrade
            </Link>
          )}

          {!authLoading && (
            user ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => { setUserMenuOpen((v) => !v); setModelsOpen(false); setLearnOpen(false); }}
                  style={{
                    padding: 0,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    cursor: 'pointer',
                    width: 38,
                    height: 38,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={18} color={GOLD} strokeWidth={2.5} />
                  )}
                </button>
                <DropdownMenu open={userMenuOpen} onClose={() => setUserMenuOpen(false)} align="right" minWidth={180}>
                  <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.35rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F1F5F9' }}>
                      {user.displayName || user.email?.split('@')[0]}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(241,245,249,0.5)' }}>
                      {isPremium ? <span style={{ color: GOLD, fontWeight: 600 }}>{tier?.toUpperCase()}</span> : 'Free'}
                    </div>
                  </div>
                  <Link to="/account" onClick={closeMenus} style={menuItemStyle}>
                    <User size={14} /> Account
                  </Link>
                  {isPremium && (
                    <Link to="/account" onClick={closeMenus} style={menuItemStyle}>
                      <CreditCard size={14} /> Billing
                    </Link>
                  )}
                  <button type="button" onClick={() => { signOut(); closeMenus(); }} style={{ ...menuItemStyle, color: '#EF4444', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </DropdownMenu>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#93C5FD',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <User size={15} /> Sign In
              </button>
            )
          )}
        </div>

        {/* Mobile auth + hamburger */}
        <div className="sf-mobile-auth" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          {!authLoading && !user && (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                border: 'none',
                color: '#0A0E27',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
          )}
          {user && (
            <Link to="/account" onClick={closeMenus} style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(212,175,55,0.4)', display: 'block' }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: 'rgba(212,175,55,0.12)' }}>
                  <User size={14} color={GOLD} />
                </div>
              )}
            </Link>
          )}
          <button
            type="button"
            className="sf-mobile-menu-btn"
            onClick={() => { setMobileMenuOpen((v) => !v); setUserMenuOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              background: mobileMenuOpen ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.05)',
              border: mobileMenuOpen ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.1)',
              color: mobileMenuOpen ? GOLD : 'rgba(255,255,255,0.9)',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.98) 0%, rgba(17, 24, 39, 0.98) 100%)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
            padding: '0.625rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            maxHeight: 'calc(100vh - 60px)',
            overflowY: 'auto',
          }}
        >
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            const active = link.match(path);
            return (
              <Link key={link.path} to={link.path} onClick={closeMenus} style={mobileRow(active)}>
                <Icon size={16} /> {link.label}
              </Link>
            );
          })}

          <SectionLabel>Models</SectionLabel>
          {modelLinks.map((m) => (
            <Link key={m.path} to={m.path} onClick={closeMenus} style={mobileRow(path.startsWith(m.path), m.color)}>
              <span>{m.emoji}</span> {m.label}
            </Link>
          ))}

          <SectionLabel>Learn</SectionLabel>
          {learnLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link key={l.path} to={l.path} onClick={closeMenus} style={mobileRow(path.startsWith(l.path))}>
                <Icon size={16} /> {l.label}
              </Link>
            );
          })}

          {user && !isPremium && (
            <Link to="/pricing" onClick={closeMenus} style={{ ...mobileRow(false), background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)', color: '#0A0E27', fontWeight: 700, marginTop: '0.5rem' }}>
              <Crown size={16} /> Upgrade
            </Link>
          )}
          {user && (
            <>
              <Link to="/account" onClick={closeMenus} style={mobileRow(path === '/account')}>
                <User size={16} /> Account
              </Link>
              <button type="button" onClick={() => { signOut(); closeMenus(); }} style={{ ...mobileRow(false), color: '#EF4444', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .sf-desktop-nav { display: flex !important; }
          .sf-mobile-auth { display: none !important; }
        }
        @media (max-width: 899px) {
          .sf-desktop-nav { display: none !important; }
          .sf-mobile-auth { display: flex !important; }
        }
        @keyframes sfNavSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.65rem',
  borderRadius: 6,
  textDecoration: 'none',
  color: 'rgba(241,245,249,0.9)',
  fontSize: '0.8rem',
  fontWeight: 500,
  marginBottom: '0.2rem',
};

function SectionLabel({ children }) {
  return (
    <div style={{
      marginTop: '0.55rem',
      padding: '0.4rem 0.75rem 0.25rem',
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.35)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      {children}
    </div>
  );
}

function mobileRow(active, accent = GOLD) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.625rem 0.75rem',
    borderRadius: 8,
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecoration: 'none',
    color: active ? accent : 'rgba(255,255,255,0.85)',
    background: active ? `${accent}18` : 'transparent',
    border: active ? `1px solid ${accent}40` : '1px solid transparent',
    marginBottom: '0.2rem',
  };
}

export default Navigation;

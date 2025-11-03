import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, BarChart3, BookOpen, Search, Target, LineChart } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  
  // Premium navigation links with Lucide icons
  const navLinks = [
    { path: '/', label: "Today's Games", icon: Target },
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
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;

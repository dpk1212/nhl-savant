import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Updated navigation links with new structure
  const navLinks = [
    { path: '/', label: "Today's Games", icon: '🎯' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/opportunities', label: 'Opportunities', icon: '💎' },
    { path: '/teams', label: 'Team Analytics', icon: '📈' },
    { path: '/methodology', label: 'Methodology', icon: '📚' },
    { path: '/inspector', label: 'Data Inspector', icon: '🔍' }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--color-background)',
      borderBottom: '1px solid var(--color-border)',
      padding: '0.75rem 1rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo/Title */}
        <Link to="/" style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--color-accent)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🏒 NHL Savant
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{
          display: 'none',
          gap: '0.5rem'
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '0.5rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none',
                color: location.pathname === link.path ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: location.pathname === link.path ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ marginRight: '0.375rem' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: 'var(--color-text-primary)',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-background)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                padding: '0.875rem 1rem',
                borderRadius: '6px',
                fontSize: '0.938rem',
                fontWeight: '500',
                textDecoration: 'none',
                color: location.pathname === link.path ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: location.pathname === link.path ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                marginBottom: '0.25rem'
              }}
            >
              <span style={{ marginRight: '0.5rem', fontSize: '1.125rem' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* CSS for responsive behavior */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;

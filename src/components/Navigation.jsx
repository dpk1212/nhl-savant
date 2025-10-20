import { Link, useLocation } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'DASHBOARD' },
    { path: '/teams', label: 'TEAMS' },
    { path: '/opportunities', label: 'OPPORTUNITIES' },
    { path: '/inspector', label: 'DATA INSPECTOR' },
    { path: '/methodology', label: 'METHODOLOGY' },
  ];

  return (
    <nav style={{
      height: '56px',
      backgroundColor: 'var(--color-background)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: 'var(--color-text-primary)',
          }}
        >
          <BarChart3 size={20} color="var(--color-accent)" />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}>
            NHL SAVANT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                position: 'relative',
                fontSize: '0.8125rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: isActive(path) ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                textDecoration: 'none',
                padding: '0.25rem 0',
                transition: 'color 0.2s ease',
              }}
            >
              {label}
              {isActive(path) && (
                <div style={{
                  position: 'absolute',
                  bottom: '-18px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'var(--color-accent)',
                }}></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

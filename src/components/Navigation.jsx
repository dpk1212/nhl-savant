import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Target, BookOpen } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/teams', label: 'Team Analytics', icon: Users },
    { path: '/opportunities', label: 'Betting Opportunities', icon: Target },
    { path: '/methodology', label: 'Methodology', icon: BookOpen },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-nhl-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏒</span>
            </div>
            <span className="text-xl font-bold text-white">NHL Savant</span>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-nhl-blue text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

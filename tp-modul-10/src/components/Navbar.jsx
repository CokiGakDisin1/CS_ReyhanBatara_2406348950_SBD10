import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon, Package, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) return null; 

  const navLinks = [
    { name: 'Store', path: '/', icon: Package },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 p-0.5 bg-dark-surface rounded-xl border border-dark-border group-hover:border-neon-purple/50 transition-colors overflow-hidden">
            <img src="/assets/logo.png" alt="FUNKOMART Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            FUNKO<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">MART</span>
          </span>
        </Link>

        <ul className="flex items-center gap-2 sm:gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neon-blue' : ''}`} />
                  <span className="hidden sm:inline">{link.name}</span>
                </Link>
              </li>
            );
          })}
          
          <li className="ml-2 pl-2 sm:ml-4 sm:pl-4 border-l border-dark-border">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

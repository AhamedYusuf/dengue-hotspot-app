import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/',            label: 'Home' },
  { to: '/hotspots',   label: 'Hotspots' },
  { to: '/map',        label: 'Map' },
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/prevention', label: 'Prevention' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOfficial, email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-500/20 text-blue-200'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1e3a5f]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-white no-underline"
          aria-label="DengueWatch home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/30 text-lg">
            🦟
          </span>
          <span className="text-lg font-bold tracking-tight">
            Dengue<span className="text-blue-300">Watch</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex" role="list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={linkClass}>
                {label}
              </NavLink>
            </li>
          ))}

          {/* Verification Queue - only when authenticated official */}
          {isOfficial && (
            <li>
              <NavLink to="/queue" className={linkClass}>
                Verification Queue
              </NavLink>
            </li>
          )}

          <li>
            <Link
              to="/report"
              className="ml-2 rounded-lg bg-blue-500 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
            >
              + Report
            </Link>
          </li>

          {/* Official auth state */}
          <li className="ml-3 pl-3 border-l border-white/20 flex items-center gap-2">
            {isOfficial ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-200 truncate max-w-[130px]" title={email}>
                  {email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/20 hover:text-white"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="rounded-lg border border-blue-400/40 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/20 hover:text-white"
              >
                Official Portal
              </NavLink>
            )}
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#1e3a5f] px-4 pb-4 lg:hidden">
          <ul className="mt-2 flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-200'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}

            {isOfficial && (
              <li>
                <NavLink
                  to="/queue"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-200'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  Verification Queue
                </NavLink>
              </li>
            )}

            <li>
              <Link
                to="/report"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
              >
                + Report Outbreak
              </Link>
            </li>

            <li className="pt-2 border-t border-white/10">
              {isOfficial ? (
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs text-blue-200 truncate">{email}</span>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg border border-blue-400/30 px-3 py-2 text-center text-sm font-medium text-blue-200 hover:bg-blue-500/20"
                >
                  Official Portal Log In
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

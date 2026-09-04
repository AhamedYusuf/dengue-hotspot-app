import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/report',    label: 'Submit Report' },
  { to: '/hotspots',  label: 'Browse Hotspots' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1e3a5f]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white no-underline"
          aria-label="DengueWatch home"
        >
          {/* Mosquito / shield icon */}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/30 text-lg">
            🦟
          </span>
          <span className="text-lg font-bold tracking-tight">
            Dengue<span className="text-blue-300">Watch</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 sm:flex" role="list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
          <li>
            <Link
              to="/report"
              className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
            >
              + Report
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 sm:hidden"
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
        <div className="border-t border-white/10 bg-[#1e3a5f] px-4 pb-4 sm:hidden">
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
          </ul>
        </div>
      )}
    </header>
  );
}

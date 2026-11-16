import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import ThemeToggle from './ThemeToggle.tsx';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/roles', label: 'By role' },
  { to: '/frameworks', label: 'By framework' },
  { to: '/matrix', label: 'Mandate matrix' },
  { to: '/dashboards', label: 'Dashboards' },
  { to: '/editions', label: 'Compare editions' },
  { to: '/search', label: 'Search' },
  { to: '/content-status', label: 'Content status' },
] as const;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-3 py-2 text-sm ${
    isActive
      ? 'bg-blue-50 font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;

export default function Layout() {
  const { pathname } = useLocation();
  // The narrow-screen menu stays open only on the page where it was opened,
  // so navigating closes it without an effect.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const menuOpen = openOnPath === pathname;
  const setMenuOpen = (update: (open: boolean) => boolean) =>
    setOpenOnPath(update(menuOpen) ? pathname : null);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-blue-800 dark:focus:bg-slate-900 dark:focus:text-blue-200"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>

      <header className="no-print border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-slate-900 dark:text-white">
            Jira Metrics Hub
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              className="rounded border border-slate-300 px-3 py-1 text-sm lg:hidden dark:border-slate-700"
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </button>
          </div>
        </div>
        <nav
          id="site-nav"
          aria-label="Main"
          className={`mx-auto max-w-7xl px-4 pb-3 ${menuOpen ? 'block' : 'hidden'} lg:block`}
        >
          <ul className="flex flex-col gap-1 lg:flex-row lg:flex-wrap">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={'end' in item} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="no-print border-t border-slate-200 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 py-4">
          Reference only. This portal never connects to Jira and sends no data anywhere. Mandate
          levels are a proposed baseline, not a rule.
        </div>
      </footer>
    </div>
  );
}

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CompassIcon, SunIcon } from './icons';

export default function Navbar() {
  const loc = useLocation();
  const nav = useNavigate();
  const onExplore = loc.pathname.startsWith('/explore');
  const onHome = loc.pathname === '/';
  const pill = (active) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      active ? 'bg-stone-900 text-white shadow' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
    }`;
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-500 text-white shadow-lg shadow-emerald-900/20 transition group-hover:rotate-12">
            <CompassIcon className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-[18px] font-bold tracking-tight text-stone-900">
              Travel Explorer
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
              Live · Maps · Weather
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1.5">
          <Link to="/" className={pill(onHome)}>
            Home
          </Link>
          <Link to="/explore" className={pill(onExplore && loc.pathname === '/explore')}>
            Explore
          </Link>
          <button
            onClick={() => nav('/explore?sort=temp')}
            className="ml-1 hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-950 to-emerald-700 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/25 transition hover:scale-[1.03] hover:shadow-xl sm:flex"
          >
            <SunIcon className="h-4 w-4" /> Warmest now
          </button>
          <button
            onClick={() => nav('/explore')}
            className="rounded-full bg-stone-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-stone-700 sm:hidden"
          >
            Explore →
          </button>
        </nav>
      </div>
    </header>
  );
}

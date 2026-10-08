import { Component } from 'react';
import { Link } from 'react-router-dom';
import { CompassIcon } from './icons';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error('[Travel Explorer]', error);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-700">
            <CompassIcon className="h-7 w-7" />
          </span>
          <h1 className="font-display mt-3 text-3xl font-bold text-stone-900">Something hiccupped</h1>
          <p className="mt-2 text-sm text-stone-500">
            A live data fetch stumbled. Your filters are safe — try reloading this view.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-bold text-white hover:bg-stone-700"
            >
              Reload ↻
            </button>
            <Link
              to="/explore"
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-bold text-stone-700 hover:bg-stone-100"
            >
              ← Explore
            </Link>
          </div>
          {this.state.error?.message && (
            <details className="mx-auto mt-6 max-w-lg rounded-2xl bg-stone-100 p-4 text-left">
              <summary className="cursor-pointer text-xs font-bold text-stone-500">Technical details</summary>
              <pre className="mt-2 overflow-auto text-xs text-rose-700">{String(this.state.error?.message)}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

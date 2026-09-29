import { Component } from 'react';

function ErrorFallback({ onReset }) {
  return (
    <div role="alert" className="container-page py-20 text-center">
      <h1 className="heading">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
        This page hit an unexpected problem. Your favorites and settings are safe.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" className="btn btn-primary" onClick={onReset}>Try again</button>
        <button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    </div>
  );
}

/**
 * Catches errors thrown while RENDERING children (incl. lazy-chunk failures).
 * It does NOT catch event-handler, timer or promise errors (thunks handle their own).
 * `resetKey` (we pass the pathname): when it changes, the error clears, so navigating
 * away from a broken page recovers automatically.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Hook for a monitoring service (Sentry etc.). Console only for now.
    console.error('Render error:', error, info.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error ? <ErrorFallback onReset={this.reset} /> : this.props.children;
  }
}

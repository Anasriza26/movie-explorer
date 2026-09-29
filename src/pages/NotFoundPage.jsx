import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container-page py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-brand">404</p>
      <h1 className="heading mt-2">This page doesn’t exist</h1>
      <p className="mb-6 mt-2 text-slate-600 dark:text-slate-400">
        The link may be broken, or the page may have moved.
      </p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}

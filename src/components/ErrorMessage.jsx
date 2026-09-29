import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/** Inline, recoverable error. role="alert" makes screen readers announce it. */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="my-4 flex flex-wrap items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
    >
      <ErrorOutlineIcon fontSize="small" aria-hidden />
      <span className="min-w-0 flex-1">{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-outline !py-1.5">
          Retry
        </button>
      )}
    </div>
  );
}

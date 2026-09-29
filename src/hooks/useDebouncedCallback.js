import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns [run, cancel]. `run` waits `delay` ms after the LAST call, then invokes fn.
 * Always uses the latest `fn` (no stale closures) and cancels on unmount.
 */
export default function useDebouncedCallback(fn, delay = 500) {
  const fnRef = useRef(fn);
  const timerRef = useRef();

  useEffect(() => {
    fnRef.current = fn;
  });

  const cancel = useCallback(() => clearTimeout(timerRef.current), []);

  const run = useCallback(
    (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay]
  );

  useEffect(() => cancel, [cancel]);
  return [run, cancel];
}

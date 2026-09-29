import { useEffect, useRef } from 'react';

/**
 * Calls `onIntersect` when the returned ref's element nears the viewport.
 * Attach the ref to an invisible sentinel element placed after the list.
 */
export default function useInfiniteScroll(onIntersect, enabled) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callbackRef.current();
      },
      { rootMargin: '300px' } // start loading before the user reaches the bottom
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}

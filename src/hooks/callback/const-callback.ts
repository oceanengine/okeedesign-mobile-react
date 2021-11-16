import { useRef } from 'react';

/**
 * Hook to ensure a callback function always has the same identify.
 * Unlike `React.useCallback`, this is guaranteed to always return the same value.
 *
 * @param callback The callback function. Only the first value passed is respected.
 * @returns The callback function. The identify of the callback will always be the same.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any,space-before-function-paren
export function useConstCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef<T>();
  if (!ref.current) {
    ref.current = callback;
  }
  return ref.current;
}

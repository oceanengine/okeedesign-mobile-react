/* eslint-disable semi */
import { useRef } from 'react';

/**
 * Returns a constant value or uses to ensure the same reference.
 * If provides reference type value (object, array...), it will always return same reference from the first initial, even if re-rendered.
 * @param initialValue
 */
export function useConst<T>(initialValue: T | (() => T)): T {
  const ref = useRef<{ value: T }>();
  if (ref.current === undefined) {
    ref.current = {
      value: typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue,
    };
  }
  return ref.current.value;
}

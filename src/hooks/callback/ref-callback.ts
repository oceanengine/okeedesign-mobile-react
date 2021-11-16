/* eslint-disable */
import { useRef } from 'react';
import { useConstCallback } from './const-callback';

/**
 * Hook to wrap callback function, ensure the wrapper always has the same identify,
 * meanwhile, always call the latest callback passed when call the wrapper.
 *
 * @param callback The callback function. Always use the latest value passed.
 * @returns The wrapper function. The identify of the wrapper always be the same.
 */
export function useRefCallback<T extends (...args: any[]) => any>(callback: T): T;

export function useRefCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
): (...args: Parameters<T>) => ReturnType<T> | undefined;

/**
 * Hook to wrap callback function, ensure the wrapper always has the same identify,
 * meanwhile, always call the latest callback passed when call the wrapper.
 *
 * @param callback The callback function. Always use the latest value passed.
 * @returns The wrapper function. The identify of the wrapper always be the same.
 */
// eslint-disable-next-line space-before-function-paren
export function useRefCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T | ((...args: Parameters<T>) => ReturnType<T> | undefined) {
  const callbackRef = useRef<T>();
  callbackRef.current = callback;
  const wrapper = useConstCallback((...args) => callbackRef.current?.(...args));
  return wrapper;
}

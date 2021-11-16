/* eslint-disable semi */
import { useConst } from './const';
import { useEffect } from 'react';

export interface UseSetTimeoutReturnType {
  setTimeout(callback: () => void, delay: number): number;
  clearTimeout(id: number): void;
}

/**
 * Returns a wrapper function for `setTimeout` which automatically cleanup.
 */
export function useSetTimeout(): UseSetTimeoutReturnType {
  const idMap = useConst<Record<number, number>>({});

  useEffect(
    () => (): void => {
      for (const id of Object.keys(idMap)) {
        clearTimeout(id as any);
      }
    },
    [idMap],
  );

  return useConst<UseSetTimeoutReturnType>({
    setTimeout(callback, delay) {
      const id = setTimeout(callback, delay) as unknown as number;
      idMap[id] = 1;
      return id;
    },
    clearTimeout(id) {
      delete idMap[id];
      clearTimeout(id);
    },
  });
}

export interface UseSetIntervalReturnType {
  setInterval(callback: () => void, interval: number): number;
  clearInterval(id: number): void;
}

/**
 * Returns a wrapper function for `setInterval` which automatically cleanup.
 */
export function useSetInterval(): UseSetIntervalReturnType {
  const idMap = useConst<Record<number, number>>({});

  useEffect(
    () => (): void => {
      for (const id of Object.keys(idMap)) {
        clearInterval(id as any);
      }
    },
    [idMap],
  );

  return useConst<UseSetIntervalReturnType>({
    setInterval(callback, interval) {
      const id = setInterval(callback, interval) as unknown as number;
      idMap[id] = 1;
      return id;
    },
    clearInterval(id) {
      delete idMap[id];
      clearInterval(id);
    },
  });
}

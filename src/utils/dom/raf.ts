/**
 * requestAnimationFrame polyfill
 */

import { isServer } from '..';

let prev = Date.now();

function fallback(fn: FrameRequestCallback): number {
  const curr = Date.now();
  const ms = Math.max(0, 16 - (curr - prev));
  const id = setTimeout(fn, ms);
  prev = curr + ms;
  return id;
}

const root = (isServer ? global : window) as Window;

const iRaf = root.requestAnimationFrame || fallback;

const iCancel = root.cancelAnimationFrame || root.clearTimeout;

export function raf(fn: FrameRequestCallback): number {
  return iRaf.call(root, fn);
}

export function doubleRaf(fn: FrameRequestCallback): void {
  raf(() => {
    raf(fn);
  });
}

export function cancelRaf(id: number): void {
  iCancel.call(root, id);
}

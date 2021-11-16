import { isServer } from '..';

export let supportsPassive = false;

if (!isServer) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true;
        return supportsPassive;
      },
    });
    window.addEventListener('test-passive', null as any, opts);
    window.removeEventListener('test-passive', null as any, opts);
  } catch (e) {
    //
  }
}

export type EventHandler = (event: Event) => void;

export function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  passive?: boolean,
): void;

export function on<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  handler: (this: Document, ev: DocumentEventMap[K]) => any,
  passive?: boolean,
): void;

export function on<K extends keyof WindowEventMap>(
  target: Window,
  event: K,
  handler: (this: Window, ev: WindowEventMap[K]) => any,
  passive?: boolean,
): void;

export function on<K extends keyof WindowEventMap>(
  target: HTMLElement | Window,
  event: K,
  handler: (this: HTMLElement | Window, ev: WindowEventMap[K]) => any,
  passive?: boolean,
): void;

export function on(
  target: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
  passive = false,
): void {
  if (!isServer) {
    target.addEventListener(event, handler, supportsPassive ? { capture: false, passive } : false);
  }
}

export function off<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
): void;

export function off<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  handler: (this: Document, ev: DocumentEventMap[K]) => any,
): void;

export function off<K extends keyof DocumentEventMap>(
  target: Window,
  event: string,
  handler: EventListenerOrEventListenerObject | ((event: Event) => any),
): void;

export function off<K extends keyof DocumentEventMap>(
  target: HTMLElement | Window,
  event: string,
  handler: EventListenerOrEventListenerObject | ((event: Event) => any),
): void;

export function off(
  target: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject | ((event: Event) => any),
): void {
  if (!isServer) {
    target.removeEventListener(event, handler);
  }
}

export function stopPropagation(event: Event): void {
  event.stopPropagation();
}

export function preventDefault(event: Event, isStopPropagation?: boolean): void {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}

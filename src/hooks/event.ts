/* eslint-disable semi */
import { RefObject, useRef, useEffect } from 'react';

export function useEventListener(
  element: RefObject<Element> | Element | Window | Document,
  eventName: string,
  listener: (event: Event) => void,
  passive?: boolean,
): void {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const actualElement = element && 'current' in element ? element.current : element;
    if (!actualElement) {
      return;
    }
    const finalListener = (event: Event): void => listenerRef.current(event);
    actualElement.addEventListener(eventName, finalListener, { passive });
    return (): void => actualElement.removeEventListener(eventName, finalListener);
  }, [element, eventName, passive]);
}

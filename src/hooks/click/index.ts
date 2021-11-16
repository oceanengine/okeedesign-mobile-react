import { RefObject, useEffect } from 'react';
import { off, on } from '../../utils/dom/event';
import { useRefCallback } from '../callback';

export type ClickOutsideConfig = {
  container: RefObject<HTMLDivElement>;
  method: 'click' | 'touchstart';
  callback: () => void;
  closeOnClickOutside: boolean;
};

export function useClickOutside(config: ClickOutsideConfig): void {
  const listener = useRefCallback(function (event: MouseEvent | TouchEvent) {
    if (config.closeOnClickOutside && !config.container.current?.contains(event.target as Node)) {
      config.callback();
    }
  });
  useEffect(() => {
    on(document, config.method, listener);
    return (): void => {
      off(document, config.method, listener);
    };
  }, []);
}

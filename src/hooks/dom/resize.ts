import { MutableRefObject, useEffect } from 'react';
import { useRefCallback } from '../callback';

type ResizeHandler = () => void;

export type useResizeOptions = {
  onResize?: ResizeHandler;
};
export function useResize(options: useResizeOptions): void {
  const { onResize } = options;

  const onResizeValue = useRefCallback(onResize);

  useEffect(() => {
    if (window) {
      window.addEventListener('resize', onResizeValue);
    }
    return (): void => {
      if (window) {
        window.removeEventListener('resize', onResizeValue);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export type useContainerResizeOptions = {
  containerRef: MutableRefObject<HTMLElement | null>;
  callback: (...args: any[]) => void;
  removeCallback?: (...args: any[]) => void;
};
export function useContainerResize(options: useContainerResizeOptions): void {
  const {
    containerRef,
    callback: propsCallback,
    removeCallback: propsRemoveCallback = (): void => {},
  } = options;

  const callback = useRefCallback(propsCallback);
  const removecallback = useRefCallback(propsRemoveCallback);

  useEffect(() => {
    callback();

    return (): void => {
      removecallback();
    };
  }, [callback, removecallback]);

  useEffect(() => {
    let resizeObserver: ResizeObserver;
    const container = containerRef.current;

    if (ResizeObserver && container) {
      resizeObserver = new ResizeObserver(() => {
        callback();
      });
      resizeObserver.observe(container);
    }

    return (): void => {
      if (container && resizeObserver) {
        resizeObserver.unobserve(container);
        removecallback();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
}

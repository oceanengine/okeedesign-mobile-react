import { useMemo, useRef } from 'react';

export type MountElem = HTMLElement | (() => HTMLElement);

export type OverlayConfig = {
  zIndex: number;
  className?: string;
  customStyle?: string | object[] | object;
  mountElem?: MountElem;
};

export interface StackItem {
  close: () => void;
  config: OverlayConfig;
}

export const context = {
  zIndex: 2000,
  lockCount: 0,
  stack: [] as StackItem[],

  get top(): StackItem {
    return this.stack[this.stack.length - 1];
  },
};

export interface UseZIndexOptions {
  update?: boolean;
}
export function useZIndex(props: UseZIndexOptions, ...deps: any[]): number {
  const { update = true } = props;

  const zIndexRef = useRef(0);
  return useMemo(() => {
    if (!zIndexRef.current || update) {
      zIndexRef.current = context.zIndex++;
    }
    return zIndexRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, ...deps]);
}

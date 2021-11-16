import * as React from 'react';
import { CSSProperties, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import { useRefCallback } from '../../hooks';

import createBEM, { addClass } from '../../utils/create/createBEM';
import { off, on } from '../../utils/dom/event';
import { UnionOmit } from '../../utils/types';

export interface StickyDeclared {
  target?: () => HTMLElement | Window;
  handleOuterScroll?: boolean;
  zIndex?: number;
  topOffset?: number;
  bottomOffset?: number;
  stickyClassName?: string;
  stickyStyle?: CSSProperties;
  children:
    | ((isSticky: boolean, stickyInfo: StickyInfo) => string | number | JSX.Element)
    | string
    | number
    | JSX.Element;
}

export type StickyPosition = 'top' | 'bottom';

export interface StickyInfo extends ElementPosition {
  sticky: boolean;
  position: StickyPosition;
  left: number;
  right: number;
}

export interface ElementPosition extends ElementSize {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ElementSize {
  width: number;
  height: number;
}

export type StickyProps = UnionOmit<StickyDeclared, HTMLAttributes<HTMLDivElement>>;

function decideIsSticky(
  target: HTMLElement | Window,
  stickyElement: HTMLElement,
  topOffset: number | undefined,
  bottomOffset: number | undefined,
): {
  sticky: boolean;
  position: StickyPosition;
  offset: number;
} {
  const stickyRect = stickyElement.getBoundingClientRect();
  if (target === window) {
    if (typeof topOffset !== 'undefined') {
      if (stickyRect.top - topOffset < 0) {
        return {
          sticky: stickyRect.top - topOffset < 0,
          position: 'top',
          offset: topOffset,
        };
      }
    }
    if (typeof bottomOffset !== 'undefined') {
      if (stickyRect.bottom - bottomOffset < 0) {
        return {
          sticky: stickyRect.bottom - bottomOffset < 0,
          position: 'bottom',
          offset: bottomOffset,
        };
      }
    }
  } else {
    const targetRect = (target as HTMLElement).getBoundingClientRect();

    if (typeof topOffset !== 'undefined') {
      if (stickyRect.top - targetRect.top - topOffset < 0) {
        return {
          sticky: stickyRect.top - targetRect.top - topOffset < 0,
          position: 'top',
          offset: topOffset + targetRect.top,
        };
      }
    }
    if (typeof bottomOffset !== 'undefined') {
      if (targetRect.bottom - stickyRect.bottom - bottomOffset < 0) {
        return {
          sticky: targetRect.bottom - stickyRect.bottom - bottomOffset < 0,
          position: 'bottom',
          offset: window.innerHeight - targetRect.bottom + bottomOffset,
        };
      }
    }
  }

  return {
    sticky: false,
    position: 'top',
    offset: 0,
  };
}

const bem = createBEM('sticky');

function Sticky(props: StickyProps): JSX.Element {
  const {
    target,
    zIndex,
    topOffset = 0,
    bottomOffset,
    stickyClassName,
    stickyStyle,
    children,
    handleOuterScroll,
    ...attrs
  } = props;

  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [stickyDirection, setStickyDirection] = useState<StickyPosition>('top');
  const [stickyPosition, setStickyPosition] = useState<Partial<ElementPosition>>({});

  const handleTargetScroll = useRefCallback((): void => {
    const stickyDom = stickyRef.current;
    const targetDom = target!();

    if (window && stickyDom && targetDom) {
      const {
        sticky: newIsSticky,
        position: newStickyDirection,
        offset,
      } = decideIsSticky(targetDom, stickyDom, topOffset, bottomOffset);

      if (newIsSticky !== isSticky) {
        if (newIsSticky) {
          const stickyRect = stickyDom.getBoundingClientRect();
          setIsSticky(true);
          setStickyDirection(newStickyDirection);
          setStickyPosition({
            [newStickyDirection]: offset,
            left: stickyRect.left,
            width: stickyRect.width,
            height: stickyRect.height,
          });
        } else {
          setIsSticky(false);
        }
      } else if (newIsSticky) {
        // global scroll, adjust position
        const stickyRect = stickyDom.getBoundingClientRect();
        setStickyDirection(newStickyDirection);
        setStickyPosition({
          [newStickyDirection]: offset,
          left: stickyRect.left,
          width: stickyRect.width,
          height: stickyRect.height,
        });
      }
    }
  });

  useEffect(() => {
    handleTargetScroll();

    const outerScrollListener = (): void => {
      handleTargetScroll();
    };
    // handle outer scroll
    if (handleOuterScroll) {
      window.addEventListener('scroll', outerScrollListener, true);
    }
    return (): void => {
      if (handleOuterScroll) {
        window.removeEventListener('scroll', outerScrollListener, true);
      }
    };
  }, [handleTargetScroll, handleOuterScroll]);

  useEffect(() => {
    const targetDom = target!();

    on(targetDom, 'scroll', handleTargetScroll, true);
    return (): void => {
      off(targetDom, 'scroll', handleTargetScroll);
    };
  }, [target, handleTargetScroll]);

  const stickyInfo: StickyInfo = useMemo(() => {
    return Object.assign(
      {
        height: 0,
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: stickyDirection,
        sticky: isSticky,
      },
      stickyPosition,
    );
  }, [isSticky, stickyDirection, stickyPosition]);

  const placeholderStyle: CSSProperties = useMemo(() => {
    return {
      width: stickyPosition.width,
      height: stickyPosition.height,
    };
  }, [stickyPosition]);

  const contentStyle: CSSProperties = useMemo(() => {
    if (!isSticky) return {};
    return Object.assign(
      {
        position: 'fixed',
        left: stickyPosition.left,
        right: stickyPosition.right,
        top: stickyPosition.top,
        bottom: stickyPosition.bottom,
        width: stickyPosition.width,
        height: stickyPosition.height,
        zIndex,
      } as CSSProperties,
      stickyStyle!,
    );
  }, [isSticky, stickyPosition, zIndex, stickyStyle]);

  return (
    <div ref={stickyRef} className={bem()}>
      {isSticky && <div className={bem('placeholder')} style={placeholderStyle}></div>}
      <div {...attrs} className={addClass(bem('content'), stickyClassName)} style={contentStyle}>
        {typeof children === 'function' ? children(isSticky, stickyInfo) : children}
      </div>
    </div>
  );
}

const defaultProps: Partial<StickyProps> = {
  target: () => window,
  zIndex: 0,
  stickyClassName: '',
  stickyStyle: {},
  handleOuterScroll: false,
};

Sticky.defaultProps = defaultProps;

export default Sticky;

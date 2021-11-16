/* eslint-disable semi */
import React, {
  ForwardRefRenderFunction,
  PropsWithChildren,
  MouseEventHandler,
  TouchEventHandler,
  CSSProperties,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';

import { useTouch } from '../../hooks';

import createBEM, { addClass } from '../../utils/create/createBEM';
import { RenderFunction } from '../../utils/types';
import { clamp } from '../../utils/math';
import { on, off } from '../../utils/dom/event';

const SWIPE_DURATION = 0.6;
const SWIPE_MOVE_THRESHOLD = 16;

const bem = createBEM('swipe-cell');

export type SwipeCellClickPosition = 'outside' | 'cell' | 'left' | 'right';

export type SwipeCellOpenFunction = (position: 'left' | 'right') => void;

export type SwipeCellCloseFunction = () => void;

/**
 * The instance object to expose.
 */
export interface SwipeCellForward {
  /**
   * The instance method to change swipe cell to open status.
   */
  open: SwipeCellOpenFunction;

  /**
   * The instance method to change swipe cell to close status.
   */
  close: SwipeCellCloseFunction;
}

export interface SwipeCellCloseData {
  name?: string | number;
}

export interface SwipeCellProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The name id, uses in close event.
   */
  name?: string | number;

  /**
   * Disabled the swipe or not.
   * @default false
   */
  disabled?: boolean;

  /**
   * The distance threshold for determining whether or not to swipe after a drag.
   * @default 16
   */
  swipeThreshold?: number;

  /**
   * The transition duration for swiping after a drag.
   */
  swipeDuration?: number;

  /**
   * Specify the width of left area.
   */
  leftWidth?: number;

  /**
   * Specify the width of right area.
   */
  rightWidth?: number;

  /**
   * Custom content of the left area.
   */
  left?: string | JSX.Element | RenderFunction;

  /**
   * Custom content of the right area.
   */
  right?: string | JSX.Element | RenderFunction;

  /**
   * Optional callback when swipe cell is clicked.
   */
  onClick?: MouseEventHandler<HTMLDivElement>;

  /**
   * Enable async callback when swipe cell is closed.
   * @default false
   */
  async?: boolean;

  /**
   * Optional callback when swipe cell is clicked for closing. To enable, the prop `async` need to be set to `true`.
   * @param position The click position.
   * @param forward The instance object that is exposed, includes some methods.
   * @param data The data related to the swipe cell.
   */
  onClose?(
    position: SwipeCellClickPosition,
    forward: SwipeCellForward,
    data: SwipeCellCloseData,
  ): void;
}

const SwipeCell: ForwardRefRenderFunction<SwipeCellForward, SwipeCellProps> = (
  props: PropsWithChildren<SwipeCellProps>,
  ref,
) => {
  const {
    className,
    style,
    name,
    async,
    disabled,
    leftWidth = 0,
    rightWidth = 0,
    left,
    right,
    onClick,
    onClose,
    children,
  } = props;

  const selfRef = useRef<HTMLDivElement>(null);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const [{ computedLeftWidth, computedRightWidth }, setComputedWidth] = useState({
    computedLeftWidth: 0,
    computedRightWidth: 0,
  });

  useEffect(() => {
    const newLeftWidth = leftWidth || leftRef.current?.clientWidth || 0;
    const newRightWidth = rightWidth || rightRef.current?.clientWidth || 0;
    setComputedWidth({
      computedLeftWidth: newLeftWidth,
      computedRightWidth: newRightWidth,
    });
  }, [leftWidth, rightWidth, left, right]);

  const [
    { [0]: touchState },
    ,
    { onTouchStart: touchStart, onTouchMove: touchMove, onTouchEnd: touchEnd },
  ] = useTouch();

  const [{ start, delta, deltaLast, swiping }, setSwipeState] = useState({
    start: 0,
    delta: 0,
    deltaLast: 0,
    swiping: false,
  });

  const [wrapperStyle, setWrapperStyle] = useState<CSSProperties>({});

  const open: SwipeCellOpenFunction = position => {
    const computed = position === 'left' ? computedLeftWidth : -computedRightWidth;
    setSwipeState({ start: computed, delta: computed, deltaLast: delta, swiping: true });
  };

  const close: SwipeCellCloseFunction = () => {
    setSwipeState({ start: 0, delta: 0, deltaLast: delta, swiping: true });
  };

  const drag = (value: number): void => {
    const computed = clamp(start + value, -computedRightWidth, computedLeftWidth);
    setSwipeState({ start, delta: computed, deltaLast: delta, swiping: false });
  };

  const swipe = (): void => {
    if (start > 0 && delta > 0) {
      if (start - delta < SWIPE_MOVE_THRESHOLD) {
        return open('left');
      }
      return close();
    }
    if (start < 0 && delta < 0) {
      if (start - delta > -SWIPE_MOVE_THRESHOLD) {
        return open('right');
      }
      return close();
    }
    if (-SWIPE_MOVE_THRESHOLD < delta && delta < SWIPE_MOVE_THRESHOLD) {
      return close();
    }
    return open(delta >= 0 ? 'left' : 'right');
  };

  useEffect(() => {
    if (touchState && touchState.direction === 'horizontal') {
      drag(touchState.deltaX);
    }
    if (!touchState) {
      swipe();
    }
  }, [touchState, computedLeftWidth, computedRightWidth]);

  useEffect(() => {
    const duration =
      SWIPE_DURATION *
      Math.abs((delta - deltaLast) / (deltaLast > 0 ? computedLeftWidth : computedRightWidth));
    window.requestAnimationFrame(() => {
      setWrapperStyle({
        transform: `translate3d(${delta}px, 0, 0)`,
        transition: swiping ? `transform ${duration}s cubic-bezier(0.18, 0.89, 0.32, 1)` : 'none',
      });
    });
  }, [start, delta]);

  const wrapDisabled =
    (handler: TouchEventHandler<HTMLDivElement>): TouchEventHandler<HTMLDivElement> =>
    (event): void => {
      if (disabled) {
        return;
      }
      handler(event);
    };

  const onTouchStart = wrapDisabled(touchStart);
  const onTouchMove = wrapDisabled(touchMove);
  const onTouchEnd = wrapDisabled(touchEnd);

  const createClickHandler =
    (position: SwipeCellClickPosition, stop = false): MouseEventHandler<HTMLDivElement> =>
    (event): void => {
      if (stop) {
        event.stopPropagation();
      }
      if (position === 'cell' && onClick) {
        onClick(event);
      }
      if (!delta) {
        return;
      }
      if (async) {
        onClose && onClose(position, { open, close }, { name });
      } else {
        close();
      }
    };

  useImperativeHandle(ref, () => ({ open, close }));

  useEffect(() => {
    const onClickOutside = createClickHandler('outside');
    const onClickOutsideNative = (event: MouseEvent): void => {
      if (!selfRef.current?.contains(event.target as Node)) {
        onClickOutside(event as any);
      }
    };
    on(document, 'click', onClickOutsideNative);
    const cleanup = (): void => off(document, 'click', onClickOutsideNative);
    return cleanup;
  });

  const classes = bem();

  return (
    <div
      className={addClass(classes, className)}
      style={style}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onClick={createClickHandler('cell')}
    >
      <div className={bem('wrapper')} style={wrapperStyle}>
        {!!left && (
          <div className={bem('left')} ref={leftRef} onClick={createClickHandler('left')}>
            {typeof left === 'function' ? left({}) : left}
          </div>
        )}
        {children}
        {!!right && (
          <div className={bem('right')} ref={rightRef} onClick={createClickHandler('right')}>
            {typeof right === 'function' ? right({}) : right}
          </div>
        )}
      </div>
    </div>
  );
};

SwipeCell.displayName = 'SwipeCell';

export default forwardRef<SwipeCellForward, PropsWithChildren<SwipeCellProps>>(SwipeCell);

/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable semi */
import React, {
  AllHTMLAttributes,
  CSSProperties,
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
  ReactElement,
} from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';
import { createClampIndexLoop } from '../../utils/math';
import { createUniformVelocityBrakingDisplacement } from '../../utils/motion';

import { TouchHookEventHandlerCallback, useTouch, useRecord } from '../../hooks';
import { RenderContent } from '../../utils/types';
import { useContainerResize, useResize } from '../../hooks/dom';

const DEFAULT_DURATION = 300;

const bem = createBEM('swipe');
const bemItem = createBEM('swipe-item');

interface SwipeContextValue {
  index: number;
  active: boolean;
  style: CSSProperties;
}

const SwipeContext = createContext<SwipeContextValue>({ index: 0, active: false, style: {} });

export interface SwipeIndicatorsProps {
  /**
   * The index number of current active item.
   */
  activeIndex: number;

  /**
   * The total amount of items.
   */
  length: number;
}

export type SwipeType = 'default' | 'primary';

export type SwipeTouchDirection = 'normal' | 'cross';

export interface SwipePropsDeclared {
  /**
   * The swipe color style type.
   * @default 'default'
   */
  type?: SwipeType;

  /**
   * The swipe should play as soon as possible.
   * @default true
   */
  autoplay?: boolean;

  /**
   * The initial start index of swipe items.
   * @default 0
   */
  startIndex?: number;

  /**
   * Optional callback when swiped.
   * @param value the index of active swipe item
   */
  onChange?(value: number): void;

  /**
   * Indicates whether the first swipe item should follow closely behind the last item when swiping finished.
   * @default true
   */
  loop?: boolean;

  /**
   * The length of time that a swiping animation takes to complete.
   * @default 300
   */
  duration?: number;

  /**
   * The period of time between two swiping animation when autoplay.
   * @default 5000
   */
  interval?: number;

  /**
   * Whether to enable touch events for swiping.
   * @default true
   */
  touchable?: boolean;

  /**
   * Touch direction when body transformed
   */
  touchDirection?: SwipeTouchDirection;

  /**
   * Whether to show indicators or not.
   * @default true
   */
  showIndicators?: boolean;

  /**
   * Customize indicator rendering content.
   */
  indicators?: RenderContent<SwipeIndicatorsProps>;

  /**
   * The color of indicators.
   */
  indicatorColor?: string;

  /**
   * The color of the active indicator.
   */
  indicatorActiveColor?: string;
}

export type SwipeProps = SwipePropsDeclared &
  Omit<AllHTMLAttributes<HTMLDivElement>, keyof SwipePropsDeclared>;

const Swipe: FC<SwipeProps> & { Item: FC<SwipeItemProps> } = (
  props: PropsWithChildren<SwipeProps>,
) => {
  const {
    className,
    autoplay = true,
    startIndex = 0,
    onChange,
    loop = true,
    interval = 5000,
    duration = DEFAULT_DURATION,
    touchable = true,
    touchDirection = 'normal',
    showIndicators = true,
    indicators,
    indicatorColor,
    indicatorActiveColor,
    children,
    ...attrs
  } = props;

  const finalDuration = Math.abs(duration) || DEFAULT_DURATION;
  const finalTransition = `transform ${finalDuration}ms ease`;

  const items = React.Children.toArray(children).filter(isSwipeItem);
  const { length } = items;
  const clampIndexLoop = createClampIndexLoop(length);

  const [width, setWidth] = useState(357);
  const refTrack = useRef<HTMLDivElement>(null);
  const resizeHandler = (): void => {
    if (refTrack.current) {
      const newWidth = refTrack.current.clientWidth;
      setWidth(newWidth);
    }
  };
  useContainerResize({
    callback: resizeHandler,
    containerRef: refTrack,
  });
  useResize({
    onResize: resizeHandler,
  });

  // Animation Status
  const [dragging, setDragging] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [resetting, setResetting] = useState(false);
  const statusRef = useRef({ dragging, switching, resetting });
  statusRef.current = { dragging, switching, resetting };

  const [{ currentIndex, currentOffset, speed }, setItemRecord] = useRecord({
    currentIndex: startIndex,
    currentOffset: 0,
    speed: 0,
  });
  const previousIndex = currentIndex - 1;
  const previousOffset = currentOffset - width;
  const nextIndex = currentIndex + 1;
  const nextOffset = currentOffset + width;

  // do switching
  useEffect(() => {
    if (!switching) {
      return;
    }
    let handler = window.requestAnimationFrame(start => {
      const index = speed > 0 ? previousIndex : nextIndex;
      const offset = speed > 0 ? previousOffset : nextOffset;
      const newIndex = clampIndexLoop(index);
      onChange?.(newIndex);
      setItemRecord({
        currentIndex: newIndex,
        currentOffset: offset,
      });

      const totalTime = finalDuration * (Math.abs(offset) / width);
      const getDisplacement = createUniformVelocityBrakingDisplacement(totalTime, -offset, speed);

      const step = (current: number): void => {
        const time = current - start;
        if (time >= totalTime) {
          setSwitching(false);
          setItemRecord({
            currentOffset: 0,
            speed: 0,
          });
          return;
        }

        const x = offset + getDisplacement(time);
        setItemRecord({
          currentOffset: x,
        });

        handler = window.requestAnimationFrame(step);
      };

      handler = window.requestAnimationFrame(step);
    });
    return (): void => window.cancelAnimationFrame(handler);
  }, [switching]);

  // do reset
  useEffect(() => {
    if (!resetting) {
      return;
    }
    let animateHandler = window.requestAnimationFrame(() => {
      setItemRecord({
        currentOffset: 0,
      });
    });
    const timeoutHandler = window.setTimeout(() => {
      animateHandler = window.requestAnimationFrame(() => setResetting(false));
    }, finalDuration);
    return (): void => {
      window.cancelAnimationFrame(animateHandler);
      window.clearTimeout(timeoutHandler);
    };
  }, [resetting]);

  const afterTouchMove: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    const state = states[0];
    if (
      !switching &&
      !resetting &&
      state &&
      state.direction === (touchDirection === 'normal' ? 'horizontal' : 'vertical') &&
      states.length === 1
    ) {
      event.preventDefault();

      const deltaX = touchDirection === 'normal' ? state.deltaX : state.deltaY;

      if (
        (loop === false && deltaX > 0 && currentIndex === 0) ||
        (loop === false && deltaX < 0 && currentIndex === length - 1)
      ) {
        return;
      }

      window.requestAnimationFrame(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deltaX = touchDirection === 'normal' ? state.deltaX : state.deltaY;
        const speedX = touchDirection === 'normal' ? state.speedX : state.speedY;
        setItemRecord({
          currentOffset: deltaX,
          speed: speedX,
        });
        setDragging(true);
      });
    }
  };

  const beforeTouchEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    const state = states[0];
    if (
      !switching &&
      !resetting &&
      state &&
      state.direction === (touchDirection === 'normal' ? 'horizontal' : 'vertical') &&
      states.length === 1
    ) {
      const deltaX = touchDirection === 'normal' ? state.deltaX : state.deltaY;

      if (
        (loop === false && deltaX > 0 && currentIndex === 0) ||
        (loop === false && deltaX < 0 && currentIndex === length - 1)
      ) {
        return;
      }

      window.requestAnimationFrame(() => {
        const deltaX = touchDirection === 'normal' ? state.deltaX : state.deltaY;
        const speedX = touchDirection === 'normal' ? state.speedX : state.speedY;
        setDragging(false);
        if (Math.abs(speedX) >= 1) {
          setSwitching(true);
        } else if (Math.abs(deltaX) >= 0.5 * width) {
          setItemRecord({ speed: (width / finalDuration) * (deltaX < 0 ? -1 : 1) });
          setSwitching(true);
        } else {
          setResetting(true);
        }
      });
    }
  };

  const methodsRef = useRef({
    previous() {
      const { dragging, switching, resetting } = statusRef.current;
      if (dragging || switching || resetting) {
        return;
      }
      window.requestAnimationFrame(() => {
        setItemRecord({
          speed: (width / finalDuration) * 1.2,
        });
        setSwitching(true);
      });
    },
    next() {
      const { dragging, switching, resetting } = statusRef.current;
      if (dragging || switching || resetting) {
        return;
      }
      window.requestAnimationFrame(() => {
        setItemRecord({
          speed: (-width / finalDuration) * 1.2,
        });
        setSwitching(true);
      });
    },
  });

  // autoplay
  const autoplayRef = useRef({
    timeStamp: 0,
  });
  useEffect(() => {
    autoplayRef.current.timeStamp = Date.now();
  }, [dragging, resetting]);
  useEffect(() => {
    if (!autoplay) {
      return;
    }
    const handler = window.setInterval(() => {
      const { dragging, switching, resetting } = statusRef.current;
      if (
        dragging ||
        switching ||
        resetting ||
        Date.now() - autoplayRef.current.timeStamp < interval
      ) {
        return;
      }
      methodsRef.current.next();
    }, interval);
    return (): void => window.clearInterval(handler);
  }, [autoplay, interval]);

  // touch
  const [, , { onTouchStart, onTouchMove, onTouchEnd }] = useTouch({
    disabled: !touchable,
    afterTouchMove,
    beforeTouchEnd,
  });

  useEffect(() => {
    const elem = refTrack.current;
    if (!elem) {
      return;
    }
    elem.addEventListener('touchstart', onTouchStart);
    elem.addEventListener('touchmove', onTouchMove, { passive: false });
    elem.addEventListener('touchend', onTouchEnd);
    return (): void => {
      elem.removeEventListener('touchstart', onTouchStart);
      elem.removeEventListener('touchmove', onTouchMove);
      elem.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const renderItem = (index: number, offset: number): ReactElement => {
    return (
      <SwipeContext.Provider
        key={clampIndexLoop(index)}
        value={{
          index,
          active: clampIndexLoop(index) === currentIndex,
          style: {
            transform: `translate3d(${offset}px,0,0)`,
            transition: (resetting && finalTransition) || 'none',
          },
        }}
      >
        {items[clampIndexLoop(index)]}
      </SwipeContext.Provider>
    );
  };

  const elemIndicators =
    showIndicators &&
    ((indicators &&
      (typeof indicators === 'function'
        ? indicators({ activeIndex: currentIndex, length })
        : indicators)) || (
      <div className={bem('indicators')}>
        {items.map((_, index) => {
          const active = index === currentIndex;
          return (
            <i
              key={index}
              className={bem('indicator', { active })}
              style={{
                backgroundColor: active ? indicatorActiveColor : indicatorColor,
              }}
            />
          );
        })}
      </div>
    ));

  const classes = addClass(bem({ loop, dragging, switching, resetting }), className);

  return (
    <div className={classes} ref={refTrack} {...attrs}>
      <div
        className={bem('track')}
        style={
          (loop && {}) || {
            transform: `translate3d(${currentOffset - width * currentIndex}px, 0, 0)`,
            transition: (resetting && finalTransition) || 'none',
          }
        }
      >
        {(loop && [
          renderItem(previousIndex, previousOffset),
          renderItem(currentIndex, -width + currentOffset),
          renderItem(nextIndex, -width * 2 + nextOffset),
        ]) ||
          items}
      </div>

      {elemIndicators}
    </div>
  );
};

Swipe.displayName = 'Swipe';

export interface SwipeItemProps extends AllHTMLAttributes<HTMLDivElement> {
  /**
   * Extra CSS class name when item is active.
   */
  activeClass?: string;

  /**
   * Extra CSS style when item is active.
   */
  activeStyle?: CSSProperties;
}

const SwipeItem: FC<SwipeItemProps> = (props: PropsWithChildren<SwipeItemProps>) => {
  const { className, style: extraStyle, activeClass, activeStyle, children, ...attrs } = props;

  const { index, active, style: injectedStyle } = useContext(SwipeContext);

  const classes = addClass(bemItem(), className, active && activeClass);
  const style = { ...extraStyle, ...(active && activeStyle), ...injectedStyle };

  return (
    <div className={classes} style={style} {...attrs} data-index={index} data-active={active}>
      {children}
    </div>
  );
};

SwipeItem.displayName = 'SwipeItem';

Swipe.Item = SwipeItem;

function isSwipeItem(node: ReactNode): boolean {
  return (
    !!node &&
    typeof node === 'object' &&
    'type' in node &&
    typeof node.type === 'function' &&
    node.type === SwipeItem
  );
}

export default Swipe;

export { Swipe, SwipeItem };

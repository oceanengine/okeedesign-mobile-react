import React, { useState, useRef, useEffect, HTMLAttributes } from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

import { RenderFunction } from '../../utils/types';

import {
  useTouch,
  TouchHookEventHandlerCallback,
  TouchHookState,
  TouchHookEventHandler,
  useRefCallback,
} from '../../hooks';

import { getScrollEventTarget, getScrollBottom, getScrollTop } from '../../utils/dom/scroll';
import { on, off, preventDefault } from '../../utils/dom/event';

import Icon from '../icon';

type StatusText = string | JSX.Element | RenderFunction<void>;
type PullRefreshDirection = 'up' | 'down';
type PullRefreshSize = 'normal' | 'large';
export interface PullRefreshProps extends HTMLAttributes<HTMLDivElement> {
  value: boolean;
  size?: PullRefreshSize;
  pullingText?: StatusText;
  loosingText?: StatusText;
  loadingText?: StatusText;
  successText?: StatusText;
  successDuration?: number | string;
  animationDuration?: number | string;
  headHeight?: number | string;

  disabled?: boolean;
  direction?: PullRefreshDirection;

  renderIcon?: string | JSX.Element | RenderFunction<void>;

  children?: React.ReactNode;

  onRefresh?: () => void;
}

type PullRefreshStatus = 'normal' | 'pulling' | 'loosing' | 'loading' | 'success';

const bem = createBEM('pull-refresh');

function PullRefresh(props: PullRefreshProps): JSX.Element {
  const {
    value,
    size,
    children,
    disabled,
    successDuration,
    animationDuration,
    headHeight,
    direction,
    onRefresh,
    className,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pullingText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loosingText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadingText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    successText,

    renderIcon,
    ...attrs
  } = props;

  const [status, setStatus] = useState<PullRefreshStatus>('normal');
  const [offset, setOffset] = useState(0);
  const [isCeiling, setCeiling] = useState(false);
  const [isBottom, setBottom] = useState(false);
  const [duration, setDuration] = useState(0);
  const refTouchRegion = useRef<HTMLDivElement>(null);

  const ease = (distance: number, presetDistance: number): number => {
    return Math.round(
      distance < presetDistance
        ? distance
        : distance < presetDistance * 2
        ? presetDistance + (distance - presetDistance) / 2
        : presetDistance * 1.5 + (distance - presetDistance * 2) / 4,
    );
  };

  const afterTouchStart: TouchHookEventHandlerCallback<HTMLDivElement> = () => {
    setDuration(0);
  };

  const afterTouchMove: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    const { direction: touchDirection, deltaY } = states[0] as TouchHookState;
    if (touchDirection === 'vertical') {
      const distance = Math.abs(deltaY);
      const easeDistance = ease(distance, +headHeight!);
      const setMoveStatus = (): void => {
        if (distance >= +headHeight!) {
          setStatus('loosing');
        } else {
          setStatus('pulling');
        }
      };
      if (direction === 'down' && isCeiling && deltaY > 0) {
        preventDefault(event as any, true);
        setOffset(easeDistance);
        setMoveStatus();
      }

      if (direction === 'up' && isBottom && deltaY < 0) {
        preventDefault(event as any, true);
        setOffset(easeDistance);
        setMoveStatus();
      }
    }
  };

  const beforeTouchEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    const { direction: touchDirection, deltaY } = states[0] as TouchHookState;
    if (touchDirection === 'vertical') {
      const distance = Math.abs(deltaY);
      setDuration(+animationDuration!);
      if (
        distance >= +headHeight! &&
        ((direction === 'down' && deltaY > 0) || (direction === 'up' && deltaY < 0))
      ) {
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setOffset(0);
        setStatus('normal');
        setCeiling(false);
        setBottom(false);
      }
    }
  };

  const [, , { onTouchStart: touchStart, onTouchMove: touchMove, onTouchEnd: touchEnd }] = useTouch(
    {
      afterTouchStart,
      afterTouchMove,
      beforeTouchEnd,
      disabled,
    },
  );

  const [touchable, setTouchable] = useState(false);
  useEffect(() => {
    setTouchable(!disabled && !['loading', 'success'].includes(status));
  }, [disabled, status]);

  const updateIsCeiling = (): boolean => {
    if (refTouchRegion.current) {
      const val = getScrollTop(getScrollEventTarget(refTouchRegion.current)) === 0;
      setCeiling(val);
      if (val) {
        setBottom(false);
      }
      return val;
    }
    return isCeiling;
  };

  const updateIsBottom = (): boolean => {
    if (refTouchRegion.current) {
      const val = Math.abs(getScrollBottom(getScrollEventTarget(refTouchRegion.current))) < 1;
      setBottom(val);
      if (val) {
        setCeiling(false);
      }
      return val;
    }
    return isBottom;
  };

  const onTouchStart: TouchHookEventHandler<HTMLDivElement> = useRefCallback(event => {
    if (touchable) {
      if ((direction === 'down' && updateIsCeiling()) || (direction === 'up' && updateIsBottom())) {
        touchStart(event);
      }
    }
  });

  const onTouchMove: TouchHookEventHandler<HTMLDivElement> = useRefCallback(event => {
    if (touchable) {
      if (direction === 'down') {
        if (isCeiling) {
          touchMove(event);
        } else if (updateIsCeiling()) {
          onTouchStart(event);
        }
      }
      if (direction === 'up') {
        if (isBottom) {
          touchMove(event);
        } else if (updateIsCeiling()) {
          onTouchStart(event);
        }
      }
    }
  });

  const onTouchEnd: TouchHookEventHandler<HTMLDivElement> = useRefCallback(event => {
    if (touchable) {
      if ((direction === 'down' && isCeiling) || (direction === 'up' && isBottom)) {
        touchEnd(event);
      }
    } else {
      setCeiling(false);
      setBottom(false);
    }
  });

  useEffect(() => {
    const elem = refTouchRegion.current;
    if (!elem) {
      return;
    }
    on(elem, 'touchstart', onTouchStart);
    on(elem, 'touchmove', onTouchMove);
    on(elem, 'touchend', onTouchEnd);
    on(elem, 'touchcancel', onTouchEnd);
    return (): void => {
      off(elem, 'touchstart', onTouchStart);
      off(elem, 'touchmove', onTouchMove);
      off(elem, 'touchend', onTouchEnd);
      off(elem, 'touchcancel', onTouchEnd);
    };
  }, []);

  const [valueState, setValueState] = useState(value);
  useEffect(() => {
    if (valueState !== value) {
      setValueState(value);
      if (value === false) {
        setStatus('success');
        const delayOperate = (): void => {
          setOffset(0);
          setStatus('normal');
          setCeiling(false);
          setBottom(false);
        };
        if (+successDuration!) {
          setTimeout(() => {
            delayOperate();
          }, +successDuration!);
        } else {
          delayOperate();
        }
      } else {
        setOffset(+headHeight!);
        setStatus('loading');
      }
    }
  }, [value]);

  const style = {
    transition: `${duration}ms`,
    transform: offset ? `translate3d(0,${isBottom ? -offset : offset}px, 0)` : '',
  };

  const LogoIcon = (): JSX.Element | null | string => {
    if (renderIcon) {
      if (typeof renderIcon === 'function') {
        return renderIcon();
      }
      return renderIcon;
    }
    return <Icon name="Circle" className={bem('icon')} />;
  };

  const Head = (): JSX.Element | null => {
    if (!isCeiling) {
      return null;
    }
    let statusText;
    switch (status) {
      case 'normal':
        return null;
      default:
        statusText = props[`${status}Text` as keyof PullRefreshProps] as StatusText;
        return (
          <div className={bem('head', [status])}>
            <div className={bem('wrp', [size, status])}>
              {LogoIcon()}
              <span className={bem('wrp__text')}>
                {typeof statusText === 'function' ? statusText() : statusText}
              </span>
            </div>
          </div>
        );
    }
  };

  const Bottom = (): JSX.Element | null => {
    if (!isBottom) {
      return null;
    }
    let statusText;
    switch (status) {
      case 'normal':
        return null;
      default:
        statusText = props[`${status}Text` as keyof PullRefreshProps] as StatusText;
        return (
          <div className={bem('bottom', [status])}>
            <div className={bem('wrp', [size, status])}>
              {LogoIcon()}
              <span className={bem('wrp__text')}>
                {typeof statusText === 'function' ? statusText() : statusText}
              </span>
            </div>
          </div>
        );
    }
  };

  const Content = (): JSX.Element => {
    return <div className={bem('content')}>{children}</div>;
  };

  return (
    <div className={addClass(bem({ disabled }), className)} {...attrs}>
      <div className={bem('track')} ref={refTouchRegion} style={style}>
        {Head()}
        {Content()}
        {Bottom()}
      </div>
    </div>
  );
}

const defaultProps: PullRefreshProps = {
  value: false,
  size: 'normal',
  pullingText: '下拉刷新...',
  loosingText: '释放刷新...',
  loadingText: '加载中...',
  successText: '刷新成功...',
  successDuration: 300,
  animationDuration: 300,
  headHeight: 50,
  disabled: false,
  direction: 'down',
};

PullRefresh.defaultProps = defaultProps;

export default PullRefresh;

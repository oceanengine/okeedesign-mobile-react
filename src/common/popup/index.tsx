/**
 * 全局 popup 公有类
 */
import { useEffect, useMemo, useRef, useState } from 'react';

import Touch from '../touch';
import { openOverlay, closeOverlay } from './overlay';

import { context, StackItem, useZIndex } from './context';
import { isDef } from '../../utils';

import { on, off, preventDefault } from '../../utils/dom/event';
import { getScrollEventTarget } from '../../utils/dom/scroll';
import { prefix } from '../../utils/create/createBEM';

/**
 * 默认CommonProps
 */
export interface PopupCommonProps {
  // whether to show popup
  value?: boolean;
  // whether to show overlay
  overlay?: boolean;
  // overlay custom class name
  overlayClass?: string;
  // overlay custom style
  overlayStyle?: object;
  // whether to close popup when click overlay
  closeOnClickOverlay?: boolean;
  // prevent body scroll
  lockScroll?: boolean;
  duration?: number;
  appendToBody?: boolean;
  getContainer?: string | HTMLElement | (() => HTMLElement);

  // temporary plan: stop preventing default touch move
  // defualt action stopping touch move leads to bad case
  preventDefaultTouchMove?: boolean;

  // onChange
  onChange?: (value: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

/**
 * Popup hook
 */
const OVERFLOW_HIDDEN_CLASS_NAME = `${prefix}overflow-hidden`;

// 获取跟节点
function getRootDom(container: HTMLDivElement | (() => HTMLDivElement)): HTMLElement | null {
  let rootDom;
  if (typeof container === 'function') {
    rootDom = container().childNodes[0];
  } else {
    rootDom = container.childNodes[0];
  }
  return rootDom ? (rootDom as HTMLElement) : null;
}

// 获取 lockScroll
function getLockScrollValue(lockScroll: undefined | boolean): boolean {
  return isDef(lockScroll) ? (lockScroll as boolean) : true;
}

// 检查 opened
function checkOpened(close: () => void): boolean {
  return context.stack.some((item: StackItem) => item.close === close);
}

const CONTAINER_NAME = `${prefix}popup-container`;
const BODY_DOM =
  typeof window === 'undefined' ? undefined : document.getElementsByTagName('body')[0];
let uid = 0;

export type PopupHooksValue = {
  container: HTMLDivElement | null;
  containerId: string;
};

export default function usePopup(
  props: PopupCommonProps,
  containerRef?: React.RefObject<HTMLDivElement>,
): PopupHooksValue {
  const { getContainer, appendToBody = true, preventDefaultTouchMove = true } = props;

  const appendElem = useRef<HTMLElement>();

  const containerId = useRef(`${CONTAINER_NAME}-${uid++}`);

  // TODO
  // fix useMemo effect
  const container = useMemo(() => {
    const hasMountPoint = !!getContainer || appendToBody;
    if (hasMountPoint && typeof window !== 'undefined') {
      const container = document.createElement('div');
      container.setAttribute('id', containerId.current);
      return container;
    }
    return null;
  }, [getContainer, appendToBody]);

  useEffect(() => {
    if (getContainer) {
      if (typeof getContainer === 'function') {
        appendElem.current = getContainer();
      } else if (typeof getContainer === 'string') {
        if (typeof window !== 'undefined') {
          appendElem.current = document.querySelector(getContainer) as HTMLElement;
        }
      } else {
        appendElem.current = getContainer;
      }
    } else if (appendToBody) {
      appendElem.current = BODY_DOM;
    }
  }, [getContainer, appendToBody]);

  // componentWillUnmount Hook
  useEffect(() => {
    const appendElemDom = appendElem.current;
    container && appendElemDom?.appendChild(container);
    return (): void => {
      container && appendElemDom?.removeChild(container);
    };
  }, [container]);

  const containerGetter =
    container ||
    function (): HTMLDivElement {
      // fixme
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      return containerRef?.current!;
    };

  // State Touch
  const [touch] = useState(new Touch());

  const [onTouchMove] = useState(() => {
    return (event: TouchEvent): void => {
      touch.touchMove(event);

      /**
       * 处理滚动穿透问题
       * IOS10、IOS12 中，Popup中的touchmove事件默认行为，会让蒙层下的元素跟着移动（横向+纵向）。
       * 而 IOS13以上 及 chrome 的模拟器中没有此默认行为。
       * 通过判断是否为 Popup 中的滚动，决定是否 preventDefault
       * */

      if (!preventDefaultTouchMove) return;

      const rootDom = getRootDom(containerGetter);

      const el = getScrollEventTarget(event.target as HTMLElement, rootDom as HTMLElement);

      const { scrollHeight, offsetHeight, scrollTop } = el as HTMLElement;

      // just process vertical scroll
      if (touch.direction !== 'vertical') return;

      // if scrollbar is in the middle
      if (scrollTop !== 0 && scrollTop + offsetHeight < scrollHeight) return;

      /**
       * 1. no scrollbar
       * 2. on the top move upward
       * 3. on the bottom move downward
       */
      if (
        offsetHeight >= scrollHeight ||
        (scrollTop === 0 && touch.deltaY > 0) ||
        (scrollTop + offsetHeight >= scrollHeight && touch.deltaY <= 0)
      ) {
        preventDefault(event, true);
      }
    };
  });

  const overlayZIndex = useZIndex({
    update: props.value,
  });
  const popupZIndex = useZIndex({
    update: props.value,
  });

  const [close] = useState(() => {
    return (): void => {
      if (props.closeOnClickOverlay) {
        props.onChange && props.onChange(false);
      }
    };
  });

  // overlay render 函数
  function renderOverlay(): void {
    const { overlay, overlayClass, overlayStyle = {}, appendToBody } = props;
    const extra =
      appendToBody && !getContainer
        ? {}
        : {
            mountElem: (): any => {
              return getRootDom(containerGetter)?.parentNode?.parentNode as any;
            },
          };
    if (overlay) {
      openOverlay(close, {
        zIndex: overlayZIndex,
        className: overlayClass,
        customStyle: overlayStyle,
        ...extra,
      });
    } else {
      closeOverlay(close);
    }
  }

  // Popup open 函数
  function onOpen(): void {
    if (!checkOpened(close) && props.overlay) {
      renderOverlay();

      if (getLockScrollValue(props.lockScroll)) {
        if (!context.lockCount && typeof window !== 'undefined') {
          document.body.classList.add(OVERFLOW_HIDDEN_CLASS_NAME);
        }
        context.lockCount++;

        on(document, 'touchstart', touch.touchStart as (event: Event) => void);
        on(document, 'touchmove', onTouchMove as (event: Event) => void);
      }
    }
  }

  // Popup close 函数
  function onClose(): void {
    if (checkOpened(close)) {
      closeOverlay(close);

      if (getLockScrollValue(props.lockScroll) && context.lockCount) {
        context.lockCount--;
        if (!context.lockCount && typeof window !== 'undefined') {
          document.body.classList.remove(OVERFLOW_HIDDEN_CLASS_NAME);
        }

        off(document, 'touchstart', touch.touchStart as (event: Event) => void);
        off(document, 'touchmove', onTouchMove as (event: Event) => void);
      }
    }
  }

  useEffect(() => {
    return (): void => {
      onClose();
    };
  }, []);

  // 监听 value
  useEffect(() => {
    props.value ? onOpen() : onClose();
  }, [props.value]);

  // componentDidUpdate hook
  useEffect(() => {
    const rootDom = getRootDom(containerGetter);
    if (rootDom !== null) {
      rootDom.style.zIndex = `${popupZIndex}`;
    }
  });

  return {
    container,
    containerId: containerId.current,
  };
}

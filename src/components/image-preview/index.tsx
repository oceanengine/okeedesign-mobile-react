/* eslint-disable semi */
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useRefCallback, useTouch } from '../../hooks';
import type { TouchHookEventHandlerCallback, TouchHookState } from '../../hooks';

import createBEM, { addClass } from '../../utils/create/createBEM';
import { on, preventDefault, off } from '../../utils/dom/event';
import { raf } from '../../utils/dom/raf';

import Icon from '../icon';
import Popup, { PopupProps } from '../popup';
import { clamp, getCorrectIndexInArray } from '../../utils/math';
import { RenderFunction } from '../../utils/types';

export type ImagePreviewCloseButtonPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface ImagePreviewProps {
  className?: string;

  value: boolean;

  /**
   * The string array of image URLs.
   */
  images: string[];

  /**
   * The index number for first showing.
   * @default 0
   */
  startIndex?: number;

  /**
   * The duration (millisecond) for swipe transition duration.
   * @default 200
   */
  swipeDuration?: number;

  /**
   * Toggle loop or not for swipe.
   * @default true
   */
  loop?: boolean;

  /**
   * Set maximum zoom scale.
   * @default 3
   */
  maxZoom?: number;

  /**
   * Set minimum zoom scale.
   */
  minZoom?: number;

  /**
   * Close on backward (history popstate).
   * @default false
   */
  closeOnPopstate?: boolean;

  /**
   * Show close button or not.
   * @default false
   */
  showCloseButton?: boolean;

  /**
   * The position of close button.
   * @default 'top-right'
   */
  closeButtonPosition?: ImagePreviewCloseButtonPosition;

  /**
   * Show images swipe indicators or not.
   * @default true
   */
  showIndicators?: boolean;

  onScale?: (value: number) => void;

  onChange?: (value: number) => void;

  onOpen?: () => void;

  onOpened?: () => void;

  onClose?: () => void;

  onClosed?: () => void;

  renderIndicators?: RenderFunction<{ active: number }>;

  renderClose?: RenderFunction<{
    onClose?: () => void;
    position: ImagePreviewCloseButtonPosition;
  }>;
}

export type ImagePreviewApiProps = Omit<ImagePreviewProps, 'value'>;
export interface ImagePreviewInstance {
  close: () => void;
}

const MIN_DISTANCE_SWITCH = 10;

const DOUBLE_CLICK_DURATION = 200;

const bem = createBEM('image-preview');

export const ImagePreview = (props: ImagePreviewProps): JSX.Element => {
  const {
    className,
    value,
    images,
    startIndex,
    swipeDuration,
    loop,
    maxZoom,
    minZoom,
    closeOnPopstate,
    showCloseButton,
    closeButtonPosition,
    showIndicators,

    renderIndicators,
    renderClose,

    onOpen,
    onOpened,
    onClose,
    onClosed,
    onChange,
    onScale,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(clamp(startIndex!, 0, images.length));
  const [adjacentIndex, setAdjacentIndex] = useState(-1);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [currentZ, setCurrentZ] = useState(0);
  const [adjacentX, setAdjacentX] = useState(0);
  const [currentOpacity, setCurrentOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  const [zooming, setZooming] = useState(false);
  const [toggleZooming, setToggleZooming] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [moving, setMoving] = useState(false);

  const positions = useRef({
    swipeWidth: 0,
    swipeHeight: 0,
    currentWidth: 0,
    currentHeight: 0,
    edgeLeft: 0,
    edgeRight: 0,
    edgeTop: 0,
    edgeBottom: 0,

    startScale: 1,
    lastClickTime: 0,
    lastDoubleClickTime: 0,

    startCurrentX: 0,
    startCurrentY: 0,
  });

  const closeTimer = useRef<number | null>();

  const swipeTimer = useRef<number | null>();

  const containerRef = useRef<HTMLDivElement>(null);
  const acitveSwipeRef = useRef<HTMLImageElement>(null);

  const popStateCallback = useRefCallback(() => {
    onClose?.();
  });
  useEffect(() => {
    if (closeOnPopstate) {
      on(window, 'popstate', popStateCallback);
    }
    return (): void => {
      if (closeOnPopstate) {
        off(window, 'popstate', popStateCallback);
      }
    };
  }, [closeOnPopstate]);

  const toggleZoom = () => {
    const newScale = scale === 1 ? maxZoom! : 1;

    raf(() => {
      setToggleZooming(true);

      setCurrentX(0);
      setCurrentY(0);
      setAdjacentIndex(-1);

      setZooming(false);
      setScale(newScale);

      positions.current.startCurrentX = 0;
      positions.current.startCurrentY = 0;
      positions.current.startScale = newScale;
    });

    swipeTimer.current = window.setTimeout(
      () =>
        raf(() => {
          setToggleZooming(false);
        }),
      swipeDuration,
    );
  };

  const initPositions = (): void => {
    const swipe = containerRef.current!;
    const current = acitveSwipeRef.current!;
    const swipeWidth = swipe.clientWidth;
    const swipeHeight = swipe.clientHeight;
    const currentWidth = (current && current.clientWidth * scale) || 0;
    const currentHeight = (current && current.clientHeight * scale) || 0;
    const edgeLeft = ((swipeWidth - currentWidth) / 2) * (swipeWidth < currentWidth ? 1 : -1);
    const edgeRight = -edgeLeft;
    const edgeTop = ((swipeHeight - currentHeight) / 2) * (swipeHeight < currentHeight ? 1 : -1);
    const edgeBottom = -edgeTop;

    positions.current.swipeWidth = swipeWidth;
    positions.current.swipeHeight = swipeHeight;
    positions.current.currentWidth = currentWidth;
    positions.current.currentHeight = currentHeight;
    positions.current.edgeLeft = edgeLeft;
    positions.current.edgeRight = edgeRight;
    positions.current.edgeTop = edgeTop;
    positions.current.edgeBottom = edgeBottom;
  };

  const moveStart = (): void => {
    initPositions();

    raf(() => {
      setMoving(true);
    });
  };

  const move: TouchHookEventHandlerCallback<HTMLDivElement> = (event, touchHookStates) => {
    const states = touchHookStates[0] as TouchHookState;

    const { deltaX, deltaY, direction } = states;

    const {
      swipeWidth,
      swipeHeight,
      edgeLeft,
      edgeRight,
      edgeTop,
      edgeBottom,

      startCurrentX,
      startCurrentY,
    } = positions.current;

    const { length } = images;

    if (scale !== 1) {
      const currentX = clamp(deltaX + startCurrentX, edgeLeft, edgeRight);
      const currentY = clamp(deltaY + startCurrentY, edgeTop, edgeBottom);
      raf(() => {
        setCurrentX(currentX);
        setCurrentY(currentY);
      });
      return;
    }

    if (moving) {
      let currentX = startCurrentX + deltaX;
      let currentY = startCurrentY + deltaY;
      let currentZ = 0;
      let currentOpacity = 1;
      let adjacentIndex = -1;
      let adjacentX = 0;

      switch (direction) {
        case 'vertical':
          currentX = 0;
          currentZ = -Math.abs(currentY);
          currentOpacity = clamp((swipeHeight + currentZ * 2) / swipeHeight, 0, 1);
          break;

        case 'horizontal':
          currentY = 0;
          // default:
          if (deltaX > 0) {
            adjacentIndex = getCorrectIndexInArray(length, currentIndex - 1);
            adjacentX = currentX - swipeWidth;
          } else {
            adjacentIndex = getCorrectIndexInArray(length, currentIndex + 1);
            adjacentX = currentX + swipeWidth;
          }
          break;
      }

      const outOfRange =
        !loop &&
        ((currentX > 0 && adjacentIndex > currentIndex) ||
          (currentX < 0 && adjacentIndex < currentIndex));
      if (outOfRange || adjacentIndex === currentIndex) {
        adjacentIndex = -1;
        adjacentX = 0;
      }

      raf(() => {
        setCurrentX(currentX);
        setCurrentY(currentY);
        setCurrentZ(currentZ);
        setCurrentOpacity(currentOpacity);
        setAdjacentIndex(adjacentIndex);
        setAdjacentX(adjacentX);
      });
    }
  };

  const moveEnd: TouchHookEventHandlerCallback<HTMLDivElement> = () => {
    raf(() => {
      setMoving(false);

      positions.current.startCurrentX = currentX;
      positions.current.startCurrentY = currentY;
    });
  };

  const switchImage = (): void => {
    const { swipeWidth } = positions.current;

    raf(() => {
      setMoving(false);
      setSwitching(true);

      setCurrentIndex(adjacentIndex);
      setCurrentY(0);
      setCurrentX(0);

      setAdjacentIndex(currentIndex);

      setAdjacentX(currentX > 0 ? swipeWidth : -swipeWidth);

      onChange?.(adjacentIndex);
    });

    swipeTimer.current = window.setTimeout(
      () =>
        raf(() => {
          setSwitching(false);
          setAdjacentIndex(-1);
          positions.current.startCurrentX = 0;
          positions.current.startCurrentY = 0;
        }),
      swipeDuration,
    );
  };

  const resetMove = (): void => {
    raf(() => {
      setCurrentX(0);
      setCurrentY(0);
      setCurrentZ(0);
      setCurrentOpacity(1);
      setAdjacentIndex(-1);
      setAdjacentX(0);
      setScale(1);

      positions.current.startCurrentX = 0;
      positions.current.startCurrentY = 0;
    });
  };

  const zoomStart: TouchHookEventHandlerCallback<HTMLDivElement> = () => {
    raf(() => {
      setMoving(false);
      setZooming(true);
      setScale(positions.current.startScale);
      positions.current.startCurrentX = currentX;
      positions.current.startCurrentY = currentY;
    });
  };

  const zoom: TouchHookEventHandlerCallback<HTMLDivElement> = (event, touchHookStates) => {
    const { startScale } = positions.current;

    const states = touchHookStates[0] as TouchHookState;

    const { startScaleDistance, scaleDistance } = states;

    const scale = clamp((startScale * scaleDistance) / startScaleDistance, minZoom!, maxZoom!);

    raf(() => {
      setScale(scale);
      onScale?.(scale);
    });
  };

  const zoomEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (event, touchHookStates) => {
    raf(() => {
      if (scale < 1) {
        toggleZoom();
      } else {
        setZooming(false);

        initPositions();

        const { edgeLeft, edgeRight, edgeTop, edgeBottom } = positions.current;

        const newCurrentX = clamp(currentX, edgeLeft, edgeRight);
        const newCurrentY = clamp(currentY, edgeTop, edgeBottom);
        raf(() => {
          setCurrentX(newCurrentX);
          setCurrentY(newCurrentY);

          positions.current.startCurrentX = newCurrentX;
          positions.current.startCurrentY = newCurrentY;
          positions.current.startScale = scale;
        });
      }
    });
  };

  const detectDoubleClick: TouchHookEventHandlerCallback<HTMLDivElement, boolean> = event => {
    if (event.touches.length !== 0) {
      return false;
    }
    const { lastClickTime, lastDoubleClickTime } = positions.current;
    const currentClickTime = Date.now();
    positions.current.lastClickTime = currentClickTime;
    if (lastDoubleClickTime && currentClickTime - lastDoubleClickTime < 200) {
      return false;
    }
    if (lastClickTime && currentClickTime - lastClickTime < 200) {
      positions.current.lastDoubleClickTime = currentClickTime;
      return true;
    }
    return false;
  };

  const afterTouchStart: TouchHookEventHandlerCallback<HTMLDivElement> = (
    event,
    touchHookStates,
  ) => {
    preventDefault(event as Event);

    if (toggleZooming || switching) {
      return;
    }

    if (event.touches.length === 2) {
      zoomStart(event, touchHookStates);
      return;
    }

    if (event.touches.length === 1) {
      moveStart();
    }
  };
  const afterTouchMove: TouchHookEventHandlerCallback<HTMLDivElement> = (
    event,
    touchHookStates,
  ) => {
    preventDefault(event as Event);

    if (toggleZooming || switching) {
      return;
    }
    if (event.touches.length === 2 && zooming) {
      zoom(event, touchHookStates);
      return;
    }

    if (event.touches.length === 1 && moving) {
      move(event, touchHookStates);
      return;
    }
  };
  const beforeTouchEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (
    event,
    touchHookStates,
  ) => {
    preventDefault(event as Event);

    if (toggleZooming || switching) {
      return;
    }

    if (detectDoubleClick(event, touchHookStates)) {
      closeTimer.current && window.clearTimeout(closeTimer.current);
      toggleZoom();
      return;
    }

    const { direction } = touchHookStates[0] as TouchHookState;

    if (scale !== 1) {
      if (zooming) {
        if (event.touches.length === 0) {
          zoomEnd(event, touchHookStates);
        }
        return;
      }

      if (moving && direction) {
        moveEnd(event, touchHookStates);
        return;
      }
    }

    if (
      adjacentIndex > -1 &&
      direction === 'horizontal' &&
      Math.abs(currentX) >= MIN_DISTANCE_SWITCH
    ) {
      switchImage();
      return;
    }
    if (direction === 'vertical') {
      onClose?.();
      return;
    }

    if (direction === undefined) {
      closeTimer.current = window.setTimeout(() => {
        onClose?.();
      }, DOUBLE_CLICK_DURATION);
    }
  };

  const [, , { onTouchStart, onTouchMove, onTouchEnd }] = useTouch({
    afterTouchStart,
    afterTouchMove,
    beforeTouchEnd,
  });

  const changing = switching || toggleZooming;

  const classes = addClass(bem([{ changing }]), className);
  const overlayClasses = bem('overlay');
  const itemClasses = bem('item');
  const imageClasses = bem('image');

  const currentItemStyle = {
    top: `${currentY}px`,
    left: `${currentX}px`,
    transitionDuration: (changing && `${swipeDuration}ms`) || undefined,
  };
  const adjacentItemStyle = {
    left: `${adjacentX}px`,
    transitionDuration: (changing && `${swipeDuration}ms`) || undefined,
  };

  const currentImageStyle = {
    opacity: (currentOpacity < 1 && currentOpacity) || undefined,
    transform:
      (scale !== 1 && `scale(${scale})`) ||
      (currentZ !== 0 && `perspective(400px) translate3d(0,0,${currentZ}px)`) ||
      undefined,
    transitionDuration: (toggleZooming && `${swipeDuration}ms`) || undefined,
  };

  const onCloseClick: MouseEventHandler<HTMLButtonElement> = () => {
    onClose?.();
  };

  const Close: RenderFunction<void> = () => {
    if (renderClose) {
      return renderClose({
        onClose,
        position: closeButtonPosition!,
      });
    }
    return (
      <button
        key="close"
        className={bem('close-button', closeButtonPosition)}
        onClick={onCloseClick}
      >
        <Icon className={bem('close-icon')} name="Close" />
      </button>
    );
  };
  const Indicators: RenderFunction<void> = () => {
    if (renderIndicators) {
      return renderIndicators({
        active: currentIndex,
      });
    }
    return (
      <div key="indicators" className={bem('indicators')}>
        {images!.map((image, index) => (
          <i key={image} className={bem('indicator-item', { active: index === currentIndex })} />
        ))}
      </div>
    );
  };

  const onPopupClick: PopupProps['onChange'] = () => {
    onClose?.();
  };

  const popupStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  };

  useEffect(() => {
    let containerDom: HTMLDivElement | null = null;
    if (value) {
      containerDom = containerRef.current!;
    }
    if (containerDom) {
      on(containerDom, 'touchstart', onTouchStart, false);
      on(containerDom, 'touchmove', onTouchMove, false);
      on(containerDom, 'touchend', onTouchEnd, false);
      on(containerDom, 'touchcancel', onTouchEnd, false);
    }
    return (): void => {
      if (containerDom) {
        off(containerDom, 'touchstart', onTouchStart);
        off(containerDom, 'touchmove', onTouchMove);
        off(containerDom, 'touchend', onTouchEnd);
        off(containerDom, 'touchcancel', onTouchEnd);
      }
    };
  }, [value]);

  return (
    <Popup
      value={value}
      onChange={onPopupClick}
      style={popupStyle}
      overlayClass={overlayClasses}
      onEnter={onOpen}
      onEntered={onOpened}
      onExit={onClose}
      onExited={onClosed}
    >
      <div className={classes}>
        <div key="swipe" ref={containerRef} className={bem('swipe')}>
          {images.map((image, index) => (
            <div
              key={image}
              className={itemClasses}
              style={
                (index === currentIndex && currentItemStyle) ||
                (index === adjacentIndex && adjacentItemStyle) ||
                undefined
              }
            >
              <img
                ref={index === currentIndex ? acitveSwipeRef : undefined}
                src={image}
                className={imageClasses}
                style={(index === currentIndex && currentImageStyle) || undefined}
              />
            </div>
          ))}
        </div>
        {!!showCloseButton && Close()}
        {!!showIndicators && Indicators()}
      </div>
    </Popup>
  );
};

ImagePreview.defaultProps = {
  startIndex: 0,
  swipeDuration: 200,
  loop: true,
  maxZoom: 3,
  minZoom: 1 / 3,
  closeOnPopstate: true,
  showCloseButton: false,
  closeButtonPosition: 'top-right',
  showIndicators: true,
};

ImagePreview.open = (props: ImagePreviewApiProps): ImagePreviewInstance | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const div: HTMLElement = document.createElement('div');

  function destroy(): void {
    ReactDOM.unmountComponentAtNode(div);
  }

  function render(renderProps: ImagePreviewProps): void {
    if (typeof window === 'undefined') {
      return;
    }

    ReactDOM.render(ReactDOM.createPortal(<ImagePreview {...renderProps} />, document.body), div);
  }

  function close(): void {
    render(
      Object.assign({}, props, {
        value: false,
        onClosed: destroy,
      }),
    );
  }

  const currentProps: ImagePreviewProps = Object.assign({}, props, {
    value: true,
    onClose: close,
  });

  render(currentProps);

  return {
    close,
  };
};

export default ImagePreview;

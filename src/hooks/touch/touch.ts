/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable indent */
/* eslint-disable semi */
import { TouchEvent as ReactTouchEvent, Dispatch, SetStateAction, useRef, useState } from 'react';

import { useRefCallback } from '../';

const DEFAULT_TOUCH_MOVE_THRESHOLD = 5;

export type TouchHookDirection = 'horizontal' | 'vertical';

export type TouchHookMoveDirections = 2 | 4 | 8;

export interface TouchHookState {
  /**
   * The coordinate on x-axis when touch started.
   */
  startX: number;

  /**
   * The coordinate on y-axis when touch started.
   */
  startY: number;

  /**
   * The distances from start on x-axis.
   */
  deltaX: number;

  /**
   * The distances from start on y-axis.
   */
  deltaY: number;

  /**
   * Time stamp in milliseconds.
   */
  timeStamp: number;

  /**
   * Speed of touch moving in pixels per millisecond on the x-axis.
   */
  speedX: number;

  /**
   * Speed of touch moving in pixels per millisecond on the y-axis.
   */
  speedY: number;

  /**
   * The direction of touch moving.
   */
  direction?: TouchHookDirection;

  /**
   * original distance to scale
   */
  startScaleDistance: number;

  /**
   * current scaled distance
   */
  scaleDistance: number;
}

export type TouchHookEventHandler<T = Element> = (event: ReactTouchEvent<T> | TouchEvent) => void;

export type TouchHookEventHandlerCallback<T = Element, TouchReturnValue = void> = (
  event: ReactTouchEvent<T> | TouchEvent, // supports both of react touch event and native touch event
  states: (TouchHookState | undefined)[],
) => TouchReturnValue;

/**
 * The collection of touch event handlers.
 */
export interface TouchHookEventHandlers<T = HTMLElement> {
  /**
   * The handler for touchstart event.
   */
  onTouchStart: TouchHookEventHandler<T>;

  /**
   * The handler for touchmove event.
   */
  onTouchMove: TouchHookEventHandler<T>;

  /**
   * The handler for touchend event.
   */
  onTouchEnd: TouchHookEventHandler<T>;
}

export interface TouchHookConfig<T = HTMLElement> {
  /**
   * Whether to disable touch event handlers or not.
   */
  disabled?: boolean;

  /**
   * The min distance for detecting touch move direction.
   * @default 5
   */
  touchMoveThreshold?: number;

  /**
   * Optional callback to inject, will be invoked at the start of `onTouchStart` handler.
   */
  beforeTouchStart?: TouchHookEventHandlerCallback<T>;

  /**
   * Optional callback to inject, will be invoked at the end of `onTouchStart` handler.
   */
  afterTouchStart?: TouchHookEventHandlerCallback<T>;

  /**
   * Optional callback to inject, will be invoked at the start of `onTouchMove` handler.
   */
  beforeTouchMove?: TouchHookEventHandlerCallback<T>;

  /**
   * Optional callback to inject, will be invoked at the end of `onTouchMove` handler.
   */
  afterTouchMove?: TouchHookEventHandlerCallback<T>;

  /**
   * Optional callback to inject, will be invoked at the start of `onTouchEnd` handler.
   */
  beforeTouchEnd?: TouchHookEventHandlerCallback<T>;

  /**
   * Optional callback to inject, will be invoked at the end of `onTouchEnd` handler.
   */
  afterTouchEnd?: TouchHookEventHandlerCallback<T>;
}

/**
 * Detects touch move direction by delta x and delta y.
 * @param x the delta x
 * @param y the delta y
 */
function detectDirection(x: number, y: number, threshold: number): TouchHookDirection | undefined {
  x = Math.abs(x);
  y = Math.abs(y);
  threshold = Math.abs(threshold);
  if (x <= y && y >= threshold) {
    return 'vertical';
  }
  if (x > y && x >= threshold) {
    return 'horizontal';
  }
  return undefined;
}

/**
 * get distance
 * @param touches
 * @returns
 */
function getScaleDistance(touches: TouchList | React.TouchList): number {
  return Math.sqrt(
    (touches[0].clientX - touches[1].clientX) ** 2 + (touches[0].clientY - touches[1].clientY) ** 2,
  );
}

/**
 * A general hook for processing touch. Supports multi touches.
 */
export function useTouch<T = HTMLElement>(
  config: TouchHookConfig<T> = {},
): [
  (TouchHookState | undefined)[],
  Dispatch<SetStateAction<(TouchHookState | undefined)[]>>,
  TouchHookEventHandlers<T>,
] {
  const {
    disabled,
    touchMoveThreshold = DEFAULT_TOUCH_MOVE_THRESHOLD,
    beforeTouchStart,
    afterTouchStart,
    beforeTouchMove,
    afterTouchMove,
    beforeTouchEnd,
    afterTouchEnd,
  } = config;
  const configRef = useRef<TouchHookConfig<T>>();
  configRef.current = config;

  const [touchHookStates, setTouchHookStates] = useState<(TouchHookState | undefined)[]>([]);

  const onTouchStart: TouchHookEventHandler<T> = event => {
    if (disabled) {
      return;
    }
    beforeTouchStart?.(event, touchHookStates);
    const newStateList: (TouchHookState | undefined)[] = [];
    const { timeStamp, touches } = event;
    for (let i = 0; i < touches.length; i++) {
      const { clientX, clientY } = touches[i];
      const oldState = touchHookStates[0];
      if (oldState) {
        newStateList[0] = oldState;
        continue;
      }
      newStateList[0] = {
        startX: clientX,
        startY: clientY,
        deltaX: 0,
        deltaY: 0,
        timeStamp,
        speedX: 0,
        speedY: 0,
        direction: undefined,
        startScaleDistance: 0,
        scaleDistance: 0,
      };
    }

    if (touches.length === 2) {
      newStateList[0]!.startScaleDistance = getScaleDistance(touches);
    }

    setTouchHookStates(newStateList);

    afterTouchStart?.(event, newStateList);
  };

  const onTouchMove: TouchHookEventHandler<T> = event => {
    if (disabled) {
      return;
    }
    beforeTouchMove?.(event, touchHookStates);
    const newStateList: TouchHookState[] = [];
    const { timeStamp, touches } = event;
    for (let i = 0; i < touches.length; i++) {
      const { clientX, clientY } = touches[i];
      const {
        startX,
        startY,
        deltaX: lastDeltaX,
        deltaY: lastDeltaY,
        timeStamp: lastTimeStamp,
        direction,
        scaleDistance,
        startScaleDistance,
      } = touchHookStates[0]!;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      const time = timeStamp - lastTimeStamp;
      const speedX = (deltaX - lastDeltaX) / time;
      const speedY = (deltaY - lastDeltaY) / time;
      newStateList[0] = {
        startX,
        startY,
        deltaX,
        deltaY,
        timeStamp,
        speedX,
        speedY,
        direction: direction || detectDirection(deltaX, deltaY, touchMoveThreshold),
        scaleDistance,
        startScaleDistance,
      };
    }

    if (touches.length === 2) {
      newStateList[0]!.scaleDistance = getScaleDistance(touches);
    }

    setTouchHookStates(newStateList);
    afterTouchMove?.(event, newStateList);
  };

  const onTouchEnd: TouchHookEventHandler<T> = event => {
    if (disabled) {
      return;
    }
    beforeTouchEnd?.(event, touchHookStates);
    const newStateList: (TouchHookState | undefined)[] = [];
    for (let i = 0; i < event.touches.length; i++) {
      const oldState = touchHookStates[0];
      newStateList[0] = oldState;
    }
    setTouchHookStates(newStateList);
    afterTouchEnd?.(event, newStateList);
  };

  return [
    touchHookStates,
    setTouchHookStates,
    {
      onTouchStart: useRefCallback(onTouchStart),
      onTouchMove: useRefCallback(onTouchMove),
      onTouchEnd: useRefCallback(onTouchEnd),
    },
  ];
}

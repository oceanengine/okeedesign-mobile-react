import React, { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import type { UnionOmit } from '../../utils/types';

import createBEM from '../../utils/create/createBEM';
import { StructTreeOption, StructTreeValue } from '../../utils/struct/tree';

import { TouchHookEventHandlerCallback, TouchHookState, useTouch } from '../../hooks';
import { off, on, preventDefault } from '../../utils/dom/event';

export interface PickerColumnSelf {
  value: StructTreeValue;
  options: StructTreeOption[];
  columnIndex: number;
  itemHeight: number;
  itemLength: number;
  onClick?(value: StructTreeValue, columnIndex: number): void;
  onInput?(value: StructTreeValue, columnIndex: number): void;
}

export type PickerColumnProps = UnionOmit<PickerColumnSelf, HTMLAttributes<HTMLDivElement>>;

const bem = createBEM('picker-column');

// 惯性滑动前提: 距离上个位置距离 > MOMENTUM_LIMIT_DISTANCE, 且时间 < MOMENTUM_LIMIT_TIME
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;

const BALANCE_DURATION = 0.3;
const INERTIA_DURATION = 0.3;

const FRICTION_COEFFICIENT = 5;

// https://stackoverflow.com/questions/21912684/how-to-get-value-of-translatex-and-translatey
function getElementTranslateY(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  const transform = style.transform || style.webkitTransform;

  let matrix = transform.match(/^matrix3d\((.+)\)$/);
  if (matrix) return parseFloat(matrix[1].split(', ')[13]);

  matrix = transform.match(/^matrix\((.+)\)$/);
  return matrix ? parseFloat(matrix[1].split(', ')[5]) : 0;
}

function PickerColumn(props: PickerColumnProps): JSX.Element {
  const { columnIndex, options, value, onClick, onInput, itemHeight, itemLength, ...attrs } = props;

  const activeIndex = Math.floor(itemLength / 2);

  if (!options.length) {
    console.error('Picker Column Options should not be empty');
  }

  const wrapper = useRef<HTMLDivElement>(null);

  const [distance, setDistance] = useState(() => {
    let seqIndex = options.map(item => item.value).indexOf(value);
    if (seqIndex === -1) seqIndex = 0;
    return (-seqIndex + activeIndex!) * itemHeight;
  });

  const centeredIndex = useMemo(() => {
    let seqIndex = options.map(item => item.value).indexOf(value);
    if (seqIndex === -1) seqIndex = 0;
    return seqIndex;
  }, [options, value]);

  const setGuardDistance = (theDistance: number): void => {
    if (theDistance > itemHeight * (activeIndex! + 1)) {
      setDistance(itemHeight * (activeIndex! + 1));
    } else if (theDistance < itemHeight * (activeIndex! - options.length)) {
      setDistance(itemHeight * (activeIndex! - options.length));
    } else {
      setDistance(theDistance);
    }
  };
  const [duration, setDuration] = useState(0);
  const lastDistance = useRef(distance);
  const lazyTrigger = useRef<(() => void) | null>();

  const scrollToPosition = (currentValue = value): void => {
    let seqIndex = options.map(item => item.value).indexOf(currentValue);
    if (seqIndex === -1) seqIndex = 0;
    setDistance((-seqIndex + activeIndex!) * itemHeight);
  };

  const lastTouchY = useRef(0);
  const lastTouchTime = useRef(0);
  const isMoving = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const afterTouchStart: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    const { startY } = states[0] as TouchHookState;

    if (isMoving.current) {
      const translateY = getElementTranslateY(wrapper.current!);
      setDistance(translateY);
      lastDistance.current = translateY;
    } else {
      lastDistance.current = distance;
    }

    lastTouchY.current = startY;
    lastTouchTime.current = Date.now();
    setDuration(0);
    lazyTrigger.current = null;
  };

  const afterTouchMove: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    const { direction, deltaY, startY } = states[0] as TouchHookState;
    if (direction === 'vertical') {
      const totalDistance = lastDistance.current + deltaY;
      setGuardDistance(totalDistance);
      isMoving.current = true;

      const now = Date.now();
      if (now - lastTouchTime.current > MOMENTUM_LIMIT_TIME) {
        lastTouchY.current = startY + deltaY;
        lastTouchTime.current = now;
      }
    }

    preventDefault(event as Event, true);
  };

  const beforeTouchEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    if (!isMoving.current) {
      return;
    }

    const { startY, deltaY } = states[0] as TouchHookState;

    const diffDuration = Date.now() - lastTouchTime.current;
    const diffTouchY = startY + deltaY - lastTouchY.current;
    const meetInertia =
      diffDuration <= MOMENTUM_LIMIT_TIME && Math.abs(diffTouchY) >= MOMENTUM_LIMIT_DISTANCE;

    let movement = 0;
    if (meetInertia) {
      movement =
        (FRICTION_COEFFICIENT * (diffTouchY / diffDuration) * Math.abs(diffTouchY / diffDuration)) /
        INERTIA_DURATION;
    }

    const gridCount = distance / itemHeight - activeIndex! + movement;
    const approachIndex = Math.floor(gridCount + 0.5);
    let finalIndex = Math.abs(approachIndex);
    finalIndex = finalIndex > options.length - 1 ? options.length - 1 : finalIndex;
    if (gridCount > 0) {
      finalIndex = 0;
    }
    const finalValue = options[finalIndex].value;

    setDuration(BALANCE_DURATION);
    scrollToPosition(finalValue);
    lazyTrigger.current = function (): void {
      onClick?.(finalValue, columnIndex);
      onInput?.(finalValue, columnIndex);
      isMoving.current = false;
      setDuration(0);
    };
  };

  const onTransitionEnd = (): void => {
    if (lazyTrigger.current) {
      lazyTrigger.current();
      lazyTrigger.current = null;
    }
  };

  const [, , { onTouchStart, onTouchMove, onTouchEnd }] = useTouch({
    afterTouchStart,
    afterTouchMove,
    beforeTouchEnd,
  });

  useEffect(() => {
    scrollToPosition();
  }, [value, options]);

  useEffect(() => {
    const listDom = listRef.current!;
    on(listDom, 'touchstart', onTouchStart, false);
    on(listDom, 'touchmove', onTouchMove, false);
    on(listDom, 'touchend', onTouchEnd, false);
    return (): void => {
      off(listDom, 'touchstart', onTouchStart);
      off(listDom, 'touchmove', onTouchMove);
      off(listDom, 'touchend', onTouchEnd);
    };
  }, []);

  const onItemClick = (itemValue: StructTreeValue): void => {
    scrollToPosition(itemValue);
    setDuration(BALANCE_DURATION);
    lazyTrigger.current = function (): void {
      onClick?.(itemValue, columnIndex);
      onInput?.(itemValue, columnIndex);
      isMoving.current = false;
      setDuration(0);
    };
  };

  const List = (): JSX.Element[] => {
    return options.map((option, optionIndex) => {
      return (
        <div
          className={bem('item', [{ active: optionIndex === centeredIndex }])}
          key={option.value?.toString()}
          onClick={(): void => onItemClick(option.value)}
          style={{ height: itemHeight }}
          {...attrs}
        >
          {option.label}
        </div>
      );
    });
  };

  const containerStyle = {
    height: itemLength * itemHeight + 'px',
  };
  const style = {
    transitionDuration: `${duration}s`,
    transitionProperty: duration ? 'all' : 'none',
    transform: `translate3d(0, ${distance}px, 0)`,
  };
  return (
    <div ref={listRef} className={bem()} style={containerStyle}>
      <div ref={wrapper} className={bem('wrapper')} style={style} onTransitionEnd={onTransitionEnd}>
        {List()}
      </div>
    </div>
  );
}

PickerColumn.defaultProps = {};

export default PickerColumn;

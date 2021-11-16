import { MutableRefObject, useMemo, useRef } from 'react';
import { clamp } from '../../utils/math';
import { findClosestNumber } from '../../utils/struct/array';
import { TouchHookEventHandlerCallback, TouchHookState, useTouch } from '../touch';

export type UseDragProgressProps = {
  min: number;
  max: number;

  value: number;

  step?: number | null;
  marks?: boolean | Record<number, string | number>;

  disabled?: boolean;

  trackRef: MutableRefObject<HTMLDivElement | null>;

  onDragStart?: (value: number) => void;
  onDragEnd?: (value: number) => void;
  onChange?: (value: number) => void;
};

export type UseDragProgressReturnType = {
  listeners: Record<string, (...args: any[]) => void>;
};

export function useDragProgress(props: UseDragProgressProps): UseDragProgressReturnType {
  const {
    value,
    min,
    max,

    step = 1,
    marks,

    disabled = false,

    trackRef,

    onChange,
    onDragStart,
    onDragEnd,
  } = props;

  const initialValue = useRef<number>(value);

  const trackWidth = useRef<number>(0);

  const afterTouchStart: TouchHookEventHandlerCallback<HTMLDivElement> = () => {
    if (disabled) {
      return;
    }

    onDragStart?.(value);

    initialValue.current = value;

    if (trackRef.current) {
      trackWidth.current = trackRef.current.clientWidth;
    }
  };

  const afterTouchMove: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    if (disabled) {
      return;
    }

    const { deltaX } = states[0] as TouchHookState;

    const width = trackWidth.current;

    let deltaValue = 0;
    let newValue = initialValue.current;
    if (width) {
      if (step) {
        deltaValue = Math.round(((deltaX / width) * (max - min)) / step) * step;
        newValue = clamp(initialValue.current + deltaValue, min, max);
      } else if (typeof marks !== 'boolean') {
        const markKeys = Object.keys(marks as Record<string, any>).map(v => parseFloat(v));
        deltaValue = Math.round((deltaX / width) * (max - min));
        newValue = clamp(initialValue.current + deltaValue, min, max);
        newValue = findClosestNumber(newValue, markKeys);
      }
    }

    onChange?.(newValue);
  };

  const beforeTouchEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    if (disabled) {
      return;
    }

    const { deltaX } = states[0] as TouchHookState;

    const width = trackWidth.current;

    let deltaValue = 0;
    let newValue = initialValue.current;
    if (width) {
      if (step) {
        deltaValue = Math.round(((deltaX / width) * (max - min)) / step) * step;
        newValue = clamp(initialValue.current + deltaValue, min, max);
      } else if (typeof marks !== 'boolean') {
        const markKeys = Object.keys(marks as Record<string, any>).map(v => parseFloat(v));
        deltaValue = Math.round((deltaX / width) * (max - min));
        newValue = clamp(initialValue.current + deltaValue, min, max);
        newValue = findClosestNumber(newValue, markKeys);
      }
    }

    onChange?.(newValue);

    onChange?.(newValue);
    onDragEnd?.(newValue);
  };

  const [, , { onTouchStart, onTouchEnd, onTouchMove }] = useTouch({
    afterTouchStart,
    afterTouchMove,
    beforeTouchEnd,
  });

  const listeners = useMemo(() => {
    return {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  return {
    listeners,
  };
}

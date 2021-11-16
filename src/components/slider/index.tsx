import React, { MouseEventHandler, MutableRefObject, useMemo, useRef } from 'react';
import { useControlled, useDragProgress, useRefCallback } from '../../hooks';

import createBEM from '../../utils/create/createBEM';
import { clamp } from '../../utils/math';
import { findClosestNumber } from '../../utils/struct/array';
import { RenderContent } from '../../utils/types';

export type SliderBaseProps<T = number | [number, number]> = {
  value?: T;
  defaultValue?: T;

  max?: number;
  min?: number;

  range?: boolean;

  step?: number | null;

  disabled?: boolean;

  renderIndicator?: RenderContent<number>;

  ticks?: boolean;
  marks?: boolean | Record<number, string | number>;

  onChange?: (value: T) => void;
  onDragStart?: (value: T) => void;
  onDragEnd?: (value: T) => void;
};

export type SliderProps = {} & SliderBaseProps;

type SliderFillPosition = {
  start: number;
  width: number;
};

type SliderIndicatorPosition = string;

type SliderIndicatorProps = {
  trackRef: MutableRefObject<HTMLDivElement | null>;
  position: SliderIndicatorPosition;
} & Pick<
  SliderBaseProps<number>,
  | 'value'
  | 'min'
  | 'max'
  | 'disabled'
  | 'onChange'
  | 'onDragStart'
  | 'onDragEnd'
  | 'step'
  | 'marks'
  | 'renderIndicator'
>;

const bem = createBEM('slider');

function computePercentage(value: number, min: number, max: number): number {
  return Math.round(((value - min) / (max - min)) * 100);
}

function checkValueActive(
  value: number,
  range: boolean,
  activeValue: number | [number, number],
): boolean {
  if (range) {
    return (
      value >= (activeValue as [number, number])[0] && value <= (activeValue as [number, number])[1]
    );
  }
  return value <= (activeValue as number);
}

function SliderIndicator(props: SliderIndicatorProps): JSX.Element {
  const {
    value,
    min,
    max,
    step,
    marks,
    disabled,
    position,
    trackRef,

    renderIndicator,

    onChange,
    onDragStart,
    onDragEnd,
  } = props;

  const { listeners } = useDragProgress({
    min: min!,
    max: max!,
    trackRef,
    value: value!,
    step,
    marks,
    disabled,
    onDragStart,
    onDragEnd,
    onChange,
  });

  const Indicator = useMemo(() => {
    if (renderIndicator) {
      return typeof renderIndicator === 'function' ? renderIndicator(value!) : renderIndicator;
    }
    return <div className={bem('indicator')}></div>;
  }, [value, renderIndicator]);

  return (
    <div
      className={bem('indicator-container')}
      style={{
        left: position,
      }}
      {...listeners}
    >
      {Indicator}
    </div>
  );
}

function Slider(props: SliderProps): JSX.Element {
  const {
    min = 0,
    max = 100,
    range = false,
    value,
    defaultValue = range ? [min, min] : min,
    disabled = false,
    step = 1,

    renderIndicator,

    ticks,
    marks = false,

    onChange: propsOnChange,
    onDragEnd,
    onDragStart,
  } = props;

  const [activeValue, setActiveValue] = useControlled<number | [number, number]>(
    value,
    defaultValue,
  );

  const trackRef = useRef<HTMLDivElement>(null);

  const onChange = useRefCallback((newValue: number | [number, number]) => {
    if (typeof value === 'undefined') {
      setActiveValue(newValue);
    }
    propsOnChange?.(newValue);
  });

  const onBarClick: MouseEventHandler<HTMLDivElement> = event => {
    if (disabled) return;

    const { clientX } = event;

    let width = 360;
    let left = 0;
    if (trackRef.current) {
      width = trackRef.current.clientWidth;
      left = trackRef.current.getBoundingClientRect().left;
    }

    let newValue = 0;
    if (width) {
      if (step) {
        newValue = Math.round((((clientX - left) / width) * (max - min)) / step) * step + min;
      } else if (typeof marks !== 'boolean') {
        const markKeys = Object.keys(marks as Record<string, any>).map(v => parseFloat(v));
        newValue = ((clientX - left) / width) * (max - min) + min;
        newValue = findClosestNumber(newValue, markKeys);
      }
    }

    newValue = clamp(newValue, min, max);

    if (range) {
      const formerDelta = Math.abs((activeValue as [number, number])[0] - newValue);
      const latterDelta = Math.abs((activeValue as [number, number])[1] - newValue);
      if (formerDelta < latterDelta) {
        onChange([newValue, (activeValue as [number, number])[1]]);
      } else {
        onChange([(activeValue as [number, number])[0], newValue]);
      }
    } else {
      onChange(newValue);
    }
  };

  const fillPosition = useMemo<SliderFillPosition>(() => {
    let start = min;
    let width = min;

    if (range) {
      start = Math.round((((activeValue as [number, number])[0] - min) / (max - min)) * 100);
      width = Math.round(
        (((activeValue as [number, number])[1] - (activeValue as [number, number])[0]) /
          (max - min)) *
          100,
      );
    } else {
      start = 0;
      width = Math.round((((activeValue as number) - min) / (max - min)) * 100);
    }

    return {
      start: start,
      width: width,
    };
  }, [activeValue, min, max, range]);

  const indicatorPositions = useMemo<SliderIndicatorPosition[]>(() => {
    if (range) {
      return (activeValue as [number, number]).map(item => {
        return Math.round(((item - min) / (max - min)) * 100) + '%';
      });
    }
    return [Math.round((((activeValue as number) - min) / (max - min)) * 100) + '%'];
  }, [activeValue, min, max, range]);

  const fillStyle = useMemo(() => {
    return {
      left: fillPosition.start + '%',
      width: fillPosition.width + '%',
    };
  }, [fillPosition]);

  const lastValueRef = useRef(activeValue);

  const Ticks = useMemo(() => {
    if (ticks) {
      const items: JSX.Element[] = [];

      if (marks && typeof marks !== 'boolean') {
        Object.keys(marks).forEach(key => {
          const markKey = parseFloat(key);
          if (markKey < min || markKey > max) return;
          const position = computePercentage(markKey, min, max);
          const style = {
            left: position + '%',
          };
          items.push(
            <div
              key={markKey}
              className={bem('tick', [{ active: checkValueActive(markKey, range, activeValue) }])}
              style={style}
            ></div>,
          );
        });
      } else {
        let currentValue = min;
        do {
          const position = computePercentage(currentValue, min, max);
          const style = {
            left: position + '%',
          };
          items.push(
            <div
              key={currentValue}
              className={bem('tick', [
                { active: checkValueActive(currentValue, range, activeValue) },
              ])}
              style={style}
            ></div>,
          );
          currentValue += step!;
        } while (currentValue <= max);
      }

      return <div className={bem('ticks')}>{items}</div>;
    }
    return null;
  }, [activeValue, range, min, max, step, ticks, marks]);

  const Indicators = indicatorPositions.map((position, index) => {
    return (
      <SliderIndicator
        key={index}
        position={position}
        trackRef={trackRef}
        disabled={disabled}
        value={range ? (activeValue as [number, number])[index] : (activeValue as number)}
        min={min}
        max={max}
        step={step}
        marks={marks}
        renderIndicator={renderIndicator}
        onChange={(newValue): void => {
          if (range) {
            const former = Math.min(
              newValue,
              (lastValueRef.current as [number, number])[1 - index],
            );
            const latter = Math.max(
              newValue,
              (lastValueRef.current as [number, number])[1 - index],
            );
            onChange([former, latter]);
          } else {
            if (newValue === activeValue) return;
            onChange(newValue);
          }
        }}
        onDragStart={(): void => {
          lastValueRef.current = activeValue;
          onDragStart?.(activeValue);
        }}
        onDragEnd={(v): void => {
          if (range) {
            const former = Math.min(v, (lastValueRef.current as [number, number])[1 - index]);
            const latter = Math.max(v, (lastValueRef.current as [number, number])[1 - index]);
            onDragEnd?.([former, latter]);
          } else {
            onDragEnd?.(v);
          }
        }}
      />
    );
  });

  const Marks = useMemo(() => {
    if (marks) {
      const items: JSX.Element[] = [];

      if (typeof marks !== 'boolean') {
        Object.keys(marks).forEach(key => {
          const markKey = parseFloat(key);
          if (markKey < min || markKey > max) return;
          const position = computePercentage(markKey, min, max);
          const style = {
            left: position + '%',
          };
          items.push(
            <div key={markKey} className={bem('mark')} style={style}>
              {marks[markKey]}
            </div>,
          );
        });
      } else {
        let currentValue = min;
        do {
          const position = computePercentage(currentValue, min, max);
          const style = {
            left: position + '%',
          };
          items.push(
            <div key={currentValue} className={bem('mark')} style={style}>
              {currentValue}
            </div>,
          );
          currentValue += step!;
        } while (currentValue <= max);
      }

      return <div className={bem('marks')}>{items}</div>;
    }
    return null;
  }, [min, max, step, marks]);

  return (
    <div className={bem([{ range, disabled, 'has-marks': marks }])}>
      <div className={bem('container')} onClick={onBarClick}>
        <div className={bem('track')} ref={trackRef}>
          <div className={bem('fill')} style={fillStyle}></div>
          {Indicators}
          {Ticks}
          {Marks}
        </div>
      </div>
    </div>
  );
}

export default Slider;

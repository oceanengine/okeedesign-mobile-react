/* eslint-disable semi */
import React, { AllHTMLAttributes, FC, CSSProperties } from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';
import { clamp } from '../../utils/math';
import { RenderContent } from '../../utils/types';

const bem = createBEM('progress');

export type ProgressStrokeHeight = 'normal' | 'thick';

export interface ProgressProps extends AllHTMLAttributes<HTMLDivElement> {
  /**
   * The percentage value of current progress, from 0 through 100, shows in pivot.
   */
  percentage: number;

  /**
   * The height of progress bar.
   */
  barHeight?: number;

  /**
   * The background color of progress bar.
   */
  barColor?: string;

  /**
   * The background color of track.
   */
  trackColor?: string;

  /**
   * Uses inactive (gray) style.
   */
  inactive?: boolean;

  /**
   * Show progress text float overlay the progress bar.
   */
  pivotFloat?: boolean;

  /**
   * Customize pivot content.
   */
  pivot?: RenderContent<ProcessPivotProps>;

  /**
   * The background color of pivot.
   */
  pivotColor?: string;

  /**
   * The text color of pivot.
   */
  textColor?: string;
}

export interface ProcessPivotProps {
  percentage: number;
  inactive: boolean;
}

const Progress: FC<ProgressProps> = (props: ProgressProps) => {
  const {
    className,
    percentage,
    barHeight,
    barColor,
    trackColor,
    inactive = false,
    pivotFloat = false,
    pivot,
    pivotColor,
    textColor,
    ...attrs
  } = props;

  const finalPercentage = clamp(percentage, 0, 100);
  const finalPercentageInt = Math.round(finalPercentage);
  const finalBarColor = (!inactive && barColor) || undefined;
  const finalPivotColor = (!inactive && pivotColor) || finalBarColor || undefined;
  const complete = !inactive && finalPercentageInt === 100;

  const trackStyle: CSSProperties = {
    backgroundColor: trackColor,
  };
  const barStyle: CSSProperties = {
    width: `${finalPercentage}%`,
    backgroundColor: finalBarColor,
  };
  if (barHeight) {
    trackStyle.height = `${barHeight}px`;
    const radius = `${barHeight / 2}px`;
    trackStyle.borderRadius = radius;
    barStyle.borderRadius = radius;
  }

  const pivotStyle: CSSProperties = {};
  if (pivotFloat) {
    pivotStyle.color = textColor;
    pivotStyle.backgroundColor = finalPivotColor;
    pivotStyle.transform = `translate3d(${-finalPercentage}%, -50%, 0)`;
  }

  const pivotProps: ProcessPivotProps = {
    percentage: finalPercentage,
    inactive,
  };

  const classes = bem({
    'pivot-float': pivotFloat,
    inactive,
    complete,
  });

  const elemPivot = (
    <div className={bem('pivot')} style={pivotStyle}>
      {typeof pivot === 'function' ? pivot(pivotProps) : pivot ?? `${finalPercentageInt}%`}
    </div>
  );

  return (
    <div className={addClass(classes, className)} {...attrs}>
      <div className={bem('track')} style={trackStyle}>
        <div className={bem('bar')} style={barStyle}>
          {pivotFloat && elemPivot}
        </div>
      </div>
      {!pivotFloat && elemPivot}
    </div>
  );
};

Progress.displayName = 'Progress';

export default Progress;

/* eslint-disable indent */
/* eslint-disable semi */
import React, { AllHTMLAttributes, FC, PropsWithChildren } from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

const bem = createBEM('badge');

export interface BadgeProps extends AllHTMLAttributes<HTMLDivElement> {
  /**
   * The number or text content.
   */
  value?: number | string;

  /**
   * The max limit when value type is number.
   */
  max?: number;

  /**
   * Display as a dot.
   * @default false
   */
  isDot?: boolean;
}

const Badge: FC<BadgeProps> = (props: PropsWithChildren<BadgeProps>) => {
  const { className, style, value, max, isDot, children, ...attrs } = props;

  const info = isDot ? '' : typeof value === 'number' && max && max < value ? `${max}+` : value;

  const classes = bem([{ 'is-dot': isDot }]);

  return (
    <div className={addClass(classes, className)} style={style} {...attrs}>
      {children}
      <sup className={bem('info')}>{info}</sup>
    </div>
  );
};

Badge.displayName = 'Badge';

export default Badge;

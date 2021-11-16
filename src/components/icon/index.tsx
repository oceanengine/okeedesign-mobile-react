/**
 * Component Icon
 */
import React, { FC, CSSProperties, HTMLAttributes } from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

import { value2DomUnit } from '../../utils/dom/unit';

import { allIcons } from './all';

import type { IconMap } from './all';

export type { IconMap };

export type IconName = keyof IconMap;

const bem = createBEM('icon');

export interface IconProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  style?: CSSProperties;

  /**
   * Necessary
   */
  name: IconName;

  /**
   * size.
   */
  size?: string | number;

  /**
   * fill color
   */
  fill?: string;

  /**
   * stroke color
   */
  stroke?: string;
}

const Icon: FC<IconProps> = (props: IconProps) => {
  const { className, style = {}, name, size, fill, stroke, ...attributes } = props;

  if (size) {
    style.width = value2DomUnit(size);
    style.height = value2DomUnit(size);
  }

  if (fill) {
    style.fill = fill;
  }
  if (stroke) {
    style.stroke = stroke;
  }

  return (
    <i
      className={addClass(bem(), className)}
      style={style}
      dangerouslySetInnerHTML={{
        __html: allIcons[name],
      }}
      {...attributes}
    />
  );
};

Icon.displayName = 'Icon';

export default Icon;

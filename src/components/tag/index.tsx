/* eslint-disable semi */
import React, { FC, PropsWithChildren, CSSProperties, MouseEventHandler } from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';
import { BORDER_SURROUND } from '../../utils/const';

const bem = createBEM('tag');

export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type TagSize = 'small' | 'normal' | 'large';

export interface TagProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The semantic color of tag.
   * @default 'default'
   */
  type?: TagType;

  /**
   * The size of tag.
   * @default 'small'
   */
  size?: TagSize;

  /**
   * Use plain style or not.
   * @default false
   */
  plain?: boolean;

  /**
   * Use round corner style or not.
   * @default false
   */
  round?: boolean;

  /**
   * Customize color to tag. Format: CSS color string.
   */
  color?: string;

  /**
   * Customize text color to tag, has higher priority than the prop color.
   */
  textColor?: string;

  /**
   * Optional callback when tag is clicked.
   */
  onClick?: MouseEventHandler<HTMLSpanElement>;

  // /**
  //  * Optional callback when tag is closed.
  //  */
  // onClose?: MouseEventHandler<HTMLSpanElement>;
}

const Tag: FC<TagProps> = (props: PropsWithChildren<TagProps>) => {
  const {
    className,
    style = {},
    size = 'small',
    type = 'default',
    plain,
    round,
    color,
    textColor,
    onClick,
    children,
  } = props;

  const classes = bem([
    size,
    type,
    {
      plain,
      round,
    },
  ]);

  if (color) {
    if (plain) {
      style.color = textColor;
    } else {
      style.color = '#fff';
      style.backgroundColor = color;
    }
  }
  if (textColor) {
    style.color = textColor;
  }

  return (
    <span
      className={addClass(classes, className, plain && BORDER_SURROUND)}
      style={style}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

Tag.displayName = 'Tag';

export default Tag;

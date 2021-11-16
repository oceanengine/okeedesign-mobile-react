/* eslint-disable semi */
import React, { FC, PropsWithChildren, MouseEventHandler, CSSProperties } from 'react';

import createBEM from '../../utils/create/createBEM';
import { RenderFunction } from '../../utils/types';

import Icon from '../icon';
import type { IconName } from '../icon';

const bem = createBEM('header');

export interface HeaderContextState {
  type?: HeaderType;
}

export const HeaderContext = React.createContext<HeaderContextState>({});

export type HeaderType = 'default' | 'primary';

export interface HeaderProps {
  className?: string;
  style?: CSSProperties;

  /**
   * Style type.
   * @default 'default'
   */
  type?: HeaderType;

  /**
   * The title of header, wil be replaced by children.
   */
  title?: string | JSX.Element | RenderFunction;

  /**
   * Show left arrow or not.
   * @default true
   */
  leftArrow?: boolean;

  /**
   * Custom content at left side, replaces the left arrow..
   */
  left?: string | JSX.Element | RenderFunction;

  /**
   * Custom content at right side.
   */
  right?: string | JSX.Element | RenderFunction;

  /**
   * Show border or not when type is 'default'
   * @default true
   */
  border?: boolean;

  /**
   * Set position to fixed top or not.
   * @default false
   */
  fixed?: boolean;

  zIndex?: number;

  maxZIndex?: boolean;

  /**
   * Optional callback when left content (or left arrow) is clicked.
   */
  onClickLeft?: MouseEventHandler<HTMLDivElement>;

  /**
   * Optional callback when right content is clicked.
   */
  onClickRight?: MouseEventHandler<HTMLDivElement>;
}

/**
 * The header navigator.
 */
const Header: FC<HeaderProps> = (props: PropsWithChildren<HeaderProps>) => {
  const {
    className,
    style,
    type,
    title,
    leftArrow = true,
    left,
    right,
    border,
    fixed,
    onClickLeft,
    onClickRight,
    children,
  } = props;

  let classes = bem([type, { border, fixed }]);
  if (className) {
    classes = `${classes} ${className}`;
  }

  const centerElem = children || (
    <div className={bem('title')}>{typeof title === 'function' ? title({}) : title}</div>
  );

  return (
    <div className={classes} style={style}>
      <div className={bem('left')} onClick={onClickLeft}>
        {(!!left && (typeof left === 'function' ? left({}) : left)) ||
          (leftArrow && <Icon className={bem('icon')} name={'ArrowLeft' as IconName} />)}
      </div>
      <HeaderContext.Provider value={{ type }}>{centerElem}</HeaderContext.Provider>
      <div className={bem('right')} onClick={onClickRight}>
        {typeof right === 'function' ? right({}) : right}
      </div>
    </div>
  );
};

export default Header;

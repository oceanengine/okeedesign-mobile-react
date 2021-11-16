/* eslint-disable semi */
import React, {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  TouchEventHandler,
  CSSProperties,
} from 'react';

import createBEM from '../../utils/create/createBEM';
import { RenderFunction } from '../../utils/types';
import Icon from '../icon';
import type { IconName } from '../icon';
import { upperCamelize } from '../../utils/format/string';

const bemCell = createBEM('cell');

export type CellSize = 'large' | 'normal' | 'small';

export type CellArrowDirection = 'up' | 'down' | 'right' | 'left';

export interface CellProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The size of cell.
   * @default 'normal'
   */
  size?: CellSize;

  /**
   * The title.
   */
  title?: string | JSX.Element | RenderFunction;

  /**
   * The content.
   */
  value?: string | JSX.Element | RenderFunction;

  /**
   * Display long content under the title
   * @default false
   */
  longContent?: boolean;

  /**
   * Customize the icon at the left side.
   */
  icon?: JSX.Element | RenderFunction;

  /**
   * Customize the icon at the right side, replaces the arrow icon.
   */
  rightIcon?: JSX.Element | RenderFunction;

  /**
   * The direction of the arrow.
   * @default 'right'
   */
  arrowDirection?: CellArrowDirection;

  /**
   * Show the arrow icon and enable feedback for click.
   * @default false
   */
  isLink?: boolean;

  // /**
  //  * Selected status
  //  * @default false
  //  */
  // selected?: boolean;

  // /**
  //  * Error status
  //  * @default false
  //  */
  // error?: boolean;

  /**
   * Enable feedback for click.
   * @default false
   */
  clickable?: boolean;

  /**
   * Display dividers between multi cells or not.
   * @default false
   */
  border?: boolean;

  /**
   * Optional callback when cell is clicked.
   */
  onClick?: MouseEventHandler<HTMLDivElement>;

  /**
   * Optional callback when cell is touched.
   */
  onTouchStart?: TouchEventHandler<HTMLDivElement>;
}

const Cell: FC<CellProps> = (props: CellProps) => {
  const {
    className,
    style,
    size = 'normal',
    title,
    value: content,
    longContent,
    icon: leftIcon,
    rightIcon,
    arrowDirection = 'right',
    isLink,
    // selected,
    // error,
    clickable,
    border,
    onClick,
    onTouchStart,
  } = props;

  let classes = bemCell([
    size,
    {
      'long-content': longContent,
      'is-link': isLink,
      // selected,
      // error,
      clickable: isLink || clickable,
      border,
    },
  ]);
  if (className) {
    classes = `${classes} ${className}`;
  }

  const leftIconElem = !!leftIcon && (
    <i className={bemCell('icon')}>{typeof leftIcon === 'function' ? leftIcon({}) : leftIcon}</i>
  );
  const rightIconElem =
    (!!rightIcon && (
      <i className={bemCell('icon')}>
        {typeof rightIcon === 'function' ? rightIcon({}) : rightIcon}
      </i>
    )) ||
    (isLink && (
      <Icon
        name={upperCamelize(`arrow-${arrowDirection}`) as IconName}
        className={bemCell('right-icon')}
      />
    ));

  const titleElem = !!title && (
    <div className={bemCell('title')}>{typeof title === 'function' ? title({}) : title}</div>
  );
  const contentElem = !!content && (
    <div className={bemCell('content')}>
      {typeof content === 'function' ? content({}) : content}
    </div>
  );

  return (
    <div className={classes} style={style} onClick={onClick} onTouchStart={onTouchStart}>
      {leftIconElem}
      {titleElem}
      {contentElem}
      {rightIconElem}
    </div>
  );
};

Cell.displayName = 'Cell';

const bemCellGroup = createBEM('cell-group');

export interface CellGroupProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The title of the group.
   */
  title?: string | JSX.Element | RenderFunction;

  /**
   * Display dividers between multi groups or not.
   * @default true
   */
  border?: boolean;
}

const CellGroup: FC<CellGroupProps> = (props: PropsWithChildren<CellGroupProps>) => {
  const { className, style, title, border = true, children } = props;

  let classes = bemCellGroup([
    {
      border,
    },
  ]);

  if (className) {
    classes = `${classes} ${className}`;
  }

  const titleElem = !!title && <div className={bemCellGroup('title')}>{title}</div>;

  return (
    <div className={classes} style={style}>
      {titleElem}
      {children}
    </div>
  );
};

CellGroup.displayName = 'CellGroup';

export interface Cell extends FC<CellProps> {
  readonly Group: FC<CellGroupProps>;
}

const component: Cell = Cell as any;
(component as any).Group = CellGroup;

export default component;

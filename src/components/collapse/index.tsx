/* eslint-disable semi */
import React, {
  FC,
  PropsWithChildren,
  CSSProperties,
  MouseEventHandler,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

import Cell, { CellProps } from '../cell';

const bemCollapse = createBEM('collapse');

export type CollapseDirections = 'up' | 'down';
export interface CollapseContextState {
  direction: CollapseDirections;
  activeNames: (string | number)[];
  change: (name: string | number) => void;
  border: boolean;
}

export const CollapseContext = createContext<CollapseContextState>({
  activeNames: [],
  direction: 'down',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  change: name => {},
  border: false,
});

export interface CollapseProps {
  className?: string;

  style?: CSSProperties;

  /**
   * The id name of expanded item, has array type when is not accordion mode.
   */
  value: undefined | string | number | (string | number)[];

  direction?: CollapseDirections;

  /**
   * Use accordion mode or not, can only expand single item in this mode.
   * @default false
   */
  accordion?: boolean;

  /**
   * Show border or not.
   * @default true
   */
  border?: boolean;

  /**
   * Required callback when an item is expanded or collapsed.
   */
  onChange: (newValue: undefined | string | number | (string | number)[]) => void;
}

function normalizeValue(
  value: undefined | string | number | (string | number)[],
): (string | number)[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }
  return [];
}

const Collapse: FC<CollapseProps> = (props: PropsWithChildren<CollapseProps>) => {
  const {
    className,
    style,
    value,
    accordion,
    border = true,
    direction = 'down',
    onChange,
    children,
  } = props;

  const [activeNames, setActiveNames] = useState(normalizeValue(value));
  const [itemBorder, setItemBorder] = useState(border);
  useEffect(() => {
    setActiveNames(normalizeValue(value));
    setItemBorder(border);
  }, [value, accordion, border]);

  const change = (name: string | number): void => {
    const expanded = activeNames.includes(name);
    let newValue: typeof value;
    if (accordion) {
      newValue = expanded ? undefined : name;
    } else {
      newValue = expanded ? activeNames.filter(n => n !== name) : [...activeNames, name];
    }
    onChange(newValue);
  };

  const classes = bemCollapse([direction, { border }]);

  return (
    <div className={addClass(classes, className)} style={style}>
      <CollapseContext.Provider
        value={{
          activeNames,
          change,
          border: itemBorder,
          direction,
        }}
      >
        {children}
      </CollapseContext.Provider>
    </div>
  );
};

Collapse.displayName = 'Collapse';

const bemCollapseItem = createBEM('collapse-item');

export interface CollapseItemProps extends CellProps {
  arrowDirection?: never;

  /**
   * @default true
   */
  isLink?: boolean;

  /**
   * The td name of collapse item
   */
  name: string | number;

  /**
   * Set current item disabled.
   */
  disabled?: boolean;

  /**
   * Text content of collapse item, can be replaced by children.
   */
  message?: string;
}

const CollapseItem: FC<CollapseItemProps> = (props: PropsWithChildren<CollapseItemProps>) => {
  const {
    className,
    style,
    name,
    disabled,
    isLink = true,
    onClick,
    message,
    children,
    ...cellProps
  } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { activeNames, change, border, direction } = useContext(CollapseContext);
  const expanded = activeNames.includes(name);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);

  const onTitleClick: MouseEventHandler<HTMLDivElement> = event => {
    if (!disabled) {
      change(name);
      if (onClick) {
        onClick(event);
      }
    }
  };

  const setWrapper = (): void => {
    if (!expanded) {
      setWrapperHeight(0);
      return;
    }
    const clientHeight = contentRef.current?.clientHeight;
    if (clientHeight) {
      setWrapperHeight(clientHeight);
    }
  };

  useEffect(setWrapper, [expanded, children]);

  const lastExpanded = useRef(expanded);
  useEffect(() => {
    if (lastExpanded.current !== expanded) {
      setIsExpanding(true);
      lastExpanded.current = expanded;
    }
  }, [expanded, children]);

  const onCollapseEnd = (): void => {
    setIsExpanding(false);
  };

  const classes = bemCollapseItem([{ border }]);

  return (
    <div className={addClass(classes, className)} style={style}>
      {direction === 'up' && (
        <div
          className={bemCollapseItem('wrapper')}
          style={(wrapperHeight && { height: `${wrapperHeight}px` }) || {}}
          ref={wrapperRef}
          onTransitionEnd={onCollapseEnd}
        >
          <div className={bemCollapseItem('content')} ref={contentRef}>
            {children || (!!message && <div className={bemCollapseItem('message')}>{message}</div>)}
          </div>
        </div>
      )}
      <Cell
        {...{ isLink, ...cellProps }}
        className={bemCollapseItem('title', { disabled, expanded: expanded || isExpanding })}
        onClick={onTitleClick}
      ></Cell>
      {direction === 'down' && (
        <div
          className={bemCollapseItem('wrapper')}
          style={(wrapperHeight && { height: `${wrapperHeight}px` }) || {}}
          ref={wrapperRef}
          onTransitionEnd={onCollapseEnd}
        >
          <div className={bemCollapseItem('content')} ref={contentRef}>
            {children || (!!message && <div className={bemCollapseItem('message')}>{message}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

CollapseItem.displayName = 'CollapseItem';

export interface Collapse extends FC<CollapseProps> {
  readonly Item: FC<CollapseItemProps>;
}

const component: Collapse = Collapse as any;
(component as any).Item = CollapseItem;

export default component;

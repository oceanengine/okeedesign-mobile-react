import React, { FC, useState, useRef, useEffect, useMemo, FunctionComponentElement } from 'react';

import createBEM, { prefix } from '../../utils/create/createBEM';
import { scrollLeftTo } from './utils';
import { value2DomUnit } from '../../utils/dom/unit';
import { isDef } from '../../utils';
import { TabProps } from '../tab';
import { TouchHookEventHandlerCallback, TouchHookState, useTouch } from '../../hooks';

const bem = createBEM('tabs');
const MIN_SWIPE_DISTANCE = 50;
export interface TabsProps {
  value?: number | string;
  defaultValue?: number | string;
  type?: 'line' | 'card';
  size?: 'normal' | 'large';
  safeAreaInset?: number | string;
  gutter?: number | string;
  flex?: boolean;
  duration?: number;
  border?: boolean;
  swipeThreshold?: number;
  animated?: boolean;
  swipeable?: boolean;
  color?: string;
  lineWidth?: string;
  lineHeight?: string;
  lineColor?: string;
  titleActiveColor?: string;
  titleInactiveColor?: string;
  lazyRender?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (selected: number | string) => void;
  onChange?: (selected: number | string) => void;
}

interface TypeLineStyle {
  width: string;
  height?: string;
  backgroundColor?: string;
  transform: string;
  transition?: string;
  transitionDuration?: string;
}

export const Tabs: FC<TabsProps> = (props: TabsProps) => {
  const {
    value,
    defaultValue,
    type,
    size,
    border,
    flex,
    gutter,
    duration,
    animated,
    swipeable,
    safeAreaInset,
    color,
    lineWidth,
    lineHeight,
    lineColor,
    titleActiveColor,
    titleInactiveColor,
    swipeThreshold,
    lazyRender,
    style,
    className,
    onClick,
    onChange,
    // @ts-ignore
    children,
  } = props;

  const [activeValue, setActiveKey] = useState(typeof value === 'undefined' ? defaultValue : value);
  const [lineStyle, setLineStyle] = useState({});
  const didMountRef = useRef<boolean>(false);
  const titlesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof value === 'undefined') {
      return;
    }
    setActiveKey(value);
  }, [value]);

  const findChildIndex = (
    key: number | string | undefined,
    children: React.ReactElement[],
  ): number => {
    /**
     * 返回 child 对应 索引
     */
    const nameArr = children.map(child => child.props.name);
    if (isDef(key) && nameArr.every(name => !isDef(name)) && typeof key === 'number') {
      if (key >= children.length) {
        return children.length - 1;
      }
      return key ?? 0;
    }
    const index = nameArr.findIndex(name => name === key);
    return index === -1 ? 0 : index;
  };

  const findChildKey = (index: number, children: React.ReactElement[]): number | string => {
    /**
     * 返回 child 索引对应的 name，若未绑定 name 则返回索引
     */
    return children[index].props.name || index;
  };

  const gap = (): string => {
    if (flex) return '';
    return gutter ? value2DomUnit(gutter, 0.5) : '';
  };

  const safeArea = (): string => {
    return safeAreaInset ? value2DomUnit(safeAreaInset) : '';
  };

  /**
   * click点击事件
   */
  const handleClick = (
    e: React.MouseEvent,
    activeValue: number | string,
    disabled: boolean | undefined,
  ): void => {
    if (!disabled) {
      if (typeof value === 'undefined') {
        setActiveKey(activeValue);
      } else {
        onChange?.(activeValue);
      }
      if (onClick) {
        onClick(activeValue);
      }
    }
  };

  // @ts-ignore
  const scrollable = children.length > swipeThreshold;
  const navClass = `${bem('nav', [type])}`;
  const wrapClass = `${bem('wrap', { scrollable })} ${
    type === 'line' && border ? `${prefix}hairline--top-bottom` : ''
  } ${flex ? '' : bem(['static'])}`;
  const navStyle = {
    borderColor: type === 'card' ? color : '',
    paddingLeft: safeArea(),
    paddingRight: safeArea(),
  };

  useEffect(() => {
    /**
     * 初始化以及 activeValue 与 children 改变时触发
     */
    const setLine = (index: number): void => {
      /**
       * 设置下划线位置 及 样式
       */
      if (type !== 'line' || !titlesRef.current) return;

      // @ts-ignore
      const { offsetLeft: offsetLeftWrap } = titlesRef.current.children[index];
      // @ts-ignore
      const { offsetWidth, offsetLeft } = titlesRef.current.children[index].children[0];

      const width = isDef(lineWidth) ? lineWidth : offsetWidth + 4;
      const left = offsetLeftWrap + offsetWidth / 2 + offsetLeft;

      const lineStyle: TypeLineStyle = {
        width: value2DomUnit(width),
        backgroundColor: lineColor,
        transform: `translateX(${left}px) translateX(-50%)`,
      };

      if (isDef(lineHeight)) {
        const height = value2DomUnit(lineHeight);
        lineStyle.height = height;
      }

      if (didMountRef.current) {
        lineStyle.transition = `transform ${duration}s`;
      }

      setLineStyle(lineStyle);
    };

    const scrollIntoView = (index: number): void => {
      if (!scrollable || !titlesRef.current) return;
      const nav = titlesRef.current;
      const title = titlesRef.current.children[index];
      // @ts-ignore
      const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;
      scrollLeftTo(nav, to, !didMountRef.current ? 0 : duration ?? 0.3);
    };

    const currentIndex = findChildIndex(activeValue, children);
    const currentKey = findChildKey(currentIndex, children);

    // 传入的 activeValue 不正确时，默认选中第一个
    if (currentKey !== activeValue) {
      setActiveKey(currentKey);
      return;
    }

    setLine(currentIndex);
    scrollIntoView(currentIndex);

    if (!didMountRef.current) {
      // componentDidMount 时触发
      didMountRef.current = true;
    }
  }, [activeValue, children, lineColor, duration, lineHeight, lineWidth, scrollable, type]);

  const NavTitle = React.Children.map(children, (child, i) => {
    const childElement = child as FunctionComponentElement<TabProps>;
    const { name, title, disabled } = childElement.props;
    const { displayName } = childElement.type;
    const currentKey = findChildKey(findChildIndex(name ?? i, children), children);
    const isActive = activeValue === currentKey;

    if (displayName === 'Tab') {
      const classes = `${bem('nav__item', {
        active: isActive,
        disabled: disabled,
      })}`;

      const navItemStyle = {
        color: isActive ? titleActiveColor : titleInactiveColor,
        paddingLeft: gap(),
        paddingRight: gap(),
      };
      if (type === 'card' && color) {
        // @ts-ignore
        navItemStyle.borderColor = color;
        if (isActive) {
          // @ts-ignore
          navItemStyle.backgroundColor = color;
        } else {
          navItemStyle.color = color;
        }
      }
      if (scrollable) {
        // @ts-ignore
        navItemStyle.flexBasis = `${88 / swipeThreshold}%`;
      }

      return (
        <div
          className={classes}
          style={navItemStyle}
          key={`nav__item--${currentKey}`}
          onClick={(e): void => {
            handleClick(e, name ?? i, disabled);
          }}
        >
          <span>{title}</span>
        </div>
      );
    } else {
      console.error('Tabs 组件需要和 Tab 组件一起使用');
    }
  });

  const Content = useMemo((): React.ReactNode => {
    return React.Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<TabProps>;
      const { name } = childElement.props;
      const finalName = name ?? i;
      return React.cloneElement(childElement, {
        name: finalName,
        active: finalName === activeValue,
        lazyRender,
        animated,
        swipeable,
      });
    });
  }, [children, activeValue, lazyRender, animated, swipeable]);

  const [positionX, setPositionX] = useState(0);
  const [contentStyle, setContentStyle] = useState({});
  const afterTouchMove: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    const { direction, deltaX } = states[0] as TouchHookState;
    if (swipeable && animated && direction === 'horizontal') {
      event.preventDefault();
      const width = contentRef.current?.offsetWidth || 0;
      const currentIndex = findChildIndex(activeValue, children);
      const childrenLength = children.length;
      if (currentIndex === childrenLength - 1 && deltaX < 0) {
        // 到底禁止滑动
        return;
      }

      let positionX = deltaX - width * currentIndex;
      positionX =
        positionX > 0
          ? 0
          : positionX < -width * childrenLength
          ? -width * childrenLength
          : positionX;
      setPositionX(positionX);
      if (event.cancelable) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  const beforeTouchEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    if (swipeable) {
      const { direction, deltaX } = states[0] as TouchHookState;
      const currentIndex = findChildIndex(activeValue, children);
      if (direction === 'horizontal' && Math.abs(deltaX) >= MIN_SWIPE_DISTANCE) {
        if (deltaX > 0 && currentIndex !== 0) {
          setActiveKey(findChildKey(currentIndex - 1, children));
        } else if (deltaX < 0 && currentIndex !== children.length - 1) {
          setActiveKey(findChildKey(currentIndex + 1, children));
        }
      } else if (animated && Math.abs(deltaX) < MIN_SWIPE_DISTANCE) {
        const width = contentRef.current?.offsetWidth || 0;
        setContentStyle({
          transform: `translate3d(${findChildIndex(activeValue, children) * -width}px, 0, 0)`,
          transitionDuration: `${duration}s`,
        });
      }
    }
  };

  const [, , { onTouchStart, onTouchMove, onTouchEnd }] = useTouch({
    disabled: !swipeable,
    afterTouchMove,
    beforeTouchEnd,
  });
  useEffect(() => {
    const elem = contentRef.current;
    if (!elem) {
      return;
    }
    elem.addEventListener('touchstart', onTouchStart);
    elem.addEventListener('touchmove', onTouchMove, { passive: false });
    elem.addEventListener('touchend', onTouchEnd);
    return (): void => {
      elem.removeEventListener('touchstart', onTouchStart);
      elem.removeEventListener('touchmove', onTouchMove);
      elem.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const width = contentRef.current?.offsetWidth || 0;

    if (animated || (animated && swipeable)) {
      setContentStyle({
        transform: `translate3d(${findChildIndex(activeValue, children) * -width}px, 0, 0)`,
        transitionDuration: `${duration}s`,
      });
    } else {
      setContentStyle({
        transform: `translate3d(${findChildIndex(activeValue, children) * -width}px, 0, 0)`,
      });
    }
  }, [animated, swipeable, activeValue, contentRef.current]);

  useEffect(() => {
    if (animated && swipeable) {
      setContentStyle({
        transform: `translate3d(${positionX}px, 0, 0)`,
        transitionDuration: `${duration}s`,
      });
    }
  }, [animated, swipeable, positionX]);

  return (
    <div className={`${bem([type, size])} ${className}`} style={style}>
      <div className={wrapClass}>
        <div className={navClass} ref={titlesRef} style={navStyle}>
          {NavTitle}
          {type === 'line' && <div className={bem('line')} style={lineStyle} />}
        </div>
      </div>
      <div
        className={bem('content', [{ animated: animated }])}
        ref={contentRef}
        style={contentStyle}
      >
        {Content}
      </div>
    </div>
  );
};

Tabs.defaultProps = {
  defaultValue: 0,
  type: 'line',
  gutter: 0,
  flex: true,
  duration: 0.3,
  border: true,
  swipeThreshold: 4,
  size: 'normal',
  lazyRender: true,
  animated: false,
  swipeable: false,
  className: '',
};

Tabs.displayName = 'Tabs';

export default Tabs;

import React, { FC, useMemo, useRef } from 'react';
import createBEM from '../../utils/create/createBEM';

const bem = createBEM('tab');

export interface TabProps {
  title: string | React.ReactElement;
  name?: number | string;
  disabled?: boolean;
  active?: boolean;
  children?: any;
  lazyRender?: boolean;
  animated?: boolean;
  swipeable?: boolean;
}

export const Tab: FC<TabProps> = (props: TabProps) => {
  const {
    name,
    children,
    active = true,
    lazyRender = true,
    animated = false,
    swipeable = false,
  } = props;

  const inited = useRef(false);

  if (!inited.current && active) {
    inited.current = true;
  }

  // inited effected by active
  const isRenderChildren = useMemo(() => {
    return animated || swipeable || inited.current || !lazyRender;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, lazyRender, animated, swipeable]);

  return (
    <div className={bem('pane', [{ inactive: !active }])} key={`tab--${name}`}>
      {isRenderChildren && children}
    </div>
  );
};

Tab.displayName = 'Tab';

export default Tab;

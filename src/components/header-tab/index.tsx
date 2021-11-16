/* eslint-disable semi */
import React, { FC, PropsWithChildren, CSSProperties, useContext } from 'react';

import createBEM from '../../utils/create/createBEM';
import { RenderFunction } from '../../utils/types';

import { HeaderContext } from '../header';
import { HeaderTabsContext } from '../header-tabs';

const bem = createBEM('header-tab');

export interface HeaderTabProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The title of the header tab.
   */
  title?: string | JSX.Element | RenderFunction;

  /**
   * The id name of the header tab.
   */
  name?: string | number | boolean;
}

const HeaderTab: FC<HeaderTabProps> = (props: PropsWithChildren<HeaderTabProps>) => {
  const { className, style, title, name = '' } = props;

  const { type } = useContext(HeaderContext);
  const { activeName, setActiveName } = useContext(HeaderTabsContext);

  const active = name === activeName;

  let classes = bem([type, { active }]);
  if (className) {
    classes = `${classes} ${className}`;
  }

  return (
    <div
      className={classes}
      style={style}
      data-active={active}
      onClick={(): void => setActiveName(name)}
    >
      <div className={bem('box')}>{typeof title === 'function' ? title({}) : title}</div>
    </div>
  );
};

HeaderTab.displayName = 'HeaderTab';

export default HeaderTab;

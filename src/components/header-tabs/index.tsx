/* eslint-disable semi */
import React, {
  FC,
  PropsWithChildren,
  CSSProperties,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

import createBEM from '../../utils/create/createBEM';

import { HeaderContext } from '../header';

const bem = createBEM('header-tabs');

export interface HeaderTabsContextState {
  activeName: string | number | boolean;
  setActiveName: (selectedName: string | number | boolean) => void;
}

export const HeaderTabsContext = React.createContext<HeaderTabsContextState>({
  activeName: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  setActiveName: selectedName => {},
});

export interface HeaderTabsProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The id name of current selected tab.
   */
  value: string | number | boolean;

  /**
   * The callback when selected tab changed.
   */
  onChange: (selected: string | number | boolean) => void;
}

const HeaderTabs: FC<HeaderTabsProps> = (props: PropsWithChildren<HeaderTabsProps>) => {
  const { className, style, value, onChange, children } = props;

  const { type } = useContext(HeaderContext);
  const [activeName, setActiveName] = useState(value);
  const [lineStyle, setLineStyle] = useState<CSSProperties>({});
  const boxRef = useRef<HTMLDivElement>(null);

  const setLine = (): void => {
    const tabsCollection = boxRef.current?.children;
    if (tabsCollection) {
      const tabs = Array.from(tabsCollection) as HTMLElement[];
      const activeTab = tabs.find(t => t.dataset.active === 'true');
      if (activeTab) {
        const { offsetLeft: left } = activeTab;
        const { clientWidth, offsetLeft: innerLeft } = activeTab.children[0] as HTMLElement;

        setLineStyle({
          width: `${clientWidth}px`,
          transform: `translate3d(${left + innerLeft}px, 0, 0)`,
        });
      }
    }
  };

  useEffect(() => setLine(), [activeName, children]);

  let classes = bem([type]);
  if (className) {
    classes = `${classes} ${className}`;
  }

  return (
    <div className={classes} style={style}>
      <div className={bem('box')} ref={boxRef}>
        <HeaderTabsContext.Provider
          value={{
            activeName: value,
            setActiveName: (selectedName): void => {
              setActiveName(selectedName);
              onChange(selectedName);
            },
          }}
        >
          {children}
        </HeaderTabsContext.Provider>
      </div>
      <div className={bem('line')} style={lineStyle}></div>
    </div>
  );
};

HeaderTabs.displayName = 'HeaderTabs';

export default HeaderTabs;

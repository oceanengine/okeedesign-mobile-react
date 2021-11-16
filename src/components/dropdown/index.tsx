import * as React from 'react';
import { FunctionComponentElement } from 'react';
import { useClickOutside } from '../../hooks';
import createBEM from '../../utils/create/createBEM';
import type { DropdownItemProps } from '../dropdown-item';

export type DropdownDirections = 'up' | 'down';
export type DropdownProps = {
  zIndex?: number;
  duration?: number;
  direction?: DropdownDirections;
  overlay?: boolean;
  closeOnClickOverlay?: boolean;
  closeOnClickOutside?: boolean;
  children?: any;

  beforeMenuChange?: (done: (isGoOn: boolean) => void) => void;

  onSwitch?: (index: number) => void;
};

const bem = createBEM('dropdown');

export type DropdownState = {
  getPopupOffset?: () => number;
  zIndex?: DropdownProps['zIndex'];
  direction?: DropdownProps['direction'];
  duration?: DropdownProps['duration'];
  overlay?: DropdownProps['overlay'];
  activeMenu?: DropdownItemProps['value'];
  closeOnClickOverlay?: boolean;
  closePopup?: () => void;
};
export const DropdownContext = React.createContext<DropdownState>({});

const DEFAULT_ACTIVE_MENU = -1;
function Dropdown(props: DropdownProps): JSX.Element {
  const {
    zIndex,
    duration,
    direction,
    overlay,
    closeOnClickOutside,
    closeOnClickOverlay,

    beforeMenuChange,

    children,

    onSwitch,
  } = props;

  const [activeMenu, setActiveMenu] = React.useState<number>(DEFAULT_ACTIVE_MENU);

  React.useEffect(() => {
    onSwitch?.(activeMenu);
  }, [activeMenu]);

  function Labels(): JSX.Element {
    return React.Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<DropdownItemProps>;
      const { value, options, title, disabled } = childElement.props;

      function Label(): string | JSX.Element | null {
        if (title) {
          if (typeof title === 'function') {
            return title();
          }
          return title;
        }
        const activeItem = (options || []).find(option => {
          return option.value === value;
        });
        if (activeItem) {
          return activeItem.label;
        }
        console.warn('Must transfer default value for dropdownItem');
        return '';
      }

      const className = bem('menu', [
        activeMenu === index ? 'active' : 'default',
        {
          disabled,
          first: index === 0,
        },
      ]);

      const onMenuClick: React.MouseEventHandler<HTMLDivElement> = () => {
        if (disabled) return;
        if (beforeMenuChange) {
          beforeMenuChange(isGoOn => {
            if (!isGoOn) return;
            if (index === activeMenu) {
              setActiveMenu(DEFAULT_ACTIVE_MENU);
            } else {
              setActiveMenu(index);
            }
          });
        } else {
          if (index === activeMenu) {
            setActiveMenu(DEFAULT_ACTIVE_MENU);
          } else {
            setActiveMenu(index);
          }
        }
      };
      const titleClassName = bem('title', [
        (direction === 'down') !== (activeMenu === index) ? 'up' : 'down',
        activeMenu === index ? 'active' : 'default',
      ]);
      return (
        <div key={index} className={className} onClick={onMenuClick}>
          <div className={titleClassName}>
            <div className={bem('ellipsis')}>{Label()}</div>
          </div>
        </div>
      );
    });
  }

  const Content = React.useMemo((): React.ReactNode => {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement<DropdownItemProps>(child, { dataKey: index });
    });
  }, [children]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  useClickOutside({
    method: 'touchstart',
    callback: () => setActiveMenu(DEFAULT_ACTIVE_MENU),
    closeOnClickOutside: closeOnClickOutside!,
    container: containerRef,
  });

  function getPopupOffset(): number {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (direction === 'down') {
        return rect.bottom;
      }
      return window.innerHeight - rect.top;
    }
    return 0;
  }

  const contextValue: DropdownState = {
    getPopupOffset,
    zIndex,
    direction,
    duration,
    overlay,
    activeMenu,
    closeOnClickOverlay,
    closePopup: () => {
      setActiveMenu(DEFAULT_ACTIVE_MENU);
    },
  };
  return (
    <DropdownContext.Provider value={contextValue}>
      <div className={bem()} ref={containerRef}>
        {Labels()}
        {Content}
      </div>
    </DropdownContext.Provider>
  );
}

Dropdown.defaultProps = {
  zIndex: 10,
  duration: 0.2,
  direction: 'down',
  overlay: true,
  closeOnClickOverlay: true,
  closeOnClickOutside: true,
};

export default Dropdown;

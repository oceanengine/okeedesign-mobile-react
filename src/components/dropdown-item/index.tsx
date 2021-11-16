import * as React from 'react';
import createBEM from '../../utils/create/createBEM';
import { RenderFunction } from '../../utils/types';
import type { DropdownState } from '../dropdown';
import { DropdownContext } from '../dropdown';
import Cell from '../cell';
import Icon from '../icon';
import Popup from '../popup';
import { useState } from 'react';

export type DropdownItemValue = string | number;

export type DropdownItemOption = {
  value: DropdownItemValue;
  label: string;
};
export type DropdownItemProps = {
  value: DropdownItemValue;
  options?: DropdownItemOption[];

  title?: string | JSX.Element | RenderFunction<void>;
  renderList?: string | JSX.Element | RenderFunction<() => void>;

  dataKey?: DropdownItemValue;

  disabled?: boolean;

  onChange?: (props: DropdownItemValue) => void;
};

const bem = createBEM('dropdown-item');

function DropdownItem(props: DropdownItemProps): JSX.Element {
  const { value, options, renderList, dataKey, onChange } = props;

  const {
    getPopupOffset,
    activeMenu,
    overlay,
    zIndex,
    direction,
    duration,
    closeOnClickOverlay,
    closePopup,
  } = React.useContext<DropdownState>(DropdownContext);

  function List(): string | JSX.Element | JSX.Element[] | null {
    if (renderList) {
      if (typeof renderList === 'function') {
        return renderList(() => {
          closePopup?.();
        });
      }
      return renderList;
    }
    return options!.map((option): JSX.Element => {
      const isActive = value === option.value;

      function ActiveTitle(): JSX.Element {
        return <span className={bem('label', ['active'])}>{option.label}</span>;
      }

      function onCellClick(): void {
        onChange?.(option.value);
        closePopup?.();
      }

      const cellClassName = bem('cell', [isActive ? 'active' : 'default']);
      if (isActive) {
        return (
          <Cell
            key={option.value}
            className={cellClassName}
            size="large"
            title={ActiveTitle()}
            value={<Icon className={bem('icon')} name="Check" />}
            clickable
            onClick={onCellClick}
          />
        );
      }
      return (
        <Cell
          key={option.value}
          className={cellClassName}
          size="large"
          title={option.label}
          clickable
          onClick={onCellClick}
        />
      );
    });
  }

  const [style, setStyle] = useState<React.CSSProperties>(() => {
    if (dataKey === activeMenu) {
      return {
        display: 'block',
      };
    }
    return {
      display: 'none',
    };
  });
  const [popupValue, setPopupValue] = useState<boolean>(() => {
    return dataKey === activeMenu;
  });
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>(() => {
    return {};
  });

  React.useEffect(() => {
    if (dataKey === activeMenu) {
      const popupOffset = getPopupOffset!();
      let positionStyle: React.CSSProperties = {};
      let overlayPositionStyle: React.CSSProperties = {};
      if (direction === 'down') {
        positionStyle = {
          height: `calc(100vh - ${popupOffset}px)`,
        };
        overlayPositionStyle = {
          position: 'absolute',
          top: 'initial',
          bottom: 0,
          height: `calc(100vh - ${popupOffset}px)`,
        };
      } else {
        positionStyle = {
          height: `calc(100vh - ${popupOffset}px)`,
        };
        overlayPositionStyle = {
          position: 'absolute',
          height: `calc(100vh - ${popupOffset}px)`,
        };
      }

      setStyle({
        display: 'block',
        zIndex,
        ...positionStyle,
      });
      setOverlayStyle(overlayPositionStyle);
      setPopupValue(true);
    } else {
      setPopupValue(false);
    }
  }, [activeMenu, dataKey]);

  const popupPosition = direction === 'up' ? 'bottom' : 'top';
  const finalDuration = activeMenu !== dataKey && activeMenu !== -1 ? 0 : duration;
  return (
    <div className={bem([direction])} style={style}>
      <Popup
        overlay={overlay}
        appendToBody={false}
        value={popupValue}
        overlayStyle={overlayStyle}
        position={popupPosition}
        style={{ position: 'absolute' }}
        closeOnClickOverlay={closeOnClickOverlay}
        duration={finalDuration}
        onChange={(): void => closePopup?.()}
        afterClose={(): void => {
          setStyle({
            display: 'none',
          });
        }}
      >
        {List()}
      </Popup>
    </div>
  );
}

DropdownItem.defaultProps = {
  disabled: false,
};

export default DropdownItem;

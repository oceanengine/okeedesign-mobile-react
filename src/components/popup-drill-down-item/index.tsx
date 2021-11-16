import React, { HTMLAttributes, useContext } from 'react';
import createBEM, { addClass } from '../../utils/create/createBEM';
import { RenderFunction } from '../../utils/types';
import { PopupDrillDownContext, PopupDrillDownState } from '../popup-drill-down/context';

export interface PopupDrillDownItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | JSX.Element | RenderFunction<void>;

  left?: string | JSX.Element | RenderFunction<void>;
  right?: string | JSX.Element | RenderFunction<(() => void) | void>;

  active?: boolean;
  target?: boolean;
  children?: string | JSX.Element | RenderFunction<PopupDrillDownState>;
}

const bem = createBEM('popup-drill-down-item');

function PopupDrillDownItem(props: PopupDrillDownItemProps): JSX.Element {
  const { children, className, active = false, target = false } = props;

  const { ...methods } = useContext(PopupDrillDownContext);

  const childProps = {
    ...methods,
  } as PopupDrillDownState;

  return (
    <div className={addClass(bem([{ target }]), className)}>
      {active && <div className={bem('overlay')}></div>}
      {typeof children === 'function' ? children(childProps) : children}
    </div>
  );
}

export default PopupDrillDownItem;

import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import createBEM, { addClass, prefix } from '../../utils/create/createBEM';

export interface OverlayProps {
  show?: boolean;
  zIndex?: number | string;
  className?: any;
  customStyle?: any;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const bem = createBEM('overlay');

function Overlay(props: OverlayProps): any {
  const { show, zIndex, className, customStyle, onClick } = props;

  const style: { [key: string]: any } = {
    zIndex: zIndex,
    ...customStyle,
  };

  return (
    <CSSTransition classNames={`${prefix}fade`} in={show} timeout={300}>
      <div className={addClass(bem(), className)} style={style} onClick={onClick} />
    </CSSTransition>
  );
}

export default Overlay;

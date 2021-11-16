import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import usePopup, { PopupCommonProps } from '../../common/popup';
import { useRefCallback } from '../../hooks';

import createBEM, { prefix } from '../../utils/create/createBEM';

export interface PopupProps extends PopupCommonProps {
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  afterClose?: () => void;

  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}

const bem = createBEM('popup');

const listenerList: PopupProps['onChange'][] = [];
function Popup(props: PopupProps): JSX.Element | null {
  const { duration } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  // 自定义公有 Popup hook
  const { container, containerId } = usePopup(props, containerRef);

  const onValueChange = useRefCallback(props.onChange);
  useEffect(() => {
    listenerList.push(onValueChange);
  }, []);

  const { position, className } = props;
  let classNames = `${prefix}popup-slide-${position}`;
  let timeout = 200;
  if (position === 'center') {
    classNames = `${prefix}fade`;
    timeout = 300;
  }
  if (typeof duration === 'number') {
    timeout = duration && duration * 1000;
  }

  // 根节点 class
  let popupClassName = bem({ [position as string]: position });
  if (className) {
    popupClassName = popupClassName + ` ${className}`;
  }

  // warning fix
  // https://github.com/reactjs/react-transition-group/issues/668
  const nodeRef = React.useRef(null);

  const onExited = useRefCallback(() => {
    props.onExited?.();
    props.afterClose?.();
  });

  if (container) {
    if (typeof window === 'undefined') {
      return null;
    }

    return ReactDOM.createPortal(
      <CSSTransition
        in={props.value}
        timeout={timeout}
        classNames={classNames}
        appear={true}
        mountOnEnter={true}
        onEnter={props.onEnter}
        onEntered={props.onEntered}
        onExit={props.onExit}
        onExited={onExited}
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className={popupClassName} style={props.style} onClick={props.onClick}>
          {props.children}
        </div>
      </CSSTransition>,
      container!,
    );
  }

  return (
    <div ref={containerRef} id={containerId}>
      <CSSTransition
        in={props.value}
        timeout={timeout}
        classNames={classNames}
        appear={true}
        mountOnEnter={true}
        onEnter={props.onEnter}
        onEntered={props.onEntered}
        onExit={props.onExit}
        onExited={onExited}
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className={popupClassName} style={props.style} onClick={props.onClick}>
          {props.children}
        </div>
      </CSSTransition>
    </div>
  );
}

Popup.closeAll = function (): void {
  listenerList.forEach(item => {
    item!(false);
  });
};

const defaultProps: PopupProps = {
  position: 'center',
  overlay: true,
  closeOnClickOverlay: true,
  appendToBody: true,
};

Popup.defaultProps = defaultProps;
Popup._uid = 0;

export default Popup;

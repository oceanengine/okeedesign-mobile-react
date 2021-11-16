import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import usePopup, { PopupCommonProps } from '../../common/popup';
import Button from '../button';
import { createNamespace } from '../../utils/create';

import { BORDER_TOP, BORDER_LEFT } from '../../utils/const';

export type DialogSize = 'small' | 'normal' | 'large';

export interface DialogProps extends PopupCommonProps {
  title?: string;
  message?: string;
  size?: DialogSize;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  afterClose?: () => void;
}

const [bem, t] = createNamespace('dialog');

function Dialog(props: DialogProps): JSX.Element | null {
  // 自定义公有 Popup hook
  const { container } = usePopup(props);

  // 根节点
  const rootRef: React.MutableRefObject<HTMLDivElement> = useRef(container!);

  const {
    className,
    title,
    message,
    size,
    showCancelButton,
    showConfirmButton,
    cancelButtonText,
    confirmButtonText,
  } = props;

  // Title
  const messageSlot = props.children;
  const hasContent = Boolean(messageSlot || message);
  const headerClassName = bem('header', { 'has-content': hasContent });

  const Title = title && <div className={headerClassName}>{title}</div>;

  // Content
  const Content = hasContent && (
    <div className={bem('content')}>
      {messageSlot || <div className={bem('message', { 'has-title': title })}>{message}</div>}
    </div>
  );

  // Footer
  const moreThanOne = showCancelButton || showConfirmButton;
  const both = showCancelButton && showConfirmButton;

  let confirmButtonClassName = bem('confirm');
  if (both) {
    confirmButtonClassName = confirmButtonClassName + ` ${BORDER_LEFT}`;
  }

  const Footer = moreThanOne && (
    <div className={bem('footer') + ` ${BORDER_TOP}`}>
      {showCancelButton && (
        <Button
          className={bem('cancel')}
          text={cancelButtonText || t('cancel')}
          onClick={(): void => {
            props.onCancel && props.onCancel();
          }}
        />
      )}
      {showConfirmButton && (
        <Button
          className={confirmButtonClassName}
          text={confirmButtonText || t('confirm')}
          onClick={(): void => {
            props.onConfirm && props.onConfirm();
          }}
        />
      )}
    </div>
  );

  if (typeof window === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.value}
      timeout={300}
      classNames="omui-dialog-bounce"
      appear={true}
      mountOnEnter={true}
      onExited={props.afterClose}
    >
      <div
        ref={rootRef}
        className={className ? `${bem([size])} ${className}` : bem([size])}
        style={props.style}
        onClick={props.onClick}
      >
        {Title}
        {Content}
        {Footer}
      </div>
    </CSSTransition>,
    container!,
  );
}

const defaultProps: DialogProps = {
  overlay: true,
  size: 'normal',
  showConfirmButton: true,
  closeOnClickOverlay: false,
};

Dialog.defaultProps = defaultProps;
Dialog._uid = 0;

export default Dialog;

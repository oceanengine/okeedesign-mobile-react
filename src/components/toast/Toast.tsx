import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import usePopup, { PopupCommonProps } from '../../common/popup';
import { createNamespace } from '../../utils/create';
import { upperCamelize } from '../../utils/format/string';

import Icon from '../icon';
import type { IconName } from '../icon';
import { addClass, prefix } from '../../utils/create/createBEM';

export type ToastType = 'text' | 'success' | 'warning' | 'error' | 'loading';

export interface ToastProps extends PopupCommonProps {
  value?: boolean;
  message?: string;
  type?: ToastType;
  afterClose?: () => void;
  forbidClick?: boolean;
}

const UNCLICKABLE_CLASSNAME = `${prefix}toast--unclickable`;
const BODY_DOM = typeof window !== 'undefined' ? document.getElementsByTagName('body')[0] : null;
const [bem, t] = createNamespace('toast');

function Toast(props: ToastProps): JSX.Element | null {
  // 自定义公有 Popup hook
  const { container } = usePopup(props);

  // 根节点
  const rootRef: React.MutableRefObject<HTMLDivElement> = useRef(container!);

  // clickable
  const clickable = useMemo(
    () => Boolean(props.value && props.forbidClick),
    [props.value, props.forbidClick],
  );

  // componentWillmount Hook
  useEffect(() => {
    if (clickable) {
      // @ts-ignore
      BODY_DOM.classList.add(UNCLICKABLE_CLASSNAME);
    }
  }, []);

  // componentWillUnmount Hook
  useEffect(() => {
    return (): void => {
      // @ts-ignore
      BODY_DOM.classList.remove(UNCLICKABLE_CLASSNAME);
    };
  }, []);

  const [tLoading] = useState(t('loading'));

  const { type, className = '' } = props;
  let { message } = props;

  if (type === 'loading' && !message) {
    message = tLoading;
  }

  const hasIcon = type !== 'text';

  const ToastIcon = (function (): JSX.Element | undefined {
    if (hasIcon) {
      let iconClassName = bem('icon');

      const isLaoding = type === 'loading';
      if (isLaoding) {
        iconClassName = iconClassName + ` ${prefix}loading-circle`;
      }

      const fill = isLaoding ? '#0278FF' : '#ffffff';

      return (
        <Icon
          name={upperCamelize(type!) as IconName}
          className={iconClassName}
          style={{
            fill,
            width: '1.5rem',
            height: '1.5rem',
          }}
        />
      );
    }
  })();

  if (typeof window === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.value}
      timeout={300}
      classNames={`${prefix}fade`}
      appear={true}
      mountOnEnter={true}
      onExited={props.afterClose}
    >
      <div
        ref={rootRef}
        className={addClass(bem({ text: !hasIcon }), className)}
        style={props.style}
        onClick={props.onClick}
      >
        {ToastIcon}
        {Boolean(message) && <div className={bem('text')}>{message}</div>}
      </div>
    </CSSTransition>,
    container!,
  );
}

const defaultProps: ToastProps = {
  type: 'text',
  overlay: false,
};

Toast.defaultProps = defaultProps;
Toast._uid = 0;

export default Toast;

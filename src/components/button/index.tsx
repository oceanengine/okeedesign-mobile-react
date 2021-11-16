import * as React from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';
import { BORDER_SURROUND } from '../../utils/const';
import { useRefCallback } from '../../hooks';

export type ButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text';

export type ButtonSize = 'large' | 'normal' | 'small' | 'midget' | 'mini' | 'tiny';

export interface ButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
  children?: any;
  plain?: boolean;
  fade?: boolean;
  round?: boolean;
  square?: boolean;
  hairline?: boolean;
  disabled?: boolean;
}

const bem = createBEM('button');

function Button(props: ButtonProps): JSX.Element {
  const { type, size, className, plain, fade, round, square, hairline, disabled } = props;

  let mixinPlain = plain;
  if (fade || hairline) {
    mixinPlain = true;
  }

  const buttonClassName = bem([
    type,
    size,
    {
      plain: mixinPlain,
      fade,
      round,
      square,
      hairline,
      disabled,
    },
  ]);

  const onClick = useRefCallback(event => {
    if (disabled) {
      return;
    }
    props.onClick?.(event);
  });

  return (
    <div
      className={addClass(buttonClassName, className, mixinPlain && BORDER_SURROUND)}
      style={props.style}
      onClick={onClick}
      onTouchStart={props.onTouchStart}
    >
      {props.children ? props.children : props.text}
    </div>
  );
}

const defaultProps: ButtonProps = {
  type: 'default',
  size: 'normal',
  plain: false,
  fade: false,
  round: false,
  square: false,
  hairline: false,
  disabled: false,
};

Button.defaultProps = defaultProps;

export default Button;

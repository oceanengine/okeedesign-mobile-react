/**
 * Component Radio
 */
import React, {
  useRef,
  useContext,
  FC,
  PropsWithChildren,
  CSSProperties,
  MouseEventHandler,
} from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

import { stopPropagation } from '../../utils/dom/event';

import { RadioType, RadioSize, RadioLabelPosition, RadioValue } from './types';

import { RadioGroupContext } from './group';

import RadioIcon from './icon';

const bem = createBEM('radio');

export interface RadioProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The type of shape.
   */
  type?: RadioType;

  /**
   * Size of radio
   */
  size?: RadioSize;

  /**
   * The pisition of label
   */
  labelPosition?: RadioLabelPosition;

  /**
   * The name of input.
   */
  name?: string;

  /**
   * The value of input.
   */
  value: RadioValue;

  /**
   * The status checked
   */
  checked?: boolean;

  /**
   * The status disabled.
   */
  disabled?: boolean;

  /**
   * When input value changed.
   */
  onChange?: (value: RadioValue) => void;

  /**
   * Optional callback when Radio is clicked.
   */
  onClick?: MouseEventHandler<HTMLLabelElement>;
}

const Radio: FC<RadioProps> = (props: PropsWithChildren<RadioProps>) => {
  const { className, style, name, type, size, labelPosition, value, disabled, children } = props;

  const context = useContext(RadioGroupContext);

  // checked
  let { checked } = props;

  if (checked === undefined) {
    checked = value === context.value;
  }

  // type
  let shape: RadioType = 'default';

  if (context.type) shape = context.type;

  if (type) shape = type;

  // icon
  const Icon = (
    <RadioIcon className={bem('icon')} key={`${shape}-${checked}`} type={shape} checked={checked} />
  );

  // Content Array
  const Content = [
    children && (
      <span key="label" className={bem('label')}>
        {children}
      </span>
    ),
  ];

  const position = labelPosition || context.labelPosition;

  if (position === 'left') {
    Content.push(Icon);
  } else {
    Content.unshift(Icon);
  }

  // input ref
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label
      className={addClass(
        bem([
          size || context.size,
          position,
          {
            checked,
            disabled,
          },
        ]),
        className,
      )}
      style={style}
      onClick={(event): void => {
        /**
         * 避免因label触发的input的点击事件
         */
        if (event.target === inputRef.current) {
          stopPropagation(event as any);
        } else if (!disabled && props.onClick) {
          props.onClick(event);
        }
      }}
    >
      {Content}
      <input
        className={bem('input')}
        ref={inputRef}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(): void => {
          if (disabled) return;
          props.onChange && props.onChange(value);
          context.onChange && context.onChange(value);
        }}
      />
    </label>
  );
};

Radio.displayName = 'Radio';

export default React.memo(Radio);

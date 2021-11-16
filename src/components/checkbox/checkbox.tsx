/**
 * Component Checkbox
 */
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  FC,
  PropsWithChildren,
  CSSProperties,
  MouseEventHandler,
} from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

import { stopPropagation } from '../../utils/dom/event';

import { CheckboxType, CheckboxSize, CheckboxValue } from './types';

import { CheckboxGroupContext, CheckboxGroupChild } from './group';

import Icon, { IconName } from '../icon';

export interface CheckboxProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The type of checkbox.
   */
  type?: CheckboxType;

  /**
   * Size of checkbox
   */
  size?: CheckboxSize;

  /**
   * The name of input.
   */
  name?: string;

  /**
   * The value of input.
   */
  value: CheckboxValue;

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
  onChange?: (value: CheckboxValue) => void;

  /**
   * Optional callback whe, Checkbox is clicked.
   */
  onClick?: MouseEventHandler<HTMLLabelElement>;
}

const bem = createBEM('checkbox');

const defaultCheckboxType = 'default';

export const Checkbox: FC<CheckboxProps> = (props: PropsWithChildren<CheckboxProps>) => {
  const { className, style, name, type, size, value, disabled, children } = props;

  const context = useContext(CheckboxGroupContext);

  // checked
  let { checked } = props;

  if (checked === undefined) {
    checked = context.value && context.value.includes(value);
  }

  // checkbox type
  let checkboxType: CheckboxType = defaultCheckboxType;

  if (context.type) checkboxType = context.type;

  if (type) checkboxType = type;

  // icon name
  let iconName: IconName;

  if (checked) {
    iconName = checkboxType === 'default' ? 'CheckOne' : 'SquareCheckOne';
  } else {
    iconName = checkboxType === 'square' ? 'SquareUncheck' : 'RadioUncheck';
  }

  // input ref
  const inputRef = useRef<HTMLInputElement>(null);

  // self
  const [self] = useState(() => {
    return {
      value,
      checked: Boolean(checked),
    };
  });
  useEffect(() => {
    self.value = value;
    self.checked = Boolean(checked);
  }, [value, checked]);

  // componentWillmount Hook
  useEffect(() => {
    context.children && context.children.push(self);
  }, []);

  // componentWillUnmount Hook
  useEffect(() => {
    return (): void => {
      if (context.children) {
        context.children = context.children.filter(child => child !== self);
      }
    };
  }, []);

  // checked index
  const index = useMemo(
    () => (context.value ? context.value.indexOf(value) : 0),
    [context.value, value],
  );

  return (
    <label
      className={addClass(
        bem([
          size || context.size,
          {
            checked,
            disabled,
          },
        ]),
        className,
      )}
      style={style}
      onClick={(event): void => {
        // 避免因label触发的input的点击事件
        if (event.target === inputRef.current) {
          stopPropagation(event as any);
        } else if (!disabled && props.onClick) {
          props.onClick(event);
        }
      }}
    >
      {(checkboxType === defaultCheckboxType || checkboxType === 'square') && (
        <Icon className={bem('icon')} name={iconName} />
      )}
      {checkboxType === 'number' &&
        (checked ? (
          <span className={bem('icon__number')}>{index + 1}</span>
        ) : (
          <Icon className={bem('icon')} name={iconName} />
        ))}
      {children && <span className={bem('label')}>{children}</span>}
      <input
        className={bem('input')}
        ref={inputRef}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(): void => {
          if (disabled) return;

          props.onChange && props.onChange(value);

          const newValue: CheckboxValue[] = [];

          context.children &&
            context.children.forEach((child: CheckboxGroupChild) => {
              if (child !== self) {
                if (child.checked) {
                  newValue.push(child.value);
                }
              } else if (!checked) {
                newValue.push(value);
              }
            });

          context.onChange && context.onChange(newValue);
        }}
      />
    </label>
  );
};

Checkbox.displayName = 'Checkbox';

export default React.memo(Checkbox);

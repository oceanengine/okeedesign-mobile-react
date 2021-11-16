import React, { FC, useState } from 'react';
import { createNamespace } from '../../utils/create';
import Loading from '../loading';

import { addClass } from '../../utils/create/createBEM';

const [bem] = createNamespace('switch');

export type SwitchSize = 'normal' | 'large';

export type SwitchProps = {
  size?: SwitchSize;
  value: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  name?: string;
  onClick?: (value: boolean) => void;
  onChange?: (value: boolean) => void;
};

export const Switch: FC<SwitchProps> = (props: SwitchProps) => {
  const { size, value, disabled, loading, className, name } = props;

  const [switchValue, setSwitchValue] = useState(value);

  function onClick(): void {
    if (!disabled && !loading) {
      setSwitchValue(!switchValue);
      if (props.onClick) props.onClick(!switchValue);
    }
  }

  function onChange(): void {
    if (!disabled && !loading) {
      if (props.onChange) props.onChange(!switchValue);
    }
  }

  const switchClassName =
    bem([
      {
        disabled,
        checked: value,
      },
    ]) +
    ' ' +
    size;

  return (
    <div className={addClass(switchClassName, className)} onClick={onClick}>
      <input
        type="checkbox"
        name={name}
        className={bem('checkbox')}
        disabled={disabled}
        checked={value}
        onChange={onChange}
        value={value ? 'on' : 'off'}
      />
      <div className={bem('show')}>
        {loading && (
          <Loading className={bem('loading')} size={size === 'large' ? '0.6rem' : '0.5rem'} />
        )}
      </div>
    </div>
  );
};

const defaultProps: SwitchProps = {
  size: 'normal',
  value: false,
  name: '',
};

Switch.defaultProps = defaultProps;

export default Switch;

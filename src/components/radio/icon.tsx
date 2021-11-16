/**
 * Component Radio Icon
 */
import React, { FC } from 'react';

import Icon from '../icon';

import { RadioType } from './types';

export interface RadioIconProps {
  className?: string;

  /**
   * type of shape.
   */
  type: RadioType;

  /**
   * value of radio.
   */
  checked: boolean;
}

const RadioIcon: FC<RadioIconProps> = (props: RadioIconProps) => {
  const { className, type, checked } = props;

  if (type === 'dot') {
    return checked ? (
      <Icon className={className} name="Radio" />
    ) : (
      <Icon className={className} name="RadioUncheck" />
    );
  }

  if (type === 'hook') {
    return checked ? <Icon className={className} name="Check" /> : <i className={className}></i>;
  }

  if (type === 'circle') {
    return checked ? (
      <Icon className={className} name="CheckOne" />
    ) : (
      <Icon className={className} name="RadioUncheck" />
    );
  }

  return checked ? <Icon className={className} name="CheckOne" /> : <i className={className}></i>;
};

RadioIcon.displayName = 'RadioIcon';

export default RadioIcon;

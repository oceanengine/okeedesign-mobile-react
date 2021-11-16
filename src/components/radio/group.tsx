/**
 * Component Radio Group
 */
import React, { FC, Context, CSSProperties, MouseEventHandler } from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

import { RadioType, RadioSize, RadioLabelPosition, RadioValue } from './types';

export interface RadioGroupState {
  type?: RadioType;
  size?: RadioSize;
  value?: RadioValue;
  labelPosition?: RadioLabelPosition;
  onChange?: (value: RadioValue) => void;
}

export const RadioGroupContext: Context<RadioGroupState> = React.createContext({});

const bem = createBEM('radio-group');

export interface RadioGroupProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;

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
   * The value of radio.
   */
  value: RadioValue;

  /**
   * When radio value changed.
   */
  onChange?: (value: RadioValue) => void;

  /**
   * Optional callback when Radio Group is clicked.
   */
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const RadioGroup: FC<RadioGroupProps> = (props: RadioGroupProps) => {
  const { type, size, labelPosition, value, onChange } = props;

  return (
    <RadioGroupContext.Provider
      value={{
        type,
        size,
        labelPosition,
        value,
        onChange,
      }}
    >
      <div className={addClass(bem(), props.className)} style={props.style} onClick={props.onClick}>
        {props.children}
      </div>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';

export default React.memo(RadioGroup);

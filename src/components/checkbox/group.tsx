/**
 * Component Checkbox Group
 */
import React, { useState, FC, Context, CSSProperties, MouseEventHandler } from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

import { CheckboxType, CheckboxSize, CheckboxValue } from './types';

export interface CheckboxGroupChild {
  value: CheckboxValue;
  checked: boolean;
}

export interface CheckboxGroupState {
  type?: CheckboxType;
  size?: CheckboxSize;
  value?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
  children?: CheckboxGroupChild[];
}

export const CheckboxGroupContext: Context<CheckboxGroupState> = React.createContext({});

const bem = createBEM('checkbox-group');

export interface CheckboxGroupProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;

  /**
   * The type of checkbox.
   */
  type?: CheckboxType;

  /**
   * Size of checkbox.
   */
  size?: CheckboxSize;

  /**
   * The value of checkbox.
   */
  value: CheckboxValue[];

  /**
   * When checkbox value changed.
   */
  onChange?: (value: CheckboxValue[]) => void;

  /**
   * Optional callback when Radio Group is clicked.
   */
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const CheckboxGroup: FC<CheckboxGroupProps> = (props: CheckboxGroupProps) => {
  const { className, style, type, size, value, onChange, children } = props;

  const [checkboxGroupChildren] = useState([]);

  return (
    <CheckboxGroupContext.Provider
      value={{
        type,
        size,
        value,
        onChange,
        children: checkboxGroupChildren,
      }}
    >
      <div className={addClass(bem(), className)} style={style} onClick={props.onClick}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';

export default React.memo(CheckboxGroup);

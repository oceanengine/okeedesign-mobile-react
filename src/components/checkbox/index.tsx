/**
 * Component Checkbox Entery
 */
import { NamedExoticComponent, PropsWithChildren } from 'react';

import InternalCheckbox from './checkbox';
import CheckboxGroup from './group';
import type { CheckboxProps } from './checkbox';

export type { CheckboxProps };
export type { CheckboxGroupProps } from './group';

export * from './types';

export interface Checkbox extends NamedExoticComponent<PropsWithChildren<CheckboxProps>> {
  Group: typeof CheckboxGroup;
}

const Checkbox = InternalCheckbox as Checkbox;
Checkbox.Group = CheckboxGroup;

export { CheckboxGroup };

export default Checkbox;

/**
 * Component Radio Entery
 */
import { NamedExoticComponent, PropsWithChildren } from 'react';

export * from './types';

import InternalRadio from './radio';
import type { RadioProps } from './radio';
import RadioGroup from './group';

export type { RadioGroupProps } from './group';

export type { RadioProps };

export interface Radio extends NamedExoticComponent<PropsWithChildren<RadioProps>> {
  Group: typeof RadioGroup;
}

const Radio = InternalRadio as Radio;
Radio.Group = RadioGroup;

export { RadioGroup };

export default Radio;

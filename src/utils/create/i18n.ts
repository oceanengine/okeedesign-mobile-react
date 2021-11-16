import { useContext } from 'react';
import LocaleContext from '../../components/locale-context';

import { get } from '..';
import { camelize, translate } from '../format/string';

export function createI18N(name: string): (path: string) => string {
  const prefix = name ? camelize(name) + '.' : '';

  return (path: string, ...args: any[]): string =>
    translate(get(useContext(LocaleContext), prefix + path), args);
}

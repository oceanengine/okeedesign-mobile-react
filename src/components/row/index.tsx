/**
 * Component Row
 */
import React, { FC, PropsWithChildren } from 'react';

import RowContext from './RowContext';

import createBEM from '../../utils/create/createBEM';
import { value2DomUnit } from '../../utils/dom/unit';

const bem = createBEM('row');

export interface RowProps {
  type?: 'flex';
  align?: string;
  justify?: string;
  gutter?: number | string;
}

export const Row: FC<RowProps> = (props: PropsWithChildren<RowProps>) => {
  const { type, align, justify, gutter } = props;

  const flex = type === 'flex';

  const rowStyle: React.CSSProperties = {};

  if (gutter) {
    const gap = value2DomUnit(gutter, 0.5);

    rowStyle.marginLeft = `-${gap}`;
    rowStyle.marginRight = `-${gap}`;
  }

  return (
    <RowContext.Provider value={{ gutter }}>
      <div
        className={bem({
          flex,
          [`align-${align}`]: flex && align,
          [`justify-${justify}`]: flex && justify,
        })}
        style={rowStyle}
      >
        {props.children}
      </div>
    </RowContext.Provider>
  );
};

Row.displayName = 'Row';

export default Row;

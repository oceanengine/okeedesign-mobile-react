import { HTMLAttributes, useMemo } from 'react';
import * as React from 'react';
import createBEM from '../../utils/create/createBEM';

export type TableIndicatorShape = 'round';

export interface TableIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  value: number[];
  shape?: TableIndicatorShape;
  length: number;
}

const bem = createBEM('table-indicator');

function TableIndicator(props: TableIndicatorProps): JSX.Element {
  const { length, value = [] } = props;

  const Items = useMemo(() => {
    return Array(length)
      .fill(0)
      .map((theValue, index) => {
        return <div key={index} className={bem('item', [{ active: value.includes(index) }])}></div>;
      });
  }, [value, length]);

  return <div className={bem()}>{Items}</div>;
}

export default TableIndicator;

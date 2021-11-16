/**
 * Component Col
 */
import React, { FC, PropsWithChildren } from 'react';

import RowContext from '../row/RowContext';

import createBEM from '../../utils/create/createBEM';
import { value2DomUnit } from '../../utils/dom/unit';

const bem = createBEM('col');

export interface ColProps {
  span: number | string;
  offset?: number | string;
}

export const Col: FC<ColProps> = (props: PropsWithChildren<ColProps>) => {
  const { span, offset } = props;

  return (
    <RowContext.Consumer>
      {({ gutter }): JSX.Element => {
        const colStyle: React.CSSProperties = {};

        if (gutter) {
          const gap = value2DomUnit(gutter, 0.5);
          colStyle.paddingLeft = gap;
          colStyle.paddingRight = gap;
        }

        return (
          <div
            className={bem({
              [span]: span,
              [`offset-${offset}`]: offset,
            })}
            style={colStyle}
          >
            {props.children}
          </div>
        );
      }}
    </RowContext.Consumer>
  );
};

Col.displayName = 'Col';

export default Col;

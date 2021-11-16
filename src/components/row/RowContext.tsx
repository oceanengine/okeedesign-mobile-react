import React, { Context } from 'react';

export interface RowContextState {
  gutter?: number | string;
}

const RowContext: Context<RowContextState> = React.createContext({});

export default RowContext;

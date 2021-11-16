import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ActionSheetOptions } from './index';
import ActionSheet, { ActionSheetProps } from './action-sheet';

export default function CreateActionSheet(options: ActionSheetOptions): void {
  if (typeof window === 'undefined') {
    return;
  }

  const div: HTMLElement = document.createElement('div');
  document.body.appendChild(div);

  function destroy(): void {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function render(options: ActionSheetProps): void {
    ReactDOM.render(<ActionSheet {...options} />, div);
  }

  function close(): void {
    /* eslint-disable @typescript-eslint/no-use-before-define */
    currentOptions = Object.assign({}, currentOptions, {
      value: false,
      afterClose: destroy,
    });

    render(currentOptions);
  }

  let currentOptions = {
    ...options,
    close,
    value: true,
  };

  render(currentOptions);
}

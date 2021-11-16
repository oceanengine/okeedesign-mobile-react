import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ModalProps } from './index';
import ModalDialog, { ModalDialogProps } from './modal-dialog';

export default function withConfirm(showCancelButton: boolean): (options: ModalProps) => void {
  return function (options: ModalProps): void {
    const { title, message } = options;

    if (!title && !message) {
      console.log('Must specify either an alert title, or message, or both');
      return;
    }

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

    function render(options: ModalDialogProps): void {
      ReactDOM.render(<ModalDialog {...options} />, div);
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
      showConfirmButton: true,
      showCancelButton,
    };

    render(currentOptions);
  };
}

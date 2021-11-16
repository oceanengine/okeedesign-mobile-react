import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ToastComponent from './Toast';

import type { ToastType, ToastProps } from './Toast';

import type { PopupCommonProps } from '../../common/popup';

export type { ToastProps };

const type: ToastType = 'text';
const defaultProps = {
  type,
  message: '',
  forbidClick: false,
};
let currentProps = defaultProps;

const queue: ((value: boolean) => void)[] = [];
let multiple = false;

function withToastRender(props: ToastProps): (value: boolean) => void {
  currentProps = Object.assign({}, defaultProps, props);

  if ((!queue.length || multiple) && typeof window !== 'undefined') {
    const div: HTMLElement = document.createElement('div');
    document.body.appendChild(div);

    queue.push((value: boolean): void => {
      ReactDOM.render(
        <ToastComponent
          {...currentProps}
          value={value}
          afterClose={(): void => {
            const unmountResult = ReactDOM.unmountComponentAtNode(div);

            if (unmountResult && div.parentNode) {
              div.parentNode.removeChild(div);
            }
          }}
        />,
        div,
      );
    });
  }

  return queue[queue.length - 1];
}

export default function Toast(): void {
  //
}

Toast.allowMultiple = (value = true): void => {
  multiple = value;
};

export type ToastInfoType = Exclude<ToastType, 'loading'>;

export interface ToastInfoOptions extends PopupCommonProps {
  type?: ToastInfoType;
  message?: string;
  duration?: number;
  forbidClick?: boolean;
}

export interface ToastLoadingOptions extends PopupCommonProps {
  type?: 'loading';
  message?: string;
  duration?: number;
  forbidClick?: boolean;
}

const DEFAULT_DURATION = 3000;

Toast.info = function (options: string | ToastInfoOptions): void {
  let type: Exclude<ToastType, 'loading'> = 'text';
  let message = '';
  let duration: number = DEFAULT_DURATION;
  let forbidClick = false;
  let defaultOptions = {};

  if (typeof options === 'string') {
    message = options;
  } else {
    defaultOptions = options;

    if (options.type !== undefined) {
      type = options.type;
    }

    if (options.message !== undefined) {
      message = options.message;
    }

    if (options.duration !== undefined) {
      duration = options.duration;
    }

    if (options.forbidClick !== undefined) {
      forbidClick = options.forbidClick;
    }
  }

  if (!message) {
    console.log('message is necessary');
    return;
  }

  const render = withToastRender({
    ...defaultOptions,
    type,
    message,
    forbidClick,
  });

  render(true);

  // @ts-ignore
  if (render.timer) clearTimeout(render.timer);

  // @ts-ignore
  render.timer = setTimeout(() => {
    render(false);
  }, duration);
};

Toast.loading = function (options?: string | ToastLoadingOptions): { close: () => void } {
  const type = 'loading';
  let message = '';
  let forbidClick = true;
  let defaultOptions = {};

  if (options) {
    if (typeof options === 'string') {
      message = options;
    } else {
      defaultOptions = options;

      if (options.message !== undefined) {
        message = options.message;
      }

      if (options.forbidClick !== undefined) {
        forbidClick = options.forbidClick;
      }
    }
  }

  const render = withToastRender({
    ...defaultOptions,
    type,
    message,
    forbidClick,
  });

  render(true);

  // @ts-ignore
  if (render.timer) clearTimeout(render.timer);

  return {
    close: (): void => render(false),
  };
};

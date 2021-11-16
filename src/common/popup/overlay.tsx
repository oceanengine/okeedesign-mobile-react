import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Overlay from '../../components/overlay';
import { context, OverlayConfig } from './context';
import type { MountElem } from './context';
import { prefix } from '../../utils/create/createBEM';

/**
 * OverlayRoot 公有类
 */
let changeShow: any = null;
let changezIndex: any = null;
let changeClassName: any = null;
let changeSetCustomStyle: any = null;

function onClickOverlay(): void {
  if (context.top) {
    context.top.close && context.top.close();
  }
}

function OverlayRoot(): JSX.Element {
  const [show, setShow] = useState(true);
  const [zIndex, setzIndex] = useState(context.zIndex);
  const [className, setClassName] = useState('');
  const [customStyle, setCustomStyle] = useState({});

  changeShow = setShow;
  changezIndex = setzIndex;
  changeClassName = setClassName;
  changeSetCustomStyle = setCustomStyle;

  return (
    <Overlay
      onClick={onClickOverlay}
      show={show}
      zIndex={zIndex}
      className={className}
      customStyle={customStyle}
    />
  );
}
OverlayRoot._uid = 0;

/**
 * Overlay render
 */
let rendered = false;
let ovelayRootDom: HTMLElement | null = null;
const containerName = `${prefix}overlay-container`;

function overlayRender(mountElem?: MountElem): void {
  let finalMountElem;
  if (typeof mountElem === 'function') {
    finalMountElem = mountElem();
  } else {
    finalMountElem =
      mountElem ||
      (typeof window !== 'undefined' ? document.getElementsByTagName('body')[0] : null);
  }
  if (!rendered) {
    rendered = true;
    if (finalMountElem) {
      ovelayRootDom = document.createElement('div');

      ovelayRootDom.setAttribute('id', `${containerName}-${OverlayRoot._uid++}`);
      finalMountElem.appendChild(ovelayRootDom);

      ReactDOM.render(<OverlayRoot />, ovelayRootDom);
    }
  } else {
    if (finalMountElem && ovelayRootDom) {
      if (Array.from(finalMountElem.childNodes).indexOf(ovelayRootDom) === -1) {
        finalMountElem.appendChild(ovelayRootDom);
      }
    }
  }
}

/**
 * Overlay update
 */
function updateOverlay(mountElem?: MountElem): void {
  overlayRender(mountElem);

  if (context.top) {
    const { zIndex, className, customStyle } = context.top.config;
    const showOverlay = (): void => {
      changeShow(true);
      changezIndex(zIndex);

      changeClassName(className || '');

      if (customStyle) {
        changeSetCustomStyle(customStyle);
      }
    };
    // fix double lazy-inited popup
    setTimeout(() => {
      showOverlay();
    });
  } else {
    changeShow(false);
  }
}

export function openOverlay(close: () => void, config: OverlayConfig): void {
  if (!context.stack.some(item => item.close === close)) {
    context.stack.push({ close, config });

    updateOverlay(config.mountElem);
  }
}

export function closeOverlay(close: () => void): void {
  const { stack } = context;

  if (stack.length) {
    if (context.top.close === close) {
      stack.pop();
      updateOverlay(context.top?.config.mountElem);
    } else {
      context.stack = stack.filter(item => item.close !== close);
    }
  }
}

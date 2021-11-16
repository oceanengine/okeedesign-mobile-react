/**
 *
 */
type ScrollElement = HTMLElement | Window;

const overflowScrollReg = /scroll|auto/i;

export function getScrollEventTarget(
  element: HTMLElement,
  rootParent: ScrollElement = window,
): ScrollElement {
  let node = element;

  while (node && node.tagName !== 'HTML' && node.nodeType === 1 && node !== rootParent) {
    const { overflowY } = window.getComputedStyle(node);

    if (overflowScrollReg.test(overflowY as string)) {
      if (node.tagName !== 'BODY') {
        return node;
      }

      const { overflowY: htmlOverflowY } = window.getComputedStyle(node.parentNode as Element);

      if (overflowScrollReg.test(htmlOverflowY as string)) {
        return node;
      }
    }
    node = node.parentNode as HTMLElement;
  }

  return rootParent;
}

export function getScrollBottom(element: ScrollElement): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  let scrollElement;
  if (element === window) {
    scrollElement = window.document.documentElement;
  } else {
    scrollElement = element as HTMLElement;
  }
  return scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
}

export function getScrollTop(element: ScrollElement): number {
  return 'scrollTop' in element ? element.scrollTop : element.pageYOffset;
}

export function setScrollTop(element: ScrollElement, value: number): void {
  'scrollTop' in element ? (element.scrollTop = value) : element.scrollTo(element.scrollX, value);
}

export function getRootScrollTop(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function setRootScrollTop(value: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}

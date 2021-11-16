/* eslint-disable semi */
/*
 * utils 公有 type
 */

export type RenderFunction<T = {}> = (props: T) => JSX.Element | null;

export type RenderContent<T = {}> =
  | string
  | number
  | JSX.Element
  | RenderFunction<T extends undefined ? void : T>;

export declare type UnionOmit<T, K> = T & Omit<K, keyof T>;

export function render<T>(
  renderFunction: string | JSX.Element | RenderFunction<T | undefined>,
  props?: T,
): string | JSX.Element | null {
  if (typeof renderFunction === 'function') {
    return renderFunction(props);
  }
  return renderFunction;
}

export type DefaultTextAlignType = 'start' | 'end' | 'left' | 'right' | 'center';

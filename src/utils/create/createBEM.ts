import { createBEM } from './bem';

/**
 * 全局bem创建函数
 */
export const prefix = 'omui-';

export default function create(name: string): ReturnType<typeof createBEM> {
  return createBEM(`${prefix}${name}`);
}

export function addClass(
  base: string,
  ...classNames: (string | undefined | null | boolean | Array<string>)[]
): string {
  let result = base;
  for (let i = 0; i < classNames.length; i++) {
    const className = classNames[i];
    if (className) {
      if (Array.isArray(className)) {
        result = addClass(result, className);
      } else {
        result = `${result} ${className}`;
      }
    }
  }
  return result;
}

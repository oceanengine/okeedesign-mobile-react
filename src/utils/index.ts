/**
 * 全局运行环境判断
 */
export const isServer = typeof window === 'undefined';

/**
 * 定义判断函数
 */
export function isDef(value: any): boolean {
  return value !== undefined && value !== null;
}

/**
 * 根据path取object中的value
 */
let result: any = {};
let keys: string[] = [];

export function get(object: any, path: string): any {
  result = object;
  keys = path.split('.');

  keys.forEach(key => {
    result = isDef(result[key]) ? result[key] : '';
  });
  return result;
}

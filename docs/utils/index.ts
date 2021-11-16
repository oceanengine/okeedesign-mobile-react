/**
 * 工具函数
 */
/**
 * this interface from '@types/webpack-env'
 */


const ua: string = navigator.userAgent;
export const isMobile: boolean = /ios|iphone|ipod|ipad|android/i.test(ua);
export interface RequireContext {
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
}

export interface ImportMap {
  [key: string]: RequireContext;
}

// https://webpack.docschina.org/guides/dependency-management/
export function importAll(map: ImportMap, r: RequireContext): void {
  r.keys().forEach(key => {
    map[key] = r(key)
  })
}

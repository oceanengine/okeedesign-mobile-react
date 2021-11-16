import { createBEM } from './bem';
import { createI18N } from './i18n';

/**
 * 全局函数
 */
const prefix = 'omui-';

type CreateNamespaceReturn = [ReturnType<typeof createBEM>, ReturnType<typeof createI18N>];

export function createNamespace(name: string): CreateNamespaceReturn {
  return [createBEM(`${prefix}${name}`), createI18N(name)];
}

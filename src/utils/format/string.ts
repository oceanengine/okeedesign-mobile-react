/**
 * 驼峰处理
 * b(okee-button) // 'okeeButton'
 */
export function camelize(str: string): string {
  return str.replace(/-(\w)/g, (_match, p1) => p1.toUpperCase());
}

export function upperCamelize(str: string): string {
  return camelize(str).replace(/^(\w)/, (_match, p1) => p1.toUpperCase());
}

/**
 * 多语言文案翻译
 * @param msg 源文案
 * @param options 格式化选项
 * @example
 * translate('normal text') // 'normal text'
 * translate('已选 {num} 项', { num: 10 }) // '已选 10 项'
 * translate('escape {{ brace }} ') // 'escape brace'
 */
const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;

/**
 * 获取字符长度
 * 数字英文算一个字符长度 汉字算两个字符长度
 */
export function getStringLen(str: string): number {
  // eslint-disable-next-line no-control-regex
  return !str ? 0 : str.replace(/[^\x00-\xff]/g, 'oe').length;
}

export function translate(msg: string, options: any): string {
  if (options.length === 1 && typeof options[0] === 'object') {
    options = options[0];
  }

  if (!options || !options.hasOwnProperty) {
    options = {};
  }

  return msg.replace(RE_NARGS, (match, prefix, i, index) => {
    let result;

    if (msg[index - 1] === '{' && msg[index + match.length] === '}') {
      return i;
    } else {
      result = Object.prototype.hasOwnProperty.call(options, i) ? options[i] : null;
      if (result === null || result === undefined) {
        return '';
      }

      return result;
    }
  });
}

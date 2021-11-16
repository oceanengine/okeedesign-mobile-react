/**
 * bem helper
 * bem() // 'button'
 * bem('text') // 'button__text'
 * bem('text', 'color') // 'button__text button__text--color'
 * bem({ disabled }) // 'button button--disabled'
 * bem('text', { disabled }) // 'button__text button__text--disabled'
 * bem(['primary', 'large']) // 'button button--primary button--large'
 */

type Mod = string | { [key: string]: any };
type Mods = Mod | Mod[];

const ELEMENT = '__';
const MODS = '--';

function join(name: string, el?: string | undefined, symbol?: string): string {
  return el ? name + symbol + el : name;
}

function prefix(name: string, mods: Mods): string {
  if (typeof mods === 'string') {
    return join(name, mods, MODS);
  }

  if (Array.isArray(mods)) {
    return mods.map(item => prefix(name, item)).join(' ');
  }

  const ret: string[] = [];
  if (mods) {
    Object.keys(mods).forEach(key => {
      if (mods[key]) {
        ret.push(name + MODS + key);
      }
    });
  }

  return ret.join(' ');
}

export function createBEM(name: string) {
  return function (el?: Mods, mods?: Mods): string {
    if (el && typeof el !== 'string') {
      mods = el;
      el = '';
    }

    el = join(name, el as string | undefined, ELEMENT);

    if (mods) {
      return `${el} ${prefix(el, mods)}`.trim();
    } else {
      return el;
    }
  };
}

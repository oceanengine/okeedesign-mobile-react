'use strict';

exports.__esModule = true;
exports.value2DomUnit = value2DomUnit;

/**
 * 串转px或者rem
 */
var unit = 'px';

function value2DomUnit(value, multiple) {
  if (value === void 0) {
    value = '';
  }

  if (multiple === void 0) {
    multiple = 1;
  }

  if (value === '') {
    return '';
  }

  if (typeof value === 'number') {
    return value * multiple + 'px';
  } else {
    unit = value.indexOf('rem') > -1 ? 'rem' : 'px';
    value = value.replace(/[^\d.]/g, '').trim();
    return '' + Number(value) * multiple + unit;
  }
}

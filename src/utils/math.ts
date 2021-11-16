/* eslint-disable semi */

/**
 * Limit the value in specified range.
 * @param min specify minimum value
 * @param max specify maximum value
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

/**
 * Create a function to limit the value in specified range.
 * @param min specify minimum value
 * @param max specify maximum value
 */
export function createClamp(min: number, max: number): (value: number) => number {
  return function (value: number): number {
    return clamp(value, min, max);
  };
}

/**
 * Transform a integer number to fit array index in loop.
 * @param index the raw index
 * @param length the length of array
 */
export function clampIndexLoop(index: number, length: number): number {
  if (!index) {
    return index;
  }

  const indexInt = Math.floor(index);
  const lengthInt = Math.floor(length);

  if (indexInt > 0) {
    return indexInt % lengthInt;
  }

  if (length === 1) {
    return 0;
  }

  return (indexInt % lengthInt) + lengthInt;
}

/**
 * Create a function to transform a integer number to fit array index in loop.
 * @param length the length of array
 */
export function createClampIndexLoop(length: number): (value: number) => number {
  return function (value: number): number {
    return clampIndexLoop(value, length);
  };
}

/**
 * Get correct index in a array.
 * If the array is empty (length 0), return -1.
 * @param length The length of the array
 * @param rawIndex The raw index to process
 */
export function getCorrectIndexInArray(length: number, rawIndex: number): number {
  if (length <= 0) {
    return -1;
  }
  const index = rawIndex % length;
  if (index < 0) {
    return length + index;
  }
  return index;
}

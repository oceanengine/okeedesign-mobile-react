export function findClosestNumber(value: number, set: number[]): number {
  if (!set.length) return value;

  let closestValue = set[0];
  for (let i = 0; i < set.length; i++) {
    if (Math.abs(value - set[i]) < Math.abs(value - closestValue)) {
      closestValue = set[i];
    }
  }
  return closestValue;
}

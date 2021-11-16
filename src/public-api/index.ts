import { context } from '../common/popup/context';

export function getZIndex(): number {
  return context.zIndex;
}

export function setZIndex(zIndex: number): void {
  context.zIndex = zIndex;
}

export { useZIndex } from '../common/popup/context';

export { getMonthWeekByDate, getDateByMonthWeek } from '../utils/format/date';

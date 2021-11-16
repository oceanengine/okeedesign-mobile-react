import dayjs from 'dayjs';

export type DateTimePickerValue = Date | string;
export type DateTimePickerType =
  | 'date'
  | 'datetime'
  | 'time'
  | 'year'
  | 'month'
  | 'tosecond'
  | 'monthweek';

function getRange(min: number, max: number): number[] {
  if (min > max) {
    return [];
  }
  const theRange = [];
  while (min <= max) {
    theRange.push(min);
    min++;
  }
  return theRange;
}

export function date2RangeLimit(now: Date, interval: number): Date[] {
  return [
    dayjs(now).subtract(interval, 'year').startOf('year').toDate(),
    dayjs(now).add(interval, 'year').endOf('year').toDate(),
  ];
}

export function date2Array(date: DateTimePickerValue): number[] {
  const defaultDate = dayjs(date || '');

  if (!defaultDate.isValid()) {
    console.error(date.toString() + 'is not a valid date');
    return [];
  }

  return [
    +defaultDate.year(),
    +defaultDate.month(),
    +defaultDate.date(),
    +defaultDate.hour(),
    +defaultDate.minute(),
    +defaultDate.second(),
  ];
}

export function getMonthWeekRange(date: string, weekStart = 1): number {
  const currentMonth = dayjs(date, 'YYYYMM');
  const monthNo = currentMonth.month();
  const weekEnd = weekStart - 1 >= 0 ? weekStart - 1 : 6;
  let endDate = dayjs(currentMonth);
  if (endDate.day() > weekEnd) {
    endDate = endDate.add(1, 'week');
  }
  endDate = endDate.day(weekEnd);
  let weekNo = 1;
  while (endDate.month() === monthNo) {
    if (dayjs(currentMonth).add(1, 'month').date(0).date() === endDate.date()) {
      break;
    }
    weekNo++;
    endDate = endDate.add(1, 'week');
  }
  return weekNo;
}

/**
 * @param closeInterval 判断时区时，是否使用闭区间
 */
export function getTargetMonthWeekNo(
  date: string,
  targetDate: DateTimePickerValue,
  weekStart = 1,
): number {
  const currentMonth = dayjs(date, 'YYYYMM');

  const target = dayjs(targetDate);

  const monthNo = currentMonth.month();

  const weekEnd = weekStart - 1 >= 0 ? weekStart - 1 : 6;

  // endDate 初始值为当月第一周的第一天
  let endDate = dayjs(currentMonth);
  if (endDate.day() > weekEnd) {
    endDate = endDate.add(1, 'week');
  }
  endDate = endDate.day(weekEnd).hour(23).minute(59).second(59);
  let weekNo = 1;
  while (endDate.month() === monthNo) {
    if (!target.isAfter(endDate)) {
      break;
    }
    if (dayjs(currentMonth).add(1, 'month').date(0).date() === endDate.date()) {
      return 0;
    }
    weekNo++;
    endDate = endDate.add(1, 'week');
  }
  return weekNo;
}

export function getTargetMonthWeekDate(date: string, weekNo: number, weekStart = 1): Date[] {
  let startMonth = dayjs(date, 'YYYYMM');
  if (startMonth.day() < weekStart) {
    startMonth = startMonth.add(weekStart - startMonth.day(), 'day').add(-1, 'week');
  } else {
    startMonth = startMonth.add(weekStart - startMonth.day(), 'day');
  }
  startMonth = startMonth.add(weekNo - 1, 'week');
  return [startMonth.toDate(), startMonth.add(1, 'week').add(-1, 'day').toDate()];
}

export function date2Options(
  date: DateTimePickerValue,
  minDate: DateTimePickerValue,
  maxDate: DateTimePickerValue,
  weekStart = 1,
): number[][] {
  const defaultDate = dayjs(date || '');

  if (!defaultDate.isValid()) {
    console.error(date.toString() + 'is not a valid date');
    return [];
  }

  const minDateWrapper = dayjs(minDate);
  const maxDateWrapper = dayjs(maxDate);

  const yearRange = getRange(minDateWrapper.year(), maxDateWrapper.year());
  let minMonth = 1;
  let maxMonth = 12;
  if (minDateWrapper.year() === defaultDate.year()) {
    minMonth = minDateWrapper.month() + 1;
  }
  if (maxDateWrapper.year() === defaultDate.year()) {
    maxMonth = maxDateWrapper.month() + 1;
  }
  const monthRange = getRange(minMonth, maxMonth);

  let theMinMonthWeek = 1;
  let theMaxMonthWeek = getMonthWeekRange(defaultDate.format('YYYYMM'));
  if (minDateWrapper.format('YYYYMM') === defaultDate.format('YYYYMM')) {
    theMinMonthWeek = getTargetMonthWeekNo(
      defaultDate.format('YYYYMM'),
      minDateWrapper.toDate(),
      weekStart,
    );
  }
  if (maxDateWrapper.format('YYYYMM') === defaultDate.format('YYYYMM')) {
    theMaxMonthWeek = getTargetMonthWeekNo(
      defaultDate.format('YYYYMM'),
      maxDateWrapper.toDate(),
      weekStart,
    );
  }
  const monthWeekRange = getRange(theMinMonthWeek, theMaxMonthWeek);

  let theMinDate = 1;
  let theMaxDate = defaultDate
    .month(defaultDate.month() + 1)
    .date(0)
    .date();
  if (minDateWrapper.format('YYYYMM') === defaultDate.format('YYYYMM')) {
    theMinDate = minDateWrapper.date();
  }
  if (maxDateWrapper.format('YYYYMM') === defaultDate.format('YYYYMM')) {
    theMaxDate = maxDateWrapper.date();
  }
  const dateRange = getRange(theMinDate, theMaxDate);

  let minHour = 0;
  let maxHour = 23;
  if (minDateWrapper.format('YYYYMMDD') === defaultDate.format('YYYYMMDD')) {
    minHour = minDateWrapper.hour();
  }
  if (maxDateWrapper.format('YYYYMMDD') === defaultDate.format('YYYYMMDD')) {
    maxHour = maxDateWrapper.hour();
  }
  const hourRange = getRange(minHour, maxHour);

  let minMinute = 0;
  let maxMinute = 59;
  if (minDateWrapper.format('YYYYMMDDHH') === defaultDate.format('YYYYMMDDHH')) {
    minMinute = minDateWrapper.minute();
  }
  if (maxDateWrapper.format('YYYYMMDDHH') === defaultDate.format('YYYYMMDDHH')) {
    maxMinute = maxDateWrapper.minute();
  }
  const minuteRange = getRange(minMinute, maxMinute);

  let minSecond = 0;
  let maxSecond = 59;
  if (minDateWrapper.format('YYYYMMDDHHmm') === defaultDate.format('YYYYMMDDHHmm')) {
    minSecond = minDateWrapper.second();
  }
  if (maxDateWrapper.format('YYYYMMDDHHmm') === defaultDate.format('YYYYMMDDHHmm')) {
    maxSecond = maxDateWrapper.second();
  }
  const secondRange = getRange(minSecond, maxSecond);

  return [yearRange, monthRange, dateRange, hourRange, minuteRange, secondRange, monthWeekRange];
}

export function padZero(month: number | string): string {
  return `${month}`.padStart(2, '0');
}

export function adjustDate(
  date: DateTimePickerValue,
  minDate: Date,
  maxDate: Date,
  weekStart = 1,
): Date {
  let index = 0;
  let dateWrapper = dayjs(date);
  const newDate = [
    +dateWrapper.format('YYYY'),
    +dateWrapper.format('MM'),
    +dateWrapper.format('DD'),
    +dateWrapper.format('HH'),
    +dateWrapper.format('mm'),
    +dateWrapper.format('ss'),
  ];

  let dateOptions = [];
  do {
    dateOptions = date2Options(dateWrapper.toDate(), minDate, maxDate, weekStart);
    if (newDate[index] < dateOptions[index][0]) {
      newDate[index] = dateOptions[index][0];
    }
    if (newDate[index] > dateOptions[index][dateOptions[index].length - 1]) {
      newDate[index] = dateOptions[index][dateOptions[index].length - 1];
    }
    dateWrapper = dayjs()
      .year(newDate[0])
      .month(newDate[1] - 1)
      .date(newDate[2])
      .hour(newDate[3])
      .minute(newDate[4])
      .second(newDate[5]);
    index++;
  } while (index in newDate);

  return dateWrapper.toDate();
}

export function adjustMonthWeek(
  date: DateTimePickerValue,
  minDate: DateTimePickerValue,
  maxDate: DateTimePickerValue,
  weekStart = 1,
): DateTimePickerValue {
  const monthWeek = date as string;

  // const

  const newDate: Record<number, number> = {
    [0]: +monthWeek.slice(0, 4),
    [1]: +monthWeek.slice(4, 6),
    [6]: +monthWeek.slice(6),
  };
  let dateOptions = [];
  const finalValue = [];
  for (const index in newDate) {
    dateOptions = date2Options(monthWeek, minDate, maxDate, weekStart);
    if (newDate[index] < dateOptions[index][0]) {
      newDate[index] = dateOptions[index][0];
    }
    if (newDate[index] > dateOptions[index][dateOptions[index].length - 1]) {
      newDate[index] = dateOptions[index][dateOptions[index].length - 1];
    }
    finalValue.push(padZero(newDate[index]));
  }
  return finalValue.join('');
}

export function getMonthWeekByDate(date?: Date): string {
  const dateWrapper = dayjs(date);
  const weekNo = getTargetMonthWeekNo(dateWrapper.format('YYYYMM'), dateWrapper.toDate());
  return `${dateWrapper.format('YYYYMM')}${padZero(weekNo)}`;
}

export function getDateByMonthWeek(monthWeek: string): Date[] {
  return getTargetMonthWeekDate(monthWeek.slice(0, 6), parseInt(monthWeek.slice(6), 10));
}

export function getMonthWeekLimitDate(minDate: Date, maxDate: Date, weekStart = 1): Date[] {
  const minDateWrapper = dayjs(minDate);
  const maxDateWrapper = dayjs(maxDate);

  const minWeekNo = getTargetMonthWeekNo(minDateWrapper.format('YYYYMM'), minDate, weekStart);
  const minDateRange = getMonthWeekRange(minDateWrapper.format('YYYYMM'), weekStart);
  let finalMinDate;
  if (minWeekNo === minDateRange) {
    [finalMinDate] = getDateByMonthWeek(minDateWrapper.add(1, 'month').format('YYYYMM') + '02');
  } else {
    [finalMinDate] = getDateByMonthWeek(minDateWrapper.format('YYYYMM') + padZero(minWeekNo + 1));
  }

  const maxWeekNo = getTargetMonthWeekNo(maxDateWrapper.format('YYYYMM'), maxDate, weekStart);
  let finalMaxDate;
  if (maxWeekNo === 1) {
    const maxDateRange = getMonthWeekRange(
      maxDateWrapper.add(-1, 'month').format('YYYYMM'),
      weekStart,
    );
    [finalMaxDate] = getDateByMonthWeek(
      maxDateWrapper.add(-1, 'month').format('YYYYMM') + padZero(maxDateRange - 1),
    );
  } else {
    [finalMaxDate] = getDateByMonthWeek(maxDateWrapper.format('YYYYMM') + padZero(maxWeekNo - 1));
  }

  return [finalMinDate, finalMaxDate];
}

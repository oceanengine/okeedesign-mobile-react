import React, { HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import createBEM from '../../utils/create/createBEM';
import type { UnionOmit } from '../../utils/types';
import {
  adjustDate,
  adjustMonthWeek,
  date2Array,
  date2Options,
  date2RangeLimit,
  DateTimePickerType,
  DateTimePickerValue,
  getTargetMonthWeekDate,
  getTargetMonthWeekNo,
  padZero,
  getMonthWeekLimitDate,
} from '../../utils/format/date';
import type { PickerSelf } from '../picker';
import Picker from '../picker';
import dayjs from 'dayjs';
import { createI18N } from '../../utils/create/i18n';

export type { DateTimePickerType, DateTimePickerValue };
export type DateTimePickerPanel = 'left' | 'right';

export type DateFormatter = (...args: any[]) => string;
export interface DateTimePickerSelf
  extends Pick<
    PickerSelf,
    | 'title'
    | 'showToolbar'
    | 'confirmButtonText'
    | 'cancelButtonText'
    | 'onConfirm'
    | 'onCancel'
    | 'columnSequence'
  > {
  value: DateTimePickerValue | DateTimePickerValue[];
  type?: DateTimePickerType;
  range?: boolean;
  minDate?: Date;
  maxDate?: Date;
  weekStart?: number;
  initialPanel?: { direction: DateTimePickerPanel };
  formatters?: DateFormatter[];
  onChange?: (date: DateTimePickerValue | DateTimePickerValue[]) => void;
  onInput?: (date: DateTimePickerValue | DateTimePickerValue[]) => void;
}
export type DateTimePickerProps = UnionOmit<DateTimePickerSelf, HTMLAttributes<HTMLDivElement>>;

const bem = createBEM('date-time-picker');
const i18n = createI18N('datetimePicker');
function DateTimePicker(props: DateTimePickerProps): JSX.Element {
  const {
    value,
    type,
    range,
    minDate,
    maxDate,
    initialPanel,
    formatters,
    weekStart,
    onChange,
    onInput,
    ...attrs
  } = props;

  const translation = {
    title: i18n('title'),
    year: i18n('year'),
    month: i18n('month'),
    day: i18n('day'),
    hour: i18n('hour'),
    minute: i18n('minute'),
    second: i18n('second'),
  };

  const [datePanel, setDatePanel] = useState<DateTimePickerPanel>(initialPanel!.direction);

  useEffect(() => {
    if (datePanel !== initialPanel!.direction) {
      setDatePanel(initialPanel!.direction);
    }
  }, [initialPanel]);

  const now = useRef(new Date());
  const activeDate = useMemo(() => {
    let finalDate;
    if (range) {
      const dateRange = value as DateTimePickerValue[];
      if (datePanel === 'left') {
        finalDate = dateRange[0];
      } else {
        finalDate = dateRange[1];
      }
    } else {
      finalDate = value as DateTimePickerValue;
    }
    if (type === 'year') {
      if (typeof finalDate === 'string' && /^\d{4}$/.test(finalDate)) {
        finalDate = new Date(+finalDate, 0);
      }
    }
    if (type === 'monthweek') {
      if (finalDate) {
        return finalDate;
      } else {
        const yearMonth = dayjs(now.current).format('YYYYMM');
        return `${yearMonth}${padZero(getTargetMonthWeekNo(yearMonth, now.current, weekStart))}`;
      }
    }
    return dayjs(finalDate || now.current).toDate();
  }, [value, datePanel]);

  const setValue = useCallback(
    (theValue: DateTimePickerValue) => {
      let newValue: DateTimePickerValue[] | DateTimePickerValue = theValue;
      if (type !== 'monthweek') {
        if (range) {
          const dateRange = value as DateTimePickerValue[];
          if (datePanel === 'left') {
            newValue = [dayjs(theValue).toDate(), dayjs(dateRange[1] || now.current).toDate()];
          } else {
            newValue = [dayjs(dateRange[0] || now.current).toDate(), dayjs(theValue).toDate()];
          }
        } else {
          newValue = dayjs(theValue).toDate();
        }
      }
      onChange?.(newValue);
      onInput?.(newValue);
    },
    [range, datePanel],
  );

  const defaultValue = useMemo(() => {
    if (type === 'monthweek') {
      const monthWeekString = activeDate as string;
      return [
        +monthWeekString.slice(0, 4),
        +monthWeekString.slice(4, 6) - 1,
        +monthWeekString.slice(6),
      ];
    }
    const dateArray = date2Array(activeDate);

    if (type === 'time') {
      return [dateArray[3], dateArray[4]];
    }

    return dateArray;
  }, [activeDate]);

  const getLimitDate = useCallback((): Date[] => {
    let finalMinDate = minDate!;
    let finalMaxDate = maxDate!;
    if (range) {
      if (datePanel === 'left') {
        const rightDate = (value as DateTimePickerValue[])[1] || now.current;
        if (dayjs(rightDate).diff(dayjs(finalMaxDate)) < 0) {
          finalMaxDate = dayjs(rightDate).toDate();
        }
      } else {
        const leftDate = (value as DateTimePickerValue[])[0] || now.current;
        if (dayjs(leftDate).diff(dayjs(finalMinDate)) > 0) {
          finalMinDate = dayjs(leftDate).toDate();
        }
      }
    }
    return [finalMinDate, finalMaxDate];
  }, [activeDate, minDate, maxDate, range, datePanel]);

  const ranges = useMemo(() => {
    let [finalMinDate, finalMaxDate] = getLimitDate();

    if (type === 'monthweek') {
      [finalMinDate, finalMaxDate] = getMonthWeekLimitDate(finalMinDate, finalMaxDate, weekStart);
    }

    const [yearRange, monthRange, dateRange, hourRange, minuteRange, secondRange, monthWeekRange] =
      date2Options(activeDate, finalMinDate, finalMaxDate, weekStart);

    switch (type) {
      case 'datetime':
        return [
          yearRange.map(item => ({ value: item, label: `${item}${translation.year}` })),
          monthRange.map(item => ({ value: item - 1, label: `${item}${translation.month}` })),
          dateRange.map(item => ({ value: item, label: `${item}${translation.day}` })),
          hourRange.map(item => ({ value: item, label: `${item}${translation.hour}` })),
          minuteRange.map(item => ({ value: item, label: `${item}${translation.minute}` })),
        ];
      case 'time':
        return [
          hourRange.map(item => ({ value: item, label: `${item}${translation.hour}` })),
          minuteRange.map(item => ({ value: item, label: `${item}${translation.minute}` })),
        ];
      case 'year':
        return [yearRange.map(item => ({ value: item, label: `${item}${translation.year}` }))];
      case 'month':
        return [
          yearRange.map(item => ({ value: item, label: `${item}${translation.year}` })),
          monthRange.map(item => ({ value: item - 1, label: `${item}${translation.month}` })),
        ];
      case 'tosecond':
        return [
          yearRange.map(item => ({ value: item, label: `${item}${translation.year}` })),
          monthRange.map(item => ({ value: item - 1, label: `${item}${translation.month}` })),
          dateRange.map(item => ({ value: item, label: `${item}${translation.day}` })),
          hourRange.map(item => ({ value: item, label: `${item}${translation.hour}` })),
          minuteRange.map(item => ({ value: item, label: `${item}${translation.minute}` })),
          secondRange.map(item => ({ value: item, label: `${item}${translation.second}` })),
        ];
      case 'monthweek':
        return [
          yearRange.map(item => ({ value: item, label: `${item}${translation.year}` })),
          monthRange.map(item => ({ value: item - 1, label: `${item}${translation.month}` })),
          monthWeekRange.map(item => {
            const monthWeekString = activeDate as string;
            const [theWeekStart, weekEnd] = getTargetMonthWeekDate(
              `${monthWeekString.slice(0, 6)}`,
              item,
              weekStart,
            );
            return {
              value: item,
              label: `第${item}周(${padZero(theWeekStart.getDate())}-${padZero(
                weekEnd.getDate(),
              )})`,
            };
          }),
        ];
      default:
        return [
          yearRange.map(item => ({ value: item, label: `${item}${translation.year}` })),
          monthRange.map(item => ({ value: item - 1, label: `${item}${translation.month}` })),
          dateRange.map(item => ({ value: item, label: `${item}${translation.day}` })),
        ];
    }
  }, [activeDate, type, minDate, maxDate]);

  const formattedRanges = useMemo(() => {
    if (formatters) {
      return ranges.map((theRange, index) => {
        if (formatters[index]) {
          return theRange.map(({ value, label }) => {
            return {
              value,
              label: formatters[index](value, activeDate, label),
            };
          });
        }
        return theRange;
      });
    }
    return ranges;
  }, [formatters, ranges, activeDate]);

  const onDateChange = (newValue: string[]): void => {
    newValue = ([] as string[]).concat(newValue);
    let newDate;
    let [finalMinDate, finalMaxDate] = getLimitDate();

    if (type === 'time' || type === 'year' || type === 'month' || type === 'monthweek') {
      switch (type) {
        case 'time':
          newDate = dayjs()
            .hour(+newValue[0])
            .minute(+newValue[1])
            .toDate();
          break;
        case 'year':
          newDate = dayjs()
            .year(+newValue[0])
            .toDate();
          break;
        case 'month':
          newDate = dayjs()
            .year(+newValue[0])
            .month(+newValue[1])
            .toDate();
          break;
        case 'monthweek': {
          const oldDate = activeDate as string;
          newDate = `${newValue[0]}${padZero(newValue[1] + 1)}${padZero(newValue[2])}`;
          // if current week is overlayed when switching month
          // switch to the same week
          const [oldStartDate, oldEndDate] = getTargetMonthWeekDate(
            oldDate.slice(0, 6),
            +oldDate.slice(6),
            weekStart,
          );
          if (
            Math.abs(+oldDate.slice(4, 6) - +newDate.slice(4, 6)) === 1 &&
            (oldStartDate.getMonth() === +newDate.slice(4, 6) - 1 ||
              oldEndDate.getMonth() === +newDate.slice(4, 6) - 1)
          ) {
            newDate = `${newDate.slice(0, 6)}${padZero(
              getTargetMonthWeekNo(newDate.slice(0, 6), oldStartDate, weekStart),
            )}`;
          }
          [finalMinDate, finalMaxDate] = getMonthWeekLimitDate(
            finalMinDate,
            finalMaxDate,
            weekStart,
          );
          setValue(adjustMonthWeek(newDate, finalMinDate, finalMaxDate, weekStart));
          return;
        }
      }
    } else {
      let monthDays = dayjs()
        .year(+newValue[0])
        .month(+newValue[1] + 1)
        .date(0)
        .date();
      monthDays = monthDays < +newValue[2] ? monthDays : +newValue[2];

      switch (type) {
        case 'datetime':
          newDate = dayjs()
            .year(+newValue[0])
            .month(+newValue[1])
            .date(monthDays)
            .hour(+newValue[3])
            .minute(+newValue[4])
            .second(0)
            .toDate();
          break;
        case 'tosecond':
          newDate = dayjs()
            .year(+newValue[0])
            .month(+newValue[1])
            .date(monthDays)
            .hour(+newValue[3])
            .minute(+newValue[4])
            .second(+newValue[5])
            .toDate();
          break;
        default:
          newDate = dayjs()
            .year(+newValue[0])
            .month(+newValue[1])
            .date(monthDays)
            .hour(0)
            .minute(0)
            .second(0)
            .toDate();
      }
    }

    setValue(adjustDate(newDate, finalMinDate, finalMaxDate, weekStart));
  };

  const renderHead = (): JSX.Element => {
    if (range) {
      const dateRange = value as DateTimePickerValue[];
      const startDate = dateRange[0] || now.current;
      const endDate = dateRange[1] || now.current;

      const DATE_FORMAT = 'YYYY-MM-DD';

      return (
        <div className={bem('range')}>
          <div
            className={bem('range__start', { active: datePanel === 'left' })}
            onClick={setDatePanel.bind(null, 'left')}
          >
            {dayjs(startDate).format(DATE_FORMAT)}
          </div>
          <div
            className={bem('range__end', { active: datePanel === 'right' })}
            onClick={setDatePanel.bind(null, 'right')}
          >
            {dayjs(endDate).format(DATE_FORMAT)}
          </div>
          <div className={bem('range__label')}>～</div>
        </div>
      );
    }
    return <div></div>;
  };

  return (
    <div className={bem()}>
      <Picker
        value={defaultValue}
        options={formattedRanges}
        onChange={onDateChange}
        renderHead={renderHead}
        title={translation.title}
        {...attrs}
      ></Picker>
    </div>
  );
}

const DEFAULT_LIMIT_INTERVAL = 20;
const limitRange = date2RangeLimit(new Date(), DEFAULT_LIMIT_INTERVAL);
DateTimePicker.defaultProps = {
  type: 'date',
  range: false,
  minDate: limitRange[0],
  maxDate: limitRange[1],
  weekStart: 1,
  initialPanel: { direction: 'left' },
};

export default DateTimePicker;

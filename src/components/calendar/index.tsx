/* eslint-disable semi */
import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';

import Icon from '../icon';

import createBEM from '../../utils/create/createBEM';
import { createI18N } from '../../utils/create/i18n';
import {
  TouchHookEventHandlerCallback,
  TouchHookState,
  useRefCallback,
  useTouch,
} from '../../hooks';
import { preventDefault } from '../../utils/dom/event';
import Toolbar, { ToolbarProps } from '../toolbar';

export type CalendarValue = Date | string;

export type CalendarOnChange = (value: CalendarValue | CalendarValue[]) => void;

export type CalendarSelectMode = 'single' | 'multi' | 'range';

export interface CalendarProps extends Omit<ToolbarProps, 'showToolbar'> {
  value?: CalendarValue | CalendarValue[];
  defaultValue?: CalendarValue | CalendarValue[];
  onChange?: CalendarOnChange;

  mode?: CalendarSelectMode;

  isDateDisabled?: (value: Date) => boolean;

  fixedStartDate?: boolean;
  fixedEndDate?: boolean;

  showHeader?: boolean;
}

const ROW_COUNT = 6;
const WEEK_COUNT = 7;

const WEEK_START = 0;

const DAY_FORMAT = 'YYYYMMDD';

const TRANSITION_DURATION = 300;

const SPEED_LIMIT = 0.2;

type DecoratedDate = {
  date: Date;
  number: number;
  isWeekend: boolean;
  isCrossMonth: boolean;
  isDisabled: boolean;
  isToday?: boolean;
  isActive?: boolean;
  isSurrounded?: boolean;
  isLeft?: boolean;
  isRight?: boolean;
};

function formatDateToString(date: CalendarValue): Date {
  return dayjs(dayjs(date).format(DAY_FORMAT)).toDate();
}

function getDateList(
  startDate: Date,
  dayCount: number,
  isDateDisabled: (value: Date) => boolean,
  fixedStartDate: Date | false,
  fixedEndDate: Date | false,
): DecoratedDate[] {
  let currentDay = dayjs(startDate);
  let currentYear = currentDay.year();
  let currentMonth;
  if (currentDay.date() === 1) {
    currentMonth = currentDay.month();
    currentYear = currentDay.year();
  } else {
    currentMonth = dayjs(currentDay).add(1, 'month').month();
    currentYear = dayjs(currentDay).add(1, 'month').year();
  }
  let counter = dayCount;

  const today = dayjs();

  const list: DecoratedDate[] = [];

  while (counter) {
    const theDay = currentDay.day();

    let isDisabled;
    if (fixedStartDate) {
      isDisabled = dayjs(currentDay).isBefore(fixedStartDate);
    } else if (fixedEndDate) {
      isDisabled = dayjs(currentDay).isAfter(fixedEndDate);
    }

    list.push({
      date: currentDay.toDate(),
      number: currentDay.date(),
      isCrossMonth: !(currentDay.year() === currentYear && currentDay.month() === currentMonth),
      isWeekend: theDay === 0 || theDay === 6,
      isDisabled: isDisabled || isDateDisabled(currentDay.toDate()),
      isToday: today.format(DAY_FORMAT) === currentDay.format(DAY_FORMAT),
    });
    currentDay = dayjs(currentDay).add(1, 'day');
    counter--;
  }
  return list;
}

function getDyeingDateList(
  dateList: DecoratedDate[],
  mode: CalendarSelectMode,
  innerValue: Date[],
): DecoratedDate[] {
  if (mode === 'range' && innerValue.length) {
    const rangeStart = dayjs(innerValue[0]);
    const rangeEnd = dayjs(innerValue[1] || innerValue[0]);

    const isOneDay = rangeStart.isSame(rangeEnd);

    return dateList.map((item: DecoratedDate) => {
      if (rangeStart.isSame(item.date) || rangeEnd.isSame(item.date)) {
        return Object.assign({}, item, {
          isActive: true,
          isLeft: !isOneDay && rangeStart.isSame(item.date),
          isRight: !isOneDay && rangeEnd.isSame(item.date),
        });
      }
      if (rangeStart.isBefore(item.date) && rangeEnd.isAfter(item.date)) {
        return Object.assign({}, item, {
          isSurrounded: true,
        });
      }
      return item;
    });
  }

  if (mode === 'single' || mode === 'multi') {
    return dateList.map((item: DecoratedDate) => {
      if (
        innerValue.some(selectedValue => {
          return dayjs(selectedValue).isSame(item.date);
        })
      ) {
        return Object.assign({}, item, {
          isActive: true,
        });
      }
      return item;
    });
  }

  return dateList;
}

const bem = createBEM('calendar');
const i18n = createI18N('calendar');

function Calendar(props: CalendarProps): JSX.Element {
  const {
    value,
    defaultValue,

    mode,

    fixedStartDate,
    fixedEndDate,

    showHeader,

    onChange,
    onCancel,
    onConfirm,
  } = props;

  const translation = {
    0: i18n('0'),
    1: i18n('1'),
    2: i18n('2'),
    3: i18n('3'),
    4: i18n('4'),
    5: i18n('5'),
    6: i18n('6'),
    year: i18n('year'),
    month: i18n('month'),
  };

  const now = new Date();

  // 决定日历初始位置
  const initialValue = useRef<CalendarValue | null>();
  if (!initialValue.current) {
    const assuredValue = value || defaultValue;
    if (Array.isArray(assuredValue)) {
      if (assuredValue.length) {
        initialValue.current = assuredValue[0] || assuredValue[1];
      } else {
        initialValue.current = now;
      }
    } else {
      initialValue.current = (assuredValue as CalendarValue) || now;
    }
  }

  // 日历位置
  const [activeDate, setActiveDate] = useState<Date>(() => {
    return dayjs(initialValue.current!).toDate();
  });

  const initInnerValue = (): Date[] => {
    if (mode === 'single') {
      return [
        value || defaultValue ? formatDateToString((value || defaultValue) as CalendarValue) : now,
      ];
    }
    return ((value || defaultValue || []) as CalendarValue[]).map(item => {
      return formatDateToString(item);
    });
  };

  // 受控模式: 可以抽象成 hook
  // 为方便操作, 所有内在值都处理为数组
  const [innerValue, setInnerValue] = useState<Date[]>(initInnerValue);

  useEffect(() => {
    setInnerValue(initInnerValue());
  }, [value]);

  const movingCallback = useRef<() => void>(() => {});

  const [moving, setMoving] = useState(false);
  const [movingReady, setMovingReady] = useState(false);
  const [targetDate, setTargetDate] = useState(() => {
    return activeDate;
  });

  useEffect(() => {
    if (moving) {
      setMovingReady(true);
    }
  }, [moving]);

  const currentYear = useMemo<number>(() => {
    return dayjs(activeDate).year();
  }, [activeDate]);

  const currentMonth = useMemo<number>(() => {
    return dayjs(activeDate).month() + 1;
  }, [activeDate]);

  const renderHeader = (): JSX.Element => {
    const {
      title,
      showCancelButton,
      showConfirmButton,

      confirmButtonText,
      cancelButtonText,
    } = props;

    return (
      <Toolbar
        showToolbar={showHeader}
        title={title}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        showCancelButton={showCancelButton}
        showConfirmButton={showConfirmButton}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
  };

  const onTimeChange = useRefCallback((nextDate: Date) => {
    if (moving) return;

    movingCallback.current = (): void => {
      setMoving(false);
      setMovingReady(false);
      setActiveDate(nextDate);
      movingCallback.current = (): void => {};
    };

    setMoving(true);
    setTargetDate(nextDate);
  });

  const onYearChange = useRefCallback((step: number) => {
    const nextDate = dayjs(activeDate).add(step, 'year').toDate();

    onTimeChange(nextDate);
  });

  const onMonthChange = useRefCallback((step: number) => {
    const nextDate = dayjs(activeDate).add(step, 'month').toDate();

    onTimeChange(nextDate);
  });

  const renderOperations = (): JSX.Element => {
    return (
      <div className={bem('operations')}>
        <div className={bem('operations__year')}>
          <div className={bem('operations__hotzone')} onClick={(): void => onYearChange(-1)}>
            <Icon name="ArrowLeft" className={bem('operations__icon')} />
          </div>
          <span className={bem('operations__title')}>{currentYear + translation.year}</span>
          <div className={bem('operations__hotzone')} onClick={(): void => onYearChange(1)}>
            <Icon name="ArrowRight" className={bem('operations__icon')} />
          </div>
        </div>
        <div className={bem('operations__month')}>
          <div className={bem('operations__hotzone')} onClick={(): void => onMonthChange(-1)}>
            <Icon name="ArrowLeft" className={bem('operations__icon')} />
          </div>
          <span className={bem('operations__title')}>{currentMonth + translation.month}</span>
          <div className={bem('operations__hotzone')} onClick={(): void => onMonthChange(1)}>
            <Icon name="ArrowRight" className={bem('operations__icon')} />
          </div>
        </div>
      </div>
    );
  };

  const onDateClick = useRefCallback((activeItem: DecoratedDate) => {
    if (moving || activeItem.isDisabled) return;

    let result: Date | Date[];
    if (mode === 'single') {
      result = activeItem.date;
    } else if (mode === 'multi') {
      if (activeItem.isActive) {
        result = innerValue.filter(item => {
          return !dayjs(item).isSame(activeItem.date);
        });
      } else {
        result = ([] as Date[]).concat(innerValue).concat(activeItem.date);
      }
    } else {
      if (fixedStartDate || fixedEndDate) {
        // existing fixed start date or fixed end date
        if (fixedStartDate) {
          result = [innerValue[0], activeItem.date];
        } else {
          result = [activeItem.date, innerValue[1]];
        }
      } else {
        if (innerValue.length === 0 || innerValue.length === 2) {
          result = [activeItem.date];
        } else {
          if (dayjs(innerValue[0]).isBefore(activeItem.date)) {
            result = [innerValue[0], activeItem.date];
          } else {
            result = [activeItem.date, innerValue[0]];
          }
        }
      }
    }

    if (typeof value === 'undefined') {
      setInnerValue(([] as Date[]).concat(result));
      onChange?.(result);
    } else {
      onChange?.(result);
    }

    // 处理点击后的动画
    if (mode === 'range') {
      setMoving(false);
      setMovingReady(false);
      return;
    }

    movingCallback.current = (): void => {
      setMoving(false);
      setMovingReady(false);
      setActiveDate(activeItem.date);
      movingCallback.current = (): void => {};
    };

    if (dayjs(activeItem.date).format('YYYYMM') === dayjs(activeDate).format('YYYYMM')) {
      movingCallback.current();
      return;
    }

    setMoving(true);
    setTargetDate(activeItem.date);
  });

  const onTransitionEnd = useRefCallback(() => {
    movingCallback.current();
  });

  const [touchMoving, setTouchMoving] = useState(false);
  const [touchDistance, setTouchDistance] = useState(0);
  const touchRef = useRef<HTMLDivElement>(null);

  const afterTouchStart: TouchHookEventHandlerCallback<HTMLDivElement> = event => {
    if (moving) {
      return;
    }

    if (event.touches.length === 1) {
      setTouchMoving(true);
    }
  };
  const afterTouchMove: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    if (event.touches.length === 1 && touchMoving) {
      const state = states[0] as TouchHookState;

      const { deltaX, direction } = state;

      if (direction === 'horizontal') {
        preventDefault(event as Event);

        const panelWidth = touchRef.current!.offsetWidth;

        const limitedDeltaX = Math.min(panelWidth, Math.max(deltaX, -panelWidth));

        setTouchDistance(limitedDeltaX);
      }
    }
  };
  const beforeTouchEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    if (!touchMoving) {
      return;
    }

    const state = states[0] as TouchHookState;

    // fix calendar touch state[0] undefined issue
    // cannot reproduce
    if (!state) {
      return;
    }

    const { direction, deltaX, speedX } = state;

    const panelWidth = touchRef.current!.offsetWidth;

    let finalTargetDate: Date | null = null;

    if (direction === 'vertical' || !deltaX) {
      setTouchMoving(false);
      return;
    }

    const extendSpeed = Math.abs(speedX) > SPEED_LIMIT;
    if (deltaX > 0) {
      if (deltaX > panelWidth / 2 || extendSpeed) {
        finalTargetDate = dayjs(activeDate).add(-1, 'month').toDate();
      }
    } else {
      if (deltaX < -panelWidth / 2 || extendSpeed) {
        finalTargetDate = dayjs(activeDate).add(1, 'month').toDate();
      }
    }

    if (finalTargetDate) {
      setTargetDate(finalTargetDate);
    }

    setMoving(true);

    movingCallback.current = (): void => {
      setMoving(false);
      setMovingReady(false);

      setTouchMoving(false);

      setTouchDistance(0);

      if (finalTargetDate) {
        setActiveDate(finalTargetDate);
      }

      movingCallback.current = (): void => {};
    };
  };

  const [, , { onTouchStart, onTouchMove, onTouchEnd }] = useTouch<HTMLDivElement>({
    afterTouchStart,
    afterTouchMove,
    beforeTouchEnd,
  });

  const renderPanel = (): JSX.Element => {
    const { isDateDisabled } = props;

    const renderIndicators = (): JSX.Element => {
      return (
        <div className={bem('panel__indicators')}>
          {Array.from(Array(7).keys())
            .map(index => {
              return translation[index as keyof typeof translation];
            })
            .map(text => {
              return (
                <div key={text} className={bem('panel__item')}>
                  {text}
                </div>
              );
            })}
        </div>
      );
    };

    const days = ROW_COUNT * WEEK_COUNT;

    const firstDay = dayjs(dayjs(activeDate).date(1).day(WEEK_START).format(DAY_FORMAT)).toDate();

    const dateList = getDateList(
      firstDay,
      days,
      isDateDisabled!,
      fixedStartDate ? innerValue[0] : false,
      fixedEndDate ? innerValue[1] : false,
    );

    const dyeingDateList = getDyeingDateList(dateList, mode!, innerValue);

    const renderDateList = (): JSX.Element => {
      return (
        <div className={bem('panel__date-list')}>
          {dyeingDateList.map((dateItem: DecoratedDate) => {
            const {
              isToday,
              isWeekend,
              isCrossMonth,
              isDisabled,
              isActive,
              isSurrounded,
              isLeft,
              isRight,
            } = dateItem;
            const itemClassName = bem('panel__item', [
              {
                isToday,
                isWeekend,
                isCrossMonth,
                isDisabled,
                isActive,
                isSurrounded,
                isLeft,
                isRight,
              },
            ]);

            return (
              <div
                key={dateItem.date.getTime()}
                className={itemClassName}
                onClick={(): void => onDateClick(dateItem)}
              >
                {dateItem.number}
              </div>
            );
          })}
        </div>
      );
    };

    let PanelContent;

    if (!moving && !touchMoving) {
      PanelContent = (
        <div className={bem('panel-track')}>
          <div className={bem('panel-view')} key="current">
            {renderIndicators()}
            {renderDateList()}
          </div>
        </div>
      );
    } else {
      // 目标 view 的月份视图
      let finalTargetDate: Date = targetDate;

      // 拖动过程
      if (touchMoving) {
        finalTargetDate = dayjs(activeDate)
          .add(touchDistance > 0 ? -1 : 1, 'month')
          .toDate();
      }

      const targetFirstDay = dayjs(
        dayjs(finalTargetDate).date(1).day(WEEK_START).format(DAY_FORMAT),
      ).toDate();

      const targetDateList = getDateList(
        targetFirstDay,
        days,
        isDateDisabled!,
        fixedStartDate ? innerValue[0] : false,
        fixedEndDate ? innerValue[1] : false,
      );

      const dyeingTargetDateList = getDyeingDateList(targetDateList, mode!, innerValue);

      const renderTargetDateList = (): JSX.Element => {
        return (
          <div className={bem('panel__date-list')}>
            {dyeingTargetDateList.map((dateItem: DecoratedDate) => {
              const { isToday, isWeekend, isCrossMonth, isDisabled, isActive, isSurrounded } =
                dateItem;
              const itemClassName = bem('panel__item', [
                {
                  isToday,
                  isWeekend,
                  isCrossMonth,
                  isDisabled,
                  isActive,
                  isSurrounded,
                },
              ]);

              return (
                <div key={dateItem.date.getTime()} className={itemClassName}>
                  {dateItem.number}
                </div>
              );
            })}
          </div>
        );
      };

      // 新日历放置位置
      const isAddRight = dayjs(finalTargetDate).isAfter(activeDate);
      // 视窗移动的方向
      let isRight = isAddRight;

      if (dayjs(finalTargetDate).diff(targetDate, 'month') !== 0) {
        isRight = !isRight;
      }

      const style: CSSProperties = {};

      if (!movingReady) {
        if (isAddRight) {
          // TODO
          // 如果不加 transform 的初始值, 有时会不触发 onTransitionEnd
          style.transform = 'translate3d(0, 0, 0)';
        } else {
          style.transform = 'translate3d(-100%, 0, 0)';
        }

        if (touchMoving) {
          if (isAddRight) {
            style.transform = `translate3d(0, 0, 0) translate3d(${touchDistance}px, 0, 0)`;
          } else {
            style.transform = `translate3d(-100%, 0, 0) translate3d(${touchDistance}px, 0, 0)`;
          }
        }
      } else {
        if (isAddRight) {
          style.transform = 'translate3d(-100%, 0, 0)';
        } else {
          style.transform = 'translate3d(0, 0, 0)';
        }

        style.transitionDuration = `${TRANSITION_DURATION}ms`;

        if (touchMoving) {
          if (touchDistance < 0) {
            if (isAddRight) {
              if (isRight) {
                style.transform = 'translate3d(-100%, 0, 0)';
              } else {
                style.transform = 'translate3d(0, 0, 0)';
              }
            }
          } else {
            if (!isAddRight) {
              if (!isRight) {
                style.transform = 'translate3d(0, 0, 0)';
              } else {
                style.transform = 'translate3d(-100%, 0, 0)';
              }
            }
          }
        }
      }

      PanelContent = (
        <div className={bem('panel-track')} style={style} onTransitionEnd={onTransitionEnd}>
          {isAddRight ? (
            <>
              <div className={bem('panel-view')} key="current">
                {renderIndicators()}
                {renderDateList()}
              </div>
              <div className={bem('panel-view')} key="left">
                {renderIndicators()}
                {renderTargetDateList()}
              </div>
            </>
          ) : (
            <>
              <div className={bem('panel-view')} key="right">
                {renderIndicators()}
                {renderTargetDateList()}
              </div>
              <div className={bem('panel-view')} key="current">
                {renderIndicators()}
                {renderDateList()}
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <div
        ref={touchRef}
        className={bem('panel')}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {PanelContent}
      </div>
    );
  };

  const renderShortcuts = (): JSX.Element => {
    return <div className={bem('shortcuts')}></div>;
  };

  return (
    <div className={bem()}>
      {showHeader && renderHeader()}
      {renderOperations()}
      {renderPanel()}
      {renderShortcuts()}
    </div>
  );
}

Calendar.defaultProps = {
  showHeader: true,
  showCancelButton: false,
  showConfirmButton: false,

  title: '日期选择',

  confirmButtonText: '确定',
  cancelButtonText: '取消',

  mode: 'single',

  isDateDisabled: (): boolean => false,
};

export default Calendar;

import * as React from 'react';
import createBEM, { addClass } from '../../utils/create/createBEM';
import {
  BaseTableColumnProps,
  TableCeilingOptionsType,
  TableColumnProps,
  TableDataProps,
  TableDataPropType,
  TableExpandOptionsType,
  TableSortType,
} from './types';
import { off, on, preventDefault } from '../../utils/dom/event';
import SortIcon from './sort-icon';
import Icon from '../icon';
import { EmptyContent, EmptyContentProps } from './empty-content';
import { CSSProperties, Fragment } from 'react';
import TableIndicator from './indicator';
import { TouchHookEventHandlerCallback, useRefCallback, useTouch } from '../../hooks';
import { computeColumnWidth, transformWidth } from './algorithm';
import { isDef } from '../../utils';
export interface TableProps extends React.HTMLAttributes<HTMLDivElement>, EmptyContentProps {
  columns: TableColumnProps[];
  data: TableDataProps[];

  dataPropsMapping?: TableDataPropType;

  height?: string | number;

  sortDataProp?: string;
  sortType?: TableSortType;

  expanded?: string[];
  expandOptions?: TableExpandOptionsType;

  ceilingOptions?: TableCeilingOptionsType;

  loading?: boolean;

  swipeable?: boolean;

  showIndicator?: boolean;

  onSortChange?: (column: TableColumnProps, sortDataProp: string, sortType: TableSortType) => void;
  onFilterChange?: (column: TableColumnProps, filterDataProp: string) => void;
  onExpandChange?: (expandRowData: TableDataProps, newExpanded: string[]) => void;
}

type StickyOffset = Record<'left' | 'right' | 'width', number>;
type ColumnStickyOffset = Record<string, StickyOffset>;

const bem = createBEM('table-wrapper');
const trackBem = createBEM('table-track');
const tableBem = createBEM('table');
const theadBem = createBEM('thead');
const tbodyBem = createBEM('tbody');
const tfootBem = createBEM('tfoot');
const trBem = createBEM('tr');
const thBem = createBEM('th');
const tdBem = createBEM('td');

const DEFAULT_EXPAND_COLUMN_WIDTH = 40;

const SPEED_LIMIT = 0.2;

function Table(props: TableProps): JSX.Element {
  const {
    columns,
    data,

    dataPropsMapping = {
      id: 'id',
      children: 'children',
    },

    height, // max-height

    sortDataProp,
    sortType,
    expanded = [],
    expandOptions,

    swipeable = false,
    showIndicator = true,

    onSortChange,
    onFilterChange,
    onExpandChange,

    ceilingOptions,

    emptyContentImage,
    emptyContentText,
  } = props;

  // record each column's offset info
  const [columnStickyOffset, setColumnStickyOffset] = React.useState<ColumnStickyOffset>({});

  const [columnComputedWidth, setColumnComputedWidth] = React.useState<Record<string, number>>({});

  const [showShadowLeft, setShowShadowLeft] = React.useState(false);
  const [showShadowRight, setShowShadowRight] = React.useState(false);

  const [leftFixedBoundaryColumnIndex, setLeftFixedBoundaryColumnIndex] = React.useState(-1);
  const [rightFixedBoundaryColumnIndex, setRightFixedBoundaryColumnIndex] = React.useState(-1);

  const [indicatorValue, setIndicatorValue] = React.useState<number[]>([]);

  // auto moving
  const [moving, setMoving] = React.useState(false);

  // touch moving
  const [touchMoving, setTouchMoving] = React.useState(false);
  // touch horizontal moving
  const [touchHorizontalMoving, setTouchHorizontalMoving] = React.useState(false);

  // current offset transformed column index
  const [transformIndex, setTransformIndex] = React.useState(() => {
    const firstColumnUnFixed = columns.find(column => {
      return column.fixed !== 'left';
    });
    return firstColumnUnFixed ? columns.indexOf(firstColumnUnFixed) : 0;
  });

  // current transforming offset
  const [touchDistance, setTouchDistance] = React.useState(0);
  // if there is no space to transform entire column, use transformGap to make up
  const [transformGap, setTransformGap] = React.useState(0);

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const tableRef = React.useRef<HTMLTableElement>(null);

  const tableFakeTrRef = React.useRef<HTMLTableRowElement>(null);

  const trackRef = React.useRef<HTMLDivElement>(null);

  const lastSortDataProp = React.useRef(sortDataProp);

  const onTransitionEnd = React.useRef<(...args: any[]) => void>(() => {});

  const onContainerScroll = (container: HTMLElement | Document): void => {
    const scrollingElement =
      container === document ? document.documentElement : (container as HTMLElement);
    if (
      (scrollingElement.scrollLeft > 0 && !showShadowLeft) ||
      (scrollingElement.scrollLeft === 0 && showShadowLeft)
    ) {
      setShowShadowLeft(!showShadowLeft);
    }

    if (
      (scrollingElement.scrollLeft + scrollingElement.offsetWidth < scrollingElement.scrollWidth &&
        !showShadowRight) ||
      (scrollingElement.scrollLeft + scrollingElement.offsetWidth >= scrollingElement.scrollWidth &&
        showShadowRight)
    ) {
      setShowShadowRight(!showShadowRight);
    }
  };
  const onContainerScrollRef = React.useRef(onContainerScroll);
  onContainerScrollRef.current = onContainerScroll;

  const computeTransitionDistance = (
    lastTransformIndex: number,
    newTransformIndex: number,
  ): number => {
    const lastColumnOffset = columnStickyOffset[columns[lastTransformIndex].dataProp];

    const newColumnOffset = columnStickyOffset[columns[newTransformIndex].dataProp];

    if (lastColumnOffset && newColumnOffset) {
      let lastComputedTransformOffset: number;
      let newComputedTransformOffset: number;

      const wrapperWidth = wrapperRef.current!.offsetWidth;
      const scrollWidth = tableRef.current!.offsetWidth;

      if (leftFixedBoundaryColumnIndex !== -1) {
        const boundaryOffset = columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];
        lastComputedTransformOffset = -(
          lastColumnOffset.left -
          boundaryOffset.left -
          boundaryOffset.width
        );
        newComputedTransformOffset = -(
          newColumnOffset.left -
          boundaryOffset.left -
          boundaryOffset.width
        );
      } else {
        lastComputedTransformOffset = -lastColumnOffset.left;
        newComputedTransformOffset = -newColumnOffset.left;
      }

      return (
        Math.max(newComputedTransformOffset, -(scrollWidth - wrapperWidth)) -
        Math.max(lastComputedTransformOffset, -(scrollWidth - wrapperWidth))
      );
    }
    return 0;
  };

  // unfixed column transform
  const columnTransformOffset = React.useMemo(() => {
    const columnOffset = columnStickyOffset[columns[transformIndex].dataProp];

    if (columnOffset) {
      let computedTransformOffset: number;
      if (leftFixedBoundaryColumnIndex !== -1) {
        const boundaryOffset = columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];
        computedTransformOffset =
          -(columnOffset.left - boundaryOffset.left - boundaryOffset.width) + touchDistance;
      } else {
        computedTransformOffset = -columnOffset.left + touchDistance;
      }

      const wrapperWidth = wrapperRef.current!.offsetWidth;
      const scrollWidth = tableRef.current!.offsetWidth;

      return Math.max(computedTransformOffset, -(scrollWidth - wrapperWidth));
    }

    return touchDistance;
  }, [
    wrapperRef.current,
    tableRef.current,
    columnStickyOffset,
    columns,
    transformIndex,
    touchDistance,
    leftFixedBoundaryColumnIndex,
    columnComputedWidth,
  ]);

  const rightColumnTransformOffset = React.useMemo(() => {
    if (wrapperRef.current && tableRef.current) {
      const wrapperWidth = wrapperRef.current!.offsetWidth;
      const scrollWidth = tableRef.current!.offsetWidth;

      return scrollWidth - wrapperWidth + columnTransformOffset;
    }
    return 0;
  }, [wrapperRef.current, tableRef.current, columnTransformOffset]);

  const onContainerTransform = (): void => {
    if (
      (columnTransformOffset < 0 && !showShadowLeft) ||
      (columnTransformOffset === 0 && showShadowLeft)
    ) {
      setShowShadowLeft(!showShadowLeft);
    }

    if (tableRef.current && wrapperRef.current) {
      if (
        (wrapperRef.current.offsetWidth - columnTransformOffset < tableRef.current.offsetWidth &&
          !showShadowRight) ||
        (wrapperRef.current.offsetWidth - columnTransformOffset >= tableRef.current.offsetWidth &&
          showShadowRight)
      ) {
        setShowShadowRight(!showShadowRight);
      }
    }
  };
  const onContainerTransformRef = React.useRef(onContainerTransform);
  onContainerTransformRef.current = onContainerTransform;

  React.useEffect(() => {
    requestAnimationFrame(() => {
      if (tableFakeTrRef.current) {
        // TODO
        // 通过不可见行，获取到每列的 offsetLeft
        // 当前先通过 thead 来获取
        const fakeTdList = tableFakeTrRef.current.querySelectorAll('td');

        const newColumnStickyOffset: ColumnStickyOffset = {};

        const fakeTrWidth = tableFakeTrRef.current.offsetWidth;

        const syntheticColumns = (
          (expandOptions ? [expandOptions] : []) as BaseTableColumnProps[]
        ).concat(columns);

        syntheticColumns.forEach((column, index) => {
          if (fakeTdList[index]) {
            const tdOffsetLeft = fakeTdList[index].offsetLeft;
            const tdOffsetWidth = fakeTdList[index].offsetWidth;
            newColumnStickyOffset[column.dataProp] = {
              left: tdOffsetLeft,
              right: fakeTrWidth - tdOffsetLeft - tdOffsetWidth,
              width: tdOffsetWidth,
            };
          }
        });

        setColumnStickyOffset(newColumnStickyOffset);

        // calc shadow position
        let newLeftFixedBoundaryColumnIndex = -1;
        let newRightFixedBoundaryColumnIndex = -1;

        columns.forEach((column, index) => {
          if (column.fixed === 'left') {
            newLeftFixedBoundaryColumnIndex = index;
          }
          if (newRightFixedBoundaryColumnIndex === -1 && column.fixed === 'right') {
            newRightFixedBoundaryColumnIndex = index;
          }
        });

        if (newLeftFixedBoundaryColumnIndex < columns.length - 1) {
          setLeftFixedBoundaryColumnIndex(newLeftFixedBoundaryColumnIndex);
        }

        if (newRightFixedBoundaryColumnIndex !== 0) {
          setRightFixedBoundaryColumnIndex(newRightFixedBoundaryColumnIndex);
        }
      }

      if (swipeable) {
        // transform shadow
        onContainerTransformRef.current();
      } else if (trackRef.current) {
        // scroll shadow
        onContainerScrollRef.current(trackRef.current);
      }
    });
  }, [columns, expandOptions, columnComputedWidth]);

  React.useEffect(() => {
    if (wrapperRef.current) {
      setColumnComputedWidth(
        computeColumnWidth(
          ([] as (TableColumnProps | TableExpandOptionsType)[])
            .concat(
              expandOptions
                ? Object.assign(
                    {
                      width: DEFAULT_EXPAND_COLUMN_WIDTH,
                    },
                    expandOptions,
                  )
                : [],
            )
            .concat(columns),
          wrapperRef.current.offsetWidth,
        ),
      );
    }
  }, [columns, expandOptions]);

  React.useEffect(() => {
    let scrollBoundary: TableCeilingOptionsType['scrollBoundary'] = trackRef.current!;
    if (ceilingOptions) {
      scrollBoundary = ceilingOptions.scrollBoundary;
    }

    const onScroll = (): void => {
      onContainerScrollRef.current(scrollBoundary);
    };

    if (!swipeable) {
      if (scrollBoundary === document) {
        on(scrollBoundary, 'scroll', onScroll);
      } else {
        on(scrollBoundary as HTMLElement, 'scroll', onScroll);
      }
    }

    return (): void => {
      if (!swipeable) {
        if (scrollBoundary === document) {
          off(scrollBoundary, 'scroll', onScroll);
        } else {
          off(scrollBoundary as HTMLElement, 'scroll', onScroll);
        }
      }
    };
  }, [ceilingOptions, swipeable]);

  const afterTouchStart: TouchHookEventHandlerCallback<HTMLDivElement> = event => {
    // TODO
    // need to gurantee touches is accessible
    if (moving) {
      return;
    }

    if (event.touches.length === 1) {
      setTouchMoving(true);
    }
  };
  const afterTouchMove: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    const fingerState = states[0];

    // TODO
    // need to gurantee states is not empty
    if (fingerState && touchMoving) {
      const { deltaX, direction } = fingerState;

      if (direction === 'horizontal') {
        preventDefault(event as Event);

        !touchHorizontalMoving && setTouchHorizontalMoving(true);

        const columnOffsetLeft = columnStickyOffset[columns[transformIndex].dataProp].left;

        const boundaryOffset =
          leftFixedBoundaryColumnIndex !== -1 &&
          columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];

        const boundaryOffsetLeft = boundaryOffset ? boundaryOffset.left + boundaryOffset.width : 0;

        const wrapperWidth = wrapperRef.current!.offsetWidth;
        const scrollWidth = tableRef.current!.offsetWidth;

        const truncDistance = Math.min(
          columnOffsetLeft - boundaryOffsetLeft,
          Math.max(
            deltaX + transformGap,
            -(scrollWidth - wrapperWidth - (columnOffsetLeft - boundaryOffsetLeft)),
          ),
        );

        setTouchDistance(truncDistance);
      }
    }
  };
  const beforeTouchEnd: TouchHookEventHandlerCallback<HTMLDivElement> = (event, states) => {
    if (touchMoving) {
      setTouchMoving(false);
      setTouchHorizontalMoving(false);
      setMoving(true);
      setTouchDistance(0);

      // compute speed
      let touchSpeed = 0;
      const fingerState = states[0];
      if (fingerState) {
        const { speedX } = fingerState;
        if (Math.abs(speedX) > SPEED_LIMIT) {
          touchSpeed = speedX;
        }
      }

      const columnOffsetLeft = columnStickyOffset[columns[transformIndex].dataProp].left;

      const wrapperWidth = wrapperRef.current!.offsetWidth;
      const scrollWidth = tableRef.current!.offsetWidth;

      const boundaryOffset =
        leftFixedBoundaryColumnIndex !== -1 &&
        columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];
      const boundaryOffsetLeft = boundaryOffset ? boundaryOffset.left + boundaryOffset.width : 0;

      // distance from right edge of table
      const orgEdgeDistance =
        scrollWidth - wrapperWidth - (columnOffsetLeft - boundaryOffsetLeft) + touchDistance;
      const hitEdge = orgEdgeDistance <= 0;

      // determine transform index
      let newTransformIndex = transformIndex;
      columns.some((column, columnIndex) => {
        const { left, width } = columnStickyOffset[column.dataProp];
        const distanceFromCurrentColumn = left - columnOffsetLeft;

        // swipe to left
        if (
          columnIndex > transformIndex &&
          touchDistance < 0 &&
          touchDistance + distanceFromCurrentColumn > 0
        ) {
          if (touchDistance + distanceFromCurrentColumn - width / 2 > 0) {
            newTransformIndex = columnIndex;
          } else {
            newTransformIndex = columnIndex + 1;
          }
          if (hitEdge) {
            newTransformIndex = columnIndex + 1;
          }
          if (touchSpeed < 0) {
            newTransformIndex = columnIndex + 1;
          } else if (touchSpeed > 0) {
            newTransformIndex = columnIndex;
          }
          return true;
        }

        // swipe to right or swipe visible first column
        if (
          columnIndex <= transformIndex &&
          touchDistance + distanceFromCurrentColumn + width > 0
        ) {
          if (touchDistance + distanceFromCurrentColumn + width / 2 > 0) {
            newTransformIndex = columnIndex;
          } else {
            newTransformIndex = columnIndex + 1;
          }
          if (hitEdge) {
            newTransformIndex = columnIndex + 1;
          }
          if (touchSpeed < 0) {
            newTransformIndex = columnIndex + 1;
          } else if (touchSpeed > 0) {
            newTransformIndex = columnIndex;
          }
          return true;
        }
        return false;
      });

      newTransformIndex = Math.min(newTransformIndex, columns.length - 1);
      setTransformIndex(newTransformIndex);

      const finalColumnOffsetLeft = columnStickyOffset[columns[newTransformIndex].dataProp].left;

      // current transformed column has no space to swipe entirely
      // set the gap to its supposed to be
      const finalEdgeDistance =
        scrollWidth - wrapperWidth - (finalColumnOffsetLeft - boundaryOffsetLeft);

      if (finalEdgeDistance >= 0) {
        setTransformGap(0);
      } else {
        setTransformGap(-finalEdgeDistance);
      }

      // handle condition transiton not triggered

      onTransitionEnd.current = (): void => {
        setMoving(false);
        // initial swipeable shadow
        onContainerTransformRef.current();

        onTransitionEnd.current = (): void => {};
      };

      // not trigger transition
      // handle condition transiton not triggered
      if (
        computeTransitionDistance(transformIndex, newTransformIndex) === touchDistance ||
        // exception condition: translate from right edge and finally landing on right edge
        transformGap === touchDistance
      ) {
        onTransitionEnd.current();
      }
    }
  };

  React.useEffect(() => {
    const value: number[] = [];

    if (!wrapperRef.current) {
      return;
    }

    const wrapperWidth = wrapperRef.current!.offsetWidth;

    let boundaryOffsetLeft = 0;

    if (leftFixedBoundaryColumnIndex !== -1) {
      const boundaryOffset = columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];
      if (boundaryOffset) {
        boundaryOffsetLeft = boundaryOffset.left + boundaryOffset.width;
      }
    }

    columns.forEach((column, index) => {
      if (column.fixed) {
        value.push(index);
        return;
      }
      const columnOffset = columnStickyOffset[column.dataProp];

      if (!columnOffset) return;

      if (
        columnOffset.left + columnTransformOffset < wrapperWidth &&
        columnOffset.left + columnOffset.width + columnTransformOffset > boundaryOffsetLeft
      ) {
        value.push(index);
      }
    });

    setIndicatorValue(value);
  }, [
    wrapperRef.current,
    columns,
    columnStickyOffset,
    columnTransformOffset,
    leftFixedBoundaryColumnIndex,
  ]);

  const [, , { onTouchMove, onTouchEnd, onTouchStart }] = useTouch({
    disabled: !swipeable,
    afterTouchStart,
    afterTouchMove,
    beforeTouchEnd,
  });

  const touchStartCallbackRef = useRefCallback(onTouchStart);
  const touchMoveCallbackRef = useRefCallback(onTouchMove);
  const touchEndCallbackRef = useRefCallback(onTouchEnd);

  const tableStyle: CSSProperties = React.useMemo(() => {
    if (!height) {
      return {};
    }
    return {
      maxHeight: typeof height === 'number' ? `${height}px` : height,
    };
  }, [height]);

  const appendTransitionToLeftFixedCell = (style: CSSProperties): void => {
    if (!swipeable) {
      return;
    }
    style['transform'] = `translate3d(${-columnTransformOffset}px, 0, 0)`;
    if (moving) {
      style['transitionDuration'] = '0.3s';
    }
  };

  const appendTransitionToRightFixedCell = (style: CSSProperties): void => {
    if (!swipeable) {
      return;
    }
    style['transform'] = `translate3d(${-rightColumnTransformOffset}px, 0, 0)`;
    if (moving) {
      style['transitionDuration'] = '0.3s';
    }
  };

  const appendTransitionToFixedCell = (
    style: CSSProperties,
    fixedDirection: 'right' | 'left',
  ): void => {
    if (fixedDirection === 'left') {
      appendTransitionToLeftFixedCell(style);
    } else {
      appendTransitionToRightFixedCell(style);
    }
  };

  const appendTransitionToTable = (style: CSSProperties): void => {
    if (!swipeable) {
      return;
    }
    style['transform'] = `translate3d(${columnTransformOffset}px, 0, 0)`;
    if (moving) {
      style['transitionDuration'] = '0.3s';
    }
  };

  const TableHeader = React.useMemo(() => {
    const isSticky = !!height || ceilingOptions;

    const renderExpandTh = (): JSX.Element => {
      const thStyle: CSSProperties = {};
      const thClassModifiers: Record<string, any> = {
        sticky: isSticky,
      };
      if (isSticky) {
        let stickyTop = (ceilingOptions && ceilingOptions.top) || 0;
        stickyTop = typeof stickyTop === 'number' ? `${stickyTop}px` : stickyTop;
        thStyle.top = stickyTop;
      }

      if (expandOptions!.fixed) {
        thClassModifiers[`sticky-${expandOptions!.fixed}`] = true;
        if (swipeable) {
          // unfixed column transform
          appendTransitionToFixedCell(thStyle, expandOptions!.fixed);
        } else {
          thStyle[expandOptions!.fixed] = `${
            columnStickyOffset[expandOptions!.dataProp]?.[expandOptions!.fixed] || 0
          }px`;
        }
      }

      let className = thBem([thClassModifiers]);

      if (expandOptions!.cellClass) {
        className = addClass(className, expandOptions!.cellClass);
      }

      if (expandOptions!.thCellClass) {
        className = addClass(className, expandOptions!.thCellClass);
      }

      return <th key={expandOptions!.dataProp} className={className} style={thStyle}></th>;
    };

    const tableHeaderContent = columns.map((column, columnIndex) => {
      const { sortable, filterable, dataProp, renderThCell } = column;
      const thStyle: CSSProperties = {};
      const thClassModifiers: Record<string, any> = {
        sticky: isSticky,
      };

      if (isSticky) {
        let stickyTop = (ceilingOptions && ceilingOptions.top) || 0;
        stickyTop = typeof stickyTop === 'number' ? `${stickyTop}px` : stickyTop;
        thStyle.top = stickyTop;
      }

      if (column.fixed) {
        thClassModifiers[`sticky-${column.fixed}`] = true;

        if (swipeable) {
          // unfixed column transform
          appendTransitionToFixedCell(thStyle, column.fixed);
        } else {
          thStyle[column.fixed] = `${columnStickyOffset[column.dataProp]?.[column.fixed] || 0}px`;
        }

        if (
          (showShadowLeft &&
            column.fixed === 'left' &&
            columnIndex === leftFixedBoundaryColumnIndex) ||
          (showShadowRight &&
            column.fixed === 'right' &&
            columnIndex === rightFixedBoundaryColumnIndex)
        ) {
          thClassModifiers[`sticky-${column.fixed}-shadow`] = true;
        }
      }

      const renderSortIcon = (): JSX.Element => {
        const sortIconListeners = {
          onClick(): void {
            let newSortType: TableSortType;
            const newDataProp = column.dataProp;
            if (lastSortDataProp.current === newDataProp && sortType) {
              newSortType = sortType === 'asc' ? 'desc' : 'asc';
            } else {
              newSortType = 'desc';
            }
            lastSortDataProp.current = newDataProp;
            onSortChange?.(column, newDataProp, newSortType);
          },
        };

        return (
          <div className={thBem('sort-icon')} {...sortIconListeners}>
            {sortDataProp === dataProp ? (
              <SortIcon sortType={sortType} />
            ) : (
              <SortIcon sortType={undefined} />
            )}
          </div>
        );
      };

      const renderFilterIcon = (): JSX.Element => {
        const filterIconListeners = {
          onClick(): void {
            onFilterChange?.(column, column.dataProp);
          },
        };
        return <Icon className={thBem('filter-icon')} {...filterIconListeners} name="Filter" />;
      };

      let className = thBem([thClassModifiers]);

      if (column!.cellClass) {
        className = addClass(className, column!.cellClass);
      }

      if (column!.thCellClass) {
        className = addClass(className, column!.thCellClass);
      }

      return (
        <th key={column.dataProp} className={className} style={thStyle}>
          {renderThCell
            ? typeof renderThCell === 'function'
              ? renderThCell(column)
              : renderThCell
            : column.title}
          {sortable && renderSortIcon()}
          {filterable && renderFilterIcon()}
        </th>
      );
    });
    return (
      <thead className={theadBem()}>
        <tr className={trBem()}>
          {expandOptions && expandOptions.fixed !== 'right' && renderExpandTh()}
          {tableHeaderContent}
          {expandOptions && expandOptions.fixed === 'right' && renderExpandTh()}
        </tr>
      </thead>
    );
  }, [
    columns,
    height,
    showShadowLeft,
    showShadowRight,
    leftFixedBoundaryColumnIndex,
    rightFixedBoundaryColumnIndex,
    sortDataProp,
    sortType,
    touchDistance,
    transformIndex,
    moving,
    swipeable,
    ceilingOptions,
    columnTransformOffset,
    rightColumnTransformOffset,
  ]);

  const ColumnGroup = React.useMemo(() => {
    const renderExpandCol = (): JSX.Element => {
      const width = expandOptions!.width || `${DEFAULT_EXPAND_COLUMN_WIDTH}px`;
      const colStyle = {
        width,
      };
      return <col style={colStyle} />;
    };
    const columnGroupContent = columns.map(column => {
      const colStyle: CSSProperties = {};

      const colWidth =
        columnComputedWidth[column.dataProp] ||
        Math.max(
          isDef(column.width) ? transformWidth(column.width!) : 0,
          isDef(column.minWidth) ? transformWidth(column.minWidth!) : 0,
        );
      colStyle.width = typeof colWidth === 'number' ? `${colWidth}px` : colWidth;

      return <col key={column.dataProp} style={colStyle} />;
    });
    return (
      <colgroup>
        {expandOptions && expandOptions.fixed !== 'right' && renderExpandCol()}
        {columnGroupContent}
        {expandOptions && expandOptions.fixed === 'right' && renderExpandCol()}
      </colgroup>
    );
  }, [columns, columnComputedWidth]);

  const TableBody = React.useMemo(() => {
    const renderExpandTd = (row: TableDataProps, rowExpanded: boolean): JSX.Element => {
      const tdStyle: CSSProperties = {};
      const tdClassModifiers: Record<string, any> = {};

      if (expandOptions!.fixed) {
        tdClassModifiers[`sticky-${expandOptions!.fixed}`] = true;
        if (swipeable) {
          // unfixed column transform
          appendTransitionToFixedCell(tdStyle, expandOptions!.fixed);
        } else {
          tdStyle[expandOptions!.fixed] = `${
            columnStickyOffset[expandOptions!.dataProp]?.[expandOptions!.fixed] || 0
          }px`;
        }
      }

      const onExpandTdClick = (): void => {
        const newExpanded = [...expanded];
        if (rowExpanded) {
          const expandIndex = expanded.indexOf(row[expandOptions!.dataProp]);
          newExpanded.splice(expandIndex, 1);
        } else {
          newExpanded.push(row[expandOptions!.dataProp]);
        }
        onExpandChange?.(row, newExpanded);
      };

      let className = tdBem([tdClassModifiers, { expanded: rowExpanded }]);

      if (expandOptions!.cellClass) {
        className = addClass(className, expandOptions!.cellClass);
      }

      if (expandOptions!.tdCellClass) {
        className = addClass(className, expandOptions!.tdCellClass);
      }

      return (
        <td
          key={expandOptions!.dataProp}
          className={className}
          style={tdStyle}
          onClick={onExpandTdClick}
        >
          <div className={tdBem('expand')}>
            {expandOptions!.renderIcon ? (
              expandOptions!.renderIcon(row)
            ) : (
              <Icon
                className={tdBem('expand-icon', [{ expanded: rowExpanded }])}
                name="ArrowDown"
              />
            )}
          </div>
        </td>
      );
    };

    const tableBodyContent = data.map(row => {
      const rowExpanded = expandOptions ? expanded.includes(row[expandOptions.dataProp]) : false;

      const tableTrContent = columns.map((column, columnIndex) => {
        const { renderCell } = column;

        const tdStyle: CSSProperties = {};
        const tdClassModifiers: Record<string, any> = {};

        if (column.fixed) {
          tdClassModifiers[`sticky-${column.fixed}`] = true;

          if (swipeable) {
            // unfixed column transform
            appendTransitionToFixedCell(tdStyle, column.fixed);
          } else {
            tdStyle[column.fixed] = `${columnStickyOffset[column.dataProp]?.[column.fixed] || 0}px`;
          }

          if (
            (showShadowLeft &&
              column.fixed === 'left' &&
              columnIndex === leftFixedBoundaryColumnIndex) ||
            (showShadowRight &&
              column.fixed === 'right' &&
              columnIndex === rightFixedBoundaryColumnIndex)
          ) {
            tdClassModifiers[`sticky-${column.fixed}-shadow`] = true;
          }
        }

        let className = tdBem([tdClassModifiers, { expanded: rowExpanded }]);

        if (column!.cellClass) {
          className = addClass(className, column!.cellClass);
        }

        if (column!.tdCellClass) {
          className = addClass(className, column!.tdCellClass);
        }

        return (
          <td key={column.dataProp} className={className} style={tdStyle}>
            {renderCell
              ? typeof renderCell === 'function'
                ? renderCell(row, column)
                : renderCell
              : row[column.dataProp]}
          </td>
        );
      });
      return (
        <Fragment key={row[dataPropsMapping.id!]}>
          <tr className={trBem()}>
            {expandOptions && expandOptions.fixed !== 'right' && renderExpandTd(row, rowExpanded)}
            {tableTrContent}
            {expandOptions && expandOptions.fixed === 'right' && renderExpandTd(row, rowExpanded)}
          </tr>
          {rowExpanded && (
            <tr className={trBem()}>
              <td className={tdBem()} colSpan={columns.length + (expandOptions ? 1 : 0)}>
                {expandOptions!.renderContent(row)}
              </td>
            </tr>
          )}
        </Fragment>
      );
    });

    const tableFakeTr = (
      <tr ref={tableFakeTrRef} key="fake-column" className={trBem()}>
        {expandOptions && expandOptions.fixed !== 'right' && (
          <td key="expand-former" className={tdBem([{ fake: true }])}></td>
        )}
        {columns.map(column => {
          return <td key={column.dataProp} className={tdBem([{ fake: true }])}></td>;
        })}
        {expandOptions && expandOptions.fixed === 'right' && (
          <td key="expand-latter" className={tdBem([{ fake: true }])}></td>
        )}
      </tr>
    );

    return (
      <tbody className={tbodyBem()}>
        {tableBodyContent}
        {tableFakeTr}
      </tbody>
    );
  }, [
    data,
    columns,
    showShadowLeft,
    showShadowRight,
    leftFixedBoundaryColumnIndex,
    rightFixedBoundaryColumnIndex,
    columnStickyOffset,
    expanded,
    expandOptions,
    touchDistance,
    transformIndex,
    moving,
    swipeable,
    columnTransformOffset,
    rightColumnTransformOffset,
  ]);

  const TableEmtpyBody = React.useMemo(() => {
    if (data.length) return null;
    return (
      <div className={tbodyBem(['empty'])}>
        <EmptyContent emptyContentImage={emptyContentImage} emptyContentText={emptyContentText} />
      </div>
    );
  }, [height, data]);

  const renderTableFooter = (): JSX.Element => {
    return <tfoot className={tfootBem()}></tfoot>;
  };

  const renderTable = (): JSX.Element => {
    const tableStyle: CSSProperties = {};
    // unfixed column transform
    appendTransitionToTable(tableStyle);
    return (
      <table
        ref={tableRef}
        className={tableBem()}
        style={tableStyle}
        onTransitionEnd={(): void => onTransitionEnd.current()}
      >
        {ColumnGroup}
        {TableHeader}
        {TableBody}
        {renderTableFooter()}
      </table>
    );
  };

  const TalbeSwipeableHeader = React.useMemo(() => {
    return (
      swipeable &&
      showIndicator && (
        <div className={bem('indicator')}>
          <TableIndicator value={indicatorValue} length={columns.length} />
        </div>
      )
    );
  }, [indicatorValue, columns]);

  const isEmpty = !data.length;

  const classModify: Record<string, boolean> = {
    swipeable,
    'swipeable-touching': touchHorizontalMoving,
    empty: isEmpty,
  };
  if (ceilingOptions) {
    classModify['ceiling'] = true;
  }

  const className = bem([{ empty: isEmpty }]);
  const style: CSSProperties = {};
  if (!data.length && !!height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }
  return (
    <div
      ref={wrapperRef}
      className={className}
      style={style}
      onTouchStart={touchStartCallbackRef}
      onTouchMove={touchMoveCallbackRef}
      onTouchEnd={touchEndCallbackRef}
    >
      {TalbeSwipeableHeader}
      <div ref={trackRef} className={trackBem([classModify])} style={tableStyle}>
        {renderTable()}
      </div>
      {TableEmtpyBody}
    </div>
  );
}

export default Table;

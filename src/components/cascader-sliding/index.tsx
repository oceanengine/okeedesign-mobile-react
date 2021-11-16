import * as React from 'react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useControlled } from '../../hooks';

import createBEM from '../../utils/create/createBEM';
import {
  StructTree,
  StructTreeNode,
  StructTreeValue,
  traceTreeByValue,
} from '../../utils/struct/tree';
import Icon from '../icon';
import { scrollLeftTo } from '../tabs/utils';
import Toolbar, { ToolbarProps } from '../toolbar';

export type CascaderSlidingValue = StructTreeValue;

export interface CascaderSlidingProps extends ToolbarProps {
  value: CascaderSlidingValue[] | CascaderSlidingValue[][];
  defaultValue: CascaderSlidingValue[] | CascaderSlidingValue[][];

  multiple: boolean;
  options: StructTree;

  headerPlaceholder?: string;

  showBadge?: boolean;

  onChange?: (value: CascaderSlidingValue[] | CascaderSlidingValue[][]) => void;
  onActiveItemChange?: (value: CascaderSlidingValue[]) => void;
}

export type CascaderSlidingOption = {
  value: CascaderSlidingValue;
  label: string;
  children?: StructTreeNode[];
  active: boolean;
  checked: boolean;
  selectedCount?: number;
};

const HEADER_TRANSITION_DURATION = 0.3;

const bem = createBEM('cascader-sliding');

function CascaderSliding(props: CascaderSlidingProps): JSX.Element {
  const {
    value,
    defaultValue,

    multiple,
    options,

    headerPlaceholder,

    showBadge,

    onChange,
    onActiveItemChange,
  } = props;

  const [activeValue] = useControlled<CascaderSlidingValue[] | CascaderSlidingValue[][]>(
    value,
    defaultValue,
  );
  const lastActiveValue = useRef(activeValue);

  // 展开的层级
  // 受控模式下，如果更改 multiple 的值，如何展开呢？
  // 暂时不考虑 value 副作用时控制展开
  const [activeStruct, setActiveStruct] = useState(() => {
    if (multiple) {
      if (activeValue[0]) {
        return (activeValue[0] as CascaderSlidingValue[]).slice(0, -1);
      }
      return [];
    }
    return activeValue;
  });

  const dyeingOptions = useMemo(() => {
    const flatTree = [options];

    traceTreeByValue(options, activeStruct, node => {
      if (node.children && node.children.length) {
        flatTree.push(node.children);
      }
    });

    if (multiple) {
      let matchedValue = activeValue as CascaderSlidingValue[][];

      // 每一层选择的 value
      const layerMatchedValue = [matchedValue];

      activeStruct.forEach((layerValue, layerIndex) => {
        matchedValue = matchedValue.filter(item => {
          return item[layerIndex] === activeStruct[layerIndex];
        });

        layerMatchedValue.push(matchedValue);
      });

      return flatTree.map((layer, layerIndex) => {
        return layer.map(item => {
          if (layerIndex < activeStruct.length) {
            const active = item.value === activeStruct[layerIndex];
            return {
              ...item,
              active,
              checked: false,
              selectedCount:
                layerMatchedValue[layerIndex].filter(theValue => {
                  return theValue[layerIndex] === item.value;
                }).length || 0,
            };
          }

          return {
            ...item,
            active: false,
            checked: !!layerMatchedValue[layerIndex].find(valueItem => {
              return valueItem[layerIndex] === item.value;
            }),
          };
        });
      });
    }

    return flatTree.map((layer, layerIndex) => {
      return layer.map(item => {
        if (layerIndex < activeStruct.length) {
          return {
            ...item,
            active: item.value === activeStruct[layerIndex],
            checked: false,
          };
        }

        return {
          ...item,
          active: false,
          checked: item.value === activeValue[layerIndex],
        };
      });
    });
  }, [activeValue, activeStruct, options]);

  const dyeingHeaderOptions = useMemo(() => {
    if (multiple) {
      return [];
    }
    return (activeValue as CascaderSlidingValue[])
      .map((activeValueItem, activeValueIndex) => {
        if (!dyeingOptions[activeValueIndex]) return;
        const matchedItem = dyeingOptions[activeValueIndex].find(option => {
          return option.value === activeValueItem;
        });
        return matchedItem;
      })
      .filter(item => !!item);
  }, [activeValue, options]) as CascaderSlidingOption[];

  const [clickedTab, setClickedTab] = useState(() => {
    return activeValue.length - 1;
  });

  const [activeTab, setActiveTab] = useState(() => {
    return activeValue.length - 1;
  });

  useEffect(() => {
    setActiveTab(activeValue.length - 1);
  }, [activeValue]);

  useEffect(() => {
    setActiveTab(clickedTab);
  }, [clickedTab]);

  const [slidingWindow, setSlidingWindow] = useState(() => {
    return dyeingOptions.length - 2 > 0 ? dyeingOptions.length - 2 : 0;
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const lastSlidingWindow = useRef(slidingWindow);
  useEffect(() => {
    if (
      lastSlidingWindow.current < slidingWindow ||
      (slidingWindow === lastActiveValue.current.length - 1 &&
        lastActiveValue.current.length === activeValue.length - 1)
    ) {
      if (headerRef.current) {
        const to = headerRef.current.scrollWidth - headerRef.current.offsetWidth;
        if (to) {
          scrollLeftTo(headerRef.current, to, HEADER_TRANSITION_DURATION);
        }
      }
    }

    lastSlidingWindow.current = slidingWindow;
    lastActiveValue.current = activeValue;
  }, [slidingWindow, activeValue]);

  const onRowClick = (row: CascaderSlidingOption, columnIndex: number): void => {
    if (multiple) {
      const newActiveStruct = activeStruct.slice(0, columnIndex);
      if (row.children && row.children.length) {
        newActiveStruct.push(row.value);
        setActiveStruct(newActiveStruct);
        onActiveItemChange?.(newActiveStruct);
      } else {
        let repeatedIndex: number;
        const repeatedActiveValue = (activeValue as CascaderSlidingValue[][]).some(
          (someActiveValue, index) => {
            let repeated = true;
            for (let i = 0; i <= columnIndex; i++) {
              if (i < columnIndex) {
                repeated = someActiveValue[i] === activeStruct[i];
              } else {
                repeated = someActiveValue[i] === row.value;
              }
              if (!repeated) {
                break;
              }
            }
            repeatedIndex = index;
            return repeated;
          },
        );
        if (repeatedActiveValue) {
          const newActiveValue = (activeValue as CascaderSlidingValue[][]).filter((item, index) => {
            return index !== repeatedIndex;
          });
          onChange?.(newActiveValue);
        } else {
          setActiveStruct(newActiveStruct);
          onActiveItemChange?.(newActiveStruct);
          onChange?.(
            ([] as CascaderSlidingValue[][])
              .concat(activeValue)
              .concat([([] as CascaderSlidingValue[]).concat(newActiveStruct).concat(row.value)]),
          );
        }
      }
    } else {
      const newActiveStruct = activeStruct.slice(0, columnIndex);

      if (activeValue[columnIndex] === row.value) {
        setActiveStruct(newActiveStruct);
        onActiveItemChange?.(newActiveStruct);
        onChange?.(newActiveStruct);
        return;
      }

      if (row.children && row.children.length) {
        newActiveStruct.push(row.value);
        setActiveStruct(newActiveStruct);
        onActiveItemChange?.(newActiveStruct);
        onChange?.(newActiveStruct);
      } else {
        if (columnIndex !== activeStruct.length) {
          setActiveStruct(newActiveStruct);
          onActiveItemChange?.(newActiveStruct);
        }
        onChange?.(([] as CascaderSlidingValue[]).concat(newActiveStruct).concat(row.value));
      }
    }
  };

  const onHeaderItemClick = (item: CascaderSlidingOption, itemIndex: number): void => {
    if (itemIndex === dyeingOptions.length - 1 && !(item.children && item.children.length)) {
      setSlidingWindow(itemIndex - 1);
    } else {
      setSlidingWindow(itemIndex);
    }
    setClickedTab(itemIndex);
  };

  const lastDyeingOptionsLength = useRef(dyeingOptions.length);
  useEffect(() => {
    if (lastDyeingOptionsLength.current === dyeingOptions.length) {
      return;
    }
    lastDyeingOptionsLength.current = dyeingOptions.length;
    setSlidingWindow(dyeingOptions.length - 2 > 0 ? dyeingOptions.length - 2 : 0);
  }, [dyeingOptions.length]);

  const renderRow = function (row: CascaderSlidingOption, columnIndex: number): JSX.Element {
    const { active, checked, selectedCount } = row;

    const hasBadge = showBadge && !!selectedCount;

    return (
      <div
        key={row.value.toString() + columnIndex}
        className={bem('row', [{ active, checked, hasBadge }])}
        onClick={(): void => {
          onRowClick(row, columnIndex);
        }}
      >
        {row.label}
        {hasBadge && <span className={bem('row-badge')}>{selectedCount}</span>}
        {(active || checked) && <Icon name="Check" className={bem('row-icon')} />}
      </div>
    );
  };

  const renderColumn = (): JSX.Element[] => {
    return dyeingOptions.map((column, columnIndex) => {
      const columnKey =
        columnIndex === 0 ? 'firstcolumn' : activeStruct[columnIndex - 1].toString() + columnIndex;
      return (
        <div className={bem('column')} key={columnKey}>
          {column.map(row => {
            return renderRow(row as CascaderSlidingOption, columnIndex);
          })}
        </div>
      );
    });
  };

  const renderHeader = (): JSX.Element => {
    return (
      <div className={bem('header')} ref={headerRef}>
        <div className={bem('header__content')}>
          {dyeingHeaderOptions.length ? (
            dyeingHeaderOptions.map((item, index) => {
              return (
                <Fragment key={item.value.toString() + index}>
                  <div
                    className={bem('header__item', [{ active: index === activeTab }])}
                    onClick={(): void => {
                      onHeaderItemClick(item, index);
                    }}
                  >
                    {item.label}
                  </div>
                  {index < dyeingHeaderOptions.length - 1 && (
                    <Icon name="ArrowRight" className={bem('header__item-icon')} />
                  )}
                </Fragment>
              );
            })
          ) : (
            <div className={bem('header__item')}>{headerPlaceholder}</div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = (): JSX.Element => {
    const translateX = -50 * slidingWindow;
    const trackStyle = {
      transform: `translate3d(${translateX}%, 0, 0)`,
    };
    return (
      <div className={bem('content', [{ 'single-column': dyeingOptions.length === 1 }])}>
        <div className={bem('content-track')} style={trackStyle}>
          {renderColumn()}
        </div>
      </div>
    );
  };

  const renderToolbar = (): JSX.Element => {
    const {
      showToolbar,
      title,
      confirmButtonText,
      cancelButtonText,

      showCancelButton,
      showConfirmButton,

      onCancel,
      onConfirm,
    } = props;

    return (
      <Toolbar
        showBottomLine={false}
        showToolbar={showToolbar}
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

  return (
    <div className={bem()}>
      {renderToolbar()}
      {renderHeader()}
      {renderContent()}
    </div>
  );
}

CascaderSliding.defaultProps = {
  multiple: false,
  showBadge: true,
  showToolbar: false,
  headerPlaceholder: '请选择',
  defaultValue: [],
};

export default CascaderSliding;

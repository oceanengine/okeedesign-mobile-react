import * as React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useControlled } from '../../hooks';

import createBEM from '../../utils/create/createBEM';
import {
  StructTree,
  StructTreeNode,
  StructTreeValue,
  traceTreeByValue,
} from '../../utils/struct/tree';
import { RenderContent } from '../../utils/types';
import Icon from '../icon';
import Loading from '../loading';
import Toolbar, { ToolbarProps } from '../toolbar';

export type CascaderValue = StructTreeValue;

export type CascaderLoad = (item: StructTreeNode) => Promise<StructTreeNode[]>;

export type CascaderCheckStrategy = 'child-route' | 'parent-route' | 'parent';
export type CascaderDisplayStrategy = 'minimalist' | 'normal';
export type CascaderBadgeStrategy = 'adjacent' | 'normal';

export type CascaderOnChange = (value: CascaderValue[] | CascaderValue[][]) => void;
export interface CascaderProps extends ToolbarProps {
  value: CascaderValue[] | CascaderValue[][];
  defaultValue: CascaderValue[] | CascaderValue[][];

  multiple?: boolean;
  showAll?: boolean;
  showAllText?: string;
  options: StructTree;

  ellipsis?: number;

  displayStrategy?: CascaderDisplayStrategy;

  checkStrategy?: CascaderCheckStrategy;

  icon?: RenderContent<void>;

  showBadge?: boolean;

  badgeStrategy?: CascaderBadgeStrategy;

  load?: CascaderLoad;

  onChange?: CascaderOnChange;
  onActiveItemChange?: (value: CascaderValue[]) => void;
}

export type CascaderNodeInfo = {
  needLoad?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children?: StructTreeNode[];
};
export type CascaderNodeInfoMap = Record<any, CascaderNodeInfo>;

export interface CascaderStatusOptions extends CascaderNodeInfo, StructTreeNode {}
export interface CascaderOption extends CascaderNodeInfo, StructTreeNode {
  active: boolean;
  checked: boolean;
  selectedCount?: number;
}

export type CascaderColumn = {
  selectAll: boolean;
  rows: CascaderOption[];
};

type TreeNodeOperator<T = void> = (
  node: StructTreeNode,
  layer: number,
  nodeList: StructTreeNode[],
  info?: any,
) => T;
interface CascaderDyeingOption extends CascaderNodeInfo, StructTreeNode {}

function preOrderTraverse(
  tree: StructTree,
  operator: TreeNodeOperator<CascaderDyeingOption | null>,
  nodeList: StructTreeNode[] = [],
): StructTree {
  const result: StructTree = [];
  tree.forEach((treeNode, index) => {
    const newTreeNode = operator(treeNode, index, nodeList) || treeNode;
    if (newTreeNode.children && newTreeNode.children.length) {
      newTreeNode.children = preOrderTraverse(newTreeNode.children, operator, [
        ...nodeList,
        newTreeNode,
      ]);
    }
    result.push(newTreeNode);
  });
  return result;
}

function postOrderTraverseLeaf(
  tree: StructTree,
  operator: TreeNodeOperator<boolean>,
  nodeList: StructTreeNode[] = [],
): boolean {
  return tree.every((treeNode, index) => {
    if (treeNode.children && treeNode.children.length) {
      return postOrderTraverseLeaf(treeNode.children, operator, [...nodeList, treeNode]);
    }
    return operator(treeNode, index, nodeList);
  });
}

function postOrderTraverse(
  tree: StructTree,
  operator: TreeNodeOperator<boolean>,
  nodeList: StructTreeNode[] = [],
): boolean {
  let output = true;
  tree.forEach((treeNode, index) => {
    if (treeNode.children && treeNode.children.length) {
      const result = postOrderTraverse(treeNode.children, operator, [...nodeList, treeNode]);
      output = operator(treeNode, index, nodeList, result) && output;
      return;
    }
    output = operator(treeNode, index, nodeList) && output;
  });
  return output;
}

function flattenValueTreeInner(valueTree: any): CascaderValue[][] {
  const keys = Object.keys(valueTree);
  if (!keys.length) {
    return [keys];
  }

  const result: CascaderValue[][] = [];
  keys.forEach(key => {
    const item = valueTree[key];
    flattenValueTreeInner(item).forEach(child => {
      result.push([key, ...child]);
    });
  });

  return result;
}
function flattenValueTree(valueTree: any): CascaderValue[][] {
  const keys = Object.keys(valueTree);
  if (!keys.length) return [];
  return flattenValueTreeInner(valueTree);
}

function constructValueTree(activeValue: StructTreeValue[][]): any {
  const result: any = {};
  let currentNode = result;
  (activeValue as StructTreeValue[][]).forEach(multipleValue => {
    multipleValue.forEach((itemValue: any, index) => {
      if (!currentNode[itemValue]) {
        currentNode[itemValue] = {} as any;
      }

      currentNode = currentNode[itemValue];

      if (index === multipleValue.length - 1) {
        currentNode = result;
      }
    });
  });
  return result;
}

function isSameValue(former: CascaderValue[], latter: CascaderValue[]): boolean {
  return (
    former.length === latter.length &&
    former.every((item, index) => {
      return item === latter[index];
    })
  );
}

const bem = createBEM('cascader');

function Cascader(props: CascaderProps): JSX.Element {
  const {
    value,
    defaultValue,

    multiple,
    showAll,
    showAllText,
    options: propsOptions,

    showBadge,

    ellipsis,

    icon,

    displayStrategy,
    badgeStrategy,
    checkStrategy,

    load,

    onChange: propsOnChange,
    onActiveItemChange,
  } = props;

  const [nodeInfoMap, setNodeInfoMap] = useState<CascaderNodeInfoMap>({});

  const options = useMemo(() => {
    return preOrderTraverse(propsOptions, treeNode => {
      const nodeInfo = nodeInfoMap[treeNode.value as any];
      if (nodeInfo) {
        return {
          ...treeNode,
          ...nodeInfo,
        };
      }
      return null;
    });
  }, [propsOptions, nodeInfoMap]);

  const optionMap = useMemo(() => {
    const result: any = {};
    preOrderTraverse(options, (treeNode, index, nodeList) => {
      result[treeNode.value as any] = {
        node: treeNode,
        nodeList,
      };
      return null;
    });
    return result;
  }, [options]);

  const [propActiveValue] = useControlled<CascaderValue[] | CascaderValue[][]>(value, defaultValue);

  const invalidValue = useRef<StructTreeValue[] | StructTreeValue[][]>([]);
  const activeValue = useMemo(() => {
    if (multiple) {
      const newInvalidValue: CascaderValue[] | CascaderValue[][] = [];
      const validPropsValue: CascaderValue[] | CascaderValue[][] = [];

      propActiveValue.forEach(orgparentNode => {
        let currentNodeInfo;
        if (checkStrategy === 'parent') {
          currentNodeInfo = optionMap[orgparentNode as any];
        } else {
          currentNodeInfo =
            optionMap[(orgparentNode as any)[(orgparentNode as any).length - 1] as any];
        }
        if (currentNodeInfo) {
          validPropsValue.push(orgparentNode as any);
        } else {
          newInvalidValue.push(orgparentNode as any);
        }
      });

      invalidValue.current = newInvalidValue;

      if (/parent/.test(checkStrategy!)) {
        const results: CascaderValue[][] = [];
        validPropsValue.forEach(orgparentNode => {
          let currentNodeInfo;
          if (checkStrategy === 'parent') {
            currentNodeInfo = optionMap[orgparentNode as any];
          } else {
            currentNodeInfo =
              optionMap[(orgparentNode as any)[(orgparentNode as any).length - 1] as any];
          }
          const parentNode = (
            checkStrategy === 'parent'
              ? [...currentNodeInfo.nodeList.map((item: any) => item.value), orgparentNode]
              : orgparentNode
          ) as CascaderValue[];
          const currentNode = currentNodeInfo.node;
          if (currentNode.children && currentNode.children.length) {
            postOrderTraverseLeaf(currentNode.children, (treeNode, index, nodeList) => {
              results.push([
                ...parentNode,
                ...nodeList.map(theNode => theNode.value),
                treeNode.value,
              ]);
              return true;
            });
          } else {
            results.push([...parentNode]);
          }
        });

        return results;
      }
    }

    return propActiveValue;
  }, [propActiveValue, multiple, optionMap, checkStrategy]);

  const onChange = useCallback<CascaderOnChange>(
    newValue => {
      if (multiple && /parent/.test(checkStrategy!)) {
        const oldValueTree = constructValueTree(newValue as CascaderValue[][]);

        const theValueTree = {} as any;
        postOrderTraverse(options, (treeNode, index, nodeList, info) => {
          if (treeNode.children && treeNode.children.length) {
            if (info) {
              let currentValueTree = theValueTree;
              const route = [...nodeList, treeNode];
              route.forEach((routeNode, routeIndex) => {
                if (routeIndex === route.length - 1) {
                  currentValueTree[routeNode.value as any] = {};
                } else {
                  currentValueTree = currentValueTree[routeNode.value as any];
                }
              });
              return true;
            }
            return false;
          }
          let currentOldValueTree = oldValueTree;
          let currentValueTree = theValueTree;
          const result = [...nodeList, treeNode].every(routeNode => {
            if (currentOldValueTree[routeNode.value as any]) {
              currentOldValueTree = currentOldValueTree[routeNode.value as any];
              return true;
            }
            return false;
          });
          if (result) {
            [...nodeList, treeNode].forEach(routeNode => {
              if (!currentValueTree[routeNode.value as any]) {
                currentValueTree[routeNode.value as any] = {};
              }
              currentValueTree = currentValueTree[routeNode.value as any];
            });
          }
          return result;
        });

        const result = flattenValueTree(theValueTree);

        propsOnChange?.(
          ([] as CascaderValue[] | CascaderValue[][])
            .concat(
              checkStrategy === 'parent'
                ? result.map(item => {
                    return item[item.length - 1];
                  })
                : result,
            )
            .concat(invalidValue.current),
        );
        return;
      }

      if (multiple) {
        propsOnChange?.(([] as CascaderValue[][]).concat(newValue).concat(invalidValue.current));
        return;
      }

      propsOnChange?.(newValue);
    },
    [propsOnChange, multiple, options],
  );

  // 展开的层级
  // 受控模式下，如果更改 multiple 的值，如何展开呢？
  // 暂时不考虑 value 副作用时控制展开
  const [activeStruct, setActiveStruct] = useState(() => {
    if (multiple) {
      if (activeValue[0]) {
        return (activeValue[0] as CascaderValue[]).slice(0, -1);
      }
      return [];
    }
    return activeValue.slice(0, -1);
  });

  /**
   * construct value's tree to calc selectAll
   */
  const valueTree = useMemo(() => {
    if (multiple) {
      return constructValueTree(activeValue as StructTreeValue[][]);
    }
    return {};
  }, [activeValue, multiple]);

  const dyeingOptions = useMemo<CascaderColumn[]>(() => {
    const flatTree = [options];

    traceTreeByValue(options, activeStruct, (node: CascaderStatusOptions) => {
      if (node.children && node.children.length) {
        flatTree.push(node.children);
      } else if (node.loading) {
        flatTree.push([]);
      }
    });

    if (multiple) {
      let matchedValue = activeValue as CascaderValue[][];

      // 每一层选择的 value
      const layerMatchedValue = [matchedValue];

      activeStruct.forEach((layerValue, layerIndex) => {
        matchedValue = matchedValue.filter(item => {
          return item[layerIndex] === activeStruct[layerIndex];
        });

        layerMatchedValue.push(matchedValue);
      });

      const selectAllResult = flatTree.map((layerOptions, columnIndex) => {
        let currentValueTree = valueTree;
        activeStruct.slice(0, columnIndex).every((structValue: any) => {
          if (currentValueTree[structValue]) {
            currentValueTree = currentValueTree[structValue];
            return true;
          }
          currentValueTree = {};
          return false;
        });
        return postOrderTraverseLeaf(layerOptions, (treeNode, layer, nodeList) => {
          let lastNode = currentValueTree;
          const branch = [...nodeList, treeNode];
          for (let i = 0; i < branch.length; i++) {
            const node = branch[i] as any;
            if (lastNode[node.value]) {
              lastNode = lastNode[node.value];
            } else {
              return false;
            }
          }
          return true;
        });
      });

      return flatTree.map((layer, layerIndex) => {
        return {
          selectAll: layer.length ? selectAllResult[layerIndex] : false,
          rows: layer.map(item => {
            if (
              layerIndex < activeStruct.length ||
              (layerIndex === activeStruct.length && item.children && item.children.length)
            ) {
              const active = item.value === activeStruct[layerIndex];
              const itemMatchedValue = layerMatchedValue[layerIndex].filter(theValue => {
                return theValue[layerIndex] === item.value;
              });
              return {
                ...item,
                active,
                checked:
                  item.children && item.children.length
                    ? false
                    : !!layerMatchedValue[layerIndex].find(valueItem => {
                        return valueItem[layerIndex] === item.value;
                      }),
                selectedCount:
                  badgeStrategy === 'adjacent'
                    ? new Set(
                        itemMatchedValue.map(valueItem => {
                          return valueItem[layerIndex + 1];
                        }),
                      ).size
                    : itemMatchedValue.length || 0,
              };
            }

            return {
              ...item,
              active: false,
              checked: !!layerMatchedValue[layerIndex].find(valueItem => {
                return valueItem[layerIndex] === item.value;
              }),
            };
          }),
        };
      });
    }

    return flatTree.map((layer, layerIndex) => {
      return {
        selectAll: false,
        rows: layer.map(item => {
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
        }),
      };
    });
  }, [activeValue, activeStruct, options, valueTree]);

  const onRowClick = (
    row: CascaderOption,
    column: CascaderColumn,
    columnIndex: number,
    selectAllIndex: number | undefined,
  ): void => {
    // defer data
    if (row.needLoad && !(row.children && row.children.length)) {
      const newActiveStruct = activeStruct.slice(0, columnIndex);
      newActiveStruct.push(row.value);
      setActiveStruct(newActiveStruct);
      onActiveItemChange?.(newActiveStruct);
      setNodeInfoMap(oldValue => {
        return {
          ...oldValue,
          [row.value as any]: {
            loading: true,
          },
        };
      });
      load?.(row).then((result = []) => {
        if (result.length) {
          const newActiveValue = (activeValue as CascaderValue[][]).filter(singleValue => {
            return !isSameValue(singleValue, newActiveStruct);
          });
          if (multiple) {
            const isChecked = activeValue.length !== newActiveValue.length;
            if (isChecked) {
              result.forEach(node => {
                newActiveValue.push([...newActiveStruct, node.value]);
              });
            }
          }
          onChange(newActiveValue);
        }
        setNodeInfoMap(oldValue => {
          return {
            ...oldValue,
            [row.value as any]: {
              loading: false,
              needLoad: false,
              children: result,
            },
          };
        });

        if (!result.length) {
          setActiveStruct(oldValue => {
            return oldValue.slice(0, -1);
          });
        }
      });
      return;
    }

    if (multiple) {
      const newActiveStruct = activeStruct.slice(0, columnIndex);
      if (row.children && row.children.length) {
        newActiveStruct.push(row.value);
        setActiveStruct(newActiveStruct);
        onActiveItemChange?.(newActiveStruct);
      } else {
        let repeatedIndex: number;
        const repeatedActiveValue = (activeValue as CascaderValue[][]).some(
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
        setActiveStruct(newActiveStruct);
        onActiveItemChange?.(newActiveStruct);
        if (repeatedActiveValue) {
          let newActiveValue;

          if (
            displayStrategy === 'minimalist' &&
            typeof selectAllIndex !== 'undefined' &&
            !(selectAllIndex === columnIndex && column.rows.length === 1)
          ) {
            const currentItem = (activeValue as StructTreeValue[][])[repeatedIndex!];
            newActiveValue = (activeValue as StructTreeValue[][]).filter(valueItem => {
              return !activeStruct.slice(0, selectAllIndex).every((theValue, valueIndex) => {
                return theValue === valueItem[valueIndex];
              });
            });
            newActiveValue.push(currentItem);
          } else {
            newActiveValue = (activeValue as CascaderValue[][]).filter((item, index) => {
              return index !== repeatedIndex;
            });
          }
          onChange(newActiveValue);
        } else {
          onChange(
            ([] as CascaderValue[][])
              .concat(activeValue)
              .concat([([] as CascaderValue[]).concat(newActiveStruct).concat(row.value)]),
          );
        }
      }
    } else {
      const newActiveStruct = activeStruct.slice(0, columnIndex);
      if (row.children && row.children.length) {
        newActiveStruct.push(row.value);
        setActiveStruct(newActiveStruct);
        onActiveItemChange?.(newActiveStruct);
        onChange([]);
      } else {
        if (activeValue[columnIndex] === row.value) {
          return;
        } else {
          setActiveStruct(newActiveStruct);
          onActiveItemChange?.(newActiveStruct);
          onChange(([] as CascaderValue[]).concat(newActiveStruct).concat(row.value));
        }
      }
    }
  };

  const onSelectAllClick = (
    column: CascaderColumn,
    columnIndex: number,
    selectAllIndex: number | undefined,
  ): void => {
    function addTreeNode(theValueTree: any, theColumnIndex: number) {
      let currentValueTree = { ...theValueTree } as any;
      let currentValueNode = currentValueTree;
      activeStruct.slice(0, theColumnIndex).forEach((structValue: any, structIndex: number) => {
        if (currentValueNode[structValue]) {
          if (structIndex === theColumnIndex - 1) {
            delete currentValueNode[structValue];
            return true;
          }
          currentValueNode[structValue] = { ...currentValueNode[structValue] };
        } else {
          if (structIndex === theColumnIndex - 1) {
            return;
          }
          currentValueNode[structValue] = {};
        }
        currentValueNode = currentValueNode[structValue];
      });

      const newValues = [] as StructTreeValue[][];
      postOrderTraverseLeaf(column.rows, (treeNode, index, nodeList) => {
        newValues.push(
          [...nodeList, treeNode].map(item => {
            return item.value;
          }),
        );
        return true;
      });
      const nodeValueTree = constructValueTree(newValues);
      if (theColumnIndex) {
        currentValueNode[activeStruct[theColumnIndex - 1] as any] = nodeValueTree;
      } else {
        currentValueTree = nodeValueTree;
      }
      return currentValueTree;
    }

    const newActiveStruct = activeStruct.slice(0, columnIndex);
    setActiveStruct(newActiveStruct);

    if (!column.selectAll) {
      const currentValueTree = addTreeNode(valueTree, columnIndex);
      onChange(flattenValueTree(currentValueTree));
      return;
    }

    if (displayStrategy === 'minimalist' && selectAllIndex! < columnIndex) {
      const newActiveValue =
        selectAllIndex === 0
          ? []
          : (activeValue as StructTreeValue[][]).filter(valueItem => {
              return !activeStruct.slice(0, selectAllIndex).every((theValue, valueIndex) => {
                return theValue === valueItem[valueIndex];
              });
            });

      const currentValueTree = addTreeNode(constructValueTree(newActiveValue), columnIndex);

      onChange(flattenValueTree(currentValueTree));

      return;
    }

    const newActiveValue = (activeValue as StructTreeValue[][]).filter(valueItem => {
      return !activeStruct.slice(0, columnIndex).every((theValue, valueIndex) => {
        return theValue === valueItem[valueIndex];
      });
    });

    onChange(newActiveValue);
  };

  const CheckIcon = icon ? (
    <div className={bem('row-icon')}>{typeof icon === 'function' ? icon() : icon}</div>
  ) : (
    <Icon name="CheckOne" className={bem('row-icon')} />
  );

  const renderRow = function (
    row: CascaderOption,
    column: CascaderColumn,
    columnIndex: number,
    selectAllIndex: number | undefined,
    isShowAll: boolean,
  ): JSX.Element {
    const { active, checked, selectedCount } = row;

    const { selectAll } = column;

    const hasBadge = showBadge && !!selectedCount;

    // according to displayStrategy, decide whether to show active
    const showChecked = (displayStrategy === 'minimalist' && showAll ? !selectAll : true)
      ? true
      : displayStrategy === 'minimalist' && showAll && !isShowAll && selectAllIndex === columnIndex;

    return (
      <div
        key={row.value.toString() + columnIndex}
        className={bem('row', [{ active, checked: showChecked && checked, hasBadge }])}
        onClick={(): void => {
          onRowClick(row, column, columnIndex, selectAllIndex);
        }}
      >
        <span className={bem('row__text')} style={{ WebkitLineClamp: ellipsis }}>
          {row.label}
        </span>
        {showChecked && hasBadge && <span className={bem('row-badge')}>{selectedCount}</span>}
        {showChecked && checked && CheckIcon}
      </div>
    );
  };

  const renderColumn = function (): JSX.Element[] {
    // fixme
    // when colunIndex < selectAllIndex, selectAllIndex is undefined
    // when columnIndex === selectAllIndex, true
    // when columnIndex > selectAllIndex, false
    let selectAllIndex: number | undefined;

    return dyeingOptions.map((column, columnIndex) => {
      const columnKey =
        columnIndex === 0 ? 'firstcolumn' : activeStruct[columnIndex - 1].toString() + columnIndex;
      if (typeof selectAllIndex === 'undefined' && column.selectAll) {
        selectAllIndex = columnIndex;
      }

      // according to displayStrategy, decide whether to show active
      const showChecked = displayStrategy === 'minimalist' ? selectAllIndex === columnIndex : true;

      // if last column.showAll is false, there is no showAll
      const isShowAll =
        !!column.rows.length &&
        ((columnIndex === 0
          ? undefined
          : dyeingOptions[columnIndex - 1].rows.find(item => {
              return item.value === activeStruct[columnIndex - 1];
            })?.showAll) ??
          showAll!);

      return (
        <div className={bem('column')} key={columnKey}>
          {isShowAll && (
            <div
              className={bem('row', [
                { checked: selectAllIndex === columnIndex && column.selectAll },
              ])}
              style={{ WebkitLineClamp: ellipsis }}
              onClick={(): void => onSelectAllClick(column, columnIndex, selectAllIndex)}
            >
              <span className={bem('row__text')} style={{ WebkitLineClamp: ellipsis }}>
                {showAllText}
              </span>
              {showChecked && column.selectAll && CheckIcon}
            </div>
          )}
          {!column.rows.length && (
            <div className={bem('loading')}>
              <Loading />
            </div>
          )}
          {column.rows.map(row => {
            return renderRow(row as CascaderOption, column, columnIndex, selectAllIndex, isShowAll);
          })}
        </div>
      );
    });
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
      <div className={bem('columns')}>{renderColumn()}</div>
    </div>
  );
}

Cascader.defaultProps = {
  multiple: false,
  showBadge: true,
  defaultValue: [],
  showToolbar: false,
  showAll: true,
  showAllText: '全部',

  ellipsis: 1,

  displayStrategy: 'normal',
  badgeStrategy: 'normal',
  checkStrategy: 'child-route',
};

export default Cascader;

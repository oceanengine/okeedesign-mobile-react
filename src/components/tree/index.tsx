/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { FC, CSSProperties, useState, MouseEventHandler, useMemo } from 'react';

import createBEM, { addClass } from '../../utils/create/createBEM';

import Icon from '../icon';
import Toolbar, { ToolbarProps } from '../toolbar';

const bem = createBEM('tree');

// ================================
// Props

export interface TreeValue {
  /**
   * The value of the node.
   */
  value: string | number;

  /**
   * Status, 'all' means all of children are selected or the node itself is selected.
   */
  status?: 'all' | 'partial';

  /**
   * The child nodes.
   */
  children?: TreeValue[];
}

export interface TreeOption {
  /**
   * The id attribute for HTML element.
   */
  id?: string;

  /**
   * The text content for display.
   */
  label: string;

  /**
   * The value of the option.
   */
  value?: string | number;

  /**
   * The nested child options, if provided in flat mode, the value of the option itself will be ignored.
   */
  children?: TreeOption[];
}

export interface TreeProps extends ToolbarProps {
  className?: string;
  style?: CSSProperties;

  /**
   * The options array for selecting
   */
  options: TreeOption[];

  /**
   * Selected values, uses with `onChange` callback.
   */
  value: (string | number)[] | TreeValue[];

  /**
   * Required callback when tree option is checked or un-checked.
   * @param value new selected values.
   */
  onChange(value: (string | number)[] | TreeValue[]): void;

  /**
   * Change the behavior of partially selected options to 'unselect all'.
   * @default false
   */
  partialToUnselectAll?: boolean;

  /**
   * Flat mode, use one-dimensional array for bound value.
   * Note that the value of none-end nodes in options will be ignore.
   * @default false
   */
  flat?: boolean;
}
// ================================
// Helpers

/**
 * @internal
 * Maps tree options to selected value
 */
interface TreeOptionSelectedMap {
  [p: string]: boolean | TreeOptionSelectedMap;
  [p: number]: boolean | TreeOptionSelectedMap;
}

/**
 * @internal
 */
type TreeSelectedStatus = 'all' | 'partial' | 'none';

function findValue(option: TreeOption, values: TreeValue[]): TreeValue | undefined {
  for (const curValue of values) {
    if (option.value === curValue.value) {
      return curValue;
    }
    if (curValue.children && curValue.children.length > 0) {
      const childResult = findValue(option, curValue.children);
      if (childResult) {
        return childResult;
      }
    }
  }
  return undefined;
}

function mapTreeOptionAllSelected(options: TreeOption[]): TreeOptionSelectedMap {
  const map: TreeOptionSelectedMap = {};
  options.forEach(option => {
    const { value, children } = option;
    if (!children || children.length === 0) {
      map[value!] = true;
      return;
    }
    map[value!] = mapTreeOptionAllSelected(children);
  });
  return map;
}

function mapTreeOptions(options: TreeOption[], values: TreeValue[]): TreeOptionSelectedMap {
  const map: TreeOptionSelectedMap = {};
  options.forEach(option => {
    const value = findValue(option, values);
    if (!option.children || option.children.length === 0) {
      map[option.value!] = !!value;
      return;
    }
    map[option.value!] =
      value?.status === 'all'
        ? mapTreeOptionAllSelected(option.children)
        : mapTreeOptions(option.children, values);
  });
  return map;
}

function formTreeValuesFromMap(options: TreeOption[], map: TreeOptionSelectedMap): TreeValue[] {
  return options
    .map<TreeValue | undefined>(option => {
      const { value, children: childOptions } = option;
      const subMap = map[value!];
      if (!childOptions || childOptions.length === 0) {
        if (subMap) {
          return {
            value: value!,
            status: 'all',
          };
        }
        return undefined;
      }
      const children = formTreeValuesFromMap(childOptions, subMap as TreeOptionSelectedMap);
      if (children.length === 0) {
        return undefined;
      }
      const status =
        children.length < childOptions.length || children.some(c => c.status === 'partial')
          ? 'partial'
          : 'all';
      return {
        value: value!,
        children,
        status,
      };
    })
    .filter((v): v is TreeValue => !!v);
}

function getSubMap(
  map: TreeOptionSelectedMap,
  valuePath: (string | number)[],
): TreeOptionSelectedMap | boolean {
  let subMap: TreeOptionSelectedMap | boolean = map;
  valuePath.forEach(segment => {
    if (typeof subMap === 'object') {
      subMap = subMap[segment];
    }
  });
  return subMap;
}

function modifyMap(map: TreeOptionSelectedMap, target: boolean): void {
  Object.entries(map).forEach(([value, subMap]) => {
    if (typeof subMap === 'boolean') {
      map[value] = target;
    } else {
      modifyMap(subMap, target);
    }
  });
}

function getOptionStatus(
  map: TreeOptionSelectedMap,
  option: TreeOption,
  valuePath: (string | number)[],
): TreeSelectedStatus {
  const { children } = option;
  const subMap = getSubMap(map, valuePath);
  if (!children || children.length === 0) {
    if (subMap) {
      return 'all';
    } else {
      return 'none';
    }
  }

  const { length } = children;
  let amountAll = 0;
  let amountNone = 0;
  children.forEach(c => {
    switch (getOptionStatus(map, c, [...valuePath, c.value!])) {
      case 'all':
        amountAll += 1;
        break;
      case 'none':
        amountNone += 1;
        break;
      default:
        break;
    }
  });

  if (amountAll === length) {
    return 'all';
  }
  if (amountNone === length) {
    return 'none';
  }
  return 'partial';
}

function getOptionStatusFlat(
  selectedValues: (string | number)[],
  option: TreeOption,
): TreeSelectedStatus {
  const { value, children } = option;
  if (!children || children.length === 0) {
    if (selectedValues.includes(value!)) {
      return 'all';
    } else {
      return 'none';
    }
  }

  const { length } = children;
  let amountAll = 0;
  let amountNone = 0;
  children.forEach(c => {
    switch (getOptionStatusFlat(selectedValues, c)) {
      case 'all':
        amountAll += 1;
        break;
      case 'none':
        amountNone += 1;
        break;
      default:
        break;
    }
  });

  if (amountAll === length) {
    return 'all';
  }
  if (amountNone === length) {
    return 'none';
  }
  return 'partial';
}

function getOptionValuesFlat(option: TreeOption): (string | number)[] {
  const { value, children } = option;
  if (!children || children.length === 0) {
    return [value!];
  }
  return children.map(c => getOptionValuesFlat(c)).flat(1);
}

// ================================
// Component

const Tree: FC<TreeProps> = (props: TreeProps) => {
  const {
    className,
    style,
    value: selectedValues,
    options,
    onChange,
    partialToUnselectAll,
    flat,
  } = props;

  const [expandedValuePaths, setExpandedValuePaths] = useState<(string | number)[][]>([]);
  const selectedMap = useMemo<TreeOptionSelectedMap>(() => {
    if (!flat) {
      return mapTreeOptions(options, selectedValues as TreeValue[]);
    }
    return {};
  }, [selectedValues]);

  const classes = bem();

  const detectExpanded = (valuePath: (string | number)[]): number =>
    expandedValuePaths.findIndex(path => {
      if (path.length !== valuePath.length) {
        return false;
      }
      for (let i = 0; i < path.length; i++) {
        if (path[i] !== valuePath[i]) {
          return false;
        }
      }
      return true;
    });
  const switchExpand = (valuePath: (string | number)[]): void => {
    const index = detectExpanded(valuePath);
    if (index > -1) {
      setExpandedValuePaths(expandedValuePaths.filter((_, i) => i !== index));
      return;
    }
    setExpandedValuePaths([...expandedValuePaths, valuePath]);
  };

  const change = (option: TreeOption, valuePath: (string | number)[]): void => {
    if (flat) {
      const selectedValuesFlat = selectedValues as (string | number)[];
      const optionStatus = getOptionStatusFlat(selectedValuesFlat, option);
      const optionValues = getOptionValuesFlat(option);
      const newValue: (string | number)[] =
        optionStatus === 'none' || (optionStatus === 'partial' && !partialToUnselectAll)
          ? Array.from(new Set([...selectedValuesFlat, ...optionValues]))
          : selectedValuesFlat.filter(v => !optionValues.includes(v));
      onChange(newValue);
      return;
    }

    // const selectedTreeValues = selectedValues as TreeValue[];
    const optionStatus = getOptionStatus(selectedMap, option, valuePath);
    const subMap = getSubMap(selectedMap, valuePath);
    const target = optionStatus === 'none' || (optionStatus === 'partial' && !partialToUnselectAll);
    if (typeof subMap === 'object') {
      modifyMap(subMap, target);
    } else {
      const parentMap = getSubMap(
        selectedMap,
        valuePath.slice(0, valuePath.length - 1),
      ) as TreeOptionSelectedMap;
      parentMap[valuePath[valuePath.length - 1]] = target;
    }
    const newValue = formTreeValuesFromMap(options, selectedMap);
    onChange(newValue);
  };

  const renderOption = (
    option: TreeOption,
    index: number,
    level: number,
    indent: boolean,
    valuePath: (string | number)[],
  ): JSX.Element => {
    const { id, label, value, children } = option;
    const hasChildren = !!children && children.length > 0;
    const hasGrandchildren =
      hasChildren && children!.some(c => c.children && c.children.length > 0);
    const currentValuePath: (string | number)[] = [...valuePath, value!];
    const expanded = detectExpanded(currentValuePath) > -1;
    const status = flat
      ? getOptionStatusFlat(selectedValues as (string | number)[], option)
      : getOptionStatus(selectedMap, option, currentValuePath);

    const onExpand: MouseEventHandler<HTMLDivElement> = event => {
      event.stopPropagation();
      event.preventDefault();
      switchExpand(currentValuePath);
    };
    const onChange: MouseEventHandler<HTMLDivElement> = event => {
      event.stopPropagation();
      event.preventDefault();
      change(option, currentValuePath);
    };

    return (
      <div className={bem('node')} key={value}>
        <div className={bem('container')} id={id} onClick={(hasChildren && onExpand) || onChange}>
          {(hasChildren && (
            <Icon className={bem('triangular', { expanded })} name="Triangular"></Icon>
          )) ||
            (indent && <i className={bem('triangular')}></i>)}
          <span className={bem('label')}>{label}</span>
          {(status === 'none' && (
            <i className={bem('check', `status-${status}`)} onClick={onChange}></i>
          )) || (
            <Icon
              className={bem('check', `status-${status}`)}
              name={(status === 'all' && 'Check') || 'PartialCheck'}
              onClick={onChange}
            ></Icon>
          )}
        </div>

        <div className={bem('children', { expanded })}>
          {hasChildren &&
            children!.map((c, i) =>
              renderOption(c, i, level + 1, hasGrandchildren, currentValuePath),
            )}
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

  const hasChildren = options.some(o => o.children && o.children.length > 0);
  const currentValuePath: (string | number)[] = [];

  return (
    <div className={addClass(classes, className)} style={style}>
      {renderToolbar()}
      <div className={bem('body')}>
        {options.map((option, index) =>
          renderOption(option, index, 0, hasChildren, currentValuePath),
        )}
      </div>
    </div>
  );
};

Tree.defaultProps = {
  showToolbar: false,
};

Tree.displayName = 'Tree';

export default Tree;

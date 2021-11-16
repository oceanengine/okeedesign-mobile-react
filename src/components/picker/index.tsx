import React, { HTMLAttributes, useMemo } from 'react';

import createBEM from '../../utils/create/createBEM';
import { createI18N } from '../../utils/create/i18n';
import {
  StructFlatTree,
  StructTree,
  StructTreeValue,
  walkTree,
  traceTreeByValue,
  findTreeNode,
} from '../../utils/struct/tree';
import { UnionOmit } from '../../utils/types';

import PickerColumn from '../picker-column';
import Toolbar, { ToolbarProps } from '../toolbar';

export type PickerOptions = StructTree | StructFlatTree;
export interface PickerSelf extends ToolbarProps {
  value: StructTreeValue[] | StructTreeValue;
  options: PickerOptions;
  itemHeight?: number;
  itemLength?: number;
  columnSequence?: number[];
  onChange?(value: StructTreeValue[] | StructTreeValue): void;
  onInput?(value: StructTreeValue[] | StructTreeValue): void;
}

export type PickerProps = UnionOmit<PickerSelf, HTMLAttributes<HTMLDivElement>>;

const bem = createBEM('picker');
const i18n = createI18N('picker');

function Picker(props: PickerProps): JSX.Element {
  const {
    value,
    options,
    title,
    showToolbar,
    confirmButtonText = i18n('confirm'),
    cancelButtonText = i18n('cancel'),
    itemHeight,
    itemLength,
    columnSequence,
    onChange,
    onInput,
    onConfirm,
    onCancel,

    renderHead,
  } = props;

  const Head = (): JSX.Element => {
    return (
      <Toolbar
        showToolbar={showToolbar}
        title={title}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        onConfirm={onConfirm}
        onCancel={onCancel}
        renderHead={renderHead}
      />
    );
  };

  const isCascaded = useMemo(() => {
    if (!options.length || Array.isArray(options[0])) {
      return false;
    }
    return true;
  }, [options]);

  const defaultValue = useMemo(() => {
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  }, [value]);

  const flatColumns = useMemo<StructFlatTree>(() => {
    if (!options.length) {
      return [];
    }
    if (isCascaded) {
      if (!value || (Array.isArray(value) && !value.length)) {
        const columns = [options as StructTree];
        walkTree(options as StructTree, node => {
          if (node && node.children) {
            columns.push(node.children);
          }
        });
        return columns;
      }
      if (Array.isArray(value)) {
        const columns = [options as StructTree];
        traceTreeByValue(options as StructTree, value, node => {
          if (node && node.children) {
            columns.push(node.children);
          }
        });
        return columns;
      }
    }
    return options as StructFlatTree;
  }, [options, value]);

  const onPickerColumnInput = (newValue: StructTreeValue, columnIndex: number): void => {
    if (options.length > 1 && Array.isArray(options[0])) {
      const newValues = flatColumns.map((column, index) => {
        if (columnIndex === index) {
          return newValue;
        }
        if (!defaultValue[index]) {
          return column[0].value;
        }
        return defaultValue[index];
      });
      onInput?.(newValues);
      onChange?.(newValues);
    } else if (isCascaded) {
      const newValues = [];
      let tree = options as StructTree | undefined;
      let index = 0;

      while (tree) {
        let theValue;
        if (index === columnIndex) {
          theValue = newValue;
        } else if (index < columnIndex) {
          if (!defaultValue[index]) {
            theValue = tree[0].value;
          } else {
            theValue = defaultValue[index];
          }
        } else {
          theValue = tree[0].value;
        }
        newValues.push(theValue);
        index++;
        const treeNode = findTreeNode(tree, theValue!);
        tree = treeNode?.children;
      }

      onInput?.(newValues);
      onChange?.(newValues);
    } else {
      onInput?.(newValue);
      onChange?.(newValue);
    }
  };
  const Content = (): JSX.Element => {
    let pickerColumns = flatColumns.map((column, index) => {
      return (
        <PickerColumn
          key={index}
          columnIndex={index}
          value={defaultValue[index]}
          options={column}
          itemHeight={itemHeight!}
          itemLength={itemLength!}
          onInput={(newValue): void => {
            onPickerColumnInput(newValue, index);
          }}
        />
      );
    });
    if (columnSequence) {
      if (columnSequence!.length === pickerColumns.length) {
        pickerColumns = columnSequence!.map(seqNo => {
          return pickerColumns[seqNo];
        });
      }
    }
    return (
      <div className={bem('content')}>
        <div className={bem('mask')}></div>
        <div className={bem('indicator')}></div>
        {pickerColumns}
      </div>
    );
  };

  return (
    <div className={bem()}>
      {Head()}
      {Content()}
    </div>
  );
}

const DEFAULT_ITEM_LENGTH = 5;
const DEFAULT_ITEM_HEIGHT = 44;

Picker.defaultProps = {
  title: '',
  showToolbar: true,
  itemHeight: DEFAULT_ITEM_HEIGHT,
  itemLength: DEFAULT_ITEM_LENGTH,
};

export default Picker;

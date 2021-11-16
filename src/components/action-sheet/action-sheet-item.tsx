import * as React from 'react';
import createBEM, { prefix } from '../../utils/create/createBEM';
const bem = createBEM('action-sheet');

export interface ActionSheetItemType {
  name: string;
  subname?: string;
  loading?: boolean;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  callback?: (item: ActionSheetItemType) => void;
}

export interface ActionSheetItemProps {
  item: ActionSheetItemType;
  index: number;
  onClick: (item: ActionSheetItemType, index: number) => void;
}

export default function ActionSheetItem(props: ActionSheetItemProps): JSX.Element {
  const { onClick, item, index } = props;
  const disabled = item.disabled || item.loading;

  function onClickOption(event: React.MouseEvent): void {
    event.stopPropagation();

    if (item.disabled || item.loading) {
      return;
    }

    if (item.callback) {
      item.callback(item);
    }
    onClick(item, index);
  }

  // loading态的样式icon待实现
  const OptionContent = item.loading ? (
    <i className={`${bem('loading')} '${prefix}loading'`}></i>
  ) : (
    [
      <span className={bem('name')} key={item.name + index}>
        {item.name}
      </span>,
      item.subname && (
        <span className={bem('subname')} key={item.subname + index}>
          {item.subname}
        </span>
      ),
    ]
  );

  return (
    <div
      className={`${bem('item', { disabled, active: item.active })} ${
        item.className ? item.className : ''
      } ${item.subname ? 'subname' : ''} ${prefix}hairline--top`}
      onClick={onClickOption}
    >
      {OptionContent}
    </div>
  );
}

import * as React from 'react';
import createBEM, { addClass, prefix } from '../../utils/create/createBEM';
import Popup from '../popup';
import { ActionSheetOptions } from './index';
import ActionSheetItem, { ActionSheetItemType } from './action-sheet-item';
import Icon from '../icon';

const bem = createBEM('action-sheet');

export interface ActionSheetProps extends ActionSheetOptions {
  value: boolean;
  close?: (...args: any[]) => void;
  afterClose?: () => void;
  children?: React.ReactNode;
}

function ActionSheet(props: ActionSheetProps): JSX.Element {
  const {
    title,
    cancelText,
    showClose,
    value,
    close,
    onCancel,
    onSelect,
    onClose,
    safeAreaInsetBottom,
    className,
  } = props;

  function handleCancel(): void {
    onCancel && onCancel();
    onClose?.();
    close && close();
  }

  // 缺少标题右边关闭按钮的icon
  const Close = showClose && <Icon className={bem('close')} onClick={handleCancel} name="Close" />;

  const Header = title && (
    <div className={`${bem('header')} ${prefix}hairline--bottom`}>
      {title}
      {Close}
    </div>
  );

  const Content = props.children && <div className={bem('content')}>{props.children}</div>;

  const CancelText = cancelText && (
    <div className={bem('cancel')} onClick={handleCancel}>
      <div className={bem('cancel__text')}>{cancelText}</div>
    </div>
  );

  function handleClick(item: ActionSheetItemType, index: number): void {
    onSelect && onSelect(item, index);
    if (props.closeOnClickAction) {
      close && close();
    }
  }

  return (
    <Popup
      className={addClass(bem({ 'safe-area-inset-bottom': safeAreaInsetBottom }), className)}
      position="bottom"
      value={value}
      afterClose={props.afterClose}
      onChange={(value): void => {
        if (!value) {
          close && close();
          onClose?.();
        }
      }}
    >
      {Header}
      {props.actions &&
        props.actions.map((item: ActionSheetItemType, index: number) => {
          return (
            <ActionSheetItem
              key={item.name + index}
              item={item}
              index={index}
              onClick={handleClick}
            />
          );
        })}
      {Content}
      {CancelText}
    </Popup>
  );
}

const defaultProps: ActionSheetProps = {
  value: true,
  safeAreaInsetBottom: true,
  closeOnClickAction: true,
  duration: 0.3,
  showClose: true,
};

ActionSheet.defaultProps = defaultProps;

export default ActionSheet;

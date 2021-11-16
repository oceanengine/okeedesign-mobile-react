import React, { useState } from 'react';
import { createNamespace } from '../../utils/create';

import { addClass } from '../../utils/create/createBEM';

import Icon from '../icon';
import type { IconName } from '../icon';
import { upperCamelize } from '../../utils/format/string';

const [bem] = createNamespace('notice-bar');

export type NoticeBarType = 'primary' | 'success' | 'warning' | 'danger';

export interface NoticeBarProps {
  type: NoticeBarType;
  text?: string;
  showClose?: boolean;
  isLink?: boolean;
  ellipsis?: number;
  children?: any;
  left?: any;
  right?: any;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClose?: React.MouseEventHandler<HTMLDivElement>;
}

const types = {
  warning: 'attention',
  primary: 'info',
  success: 'check-one',
  danger: 'close-one',
};

function NoticeBar(props: NoticeBarProps): JSX.Element {
  const { children, type, showClose, isLink, ellipsis, text, left, right, className, onClose } =
    props;
  const barStyle = {
    WebkitLineClamp: ellipsis,
  };
  const [showNoticeBar, setShowNoticeBar] = useState(true);

  const onCloseIconClick: React.MouseEventHandler<HTMLDivElement> = event => {
    // todo
    // event.stopPropagation()
    setShowNoticeBar(false);
    onClose?.(event);
  };

  // 左边插槽
  function LeftSlot(): any {
    return left || <Icon name={upperCamelize(types[type]) as IconName} className={bem('left')} />;
  }

  // 右边插槽
  function RightSlot(): any {
    if (right) return right;
    if (showClose)
      return (
        <Icon
          name="Close"
          className={bem('right')}
          onClick={onCloseIconClick}
          style={{ fill: '#333', width: '.8rem', height: '.8rem' }}
        />
      );
    if (isLink)
      return (
        <Icon
          name="ArrowRight"
          className={bem('right')}
          style={{ fill: '#333', width: '.8rem', height: '.8rem' }}
        />
      );
  }

  // 确定右边是否有值
  function hasRight(): boolean {
    return !!(showClose || isLink);
  }

  return (
    <div
      className={addClass(bem('', [type, { none: !showNoticeBar }]), className)}
      onClick={props.onClick}
    >
      {LeftSlot()}
      <div className={bem('content', [{ right: hasRight() }])} style={barStyle}>
        {children || text}
      </div>
      {RightSlot()}
    </div>
  );
}

const defaultProps: NoticeBarProps = {
  type: 'warning',
  showClose: false,
  isLink: false,
  ellipsis: 0,
};

NoticeBar.defaultProps = defaultProps;

export default NoticeBar;

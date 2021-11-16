import React from 'react';
import { createNamespace } from '../../utils/create';
import { value2DomUnit } from '../../utils/dom/unit';

import { addClass, prefix } from '../../utils/create/createBEM';

import Icon from '../icon';
import type { IconName } from '../icon';
import { upperCamelize } from '../../utils/format/string';

const [bem] = createNamespace('loading');

export type LoadingType = 'default' | 'circle';

export interface LoadingProps {
  type?: LoadingType;
  text?: string;
  size?: string | number;
  vertical?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: any;
  style?: React.CSSProperties;
}

function Loading(props: LoadingProps): JSX.Element {
  const { type, text, vertical, size, children, style, className } = props;

  const loadingStyle = style || {};

  if (size) {
    loadingStyle.width = value2DomUnit(size);
    loadingStyle.height = value2DomUnit(size);
  }

  const message = children ? children : text;

  return (
    <div className={addClass(bem([vertical]), className)} onClick={props.onClick}>
      <Icon
        name={upperCamelize(type!) as IconName}
        className={`${bem('icon')} ${prefix}loading-circle`}
        style={loadingStyle}
      />
      {message && <div className={bem('text')}>{message}</div>}
    </div>
  );
}

const defaultProps: LoadingProps = {
  type: 'default',
};

Loading.defaultProps = defaultProps;

export default Loading;

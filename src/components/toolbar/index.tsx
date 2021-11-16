import * as React from 'react';
import type { RenderContent, RenderFunction } from '../../utils/types';
import Button, { ButtonProps } from '../button';
import createBEM from '../../utils/create/createBEM';
import { createI18N } from '../../utils/create/i18n';

export type ToolbarProps = {
  showToolbar?: boolean;
  onConfirm?: ButtonProps['onClick'];
  onCancel?: ButtonProps['onClick'];
  title?: RenderContent<void>;
  confirmButtonText?: string;
  cancelButtonText?: string;

  showCancelButton?: boolean;
  showConfirmButton?: boolean;

  showBottomLine?: boolean;

  renderHead?(): JSX.Element | RenderFunction;
};

const bem = createBEM('toolbar');
const i18n = createI18N('toolbar');

const Toolbar = (props: ToolbarProps): JSX.Element => {
  const {
    showToolbar = true,
    title = i18n('title'),
    confirmButtonText = i18n('confirm'),
    cancelButtonText = i18n('cancel'),

    showCancelButton = true,
    showConfirmButton = true,

    showBottomLine = true,

    onCancel,
    onConfirm,
    renderHead,
  } = props;

  return (
    <div className={bem('header', [{ showBottomLine }])}>
      {showToolbar && (
        <div className={bem('toolbar')}>
          {showCancelButton && (
            <Button className={bem('button', 'cancel')} type="text" size="large" onClick={onCancel}>
              {cancelButtonText}
            </Button>
          )}
          {showConfirmButton && (
            <Button
              className={bem('button', 'confirm')}
              type="text"
              size="large"
              onClick={onConfirm}
            >
              {confirmButtonText}
            </Button>
          )}
          <div className={bem('title')}>{typeof title === 'function' ? title() : title}</div>
        </div>
      )}
      {renderHead && (typeof renderHead === 'function' ? renderHead() : renderHead)}
    </div>
  );
};

export default Toolbar;

import * as React from 'react';
import Diloag from '../dialog';

import { ModalProps } from './index';

export interface ModalDialogProps extends ModalProps {
  value: boolean;
  close: (...args: any[]) => void;
  afterClose?: () => void;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
}

function ModalDialog(props: ModalDialogProps): JSX.Element {
  const {
    value,
    title,
    message,
    showConfirmButton,
    showCancelButton,
    close,
    onConfirm,
    onCancel,
    afterClose,
    ...extra
  } = props;

  return (
    <Diloag
      value={value}
      title={title}
      message={message}
      showConfirmButton={showConfirmButton}
      showCancelButton={showCancelButton}
      onConfirm={(): void => {
        close();
        onConfirm && onConfirm();
      }}
      onCancel={(): void => {
        close();
        onCancel && onCancel();
      }}
      afterClose={afterClose}
      {...extra}
    />
  );
}

export default ModalDialog;

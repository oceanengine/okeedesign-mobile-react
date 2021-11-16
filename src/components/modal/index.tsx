import * as React from 'react';
import Diloag from '../dialog';
import type { DialogProps } from '../dialog';

import withConfirm from './confirm';

export type ModalProps = DialogProps;

function Modal(props: ModalProps): JSX.Element {
  return <Diloag {...props} />;
}

Modal.alert = withConfirm(false);
Modal.confirm = withConfirm(true);

export default Modal;

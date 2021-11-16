import CreateActionSheet from './createActionSheet';
import { ActionSheetItemType } from './action-sheet-item';

import ActionSheet from './action-sheet';
import ActionSheetItem from './action-sheet-item';

export type { ActionSheetProps } from './action-sheet';
export type { ActionSheetItemProps, ActionSheetItemType } from './action-sheet-item';

export interface ActionSheetOptions {
  title?: string;
  actions?: ActionSheetItemType[];
  duration?: number;
  cancelText?: string;
  showClose?: boolean;
  closeOnClickAction?: boolean;
  safeAreaInsetBottom?: boolean;
  className?: string;
  onCancel?: () => void;
  onClose?: () => void;
  onSelect?: (item: ActionSheetItemType, index?: number) => void;
}

export default {
  showActionSheet: CreateActionSheet,
  ActionSheet,
  ActionSheetItem,
};

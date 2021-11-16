import React from 'react';

export type PopupDrillDownState = {
  forward: () => void;
  back: () => void;
  closePopup: () => void;
};

export const PopupDrillDownContext = React.createContext<PopupDrillDownState>({
  forward() {},
  back() {},
  closePopup() {},
});

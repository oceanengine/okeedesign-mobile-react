export interface Anchor {
  id: string;
  label: string;
}
export interface NavsItem {
  label: string;
  path?: string;
  activeIcon?: string;
  defaultIcon?: string;
  anchors?: Anchor[];
  list?: NavsItem[];
}

export interface ByDocsConfig {
  logo?: string;
  navs?: NavsItem[];
  onLinkTo?: (item: NavsItem) => string | void;
  anchorPos?: 'left' | 'right';
}
export declare type Config = ByDocsConfig;
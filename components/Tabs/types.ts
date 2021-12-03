import { ReactNode } from 'react';

export interface TabItem<T = string> {
  id: number | string;
  label: T;
  content?: ReactNode;
  onClick?: (tab: TabItem) => void;
  className?: string;
  activeClassName?: string;
}

import React from 'react';

export interface TabItem<T = string> {
  id: number | string;
  label: T;
  content?: React.ReactNode;
  onClick?: (tab: TabItem) => void;
}

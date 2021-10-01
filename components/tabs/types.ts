import React from 'react';

export interface TabItem {
  id: number | string;
  label: string;
  content?: React.ReactNode;
  onClick?: (tab: TabItem) => void;
}

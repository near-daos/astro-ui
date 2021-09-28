import React from 'react';

export interface TabItem {
  id: number | string;
  label: React.ReactNode | string;
  content?: React.ReactNode;
  onClick?: (tab: TabItem) => void;
}

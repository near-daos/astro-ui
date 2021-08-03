import React from 'react';

export interface TabItem {
  id: number | string;
  label: React.ReactNode;
  content?: React.ReactNode;
  onClick?: (tab: TabItem) => void;
}

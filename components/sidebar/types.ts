import { ReactNode } from 'react';
import { IconName } from 'components/Icon';

interface ItemBase {
  id: string;
  label: string | ReactNode;
  href?: string;
  count?: number;
  subHrefs?: string[];
  disabled?: boolean;
  as?: string;
}

export interface MenuItem extends Omit<ItemBase, 'href' | 'subHrefs'> {
  subItems: ItemBase[];
  logo: IconName;
  href?: string;
  disabled?: boolean;
  as?: string;
}

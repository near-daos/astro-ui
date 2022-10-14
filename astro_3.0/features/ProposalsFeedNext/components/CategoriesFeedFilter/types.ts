import { IconName } from 'components/Icon';

export type ListItem = {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: IconName;
  queryName?: string;
  children?: ListItem[];
};

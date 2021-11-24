import { ReactElement } from 'react';

export interface BaseDropdownProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
  isOpen?: boolean;
  parent: ReactElement;
}

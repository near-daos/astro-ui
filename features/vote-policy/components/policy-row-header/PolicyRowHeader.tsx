import React, { ReactNode } from 'react';
import { IconButton } from 'components/button/IconButton';

import styles from './policy-row-header.module.scss';

interface RowItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface AccordeonRowProps {
  items: RowItem[];
}

export const Header: React.FC<{
  label: string;
  isOpen: boolean;
  toggle: () => void;
}> = ({ isOpen, label, toggle }) => {
  return (
    <section
      tabIndex={-1}
      role="button"
      onClick={() => toggle()}
      onKeyDown={e => e.key === 'Spacebar' && toggle()}
      className={styles.header}
    >
      <IconButton
        iconProps={{
          style: {
            transform: isOpen ? undefined : 'rotate(-90deg)',
            transition: 'all 100ms',
            marginBottom: '8px',
          },
        }}
        icon="buttonArrowDown"
        size="medium"
        type="button"
      />
      {label}
    </section>
  );
};

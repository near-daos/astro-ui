import React, { FC, ReactNode } from 'react';
import { IconButton } from 'components/button/IconButton';
import { Collapsable } from 'components/collapsable/Collapsable';
import { useAccordion } from 'hooks/useAccordion';

import styles from './accordeon-row.module.scss';

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
            marginBottom: '8px'
          }
        }}
        icon="buttonArrowDown"
        size="medium"
        type="button"
      />
      {label}
    </section>
  );
};

export const AccordeonRow: FC<AccordeonRowProps> = ({ items }) => {
  const { getItemProps } = useAccordion();

  return (
    <div className={styles.root}>
      {items.map(({ id, label, content }) => {
        return (
          <Collapsable
            key={id}
            {...getItemProps(id)}
            renderHeading={(toggle, isOpen) => (
              <Header label={label} isOpen={isOpen} toggle={toggle} />
            )}
          >
            {content}
          </Collapsable>
        );
      })}
    </div>
  );
};

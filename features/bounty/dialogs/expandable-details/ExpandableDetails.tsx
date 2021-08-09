import React, { FC, ReactNode } from 'react';
import { Collapsable } from 'components/collapsable/Collapsable';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './expandable-details.module.scss';

interface ExpandableDetailsProps {
  label: string;
  children: ReactNode;
}

export const ExpandableDetails: FC<ExpandableDetailsProps> = ({
  label,
  children
}) => {
  return (
    <Collapsable
      renderHeading={(toggle, isOpen) => (
        <Button
          size="small"
          variant="tertiary"
          className={styles.label}
          onClick={() => toggle(!isOpen)}
        >
          <Icon name="buttonArrowRight" className={styles.icon} />
          <span>{label}</span>
        </Button>
      )}
    >
      {children}
    </Collapsable>
  );
};

import cn from 'classnames';
import React, { FC, ReactNode, useState } from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './ExpandableDetails.module.scss';

interface ExpandableDetailsProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export const ExpandableDetails: FC<ExpandableDetailsProps> = ({
  label,
  children,
  className = '',
}) => {
  const initialState = label === 'Vote details';
  const [isOpen, toggle] = useState(initialState);

  return (
    <>
      <Button
        size="small"
        variant="tertiary"
        className={styles.label}
        onClick={() => toggle(!isOpen)}
      >
        <Icon
          name="buttonArrowRight"
          className={cn(styles.icon, { [styles.rotate]: isOpen })}
        />
        <span>{label}</span>
      </Button>
      <div
        className={cn(styles.content, className, {
          [styles.opened]: isOpen,
        })}
      >
        {children}
      </div>
    </>
  );
};

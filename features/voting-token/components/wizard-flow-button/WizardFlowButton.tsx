import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import { Button } from 'components/button/Button';

import styles from './wizard-flow-button.module.scss';

interface WizardFlowButtonProps {
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
  active: boolean;
}

export const WizardFlowButton: FC<WizardFlowButtonProps> = ({
  onClick,
  icon,
  title,
  description,
  active,
}) => {
  return (
    <Button
      variant="tertiary"
      onClick={onClick}
      className={cn(styles.root, {
        [styles.active]: active,
      })}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </Button>
  );
};

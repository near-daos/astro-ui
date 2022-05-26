import React from 'react';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from 'astro_2.0/features/DaoGovernance/components/DaoSetting/DaoSetting.module.scss';

interface DaoSettingProps {
  settingsName: string;
  className?: string;
  settingsChangeHandler?: () => void;
  disableNewProposal?: boolean;
}

export const DaoSetting: React.FC<DaoSettingProps> = ({
  settingsName,
  className,
  settingsChangeHandler,
  children,
  disableNewProposal,
}) => {
  return (
    <div className={className}>
      <div className={styles.root}>
        <div className={styles.label}>{settingsName}</div>
        {settingsChangeHandler && (
          <Button
            className={styles.actionButton}
            disabled={disableNewProposal}
            variant="black"
            onClick={() => settingsChangeHandler()}
          >
            Propose Changes
            <Icon name="buttonArrowRight" />
          </Button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

import { Button } from 'components/button/Button';
import React from 'react';
import styles from 'astro_2.0/features/DaoGovernance/components/DaoSetting/DaoSetting.module.scss';

interface DaoSettingProps {
  settingsName: string;
  className?: string;
  settingsChangeHandler: () => void;
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
        <Button
          disabled={disableNewProposal}
          variant="black"
          onClick={() => settingsChangeHandler()}
        >
          Propose Changes
        </Button>
      </div>
      <div>{children}</div>
    </div>
  );
};

import React, { FC, useEffect, useState } from 'react';
import { CopyButton } from 'features/copy-button';
import { ActionButton } from 'features/proposal/components/action-button';

import styles from './proposal-actions.module.scss';

interface ProposalActionsProps {
  onRemove: () => void;
  removeCount: number;
}

export const ProposalActions: FC<ProposalActionsProps> = ({
  onRemove,
  removeCount,
}) => {
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    setLocation(document.location.href);
  }, []);

  return (
    <div className={styles.root}>
      <ActionButton
        tooltip="Report"
        onClick={() => onRemove()}
        iconName="buttonReport"
        className={styles.icon}
        tooltipPlacement="right"
      >
        {removeCount}
      </ActionButton>
      <ActionButton
        tooltip="Tweet"
        iconName="socialTwitter"
        tooltipPlacement="right"
        className={styles.icon}
      />
      <CopyButton text={location} />
    </div>
  );
};

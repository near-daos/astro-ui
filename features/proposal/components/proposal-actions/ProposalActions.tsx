import React, { FC, useEffect, useState } from 'react';
import { CopyButton } from 'features/copy-button';
import { ActionButton } from 'features/proposal/components/action-button';

import styles from './proposal-actions.module.scss';

interface ProposalActionsProps {
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
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
        tooltip={`Remove: ${removeCount}`}
        onClick={onRemove}
        iconName="buttonDelete"
        size="small"
        className={styles.icon}
        tooltipPlacement="right"
      />

      <ActionButton
        tooltip="Tweet"
        iconName="socialTwitter"
        size="small"
        tooltipPlacement="right"
        className={styles.icon}
      />
      <CopyButton text={location} />
    </div>
  );
};

import React, { FC, useEffect, useState } from 'react';
import { CopyButton } from 'features/copy-button';
import { ActionButton } from 'features/proposal/components/action-button';
import { useMedia } from 'react-use';

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

  const isLargeDesktop = useMedia('(min-width: 1280px)');

  const tooltipPlacement = isLargeDesktop ? 'right' : 'left';

  return (
    <div className={styles.root}>
      <ActionButton
        tooltip={`Remove: ${removeCount}`}
        onClick={onRemove}
        iconName="buttonDelete"
        size="small"
        className={styles.icon}
        tooltipPlacement={tooltipPlacement}
      />

      <ActionButton
        tooltip="Tweet"
        iconName="socialTwitterAlt"
        size="small"
        className={styles.icon}
        tooltipPlacement={tooltipPlacement}
      />
      <CopyButton
        text={location}
        tooltipPlacement={tooltipPlacement}
        className={styles.copyBtn}
      />
    </div>
  );
};

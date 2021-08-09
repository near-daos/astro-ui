import React, { FC, useCallback } from 'react';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import { Bounty } from 'features/bounty/types';

import UnclaimBountyContent from 'features/bounty/dialogs/unclaim-bounty-dialog/components/UnclaimBountyContent';

export interface UnclaimBountyDialogProps {
  isOpen?: boolean;
  onClose: (...args: unknown[]) => void;
  data: Bounty;
}

export const UnclaimBountyDialog: FC<UnclaimBountyDialogProps> = ({
  // isOpen,
  onClose,
  data
}) => {
  const handleSubmit = useCallback(() => {
    // todo - handle unclaim bounty here
    onClose('submitted');
  }, [onClose]);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2>Unclaim bounty</h2>
      </header>
      <UnclaimBountyContent
        onClose={onClose}
        onSubmit={handleSubmit}
        data={data}
      />
    </div>
  );
};

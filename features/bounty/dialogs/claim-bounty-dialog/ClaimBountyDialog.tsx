import React, { FC, useCallback } from 'react';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';
import { Bounty } from 'components/cards/bounty-card/types';
import { Modal } from 'components/modal';
import ClaimBountyContent from './components/ClaimBountyContent';

export interface ClaimBountyDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  data: Bounty;
}

export const ClaimBountyDialog: FC<ClaimBountyDialogProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const handleSubmit = useCallback(() => {
    // todo - handle claim bounty here
    onClose('submitted');
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <h2>Claim bounty</h2>
      </header>
      <ClaimBountyContent
        onClose={onClose}
        onSubmit={handleSubmit}
        data={data}
      />
    </Modal>
  );
};

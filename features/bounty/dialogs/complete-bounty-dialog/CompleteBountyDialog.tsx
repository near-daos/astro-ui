import React, { FC, useCallback } from 'react';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import { Bounty } from 'features/bounty/types';

import { CompleteBountyForm } from 'features/bounty/dialogs/complete-bounty-dialog/complete-bounty-form/CompleteBountyForm';
import { BountyCard } from 'components/cards/bounty-card';
import { Modal } from 'components/modal';

export interface CompleteBountyDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  data: Bounty;
}

export const CompleteBountyDialog: FC<CompleteBountyDialogProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const handleSubmit = useCallback(() => {
    // todo - handle complete bounty here
    onClose('submitted');
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <h2>Complete bounty</h2>
      </header>
      <div className={styles.content}>
        <BountyCard variant="simple" data={data} />
        <CompleteBountyForm onCancel={onClose} onSubmit={handleSubmit} />
      </div>
    </Modal>
  );
};

import React, { FC, useCallback } from 'react';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';
import { Bounty } from 'components/cards/bounty-card/types';
import { Modal } from 'components/modal';
import { SputnikService } from 'services/SputnikService';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import { formatYoktoValue } from 'helpers/format';
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
  const selectedDao = useSelectedDAO();

  const handleSubmit = useCallback(() => {
    if (!selectedDao) {
      return;
    }

    SputnikService.claimBounty(selectedDao.id, {
      bountyId: Number(data.id),
      deadline: data.deadlineThreshold,
      bountyBond: formatYoktoValue(selectedDao.policy.bountyBond)
    });
    onClose('submitted');
  }, [data.deadlineThreshold, data.id, onClose, selectedDao]);

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

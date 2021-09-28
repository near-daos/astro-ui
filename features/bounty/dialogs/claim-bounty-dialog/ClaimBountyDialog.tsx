import { Bounty } from 'components/cards/bounty-card/types';
import { Modal } from 'components/modal';
import { useRouter } from 'next/router';
import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';
import React, { FC, useCallback } from 'react';
import { SputnikService } from 'services/SputnikService';
import ClaimBountyContent from './components/ClaimBountyContent';

export interface ClaimBountyDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  data: Bounty;
  bond: string;
}

export const ClaimBountyDialog: FC<ClaimBountyDialogProps> = ({
  isOpen,
  onClose,
  data,
  bond
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;

  const handleSubmit = useCallback(() => {
    if (!daoId) return;

    SputnikService.claimBounty(daoId, {
      bountyId: Number(data.id),
      deadline: data.deadlineThreshold,
      bountyBond: bond
    });
    onClose('submitted');
  }, [daoId, data.id, data.deadlineThreshold, bond, onClose]);

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

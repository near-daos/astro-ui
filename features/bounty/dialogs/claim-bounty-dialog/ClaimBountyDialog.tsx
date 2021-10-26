import { Bounty } from 'components/cards/bounty-card/types';
import { Modal } from 'components/modal';
import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';
import React, { FC, useCallback } from 'react';
import { SputnikNearService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import ClaimBountyContent from './components/ClaimBountyContent';

export interface ClaimBountyDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  data: Bounty;
  dao: DAO;
  token: Token;
}

export const ClaimBountyDialog: FC<ClaimBountyDialogProps> = ({
  isOpen,
  onClose,
  data,
  dao,
  token
}) => {
  const handleSubmit = useCallback(async () => {
    await SputnikNearService.claimBounty(dao.id, {
      bountyId: Number(data.id),
      deadline: data.deadlineThreshold,
      bountyBond: dao.policy.proposalBond
    });

    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds`,
      lifetime: 20000
    });

    onClose('submitted');
  }, [
    dao.id,
    data.id,
    data.deadlineThreshold,
    dao.policy.proposalBond,
    onClose
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <h2>Claim bounty</h2>
      </header>
      <ClaimBountyContent
        onClose={onClose}
        onSubmit={handleSubmit}
        data={data}
        token={token}
      />
    </Modal>
  );
};

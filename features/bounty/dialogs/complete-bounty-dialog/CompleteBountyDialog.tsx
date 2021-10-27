import React, { FC, useCallback } from 'react';

import { Bounty } from 'components/cards/bounty-card/types';
import { BountyInfoCard } from 'components/cards/bounty-info-card';
import { Modal } from 'components/modal';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import {
  CompleteBountyForm,
  CompleteBountyFormInput,
} from 'features/bounty/dialogs/complete-bounty-dialog/complete-bounty-form/CompleteBountyForm';
import { getCompleteBountyProposal } from 'features/bounty/dialogs/complete-bounty-dialog/helpers';
import { SputnikWalletError } from 'errors/SputnikWalletError';
import { SputnikNearService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DAO } from 'types/dao';
import { Token } from 'types/token';

export interface CompleteBountyDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  data: Bounty;
  dao: DAO;
  token: Token;
}

export const CompleteBountyDialog: FC<CompleteBountyDialogProps> = ({
  isOpen,
  onClose,
  data,
  dao,
  token,
}) => {
  const handleSubmit = useCallback(
    async (input: CompleteBountyFormInput) => {
      try {
        const proposal = getCompleteBountyProposal(
          dao.id,
          data.id,
          input,
          dao.policy.proposalBond
        );

        await SputnikNearService.createProposal(proposal);

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
          lifetime: 20000,
        });
        onClose('submitted');
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    [dao.id, data.id, dao.policy.proposalBond, onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <h2>Complete bounty</h2>
      </header>
      <div className={styles.content}>
        <BountyInfoCard data={data} token={token} />
        <CompleteBountyForm onCancel={onClose} onSubmit={handleSubmit} />
      </div>
    </Modal>
  );
};

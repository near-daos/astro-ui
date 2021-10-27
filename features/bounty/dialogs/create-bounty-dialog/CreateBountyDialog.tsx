import React, { FC, useCallback } from 'react';

import { Tokens } from 'context/CustomTokensContext';
import { DAO } from 'types/dao';
import { SputnikWalletError } from 'errors/SputnikWalletError';
import { SputnikNearService } from 'services/sputnik';
import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { VoteDetails } from 'components/vote-details';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import { CreateBountyForm } from './components/create-bounty-form/CreateBountyForm';
import { getAddBountyProposal } from './helpers';
import { CreateBountyInput } from './types';

export interface CreateBountyDialogProps {
  initialValues: CreateBountyInput;
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  dao: DAO;
  tokens: Tokens;
}

export const CreateBountyDialog: FC<CreateBountyDialogProps> = ({
  dao,
  tokens,
  initialValues,
  isOpen,
  onClose,
}) => {
  const handleSubmit = useCallback(
    async (data: CreateBountyInput) => {
      if (!dao) {
        console.error(
          'Bounty proposal can not be created. No dao id specified'
        );

        return;
      }

      const proposal = getAddBountyProposal(dao, data, tokens);

      try {
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
    [dao, onClose, tokens]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <Icon name="proposalBounty" width={24} />
        <h2>Propose new Bounty</h2>
      </header>
      <div className={styles.policyWrapper}>
        <VoteDetails scope="transfer" showBond={false} />
      </div>
      <CreateBountyForm
        onCancel={onClose}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        tokens={tokens}
        bond={dao?.policy.proposalBond}
      />
    </Modal>
  );
};

import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';

import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';

import { CreateBountyForm } from './components/create-bounty-form/CreateBountyForm';
import { getAddBountyProposal } from './helpers';

import { CreateBountyInput } from './types';

export interface CreateBountyDialogProps {
  initialValues: CreateBountyInput;
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  dao: DAO;
}

export const CreateBountyDialog: FC<CreateBountyDialogProps> = ({
  initialValues,
  isOpen,
  onClose,
  dao
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;

  const handleSubmit = useCallback(
    (data: CreateBountyInput) => {
      if (!daoId) {
        console.error(
          'Bounty proposal can not be created. No dao id specified'
        );
      } else {
        const proposal = getAddBountyProposal(daoId, data, dao);

        SputnikService.createProposal(proposal);
      }

      onClose('submitted');
    },
    [dao, daoId, onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <Icon name="proposalBounty" width={24} />
        <h2>Create new bounty</h2>
      </header>
      <CreateBountyForm
        initialValues={initialValues}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

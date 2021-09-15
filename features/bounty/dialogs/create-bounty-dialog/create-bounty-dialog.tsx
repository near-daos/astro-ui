import { useSelectedDAO } from 'hooks/useSelectedDao';
import React, { FC, useCallback } from 'react';

import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';

import { SputnikService } from 'services/SputnikService';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import { CreateBountyForm } from './components/create-bounty-form/CreateBountyForm';

import { CreateBountyInput } from './types';
import { getAddBountyProposal } from './helpers';

export interface CreateBountyDialogProps {
  initialValues: CreateBountyInput;
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const CreateBountyDialog: FC<CreateBountyDialogProps> = ({
  initialValues,
  isOpen,
  onClose
}) => {
  const selectedDao = useSelectedDAO();

  const handleSubmit = useCallback(
    (data: CreateBountyInput) => {
      if (!selectedDao) {
        console.error(
          'Bounty proposal can not be created. There is no selectedDao'
        );
      } else {
        const { id } = selectedDao;
        const proposal = getAddBountyProposal(id, data);

        SputnikService.createProposal(proposal);
      }

      onClose('submitted');
    },
    [selectedDao, onClose]
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

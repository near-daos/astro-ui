import React, { FC, useCallback } from 'react';

import { Modal } from 'components/modal';

import { CreatePollForm } from 'features/poll/dialogs/create-poll-dialog/components/CreatePollForm';
import styles from 'features/poll/dialogs/poll-dialogs.module.scss';
import { Icon } from 'components/Icon';
import { SputnikService } from 'services/SputnikService';
import { useSelectedDAO } from 'hooks/useSelectedDao';

export interface CreatePollDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const CreatePollDialog: FC<CreatePollDialogProps> = ({
  isOpen,
  onClose
}) => {
  const selectedDao = useSelectedDAO();

  const handleSubmit = useCallback(
    data => {
      if (selectedDao) {
        SputnikService.createProposal({
          daoId: selectedDao.id,
          description: data.question,
          kind: 'Vote',
          bond: selectedDao.policy.proposalBond
        }).then(() => {
          onClose();
        });
      }
    },
    [onClose, selectedDao]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <Icon name="proposalPoll" width={24} />
        <h2>Create a new poll</h2>
      </header>
      <div className={styles.content}>
        <CreatePollForm onCancel={onClose} onSubmit={handleSubmit} />
      </div>
    </Modal>
  );
};

import React, { FC, useCallback } from 'react';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import {
  CompleteBountyForm,
  CompleteBountyFormInput
} from 'features/bounty/dialogs/complete-bounty-dialog/complete-bounty-form/CompleteBountyForm';
import { BountyInfoCard } from 'components/cards/bounty-info-card';
import { Modal } from 'components/modal';
import { SputnikService } from 'services/SputnikService';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import { getCompleteBountyProposal } from 'features/bounty/dialogs/complete-bounty-dialog/helpers';
import { Bounty } from 'components/cards/bounty-card/types';

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
  const selectedDao = useSelectedDAO();

  const handleSubmit = useCallback(
    (input: CompleteBountyFormInput) => {
      if (!selectedDao) {
        return;
      }

      const { id: daoId } = selectedDao;

      const proposal = getCompleteBountyProposal(daoId, data.id, input);

      SputnikService.createProposal(proposal);

      onClose('submitted');
    },
    [data, onClose, selectedDao]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <h2>Complete bounty</h2>
      </header>
      <div className={styles.content}>
        <BountyInfoCard data={data} />
        <CompleteBountyForm onCancel={onClose} onSubmit={handleSubmit} />
      </div>
    </Modal>
  );
};

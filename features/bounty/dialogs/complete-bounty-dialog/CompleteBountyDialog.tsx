import { Bounty } from 'components/cards/bounty-card/types';
import { BountyInfoCard } from 'components/cards/bounty-info-card';
import { Modal } from 'components/modal';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import {
  CompleteBountyForm,
  CompleteBountyFormInput
} from 'features/bounty/dialogs/complete-bounty-dialog/complete-bounty-form/CompleteBountyForm';
import { getCompleteBountyProposal } from 'features/bounty/dialogs/complete-bounty-dialog/helpers';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';
import { SputnikService } from 'services/SputnikService';

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
  const router = useRouter();
  const daoId = router.query.dao as string;
  const currentDao = useDao(daoId);

  const handleSubmit = useCallback(
    (input: CompleteBountyFormInput) => {
      if (!currentDao) return;

      const proposal = getCompleteBountyProposal(currentDao.id, data.id, input);

      SputnikService.createProposal(proposal);

      onClose('submitted');
    },
    [data, onClose, currentDao]
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

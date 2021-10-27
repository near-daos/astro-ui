import { Icon } from 'components/Icon';

import { Modal } from 'components/modal';

import { CreatePollForm } from 'features/poll/dialogs/create-poll-dialog/components/CreatePollForm';
import styles from 'features/poll/dialogs/poll-dialogs.module.scss';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';
import { SputnikNearService } from 'services/sputnik';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

export interface CreatePollDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const CreatePollDialog: FC<CreatePollDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const currentDao = useDao(daoId);

  const handleSubmit = useCallback(
    async data => {
      if (!currentDao) return;

      await SputnikNearService.createProposal({
        daoId: currentDao.id,
        description: `${data.question}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
        kind: 'Vote',
        bond: currentDao.policy.proposalBond,
      });

      showNotification({
        type: NOTIFICATION_TYPES.INFO,
        description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
        lifetime: 20000,
      });

      onClose();
    },
    [onClose, currentDao]
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

import { Bounty } from 'components/cards/bounty-card/types';

import { Modal } from 'components/modal';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import UnclaimBountyContent from 'features/bounty/dialogs/unclaim-bounty-dialog/components/UnclaimBountyContent';

import React, { FC, useCallback } from 'react';
import { SputnikService } from 'services/SputnikService';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DAO } from 'types/dao';
import { Token } from 'types/token';

export interface UnclaimBountyDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  data: Bounty;
  dao: DAO;
  token: Token;
}

export const UnclaimBountyDialog: FC<UnclaimBountyDialogProps> = ({
  isOpen,
  onClose,
  data,
  dao,
  token
}) => {
  const handleSubmit = useCallback(async () => {
    await SputnikService.unclaimBounty(dao.id, data.id);

    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds`,
      lifetime: 20000
    });

    onClose('submitted');
  }, [data.id, onClose, dao]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <h2>Unclaim bounty</h2>
      </header>
      <UnclaimBountyContent
        onClose={onClose}
        onSubmit={handleSubmit}
        data={data}
        token={token}
      />
    </Modal>
  );
};

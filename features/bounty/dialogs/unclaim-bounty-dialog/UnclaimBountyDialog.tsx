import React, { FC, useCallback } from 'react';

import { SputnikWalletError } from 'errors/SputnikWalletError';
import { Modal } from 'components/modal';
import UnclaimBountyContent from 'features/bounty/dialogs/unclaim-bounty-dialog/components/UnclaimBountyContent';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { SputnikNearService } from 'services/sputnik';
import { DAO } from 'types/dao';
import { Token } from 'types/token';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';
import { Bounty } from 'types/bounties';

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
  token,
}) => {
  const handleSubmit = useCallback(async () => {
    try {
      await SputnikNearService.unclaimBounty(dao.id, data.id);

      showNotification({
        type: NOTIFICATION_TYPES.INFO,
        description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds`,
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

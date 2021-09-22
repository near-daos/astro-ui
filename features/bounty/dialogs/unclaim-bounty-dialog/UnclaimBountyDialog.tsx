import { Bounty } from 'components/cards/bounty-card/types';

import { Modal } from 'components/modal';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import UnclaimBountyContent from 'features/bounty/dialogs/unclaim-bounty-dialog/components/UnclaimBountyContent';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';
import { SputnikService } from 'services/SputnikService';

export interface UnclaimBountyDialogProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  data: Bounty;
}

export const UnclaimBountyDialog: FC<UnclaimBountyDialogProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const currentDao = useDao(daoId);

  const handleSubmit = useCallback(() => {
    if (!currentDao) {
      return;
    }

    SputnikService.unclaimBounty(currentDao.id, data.id);
    onClose('submitted');
  }, [data.id, onClose, currentDao]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <h2>Unclaim bounty</h2>
      </header>
      <UnclaimBountyContent
        onClose={onClose}
        onSubmit={handleSubmit}
        data={data}
      />
    </Modal>
  );
};

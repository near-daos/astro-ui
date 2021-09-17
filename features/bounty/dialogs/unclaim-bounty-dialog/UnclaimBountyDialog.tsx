import React, { FC, useCallback } from 'react';

import { Modal } from 'components/modal';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import { Bounty } from 'components/cards/bounty-card/types';

import UnclaimBountyContent from 'features/bounty/dialogs/unclaim-bounty-dialog/components/UnclaimBountyContent';
import { SputnikService } from 'services/SputnikService';
import { useSelectedDAO } from 'hooks/useSelectedDao';

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
  const selectedDao = useSelectedDAO();

  const handleSubmit = useCallback(() => {
    if (!selectedDao) {
      return;
    }

    SputnikService.unclaimBounty(selectedDao.id, data.id);
    onClose('submitted');
  }, [data.id, onClose, selectedDao]);

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

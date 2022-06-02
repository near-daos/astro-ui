import React, { FC, useCallback } from 'react';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';

import styles from './ConfirmDismissModal.module.scss';

export interface Props {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
}

export const ConfirmDismissModal: FC<Props> = ({ isOpen, onClose }) => {
  const handleSubmit = useCallback(() => {
    return onClose(true);
  }, [onClose]);

  const handleClose = useCallback(() => {
    return onClose(false);
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <div className={styles.title}>Dismiss migrate DAO wizard</div>
        <div className={styles.message}>
          Are you sure you want to dismiss migrate DAO wizard? Don&apos;t worry,
          you can always create new DAO and transfer funds manually.
        </div>
        <div className={styles.footer}>
          <Button
            capitalize
            variant="secondary"
            onClick={handleClose}
            data-testid="close-button"
            className={styles.confirmButton}
          >
            Cancel
          </Button>
          <Button
            capitalize
            onClick={handleSubmit}
            data-testid="close-button"
            className={styles.confirmButton}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </Modal>
  );
};

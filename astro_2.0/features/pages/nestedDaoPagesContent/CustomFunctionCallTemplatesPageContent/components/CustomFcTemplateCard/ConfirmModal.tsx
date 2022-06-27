import React, { FC } from 'react';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';

import styles from './ConfirmModal.module.scss';

export interface Props {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
  title?: string;
  message?: string;
}

export const ConfirmModal: FC<Props> = ({
  isOpen,
  onClose,
  message,
  title,
}) => {
  const handleSubmit = () => {
    return onClose(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <div className={styles.title}>{title ?? 'Delete template'}</div>
        <div className={styles.message}>
          {message ?? 'Are you sure you want to delete selected template?'}
        </div>
        <div className={styles.footer}>
          <Button
            capitalize
            variant="secondary"
            onClick={() => onClose()}
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
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

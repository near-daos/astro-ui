import React, { FC } from 'react';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';

import styles from './ConfirmModal.module.scss';

export interface Props {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
}

export const ConfirmModal: FC<Props> = ({ isOpen, onClose }) => {
  const handleSubmit = () => {
    return onClose(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <div className={styles.title}>Delete template</div>
        <div className={styles.message}>
          Are you sure you want to delete selected template?
        </div>
        <Button
          capitalize
          onClick={handleSubmit}
          data-testid="close-button"
          className={styles.confirmButton}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

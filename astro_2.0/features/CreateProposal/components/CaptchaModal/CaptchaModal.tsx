// TODO requires localisation

import React, { FC, useCallback } from 'react';

import { Modal } from 'components/modal';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { PuzzleCaptcha } from 'astro_2.0/components/PuzzleCaptcha';

import styles from './CaptchaModal.module.scss';

export interface CaptchaModalProps {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
}

export const CaptchaModal: FC<CaptchaModalProps> = ({ isOpen, onClose }) => {
  const submitHandler = useCallback(
    res => {
      if (!res) {
        return;
      }

      onClose(res);
    },
    [onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <DaoWarning
          className={styles.warning}
          content={
            <div>
              <div className={styles.title}>Attention!</div>
              <p className={styles.message}>
                You can not undo an action by Adopt Staking contract. Are you
                sure you agree to Adopt Staking contract?
              </p>
            </div>
          }
        />
        <PuzzleCaptcha onCaptchaDone={submitHandler} />
      </div>
    </Modal>
  );
};

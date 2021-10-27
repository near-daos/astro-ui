import React, { FC } from 'react';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';
import FollowIllustration from 'features/dao-home/components/follow-illustration/FollowIllustration';

import styles from './follow-popup.module.scss';

export interface FollowPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  target: string;
}

export const FollowPopup: FC<FollowPopupProps> = ({
  isOpen,
  onClose,
  target,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <FollowIllustration />
        <h2>
          You are now following <span className={styles.target}>{target}</span>!
        </h2>
        <p>You can see active proposals in your Home.</p>
        <Button onClick={onClose} className={styles.button}>
          Cool!
        </Button>
      </div>
    </Modal>
  );
};

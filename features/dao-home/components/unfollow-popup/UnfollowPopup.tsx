import React, { FC } from 'react';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';
import FollowIllustration from 'features/dao-home/components/follow-illustration/FollowIllustration';

import styles from './unfollow-popup.module.scss';

export interface UnfollowPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  target: string;
}

export const UnfollowPopup: FC<UnfollowPopupProps> = ({
  isOpen,
  onClose,
  target
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <FollowIllustration variant="unfollow" />
        <h2>
          You are unfollowed <span className={styles.target}>{target}</span>.
        </h2>
        <p>You will no longer see active proposals in your Home.</p>
        <Button onClick={onClose} className={styles.button}>
          Okay
        </Button>
      </div>
    </Modal>
  );
};

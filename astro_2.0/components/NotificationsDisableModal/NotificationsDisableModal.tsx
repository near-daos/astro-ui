import React from 'react';
import { Modal } from 'components/modal';
import styles from './NotificationsDisableModal.module.scss';

export interface NotificationsDisableModalProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  text: string;
}

export const NotificationsDisableModal: React.FC<NotificationsDisableModalProps> = ({
  isOpen,
  onClose,
  text,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className={styles.title}>Disable Notifications</div>
        <div className={styles.text}>{text}</div>
      </div>
    </Modal>
  );
};

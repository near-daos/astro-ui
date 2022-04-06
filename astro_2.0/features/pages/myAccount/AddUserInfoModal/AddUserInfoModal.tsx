import { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { Modal } from 'components/modal';

import styles from './AddUserInfoModal.module.scss';

interface AddUserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEmail?: boolean;
}

export const AddUserInfoModal: VFC<AddUserInfoModalProps> = props => {
  const { isOpen, onClose, isEmail } = props;

  const tBase = 'myAccountPage.popup';
  const { t } = useTranslation('common');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.header}>
        {t(`${tBase}.${isEmail ? 'email' : 'phone'}.title`)}
      </div>
      <div className={styles.message}>
        {t(`${tBase}.${isEmail ? 'email' : 'phone'}.message`)}
      </div>
    </Modal>
  );
};

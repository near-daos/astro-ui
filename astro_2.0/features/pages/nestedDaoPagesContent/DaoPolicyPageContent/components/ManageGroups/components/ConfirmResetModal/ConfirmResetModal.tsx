import React from 'react';
import { useTranslation } from 'next-i18next';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';

import styles from './ConfirmResetModal.module.scss';

type Props = {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  initialData: {
    callback: () => void;
  };
};

export const ConfirmResetModal: React.FC<Props> = ({
  initialData,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleSubmit = () => {
    initialData.callback();

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <h5 className={styles.title}>
          {t('createDAO.daoGroupsForm.resetModalTitle')}
        </h5>

        <p className={styles.subtitle}>
          {t('createDAO.daoGroupsForm.resetModalSubtitle')}
        </p>

        <div className={styles.row}>
          <Button
            variant="secondary"
            className={styles.actionBtn}
            onClick={handleSubmit}
          >
            {t('createDAO.daoGroupsForm.resetModalAction')}
          </Button>

          <Button
            variant="primary"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            {t('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

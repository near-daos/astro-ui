import React from 'react';
import { useTranslation } from 'next-i18next';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';

import styles from './ConfirmDeleteModal.module.scss';

type Props = {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  initialData: {
    groupName: string;
    callback: () => void;
  };
};

export const ConfirmDeleteModal: React.FC<Props> = ({
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
          {t('createDAO.daoGroupsForm.deleteModalTitle')} &quot;
          {initialData.groupName}&quot;?
        </h5>

        <p className={styles.subtitle}>
          {t('createDAO.daoGroupsForm.deleteModalSubtitle')}
        </p>

        <div className={styles.row}>
          <Button
            variant="secondary"
            className={styles.actionBtn}
            onClick={handleSubmit}
          >
            {t('createDAO.daoGroupsForm.deleteModalAction')}
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

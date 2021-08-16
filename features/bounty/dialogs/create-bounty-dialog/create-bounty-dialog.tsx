import React, { FC, useCallback } from 'react';

import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';

import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';

import { CreateBountyInput } from './types';

import { CreateBountyForm } from './components/create-bounty-form/CreateBountyForm';

export interface CreateBountyDialogProps {
  initialValues: CreateBountyInput;
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const CreateBountyDialog: FC<CreateBountyDialogProps> = ({
  initialValues,
  isOpen,
  onClose
}) => {
  const handleSubmit = useCallback(() => {
    // todo - handle create bounty here
    onClose('submitted');
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <Icon name="proposalBounty" width={24} />
        <h2>Create new bounty</h2>
      </header>
      <CreateBountyForm
        initialValues={initialValues}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

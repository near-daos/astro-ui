import React, { FC } from 'react';

import { Icon } from 'components/Icon';

import { CreateBountyForm } from './components/create-bounty-form/CreateBountyForm';

import { CreateBountyInput } from './types';

import styles from './create-bounty-dialog.module.scss';

export interface CreateBountyDialogProps {
  initialValues?: CreateBountyInput;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CreateBountyDialog: FC<CreateBountyDialogProps> = ({
  initialValues,
  onSubmit,
  onCancel
}) => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Icon name="proposalBounty" width={24} />
        <h2>Create new bounty</h2>
      </header>
      <CreateBountyForm
        initialValues={initialValues}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </div>
  );
};

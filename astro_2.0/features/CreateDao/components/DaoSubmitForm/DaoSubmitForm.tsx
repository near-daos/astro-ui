import React from 'react';
import { UnitSeparator } from 'astro_2.0/features/CreateDao/components/UnitSeparator/UnitSeparator';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget/TransactionDetailsWidget';
import styles from './DaoSubmitForm.module.scss';

export function DaoSubmitForm(): JSX.Element {
  return (
    <div className={styles.root}>
      <UnitSeparator />
      <div className={styles.content}>
        <TransactionDetailsWidget
          onCreate={() => 0}
          standAloneMode
          bond="5"
          gas="0.3"
          transaction="Create New DAO"
          buttonLabel="Create DAO"
        />
      </div>
    </div>
  );
}

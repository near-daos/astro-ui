import React from 'react';
import { UnitSeparator } from 'astro_2.0/features/CreateDao/components/UnitSeparator/UnitSeparator';
import { CreateProposalWidget } from 'astro_2.0/components/ProposalCardRenderer/components/CreateProposalWidget/CreateProposalWidget';
import styles from './DaoSubmitForm.module.scss';

export function DaoSubmitForm(): JSX.Element {
  return (
    <div className={styles.root}>
      <UnitSeparator />
      <div className={styles.content}>
        <CreateProposalWidget onCreate={() => 0} bond="5" gas="0.3" />
      </div>
    </div>
  );
}

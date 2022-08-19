import React, { FC } from 'react';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { useCreateProposalFromExternal } from 'astro_2.0/features/CreateExternalProposal/hooks';
import { ProposalVariant } from 'types/proposal';
import { Button } from 'components/button/Button';

import styles from './CreateExternalProposal.module.scss';

interface Props {
  onCreateProposal: (
    initialProposalVariant?: ProposalVariant,
    initialValues?: Record<string, unknown>
  ) => void;
}

export const CreateExternalProposal: FC<Props> = ({ onCreateProposal }) => {
  const { error, handleDismiss } =
    useCreateProposalFromExternal(onCreateProposal);

  if (error) {
    return (
      <DaoWarning
        content={
          <>
            <div className={styles.title}>Failed to create proposal</div>
            <div className={styles.text}>{error}</div>
          </>
        }
        className={styles.warningWrapper}
        control={
          <div className={styles.control}>
            <Button
              variant="secondary"
              size="small"
              onClick={handleDismiss}
              capitalize
            >
              Dismiss
            </Button>
          </div>
        }
      />
    );
  }

  return null;
};

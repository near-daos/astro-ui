import React, { FC } from 'react';

import { Button } from 'components/button/Button';
import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';
import { DAO } from 'types/dao';

import styles from './DraftManagement.module.scss';

interface DraftManagementProps {
  onEditDraft: () => void;
  convertTOProposal?: () => void;
  proposer: string;
  accountId: string;
  dao?: DAO;
}

export const DraftManagement: FC<DraftManagementProps> = ({
  onEditDraft,
  convertTOProposal,
  accountId,
  proposer,
  dao,
}) => {
  let isCouncil = false;

  if (dao) {
    isCouncil = isCouncilUser(dao, accountId);
  }

  const disabled = !(isCouncil || proposer === accountId);

  return (
    <div className={styles.draftManagement}>
      <Button
        disabled={disabled}
        capitalize
        variant="secondary"
        className={styles.button}
        onClick={onEditDraft}
      >
        Edit
      </Button>
      <Button
        disabled={disabled}
        capitalize
        className={styles.button}
        onClick={() => {
          if (convertTOProposal) {
            convertTOProposal();
          }
        }}
      >
        Convert to proposal
      </Button>
    </div>
  );
};

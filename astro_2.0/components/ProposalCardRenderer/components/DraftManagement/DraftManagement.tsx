import React, { FC } from 'react';

import { Button } from 'components/button/Button';
import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';
import { DAO } from 'types/dao';

import styles from './DraftManagement.module.scss';

interface DraftManagementProps {
  onEditDraft: () => void;
  convertToProposal?: () => void;
  proposer: string;
  accountId: string;
  dao?: DAO;
  state?: string;
}

export const DraftManagement: FC<DraftManagementProps> = ({
  onEditDraft,
  convertToProposal,
  accountId,
  proposer,
  dao,
  state,
}) => {
  let isCouncil = false;

  if (dao) {
    isCouncil = isCouncilUser(dao, accountId);
  }

  const disabled = !(isCouncil || proposer === accountId);

  return (
    <div className={styles.draftManagement}>
      {state !== 'closed' ? (
        <>
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
              if (convertToProposal) {
                convertToProposal();
              }
            }}
          >
            Convert to proposal
          </Button>
        </>
      ) : null}
    </div>
  );
};

import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';
import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';
import { DAO } from 'types/dao';
import { ProposalType } from 'types/proposal';
import { UserPermissions } from 'types/context';

import styles from './DraftManagement.module.scss';

interface DraftManagementProps {
  onEditDraft: () => void;
  convertToProposal?: () => void;
  proposer: string;
  accountId: string;
  dao?: DAO;
  state?: string;
  userPermissions?: UserPermissions;
  proposalType: ProposalType;
}

export const DraftManagement: FC<DraftManagementProps> = ({
  onEditDraft,
  convertToProposal,
  accountId,
  proposer,
  dao,
  state,
  userPermissions,
  proposalType,
}) => {
  const { t } = useTranslation();
  let isCouncil = false;

  if (dao) {
    isCouncil = isCouncilUser(dao, accountId);
  }

  const disabled = !isCouncil && proposer !== accountId;

  const renderConvertToProposalButton = () => {
    if (!userPermissions?.allowedProposalsToVote[proposalType]) {
      return null;
    }

    return (
      <Button
        disabled={!isCouncil}
        capitalize
        className={styles.button}
        onClick={() => {
          if (convertToProposal) {
            convertToProposal();
          }
        }}
      >
        {t('drafts.editDraftPage.convertToProposalButton')}
      </Button>
    );
  };

  return (
    <div className={styles.draftManagement}>
      {state !== 'closed' && !disabled ? (
        <>
          <Button
            disabled={disabled}
            capitalize
            variant="secondary"
            className={styles.button}
            onClick={onEditDraft}
          >
            {t('drafts.editDraftPage.editButton')}
          </Button>
          {renderConvertToProposalButton()}
        </>
      ) : null}
    </div>
  );
};

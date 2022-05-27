import { useMount } from 'react-use';
import { useTranslation } from 'next-i18next';
import React, { VFC, useMemo, useState } from 'react';

import { Proposal } from 'types/proposal';

import { SputnikHttpService } from 'services/sputnik';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import styles from './ViewVoteInOtherDao.module.scss';

interface ViewVoteInOtherDaoProps {
  daoId: string;
  action: string;
  proposalId: number;
}

export const ViewVoteInOtherDao: VFC<ViewVoteInOtherDaoProps> = ({
  daoId,
  action,
  proposalId,
}) => {
  const { t } = useTranslation();

  const [proposal, setProposal] = useState<Proposal | null>();

  useMount(async () => {
    const res = await SputnikHttpService.getProposal(daoId, proposalId);

    setProposal(res);
  });

  const getLabel = (field: string) =>
    t(`proposalCard.voteInDao.${field}.label`);

  const proposalDescription = useMemo(() => {
    return proposal ? (
      `ID: ${proposal?.proposalId || ''}. ${proposal?.description || ''}`
    ) : (
      <LoadingIndicator />
    );
  }, [proposal]);

  return (
    <div className={styles.root}>
      <FieldWrapper label={getLabel('targetDao')}>
        <FieldValue value={daoId} />
      </FieldWrapper>

      <FieldWrapper label={getLabel('proposal')}>
        <FieldValue value={proposalDescription} />
      </FieldWrapper>

      <FieldWrapper label={getLabel('vote')}>
        <FieldValue value={action} />
      </FieldWrapper>
    </div>
  );
};

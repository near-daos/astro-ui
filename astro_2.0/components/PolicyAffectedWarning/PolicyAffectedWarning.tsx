import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useTranslation, Trans } from 'next-i18next';
import React, { FC, useCallback, useMemo } from 'react';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { Proposal, ProposalType } from 'types/proposal';

import { Button } from 'components/button/Button';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';

import { useWalletContext } from 'context/WalletContext';

import styles from './PolicyAffectedWarning.module.scss';

export interface PolicyAffectedWarningProps {
  data: Pick<Proposal, 'daoId' | 'id' | 'kind'>[];
  className?: string;
}

export const PolicyAffectedWarning: FC<PolicyAffectedWarningProps> = ({
  data,
  className,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { accountId } = useWalletContext();

  const { id, daoId, kind } = useMemo(
    () => (first(data) || {}) as Proposal,
    [data]
  );

  const goToProposalPage = useCallback(() => {
    router.push({
      pathname: SINGLE_PROPOSAL_PAGE_URL,
      query: {
        dao: daoId,
        proposal: id,
      },
    });
  }, [id, daoId, router]);

  if (isEmpty(data)) {
    return null;
  }

  let title = t('daoConfig');

  if (kind?.type === ProposalType.ChangePolicy) {
    title = t('votingPolicy');
  }

  if (!accountId) {
    return null;
  }

  return (
    <DaoWarning
      content={
        <>
          <div className={styles.title}>
            <Trans i18nKey="policyAffectedProposalsTitle" values={{ title }} />
          </div>
          <div className={styles.text}>
            <Trans i18nKey="policyAffectedProposalsText" values={{ title }} />
          </div>
        </>
      }
      control={
        data.length !== 0 ? (
          <Button variant="primary" onClick={goToProposalPage} capitalize>
            {t('viewProposal')}
          </Button>
        ) : null
      }
      className={className}
    />
  );
};

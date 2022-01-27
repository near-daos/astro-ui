import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';
import { useTranslation, Trans } from 'next-i18next';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { Proposal, ProposalType } from 'types/proposal';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './PolicyAffectedWarning.module.scss';

export interface PolicyAffectedWarningProps {
  data: Pick<Proposal, 'daoId' | 'id' | 'kind'>[];
  className: string;
}

export const PolicyAffectedWarning: FC<PolicyAffectedWarningProps> = ({
  data,
  className = '',
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const goToProposalPage = useCallback(() => {
    router.push({
      pathname: SINGLE_PROPOSAL_PAGE_URL,
      query: {
        dao: data[0].daoId,
        proposal: data[0].id,
      },
    });
  }, [data, router]);

  if (isEmpty(data)) {
    return null;
  }

  let title = t('daoConfig');

  if (data[0].kind.type === ProposalType.ChangePolicy) {
    title = t('votingPolicy');
  }

  return (
    <div className={className}>
      <div className={styles.root}>
        <div className={styles.status}>
          <Icon name="info" className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <Trans i18nKey="policyAffectedProposalsTitle" values={{ title }} />
          </div>
          <div className={styles.text}>
            <Trans i18nKey="policyAffectedProposalsText" values={{ title }} />
          </div>
        </div>
        <div className={styles.control}>
          {data.length === 1 && (
            <Button variant="primary" onClick={goToProposalPage}>
              {t('viewProposal')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

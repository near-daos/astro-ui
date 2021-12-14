import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { Proposal, ProposalType } from 'types/proposal';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './PolicyAffectedWarning.module.scss';

export interface PolicyAffectedWarningProps {
  data: Proposal[];
  className: string;
}

export const PolicyAffectedWarning: FC<PolicyAffectedWarningProps> = ({
  data,
  className = '',
}) => {
  const router = useRouter();

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

  let title = 'DAO Config';

  if (data[0].kind.type === ProposalType.ChangePolicy) {
    title = 'Voting Policy';
  }

  return (
    <div className={className}>
      <div className={styles.root}>
        <div className={styles.status}>
          <Icon name="info" className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>Change {title} Snapshot</div>
          <div className={styles.text}>
            The proposed changes in {title} will affect the other proposals.
            Further updates might get rewritten if the current proposal
            won&apos;t get resolved before.
          </div>
        </div>
        <div className={styles.control}>
          {data.length === 1 && (
            <Button variant="primary" onClick={goToProposalPage}>
              View Proposal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

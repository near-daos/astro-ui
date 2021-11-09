import React, { FC } from 'react';

import { Proposal, ProposalType } from 'types/proposal';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { useRouter } from 'next/router';

import styles from './PolicyAffectedWarning.module.scss';

interface PolicyAffectedWarningProps {
  data: Proposal[];
}

export const PolicyAffectedWarning: FC<PolicyAffectedWarningProps> = ({
  data,
}) => {
  const router = useRouter();

  let title = 'DAO Config';

  if (data[0].kind.type === ProposalType.ChangePolicy) {
    title = 'Voting Policy';
  }

  return (
    <div className={styles.root}>
      <div className={styles.status}>
        <Icon name="info" className={styles.icon} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>Change {title} Snapshot</div>
        <div className={styles.text}>
          The proposed changes in {title} will affect the other proposals.
          Further updates might get rewritten if the current proposal won&apos;t
          get resolved before.
        </div>
      </div>
      <div className={styles.control}>
        {data.length === 1 && (
          <Button
            variant="primary"
            onClick={() =>
              router.push(`/dao/${data[0].daoId}/proposals/${data[0].id}`)
            }
          >
            View Proposal
          </Button>
        )}
      </div>
    </div>
  );
};

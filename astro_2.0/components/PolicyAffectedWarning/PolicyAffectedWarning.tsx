import React, { FC } from 'react';

import { Proposal } from 'types/proposal';
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

  return (
    <div className={styles.root}>
      <div className={styles.status}>
        <Icon name="info" className={styles.icon} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>Change Voting Policy Snapshot</div>
        <div className={styles.text}>
          The proposed changes in Voting Policy will affect the other proposals.
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

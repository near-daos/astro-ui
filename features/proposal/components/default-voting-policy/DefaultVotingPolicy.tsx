import React, { FC } from 'react';
import { DaoVotePolicy } from 'types/dao';

import styles from './default-voting-policy.module.scss';

interface DefaultVotingPolicyProps {
  policy: DaoVotePolicy;
}

export const DefaultVotingPolicy: FC<DefaultVotingPolicyProps> = ({
  policy
}) => {
  const voteBy = policy.weightKind === 'RoleWeight' ? 'Person' : 'Token';
  const amount =
    policy?.ratio && Array.isArray(policy?.ratio)
      ? (policy.ratio[0] / policy.ratio[1]) * 100
      : '';
  const threshold = '% of group';

  return (
    <div className={styles.policyWrapper}>
      <div className={styles.policyLabel}>Policy</div>
      <div className={styles.policy}>
        <div>{voteBy}</div>
        <div className={styles.bold}>{amount}</div>
        <div>{threshold}</div>
        <div>to pass</div>
      </div>
    </div>
  );
};

import React, { FC } from 'react';
import { DaoVotePolicy, TGroup } from 'types/dao';

import { Badge } from 'components/badge/Badge';
import styles from './DefaultVotingPolicy.module.scss';

interface DefaultVotingPolicyProps {
  policy: DaoVotePolicy;
  groups: TGroup[];
}

export const DefaultVotingPolicy: FC<DefaultVotingPolicyProps> = ({
  policy,
  groups,
}) => {
  // const voteBy = policy.weightKind === 'RoleWeight' ? 'Person' : 'Token';
  const amount =
    policy?.ratio && Array.isArray(policy?.ratio)
      ? (policy.ratio[0] / policy.ratio[1]) * 100
      : '';
  const threshold = '% of group';

  return (
    <div className={styles.policyWrapper}>
      <div className={styles.policyLabel}>Voting policy</div>
      <div className={styles.policy}>
        {/* <div>{voteBy}</div> */}
        <div className={styles.bold}>{amount}</div>
        <div>{threshold}</div>
        <div>to pass of</div>
        <Badge size="small" variant="primary">
          ALL GROUPS ({groups.length})
        </Badge>
      </div>
    </div>
  );
};

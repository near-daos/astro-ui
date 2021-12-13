import React, { FC } from 'react';
import { DaoVotePolicy, TGroup } from 'types/dao';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation();
  // const voteBy = policy.weightKind === 'RoleWeight' ? 'Person' : 'Token';
  const amount =
    policy?.ratio && Array.isArray(policy?.ratio)
      ? (policy.ratio[0] / policy.ratio[1]) * 100
      : '';
  const threshold = 'of group';

  return (
    <div className={styles.policyWrapper}>
      <div className={styles.policyLabel}>{t('votingPolicy')}</div>
      <div className={styles.policy}>
        {/* <div>{voteBy}</div> */}
        <div className={styles.bold}>{amount}%</div>
        <div>{threshold} to pass of</div>
        <Badge size="small" variant="primary">
          ALL GROUPS ({groups.length})
        </Badge>
      </div>
    </div>
  );
};

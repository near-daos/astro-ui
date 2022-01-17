import React, { FC } from 'react';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation();

  const { ratio } = policy;

  const amount =
    isArray(ratio) && !isEmpty(ratio) ? (ratio[0] / ratio[1]) * 100 : '';
  const threshold = 'of group';

  return (
    <div className={styles.policyWrapper}>
      <div className={styles.policyLabel}>{t('votingPolicy')}</div>
      <div className={styles.policy}>
        <div className={styles.bold}>{amount}%</div>
        <div>{threshold} to pass of</div>
        <Badge size="small" variant="primary">
          ALL GROUPS ({groups.length})
        </Badge>
      </div>
    </div>
  );
};

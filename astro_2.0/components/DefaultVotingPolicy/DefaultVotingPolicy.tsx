import React, { FC } from 'react';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';

import { Badge } from 'components/Badge';

import styles from './DefaultVotingPolicy.module.scss';

interface DefaultVotingPolicyProps {
  numberOfGroups: number;
  ratio: number[];
}

export const DefaultVotingPolicy: FC<DefaultVotingPolicyProps> = ({
  ratio,
  numberOfGroups,
}) => {
  const { t } = useTranslation();

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
          ALL GROUPS ({numberOfGroups})
        </Badge>
      </div>
    </div>
  );
};

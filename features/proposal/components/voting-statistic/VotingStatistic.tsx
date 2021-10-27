import React, { FC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';
import { VoteValue } from 'features/types';

import styles from './voting-statistic.module.scss';

interface VotingStatisticProps {
  data?: VoteValue[];
}

export const VotingStatistic: FC<VotingStatisticProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className={styles.root}>
      {data?.map(item => {
        let icon;

        switch (item.vote) {
          case 'Yes': {
            icon = 'votingYes';
            break;
          }
          case 'No': {
            icon = 'votingNo';
            break;
          }
          default: {
            icon = 'votingDismiss';
          }
        }

        return (
          <div className={styles.row} key={item.vote}>
            <span>{item.percent.toFixed(0)}%</span>
            <span
              className={cn(styles.bar, {
                [styles.yes]: item.vote === 'Yes',
                [styles.no]: item.vote === 'No'
              })}
              style={{ width: `${item.percent}%` }}
            />
            <span>
              <Icon name={icon as IconName} width={32} />
            </span>
          </div>
        );
      })}
    </div>
  );
};

import React, { FC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';
import { VoteStat } from 'features/types';

import styles from './voting-statistic.module.scss';

interface VotingStatisticProps {
  data?: VoteStat[];
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
            icon = 'buttonMore';
          }
        }

        return (
          <div className={styles.row} key={item.vote}>
            <span>{item.value}</span>
            <span
              className={cn(styles.bar, {
                [styles.yes]: item.vote === 'Yes',
                [styles.no]: item.vote === 'No',
              })}
              style={{ width: `${item.percent}%` }}
            />
            <span>
              <Icon
                name={icon as IconName}
                width={32}
                className={cn({
                  [styles.rotate]: item.vote === null,
                })}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
};

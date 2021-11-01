import React, { CSSProperties, FC } from 'react';
import cn from 'classnames';
import { Vote, VoteDetail, VoteValue } from 'features/types';
import orderBy from 'lodash/orderBy';
import styles from './progress-bar.module.scss';

interface ProgressBarProps {
  detail: VoteDetail;
}

export const ProgressBar: FC<ProgressBarProps> = ({ detail }) => {
  const { limit, data } = detail;
  const sortedData = orderBy(data, 'vote', 'asc');
  const realLimit = limit.includes('%')
    ? parseInt(limit.slice(0, -1), 10)
    : limit;

  const voteClassName = (vote: Vote | null) => {
    return cn({
      [styles.positive]: vote === 'Yes',
      [styles.negative]: vote === 'No',
      [styles.trash]: vote === 'Dismiss' || vote === null,
    });
  };

  const renderVoteBar = ({ vote, percent }: VoteValue) => (
    <span
      className={cn(styles.vote, voteClassName(vote))}
      key={vote}
      style={{ '--voteWeight': `${percent}%` } as CSSProperties}
    />
  );

  return (
    <>
      {realLimit > 0 && sortedData.length > 0 && (
        <div className={styles.root}>
          <div
            className={styles.limit}
            style={
              { '--voteLimit': `calc(${realLimit}% - 1px)` } as CSSProperties
            }
          />
          <div className={styles.bar}>
            {sortedData.map(voteInfo => renderVoteBar(voteInfo))}
          </div>
        </div>
      )}
    </>
  );
};

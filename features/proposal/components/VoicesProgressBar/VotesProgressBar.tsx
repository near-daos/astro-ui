import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import groupBy from 'lodash/groupBy';

import { VoterDetail } from 'features/types';
import { ONE_HUNDRED } from 'constants/common';

import styles from './VotesProgressBar.module.scss';

interface VotesProgressBarProps {
  votes: VoterDetail[];
  className?: string;
}

const calculateWidth = (allVoices: number, countVoices: number) => {
  if (!countVoices) {
    return 0;
  }

  return (countVoices / allVoices) * ONE_HUNDRED;
};

export const VotesProgressBar: FC<VotesProgressBarProps> = ({
  className,
  votes,
}) => {
  const groupedVotes = useMemo(() => groupBy(votes, 'vote'), [votes]);

  const yesWidth = useMemo(
    () => calculateWidth(votes.length, groupedVotes?.Yes?.length),
    [groupedVotes?.Yes?.length, votes.length]
  );
  const noWidth = useMemo(
    () => calculateWidth(votes.length, groupedVotes?.No?.length),
    [groupedVotes?.No?.length, votes.length]
  );

  return (
    <div className={cn(styles.votesProgressBar, className)}>
      <div
        className={cn(styles.no, { [styles.withoutBorder]: yesWidth > 0 })}
        style={{ width: `${noWidth}%` }}
      />
      <div className={styles.yes} style={{ width: `${yesWidth}%` }} />
    </div>
  );
};

import React, { FC, useState } from 'react';
import cn from 'classnames';
import { Vote, VoterDetail } from 'features/types';
import styles from './voters-list.module.scss';

interface VotersListProps {
  votersList: VoterDetail[];
}

export const VotersList: FC<VotersListProps> = ({ votersList }) => {
  const [fullListViewed, viewFullList] = useState(false);

  const shortVotersList =
    votersList.length > 8 ? votersList.slice(0, 8) : votersList;

  const currentVotersList = fullListViewed ? votersList : shortVotersList;

  const voteClassName = (vote: Vote | null) => {
    return cn({
      [styles.positive]: vote === 'Yes',
      [styles.negative]: vote === 'No',
      [styles.trash]: vote === 'Dismiss',
    });
  };

  const renderVoter = ({ name, vote }: VoterDetail) => (
    <div className={cn(styles.name, voteClassName(vote))} key={name}>
      {name}
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.subtitle}>Votes</div>
      <div className={cn(styles.list, { [styles.full]: fullListViewed })}>
        {currentVotersList.map(voter => renderVoter(voter))}
      </div>
      {votersList.length > 8 && (
        <div
          role="button"
          tabIndex={0}
          className={cn(styles.seemore, { [styles.hide]: fullListViewed })}
          onKeyPress={() => viewFullList(true)}
          onClick={() => viewFullList(true)}
        >
          See more
        </div>
      )}
    </div>
  );
};

import React, { FC } from 'react';
import { VoterDetail } from 'features/types';
import { VoterDetailsCard } from 'features/proposal/components/VoterDetailsCard';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import styles from './VotersList.module.scss';

interface VotersListProps {
  data: VoterDetail[];
  showTokensInfo?: boolean;
  lastVoteId?: string;
}

export const VotersList: FC<VotersListProps> = ({
  data,
  showTokensInfo,
  lastVoteId,
}) => {
  if (!data?.length) {
    return <NoResultsView title="No votes here" />;
  }

  return (
    <ul className={styles.votersList}>
      {data
        .sort((a, b) => {
          if (!a.timestamp || !b.timestamp) {
            return 0;
          }

          if (a.timestamp > b.timestamp) {
            return -1;
          }

          if (a.timestamp < b.timestamp) {
            return 1;
          }

          return 0;
        })
        .map(item => (
          <li key={item.name} className={styles.voteListItem}>
            <VoterDetailsCard
              timestamp={item.timestamp}
              transactionHash={item.transactionHash}
              vote={item.vote}
              name={item.name}
              groups={item.groups}
              tokensDetails={showTokensInfo ? item.tokens : null}
              isLastVote={lastVoteId ? lastVoteId === item.id : false}
            />
          </li>
        ))}
    </ul>
  );
};

import React, { FC } from 'react';
import { VoterDetail } from 'features/types';
import { VoterDetailsCard } from 'features/proposal/components/voter-details-card';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import styles from './voters-list.module.scss';

interface VotersListProps {
  data: VoterDetail[];
}

export const VotersList: FC<VotersListProps> = ({ data }) => {
  if (!data?.length) {
    return <NoResultsView title="No votes here" />;
  }

  return (
    <ul className={styles.root}>
      {data.map(item => (
        <li key={item.name}>
          <VoterDetailsCard
            timestamp={item.timestamp}
            transactionHash={item.transactionHash}
            vote={item.vote}
            name={item.name}
            groups={item.groups}
          />
        </li>
      ))}
    </ul>
  );
};

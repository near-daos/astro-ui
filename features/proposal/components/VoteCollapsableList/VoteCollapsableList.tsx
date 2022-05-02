import React, { FC, useMemo } from 'react';
import { VoterDetail } from 'features/types';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Collapsable } from 'components/collapsable/Collapsable';
import { VoteCollapsableHeader } from 'features/proposal/components/VoteCollapsableHeader';
import { VotersList } from 'features/proposal/components/VotersList';

import styles from './VoteCollapsableList.module.scss';

interface VoteCollapsableListProps {
  data: VoterDetail[];
}

export const VoteCollapsableList: FC<VoteCollapsableListProps> = ({ data }) => {
  const votesGroups: { [key: string]: VoterDetail[] } = useMemo(
    () => groupBy(data, 'groups'),
    [data]
  );

  if (isEmpty(data)) {
    return <NoResultsView title="No votes here" />;
  }

  return (
    <ul className={styles.voteCollapsableList}>
      {Object.keys(votesGroups).map(votesGroupsKey => (
        <li key={votesGroupsKey} className={styles.voteCollapsableItem}>
          <Collapsable
            renderHeading={(setToggle, state) => (
              <VoteCollapsableHeader
                setToggle={setToggle}
                state={state}
                votes={votesGroups[votesGroupsKey]}
                groupName={votesGroupsKey}
              />
            )}
          >
            <VotersList data={votesGroups[votesGroupsKey]} />
          </Collapsable>
        </li>
      ))}
    </ul>
  );
};

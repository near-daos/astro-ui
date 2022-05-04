import React, { FC, useMemo } from 'react';
import { VoterDetail } from 'features/types';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Collapsable } from 'components/collapsable/Collapsable';
import { VoteCollapsableHeader } from 'features/proposal/components/VoteCollapsableHeader';
import { VotersList } from 'features/proposal/components/VotersList';

import styles from './VoteCollapsableList.module.scss';

interface VoteCollapsableListProps {
  data: VoterDetail[];
}

interface VoteGroups {
  [key: string]: VoterDetail[];
}

export const VoteCollapsableList: FC<VoteCollapsableListProps> = ({ data }) => {
  const { t } = useTranslation();
  const noGroupTranslate = t('proposalVotes.noGroup');
  const votesGroups: VoteGroups = useMemo(() => {
    const vGroups: VoteGroups = {};
    const uniqueGroups = Array.from(
      new Set(
        data.flatMap(item =>
          item?.groups?.length ? item.groups : [noGroupTranslate]
        )
      )
    );

    uniqueGroups.forEach(uniqueGroup => {
      if (uniqueGroup === noGroupTranslate) {
        vGroups[noGroupTranslate] = data.filter(
          item => item.groups?.length === 0
        );

        return;
      }

      if (uniqueGroup) {
        vGroups[uniqueGroup] = data.filter(item =>
          item.groups?.includes(uniqueGroup)
        );
      }
    });

    return vGroups;
  }, [data, noGroupTranslate]);

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

import React, { FC, useMemo } from 'react';
import { GroupPolicyDetails, VoterDetail } from 'features/types';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Collapsable } from 'components/collapsable/Collapsable';
import { VoteCollapsableHeader } from 'features/proposal/components/VoteCollapsableHeader';
import { VotersList } from 'features/proposal/components/VotersList';

import styles from './VoteCollapsableList.module.scss';

interface VoteCollapsableListProps {
  data: VoterDetail[];
  votingPolicyByGroup: Record<string, GroupPolicyDetails>;
  lastVoteId?: string;
}

interface VoteGroups {
  [key: string]: VoterDetail[];
}

export const VoteCollapsableList: FC<VoteCollapsableListProps> = ({
  data,
  votingPolicyByGroup,
  lastVoteId,
}) => {
  const { t } = useTranslation();
  const noGroupTranslate = t('proposalVotes.noGroup');

  const votesGroups = useMemo(
    () =>
      data.reduce<VoteGroups>(
        (res, item) => {
          const { groups } = item;

          if (!groups?.length) {
            res[noGroupTranslate].push(item);
          }

          groups?.forEach(group => {
            if (res[group]) {
              res[group].push(item);
            } else {
              res[group] = [item];
            }
          });

          return res;
        },
        { [noGroupTranslate]: [] }
      ),
    [data, noGroupTranslate]
  );

  if (isEmpty(data)) {
    return <NoResultsView title="No votes here" />;
  }

  return (
    <ul className={styles.voteCollapsableList}>
      {Object.keys(votesGroups).map(votesGroupsKey => {
        const list = votesGroups[votesGroupsKey];

        if (!list.length) {
          return null;
        }

        return (
          <li key={votesGroupsKey} className={styles.voteCollapsableItem}>
            <Collapsable
              initialOpenState
              renderHeading={(setToggle, state) => (
                <VoteCollapsableHeader
                  setToggle={setToggle}
                  state={state}
                  votes={list}
                  groupName={votesGroupsKey}
                  threshold={votingPolicyByGroup[votesGroupsKey]}
                />
              )}
            >
              <VotersList
                data={list}
                lastVoteId={lastVoteId}
                showTokensInfo={votesGroupsKey === 'TokenHolders'}
              />
            </Collapsable>
          </li>
        );
      })}
    </ul>
  );
};

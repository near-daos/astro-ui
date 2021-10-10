import React, { FC, useCallback } from 'react';
import omit from 'lodash/omit';
import Tabs from 'components/tabs/Tabs';
import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';
import { Proposal } from 'types/proposal';
import { VOTE_BY_PERIOD } from 'constants/votingConstants';
import { useRouter } from 'next/router';
import { BountiesList } from 'features/bounties-list';
import { Bounty } from 'components/cards/bounty-card/types';
import { arrangeByDao, ProposalsByDaoRenderer } from 'features/member-home';
import { ProposalsFilter } from 'features/member-home/types';
import { Button } from 'components/button/Button';

import styles from './my-feed-page.module.scss';

interface ProposalsTabProps {
  proposals: Proposal[];
  filter: ProposalsFilter;
}

const AllActiveProposalsView: FC<ProposalsTabProps> = ({
  proposals,
  filter
}) => {
  const router = useRouter();
  const { proposal: proposalId } = router.query;
  const filteredData = splitProposalsByVotingPeriod(proposals);

  const handleFilterChange = useCallback(
    ({ daoViewFilter }) => {
      router.push({
        pathname: '',
        query: {
          ...router.query,
          daoViewFilter
        }
      });
    },
    [router]
  );

  return (
    <>
      {VOTE_BY_PERIOD.map(period => (
        <ProposalsByDaoRenderer
          filter={filter}
          onFilterChange={handleFilterChange}
          key={period.key}
          title={period.title}
          periodKey={period.key}
          data={arrangeByDao(filteredData[period.key])}
          expandedProposalId={(proposalId ?? '') as string}
        />
      ))}
    </>
  );
};

interface MyFeedPageProps {
  proposals: Proposal[];
  bounties: Bounty[];
  filter: ProposalsFilter;
}

const MyFeedPage: FC<MyFeedPageProps> = ({ proposals, bounties, filter }) => {
  const router = useRouter();
  const tabs = [
    {
      id: 0,
      label: 'All Active proposals',
      content: <AllActiveProposalsView proposals={proposals} filter={filter} />
    },
    {
      id: 1,
      label: 'Bounties',
      content: <BountiesList bountiesList={bounties} status="In progress" />
    },
    {
      id: 2,
      label: 'Polls',
      content: <AllActiveProposalsView proposals={proposals} filter={filter} />
    }
  ];

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <h1>My Feed</h1>
        {filter.daoViewFilter && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              router.push({
                pathname: '',
                query: omit(router.query, ['daoViewFilter'])
              });
            }}
          >
            Remove filter
          </Button>
        )}
      </div>
      <div>
        <Tabs tabs={tabs} skipShallow />
      </div>
    </div>
  );
};

export default MyFeedPage;

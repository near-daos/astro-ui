import React, { FC } from 'react';
import omit from 'lodash/omit';
import Tabs from 'components/tabs/Tabs';
import { Proposal } from 'types/proposal';
import { useRouter } from 'next/router';
import { BountiesList } from 'features/bounties-list';
import { Bounty } from 'components/cards/bounty-card/types';
import { ProposalsView } from 'features/feed/proposals-view';
import { ProposalsFilter } from 'features/member-home/types';
import { Button } from 'components/button/Button';
import dynamic from 'next/dynamic';

import styles from './feed.module.scss';

const StatusFilter = dynamic(import('features/feed/status-filter'), {
  ssr: false
});

interface FeedProps {
  proposals: Proposal[];
  bounties: Bounty[];
  filter: ProposalsFilter;
  title: string;
}

export const Feed: FC<FeedProps> = ({ proposals, bounties, filter, title }) => {
  const router = useRouter();
  const tabs = [
    {
      id: 0,
      label: 'All proposals',
      content: <ProposalsView proposals={proposals} filter={filter} />
    },
    {
      id: 1,
      label: 'Governance',
      content: <ProposalsView proposals={proposals} filter={filter} />
    },
    {
      id: 2,
      label: 'Financial',
      content: <ProposalsView proposals={proposals} filter={filter} />
    },
    {
      id: 3,
      label: 'Bounties',
      content: <BountiesList bountiesList={bounties} status="In progress" />
    },
    {
      id: 4,
      label: 'Polls',
      content: <ProposalsView proposals={proposals} filter={filter} />
    },
    {
      id: 5,
      label: 'Groups',
      content: <ProposalsView proposals={proposals} filter={filter} />
    }
  ];

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <h1>{filter.daoViewFilter ?? title}</h1>
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
        <Tabs tabs={tabs} skipShallow>
          <StatusFilter />
        </Tabs>
      </div>
    </div>
  );
};

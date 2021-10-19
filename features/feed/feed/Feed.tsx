import React, { FC, ReactNode, useEffect } from 'react';
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
import { useRouterLoading } from 'hooks/useRouterLoading';
import { Loader } from 'components/loader';
import { TokenType } from 'types/token';
import { useCustomTokensContext } from 'context/CustomTokensContext';

import styles from './feed.module.scss';

const StatusFilter = dynamic(import('features/feed/status-filter'), {
  ssr: false
});

interface FeedProps {
  proposals: Proposal[];
  bounties: Bounty[];
  filter: ProposalsFilter;
  title: string;
  apiTokens: TokenType[];
}

function getTabContent(component: ReactNode, isLoading: boolean) {
  return isLoading ? <Loader /> : component;
}

export const Feed: FC<FeedProps> = ({
  proposals,
  bounties,
  filter,
  title,
  apiTokens
}) => {
  const router = useRouter();
  const isLoading = useRouterLoading();
  const content = getTabContent(
    <ProposalsView proposals={proposals} filter={filter} />,
    isLoading
  );

  const { setTokens } = useCustomTokensContext();

  useEffect(() => {
    setTokens(apiTokens);
  }, [apiTokens, setTokens]);

  const tabs = [
    {
      id: 0,
      label: 'All proposals',
      content
    },
    {
      id: 1,
      label: 'Governance',
      content
    },
    {
      id: 2,
      label: 'Financial',
      content
    },
    {
      id: 3,
      label: 'Bounties',
      content: getTabContent(
        <BountiesList bountiesList={bounties} status="In progress" />,
        isLoading
      )
    },
    {
      id: 4,
      label: 'Polls',
      content
    },
    {
      id: 5,
      label: 'Groups',
      content
    }
  ];

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <h1>{filter?.daoViewFilter ?? title}</h1>
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

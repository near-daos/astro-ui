import React, { FC, useCallback, useEffect } from 'react';
import omit from 'lodash/omit';
import { Proposal } from 'types/proposal';
import { useRouter } from 'next/router';
import { ProposalsFilter } from 'features/member-home/types';
import { Button } from 'components/button/Button';
import dynamic from 'next/dynamic';
import { Token } from 'types/token';
import { useCustomTokensContext } from 'context/CustomTokensContext';
import { filterProposalsByStatus } from 'features/dao-home/helpers';
import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';
import { isProposalsByEndTimeEmpty } from 'helpers/isProposalsByEndTimeEmpty';
import { NoResultsView } from 'features/no-results-view';
import { VOTE_BY_PERIOD } from 'constants/votingConstants';
import { ProposalsTabsFilter } from 'components/proposals-tabs-filter';
import { arrangeByDao, ProposalsByDaoRenderer } from 'features/member-home';

import styles from './feed.module.scss';

const TypeFilter = dynamic(import('features/feed/type-filter'), {
  ssr: false
});

interface FeedProps {
  proposals: Proposal[];
  filter: ProposalsFilter;
  title: string;
  apiTokens: Token[];
}

export const Feed: FC<FeedProps> = ({
  proposals,
  filter,
  title,
  apiTokens
}) => {
  const router = useRouter();
  const { proposal: proposalId } = router.query;

  const { setTokens } = useCustomTokensContext();

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

  useEffect(() => {
    setTokens(apiTokens);
  }, [apiTokens, setTokens]);

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
        <ProposalsTabsFilter
          proposals={proposals}
          filter={filterProposalsByStatus}
          tabsConfig={[
            {
              label: 'All',
              className: styles.activeProposalsTab
            },
            {
              label: 'Active proposals',
              className: styles.activeProposalsTab
            },
            {
              label: 'Approved',
              className: styles.approvedProposalsTab
            },
            {
              label: 'Failed',
              className: styles.failedProposalsTab
            }
          ]}
          tabContentRenderer={(tabProposals: Proposal[]) => {
            const filteredData = splitProposalsByVotingPeriod(tabProposals);

            if (isProposalsByEndTimeEmpty(filteredData)) {
              return <NoResultsView title="No proposals here" />;
            }

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
          }}
        >
          <TypeFilter />
        </ProposalsTabsFilter>
      </div>
    </div>
  );
};

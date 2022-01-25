import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { useState, VFC } from 'react';

import { DaoContext } from 'types/context';
import { BountyContext, BountyStatus } from 'types/bounties';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { ProposalVariant } from 'types/proposal';

import { ViewToggleOption } from 'astro_2.0/features/Bounties/components/ViewToggle';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Button } from 'components/button/Button';
import { Dropdown } from 'components/Dropdown';

import useQuery from 'hooks/useQuery';
import {
  BOUNTIES_PAGE_FILTER_OPTIONS,
  BOUNTIES_PAGE_SORT_OPTIONS,
} from 'astro_2.0/features/Bounties/helpers';

import { BountiesTimelineView } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/BountiesTimelineView';
import styles from './BountiesPageContent.module.scss';

export interface BountiesPageContentProps {
  daoContext: DaoContext;
  bountiesContext: BountyContext[];
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const BountiesPageContent: VFC<BountiesPageContentProps> = ({
  bountiesContext,
  toggleCreateProposal,
}) => {
  const router = useRouter();
  const [activeView] = useState<ViewToggleOption>('list');

  const { query, updateQuery } = useQuery<{
    bountyStatus: BountyStatus;
    bountySort: string;
  }>();

  const daoId = router.query.dao as string;

  //
  // useEffect(() => {
  //   SputnikHttpService.getBountiesByDaoId(
  //     daoId,
  //     query.bountyStatus
  //   ).then(data => setBounties(data));
  // }, [daoId, query.bountyStatus]);

  // useEffect(() => {
  //   setBounties(initialBounties);
  // }, [initialBounties]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bounties</h1>
        <Button
          size="small"
          className={styles.newProposalButton}
          onClick={() => {
            if (toggleCreateProposal) {
              toggleCreateProposal({
                proposalVariant: ProposalVariant.ProposeCreateBounty,
              });
            }
          }}
        >
          Create new
        </Button>

        <div className={styles.filters}>
          <div className={styles.filter}>
            <span className={styles.filterLabel}>Sorting by:</span>
            <Dropdown
              value={query.bountySort}
              onChange={val => updateQuery('bountySort', val)}
              options={BOUNTIES_PAGE_SORT_OPTIONS}
            />
          </div>

          <div className={styles.filter}>
            <span className={styles.filterLabel}>Filter by status:</span>
            <Dropdown
              value={query.bountyStatus}
              onChange={val => updateQuery('bountyStatus', val as BountyStatus)}
              options={BOUNTIES_PAGE_FILTER_OPTIONS}
            />
          </div>
        </div>

        {/* <ViewToggle onSelect={setActiveView} selected={activeView} /> */}
      </div>

      {/* {activeView === 'list' && ( */}
      {/*  <BountiesListView */}
      {/*    bounties={initialBounties} */}
      {/*    accountId={accountId} */}
      {/*    tokens={tokens} */}
      {/*    dao={dao} */}
      {/*    bountyProposals={bountiesProposals} */}
      {/*  /> */}
      {/* )} */}

      {activeView === 'timeline' && <div>timeline view here</div>}

      {isEmpty(bountiesContext) ? (
        <NoResultsView title="No bounties available" />
      ) : (
        <BountiesTimelineView bountiesContext={bountiesContext} daoId={daoId} />
      )}
    </div>
  );
};

import React, { useState, VFC } from 'react';
import useQuery from 'hooks/useQuery';

import { useAuthContext } from 'context/AuthContext';
import { DaoContext } from 'types/context';
import { BountyContext, BountyStatus } from 'types/bounties';
import { ProposalVariant } from 'types/proposal';
import {
  ViewToggle,
  ViewToggleOption,
} from 'astro_2.0/features/Bounties/components/ViewToggle';
import { BountiesListView } from 'astro_2.0/features/Bounties/components/BountiesListView';
import { Button } from 'components/button/Button';
import { Dropdown } from 'components/Dropdown';
import { BountiesTimeline } from 'astro_2.0/features/Bounties/components/BountiesTimeline';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { BOUNTIES_PAGE_SORT_OPTIONS } from 'astro_2.0/features/Bounties/helpers';

import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import styles from './BountiesPageContent.module.scss';

export interface BountiesPageContentProps {
  daoContext: DaoContext;
  bountiesContext: BountyContext[];
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const BountiesPageContent: VFC<BountiesPageContentProps> = ({
  daoContext,
  bountiesContext,
  toggleCreateProposal,
}) => {
  const { dao } = daoContext;

  // const router = useRouter();
  const { accountId } = useAuthContext();
  const { tokens } = useDaoCustomTokens();
  const [activeView, setActiveView] = useState<ViewToggleOption>('list');

  const { query, updateQuery } = useQuery<{
    bountyStatus: BountyStatus;
    bountySort: string;
  }>();

  function handleCreateProposal(
    bountyId: number,
    proposalVariant: ProposalVariant
  ) {
    if (toggleCreateProposal) {
      toggleCreateProposal({ bountyId, proposalVariant });
    }
  }

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
        </div>

        <ViewToggle onSelect={setActiveView} selected={activeView} />
      </div>

      {activeView === 'list' && (
        <BountiesListView
          accountId={accountId}
          tokens={tokens}
          dao={dao}
          completeHandler={handleCreateProposal}
          bountiesContext={bountiesContext}
        />
      )}

      {activeView === 'timeline' && <BountiesTimeline data={bountiesContext} />}
    </div>
  );
};

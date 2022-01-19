import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { useEffect, useState, VFC } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { DaoContext } from 'types/context';
import { Bounty, BountyStatus } from 'types/bounties';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { Proposal, ProposalType, ProposalVariant } from 'types/proposal';
import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';
import {
  ViewToggle,
  ViewToggleOption,
} from 'astro_2.0/features/Bounties/components/ViewToggle';
import { BountiesListView } from 'astro_2.0/features/Bounties/components/BountiesListView';
import { BountyCard } from 'astro_2.0/components/BountyCard';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Button } from 'components/button/Button';
import { Dropdown } from 'components/Dropdown';

import {
  mapBountyToCardContent,
  showActionBar,
} from 'astro_2.0/components/BountyCard/helpers';

import useQuery from 'hooks/useQuery';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import {
  BOUNTIES_PAGE_FILTER_OPTIONS,
  BOUNTIES_PAGE_SORT_OPTIONS,
} from 'astro_2.0/features/Bounties/helpers';

import { SputnikHttpService } from 'services/sputnik';

import styles from './BountiesPageContent.module.scss';

export interface BountiesPageContentProps {
  daoContext: DaoContext;
  initialBounties: Bounty[];
  bountyDoneProposals: Proposal[];
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const BountiesPageContent: VFC<BountiesPageContentProps> = ({
  daoContext,
  initialBounties,
  bountyDoneProposals,
  toggleCreateProposal,
}) => {
  const { dao } = daoContext;

  const router = useRouter();
  const { accountId } = useAuthContext();
  const { tokens } = useDaoCustomTokens();
  const [activeView, setActiveView] = useState<ViewToggleOption>('list');

  const [bounties, setBounties] = useState<Bounty[]>();

  const { query, updateQuery } = useQuery<{
    bountyStatus: BountyStatus;
    bountySort: string;
  }>();
  const daoId = router.query.dao as string;

  useEffect(() => {
    SputnikHttpService.getBountiesByDaoId(
      daoId,
      query.bountyStatus
    ).then(data => setBounties(data));
  }, [daoId, query.bountyStatus]);

  useEffect(() => {
    setBounties(initialBounties);
  }, [initialBounties]);

  function handleCreateProposal(
    bountyId: string,
    proposalVariant: ProposalVariant
  ) {
    return () => {
      if (toggleCreateProposal) {
        toggleCreateProposal({ bountyId, proposalVariant });
      }
    };
  }

  function getBountyDoneProposal(
    bountyContent: BountyCardContent
  ): Proposal | undefined {
    const { id, status, accountId: bountyAccountId } = bountyContent;

    if (status !== BountyStatus.InProgress) {
      return undefined;
    }

    return bountyDoneProposals.find(proposal => {
      const { kind } = proposal;

      if (kind.type === ProposalType.BountyDone) {
        const { bountyId, receiverId } = kind;

        return id === bountyId && receiverId === bountyAccountId;
      }

      return false;
    });
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

          <div className={styles.filter}>
            <span className={styles.filterLabel}>Filter by status:</span>
            <Dropdown
              value={query.bountyStatus}
              onChange={val => updateQuery('bountyStatus', val as BountyStatus)}
              options={BOUNTIES_PAGE_FILTER_OPTIONS}
            />
          </div>
        </div>

        <ViewToggle onSelect={setActiveView} selected={activeView} />
      </div>

      {activeView === 'list' && (
        <BountiesListView
          accountId={accountId}
          tokens={tokens}
          bounties={bounties}
          dao={dao}
          bountyDoneProposals={bountyDoneProposals}
        />
      )}

      {activeView === 'timeline' && <div>timeline view here</div>}

      {isEmpty(bounties) ? (
        <NoResultsView title="No bounties available" />
      ) : (
        <div className={styles.grid}>
          {bounties?.flatMap(bounty => {
            const claimedBy = bounty.claimedBy.map(
              ({ accountId: claimedAccount }) => claimedAccount
            );

            const content = mapBountyToCardContent(
              dao,
              bounty,
              tokens,
              accountId,
              query.bountyStatus
            );

            return content.map(singleContent => {
              const cardContent = {
                ...singleContent,
              };

              const bountyDoneProposal = getBountyDoneProposal(cardContent);

              if (bountyDoneProposal) {
                cardContent.status = BountyStatus.PendingApproval;
              }

              return (
                <BountyCard
                  key={Math.floor(Math.random() * 10000)}
                  content={cardContent}
                  dao={dao}
                  bountyId={bounty.id}
                  deadlineThreshold={bounty.deadlineThreshold}
                  canClaim={!claimedBy.includes(accountId)}
                  showActionBar={showActionBar(cardContent, accountId)}
                  completeHandler={handleCreateProposal(
                    bounty.id,
                    ProposalVariant.ProposeDoneBounty
                  )}
                  relatedProposal={bountyDoneProposal}
                />
              );
            });
          })}
        </div>
      )}
    </div>
  );
};

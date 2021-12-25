import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { useCallback, useEffect, useRef, useState, VFC } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { DaoContext } from 'types/context';
import { Bounty, BountyStatus } from 'types/bounties';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { Proposal, ProposalType, ProposalVariant } from 'types/proposal';
import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';

import { FeedFilter } from 'astro_2.0/components/Feed';
import { Radio } from 'astro_2.0/components/inputs/Radio';
import { BountyCard } from 'astro_2.0/components/BountyCard';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { HeaderWithFilter } from 'astro_2.0/features/dao/HeaderWithFilter';

import {
  showActionBar,
  mapBountyToCardContent,
} from 'astro_2.0/components/BountyCard/helpers';

import useQuery from 'hooks/useQuery';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { SputnikHttpService, SputnikNearService } from 'services/sputnik';

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
  const { t } = useTranslation();

  const neighbourRef = useRef(null);

  const [bounties, setBounties] = useState<Bounty[]>();

  const { query, updateQuery } = useQuery<{
    bountyStatus: BountyStatus;
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

  const onSuccessHandler = useCallback(async () => {
    await router.replace(router.asPath);
    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      lifetime: 20000,
      description: t('bountiesPage.successClaimBountyNotification'),
    });
  }, [t, router]);

  const handleClaim = useCallback(
    (bountyId, deadline) => async () => {
      await SputnikNearService.claimBounty(daoId, {
        bountyId: Number(bountyId),
        deadline,
        bountyBond: dao.policy.bountyBond,
      });

      onSuccessHandler();
    },
    [dao.policy.bountyBond, daoId, onSuccessHandler]
  );

  const handleUnclaim = useCallback(
    bountyId => async () => {
      await SputnikNearService.unclaimBounty(daoId, bountyId);
      onSuccessHandler();
    },
    [daoId, onSuccessHandler]
  );

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
      <HeaderWithFilter
        titleRef={neighbourRef}
        title={<h1 className={styles.header}>Bounties</h1>}
      >
        <FeedFilter
          neighbourRef={neighbourRef}
          title="Bounties and Claims"
          value={query.bountyStatus}
          onChange={val => updateQuery('bountyStatus', val)}
        >
          <Radio value="" label="All" />
          <Radio value={BountyStatus.Available} label="Available bounties" />
          <Radio value={BountyStatus.InProgress} label="Claims in progress" />
          <Radio value={BountyStatus.Expired} label="Expired Claims" />
        </FeedFilter>
      </HeaderWithFilter>

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
                  claimHandler={handleClaim(
                    bounty.id,
                    bounty.deadlineThreshold
                  )}
                  canClaim={!claimedBy.includes(accountId)}
                  showActionBar={showActionBar(cardContent, accountId)}
                  unclaimHandler={handleUnclaim(bounty.id)}
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

import { useRouter } from 'next/router';
import React, { FC, useCallback, useRef } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { BountyCard } from 'astro_2.0/components/BountyCard';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { Radio } from 'astro_2.0/components/inputs/Radio';
import { NavLink } from 'astro_2.0/components/NavLink';
import { FeedFilter } from 'astro_2.0/components/Feed';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { HeaderWithFilter } from 'astro_2.0/features/dao/HeaderWithFilter';

import { Bounty } from 'components/cards/bounty-card/types';
import { ProposalVariant } from 'types/proposal';
import { BountyStatuses } from 'types/bounties';
import {
  mapBountyToCardContent,
  showActionBar,
} from 'astro_2.0/components/BountyCard/helpers';
import { SputnikNearService } from 'services/sputnik';

import useQuery from 'hooks/useQuery';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { DaoContext } from 'types/context';
import { NoResultsView } from 'features/no-results-view';

import styles from './Bounties.module.scss';

export interface BountiesPageProps {
  daoContext: DaoContext;
  bounties: Bounty[];
}

const BountiesPage: FC<BountiesPageProps> = ({
  daoContext: {
    dao,
    userPermissions: { isCanCreateProposals },
    policyAffectsProposals,
  },
  bounties,
}) => {
  const neighbourRef = useRef(null);

  const router = useRouter();
  const { query, updateQuery } = useQuery<{
    bountyStatus: BountyStatuses;
  }>();
  const { accountId } = useAuthContext();
  const daoId = router.query.dao as string;

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();
  const { tokens } = useDaoCustomTokens();

  const handleCreateProposal = useCallback(
    (bountyId: string, proposalVariant: ProposalVariant) => () => {
      toggleCreateProposal({ bountyId, proposalVariant });
    },
    [toggleCreateProposal]
  );

  const handleClick = useCallback(
    () => handleCreateProposal('', ProposalVariant.ProposeCreateBounty),
    [handleCreateProposal]
  );

  const onSuccessHandler = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

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
    },
    [daoId]
  );

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink>Bounties</NavLink>
      </BreadCrumbs>

      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          disableNewProposal={!isCanCreateProposals}
          onCreateProposalClick={handleClick()}
        />
        <CreateProposal
          dao={dao}
          showFlag={false}
          className={styles.createProposal}
          proposalVariant={ProposalVariant.ProposeCreateBounty}
          onClose={toggleCreateProposal}
        />
        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>

      {bounties.length === 0 ? (
        <NoResultsView title="No bounties available" />
      ) : (
        <>
          <HeaderWithFilter
            titleRef={neighbourRef}
            title={<h1 className={styles.header}>Bounties</h1>}
          >
            <FeedFilter
              title="Bounties"
              value={query.bountyStatus}
              neighbourRef={neighbourRef}
              onChange={val => updateQuery('bountyStatus', val)}
            >
              <Radio value="" label="All" />
              <Radio value={BountyStatuses.Available} label="Available" />
              <Radio value={BountyStatuses.Inprogress} label="In progress" />
              <Radio value={BountyStatuses.Completed} label="Completed" />
            </FeedFilter>
          </HeaderWithFilter>

          <div className={styles.grid}>
            {bounties.flatMap(bounty => {
              const content = mapBountyToCardContent(
                dao,
                bounty,
                tokens,
                accountId
              );

              return content.map(cardContent => (
                <BountyCard
                  key={bounty.id}
                  content={cardContent}
                  claimHandler={handleClaim(
                    bounty.id,
                    bounty.deadlineThreshold
                  )}
                  showActionBar={showActionBar(cardContent, accountId)}
                  unclaimHandler={handleUnclaim(bounty.id)}
                  completeHandler={handleCreateProposal(
                    bounty.id,
                    ProposalVariant.ProposeDoneBounty
                  )}
                />
              ));
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BountiesPage;

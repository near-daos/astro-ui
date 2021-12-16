import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { ALL_DAOS_URL } from 'constants/routing';

import { useAuthContext } from 'context/AuthContext';

import { BountyCard } from 'astro_2.0/components/BountyCard';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { Radio } from 'astro_2.0/components/inputs/Radio';
import { NavLink } from 'astro_2.0/components/NavLink';
import { FeedFilter } from 'astro_2.0/components/Feed';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { HeaderWithFilter } from 'astro_2.0/features/dao/HeaderWithFilter';

import { ProposalVariant } from 'types/proposal';
import {
  mapBountyToCardContent,
  showActionBar,
} from 'astro_2.0/components/BountyCard/helpers';
import { SputnikHttpService, SputnikNearService } from 'services/sputnik';

import useQuery from 'hooks/useQuery';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { DaoContext } from 'types/context';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { Bounty, BountyStatus } from 'types/bounties';
import styles from './Bounties.module.scss';

export interface BountiesPageProps {
  daoContext: DaoContext;
  initialBounties: Bounty[];
}

const BountiesPage: FC<BountiesPageProps> = ({
  daoContext: {
    dao,
    userPermissions: { isCanCreateProposals },
    policyAffectsProposals,
  },
  initialBounties,
}) => {
  const neighbourRef = useRef(null);

  const router = useRouter();
  const { query, updateQuery } = useQuery<{
    bountyStatus: BountyStatus;
  }>();
  const { accountId } = useAuthContext();
  const daoId = router.query.dao as string;

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();
  const { tokens } = useDaoCustomTokens();
  const [bounties, setBounties] = useState<Bounty[]>(initialBounties);

  useEffect(() => {
    SputnikHttpService.getBountiesByDaoId(
      daoId,
      query.bountyStatus
    ).then(data => setBounties(data));
  }, [daoId, query.bountyStatus]);

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
        <NavLink href={ALL_DAOS_URL}>All DAOs</NavLink>
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
          key={Object.keys(tokens).length}
          daoTokens={tokens}
          className={styles.createProposal}
          proposalVariant={ProposalVariant.ProposeCreateBounty}
          onClose={toggleCreateProposal}
        />
        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>
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

      {bounties.length === 0 ? (
        <NoResultsView title="No bounties available" />
      ) : (
        <div className={styles.grid}>
          {bounties.flatMap(bounty => {
            const content = mapBountyToCardContent(
              dao,
              bounty,
              tokens,
              accountId,
              query.bountyStatus
            );

            return content.map(cardContent => (
              <BountyCard
                key={Math.floor(Math.random() * 10000)}
                content={cardContent}
                claimHandler={handleClaim(bounty.id, bounty.deadlineThreshold)}
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
      )}
    </div>
  );
};

export default BountiesPage;

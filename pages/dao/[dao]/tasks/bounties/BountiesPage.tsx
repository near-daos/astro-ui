import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';

import { useAuthContext } from 'context/AuthContext';
import { Tokens } from 'context/CustomTokensContext';

import { BountyCard } from 'astro_2.0/components/BountyCard';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { Radio } from 'astro_2.0/components/inputs/Radio';
import NavLink from 'astro_2.0/components/NavLink';
import { Button } from 'components/button/Button';
import { FeedFilter } from 'astro_2.0/features/Feed';

import { Bounty } from 'components/cards/bounty-card/types';
import { ProposalVariant } from 'types/proposal';
import { BountyStatuses } from 'types/bounties';
import { DAO } from 'types/dao';

import useQuery from 'hooks/useQuery';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import styles from './bounties.module.scss';

export interface BountiesPageProps {
  dao: DAO;
  bounties: Bounty[];
  tokens: Tokens;
}

const BountiesPage: FC<BountiesPageProps> = ({ dao, bounties, tokens }) => {
  const router = useRouter();
  const { query, updateQuery } = useQuery<{
    bountyStatus: BountyStatuses;
  }>();
  const { accountId } = useAuthContext();
  const daoId = router.query.dao as string;

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  const handleCreateProposal = useCallback(
    (bountyId: string, proposalVariant: ProposalVariant) => {
      toggleCreateProposal({ bountyId, proposalVariant });
    },
    [toggleCreateProposal]
  );

  const handleClick = useCallback(
    () => handleCreateProposal('', ProposalVariant.ProposeCreateBounty),
    [handleCreateProposal]
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
          accountId={accountId}
          onCreateProposalClick={handleClick}
        />
      </div>

      <CreateProposal
        dao={dao}
        showFlag={false}
        proposalVariant={ProposalVariant.ProposeCreateBounty}
        onCreate={isSuccess => isSuccess && toggleCreateProposal()}
        onClose={toggleCreateProposal}
      />

      <div className={styles.createBounty}>
        <h1>Bounties</h1>
        <Button variant="black" size="small" onClick={handleClick}>
          Create new Bounty
        </Button>
      </div>
      <div className={styles.filters}>
        <FeedFilter
          title="Test"
          value={query.bountyStatus}
          onChange={val => updateQuery('bountyStatus', val)}
        >
          <Radio value="" label="All" />
          <Radio value={BountyStatuses.Available} label="Available" />
          <Radio value={BountyStatuses.Inprogress} label="In progress" />
          <Radio value={BountyStatuses.Completed} label="Completed" />
        </FeedFilter>
      </div>
      <div className={styles.grid}>
        {bounties.map(bounty => {
          return (
            <BountyCard
              key={bounty.id}
              id={bounty.id}
              daoId={dao.id}
              token={
                bounty.tokenId === '' ? tokens.NEAR : tokens[bounty.tokenId]
              }
              amount={bounty.amount}
              description={bounty.description}
              forgivenessPeriod={bounty.forgivenessPeriod}
              externalUrl={bounty.externalUrl}
              slots={bounty.slots}
              claimedBy={bounty.claimedBy}
              deadlineThreshold={bounty.deadlineThreshold}
              currentUser={accountId}
              bountyBond={dao.policy.bountyBond}
              setBountyData={handleCreateProposal}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BountiesPage;

import React, { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { Bounty } from 'components/cards/bounty-card/types';
import { DAO } from 'types/dao';
import { useAuthContext } from 'context/AuthContext';
import { Tokens } from 'context/CustomTokensContext';
import { BountyCard } from 'astro_2.0/components/BountyCard';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { ProposalVariant } from 'types/proposal';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import NavLink from 'astro_2.0/components/NavLink';

import { Button } from 'components/button/Button';
import StatusFilters from 'astro_2.0/components/Feed/StatusFilters';

import { BountyStatuses } from 'types/bounties';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import styles from './bounties.module.scss';

export interface BountiesPageProps {
  dao: DAO;
  bounties: Bounty[];
  tokens: Tokens;
}

const BountiesPage: FC<BountiesPageProps> = ({ dao, bounties, tokens }) => {
  const router = useRouter();
  const status = router.query.status as string;
  const { accountId, login } = useAuthContext();
  const daoId = router.query.dao as string;

  const [bountyData, setBountyData] = useState<{
    bountyId: string;
    variant: ProposalVariant;
  } | null>(null);

  const handleCreateProposal = useCallback(
    (bountyId: string, variant: ProposalVariant) => {
      setBountyData({ bountyId, variant });
    },
    []
  );

  const renderCreateProposal = () =>
    bountyData !== null ? (
      <div className={styles.newProposal}>
        <CreateProposal
          dao={dao}
          showFlag={false}
          bountyId={bountyData.bountyId}
          proposalVariant={bountyData.variant}
          onCreate={isSuccess => {
            if (isSuccess) {
              setBountyData(null);
            }
          }}
          onClose={() => {
            setBountyData(null);
          }}
        />
      </div>
    ) : null;

  const handleClick = useCallback(
    () =>
      accountId
        ? handleCreateProposal('', ProposalVariant.ProposeCreateBounty)
        : login(),
    [accountId, handleCreateProposal, login]
  );

  const onProposalFilterChange = (value?: string) => async () => {
    const nextQuery = {
      ...router.query,
      status: value,
    } as ProposalsQueries;

    if (!value) {
      delete nextQuery.status;
    }

    await router.replace(
      {
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <span>Bounties</span>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={() => {
            handleCreateProposal('', ProposalVariant.ProposeCreateBounty);
          }}
        />
      </div>
      <div className={styles.createBounty}>
        <h1>Bounties</h1>
        <Button variant="black" size="small" onClick={handleClick}>
          Create new Bounty
        </Button>
      </div>
      {renderCreateProposal()}
      <div className={styles.filters}>
        <StatusFilters
          proposal={status}
          filterName="bounty"
          onChange={onProposalFilterChange}
          list={[
            { value: undefined, label: 'All', name: 'All' },
            {
              value: BountyStatuses.Available,
              label: 'Available',
              name: BountyStatuses.Available,
            },
            {
              value: BountyStatuses.Inprogress,
              label: 'In progress',
              name: BountyStatuses.Inprogress,
            },
            {
              value: BountyStatuses.Completed,
              label: 'Completed',
              name: BountyStatuses.Completed,
            },
          ]}
          className={styles.statusFilterRoot}
        />
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

import { Bounty } from 'components/cards/bounty-card/types';
import styles from 'pages/dao/[dao]/tasks/bounties/bounties.module.scss';
import React, { FC, useCallback, useState } from 'react';
import { DAO } from 'types/dao';
import { useAuthContext } from 'context/AuthContext';
import { Tokens } from 'context/CustomTokensContext';
import { BountyCard } from 'astro_2.0/components/BountyCard';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { ProposalVariant } from 'types/proposal';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';

export interface BountiesPageProps {
  dao: DAO;
  bounties: Bounty[];
  tokens: Tokens;
}

const BountiesPage: FC<BountiesPageProps> = ({ dao, bounties, tokens }) => {
  const { accountId } = useAuthContext();
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
    ) : null;

  return (
    <div className={styles.root}>
      <DaoDetailsMinimized
        dao={dao}
        accountId={accountId}
        onCreateProposalClick={() => {
          handleCreateProposal('', ProposalVariant.ProposeCreateBounty);
        }}
      />
      <div className={styles.newProposal}>{renderCreateProposal()}</div>
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
      </div>{' '}
    </div>
  );
};

export default BountiesPage;

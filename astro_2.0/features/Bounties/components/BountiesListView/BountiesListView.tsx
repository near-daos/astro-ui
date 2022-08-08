import React, { FC } from 'react';
import cn from 'classnames';
import { BountyContext } from 'types/bounties';

import { CollapsableSection } from 'astro_2.0/features/Bounties/components/BountiesListView/components/CollapsableSection';
import { prepareBountiesPageContent } from 'astro_2.0/features/Bounties/helpers';
import { MobileListView } from 'astro_2.0/features/Bounties/components/BountiesListView/components/MobileListView';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { Tokens } from 'types/token';
import { HideBountyContextProvider } from 'astro_2.0/features/Bounties/components/HideBountyContext/HideBountyContext';

import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

import { useWalletContext } from 'context/WalletContext';

import styles from './BountiesListView.module.scss';

interface BountiesListViewProps {
  dao?: DAO;
  tokens?: Tokens;
  bountiesContext: BountyContext[];
  handleCreateProposal?: (
    id: number,
    variant: ProposalVariant.ProposeDoneBounty
  ) => void;
}

export const BountiesListView: FC<BountiesListViewProps> = ({
  dao,
  bountiesContext,
  handleCreateProposal,
  tokens,
}) => {
  const { accountId } = useWalletContext();

  if (!dao || !tokens || !handleCreateProposal) {
    return null;
  }

  const { proposalPhase, bounties, completed } = prepareBountiesPageContent(
    bountiesContext,
    dao,
    accountId,
    handleCreateProposal,
    tokens
  );

  if (!proposalPhase.length && !bounties.length && !completed.length) {
    return <NoResultsView title="No results found" />;
  }

  return (
    <div className={styles.root}>
      <HideBountyContextProvider>
        <div className={cn(styles.content, styles.regular)}>
          {!!proposalPhase.length && (
            <CollapsableSection
              status="Pending"
              accountId={accountId}
              title={`Coming Soon (Proposal Phase) (${proposalPhase.length})`}
              contentTitle="Voting"
              dao={dao}
              data={proposalPhase}
            />
          )}
          {!!bounties.length && (
            <CollapsableSection
              status="InProgress"
              accountId={accountId}
              title={`Bounties (${bounties.length})`}
              contentTitle="Amount"
              dao={dao}
              data={bounties}
            />
          )}
          {!!completed.length && (
            <CollapsableSection
              status="Completed"
              accountId={accountId}
              title={`Completed (${completed.length})`}
              contentTitle="Amount"
              dao={dao}
              data={completed}
            />
          )}
        </div>
        <div className={cn(styles.content, styles.mobile)}>
          <MobileListView
            proposals={proposalPhase}
            bounties={bounties}
            completed={completed}
            dao={dao}
            accountId={accountId}
          />
        </div>
      </HideBountyContextProvider>
    </div>
  );
};

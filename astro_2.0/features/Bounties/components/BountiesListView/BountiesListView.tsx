import React, { FC } from 'react';

import { BountyContext } from 'types/bounties';

import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import {
  SINGLE_BOUNTY_PAGE_URL,
  SINGLE_PROPOSAL_PAGE_URL,
} from 'constants/routing';

import { CollapsableSection } from 'astro_2.0/features/Bounties/components/BountiesListView/components/CollapsableSection';
import { prepareBountiesPageContent } from 'astro_2.0/features/Bounties/helpers';
import { VotingContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/VotingContent';
import { AmountContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/AmountContent';

import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

import styles from './BountiesListView.module.scss';

interface BountiesListViewProps {
  dao: DAO;
  tokens: Tokens;
  accountId: string;
  bountiesContext: BountyContext[];
  completeHandler: (
    id: number,
    variant: ProposalVariant.ProposeDoneBounty
  ) => void;
}

export const BountiesListView: FC<BountiesListViewProps> = ({
  dao,
  bountiesContext,
  accountId,
  completeHandler,
  tokens,
}) => {
  const { proposalPhase, bounties, completed } = prepareBountiesPageContent(
    bountiesContext
  );

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <CollapsableSection
          status="Pending"
          accountId={accountId}
          title={`Coming Soon (Proposal Phase) (${proposalPhase.length})`}
          contentTitle="Voting"
          dao={dao}
          data={proposalPhase.map(item => {
            const [description] = item.proposal.description.split(
              EXTERNAL_LINK_SEPARATOR
            );

            return {
              id: item.id,
              title: description,
              proposer: item.proposal.proposer,
              proposalId: item.proposal.id,
              link: {
                pathname: SINGLE_PROPOSAL_PAGE_URL,
                query: {
                  dao: dao.id,
                  proposal: item.proposal.id,
                },
              },
              content: (
                <VotingContent
                  proposal={item.proposal}
                  accountId={accountId}
                  dao={dao}
                />
              ),
            };
          })}
        />
        <CollapsableSection
          status="InProgress"
          accountId={accountId}
          title={`Bounties (${bounties.length})`}
          contentTitle="Amount"
          dao={dao}
          data={bounties.map(item => {
            const [description] = item.bounty.description.split(
              EXTERNAL_LINK_SEPARATOR
            );

            return {
              id: item.id,
              title: description,
              proposer: item.proposal.proposer,
              proposalId: item.proposal.id,
              bounty: item.bounty,
              link: {
                pathname: SINGLE_BOUNTY_PAGE_URL,
                query: {
                  dao: dao.id,
                  bounty: item.id,
                },
              },
              completeHandler,
              content: (
                <AmountContent
                  tokens={tokens}
                  amount={item.bounty.amount}
                  token={item.bounty.token}
                  commentsCount={item.commentsCount}
                />
              ),
            };
          })}
        />
        <CollapsableSection
          status="Completed"
          accountId={accountId}
          title={`Completed (${completed.length})`}
          contentTitle="Amount"
          dao={dao}
          data={completed.map(item => {
            const [description] = item.bounty.description.split(
              EXTERNAL_LINK_SEPARATOR
            );

            return {
              id: item.id,
              title: description,
              proposer: item.proposal.proposer,
              proposalId: item.proposal.id,
              bounty: item.bounty,
              link: {
                pathname: SINGLE_BOUNTY_PAGE_URL,
                query: {
                  dao: dao.id,
                  bounty: item.id,
                },
              },
              content: (
                <AmountContent
                  tokens={tokens}
                  amount={item.bounty.amount}
                  token={item.bounty.token}
                  commentsCount={item.commentsCount}
                />
              ),
            };
          })}
        />
      </div>
    </div>
  );
};

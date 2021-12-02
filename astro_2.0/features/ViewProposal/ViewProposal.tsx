import React, { FC } from 'react';

import {
  ProposalCard,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';

import { Proposal } from 'types/proposal';
import { DAO } from 'types/dao';

import { useAuthContext } from 'context/AuthContext';
import { getVoteDetails } from 'features/vote-policy/helpers';
import { getProposalScope } from 'utils/getProposalScope';
import { getContentNode } from 'astro_2.0/features/ViewProposal/helpers';
import { Token } from 'types/token';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

export interface CreateProposalProps {
  dao: DAO;
  proposal: Proposal;
  showFlag: boolean;
  tokens: Record<string, Token>;
}

export const ViewProposal: FC<CreateProposalProps> = ({
  dao,
  proposal,
  showFlag,
  tokens,
}) => {
  const { accountId } = useAuthContext();

  const contentNode = getContentNode(proposal, dao);

  if (!proposal) {
    return null;
  }

  return (
    <ProposalCardRenderer
      proposalId={proposal.proposalId}
      daoFlagNode={
        showFlag && (
          <DaoFlagWidget
            daoName={dao.name}
            flagUrl={dao.flagCover}
            daoId={dao.id}
            fallBack={dao.logo}
          />
        )
      }
      letterHeadNode={
        <LetterHeadWidget type={proposal.kind.type} coverUrl={dao.flagCover} />
      }
      proposalCardNode={
        <ProposalCard
          id={proposal.id}
          proposalId={proposal.proposalId}
          variant={proposal.proposalVariant}
          type={proposal.kind.type}
          status={proposal.status}
          proposer={proposal.proposer}
          description={proposal.description}
          link={proposal.link}
          proposalTxHash={proposal.txHash}
          votePeriodEnd={proposal.votePeriodEndDate}
          accountId={accountId}
          dao={proposal.dao}
          likes={proposal.voteYes}
          dislikes={proposal.voteNo}
          voteRemove={proposal.voteRemove}
          liked={proposal.votes[accountId] === 'Yes'}
          disliked={proposal.votes[accountId] === 'No'}
          updatedAt={proposal.updatedAt}
          voteDetails={
            proposal.dao.policy.defaultVotePolicy.ratio
              ? getVoteDetails(
                  proposal.dao,
                  getProposalScope(proposal.kind.type),
                  proposal
                ).details
              : undefined
          }
          content={
            <CustomTokensContext.Provider value={{ tokens }}>
              {contentNode}
            </CustomTokensContext.Provider>
          }
        />
      }
      infoPanelNode={null}
    />
  );
};

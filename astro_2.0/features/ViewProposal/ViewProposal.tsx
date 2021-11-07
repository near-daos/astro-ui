import React, { FC } from 'react';
import { useMount } from 'react-use';

import { SputnikHttpService } from 'services/sputnik';
import { useCustomTokensContext } from 'context/CustomTokensContext';

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
import { getScope } from 'components/cards/expanded-proposal-card/helpers';
import { getContentNode } from 'astro_2.0/features/ViewProposal/helpers';

export interface CreateProposalProps {
  dao: DAO;
  proposal: Proposal;
  showFlag: boolean;
}

export const ViewProposal: FC<CreateProposalProps> = ({
  dao,
  proposal,
  showFlag,
}) => {
  const { accountId } = useAuthContext();

  const { setTokens } = useCustomTokensContext();

  useMount(() => {
    SputnikHttpService.getAccountTokens(dao.id).then(res => setTokens(res));
  });

  const contentNode = getContentNode(proposal, dao);

  if (!proposal) {
    return null;
  }

  return (
    <ProposalCardRenderer
      daoFlagNode={
        showFlag && (
          <DaoFlagWidget
            daoName={dao.name}
            flagUrl={dao.flagCover || dao.logo}
            daoId={dao.id}
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
          liked={proposal.votes[accountId] === 'Yes'}
          disliked={proposal.votes[accountId] === 'No'}
          updatedAt={proposal.updatedAt}
          voteDetails={
            proposal.dao.policy.defaultVotePolicy.ratio
              ? getVoteDetails(
                  proposal.dao,
                  getScope(proposal.kind.type),
                  proposal
                ).details
              : undefined
          }
          content={contentNode}
        />
      }
      infoPanelNode={null}
    />
  );
};

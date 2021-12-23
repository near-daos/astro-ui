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
import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';
import { useToggle } from 'react-use';
import { ProposalComments } from 'astro_2.0/features/ViewProposal/components/ProposalComments';
import { AnimatePresence, motion } from 'framer-motion';

export interface CreateProposalProps {
  dao: DAO | null;
  proposal: Proposal;
  showFlag: boolean;
  tokens: Record<string, Token>;
}

const variants = {
  initial: { opacity: 0, transform: 'translateY(-100px)' },
  visible: { opacity: 1, transform: 'translateY(0px)' },
};

export const ViewProposal: FC<CreateProposalProps> = ({
  dao,
  proposal,
  showFlag,
  tokens,
}) => {
  const { accountId } = useAuthContext();
  const [showInfoPanel, toggleInfoPanel] = useToggle(false);

  if (!proposal || !dao || !proposal.dao) {
    return null;
  }

  const contentNode = getContentNode(proposal, dao);

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
          toggleInfoPanel={toggleInfoPanel}
          commentsCount={proposal.commentsCount}
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
              <ErrorBoundary>{contentNode}</ErrorBoundary>
            </CustomTokensContext.Provider>
          }
        />
      }
      infoPanelNode={
        <AnimatePresence>
          {showInfoPanel && (
            <motion.div
              key={proposal.proposalId}
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={{
                duration: 0.3,
              }}
            >
              <ProposalComments proposalId={proposal.id} />
            </motion.div>
          )}
        </AnimatePresence>
      }
    />
  );
};

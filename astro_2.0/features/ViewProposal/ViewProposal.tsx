import React, { FC, useState } from 'react';

import {
  ProposalCard,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';

import { ProposalFeedItem, ProposalType } from 'types/proposal';

import { useWalletContext } from 'context/WalletContext';
import { getVoteDetails } from 'features/vote-policy/helpers';
import { getProposalScope } from 'utils/getProposalScope';
import { getContentNode } from 'astro_2.0/features/ViewProposal/helpers';
import { Token } from 'types/token';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';
import { useToggle } from 'react-use';
import { ProposalComments } from 'astro_2.0/features/ViewProposal/components/ProposalComments';
import { AnimatePresence, motion } from 'framer-motion';
import { SaveFcTemplate } from 'astro_2.0/features/ViewProposal/components/SaveFcTemplate';

export interface CreateProposalProps {
  proposal: ProposalFeedItem;
  showFlag: boolean;
  tokens: Record<string, Token>;
  preventNavigate?: boolean;
}

const variants = {
  initial: { opacity: 0, transform: 'translateY(-100px)' },
  visible: { opacity: 1, transform: 'translateY(0px)' },
};

export const ViewProposal: FC<CreateProposalProps> = ({
  proposal,
  showFlag,
  tokens,
  preventNavigate,
}) => {
  const { accountId } = useWalletContext();
  const [showInfoPanel, toggleInfoPanel] = useToggle(false);
  const [commentsCount, setCommentsCount] = useState(proposal?.commentsCount);
  const isCouncilUser = proposal?.permissions?.isCouncil ?? false;
  const showOptionalControl =
    proposal?.kind?.type === ProposalType.FunctionCall &&
    proposal.status === 'Approved' &&
    !!accountId;

  if (!proposal || !proposal.dao) {
    return null;
  }

  const contentNode = getContentNode(proposal);

  return (
    <ProposalCardRenderer
      proposalId={proposal.proposalId}
      daoFlagNode={
        showFlag && (
          <DaoFlagWidget
            daoName={proposal.dao.name}
            flagUrl={proposal.dao.flagLogo}
            daoId={proposal.dao.id}
            fallBack={proposal.dao.logo}
          />
        )
      }
      optionalActionNode={
        showOptionalControl && <SaveFcTemplate proposal={proposal} />
      }
      letterHeadNode={
        <LetterHeadWidget
          type={proposal.kind.type}
          coverUrl={proposal.dao.flagCover}
        />
      }
      proposalCardNode={
        <ProposalCard
          id={proposal.id}
          proposalId={proposal.proposalId}
          variant={proposal.proposalVariant}
          type={proposal.kind.type}
          status={proposal.status}
          preventNavigate={preventNavigate}
          voteStatus={proposal.voteStatus}
          isFinalized={proposal.isFinalized}
          proposer={proposal.proposer}
          description={proposal.description}
          link={proposal.link}
          proposalTxHash={proposal.txHash}
          votePeriodEnd={proposal.votePeriodEndDate}
          accountId={accountId}
          daoId={proposal.daoId}
          permissions={proposal.permissions}
          likes={proposal.voteYes}
          dislikes={proposal.voteNo}
          voteRemove={proposal.voteRemove}
          liked={proposal.votes[accountId] === 'Yes'}
          disliked={proposal.votes[accountId] === 'No'}
          dismissed={proposal.votes[accountId] === 'Dismiss'}
          updatedAt={proposal.updatedAt}
          toggleInfoPanel={toggleInfoPanel}
          commentsCount={commentsCount}
          voteDetails={
            proposal.dao.policy.defaultVotePolicy.ratio
              ? getVoteDetails(
                  proposal.dao.numberOfMembers,
                  proposal.dao.policy.defaultVotePolicy,
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
              initial={variants.initial}
              animate={variants.visible}
              exit={variants.initial}
              transition={{
                duration: 0.3,
              }}
            >
              <ProposalComments
                contextId={proposal.id}
                contextType="Proposal"
                isCouncilUser={isCouncilUser}
                isCommentsAllowed
                updateCommentsCount={setCommentsCount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      }
    />
  );
};

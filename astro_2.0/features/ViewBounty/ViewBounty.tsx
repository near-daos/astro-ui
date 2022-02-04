import React, { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { ProposalCardRenderer } from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { getContentNode } from 'astro_2.0/features/ViewBounty/helpers';
import { BountyCard } from 'astro_2.0/features/ViewBounty/components/BountyCard';

import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { Bounty, BountyProposal } from 'types/bounties';
import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { InfoPanel } from 'astro_2.0/features/ViewBounty/components/InfoPanel/InfoPanel';
import { ClaimsInfo } from 'astro_2.0/features/ViewBounty/components/ClaimsInfo';
import { ProposalComments } from 'astro_2.0/features/ViewProposal/components/ProposalComments';

export interface ViewBountyProps {
  contextId: string;
  commentsCount: number;
  dao: DAO | null;
  bounty: Bounty;
  tokens: Record<string, Token>;
  proposal: BountyProposal;
  className?: string;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  initialInfoPanelView: string | null;
}

const variants = {
  initial: { opacity: 0, transform: 'translateY(-100px)' },
  visible: { opacity: 1, transform: 'translateY(0px)' },
};

export const ViewBounty: FC<ViewBountyProps> = ({
  contextId,
  commentsCount,
  dao,
  bounty,
  tokens,
  proposal,
  className,
  toggleCreateProposal,
  initialInfoPanelView,
}) => {
  const [showInfoPanel, setShowInfoPanel] = useState<string | null>(
    initialInfoPanelView
  );
  const isCouncilUser = proposal.permissions?.isCouncil ?? false;
  const [commentsNum, setCommentsNum] = useState(commentsCount);

  if (!dao || !(bounty || proposal)) {
    return null;
  }

  const contentNode = getContentNode(bounty, proposal);

  return (
    <div className={className}>
      <ProposalCardRenderer
        proposalId={null}
        daoFlagNode={null}
        letterHeadNode={
          <LetterHeadWidget
            type={ProposalType.AddBounty}
            coverUrl={dao.flagCover}
          />
        }
        proposalCardNode={
          <BountyCard
            dao={dao}
            bounty={bounty}
            proposal={proposal}
            completeHandler={() => {
              if (toggleCreateProposal) {
                toggleCreateProposal({
                  bountyId: bounty.bountyId,
                  proposalVariant: ProposalVariant.ProposeDoneBounty,
                });
              }
            }}
            activeInfoView={showInfoPanel}
            content={
              <CustomTokensContext.Provider value={{ tokens }}>
                <ErrorBoundary>{contentNode}</ErrorBoundary>
              </CustomTokensContext.Provider>
            }
            commentsCount={commentsNum}
            toggleInfoPanel={setShowInfoPanel}
          />
        }
        infoPanelNode={
          <AnimatePresence>
            {showInfoPanel && (
              <motion.div
                initial={variants.initial}
                animate={variants.visible}
                exit={variants.initial}
                transition={{
                  duration: 0.3,
                }}
              >
                {showInfoPanel === 'claims' && (
                  <InfoPanel>
                    <ClaimsInfo bounty={bounty} />
                  </InfoPanel>
                )}
                {showInfoPanel === 'comments' && (
                  <ProposalComments
                    contextId={contextId}
                    contextType="BountyContext"
                    isCouncilUser={isCouncilUser}
                    isCommentsAllowed
                    updateCommentsCount={setCommentsNum}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        }
      />
    </div>
  );
};

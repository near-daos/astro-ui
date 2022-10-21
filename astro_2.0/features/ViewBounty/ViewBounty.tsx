import React, { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { ProposalCardRenderer } from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { getContentNode } from 'astro_2.0/features/ViewBounty/helpers';
import { BountyCard } from 'astro_2.0/features/ViewBounty/components/BountyCard';

import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Bounty, BountyProposal } from 'types/bounties';
import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { InfoPanel } from 'astro_2.0/features/ViewBounty/components/InfoPanel/InfoPanel';
import { ClaimsInfo } from 'astro_2.0/features/ViewBounty/components/ClaimsInfo';
import { ProposalComments } from 'astro_2.0/features/ViewProposal/components/ProposalComments';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import { DaoContext } from 'types/context';

export interface ViewBountyProps {
  contextId: string;
  commentsCount: number;
  dao?: DAO | null;
  daoId: string;
  bounty: Bounty;
  proposal: BountyProposal;
  className?: string;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  initialInfoPanelView: string | null;
  daoContext?: DaoContext;
  showFlag?: boolean;
}

const variants = {
  initial: { opacity: 0, transform: 'translateY(-100px)' },
  visible: { opacity: 1, transform: 'translateY(0px)' },
};

export const ViewBounty: FC<ViewBountyProps> = ({
  contextId,
  commentsCount,
  dao,
  daoId,
  bounty,
  proposal,
  className,
  toggleCreateProposal,
  initialInfoPanelView,
  daoContext,
  showFlag = true,
}) => {
  const [showInfoPanel, setShowInfoPanel] = useState<string | null>(
    initialInfoPanelView
  );
  const isCouncilUser = proposal?.permissions?.isCouncil ?? false;
  const [commentsNum, setCommentsNum] = useState(commentsCount);

  if (!(bounty || proposal)) {
    return null;
  }

  const contentNode = getContentNode(bounty, proposal);

  return (
    <div className={className}>
      <ProposalCardRenderer
        proposalId={null}
        daoFlagNode={
          showFlag && (
            <DaoFlagWidget
              daoName={daoId}
              flagUrl={dao?.flagLogo}
              daoId={daoId}
              fallBack={dao?.logo}
            />
          )
        }
        letterHeadNode={
          <LetterHeadWidget
            type={ProposalType.AddBounty}
            coverUrl={dao?.flagCover}
          />
        }
        proposalCardNode={
          <BountyCard
            contextId={contextId}
            daoId={daoId}
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
            content={<ErrorBoundary>{contentNode}</ErrorBoundary>}
            commentsCount={commentsNum}
            toggleInfoPanel={setShowInfoPanel}
            permissions={daoContext?.userPermissions}
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

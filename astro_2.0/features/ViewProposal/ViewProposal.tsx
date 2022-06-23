import React, { FC, useState } from 'react';
import { useToggle } from 'react-use';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  ProposalCard,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';

import { ProposalFeedItem } from 'types/proposal';
import { DraftProposal, Hashtag } from 'types/draftProposal';
import { Token } from 'types/token';

import { useWalletContext } from 'context/WalletContext';
import { getVoteDetails } from 'features/vote-policy/helpers';
import { getProposalScope } from 'utils/getProposalScope';
import {
  getContentNode,
  isSaveTemplateActionAvailable,
} from 'astro_2.0/features/ViewProposal/helpers';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { ProposalComments } from 'astro_2.0/features/ViewProposal/components/ProposalComments';
import { SaveFcTemplate } from 'astro_2.0/features/ViewProposal/components/SaveFcTemplate';

export interface ViewProposalProps {
  proposal: ProposalFeedItem | DraftProposal;
  isDraft?: boolean;
  isEditDraft?: boolean;
  showFlag: boolean;
  tokens: Record<string, Token>;
  preventNavigate?: boolean;
  optionalPostVoteAction?: () => Promise<void>;
  onReplyClick?: () => void;
  onSelect?: (p: string) => void;
  selectedList?: string[];
}

const variants = {
  initial: { opacity: 0, transform: 'translateY(-100px)' },
  visible: { opacity: 1, transform: 'translateY(0px)' },
};

export const ViewProposal: FC<ViewProposalProps> = ({
  isDraft,
  isEditDraft,
  proposal,
  showFlag,
  tokens,
  preventNavigate,
  optionalPostVoteAction,
  onReplyClick,
  onSelect,
  selectedList,
}) => {
  const methods = useForm<{
    title: string;
    hashtags: Hashtag[];
    description: string;
  }>({
    defaultValues: {
      title: 'title' in proposal ? proposal?.title : undefined,
      hashtags: 'hashtags' in proposal ? proposal?.hashtags : undefined,
      description:
        'description' in proposal ? proposal?.description : undefined,
    },
    mode: 'onSubmit',
    resolver: yupResolver(
      yup.object().shape({
        description: yup.string().required('Required'),
        hashtags: yup.array().min(1, 'Required'),
        title: yup.string().required('Required'),
      })
    ),
  });

  const { accountId } = useWalletContext();
  const [showInfoPanel, toggleInfoPanel] = useToggle(false);
  const [commentsCount, setCommentsCount] = useState(proposal?.commentsCount);
  const isCouncilUser = proposal?.permissions?.isCouncil ?? false;
  const showOptionalControl = isSaveTemplateActionAvailable(
    proposal,
    accountId
  );

  if (!proposal || !proposal.dao) {
    return null;
  }

  const contentNode = getContentNode(proposal);

  const { canApprove, canReject } = proposal.permissions;
  const voted =
    proposal.votes[accountId] === 'Yes' ||
    proposal.votes[accountId] === 'No' ||
    proposal.votes[accountId] === 'Dismiss' ||
    (proposal.status && proposal.status !== 'InProgress');

  return (
    <FormProvider {...methods}>
      <ProposalCardRenderer
        nonActionable={
          selectedList &&
          selectedList?.length > 0 &&
          (voted || !canApprove || !canReject)
        }
        isDraft={isDraft}
        isEditDraft={isEditDraft}
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
            onReplyClick={onReplyClick}
            title={'title' in proposal ? proposal?.title : undefined}
            hashtags={'hashtags' in proposal ? proposal?.hashtags : undefined}
            comments={'comments' in proposal ? proposal?.comments : undefined}
            bookmarks={'comments' in proposal ? proposal?.bookmarks : undefined}
            history={'history' in proposal ? proposal?.history : undefined}
            isDraft={isDraft}
            isEditDraft={isEditDraft}
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
            optionalPostVoteAction={optionalPostVoteAction}
            onSelect={onSelect}
            selectedList={selectedList}
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
    </FormProvider>
  );
};

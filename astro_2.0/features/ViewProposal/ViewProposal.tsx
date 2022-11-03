import React, { FC, useCallback, useState } from 'react';
import { useMount, useToggle } from 'react-use';
import { AnimatePresence, motion } from 'framer-motion';

import {
  ProposalCard,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import ErrorBoundary from 'astro_2.0/components/ErrorBoundary';

import { ProposalFeedItem } from 'types/proposal';
import { DraftProposal } from 'types/draftProposal';

import { useWalletContext } from 'context/WalletContext';
import { getVoteDetails } from 'features/vote-policy/helpers';
import {
  getContentNode,
  getInitialFormValuesFromDraft,
  getProposalPermissions,
  getProposalUpdatedDate,
  isSaveTemplateActionAvailable,
} from 'astro_2.0/features/ViewProposal/helpers';

import { VOTE_ACTION_SOURCE_PAGE } from 'constants/votingConstants';

import { ProposalComments } from 'astro_2.0/features/ViewProposal/components/ProposalComments';
import { SaveFcTemplate } from 'astro_2.0/features/ViewProposal/components/SaveFcTemplate';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { DAO } from 'types/dao';
import { UserPermissions } from 'types/context';
import { useAllCustomTokens } from 'context/AllTokensContext';

import styles from './ViewProposal.module.scss';

export interface ViewProposalProps {
  proposal: ProposalFeedItem | DraftProposal;
  isDraft?: boolean;
  isEditDraft?: boolean;
  showFlag: boolean;
  preventNavigate?: boolean;
  optionalPostVoteAction?: () => Promise<void>;
  onSelect?: (p: string) => void;
  selectedList?: string[];
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  dao?: DAO;
  userPermissions?: UserPermissions;
}

const variants = {
  initial: { opacity: 0, transform: 'translateY(-100px)' },
  visible: { opacity: 1, transform: 'translateY(0px)' },
};

export const ViewProposal: FC<ViewProposalProps> = ({
  isDraft,
  proposal,
  showFlag,
  preventNavigate,
  optionalPostVoteAction,
  onSelect,
  selectedList,
  toggleCreateProposal,
  dao,
  userPermissions,
}) => {
  const { tokens } = useAllCustomTokens();
  const { accountId } = useWalletContext();
  const [showInfoPanel, toggleInfoPanel] = useToggle(false);
  const [commentsCount, setCommentsCount] = useState(proposal?.commentsCount);
  const showOptionalControl = isSaveTemplateActionAvailable(
    proposal,
    accountId
  );

  useMount(() => {
    if (localStorage.getItem(VOTE_ACTION_SOURCE_PAGE)) {
      localStorage.setItem(VOTE_ACTION_SOURCE_PAGE, '');
    }
  });

  const handleToggleCreateProposal = useCallback(async () => {
    if (toggleCreateProposal) {
      const initialValues = await getInitialFormValuesFromDraft(
        proposal.proposalVariant,
        proposal as Record<string, unknown>,
        tokens,
        accountId
      );

      toggleCreateProposal({
        dao,
        userPermissions,
        daoTokens: tokens,
        proposalVariant: proposal.proposalVariant,
        initialValues,
      });
    }
  }, [accountId, dao, proposal, toggleCreateProposal, tokens, userPermissions]);

  if (!proposal || !proposal.dao) {
    return null;
  }

  const contentNode = getContentNode(proposal);

  const permissions = getProposalPermissions(proposal, accountId);

  const voted =
    proposal.votes &&
    (proposal.votes[accountId] === 'Yes' ||
      proposal.votes[accountId] === 'No' ||
      proposal.votes[accountId] === 'Dismiss' ||
      (proposal.status && proposal.status !== 'InProgress') ||
      (proposal.voteStatus && proposal.voteStatus !== 'Active'));

  const isClosedDraft = 'state' in proposal && proposal?.state === 'closed';

  return (
    <ProposalCardRenderer
      nonActionable={
        selectedList &&
        selectedList?.length > 0 &&
        (voted || !permissions.canApprove || !permissions.canReject)
      }
      isDraft={isDraft}
      proposal={proposal}
      daoFlagNode={
        showFlag && (
          <DaoFlagWidget
            daoName={proposal.daoDetails.displayName || proposal.dao.name}
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
          className={isClosedDraft ? styles.closedDraft : ''}
          backgroundClassName={
            isClosedDraft ? styles.letterHeaderBackgroundClosedDraft : ''
          }
          type={proposal.kind.type}
          coverUrl={proposal.dao.flagCover}
        />
      }
      proposalCardNode={
        <ProposalCard
          convertToProposal={handleToggleCreateProposal}
          title={'title' in proposal ? proposal?.title : undefined}
          history={
            'history' in proposal ? [...proposal?.history, proposal] : undefined
          }
          isSaved={'isSaved' in proposal ? proposal?.isSaved : undefined}
          saves={'isSaved' in proposal ? proposal?.saves : undefined}
          draftState={'state' in proposal ? proposal?.state : undefined}
          isDraft={isDraft}
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
          dao={dao}
          permissions={permissions}
          likes={proposal.voteYes}
          dislikes={proposal.voteNo}
          voteRemove={proposal.voteRemove}
          liked={proposal.votes[accountId] === 'Yes'}
          disliked={proposal.votes[accountId] === 'No'}
          dismissed={proposal.votes[accountId] === 'Dismiss'}
          updatedAt={getProposalUpdatedDate(proposal)}
          toggleInfoPanel={toggleInfoPanel}
          commentsCount={commentsCount}
          optionalPostVoteAction={optionalPostVoteAction}
          onSelect={onSelect}
          selectedList={selectedList}
          userPermissions={userPermissions}
          voteDetails={
            proposal.dao.policy.defaultVotePolicy?.ratio
              ? getVoteDetails(
                  proposal.dao.numberOfMembers,
                  proposal.dao.policy.defaultVotePolicy,
                  proposal
                ).details
              : undefined
          }
          content={<ErrorBoundary>{contentNode}</ErrorBoundary>}
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
                isCouncilUser={permissions.isCouncil}
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

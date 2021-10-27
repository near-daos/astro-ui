import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  AddMemberToGroup,
  FunctionCall,
  RemoveMemberFromGroup,
  RequestPayout,
  TextWithLink,
} from 'components/cards/proposal-card/components/proposal-content/proposal-content';
import { ProposedChangesRenderer } from 'components/cards/expanded-proposal-card/components/proposed-changes-renderer';
import { ProposalCard } from 'components/cards/proposal-card/ProposalCard';
import { Proposal, ProposalType } from 'types/proposal';
import { SputnikNearService } from 'services/sputnik';
import { useAuthContext } from 'context/AuthContext';
import { SputnikWalletError } from 'errors/SputnikWalletError';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

interface ProposalCardRendererProps {
  proposal: Proposal;
  showExpanded?: boolean;
}

const ProposalCardRendererComponent: FC<ProposalCardRendererProps> = ({
  proposal,
  showExpanded,
}) => {
  const router = useRouter();
  const { accountId } = useAuthContext();
  let content;
  const handleVote = useCallback(
    async e => {
      if (e) {
        e.stopPropagation();
      }

      try {
        await SputnikNearService.vote(
          proposal.daoId,
          proposal.proposalId,
          'VoteApprove'
        );

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds.`,
          lifetime: 20000,
        });

        await router.replace(router.asPath);
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    [proposal.daoId, proposal.proposalId, router]
  );

  const handleUnvote = useCallback(
    async e => {
      if (e) {
        e.stopPropagation();
      }

      try {
        await SputnikNearService.vote(
          proposal.daoId,
          proposal.proposalId,
          'VoteReject'
        );

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds.`,
          lifetime: 20000,
        });

        await router.replace(router.asPath);
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    [proposal.daoId, proposal.proposalId, router]
  );

  const handleRemove = useCallback(
    async e => {
      if (e) {
        e.stopPropagation();
      }

      try {
        await SputnikNearService.vote(
          proposal.daoId,
          proposal.proposalId,
          'VoteRemove'
        );

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds.`,
          lifetime: 20000,
        });

        await router.replace(router.asPath);
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    [proposal.daoId, proposal.proposalId, router]
  );

  switch (proposal.kind.type) {
    case ProposalType.AddMemberToRole: {
      content = (
        <AddMemberToGroup
          name={proposal.kind.memberId}
          groupName={proposal.kind.role}
          link={proposal.link}
        />
      );
      break;
    }
    case ProposalType.RemoveMemberFromRole: {
      content = (
        <RemoveMemberFromGroup
          name={proposal.kind.memberId}
          groupName={proposal.kind.role}
          link={proposal.link}
        />
      );
      break;
    }
    case ProposalType.Transfer: {
      content = (
        <RequestPayout
          amount={proposal.kind.amount}
          reason={proposal.description}
          recipient={proposal.kind.receiverId}
          token={proposal.kind.tokenId}
          link={proposal.link}
        />
      );
      break;
    }
    case ProposalType.FunctionCall: {
      content = (
        <FunctionCall
          recipient={proposal.kind.receiverId}
          link={proposal.link}
        />
      );
      break;
    }
    case ProposalType.ChangePolicy: {
      content = (
        <>
          <TextWithLink text={`Change policy: ${proposal.description} `} />
          <ProposedChangesRenderer
            dao={proposal.dao}
            proposal={proposal}
            inline
          />
        </>
      );
      break;
    }
    case ProposalType.Vote:
    case ProposalType.AddBounty:
    default: {
      content = (
        <TextWithLink text={proposal.description} link={proposal.link} />
      );
      break;
    }
  }

  return (
    <ProposalCard
      type={proposal.kind.type}
      status={proposal.status}
      likes={proposal.voteYes}
      dislikes={proposal.voteNo}
      dismisses={proposal.voteRemove}
      id={proposal.id}
      title={proposal.proposer}
      transaction={proposal.txHash}
      liked={proposal.votes[accountId] === 'Yes'}
      disliked={proposal.votes[accountId] === 'No'}
      dismissed={proposal.votes[accountId] === 'Dismiss'}
      onLike={handleVote}
      onDislike={handleUnvote}
      onRemove={handleRemove}
      votePeriodEnd={proposal.votePeriodEnd}
      daoDetails={proposal.daoDetails}
      proposalId={proposal.proposalId}
      daoId={proposal.daoId}
      showExpanded={showExpanded}
      dao={proposal.dao}
    >
      {content}
    </ProposalCard>
  );
};

export const ProposalCardRenderer = React.memo(ProposalCardRendererComponent);

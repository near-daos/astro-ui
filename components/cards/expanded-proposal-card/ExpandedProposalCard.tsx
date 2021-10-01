import { ContentPanel } from 'components/cards/expanded-proposal-card/components/content-panel';

import { StatusPanel } from 'components/cards/expanded-proposal-card/components/status-panel';
import { VotePanel } from 'components/cards/expanded-proposal-card/components/vote-panel';
import { Modal } from 'components/modal';
import { useDao } from 'hooks/useDao';
import { useProposal } from 'hooks/useProposal';
import React, { FC, ReactNode, useCallback } from 'react';

import {
  DaoDetails,
  ProposalType,
  ProposalStatus,
  ProposalVotingPermissions
} from 'types/proposal';

import styles from './expanded-proposal-card.module.scss';

export interface ExpandedProposalCardProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  status: ProposalStatus;
  type: ProposalType;
  title: string;
  name: string;
  text: string;
  link: string;
  linkTitle: string;
  children: ReactNode;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  onLike: () => void;
  onDislike: () => void;
  onRemove: () => void;
  endsAt: string;
  dismisses: number;
  dismissed: boolean;
  daoDetails: DaoDetails;
  proposalId: number;
  daoId: string;
  permissions: ProposalVotingPermissions;
  id: string;
}

export const ExpandedProposalCard: FC<ExpandedProposalCardProps> = ({
  isOpen,
  onClose,
  status,
  type,
  title,
  name,
  text,
  link,
  linkTitle,
  children,
  likes,
  dislikes,
  liked,
  disliked,
  onLike,
  onDislike,
  onRemove,
  endsAt,
  dismisses,
  dismissed,
  daoDetails,
  proposalId,
  daoId,
  permissions,
  id
}) => {
  const handleVote = useCallback(
    d => {
      switch (d.vote) {
        case 'yes': {
          onLike();
          break;
        }
        case 'no': {
          onDislike();
          break;
        }
        default: {
          onRemove();
          break;
        }
      }
    },
    [onDislike, onLike, onRemove]
  );

  const proposalData = useProposal(daoId, proposalId);
  const daoData = useDao(daoId);
  const voted = liked || disliked || dismissed || status !== 'InProgress';

  return (
    <Modal
      size={type === ProposalType.ChangePolicy ? 'xxl' : 'sm'}
      isOpen={isOpen}
      onClose={onClose}
      className={styles.root}
      hideCloseIcon
    >
      <StatusPanel
        status={status}
        type={type}
        endsAt={endsAt}
        onClose={onClose}
      />
      <VotePanel
        onSubmit={handleVote}
        disabled={voted}
        permissions={permissions}
      />
      <ContentPanel
        id={id}
        title={title}
        name={name}
        text={text}
        link={link}
        linkTitle={linkTitle}
        likes={likes}
        liked={liked}
        dislikes={dislikes}
        disliked={disliked}
        onLike={onLike}
        onDislike={onDislike}
        dismisses={dismisses}
        dismissed={dismissed}
        daoDetails={daoDetails}
        type={type}
        proposalId={proposalId}
        permissions={permissions}
        daoData={type === ProposalType.ChangePolicy ? daoData : null}
        proposalData={type === ProposalType.ChangePolicy ? proposalData : null}
      >
        {children}
      </ContentPanel>
    </Modal>
  );
};

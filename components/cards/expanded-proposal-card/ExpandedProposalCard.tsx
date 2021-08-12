import React, { FC, ReactNode, useCallback } from 'react';
import { Modal } from 'components/modal';

import { StatusPanel } from 'components/cards/expanded-proposal-card/components/status-panel';
import { VotePanel } from 'components/cards/expanded-proposal-card/components/vote-panel';
import { ContentPanel } from 'components/cards/expanded-proposal-card/components/content-panel';

import {
  ProposalStatus,
  ProposalType
} from 'components/cards/proposal-card/types';

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
  endsAt: string;
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
  endsAt
}) => {
  const handleVote = useCallback(
    d => {
      onClose('voted', d);
    },
    [onClose]
  );

  return (
    <Modal
      size="sm"
      isOpen={isOpen}
      onClose={onClose}
      className={styles.root}
      hideCloseIcon
    >
      <StatusPanel status={status} type={type} endsAt={endsAt} />
      <VotePanel onSubmit={handleVote} />
      <ContentPanel
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
      >
        {children}
      </ContentPanel>
    </Modal>
  );
};

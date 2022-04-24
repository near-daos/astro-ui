import React, { FC, ReactNode } from 'react';

import { Token } from 'components/cards/member-card/types';

import { Modal } from 'components/modal';
import MemberCard from 'components/cards/member-card/MemberCard';

export interface MemberCardPopupProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  votes: number;
  tokens: Token;
}

export const MemberCardPopup: FC<MemberCardPopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  votes,
  tokens,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <MemberCard title={title} votes={votes} tokens={tokens} expandedView>
        {children}
      </MemberCard>
    </Modal>
  );
};

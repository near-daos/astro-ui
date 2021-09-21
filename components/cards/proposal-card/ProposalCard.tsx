import React, { FC, ReactNode, useCallback } from 'react';
import cn from 'classnames';

// import { Icon } from 'components/Icon';
import { ProposalVariant } from 'components/cards/proposal-card/types';
import { DaoDetails, ProposalStatus, ProposalType } from 'types/proposal';
import ProposalStatusPanel from 'components/cards/proposal-card/components/proposal-status-panel/ProposalStatusPanel';
import ProposalControlPanel from 'components/cards/proposal-card/components/proposal-control-panel/ProposalControlPanel';

import { useModal } from 'components/modal';
import { ExpandedProposalCard } from 'components/cards/expanded-proposal-card';

import styles from './proposal-card.module.scss';

export interface ProposalCardProps {
  id: string;
  type: ProposalType;
  status: ProposalStatus;
  title: string;
  children: ReactNode;
  likes: number;
  dislikes: number;
  dismisses: number;
  liked: boolean;
  disliked: boolean;
  dismissed: boolean;
  variant?: ProposalVariant;
  onLike?: (e?: Partial<Event>) => void;
  onDislike?: (e?: Partial<Event>) => void;
  onRemove?: (e?: Partial<Event>) => void;
  votePeriodEnd: string;
  daoDetails: DaoDetails;
  proposalId: number;
  daoId: string;
}

export const ProposalCard: FC<ProposalCardProps> = ({
  status,
  type,
  title,
  children,
  likes,
  dislikes,
  liked,
  disliked,
  dismisses,
  dismissed,
  onLike,
  onDislike,
  onRemove,
  variant = 'Default',
  votePeriodEnd,
  daoDetails,
  proposalId,
  daoId
}) => {
  const variantClassName = cn({
    [styles.default]: variant === 'Default',
    [styles.collapsed]: variant === 'SuperCollapsed'
  });

  const [showModal] = useModal(ExpandedProposalCard, {
    status,
    type,
    title,
    children,
    likes,
    dislikes,
    liked,
    disliked,
    onLike,
    onDislike,
    onRemove,
    endsAt: votePeriodEnd,
    dismisses,
    dismissed,
    daoDetails,
    proposalId,
    daoId
  });

  const handleCardClick = useCallback(async () => {
    await showModal();
  }, [showModal]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={styles.root} onClick={handleCardClick}>
      <ProposalStatusPanel status={status} type={type} />
      <div className={styles.content}>
        {variant !== 'SuperCollapsed' && (
          <div className={styles.header}>
            <span className={cn('body1', styles.title)}>{title}</span>
            <span>
              {/* <Icon name="buttonBookmark" className={styles.icon} /> */}
            </span>
          </div>
        )}
        <div className={cn(styles.body, variantClassName)}>{children}</div>
        <div className={styles.footer}>
          <span>
            <ProposalControlPanel
              onLike={onLike}
              onDislike={onDislike}
              onRemove={onRemove}
              likes={likes}
              liked={liked}
              dislikes={dislikes}
              disliked={disliked}
              dismisses={dismisses}
              dismissed={dismissed}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

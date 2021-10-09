import cn from 'classnames';
import React, { FC, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuthContext } from 'context/AuthContext';

import { ProposalVariant } from 'components/cards/proposal-card/types';
import { DaoDetails, ProposalStatus, ProposalType } from 'types/proposal';
import ProposalStatusPanel from 'components/cards/proposal-card/components/proposal-status-panel/ProposalStatusPanel';
import ProposalControlPanel from 'components/cards/proposal-card/components/proposal-control-panel/ProposalControlPanel';

import { useModal } from 'components/modal';
import {
  ExpandedProposalCard,
  ExpandedProposalCardProps
} from 'components/cards/expanded-proposal-card';

import { useGetVotePermissions } from './hooks/useGetVotePermissions';

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
  showExpanded?: boolean;
}

const ProposalCardComponent: FC<ProposalCardProps> = ({
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
  daoId,
  showExpanded,
  id
}) => {
  const { accountId } = useAuthContext();

  const permissions = useGetVotePermissions(daoId, type, accountId);

  const variantClassName = cn({
    [styles.default]: variant === 'Default',
    [styles.collapsed]: variant === 'SuperCollapsed'
  });

  const [showModal] = useModal<ExpandedProposalCardProps>(
    ExpandedProposalCard,
    {
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
      daoId,
      permissions,
      id
    }
  );
  const router = useRouter();

  const handleCardClick = useCallback(async () => {
    await showModal({ id });
  }, [id, showModal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showExpanded) {
        handleCardClick();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [handleCardClick, router, showExpanded]);

  const statusClassName = cn({
    [styles.inProgress]: status === 'InProgress',
    [styles.approved]: status === 'Approved',
    [styles.rejected]: status === 'Rejected',
    [styles.expired]: status === 'Expired',
    [styles.removed]: status === 'Removed'
  });

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={cn(styles.root, statusClassName)} onClick={handleCardClick}>
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
              status={status}
              onLike={onLike}
              onDislike={onDislike}
              onRemove={onRemove}
              likes={likes}
              liked={liked}
              dislikes={dislikes}
              disliked={disliked}
              dismisses={dismisses}
              dismissed={dismissed}
              permissions={permissions}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export const ProposalCard = React.memo(ProposalCardComponent);

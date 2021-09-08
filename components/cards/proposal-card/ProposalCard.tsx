import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import {
  ProposalStatus,
  ProposalType,
  ProposalVariant
} from 'components/cards/proposal-card/types';
import ProposalStatusPanel from 'components/cards/proposal-card/components/proposal-status-panel/ProposalStatusPanel';
import ProposalControlPanel from 'components/cards/proposal-card/components/proposal-control-panel/ProposalControlPanel';

import styles from './proposal-card.module.scss';

export interface ProposalCardProps {
  id: string;
  type: ProposalType;
  status: ProposalStatus;
  title: string;
  children: ReactNode;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  variant?: ProposalVariant;
  onLike: () => void;
  onDislike: () => void;
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
  onLike,
  onDislike,
  variant = 'Default'
}) => {
  const variantClassName = cn({
    [styles.default]: variant === 'Default',
    [styles.collapsed]: variant === 'SuperCollapsed'
  });

  return (
    <div className={styles.root}>
      <ProposalStatusPanel status={status} type={type} variant={variant} />
      <div className={styles.content}>
        {variant !== 'SuperCollapsed' && (
          <div className={styles.header}>
            <span className={cn('body1', styles.title)}>{title}</span>
            <span>
              <Icon name="buttonBookmark" className={styles.icon} />
            </span>
          </div>
        )}
        <div className={cn(styles.body, variantClassName)}>{children}</div>
        <div className={styles.footer}>
          <span>
            <ProposalControlPanel
              onLike={onLike}
              onDislike={onDislike}
              likes={likes}
              liked={liked}
              dislikes={dislikes}
              disliked={disliked}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

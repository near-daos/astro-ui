import React, { FC, ReactNode, useCallback } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/button/IconButton';

import styles from './member-card.module.scss';

export type Token = {
  value: number;
  type: string;
  percent: number;
};

export interface MemberCardProps {
  children: ReactNode;
  title: string;
  tokens?: Token;
  votes: number;
  expandedView?: boolean;
  onRemoveClick?: () => void;
  onClick?: ({
    title,
    children,
    votes,
    tokens
  }: {
    title: string;
    children: ReactNode;
    votes: number;
    tokens?: Token;
  }) => void;
}

interface TokensProps {
  data?: Token;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Tokens: FC<TokensProps> = ({ data }) => {
  if (!data) return null;

  const { value, type, percent } = data;

  return (
    <div className={styles.footerItem}>
      <div className={cn(styles.label, 'subtitle4')}>Tokens</div>
      <div className={styles.inline}>
        <span className={cn(styles.value, 'title2')}>
          {value} {type}
        </span>
        <span className={cn(styles.label, 'title4')}>{percent}%</span>
      </div>
    </div>
  );
};

const MemberCard: FC<MemberCardProps> = ({
  title,
  children,
  votes,
  tokens,
  expandedView,
  onClick,
  onRemoveClick
}) => {
  const handleKeyPress = useCallback(
    e => {
      if (e.key === 'Enter' && onClick) {
        onClick({ title, children, votes, tokens });
      }
    },
    [children, onClick, title, tokens, votes]
  );

  return (
    <div
      tabIndex={0}
      role="button"
      onKeyPress={handleKeyPress}
      onClick={() => onClick && onClick({ title, children, votes, tokens })}
      className={cn(styles.root, {
        [styles.expanded]: expandedView,
        [styles.clickable]: !!onClick
      })}
    >
      {!expandedView && onRemoveClick && (
        <div className={styles.personIcon}>
          <IconButton
            icon="proposalRemoveMember"
            onClick={e => {
              e.stopPropagation();

              onRemoveClick();
            }}
          />
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.smile}>
          <svg className={styles.smileStroke}>
            <circle r={20} cx={32} cy={32} />
          </svg>
        </div>
        <div className={cn(styles.title, 'title1')}>{title}</div>
        <div className={styles.tags}>{children}</div>
      </div>

      <div className={styles.footer}>
        {/* <Tokens data={tokens} /> */}
        <div className={styles.footerItem}>
          <span className={cn(styles.label, 'subtitle4')}>Votes casted</span>
          <div className={styles.inline}>
            <span className={cn(styles.value, 'title2')}>{votes || '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;

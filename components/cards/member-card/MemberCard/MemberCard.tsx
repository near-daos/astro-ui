import cn from 'classnames';
import TextTruncate from 'react-text-truncate';
import React, { FC, ReactNode, useCallback } from 'react';

import { Token } from 'components/cards/member-card/types';

import { Icon } from 'components/Icon';
import { ExplorerLink } from 'components/ExplorerLink';

// import { Tokens } from './components/Tokens';
import { SmileSvg } from './components/SmileSvg';

import styles from './MemberCard.module.scss';

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
    tokens,
  }: {
    title: string;
    children: ReactNode;
    votes: number;
    tokens?: Token;
  }) => void;
}

const MemberCard: FC<MemberCardProps> = ({
  title,
  children,
  votes,
  tokens,
  expandedView,
  onClick,
  onRemoveClick,
}) => {
  const onCardClick = useCallback(() => {
    if (onClick) {
      onClick({ title, children, votes, tokens });
    }
  }, [title, children, votes, tokens, onClick]);

  const handleKeyPress = useCallback(
    e => {
      if (e.key === 'Enter') {
        onCardClick();
      }
    },
    [onCardClick]
  );

  const onRemoveButton = useCallback(
    e => {
      e.stopPropagation();

      if (onRemoveClick) {
        onRemoveClick();
      }
    },
    [onRemoveClick]
  );

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onCardClick}
      onKeyPress={handleKeyPress}
      className={cn(styles.root, {
        [styles.expanded]: expandedView,
        [styles.clickable]: !!onClick,
      })}
    >
      <ExplorerLink linkData={title} linkType="member" isAbsolute />
      <div className={styles.body}>
        <SmileSvg />
        <div className={cn(styles.title, 'title2')}>
          <TextTruncate
            line={expandedView ? 10 : 2}
            element="span"
            truncateText="…"
            text={title ?? ''}
            textTruncateChild={null}
          />
        </div>
      </div>
      <div className={styles.tags}>{children}</div>
      <div className={styles.votes}>
        {/* <Tokens data={tokens} /> */}
        <div className={styles.footerItem}>
          <span className={cn(styles.label, 'subtitle4')}>Votes casted</span>
          <div className={styles.inline}>
            <span className={cn(styles.value, 'title2')}>{votes || '0'}</span>
          </div>
        </div>
      </div>
      {!expandedView && onRemoveClick && (
        <button
          type="button"
          onClick={onRemoveButton}
          className={styles.cardFooter}
        >
          <div className={styles.personIcon}>
            <Icon name="proposalRemoveMember" width={16} />
          </div>
        </button>
      )}
    </div>
  );
};

export default MemberCard;

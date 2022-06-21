import React, { FC, useCallback } from 'react';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useRouter } from 'next/router';

import { Badge } from 'components/Badge';
import { Icon } from 'components/Icon';

import { DRAFT_PAGE_URL } from 'constants/routing';

import styles from './DraftCard.module.scss';

interface Props {
  data: DraftProposalFeedItem;
  daoId: string;
}

export const DraftCardContent: FC<Props> = ({ data, daoId }) => {
  const router = useRouter();
  const { id, title, views, replies, updatedAt, hashtags } = data;

  const handleCardClick = useCallback(() => {
    if (id && router.pathname !== DRAFT_PAGE_URL) {
      router.push({
        pathname: DRAFT_PAGE_URL,
        query: {
          dao: daoId,
          draft: id,
        },
      });
    }
  }, [daoId, id, router]);

  return (
    <div
      tabIndex={0}
      role="button"
      className={styles.content}
      onMouseDown={handleCardClick}
    >
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.views}>
          <Icon name="eyeOpen" className={styles.icon} />
          {views}
        </div>
        <div className={styles.replies}>
          <Icon name="chat" className={styles.icon} />
          {replies}
        </div>
        <div className={styles.updated}>
          {formatDistanceToNow(parseISO(updatedAt))} ago
        </div>
      </div>
      <div className={styles.footer}>
        {hashtags?.map(tag => (
          <Badge
            key={tag}
            size="small"
            className={styles.tag}
            variant="lightgray"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

import React, { FC, useCallback } from 'react';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import { Badge } from 'components/Badge';
import { Icon } from 'components/Icon';

import { DRAFT_PAGE_URL } from 'constants/routing';

import { useDraftsPageActions } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/hooks';

import styles from './DraftCard.module.scss';

interface Props {
  data: DraftProposalFeedItem;
  daoId: string;
}

export const DraftCardContent: FC<Props> = ({ data, daoId }) => {
  const router = useRouter();
  const { id, title, views, replies, updatedAt, hashtags } = data;

  const { handleView } = useDraftsPageActions();

  const handleCardClick = useCallback(async () => {
    if (id && router.pathname !== DRAFT_PAGE_URL) {
      await handleView(id);

      await router.push({
        pathname: DRAFT_PAGE_URL,
        query: {
          dao: daoId,
          draft: id,
        },
      });
    }
  }, [daoId, handleView, id, router]);

  const renderDraftTitle = () => {
    if (data.state === 'open') {
      return <div className={styles.title}>{title}</div>;
    }

    return (
      <Tooltip
        className={styles.title}
        overlay={<>Converted to proposal</>}
        placement="top-start"
        arrowClassName={styles.tooltipArrow}
      >
        <Icon
          name="convertedProposal"
          className={styles.convertedProposalIcon}
        />
        <span>{title}</span>
      </Tooltip>
    );
  };

  return (
    <div
      tabIndex={0}
      role="button"
      className={styles.content}
      onMouseDown={handleCardClick}
    >
      {renderDraftTitle()}
      <div className={styles.views}>
        <Icon name="eyeOpen" className={styles.icon} />
        {views}
      </div>
      <div className={styles.replies}>
        <Icon name="chat" className={styles.icon} />
        {replies}
      </div>

      <div className={styles.date}>
        {formatDistanceToNow(parseISO(updatedAt))} ago
      </div>
      <div className={styles.tags}>
        {hashtags?.map(tag => (
          <Badge key={tag} size="small" className={styles.tag}>
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

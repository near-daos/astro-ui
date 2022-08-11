import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { DraftProposalFeedItem, DraftStatus } from 'types/draftProposal';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { Icon } from 'components/Icon';

import { DRAFT_PAGE_URL, SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { useDraftsPageActions } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/hooks';

import styles from './DraftCard.module.scss';

interface Props {
  data: DraftProposalFeedItem;
  daoId: string;
}

export const DraftCardContent: FC<Props> = ({ data, daoId }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    id,
    title,
    views,
    replies,
    updatedAt,
    state,
    proposalId,
    isSaved,
  } = data;

  const isOpenStatus = DraftStatus.Open === state;
  const isClosedStatus = DraftStatus.Closed === state;

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
    if (isOpenStatus) {
      return <div className={styles.title}>{title}</div>;
    }

    return (
      <>
        <div className={styles.title}>{title}</div>
        <Tooltip overlay={<>Link converted proposal</>}>
          <Link
            passHref
            href={{
              pathname: SINGLE_PROPOSAL_PAGE_URL,
              query: {
                dao: daoId,
                proposal: `${daoId}-${proposalId}`,
              },
            }}
          >
            <a className={styles.linkToProposal}>
              <Icon name="buttonLink" className={styles.linkToProposalIcon} />
            </a>
          </Link>
        </Tooltip>
      </>
    );
  };

  return (
    <div
      tabIndex={0}
      role="button"
      className={styles.content}
      onMouseDown={handleCardClick}
    >
      <div className={styles.inputWrapper}>{renderDraftTitle()}</div>
      <div className={styles.views}>
        <Icon name="draftEye" className={styles.icon} />
        {views}
      </div>
      <div className={styles.replies}>
        <Icon name="draftChat" className={styles.icon} />
        {replies}
      </div>
      <div className={styles.date}>
        <span className={styles.activityText}>Last activity:</span>{' '}
        <span className={styles.dateText}>
          {formatDistanceToNow(parseISO(updatedAt))}{' '}
          {t('drafts.feed.card.minutesAgo')}
        </span>
      </div>
      <div
        className={cn(styles.status, {
          [styles.openStatus]: isOpenStatus,
          [styles.closedStatus]: isClosedStatus,
        })}
      >
        {isOpenStatus
          ? t('drafts.feed.card.onDiscussionStatus')
          : t('drafts.feed.card.convertedToProposalStatus')}
      </div>
      <div className={styles.saveFlag}>
        <Icon
          name={isSaved ? 'draftBookmarkFulfill' : 'draftBookmark'}
          className={styles.icon}
        />
      </div>
    </div>
  );
};

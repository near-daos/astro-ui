import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

import { ActionButton } from 'features/proposal/components/action-button';
import { ConfirmCommentActionModal } from 'astro_2.0/features/ViewProposal/components/ProposalComments/components/ConfirmCommentActionModal';

import { ReportCommentsInput } from 'types/proposal';

import { useModal } from 'components/modal';

import styles from './Comment.module.scss';

interface CommentProps {
  isMyComment: boolean;
  accountId: string;
  message: string;
  isCouncilUser: boolean;
  isReported: boolean;
  reportsCount: number;
  createdAt: string;
  onReport: (params: ReportCommentsInput) => void;
  onDelete: (commentId: number, reason: string) => void;
  commentId: number;
}

const TICK_RIGHT = (
  <svg
    className={cn(styles.tickMark, styles.tickRight)}
    width="12"
    height="12"
    viewBox="0 0 10 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.00034 0C1.00034 0 6.73828 0 8.20033 0C9.66239 0 10.0003 1.5 8.65031 3C7.30031 4.5 1.4997 9.5 1.00034 11C0.500977 12.5 1.00034 0 1.00034 0Z"
      fill="#F0F0F0"
    />
  </svg>
);

const TICK_LEFT = (
  <svg
    className={cn(styles.tickMark, styles.tickLeft)}
    width="12"
    height="12"
    viewBox="0 0 10 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.99966 0C8.99966 0 3.26172 0 1.79967 0C0.337614 0 -0.000304222 1.5 1.34969 3C2.69969 4.5 8.5003 9.5 8.99966 11C9.49902 12.5 8.99966 0 8.99966 0Z"
      fill="#f5f5f5"
    />
  </svg>
);

const REASON_OPTIONS = [
  {
    value: 'Language',
    label: 'Language',
  },
  {
    value: 'Offensive behaviour',
    label: 'Offensive behaviour',
  },
  {
    value: 'Spam',
    label: 'Spam',
  },
  {
    value: 'Fraud',
    label: 'Fraud',
  },
];

export const Comment: FC<CommentProps> = ({
  isMyComment,
  accountId,
  message,
  isCouncilUser,
  isReported,
  reportsCount,
  createdAt,
  onReport,
  onDelete,
  commentId,
}) => {
  const { t } = useTranslation();
  const [showReportModal] = useModal(ConfirmCommentActionModal);

  const handleReportAction = useCallback(async () => {
    const res = await showReportModal({
      title: 'Report on',
      text:
        'Choose the reason for deleting the message ( 4 votes minimum for deletion)',
      options: REASON_OPTIONS,
    });

    if (res[0]) {
      onReport({ commentId, reason: res[0] as string });
    }
  }, [commentId, onReport, showReportModal]);

  const handleRemoveAction = useCallback(async () => {
    const res = await showReportModal({
      title: 'Delete message',
      text:
        'Are you sure you want to delete the message from the chat? It will be deleted permanently. Choose the reason for deleting the message',
      options: REASON_OPTIONS,
    });

    if (res[0]) {
      onDelete(commentId, res[0] as string);
    }
  }, [commentId, onDelete, showReportModal]);

  function renderReportedMessage() {
    if (!reportsCount) {
      return null;
    }

    return (
      <div className={styles.reportedInfo}>
        {isReported
          ? `${t('comments.youReportedThisMessage')} ${reportsCount}/4`
          : `${t('comments.thisMessageWasReported')} ${reportsCount}/4`}
      </div>
    );
  }

  return (
    <motion.li
      key={commentId}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(styles.root, {
        [styles.myComment]: isMyComment,
      })}
    >
      {isMyComment ? TICK_RIGHT : TICK_LEFT}
      {!isMyComment && <div className={styles.commentAuthor}>{accountId}</div>}
      <p>{message}</p>
      <div className={styles.time}>
        {format(parseISO(createdAt), 'hh:mm a')}
      </div>
      <div
        className={cn(styles.commentControls, {
          [styles.reported]: isReported,
        })}
      >
        {isCouncilUser || isMyComment ? (
          <div className={styles.commentControlButtonWrapper}>
            <ActionButton
              className={styles.commentControlButton}
              tooltipPlacement="top"
              iconClassName={styles.commentControlIcon}
              iconName="buttonDelete"
              onClick={handleRemoveAction}
              tooltip="Remove"
            />
          </div>
        ) : (
          <div className={styles.commentControlButtonWrapper}>
            <ActionButton
              className={styles.commentControlButton}
              tooltipPlacement="top"
              iconClassName={styles.commentControlIcon}
              iconName="commentBlock"
              onClick={handleReportAction}
              tooltip="Report"
            />
          </div>
        )}
        {renderReportedMessage()}
      </div>
    </motion.li>
  );
};

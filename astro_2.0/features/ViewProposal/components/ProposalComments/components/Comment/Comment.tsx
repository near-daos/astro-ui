import React, { FC } from 'react';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';

import { ActionButton } from 'features/proposal/components/action-button';

import styles from './Comment.module.scss';

interface CommentProps {
  isMyComment: boolean;
  accountId: string;
  message: string;
  createdAt: string;
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

export const Comment: FC<CommentProps> = ({
  isMyComment,
  accountId,
  message,
  createdAt,
}) => {
  return (
    <li
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
      <div className={styles.commentControls}>
        <div className={styles.commentControlButtonWrapper}>
          <ActionButton
            className={styles.commentControlButton}
            tooltipPlacement="top"
            iconClassName={styles.commentControlIcon}
            iconName="buttonDelete"
            tooltip="Remove"
          />
        </div>
        <div className={styles.commentControlButtonWrapper}>
          <ActionButton
            className={styles.commentControlButton}
            tooltipPlacement="top"
            iconClassName={styles.commentControlIcon}
            iconName="buttonReport"
            tooltip="Report"
          />
        </div>
      </div>
    </li>
  );
};

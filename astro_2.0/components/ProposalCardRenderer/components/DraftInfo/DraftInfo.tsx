import React, { FC } from 'react';
import cn from 'classnames';

import { ReplyButton } from 'astro_2.0/components/ReplyButton';
import { DraftInfoItem } from './DraftInfoItem';

import styles from './DraftInfo.module.scss';

interface DraftInfoProps {
  className?: string;
  onReply: () => void;
  comments: number;
  bookmarks: number;
}

export const DraftInfo: FC<DraftInfoProps> = ({
  className,
  onReply,
  comments,
  bookmarks,
}) => {
  return (
    <div className={cn(styles.draftInfo, className)}>
      <DraftInfoItem
        iconName="draftComments"
        count={comments}
        className={styles.draftInfoItem}
      />
      <DraftInfoItem
        iconName="draftBookmark"
        count={bookmarks}
        className={styles.draftInfoItem}
      />
      <ReplyButton onClick={onReply} />
    </div>
  );
};

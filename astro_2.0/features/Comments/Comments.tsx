import React, { FC } from 'react';

import { Comment } from 'astro_2.0/features/Comments/components/Comment';

import { DraftComment } from 'services/DraftsService/types';

import styles from './Comments.module.scss';

interface Props {
  data: DraftComment[];
  onLike: (id: string) => Promise<void>;
  onReply: (value: string, replyTo: string) => Promise<void>;
  onEdit: (value: string, id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  canModerate: boolean;
  accountId: string;
}

export const Comments: FC<Props> = ({
  data,
  onLike,
  onReply,
  onEdit,
  onDelete,
  canModerate,
  accountId,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        {data.length} {data.length > 1 ? 'replies' : 'reply'}
      </div>
      <div className={styles.list}>
        {data.map(comment => {
          return (
            <Comment
              key={comment.id}
              data={comment}
              onLike={onLike}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              isEditable={canModerate || comment.author === accountId}
            />
          );
        })}
      </div>
    </div>
  );
};

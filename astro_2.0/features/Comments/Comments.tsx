import React, { FC } from 'react';

import { Comment } from 'astro_2.0/features/Comments/components/Comment';
import { useDraftComments } from 'astro_2.0/features/Comments/hooks';

import styles from './Comments.module.scss';

export const Comments: FC = () => {
  const { data, addComment, likeComment } = useDraftComments();

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
              onLike={likeComment}
              onReply={addComment}
            />
          );
        })}
      </div>
    </div>
  );
};

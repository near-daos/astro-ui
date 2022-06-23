import React, { FC } from 'react';
import cn from 'classnames';

import { Comments } from 'astro_2.0/features/Comments';
import { NewComment } from 'astro_2.0/features/DraftComments/components/NewComment';
import { Loader } from 'components/loader';

import { useDraftComments } from 'astro_2.0/features/Comments/hooks';

import styles from './DraftComments.module.scss';

type DraftCommentsProps = {
  className?: string;
};

export const DraftComments: FC<DraftCommentsProps> = ({ className }) => {
  const { data, addComment, likeComment, loading } = useDraftComments();

  return (
    <div className={cn(styles.root, className)}>
      <NewComment onSubmit={addComment} />
      {loading ? (
        <Loader />
      ) : (
        <Comments data={data} onLike={likeComment} onReply={addComment} />
      )}
    </div>
  );
};

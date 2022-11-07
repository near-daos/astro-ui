import React, { FC } from 'react';
import cn from 'classnames';

import { Comments } from 'astro_2.0/features/Comments';
import { NewComment } from 'astro_2.0/features/DraftComments/components/NewComment';

import { useDraftComments } from 'astro_2.0/features/Comments/hooks';

import { DAO } from 'types/dao';

import { useWalletContext } from 'context/WalletContext';
import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';

import styles from './DraftComments.module.scss';

type DraftCommentsProps = {
  className?: string;
  dao: DAO;
};

export const DraftComments: FC<DraftCommentsProps> = ({ className, dao }) => {
  const {
    countComments,
    data,
    addComment,
    editComment,
    deleteComment,
    likeComment,
    dislikeComment,
  } = useDraftComments();
  const { accountId } = useWalletContext();
  const isCouncil = isCouncilUser(dao, accountId);

  return (
    <div className={cn(styles.root, className)}>
      <NewComment onSubmit={addComment} />
      <Comments
        data={data}
        countComments={countComments}
        onDislike={dislikeComment}
        onLike={likeComment}
        onReply={addComment}
        onEdit={editComment}
        onDelete={deleteComment}
        canModerate={isCouncil}
        accountId={accountId}
      />
    </div>
  );
};

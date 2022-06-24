import React, { FC } from 'react';
import cn from 'classnames';

import { Comments } from 'astro_2.0/features/Comments';
import { NewComment } from 'astro_2.0/features/DraftComments/components/NewComment';
import { Loader } from 'components/loader';

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
    data,
    addComment,
    editComment,
    deleteComment,
    likeComment,
    loading,
  } = useDraftComments();
  const { accountId } = useWalletContext();
  const isCouncil = isCouncilUser(dao, accountId);

  return (
    <div className={cn(styles.root, className)}>
      <NewComment onSubmit={addComment} />
      {loading ? (
        <Loader />
      ) : (
        <Comments
          data={data}
          onLike={likeComment}
          onReply={addComment}
          onEdit={editComment}
          onDelete={deleteComment}
          canModerate={isCouncil}
          accountId={accountId}
        />
      )}
    </div>
  );
};

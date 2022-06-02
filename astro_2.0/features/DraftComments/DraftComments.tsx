import React, { FC } from 'react';
import cn from 'classnames';
import { useToggle } from 'react-use';

import { DraftComment } from 'types/draftProposal';

import { Comments } from 'astro_2.0/features/Comments';
import { WriteCommentButton } from './WriteCommentButton';
import { CreateComment } from './CreateComment/CreateComment';

import styles from './DraftComments.module.scss';

type DraftCommentsProps = {
  className?: string;
  comments: DraftComment[];
};

export const DraftComments: FC<DraftCommentsProps> = ({ className }) => {
  const [toggle, setToggle] = useToggle(false);

  return (
    <div className={styles.root}>
      <div className={cn(styles.draftComments, className)}>
        {toggle ? (
          <CreateComment />
        ) : (
          <WriteCommentButton handleClick={() => setToggle()} />
        )}
      </div>
      <Comments />
    </div>
  );
};

import React, { FC } from 'react';
import cn from 'classnames';

import { format, parseISO } from 'date-fns';

import styles from './CommentContent.module.scss';

interface Props {
  author: string;
  updatedAt: string;
  text: string;
  className?: string;
}

export const CommentContent: FC<Props> = ({
  author,
  updatedAt,
  text,
  className,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.header}>
        <div className={styles.author}>
          <span className={styles.avatar} />
          <span className={styles.primaryLabel}>{author}</span>
        </div>
        <div className={styles.datetime}>
          {format(parseISO(updatedAt as string), 'dd MMMM yyyy, HH:mm')}
        </div>
      </div>
      <p className={styles.body}>{text}</p>
    </div>
  );
};

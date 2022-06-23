import React, { FC } from 'react';
import cn from 'classnames';
import DOMPurify from 'dompurify';
import { formatISODate } from 'utils/format';
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
  const clean = DOMPurify.sanitize(text);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.header}>
        <div className={styles.author}>
          <span className={styles.avatar} />
          <span className={styles.primaryLabel}>{author}</span>
        </div>
        <div className={styles.datetime}>
          {formatISODate(updatedAt, 'dd MMMM yyyy, HH:mm')}
        </div>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <p className={styles.body} dangerouslySetInnerHTML={{ __html: clean }} />
    </div>
  );
};

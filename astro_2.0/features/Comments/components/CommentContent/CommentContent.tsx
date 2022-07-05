import React, { FC } from 'react';
import cn from 'classnames';
import DOMPurify from 'dompurify';

import { Icon } from 'components/Icon';

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
          <span className={styles.avatar}>
            <Icon name="defaultAvatar" className={styles.avatarIcon} />
          </span>
          <span className={styles.primaryLabel}>{author}</span>
        </div>
        <div className={styles.datetime}>
          {formatISODate(updatedAt, 'dd MMMM yyyy, HH:mm')}
        </div>
      </div>
      <p
        className={styles.body}
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </div>
  );
};

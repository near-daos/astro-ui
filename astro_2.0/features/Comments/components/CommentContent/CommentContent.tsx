import React, { FC } from 'react';
import cn from 'classnames';
import DOMPurify from 'dompurify';

import { Icon } from 'components/Icon';

import { formatISODate } from 'utils/format';

import styles from './CommentContent.module.scss';

interface Props {
  author: string;
  updatedAt?: string;
  createdAt: string;
  text: string;
  className?: string;
}

export const CommentContent: FC<Props> = ({
  author,
  createdAt,
  text,
  className,
}) => {
  const clean = DOMPurify.sanitize(text);

  const renderDateTime = () => {
    return formatISODate(createdAt, 'dd MMMM yyyy, HH:mm');
  };

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.header}>
        <div className={styles.author}>
          <span className={styles.avatar}>
            <Icon name="defaultAvatar" className={styles.avatarIcon} />
          </span>
          <span className={styles.primaryLabel}>{author}</span>
        </div>
        <div className={styles.datetime}>{renderDateTime()}</div>
      </div>
      <p
        className={styles.body}
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </div>
  );
};

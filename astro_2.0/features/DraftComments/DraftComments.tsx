import React, { FC, useState, useEffect } from 'react';
import cn from 'classnames';
import { useToggle } from 'react-use';

import { EditableContent } from 'astro_2.0/components/EditableContent';

import { Comments } from 'astro_2.0/features/Comments';

import styles from './DraftComments.module.scss';

type DraftCommentsProps = {
  className?: string;
  openEditComment?: boolean;
};

export const DraftComments: FC<DraftCommentsProps> = ({
  className,
  openEditComment,
}) => {
  const [toggle, setToggle] = useToggle(false);
  const [html, setHTML] = useState('');

  useEffect(() => {
    if (openEditComment) {
      setToggle();
    }
  }, [setToggle, openEditComment]);

  const send = () => undefined;

  return (
    <div className={styles.root}>
      <div className={cn(styles.draftComments, className)}>
        {toggle ? (
          <EditableContent
            id="head"
            html={html}
            setHTML={setHTML}
            handleSend={send}
          />
        ) : (
          <button
            className={styles.writeCommentButton}
            type="button"
            onClick={() => setToggle()}
          >
            Write a comment...
          </button>
        )}
      </div>
      <Comments />
    </div>
  );
};

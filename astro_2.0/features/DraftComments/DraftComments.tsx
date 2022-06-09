import React, { FC, useState } from 'react';
import cn from 'classnames';
import { useToggle } from 'react-use';
import { nanoid } from 'nanoid';

import { DraftComment, Hashtag } from 'types/draftProposal';
import { EditableContent } from 'astro_2.0/components/EditableContent';

import { Comments } from 'astro_2.0/features/Comments';
import { WriteCommentButton } from './WriteCommentButton';

import styles from './DraftComments.module.scss';

type DraftCommentsProps = {
  className?: string;
  comments: DraftComment[];
};

export const DraftComments: FC<DraftCommentsProps> = ({ className }) => {
  const [toggle, setToggle] = useToggle(false);
  const [html, setHTML] = useState('');
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState<Hashtag[]>([
    { id: nanoid(), value: 'test' },
  ]);

  const send = () => undefined;

  return (
    <div className={styles.root}>
      <div className={cn(styles.draftComments, className)}>
        {toggle ? (
          <EditableContent
            id="head"
            html={html}
            setHTML={setHTML}
            title={title}
            setTitle={setTitle}
            hashtags={hashtags}
            setHashtags={setHashtags}
            handleSend={send}
          />
        ) : (
          <WriteCommentButton handleClick={() => setToggle()} />
        )}
      </div>
      <Comments />
    </div>
  );
};

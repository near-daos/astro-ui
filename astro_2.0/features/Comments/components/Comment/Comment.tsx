import React, { FC, useState } from 'react';

import { DraftComment } from 'types/draftProposal';

import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { CommentContent } from 'astro_2.0/features/Comments/components/CommentContent';
import { EditableContent } from 'astro_2.0/components/EditableContent';

import styles from './Comment.module.scss';

interface Props {
  data: DraftComment;
  onLike: (id: string) => Promise<void>;
  onReply?: (parentId: string, value: string) => Promise<void>;
}

export const Comment: FC<Props> = ({ data, onLike }) => {
  const { author, updatedAt, description, comments, likes, id } = data;
  const [html, setHTML] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div className={styles.root}>
      <CommentContent
        author={author}
        updatedAt={updatedAt}
        text={description}
      />
      <div className={styles.footer}>
        {comments?.length && (
          <div className={styles.replies}>
            <Button
              className={styles.repliesToggle}
              capitalize
              size="small"
              variant="tertiary"
              onClick={() => setShowReplies(!showReplies)}
            >
              {comments?.length} {comments?.length === 1 ? 'reply' : 'replies'}{' '}
              <Icon
                name={showReplies ? 'buttonArrowUp' : 'buttonArrowDown'}
                className={styles.toggleIcon}
              />
            </Button>
          </div>
        )}
        <div className={styles.likes}>
          {likes > 0 ? likes : null}{' '}
          <IconButton
            icon="heart"
            className={styles.likeIcon}
            onClick={() => onLike(id)}
          />
        </div>
        <Button
          capitalize
          className={styles.replyButton}
          size="small"
          variant="tertiary"
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          Reply <Icon name="reply" className={styles.replyIcon} />
        </Button>
      </div>
      {showReplies && comments?.length && (
        <div className={styles.repliesWrapper}>
          {comments?.map(item => (
            <CommentContent
              key={item.id}
              author={item.author}
              updatedAt={item.updatedAt}
              text={item.description}
              className={styles.reply}
            />
          ))}
        </div>
      )}
      {showReplyInput && (
        <div className={styles.replyInputWrapper}>
          <EditableContent
            id={`key-${id}`}
            html={html}
            setHTML={setHTML}
            placeholder="Reply..."
          />
        </div>
      )}
    </div>
  );
};

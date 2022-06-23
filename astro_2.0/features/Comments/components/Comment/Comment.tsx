import React, { FC, useState } from 'react';
import cn from 'classnames';

import { DraftComment } from 'services/DraftsService/types';

import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { CommentContent } from 'astro_2.0/features/Comments/components/CommentContent';
import { EditableContent } from 'astro_2.0/components/EditableContent';
import { ReplyButton } from 'astro_2.0/components/ReplyButton';

import { useWalletContext } from 'context/WalletContext';

import styles from './Comment.module.scss';

interface CommentProps {
  data: DraftComment;
  onLike: (id: string, unlike?: boolean) => Promise<void>;
  onReply: (value: string, replyTo: string) => Promise<void>;
}

export const Comment: FC<CommentProps> = ({ data, onLike, onReply }) => {
  const { author, message, createdAt, replies, likeAccounts, id } = data;

  const [html, setHTML] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const { accountId } = useWalletContext();
  const isLikedByMe = likeAccounts.includes(accountId);

  return (
    <div className={styles.root}>
      <CommentContent author={author} updatedAt={createdAt} text={message} />
      <div className={styles.footer}>
        {!!replies?.length && (
          <div className={styles.replies}>
            <Button
              className={styles.repliesToggle}
              capitalize
              size="small"
              variant="tertiary"
              onClick={() => setShowReplies(!showReplies)}
            >
              {replies?.length} {replies?.length === 1 ? 'reply' : 'replies'}{' '}
              <Icon
                name={showReplies ? 'buttonArrowUp' : 'buttonArrowDown'}
                className={styles.toggleIcon}
              />
            </Button>
          </div>
        )}
        <div className={styles.likes}>
          {likeAccounts.length > 0 ? likeAccounts.length : null}{' '}
          <IconButton
            disabled={!accountId}
            icon={isLikedByMe ? 'heartFilled' : 'heart'}
            className={cn(styles.likeIcon, { [styles.liked]: isLikedByMe })}
            onClick={() => onLike(id, isLikedByMe)}
          />
        </div>
        {accountId && (
          <ReplyButton
            className={styles.replyButton}
            onClick={() => setShowReplyInput(!showReplyInput)}
          />
        )}
      </div>
      {showReplies && !!replies?.length && (
        <div className={styles.repliesWrapper}>
          {replies?.map(item => (
            <CommentContent
              key={item.id}
              author={item.author}
              updatedAt={item.createdAt}
              text={item.message}
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
            handleSend={msg => onReply(msg, id)}
            handleCancel={() => setShowReplyInput(!showReplyInput)}
            placeholder="Reply..."
          />
        </div>
      )}
    </div>
  );
};

import React, { FC, useState, useCallback } from 'react';
import { useTranslation } from 'next-i18next';

import { DraftComment } from 'services/DraftsService/types';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { CommentContent } from 'astro_2.0/features/Comments/components/CommentContent';
import { EditableContent } from 'astro_2.0/components/EditableContent';
import { ReplyButton } from 'astro_2.0/components/ReplyButton';
import { CommentActions } from 'astro_2.0/features/Comments/components/CommentActions';
import { LikeButton } from 'astro_2.0/features/Comments/components/Comment/LikeButton';

import { useWalletContext } from 'context/WalletContext';

import styles from './Comment.module.scss';

export interface CommentProps {
  data: DraftComment;
  onLike: (id: string, isLiked: boolean) => Promise<void>;
  onDislike: (id: string, isDisliked: boolean) => Promise<void>;
  onReply: (value: string, replyTo: string) => Promise<void>;
  onEdit: (value: string, id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isEditable: boolean;
  disabled?: boolean;
}

export const Comment: FC<CommentProps> = ({
  data,
  onLike,
  onDislike,
  onReply,
  onEdit,
  onDelete,
  isEditable,
  disabled,
}) => {
  const {
    author,
    message,
    createdAt,
    updatedAt,
    replies,
    likeAccounts,
    dislikeAccounts = [],
    id,
  } = data;
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [contentHtml, setContentHtml] = useState(message);

  const [html, setHTML] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const { accountId } = useWalletContext();
  const isLikedByMe = likeAccounts.includes(accountId);
  const isDislikedByMe = dislikeAccounts.includes(accountId);

  const handlerReply = useCallback(
    async msg => {
      setHTML(msg);

      await onReply(msg, id);

      setShowReplies(true);
    },
    [id, onReply]
  );

  const handlerEdit = useCallback(
    async msg => {
      setContentHtml(msg);

      await onEdit(msg, id);

      setEdit(false);
    },
    [id, onEdit]
  );

  return (
    <div className={styles.root}>
      <CommentActions
        id={id}
        isEditable={isEditable}
        onEdit={() => {
          setContentHtml(message);
          setEdit(!edit);
        }}
        onDelete={onDelete}
      />
      {edit ? (
        <EditableContent
          id={`key-edit-${id}`}
          html={contentHtml}
          setHTML={setContentHtml}
          handleSend={handlerEdit}
          handleCancel={() => {
            setContentHtml(message);
            setEdit(!edit);
          }}
          placeholder={t('drafts.comments.placeholder')}
        />
      ) : (
        <CommentContent
          author={author}
          updatedAt={updatedAt}
          createdAt={createdAt}
          text={message}
        />
      )}
      <div className={styles.footer}>
        {!!replies?.length && (
          <div className={styles.replies}>
            <Button
              className={styles.repliesToggle}
              capitalize
              size="small"
              variant="tertiary"
              onClick={() => {
                setHTML('');
                setShowReplies(!showReplies);
              }}
            >
              {replies?.length}{' '}
              {replies?.length === 1
                ? t('drafts.comments.reply')
                : t('drafts.comments.replies')}{' '}
              <Icon
                name={showReplies ? 'buttonArrowUp' : 'buttonArrowDown'}
                className={styles.toggleIcon}
              />
            </Button>
          </div>
        )}
        <div className={styles.right}>
          <LikeButton
            disabled={!accountId || Boolean(disabled)}
            onClick={() => onLike(id, isLikedByMe)}
            isActive={isLikedByMe}
            amount={likeAccounts.length}
          />
          <LikeButton
            iconClassName={styles.dislike}
            disabled={!accountId || Boolean(disabled)}
            onClick={() => onDislike(id, isDislikedByMe)}
            isActive={isDislikedByMe}
            amount={dislikeAccounts.length}
          />
          {accountId && (
            <ReplyButton
              title={t('drafts.comments.reply')}
              disabled={disabled}
              className={styles.replyButton}
              onClick={() => setShowReplyInput(!showReplyInput)}
            />
          )}
        </div>
      </div>
      {showReplies && !!replies?.length && (
        <div className={styles.repliesWrapper}>
          {replies?.map(item => (
            <CommentContent
              key={item.id}
              author={item.author}
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
              text={item.message}
              className={styles.reply}
            />
          ))}
        </div>
      )}
      {showReplyInput && !disabled && (
        <div className={styles.replyInputWrapper}>
          <EditableContent
            id={`key-${id}`}
            html={html}
            setHTML={setHTML}
            handleSend={handlerReply}
            handleCancel={() => {
              setHTML('');
              setShowReplyInput(!showReplyInput);
            }}
            placeholder={t('drafts.comments.replyPlaceholder')}
          />
        </div>
      )}
    </div>
  );
};

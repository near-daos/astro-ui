import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import cn from 'classnames';

import { useAuthContext } from 'context/AuthContext';
import {
  TICK_LEFT,
  TICK_RIGHT,
} from 'astro_2.0/features/ViewProposal/components/ProposalComments/helpers';
import { useProposalComments } from 'astro_2.0/features/ViewProposal/components/ProposalComments/hooks';

import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import { Loader } from 'components/loader';

import styles from './ProposalComments.module.scss';

interface ProposalCommentsProps {
  proposalId: string;
}

export const ProposalComments: FC<ProposalCommentsProps> = ({ proposalId }) => {
  const { accountId: loggedInAccountId } = useAuthContext();
  const commentsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const { comments, loading, sendComment } = useProposalComments(proposalId);

  const handleCommentInput = useCallback(e => {
    setValue(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!value || !value.trim()) return;

    sendComment({ proposalId, message: value.trim() });
    setValue('');
  }, [proposalId, sendComment, value]);

  const handleKeyUp = useCallback(
    e => {
      if (!focused) return;

      if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Escape' && value.trim().length) {
        setValue('');
      } else if (e.key === 'Escape') {
        setValue('');
      }
    },
    [focused, handleSubmit, value]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (commentsRef.current) {
        commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [comments]);

  return (
    <div className={styles.root}>
      <ul className={styles.comments} ref={commentsRef}>
        {comments
          ?.sort((a, b) => {
            if (a.id > b.id) return 1;

            if (a.id < b.id) return -1;

            return 0;
          })
          .map(({ id, message, createdAt, accountId }) => {
            const isMyComment = accountId === loggedInAccountId;

            return (
              <li
                className={cn(styles.comment, {
                  [styles.myComment]: isMyComment,
                })}
                key={id}
              >
                {isMyComment ? TICK_RIGHT : TICK_LEFT}
                {!isMyComment && (
                  <div className={styles.commentAuthor}>{accountId}</div>
                )}
                <p>{message}</p>
                <div className={styles.time}>
                  {format(parseISO(createdAt), 'hh:mm a')}
                </div>
              </li>
            );
          })}
        {loading && <Loader />}
      </ul>
      <div className={styles.addCommentSection} ref={inputRef}>
        <Input
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleCommentInput}
          className={styles.inputWrapper}
          size="block"
          isBorderless
          placeholder="Start typing..."
        />
        <Button
          variant="primary"
          className={styles.submitButton}
          onClick={handleSubmit}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useMedia, useMountedState } from 'react-use';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuthContext } from 'context/AuthContext';
import { useProposalComments } from 'astro_2.0/features/ViewProposal/components/ProposalComments/hooks';

import { Comment } from 'astro_2.0/features/ViewProposal/components/ProposalComments/components/Comment';
import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import styles from './ProposalComments.module.scss';

interface ProposalCommentsProps {
  proposalId: string;
  isCouncilUser: boolean;
  isCommentsAllowed: boolean;
  updateCommentsCount: (val: number) => void;
}

export const ProposalComments: FC<ProposalCommentsProps> = ({
  proposalId,
  isCouncilUser,
  isCommentsAllowed,
  updateCommentsCount,
}) => {
  const isMobile = useMedia('(max-width: 920px)');
  const { accountId: loggedInAccountId } = useAuthContext();
  const commentsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const isMounted = useMountedState();

  const {
    comments,
    sendComment,
    reportComment,
    deleteComment,
  } = useProposalComments(proposalId);

  const handleCommentInput = useCallback(e => {
    const { value: newValue } = e.target;

    if (newValue.length <= 500) {
      setValue(newValue);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!value || !value.trim()) {
      return;
    }

    sendComment({ proposalId, message: value.trim() });
    setValue('');
  }, [proposalId, sendComment, value]);

  const handleKeyUp = useCallback(
    e => {
      if (!focused) {
        return;
      }

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
    }, 50);

    if (comments) {
      updateCommentsCount(comments?.length);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [comments, updateCommentsCount]);

  return (
    <div className={styles.root}>
      <ul className={styles.comments} ref={commentsRef}>
        {comments
          ?.sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }

            if (a.id < b.id) {
              return -1;
            }

            return 0;
          })
          .map(({ id, message, createdAt, accountId, reports }) => {
            const isMyComment = accountId === loggedInAccountId;

            const isReported = !!reports?.find(
              item => item.accountId === loggedInAccountId
            );

            return (
              <Comment
                key={id}
                commentId={id}
                accountId={accountId}
                createdAt={createdAt}
                isMyComment={isMyComment}
                isCouncilUser={isCouncilUser}
                isReported={isReported}
                reportsCount={reports?.length}
                message={message}
                onReport={reportComment}
                onDelete={deleteComment}
              />
            );
          })}
        <AnimatePresence>
          <motion.div
            key="noResults"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!comments?.length && (
              <NoResultsView
                title="No comments yet"
                className={styles.loader}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </ul>
      <div ref={inputRef} />
      {isCommentsAllowed && (
        <div className={styles.addCommentSection}>
          <Input
            value={value}
            onFocus={() => isMounted() && setFocused(true)}
            onBlur={() => isMounted() && setFocused(false)}
            onChange={handleCommentInput}
            className={styles.inputWrapper}
            size="block"
            isBorderless
            placeholder="Start typing..."
          />
          {isMobile ? (
            <IconButton
              icon="paperAirplane"
              onClick={handleSubmit}
              className={styles.mobileSubmitButton}
            />
          ) : (
            <Button
              variant="primary"
              className={styles.submitButton}
              onClick={handleSubmit}
            >
              Send
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

import uniqBy from 'lodash/uniqBy';
import {
  CommentContextType,
  ProposalComment,
  ReportCommentsInput,
  SendCommentsInput,
} from 'types/proposal';
import { useEffect, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useAsyncFn, useMountedState } from 'react-use';
import { useSocket } from 'context/SocketContext';
import { useWalletContext } from 'context/WalletContext';

export function useProposalComments(
  proposalId: string,
  contextType: CommentContextType
): {
  comments: ProposalComment[] | null;
  loading: boolean;
  sendComment: (params: SendCommentsInput) => void;
  reportComment: (params: ReportCommentsInput) => void;
  deleteComment: (commentId: number, reason: string) => void;
} {
  const { accountId, nearService, pkAndSignature } = useWalletContext();
  const { socket } = useSocket();
  const isMounted = useMountedState();
  const [comments, setComments] = useState<ProposalComment[] | null>(null);

  const [{ loading }, getComments] = useAsyncFn(async () => {
    try {
      const data = await SputnikHttpService.getProposalComments(proposalId);

      if (isMounted()) {
        setComments(data);
      }
    } catch (err) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: err.message,
      });
    }
  }, [proposalId]);

  const [{ loading: uploading }, sendComment] = useAsyncFn(
    async params => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (publicKey && signature && accountId) {
        await SputnikHttpService.sendProposalComment({
          ...params,
          accountId,
          publicKey,
          signature,
        });
      }
    },
    [proposalId, pkAndSignature]
  );

  const [, reportComment] = useAsyncFn(
    async params => {
      try {
        if (!pkAndSignature) {
          return;
        }

        const { publicKey, signature } = pkAndSignature;

        if (publicKey && signature && accountId) {
          await SputnikHttpService.reportProposalComment({
            ...params,
            accountId,
            publicKey,
            signature,
          });
          await getComments();
        }
      } catch (err) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: err.message,
        });
      }
    },
    [proposalId, nearService, pkAndSignature]
  );

  const [, deleteComment] = useAsyncFn(
    async (commentId, reason) => {
      try {
        if (!pkAndSignature) {
          return;
        }

        const { publicKey, signature } = pkAndSignature;

        if (publicKey && signature && accountId) {
          await SputnikHttpService.deleteProposalComment(commentId, {
            accountId,
            publicKey,
            signature,
            reason,
          });
        }
      } catch (err) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: err.message,
        });
      }
    },
    [proposalId, nearService, pkAndSignature]
  );

  useEffect(() => {
    if (socket) {
      socket.on('comment', (newComment: ProposalComment) => {
        if (
          newComment.contextId === proposalId &&
          newComment.contextType === contextType
        ) {
          if (isMounted()) {
            setComments(prev => {
              if (prev) {
                return uniqBy([...prev, newComment], val => val.id);
              }

              return [newComment];
            });
          }
        }
      });

      socket.on('comment-removed', (removedComment: ProposalComment) => {
        if (
          removedComment.contextId === proposalId &&
          removedComment.contextType === contextType
        ) {
          if (isMounted()) {
            setComments(prev => {
              if (prev) {
                return prev.filter(item => item.id !== removedComment.id);
              }

              return [];
            });
          }
        }
      });
    }

    getComments();
  }, [contextType, getComments, isMounted, proposalId, socket]);

  return {
    comments,
    loading: loading || uploading,
    sendComment,
    reportComment,
    deleteComment,
  };
}

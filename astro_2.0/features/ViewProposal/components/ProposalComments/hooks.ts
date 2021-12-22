import uniqBy from 'lodash/uniqBy';
import {
  ProposalComment,
  ReportCommentsInput,
  SendCommentsInput,
} from 'types/proposal';
import { useEffect, useState } from 'react';
import { SputnikHttpService, SputnikNearService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useAsyncFn } from 'react-use';
import { useSocket } from 'context/SocketContext';
import { useAuthContext } from 'context/AuthContext';

export function useProposalComments(
  proposalId: string
): {
  comments: ProposalComment[] | null;
  loading: boolean;
  sendComment: (params: SendCommentsInput) => void;
  reportComment: (params: ReportCommentsInput) => void;
  deleteComment: (commentId: number, reason: string) => void;
} {
  const { accountId } = useAuthContext();
  const { socket } = useSocket();
  const [comments, setComments] = useState<ProposalComment[] | null>(null);

  const [{ loading }, getComments] = useAsyncFn(async () => {
    try {
      const data = await SputnikHttpService.getProposalComments(proposalId);

      setComments(data);
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
      try {
        const publicKey = await SputnikNearService.getPublicKey();
        const signature = await SputnikNearService.signMessage(accountId);

        if (publicKey && signature && accountId) {
          await SputnikHttpService.sendProposalComment({
            ...params,
            accountId,
            publicKey,
            signature,
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
    [proposalId]
  );

  const [, reportComment] = useAsyncFn(
    async params => {
      try {
        const publicKey = await SputnikNearService.getPublicKey();
        const signature = await SputnikNearService.signMessage(accountId);

        if (publicKey && signature && accountId) {
          await SputnikHttpService.reportProposalComment({
            ...params,
            accountId,
            publicKey,
            signature,
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
    [proposalId]
  );

  const [, deleteComment] = useAsyncFn(
    async (commentId, reason) => {
      try {
        const publicKey = await SputnikNearService.getPublicKey();
        const signature = await SputnikNearService.signMessage(accountId);

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
    [proposalId]
  );

  useEffect(() => {
    if (socket) {
      socket.on('comments', (newComment: ProposalComment) => {
        if (newComment.proposalId === proposalId) {
          setComments(prev => {
            if (prev) {
              return uniqBy([...prev, newComment], val => val.id);
            }

            return [newComment];
          });
        }
      });
    }

    getComments();
  }, [getComments, proposalId, socket]);

  return {
    comments,
    loading: loading || uploading,
    sendComment,
    reportComment,
    deleteComment,
  };
}

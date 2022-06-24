import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { DraftComment } from 'services/DraftsService/types';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

export function useDraftComments(): {
  loading: boolean;
  data: DraftComment[];
  addComment: (val: string) => Promise<void>;
  editComment: (val: string, id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  likeComment: (id: string) => Promise<void>;
} {
  const router = useRouter();
  const { draft } = router.query;
  const contextId = draft as string;
  const contextType = 'DraftProposal';

  const { draftsService } = useDraftsContext();
  const { accountId, pkAndSignature } = useWalletContext();

  const [{ loading, value }, fetchComments] = useAsyncFn(async () => {
    try {
      return draftsService.getDraftComments({
        contextId,
        contextType,
        offset: 0,
        limit: 1000,
      });
    } catch (e) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: e?.message,
      });

      return null;
    }
  }, [contextId]);

  const addComment = useCallback(
    async (msg: string, replyTo?: string) => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (!publicKey || !signature) {
        return;
      }

      try {
        await draftsService.createDraftComment({
          contextId,
          contextType,
          message: msg,
          replyTo,
          accountId,
          publicKey,
          signature,
        });

        await fetchComments();
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, contextId, draftsService, fetchComments, pkAndSignature]
  );

  const editComment = useCallback(
    async (msg: string, id: string) => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (!publicKey || !signature) {
        return;
      }

      try {
        await draftsService.editDraftComment({
          id,
          message: msg,
          accountId,
          publicKey,
          signature,
        });

        await fetchComments();
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, draftsService, fetchComments, pkAndSignature]
  );

  const likeComment = useCallback(
    async (id: string, unlike?: boolean) => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (!publicKey || !signature) {
        return;
      }

      try {
        if (unlike) {
          await draftsService.unlikeDraftComment({
            id,
            accountId,
            publicKey,
            signature,
          });
        } else {
          await draftsService.likeDraftComment({
            id,
            accountId,
            publicKey,
            signature,
          });
        }

        await fetchComments();
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, draftsService, fetchComments, pkAndSignature]
  );

  const deleteComment = useCallback(
    async (id: string) => {
      if (!pkAndSignature) {
        return;
      }

      const { publicKey, signature } = pkAndSignature;

      if (!publicKey || !signature) {
        return;
      }

      try {
        await draftsService.deleteDraftComment({
          id,
          accountId,
          publicKey,
          signature,
        });

        await fetchComments();
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, draftsService, fetchComments, pkAndSignature]
  );

  useEffect(() => {
    (async () => {
      await fetchComments();
    })();
  }, [fetchComments]);

  return {
    loading,
    data: value ?? [],
    addComment,
    editComment,
    deleteComment,
    likeComment,
  };
}

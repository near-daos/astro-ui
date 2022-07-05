import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAsync, useMountedState } from 'react-use';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { DraftComment } from 'services/DraftsService/types';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { configService } from 'services/ConfigService';
import io, { Socket as TSocket } from 'socket.io-client';

type Socket = typeof TSocket;

function prepareData(data: DraftComment[]) {
  const groups = data.reduce<Record<string, DraftComment[]>>((res, item) => {
    const key = item.replyTo ?? '';

    if (res[key]) {
      res[key].push(item);
    } else {
      res[key] = [item];
    }

    return res;
  }, {});

  if (!groups['']) {
    return data;
  }

  return groups[''].map(item => {
    return {
      ...item,
      replies: groups[item.id] ?? [],
    };
  });
}

export function useDraftComments(): {
  loading: boolean;
  countComments: number;
  data: DraftComment[];
  addComment: (val: string) => Promise<void>;
  editComment: (val: string, id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  likeComment: (id: string, isLiked: boolean) => Promise<void>;
  dislikeComment: (id: string, idDislike: boolean) => Promise<void>;
} {
  const isMounted = useMountedState();
  const router = useRouter();
  const { draft } = router.query;
  const contextId = draft as string;
  const contextType = 'DraftProposal';

  const { draftsService, setAmountComments } = useDraftsContext();
  const { accountId, pkAndSignature } = useWalletContext();

  const [value, setValue] = useState<{
    data: DraftComment[];
    countComments: number;
  }>({
    data: [],
    countComments: 0,
  });

  const { loading } = useAsync(async () => {
    try {
      const data = await draftsService.getDraftComments({
        contextId,
        contextType,
        offset: 0,
        limit: 1000,
      });

      setValue({
        data,
        countComments: data.length,
      });
    } catch (e) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: e?.message,
      });
    }
  }, [contextId]);

  const addComment = useCallback(
    async (msg: string, replyTo?: string) => {
      const { publicKey, signature } = pkAndSignature || {};

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
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, contextId, draftsService, pkAndSignature]
  );

  const editComment = useCallback(
    async (msg: string, id: string) => {
      const { publicKey, signature } = pkAndSignature || {};

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
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, draftsService, pkAndSignature]
  );

  const likeComment = useCallback(
    async (id: string, isLiked: boolean) => {
      const { publicKey, signature } = pkAndSignature || {};

      if (!publicKey || !signature) {
        return;
      }

      const params = {
        id,
        accountId,
        publicKey,
        signature,
      };

      try {
        if (isLiked) {
          await draftsService.removeLikeDraftComment(params);
        } else {
          await draftsService.removeDislikeDraftComment(params);
          await draftsService.likeDraftComment(params);
        }
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, draftsService, pkAndSignature]
  );

  const dislikeComment = useCallback(
    async (id: string, isDislike: boolean) => {
      const { publicKey, signature } = pkAndSignature || {};

      if (!publicKey || !signature) {
        return;
      }

      const params = {
        id,
        accountId,
        publicKey,
        signature,
      };

      try {
        if (isDislike) {
          await draftsService.removeDislikeDraftComment(params);
        } else {
          await draftsService.removeLikeDraftComment(params);
          await draftsService.dislikeDraftComment(params);
        }
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, draftsService, pkAndSignature]
  );

  const deleteComment = useCallback(
    async (id: string) => {
      const { publicKey, signature } = pkAndSignature || {};

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
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, draftsService, pkAndSignature]
  );

  useEffect(() => {
    setAmountComments(value?.countComments || 0);
  }, [value?.countComments, setAmountComments]);

  useEffect(() => {
    let socket: Socket;
    const { appConfig } = configService.get();

    const { publicKey, signature } = pkAndSignature || {};

    if (accountId && publicKey && isMounted() && appConfig) {
      socket = io(appConfig.DRAFTS_API_URL, {
        query: {
          accountId,
          publicKey,
          signature,
        },
        transports: ['websocket'],
      });

      if (socket) {
        socket.on('draft-comment', (comment: DraftComment) => {
          if (isMounted()) {
            setValue(prev => {
              return {
                data: [comment, ...prev.data],
                countComments: prev.countComments + 1,
              };
            });
          }
        });
        socket.on('draft-comment-updated', (comment: DraftComment) => {
          if (isMounted()) {
            setValue(prev => {
              const newData = prev.data.map(item => {
                if (item.id !== comment.id) {
                  return item;
                }

                return comment;
              });

              return {
                data: newData,
                countComments: newData.length,
              };
            });
          }
        });
        socket.on('draft-comment-removed', (comment: DraftComment) => {
          if (isMounted()) {
            setValue(prev => {
              const newData = prev.data.filter(item => item.id !== comment.id);

              return {
                data: newData,
                countComments: newData.length,
              };
            });
          }
        });
      }
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [accountId, isMounted, pkAndSignature]);

  const preparedData = prepareData(value.data);

  return {
    loading,
    countComments: preparedData?.length || 0,
    data: preparedData ?? [],
    addComment,
    editComment,
    deleteComment,
    likeComment,
    dislikeComment,
  };
}

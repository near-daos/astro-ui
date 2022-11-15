import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import uniqBy from 'lodash/uniqBy';
import { useAsyncFn, useMount, useMountedState } from 'react-use';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider';
import { DraftComment } from 'services/DraftsService/types';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { configService } from 'services/ConfigService';
import io, { Socket as TSocket } from 'socket.io-client';
import { fetcher as getDraftProposalComments } from 'services/ApiService/hooks/useDraftComments';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { DraftCommentIndex } from 'services/SearchService/types';
import { mapDraftCommentIndexToDraftComment } from 'services/SearchService/mappers/draftComment';

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
  const { draft, dao } = router.query;
  const contextId = draft as string;
  const daoId = dao as string;
  const contextType = 'DraftProposal';

  const { useOpenSearchDataApi } = useFlags();
  const { draftsService, setAmountComments } = useDraftsContext();
  const { accountId, pkAndSignature } = useWalletContext();

  const [value, setValue] = useState<{
    data: DraftComment[];
    countComments: number;
  }>({
    data: [],
    countComments: 0,
  });

  const [{ loading }, getAllComments] = useAsyncFn(async () => {
    if (useOpenSearchDataApi === undefined) {
      return;
    }

    try {
      const data = useOpenSearchDataApi
        ? await getDraftProposalComments(
            'draftProposalComment',
            daoId,
            contextId
          )
        : await draftsService.getDraftComments({
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
  }, [contextId, useOpenSearchDataApi]);

  useMount(() => getAllComments());

  const addComment = useCallback(
    async (msg: string, replyTo?: string) => {
      const { publicKey, signature } = pkAndSignature || {};

      if (!publicKey || !signature) {
        return;
      }

      try {
        await draftsService.createDraftComment({
          contextId,
          daoId,
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
    [accountId, contextId, daoId, draftsService, pkAndSignature]
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
          daoId,
          draftId: contextId,
          message: msg,
          accountId,
          publicKey,
          signature,
        });

        await getAllComments();
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [pkAndSignature, draftsService, daoId, contextId, accountId, getAllComments]
  );

  const likeComment = useCallback(
    async (id: string, isLiked: boolean) => {
      const { publicKey, signature } = pkAndSignature || {};

      if (!publicKey || !signature) {
        return;
      }

      const params = {
        id,
        daoId,
        draftId: contextId,
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
    [accountId, contextId, daoId, draftsService, pkAndSignature]
  );

  const dislikeComment = useCallback(
    async (id: string, isDislike: boolean) => {
      const { publicKey, signature } = pkAndSignature || {};

      if (!publicKey || !signature) {
        return;
      }

      const params = {
        id,
        daoId,
        draftId: contextId,
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
    [accountId, contextId, daoId, draftsService, pkAndSignature]
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
          daoId,
          draftId: contextId,
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
    [accountId, contextId, daoId, draftsService, pkAndSignature]
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
        socket.on(
          'draft-comment',
          (comment: DraftComment | DraftCommentIndex) => {
            if (isMounted()) {
              setValue(prev => {
                const newValue = mapDraftCommentIndexToDraftComment(
                  comment as DraftCommentIndex
                ) as DraftComment;

                return {
                  data: uniqBy([newValue, ...prev.data], item => item.id),
                  countComments: prev.countComments + 1,
                };
              });
            }
          }
        );
        socket.on(
          'draft-comment-updated',
          (comment: DraftComment | DraftCommentIndex) => {
            if (isMounted()) {
              setValue(prev => {
                const newValue = mapDraftCommentIndexToDraftComment(
                  comment as DraftCommentIndex
                ) as DraftComment;

                const newData = prev.data.map(item => {
                  if (item.id !== newValue.id) {
                    return item;
                  }

                  return newValue;
                });

                return {
                  data: newData,
                  countComments: newData.length,
                };
              });
            }
          }
        );
        socket.on(
          'draft-comment-removed',
          (comment: DraftComment | DraftCommentIndex) => {
            if (isMounted()) {
              const newValue = mapDraftCommentIndexToDraftComment(
                comment as DraftCommentIndex
              ) as DraftComment;

              setValue(prev => {
                const newData = prev.data.filter(
                  item => item.id !== newValue.id
                );

                return {
                  data: newData,
                  countComments: newData.length,
                };
              });
            }
          }
        );
      }
    }
  }, [accountId, isMounted, pkAndSignature, useOpenSearchDataApi]);

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

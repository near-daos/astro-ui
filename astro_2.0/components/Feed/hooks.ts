import { useAsyncFn, useList, useLocalStorage, useLocation } from 'react-use';
import { useCallback } from 'react';
import { VoteAction } from 'types/proposal';
import { useWalletContext } from 'context/WalletContext';
import { useRouter } from 'next/router';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { VOTE_ACTION_SOURCE_PAGE } from 'constants/votingConstants';

export function useMultiVoteActions(): {
  loading: boolean;
  handleVote: (vote: VoteAction) => Promise<void>;
  handleSelect: (id: string) => void;
  handleDismiss: () => void;
  list: string[];
} {
  const { nearService } = useWalletContext();
  const router = useRouter();
  const [, setVoteActionSource] = useLocalStorage(VOTE_ACTION_SOURCE_PAGE);
  const { pathname } = useLocation();
  const [list, { push, removeAt, clear }] = useList<string>([]);

  const handleSelect = useCallback(
    id => {
      const itemIndex = list.findIndex(item => item === id);

      if (itemIndex !== -1) {
        removeAt(itemIndex);
      } else {
        push(id);
      }
    },
    [list, push, removeAt]
  );

  const handleDismiss = useCallback(() => {
    clear();
  }, [clear]);

  const [{ loading }, handleVote] = useAsyncFn(
    async (vote: VoteAction) => {
      try {
        const paramsArr = list.map(item => {
          const separatorIndex = item.lastIndexOf('-');
          const daoId = item.substring(0, separatorIndex);
          const proposalId = item.substring(separatorIndex + 1);

          return { daoId, proposalId };
        });

        setVoteActionSource(pathname);

        await nearService?.multiVote(vote, paramsArr);

        await router.reload();
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          description: e.message,
          lifetime: 20000,
        });

        await router.reload();
      }
    },
    [router, nearService, list]
  );

  return {
    loading,
    list,
    handleVote,
    handleSelect,
    handleDismiss,
  };
}

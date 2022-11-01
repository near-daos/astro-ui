import { useWalletContext } from 'context/WalletContext';
import { useAsync } from 'react-use';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useDraftService } from './useDraftService';

export function useUnreadDraftCount(daoId: string): number | null {
  const { accountId } = useWalletContext();
  const { useOpenSearchDataApi } = useFlags();
  const draftsService = useDraftService();

  const { value } = useAsync(async () => {
    if (useOpenSearchDataApi || useOpenSearchDataApi === undefined) {
      return 0;
    }

    if (draftsService) {
      const res = await draftsService.getDrafts({
        offset: 0,
        limit: 1000,
        daoId,
        accountId,
        isRead: 'false',
      });

      if (!res) {
        return 0;
      }

      return res.total;
    }

    return 0;
  }, [accountId, daoId, draftsService]);

  return value ?? 0;
}

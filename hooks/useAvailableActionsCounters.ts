import { useFlags } from 'launchdarkly-react-client-sdk';
import { useAsync } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';
import { ProposalsFeedStatuses } from 'types/proposal';
import { useAvailableActionsProposals } from 'services/ApiService/hooks/useAvailableActionsProposals';

export function useAvailableActionsCounters(): {
  proposalActionsCount: number | undefined;
} {
  const { accountId } = useWalletContext();
  const { useOpenSearchDataApi } = useFlags();

  const count = useAvailableActionsProposals();

  const { value: proposalActionsCount } = useAsync(async () => {
    if (
      !accountId ||
      useOpenSearchDataApi ||
      useOpenSearchDataApi === undefined
    ) {
      return 0;
    }

    const res = await SputnikHttpService.getProposalsListByAccountId(
      {
        offset: 0,
        limit: 1000,
        status: ProposalsFeedStatuses.VoteNeeded,
        accountId,
      },
      accountId || undefined
    );

    if (res) {
      return res.data.length;
    }

    return 0;
  }, [accountId, useOpenSearchDataApi]);

  return {
    proposalActionsCount: (proposalActionsCount || count) ?? 0,
  };
}

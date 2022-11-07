import { useAsync, useAsyncFn } from 'react-use';
import { useWalletContext } from 'context/WalletContext';
import { SputnikHttpService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { DAO, DaoDelegation } from 'types/dao';
import { formatYoktoValue } from 'utils/format';
import { useCallback, useEffect, useState } from 'react';
import {
  DelegateTokenDetails,
  UserDelegateDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/types';
import { objectKeys } from 'utils/objects';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useDaoSettings } from 'context/DaoSettingsContext';

export function useDelegatePageData(dao: DAO): {
  loadingTotalSupply: boolean;
  totalSupply: string | undefined;
  loadingTokenDetails: boolean;
  tokenDetails:
    | (DelegateTokenDetails & { contractAddress: string })
    | undefined;
  loadingDelegateByUser: boolean;
  delegateByUser:
    | (UserDelegateDetails & {
        nextActionTime: Date;
      })
    | undefined;
  handleSearch: (val: string) => Promise<void>;
  handleReset: () => void;
  data: DaoDelegation[];
} {
  const { governanceToken, useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const { nearService, accountId } = useWalletContext();
  const { settings } = useDaoSettings();

  const daoId = router.query.dao as string;
  const ts = router.query.ts as string;

  const [data, setData] = useState<DaoDelegation[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  const { loading: loadingTokenDetails, value: tokenDetails } =
    useAsync(async () => {
      if (!nearService) {
        return undefined;
      }

      const contractAddress = settings?.createGovernanceToken?.contractAddress;

      if (!contractAddress) {
        return undefined;
      }

      const [meta, balance] = await Promise.allSettled([
        nearService.getFtMetadata(contractAddress),
        nearService.getFtBalance(
          nearService.getStackingContract(dao.name),
          accountId
        ),
      ]);

      return {
        balance:
          balance.status === 'fulfilled' && meta.status === 'fulfilled'
            ? Number(formatYoktoValue(balance.value, meta.value.decimals))
            : 0,
        symbol: meta.status === 'fulfilled' ? meta.value.symbol : 'n/a',
        decimals: meta.status === 'fulfilled' ? meta.value.decimals : 0,
        contractAddress,
      };
    }, [nearService, ts, settings]);

  const { loading: loadingTotalSupply, value: totalSupply } =
    useAsync(async () => {
      if (!nearService) {
        return undefined;
      }

      return nearService.getDelegationTotalSupply(daoId);
    }, [daoId, nearService, ts]);

  const { loading: loadingDelegateByUser, value: delegateByUser } =
    useAsync(async () => {
      if (
        !nearService ||
        !accountId ||
        !settings?.createGovernanceToken?.wizardCompleted
      ) {
        return undefined;
      }

      try {
        const stackingContract = nearService.getStackingContract(dao.name);

        if (!stackingContract) {
          return undefined;
        }

        const userData = await nearService.getUserDelegation(
          stackingContract,
          accountId
        );

        if (!userData) {
          return undefined;
        }

        const { delegatedTotal, delegatedToUser } =
          userData.delegated_amounts.reduce<{
            delegatedTotal: number;
            delegatedToUser: Record<string, string>;
          }>(
            (res, item) => {
              const [acc, balance] = item;

              res.delegatedTotal += +balance;

              res.delegatedToUser[acc] = formatYoktoValue(
                balance,
                tokenDetails?.decimals
              );

              return res;
            },
            { delegatedTotal: 0, delegatedToUser: {} }
          );

        return {
          accountId,
          delegatedBalance: Number(
            formatYoktoValue(delegatedTotal.toString(), tokenDetails?.decimals)
          ),
          stakedBalance: formatYoktoValue(
            userData.vote_amount,
            tokenDetails?.decimals
          ),
          nextActionTime: new Date(
            Number(userData.next_action_timestamp) / 1000000
          ),
          delegatedToUser,
        };
      } catch (e) {
        return undefined;
      }
    }, [dao, nearService, accountId, ts, tokenDetails, settings]);

  const [, fetchData] = useAsyncFn(async () => {
    const res = useOpenSearchDataApi
      ? dao.delegations ?? []
      : await SputnikHttpService.getDelegations(daoId, governanceToken);

    setData(res);
  }, [daoId, ts, governanceToken]);

  const handleSearch = useCallback(async searchInput => {
    setSearchFilter(searchInput);
  }, []);

  const handleReset = useCallback(() => {
    setSearchFilter('');
  }, []);

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  const filteredData = data
    .filter(item => item.accountId.startsWith(searchFilter))
    .map(item => ({
      ...item,
      balance: formatYoktoValue(item.balance, tokenDetails?.decimals),
      delegators: item.delegators
        ? objectKeys(item.delegators).reduce<Record<string, string>>(
            (acc, key) => {
              acc[key] = formatYoktoValue(
                item.delegators[key],
                tokenDetails?.decimals
              );

              return acc;
            },
            {}
          )
        : {},
    }));

  return {
    loadingTotalSupply,
    totalSupply: formatYoktoValue(
      totalSupply ?? '0',
      tokenDetails?.decimals ?? 0
    ),
    loadingTokenDetails,
    tokenDetails,
    loadingDelegateByUser,
    delegateByUser,
    handleSearch,
    handleReset,
    data: filteredData,
  };
}

export function useVotingPolicyDetails(dao: DAO): {
  balance: string;
  threshold: string;
  quorum: string;
} {
  const { nearService, accountId } = useWalletContext();
  const { settings } = useDaoSettings();
  const { value: tokenDetails } = useAsync(async () => {
    if (!nearService) {
      return undefined;
    }

    try {
      const contractAddress = settings?.createGovernanceToken?.contractAddress;

      if (!contractAddress) {
        return undefined;
      }

      const [meta] = await Promise.allSettled([
        nearService.getFtMetadata(contractAddress),
      ]);

      return {
        symbol: meta.status === 'fulfilled' ? meta.value.symbol : 'n/a',
        decimals: meta.status === 'fulfilled' ? meta.value.decimals : 0,
        contractAddress,
      };
    } catch (e) {
      return undefined;
    }
  }, [nearService, settings, accountId]);

  const holdersRole = dao.policy.roles.find(
    role => role.kind === 'Member' && role.name === 'TokenHolders'
  );

  if (!holdersRole) {
    return {
      balance: '0',
      threshold: '0',
      quorum: '0',
    };
  }

  const policy = holdersRole.votePolicy?.vote || holdersRole.votePolicy['*.*'];

  return {
    threshold: formatYoktoValue(policy?.weight ?? '0', tokenDetails?.decimals),
    balance: formatYoktoValue(
      holdersRole.balance ?? '0',
      tokenDetails?.decimals
    ),
    quorum: formatYoktoValue(policy?.quorum ?? '0', tokenDetails?.decimals),
  };
}

export function useTriggerUpdate(): {
  triggerUpdate: () => Promise<void>;
} {
  const router = useRouter();

  const triggerUpdate = useCallback(async () => {
    await router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          ts: new Date().getTime(),
        },
      },
      undefined,
      {
        scroll: true,
        shallow: true,
      }
    );
  }, [router]);

  return {
    triggerUpdate,
  };
}

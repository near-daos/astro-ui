import { useAsync, useAsyncFn } from 'react-use';
import { useWalletContext } from 'context/WalletContext';
import { SputnikHttpService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { DAO } from 'types/dao';
import { formatYoktoValue } from 'utils/format';
import { useCallback } from 'react';
import {
  DelegateTokenDetails,
  UserDelegateDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/types';

export function useDelegatePageData(
  dao: DAO
): {
  loadingTotalSupply: boolean;
  totalSupply: string | undefined;
  tokenDetails: DelegateTokenDetails | undefined;
  loadingDelegateByUser: boolean;
  delegateByUser: UserDelegateDetails[] | undefined;
  handleSearch: (val: string) => Promise<void>;
  handleReset: () => void;
  searching: boolean;
} {
  const router = useRouter();
  const { nearService, accountId } = useWalletContext();

  const daoId = router.query.dao as string;

  const { value: tokenDetails } = useAsync(async () => {
    if (!nearService) {
      return undefined;
    }

    const settings = await SputnikHttpService.getDaoSettings(daoId);

    const contractAddress = settings?.createGovernanceToken?.contractAddress;

    if (!contractAddress) {
      return undefined;
    }

    const contract = nearService.getContract(contractAddress, [
      'ft_balance_of',
      'ft_metadata',
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const meta = await contract.ft_metadata();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const balance = await contract.ft_balance_of({ account_id: accountId });

    return {
      balance: Number(formatYoktoValue(balance, meta.decimals)),
      symbol: meta.symbol,
      decimals: meta.decimals,
    };
  }, [nearService]);

  const {
    loading: loadingTotalSupply,
    value: totalSupply,
  } = useAsync(async () => {
    if (!nearService) {
      return undefined;
    }

    const contract = nearService.getContract(daoId, [
      'delegation_total_supply',
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return contract.delegation_total_supply();
  }, [daoId, nearService]);

  const {
    loading: loadingDelegateByUser,
    value: delegateByUser,
  } = useAsync(async () => {
    if (!nearService) {
      return undefined;
    }

    const stackingContract = nearService.getStackingContract(dao.name);

    if (!stackingContract) {
      return undefined;
    }

    const contract = nearService.getContract(stackingContract, [
      'ft_balance_of',
      'ft_metadata',
      'get_user',
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userData = await contract.get_user({ account_id: accountId });

    if (!userData) {
      return undefined;
    }

    const delegatedByUser = (userData.delegated_amounts as [
      string,
      string
    ][]).reduce<Record<string, number>>((res, item) => {
      const [name, val] = item;

      if (res[name]) {
        res[name] += +val;
      } else {
        res[name] = +val;
      }

      return res;
    }, {});

    return Object.keys(delegatedByUser).map(userAccountId => {
      return {
        accountId: userAccountId,
        delegatedBalance: delegatedByUser[userAccountId],
        stakedBalance: userData.vote_amount,
      };
    });
  }, [dao, nearService, accountId]);

  const [{ loading: searching }, handleSearch] = useAsyncFn(async () => {
    // search
  }, []);

  const handleReset = useCallback(() => {
    // reset search
  }, []);

  return {
    loadingTotalSupply,
    totalSupply,
    tokenDetails,
    loadingDelegateByUser,
    delegateByUser,
    handleSearch,
    handleReset,
    searching,
  };
}

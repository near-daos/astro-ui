import { useWalletContext } from 'context/WalletContext';
import { useState } from 'react';
import { useAsyncFn, useMount } from 'react-use';
import { YOKTO_NEAR } from 'services/sputnik/constants';

const STORAGE_PRICE_PER_BYTE = 10_000_000_000_000_000_000;

export function useAccountState(): number | null {
  const { nearService } = useWalletContext();
  const [storagePrice, setStoragePrice] = useState<number | null>(null);

  const [, getState] = useAsyncFn(async () => {
    const accountId = await nearService?.getAccountId();

    if (accountId && nearService) {
      const state = await nearService.viewAccount(accountId);
      const { storage_usage: storageUsage } = state;

      const nearPrice = (STORAGE_PRICE_PER_BYTE * storageUsage) / YOKTO_NEAR;

      setStoragePrice(nearPrice);
    }
  }, []);

  useMount(() => getState());

  return storagePrice;
}

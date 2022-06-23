import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';

import { WalletAccount } from 'context/WalletContext/types';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

export const useAvailableAccounts = (
  wallets: WalletService[]
): WalletAccount[] => {
  const [availableAccounts, setAvailableAccounts] = useState<WalletAccount[]>(
    []
  );

  useEffect(() => {
    if (isEmpty(wallets)) {
      return;
    }

    const getAccounts = async () => {
      const results = await Promise.allSettled(
        wallets.map(wallet => wallet.getAvailableAccounts())
      );

      const accounts = reduce(
        wallets,
        (acc: WalletAccount[], wallet, index) => {
          const result = results[index];

          if (result.status === 'fulfilled') {
            const walletAccounts = result.value.reduce(
              (accumulator: WalletAccount[], account: string) => {
                if (account) {
                  acc.push({
                    acc: account,
                    walletType: wallet.getWalletType(),
                  });
                }

                return accumulator;
              },
              []
            );

            acc.push(...walletAccounts);
          }

          return acc;
        },
        []
      );

      setAvailableAccounts(accounts);
    };

    getAccounts().catch(console.error);
  }, [wallets]);

  return availableAccounts;
};

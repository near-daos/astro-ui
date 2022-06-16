import { useEffect, useState } from 'react';

import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

export const useAvailableAccounts = (
  currentWallet: WalletService | null
): string[] => {
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (!currentWallet) {
      return;
    }

    const getAccounts = async () => {
      const accounts = await currentWallet.getAvailableAccounts();

      setAvailableAccounts(accounts);
    };

    getAccounts().catch(console.error);
  }, [currentWallet]);

  return availableAccounts;
};

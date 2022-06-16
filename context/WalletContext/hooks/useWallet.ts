import { useLocalStorage } from 'react-use';
import { useCallback, useEffect, useState } from 'react';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { WalletType } from 'types/config';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

import { CookieService } from 'services/CookieService';

import { useAvailableWallets } from './useAvailableWallets';

export const useWallet = (): [
  WalletService | null,
  WalletService[],
  (walletType: WalletType) => WalletService | undefined,
  (walletService: WalletService) => void,
  () => void
] => {
  const availableWallets = useAvailableWallets();
  const [
    persistedWallet,
    setPersistedWallet,
    removePersistedWallet,
  ] = useLocalStorage('selectedWallet');
  const [currentWallet, setCurrentWallet] = useState<WalletService | null>(
    null
  );

  const getWallet = useCallback(
    (walletType: WalletType) =>
      availableWallets.find(wallet => wallet.getWalletType() === walletType),
    [availableWallets]
  );

  const setWallet = useCallback(
    (wallet: WalletService) => {
      setPersistedWallet(wallet.getWalletType());
      setCurrentWallet(wallet);
      CookieService.set(ACCOUNT_COOKIE, wallet.getAccountId(), {
        path: '/',
      });
    },
    [setPersistedWallet]
  );

  useEffect(() => {
    const selectedWallet = availableWallets.find(
      w => w.getWalletType() === persistedWallet
    );

    if (selectedWallet) {
      CookieService.set(ACCOUNT_COOKIE, selectedWallet.getAccountId(), {
        path: '/',
      });
      setCurrentWallet(selectedWallet);
    } else {
      CookieService.remove(ACCOUNT_COOKIE);
    }
  }, [availableWallets, persistedWallet]);

  return [
    currentWallet,
    availableWallets,
    getWallet,
    setWallet,
    removePersistedWallet,
  ];
};

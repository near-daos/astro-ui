import { WalletService } from 'services/sputnik/SputnikNearService/services/types';
import { useEffectOnce, useList, useLocalStorage } from 'react-use';
import { configService } from 'services/ConfigService';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';
import { useCallback, useEffect, useState } from 'react';
import { WalletType } from 'types/config';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { useRouter } from 'next/router';

export type PkAndSignature =
  | { publicKey: string | null; signature: string | null }
  | Record<string, never>;

const initNearWallet = (): WalletService => {
  const { nearConfig } = configService.get();

  return new SputnikWalletService(nearConfig);
};

const initSenderWallet = (
  push: (newItem: WalletService) => void,
  reload: () => void
): void => {
  let counter = 0;

  const intervalId = setInterval(() => {
    if (counter !== undefined && counter === 10) {
      clearInterval(intervalId);
    }

    if (counter !== undefined) {
      counter += 1;
    }

    if (typeof window.near !== 'undefined' && window.near.isSender) {
      window.near.on('accountChanged', () => {
        reload();
      });

      clearInterval(intervalId);
      push(new SenderWalletService(window.near));
    }
  }, 500);
};

export const useAvailableWallets = (): WalletService[] => {
  const router = useRouter();
  const [availableWallets, { push }] = useList<WalletService>();

  useEffectOnce(() => {
    push(initNearWallet());
    initSenderWallet(push, router.reload);
  });

  return availableWallets;
};

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

export const usePkAndSignature = (
  currentWallet: WalletService | null
): PkAndSignature | null => {
  const [pkAndSignature, setPkAndSignature] = useState<PkAndSignature | null>(
    null
  );

  useEffect(() => {
    if (!currentWallet) {
      return;
    }

    const getPkAndSignature = async () => {
      const [publicKey, signature] = await Promise.all([
        currentWallet.getPublicKey(),
        currentWallet.getSignature(),
      ]);

      setPkAndSignature({
        publicKey,
        signature,
      });
    };

    getPkAndSignature().catch(console.error);
  }, [currentWallet]);

  return pkAndSignature;
};

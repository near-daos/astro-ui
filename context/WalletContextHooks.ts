import {
  WalletMeta,
  WalletService,
} from 'services/sputnik/SputnikNearService/services/types';
import { useEffectOnce, useList, useLocalStorage } from 'react-use';
import { configService } from 'services/ConfigService';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';
import { useEffect, useState } from 'react';
import { WalletType } from 'types/config';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

export type PkAndSignature =
  | { publicKey: string | null; signature: string | null }
  | Record<string, never>;

const initNearWallet = (): WalletService => {
  const { nearConfig } = configService.get();

  return new SputnikWalletService(nearConfig);
};

const initSenderWallet = (push: (wallet: WalletService) => void): void => {
  let counter = 0;

  const intervalId = setInterval(() => {
    if (counter !== undefined && counter === 10) {
      clearInterval(intervalId);
    }

    if (counter !== undefined) {
      counter += 1;
    }

    if (typeof window.near !== 'undefined' && window.near.isSender) {
      clearInterval(intervalId);
      push(new SenderWalletService(window.near));
    }
  }, 500);
};

export const useAvailableWallets = (): WalletService[] => {
  const [availableWallets, { push }] = useList<WalletService>();

  useEffectOnce(() => {
    push(initNearWallet());
    initSenderWallet(push);
  });

  return availableWallets;
};

export const useWallet = (): [
  WalletService | null,
  WalletMeta[],
  (walletType: WalletType) => WalletService | undefined,
  (walletService: WalletService) => void
] => {
  const availableWallets = useAvailableWallets();
  const [persistedWallet, setPersistedWallet] = useLocalStorage(
    'selectedWallet'
  );
  const [currentWallet, setCurrentWallet] = useState<WalletService | null>(
    null
  );

  const getWallet = (walletType: WalletType) =>
    availableWallets.find(wallet => wallet.getWalletType() === walletType);

  const setWallet = (wallet: WalletService) => {
    setPersistedWallet(wallet.getWalletType());
    setPersistedWallet(wallet);
    CookieService.set(ACCOUNT_COOKIE, wallet.getAccountId(), {
      path: '/',
    });
  };

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
    availableWallets.map(availableWallet => availableWallet.walletMeta()),
    getWallet,
    setWallet,
  ];
};

export const useAvailableAccounts = (): string[] => {
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [currentWallet] = useWallet();

  useEffect(() => {
    if (!currentWallet) {
      return;
    }

    const getAccounts = async () => {
      const accounts = await currentWallet.getAvailableAccounts();

      setAvailableAccounts(accounts);
    };

    getAccounts().catch(console.error);
  }, [currentWallet, setAvailableAccounts]);

  return availableAccounts;
};

export const usePkAndSignature = (): PkAndSignature | null => {
  const [currentWallet] = useWallet();
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
  }, [currentWallet, pkAndSignature]);

  return pkAndSignature;
};

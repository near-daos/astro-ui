import { WalletService } from 'services/sputnik/SputnikNearService/services/types';
import { useEffectOnce, useList } from 'react-use';
import { configService } from 'services/ConfigService';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';

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

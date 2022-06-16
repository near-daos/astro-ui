import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useEffectOnce, useList } from 'react-use';

// Types
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

// Services
import { configService } from 'services/ConfigService';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/walletServices/SenderWalletService';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/walletServices/SputnikWalletService';

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
    if (isEmpty(availableWallets)) {
      push(initNearWallet());
      initSenderWallet(push, router.reload);
    }
  });

  return availableWallets;
};

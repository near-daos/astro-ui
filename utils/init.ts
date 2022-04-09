import { WalletType } from 'types/config';
import { SputnikNearService } from 'services/sputnik';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { WalletService } from 'services/sputnik/SputnikNearService/services/types';
import { configService } from 'services/ConfigService';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';

export const initNearService = async (
  walletType: WalletType
): Promise<SputnikNearService | undefined> => {
  if (!process.browser) {
    return Promise.resolve(undefined);
  }

  let counter = 0;

  return new Promise(resolve => {
    const intervalId = setInterval(() => {
      if (counter !== undefined && counter === 10) {
        clearInterval(intervalId);

        const { nearConfig } = configService.get();

        const wallets = new Map<WalletType, WalletService>([
          [WalletType.NEAR, new SputnikWalletService(nearConfig)],
        ]);

        const service = new SputnikNearService(wallets, WalletType.NEAR);

        resolve(service);
      }

      if (counter !== undefined) {
        counter += 1;
      }

      if (typeof window.near !== 'undefined' && window.near.isSender) {
        const { nearConfig } = configService.get();

        const wallets = new Map<WalletType, WalletService>([
          [WalletType.NEAR, new SputnikWalletService(nearConfig)],
          [WalletType.SENDER, new SenderWalletService(window.near)],
        ]);

        const service = new SputnikNearService(wallets, walletType);

        clearInterval(intervalId);
        resolve(service);
      }
    }, 500);
  });
};

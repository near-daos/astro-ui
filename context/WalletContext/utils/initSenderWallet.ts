import {
  WalletService,
  SenderWalletInstance,
} from 'services/sputnik/SputnikNearService/walletServices/types';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/walletServices/SenderWalletService';
import { configService } from 'services/ConfigService';

export function initSenderWallet(reload: () => void): Promise<WalletService> {
  return new Promise((resolve, reject) => {
    let counter = 0;

    const intervalId = setInterval(() => {
      if (counter === 10) {
        clearInterval(intervalId);
        reject();
      }

      if (counter !== undefined) {
        counter += 1;
      }

      if (typeof window.near !== 'undefined' && window.near.isSender) {
        window.near.on('accountChanged', () => {
          reload();
        });

        clearInterval(intervalId);

        const { nearConfig } = configService.get();

        resolve(
          new SenderWalletService(
            (window.near as unknown) as SenderWalletInstance,
            nearConfig
          )
        );
      }
    }, 500);
  });
}

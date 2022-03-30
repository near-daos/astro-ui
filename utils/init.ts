import { configService } from 'services/ConfigService';
import { WalletType } from 'types/config';
import { SputnikNearService } from 'services/sputnik';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';

function initWallet(
  selectedWallet: WalletType | undefined,
  isSenderWalletAvailable: boolean
): SputnikNearService | undefined {
  const { nearConfig, appConfig } = configService.get();

  let sputnikService: SputnikNearService;

  if (!appConfig || !nearConfig) {
    return undefined;
  }

  switch (selectedWallet) {
    case WalletType.NEAR: {
      sputnikService = new SputnikNearService(
        new SputnikWalletService(nearConfig)
      );
      break;
    }

    case WalletType.SENDER: {
      // extension was removed, cleaning up the wallet selection, falling back to web wallet
      if (!isSenderWalletAvailable) {
        window.localStorage.removeItem('selectedWallet');

        sputnikService = new SputnikNearService(
          new SputnikWalletService(nearConfig)
        );

        break;
      }

      sputnikService = new SputnikNearService(
        new SenderWalletService(window.near)
      );

      break;
    }

    default: {
      sputnikService = new SputnikNearService(
        new SputnikWalletService(nearConfig)
      );
    }
  }

  sputnikService.isSenderWalletAvailable = isSenderWalletAvailable;

  return sputnikService;
}

export const initNearService = (
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

        const service = initWallet(walletType, false);

        resolve(service);
      }

      if (counter !== undefined) {
        counter += 1;
      }

      if (typeof window.near !== 'undefined' && window.near.isSender) {
        const service = initWallet(walletType, true);

        clearInterval(intervalId);
        resolve(service);
      }
    }, 500);
  });
};

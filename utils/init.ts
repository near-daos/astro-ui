import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { WalletType } from 'types/config';
import { SputnikNearService } from 'services/sputnik';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';
import { dispatchCustomEvent } from 'utils/dispatchCustomEvent';

export const WALLET_INIT_EVENT = 'walletInitialized';

function initWallet(
  selectedWallet: WalletType | undefined,
  isSenderWalletAvailable: boolean
): void {
  const { nearConfig, appConfig } = configService.get();

  if (!appConfig || !nearConfig) {
    return;
  }

  switch (selectedWallet) {
    case WalletType.NEAR: {
      window.nearService = new SputnikNearService(
        new SputnikWalletService(nearConfig)
      );
      break;
    }

    case WalletType.SENDER: {
      // extension was removed, cleaning up the wallet selection, falling back to web wallet
      if (!isSenderWalletAvailable) {
        window.localStorage.removeItem('selectedWallet');

        window.nearService = new SputnikNearService(
          new SputnikWalletService(nearConfig)
        );

        break;
      }

      window.nearService = new SputnikNearService(
        new SenderWalletService(window.near)
      );

      break;
    }

    default: {
      window.nearService = new SputnikNearService(
        new SputnikWalletService(nearConfig)
      );
    }
  }

  window.nearService.isSenderWalletAvailable = isSenderWalletAvailable;

  if (window.nearService.isSignedIn()) {
    dispatchCustomEvent(WALLET_INIT_EVENT, true);
  } else {
    window.nearService.signIn(nearConfig.contractName).then(() => {
      dispatchCustomEvent(WALLET_INIT_EVENT, true);
    });
  }
}

export const initNearService = (
  walletType: WalletType | undefined
): Promise<void> => {
  if (!process.browser) {
    return Promise.resolve();
  }

  // non authorized
  if (!CookieService.get(ACCOUNT_COOKIE)) {
    return Promise.resolve();
  }

  let counter = 0;

  return new Promise(resolve => {
    const intervalId = setInterval(() => {
      if (counter !== undefined && counter === 10) {
        clearInterval(intervalId);
        initWallet(walletType, false);
        resolve();
      }

      if (counter !== undefined) {
        counter += 1;
      }

      if (typeof window.near !== 'undefined' && window.near.isSender) {
        initWallet(walletType, true);
        clearInterval(intervalId);
        resolve();
      }
    }, 500);
  });
};

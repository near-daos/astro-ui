import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { WalletType } from 'types/config';
import { SputnikNearService } from 'services/sputnik';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';
import { dispatchCustomEvent } from 'utils/dispatchCustomEvent';

export const WALLET_INIT_EVENT = 'walletInitialized';

function initNearService(isSenderWalletAvailable: boolean): void {
  const { nearConfig, appConfig } = configService.get();

  if (!appConfig || !nearConfig) {
    return;
  }

  if (!CookieService.get(ACCOUNT_COOKIE)) {
    return;
  }

  const selectedWallet = Number(window.localStorage.getItem('selectedWallet'));

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

        return;
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

export const init = (): void => {
  if (!process.browser) {
    return;
  }

  let counter = 0;

  const intervalId = setInterval(() => {
    if (counter !== undefined && counter === 10) {
      clearInterval(intervalId);
      initNearService(false);

      return;
    }

    if (counter !== undefined) {
      counter += 1;
    }

    if (typeof window.near !== 'undefined' && window.near.isSender) {
      initNearService(true);
      clearInterval(intervalId);
    }
  }, 500);
};

init();

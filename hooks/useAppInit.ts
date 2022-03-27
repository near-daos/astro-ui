import { useEffect } from 'react';
import { configService } from 'services/ConfigService';
import { SputnikNearService } from 'services/sputnik';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { WalletType } from 'types/config';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';
import { ACCOUNT_COOKIE, DAO_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';
import { dispatchCustomEvent } from 'utils/dispatchCustomEvent';
import { CookieService } from 'services/CookieService';
import { useRouter } from 'next/router';
import { useAuthContext } from 'context/AuthContext';

export const WALLET_INIT_EVENT = 'walletInitialized';
export function useAppInit(): void {
  const router = useRouter();
  const { login } = useAuthContext();

  useEffect(() => {
    const { nearConfig, appConfig } = configService.get();

    if (!appConfig || !nearConfig) {
      return;
    }

    if (!CookieService.get(ACCOUNT_COOKIE)) {
      return;
    }

    const selectedWallet = Number(
      window.localStorage.getItem('selectedWallet')
    );

    if (selectedWallet === undefined) {
      window.nearService = new SputnikNearService(
        new SputnikWalletService(nearConfig)
      );
      window.localStorage.removeItem('selectedWallet');
    } else {
      const walletService =
        selectedWallet === WalletType.SENDER
          ? new SenderWalletService(window.near)
          : new SputnikNearService(new SputnikWalletService(nearConfig));

      window.nearService = new SputnikNearService(walletService);
    }

    if (window.nearService.isSignedIn()) {
      dispatchCustomEvent(WALLET_INIT_EVENT, true);
    } else {
      window.nearService.signIn(nearConfig.contractName).then(() => {
        dispatchCustomEvent(WALLET_INIT_EVENT, true);
      });
    }

    CookieService.set(DAO_COOKIE, router.query.dao, DEFAULT_OPTIONS);
  }, [login, router.query.dao]);
}

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

export const WALLET_INIT_EVENT = 'walletInitialized';
export function useAppInit(): void {
  const router = useRouter();

  useEffect(() => {
    const { nearConfig, appConfig } = configService.get();

    if (!appConfig || !nearConfig) {
      return;
    }

    const selectedWallet = Number(
      window.localStorage.getItem('selectedWallet')
    );

    if (!selectedWallet) {
      window.nearService = new SputnikNearService(
        new SputnikWalletService(nearConfig)
      );
    }

    const walletService =
      selectedWallet === WalletType.SENDER
        ? new SenderWalletService(window.near)
        : new SputnikNearService(new SputnikWalletService(nearConfig));

    window.nearService = new SputnikNearService(walletService);

    const accountCookieOptions = appConfig.APP_DOMAIN
      ? { ...DEFAULT_OPTIONS, domain: appConfig.APP_DOMAIN }
      : DEFAULT_OPTIONS;

    const setAccountCookie = () => {
      CookieService.set(
        ACCOUNT_COOKIE,
        window.nearService.getAccountId(),
        accountCookieOptions
      );
    };

    if (window.nearService.isSignedIn()) {
      dispatchCustomEvent('', true);
      setAccountCookie();
    } else {
      walletService.login(nearConfig.contractName).then(() => {
        dispatchCustomEvent(WALLET_INIT_EVENT, true);
        setAccountCookie();
      });
    }

    CookieService.set(DAO_COOKIE, router.query.dao, DEFAULT_OPTIONS);
  }, [router.query.dao]);
}

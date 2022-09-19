import {
  FC,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from 'react';
import get from 'lodash/get';
import { useBoolean } from 'react-use';
import { useRouter } from 'next/router';

import { WalletType } from 'types/config';
import {
  WalletMeta,
  WalletService,
} from 'services/sputnik/SputnikNearService/walletServices/types';

import { configService } from 'services/ConfigService';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikNearService } from 'services/sputnik';
import { ConnectingWalletModal } from 'astro_2.0/features/Auth/components/ConnectingWalletModal';

import { GA_EVENTS, sendGAEvent } from 'utils/ga';
import { isSelectorWalletType } from 'utils/isSelectorWalletType';

import {
  NEAR_WALLET_METADATA,
  SENDER_WALLET_METADATA,
} from 'services/sputnik/SputnikNearService/walletServices/constants';

import { PkAndSignature } from './types';

import { useWallet } from './hooks/useWallet';
import { usePkAndSignature } from './hooks/usePkAndSignature';
import { useAvailableAccounts } from './hooks/useAvailableAccounts';
import { useSelectorLsAccount } from './hooks/walletSelector/useSelectorLsAccount';

export interface WalletContext {
  availableWallets: WalletMeta[];
  currentWallet: WalletType | null;
  accountId: string;
  connectingToWallet: boolean;
  login: (walletType: WalletType) => Promise<void>;
  logout: () => Promise<void>;
  switchAccount: (walletType: WalletType, accountId: string) => void;
  switchWallet: (walletType: WalletType) => void;
  availableAccounts: string[];
  pkAndSignature: PkAndSignature | null;
  // todo get rid of
  nearService: SputnikNearService | null;
}

const WalletContext = createContext<WalletContext>({} as WalletContext);

export const WrappedWalletContext: FC = ({ children }) => {
  const { nearConfig } = configService.get();

  const router = useRouter();

  const [, , removeSelectorLsAccount] = useSelectorLsAccount();
  const [connectingToWallet, setConnectingToWallet] = useBoolean(false);

  const { getWallet, setWallet, currentWallet, removePersistedWallet } =
    useWallet();

  const pkAndSignature = usePkAndSignature(currentWallet);
  const availableAccounts = useAvailableAccounts(currentWallet);
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    async function updateAccountId() {
      if (currentWallet) {
        const account = await currentWallet.getAccountId();

        setCurrentAccount(account);
      }
    }

    updateAccountId();
  }, [currentWallet]);

  const signIn = useCallback(
    async (wallet: WalletService, contractName: string) => {
      setConnectingToWallet(true);

      try {
        await wallet.signIn(contractName);

        setWallet(wallet);

        setConnectingToWallet(false);

        const accountId = await wallet.getAccountId();

        sendGAEvent({
          name: GA_EVENTS.SIGN_IN,
          accountId,
        });

        await router.reload();
      } catch (e) {
        setConnectingToWallet(false);
      }
    },
    [setConnectingToWallet, setWallet, router]
  );

  const login = useCallback(
    async (walletType: WalletType) => {
      const wallet = await getWallet(walletType);

      if (!wallet) {
        return;
      }

      await signIn(wallet, nearConfig.contractName);
    },
    [signIn, getWallet, nearConfig.contractName]
  );

  const logout = useCallback(async () => {
    const accountId = (await currentWallet?.getAccountId()) ?? '';

    sendGAEvent({
      name: GA_EVENTS.SIGN_OUT,
      accountId,
    });

    CookieService.remove(ACCOUNT_COOKIE, { path: '/' });
    removePersistedWallet();

    await currentWallet?.logout();

    router.reload();
  }, [currentWallet, removePersistedWallet, router]);

  const switchAccount = useCallback(
    async (walletType: WalletType, accountId: string) => {
      // Currently its NEAR wallet specific only
      if (walletType !== WalletType.NEAR) {
        return;
      }

      const nearWallet = await getWallet(WalletType.NEAR);

      if (!nearWallet) {
        return;
      }

      // eslint-disable-next-line no-underscore-dangle
      const keypair = await nearWallet
        .getKeyStore()
        .getKey(nearConfig.networkId, accountId);

      if (!keypair) {
        return;
      }

      const authData = {
        accountId,
        allKeys: [keypair.getPublicKey().toString()],
      };

      // new wallet instance will take the new auth_key and will reinit the account
      window.localStorage.setItem(
        'sputnik_wallet_auth_key',
        JSON.stringify(authData)
      );

      CookieService.set(ACCOUNT_COOKIE, accountId, {
        path: '/',
      });

      sendGAEvent({
        name: GA_EVENTS.SWITCH_ACCOUNT,
        accountId,
      });

      router.reload();
    },
    [getWallet, nearConfig.networkId, router]
  );

  const switchWallet = useCallback(
    async (walletType: WalletType) => {
      const selectedWallet = await getWallet(walletType);

      if (!selectedWallet || !currentWallet) {
        return;
      }

      await signIn(selectedWallet, nearConfig.contractName);

      const currentWalletAccountId = await currentWallet.getAccountId();
      const selectedWalletAccountId = await selectedWallet.getAccountId();

      sendGAEvent({
        name: GA_EVENTS.SWITCH_WALLET,
        accountId: selectedWalletAccountId,
        params: {
          wallet: walletType,
          previousAccountId: currentWalletAccountId,
        },
      });

      if (currentWalletAccountId !== selectedWalletAccountId) {
        if (isSelectorWalletType(currentWallet.getWalletType())) {
          removeSelectorLsAccount();
        }

        router.reload();
      }
    },
    [
      router,
      signIn,
      getWallet,
      currentWallet,
      nearConfig.contractName,
      removeSelectorLsAccount,
    ]
  );

  const walletContext = useMemo(() => {
    const availableWallets = [NEAR_WALLET_METADATA];

    const senderWalletAvailable = get(window, 'near.isSender') || false;

    if (senderWalletAvailable) {
      availableWallets.push(SENDER_WALLET_METADATA);
    }

    return {
      login,
      logout,
      switchWallet,
      switchAccount,
      pkAndSignature,
      availableWallets,
      availableAccounts,
      connectingToWallet,
      accountId: currentAccount,
      currentWallet: currentWallet?.getWalletType() ?? null,
      nearService: currentWallet ? new SputnikNearService(currentWallet) : null,
    };
  }, [
    login,
    logout,
    switchWallet,
    switchAccount,
    currentWallet,
    pkAndSignature,
    currentAccount,
    availableAccounts,
    connectingToWallet,
  ]);

  return (
    <WalletContext.Provider value={walletContext}>
      {children}
      {connectingToWallet && (
        <ConnectingWalletModal
          isOpen
          onClose={() => setConnectingToWallet(false)}
          walletType={walletContext?.currentWallet ?? WalletType.NEAR}
        />
      )}
    </WalletContext.Provider>
  );
};

export function useWalletContext(): WalletContext {
  return useContext(WalletContext);
}

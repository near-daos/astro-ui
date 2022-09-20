import React, { FC, useMemo } from 'react';
import { configService } from 'services/ConfigService';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import { useWalletContext } from 'context/WalletContext';
import { useCookie } from 'react-use';

export const FeatureFlagsProvider: FC = ({ children }) => {
  const { accountId } = useWalletContext();
  const [accountIdCookie] = useCookie('account');
  const account = accountId || accountIdCookie;

  const ldProps = useMemo(() => {
    const { appConfig } = configService.get();

    return {
      user: {
        key: account || 'Anonymous',
        anonymous: !account,
      },
      clientSideID: appConfig.LAUNCHDARKLY_ID as string,
      reactOptions: {
        useCamelCaseFlagKeys: true,
      },
    };
  }, [account]);

  return <LDProvider {...ldProps}>{children}</LDProvider>;
};

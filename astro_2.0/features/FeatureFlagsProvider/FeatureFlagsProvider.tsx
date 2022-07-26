import React, { FC, useMemo } from 'react';
import { configService } from 'services/ConfigService';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import { useWalletContext } from 'context/WalletContext';

export const FeatureFlagsProvider: FC = ({ children }) => {
  const { accountId } = useWalletContext();

  const ldProps = useMemo(() => {
    const { appConfig } = configService.get();

    return {
      user: {
        key: accountId || 'Anonymous',
        anonymous: !accountId,
      },
      clientSideID: appConfig.LAUNCHDARKLY_ID as string,
      reactOptions: {
        useCamelCaseFlagKeys: true,
      },
    };
  }, [accountId]);

  return (
    <LDProvider {...ldProps} key={accountId}>
      {children}
    </LDProvider>
  );
};

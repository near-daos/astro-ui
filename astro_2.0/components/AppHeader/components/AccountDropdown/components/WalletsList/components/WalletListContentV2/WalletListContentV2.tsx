import { useMemo, VFC } from 'react';

import { WalletType } from 'types/config';

import { useWalletContext } from 'context/WalletContext';

import { WalletAccountV2 } from './components/WalletAccountV2';

interface WalletListContentV2Props {
  switchWalletHandler: (wallet: WalletType) => () => void;
  switchAccountHandler: (account: string) => () => void;
}

export const WalletListContentV2: VFC<WalletListContentV2Props> = props => {
  const { switchWalletHandler, switchAccountHandler } = props;

  const { accountId, availableAccounts } = useWalletContext();

  const sortedAccounts = useMemo(() => {
    return availableAccounts.sort((a, b) => {
      if (a.acc === accountId) {
        return -1;
      }

      if (b.acc === accountId) {
        return 1;
      }

      return 0;
    });
  }, [accountId, availableAccounts]);

  return (
    <div>
      {sortedAccounts.map(account => {
        return (
          <WalletAccountV2
            key={account.acc}
            account={account}
            active={account.acc === accountId}
            switchWalletHandler={switchWalletHandler}
            switchAccountHandler={switchAccountHandler}
          />
        );
      })}
    </div>
  );
};

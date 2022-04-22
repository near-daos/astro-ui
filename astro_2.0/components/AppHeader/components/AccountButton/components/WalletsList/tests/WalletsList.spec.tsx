import { render } from 'jest/testUtils';

import { WalletMeta } from 'services/sputnik/SputnikNearService/services/types';
import { WalletsList } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletsList';

describe('WalletsList', () => {
  it('Should render component', () => {
    const wallets = ([
      { id: 'NEAR' },
      { id: 'SENDER' },
    ] as unknown) as WalletMeta[];

    render(
      <WalletsList
        logoutHandler={() => Promise.resolve()}
        availableNearAccounts={[]}
        availableWallets={wallets}
        selectedWallet={0}
        switchAccountHandler={() => () => 0}
        switchWalletHandler={() => () => 0}
        closeDropdownHandler={() => 0}
      />
    );
  });
});

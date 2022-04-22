import { render } from 'jest/testUtils';

import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletButton';

describe('WalletButton', () => {
  it('Should render component', () => {
    const name = 'Wallet Name';

    const { getByText } = render(
      <WalletButton
        url=""
        type=""
        name={name}
        walletType={0}
        onClick={() => 0}
      />
    );

    expect(getByText(name)).toBeTruthy();
  });
});

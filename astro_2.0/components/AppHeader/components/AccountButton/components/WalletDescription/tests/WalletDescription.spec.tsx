import { render } from 'jest/testUtils';

import { WalletDescription } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletDescription';

describe('WalletDescription', () => {
  it('Should render component', () => {
    const name = 'Wallet name';
    const type = 'Wallet type';
    const url = 'Wallet url';

    const { getByText } = render(
      <WalletDescription name={name} type={type} url={url} />
    );

    expect(getByText(name)).toBeTruthy();
    expect(getByText(type, { exact: false })).toBeTruthy();
    expect(getByText(url)).toBeTruthy();
  });
});

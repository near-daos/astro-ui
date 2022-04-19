import { render } from 'jest/testUtils';

import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletIcon';

jest.mock('astro_2.0/components/NearIcon', () => {
  return {
    NearIcon: () => <div>NearIcon</div>,
  };
});

jest.mock('astro_2.0/components/SenderIcon', () => {
  return {
    SenderIcon: () => <div>SenderIcon</div>,
  };
});

describe('WalletIcon', () => {
  it('Should render Near icon', () => {
    const { getByText } = render(<WalletIcon walletType={0} isSelected />);

    expect(getByText('NearIcon')).toBeTruthy();
  });

  it('Should render Sender icon', () => {
    const { getByText } = render(
      <WalletIcon walletType={1} isSelected={false} />
    );

    expect(getByText('SenderIcon')).toBeTruthy();
  });

  it('Should render Near icon by default', () => {
    const { getByText } = render(<WalletIcon walletType={3} isSelected />);

    expect(getByText('NearIcon')).toBeTruthy();
  });
});

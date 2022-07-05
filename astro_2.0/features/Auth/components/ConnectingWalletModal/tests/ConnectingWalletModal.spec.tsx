import { render } from 'jest/testUtils';

import { WalletType } from 'types/config';

import { ConnectingWalletModal } from 'astro_2.0/features/Auth/components/ConnectingWalletModal';

jest.mock('components/modal', () => {
  return {
    Modal: ({ children }: { children: unknown }) => children,
  };
});

describe('ConnectingWalletModal', () => {
  it('Should render component', () => {
    const { getByText } = render(
      <ConnectingWalletModal
        isOpen
        onClose={() => 0}
        walletType={WalletType.NEAR}
      />
    );

    expect(getByText('Connecting to wallet')).toBeTruthy();
  });
});

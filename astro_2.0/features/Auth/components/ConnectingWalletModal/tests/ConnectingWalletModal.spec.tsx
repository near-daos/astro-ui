import { render } from 'jest/testUtils';

import { ConnectingWalletModal } from 'astro_2.0/features/Auth/components/ConnectingWalletModal';

jest.mock('components/modal', () => {
  return {
    Modal: ({ children }: { children: unknown }) => children,
  };
});

describe('ConnectingWalletModal', () => {
  it('Should render component', () => {
    const { getByText } = render(
      <ConnectingWalletModal isOpen onClose={() => 0} walletType={0} />
    );

    expect(getByText('Connecting to wallet')).toBeTruthy();
  });
});

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { WalletSelectionModal } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletSelectionModal';

jest.mock('components/modal', () => {
  return {
    Modal: ({ children }: { children: unknown }) => children,
  };
});

describe('WalletSelectionModal', () => {
  it('Should sign in Near wallet', () => {
    const signIn = jest.fn();

    const { getAllByRole } = render(
      <WalletSelectionModal isOpen onClose={() => 0} signIn={signIn} />
    );

    fireEvent.click(getAllByRole('button')[0]);

    expect(signIn).toBeCalledWith(0);
  });

  it('Should sign in Sender wallet', () => {
    const signIn = jest.fn();

    const { getAllByRole } = render(
      <WalletSelectionModal isOpen onClose={() => 0} signIn={signIn} />
    );

    fireEvent.click(getAllByRole('button')[2]);

    expect(signIn).toBeCalledWith(1);
  });
});

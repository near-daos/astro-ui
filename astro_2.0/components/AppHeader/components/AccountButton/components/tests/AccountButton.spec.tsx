/* eslint-disable @typescript-eslint/ban-ts-comment,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */

import React, { ReactNode } from 'react';
import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { WalletType } from 'types/config';
import { WalletsListProps } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletsList';

import { useAuthContext } from 'context/AuthContext';

import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { AccountButton } from 'astro_2.0/components/AppHeader/components/AccountButton';

const accountId = 'My account Id';

const context = {
  accountId: 'My account Id',
  nearService: {
    getWalletType: () => 0,
    availableWallets: () => [],
  },
};

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useState: jest.fn(() => []),
  };
});

jest.mock('context/AuthContext', () => {
  return {
    useAuthContext: jest.fn(() => context),
  };
});

jest.mock(
  'astro_2.0/components/AppHeader/components/AccountButton/components/WalletsList',
  () => {
    return {
      WalletsList: ({
        switchWalletHandler,
        switchAccountHandler,
        closeDropdownHandler,
      }: WalletsListProps) => {
        return (
          <div>
            <div onClick={closeDropdownHandler}>closeDropdownHandler</div>
            {/* @ts-ignore */}
            <div onClick={switchWalletHandler('New Wallet')}>
              switchWalletHandler
            </div>
            <div onClick={switchAccountHandler('New Account')}>
              switchAccountHandler
            </div>
          </div>
        );
      },
    };
  }
);

jest.mock('astro_2.0/components/GenericDropdown', () => {
  return {
    GenericDropdown: jest.fn(),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook does not generate warnings in console
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('AccountButton', () => {
  it('Should render component', () => {
    // @ts-ignore
    GenericDropdown.mockImplementation(({ parent }: { parent: ReactNode }) => (
      <div>{parent}</div>
    ));

    const { getByText } = render(<AccountButton />);

    expect(getByText(accountId)).toBeTruthy();
  });

  it('Should close dropdown', () => {
    const setOpen = jest.fn();

    // @ts-ignore
    GenericDropdown.mockImplementation(
      ({ children }: { children: ReactNode }) => <div>{children}</div>
    );

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, setOpen]);

    const { getByText } = render(<AccountButton />);

    fireEvent.click(getByText('closeDropdownHandler'));

    expect(setOpen).toBeCalledWith(false);
  });

  it('Should switch account', () => {
    const switchAccount = jest.fn();

    // @ts-ignore
    useAuthContext.mockImplementation(() => ({
      ...context,
      switchAccount,
    }));

    // @ts-ignore
    GenericDropdown.mockImplementation(
      ({ children }: { children: ReactNode }) => <div>{children}</div>
    );

    const { getByText } = render(<AccountButton />);

    fireEvent.click(getByText('switchAccountHandler'));

    expect(switchAccount).toBeCalledWith(WalletType.NEAR, 'New Account');
  });

  it('Should switch wallet', () => {
    const switchWallet = jest.fn();

    // @ts-ignore
    useAuthContext.mockImplementation(() => ({
      ...context,
      switchWallet,
    }));

    // @ts-ignore
    GenericDropdown.mockImplementation(
      ({ children }: { children: ReactNode }) => <div>{children}</div>
    );

    const { getByText } = render(<AccountButton />);

    fireEvent.click(getByText('switchWalletHandler'));

    expect(switchWallet).toBeCalledWith('New Wallet');
  });
});

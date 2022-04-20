/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';

import { useAuthContext } from 'context/AuthContext';

import { WalletWithAccounts } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletWithAccounts';

jest.mock('context/AuthContext', () => {
  return {
    useAuthContext: jest.fn(() => ({})),
  };
});

describe('WalletWithAccounts', () => {
  it('Should render component', () => {
    // @ts-ignore
    useAuthContext.mockImplementation(() => ({
      accountId: '1',
    }));

    const { getByText } = render(
      <WalletWithAccounts
        wallet={{
          id: 0,
          name: 'NEAR',
          type: 'NEAR',
          url: 'url',
        }}
        isSelected
        accounts={['2', '1', '3']}
        switchAccountHandler={() => () => 0}
        switchWalletHandler={() => () => 0}
      />
    );

    expect(getByText('NEAR')).toBeTruthy();
  });
});

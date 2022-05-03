/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { useModal } from 'components/modal';

import { WalletIdCard } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard';

jest.mock('components/modal', () => {
  return {
    useModal: jest.fn(() => []),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('WalletIdCard', () => {
  const email = 'my email';

  const config = {
    accountId: 'accountId',
    email,
    isEmailVerified: true,
    phoneNumber: 'my phone',
    isPhoneVerified: false,
  };

  it('Should render component', () => {
    const { getByText } = render(
      <WalletIdCard contactsConfig={config} setConfig={() => 0} />
    );

    expect(getByText(email)).toBeTruthy();
  });

  it('Should call email modal', () => {
    const showModal = jest.fn();

    // @ts-ignore
    useModal.mockImplementation(() => [showModal]);

    const { getByText } = render(
      <WalletIdCard contactsConfig={config} setConfig={() => 0} />
    );

    fireEvent.click(getByText('myAccountPage.edit'));

    expect(showModal).toBeCalledWith(
      expect.objectContaining({
        isEdit: true,
        isEmail: true,
      })
    );
  });

  it('Should call phone modal', () => {
    const showModal = jest.fn();

    // @ts-ignore
    useModal.mockImplementation(() => [showModal]);

    const { getByText } = render(
      <WalletIdCard contactsConfig={config} setConfig={() => 0} />
    );

    fireEvent.click(getByText('myAccountPage.add'));

    expect(showModal).toBeCalledWith(
      expect.objectContaining({
        isEdit: false,
        isEmail: false,
      })
    );
  });
});

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { act, RenderResult } from '@testing-library/react';

import { UserContacts } from 'services/NotificationsService/types';

import { NotificationsService } from 'services/NotificationsService';

import {
  AddUserInfoModal,
  AddUserInfoModalProps,
} from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard/components/AddUserInfoModal';

jest.mock('components/modal', () => {
  return {
    Modal: ({ children }: { children: unknown }) => children,
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

describe('AddUserInfoModal', () => {
  const accountId = '123456';
  const email = 'asd@asd.com';

  function renderComponent(
    props?: Partial<AddUserInfoModalProps>
  ): RenderResult {
    return render(
      <AddUserInfoModal
        isOpen
        isEdit
        isEmail
        onClose={() => 0}
        accountId={accountId}
        setConfig={() => 0}
        pkAndSignature={null}
        {...props}
      />
    );
  }

  it('Should render "edit" modal', () => {
    const { getByText } = renderComponent();

    expect(getByText('myAccountPage.popup.email.editTitle')).toBeTruthy();
  });

  it('Should render "add" modal', () => {
    const { getByText } = renderComponent({ isEdit: false, isEmail: false });

    expect(getByText('myAccountPage.popup.phone.addTitle')).toBeTruthy();
  });

  it('Should send email', async () => {
    const sendContact = jest.fn();

    NotificationsService.sendContact = sendContact;

    const { getByText, getByTestId } = renderComponent();

    fireEvent.change(getByTestId('contact-input'), {
      target: { value: email },
    });

    fireEvent.click(getByText('myAccountPage.popup.send'));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(sendContact).toBeCalledWith(accountId, email, null, true);
  });

  it('Should verify code', async () => {
    const code = '123456789';

    const verifyContact = jest.fn(() => Promise.resolve(true));
    const getUserContactConfig = jest.fn(() =>
      Promise.resolve({} as unknown as UserContacts)
    );

    NotificationsService.verifyContact = verifyContact;

    NotificationsService.getUserContactConfig = getUserContactConfig;

    const { getAllByRole, getByTestId } = renderComponent();

    act(() => {
      fireEvent.change(getByTestId('verification-input'), {
        target: { value: code },
      });
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    fireEvent.click(getAllByRole('button')[1]);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(verifyContact).toBeCalledWith(accountId, code, null, true);
  });
});

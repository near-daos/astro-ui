/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { UserContacts } from 'services/NotificationsService/types';

import { useNotificationsSettings } from 'astro_2.0/features/Notifications/hooks';

import {
  NotificationCard,
  NotificationCardProps,
} from 'astro_2.0/features/pages/myAccount/cards/NotificationCard';
import { RenderResult } from '@testing-library/react';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
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

jest.mock('astro_2.0/features/Notifications/hooks', () => {
  return {
    useNotificationsSettings: jest.fn(() => ({})),
  };
});

describe('NotificationCard', () => {
  function renderComponent(
    props?: Partial<NotificationCardProps>
  ): RenderResult {
    return render(
      <NotificationCard
        smsEnabled
        emailEnabled
        contactsConfig={{} as unknown as UserContacts}
        {...props}
      />
    );
  }

  it('Should render component', () => {
    const { getByText } = renderComponent();

    expect(getByText('myAccountPage.phone')).toBeTruthy();
  });

  it('Should navigate to "Noties Settings" page', () => {
    const push = jest.fn();

    // @ts-ignore
    useRouter.mockImplementation(() => ({
      push,
    }));

    const { getByText } = renderComponent();

    fireEvent.click(getByText('myAccountPage.settings'));

    expect(push).toBeCalled();
  });

  it('Should toggle email', () => {
    const emailEnabled = true;
    const updateSettings = jest.fn();

    // @ts-ignore
    useNotificationsSettings.mockImplementation(() => ({
      updateSettings,
    }));

    const { getAllByRole } = renderComponent({
      emailEnabled,
      contactsConfig: { isEmailVerified: true } as unknown as UserContacts,
    });

    fireEvent.click(getAllByRole('checkbox')[0]);

    expect(updateSettings).toBeCalledWith({
      enableEmail: !emailEnabled,
    });
  });

  it('Should toggle phone', () => {
    const smsEnabled = true;
    const updateSettings = jest.fn();

    // @ts-ignore
    useNotificationsSettings.mockImplementation(() => ({
      updateSettings,
    }));

    const { getAllByRole } = renderComponent({
      smsEnabled,
      contactsConfig: { isPhoneVerified: true } as unknown as UserContacts,
    });

    fireEvent.click(getAllByRole('checkbox')[1]);

    expect(updateSettings).toBeCalledWith({
      enableSms: !smsEnabled,
    });
  });
});

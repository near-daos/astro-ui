/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';

import { FEATURE_FLAGS } from 'constants/featureFlags';

import { useAuthContext } from 'context/AuthContext';
import { useNotifications } from 'astro_2.0/features/Notifications';

import { NotificationsBell } from 'astro_2.0/components/AppHeader/components/NotificationsBell';

jest.mock('context/AuthContext', () => {
  return {
    useAuthContext: jest.fn(),
  };
});

jest.mock('astro_2.0/features/Notifications', () => {
  return {
    useNotifications: jest.fn(() => ({})),
  };
});

describe('notifications bell', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Should render nothing if feature flag is false', () => {
    FEATURE_FLAGS.NOTIFICATIONS = false;

    // @ts-ignore
    useAuthContext.mockImplementation(() => ({
      accountId: '123',
    }));

    const { container } = render(<NotificationsBell />);

    expect(container).toMatchSnapshot();
  });

  it('Should render component if feature flag is true and account id available', () => {
    FEATURE_FLAGS.NOTIFICATIONS = true;

    // @ts-ignore
    useAuthContext.mockImplementation(() => ({
      accountId: '123',
    }));

    const { container } = render(<NotificationsBell />);

    expect(container).toMatchSnapshot();
  });

  it('Should render "notifications" icon if unread notifications presented', () => {
    // @ts-ignore
    useNotifications.mockImplementation(() => ({
      notifications: [{ isRead: false }],
    }));

    // @ts-ignore
    useAuthContext.mockImplementation(() => ({
      accountId: '123',
    }));

    const component = render(<NotificationsBell />);

    expect(component.queryAllByTestId('notifications-icon')).toHaveLength(1);
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */

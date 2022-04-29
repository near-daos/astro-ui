import { render } from 'jest/testUtils';
import { act, screen } from '@testing-library/react';

import {
  NOTIFICATION_TYPES,
  NotificationRawData,
  showNotification,
  hideNotificationId,
  NotificationContainer,
  hideNotificationByTag,
} from 'features/notifications';

describe('NotificationContainer', () => {
  const description = 'Hello World';

  function showNoty(msToRun = 200, notyProps?: Partial<NotificationRawData>) {
    render(<NotificationContainer />);

    act(() => {
      showNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        description,
        ...notyProps,
      });

      jest.advanceTimersByTime(msToRun);
    });
  }

  it('Should render notification', () => {
    jest.useFakeTimers();

    showNoty();

    expect(screen.getByText(description)).toBeTruthy();
  });

  it('Should hide notification by lifetime', () => {
    jest.useFakeTimers();

    showNoty(200, { lifetime: 400, type: NOTIFICATION_TYPES.ERROR });

    expect(screen.getByText(description)).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(screen.queryByText(description)).toBeFalsy();
  });

  it('Should remove notification by tag', () => {
    const tag = '234';

    jest.useFakeTimers();

    showNoty(300, { tag, type: NOTIFICATION_TYPES.INFO });

    expect(screen.getByText(description)).toBeTruthy();

    act(() => {
      hideNotificationByTag(tag);

      jest.advanceTimersByTime(1500);
    });

    expect(screen.queryByText(description)).toBeFalsy();
  });

  it('Should remove notification by id', () => {
    const tag = '234';

    jest.useFakeTimers();

    showNoty(300, { tag });

    expect(screen.getByText(description)).toBeTruthy();

    act(() => {
      hideNotificationId('0');

      jest.advanceTimersByTime(1500);
    });

    expect(screen.queryByText(description)).toBeFalsy();
  });
});

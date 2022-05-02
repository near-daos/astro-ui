/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { NOTIFICATION_TYPES } from 'features/notifications';

import { dispatchCustomEvent } from 'utils/dispatchCustomEvent';

import { Notification } from 'features/notifications/Notification';

jest.mock('utils/dispatchCustomEvent', () => {
  return {
    dispatchCustomEvent: jest.fn(),
  };
});

describe('Notification', () => {
  it('Should close notification', () => {
    const mock = jest.fn();

    // @ts-ignore
    dispatchCustomEvent.mockImplementation(mock);

    const { getByTestId } = render(
      <Notification
        id="123"
        description="Some description"
        timestamp={new Date().getTime()}
        type={NOTIFICATION_TYPES.SUCCESS}
      />
    );

    fireEvent.click(getByTestId('agn-close-button'));

    expect(mock).toBeCalled();
  });
});

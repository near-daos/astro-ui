/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';

import { FEATURE_FLAGS } from 'constants/featureFlags';

import { NotificationsBell } from 'astro_2.0/components/AppHeader/components/NotificationsBell';

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

describe('notifications bell', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Should render nothing if feature flag is false', () => {
    FEATURE_FLAGS.NOTIFICATIONS = false;

    const { container } = render(<NotificationsBell />);

    expect(container).toMatchSnapshot();
  });

  it('Should render component if feature flag is true', () => {
    FEATURE_FLAGS.NOTIFICATIONS = true;

    const { getByText } = render(<NotificationsBell />);

    expect(getByText('noteBell')).toBeInTheDocument();
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */

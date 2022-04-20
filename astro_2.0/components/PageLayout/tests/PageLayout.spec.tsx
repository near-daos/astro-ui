import { render } from 'jest/testUtils';

import { PageLayout } from 'astro_2.0/components/PageLayout';

// eslint-disable-next-line global-require
jest.mock('next/dist/client/router', () => require('next-router-mock'));
jest.mock('features/notifications', () => {
  return {
    NotificationContainer: () => 'NotificationContainer',
    useNotifications: jest.fn(() => ({})),
  };
});

describe('page layout', () => {
  it('Should render component', () => {
    const { container } = render(<PageLayout>Hello World!</PageLayout>);

    expect(container).toMatchSnapshot();
  });
});

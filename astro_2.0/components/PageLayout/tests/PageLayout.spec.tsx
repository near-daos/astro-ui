import { render } from 'jest/testUtils';

import { PageLayout } from 'astro_2.0/components/PageLayout';

jest.mock('features/notifications', () => {
  return {
    NotificationContainer: () => 'NotificationContainer',
    useNotifications: jest.fn(() => ({})),
  };
});

describe('page layout', () => {
  it('Should render component', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const useRouter = jest.spyOn(require('next/router'), 'useRouter');

    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    }));

    const { container } = render(<PageLayout>Hello World!</PageLayout>);

    expect(container).toMatchSnapshot();
  });
});

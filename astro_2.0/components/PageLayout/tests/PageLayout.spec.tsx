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
    const content = 'Hello World!';

    const { getByText } = render(
      <PageLayout appVersion={2}>{content}</PageLayout>
    );

    expect(getByText(content)).toBeInTheDocument();
  });
});

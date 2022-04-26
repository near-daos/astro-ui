import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { NotificationsGroupStatus } from 'types/notification';

import { NotificationsDisableModal } from 'astro_2.0/components/NotificationsDisableModal';

jest.mock('components/modal', () => {
  return {
    Modal: ({ children }: { children: unknown }) => children,
  };
});

describe('NotificationsDisableModal', () => {
  const options = [
    {
      value: '',
      label: NotificationsGroupStatus.Enabled,
    },
    {
      value: 'OneDay',
      label: NotificationsGroupStatus.OneDay,
    },
  ];

  it('Should render component', () => {
    const text = 'Hello World!';

    const { getByText } = render(
      <NotificationsDisableModal
        isOpen
        text={text}
        value={0}
        options={options}
        onClose={() => 0}
      />
    );

    expect(getByText(text)).toBeTruthy();
  });

  it('Should close popup on option change', () => {
    const onClose = jest.fn();

    const { getAllByRole } = render(
      <NotificationsDisableModal
        isOpen
        text=""
        value={0}
        options={options}
        onClose={onClose}
      />
    );

    fireEvent.click(getAllByRole('radio')[1]);

    expect(onClose).toBeCalledWith(24 * 60 * 60 * 1000);
  });
});

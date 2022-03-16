/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';
import { useFormContext } from 'react-hook-form';

import { DaoPreviewForm } from 'astro_2.0/features/CreateDao/components/DaoPreviewForm';

const formContextMock = {
  watch: () => 0,
  setValue: () => 0,
  getValues: (key: string) => {
    if (!key) {
      return 0;
    }

    return [];
  },
  formState: {
    touchedFields: {},
  },
  register: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('DaoPreviewForm', () => {
  it('Should render nothing if not enough info', () => {
    const { container } = render(<DaoPreviewForm />);

    expect(container).toMatchSnapshot();
  });

  it('Should render component', () => {
    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      getValues: () => ({
        address: 'address',
        displayName: 'displayName',
        proposals: 'open',
        voting: 'democratic',
        structure: 'flat',
      }),
    }));

    const { container } = render(<DaoPreviewForm />);

    expect(container).toMatchSnapshot();
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';

import { DaoSubmitForm } from 'astro_2.0/features/CreateDao/components/DaoSubmitForm';
import { useFormContext } from 'react-hook-form';

const formContextMock = {
  formState: {
    errors: {},
  },
  watch: () => 0,
  register: () => 0,
  handleSubmit: () => 0,
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

describe('DaoSubmitForm', () => {
  it('Should render error message', () => {
    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      formState: {
        errors: {
          hello: 'world',
        },
      },
    }));

    const { getByText } = render(<DaoSubmitForm />);

    expect(getByText('createDAO.daoSubmitForm.daoSubmitError')).toBeTruthy();
  });
});

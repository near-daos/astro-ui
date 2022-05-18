/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { AddMemberToGroupContent } from 'astro_2.0/features/CreateProposal/components/AddMemberToGroupContent';
import { useFormContext } from 'react-hook-form';

const formContextMock = {
  formState: {
    errors: {},
  },
  setValue: () => 0,
  register: () => 0,
  watch: () => '',
  getValues: () => ({
    group: 'Gr1',
  }),
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

describe('AddMemberToGroupContent', () => {
  jest.useFakeTimers();

  it('Should change group', () => {
    const setValue = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      setValue,
    }));

    const { getByText } = render(
      <AddMemberToGroupContent groups={['Gr1', 'Gr2']} />
    );

    fireEvent.click(getByText('Gr1'));
    fireEvent.click(getByText('Gr2'));

    jest.runAllTimers();

    expect(setValue).toBeCalledWith('group', 'Gr2', expect.anything());
  });
});

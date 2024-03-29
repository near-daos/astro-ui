/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { useFormContext } from 'react-hook-form';

import { RemoveMemberFromGroupContent } from 'astro_2.0/features/CreateProposal/components/RemoveMemberFromGroupContent';
import { act } from '@testing-library/react';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  register: () => 0,
  getValues: () => ({
    group: 'GR1',
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

describe('RemoveMemberFromGroupContent', () => {
  jest.useFakeTimers();

  it.skip('Should update selected group', () => {
    const setValue = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      setValue,
    }));

    const { getByText } = render(
      <RemoveMemberFromGroupContent groups={['GR1', 'GR2']} />
    );

    act(() => {
      fireEvent.click(getByText('GR1'));
    });

    jest.runAllTimers();

    expect(setValue).toBeCalledWith('group', 'GR1', {
      shouldDirty: true,
      shouldValidate: true,
    });
  });
});

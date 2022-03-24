/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import CustomFunctionCallContent from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent';

import { tokens } from './mock';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  watch: () => '123',
  register: () => 0,
  setValue: () => 0,
  getValues: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('astro_2.0/features/CustomTokens/CustomTokensContext', () => {
  return {
    useCustomTokensContext: jest.fn(),
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

describe('CustomFunctionCallContent', () => {
  jest.useFakeTimers();

  it('Should render component', () => {
    // @ts-ignore
    useCustomTokensContext.mockImplementation(() => ({ tokens }));

    const { getByText } = render(<CustomFunctionCallContent />);

    expect(getByText('Smart Contract Address')).toBeTruthy();
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';

import { BuyNftFromMintbaseContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/BuyNftFromMintbaseContent';

import { useDaoCustomTokens } from 'context/DaoTokensContext';

import { tokens } from './mock';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  watch: () => 0,
  setValue: () => 0,
  register: () => 0,
  getValues: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('context/DaoTokensContext', () => {
  return {
    useDaoCustomTokens: jest.fn(),
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

describe('BuyNftFromMintbaseContent', () => {
  jest.useFakeTimers();

  it('Should render component', () => {
    // @ts-ignore
    useDaoCustomTokens.mockImplementation(() => ({ tokens }));

    const { getByText } = render(<BuyNftFromMintbaseContent />);

    expect(getByText('Token Key')).toBeTruthy();
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { useFormContext } from 'react-hook-form';

import { BuyNftFromMintbaseContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/BuyNftFromMintbaseContent';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

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

describe('BuyNftFromMintbaseContent', () => {
  jest.useFakeTimers();

  it('Should render component', () => {
    // @ts-ignore
    useCustomTokensContext.mockImplementation(() => ({ tokens }));

    const { getByText } = render(<BuyNftFromMintbaseContent />);

    expect(getByText('Token Key')).toBeTruthy();
  });

  it('Should update token', () => {
    const setValue = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      setValue,
    }));

    // @ts-ignore
    useCustomTokensContext.mockImplementation(() => ({ tokens }));

    const { getByText } = render(<BuyNftFromMintbaseContent />);

    fireEvent.click(getByText('hours'));
    fireEvent.click(getByText('minutes'));

    jest.runAllTimers();

    expect(setValue).toBeCalledWith('timeoutGranularity', 'Minutes', {
      shouldDirty: true,
    });
  });
});

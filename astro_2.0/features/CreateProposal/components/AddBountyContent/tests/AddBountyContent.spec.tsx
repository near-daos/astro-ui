/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { useFormContext } from 'react-hook-form';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { AddBountyContent } from 'astro_2.0/features/CreateProposal/components/AddBountyContent';

import { tokens } from './mock';

const formContextMock = {
  formState: {
    errors: {},
  },
  watch: () => 0,
  setValue: () => 0,
  getValues: (key: string) => {
    if (!key) {
      return 0;
    }

    return [];
  },
  register: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('astro_2.0/components/LoadingIndicator', () => {
  return {
    LoadingIndicator: () => <div>Loading...</div>,
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

jest.mock('astro_2.0/features/CustomTokens/CustomTokensContext', () => {
  return {
    useCustomTokensContext: jest.fn(),
  };
});

describe('AddBountyContent', () => {
  jest.useFakeTimers();

  it('Should render component', () => {
    // @ts-ignore
    useCustomTokensContext.mockImplementation(() => ({ tokens }));

    const { container } = render(<AddBountyContent />);

    expect(container).toMatchSnapshot();
  });

  it('Should render loading indicator if no tokens', () => {
    // @ts-ignore
    useCustomTokensContext.mockImplementation(() => ({
      tokens: {},
    }));

    const { getByText } = render(<AddBountyContent />);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('Should update token value', () => {
    const setValue = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      setValue,
    }));

    // @ts-ignore
    useCustomTokensContext.mockImplementation(() => ({ tokens }));

    const { getByText } = render(<AddBountyContent />);

    fireEvent.click(getByText('NEAR'));
    fireEvent.click(getByText('BIBA'));

    jest.runAllTimers();

    expect(setValue).toBeCalled();
  });
});

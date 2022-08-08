/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { useFormContext } from 'react-hook-form';

import { useDaoCustomTokens } from 'context/DaoTokensContext';

import { TransferContent } from 'astro_2.0/features/CreateProposal/components/TransferContent';

import { tokens } from './mock';

const formContextMock = {
  formState: {
    errors: {},
  },
  watch: () => 0,
  register: () => 0,
  setValue: () => 0,
  getValues: () => ({}),
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

describe('TransferContent', () => {
  jest.useFakeTimers();

  it('Should render component', () => {
    // @ts-ignore
    useDaoCustomTokens.mockImplementation(() => ({ tokens }));

    const { getByText } = render(<TransferContent />);

    expect(getByText('NEAR')).toBeTruthy();
  });

  it('Should render loader if no tokens', () => {
    // @ts-ignore
    useDaoCustomTokens.mockImplementation(() => ({
      tokens: {},
    }));

    const { getByText } = render(<TransferContent />);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('Should update token on token selection', () => {
    const setValue = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      setValue,
    }));

    // @ts-ignore
    useDaoCustomTokens.mockImplementation(() => ({ tokens }));

    const { getByText } = render(<TransferContent />);

    fireEvent.click(getByText('NEAR'));
    fireEvent.click(getByText('BIBA'));

    jest.runAllTimers();

    expect(setValue).toBeCalledWith('token', 'BIBA', expect.anything());
  });
});

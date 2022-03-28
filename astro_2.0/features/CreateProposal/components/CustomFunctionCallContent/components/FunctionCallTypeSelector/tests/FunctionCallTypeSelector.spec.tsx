/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { ProposalVariant } from 'types/proposal';

import { getFormInitialValues } from 'astro_2.0/features/CreateProposal/helpers/initialValues';

import { FunctionCallTypeSelector } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/FunctionCallTypeSelector';

const formContextMock = {
  reset: () => 0,
  register: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(() => true),
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

jest.mock('astro_2.0/features/CreateProposal/helpers/initialValues', () => {
  return {
    getFormInitialValues: jest.fn(),
  };
});

jest.mock('context/AuthContext', () => {
  return {
    useAuthContext: () => ({
      accountId: '123',
    }),
  };
});

describe('FunctionCallTypeSelector', () => {
  it('Should change selected type', () => {
    const mock = jest.fn();

    // @ts-ignore
    getFormInitialValues.mockImplementation(mock);

    const { getByText } = render(<FunctionCallTypeSelector />);

    fireEvent.click(getByText('Custom'));
    fireEvent.click(getByText('Buy NFT from Mintbase'));

    expect(mock).toBeCalledWith(
      ProposalVariant.ProposeCustomFunctionCall,
      '123'
    );
  });
});

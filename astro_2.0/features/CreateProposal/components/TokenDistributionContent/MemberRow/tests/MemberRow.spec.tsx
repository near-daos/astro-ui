/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { useFormContext } from 'react-hook-form';
import { RenderResult } from '@testing-library/react';

import {
  MemberRow,
  MemberRowProps,
} from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/MemberRow';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  watch: () => ({
    members: [
      {
        name: 'M1',
        value: 10,
      },
    ],
  }),
  trigger: () => 0,
  setValue: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

describe('MemberRow', () => {
  function renderComponent(props?: Partial<MemberRowProps>): RenderResult {
    return render(
      <MemberRow
        name="M1"
        groupName="GR1"
        governanceToken={{
          name: 'tokenName',
          value: 10,
        }}
        totalDistributed={2}
        {...props}
      />
    );
  }

  it('Should render component', () => {
    const tokenName = 'Token1';

    const { getByText } = renderComponent({
      governanceToken: {
        name: tokenName,
        value: 10,
      },
    });

    expect(getByText(tokenName)).toBeTruthy();
  });

  it('Should process input with value < left', () => {
    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
    }));

    const { getByTestId } = renderComponent();

    fireEvent.change(getByTestId('mr-input'), {
      target: { value: '1' },
    });
  });

  it('Should process input with value > left', () => {
    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
    }));

    const { getByTestId } = renderComponent();

    fireEvent.change(getByTestId('mr-input'), {
      target: { value: '123' },
    });
  });
});

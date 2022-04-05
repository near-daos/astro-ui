/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { useFormContext } from 'react-hook-form';
import { RenderResult } from '@testing-library/react';

import {
  GroupRow,
  GroupRowProps,
} from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/GroupRow';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  watch: () => null,
  trigger: () => 0,
  setValue: () => 0,
  getValues: () => ({}),
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

describe('GroupRow', () => {
  function renderComponent(props?: Partial<GroupRowProps>): RenderResult {
    return render(
      <GroupRow
        name="GR1"
        numberOfMembers={1}
        members={['M1', 'M2']}
        governanceToken={{
          name: 'Token1',
          value: 10,
        }}
        totalDistributed={10}
        {...props}
      />
    );
  }

  it('Should update group "custom" field', () => {
    const setValue = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      setValue,
    }));

    const { getByText } = renderComponent();

    fireEvent.click(getByText('Custom'));

    expect(setValue).toBeCalledWith('groups.GR1', expect.anything());
  });

  it('Should handle value change', () => {
    const setValue = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      setValue,
    }));

    const { getByTestId } = renderComponent();

    fireEvent.change(getByTestId('gr-input'), {
      target: { value: '123' },
    });

    expect(setValue).toBeCalledWith('groups.GR1.groupTotal', 0, {
      shouldValidate: true,
    });
  });

  it('Should handle value change', () => {
    const setValue = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      setValue,
    }));

    const { getByTestId } = renderComponent({
      governanceToken: {
        name: 'Token1',
        value: 1,
      },
      totalDistributed: 0,
    });

    fireEvent.change(getByTestId('gr-input'), {
      target: { value: '1' },
    });

    expect(setValue).toBeCalledWith('groups.GR1.groupTotal', 1, {
      shouldValidate: true,
    });
  });
});

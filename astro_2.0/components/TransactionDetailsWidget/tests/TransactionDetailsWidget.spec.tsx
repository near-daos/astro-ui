/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
import { render } from 'jest/testUtils';
import { useFormContext } from 'react-hook-form';

import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget';

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => ({
      watch: () => 1,
      register: () => ({}),
      handleSubmit: (callback: () => void) => callback(),
      formState: {
        errors: {},
      },
    })),
  };
});

jest.mock('crypto', () => ({
  randomBytes: (num: number) => new Array(num).fill(0),
}));

describe('Transaction details widget', () => {
  it('Should render component', () => {
    const { container } = render(
      <TransactionDetailsWidget
        onSubmit={async () => {}}
        bond={{ value: '2' }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render warning', () => {
    const warning = 'This is my warning';

    const { getAllByText } = render(
      <TransactionDetailsWidget
        onSubmit={async () => {}}
        bond={{ value: '2' }}
        warning={warning}
      />
    );

    expect(getAllByText(warning)).toHaveLength(1);
  });

  it.each`
    gas              | width
    ${'1000000'}     | ${'7ch'}
    ${'10000000000'} | ${'8ch'}
  `(
    'Should render input of proper width depending on amount of gas',
    ({ gas, width }) => {
      // @ts-ignore
      useFormContext.mockImplementation(() => ({
        watch: () => gas,
        register: () => ({}),
        handleSubmit: (callback: () => void) => callback(),
        formState: {
          errors: {},
        },
      }));

      const { getByTestId } = render(
        <TransactionDetailsWidget
          onSubmit={async () => {}}
          bond={{ value: '2' }}
        />
      );

      const input = getByTestId('gas-input');

      expect(input.style.width).toEqual(width);
    }
  );
});

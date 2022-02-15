/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { Radio } from 'astro_2.0/components/inputs/radio/Radio';

import { useRadioContext } from 'astro_2.0/components/inputs/radio/Radio/hooks';

jest.mock('astro_2.0/components/inputs/radio/Radio/hooks', () => {
  return {
    useRadioContext: jest.fn(() => ({})),
  };
});

describe('Radio', () => {
  it('Should render component', () => {
    const { container } = render(<Radio value="Hello" label="World" />);

    expect(container).toMatchSnapshot();
  });

  it('Should call onChange', () => {
    const value = 'Hello';

    const onChange = jest.fn();

    // @ts-ignore
    useRadioContext.mockImplementation(() => ({
      onChange,
    }));

    const { getByRole } = render(<Radio value={value} label="World" />);

    fireEvent.click(getByRole('radio'));

    expect(onChange).toBeCalledWith(value, expect.anything());
  });
});
